import React, { useState, useEffect } from "react";
import { 
  MdRefresh, 
  MdWarning, 
  MdBloodtype, 
  MdCalendarToday,
} from "react-icons/md";
import { dashboardApi } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (isSilent = false) => {
    try {
      if (!isSilent) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      const res = await dashboardApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
      if (!isSilent) {
        setError("Failed to load blood group metrics. Make sure your server is online.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats(true); // Silent background refresh
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading live blood group statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-xl mx-auto my-12 shadow-sm">
        <MdWarning className="text-4xl text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Connection Error</h3>
        <p className="text-sm text-slate-600 mt-1 mb-4">{error}</p>
        <button 
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-md transition duration-200"
        >
          <MdRefresh className="text-lg" />
          Try Again
        </button>
      </div>
    );
  }

  const groupStats = stats?.groupStats ?? [];

  return (
    <div className="animate-fade-in pt-1">
      {/* Hospital Heading Banner Card */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl py-2.5 px-4 shadow-[0_6px_22px_rgba(15,23,42,0.1)] text-center space-y-1 mt-[-10px] mb-4 max-w-5xl mx-auto border-t-4 border-t-rose-600">
        <h1 className="text-sm md:text-base font-black text-rose-700 tracking-wide uppercase">
          NEHRU MEMORIAL TECHNO GLOBAL HOSPITAL BLOOD CENTRE
        </h1>
        <h2 className="text-[11px] md:text-xs font-bold text-slate-650">
          (A Unit of TECHNO INDIA TECHNOLOGIES LIMITED), Barrackpore, West Bengal
        </h2>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] md:text-[11px] font-semibold text-slate-500 pt-1.5 border-t border-dashed border-slate-200 mt-1.5">
          <span>
            Old Licence No: <strong className="text-slate-700">DL007-MB/SLA/CLAA/WB (HQ)</strong>
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span>
            ONDLS Licence No: <strong className="text-slate-700">BF 28C 2025 WB 000043</strong>
          </span>
        </div>
      </div>

      {/* Main Stock Grid */}
      {groupStats.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3">
          <MdBloodtype className="text-5xl text-rose-300 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-700">No Inventory Records Found</h3>
          <p className="text-sm text-slate-500">Please add blood bags via the "Receive Blood (Entry)" page to populate the group-wise status dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {groupStats.map((group) => {
            const hasStock = group.totalAvailable > 0;
            
            // Format Last Updated Date
            let formattedLastUpdated = "N/A";
            if (group.last_updated) {
              const d = new Date(group.last_updated);
              const timeStr = d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              });
              const dateStr = d.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              formattedLastUpdated = `${timeStr} | ${dateStr}`;
            }

            return (
              <div 
                key={group.blood_type}
                className="bg-white border-2 border-slate-200/80 rounded-2xl shadow-[0_6px_22px_rgba(15,23,42,0.14)] flex flex-col justify-between overflow-hidden transition-all duration-350 hover:shadow-[0_12px_30px_rgba(15,23,42,0.22)] hover:border-rose-450"
              >
                {/* Header section - compact padding py-1, avatar w-9 h-6 */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-3.5 py-1 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-9 h-6 rounded-md bg-rose-600 text-white font-black shadow-md shadow-rose-600/15 ${
                      group.blood_type === "Other" ? "text-[9.5px] leading-none" : "text-[14px] leading-none"
                    }`}>
                      {group.blood_type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-black border ${
                    hasStock 
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm" 
                      : "bg-rose-50 text-rose-900 border-rose-200 shadow-sm"
                  }`}>
                    {hasStock ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* Body: Shorter component table, smaller text, padding py-1 */}
                <div className="px-3.5 py-1 flex-1 relative overflow-hidden">
                  {/* Subtle Blood Group Watermark in Background */}
                  <div className="absolute -right-2 bottom-0 text-[80px] leading-none font-black text-slate-900/[0.06] select-none pointer-events-none z-0">
                    {group.blood_type}
                  </div>

                  <table className="w-full text-left border-collapse text-[12px] md:text-[13px] relative z-10">
                    <thead>
                      <tr className="border-b border-slate-250 font-black text-[9px] text-slate-800 uppercase tracking-widest bg-slate-50/70">
                        <th className="py-0 px-2">Component</th>
                        <th className="py-0 px-2 text-center">Unit</th>
                        <th className="py-0 px-2 text-right">Processing Fee (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-extrabold">
                      {group.components.map((comp) => (
                        <tr 
                          key={comp.component_type}
                          className={`hover:bg-slate-50/60 transition-colors ${comp.stock > 0 ? "bg-rose-50/10" : ""}`}
                        >
                          {/* Component name: Deep Slate Black */}
                          <td className="py-[2px] px-2 text-slate-950 font-black tracking-wide">
                            {comp.component_type}
                          </td>
                          {/* Unit count: Bold Deep color indicator badge */}
                          <td className="py-[2px] px-2 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-md border text-[13px] font-black min-w-[32px] ${
                              comp.stock > 0 
                                ? "bg-rose-100/70 text-rose-950 border-rose-250 shadow-sm" 
                                : "bg-slate-50 text-slate-400 border-slate-200 font-medium"
                            }`}>
                              {comp.stock}
                            </span>
                          </td>
                          {/* Processing Fee: Deep Indigo/Blue text */}
                          <td className="py-[2px] px-2 text-right text-indigo-950 font-black tracking-wider">
                            ₹{comp.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer section: compact timestamp py-1 text-[9px] */}
                <div className="bg-slate-50/60 px-3.5 py-1 border-t border-slate-150 text-[9px] text-slate-400 font-bold flex items-center gap-1 justify-start">
                  <MdCalendarToday className="text-slate-400 text-xs shrink-0" />
                  <span>Last Updated: {formattedLastUpdated}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;