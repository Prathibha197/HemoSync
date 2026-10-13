require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function populateAllBloodBanks() {
  console.log('--- Populating Blood Bank Inventory ---');
  
  const bloodBanks = await prisma.user.findMany({
    where: { role: 'BLOOD_BANK' },
    include: {
      _count: {
        select: { bloodUnits: true }
      }
    }
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  for (const bank of bloodBanks) {
    // If bank has fewer than 40 units, fill it up!
    if (bank._count.bloodUnits < 40) {
      console.log(`Filling inventory for [${bank.email}] "${bank.name}" (currently had ${bank._count.bloodUnits} units)...`);
      const unitsToInsert = [];
      
      for (const bt of bloodTypes) {
        // Generate 12 to 28 units per blood type
        const count = Math.floor(Math.random() * 16) + 12;
        for (let i = 0; i < count; i++) {
          unitsToInsert.push({
            bloodBankId: bank.id,
            bloodType: bt,
            volume: 350,
            collectionDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
            expiryDate: new Date(Date.now() + Math.floor(Math.random() * 30 + 5) * 24 * 60 * 60 * 1000),
            status: 'AVAILABLE'
          });
        }
      }

      await prisma.bloodUnit.createMany({
        data: unitsToInsert
      });
      console.log(`  ✅ Added ${unitsToInsert.length} units to ${bank.name}`);
    }
  }

  console.log('--- Inventory Population Complete! ---');
}

populateAllBloodBanks()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
