const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const phone = '614463895';
  const email = 'admin@dalaal.so';
  const password = '12345678';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findFirst({
    where: { phone },
  });

  if (existing) {
    console.log(`User with phone ${phone} already exists (id: ${existing.id}). Updating to SUPER_ADMIN...`);
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        password: hashedPassword,
      },
    });
    console.log('Updated to SUPER_ADMIN successfully.');
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        username: 'superadmin',
        profile: {
          create: {
            firstName: 'System',
            lastName: 'Owner',
          },
        },
      },
    });
    console.log(`Created SUPER_ADMIN user: ${user.id}`);
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
