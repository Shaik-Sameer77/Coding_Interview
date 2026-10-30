// Generator for Topics 12 to 16
const fs = require('fs');
const path = require('path');

const batch = [];
function q(id, topicId, topicTitle, question, answer, memoryModel, code, tip, comparisonTable) {
  const item = { id, topicId, topicTitle, question, answer };
  if (memoryModel) item.memoryModel = memoryModel;
  if (code) item.code = code;
  if (tip) item.tip = tip;
  if (comparisonTable) item.comparisonTable = comparisonTable;
  batch.push(item);
}

// TOPIC 12: Backend Testing & Supertest (Q176–Q190)
q(176, 12, "12. Backend Testing & Supertest",
  "What is Supertest and how does it test Express applications without listening on a live port?",
  "Supertest is an integration testing library for HTTP servers built on SuperAgent. You pass your Express `app` instance directly to `supertest(app)`: under the hood, Supertest starts an ephemeral Node HTTP server on an unassigned random ephemeral port, dispatches HTTP requests, asserts on response status and headers, and tears down the socket connection automatically after each test.",
  "Memory Anchor: supertest(app) spins up an ephemeral test server on random port and makes real HTTP calls without manual server.listen().",
  `import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('returns 200 with status healthy', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.status).toBe('healthy');
  });
});`
);

q(177, 12, "12. Backend Testing & Supertest",
  "Why should you separate app.js (Express app definition) from server.js (server.listen)?",
  "If `server.listen(3000)` is inside the same file as your Express routes (`app.js`), importing `app` into your Jest or Vitest test suites will attempt to bind to port 3000. When running multiple test files in parallel, this causes `EADDRINUSE: address already in use` crashes.\nFix: Define middleware and routes in `app.js` and export `app`. Only call `app.listen()` inside `server.js`.",
  "Memory Anchor: Separate app.js (routes) from server.js (listen) to prevent EADDRINUSE port collisions in tests."
);

q(178, 12, "12. Backend Testing & Supertest",
  "What is the difference between Unit Tests and Integration Tests in a Node.js backend?",
  "- **Unit Tests**: Test a single isolated function or class (e.g. password validator or tax calculator) in isolation, mocking all external dependencies (database, Redis, third-party APIs).\n- **Integration Tests**: Test the interaction between multiple architectural layers together (e.g. testing `POST /api/auth/register` with real Express middleware, input validation, and a real in-memory MongoDB/Testcontainer database).",
  "Memory Anchor: Unit = Isolated function with mocks. Integration = Express route + DB interacting together."
);

q(179, 12, "12. Backend Testing & Supertest",
  "How do you test authenticated endpoints with Supertest?",
  "Generate a mock JWT token signed with your test environment's `JWT_SECRET` and pass it in the `Authorization` header using `.set('Authorization', `Bearer ${token}`)`.",
  "Memory Anchor: Generate valid test JWT -> .set('Authorization', `Bearer ${token}`).",
  `test('GET /api/user/profile requires authentication', async () => {
  const token = jwt.sign({ userId: 'u_123', role: 'admin' }, process.env.JWT_SECRET);
  
  const res = await request(app)
    .get('/api/user/profile')
    .set('Authorization', \`Bearer \${token}\`)
    .expect(200);

  expect(res.body.userId).toBe('u_123');
});`
);

q(180, 12, "12. Backend Testing & Supertest",
  "How do you test database operations in integration tests (In-Memory vs Testcontainers)?",
  "- **In-Memory (mongodb-memory-server / SQLite)**: Extremely fast, zero Docker dependency. Great for unit/integration tests, but might lack specific production DB features (JSONB operators in PostgreSQL).\n- **Testcontainers**: Automatically spins up real Docker containers (real PostgreSQL, MySQL, Redis) during test startup and terminates them on test completion. Exactly matches production DB behavior.",
  "Memory Anchor: mongodb-memory-server = ultra-fast in-memory DB. Testcontainers = real Docker containers matching production."
);

q(181, 12, "12. Backend Testing & Supertest",
  "How do you mock third-party external APIs (Stripe, Twilio, AWS) in Jest/Vitest?",
  "Never make live network calls to third-party APIs in automated test suites (flaky, consumes API credits, fails offline).\nMock using:\n1) Jest module mocks: `jest.mock('stripe')` or `jest.spyOn(stripeClient.paymentIntents, 'create').mockResolvedValue(...)`.\n2) Network interception with **MSW (Mock Service Worker)** or **Nock**.",
  "Memory Anchor: Mock third-party APIs with Nock or Jest module spies to avoid flaky external network calls."
);

q(182, 12, "12. Backend Testing & Supertest",
  "How do you test file upload routes with Supertest?",
  "Use Supertest's `.attach('fieldName', 'path/to/test-file.jpg')` method to simulate a `multipart/form-data` file upload.",
  "Memory Anchor: request(app).post('/upload').attach('avatar', './fixtures/avatar.png') tests Multer uploads.",
  `test('POST /api/upload uploads an avatar', async () => {
  const res = await request(app)
    .post('/api/upload')
    .attach('avatar', path.resolve(__dirname, 'fixtures/sample.png'))
    .field('userId', 'user_123')
    .expect(200);

  expect(res.body.url).toBeDefined();
});`
);

q(183, 12, "12. Backend Testing & Supertest",
  "What is the difference between jest.fn(), jest.spyOn(), and jest.mock()?",
  "- `jest.fn()`: Creates a new, standalone mock function that records calls and arguments.\n- `jest.spyOn(object, 'method')`: Wraps an existing method on an object, tracking calls while optionally preserving or mocking the original implementation (`mockRestore()` restores original).\n- `jest.mock('module-name')`: Automatically replaces an entire imported module with mock functions.",
  "Memory Anchor: jest.fn() = blank mock function; jest.spyOn() = spy on existing method; jest.mock() = mock whole module."
);

