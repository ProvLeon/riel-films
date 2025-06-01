import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { films, productions, stories } from './data';

// Load environment variables
dotenv.config({ path: '.env' });
// Also try .env.local if .env is not available
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.film.deleteMany();
    await prisma.production.deleteMany();
    await prisma.story.deleteMany();

    // Migrate films
    console.log('Migrating films...');
    for (const film of films) {
      await prisma.film.create({
        data: film
      });
    }
    console.log(`${films.length} films migrated successfully`);

    // Migrate productions
    console.log('Migrating productions...');
    for (const production of productions) {
      await prisma.production.create({
        data: production
      });
    }
    console.log(`${productions.length} productions migrated successfully`);

    // Migrate stories
    console.log('Migrating stories...');
    for (const story of stories) {
      await prisma.story.create({
        data: story
      });
    }
    console.log(`${stories.length} stories migrated successfully`);

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

main()
  .catch(e => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
