-- Dashboard Admin Authentication Schema

-- Admin Users Table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  
  -- Permissions
  can_manage_users BOOLEAN DEFAULT true,
  can_manage_ai BOOLEAN DEFAULT true,
  can_view_analytics BOOLEAN DEFAULT true,
  can_manage_system BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES admin_users(id)
);

-- Admin Sessions Table (for JWT blacklisting)
CREATE TABLE admin_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_sessions_user ON admin_sessions(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role, can_manage_system) 
VALUES (
  'admin@epai.com',
  '$2b$12$LQv3c1yqBwlVHpPjrCeyL.rRVmg5zeqHgqcow15HjR5cMjkpYf/EO',
  'System Administrator',
  'super_admin',
  true
);