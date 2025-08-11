"use client";
import React, { useState } from "react";
import FroalaEditor from "./FroalaEditor";

export default function EditorsSection() {
  const [uploadContent, setUploadContent] = useState("");
  const [receivedContent, setReceivedContent] = useState("");

  const gradientBtn =
    "px-4 py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  // Upload note
  const handleUpload = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: uploadContent }),
    });

    if (res.ok) {
      alert("Note uploaded!");
    } else {
      alert("Failed to upload note");
    }
  };

  // Receive latest note
  const handleReceive = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();

    if (res.ok) {
      setReceivedContent(data.content);
    } else {
      alert(data.error || "Failed to fetch note");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Section */}
      <div className="flex flex-col bg-white rounded-lg shadow p-3 ">
        <FroalaEditor value={uploadContent} onChange={setUploadContent} />
        <div className="flex justify-end">
          <button className={gradientBtn} onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {/* Receive Section */}
      <div className="flex flex-col bg-white rounded-lg shadow p-3">
        <FroalaEditor value={receivedContent} onChange={setReceivedContent} />
        <div className="flex justify-end">
          <button className={gradientBtn} onClick={handleReceive}>
            Receive
          </button>
        </div>
      </div>
    </div>
  );
}
