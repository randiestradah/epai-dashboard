import { NextResponse } from 'next/server';
import { postgres } from '../../../../lib/postgres';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    
    const features = await postgres.getFeatureFlags(tier || undefined);
    
    return NextResponse.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}