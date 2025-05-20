import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// This would typically use the Vapi API client to fetch agents
// For now, we'll mock the response with sample data
export async function GET() {
  try {
    // Fetch AI agents from VAPI
    const apiKey = process.env.VAPI_PRIVATE_KEY;
    const orgId = process.env.VAPI_ORG_ID;
    if (!apiKey || !orgId) {
      throw new Error('VAPI credentials not configured');
    }
    const response = await fetch('https://api.vapi.ai/v1/agents', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'X-ORG-ID': orgId,
      },
    });
    if (!response.ok) {
      console.error('VAPI agents fetch failed:', response.status, await response.text());
      return new NextResponse('Failed to fetch agents', { status: response.status });
    }
    const data = await response.json();
    // Expect data.agents array
    return NextResponse.json({ agents: data.agents || [] });
  } catch (error) {
    console.error('Error fetching Vapi agents:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}