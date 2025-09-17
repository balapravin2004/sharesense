"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { logoutUser } from "../store/authSlice"; // Adjust path as needed

/* --------------------- DROPDOWN MENU --------------------- */
const DropdownMenu = ({ dropdownRef, handleLogout }) => (
  <div
    className="absolute right-0 top-5 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-black overflow-hidden"
    ref={dropdownRef}>
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
        onClick={handleLogout}>
        Logout
      </li>
    </ul>
  </div>
);

/* --------------------- MOBILE TOPBAR --------------------- */
const TopbarMobile = ({
  toggleDropdown,
  dropdownOpen,
  dropdownRef,
  user,
  handleLogout,
}) => (
  <div className="w-full transition-all duration-300 sidebar-gradient text-white px-4 py-3 flex justify-between items-center sticky top-0 md:hidden z-[200]">
    <div className="text-xl font-bold tracking-wide">
      <Link href="/">ShareBro</Link>
    </div>
    {user ? (
      <div className="flex items-center gap-5 relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
          <UserCircle size={26} />
          <span className="hidden sm:block font-medium">{user.name}</span>
          <ChevronDown className="text-gray-300" size={18} />
        </button>
        {dropdownOpen && (
          <DropdownMenu dropdownRef={dropdownRef} handleLogout={handleLogout} />
        )}
      </div>
    ) : null}
  </div>
);

/* --------------------- DESKTOP TOPBAR --------------------- */
const TopbarDesktop = ({
  toggleDropdown,
  dropdownOpen,
  dropdownRef,
  user,
  handleLogout,
}) => (
  <div className="w-full transition-all duration-300 bg-transparent text-white px-4 py-3 justify-between items-center sticky top-0 hidden md:flex">
    <div className="text-xl font-bold tracking-wide">
      <Link href="/">ShareBro</Link>
    </div>
    {user ? (
      <div className="flex items-center gap-5 relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
          <UserCircle size={26} />
          <span className="hidden sm:block font-medium">{user.name}</span>
          <ChevronDown className="text-gray-300" size={18} />
        </button>
        {dropdownOpen && (
          <DropdownMenu dropdownRef={dropdownRef} handleLogout={handleLogout} />
        )}
      </div>
    ) : null}
  </div>
);

/* --------------------- MAIN TOPBAR COMPONENT --------------------- */
export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
  };

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
    <>
      <TopbarMobile
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
        dropdownRef={dropdownRef}
        user={user}
        handleLogout={handleLogout}
      />
      <TopbarDesktop
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
        dropdownRef={dropdownRef}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
}
