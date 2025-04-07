import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'; // Import Zod

// GET a single film by ID (Can be public or protected based on needs)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) { // Basic ID validation
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    console.log(`Fetching film with ID: ${id}`);
    const film = await prisma.film.findUnique({ where: { id } });

    if (!film) {
      console.log(`Film with ID ${id} not found`);
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }
    return NextResponse.json(film);
  } catch (error: any) {
    console.error("Error fetching film by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch film" }, { status: 500 });
  }
}

const UpdateFilmSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  year: z.string().regex(/^\d{4}$/, "Invalid year format").optional(),
  description: z.string().min(10).optional(),
  longDescription: z.string().optional(), // Optional is fine for update
  image: z.string().url("Invalid main image URL").optional(), // Validate as URL (optional for update)
  director: z.string().min(1).optional(),
  producer: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  languages: z.array(z.string()).optional(),
  subtitles: z.array(z.string()).optional(),
  releaseDate: z.string().optional(), // Could use z.date() if pre-processed
  awards: z.array(z.string()).optional(),
  castCrew: z.array(z.any()).optional(), // Keep Json[] / z.any() or define stricter schema
  gallery: z.array(z.string().url("Invalid gallery image URL")).optional(), // Validate gallery URLs (optional for update)
  trailer: z.string().url().nullish(), // Allow null or undefined for update
  synopsis: z.string().min(10).optional(),
  quotes: z.array(z.any()).optional(), // Keep Json[] / z.any() or define stricter schema
  rating: z.number().min(0).max(5).optional(),
  featured: z.boolean().optional(),
}).strict(); // Use strict to prevent extra fields


// PATCH update a film by ID (Admin or Editor only)
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

    const rawData = await req.json();

    // Validate incoming data
    const validationResult = UpdateFilmSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid update data", issues: validationResult.error.errors }, { status: 400 });
    }
    const filmData = validationResult.data;

    // Prevent slug change conflicts if slug is being updated
    if (filmData.slug) {
      const existingSlug = await prisma.film.findFirst({
        where: { slug: filmData.slug, NOT: { id: id } }
      });
      if (existingSlug) {
        return NextResponse.json({ error: "Slug already in use by another film." }, { status: 409 });
      }
    }


    const updatedFilm = await prisma.film.update({
      where: { id },
      data: {
        ...filmData,
        // Prisma update handles undefined fields correctly (doesn't update them)
        // Explicitly set null if needed based on filmData.trailer
        trailer: filmData.trailer === null ? '' : filmData.trailer,
      },
    });

    // Log update action
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/films/edit/${id}`, pageType: 'film', event: 'update',
          itemId: updatedFilm.id, visitorId: (session.user as any).id,
          extraData: { filmTitle: updatedFilm.title }
        }
      });
    } catch (logError) { console.error("Failed to log film update:", logError); }

    return NextResponse.json(updatedFilm, { status: 200 }); // OK

  } catch (error: any) {
    console.error("Error updating film by ID:", error);
    if (error.code === 'P2025') { // Record to update not found
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) { // Unique constraint violation on slug
      return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to update film" : error.message;
    return NextResponse.json({ error: "Failed to update film", details: message }, { status: 500 });
  }
}


// DELETE a film by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    // Strict Admin check for DELETE
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Fetch film details *before* deleting for logging
    const filmToDelete = await prisma.film.findUnique({
      where: { id },
      select: { title: true } // Only fetch necessary field
    });

    if (!filmToDelete) {
      // Log this attempt maybe?
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    // Perform the delete operation
    await prisma.film.delete({ where: { id } });

    // Log the delete action successfully
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/films`, pageType: 'film', event: 'delete',
          itemId: id, visitorId: (session.user as any).id,
          extraData: { filmTitle: filmToDelete.title } // Log the title
        }
      });
    } catch (logError) {
      console.error("Failed to log film deletion:", logError);
      // Don't fail the request if logging fails, but log the error
    }

    return NextResponse.json({ message: "Film deleted successfully" }, { status: 200 }); // Use 200 OK for successful delete

  } catch (error: any) {
    console.error("Error deleting film by ID:", error);
    if (error.code === 'P2025') { // Prisma code for record not found during delete (already checked above, but good safety)
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to delete film" : error.message;
    return NextResponse.json({ error: "Failed to delete film", details: message }, { status: 500 });
  }
}
