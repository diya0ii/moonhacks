import { NextRequest, NextResponse } from 'next/server';
import { memberMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Task, Club } from '@/model/index';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get the current user's ID
    const userId = getCurrentUserId(req);
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const clubId = url.searchParams.get('clubId');
    const isOverdue = url.searchParams.get('isOverdue');
    const priority = url.searchParams.get('priority');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = {
      assignedTo: userId
    };

    // Add filters if provided
    if (status) {
      query.status = status;
    }
    
    if (clubId) {
      query.club = clubId;
    }
    
    if (isOverdue !== null && isOverdue !== undefined) {
      query.isOverdue = isOverdue === 'true';
    }
    
    if (priority) {
      query.priority = priority;
    }

    // Get total count for pagination
    const total = await Task.countDocuments(query);
    
    // Fetch tasks with population and pagination
    const tasks = await Task.find(query)
      .sort({ dueDate: 1, priority: 1, createdAt: -1 }) // Sort by due date, then priority, then creation date
      .skip(skip)
      .limit(limit)
      .populate('club', 'name description')
      .lean();

    // Get assigner info for each task
    const tasksWithAssignerInfo = await Promise.all(
      tasks.map(async (task: any) => {
        // Get the name of the club from populated data
        let clubName = '';
        if (task.club && typeof task.club === 'object') {
          clubName = task.club.name;
        }

        return {
          ...task,
          clubName
        };
      })
    );

    // Get task statistics
    const stats = {
      totalTasks: await Task.countDocuments({ assignedTo: userId }),
      completedTasks: await Task.countDocuments({ assignedTo: userId, status: 'Completed' }),
      pendingTasks: await Task.countDocuments({ assignedTo: userId, status: 'Pending' }),
      inProgressTasks: await Task.countDocuments({ assignedTo: userId, status: 'In Progress' }),
      overdueTasks: await Task.countDocuments({ assignedTo: userId, isOverdue: true }),
      urgentTasks: await Task.countDocuments({ assignedTo: userId, priority: 'Urgent' })
    };

    // Get clubs the user is a member of
    const clubs = await Club.find({ members: userId })
      .select('_id name')
      .lean();

    return NextResponse.json({
      success: true,
      tasks: tasksWithAssignerInfo,
      stats,
      clubs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// Export the handler with member middleware
export const GET = (req: NextRequest) => withRBAC(handler, memberMiddleware); 