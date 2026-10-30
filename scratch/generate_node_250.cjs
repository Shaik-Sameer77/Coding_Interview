// Script to generate all 250 Node.js & Express interview questions
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, '../src/node/data/nodeInterviewData.js');

const NODE_INTERVIEW_TOPICS = [
  { id: 'all', title: 'All Questions', range: 'Q1–Q250', count: 250, color: '#34d399' },
  { id: 1, title: '1. Architecture & Libuv', range: 'Q1–Q15', count: 15, color: '#10b981' },
  { id: 2, title: '2. Modules & CommonJS/ESM', range: 'Q16–Q30', count: 15, color: '#059669' },
  { id: 3, title: '3. Buffers, Streams & Pipe', range: 'Q31–Q45', count: 15, color: '#047857' },
  { id: 4, title: '4. Async, Events & Concurrency', range: 'Q46–Q60', count: 15, color: '#06b6d4' },
  { id: 5, title: '5. Express Architecture & Middleware', range: 'Q61–Q80', count: 20, color: '#38bdf8' },
  { id: 6, title: '6. REST API Design & HTTP', range: 'Q81–Q100', count: 20, color: '#60a5fa' },
  { id: 7, title: '7. Auth: JWT, Refresh & Bcrypt', range: 'Q101–Q115', count: 15, color: '#818cf8' },
  { id: 8, title: '8. Webhooks & Signatures', range: 'Q116–Q130', count: 15, color: '#a855f7' },
  { id: 9, title: '9. Payment Integration Workflows', range: 'Q131–Q145', count: 15, color: '#c084fc' },
  { id: 10, title: '10. Security, CORS & Hardening', range: 'Q146–Q160', count: 15, color: '#e11d48' },
  { id: 11, title: '11. File Uploads & S3/Multer', range: 'Q161–Q175', count: 15, color: '#f43f5e' },
  { id: 12, title: '12. Backend Testing & Supertest', range: 'Q176–Q190', count: 15, color: '#fb923c' },
  { id: 13, title: '13. Node.js with TypeScript', range: 'Q191–Q205', count: 15, color: '#3b82f6' },
  { id: 14, title: '14. Clustering & Worker Threads', range: 'Q206–Q220', count: 15, color: '#f59e0b' },
  { id: 15, title: '15. Performance & Memory Leaks', range: 'Q221–Q235', count: 15, color: '#eab308' },
  { id: 16, title: '16. Production Ops & Architecture', range: 'Q236–Q250', count: 15, color: '#22c55e' }
];

const NODE_STUDY_CHECKLIST = [
  {
    category: "1. Core Node.js Mechanics & Architecture",
    items: [
      "V8 engine vs Libuv C++ library responsibilities",
      "Event loop phases: Timers, Pending I/O, Poll, Check, Close",
      "Process.nextTick vs Promise microtask queue priority",
      "Libuv thread pool default size (4) and UV_THREADPOOL_SIZE",
      "Streams: Readable, Writable, Duplex, Transform and backpressure",
      "Buffer allocation: Buffer.from vs Buffer.allocUnsafe",
      "CommonJS synchronous require vs ESM asynchronous import"
    ]
  },
  {
    category: "2. Express.js & Production API Engineering",
    items: [
      "Express middleware pipeline and next() flow control",
      "Global 4-parameter error handler (err, req, res, next)",
      "CORS headers: Origin, Access-Control-Allow-Credentials, preflight OPTIONS",
      "Rate limiting and brute force protection with Redis",
      "Security headers with Helmet (CSP, HSTS, X-Content-Type-Options)",
      "Request validation with Zod or Joi",
      "Graceful shutdown on SIGTERM / SIGINT"
    ]
  },
  {
    category: "3. Authentication, Webhooks & Payments",
    items: [
      "Stateless JWT vs stateful session cookies in Redis",
      "Secure refresh token rotation with HTTP-only cookies",
      "Bcrypt password hashing: salt rounds, timing-safe equality",
      "Webhooks purpose: push vs polling for asynchronous events",
      "HMAC SHA-256 signature verification with raw request body",
      "Payment intent lifecycle: created, requires_action, succeeded",
      "Webhook idempotency: preventing duplicate order fulfillment"
    ]
  },
  {
    category: "4. TypeScript, Testing & Production Scale",
    items: [
      "Augmenting Express.Request type for authenticated user",
      "Integration testing with Supertest and Jest/Vitest",
      "Mocking external APIs vs ephemeral database testing",
      "Cluster module for multi-core scaling (master/worker)",
      "Worker Threads for CPU-bound cryptography or image resizing",
      "Diagnosing memory leaks with heap snapshots and Chrome DevTools",
      "Structured logging with Pino/Winston (JSON format, correlation IDs)"
    ]
  }
];

