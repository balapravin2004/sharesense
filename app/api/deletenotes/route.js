import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { ids } = await req.json();
    console.log("Incoming ids:", ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids (array) is required" },
        { status: 400 }
      );
    }

    // ✅ Delete multiple notes
    const deletedNotes = await prisma.note.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true, deleted: deletedNotes });
  } catch (error) {
    console.error("DeleteMultipleNotes API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
