import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  MdDashboard, 
  MdAddBox, 
  MdIndeterminateCheckBox, 
  MdHistory, 
  MdBloodtype,
  MdCurrencyRupee,
  MdLogout
} from "react-icons/md";

const menuItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: MdDashboard,
  },
  {
    path: "/receive",
    name: "Receive Blood (Entry)",
    icon: MdAddBox,
  },
  {
    path: "/issue",
    name: "Issue Blood (Dispatch)",
    icon: MdIndeterminateCheckBox,
  },
  {
    path: "/transactions",
    name: "Transaction Logs",
    icon: MdHistory,
  },
  {
    path: "/update-price",
    name: "Price Update",
    icon: MdCurrencyRupee,
  },
];

function Sidebar({ isCollapsed }) {
  const { isAdmin, logout } = useAuth();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.path === "/update-price") {
      return isAdmin;
    }
    return true;
  });

  return (
    <aside className={`bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl transition-all duration-300 sticky top-0 h-screen z-20 ${
      isCollapsed 
        ? "w-0 -translate-x-full opacity-0 overflow-hidden border-none pointer-events-none" 
        : "w-64 translate-x-0 opacity-100"
    }`}>
      {/* Brand Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="p-2 bg-rose-600 rounded-lg shadow-md animate-pulse">
          <MdBloodtype className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-rose-500 to-rose-300 bg-clip-text text-transparent">
            Blood Bank 
          </h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-900/30 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`
              }
            >
              <Icon className="text-xl shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-rose-900/20 hover:text-rose-450 hover:text-rose-400 transition-all duration-200 cursor-pointer"
        >
          <MdLogout className="text-xl shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