q(184, 12, "12. Backend Testing & Supertest",
  "How do you clean up database state between tests to guarantee test isolation?",
  "In `beforeEach()` or `afterEach()`, purge all collections or truncate tables (`await User.deleteMany({})` or run within a rollback transaction) so tests never depend on the execution order or state of previous tests.",
  "Memory Anchor: Always clean database collections in afterEach() or beforeEach() for test isolation."
);

q(185, 12, "12. Backend Testing & Supertest",
  "What is Test Coverage and what do Statement, Branch, Function, and Line coverage mean?",
  "- **Statement Coverage**: Percentage of code statements executed.\n- **Branch Coverage**: Percentage of conditional branches (`if/else`, switch cases, ternary) tested. (Most critical for catching edge cases!).\n- **Function Coverage**: Percentage of defined functions called.\n- **Line Coverage**: Percentage of executable lines hit during tests.",
  "Memory Anchor: Branch coverage is most important because it tests both true and false paths of if/else logic."
);

q(186, 12, "12. Backend Testing & Supertest",
  "How do you test custom Express Error Handling middleware?",
  "Pass a mock `err`, `req`, `res`, and `next` object with `jest.fn()` to the error middleware and assert that `res.status()` and `res.json()` were invoked with expected status codes and sanitized error envelopes.",
  "Memory Anchor: Pass mock req, res (with status/json spies) directly to error middleware function."
);

q(187, 12, "12. Backend Testing & Supertest",
  "Why should you avoid testing private methods directly?",
  "Testing private internal methods couples your tests to implementation details. When you refactor private helper functions, tests break even though public behavior is unchanged. Test public API endpoints and interfaces; private methods are tested naturally through public paths.",
  "Memory Anchor: Test public behavior, not private implementation details. Refactoring shouldn't break tests."
);

q(188, 12, "12. Backend Testing & Supertest",
  "What is Contract Testing and how does Pact work in microservices?",
  "Contract testing verifies that two separate services (e.g. Frontend client and Node.js microservice) can communicate with each other according to an agreed-upon contract (schema, status codes, payload). Tools like Pact test contracts without needing both services running concurrently.",
  "Memory Anchor: Contract testing (Pact) validates that API producer and consumer schemas remain compatible."
);

q(189, 12, "12. Backend Testing & Supertest",
  "How do you run tests with code coverage in Jest/Vitest?",
  "Pass the `--coverage` flag (`jest --coverage` or `vitest run --coverage`). It generates visual HTML reports (in `coverage/lcov-report/index.html`) highlighting unexecuted lines and untested branches in red.",
  "Memory Anchor: jest --coverage generates statement, branch, and line metrics with visual HTML reports."
);

q(190, 12, "12. Backend Testing & Supertest",
  "What is a Smoke Test vs a Regression Test in backend deployments?",
  "- **Smoke Test**: A fast, minimal suite of critical checks (e.g. `/health`, database connection check, user login) run immediately after deployment to verify the build is stable.\n- **Regression Test**: A comprehensive suite verifying that recent bug fixes or new features haven't broken previously functioning behavior.",
  "Memory Anchor: Smoke test = Fast sanity check right after deploy. Regression test = Comprehensive suite checking nothing broke."
);

// TOPIC 13: Node.js with TypeScript (Q191–Q205)
q(191, 13, "13. Node.js with TypeScript",
  "Why use TypeScript for Node.js backend development?",
  "TypeScript brings static typing to Node.js, catching runtime errors (`TypeError: Cannot read property of undefined`) at compile time, providing rich IDE autocomplete, enforcing strict API request/response contracts, and making large enterprise codebases self-documenting and refactor-safe.",
  "Memory Anchor: TypeScript eliminates runtime undefined errors and enforces strict data contracts across the codebase."
);

q(192, 13, "13. Node.js with TypeScript",
  "How do you augment the Express Request interface in TypeScript to include req.user?",
  "Use **Declaration Merging**. Create a declaration file (e.g. `src/types/express.d.ts`) that declares namespace `Express` and augments the `Request` interface with your custom `user` property.",
  "Memory Anchor: Use declaration merging in express.d.ts: declare global { namespace Express { interface Request { user?: User; } } }",
  `// src/types/express.d.ts
import { UserPayload } from '../modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      requestId?: string;
    }
  }
}
export {};`
);

q(193, 13, "13. Node.js with TypeScript",
  "What are the essential tsconfig.json compiler options for a production Node.js backend?",
  "Key settings:\n- `target: 'ES2022'`: Modern JS output.\n- `module: 'NodeNext'` or `'CommonJS'`.\n- `moduleResolution: 'NodeNext'`.\n- `strict: true`: Enables strict null checks and type constraints.\n- `outDir: './dist'`: Output directory.\n- `rootDir: './src'`: Source directory.\n- `esModuleInterop: true`: Enables clean default imports for CommonJS modules.\n- `skipLibCheck: true`: Skips type checking of declaration files for faster builds.",
  "Memory Anchor: strict: true, target: ES2022, moduleResolution: NodeNext, esModuleInterop: true, outDir: ./dist."
);

q(194, 13, "13. Node.js with TypeScript",
  "What is the difference between ts-node, tsx, and compiling with tsc?",
  "- `tsc`: The official TypeScript compiler. Compiles `.ts` files to plain `.js` in `/dist` for production deployment.\n- `ts-node`: JIT TypeScript execution for development. Can be slow on large codebases.\n- `tsx`: A modern, ultra-fast development runner powered by esbuild. Instantly executes TS without type-checking overhead.",
  "Memory Anchor: tsx = Fast dev runner with esbuild; tsc = Type checking & production build output."
);

