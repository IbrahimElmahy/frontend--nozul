import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

interface ErrorContextType {
    error: string | null;
    title: string | null;
    showError: (message: string, title?: string) => void;
    clearError: () => void;
}

export const ErrorContext = createContext<ErrorContextType>({
    error: null,
    title: null,
    showError: () => { },
    clearError: () => { },
});

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    const showError = useCallback((message: string, title?: string) => {
        setError(message);
        setTitle(title || null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setTitle(null);
    }, []);

    useEffect(() => {
        const handleGlobalError = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string; title?: string }>;
            if (customEvent.detail) {
                showError(customEvent.detail.message, customEvent.detail.title);
            }
        };

        window.addEventListener('global-error', handleGlobalError);

        return () => {
            window.removeEventListener('global-error', handleGlobalError);
        };
    }, [showError]);

    return (
        <ErrorContext.Provider value={{ error, title, showError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};
