import { authOptions } from "@/lib/auth";
import { prismaAccelerate as prisma } from "@/lib/db"; // Use accelerated client
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Explicitly check for 'admin' role
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const { name, email, password, role = "editor" } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (!['admin', 'editor'].includes(role)) { // Validate role
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    // Log creation action (optional)
    try {
      await prisma.analytics.create({
        data: {
          pageUrl: '/admin/users/create', pageType: 'user', event: 'create',
          itemId: user.id, visitorId: (session.user as any).id,
          extraData: { userName: user.name, userRole: user.role }
        }
      });
    } catch (logError) { console.error("Failed to log user creation:", logError); }


    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    console.error("Error registering user:", error.message);
    // Provide a more generic error in production
    const errorMessage = process.env.NODE_ENV === 'production' ? "Failed to register user" : error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
