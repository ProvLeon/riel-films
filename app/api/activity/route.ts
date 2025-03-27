import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get limit parameter, defaulting to 10
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const type = searchParams.get("type");

    // Fetch recent analytics events that represent activity
    const analyticsEvents = await prisma.analytics.findMany({
      where: {
        event: {
          in: ['create', 'update', 'delete', 'publish', 'view']
        },
        ...(type ? { pageType: type } : {})
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });

    // Map analytics events to activity format
    const activities = await Promise.all(analyticsEvents.map(async (event) => {
      // Get user info for this activity
      // Add a helper function to check if a string is a valid MongoDB ObjectID
      function isValidObjectId(id: string): boolean {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(id);
      }

      // Then modify the user lookup part:
      let user = null;
      if (event.visitorId) {
        // Only try to find by ID if it looks like a MongoDB ObjectID
        if (isValidObjectId(event.visitorId)) {
          user = await prisma.user.findUnique({
            where: { id: event.visitorId },
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          });
        }

        // If not found or not a valid ObjectID, check if there's a visitor record
        if (!user) {
          let visitor;
          try {
            visitor = await prisma.visitor.findUnique({
              where: { visitorId: event.visitorId }
            });
          } catch (err) {
            // Ignore MongoDB errors for invalid IDs
            console.log(`Invalid visitorId format for visitor lookup: ${event.visitorId}`);
          }

          if (visitor) {
            // Try to find user by email pattern
            try {
              const userByEmail = await prisma.user.findFirst({
                where: {
                  email: { contains: event.visitorId.includes('@') ? event.visitorId : '' }
                },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              });

              if (userByEmail) {
                user = userByEmail;
              }
            } catch (err) {
              console.error(`Error looking up user by email pattern: ${err}`);
            }
          }
        }
      }


      // Get content title based on itemId and pageType
      let contentTitle = "Unknown content";
      if (event.itemId) {
        const contentType = event.pageType;
        try {
          if (contentType === 'film') {
            const film = await prisma.film.findUnique({
              where: { id: event.itemId },
              select: { title: true }
            });
            if (film) contentTitle = film.title;
          } else if (contentType === 'production') {
            const production = await prisma.production.findUnique({
              where: { id: event.itemId },
              select: { title: true }
            });
            if (production) contentTitle = production.title;
          } else if (contentType === 'story') {
            const story = await prisma.story.findUnique({
              where: { id: event.itemId },
              select: { title: true }
            });
            if (story) contentTitle = story.title;
          }
        } catch (error) {
          console.error(`Failed to get content title for ${contentType} with ID ${event.itemId}`);
          // Continue with default title if lookup fails
        }
      }

      // Format the action text based on event properties
      let actionText = 'interacted with';
      if (event.event === 'create') actionText = 'created';
      if (event.event === 'update') actionText = 'updated';
      if (event.event === 'delete') actionText = 'deleted';
      if (event.event === 'publish') actionText = 'published';
      if (event.event === 'view') actionText = 'viewed';

      // Get type-specific text
      let typePrefix = '';
      if (event.pageType === 'film') typePrefix = 'film';
      if (event.pageType === 'production') typePrefix = 'production';
      if (event.pageType === 'story') typePrefix = 'story';
      if (event.pageType === 'settings') typePrefix = 'settings';

      return {
        id: event.id,
        action: `${actionText} ${typePrefix}`,
        item: contentTitle,
        time: getRelativeTimeString(event.timestamp),
        user: user?.name || 'Unknown User',
        userImage: user?.image || '/images/avatar/placeholder.jpg',
        isNew: isRecentActivity(event.timestamp),
        type: event.pageType as 'film' | 'production' | 'story' | 'user' | 'settings',
        itemId: event.itemId || ""
      };
    }));

    return NextResponse.json({ activities });
  } catch (error: any) {
    console.error("Error fetching activity:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch activity", message: error.message },
      { status: 500 }
    );
  }
}

// Helper function to check if activity is recent (< 30 min)
function isRecentActivity(timestamp: Date): boolean {
  const now = new Date();
  const diffInMinutes = (now.getTime() - timestamp.getTime()) / (60 * 1000);
  return diffInMinutes < 30;
}

// Helper function for relative time formatting
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// API route for logging new activity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      pageType,
      event,
      itemId,
      contentTitle
    } = await req.json();

    // Create analytics event
    const activity = await prisma.analytics.create({
      data: {
        pageUrl: '',  // Can be populated from request in a real implementation
        pageType,
        event,
        itemId,
        extraData: { contentTitle },
        visitorId: (session.user as any).id,
      }
    });

    return NextResponse.json({ success: true, activityId: activity.id });
  } catch (error: any) {
    console.error("Error logging activity:", error.message);
    return NextResponse.json(
      { error: "Failed to log activity", message: error.message },
      { status: 500 }
    );
  }
}
