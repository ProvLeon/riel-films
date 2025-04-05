import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process'; // To run shell commands

// Load environment variables (same logic as your other scripts)
dotenv.config({ path: '.env' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

// Use the standard Prisma client instance for this script
// It needs direct DB access, not necessarily Accelerate
const prisma = new PrismaClient();

async function main() {
  console.log('Starting cleanup script for duplicate null googleId...');

  try {
    // 1. Find users with googleId: null
    console.log('Searching for users with googleId set to null...');
    const usersWithNullGoogleId = await prisma.user.findMany({
      where: {
        googleId: null,
      },
      select: { // Only select the ID, we don't need other data
        id: true,
        email: true // Log email for easier identification
      },
    });

    console.log(`Found ${usersWithNullGoogleId.length} users with googleId: null.`);

    // 2. Check if cleanup is needed
    if (usersWithNullGoogleId.length <= 1) {
      console.log('No duplicate null googleId values found, or only one exists. No cleanup needed.');
    } else {
      console.log('Duplicate null googleId values found. Proceeding with cleanup...');

      // Keep the first user found, modify the rest
      const userToKeep = usersWithNullGoogleId[0];
      const usersToModify = usersWithNullGoogleId.slice(1);
      const idsToModify = usersToModify.map(user => user.id);

      console.log(`  Keeping user with ID: ${userToKeep.id} (Email: ${userToKeep.email})`);
      console.log(`  Will remove 'googleId' field from ${usersToModify.length} users:`);
      usersToModify.forEach(user => console.log(`    - ID: ${user.id} (Email: ${user.email})`));

      // 3. Perform the update using updateMany
      // Setting an optional field to `undefined` tells Prisma to unset it
      const updateResult = await prisma.user.updateMany({
        where: {
          id: {
            in: idsToModify,
          },
        },
        data: {
          googleId: undefined, // This effectively removes the field for these documents
        },
      });

      console.log(`Successfully modified ${updateResult.count} user documents.`);

      // Small delay to ensure DB operation completes before pushing schema
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Run prisma db push
    console.log('\nAttempting to run `npx prisma db push`...');
    try {
      // Execute the command and inherit stdio to see the output/errors directly
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('\n`npx prisma db push` completed successfully!');
    } catch (dbPushError: any) {
      console.error('\nError executing `npx prisma db push`:', dbPushError.message);
      // Optional: Log the full error output if needed
      // console.error('Output:', dbPushError.stdout?.toString());
      // console.error('Error Output:', dbPushError.stderr?.toString());
      throw new Error('`prisma db push` failed after cleanup attempt.'); // Re-throw to exit script with error
    }

  } catch (error) {
    console.error('\nAn error occurred during the cleanup script:', error);
    process.exitCode = 1; // Indicate failure
  } finally {
    console.log('Disconnecting Prisma Client...');
    await prisma.$disconnect();
  }
}

main();
