import { NocoDBService } from './nocodbService';
import type { AssignmentFormData, ChangesFormData, WorkerFormData, WebhookResponse } from '../types';

// NocoDB service instances
const assignmentNocoService = new NocoDBService({
  baseUrl: import.meta.env.VITE_NOCODB_BASE_URL || 'http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io',
  apiToken: import.meta.env.VITE_NOCODB_API_TOKEN || '',
  projectId: import.meta.env.VITE_NOCODB_PROJECT_ID || 'p165c7l1e9c2a3z',
  tableId: import.meta.env.VITE_NOCODB_ASSIGNMENT_TABLE_ID || '',
});

const changesNocoService = new NocoDBService({
  baseUrl: import.meta.env.VITE_NOCODB_BASE_URL || 'http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io',
  apiToken: import.meta.env.VITE_NOCODB_API_TOKEN || '',
  projectId: import.meta.env.VITE_NOCODB_PROJECT_ID || 'p165c7l1e9c2a3z',
  tableId: import.meta.env.VITE_NOCODB_CHANGES_TABLE_ID || '',
});

const workerNocoService = new NocoDBService({
  baseUrl: import.meta.env.VITE_NOCODB_BASE_URL || 'http://nocodb-oo4kk80wk8gs4kw0ogkkwokc.38.242.151.194.sslip.io',
  apiToken: import.meta.env.VITE_NOCODB_API_TOKEN || '',
  projectId: import.meta.env.VITE_NOCODB_PROJECT_ID || 'p165c7l1e9c2a3z',
  tableId: import.meta.env.VITE_NOCODB_WORKER_TABLE_ID || '',
});

// Assignment form submission
export const submitAssignmentForm = async (data: AssignmentFormData): Promise<WebhookResponse> => {
  try {
    console.log('🚀 Submitting assignment form to NocoDB...');
    
    await assignmentNocoService.submitAssignmentForm(data);
    
    return {
      success: true,
      message: 'Assignment submitted successfully! Your data has been saved to the database. You will receive email updates about your assignment progress.',
    };
  } catch (error) {
    console.error('❌ Assignment submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit assignment. Please try again.',
    };
  }
};

// Changes form submission
export const submitChangesForm = async (data: ChangesFormData): Promise<WebhookResponse> => {
  try {
    console.log('🚀 Submitting changes form to NocoDB...');
    
    await changesNocoService.submitChangesForm(data);
    
    return {
      success: true,
      message: 'Change request submitted successfully! Your request has been saved to the database. You will receive email updates about your request progress.',
    };
  } catch (error) {
    console.error('❌ Changes submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit change request. Please try again.',
    };
  }
};

// Worker form submission
export const submitWorkerForm = async (data: WorkerFormData): Promise<WebhookResponse> => {
  try {
    console.log('🚀 Submitting worker form to NocoDB...');
    
    await workerNocoService.submitWorkerForm(data);
    
    return {
      success: true,
      message: 'Work submitted successfully! Your submission has been saved to the database. You will receive email updates about the submission status.',
    };
  } catch (error) {
    console.error('❌ Worker submission error:', error);
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