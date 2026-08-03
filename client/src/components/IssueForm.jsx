import React, { useState, useEffect, useMemo } from "react";
import { 
  MdRemoveCircle, 
  MdBloodtype, 
  MdPerson, 
  MdFormatListNumbered, 
  MdNote, 
  MdErrorOutline,
  MdWarning,
  MdCalendarToday,
  MdAutoAwesome,
  MdDone
} from "react-icons/md";
import { inventoryApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function IssueForm({ batches = [], onSubmitSuccess }) {
  const { user } = useAuth();
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("ALL");
  
  // Form State
  const [formData, setFormData] = useState({
    inventory_id: "",
    issued_unit: "",
    issued_by: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        issued_by: `${user.first_name} ${user.last_name}`,
      }));
    }
  }, [user]);

  // Filter batches of selected blood type
  const filteredBatches = batches.filter(
    (b) => b.blood_type === selectedBloodType
  );

  // Sort batches by Expiry Date (FEFO - First Expired First Out)
  const sortedBatches = useMemo(() => {
    return [...filteredBatches].sort(
      (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)
    );
  }, [filteredBatches]);

  // Dynamically extract unique Month - Year combinations from active sorted batches for the filter dropdown
  const expiryMonths = useMemo(() => {
    const months = [];
    sortedBatches.forEach((b) => {
      const date = new Date(b.expiry_date);
      if (!isNaN(date.getTime())) {
        const monthName = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const label = `${monthName} - ${year}`;
        const key = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!months.some((m) => m.label === label)) {
          months.push({ label, key });
        }
      }
    });
    return months.sort((a, b) => a.key.localeCompare(b.key));
  }, [sortedBatches]);

  // Filter batches by selected month-year dropdown option
  const filteredSearchBatches = useMemo(() => {
    if (selectedMonthFilter === "ALL") {
      return sortedBatches;
    }
    return sortedBatches.filter((b) => {
      const date = new Date(b.expiry_date);
      if (isNaN(date.getTime())) return false;
      const monthName = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      const label = `${monthName} - ${year}`;
      return label === selectedMonthFilter;
    });
  }, [sortedBatches, selectedMonthFilter]);

  const getDaysRemaining = (expiryDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryBadge = (days) => {
    if (days < 0) {
      return (
        <span className="px-2.5 py-0.5 text-[9px] font-black bg-slate-100 text-slate-500 rounded-full border border-slate-200 uppercase tracking-wider">
          Expired
        </span>
      );
    }
    if (days <= 5) {
      return (
        <span className="px-2.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600 rounded-full border border-rose-100 uppercase tracking-wider animate-pulse inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-600"></span>
          Critical: {days} Days
        </span>
      );
    }
    if (days <= 15) {
      return (
        <span className="px-2.5 py-0.5 text-[9px] font-black bg-amber-50 text-amber-600 rounded-full border border-amber-100 uppercase tracking-wider inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
          Warning: {days} Days
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[9px] font-black bg-emerald-50 text-emerald-600 rounded-full border border-emerald-150 uppercase tracking-wider inline-flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
        Safe: {days} Days
      </span>
    );
  };

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
    setFormData((prev) => ({
      ...prev,
      inventory_id: batch.id.toString(),
      issued_unit: batch.available_unit.toString(), // Default pre-fill with full stock of chosen batch
    }));
    setError(null);
  };

  const handleAutoSelectFIFO = () => {
    if (sortedBatches.length > 0) {
      handleSelectBatch(sortedBatches[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!selectedBloodType) {
      setError("Please select a blood type.");
      return;
    }
    if (!formData.inventory_id) {
      setError("Please select an active blood batch from the table.");
      return;
    }
    const units = Number(formData.issued_unit);
    if (isNaN(units) || units <= 0) {
      setError("Please enter a valid positive quantity to issue.");
      return;
    }
    if (selectedBatch && units > selectedBatch.available_unit) {
      setError(`Insufficient units! Only ${selectedBatch.available_unit} units available in this batch.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        inventory_id: Number(formData.inventory_id),
        issued_unit: units,
        issued_by: formData.issued_by || "System",
        remarks: formData.remarks,
      };

      await inventoryApi.issue(payload);
      
      // Reset State
      setSelectedBloodType("");
      setSelectedBatch(null);
      setSelectedMonthFilter("ALL");
      setFormData({
        inventory_id: "",
        issued_unit: "",
        issued_by: user ? `${user.first_name} ${user.last_name}` : "",
        remarks: "",
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to issue blood stock. Check stock availability.");
    } finally {
      setLoading(false);
    }
  };

  if (batches.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-250 rounded-xl p-6 text-center text-amber-800 space-y-2">
        <MdWarning className="text-3xl mx-auto text-amber-600" />
        <h4 className="font-bold">No Active Stock Available</h4>
        <p className="text-sm max-w-md mx-auto">There are no blood bags with positive available stock units in the inventory. Please receive blood first before attempting to issue.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {error && (
        <div 
          style={{ animation: 'shake 0.4s ease-in-out' }}
          className="bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 text-rose-800 text-sm shadow-sm border-l-4 border-l-rose-600 transition"
        >
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
              20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
          `}</style>
          <div className="p-1 bg-rose-500 text-white rounded-lg animate-pulse shrink-0">
            <MdErrorOutline className="text-lg" />
          </div>
          <div className="space-y-0.5">
            <span className="font-extrabold text-rose-900 block text-xs uppercase tracking-wider">Validation Alert</span>
            <span className="text-rose-700 font-semibold text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Blood Type Select dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Blood Type</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdBloodtype className="text-xl" />
            </div>
            <select
              value={selectedBloodType}
              onChange={(e) => {
                setSelectedBloodType(e.target.value);
                setSelectedBatch(null);
                setSelectedMonthFilter("ALL");
                setFormData((prev) => ({
                  ...prev,
                  inventory_id: "",
                  issued_unit: "", // Reset units on type change
                }));
              }}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-sm"
            >
              <option value="">Choose Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Interactive Batch Table Panel (Horizontal Filter & Premium design) */}
        <div className="space-y-3">
          
          {/* Expiry Month Filter Dropdown & Recommendation Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Month:</span>
              <div className="relative">
                <select
                  value={selectedMonthFilter}
                  onChange={(e) => setSelectedMonthFilter(e.target.value)}
                  disabled={!selectedBloodType}
                  className="pl-3 pr-9 py-2 text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none cursor-pointer min-w-[140px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="ALL">All Expiry Months</option>
                  {expiryMonths.map((m) => (
                    <option key={m.key} value={m.label}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {selectedBloodType && sortedBatches.length > 0 && (
              <button
                type="button"
                onClick={handleAutoSelectFIFO}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[10px] rounded-xl border border-rose-100 uppercase transition duration-150 shadow-sm shadow-rose-600/5"
              >
                <MdAutoAwesome className="text-base" />
                
              </button>
            )}
          </div>

          {!selectedBloodType ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50/20">
              <MdCalendarToday className="text-3xl mx-auto mb-2 text-slate-300" />
              Please select a blood type first to view available batches.
            </div>
          ) : sortedBatches.length === 0 ? (
            <div className="border border-dashed border-rose-100 rounded-3xl p-8 text-center text-rose-700 text-xs font-bold bg-rose-50/20">
              <MdWarning className="text-3xl mx-auto mb-2 text-rose-500 animate-bounce" />
              No active stock batches found in inventory for {selectedBloodType}.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-md flex flex-col transition duration-300">
              
              {/* Table Body scroll block */}
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 bg-slate-50/60 sticky top-0 z-10 tracking-widest">
                      <th className="py-3.5 px-6">Batch Expiry</th>
                      <th className="py-3.5 px-6 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Available Stock</th>
                      <th className="py-3.5 px-6">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSearchBatches.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-xs text-slate-400 font-bold bg-slate-50/10">
                          No active batches found expiring in "{selectedMonthFilter}".
                        </td>
                      </tr>
                    ) : (
                      filteredSearchBatches.map((batch) => {
                        const days = getDaysRemaining(batch.expiry_date);
                        const isSelected = selectedBatch && selectedBatch.id === batch.id;
                        const formattedExpiry = new Date(batch.expiry_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        });
                        return (
                          <tr
                            key={batch.id}
                            onClick={() => handleSelectBatch(batch)}
                            className={`hover:bg-rose-500/5 transition cursor-pointer text-xs border-l-4 border-l-transparent ${
                              isSelected 
                                ? "bg-gradient-to-r from-rose-50/70 to-rose-100/10 border-l-rose-600 font-bold text-slate-900" 
                                : "text-slate-600"
                            }`}
                          >
                            {/* Expiry Date */}
                            <td className="py-3.5 px-6">
                              <span className="flex items-center gap-2 font-bold">
                                <MdCalendarToday className={`text-sm ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                                {formattedExpiry}
                              </span>
                            </td>
                            {/* Expiry Badges */}
                            <td className="py-3.5 px-6 text-center">
                              {getExpiryBadge(days)}
                            </td>
                            {/* Available stock */}
                            <td className="py-3.5 px-6 text-right text-slate-900 font-extrabold text-xs">
                              <span className={isSelected ? 'text-rose-600 font-black' : 'text-slate-800'}>
                                {batch.available_unit} Bags
                              </span>
                            </td>
                            {/* Source operator */}
                            <td className="py-3.5 px-6 text-slate-500 font-semibold truncate max-w-[150px]">
                              {batch.received_by || "System"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* FIFO Hint Footer */}
              {/* <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-bold tracking-wider">
                
              </div> */}
            </div>
          )}
        </div>

        {/* Selected Batch Details Card */}
        {selectedBatch && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-3xl p-5 flex items-center justify-between text-xs font-semibold text-slate-500 animate-slide-down border-l-4 border-l-rose-600 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Selected Blood</span>
                <span className="text-sm font-black text-rose-600 mt-0.5 inline-block">{selectedBatch.blood_type}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Batch Max Stock</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 inline-block">{selectedBatch.available_unit} Bags</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Source</span>
                <span className="text-sm font-bold text-slate-700 mt-0.5 inline-block truncate max-w-[120px]">{selectedBatch.received_by || "System"}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Expires On</span>
                <span className="text-sm font-bold text-slate-700 mt-0.5 inline-block">
                  {new Date(selectedBatch.expiry_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
            <div className="bg-rose-600 text-white rounded-full p-1.5 shadow-md shadow-rose-600/30">
              <MdDone className="text-base" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantity to Issue */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Quantity to Issue (Units)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MdFormatListNumbered className="text-xl" />
              </div>
              <input
                type="number"
                name="issued_unit"
                value={formData.issued_unit}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                placeholder={selectedBatch ? `Max: ${selectedBatch.available_unit}` : "Select batch from table first"}
                required
                min="1"
                max={selectedBatch ? selectedBatch.available_unit : undefined}
                disabled={!selectedBatch}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:moz-appearance-textfield"
              />
            </div>
          </div>

          {/* Issued By / Operator */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Authorized Issuer / Receiver</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MdPerson className="text-xl" />
              </div>
              <input
                type="text"
                name="issued_by"
                value={formData.issued_by}
                readOnly
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed focus:outline-none transition duration-200 font-semibold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Remarks textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Issue Details / Remarks</label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
              <MdNote className="text-xl" />
            </div>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Write reason for issue (e.g. Surgery, thalassemia delivery patient)..."
              rows="3"
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium resize-none text-sm"
            ></textarea>
          </div>
        </div>

        {/* Submit Dispatch Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading || !selectedBatch}
            className="flex items-center gap-2 px-7 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/15 hover:shadow-rose-600/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing Dispatch...
              </>
            ) : (
              <>
                <MdRemoveCircle className="text-lg" />
                Approve Stock Issue
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default IssueForm;
