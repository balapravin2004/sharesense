"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiArtificialIntelligence } from "react-icons/gi";
import { CgMaximizeAlt } from "react-icons/cg";
import { TbArrowsMinimize } from "react-icons/tb";
import { TbWindowMinimize } from "react-icons/tb"

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
          <GiArtificialIntelligence className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Mobile Open Button */}
      <div className="md:hidden fixed bottom-[4rem] right-[-1.1rem] z-[300]">
        <motion.button
          onClick={() => setShowGemini(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg">
          <GiArtificialIntelligence className="w-6 h-6" />
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
            className={`fixed z-[300] flex flex-col bg-white overflow-hidden shadow-2xl
            rounded-2xl
            bottom-4 right-4
            w-[90vw] h-[90vh]
            sm:w-[85vw] sm:h-[85vh]
            md:bottom-6 md:right-6 md:w-96 md:h-[500px]
            ${fullscreen ? "w-[95vw] h-[95vh] md:w-[85vw] md:h-[95vh]" : ""}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">ShareBro Chat</h2>
              <div className="flex gap-2">
                {/* Fullscreen toggle only for desktop */}
                {window.innerWidth >= 768 && (
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="hover:text-gray-300 transition">
                    {fullscreen ? <TbArrowsMinimize /> : <CgMaximizeAlt />}
                  </button>
                )}
                <button
                  onClick={() => {
                    setFullscreen(false);
                    setShowGemini(false);
                  }}
                  className="hover:text-gray-300 transition">
                  <TbWindowMinimize className="w-5 h-5" />
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
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              return !inline ? (
                                <pre className="bg-gray-800 text-white p-2 rounded-lg overflow-x-auto">
                                  <code {...props}>{children}</code>
                                </pre>
                              ) : (
                                <code
                                  className="bg-gray-100 px-1 rounded"
                                  {...props}>
                                  {children}
                                </code>
                              );
                            },
                            a({ node, ...props }) {
                              return (
                                <a
                                  {...props}
                                  className="text-blue-600 underline hover:text-blue-800"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              );
                            },
                          }}>
                          {m.text}
                        </ReactMarkdown>
                      </div>
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
