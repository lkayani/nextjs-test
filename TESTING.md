# Testing Guidelines

This document outlines the testing strategy and best practices for this Next.js application.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Test Types](#test-types)
- [Setup Instructions](#setup-instructions)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Coverage Goals](#coverage-goals)

## Overview

Our testing strategy follows a pyramid approach:
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components and modules
- **End-to-End Tests**: Test complete user workflows

## Testing Stack

### Recommended Tools

For a Next.js 15 TypeScript project, we recommend:

- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: For testing React components
- **Playwright** or **Cypress**: For end-to-end testing
- **MSW (Mock Service Worker)**: For mocking API requests
- **@testing-library/user-event**: For simulating user interactions

### Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
npm install --save-dev @types/jest ts-jest
```

For E2E testing:
```bash
npm install --save-dev @playwright/test
# or
npm install --save-dev cypress
```

## Test Types

### 1. Unit Tests

Test individual functions, utilities, and components in isolation.

**What to Test:**
- Utility functions in `/src/lib`
- Individual React components
- Data transformations
- Business logic

**Location:** Place test files adjacent to the code being tested
- `src/lib/utils.test.ts`
- `src/components/MetricCard.test.tsx`

**Example:**
```typescript
// src/lib/utils.test.ts
import { formatDate, calculatePercentage } from './utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('should format ISO date to readable string', () => {
      const result = formatDate('2026-01-09T10:00:00Z');
      expect(result).toBe('January 9, 2026');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
    });

    it('should handle zero denominator', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });
});
```

### 2. Component Tests

Test React components with their behavior and rendering.

**What to Test:**
- Component renders correctly with props
- User interactions (clicks, inputs, etc.)
- Conditional rendering
- State changes
- Event handlers

**Example:**
```typescript
// src/components/MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('renders metric value and label', () => {
    render(<MetricCard label="Total Sales" value="$1,234" />);

    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('displays trend indicator when provided', () => {
    render(
      <MetricCard
        label="Revenue"
        value="$5,000"
        trend={{ value: 12, direction: 'up' }}
      />
    );

    expect(screen.getByText('↑ 12%')).toBeInTheDocument();
  });
});
```

### 3. Integration Tests

Test interactions between multiple components or modules.

**What to Test:**
- Data flow between components
- API route handlers
- State management interactions
- Component composition

**Example:**
```typescript
// src/app/api/time/route.test.ts
import { GET } from './route';

describe('/api/time', () => {
  it('returns current time in multiple formats', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('unix');
    expect(data).toHaveProperty('formatted');
    expect(data).toHaveProperty('timezone');
    expect(typeof data.unix).toBe('number');
  });
});
```

### 4. End-to-End Tests

Test complete user workflows in a real browser environment.

**What to Test:**
- Critical user journeys
- Multi-page workflows
- Form submissions
- Authentication flows
- Real API interactions

**Example (Playwright):**
```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard displays metrics correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for data to load
  await page.waitForSelector('[data-testid="metric-card"]');

  // Check that metrics are displayed
  const metricCards = page.locator('[data-testid="metric-card"]');
  await expect(metricCards).toHaveCount(4);

  // Verify chart renders
  await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible();
});
```

## Setup Instructions

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

### Playwright Configuration

```bash
npx playwright install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Update package.json

Add test scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Writing Tests

### General Principles

1. **Arrange-Act-Assert (AAA) Pattern**
   ```typescript
   it('should calculate total correctly', () => {
     // Arrange: Set up test data
     const items = [10, 20, 30];

     // Act: Execute the function
     const result = calculateTotal(items);

     // Assert: Verify the result
     expect(result).toBe(60);
   });
   ```

2. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Test from the user's perspective
   - Avoid testing internal state or private methods

3. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('displays error message when API request fails', () => {});

   // Bad
   it('test API', () => {});
   ```

4. **One Assertion Per Test (when possible)**
   ```typescript
   // Prefer multiple specific tests
   it('validates email format', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });

   it('rejects invalid email format', () => {
     expect(isValidEmail('invalid')).toBe(false);
   });
   ```

5. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Boundary conditions
   - Error states

### Component Testing Best Practices

1. **Use Testing Library Queries Wisely**

   Priority order:
   - `getByRole` (most accessible)
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`
   - `getByTestId` (last resort)

   ```typescript
   // Good
   const button = screen.getByRole('button', { name: /submit/i });

   // Less ideal
   const button = screen.getByTestId('submit-button');
   ```

