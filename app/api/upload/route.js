import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import prisma from "../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../lib/auth";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST handler
export async function POST(req) {
  try {
    // Extract user (may be null if not authenticated)
    const userPayload = getUserFromAuthHeader(req);

    // Parse form data
    const formData = await req.formData();
    const files = formData.getAll("files"); // "files" must match frontend .append("files", file)

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const saved = [];
    for (const file of files) {
      // Convert to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "raw", // <-- change from "auto" to "raw"
            public_id: `uploads/${Date.now()}_${file.name}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // Save in DB (Prisma) and store public_id
      const created = await prisma.file.create({
        data: {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: buffer.length,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id, // <-- store public_id
          uploadedById: userPayload?.id || null,
        },
      });

      saved.push({
        id: created.id,
        filename: created.filename,
        mimeType: created.mimeType,
        size: created.size,
        url: created.url,
        publicId: created.publicId,
        createdAt: created.createdAt,
      });
    }

    return NextResponse.json({ files: saved });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
