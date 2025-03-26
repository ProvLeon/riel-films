import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { Production } from '@/types/mongodbSchema';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";


// GET all productions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || undefined;

    // Build the query filter
    const filter: Partial<Pick<Production, 'status' | 'category'>> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const productions = await prisma.production.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(productions);
  } catch (error: any) {
    console.error("Error fetching productions:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch productions" },
      { status: 500 }
    );
  }
}

// POST new production (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productionData = await req.json();

    // Create a new production
    const production = await prisma.production.create({
      data: productionData,
    });

    return NextResponse.json(production, { status: 201 });
  } catch (error: any) {
    console.error("Error creating production:", error.message);
    return NextResponse.json(
      { error: "Failed to create production" },
      { status: 500 }
    );
  }
}
