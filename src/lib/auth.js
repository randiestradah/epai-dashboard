const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '24h';

class AuthService {
  // Login admin user
  async login(email, password, ipAddress, userAgent) {
    try {
      // Get user from database
      const result = await pool.query(
        'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Check if account is locked
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        throw new Error('Account temporarily locked');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        // Increment login attempts
        await this.incrementLoginAttempts(user.id);
        throw new Error('Invalid credentials');
      }

      // Reset login attempts and update last login
      await pool.query(
        'UPDATE admin_users SET login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1',
        [user.id]
      );

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          permissions: {
            canManageUsers: user.can_manage_users,
            canManageAI: user.can_manage_ai,
            canViewAnalytics: user.can_view_analytics,
            canManageSystem: user.can_manage_system
          }
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Store session
      const tokenHash = await bcrypt.hash(token, 10);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await pool.query(
        'INSERT INTO admin_sessions (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [user.id, tokenHash, expiresAt, ipAddress, userAgent]
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: {
            canManageUsers: user.can_manage_users,
            canManageAI: user.can_manage_ai,
            canViewAnalytics: user.can_view_analytics,
            canManageSystem: user.can_manage_system
          }
        }
      };

    } catch (error) {
      throw error;
    }
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if session exists and is valid
      const sessionResult = await pool.query(
        'SELECT s.*, u.is_active FROM admin_sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.user_id = $1 AND s.expires_at > NOW()',
        [decoded.userId]
      );

      if (sessionResult.rows.length === 0 || !sessionResult.rows[0].is_active) {
        throw new Error('Invalid session');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Logout (invalidate session)
  async logout(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Remove session from database
      await pool.query(
        'DELETE FROM admin_sessions WHERE user_id = $1',
        [decoded.userId]
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  // Increment login attempts
  async incrementLoginAttempts(userId) {
    const result = await pool.query(
      'UPDATE admin_users SET login_attempts = login_attempts + 1 WHERE id = $1 RETURNING login_attempts',
      [userId]
    );

    const attempts = result.rows[0].login_attempts;

    // Lock account after 5 failed attempts for 30 minutes
    if (attempts >= 5) {
      const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      await pool.query(
        'UPDATE admin_users SET locked_until = $1 WHERE id = $2',
        [lockUntil, userId]
      );
    }
  }

  // Create new admin user
  async createUser(email, password, name, role, permissions, createdBy) {
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      
      const result = await pool.query(
        `INSERT INTO admin_users 
         (email, password_hash, name, role, can_manage_users, can_manage_ai, can_view_analytics, can_manage_system, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, email, name, role`,
        [
          email, passwordHash, name, role,
          permissions.canManageUsers,
          permissions.canManageAI, 
          permissions.canViewAnalytics,
          permissions.canManageSystem,
          createdBy
        ]
      );

      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Get all admin users
  async getUsers() {
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Clean expired sessions
  async cleanExpiredSessions() {
    await pool.query('DELETE FROM admin_sessions WHERE expires_at < NOW()');
  }
}

module.exports = new AuthService();