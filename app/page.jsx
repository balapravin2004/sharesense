"use client";
import React, { useState, useRef } from "react";
import EditorsSection from "../components/EditorsSection";
import FilesTable from "../components/FilesTable";
import { GeminiButton } from "../components";

export default function Page() {
  const [files] = useState([
    { id: 1, name: "report.pdf", size: "2 MB", time: "2025-08-10 10:15" },
    { id: 2, name: "image.png", size: "1.2 MB", time: "2025-08-09 18:32" },
    { id: 3, name: "notes.docx", size: "900 KB", time: "2025-08-08 14:50" },
  ]);

  const [showGemini, setShowGemini] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef("");

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: prompt }]);
    setPrompt("");

    // Show thinking bubble
    setMessages((prev) => [...prev, { from: "bot", typing: true }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, streaming: false }),
      });
      const data = await res.json();

      // Remove typing bubble & add bot reply
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.typing);
        return [
          ...withoutTyping,
          { from: "bot", text: data.output || data.error },
        ];
      });
    } catch (err) {
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.typing);
        return [
          ...withoutTyping,
          { from: "bot", text: "Error: Failed to get a response." },
        ];
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col p-4 z-[100] lg:p-8 h-full bg-gray-50 overflow-x-hidden justify-center items-center">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <EditorsSection />
        <FilesTable files={files} />
      </div>

      {/* Gemini Chat Open Button */}
      <GeminiButton setShowGemini={setShowGemini} />

      {/* Gemini Chat Modal */}
      {showGemini && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[200] p-2">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gemini Chat</h2>
              <button onClick={() => setShowGemini(false)} className="text-xl">
                ✖
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow break-words whitespace-pre-wrap
                      ${
                        m.from === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}>
                    {m.typing ? (
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white flex gap-2 border-t">
              <textarea
                value={prompt}
                className="flex-1 border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={1}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                disabled={loading}
                onClick={sendPrompt}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
