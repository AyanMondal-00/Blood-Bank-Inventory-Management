import pool from "./config/db.js";
import { 
  createInventoryService, 
  issueBloodService, 
  getExpiryMonitoringService 
} from "./services/inventoryService.js";

async function runDatabaseTests() {
  console.log("🧪 Starting Database Service layer validation tests...\n");
  
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // 1. Receive Blood Components
    console.log("Step 1: Testing Receive Blood Service (Component splitting & unique Batch ID)...");
    
    // Clear old inventory/transactions to have a clean run
    await pool.query("DELETE FROM blood_transactions");
    await pool.query("DELETE FROM blood_inventory");
    
    const receivePayload = {
      entry_date: "2026-08-05",
      received_by: "Test Operator",
      blood_type: "A+",
      whole_blood: "10",
      packed_cells_sagm: "5",
      remarks: "Test receive operation",
    };

    const result = await createInventoryService(receivePayload);
    
    assert(result.batch_id !== undefined, "Batch ID was generated successfully: " + result.batch_id);
    assert(result.records.length === 7, "All 7 component records created (including zero values)");

    // Fetch records from database to verify
    const [rows] = await pool.query("SELECT * FROM blood_inventory WHERE batch_id = ?", [result.batch_id]);
    assert(rows.length === 7, "Database contains exactly 7 rows for batch " + result.batch_id);

    // Verify shelf-life calculation (WHOLE BLOOD = 35 days, PACKED CELLS = 42 days)
    // 2026-08-05 + 35 days = 2026-09-09
    // 2026-08-05 + 42 days = 2026-09-16
    const wholeBloodRecord = rows.find(r => r.component_type === "WHOLE BLOOD");
    const packedCellsRecord = rows.find(r => r.component_type === "PACKED CELLS (SAGM)");

    assert(wholeBloodRecord !== undefined, "Whole blood inventory row found");
    assert(packedCellsRecord !== undefined, "Packed cells inventory row found");

    const formatDateLocal = (d) => {
      const dateObj = new Date(d);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (wholeBloodRecord && packedCellsRecord) {
      const wholeBloodExpiry = formatDateLocal(wholeBloodRecord.expiry_date);
      const packedCellsExpiry = formatDateLocal(packedCellsRecord.expiry_date);
      
      console.log(`Calculated expiries - Whole Blood: ${wholeBloodExpiry}, Packed Cells: ${packedCellsExpiry}`);
      
      assert(wholeBloodExpiry === "2026-09-09", "Whole blood expiry calculated correctly as 2026-09-09 (35 days shelf-life)");
      assert(packedCellsExpiry === "2026-09-16", "Packed cells expiry calculated correctly as 2026-09-16 (42 days shelf-life)");
      
      assert(Number(wholeBloodRecord.available_unit) === 10, "Whole blood available stock set to 10");
      assert(Number(packedCellsRecord.available_unit) === 5, "Packed cells available stock set to 5");
    }

    // 2. Issue units from a specific batch row
    console.log("\nStep 2: Testing Issue Blood Service (Specific batch decrement)...");
    
    const issuePayload = {
      inventory_id: wholeBloodRecord.id,
      component_type: "WHOLE BLOOD",
      issued_unit: 4,
      issued_by: "Test Issuer",
      remarks: "Test issue operation"
    };

    const issueMsg = await issueBloodService(issuePayload);
    assert(issueMsg === "Blood issued successfully", "Issue blood service execution returned success");

    // Fetch that record again to verify stock
    const [[updatedWholeBloodRecord]] = await pool.query("SELECT * FROM blood_inventory WHERE id = ?", [wholeBloodRecord.id]);
    assert(Number(updatedWholeBloodRecord.available_unit) === 6, "Whole blood available units decreased from 10 to 6");

    // Check transaction was logged
    const [txRows] = await pool.query("SELECT * FROM blood_transactions WHERE inventory_id = ?", [wholeBloodRecord.id]);
    assert(txRows.length === 2, "Logged 2 transaction entries (1 RECEIVE, 1 ISSUE) for this inventory item");
    
    // 3. Test Expiry Monitoring Dashboard
    console.log("\nStep 3: Testing Expiry Monitoring FEFO listing...");
    const expiryMonitoringRecords = await getExpiryMonitoringService();
    
    assert(expiryMonitoringRecords.length === 2, "Expiry monitoring returned 2 active stock items");
    
    // Sort checks: WHOLE BLOOD (expires Sep 9) should come before PACKED CELLS (expires Sep 16)
    assert(expiryMonitoringRecords[0].component_type === "WHOLE BLOOD", "FEFO ordering verified: Whole Blood (expires earlier) is first in list");
    assert(expiryMonitoringRecords[1].component_type === "PACKED CELLS (SAGM)", "FEFO ordering verified: Packed cells (expires later) is second in list");

    console.log(`\n🏁 Service Layer Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("❌ Exception during service layer tests:", err);
    process.exit(1);
  } finally {
    pool.end();
  }
}

runDatabaseTests();
