import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { attendeeId: string } }
) {
  try {
    const attendeeId = parseInt(params.attendeeId);

    // Validate attendeeId
    if (isNaN(attendeeId)) {
      return NextResponse.json(
        { error: 'Invalid attendee ID' },
        { status: 400 }
      );
    }

    // Find attendee with webinar details
    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
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