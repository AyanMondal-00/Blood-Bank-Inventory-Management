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
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button and page intro */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <p className="text-xs text-slate-500 font-medium">Add new blood bags to the centralized inventory registry.</p>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm animate-fade-in">
          <MdCheckCircle className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">Inventory Updated Successfully</h4>
            <p className="text-sm text-slate-600 mt-1">The blood units have been added to the stock and transaction log is saved.</p>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition"
              >
                Add Another Batch
              </button>
              <button 
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-lg transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex items-center gap-3.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <MdAddCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold">New Inventory Entry Form</h3>
            <p className="text-xs text-rose-100 font-medium">Please enter the correct metrics from the blood packet labels.</p>
          </div>
        </div>

        <ReceiveForm onSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default ReceiveBlood;