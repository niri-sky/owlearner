// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { SEED_ADMIN_DATA } from './data';
import { hashSync } from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // seeding data

  const adminSeedData = SEED_ADMIN_DATA.map((v) => ({
    ...v,
    password: hashSync(v.password, 10),
  }));

  prisma.admin
    .createMany({
      data: adminSeedData,
    })
    .then((v) => {
      console.log(v);
    })
    .catch((err) => {
      console.log(err);
    });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
