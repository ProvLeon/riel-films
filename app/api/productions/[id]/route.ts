import { prismaAccelerate as prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET a single production by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const production = await prisma.production.findUnique({
      where: { slug: params.slug },
    });

    if (!production) {
      return NextResponse.json(
        { error: "Production not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(production);
  } catch (error: any) {
    console.error("Error fetching production:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch production" },
      { status: 500 }
    );
  }
}
