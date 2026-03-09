/**
 * ErrorBoundary - Catches React errors and displays fallback UI.
 * 
 * Implements React's error boundary pattern to gracefully handle
 * rendering errors and prevent the entire app from crashing.
 */

import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h1 style={{ color: '#d32f2f', marginTop: 0 }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#666' }}>
              The application encountered an unexpected error. You can try reloading the
              page or resetting the game.
            </p>
            <details style={{ marginTop: '1rem', color: '#666' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error details
              </summary>
              <pre
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                }}
              >
                {this.state.error?.toString()}
                {'\n'}
                {this.state.error?.stack}
              </pre>
            </details>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
