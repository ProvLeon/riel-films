import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET Campaign History (Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 20));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const skip = (page - 1) * limit;

    // Fetch campaigns and total count simultaneously
    const [campaigns, totalCampaigns] = await prisma.$transaction([
      prisma.campaign.findMany({
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
        // Select necessary fields for the list view
        select: {
          id: true, subject: true, status: true, createdAt: true, sentAt: true,
          recipientCount: true, deliveredCount: true, openedCount: true, clickedCount: true
        }
      }),
      prisma.campaign.count()
    ]);

    const totalPages = Math.ceil(totalCampaigns / limit);

    return NextResponse.json({
      campaigns,
      pagination: {
        currentPage: page,
        totalPages,
        totalCampaigns,
        limit
      }
    });

  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
