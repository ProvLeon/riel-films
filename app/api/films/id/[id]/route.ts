import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single film by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log(`Fetching film with ID: ${id}`); // Debugging

    const film = await prisma.film.findUnique({
      where: { id },
    });

    if (!film) {
      console.log(`Film with ID ${id} not found`); // Debugging
      return NextResponse.json(
        { error: "Film not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(film);
  } catch (error: any) {
    console.error("Error fetching film by ID:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch film" },
      { status: 500 }
    );
  }
}

// PATCH update a film (Admin or Editor only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const filmData = await req.json();

    // Update film by ID
    const updatedFilm = await prisma.film.update({
      where: { id: params.id },
      data: filmData,
    });

    return NextResponse.json(updatedFilm);
  } catch (error: any) {
    console.error("Error updating film by ID:", error.message);
    return NextResponse.json(
      { error: "Failed to update film" },
      { status: 500 }
    );
  }
}

// DELETE a film (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await prisma.film.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Film deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting film by ID:", error.message);
    return NextResponse.json(
      { error: "Failed to delete film" },
      { status: 500 }
    );
  }
}
