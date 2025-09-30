import { createSlice } from "@reduxjs/toolkit";
import {
  Home,
  Lock,
  UserPlus,
  Info, // <- changed from Settings to Info
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  LogIn,
  Users,
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

export const getNavItems = (state, dispatch) => {
  return [
    {
      label: state.collapsed ? "Expand Sidebar" : "Collapse Sidebar",
      icon: state.collapsed ? PanelLeftOpen : PanelLeftClose,
      action: () => dispatch(uiSlice.actions.toggleCollapse()),
      isButton: true,
    },
    { label: "Home", icon: Home, route: "/" },
    { label: "All Notes", icon: FileText, route: "/AllNotesPage" },
    // { label: "Secure Share", icon: Lock, route: "/SecureSharePage" },
    { label: "Make Room", icon: UserPlus, route: "/MakeRoomPage" },
    { label: "Info", icon: Info, route: "/InfoPage" }, // <- updated
    { label: "Login", icon: LogIn, route: "/auth" },
  ];
};

export const { toggleCollapse } = uiSlice.actions;
export default uiSlice.reducer;
