"use client";

import React from "react";
import {
  Home,
  FileText,
  Lock,
  UserPlus,
  Info,
  LogIn,
  Users,
  Share2,
  Key,
  Layers,
} from "lucide-react";

export default function Page() {
  return (
    <div className="w-full min-h-screen p-4 md:p-12 bg-gray-50 text-gray-900">
      <div className="max-w-[90rem] mx-auto bg-white rounded-lg shadow-lg p-6 md:p-12 space-y-8">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-600 text-center">
          How to Use ShareBro
        </h1>

        {/* Introduction */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Introduction
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            ShareBro is a secure note-taking and file-sharing platform that
            allows you to create notes, share them in rooms, and collaborate in
            real-time. Unlike traditional methods like scanning a WhatsApp QR
            code to share files, ShareBro lets you share files and notes
            instantly with other users, securely and efficiently. This guide
            will walk you through the platform’s features and usage.
          </p>
        </section>

        {/* Features Overview */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Features Overview
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>
              <FileText className="inline-block mr-2" /> Create, view, and
              manage all your notes.
            </li>
            <li>
              <Lock className="inline-block mr-2" /> Securely share notes and
              files in private rooms.
            </li>
            <li>
              <UserPlus className="inline-block mr-2" /> Create or join chat
              rooms for real-time collaboration.
            </li>
            <li>
              <Info className="inline-block mr-2" /> Access project details,
              settings, and help information.
            </li>
            <li>
              <LogIn className="inline-block mr-2" /> Login to save your notes,
              files, and preferences.
            </li>
            <li>
              <Share2 className="inline-block mr-2" /> Instantly share files
              without relying on WhatsApp QR scanning.
            </li>
          </ul>
        </section>

        {/* Upload Modes */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Upload Notes & Files
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            After login, users can upload notes in three different modes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>
              <Layers className="inline-block mr-2" />
              <strong>General:</strong> Notes are visible to all users.
            </li>
            <li>
              <Users className="inline-block mr-2" />
              <strong>Both:</strong> Notes are uploaded to General and a private
              copy for the user.
            </li>
            <li>
              <Key className="inline-block mr-2" />
              <strong>User Only:</strong> Notes are uploaded privately and
              accessible only by the user.
            </li>
          </ul>
        </section>

        {/* Getting Started */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Getting Started
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>
              <strong>Login or Sign Up:</strong> Create an account or sign in.
            </li>
            <li>
              <strong>Home Page:</strong> Access your notes and upload files.
            </li>
            <li>
              <strong>All Notes:</strong> Click{" "}
              <FileText className="inline-block mr-1" />
              All Notes to view all notes.
            </li>
            <li>
              <strong>Secure Share:</strong> Use{" "}
              <Lock className="inline-block mr-1" />
              Secure Share to share notes privately.
            </li>
            <li>
              <strong>Make Room:</strong> Click{" "}
              <UserPlus className="inline-block mr-1" />
              Make Room to create a chat room.
            </li>
            <li>
              <strong>Settings / Info:</strong> Access{" "}
              <Info className="inline-block mr-1" />
              Info for project details and settings.
            </li>
          </ol>
        </section>

        {/* Chat & File Sharing */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Using the Chat & File Sharing
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            1. Join a chat room by entering your username and room name.
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            2. Send messages, attach multiple files, and see messages from
            others in real-time.
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            3. Files appear as horizontally scrollable thumbnails. Click to
            preview or remove before sending.
          </p>
        </section>

        {/* Tips & Best Practices */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Tips & Best Practices
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>Keep file names short to avoid truncation in the preview.</li>
            <li>Use meaningful room names to organize chats efficiently.</li>
            <li>Always log out when using public computers.</li>
            <li>Use "User Only" mode for sensitive notes.</li>
          </ul>
        </section>

        {/* Help Section */}
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Need Help?
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Contact the project maintainer or refer to the README.md for setup
            and troubleshooting instructions.
          </p>
        </section>
      </div>
    </div>
  );
}
