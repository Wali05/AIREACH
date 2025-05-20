import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const timeframe = (searchParams.get('timeframe') as '7d' | '30d' | '90d') || '30d';
  let startDate = new Date();
  if (timeframe === '7d') startDate.setDate(startDate.getDate() - 7);
  else if (timeframe === '30d') startDate.setDate(startDate.getDate() - 30);
  else if (timeframe === '90d') startDate.setDate(startDate.getDate() - 90);

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

  // Attendance by webinar
  const webinars = await db.webinar.findMany({ where: { createdBy: user.id }, include: { attendees: true } });
  const attendanceByWebinar = webinars.map((w: any) => ({ name: w.title, attendees: w.attendees.length }));

  // Attendance over time
  const records = await db.attendee.findMany({ where: { webinar: { is: { createdBy: user.id } }, joinedAt: { gte: startDate } } });
  const attendanceOverTimeMap: Record<string, number> = {};
  records.forEach((att: any) => {
    const dateKey = att.joinedAt ? att.joinedAt.toISOString().split('T')[0] : '';
    attendanceOverTimeMap[dateKey] = (attendanceOverTimeMap[dateKey] || 0) + 1;
  });
  const attendanceOverTime = Object.entries(attendanceOverTimeMap).map(([date, count]) => ({ date, count }));

  // Attendee status breakdown
  const statusCounts = await db.attendee.groupBy({
    by: ['status'],
    where: { webinar: { is: { createdBy: user.id } } },
    _count: { status: true }
  });
  const attendeeStatus = statusCounts.map((s: any) => ({ name: s.status, value: s._count.status }));

  // Conversion rates placeholder
  const conversionRates: { name: string; rate: number }[] = [];

  return NextResponse.json({ attendanceByWebinar, attendanceOverTime, attendeeStatus, conversionRates });
} 