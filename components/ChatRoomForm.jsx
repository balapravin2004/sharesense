"use client";

import React from "react";

export default function ChatRoomForm({
  localName,
  setLocalName,
  roomInput,
  setRoomInput,
  onJoin,
}) {
  return (
    <div className="flex flex-col gap-4 max-w-[98vw]">
      <input
        type="text"
        placeholder="Enter your name"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        className="border px-3 py-2 rounded focus:ring focus:ring-blue-300 w-full"
      />
      <input
        type="text"
        placeholder="Room name"
        value={roomInput}
        onChange={(e) => setRoomInput(e.target.value)}
        className="border px-3 py-2 rounded focus:ring focus:ring-blue-300 w-full"
      />
      <button
        onClick={onJoin}
        className="sidebar-gradient text-white font-semibold py-2 shadow w-full rounded-md">
        Join Room
      </button>
    </div>
  );
}
