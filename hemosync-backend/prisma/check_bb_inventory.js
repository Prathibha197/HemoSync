const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBloodBanks() {
  const bloodBanks = await prisma.user.findMany({
    where: { role: 'BLOOD_BANK' },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: { bloodUnits: true }
      }
    }
  });

  console.log(`Found ${bloodBanks.length} Blood Banks:`);
  bloodBanks.forEach(b => {
    if (b._count.bloodUnits === 0 || b.email.includes('prath') || b.email.includes('bloodbank')) {
      console.log(`- [${b.email}] "${b.name}": ${b._count.bloodUnits} units`);
    }
  });
}

checkBloodBanks().finally(() => prisma.$disconnect());
