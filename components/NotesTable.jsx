"use client";

import React from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";

export default function NotesTable({
  loading,
  notes,
  previewText,
  deletingId,
  onDelete,
}) {
  return (
    <div className="hidden md:block">
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
                  {note.timing ? new Date(note.timing).toLocaleString() : "—"}
                </td>
                <td className="p-3 border align-top">
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Upload</span>
                    </button>

                    <button
                      onClick={() => onDelete(note.id)}
                      className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2">
                      {deletingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
