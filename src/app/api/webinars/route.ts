import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';

// GET: Retrieve all webinars for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in the database
    let user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      // Fetch email from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      user = await db.user.create({ data: { clerkId: userId, email } });
    }

    // Get all webinars for the user including attendee count
    const webinars = await db.webinar.findMany({
      where: { createdBy: user.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { attendees: true } } }
    });

    return NextResponse.json(webinars);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webinars' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await request.json();
    const { title, description, scheduledAt, duration, coverImage, hostName } = payload;
    // Find or create user
    let user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      user = await db.user.create({ data: { clerkId: userId, email } });
    }
    // Create webinar
    const webinar = await db.webinar.create({
      data: {
        title,
        description,
        coverImage: coverImage || null,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 0,
        hostName: hostName || null,
        createdBy: user.id,
      }
    });
    return NextResponse.json(webinar, { status: 201 });
  } catch (error) {
    console.error('Error creating webinar:', error);
    return NextResponse.json({ error: 'Failed to create webinar' }, { status: 500 });
  }
} 