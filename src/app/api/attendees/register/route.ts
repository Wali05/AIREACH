import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';
import { sendWebinarRegistrationEmail } from '@/lib/email-service';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const { webinarId } = await request.json();
    
    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    // Check if the webinar exists
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId },
    });

    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    // Get or create the user in our database
    let dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create new user if they don't exist
      dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: email,
        },
      });
    }

    // Check if user is already registered (by email)
    const existingAttendee = await db.attendee.findFirst({
      where: { webinarId, email },
    });

    if (existingAttendee) {
      return NextResponse.json({ message: 'You are already registered for this webinar' }, { status: 200 });
    }

    // Register the user as an attendee
    const attendee = await db.attendee.create({
      data: {
        name: user.firstName || user.emailAddresses[0]?.emailAddress,
        email,
        webinarId,
      },
    });

    // Send confirmation email
    const webinarDate = format(webinar.scheduledAt, 'MMMM d, yyyy, h:mm a');
    const joinLink = `${process.env.NEXT_PUBLIC_APP_URL}/attend/webinar/${webinarId}`;
    await sendWebinarRegistrationEmail(email, webinar.title, webinarDate, joinLink);

    return NextResponse.json({
      success: true,
      attendeeId: attendee.id,
      message: 'Successfully registered for the webinar',
    });
  } catch (error) {
    console.error('Error registering for webinar:', error);
    return NextResponse.json(
      { error: 'Failed to register for webinar' },
      { status: 500 }
    );
  }
}