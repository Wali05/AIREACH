import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// This endpoint provides public data about a webinar without requiring authentication
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {  try {
    // Extract id from params
    const webinarId = params.id;

    // Get the webinar with limited information for public access
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        title: true,
        description: true,
        scheduledAt: true,
        duration: true,
        coverImage: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!webinar) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
    }
    
    // Format the response data to include host information
    const publicWebinar = {
      ...webinar,
      hostName: webinar.user?.name || 'Anonymous Host',
      hostEmail: webinar.user?.email,
      user: undefined // Remove nested user object
    };
    
    return NextResponse.json(publicWebinar);
  } catch (error) {
    console.error('Error fetching public webinar info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webinar information' },
      { status: 500 }
    );
  }
} 