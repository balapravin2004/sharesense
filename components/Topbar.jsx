"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, UserCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full transition-all duration-300  bg-transparent  text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[100] ">
      <div className="text-xl font-bold tracking-wide">Share Sense</div>

      <div className="flex items-center gap-5 relative">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
            <UserCircle size={26} />
            <span className="hidden sm:block font-medium">Rahul</span>
            <ChevronDown className="text-gray-300" size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-black overflow-hidden">
              <ul className="flex flex-col">
                <Link href="/ProfilePage">
                  <li className="px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
                    Profile
                  </li>
                </Link>
                <Link href="/SettingsPage">
                  <li className="px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
                    Settings
                  </li>
                </Link>
                <li
                  className="px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => {
                    toast.success("Logged out successfully");
                  }}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
