
import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET all films
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const limit = Number(searchParams.get("limit")) || undefined;

    // Build the query filter
    const filter: any = {};
    if (category) filter.category = category;
    if (year) filter.year = year;

    const films = await prisma.film.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(films);
  } catch (error: any) {
    console.error("Error fetching films:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch films" },
      { status: 500 }
    );
  }
}

// POST new film (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const filmData = await req.json();

    // Create a new film
    const film = await prisma.film.create({
      data: filmData,
    });

    return NextResponse.json(film, { status: 201 });
  } catch (error: any) {
    console.error("Error creating film:", error.message);
    return NextResponse.json(
      { error: "Failed to create film" },
      { status: 500 }
    );
  }
}
