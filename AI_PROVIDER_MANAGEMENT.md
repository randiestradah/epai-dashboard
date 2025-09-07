# AI Provider Management Dashboard
## Dynamic AI Gateway Administration

**Integration:** EPAI Admin Dashboard  
**Location:** `/ai/providers` section  
**Status:** 🔧 Ready for Implementation  

---

## 🎯 **Dashboard Features**

### **1. Provider Overview**
```
┌─────────────────────────────────────────────────────────────┐
│ AI Providers Status                                         │
├─────────────────────────────────────────────────────────────┤
│ ✅ Groq          │ 25/30 req/min  │ Priority: 1 │ 98.5% up │
│ ✅ Gemini        │ 12/15 req/min  │ Priority: 2 │ 99.2% up │
│ ⚠️  Together     │ 890/1000/month │ Priority: 3 │ 95.1% up │
│ ❌ Cohere        │ Rate Limited   │ Priority: 4 │ 87.3% up │
│ 🔧 HuggingFace   │ Maintenance    │ Priority: 5 │ 0% up    │
└─────────────────────────────────────────────────────────────┘
```

### **2. Add New Provider Form**
```typescript
interface AddProviderForm {
  name: string;              // 'deepseek'
  display_name: string;      // 'DeepSeek Chat'
  endpoint: string;          // API URL
  auth_key: string;          // Environment variable name
  rate_limit: number;        // Requests per window
  rate_window: string;       // 'minute', 'hour', 'month'
  model_name: string;        // Model identifier
  request_format: object;    // JSON template
  response_path: string;     // JSONPath to response
  priority: number;          // 1-10 routing priority
  quality_score: number;     // 1-5 quality rating
  speed_score: number;       // 1-5 speed rating
}
```

### **3. Real-time Monitoring**
```javascript
// Live provider status updates
const ProviderStatus = {
  groq: {
    available: true,
    usage: "25/30",
    resetIn: "35 seconds",
    avgResponseTime: "1.2s",
    successRate: "98.5%",
    lastError: null
  },
  gemini: {
    available: true,
    usage: "12/15", 
    resetIn: "35 seconds",
    avgResponseTime: "2.1s",
    successRate: "99.2%",
    lastError: null
  }
};
```

---

## 🔧 **Implementation Guide**

### **Dashboard Pages Structure**
```
dashboard/src/app/ai/
├── page.tsx                 # AI overview dashboard
├── providers/
│   ├── page.tsx            # Provider list & management
│   ├── add/page.tsx        # Add new provider form
│   ├── [id]/edit/page.tsx  # Edit provider
│   └── [id]/metrics/page.tsx # Provider analytics
├── metrics/
│   ├── page.tsx            # Performance analytics
│   └── costs/page.tsx      # Cost breakdown
└── limits/
    └── page.tsx            # Rate limit monitoring
```

### **API Integration**
```typescript
// AI Gateway API client
class AIGatewayAPI {
  constructor(baseURL: string, adminKey: string) {
    this.baseURL = baseURL;
    this.adminKey = adminKey;
  }

  async getProviders() {
    return fetch(`${this.baseURL}/admin/providers`, {
      headers: { 'Authorization': `Bearer ${this.adminKey}` }
    });
  }

  async addProvider(provider: AddProviderForm) {
    return fetch(`${this.baseURL}/admin/providers`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.adminKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(provider)
    });
  }

  async updateProvider(id: number, updates: Partial<AddProviderForm>) {
    return fetch(`${this.baseURL}/admin/providers/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${this.adminKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
  }

  async getHealth() {
    return fetch(`${this.baseURL}/health`);
  }
}
```

### **React Components**
```typescript
// Provider List Component
const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [health, setHealth] = useState({});

  useEffect(() => {
    // Fetch providers and health status
    // Update every 30 seconds
  }, []);

  return (
    <div className="provider-grid">
      {providers.map(provider => (
        <ProviderCard 
          key={provider.id}
          provider={provider}
          status={health[provider.name]}
          onEdit={() => router.push(`/ai/providers/${provider.id}/edit`)}
          onToggle={() => toggleProvider(provider.id)}
        />
      ))}
    </div>
  );
};

