import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get or create the user in the database
  let user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    // Fetch email from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    user = await db.user.create({ data: { clerkId: userId, email } });
  }

  // Fetch attendees for webinars created by this user
  const attendees: any[] = await (db.attendee as any).findMany({
    where: { webinar: { is: { createdBy: user.id } } },
    include: { webinar: true },
  });

  const customers = attendees.map((att: any) => ({
    id: att.id,
    name: att.name || att.email,
    email: att.email,
    webinarAttended: att.webinar.title,
    date: att.joinedAt!.toISOString(),
    status: 'joined',
    conversion: 'N/A',
  }));

  return NextResponse.json(customers);
} 