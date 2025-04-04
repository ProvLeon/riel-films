import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single user by ID (Admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PATCH update a user by ID (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    const userData = await req.json();
    // Explicitly exclude password, email, and ID from being updated here
    const { password, email, id: userId, ...updateData } = userData;
    if (!['admin', 'editor'].includes(updateData.role)) { // Validate role
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true, updatedAt: true },
    });

    // Log update
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/users`, pageType: 'user', event: 'update',
          itemId: user.id, visitorId: (session.user as any).id,
          extraData: { updatedUserName: user.name, updatedRole: user.role }
        }
      });
    } catch (logError) { console.error("Failed to log user update:", logError); }


    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE a user by ID (Admin only)
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

    // Prevent admin from deleting themselves
    if ((session.user as any).id === id) {
      return NextResponse.json({ error: "Admin cannot delete their own account" }, { status: 403 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
    await prisma.user.delete({ where: { id } });

    // Log delete
    if (userToDelete) {
      try {
        await prisma.analytics.create({
          data: {
            pageUrl: `/admin/users`, pageType: 'user', event: 'delete',
            itemId: id, visitorId: (session.user as any).id,
            extraData: { deletedUserName: userToDelete.name, deletedUserEmail: userToDelete.email }
          }
        });
      } catch (logError) { console.error("Failed to log user deletion:", logError); }
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting user by ID:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
