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
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [room?.messages]);

  if (!room) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg text-center text-gray-500 border border-gray-200">
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
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-xs opacity-80">{room.desc}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/join/${room.id}`;
              navigator.clipboard.writeText(url);
              alert("Invite link copied");
            }}
            className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition">
            Copy Invite
          </button>
          <button
            onClick={onLeave}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition">
            Leave
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
        style={{ minHeight: 200 }}>
        {room.messages.length === 0 && (
          <div className="text-center text-xs text-gray-400">
            No messages yet
          </div>
        )}
        {room.messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
              m.user === "You"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white border border-gray-200"
            }`}>
            <div
              className={`text-xs ${
                m.user === "You" ? "text-blue-100" : "text-gray-500"
              }`}>
              {m.user} • {formatTime(m.time)}
            </div>
            <div className="mt-1 text-sm">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Files list */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <h4 className="text-sm font-medium mb-3 text-gray-700">Files</h4>
        <div className="space-y-2">
          {room.files.length === 0 && (
            <div className="text-xs text-gray-400">No files uploaded</div>
          )}
          {room.files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 shadow-sm border border-gray-200 transition">
              <div>
                <div className="text-sm font-medium">{f.name}</div>
                <div className="text-xs text-gray-500">
                  {f.size} • {formatTime(f.time)}
                </div>
              </div>
              <button
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                onClick={() => alert(`Download ${f.name} (demo)`)}>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="flex gap-2 items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <label className="bg-gray-100 px-3 py-2 rounded-lg cursor-pointer text-sm border border-gray-300 hover:bg-gray-200 transition">
          <input type="file" className="hidden" onChange={handleFileChange} />
          Attach
        </label>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm transition">
          Send
        </button>
      </div>
    </div>
  );
}

export default function MakeRoomPage() {
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
    <div className="p-4 min-h-screen bg-gray-50 mb-[3rem]">
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
        <div className="flex flex-col gap-4 max-h-[80vh]">
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
