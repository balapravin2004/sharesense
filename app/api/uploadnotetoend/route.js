import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { noteId } = await req.json();

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    // Update the note timing to "now"
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { timing: new Date() },
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("UploadNoteToEnd API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
