#!/bin/bash

# ProHappyAssignments Deployment Script
# This script handles the deployment process for different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BUILD=false
VERBOSE=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Set environment (development|staging|production) [default: production]"
    echo "  -s, --skip-tests        Skip running tests"
    echo "  -b, --skip-build        Skip build process"
    echo "  -v, --verbose           Enable verbose output"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Deploy to production with all checks"
    echo "  $0 -e staging           # Deploy to staging"
    echo "  $0 -s -b               # Skip tests and build (for quick deployment)"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -b|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: development, staging, production"
    exit 1
fi

print_status "Starting deployment for environment: $ENVIRONMENT"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if environment file exists
ENV_FILE=".env.$ENVIRONMENT"
if [[ ! -f "$ENV_FILE" ]]; then
    print_warning "Environment file $ENV_FILE not found. Using .env.example as template."
    if [[ -f ".env.example" ]]; then
        cp ".env.example" "$ENV_FILE"
        print_warning "Please update $ENV_FILE with your actual configuration."
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
if [[ "$VERBOSE" == "true" ]]; then
    npm ci
else
    npm ci --silent
fi

# Run type checking
print_status "Running type checking..."
npm run type-check

# Run linting
print_status "Running linting..."
npm run lint

# Run formatting check
print_status "Checking code formatting..."
npm run format:check

# Run tests (unless skipped)
if [[ "$SKIP_TESTS" == "false" ]]; then
    print_status "Running unit tests..."
    npm run test
    
    print_status "Running E2E tests..."
    npm run test:e2e
else
    print_warning "Skipping tests as requested"
fi

# Build the application (unless skipped)
if [[ "$SKIP_BUILD" == "false" ]]; then
    print_status "Building application for $ENVIRONMENT..."
    
    case $ENVIRONMENT in
        development)
            npm run build
            ;;
        staging)
            npm run build:staging
            ;;
        production)
            npm run build:production
            ;;
    esac
    
    # Verify build output
    if [[ ! -d "dist" ]]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi
    
    # Check if main files exist
    if [[ ! -f "dist/index.html" ]]; then
        print_error "Build failed - index.html not found in dist"
        exit 1
    fi
    
    print_success "Build completed successfully"
else
    print_warning "Skipping build as requested"
fi

# Display deployment information
print_status "Deployment Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Build directory: dist/"
echo "  Environment file: $ENV_FILE"

if [[ -f "dist/index.html" ]]; then
    DIST_SIZE=$(du -sh dist/ | cut -f1)
    echo "  Build size: $DIST_SIZE"
fi

print_success "Deployment preparation completed!"
print_status "Next steps:"
echo "  1. Verify your environment variables in $ENV_FILE"
echo "  2. Upload the dist/ directory to your web server"
echo "  3. Configure your web server to serve the static files"
echo "  4. Set up proper redirects for React Router"

# For Coolify deployment
if [[ "$ENVIRONMENT" == "production" ]]; then
    print_status "For Coolify deployment:"
    echo "  1. Ensure your webhook URLs are configured in $ENV_FILE"
    echo "  2. The build output is in the dist/ directory"
    echo "  3. Use the provided nginx.conf for web server configuration"
    echo "  4. The application will be available on port 80"
fi