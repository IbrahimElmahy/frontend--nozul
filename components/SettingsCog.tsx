import React, { useState, useRef, useEffect, ChangeEvent, useContext } from 'react';
import CogIcon from './icons-redesign/CogIcon';
import { ThemeSettings } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';

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
            bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200
            `}
        >
           <span>{label}</span>
        </label>
    </div>
);


const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const { language } = useContext(LanguageContext);
    return (
        <div>
            <h5 className={`font-medium text-sm text-slate-500 dark:text-slate-400 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{title}</h5>
            {children}
        </div>
    );
};


const SettingsCog: React.FC<SettingsCogProps> = ({ settings, setSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { t, language } = useContext(LanguageContext);

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
    
    const panelPositionClass = language === 'ar' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';
    const panelOriginClass = language === 'ar' ? 'origin-bottom-left' : 'origin-bottom-right';

    return (
        <div className={`fixed bottom-4 sm:bottom-6 z-50 ${panelPositionClass}`}>
            <div
                ref={panelRef}
                className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-2'} ${panelOriginClass}`}
            >
                <div className={`absolute bottom-full mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 flex flex-col max-h-[80vh] ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                    <div className={`p-4 border-b dark:border-slate-700 flex-shrink-0 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{t('settings.title')}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.subtitle')}</p>
                    </div>

                    <div className="p-4 space-y-6 overflow-y-auto">
                        <SettingsSection title={t('settings.colorScheme')}>
                            <div className="flex gap-2">
                                <SettingsRadioOption name="colorScheme" value="light" label={t('settings.lightScheme')} checked={settings.colorScheme === 'light'} onChange={handleSettingChange('colorScheme')} />
                                <SettingsRadioOption name="colorScheme" value="dark" label={t('settings.darkScheme')} checked={settings.colorScheme === 'dark'} onChange={handleSettingChange('colorScheme')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title={t('settings.layoutWidth')}>
                            <div className="flex gap-2">
                                <SettingsRadioOption name="layoutWidth" value="full" label={t('settings.fullWidth')} checked={settings.layoutWidth === 'full'} onChange={handleSettingChange('layoutWidth')} />
                                <SettingsRadioOption name="layoutWidth" value="boxed" label={t('settings.boxedWidth')} checked={settings.layoutWidth === 'boxed'} onChange={handleSettingChange('layoutWidth')} />
                            </div>
                        </SettingsSection>
                        
                        <SettingsSection title={t('settings.sidebarColor')}>
                            <div className="grid grid-cols-2 gap-2">
                                <SettingsRadioOption name="sidebarColor" value="light" label={t('settings.light')} checked={settings.sidebarColor === 'light'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="dark" label={t('settings.dark')} checked={settings.sidebarColor === 'dark'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="brand" label={t('settings.brand')} checked={settings.sidebarColor === 'brand'} onChange={handleSettingChange('sidebarColor')} />
                                <SettingsRadioOption name="sidebarColor" value="gradient" label={t('settings.gradient')} checked={settings.sidebarColor === 'gradient'} onChange={handleSettingChange('sidebarColor')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title={t('settings.sidebarSize')}>
                            <div className="flex gap-2">
                                <SettingsRadioOption name="sidebarSize" value="default" label={t('settings.default')} checked={settings.sidebarSize === 'default'} onChange={handleSettingChange('sidebarSize')} />
                                <SettingsRadioOption name="sidebarSize" value="compact" label={t('settings.compact')} checked={settings.sidebarSize === 'compact'} onChange={handleSettingChange('sidebarSize')} />
                                <SettingsRadioOption name="sidebarSize" value="condensed" label={t('settings.condensed')} checked={settings.sidebarSize === 'condensed'} onChange={handleSettingChange('sidebarSize')} />
                            </div>
                        </SettingsSection>
                        
                        <SettingsSection title={t('settings.topbar')}>
                            <div className="flex gap-2">
                                <SettingsRadioOption name="topbarColor" value="light" label={t('settings.light')} checked={settings.topbarColor === 'light'} onChange={handleSettingChange('topbarColor')} />
                                <SettingsRadioOption name="topbarColor" value="dark" label={t('settings.dark')} checked={settings.topbarColor === 'dark'} onChange={handleSettingChange('topbarColor')} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title={t('settings.userInfo')}>
                             <div className="flex gap-2">
                                <SettingsRadioOption name="showUserInfo" value="true" label={t('settings.enable')} checked={settings.showUserInfo === true} onChange={handleBooleanSettingChange('showUserInfo')} />
                                <SettingsRadioOption name="showUserInfo" value="false" label={t('settings.disable')} checked={settings.showUserInfo === false} onChange={handleBooleanSettingChange('showUserInfo')} />
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
