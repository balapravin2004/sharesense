import { configureStore } from "@reduxjs/toolkit";
import UIreducer from "./uiSlice";
import notesReducer from "./notesSlice";

import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    ui: UIreducer,
    notes: notesReducer,
    auth: authReducer,
  },
});

export default store;
