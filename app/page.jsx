"use client";
import React, { useState } from "react";

import { EditorsSection, FilesTable } from "../components";

export default function Page() {
  const [files] = useState([
    { id: 1, name: "report.pdf", size: "2 MB", time: "2025-08-10 10:15" },
    { id: 2, name: "image.png", size: "1.2 MB", time: "2025-08-09 18:32" },
    { id: 3, name: "notes.docx", size: "900 KB", time: "2025-08-08 14:50" },
  ]);

  return (
    <div className="flex flex-col min-h-[90vh] bg-white p-6 z-[100]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <EditorsSection />
        <FilesTable files={files} />
      </div>
    </div>
  );
}
