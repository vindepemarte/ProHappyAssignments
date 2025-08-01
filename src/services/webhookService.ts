import axios, { AxiosError } from 'axios';
import type { AssignmentFormData, ChangesFormData, WorkerFormData, WebhookResponse } from '../types';
import { webhookConfig } from './webhookConfig';

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

  logRequest(url: string, payload: any, attempt: number, maxAttempts: number): void {
    if (!this.shouldLog) return;
    
    console.group(`🚀 Webhook Request - Attempt ${attempt}/${maxAttempts}`);
    console.log('URL:', url);
    console.log('Payload:', payload);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  logResponse(url: string, response: any, attempt: number): void {
    if (!this.shouldLog) return;
    
    console.group(`✅ Webhook Response - Attempt ${attempt}`);
    console.log('URL:', url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.groupEnd();
  }

  logError(url: string, error: AxiosError, attempt: number, willRetry: boolean): void {
    if (!this.shouldLog) return;
    
    const icon = willRetry ? '⚠️' : '❌';
    console.group(`${icon} Webhook Error - Attempt ${attempt}`);
    console.log('URL:', url);
    console.log('Error:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Response Data:', error.response?.data);
    console.log('Will Retry:', willRetry);
    console.groupEnd();
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
    let lastError: AxiosError | Error;
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
        lastError = error as AxiosError;
        const willRetry = attempt < retryConfig.maxRetries && retryConfig.shouldRetry(lastError);
        
        logger.logError(url, lastError, attempt + 1, willRetry);
        
        // If this is the last attempt or we shouldn't retry, throw the error
        if (!willRetry) {
          throw lastError;
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

// Create webhook client instance
const webhookClient = new WebhookClient();

// File serialization interface
interface SerializedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Assignment webhook payload data
interface AssignmentPayloadData {
  accessCode: string;
  fullName: string;
  email: string;
  moduleName: string;
  wordCount: number;
  orderDeadline: string;
  guidance?: string;
  files: SerializedFile[];
}

// Changes webhook payload data
interface ChangesPayloadData {
  referenceCode: string;
  email: string;
  orderReferenceNumber: string;
  notes: string;
  deadlineChanges?: string;
  files: SerializedFile[];
}

// Worker webhook payload data
interface WorkerPayloadData {
  referenceCode: string;
  email: string;
  orderReferenceNumber: string;
  notesForClient: string;
  files: SerializedFile[];
}

// Convert File objects to serializable format
const serializeFiles = (files: File[]): SerializedFile[] => {
  return files.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }));
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

// Assignment form submission
export const submitAssignmentForm = async (data: AssignmentFormData): Promise<WebhookResponse> => {
  try {
    const payloadData: AssignmentPayloadData = {
      accessCode: data.accessCode,
      fullName: data.fullName,
      email: data.email,
      moduleName: data.moduleName,
      wordCount: data.wordCount,
      orderDeadline: data.orderDeadline,
      guidance: data.guidance,
      files: serializeFiles(data.assignmentFiles || []),
    };

    const payload = webhookConfig.createN8nPayload('assignment', payloadData);
    
    // Use local API endpoint to avoid CORS issues
    const response = await axios.post('/api/submit', {
      ...payload,
      formType: 'assignment'
    }, {
      timeout: webhookConfig.getTimeout(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: response.data.message || 'Assignment submitted successfully! You will receive an email with updates.',
        orderId: response.data.orderId || `ASG-${Date.now()}`,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    return handleWebhookError(error, 'Assignment');
  }
};

// Changes form submission
export const submitChangesForm = async (data: ChangesFormData): Promise<WebhookResponse> => {
  try {
    const payloadData: ChangesPayloadData = {
      referenceCode: data.referenceCode,
      email: data.email,
      orderReferenceNumber: data.orderReferenceNumber,
      notes: data.notes,
      deadlineChanges: data.deadlineChanges,
      files: serializeFiles(data.uploadFiles || []),
    };

    const payload = webhookConfig.createN8nPayload('changes', payloadData);
    
    // Use local API endpoint to avoid CORS issues
    const response = await axios.post('/api/submit', {
      ...payload,
      formType: 'changes'
    }, {
      timeout: webhookConfig.getTimeout(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: response.data.message || 'Change request submitted successfully! You will receive an email with updates.',
        orderId: response.data.orderId || `CHG-${Date.now()}`,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    return handleWebhookError(error, 'Changes');
  }
};

// Worker form submission
export const submitWorkerForm = async (data: WorkerFormData): Promise<WebhookResponse> => {
  try {
    const payloadData: WorkerPayloadData = {
      referenceCode: data.referenceCode,
      email: data.email,
      orderReferenceNumber: data.orderReferenceNumber,
      notesForClient: data.notesForClient,
      files: serializeFiles(data.uploadSection || []),
    };

    const payload = webhookConfig.createN8nPayload('worker', payloadData);
    
    // Use local API endpoint to avoid CORS issues
    const response = await axios.post('/api/submit', {
      ...payload,
      formType: 'worker'
    }, {
      timeout: webhookConfig.getTimeout(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: response.data.message || 'Work submitted successfully! You will receive an email with updates.',
        orderId: response.data.orderId || `WRK-${Date.now()}`,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    return handleWebhookError(error, 'Worker');
  }
};

export default {
  submitAssignmentForm,
  submitChangesForm,
  submitWorkerForm,
};