'use client';

import {
  File,
  Home,
  Search,
  User,
  FileText,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import type { UploadRouter } from './api/uploadthing/core';

export default function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState<{
    name: string;
    url: string;
    date: string;
  }[]>([]);

  // ✅ Fetch all uploaded files on load
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/uploadthing/list');
        const data = await res.json();
        const files = Array.isArray(data.files) ? data.files : [];

        setUploadedFiles(
          files.map((file: any) => ({
            name: file.name,
            url: file.url,
            date: new Date(file.uploadedAt).toLocaleDateString(),
          }))
        );
      } catch (err) {
        console.error('Failed to fetch files:', err);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-6 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3">
          <a href="/" className="p-3 hover:bg-white/10 rounded-full transition">
            <Home className="w-9 h-9 text-cyan-200" />
          </a>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Easy Share</h1>
            <p className="text-sm text-white/80">Secure File Sharing Made Simple</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="p-4 bg-white/20 text-white rounded-full shadow hover:bg-white/30 transition">
            <FileText className="w-7 h-7" />
          </button>
          <button className="w-14 h-14 bg-white/20 text-white rounded-full shadow hover:bg-white/30 transition flex items-center justify-center px-1">
            <div className="flex -space-x-2">
              <User className="w-5 h-5" />
              <User className="w-5 h-5" />
              <User className="w-5 h-5" />
            </div>
          </button>
          <button className="p-4 bg-white/20 text-white rounded-full shadow hover:bg-white/30 transition">
            <User className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row justify-center items-start gap-10 px-6 py-12">
        {/* Upload Section */}
        <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
          <div className="w-full">
            <UploadButton<UploadRouter, "uploadFile">
              endpoint="uploadFile"
              onClientUploadComplete={(res) => {
                if (!res) return;
                const uploaded = res.map(file => ({
                  name: file.name,
                  url: file.url,
                  date: new Date().toLocaleDateString(),
                }));
                setUploadedFiles(prev => [...prev, ...uploaded]);
              }}
              onUploadError={(error) => {
                alert(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button: 'w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-5 rounded-3xl shadow-md hover:brightness-110',
                container: 'flex justify-center items-center h-[420px] border-2 border-blue-400 rounded-3xl bg-white/60 backdrop-blur-md',
              }}
            />
          </div>

          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg py-3 px-20 rounded-full shadow-md transition-all duration-200 hover:scale-105">
            Secure Share
          </button>
        </div>

        {/* File List Section */}
        <div className="flex flex-col items-center gap-6 w-full lg:w-2/3">
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-0 shadow-2xl w-full h-[420px] flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 p-6">
              <table className="w-full text-blue-900 text-sm md:text-base">
                <thead className="sticky top-0 bg-white/70 backdrop-blur-sm z-10">
                  <tr className="font-bold text-left border-b pb-2">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, index) => (
                    <tr key={index} className="border-t text-blue-800">
                      <td className="py-3 flex items-center gap-2">
                        <File className="text-blue-500" /> {file.name}
                      </td>
                      <td>{file.date}</td>
                      <td>
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.name;
                            a.click();
                          }}
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-4 py-1 rounded-full hover:opacity-90 transition-all duration-200"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center bg-blue-200 text-blue-900 px-4 py-3 w-full">
              <Search className="w-5 h-5 mr-2 text-blue-800" />
              <input
                type="text"
                placeholder="Search file..."
                className="bg-transparent w-full text-blue-900 placeholder-blue-700 outline-none"
              />
            </div>
          </section>

          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg py-3 px-20 rounded-full shadow-md transition-all duration-200 hover:scale-105">
            Instant Receive
          </button>
        </div>
      </main>
    </div>
  );
}
