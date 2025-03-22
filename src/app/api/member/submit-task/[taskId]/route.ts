import { NextRequest, NextResponse } from 'next/server';
import { memberMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/clerk';
import { Task, User, Progress } from '@/model/index';
import { calculateCredits } from '@/app/lib/groq';
import mongoose from 'mongoose';

async function handler(req: NextRequest, { params }: { params: { taskId: string } }) {
  // Connect to the database
  await connectDB();

  // Only allow PATCH method
  if (req.method !== 'PATCH') {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { taskId } = params;

    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid task ID format' },
        { status: 400 }
      );
    }

    // Get the current user's ID
    const userId = getCurrentUserId(req);

    // Get request body
    const body = await req.json();
    const { 
      description, 
      completionTime, 
      attachments = [] 
    } = body;

    // Validate required fields
    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Verify the task is assigned to the current user
    if (task.assignedTo !== userId) {
      return NextResponse.json(
        { success: false, error: 'You are not assigned to this task' },
        { status: 403 }
      );
    }

    // Check if task is already completed
    if (task.status === 'Completed') {
      return NextResponse.json(
        { success: false, error: 'This task has already been completed' },
        { status: 400 }
      );
    }

    // Prepare submission details
    const submissionDetails = {
      submittedAt: new Date(),
      description,
      attachments
    };

    // Calculate isOverdue
    const isOverdue = task.dueDate ? new Date() > task.dueDate : false;

    // Get user's past performance for better AI credit calculation
    const userPastPerformance = await Progress.aggregate([
      { $match: { user: userId, status: 'Completed' } },
      { $group: { 
        _id: null, 
        completedTasks: { $sum: 1 },
        avgCredits: { $avg: '$creditsEarned' }
      }}
    ]).then(result => result[0] || { completedTasks: 0, avgCredits: 0 });

    // Calculate credits using Groq AI
    const creditCalculation = await calculateCredits(
      task.difficulty,
      240, // Default expected time (4 hours)
      completionTime || 0,
      isOverdue,
      description,
      userPastPerformance
    );

    // Update the task
    await Task.findByIdAndUpdate(taskId, {
      status: 'Completed',
      isOverdue,
      submissionDetails,
      credits: creditCalculation.totalCredits
    });

    // Create a progress record
    const progress = await Progress.create({
      user: userId,
      task: taskId,
      club: task.club,
      status: 'Completed',
      completionTime,
      submittedAt: new Date(),
      creditsEarned: creditCalculation.totalCredits,
      aiCreditCalculation: {
        timeFactor: creditCalculation.timeFactor,
        difficultyFactor: creditCalculation.difficultyFactor,
        qualityFactor: creditCalculation.qualityFactor,
        bonusCredits: creditCalculation.bonusCredits,
        latePenalty: creditCalculation.latePenalty,
        explanation: creditCalculation.explanation
      }
    });

    // Update user's total credits
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalCredits: creditCalculation.totalCredits } }
    );

    return NextResponse.json({
      success: true,
      message: 'Task submitted successfully',
      progress,
      credits: creditCalculation
    });
  } catch (error: any) {
    console.error('Error submitting task:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit task' },
      { status: 500 }
    );
  }
}

// Export the handler with member middleware
export const PATCH = (req: NextRequest, { params }: { params: { taskId: string } }) => 
  withRBAC((req: NextRequest) => handler(req, { params }), memberMiddleware); 