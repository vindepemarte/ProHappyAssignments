# ProHappyAssignments Website

A React-based web application for academic assignment services with mobile-first design and n8n webhook integration.

## Features

- **Landing Page**: Attractive brand presentation with call-to-action
- **Three Form Types**: Assignment requests, Change requests, and Worker submissions
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Webhook Integration**: Seamless integration with n8n workflows
- **Data Protection**: GDPR/privacy compliance with cookie consent
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom brand colors
- **PWA Support**: Progressive Web App capabilities with service worker
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS 3.x with custom brand colors
- **Build Tool**: Vite with optimized production builds
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios for webhook calls
- **Routing**: React Router DOM with lazy loading
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + Playwright
- **PWA**: Vite PWA plugin with Workbox

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prohappy-assignments-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your webhook URLs:
```env
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker
VITE_FILE_UPLOAD_MAX_SIZE=10485760
VITE_ENVIRONMENT=development
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - Build for production
- `npm run build:production` - Build for production with optimizations
- `npm run build:staging` - Build for staging environment
- `npm run build:analyze` - Build with bundle analysis

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:headed` - Run E2E tests in headed mode

### Deployment
- `npm run deploy:build` - Full deployment build with all checks
- `npm run deploy:preview` - Build and preview deployment
- `npm run deploy:check` - Run all quality checks

### Utilities
- `npm run clean` - Clean build artifacts and cache
- `npm run clean:all` - Clean everything including node_modules
- `npm run serve` - Serve built files with Node.js server

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── services/      # API and webhook services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main App component
├── main.tsx       # Application entry point
└── index.css      # Global styles with Tailwind
```

## Brand Colors

The application uses the following brand color palette:

- **Primary Purple**: `#1d0fdb` (headers, buttons)
- **Secondary Purple**: `#2f3b65` (borders, accents)
- **Success Green**: `#10b981` (success messages)
- **Error Red**: `#ef4444` (error messages)
- **Warning Orange**: `#f59e0b` (warnings)

## Webhook Integration

The application sends form data to configured n8n webhook endpoints:

### Assignment Form Payload
```json
{
  "formType": "assignment",
  "timestamp": "2025-01-01T00:00:00Z",
  "data": {
    "fullName": "string",
    "email": "string",
    "moduleName": "string",
    "wordCount": "number",
    "orderDeadline": "string",
    "guidance": "string",
    "files": []
  }
}
```

### Changes Form Payload
```json
{
  "formType": "changes",
  "timestamp": "2025-01-01T00:00:00Z",
  "data": {
    "email": "string",
    "orderReferenceNumber": "string",
    "notes": "string",
    "deadlineChanges": "string",
    "files": []
  }
}
```

### Worker Form Payload
```json
{
  "formType": "worker",
  "timestamp": "2025-01-01T00:00:00Z",
  "data": {
    "email": "string",
    "orderReferenceNumber": "string",
    "notesForClient": "string",
    "files": []
  }
}
```

## Deployment

### Quick Deployment

Use the deployment script for automated deployment:

```bash
# Deploy to production with all checks
./scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh -e staging

# Skip tests for faster deployment
./scripts/deploy.sh -s

# Show help
./scripts/deploy.sh -h
```

### Manual Building for Production

```bash
# Full deployment build with all checks
npm run deploy:build

# Or step by step
npm run type-check
npm run lint
npm run test
npm run build:production
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration

The application supports multiple environments with different configuration files:

- `.env.example` - Template with all required variables
- `.env.development` - Development environment (created automatically)
- `.env.staging` - Staging environment configuration
- `.env.production` - Production environment configuration

### Required Environment Variables

All environments require these variables:

```env
# Webhook URLs for n8n integration
VITE_ASSIGNMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/assignment
VITE_CHANGES_WEBHOOK_URL=https://your-n8n-instance.com/webhook/changes
VITE_WORKER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/worker

