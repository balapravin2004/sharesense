"use client";
import React, { useState } from "react";
import FroalaEditor from "./FroalaEditor";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function EditorsSection() {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);

  const gradientBtn =
    "px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition";

  // Upload note
  const handleUpload = async () => {
    if (!content || !content.trim()) {
      toast.error("Content is required before uploading!");
      return;
    }

    setIsUploading(true);
    try {
      const res = await axios.post("/api/notes", { content });

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

  // Receive latest note
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

      if (Array.isArray(data)) {
        if (data.length === 0) {
          toast.error("No notes found");
          return;
        }
        // pick the latest by timing if timing exists, otherwise pick the last item
        note = data.reduce((a, b) => {
          const at = a?.timing ? new Date(a.timing).getTime() : 0;
          const bt = b?.timing ? new Date(b.timing).getTime() : 0;
          return bt > at ? b : a;
        }, data[0]);
      } else if (data && (data.content || data.body)) {
        note = data; // server returned a single note object
      } else if (data && Array.isArray(data.notes) && data.notes.length) {
        note = data.notes.reduce((a, b) => {
          const at = a?.timing ? new Date(a.timing).getTime() : 0;
          const bt = b?.timing ? new Date(b.timing).getTime() : 0;
          return bt > at ? b : a;
        }, data.notes[0]);
      } else {
        toast.error("Unexpected response from server");
        return;
      }

      setContent(note.content ?? note.body ?? "");
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
    <>
      <div className="flex flex-col bg-white rounded-lg shadow p-3 gap-4">
        <FroalaEditor value={content} onChange={setContent} />

        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button
              className={gradientBtn}
              onClick={handleUpload}
              disabled={isUploading || isReceiving}
              aria-disabled={isUploading || isReceiving}>
              {isUploading ? "Uploading..." : "Upload"}
            </button>

            <button
              className={gradientBtn}
              onClick={handleReceive}
              disabled={isReceiving || isUploading}
              aria-disabled={isReceiving || isUploading}>
              {isReceiving ? "Receiving..." : "Receive"}
            </button>
          </div>

          <Link href="/AllNotesPage" className={gradientBtn}>
            View all
          </Link>
        </div>
      </div>
    </>
  );
}
