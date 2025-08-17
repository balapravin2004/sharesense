"use client";

import React from "react";
import { X, Download } from "lucide-react";

export default function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "note-image.jpg";
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // close on overlay click
    >
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700">
          <X size={20} />
        </button>

        {/* Image */}
        <div className="flex-1 overflow-auto flex justify-center items-center p-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />
        </div>

        {/* Download button */}
        <div className="p-4 border-t flex justify-end bg-gray-50">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            <Download size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
