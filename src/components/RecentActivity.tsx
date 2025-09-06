'use client';

import { useEffect, useState } from 'react';
import { Clock, User, Bot, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'user_signup' | 'ai_request' | 'error' | 'system';
  message: string;
  timestamp: string;
  user?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time activity feed
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'user_signup',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user: 'user@example.com',
      },
      {
        id: '2',
        type: 'ai_request',
        message: 'AI request completed in 245ms',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'system',
        message: 'System health check passed',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'ai_request',
        message: 'Fallback to Gemini API (self-hosted unavailable)',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        type: 'user_signup',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        user: 'another@example.com',
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              {activity.user && (
                <p className="text-xs text-gray-500">{activity.user}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View all activity →
        </button>
      </div>
    </div>
  );
}