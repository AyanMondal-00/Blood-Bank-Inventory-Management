import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdSearch, 
  MdFilterList, 
  MdRefresh, 
  MdWarning
} from "react-icons/md";
import { transactionApi } from "../services/api";
import TransactionTable from "../components/TransactionTable";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedType, setSelectedType] = useState(""); // "", "RECEIVE", "ISSUE"

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

  // Filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      (t.received_by?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (t.issued_by?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (t.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesBloodType = selectedBloodType === "" || t.blood_type === selectedBloodType;
    const matchesType = selectedType === "" || t.transaction_type === selectedType;

    return matchesSearch && matchesBloodType && matchesType;
  });

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

        <button
          onClick={fetchTransactions}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl shadow-sm transition"
        >
          <MdRefresh className="text-lg" />
          Refresh Logs
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MdSearch className="text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search location, remarks, issuer..."
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

      {/* Transactions Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <TransactionTable data={filteredTransactions} />
      </div>
    </div>
  );
}

export default Transactions;