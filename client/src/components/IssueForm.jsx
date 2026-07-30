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
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    inventory_id: "",
    issued_unit: "",
    issued_by: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const batch = batches.find(b => b.id.toString() === batchId);
    setSelectedBatch(batch || null);
    setFormData(prev => ({
      ...prev,
      inventory_id: batchId,
      issued_unit: "", // Reset units on batch change
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
      setError(`Cannot issue ${units} units. Only ${selectedBatch.available_unit} units are available in this batch.`);
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
        <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-sm">
          <MdErrorOutline className="text-xl shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Batch Select dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Blood Batch</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdBloodtype className="text-xl" />
            </div>
            <select
              name="inventory_id"
              value={formData.inventory_id}
              onChange={handleBatchChange}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-sm"
            >
              <option value="">Choose Batch (Blood Group | Available Qty | Location)</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.blood_type} - {batch.available_unit} Units available (Source: {batch.location})
                </option>
              ))}
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
              <span className="text-sm font-bold text-slate-800 mt-0.5 inline-block truncate max-w-[120px]">{selectedBatch.location}</span>
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
                placeholder={selectedBatch ? `Max: ${selectedBatch.available_unit}` : "Select batch first"}
                required
                min="1"
                max={selectedBatch ? selectedBatch.available_unit : undefined}
                disabled={!selectedBatch}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
