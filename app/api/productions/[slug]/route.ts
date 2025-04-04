import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; // Import authOptions
import { getServerSession } from "next-auth/next"; // Import getServerSession

// GET a single production by slug (Public)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    const production = await prisma.production.findUnique({ where: { slug } });

    if (!production) {
      return NextResponse.json({ error: "Production not found" }, { status: 404 });
    }
    return NextResponse.json(production);
  } catch (error: any) {
    console.error("Error fetching production by slug:", error.message);
    return NextResponse.json({ error: "Failed to fetch production" }, { status: 500 });
  }
}


// --- DEPRECATED - Use ID-based routes for mutations ---
// PATCH update a production by SLUG (Admin/Editor only)
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("PATCH by slug is deprecated. Use PATCH /api/productions/id/[id] instead.");
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;
    const data = await req.json();
    const existing = await prisma.production.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    const updated = await prisma.production.update({ where: { id: existing.id }, data });
    // Log activity (optional)
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating production by slug:", error.message);
    return NextResponse.json({ error: "Failed to update production" }, { status: 500 });
  }
}

// DELETE a production by SLUG (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("DELETE by slug is deprecated. Use DELETE /api/productions/id/[id] instead.");
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;
    const existing = await prisma.production.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    await prisma.production.delete({ where: { id: existing.id } });
    // Log activity (optional)
    return NextResponse.json({ message: "Production deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting production by slug:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Production not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete production" }, { status: 500 });
  }
}
