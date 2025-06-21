import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const WeeklyReport = () => {
  const [days, setDays] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/weekly-report`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      setDays(data);
    } catch {
      toast.error("Failed to load report");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const hasAnyData = days.some(
    (day) => day.entries && (day.entries.aadhar.length > 0 || day.entries.child.length > 0 || day.entries.phone.length > 0)
  );

  const savePDF = () => {
    const doc = new jsPDF();
    doc.text("Weekly Report", 14, 15);

    const body = days
      .filter((d) => d.entries)
      .flatMap((d) => {
        const base = [];
        d.entries.aadhar.forEach((e) =>
          base.push([d.formatted, "Aadhar", e.count, e.price, e.subtotal])
        );
        d.entries.child.forEach((e) =>
          base.push([d.formatted, "Child Aadhar", e.count, e.price, e.subtotal])
        );
        d.entries.phone.forEach((e) =>
          base.push([d.formatted, "Phone", e.count, e.price, e.subtotal])
        );
        return base;
      });

    autoTable(doc, {
      head: [["Date", "Category", "Count", "Price", "Subtotal"]],
      body,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save("Weekly_Report.pdf");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">📅 Weekly Report</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 max-w-5xl mx-auto">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border shadow-sm cursor-pointer ${
                  day.isHoliday ? "bg-red-100 border-red-300" : "bg-white"
                }`}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {day.formatted}
                    {day.isHoliday && ` — ${day.holidayType}`}
                  </h3>
                  {!day.isHoliday && <span className="text-blue-600">Click to expand</span>}
                </div>

                {expanded === idx && day.entries && (
                  <div className="mt-4 space-y-4">
                    {["aadhar", "child", "phone"].map((key, i) => (
                      <div key={i} className="bg-gray-100 p-4 rounded-md shadow-sm">
                        <h4 className="text-md font-semibold mb-2 capitalize">{key} Enrolment</h4>
                        {day.entries[key].length === 0 ? (
                          <p className="text-gray-500 italic">No records</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b">
                                <th>Date</th>
                                <th>Count</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.entries[key].map((entry, j) => (
                                <tr key={j}>
                                  <td>{new Date(entry.date).toLocaleTimeString()}</td>
                                  <td>{entry.count}</td>
                                  <td>Rs. {entry.price}</td>
                                  <td>Rs. {entry.subtotal}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasAnyData && (
            <div className="flex justify-center mt-8">
              <button
                onClick={savePDF}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <FaDownload /> Download Weekly Report
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeeklyReport;
