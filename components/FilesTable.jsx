"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export default function FilesTable({ files = [], onUpload }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("Ready");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  const openModal = () => {
    setSelectedFiles([]);
    setProgress(0);
    setStatusText("Ready");
    setModalOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    setUploading(false);
    setProgress(0);
    setStatusText("Ready");
    setModalOpen(false);
  };

  // Handle file picker (multiple select)
  const handleFilePick = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setStatusText(files.length ? `${files.length} file(s) selected` : "Ready");
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setStatusText(`${files.length} file(s) added via drag & drop`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Upload to backend
  const handleStartUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      setStatusText("Please select at least one file");
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatusText("Uploading...");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file); // backend expects "file"
      });

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        },
      });

      if (res.status === 200) {
        const uploaded = res.data.links || [];
        setStatusText("Upload completed!");
        setProgress(100);

        // Notify parent
        if (typeof onUpload === "function") {
          uploaded.forEach((file) => {
            onUpload({
              id: `file-${Date.now()}`,
              name: file.name,
              size: formatBytes(file.size),
              time: new Date().toISOString(),
              url: file.url,
            });
          });
        }

        setTimeout(() => closeModal(), 1000);
      } else {
        setStatusText("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatusText("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl shadow p-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
          <p className="text-sm text-gray-500">
            Files uploaded to the secure area
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-sm"
          >
            Upload Files
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Size</th>
              <th className="py-2 px-3">Uploaded</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No files yet — upload one to get started
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2 px-3 align-top">{file.id}</td>
                  <td className="py-2 px-3 align-top max-w-xs truncate">
                    {file.name}
                  </td>
                  <td className="py-2 px-3 align-top">{file.size}</td>
                  <td className="py-2 px-3 align-top">{file.time}</td>
                  <td className="py-2 px-3 text-right">
                    <a
                      href={file.url}
                      download={file.name}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative max-w-xl w-full bg-white rounded-xl shadow-lg p-5 z-10">
            <h3 className="text-lg font-semibold mb-3">Upload Files</h3>

            <form onSubmit={handleStartUpload} className="space-y-4">
              {/* Drag & Drop */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 hover:border-indigo-400"
              >
                Drag & drop files here
              </div>

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFilePick}
                className="mt-2 block w-full"
                aria-label="File input"
              />

              {/* Status + progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">{statusText}</div>
                  <div className="text-xs text-gray-400">
                    {uploading ? `${progress}%` : ""}
                  </div>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2">
                {!uploading ? (
                  <>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded-md border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    >
                      Start Upload
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 rounded-md border opacity-50"
                  >
                    Uploading...
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
