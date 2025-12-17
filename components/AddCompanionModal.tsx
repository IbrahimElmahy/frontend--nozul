import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Guest, Companion, ReservationRelationship } from '../types';
import SearchableSelect from './SearchableSelect';
import { apiClient } from '../apiClient';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PlusIcon from './icons-redesign/PlusIcon';
import PencilIcon from './icons-redesign/PencilIcon';

interface AddCompanionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (companion: Companion) => void;
    guests: Guest[];
    onAddGuest: () => void;
    onEditGuest: (id: string) => void;
    relationships: ReservationRelationship[];
}

const SectionHeader: React.FC<{ title: string; }> = ({ title }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-2 my-2 rounded-md flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span className="italic font-serif text-slate-400">i</span> {title}
        </h3>
    </div>
);

const ActionButton: React.FC<{ icon: React.ComponentType<{ className?: string }>, color: string, onClick?: () => void, disabled?: boolean }> = ({ icon: Icon, color, onClick, disabled = false }) => (
    <button type="button" onClick={onClick} className={`w-9 h-9 flex items-center justify-center rounded-md ${color} text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`} disabled={disabled}>
        <Icon className="w-5 h-5" />
    </button>
);

const AddCompanionModal: React.FC<AddCompanionModalProps> = ({ isOpen, onClose, onSave, guests, onAddGuest, onEditGuest, relationships }) => {
    const { t, language } = useContext(LanguageContext);
    const [formData, setFormData] = useState<Partial<Companion>>({});

    const getRelationshipLabel = (r: ReservationRelationship) => language === 'ar' ? r.name_ar || r.name : r.name_en || r.name;

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setFormData({});
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!formData.guestId || !formData.relationship) {
            alert(t('bookings.alerts.fillAllFields') || 'Please fill all required fields');
            return;
        }

        const selectedGuest = guests.find(g => g.id === formData.guestId);

        const companion: Companion = {
            guestId: formData.guestId,
            guestName: selectedGuest?.name || '',
            relationship: formData.relationship,
            notes: formData.notes || ''
        };

        onSave(companion);
        onClose();
    };

    if (!isOpen) return null;

    const labelBaseClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
    const inputBaseClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis whitespace-nowrap";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col">
                <header className="flex items-center justify-between p-4 border-b dark:border-white/10 shrink-0">
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {t('bookings.addCompanion') || 'Add Companion'}
                    </h2>
                    <div className="w-6"></div> {/* Spacer for centering */}
                </header>

                <div className="p-6 space-y-6">
                    {/* Guest Information Section */}
                    <div className="space-y-3">
                        <SectionHeader title={t('bookings.guestInfo') || 'معلومات النزيل'} />

                        <div>
                            <label className={labelBaseClass}>{t('bookings.guest')}</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow">
                                    <SearchableSelect
                                        id="companion-guest"
                                        options={guests.map(g => g.name || '').filter(Boolean)}
                                        value={guests.find(g => g.id === formData.guestId)?.name || ''}
                                        onChange={(val) => {
                                            const g = guests.find(guest => guest.name === val);
                                            if (g) setFormData(prev => ({ ...prev, guestId: g.id }));
                                        }}
                                        placeholder={t('bookings.selectGuest')}
                                    />
                                </div>
                                <ActionButton icon={PencilIcon} color="bg-orange-400" onClick={() => formData.guestId && onEditGuest(formData.guestId)} disabled={!formData.guestId} />
                                <ActionButton icon={PlusIcon} color="bg-blue-600" onClick={onAddGuest} />
                            </div>
                        </div>
                    </div>

                    {/* Relationship Information Section */}
                    <div className="space-y-3">
                        <SectionHeader title={t('bookings.relationship') || 'معلومات العلاقة'} />

                        <div>
                            <label className={labelBaseClass}>{t('bookings.relationship')}</label>
                            <SearchableSelect
                                id="companion-relationship"
                                options={relationships.map(getRelationshipLabel).filter(Boolean)}
                                value={(relationships.find(r => r.id === formData.relationship) && getRelationshipLabel(relationships.find(r => r.id === formData.relationship)!)) || ''}
                                onChange={(val) => {
                                    const rel = relationships.find(r => getRelationshipLabel(r) === val);
                                    if (rel) setFormData(prev => ({ ...prev, relationship: rel.id }));
                                }}
                                placeholder={t('bookings.relationshipPlaceholder') || 'Relationship'}
                            />
                        </div>

                        <div>
                            <label className={labelBaseClass}>{t('bookings.notes')}</label>
                            <textarea
                                className={`${inputBaseClass} resize-none`}
                                rows={3}
                                value={formData.notes || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder={t('bookings.notesPlaceholder') || 'Any additional notes...'}
                            />
                        </div>
                    </div>
                </div>

                <footer className="p-4 border-t dark:border-white/10 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg flex justify-center shrink-0">
                    {/* The screenshot doesn't show the footer clearly but standard modal has it.
                         I'll stick to standard footer but center buttons? Or right align?
                         Standard is usually separate Save/Cancel.
                     */}
                    <button
                        onClick={handleSave}
                        className="w-full py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        {t('common.save') || 'Save'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddCompanionModal;
