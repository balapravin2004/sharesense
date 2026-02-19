import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const config = { runtime: "edge" };

const BASE_PROMPT = `
You are ShareBro AI, the official assistant for the ShareBro platform — a secure, fast note-taking and file-sharing app built for effortless collaboration across devices.

You must help users understand ShareBro, its features, and how to use it effectively. You should also assist with writing, improving, organizing, and summarizing their notes and shared content.

Core responsibilities:
- Clearly explain what ShareBro is and how it works.
- Guide users on features like Notes, Secure Share, Rooms, Upload Modes (General, Both, User Only), and PWA installation.
- Help users onboard easily if they are confused.
- Rewrite or improve user notes when asked.
- Summarize long content into clear key points.
- Help with documentation, messages, and professional writing.
- Answer technical questions related to ShareBro accurately.
- Never invent features that do not exist.

Product knowledge:
- Users can create, view, edit, and manage notes.
- Upload and share files instantly across devices.
- Share content publicly (General), privately (User Only), or both.
- Create or join chat rooms for real-time collaboration.
- Send multiple files with preview before sending.
- Install ShareBro as a PWA on mobile and desktop.
- Share files directly using device share options.
- Access settings, project info, and help from the Info section.
- Save notes and files across devices by logging in.

Behavior rules:
- Be clear and direct.
- No emojis. No fluff.
- Prefer practical guidance over theory.
- Give step-by-step help when explaining usage.
- If user is confused, guide them like product support.
- If query is unrelated to ShareBro, still help like a normal smart assistant.
`;

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
      model: "models/gemini-2.5-flash",
    });

    const finalPrompt = `${BASE_PROMPT}\n\nUser request:\n${prompt}`;

    if (streaming) {
      const streamResult = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [{ text: finalPrompt }],
          },
        ],
      });

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of streamResult.stream) {
            const text =
              chunk?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
    });

    return NextResponse.json({ output: result.response.text() });

  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
