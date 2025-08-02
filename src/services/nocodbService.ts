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
    // Use API v2 endpoint format
    const url = `${this.config.baseUrl}/api/v2/tables/${this.config.tableId}/records`;
    
    console.log('🚀 Submitting assignment to NocoDB v2:', url);
    console.log('📋 Project ID:', this.config.projectId);
    console.log('📊 Table ID:', this.config.tableId);
    console.log('🔑 API Token:', this.config.apiToken ? 'Present' : 'Missing');
    
    // For API v2, we need to send JSON data, not FormData for text fields
    const recordData = {
      access_code: formData.accessCode,
      full_name: formData.fullName,
      email: formData.email,
      module_name: formData.moduleName,
      word_count: formData.wordCount,
      order_deadline: formData.orderDeadline,
      guidance: formData.guidance || '',
      data_processing_consent: formData.dataProcessingConsent,
      terms_acceptance: formData.termsAcceptance,
      submitted_at: new Date().toISOString(),
    };

    // Handle files separately if needed
    if (formData.assignmentFiles && formData.assignmentFiles.length > 0) {
      console.log('📎 Files to upload:', formData.assignmentFiles.length);
      // For now, we'll skip files and focus on getting the basic data working
      console.log('⚠️ File upload not implemented yet, focusing on data submission');
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xc-token': this.config.apiToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(recordData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ NocoDB error response:', errorText);
        
        if (response.status === 0 || response.status === 404) {
          throw new Error('Cannot connect to NocoDB. Please check if the server is running and accessible.');
        }
        
        if (response.status === 401) {
          throw new Error('Invalid API token. Please check your NocoDB API token.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. Please check your API token permissions.');
        }
        
        throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ NocoDB success response:', result);
      return result;
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚫 CORS or network error:', error);
        throw new Error('Cannot connect to NocoDB due to CORS policy or network issues. Please check your NocoDB CORS settings.');
      }
      throw error;
    }
  }

  async submitChangesForm(formData: ChangesFormData): Promise<any> {
    const url = `${this.config.baseUrl}/api/v2/tables/${this.config.tableId}/records`;
    
    const recordData = {
      reference_code: formData.referenceCode,
      email: formData.email,
      order_reference_number: formData.orderReferenceNumber,
      notes: formData.notes,
      deadline_changes: formData.deadlineChanges || '',
      data_processing_consent: formData.dataProcessingConsent,
      terms_acceptance: formData.termsAcceptance,
      submitted_at: new Date().toISOString(),
    };

    if (formData.uploadFiles && formData.uploadFiles.length > 0) {
      console.log('📎 Files to upload:', formData.uploadFiles.length);
      console.log('⚠️ File upload not implemented yet, focusing on data submission');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': this.config.apiToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async submitWorkerForm(formData: WorkerFormData): Promise<any> {
    const url = `${this.config.baseUrl}/api/v2/tables/${this.config.tableId}/records`;
    
    const recordData = {
      reference_code: formData.referenceCode,
      email: formData.email,
      order_reference_number: formData.orderReferenceNumber,
      notes_for_client: formData.notesForClient,
      data_processing_consent: formData.dataProcessingConsent,
      terms_acceptance: formData.termsAcceptance,
      submitted_at: new Date().toISOString(),
    };
    
    if (formData.uploadSection && formData.uploadSection.length > 0) {
      console.log('📎 Files to upload:', formData.uploadSection.length);
      console.log('⚠️ File upload not implemented yet, focusing on data submission');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-token': this.config.apiToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NocoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }
}

export { NocoDBService, type NocoDBConfig };