'use client';

import { useEffect, useState } from 'react';
import { Clock, User, Bot, AlertTriangle, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityEvent {
  id: string;
  type: 'user_signup' | 'ai_request' | 'error' | 'system' | 'login';
  message: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  metadata?: Record<string, unknown>;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock activity data
    const mockActivities: ActivityEvent[] = [
      {
        id: '1',
        type: 'user_signup',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        userEmail: 'user@example.com',
      },
      {
        id: '2',
        type: 'ai_request',
        message: 'AI chat request completed',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        userId: 'user123',
        metadata: { responseTime: 245, provider: 'self_hosted' },
      },
      {
        id: '3',
        type: 'login',
        message: 'User logged in',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userEmail: 'user@example.com',
      },
      {
        id: '4',
        type: 'error',
        message: 'Self-hosted AI server timeout',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        metadata: { error: 'Connection timeout', fallback: 'gemini' },
      },
      {
        id: '5',
        type: 'system',
        message: 'System health check passed',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
      case 'login':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'ai_request':
        return <Bot className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Mock chart data
  const chartData = [
    { time: '00:00', requests: 12 },
    { time: '04:00', requests: 8 },
    { time: '08:00', requests: 25 },
    { time: '12:00', requests: 45 },
    { time: '16:00', requests: 38 },
    { time: '20:00', requests: 22 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Activity Monitor</h1>

      {/* Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Activities</option>
          <option value="user_signup">User Signups</option>
          <option value="login">Logins</option>
          <option value="ai_request">AI Requests</option>
          <option value="error">Errors</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-400">{formatTime(activity.timestamp)}</p>
                  </div>
                  {activity.userEmail && (
                    <p className="text-xs text-gray-500 mt-1">{activity.userEmail}</p>
                  )}
                  {activity.metadata && (
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.type === 'ai_request' && (
                        <span>Response: {activity.metadata.responseTime}ms • Provider: {activity.metadata.provider}</span>
                      )}
                      {activity.type === 'error' && (
                        <span>Error: {activity.metadata.error} • Fallback: {activity.metadata.fallback}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">User Events</p>
              <p className="text-2xl font-bold">
                {activities.filter(a => ['user_signup', 'login'].includes(a.type)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Bot className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">AI Requests</p>
              <p className="text-2xl font-bold">
                {activities.filter(a => a.type === 'ai_request').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-2xl font-bold">
                {activities.filter(a => a.type === 'error').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold">{activities.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}