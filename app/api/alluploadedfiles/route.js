// pages/api/files.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ files });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch files" });
  }
}
