"use client";

import React from "react";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
const LogoutButton = ({ collapsed, isMobile }) => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(logoutUser())}
      className={`flex ${
        isMobile
          ? "flex-col text-xs gap-1 text-blue-300 hover:text-white transition"
          : "items-center gap-3 py-3 px-4 rounded-xl hover:bg-blue-800 text-gray-300 transition"
      }`}>
      <LogOut className="w-5 h-5 flex-shrink-0" />
      {!collapsed && !isMobile && <span className="font-medium">Logout</span>}
    </button>
  );
};

export default LogoutButton;
