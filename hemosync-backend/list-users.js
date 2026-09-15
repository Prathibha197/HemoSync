const prisma = require('./src/config/db');

async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      role: true,
      name: true,
      email: true,
      mobile: true,
    }
  });

  console.table(users);
}

listUsers().catch(console.error).finally(() => prisma.$disconnect());
