// filepath: src/app/api/sales/route.ts
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

    // fetch sales for webinars created by this user
    const sales = await db.sale.findMany({
      where: { webinar: { createdBy: owner.id } },
      include: { webinar: true }
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, webinarId } = await request.json();
    if (!amount || !webinarId) {
      return NextResponse.json({ error: 'Amount and webinarId are required' }, { status: 400 });
    }
    const sale = await db.sale.create({ data: { amount, currency: currency || 'usd', webinarId } });
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
