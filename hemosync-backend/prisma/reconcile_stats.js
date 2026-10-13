const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Reconciling donor stats and history...');

  const donors = await prisma.user.findMany({
    where: { role: 'DONOR' }
  });

  const bloodBanks = await prisma.user.findMany({
    where: { role: 'BLOOD_BANK' },
    select: { id: true }
  });
  
  if (bloodBanks.length === 0) return;

  for (const donor of donors) {
    const livesSaved = donor.livesImpacted || 0;
    const expectedDonations = Math.max(Math.ceil(livesSaved / 3), donor.streaks || 0, 1); // at least 1 if they have stats
    
    const actualDonations = await prisma.donationRecord.count({
      where: { donorId: donor.id }
    });

    if (actualDonations < expectedDonations) {
      const needed = expectedDonations - actualDonations;
      const records = [];
      for (let i = 0; i < needed; i++) {
        records.push({
          donorId: donor.id,
          bloodBankId: faker.helpers.arrayElement(bloodBanks).id,
          volume: 350,
          date: faker.date.past({ years: 3 }),
          status: 'COMPLETED'
        });
      }
      await prisma.donationRecord.createMany({ data: records });
    }

    // Now update the user to strictly match reality
    const finalDonationCount = await prisma.donationRecord.count({
      where: { donorId: donor.id, status: 'COMPLETED' }
    });

    const reconciledLives = finalDonationCount * 3;
    const reconciledStreaks = Math.min(donor.streaks || 0, finalDonationCount);
    
    await prisma.user.update({
      where: { id: donor.id },
      data: {
        livesImpacted: reconciledLives,
        streaks: reconciledStreaks,
        points: finalDonationCount * 50 // 50 pts per donation
      }
    });
  }

  console.log('Successfully reconciled all donor records!');
}

main()
  .catch((e) => {
    console.error('Script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
