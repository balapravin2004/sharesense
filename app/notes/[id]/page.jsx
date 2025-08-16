"use client";

import React, { useEffect, useState } from "react";
import FroalaEditor from "../../../components/FroalaEdtior"; // adjust import if needed
import { useParams } from "next/navigation";
import axios from "axios";

export default function NotePage() {
  const params = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch the note from backend
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

  return (
    <div className="w-full min-h-screen mx-auto p-6 bg-white mb-12 md:m-auto">
      <h1 className="text-2xl font-bold mb-4">Note Details</h1>

      {loading ? (
        <p className="text-gray-500">Loading note...</p>
      ) : (
        <FroalaEditor value={content} onChange={setContent} />
      )}
    </div>
  );
}
