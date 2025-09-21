import { io } from "socket.io-client";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const socket = io(SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => console.log("✅ Connected:", socket.id));
socket.on("connect_error", (err) => console.error("❌ Error:", err.message));
socket.onAny((event, ...args) => console.log("📡 Event:", event, args));
