const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany({
    select: { id: true, role: true, email: true, name: true }
  });
  
  // Find any blood banks that have 0 units
  const bloodBanks = await prisma.user.findMany({
    where: { role: 'BLOOD_BANK' },
    include: {
      _count: {
        select: { bloodUnits: true }
      }
    }
  });

  const emptyBanks = bloodBanks.filter(b => b._count.bloodUnits === 0);
  console.log('Empty Blood Banks Count:', emptyBanks.length);
  emptyBanks.forEach(b => console.log(`Empty: [${b.email}] ${b.name}`));

  // Also check all users whose email might be what the user logged in with
  console.log('\nUsers created with custom emails:');
  allUsers.filter(u => !u.email.includes('@example.com')).forEach(u => {
    console.log(`- [${u.role}] ${u.email} (${u.name})`);
  });
}

main().finally(() => prisma.$disconnect());
