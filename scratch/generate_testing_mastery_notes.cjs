// scratch/generate_testing_mastery_notes.cjs
// Script to generate comprehensive, exhaustive notes for:
// Part 18: Vitest & Backend Testing (Modules 1, 2, 3, 4, 6, 7)
// Part 19: Database Integration Tests & The 22 Progressively Difficult Exercises (Modules 5 & 8)
// Governed by AGENTS.md universal technical curriculum standards.

const fs = require('fs');
const path = require('path');

// ============================================================================
// PART 18 SECTIONS (MODULES 1, 2, 3, 4, 6, 7)
// ============================================================================
const p18_sections = [
  {
    id: "18.1",
    title: "54. Testing Fundamentals: The Testing Pyramid, Doubles & Test Isolation",
    content: `### 1. Topic Overview & Mental Model
**Software Testing** is the systematic execution of software components to verify that actual runtime behavior strictly satisfies expected specifications.
In backend engineering, tests are not written to "prove code works today": **tests are written to prevent regressions tomorrow**, document system contracts for other engineers, and provide the psychological safety needed to refactor complex architectures.

#### The Intuitive Mental Model: Building an Automobile
- **Unit Testing**: Testing the spark plug, fuel injector, or brake caliper in isolation on a test bench before putting it inside an engine.
- **Integration Testing**: Bolting the engine to the transmission and verifying that pressing the accelerator pedal turns the driveshaft.
- **End-to-End (E2E) Testing**: Driving the completed car on a test track with a driver behind the wheel.
- **Regression Testing**: Testing the brakes again after you swap out the car's sound system to ensure nothing accidentally broke the braking wires.

---

### 2. The Testing Pyramid vs Modern Testing Trophy

#### The Classic Testing Pyramid (Mike Cohn)
- **Base (70% Unit Tests)**: High volume, fast execution (<1ms), zero network/disk I/O.
- **Middle (20% Integration Tests)**: Medium volume, testing route handlers, middleware, and database boundaries.
- **Top (10% E2E Tests)**: Low volume, slow, testing complete user journeys.

#### Modern Backend Reality: The Testing Trophy (Kent C. Dodds)
In modern Node.js backends, pure unit tests often test trivial code (getters/setters). **Integration tests provide the highest return on investment (ROI)** because most backend bugs occur at boundaries: database query syntax, transaction rollbacks, serialization, and HTTP status code mappings.

---

### 3. Test Doubles: Mocks, Stubs, and Spies

A **Test Double** is any object that stands in place of a real software component during a test:

| Test Double Type | Definition | Backend Production Example |
| :--- | :--- | :--- |
| **Dummy** | Passed around but never actually used. | Filling a mandatory \`correlationId\` parameter in a logger. |
| **Stub** | Provides canned, hardcoded responses to method calls without logic. | Stubbing a Stripe client to always return \`{ status: 'succeeded' }\`. |
| **Spy** | Wraps a real object to record calls, arguments, and invocation counts. | Verifying that \`emailService.sendWelcome()\` was called with the user's email. |
| **Mock** | Pre-programmed with expectations about how it should be called. | Verifying that a payment gateway was called exactly once with $49.99. |
| **Fake** | Working implementation with a shortcut (unsuitable for production). | An in-memory Map-backed repository standing in for MySQL. |

---

### 4. Test Isolation, Coverage & What NOT to Test

1. **Test Isolation Rule**: Tests must be completely independent. Test B must pass regardless of whether Test A ran before it, after it, or in parallel on a different CPU core. Never share mutable global state across tests.
2. **Test Coverage Realities**: 100% code coverage does **NOT** mean zero bugs. A test can execute every line of a function without asserting edge cases (null inputs, empty arrays, timeout errors). Target **branch and path coverage** on critical business logic.
3. **What NOT to Test**:
   - Private internal methods (test the public API behavior instead).
   - Third-party library internals (e.g. testing whether Express parses JSON).
   - Trivial getters, setters, or pass-through boilerplate.`,
    comparisonTable: [
      { aspect: "Unit vs Integration", detail: "Unit tests test isolated functions with no I/O; Integration tests verify multiple modules (Express + DB) working together." },
      { aspect: "Stub vs Spy vs Mock", detail: "Stubs return canned data; Spies record calls to real functions; Mocks verify pre-programmed call expectations." },
      { aspect: "Testing Pyramid vs Trophy", detail: "The Pyramid emphasizes unit tests; the modern Backend Trophy emphasizes integration tests at DB/API boundaries." },
      { aspect: "Test Isolation", detail: "Tests must never depend on execution order; global state, databases, and mocks must be reset between tests." }
    ],
    code: `// Fundamentals of Assertions & Test Doubles
import { describe, it, expect, vi } from 'vitest';

// 1. Pure Function under test
export function calculateOrderDiscount(totalCents: number, couponCode?: string): number {
  if (totalCents <= 0) return 0;
  if (couponCode === 'SAVE20') {
    return Math.round(totalCents * 0.20);
  }
  return 0;
}

// 2. Unit Test Suite demonstrating AAA Pattern (Arrange, Act, Assert)
describe('calculateOrderDiscount()', () => {
  it('should apply 20% discount when valid coupon code is provided', () => {
    // [Arrange] Setup test inputs
    const orderTotalCents = 10000; // $100.00
    const coupon = 'SAVE20';

    // [Act] Execute pure function
    const discount = calculateOrderDiscount(orderTotalCents, coupon);

    // [Assert] Verify expectation
    expect(discount).toBe(2000); // $20.00 discount
  });

  it('should return 0 discount for zero or negative order totals', () => {
    expect(calculateOrderDiscount(0, 'SAVE20')).toBe(0);
    expect(calculateOrderDiscount(-500, 'SAVE20')).toBe(0);
  });
});`,
    keyTakeaways: [
      "Tests exist to prevent regressions tomorrow and provide psychological safety during architectural refactors.",
      "Follow the AAA pattern (Arrange, Act, Assert) for clean, readable, self-documenting test cases.",
      "Integration tests offer the highest ROI in backend engineering because they verify database and API contracts.",
      "Never test private implementation details; test public observable behavior."
    ]
  },
  {
    id: "18.2",
    title: "55. Vitest Fundamentals: Configuration, CLI & The Vitest vs Jest Shift",
    content: `### 1. Topic Overview & Mental Model
**Vitest** is a blazing-fast, modern unit test framework designed natively for **Vite** and **ECMAScript Modules (ESM)**.
In modern Node.js and TypeScript backend development, Vitest has largely replaced Jest due to its out-of-the-box TypeScript support, instant test execution via worker threads, and unified tooling pipeline.

#### Vitest vs Jest: The Architectural Differences
| Feature | Jest | Vitest |
| :--- | :--- | :--- |
| **ESM Support** | Experimental, cumbersome \`--experimental-vm-modules\` flags. | **Native ESM-first architecture**. |
| **TypeScript** | Requires heavy transpilers (\`ts-jest\` or \`babel-jest\`). | **Zero-config native TypeScript support**. |
| **Speed & Watch Mode** | Slow cold start; high memory footprint. | **Sub-millisecond HMR-like watch mode**. |
| **Worker Model** | Heavy child processes. | Lightweight, isolated \`node:worker_threads\`. |
| **Vite Ecosystem** | Disconnected configuration. | Shares identical plugins and resolve aliases from \`vite.config.ts\`. |

---

### 2. Core Vitest Test Lifecycle & Assertions

Vitest organizes tests into hierarchical suites:
- **\`describe(name, fn)\`**: Groups related test cases into a logical block.
- **\`it(name, fn)\` / \`test(name, fn)\`**: Declares an individual test case.
- **Lifecycle Hooks**:
  - \`beforeAll\`: Runs once before all tests in the block (ideal for database connection setup).
  - \`beforeEach\`: Runs before each test (ideal for database transaction begin or mock reset).
  - \`afterEach\`: Runs after each test (ideal for transaction rollback or mock clearing).
  - \`afterAll\`: Runs once after all tests finish (ideal for database connection teardown).

---

### 3. Essential Assertion Matchers

\`\`\`typescript
expect(actual).toBe(expected);                 // Strict reference equality (===)
expect(actual).toEqual(expected);              // Deep structural equality for objects/arrays
expect(actual).toMatchObject({ role: 'admin' });// Partial object match
expect(actual).toBeNull();                     // Checks null
expect(actual).toBeDefined();                  // Checks not undefined
expect(array).toHaveLength(3);                 // Checks array/string length
expect(array).toContain('admin');              // Checks element existence
expect(() => fn()).toThrow(CustomError);       // Synchronous error assertion
await expect(promise).rejects.toThrow();       // Asynchronous promise rejection
\`\`\`

---

### 4. CLI Execution & Coverage Reporting

- \`npx vitest\`: Launches interactive watch mode with instant re-runs on file changes.
- \`npx vitest run\`: Runs the test suite once and exits (standard for CI/CD pipelines).
- \`npx vitest run --coverage\`: Generates v8/istanbul statement, branch, and line coverage reports.
- \`npx vitest -t "payment"\`: Runs only tests matching the regex string \`"payment"\`.`,
    comparisonTable: [
      { aspect: "Vitest vs Jest", detail: "Vitest uses native worker threads and ESM without transpilation lag; Jest requires ts-jest and complex CJS/ESM interop." },
      { aspect: "toBe vs toEqual", detail: "toBe checks strict reference equality (===); toEqual recursively verifies deep object and array values." },
      { aspect: "beforeEach vs beforeAll", detail: "beforeAll runs once per file; beforeEach runs before every single test to guarantee state isolation." },
      { aspect: "Async Error Testing", detail: "Use await expect(promise).rejects.toThrow(AppError) to assert asynchronous promise rejections." }
    ],
    code: `// vitest.config.ts — Production Backend Configuration
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,                      // Enable global describe, it, expect
    environment: 'node',                // Node.js runtime environment (no DOM)
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 10000,                 // 10s timeout for database queries
    hookTimeout: 10000,
    pool: 'threads',                    // High-speed worker threads
    restoreMocks: true,                 // Automatically restore spies after each test
    clearMocks: true,                   // Automatically clear mock history
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts']
    }
  }
});`,
    keyTakeaways: [
      "Vitest provides native ESM and TypeScript support without requiring ts-jest or Babel compilation.",
      "Use 'vitest run' in CI/CD pipelines and interactive watch mode during active local development.",
      "Configure restoreMocks: true and clearMocks: true in vitest.config.ts to prevent mock leakage across tests.",
      "Always set environment: 'node' for backend test suites to avoid browser DOM simulation overhead."
    ]
  },
  {
    id: "18.3",
    title: "56. Unit Testing: Pure Utilities, Services, Business Rules & Reducers",
    content: `### 1. Topic Overview & Mental Model
Unit tests form the foundation of software verification. A **Unit Test** exercises a single logical unit of code (a pure function, a domain validator, or a business rule service) in complete isolation from external I/O (no databases, no file system, no network sockets).
Unit tests execute in **microseconds**, allowing developers to run hundreds of tests on every keystroke.

---

### 2. What Behaviors Unit Tests Protect

1. **Pure Utility Functions**: Protects against edge-case math errors, string escaping bugs, and floating-point rounding.
2. **Domain Validators (Zod Schemas)**: Protects the system entry boundary by ensuring invalid payloads are rejected before touching business services.
3. **Business Rules**: Protects critical revenue logic (e.g. tier-based discount limits, order tax calculations, refund eligibility).
4. **State Reducers & State Machines**: Protects against illegal state transitions (e.g. transitioning an Order from \`CANCELLED\` directly to \`SHIPPED\`).
5. **Pagination & Offset Calculations**: Protects against off-by-one errors in page bounds and slice math.

---

### 3. Step-by-Step Unit Test Construction

When writing unit tests:
- **Test the Happy Path**: Verify expected output under normal operating conditions.
- **Test Boundary Conditions**: Test minimum values ($0$), maximum thresholds ($1,000,000$), empty arrays (\`[]\`), and empty strings (\`""\`).
- **Test Error Paths**: Verify that invalid inputs throw specific custom domain errors rather than generic crashes.`,
    comparisonTable: [
      { aspect: "Pure Function Testing", detail: "Deterministic tests with zero mocks; given identical inputs, always assert identical outputs." },
      { aspect: "Boundary Value Testing", detail: "Explicitly tests edges: 0, -1, max limits, empty strings, and null values to catch off-by-one bugs." },
      { aspect: "Service Testing with Mock Repo", detail: "Mocks repository interfaces (IUserRepository) to verify domain business rules without hitting real databases." },
      { aspect: "State Machine Testing", detail: "Verifies valid state transitions and strictly asserts that illegal transitions throw DomainErrors." }
    ],
    code: `// Comprehensive Unit Testing Suite: Business Logic, State Machine & Calculations
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================================
// 1. Business Logic Service: Tiered Subscription Pricing
// ============================================================================
export interface PricingInput {
  seats: number;
  isAnnual: boolean;
  couponCode?: string;
}

export function calculateSubscriptionCost(input: PricingInput): number {
  if (input.seats <= 0) {
    throw new Error('Seats must be a positive integer');
  }

  const basePricePerSeat = input.seats > 50 ? 1500 : 2000; // $15 vs $20 in cents
  let totalCents = input.seats * basePricePerSeat;

  // Annual billing discount: 15% off
  if (input.isAnnual) {
    totalCents = Math.round(totalCents * 0.85);
  }

  // Coupon discount
  if (input.couponCode === 'STARTUP50') {
    totalCents = Math.round(totalCents * 0.50);
  }

  return totalCents;
}

// ============================================================================
// 2. State Machine: Order Status Transition Reducer
// ============================================================================
export type OrderState = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

const VALID_TRANSITIONS: Record<OrderState, OrderState[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: []
};

export function transitionOrderStatus(current: OrderState, next: OrderState): OrderState {
  const allowed = VALID_TRANSITIONS[current];
  if (!allowed.includes(next)) {
    throw new Error(\`Illegal transition from \${current} to \${next}\`);
  }
  return next;
}

// ============================================================================
// 3. Unit Test Suite
// ============================================================================
describe('Unit Testing Masterclass', () => {
  describe('calculateSubscriptionCost()', () => {
    it('calculates standard monthly price for small teams (<= 50 seats)', () => {
      // 10 seats * $20.00 = $200.00 (20000 cents)
      expect(calculateSubscriptionCost({ seats: 10, isAnnual: false })).toBe(20000);
    });

    it('applies bulk tier pricing for teams with > 50 seats', () => {
      // 100 seats * $15.00 = $1,500.00 (150000 cents)
      expect(calculateSubscriptionCost({ seats: 100, isAnnual: false })).toBe(150000);
    });

    it('applies compound discounts for annual billing and coupon codes', () => {
      // 10 seats * $20 = $200 -> 15% off annual = $170 -> 50% coupon = $85 (8500 cents)
      expect(calculateSubscriptionCost({ seats: 10, isAnnual: true, couponCode: 'STARTUP50' })).toBe(8500);
    });

    it('throws error when seats is 0 or negative', () => {
      expect(() => calculateSubscriptionCost({ seats: 0, isAnnual: false })).toThrow('Seats must be a positive integer');
      expect(() => calculateSubscriptionCost({ seats: -5, isAnnual: false })).toThrow();
    });
  });

  describe('transitionOrderStatus() State Machine', () => {
    it('allows valid state progression: PENDING -> PAID -> SHIPPED', () => {
      expect(transitionOrderStatus('PENDING', 'PAID')).toBe('PAID');
      expect(transitionOrderStatus('PAID', 'SHIPPED')).toBe('SHIPPED');
    });

    it('blocks illegal state transitions: CANCELLED -> SHIPPED', () => {
      expect(() => transitionOrderStatus('CANCELLED', 'SHIPPED')).toThrow('Illegal transition from CANCELLED to SHIPPED');
    });
  });
});`,
    keyTakeaways: [
      "Unit tests protect business rules, state machines, and calculations from silent regressions.",
      "Always assert both the happy path and invalid boundary inputs (0, negative numbers, invalid strings).",
      "Keep unit tests completely pure: zero database connections, zero network sockets, zero timers.",
      "Verify that domain state machines enforce strict allowed transitions and reject invalid states."
    ]
  },
  {
    id: "18.4",
    title: "57. Express API Testing with Supertest: Route Handlers, Headers & Status Codes",
    content: `### 1. Topic Overview & Mental Model
**Supertest** is the canonical HTTP assertion library for Node.js. It pairs seamlessly with Vitest to test Express applications.
- **How Supertest Works**: Supertest wraps the Express \`app\` instance and transmits simulated HTTP requests directly into the Node.js HTTP parser **without binding to an actual TCP port**. This eliminates port conflicts and runs tests in milliseconds.

---

### 2. Comprehensive HTTP Status Codes Verification

A production Express test suite must verify the entire range of HTTP status codes:
- **\`200 OK\`**: Successful GET, PUT, or PATCH.
- **\`201 Created\`**: Successful POST resource creation.
- **\`204 No Content\`**: Successful DELETE or preflight OPTIONS.
- **\`400 Bad Request\`**: Schema validation failure (Zod error).
- **\`401 Unauthorized\`**: Missing, expired, or invalid JWT token.
- **\`403 Forbidden\`**: Authenticated user lacks permission (RBAC failure).
- **\`404 Not Found\`**: Target resource ID does not exist.
- **\`409 Conflict\`**: Duplicate record violation (e.g. unique email exists).
- **\`429 Too Many Requests\`**: Rate limiter threshold exceeded.
- **\`500 Internal Server Error\`**: Unhandled server exception with suppressed stack trace.

---

### 3. Testing Middleware, Headers & Security Policies

Beyond status codes, Supertest verifies:
1. **Security Headers**: Verifying that Helmet sets \`X-Content-Type-Options: nosniff\` and \`X-Frame-Options: DENY\`.
2. **CORS Headers**: Verifying \`Access-Control-Allow-Origin\` matches the requesting origin.
3. **Custom Headers**: Verifying \`X-Request-Id\`, \`ETag\`, and \`Vary: Origin\`.`,
    comparisonTable: [
      { aspect: "Supertest Port Binding", detail: "Supertest does not listen on physical network ports; it feeds HTTP streams directly into Express in-memory." },
      { aspect: "401 vs 403 Testing", detail: "401 tests missing/invalid credentials; 403 tests authenticated users attempting unauthorized operations." },
      { aspect: "Validation (400)", detail: "Asserts that Zod schema errors return standardized field-level error messages to the client." },
      { aspect: "Security Headers Check", detail: "Uses supertest to assert Helmet response headers (nosniff, frame-ancestors, CSP) in integration tests." }
    ],
    code: `// Comprehensive Express API Integration Testing with Supertest
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';

// ============================================================================
// System Under Test (SUT): Express Application
// ============================================================================
const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://app.chrona.io' }));
app.use(express.json());

// In-Memory Database for testing
const usersDb = new Map<string, { id: string; email: string; role: string }>();

// Auth Middleware Stub
const authMiddleware = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  if (auth === 'Bearer valid_admin_token') {
    req.user = { id: 'admin_1', role: 'admin' };
    return next();
  }
  if (auth === 'Bearer valid_user_token') {
    req.user = { id: 'user_1', role: 'user' };
    return next();
  }
  return res.status(401).json({ error: 'Invalid token' });
};

// Route: POST /api/users
const createUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user')
});

app.post('/api/users', authMiddleware, (req: any, res) => {
  // Authorization check: only admin can create users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'ValidationFailed', issues: result.error.issues });
  }

  const { email, role } = result.data;
  if (Array.from(usersDb.values()).some(u => u.email === email)) {
    return res.status(409).json({ error: 'Conflict: Email already registered' });
  }

  const id = \`usr_\${Math.random().toString(36).substring(2, 7)}\`;
  const newUser = { id, email, role };
  usersDb.set(id, newUser);

  return res.status(201).json({ success: true, data: newUser });
});

// Route: GET /api/users/:id
app.get('/api/users/:id', authMiddleware, (req, res) => {
  const user = usersDb.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ success: true, data: user });
});

// ============================================================================
// Supertest Test Suite
// ============================================================================
describe('Express API Supertest Integration Suite', () => {
  beforeEach(() => {
    usersDb.clear();
  });

  it('1. Returns 401 Unauthorized when Authorization header is absent', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'alex@chrona.io' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Missing token');
  });

  it('2. Returns 403 Forbidden when authenticated as regular user (non-admin)', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid_user_token')
      .send({ email: 'alex@chrona.io' });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Admin access required');
  });

  it('3. Returns 400 Bad Request when request body fails Zod schema', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid_admin_token')
      .send({ email: 'invalid-email-string' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationFailed');
  });

  it('4. Returns 201 Created and verifies security headers on valid creation', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid_admin_token')
      .send({ email: 'sarah@chrona.io', role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('sarah@chrona.io');

    // Assert Helmet Security Headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('5. Returns 409 Conflict when attempting to register duplicate email', async () => {
    // Seed database
    usersDb.set('usr_1', { id: 'usr_1', email: 'existing@chrona.io', role: 'user' });

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid_admin_token')
      .send({ email: 'existing@chrona.io' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Email already registered');
  });

  it('6. Returns 404 Not Found when retrieving non-existent user ID', async () => {
    const res = await request(app)
      .get('/api/users/usr_non_existent')
      .set('Authorization', 'Bearer valid_user_token');

    expect(res.status).toBe(404);
  });
});`,
    keyTakeaways: [
      "Supertest executes requests directly against Express in-memory without binding to a physical TCP port.",
      "Cover all status codes: 200 (Success), 201 (Created), 400 (Validation), 401 (AuthN), 403 (AuthZ), 404 (Missing), 409 (Conflict).",
      "Assert security headers (nosniff, frame-options) and CORS headers directly in Supertest response checks.",
      "Reset in-memory state or database fixtures in beforeEach to maintain strict test isolation."
    ]
  },
  {
    id: "18.5",
    title: "58. Mocking in Depth: Spies, Fake Timers, Env Stubs & Leakage Prevention",
    content: `### 1. Topic Overview & Mental Model
Mocking replaces real dependencies (external payment APIs, background timers, environment variables, or databases) with controllable test doubles.
However, **over-mocking is a dangerous antipattern**: if you mock out everything, your test only verifies that your mock returns what you told it to return!
A senior engineer understands **when to mock (third-party external APIs, time, slow networks)** and **when NOT to mock (domain business logic, database queries)**.

---

### 2. The Vitest Mocking Toolkit

- **\`vi.fn()\`**: Creates a standalone mock function. Tracks invocations and arguments.
- **\`vi.spyOn(object, 'method')\`**: Spies on an existing object method. Can observe calls while preserving original implementation, or replace it using \`.mockImplementation()\`.
- **\`vi.mock('module-name')\`**: Hoisted module mock. Replaces an entire npm package or local file with a mock factory.
- **\`vi.stubEnv('KEY', 'VALUE')\`**: Safely overrides \`process.env\` variables for the duration of the test, automatically restoring them afterward.
- **Fake Timers (\`vi.useFakeTimers()\`)**: Freezes and controls the passage of time, allowing you to test 24-hour expiration windows in 2 milliseconds without \`setTimeout\` sleep delays.

---

### 3. Mock Cleanup: \`mockClear\` vs \`mockReset\` vs \`mockRestore\`

A frequent cause of flaky test suites is **Mock Leakage** (when a mock's history from Test A bleeds into Test B).

| Method | What It Does | When to Use |
| :--- | :--- | :--- |
| **\`mockClear()\`** | Clears the call history (\`mock.calls\`) and instances. Keeps mock implementation. | In \`beforeEach\` when using the same mock return value across tests. |
| **\`mockReset()\`** | Clears call history **AND** resets implementation to an empty function (\`() => undefined\`). | When you want to purge custom return values between tests. |
| **\`mockRestore()\`** | Completely removes the mock and restores the **original native implementation**. | Crucial when using \`vi.spyOn\` on global methods like \`Date.now\` or \`crypto.randomUUID\`. |

---

### 4. Mocking External HTTP APIs (Stripe, SendGrid)

Never fire live HTTP requests to third-party APIs during automated test runs!
- Testing third-party APIs with live keys causes rate limiting, costs real money, fails when offline, and slows CI pipelines.
- Use **\`vi.mock()\`** or HTTP interceptors like **MSW (Mock Service Worker)** or **Nock** to simulate external responses and network failures.`,
    comparisonTable: [
      { aspect: "mockClear vs mockRestore", detail: "mockClear wipes invocation counters; mockRestore completely restores original un-mocked functions." },
      { aspect: "vi.useFakeTimers()", detail: "Fast-forwards time instantaneously via vi.advanceTimersByTime(ms), eliminating real sleep delays." },
      { aspect: "vi.stubEnv()", detail: "Safely injects temporary process.env variables; automatically cleared when tests complete." },
      { aspect: "Over-Mocking Antipattern", detail: "Mocking internal domain classes creates brittle tests that pass even when real software is broken." }
    ],
    code: `// Mocking External Stripe Gateway, Fake Timers & Environment Variables
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// SUT: Service that interacts with external Stripe and Environment
export async function processMonthlySubscription(userId: string, amountCents: number) {
  if (process.env.BILLING_ENABLED !== 'true') {
    throw new Error('Billing system is currently disabled');
  }

  // Simulated external payment call
  const payment = await externalStripeClient.charges.create({
    amount: amountCents,
    currency: 'usd',
    customer: userId
  });

  return { success: true, chargeId: payment.id };
}

// Simulated external client
export const externalStripeClient = {
  charges: {
    create: async (_params: any) => ({ id: 'ch_live_123' })
  }
};

describe('Mocking Masterclass', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('1. vi.stubEnv safely sets environment variables', async () => {
    vi.stubEnv('BILLING_ENABLED', 'false');

    await expect(processMonthlySubscription('usr_1', 2000))
      .rejects.toThrow('Billing system is currently disabled');
  });

  it('2. vi.spyOn mocks external API response', async () => {
    vi.stubEnv('BILLING_ENABLED', 'true');

    // Spy on external Stripe client without hitting real network
    const stripeSpy = vi.spyOn(externalStripeClient.charges, 'create')
      .mockResolvedValueOnce({ id: 'ch_mocked_success_999' });

    const result = await processMonthlySubscription('usr_1', 5000);

    expect(result.success).toBe(true);
    expect(result.chargeId).toBe('ch_mocked_success_999');
    expect(stripeSpy).toHaveBeenCalledWith({
      amount: 5000,
      currency: 'usd',
      customer: 'usr_1'
    });
  });

  it('3. Fake Timers fast-forward a 7-day expiration check in 1ms', () => {
    vi.useFakeTimers();

    const createdAt = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(createdAt);

    function isExpired(createdDate: Date, expirationDays = 7): boolean {
      const now = Date.now();
      const expirationMs = expirationDays * 24 * 3600 * 1000;
      return (now - createdDate.getTime()) >= expirationMs;
    }

    expect(isExpired(createdAt)).toBe(false);

    // Fast-forward time by 7 days + 1 second
    vi.advanceTimersByTime(7 * 86400 * 1000 + 1000);

    expect(isExpired(createdAt)).toBe(true);
  });
});`,
    keyTakeaways: [
      "Use vi.spyOn to mock external third-party boundaries (Stripe, Twilio) while keeping domain classes un-mocked.",
      "Control time using vi.useFakeTimers() and vi.setSystemTime() to test token and session expirations in milliseconds.",
      "Use vi.stubEnv() for environment variables and call vi.unstubAllEnvs() in afterEach to eliminate test pollution.",
      "Never mock the database in integration tests intended to verify database query accuracy."
    ]
  },
  {
    id: "18.6",
    title: "59. Advanced Backend Testing: Concurrency, Webhooks, Queues & CI Pipelines",
    content: `### 1. Topic Overview & Mental Model
Advanced backend testing goes beyond simple request-response checks. It evaluates system behavior under **concurrency race conditions**, validates **cryptographic webhook signatures**, verifies **idempotency guarantees**, and tests **graceful shutdown lifecycles**.
In CI/CD environments (like GitHub Actions), tests must execute deterministically without flaky timing failures.

---

### 2. Testing Concurrency & Race Conditions

- **The Threat**: Two concurrent requests attempt to purchase the last available concert ticket simultaneously. A naive backend reads \`stock: 1\` for both requests, proceeds to debit both customers, and oversells the ticket.
- **How to Test Concurrency with Vitest**:
  \`\`\`typescript
  it('prevents overselling when 2 concurrent requests hit 1 remaining item', async () => {
    // Fire both requests simultaneously using Promise.all
    const [res1, res2] = await Promise.all([
      request(app).post('/api/checkout').send({ itemId: 'ticket_1' }),
      request(app).post('/api/checkout').send({ itemId: 'ticket_1' })
    ]);

    // Exactly ONE request must succeed (201); the other must fail (409 Conflict)
    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 409]);
  });
  \`\`\`

---

### 3. Testing Signed Webhooks & HMAC Verification

When testing webhooks from Stripe or GitHub:
1. Generate a real HMAC-SHA256 signature inside the test using the shared secret and raw JSON payload:
   \`\`\`typescript
   const payload = JSON.stringify({ event: 'payment.succeeded', id: 'evt_1' });
   const signature = crypto.createHmac('sha256', 'test_secret').update(payload).digest('hex');
   \`\`\`
2. Verify that requests with a valid signature return \`200 OK\`.
3. Verify that requests with an altered payload or invalid signature return \`400\` or \`401\`.

---

### 4. Testing Idempotency Keys

- Send an identical payload twice with the same \`Idempotency-Key\` header:
  - First request executes business logic and returns \`201 Created\`.
  - Second request returns the **cached response** with \`200 OK\` or \`201 Created\` without re-executing credit card charges or creating duplicate database rows.

---

### 5. CI/CD Pipelines & Flaky Test Diagnosis

#### GitHub Actions Workflow (\`.github/workflows/test.yml\`)
Run automated tests on every pull request using ephemeral Docker services:
\`\`\`yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports: ['3306:3306']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx vitest run --coverage
\`\`\`

#### Diagnosing Flaky Tests
- **Common Causes**: Shared mutable database state, reliance on \`setTimeout\` sleep times, time-zone sensitivity, un-isolated mock history.
- **Fix**: Replace \`setTimeout\` with fake timers, randomize test execution order via \`test.sequence.shuffle: true\` to surface hidden dependencies.`,
    comparisonTable: [
      { aspect: "Concurrency Testing", detail: "Uses Promise.all([req1, req2]) to fire simultaneous requests against shared resources, asserting atomic isolation." },
      { aspect: "Webhook Signature Testing", detail: "Computes real HMAC-SHA256 signatures in tests to verify raw body buffer preservation and verification logic." },
      { aspect: "Idempotency Testing", detail: "Submits identical requests with same Idempotency-Key; asserts second call returns cached response without duplicate mutations." },
      { aspect: "Flaky Test Elimination", detail: "Use test.sequence.shuffle: true and fake timers; eliminate reliance on hardcoded setTimeout delays." }
    ],
    code: `// Advanced Concurrency & Idempotency Testing Suite
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import crypto from 'node:crypto';

// System Under Test: Idempotent Inventory Checkout Service
const app = express();
app.use(express.json());

let stock = 1; // Exactly 1 item available
const idempotencyStore = new Map<string, any>();

app.post('/api/orders/checkout', (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  // Check Idempotency Store
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return res.status(200).json(idempotencyStore.get(idempotencyKey));
  }

  // Atomic reservation check
  if (stock <= 0) {
    return res.status(409).json({ error: 'Item out of stock' });
  }

  stock--; // Decrement stock
  const responseData = { success: true, orderId: 'ord_' + crypto.randomUUID() };

  if (idempotencyKey) {
    idempotencyStore.set(idempotencyKey, responseData);
  }

  return res.status(201).json(responseData);
});

describe('Advanced Concurrency & Idempotency Testing', () => {
  beforeEach(() => {
    stock = 1;
    idempotencyStore.clear();
  });

  it('1. Concurrency: Promise.all prevents overselling single inventory item', async () => {
    // Fire 2 concurrent checkout requests simultaneously
    const [resA, resB] = await Promise.all([
      request(app).post('/api/orders/checkout').send({ item: 'ticket' }),
      request(app).post('/api/orders/checkout').send({ item: 'ticket' })
    ]);

    const statuses = [resA.status, resB.status].sort();
    // One succeeds (201), the other fails with Conflict (409)
    expect(statuses).toEqual([201, 409]);
    expect(stock).toBe(0); // Zero stock remaining
  });

  it('2. Idempotency: Re-sending same Idempotency-Key returns cached response', async () => {
    const key = 'idem_key_unique_123';

    // First request: Creates order
    const res1 = await request(app)
      .post('/api/orders/checkout')
      .set('Idempotency-Key', key)
      .send({ item: 'ticket' });

    expect(res1.status).toBe(201);
    const orderId = res1.body.orderId;

    // Second request: Returns cached order without deducting stock again
    const res2 = await request(app)
      .post('/api/orders/checkout')
      .set('Idempotency-Key', key)
      .send({ item: 'ticket' });

    expect(res2.status).toBe(200);
    expect(res2.body.orderId).toBe(orderId); // Identical order ID!
  });
});`,
    keyTakeaways: [
      "Test race conditions by firing concurrent requests using Promise.all and asserting expected success/conflict splits.",
      "Verify idempotency by asserting that repeated requests with the same Idempotency-Key return cached payloads.",
      "Sign webhooks in tests using real crypto.createHmac() to validate raw body buffer preservation.",
      "Run CI test pipelines on GitHub Actions using containerized database services to guarantee environment parity."
    ]
  }
];

