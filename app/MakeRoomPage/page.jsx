"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../lib/socketClient";
import {
  addMessage,
  setActiveRooms,
  setCurrentRoom,
} from "../../store/chatSlice";

import { ChatRoomForm, ActiveRooms, ChatWindow } from "../../components/index";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { currentRoom, messages, activeRooms } = useSelector(
    (state) => state.chat
  );

  const [localName, setLocalName] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const handleJoinRoom = () => {
    if (!roomInput || !localName) return;
    socket.emit("join-room", { room: roomInput, username: localName });
    dispatch(setCurrentRoom(roomInput));
  };

  const handleLeaveRoom = () => {
    if (!currentRoom) return;
    socket.emit("leave-room", { room: currentRoom });
    dispatch(setCurrentRoom(null));
  };

  const handleSendMessage = (msg) => {
    if (!msg.trim() || !currentRoom) return;
    socket.emit("message", {
      room: currentRoom,
      sender: localName,
      message: msg,
    });
    dispatch(
      addMessage({
        room: currentRoom,
        message: { sender: localName, message: msg, isOwnMessage: true },
      })
    );
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

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("active_rooms");
    };
  }, [currentRoom]);

  return (
    <div className="w-full min-h-[90vh] flex flex-col md:flex-row p-4 md:p-6 bg-gray-50 gap-6">
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
