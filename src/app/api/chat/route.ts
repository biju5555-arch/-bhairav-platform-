import { NextRequest, NextResponse } from 'next/server';

const CLAWDBOT_GATEWAY = process.env.CLAWDBOT_GATEWAY_URL || 'http://127.0.0.1:18789';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call Clawdbot gateway
    const response = await fetch(`${CLAWDBOT_GATEWAY}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || 'bhairav-session',
        context: {
          platform: 'bhairav',
          capabilities: ['ideogram', 'runway', 'elevenlabs']
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Clawdbot gateway error:', errorText);
      return NextResponse.json(
        { error: 'Gateway error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${CLAWDBOT_GATEWAY}/health`);
    const isHealthy = response.ok;
    
    return NextResponse.json({
      status: isHealthy ? 'connected' : 'disconnected',
      gateway: CLAWDBOT_GATEWAY,
    });
  } catch {
    return NextResponse.json({
      status: 'disconnected',
      gateway: CLAWDBOT_GATEWAY,
      error: 'Cannot reach gateway'
    });
  }
}
