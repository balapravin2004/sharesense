// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // ensure Node runtime for Buffer/streams

// ----- Cloudinary config (from environment) -----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reuse Prisma client
const prisma = new PrismaClient();

// Helper: upload a Buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = "sharesense/uploads") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" }, // auto handles images, pdfs, docs, etc.
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    // 1) Read multipart form-data
    const formData = await req.formData();
    const files = formData.getAll("file"); // <-- multiple files
    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    let uploadedFiles = [];

    // 2) Loop through all files
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const upload = await uploadBufferToCloudinary(buffer);

      const secureUrl = upload.secure_url;
      const bytes = upload.bytes ?? buffer.length;
      const format = upload.format ? `image/${upload.format}` : file.type || "file";
      const originalName = file.name || upload.original_filename || "file";

      // Save to DB
      await prisma.file.create({
        data: {
          filename: originalName,
          mimeType: format,
          size: bytes,
          url: secureUrl,
          uploadedById: null, // update if you use auth
          isAnonymous: true,
        },
      });

      uploadedFiles.push({ url: secureUrl, name: originalName, size: bytes });
    }

    // 3) Return all uploaded files
    return NextResponse.json({ links: uploadedFiles }, { status: 200 });

  } catch (error) {
    console.error("Upload error details:", error);

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: error.message || "Upload failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
