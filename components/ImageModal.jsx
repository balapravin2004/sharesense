"use client";

import React, { useRef } from "react";

export default function ImageModal({ open, onClose, src, alt }) {
  const overlayRef = useRef();

  if (!open) return null;

  const handleOutsideClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="max-w-full max-h-full rounded-xl shadow-2xl overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
}
