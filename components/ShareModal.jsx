import React, { useEffect, useRef } from "react";
import { WhatsappShareButton, EmailShareButton } from "react-share";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, note }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Share this note</h2>

        <div className="flex justify-center gap-6">
          <WhatsappShareButton
            url={`https://sharebro.com/notes/${note.id}`}
            title={note.content}>
            <FaWhatsapp className="text-green-600 w-10 h-10" />
          </WhatsappShareButton>

          <EmailShareButton
            url={`https://sharebro.com/notes/${note.id}`}
            subject="Check this note"
            body={note.content}>
            <FaEnvelope className="text-blue-600 w-10 h-10" />
          </EmailShareButton>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
