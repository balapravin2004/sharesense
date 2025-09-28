// === File: components/FilesTable.jsx ===
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
  const [working, setWorking] = useState(false);

  useEffect(() => load(), []);

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

  const filtered = useMemo(() => {
    if (!q) return files;
    const lower = q.toLowerCase();
    return files.filter((f) =>
      (f.filename || "").toLowerCase().includes(lower)
    );
  }, [files, q]);

  const toggle = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((f) => f.id)));
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    setWorking(true);
    try {
      const ids = Array.from(selected);
      await Promise.all(ids.map((id) => axios.delete(`/api/deletefile/${id}`)));
      ids.forEach((id) => dispatch(deleteFileAction(id)));
      setSelected(new Set());
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    } finally {
      setWorking(false);
    }
  };

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
        alert("Link copied");
      } catch {
        alert("Copy failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Sticky top controls */}
      <div className="sticky top-0 bg-white z-20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={load}
            title="Refresh"
            className="px-3 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <FiRefreshCcw />
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200 hidden md:block max-h-[30rem] overflow-y-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="sticky top-[-5px] bg-white z-10">
            <tr className="text-left text-gray-600">
              {/* <th className="px-3 py-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    selected.size === filtered.length && filtered.length > 0
                  }
                  onChange={toggleAll}
                />
              </th> */}
              <th className="px-3 py-3 font-medium">Filename</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                {/* <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    checked={selected.has(f.id)}
                    onChange={() => toggle(f.id)}
                  />
                </td> */}
                <td className="px-3 py-4 flex items-center gap-3 break-all">
                  <AiOutlineFile className="text-xl text-gray-600" />
                  <div>
                    <div className="font-medium">
                      {f.filename} ({humanFileSize(f.size)})
                    </div>
                    <div className="text-xs text-gray-400">
                      {f.description || "—"}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 flex items-center gap-2">
                  <a
                    href={f.url}
                    download
                    className="p-2 border rounded hover:bg-gray-50">
                    <FiDownload />
                  </a>
                  <button
                    onClick={() => shareFile(f)}
                    className="p-2 border rounded hover:bg-gray-50">
                    <FiShare2 />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this file?")) return;
                      try {
                        await axios.delete(`/api/deletefile/${f.id}`);
                        dispatch(deleteFileAction(f.id));
                      } catch {
                        alert("Delete failed");
                      }
                    }}
                    className="p-2 border rounded hover:bg-red-50 text-red-600">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-400">
                  {loading ? "Loading..." : "No files found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 overflow-auto max-h-[30rem] mb-[3rem]">
        {filtered.map((f) => (
          <div key={f.id} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl text-gray-600">
                <AiOutlineFile />
              </div>
              <div className="flex-1">
                <div className="font-medium break-all">
                  {f.filename} ({humanFileSize(f.size)})
                </div>
                <div className="text-xs text-gray-400">
                  {f.description || "—"}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={f.url}
                    download
                    className="p-2 border rounded hover:bg-gray-50">
                    <FiDownload />
                  </a>
                  <button
                    onClick={() => shareFile(f)}
                    className="p-2 border rounded hover:bg-gray-50">
                    <FiShare2 />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this file?")) return;
                      try {
                        await axios.delete(`/api/deletefile/${f.id}`);
                        dispatch(deleteFileAction(f.id));
                      } catch {
                        alert("Delete failed");
                      }
                    }}
                    className="p-2 border rounded hover:bg-red-50 text-red-600">
                    <FiTrash2 />
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
