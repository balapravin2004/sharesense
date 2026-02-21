import { useState } from "react";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
      return;
    }

    const isEmpty = !dataArray || Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str_array = dataArray.toString().split(",");
      const images = str_array.map((item, i) => (
        <a
          href={item}
          key={i}
          target="_blank"
          className="block hover:scale-105 transition-transform"
        >
          <img
            src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
            alt="new"
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        </a>
      ));
      setData(images);
    } else {
      alert("No image to display");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-md space-y-4">
      {/* Input & Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Enter Address"
          className="address w-full sm:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all"
          onClick={getdata}
        >
          Get Data
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {data.length > 0 ? data : <p className="text-gray-400 col-span-full">No images to display</p>}
      </div>
    </div>
  );
};

export default Display;