import { useEffect } from "react";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    if (address) {
      await contract.allow(address);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      const select = document.querySelector("#selectNumber");

      // Clear previous options
      select.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "People With Access";
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      // Append addresses
      addressList.forEach((opt) => {
        const e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      });
    };
    contract && accessList();
  }, [contract]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">Share With</h2>

        {/* Input */}
        <input
          type="text"
          className="address w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          placeholder="Enter Address"
        />

        {/* Select */}
        <select
          id="selectNumber"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          <option value="" disabled selected>
            People With Access
          </option>
        </select>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 hover:scale-[1.02] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={sharing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
