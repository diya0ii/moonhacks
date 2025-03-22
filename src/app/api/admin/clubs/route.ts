import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware, withRBAC } from '@/app/lib/middleware';
import connectDB from '@/app/lib/db';
import { Club, User } from '@/model/index';

async function handler(req: NextRequest) {
  // Connect to the database
  await connectDB();

  try {
    // Get query parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = {};
    
    // Add search functionality if provided
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ];
    }
    
    // Add active filter if provided
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Get total count for pagination
    const total = await Club.countDocuments(query);
    
    // Fetch clubs with pagination
    const clubs = await Club.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get lead information for each club
    const clubsWithLeadInfo = await Promise.all(
      clubs.map(async (club) => {
        let leadInfo = null;
        if (club.lead) {
          // Fetch lead info
          const leadUser = await User.findById(club.lead).select('name email profileImage').lean();
          leadInfo = leadUser;
        }
        
        // Count members
        const memberCount = club.members ? club.members.length : 0;
        
        return {
          ...club,
          leadInfo,
          memberCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      clubs: clubsWithLeadInfo,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}

// Export the handler with admin middleware
export const GET = (req: NextRequest) => withRBAC(handler, adminMiddleware); 