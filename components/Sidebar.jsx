"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock, UserPlus, Settings, LogOut } from "lucide-react";
import toast from "react-hot-toast";

// Navigation items
const navItems = [
  { label: "Home", icon: Home, route: "/" },
  { label: "Secure Share", icon: Lock, route: "/SecureSharePage" },
  { label: "Make Room", icon: UserPlus, route: "/MakeRoomPage" },
  { label: "Settings", icon: Settings, route: "/SettingsPage" },
];

// ===== Desktop Sidebar =====
const SidebarDesktop = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-72 h-screen bg-white shadow-lg rounded-r-3xl p-6 flex-col justify-between">
      <div>
        <Link href="/" className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Share Sense</h1>
            <p className="text-xs text-gray-500">Secure file sharing</p>
          </div>
        </Link>

        <nav className="space-y-3">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.route;
            const Icon = item.icon;

            return (
              <Link
                key={idx}
                href={item.route}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-colors text-left
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={() => toast.success("Logged out successfully")}
        className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-100 text-gray-800">
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

// ===== Mobile Bottom Navbar =====
const BottomNavMobile = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full h-[4rem] bg-blue-900 text-white flex justify-around items-center md:hidden z-50 border-t border-blue-700 rounded-tr-2xl rounded-tl-2xl">
      {navItems.map((item, idx) => {
        const isActive = pathname === item.route;
        const Icon = item.icon;

        return (
          <Link
            key={idx}
            href={item.route}
            className={`flex flex-col items-center text-xs gap-1 ${
              isActive ? "text-white" : "text-blue-300"
            }`}>
            <Icon className="w-5 h-5" />
          </Link>
        );
      })}

      {/* Logout Button */}
      <button
        onClick={() => toast.success("Logged out successfully")}
        className="flex flex-col items-center text-xs gap-1 text-blue-300 hover:text-white transition">
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

// ===== Main Sidebar Wrapper =====
export default function Sidebar() {
  return (
    <>
      <SidebarDesktop />
      <BottomNavMobile />
    </>
  );
}
