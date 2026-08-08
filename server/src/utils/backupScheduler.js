import fs from "fs";
import path from "path";
import { getDailyTransactionsModel } from "../models/transactionModel.js";

const BACKUP_DIR = "C:\\Users\\user\\Desktop\\Blood_Bank_Backup";

export const exportDailyTransactionsBackup = async () => {
  try {
    console.log("⏳ Starting daily schedule auto-export of blood transactions to Excel (CSV)...");
    
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Query only today's transactions
    const transactions = await getDailyTransactionsModel();

    // Headers matching the frontend export layout
    const headers = [
      "Timestamp",
      "Type",
      "Blood Type",
      "Component Breakdown",
      "Units",
      "Total Price",
      "Expiry Date",
      "Received/Issued By",
      "Remarks"
    ];

    // Map data rows
    const rows = transactions.map((t) => {
      const isReceive = t.transaction_type === "RECEIVE";
      
      // Format Timestamp as DD-MM-YYYY HH:mm AM/PM (matching frontend)
      const d = new Date(t.created_at);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      // Format Expiry Date as DD-MM-YYYY
      let expiry = "N/A";
      if (t.expiry_date) {
        const ed = new Date(t.expiry_date);
        const eday = String(ed.getDate()).padStart(2, '0');
        const emonth = String(ed.getMonth() + 1).padStart(2, '0');
        const eyear = ed.getFullYear();
        expiry = `${eday}-${emonth}-${eyear}`;
      }

      const totalVal = t.total_price ? `${t.total_price} Rs` : "0 Rs";
      
      return [
        formattedDate,
        t.transaction_type,
        t.blood_type || "N/A",
        t.component_type || "N/A",
        `${isReceive ? "+" : "-"}${t.units} U`,
        totalVal,
        expiry,
        t.issued_by || "System",
        t.remarks || ""
      ];
    });

    // Construct CSV with UTF-8 BOM for perfect Excel compatibility
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `daily_transactions_${dateStr}.csv`;
    const filePath = path.join(BACKUP_DIR, fileName);

    fs.writeFileSync(filePath, csvContent, "utf8");
    console.log(`✅ Daily export complete: Saved to ${filePath} (${transactions.length} records)`);
  } catch (error) {
    console.error("❌ Failed daily transactions export:", error.message);
  }
};

// Calculate milliseconds until the next occurrence of 11:59 PM (23:59:00)
const getMsUntil1159PM = () => {
  const now = new Date();
  const target = new Date(now);
  target.setHours(23, 59, 0, 0); // Set to 23:59 today
  
  // If it's already past 11:59 PM today, set target to 11:59 PM tomorrow
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  
  return target.getTime() - now.getTime();
};

export const startBackupScheduler = () => {
  // Run once immediately when the server starts to verify export functionality
  exportDailyTransactionsBackup();

  const scheduleNextRun = () => {
    const delay = getMsUntil1159PM();
    const nextRunTime = new Date(Date.now() + delay).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    console.log(`⏱️ Daily export scheduler active. Next run at 11:59 PM (in ${Math.round(delay / 1000 / 60)} minutes, target time: ${nextRunTime}).`);

    setTimeout(async () => {
      await exportDailyTransactionsBackup();
      scheduleNextRun(); // Recursively schedule for the next day's 11:59 PM
    }, delay);
  };

  scheduleNextRun();
};
