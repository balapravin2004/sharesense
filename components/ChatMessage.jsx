"use client";

import React, { useState, useEffect } from "react";

/**
 * Props:
 *  - sender
 *  - message (string)
 *  - file: optional { filename, mime, size, raw } // raw is ArrayBuffer/Buffer from socket or outgoing metadata
 *  - isOwnMessage
 */
export default function ChatMessage({ sender, message, file, isOwnMessage }) {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!file?.raw) return;

    try {
      let blob;
      if (file.raw instanceof ArrayBuffer) {
        blob = new Blob([file.raw], {
          type: file.mime || "application/octet-stream",
        });
      } else if (file.raw?.data && Array.isArray(file.raw.data)) {
        blob = new Blob([new Uint8Array(file.raw.data)], {
          type: file.mime || "application/octet-stream",
        });
      } else if (file.raw instanceof Uint8Array) {
        blob = new Blob([file.raw], {
          type: file.mime || "application/octet-stream",
        });
      } else {
        blob = new Blob([file.raw], {
          type: file.mime || "application/octet-stream",
        });
      }

      const url = URL.createObjectURL(blob);
      setFileUrl(url);

      return () => URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create blob url for incoming file", err);
    }
  }, [file]);

  const isImage = file?.mime?.startsWith?.("image/");

  return (
    <div
      className={`flex w-full ${
        isOwnMessage ? "justify-end" : "justify-start"
      } px-2 my-2`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] p-3 rounded-xl shadow-md 
          ${
            isOwnMessage ? "bg-blue-50 text-gray-800" : "bg-white text-gray-900"
          }
          border ${isOwnMessage ? "border-blue-200" : "border-gray-200"}
          flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.01]`}>
        {/* Sender */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500">{sender}</span>
        </div>

        {/* Message Text */}
        {message && (
          <p className="text-sm leading-snug break-words">{message}</p>
        )}

        {/* File */}
        {file && (
          <div className="mt-2 border rounded-lg p-2 bg-gray-50 flex flex-col md:flex-row md:items-center gap-3 shadow-inner">
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {file.filename}
              </div>
              <div className="text-xs text-gray-400">
                {Math.round((file.size || 0) / 1024)} KB • {file.mime}
              </div>
            </div>

            {/* File Preview for images */}
            {fileUrl && isImage && (
              <a href={fileUrl} target="_blank" rel="noreferrer">
                <img
                  src={fileUrl}
                  alt={file.filename}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                />
              </a>
            )}

            {/* Download button only for received files */}
            {!isOwnMessage && fileUrl && (
              <a
                href={fileUrl}
                download={file.filename}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md font-medium shadow-sm transition-colors">
                Download
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
