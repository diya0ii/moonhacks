import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Event, Club } from '@/model/index';
import mongoose from 'mongoose';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get the current user's ID
    const userId = getCurrentUserId(req);

    // Get query parameters
    const url = new URL(req.url);
    const clubId = url.searchParams.get('clubId');
    const upcoming = url.searchParams.get('upcoming');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = {};

    // Filter by club if provided
    if (clubId && mongoose.Types.ObjectId.isValid(clubId)) {
      query.club = new mongoose.Types.ObjectId(clubId);
    }

    // Filter for upcoming events if requested
    if (upcoming === 'true') {
      query.endDate = { $gte: new Date() };
    }

    // Add text search if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Events must be either public or the user must be an attendee
    query.$or = [
      { isPublic: true },
      { attendees: userId }
    ];

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    // Fetch events with pagination
    const events = await Event.find(query)
      .sort({ startDate: 1 }) // Sort by start date
      .skip(skip)
      .limit(limit)
      .populate('club', 'name description coverImage')
      .lean();

    // Get user's clubs for filtering
    const userClubs = await Club.find({ members: userId })
      .select('_id name')
      .lean();

    // Get upcoming/featured events for the home page
    const featuredEvents = await Event.find({
      isPinnedToHomepage: true,
      isApprovedByAdmin: true,
      endDate: { $gte: new Date() }
    })
      .sort({ startDate: 1 })
      .limit(5)
      .populate('club', 'name description coverImage')
      .lean();

    // Get events the user is attending
    const userEvents = await Event.find({ 
      attendees: userId,
      endDate: { $gte: new Date() } 
    })
      .sort({ startDate: 1 })
      .limit(5)
      .populate('club', 'name description coverImage')
      .lean();

    return NextResponse.json({
      success: true,
      events,
      featuredEvents,
      userEvents,
      userClubs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// Export the handler with auth middleware
export const GET = (req: NextRequest) => withRBAC(handler, authMiddleware); 