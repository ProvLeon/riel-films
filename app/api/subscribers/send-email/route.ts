import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// POST to send email to subscribers (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { subject, content, filter } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    // Build query for subscribers
    const where: any = { subscribed: true };
    if (filter?.interests?.length) {
      // Ensure interests filter is applied correctly for array field
      where.interests = { hasSome: filter.interests };
    }

    const subscribers = await prisma.subscriber.findMany({
      where,
      select: { id: true, email: true }, // Only select necessary fields
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers match the specified criteria. No emails sent." }, { status: 200 });
    }

    // --- Email Sending Logic (Placeholder) ---
    // In a real app, integrate with an email service like SendGrid, Mailgun, AWS SES, etc.
    // Loop through subscribers and send personalized emails (e.g., using a queue system for large lists)
    console.log(`Simulating sending email with subject: "${subject}"`);
    console.log(`Targeting ${subscribers.length} subscribers based on filter:`, filter);
    // Example: const emailServiceResponse = await emailService.sendBulk(subscribers.map(s => s.email), subject, content);
    // --- End Placeholder ---

    const currentDate = new Date();
    // Update lastEmailSent for the targeted subscribers
    // Consider doing this *after* successful sending confirmation from email service
    const subscriberIds = subscribers.map(s => s.id);
    await prisma.subscriber.updateMany({
      where: { id: { in: subscriberIds } },
      data: { lastEmailSent: currentDate }
    });

    // Log the campaign event
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/subscribers/campaigns', pageType: 'email_campaign', event: 'send',
          visitorId: (session.user as any).id,
          extraData: { subject, recipientCount: subscribers.length, filters: filter || {} }
        }
      });
    } catch (logError) { console.error("Failed to log email campaign event:", logError); }


    return NextResponse.json({
      message: `Email campaign initiated for ${subscribers.length} subscribers.`,
      recipients: subscribers.map(s => s.email) // Optional: return list of recipients
    });

  } catch (error: any) {
    console.error("Error sending email campaign:", error.message);
    return NextResponse.json({ error: "Failed to initiate email campaign" }, { status: 500 });
  }
}
