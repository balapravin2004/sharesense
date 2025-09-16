import { createSlice } from "@reduxjs/toolkit";
import {
  Home,
  Lock,
  UserPlus,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  LogIn, // ✅ Imported LogIn icon for Auth route
} from "lucide-react";

const initialState = {
  collapsed: false,
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

export const getNavItems = (state, dispatch) => [
  {
    label: state.collapsed ? "Expand Sidebar" : "Collapse Sidebar",
    icon: state.collapsed ? PanelLeftOpen : PanelLeftClose,
    action: () => dispatch(uiSlice.actions.toggleCollapse()),
    isButton: true,
  },
  { label: "Home", icon: Home, route: "/" },
  { label: "All Notes", icon: FileText, route: "/AllNotesPage" },
  { label: "Secure Share", icon: Lock, route: "/SecureSharePage" },
  { label: "Make Room", icon: UserPlus, route: "/MakeRoomPage" },
  { label: "Settings", icon: Settings, route: "/SettingsPage" },
  { label: "Auth", icon: LogIn, route: "/auth" }, // ✅ Added Auth route
];

export const { toggleCollapse } = uiSlice.actions;
export default uiSlice.reducer;