q(195, 13, "13. Node.js with TypeScript",
  "How do you strictly type Express Route Handlers in TypeScript?",
  "Use Express generic types: `RequestHandler<Params, ResBody, ReqBody, ReqQuery>`. This guarantees that `req.params`, `req.body`, and `req.query` are strictly typed inside the controller.",
  "Memory Anchor: RequestHandler<Params, ResBody, ReqBody, ReqQuery> strictly types all 4 request properties.",
  `import { RequestHandler } from 'express';

interface CreateUserBody {
  email: string;
  name: string;
}

interface UserResponse {
  id: string;
  email: string;
}

export const createUser: RequestHandler<{}, UserResponse, CreateUserBody> = async (req, res) => {
  const { email, name } = req.body; // TS knows email and name are strings!
  res.status(201).json({ id: '1', email });
};`
);

q(196, 13, "13. Node.js with TypeScript",
  "Why is compile-time TypeScript validation insufficient for incoming HTTP request bodies?",
  "TypeScript types are completely erased at compile time (Zero Runtime Footprint). If an attacker sends `{ \"age\": \"not-a-number\" }`, TypeScript cannot stop it at runtime. You MUST pair TypeScript with a **runtime schema validator** like Zod, Joi, or TypeBox to validate incoming payloads before processing.",
  "Memory Anchor: TS types disappear at runtime! Always validate incoming HTTP payloads with Zod at runtime."
);

q(197, 13, "13. Node.js with TypeScript",
  "How do you infer TypeScript types directly from a Zod schema (Single Source of Truth)?",
  "Define your validation schema using Zod, then infer the static TypeScript interface using `z.infer<typeof Schema>`. This eliminates duplicate code and guarantees that runtime validation and static types are always 100% in sync.",
  "Memory Anchor: z.infer<typeof Schema> derives TypeScript types from runtime Zod schemas with zero duplication.",
  `import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  tags: z.array(z.string()).default([])
});

// Infer TypeScript type:
export type CreateProductInput = z.infer<typeof CreateProductSchema>;`
);

q(198, 13, "13. Node.js with TypeScript",
  "How do you type an async Express middleware that passes custom errors?",
  "Import `ErrorRequestHandler` from `express`. It enforces the 4 arguments: `(err: Error, req: Request, res: Response, next: NextFunction)`.",
  "Memory Anchor: Use ErrorRequestHandler type from express for typing 4-parameter error middleware."
);

q(199, 13, "13. Node.js with TypeScript",
  "What is the difference between any and unknown in backend TypeScript?",
  "- `any`: Completely disables type checking. Allows arbitrary property access and function calls, defeating TypeScript's purpose.\n- `unknown`: Type-safe counter-part. Tells TS 'I don't know what this data is yet' (e.g. parsed JSON from external API). You MUST narrow or validate the type with `typeof`, `instanceof`, or Zod before using it.",
  "Memory Anchor: Never use any for external data. Use unknown and narrow it via runtime validation."
);

q(200, 13, "13. Node.js with TypeScript",
  "What is Generics in TypeScript and how do you write a generic Database Repository in Node?",
  "Generics allow classes and functions to work with a variety of data types while preserving type safety. A generic `BaseRepository<T>` can perform CRUD operations (`findById(id): Promise<T | null>`) for any database model.",
  "Memory Anchor: BaseRepository<T> provides typed CRUD methods for any entity model.",
  `export class BaseRepository<T extends { id: string }> {
  constructor(private model: any) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findOne({ id });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
}`
);

q(201, 13, "13. Node.js with TypeScript",
  "What are Decorators in TypeScript and how are they used in NestJS / TypeORM?",
  "Decorators are special declarations prefixed with `@` that attach metadata to classes, methods, accessors, or properties. They use the `Reflect Metadata` API to implement dependency injection (`@Injectable()`), route mapping (`@Get('/users')`), and database column definitions (`@Column()`).",
  "Memory Anchor: Decorators (@Get, @Injectable) attach reflection metadata to classes and methods for DI and routing."
);

q(202, 13, "13. Node.js with TypeScript",
  "What is the Satisfies operator in TypeScript 4.9+?",
  "The `satisfies` operator validates that an expression matches a type contract without widening the resulting type, preserving exact literal types and autocompletion for object properties.",
  "Memory Anchor: satisfies checks type conformance without widening specific string literal types."
);

q(203, 13, "13. Node.js with TypeScript",
  "How do you handle path aliases (@/services/...) in TypeScript and production builds?",
  "Configure `compilerOptions.paths` in `tsconfig.json` (`\"@/*\": [\"src/*\"]`).\nGotcha: `tsc` does NOT rewrite path aliases in the compiled JS output! For production builds, you must use a tool like `tsconfig-paths`, `tsc-alias`, or bundle with esbuild/webpack to rewrite aliases to relative paths.",
  "Memory Anchor: Path aliases (@/...) in tsconfig require tsc-alias or esbuild to rewrite paths in dist/ build."
);

q(204, 13, "13. Node.js with TypeScript",
  "What is Const Assertion (as const) in TypeScript?",
  "Applying `as const` locks an object or array into a read-only literal type, preventing mutations and narrowing all primitive properties to their exact literal values. Commonly used for configuration objects and constant lookup maps.",
  "Memory Anchor: as const makes objects deeply read-only and narrows strings to exact literal unions."
);

q(205, 13, "13. Node.js with TypeScript",
  "What is the difference between type and interface in Node.js TypeScript?",
  "- `interface`: Extensible, supports declaration merging (ideal for library types and Express Request augmentation).\n- `type`: Can represent unions, intersections, primitives, tuples, and mapped types. Cannot be reopened for declaration merging.",
  "Memory Anchor: interface for extensible object contracts; type for unions, intersections, and complex utility types."
);

