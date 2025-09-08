'use client';

import { useState, useEffect } from 'react';

export default function AIMetricsPage() {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    activeProviders: 0,
    costToday: 0
  });

  useEffect(() => {
    // Mock data - replace with real API calls
    setMetrics({
      totalRequests: 15420,
      successRate: 98.5,
      avgResponseTime: 850,
      activeProviders: 8,
      costToday: 12.45
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Metrics</h1>
        <p className="text-gray-600 mt-2">Monitor AI usage, performance, and costs</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.totalRequests.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">↗ +12% from yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.successRate}%</p>
          <p className="text-sm text-green-600 mt-1">↗ +0.3% from yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
          <p className="text-3xl font-bold text-yellow-600">{metrics.avgResponseTime}ms</p>
          <p className="text-sm text-red-600 mt-1">↗ +50ms from yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Providers</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.activeProviders}</p>
          <p className="text-sm text-gray-600 mt-1">8 of 9 total</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Cost Today</h3>
          <p className="text-3xl font-bold text-red-600">${metrics.costToday}</p>
          <p className="text-sm text-green-600 mt-1">↘ -15% from yesterday</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Request Volume (24h)</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📊 Chart: Requests over time
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Provider Performance</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📈 Chart: Response times by provider
          </div>
        </div>
      </div>

      {/* Provider Usage */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Provider Usage Today</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { name: 'Groq Llama 3.1', requests: 4520, percentage: 29.3, cost: 0.00 },
              { name: 'Google Gemini', requests: 3890, percentage: 25.2, cost: 0.00 },
              { name: 'DeepSeek Chat', requests: 3210, percentage: 20.8, cost: 0.00 },
              { name: 'Alibaba Qwen', requests: 2100, percentage: 13.6, cost: 0.00 },
              { name: 'Moonshot Kimi', requests: 1200, percentage: 7.8, cost: 0.00 },
              { name: 'Mistral AI', requests: 350, percentage: 2.3, cost: 8.75 },
              { name: 'xAI Grok', requests: 100, percentage: 0.6, cost: 3.30 },
              { name: 'AWS Bedrock', requests: 50, percentage: 0.3, cost: 0.40 }
            ].map((provider, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{provider.name}</span>
                    <span className="text-sm text-gray-500">{provider.requests.toLocaleString()} requests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${provider.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-900">${provider.cost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{provider.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}