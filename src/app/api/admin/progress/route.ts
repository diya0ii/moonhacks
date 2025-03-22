import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { Club, User, Task, Progress, Event } from '@/app/model';
import mongoose from 'mongoose';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get query parameters
    const url = new URL(req.url);
    const clubId = url.searchParams.get('clubId');
    const userId = url.searchParams.get('userId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build the query for progress records
    const query: any = {};

    // Filter by club if provided
    if (clubId && mongoose.Types.ObjectId.isValid(clubId)) {
      query.club = new mongoose.Types.ObjectId(clubId);
    }

    // Filter by user if provided
    if (userId) {
      query.user = userId;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const total = await Progress.countDocuments(query);

    // Fetch progress records with pagination
    const progressRecords = await Progress.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('task', 'title description difficulty')
      .populate('club', 'name')
      .lean();

    // Get user info for each progress record
    const progressWithUserInfo = await Promise.all(
      progressRecords.map(async (record) => {
        const user = await User.findById(record.user)
          .select('name email role profileImage')
          .lean();

        return {
          ...record,
          userInfo: user
        };
      })
    );

    // Get summary statistics
    const stats = {
      totalUsers: await User.countDocuments(),
      totalClubs: await Club.countDocuments(),
      totalTasks: await Task.countDocuments(),
      totalEvents: await Event.countDocuments(),
      totalCompletedTasks: await Task.countDocuments({ status: 'Completed' }),
      totalOverdueTasks: await Task.countDocuments({ isOverdue: true }),
      averageCreditsPerTask: await Task.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, avgCredits: { $avg: '$credits' } } }
      ]).then(result => result[0]?.avgCredits || 0)
    };

    // Fetch top performing users
    const topUsers = await User.find()
      .sort({ totalCredits: -1 })
      .limit(5)
      .select('name role totalCredits profileImage')
      .lean();

    return NextResponse.json({
      success: true,
      progress: progressWithUserInfo,
      stats,
      topUsers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}

// Export the handler with admin middleware
export const GET = (req: NextRequest) => withRBAC(handler, adminMiddleware); 