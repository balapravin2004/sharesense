"use client";

import Upload from "../../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FileUpload, Display, Modal } from "../../components/SecureShare/index";

export default function Page() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("accountsChanged", () => window.location.reload());

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer,
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <div className="w-full h-full p-4 md:p-6 bg-gray-50 flex flex-col gap-6">
      {/* Share Button / Modal */}
      <div className="flex justify-end">
        {!modalOpen ? (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Share
          </button>
        ) : (
          <Modal setModalOpen={setModalOpen} contract={contract} />
        )}
      </div>

      {/* Header */}
      <div className="text-center">
        <p className="text-gray-700">
          Account: {account ? account : "Not connected"}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Left Side: Upload */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-none flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-800">Upload File</h2>
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />
        </div>

        {/* Right Side: Display */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-none flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Files</h2>
          <Display contract={contract} account={account} />
        </div>
      </div>
    </div>
  );
}
