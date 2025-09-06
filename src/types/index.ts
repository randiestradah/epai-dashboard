export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastActive: Date;
  subscription?: 'free' | 'premium';
  totalRequests: number;
}

export interface AIMetric {
  id: string;
  userId: string;
  provider: 'self_hosted' | 'gemini' | 'openai';
  model: string;
  requestType: 'chat' | 'completion';
  responseTime: number;
  tokenCount: number;
  cost: number;
  error?: string;
  timestamp: Date;
}

export interface SystemHealth {
  firebase: 'healthy' | 'warning' | 'error';
  selfHostedAI: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  overall: 'healthy' | 'warning' | 'error';
  uptime: number;
  lastCheck: string;
}

export interface CostBreakdown {
  monthly: {
    selfHosted: number;
    cloudAPI: number;
    total: number;
  };
  savings: {
    vsCloudOnly: number;
    percentage: number;
  };
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
  };
  ai: {
    requests: number;
    avgResponseTime: number;
    errorRate: number;
  };
  costs: {
    total: number;
    selfHosted: number;
    cloudAPI: number;
  };
  system: {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
  };
}

export interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'rate_limit' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  userId?: string;
  ipAddress: string;
  timestamp: Date;
}

export interface DatabaseStats {
  collections: Record<string, number>;
  totalDocuments: number;
  storageUsed: string;
}