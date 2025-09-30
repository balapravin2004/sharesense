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
  DownloadCloud,
} from "lucide-react";

export default function Page() {
  return (
    <div className="w-full min-h-screen p-4 md:p-12 bg-gray-50 text-gray-900">
      <div className="max-w-[90rem] mx-auto bg-white rounded-lg shadow-lg p-6 md:p-12 space-y-8">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-600 text-center">
          Welcome to ShareBro – Your Ultimate File Sharing Platform
        </h1>

        {/* Introduction */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Introduction
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">
              ShareBro is a secure, lightning-fast note-taking and file-sharing
              platform
            </span>{" "}
            designed to make collaboration effortless. Unlike traditional
            methods that rely on WhatsApp QR scanning or email attachments,
            ShareBro lets you{" "}
            <span className="font-semibold text-blue-600">
              instantly share notes and files
            </span>{" "}
            with anyone, anywhere, on any device.
          </p>

          <div className="mt-2 space-y-2 text-sm md:text-base text-gray-700">
            <p className="font-semibold text-gray-900">
              Install ShareBro for a native app experience on any OS – Windows,
              macOS, Linux, Android, or iOS!
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">Mobile:</span> Open ShareBro in
                your mobile browser, tap the browser menu, and select{" "}
                <span className="text-blue-600">Add to Home Screen</span> or
                Directly install from the button to the right side of the search
                bar.
              </li>
              <li>
                <span className="font-semibold">Desktop:</span> Open ShareBro in
                Chrome or Edge, click the browser menu (⋮), and select{" "}
                <span className="text-blue-600">Install ShareBro</span>.
              </li>
            </ul>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Features Overview
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>
              <FileText className="inline-block mr-2" /> Create, view, and
              manage all your notes seamlessly.
            </li>
            <li>
              <Lock className="inline-block mr-2" /> Share notes and files
              securely in private rooms.
            </li>
            <li>
              <UserPlus className="inline-block mr-2" /> Create or join chat
              rooms for real-time collaboration with friends, colleagues, or
              teams.
            </li>
            <li>
              <Info className="inline-block mr-2" /> Access project details,
              settings, and help information.
            </li>
            <li>
              <LogIn className="inline-block mr-2" /> Login to save notes,
              files, and settings across devices.
            </li>
            <li>
              <Share2 className="inline-block mr-2" /> Instantly share files
              directly from your device or apps like WhatsApp, Email, and more
              without leaving ShareBro.
            </li>
            <li>
              <DownloadCloud className="inline-block mr-2" /> Install as a PWA
              for offline access and native-like experience on any device.
            </li>
          </ul>
        </section>

        {/* Upload Modes */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Upload Notes & Files
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            ShareBro offers three flexible upload modes to control visibility:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
            <li>
              <Layers className="inline-block mr-2" />
              <strong>General:</strong> Notes uploaded here are visible to all
              users, perfect for sharing updates with your entire team.
            </li>
            <li>
              <Users className="inline-block mr-2" />
              <strong>Both:</strong> Notes are uploaded to General and a private
              copy is saved for you – the best of both worlds.
            </li>
            <li>
              <Key className="inline-block mr-2" />
              <strong>User Only:</strong> Notes are private and can only be
              accessed by you, ideal for sensitive information.
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
              <strong>Login or Sign Up:</strong> Create an account to unlock
              full ShareBro functionality.
            </li>
            <li>
              <strong>Home Page:</strong> Access your notes, upload files, and
              view shared content.
            </li>
            <li>
              <strong>All Notes:</strong> Click{" "}
              <FileText className="inline-block mr-1" /> All Notes to view
              everything.
            </li>
            <li>
              <strong>Secure Share:</strong> Use{" "}
              <Lock className="inline-block mr-1" /> Secure Share to share notes
              privately.
            </li>
            <li>
              <strong>Make Room:</strong> Click{" "}
              <UserPlus className="inline-block mr-1" /> Make Room to create a
              chat room for collaboration.
            </li>
            <li>
              <strong>Settings / Info:</strong> Access{" "}
              <Info className="inline-block mr-1" /> Info for project details
              and app settings.
            </li>
          </ol>
        </section>

        {/* Chat & File Sharing */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Using Chat & File Sharing
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
          <p className="text-sm md:text-base leading-relaxed font-semibold text-blue-600">
            ShareBro integrates with your device sharing options – hold any
            file, tap Share, and pick ShareBro to upload instantly! No extra
            scanning or third-party apps needed.
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
            <li>
              Use "User Only" mode for sensitive notes to protect your data.
            </li>
            <li>
              Install ShareBro on all your devices for seamless access anywhere.
            </li>
          </ul>
        </section>

        {/* Help Section */}
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
            Need Help?
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Reach out to the project maintainer or check the README.md for
            setup, troubleshooting, and tips. ShareBro is designed to make file
            sharing effortless, secure, and fast – across every device you own.
          </p>
        </section>
      </div>
    </div>
  );
}
