"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageModal from "./ImageModal";

export default function NotesImages({ visible }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // multiple select

  useEffect(() => {
    if (!visible) return;
    const fetchImages = async () => {
      const toastId = toast.loading("Fetching images...");
      setLoading(true);
      try {
        const res = await axios.get("/api/allimages");
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

  // toggle image selection
  const handleSelect = (img) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  // delete selected images
  const handleDelete = async () => {
    if (selectedImages.length === 0) {
      toast.error("No images selected");
      return;
    }
    const toastId = toast.loading("Deleting images...");
    try {
      await axios.post("/api/deleteimages", { images: selectedImages });
      setImages((prev) => prev.filter((img) => !selectedImages.includes(img)));
      setSelectedImages([]);
      toast.success("Images deleted", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Uploaded Images</h2>
        {selectedImages.length > 0 && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
            Delete Selected ({selectedImages.length})
          </button>
        )}
      </div>

      <div className="mt-6 bg-white mb-14 md:mb-auto overflow-auto max-h-[30rem] rounded-lg shadow">
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative border rounded-lg overflow-hidden cursor-pointer ${
                  selectedImages.includes(img) ? "ring-2 ring-blue-500" : ""
                }`}>
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedImages.includes(img)}
                  onChange={() => handleSelect(img)}
                  className="absolute top-2 left-2 z-10 w-5 h-5 accent-blue-600"
                />

                {/* Image */}
                <img
                  src={img.url} // assuming the object has a `url` property from the API
                  alt={`Uploaded ${idx}`}
                  className="w-full h-40 object-cover"
                  onClick={() => setSelectedImage(img.url)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageModal
        open={!!selectedImage} // modal opens when selectedImage is set
        src={selectedImage} // pass the URL to src
        alt="Selected image"
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
