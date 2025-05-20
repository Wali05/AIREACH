import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Update with the latest API version
});

export async function GET(request: Request) {
  try {
    // Get the current user and webinar ID
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const webinarId = searchParams.get("webinarId");
    
    if (!webinarId) {
      return NextResponse.json({ error: "Webinar ID is required" }, { status: 400 });
    }
    
    // Fetch the webinar from your database
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        title: true,
        price: true,
        customerId: true,
      },
    });
    
    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }
    
    // Set a default price if not specified
    const price = webinar.price || 1999; // $19.99 by default
    
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: webinar.title,
              description: "Full access to webinar recordings and materials",
            },
            unit_amount: price, // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/webinar/${webinarId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/attend/webinar/${webinarId}`,
      metadata: {
        webinarId,
        userId: userId || "anonymous",
      },
    });
    
    // Redirect to the Stripe Checkout page
    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // This endpoint would be used for the Stripe webhook
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";
    
    // Your webhook secret from the environment variables
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      console.error("Stripe webhook secret not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata from the session
      const { webinarId, userId } = session.metadata || {};
      
      if (webinarId && userId) {
        // Update your database to record the purchase
        await prisma.purchase.create({
          data: {
            webinarId,
            userId,
            amount: session.amount_total || 0,
            currency: session.currency || "usd",
            status: "completed",
            stripeSessionId: session.id,
          },
        });
        
        // You might also want to grant permanent access to the webinar
        // This depends on your application's logic
      }
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
