"use client";
import React, { useState } from "react";
import FroalaEditor from "./FroalaEditor";
import toast from "react-hot-toast";

export default function EditorsSection() {
  const [content, setContent] = useState("");

  const gradientBtn =
    "px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  // Upload note
  const handleUpload = async () => {
    if (!content.trim()) {
      toast.error("Content is required before uploading!");
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        toast.success("Note uploaded successfully!");
      } else {
        toast.error("Failed to upload note");
      }
    } catch (error) {
      toast.error("Error uploading note");
    }
  };

  // Receive latest note
  const handleReceive = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();

      if (res.ok) {
        setContent(data.content);
        toast.success("Note received successfully!");
      } else {
        toast.error(data.error || "Failed to fetch note");
      }
    } catch (error) {
      toast.error("Error fetching note");
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-3 gap-4">
      <FroalaEditor value={content} onChange={setContent} />

      <div className="flex justify-between">
        <button className={gradientBtn} onClick={handleUpload}>
          Upload
        </button>
        <button className={gradientBtn} onClick={handleReceive}>
          Receive
        </button>
      </div>
    </div>
  );
}
