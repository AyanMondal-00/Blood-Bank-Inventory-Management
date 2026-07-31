import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdCheckCircle, 
  MdErrorOutline, 
  MdCurrencyRupee,
  MdBloodtype,
  MdSettings
} from "react-icons/md";
import { inventoryApi } from "../services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function UpdatePrice() {
  const navigate = useNavigate();
  
  // Form State
  const [bloodType, setBloodType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!bloodType) {
      setError("Please select a blood group.");
      return;
    }
    if (newPrice === "" || Number(newPrice) < 0) {
      setError("Please enter a valid positive government price.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        blood_type: bloodType,
        new_price: Number(newPrice),
      };

      await inventoryApi.updatePrice(payload);
      setToast("Price updated successfully!");
      setTimeout(() => setToast(null), 3000);
      setBloodType("");
      setNewPrice("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update blood price. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 border border-emerald-700 animate-slide-in-right">
          <MdCheckCircle className="text-xl" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Back button and page intro */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
        >
          <MdArrowBack className="text-xl" />
        </button>
     
      </div>

      {/* Main Price Update Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex items-center gap-3.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MdSettings className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Standard Price Modification Form</h3>
            
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-sm">
              <MdErrorOutline className="text-xl shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Group Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Choose Blood Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdBloodtype className="text-xl" />
                </div>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-sm"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Set New Govt Price (Rs)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MdCurrencyRupee className="text-xl" />
                </div>
                <input
                  type="number"
                  placeholder="e.g. 600"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  min="0"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-7 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/15 hover:shadow-rose-600/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <MdCurrencyRupee className="text-lg" />
                  Update Price
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePrice;
