import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

// POST handler to delete a file
export async function POST(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Find file record in DB
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete file from public/uploads
    if (file.url) {
      const filePath = path.join(process.cwd(), "public", file.url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("File already deleted or not found locally:", err.message);
      }
    }

    // Delete file record from DB
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
