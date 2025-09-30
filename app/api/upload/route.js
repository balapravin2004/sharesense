import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const userPayload = getUserFromAuthHeader(req); // may be null for PWA shares

    const formData = await req.formData();

    // Get all files regardless of field name
    const files = [];
    for (const entry of formData.values()) {
      if (entry instanceof File) files.push(entry);
    }

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const saved = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const uniqueName = `${Date.now()}_${safeFileName}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(uniqueName, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("uploads")
        .getPublicUrl(uniqueName);

      const created = await prisma.file.create({
        data: {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: buffer.length,
          url: publicUrl.publicUrl,
          publicId: uniqueName,
          uploadedById: userPayload?.id || null,
        },
      });

      saved.push({
        id: created.id,
        filename: created.filename,
        mimeType: created.mimeType,
        size: created.size,
        url: created.url,
        publicId: created.publicId,
        createdAt: created.createdAt,
      });
    }

    return NextResponse.json({ files: saved });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
