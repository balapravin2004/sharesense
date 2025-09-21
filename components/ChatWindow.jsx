"use client";

import React, { useRef, useEffect } from "react";
import { ChatForm, ChatMessage } from "../components/index";

export default function ChatWindow({
  currentRoom,
  messages,
  localName,
  onLeave,
  onSendMessage,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, currentRoom]);

  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg overflow-hidden max-h-[80vh]">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3">
        <h2 className="font-bold text-lg">Room: {currentRoom}</h2>
        <button
          onClick={onLeave}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded shadow">
          Leave Room
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages[currentRoom]?.map((m, idx) => (
          <div
            key={idx}
            className={`${
              m.highlight
                ? "bg-yellow-100 text-yellow-900 font-semibold text-center py-1 rounded"
                : ""
            }`}>
            {!m.highlight ? (
              <ChatMessage
                sender={m.sender}
                message={m.message}
                isOwnMessage={m.sender === localName}
              />
            ) : (
              <p>{m.message}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-4 border-t bg-white">
        <ChatForm onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
