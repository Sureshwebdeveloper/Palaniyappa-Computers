import {
  FaIdCard,
  FaChild,
  FaPhone,
  FaRegChartBar,
  FaCalendarAlt,
} from 'react-icons/fa';
import AadharEnrolment from './Aadhaarenrolment';

// Sidebar component for navigation
const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    {
      key: 'enrolment',
      label: 'Aadhar Enrolment',
      icon: <FaIdCard className="mr-2" />,
    },
    {
      key: 'child',
      label: 'Child Aadhar',
      icon: <FaChild className="mr-2" />,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      icon: <FaPhone className="mr-2" />,
    },
    {
      key: 'today',
      label: 'Today Report',
      icon: <FaRegChartBar className="mr-2" />,
    },
    {
      key: 'weekly',
      label: 'Weekly Report',
      icon: <FaCalendarAlt className="mr-2" />,
    },
  ];

  return (
    <aside className="w-64 bg-dark text-light min-h-screen p-4">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center p-2 my-2 rounded cursor-pointer hover:bg-secondary transition-colors
              ${activePage === item.key ? 'bg-secondary' : ''}`}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;