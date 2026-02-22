import { useState } from "react";
import axios from "axios";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  // ---------- FILE PICK ----------
  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onloadend = () => {
      setFile(selectedFile);
    };

    setFileName(selectedFile.name);
    e.preventDefault();
  };

  // ---------- UPLOAD + BLOCKCHAIN ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      // 1️⃣ Upload to Pinata
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: "ENTER_YOUR_KEY",
            pinata_secret_api_key: "ENTER_YOUR_SECRET",
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // 2️⃣ Create IPFS URI (BEST PRACTICE)
      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;

      // 3️⃣ Write to blockchain using SIGNER
      const signer = contract.connect(provider.getSigner());
      await signer.add(account, ImgHash);

      alert("Successfully Image Uploaded");
      setFileName("No image selected");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Unable to upload image to Pinata");
    }
  };

  // ---------- UI (UNCHANGED) ----------
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload Image</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* File Input */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 text-center transition-all"
        >
          Choose Image
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          disabled={!account}
          onChange={retrieveFile}
          className="hidden"
        />

        {/* File Name */}
        <span className="text-gray-500 text-sm">Selected: {fileName}</span>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
