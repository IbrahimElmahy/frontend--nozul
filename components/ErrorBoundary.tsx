import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // You can dispatch a global event here too if you want to use the common modal for boundary errors
        // But since the tree might be broken, we might want a raw fallback or just try to trigger the modal if the Context is outside.
        // If Provider is outside, we can't consume it in Class component easily without a wrapper or static contextType.

        // For now, let's try to emit the event so the Modal (if alive) shows it.
        // But if `App` crashes, Modal might die. 
        // We will assume `ErrorBoundary` wraps `DashboardPage` but is inside `ErrorProvider`.

        window.dispatchEvent(new CustomEvent('global-error', {
            detail: {
                message: error.message || 'An unexpected application error occurred.',
                title: 'Application Error'
            }
        }));
    }

    public render() {
        if (this.state.hasError) {
            // Optional: Render a fallback UI if you don't want to rely on the Modal (in case Modal is what crashed)
            // returning children allows the Modal (rendered parallel to children in App) to show the error
            // provided the crash was in the children.
            // If we return null, the crashed part disappears, and the modal shows.
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{this.state.error?.message}</p>
                        <button
                            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
