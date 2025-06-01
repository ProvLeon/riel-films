import { Resend } from 'resend';
import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

// --- Zod Schema for Validation ---
const SendEmailSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  // Content validation might need adjustment depending on editor output (e.g., allow empty for template-based)
  content: z.string().min(20, "Content must be at least 20 characters"),
  filter: z.object({
    interests: z.array(z.string()).optional(),
  }).optional(),
});

// --- Initialize Resend (Keep as before) ---
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || 'Riel Films <noreply@yourdomain.com>';

// --- !! IMPORTANT !! ---
// Placeholder function: Represents a background job trigger.
// In a real app, this would enqueue a task (e.g., using BullMQ, QStash, Vercel Cron + Serverless Function, etc.)
// The actual email sending logic would live in that background worker.
async function enqueueCampaignSendJob(campaignId: string) {
  console.log(`[DEMO] Enqueuing job to send campaign ${campaignId}. A background worker should pick this up.`);
  // Simulate background processing delay and update status
  // THIS IS NOT PRODUCTION-READY - IT WILL STILL BLOCK IF AWAITED HERE
  // A real queue system is needed.
  setTimeout(async () => {
    try {
      console.log(`[WORKER SIM] Processing campaign ${campaignId}...`);
      const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
      if (!campaign || campaign.status !== 'queued') {
        console.log(`[WORKER SIM] Campaign ${campaignId} not found or not in queued state.`);
        return;
      }

      // Update status to 'sending'
      await prisma.campaign.update({ where: { id: campaignId }, data: { status: 'sending' } });

      // Fetch recipients *inside the worker*
      const where: any = { subscribed: true };
      const campaignFilter = campaign.filter as any; // Use 'as any' or a defined type
      if (
        campaignFilter &&
        typeof campaignFilter === 'object' &&
        'interests' in campaignFilter &&
        Array.isArray(campaignFilter.interests) &&
        campaignFilter.interests.length > 0
      ) {
        where.interests = { hasSome: campaignFilter.interests };
      }

      const subscribersToSend = await prisma.subscriber.findMany({
        where,
        select: { email: true },
        // Implement batching/pagination in a real worker for large lists
        take: 10000,
      });
      const subscriberEmails = subscribersToSend.map(s => s.email);

      if (!resend || subscriberEmails.length === 0) {
        const status = subscriberEmails.length === 0 ? 'sent_empty' : 'failed_configuration';
        await prisma.campaign.update({ where: { id: campaignId }, data: { status, sentAt: new Date() } });
        console.log(`[WORKER SIM] Campaign ${campaignId} finished with status: ${status}`);
        return;
      }

      // Simulate sending emails in batches (Resend Batch API is better)
      console.log(`[WORKER SIM] Sending ${subscriberEmails.length} emails for campaign ${campaignId}...`);
      // *** Replace with actual resend.emails.send or resend.batch.send logic ***
      // Example sending one by one (Inefficient! Use Batch!)
      let successfulSends = 0;
      for (const email of subscriberEmails) {
        try {
          // Add unsubscribe link/logic here if not in content
          await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: campaign.subject,
            html: campaign.content || '', // Use stored content
            // Add headers for unsubscribe etc.
          });
          successfulSends++;
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate small delay between sends
        } catch (sendError) {
          console.error(`[WORKER SIM] Failed to send to ${email}:`, sendError);
          // Log individual failures if needed
        }
      }

      // Update campaign status based on results
      const finalStatus = successfulSends === subscriberEmails.length ? 'sent' : successfulSends > 0 ? 'partial_failure' : 'failed';
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: finalStatus,
          sentAt: new Date(),
          deliveredCount: successfulSends // Approximation, use webhooks for accuracy
        }
      });
      console.log(`[WORKER SIM] Campaign ${campaignId} sending finished. Status: ${finalStatus}`);

    } catch (workerError) {
      console.error(`[WORKER SIM] Error processing campaign ${campaignId}:`, workerError);
      try { await prisma.campaign.update({ where: { id: campaignId }, data: { status: 'failed' } }); } catch { /* Ignore update error */ }
    }
  }, 500); // Simulate a short delay before "background" processing starts
}
// --- End Placeholder ---

// --- API Route Handler ---
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const rawData = await req.json();
    const validationResult = SendEmailSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.log("Campaign validation failed:", validationResult.error.flatten());
      return NextResponse.json({ error: "Invalid input", issues: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const { subject, content, filter } = validationResult.data;

    // 1. Build Subscriber Query (for count estimate)
    const where: any = { subscribed: true };
    if (filter?.interests && filter.interests.length > 0) {
      where.interests = { hasSome: filter.interests };
    }

    // 2. Get Estimated Recipient Count
    const recipientCount = await prisma.subscriber.count({ where });

    // Don't create a campaign if no one would receive it
    if (recipientCount === 0) {
      return NextResponse.json({ message: "No subscribers match the specified criteria. Campaign not created." }, { status: 200 }); // OK status, just info
    }

    // 3. Create Campaign Record in DB (Status: 'queued')
    const campaign = await prisma.campaign.create({
      data: {
        subject,
        content, // Store full content (or template reference)
        filter: filter || {},
        status: 'queued', // Set initial status
        recipientCount: recipientCount,
        createdBy: userId,
        // Initialize counts to 0
        deliveredCount: 0, openedCount: 0, clickedCount: 0, bouncedCount: 0, complaintCount: 0, unsubscribedCount: 0,
      }
    });

    // 4. Trigger the background job (Simulated Here)
    await enqueueCampaignSendJob(campaign.id);

    // 5. Log Analytics Event
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/subscribers/campaigns', pageType: 'email_campaign', event: 'create',
          visitorId: userId, itemId: campaign.id,
          extraData: { subject, estimatedRecipients: recipientCount, filters: filter || {} }
        }
      });
    } catch (logError) { console.error("Failed to log email campaign creation event:", logError); }

    // 6. Respond Immediately (Accepted)
    return NextResponse.json({
      message: `Campaign '${subject}' created and queued for sending to ~${recipientCount} recipients.`,
      campaignId: campaign.id,
    }, { status: 202 }); // 202 Accepted

  } catch (error: any) {
    console.error("Error creating email campaign:", error);
    const message = process.env.NODE_ENV === 'production' ? "Failed to create campaign" : error.message;
    return NextResponse.json({ error: "Failed to create campaign", details: message }, { status: 500 });
  }
}
