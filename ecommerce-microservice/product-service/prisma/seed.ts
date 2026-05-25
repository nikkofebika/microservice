import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const products = [
    {
      name: 'MacBook Pro M3',
      description: 'Laptop Apple terbaru dengan chip M3',
      price: 25000000,
      imageUrl: 'https://placehold.co/600x400?text=MacBook+Pro',
      stock: 10,
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Smartphone Titanium terbaru',
      price: 20000000,
      imageUrl: 'https://placehold.co/600x400?text=iPhone+15',
      stock: 20,
    },
    {
      name: 'AirPods Pro 2',
      description: 'TWS dengan noise cancelling terbaik',
      price: 3500000,
      imageUrl: 'https://placehold.co/600x400?text=AirPods+Pro',
      stock: 50,
    },
  ];

  for (const p of products) {
    const { stock, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        stock: {
          create: { quantity: stock },
        },
      },
    });
  }

  console.log('Seeding products finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