// TOPIC 14: Clustering & Worker Threads (Q206–Q220)
q(206, 14, "14. Clustering & Worker Threads",
  "What is the Cluster module in Node.js and how does it scale across CPU cores?",
  "Because Node runs on a single thread, a server with 16 CPU cores only utilizes 1 core by default. The `node:cluster` module forks multiple child processes (workers) sharing the same server port. The primary (master) process listens on the port and distributes incoming TCP connections among worker processes using round-robin scheduling (on Linux/macOS).",
  "Memory Anchor: Cluster forks 1 process per CPU core sharing the same port with round-robin load distribution.",
  `import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} is running. Forking \${numCPUs} workers...\`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died. Forking replacement...\`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => res.end('Served by worker!')).listen(3000);
}`
);

q(207, 14, "14. Clustering & Worker Threads",
  "What is the difference between the Cluster module and Worker Threads (worker_threads)?",
  "- **Cluster module**: Multi-Process. Each worker has its own separate OS process, its own V8 instance, and its own isolated memory heap (~30 MB per process). Communication happens via IPC. Best for scaling I/O across CPU cores.\n- **Worker Threads (`worker_threads`)**: Multi-Thread. Threads run within the SAME OS process and can share memory using `SharedArrayBuffer`. Best for offloading CPU-intensive computational tasks (crypto, image/video encoding, machine learning) without blocking the main event loop.",
  "Memory Anchor: Cluster = Separate processes with isolated memory (multi-core HTTP). Worker Threads = Threads sharing same process memory (CPU compute).",
  null,
  null,
  [
    { aspect: "Cluster", detail: "Multiple OS processes; isolated memory heaps; ideal for multi-core HTTP throughput." },
    { aspect: "Worker Threads", detail: "Threads within single process; shared memory (SharedArrayBuffer); ideal for CPU-bound computations." }
  ]
);

q(208, 14, "14. Clustering & Worker Threads",
  "How do you communicate between the primary process and workers in Cluster?",
  "Using Inter-Process Communication (IPC): `worker.send(message)` and `process.on('message', callback)`. Node serializes messages via JSON over internal pipes.",
  "Memory Anchor: IPC via worker.send() and process.on('message')."
);

q(209, 14, "14. Clustering & Worker Threads",
  "What is PM2 and how does PM2 Cluster Mode work in production?",
  "PM2 is a production process manager for Node.js. Running `pm2 start server.js -i max` automatically detects all available CPU cores, forks worker processes using the Node cluster module, performs zero-downtime rolling reloads (`pm2 reload all`), restarts crashed workers automatically, and aggregates logs.",
  "Memory Anchor: pm2 start server.js -i max forks workers across all CPU cores with zero-downtime reloads."
);

q(210, 14, "14. Clustering & Worker Threads",
  "How do you implement a Worker Thread to execute heavy CPU tasks?",
  "Instantiate `new Worker('./worker.js', { workerData })`. Communicate via `parentPort.postMessage()` and `worker.on('message')`.",
  "Memory Anchor: new Worker() offloads heavy CPU tasks off the main event loop.",
  `// main.js
import { Worker } from 'node:worker_threads';

function runHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

// worker.js
import { parentPort, workerData } from 'node:worker_threads';
const result = heavyCalculation(workerData);
parentPort.postMessage(result);`
);

q(211, 14, "14. Clustering & Worker Threads",
  "What are SharedArrayBuffer and Atomics in Node.js Worker Threads?",
  "`SharedArrayBuffer` allows multiple worker threads to read and write to the exact same shared binary memory segment simultaneously without copying data over IPC.\n`Atomics` provides atomic operations (`Atomics.add`, `Atomics.compareExchange`, `Atomics.wait`) to prevent race conditions when multiple threads read/write the shared buffer.",
  "Memory Anchor: SharedArrayBuffer shares memory across threads; Atomics prevents race conditions."
);

q(212, 14, "14. Clustering & Worker Threads",
  "What is a Worker Pool and why shouldn't you spawn a new Worker Thread for every request?",
  "Creating a new Worker Thread incurs overhead (~few milliseconds and memory allocation for the new V8 context). Spawning 1,000 threads for 1,000 requests will exhaust server memory.\nA **Worker Pool** (e.g. `piscina`) maintains a fixed pool of pre-warmed, reusable worker threads, assigning incoming computational tasks to idle workers via a queue.",
  "Memory Anchor: Never spawn workers on demand. Use a pre-warmed Worker Pool (Piscina) to reuse threads."
);

q(213, 14, "14. Clustering & Worker Threads",
  "What is the child_process module, and what are exec, execFile, spawn, and fork?",
  "- `spawn()`: Streams command output in real-time via streams. Ideal for long-running processes or large data.\n- `exec()`: Runs command in a shell and buffers the entire output in memory (default 1MB limit). Vulnerable to shell injection if user input is passed!\n- `execFile()`: Runs executable directly without invoking a shell. Faster and safer from shell injection.\n- `fork()`: Special spawn variation that spawns a new Node.js process with a built-in IPC communication channel.",
  "Memory Anchor: spawn = streaming; exec = buffered in shell; execFile = safe no-shell executable; fork = new Node process with IPC."
);

q(214, 14, "14. Clustering & Worker Threads",
  "How can child_process.exec() lead to Command Injection vulnerabilities?",
  "Because `exec()` spawns a system shell (`/bin/sh` or `cmd.exe`), passing unvalidated user input (`exec('ping ' + req.query.ip)`) allows an attacker to inject shell metacharacters: `127.0.0.1; rm -rf /`.\nFix: Use `child_process.execFile()` or `spawn()` with arguments passed as an array of literal strings (`execFile('ping', [req.query.ip])`).",
  "Memory Anchor: exec() invokes a shell (vulnerable to ; rm -rf). Use execFile() with string arrays."
);

