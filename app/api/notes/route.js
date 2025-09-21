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

    let note;

    if (effectiveMode === "general") {
      note = await prisma.note.create({
        data: { content, isGlobal: false, authorName: userName ?? null },
      });
    } else if (effectiveMode === "user") {
      note = await prisma.note.create({
        data: {
          content,
          isGlobal: false,
          authorName: userName ?? null,
          author: { connect: { id: userId } },
        },
      });
    } else if (effectiveMode === "both") {
      // Create one global (with author id) + one user-specific (without author id)
      const [globalNote, userNote] = await Promise.all([
        prisma.note.create({
          data: {
            content,
            isGlobal: true,
            authorName: userName ?? null,
            author: { connect: { id: userId } }, // keep author id here
          },
        }),
        prisma.note.create({
          data: {
            content,
            isGlobal: false,
            authorName: userName ?? null,
            // ❌ no author relation (empty authorId)
          },
        }),
      ]);
      note = { globalNote, userNote };
    }

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
