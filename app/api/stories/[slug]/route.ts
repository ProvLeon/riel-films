import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single story by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    const story = await prisma.story.findUnique({
      where: { slug },
    });

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(story);

  } catch (error: any) {
    console.error("Error fetching story:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storyData = await req.json();
    const story = await prisma.story.update({
      where: { id: params.id },
      data: storyData,
    });

    return NextResponse.json(story);
  } catch (error: any) {
    console.error("Error updating story:", error.message);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.story.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Story deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting story:", error.message);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
