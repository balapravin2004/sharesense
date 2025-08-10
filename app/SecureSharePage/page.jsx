"use client";
import React, { useEffect, useState, useRef } from "react";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function formatRemaining(ms) {
  if (ms <= 0) return "Expired";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hrs = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (days) return `${days}d ${hrs}h`;
  if (hrs) return `${hrs}h ${mins}m`;
  if (mins) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function SecureSharePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState([]); // { id, name, size, url, password, expiresAt, createdAt }
  const fileRef = useRef(null);
  const [password, setPassword] = useState("");
  const [duration, setDuration] = useState(60 * 60 * 1000); // default 1 hour in ms
  const [customMinutes, setCustomMinutes] = useState(60);

  // tick for countdowns & cleanup expired files
  useEffect(() => {
    const id = setInterval(() => {
      setFiles((prev) =>
        prev
          .map((f) => ({ ...f }))
          .filter((f) => {
            const expired = Date.now() >= f.expiresAt;
            if (expired) {
              URL.revokeObjectURL(f.url);
            }
            return !expired;
          })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // ensure duration follows customMinutes if set to custom option
    // not strictly necessary here but kept for clarity
  }, [customMinutes]);

  function openModal() {
    setPassword("");
    setDuration(60 * 60 * 1000);
    setCustomMinutes(60);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleDurationChange(value) {
    // value in ms or "custom"
    if (value === "custom") {
      setDuration(customMinutes * 60 * 1000);
    } else {
      setDuration(value);
    }
  }

  function handleCustomMinutesChange(v) {
    const num = Number(v) || 0;
    setCustomMinutes(num);
    setDuration(num * 60 * 1000);
  }

  function handleUploadSubmit(e) {
    e.preventDefault();
    const input = fileRef.current;
    if (!input || !input.files || !input.files[0]) {
      alert("Please select a file to upload.");
      return;
    }
    const f = input.files[0];
    const id = `file-${Date.now()}`;
    const url = URL.createObjectURL(f);
    const expiresAt = Date.now() + duration;
    const fileObj = {
      id,
      name: f.name,
      size: f.size,
      url,
      password: password || null,
      expiresAt,
      createdAt: Date.now(),
    };
    setFiles((prev) => [fileObj, ...prev]);
    closeModal();
  }

  async function handleDownload(file) {
    if (file.password) {
      const attempt = prompt("Enter password to download this file");
      if (attempt !== file.password) {
        alert("Incorrect password");
        return;
      }
    }
    // Create anchor and click
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleDelete(id) {
    setFiles((prev) => {
      const updated = prev.filter((f) => {
        if (f.id === id) URL.revokeObjectURL(f.url);
        return f.id !== id;
      });
      return updated;
    });
  }

  return (
    <div className="p-4 h-full bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Secure Share</h1>
            <p className="text-sm text-gray-500">
              Upload files with optional password and auto-expiry time.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openModal}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95">
              Upload File
            </button>
          </div>
        </div>

        {/* Files table / cards */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Shared Files</h2>

          {files.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              No files uploaded yet. Click <strong>Upload File</strong> to
              begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 bg-gray-50">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Password</th>
                    <th className="py-2 px-3">Expires In</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b last:border-none hover:bg-gray-50">
                      <td className="py-2 px-3 align-top">{f.id}</td>
                      <td className="py-2 px-3 align-top">{f.name}</td>
                      <td className="py-2 px-3 align-top">
                        {formatBytes(f.size)}
                      </td>
                      <td className="py-2 px-3 align-top">
                        {f.password ? (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="py-2 px-3 align-top">
                        <RemainingTime expiresAt={f.expiresAt} />
                      </td>
                      <td className="py-2 px-3 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(f)}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="px-2 py-1 rounded-md bg-red-50 text-red-600 text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
            />
            <div className="relative max-w-lg w-full bg-white rounded-xl shadow-lg p-6 z-10">
              <h3 className="text-lg font-semibold mb-3">
                Upload file (secure)
              </h3>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Choose file
                  </label>
                  <input ref={fileRef} type="file" className="block w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password (optional)
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="block w-full border border-gray-200 rounded px-3 py-2"
                    placeholder="Set a password (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDurationChange(60 * 60 * 1000)}
                      className="py-2 px-3 rounded bg-gray-100">
                      1 hour
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDurationChange(6 * 60 * 60 * 1000)}
                      className="py-2 px-3 rounded bg-gray-100">
                      6 hours
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDurationChange(24 * 60 * 60 * 1000)}
                      className="py-2 px-3 rounded bg-gray-100">
                      1 day
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDurationChange(7 * 24 * 60 * 60 * 1000)
                      }
                      className="py-2 px-3 rounded bg-gray-100">
                      7 days
                    </button>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-gray-500">
                      Custom (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={customMinutes}
                      onChange={(e) =>
                        handleCustomMinutesChange(e.target.value)
                      }
                      className="w-32 mt-1 border border-gray-200 rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md border">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // inner handlers
  function handleDurationChange(msOrLabel) {
    if (msOrLabel === "custom") return; // handled by input
    setDuration(msOrLabel);
    setCustomMinutes(Math.round(msOrLabel / 60000));
  }

  function handleCustomMinutesChange(v) {
    const n = Number(v) || 0;
    setCustomMinutes(n);
    setDuration(n * 60 * 1000);
  }

  function handleUploadSubmit(e) {
    e.preventDefault();
    const input = fileRef.current;
    if (!input || !input.files || !input.files[0]) {
      alert("Please pick a file");
      return;
    }
    const f = input.files[0];
    const id = `file-${Date.now()}`;
    const url = URL.createObjectURL(f);
    const expiresAt = Date.now() + duration;
    const fileObj = {
      id,
      name: f.name,
      size: f.size,
      url,
      password: password || null,
      expiresAt,
      createdAt: Date.now(),
    };
    setFiles((prev) => [fileObj, ...prev]);
    closeModal();
  }
}

// small component to show remaining time updating every second
function RemainingTime({ expiresAt }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = expiresAt - Date.now();
  return (
    <span className="text-sm text-gray-700">{formatRemaining(remaining)}</span>
  );
}
