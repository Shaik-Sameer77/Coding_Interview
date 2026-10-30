// scratch/generate_node_batch_3.cjs
const fs = require('fs');
const path = require('path');

const parts17to24 = [
  {
    id: 17,
    title: "Part 17 — MongoDB vs MySQL: The Definitive Architectural Decision Matrix",
    badge: "Database Decision",
    color: "#6366f1",
    sections: [
      {
        id: "17.1",
        title: "37. 16-Dimension Comparative Matrix & CAP Theorem Realities",
        content: `### 1. The Senior Engineering Rule
Never say in an interview *"MongoDB is faster than MySQL"* or *"SQL is outdated"*. Both statements are false.
- A database's speed is dictated by **disk I/O, index selectivity, memory buffer pool sizing, and query access patterns**.
- Choose your database based on **data access shapes, schema stability, and transaction guarantees**.

### 2. The 16-Dimension Architectural Comparison Matrix

| Dimension | MySQL (Relational / InnoDB) | MongoDB (Document / WiredTiger) |
| :--- | :--- | :--- |
| **Data Model** | Tables, strictly typed rows and columns | Collections of flexible, semi-structured BSON documents |
| **Schema Enforcement** | Strict DDL schemas (\`ALTER TABLE\`) | Schema-less at engine level; enforced at app level (Mongoose) |
| **Relationships** | First-class foreign key constraints with cascades | Manual referencing (\`ObjectId\`) or embedded subdocuments |
| **Joins** | High-performance multi-table index joins | Aggregation \`$lookup\` (costly if used across massive collections) |
| **Transactions** | First-class ACID transactions (Row locking, MVCC) | Multi-document ACID transactions supported across replica sets |
| **Primary Index** | Clustered index on Primary Key (data stored in tree) | Secondary B-tree on \`_id\` (data stored separately in WiredTiger) |
| **Scaling Strategy** | Vertical scaling + Read Replicas (Sharding is complex) | Native horizontal auto-sharding across shard clusters |
| **Consistency Model** | Immediate Consistency (ACID) | Tunable consistency (Read/Write Concerns: majority, linearizable) |
| **Write Performance** | Slower for high-frequency bulk writes | Extremely fast append performance |
| **Complex Aggregations** | SQL CTEs, Window functions, analytic aggregations | Aggregation Pipeline (\`$facet\`, \`$unwind\`, \`$graphLookup\`) |
| **Document Size Limit** | No row size limit (TEXT / BLOB supported) | Hard 16 Megabyte limit per document |
| **Audit Logs / Append-only** | Excellent with partitioning | Excellent with TTL indexes and capped collections |
| **Financial / Ledgers** | Industry standard (strict constraints guarantee balance) | Possible with transactions, but requires rigorous care |
| **E-Commerce Catalog** | Challenging if attributes vary wildly per category | Exceptional (documents naturally store polymorphic attributes) |
| **Developer Ergonomics** | SQL strings or ORMs (TypeORM, Prisma) | Native JSON-like JavaScript objects in Mongoose |
| **Migration Overhead** | Schema migrations required for column changes | Zero downtime schema evolution (handle legacy fields in code) |`,
        comparisonTable: [
          { feature: "Data Integrity", mysql: "Hard database-level constraints (FKs, CHECKs)", mongodb: "Application-level Mongoose validation" },
          { feature: "Polymorphic Data", mysql: "Requires Entity-Attribute-Value (EAV) or JSON column", mongodb: "Native document flexibility" }
        ],
        code: `// Decision Helper in Node.js Architecture
export function evaluateDatabaseFit({
  isSchemaStrict,
  needsComplexJoins,
  requiresHorizontalSharding,
  hasPolymorphicAttributes
}) {
  if (isSchemaStrict && needsComplexJoins) {
    return { recommendation: 'MySQL / PostgreSQL', rationale: 'Relational model enforces strict constraints and efficient joins.' };
  }
  if (requiresHorizontalSharding || hasPolymorphicAttributes) {
    return { recommendation: 'MongoDB', rationale: 'Document model excels at polymorphic data and distributed sharded clusters.' };
  }
  return { recommendation: 'PostgreSQL with JSONB', rationale: 'Best of both worlds: strict relational tables with high-performance JSONB.' };
}`,
        keyTakeaways: [
          "MongoDB is optimal for polymorphic catalogs, hierarchical documents, and high-velocity logging.",
          "MySQL is optimal for financial transactions, multi-entity ERPs, and strict foreign-key integrity.",
          "Neither database is universally faster; query patterns and indexing determine performance."
        ]
      },
      {
        id: "17.2",
        title: "38. 10 Enterprise Production Scenarios: Which Database to Pick?",
        content: `### 10 Real-World Production Architecture Scenarios

1. **E-Commerce Marketplace Product Catalog (LesHub)**:
   - **Winner**: **MongoDB**. Shoes have sizes and colors; laptops have CPUs and RAM; books have ISBNs and authors. Storing thousands of polymorphic categories in relational tables requires awkward EAV anti-patterns, while MongoDB documents store diverse attributes naturally.
2. **Order Processing & Payment Ledger**:
   - **Winner**: **MySQL**. Financial accounts require strict ACID guarantees, foreign keys to prevent orphan line items, and database-level isolation to prevent double-spending.
3. **User Authentication & Profile Service**:
   - **Winner**: **MySQL or PostgreSQL**. Highly structured, rarely changes, benefits from unique constraints on email and phone numbers.
4. **Audit Logging & Activity Tracking**:
   - **Winner**: **MongoDB**. High-volume write-heavy stream of JSON events. Capped collections and TTL indexes automatically purge logs after 90 days.
5. **Real-Time IoT Sensor Telemetry**:
   - **Winner**: **MongoDB (Time Series Collections)**. Millions of sensor data points per minute ingested with high compression.
6. **Hotel / Airline Seat Booking**:
   - **Winner**: **MySQL**. Row-level locking (\`SELECT ... FOR UPDATE\`) and Serializable isolation prevent double-booking identical seats during concurrent checkout.
7. **Social Media Feed & User Comments**:
   - **Winner**: **MongoDB**. Uses the Subset Pattern (recent 10 comments embedded in post document for instant load times).
8. **Multi-Tenant SaaS with Shared Schemas**:
   - **Winner**: **PostgreSQL / MySQL**. Enforces strict foreign key organization IDs and Row-Level Security.
9. **Content Management System (CMS)**:
   - **Winner**: **MongoDB**. Dynamic page blocks, widgets, and evolving content layouts.
10. **Analytics Reporting & Business Intelligence**:
    - **Winner**: **MySQL / Data Warehouse (Snowflake)**. SQL window functions and complex multi-table joins are superior for financial reports.`,
        comparisonTable: [
          { scenario: "Financial Ledger", pick: "MySQL", why: "ACID transactions & foreign key integrity" },
          { scenario: "Product Catalog", pick: "MongoDB", why: "Polymorphic attributes without EAV tables" },
          { scenario: "Seat Reservations", pick: "MySQL", why: "Pessimistic row locking (FOR UPDATE)" },
          { scenario: "Audit Logs", pick: "MongoDB", why: "Write-heavy ingestion & TTL auto-expiry" }
        ],
        code: `// Case Study: Chrona Time-Entry Hybrid Architecture
// MySQL handles user billing and payroll invoices (Strict ACID)
// MongoDB handles real-time timer keystroke events and task logs (High write volume)
console.log('Hybrid Enterprise Pattern: Polyglot Persistence (MySQL + MongoDB)');`,
        keyTakeaways: [
          "Use polyglot persistence: pair MySQL for transactions with MongoDB for polymorphic catalogs.",
          "Financial ledgers and seat bookings belong in relational databases with row-level locks.",
          "Write-heavy events and polymorphic catalogs belong in document databases."
        ]
      }
    ]
  },
  {
    id: 18,
    title: "Part 18 — Backend Testing from Ground Zero: Vitest, Supertest & Mocking",
    badge: "Testing Master",
    color: "#10b981",
    sections: [
      {
        id: "18.1",
        title: "39. Testing Foundations & Vitest vs Jest Setup from Zero",
        content: `### 1. The Backend Testing Pyramid
- **Unit Tests (Fastest, Isolated)**: Test pure functions, calculation helpers, and domain services with mocked repositories. Runs in milliseconds.
- **Integration Tests (Highest ROI for APIs)**: Test Express routes by making real HTTP requests with **Supertest** against an isolated test database. Validates middleware, routing, validation, and database queries together.
- **End-to-End (E2E) Tests**: Test complete workflows from gateway to database.

### 2. Vitest Setup in a Backend Project
Install dependencies:
\`\`\`bash
npm install -D vitest supertest @types/supertest
\`\`\`
Configure \`vitest.config.js\`:
\`\`\`javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Node.js runtime environment (NOT jsdom!)
    setupFiles: ['./tests/setup.js'],
    testTimeout: 10000,
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  }
});
\`\`\``,
        comparisonTable: [
          { runner: "Vitest", config: "Vite native ESM, sub-second HMR", speed: "Instant startup" },
          { runner: "Jest", config: "Requires ts-jest / babel transforms for ESM", speed: "Slower startup overhead" }
        ],
        code: `// Sample Unit Test with Vitest
import { describe, it, expect } from 'vitest';

function calculateOrderTotal(items, discountPercent = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * discountPercent) / 100;
  return Math.max(0, subtotal - discount);
}

describe('calculateOrderTotal', () => {
  it('applies 10% discount correctly', () => {
    const items = [
      { price: 100, quantity: 2 }, // 200
      { price: 50, quantity: 1 }   // 50
    ];
    expect(calculateOrderTotal(items, 10)).toBe(225);
  });
});`,
        keyTakeaways: [
          "Set environment: 'node' in Vitest for backend services.",
          "Focus on Integration tests with Supertest for the highest backend confidence.",
          "Keep unit tests pure with zero database or network dependencies."
        ]
      },
      {
        id: "18.2",
        title: "40. Express Route & Middleware Integration Testing with Supertest",
        content: `### 1. What is Supertest?
**Supertest** is an HTTP assertion library built on top of SuperAgent.
- It spins up your Express \`app\` on an ephemeral port in memory.
- It makes real HTTP requests through the full middleware pipeline and asserts on status codes, headers, and response JSON.

### 2. The Golden Architecture Rule for Testing Express
**Never call \`app.listen(3000)\` inside the same file that creates \`app\`!**
- If \`app.listen()\` runs on import, importing \`app\` in 10 test files will throw \`EADDRINUSE: address already in use\`!
- **Separate into two files**:
  1. \`src/app.js\`: Creates \`app\`, registers middleware and routes, exports \`app\`.
  2. \`src/server.js\`: Imports \`app\` and calls \`app.listen(PORT)\`.`,
        comparisonTable: [
          { file: "src/app.js", role: "Exports Express app instance for tests and server" },
          { file: "src/server.js", role: "Production entrypoint that binds TCP port" }
        ],
        code: `// Integration Test Suite for User Registration Route
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('POST /api/v1/auth/register', () => {
  it('rejects invalid email with 400 Bad Request', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'password123' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toMatch(/validation failed/i);
  });

  it('creates user and returns 201 Created on valid input', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'valid.user@example.com', password: 'SecretPassword1!' })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe('valid.user@example.com');
  });
});`,
        keyTakeaways: [
          "Export app separately from app.listen to allow Supertest to bind ephemeral ports.",
          "Test both happy paths (201 Created) and validation failure paths (400 Bad Request).",
          "Assert on Content-Type and custom security headers in Supertest."
        ]
      },
      {
        id: "18.3",
        title: "41. Mocking Strategies & The 22 Practical Backend Testing Exercises Matrix",
        content: `### 1. Mocking Strategies: Repositories vs Modules
- **Mocking Repositories via Dependency Injection (Best Practice)**: Pass a mock repository object (\`{ findById: vi.fn().mockResolvedValue(...) }\`) to the service constructor.
- **Module Mocking (\`vi.mock()\`)**: Replaces an external npm package (like \`stripe\` or \`@aws-sdk/client-s3\`).

### 2. The 22 Progressive Backend Testing Exercises Matrix

| # | Exercise Name | Target Component | Core Concept & Method |
| :--- | :--- | :--- | :--- |
| **1** | Pure Math Utility | \`calculateTax()\` | Rounding, negative input handling, \`toBeCloseTo()\` |
| **2** | Async Promise Helper | \`delay()\` | Timers, resolving promises, \`vi.useFakeTimers()\` |
| **3** | Zod Schema Validator | \`validateCreateUser()\` | Syntactic validation, required fields, error formatting |
| **4** | Service with Mocked Repo | \`UserService.getProfile()\` | Dependency injection, \`vi.fn().mockResolvedValue()\` |
| **5** | Route Success 200 | \`GET /api/v1/products\` | Supertest \`request(app).get().expect(200)\` |
| **6** | Validation Rejection 400 | \`POST /api/v1/orders\` | Invalid body payload rejected with detailed error list |
| **7** | Auth Middleware (No Token) | \`requireAuth\` | Request with missing Authorization header returns 401 |
| **8** | Auth Middleware (Invalid JWT) | \`requireAuth\` | Expired or tampered token returns 401 |
| **9** | Role Authorization 403 | \`requireRole('admin')\` | Member role accessing admin route returns 403 |
| **10** | Central Error Handler | \`errorHandler\` | Custom \`AppError\` correctly mapped to status and JSON |
| **11** | Database CRUD Integration | \`ProductRepository\` | Real database insertion, retrieval, and cleanup |
| **12** | Search & Keyset Pagination | \`GET /products?cursor=...\` | Validating cursor pagination boundary conditions |
| **13** | SQL Injection Defense | Parameterized query | Passing malicious input \`' OR 1=1\` safely sanitized |
| **14** | MongoDB Aggregation Report | \`Order.aggregate()\` | Verifying pipeline calculations against test data |
| **15** | Transaction Rollback | \`transferFunds()\` | Simulating mid-transaction error; verifying 0 balance change |
| **16** | External API Integration | \`WeatherService\` | Mocking Axios with \`vi.mock()\` to test 503 retry |
| **17** | Rate Limiting Middleware | \`express-rate-limit\` | 100 requests return 200; 101st request returns 429 |
| **18** | CORS Preflight Verification | \`OPTIONS /api/v1/users\` | Verifying Access-Control headers match allowlist |
| **19** | Helmet Security Headers | \`GET /\` | Asserting HSTS, CSP, and X-Content-Type-Options headers |
| **20** | Signed Webhook Verification | \`POST /webhooks/stripe\` | Valid HMAC signature accepted; tampered payload rejected |
| **21** | Idempotent Payment Handler | \`POST /payments\` | Replaying identical transaction key returns duplicate 200 |
| **22** | Graceful Shutdown Drill | \`SIGTERM\` handler | Server stops accepting new connections; drains pending |`,
        comparisonTable: [
          { exerciseLevel: "Exercises 1 to 5 (Foundations)", focus: "Pure unit tests, Zod validation, Supertest basics" },
          { exerciseLevel: "Exercises 6 to 15 (Integration)", focus: "Middleware, AuthN/AuthZ, DB CRUD, SQL injection defense" },
          { exerciseLevel: "Exercises 16 to 22 (Advanced & Production)", focus: "Webhooks, Rate limits, Idempotency, Graceful shutdown" }
        ],
        code: `// Template for tackling any exercise in the matrix
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Exercise Template', () => {
  it('executes Arrange-Act-Assert cleanly', async () => {
    // 1. Arrange: Prepare mock data
    // 2. Act: Dispatch request
    const res = await request(app).get('/health').expect(200);
    // 3. Assert: Verify outcome
    expect(res.body.status).toBe('healthy');
  });
});`,
        keyTakeaways: [
          "Follow the 22-exercise progressive testing matrix from unit tests to production shutdown drills.",
          "Mock external network dependencies (Stripe, AWS); test internal database queries against isolated test databases.",
          "Always test edge cases: duplicate keys, network dropouts, expired tokens, and race conditions."
        ]
      }
    ]
  },
  {
    id: 19,
    title: "Part 19 — Database Integration Testing & Testcontainers",
    badge: "Database Testing",
    color: "#059669",
    sections: [
      {
        id: "19.1",
        title: "42. Testing Against Real Databases: Testcontainers & Transaction Rollbacks",
        content: `### 1. Why Mocking the Database is Dangerous
When junior developers write database tests using \`jest.mock('pg')\` or \`mockingoose\`:
- The test proves nothing about whether your **actual SQL syntax is valid**, whether **foreign key constraints work**, or whether **indexes are utilized**.
- **The Solution**: Run integration tests against a real, isolated database instance!

### 2. The Transaction Rollback Pattern (Lightning Fast)
For SQL databases (PostgreSQL / MySQL):
1. In \`beforeEach()\`, start a transaction: \`await db.beginTransaction()\`.
2. Run your test queries inside this transaction.
3. In \`afterEach()\`, **rollback the transaction**: \`await db.rollback()\`.
- **Result**: The database is reset to pristine condition in under 5ms without running slow table truncations or migrations!

### 3. Testcontainers
**Testcontainers** programmatically spins up real Docker containers (Postgres, Redis, MongoDB) in your test setup and tears them down when the test suite finishes:
\`\`\`javascript
import { PostgreSqlContainer } from '@testcontainers/postgresql';

const container = await new PostgreSqlContainer().start();
const connectionUri = container.getConnectionUri();
\`\`\``,
        comparisonTable: [
          { approach: "Mocked DB (mockingoose)", realSyntaxValidated: "NO", speed: "Instant", confidence: "Low" },
          { approach: "Transaction Rollback", realSyntaxValidated: "YES", speed: "Fast (~5ms per test)", confidence: "High" },
          { approach: "Testcontainers (Docker)", realSyntaxValidated: "YES", speed: "Medium (Container start)", confidence: "100% Production Parity" }
        ],
        code: `// Test Isolation via Transaction Rollback Pattern
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mysql from 'mysql2/promise';

describe('User Database Integration', () => {
  let connection;

  beforeEach(async () => {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start isolated test transaction
  });

  afterEach(async () => {
    await connection.rollback(); // Rollback all mutations!
    connection.release();
  });

  it('inserts and finds user within transaction', async () => {
    await connection.execute('INSERT INTO users (email) VALUES (?)', ['test@example.com']);
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    expect(rows).toHaveLength(1);
    // When test finishes, rollback wipes 'test@example.com' from disk!
  });
});`,
        keyTakeaways: [
          "Do not rely solely on database mocks for query integration testing.",
          "Use the transaction rollback pattern in beforeEach/afterEach for 5ms test isolation.",
          "Use Testcontainers to provide deterministic Docker-backed databases in CI/CD pipelines."
        ]
      }
    ]
  },
  {
    id: 20,
    title: "Part 20 — External API Integration, Resiliency & Circuit Breakers",
    badge: "API Resiliency",
    color: "#e11d48",
    sections: [
      {
        id: "20.1",
        title: "43. Axios vs Fetch, Timeouts & The Circuit Breaker Pattern",
        content: `### 1. Native Fetch vs Axios in Modern Node.js
- **Node.js Native \`fetch()\` (Node 18+)**:
  - Built-in using \`undici\` (zero npm dependencies).
  - Requires manual checking of \`res.ok\` (does NOT reject on 4xx/5xx HTTP status codes).
  - Requires \`AbortSignal.timeout(5000)\` for request timeouts.
- **Axios**:
  - Rich interceptor ecosystem (\`axios.interceptors.request\`).
  - Automatically rejects on non-2xx status codes.
  - Automatically stringifies JSON payloads.

### 2. The Circuit Breaker Pattern
If a downstream payment gateway or third-party service crashes:
- Continuing to send 1,000 requests per second will exhaust your server sockets and tie up threads waiting for 30-second timeouts.
- **The Circuit Breaker** has 3 states:
  1. **Closed (Normal)**: Requests pass through. Failures are tracked.
  2. **Open (Tripped)**: When failures exceed a threshold (e.g. 50% errors), the breaker trips! All subsequent requests **fail immediately without touching the network** for a cooldown period (e.g. 30 seconds).
  3. **Half-Open**: After cooldown, allows a single canary probe request through. If it succeeds, closes breaker; if it fails, re-opens breaker.`,
        comparisonTable: [
          { state: "Closed", behavior: "All requests pass to external API", transition: "Trips to Open on high failure rate" },
          { state: "Open", behavior: "Requests fail immediately with 503 (Fast Fail)", transition: "Transitions to Half-Open after cooldown" },
          { state: "Half-Open", behavior: "Sends 1 probe request to test recovery", transition: "Closes on success; Re-opens on failure" }
        ],
        code: `// Resilient HTTP Client with Timeout and Error Handling
export async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(\`External service responded with \${response.status}\`);
    }
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(\`Request to \${url} timed out after \${timeoutMs}ms\`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}`,
        keyTakeaways: [
          "Always attach explicit timeouts to every outbound external HTTP request.",
          "Use the Circuit Breaker pattern to fast-fail requests when external APIs are down.",
          "Native fetch in Node 18+ eliminates Axios dependency when paired with AbortSignal.timeout()."
        ]
      }
    ]
  },
  {
    id: 21,
    title: "Part 21 — Concurrency, Worker Threads & Clustering",
    badge: "Scale & Parallelism",
    color: "#8b5cf6",
    sections: [
      {
        id: "21.1",
        title: "44. Cluster Module vs worker_threads vs Child Processes",
        content: `### 1. The 3 Multi-Core Parallelism Models in Node.js
By default, a Node.js process runs on a single CPU core. On an 8-core server, 7 cores sit idle!
Node.js provides 3 distinct mechanisms to utilize all CPU cores:

1. **The Cluster Module (Multi-Process)**:
   - Spawns multiple identical Node.js worker processes (1 per CPU core).
   - The master process listens on port 3000 and distributes incoming TCP connections using round-robin load balancing.
   - **Memory**: Each worker has its own isolated 2GB V8 heap. Zero shared memory.
2. **\`node:worker_threads\` (Multi-Thread)**:
   - Spawns multiple threads inside the **same Node.js process**.
   - Ideal for **CPU-intensive computation** (image processing, crypto, data analysis).
   - **Memory**: Can share raw binary memory instantly via \`SharedArrayBuffer\` without IPC serialization overhead.
3. **\`node:child_process\`**:
   - Spawns independent operating system processes (e.g. running Python, ffmpeg, or Bash commands via \`spawn\` / \`exec\`).`,
        comparisonTable: [
          { feature: "Cluster Module", unit: "Separate OS Processes", memory: "Isolated memory per worker", bestFor: "Scaling web servers to saturate CPU cores" },
          { feature: "worker_threads", unit: "Threads in 1 Process", memory: "Shared memory (SharedArrayBuffer)", bestFor: "CPU-heavy algorithms (image/video/crypto)" },
          { feature: "child_process", unit: "External OS Executables", memory: "Isolated OS process", bestFor: "Executing shell commands and CLI tools" }
        ],
        code: `// Primary/Worker Cluster Architecture in Node.js
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} is running. Forking \${numCPUs} workers...\`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Auto-restart dead workers (Zero downtime self-healing)
  cluster.on('exit', (worker, code, signal) => {
    console.warn(\`Worker \${worker.process.pid} died. Forking replacement...\`);
    cluster.fork();
  });
} else {
  // Workers share the same TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(\`Handled by worker PID: \${process.pid}\\n\`);
  }).listen(3000);
}`,
        keyTakeaways: [
          "Use the Cluster module (or PM2 / Kubernetes) to saturate all CPU cores with web server processes.",
          "Use worker_threads for CPU-bound JavaScript algorithms sharing memory via SharedArrayBuffer.",
          "Use child_process to execute external system binaries (ffmpeg, bash)."
        ]
      }
    ]
  },
  {
    id: 22,
    title: "Part 22 — Memory Leaks, V8 Heap Snapshots & Performance Profiling",
    badge: "Profiling & Diagnostics",
    color: "#d97706",
    sections: [
      {
        id: "22.1",
        title: "45. Diagnosing Memory Leaks with Chrome DevTools Heap Snapshots",
        content: `### 1. The Top 4 Memory Leak Vectors in Node.js
1. **Unbounded Global Collections**: Adding user tokens or socket mappings to a global \`Map\` or \`Object\` without a TTL or maximum size limit (LRU).
2. **Lingering Event Listeners**: Adding \`emitter.on('event', ...)\` without removing listeners when clients disconnect.
3. **Closures Retaining Parent Scope**: An inner function retaining references to a massive buffer in its lexical parent scope.
4. **Timers (\`setInterval\`)**: Forgotten intervals executing indefinitely in the background holding object references.

### 2. How to Capture and Diff Heap Snapshots
1. Run Node.js with the inspector enabled: \`node --inspect server.js\`.
2. Open Chrome and navigate to \`chrome://inspect\`. Click *"Open dedicated DevTools for Node"*.
3. Navigate to the **Memory** tab.
4. **The 3-Snapshot Diagnostic Technique**:
   - Take **Snapshot 1** (baseline idle memory).
   - Simulate heavy user traffic or load test with 5,000 requests.
   - Take **Snapshot 2** (memory under load).
   - Allow the server to idle for 2 minutes to let garbage collection run, then take **Snapshot 3**.
5. Select **Snapshot 3** and change perspective to **Comparison** against **Snapshot 1**:
   - Sort by **# Delta** (objects allocated but never freed).
   - Look for \`Closure\`, \`Array\`, \`EventEmitter\`, or \`Object\`.
   - Inspect the **Retainer Tree** to identify the exact variable name preventing garbage collection!`,
        comparisonTable: [
          { concept: "Shallow Size", definition: "Memory directly allocated by the object itself" },
          { concept: "Retained Size", definition: "Memory freed if this object is garbage collected (its whole tree)" },
          { concept: "Retainer Tree", definition: "The chain of parent pointers holding the object in memory" }
        ],
        code: `// Programmatically dumping Heap Snapshots on high memory usage
import v8 from 'node:v8';
import fs from 'node:fs';
import process from 'node:process';

export function monitorMemoryUsage(thresholdMB = 1024) {
  setInterval(() => {
    const memory = process.memoryUsage();
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);

    if (heapUsedMB > thresholdMB) {
      const fileName = \`heap-\${Date.now()}.heapsnapshot\`;
      console.warn(\`Memory threshold exceeded: \${heapUsedMB}MB! Writing \${fileName}...\`);
      const snapshotStream = v8.getHeapSnapshot();
      const fileStream = fs.createWriteStream(fileName);
      snapshotStream.pipe(fileStream);
    }
  }, 10000);
}`,
        keyTakeaways: [
          "Use the 3-snapshot comparison technique in Chrome DevTools to pinpoint memory leaks.",
          "Sort by # Delta to find objects that were allocated during traffic but never freed.",
          "Inspect the Retainer Tree to identify the root reference preventing garbage collection."
        ]
      }
    ]
  },
  {
    id: 23,
    title: "Part 23 — Deployment, Docker, AWS & CI/CD Pipelines",
    badge: "Production Ops",
    color: "#2563eb",
    sections: [
      {
        id: "23.1",
        title: "46. Production Docker: Multi-Stage Builds & Non-Root User",
        content: `### 1. The Golden Rules of Production Dockerfiles
1. **Multi-Stage Builds**: Compile TypeScript and install devDependencies in a build stage; copy only the compiled \`dist/\` and production \`node_modules\` into the final runner image (reduces image size from 1.2GB down to 120MB!).
2. **Run as Non-Root User**: Never run Node.js as \`root\`. If an attacker achieves Remote Code Execution (RCE), they own the entire host container! Always switch to \`USER node\`.
3. **Use Tini for PID 1 (\`init: true\`)**: Node.js was not designed to run as Linux PID 1 (process init). It does not forward \`SIGTERM\` signals properly to child processes, preventing graceful shutdown.`,
        comparisonTable: [
          { practice: "Single Stage Dockerfile", imageSize: "~1.2 GB (contains devDependencies, tsc, source)", security: "Runs as root" },
          { practice: "Multi-Stage Dockerfile", imageSize: "~120 MB (Alpine base, production deps only)", security: "Runs as USER node" }
        ],
        code: `// Multi-Stage Production Dockerfile for Node.js & TypeScript
# Stage 1: Build & Compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build
RUN npm prune --production

# Stage 2: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Run as unprivileged non-root user for security
USER node
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        keyTakeaways: [
          "Use multi-stage Docker builds to keep production image sizes under 150MB.",
          "Always switch to USER node to prevent container root privilege escalation.",
          "Use npm ci instead of npm install for deterministic dependency lockfile parity."
        ]
      },
      {
        id: "23.2",
        title: "47. CI/CD Pipelines & Zero-Downtime Rolling Deployments",
        content: `### 1. The CI/CD Pipeline Stages
Every production git commit should pass through 5 automated gates:
1. **Lint & Format**: ESLint + Prettier.
2. **Type Check**: \`tsc --noEmit\` (verifies zero compile errors).
3. **Automated Tests**: Unit and integration tests with Vitest + Supertest.
4. **Container Build & Vulnerability Scan**: Docker build + Trivy image security scan.
5. **Deployment Gate**: Blue-Green or Rolling Deployment to AWS ECS / Kubernetes.

### 2. Zero-Downtime Rolling Deployments
During a deployment:
1. Load balancer directs 100% of traffic to existing Version 1 containers.
2. Container orchestrator launches Version 2 container.
3. Orchestrator pings \`GET /health\` until Version 2 reports healthy.
4. Load balancer gradually shifts traffic (10% -> 50% -> 100%) to Version 2.
5. Orchestrator sends \`SIGTERM\` to Version 1 containers, allowing pending HTTP requests to complete before terminating.`,
        comparisonTable: [
          { strategy: "Recreate Deployment", downtime: "YES (Minutes of outage while server restarts)", cost: "Low" },
          { strategy: "Rolling Deployment", downtime: "ZERO (Gradual container replacement)", cost: "Medium" },
          { strategy: "Blue-Green Deployment", downtime: "ZERO (Instant router switch)", cost: "High (Double infrastructure)" }
        ],
        code: `// GitHub Actions CI Pipeline Configuration
name: Production CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test`,
        keyTakeaways: [
          "Enforce linting, type-checking, and automated testing on every pull request.",
          "Use rolling deployments to guarantee zero user-visible downtime.",
          "Verify /health endpoint readiness before routing traffic to newly deployed containers."
        ]
      }
    ]
  },
  {
    id: 24,
    title: "Part 24 — Senior System Design Blueprints & 15 Real-World Projects",
    badge: "System Design",
    color: "#4f46e5",
    sections: [
      {
        id: "24.1",
        title: "48. The 15-Step System Design Interview Communication Sequence & 17 Blueprints",
        content: `### 1. The 15-Step System Design Communication Sequence
Master this verbal communication sequence during senior backend interviews:
1. **Clarify Functional Requirements**: 3–4 core user capabilities.
2. **Clarify Non-Functional Requirements**: High availability (99.99%), low latency (< 100ms), scale (DAU/RPS).
3. **Capacity Estimations**: Read vs Write ratio, daily storage growth, network bandwidth.
4. **API Interface Design**: REST/gRPC endpoints, request/response JSON contracts.
5. **Data Model Design**: SQL vs NoSQL selection, schemas, and primary/foreign keys.
6. **Core Request Trace**: Walk step-by-step from DNS -> CDN -> ALB -> Gateway -> Service -> DB.
7. **Database Deep-Dive**: B-tree indexes, partitioning, read replicas, caching.
8. **Scalability & Load Balancing**: Horizontal autoscaling, stateless services.
9. **Caching Strategy**: Redis read-through vs write-behind, cache invalidation, TTLs.
10. **Asynchronous Processing**: Message queues (Kafka, RabbitMQ, BullMQ), background workers.
11. **Security & Data Isolation**: TLS, AuthN/AuthZ, rate limiting, encryption at rest.
12. **Resiliency & Fault Tolerance**: Circuit breakers, retries with jitter, bulkhead isolation.
13. **Data Consistency**: ACID vs Eventual consistency, distributed transactions (Saga pattern).
14. **Monitoring & Observability**: Structured logs, metrics (Prometheus/Grafana), distributed tracing.
15. **Bottlenecks & Senior Trade-offs**: Discuss limitations and evolutionary roadmap.

### 2. The 17 Enterprise System Design Blueprints Catalog
1. Authentication & Session Management Service
2. High-Throughput Search & Filtering API
3. Multi-Vendor Marketplace Backend (LesHub)
4. Distributed Shopping Cart & Inventory Reservation
5. Order Processing & State Machine Workflow
6. Payment Gateway Integration & Webhook Ingestion Engine
7. Hotel / Flight Seat Booking Engine
8. Multi-Channel Notification Dispatcher (Email, SMS, Push)
9. Tamper-Evident Audit Logging Service
10. S3-Backed File Upload & Transcoding Pipeline
11. Distributed Rate Limiter (Token Bucket / Sliding Window)
12. Asynchronous Job Queue Worker Pool (BullMQ)
13. Real-Time Analytics Telemetry Ingestion Pipeline
14. Multi-Tenant SaaS Platform with Data Isolation
15. Idempotent Financial Ledger & Balance Transfer Service
16. URL Shortener with Hash Collisions & Base62 Encoding
17. Real-Time Chat & Collaborative Document Service (WebSockets)`,
        comparisonTable: [
          { phase: "Steps 1–3 (0–10 mins)", focus: "Scope boundaries, constraints, scale assumptions" },
          { phase: "Steps 4–8 (10–25 mins)", focus: "High-level architecture, API contracts, core data model" },
          { phase: "Steps 9–15 (25–45 mins)", focus: "Deep-dives: caching, queues, failure modes, observability" }
        ],
        code: `// High-Level Component Architecture Reference
console.log('System Design Catalog: 17 Complete Enterprise Architecture Blueprints Available in Track.');`,
        keyTakeaways: [
          "Follow the 15-step communication framework to lead senior technical architecture screenings.",
          "Never jump straight into drawing boxes; clarify requirements and scale first.",
          "Proactively discuss bottlenecks, failure modes, and database index trade-offs."
        ]
      },
      {
        id: "24.2",
        title: "49. 15 Progressive Enterprise Project Specifications",
        content: `### 15 Real-World Enterprise Projects Catalog

| # | Project Name | Tech Stack | Architectural Highlights |
| :--- | :--- | :--- | :--- |
| **1** | Production Express + TypeScript CRUD | Express, TS, Zod | 3-tier architecture, central error handling, Docker |
| **2** | MySQL Search & Keyset Pagination API | Express, MySQL2, TS | Leftmost-prefix indexes, sargable queries, EXPLAIN profiling |
| **3** | MongoDB Multi-Tenant Resource API | Mongoose, MongoDB | Compound indexes, ESR rule, aggregation reporting |
| **4** | Enterprise Dual-Token Auth Service | Express, JWT, Bcrypt | Refresh token rotation, reuse detection, HttpOnly cookies |
| **5** | Direct S3 Upload Service | AWS SDK v3, S3 | Pre-signed PUT URLs, magic byte validation, bucket policies |
| **6** | Webhook & Payment Engine | Stripe SDK, Express | Raw body preservation, HMAC-SHA256, DB idempotency |
| **7** | Distributed Rate-Limited API | Redis, Express | Sliding-window log algorithm, 429 Retry-After headers |
| **8** | Resilient Outbound API Client | Fetch, AbortSignal | Timeouts, exponential backoff with jitter, circuit breaker |
| **9** | Vitest + Supertest Tested Service | Vitest, Supertest | 100% route integration coverage, transaction rollbacks |
| **10** | Multi-Stage Dockerized Microservice | Docker, Node Alpine | Non-root USER node, Tini PID 1, 120MB image size |
| **11** | Full CI/CD Pipeline | GitHub Actions | Lint, type check, automated tests, Docker build gate |
| **12** | AWS Cloud Production Architecture | ECS, RDS, ALB, S3 | VPC subnets, security groups, SSL termination, CloudWatch |
| **13** | Multi-Tenant SaaS with Data Scoping | Postgres RLS, TS | Organization scoping on all queries, tenant isolation |
| **14** | Database Query Plan Optimizer | MySQL, EXPLAIN | Refactoring slow full-table scans to covered index lookups |
| **15** | Observability & Incident Response | OpenTelemetry, Pino | Structured JSON logs, correlation IDs, p99 latency alarms |`,
        comparisonTable: [
          { tier: "Beginner/Intermediate (Projects 1-5)", focus: "Clean Express architecture, TypeScript DTOs, basic CRUD, Auth" },
          { tier: "Intermediate/Advanced (Projects 6-10)", focus: "Webhooks, S3 pre-signed URLs, Rate limiting, Docker" },
          { tier: "Senior/Lead (Projects 11-15)", focus: "CI/CD pipelines, AWS infrastructure, Multi-tenancy, Observability" }
        ],
        code: `// Catalog of 15 Enterprise Projects Ready for Implementation
console.log('15 Enterprise Backend Projects Catalog Verified.');`,
        keyTakeaways: [
          "Build projects across all 3 tiers from clean CRUD to multi-tenant cloud architectures.",
          "Every project reinforces security, strict typing, and automated testing.",
          "Focus on production engineering: Docker multi-stage builds, CI/CD gates, and observability."
        ]
      }
    ]
  }
];

const targetPath = path.resolve(__dirname, 'node_notes_parts_17_to_24.json');
fs.writeFileSync(targetPath, JSON.stringify(parts17to24, null, 2), 'utf8');
console.log('Successfully wrote scratch/node_notes_parts_17_to_24.json with 8 parts and 13 sections.');
