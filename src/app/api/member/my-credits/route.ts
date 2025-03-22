import { NextRequest, NextResponse } from "next/server";
import { memberMiddleware, withRBAC } from "@/app/lib/middleware";
import connectDB from "@/app/lib/db";
import { getCurrentUserId } from "@/app/lib/clerk";
import { Progress, User, Club } from "@/model/index";
import mongoose from "mongoose";

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get the current user's ID
    const userId = getCurrentUserId(req);

    // Get query parameters
    const url = new URL(req.url);
    const clubId = url.searchParams.get("clubId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = {
      user: userId,
      status: "Completed",
    };

    // Filter by club if provided
    if (clubId && mongoose.Types.ObjectId.isValid(clubId)) {
      query.club = new mongoose.Types.ObjectId(clubId);
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    // Get user's basic info
    const user = await User.findById(userId)
      .select("name email role totalCredits profileImage")
      .lean();

    // Handle case where user is not found
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get total count for pagination
    const total = await Progress.countDocuments(query);

    // Fetch progress records with pagination
    const progressRecords = await Progress.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("task", "title description difficulty")
      .populate("club", "name")
      .lean();

    // Get credit breakdown by club
    const creditsByClub = await Progress.aggregate([
      { $match: { user: userId, status: "Completed" } },
      {
        $group: {
          _id: "$club",
          totalCredits: { $sum: "$creditsEarned" },
          tasksCompleted: { $sum: 1 },
        },
      },
      { $sort: { totalCredits: -1 } },
    ]);

    // Get club details for the credit breakdown
    const clubsWithCredits = await Promise.all(
      creditsByClub.map(async (item) => {
        const club = await Club.findById(item._id).select("name").lean();
        return {
          clubId: item._id,
          clubName: club?.name || "Unknown Club",
          totalCredits: item.totalCredits,
          tasksCompleted: item.tasksCompleted,
        };
      })
    );

    // Get credit statistics
    const stats = {
      totalCredits: user?.totalCredits ?? 0,
      totalTasksCompleted: await Progress.countDocuments({ user: userId, status: "Completed" }),

      // Credits earned in the last 30 days
      recentCredits: await Progress.aggregate([
        {
          $match: {
            user: userId,
            status: "Completed",
            submittedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: null, total: { $sum: "$creditsEarned" } } },
      ]).then((result) => result[0]?.total || 0),

      // Average credits per task
      averageCredits: await Progress.aggregate([
        { $match: { user: userId, status: "Completed" } },
        { $group: { _id: null, avg: { $avg: "$creditsEarned" } } },
      ]).then((result) => result[0]?.avg || 0),
    };

    return NextResponse.json({
      success: true,
      user,
      progress: progressRecords,
      clubsWithCredits,
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch credits" },
      { status: 500 }
    );
  }
}

// Export the handler with member middleware
export const GET = (req: NextRequest) => withRBAC(handler, memberMiddleware);
