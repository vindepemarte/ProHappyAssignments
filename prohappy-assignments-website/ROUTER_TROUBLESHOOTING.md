# Router Context Troubleshooting Guide

This guide helps resolve the common React Router error: `"useLocation() may be used only in the context of a <Router> component"`

## Problem Description

This error occurs when a component tries to use React Router hooks (like `useLocation`, `useNavigate`, etc.) outside of a Router context. This commonly happens during:

- Hot module reloading in development
- Component updates and re-renders
- Lazy loading of components
- Error boundaries catching and re-rendering components

## Solutions Implemented

### 1. Safe Location Hook (`useSafeLocation`)

**File**: `src/hooks/useSafeLocation.ts`

A custom hook that safely handles Router context errors:

```typescript
import { useLocation } from 'react-router-dom';
import { logRouterContextWarning } from '../utils/routerDebug';

export const useSafeLocation = () => {
  try {
    return useLocation();
  } catch (error) {
    // Log warning in development
    if (error instanceof Error) {
      logRouterContextWarning('useSafeLocation', error);
    }
    
    // Return fallback location object
    return {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    };
  }
};
```

**Usage**: Replace `useLocation()` with `useSafeLocation()` in components that might render outside Router context.

### 2. Router Error Boundary

**File**: `src/components/RouterErrorBoundary.tsx`

A specialized error boundary that catches Router-specific errors:

```typescript
class RouterErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    const isRouterError = error.message.includes('useLocation') || 
                         error.message.includes('Router') ||
                         error.message.includes('context');
    
    if (isRouterError) {
      return { hasError: true, error };
    }
    
    throw error; // Re-throw non-Router errors
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

### 3. Development Debugging

**File**: `src/utils/routerDebug.ts`

Debug utilities to help identify Router context issues:

```typescript
export const logRouterContextWarning = (componentName: string, error: Error) => {
  if (import.meta.env.DEV && routerContextWarnings < MAX_WARNINGS) {
    console.group(`🔍 Router Context Warning`);
    console.warn(`Component: ${componentName}`);
    console.warn(`Error: ${error.message}`);
    console.warn('This usually happens during hot reloads');
    console.trace('Stack trace:');
    console.groupEnd();
  }
};
```

## How to Apply These Solutions

### For Existing Components

1. **Replace `useLocation` with `useSafeLocation`**:
   ```typescript
   // Before
   import { useLocation } from 'react-router-dom';
   const location = useLocation();
   
   // After
   import { useSafeLocation } from '../hooks/useSafeLocation';
   const location = useSafeLocation();
   ```

2. **Wrap Router-dependent components**:
   ```typescript
   // In App.tsx
   <RouterErrorBoundary>
     <Router>
       {/* Your app content */}
     </Router>
   </RouterErrorBoundary>
   ```

### For New Components

1. **Always use safe hooks** when working with Router context
2. **Test components** in isolation to ensure they handle missing Router context
3. **Use error boundaries** around Router-dependent sections

## Prevention Strategies

### 1. Component Structure
```typescript
// Good: Router context is clearly defined
<Router>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</Router>

// Bad: Components outside Router trying to use Router hooks
<SomeComponent /> {/* Uses useLocation() */}
<Router>
  <Routes>...</Routes>
</Router>
```

### 2. Conditional Router Hook Usage
```typescript
const MyComponent = () => {
  const [isInRouter, setIsInRouter] = useState(false);
  
  useEffect(() => {
    try {
      useLocation();
      setIsInRouter(true);
    } catch {
      setIsInRouter(false);
    }
  }, []);
  
  if (!isInRouter) {
    return <FallbackComponent />;
  }
  
  return <RouterDependentComponent />;
};
```

### 3. Lazy Loading Best Practices
```typescript
// Ensure lazy components are loaded within Router context
const LazyComponent = lazy(() => import('./Component'));

<Router>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</Router>
```

## Debugging Steps

### 1. Check Component Hierarchy
- Ensure all Router hook usage is within `<Router>` component
- Verify error boundaries are properly placed
- Check for components rendered outside the main Router tree

### 2. Development Console
Look for these warning patterns:
```
🔍 Router Context Warning
Component: Header
Error: useLocation() may be used only in the context of a <Router>
This usually happens during hot reloads
```

### 3. Component Testing
Test components in isolation:
```typescript
// Test without Router context
render(<MyComponent />);

// Test with Router context
render(
  <BrowserRouter>
    <MyComponent />
  </BrowserRouter>
);
```

## Common Scenarios and Solutions

### Scenario 1: Header Component Error
**Problem**: Header uses `useLocation()` but sometimes renders outside Router

**Solution**: Use `useSafeLocation()` hook
```typescript
// src/components/Header.tsx
import { useSafeLocation } from '../hooks/useSafeLocation';

const Header = () => {
  const location = useSafeLocation(); // Safe version
  // ... rest of component
};
```

### Scenario 2: Hot Reload Issues
**Problem**: Components lose Router context during development hot reloads

**Solution**: 
1. Use RouterErrorBoundary
2. Implement safe hooks
3. Add development warnings

### Scenario 3: Lazy Loading Issues
**Problem**: Lazy-loaded components render before Router context is available

**Solution**: Ensure Suspense boundaries are within Router context
```typescript
<Router>
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<LazyComponent />} />
    </Routes>
  </Suspense>
</Router>
```

## Testing the Fix

### 1. Development Testing
```bash
npm run dev
# Navigate between pages
# Trigger hot reloads
# Check console for warnings
```

### 2. Build Testing
```bash
npm run build
npm run preview
# Test production build behavior
```

### 3. Error Simulation
```typescript
// Temporarily move a Router hook outside context to test error handling
const TestComponent = () => {
  const location = useLocation(); // This should trigger error boundary
  return <div>Test</div>;
};

// Render outside Router to test
<TestComponent />
<Router>...</Router>
```

## Monitoring and Maintenance

### 1. Development Warnings
- Monitor console for Router context warnings
- Address warnings before they become production issues
- Use the debug utilities to track patterns

### 2. Error Tracking
- Monitor error boundaries for Router-related errors
- Set up error reporting for production
- Track error frequency and patterns

### 3. Code Reviews
- Check for proper Router hook usage
- Ensure error boundaries are in place
- Verify component hierarchy

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)

## Quick Reference

### Safe Hooks Available
- `useSafeLocation()` - Safe version of `useLocation()`

### Error Boundaries Available
- `RouterErrorBoundary` - Catches Router context errors
- `ErrorBoundary` - General error boundary

### Debug Utilities
- `logRouterContextWarning()` - Log Router context issues
- `resetRouterWarnings()` - Reset warning counters

### Best Practices
1. Always use safe hooks in components that might render outside Router context
2. Wrap Router-dependent sections with RouterErrorBoundary
3. Test components both with and without Router context
4. Monitor development console for warnings
5. Use proper component hierarchy with Router at the top level