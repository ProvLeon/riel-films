import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single story by slug (Public)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    const story = await prisma.story.findUnique({ where: { id: slug } });

    if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });

    return NextResponse.json(story);
  } catch (error: any) {
    console.error("Error fetching story by slug:", error.message);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

// --- DEPRECATED - Use ID routes for mutations ---
// PATCH update story by SLUG (Admin/Editor only)
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("PATCH by slug is deprecated. Use PATCH /api/stories/id/[id] instead.");
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;
    const data = await req.json();
    const existing = await prisma.story.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: "Story not found" }, { status: 404 });
    const updated = await prisma.story.update({ where: { id: existing.id }, data });
    // Log activity (optional)
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating story by slug:", error.message);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

// DELETE story by SLUG (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("DELETE by slug is deprecated. Use DELETE /api/stories/id/[id] instead.");
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;
    const existing = await prisma.story.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: "Story not found" }, { status: 404 });
    await prisma.story.delete({ where: { id: existing.id } });
    // Log activity (optional)
    return NextResponse.json({ message: "Story deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting story by slug:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Story not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
// --- End Deprecated ---
