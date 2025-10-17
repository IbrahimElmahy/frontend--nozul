import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import ExclamationTriangleIcon from './icons-redesign/ExclamationTriangleIcon';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100" id="confirmation-modal-title">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:gap-3 sm:justify-center">
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                    >
                        {t('units.cancel')}
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                        onClick={onConfirm}
                    >
                        {t('units.deleteUnit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
