# Design Document

## Overview

The ProHappyAssignments website is a React-based single-page application (SPA) built with Tailwind CSS that provides a mobile-first, responsive interface for academic assignment services. The application features a landing page and three form types with webhook integration to n8n workflows, complete with data protection compliance for 2025.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │    │   n8n Webhooks   │    │   File Storage  │
│                 │────│                  │────│                 │
│ - Landing Page  │    │ - Assignment     │    │ - Google Drive  │
│ - Forms System  │    │ - Changes        │    │ - Local Upload  │
│ - Navigation    │    │ - Worker         │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS 3.x
- **Build Tool**: Vite
- **State Management**: React Context API + useState/useReducer
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Native HTML5 file input with drag-and-drop
- **HTTP Client**: Axios for webhook calls
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Deployment**: Static build for Coolify hosting

## Components and Interfaces

### Component Hierarchy

```
App
├── CookieBanner
├── Router
│   ├── LandingPage
│   │   ├── Header
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   └── Footer
│   └── FormsPage
│       ├── FormTabs
│       ├── AssignmentForm
│       ├── ChangesForm
│       ├── WorkerForm
│       └── SuccessModal
├── TermsModal
├── PrivacyModal
└── LoadingSpinner
```

### Core Interfaces

```typescript
// Form Data Interfaces
interface AssignmentFormData {
  accessCode: string;
  fullName: string;
  email: string;
  moduleName: string;
  wordCount: number;
  orderDeadline: string;
  assignmentFiles: File[];
  guidance: string;
}

interface ChangesFormData {
  referenceCode: string;
  email: string;
  orderReferenceNumber: string;
  notes: string;
  deadlineChanges: string;
  uploadFiles: File[];
}

interface WorkerFormData {
  referenceCode: string;
  email: string;
  orderReferenceNumber: string;
  notesForClient: string;
  uploadSection: File[];
}

// Webhook Response Interface
interface WebhookResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

// App State Interface
interface AppState {
  cookieConsent: boolean;
  currentForm: 'assignments' | 'changes' | 'worker';
  isLoading: boolean;
  showTerms: boolean;
  showPrivacy: boolean;
}
```

### Design System

#### Color Palette
Based on the landing page image, the brand colors are:
- **Primary Purple**: `#1d0fdb` (headers, buttons)
- **Secondary Purple**: `#2f3b65` (borders, accents)
- **White**: `#ffffff` (backgrounds, text on dark)
- **Dark Gray**: `#434343` (body text)
- **Success Green**: `#10b981` (success messages)
- **Error Red**: `#ef4444` (error messages)
- **Warning Orange**: `#f59e0b` (warnings)

#### Typography
- **Primary Font**: Inter (fallback: system fonts)
- **Headings**: Font weights 600-800
- **Body Text**: Font weight 400
- **Small Text**: Font weight 300

#### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Data Models

### Form Validation Schema

```typescript
// Assignment Form Schema
const assignmentSchema = z.object({
  accessCode: z.string().length(5, "Access code must be 5 characters"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  moduleName: z.string().min(2, "Module name is required"),
  wordCount: z.number().min(1, "Word count must be positive"),
  orderDeadline: z.string().min(1, "Deadline is required"),
  assignmentFiles: z.array(z.instanceof(File)).optional(),
  guidance: z.string().optional()
});

// Changes Form Schema
const changesSchema = z.object({
  referenceCode: z.string().length(5, "Reference code must be 5 characters"),
  email: z.string().email("Valid email is required"),
  orderReferenceNumber: z.string().min(1, "Order reference is required"),
  notes: z.string().min(1, "Notes are required"),
  deadlineChanges: z.string().optional(),
  uploadFiles: z.array(z.instanceof(File)).optional()
});

// Worker Form Schema
const workerSchema = z.object({
  referenceCode: z.string().length(5, "Reference code must be 5 characters"),
  email: z.string().email("Valid email is required"),
  orderReferenceNumber: z.string().min(1, "Order reference is required"),
  notesForClient: z.string().min(1, "Notes for client are required"),
  uploadSection: z.array(z.instanceof(File)).optional()
});
```

