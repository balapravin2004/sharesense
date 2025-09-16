"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import parse from "html-react-parser";

const GeminiChatBot = () => {
  const [showGemini, setShowGemini] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: prompt }]);
    setPrompt("");

    setMessages((prev) => [...prev, { from: "bot", typing: true }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, streaming: false }),
      });
      const data = await res.json();

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
    <div>
      {/* Desktop Open Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-[300]">
        <motion.button
          onClick={() => setShowGemini(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg">
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {showGemini && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-6 right-6 z-[300] flex flex-col rounded-2xl shadow-2xl bg-white overflow-hidden
              ${
                fullscreen
                  ? "w-[97vw] h-[97vh] bottom-0 right-0 rounded-xl"
                  : "w-80 h-[500px] md:w-96"
              }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Gemini Chat</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="hover:text-gray-300 transition">
                  {fullscreen ? "🗗" : "🗖"}
                </button>
                <button
                  onClick={() => {
                    setFullscreen(false);
                    setShowGemini(false);
                  }}
                  className="hover:text-gray-300 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow break-words whitespace-pre-wrap ${
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
                      parse(m.text) // ✅ render Gemini's HTML/markup safely
                    )}
                  </div>
                </motion.div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeminiChatBot;
