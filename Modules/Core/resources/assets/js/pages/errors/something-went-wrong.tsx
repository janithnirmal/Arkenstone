import { Button } from '@/components/ui/button';
import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Something went wrong.</h1>
                    <p className="text-muted-foreground">Please refresh the page.</p>
                    <p>Report this to the developer.</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
