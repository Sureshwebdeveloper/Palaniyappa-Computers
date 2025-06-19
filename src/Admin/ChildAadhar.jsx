import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaSpinner, FaTrash } from "react-icons/fa";

const ChildAadhar = () => {
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  // ✅ Fetch Entries from Backend
  const fetchEntries = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/child/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Error fetching entries!");
    }
  };

  // ✅ Submit New Entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.info("Processing entry...");

    const token = localStorage.getItem("authToken");
    const newEntry = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      count: Number(count),
      price: Number(price),
      subtotal: Number(count) * Number(price),
    };

    try {
      const response = await fetch("http://localhost:5000/child/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error("Failed to save entry");

      const savedEntry = await response.json();
      setEntries([...entries, savedEntry]);
      toast.success("Entry saved successfully!");
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry!");
    }

    setIsLoading(false);
    setCount("");
    setPrice("");
  };

  // ✅ Remove Entry
  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:5000/child/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete entry");

      setEntries(entries.filter(entry => entry._id !== id));
      toast.success("Entry removed successfully!");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry!");
    }
  };

  // ✅ Group Entries by Date
  const groupedEntries = entries.reduce((groups, entry) => {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
    return groups;
  }, {});

  // ✅ Calculate Grand Total Across All Entries
  const grandTotalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
  const grandTotalEarnings = entries.reduce((sum, entry) => sum + entry.subtotal, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">📌 Child Aadhar Enrolment</h2>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Child Enrolment Count</label>
          <input 
            type="number" 
            value={count} 
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Each Enrolment Price (Rs.)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required 
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />} {isLoading ? "Processing..." : "Add Entry"}
          </button>
        </div>
      </form>

      {/* Entries by Date */}
      <div className="space-y-8">
        {Object.keys(groupedEntries).map((date) => {
          const dateEntries = groupedEntries[date];
          const totalCount = dateEntries.reduce((sum, entry) => sum + entry.count, 0);
          const totalEarnings = totalCount * dateEntries[0]?.price;

          return (
            <div key={date} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-4">📅 Date: {date}</h3>
              <table className="w-full text-left border border-gray-300 rounded">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    {["#", "Count", "Price", "Subtotal", "Time", "Remove"].map(header => (
                      <th key={header} className="px-4 py-2 text-sm font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dateEntries.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{entry.count}</td>
                      <td className="px-4 py-2">₹{entry.price}</td>
                      <td className="px-4 py-2">₹{entry.subtotal}</td>
                      <td className="px-4 py-2">{entry.time}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => handleDelete(entry._id)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Grand Total Section */}
      {entries.length > 0 && (
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md mt-8 text-lg font-bold text-center">
          <h3>Total Enrolment Count: {grandTotalCount}</h3>
          <h3>Total Earnings: ₹{grandTotalEarnings}</h3>
        </div>
      )}
    </div>
  );
};

export default ChildAadhar;
