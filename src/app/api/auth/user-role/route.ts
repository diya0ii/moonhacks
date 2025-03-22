import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/clerk';
import { authMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { User } from '@/app/model';

// Handler to get the authenticated user's role and info
async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();
  
  // Get authenticated user from Clerk
  const clerkUser = await getCurrentUser(req);
  
  // Check if user exists in our database
  let dbUser = await User.findById(clerkUser.id);
  
  // If user doesn't exist in our DB, create them
  if (!dbUser) {
    dbUser = await User.create({
      _id: clerkUser.id,
      email: clerkUser.email,
      name: clerkUser.name,
      role: clerkUser.role,
      profileImage: clerkUser.profileImage
    });
  }
  
  // Return user data
  return NextResponse.json({
    success: true,
    user: {
      id: dbUser._id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      totalCredits: dbUser.totalCredits,
      profileImage: dbUser.profileImage || clerkUser.profileImage,
      clubs: dbUser.clubs || []
    }
  });
}

// Export the handler with authentication middleware
export const GET = (req: NextRequest) => withRBAC(handler, authMiddleware); 