
import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import RichTextEditor from './RichTextEditor';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import { Condition } from '../types';
import { listConditions, createCondition, updateCondition, deleteCondition } from '../services/conditions';
// Duplicate imports removed

const HotelConditionsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
    const [englishContent, setEnglishContent] = useState('');
    const [arabicContent, setArabicContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Using specific hotel ID from documentation examples
    const hotelId = '32af5628-6b26-4ee7-8c11-3f82363007ff';

    const fetchConditions = async () => {
        setLoading(true);
        try {
            // listConditions returns an array
            const data = await listConditions(hotelId);
            setConditions(data);
            if (data && data.length > 0) {
                const current = data[0]; // Assuming we edit the first one or the specific one
                setEditingCondition(current);
                setEnglishContent(current.content_en || '');
                setArabicContent(current.content_ar || '');
            }
        } catch (err) {
            console.error("Failed to fetch hotel conditions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConditions();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('content_en', englishContent);
            formData.append('content_ar', arabicContent);
            formData.append('hotel', hotelId);

            if (editingCondition) {
                await updateCondition(editingCondition.id, formData);
                alert(t('hotelInfo.updateSuccess' as any) || 'Condition updated successfully!');
            } else {
                await createCondition(formData);
                alert(t('hotelInfo.createSuccess' as any) || 'Condition created successfully!');
            }
            fetchConditions();
        } catch (err) {
            alert(`Error saving condition: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('hotelConditions.pageTitle')}</h2>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t('hotelConditions.englishContent')}</h3>
                    <RichTextEditor
                        value={englishContent}
                        onChange={setEnglishContent}
                        placeholder={t('hotelConditions.englishPlaceholder')}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t('hotelConditions.arabicContent')}</h3>
                    <RichTextEditor
                        value={arabicContent}
                        onChange={setArabicContent}
                    />
                </div>
            </div>

            <div className="flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-blue-400"
                >
                    {isSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <CheckCircleIcon className="w-5 h-5" />
                    )}
                    <span>{isSaving ? (t('hotelInfo.saving' as any) || 'Saving...') : t('hotelConditions.saveChanges')}</span>
                </button>
            </div>
        </div>
    );
};

export default HotelConditionsPage;