const questions = [];

function q(id, topicId, topicTitle, question, answer, memoryModel, code, tip, comparisonTable) {
  const item = { id, topicId, topicTitle, question, answer };
  if (memoryModel) item.memoryModel = memoryModel;
  if (code) item.code = code;
  if (tip) item.tip = tip;
  if (comparisonTable) item.comparisonTable = comparisonTable;
  questions.push(item);
}

// TOPIC 1: Architecture & Libuv (Q1–Q15)
q(1, 1, "1. Architecture & Libuv",
  "What is Node.js and how does it execute JavaScript on the server?",
  "Node.js is an open-source, cross-platform JavaScript runtime built on Google Chrome's V8 engine and the Libuv C++ library. It executes JavaScript outside the browser using an event-driven, non-blocking asynchronous I/O model on a single execution thread for JS code, while offloading expensive I/O operations to OS-level kernel routines or Libuv's worker thread pool.",
  "Memory Anchor: V8 parses & compiles JS → Libuv handles async I/O & Event Loop → Single JS thread coordinates, C++ threads do heavy lifting.",
  `const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
});
server.listen(3000, () => console.log('Server running on :3000'));`
);

q(2, 1, "1. Architecture & Libuv",
  "Is Node.js truly single-threaded? Explain what is single-threaded and what is multi-threaded.",
  "The JavaScript main execution thread (where your code, call stack, and event loop run) is strictly single-threaded. However, Node.js as a runtime is multi-threaded under the hood: Libuv maintains a C++ worker thread pool (default 4 threads) used for file system operations, DNS lookups, compression (zlib), and cryptographic operations (crypto.pbkdf2), while network I/O is handled asynchronously by OS kernel mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows).",
  "Memory Anchor: JS code is 1 thread. Under the hood: Libuv thread pool (4 threads) + OS kernel async polling.",
  `const crypto = require('crypto');
const start = Date.now();
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => {
    console.log(\`Hash \${i + 1} completed in \${Date.now() - start}ms\`);
  });
}`
);

q(3, 1, "1. Architecture & Libuv",
  "What is the Libuv library and what are its responsibilities?",
  "Libuv is a high-performance, multi-platform C library originally developed for Node.js. Its responsibilities are:\n1) Implementing the Event Loop and managing its execution phases.\n2) Managing asynchronous non-blocking I/O via native OS primitives (epoll, kqueue, IOCP).\n3) Providing the thread pool for operations that cannot be handled non-blockingly by the OS (file I/O, DNS lookup).\n4) Handling timers, child processes, and signal handling (SIGTERM, SIGINT).",
  "Memory Anchor: Libuv = Event Loop + OS non-blocking I/O adapter + Worker Thread Pool."
);

q(4, 1, "1. Architecture & Libuv",
  "Explain the phases of the Node.js Event Loop in exact order.",
  "The Node.js event loop executes through 6 distinct phases in order:\n1. Timers: Executes callbacks scheduled by setTimeout() and setInterval().\n2. Pending Callbacks: Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).\n3. Idle, Prepare: Internal Libuv housekeeping.\n4. Poll: Retrieves new I/O events; executes I/O related callbacks (almost all code executes here); will block and wait for connections if appropriate.\n5. Check: Executes setImmediate() callbacks immediately after the poll phase finishes.\n6. Close Callbacks: Executes close event callbacks (e.g., socket.on('close')).\n*Crucial: Microtasks (process.nextTick and Promise.then) execute between every phase transition!",
  "Memory Anchor: Order mnemonic: 'Time Passes In Peaceful Cities Cleanly' -> Timers, Pending, Idle, Poll, Check, Close.",
  null,
  "Microtasks (process.nextTick > Promises) drain immediately whenever the JS stack empties, even before moving to the next phase!"
);

