"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, ChevronDown } from "lucide-react";
import { logoutUser } from "../store/authSlice"; // adjust path as needed

/* --------------------- MOBILE TOPBAR --------------------- */
const TopbarMobile = ({ wrapperRef, user, handleLogout }) => {
  return (
    <div className="w-full transition-all duration-300 sidebar-gradient text-white px-4 py-3 flex justify-between items-center sticky top-0 md:hidden z-[200]">
      <div className="text-xl font-bold tracking-wide">
        <Link href="/">ShareBro</Link>
      </div>

      {user && (
        <div className="flex items-center gap-5 relative" ref={wrapperRef}>
          <button className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
            <UserCircle size={26} />
            <span className="font-medium">{user.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* --------------------- DESKTOP TOPBAR --------------------- */
const TopbarDesktop = ({ user, handleLogout }) => {
  return (
    <div className="w-full transition-all duration-300 bg-transparent text-white px-4 py-3 justify-between items-center sticky top-0 hidden md:flex z-[200]">
      <div className="text-xl font-bold tracking-wide">
        <Link href="/">ShareBro</Link>
      </div>

      {user && (
        <div className="flex items-center gap-5 relative">
          <button className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
            <UserCircle size={26} />
            <span className="hidden sm:block font-medium">{user.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* --------------------- MAIN TOPBAR COMPONENT --------------------- */
export default function Topbar() {
  const wrapperRef = useRef(null); // ✅ NEW wrapper ref
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <TopbarMobile
        wrapperRef={wrapperRef}
        user={user}
        handleLogout={handleLogout}
      />
      <TopbarDesktop
        wrapperRef={wrapperRef}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
}
