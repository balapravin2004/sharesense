
"use client";

import React from "react";

const ChatMessage = ({ sender, message, isOwnMessage }) => {
  return (
    <div
      className={`flex flex-col mb-2 ${
        isOwnMessage ? "items-end" : "items-start"
      }`}>
      {!isOwnMessage && <span className="text-xs text-gray-500">{sender}</span>}
      <div
        className={`px-3 py-2 rounded-lg max-w-xs break-words ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
