import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface BarChartCardProps {
  title: string;
  data: ChartData[];
  barColor: string;
  stats?: { label: string, value: number }[];
}

const BarChartCard: React.FC<BarChartCardProps> = ({ title, data, barColor, stats }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tickColor = isDarkMode ? '#94a3b8' : '#6b7280';
  const gridColor = isDarkMode ? '#334155' : '#e5e7eb';


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        {stats && (
          <div className="flex space-x-4 space-x-reverse text-right">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="font-bold text-slate-700 dark:text-slate-300">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tickColor }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(239, 246, 255, 0.5)' }}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#334155' : '#e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              labelStyle={{ color: isDarkMode ? '#cbd5e1' : '#1f2937' }}
            />
            <Bar dataKey="value" fill={barColor} barSize={10} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;