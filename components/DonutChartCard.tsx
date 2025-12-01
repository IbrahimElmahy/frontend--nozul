import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { DonutChartData } from '../types';

interface DonutChartCardProps {
  title: string;
  data: DonutChartData[];
  centerLabel: string;
  centerValue: number | string;
  total: number;
  stats?: { label: string, value: number | string }[];
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({ title, data, centerLabel, centerValue, total, stats }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const displayLabel = activeItem ? activeItem.name : centerLabel;
  const displayValue = activeItem ? activeItem.value : centerValue;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      {stats && (
        <div className="grid grid-cols-3 text-center mb-4 border-b pb-4 dark:border-slate-700">
          {stats.map((stat, index) => (
            <div key={index} className="px-2">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-gray-500 dark:text-gray-400">{displayLabel}</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">{displayValue}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 space-x-reverse mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChartCard;