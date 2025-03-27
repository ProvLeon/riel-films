import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET subscribers list (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const subscribed = searchParams.get("subscribed");

    // Build query
    const where: any = {};
    if (subscribed) {
      where.subscribed = subscribed === "true";
    }

    // Get subscribers
    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: {
        subscribedAt: "desc",
      },
    });

    return NextResponse.json(subscribers);
  } catch (error: any) {
    console.error("Error fetching subscribers:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST to add a new subscriber (public)
export async function POST(req: NextRequest) {
  try {
    const { email, name, source, interests } = await req.json();

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If already exists but unsubscribed, resubscribe them
      if (!existingSubscriber.subscribed) {
        await prisma.subscriber.update({
          where: { email },
          data: {
            subscribed: true,
            subscribedAt: new Date(),
            interests: interests || existingSubscriber.interests,
            source: source || existingSubscriber.source
          },
        });
        return NextResponse.json({
          message: "Subscription reactivated successfully"
        });
      }

      // Already subscribed
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name: name || "",
        interests: interests || [],
        source: source || "website",
      },
    });

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding subscriber:", error.message);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
