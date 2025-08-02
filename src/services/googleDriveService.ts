// Simple Google Apps Script integration - NO MORE API HEADACHES!
import axios from 'axios';

interface GoogleAppsScriptConfig {
  webAppUrl: string;
}

class GoogleDriveService {
  private config: GoogleAppsScriptConfig;

  constructor() {
    this.config = {
      // You'll set this after creating the Google Apps Script
      webAppUrl: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '',
    };
  }

  // Convert File to base64 for Google Apps Script
  private async fileToBase64(file: File): Promise<{ name: string; type: string; data: string }> {
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

  async submitForm(data: any, formType: string): Promise<void> {
    try {
      console.log(`Submitting ${formType} form to Google Apps Script...`);
      
      if (!this.config.webAppUrl) {
        throw new Error('Google Apps Script URL not configured. Please set VITE_GOOGLE_APPS_SCRIPT_URL environment variable.');
      }

      // Convert files to base64
      let files: any[] = [];
      if (data.assignmentFiles && data.assignmentFiles.length > 0) {
        files = await Promise.all(
          data.assignmentFiles.map((file: File) => this.fileToBase64(file))
        );
      } else if (data.uploadFiles && data.uploadFiles.length > 0) {
        files = await Promise.all(
          data.uploadFiles.map((file: File) => this.fileToBase64(file))
        );
      } else if (data.uploadSection && data.uploadSection.length > 0) {
        files = await Promise.all(
          data.uploadSection.map((file: File) => this.fileToBase64(file))
        );
      }

      // Prepare data for Google Apps Script
      const payload = {
        formType,
        ...data,
        files,
        timestamp: new Date().toISOString(),
      };

      console.log(`Sending ${files.length} files to Google Apps Script`);

      // Send to Google Apps Script
      const response = await axios.post(this.config.webAppUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      if (response.data.success) {
        console.log('Google Apps Script success:', response.data);
      } else {
        throw new Error(response.data.message || 'Google Apps Script returned error');
      }
    } catch (error) {
      console.error('Google Apps Script error:', error);
      throw new Error(`Failed to submit form: ${error.message}`);
    }
  }

  // Legacy methods for compatibility - now just call submitForm
  async uploadFiles(files: File[], formType: string): Promise<string[]> {
    // This method is no longer used, but kept for compatibility
    return [];
  }

  async addRowToSheet(data: any, formType: string): Promise<void> {
    // This method is no longer used, but kept for compatibility
    // Everything is handled by submitForm now
  }
}

export const googleDriveService = new GoogleDriveService();