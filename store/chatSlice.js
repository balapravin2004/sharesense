import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  currentRoom: null,
  messages: {}, // { roomName: [messages] }
  activeRooms: Array.from({ length: 40 }, (_, i) => ({
    room: `Room-${i + 1}`,
    users: Math.floor(Math.random() * 10) + 1, // random 1-10 users
  })),
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setCurrentRoom(state, action) {
      state.currentRoom = action.payload;
    },
    addMessage(state, action) {
      const { room, message } = action.payload;
      if (!state.messages[room]) state.messages[room] = [];
      state.messages[room].push(message);
    },
    clearMessages(state, action) {
      const room = action.payload;
      state.messages[room] = [];
    },
    setActiveRooms(state, action) {
      state.activeRooms = action.payload;
    },
  },
});

export const {
  setUserName,
  setCurrentRoom,
  addMessage,
  clearMessages,
  setActiveRooms,
} = chatSlice.actions;
export default chatSlice.reducer;
