/**
 * Router debugging utilities for development
 * Helps identify and debug Router context issues
 */

let routerContextWarnings = 0;
const MAX_WARNINGS = 5;

export const logRouterContextWarning = (componentName: string, error: Error) => {
  if (import.meta.env.DEV && routerContextWarnings < MAX_WARNINGS) {
    console.group(`🔍 Router Context Warning #${routerContextWarnings + 1}`);
    console.warn(`Component: ${componentName}`);
    console.warn(`Error: ${error.message}`);
    console.warn('This usually happens during hot reloads or component updates');
    console.warn('The component should recover automatically');
    console.trace('Stack trace:');
    console.groupEnd();
    
    routerContextWarnings++;
    
    if (routerContextWarnings === MAX_WARNINGS) {
      console.warn('🔇 Router context warnings suppressed (max reached)');
    }
  }
};

export const resetRouterWarnings = () => {
  routerContextWarnings = 0;
};

// Reset warnings on page load
if (import.meta.env.DEV) {
  window.addEventListener('load', resetRouterWarnings);
}