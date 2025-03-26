import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET settings
export async function GET(req: NextRequest) {
  try {
    // Find settings or create default if none exists
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.settings.create({
        data: {
          siteName: "Riel Films",
          siteDescription: "Authentic African storytelling through documentary film",
          contactEmail: "info@rielfilms.com",
          contactPhone: "",
          socialLinks: [],
          logoLight: "/logo_foot.png",
          logoDark: "/logo_dark_bg.png",
          metaImage: "/images/meta-image.jpg"
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT update settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const settingsData = await req.json();
    const { id, ...updateData } = settingsData;

    // Find existing settings
    const existingSettings = await prisma.settings.findFirst();

    let settings;

    if (existingSettings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: updateData
      });
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: updateData
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error.message);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
