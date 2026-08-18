// pages/api/allimages/route.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req) {
  try {
    // Fetch all files that are images
    const images = await prisma.file.findMany({
      where: {
        mimeType: {
          startsWith: "image/", // filter only image files
        },
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ images });
  } catch (err) {
    console.error("Fetch images error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}
