"use client";

import React from "react";
import Link from "next/link";

const NavItem = ({
  icon: Icon,
  label,
  route,
  isActive,
  isButton,
  onClick,
  collapsed,
}) => {
  const baseClasses =
    "flex items-center gap-3 py-3 px-4 rounded-xl transition-colors";
  const activeClasses =
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg";
  const inactiveClasses = "hover:bg-blue-800 text-gray-300";

  if (isButton) {
    return (
      <button
        onClick={onClick}
        className={`w-full ${baseClasses} ${inactiveClasses}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="font-medium">{label}</span>}
      </button>
    );
  }

  return (
    <Link
      href={route}
      className={`${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default NavItem;
