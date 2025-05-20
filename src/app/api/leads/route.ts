// filepath: src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // get current user
    const owner = await db.user.findUnique({ where: { clerkId: userId } });
    if (!owner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // fetch leads for webinars created by this user
    const leads = await db.lead.findMany({
      where: { webinar: { createdBy: owner.id } },
      include: { webinar: true }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, webinarId } = await request.json();
    if (!email || !webinarId) {
      return NextResponse.json({ error: 'Email and webinarId are required' }, { status: 400 });
    }
    const lead = await db.lead.create({ data: { name: name || '', email, webinarId } });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
