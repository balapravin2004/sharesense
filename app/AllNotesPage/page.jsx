"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Image as ImageIcon, X } from "lucide-react";

import NotesHeader from "../../components/NotesHeader";
import NotesTable from "../../components/NotesTable";
import NotesMobileList from "../../components/NotesMobileList";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import NotesImages from "../../components/NotesImages";

export default function AllNotesPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [query, setQuery] = useState("");
  const [showImages, setShowImages] = useState(false);

  const fetchAllNotes = async () => {
    const toastId = toast.loading("Fetching notes...");
    setLoading(true);
    try {
      const res = await axios.get("/api/allnotes");
      const data = Array.isArray(res.data) ? res.data : res.data?.notes ?? [];
      setNotes(data);
      setFilteredNotes(data);
      toast.success("Notes loaded", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching notes", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFilteredNotes(notes);

    const filtered = notes.filter((n) => {
      const text = (n.content || "").replace(/<[^>]*>/g, "").toLowerCase();
      return text.includes(q);
    });
    setFilteredNotes(filtered);
  }, [query, notes]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/deletenote/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setFilteredNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting note");
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

  const previewText = (html) => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]*>/g, "");
    return stripped.length > 120 ? stripped.slice(0, 120) + "..." : stripped;
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <NotesHeader
            query={query}
            setQuery={setQuery}
            onRefresh={fetchAllNotes}
          />
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300 mt-12">
            {/* Desktop text */}
            <span className="hidden sm:inline">
              {showImages ? "Hide Images" : "See Images"}
            </span>

            {/* Mobile icon */}
            <span className="sm:hidden">
              {showImages ? <X size={20} /> : <ImageIcon size={20} />}
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
              onDelete={(id) => setDeleteId(id)}
              fetchNotesFunction={fetchAllNotes}
            />
            <NotesMobileList
              loading={loading}
              notes={filteredNotes}
              previewText={previewText}
              deletingId={deletingId}
              onDelete={(id) => setDeleteId(id)}
              fetchNotesFunction={fetchAllNotes}
            />
          </div>
        )}

        {deleteId && (
          <ConfirmDeleteModal
            onCancel={() => setDeleteId(null)}
            onConfirm={() => handleDelete(deleteId)}
            deletingId={deletingId === deleteId}
          />
        )}
      </div>
    </div>
  );
}
