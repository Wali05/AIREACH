import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { sendWebinarRegistrationEmail } from '@/lib/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {  try {
    // Extract id from params
    const webinarId = params.id;
    const { name, email } = await request.json();
    
    // Check if webinar exists
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId }
    });
    
    if (!webinar) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
    }
    
    // Check if already registered
    const existingAttendee = await db.attendee.findFirst({
      where: {
        webinarId,
        email
      }
    });
    
    if (existingAttendee) {
      return NextResponse.json(
        { message: 'You are already registered for this webinar' },
        { status: 200 }
      );
    }
    
    // Create new attendee
    const attendee = await db.attendee.create({
      data: {
        name,
        email,
        webinarId,
        joinedAt: new Date()
      }
    });
    
    // Also create a lead for this contact
    try {
      await db.lead.create({
        data: {
          name,
          email,
          webinarId,
        },
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      // Continue execution even if lead creation fails
    }
    
    // Send confirmation email
    try {
      const webinarDate = new Date(webinar.scheduledAt).toLocaleDateString();
      const joinLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aiwebinar.example.com'}/attend/webinar/${webinar.id}`;
      
      await sendWebinarRegistrationEmail(
        email,
        webinar.title,
        webinarDate,
        joinLink
      );
    } catch (emailError) {
      console.error('Error sending registration email:', emailError);
      // Continue execution even if email sending fails
    }
    
    return NextResponse.json({
      success: true,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email
      }
    });
  } catch (error) {
    console.error('Error registering for webinar:', error);
    return NextResponse.json(
      { error: 'Failed to register for webinar' },
      { status: 500 }
    );
  }
}