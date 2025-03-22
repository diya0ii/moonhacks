import { NextRequest, NextResponse } from "next/server";
import { adminMiddleware, withRBAC } from "@/app/lib/middleware";
import connectDB from "@/app/lib/db";
import { getCurrentUserId } from "@/app/lib/clerk";
import { Club, User } from "@/model/index";
import { createClerkClient } from "@clerk/clerk-sdk-node";

// Initialize Clerk Server API Client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  // Only allow POST method
  if (req.method !== "POST") {
    return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get request body
    const body = await req.json();
    const { name, description, leadEmail, tags, coverImage } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Club name is required" },
        { status: 400 }
      );
    }

    // Check if club with this name already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return NextResponse.json(
        { success: false, error: "A club with this name already exists" },
        { status: 400 }
      );
    }

    // Get the current admin's ID
    const adminId = getCurrentUserId(req);

    // If leadEmail is provided, find or create lead user
    let leadId = null;
    if (leadEmail) {
      // Try to find the user by email in Clerk
      const userList = await clerkClient.users.getUserList({
        emailAddress: [leadEmail],
      });

      if (userList.length > 0) {
        // User exists in Clerk
        const clerkUser = userList[0]; // Directly access first user in array
        leadId = clerkUser.id;

        // Check if user exists in our DB
        let dbUser = await User.findById(leadId);
        if (!dbUser) {
          // Create the user in our DB if they don't exist
          dbUser = await User.create({
            _id: leadId,
            email: leadEmail,
            name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
            role: "Lead",
            profileImage: clerkUser.imageUrl,
          });
        } else {
          // Update the user's role to Lead if they're not already Lead or Admin
          if (dbUser.role !== "Admin") {
            await User.findByIdAndUpdate(leadId, { role: "Lead" });

            // Update user's private metadata in Clerk for security
            await clerkClient.users.updateUser(leadId, {
              privateMetadata: { role: "Lead" },
            });
          }
        }
      } else {
        return NextResponse.json(
          { success: false, error: "Lead user with provided email not found" },
          { status: 404 }
        );
      }
    }

    // Create new club
    const newClub = await Club.create({
      name,
      description,
      lead: leadId,
      members: leadId ? [leadId] : [],
      createdBy: adminId,
      coverImage,
      tags: tags || [],
      isActive: true,
    });

    // If lead was assigned, add this club to their clubs array
    if (leadId) {
      await User.findByIdAndUpdate(leadId, {
        $addToSet: { clubs: newClub._id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Club created successfully",
      club: newClub,
    });
  } catch (error: any) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create club" },
      { status: 500 }
    );
  }
}

// Export the handler with admin middleware
export const POST = (req: NextRequest) => withRBAC(handler, adminMiddleware);
