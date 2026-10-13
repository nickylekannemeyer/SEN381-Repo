const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const user = await prisma.user.create({
    data: { email: 'staff@civicconnect.local', password: 'hashed_password_mock', role: 'STAFF' },
  });
  const category = await prisma.category.create({
    data: { name: 'Maintenance' },
  });
  const request = await prisma.request.create({
    data: { title: 'Fix the park gate', description: 'The latch is broken and needs welding.', status: 'OPEN', userId: user.id, categoryId: category.id },
  });
  console.log('Seed complete! Test Request ID created: ' + request.id);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
