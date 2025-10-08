import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const config = { runtime: "edge" };

export async function POST(req) {
  try {
    const { prompt, streaming } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API Key" },
        { status: 500 }
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "models/gemini-2.5-flash", // ✅ update this line
    });

    if (streaming) {
      const streamResult = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of streamResult.stream) {
            const textPart =
              chunk?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            controller.enqueue(encoder.encode(textPart));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } else {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const text = result.response.text();
      return NextResponse.json({ output: text });
    }
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
