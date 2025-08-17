// app/api/deleteimages/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    let deletedCount = 0;

    for (const imgUrl of images) {
      try {
        // 1. Extract public_id from URL
        // Example: https://res.cloudinary.com/demo/image/upload/v12345/folder/abc123.jpg
        const parts = imgUrl.split("/");
        const fileWithExt = parts.pop(); // abc123.jpg
        const folderPath = parts.slice(7).join("/"); // folder/... after "upload/"
        const publicId = `${folderPath}/${fileWithExt.split(".")[0]}`;

        // 2. Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // 3. Delete from Prisma DB
        await prisma.file.deleteMany({
          where: { url: imgUrl },
        });

        deletedCount++;
      } catch (err) {
        console.error("Error deleting:", imgUrl, err);
      }
    }

    return NextResponse.json({ success: true, deleted: deletedCount });
  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
