import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(  request: Request,
  { params }: { params: { id: string } }
) {  try {
    const webinarId = params.id;
    const { userId } = await auth();

    // Validate webinarId
    if (!webinarId) {
      return NextResponse.json(
        { error: 'Invalid webinar ID' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find webinar and check if it's live
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId }
    });

    if (!webinar) {
      return NextResponse.json(
        { error: 'Webinar not found' },
        { status: 404 }
      );
    }

    if (webinar.status !== 'live') {
      return NextResponse.json(
        { 
          error: 'Webinar is not live',
          webinarStatus: webinar.status
        },
        { status: 403 }
      );
    }

    // Find or create attendee
    const attendee = await prisma.attendee.upsert({
      where: { 
        webinarId_userId: {
          webinarId: webinarId,
          userId: user.id
        }
      },
      update: {
        status: 'joined',
        joinedAt: new Date()
      },
      create: {
        webinarId: webinarId,
        userId: user.id,
        name: user.name,
        email: user.email,
        status: 'joined',
        joinedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Successfully joined the webinar',
      attendee: attendee
    });
  } catch (error) {
    console.error('Error joining webinar:', error);
    return NextResponse.json(
      { error: 'Failed to join webinar' },
      { status: 500 }
    );
  }
} 