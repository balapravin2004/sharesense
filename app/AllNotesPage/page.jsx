"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { Upload, Trash2, Loader2 } from "lucide-react";

export default function Page() {
  const [notes, setNotes] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchAllNotes = async () => {
    const loadingToast = toast.loading("Fetching notes...");
    try {
      const res = await axios.get("/api/allnotes");
      setNotes(res.data);
      toast.dismiss(loadingToast);
      toast.success("Notes loaded");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error fetching notes");
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await axios.delete(`/api/deletenote/${id}`);
      toast.success("Deleted successfully");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.log("error");
      console.log(error.message);
      toast.error("Error deleting note");
    }
    setLoadingDelete(false);
    setDeleteId(null);
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div className={`p-6 bg-gray-50 min-h-screen`}>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">All Notes</h2>
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border w-12">ID</th>
              <th className="p-3 border">NOTE</th>
              <th className="p-3 border">TIME</th>
              <th className="p-3 border">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? (
              notes.map((note, index) => {
                const preview =
                  note.content.length > 100
                    ? note.content.slice(0, 100) + "..."
                    : note.content;
                return (
                  <tr key={note.id || index} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td
                      className="p-3 border max-w-xs sm:max-w-sm lg:max-w-md overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: preview }}
                    />
                    <td className="p-3 border">
                      {note.timing
                        ? new Date(note.timing).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3 border flex gap-2">
                      <button className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                        <Upload size={16} />
                      </button>
                      <button
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                        onClick={() => setDeleteId(note.id)}>
                        {loadingDelete && deleteId === note.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No notes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmDeleteModal
          onCancel={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
}
