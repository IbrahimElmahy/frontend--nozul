import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PaperAirplaneIcon from './icons-redesign/PaperAirplaneIcon';
import { activateZakatIntegration } from '../services/zakat';

interface ZakatIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ZakatIntegrationModal: React.FC<ZakatIntegrationModalProps> = ({ isOpen, onClose }) => {
    const { language } = useContext(LanguageContext);
    const [activationCode, setActivationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await activateZakatIntegration(activationCode);
            setMessage(language === 'ar' ? 'تم التفعيل بنجاح' : 'Activated Successfully');
            setTimeout(() => {
                onClose();
                setMessage(null);
                setActivationCode('');
            }, 1500);
        } catch (error: any) {
            console.error(error);
            setMessage(language === 'ar' ? 'فشل التفعيل. يرجى التحقق من الرمز والمحاولة مرة أخرى.' : 'Activation failed. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                        {language === 'ar' ? 'اعداد فاتورة الزكاة' : 'Zakat Invoice Setup'}
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleActivate} className="p-6 space-y-6">
                    <div className="text-center space-y-4">
                        <p className="text-slate-600 dark:text-slate-300">
                            {language === 'ar' ? 'ادخل رمز التفعيل المكون من 6 ارقام لتفعيل الربط مع هيئة الزكاة' : 'Enter the 6-digit activation code to activate the connection with the Zakat Authority'}
                        </p>

                        <div className="text-right">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {language === 'ar' ? 'رمز الدخول هو:' : 'Activation Code:'}
                            </label>
                            <input
                                type="text"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                                placeholder="123456"
                                className="w-full px-4 py-3 text-center text-xl tracking-widest border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                                maxLength={6}
                            />
                        </div>

                        <a href="https://fatoora.zatca.gov.sa" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                            {language === 'ar' ? 'احصل علا رمز تفعيل otp من fatoora.zatca.gov.sa' : 'Get OTP activation code from fatoora.zatca.gov.sa'}
                        </a>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-center text-sm font-semibold ${message.includes('Success') || message.includes('بنجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !activationCode}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <PaperAirplaneIcon className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    <span>{language === 'ar' ? 'تفعيل' : 'Activate'}</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-lg transition-colors"
                        >
                            {language === 'ar' ? 'مغلقة' : 'Close'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ZakatIntegrationModal;
