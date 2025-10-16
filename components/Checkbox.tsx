import React from 'react';
import CheckIcon from './icons-redesign/CheckIcon';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => {
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="relative flex items-center">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-colors
                    ${checked 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 peer-hover:border-slate-400 dark:peer-hover:border-slate-400'
                    }`}
                >
                    {checked && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
            </div>
            <span className="mx-2">{label}</span>
        </label>
    );
};

export default Checkbox;
