import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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

// POST to add a new subscriber (Public)
export async function POST(req: NextRequest) {
  try {
    const { email, name, source = 'website', interests = [] } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const lowerCaseEmail = email.toLowerCase(); // Normalize email

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: lowerCaseEmail },
    });

    if (existingSubscriber) {
      if (!existingSubscriber.subscribed) {
        // Resubscribe if they were previously unsubscribed
        await prisma.subscriber.update({
          where: { email: lowerCaseEmail },
          data: {
            subscribed: true,
            subscribedAt: new Date(), // Update subscription date
            name: name || existingSubscriber.name, // Update name if provided
            interests: Array.isArray(interests) ? interests : existingSubscriber.interests,
            source: source || existingSubscriber.source,
            updatedAt: new Date(),
          },
        });
        console.log(`Resubscribed user: ${lowerCaseEmail}`);
        return NextResponse.json({ message: "Subscription reactivated successfully" });
      } else {
        // Already actively subscribed
        console.log(`User already subscribed: ${lowerCaseEmail}`);
        return NextResponse.json({ message: "Email is already subscribed" }, { status: 200 }); // Not an error
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: lowerCaseEmail,
        name: name || "",
        interests: Array.isArray(interests) ? interests : [],
        source: source,
        subscribed: true, // Explicitly set to true
        subscribedAt: new Date(),
      },
    });

    console.log(`New subscriber added: ${lowerCaseEmail}`);
    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding subscriber:", error.message);
    // Avoid exposing internal errors in production
    const errorMessage = process.env.NODE_ENV === 'production' ? "Failed to subscribe. Please try again later." : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
