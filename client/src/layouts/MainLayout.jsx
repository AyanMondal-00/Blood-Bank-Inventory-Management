import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MdMenu } from "react-icons/md";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Automatically collapse sidebar on dashboard, expand on other pages
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden relative">
      {/* Floating Menu Button - visible on any page when sidebar is collapsed */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className={`fixed left-4 z-30 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md hover:shadow-rose-600/20 hover:scale-105 transition duration-200 focus:outline-none flex items-center justify-center cursor-pointer border border-rose-500 ${
            isDashboard ? "top-1 h-6 w-6" : "top-3.5 h-9 w-9"
          }`}
          title="Expand Menu"
        >
          <MdMenu className={isDashboard ? "text-base" : "text-xl"} />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        <Topbar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;