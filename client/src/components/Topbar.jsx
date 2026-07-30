import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  MdAccessTime, 
  MdCalendarToday, 
  MdAdminPanelSettings,
  MdMenu,
  MdMenuOpen
} from "react-icons/md";

function Topbar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Page Title based on current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/receive":
        return "Receive Blood (Inventory Addition)";
      case "/issue":
        return "Issue Blood (Stock Dispatch)";
      case "/transactions":
        return "Transaction Log Audit";
      default:
        return "Blood Bank System";
    }
  };

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
      {/* Left section: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <MdMenu className="text-xl text-rose-600" />
          ) : (
            <MdMenuOpen className="text-xl text-rose-600" />
          )}
        </button>

        <h2 className="text-xl font-semibold text-slate-800 tracking-tight transition-all duration-300">
          {getPageTitle()}
        </h2>
      </div>

      {/* Date, Time & Profile Info */}
      <div className="flex items-center gap-6">
        {/* Date and Time Panel */}
        <div className="hidden md:flex items-center gap-5 text-sm text-slate-500 border-r border-slate-200 pr-6">
          <div className="flex items-center gap-1.5">
            <MdCalendarToday className="text-rose-500 text-base" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <MdAccessTime className="text-rose-500 text-base animate-spin-slow" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Super Administrator</p>
          </div>
          <div className="h-10 w-10 bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold shadow-inner">
            <MdAdminPanelSettings className="text-xl text-rose-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