q(215, 14, "14. Clustering & Worker Threads",
  "What is Zero-Downtime Reload in Node.js clustering?",
  "When deploying new code, rather than killing all processes simultaneously (which drops active user connections), zero-downtime reload restarts workers sequentially one-by-one:\n1) Send `SIGTERM` to Worker 1.\n2) Wait for Worker 1 to finish serving current requests and close.\n3) Fork new Worker 1 with updated code.\n4) Wait until new Worker 1 is listening, then repeat for Worker 2.",
  "Memory Anchor: Zero-downtime reloads restart workers one by one so traffic is always served."
);

q(216, 14, "14. Clustering & Worker Threads",
  "How does session state behave in a clustered Node.js application?",
  "Because each cluster worker has its own isolated memory heap, in-memory sessions (`req.session` stored in local JS objects) will fail: a user authenticated on Worker 1 will be prompted to log in again when their next request is routed to Worker 2!\nFix: Use a shared external session store (Redis) so all cluster workers read/write the same session data.",
  "Memory Anchor: In-memory sessions break across cluster workers. You must use shared Redis for session state."
);

q(217, 14, "14. Clustering & Worker Threads",
  "What are MessageChannel and MessagePort in worker threads?",
  "`MessageChannel` creates an asynchronous, two-way communication channel with two entangled `MessagePort`s (`port1` and `port2`). It allows direct thread-to-thread communication without routing messages through the primary parent thread.",
  "Memory Anchor: MessageChannel creates two paired ports for direct thread-to-thread communication."
);

q(218, 14, "14. Clustering & Worker Threads",
  "What happens if an unhandled error occurs in a Worker Thread?",
  "The worker thread emits an `'error'` event and terminates. The main process does NOT crash unless you fail to handle the worker's `'error'` listener. The main process should catch the error and spawn a replacement worker if necessary.",
  "Memory Anchor: Worker thread crashes emit 'error' event; main thread survives if error listener is attached."
);

q(219, 14, "14. Clustering & Worker Threads",
  "How does Node.js cluster distribute incoming connections (SO_REUSEPORT vs round-robin)?",
  "On Windows and Linux, the primary process by default accepts incoming connections and distributes handles to workers using a round-robin algorithm (`cluster.schedulingPolicy = cluster.SCHED_RR`), preventing connection imbalance where one worker starves while others are saturated.",
  "Memory Anchor: Round-robin scheduling distributes connections evenly across workers to prevent worker starvation."
);

q(220, 14, "14. Clustering & Worker Threads",
  "When should you use Microservices over Node Clustering?",
  "Clustering scales an application across CPU cores on a **single physical machine**. When traffic exceeds the capacity of a single server, you must scale horizontally across **multiple server nodes** using Docker containers, Kubernetes, or serverless functions managed by an external Load Balancer (AWS ALB, Nginx).",
  "Memory Anchor: Cluster scales on 1 machine; Microservices/Containers scale horizontally across multiple machines."
);

// TOPIC 15: Performance & Memory Leaks (Q221–Q235)
q(221, 15, "15. Performance & Memory Leaks",
  "What is a Memory Leak in Node.js and what are the most common causes?",
  "A memory leak occurs when memory allocated on the V8 heap is no longer needed by the application but is not released by the garbage collector because references to it remain accessible from the GC root.\nCommon causes:\n1) **Forgotten Event Listeners**: Adding `.on()` listeners inside per-request handlers without `.removeListener()`.\n2) **Global Variables & Caches**: Appending to unbounded global arrays/maps without eviction or TTL.\n3) **Closures**: Functions retaining references to large parent scopes.\n4) **Unclosed Streams & Sockets**: Forgotten timers (`setInterval`) and unclosed database sockets.",
  "Memory Anchor: Memory leak = Unreleased memory holding references from GC root. Culprits: unremoved listeners, unbounded caches, unclosed timers."
);

q(222, 15, "15. Performance & Memory Leaks",
  "How do you take and analyze a Heap Snapshot in Node.js using Chrome DevTools?",
  "1) Start Node with the inspect flag: `node --inspect server.js`.\n2) Open Google Chrome at `chrome://inspect` and click 'Inspect'.\n3) Navigate to the **Memory** tab and click 'Take Snapshot'.\n4) Perform a load test (using Autocannon) and take a second snapshot.\n5) Switch view from 'Summary' to 'Comparison' between Snapshot 1 and Snapshot 2: inspect objects with growing 'Delta' and high 'Retained Size'.",
  "Memory Anchor: node --inspect -> chrome://inspect -> Take snapshot -> Compare growth delta in Memory tab."
);

q(223, 15, "15. Performance & Memory Leaks",
  "What is the difference between Shallow Size and Retained Size in memory profiling?",
  "- **Shallow Size**: The amount of memory directly held by the object itself (usually just the bytes for its immediate properties and pointer references).\n- **Retained Size**: The total amount of memory that would be **freed if this object were deleted and garbage collected** (includes all child objects reachable solely through this object). When hunting memory leaks, always sort by highest Retained Size!",
  "Memory Anchor: Shallow = Size of the object alone. Retained = Size of object + all dependent objects it keeps alive."
);

q(224, 15, "15. Performance & Memory Leaks",
  "How can closures cause subtle memory leaks in Node.js?",
  "If an inner function references a variable in an outer scope, V8 retains the entire lexical environment context of that scope. If the inner function is kept alive (e.g. attached to a global timer or callback), all large objects declared in the outer scope cannot be garbage collected.",
  "Memory Anchor: Closures retain their entire enclosing lexical scope context as long as the function is reachable."
);

q(225, 15, "15. Performance & Memory Leaks",
  "How do you profile CPU bottlenecks and event loop lag in Node.js?",
  "1) Built-in V8 CPU Profiler: `node --prof server.js`. Process ticks with `node --prof-process isolate-*.log > processed.txt`.\n2) Clinic.js: `clinic doctor -- node server.js` (generates visual graphs of Event Loop delay, CPU usage, and memory).\n3) Flamegraphs: Visualizes which functions occupy the most CPU call stack time.",
  "Memory Anchor: Profile CPU via node --prof or Clinic.js (clinic flame) to identify functions blocking the loop."
);

