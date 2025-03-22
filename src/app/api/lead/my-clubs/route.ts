import { NextRequest, NextResponse } from 'next/server';
import { leadMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Club, User, Task, Event } from '@/app/model';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get the current lead's ID
    const leadId = getCurrentUserId(req);

    // Find all clubs where the user is a lead
    const clubs = await Club.find({ lead: leadId })
      .select('_id name description coverImage tags members createdAt')
      .lean();

    if (clubs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No clubs found where you are the lead',
        clubs: []
      });
    }

    // Get club details with member and task statistics
    const clubsWithDetails = await Promise.all(
      clubs.map(async (club) => {
        // Get members details
        const members = await User.find({ _id: { $in: club.members } })
          .select('_id name email profileImage totalCredits')
          .lean();

        // Get task statistics for this club
        const taskStats = {
          total: await Task.countDocuments({ club: club._id }),
          completed: await Task.countDocuments({ club: club._id, status: 'Completed' }),
          pending: await Task.countDocuments({ club: club._id, status: 'Pending' }),
          overdue: await Task.countDocuments({ club: club._id, isOverdue: true })
        };

        // Get upcoming events for this club
        const upcomingEvents = await Event.find({
          club: club._id,
          endDate: { $gte: new Date() }
        })
          .sort({ startDate: 1 })
          .limit(5)
          .lean();

        // Get sub-communities (if any) for this club
        const communities = await Club.find({
          parentClub: club._id,
          isSubGroup: true
        })
          .select('_id name description members')
          .lean();

        return {
          ...club,
          memberCount: members.length,
          taskStats,
          upcomingEvents,
          communities
        };
      })
    );

    return NextResponse.json({
      success: true,
      clubs: clubsWithDetails
    });
  } catch (error: any) {
    console.error('Error fetching lead clubs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}

// Export the handler with lead middleware
export const GET = (req: NextRequest) => withRBAC(handler, leadMiddleware); 