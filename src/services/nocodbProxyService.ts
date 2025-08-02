import type { AssignmentFormData, ChangesFormData, WorkerFormData } from '../types';

interface NocoDBConfig {
  baseUrl: string;
  apiToken: string;
  projectId: string;
  tableId: string;
}

class NocoDBProxyService {
  private config: NocoDBConfig;

  constructor(config: NocoDBConfig) {
    this.config = config;
  }

  async submitAssignmentForm(formData: AssignmentFormData): Promise<any> {
    console.log('🚀 Submitting assignment via server proxy');
    
    // Prepare data for server proxy
    const proxyData = {
      baseUrl: this.config.baseUrl,
      apiToken: this.config.apiToken,
      projectId: this.config.projectId,
      tableId: this.config.tableId,
      data: {
        access_code: formData.accessCode,
        full_name: formData.fullName,
        email: formData.email,
        module_name: formData.moduleName,
        word_count: formData.wordCount.toString(),
        order_deadline: formData.orderDeadline,
        guidance: formData.guidance || '',
        data_processing_consent: formData.dataProcessingConsent.toString(),
        terms_acceptance: formData.termsAcceptance.toString(),
        submitted_at: new Date().toISOString(),
        files: formData.assignmentFiles || []
      }
    };

    try {
      const response = await fetch('/api/nocodb/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit to NocoDB');
      }

      return result;
      
    } catch (error) {
      console.error('❌ NocoDB proxy error:', error);
      throw error;
    }
  }

  async submitChangesForm(formData: ChangesFormData): Promise<any> {
    console.log('🚀 Submitting changes via server proxy');
    
    const proxyData = {
      baseUrl: this.config.baseUrl,
      apiToken: this.config.apiToken,
      projectId: this.config.projectId,
      tableId: this.config.tableId,
      data: {
        reference_code: formData.referenceCode,
        email: formData.email,
        order_reference_number: formData.orderReferenceNumber,
        notes: formData.notes,
        deadline_changes: formData.deadlineChanges || '',
        data_processing_consent: formData.dataProcessingConsent.toString(),
        terms_acceptance: formData.termsAcceptance.toString(),
        submitted_at: new Date().toISOString(),
        files: formData.uploadFiles || []
      }
    };

    try {
      const response = await fetch('/api/nocodb/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit to NocoDB');
      }

      return result;
      
    } catch (error) {
      console.error('❌ NocoDB proxy error:', error);
      throw error;
    }
  }

  async submitWorkerForm(formData: WorkerFormData): Promise<any> {
    console.log('🚀 Submitting worker form via server proxy');
    
    const proxyData = {
      baseUrl: this.config.baseUrl,
      apiToken: this.config.apiToken,
      projectId: this.config.projectId,
      tableId: this.config.tableId,
      data: {
        reference_code: formData.referenceCode,
        email: formData.email,
        order_reference_number: formData.orderReferenceNumber,
        notes_for_client: formData.notesForClient,
        data_processing_consent: formData.dataProcessingConsent.toString(),
        terms_acceptance: formData.termsAcceptance.toString(),
        submitted_at: new Date().toISOString(),
        files: formData.uploadSection || []
      }
    };

    try {
      const response = await fetch('/api/nocodb/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proxyData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit to NocoDB');
      }

      return result;
      
    } catch (error) {
      console.error('❌ NocoDB proxy error:', error);
      throw error;
    }
  }
}

export { NocoDBProxyService, type NocoDBConfig };