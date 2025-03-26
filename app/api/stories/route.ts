import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Story } from '@/types/mongodbSchema';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const limit = Number(searchParams.get("limit")) || undefined;

    const filter: Partial<Pick<Story, 'category' | 'featured'>> = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured;

    const stories = await prisma.story.findMany({
      where: filter,
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    return NextResponse.json(stories);
  } catch (error: any) {
    console.error("Error fetching stories:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storyData = await req.json();
    const story = await prisma.story.create({
      data: storyData,
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    console.error("Error creating story:", error.message);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
