import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET() {
  const files = await utapi.listFiles();

  return new Response(JSON.stringify({ files }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
