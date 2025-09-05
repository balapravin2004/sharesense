"use client";

import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import NavList from "./NavList";
import LogoutButton from "./LogoutButton";
import { toggleCollapse } from "../store/uiSlice";

export default function SidebarDesktop() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.collapsed);
  const items = useSelector((state) => state.ui.navItems);

  const navItems = [
    {
      label: collapsed ? "Expand Sidebar" : "Collapse Sidebar",
      icon: collapsed ? PanelLeftOpen : PanelLeftClose,
      action: () => dispatch(toggleCollapse()),
      isButton: true,
    },
    ...items,
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
