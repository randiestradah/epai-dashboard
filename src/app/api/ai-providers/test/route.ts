import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { providerName } = await request.json();
    
    if (!providerName) {
      return NextResponse.json(
        { success: false, error: 'Provider name is required' },
        { status: 400 }
      );
    }
    
    // Test via deployed AI Gateway
    const startTime = Date.now();
    const response = await fetch('https://ai-gateway-wheat.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello! Please respond with AI test successful',
        provider: providerName
      })
    });
    
    const result = await response.json();
    
    return NextResponse.json({
      success: result.success,
      response: result.response,
      provider: result.provider || providerName,
      processingTime: Date.now() - startTime
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}