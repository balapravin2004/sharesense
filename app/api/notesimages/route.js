// app/api/notesimages/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all file records (only images)
    const files = await prisma.file.findMany({
      where: {
        mimeType: { startsWith: "image/" }, // only images
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Extract the Cloudinary URLs
    const imageUrls = files.map((f) => f.url);

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}
