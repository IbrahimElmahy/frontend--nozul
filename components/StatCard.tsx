import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  color: 'orange' | 'cyan' | 'teal' | 'purple';
}

const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    teal: 'bg-teal-100 text-teal-600',
    purple: 'bg-purple-100 text-purple-600',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        {/* Placeholder for icon */}
      </div>
    </div>
  );
};

export default StatCard;
