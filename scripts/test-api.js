async function run() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing API Flow...');

  try {
    // 1. Create Cargo
    console.log('1. Creating Cargo...');
    const createRes = await fetch(`${baseUrl}/api/cargo/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'John Test',
        receiverName: 'Jane Test',
        destination: 'Test Country',
        weight: 10
      })
    });
    
    if (!createRes.ok) throw new Error('Failed to create cargo');
    const cargo = await createRes.json();
    console.log('Created:', cargo.trackingNumber);

    // 2. Get Stats (should be > 0)
    const statsRes1 = await fetch(`${baseUrl}/api/stats`);
    const stats1 = await statsRes1.json();
    console.log('Stats (Total Cargo):', stats1.totalCargo);

    // 3. Pay
    console.log('3. Paying Cargo...');
    await fetch(`${baseUrl}/api/cargo/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber: cargo.trackingNumber, action: 'PAY' })
    });

    // 4. Receive
    console.log('4. Receiving Cargo...');
    await fetch(`${baseUrl}/api/cargo/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber: cargo.trackingNumber, action: 'RECEIVE' })
    });

    // 5. Verify Update
    const getRes = await fetch(`${baseUrl}/api/cargo/receive?trackingNumber=${cargo.trackingNumber}`);
    const updatedCargo = await getRes.json();
    console.log('Updated Status:', updatedCargo.status, updatedCargo.paymentStatus);

    if (updatedCargo.status === 'RECEIVED' && updatedCargo.paymentStatus === 'PAID') {
      console.log('TEST PASSED!');
    } else {
      console.log('TEST FAILED');
    }
  } catch (e) {
    console.error('Test Failed:', e.message);
    console.log('Make sure the server is running on port 3000');
  }
}

run();

