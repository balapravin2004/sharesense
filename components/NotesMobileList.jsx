"use client";

import React from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";

export default function NotesMobileList({
  loading,
  notes,
  previewText,
  deletingId,
  onDelete,
}) {
  return (
    <div className="md:hidden p-1">
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
              className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div
                    className="text-sm text-gray-800 mb-2"
                    dangerouslySetInnerHTML={{
                      __html: previewText(note.content),
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    {note.timing ? new Date(note.timing).toLocaleString() : "—"}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button className="p-2 rounded bg-indigo-500 text-white">
                    <Upload className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-2 rounded bg-red-500 text-white flex items-center justify-center">
                    {deletingId === note.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
