import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

// Upload folder inside project root
const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure uploads folder exists
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// POST handler
export async function POST(req) {
  try {
    // Get authenticated user (if any)
    const userPayload = getUserFromAuthHeader(req);

    // Parse form data
    const formData = await req.formData();
    const files = formData.getAll("files"); // match frontend .append("files", file)

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    await ensureUploadDir();

    const saved = [];
    for (const file of files) {
      // Convert to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Unique filename to avoid collisions
      const uniqueName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Save file locally
      await fs.writeFile(filePath, buffer);

      // Save file info in DB
      const created = await prisma.file.create({
        data: {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: buffer.length,
          url: `/uploads/${uniqueName}`, // relative URL for frontend
          publicId: uniqueName, // can use as unique identifier
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
