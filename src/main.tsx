import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

try {
  const storedTheme = window.localStorage.getItem('communication-guide-theme');
  document.documentElement.classList.toggle('dark', storedTheme === 'dark');
} catch {
  // The guide defaults to light mode when browser storage is unavailable.
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
