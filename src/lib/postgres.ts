import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'epai_system',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const postgres = {
  // AI Models
  async getAIModels() {
    const result = await pool.query(`
      SELECT * FROM ai_models 
      WHERE is_active = true 
      ORDER BY cost_per_1k_tokens ASC
    `);
    return result.rows;
  },

  async getAIModel(id: number) {
    const result = await pool.query('SELECT * FROM ai_models WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Assistant Archetypes
  async getArchetypes() {
    const result = await pool.query(`
      SELECT * FROM assistant_archetypes 
      ORDER BY sort_order ASC, name ASC
    `);
    return result.rows;
  },

  async getArchetype(id: number) {
    const result = await pool.query('SELECT * FROM assistant_archetypes WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Feature Flags
  async getFeatureFlags(tier?: string) {
    let query = 'SELECT * FROM feature_flags WHERE is_enabled = true';
    const params: any[] = [];
    
    if (tier) {
      query += ' AND (target_tiers IS NULL OR target_tiers @> $1)';
      params.push(JSON.stringify([tier]));
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // App Configuration
  async getConfig(key: string) {
    const result = await pool.query('SELECT value FROM app_config WHERE key = $1', [key]);
    return result.rows[0]?.value;
  },

  async getPublicConfig() {
    const result = await pool.query('SELECT key, value FROM app_config WHERE is_public = true');
    return result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  },

  // Analytics
  async saveMetric(date: string, metricName: string, value: number, dimensions?: Record<string, any>) {
    await pool.query(`
      INSERT INTO daily_metrics (date, metric_name, metric_value, dimensions)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (date, metric_name, dimensions) 
      DO UPDATE SET metric_value = $3, created_at = NOW()
    `, [date, metricName, value, dimensions ? JSON.stringify(dimensions) : null]);
  },

  async getMetrics(startDate: string, endDate: string, metricName?: string) {
    let query = `
      SELECT date, metric_name, metric_value, dimensions
      FROM daily_metrics 
      WHERE date BETWEEN $1 AND $2
    `;
    const params = [startDate, endDate];
    
    if (metricName) {
      query += ' AND metric_name = $3';
      params.push(metricName);
    }
    
    query += ' ORDER BY date DESC, metric_name ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // Raw query for complex operations
  async query(text: string, params?: any[]) {
    const result = await pool.query(text, params);
    return result.rows;
  },
};

export default postgres;