import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single film by ID (Can be public or protected based on needs)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

// PATCH update a film by ID (Admin or Editor only)
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

    const filmData = await req.json();

    // Optional: Validate filmData structure here

    const updatedFilm = await prisma.film.update({
      where: { id },
      data: filmData,
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


    return NextResponse.json(updatedFilm);
  } catch (error: any) {
    console.error("Error updating film by ID:", error.message);
    // Handle potential Prisma errors like record not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update film" }, { status: 500 });
  }
}

// DELETE a film by ID (Admin only)
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

    // Fetch film title before deleting for logging
    const filmToDelete = await prisma.film.findUnique({ where: { id }, select: { title: true } });

    await prisma.film.delete({ where: { id } });

    // Log delete action
    if (filmToDelete) {
      try {
        await prisma.analytics.create({
          data: {
            pageUrl: `/admin/films`, pageType: 'film', event: 'delete',
            itemId: id, visitorId: (session.user as any).id,
            extraData: { filmTitle: filmToDelete.title }
          }
        });
      } catch (logError) { console.error("Failed to log film deletion:", logError); }
    }

    return NextResponse.json({ message: "Film deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting film by ID:", error.message);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete film" }, { status: 500 });
  }
}
