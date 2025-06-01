import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET Single Campaign Details (Admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) { // Basic ID validation
      return NextResponse.json({ error: "Invalid campaign ID format" }, { status: 400 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      // Include related data if needed, e.g., createdBy user details
      // include: { createdBy: { select: { name: true } } } // Requires relation in schema
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json(campaign);

  } catch (error: any) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// DELETE Campaign (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid campaign ID format" }, { status: 400 });
    }

    // Maybe check campaign status before allowing delete? (e.g., don't delete 'sending')
    // const campaign = await prisma.campaign.findUnique({ where: { id } });
    // if (campaign?.status === 'sending') {
    //     return NextResponse.json({ error: "Cannot delete a campaign that is currently sending." }, { status: 400 });
    // }

    await prisma.campaign.delete({ where: { id } });

    // Log delete action (optional)
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: `/admin/subscribers/campaigns`, pageType: 'email_campaign', event: 'delete',
          visitorId: (session.user as any).id, itemId: id,
          extraData: { campaignId: id } // Log ID
        }
      });
    } catch (logError) { console.error("Failed to log campaign deletion:", logError); }


    return NextResponse.json({ message: "Campaign deleted successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    if (error.code === 'P2025') return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
