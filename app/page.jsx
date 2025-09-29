"use client";
import EditorsSection from "../components/EditorsSection";
import { GeminiChatBot } from "../components";

import UploadButtonAndModalWrapper from "../components/UploadButtonAndModalWrapper";

export default function Page() {
  return (
    <div className="flex flex-col p-4 z-[100] lg:p-8 h-full bg-gray-50 overflow-x-hidden justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <EditorsSection />
        <UploadButtonAndModalWrapper />
        <GeminiChatBot />
      </div>
    </div>
  );
}
