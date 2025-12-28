import React, { useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { LanguageContext } from '../contexts/LanguageContext';
import XCircleIcon from './icons-redesign/XCircleIcon';

// Simple Exclamation Icon if not available
const WarningIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

interface ErrorModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    message?: string | null;
    title?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = (props) => {
    const { error: ctxError, title: ctxTitle, clearError: ctxClearError } = useContext(ErrorContext);
    const { t } = useContext(LanguageContext);

    // Determine mode: Controlled (via props) or Uncontrolled (via Context)
    const isControlled = props.message !== undefined || props.isOpen !== undefined;

    const message = isControlled ? props.message : ctxError;
    const title = (isControlled ? props.title : ctxTitle) || t('common.error') || 'Error';
    const isOpen = isControlled ? (props.isOpen ?? !!message) : !!ctxError;
    const onClose = (isControlled ? props.onClose : ctxClearError) || (() => { });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 px-4 pb-20 text-center sm:block sm:p-0" role="dialog" aria-modal="true" aria-labelledby="modal-headline">

            {/* Background Overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-slate-900 dark:opacity-90"></div>
            </div>

            {/* Modal Panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border dark:border-slate-700">
                <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                            <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left rtl:text-right w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-headline">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rtl:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        onClick={onClose}
                    >
                        {t('common.dismiss') || 'Dismiss'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
