// app/api/notes/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content || content.trim() === "") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    const note = await prisma.note.create({
      data: {
        content,
      },
    });

    return new Response(JSON.stringify(note), { status: 201 });
  } catch (error) {
    console.error("Error saving note:", error);
    return new Response(JSON.stringify({ error: "Failed to save note" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const lastNote = await prisma.note.findFirst({
      orderBy: { timing: "desc" },
    });

    if (!lastNote) {
      return new Response(JSON.stringify({ error: "No notes found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(lastNote), { status: 200 });
  } catch (error) {
    console.error("Error fetching note:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch note" }), {
      status: 500,
    });
  }
}
