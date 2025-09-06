'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '@/lib/api';

interface UserAnalyticsData {
  totalUsers: number;
  usersByDay: Record<string, number>;
  growthRate: number;
}

export function UserAnalytics() {
  const [data, setData] = useState<UserAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await adminAPI.getUserAnalytics('7d');
        setData(analytics);
      } catch (error) {
        console.error('Failed to fetch user analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = data ? Object.entries(data.usersByDay).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: count,
  })) : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">User Analytics</h3>
        <div className="text-sm text-gray-600">
          Growth: <span className="text-green-600 font-medium">+{data?.growthRate}%</span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ fill: '#4f46e5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Total users: <span className="font-medium">{data?.totalUsers.toLocaleString()}</span>
      </div>
    </div>
  );
}