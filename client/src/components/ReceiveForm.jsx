import React, { useState, useEffect } from "react";
import {
  MdAddCircle,
  MdBloodtype,
  MdPerson,
  MdDateRange,
  MdNote,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";
import { inventoryApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"];

const COMPONENT_SHELF_LIVES = {
  whole_blood: 35,
  packed_cells_sagm: 42,
  conc_rbcs: 35,
  ffp: 365,
  platelet_conc: 5,
  cryo_ppt_ahf: 365,
  cpp: 365,
};

const calculateExpiryDate = (entryDateStr, name) => {
  if (!entryDateStr) return "Select collection date";
  const entryDate = new Date(entryDateStr);
  if (isNaN(entryDate.getTime())) return "Invalid collection date";
  const days = COMPONENT_SHELF_LIVES[name];
  if (!days) return "";
  
  const expiryDate = new Date(entryDate.getTime());
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return expiryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

function ReceiveForm({ onSubmitSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split("T")[0],
    received_by: "",
    blood_type: "",
    whole_blood: "",
    packed_cells_sagm: "",
    conc_rbcs: "",
    ffp: "",
    platelet_conc: "",
    cryo_ppt_ahf: "",
    cpp: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await inventoryApi.getPrices();
        if (response && response.data) {
          setPrices(response.data);
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError("Failed to fetch government prices. Make sure backend is running.");
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        received_by: `${user.first_name} ${user.last_name}`,
      }));
    }
  }, [user]);

  // Extract component prices for the selected blood group
  const activePrices = React.useMemo(() => {
    if (!formData.blood_type) return [];
    return prices.filter((p) => p.blood_type === formData.blood_type);
  }, [prices, formData.blood_type]);

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

    const components = {
      whole_blood: Number(formData.whole_blood || 0),
      packed_cells_sagm: Number(formData.packed_cells_sagm || 0),
      conc_rbcs: Number(formData.conc_rbcs || 0),
      ffp: Number(formData.ffp || 0),
      platelet_conc: Number(formData.platelet_conc || 0),
      cryo_ppt_ahf: Number(formData.cryo_ppt_ahf || 0),
      cpp: Number(formData.cpp || 0),
    };

    const totalUnits = Object.values(components).reduce((sum, val) => sum + val, 0);

    if (totalUnits <= 0) {
      setError("Please enter quantity for at least one component.");
      return;
    }

    if (totalUnits > 3000) {
      setError("Total received units cannot exceed 3000 bags at a single time.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        whole_blood: components.whole_blood,
        packed_cells_sagm: components.packed_cells_sagm,
        conc_rbcs: components.conc_rbcs,
        ffp: components.ffp,
        platelet_conc: components.platelet_conc,
        cryo_ppt_ahf: components.cryo_ppt_ahf,
        cpp: components.cpp,
      };

      await inventoryApi.create(payload);

      // Clear Form state
      setFormData({
        entry_date: new Date().toISOString().split("T")[0],
        received_by: user ? `${user.first_name} ${user.last_name}` : "",
        blood_type: "",
        whole_blood: "",
        packed_cells_sagm: "",
        conc_rbcs: "",
        ffp: "",
        platelet_conc: "",
        cryo_ppt_ahf: "",
        cpp: "",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Received By Input (Auto-filled read-only) */}
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
              readOnly
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed focus:outline-none transition duration-200 font-semibold text-sm"
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
      </div>

      {/* Component Quantities Grid */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider">
            Blood Component Quantities (Bags)
          </h4>
          {formData.blood_type && activePrices.length > 0 && (
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <MdInfoOutline className="text-sm text-slate-500" /> Rates shown below are standard processing fees.
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150">
          {[
            { label: "Whole Blood", name: "whole_blood", dbKey: "WHOLE BLOOD" },
            { label: "Packed Cells (SAGM)", name: "packed_cells_sagm", dbKey: "PACKED CELLS (SAGM)" },
            { label: "Conc. RBC's", name: "conc_rbcs", dbKey: "CONC. RBC'S" },
            { label: "FFP", name: "ffp", dbKey: "FFP" },
            { label: "Platelet Conc.", name: "platelet_conc", dbKey: "PLATELET CONC." },
            { label: "Cryo PPT (AHF)", name: "cryo_ppt_ahf", dbKey: "CRYO PPT (AHF)" },
            { label: "CPP", name: "cpp", dbKey: "CPP" },
          ].map((comp) => {
            const compPriceObj = activePrices.find((p) => p.component_type === comp.dbKey);
            const compPrice = compPriceObj ? compPriceObj.price : null;

            return (
              <div key={comp.name} className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                    {comp.label}
                  </label>
                  {formData.blood_type && (
                    <div className="mt-0.5 space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 block">
                        Fee: {compPrice !== null ? `₹${compPrice}` : "Not Set"}
                      </span>
                      <span className="text-[9px] font-extrabold text-rose-500 block">
                        Expiry: {calculateExpiryDate(formData.entry_date, comp.name)}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  name={comp.name}
                  value={formData[comp.name]}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  placeholder="0"
                  min="0"
                  max="3000"
                  className="w-full mt-2 px-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-bold text-xs"
                />
              </div>
            );
          })}
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
