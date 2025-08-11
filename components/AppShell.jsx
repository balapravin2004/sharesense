// components/AppShell.jsx
"use client";

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-blue-900 rounded-tl-2xl rounded-bl-2xl">
      {children}

      <Toaster position="top-center" />
    </div>
  );
}
//adding something here
