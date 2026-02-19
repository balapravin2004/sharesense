import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

// ✅ Do NOT pass hostname/port here
const app = next({ dev });
const handle = app.getRequestHandler();

interface ActiveRooms {
  [room: string]: Set<string>;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const activeRooms: ActiveRooms = {};

  io.on("connection", (socket: Socket) => {
    socket.onAny((event, ...args) =>
      console.log("📡 Event:", event, args)
    );

    socket.on(
      "join-room",
      (
        { room, username }: { room: string; username: string },
        ack?: (response: { ok: boolean }) => void
      ) => {
        socket.join(room);

        if (!activeRooms[room]) activeRooms[room] = new Set();
        activeRooms[room].add(socket.id);

        socket.to(room).emit("user_joined", username);
        socket.emit("user_joined", username);

        const roomsInfo = Object.entries(activeRooms).map(
          ([r, users]) => ({
            room: r,
            users: users.size,
          })
        );

        io.emit("active_rooms", roomsInfo);

        if (ack) ack({ ok: true });
      }
    );

    socket.on(
      "leave-room",
      ({ room, username }: { room: string; username?: string }) => {
        socket.leave(room);

        if (activeRooms[room]) {
          activeRooms[room].delete(socket.id);
          if (activeRooms[room].size === 0) delete activeRooms[room];
        }

        if (username) socket.to(room).emit("user_left", username);

        const roomsInfo = Object.entries(activeRooms).map(
          ([r, users]) => ({
            room: r,
            users: users.size,
          })
        );

        io.emit("active_rooms", roomsInfo);
      }
    );

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

    socket.on(
      "file",
      (payload: {
        room: string;
        sender: string;
        filename: string;
        mime: string;
        size: number;
        file: any;
      }) => {
        try {
          io.to(payload.room).emit("file", payload);
        } catch (err) {
          console.error("file handling error", err);
        }
      }
    );

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room === socket.id) continue;
        if (activeRooms[room]) {
          activeRooms[room].delete(socket.id);
          if (activeRooms[room].size === 0) delete activeRooms[room];
        }
      }
    });

    socket.on("disconnect", () => {
      const roomsInfo = Object.entries(activeRooms).map(
        ([r, users]) => ({
          room: r,
          users: users.size,
        })
      );
      io.emit("active_rooms", roomsInfo);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  // ✅ Explicitly bind to 0.0.0.0 for Docker
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});
