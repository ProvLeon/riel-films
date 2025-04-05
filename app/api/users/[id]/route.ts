import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

// GET a single user by ID (Admin only) - Stays the same
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
      // Select only necessary fields, exclude password
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true, updatedAt: true, googleId: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// Zod schema for allowed updates
const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().nullable().optional(), // Allow setting image to null
  role: z.enum(['admin', 'editor']).optional(), // Role can be updated
}).strict(); // Disallow any fields not defined here (like email, password, id)

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

    // Prevent admin from changing their *own* role to editor
    // This check is crucial for security
    const loggedInUserId = (session.user as any).id;
    if (loggedInUserId === id && (await req.clone().json()).role === 'editor') {
      return NextResponse.json({ error: "Admin cannot demote their own role." }, { status: 403 });
    }

    const rawData = await req.json();
    const validationResult = UpdateUserSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error("User Update Validation Failed:", validationResult.error.flatten());
      return NextResponse.json({ error: "Invalid update data", issues: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const updateData = validationResult.data;

    // Check if attempting to update a non-empty payload
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update data provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      // Return updated user data (excluding password)
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true, updatedAt: true, googleId: true },
    });

    // Log update action
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/users`, pageType: 'user', event: 'update',
          itemId: updatedUser.id, visitorId: loggedInUserId,
          extraData: { updatedUserName: updatedUser.name, updatedFields: Object.keys(updateData) }
        }
      });
    } catch (logError) { console.error("Failed to log user update:", logError); }

    return NextResponse.json(updatedUser, { status: 200 }); // OK

  } catch (error: any) {
    console.error("Error updating user by ID:", error);
    if (error.code === 'P2025') { // Record to update not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to update user" : error.message;
    return NextResponse.json({ error: "Failed to update user", details: message }, { status: 500 });
  }
}


// DELETE a user by ID (Admin only) - Stays the same as previous good version
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
      return NextResponse.json({ error: "Admin cannot delete their own account" }, { status: 403 }); // Forbidden
    }

    // Fetch user details *before* deleting
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Perform delete
    await prisma.user.delete({ where: { id } });

    // Log delete
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/users`, pageType: 'user', event: 'delete',
          itemId: id, visitorId: (session.user as any).id,
          extraData: { deletedUserName: userToDelete.name, deletedUserEmail: userToDelete.email }
        }
      });
    } catch (logError) { console.error("Failed to log user deletion:", logError); }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 }); // OK

  } catch (error: any) {
    console.error("Error deleting user by ID:", error);
    if (error.code === 'P2025') { // Record to delete not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to delete user" : error.message;
    return NextResponse.json({ error: "Failed to delete user", details: message }, { status: 500 });
  }
}
