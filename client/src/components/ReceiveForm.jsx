import React, { useState } from "react";
import {
  MdAddCircle,
  MdBloodtype,
  MdPerson,
  MdCurrencyRupee,
  MdDateRange,
  MdNote,
  MdErrorOutline,
} from "react-icons/md";
import { inventoryApi } from "../services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function ReceiveForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split("T")[0],
    received_by: "",
    blood_type: "",
    government_price: "",
    received_unit: "",
    expiry_date: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation checks
    if (!formData.blood_type) {
      setError("Please select a blood type.");
      return;
    }
    if (Number(formData.received_unit) <= 0) {
      setError("Received units must be a positive number.");
      return;
    }
    if (Number(formData.government_price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        received_unit: Number(formData.received_unit),
        government_price: Number(formData.government_price),
      };

      await inventoryApi.create(payload);

      // Clear Form state
      setFormData({
        entry_date: new Date().toISOString().split("T")[0],
        received_by: "",
        blood_type: "",
        government_price: "",
        received_unit: "",
        expiry_date: "",
        remarks: "",
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Failed to submit inventory update. Check backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-sm">
          <MdErrorOutline className="text-xl shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Type dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Blood Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdBloodtype className="text-xl" />
            </div>
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
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

        {/* Received Unit Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quantity (Units/Bags)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdAddCircle className="text-xl" />
            </div>
            <input
              type="number"
              name="received_unit"
              value={formData.received_unit}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              min="1"
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
            />
          </div>
        </div>

        {/* Received By Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Received By
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdPerson className="text-xl" />
            </div>
            <input
              type="text"
              name="received_by"
              value={formData.received_by}
              onChange={handleChange}
              placeholder="Enter Receiver Name (e.g. Dr. Kabir)"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700   
  focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-   
  medium text-sm"
            />
          </div>
        </div>

        {/* Government Price Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Government Price (Rs)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdCurrencyRupee className="text-xl" />
            </div>
            <input
              type="number"
              name="government_price"
              value={formData.government_price}
              onChange={handleChange}
              placeholder="e.g. 500"
              required
              min="0"
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
            />
          </div>
        </div>

        {/* Entry Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Collection / Entry Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdDateRange className="text-xl" />
            </div>
            <input
              type="date"
              name="entry_date"
              value={formData.entry_date}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Expiry Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdDateRange className="text-xl" />
            </div>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium text-sm"
            />
          </div>
        </div>
      </div>

      {/* Remarks Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Remarks / Notes
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
            <MdNote className="text-xl" />
          </div>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Write any additional observations (optional)..."
            rows="3"
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-medium resize-none text-sm"
          ></textarea>
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
              Registering...
            </>
          ) : (
            <>
              <MdAddCircle className="text-lg" />
              Save Inventory Entry
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ReceiveForm;
