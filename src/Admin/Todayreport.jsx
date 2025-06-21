import React, { useState, useEffect } from "react";
import {
  FaRegFileAlt,
  FaUsers,
  FaMoneyBillWave,
  FaSpinner,
  FaDownload,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const TodayReport = () => {
  const [reportData, setReportData] = useState({
    aadharEntries: [],
    childEntries: [],
    phoneEntries: [],
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodayReport();
  }, []);

  const fetchTodayReport = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching today's report:", error);
      toast.error("Failed to load today's report!");
    }

    setIsLoading(false);
  };

  const sections = [
    { label: "Aadhar Enrolment", entries: reportData.aadharEntries },
    { label: "Child Aadhar Enrolment", entries: reportData.childEntries },
    { label: "Phone Number Enrolment", entries: reportData.phoneEntries },
  ];

  const hasData = sections.some((section) => section.entries.length > 0);

  const savePDF = () => {
    if (!hasData) {
      toast.error("No records available to download!");
      return;
    }

    try {
      setIsDownloading(true);

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text("Today Report", 14, 15);

      autoTable(doc, {
        head: [["#", "Category", "Date", "Enrolment Count", "Earnings"]],
        body: [
          ...sections.flatMap(({ label, entries }) =>
            entries.map((entry, index) => [
              index + 1,
              label,
              entry.date,
              entry.count,
              `Rs. ${entry.subtotal.toLocaleString("en-IN")}`,
            ])
          ),
          [
            { content: "Grand Total", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
            {
              content: sections
                .reduce((total, section) => total + section.entries.reduce((sum, e) => sum + e.count, 0), 0)
                .toLocaleString("en-IN"),
              styles: { fontStyle: "bold" },
            },
            {
              content: "Rs. " +
                sections
                  .reduce((total, section) => total + section.entries.reduce((sum, e) => sum + e.subtotal, 0), 0)
                  .toLocaleString("en-IN"),
              styles: { fontStyle: "bold" },
            },
          ],
        ],
        theme: "grid",
        startY: 25,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [34, 34, 34],
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 14, right: 14 },
      });

      const todayDate = new Date().toISOString().split("T")[0];
      const fileName = `Today_Report_${todayDate}.pdf`;

      doc.save(fileName);
      toast.success(`Report downloaded: ${fileName}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Failed to download PDF!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-dark flex items-center">
        <FaRegFileAlt className="mr-2 text-primary" /> Today Report
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <FaSpinner className="animate-spin text-blue-500 text-5xl" />
        </div>
      ) : (
        <>
          {sections.map(({ label, entries }, index) => {
            const totalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
            const totalEarnings = entries.reduce((sum, entry) => sum + entry.subtotal, 0);

            return (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-6 bg-white shadow-md mt-4"
              >
                <h3 className="text-xl font-semibold text-dark mb-2 flex items-center">
                  <FaUsers className="mr-2 text-secondary" /> {label}
                </h3>

                {entries.length > 0 ? (
                  <>
                    <p className="text-lg">
                      Total Enrolment Count:{" "}
                      <span className="font-bold">{totalCount}</span>
                    </p>
                    <p className="text-lg">
                      Total Earnings:{" "}
                      <span className="font-bold">Rs. {totalEarnings.toLocaleString("en-IN")}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">No records found today.</p>
                )}
              </div>
            );
          })}

          <div className="border border-gray-400 rounded-lg p-6 bg-primary text-light mt-8 text-xl font-bold shadow-lg flex justify-between">
            <div className="flex items-center">
              <FaUsers className="mr-2 text-light" />
              <span>
                Total Enrolments:{" "}
                {sections.reduce(
                  (total, section) =>
                    total +
                    section.entries.reduce((sum, entry) => sum + entry.count, 0),
                  0
                ).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="mr-2 text-light" />
              <span>
                Total Earnings: Rs.{" "}
                {sections.reduce(
                  (total, section) =>
                    total +
                    section.entries.reduce((sum, entry) => sum + entry.subtotal, 0),
                  0
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

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
        </>
      )}
    </div>
  );
};

export default TodayReport;
