import React from "react";
import { FaRegFileAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const TodayReport = ({ aadharEntries = [], childEntries = [], phoneEntries = [] }) => {
  // Calculate totals for each section
  const sections = [
    { label: "Aadhar Enrolment", entries: aadharEntries },
    { label: "Child Aadhar Enrolment", entries: childEntries },
    { label: "Phone Number Enrolment", entries: phoneEntries },
  ];

  const grandTotalCount = sections.reduce(
    (total, section) => total + section.entries.reduce((sum, entry) => sum + entry.count, 0),
    0
  );

  const grandTotalEarnings = sections.reduce(
    (total, section) => total + section.entries.reduce((sum, entry) => sum + entry.subtotal, 0),
    0
  );

  console.log(`Grand Total Count: ${grandTotalCount}, Grand Total Earnings: ₹${grandTotalEarnings}`);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-dark flex items-center">
        <FaRegFileAlt className="mr-2 text-primary" /> Today Report
      </h2>

      {/* Dynamically Render Sections */}
      {sections.map(({ label, entries }, index) => {
        const totalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
        const totalEarnings = entries.reduce((sum, entry) => sum + entry.subtotal, 0);

        return (
          <div key={index} className="border border-gray-300 rounded-lg p-6 bg-light shadow-md mt-4">
            <h3 className="text-xl font-semibold text-dark mb-2 flex items-center">
              <FaUsers className="mr-2 text-secondary" /> {label}
            </h3>

            {entries.length > 0 ? (
              <>
                <p className="text-lg">Total Enrolment Count: <span className="font-bold">{totalCount}</span></p>
                <p className="text-lg">Total Earnings: <span className="font-bold">₹{totalEarnings}</span></p>
              </>
            ) : (
              <p className="text-gray-500 italic">No records found today.</p>
            )}
          </div>
        );
      })}

      {/* Grand Total Summary */}
      <div className="border border-gray-400 rounded-lg p-6 bg-primary text-light mt-8 text-xl font-bold shadow-lg flex justify-between">
        <div className="flex items-center">
          <FaUsers className="mr-2 text-light" />
          <span>Total Enrolments: {grandTotalCount}</span>
        </div>
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-2 text-light" />
          <span>Total Earnings: ₹{grandTotalEarnings}</span>
        </div>
      </div>
    </div>
  );
};

export default TodayReport;
