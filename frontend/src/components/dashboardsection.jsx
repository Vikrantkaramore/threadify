import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaQuestionCircle, FaBell, FaChartLine } from 'react-icons/fa';
import Folder from '../ui/Folder';

const DashboardSection = () => {
  const items = [
    <Link to="/dashboard/tailor/chat" className="flex flex-col items-center justify-center w-full h-full p-3 bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
      <FaComments className="text-lg mb-1" />
      <span className="text-xs font-medium text-center">Customer Chat</span>
    </Link>,
    <Link to="/dashboard/tailor/support" className="flex flex-col items-center justify-center w-full h-full p-3 bg-linear-to-br from-purple-400 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
      <FaQuestionCircle className="text-lg mb-1" />
      <span className="text-xs font-medium text-center">Support & Help</span>
    </Link>,
    <Link to="/notifications" className="flex flex-col items-center justify-center w-full h-full p-3 bg-linear-to-br from-purple-300 to-purple-400 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
      <FaBell className="text-lg mb-1" />
      <span className="text-xs font-medium text-center">Notifications</span>
    </Link>,
    <Link to="/dashboard/tailor/earnings" className="flex flex-col items-center justify-center w-full h-full p-3 bg-linear-to-br from-purple-200 to-purple-300 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-purple-300 hover:to-purple-400 transition-all duration-300 transform hover:scale-105">
      <FaChartLine className="text-lg mb-1" />
      <span className="text-xs font-medium text-center">Earnings</span>
    </Link>
  ];

  return (
    <div className="p-2">
      {/* Quick Actions header with Folder aligned to the right */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold"></h3>
        <div className="size-16 w-24 h-24 cursor-pointer ml-4">
          <Folder items={items} size={1.3} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
