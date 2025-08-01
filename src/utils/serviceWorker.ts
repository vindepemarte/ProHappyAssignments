// Service Worker registration and management
import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    wb = new Workbox('/sw.js');

    wb.addEventListener('controlling', () => {
      // Service worker is controlling the page
      console.log('Service worker is now controlling the page');
    });

    wb.addEventListener('waiting', () => {
      // A new service worker is waiting to activate
      console.log('A new service worker is waiting to activate');
      
      // Show update notification to user
      if (confirm('A new version is available. Reload to update?')) {
        wb?.messageSkipWaiting();
        window.location.reload();
      }
    });

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('Service worker updated');
      } else {
        console.log('Service worker installed for the first time');
      }
    });

    wb.register().catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Service worker unregistration failed:', error);
      });
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/pages/LandingPage.tsx',
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Prefetch next likely resources
export const prefetchResources = (resources: string[]) => {
  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};