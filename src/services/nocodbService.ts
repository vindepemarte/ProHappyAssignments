interface NocoDBConfig {
  baseUrl: string;
  apiToken: string;
  projectId: string;
  tableId: string;
}

// Import the actual form data types from validation
import type { AssignmentFormData, ChangesFormData, WorkerFormData } from '../types';

class NocoDBService {
  private config: NocoDBConfig;

  constructor(config: NocoDBConfig) {
    this.config = config;
  }

  async submitAssignmentForm(formData: AssignmentFormData): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/db/data/noco/${this.config.projectId}/${this.config.tableId}`;
    
    // Create FormData for multipart upload
    const form = new FormData();
    
    // Add text fields
    form.append('access_code', formData.accessCode);
    form.append('full_name', formData.fullName);
    form.append('email', formData.email);
    form.append('module_name', formData.moduleName);
    form.append('word_count', formData.wordCount.toString());
    form.append('order_deadline', formData.orderDeadline);
    form.append('guidance', formData.guidance || '');
    form.append('data_processing_consent', formData.dataProcessingConsent.toString());
    form.append('terms_acceptance', formData.termsAcceptance.toString());
    form.append('submitted_at', new Date().toISOString());
    
    // Add files if present
    if (formData.assignmentFiles && formData.assignmentFiles.length > 0) {
      formData.assignmentFiles.forEach((file) => {
        form.append('attachments', file);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': this.config.apiToken,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async submitChangesForm(formData: ChangesFormData): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/db/data/noco/${this.config.projectId}/${this.config.tableId}`;
    
    const form = new FormData();
    
    // Map the actual form fields to NocoDB fields
    form.append('reference_code', formData.referenceCode);
    form.append('email', formData.email);
    form.append('order_reference_number', formData.orderReferenceNumber);
    form.append('notes', formData.notes);
    form.append('deadline_changes', formData.deadlineChanges || '');
    form.append('data_processing_consent', formData.dataProcessingConsent.toString());
    form.append('terms_acceptance', formData.termsAcceptance.toString());
    form.append('submitted_at', new Date().toISOString());
    
    if (formData.uploadFiles && formData.uploadFiles.length > 0) {
      formData.uploadFiles.forEach((file) => {
        form.append('attachments', file);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': this.config.apiToken,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async submitWorkerForm(formData: WorkerFormData): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/db/data/noco/${this.config.projectId}/${this.config.tableId}`;
    
    const form = new FormData();
    
    // Map the actual form fields to NocoDB fields
    form.append('reference_code', formData.referenceCode);
    form.append('email', formData.email);
    form.append('order_reference_number', formData.orderReferenceNumber);
    form.append('notes_for_client', formData.notesForClient);
    form.append('data_processing_consent', formData.dataProcessingConsent.toString());
    form.append('terms_acceptance', formData.termsAcceptance.toString());
    form.append('submitted_at', new Date().toISOString());
    
    if (formData.uploadSection && formData.uploadSection.length > 0) {
      formData.uploadSection.forEach((file) => {
        form.append('attachments', file);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': this.config.apiToken,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }
}

export { NocoDBService, type NocoDBConfig };