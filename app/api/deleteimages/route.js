// pages/api/deleteimages/route.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const userPayload = getUserFromAuthHeader(req);

    const { images } = await req.json(); // expecting an array of image objects from frontend
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const deletedImages = [];

    for (const img of images) {
      // img should have at least a `publicId` and `id`
      const { publicId, id } = img;

      if (!publicId || !id) continue;

      // Delete from Supabase Storage
      const { error: supaError } = await supabase.storage
        .from("uploads")
        .remove([publicId]);

      if (supaError) {
        console.error(`Supabase delete error for ${publicId}:`, supaError);
        continue; // skip to next
      }

      // Delete from Prisma DB
      await prisma.file.delete({
        where: { id },
      });

      deletedImages.push(id);
    }

    return NextResponse.json({
      success: true,
      deleted: deletedImages,
    });
  } catch (err) {
    console.error("Delete images error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete images" },
      { status: 500 }
    );
  }
}
