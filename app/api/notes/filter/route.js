// app/api/notes/filter/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Filter payload:", body);

    const { mode } = body;

    let where = {};

    if (mode === "general") {
      // Notes with no author
      where = { authorId: null, isGlobal: false };
    } else if (mode === "user") {
      // Notes with authorId not null and isGlobal = false
      where = { authorId: { not: null }, isGlobal: false };
    } else if (mode === "both") {
      // Notes with authorId not null and isGlobal = true
      where = { authorId: { not: null }, isGlobal: true };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { timing: "desc" },
    });

    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error("Error filtering notes:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to fetch filtered notes",
      }),
      { status: 500 }
    );
  }
}
