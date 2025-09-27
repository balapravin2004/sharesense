"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setQuery,
  deleteNote,
  setDeletingId,
  setFilterMode,
  setFilteredNotes,
  toggleShowImages,
} from "../../store/notesSlice";

import axios from "axios";

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

  // const [filterMode, setFilterMode] = useState(user ? "both" : "general");
  const filterMode = useSelector((state) => state.notes.filterMode);
  const [fetching, setFetching] = useState(false);

  const fetchFilteredNotes = async (mode) => {
    try {
      setFetching(true);

      const payload = {
        mode: mode.toLowerCase(),
        userId: user?.id || null,
        query,
      };

      const res = await axios.post("/api/notes/filter", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Axios automatically parses JSON
      dispatch(setFilteredNotes(res.data));
    } catch (error) {
      console.error(
        error.response?.data?.error || "Error fetching notes",
        error
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFilteredNotes(filterMode);
  }, [filterMode, user?.id]);

  const previewText = (html) => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]*>/g, "");
    return stripped.length > 120 ? stripped.slice(0, 120) + "..." : stripped;
  };

  return (
    <div className="p-3 bg-gray-50 h-[95vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <NotesHeader
            query={query}
            setQuery={(q) => dispatch(setQuery(q))}
            NotesHeader
            onRefresh={() => fetchFilteredNotes(filterMode)} // ✅ pass refresh
          />
          <button
            onClick={() => dispatch(toggleShowImages())}
            className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 mt-12">
            <span className="text-[0.6rem] sm:text-lg">
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
                onClick={() => {
                  dispatch(setFilterMode(type));
                }}>
                {type === "general"
                  ? "General"
                  : type === "both"
                  ? "Both"
                  : "Personal"}
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
              fetchNotesFunction={() => fetchFilteredNotes(filterMode)}
            />

            <NotesMobileList
              loading={loading || fetching}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => dispatch(setDeletingId(id))}
              fetchNotesFunction={() => fetchFilteredNotes(filterMode)}
            />
          </div>
        )}

        {/* Confirm delete modal */}
        {deletingId && (
          <ConfirmDeleteModal
            onCancel={() => dispatch(setDeletingId(null))}
            onConfirm={async () => {
              await dispatch(deleteNote(deletingId));
              fetchFilteredNotes(filterMode); // ✅ refetch after delete
            }}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
}
