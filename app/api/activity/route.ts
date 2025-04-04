import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check if a string is a valid MongoDB ObjectID
function isValidObjectId(id: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

// Helper function for relative time formatting
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) { const m = Math.floor(diffInSeconds / 60); return `${m} min${m > 1 ? 's' : ''} ago`; }
  if (diffInSeconds < 86400) { const h = Math.floor(diffInSeconds / 3600); return `${h} hour${h > 1 ? 's' : ''} ago`; }
  if (diffInSeconds < 604800) { const d = Math.floor(diffInSeconds / 86400); return `${d} day${d > 1 ? 's' : ''} ago`; }
  return date.toLocaleDateString();
}

// Helper function to check if activity is recent (< 30 min)
function isRecentActivity(timestamp: Date): boolean {
  return (new Date().getTime() - timestamp.getTime()) < (30 * 60 * 1000);
}


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) { // Allow editors too
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const type = searchParams.get("type"); // Optional filter by pageType

    const analyticsEvents = await prisma.analytics.findMany({
      where: {
        event: { in: ['create', 'update', 'delete', 'publish', 'view', 'login', 'logout'] }, // Include login/logout
        ...(type ? { pageType: type } : {}),
        // Exclude system events or heartbeats unless specifically requested
        pageType: { not: 'system' },
        event: { not: 'heartbeat' },
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    const activities = await Promise.all(analyticsEvents.map(async (event) => {
      let user = null;
      let userName = 'Anonymous Visitor';
      let userImage = '/images/avatar/placeholder.jpg'; // Default avatar

      // Try fetching associated user
      if (event.visitorId) {
        if (isValidObjectId(event.visitorId)) {
          try {
            user = await prisma.user.findUnique({
              where: { id: event.visitorId },
              select: { id: true, name: true, image: true }
            });
            if (user) {
              userName = user.name || 'Admin User'; // Fallback name
              userImage = user.image || userImage;
            }
          } catch (dbError) {
            console.warn(`DB error fetching user ${event.visitorId}:`, dbError);
          }
        }
        // If not found by ID or invalid ID, check visitor table (future enhancement)
        // Could also try email pattern matching if visitorId looks like an email
      } else if (event.event === 'login' || event.event === 'logout') {
        // For login/logout, try finding based on extraData if available
        userName = event.extraData?.userName || 'System User';
      }


      // Get content title based on itemId and pageType
      let contentTitle = event.extraData?.contentTitle || "content"; // Default or from extraData
      let contentUrlPath = '#'; // Default link
      if (event.itemId) {
        const contentType = event.pageType;
        try {
          if (contentType === 'film' && isValidObjectId(event.itemId)) {
            const film = await prisma.film.findUnique({ where: { id: event.itemId }, select: { title: true, slug: true } });
            if (film) { contentTitle = film.title; contentUrlPath = `/films/${film.slug}`; }
          } else if (contentType === 'production' && isValidObjectId(event.itemId)) {
            const prod = await prisma.production.findUnique({ where: { id: event.itemId }, select: { title: true, slug: true } });
            if (prod) { contentTitle = prod.title; contentUrlPath = `/productions/${prod.slug}`; }
          } else if (contentType === 'story' && isValidObjectId(event.itemId)) {
            const story = await prisma.story.findUnique({ where: { id: event.itemId }, select: { title: true, slug: true } });
            if (story) { contentTitle = story.title; contentUrlPath = `/stories/${story.slug}`; }
          }
        } catch (error) {
          console.error(`Failed to get content title for ${contentType} ID ${event.itemId}:`, error);
        }
      } else if (event.pageType && event.pageType !== 'other' && event.pageType !== 'system') {
        contentTitle = `${event.pageType} section`; // General section title
      }

      // Format the action text
      let actionText = 'interacted with';
      if (event.event === 'create') actionText = 'created';
      else if (event.event === 'update') actionText = 'updated';
      else if (event.event === 'delete') actionText = 'deleted';
      else if (event.event === 'publish') actionText = 'published';
      else if (event.event === 'view') actionText = 'viewed';
      else if (event.event === 'login') actionText = 'logged in';
      else if (event.event === 'logout') actionText = 'logged out';

      // Construct description
      let description = `${actionText}`;
      if (!['login', 'logout'].includes(event.event)) {
        description += ` ${contentTitle}`;
      }

      return {
        id: event.id,
        action: description,
        item: contentTitle, // Keep original item name if needed elsewhere
        time: getRelativeTimeString(event.timestamp),
        user: userName,
        userImage: userImage,
        isNew: isRecentActivity(event.timestamp),
        type: event.pageType as ActivityItem['type'], // Assert type
        itemId: event.itemId || "",
        contentUrlPath: contentUrlPath, // Add URL path for linking
      };
    }));

    return NextResponse.json({ activities });
  } catch (error: any) {
    console.error("Error fetching activity:", error.message);
    return NextResponse.json({ error: "Failed to fetch activity", message: error.message }, { status: 500 });
  }
}

// POST for logging activity remains largely the same but ensure roles are checked
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Allow logged-in users (admin/editor) to log specific actions
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pageType, event, itemId, contentTitle, extraData } = await req.json();

    if (!pageType || !event) {
      return NextResponse.json({ error: "pageType and event are required" }, { status: 400 });
    }

    const activity = await prisma.analytics.create({
      data: {
        pageUrl: req.headers.get('referer') || '', // Get referer as pageUrl
        pageType,
        event,
        itemId,
        extraData: { contentTitle, ...(extraData || {}) },
        visitorId: (session.user as any).id, // Use authenticated user's ID
        sessionId: '', // Session ID might not be relevant for explicit logging
        ipHash: '', // Not needed for explicit server-side logging
        userAgent: req.headers.get('user-agent') || '',
      }
    });

    return NextResponse.json({ success: true, activityId: activity.id });
  } catch (error: any) {
    console.error("Error logging activity:", error.message);
    return NextResponse.json({ error: "Failed to log activity", message: error.message }, { status: 500 });
  }
}
