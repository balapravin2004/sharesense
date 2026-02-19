"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";

const LogoutButton = ({ collapsed, isMobile, isActive }) => {
  const dispatch = useDispatch();

  const baseClasses =
    "flex items-center gap-3 py-3 px-4 rounded-xl transition-colors";
  const activeClasses =
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg";
  const inactiveClasses = "hover:bg-blue-800 text-gray-300";

  return (
    <button
      onClick={() => dispatch(logoutUser())}
      className={`md:w-full border border-none ${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`}>
      <LogOut className="w-5 h-5 flex-shrink-0" />

      {!collapsed && !isMobile && <span className="font-medium">Logout</span>}
    </button>
  );
};

export default LogoutButton;
