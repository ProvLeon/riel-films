import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET settings (Public or protected based on needs - currently public)
export async function GET(req: NextRequest) {
  try {
    // Find settings or create default if none exists
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      console.log("No settings found, creating defaults.");
      settings = await prisma.settings.create({
        data: { // Sensible defaults
          siteName: "Riel Films",
          siteDescription: "Authentic African storytelling through documentary film.",
          contactEmail: "info@example.com", // Use placeholder
          contactPhone: "+000 00 000 0000", // Use placeholder
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'youtube', url: 'https://youtube.com' },
          ],
          logoLight: "/logo_light_bg.png", // Default path
          logoDark: "/logo_dark_bg.png",   // Default path
          metaImage: "/images/meta-image.jpg" // Default path
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error.message);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT update settings (Admin/Editor only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsData = await req.json();
    // Destructure to prevent updating ID or other unwanted fields
    const { siteName, siteDescription, contactEmail, contactPhone, socialLinks, logoLight, logoDark, metaImage } = settingsData;
    const updateData = { siteName, siteDescription, contactEmail, contactPhone, socialLinks, logoLight, logoDark, metaImage };

    // Find existing settings ID
    const existingSettings = await prisma.settings.findFirst({ select: { id: true } });

    if (!existingSettings) {
      // This shouldn't happen if GET creates defaults, but handle just in case
      return NextResponse.json({ error: "Settings not found, cannot update." }, { status: 404 });
    }

    // Update existing settings using the found ID
    const settings = await prisma.settings.update({
      where: { id: existingSettings.id },
      data: updateData
    });

    // Log settings update
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/settings', pageType: 'settings', event: 'update',
          visitorId: (session.user as any).id,
          extraData: { updatedFields: Object.keys(updateData) }
        }
      });
    } catch (logError) { console.error("Failed to log settings update:", logError); }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error.message);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
