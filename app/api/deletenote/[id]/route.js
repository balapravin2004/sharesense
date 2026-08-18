import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function DELETE(request, context) {
  const { id } = await context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid note ID" }), {
      status: 400,
    });
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
      });
    }

    await prisma.note.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Note deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
