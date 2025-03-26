import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single film by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const film = await prisma.film.findUnique({
      where: { id: params.id },
    });

    if (!film) {
      return NextResponse.json(
        { error: "Film not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(film);
  } catch (error: any) {
    console.error("Error fetching film:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch film" },
      { status: 500 }
    );
  }
}

// PATCH update a film (Admin only)
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

    // Update film
    const film = await prisma.film.update({
      where: { id: params.id },
      data: filmData,
    });

    return NextResponse.json(film);
  } catch (error: any) {
    console.error("Error updating film:", error.message);
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
    console.error("Error deleting film:", error.message);
    return NextResponse.json(
      { error: "Failed to delete film" },
      { status: 500 }
    );
  }
}
