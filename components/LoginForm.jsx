"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice"; // adjust path
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resAction = await dispatch(loginUser(form));
      if (loginUser.fulfilled.match(resAction)) {
        toast.success("Logged in successfully!");
        router.replace("/");
      } else {
        toast.error(resAction.payload || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <motion.input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        whileFocus={{ scale: 1.02 }}
        required
      />
      <motion.input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        whileFocus={{ scale: 1.02 }}
        required
      />
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`mt-4 w-full sidebar-gradient text-white py-3 rounded-lg font-semibold shadow flex items-center justify-center gap-2 transition-all duration-300 ${
          loading ? "opacity-80 cursor-not-allowed" : ""
        }`}>
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </motion.button>
    </form>
  );
};

export default LoginForm;
