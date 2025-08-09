"use client";
import React from "react";

export default function FilesTable({ files }) {
  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Uploaded Files
      </h2>
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-200 text-gray-900">
          <tr>
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Size</th>
            <th className="py-2 px-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-b last:border-none hover:bg-gray-100">
              <td className="py-2 px-3">{file.id}</td>
              <td className="py-2 px-3">{file.name}</td>
              <td className="py-2 px-3">{file.size}</td>
              <td className="py-2 px-3">{file.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