q(226, 15, "15. Performance & Memory Leaks",
  "What is Event Loop Lag and how do you monitor it?",
  "Event loop lag is the delay between when an asynchronous callback was scheduled to execute and when the event loop actually got around to invoking it (caused by synchronous code hogging the main thread).\nMonitor it using `perf_hooks.monitorEventLoopDelay({ resolution: 10 })` to measure percentile lag (`p50`, `p99`).",
  "Memory Anchor: Event loop lag = Delay in executing callbacks. Monitor via perf_hooks.monitorEventLoopDelay().",
  `import { monitorEventLoopDelay } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log('Event Loop Lag p99 (ms):', (histogram.percentile(99) / 1e6).toFixed(2));
}, 5000);`
);

q(227, 15, "15. Performance & Memory Leaks",
  "How do you implement an in-memory cache safely without creating a memory leak?",
  "Never use a plain JavaScript object or unbounded Map (`cache[key] = val`) without eviction. Always use a **Least Recently Used (LRU) Cache** (e.g. `lru-cache`) with a strict `max` item count and `ttl` (Time to Live). When max items are reached, the least recently used entries are automatically evicted.",
  "Memory Anchor: Unbounded Map = Guaranteed memory leak! Always use LRU Cache with strict max items and TTL.",
  `import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500, // Maximum 500 items
  ttl: 1000 * 60 * 5 // 5 minutes TTL
});`
);

q(228, 15, "15. Performance & Memory Leaks",
  "Why is JSON.parse() dangerous for large inputs in high-throughput servers?",
  "`JSON.parse()` and `JSON.stringify()` run strictly synchronously on the main thread. Parsing a 50 MB JSON payload takes 200–500ms, completely blocking the Event Loop and stalling all other concurrent users.\nFix: Validate max payload limits with `express.json({ limit: '1mb' })`, or use streaming JSON parsers (e.g. `stream-json`) for massive datasets.",
  "Memory Anchor: Synchronous JSON.parse() blocks event loop on large payloads. Limit body sizes to 1MB."
);

q(229, 15, "15. Performance & Memory Leaks",
  "What is HTTP Response Compression and how does the compression middleware work?",
  "The `compression()` middleware compresses outgoing HTTP response bodies using Gzip or Brotli before sending them over the wire. It inspects the client's `Accept-Encoding: gzip, br` header and reduces JSON/HTML payload size by up to 70–80%, significantly speeding up response times for clients.",
  "Memory Anchor: compression() middleware compresses responses with Gzip/Brotli, reducing bandwidth by 70%."
);

q(230, 15, "15. Performance & Memory Leaks",
  "What is Database Connection Pooling and why is opening a new connection per request an anti-pattern?",
  "Establishing a database TCP connection involves network handshakes, TLS negotiation, and database authentication (~50–150ms).\nA connection pool maintains a set of pre-opened, active database connections. When a request arrives, it borrows an idle connection from the pool and returns it when done, reducing latency to <1ms.",
  "Memory Anchor: Connection pool reuses pre-opened DB connections, eliminating expensive TCP/TLS handshake latency."
);

q(231, 15, "15. Performance & Memory Leaks",
  "What is process.memoryUsage() and what do its 4 metrics mean?",
  "- `rss (Resident Set Size)`: Total physical RAM allocated to the Node process (includes C++ bindings, code, and V8 heap).\n- `heapTotal`: Total memory allocated by V8 for the JavaScript heap.\n- `heapUsed`: Actual memory currently occupied by JavaScript objects.\n- `external`: Memory bound to C++ objects (e.g. Buffers).",
  "Memory Anchor: rss = Total physical RAM; heapTotal = Allocated V8 heap; heapUsed = Live JS objects; external = Buffers."
);

q(232, 15, "15. Performance & Memory Leaks",
  "How do you load test a Node.js API to identify bottlenecks (Autocannon / k6)?",
  "Run `autocannon -c 100 -d 30 https://api.mysite.com/products` (100 concurrent connections for 30 seconds). Measure requests per second (req/sec), latency percentiles (p50, p95, p99), and monitor CPU/RAM usage to pinpoint performance thresholds.",
  "Memory Anchor: Use Autocannon or k6 to measure p99 latency and req/sec under heavy concurrent load."
);

q(233, 15, "15. Performance & Memory Leaks",
  "What is the N+1 Query Problem in ORMs and how do you fix it?",
  "The N+1 problem occurs when querying a parent collection of N items causes the ORM to execute 1 query for the parent plus N individual queries for each child (e.g. 100 posts trigger 101 DB queries).\nFix: Use SQL `JOIN`s or batch loading with DataLoader / Mongoose `populate()` in a single query.",
  "Memory Anchor: N+1 problem = 1 query triggers N separate queries. Fix via SQL JOINs or DataLoader batching."
);

q(234, 15, "15. Performance & Memory Leaks",
  "How does Node.js handle DNS resolution caching, and why can dns.lookup cause bottlenecks?",
  "`dns.lookup()` uses the underlying OS `getaddrinfo()` system call, which is synchronous and runs on Libuv's 4 thread pool threads. High volume outbound HTTP requests can exhaust the 4 threads, queueing all file I/O and DNS lookups.\nFix: Use `dns.resolve()` or an HTTP agent with a DNS cache (e.g. `agentkeepalive`).",
  "Memory Anchor: dns.lookup uses Libuv thread pool; high volume outbound requests can starve the 4 threads."
);

