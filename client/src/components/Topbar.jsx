import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  MdAccessTime, 
  MdCalendarToday, 
  MdAdminPanelSettings,
  MdPerson,
  MdRefresh
} from "react-icons/md";

function Topbar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside close listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      case "/update-price":
        return "Price Update Control";
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
    <header className={`bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-10 transition-all duration-300 ${
      isDashboard ? "h-8" : "h-16"
    }`}>
      {/* Left section: Page Title (Adjust text & padding based on Dashboard state) */}
      <div className="flex items-center gap-4">
        <h2 className={`font-semibold text-slate-800 tracking-tight transition-all duration-300 ${
          isDashboard ? "text-[12px] pl-8" : "text-xl"
        } ${isCollapsed && !isDashboard ? "pl-14" : ""}`}>
          {getPageTitle()}
        </h2>
      </div>

      {/* Date, Time & Profile Info */}
      <div className="flex items-center gap-3">
        {/* Date and Time Panel (Ultra-compact & Bold on Dashboard) */}
        <div className={`hidden md:flex items-center text-slate-500 border-r border-slate-200 ${
          isDashboard ? "text-sm pr-2.5 gap-2 font-black" : "text-sm pr-6 gap-5 font-semibold"
        }`}>
          <div className="flex items-center gap-1">
            {!isDashboard && <MdCalendarToday className="text-rose-500 text-base" />}
            <span className={isDashboard ? "text-slate-900" : ""}>{formattedDate}</span>
          </div>
          <div className={`flex items-center gap-1 font-mono rounded-md border ${
            isDashboard 
              ? "px-1 py-0 border-transparent bg-transparent text-rose-700 font-black text-sm" 
              : "px-2.5 py-1 border-slate-100 bg-slate-50"
          }`}>
            {!isDashboard && <MdAccessTime className="text-rose-500 text-base animate-spin-slow" />}
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Refresh Page Button (More compact on Dashboard) */}
        <button
          onClick={() => window.location.reload()}
          className={`hover:bg-slate-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-250 rounded-lg shadow-sm transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer ${
            isDashboard ? "p-0.5" : "p-1.5"
          }`}
          title="Refresh Page"
        >
          <MdRefresh className={isDashboard ? "text-sm" : "text-xl"} />
        </button>

        {/* Toggleable User Profile Section */}
        <div className="relative" ref={profileRef}>
          {/* Avatar button - ONLY click toggles profile detail menu (Smaller on Dashboard) */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`rounded-full flex items-center justify-center font-black tracking-wide shadow-sm border text-white transition-all duration-200 hover:scale-105 select-none focus:outline-none cursor-pointer ${
              isDashboard ? "h-6 w-6 text-[10px]" : "h-10 w-10 text-sm"
            } ${
              user?.role === "admin" 
                ? "bg-gradient-to-br from-rose-600 to-rose-500 border-rose-400 shadow-rose-900/15" 
                : "bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-400 shadow-indigo-900/15"
            }`}
            title="User Profile Details"
          >
            {user?.first_name ? user.first_name.charAt(0).toUpperCase() : "G"}
          </button>

          {/* Profile Details Dropdown Card */}
          {showProfileMenu && (
            <div className={`absolute right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4.5 z-50 animate-fade-in flex flex-col gap-3 text-left ${
              isDashboard ? "mt-1" : "mt-2.5"
            }`}>
              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Logged In Operator
                </p>
                <h4 className="text-sm font-black text-slate-900 mt-1">
                  {user ? `${user.first_name} ${user.last_name}` : "Guest Operator"}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {user?.email || "No email available"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Access Authorization
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    user?.role === "admin" 
                      ? "bg-rose-50 text-rose-700 border-rose-100" 
                      : "bg-indigo-50 text-indigo-700 border-indigo-100"
                  }`}>
                    {user?.role === "admin" ? (
                      <>
                        <MdAdminPanelSettings className="text-sm shrink-0" />
                        System Administrator
                      </>
                    ) : (
                      <>
                        <MdPerson className="text-sm shrink-0" />
                        Staff User
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
