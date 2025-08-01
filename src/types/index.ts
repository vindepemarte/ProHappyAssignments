// Type definitions will be added here

// Form Data Interfaces - imported from validation schemas
export type {
  AssignmentFormData,
  ChangesFormData,
  WorkerFormData,
} from '../utils/validation';

// Webhook Response Interface
export interface WebhookResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

// App State Interface
export interface AppState {
  cookieConsent: boolean;
  currentForm: 'assignments' | 'changes' | 'worker';
  isLoading: boolean;
  showTerms: boolean;
  showPrivacy: boolean;
}

// Environment Config Interface
export interface EnvironmentConfig {
  VITE_ASSIGNMENT_WEBHOOK_URL: string;
  VITE_CHANGES_WEBHOOK_URL: string;
  VITE_WORKER_WEBHOOK_URL: string;
  VITE_FILE_UPLOAD_MAX_SIZE: string;
  VITE_ENVIRONMENT: 'development' | 'production';
}
