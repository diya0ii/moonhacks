import { NextRequest, NextResponse } from 'next/server';
import { leadMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Club, User } from '@/app/model';
import mongoose from 'mongoose';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  // Only allow POST method
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get request body
    const body = await req.json();
    const { name, description, parentClubId, memberIds, tags } = body;

    // Validate required fields
    if (!name || !parentClubId) {
      return NextResponse.json(
        { success: false, error: 'Community name and parent club ID are required' },
        { status: 400 }
      );
    }

    // Validate club ID format
    if (!mongoose.Types.ObjectId.isValid(parentClubId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid parent club ID format' },
        { status: 400 }
      );
    }

    // Check if parent club exists
    const parentClub = await Club.findById(parentClubId);
    if (!parentClub) {
      return NextResponse.json(
        { success: false, error: 'Parent club not found' },
        { status: 404 }
      );
    }

    // Get the current lead's ID
    const leadId = getCurrentUserId(req);

    // Verify the lead is actually a lead of the parent club
    if (parentClub.lead !== leadId) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to create communities in this club' },
        { status: 403 }
      );
    }

    // Ensure all provided member IDs exist in the parent club
    if (memberIds && memberIds.length > 0) {
      const validMembers = memberIds.filter((id: string) => parentClub.members.includes(id));
      if (validMembers.length !== memberIds.length) {
        return NextResponse.json(
          { success: false, error: 'Some members do not belong to the parent club' },
          { status: 400 }
        );
      }
    }

    // Create the community (sub-group) as a new club with parent reference
    const community = await Club.create({
      name: `${parentClub.name} - ${name}`, // Prefix with parent club name
      description,
      lead: leadId,
      members: memberIds || [],
      createdBy: leadId,
      parentClub: parentClubId, // Reference to the parent club
      tags: tags || [],
      isActive: true,
      isSubGroup: true // Flag to identify as a community/sub-group
    });

    // Add members to the community
    if (memberIds && memberIds.length > 0) {
      await Promise.all(
        memberIds.map(async (memberId: string) => {
          return User.findByIdAndUpdate(
            memberId,
            { $addToSet: { clubs: community._id } }
          );
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community created successfully',
      community
    });
  } catch (error: any) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create community' },
      { status: 500 }
    );
  }
}

// Export the handler with lead middleware
export const POST = (req: NextRequest) => withRBAC(handler, leadMiddleware); 