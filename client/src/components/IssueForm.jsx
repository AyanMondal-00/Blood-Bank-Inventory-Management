import React, { useState } from "react";
import { 
  MdRemoveCircle, 
  MdBloodtype, 
  MdPerson, 
  MdFormatListNumbered, 
  MdNote, 
  MdErrorOutline,
  MdWarning
} from "react-icons/md";
import { inventoryApi } from "../services/api";

function IssueForm({ batches = [], onSubmitSuccess }) {
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    inventory_id: "",
    issued_unit: "",
    issued_by: "",
    remarks: "",
  });

  // Filter batches of selected blood type
  const filteredBatches = batches.filter(
    (b) => b.blood_type === selectedBloodType
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const batch = batches.find(b => b.id.toString() === batchId);
    setSelectedBatch(batch || null);
    setFormData(prev => ({
      ...prev,
      inventory_id: batchId,
      issued_unit: batch ? batch.available_unit.toString() : "", // Pre-fill with max available units on batch change
    }));
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
      setError("Please select an active blood batch.");
      return;
    }
    const units = Number(formData.issued_unit);
    if (isNaN(units) || units <= 0) {
      setError("Please enter a valid positive quantity to issue.");
      return;
    }
    if (selectedBatch && units > selectedBatch.available_unit) {
      setError(`Units available nei otoo! (Only ${selectedBatch.available_unit} units available in this batch)`);
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
      setFormData({
        inventory_id: "",
        issued_unit: "",
        issued_by: "",
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
          className="bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 text-rose-800 text-sm shadow-sm border-l-4 border-l-rose-600 transition animate-slide-down"
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

        {/* 2. Units available with expiry dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Units available with expiry</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdBloodtype className="text-xl" />
            </div>
            <select
              name="inventory_id"
              value={formData.inventory_id}
              onChange={handleBatchChange}
              disabled={!selectedBloodType}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedBloodType 
                  ? "Choose Batch (Available Units | Expiry Date)" 
                  : "Please select blood type first"}
              </option>
              {filteredBatches.map((batch) => {
                const formattedExpiry = new Date(batch.expiry_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });
                return (
                  <option key={batch.id} value={batch.id}>
                    {batch.available_unit} Units (Expiry: {formattedExpiry}) (Received By: {batch.received_by || "System"})
                  </option>
                );
              })}
              {selectedBloodType && filteredBatches.length === 0 ? (
                <option disabled value="">No active batches for {selectedBloodType}</option>
              ) : null}
            </select>
          </div>
        </div>

        {/* Dynamic Batch Details */}
        {selectedBatch && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-500 animate-slide-down">
            <div>
              <span className="block text-slate-400 uppercase tracking-wider">Blood Group</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 inline-block">{selectedBatch.blood_type}</span>
            </div>
            <div>
              <span className="block text-slate-400 uppercase tracking-wider">Available Bags</span>
              <span className="text-sm font-bold text-rose-600 mt-0.5 inline-block">{selectedBatch.available_unit} Units</span>
            </div>
            <div>
              <span className="block text-slate-400 uppercase tracking-wider">Original Source</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 inline-block truncate max-w-[120px]">{selectedBatch.received_by || "System"}</span>
            </div>
            <div>
              <span className="block text-slate-400 uppercase tracking-wider">Expiry Date</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 inline-block">{new Date(selectedBatch.expiry_date).toLocaleDateString()}</span>
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
                placeholder={selectedBatch ? `Max: ${selectedBatch.available_unit}` : "Select batch first"}
                required
                min="1"
                max={selectedBatch ? selectedBatch.available_unit : undefined}
                disabled={!selectedBatch}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:moz-appearance-textfield"
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
                onChange={handleChange}
                placeholder="e.g. Hospital Clinic, Dr. Kabir"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
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
