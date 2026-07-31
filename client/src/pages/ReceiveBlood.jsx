import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdAddCircle, 
  MdArrowBack, 
  MdCheckCircle,
} from "react-icons/md";
import ReceiveForm from "../components/ReceiveForm";

function ReceiveBlood() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleSuccess = () => {
    setToast("Inventory registered successfully!");
    setTimeout(() => setToast(null), 3000);
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

      {/* Main Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex items-center gap-3.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MdAddCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold">New Inventory Entry Form</h3>
            
          </div>
        </div>

        <ReceiveForm onSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default ReceiveBlood;