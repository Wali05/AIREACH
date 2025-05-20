import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { sendWebinarReminderEmail, sendWebinarRegistrationEmail } from '@/lib/email-service';

/**
 * Send notification emails to webinar registrants
 * POST /api/webinars/[id]/notify
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
      // Get notification type from request
    const { type = 'reminder' } = await request.json();
    // Extract id from params
    const webinarId = params.id;
    
    // Fetch webinar data
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId },
      include: {
        attendees: true,
        user: true,
      },
    });
    
    if (!webinar) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
    }
    
    // Check if user is the owner of the webinar
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user || user.id !== webinar.createdBy) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Format the webinar date and time
    const webinarDate = new Date(webinar.scheduledAt).toLocaleDateString();
    const webinarTime = new Date(webinar.scheduledAt).toLocaleTimeString();
    const joinLink = `${process.env.NEXT_PUBLIC_APP_URL || ''}/attend/webinar/${webinar.id}`;
    
    // Send emails to each attendee
    const emailPromises = webinar.attendees.map(async (attendee) => {
      if (type === 'reminder') {
        return sendWebinarReminderEmail(
          attendee.email,
          webinar.title,
          webinarDate,
          webinarTime,
          joinLink
        );
      } else if (type === 'registration') {
        return sendWebinarRegistrationEmail(
          attendee.email,
          webinar.title,
          webinarDate,
          joinLink
        );
      }
      return null;
    });
    
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    // Count successful emails
    const successCount = results.filter((r) => r?.success).length;
    
    return NextResponse.json({
      success: true,
      emailsSent: successCount,
      totalAttendees: webinar.attendees.length,
    });
    
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
