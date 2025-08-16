import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Path to the uploads folder
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // 2. Read all files in uploads folder
    const files = await readdir(uploadDir);

    // 3. Convert to public URLs
    const images = files.map((file) => {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${file}`;
    });

    // 4. Return list of image URLs
    return NextResponse.json({ images });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
