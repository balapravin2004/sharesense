import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const note = await prisma.note.findUnique({
      where: { id: id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("AutoSave API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