# File upload configuration (10MB default)
VITE_FILE_UPLOAD_MAX_SIZE=10485760

# Environment identifier
VITE_ENVIRONMENT=production

# Optional: Analytics and monitoring
# VITE_ANALYTICS_ID=your-analytics-id
# VITE_SENTRY_DSN=your-sentry-dsn
```

### Coolify Deployment

#### Method 1: Static Site Deployment

1. **Connect Repository**
   - Connect your Git repository to Coolify
   - Select the `prohappy-assignments-website` directory as the project root

2. **Configure Build Settings**
   - Build Command: `npm run deploy:build`
   - Publish Directory: `dist`
   - Node.js Version: 18+ (recommended: 20)

3. **Set Environment Variables**
   ```env
   VITE_ASSIGNMENT_WEBHOOK_URL=https://your-production-n8n.com/webhook/assignment
   VITE_CHANGES_WEBHOOK_URL=https://your-production-n8n.com/webhook/changes
   VITE_WORKER_WEBHOOK_URL=https://your-production-n8n.com/webhook/worker
   VITE_FILE_UPLOAD_MAX_SIZE=10485760
   VITE_ENVIRONMENT=production
   ```

4. **Deploy**
   - Coolify will automatically build and deploy your application
   - The application will be available on your configured domain

#### Method 2: Docker Deployment

1. **Use the provided Dockerfile**
   ```bash
   # Build the Docker image
   docker build -t prohappy-assignments .
   
   # Run the container
   docker run -p 80:80 prohappy-assignments
   ```

2. **Configure in Coolify**
   - Use Docker deployment type
   - Point to the provided `Dockerfile`
   - Set environment variables in Coolify dashboard
   - Configure port mapping (80:80)

### Web Server Configuration

#### Nginx Configuration

The project includes an optimized `nginx.conf` file with:

- Gzip compression
- Security headers
- Proper caching for static assets
- SPA routing support
- Health check endpoint

#### Apache Configuration

If using Apache, create a `.htaccess` file in the `dist` directory:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>

# Don't cache HTML files
<FilesMatch "\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>
```

### Health Checks

The application provides a health check endpoint at `/health` that returns:

- **Status**: 200 OK
- **Response**: `healthy`
- **Content-Type**: `text/plain`

Use this endpoint for:
- Load balancer health checks
- Container orchestration health probes
- Monitoring systems

### Performance Optimization

The build includes several performance optimizations:

1. **Code Splitting**: Automatic route-based and vendor code splitting
2. **Tree Shaking**: Removes unused code from the final bundle
3. **Asset Optimization**: Images and fonts are optimized and cached
4. **Compression**: Gzip compression for all text-based assets
5. **PWA Features**: Service worker for offline functionality and caching

### Monitoring and Debugging

#### Build Analysis

Analyze your bundle size:

```bash
npm run build:analyze
```

#### Production Debugging

For production debugging, you can enable source maps by setting:

```env
VITE_SOURCEMAP=true
```

Note: Only enable source maps in staging environments, not production.

### Troubleshooting

#### Common Issues

1. **Webhook URLs not working**
   - Verify your n8n instance is accessible
   - Check CORS settings on your n8n instance
   - Ensure webhook endpoints are active

2. **Build failures**
   - Run `npm run clean` and try again
   - Check Node.js version (requires 18+)
   - Verify all environment variables are set

3. **Routing issues in production**
   - Ensure your web server is configured for SPA routing
   - Check that all routes redirect to `index.html`

4. **File upload issues**
   - Check `VITE_FILE_UPLOAD_MAX_SIZE` setting
   - Verify web server file upload limits
   - Check n8n webhook file handling

#### Getting Help

1. Check the browser console for errors
2. Verify network requests in browser dev tools
3. Check server logs for webhook delivery issues
4. Use the health check endpoint to verify deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run linting and formatting: `npm run lint:fix && npm run format`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## License

This project is private and proprietary to ProHappyAssignments.