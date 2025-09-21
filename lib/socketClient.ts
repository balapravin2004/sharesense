"use client";

import { io } from "socket.io-client";

// connect explicitly to backend
export const socket = io("http://localhost:3000", {
  transports: ["websocket"], // force websocket to avoid polling 404
  withCredentials: true,
});

// log when connected
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

// handle errors
socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

// log every event
socket.onAny((event, ...args) => {
  console.log("📡 Event received:", event, args);
});
