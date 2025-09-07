-- EPAI System Database Schema
-- PostgreSQL initialization script

-- AI Models Configuration
CREATE TABLE IF NOT EXISTS ai_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    api_endpoint VARCHAR(255),
    max_tokens INTEGER DEFAULT 4096,
    cost_per_1k_tokens DECIMAL(8,4) DEFAULT 0.0020,
    capabilities JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Assistant Archetypes Templates
CREATE TABLE IF NOT EXISTS assistant_archetypes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_personality JSONB NOT NULL,
    system_prompt TEXT,
    avatar_collection_id INTEGER,
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Avatar Collections
CREATE TABLE IF NOT EXISTS avatar_collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'free',
    assets JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0,
    target_tiers JSONB DEFAULT '["free", "premium"]',
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- App Configuration
CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System Analytics
CREATE TABLE IF NOT EXISTS daily_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    dimensions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date, metric_name, dimensions)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active, cost_per_1k_tokens);
CREATE INDEX IF NOT EXISTS idx_archetypes_sort ON assistant_archetypes(sort_order, is_premium);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled, rollout_percentage);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON daily_metrics(date, metric_name);

-- Insert default data
INSERT INTO ai_models (name, provider, api_endpoint, max_tokens, cost_per_1k_tokens, capabilities) VALUES
('gpt-4o-mini', 'openai', 'https://api.openai.com/v1/chat/completions', 128000, 0.0015, '["text", "vision"]'),
('gpt-4o', 'openai', 'https://api.openai.com/v1/chat/completions', 128000, 0.0050, '["text", "vision", "code"]'),
('claude-3-haiku', 'anthropic', 'https://api.anthropic.com/v1/messages', 200000, 0.0008, '["text", "code"]'),
('gemini-1.5-flash', 'google', 'https://generativelanguage.googleapis.com/v1beta/models', 1000000, 0.0010, '["text", "vision", "code"]')
ON CONFLICT (name) DO NOTHING;

INSERT INTO assistant_archetypes (name, description, default_personality, system_prompt, sort_order) VALUES
('Bestie', 'Your fun and supportive AI friend', '{"logic_emotion": 30, "serious_humorous": 70, "concise_detailed": 50}', 'You are a supportive, fun, and caring AI friend. Be casual, use emojis, and show genuine interest in the user''s life.', 1),
('Professional', 'Focused and efficient AI assistant', '{"logic_emotion": 80, "serious_humorous": 20, "concise_detailed": 70}', 'You are a professional AI assistant. Be efficient, accurate, and helpful while maintaining a respectful tone.', 2),
('Mentor', 'Wise and guiding AI companion', '{"logic_emotion": 60, "serious_humorous": 40, "concise_detailed": 80}', 'You are a wise mentor. Provide thoughtful guidance, ask insightful questions, and help users grow personally and professionally.', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO feature_flags (name, description, is_enabled, target_tiers) VALUES
('voice_chat', 'Voice conversation feature', false, '["premium"]'),
('image_generation', 'AI image creation', true, '["premium"]'),
('calendar_integration', 'Calendar sync and management', true, '["free", "premium"]'),
('advanced_analytics', 'Detailed usage analytics', true, '["premium"]')
ON CONFLICT (name) DO NOTHING;

INSERT INTO app_config (key, value, description, is_public) VALUES
('max_free_tokens', '1000', 'Maximum tokens for free tier users per day', true),
('max_premium_tokens', '50000', 'Maximum tokens for premium users per day', true),
('maintenance_mode', 'false', 'Enable maintenance mode', true),
('app_version', '"1.0.0"', 'Current app version', true)
ON CONFLICT (key) DO NOTHING;