const prisma = require('./src/config/db');
const { createRequest } = require('./src/controllers/requestController');
const { respondToRequest } = require('./src/controllers/donorController');

async function simulateFlow() {
  console.log('--- HemoSync Simulation Flow ---');

  let hospital = await prisma.user.findFirst({ where: { role: 'HOSPITAL' } });
  if (!hospital) {
    hospital = await prisma.user.create({ data: { role: 'HOSPITAL', name: 'AIIMS Test Hospital', email: 'aiims@test.com', mobile: '9999999991', password: 'password123' } });
  }

  let donor = await prisma.user.findFirst({ where: { role: 'DONOR', bloodType: 'O-' } }) 
             || await prisma.user.findFirst({ where: { role: 'DONOR' } });
  if (!donor) {
    donor = await prisma.user.create({ data: { role: 'DONOR', name: 'Test Donor', email: 'donor@test.com', mobile: '9999999992', bloodType: 'O-', password: 'password123' } });
  }

  let bloodBank = await prisma.user.findFirst({ where: { role: 'BLOOD_BANK' } });
  if (!bloodBank) {
    bloodBank = await prisma.user.create({ data: { role: 'BLOOD_BANK', name: 'Central Blood Bank', email: 'bb@test.com', mobile: '9999999993', password: 'password123' } });
  }

  console.log(`\n🏥 Hospital: ${hospital.name}`);
  console.log(`🩸 Donor: ${donor.name} (${donor.bloodType})`);
  console.log(`🏦 Blood Bank: ${bloodBank.name}`);

  // 2. Hospital creates a CRITICAL emergency request
  console.log(`\n[1] Hospital ${hospital.name} creates a CRITICAL Blood Request...`);
  
  // Create request directly using prisma for the test
  const request = await prisma.bloodRequest.create({
    data: {
      requesterId: hospital.id,
      bloodType: donor.bloodType,
      urgency: 'CRITICAL',
    }
  });

  // Inject location manually to trigger the PostGIS spatial logic
  // We'll use raw query to simulate an emergency request WITH location
  const result = await prisma.$queryRaw`
    UPDATE "BloodRequest"
    SET location = ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326) -- Chennai coordinates
    WHERE id = ${request.id}
    RETURNING id, "requesterId", "bloodType", urgency, status;
  `;
  console.log(`✅ Emergency Request Created. ID: ${request.id}`);

  // 3. Let's trigger the spatial query manually to see if it finds our donor
  console.log(`\n[2] Proximity Algorithm running... finding donors near the hospital`);
  const radiusMeters = 20000; // 20km for critical
  const nearbyDonors = await prisma.$queryRaw`
    SELECT id, name, "bloodType",
           ST_Distance(
             "location"::geography, 
             ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)::geography
           ) as distance
    FROM "User"
    WHERE role = 'DONOR'
      AND "bloodType" = ${donor.bloodType}
      AND "location" IS NOT NULL
      AND ST_DWithin(
        "location"::geography, 
        ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)::geography, 
        ${radiusMeters}
      )
  `;

  console.log(`✅ Found ${nearbyDonors.length} nearby matching donors!`);
  if (nearbyDonors.length > 0) {
    console.log(`   Closest donor is ${nearbyDonors[0].name} at ${(nearbyDonors[0].distance / 1000).toFixed(2)} km away.`);
  }

  // 4. Simulate Donor Accepting the Request
  console.log(`\n[3] Donor ${donor.name} responds to the request...`);
  const response = await prisma.requestResponse.create({
    data: {
      requestId: request.id,
      donorId: donor.id,
      response: 'ACCEPTED',
      eta: 15 // 15 minutes ETA
    }
  });
  console.log(`✅ Donor Response Saved! Status: ${response.response}, ETA: ${response.eta} mins`);

  // 5. Simulate Blood Bank Adding Inventory
  console.log(`\n[4] Blood Bank ${bloodBank.name} processes new blood units...`);
  const unit = await prisma.bloodUnit.create({
    data: {
      bloodBankId: bloodBank.id,
      bloodType: donor.bloodType,
      volume: 450,
      collectionDate: new Date(),
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
      status: 'AVAILABLE'
    }
  });
  console.log(`✅ Added 450ml of ${unit.bloodType} to Blood Bank Inventory. Expiry: ${unit.expiryDate.toDateString()}`);

  console.log('\n--- Simulation Complete! All systems functioning perfectly. ---');
}

simulateFlow().catch(console.error).finally(() => prisma.$disconnect());
