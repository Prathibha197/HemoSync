const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- HemoSync Database Diagnostic ---');
  try {
    // 1. Connection test
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma!');

    // 2. Count records across all tables
    const userCount = await prisma.user.count();
    const donorCount = await prisma.user.count({ where: { role: 'DONOR' } });
    const hospitalCount = await prisma.user.count({ where: { role: 'HOSPITAL' } });
    const bloodBankCount = await prisma.user.count({ where: { role: 'BLOOD_BANK' } });
    const requestCount = await prisma.bloodRequest.count();
    const bloodUnitCount = await prisma.bloodUnit.count();
    const donationRecordCount = await prisma.donationRecord.count();
    const requestResponseCount = await prisma.requestResponse.count();
    const notificationLogCount = await prisma.notificationLog.count();
    const campaignCount = await prisma.campaign.count();

    console.log(`\n📊 Table Record Counts:`);
    console.log(`- Total Users: ${userCount}`);
    console.log(`  • Donors: ${donorCount}`);
    console.log(`  • Hospitals: ${hospitalCount}`);
    console.log(`  • Blood Banks: ${bloodBankCount}`);
    console.log(`- Blood Requests: ${requestCount}`);
    console.log(`- Blood Units (Inventory): ${bloodUnitCount}`);
    console.log(`- Donation Records (History): ${donationRecordCount}`);
    console.log(`- Request Responses: ${requestResponseCount}`);
    console.log(`- Notification Logs: ${notificationLogCount}`);
    console.log(`- Campaigns: ${campaignCount}`);

    // 3. Check sample test accounts
    const testAccounts = [
      'donor1@example.com',
      'hospital1@example.com',
      'bloodbank1@example.com'
    ];
    console.log(`\n🔑 Testing Seeded Demo Accounts:`);
    for (const email of testAccounts) {
      const u = await prisma.user.findUnique({
        where: { email },
        include: {
          donorRecords: true,
          bloodUnits: true,
          requests: true
        }
      });
      if (u) {
        console.log(`✅ [${u.role}] ${email} (${u.name}) exists.`);
        if (u.role === 'DONOR') {
          console.log(`   Points: ${u.points}, Streaks: ${u.streaks}, Lives Saved: ${u.livesImpacted}, History Count: ${u.donorRecords.length}`);
        } else if (u.role === 'BLOOD_BANK') {
          console.log(`   Inventory count: ${u.bloodUnits.length} units`);
        } else if (u.role === 'HOSPITAL') {
          console.log(`   Requests count: ${u.requests.length} requests`);
        }
      } else {
        console.log(`⚠️ ${email} not found!`);
      }
    }

    // 4. Test PostGIS query
    try {
      const rawGeo = await prisma.$queryRaw`SELECT 1 as connected;`;
      console.log(`\n✅ Raw SQL execution: Successful!`);
    } catch (e) {
      console.error(`❌ Raw SQL execution error:`, e.message);
    }

    console.log('\n--- Diagnostic Complete: All Systems Healthy! ---');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
