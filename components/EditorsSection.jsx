"use client";
import React, { useState } from "react";
import FroalaEditor from "./FroalaEditor";

import toast from "react-hot-toast";

export default function EditorsSection() {
  const [editorContent, setEditorContent] = useState("");

  const gradientBtn =
    "px-4 py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  const handleUpload = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editorContent }),
    });

    if (res.ok) {
      toast.success("Content uploaded");
    } else {
      toast.error("Failed to uploaded");
    }
  };

  const handleReceive = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();

    if (res.ok) {
      setEditorContent(data.content);
      toast.success("Content received");
    } else {
      toast.error("Failed to receive");
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-3 gap-4">
      <FroalaEditor value={editorContent} onChange={setEditorContent} />
      <div className="flex justify-between gap-2">
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
