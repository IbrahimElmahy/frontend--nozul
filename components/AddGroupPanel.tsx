import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Unit, CleaningStatus, CoolingType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import Switch from './Switch';
import Checkbox from './Checkbox';

interface AddGroupPanelProps {
    template: Unit; // The base template for new rooms
    isOpen: boolean;
    onClose: () => void;
    onSave: (newUnits: Unit[]) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);

const AddGroupPanel: React.FC<AddGroupPanelProps> = ({ template, isOpen, onClose, onSave }) => {
    const { t, language } = useContext(LanguageContext);
    const [fromNumber, setFromNumber] = useState(101);
    const [toNumber, setToNumber] = useState(110);
    const [templateUnit, setTemplateUnit] = useState<Unit>(template);
    const [error, setError] = useState<string>('');

    const commonFeatures = useMemo(() => Object.keys(template.features.common), [template]);
    const specialFeatures = useMemo(() => Object.keys(template.features.special), [template]);

    useEffect(() => {
        // Reset form when panel is opened with a new template
        setTemplateUnit(JSON.parse(JSON.stringify(template)));
        setFromNumber(101);
        setToNumber(110);
        setError('');
    }, [isOpen, template]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTemplateUnit({ ...templateUnit, [name]: value });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTemplateUnit({ ...templateUnit, [name]: parseInt(value, 10) || 0 });
    };
    
    const handleFeatureChange = (category: 'common' | 'special', key: string, checked: boolean) => {
         setTemplateUnit({
            ...templateUnit,
            features: {
                ...templateUnit.features,
                [category]: {
                    ...templateUnit.features[category],
                    [key]: checked
                }
            }
         });
    }

    const handleGenerateRooms = () => {
        const from = fromNumber;
        const to = toNumber;

        if (from > to) {
            setError(t('units.errorInvalidRange'));
            return;
        }
        setError('');

        const newUnits: Unit[] = [];
        for (let i = from; i <= to; i++) {
            const newUnit: Unit = {
                ...templateUnit,
                id: `new-${Date.now()}-${i}`, // Simple unique ID
                unitNumber: i.toString(),
                unitName: i.toString(), // Default name to number, user can change later
            };
            newUnits.push(newUnit);
        }
        onSave(newUnits);
    };
    
    const labelAlignClass = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputBaseClass = `w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200`;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-group-title"
        >
            <div
                className="fixed inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className={`relative w-full max-w-6xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <h2 id="add-group-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('units.addGroupOfRoomsTitle')}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                             {/* Left Column: Numbering and Basic Info */}
                            <div>
                                <Section title={t('units.roomNumbering')}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="fromNumber" className={labelAlignClass}>{t('units.fromRoomNumber')}</label>
                                            <input type="number" id="fromNumber" name="fromNumber" value={fromNumber} onChange={(e) => setFromNumber(parseInt(e.target.value, 10) || 0)} className={inputBaseClass} min="1" />
                                        </div>
                                        <div>
                                            <label htmlFor="toNumber" className={labelAlignClass}>{t('units.toRoomNumber')}</label>
                                            <input type="number" id="toNumber" name="toNumber" value={toNumber} onChange={(e) => setToNumber(parseInt(e.target.value, 10) || 0)} className={inputBaseClass} min="1" />
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                </Section>

                                <Section title={t('units.roomTemplate')}>
                                    <div className="space-y-4">
                                         <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="unitType" className={labelAlignClass}>{t('units.roomType')}</label>
                                                <select id="unitType" name="unitType" value={templateUnit.unitType} onChange={handleInputChange} className={inputBaseClass}>
                                                    <option value="غرفة مفردة">{t('units.singleRoom')}</option>
                                                    <option value="غرفة مزدوجة">{t('units.doubleRoom')}</option>
                                                    <option value="جناح">{t('units.suite')}</option>
                                                </select>
                                            </div>
                                             <div>
                                                <label htmlFor="cleaningStatus" className={labelAlignClass}>{t('units.cleaning')}</label>
                                                <select id="cleaningStatus" name="cleaningStatus" value={templateUnit.cleaningStatus} onChange={(e) => setTemplateUnit({...templateUnit, cleaningStatus: e.target.value as CleaningStatus})} className={inputBaseClass}>
                                                    <option value="clean">{t('units.clean')}</option>
                                                    <option value="not-clean">{t('units.notClean')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('units.available')}</span>
                                            <Switch id="isAvailableTemplate" checked={templateUnit.isAvailable} onChange={(c) => setTemplateUnit({...templateUnit, isAvailable: c})} />
                                        </div>
                                    </div>
                                </Section>
                                
                                 <Section title={t('units.unitDetails')}>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {(['floor', 'rooms', 'bathrooms', 'beds', 'doubleBeds', 'wardrobes', 'tvs'] as const).map(key => (
                                            <div key={key}>
                                                <label htmlFor={`template-${key}`} className={labelAlignClass}>{t(`units.${key}` as any)}</label>
                                                <input type="number" id={`template-${key}`} name={key} value={templateUnit[key]} onChange={handleNumberChange} className={inputBaseClass} min="0" />
                                            </div>
                                            ))}
                                            <div>
                                            <label htmlFor="template-coolingType" className={labelAlignClass}>{t('units.coolingType')}</label>
                                            <select id="template-coolingType" name="coolingType" value={templateUnit.coolingType} onChange={(e) => setTemplateUnit({...templateUnit, coolingType: e.target.value as CoolingType})} className={inputBaseClass}>
                                                <option value="">{t('units.selectCoolingType')}</option>
                                                <option value="central">{t('units.central')}</option>
                                                <option value="split">{t('units.split')}</option>
                                                <option value="window">{t('units.window')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </Section>
                            </div>

                            {/* Right Column: Features and Notes */}
                            <div>
                                <Section title={t('units.commonFeatures')}>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
                                        {commonFeatures.map(key => (
                                            <Checkbox key={key} id={`template-common-${key}`} label={t(`units.${key}` as any)} checked={templateUnit.features.common[key as keyof typeof templateUnit.features.common]} onChange={(c) => handleFeatureChange('common', key, c)} />
                                        ))}
                                    </div>
                                </Section>

                                <Section title={t('units.specialFeatures')}>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                                            {specialFeatures.map(key => (
                                            <Checkbox key={key} id={`template-special-${key}`} label={t(`units.${key}` as any)} checked={templateUnit.features.special[key as keyof typeof templateUnit.features.special]} onChange={(c) => handleFeatureChange('special', key, c)} />
                                        ))}
                                    </div>
                                </Section>
                                
                                <Section title={t('units.notes')}>
                                        <textarea id="template-notes" name="notes" rows={4} placeholder={t('units.notesPlaceholder')} value={templateUnit.notes} onChange={handleInputChange} className={inputBaseClass}></textarea>
                                </Section>
                            </div>
                        </div>
                    </form>
                </div>

                <footer className="flex items-center justify-end p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3">
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                    <button onClick={handleGenerateRooms} className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('units.generateRooms')}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddGroupPanel;
