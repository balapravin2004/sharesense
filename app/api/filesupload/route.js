// app/api/filesupload/route.js
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // input name="file"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to uploadedfiles folder
    const uploadDir = path.join(process.cwd(), "uploadedfiles");
    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      message: "File uploaded successfully",
      filename: file.name,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
