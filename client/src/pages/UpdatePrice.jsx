import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdCheckCircle, 
  MdErrorOutline, 
  MdCurrencyRupee,
  MdBloodtype,
  MdSettings,
  MdEdit,
  MdRefresh,
  MdInfo
} from "react-icons/md";
import { inventoryApi } from "../services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function UpdatePrice() {
  const navigate = useNavigate();
  const priceInputRef = useRef(null);
  
  // Form State
  const [bloodType, setBloodType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Table / List State
  const [prices, setPrices] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  
  // Feedback State
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  // Fetch prices from DB
  const loadPrices = async () => {
    try {
      setTableLoading(true);
      const res = await inventoryApi.getPrices();
      if (res && res.data) {
        setPrices(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch current blood prices.");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

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
      setToast(isEditMode ? "Price updated successfully!" : "Price set successfully!");
      setTimeout(() => setToast(null), 3000);
      
      // Reset form and reload
      setBloodType("");
      setNewPrice("");
      setIsEditMode(false);
      await loadPrices();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update blood price. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Triggered when clicking Edit icon on table row
  const handleEditClick = (item) => {
    setBloodType(item.blood_type);
    setNewPrice(item.price);
    setIsEditMode(true);
    setError(null);
    // Focus the price input field for better UX
    setTimeout(() => {
      if (priceInputRef.current) {
        priceInputRef.current.focus();
        priceInputRef.current.select();
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    setBloodType("");
    setNewPrice("");
    setIsEditMode(false);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-slide-in-right">
          <MdCheckCircle className="text-xl" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Top Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl shadow-sm transition"
            title="Back to Dashboard"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Government Price Settings</h1>
           
          </div>
        </div>
        <button
          onClick={loadPrices}
          disabled={tableLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition text-xs font-bold disabled:opacity-50"
        >
          <MdRefresh className={`text-base ${tableLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Grid: Form on Left/Top, Table on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden transition-all duration-300">
            <div className={`px-6 py-5 bg-gradient-to-r text-white flex items-center gap-3 ${isEditMode ? 'from-amber-600 to-amber-500' : 'from-rose-600 to-rose-500'}`}>
              <div className="p-2 bg-white/10 rounded-xl">
                <MdSettings className="text-xl animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {isEditMode ? "Modify Blood Price" : "Add / Set Blood Price"}
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  {isEditMode ? "Modifying existing price value" : "Specify new blood group standard price"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-start gap-3 text-rose-700 text-xs">
                  <MdErrorOutline className="text-lg shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Blood Group Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Choose Blood Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MdBloodtype className="text-lg" />
                  </div>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    required
                    disabled={isEditMode} // Lock blood group dropdown in edit mode
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-xs ${isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-400' : ''}`}
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {isEditMode && (
                  <p className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
                    <MdInfo className="text-xs text-amber-500" /> Blood type cannot be altered in edit mode.
                  </p>
                )}
              </div>

              {/* Price Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Govt Price (Rs)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MdCurrencyRupee className="text-lg" />
                  </div>
                  <input
                    ref={priceInputRef}
                    type="number"
                    placeholder="e.g. 550"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-xs appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:moz-appearance-textfield"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition duration-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isEditMode ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10 hover:shadow-amber-600/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10 hover:shadow-rose-600/20'}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <MdCurrencyRupee className="text-base" />
                      {isEditMode ? "Update Price" : "Set Price"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Standard Prices Table</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Live government rates saved in database</p>
              </div>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-100 uppercase">
                {prices.length} Records
              </span>
            </div>

            {tableLoading && prices.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-semibold">Loading blood prices...</p>
              </div>
            ) : prices.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
                <MdBloodtype className="text-5xl text-slate-200" />
                <p className="text-sm font-bold">No price records found.</p>
                <p className="text-xs font-medium">Use the form to set prices for the first time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/30">
                      <th className="py-3 px-6">Blood Type</th>
                      <th className="py-3 px-6 text-right">Government Price</th>
                      <th className="py-3 px-6 text-center">Last Updated</th>
                      <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((item) => (
                      <tr 
                        key={item.blood_type}
                        className={`border-b border-slate-100 hover:bg-slate-50/60 transition duration-150 ${bloodType === item.blood_type ? 'bg-amber-50/30 hover:bg-amber-50/50' : ''}`}
                      >
                        {/* Blood type */}
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm shadow-rose-600/50"></span>
                            {item.blood_type}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="py-3.5 px-6 text-right font-bold text-slate-900 text-sm">
                          {Number(item.price).toLocaleString("en-US")} Rs
                        </td>
                        {/* Updated At */}
                        <td className="py-3.5 px-6 text-center text-[10px] text-slate-400 font-semibold">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : 'N/A'}
                        </td>
                        {/* Edit Button */}
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                            title={`Edit price for ${item.blood_type}`}
                          >
                            <MdEdit className="text-base" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UpdatePrice;
