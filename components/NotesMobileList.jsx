"use client";

import React, { useState } from "react";
import { Upload, Trash2, Loader2, Share2 } from "lucide-react";
import { WhatsappShareButton, EmailShareButton } from "react-share";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Utility function
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

export default function NotesMobileList({
  loading,
  notes,
  previewText,
  deletingId,
  onDelete,
  fetchNotesFunction,
}) {
  const [shareNoteId, setShareNoteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();
  const currentFilter = useSelector((state) => state.notes.filterMode);

  // ✅ Toggle checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);

    try {
      await axios.post("/api/deletenotes", { ids: selectedIds });
      setSelectedIds([]);
      await fetchNotesFunction();
      toast.success("Selected notes deleted");
    } catch (error) {
      console.error("Error bulk deleting notes:", error);
      toast.error("Failed to delete notes");
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="md:hidden p-2 mb-14 md:mb-0 overflow-auto max-h-[30rem]">
      {/* Bulk delete bar */}
      {selectedIds.length > 0 && (
        <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 border rounded sticky top-0 z-10">
          <span className="text-sm text-gray-600">
            {selectedIds.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 text-sm">
            {bulkDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      )}

      {/* Loading / Empty states */}
      {loading ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : notes.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No notes found</div>
      ) : (
        <div className="grid gap-3">
          {notes.map((note, index) => (
            <div
              key={note.id || index}
              className={`bg-white border rounded-lg p-3 shadow-sm transition ${
                selectedIds.includes(note.id) ? "ring-2 ring-red-400" : ""
              }`}>
              {/* Header: Checkbox + Time */}
              <div className="flex justify-between items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(note.id)}
                  onChange={() => toggleSelect(note.id)}
                />
                <span className="text-xs text-gray-500">
                  {timeAgo(note.timing)}
                </span>
              </div>

              {/* Note Content */}
              <div
                className="flex-1 p-1 cursor-pointer hover:underline"
                onClick={() => router.push(`/notes/${note.id}`)}>
                <div
                  className="text-sm text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: previewText(note.content),
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start items-center mt-3 pt-2 border-t gap-2">
                {/* Upload */}
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.post("/api/uploadnotetoend", {
                        noteId: note.id,
                        filterMode: currentFilter,
                      });

                      await fetchNotesFunction();

                      if (res.data.success) {
                        toast.success("Uploaded to general section");
                      }
                    } catch (error) {
                      console.error("Upload error:", error);
                      toast.error("Failed to upload note");
                    }
                  }}
                  className="p-2 rounded bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600">
                  <Upload className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 rounded bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                  {deletingId === note.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                {/* Share */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setShareNoteId(shareNoteId === note.id ? null : note.id)
                    }
                    className="p-2 rounded bg-green-500 text-white flex items-center justify-center hover:bg-green-600">
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Share menu */}
                  {shareNoteId === note.id && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-2 bg-white border rounded shadow-lg flex gap-3 z-20">
                      <WhatsappShareButton
                        url={`https://sharebhai.com/notes/${note.id}`}>
                        <FaWhatsapp className="text-green-600 w-6 h-6" />
                      </WhatsappShareButton>

                      <EmailShareButton
                        url={`https://sharebhai.com/notes/${note.id}`}
                        subject="Check this note">
                        <FaEnvelope className="text-blue-600 w-6 h-6" />
                      </EmailShareButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
