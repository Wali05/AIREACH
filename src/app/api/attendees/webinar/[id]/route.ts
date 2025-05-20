import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(  request: Request,
  { params }: { params: { id: string } }
) {  try {
    const webinarId = params.id;

    // Validate webinarId
    if (!webinarId) {
      return NextResponse.json(
        { error: 'Invalid webinar ID' },
        { status: 400 }
      );
    }

    // Find attendees for this webinar
    const attendees = await prisma.attendee.findMany({
      where: { webinarId: webinarId },
      include: {
        webinar: {
          select: {
            id: true,
            title: true,
            description: true,
            scheduledAt: true,
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

    if (attendees.length === 0) {
      return NextResponse.json(
        { error: 'No attendees found for this webinar' },
        { status: 404 }
      );
    }

    return NextResponse.json(attendees);
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendee details' },
      { status: 500 }
    );
  }
} 