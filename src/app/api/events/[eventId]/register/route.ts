import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Event, Club } from '@/app/model';
import mongoose from 'mongoose';

async function handler(req: NextRequest, { params }: { params: { eventId: string } }) {
  // Connect to the database
  await connectDB();

  // Only allow POST method
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { eventId } = params;

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID format' },
        { status: 400 }
      );
    }

    // Get the current user's ID
    const userId = getCurrentUserId();

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if the event is public
    if (!event.isPublic) {
      // If not public, check if user is member of the club
      const club = await Club.findById(event.club);
      if (!club || !club.members.includes(userId)) {
        return NextResponse.json(
          { success: false, error: 'This event is private and you are not a member of the club' },
          { status: 403 }
        );
      }
    }

    // Check if the event has already ended
    const now = new Date();
    if (event.endDate < now) {
      return NextResponse.json(
        { success: false, error: 'This event has already ended' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    if (event.attendees.includes(userId)) {
      return NextResponse.json(
        { success: false, error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Register the user for the event
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } }
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for the event'
    });
  } catch (error: any) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register for event' },
      { status: 500 }
    );
  }
}

// Export the handler with auth middleware
export const POST = (req: NextRequest, { params }: { params: { eventId: string } }) => 
  withRBAC((req: NextRequest) => handler(req, { params }), authMiddleware); 