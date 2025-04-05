import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'; // Import Zod

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

const CreateFilmSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"), // Enforce slug format
  category: z.string().min(1, "Category is required"),
  year: z.string().regex(/^\d{4}$/, "Invalid year format"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().optional().default(''), // Provide default for create
  image: z.string().url("Invalid image URL"),
  director: z.string().min(1, "Director is required"),
  producer: z.string().min(1, "Producer is required"),
  duration: z.string().min(1, "Duration is required"),
  languages: z.array(z.string()).optional().default([]),
  subtitles: z.array(z.string()).optional().default([]),
  releaseDate: z.string().min(1, "Release date is required"), // Use string for date from form
  awards: z.array(z.string()).optional().default([]),
  castCrew: z.array(z.any()).optional().default([]), // Consider stricter schema if possible
  gallery: z.array(z.string().url("Invalid gallery URL")).optional().default([]),
  trailer: z.string().url("Invalid trailer URL").nullish(), // Allow null or undefined
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  quotes: z.array(z.any()).optional().default([]), // Consider stricter schema if possible
  rating: z.number().min(0).max(5).optional().default(0),
  featured: z.boolean().optional().default(false),
}).strict(); // Prevent extra fields

// POST new film (Admin/Editor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await req.json();

    // Validate data using Zod
    const validationResult = CreateFilmSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Film validation failed:", validationResult.error.errors);
      return NextResponse.json({ error: "Invalid film data", issues: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const filmData = validationResult.data;

    // Check if slug already exists
    const existingSlug = await prisma.film.findUnique({ where: { slug: filmData.slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "Slug already exists. Please choose a unique slug." }, { status: 409 }); // 409 Conflict
    }

    // Create a new film
    const film = await prisma.film.create({
      data: {
        ...filmData,
        longDescription: filmData.longDescription || '', // Ensure string for create
        trailer: filmData.trailer ?? '', // Pass null if nullish
        // releaseDate: new Date(filmData.releaseDate), // Convert date if needed
      },
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

    return NextResponse.json(film, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("Error creating film:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) { // Prisma unique constraint violation
      return NextResponse.json({ error: "Slug already exists. Please choose a unique slug." }, { status: 409 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to create film" : error.message;
    return NextResponse.json({ error: "Failed to create film", details: message }, { status: 500 });
  }
}
