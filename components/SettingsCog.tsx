import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import CogIcon from './icons-redesign/CogIcon';
import { ThemeSettings } from '../App';

interface SettingsCogProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings | ((prev: ThemeSettings) => ThemeSettings)) => void;
}

interface SettingsRadioOptionProps {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SettingsRadioOption: React.FC<SettingsRadioOptionProps> = ({ name, value, label, checked, onChange }) => (
    <div className="flex-1">
        <input type="radio" id={`${name}-${value}`} name={name} value={value} checked={checked} onChange={onChange} className="sr-only peer" />
        <label
            htmlFor={`${name}-${value}`}
            className={`flex items-center justify-center cursor-pointer min-h-[3.25rem] w-full p-2 text-center text-sm rounded-lg border-2 transition-colors duration-200
            peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-500/10 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 font-semibold
            bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600
            `}
        >
           {checked && (<span>{label}</span>)}
        </label>
    </div>
);


const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h5 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-3 text-right">{title}</h5>
        {children}
    </div>
);


const SettingsCog: React.FC<SettingsCogProps> = ({ settings, setSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSettingChange = (key: keyof ThemeSettings) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({...prev, [key]: value}));
    };

    const handleBooleanSettingChange = (key: keyof ThemeSettings) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === 'true';
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <div
                ref={panelRef}
                className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-2'}`}
            >
                <div className="absolute bottom-full left-0 mb-3 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 flex flex-col max-h-[80vh]">
                    <div className="text-right p-4 border-b dark:border-slate-700 flex-shrink-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">إعدادات شكل النظام</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">التخصيص مخطط الألوان العام ، قائمة الشريط الجانبي ، إلخ.</p>
                    </div>

                    <div className="p-4 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <SettingsSection title="نظام الألوان">
                            <div className="flex gap-2">
                                <SettingsRadioOption name="colorScheme" value="light" label="النظام الفاتح" checked={settings.colorScheme === 'light'} onChange={handleSettingChange('colorScheme')} />
                                <SettingsRadioOption name="colorScheme" value="dark" label="النظام الليلي" checked={settings.colorScheme === 'dark'} onChange={handleSettingChange('colorScheme')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="النطاق">
                            <div className="flex gap-2">
                                <SettingsRadioOption name="layoutWidth" value="full" label="نطاق كامل" checked={settings.layoutWidth === 'full'} onChange={handleSettingChange('layoutWidth')} />
                                <SettingsRadioOption name="layoutWidth" value="boxed" label="نطاق صندوق" checked={settings.layoutWidth === 'boxed'} onChange={handleSettingChange('layoutWidth')} />
                            </div>
                        </SettingsSection>
                        
                        <SettingsSection title="لون الشريط الجانبي الأيسر">
                            <div className="grid grid-cols-2 gap-2">
                                <SettingsRadioOption name="sidebarColor" value="light" label="فاتح" checked={settings.sidebarColor === 'light'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="dark" label="ليلي" checked={settings.sidebarColor === 'dark'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="brand" label="ماركة" checked={settings.sidebarColor === 'brand'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="gradient" label="انحدار" checked={settings.sidebarColor === 'gradient'} onChange={handleSettingChange('sidebarColor')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="حجم الشريط الجانبي الأيسر">
                            <div className="flex gap-2">
                                <SettingsRadioOption name="sidebarSize" value="default" label="افتراضي" checked={settings.sidebarSize === 'default'} onChange={handleSettingChange('sidebarSize')} />
                                <SettingsRadioOption name="sidebarSize" value="compact" label="صغير" checked={settings.sidebarSize === 'compact'} onChange={handleSettingChange('sidebarSize')} />
                                <SettingsRadioOption name="sidebarSize" value="condensed" label="صغير جدًا" checked={settings.sidebarSize === 'condensed'} onChange={handleSettingChange('sidebarSize')} />
                            </div>
                        </SettingsSection>
                        
                        <SettingsSection title="الشريط العلوي">
                            <div className="flex gap-2">
                                <SettingsRadioOption name="topbarColor" value="light" label="فاتح" checked={settings.topbarColor === 'light'} onChange={handleSettingChange('topbarColor')} />
                                <SettingsRadioOption name="topbarColor" value="dark" label="ليلي" checked={settings.topbarColor === 'dark'} onChange={handleSettingChange('topbarColor')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="معلومات مستخدم في الشريط الجانبي">
                             <div className="flex gap-2">
                                <SettingsRadioOption name="showUserInfo" value="true" label="تفعيل" checked={settings.showUserInfo === true} onChange={handleBooleanSettingChange('showUserInfo')} />
                                <SettingsRadioOption name="showUserInfo" value="false" label="إلغاء التفعيل" checked={settings.showUserInfo === false} onChange={handleBooleanSettingChange('showUserInfo')} />
                            </div>
                        </SettingsSection>
                    </div>
                </div>
            </div>

            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Open settings"
                aria-expanded={isOpen}
            >
                <CogIcon className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
        </div>
    );
};

export default SettingsCog;