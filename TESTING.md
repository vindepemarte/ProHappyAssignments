# Testing Guide

This document outlines the testing setup and practices for the ProHappyAssignments website.

## Testing Stack

### Unit & Integration Testing
- **Vitest**: Fast unit test runner built on Vite
- **React Testing Library**: Testing utilities for React components
- **Jest DOM**: Custom Jest matchers for DOM testing
- **User Event**: Utilities for simulating user interactions

### End-to-End Testing
- **Playwright**: Cross-browser E2E testing framework
- **Multiple browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Test Scripts

```bash
# Unit tests
npm run test              # Run all unit tests once
npm run test:watch        # Run tests in watch mode
npm run test:ui           # Run tests with UI interface
npm run test:coverage     # Run tests with coverage report

# E2E tests
npm run test:e2e          # Run E2E tests headless
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:headed   # Run E2E tests with browser visible

# Setup
npm run playwright:install # Install Playwright browsers
```

## Project Structure

```
src/
├── test/
│   ├── setup.ts          # Test configuration and global mocks
│   ├── utils.tsx         # Testing utilities and helpers
│   └── setup.test.ts     # Basic setup verification tests
└── components/
    └── *.test.tsx        # Component-specific tests

e2e/
├── helpers.ts            # E2E testing utilities
├── setup.spec.ts         # Basic E2E setup tests
└── *.spec.ts            # Feature-specific E2E tests
```

## Writing Unit Tests

### Basic Component Test
```typescript
import { render, screen } from '@/test/utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

### Form Testing
```typescript
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { AssignmentForm } from './AssignmentForm'

describe('AssignmentForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})
```

## Writing E2E Tests

### Basic Page Test
```typescript
import { test, expect } from '@playwright/test'
import { TestHelpers } from './helpers'

test.describe('Assignment Form', () => {
  test('should submit form successfully', async ({ page }) => {
    const helpers = new TestHelpers(page)
    
    await helpers.navigateToForms()
    await helpers.selectFormTab('Assignments')
    await helpers.fillAccessCode('12345')
    
    // Fill form fields
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    
    await helpers.mockWebhookResponse(true)
    await helpers.submitForm()
    await helpers.waitForSuccessMessage()
  })
})
```

## Test Utilities

### Custom Render
The `render` function from `@/test/utils` automatically wraps components with necessary providers:
- React Router
- App Context
- Other global providers

### Mock Data Factories
```typescript
import { createMockFormData, createMockFile } from '@/test/utils'

const mockData = createMockFormData()
const mockFile = createMockFile('test.pdf', 1024, 'application/pdf')
```

### E2E Helpers
The `TestHelpers` class provides common E2E testing utilities:
- Form navigation
- File uploads
- Accessibility checks
- Mobile responsiveness testing
- Webhook mocking

## Coverage Requirements

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

### Unit Tests
1. Test behavior, not implementation
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies
5. Test error states and edge cases

### E2E Tests
1. Test critical user journeys
2. Use page object patterns for complex interactions
3. Mock external services (webhooks)
4. Test on multiple devices/browsers
5. Include accessibility checks

### General
1. Keep tests fast and reliable
2. Use meaningful assertions
3. Clean up after tests (files, mocks)
4. Document complex test scenarios
5. Run tests in CI/CD pipeline

## Debugging Tests

### Unit Tests
```bash
# Run specific test file
npm run test -- MyComponent.test.tsx

# Run tests matching pattern
npm run test -- --grep "form validation"

# Debug with UI
npm run test:ui
```

### E2E Tests
```bash
# Run specific test
npm run test:e2e -- --grep "assignment form"

# Debug with browser visible
npm run test:e2e:headed

# Debug with Playwright UI
npm run test:e2e:ui
```

## Continuous Integration

Tests should be run in CI/CD pipeline:
1. Unit tests on every commit
2. E2E tests on pull requests
3. Coverage reports uploaded to coverage service
4. Tests must pass before deployment

## Accessibility Testing

E2E tests include basic accessibility checks:
- Proper heading hierarchy
- Alt text on images
- Form labels
- Keyboard navigation
- Color contrast (manual verification)

For comprehensive accessibility testing, consider using:
- axe-core integration
- Lighthouse CI
- Manual testing with screen readers