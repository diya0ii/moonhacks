import { NextRequest, NextResponse } from 'next/server';
import { leadMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Club, Event } from '@/model/index';
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
    const { 
      title,
      description,
      clubId,
      startDate,
      endDate,
      location,
      isVirtual,
      meetingLink,
      isPublic,
      isPinnedToHomepage,
      attachments,
      tags
    } = body;

    // Validate required fields
    if (!title || !description || !clubId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, clubId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    // Validate clubId format
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid club ID format' },
        { status: 400 }
      );
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return NextResponse.json(
        { success: false, error: 'Club not found' },
        { status: 404 }
      );
    }

    // Get the current lead's ID
    const leadId = getCurrentUserId(req);

    // Verify the lead is actually a lead of the club
    if (club.lead !== leadId) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to create events for this club' },
        { status: 403 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    if (start >= end) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // If virtual, validate meeting link
    if (isVirtual && !meetingLink) {
      return NextResponse.json(
        { success: false, error: 'Meeting link is required for virtual events' },
        { status: 400 }
      );
    }

    // Create the event
    const event = await Event.create({
      title,
      description,
      club: clubId,
      createdBy: leadId,
      startDate: start,
      endDate: end,
      location,
      isVirtual: !!isVirtual,
      meetingLink,
      // Auto-include all club members as attendees
      attendees: club.members,
      isPublic: !!isPublic,
      isPinnedToHomepage: !!isPinnedToHomepage,
      // Admin approval needed for homepage pinning - defaults to false
      isApprovedByAdmin: false, 
      attachments: attachments || [],
      tags: tags || []
    });

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

// Export the handler with lead middleware
export const POST = (req: NextRequest) => withRBAC(handler, leadMiddleware); 