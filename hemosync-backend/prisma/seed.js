const { PrismaClient } = require('@prisma/client');
const { fakerEN_IN: faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const roles = ['DONOR', 'HOSPITAL'];
  
  // Center: Chennai, Tamil Nadu
  const chennaiCoords = { lat: 13.0827, lng: 80.2707 };

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Generate 50 Users
  for (let i = 0; i < 50; i++) {
    const role = faker.helpers.arrayElement(roles);
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name }).toLowerCase();
    
    // Generate valid 10 digit Indian mobile number (faker sometimes returns formats like +91-XXXX or XXXX, so we force 10 digits starting with 9/8/7/6)
    const prefix = faker.helpers.arrayElement(['9', '8', '7', '6']);
    const mobile = prefix + faker.string.numeric(9);

    const bloodType = role === 'DONOR' ? faker.helpers.arrayElement(bloodTypes) : null;
    const lastDonation = role === 'DONOR' && faker.datatype.boolean() ? faker.date.recent({ days: 120 }) : null;

    // Generate random coordinates within roughly 20km of Chennai
    const lat = faker.location.latitude({ min: 12.9, max: 13.2 });
    const lng = faker.location.longitude({ min: 80.1, max: 80.3 });

    try {
      await prisma.$queryRaw`
        INSERT INTO "User" (id, role, name, email, mobile, password, "bloodType", "lastDonation", "updatedAt", location)
        VALUES (
          gen_random_uuid(), 
          ${role}::"Role", 
          ${name}, 
          ${email}, 
          ${mobile},
          ${hashedPassword}, 
          ${bloodType}, 
          ${lastDonation},
          NOW(), 
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
        )
      `;
      console.log(`Inserted ${role}: ${name}`);
    } catch (e) {
      console.error(`Failed to insert ${name}: ${e.message}`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
