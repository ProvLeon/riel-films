import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { Prisma } from '@prisma/client'; // Import Prisma types

// --- Helper Functions ---
function isValidObjectId(id: string): boolean { return id ? /^[0-9a-fA-F]{24}$/.test(id) : false; }
// We'll add timeAgo in the hook now, API sends raw timestamp
// --- End Helper Functions ---

// GET Notifications (Admin/Editor only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 15));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;
    const onlyUnread = searchParams.get("unread") === 'true';

    // --- Fetch from the new Notification model ---
    const whereClause: Prisma.NotificationWhereInput = {
      userId: userId, // Fetch notifications for the logged-in user
    };
    if (onlyUnread) {
      whereClause.read = false;
    }

    const [notifications, totalNotifications] = await prisma.$transaction([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip: skip,
        take: limit,
        // Select fields matching the NotificationItem structure (excluding timeAgo)
        select: {
          id: true, message: true, type: true, read: true, timestamp: true,
          relatedItemId: true, relatedItemType: true, link: true
        }
      }),
      prisma.notification.count({ where: whereClause })
    ]);

    // Calculate unread count separately if not filtering by unread
    const unreadCount = onlyUnread
      ? totalNotifications // If filtering, total *is* unread count for this page
      : await prisma.notification.count({ where: { userId: userId, read: false } });

    const totalPages = Math.ceil(totalNotifications / limit);

    return NextResponse.json({
      notifications, // Send raw data, formatting in hook
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotifications,
        limit
      }
    });

  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// --- PATCH Route to Mark Notifications as Read (Implemented) ---
const markReadSchema = z.object({
  ids: z.union([z.literal('all'), z.array(z.string().refine(isValidObjectId, "Invalid ID format"))]),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const validation = markReadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const { ids } = validation.data;

    let updateCount = 0;

    // --- Actual Database Update Logic ---
    if (ids === 'all') {
      const result = await prisma.notification.updateMany({
        where: { userId: userId, read: false }, // Ensure user can only mark their own
        data: { read: true },
      });
      updateCount = result.count;
    } else if (Array.isArray(ids) && ids.length > 0) {
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId: userId // Crucial security check
        },
        data: { read: true },
      });
      updateCount = result.count;
    }
    // --- End Update Logic ---

    console.log(`Marked ${updateCount} notifications as read for user ${userId}.`);

    // Log the action (Optional but good practice)
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin', pageType: 'notification', event: 'mark_read',
          visitorId: userId,
          extraData: { count: ids === 'all' ? 'all' : ids.length, updated: updateCount }
        }
      });
    } catch (logError) { console.error("Failed to log notification mark read:", logError); }

    return NextResponse.json({ success: true, message: `${updateCount} notification(s) marked as read` }, { status: 200 }); // Return 200 OK

  } catch (error: any) {
    console.error("Error marking notifications read:", error);
    return NextResponse.json({ error: "Failed to mark notifications read" }, { status: 500 });
  }
}
