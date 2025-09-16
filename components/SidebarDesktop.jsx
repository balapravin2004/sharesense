"use client";

import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import NavList from "./NavList";
import LogoutButton from "./LogoutButton";
import { getNavItems } from "../store/uiSlice"; // Import the selector/helper function

export default function SidebarDesktop() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.ui);

  // Get the nav items using the state and dispatch
  const navItems = getNavItems(state, dispatch);

  return (
    <div
      className={`hidden md:flex h-screen text-white p-4 flex-col justify-between bg-transparent transition-all duration-300 ${
        state.collapsed ? "w-20" : "w-60"
      }`}>
      <NavList
        items={navItems}
        pathname={pathname}
        collapsed={state.collapsed}
      />
      <LogoutButton collapsed={state.collapsed} />
    </div>
  );
}
