"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageModal from "./ImageModal";

export default function NotesImages({ visible }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!visible) return;
    const fetchImages = async () => {
      const toastId = toast.loading("Fetching images...");
      setLoading(true);
      try {
        const res = await axios.get("/api/notesimages");
        setImages(res.data.images || []);
        toast.success("Images loaded", { id: toastId });
      } catch (error) {
        toast.error(error.response?.data?.error || "Error fetching images", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Uploaded Images</h2>
      <div className="mt-6 bg-white mb-14 md:mb-auto overflow-auto max-h-[30rem] rounded-lg shadow">
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                onClick={() => setSelectedImage(img)}>
                <img
                  src={img}
                  alt={`Uploaded ${idx}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
