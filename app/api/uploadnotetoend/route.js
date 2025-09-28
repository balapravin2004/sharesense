import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { noteId, filterMode } = await req.json();

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    let note;

    if (filterMode === "general") {
      // ✅ Just update timing
      note = await prisma.note.update({
        where: { id: noteId },
        data: { timing: new Date() },
      });
    } else if (filterMode === "user") {
      // ✅ Update timing + create a user-specific copy (no userId/username)
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { timing: new Date() },
      });

      const userNote = await prisma.note.create({
        data: {
          content: updatedNote.content,
          isGlobal: false,
        },
      });

      note = { updatedNote, userNote };
    } else if (filterMode === "both") {
      // ✅ Update timing + create both copies
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: { timing: new Date() },
      });

      const [globalNote, userNote] = await Promise.all([
        prisma.note.create({
          data: {
            content: updatedNote.content,
            isGlobal: true,
          },
        }),
        prisma.note.create({
          data: {
            content: updatedNote.content,
            isGlobal: false,
          },
        }),
      ]);

      note = { updatedNote, globalNote, userNote };
    }

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("UploadNoteToEnd API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
