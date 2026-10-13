const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  const emails = ['hospital1@example.com', 'hospital2@example.com', 'hospital3@example.com'];
  
  const hospitals = await prisma.user.findMany({
    where: { email: { in: emails } }
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencies = ['HIGH', 'CRITICAL', 'MEDIUM'];
  const wards = ['ICU', 'Emergency Room', 'Surgery'];

  for (const hospital of hospitals) {
    const requests = [];
    for(let i=0; i<3; i++) {
      requests.push({
        requesterId: hospital.id,
        bloodType: faker.helpers.arrayElement(bloodTypes),
        urgency: faker.helpers.arrayElement(urgencies),
        patientName: faker.person.fullName(),
        ward: faker.helpers.arrayElement(wards),
        units: faker.number.int({ min: 1, max: 4 }),
        status: 'PENDING'
      });
    }
    await prisma.bloodRequest.createMany({ data: requests });
  }

  console.log(`Successfully seeded requests for the test hospital accounts!`);
}

main().finally(() => prisma.$disconnect());
