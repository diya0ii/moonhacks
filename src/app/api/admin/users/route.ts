import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { User, Club, Task, Progress } from '@/model/index';
import { createClerkClient } from '@clerk/clerk-sdk-node';

// Initialize Clerk Server API Client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Get query parameters
      const url = new URL(req.url);
      const search = url.searchParams.get('search') || '';
      const role = url.searchParams.get('role');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Build the query
      const query: any = {};

      // Add search functionality if provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by role if provided
      if (role) {
        query.role = role;
      }

      // Get total count for pagination
      const total = await User.countDocuments(query);

      // Fetch users with pagination
      const users = await User.find(query)
        .sort({ totalCredits: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get detailed user data
      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          // Get clubs the user is a member of
          const clubs = await Club.find({ members: user._id })
            .select('_id name')
            .lean();

          // Get task completion statistics
          const taskStats = {
            assigned: await Task.countDocuments({ assignedTo: user._id }),
            completed: await Task.countDocuments({ assignedTo: user._id, status: 'Completed' }),
            pending: await Task.countDocuments({ assignedTo: user._id, status: 'Pending' }),
            overdue: await Task.countDocuments({ assignedTo: user._id, isOverdue: true })
          };

          return {
            ...user,
            clubs,
            taskStats
          };
        })
      );

      // Get role statistics
      const roleStats = {
        total: await User.countDocuments(),
        admin: await User.countDocuments({ role: 'Admin' }),
        lead: await User.countDocuments({ role: 'Lead' }),
        member: await User.countDocuments({ role: 'Member' })
      };

      return NextResponse.json({
        success: true,
        users: usersWithDetails,
        roleStats,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch users' },
        { status: 500 }
      );
    }
  } 
  
  // Handle PATCH request to update user role
  else if (req.method === 'PATCH') {
    try {
      // Get request body
      const body = await req.json();
      const { userId, role } = body;

      // Validate required fields
      if (!userId || !role) {
        return NextResponse.json(
          { success: false, error: 'User ID and role are required' },
          { status: 400 }
        );
      }

      // Validate role
      const validRoles = ['Admin', 'Lead', 'Member'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, error: 'Invalid role. Must be Admin, Lead, or Member' },
          { status: 400 }
        );
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Update the user role in our database
      await User.findByIdAndUpdate(userId, { role });

      // Update the user's public metadata in Clerk
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { role }
      });

      return NextResponse.json({
        success: true,
        message: `User role updated to ${role}`
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update user role' },
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