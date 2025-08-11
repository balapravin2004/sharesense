"use client";
import React, { useState, useRef, useEffect } from "react";

/**
 * FilesTable (enhanced)
 * - shows files (prop: files)
 * - Upload button opens modal
 * - Simulated upload with progress bar & status
 * - Very responsive (table scrolls on small screens)
 *
 * Optional prop:
 * - onUpload(fileMeta) => called when upload completes (so parent can add file)
 */

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export default function FilesTable({ files = [], onUpload }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("Ready");
  const uploadIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    };
  }, []);

  const openModal = () => {
    setSelectedFile(null);
    setProgress(0);
    setStatusText("Ready");
    setModalOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    // stop any running simulated upload
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setStatusText("Ready");
    setModalOpen(false);
  };

  const handleFilePick = (e) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    setStatusText(f ? `Selected: ${f.name}` : "Ready");
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setStatusText("Uploading...");
    setProgress(0);

    // Simulate upload speed proportional to file size (but capped)
    const sizeKB = Math.max(1, Math.round((file.size || 0) / 1024));
    // duration between 1.5s and 8s depending on size
    const targetDuration = Math.min(8000, Math.max(1500, sizeKB * 10));
    const stepMs = 200;
    const steps = Math.ceil(targetDuration / stepMs);
    let step = 0;

    uploadIntervalRef.current = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));
      setProgress(pct);
      setStatusText(`Uploading... ${pct}%`);

      // occasional small jitter
      if (pct >= 100) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
        setUploading(false);
        setStatusText("Processing...");

        // small delay to simulate server processing
        setTimeout(() => {
          setStatusText("Completed");
          setProgress(100);

          // build file meta and notify parent
          const fileMeta = {
            id: `file-${Date.now()}`,
            name: file.name,
            size: formatBytes(file.size),
            time: new Date().toISOString(),
            url: URL.createObjectURL(file), // client-only demo
          };

          if (typeof onUpload === "function") {
            onUpload(fileMeta);
          }

          // close modal after a short moment
          setTimeout(() => {
            closeModal();
          }, 700);
        }, 700);
      }
    }, stepMs);
  };

  const handleStartUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusText("Please select a file first");
      return;
    }
    // start simulated upload
    simulateUpload(selectedFile);
  };

  const handleCancelUpload = () => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setStatusText("Cancelled");
  };

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl shadow p-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Uploaded Files
          </h2>
          <p className="text-sm text-gray-500">
            Files uploaded to the secure area
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openModal}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-sm">
            Upload File
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
                  className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-2 px-3 align-top">{file.id}</td>
                  <td className="py-2 px-3 align-top max-w-xs truncate">
                    {file.name}
                  </td>
                  <td className="py-2 px-3 align-top">{file.size}</td>
                  <td className="py-2 px-3 align-top">{file.time}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          // client side download demo — only works for URL created in client
                          if (file.url) {
                            const a = document.createElement("a");
                            a.href = file.url;
                            a.download = file.name;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          } else {
                            alert("Download not available in demo");
                          }
                        }}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">
                        Download
                      </button>
                      <button
                        onClick={() => {
                          // remove file (demo)
                          if (typeof onUpload === "function") {
                            // parent should handle removal; but we can't mutate parent files here without a callback
                            // so we just alert if no callback provided
                            const ok = confirm("Remove this file?");
                            if (ok) {
                              // if parent provided onUpload, they probably provided a remove handler; not in this signature
                              alert(
                                "Please implement removal in parent (onUpload callback or dedicated handler)"
                              );
                            }
                          } else {
                            alert(
                              "Removal requires parent handler in this demo"
                            );
                          }
                        }}
                        className="px-2 py-1 rounded-md bg-red-50 text-red-600 text-sm">
                        Remove
                      </button>
                    </div>
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
            <h3 className="text-lg font-semibold mb-3">Upload file</h3>

            <form onSubmit={handleStartUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Choose file
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFilePick}
                    className="mt-2 block w-full"
                    aria-label="File input"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Expiration (minutes)
                  </span>
                  <input
                    type="number"
                    min="1"
                    defaultValue={60}
                    onChange={(e) => {
                      const m = Number(e.target.value) || 1;
                      // store as dataset on selectedFile if available; simpler to use closure when starting upload
                      // We'll store expirationMinutes in a ref on selectedFile for demo:
                      if (selectedFile) selectedFile.expirationMinutes = m;
                      // also update status
                      setStatusText(`Expires in ${m} minute(s)`);
                    }}
                    className="mt-2 block w-full border border-gray-200 rounded px-3 py-2"
                  />
                </label>
              </div>

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

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2">
                {!uploading ? (
                  <>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded-md border">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      Start Upload
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="px-4 py-2 rounded-md border">
                      Cancel Upload
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
