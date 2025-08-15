import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Get form data from Froala
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Make sure it is a file object
    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Create file path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // 4. Save file locally
    await writeFile(filePath, buffer);

    // 5. Return Froala-compatible JSON with full HTTPS URL
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${fileName}`;
    return NextResponse.json({ link: imageUrl }); // Froala expects { link: "URL" }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
