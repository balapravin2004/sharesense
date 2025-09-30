import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFiles, deleteFile as deleteFileAction } from "../store/uploadSlice";
import {
  FiSearch,
  FiRefreshCcw,
  FiDownload,
  FiTrash2,
  FiShare2,
} from "react-icons/fi";
import { AiOutlineFile } from "react-icons/ai";
import FullscreenFilesModal from "./FullscreenFilesModal";

export default function FilesTable() {
  const dispatch = useDispatch();
  const files = useSelector((s) => s.uploads.files || []);

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFull, setOpenFull] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/alluploadedfiles");
      dispatch(setFiles(res.data.files || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return files;
    const lower = q.toLowerCase();
    return files.filter((f) =>
      (f.filename || "").toLowerCase().includes(lower)
    );
  }, [files, q]);

  const humanFileSize = (size) => {
    if (!size) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB"];
    return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const shareFile = async (file) => {
    const shareUrl = file.url;
    if (navigator.share) {
      try {
        await navigator.share({ title: file.filename, url: shareUrl });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const handleDelete = async (fileId) => {
    setSelected((prev) => new Set(prev).add(fileId));
    try {
      const res = await fetch(`/api/deletefile/${fileId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      dispatch(deleteFileAction(fileId));

      // Refetch all files after deletion
      await load();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="sticky top-0 bg-white z-20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b shadow-sm rounded-b-xl transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={load}
            title="Refresh"
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border shadow hover:shadow-md hover:scale-[1.02] flex items-center gap-2 transition-all">
            <FiRefreshCcw />
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hidden md:block max-h-[30rem] overflow-y-auto transition-all hover:shadow-xl">
        <table className="w-full table-auto text-sm border-collapse">
          <tbody>
            {filtered.map((f) => (
              <tr
                key={f.id}
                className="hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01] transition-all duration-200">
                <td className="px-3 py-4 flex items-center gap-3 break-all">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 shadow-inner">
                    <AiOutlineFile className="text-lg" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {f.filename} ({humanFileSize(f.size)})
                    </div>
                    <div className="text-xs text-gray-400">
                      {f.description || "—"}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex justify-end items-center gap-2">
                    <a
                      href={f.url}
                      download={f.filename}
                      className="p-2 border rounded-lg hover:bg-gray-50 hover:shadow transition-all flex items-center justify-center">
                      <FiDownload />
                    </a>
                    <button
                      onClick={() => shareFile(f)}
                      className="p-2 border rounded-lg hover:bg-gray-50 hover:shadow transition-all">
                      <FiShare2 />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2 border rounded-lg hover:bg-red-50 hover:shadow text-red-600 flex items-center justify-center transition-all"
                      disabled={selected.has(f.id)}>
                      {selected.has(f.id) ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} className="px-3 py-6 text-center text-gray-400">
                  {loading ? "Loading..." : "No files found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 overflow-auto max-h-[25rem] mb-[2rem]">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="border rounded-xl p-3 bg-white shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 shadow-inner">
                <AiOutlineFile size={16} />
              </div>
              <div className="flex-1">
                <div className="font-medium break-all text-[0.7rem] leading-tight text-gray-800">
                  {f.filename} ({humanFileSize(f.size)})
                </div>
                <div className="text-[0.65rem] text-gray-500">
                  {f.description || "—"}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <a
                    href={f.url}
                    download={f.filename}
                    className="p-1 border rounded-md hover:bg-gray-50 hover:shadow flex items-center justify-center transition-all">
                    <FiDownload size={14} />
                  </a>
                  <button
                    onClick={() => shareFile(f)}
                    className="p-1 border rounded-md hover:bg-gray-50 hover:shadow flex items-center justify-center transition-all">
                    <FiShare2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1 border rounded-md hover:bg-red-50 hover:shadow text-red-600 flex items-center justify-center transition-all"
                    disabled={selected.has(f.id)}>
                    {selected.has(f.id) ? (
                      <div className="w-3 h-3 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <FullscreenFilesModal
        open={openFull}
        onClose={() => setOpenFull(false)}
        files={filtered}
        reload={load}
      />
    </div>
  );
}
