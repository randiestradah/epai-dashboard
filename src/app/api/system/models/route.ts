import { NextResponse } from 'next/server';
import { postgres } from '../../../../lib/postgres';

export async function GET() {
  try {
    const models = await postgres.getAIModels();
    
    return NextResponse.json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI models' },
      { status: 500 }
    );
  }
}