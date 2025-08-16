"use client";

import React, { useState } from "react";
import { Upload, Trash2, Loader2, Share2 } from "lucide-react";
import { WhatsappShareButton, EmailShareButton } from "react-share";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import axios from "axios";

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

  // ✅ Toggle checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Bulk delete with Axios
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      await axios.post("/api/deletenotes", { ids: selectedIds });
      setSelectedIds([]);
      fetchNotesFunction();
    } catch (error) {
      console.error("Error bulk deleting notes:", error);
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="md:hidden p-1 mb-14 md:mb-auto overflow-scroll max-h-[30rem]">
      {/* Bulk delete header */}
      {selectedIds.length > 0 && (
        <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 border rounded">
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
            Delete Selected
          </button>
        </div>
      )}

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
              className={`bg-white border rounded-lg p-3 shadow-sm flex flex-col ${
                selectedIds.includes(note.id) ? "ring-2 ring-red-400" : ""
              }`}>
              {/* Select Checkbox */}
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
              <div className="flex-1">
                <div
                  className="text-sm text-gray-800 mb-2"
                  dangerouslySetInnerHTML={{
                    __html: previewText(note.content),
                  }}
                />
              </div>

              {/* Actions Row */}
              <div className="flex justify-start items-center mt-3 pt-2 border-t">
                {/* Upload */}
                <button
                  onClick={async () => {
                    await axios.post("/api/uploadnotetoend", {
                      noteId: note.id,
                    });
                    fetchNotesFunction();
                  }}
                  className="p-2 rounded bg-indigo-500 text-white flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 mx-2 rounded bg-red-500 text-white flex items-center justify-center">
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
                    className="p-2 rounded bg-green-500 text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </button>

                  {shareNoteId === note.id && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-2 bg-white border rounded shadow-lg flex gap-3">
                      <WhatsappShareButton
                        url={`https://sharebhai.com/notes/${note.id}`}
                        title={note.content}>
                        <FaWhatsapp className="text-green-600 w-6 h-6" />
                      </WhatsappShareButton>

                      <EmailShareButton
                        url={`https://sharebhai.com/notes/${note.id}`}
                        subject="Check this note"
                        body={note.content}>
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
