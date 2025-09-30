import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface ActiveRooms {
  [room: string]: Set<string>;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // replace with your frontend URL in production
      methods: ["GET", "POST"],
    },
    // allow binary transports by default
  });

  // Track rooms and users
  const activeRooms: ActiveRooms = {};

  io.on("connection", (socket: Socket) => {
    // console.log(`✅ User connected: ${socket.id}`);

    socket.onAny((event, ...args) => console.log("📡 Event:", event, args));

    // Join room
    socket.on(
      "join-room",
      (
        { room, username }: { room: string; username: string },
        ack?: (response: { ok: boolean }) => void
      ) => {
        socket.join(room);

        if (!activeRooms[room]) activeRooms[room] = new Set();
        activeRooms[room].add(socket.id);

        // Notify room
        socket.to(room).emit("user_joined", username);
        socket.emit("user_joined", username);

        // Emit updated active rooms
        const roomsInfo = Object.entries(activeRooms).map(([r, users]) => ({
          room: r,
          users: users.size,
        }));
        io.emit("active_rooms", roomsInfo);

        if (ack) ack({ ok: true });
      }
    );

    // Leave room
    socket.on(
      "leave-room",
      ({ room, username }: { room: string; username?: string }) => {
        socket.leave(room);

        if (activeRooms[room]) {
          activeRooms[room].delete(socket.id);
          if (activeRooms[room].size === 0) delete activeRooms[room];
        }

        if (username) socket.to(room).emit("user_left", username);

        const roomsInfo = Object.entries(activeRooms).map(([r, users]) => ({
          room: r,
          users: users.size,
        }));
        io.emit("active_rooms", roomsInfo);
      }
    );

    // Chat message
    socket.on(
      "message",
      ({
        room,
        sender,
        message,
      }: {
        room: string;
        sender: string;
        message: string;
      }) => {
        io.to(room).emit("message", { room, sender, message });
      }
    );

    // File upload (binary)
    socket.on(
      "file",
      (payload: {
        room: string;
        sender: string;
        filename: string;
        mime: string;
        size: number;
        file: any; // binary (Buffer/ArrayBuffer)
      }) => {
        try {
          // broadcast to room
          // note: socket.io will handle binary payloads
          io.to(payload.room).emit("file", {
            room: payload.room,
            sender: payload.sender,
            filename: payload.filename,
            mime: payload.mime,
            size: payload.size,
            file: payload.file, // binary
          });
        } catch (err) {
          console.error("file handling error", err);
        }
      }
    );

    // Disconnecting cleanup
    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room === socket.id) continue; // skip default room
        if (activeRooms[room]) {
          activeRooms[room].delete(socket.id);
          if (activeRooms[room].size === 0) delete activeRooms[room];
        }
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      const roomsInfo = Object.entries(activeRooms).map(([r, users]) => ({
        room: r,
        users: users.size,
      }));
      io.emit("active_rooms", roomsInfo);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () =>
    console.log(`🚀 Server running on http://${hostname}:${port}`)
  );
});
