import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get or create the user in the database
    let dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get total webinars
    const webinarCount = await db.webinar.count({
      where: { hostId: dbUser.id }
    });

    // Get total attendees
    const attendeeCount = await db.attendee.count({
      where: {
        webinar: {
          hostId: dbUser.id
        }
      }
    });

    // Get upcoming webinars
    const upcomingWebinars = await db.webinar.count({
      where: {
        hostId: dbUser.id,
        status: 'scheduled',
        scheduledAt: {
          gt: new Date()
        }
      }
    });

    // Calculate conversion rate (attended / registered)
    const totalRegistered = await db.attendee.count({
      where: {
        webinar: {
          hostId: dbUser.id
        }
      }
    });

    const totalAttended = await db.attendee.count({
      where: {
        webinar: {
          hostId: dbUser.id
        },
        status: 'attended'
      }
    });

    const conversionRate = totalRegistered > 0 
      ? Math.round((totalAttended / totalRegistered) * 100) 
      : 0;

    // Calculate engagement score (average of all webinar engagement scores)
    const webinars = await db.webinar.findMany({
      where: { hostId: dbUser.id },
      include: {
        attendees: true
      }
    });

    let totalEngagement = 0;
    let webinarCountWithEngagement = 0;

    webinars.forEach(webinar => {
      if (webinar.attendees.length > 0) {
        const engagement = webinar.attendees.reduce((acc, attendee) => {
          return acc + (attendee.engagementScore || 0);
        }, 0) / webinar.attendees.length;
        
        totalEngagement += engagement;
        webinarCountWithEngagement++;
      }
    });

    const engagementScore = webinarCountWithEngagement > 0
      ? Math.round((totalEngagement / webinarCountWithEngagement) * 10) / 10
      : 0;

    return NextResponse.json({
      webinarCount,
      attendeeCount,
      upcomingWebinars,
      conversionRate,
      engagementScore
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 