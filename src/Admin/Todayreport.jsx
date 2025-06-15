import React from "react";

const TodayReport = ({
  aadharEntries = [],
  childEntries = [],
  phoneEntries = [],
}) => {
  // Calculate totals for each section
  const totalAadharCount = aadharEntries.reduce(
    (sum, entry) => sum + entry.count,
    0
  );
  
  const totalAadharEarnings = aadharEntries.reduce(
    (sum, entry) => sum + entry.subtotal,
    0
  );

  const totalChildCount = childEntries.reduce(
    (sum, entry) => sum + entry.count,
    0
  );

  const totalChildEarnings = childEntries.reduce(
    (sum, entry) => sum + entry.subtotal,
    0
  );

  const totalPhoneCount = phoneEntries.reduce(
    (sum, entry) => sum + entry.count,
    0
  );

  const totalPhoneEarnings = phoneEntries.reduce(
    (sum, entry) => sum + entry.subtotal,
    0
  );

  // Grand totals across all sections
  const grandTotalCount = totalAadharCount + totalChildCount + totalPhoneCount;
  const grandTotalEarnings =
    totalAadharEarnings + totalChildEarnings + totalPhoneEarnings;

  console.log(
    "grand total" + grandTotalCount + "Earnings" + grandTotalEarnings
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-dark">Today Report</h2>

      {/* Aadhar Enrolment Section */}
      <div className="border border-gray-300 rounded p-4 bg-light shadow">
        <h3 className="text-xl font-bold text-dark mb-2">Aadhar Enrolment</h3>
        <p>Total Enrolment Count: {totalAadharCount}</p>
        <p>Total Earnings: ₹{totalAadharEarnings}</p>
      </div>

      {/* Child Aadhar Enrolment Section */}
      <div className="border border-gray-300 rounded p-4 bg-light shadow mt-4">
        <h3 className="text-xl font-bold text-dark mb-2">
          Child Aadhar Enrolment
        </h3>
        <p>Total Enrolment Count: {totalChildCount}</p>
        <p>Total Earnings: ₹{totalChildEarnings}</p>
      </div>

      {/* Phone Number Enrolment Section */}
      <div className="border border-gray-300 rounded p-4 bg-light shadow mt-4">
        <h3 className="text-xl font-bold text-dark mb-2">
          Phone Number Enrolment
        </h3>
        <p>Total Enrolment Count: {totalPhoneCount}</p>
        <p>Total Earnings: ₹{totalPhoneEarnings}</p>
      </div>

      {/* Grand Total Summary */}
      <div className="border border-gray-300 rounded p-4 bg-primary text-light mt-8 text-lg font-bold shadow">
        <h3 className="text-xl mb-2">Grand Total Across All Sections</h3>
        <p>Total Enrolment Count: {grandTotalCount}</p>
        <p>Total Earnings: ₹{grandTotalEarnings}</p>
      </div>
    </div>
  );
};

export default TodayReport;
