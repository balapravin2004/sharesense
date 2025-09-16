"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllNotes,
  deleteNote,
  setQuery,
  toggleShowImages,
  setDeletingId,
} from "../../store/notesSlice";

import NotesHeader from "../../components/NotesHeader";
import NotesTable from "../../components/NotesTable";
import NotesMobileList from "../../components/NotesMobileList";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import NotesImages from "../../components/NotesImages";

export default function AllNotesPage() {
  const dispatch = useDispatch();
  const { notes, filteredNotes, loading, deletingId, query, showImages } =
    useSelector((state) => state.notes);

  // Fetch notes only if not loaded already
  useEffect(() => {
    if (notes.length === 0) dispatch(fetchAllNotes());
  }, [dispatch, notes.length]);

  const previewText = (html) => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]*>/g, "");
    return stripped.length > 120 ? stripped.slice(0, 120) + "..." : stripped;
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
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

        {showImages ? (
          <NotesImages visible={showImages} />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <NotesTable
              loading={loading}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => dispatch(setDeletingId(id))}
            />
            <NotesMobileList
              loading={loading}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => dispatch(setDeletingId(id))}
            />
          </div>
        )}

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
