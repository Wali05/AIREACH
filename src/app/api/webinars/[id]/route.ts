import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';

// GET: Retrieve a specific webinar
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const webinarId = params.id;
    
    // Get the webinar with attendee count
    const webinar = await db.webinar.findUnique({
      where: { id: webinarId },
      include: { _count: { select: { attendees: true } } }
    });
    
    if (!webinar) {
      return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
    }
    
    return NextResponse.json(webinar);
  } catch (error) {
    console.error('Error fetching webinar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webinar' },
      { status: 500 }
    );
  }
}

// PUT: Update a webinar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const webinarId = params.id;
    const payload = await request.json();
    
    // Get user from database
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if webinar exists and belongs to the user
    const existingWebinar = await db.webinar.findFirst({
      where: { id: webinarId, createdBy: user.id }
    });
    
    if (!existingWebinar) {
      return NextResponse.json(
        { error: 'Webinar not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // Update webinar
    const { title, description, scheduledAt, duration, coverImage } = payload;
    
    const updatedWebinar = await db.webinar.update({
      where: { id: webinarId },
      data: {
        title,
        description,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        duration,
        coverImage
      }
    });
    
    return NextResponse.json(updatedWebinar);
  } catch (error) {
    console.error('Error updating webinar:', error);
    return NextResponse.json(
      { error: 'Failed to update webinar' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a webinar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const webinarId = params.id;
    
    // Get user from database
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if webinar exists and belongs to the user
    const existingWebinar = await db.webinar.findFirst({
      where: { id: webinarId, createdBy: user.id }
    });
    
    if (!existingWebinar) {
      return NextResponse.json(
        { error: 'Webinar not found or you do not have permission' },
        { status: 404 }
      );
    }
    
    // First delete attendees to avoid foreign key constraint issues
    await db.attendee.deleteMany({
      where: { webinarId }
    });
    
    // Delete webinar
    await db.webinar.delete({
      where: { id: webinarId }
    });
    
    return NextResponse.json(
      { message: 'Webinar deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting webinar:', error);
    return NextResponse.json(
      { error: 'Failed to delete webinar' },
      { status: 500 }
    );
  }
} 