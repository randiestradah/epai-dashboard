import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request: NextRequest) {
  try {
    const { providerName, isActive } = await request.json();
    
    if (!providerName || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Provider name and isActive status are required' },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE ai_providers 
      SET is_active = $1, updated_at = NOW()
      WHERE name = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [isActive, providerName]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Provider ${providerName} ${isActive ? 'activated' : 'deactivated'}`,
      provider: {
        name: result.rows[0].name,
        displayName: result.rows[0].display_name,
        isActive: result.rows[0].is_active,
        updatedAt: result.rows[0].updated_at
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}