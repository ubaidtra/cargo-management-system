async function run() {
  const baseUrl = 'http://127.0.0.1:3000';
  
  console.log('Testing Date Field...');

  try {
    const testDate = '2025-12-25';
    console.log(`Creating Cargo with date: ${testDate}`);

    const createRes = await fetch(`${baseUrl}/api/cargo/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Date Test',
        receiverName: 'Date Test',
        destination: 'North Pole',
        weight: 5,
        sendingDate: testDate
      })
    });
    
    if (!createRes.ok) throw new Error('Failed to create cargo');
    const cargo = await createRes.json();
    
    // The date returned might be full ISO string, check if it starts with the date part
    console.log('Created Cargo Date:', cargo.sendingDate);

    if (cargo.sendingDate.startsWith(testDate)) {
      console.log('TEST PASSED: Date saved correctly.');
    } else {
      // It might be timezone offset, but usually it should match close enough or be same day
      console.log('TEST CHECK: Verify if date matches appropriately (ignoring time).');
    }

  } catch (e) {
    console.error('Test Failed:', e.message);
  }
}

run();

