// Debug service to test environment variables and Google authentication
import axios from 'axios';

export const debugService = {
  async testEnvironmentVariables() {
    try {
      const response = await axios.get('/api/test-env');
      console.log('Environment Variables Test:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to test environment variables:', error);
      throw error;
    }
  },

  async testGoogleAuth() {
    try {
      const clientEmail = import.meta.env.VITE_GOOGLE_CLIENT_EMAIL;
      const privateKey = import.meta.env.VITE_GOOGLE_PRIVATE_KEY;
      
      console.log('Client-side environment check:');
      console.log('Client Email:', clientEmail);
      console.log('Private Key available:', !!privateKey);
      console.log('Private Key length:', privateKey?.length);
      
      if (!clientEmail || !privateKey) {
        throw new Error('Missing environment variables on client side');
      }

      const response = await axios.post('/api/google-auth', {
        clientEmail,
        privateKey,
      });

      console.log('Google Auth Test Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Google Auth Test Failed:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
};

// Add to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).debugService = debugService;
}