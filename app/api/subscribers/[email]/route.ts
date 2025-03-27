import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single subscriber by email
export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { email } = params;
    const subscriber = await prisma.subscriber.findUnique({
      where: { email: decodeURIComponent(email) },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriber);
  } catch (error: any) {
    console.error("Error fetching subscriber:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}

// PATCH update a subscriber
export async function PATCH(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === "admin";

    // Get the email from params
    const { email } = params;
    const decodedEmail = decodeURIComponent(email);

    // Get update data from request
    const updateData = await req.json();

    // For non-admin requests, only allow unsubscribing with a token
    if (!isAdmin) {
      const { token } = updateData;
      // In a real app, verify this token against a stored token or hash
      // Here we're just checking if it exists for demonstration
      if (!token) {
        return NextResponse.json(
          { error: "Invalid unsubscribe token" },
          { status: 403 }
        );
      }

      // Only allow setting 'subscribed' to false for non-admin requests
      updateData.subscribed = false;
      delete updateData.token;
    }

    // Update the subscriber
    const subscriber = await prisma.subscriber.update({
      where: { email: decodedEmail },
      data: updateData,
    });

    return NextResponse.json({
      message: "Subscriber updated successfully",
      subscriber
    });
  } catch (error: any) {
    console.error("Error updating subscriber:", error.message);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

// DELETE a subscriber (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { email } = params;

    await prisma.subscriber.delete({
      where: { email: decodeURIComponent(email) },
    });

    return NextResponse.json(
      { message: "Subscriber deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting subscriber:", error.message);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
