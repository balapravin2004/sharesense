"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Lock,
  UserPlus,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";
import NavList from "./NavList";
import LogoutButton from "./LogoutButton";

export default function SidebarDesktop() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      label: collapsed ? "Expand Sidebar" : "Collapse Sidebar",
      icon: collapsed ? PanelLeftOpen : PanelLeftClose,
      action: () => setCollapsed(!collapsed),
      isButton: true,
    },
    { label: "Home", icon: Home, route: "/" },
    { label: "All Notes", icon: FileText, route: "/AllNotesPage" },
    { label: "Secure Share", icon: Lock, route: "/SecureSharePage" },
    { label: "Make Room", icon: UserPlus, route: "/MakeRoomPage" },
    { label: "Settings", icon: Settings, route: "/SettingsPage" },
  ];

  return (
    <div
      className={`hidden md:flex h-screen text-white p-4 flex-col justify-between bg-transparent transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}>
      <NavList items={navItems} pathname={pathname} collapsed={collapsed} />
      <LogoutButton collapsed={collapsed} />
    </div>
  );
}
