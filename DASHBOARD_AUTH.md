# Dashboard JWT Authentication
## Admin Login System for EPAI Dashboard

**Status:** ✅ Ready for Implementation  
**Authentication:** JWT with PostgreSQL sessions  
**Default Login:** admin@epai.com / admin123  

---

## 🔐 **Authentication System**

### **Database Schema**
```sql
-- Admin users with role-based permissions
admin_users: id, email, password_hash, name, role, permissions, status
admin_sessions: JWT session tracking with expiration
```

### **JWT Implementation**
```javascript
// Login generates JWT token
const token = jwt.sign({
  userId, email, role, permissions
}, JWT_SECRET, { expiresIn: '24h' });

// Middleware verifies token on each request
const decoded = jwt.verify(token, JWT_SECRET);
```

### **Permission System**
```javascript
permissions: {
  canManageUsers: true,    // User management
  canManageAI: true,       // AI provider management  
  canViewAnalytics: true,  // Dashboard analytics
  canManageSystem: false   // System settings (super admin only)
}
```

---

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
cd backend/dashboard
npm install
```

### **2. Setup Database**
```bash
# Create admin tables
npm run setup-auth
```

### **3. Configure Environment**
```bash
# Add to .env.local
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your-super-secret-jwt-key
```

### **4. Start Dashboard**
```bash
npm run dev
# Available at http://localhost:3001
```

---

## 🔑 **Default Admin Account**

### **Login Credentials**
```
Email: admin@epai.com
Password: admin123
Role: super_admin
Permissions: All enabled
```

### **Login Flow**
```
1. Go to /login
2. Enter credentials
3. JWT token stored in localStorage
4. Redirected to dashboard
5. Token verified on each API call
```

---

## 📊 **API Endpoints**

### **Authentication**
```
POST /api/auth/login     # Admin login
POST /api/auth/logout    # Invalidate session
```

### **Protected Routes**
```javascript
// All dashboard routes require authentication
app.use('/api/admin/*', authenticateToken);

// Permission-based access
app.use('/api/admin/users', requirePermission('canManageUsers'));
app.use('/api/admin/ai', requirePermission('canManageAI'));
```

---

## 🛡️ **Security Features**

### **Account Protection**
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed attempts (30 min)
- JWT token expiration (24 hours)
- Session tracking and invalidation

### **Permission Control**
```javascript
// Role-based access
roles: ['admin', 'super_admin']

// Permission-based access  
permissions: {
  canManageUsers: boolean,
  canManageAI: boolean,
  canViewAnalytics: boolean,
  canManageSystem: boolean
}
```

### **Session Management**
- JWT tokens stored in database sessions
- Automatic cleanup of expired sessions
- Logout invalidates all user sessions
- IP address and user agent tracking

---

## 🎯 **Usage Examples**

### **Login Component**
```javascript
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('adminToken', data.token);
    router.push('/');
  }
};
```

### **Protected API Call**
```javascript
const fetchData = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch('/api/admin/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

### **Middleware Usage**
```javascript
// Protect AI management routes
app.use('/api/admin/ai', 
  authenticateToken, 
  requirePermission('canManageAI')
);
```

---

## 🔧 **Admin User Management**

### **Create New Admin**
```javascript
await authService.createUser(
  'newadmin@epai.com',
  'securepassword',
  'New Admin',
  'admin',
  {
    canManageUsers: true,
    canManageAI: true,
    canViewAnalytics: true,
    canManageSystem: false
  },
  currentUserId
);
```

### **Update Permissions**
```sql
UPDATE admin_users 
SET can_manage_ai = true, can_manage_system = false 
WHERE id = $1;
```

---

## 📈 **Integration with Dashboard**

### **Dashboard Layout**
```javascript
// Check authentication on app load
useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    router.push('/login');
  }
}, []);
```

### **AI Provider Management**
```javascript
// Only users with canManageAI permission
const AIProviderPage = () => {
  const [user] = useState(() => 
    JSON.parse(localStorage.getItem('adminUser'))
  );
  
  if (!user?.permissions?.canManageAI) {
    return <div>Access Denied</div>;
  }
  
  return <AIProviderManagement />;
};
```

---

## ✅ **Ready for Production**

### **Security Checklist**
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] Session management
- [x] Account lockout protection
- [x] Permission-based access control
- [x] Secure environment variables

### **Default Setup**
- [x] Admin user created (admin@epai.com)
- [x] Database schema deployed
- [x] Login page implemented
- [x] JWT middleware configured
- [x] API routes protected

**Dashboard authentication is production-ready! 🔐✨**