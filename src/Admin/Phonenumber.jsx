import React, { useState } from "react";

const PhoneNumber = () => {
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const [entries, setEntries] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enrolCount = Number(count);
    const enrolPrice = Number(price);
    if (enrolCount <= 0 || enrolPrice <= 0) return;

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    const subtotal = enrolCount * enrolPrice;

    const newEntry = {
      date,
      time,
      count: enrolCount,
      price: enrolPrice,
      subtotal,
    };

    setEntries([...entries, newEntry]);
    setCount("");
    setPrice("");
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }
    groups[entry.date].push(entry);
    return groups;
  }, {});

  // **Grand Total Calculation Across All Days**
  const grandTotalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
  const grandTotalEarnings = entries.reduce((sum, entry) => sum + entry.subtotal, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-dark">Phone Number Enrolment</h2>

      {/* Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1 text-dark">Phone Enrolment Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-3 py-2 border border-dark rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-dark">Each Enrolment Price (Rs.)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-dark rounded"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-dark text-light font-bold py-2 px-4 rounded"
          >
            Add Entry
          </button>
        </div>
      </form>

      {/* Display Entries by Date */}
      <div className="space-y-8">
        {Object.keys(groupedEntries).map((date) => {
          const dateEntries = groupedEntries[date];

          const totalCount = dateEntries.reduce((sum, entry) => sum + entry.count, 0);
          const totalEarnings = totalCount * dateEntries[0]?.price; // Assuming same price per day

          return (
            <div key={date} className="border border-gray-300 rounded p-4 bg-light shadow">
              <h3 className="text-xl font-bold text-dark mb-2">Date: {date}</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Entry No.</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Phone Enrolment Count</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Each Price (Rs.)</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Subtotal (Rs.)</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dateEntries.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{entry.count}</td>
                      <td className="px-4 py-2">{entry.price}</td>
                      <td className="px-4 py-2">{entry.subtotal}</td>
                      <td className="px-4 py-2">{entry.time}</td>
                    </tr>
                  ))}
                  {/* Daily Total Row */}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-2">Total for {date}</td>
                    <td className="px-4 py-2">{totalCount}</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">₹{totalEarnings}</td>
                    <td className="px-4 py-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* GRAND TOTAL SECTION */}
      {entries.length > 0 && (
        <div className="border border-gray-300 rounded p-4 bg-primary text-light mt-8 text-lg font-bold shadow">
          <h3 className="text-xl mb-2">Grand Total Across All Phone Enrolment Entries</h3>
          <p>Total Enrolment Count: {grandTotalCount}</p>
          <p>Total Earnings: ₹{grandTotalEarnings}</p>
        </div>
      )}
    </div>
  );
};


export default PhoneNumber;