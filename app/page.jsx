import React from "react";

const Page = () => {
  const cards = [
    {
      title: "Total Users",
      value: "1,245",
      color: "from-blue-500 to-blue-400",
    },
    {
      title: "Active Rooms",
      value: "87",
      color: "from-green-500 to-green-400",
    },
    {
      title: "Files Shared",
      value: "4,320",
      color: "from-purple-500 to-purple-400",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white p-6 ">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Home Page</h1>
      <p className="text-lg text-gray-600 mb-10">
        Welcome to the dashboard! Here’s a quick overview of your activity.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl  bg-gradient-to-r ${card.color} text-white`}>
            <h2 className="text-lg font-medium mb-2">{card.title}</h2>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl ">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Recent Activity
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            📂 You shared a file:{" "}
            <span className="font-medium">report.pdf</span>
          </li>
          <li>🔑 You created a new secure room.</li>
          <li>👥 John Doe joined your shared workspace.</li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
