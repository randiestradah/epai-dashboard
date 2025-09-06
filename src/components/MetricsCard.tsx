'use client';

import { LucideIcon, Users, Activity, Zap, DollarSign } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: 'users' | 'activity' | 'zap' | 'dollar-sign';
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  activity: Activity,
  zap: Zap,
  'dollar-sign': DollarSign,
};

export function MetricsCard({ title, value, change, changeLabel, icon }: MetricsCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-indigo-100 rounded-full">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">{change}</span>
        <span className="text-sm text-gray-500 ml-1">{changeLabel}</span>
      </div>
    </div>
  );
}