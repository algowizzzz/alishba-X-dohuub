import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { ErrorFallback } from './app/components/ErrorFallback';
import { initSentry, Sentry } from './lib/sentry';
import './styles/index.css';

initSentry();

createRoot(document.getElementById('root')!).render(
  <Sentry.ErrorBoundary fallback={({ error, resetError }) => <ErrorFallback error={error} resetError={resetError} />}>
    <App />
  </Sentry.ErrorBoundary>,
);
