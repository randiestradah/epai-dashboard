'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminAPI } from '@/lib/api';

interface AIMetricsData {
  totalRequests: number;
  avgResponseTime: number;
  providerBreakdown: Record<string, number>;
  responseTimeChart: Array<{ time: number; responseTime: number }>;
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];

export function AIMetrics() {
  const [data, setData] = useState<AIMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await adminAPI.getAIMetrics('24h');
        setData(metrics);
      } catch (error) {
        console.error('Failed to fetch AI metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Metrics</h3>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const providerData = data ? Object.entries(data.providerBreakdown).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value,
  })) : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Metrics</h3>
        <div className="text-sm text-gray-600">
          Avg: <span className="font-medium">{data?.avgResponseTime.toFixed(0)}ms</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Provider Usage</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  dataKey="value"
                >
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Response Times</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.responseTimeChart.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responseTime" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Total requests: <span className="font-medium">{data?.totalRequests.toLocaleString()}</span></span>
        <span>Last 24h</span>
      </div>
    </div>
  );
}