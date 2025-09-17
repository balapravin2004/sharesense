"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { setActiveTab, signupUser, loginUser } from "../../store/authSlice";

import { SignupForm, LoginForm } from "../../components";

const AuthPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { activeTab, loading } = useSelector((state) => state.auth);

  const handleSignup = (data) => dispatch(signupUser(data));
  const handleLogin = (data) => dispatch(loginUser(data));

  return (
    <div className="h-[95vh] md:h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-800 transition">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex justify-center mb-6 border-b border-gray-200">
          <button
            onClick={() => dispatch(setActiveTab("signup"))}
            className={`px-4 py-2 font-semibold ${
              activeTab === "signup"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}>
            Sign Up
          </button>
          <button
            onClick={() => dispatch(setActiveTab("login"))}
            className={`px-4 py-2 font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}>
            Log In
          </button>
        </div>

        {activeTab === "signup" ? (
          <SignupForm onSubmit={handleSignup} />
        ) : (
          <LoginForm onSubmit={handleLogin} />
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
