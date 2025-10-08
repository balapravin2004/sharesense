"use client";

import React, { useEffect, useState } from "react";
import FroalaEditor from "../../../components/FroalaEdtior";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react"; // back icon

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);
  // Fetch the note from backend
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateHeight = () => {
        setEditorHeight(window.innerHeight - 350);
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${params.id}`);
        if (res.data?.error) {
          setContent(`<p style="color:red">${res.data.error}</p>`);
        } else {
          setContent(res.data.content ?? "");
        }
      } catch (error) {
        setContent(`<p style="color:red">Failed to fetch note</p>`);
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) fetchNote();
  }, [params?.id]);

  // Auto-save whenever content changes (with debounce)
  useEffect(() => {
    if (!params?.id) return;
    if (loading) return;

    // Don't save if input is empty (trimmed)
    if (!content || content.trim() === "") return;

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        await axios.put(`/api/notes/${params.id}`, { content });
      } catch (error) {
        toast.error("Failed to auto-save");
        console.error("Auto-save error:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [content, params?.id, loading]);

  return (
    <div className="w-full h-full mx-auto p-4 md:p-6 bg-white mb-12 md:m-auto relative">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl md:text-2xl font-bold">Note Details</h1>
        <span className="text-xs md:text-sm text-gray-500">
          {isSaving ? "Saving..." : "All changes saved ✅"}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading note...</p>
      ) : (
        <FroalaEditor
          value={content}
          onChange={setContent}
          editorHeight={editorHeight}
        />
      )}

      {/* Sticky Back Button aligned left */}
      <div className="sticky bottom-[1rem] flex justify-start border border-none">
        <button
          onClick={() => router.push("/AllNotesPage")}
          className="z-[100] w-12 h-12 flex items-center justify-center 
                 rounded-full bg-blue-600 text-white shadow-lg 
                 hover:bg-blue-700 transition"
          aria-label="Back">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
