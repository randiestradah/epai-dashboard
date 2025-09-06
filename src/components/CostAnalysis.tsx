'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { adminAPI } from '@/lib/api';

interface CostData {
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

const COLORS = ['#4f46e5', '#06b6d4'];

export function CostAnalysis() {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const costs = await adminAPI.getCostAnalysis('30d');
        setData(costs);
      } catch (error) {
        console.error('Failed to fetch cost analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = data ? [
    { name: 'Self-hosted', value: data.monthly.selfHosted },
    { name: 'Cloud API', value: data.monthly.cloudAPI },
  ] : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Cost Analysis</h3>
        <div className="text-sm text-gray-600">
          Monthly: <span className="font-medium">${data?.monthly.total.toFixed(0)}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex-1">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={55}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Self-hosted</span>
            </div>
            <span className="text-sm font-medium">${data?.monthly.selfHosted}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Cloud API</span>
            </div>
            <span className="text-sm font-medium">${data?.monthly.cloudAPI.toFixed(0)}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {data?.savings.percentage}% Saved
              </div>
              <div className="text-xs text-gray-500">
                vs cloud-only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}