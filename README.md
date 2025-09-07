# EPAI Admin Dashboard

Real-time monitoring and analytics dashboard for the EPAI AI Assistant Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 📊 Features

### Real-time Monitoring
- **System Health** - AI server, Firebase, database status
- **User Analytics** - Registration, engagement, retention
- **AI Metrics** - Response times, provider usage, error rates
- **Cost Analysis** - Self-hosted vs cloud costs, savings

### Management Tools
- **User Management** - View users, activity, subscriptions
- **AI Provider Management** - Add/edit/disable AI providers
- **Rate Limit Monitoring** - Real-time usage tracking
- **System Controls** - Feature flags, maintenance mode
- **Security Monitoring** - Failed logins, suspicious activity
- **Database Stats** - Collection sizes, storage usage

### Analytics & Reporting
- **Performance Charts** - Response times, throughput
- **Cost Breakdown** - Monthly expenses, cost per user
- **Growth Metrics** - User acquisition, retention rates
- **AI Usage** - Model performance, provider efficiency

## 🏗️ Architecture

```
dashboard/
├── src/
│   ├── app/                # Next.js 13+ app directory
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Dashboard home
│   │   ├── users/         # User management
│   │   ├── ai/            # AI metrics & provider management
│   │   │   ├── providers/ # AI provider CRUD
│   │   │   ├── metrics/   # Performance analytics
│   │   │   └── limits/    # Rate limit monitoring
│   │   ├── costs/         # Cost analysis
│   │   └── system/        # System health
│   ├── components/        # React components
│   │   ├── Sidebar.tsx    # Navigation
│   │   ├── Header.tsx     # Top bar
│   │   ├── MetricsCard.tsx
│   │   └── charts/        # Chart components
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Utilities
│   └── types/             # TypeScript types
├── package.json
└── next.config.js
```

## 🔧 Configuration

### Environment Variables
```bash
# Firebase
FIREBASE_PROJECT_ID=epai-assistant
FIREBASE_ADMIN_KEY=your-admin-key

# Admin API
ADMIN_API_SECRET=your-secret-key
FIREBASE_FUNCTIONS_URL=https://us-central1-epai-assistant.cloudfunctions.net

# AI Gateway
AI_GATEWAY_URL=http://localhost:3002
AI_GATEWAY_ADMIN_KEY=your-ai-gateway-admin-key

# Database
DATABASE_URL=postgresql://neondb_owner:npg_Fx4JdrkfmbU9@ep-spring-breeze-a167x8af-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
```

### API Endpoints
The dashboard connects to Firebase Functions admin API:
- `/adminAPI/dashboard` - Main dashboard data
- `/adminAPI/users/*` - User analytics and management
- `/adminAPI/ai/*` - AI metrics and performance
- `/adminAPI/costs/*` - Cost analysis and breakdown
- `/adminAPI/system/*` - System health and logs

### AI Gateway Admin API
Direct connection to AI Gateway for provider management:
- `GET /admin/providers` - List all AI providers
- `POST /admin/providers` - Add new AI provider
- `PUT /admin/providers/:id` - Update provider configuration
- `DELETE /admin/providers/:id` - Disable provider
- `GET /health` - Real-time provider status

## 📈 Metrics Tracked

### User Metrics
- Total registered users
- Daily/monthly active users
- New user registrations
- User retention rates
- Subscription conversions

### AI Performance
- Total AI requests
- Average response time
- Error rates by provider
- Self-hosted vs cloud usage
- Model performance comparison

### Cost Analysis
- Monthly infrastructure costs
- Cost per user
- Self-hosted savings
- Cloud API expenses
- ROI calculations

### System Health
- Server uptime
- Database performance
- API response times
- Error rates
- Security events

## 🔐 Security

- **Admin Authentication** - Secret key based access
- **CORS Protection** - Restricted origins
- **Rate Limiting** - API request limits
- **Audit Logging** - All admin actions logged
- **Secure Headers** - Security best practices

## 🚀 Deployment

### Development
```bash
npm run dev
# Dashboard available at http://localhost:3001
```

### Production
```bash
# Build and deploy
npm run build
npm start

# Or deploy to Vercel
vercel deploy
```

## 📊 Dashboard Sections

### 1. Overview Dashboard
- Key metrics cards
- Real-time system status
- Recent activity feed
- Quick actions

### 2. User Management
- User list with search/filter
- User activity timeline
- Subscription management
- User analytics charts

### 3. AI Provider Management
- **Provider List** - View all configured AI providers
- **Add Provider** - Configure new AI services (Groq, Gemini, etc.)
- **Edit Provider** - Update endpoints, rate limits, priorities
- **Rate Limits** - Real-time usage tracking per provider
- **Performance** - Response times, success rates, error logs
- **Cost Tracking** - Usage costs per provider
- **Health Status** - Live availability monitoring

### 4. AI Metrics & Analytics
- Response time charts
- Provider performance comparison
- Error rate monitoring
- Model usage statistics
- Fallback success rates

### 5. Cost Analysis
- Monthly cost breakdown
- Cost per user trends
- Savings from self-hosting
- Budget alerts

### 6. System Health
- Infrastructure status
- Performance monitoring
- Error logs
- Maintenance controls

## 🔄 Real-time Updates

The dashboard updates automatically every 30 seconds with:
- Live user counts
- Current AI performance
- System health status
- Recent activity

## 📱 Mobile Responsive

Fully responsive design works on:
- Desktop computers
- Tablets
- Mobile phones
- Large displays

Perfect for monitoring on-the-go! 📊✨