q(5, 1, "1. Architecture & Libuv",
  "What is the difference between process.nextTick() and setImmediate()?",
  "Despite the names:\n- `process.nextTick()` is NOT part of the event loop. It runs on the nextTick queue immediately after the current operation finishes and before the event loop continues to any phase. It has higher priority than Promise microtasks and can starve the event loop if called recursively.\n- `setImmediate()` runs during the Check phase of the event loop, after I/O callbacks in the Poll phase have been executed.",
  "Memory Anchor: nextTick = Immediate (microtask before next phase). setImmediate = Next tick of the loop (Check phase).",
  `setImmediate(() => console.log('1. setImmediate in Check phase'));
process.nextTick(() => console.log('2. nextTick before loop moves'));
Promise.resolve().then(() => console.log('3. Promise microtask'));
console.log('4. Synchronous execution');

// Output order: 4 -> 2 -> 3 -> 1`,
  null,
  [
    { aspect: "Execution Timing", detail: "process.nextTick runs immediately after current call stack; setImmediate runs in Check phase." },
    { aspect: "Priority", detail: "nextTick > Promise > setImmediate." },
    { aspect: "Starvation Risk", detail: "Recursive nextTick blocks all I/O and timers; setImmediate yields to next tick." }
  ]
);

q(6, 1, "1. Architecture & Libuv",
  "What is the default size of Libuv's thread pool, and how can you change it?",
  "The default size is 4 threads. You can change it by setting the environment variable `UV_THREADPOOL_SIZE` before the Node process initializes (e.g., `UV_THREADPOOL_SIZE=8 node app.js` or in code with `process.env.UV_THREADPOOL_SIZE = 8` before requiring any asynchronous modules). The maximum value is 128.",
  "Memory Anchor: Default 4, Max 128. Change via UV_THREADPOOL_SIZE before any async imports.",
  `process.env.UV_THREADPOOL_SIZE = 8;
const crypto = require('crypto');
// Now 8 pbkdf2 hashing jobs compute concurrently across 8 C++ threads!`
);

q(7, 1, "1. Architecture & Libuv",
  "Which Node.js operations use the Libuv thread pool vs OS asynchronous kernel?",
  "Operations that use the thread pool:\n1) All `fs` (file system) operations (since standard OS filesystems rarely provide truly non-blocking APIs).\n2) `crypto` async methods (pbkdf2, scrypt, randomBytes).\n3) `zlib` compression/decompression.\n4) `dns.lookup()` (which uses system getaddrinfo).\nOperations that DO NOT use the thread pool (use OS kernel epoll/kqueue):\n- Network sockets: `http`, `https`, `net`, `tls`, `dgram` (UDP), and `dns.resolve()`.",
  "Memory Anchor: Disk Files + Crypto + Compression + dns.lookup = Thread pool. Network HTTP/Sockets = OS epoll/kqueue."
);

q(8, 1, "1. Architecture & Libuv",
  "Why is Node.js well-suited for I/O-heavy applications but historically challenging for CPU-heavy tasks?",
  "Node.js excels at I/O-intensive workloads (chat, REST APIs, streaming, microservices) because asynchronous I/O doesn't block the single thread; thousands of connections can wait concurrently with minimal memory footprint (event-driven).\nConversely, for CPU-heavy tasks (video transcoding, ML training, heavy cryptography, matrix math), computing on the single JS thread freezes the Event Loop, blocking all incoming HTTP requests. For CPU-bound tasks in modern Node, you must offload to Worker Threads, child processes, or separate service queues.",
  "Memory Anchor: I/O-heavy = High concurrency with zero thread contention. CPU-heavy = Blocks the main loop without worker threads."
);

q(9, 1, "1. Architecture & Libuv",
  "What happens if you run an infinite synchronous loop in a Node.js server?",
  "An infinite loop (`while(true) {}`) never pops off the JavaScript call stack. Because the call stack never empties, the event loop can NEVER advance to the Poll phase to accept incoming TCP connections, can never execute timer callbacks, and can never process responses. The entire server freezes for all concurrent users.",
  "Memory Anchor: Blocking the call stack blocks the entire server for everyone. Always keep synchronous execution fast."
);

