import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdSearch, 
  MdFilterList, 
  MdRefresh, 
  MdWarning,
  MdFileDownload,
  MdTune,
  MdDateRange,
  MdCurrencyRupee,
  MdClear
} from "react-icons/md";
import { transactionApi } from "../services/api";
import TransactionTable from "../components/TransactionTable";
import { useAuth } from "../hooks/useAuth";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Transactions() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedType, setSelectedType] = useState(""); // "", "RECEIVE", "ISSUE"

  // Advanced Filter State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBloodType("");
    setSelectedType("");
    setStartDate("");
    setEndDate("");
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await transactionApi.list();
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transaction logs from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);


  const handleExportToExcel = () => {
    // Define headers
    const headers = [
      "Timestamp",
      "Type",
      "Blood Type",
      "Units",
      "Total Price",
      "Expiry Date",
      "Received/Issued By",
      "Remarks"
    ];

    // Map data to rows
    const rows = filteredTransactions.map((t) => {
      const isReceive = t.transaction_type === "RECEIVE";
      
      // Format Timestamp as DD-MM-YYYY HH:mm AM/PM
      const d = new Date(t.created_at);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      // Format Expiry Date as DD-MM-YYYY
      let expiry = "N/A";
      if (t.expiry_date) {
        const ed = new Date(t.expiry_date);
        const eday = String(ed.getDate()).padStart(2, '0');
        const emonth = String(ed.getMonth() + 1).padStart(2, '0');
        const eyear = ed.getFullYear();
        expiry = `${eday}-${emonth}-${eyear}`;
      }

      const totalVal = t.total_price ? `${t.total_price} Rs` : "0 Rs";
      
      return [
        formattedDate,
        t.transaction_type,
        t.blood_type || "N/A",
        `${isReceive ? "+" : "-"}${t.units} U`,
        totalVal,
        expiry,
        t.issued_by || "System",
        t.remarks || ""
      ];
    });

    // Construct CSV content with UTF-8 BOM for perfect Excel compatibility
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Create Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `blood_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic (Advanced)
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      (t.received_by?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (t.issued_by?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (t.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesBloodType = selectedBloodType === "" || t.blood_type === selectedBloodType;
    const matchesType = selectedType === "" || t.transaction_type === selectedType;

    // Advanced Date range filter
    let matchesDate = true;
    if (startDate || endDate) {
      const transDate = new Date(t.created_at);
      transDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (transDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (transDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesBloodType && matchesType && matchesDate;
  });

  // Calculate live summary stats
  const stats = filteredTransactions.reduce(
    (acc, t) => {
      const price = Number(t.total_price || 0);
      acc.total += price;
      if (t.transaction_type === "RECEIVE") {
        acc.received += price;
      } else if (t.transaction_type === "ISSUE") {
        acc.issued += price;
      }
      return acc;
    },
    { total: 0, received: 0, issued: 0 }
  );

  const hasActiveFilters = 
    searchTerm !== "" || 
    selectedBloodType !== "" || 
    selectedType !== "" || 
    startDate !== "" || 
    endDate !== "";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading transaction logs...</p>
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
          onClick={fetchTransactions}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-xl shadow-md transition duration-200"
        >
          <MdRefresh className="text-lg" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
          >
            <MdArrowBack className="text-xl" />
          </button>
          
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-medium text-sm transition duration-150 ${
              showAdvanced 
                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <MdTune className="text-lg" />
            {showAdvanced ? "Hide Filters" : "Advanced Filters"}
          </button>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition duration-150"
          >
            <MdFileDownload className="text-lg" />
            Export to Excel
          </button>
          <button
            onClick={fetchTransactions}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl shadow-sm transition"
          >
            <MdRefresh className="text-lg" />
            Refresh Logs
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MdSearch className="text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search by remarks, receiver, or issuer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium"
            />
          </div>

          {/* Blood Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MdFilterList className="text-xl" />
            </div>
            <select
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium appearance-none"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Type Filter (RECEIVE / ISSUE) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MdFilterList className="text-xl" />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium appearance-none"
            >
              <option value="">All Transactions</option>
              <option value="RECEIVE">Receive Stock (+)</option>
              <option value="ISSUE">Issue Stock (-)</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Section */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-down">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdDateRange className="text-lg" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdDateRange className="text-lg" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Clear Filter button */}
            {hasActiveFilters && (
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
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
      </div>

      {/* Live Business Calculations Summary */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Value */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Value</span>
            <span className="text-xl font-black text-slate-800 mt-1">{stats.total.toLocaleString("en-US")} Rs</span>
          </div>
          {/* Total Received Value */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Received Value</span>
            <span className="text-xl font-black text-emerald-600 mt-1">{stats.received.toLocaleString("en-US")} Rs</span>
          </div>
          {/* Total Issued Value */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issued Value</span>
            <span className="text-xl font-black text-rose-600 mt-1">{stats.issued.toLocaleString("en-US")} Rs</span>
          </div>
          {/* Log Count */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtered Records</span>
            <span className="text-xl font-black text-slate-700 mt-1">{filteredTransactions.length} Logs</span>
          </div>
        </div>
      )}

      {/* Transactions Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <TransactionTable data={filteredTransactions} />
      </div>
    </div>
  );
}

export default Transactions;