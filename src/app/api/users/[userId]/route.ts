import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    
    // TODO: Get user from DynamoDB
    return NextResponse.json({
      success: true,
      user: {
        userId,
        email: 'user@example.com',
        displayName: 'User',
        tokens: 50,
        subscription: 'free',
        createdAt: new Date().toISOString()
      }
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 500
    }, { status: 500 });
  }
}