"use client";

import React, { useEffect, useState } from "react";
import { ChatForm, ChatMessage } from "../../components";
import { socket } from "../../lib/socketClient";

const Page = () => {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");

  // send message
  const handleSendMessage = (msg) => {
    const newMsg = {
      sender: userName || "Anonymous",
      message: msg,
      isOwnMessage: true,
    };

    // show locally
    setMessages((prev) => [...prev, newMsg]);

    // send to server
    socket.emit("message", { room, ...newMsg });
  };

  useEffect(() => {
    // system: when someone joins
    socket.on("user_joined", (username) => {
      setMessages((prev) => [
        ...prev,
        { sender: "system", message: `${username} joined the room` },
      ]);
    });

    // user message from server
    socket.on("message", (data) => {
      setMessages((prev) => [
        ...prev,
        { sender: data.sender, message: data.message, isOwnMessage: false },
      ]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  // join room
  const handleJoinRoom = () => {
    if (!room || !userName) return;
    console.log("→ emitting join-room", { room, username: userName });
    socket.emit("join-room", { room, username: userName }, (ack) => {
      console.log("← join-room ack:", ack);
    });
    setJoined(true);
  };

  return (
    <div className="w-full p-4 border bg-white h-[90vh]">
      {!joined ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-green-500 text-white px-4 py-2 rounded">
            Join Room
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-[400px]">
          {/* Show room name */}
          <div className="text-center font-semibold text-lg mb-2">
            Room: <span className="text-blue-600">{room}</span>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto border p-2 mb-2 rounded bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">
                No messages yet. Start chatting!
              </p>
            ) : (
              messages.map((m, idx) => (
                <ChatMessage
                  key={idx}
                  sender={m.sender}
                  message={m.message}
                  isOwnMessage={m.sender === userName}
                />
              ))
            )}
          </div>

          {/* Chat input form */}
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default Page;
