import React, { useState, useEffect, useRef, useMemo } from "react";
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
  MdInfo,
  MdFilterList,
  MdClear
} from "react-icons/md";
import { inventoryApi } from "../services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"];
const COMPONENTS = [
  "WHOLE BLOOD",
  "PACKED CELLS (SAGM)",
  "CONC. RBC'S",
  "FFP",
  "PLATELET CONC.",
  "CRYO PPT (AHF)",
  "CPP"
];

function UpdatePrice() {
  const navigate = useNavigate();
  const priceInputRef = useRef(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState("blood"); // "blood" or "revised"

  // Form State (Blood Prices)
  const [bloodType, setBloodType] = useState("");
  const [componentType, setComponentType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  
  // Form State (Revised Charges)
  const [revisedServiceId, setRevisedServiceId] = useState("");
  const [revisedChargeVal, setRevisedChargeVal] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  
  // Table / List State
  const [prices, setPrices] = useState([]);
  const [revisedCharges, setRevisedCharges] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  
  // Filter State
  const [filterBloodType, setFilterBloodType] = useState("");
  const [filterComponent, setFilterComponent] = useState("");

  // Feedback State
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  // Fetch prices from DB
  const loadPrices = async () => {
    try {
      setTableLoading(true);
      const [pricesRes, revisedRes] = await Promise.all([
        inventoryApi.getPrices(),
        inventoryApi.getRevisedCharges(),
      ]);
      if (pricesRes && pricesRes.data) {
        setPrices(pricesRes.data);
      }
      if (revisedRes && revisedRes.data) {
        setRevisedCharges(revisedRes.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch price configurations.");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === "blood") {
      // Validations
      if (!bloodType) {
        setError("Please select a blood group.");
        return;
      }
      if (!componentType) {
        setError("Please select a component type.");
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
          component_type: componentType,
          new_price: Number(newPrice),
        };

        await inventoryApi.updatePrice(payload);
        setToast(isEditMode ? "Price updated successfully!" : "Price set successfully!");
        setTimeout(() => setToast(null), 3000);
        
        // Reset form and reload
        setBloodType("");
        setComponentType("");
        setNewPrice("");
        setIsEditMode(false);
        await loadPrices();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to update blood price. Make sure your server is running.");
      } finally {
        setLoading(false);
      }
    } else {
      // Revised Charges Validation
      if (!revisedServiceId) {
        setError("Please select a service.");
        return;
      }
      if (revisedChargeVal === "" || Number(revisedChargeVal) < 0) {
        setError("Please enter a valid positive revised charge.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const payload = {
          id: Number(revisedServiceId),
          new_charge: Number(revisedChargeVal),
        };

        await inventoryApi.updateRevisedCharge(payload);
        setToast("Processing charge updated successfully!");
        setTimeout(() => setToast(null), 3000);
        
        // Reset form and reload
        setRevisedServiceId("");
        setRevisedChargeVal("");
        setIsEditMode(false);
        await loadPrices();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to update processing charge. Make sure your server is running.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Triggered when clicking Edit icon on table row
  const handleEditClick = (item) => {
    setError(null);
    setIsEditMode(true);
    if (activeTab === "blood") {
      setBloodType(item.blood_type);
      setComponentType(item.component_type);
      setNewPrice(item.price);
    } else {
      setRevisedServiceId(item.id);
      setRevisedChargeVal(item.revised_charges_per_unit);
    }
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
    setComponentType("");
    setNewPrice("");
    setRevisedServiceId("");
    setRevisedChargeVal("");
    setIsEditMode(false);
    setError(null);
  };

  // Memoized filtered prices for maximum performance
  const filteredPrices = useMemo(() => {
    return prices.filter((item) => {
      const matchesBloodType = filterBloodType === "" || item.blood_type === filterBloodType;
      const matchesComponent = filterComponent === "" || item.component_type === filterComponent;
      return matchesBloodType && matchesComponent;
    });
  }, [prices, filterBloodType, filterComponent]);

  const hasActiveFilters = filterBloodType !== "" || filterComponent !== "";
  const handleClearFilters = () => {
    setFilterBloodType("");
    setFilterComponent("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Price & Charges Control</h1>
          </div>
        </div>
        <button
          onClick={loadPrices}
          disabled={tableLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-sm transition text-xs font-bold disabled:opacity-50"
        >
          <MdRefresh className={`text-base ${tableLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => {
            setActiveTab("blood");
            handleCancelEdit();
          }}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
            activeTab === "blood" 
              ? "bg-white text-rose-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Blood Component Prices
        </button>
        <button
          onClick={() => {
            setActiveTab("revised");
            handleCancelEdit();
          }}
          className={`px-5 py-2 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
            activeTab === "revised" 
              ? "bg-white text-rose-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Other Processing Charges
        </button>
      </div>

      {/* Main Grid: Form on Left/Top, Table on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden transition-all duration-300">
            <div className={`px-6 py-5 bg-gradient-to-r text-white flex items-center gap-3 ${isEditMode ? 'from-amber-600 to-amber-500' : 'from-rose-600 to-rose-500'}`}>
              <div className="p-2 bg-white/10 rounded-xl">
                <MdSettings className="text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {isEditMode ? "Modify Charge Rate" : "Add / Set Charge Rate"}
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  {activeTab === "blood" ? "Manage blood component rates" : "Manage revised service processing fees"}
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

              {activeTab === "blood" ? (
                <>
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
                        disabled={isEditMode}
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
                  </div>

                  {/* Component Type Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Choose Component Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MdInfo className="text-lg" />
                      </div>
                      <select
                        value={componentType}
                        onChange={(e) => setComponentType(e.target.value)}
                        required
                        disabled={isEditMode}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-xs ${isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-400' : ''}`}
                      >
                        <option value="">Select Component</option>
                        {COMPONENTS.map((comp) => (
                          <option key={comp} value={comp}>
                            {comp}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isEditMode && (
                      <p className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
                        <MdInfo className="text-xs text-amber-500" /> Blood type & component cannot be altered in edit mode.
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
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-xs appearance-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Service Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Choose Service Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MdSettings className="text-lg" />
                      </div>
                      <select
                        value={revisedServiceId}
                        onChange={(e) => setRevisedServiceId(e.target.value)}
                        required
                        disabled={isEditMode}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 appearance-none font-semibold text-xs ${isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-400' : ''}`}
                      >
                        <option value="">Select Service</option>
                        {revisedCharges.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.services_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isEditMode && (
                      <p className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1">
                        <MdInfo className="text-xs text-amber-500" /> Service type cannot be altered in edit mode.
                      </p>
                    )}
                  </div>

                  {/* Revised Price Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Processing Charge (Rs)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MdCurrencyRupee className="text-lg" />
                      </div>
                      <input
                        ref={priceInputRef}
                        type="number"
                        placeholder="e.g. 800"
                        value={revisedChargeVal}
                        onChange={(e) => setRevisedChargeVal(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        required
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-200 font-semibold text-xs appearance-none"
                      />
                    </div>
                  </div>
                </>
              )}

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
            
            {activeTab === "blood" ? (
              <>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Standard Prices Table</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Live government rates saved in database</p>
                  </div>
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-100 uppercase">
                    {filteredPrices.length} / {prices.length} Records
                  </span>
                </div>

                {/* Smart Filter Panel */}
                <div className="px-6 py-3.5 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] uppercase tracking-wider shrink-0">
                    <MdFilterList className="text-lg text-slate-450" />
                    <span>Filters:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full sm:max-w-md">
                    {/* Filter Blood Group */}
                    <div className="relative">
                      <select
                        value={filterBloodType}
                        onChange={(e) => setFilterBloodType(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-150 appearance-none cursor-pointer"
                      >
                        <option value="">All Blood Groups</option>
                        {BLOOD_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Filter Component */}
                    <div className="relative">
                      <select
                        value={filterComponent}
                        onChange={(e) => setFilterComponent(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition duration-150 appearance-none cursor-pointer"
                      >
                        <option value="">All Components</option>
                        {COMPONENTS.map((comp) => (
                          <option key={comp} value={comp}>{comp}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-rose-600 hover:text-rose-700 text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition"
                    >
                      <MdClear className="text-sm" />
                      Clear
                    </button>
                  )}
                </div>

                {tableLoading && prices.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-semibold">Loading blood prices...</p>
                  </div>
                ) : filteredPrices.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
                    <MdBloodtype className="text-5xl text-slate-200" />
                    <p className="text-sm font-bold">No matching price records found.</p>
                    <p className="text-xs font-medium">Reset the filters or update the rates using the form.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1 max-h-[480px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-150 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/30 sticky top-0 z-10">
                          <th className="py-3 px-6 bg-slate-50">Blood Type</th>
                          <th className="py-3 px-6 bg-slate-50">Component Type</th>
                          <th className="py-3 px-6 text-right bg-slate-50">Processing Fee</th>
                          <th className="py-3 px-6 text-center bg-slate-50">Last Updated</th>
                          <th className="py-3 px-6 text-center bg-slate-50">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrices.map((item) => (
                          <tr 
                            key={`${item.blood_type}-${item.component_type}`}
                            className={`border-b border-slate-100 hover:bg-slate-50/60 transition duration-150 ${bloodType === item.blood_type && componentType === item.component_type ? 'bg-amber-50/30 hover:bg-amber-50/50' : ''}`}
                          >
                            <td className="py-3.5 px-6">
                              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm shadow-rose-600/50"></span>
                                {item.blood_type}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 font-semibold text-slate-600 text-xs">
                              {item.component_type}
                            </td>
                            <td className="py-3.5 px-6 text-right font-bold text-slate-900 text-sm">
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-6 text-center text-[10px] text-slate-400 font-semibold">
                              {item.updated_at ? new Date(item.updated_at).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              }) : 'N/A'}
                            </td>
                            <td className="py-3.5 px-6 text-center">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                                title={`Edit price for ${item.blood_type} - ${item.component_type}`}
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
              </>
            ) : (
              <>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Other Processing Charges Table</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Revised service charges saved in database</p>
                  </div>
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-100 uppercase">
                    {revisedCharges.length} Records
                  </span>
                </div>

                {tableLoading && revisedCharges.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-semibold">Loading processing charges...</p>
                  </div>
                ) : revisedCharges.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
                    <MdSettings className="text-5xl text-slate-200" />
                    <p className="text-sm font-bold">No revised charges found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1 max-h-[480px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-150 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/30 sticky top-0 z-10">
                          <th className="py-3 px-6 bg-slate-50">ID</th>
                          <th className="py-3 px-6 bg-slate-50">Services Name</th>
                          <th className="py-3 px-6 text-right bg-slate-50">Processing Fee</th>
                          <th className="py-3 px-6 text-center bg-slate-50">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revisedCharges.map((item) => (
                          <tr 
                            key={item.id}
                            className={`border-b border-slate-100 hover:bg-slate-50/60 transition duration-150 ${Number(revisedServiceId) === item.id ? 'bg-amber-50/30 hover:bg-amber-50/50' : ''}`}
                          >
                            <td className="py-3.5 px-6 font-bold text-slate-500 text-xs">
                              {item.id}
                            </td>
                            <td className="py-3.5 px-6 font-bold text-slate-800 text-xs">
                              {item.services_name}
                            </td>
                            <td className="py-3.5 px-6 text-right font-black text-rose-600 text-sm">
                              ₹{Number(item.revised_charges_per_unit).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-6 text-center">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150 inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                                title={`Edit price for ${item.services_name}`}
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
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default UpdatePrice;
