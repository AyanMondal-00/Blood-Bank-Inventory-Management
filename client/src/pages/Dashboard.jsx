import React, { useState, useEffect } from "react";
import { 
  MdRefresh, 
  MdWarning, 
  MdBloodtype, 
  MdCurrencyRupee, 
  MdAddCircle, 
  MdCheckCircle 
} from "react-icons/md";
import { dashboardApi } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load blood group metrics. Make sure your server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
      {/* Main Stock Grid */}
      {groupStats.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3">
          <MdBloodtype className="text-5xl text-rose-300 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-slate-700">No Inventory Records Found</h3>
          <p className="text-sm text-slate-500">Please add blood bags via the "Receive Blood (Entry)" page to populate the group-wise status dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupStats.map((group) => {
            const hasStock = group.totalAvailable > 0;
            return (
              <div 
                key={group.blood_type}
                className={`bg-white border rounded-2xl p-4.5 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                  hasStock ? "border-rose-100/60" : "border-slate-100 bg-slate-50/20"
                }`}
              >
                {/* Header section with Blood type badge and availability status */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-rose-600 text-white font-black text-lg shadow-md shadow-rose-600/10 ${
                    hasStock ? "" : "opacity-40"
                  }`}>
                    {group.blood_type}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${
                    hasStock 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-red-600 text-white border border-red-700 shadow-md"
                  }`}>
                    {hasStock ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* Body section showing Prices and Units */}
                <div className={`space-y-2.5 ${hasStock ? "" : "opacity-40"}`}>
                  {/* Government Price */}
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-slate-800 font-extrabold flex items-center gap-1.5">
                      <MdCurrencyRupee className="text-xl text-slate-400" />
                      Govt Price:
                    </span>
                    <span className="font-black text-slate-800 text-lg">{group.government_price} Rs</span>
                  </div>

                  {/* Available Units */}
                  <div className="flex items-center justify-between text-lg border-t border-slate-50 pt-2">
                    <span className="text-slate-800 font-extrabold flex items-center gap-1.5">
                      <MdCheckCircle className="text-xl text-emerald-500" />
                      Available Stock:
                    </span>
                    <span className={`font-black text-xl ${hasStock ? "text-rose-600" : "text-slate-400"}`}>
                      {group.totalAvailable} Bags
                    </span>
                  </div>

                  
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