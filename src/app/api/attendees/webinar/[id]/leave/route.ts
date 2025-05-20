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

    // Update attendee status to 'left'
    const attendee = await prisma.attendee.updateMany({
      where: { 
        webinarId: webinarId,
        userId: user.id
      },
      data: {
        status: 'left'
      }
    });

    if (attendee.count === 0) {
      return NextResponse.json({
        message: 'Attendee not found or already left',
      });
    }

    return NextResponse.json({
      message: 'Successfully left the webinar'
    });
  } catch (error) {
    console.error('Error leaving webinar:', error);
    return NextResponse.json(
      { error: 'Failed to leave webinar' },
      { status: 500 }
    );
  }
} 