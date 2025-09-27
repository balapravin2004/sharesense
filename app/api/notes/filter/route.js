import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/notes/filter
 * Body: { mode: "general" | "user" | "both", userId?: string }
 */
export async function POST(req) {
  try {
    const { mode, userId } = await req.json();
    console.log("Filter payload:", { mode, userId });

    let where = {};

    switch (mode) {
      case "general":
        where = { isGlobal: false, authorId: null };
        break;

      case "user":
        // Only this user's private notes
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "userId required for user mode" }),
            { status: 400 }
          );
        }
        where = {
          isGlobal: false,
          authorId: userId,
          authorName: { not: null },
        };
        break;

      case "both":
        // User’s global notes (isGlobal = true)
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "userId required for both mode" }),
            { status: 400 }
          );
        }
        where = {
          isGlobal: true,
          authorId: userId,
          authorName: { not: null },
        };
        break;

      default:
        // Default to general notes
        where = { isGlobal: false, authorId: null };
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
