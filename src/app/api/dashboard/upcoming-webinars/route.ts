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

  const webinars = await db.webinar.findMany({
    where: { hostId: user.id },
    orderBy: { createdAt: 'asc' },
    take: 3,
  });

  return NextResponse.json(webinars);
} 