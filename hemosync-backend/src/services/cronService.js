const cron = require('node-cron');
const prisma = require('../config/db');

// Run every night at midnight to check for expired blood units
cron.schedule('0 0 * * *', async () => {
  console.log('[Cron] Running daily blood unit expiry check...');
  try {
    const result = await prisma.bloodUnit.updateMany({
      where: {
        status: 'AVAILABLE',
        expiryDate: { lte: new Date() }
      },
      data: {
        status: 'EXPIRED'
      }
    });
    console.log(`[Cron] Marked ${result.count} blood units as EXPIRED.`);
  } catch (error) {
    console.error('[Cron] Error running expiry check:', error);
  }
});
