
import React, { useState, useRef, useContext } from 'react';
import CogIcon from './icons-redesign/CogIcon';
import { ThemeSettings, ColorSchemeName } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckIcon from './icons-redesign/CheckIcon';
import Switch from './Switch';

interface SettingsCogProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings | ((prev: ThemeSettings) => ThemeSettings)) => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const { language } = useContext(LanguageContext);
    return (
        <div className="mb-8">
            <h5 className={`font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider ${language === 'ar' ? 'text-right' : 'text-left'}`}>{title}</h5>
            {children}
        </div>
    );
};

const ToggleGroup: React.FC<{ options: { value: string; label: string }[]; value: string; onChange: (val: any) => void }> = ({ options, value, onChange }) => {
    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 py-2 px-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${value === option.value
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 ring-1 ring-black/5 dark:ring-white/5'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

const SettingsCog: React.FC<SettingsCogProps> = ({ settings, setSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const { t, language } = useContext(LanguageContext);

    const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const colors: { id: ColorSchemeName; color: string; pair: string }[] = [
        { id: 'teal', color: '#14b8a6', pair: '#0f766e' },
        { id: 'rose', color: '#f43f5e', pair: '#881337' },
        { id: 'violet', color: '#8b5cf6', pair: '#4c1d95' },
        { id: 'blue', color: '#3b82f6', pair: '#1e3a8a' },
        { id: 'sky', color: '#0ea5e9', pair: '#0c4a6e' },
        { id: 'emerald', color: '#16b89b', pair: '#0f766e' }, // Updated preview color to match new Misty Forest theme
        { id: 'cyan', color: '#06b6d4', pair: '#164e63' },
        { id: 'indigo', color: '#6366f1', pair: '#312e81' },
        { id: 'amber', color: '#f59e0b', pair: '#78350f' },
        { id: 'fuchsia', color: '#d946ef', pair: '#701a75' },
        { id: 'lime', color: '#84cc16', pair: '#3f6212' },
        { id: 'slate', color: '#64748b', pair: '#0f172a' },
        { id: 'orange', color: '#f97316', pair: '#7c2d12' },
        { id: 'pink', color: '#ec4899', pair: '#831843' },
    ];

    const packages = [
        {
            id: 'seaBreeze',
            color: 'cyan',
            mode: 'light',
            sidebar: 'gradient',
            topbar: 'light',
            card: 'soft',
            bgAnim: true,
            previewGradient: 'from-cyan-400 to-teal-300'
        },
        {
            id: 'citySunset',
            color: 'orange',
            mode: 'light',
            sidebar: 'brand',
            topbar: 'light',
            card: 'solid',
            bgAnim: true,
            previewGradient: 'from-orange-400 to-rose-400'
        },
        {
            id: 'mistyForests',
            color: 'emerald',
            mode: 'light',
            sidebar: 'gradient', // Changed to gradient for luxury feel
            topbar: 'light',
            card: 'glass', // Glass effect for calming/misty vibe
            bgAnim: true,
            previewGradient: 'from-emerald-600 to-cyan-700' // Updated gradient
        },
        {
            id: 'purpleCity',
            color: 'fuchsia',
            mode: 'light',
            sidebar: 'gradient',
            topbar: 'brand',
            card: 'glass',
            bgAnim: true,
            previewGradient: 'from-violet-500 to-fuchsia-500'
        },
        {
            id: 'cityNights',
            color: 'indigo',
            mode: 'dark',
            sidebar: 'dark',
            topbar: 'dark',
            card: 'soft',
            bgAnim: true,
            previewGradient: 'from-blue-800 to-indigo-900'
        },
        {
            id: 'royalTurquoise',
            color: 'teal',
            mode: 'light',
            sidebar: 'brand', // Brand sidebar for complete look but avoiding dark gradient
            topbar: 'brand', // Brand topbar for complete look
            card: 'glass',
            bgAnim: true,
            previewGradient: 'from-teal-300 to-cyan-300' // Lighter preview
        },
        {
            id: 'modernDesert',
            color: 'amber',
            mode: 'light',
            sidebar: 'light',
            topbar: 'light',
            card: 'solid',
            bgAnim: true,
            previewGradient: 'from-amber-200 to-orange-100'
        },
    ];

    const applyPackage = (pkg: typeof packages[0]) => {
        setSettings(prev => ({
            ...prev,
            themeColor: pkg.color as ColorSchemeName,
            colorScheme: pkg.mode as 'light' | 'dark',
            sidebarColor: pkg.sidebar as any,
            topbarColor: pkg.topbar as any,
            cardStyle: pkg.card as any,
            animatedBackground: pkg.bgAnim
        }));
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 z-50 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:rotate-90 ${language === 'ar' ? 'left-6' : 'right-6'}`}
                aria-label="Open settings"
            >
                <CogIcon className="w-6 h-6" />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div
                ref={panelRef}
                className={`fixed top-0 h-full w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : (language === 'ar' ? '-translate-x-full' : 'translate-x-full')
                    } ${language === 'ar' ? 'left-0' : 'right-0'}`}
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('themeCustomizer.title')}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('themeCustomizer.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Packages */}
                    <SettingsSection title={t('themeCustomizer.packagesTitle')}>
                        <div className="grid grid-cols-1 gap-3">
                            {packages.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => applyPackage(pkg)}
                                    className={`relative group overflow-hidden rounded-xl border transition-all duration-200 text-right ${settings.themeColor === pkg.color && settings.colorScheme === pkg.mode && settings.sidebarColor === pkg.sidebar ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                >
                                    <div className={`h-16 bg-gradient-to-r ${pkg.previewGradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="p-3 bg-white dark:bg-slate-800">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t(`themeCustomizer.packages.${pkg.id}` as any)}</h3>
                                            {settings.themeColor === pkg.color && settings.colorScheme === pkg.mode && settings.sidebarColor === pkg.sidebar && (
                                                <CheckIcon className="w-4 h-4 text-blue-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t(`themeCustomizer.packages.${pkg.id}Desc` as any)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </SettingsSection>

                    {/* Custom Colors (Moved up) */}
                    <SettingsSection title={t('settings.colorScheme')}>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => updateSetting('themeColor', c.id)}
                                    className={`relative w-full h-10 rounded-full overflow-hidden transition-transform shadow-sm ${settings.themeColor === c.id ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-500 dark:ring-offset-slate-900 scale-110' : 'hover:scale-105'}`}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            background: `linear-gradient(135deg, ${c.color} 50%, ${c.pair} 50%)`
                                        }}
                                    ></div>
                                    {settings.themeColor === c.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/30 rounded-full p-0.5">
                                                <CheckIcon className="w-4 h-4 text-white drop-shadow-md" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </SettingsSection>

                    {/* Dashboard View */}
                    <SettingsSection title={t('themeCustomizer.dashboardView')}>
                        <ToggleGroup
                            options={[
                                { value: 'full', label: t('themeCustomizer.fullWidth') },
                                { value: 'boxed', label: t('themeCustomizer.boxed') },
                            ]}
                            value={settings.layoutWidth}
                            onChange={(val) => updateSetting('layoutWidth', val)}
                        />
                    </SettingsSection>

                    {/* Color Mode */}
                    <SettingsSection title={t('themeCustomizer.colorMode')}>
                        <ToggleGroup
                            options={[
                                { value: 'light', label: t('themeCustomizer.lightMode') },
                                { value: 'dark', label: t('themeCustomizer.darkMode') },
                            ]}
                            value={settings.colorScheme}
                            onChange={(val) => updateSetting('colorScheme', val)}
                        />
                    </SettingsSection>

                    {/* Header Color */}
                    <SettingsSection title={t('themeCustomizer.headerColor')}>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'light', label: t('themeCustomizer.light'), class: 'bg-white border-slate-200 text-slate-800' },
                                { value: 'dark', label: t('themeCustomizer.dark'), class: 'bg-slate-800 border-slate-700 text-white' },
                                { value: 'brand', label: t('themeCustomizer.brandColors'), class: 'bg-blue-600 border-blue-600 text-white' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateSetting('topbarColor', opt.value as any)}
                                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${opt.class} ${settings.topbarColor === opt.value ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-slate-900' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </SettingsSection>

                    {/* Sidebar Color */}
                    <SettingsSection title={t('themeCustomizer.sidebarColors')}>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'light', label: t('themeCustomizer.neutralLight'), class: 'bg-white border-slate-200 text-slate-800' },
                                { value: 'dark', label: t('themeCustomizer.contrastDark'), class: 'bg-slate-800 border-slate-700 text-white' },
                                { value: 'brand', label: t('themeCustomizer.brandColors'), class: 'bg-blue-600 border-blue-600 text-white' },
                                { value: 'gradient', label: t('themeCustomizer.vividGradient'), class: 'bg-gradient-to-br from-blue-600 to-blue-900 text-white border-transparent' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateSetting('sidebarColor', opt.value as any)}
                                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${opt.class} ${settings.sidebarColor === opt.value ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-slate-900' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </SettingsSection>

                    {/* Sidebar Density */}
                    <SettingsSection title={t('themeCustomizer.sidebarDensity')}>
                        <ToggleGroup
                            options={[
                                { value: 'default', label: t('themeCustomizer.standard') },
                                { value: 'compact', label: t('themeCustomizer.balanced') },
                                { value: 'condensed', label: t('themeCustomizer.compact') },
                            ]}
                            value={settings.sidebarSize}
                            onChange={(val) => updateSetting('sidebarSize', val)}
                        />
                    </SettingsSection>

                    {/* Quick Options */}
                    <SettingsSection title={t('themeCustomizer.quickOptions')}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{t('themeCustomizer.autoCollapse')}</span>
                                <Switch id="autoCollapse" checked={settings.sidebarSize === 'condensed'} onChange={(c) => updateSetting('sidebarSize', c ? 'condensed' : 'default')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{t('themeCustomizer.pinSidebar')}</span>
                                <Switch id="pinSidebar" checked={!!settings.isSidebarFixed} onChange={(c) => updateSetting('isSidebarFixed', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{t('themeCustomizer.showUserCard')}</span>
                                <Switch id="userInfo" checked={settings.showUserInfo} onChange={(c) => updateSetting('showUserInfo', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{t('themeCustomizer.animatedBackground')}</span>
                                <Switch id="animBg" checked={!!settings.animatedBackground} onChange={(c) => updateSetting('animatedBackground', c)} />
                            </div>
                            {/* Card Style */}
                            <div className="pt-2">
                                <p className="text-xs text-slate-500 mb-2">{t('themeCustomizer.cardStyle')}</p>
                                <ToggleGroup
                                    options={[
                                        { value: 'solid', label: t('themeCustomizer.solid') },
                                        { value: 'soft', label: t('themeCustomizer.soft') },
                                        { value: 'glass', label: t('themeCustomizer.glass') },
                                    ]}
                                    value={settings.cardStyle || 'soft'}
                                    onChange={(val) => updateSetting('cardStyle', val)}
                                />
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Reset */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setSettings({
                                ...settings,
                                colorScheme: 'light',
                                sidebarColor: 'brand',
                                topbarColor: 'light',
                                themeColor: 'blue',
                                layoutWidth: 'full',
                                sidebarSize: 'condensed',
                                showUserInfo: false,
                                cardStyle: 'soft',
                                animatedBackground: false
                            })}
                            className="w-full py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Reset Settings
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsCog;