// Add Provider Form
const AddProviderForm = () => {
  const [formData, setFormData] = useState<AddProviderForm>({
    name: '',
    display_name: '',
    endpoint: '',
    // ... other fields
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await aiGatewayAPI.addProvider(formData);
    router.push('/ai/providers');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="name"
        placeholder="Provider name (e.g., deepseek)"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* Other form fields */}
    </form>
  );
};
```

---

## 📊 **Dashboard Sections**

### **1. Provider Management**
- **List View**: All providers with status indicators
- **Add Form**: Guided provider setup with templates
- **Edit Form**: Update configuration without downtime
- **Bulk Actions**: Enable/disable multiple providers
- **Import/Export**: Backup and restore configurations

### **2. Rate Limit Monitoring**
```
Real-time Usage Dashboard:
┌─────────────────────────────────────────────────────────────┐
│ Current Usage (Live Updates)                                │
├─────────────────────────────────────────────────────────────┤
│ Groq:     ████████░░ 25/30 (83%) │ Resets in: 00:35      │
│ Gemini:   ████████░░ 12/15 (80%) │ Resets in: 00:35      │
│ Together: ████████░░ 890/1K (89%) │ Resets in: 15 days   │
│ Cohere:   ██████████ 1000/1K (100%) │ Resets in: 2 days │
└─────────────────────────────────────────────────────────────┘
```

### **3. Performance Analytics**
- **Response Time Charts**: Per-provider performance trends
- **Success Rate Monitoring**: Error tracking and alerts
- **Cost Analysis**: Usage costs per provider
- **Fallback Statistics**: How often fallbacks are used
- **Geographic Performance**: Response times by region

### **4. Provider Templates**
```javascript
// Pre-configured provider templates
const PROVIDER_TEMPLATES = {
  groq: {
    display_name: 'Groq Llama 3.1',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    auth_key: 'GROQ_API_KEY',
    rate_limit: 30,
    rate_window: 'minute',
    model_name: 'llama-3.1-8b-instant',
    request_format: {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: '{system_prompt}' },
        { role: 'user', content: '{message}' }
      ]
    },
    response_path: '$.choices[0].message.content'
  },
  // ... other templates
};
```

---

## 🚀 **Quick Implementation Steps**

### **Step 1: Add to Dashboard Navigation**
```typescript
// Update dashboard sidebar
const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { 
    name: 'AI Providers', 
    href: '/ai/providers', 
    icon: CpuChipIcon,
    children: [
      { name: 'Manage', href: '/ai/providers' },
      { name: 'Metrics', href: '/ai/metrics' },
      { name: 'Rate Limits', href: '/ai/limits' }
    ]
  },
  // ... other items
];
```

### **Step 2: Create API Routes**
```typescript
// app/api/ai/providers/route.ts
export async function GET() {
  const providers = await aiGatewayAPI.getProviders();
  return Response.json(providers);
}

export async function POST(request: Request) {
  const provider = await request.json();
  const result = await aiGatewayAPI.addProvider(provider);
  return Response.json(result);
}
```

### **Step 3: Add Environment Variables**
```bash
# .env.local
AI_GATEWAY_URL=http://localhost:3002
AI_GATEWAY_ADMIN_KEY=your-admin-key
```

### **Step 4: Create UI Components**
- Provider list with real-time status
- Add/edit provider forms
- Rate limit monitoring charts
- Performance analytics dashboard

---

## 🎯 **Benefits**

### **For Administrators**
- ✅ **No Code Changes**: Add providers via UI
- ✅ **Real-time Monitoring**: Live status updates
- ✅ **Cost Control**: Track usage and costs
- ✅ **Performance Insights**: Optimize provider selection
- ✅ **Easy Scaling**: Add providers as needed

### **For System**
- ✅ **Zero Downtime**: Update providers without restart
- ✅ **Automatic Failover**: Smart routing and fallbacks
- ✅ **Cost Optimization**: Use cheapest available providers
- ✅ **Performance Tracking**: Data-driven decisions
- ✅ **Scalable Architecture**: Handle growth seamlessly

**This dashboard gives you complete control over your AI infrastructure! 🎯🚀**