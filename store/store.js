import { configureStore } from "@reduxjs/toolkit";
import UIreducer from "./uiSlice";
import notesReducer from "./notesSlice";

export const store = configureStore({
  reducer: {
    ui: UIreducer,
    notes: notesReducer,
  },
});

export default store;
