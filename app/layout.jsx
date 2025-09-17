"use client";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { Toaster } from "react-hot-toast";
import "./globals.css";

import { Provider } from "react-redux";
import { store } from "../store/store";

import { GeminiChatBot } from "../components";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ShareBro</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/send192.png" />
      </head>
      <body className="flex min-h-screen transition-all duration-300 sidebar-gradient rounded-tl-2xl rounded-bl-2xl">
        <Provider store={store}>
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Topbar />
            <main className="overflow-y-auto md:h-[90vh] rounded-2xl border border-none">
              <Toaster position="top-center" />
              {children}
            </main>
          </div>
          <GeminiChatBot />
        </Provider>
      </body>
    </html>
  );
}
