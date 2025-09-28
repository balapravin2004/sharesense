import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST handler to delete file
export async function POST(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file record from database
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Ensure publicId exists
    if (!file.publicId) {
      return NextResponse.json(
        { error: "Cloudinary public_id missing in DB" },
        { status: 400 }
      );
    }

    // Ensure resource_type exists
    const resourceType = file.resourceType || "raw"; // fallback for unknown types

    // Delete file from Cloudinary
    const cloudRes = await cloudinary.uploader.destroy(file.publicId, {
      resource_type: resourceType,
    });

    if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
      console.error("Cloudinary delete response:", cloudRes);
      return NextResponse.json(
        { error: "Failed to delete file from Cloudinary" },
        { status: 500 }
      );
    }

    // Delete file from database
    const deletedFile = await prisma.file.delete({ where: { id } });

    return NextResponse.json(
      { success: true, file: deletedFile },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
