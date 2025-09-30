"use client";

import React, { useState } from "react";

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
      // read file as ArrayBuffer
      const buffer = await file.arrayBuffer();
      onSendMessage({
        file: {
          filename: file.name,
          mime: file.type || "application/octet-stream",
          size: file.size,
          buffer, // ArrayBuffer
        },
        text: text?.trim() ? text.trim() : undefined,
      });

      // reset file & text
      setFile(null);
      setText("");
      // reset file input value (by clearing the input via DOM)
      document.getElementById("chat-file-input").value = "";
      return;
    }

    // only text
    onSendMessage({ text: text.trim() });
    setText("");
  };

  const cancelFile = () => {
    setFile(null);
    document.getElementById("chat-file-input").value = "";
  };

  return (
    <form
      className="flex flex-col md:flex-row items-stretch gap-2"
      onSubmit={send}>
      <div className="flex-1 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border px-3 py-2 rounded focus:ring focus:ring-blue-300"
        />

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            id="chat-file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="px-3 py-2 rounded border hover:bg-gray-100">
            Attach
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {file && (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
            <div className="text-sm">{file.name}</div>
            <button
              type="button"
              onClick={cancelFile}
              className="text-sm text-red-500 px-2">
              ✕
            </button>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
          Send
        </button>
      </div>
    </form>
  );
}
