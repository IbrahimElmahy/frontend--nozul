import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, id, disabled = false }) => {
  return (
    // FIX: Apply disabled styles and cursor
    <label htmlFor={id} className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          // FIX: Pass disabled prop to the input element
          disabled={disabled}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
};

export default Switch;
