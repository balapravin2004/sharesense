import { configureStore } from "@reduxjs/toolkit";
import UIreducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: UIreducer,
  },
});
