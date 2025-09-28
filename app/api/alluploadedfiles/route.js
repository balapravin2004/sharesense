// app/api/files/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (err) {
    console.error("Fetch files error:", err);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
