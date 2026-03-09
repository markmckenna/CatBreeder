/**
 * Tests for ErrorBoundary component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary.tsx';

// Component that throws an error on demand
interface ThrowingComponentProps {
  shouldThrow?: boolean;
}

function ThrowingComponent({ shouldThrow = false }: ThrowingComponentProps) {
  if (shouldThrow) {
    throw new Error('Test error from component');
  }
  return <div>Child content</div>;
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('displays error UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/encountered an unexpected error/)).toBeInTheDocument();
  });

  it('displays error details in expandable section', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const detailsElement = screen.getByText('Error details').parentElement;
    expect(detailsElement).toBeInTheDocument();

    // Details should contain the error message
    const preElement = screen.getByText(/Test error from component/);
    expect(preElement).toBeInTheDocument();
  });

  it('calls componentDidCatch when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('displays error message and stack trace', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // The error text should be displayed
    expect(screen.getByText(/Test error from component/)).toBeInTheDocument();
  });

  it('renders both error action buttons in error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  it('handles multiple child elements', () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('preserves error information through state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error message should be displayed
    expect(screen.getByText(/Test error from component/)).toBeInTheDocument();
  });
});
