import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdSearch, 
  MdRefresh, 
  MdChevronLeft, 
  MdChevronRight, 
  MdWarning, 
} from "react-icons/md";
import { inventoryApi } from "../services/api";
import InventoryTable from "../components/InventoryTable";

function Inventory() {
  const navigate = useNavigate();
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 8; // Number of items per page

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await inventoryApi.list(page, limit);
      setInventoryList(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load blood inventory. Make sure your server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page]);

  // Client-side search filtering
  const filteredList = inventoryList.filter((item) => {
    return (
      (item.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.blood_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading blood stock list...</p>
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
          onClick={fetchInventory}
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
          <div>
            <p className="text-xs text-slate-500 font-medium">Verify blood bag batch details, available volume and expiry timeline.</p>
          </div>
        </div>

        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl shadow-sm transition"
        >
          <MdRefresh className="text-lg" />
          Refresh Stock
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MdSearch className="text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search location, blood group, remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium"
          />
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <InventoryTable data={filteredList} />

        {/* Pagination Controls */}
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Page <strong className="text-slate-800 font-bold">{page}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdChevronLeft className="text-lg" />
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={inventoryList.length < limit}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <MdChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;