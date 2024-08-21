import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
    },
  });

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      roleId: adminRole.id,
    },
  });

  await prisma.user.create({
    data: {
      username: 'user',
      password: hashedPassword,
      name: 'Normal User',
      roleId: userRole.id,
    },
  });

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
