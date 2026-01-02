import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import XMarkIcon from './icons-redesign/XMarkIcon';
import PaperAirplaneIcon from './icons-redesign/PaperAirplaneIcon';
import CheckCircleIcon from './icons-redesign/CheckCircleIcon';
import { activateZakatIntegration, checkZakatStatus, ZakatStatusResponse } from '../services/zakat';

interface ZakatIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ZakatIntegrationModal: React.FC<ZakatIntegrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { language } = useContext(LanguageContext);
    const [activationCode, setActivationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [statusData, setStatusData] = useState<ZakatStatusResponse | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            checkStatus();
        }
    }, [isOpen]);

    const checkStatus = async () => {
        setIsCheckingStatus(true);
        try {
            const data = await checkZakatStatus();
            setStatusData(data);
        } catch (error) {
            console.error("Failed to check status", error);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await activateZakatIntegration(activationCode);
            setMessage(language === 'ar' ? 'تم التفعيل بنجاح' : 'Activated Successfully');
            // Refresh status instead of closing immediately
            await checkStatus();
            if (onSuccess) onSuccess();
            setTimeout(() => {
                setActivationCode('');
                setMessage(null);
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setMessage(language === 'ar' ? 'فشل التفعيل. يرجى التحقق من الرمز والمحاولة مرة أخرى.' : 'Activation failed. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                        {language === 'ar' ? 'الربط مع هيئة الزكاة' : 'ZATCA Integration'}
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 min-h-[300px] flex flex-col justify-center">
                    {isCheckingStatus ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                            <p className="text-sm text-slate-500">{language === 'ar' ? 'جاري التحقق من الحالة...' : 'Checking status...'}</p>
                        </div>
                    ) : statusData?.is_ready ? (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                                {language === 'ar' ? 'متصل بنجاح' : 'Connected Successfully'}
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-sm space-y-2">
                                <div className="flex justify-between border-b border-slate-200 dark:border-slate-600 pb-2">
                                    <span className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'البيئة' : 'Environment'}:</span>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200 uppercase">{statusData.zatca_environment}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'آخر فاتورة' : 'Last Invoice'}:</span>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">#{statusData.last_icv}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleActivate} className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-slate-600 dark:text-slate-300">
                                    {language === 'ar' ? 'ادخل رمز التفعيل (OTP) لبدء الربط' : 'Enter OTP to start onboarding'}
                                </p>

                                <div className="text-right">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        {language === 'ar' ? 'رمز التفعيل' : 'OTP Code'}
                                    </label>
                                    <input
                                        type="text"
                                        value={activationCode}
                                        onChange={(e) => setActivationCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full px-4 py-3 text-center text-xl tracking-widest border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                                        maxLength={6}
                                    />
                                </div>

                                <a href="https://fatoora.zatca.gov.sa" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                                    {language === 'ar' ? 'الحصول على الرمز من بوابة فاتورة' : 'Get OTP from Fatoora Portal'}
                                </a>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-center text-sm font-semibold ${message.includes('Success') || message.includes('بنجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || !activationCode}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                            <span>{language === 'ar' ? 'ربط' : 'Connect'}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-lg transition-colors"
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZakatIntegrationModal;
