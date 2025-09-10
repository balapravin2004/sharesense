"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export default function FilesTable() {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `file-${Date.now()}-${file.name}`,
      name: file.name,
      size: formatBytes(file.size),
      progress: 0,
      status: "Uploading...",
      raw: file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (let f of newFiles) {
      await uploadFile(f);
    }
  };

  const uploadFile = async (fileObj) => {
    const formData = new FormData();
    formData.append("file", fileObj.raw);

    try {
      await axios.post("/api/filesupload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id ? { ...f, progress: pct } : f
              )
            );
          }
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id
            ? { ...f, progress: 100, status: "Completed" }
            : f
        )
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: "Error" } : f
        )
      );
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl shadow p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        >
          Upload Files
        </button>
      </div>

      {/* Files Table */}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Size</th>
            <th className="py-2 px-3">Progress</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-400">
                No files yet
              </td>
            </tr>
          ) : (
            files.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="px-3 py-2">{f.name}</td>
                <td className="px-3 py-2">{f.size}</td>
                <td className="px-3 py-2 w-40">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="h-2 bg-green-500 rounded"
                      style={{ width: `${f.progress}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-3 py-2">{f.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Files</h3>

            {/* Drag & Drop Zone */}
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center text-gray-600 mb-4"
            >
              Drag & Drop your Files here
              <br />
              <span className="text-sm">or</span>
              <br />
              <button
                onClick={() => fileInputRef.current.click()}
                className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg"
              >
                Browse Files
              </button>
              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-2 px-4 py-2 border rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
