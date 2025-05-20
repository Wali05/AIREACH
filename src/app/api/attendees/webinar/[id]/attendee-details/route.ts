import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(  request: Request,
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

    // Find attendee for this specific user and webinar
    const attendee = await prisma.attendee.findFirst({
      where: { 
        webinarId: webinarId,
        userId: user.id
      },
      include: {
        webinar: {
          select: {
            id: true,
            title: true,
            description: true,
            scheduledAt: true,
            status: true,
            hostedBy: {
              select: {
                name: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    });

    if (!attendee) {
      return NextResponse.json(
        { error: 'Attendee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(attendee);
  } catch (error) {
    console.error('Error fetching attendee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendee details' },
      { status: 500 }
    );
  }
} 