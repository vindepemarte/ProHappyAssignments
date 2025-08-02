import axios, { AxiosError } from 'axios';
import type { AssignmentFormData, ChangesFormData, WorkerFormData, WebhookResponse } from '../types';
import { webhookConfig } from './webhookConfig';
import { googleDriveService } from './googleDriveService';

// Retry configuration interface
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: AxiosError) => boolean;
}

// Default retry configuration
const defaultRetryConfig: RetryConfig = {
  maxRetries: webhookConfig.getMaxRetries(),
  retryDelay: webhookConfig.getRetryDelay(),
  shouldRetry: (error: AxiosError) => {
    // Retry on network errors, timeouts, and 5xx server errors
    if (!error.response) return true; // Network error
    if (error.code === 'ECONNABORTED') return true; // Timeout
    if (error.response.status >= 500) return true; // Server error
    return false; // Don't retry on 4xx client errors
  },
};

// Logging utility
class WebhookLogger {
  private shouldLog: boolean;

  constructor() {
    this.shouldLog = webhookConfig.shouldLogRequests();
  }

  logRequest(url: string, _payload: any, attempt: number, maxAttempts: number): void {
    if (!this.shouldLog) return;

    console.log(`🚀 Webhook Request ${attempt}/${maxAttempts} to ${url}`);
  }

  logResponse(_url: string, response: any, attempt: number): void {
    if (!this.shouldLog) return;

    console.log(`✅ Webhook Response ${attempt}: ${response.status}`);
  }

  logError(_url: string, error: AxiosError, attempt: number, willRetry: boolean): void {
    if (!this.shouldLog) return;

    const icon = willRetry ? '⚠️' : '❌';
    console.log(`${icon} Webhook Error ${attempt}: ${error.message} (${error.response?.status})`);
  }

  logRetry(delay: number, attempt: number): void {
    if (!this.shouldLog) return;
    console.log(`⏳ Retrying in ${delay}ms (attempt ${attempt + 1})...`);
  }
}

const logger = new WebhookLogger();

// Sleep utility for retry delays
const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Enhanced HTTP client with retry logic
class WebhookClient {
  private async makeRequestWithRetry<T>(
    url: string,
    data: T,
    retryConfig: RetryConfig = defaultRetryConfig
  ): Promise<any> {
    let lastError: AxiosError;
    const maxAttempts = retryConfig.maxRetries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const requestConfig = {
          timeout: webhookConfig.getTimeout(),
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `ProHappyAssignments-WebApp/${webhookConfig.getEnvironment()}`,
          },
        };

        logger.logRequest(url, data, attempt + 1, maxAttempts);

        const response = await axios.post(url, data, requestConfig);

        logger.logResponse(url, response, attempt + 1);

        return response;
      } catch (error) {
        const axiosError = error as AxiosError;
        lastError = axiosError;
        const willRetry = attempt < retryConfig.maxRetries && retryConfig.shouldRetry(axiosError);

        logger.logError(url, axiosError, attempt + 1, willRetry);

        // If this is the last attempt or we shouldn't retry, throw the error
        if (!willRetry) {
          throw axiosError;
        }

        // Calculate exponential backoff delay with jitter
        const baseDelay = retryConfig.retryDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * baseDelay; // Add up to 10% jitter
        const delay = Math.floor(baseDelay + jitter);

        logger.logRetry(delay, attempt);
        await sleep(delay);
      }
    }

    throw lastError!;
  }

  async post<T>(url: string, data: T): Promise<any> {
    return this.makeRequestWithRetry(url, data);
  }
}

// Create webhook client instance (currently unused but kept for future use)
// const webhookClient = new WebhookClient();

// File information interface for JSON metadata
interface FileInfo {
  fieldName: string;
  originalName: string;
  size: number;
  type: string;
  lastModified: number;
}

// JSON data structure sent to webhook
interface WebhookJsonData {
  formType: string;
  timestamp: string;
  formData: Record<string, any>;
  files: FileInfo[];
  metadata: {
    userAgent: string;
    referrer?: string;
    environment: string;
    version: string;
    fileCount: number;
  };
}

// Keep files as File objects for FormData transmission
const prepareFiles = (files: File[]): File[] => {
  return files || [];
};

// Create JSON data structure for webhook
const createWebhookJsonData = (
  formType: string,
  formData: Record<string, any>,
  files: File[]
): WebhookJsonData => {
  return {
    formType,
    timestamp: new Date().toISOString(),
    formData,
    files: files.map((file, index) => ({
      fieldName: `file_${index}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    })),
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      environment: webhookConfig.getEnvironment(),
      version: '1.0.0',
      fileCount: files.length,
    },
  };
};

// Enhanced error handling function
const handleWebhookError = (error: unknown, formType: string): WebhookResponse => {
  console.error(`${formType} form submission error:`, error);

  if (error instanceof AxiosError) {
    // Network or HTTP errors
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: 'Request timed out after multiple attempts. Please try again later.',
      };
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';

      if (status >= 400 && status < 500) {
        return {
          success: false,
          message: `Submission failed: ${message}`,
        };
      } else if (status >= 500) {
        return {
          success: false,
          message: 'Server error occurred after multiple attempts. Please try again later.',
        };
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: 'Network error after multiple attempts. Please check your connection and try again.',
      };
    }
  }

  // Generic error fallback
  return {
    success: false,
    message: 'An unexpected error occurred after multiple attempts. Please try again.',
  };
};

// Assignment form submission - Simple Google Apps Script
export const submitAssignmentForm = async (data: AssignmentFormData): Promise<WebhookResponse> => {
  try {
    console.log('Submitting assignment form...');
    
    // Submit everything to Google Apps Script (handles files + sheet automatically)
    await googleDriveService.submitForm(data, 'assignment');
    
    return {
      success: true,
      message: 'Assignment submitted successfully! Files uploaded to Google Drive and data added to spreadsheet. You will receive email updates about your assignment progress.',
    };
  } catch (error) {
    console.error('Assignment submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit assignment. Please try again.',
    };
  }
};

// Changes form submission - Simple Google Apps Script
export const submitChangesForm = async (data: ChangesFormData): Promise<WebhookResponse> => {
  try {
    console.log('Submitting changes form...');
    
    // Submit everything to Google Apps Script (handles files + sheet automatically)
    await googleDriveService.submitForm(data, 'changes');
    
    return {
      success: true,
      message: 'Change request submitted successfully! Files uploaded to Google Drive and data added to spreadsheet. You will receive email updates about your request progress.',
    };
  } catch (error) {
    console.error('Changes submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit change request. Please try again.',
    };
  }
};

// Worker form submission - Simple Google Apps Script
export const submitWorkerForm = async (data: WorkerFormData): Promise<WebhookResponse> => {
  try {
    console.log('Submitting worker form...');
    
    // Submit everything to Google Apps Script (handles files + sheet automatically)
    await googleDriveService.submitForm(data, 'worker');
    
    return {
      success: true,
      message: 'Work submitted successfully! Files uploaded to Google Drive and data added to spreadsheet. You will receive email updates about the submission status.',
    };
  } catch (error) {
    console.error('Worker submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit work. Please try again.',
    };
  }
};

export default {
  submitAssignmentForm,
  submitChangesForm,
  submitWorkerForm,
};