"use client";

import React, { useRef, useEffect } from "react";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

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

  const roomMessages = messages[currentRoom] || [];

  return (
    <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg overflow-hidden h-full mb-[2rem] md:m-auto">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 h-[10rem] ">
        {roomMessages.map((m, idx) => (
          <div key={idx} className="">
            <ChatMessage
              sender={m.sender}
              message={m.message}
              file={m.file}
              isOwnMessage={m.sender === localName}
            />
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
