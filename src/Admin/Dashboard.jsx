import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AadharEnrolmentTable from "./Aadhaarenrolment";
import ChildAadhar from "./ChildAadhar";
import PhoneNumber from "./Phonenumber";
import TodayReport from "./Todayreport";
import WeeklyReport from "./WeeklyReport";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("enrolment");
  const [aadharEntries, setAadharEntries] = useState([]);
  const [childEntries, setChildEntries] = useState([]);
  const [phoneEntries, setPhoneEntries] = useState([]);

  // ✅ Fetch data from backend on load
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const [aadharRes, childRes, phoneRes] = await Promise.all([
        fetch("http://localhost:5000/aadhar/", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/child/", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/phone/", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!aadharRes.ok || !childRes.ok || !phoneRes.ok) throw new Error("Failed to fetch data");

      const [aadharData, childData, phoneData] = await Promise.all([
        aadharRes.json(),
        childRes.json(),
        phoneRes.json(),
      ]);

      setAadharEntries(aadharData);
      setChildEntries(childData);
      setPhoneEntries(phoneData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "enrolment":
        return <AadharEnrolmentTable entries={aadharEntries} setEntries={setAadharEntries} />;
      case "child":
        return <ChildAadhar entries={childEntries} setEntries={setChildEntries} />;
      case "phone":
        return <PhoneNumber entries={phoneEntries} setEntries={setPhoneEntries} />;
      case "today":
        return <TodayReport aadharEntries={aadharEntries} childEntries={childEntries} phoneEntries={phoneEntries} />;
      case "weekly":
        return <WeeklyReport aadharEntries={aadharEntries} childEntries={childEntries} phoneEntries={phoneEntries} />;
      default:
        return <AadharEnrolmentTable entries={aadharEntries} setEntries={setAadharEntries} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 bg-light min-h-screen">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
