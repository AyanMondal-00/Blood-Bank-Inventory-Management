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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    try {
      setFetchingBatches(true);
      setError(null);
      const res = await inventoryApi.list();
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
    setSuccess(true);
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
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <p className="text-xs text-slate-500 font-medium">Issue or dispatch blood units from active inventory stock.</p>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm animate-fade-in">
          <MdCheckCircle className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">Blood Dispatched Successfully</h4>
            <p className="text-sm text-slate-600 mt-1">The requested blood units have been subtracted from inventory stock and transaction logged.</p>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition"
              >
                Issue More Units
              </button>
              <button 
                onClick={() => navigate("/transactions")}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-lg transition"
              >
                View Transaction Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Issue Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-rose-700 to-rose-600 text-white flex items-center gap-3.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MdRemoveCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Blood Stock Issue Form</h3>
            <p className="text-xs text-rose-100 font-medium">Ensure the correct batch id and dispatch quantity are verified.</p>
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