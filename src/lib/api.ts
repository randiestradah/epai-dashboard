import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://us-central1-epai-assistant.cloudfunctions.net'
  : 'http://localhost:5001/epai-assistant/us-central1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ADMIN_API_SECRET}`,
  },
});

export const adminAPI = {
  // Dashboard data
  getDashboardData: async () => {
    const response = await api.get('/adminAPI/dashboard');
    return response.data;
  },

  // User analytics
  getUserAnalytics: async (timeRange: string = '7d') => {
    const response = await api.get(`/adminAPI/users/analytics?range=${timeRange}`);
    return response.data;
  },

  getUserList: async (page: number = 1, limit: number = 50) => {
    const response = await api.get(`/adminAPI/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Activity monitoring
  getActivityFeed: async (limit: number = 100, type?: string) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (type) params.append('type', type);
    const response = await api.get(`/adminAPI/activity?${params}`);
    return response.data;
  },

  getActivityStats: async (timeRange: string = '24h') => {
    const response = await api.get(`/adminAPI/activity/stats?range=${timeRange}`);
    return response.data;
  },

  // AI metrics
  getAIMetrics: async (timeRange: string = '24h') => {
    const response = await api.get(`/adminAPI/ai/metrics?range=${timeRange}`);
    return response.data;
  },

  getAIProviderStats: async () => {
    const response = await api.get('/adminAPI/ai/providers');
    return response.data;
  },

  // Cost analysis
  getCostAnalysis: async (timeRange: string = '30d') => {
    const response = await api.get(`/adminAPI/costs/analysis?range=${timeRange}`);
    return response.data;
  },

  getCostBreakdown: async () => {
    const response = await api.get('/adminAPI/costs/breakdown');
    return response.data;
  },

  // System health
  getSystemHealth: async () => {
    const response = await api.get('/adminAPI/system/health');
    return response.data;
  },

  getSystemLogs: async (level: string = 'error', limit: number = 100) => {
    const response = await api.get(`/adminAPI/system/logs?level=${level}&limit=${limit}`);
    return response.data;
  },

  // Database stats
  getDatabaseStats: async () => {
    const response = await api.get('/adminAPI/database/stats');
    return response.data;
  },

  // Security
  getSecurityEvents: async (timeRange: string = '24h') => {
    const response = await api.get(`/adminAPI/security/events?range=${timeRange}`);
    return response.data;
  },

  // System controls
  updateFeatureFlag: async (flag: string, enabled: boolean) => {
    const response = await api.post('/adminAPI/system/feature-flags', {
      flag,
      enabled,
    });
    return response.data;
  },

  setMaintenanceMode: async (enabled: boolean, message?: string) => {
    const response = await api.post('/adminAPI/system/maintenance', {
      enabled,
      message,
    });
    return response.data;
  },

  // Real-time data
  getRealtimeStats: async () => {
    const response = await api.get('/adminAPI/realtime/stats');
    return response.data;
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api;