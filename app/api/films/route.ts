import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET all films (Public access, with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const featuredParam = searchParams.get("featured"); // Get featured param
    const limit = Number(searchParams.get("limit")) || undefined;
    const director = searchParams.get("director"); // Add director filter

    // Build the query filter
    const filter: any = {};
    if (category) filter.category = category;
    if (year) filter.year = year;
    if (director) filter.director = director;
    // Handle 'featured' boolean filter
    if (featuredParam === 'true') filter.featured = true;
    else if (featuredParam === 'false') filter.featured = false;

    const films = await prisma.film.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc", // Or releaseDate, or rating, etc.
      },
      take: limit,
    });

    return NextResponse.json(films);
  } catch (error: any) {
    console.error("Error fetching films:", error.message);
    return NextResponse.json({ error: "Failed to fetch films" }, { status: 500 });
  }
}

// POST new film (Admin/Editor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filmData = await req.json();

    // Optional: Add validation for filmData structure here

    // Create a new film
    const film = await prisma.film.create({
      data: filmData,
    });

    // Log creation action
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/films/create', pageType: 'film', event: 'create',
          itemId: film.id, visitorId: (session.user as any).id,
          extraData: { filmTitle: film.title }
        }
      });
    } catch (logError) { console.error("Failed to log film creation:", logError); }

    return NextResponse.json(film, { status: 201 });
  } catch (error: any) {
    console.error("Error creating film:", error.message);
    // Provide more details in non-production environments
    const errorMessage = process.env.NODE_ENV === 'production' ? "Failed to create film" : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