### Webhook Payload Structure

```typescript
// Assignment Webhook Payload
interface AssignmentWebhookPayload {
  formType: 'assignment';
  timestamp: string;
  data: {
    fullName: string;
    email: string;
    moduleName: string;
    wordCount: number;
    orderDeadline: string;
    guidance?: string;
    files: {
      name: string;
      size: number;
      type: string;
      base64?: string; // For small files
      url?: string; // For large files uploaded separately
    }[];
  };
  metadata: {
    userAgent: string;
    ipAddress?: string;
    referrer?: string;
  };
}
```

## Error Handling

### Error Types and Responses

1. **Validation Errors**
   - Display inline field errors
   - Prevent form submission
   - Highlight invalid fields

2. **Network Errors**
   - Show retry mechanism
   - Display user-friendly error messages
   - Log errors for debugging

3. **Webhook Errors**
   - Handle timeout scenarios
   - Provide fallback contact information
   - Store form data locally for retry

4. **File Upload Errors**
   - Validate file size and type
   - Show upload progress
   - Handle upload failures gracefully

### Error Handling Strategy

```typescript
class ErrorHandler {
  static handleFormError(error: unknown): string {
    if (error instanceof ZodError) {
      return error.errors[0].message;
    }
    if (error instanceof AxiosError) {
      return error.response?.data?.message || 'Network error occurred';
    }
    return 'An unexpected error occurred';
  }

  static handleWebhookError(error: AxiosError): WebhookErrorResponse {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit form',
      shouldRetry: error.response?.status !== 400,
      retryAfter: 5000
    };
  }
}
```

## Testing Strategy

### Unit Testing
- Component rendering tests
- Form validation tests
- Utility function tests
- Error handling tests

### Integration Testing
- Form submission workflows
- Webhook integration tests
- File upload functionality
- Navigation between forms

### E2E Testing
- Complete user journeys
- Mobile responsiveness
- Cross-browser compatibility
- Accessibility compliance

### Testing Tools
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Accessibility**: axe-core
- **Performance**: Lighthouse CI

## Security Considerations

### Data Protection
- Input sanitization and validation
- XSS prevention through React's built-in protection
- CSRF protection through SameSite cookies
- Secure file upload handling

### Privacy Compliance
- Cookie consent management
- Data minimization principles
- Clear privacy policy
- User consent tracking

### Access Control
- 5-character code validation
- Rate limiting on form submissions
- File type and size restrictions
- Webhook endpoint security

## Performance Optimization

### Loading Performance
- Code splitting by route
- Lazy loading of non-critical components
- Image optimization and lazy loading
- Minimal bundle size with tree shaking

### Runtime Performance
- Memoization of expensive calculations
- Debounced form validation
- Efficient re-rendering with React.memo
- Virtual scrolling for large lists (if needed)

### Caching Strategy
- Static asset caching
- API response caching where appropriate
- Service worker for offline functionality
- Browser storage for form drafts

## Deployment Architecture

### Build Process
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

### Environment Configuration
```typescript
interface EnvironmentConfig {
  VITE_ASSIGNMENT_WEBHOOK_URL: string;
  VITE_CHANGES_WEBHOOK_URL: string;
  VITE_WORKER_WEBHOOK_URL: string;
  VITE_FILE_UPLOAD_MAX_SIZE: string;
  VITE_ENVIRONMENT: 'development' | 'production';
}
```

### Coolify Deployment
- Static file serving
- Environment variable injection
- SSL certificate management
- CDN integration for assets

## Accessibility Features

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Mobile Accessibility
- Touch target sizing (44px minimum)
- Swipe gesture support
- Voice input compatibility
- Zoom support up to 200%

## Monitoring and Analytics

### Error Tracking
- Client-side error logging
- Webhook failure tracking
- Performance monitoring
- User experience metrics

### Analytics Events
- Form submissions
- Tab switching
- File uploads
- Error occurrences
- User journey tracking