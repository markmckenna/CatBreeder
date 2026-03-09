import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { ErrorBoundary } from './app/ui/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
