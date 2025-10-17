import React from 'react';
import { IconProps } from './icons/Icon';

interface UnitStatusCardProps {
  icon: React.ComponentType<IconProps>;
  label: string;
  value: number;
  iconBg: string;
}

const UnitStatusCard: React.FC<UnitStatusCardProps> = ({ icon: Icon, label, value, iconBg }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
      <p className="text-4xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
      <div className="flex flex-col items-end">
        <div className={`w-12 h-12 mb-1 rounded-lg flex items-center justify-center ${iconBg} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
};

export default UnitStatusCard;
