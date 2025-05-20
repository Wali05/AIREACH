import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { db } from '@/lib/prisma';
import { sendWebinarReminderEmail } from '@/lib/email-service';
import { format } from 'date-fns';

/**
 * Schedule and send reminder emails for an upcoming webinar
 * This endpoint would be triggered by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be secured in production
    // Could use a secret token verification
    
    const { webinarId } = await request.json();
    
    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }
    
    // Get the webinar with all attendees
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
        host: true,
      },
    });
    
    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }
    
    // Only send reminders for upcoming webinars
    const currentDate = new Date();
    const webinarDate = new Date(webinar.createdAt); // This should use scheduledAt in real implementation
    
    // Don't send reminders for past webinars
    if (webinarDate < currentDate) {
      return NextResponse.json(
        { success: false, message: 'Webinar is in the past' },
        { status: 400 }
      );
    }
    
    // Format date and time for the email
    const formattedDate = format(webinarDate, 'MMMM d, yyyy');
    const formattedTime = format(webinarDate, 'h:mm a');
    
    // Generate join link
    const joinLink = `${process.env.NEXT_PUBLIC_APP_URL}/attend/webinar/${webinar.id}`;
    
    // Send reminder to each attendee
    const emailPromises = webinar.attendees.map(async (attendee) => {
      if (attendee.user && attendee.user.email) {
        return sendWebinarReminderEmail(
          attendee.user.email,
          webinar.title,
          formattedDate,
          formattedTime,
          joinLink
        );
      }
    });
    
    // Wait for all emails to be sent
    await Promise.all(emailPromises);
    
    return NextResponse.json({
      success: true,
      message: `Reminders sent to ${emailPromises.length} attendees`,
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
} 