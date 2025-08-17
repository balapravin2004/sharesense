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
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    // 1) Read the multipart form-data from Froala
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2) Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) Upload to Cloudinary
    const upload = await uploadBufferToCloudinary(buffer);
    const secureUrl = upload.secure_url; // CDN URL
    const bytes = upload.bytes ?? buffer.length;
    const format = upload.format
      ? `image/${upload.format}`
      : file.type || "image";
    const originalName = file.name || upload.original_filename || "image";

    // 4) Save record to DB (File model)
    // If you have auth, set uploadedById and isAnonymous=false accordingly.
    await prisma.file.create({
      data: {
        filename: originalName,
        mimeType: format,
        size: bytes,
        url: secureUrl, // <-- Cloudinary CDN URL saved here
        uploadedById: null, // set user id if available
        isAnonymous: true, // flip if you attach a user
      },
    });

    // 5) Return Froala-compatible response
    return NextResponse.json({ link: secureUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
