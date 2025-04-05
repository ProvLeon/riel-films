import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// !! WARNING !!
// THIS SCRIPT WILL DELETE ALL DATA FROM ALL COLLECTIONS DEFINED IN YOUR PRISMA SCHEMA.
// USE WITH EXTREME CAUTION. DATA LOSS IS IRREVERSIBLE.
// !! WARNING !!

// Load environment variables
dotenv.config({ path: '.env' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

const prisma = new PrismaClient();

// Add ALL your model names here (lowercase, matching prisma client properties)
const modelNames = [
  'film',
  'production',
  'story',
  'user',
  'settings',
  'analytics',
  'dailyStats',
  'visitor',
  'subscriber',
  'campaign'
];

async function main() {
  console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.warn("!! WARNING: DELETING ALL DATA FROM ALL COLLECTIONS !!");
  console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(`Target Database: ${process.env.DATABASE_URL?.split('/').pop()?.split('?')[0]}`); // Show DB name
  console.log("Collections to be cleared:");
  modelNames.forEach(name => console.log(` - ${name}`));
  console.log("You have 5 seconds to cancel (Ctrl+C)...");

  await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

  console.log("\nProceeding with data deletion...");

  try {
    for (const modelName of modelNames) {
      // Type assertion needed because we're accessing prisma properties dynamically
      const modelDelegate = (prisma as any)[modelName];
      if (modelDelegate && typeof modelDelegate.deleteMany === 'function') {
        console.log(`Clearing collection: ${modelName}...`);
        const { count } = await modelDelegate.deleteMany({});
        console.log(` -> Deleted ${count} documents.`);
      } else {
        console.warn(`Could not find deleteMany method for model: ${modelName}`);
      }
    }
    console.log("\nAll specified collections cleared successfully.");

  } catch (error) {
    console.error('\nAn error occurred during database reset:', error);
    process.exitCode = 1; // Indicate failure
  } finally {
    console.log('Disconnecting Prisma Client...');
    await prisma.$disconnect();
  }
}

main();
