const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpecificBanks() {
  const customEmails = ['bb@test.com', 'dharsini0307@gmail.com', 'Ezioauditor4k41@gmail.com'];
  const banks = await prisma.user.findMany({
    where: { email: { in: customEmails } },
    include: {
      bloodUnits: true
    }
  });

  banks.forEach(b => {
    console.log(`Bank [${b.email}] (${b.name}): has ${b.bloodUnits.length} blood units.`);
  });
}

checkSpecificBanks().finally(() => prisma.$disconnect());
