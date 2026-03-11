"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../lib/socketClient";
import {
  addMessage,
  setActiveRooms,
  setCurrentRoom,
} from "../../store/chatSlice";

import ChatRoomForm from "../../components/ChatRoomForm";
import ActiveRooms from "../../components/ActiveRooms";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { currentRoom, messages, activeRooms } = useSelector(
    (state) => state.chat
  );

  const [localName, setLocalName] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const handleJoinRoom = () => {
    if (!roomInput || !localName) return;
    socket.emit("join-room", { room: roomInput, username: localName }, (res) =>
      console.log("join ack", res)
    );
    dispatch(setCurrentRoom(roomInput));
  };

  const handleLeaveRoom = () => {
    if (!currentRoom) return;
    socket.emit("leave-room", { room: currentRoom, username: localName });
    dispatch(setCurrentRoom(null));
  };

  const handleSendMessage = (payload) => {
    // payload can be { text } or { file: { filename, mime, buffer, size } }
    if (!currentRoom) return;

    if (payload.text && payload.text.trim()) {
      socket.emit("message", {
        room: currentRoom,
        sender: localName,
        message: payload.text,
      });

      dispatch(
        addMessage({
          room: currentRoom,
          message: { sender: localName, message: payload.text },
        })
      );
    }

    if (payload.file) {
      // emit binary file with metadata
      socket.emit(
        "file",
        {
          room: currentRoom,
          sender: localName,
          filename: payload.file.filename,
          mime: payload.file.mime,
          size: payload.file.size,
          file: payload.file.buffer, // ArrayBuffer / Buffer => socket.io will transmit binary
        },
        (ack) => {
          // optional ack
        }
      );

      // locally add a "pending" message so sender sees it immediately
      dispatch(
        addMessage({
          room: currentRoom,
          message: {
            sender: localName,
            message: `Sent ${payload.file.filename}`,
            file: {
              filename: payload.file.filename,
              mime: payload.file.mime,
              size: payload.file.size,
              outgoing: true,
            },
          },
        })
      );
    }
  };

  useEffect(() => {
    socket.on("message", (data) => {
      dispatch(
        addMessage({
          room: data.room || currentRoom,
          message: { sender: data.sender, message: data.message },
        })
      );
    });

    socket.on("user_joined", (username) => {
      dispatch(
        addMessage({
          room: currentRoom,
          message: {
            sender: "system",
            message: `${username} joined`,
            highlight: true,
          },
        })
      );
    });

    socket.on("active_rooms", (rooms) => dispatch(setActiveRooms(rooms)));

    // receive file events
    socket.on("file", (payload) => {
      // payload: { room, sender, filename, mime, size, file } where file is binary (ArrayBuffer/Buffer)
      // We will create an object URL in the UI component; store metadata in message and attach raw binary too
      dispatch(
        addMessage({
          room: payload.room || currentRoom,
          message: {
            sender: payload.sender,
            message: `File: ${payload.filename}`,
            file: {
              filename: payload.filename,
              mime: payload.mime,
              size: payload.size,
              raw: payload.file, // may be ArrayBuffer or Buffer
            },
          },
        })
      );
    });

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("active_rooms");
      socket.off("file");
    };
  }, [currentRoom, dispatch]);

  return (
    <div className="w-full h-[90vh] flex flex-col md:flex-row p-4 md:p-6 bg-gray-50 gap-6">
      {!currentRoom ? (
        <>
          {/* Left Side: Join Form */}
          <div className="flex-1 flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg md:max-w-md mx-auto md:mx-0 border border-none w-full">
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Join a Chat Room
            </h2>
            <ChatRoomForm
              localName={localName}
              setLocalName={setLocalName}
              roomInput={roomInput}
              setRoomInput={setRoomInput}
              onJoin={handleJoinRoom}
            />
          </div>

          {/* Right Side: Active Rooms */}
          <div className="flex-1 flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg w-full max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Active Rooms ({activeRooms.length})
            </h3>
            <ActiveRooms rooms={activeRooms} />
          </div>
        </>
      ) : (
        <ChatWindow
          currentRoom={currentRoom}
          messages={messages}
          localName={localName}
          onLeave={handleLeaveRoom}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
