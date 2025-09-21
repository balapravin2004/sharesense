import { configureStore } from "@reduxjs/toolkit";
import UIreducer from "./uiSlice";
import notesReducer from "./notesSlice";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    ui: UIreducer,
    notes: notesReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
