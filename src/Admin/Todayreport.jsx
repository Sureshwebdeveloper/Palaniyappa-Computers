import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaUsers, FaMoneyBillWave, FaSpinner, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable"; // ✅ Import for table styling
import { toast } from "react-toastify";

const TodayReport = () => {
  const [reportData, setReportData] = useState({
    aadharEntries: [],
    childEntries: [],
    phoneEntries: [],
  });

  const [isDownloading, setIsDownloading] = useState(false); // ✅ Loading state for download

  useEffect(() => {
    fetchTodayReport();
  }, []);

  const fetchTodayReport = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:5000/today", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Fetched Data:", data); // ✅ Debug API Response
      setReportData(data);
    } catch (error) {
      console.error("Error fetching today's report:", error);
      toast.error("Failed to load today's report!");
    }
  };

  const sections = [
    { label: "Aadhar Enrolment", entries: reportData.aadharEntries },
    { label: "Child Aadhar Enrolment", entries: reportData.childEntries },
    { label: "Phone Number Enrolment", entries: reportData.phoneEntries },
  ];

  // ✅ Check if any data exists before showing download option
  const hasData = sections.some((section) => section.entries.length > 0);

  // ✅ Generate & Download PDF
 const savePDF = () => {
  if (!hasData) {
    toast.error("No records available to download!");
    return;
  }

  setIsDownloading(true);

  setTimeout(() => {
    const doc = new jsPDF();

    // ✅ Set proper margin to avoid cut-off text
    doc.setFont("helvetica", "bold");
    doc.text("Today Report", 14, 15);

    doc.autoTable({
      head: [["#", "Category", "Date", "Enrolment Count", "Earnings"]],
      body: sections.flatMap(({ label, entries }) =>
        entries.map((entry, index) => [
          index + 1,
          label,
          entry.date,
          entry.count,
          `₹${entry.subtotal}`,
        ])
      ),
      theme: "grid",
      styles: { fillColor: [240, 240, 240] },
    });

    // ✅ Ensure file name includes the correct date
    const todayDate = new Date().toISOString().split("T")[0]; 
    const fileName = `Today_Report_${todayDate}.pdf`;

    try {
      doc.save(fileName); // ✅ Save the PDF file
      toast.success(`Report downloaded: ${fileName}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Failed to download PDF!");
    }

    setIsDownloading(false);
  }, 1500);
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-dark flex items-center">
        <FaRegFileAlt className="mr-2 text-primary" /> Today Report
      </h2>

      {/* Dynamic Section Rendering */}
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
                <p className="text-lg">
                  Total Enrolment Count: <span className="font-bold">{totalCount}</span>
                </p>
                <p className="text-lg">
                  Total Earnings: <span className="font-bold">₹{totalEarnings}</span>
                </p>
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
          <span>Total Enrolments: {sections.reduce((total, section) => total + section.entries.reduce((sum, entry) => sum + entry.count, 0), 0)}</span>
        </div>
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-2 text-light" />
          <span>Total Earnings: ₹{sections.reduce((total, section) => total + section.entries.reduce((sum, entry) => sum + entry.subtotal, 0), 0)}</span>
        </div>
      </div>

      {/* ✅ PDF Download Button (Shown Only If Data Exists) */}
      {hasData && (
        <button
          onClick={savePDF}
          disabled={isDownloading}
          className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <FaSpinner className="animate-spin" /> Downloading...
            </>
          ) : (
            <>
              <FaDownload /> Download Report as PDF
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TodayReport;
