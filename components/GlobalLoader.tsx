import React from 'react';

const GlobalLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex flex-col items-center">
                {/* Outer spinning ring */}
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-[var(--color-primary-500)] animate-spin"></div>

                {/* Inner pulsing circle */}
                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-500)] opacity-20 animate-ping"></div>
                </div>

                {/* Logo or Text (Optional) */}
                {/* <div className="mt-4 font-semibold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] animate-pulse">Loading...</div> */}
            </div>
        </div>
    );
};

export default GlobalLoader;
