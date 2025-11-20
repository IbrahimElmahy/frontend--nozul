
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import RichTextEditor from './RichTextEditor';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';

const HotelConditionsPage: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [englishContent, setEnglishContent] = useState('');
    const [arabicContent, setArabicContent] = useState('<mark>تم الاتفاق بين الطرفين علي مايلي</mark><br>اذا تعدي زمن الخروج الوقت 4 عصراً يتم حسب غرامه 100 ريال<br>ايجار شهر رمضان 5500 (خمسة الاف وخمسمائة ريال سعودي فقط لاغير ) للغرفتين والصالة');

    const handleSave = () => {
        // Here you would typically make an API call to save the content
        console.log("Saving English Content:", englishContent);
        console.log("Saving Arabic Content:", arabicContent);
        alert("Changes saved!");
    };
    
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
                    className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{t('hotelConditions.saveChanges')}</span>
                </button>
            </div>
        </div>
    );
};

export default HotelConditionsPage;