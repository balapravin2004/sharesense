"use client";

import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import NavList from "./NavList";
import { getNavItems } from "../store/uiSlice";

export default function SidebarDesktop() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.ui);

  const navItems = getNavItems(state, dispatch);

  return (
    <div
      className={`hidden md:flex h-screen text-white p-4 flex-col bg-transparent transition-all duration-300 border-none ${
        state.collapsed ? "w-20" : "w-60"
      }`}>
      <div className="max-h-[50rem] h-full flex flex-col items-center w-full border-none">
        {/* Nav items section */}
        <div className="w-full">
          <NavList
            items={navItems}
            pathname={pathname}
            collapsed={state.collapsed}
          />
        </div>

        {/* QR image placed directly below NavList */}
        <div className="w-full mt-6 overflow-hidden border-none">
          <img
            src="/media/images/QRcode.png"
            alt="QR Code"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
