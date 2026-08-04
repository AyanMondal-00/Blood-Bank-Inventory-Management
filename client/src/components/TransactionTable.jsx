import React from "react";
import { 
  MdArrowUpward, 
  MdArrowDownward,
  MdHistory
} from "react-icons/md";

function TransactionTable({ data = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl shadow-sm bg-white">
      <table className="w-full text-left border-collapse min-w-[1600px] whitespace-nowrap table-fixed">
        <colgroup>
          <col className="w-[180px]" />
          <col className="w-[120px]" />
          <col className="w-[110px]" />
          <col className="w-[130px]" />
          <col className="w-[160px]" />
          <col className="w-[130px]" />
          <col className="w-[100px]" />
          <col className="w-[140px]" />
          <col className="w-[140px]" />
          <col className="w-[100px]" />
          <col className="w-[110px]" />
          <col className="w-[130px]" />
          <col className="w-[130px]" />
          <col className="w-[160px]" />
          <col className="w-[200px]" />
        </colgroup>
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
            <th className="py-4 px-4.5 text-center">Timestamp</th>
            <th className="py-4 px-4.5 text-center">Tx Type</th>
            <th className="py-4 px-4.5 text-center">Blood Group</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">Whole Blood</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">Packed Cells (SAGM)</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">Conc. RBC's</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">FFP</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">Platelet Conc.</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">Cryo PPT (AHF)</th>
            <th className="py-4 px-4.5 text-center bg-rose-50/30 text-rose-700">CPP</th>
            <th className="py-4 px-4.5 text-center bg-slate-100 text-slate-800 font-extrabold">Total Units</th>
            <th className="py-4 px-4.5 text-right">Total Price</th>
            <th className="py-4 px-4.5 text-center">Expiry Date</th>
            <th className="py-4 px-4.5">Processed By</th>
            <th className="py-4 px-4.5">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
          {data.length > 0 ? (
            data.map((t) => {
              const isReceive = t.transaction_type === "RECEIVE";
              const formattedExpiry = t.expiry_date ? new Date(t.expiry_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }) : "-";

              return (
                <tr key={t.id} className="hover:bg-slate-50/50 transition duration-150">
                  {/* Timestamp */}
                  <td className="py-4 px-4.5 text-slate-400 font-mono text-center">{formatDate(t.created_at)}</td>
                  
                  {/* Type Badge */}
                  <td className="py-4 px-4.5 text-center">
                    <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                      isReceive 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {isReceive ? (
                        <>
                          <MdArrowDownward className="text-sm shrink-0" />
                          RECEIVE
                        </>
                      ) : (
                        <>
                          <MdArrowUpward className="text-sm shrink-0" />
                          ISSUE
                        </>
                      )}
                    </span>
                  </td>

                  {/* Blood Type */}
                  <td className="py-4 px-4.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-850 font-black border border-slate-200">
                      {t.blood_type || "N/A"}
                    </span>
                  </td>

                  {/* Component Columns (7 columns) */}
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.whole_blood > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.whole_blood > 0 ? `${isReceive ? "+" : "-"}${t.whole_blood}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.packed_cells_sagm > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.packed_cells_sagm > 0 ? `${isReceive ? "+" : "-"}${t.packed_cells_sagm}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.conc_rbcs > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.conc_rbcs > 0 ? `${isReceive ? "+" : "-"}${t.conc_rbcs}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.ffp > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.ffp > 0 ? `${isReceive ? "+" : "-"}${t.ffp}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.platelet_conc > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.platelet_conc > 0 ? `${isReceive ? "+" : "-"}${t.platelet_conc}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.cryo_ppt_ahf > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.cryo_ppt_ahf > 0 ? `${isReceive ? "+" : "-"}${t.cryo_ppt_ahf}` : "0"}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-center font-bold bg-rose-50/10">
                    <span className={t.cpp > 0 ? "text-slate-900 font-black" : "text-slate-300 font-normal"}>
                      {t.cpp > 0 ? `${isReceive ? "+" : "-"}${t.cpp}` : "0"}
                    </span>
                  </td>

                  {/* Total Units */}
                  <td className={`py-4 px-4.5 text-center font-black text-sm bg-slate-100/50 ${
                    isReceive ? "text-emerald-700" : "text-rose-700"
                  }`}>
                    {isReceive ? "+" : "-"}{t.units} U
                  </td>

                  {/* Total Price */}
                  <td className="py-4 px-4.5 text-right font-black text-slate-800">
                    ₹{Number(t.total_price || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-4 px-4.5 text-center text-slate-500 font-mono">{formattedExpiry}</td>
                  
                  {/* Processed By */}
                  <td className="py-4 px-4.5 text-slate-600 truncate" title={t.issued_by}>{t.issued_by || "System"}</td>
                  
                  {/* Remarks */}
                  <td className="py-4 px-4.5 text-slate-400 font-normal italic truncate" title={t.remarks}>
                    {t.remarks || "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="15" className="py-12 px-6 text-center text-slate-400 font-normal">
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
