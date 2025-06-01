import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
// Also try .env.local if .env is not available
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

// Create a regular Prisma client for scripts (not using Accelerate)
const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@rielfilms.com',
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@rielfilms.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

main()
  .catch(e => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
