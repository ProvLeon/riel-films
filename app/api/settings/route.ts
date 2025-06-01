import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'; // Import Zod

// --- Zod Schema for Settings Update ---
const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("Invalid social link URL").or(z.literal("")), // Allow empty string
});

const SettingsUpdateSchema = z.object({
  siteName: z.string().min(1, "Site name cannot be empty").optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email("Invalid contact email").or(z.literal("")).optional(),
  contactPhone: z.string().optional(),
  // *** Ensure URL validation for image fields ***
  logoLight: z.string().url("Invalid light logo URL").or(z.literal("")).optional(),
  logoDark: z.string().url("Invalid dark logo URL").or(z.literal("")).optional(),
  metaImage: z.string().url("Invalid meta image URL").or(z.literal("")).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
}).strict(); // Prevent extra fields

// GET settings (Public or protected based on needs - currently public)
export async function GET(req: NextRequest) {
  // ... (GET logic remains the same, creates defaults if needed)
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log("No settings found, creating defaults.");
      settings = await prisma.settings.create({
        data: { // Sensible defaults
          siteName: "Riel Films",
          siteDescription: "Authentic African storytelling through documentary film.",
          contactEmail: "",
          contactPhone: "",
          socialLinks: [
            { platform: 'facebook', url: '' }, { platform: 'instagram', url: '' },
            { platform: 'twitter', url: '' }, { platform: 'youtube', url: '' },
          ],
          logoLight: "/logo_light_bg.png",
          logoDark: "/logo_dark_bg.png",
          metaImage: "/images/meta-image.jpg"
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

    const rawData = await req.json();
    console.log("Received raw data for PUT:", rawData); // Debug received data

    // Validate incoming data
    const validationResult = SettingsUpdateSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Settings Validation Failed:", validationResult.error.flatten());
      return NextResponse.json({ error: "Invalid settings data", issues: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }
    const updateData = validationResult.data; // *** Use validated data ***
    console.log("Validated data for update:", updateData); // Debug validated data

    // Find existing settings ID
    const existingSettings = await prisma.settings.findFirst({ select: { id: true } });
    if (!existingSettings) {
      // Attempt to create if not found, matching GET logic
      console.log("Settings not found, attempting creation during PUT.");
      const newSettings = await prisma.settings.create({ data: updateData });
      return NextResponse.json(newSettings);
      // return NextResponse.json({ error: "Settings record not found. Cannot update." }, { status: 404 });
    }

    // Update existing settings
    const settings = await prisma.settings.update({
      where: { id: existingSettings.id },
      data: {
        ...updateData, // Spread validated data
        updatedAt: new Date(), // Explicitly update timestamp
      }
    });

    // Log settings update (Optional but recommended)
    try {
      try {
        await prisma.analytics.create({
          data: {
            pageUrl: '/admin/settings', pageType: 'settings', event: 'update',
            visitorId: (session.user as any).id,
            extraData: { updatedFields: Object.keys(updateData) }
          }
        });
      } catch (logError) { console.error("Failed to log settings update:", logError); }
    } catch (logError) { console.error("Failed to log settings update:", logError); }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
  }
}
