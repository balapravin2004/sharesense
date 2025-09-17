"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getNavItems } from "../store/uiSlice"; // Import the selector/helper function

export default function BottomNavMobile() {
  const pathname = usePathname();
  const state = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Get the nav items dynamically based on state and dispatch
  const navItems = getNavItems(state, dispatch);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[4rem] bg-blue-900 text-white flex justify-around items-center md:hidden z-50 border-t border-blue-700 rounded-tr-2xl rounded-tl-2xl overflow-x-auto no-scrollbar">
      {navItems.slice(1).map((item, idx) => {
        const isActive = pathname === item.route;
        const Icon = item.icon;

        return (
          <Link
            key={idx}
            href={item.route || "#"} // In case route is undefined (like toggle button)
            className={`flex flex-col items-center text-xs gap-1 min-w-[4rem] ${
              isActive ? "text-white" : "text-blue-300"
            }`}
            onClick={item.isButton ? item.action : undefined} // Handle button actions
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
