"use client";

import React, { useState } from "react";

const ChatForm = ({ onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Send
      </button>
    </form>
  );
};

export default ChatForm;
