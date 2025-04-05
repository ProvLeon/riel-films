import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single film by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const film = await prisma.film.findUnique({
      where: { slug },
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
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("DEPRECATED: PATCH by slug. Use PATCH /api/films/id/[id] instead.");
  // ... (keep existing logic but maybe return a 405 Method Not Allowed instead?)
  return NextResponse.json({ error: "Method Not Allowed - Use ID-based endpoint for updates" }, { status: 405 });
}

// DELETE a film (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  console.warn("DEPRECATED: DELETE by slug. Use DELETE /api/films/id/[id] instead.");
  // ... (keep existing logic but maybe return a 405 Method Not Allowed instead?)
  return NextResponse.json({ error: "Method Not Allowed - Use ID-based endpoint for deletes" }, { status: 405 });
}
