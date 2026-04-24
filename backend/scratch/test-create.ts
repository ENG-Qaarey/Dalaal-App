import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'test-' + Date.now() + '@example.com';
  const user = await prisma.user.create({
    data: {
      email,
      status: 'ACTIVE',
    }
  });
  console.log('User created:', user.email);
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
