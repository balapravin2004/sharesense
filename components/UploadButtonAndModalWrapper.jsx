// components/UploadButtonAndModalWrapper.jsx
import React, { useState } from "react";
import UploadModal from "./UploadModal";
import FilesTable from "./FilesTable";

export default function UploadButtonAndModalWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 border border-none">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold">Files</div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:brightness-95">
          Upload files
        </button>
      </div>

      <FilesTable />

      <UploadModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
