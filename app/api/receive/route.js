import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lastNote = await prisma.note.findFirst({
      where: {
        authorId: null,
      },
      orderBy: {
        timing: "desc",
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!lastNote) {
      return NextResponse.json(
        { error: "No matching note found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lastNote, { status: 200 });
  } catch (error) {
    console.error("Error fetching last note:", error);
    return NextResponse.json(
      { error: "Failed to fetch last note" },
      { status: 500 }
    );
  }
}
