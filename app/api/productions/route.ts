import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { Production } from '@/types/mongodbSchema'; // Import type if needed
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET all productions (Public access, with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featuredParam = searchParams.get("featured"); // Get featured param
    const limit = Number(searchParams.get("limit")) || undefined;

    // Build the query filter
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featuredParam === 'true') filter.featured = true;
    else if (featuredParam === 'false') filter.featured = false;

    const productions = await prisma.production.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(productions);
  } catch (error: any) {
    console.error("Error fetching productions:", error.message);
    return NextResponse.json({ error: "Failed to fetch productions" }, { status: 500 });
  }
}

// POST new production (Admin/Editor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productionData = await req.json();

    // Optional: Add validation for productionData

    // Create a new production
    const production = await prisma.production.create({
      data: productionData,
    });

    // Log creation
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/productions/create', pageType: 'production', event: 'create',
          itemId: production.id, visitorId: (session.user as any).id,
          extraData: { productionTitle: production.title }
        }
      });
    } catch (logError) { console.error("Failed to log production creation:", logError); }

    return NextResponse.json(production, { status: 201 });
  } catch (error: any) {
    console.error("Error creating production:", error.message);
    const errorMessage = process.env.NODE_ENV === 'production' ? "Failed to create production" : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
