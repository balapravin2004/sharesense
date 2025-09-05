import { createSlice } from "@reduxjs/toolkit";
import {
  Home,
  Lock,
  UserPlus,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";

const initialState = {
  collapsed: false,
  navItems: [
    { label: "Home", icon: Home, route: "/" },
    { label: "All Notes", icon: FileText, route: "/AllNotesPage" },
    { label: "Secure Share", icon: Lock, route: "/SecureSharePage" },
    { label: "Make Room", icon: UserPlus, route: "/MakeRoomPage" },
    { label: "Settings", icon: Settings, route: "/SettingsPage" },
  ],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleCollapse } = uiSlice.actions;
export default uiSlice.reducer;