q(235, 15, "15. Performance & Memory Leaks",
  "What is Fastify and why is it faster than Express?",
  "Fastify achieves higher throughput than Express through:\n1) Fast schema-based JSON serialization (using `fast-json-stringify` which compiles JSON serializing functions based on JSON schema).\n2) Radix-tree based routing (find-my-way).\n3) Reduced object allocation and lower GC pressure.",
  "Memory Anchor: Fastify is faster than Express due to pre-compiled JSON schema stringification and radix-tree routing."
);

// TOPIC 16: Production Ops & Architecture (Q236–Q250)
q(236, 16, "16. Production Ops & Architecture",
  "What is Graceful Shutdown and how do you implement it for SIGTERM and SIGINT?",
  "When Kubernetes or Docker stops a container, it sends `SIGTERM`. If the process terminates instantly (`process.exit()`), in-flight database transactions are aborted, files are corrupted, and active user requests receive 502 errors.\n**Graceful Shutdown sequence**:\n1) Stop accepting new connections (`server.close()`).\n2) Wait for active HTTP requests to complete (with a 10s fallback timeout).\n3) Close database pools (`mongoose.disconnect()`, `db.end()`).\n4) Close Redis and message queue connections.\n5) Exit cleanly with `process.exit(0)`.",
  "Memory Anchor: SIGTERM: Stop accepting new requests (server.close) -> wait for in-flight requests -> close DB/Redis pools -> exit(0).",
  `const shutdown = async (signal) => {
  logger.info(\`Received \${signal}. Starting graceful shutdown...\`);
  
  // 1. Stop accepting new connections:
  server.close(async () => {
    logger.info('HTTP server closed. Closing DB connections...');
    try {
      await mongoose.connection.close(false);
      await redisClient.quit();
      logger.info('Graceful shutdown completed successfully.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s timeout:
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout!');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));`
);

q(237, 16, "16. Production Ops & Architecture",
  "What are Liveness and Readiness Probes in Kubernetes/Docker health checks?",
  "- **Liveness Probe** (`/health/live`): Checks if the Node process is running. If it returns 500 or times out, Kubernetes assumes the process is deadlocked and restarts the container.\n- **Readiness Probe** (`/health/ready`): Checks if the app is ready to accept user traffic (verifies database and Redis connections are established). If it returns 500, Kubernetes temporarily stops routing traffic to this pod without killing it.",
  "Memory Anchor: Liveness = Is process alive? (restart if dead). Readiness = Can it accept traffic right now? (route traffic if ready).",
  `app.get('/health/live', (req, res) => res.status(200).json({ status: 'live' }));

app.get('/health/ready', async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const isRedisConnected = redisClient.isReady;

  if (isDbConnected && isRedisConnected) {
    return res.status(200).json({ status: 'ready' });
  }
  res.status(503).json({ status: 'unavailable', db: isDbConnected, redis: isRedisConnected });
});`
);

q(238, 16, "16. Production Ops & Architecture",
  "Why is console.log() an anti-pattern in production, and why should you use Pino or Winston?",
  "`console.log()` is synchronous when printing to terminal/files, blocking the main thread during heavy logging, and outputs unstructured plain text that cannot be indexed.\nProduction loggers like **Pino** or **Winston**:\n1) Output structured **JSON** logs easily parsed by Datadog, Elasticsearch, and CloudWatch.\n2) Provide log levels (`trace`, `debug`, `info`, `warn`, `error`).\n3) Pino logs asynchronously using extreme-speed worker threads with zero event loop lag.",
  "Memory Anchor: console.log blocks thread and outputs plain text. Pino outputs structured JSON asynchronously at extreme speed."
);

q(239, 16, "16. Production Ops & Architecture",
  "What is Correlation ID (Request ID) tracking and how do you implement it across distributed services?",
  "A Correlation ID is a unique UUID generated for an incoming HTTP request (or extracted from `X-Correlation-ID`). It is injected into all log entries and forwarded in headers to downstream microservices, allowing engineers to trace a single user action across 10 distributed services in Datadog/Kibana.",
  "Memory Anchor: Correlation ID (UUID) is attached to all logs and forwarded to downstream APIs to trace a request across services."
);

q(240, 16, "16. Production Ops & Architecture",
  "How do you design a Dockerfile for a production Node.js application?",
  "Follow production Docker best practices:\n1) Use **Multi-stage builds** (Stage 1 compiles TS, Stage 2 copies only `/dist` and production `node_modules`).\n2) Use slim Alpine base image (`node:20-alpine`).\n3) Run as non-root user (`USER node`).\n4) Copy `package*.json` before source code to leverage Docker layer caching.\n5) Use `npm ci --omit=dev` to exclude devDependencies.",
  "Memory Anchor: Multi-stage build + Alpine image + non-root USER node + npm ci --omit=dev."
);

q(241, 16, "16. Production Ops & Architecture",
  "What is the Circuit Breaker pattern and when should you use it in Node.js?",
  "When a downstream microservice or payment gateway is down, repeatedly sending requests causes connection timeouts and exhausts your server's socket pools.\nA **Circuit Breaker** (e.g. `opossum`) monitors failures. If failure rate exceeds 50%, it **trips open**, immediately failing subsequent calls with a fallback without waiting for timeouts. Periodically it enters **half-open** state to test if the service has recovered.",
  "Memory Anchor: Circuit Breaker trips open on downstream failures, failing fast to protect server resources until service recovers."
);

q(242, 16, "16. Production Ops & Architecture",
  "What is the difference between Message Queues (BullMQ/RabbitMQ) and HTTP API calls for background tasks?",
  "- **HTTP API calls**: Synchronous, fragile. If the receiving service is offline, the operation is lost unless manually retried.\n- **Message Queues**: Asynchronous, persistent. Tasks are saved in Redis (BullMQ) or RabbitMQ broker. Workers pull tasks at their own pace, with automatic retries, concurrency limits, and zero dropped jobs during traffic spikes.",
  "Memory Anchor: Message queues buffer tasks reliably with retries, decoupling producers from consumer traffic spikes."
);

