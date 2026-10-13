const { PrismaClient } = require('@prisma/client');
const { fakerEN_IN: faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting MASSIVE database seed...');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Custom name generation to prioritize South Indian and some North Indian
  const southFirstNames = ['Prathibha', 'Karthik', 'Sanjay', 'Arjun', 'Vishnu', 'Anand', 'Prakash', 'Lakshmi', 'Sneha', 'Nandini', 'Divya', 'Pooja', 'Shruti', 'Aishwarya', 'Venkatesh', 'Surya', 'Dinesh', 'Ramesh', 'Suresh', 'Bhavana', 'Geetha', 'Meena', 'Vijay', 'Ajith'];
  const northFirstNames = ['Rahul', 'Rohan', 'Amit', 'Vikram', 'Neha', 'Priya', 'Aditi', 'Riya', 'Karan', 'Raj', 'Anjali', 'Kavita'];
  
  const southLastNames = ['Reddy', 'Rao', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Gowda', 'Naidu', 'Kumar', 'Balasubramanian', 'Krishnan', 'Babu', 'Prabhu'];
  const northLastNames = ['Sharma', 'Singh', 'Gupta', 'Patel', 'Jain', 'Verma', 'Mishra', 'Yadav'];

  const getIndianName = () => {
    const isSouth = Math.random() > 0.3; // 70% South Indian
    const firstNames = isSouth ? southFirstNames : northFirstNames;
    const lastNames = isSouth ? southLastNames : northLastNames;
    return `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}`;
  };

  const hashedPassword = await bcrypt.hash('password123', 10);

  // We need specific credentials to output for the user
  const userCredentials = {
    donors: [],
    hospitals: [],
    bloodBanks: []
  };

  const insertUser = async (role, latMin, latMax, lngMin, lngMax, specificName = null, specificEmail = null) => {
    let name = specificName || getIndianName();
    const email = specificEmail || faker.internet.email({ firstName: name }).toLowerCase() + Date.now() + '@example.com'; // unique
    const prefix = faker.helpers.arrayElement(['9', '8', '7', '6']);
    const mobile = prefix + faker.string.numeric(9);
    
    let bloodType = null;
    let lastDonation = null;
    let points = 0;
    let streaks = 0;
    let livesImpacted = 0;
    let level = 'Beginner';

    if (role === 'DONOR') {
      bloodType = faker.helpers.arrayElement(bloodTypes);
      lastDonation = faker.datatype.boolean() ? faker.date.recent({ days: 120 }) : null;
      points = faker.number.int({ min: 50, max: 2000 });
      streaks = faker.number.int({ min: 0, max: 20 });
      livesImpacted = faker.number.int({ min: 0, max: 50 });
      if (points > 1000) level = 'Expert';
      else if (points > 500) level = 'Intermediate';
    } else if (role === 'HOSPITAL') {
      // Suffix hospital names
      const hospitalPrefixes = ['Apollo', 'Fortis', 'Manipal', 'KIMS', 'Care', 'Yashoda', 'NIMS', 'SRM', 'Global', 'Kauvery'];
      const suffixes = ['Hospital', 'Medical Center', 'Institute of Medical Sciences', 'Clinic'];
      if (!specificName) {
        name = `${faker.helpers.arrayElement(hospitalPrefixes)} ${faker.helpers.arrayElement(suffixes)}`;
      }
    } else if (role === 'BLOOD_BANK') {
      const prefixes = ['Red Cross', 'Lions Club', 'Sanjeevani', 'Rotary', 'Government', 'Chiranjeevi', 'LifeSaver'];
      const suffixes = ['Blood Bank', 'Blood Center', 'Blood Storage Unit'];
      if (!specificName) {
        name = `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(suffixes)}`;
      }
    }

    const lat = faker.location.latitude({ min: latMin, max: latMax });
    const lng = faker.location.longitude({ min: lngMin, max: lngMax });

    const result = await prisma.$queryRaw`
      INSERT INTO "User" (id, role, name, email, mobile, password, "bloodType", "lastDonation", points, level, streaks, "livesImpacted", "updatedAt", location)
      VALUES (
        gen_random_uuid(), 
        ${role}::"Role", 
        ${name}, 
        ${email}, 
        ${mobile},
        ${hashedPassword}, 
        ${bloodType}, 
        ${lastDonation},
        ${points},
        ${level},
        ${streaks},
        ${livesImpacted},
        NOW(), 
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      )
      RETURNING id, email, name;
    `;
    
    return result[0];
  };

  // Generate 100 Blood Banks
  console.log('Generating 100 Blood Banks...');
  const bloodBankIds = [];
  for (let i = 0; i < 100; i++) {
    // Distribute across South India (Chennai, Bangalore, Hyderabad)
    const loc = faker.helpers.arrayElement([
      {lat: [12.8, 13.2], lng: [80.0, 80.3]}, // Chennai
      {lat: [12.8, 13.1], lng: [77.5, 77.8]}, // Bangalore
      {lat: [17.3, 17.5], lng: [78.3, 78.6]}  // Hyderabad
    ]);
    
    // Save first 3 for credentials
    const specificEmail = i < 3 ? `bloodbank${i+1}@example.com` : null;
    const user = await insertUser('BLOOD_BANK', loc.lat[0], loc.lat[1], loc.lng[0], loc.lng[1], null, specificEmail);
    bloodBankIds.push(user.id);
    if (i < 3) userCredentials.bloodBanks.push({ name: user.name, email: user.email, password: 'password123' });
    
    // Seed some inventory for this blood bank!
    const inventoryToInsert = [];
    for (const bt of bloodTypes) {
      const count = faker.number.int({ min: 5, max: 30 });
      for (let j = 0; j < count; j++) {
        inventoryToInsert.push({
          bloodBankId: user.id,
          bloodType: bt,
          volume: 350,
          collectionDate: new Date(),
          expiryDate: new Date(Date.now() + faker.number.int({min:1, max:35}) * 24 * 60 * 60 * 1000),
          status: 'AVAILABLE'
        });
      }
    }
    await prisma.bloodUnit.createMany({ data: inventoryToInsert });
  }

  // Generate 100 Hospitals
  console.log('Generating 100 Hospitals...');
  for (let i = 0; i < 100; i++) {
    const loc = faker.helpers.arrayElement([
      {lat: [12.8, 13.2], lng: [80.0, 80.3]},
      {lat: [12.8, 13.1], lng: [77.5, 77.8]},
      {lat: [17.3, 17.5], lng: [78.3, 78.6]}
    ]);
    
    const specificEmail = i < 3 ? `hospital${i+1}@example.com` : null;
    const user = await insertUser('HOSPITAL', loc.lat[0], loc.lat[1], loc.lng[0], loc.lng[1], null, specificEmail);
    if (i < 3) userCredentials.hospitals.push({ name: user.name, email: user.email, password: 'password123' });
  }

  // Generate 500 Donors
  console.log('Generating 500 Donors...');
  for (let i = 0; i < 500; i++) {
    const loc = faker.helpers.arrayElement([
      {lat: [12.8, 13.2], lng: [80.0, 80.3]},
      {lat: [12.8, 13.1], lng: [77.5, 77.8]},
      {lat: [17.3, 17.5], lng: [78.3, 78.6]}
    ]);
    
    const specificEmail = i < 3 ? `donor${i+1}@example.com` : null;
    const user = await insertUser('DONOR', loc.lat[0], loc.lat[1], loc.lng[0], loc.lng[1], null, specificEmail);
    if (i < 3) userCredentials.donors.push({ name: user.name, email: user.email, password: 'password123' });

    // Insert fake past donation history for the donor
    const historyCount = faker.number.int({ min: 0, max: 10 });
    const records = [];
    for(let k=0; k<historyCount; k++) {
      records.push({
        donorId: user.id,
        bloodBankId: faker.helpers.arrayElement(bloodBankIds),
        volume: 350,
        date: faker.date.past({ years: 2 }),
        status: 'COMPLETED'
      });
    }
    if (records.length > 0) {
      await prisma.donationRecord.createMany({ data: records });
    }
  }

  console.log('Seed completed successfully!');
  console.log('=============================================');
  console.log('CREDENTIALS GENERATED FOR TESTING:');
  console.log('Password for all is: password123');
  console.log('DONORS:', userCredentials.donors.map(d => d.email).join(', '));
  console.log('HOSPITALS:', userCredentials.hospitals.map(d => d.email).join(', '));
  console.log('BLOOD BANKS:', userCredentials.bloodBanks.map(d => d.email).join(', '));
  console.log('=============================================');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
