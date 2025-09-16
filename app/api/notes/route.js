import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming payload:", body);

    const { content, mode, userId, userName } = body;

    if (!content || !content.trim()) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    // Prepare note data
    const noteData = {
      content,
      isGlobal: mode === "general" || mode === "both",
      authorName: userName || null,
      author: userId ? { connect: { id: userId } } : undefined,
    };

    if (mode === "user" && !userId) {
      return new Response(JSON.stringify({ error: "User must be logged in" }), {
        status: 400,
      });
    }

    const note = await prisma.note.create({
      data: noteData,
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
