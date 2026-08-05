import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdRemoveCircle, 
  MdArrowBack, 
  MdCheckCircle,
  MdErrorOutline
} from "react-icons/md";
import { inventoryApi } from "../services/api";
import IssueForm from "../components/IssueForm";

function IssueBlood() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [fetchingBatches, setFetchingBatches] = useState(true);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    try {
      setFetchingBatches(true);
      setError(null);
      const res = await inventoryApi.list(1, 1000);
      const activeBatches = (res.data || []).filter(item => item.available_unit > 0);
      setBatches(activeBatches);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch available blood batches from inventory.");
    } finally {
      setFetchingBatches(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSuccess = () => {
    setToast("Blood dispatched successfully!");
    setTimeout(() => setToast(null), 3000);
    fetchBatches(); // Refresh stock batches after success
  };

  if (fetchingBatches) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading active inventory batches...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 border border-emerald-700 animate-slide-in-right">
          <MdCheckCircle className="text-xl" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
        >
          <MdArrowBack className="text-xl" />
        </button>
        
      </div>

      {/* Main Issue Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex items-center gap-3.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MdRemoveCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Blood Stock Issue Form</h3>
           
          </div>
        </div>

        {error && (
          <div className="p-8 pb-0">
            <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-sm">
              <MdErrorOutline className="text-xl shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <IssueForm batches={batches} onSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default IssueBlood;