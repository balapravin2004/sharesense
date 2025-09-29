// components/UploadModal.jsx
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelUpload, uploadFileDirect } from "../store/uploadSlice";
import { v4 as uuidv4 } from "uuid";

const humanFileSize = (size) => {
  if (!size) return "0 B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

export default function UploadModal({ open, onClose }) {
  const dispatch = useDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const uploading = useSelector((s) => s.uploads.uploading || {});

  const fileInputRef = useRef(null);
  const overlayRef = useRef();

  const onOutsideClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach((file) => {
      const tempId = uuidv4();
      dispatch(uploadFileDirect({ file, token, tempId }));
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
  };

  const onSelectFiles = (e) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = null;
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={onOutsideClick}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2 sm:p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col max-h-[80vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload files</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800">
            Close
          </button>
        </div>

        {/* Drag & Drop */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-medium">Drag & drop files here</p>
          <p className="text-sm text-gray-500">or</p>

          <div className="flex gap-3 flex-wrap justify-center">
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
              Upload files
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={onSelectFiles}
                className="hidden"
              />
            </label>
            <button
              className="px-4 py-2 border rounded-lg"
              onClick={() => fileInputRef.current?.click()}>
              Choose from computer
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            You can upload multiple files — images, docs, audio, video, etc.
          </p>
        </div>

        {/* Uploading list */}
        <div className="mt-6 flex-1 flex flex-col overflow-hidden">
          <h4 className="text-sm font-medium mb-2">Uploading</h4>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {Object.keys(uploading).length === 0 && (
              <div className="text-sm text-gray-500">No active uploads</div>
            )}

            {Object.entries(uploading).map(([tempId, entry]) => (
              <div
                key={tempId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold">
                    {entry.name.split(".").pop()?.toUpperCase() || "F"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {entry.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {entry.type || "—"} • {humanFileSize(entry.size)}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-gray-200 h-2 rounded overflow-hidden">
                      <div
                        style={{ width: `${entry.progress}%` }}
                        className="h-2 rounded bg-blue-600 transition-all duration-300 ease-in-out"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-xs text-gray-600 min-w-[40px] text-right">
                    {entry.progress}%
                  </div>
                  <button
                    onClick={() => dispatch(cancelUpload(tempId))}
                    className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
