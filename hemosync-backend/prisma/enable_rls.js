const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Enabling Row-Level Security (RLS) on all tables to lock down Supabase API...');

  const tables = [
    'User',
    'BloodRequest',
    'Campaign',
    'BloodUnit',
    'DonationRecord',
    'NotificationLog',
    'RequestResponse'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ Enabled RLS for table: ${table}`);
    } catch (e) {
      console.error(`❌ Failed to enable RLS for ${table}:`, e.message);
    }
  }

  console.log('Done! All tables are now secured against anonymous Supabase API access.');
  console.log('Prisma will continue to work normally because it connects as a trusted database user.');
}

main()
  .catch((e) => {
    console.error('Script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
