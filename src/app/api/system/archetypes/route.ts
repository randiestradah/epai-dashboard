import { NextResponse } from 'next/server';
import { postgres } from '../../../../lib/postgres';

export async function GET() {
  try {
    const archetypes = await postgres.getArchetypes();
    
    return NextResponse.json({
      success: true,
      data: archetypes
    });
  } catch (error) {
    console.error('Error fetching archetypes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch archetypes' },
      { status: 500 }
    );
  }
}