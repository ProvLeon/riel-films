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
    let dataToUpdate: Partial<typeof updatePayload> = { ...updatePayload };

    // Security: Prevent unauthorized updates
    if (!isAdmin) {
      const { token, subscribed, ...rest } = updatePayload;

      // --- !!! Implement Real Token Verification Here !!! ---
      // 1. Generate a secure, unique, time-limited token when sending emails with unsubscribe links.
      // 2. Store this token (hashed) alongside the subscriber's record or in a separate token table.
      // 3. When PATCH is called, compare the provided token with the stored (hashed) token.
      // Example (Conceptual - Replace with actual logic):
      // const storedTokenHash = await getUnsubscribeTokenForEmail(decodedEmail);
      // const isValidToken = storedTokenHash && await bcrypt.compare(token, storedTokenHash);
      const isValidToken = token === `placeholder-token-for-${decodedEmail}`; // Replace with real validation!
      // --- End Token Verification ---

      if (subscribed === false && isValidToken) {
        dataToUpdate = { subscribed: false, unsubscribedAt: new Date() }; // Add unsubscribed timestamp
        console.log(`Unsubscribing ${decodedEmail} via token.`);
      } else {
        // If not admin and not a valid unsubscribe request, deny
        console.warn(`Forbidden PATCH attempt for ${decodedEmail}. Valid token: ${isValidToken}, Subscribed: ${subscribed}`);
        return NextResponse.json({ error: "Forbidden or Invalid Token" }, { status: 403 });
      }
    } else {
      // Admin can update allowed fields (e.g., name, interests, but not email/id)
      delete dataToUpdate.email;
      delete dataToUpdate.id;
      // Ensure boolean values are correct
      if (dataToUpdate.subscribed !== undefined) dataToUpdate.subscribed = Boolean(dataToUpdate.subscribed);
      // If admin resubscribes, clear unsubscribedAt? Or keep it? Decide policy.
      // if (dataToUpdate.subscribed === true) dataToUpdate.unsubscribedAt = null;
    }


    const subscriber = await prisma.subscriber.update({
      where: { email: decodedEmail },
      data: { ...dataToUpdate, updatedAt: new Date() }, // Always update updatedAt
    });

    return NextResponse.json({ message: "Subscriber updated successfully", subscriber }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating subscriber:", error);
    if (error.code === 'P2025') { // Record to update not found
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }
    const message = process.env.NODE_ENV === 'production' ? "Failed to update subscriber" : error.message;
    return NextResponse.json({ error: "Failed to update subscriber", details: message }, { status: 500 });
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
