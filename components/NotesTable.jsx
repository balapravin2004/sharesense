"use client";

import React, { useState } from "react";
import { Upload, Trash2, Loader2, Share2 } from "lucide-react";
import { WhatsappShareButton, EmailShareButton } from "react-share";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import ShareModal from "./ShareModal";

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

  return (
    <div className="hidden md:block max-h-[32rem]  xl:max-h-[40rem] overflow-auto">
      <table className="w-full table-auto text-sm sm:text-base">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border w-16">#</th>
            <th className="p-3 border">Note</th>
            <th className="p-3 border w-48">Time</th>
            <th className="p-3 border w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Loading notes...
                </div>
              </td>
            </tr>
          ) : notes.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                No notes found
              </td>
            </tr>
          ) : (
            notes.map((note, index) => (
              <tr key={note.id || index} className="hover:bg-gray-50">
                <td className="p-3 border align-top">{index + 1}</td>
                <td className="p-3 border align-top max-w-lg">
                  <div
                    className="text-sm text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: previewText(note.content),
                    }}
                  />
                </td>
                <td className="p-3 border align-top text-gray-600 text-sm">
                  {timeAgo(note.timing)}
                </td>
                <td className="p-3 border align-top">
                  <div className="flex gap-2">
                    {/* Upload Button */}
                    <button
                      onClick={async () => {
                        await fetch("/api/uploadnotetoend", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ noteId: note.id }),
                        });
                        fetchNotesFunction();
                      }}
                      className="px-3 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(note.id)}
                      className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2">
                      {deletingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => setShareNote(note)}
                      className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 flex items-center gap-2">
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
