// pages/api/froala/upload.js
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getUserFromAuthHeader } from "../../../../lib/auth";
import { supabase } from "../../../../lib/supabase";

export async function POST(req) {
  try {
    const userPayload = getUserFromAuthHeader(req);

    const formData = await req.formData();
    const file = formData.get("file"); // Froala sends file in "file" field

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueName = `${Date.now()}_${safeFileName}`;

    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(uniqueName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(uniqueName);

    // Save metadata in Prisma
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

    // Froala requires response with { link: "<url>" }
    return NextResponse.json({ link: publicUrl.publicUrl });
  } catch (err) {
    console.error("Froala upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
