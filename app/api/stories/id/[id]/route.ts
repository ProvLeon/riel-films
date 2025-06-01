import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single story by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    return NextResponse.json(story);
  } catch (error: any) {
    console.error("Error fetching story by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

// PATCH update story by ID (Admin/Editor only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const data = await req.json();
    // Convert date string back to Date object if present
    if (data.date) data.date = new Date(data.date);
    const updatedStory = await prisma.story.update({ where: { id }, data });

    // Log update
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/stories/edit/${id}`, pageType: 'story', event: 'update',
          itemId: updatedStory.id, visitorId: (session.user as any).id,
          extraData: { storyTitle: updatedStory.title }
        }
      });
    } catch (logError) { console.error("Failed to log story update:", logError); }

    return NextResponse.json(updatedStory);
  } catch (error: any) {
    console.error("Error updating story by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Story not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

// DELETE story by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }
    const { id } = await params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const storyToDelete = await prisma.story.findUnique({ where: { id }, select: { title: true } });
    await prisma.story.delete({ where: { id } });

    // Log delete
    if (storyToDelete) {
      try {
        await prisma.analytics.create({
          data: {
            pageUrl: `/admin/stories`, pageType: 'story', event: 'delete',
            itemId: id, visitorId: (session.user as any).id,
            extraData: { storyTitle: storyToDelete.title }
          }
        });
      } catch (logError) { console.error("Failed to log story deletion:", logError); }
    }

    return NextResponse.json({ message: "Story deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting story by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Story not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
