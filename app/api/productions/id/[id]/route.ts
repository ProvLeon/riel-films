import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single production by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const production = await prisma.production.findUnique({ where: { id } });
    if (!production) {
      return NextResponse.json({ error: "Production not found" }, { status: 404 });
    }
    return NextResponse.json(production);
  } catch (error: any) {
    console.error("Error fetching production by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch production" }, { status: 500 });
  }
}

// PATCH update a production by ID (Admin/Editor only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const data = await req.json();
    const updatedProduction = await prisma.production.update({ where: { id }, data });

    // Log update
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/productions/edit/${id}`, pageType: 'production', event: 'update',
          itemId: updatedProduction.id, visitorId: (session.user as any).id,
          extraData: { productionTitle: updatedProduction.title }
        }
      });
    } catch (logError) { console.error("Failed to log production update:", logError); }

    return NextResponse.json(updatedProduction);
  } catch (error: any) {
    console.error("Error updating production by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Production not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update production" }, { status: 500 });
  }
}

// DELETE a production by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const productionToDelete = await prisma.production.findUnique({ where: { id }, select: { title: true } });
    await prisma.production.delete({ where: { id } });

    // Log delete
    if (productionToDelete) {
      try {
        await prisma.analytics.create({
          data: {
            pageUrl: `/admin/productions`, pageType: 'production', event: 'delete',
            itemId: id, visitorId: (session.user as any).id,
            extraData: { productionTitle: productionToDelete.title }
          }
        });
      } catch (logError) { console.error("Failed to log production deletion:", logError); }
    }

    return NextResponse.json({ message: "Production deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting production by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Production not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete production" }, { status: 500 });
  }
}