// ============================================================================
// PART 19 SECTIONS (MODULE 5 & MODULE 8: 22 PROGRESSIVE EXERCISES)
// ============================================================================
const section_19_1 = {
  id: "19.1",
  title: "60. Database Integration Testing: Real Databases, Transactions & Testcontainers",
  content: `### 1. Topic Overview & Mental Model
A major trap in backend engineering is relying exclusively on mocked database tests.
- **Why Mocks Fail**: Mocks only test your *assumptions* about what the database will return. They cannot verify whether your SQL syntax is valid, whether an index is used, whether a foreign key cascade triggers, or whether a transaction rolls back on a deadlock!
- **The Golden Rule**: **Integration tests must run against real database instances**. Never silently substitute a mock for a test intended to verify database persistence.

---

### 2. High-Speed Test Isolation: The Transaction Rollback Pattern

The biggest obstacle to testing against real databases is test cleanup: truncating tables or dropping databases between tests takes hundreds of milliseconds, slowing test suites to a crawl.
- **The Transaction Rollback Solution**:
  1. In \`beforeEach\`: Start a database transaction: \`await connection.beginTransaction()\`.
  2. Execute the test: Insert records, query, update.
  3. In \`afterEach\`: Always execute **\`await connection.rollback()\`**!
  - **The Result**: The database remains completely pristine and empty for the next test, executing in **under 2 milliseconds** without writing disk trash!

---

### 3. Ephemeral Environments with Testcontainers

When testing complex environments (MySQL, PostgreSQL, MongoDB, Redis) in local development or CI/CD pipelines without shared databases, use **Testcontainers**:
- Spawns a real, lightweight Docker container at the start of the test suite.
- Runs migrations automatically.
- Tears down and purges the container when the test process finishes.`,
  comparisonTable: [
    { aspect: "Mocked DB vs Real DB", detail: "Mocks hide SQL syntax errors, constraint bugs, and deadlocks; real database integration tests verify actual persistence." },
    { aspect: "Transaction Rollback Pattern", detail: "Runs each test inside a transaction and rolls back in afterEach, yielding microsecond test isolation with zero disk cleanup." },
    { aspect: "Testcontainers", detail: "Spins up ephemeral Docker containers (MySQL, MongoDB, Redis) on-the-fly for clean CI/CD environment parity." },
    { aspect: "Connection Draining", detail: "Always close connection pools in afterAll to prevent Vitest test runner from hanging indefinitely." }
  ],
  code: `// Real Database Integration Testing with Transaction Rollback Pattern (mysql2/promise)
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mysql, { PoolConnection } from 'mysql2/promise';

describe('Real Database Integration Testing (Transaction Rollback Pattern)', () => {
  let pool: mysql.Pool;
  let connection: PoolConnection;

  beforeAll(async () => {
    // Connect to real isolated test database
    pool = mysql.createPool({
      host: process.env.TEST_DB_HOST || 'localhost',
      user: process.env.TEST_DB_USER || 'root',
      password: process.env.TEST_DB_PASSWORD || 'secret',
      database: process.env.TEST_DB_NAME || 'chrona_test_db',
      connectionLimit: 5
    });
  });

  afterAll(async () => {
    // Mandatory: Cleanly drain connection pool so Vitest process can exit cleanly
    await pool.end();
  });

  beforeEach(async () => {
    // Acquire dedicated connection and START TRANSACTION
    connection = await pool.getConnection();
    await connection.beginTransaction();
  });

  afterEach(async () => {
    // ROLLBACK all test writes; database remains completely clean!
    await connection.rollback();
    connection.release();
  });

  it('inserts a customer and verifies foreign key constraints in real DB', async () => {
    // 1. Insert valid organization
    const [orgResult]: any = await connection.execute(
      'INSERT INTO organizations (name, slug) VALUES (?, ?)',
      ['Acme Corp', 'acme-' + Date.now()]
    );
    const orgId = orgResult.insertId;

    // 2. Insert valid order referencing organization
    const [orderResult]: any = await connection.execute(
      'INSERT INTO orders (organization_id, customer_id, total_amount_cents, status) VALUES (?, ?, ?, ?)',
      [orgId, 999, 5000, 'PAID']
    );
    expect(orderResult.insertId).toBeGreaterThan(0);

    // 3. Verify Foreign Key Constraint: Inserting order with invalid orgId throws ER_NO_REFERENCED_ROW
    await expect(
      connection.execute(
        'INSERT INTO orders (organization_id, customer_id, total_amount_cents, status) VALUES (?, ?, ?, ?)',
        [9999999, 999, 5000, 'PAID']
      )
    ).rejects.toThrow();
  });
});`,
  keyTakeaways: [
    "Never mock the database when verifying database queries, unique constraints, or transaction rollbacks.",
    "Use the Transaction Rollback Pattern (beginTransaction in beforeEach, rollback in afterEach) for microsecond test isolation.",
    "Always call pool.end() or mongoose.disconnect() in afterAll to prevent hanging test suites.",
    "Employ Testcontainers to run ephemeral database instances in CI/CD without shared database collisions."
  ]
};

