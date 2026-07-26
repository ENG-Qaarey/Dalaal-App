const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const USERS = [
  {
    email: 'admin@dalaal.so',
    phone: '614463895',
    password: '12345678',
    username: 'superadmin',
    role: 'SUPER_ADMIN',
    firstName: 'System',
    lastName: 'Owner',
  },
  {
    email: 'broker@dalaal.so',
    phone: '614463896',
    password: '12345678',
    username: 'dalaalbroker',
    role: 'BROKER',
    firstName: 'Mohamed',
    lastName: 'Ali',
  },
  {
    email: 'property@dalaal.so',
    phone: '614463897',
    password: '12345678',
    username: 'propertyowner',
    role: 'PROPERTY_OWNER',
    firstName: 'Fatima',
    lastName: 'Mohamed',
  },
  {
    email: 'vehicle@dalaal.so',
    phone: '614463898',
    password: '12345678',
    username: 'vehicleowner',
    role: 'VEHICLE_OWNER',
    firstName: 'Hassan',
    lastName: 'Abdi',
  },
  {
    email: 'customer@dalaal.so',
    phone: '614463899',
    password: '12345678',
    username: 'customer1',
    role: 'CUSTOMER',
    firstName: 'Amina',
    lastName: 'Osman',
  },
];

async function main() {
  console.log('Seeding users...\n');

  for (const userData of USERS) {
    const { email, phone, password, username, role, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }, { username }] },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role,
          status: 'ACTIVE',
          emailVerified: true,
          phoneVerified: true,
          password: hashedPassword,
          profile: {
            upsert: {
              where: { userId: existing.id },
              update: { firstName, lastName },
              create: { firstName, lastName },
            },
          },
        },
      });

      console.log(`  [UPDATED] ${role.padEnd(18)} ${email} / ${password}  (id: ${existing.id})`);
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role,
          status: 'ACTIVE',
          emailVerified: true,
          phoneVerified: true,
          username,
          profile: {
            create: { firstName, lastName },
          },
        },
      });

      console.log(`  [CREATED] ${role.padEnd(18)} ${email} / ${password}  (id: ${user.id})`);
    }
  }

  console.log('\nAll users seeded successfully!\n');

  // Seed mock listings if none exist
  const listingCount = await prisma.listing.count();
  let sampleListingId = null;
  if (listingCount === 0) {
    console.log('Seeding mock listings...');
    const broker = await prisma.user.findFirst({ where: { role: 'BROKER' } });
    if (broker) {
      const listing = await prisma.listing.create({
        data: {
          userId: broker.id,
          type: 'PROPERTY',
          title: 'Stunning 4-Bedroom Villa in Mogadishu',
          slug: 'stunning-4-bedroom-villa-in-mogadishu',
          description: 'A beautiful luxury villa located in the heart of Mogadishu with 24/7 security and water access.',
          price: 150000,
          currency: 'USD',
          city: 'Mogadishu',
          district: 'Wadajir',
          status: 'ACTIVE',
          isVerified: true,
          property: {
            create: {
              propertyType: 'HOUSE',
              bedrooms: 4,
              bathrooms: 3,
              squareMeters: 250,
              furnished: true,
              parking: true,
              security: true,
            }
          }
        }
      });
      sampleListingId = listing.id;
      console.log('  [CREATED] Listing: Stunning 4-Bedroom Villa in Mogadishu');
    }
  } else {
    const existingListing = await prisma.listing.findFirst();
    sampleListingId = existingListing?.id || null;
  }

  // Seed mock reports if none exist
  const reportCount = await prisma.report.count();
  if (reportCount === 0) {
    console.log('Seeding mock reports...');
    const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    const broker = await prisma.user.findFirst({ where: { role: 'BROKER' } });
    
    if (customer && broker) {
      await prisma.report.createMany({
        data: [
          {
            reporterId: customer.id,
            reportedId: broker.id,
            listingId: sampleListingId,
            type: 'LISTING',
            description: 'This listing has incorrect price information and misleading photos.',
            status: 'SUBMITTED',
          },
          {
            reporterId: customer.id,
            reportedId: broker.id,
            listingId: sampleListingId,
            type: 'USER',
            description: 'Broker is requesting direct payment outside the escrow system.',
            status: 'INVESTIGATING',
          },
          {
            reporterId: customer.id,
            reportedId: broker.id,
            listingId: sampleListingId,
            type: 'PAYMENT',
            description: 'Payment was charged twice for the transaction fee.',
            status: 'RESOLVED',
            resolution: 'Refunded the duplicate transaction fee to the customer wallet.',
            resolvedAt: new Date(),
          },
          {
            reporterId: customer.id,
            reportedId: broker.id,
            listingId: sampleListingId,
            type: 'ESCROW',
            description: 'Accidental dispute opened by the buyer before checking vehicle logs.',
            status: 'DISMISSED',
            resolution: 'Dismissed because buyer withdrew the claim.',
            resolvedAt: new Date(),
          }
        ]
      });
      console.log('  [CREATED] 4 mock reports seeded successfully.');
    }
  }

  const count = await prisma.user.count();
  console.log(`Total users in database: ${count}`);

  console.log('\n--- Login Credentials ---');
  console.log('All accounts use password: 12345678\n');
  console.log('Email                  | Role             | Username');
  console.log('-----------------------|------------------|------------');
  for (const u of USERS) {
    console.log(`${u.email.padEnd(23)} | ${u.role.padEnd(16)} | ${u.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
