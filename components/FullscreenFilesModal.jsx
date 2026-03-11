import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiDownload, FiTrash2, FiShare2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import axios from "axios";
import { removeFile, setFiles } from "../store/uploadSlice";

export default function FullscreenFilesModal({
  open,
  onClose,
  files = [],
  reload,
}) {
  const dispatch = useDispatch();
  const overlayRef = useRef();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [working, setWorking] = useState(false);
  const [allFiles, setAllFiles] = useState(files);

  useEffect(() => setAllFiles(files), [files]);

  const onOutside = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const humanFileSize = (size) => {
    if (!size) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB"];
    return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const filtered = useMemo(() => {
    if (!q) return allFiles;
    const L = q.toLowerCase();
    return allFiles.filter((f) => (f.filename || "").toLowerCase().includes(L));
  }, [allFiles, q]);

  const toggle = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((f) => f.id)));
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    setWorking(true);
    try {
      const ids = Array.from(selected);
      await Promise.all(ids.map((id) => axios.delete(`/api/deletefile/${id}`)));
      // optimistic update - remove from local list and redux
      ids.forEach((id) => dispatch(removeFile(id)));
      setSelected(new Set());
      if (reload) reload();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    } finally {
      setWorking(false);
    }
  };

  const shareFile = async (file) => {
    // prefer native share
    const shareUrl = file.url;
    if (navigator.share) {
      try {
        await navigator.share({ title: file.filename, url: shareUrl });
      } catch (e) {
        // cancelled
      }
    } else {
      // fallback copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard");
      } catch (e) {
        alert("Copy failed");
      }
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onOutside}
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-6 overflow-auto">
      <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-2xl p-6 mt-6 mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by filename..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={toggleAll} className="px-3 py-2 border rounded">
                Select all
              </button>
              <button
                onClick={deleteSelected}
                className={`px-3 py-2 rounded text-white ${
                  selected.size ? "bg-red-600" : "bg-gray-300"
                }`}
                disabled={!selected.size || working}>
                <FiTrash2 /> <span className="ml-2">Delete</span>
              </button>
            </div>
          </div>

          <div>
            <button onClick={onClose} className="px-3 py-2 border rounded">
              Close
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-3 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selected.size === filtered.length && filtered.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-3">Filename</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Size</th>
                <th className="px-3 py-3">Uploaded At</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(f.id)}
                      onChange={() => toggle(f.id)}
                    />
                  </td>
                  <td className="px-3 py-4 break-all">{f.filename}</td>
                  <td className="px-3 py-4">{f.mimeType || "—"}</td>
                  <td className="px-3 py-4">{humanFileSize(f.size)}</td>
                  <td className="px-3 py-4">
                    {new Date(f.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-4 flex items-center gap-2">
                    <a
                      href={f.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 border rounded flex items-center gap-2 text-sm">
                      <FiDownload />{" "}
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    <button
                      onClick={() => shareFile(f)}
                      className="px-2 py-1 border rounded flex items-center gap-2 text-sm">
                      <FiShare2 />{" "}
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this file?")) return;
                        try {
                          await axios.delete(`/api/deletefile/${f.id}`);
                          dispatch(removeFile(f.id));
                          if (reload) reload();
                        } catch (e) {
                          console.error(e);
                          alert("Delete failed");
                        }
                      }}
                      className="px-2 py-1 border rounded text-red-600 text-sm">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-gray-400">
                    No files
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
