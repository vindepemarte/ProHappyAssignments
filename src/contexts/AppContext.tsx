import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppState } from '../types';

// Action types for the reducer
type AppAction =
  | { type: 'SET_COOKIE_CONSENT'; payload: boolean }
  | { type: 'SET_CURRENT_FORM'; payload: 'assignments' | 'changes' | 'worker' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SHOW_TERMS'; payload: boolean }
  | { type: 'SET_SHOW_PRIVACY'; payload: boolean };

// Initial state
const initialState: AppState = {
  cookieConsent: false,
  currentForm: 'assignments',
  isLoading: false,
  showTerms: false,
  showPrivacy: false,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_COOKIE_CONSENT':
      return { ...state, cookieConsent: action.payload };
    case 'SET_CURRENT_FORM':
      return { ...state, currentForm: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SHOW_TERMS':
      return { ...state, showTerms: action.payload };
    case 'SET_SHOW_PRIVACY':
      return { ...state, showPrivacy: action.payload };
    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};