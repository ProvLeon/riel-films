import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET a single subscriber by email (Admin only)
export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { email } = params;
    const decodedEmail = decodeURIComponent(email);
    const subscriber = await prisma.subscriber.findUnique({ where: { email: decodedEmail } });

    if (!subscriber) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });

    return NextResponse.json(subscriber);
  } catch (error: any) {
    console.error("Error fetching subscriber:", error.message);
    return NextResponse.json({ error: "Failed to fetch subscriber" }, { status: 500 });
  }
}

// PATCH update a subscriber (Admin or User with token for unsubscribe)
export async function PATCH(req: NextRequest, { params }: { params: { email: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any)?.role === "admin";
    const { email } = params;
    const decodedEmail = decodeURIComponent(email);
    const updatePayload = await req.json();
    let dataToUpdate = { ...updatePayload };

    // Security: Prevent unauthorized updates
    if (!isAdmin) {
      const { token, subscribed, ...rest } = updatePayload;

      // 1. Only allow setting 'subscribed' to false
      // 2. Require a valid token (implement token verification logic)
      // Example: Assume token matches a generated unsubscribe token
      const isValidToken = token === `unsubscribe-${decodedEmail}`; // Replace with real token validation

      if (subscribed === false && isValidToken) {
        dataToUpdate = { subscribed: false }; // Only allow unsubscribe
        console.log(`Unsubscribing ${decodedEmail} via token.`);
      } else {
        // If not admin and not a valid unsubscribe request, deny
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      // Admin can update anything except potentially the email itself (handled by unique constraint)
      delete dataToUpdate.email; // Don't allow changing the email via PATCH
      delete dataToUpdate.id; // Don't allow changing the ID
    }

    // Ensure boolean values are correct
    if (dataToUpdate.subscribed !== undefined) dataToUpdate.subscribed = Boolean(dataToUpdate.subscribed);

    const subscriber = await prisma.subscriber.update({
      where: { email: decodedEmail },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Subscriber updated successfully", subscriber });
  } catch (error: any) {
    console.error("Error updating subscriber:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
  }
}

// DELETE a subscriber (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { email: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { email } = params;
    const decodedEmail = decodeURIComponent(email);

    await prisma.subscriber.delete({ where: { email: decodedEmail } });

    return NextResponse.json({ message: "Subscriber deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting subscriber:", error.message);
    if (error.code === 'P2025') return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
