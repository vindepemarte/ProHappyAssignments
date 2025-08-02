// DEAD SIMPLE - JUST MAKE IT WORK!
import axios from 'axios';
import type { AssignmentFormData, ChangesFormData, WorkerFormData } from '../types';

type FormData = AssignmentFormData | ChangesFormData | WorkerFormData;

class GoogleDriveService {
  async submitForm(data: FormData, formType: string): Promise<void> {
    try {
      console.log(`Submitting ${formType} form...`);

      // Convert files to base64 - SIMPLE VERSION
      let files: any[] = [];
      const fileArrays = [
        'assignmentFiles' in data ? data.assignmentFiles : [],
        'uploadFiles' in data ? data.uploadFiles : [],
        'uploadSection' in data ? data.uploadSection : []
      ].filter(arr => arr && arr.length > 0);

      if (fileArrays.length > 0) {
        const allFiles = fileArrays[0] as File[];
        for (const file of allFiles) {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.readAsDataURL(file);
          });
          
          files.push({
            name: file.name,
            type: file.type,
            data: base64
          });
        }
      }

      // SIMPLE payload
      const payload = {
        formType,
        ...data,
        files,
        timestamp: new Date().toISOString(),
      };

      console.log(`Sending ${files.length} files...`);

      // SIMPLE request with LONG timeout
      const response = await axios.post('/api/google-submit', payload, {
        timeout: 120000, // 2 minutes - should be enough!
      });

      console.log('Response:', response.status, response.data);

      // SIMPLE success check - if we get here and status is 200, it worked
      if (response.status >= 200 && response.status < 300) {
        console.log('SUCCESS!');
        return;
      }

      throw new Error('Request failed');
    } catch (error) {
      console.error('Error:', error);
      
      // If it's a timeout, be more specific
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out - but your form might have been submitted. Check your Google Drive and Sheet.');
      }
      
      throw new Error('Failed to submit form');
    }
  }

  // Keep these for compatibility
  async uploadFiles(): Promise<string[]> { return []; }
  async addRowToSheet(): Promise<void> { }
}

export const googleDriveService = new GoogleDriveService();