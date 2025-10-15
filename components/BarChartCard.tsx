import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface BarChartCardProps {
  title: string;
  data: ChartData[];
  barColor: string;
  stats?: {label: string, value: number}[];
}

const BarChartCard: React.FC<BarChartCardProps> = ({ title, data, barColor, stats }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {stats && (
            <div className="flex space-x-4 space-x-reverse text-right">
                {stats.map((stat, index) => (
                    <div key={index}>
                        <p className="font-bold text-slate-700">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
      <div className="flex-grow w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false}/>
            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{
                borderRadius: '0.5rem',
                borderColor: '#e5e7eb',
                fontSize: '0.875rem'
            }}/>
            <Bar dataKey="value" fill={barColor} barSize={10} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
