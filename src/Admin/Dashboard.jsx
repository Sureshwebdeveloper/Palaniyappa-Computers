import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AadharEnrolmentTable from './Aadhaarenrolment';
import ChildAadhar from './ChildAadhar';
import PhoneNumber from './Phonenumber';
import TodayReport from './Todayreport';
import WeeklyReport from './WeeklyReport';

const Dashboard = () => {
  // Centralized enrolment data
  const [aadharEntries, setAadharEntries] = useState([]);
  const [childEntries, setChildEntries] = useState([]);
  const [phoneEntries, setPhoneEntries] = useState([]);

  const [activePage, setActivePage] = useState('enrolment');

  const renderContent = () => {
    switch (activePage) {
      case 'enrolment':
        return <AadharEnrolmentTable entries={aadharEntries} setEntries={setAadharEntries} />;
      case 'child':
        return <ChildAadhar entries={childEntries} setEntries={setChildEntries} />;
      case 'phone':
        return <PhoneNumber entries={phoneEntries} setEntries={setPhoneEntries} />;
      case 'today':
        return <TodayReport aadharEntries={aadharEntries} childEntries={childEntries} phoneEntries={phoneEntries} />;
      case 'weekly':
        return <WeeklyReport aadharEntries={aadharEntries} childEntries={childEntries} phoneEntries={phoneEntries} />

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
