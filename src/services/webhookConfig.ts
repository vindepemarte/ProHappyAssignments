import type { EnvironmentConfig } from '../types';

// Webhook configuration class
export class WebhookConfig {
  private static instance: WebhookConfig;
  private static configLogged: boolean = false;
  private config: EnvironmentConfig;
  private isDebugMode: boolean;

  private constructor() {
    this.config = this.loadConfig();
    this.isDebugMode = this.config.VITE_ENVIRONMENT === 'development';
    this.validateConfig();
  }

  public static getInstance(): WebhookConfig {
    if (!WebhookConfig.instance) {
      WebhookConfig.instance = new WebhookConfig();
    }
    return WebhookConfig.instance;
  }

  private loadConfig(): EnvironmentConfig {
    return {
      VITE_ASSIGNMENT_WEBHOOK_URL: import.meta.env.VITE_ASSIGNMENT_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/client',
      VITE_CHANGES_WEBHOOK_URL: import.meta.env.VITE_CHANGES_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/changes',
      VITE_WORKER_WEBHOOK_URL: import.meta.env.VITE_WORKER_WEBHOOK_URL || 'https://auto.iacovici.it/webhook-test/worker',
      VITE_FILE_UPLOAD_MAX_SIZE: import.meta.env.VITE_FILE_UPLOAD_MAX_SIZE || '10485760',
      VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
    };
  }

  private validateConfig(): void {
    const requiredUrls = [
      this.config.VITE_ASSIGNMENT_WEBHOOK_URL,
      this.config.VITE_CHANGES_WEBHOOK_URL,
      this.config.VITE_WORKER_WEBHOOK_URL,
    ];

    requiredUrls.forEach((url, index) => {
      const formTypes = ['assignment', 'changes', 'worker'];
      if (!this.isValidUrl(url)) {
        console.warn(`Invalid webhook URL for ${formTypes[index]}: ${url}`);
      }
    });

    if (this.isDebugMode && !WebhookConfig.configLogged) {
      console.log('Webhook Configuration:', {
        assignmentUrl: this.config.VITE_ASSIGNMENT_WEBHOOK_URL,
        changesUrl: this.config.VITE_CHANGES_WEBHOOK_URL,
        workerUrl: this.config.VITE_WORKER_WEBHOOK_URL,
        environment: this.config.VITE_ENVIRONMENT,
        maxFileSize: this.config.VITE_FILE_UPLOAD_MAX_SIZE,
      });
      WebhookConfig.configLogged = true;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public getAssignmentWebhookUrl(): string {
    return this.config.VITE_ASSIGNMENT_WEBHOOK_URL;
  }

  public getChangesWebhookUrl(): string {
    return this.config.VITE_CHANGES_WEBHOOK_URL;
  }

  public getWorkerWebhookUrl(): string {
    return this.config.VITE_WORKER_WEBHOOK_URL;
  }

  public getMaxFileSize(): number {
    return parseInt(this.config.VITE_FILE_UPLOAD_MAX_SIZE, 10);
  }

  public getEnvironment(): string {
    return this.config.VITE_ENVIRONMENT;
  }

  public isProduction(): boolean {
    return this.config.VITE_ENVIRONMENT === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.VITE_ENVIRONMENT === 'development';
  }

  public getTimeout(): number {
    // 30 seconds for production, 10 seconds for development
    return this.isProduction() ? 30000 : 10000;
  }

  public getMaxRetries(): number {
    // More retries in production
    return this.isProduction() ? 3 : 2;
  }

  public getRetryDelay(): number {
    // Base retry delay in milliseconds
    return 1000;
  }

  public shouldLogRequests(): boolean {
    return this.isDevelopment();
  }

  public shouldLogResponses(): boolean {
    return this.isDevelopment();
  }

  // Get webhook configuration for a specific form type
  public getWebhookUrlForFormType(formType: 'assignment' | 'changes' | 'worker'): string {
    switch (formType) {
      case 'assignment':
        return this.getAssignmentWebhookUrl();
      case 'changes':
        return this.getChangesWebhookUrl();
      case 'worker':
        return this.getWorkerWebhookUrl();
      default:
        throw new Error(`Unknown form type: ${formType}`);
    }
  }

  // Create n8n-compatible webhook payload structure
  public createN8nPayload<T>(formType: string, data: T): N8nWebhookPayload<T> {
    return {
      formType,
      timestamp: new Date().toISOString(),
      data,
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        environment: this.getEnvironment(),
        version: '1.0.0', // Application version
      },
    };
  }
}

// N8n webhook payload interface
export interface N8nWebhookPayload<T> {
  formType: string;
  timestamp: string;
  data: T;
  metadata: {
    userAgent: string;
    referrer?: string;
    environment: string;
    version: string;
  };
}

// Export singleton instance
export const webhookConfig = WebhookConfig.getInstance();