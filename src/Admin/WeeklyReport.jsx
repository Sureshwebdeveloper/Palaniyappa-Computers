import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table styling
import { toast } from "react-toastify";
import { FaRegFileAlt } from "react-icons/fa";

const WeeklyReport = () => {
  const [reportData, setReportData] = useState({
    aadharEntries: [],
    childEntries: [],
    phoneEntries: [],
  });

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  // ✅ Fetch Weekly Report Data from Backend
  const fetchWeeklyReport = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:5000/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch weekly report");

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching weekly report:", error);
      toast.error("Failed to load weekly report!");
    }
  };

  // ✅ Format Date for Readability
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));

  // ✅ Prepare Report Days (Last 7 Days)
  const reportDays = [...Array(7)]
    .map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const formattedDate = date.toISOString().split("T")[0]; // Ensure it matches MongoDB format

      const dayEntries = {
        aadhar: reportData.aadharEntries.filter((entry) => entry.date === formattedDate),
        child: reportData.childEntries.filter((entry) => entry.date === formattedDate),
        phone: reportData.phoneEntries.filter((entry) => entry.date === formattedDate),
      };

      return {
        date: formattedDate,
        formatted: formatDate(date),
        isHoliday: date.getDay() === 0,
        hasRecords: dayEntries.aadhar.length > 0 || dayEntries.child.length > 0 || dayEntries.phone.length > 0,
      };
    })
    .reverse();

  // ✅ Generate PDF Report
  const savePDF = () => {
    const hasData = reportDays.some(({ hasRecords }) => hasRecords);
    if (!hasData) {
      toast.error("No records found for this week!");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Report", 14, 15);
    doc.setFont("helvetica", "normal");

    const tableData = reportDays.map(({ formatted, isHoliday, hasRecords }) => [
      formatted,
      isHoliday ? "Holiday" : hasRecords ? "Data Recorded" : "No Record Found",
    ]);

    doc.autoTable({
      head: [["Date", "Status"]],
      body: tableData,
      theme: "grid",
      styles: { fillColor: [240, 240, 240] },
    });

    doc.save("Weekly_Report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-dark flex items-center">
        <FaRegFileAlt className="mr-2 text-primary" /> Weekly Report
      </h2>

      {/* Report Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {reportDays.map(({ formatted, isHoliday, hasRecords }, index) => (
          <div key={index} className={`p-4 rounded-xl shadow-lg ${isHoliday ? "bg-red-100" : "bg-white"}`}>
            <h3 className={`text-xl font-bold mb-2 ${isHoliday ? "text-red-600" : "text-dark"}`}>
              {formatted} {isHoliday && "🎉 (Holiday)"}
            </h3>
            {!isHoliday ? (
              hasRecords ? (
                <p className="text-green-600 font-medium">✅ Data recorded for {formatted}.</p>
              ) : (
                <p className="text-gray-500">⚠ No record found for {formatted}.</p>
              )
            ) : (
              <p className="text-gray-700">🏖 No work today!</p>
            )}
          </div>
        ))}
      </div>

      {/* Save PDF Button */}
      <button
        onClick={savePDF}
        className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
      >
        📄 Save Weekly Report as PDF
      </button>
    </div>
  );
};

export default WeeklyReport;
