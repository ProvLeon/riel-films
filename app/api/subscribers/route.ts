import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

// GET subscribers list (Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subscribedParam = searchParams.get("subscribed");
    const source = searchParams.get("source");
    const limit = Number(searchParams.get("limit")) || undefined;

    const where: any = {};
    if (subscribedParam === "true") where.subscribed = true;
    else if (subscribedParam === "false") where.subscribed = false;
    if (source) where.source = source;

    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      take: limit,
    });

    return NextResponse.json(subscribers);
  } catch (error: any) {
    console.error("Error fetching subscribers:", error.message);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

const SubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  source: z.string().optional().default('website'),
  interests: z.array(z.string()).optional().default([]),
});


// POST to add a new subscriber (Public)
export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validationResult = SubscribeSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid data provided", issues: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const { email, name, source, interests } = validationResult.data;


    const lowerCaseEmail = email.toLowerCase(); // Normalize email

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: lowerCaseEmail },
    });

    const now = new Date();

    if (existingSubscriber) {
      if (!existingSubscriber.subscribed) {
        // Resubscribe if they were previously unsubscribed
        await prisma.subscriber.update({
          where: { email: lowerCaseEmail },
          data: {
            subscribed: true,
            subscribedAt: now, // Update subscription date
            unsubscribedAt: null, // Clear unsubscribe date
            name: name || existingSubscriber.name, // Update name if provided
            interests: interests, // Use new interests
            source: source || existingSubscriber.source, // Update source if provided
            updatedAt: now,
          },
        });
        console.log(`Resubscribed user: ${lowerCaseEmail}`);
        // Optionally: Log resubscribe event to analytics
        return NextResponse.json({ message: "Subscription reactivated successfully" }, { status: 200 });
      } else {
        // Already actively subscribed - maybe update details?
        await prisma.subscriber.update({
          where: { email: lowerCaseEmail },
          data: {
            name: name || existingSubscriber.name,
            interests: interests,
            source: source || existingSubscriber.source,
            updatedAt: now,
          }
        });
        console.log(`User already subscribed, updated details: ${lowerCaseEmail}`);
        return NextResponse.json({ message: "You are already subscribed. Details updated." }, { status: 200 });
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: lowerCaseEmail,
        name: name || "",
        interests: interests,
        source: source,
        subscribed: true, // Explicitly set to true
        subscribedAt: now,
        createdAt: now, // Set explicitly for clarity
        updatedAt: now, // Set explicitly for clarity
      },
    });

    console.log(`New subscriber added: ${lowerCaseEmail}`);
    // Optionally: Log subscribe event to analytics
    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("Error adding subscriber:", error);
    if (error.code === 'P2002') { // Handle potential race condition for unique email
      return NextResponse.json({ message: "Email is already subscribed." }, { status: 409 }); // Conflict
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to subscribe. Please try again later." : error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