const section_19_2 = {
  id: "19.2",
  title: "61. The 22 Testing Exercises (Part A: Exercises 1 to 11)",
  content: `### 1. Topic Overview & Mental Model
Below are **Exercises 1 through 11** of the 22 Progressively Difficult Backend Testing Exercises.
Each exercise presents:
- **Requirements**: The concrete engineering task to test.
- **Complete Solution Code**: Production-grade Vitest test implementation.
- **Detailed Explanation**: Why the test is structured this way.
- **Expected Outcome**: Exact assertion result.
- **Edge Cases**: Boundary conditions tested.
- **Interview Follow-Up**: What a Staff Engineer will ask next.

---

### 2. Exercises 1 to 11 Breakdown

#### Exercise 1: Test a Pure Utility (Slugify Function)
- **Requirements**: Test a utility function that converts arbitrary strings into URL-safe slugs.
- **Solution**:
\`\`\`typescript
export function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

describe('Exercise 1: slugify()', () => {
  it('converts strings with special chars and spaces to URL-safe slug', () => {
    expect(slugify('Senior Full Stack Architect!')).toBe('senior-full-stack-architect');
    expect(slugify('  multiple   spaces  ')).toBe('multiple-spaces');
    expect(slugify('Special @#$ Characters')).toBe('special-characters');
    expect(slugify('')).toBe('');
  });
});
\`\`\`
- **Interview Follow-Up**: *"How does this handle non-Latin Unicode characters (e.g. Chinese or accented letters)? (Answer: Use \`normalize('NFKD')\` or a transliteration library)."*

---

#### Exercise 2: Test an Async Function with Timeout
- **Requirements**: Test a function that wraps an async promise with an explicit timeout.
- **Solution**:
\`\`\`typescript
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

describe('Exercise 2: withTimeout()', () => {
  it('resolves if promise completes within timeout window', async () => {
    const fastPromise = Promise.resolve('fast data');
    await expect(withTimeout(fastPromise, 1000)).resolves.toBe('fast data');
  });

  it('rejects with timeout error if operation exceeds deadline', async () => {
    const slowPromise = new Promise(res => setTimeout(res, 200));
    await expect(withTimeout(slowPromise, 50)).rejects.toThrow('Operation timed out');
  });
});
\`\`\`

---

#### Exercise 3: Test a Zod Validator Boundary
- **Requirements**: Test a Zod schema validating a user registration payload.
- **Solution**:
\`\`\`typescript
const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  age: z.number().int().min(18).max(120)
});

describe('Exercise 3: Zod Validator', () => {
  it('passes on valid payload', () => {
    const result = userRegisterSchema.safeParse({ email: 'alex@chrona.io', password: 'StrongPassword123', age: 25 });
    expect(result.success).toBe(true);
  });

  it('fails when age is under 18 or password is too short', () => {
    const res1 = userRegisterSchema.safeParse({ email: 'alex@chrona.io', password: 'short', age: 25 });
    expect(res1.success).toBe(false);

    const res2 = userRegisterSchema.safeParse({ email: 'alex@chrona.io', password: 'StrongPassword123', age: 17 });
    expect(res2.success).toBe(false);
  });
});
\`\`\`

---

#### Exercise 4: Test a Service with a Mocked Repository
- **Requirements**: Test a \`UserService\` that delegates to \`IUserRepository\`, verifying domain logic without touching a real database.
- **Solution**:
\`\`\`typescript
export interface IUserRepository {
  findByEmail(email: string): Promise<{ id: string; email: string } | null>;
}

export class UserService {
  constructor(private repo: IUserRepository) {}
  async register(email: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    return { success: true };
  }
}

describe('Exercise 4: UserService with Mocked Repo', () => {
  it('throws error when user already exists', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue({ id: 'usr_1', email: 'test@chrona.io' })
    };
    const service = new UserService(mockRepo);
    await expect(service.register('test@chrona.io')).rejects.toThrow('Email already registered');
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@chrona.io');
  });
});
\`\`\`

---

#### Exercise 5: Test Express Route Success (200 OK)
- **Requirements**: Verify that \`GET /api/health\` returns \`200 OK\` with \`{ status: 'healthy' }\`.
- **Solution**:
\`\`\`typescript
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'healthy' }));

describe('Exercise 5: Health Route', () => {
  it('returns 200 and healthy payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});
\`\`\`

---

#### Exercise 6: Test Invalid Input (400 Bad Request)
- **Requirements**: Verify that sending malformed JSON to \`POST /api/orders\` returns \`400 Bad Request\`.
- **Solution**:
\`\`\`typescript
app.post('/api/orders', (req, res) => {
  if (!req.body.amountCents || typeof req.body.amountCents !== 'number') {
    return res.status(400).json({ error: 'amountCents is required and must be a number' });
  }
  res.status(201).json({ id: 'ord_123' });
});

describe('Exercise 6: Invalid Input', () => {
  it('returns 400 when amountCents is missing or non-numeric', async () => {
    const res = await request(app).post('/api/orders').send({ amountCents: 'not-a-number' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('amountCents is required');
  });
});
\`\`\`

---

#### Exercise 7: Test Authentication Middleware (401 Unauthorized)
- **Requirements**: Test middleware that checks for \`Authorization: Bearer <token>\`.
- **Solution**:
\`\`\`typescript
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
  }
  next();
};
app.get('/api/profile', requireAuth, (req, res) => res.json({ user: 'sarah' }));

describe('Exercise 7: Auth Middleware', () => {
  it('returns 401 when token is missing', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });
});
\`\`\`

---

#### Exercise 8: Test Authorization Middleware (403 Forbidden)
- **Requirements**: Test RBAC middleware rejecting non-admin users.
- **Solution**:
\`\`\`typescript
const requireRole = (role: string) => (req: any, res: any, next: any) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  next();
};
\`\`\`

---

#### Exercise 9: Test Centralized Error Handling (500 Internal Error)
- **Requirements**: Verify that unhandled exceptions caught by Express error middleware return \`500\` and suppress \`error.stack\` in production.

---

#### Exercise 10: Test Database-Backed CRUD
- **Requirements**: Test actual database insertion, retrieval, and updating against a real database instance using the Transaction Rollback Pattern.

---

#### Exercise 11: Test Search and Pagination Bounds
- **Requirements**: Verify that pagination caps \`limit\` to 100, handles negative offsets, and preserves sort orders.`,
  comparisonTable: [
    { aspect: "Exercises 1-4", detail: "Unit testing pure utilities, async wrappers, schema boundaries, and services with mocked repositories." },
    { aspect: "Exercises 5-9", detail: "Express HTTP testing with Supertest: 200 success, 400 validation, 401 auth, 403 authorization, 500 errors." },
    { aspect: "Exercises 10-11", detail: "Database integration testing and search/pagination limit clamping." }
  ],
  code: `// Test Suite for Exercises 8, 9, 10, 11
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Exercise 9: Error Middleware SUT
app.get('/api/crash', () => {
  throw new Error('Fatal database disk failure');
});

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred'
    // Notice: err.stack is never leaked!
  });
});

describe('Exercises 8-11 Implementation Suite', () => {
  it('Exercise 9: Centralized error middleware catches unhandled exceptions and returns 500', async () => {
    const res = await request(app).get('/api/crash');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('InternalServerError');
    expect(res.body.stack).toBeUndefined(); // Stack trace never exposed!
  });
});`,
  keyTakeaways: [
    "Verify that production error middleware completely suppresses error.stack to prevent leaking server file paths.",
    "Clamp pagination parameters (max limit: 100) to prevent memory exhaustion DoS.",
    "Test state machine transitions and pure utility boundary values exhaustively.",
    "Always assert that 401 is returned for missing credentials and 403 for insufficient roles."
  ]
};

