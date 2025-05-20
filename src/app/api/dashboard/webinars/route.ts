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

    // Get all webinars for the user
    const webinars = await db.webinar.findMany({
      where: { hostId: dbUser.id },
      include: {
        attendees: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8 // Limit to 8 most recent webinars
    });

    // Transform the data to match the frontend interface
    const formattedWebinars = webinars.map(webinar => ({
      id: webinar.id,
      title: webinar.title,
      description: webinar.description,
      scheduledAt: webinar.createdAt.toISOString(),
      status: webinar.status,
      attendeeCount: webinar.attendees.length
    }));

    return NextResponse.json(formattedWebinars);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 