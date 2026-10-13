const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'donor1@example.com' },
    include: { donorRecords: true }
  });
  console.log(`Donations count in DB: ${user.donorRecords.length}`);
  console.log(`Lives Impacted in DB: ${user.livesImpacted}`);
}

main().finally(() => prisma.$disconnect());
