'use client';

import { useState, useEffect } from 'react';

interface Provider {
  id: number;
  name: string;
  display_name: string;
  endpoint: string;
  model_name: string;
  is_active: boolean;
  tier: string;
  cost_per_1k_tokens: number;
  priority: number;
  rate_limit: number;
  rate_window: string;
  quality_score: number;
  speed_score: number;
  hasApiKey: boolean;
  modelOptions: Record<string, unknown>;
  supportedFeatures: Record<string, unknown>;
}

interface TestResult {
  success: boolean;
  response?: string;
  error?: string;
  processingTime: number;
  usage?: Record<string, unknown>;
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/ai-providers');
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProvider = async (providerName: string) => {
    setTesting(providerName);
    try {
      const response = await fetch('/api/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerName })
      });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, [providerName]: result }));
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(null);
    }
  };

  const toggleProvider = async (providerName: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/ai-providers/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          providerName, 
          isActive: !currentStatus 
        })
      });
      const result = await response.json();
      if (result.success) {
        fetchProviders();
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const testAllProviders = async () => {
    for (const provider of providers) {
      if (provider.hasApiKey) {
        await testProvider(provider.name);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const getStatusIcon = (provider: Provider) => {
    const result = testResults[provider.name];
    if (!provider.hasApiKey) return '🔑';
    if (!result) return '❓';
    return result.success ? '✅' : '❌';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading AI Providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Provider Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor AI provider status and performance</p>
        </div>
        <button
          onClick={testAllProviders}
          disabled={testing !== null}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center space-x-2"
        >
          <span>{testing ? 'Testing...' : 'Test All Providers'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Providers</h3>
          <p className="text-2xl font-bold">{providers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {providers.filter(p => p.is_active).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Free Tier</h3>
          <p className="text-2xl font-bold text-blue-600">
            {providers.filter(p => p.tier === 'free').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Working</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Object.values(testResults).filter(r => r.success).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => {
              const result = testResults[provider.name];
              return (
                <tr key={provider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getStatusIcon(provider)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {provider.display_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {provider.model_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      provider.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {provider.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(provider.tier)}`}>
                      {provider.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Speed: {provider.speed_score}/5</div>
                    <div>Quality: {provider.quality_score}/5</div>
                    <div className="text-xs text-gray-500">
                      {provider.rate_limit}/{provider.rate_window}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {result ? (
                      <div>
                        <div className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success ? 'Success' : 'Failed'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.processingTime}ms
                        </div>
                        {result.error && (
                          <div className="text-xs text-red-500 truncate max-w-xs">
                            {result.error}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not tested</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => testProvider(provider.name)}
                      disabled={testing === provider.name || !provider.hasApiKey}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                    >
                      {testing === provider.name ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => toggleProvider(provider.name, provider.is_active)}
                      className={`${
                        provider.is_active 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {provider.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}