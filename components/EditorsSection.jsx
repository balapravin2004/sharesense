"use client";

import React, { useState, useEffect } from "react";
import { FroalaEditor } from "../components";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice"; // adjust path if needed

export default function EditorsSection() {
  const user = useSelector(selectUser);
  const isAuthenticated = !!user?.id;

  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [activeButton, setActiveButton] = useState("general");

  // ✅ Load activeButton from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeButton");
      if (stored) setActiveButton(stored);
    }
  }, []);

  const gradientBtn =
    "px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  const activeStyle =
    "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-2 border-black";

  // Save activeness to localStorage
  const handleSetActiveButton = (type) => {
    setActiveButton(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeButton", type);
    }
    toast.success(`Active mode set to "${type}"`);
  };

  // Upload note according to active button
  const handleUpload = async () => {
    if (!content || !content.trim()) {
      toast.error("Content is required before uploading!");
      return;
    }

    setIsUploading(true);
    try {
      const payload = {
        content,
        mode: activeButton,
        userId: user?.id || null, // authorId
        userName: user?.name || null, // authorName
      };

      const res = await axios.post("/api/notes", payload);

      if (res.status === 201 || res.status === 200) {
        toast.success("Note uploaded successfully!");
      } else {
        toast.error(res.data?.error || "Failed to upload note");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Error uploading note"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Receive the latest note
  const handleReceive = async () => {
    setIsReceiving(true);
    try {
      const res = await axios.get("/api/allnotes");

      if (res.status !== 200) {
        toast.error(res.data?.error || "Failed to fetch notes");
        return;
      }

      const data = res.data;
      let note = null;

      if (Array.isArray(data) && data.length) {
        note = data.reduce((a, b) => {
          const at = a?.timing ? new Date(a.timing).getTime() : 0;
          const bt = b?.timing ? new Date(b.timing).getTime() : 0;
          return bt > at ? b : a;
        }, data[0]);
      } else if (data?.content) {
        note = data;
      } else if (data?.notes?.length) {
        note = data.notes.reduce((a, b) => {
          const at = a?.timing ? new Date(a.timing).getTime() : 0;
          const bt = b?.timing ? new Date(b.timing).getTime() : 0;
          return bt > at ? b : a;
        }, data.notes[0]);
      } else {
        toast.error("Unexpected response from server");
        return;
      }

      setContent(note.content ?? "");
      toast.success("Note received successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Error fetching note"
      );
    } finally {
      setIsReceiving(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-3 gap-4">
      <FroalaEditor value={content} onChange={setContent} />

      {/* Buttons line */}
      {/* Buttons line */}
      <div className="flex flex-row flex-wrap gap-4 md:justify-between">
        {/* Row 1: Upload & Receive */}
        <div className="flex gap-3">
          <button
            className={gradientBtn}
            onClick={handleUpload}
            disabled={isUploading || isReceiving}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          <button
            className={gradientBtn}
            onClick={handleReceive}
            disabled={isReceiving || isUploading}>
            {isReceiving ? "Receiving..." : "Receive"}
          </button>
          {/* Row 3: View All */}
          <Link
            href="/AllNotesPage"
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition w-fit">
            View all
          </Link>
        </div>

        {/* Row 2: Filters (only for authenticated users) */}
        {isAuthenticated && (
          <div className="flex gap-2 flex-wrap">
            {["general", "both", "user"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full border text-sm font-medium transition
            ${
              activeButton === type
                ? "bg-indigo-500 text-white border-indigo-500"
                : "text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
                onClick={() => handleSetActiveButton(type)}>
                {type === "general"
                  ? "General"
                  : type === "both"
                  ? "Both"
                  : "User Only"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
