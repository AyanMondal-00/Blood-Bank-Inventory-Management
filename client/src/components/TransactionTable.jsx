import React from "react";
import { 
  MdArrowUpward, 
  MdArrowDownward,
  MdHistory
} from "react-icons/md";

function TransactionTable({ data = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <th className="py-4 px-6">Timestamp</th>
            <th className="py-4 px-6">Type</th>
            <th className="py-4 px-6">Blood Type</th>
            <th className="py-4 px-6 text-right">Units</th>
            <th className="py-4 px-6 text-right">Total Price</th>
            <th className="py-4 px-6 text-center">Expiry Date</th>
            <th className="py-4 px-6">Recived / Issued By</th>
            <th className="py-4 px-6">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          {data.length > 0 ? (
            data.map((t) => {
              const isReceive = t.transaction_type === "RECEIVE";
              return (
                <tr key={t.id} className="hover:bg-slate-50/40 transition duration-150">
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">{formatDate(t.created_at)}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isReceive 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {isReceive ? (
                        <>
                          <MdArrowDownward className="text-sm" />
                          RECEIVE
                        </>
                      ) : (
                        <>
                          <MdArrowUpward className="text-sm" />
                          ISSUE
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {t.blood_type || "N/A"}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold text-base ${
                    isReceive ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {isReceive ? "+" : "-"}{t.units} U
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-800">
                    {Number(t.total_price || 0).toLocaleString("en-US")} Rs
                  </td>
                  <td className="py-4 px-6 text-center text-slate-500 font-mono text-xs">
                    {t.expiry_date ? new Date(t.expiry_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    }) : "-"}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{t.issued_by || "System"}</td>
                  <td className="py-4 px-6 text-slate-400 font-normal italic max-w-[200px] truncate" title={t.remarks}>
                    {t.remarks || "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="py-12 px-6 text-center text-slate-400 font-normal">
                <MdHistory className="text-4xl text-slate-300 mx-auto mb-3" />
                No transactions match your search/filter settings.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
