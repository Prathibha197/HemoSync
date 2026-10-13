const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Emergency Blood Requests...');

  // Fetch a few hospitals to author the requests
  const hospitals = await prisma.user.findMany({
    where: { role: 'HOSPITAL' },
    take: 3
  });

  if (hospitals.length === 0) {
    console.log('No hospitals found. Cannot create requests.');
    return;
  }

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencies = ['HIGH', 'CRITICAL', 'MEDIUM'];
  const wards = ['ICU', 'Emergency Room', 'Surgery', 'Maternity', 'General'];

  const requestsToCreate = [];

  for (let i = 0; i < 5; i++) {
    const hospital = hospitals[i % hospitals.length];
    
    requestsToCreate.push({
      requesterId: hospital.id,
      bloodType: faker.helpers.arrayElement(bloodTypes),
      urgency: faker.helpers.arrayElement(urgencies),
      patientName: faker.person.fullName(),
      ward: faker.helpers.arrayElement(wards),
      units: faker.number.int({ min: 1, max: 4 }),
      status: 'PENDING'
    });
  }

  await prisma.bloodRequest.createMany({
    data: requestsToCreate
  });

  console.log(`Successfully seeded ${requestsToCreate.length} emergency blood requests!`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
