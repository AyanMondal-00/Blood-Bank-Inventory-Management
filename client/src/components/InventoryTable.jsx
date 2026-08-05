import React from "react";
import { 
  MdCheckCircle, 
  MdWarning, 
  MdHourglassEmpty,
  MdLayers
} from "react-icons/md";

// Helper function inside the table component for self-sufficiency
const getExpiryStatus = (expiryDateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(expiryDateString);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: "Expired", class: "bg-rose-50 border border-rose-100 text-rose-700", icon: MdWarning };
  } else if (diffDays <= 7) {
    return { label: `Expiring in ${diffDays}d`, class: "bg-amber-50 border border-amber-100 text-amber-700", icon: MdHourglassEmpty };
  } else {
    return { label: "Healthy", class: "bg-emerald-50 border border-emerald-100 text-emerald-700", icon: MdCheckCircle };
  }
};

function InventoryTable({ data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-4 px-6">Batch ID</th>
            <th className="py-4 px-6">Blood Type</th>
            <th className="py-4 px-6">Component Type</th>
            <th className="py-4 px-6">Stock Status (Available/Total)</th>
            <th className="py-4 px-6">Received By</th>
            <th className="py-4 px-6">Entry Date</th>
            <th className="py-4 px-6">Expiry Status</th>
            <th className="py-4 px-6 text-right">Price</th>
            <th className="py-4 px-6">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          {data.length > 0 ? (
            data.map((item) => {
              const percent = Math.min(100, Math.max(0, (item.available_unit / item.received_unit) * 100));
              const expiry = getExpiryStatus(item.expiry_date);
              const ExpiryIcon = expiry.icon;
              
              return (
                <tr key={item.id} className="hover:bg-slate-50/40 transition duration-150">
                  {/* Batch ID */}
                  <td className="py-4 px-6 font-mono font-bold text-slate-800 tracking-tight">
                    {item.batch_id}
                  </td>

                  {/* Blood Group */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-sm shadow-sm">
                      {item.blood_type}
                    </span>
                  </td>

                  {/* Component Type */}
                  <td className="py-4 px-6 text-slate-800 font-extrabold uppercase">
                    {item.component_type}
                  </td>

                  {/* Stock units Progress Bar */}
                  <td className="py-4 px-6">
                    <div className="space-y-1.5 w-full max-w-[200px]">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{item.available_unit} / {item.received_unit} Bags</span>
                        <span>{Math.round(percent)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent <= 20 ? "bg-rose-500" : percent <= 50 ? "bg-amber-500" : "bg-emerald-500"
                          }`} 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 text-slate-650 max-w-[150px] truncate" title={item.received_by}>
                    {item.received_by || "N/A"}
                  </td>

                  {/* Entry date */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {new Date(item.entry_date).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </td>

                  {/* Expiry Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${expiry.class}`}>
                      <ExpiryIcon className="text-sm shrink-0" />
                      {expiry.label}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 text-right font-bold text-slate-800">
                    ₹{Number(item.government_price || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Remarks */}
                  <td className="py-4 px-6 text-slate-400 font-normal italic max-w-[160px] truncate" title={item.remarks}>
                    {item.remarks || "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="py-12 px-6 text-center text-slate-400 font-normal">
                <MdLayers className="text-4xl text-slate-300 mx-auto mb-3" />
                No blood records match your search settings.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
