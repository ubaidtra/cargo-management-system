async function run() {
  const baseUrl = 'http://127.0.0.1:3000';
  
  console.log('Testing Pricing Settings Flow...');

  try {
    // 1. Get Initial Pricing (Should be default 10, 5)
    console.log('1. Checking Default Pricing...');
    const configRes = await fetch(`${baseUrl}/api/admin/pricing`);
    const config = await configRes.json();
    console.log(`Current: Base=${config.baseCost}, PerKg=${config.costPerKg}`);

    // 2. Update Pricing
    console.log('2. Updating Pricing to Base=$20, PerKg=$10...');
    const updateRes = await fetch(`${baseUrl}/api/admin/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseCost: 20, costPerKg: 10 })
    });
    
    if (!updateRes.ok) throw new Error('Failed to update pricing');
    const newConfig = await updateRes.json();
    console.log(`Updated: Base=${newConfig.baseCost}, PerKg=${newConfig.costPerKg}`);

    // 3. Create Cargo with New Pricing
    console.log('3. Creating Cargo (10kg)...');
    // Expected Cost: 20 + (10 * 10) = 120
    const createRes = await fetch(`${baseUrl}/api/cargo/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Pricing Test',
        receiverName: 'Pricing Test',
        destination: 'Test Land',
        weight: 10
      })
    });
    
    const cargo = await createRes.json();
    console.log(`Cargo Cost: $${cargo.cost}`);

    if (cargo.cost === 120) {
      console.log('TEST PASSED: Cost calculation uses updated settings.');
    } else {
      console.log(`TEST FAILED: Expected 120, got ${cargo.cost}`);
    }
    
    // Cleanup: Reset to default
    await fetch(`${baseUrl}/api/admin/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseCost: 10, costPerKg: 5 })
    });

  } catch (e) {
    console.error('Test Failed:', e.message);
  }
}

run();

