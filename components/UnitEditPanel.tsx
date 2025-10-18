import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Unit, CleaningStatus, CoolingType } from '../types';
import XMarkIcon from './icons-redesign/XMarkIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import Switch from './Switch';
import Checkbox from './Checkbox';

interface UnitEditPanelProps {
    unit: Unit | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUnit: Unit) => void;
    isAdding?: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);


const UnitEditPanel: React.FC<UnitEditPanelProps> = ({ unit, isOpen, onClose, onSave, isAdding = false }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState<Unit | null>(unit);

    const commonFeatures = useMemo(() => (unit ? Object.keys(unit.features.common) : []), [unit]);
    const specialFeatures = useMemo(() => (unit ? Object.keys(unit.features.special) : []), [unit]);

    useEffect(() => {
        setFormData(unit ? JSON.parse(JSON.stringify(unit)) : null);
    }, [unit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseInt(value, 10) || 0 });
    };

    const handleFeatureChange = (category: 'common' | 'special', key: string, checked: boolean) => {
         if (!formData) return;
         setFormData({
            ...formData,
            features: {
                ...formData.features,
                [category]: {
                    ...formData.features[category],
                    [key]: checked
                }
            }
         });
    }

    const handleSaveClick = () => {
        if (formData) {
            onSave(formData);
        }
    };
    
    if (!unit) return null;
    
    const labelAlignClass = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${language === 'ar' ? 'text-right' : 'text-left'}`;
    const inputBaseClass = `w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-200`;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="unit-edit-title"
        >
            <div
                className="fixed inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className={`relative w-full my-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0 sticky top-0 bg-white dark:bg-slate-800 rounded-t-lg z-10">
                    <h2 id="unit-edit-title" className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {isAdding ? t('units.addUnit') : `${t('units.editUnit')} - ${unit.unitNumber}`}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close panel">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto">
                    {formData && (
                        <form onSubmit={(e) => e.preventDefault()}>
                           <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
                                <div>
                                    <Section title={t('units.unitInfo')}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="unitNumber" className={labelAlignClass}>{t('units.th_id')}</label>
                                                    <input type="text" id="unitNumber" name="unitNumber" value={formData.unitNumber || ''} onChange={handleInputChange} className={inputBaseClass} />
                                                </div>
                                                <div>
                                                    <label htmlFor="unitName" className={labelAlignClass}>{t('units.unitName')}</label>
                                                    <input type="text" id="unitName" name="unitName" value={formData.unitName || ''} onChange={handleInputChange} className={inputBaseClass} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="unitType" className={labelAlignClass}>{t('units.roomType')}</label>
                                                    <select id="unitType" name="unitType" value={formData.unitType} onChange={handleInputChange} className={inputBaseClass}>
                                                        <option value="غرفة مفردة">{t('units.singleRoom')}</option>
                                                        <option value="غرفة مزدوجة">{t('units.doubleRoom')}</option>
                                                        <option value="جناح">{t('units.suite')}</option>
                                                    </select>
                                                </div>
                                                    <div>
                                                    <label htmlFor="cleaningStatus" className={labelAlignClass}>{t('units.cleaning')}</label>
                                                    <select id="cleaningStatus" name="cleaningStatus" value={formData.cleaningStatus} onChange={(e) => setFormData({...formData, cleaningStatus: e.target.value as CleaningStatus})} className={inputBaseClass}>
                                                        <option value="clean">{t('units.clean')}</option>
                                                        <option value="not-clean">{t('units.notClean')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('units.available')}</span>
                                                <Switch id="isAvailable" checked={formData.isAvailable} onChange={(c) => setFormData({...formData, isAvailable: c})} />
                                            </div>
                                        </div>
                                    </Section>

                                    <Section title={t('units.unitDetails')}>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {(['floor', 'rooms', 'bathrooms', 'beds', 'doubleBeds', 'wardrobes', 'tvs'] as const).map(key => (
                                                <div key={key}>
                                                    <label htmlFor={key} className={labelAlignClass}>{t(`units.${key}` as any)}</label>
                                                    <input type="number" id={key} name={key} value={formData[key]} onChange={handleNumberChange} className={inputBaseClass} min="0" />
                                                </div>
                                                ))}
                                                <div>
                                                    <label htmlFor="coolingType" className={labelAlignClass}>{t('units.coolingType')}</label>
                                                    <select id="coolingType" name="coolingType" value={formData.coolingType} onChange={(e) => setFormData({...formData, coolingType: e.target.value as CoolingType})} className={inputBaseClass}>
                                                        <option value="">{t('units.selectCoolingType')}</option>
                                                        <option value="central">{t('units.central')}</option>
                                                        <option value="split">{t('units.split')}</option>
                                                        <option value="window">{t('units.window')}</option>
                                                    </select>
                                                </div>
                                        </div>
                                    </Section>
                                    
                                    <Section title={t('units.notes')}>
                                        <textarea id="notes" name="notes" rows={4} placeholder={t('units.notesPlaceholder')} value={formData.notes} onChange={handleInputChange} className={inputBaseClass}></textarea>
                                    </Section>
                                </div>
                                
                                <div>
                                    <Section title={t('units.commonFeatures')}>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {commonFeatures.map(key => (
                                                <Checkbox key={key} id={`common-${key}`} label={t(`units.${key}` as any)} checked={formData.features.common[key as keyof typeof formData.features.common]} onChange={(c) => handleFeatureChange('common', key, c)} />
                                            ))}
                                        </div>
                                    </Section>

                                    <Section title={t('units.specialFeatures')}>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                                                {specialFeatures.map(key => (
                                                <Checkbox key={key} id={`special-${key}`} label={t(`units.${key}` as any)} checked={formData.features.special[key as keyof typeof formData.features.special]} onChange={(c) => handleFeatureChange('special', key, c)} />
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                           </div>
                        </form>
                    )}
                </div>

                <footer className="flex items-center justify-end p-4 border-t dark:border-slate-700 flex-shrink-0 gap-3 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-lg">
                     <button onClick={onClose} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                        {t('units.cancel')}
                    </button>
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{t('units.saveChanges')}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default UnitEditPanel;