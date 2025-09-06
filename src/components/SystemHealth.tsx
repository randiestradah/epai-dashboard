'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';

interface HealthStatus {
  firebase: string;
  selfHostedAI: string;
  database: string;
  overall: string;
  uptime: number;
  lastCheck: string;
}

export function SystemHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await adminAPI.getSystemHealth();
        setHealth(data);
      } catch (error) {
        console.error('Failed to fetch system health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">System Health</h3>
      
      {health && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Firebase</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(health.firebase)}
              <span className="text-sm capitalize">{health.firebase}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Self-hosted AI</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(health.selfHostedAI)}
              <span className="text-sm capitalize">{health.selfHostedAI}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(health.database)}
              <span className="text-sm capitalize">{health.database}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm text-green-600">{health.uptime}%</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last check: {new Date(health.lastCheck).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}