import { configureStore } from "@reduxjs/toolkit";
import UIreducer from "./uiSlice";
import notesReducer from "./notesSlice";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import uploadReducer from "./uploadSlice";
export const store = configureStore({
  reducer: {
    ui: UIreducer,
    notes: notesReducer,
    auth: authReducer,
    chat: chatReducer,
    uploads: uploadReducer,
  },
});

export default store;
