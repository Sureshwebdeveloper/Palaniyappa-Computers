import {
  FaIdCard,
  FaChild,
  FaPhone,
  FaRegChartBar,
  FaCalendarAlt,
  FaSignOutAlt, // ✅ Logout Icon
} from "react-icons/fa";

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { key: "enrolment", label: "Aadhar Enrolment", icon: <FaIdCard /> },
    { key: "child", label: "Child Aadhar", icon: <FaChild /> },
    { key: "phone", label: "Phone Number", icon: <FaPhone /> },
    { key: "today", label: "Today Report", icon: <FaRegChartBar /> },
    { key: "weekly", label: "Weekly Report", icon: <FaCalendarAlt /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // ✅ Clears authentication token
    window.location.href = "/"; // ✅ Redirect to login page
  };

  return (
    <aside className="w-64 bg-dark text-light min-h-screen p-4 flex flex-col">
      {/* ✅ Logo Section */}
      <div className="text-center py-4">
        <img src="https://static.vecteezy.com/system/resources/previews/020/429/953/original/admin-icon-vector.jpg" alt="App Logo" className="rounded-full w-16 mx-auto" />
      </div>

      {/* ✅ Navigation Menu */}
      <ul className="flex-grow">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center p-3 my-2 rounded cursor-pointer hover:bg-secondary transition-colors ${
              activePage === item.key ? "bg-secondary" : ""
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="ml-2">{item.label}</span>
          </li>
        ))}
      </ul>

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
