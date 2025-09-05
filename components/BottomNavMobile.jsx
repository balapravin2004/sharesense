"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function BottomNavMobile() {
  const pathname = usePathname();
  const navItems = useSelector((state) => state.ui.navItems);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[4rem] bg-blue-900 text-white flex justify-around items-center md:hidden z-50 border-t border-blue-700 rounded-tr-2xl rounded-tl-2xl overflow-x-auto no-scrollbar">
      {navItems.map((item, idx) => {
        const isActive = pathname === item.route;
        const Icon = item.icon;

        return (
          <Link
            key={idx}
            href={item.route}
            className={`flex flex-col items-center text-xs gap-1 min-w-[4rem] ${
              isActive ? "text-white" : "text-blue-300"
            }`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
