const API_BASE = "http://localhost:5000/api";

async function runTests() {
  console.log("🚀 Starting End-to-End Backend API Test...");
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
    // 1. Test Health Check
    console.log("\nTesting health check endpoint (/health)...");
    const healthRes = await fetch(`${API_BASE}/health`);
    assert(healthRes.status === 200, "Health check status code is 200");
    const healthData = await healthRes.json();
    assert(healthData.success === true, "Health check success flag is true");
    assert(healthData.data.services.database === "OK", "Database status is OK in health check");

    // 2. Test Get Prices
    console.log("\nTesting fetching standard prices (/inventory/prices)...");
    const pricesRes = await fetch(`${API_BASE}/inventory/prices`);
    assert(pricesRes.status === 200, "Get prices status code is 200");
    const pricesData = await pricesRes.json();
    assert(pricesData.success === true, "Get prices success is true");
    assert(Array.isArray(pricesData.data), "Prices data is an array");
    assert(pricesData.data.length > 0, "Prices array is not empty");
    
    // Save original price of O+ WHOLE BLOOD
    const oPlusPriceObj = pricesData.data.find(p => p.blood_type === "O+" && p.component_type === "WHOLE BLOOD");
    const originalOPlusPrice = oPlusPriceObj ? Number(oPlusPriceObj.price) : 500;
    console.log(`Original O+ WHOLE BLOOD price: ${originalOPlusPrice} Rs`);

    // 3. Test Update Price (PUT /price)
    console.log("\nTesting updating O+ WHOLE BLOOD price (/inventory/price)...");
    const newPrice = originalOPlusPrice + 25; // Change it temporarily
    const updateRes = await fetch(`${API_BASE}/inventory/price`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blood_type: "O+",
        component_type: "WHOLE BLOOD",
        new_price: newPrice
      })
    });
    assert(updateRes.status === 200, "Update price status code is 200");
    const updateData = await updateRes.json();
    assert(updateData.success === true, "Update price success is true");

    // Fetch prices again to verify update
    const verifyRes = await fetch(`${API_BASE}/inventory/prices`);
    const verifyData = await verifyRes.json();
    const updatedOPlus = verifyData.data.find(p => p.blood_type === "O+" && p.component_type === "WHOLE BLOOD");
    assert(updatedOPlus && Number(updatedOPlus.price) === newPrice, `O+ WHOLE BLOOD price successfully updated to ${newPrice} Rs`);

    // Revert O+ price back to original
    console.log("\nReverting O+ WHOLE BLOOD price back to original value...");
    await fetch(`${API_BASE}/inventory/price`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blood_type: "O+",
        component_type: "WHOLE BLOOD",
        new_price: originalOPlusPrice
      })
    });

    // 4. Test Fetch Inventory (GET /inventory)
    console.log("\nTesting fetching inventory (/inventory)...");
    const invRes = await fetch(`${API_BASE}/inventory`);
    assert(invRes.status === 200, "Get inventory status code is 200");
    const invData = await invRes.json();
    assert(invData.success === true, "Get inventory success is true");
    assert(Array.isArray(invData.data), "Inventory data is an array");

    // 5. Test Fetch Dashboard Stats (GET /dashboard)
    console.log("\nTesting fetching dashboard statistics (/dashboard)...");
    const dashRes = await fetch(`${API_BASE}/dashboard`);
    assert(dashRes.status === 200, "Get dashboard status code is 200");
    const dashData = await dashRes.json();
    assert(dashData.success === true, "Get dashboard success is true");
    assert(dashData.data.totalAvailableUnits !== undefined, "Dashboard stats include totalAvailableUnits");
    assert(Array.isArray(dashData.data.groupStats), "Dashboard stats include groupStats array");

    console.log(`\n🏁 Test Run Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ E2E Test execution encountered an uncaught error:", error);
    process.exit(1);
  }
}

runTests();