q(243, 16, "16. Production Ops & Architecture",
  "How do you implement Scheduled Cron Jobs reliably across multiple server instances?",
  "Running `node-cron` on 4 load-balanced server instances executes the same cron job 4 times simultaneously (causing duplicate emails or billing)!\nFix: Use a centralized distributed job scheduler (e.g. **BullMQ Repeatable Jobs** or **Agenda** with Redis/MongoDB distributed locking) so only ONE worker instance executes the job at any scheduled time.",
  "Memory Anchor: node-cron runs on every instance; use BullMQ repeatable jobs with Redis distributed locks for cluster cron jobs."
);

q(244, 16, "16. Production Ops & Architecture",
  "What is 12-Factor App methodology for modern Node.js cloud applications?",
  "A set of 12 best practices for cloud-native software:\n- Store config in environment variables.\n- Explicitly declare and isolate dependencies.\n- Treat backing services (DB, Redis) as attached resources.\n- Strict separation of build, release, and run stages.\n- Execute apps as stateless processes.\n- Fast startup and graceful shutdown via disposability.",
  "Memory Anchor: 12-Factor App: Stateless processes, config in environment variables, attached backing services, graceful shutdown."
);

q(245, 16, "16. Production Ops & Architecture",
  "What is OpenTelemetry (OTel) and Distributed Tracing in Node.js?",
  "OpenTelemetry is an open-source observability framework providing vendor-neutral APIs and SDKs to capture traces, metrics, and logs. It auto-instruments HTTP requests, database queries, and Redis operations, tracing latency bottlenecks across microservices in Jaeger or Datadog.",
  "Memory Anchor: OpenTelemetry instruments traces across microservices to visualize request latency waterfalls."
);

q(246, 16, "16. Production Ops & Architecture",
  "How do you debug an issue where CPU is pinned at 100% on a production server?",
  "1) Generate a CPU profile using `v8-profiler-next` or `perf`.\n2) Inspect if an infinite synchronous loop, ReDoS regular expression, or heavy synchronous encryption (`crypto.pbkdf2Sync`) is hogging the main thread.\n3) Inspect Event Loop delay histograms.",
  "Memory Anchor: 100% CPU = Synchronous code blocking main thread (ReDoS, infinite loop, or crypto.sync). Profile with v8-profiler."
);

q(247, 16, "16. Production Ops & Architecture",
  "How do you handle zero-downtime database schema migrations in Node.js?",
  "Use **Expand and Contract (Parallel Run) migration pattern**:\n1) **Expand**: Add new nullable column to DB (old code continues writing to old column).\n2) **Deploy Code**: Update Node server to write to BOTH old and new columns, reading from new.\n3) **Backfill**: Run script to migrate historical data from old to new column.\n4) **Contract**: Deploy code reading/writing only new column, then drop old column in DB.",
  "Memory Anchor: Zero-downtime DB migrations: Expand (add column) -> Dual write -> Backfill -> Contract (drop old column)."
);

q(248, 16, "16. Production Ops & Architecture",
  "What is a Reverse Proxy (Nginx) and why should Node.js almost never be exposed directly to the public internet?",
  "Node.js is optimized for application logic, not edge web serving. Placing Nginx or AWS ALB in front provides:\n1) **SSL/TLS Termination**: Offloads expensive crypto handshakes from Node.\n2) **Static Asset Caching**: Serves images and CSS directly from disk cache.\n3) **DDoS & Slowloris Protection**: Absorbs slow, malicious HTTP connections.\n4) **Load Balancing**: Distributes traffic across multiple Node server instances.",
  "Memory Anchor: Nginx handles SSL termination, gzip, static caching, and DDoS defense, leaving Node free for business logic."
);

q(249, 16, "16. Production Ops & Architecture",
  "How do you design an API Gateway pattern for Node.js microservices?",
  "An API Gateway acts as the single public entry point for client applications. It handles:\n1) Cross-cutting authentication and token verification.\n2) Centralized rate limiting.\n3) Request routing to internal microservices.\n4) Response aggregation (BFF - Backend For Frontend pattern).\n5) Protocol translation (HTTP/JSON to gRPC).",
  "Memory Anchor: API Gateway = Front door handling Auth, Rate Limiting, and Routing to internal microservices."
);

q(250, 16, "16. Production Ops & Architecture",
  "Explain how you would architect a production-grade Node.js/Express backend from scratch.",
  "Senior Interview-Ready Pitch:\n\n“I organize the application around a modular, domain-driven architecture (`src/modules/orders/`, `src/modules/auth/`) using TypeScript for strict end-to-end type safety.\n\nAt the HTTP layer, I use Express (or Fastify) with Helmet security headers, restrictive CORS policies, and centralized Zod request validation middleware. For authentication, I implement a dual-token architecture with short-lived JWTs and rotating refresh tokens in HttpOnly secure cookies.\n\nFor database access, I use connection pooling with transactions, and enforce webhook idempotency with Redis distributed locks. I offload heavy CPU or asynchronous jobs to BullMQ worker queues.\n\nFinally, for production reliability, I configure graceful shutdown on SIGTERM, structured JSON logging with correlation IDs via Pino and AsyncLocalStorage, comprehensive health checks for Kubernetes, and automated integration tests using Supertest and Testcontainers.”",
  "Memory Anchor: Domain modules + TypeScript + Zod validation + Dual JWT + Redis idempotency + BullMQ queues + Graceful shutdown."
);

fs.writeFileSync(path.resolve(__dirname, 'batch_12_to_16.json'), JSON.stringify(batch, null, 2));
console.log('Batch 12 to 16 generated! Total count:', batch.length);
