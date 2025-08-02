// Server-side Google integration - SECURE & WORKING!
import axios from 'axios';
import type { AssignmentFormData, ChangesFormData, WorkerFormData } from '../types';

interface FileData {
  name: string;
  type: string;
  data: string;
}

type FormData = AssignmentFormData | ChangesFormData | WorkerFormData;

class GoogleDriveService {
  constructor() {
    console.log('GoogleDriveService initialized - using server-side proxy');
  }

  // Convert File to base64 for server processing
  private async fileToBase64(file: File): Promise<FileData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1]; // Remove data URL prefix
        resolve({
          name: file.name,
          type: file.type,
          data: base64Data,
        });
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  async submitForm(data: FormData, formType: string): Promise<void> {
    try {
      console.log(`Submitting ${formType} form via server proxy...`);

      // Convert files to base64
      let files: FileData[] = [];
      if ('assignmentFiles' in data && data.assignmentFiles && data.assignmentFiles.length > 0) {
        files = await Promise.all(
          data.assignmentFiles.map((file: File) => this.fileToBase64(file))
        );
      } else if ('uploadFiles' in data && data.uploadFiles && data.uploadFiles.length > 0) {
        files = await Promise.all(
          data.uploadFiles.map((file: File) => this.fileToBase64(file))
        );
      } else if ('uploadSection' in data && data.uploadSection && data.uploadSection.length > 0) {
        files = await Promise.all(
          data.uploadSection.map((file: File) => this.fileToBase64(file))
        );
      }

      // Prepare data for server
      const payload = {
        formType,
        ...data,
        files,
        timestamp: new Date().toISOString(),
      };

      console.log(`Sending ${files.length} files to server proxy`);

      // Send to our secure server endpoint
      const response = await axios.post('/api/google-submit', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds timeout for file uploads
      });

      if (response.data.success) {
        console.log('Server proxy success:', response.data);
      } else {
        throw new Error(response.data.message || 'Server returned error');
      }
    } catch (error) {
      console.error('Server proxy error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to submit form: ${errorMessage}`);
    }
  }

  // Legacy methods for compatibility
  async uploadFiles(_files: File[], _formType: string): Promise<string[]> {
    return [];
  }

  async addRowToSheet(_data: FormData, _formType: string): Promise<void> {
    // Everything is handled by submitForm now
  }
}

export const googleDriveService = new GoogleDriveService();