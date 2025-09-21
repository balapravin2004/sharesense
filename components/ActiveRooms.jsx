"use client";

import React from "react";

export default function ActiveRooms({ rooms }) {
  return (
    <div className="mt-6  border border-none">
      <h3 className="font-semibold text-gray-700">
        Active Rooms ({rooms.length})
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-[50vh] overflow-auto">
        {rooms.map((r) => (
          <li
            key={r.room}
            className="flex justify-between p-2 bg-blue-50 rounded-lg shadow-sm">
            <span className="font-medium">{r.room}</span>
            <span className="text-gray-500">{r.users} users</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
