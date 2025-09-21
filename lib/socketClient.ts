"use client";

import { io } from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = io(SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

// optional for debugging
socket.onAny((event, ...args) => {
  console.log("📡 Event received:", event, args);
});
