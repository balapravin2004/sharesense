// pages/api/deletefile/[id].js
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../../lib/auth";
import { supabase } from "../../../../lib/supabase";

export async function POST(req, { params }) {
  try {
    const user = getUserFromAuthHeader(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Find file in DB
    const file = await prisma.file.findUnique({
      where: { id: id }, // assuming your Prisma model `id` is string (UUID)
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from Supabase storage
    if (file.publicId) {
      const { error: storageError } = await supabase.storage
        .from("uploads")
        .remove([file.publicId]);

      if (storageError) {
        console.error("Supabase deletion error:", storageError);
        return NextResponse.json(
          { error: "Failed to delete file from storage" },
          { status: 500 }
        );
      }
    }

    // Delete from database
    await prisma.file.delete({ where: { id: id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
