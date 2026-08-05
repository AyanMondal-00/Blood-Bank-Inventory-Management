import React, { useRef, useEffect } from "react";
import { 
  MdArrowUpward, 
  MdArrowDownward,
  MdHistory
} from "react-icons/md";

function TransactionTable({ data = [] }) {
  const topScrollRef = useRef(null);
  const tableContainerRef = useRef(null);
  const isSyncingTop = useRef(false);
  const isSyncingTable = useRef(false);

  const handleTopScroll = () => {
    if (!isSyncingTable.current && tableContainerRef.current && topScrollRef.current) {
      isSyncingTop.current = true;
      tableContainerRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingTop.current = false;
      });
    }
  };

  const handleTableScroll = () => {
    if (!isSyncingTop.current && topScrollRef.current && tableContainerRef.current) {
      isSyncingTable.current = true;
      topScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingTable.current = false;
      });
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (topScrollRef.current && tableContainerRef.current) {
        const tableEl = tableContainerRef.current.querySelector("table");
        const topScrollInner = topScrollRef.current.querySelector("div");
        if (tableEl && topScrollInner) {
          topScrollInner.style.width = `${tableEl.offsetWidth}px`;
        }
      }
    };

    // Delay slightly to allow browser table layout calculation
    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, [data]);

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
    <div className="space-y-1.5 w-full">
      {/* Top scrollbar (visible at the top of the table without scrolling down) */}
      <div 
        ref={topScrollRef}
        onScroll={handleTopScroll}
        className="always-scrollbar w-full overflow-x-auto"
        style={{ height: "10px", minHeight: "10px" }}
      >
        <div style={{ height: "1px" }}></div>
      </div>

      {/* Main Table Container */}
      <div 
        ref={tableContainerRef}
        onScroll={handleTableScroll}
        className="always-scrollbar w-full border border-slate-200 rounded-2xl shadow-sm bg-white" 
        tabIndex={0}
      >
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead className="sticky top-0 bg-slate-50 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
            <th className="py-4 px-6 text-center">Timestamp</th>
            <th className="py-4 px-6 text-center">Tx Type</th>
            <th className="py-4 px-6 text-center">Blood Group</th>
            <th className="py-4 px-6">Component Type</th>
            <th className="py-4 px-6 text-right">Units</th>
            <th className="py-4 px-6 text-right">Total Price</th>
            <th className="py-4 px-6 text-center">Expiry Date</th>
            <th className="py-4 px-6">Processed By</th>
            <th className="py-4 px-6">Remarks</th>
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
                  <td className="py-4 px-6 text-slate-400 font-mono text-center">{formatDate(t.created_at)}</td>
                  
                  {/* Type Badge */}
                  <td className="py-4 px-6 text-center">
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
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-850 font-black border border-slate-200">
                      {t.blood_type || "N/A"}
                    </span>
                  </td>

                  {/* Component Type */}
                  <td className="py-4 px-6 text-slate-800 font-extrabold uppercase">
                    {t.component_type || "N/A"}
                  </td>

                  {/* Total Units */}
                  <td className={`py-4 px-6 text-right font-black text-xs ${
                    isReceive ? "text-emerald-700" : "text-rose-700"
                  }`}>
                    {isReceive ? "+" : "-"}{t.units} Bags
                  </td>

                  {/* Total Price */}
                  <td className="py-4 px-6 text-right font-black text-slate-800">
                    ₹{Number(t.total_price || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-4 px-6 text-center text-slate-500 font-mono">{formattedExpiry}</td>
                  
                  {/* Processed By */}
                  <td className="py-4 px-6 text-slate-650 truncate" title={t.issued_by}>{t.issued_by || "System"}</td>
                  
                  {/* Remarks */}
                  <td className="py-4 px-6 text-slate-400 font-normal italic truncate" title={t.remarks}>
                    {t.remarks || "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="py-12 px-6 text-center text-slate-400 font-normal">
                <MdHistory className="text-4xl text-slate-300 mx-auto mb-3" />
                No transactions match your search/filter settings.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default TransactionTable;