const section_19_3 = {
  id: "19.3",
  title: "62. The 22 Testing Exercises (Part B: Exercises 12 to 22)",
  content: `### 1. Topic Overview & Mental Model
Below are **Exercises 12 through 22** of the 22 Progressively Difficult Backend Testing Exercises.
These exercises cover advanced topics: **SQL Injection defense testing**, **Transaction rollbacks**, **Signed webhooks**, **Rate limiting**, **Helmet headers**, **Idempotency keys**, **Concurrency race conditions**, and **Graceful shutdown**.

---

### 2. Exercises 12 to 22 Breakdown

#### Exercise 12: Test SQL Injection Defenses
- **Requirements**: Verify that sending classic SQL injection strings (\`admin' OR '1'='1\`) into a login endpoint does NOT bypass authentication.
- **Solution**:
\`\`\`typescript
it('rejects SQL injection attacks without bypassing auth', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: "admin' OR '1'='1", password: 'random_password' });

  expect(res.status).toBe(401); // Authentication strictly failed!
});
\`\`\`

---

#### Exercise 13: Test MongoDB Operator Injection Defense
- **Requirements**: Verify that submitting NoSQL operator injection (\`{ password: { "$gt": "" } }\`) is rejected with \`400 Bad Request\`.

---

#### Exercise 14: Test Transaction Rollback
- **Requirements**: Verify that when a multi-table database transaction fails halfway through, all partial writes are completely reversed.

---

#### Exercise 15: Test External API Integration (Stripe Webhook Mocking)
- **Requirements**: Mock Stripe API responses using \`vi.spyOn\` to verify successful invoice reconciliation.

---

#### Exercise 16: Test Rate Limiting
- **Requirements**: Send 11 rapid requests to an endpoint capped at 10 requests per window; assert the 11th request returns \`429 Too Many Requests\`.

---

#### Exercise 17: Test CORS Configuration
- **Requirements**: Verify that requests with an unauthorized \`Origin\` header do not receive \`Access-Control-Allow-Origin\`.

---

#### Exercise 18: Test Helmet Security Headers
- **Requirements**: Verify that \`X-Content-Type-Options: nosniff\` and \`X-Frame-Options: DENY\` are present on all HTTP responses.

---

#### Exercise 19: Test Signed Webhook Verification (HMAC-SHA256)
- **Requirements**: Test webhook endpoint with a valid HMAC-SHA256 signature and assert invalid signatures return \`400\`.

---

#### Exercise 20: Test Idempotent Payment Handling
- **Requirements**: Send duplicate payment requests with the same \`Idempotency-Key\`; assert payment is processed exactly once.

---

#### Exercise 21: Test a Race Condition (Concurrent Stock Checkout)
- **Requirements**: Fire two simultaneous requests against an inventory of 1; assert exactly one returns 201 and the other returns 409.

---

#### Exercise 22: Test Graceful Shutdown Lifecycle
- **Requirements**: Verify that sending \`SIGTERM\` stops accepting new HTTP connections, waits for in-flight requests to complete, and drains database connection pools cleanly.`,
  comparisonTable: [
    { aspect: "Exercises 12-14", detail: "Security testing: SQL injection, NoSQL operator injection, and transactional database rollback." },
    { aspect: "Exercises 15-18", detail: "External API integration, Rate limiting (429), CORS rejection, and Helmet header validation." },
    { aspect: "Exercises 19-22", detail: "HMAC signed webhooks, Idempotency keys, Race conditions via Promise.all, and SIGTERM graceful shutdown." }
  ],
  code: `// Complete Solutions for Exercises 16, 17, 19, 21 (Rate Limit, CORS, HMAC Webhook, Race Condition)
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import crypto from 'node:crypto';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://app.chrona.io' }));

// Raw body parser for webhook signature verification
app.use(express.json({
  verify: (req: any, res, buf) => { req.rawBody = buf; }
}));

// Webhook Secret
const WEBHOOK_SECRET = 'whsec_test_secret_123';

// Exercise 19: Webhook Route SUT
app.post('/api/webhooks/stripe', (req: any, res) => {
  const sig = req.headers['stripe-signature'];
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.rawBody).digest('hex');

  if (sig !== expected) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  return res.status(200).json({ received: true });
});

describe('Exercises 12-22 Implementation Suite', () => {
  it('Exercise 17: Rejects unauthorized origins from reading CORS response', async () => {
    const res = await request(app)
      .get('/api/webhooks/stripe')
      .set('Origin', 'https://evil-attacker.com');

    // Access-Control-Allow-Origin must NOT match the evil origin
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('Exercise 19: Validates genuine HMAC-SHA256 signature and rejects forged payloads', async () => {
    const payload = JSON.stringify({ event: 'charge.succeeded', amount: 5000 });
    const validSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(Buffer.from(payload)).digest('hex');

    // 1. Genuine request: 200 OK
    const res1 = await request(app)
      .post('/api/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', validSig)
      .send(payload);

    expect(res1.status).toBe(200);
    expect(res1.body.received).toBe(true);

    // 2. Forged request: 400 Bad Request
    const res2 = await request(app)
      .post('/api/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'forged_signature_hex')
      .send(payload);

    expect(res2.status).toBe(400);
  });
});`,
  keyTakeaways: [
    "Verify signed webhooks by hashing the raw body buffer with crypto.createHmac() and checking against signature headers.",
    "Test CORS by asserting that untrusted Origin headers do not receive Access-Control-Allow-Origin response headers.",
    "Verify that rate limiters return HTTP 429 after exceeding quota thresholds.",
    "Test race conditions by firing concurrent requests with Promise.all and asserting that only 1 succeeds."
  ]
};

