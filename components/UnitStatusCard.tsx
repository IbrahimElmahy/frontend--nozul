import React from 'react';
import { IconProps } from './icons/Icon';

interface UnitStatusCardProps {
  icon: React.ComponentType<IconProps>;
  label: string;
  value: number;
  color: string;
  iconBg: string;
}

const UnitStatusCard: React.FC<UnitStatusCardProps> = ({ icon: Icon, label, value, color, iconBg }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
};

export default UnitStatusCard;
