'use client';

import { useEffect, useState } from 'react';
import { MetricsCard } from '@/components/MetricsCard';
import { SystemHealth } from '@/components/SystemHealth';
import { UserAnalytics } from '@/components/UserAnalytics';
import { AIMetrics } from '@/components/AIMetrics';
import { CostAnalysis } from '@/components/CostAnalysis';
import { RecentActivity } from '@/components/RecentActivity';
import { adminAPI } from '@/lib/api';

interface DashboardData {
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

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAPI.getDashboardData();
        setData(response);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-600">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring and analytics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Users"
          value={data.users.total.toLocaleString()}
          change={`+${data.users.new}`}
          changeLabel="new today"
          icon="users"
        />
        <MetricsCard
          title="Active Users"
          value={data.users.active.toLocaleString()}
          change={`${((data.users.active / data.users.total) * 100).toFixed(1)}%`}
          changeLabel="of total"
          icon="activity"
        />
        <MetricsCard
          title="AI Requests"
          value={data.ai.requests.toLocaleString()}
          change={`${data.ai.avgResponseTime}ms`}
          changeLabel="avg response"
          icon="zap"
        />
        <MetricsCard
          title="Monthly Cost"
          value={`$${data.costs.total.toFixed(0)}`}
          change={`${((data.costs.selfHosted / data.costs.total) * 100).toFixed(0)}%`}
          changeLabel="self-hosted"
          icon="dollar-sign"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealth />
        <UserAnalytics />
        <AIMetrics />
        <CostAnalysis />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}