2. **Test User Interactions**
   ```typescript
   import userEvent from '@testing-library/user-event';

   it('submits form on button click', async () => {
     const user = userEvent.setup();
     const onSubmit = jest.fn();

     render(<ContactForm onSubmit={onSubmit} />);

     await user.type(screen.getByLabelText(/email/i), 'test@example.com');
     await user.click(screen.getByRole('button', { name: /submit/i }));

     expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
   });
   ```

3. **Mock External Dependencies**
   ```typescript
   // Mock API calls
   jest.mock('./api/client', () => ({
     fetchData: jest.fn(),
   }));

   // Mock Next.js router
   jest.mock('next/navigation', () => ({
     useRouter: () => ({
       push: jest.fn(),
       pathname: '/',
     }),
   }));
   ```

### API Route Testing

```typescript
import { GET, POST } from './route';

describe('API Route: /api/data', () => {
  it('returns 200 with valid data on GET', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('results');
  });

  it('returns 400 with invalid POST data', async () => {
    const request = new Request('http://localhost:3000/api/data', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### Testing Async Code

```typescript
it('loads data asynchronously', async () => {
  render(<DataComponent />);

  // Show loading state initially
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to appear
  const dataElement = await screen.findByText(/data loaded/i);
  expect(dataElement).toBeInTheDocument();

  // Loading state should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- utils.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should validate"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

## Best Practices

### Do's ✅

- Write tests before or alongside code (TDD/BDD approach)
- Keep tests simple and focused
- Use meaningful test descriptions
- Test edge cases and error conditions
- Mock external dependencies (APIs, databases, third-party services)
- Clean up after tests (reset mocks, clear timers)
- Use data-testid attributes sparingly (prefer semantic queries)
- Keep test data simple and minimal
- Test accessibility features

### Don'ts ❌

- Don't test implementation details
- Don't test third-party libraries
- Don't duplicate tests (test same thing multiple times)
- Don't use random data that makes tests non-deterministic
- Don't test everything (focus on critical paths)
- Don't make tests dependent on each other
- Don't ignore failing tests
- Don't commit commented-out tests

### Code Organization

```
src/
├── components/
│   ├── MetricCard.tsx
│   └── MetricCard.test.tsx       # Component tests adjacent to source
├── lib/
│   ├── utils.ts
│   └── utils.test.ts             # Unit tests adjacent to source
├── app/
│   └── api/
│       └── time/
│           ├── route.ts
│           └── route.test.ts     # API route tests
e2e/
├── auth.spec.ts                  # E2E tests in separate directory
├── dashboard.spec.ts
└── navigation.spec.ts
__tests__/
└── integration/                  # Optional: integration tests
    └── data-flow.test.ts
```

## Coverage Goals

### Target Coverage Levels

- **Overall**: 80%+
- **Utilities/Business Logic**: 90%+
- **Components**: 75%+
- **API Routes**: 85%+

### Viewing Coverage Reports

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in a browser to view detailed coverage report.

### Coverage Configuration

In `jest.config.js`:

```javascript
module.exports = {
  // ...
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/**/*.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module '@/...'**
- Solution: Ensure `jest.config.js` has correct `moduleNameMapper`

**Issue**: "ReferenceError: fetch is not defined"**
- Solution: Use Node 18+ or install `whatwg-fetch` polyfill

**Issue**: Tests timeout**
- Solution: Increase timeout in test or fix async handling
  ```typescript
  jest.setTimeout(10000); // 10 seconds
  ```

**Issue**: "Cannot read property of undefined" in component tests**
- Solution: Mock Next.js router, image component, or other dependencies

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing)

## Contributing

When adding new features:
1. Write tests first (TDD) or alongside implementation
2. Ensure all tests pass before submitting PR
3. Maintain or improve coverage percentage
4. Update this document if introducing new testing patterns

---

**Last Updated**: 2026-01-09
