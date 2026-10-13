const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  
  await prisma.user.updateMany({
    where: { email: 'donor1@example.com' },
    data: { lastDonation: tenDaysAgo }
  });

  console.log('Set lastDonation for donor1@example.com to 10 days ago.');
}

main().finally(() => prisma.$disconnect());
