"use client";

import React from "react";
import { Search, RefreshCw } from "lucide-react";

export default function NotesHeader({ query, setQuery, onRefresh }) {
  return (
    <div className="space-y-3 mb-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">All Notes</h1>
        <p className="text-sm text-gray-500 mt-1">
          View, search and manage your notes
        </p>
      </div>

      {/* Sticky search + refresh bar */}
      <div className="z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-md shadow-sm">
        <div className="flex items-center gap-2 p-2">
          <div className="relative w-full sm:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-label="Search notes"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <button
            onClick={() => {
              onRefresh();
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            aria-label="Refresh notes">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
