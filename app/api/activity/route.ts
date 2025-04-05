import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
// Assuming ActivityItem is defined correctly in useRecentActivity or a types file
import { ActivityItem } from '@/hooks/useRecentActivity';

// --- Helpers (Keep existing isValidObjectId, getRelativeTimeString, isRecentActivity) ---
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
function getRelativeTimeString(date: Date): string {
  // ... (keep existing implementation)
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) { const m = Math.floor(diffInSeconds / 60); return `${m} min${m > 1 ? 's' : ''} ago`; }
  if (diffInSeconds < 86400) { const h = Math.floor(diffInSeconds / 3600); return `${h} hour${h > 1 ? 's' : ''} ago`; }
  if (diffInSeconds < 604800) { const d = Math.floor(diffInSeconds / 86400); return `${d} day${d > 1 ? 's' : ''} ago`; }
  return date.toLocaleDateString();
}
function isRecentActivity(timestamp: Date): boolean {
  return (new Date().getTime() - timestamp.getTime()) < (30 * 60 * 1000); // 30 minutes
}
// --- End Helpers ---

// Helper: Fetch content details safely (Improved)
async function getContentDetails(itemId: string, pageType: string) {
  if (!itemId || !pageType || !isValidObjectId(itemId)) return null; // Return null if invalid

  const selectFields = { title: true, slug: true };
  try {
    let item: { title: string; slug: string } | null = null;
    switch (pageType) {
      case 'film':
        item = await prisma.film.findUnique({ where: { id: itemId }, select: selectFields });
        return item ? { title: item.title, path: `/films/${item.slug}` } : null;
      case 'production':
        item = await prisma.production.findUnique({ where: { id: itemId }, select: selectFields });
        return item ? { title: item.title, path: `/productions/${item.slug}` } : null;
      case 'story':
        item = await prisma.story.findUnique({ where: { id: itemId }, select: selectFields });
        return item ? { title: item.title, path: `/stories/${item.slug}` } : null;
      default:
        return null; // Unknown pageType
    }
  } catch (error) {
    console.error(`Error fetching ${pageType} details for ID ${itemId}:`, error);
    return null; // Return null on error
  }
}

// GET Activity Log (Refined)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 20)); // Bounded limit
    const type = searchParams.get("type");
    const eventFilter = searchParams.get("event");

    const whereClause: any = {
      event: eventFilter ? { equals: eventFilter } : { in: ['create', 'update', 'delete', 'publish', 'view', 'login', 'logout', 'send'] }, // Added 'send'
      pageType: { notIn: ['system', 'metrics_calculation'] }, // Exclude system noise
      event: { not: 'heartbeat' },
    };
    if (type) {
      whereClause.pageType = type;
    }

    const analyticsEvents = await prisma.analytics.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true, event: true, timestamp: true, visitorId: true,
        extraData: true, pageType: true, itemId: true
      }
    });

    // Efficiently fetch users
    const userIds = analyticsEvents
      .map(e => e.visitorId)
      .filter((id): id is string => !!id && isValidObjectId(id));

    let userMap = new Map();
    if (userIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, image: true }
      });
      userMap = new Map(users.map(u => [u.id, u]));
    }


    const activities: ActivityItem[] = await Promise.all(analyticsEvents.map(async (event) => {
      let userName = 'Anonymous Visitor';
      let userImage = '/images/avatar/placeholder.jpg';
      const user = event.visitorId ? userMap.get(event.visitorId) : null;

      if (user) {
        userName = user.name || 'Admin User';
        userImage = user.image || userImage;
      } else if (event.event === 'login' || event.event === 'logout') {
        userName = event.extraData?.userName || 'System User'; // Extract from extraData for auth events
      }

      // Determine Content Title and Path
      let contentTitle = "content";
      let contentUrlPath = '#';
      const details = event.itemId && event.pageType ? await getContentDetails(event.itemId, event.pageType) : null;

      if (details) {
        contentTitle = details.title;
        contentUrlPath = details.path;
      } else if (event.extraData?.contentTitle) {
        contentTitle = event.extraData.contentTitle; // Use title from log (e.g., for deleted items)
      } else if (event.extraData?.subject) {
        contentTitle = event.extraData.subject; // For email campaigns
      } else if (event.pageType && !['other', 'system', 'auth'].includes(event.pageType)) {
        contentTitle = `${event.pageType} item`; // Fallback for non-linkable items without title
      }

      if (event.pageType === 'email_campaign') {
        contentTitle = `Email Campaign: ${contentTitle}`;
      } else if (event.pageType === 'settings') {
        contentTitle = 'Site Settings';
      } else if (event.pageType === 'user' && event.extraData?.userName) {
        contentTitle = `User: ${event.extraData.userName}`;
      }


      // Format Action Text
      let actionText = 'interacted with';
      switch (event.event) {
        case 'create': actionText = 'created'; break;
        case 'update': actionText = 'updated'; break;
        case 'delete': actionText = 'deleted'; break;
        case 'publish': actionText = 'published'; break;
        case 'view': actionText = 'viewed'; break;
        case 'login': actionText = 'logged in'; break;
        case 'logout': actionText = 'logged out'; break;
        case 'send': actionText = 'sent'; break;
      }

      // Construct Description
      let description = actionText;
      if (!['login', 'logout'].includes(event.event)) {
        description += ` ${contentTitle}`;
      }

      return {
        id: event.id,
        action: description,
        item: contentTitle,
        time: getRelativeTimeString(event.timestamp),
        user: userName,
        userImage: userImage,
        isNew: isRecentActivity(event.timestamp),
        type: (event.pageType || 'other') as ActivityItem['type'],
        itemId: event.itemId || "",
        contentUrlPath: contentUrlPath,
        timestamp: event.timestamp,
        event: event.event, // Pass the raw event
      };
    }));

    return NextResponse.json({ activities });

  } catch (error: any) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: "Failed to fetch activity", message: error.message }, { status: 500 });
  }
}

// POST for logging activity (Refined)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Consider adding Zod validation here
    const body = await req.json();
    const { pageType, event, itemId, contentTitle, extraData } = body;

    if (!pageType || !event) {
      return NextResponse.json({ error: "Missing required fields: pageType and event" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      console.error("Error logging activity: User ID missing from session.");
      return NextResponse.json({ error: "Internal Server Error: User ID missing" }, { status: 500 });
    }

    // Sanitize or structure extraData if necessary
    const finalExtraData = { contentTitle, ...(extraData || {}) };

    const activity = await prisma.analytics.create({
      data: {
        pageUrl: req.headers.get('referer') || `/admin/${pageType}`,
        pageType,
        event,
        itemId: itemId || null, // Ensure itemId is null if not provided
        extraData: finalExtraData,
        visitorId: userId,
        sessionId: '', // Not relevant here
        ipHash: '', // Not relevant here
        userAgent: req.headers.get('user-agent') || '',
        isNewUser: false // Logged-in users are not 'new'
      }
    });

    return NextResponse.json({ success: true, activityId: activity.id }, { status: 201 });

  } catch (error: any) {
    console.error("Error logging activity:", error);
    const message = process.env.NODE_ENV === 'production' ? "Failed to log activity" : error.message;
    return NextResponse.json({ error: "Failed to log activity", details: message }, { status: 500 });
  }
}