q(10, 1, "1. Architecture & Libuv",
  "What is the difference between microtasks and macrotasks in Node.js?",
  "Microtasks include `process.nextTick` callbacks and resolved `Promise` callbacks (`.then()`, `.catch()`, `await`). They are held in dedicated microtask queues that are completely drained immediately when synchronous execution finishes and between every phase of the event loop.\nMacrotasks (tasks) are callbacks processed in specific event loop phases: Timers (`setTimeout`), I/O polling, Check (`setImmediate`), and Close callbacks.",
  "Memory Anchor: Microtasks = nextTick & Promise (drain between every phase). Macrotasks = Timers, I/O, setImmediate (1 phase at a time)."
);

q(11, 1, "1. Architecture & Libuv",
  "Predict the console output of this code snippet and explain why:",
  "Detailed explanation: 1) Synchronous code logs 'Start' then 'End'; 2) process.nextTick is highest priority microtask; 3) Promise microtask runs next; 4) In next loop iteration, timer runs.",
  "Memory Anchor: Sync stack → nextTick queue → Promise queue → Macrotask (Timers/Check).",
  `console.log('Start');

setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('NextTick'));

console.log('End');

// Output:
// Start
// End
// NextTick
// Promise
// Timeout`
);

q(12, 1, "1. Architecture & Libuv",
  "What is the V8 engine and how does garbage collection work in Node.js?",
  "V8 is Google's C++ JavaScript engine that compiles JS to machine code via JIT (Just-In-Time) compilation with Ignition (interpreter) and TurboFan (optimizing compiler).\nV8 uses generational garbage collection dividing memory into:\n- New Space (Young Generation): Divided into 'Nursery' and 'Intermediate' semi-spaces. Minor GC (Scavenger) runs frequently and fast.\n- Old Space (Old Generation): Objects that survive multiple young GC cycles are promoted here. Major GC (Mark-Sweep-Compact) runs less frequently to clean and defragment heap memory.",
  "Memory Anchor: V8 = Ignition + TurboFan. Heap = Young generation (fast Scavenger) + Old generation (Mark-Sweep-Compact)."
);

q(13, 1, "1. Architecture & Libuv",
  "What is the maximum default memory heap limit in Node.js, and how do you increase it?",
  "On 64-bit systems, Node.js defaults to ~2 GB to 4 GB depending on RAM and Node version. For memory-intensive workloads, you can increase it using the `--max-old-space-size` flag (in megabytes):\n`node --max-old-space-size=8192 server.js` (allocates 8 GB).\nIf Node exceeds this limit, the process crashes with `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.",
  "Memory Anchor: Default ~2-4GB. Increase via --max-old-space-size=<MB> (e.g. 4096 or 8192)."
);

q(14, 1, "1. Architecture & Libuv",
  "How does Node.js achieve zero-cost non-blocking network I/O?",
  "By leveraging native operating system event notification mechanisms:\n- Linux: `epoll`\n- macOS / BSD: `kqueue`\n- Windows: `IOCP` (I/O Completion Ports)\nNode registers file descriptors (sockets) with the OS kernel. The OS notifies Libuv when data is available to read or when a socket is writable. The main thread is never blocked waiting for network packets.",
  "Memory Anchor: OS kernel polling (epoll/kqueue) notifies Libuv when sockets have data. Zero threads sit idle waiting."
);

q(15, 1, "1. Architecture & Libuv",
  "What are unhandledRejection and uncaughtException in Node.js process events?",
  "- `uncaughtException`: Triggered when an unhandled synchronous error bubbles to the top of the event loop. The process is in an undefined state; best practice is to log the error and immediately exit (`process.exit(1)`) so PM2/Docker can restart the container.\n- `unhandledRejection`: Triggered when a Promise rejects and has no `.catch()` handler attached within one event loop turn. In modern Node.js, unhandled rejections terminate the process by default.",
  "Memory Anchor: uncaughtException = fatal sync error, must exit. unhandledRejection = orphan rejected Promise, always attach catch.",
  `process.on('uncaughtException', (err) => {
  logger.error('CRITICAL UNCAUGHT EXCEPTION:', err);
  // Give active connections 1s to finish, then exit:
  setTimeout(() => process.exit(1), 1000).unref();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED PROMISE REJECTION at:', promise, 'reason:', reason);
});`
);

// We will append remaining topics in batches
console.log('Writing batch script...');
fs.writeFileSync(path.resolve(__dirname, 'batch_generator.js'), `// Batch generator
const questions = ${JSON.stringify(questions, null, 2)};
module.exports = questions;
`);
