import { NextRequest, NextResponse } from 'next/server';
import { leadMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Club, Task, User } from '@/app/model';
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
      assignedToId,
      priority,
      difficulty,
      dueDate,
      semanticTags 
    } = body;

    // Validate required fields
    if (!title || !description || !clubId || !assignedToId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, clubId, and assignedToId are required' },
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
        { success: false, error: 'You are not authorized to assign tasks in this club' },
        { status: 403 }
      );
    }

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedToId);
    if (!assignedUser) {
      return NextResponse.json(
        { success: false, error: 'Assigned user not found' },
        { status: 404 }
      );
    }

    // Verify the user is a member of the club
    if (!club.members.includes(assignedToId)) {
      return NextResponse.json(
        { success: false, error: 'Assigned user is not a member of the club' },
        { status: 400 }
      );
    }

    // Prevent self-assignment (leads assigning themselves tasks)
    if (assignedToId === leadId) {
      return NextResponse.json(
        { success: false, error: 'You cannot assign a task to yourself' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority value' },
        { status: 400 }
      );
    }

    // Validate difficulty (1-10 scale)
    if (difficulty && (difficulty < 1 || difficulty > 10)) {
      return NextResponse.json(
        { success: false, error: 'Difficulty must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate due date
    let dueDateObj = null;
    if (dueDate) {
      dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      club: clubId,
      assignedBy: leadId,
      assignedTo: assignedToId,
      status: 'Pending',
      priority: priority || 'Medium',
      difficulty: difficulty || 5,
      dueDate: dueDateObj,
      isOverdue: false,
      semanticTags: semanticTags || []
    });

    return NextResponse.json({
      success: true,
      message: 'Task assigned successfully',
      task
    });
  } catch (error: any) {
    console.error('Error assigning task:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to assign task' },
      { status: 500 }
    );
  }
}

// Export the handler with lead middleware
export const POST = (req: NextRequest) => withRBAC(handler, leadMiddleware); 