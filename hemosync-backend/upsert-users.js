const prisma = require('./src/config/db');
const bcrypt = require('bcryptjs');

const USERS_TO_UPSERT = [
  { role: 'DONOR', name: 'Prathibha', email: 'prathibhaprabhu6@gmail.com', mobile: '8438258962', password: '19Prat@srmc', bloodType: 'B+' },
  { role: 'DONOR', name: 'Thejaashree', email: 'thejaashreep@gmail.com', mobile: '8072534969', password: 'apollo@12', bloodType: 'O+' },
  { role: 'DONOR', name: 'Charunetra', email: 'tkcharunetra@gmail.com', mobile: '6385309382', password: 'apollo@12', bloodType: 'A+' },
  { role: 'DONOR', name: 'Prabhu', email: 'prabhur80@gmail.com', mobile: '9500044310', password: 'apollo@12', bloodType: 'AB-' },
  { role: 'HOSPITAL', name: 'SRM Prime Hospital', email: 'sanjanagopinath1981@gmail.com', mobile: '9025879003', password: 'password123', bloodType: null },
  { role: 'HOSPITAL', name: 'City Hospital', email: 'varshitatv01@gmail.com', mobile: '8778571234', password: 'password123', bloodType: null },
  { role: 'BLOOD_BANK', name: 'Central Blood Bank', email: 'dharsini0307@gmail.com', mobile: '8825690254', password: 'password123', bloodType: null },
  { role: 'BLOOD_BANK', name: 'NGO Blood Bank', email: 'Ezioauditor4k41@gmail.com', mobile: '8925877696', password: 'password123', bloodType: null }
];

async function main() {
  // Clear any potential conflicts first
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'prathibhaprabhu6@gmail.com',
          'thejaashreeprabhu@gmail.com' // Clean up the old hospital test account
        ]
      }
    }
  });

  for (const user of USERS_TO_UPSERT) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    
    if (existing) {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          name: user.name,
          mobile: user.mobile,
          password: hashedPassword,
          bloodType: user.bloodType,
          role: user.role
        }
      });
      console.log(`Updated existing user: ${user.email}`);
    } else {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          password: hashedPassword,
          bloodType: user.bloodType,
          role: user.role
        }
      });
      console.log(`Created new user: ${user.email}`);
    }
  }
  
  console.log('\nAll users processed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
