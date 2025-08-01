import { useLocation } from 'react-router-dom';
import { logRouterContextWarning } from '../utils/routerDebug';

/**
 * Safe location hook that provides a fallback when used outside Router context
 * This prevents the "useLocation() may be used only in the context of a <Router>" error
 */
export const useSafeLocation = () => {
  try {
    return useLocation();
  } catch (error) {
    // Log the warning for debugging in development
    if (error instanceof Error) {
      logRouterContextWarning('useSafeLocation', error);
    }
    
    // Return a fallback location object if we're outside Router context
    return {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    };
  }
};