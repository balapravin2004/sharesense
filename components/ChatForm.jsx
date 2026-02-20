"use client";

import React, { useState } from "react";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";

/**
 * onSendMessage(payload)
 * payload: { text?: string, file?: { filename, mime, size, buffer } }
 */
export default function ChatForm({ onSendMessage }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const send = async (e) => {
    e?.preventDefault();
    if (!text.trim() && !file) return;

    if (file) {
      const buffer = await file.arrayBuffer();
      onSendMessage({
        file: {
          filename: file.name,
          mime: file.type || "application/octet-stream",
          size: file.size,
          buffer,
        },
        text: text?.trim() ? text.trim() : undefined,
      });
      setFile(null);
      setText("");
      document.getElementById("chat-file-input").value = "";
      return;
    }

    onSendMessage({ text: text.trim() });
    setText("");
  };

  const cancelFile = () => {
    setFile(null);
    document.getElementById("chat-file-input").value = "";
  };

  return (
    <form
      onSubmit={send}
      className="flex items-center gap-2 p-3 bg-white border-t w-full">
      {/* Input + file attachment + preview */}
      <div className="flex items-center flex-1 gap-2 min-w-0 relative">
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0 truncate"
        />

        {/* File attachment */}
        <label className="inline-flex items-center cursor-pointer">
          <input
            id="chat-file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiPaperclip size={22} />
          </span>
        </label>

        {/* File preview (absolute inside input area) */}
        {file && (
          <div className="absolute left-2 bottom-12 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full max-w-[200px] truncate shadow-md">
            <div className="text-sm truncate">{file.name}</div>
            <button
              type="button"
              onClick={cancelFile}
              className="text-red-500 p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Send button */}
      <button
        type="submit"
        className="ml-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white p-3 rounded-full flex items-center justify-center flex-shrink-0">
        <FiSend size={22} />
      </button>
    </form>
  );
}
