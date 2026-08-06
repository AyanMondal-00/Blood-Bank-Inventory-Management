import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdSearch, 
  MdRefresh, 
  MdWarning, 
  MdCheckCircle, 
  MdHourglassEmpty,
  MdLayers,
  MdDateRange,
  MdTune,
  MdClear,
  MdFilterList
} from "react-icons/md";
import { inventoryApi } from "../services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"];
const COMPONENTS = [
  "WHOLE BLOOD",
  "PACKED CELLS (SAGM)",
  "CONC. RBC'S",
  "FFP",
  "PLATELET CONC.",
  "CRYO PPT (AHF)",
  "CPP"
];

function ExpiryMonitoring() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, EXPIRED, CRITICAL, WARNING, SAFE

  // Advanced Filters State
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [startExpiryDate, setStartExpiryDate] = useState("");
  const [endExpiryDate, setEndExpiryDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchExpiryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await inventoryApi.getExpiryMonitoring();
      setBatches(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expiry monitoring data. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryData();
  }, []);

  const getDaysRemaining = (expiryDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryCategory = (days) => {
    if (days < 0) return "EXPIRED";
    if (days <= 5) return "CRITICAL";
    if (days <= 15) return "WARNING";
    return "SAFE";
  };

  const getStatusConfig = (category, days) => {
    switch (category) {
      case "EXPIRED":
        return { 
          label: "Expired", 
          class: "bg-rose-50 border border-rose-100 text-rose-700 font-bold", 
          icon: MdWarning 
        };
      case "CRITICAL":
        return { 
          label: `Critical: ${days}d left`, 
          class: "bg-amber-50 border border-amber-100 text-amber-700 font-bold animate-pulse", 
          icon: MdHourglassEmpty 
        };
      case "WARNING":
        return { 
          label: `Warning: ${days}d left`, 
          class: "bg-orange-50 border border-orange-100 text-orange-700 font-bold", 
          icon: MdHourglassEmpty 
        };
      case "SAFE":
      default:
        return { 
          label: `${days} days left`, 
          class: "bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium", 
          icon: MdCheckCircle 
        };
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBloodType("");
    setSelectedComponent("");
    setStartExpiryDate("");
    setEndExpiryDate("");
  };

  // Compute metrics (always based on full list)
  const metrics = batches.reduce(
    (acc, b) => {
      const days = getDaysRemaining(b.expiry_date);
      const cat = getExpiryCategory(days);
      acc[cat] += Number(b.available_unit || 0);
      return acc;
    },
    { EXPIRED: 0, CRITICAL: 0, WARNING: 0, SAFE: 0 }
  );

  // Filter items based on smart filters
  const filteredBatches = batches.filter((b) => {
    const days = getDaysRemaining(b.expiry_date);
    const cat = getExpiryCategory(days);
    
    // 1. Tab Status Filter
    if (activeTab !== "ALL" && cat !== activeTab) {
      return false;
    }

    // 2. Blood Group Filter
    if (selectedBloodType && b.blood_type !== selectedBloodType) {
      return false;
    }

    // 3. Component Type Filter
    if (selectedComponent && b.component_type !== selectedComponent) {
      return false;
    }

    // 4. Expiry Date Range Filter
    if (startExpiryDate || endExpiryDate) {
      const expDate = new Date(b.expiry_date);
      expDate.setHours(0, 0, 0, 0);

      if (startExpiryDate) {
        const start = new Date(startExpiryDate);
        start.setHours(0, 0, 0, 0);
        if (expDate < start) return false;
      }
      if (endExpiryDate) {
        const end = new Date(endExpiryDate);
        end.setHours(0, 0, 0, 0);
        if (expDate > end) return false;
      }
    }

    // 5. Search text filter
    const matchesSearch = 
      (b.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (b.blood_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (b.component_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (b.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Expiry Monitoring Dashboard...</p>
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
          onClick={fetchExpiryData}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-md transition duration-200"
        >
          <MdRefresh className="text-lg" />
          Try Again
        </button>
      </div>
    );
  }

  const hasActiveFilters = selectedBloodType || selectedComponent || startExpiryDate || endExpiryDate || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-850 tracking-wide">Expiry Monitoring</h2>
           
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-bold text-xs transition duration-150 ${
              showAdvanced 
                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <MdTune className="text-lg" />
            {showAdvanced ? "Hide Filters" : "Smart Filters"}
          </button>
          <button
            onClick={fetchExpiryData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl shadow-sm transition"
          >
            <MdRefresh className="text-lg" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Expired */}
        <div 
          onClick={() => setActiveTab("EXPIRED")}
          className={`bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-rose-450 hover:border-rose-400 hover:shadow transition duration-150 cursor-pointer border-l-4 border-l-rose-600 ${activeTab === 'EXPIRED' ? 'ring-2 ring-rose-600/20' : ''}`}
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Expired Units</span>
          <span className="text-2xl font-black text-rose-600 mt-2 block">{metrics.EXPIRED} Units</span>
        </div>

        {/* Critical */}
        <div 
          onClick={() => setActiveTab("CRITICAL")}
          className={`bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-amber-400 hover:shadow transition duration-150 cursor-pointer border-l-4 border-l-amber-500 ${activeTab === 'CRITICAL' ? 'ring-2 ring-amber-500/20' : ''}`}
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Critical (≤ 5 Days)</span>
          <span className="text-2xl font-black text-amber-500 mt-2 block">{metrics.CRITICAL} Units</span>
        </div>

        {/* Warning */}
        <div 
          onClick={() => setActiveTab("WARNING")}
          className={`bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-orange-400 hover:shadow transition duration-150 cursor-pointer border-l-4 border-l-orange-500 ${activeTab === 'WARNING' ? 'ring-2 ring-orange-500/20' : ''}`}
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Warning (6-15 Days)</span>
          <span className="text-2xl font-black text-orange-500 mt-2 block">{metrics.WARNING} Units</span>
        </div>

        {/* Safe */}
        <div 
          onClick={() => setActiveTab("SAFE")}
          className={`bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-emerald-400 hover:shadow transition duration-150 cursor-pointer border-l-4 border-l-emerald-500 ${activeTab === 'SAFE' ? 'ring-2 ring-emerald-500/20' : ''}`}
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{"Safe (> 15 Days)"}</span>
          <span className="text-2xl font-black text-emerald-600 mt-2 block">{metrics.SAFE} Units</span>
        </div>
      </div>

      {/* Tabs and Search Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100/60 p-1.5 rounded-xl self-start">
            {[
              { id: "ALL", label: "All Stock" },
              { id: "EXPIRED", label: "Expired Only" },
              { id: "CRITICAL", label: "Critical Expiry" },
              { id: "WARNING", label: "Warning" },
              { id: "SAFE", label: "Safe Stock" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-white text-rose-700 shadow-sm font-black" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdSearch className="text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search Blood Type, Component, Notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium"
            />
          </div>
        </div>

        {/* Smart Filters Panel */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-slide-down">
            {/* Blood Type Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Blood Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MdFilterList className="text-lg" />
                </div>
                <select
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-slate-700 appearance-none"
                >
                  <option value="">All Blood Groups</option>
                  {BLOOD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Component Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Component Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MdFilterList className="text-lg" />
                </div>
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-slate-700 appearance-none"
                >
                  <option value="">All Components</option>
                  {COMPONENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Expiry Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expiry From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdDateRange className="text-lg" />
                </div>
                <input
                  type="date"
                  value={startExpiryDate}
                  onChange={(e) => setStartExpiryDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* End Expiry Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expiry To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdDateRange className="text-lg" />
                </div>
                <input
                  type="date"
                  value={endExpiryDate}
                  onChange={(e) => setEndExpiryDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
                >
                  <MdClear className="text-sm" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Expiry Reporting Data Table */}
        <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                <th className="py-3.5 px-6 text-center">Blood Group</th>
                <th className="py-3.5 px-6">Component Type</th>
                <th className="py-3.5 px-6 text-right">Available Stock</th>
                <th className="py-3.5 px-6">Expiry Date</th>
                <th className="py-3.5 px-6">Days Remaining</th>
                <th className="py-3.5 px-6">Collection Date</th>
                <th className="py-3.5 px-6">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b) => {
                  const days = getDaysRemaining(b.expiry_date);
                  const cat = getExpiryCategory(days);
                  const status = getStatusConfig(cat, days);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/40 transition">
                      {/* Blood Group */}
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs">
                          {b.blood_type}
                        </span>
                      </td>

                      {/* Component Type */}
                      <td className="py-3.5 px-6 text-slate-800 font-extrabold uppercase">
                        {b.component_type}
                      </td>

                      {/* Available Stock */}
                      <td className="py-3.5 px-6 text-right font-black text-slate-900">
                        {b.available_unit} Units <span className="text-[10px] text-slate-400 font-normal">/ {b.received_unit}</span>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-6 font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                          <MdDateRange className="text-sm" />
                          {new Date(b.expiry_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                      </td>

                      {/* Days Remaining Badge */}
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wide ${status.class}`}>
                          <StatusIcon className="text-sm shrink-0" />
                          {status.label}
                        </span>
                      </td>

                      {/* Collection/Entry Date */}
                      <td className="py-3.5 px-6 text-slate-400 font-mono">
                        {new Date(b.entry_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      {/* Remarks */}
                      <td className="py-3.5 px-6 text-slate-400 font-normal italic truncate max-w-[120px]" title={b.remarks}>
                        {b.remarks || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 px-6 text-center text-slate-400 font-normal">
                    <MdLayers className="text-4xl text-slate-300 mx-auto mb-3" />
                    No active blood inventory batches found matching current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpiryMonitoring;
