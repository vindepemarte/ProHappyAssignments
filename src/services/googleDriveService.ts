// Google Drive and Sheets integration service
import axios from 'axios';

interface GoogleDriveConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  assignmentFolderId: string;
  changesFolderId: string;
  workerFolderId: string;
}

class GoogleDriveService {
  private config: GoogleDriveConfig;
  private accessToken: string | null = null;

  constructor() {
    this.config = {
      clientEmail: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL || '',
      privateKey: import.meta.env.VITE_GOOGLE_PRIVATE_KEY || '',
      spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '1iMJg_Ri37L0WqvIMkpd0g_HX_a5o_Elz8QuInteW9AA',
      // Your actual Google Drive folder IDs
      assignmentFolderId: import.meta.env.VITE_GOOGLE_ASSIGNMENT_FOLDER_ID || '127g6jiDJr9oU-BDBP5DKmjNt8ARKulopBnXSmVRYvv2zvxrM3RJhA3DaOEIdTFMHIAx-7WeL',
      changesFolderId: import.meta.env.VITE_GOOGLE_CHANGES_FOLDER_ID || '1ondq8HFeZxmTt48bmQr6333BZPHVdv_Fzpzx1I4ADdYfwFmMFd3emPmLPcytghMSkDC69Ssn',
      workerFolderId: import.meta.env.VITE_GOOGLE_WORKER_FOLDER_ID || '1HVIzeZ-G7zCUytfKDntkAvec5CC46oXCDL3IMrQ7x5iYhY2X8fvcAwmJKXlv3Xx_Iswdlz91',
    };
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      // Use server-side proxy for authentication
      const response = await axios.post('/api/google-auth', {
        clientEmail: this.config.clientEmail,
        privateKey: this.config.privateKey,
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  private getFolderId(formType: string): string {
    switch (formType) {
      case 'assignment':
        return this.config.assignmentFolderId;
      case 'changes':
        return this.config.changesFolderId;
      case 'worker':
        return this.config.workerFolderId;
      default:
        return this.config.assignmentFolderId;
    }
  }

  async uploadFile(file: File, formType: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    const folderId = this.getFolderId(formType);

    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/related',
          },
        }
      );

      const fileId = response.data.id;
      return `https://drive.google.com/open?id=${fileId}`;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  }

  async uploadFiles(files: File[], formType: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, formType));
    return Promise.all(uploadPromises);
  }

  async addRowToSheet(data: any, formType: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    
    let sheetName = 'Form Assignments'; // Default sheet name
    let values: any[] = [];

    if (formType === 'assignment') {
      sheetName = 'Form Assignments';
      // Based on your sheet structure: Timestamp | Order Deadline | Full Name | Module Name | Word Count | Assignment Files | Email address | Guidance | Access Code
      values = [
        new Date().toLocaleString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }), // Timestamp in DD/MM/YYYY HH:MM:SS format
        data.orderDeadline,
        data.fullName,
        data.moduleName,
        data.wordCount.toString(),
        data.assignmentFiles || '', // File URLs comma-separated
        data.email,
        data.guidance || '',
        data.accessCode || 'IVA98', // Default access code
      ];
    } else if (formType === 'changes') {
      sheetName = 'Form Changes Required';
      // Based on your sheet structure: Timestamp | Email address | Order Reference Number | Notes | Deadline Changes | Upload Files
      values = [
        new Date().toLocaleString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }), // Timestamp
        data.email,
        data.orderReferenceNumber,
        data.notes,
        data.deadlineChanges || '',
        data.uploadFiles || '', // File URLs comma-separated
      ];
    } else if (formType === 'worker') {
      sheetName = 'Form Worker';
      // Based on your sheet structure: Timestamp | Email address | Order Reference Number | Notes for Client | Upload Section
      values = [
        new Date().toLocaleString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }), // Timestamp
        data.email,
        data.orderReferenceNumber,
        data.notesForClient,
        data.uploadSection || '', // File URLs comma-separated
      ];
    }

    try {
      await axios.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${sheetName}:append?valueInputOption=RAW`,
        {
          values: [values],
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`Successfully added row to ${sheetName} sheet`);
    } catch (error) {
      console.error('Failed to add row to sheet:', error);
      throw new Error('Failed to add data to Google Sheet');
    }
  }
}

export const googleDriveService = new GoogleDriveService();