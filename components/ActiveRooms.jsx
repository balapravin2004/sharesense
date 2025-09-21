"use client";

import React from "react";

export default function ActiveRooms({ rooms }) {
  return (
    <div className="mb-6 w-full h-full overflow-auto p-2 rounded-lg shadow-sm bg-white border">
      {/* Responsive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {rooms.map((r) => (
          <div
            key={r.room}
            className="flex flex-col justify-between p-4 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition w-full">
            <span className="font-semibold text-blue-700 text-lg">
              {r.room}
            </span>
            <span className="text-gray-500 text-sm mt-1">Users: {r.users}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
