import React from 'react';
import { IconProps } from './icons/Icon';

interface StatCardProps {
  title: string;
  value: number | string;
  color: 'orange' | 'yellow' | 'blue' | 'green';
  icon: React.ComponentType<IconProps>;
}

const colorClasses = {
    orange: 'bg-orange-400',
    yellow: 'bg-amber-400',
    blue: 'bg-cyan-400',
    green: 'bg-teal-400',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  );
};

export default StatCard;