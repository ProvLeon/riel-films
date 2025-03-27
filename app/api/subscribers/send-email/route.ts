import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// POST to send email to subscribers (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { subject, content, filter } = await req.json();

    // Validate required fields
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Build query for subscribers
    const where: any = {
      subscribed: true, // Only send to subscribed users
    };

    // Add any additional filters
    if (filter?.interests?.length) {
      where.interests = {
        hasSome: filter.interests,
      };
    }

    // Get subscribers that match criteria
    const subscribers = await prisma.subscriber.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: "No subscribers match the criteria" },
        { status: 200 }
      );
    }

    // In a real application, you would integrate with an email service here
    // For this example, we'll simulate sending emails and just update the database

    // Get current date for tracking when emails were sent
    const currentDate = new Date();

    // Update all matched subscribers with the lastEmailSent date
    await prisma.subscriber.updateMany({
      where: {
        id: {
          in: subscribers.map(s => s.id)
        }
      },
      data: {
        lastEmailSent: currentDate
      }
    });

    // Create an analytics event for this email campaign
    await prisma.analytics.create({
      data: {
        pageType: "email",
        pageUrl: "",
        event: "send",
        extraData: {
          subject,
          recipientCount: subscribers.length,
          filters: filter || {}
        }
      }
    });

    return NextResponse.json({
      message: `Email would be sent to ${subscribers.length} subscribers`,
      recipients: subscribers.map(s => s.email)
    });
  } catch (error: any) {
    console.error("Error sending emails:", error.message);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
