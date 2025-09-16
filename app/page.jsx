"use client";
import React, { useState, useRef } from "react";
import EditorsSection from "../components/EditorsSection";
import FilesTable from "../components/FilesTable";
import { GeminiChatBot } from "../components";

export default function Page() {
  const [files] = useState([
    { id: 1, name: "report.pdf", size: "2 MB", time: "2025-08-10 10:15" },
    { id: 2, name: "image.png", size: "1.2 MB", time: "2025-08-09 18:32" },
    { id: 3, name: "notes.docx", size: "900 KB", time: "2025-08-08 14:50" },
  ]);

  return (
    <div className="flex flex-col p-4 z-[100] lg:p-8 h-full bg-gray-50 overflow-x-hidden justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <EditorsSection />
        <FilesTable files={files} />
      </div>
    </div>
  );
}
