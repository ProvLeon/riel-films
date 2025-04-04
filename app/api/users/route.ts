import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // Optional role filter
    const limit = Number(searchParams.get("limit")) || undefined;

    const where: any = {};
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: { // Select only necessary fields, exclude password
        id: true, name: true, email: true, image: true, role: true,
        createdAt: true, updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