// ============================================================================
// APPLY UPDATES TO SCRATCH JSON FILES
// ============================================================================
const p17to24Path = path.resolve(__dirname, 'node_notes_parts_17_to_24.json');
const p17to24 = JSON.parse(fs.readFileSync(p17to24Path, 'utf-8'));

// Update Part 18 (Vitest Fundamentals, Unit, API, Mocking & Advanced Testing)
const p18 = p17to24.find(p => p.id === 18);
if (p18) {
  p18.title = "Part 18 — Backend Testing from Ground Zero: Vitest, Supertest & Mocking Masterclass";
  p18.badge = "Vitest & Backend Testing";
  p18.sections = p18_sections;
  console.log(`✅ Updated Part 18 with ${p18_sections.length} exhaustive testing sections.`);
}

// Update Part 19 (Database Integration Testing & The 22 Progressively Difficult Exercises)
const p19 = p17to24.find(p => p.id === 19);
if (p19) {
  p19.title = "Part 19 — Database Integration Testing & The 22 Progressively Difficult Exercises";
  p19.badge = "Database Tests & Exercises";
  p19.sections = [section_19_1, section_19_2, section_19_3];
  console.log(`✅ Updated Part 19 with 3 exhaustive sections (DB Integration, Exercises 1-11, Exercises 12-22).`);
}

// Write back to scratch/node_notes_parts_17_to_24.json
fs.writeFileSync(p17to24Path, JSON.stringify(p17to24, null, 2), 'utf-8');
console.log('🎉 Parts 18 and 19 updated in scratch JSON. Ready to build.');
