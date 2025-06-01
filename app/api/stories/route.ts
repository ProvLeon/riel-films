import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { Story } from '@/types/mongodbSchema';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET all stories (Public access, with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featuredParam = searchParams.get("featured"); // Use 'true'/'false' string
    const limit = Number(searchParams.get("limit")) || undefined;

    const filter: any = {}; // Use 'any' for flexible filter object
    if (category) filter.category = category;
    // Handle 'featured' boolean filter correctly
    if (featuredParam === 'true') filter.featured = true;
    else if (featuredParam === 'false') filter.featured = false;

    const stories = await prisma.story.findMany({
      where: filter,
      orderBy: { date: "desc" }, // Order by story date
      take: limit,
    });

    return NextResponse.json(stories);
  } catch (error: any) {
    console.error("Error fetching stories:", error.message);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

// POST new story (Admin/Editor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storyData = await req.json();

    // Validate required fields
    if (!storyData.title || !storyData.slug || !storyData.excerpt || !storyData.author || !storyData.date || !storyData.image || !storyData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert date string to Date object before saving
    const dataToSave = {
      ...storyData,
      date: new Date(storyData.date), // Ensure date is a Date object
    };

    const story = await prisma.story.create({
      data: dataToSave,
    });

    // Log creation
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/stories/create', pageType: 'story', event: 'create',
          itemId: story.id, visitorId: (session.user as any).id,
          extraData: { storyTitle: story.title }
        }
      });
    } catch (logError) { console.error("Failed to log story creation:", logError); }

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    console.error("Error creating story:", error.message);
    const errorMessage = process.env.NODE_ENV === 'production' ? "Failed to create story" : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
