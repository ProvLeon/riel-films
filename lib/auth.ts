import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db"; // Use the standard prisma client for auth/adapter

export const authOptions: NextAuthOptions = {
  // Use the standard Prisma client instance for the adapter
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
    error: "/admin/login", // Redirect to login on error
  },
  providers: [
    GoogleProvider({
      // Ensure these are correctly loaded from your .env
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: Request specific profile fields if needed
      // profile(profile) {
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //     role: "editor", // Default role
      //   }
      // }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          return null; // No user or user signed up via OAuth initially
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        // Return the user object expected by NextAuth (must include id)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Include role here
          image: user.image, // Include image if needed directly
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // `user` is passed on initial sign-in (Credentials or first OAuth)
      // `account` is passed on OAuth sign-in
      // `profile` is passed on OAuth sign-in (contains provider-specific profile data)

      // 1. Initial Sign-in (Credentials or first OAuth via Adapter)
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "editor"; // Get role from user obj
        token.picture = user.image; // Store image in token
        token.name = user.name;
        token.email = user.email;
      }

      // 2. Google Sign-in Logic (Runs on subsequent Google sign-ins or first time)
      if (account?.provider === "google" && profile && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });

          const googleId = account.providerAccountId;
          const googleName = profile.name;
          const googleImage = (profile as any).picture; // Google specific picture field

          if (!dbUser) {
            // --- Scenario: User Does NOT Exist - Create New User ---
            console.log(`[NextAuth Google] Creating new user for email: ${token.email}`);
            const newUser = await prisma.user.create({
              data: {
                email: token.email,
                name: googleName || token.email, // Use Google name, fallback to email
                image: googleImage,
                googleId: googleId, // Store Google ID
                role: "editor", // Assign default role
              },
            });
            // Update token with new user's info
            token.id = newUser.id;
            token.role = newUser.role;
            token.picture = newUser.image; // Keep token picture updated
            token.name = newUser.name;
            console.log(`[NextAuth Google] New user created with ID: ${newUser.id}`);
          } else {
            // --- Scenario: User DOES Exist - Update if necessary ---
            console.log(`[NextAuth Google] Found existing user ID: ${dbUser.id} for email: ${token.email}`);
            const updateData: { googleId?: string; image?: string | null; name?: string } = {};

            // Update Google ID if missing
            if (!dbUser.googleId && googleId) {
              updateData.googleId = googleId;
              console.log(`[NextAuth Google] Updating googleId for ${token.email}`);
            }
            // Update image if different or missing
            if (googleImage && dbUser.image !== googleImage) {
              updateData.image = googleImage;
              console.log(`[NextAuth Google] Updating image for ${token.email}`);
            }
            // Update name if different or missing
            if (googleName && dbUser.name !== googleName) {
              updateData.name = googleName;
              console.log(`[NextAuth Google] Updating name for ${token.email}`);
            }

            // Perform update only if there are changes
            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { email: token.email },
                data: updateData,
              });
              console.log(`[NextAuth Google] Updated existing user details for ${token.email}`);
            }

            // Ensure token reflects the DB state (especially role)
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.picture = dbUser.image; // Use DB image after potential update
            token.name = dbUser.name; // Use DB name after potential update
          }
        } catch (error) {
          console.error("[NextAuth Google] Error during DB operation in JWT callback:", error);
          // Handle error appropriately - maybe prevent login by returning null/error?
          // Or just log and continue with potentially incomplete token data?
          // Returning token to allow login attempt, but session might lack details.
          return token;
        }
      }

      // Return the processed token
      return token;
    },

    async session({ session, token }) {
      // 3. Populate Session Object
      // Transfer required info from token to session
      // The `session` object is what's returned client-side from `useSession()` or `getSession()`
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        // You can add other token properties to session.user if needed client-side
        // session.user.image = token.picture; // Already handled by default
      } else {
        // Log if token or session.user is unexpectedly missing
        // console.warn("[NextAuth Session] Token or session.user missing in session callback", { token, sessionUser: session.user });
      }

      return session;
    },
  },
  // Optional: Add logging for debugging
  debug: process.env.NODE_ENV === 'development',
};
