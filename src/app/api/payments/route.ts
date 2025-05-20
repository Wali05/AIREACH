import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Ensure the user is authenticated and has admin access
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user has admin privileges (you can implement your own logic here)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search") || "";
    
    // Build filters
    const filters: any = {};
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        filters.createdAt.lt = endDateTime;
      }
    }
    
    // Get transactions from database
    const transactions = await prisma.purchase.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        webinar: {
          select: { title: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });
    
    // Format transactions for frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      webinarId: tx.webinarId,
      webinarTitle: tx.webinar?.title || "Unknown Webinar",
      userId: tx.userId,
      userName: tx.user?.name,
      email: tx.user?.email,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      createdAt: tx.createdAt.toISOString(),
      stripeSessionId: tx.stripeSessionId
    }));
    
    // Apply search filter if provided (do this in memory since we already fetched the data)
    const filteredTransactions = search
      ? formattedTransactions.filter(tx => 
          tx.webinarTitle.toLowerCase().includes(search.toLowerCase()) ||
          (tx.userName && tx.userName.toLowerCase().includes(search.toLowerCase())) ||
          (tx.email && tx.email.toLowerCase().includes(search.toLowerCase()))
        )
      : formattedTransactions;
      
    return NextResponse.json(filteredTransactions);
    
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
