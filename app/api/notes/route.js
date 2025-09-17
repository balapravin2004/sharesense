import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming payload:", body);

    const { content, mode: rawMode, userId, userName } = body;

    if (!content || !content.trim()) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    // Decide the real mode
    const effectiveMode =
      !userId || rawMode === "general" ? "general" : rawMode;

    // Prepare note data
    let noteData = { content };

    if (effectiveMode === "general") {
      noteData.isGlobal = false; // or true if you want it visible to all
    } else if (effectiveMode === "user") {
      noteData.isGlobal = false;
      noteData.authorName = userName ?? null;
      noteData.author = { connect: { id: userId } };
    } else if (effectiveMode === "both") {
      noteData.isGlobal = true;
      noteData.authorName = userName ?? null;
      noteData.author = { connect: { id: userId } };
    }

    const note = await prisma.note.create({ data: noteData });
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
