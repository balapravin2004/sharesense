import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  // ✅ Add CORS so frontend can connect
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // in prod use your frontend domain
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // log every event from this client
    socket.onAny((event, ...args) => {
      console.log("📡 Event received:", event, args);
    });

    // when someone joins a room
    socket.on("join-room", ({ room, username }, ack) => {
      console.log("🧭 server received join-room", { room, username });
      socket.join(room);
      console.log(`👤 ${username} joined room: ${room}`);
      socket.to(room).emit("user_joined", username);
      socket.emit("user_joined", username);
      if (ack) ack({ ok: true });
    });

    // chat message
    socket.on("message", ({ room, sender, message }) => {
      io.to(room).emit("message", { sender, message });
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server is running on http://${hostname}:${port}`);
  });
});
