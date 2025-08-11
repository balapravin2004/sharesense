"use client";

import React, { useState, useRef, useEffect } from "react";

/**
 * MakeRoomPage (client-only demo)
 * - Create rooms (name, desc, privacy)
 * - Room cards responsive grid
 * - Join room: shows Chat + File list on right (desktop) or below (mobile)
 *
 * Replace local logic with your API/WebSocket for production realtime features.
 */

function formatTime(ts = Date.now()) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function CreateRoomForm({ onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a room name.");
    const newRoom = {
      id: `room-${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      isPrivate,
      password: isPrivate ? password : "",
      createdAt: Date.now(),
      files: [],
      messages: [],
    };
    onCreate(newRoom);
    setName("");
    setDesc("");
    setIsPrivate(false);
    setPassword("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md w-full"
      aria-label="Create room">
      <h3 className="text-lg font-semibold mb-3">Create a new room</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Room name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Design Reviews"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Private</label>
          <div className="mt-1 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Requires password</span>
            </label>
          </div>
          {isPrivate && (
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Room password"
              required
            />
          )}
        </div>
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Optional short description"
          rows={2}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg shadow hover:opacity-95">
          Create Room
        </button>
      </div>
    </form>
  );
}

function RoomCard({ room, onJoin, onDelete, onCopy }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold">{room.name}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {room.desc || "No description"}
          </p>
          <div className="mt-2 text-xs text-gray-400">
            <span>Created: {formatTime(room.createdAt)}</span>
            {room.isPrivate && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                Private
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onJoin(room)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
            Join
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onCopy(room)}
              className="px-2 py-1 bg-gray-100 rounded text-xs"
              title="Copy invite link">
              Copy
            </button>
            <button
              onClick={() => onDelete(room.id)}
              className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs"
              title="Delete room">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomsList({ rooms, onJoin, onDelete, onCopy }) {
  if (!rooms.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
        No rooms yet — create one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rooms.map((r) => (
        <RoomCard
          key={r.id}
          room={r}
          onJoin={onJoin}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}

function ChatPanel({ room, onSendMessage, onUploadFile, onLeave }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messages change
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [room?.messages]);

  if (!room) {
    return (
      <div className="bg-white rounded-xl p-4 shadow text-center text-gray-500">
        Join a room to chat and share files.
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(room.id, {
      id: `m-${Date.now()}`,
      text: message.trim(),
      time: Date.now(),
      user: "You",
    });
    setMessage("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fileMeta = {
      id: `f-${Date.now()}`,
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
      time: Date.now(),
    };
    onUploadFile(room.id, fileMeta);
    e.target.value = null;
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-xs text-gray-500">{room.desc}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/join/${room.id}`;
              navigator.clipboard.writeText(url);
              alert("Invite link copied");
            }}
            className="px-3 py-1 text-xs bg-gray-100 rounded">
            Copy invite
          </button>
          <button
            onClick={() => onLeave()}
            className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded">
            Leave
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded-lg space-y-3 mb-3"
        style={{ minHeight: 200 }}>
        {room.messages.length === 0 && (
          <div className="text-center text-xs text-gray-400">
            No messages yet
          </div>
        )}
        {room.messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${
              m.user === "You" ? "bg-blue-50 self-end" : "bg-white"
            }`}>
            <div className="text-xs text-gray-500">
              {m.user} • {formatTime(m.time)}
            </div>
            <div className="mt-1 text-sm text-gray-900">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Files list */}
      <div className="mb-3">
        <h4 className="text-sm font-medium mb-2">Files</h4>
        <div className="space-y-2">
          {room.files.length === 0 && (
            <div className="text-xs text-gray-400">No files uploaded</div>
          )}
          {room.files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-white rounded p-2 shadow-sm">
              <div>
                <div className="text-sm font-medium">{f.name}</div>
                <div className="text-xs text-gray-500">
                  {f.size} • {formatTime(f.time)}
                </div>
              </div>
              <div>
                <button
                  className="px-2 py-1 bg-gray-100 rounded text-xs"
                  onClick={() => alert(`Download ${f.name} (demo)`)}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="flex gap-2 items-center">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <label className="bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm">
          <input type="file" className="hidden" onChange={handleFileChange} />
          Attach
        </label>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default function page() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // create demo initial rooms (once)
  useEffect(() => {
    if (rooms.length === 0) {
      setRooms([
        {
          id: "room-1",
          name: "General",
          desc: "General chat and file sharing",
          isPrivate: false,
          password: "",
          createdAt: Date.now() - 1000 * 60 * 60,
          files: [],
          messages: [
            {
              id: "m1",
              text: "Welcome to General!",
              time: Date.now() - 5000,
              user: "System",
            },
          ],
        },
      ]);
    }
  }, []);

  function handleCreate(room) {
    setRooms((prev) => [room, ...prev]);
    setSelectedRoomId(room.id);
  }

  function handleDelete(id) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (selectedRoomId === id) setSelectedRoomId(null);
  }

  function handleCopy(room) {
    const url = `${window.location.origin}/join/${room.id}`;
    navigator.clipboard.writeText(url);
    alert("Invite copied!");
  }

  function handleJoin(room) {
    // if private, prompt for password (demo)
    if (room.isPrivate) {
      const pw = prompt("Enter room password");
      if (pw !== room.password) {
        alert("Incorrect password");
        return;
      }
    }
    setSelectedRoomId(room.id);
  }

  function handleLeave() {
    setSelectedRoomId(null);
  }

  function handleSendMessage(roomId, message) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, messages: [...r.messages, message] } : r
      )
    );
  }

  function handleUploadFile(roomId, fileMeta) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, files: [fileMeta, ...r.files] } : r
      )
    );
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="p-4 h-full bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Create + Rooms list (span 2 on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <CreateRoomForm onCreate={handleCreate} />

          <div>
            <h3 className="text-lg font-semibold mb-3">Rooms</h3>
            <RoomsList
              rooms={rooms}
              onJoin={handleJoin}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          </div>
        </div>

        {/* Right column: Chat / Files */}
        <div className="flex flex-col gap-4">
          <ChatPanel
            room={selectedRoom}
            onSendMessage={handleSendMessage}
            onUploadFile={handleUploadFile}
            onLeave={handleLeave}
          />
        </div>
      </div>
    </div>
  );
}
