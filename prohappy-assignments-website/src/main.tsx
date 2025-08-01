import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { registerServiceWorker, preloadCriticalResources } from './utils/serviceWorker';
import { ComponentPreloader } from './utils/componentPreloader';

// Preload critical resources
preloadCriticalResources();
ComponentPreloader.preloadCriticalImages();

// Register service worker for caching
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
