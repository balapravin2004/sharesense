"use client";

import React, { useState } from "react";
import { Upload, Trash2, Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ShareModal from "./ShareModal";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function timeAgo(timestamp) {
  if (!timestamp) return "—";
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

export default function NotesTable({
  loading,
  notes,
  previewText,
  deletingId,
  onDelete,
  fetchNotesFunction,
}) {
  const [shareNote, setShareNote] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();
  const currentFilter = useSelector((state) => state.notes.filterMode);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      await axios.post("/api/deletenotes", { ids: selectedIds });
      setSelectedIds([]);
      await fetchNotesFunction();
      toast.success("Notes deleted successfully");
    } catch (error) {
      console.error(
        "Error bulk deleting notes:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete notes");
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="hidden md:block max-h-[32rem] xl:max-h-[40rem] overflow-auto overflow-x-clip border rounded-lg shadow-sm bg-white relative">
      {/* Sticky Bulk Action Bar */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b sticky top-0 z-10">
        <span className="text-sm text-gray-600">
          {selectedIds.length} selected
        </span>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 flex items-center gap-2 text-sm transition">
            {bulkDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete Selected
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full table-auto text-sm sm:text-base border-collapse">
        <tbody>
          {/* Loading State */}
          {loading ? (
            <tr>
              <td colSpan={5} className="p-10 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Loading notes...
                </div>
              </td>
            </tr>
          ) : notes.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-10 text-center text-gray-500">
                No notes found
              </td>
            </tr>
          ) : (
            notes.map((note, index) => (
              <tr
                key={note.id || index}
                className="hover:bg-gray-50 hover:scale-[1.01]  transition-all duration-200 even:bg-gray-50/40 ">
                {/* Checkbox */}
                <td className="p-3 border align-top w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(note.id)}
                    onChange={() => toggleSelect(note.id)}
                    className="cursor-pointer"
                    aria-label="Select note"
                  />
                </td>

                {/* Index */}
                <td className="p-3 border align-top w-12 text-gray-600">
                  {index + 1}
                </td>

                {/* Preview Content */}
                <td
                  className="p-3 border align-top max-w-lg cursor-pointer hover:underline text-gray-800"
                  onClick={() => router.push(`/notes/${note.id}`)}>
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: previewText(note.content),
                    }}
                  />
                </td>

                {/* Timing */}
                <td className="p-3 border align-top text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                  {timeAgo(note.timing)}
                </td>

                {/* Actions */}
                <td className="p-3 border align-top  flex flex-row justify-center items-center">
                  <div className="flex gap-2">
                    {/* Upload Button */}
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.post("/api/uploadnotetoend", {
                            noteId: note.id,
                            filterMode: currentFilter,
                          });

                          fetchNotesFunction();

                          if (res.data.success) {
                            toast.success("Uploaded to general section");
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          toast.error("Failed to upload note");
                        }
                      }}
                      aria-label="Upload note"
                      className="p-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 flex items-center justify-center transition">
                      <Upload className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(note.id)}
                      aria-label="Delete note"
                      className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition">
                      {deletingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => setShareNote(note)}
                      aria-label="Share note"
                      className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center justify-center transition">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Share Modal */}
      {shareNote && (
        <ShareModal
          isOpen={!!shareNote}
          onClose={() => setShareNote(null)}
          note={shareNote}
        />
      )}
    </div>
  );
}
