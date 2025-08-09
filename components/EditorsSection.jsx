"use client";
import React from "react";
import TinyEditor from "./TinyEditor";
export default function EditorsSection() {
  const gradientBtn =
    "px-4 py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col bg-white rounded-lg shadow p-3">
        <TinyEditor />
        <div className="flex justify-end">
          <button className={gradientBtn}>Upload</button>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow p-3">
        <TinyEditor />
        <div className="flex justify-end">
          <button className={gradientBtn}>Receive</button>
        </div>
      </div>
    </div>
  );
}
