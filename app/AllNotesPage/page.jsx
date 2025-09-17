"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteNote,
  setQuery,
  toggleShowImages,
  setDeletingId,
  setFilteredNotes,
} from "../../store/notesSlice";

import NotesHeader from "../../components/NotesHeader";
import NotesTable from "../../components/NotesTable";
import NotesMobileList from "../../components/NotesMobileList";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import NotesImages from "../../components/NotesImages";

export default function AllNotesPage() {
  const dispatch = useDispatch();
  const { filteredNotes, loading, deletingId, query, showImages } = useSelector(
    (state) => state.notes
  );
  const user = useSelector((state) => state.auth.user);

  const [filterMode, setFilterMode] = useState(user ? "both" : "general"); // default general if not authenticated
  const [fetching, setFetching] = useState(false);

  // Fetch notes from API according to filterMode
  const fetchFilteredNotes = async (mode) => {
    try {
      setFetching(true);
      const payload = { mode, userId: user?.id || 0 };
      const res = await fetch("/api/notes/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(setFilteredNotes(data));
      } else {
        console.error(data.error || "Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setFetching(false);
    }
  };

  // Initial fetch + re-fetch when mode or user changes
  useEffect(() => {
    fetchFilteredNotes(filterMode);
  }, [filterMode, user?.id]);

  const previewText = (html) => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]*>/g, "");
    return stripped.length > 120 ? stripped.slice(0, 120) + "..." : stripped;
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header + Image toggle */}
        <div className="flex items-center justify-between mb-4">
          <NotesHeader query={query} setQuery={(q) => dispatch(setQuery(q))} />
          <button
            onClick={() => dispatch(toggleShowImages())}
            className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 mt-12">
            <span className="hidden sm:inline">
              {showImages ? "Hide Images" : "See Images"}
            </span>
          </button>
        </div>

        {/* Filter buttons (only if user is authenticated) */}
        {user && (
          <div className="flex gap-2 justify-center mb-4">
            {["general", "user", "both"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg font-semibold border-2 transition ${
                  filterMode === type
                    ? "bg-blue-600 text-white border-blue-800"
                    : "bg-gray-200 text-gray-800 border-gray-300"
                }`}
                onClick={() => setFilterMode(type)}>
                {type === "general"
                  ? "General"
                  : type === "both"
                  ? "Both"
                  : "User Only"}
              </button>
            ))}
          </div>
        )}

        {/* Notes display */}
        {showImages ? (
          <NotesImages visible={showImages} />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <NotesTable
              loading={loading || fetching}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => dispatch(setDeletingId(id))}
            />
            <NotesMobileList
              loading={loading || fetching}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => dispatch(setDeletingId(id))}
            />
          </div>
        )}

        {/* Confirm delete modal */}
        {deletingId && (
          <ConfirmDeleteModal
            onCancel={() => dispatch(setDeletingId(null))}
            onConfirm={() => dispatch(deleteNote(deletingId))}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
}
