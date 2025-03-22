import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { Event, Club } from '@/model/index';
import mongoose from 'mongoose';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  // Handle GET request to list events pending approval
  if (req.method === 'GET') {
    try {
      // Get query parameters
      const url = new URL(req.url);
      const approvalStatus = url.searchParams.get('approved');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Build the query
      const query: any = {
        isPinnedToHomepage: true
      };

      // Filter by approval status if provided
      if (approvalStatus !== null && approvalStatus !== undefined) {
        query.isApprovedByAdmin = approvalStatus === 'true';
      }

      // Get total count for pagination
      const total = await Event.countDocuments(query);

      // Fetch events with pagination
      const events = await Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('club', 'name')
        .lean();

      return NextResponse.json({
        success: true,
        events,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      console.error('Error fetching events for approval:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch events' },
        { status: 500 }
      );
    }
  }
  
  // Handle PATCH request to approve/reject events
  else if (req.method === 'PATCH') {
    try {
      // Get request body
      const body = await req.json();
      const { eventId, approve } = body;

      // Validate required fields
      if (!eventId) {
        return NextResponse.json(
          { success: false, error: 'Event ID is required' },
          { status: 400 }
        );
      }

      // Validate eventId format
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid event ID format' },
          { status: 400 }
        );
      }

      // Find the event
      const event = await Event.findById(eventId);
      if (!event) {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }

      // Check if the event is requested to be pinned
      if (!event.isPinnedToHomepage) {
        return NextResponse.json(
          { success: false, error: 'This event is not requested to be pinned to homepage' },
          { status: 400 }
        );
      }

      // Update the event approval status
      await Event.findByIdAndUpdate(
        eventId,
        { isApprovedByAdmin: !!approve }
      );

      return NextResponse.json({
        success: true,
        message: `Event has been ${approve ? 'approved' : 'rejected'} for homepage pinning`
      });
    } catch (error: any) {
      console.error('Error updating event approval:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update event approval' },
        { status: 500 }
      );
    }
  }
  
  // Reject other methods
  else {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }
}

// Export the handler with admin middleware
export const GET = (req: NextRequest) => withRBAC(handler, adminMiddleware);
export const PATCH = (req: NextRequest) => withRBAC(handler, adminMiddleware); 