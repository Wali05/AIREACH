import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, webinarId } = body;
    
    // Validate inputs
    if (!name || !email || !webinarId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get VAPI API key and org ID from environment variables
    const VAPI_API_KEY = process.env.VAPI_PRIVATE_KEY;
    const VAPI_ORG_ID = process.env.VAPI_ORG_ID;
    
    if (!VAPI_API_KEY || !VAPI_ORG_ID) {
      console.error("VAPI credentials not configured");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }
    
    // Get the default agent ID from the VAPI API
    const agentsResponse = await fetch("https://api.vapi.ai/agents", {
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!agentsResponse.ok) {
      console.error("Failed to fetch VAPI agents:", await agentsResponse.text());
      return NextResponse.json(
        { error: "Failed to connect to call service" },
        { status: 502 }
      );
    }
    
    const agents = await agentsResponse.json();
    
    if (!agents || !agents.length) {
      return NextResponse.json(
        { error: "No agents available" },
        { status: 500 }
      );
    }
    
    // Use the first agent as default
    const defaultAgent = agents[0];
    
    // Create a call task using VAPI API
    const callTaskResponse = await fetch("https://api.vapi.ai/call-tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: defaultAgent.id,
        customer: {
          name,
          phone_number: phone || "", // Phone might be optional in your form
        },
        customer_email: email,
        metadata: {
          webinarId,
          message: message || "",
        },
      }),
    });
    
    if (!callTaskResponse.ok) {
      console.error("Failed to create VAPI call task:", await callTaskResponse.text());
      return NextResponse.json(
        { error: "Failed to schedule call" },
        { status: 502 }
      );
    }
    
    const callTask = await callTaskResponse.json();
    
    // Store the call task information in your database if needed
    // ... (database storage code)
    
    return NextResponse.json({ 
      success: true, 
      message: "Call scheduled successfully",
      callId: callTask.id
    });
    
  } catch (error) {
    console.error("Error processing booking request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
