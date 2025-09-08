import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET() {
  try {
    const query = `
      SELECT 
        id, name, display_name, endpoint, model_name, 
        is_active, tier, cost_per_1k_tokens, priority,
        rate_limit, rate_window, quality_score, speed_score,
        model_options, properties, supported_features,
        auth_key, created_at, updated_at
      FROM ai_providers 
      ORDER BY priority ASC
    `;
    
    const result = await pool.query(query);
    
    const providers = result.rows.map(provider => ({
      ...provider,
      hasApiKey: !!process.env[provider.auth_key],
      modelOptions: provider.model_options || {},
      properties: provider.properties || {},
      supportedFeatures: provider.supported_features || {}
    }));
    
    return NextResponse.json({
      success: true,
      providers,
      summary: {
        total: providers.length,
        active: providers.filter(p => p.is_active).length,
        free: providers.filter(p => p.tier === 'free').length,
        premium: providers.filter(p => p.tier === 'premium').length,
        enterprise: providers.filter(p => p.tier === 'enterprise').length
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}