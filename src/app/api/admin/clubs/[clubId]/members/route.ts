import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { Club, User, Task } from '@/app/model';
import mongoose from 'mongoose';

async function handler(req: NextRequest, { params }: { params: { clubId: string } }) {
  // Connect to the database
  await connectDB();

  try {
    const { clubId } = params;

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

    // Fetch members from the club
    const memberIds = club.members || [];
    
    // Get all members data
    const members = await User.find({ _id: { $in: memberIds } })
      .select('_id name email role totalCredits profileImage')
      .lean();

    // For each member, get their assigned tasks in this club
    const membersWithTasks = await Promise.all(
      members.map(async (member) => {
        // Get tasks assigned to this member within this club
        const tasks = await Task.find({
          assignedTo: member._id,
          club: clubId
        })
        .select('_id title status priority dueDate isOverdue credits')
        .sort({ dueDate: 1 })
        .lean();

        // Calculate task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'Completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
        const overdueTasks = tasks.filter(task => task.isOverdue).length;

        // Get total credits earned in this club
        const totalCreditsInClub = tasks.reduce((sum, task) => sum + (task.credits || 0), 0);

        return {
          ...member,
          tasks,
          taskStats: {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks,
            completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0
          },
          totalCreditsInClub
        };
      })
    );

    // Get club basic info to return
    const clubInfo = {
      _id: club._id,
      name: club.name,
      description: club.description,
      lead: club.lead,
      memberCount: club.members.length,
      coverImage: club.coverImage
    };

    // Return the club with member details
    return NextResponse.json({
      success: true,
      club: clubInfo,
      members: membersWithTasks
    });
  } catch (error: any) {
    console.error('Error fetching club members:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch club members' },
      { status: 500 }
    );
  }
}

// Export the handler with admin middleware
export const GET = (req: NextRequest, { params }: { params: { clubId: string } }) => 
  withRBAC((req: NextRequest) => handler(req, { params }), adminMiddleware); 