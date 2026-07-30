import React from "react";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  badgeText, 
  badgeClass = "bg-slate-50 border-slate-100 text-slate-500",
  themeClass = "bg-slate-50 text-slate-600",
  alertBorderClass = "border-slate-100" 
}) {
  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex items-start gap-4 transition-all duration-300 ${alertBorderClass}`}>
      <div className={`p-3.5 rounded-xl ${themeClass}`}>
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        {badgeText && (
          <span className={`inline-flex items-center text-[11px] font-medium mt-1.5 px-2 py-0.5 rounded-md border ${badgeClass}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
