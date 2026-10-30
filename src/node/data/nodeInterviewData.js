// Node.js & Express Senior Developer Interview Question Bank — 250 Questions with Model Answers
// Upgraded with Spoken Pitches, Engine Mechanics, Follow-ups, and Multi-Approach Solutions Governed by AGENTS.md

export const NODE_INTERVIEW_TOPICS = [
  {
    "id": "all",
    "title": "All Questions",
    "range": "Q1–Q250",
    "count": 250,
    "color": "#34d399"
  },
  {
    "id": 1,
    "title": "1. Architecture & Libuv",
    "range": "Q1–Q15",
    "count": 15,
    "color": "#10b981"
  },
  {
    "id": 2,
    "title": "2. Modules & CommonJS/ESM",
    "range": "Q16–Q30",
    "count": 15,
    "color": "#059669"
  },
  {
    "id": 3,
    "title": "3. Buffers, Streams & Pipe",
    "range": "Q31–Q45",
    "count": 15,
    "color": "#047857"
  },
  {
    "id": 4,
    "title": "4. Async, Events & Concurrency",
    "range": "Q46–Q60",
    "count": 15,
    "color": "#06b6d4"
  },
  {
    "id": 5,
    "title": "5. Express Architecture & Middleware",
    "range": "Q61–Q80",
    "count": 20,
    "color": "#38bdf8"
  },
  {
    "id": 6,
    "title": "6. REST API Design & HTTP",
    "range": "Q81–Q100",
    "count": 20,
    "color": "#60a5fa"
  },
  {
    "id": 7,
    "title": "7. Auth: JWT, Refresh & Bcrypt",
    "range": "Q101–Q115",
    "count": 15,
    "color": "#818cf8"
  },
  {
    "id": 8,
    "title": "8. Webhooks & Signatures",
    "range": "Q116–Q130",
    "count": 15,
    "color": "#a855f7"
  },
  {
    "id": 9,
    "title": "9. Payment Integration Workflows",
    "range": "Q131–Q145",
    "count": 15,
    "color": "#c084fc"
  },
  {
    "id": 10,
    "title": "10. Security, CORS & Hardening",
    "range": "Q146–Q160",
    "count": 15,
    "color": "#e11d48"
  },
  {
    "id": 11,
    "title": "11. File Uploads & S3/Multer",
    "range": "Q161–Q175",
    "count": 15,
    "color": "#f43f5e"
  },
  {
    "id": 12,
    "title": "12. Backend Testing & Supertest",
    "range": "Q176–Q190",
    "count": 15,
    "color": "#fb923c"
  },
  {
    "id": 13,
    "title": "13. Node.js with TypeScript",
    "range": "Q191–Q205",
    "count": 15,
    "color": "#3b82f6"
  },
  {
    "id": 14,
    "title": "14. Clustering & Worker Threads",
    "range": "Q206–Q220",
    "count": 15,
    "color": "#f59e0b"
  },
  {
    "id": 15,
    "title": "15. Performance & Memory Leaks",
    "range": "Q221–Q235",
    "count": 15,
    "color": "#eab308"
  },
  {
    "id": 16,
    "title": "16. Production Ops & Architecture",
    "range": "Q236–Q250",
    "count": 15,
    "color": "#22c55e"
  }
];

export const NODE_STUDY_CHECKLIST = [
  {
    "category": "1. Core Node.js Mechanics & Architecture",
    "items": [
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
    "category": "2. Express.js & Production API Engineering",
    "items": [
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
    "category": "3. Authentication, Webhooks & Payments",
    "items": [
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
    "category": "4. TypeScript, Testing & Production Scale",
    "items": [
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

export const NODE_250_QUESTIONS = [
  {
    "id": 1,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is Node.js and how does it execute JavaScript on the server?",
    "answer": "Node.js is an open-source, cross-platform JavaScript runtime built on Google Chrome's V8 engine and the Libuv C++ library. It executes JavaScript outside the browser using an event-driven, non-blocking asynchronous I/O model on a single execution thread for JS code, while offloading expensive I/O operations to OS-level kernel routines or Libuv's worker thread pool.",
    "memoryModel": "Memory Anchor: V8 parses & compiles JS → Libuv handles async I/O & Event Loop → Single JS thread coordinates, C++ threads do heavy lifting.",
    "code": "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));\n});\nserver.listen(3000, () => console.log('Server running on :3000'));",
    "difficulty": "Mid",
    "pitch": "In production, What is Node.js and how does it execute JavaScript on the server centers on first-principles system mechanics. Specifically: Node.js is an open-source, cross-platform JavaScript runtime built on Google Chrome's V8 engine and the Libuv C++ library. It executes JavaScript outside the browser using an event...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: V8 parses & compiles JS → Libuv handles async I/O & Event Loop → Single JS thread coordinates, C++ threads do heavy lifting.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 2,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "Is Node.js truly single-threaded? Explain what is single-threaded and what is multi-threaded.",
    "answer": "The JavaScript main execution thread (where your code, call stack, and event loop run) is strictly single-threaded. However, Node.js as a runtime is multi-threaded under the hood: Libuv maintains a C++ worker thread pool (default 4 threads) used for file system operations, DNS lookups, compression (zlib), and cryptographic operations (crypto.pbkdf2), while network I/O is handled asynchronously by OS kernel mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows).",
    "memoryModel": "Memory Anchor: JS code is 1 thread. Under the hood: Libuv thread pool (4 threads) + OS kernel async polling.",
    "code": "const crypto = require('crypto');\nconst start = Date.now();\nfor (let i = 0; i < 4; i++) {\n  crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => {\n    console.log(`Hash ${i + 1} completed in ${Date.now() - start}ms`);\n  });\n}",
    "difficulty": "Mid",
    "pitch": "In production, Is Node.js truly single-threaded? Explain what is single-threaded and what is multi-threaded. centers on first-principles system mechanics. Specifically: The JavaScript main execution thread (where your code, call stack, and event loop run) is strictly single-threaded. However, Node.js as a runtime is multi-threaded under the hood: ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: JS code is 1 thread. Under the hood: Libuv thread pool (4 threads) + OS kernel async polling.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 3,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the Libuv library and what are its responsibilities?",
    "answer": "Libuv is a high-performance, multi-platform C library originally developed for Node.js. Its responsibilities are:\n1) Implementing the Event Loop and managing its execution phases.\n2) Managing asynchronous non-blocking I/O via native OS primitives (epoll, kqueue, IOCP).\n3) Providing the thread pool for operations that cannot be handled non-blockingly by the OS (file I/O, DNS lookup).\n4) Handling timers, child processes, and signal handling (SIGTERM, SIGINT).",
    "memoryModel": "Memory Anchor: Libuv = Event Loop + OS non-blocking I/O adapter + Worker Thread Pool.",
    "difficulty": "Mid",
    "pitch": "In production, What is the Libuv library and what are its responsibilities centers on first-principles system mechanics. Specifically: Libuv is a high-performance, multi-platform C library originally developed for Node.js. Its responsibilities are:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Libuv = Event Loop + OS non-blocking I/O adapter + Worker Thread Pool.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 4,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "Explain the phases of the Node.js Event Loop in exact order.",
    "answer": "The Node.js event loop executes through 6 distinct phases in order:\n1. Timers: Executes callbacks scheduled by setTimeout() and setInterval().\n2. Pending Callbacks: Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).\n3. Idle, Prepare: Internal Libuv housekeeping.\n4. Poll: Retrieves new I/O events; executes I/O related callbacks (almost all code executes here); will block and wait for connections if appropriate.\n5. Check: Executes setImmediate() callbacks immediately after the poll phase finishes.\n6. Close Callbacks: Executes close event callbacks (e.g., socket.on('close')).\n*Crucial: Microtasks (process.nextTick and Promise.then) execute between every phase transition!",
    "memoryModel": "Memory Anchor: Order mnemonic: 'Time Passes In Peaceful Cities Cleanly' -> Timers, Pending, Idle, Poll, Check, Close.",
    "tip": "Microtasks (process.nextTick > Promises) drain immediately whenever the JS stack empties, even before moving to the next phase!",
    "difficulty": "Mid",
    "pitch": "In production, Explain the phases of the Node.js Event Loop in exact order. centers on first-principles system mechanics. Specifically: The Node.js event loop executes through 6 distinct phases in order:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Order mnemonic: 'Time Passes In Peaceful Cities Cleanly' -> Timers, Pending, Idle, Poll, Check, Close.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 5,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the difference between process.nextTick() and setImmediate()?",
    "answer": "Despite the names:\n- `process.nextTick()` is NOT part of the event loop. It runs on the nextTick queue immediately after the current operation finishes and before the event loop continues to any phase. It has higher priority than Promise microtasks and can starve the event loop if called recursively.\n- `setImmediate()` runs during the Check phase of the event loop, after I/O callbacks in the Poll phase have been executed.",
    "memoryModel": "Memory Anchor: nextTick = Immediate (microtask before next phase). setImmediate = Next tick of the loop (Check phase).",
    "code": "setImmediate(() => console.log('1. setImmediate in Check phase'));\nprocess.nextTick(() => console.log('2. nextTick before loop moves'));\nPromise.resolve().then(() => console.log('3. Promise microtask'));\nconsole.log('4. Synchronous execution');\n\n// Output order: 4 -> 2 -> 3 -> 1",
    "comparisonTable": [
      {
        "aspect": "Execution Timing",
        "detail": "process.nextTick runs immediately after current call stack; setImmediate runs in Check phase."
      },
      {
        "aspect": "Priority",
        "detail": "nextTick > Promise > setImmediate."
      },
      {
        "aspect": "Starvation Risk",
        "detail": "Recursive nextTick blocks all I/O and timers; setImmediate yields to next tick."
      }
    ],
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between process.nextTick() and setImmediate() centers on first-principles system mechanics. Specifically: Despite the names:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: nextTick = Immediate (microtask before next phase). setImmediate = Next tick of the loop (Check phase).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 6,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the default size of Libuv's thread pool, and how can you change it?",
    "answer": "The default size is 4 threads. You can change it by setting the environment variable `UV_THREADPOOL_SIZE` before the Node process initializes (e.g., `UV_THREADPOOL_SIZE=8 node app.js` or in code with `process.env.UV_THREADPOOL_SIZE = 8` before requiring any asynchronous modules). The maximum value is 128.",
    "memoryModel": "Memory Anchor: Default 4, Max 128. Change via UV_THREADPOOL_SIZE before any async imports.",
    "code": "process.env.UV_THREADPOOL_SIZE = 8;\nconst crypto = require('crypto');\n// Now 8 pbkdf2 hashing jobs compute concurrently across 8 C++ threads!",
    "difficulty": "Mid",
    "pitch": "In production, What is the default size of Libuv's thread pool, and how can you change it centers on first-principles system mechanics. Specifically: The default size is 4 threads. You can change it by setting the environment variable `UV_THREADPOOL_SIZE` before the Node process initializes (e.g., `UV_THREADPOOL_SIZE=8 node app....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Default 4, Max 128. Change via UV_THREADPOOL_SIZE before any async imports.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 7,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "Which Node.js operations use the Libuv thread pool vs OS asynchronous kernel?",
    "answer": "Operations that use the thread pool:\n1) All `fs` (file system) operations (since standard OS filesystems rarely provide truly non-blocking APIs).\n2) `crypto` async methods (pbkdf2, scrypt, randomBytes).\n3) `zlib` compression/decompression.\n4) `dns.lookup()` (which uses system getaddrinfo).\nOperations that DO NOT use the thread pool (use OS kernel epoll/kqueue):\n- Network sockets: `http`, `https`, `net`, `tls`, `dgram` (UDP), and `dns.resolve()`.",
    "memoryModel": "Memory Anchor: Disk Files + Crypto + Compression + dns.lookup = Thread pool. Network HTTP/Sockets = OS epoll/kqueue.",
    "difficulty": "Mid",
    "pitch": "In production, Which Node.js operations use the Libuv thread pool vs OS asynchronous kernel centers on first-principles system mechanics. Specifically: Operations that use the thread pool:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Disk Files + Crypto + Compression + dns.lookup = Thread pool. Network HTTP/Sockets = OS epoll/kqueue.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 8,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "Why is Node.js well-suited for I/O-heavy applications but historically challenging for CPU-heavy tasks?",
    "answer": "Node.js excels at I/O-intensive workloads (chat, REST APIs, streaming, microservices) because asynchronous I/O doesn't block the single thread; thousands of connections can wait concurrently with minimal memory footprint (event-driven).\nConversely, for CPU-heavy tasks (video transcoding, ML training, heavy cryptography, matrix math), computing on the single JS thread freezes the Event Loop, blocking all incoming HTTP requests. For CPU-bound tasks in modern Node, you must offload to Worker Threads, child processes, or separate service queues.",
    "memoryModel": "Memory Anchor: I/O-heavy = High concurrency with zero thread contention. CPU-heavy = Blocks the main loop without worker threads.",
    "difficulty": "Mid",
    "pitch": "In production, Why is Node.js well-suited for I/O-heavy applications but historically challenging for CPU-heavy tasks centers on first-principles system mechanics. Specifically: Node.js excels at I/O-intensive workloads (chat, REST APIs, streaming, microservices) because asynchronous I/O doesn't block the single thread; thousands of connections can wait co...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: I/O-heavy = High concurrency with zero thread contention. CPU-heavy = Blocks the main loop without worker threads.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 9,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What happens if you run an infinite synchronous loop in a Node.js server?",
    "answer": "An infinite loop (`while(true) {}`) never pops off the JavaScript call stack. Because the call stack never empties, the event loop can NEVER advance to the Poll phase to accept incoming TCP connections, can never execute timer callbacks, and can never process responses. The entire server freezes for all concurrent users.",
    "memoryModel": "Memory Anchor: Blocking the call stack blocks the entire server for everyone. Always keep synchronous execution fast.",
    "difficulty": "Mid",
    "pitch": "In production, What happens if you run an infinite synchronous loop in a Node.js server centers on first-principles system mechanics. Specifically: An infinite loop (`while(true) {}`) never pops off the JavaScript call stack. Because the call stack never empties, the event loop can NEVER advance to the Poll phase to accept inc...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Blocking the call stack blocks the entire server for everyone. Always keep synchronous execution fast.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 10,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the difference between microtasks and macrotasks in Node.js?",
    "answer": "Microtasks include `process.nextTick` callbacks and resolved `Promise` callbacks (`.then()`, `.catch()`, `await`). They are held in dedicated microtask queues that are completely drained immediately when synchronous execution finishes and between every phase of the event loop.\nMacrotasks (tasks) are callbacks processed in specific event loop phases: Timers (`setTimeout`), I/O polling, Check (`setImmediate`), and Close callbacks.",
    "memoryModel": "Memory Anchor: Microtasks = nextTick & Promise (drain between every phase). Macrotasks = Timers, I/O, setImmediate (1 phase at a time).",
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between microtasks and macrotasks in Node.js centers on first-principles system mechanics. Specifically: Microtasks include `process.nextTick` callbacks and resolved `Promise` callbacks (`.then()`, `.catch()`, `await`). They are held in dedicated microtask queues that are completely d...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Microtasks = nextTick & Promise (drain between every phase). Macrotasks = Timers, I/O, setImmediate (1 phase at a time).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 11,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "Predict the console output of this code snippet and explain why:",
    "answer": "Detailed explanation: 1) Synchronous code logs 'Start' then 'End'; 2) process.nextTick is highest priority microtask; 3) Promise microtask runs next; 4) In next loop iteration, timer runs.",
    "memoryModel": "Memory Anchor: Sync stack → nextTick queue → Promise queue → Macrotask (Timers/Check).",
    "code": "console.log('Start');\n\nsetTimeout(() => console.log('Timeout'), 0);\nPromise.resolve().then(() => console.log('Promise'));\nprocess.nextTick(() => console.log('NextTick'));\n\nconsole.log('End');\n\n// Output:\n// Start\n// End\n// NextTick\n// Promise\n// Timeout",
    "difficulty": "Mid",
    "pitch": "In production, Predict the console output of this code snippet and explain why: centers on first-principles system mechanics. Specifically: Detailed explanation: 1) Synchronous code logs 'Start' then 'End'; 2) process.nextTick is highest priority microtask; 3) Promise microtask runs next; 4) In next loop iteration, tim...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Sync stack → nextTick queue → Promise queue → Macrotask (Timers/Check).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 12,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the V8 engine and how does garbage collection work in Node.js?",
    "answer": "V8 is Google's C++ JavaScript engine that compiles JS to machine code via JIT (Just-In-Time) compilation with Ignition (interpreter) and TurboFan (optimizing compiler).\nV8 uses generational garbage collection dividing memory into:\n- New Space (Young Generation): Divided into 'Nursery' and 'Intermediate' semi-spaces. Minor GC (Scavenger) runs frequently and fast.\n- Old Space (Old Generation): Objects that survive multiple young GC cycles are promoted here. Major GC (Mark-Sweep-Compact) runs less frequently to clean and defragment heap memory.",
    "memoryModel": "Memory Anchor: V8 = Ignition + TurboFan. Heap = Young generation (fast Scavenger) + Old generation (Mark-Sweep-Compact).",
    "difficulty": "Mid",
    "pitch": "In production, What is the V8 engine and how does garbage collection work in Node.js centers on first-principles system mechanics. Specifically: V8 is Google's C++ JavaScript engine that compiles JS to machine code via JIT (Just-In-Time) compilation with Ignition (interpreter) and TurboFan (optimizing compiler)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: V8 = Ignition + TurboFan. Heap = Young generation (fast Scavenger) + Old generation (Mark-Sweep-Compact).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 13,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What is the maximum default memory heap limit in Node.js, and how do you increase it?",
    "answer": "On 64-bit systems, Node.js defaults to ~2 GB to 4 GB depending on RAM and Node version. For memory-intensive workloads, you can increase it using the `--max-old-space-size` flag (in megabytes):\n`node --max-old-space-size=8192 server.js` (allocates 8 GB).\nIf Node exceeds this limit, the process crashes with `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.",
    "memoryModel": "Memory Anchor: Default ~2-4GB. Increase via --max-old-space-size=<MB> (e.g. 4096 or 8192).",
    "difficulty": "Mid",
    "pitch": "In production, What is the maximum default memory heap limit in Node.js, and how do you increase it centers on first-principles system mechanics. Specifically: On 64-bit systems, Node.js defaults to ~2 GB to 4 GB depending on RAM and Node version. For memory-intensive workloads, you can increase it using the `--max-old-space-size` flag (i...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Default ~2-4GB. Increase via --max-old-space-size=<MB> (e.g. 4096 or 8192).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 14,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "How does Node.js achieve zero-cost non-blocking network I/O?",
    "answer": "By leveraging native operating system event notification mechanisms:\n- Linux: `epoll`\n- macOS / BSD: `kqueue`\n- Windows: `IOCP` (I/O Completion Ports)\nNode registers file descriptors (sockets) with the OS kernel. The OS notifies Libuv when data is available to read or when a socket is writable. The main thread is never blocked waiting for network packets.",
    "memoryModel": "Memory Anchor: OS kernel polling (epoll/kqueue) notifies Libuv when sockets have data. Zero threads sit idle waiting.",
    "difficulty": "Mid",
    "pitch": "In production, How does Node.js achieve zero-cost non-blocking network I/O centers on first-principles system mechanics. Specifically: By leveraging native operating system event notification mechanisms:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: OS kernel polling (epoll/kqueue) notifies Libuv when sockets have data. Zero threads sit idle waiting.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 15,
    "topicId": 1,
    "topicTitle": "1. Architecture & Libuv",
    "question": "What are unhandledRejection and uncaughtException in Node.js process events?",
    "answer": "- `uncaughtException`: Triggered when an unhandled synchronous error bubbles to the top of the event loop. The process is in an undefined state; best practice is to log the error and immediately exit (`process.exit(1)`) so PM2/Docker can restart the container.\n- `unhandledRejection`: Triggered when a Promise rejects and has no `.catch()` handler attached within one event loop turn. In modern Node.js, unhandled rejections terminate the process by default.",
    "memoryModel": "Memory Anchor: uncaughtException = fatal sync error, must exit. unhandledRejection = orphan rejected Promise, always attach catch.",
    "code": "process.on('uncaughtException', (err) => {\n  logger.error('CRITICAL UNCAUGHT EXCEPTION:', err);\n  setTimeout(() => process.exit(1), 1000).unref();\n});\n\nprocess.on('unhandledRejection', (reason, promise) => {\n  logger.error('UNHANDLED PROMISE REJECTION at:', promise, 'reason:', reason);\n});",
    "difficulty": "Mid",
    "pitch": "In production, What are unhandledRejection and uncaughtException in Node.js process events centers on first-principles system mechanics. Specifically: - `uncaughtException`: Triggered when an unhandled synchronous error bubbles to the top of the event loop. The process is in an undefined state; best practice is to log the error a...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: uncaughtException = fatal sync error, must exit. unhandledRejection = orphan rejected Promise, always attach catch.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 16,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the difference between CommonJS (CJS) and ECMAScript Modules (ESM)?",
    "answer": "CommonJS is Node's legacy module system using `require()` and `module.exports`. It loads modules synchronously at runtime. ESM (`import`/`export`) is the official ECMAScript standard. It is asynchronous, statically analyzable at compile/parse time (enabling tree-shaking), and uses top-level `await`.",
    "memoryModel": "Memory Anchor: CJS = Synchronous runtime require(). ESM = Static compile-time import with tree-shaking & top-level await.",
    "code": "// CommonJS (CJS)\nconst fs = require('fs');\nmodule.exports = { myFunction };\n\n// ES Modules (ESM)\nimport fs from 'node:fs';\nexport { myFunction };",
    "comparisonTable": [
      {
        "aspect": "Loading Timing",
        "detail": "CJS loads synchronously at runtime; ESM parses statically in phases (construction, instantiation, evaluation)."
      },
      {
        "aspect": "Syntax",
        "detail": "require() / module.exports vs import / export."
      },
      {
        "aspect": "Top-level await",
        "detail": "Supported natively in ESM; requires async wrapper in CJS."
      },
      {
        "aspect": "Tree shaking",
        "detail": "Supported in ESM due to static analysis; difficult in CJS."
      }
    ],
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between CommonJS (CJS) and ECMAScript Modules (ESM) centers on first-principles system mechanics. Specifically: CommonJS is Node's legacy module system using `require()` and `module.exports`. It loads modules synchronously at runtime. ESM (`import`/`export`) is the official ECMAScript standa...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: CJS = Synchronous runtime require(). ESM = Static compile-time import with tree-shaking & top-level await.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 17,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "How does Node.js resolve and cache required modules?",
    "answer": "Node.js caches modules in `require.cache` by their resolved absolute file path after the first `require()`. Subsequent calls return the cached `exports` object without re-executing the module code. Modules are resolved in order: 1) Core modules (fs, path); 2) File or folder paths (./, ../); 3) `node_modules` walked upwards to the filesystem root.",
    "memoryModel": "Memory Anchor: Resolved absolute path → Looked up in require.cache → If found return cached, else evaluate and cache.",
    "code": "// Invalidate cache dynamically (e.g., hot-reloading mock data):\nconst modulePath = require.resolve('./config');\ndelete require.cache[modulePath];\nconst freshConfig = require('./config');",
    "difficulty": "Mid",
    "pitch": "In production, How does Node.js resolve and cache required modules centers on first-principles system mechanics. Specifically: Node.js caches modules in `require.cache` by their resolved absolute file path after the first `require()`. Subsequent calls return the cached `exports` object without re-executing...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Resolved absolute path → Looked up in require.cache → If found return cached, else evaluate and cache.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 18,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the difference between exports and module.exports in CommonJS?",
    "answer": "`module.exports` is the actual object returned when another file requires the module. `exports` is merely a variable initialized to reference `module.exports` (`exports = module.exports = {}`).\nIf you reassign `exports = function() {}`, you break the reference to `module.exports` and nothing is exported! Always assign to `module.exports` if exporting a single class, function, or primitive.",
    "memoryModel": "Memory Anchor: module.exports is the real master. exports is only a helper shortcut reference.",
    "code": "// CORRECT:\nexports.add = (a, b) => a + b;\nexports.subtract = (a, b) => a - b;\n\n// OR replacing entire export:\nmodule.exports = class AuthService {};\n\n// INCORRECT (breaks reference!):\n// exports = class AuthService {}; // Exports remain empty object!",
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between exports and module.exports in CommonJS centers on first-principles system mechanics. Specifically: `module.exports` is the actual object returned when another file requires the module. `exports` is merely a variable initialized to reference `module.exports` (`exports = module.ex...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: module.exports is the real master. exports is only a helper shortcut reference.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 19,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "How does Node.js handle circular module dependencies in CommonJS?",
    "answer": "When module A requires module B while B requires module A, Node does not deadlock. Instead, module B receives an **incomplete, partial copy** of module A's `exports` object as it was evaluated up to that point. Once both finish executing, the references are updated, but circular dependencies can cause undefined function calls if properties are accessed during initial module evaluation.",
    "memoryModel": "Memory Anchor: Returns an incomplete copy of exports evaluated so far. Avoid circular dependencies by refactoring shared code into a third module.",
    "code": "// a.js: const b = require('./b'); exports.done = false;\n// b.js: const a = require('./a'); console.log('a.done in b:', a.done);",
    "difficulty": "Mid",
    "pitch": "In production, How does Node.js handle circular module dependencies in CommonJS centers on first-principles system mechanics. Specifically: When module A requires module B while B requires module A, Node does not deadlock. Instead, module B receives an incomplete, partial copy of module A's `exports` object as it was e...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Returns an incomplete copy of exports evaluated so far. Avoid circular dependencies by refactoring shared code into a third module.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 20,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "How do you enable ECMAScript Modules (ESM) in a Node.js project?",
    "answer": "Two standard methods:\n1) Add `\"type\": \"module\"` to `package.json`. All `.js` files in the project will be treated as ESM.\n2) Use the `.mjs` file extension for ESM files, or `.cjs` for explicit CommonJS files when `type: module` is active.",
    "memoryModel": "Memory Anchor: \"type\": \"module\" in package.json OR use .mjs file extension.",
    "difficulty": "Mid",
    "pitch": "In production, How do you enable ECMAScript Modules (ESM) in a Node.js project centers on first-principles system mechanics. Specifically: Two standard methods:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: \"type\": \"module\" in package.json OR use .mjs file extension.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 21,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "Why are __dirname and __filename missing in ESM, and how do you recreate them?",
    "answer": "In ESM, `__dirname` and `__filename` are not defined because ESM modules are designed to run in both browser and server environments where file paths don't exist. Instead, ESM provides `import.meta.url`. You recreate them using `fileURLToPath` from the `node:url` module and `dirname` from `node:path`.",
    "memoryModel": "Memory Anchor: Use import.meta.url + fileURLToPath + dirname to recreate __dirname in ESM.",
    "code": "import { fileURLToPath } from 'node:url';\nimport { dirname, join } from 'node:path';\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\nconst filePath = join(__dirname, 'data.json');",
    "difficulty": "Senior",
    "pitch": "In production, Why are __dirname and __filename missing in ESM, and how do you recreate them centers on first-principles system mechanics. Specifically: In ESM, `__dirname` and `__filename` are not defined because ESM modules are designed to run in both browser and server environments where file paths don't exist. Instead, ESM prov...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use import.meta.url + fileURLToPath + dirname to recreate __dirname in ESM.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 22,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "Can you import CommonJS modules into ESM, and can you require() ESM modules into CommonJS?",
    "answer": "1) ESM importing CJS: Fully supported via default import (`import express from 'express'`).\n2) CJS requiring ESM: Synchronous `require('./esm-file.mjs')` throws `ERR_REQUIRE_ESM`. In CJS, you must use dynamic `import('./esm-file.mjs')` which returns a Promise.",
    "memoryModel": "Memory Anchor: ESM can import CJS easily. CJS can only load ESM via async dynamic import().",
    "code": "// In CommonJS file:\nasync function loadESM() {\n  const { default: chalk } = await import('chalk');\n  console.log(chalk.green('Loaded ESM module in CommonJS!'));\n}",
    "difficulty": "Senior",
    "pitch": "In production, Can you import CommonJS modules into ESM, and can you require() ESM modules into CommonJS centers on first-principles system mechanics. Specifically: 1) ESM importing CJS: Fully supported via default import (`import express from 'express'`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: ESM can import CJS easily. CJS can only load ESM via async dynamic import().",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 23,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the Module Wrapper Function in CommonJS?",
    "answer": "Before executing any CommonJS file, Node.js wraps the file content in an IIFE function wrapper:\n`(function (exports, require, module, __filename, __dirname) { ... your code ... });`\nThis gives each file its private scope (preventing global variable leakage) and injects the module-specific variables (`require`, `module`, `exports`, `__filename`, `__dirname`).",
    "memoryModel": "Memory Anchor: (function (exports, require, module, __filename, __dirname) { your code })();",
    "difficulty": "Senior",
    "pitch": "In production, What is the Module Wrapper Function in CommonJS centers on first-principles system mechanics. Specifically: Before executing any CommonJS file, Node.js wraps the file content in an IIFE function wrapper:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: (function (exports, require, module, __filename, __dirname) { your code })();",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 24,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is package-lock.json and why must it be committed to version control?",
    "answer": "`package-lock.json` records the exact, deterministic dependency tree (exact versions, resolved registry URLs, and integrity SHA-512 hashes) of every package and transitive dependency installed. Committing it guarantees identical installations across development, staging, CI/CD, and production environments (`npm ci`), eliminating 'works on my machine' version drift.",
    "memoryModel": "Memory Anchor: package-lock.json = Deterministic reproducible builds across all machines and CI/CD pipelines.",
    "difficulty": "Senior",
    "pitch": "In production, What is package-lock.json and why must it be committed to version control centers on first-principles system mechanics. Specifically: `package-lock.json` records the exact, deterministic dependency tree (exact versions, resolved registry URLs, and integrity SHA-512 hashes) of every package and transitive dependen...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: package-lock.json = Deterministic reproducible builds across all machines and CI/CD pipelines.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 25,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the difference between npm install and npm ci?",
    "answer": "`npm install` resolves versions from package.json and updates package-lock.json if ranges allow. `npm ci` (Clean Install) strictly validates package.json against package-lock.json, deletes the existing `node_modules`, and installs the exact locked versions without modifying package-lock.json. `npm ci` is faster and mandatory for production CI/CD.",
    "memoryModel": "Memory Anchor: npm i = Local dev & updates lockfile. npm ci = Clean, fast, deterministic install for CI/CD.",
    "comparisonTable": [
      {
        "aspect": "npm install",
        "detail": "Can upgrade dependencies within caret (^) ranges; writes to package-lock.json."
      },
      {
        "aspect": "npm ci",
        "detail": "Deletes node_modules; enforces exact lockfile; fails if lockfile is out of sync."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between npm install and npm ci centers on first-principles system mechanics. Specifically: `npm install` resolves versions from package.json and updates package-lock.json if ranges allow. `npm ci` (Clean Install) strictly validates package.json against package-lock.json,...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: npm i = Local dev & updates lockfile. npm ci = Clean, fast, deterministic install for CI/CD.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 26,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What are peerDependencies in package.json?",
    "answer": "`peerDependencies` specify that a package requires a specific version of a host dependency to be installed by the consuming application, rather than bundling its own copy. Commonly used for plugins (e.g. an Express middleware requires `express` as a peerDependency so they share the same Express singleton instance).",
    "memoryModel": "Memory Anchor: Peer dependencies expect the host project to provide the shared dependency.",
    "difficulty": "Senior",
    "pitch": "In production, What are peerDependencies in package.json centers on first-principles system mechanics. Specifically: `peerDependencies` specify that a package requires a specific version of a host dependency to be installed by the consuming application, rather than bundling its own copy. Commonly...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Peer dependencies expect the host project to provide the shared dependency.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 27,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the node: prefix in core module imports?",
    "answer": "Starting in Node.js 16+, prefixing core modules with `node:` (`node:fs`, `node:path`, `node:crypto`, `node:http`) makes it explicit that a built-in Node.js module is being loaded, prevents shadowing conflicts with third-party npm packages of the same name, and speeds up module resolution.",
    "memoryModel": "Memory Anchor: Always use node: prefix for core modules in modern Node.js.",
    "difficulty": "Senior",
    "pitch": "In production, What is the node: prefix in core module imports centers on first-principles system mechanics. Specifically: Starting in Node.js 16+, prefixing core modules with `node:` (`node:fs`, `node:path`, `node:crypto`, `node:http`) makes it explicit that a built-in Node.js module is being loaded, ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Always use node: prefix for core modules in modern Node.js.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 28,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is dynamic import() and when should it be used?",
    "answer": "`import(specifier)` is a function-like syntax that returns a Promise resolving to the requested module. It allows conditional or on-demand module loading (e.g. loading a heavy PDF generation module only when the user requests an invoice export), reducing initial memory consumption and startup time.",
    "memoryModel": "Memory Anchor: Dynamic import = Lazy-load heavy modules on demand inside async functions.",
    "code": "app.get('/export-report', async (req, res) => {\n  const { generatePdfReport } = await import('./heavyPdfService.js');\n  const buffer = await generatePdfReport(req.query);\n  res.type('pdf').send(buffer);\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is dynamic import() and when should it be used centers on first-principles system mechanics. Specifically: `import(specifier)` is a function-like syntax that returns a Promise resolving to the requested module. It allows conditional or on-demand module loading (e.g. loading a heavy PDF ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Dynamic import = Lazy-load heavy modules on demand inside async functions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 29,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "What is the exports field in package.json?",
    "answer": "The `exports` field defines the official public entry points and subpath exports of a package, encapsulating internal private files from being accessed by consumers (`exports: { \".\": \"./index.js\", \"./utils\": \"./dist/utils.js\" }`). It can also provide conditional exports for ESM (`import`) vs CJS (`require`).",
    "memoryModel": "Memory Anchor: exports field = Encapsulates package internals and specifies conditional CJS/ESM entry points.",
    "difficulty": "Senior",
    "pitch": "In production, What is the exports field in package.json centers on first-principles system mechanics. Specifically: The `exports` field defines the official public entry points and subpath exports of a package, encapsulating internal private files from being accessed by consumers (`exports: { \"....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: exports field = Encapsulates package internals and specifies conditional CJS/ESM entry points.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 30,
    "topicId": 2,
    "topicTitle": "2. Modules & CommonJS/ESM",
    "question": "How do you inspect the module resolution path for a package?",
    "answer": "Use `require.resolve(moduleName)`. It returns the exact absolute path of the file that would be loaded without actually executing or evaluating the module.",
    "memoryModel": "Memory Anchor: require.resolve('lodash') returns the absolute path without executing it.",
    "difficulty": "Senior",
    "pitch": "In production, How do you inspect the module resolution path for a package centers on first-principles system mechanics. Specifically: Use `require.resolve(moduleName)`. It returns the exact absolute path of the file that would be loaded without actually executing or evaluating the module....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: require.resolve('lodash') returns the absolute path without executing it.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 31,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is a Buffer in Node.js, and why is it needed?",
    "answer": "A Buffer represents a fixed-length chunk of raw binary memory allocated outside the V8 JavaScript heap (using C++ memory allocation). It is needed because pure JavaScript originally had no mechanism for manipulating binary byte streams (TCP packets, file reading, image processing). Buffers store 8-bit octets (values 0–255).",
    "memoryModel": "Memory Anchor: Buffer = Raw binary memory allocated outside the V8 heap for binary data and I/O.",
    "code": "const buf = Buffer.from('Hello, Senior SDE!');\nconsole.log(buf); // <Buffer 48 65 6c 6c 6f...>\nconsole.log(buf.toString('hex')); // Hex representation\nconsole.log(buf.toString('base64')); // Base64 encoding",
    "difficulty": "Mid",
    "pitch": "In production, What is a Buffer in Node.js, and why is it needed centers on first-principles system mechanics. Specifically: A Buffer represents a fixed-length chunk of raw binary memory allocated outside the V8 JavaScript heap (using C++ memory allocation). It is needed because pure JavaScript originall...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Buffer = Raw binary memory allocated outside the V8 heap for binary data and I/O.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 32,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is the difference between Buffer.alloc() and Buffer.allocUnsafe()?",
    "answer": "`Buffer.alloc(size)` allocates memory and initializes all bytes to zero (`0x00`). It is safe from memory leaks.\n`Buffer.allocUnsafe(size)` allocates memory without zeroing it out. It is significantly faster because it avoids writing zeros, but the buffer may contain residual, sensitive data (passwords, tokens) previously held in that memory segment. If using `allocUnsafe`, you must immediately overwrite all bytes.",
    "memoryModel": "Memory Anchor: alloc = Safe, zeroed out. allocUnsafe = Ultra-fast, but contains uninitialized dirty memory.",
    "comparisonTable": [
      {
        "aspect": "Buffer.alloc(size)",
        "detail": "Zero-filled; safe; zero risk of leaking confidential memory."
      },
      {
        "aspect": "Buffer.allocUnsafe(size)",
        "detail": "Non-zeroed; faster; security risk if exposed directly without writing."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between Buffer.alloc() and Buffer.allocUnsafe() centers on first-principles system mechanics. Specifically: `Buffer.alloc(size)` allocates memory and initializes all bytes to zero (`0x00`). It is safe from memory leaks....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: alloc = Safe, zeroed out. allocUnsafe = Ultra-fast, but contains uninitialized dirty memory.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 33,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What are Streams in Node.js, and what are the 4 fundamental stream types?",
    "answer": "Streams are collections of data that might not be available all at once and don't have to fit entirely into memory. They process data chunk-by-chunk.\nThe 4 types:\n1) `Readable`: Abstraction for a source from which data can be consumed (`fs.createReadStream`, HTTP `req`).\n2) `Writable`: Abstraction for a destination to which data can be written (`fs.createWriteStream`, HTTP `res`).\n3) `Duplex`: Stream that is both Readable and Writable (e.g. TCP `net.Socket`).\n4) `Transform`: A duplex stream where the output is computed from the input (e.g. `zlib.createGzip`, crypto cipher).",
    "memoryModel": "Memory Anchor: 4 Streams = Readable (source), Writable (sink), Duplex (both), Transform (middleware filter).",
    "difficulty": "Senior",
    "pitch": "In production, What are Streams in Node.js, and what are the 4 fundamental stream types centers on first-principles system mechanics. Specifically: Streams are collections of data that might not be available all at once and don't have to fit entirely into memory. They process data chunk-by-chunk....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 4 Streams = Readable (source), Writable (sink), Duplex (both), Transform (middleware filter).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 34,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "Why is streaming essential when serving large files (e.g. 2 GB video) in Express?",
    "answer": "Using `fs.readFile()` loads the entire 2 GB file into V8 heap memory before sending it. If 10 concurrent users request it, the server attempts to allocate 20 GB of RAM, causing memory exhaustion and crashes.\nStreaming (`fs.createReadStream().pipe(res)`) loads data in small, configurable chunks (default 64 KB), keeping memory usage constant (~few megabytes) regardless of whether the file is 10 MB or 100 GB.",
    "memoryModel": "Memory Anchor: readFile = Loads entire file into RAM (crashes). createReadStream = Constant low memory footprint.",
    "code": "// BAD: Loads 2GB into RAM\napp.get('/bad-download', (req, res) => {\n  fs.readFile('./huge-video.mp4', (err, data) => res.send(data));\n});\n\n// GOOD: Streams 64KB chunks to response\napp.get('/stream-download', (req, res) => {\n  const stream = fs.createReadStream('./huge-video.mp4');\n  res.setHeader('Content-Type', 'video/mp4');\n  stream.pipe(res);\n});",
    "difficulty": "Senior",
    "pitch": "In production, Why is streaming essential when serving large files (e.g. 2 GB video) in Express centers on first-principles system mechanics. Specifically: Using `fs.readFile()` loads the entire 2 GB file into V8 heap memory before sending it. If 10 concurrent users request it, the server attempts to allocate 20 GB of RAM, causing mem...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: readFile = Loads entire file into RAM (crashes). createReadStream = Constant low memory footprint.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 35,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is Backpressure in streams, and how is it handled?",
    "answer": "Backpressure occurs when the data source (Readable stream) produces data faster than the destination (Writable stream) can process or write it (e.g. fast disk read vs slow 3G mobile client connection).\nWithout backpressure management, unwritten chunks pile up in memory buffer, eventually causing an out-of-memory crash. Node handles backpressure via `write() === false` and the `'drain'` event, or automatically using `.pipe()` / `pipeline()`.",
    "memoryModel": "Memory Anchor: Backpressure = Producer faster than consumer. Solved by pausing readable stream until writable emits 'drain'.",
    "code": "const canWrite = writable.write(chunk);\nif (!canWrite) {\n  readable.pause(); // Pause reading\n  writable.once('drain', () => readable.resume()); // Resume when buffer clears\n}",
    "difficulty": "Senior",
    "pitch": "In production, What is Backpressure in streams, and how is it handled centers on first-principles system mechanics. Specifically: Backpressure occurs when the data source (Readable stream) produces data faster than the destination (Writable stream) can process or write it (e.g. fast disk read vs slow 3G mobil...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Backpressure = Producer faster than consumer. Solved by pausing readable stream until writable emits 'drain'.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Synchronous fs.readFileSync (Naive)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N) (Loads entire file in RAM)",
        "explanation": "Reads the entire file into memory synchronously. Freezes the V8 call stack for all other requests.",
        "code": "const fs = require('node:fs');\n\nfunction readLargeFile(filePath) {\n  // ❌ Freezes the entire Node.js server!\n  return fs.readFileSync(filePath, 'utf-8');\n}"
      },
      {
        "title": "Approach 2: Stream Pipeline with Backpressure (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1) (Bounded 64KB Buffer)",
        "explanation": "Streams the file chunk-by-chunk using pipeline, keeping RAM usage capped at under 50MB regardless of file size.",
        "code": "import { createReadStream, createWriteStream } from 'node:fs';\nimport { pipeline } from 'node:stream/promises';\nimport { createGzip } from 'node:zlib';\n\nexport async function streamFileSafely(src, dest) {\n  await pipeline(\n    createReadStream(src),\n    createGzip(),\n    createWriteStream(dest)\n  );\n}"
      }
    ]
  },
  {
    "id": 36,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "Why should you prefer stream.pipeline() over stream.pipe()?",
    "answer": "`.pipe()` does not forward errors properly across a chain of streams (e.g. `source.pipe(transform).pipe(destination)`). If the middle stream throws an error, the source and destination streams remain open, leaking file descriptors and memory.\n`pipeline()` properly forwards errors from any stream in the pipeline, automatically cleans up and destroys all streams in the chain, and supports Promise syntax via `stream/promises`.",
    "memoryModel": "Memory Anchor: pipe() leaks file descriptors on error. pipeline() guarantees cleanup of all streams on error.",
    "code": "import { pipeline } from 'node:stream/promises';\nimport fs from 'node:fs';\nimport zlib from 'node:zlib';\n\nasync function compressFile(src, dest) {\n  await pipeline(\n    fs.createReadStream(src),\n    zlib.createGzip(),\n    fs.createWriteStream(dest)\n  );\n  console.log('Compression complete with zero leaks!');\n}",
    "difficulty": "Senior",
    "pitch": "In production, Why should you prefer stream.pipeline() over stream.pipe() centers on first-principles system mechanics. Specifically: `.pipe()` does not forward errors properly across a chain of streams (e.g. `source.pipe(transform).pipe(destination)`). If the middle stream throws an error, the source and destina...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: pipe() leaks file descriptors on error. pipeline() guarantees cleanup of all streams on error.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 37,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is the difference between paused and flowing modes in Readable streams?",
    "answer": "- Flowing Mode: Data is read from the underlying system automatically and provided as quickly as possible via the `'data'` event.\n- Paused Mode: The stream does not push data. You must explicitly call `stream.read()` to fetch chunks, usually inside a `'readable'` event listener.\nA stream starts in paused mode and switches to flowing mode when a `'data'` listener is attached or `.pipe()` is called.",
    "memoryModel": "Memory Anchor: Paused = pull-based (stream.read()). Flowing = push-based ('data' events).",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between paused and flowing modes in Readable streams centers on first-principles system mechanics. Specifically: - Flowing Mode: Data is read from the underlying system automatically and provided as quickly as possible via the `'data'` event....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Paused = pull-based (stream.read()). Flowing = push-based ('data' events).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 38,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "How do you convert a Buffer to a string, and what encodings are supported?",
    "answer": "Call `buf.toString(encoding)`. Common encodings supported:\n- `'utf8'` (default for text)\n- `'hex'` (two hex characters per byte)\n- `'base64'` (Base64 encoding for binary transfer)\n- `'latin1'` / `'binary'`\n- `'ascii'`",
    "memoryModel": "Memory Anchor: buf.toString('utf8' | 'hex' | 'base64').",
    "difficulty": "Senior",
    "pitch": "In production, How do you convert a Buffer to a string, and what encodings are supported centers on first-principles system mechanics. Specifically: Call `buf.toString(encoding)`. Common encodings supported:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: buf.toString('utf8' | 'hex' | 'base64').",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 39,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is highWaterMark in Node.js streams?",
    "answer": "`highWaterMark` is the threshold size (in bytes) of the internal buffer before a stream stops reading from the underlying source or returns `false` on `write()`. For normal streams, the default is 16 KB (`16 * 1024`); for file streams (`fs.createReadStream`), the default is 64 KB (`64 * 1024`); for objectMode streams, it represents the count of objects (default 16).",
    "memoryModel": "Memory Anchor: highWaterMark = Buffer capacity threshold (default 64KB for fs, 16KB for streams) that triggers backpressure.",
    "difficulty": "Senior",
    "pitch": "In production, What is highWaterMark in Node.js streams centers on first-principles system mechanics. Specifically: `highWaterMark` is the threshold size (in bytes) of the internal buffer before a stream stops reading from the underlying source or returns `false` on `write()`. For normal streams...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: highWaterMark = Buffer capacity threshold (default 64KB for fs, 16KB for streams) that triggers backpressure.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 40,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is objectMode in Node.js streams?",
    "answer": "By default, streams operate exclusively on `Buffer` and `string` chunks. Setting `{ objectMode: true }` allows streams to emit and consume arbitrary JavaScript objects (numbers, objects, arrays), enabling streaming data processing pipelines for JSON or database records.",
    "memoryModel": "Memory Anchor: objectMode: true allows streaming JS objects instead of just binary Buffers.",
    "code": "import { Transform } from 'node:stream';\n\nconst parseJsonStream = new Transform({\n  objectMode: true,\n  transform(chunk, encoding, callback) {\n    const obj = JSON.parse(chunk.toString());\n    this.push(obj);\n    callback();\n  }\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is objectMode in Node.js streams centers on first-principles system mechanics. Specifically: By default, streams operate exclusively on `Buffer` and `string` chunks. Setting `{ objectMode: true }` allows streams to emit and consume arbitrary JavaScript objects (numbers, ob...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: objectMode: true allows streaming JS objects instead of just binary Buffers.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 41,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "How do you implement a custom Transform stream?",
    "answer": "Extend the `Transform` class or instantiate it with a `transform(chunk, encoding, callback)` method. Read the chunk, perform modification, emit output via `this.push(transformedChunk)`, and invoke `callback()` when ready for the next chunk.",
    "memoryModel": "Memory Anchor: Implement transform(chunk, enc, cb) -> call this.push() -> call cb().",
    "code": "import { Transform } from 'node:stream';\n\nconst upperCaseStream = new Transform({\n  transform(chunk, encoding, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback();\n  }\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you implement a custom Transform stream centers on first-principles system mechanics. Specifically: Extend the `Transform` class or instantiate it with a `transform(chunk, encoding, callback)` method. Read the chunk, perform modification, emit output via `this.push(transformedChu...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Implement transform(chunk, enc, cb) -> call this.push() -> call cb().",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 42,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What is Buffer.concat() and when should it be used?",
    "answer": "`Buffer.concat(list, totalLength)` takes an array of Buffer objects and concatenates them into a single continuous Buffer. It is commonly used when accumulating chunks from a Readable stream before parsing complete data.",
    "memoryModel": "Memory Anchor: Buffer.concat([chunk1, chunk2]) merges an array of chunks into one Buffer.",
    "code": "const chunks = [];\nstream.on('data', chunk => chunks.push(chunk));\nstream.on('end', () => {\n  const completeBuffer = Buffer.concat(chunks);\n  console.log('Complete payload size:', completeBuffer.length);\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is Buffer.concat() and when should it be used centers on first-principles system mechanics. Specifically: `Buffer.concat(list, totalLength)` takes an array of Buffer objects and concatenates them into a single continuous Buffer. It is commonly used when accumulating chunks from a Reada...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Buffer.concat([chunk1, chunk2]) merges an array of chunks into one Buffer.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 43,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "What happens if you concatenate Buffer chunks as strings using += ?",
    "answer": "Concatenating chunks with `let str = ''; str += chunk;` can cause multi-byte character corruption! If a multi-byte UTF-8 character (e.g. an emoji or non-ASCII character) gets split across two 64KB chunk boundaries, converting the individual chunk to string replaces the half-character with the replacement character `` (U+FFFD).\nSolution: Collect Buffer chunks and use `Buffer.concat()`, or use `StringDecoder` from `node:string_decoder`.",
    "memoryModel": "Memory Anchor: Never use += on stream chunks! Use StringDecoder or Buffer.concat to prevent splitting multi-byte UTF-8 characters.",
    "code": "import { StringDecoder } from 'node:string_decoder';\nconst decoder = new StringDecoder('utf8');\nstream.on('data', (chunk) => {\n  const text = decoder.write(chunk); // Holds incomplete bytes until next chunk!\n});",
    "difficulty": "Senior",
    "pitch": "In production, What happens if you concatenate Buffer chunks as strings using +=  centers on first-principles system mechanics. Specifically: Concatenating chunks with `let str = ''; str += chunk;` can cause multi-byte character corruption! If a multi-byte UTF-8 character (e.g. an emoji or non-ASCII character) gets split...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never use += on stream chunks! Use StringDecoder or Buffer.concat to prevent splitting multi-byte UTF-8 characters.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 44,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "How can you read a stream using async/await and for await...of?",
    "answer": "In modern Node.js, Readable streams implement the AsyncIterable protocol. You can consume stream chunks sequentially using a `for await (const chunk of stream)` loop without manual event listeners.",
    "memoryModel": "Memory Anchor: for await (const chunk of readableStream) provides clean async iteration over streams.",
    "code": "async function processFile(filePath) {\n  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });\n  for await (const chunk of stream) {\n    console.log('Received chunk of length:', chunk.length);\n  }\n  console.log('Stream finished!');\n}",
    "difficulty": "Senior",
    "pitch": "In production, How can you read a stream using async/await and for await...of centers on first-principles system mechanics. Specifically: In modern Node.js, Readable streams implement the AsyncIterable protocol. You can consume stream chunks sequentially using a `for await (const chunk of stream)` loop without manual...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: for await (const chunk of readableStream) provides clean async iteration over streams.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 45,
    "topicId": 3,
    "topicTitle": "3. Buffers, Streams & Pipe",
    "question": "How do you gracefully destroy a stream to cancel reading or writing?",
    "answer": "Call `stream.destroy(error)`. It immediately closes the underlying resource (file descriptor or socket) and emits the `'close'` event (and `'error'` if an error parameter was supplied), ensuring memory is freed immediately.",
    "memoryModel": "Memory Anchor: stream.destroy() closes underlying file descriptors and frees memory immediately.",
    "difficulty": "Senior",
    "pitch": "In production, How do you gracefully destroy a stream to cancel reading or writing centers on first-principles system mechanics. Specifically: Call `stream.destroy(error)`. It immediately closes the underlying resource (file descriptor or socket) and emits the `'close'` event (and `'error'` if an error parameter was suppl...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: stream.destroy() closes underlying file descriptors and frees memory immediately.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 46,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the EventEmitter class, and how does the Observer pattern work in Node.js?",
    "answer": "`EventEmitter` from the `node:events` module facilitates event-driven programming. Objects ('emitters') emit named events that trigger previously registered listener functions ('observers'). Core Node modules (`http.Server`, `fs.ReadStream`, `net.Socket`) inherit from `EventEmitter`.",
    "memoryModel": "Memory Anchor: EventEmitter = Pub/Sub within the Node process. emit() fires listeners synchronously by default.",
    "code": "import { EventEmitter } from 'node:events';\n\nclass OrderProcessor extends EventEmitter {\n  placeOrder(order) {\n    this.emit('orderPlaced', order);\n  }\n}\n\nconst processor = new OrderProcessor();\nprocessor.on('orderPlaced', (order) => console.log('Send confirmation email for:', order.id));\nprocessor.placeOrder({ id: 101, total: 2500 });",
    "difficulty": "Mid",
    "pitch": "In production, What is the EventEmitter class, and how does the Observer pattern work in Node.js centers on first-principles system mechanics. Specifically: `EventEmitter` from the `node:events` module facilitates event-driven programming. Objects ('emitters') emit named events that trigger previously registered listener functions ('ob...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: EventEmitter = Pub/Sub within the Node process. emit() fires listeners synchronously by default.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 47,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "Are EventEmitter callbacks called synchronously or asynchronously?",
    "answer": "By default, `EventEmitter` invokes all registered listeners **synchronously** in the exact order they were registered when `emit()` is called! If you need listener execution to be asynchronous, you must wrap the logic inside `setImmediate()` or `process.nextTick()` inside the listener.",
    "memoryModel": "Memory Anchor: emit() calls listeners synchronously in registration order, NOT on the event loop!",
    "code": "const emitter = new EventEmitter();\nemitter.on('event', () => console.log('1. First listener'));\nemitter.on('event', () => console.log('2. Second listener'));\n\nconsole.log('Before emit');\nemitter.emit('event');\nconsole.log('After emit');\n\n// Output order: Before emit -> 1. First listener -> 2. Second listener -> After emit",
    "difficulty": "Senior",
    "pitch": "In production, Are EventEmitter callbacks called synchronously or asynchronously centers on first-principles system mechanics. Specifically: By default, `EventEmitter` invokes all registered listeners synchronously in the exact order they were registered when `emit()` is called! If you need listener execution to be asyn...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: emit() calls listeners synchronously in registration order, NOT on the event loop!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 48,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What happens if an EventEmitter emits an 'error' event and has no listeners?",
    "answer": "If an `EventEmitter` emits `'error'` and there are zero registered `'error'` listeners, Node.js treats it as an uncaught exception! It prints the stack trace and crashes the entire Node.js process. Always attach an `.on('error', ...)` handler to any EventEmitter.",
    "memoryModel": "Memory Anchor: Emitting an unhandled 'error' event crashes the entire process. Always attach an error listener.",
    "difficulty": "Senior",
    "pitch": "In production, What happens if an EventEmitter emits an 'error' event and has no listeners centers on first-principles system mechanics. Specifically: If an `EventEmitter` emits `'error'` and there are zero registered `'error'` listeners, Node.js treats it as an uncaught exception! It prints the stack trace and crashes the entire...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Emitting an unhandled 'error' event crashes the entire process. Always attach an error listener.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 49,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the default max listeners limit on an EventEmitter, and why does Node warn you?",
    "answer": "The default limit is 10 listeners per event. If you register more than 10, Node outputs a console warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`.\nThis warning exists because repeatedly adding listeners (e.g. inside a per-request middleware without removing them) is the single most common cause of memory leaks in Node.js. You can adjust it via `emitter.setMaxListeners(n)` if intentional.",
    "memoryModel": "Memory Anchor: Default 10 listeners. Warning exists to detect forgotten listeners leaking memory.",
    "difficulty": "Senior",
    "pitch": "In production, What is the default max listeners limit on an EventEmitter, and why does Node warn you centers on first-principles system mechanics. Specifically: The default limit is 10 listeners per event. If you register more than 10, Node outputs a console warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Default 10 listeners. Warning exists to detect forgotten listeners leaking memory.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 50,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "How does events.once() work with async/await in modern Node.js?",
    "answer": "`events.once(emitter, eventName)` returns a Promise that resolves when the emitter emits the given event (or rejects if an `'error'` event is emitted). This allows clean async/await event synchronization without manual callback boilerplate.",
    "memoryModel": "Memory Anchor: await events.once(stream, 'finish') converts an event to a clean Promise.",
    "code": "import { once, EventEmitter } from 'node:events';\n\nasync function waitForServerReady(server) {\n  await once(server, 'listening');\n  console.log('Server is ready to accept traffic!');\n}",
    "difficulty": "Senior",
    "pitch": "In production, How does events.once() work with async/await in modern Node.js centers on first-principles system mechanics. Specifically: `events.once(emitter, eventName)` returns a Promise that resolves when the emitter emits the given event (or rejects if an `'error'` event is emitted). This allows clean async/awai...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: await events.once(stream, 'finish') converts an event to a clean Promise.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Unbounded Promise.all (Hazardous)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Fires all N promises at the exact same instant. Overwhelms downstream databases and exhausts connection pools.",
        "code": "// ❌ Dangerous with 10,000 tasks: exhausts sockets!\nasync function runAll(tasks) {\n  return Promise.all(tasks.map(t => t()));\n}"
      },
      {
        "title": "Approach 2: Concurrency Limiter Pool (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(K) where K = max concurrency limit",
        "explanation": "Maintains a fixed pool of K executing promises. As each promise resolves, the next pending task from the queue is dispatched.",
        "code": "export async function pLimit(tasks, limit = 5) {\n  const results = [];\n  let index = 0;\n  \n  async function worker() {\n    while (index < tasks.length) {\n      const currentIndex = index++;\n      results[currentIndex] = await tasks[currentIndex]();\n    }\n  }\n  \n  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());\n  await Promise.all(workers);\n  return results;\n}"
      }
    ]
  },
  {
    "id": 51,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the error-first callback pattern in Node.js, and why was it standard?",
    "answer": "The error-first callback pattern dictates that:\n1) The first argument of the callback is reserved for an error object (`err`), which is `null`/`undefined` on success.\n2) Subsequent arguments contain the successful result data.\nThis convention standardized error checking across the ecosystem before Promises existed.",
    "memoryModel": "Memory Anchor: callback(err, data) -> always check if (err) first before accessing data.",
    "code": "fs.readFile('data.json', (err, data) => {\n  if (err) {\n    console.error('File read failed:', err);\n    return;\n  }\n  console.log('File content:', data.toString());\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is the error-first callback pattern in Node.js, and why was it standard centers on first-principles system mechanics. Specifically: The error-first callback pattern dictates that:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: callback(err, data) -> always check if (err) first before accessing data.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 52,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is util.promisify() and how does it work under the hood?",
    "answer": "`util.promisify(fn)` converts an error-first callback function into a function that returns a Promise. Under the hood, it returns a wrapper function that wraps the original function in a `new Promise((resolve, reject) => ...)` and passes a custom callback that resolves on `!err` and rejects on `err`.",
    "memoryModel": "Memory Anchor: util.promisify turns callback(err, res) functions into async Promise functions.",
    "code": "import { promisify } from 'node:util';\nimport fs from 'node:fs';\n\nconst readFileAsync = promisify(fs.readFile);\nconst content = await readFileAsync('config.json', 'utf8');",
    "difficulty": "Senior",
    "pitch": "In production, What is util.promisify() and how does it work under the hood centers on first-principles system mechanics. Specifically: `util.promisify(fn)` converts an error-first callback function into a function that returns a Promise. Under the hood, it returns a wrapper function that wraps the original functio...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: util.promisify turns callback(err, res) functions into async Promise functions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 53,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
    "answer": "All 4 execute multiple promises concurrently:\n- `Promise.all`: Fails fast if ANY promise rejects; resolves only when ALL succeed.\n- `Promise.allSettled`: Waits for ALL promises to complete (whether fulfilled or rejected) and returns an array of status objects `{ status, value | reason }`.\n- `Promise.race`: Resolves or rejects as soon as the FIRST promise settles.\n- `Promise.any`: Resolves as soon as the FIRST promise FULFILLS (ignores rejections until all fail).",
    "memoryModel": "Memory Anchor: all = all or nothing; allSettled = wait for all, never fails; race = fastest to finish; any = fastest to succeed.",
    "comparisonTable": [
      {
        "aspect": "Promise.all",
        "detail": "Short-circuits on first rejection; ideal when all operations are required."
      },
      {
        "aspect": "Promise.allSettled",
        "detail": "Never short-circuits; returns array of results for batch tasks."
      },
      {
        "aspect": "Promise.race",
        "detail": "Settles on first settled (resolve OR reject); good for timeouts."
      },
      {
        "aspect": "Promise.any",
        "detail": "Resolves on first success; rejects only if all fail."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any() centers on first-principles system mechanics. Specifically: All 4 execute multiple promises concurrently:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: all = all or nothing; allSettled = wait for all, never fails; race = fastest to finish; any = fastest to succeed.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 54,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "How do you implement a robust timeout wrapper for an async operation in Node.js?",
    "answer": "Combine `Promise.race()` with a timeout promise that rejects after specified milliseconds, or in modern Node.js use `AbortSignal.timeout(ms)` with native `fetch` or supported APIs.",
    "memoryModel": "Memory Anchor: Promise.race([action(), timeoutPromise(ms)]) OR AbortSignal.timeout(ms).",
    "code": "function withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) => \n    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}",
    "difficulty": "Senior",
    "pitch": "In production, How do you implement a robust timeout wrapper for an async operation in Node.js centers on first-principles system mechanics. Specifically: Combine `Promise.race()` with a timeout promise that rejects after specified milliseconds, or in modern Node.js use `AbortSignal.timeout(ms)` with native `fetch` or supported APIs....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Promise.race([action(), timeoutPromise(ms)]) OR AbortSignal.timeout(ms).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 55,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the difference between synchronous fs methods (fs.readFileSync) and asynchronous (fs.promises.readFile)?",
    "answer": "`fs.readFileSync` blocks the JavaScript main execution thread until the operating system finishes reading the bytes from disk into memory. Zero HTTP requests can be served while it runs.\n`fs.promises.readFile` offloads the file I/O to Libuv's thread pool, freeing the main JS thread to continue serving incoming network requests immediately.",
    "memoryModel": "Memory Anchor: Sync fs methods freeze the entire server. Never use Sync methods in HTTP request handlers!",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between synchronous fs methods (fs.readFileSync) and asynchronous (fs.promises.readFile) centers on first-principles system mechanics. Specifically: `fs.readFileSync` blocks the JavaScript main execution thread until the operating system finishes reading the bytes from disk into memory. Zero HTTP requests can be served while it...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Sync fs methods freeze the entire server. Never use Sync methods in HTTP request handlers!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 56,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What are AsyncLocalStorage and AsyncLocalStorage.run() in Node.js?",
    "answer": "`AsyncLocalStorage` (from `node:async_hooks`) provides execution-context storage that persists across asynchronous call chains (similar to thread-local storage in multi-threaded languages). It is the standard senior pattern for attaching request IDs, tenant IDs, or correlation tracing IDs to logs without manually passing them through every service function argument.",
    "memoryModel": "Memory Anchor: AsyncLocalStorage = Thread-local storage for Node async chains. Ideal for Correlation IDs in logging.",
    "code": "import { AsyncLocalStorage } from 'node:async_hooks';\nconst asyncLocalStorage = new AsyncLocalStorage();\n\n// Express middleware:\napp.use((req, res, next) => {\n  const requestId = req.headers['x-request-id'] || crypto.randomUUID();\n  asyncLocalStorage.run({ requestId }, () => next());\n});\n\n// Deep inside any service without passing req:\nfunction logInfo(message) {\n  const store = asyncLocalStorage.getStore();\n  console.log(`[${store?.requestId || 'N/A'}] ${message}`);\n}",
    "difficulty": "Senior",
    "pitch": "In production, What are AsyncLocalStorage and AsyncLocalStorage.run() in Node.js centers on first-principles system mechanics. Specifically: `AsyncLocalStorage` (from `node:async_hooks`) provides execution-context storage that persists across asynchronous call chains (similar to thread-local storage in multi-threaded la...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: AsyncLocalStorage = Thread-local storage for Node async chains. Ideal for Correlation IDs in logging.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 57,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "How can an unhandled rejected Promise crash a modern Node.js application?",
    "answer": "In Node.js 15+, the default unhandled rejection mode is `--unhandled-rejections=throw`. An unhandled promise rejection triggers an uncaught exception that terminates the process with code 1. You must always wrap async routes in try/catch or use an async error boundary middleware.",
    "memoryModel": "Memory Anchor: Unhandled promise rejections terminate the process in modern Node. Always handle errors.",
    "difficulty": "Senior",
    "pitch": "In production, How can an unhandled rejected Promise crash a modern Node.js application centers on first-principles system mechanics. Specifically: In Node.js 15+, the default unhandled rejection mode is `--unhandled-rejections=throw`. An unhandled promise rejection triggers an uncaught exception that terminates the process wi...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Unhandled promise rejections terminate the process in modern Node. Always handle errors.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 58,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "What is the difference between AbortController and manual cancellation in Node.js?",
    "answer": "`AbortController` is the standard web-interoperable API for cancelling asynchronous operations. Calling `controller.abort()` sends an abort signal to all connected operations (`fetch`, `fs.promises.readFile`, child processes, timers) that accept `{ signal }`, immediately aborting active HTTP sockets and freeing resources.",
    "memoryModel": "Memory Anchor: AbortController + signal enables standardized cancellation of fetch, timers, and fs operations.",
    "code": "const controller = new AbortController();\nconst timeoutId = setTimeout(() => controller.abort(), 3000);\n\ntry {\n  const response = await fetch('https://api.external.com/data', { signal: controller.signal });\n} catch (err) {\n  if (err.name === 'AbortError') console.log('Request was cancelled due to timeout!');\n} finally {\n  clearTimeout(timeoutId);\n}",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between AbortController and manual cancellation in Node.js centers on first-principles system mechanics. Specifically: `AbortController` is the standard web-interoperable API for cancelling asynchronous operations. Calling `controller.abort()` sends an abort signal to all connected operations (`fet...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: AbortController + signal enables standardized cancellation of fetch, timers, and fs operations.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 59,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "How does queueMicrotask() work in Node.js?",
    "answer": "`queueMicrotask(callback)` schedules a microtask on the V8 microtask queue (same queue as Promise.then). It executes after the current synchronous script completes and before control yields to the event loop. In modern Node, it is preferred over `Promise.resolve().then(cb)` for standards-compliant microtask scheduling.",
    "memoryModel": "Memory Anchor: queueMicrotask(cb) = Standards-based Promise-level microtask scheduling.",
    "difficulty": "Senior",
    "pitch": "In production, How does queueMicrotask() work in Node.js centers on first-principles system mechanics. Specifically: `queueMicrotask(callback)` schedules a microtask on the V8 microtask queue (same queue as Promise.then). It executes after the current synchronous script completes and before contr...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: queueMicrotask(cb) = Standards-based Promise-level microtask scheduling.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 60,
    "topicId": 4,
    "topicTitle": "4. Async, Events & Concurrency",
    "question": "How do you handle concurrency limits for parallel async operations (e.g. processing 10,000 items without overwhelming the DB)?",
    "answer": "Running `Promise.all(items.map(fn))` on 10,000 items creates 10,000 simultaneous database queries, crashing connection pools. Use a concurrency pool limiter (such as `p-limit` or a worker pool chunking pattern) to restrict concurrency to a safe maximum (e.g. 10 or 20 concurrent operations at any time).",
    "memoryModel": "Memory Anchor: Never Promise.all 10,000 items at once! Use p-limit to throttle concurrency.",
    "code": "import pLimit from 'p-limit';\nconst limit = pLimit(10); // Maximum 10 concurrent requests\n\nconst results = await Promise.all(\n  urls.map(url => limit(() => fetch(url)))\n);",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle concurrency limits for parallel async operations (e.g. processing 10,000 items without overwhelming the DB) centers on first-principles system mechanics. Specifically: Running `Promise.all(items.map(fn))` on 10,000 items creates 10,000 simultaneous database queries, crashing connection pools. Use a concurrency pool limiter (such as `p-limit` or a...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never Promise.all 10,000 items at once! Use p-limit to throttle concurrency.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Naive EventEmitter Subscriptions (Memory Leak Prone)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(N) (Retained closures)",
        "explanation": "Registers listeners without automatic cleanup, leading to MaxListenersExceededWarning and memory retention.",
        "code": "function listen(emitter) {\n  emitter.on('data', (d) => console.log(d));\n  // ❌ Never cleaned up when client disconnects!\n}"
      },
      {
        "title": "Approach 2: AbortSignal-Backed EventEmitter (Optimal)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Uses modern AbortSignal integration to automatically unregister listeners and prevent closure retainment.",
        "code": "export function autoCleanListener(emitter, signal) {\n  emitter.on('data', (data) => {\n    console.log('Received:', data);\n  }, { signal });\n}"
      }
    ]
  },
  {
    "id": 61,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is Express.js and what is its core design pattern?",
    "answer": "Express.js is a minimalist, unopinionated web framework for Node.js. Its core design pattern is the **Chain of Responsibility (Middleware Pipeline)**. Every incoming HTTP request flows sequentially through an array of middleware functions that inspect, modify, authenticate, or respond to the request before calling `next()` to pass control forward.",
    "memoryModel": "Memory Anchor: Express = Chain of Responsibility pipeline where request/response pass through sequential middleware functions.",
    "code": "const express = require('express');\nconst app = express();\n\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next(); // Passes control to the next middleware in the chain\n});",
    "difficulty": "Mid",
    "pitch": "In production, What is Express.js and what is its core design pattern centers on first-principles system mechanics. Specifically: Express.js is a minimalist, unopinionated web framework for Node.js. Its core design pattern is the Chain of Responsibility (Middleware Pipeline). Every incoming HTTP request flows...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Express = Chain of Responsibility pipeline where request/response pass through sequential middleware functions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 62,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is an Express middleware function, and what are its parameters?",
    "answer": "A middleware function is a function that has access to the Request object (`req`), the Response object (`res`), and the `next` function in the application’s request-response cycle: `function(req, res, next)`. Middleware can execute code, modify `req`/`res`, end the request-response cycle, or call `next()` to invoke the next middleware.",
    "memoryModel": "Memory Anchor: (req, res, next) -> Must either call next() OR send a response (res.json()).",
    "difficulty": "Senior",
    "pitch": "In production, What is an Express middleware function, and what are its parameters centers on first-principles system mechanics. Specifically: A middleware function is a function that has access to the Request object (`req`), the Response object (`res`), and the `next` function in the application’s request-response cycle:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: (req, res, next) -> Must either call next() OR send a response (res.json()).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 63,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What happens if a middleware function neither calls next() nor sends a response?",
    "answer": "The request hangs indefinitely! The client waits until its connection times out (or the server's HTTP socket timeout elapses, default 2 minutes). Always ensure your middleware either invokes `next()` or calls a response method like `res.json()`, `res.send()`, or `res.end()`.",
    "memoryModel": "Memory Anchor: If you don't call next() or res.send(), the client hangs forever.",
    "difficulty": "Senior",
    "pitch": "In production, What happens if a middleware function neither calls next() nor sends a response centers on first-principles system mechanics. Specifically: The request hangs indefinitely! The client waits until its connection times out (or the server's HTTP socket timeout elapses, default 2 minutes). Always ensure your middleware eith...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: If you don't call next() or res.send(), the client hangs forever.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 64,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What are the 5 types of middleware in Express.js?",
    "answer": "1) Application-level middleware (`app.use(fn)`)\n2) Router-level middleware (`router.use(fn)`)\n3) Error-handling middleware (`(err, req, res, next) => {}`)\n4) Built-in middleware (`express.json()`, `express.static()`, `express.urlencoded()`)\n5) Third-party middleware (`helmet()`, `cors()`, `compression()`, `morgan()`).",
    "memoryModel": "Memory Anchor: App-level, Router-level, Error-handling, Built-in, Third-party.",
    "difficulty": "Senior",
    "pitch": "In production, What are the 5 types of middleware in Express.js centers on first-principles system mechanics. Specifically: 1) Application-level middleware (`app.use(fn)`)...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: App-level, Router-level, Error-handling, Built-in, Third-party.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 65,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How does Express recognize an Error-Handling Middleware, and why must it have 4 arguments?",
    "answer": "Express uses function arity (`fn.length === 4`) to distinguish error-handling middleware from normal middleware. An error-handling middleware MUST declare exactly 4 arguments: `(err, req, res, next)`. If you remove `next`, `fn.length` becomes 3, and Express treats it as normal middleware, failing to catch errors!",
    "memoryModel": "Memory Anchor: Express checks fn.length === 4. Must always write (err, req, res, next) even if next is unused!",
    "code": "app.use((err, req, res, next) => {\n  logger.error('Unhandled API Error:', err);\n  const status = err.statusCode || 500;\n  res.status(status).json({\n    success: false,\n    message: err.message || 'Internal Server Error',\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })\n  });\n});",
    "difficulty": "Senior",
    "pitch": "In production, How does Express recognize an Error-Handling Middleware, and why must it have 4 arguments centers on first-principles system mechanics. Specifically: Express uses function arity (`fn.length === 4`) to distinguish error-handling middleware from normal middleware. An error-handling middleware MUST declare exactly 4 arguments: `(er...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Express checks fn.length === 4. Must always write (err, req, res, next) even if next is unused!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 66,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "Why do unhandled asynchronous errors crash Express 4, and how is it fixed in Express 5?",
    "answer": "In Express 4, route handlers don't catch rejected Promises automatically. An unhandled rejection in an `async (req, res)` handler bypasses Express's error pipeline and crashes the process unless wrapped in a `try/catch` or an async wrapper utility (`express-async-errors`).\nIn Express 5, route handlers natively handle returned Promises: if an async handler throws or rejects, Express automatically catches it and passes it to the 4-parameter error middleware.",
    "memoryModel": "Memory Anchor: Express 4 requires try/catch or async wrapper. Express 5 natively catches rejected async Promises.",
    "code": "// Express 4 Async Wrapper Helper:\nconst asyncHandler = (fn) => (req, res, next) => {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\napp.get('/users', asyncHandler(async (req, res) => {\n  const users = await User.find();\n  res.json(users);\n}));",
    "difficulty": "Senior",
    "pitch": "In production, Why do unhandled asynchronous errors crash Express 4, and how is it fixed in Express 5 centers on first-principles system mechanics. Specifically: In Express 4, route handlers don't catch rejected Promises automatically. An unhandled rejection in an `async (req, res)` handler bypasses Express's error pipeline and crashes the ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Express 4 requires try/catch or async wrapper. Express 5 natively catches rejected async Promises.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 67,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is the difference between app.use() and app.all()?",
    "answer": "- `app.use('/prefix', fn)`: Matches any HTTP method (GET, POST, PUT, DELETE) whose path **begins with** the specified prefix (`/prefix/subpath` matches).\n- `app.all('/exact', fn)`: Matches any HTTP method, but requires an **exact path match** (does not match subpaths unless wildcards are defined).",
    "memoryModel": "Memory Anchor: app.use is prefix-matching middleware. app.all is exact-path route matching for all HTTP verbs.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between app.use() and app.all() centers on first-principles system mechanics. Specifically: - `app.use('/prefix', fn)`: Matches any HTTP method (GET, POST, PUT, DELETE) whose path begins with the specified prefix (`/prefix/subpath` matches)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: app.use is prefix-matching middleware. app.all is exact-path route matching for all HTTP verbs.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 68,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is express.Router and why is it used?",
    "answer": "`express.Router()` creates an isolated, modular instance of middleware and routing. It acts like a 'mini-application' capable only of performing middleware and routing functions. Routers enable feature-driven folder structures (`routes/authRoutes.js`, `routes/productRoutes.js`) mounted cleanly onto the main app.",
    "memoryModel": "Memory Anchor: express.Router = Mini-app for modularizing routes into separate feature files.",
    "code": "// routes/userRoutes.js\nconst router = express.Router();\nrouter.get('/', getUsers);\nrouter.post('/', createUser);\nmodule.exports = router;\n\n// server.js\napp.use('/api/v1/users', userRoutes);",
    "difficulty": "Senior",
    "pitch": "In production, What is express.Router and why is it used centers on first-principles system mechanics. Specifically: `express.Router()` creates an isolated, modular instance of middleware and routing. It acts like a 'mini-application' capable only of performing middleware and routing functions. R...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: express.Router = Mini-app for modularizing routes into separate feature files.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 69,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What does express.json() do under the hood?",
    "answer": "It is built-in middleware based on `body-parser`. It intercepts incoming requests with `Content-Type: application/json`, streams the raw binary Buffer chunks from `req`, concatenates them, parses the JSON string via `JSON.parse()`, and populates `req.body` with the resulting JavaScript object.",
    "memoryModel": "Memory Anchor: express.json() streams the body chunks, calls JSON.parse(), and assigns the object to req.body.",
    "difficulty": "Senior",
    "pitch": "In production, What does express.json() do under the hood centers on first-principles system mechanics. Specifically: It is built-in middleware based on `body-parser`. It intercepts incoming requests with `Content-Type: application/json`, streams the raw binary Buffer chunks from `req`, concatenat...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: express.json() streams the body chunks, calls JSON.parse(), and assigns the object to req.body.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 70,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "Why does Stripe or Razorpay webhook verification break when placed after express.json()?",
    "answer": "Payment webhooks require the **original, raw, unparsed binary Buffer** of the request body to cryptographically compute and verify the HMAC SHA-256 signature against the provider's signature header.\nIf `express.json()` runs first, it parses and alters the payload stream, making it impossible to reconstruct the exact byte sequence, causing signature verification to fail with `Webhook Error: Signature verification failed`.\nFix: Mount the webhook endpoint before `express.json()` using `express.raw({ type: 'application/json' })`.",
    "memoryModel": "Memory Anchor: Webhooks need RAW binary bytes. Mount webhook route BEFORE express.json() using express.raw()!",
    "code": "// Mount Stripe webhook with raw body before global express.json:\napp.post('/api/webhook/stripe', \n  express.raw({ type: 'application/json' }), \n  handleStripeWebhook\n);\n\n// Global JSON parsing for all other routes:\napp.use(express.json());",
    "difficulty": "Senior",
    "pitch": "In production, Why does Stripe or Razorpay webhook verification break when placed after express.json() centers on first-principles system mechanics. Specifically: Payment webhooks require the original, raw, unparsed binary Buffer of the request body to cryptographically compute and verify the HMAC SHA-256 signature against the provider's sig...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Webhooks need RAW binary bytes. Mount webhook route BEFORE express.json() using express.raw()!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 71,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is the difference between req.params, req.query, and req.body?",
    "answer": "- `req.params`: Captures dynamic route tokens in the URL path (e.g. `/users/:userId` -> `{ userId: '123' }`).\n- `req.query`: Captures URL query string parameters after the `?` (e.g. `/search?q=phone&sort=asc` -> `{ q: 'phone', sort: 'asc' }`).\n- `req.body`: Contains parsed request payload data sent in POST/PUT/PATCH HTTP bodies (populated by `express.json()` or `multer`).",
    "memoryModel": "Memory Anchor: params = path tokens /:id; query = ?key=val; body = POST payload data.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between req.params, req.query, and req.body centers on first-principles system mechanics. Specifically: - `req.params`: Captures dynamic route tokens in the URL path (e.g. `/users/:userId` -> `{ userId: '123' }`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: params = path tokens /:id; query = ?key=val; body = POST payload data.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 72,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is the difference between res.send(), res.json(), and res.end()?",
    "answer": "- `res.json(obj)`: Sets `Content-Type: application/json` and converts the object using `JSON.stringify()`.\n- `res.send(data)`: Polymorphic method that inspects data type; sends HTML/text if string, sets JSON if object, sets octet-stream if Buffer.\n- `res.end()`: Ends the response process immediately without sending any body payload or default Content-Type headers (used for HTTP 204 No Content).",
    "memoryModel": "Memory Anchor: res.json for API responses, res.send for generic data, res.end for ending without body.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between res.send(), res.json(), and res.end() centers on first-principles system mechanics. Specifically: - `res.json(obj)`: Sets `Content-Type: application/json` and converts the object using `JSON.stringify()`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: res.json for API responses, res.send for generic data, res.end for ending without body.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 73,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How do you pass data between middleware in the same request cycle?",
    "answer": "Attach the data to the `req` object (or `res.locals`). For example, an authentication middleware verifies a JWT and attaches `req.user = decodedUser`. Downstream controller handlers can then read `req.user` directly.",
    "memoryModel": "Memory Anchor: Attach shared data to req (e.g. req.user = decodedToken) to pass downstream.",
    "difficulty": "Senior",
    "pitch": "In production, How do you pass data between middleware in the same request cycle centers on first-principles system mechanics. Specifically: Attach the data to the `req` object (or `res.locals`). For example, an authentication middleware verifies a JWT and attaches `req.user = decodedUser`. Downstream controller handler...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Attach shared data to req (e.g. req.user = decodedToken) to pass downstream.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 74,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is res.locals and when should you use it?",
    "answer": "`res.locals` is an object scoped to the lifetime of the current HTTP request. It is useful for exposing data to template engines (EJS, Pug) or passing computed request-scoped metadata across middleware without polluting `req` properties.",
    "memoryModel": "Memory Anchor: res.locals = Scoped container for request-level view/response data.",
    "difficulty": "Senior",
    "pitch": "In production, What is res.locals and when should you use it centers on first-principles system mechanics. Specifically: `res.locals` is an object scoped to the lifetime of the current HTTP request. It is useful for exposing data to template engines (EJS, Pug) or passing computed request-scoped metad...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: res.locals = Scoped container for request-level view/response data.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 75,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "Why is the order of middleware declaration critically important in Express?",
    "answer": "Express executes middleware in the exact lexical order they are declared using `app.use()`. If a router is defined before `express.json()`, `req.body` will be `undefined`. If error-handling middleware is placed before routes, it will never intercept errors thrown in those routes.",
    "memoryModel": "Memory Anchor: Top-to-bottom pipeline: 1) Security (Helmet, CORS) -> 2) Body Parsers -> 3) Routes -> 4) 404 Catch-all -> 5) Error Handler.",
    "difficulty": "Senior",
    "pitch": "In production, Why is the order of middleware declaration critically important in Express centers on first-principles system mechanics. Specifically: Express executes middleware in the exact lexical order they are declared using `app.use()`. If a router is defined before `express.json()`, `req.body` will be `undefined`. If error...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Top-to-bottom pipeline: 1) Security (Helmet, CORS) -> 2) Body Parsers -> 3) Routes -> 4) 404 Catch-all -> 5) Error Handler.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 76,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How do you implement a 404 Not Found handler in Express?",
    "answer": "Place a middleware at the very end of your middleware stack, immediately before the global error handler. If no route handler matched the incoming URL, execution falls through to this handler.",
    "memoryModel": "Memory Anchor: 404 middleware goes after all routes, right before the global error handler.",
    "code": "// Catch-all 404 middleware:\napp.use((req, res, next) => {\n  res.status(404).json({\n    success: false,\n    message: `Route not found: ${req.method} ${req.originalUrl}`\n  });\n});",
    "difficulty": "Mid",
    "pitch": "In production, How do you implement a 404 Not Found handler in Express centers on first-principles system mechanics. Specifically: Place a middleware at the very end of your middleware stack, immediately before the global error handler. If no route handler matched the incoming URL, execution falls through to t...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 404 middleware goes after all routes, right before the global error handler.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 77,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "What is next('route') in Express?",
    "answer": "`next('route')` bypasses the remaining middleware callbacks in the current route block and passes control to the **next matching route** for the same URL path. It only works inside route handlers loaded via `app.METHOD()` or `router.METHOD()`.",
    "memoryModel": "Memory Anchor: next('route') skips remaining middleware in current route block and jumps to next route definition.",
    "difficulty": "Senior",
    "pitch": "In production, What is next('route') in Express centers on first-principles system mechanics. Specifically: `next('route')` bypasses the remaining middleware callbacks in the current route block and passes control to the next matching route for the same URL path. It only works inside rou...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: next('route') skips remaining middleware in current route block and jumps to next route definition.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 78,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How do you prevent response headers sent errors (ERR_HTTP_HEADERS_SENT)?",
    "answer": "This error occurs when your code attempts to send response headers or call `res.json()` / `res.send()` more than once for a single request (e.g. forgetting a `return` after `res.status(400).json()`, or calling `next()` after sending a response).\nFix: Always write `return res.status(...).json(...)` to exit the function immediately.",
    "memoryModel": "Memory Anchor: Always return res.json() to prevent code from executing further and sending headers twice!",
    "difficulty": "Senior",
    "pitch": "In production, How do you prevent response headers sent errors (ERR_HTTP_HEADERS_SENT) centers on first-principles system mechanics. Specifically: This error occurs when your code attempts to send response headers or call `res.json()` / `res.send()` more than once for a single request (e.g. forgetting a `return` after `res.st...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Always return res.json() to prevent code from executing further and sending headers twice!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 79,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How do you configure Express behind a reverse proxy (Nginx, AWS ALB, Cloudflare)?",
    "answer": "Call `app.set('trust proxy', 1)` (or `true`). This informs Express that it is behind a trusted reverse proxy, allowing `req.ip` to accurately reflect the client's public IP from the `X-Forwarded-For` header and `req.protocol` to reflect `https` from `X-Forwarded-Proto`.",
    "memoryModel": "Memory Anchor: app.set('trust proxy', 1) reads client IP from X-Forwarded-For behind Nginx/Cloudflare.",
    "difficulty": "Senior",
    "pitch": "In production, How do you configure Express behind a reverse proxy (Nginx, AWS ALB, Cloudflare) centers on first-principles system mechanics. Specifically: Call `app.set('trust proxy', 1)` (or `true`). This informs Express that it is behind a trusted reverse proxy, allowing `req.ip` to accurately reflect the client's public IP from th...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: app.set('trust proxy', 1) reads client IP from X-Forwarded-For behind Nginx/Cloudflare.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 80,
    "topicId": 5,
    "topicTitle": "5. Express Architecture & Middleware",
    "question": "How do you implement a clean Controller-Service-Repository architecture in Express?",
    "answer": "Separate concerns into distinct architectural layers:\n1) **Router**: Defines endpoints and attaches middleware.\n2) **Controller**: Handles HTTP concerns (extracts `req.body`, validates input, sends `res.json()`).\n3) **Service**: Pure business logic (calculates discounts, coordinates transactions, calls third-party APIs); zero knowledge of `req` or `res`.\n4) **Repository / Model**: Database data access (queries, ORM models).",
    "memoryModel": "Memory Anchor: Router (HTTP routes) -> Controller (HTTP request/response) -> Service (Business logic) -> Repository (Database queries).",
    "difficulty": "Senior",
    "pitch": "In production, How do you implement a clean Controller-Service-Repository architecture in Express centers on first-principles system mechanics. Specifically: Separate concerns into distinct architectural layers:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Router (HTTP routes) -> Controller (HTTP request/response) -> Service (Business logic) -> Repository (Database queries).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 81,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What are the 6 guiding constraints of REST architectural style?",
    "answer": "1) **Client-Server**: Separation of UI concerns from data storage concerns.\n2) **Stateless**: Each request from client must contain all necessary information; server stores no client session context.\n3) **Cacheable**: Responses must define themselves as cacheable or non-cacheable.\n4) **Uniform Interface**: Resource identification in requests (URIs), resource manipulation through representations, self-descriptive messages, HATEOAS.\n5) **Layered System**: Client cannot tell whether it is connected directly to end server or an intermediary (proxy, gateway).\n6) **Code on Demand (Optional)**: Server can temporarily extend client functionality by transferring executable code.",
    "memoryModel": "Memory Anchor: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code-on-demand.",
    "difficulty": "Senior",
    "pitch": "In production, What are the 6 guiding constraints of REST architectural style centers on first-principles system mechanics. Specifically: 1) Client-Server: Separation of UI concerns from data storage concerns....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code-on-demand.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 82,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is Idempotency in HTTP, and which HTTP methods are idempotent?",
    "answer": "An HTTP method is **idempotent** if making multiple identical requests has the exact same outcome on server state as making a single request.\n- **Idempotent**: `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`.\n- **Non-Idempotent**: `POST` (calling POST 5 times creates 5 resources), `PATCH` (can be non-idempotent if performing relative operations like `{ $inc: { views: 1 } }`).",
    "memoryModel": "Memory Anchor: Idempotent = 1 request or 10 requests result in the same server state. GET, PUT, DELETE are idempotent. POST is not.",
    "comparisonTable": [
      {
        "aspect": "GET",
        "detail": "Safe & Idempotent (reads data only)."
      },
      {
        "aspect": "PUT",
        "detail": "Idempotent (replaces entire resource state)."
      },
      {
        "aspect": "DELETE",
        "detail": "Idempotent (resource deleted once is gone in subsequent requests)."
      },
      {
        "aspect": "POST",
        "detail": "Non-idempotent (creates new duplicate resources on repeat)."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is Idempotency in HTTP, and which HTTP methods are idempotent centers on first-principles system mechanics. Specifically: An HTTP method is idempotent if making multiple identical requests has the exact same outcome on server state as making a single request....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Idempotent = 1 request or 10 requests result in the same server state. GET, PUT, DELETE are idempotent. POST is not.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 83,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is the semantic difference between PUT and PATCH in REST APIs?",
    "answer": "- `PUT`: Replaces the **entire resource**. If an existing field is omitted in a PUT payload, it should be wiped or reset to null/default.\n- `PATCH`: Applies a **partial update** to the resource. Only fields supplied in the payload are updated; omitted fields retain their existing values.",
    "memoryModel": "Memory Anchor: PUT = Full replacement. PATCH = Partial patch update.",
    "difficulty": "Senior",
    "pitch": "In production, What is the semantic difference between PUT and PATCH in REST APIs centers on first-principles system mechanics. Specifically: - `PUT`: Replaces the entire resource. If an existing field is omitted in a PUT payload, it should be wiped or reset to null/default....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: PUT = Full replacement. PATCH = Partial patch update.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 84,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "Explain the standard HTTP status code families (2xx, 3xx, 4xx, 5xx).",
    "answer": "- `2xx (Success)`: 200 OK, 201 Created (resource created), 204 No Content (successful delete with empty body).\n- `3xx (Redirection)`: 301 Moved Permanently, 302 Found (temporary), 304 Not Modified (cached).\n- `4xx (Client Errors)`: 400 Bad Request, 401 Unauthorized (unauthenticated), 403 Forbidden (authenticated but lacks role/permission), 404 Not Found, 409 Conflict (duplicate record), 422 Unprocessable Entity (validation error), 429 Too Many Requests.\n- `5xx (Server Errors)`: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.",
    "memoryModel": "Memory Anchor: 2xx = Success, 3xx = Redirection, 4xx = Client fault, 5xx = Server fault.",
    "difficulty": "Senior",
    "pitch": "In production, Explain the standard HTTP status code families (2xx, 3xx, 4xx, 5xx). centers on first-principles system mechanics. Specifically: - `2xx (Success)`: 200 OK, 201 Created (resource created), 204 No Content (successful delete with empty body)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 2xx = Success, 3xx = Redirection, 4xx = Client fault, 5xx = Server fault.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 85,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is the difference between 401 Unauthorized and 403 Forbidden?",
    "answer": "- `401 Unauthorized`: Actually means **Unauthenticated**. The client has not supplied valid credentials (missing or expired JWT/session). The user identity is unknown.\n- `403 Forbidden`: The client IS authenticated, but their identity or role **does not possess permission** to access the resource (e.g. regular user attempting to delete an admin account). Supplying the same token again will not help.",
    "memoryModel": "Memory Anchor: 401 = 'Who are you?' (Not logged in). 403 = 'I know who you are, but you cannot touch this!' (No permission).",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between 401 Unauthorized and 403 Forbidden centers on first-principles system mechanics. Specifically: - `401 Unauthorized`: Actually means Unauthenticated. The client has not supplied valid credentials (missing or expired JWT/session). The user identity is unknown....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 401 = 'Who are you?' (Not logged in). 403 = 'I know who you are, but you cannot touch this!' (No permission).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 86,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "When should you return 204 No Content vs 200 OK?",
    "answer": "Return `204 No Content` when an operation succeeds but the response intentionally contains no body payload (common for `DELETE` operations or status updates where the client needs no returned data). Return `200 OK` when returning a response body (e.g. `{ success: true, deletedId: 42 }`).",
    "memoryModel": "Memory Anchor: 204 = Successful operation with empty body. 200 = Successful operation with response body.",
    "difficulty": "Senior",
    "pitch": "In production, When should you return 204 No Content vs 200 OK centers on first-principles system mechanics. Specifically: Return `204 No Content` when an operation succeeds but the response intentionally contains no body payload (common for `DELETE` operations or status updates where the client needs ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 204 = Successful operation with empty body. 200 = Successful operation with response body.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 87,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is 409 Conflict and when is it appropriate?",
    "answer": "Return `409 Conflict` when a request cannot be completed due to a conflict with the current state of the resource. Examples: attempting to register an email address that already exists, or attempting to book an appointment slot that another user just booked.",
    "memoryModel": "Memory Anchor: 409 Conflict = Unique constraint collision or state collision (e.g. email already exists, slot double-booked).",
    "difficulty": "Senior",
    "pitch": "In production, What is 409 Conflict and when is it appropriate centers on first-principles system mechanics. Specifically: Return `409 Conflict` when a request cannot be completed due to a conflict with the current state of the resource. Examples: attempting to register an email address that already ex...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 409 Conflict = Unique constraint collision or state collision (e.g. email already exists, slot double-booked).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 88,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is Content Negotiation and how do Accept and Content-Type headers work?",
    "answer": "- `Content-Type`: Tells the recipient the media type of the payload being sent (e.g. `Content-Type: application/json` in request or response body).\n- `Accept`: Sent by the client in request headers to indicate which response formats it can understand (`Accept: application/json, text/csv`).\nIn Express, `req.accepts('json')` inspects the Accept header for content negotiation.",
    "memoryModel": "Memory Anchor: Content-Type = what I am sending. Accept = what I want back.",
    "difficulty": "Senior",
    "pitch": "In production, What is Content Negotiation and how do Accept and Content-Type headers work centers on first-principles system mechanics. Specifically: - `Content-Type`: Tells the recipient the media type of the payload being sent (e.g. `Content-Type: application/json` in request or response body)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Content-Type = what I am sending. Accept = what I want back.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 89,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "How should REST API endpoints be named? Explain plural nouns and resource hierarchies.",
    "answer": "1) Use **plural nouns** for resource collections (`/api/v1/products`, NOT `/getProduct`).\n2) Use HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) for actions instead of verbs in the URL (avoid `/api/delete-user`).\n3) Express resource hierarchies via subpaths: `/api/v1/users/:userId/orders/:orderId`.\n4) Use query parameters for filtering, sorting, and pagination: `/api/v1/products?category=shoes&sort=-price&page=2`.",
    "memoryModel": "Memory Anchor: Plural nouns + HTTP verbs. GET /users, POST /users, GET /users/:id, DELETE /users/:id.",
    "difficulty": "Senior",
    "pitch": "In production, How should REST API endpoints be named? Explain plural nouns and resource hierarchies. centers on first-principles system mechanics. Specifically: 1) Use plural nouns for resource collections (`/api/v1/products`, NOT `/getProduct`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Plural nouns + HTTP verbs. GET /users, POST /users, GET /users/:id, DELETE /users/:id.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 90,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is an Idempotency Key and how do payment APIs use it to prevent double charges?",
    "answer": "An Idempotency Key is a unique UUID generated by the client (e.g. frontend checkout button) and passed in an HTTP header (`Idempotency-Key: <UUID>`).\nThe server checks Redis: if the key exists, it returns the cached result without re-executing the payment. If the key is new, it acquires a distributed lock, processes the charge, saves the result to Redis, and unlocks. This prevents duplicate charges if network drops cause automatic retries.",
    "memoryModel": "Memory Anchor: Idempotency Key = Client UUID in header. Server caches response in Redis to prevent charging twice on network retries.",
    "code": "app.post('/api/charge', async (req, res) => {\n  const idempotencyKey = req.headers['idempotency-key'];\n  if (!idempotencyKey) return res.status(400).json({ error: 'Missing Idempotency-Key header' });\n\n  const cached = await redis.get(`idempotency:${idempotencyKey}`);\n  if (cached) return res.status(200).json(JSON.parse(cached));\n\n  const chargeResult = await paymentService.charge(req.body);\n  await redis.set(`idempotency:${idempotencyKey}`, JSON.stringify(chargeResult), 'EX', 86400);\n  res.status(201).json(chargeResult);\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is an Idempotency Key and how do payment APIs use it to prevent double charges centers on first-principles system mechanics. Specifically: An Idempotency Key is a unique UUID generated by the client (e.g. frontend checkout button) and passed in an HTTP header (`Idempotency-Key: <UUID>`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Idempotency Key = Client UUID in header. Server caches response in Redis to prevent charging twice on network retries.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 91,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is the difference between Offset-based and Cursor-based Pagination?",
    "answer": "- **Offset Pagination** (`?page=2&limit=20` or `LIMIT 20 OFFSET 20`): Simple to implement, supports jumping to arbitrary page numbers. Drawback: Slow on large tables (O(N) row scanning in DB), and vulnerable to 'page drift' when items are inserted/deleted.\n- **Cursor Pagination** (`?limit=20&cursor=prod_abc123` or `WHERE id > cursor LIMIT 20`): Uses indexed unique column. Constant O(1) performance at any depth, immune to insertion page drift. Ideal for infinite scrolls (Twitter/Instagram feeds).",
    "memoryModel": "Memory Anchor: Offset = simple but slow at depth & suffers page drift. Cursor = fast indexed pointer, ideal for infinite scroll.",
    "comparisonTable": [
      {
        "aspect": "Offset-based",
        "detail": "LIMIT / OFFSET. Easy jump to page 10. Degrades on large datasets; row shifts cause duplicate/missing items."
      },
      {
        "aspect": "Cursor-based",
        "detail": "WHERE id > cursor LIMIT 20. Constant O(1) performance using indexed keys; no row shift."
      }
    ],
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between Offset-based and Cursor-based Pagination centers on first-principles system mechanics. Specifically: - Offset Pagination (`?page=2&limit=20` or `LIMIT 20 OFFSET 20`): Simple to implement, supports jumping to arbitrary page numbers. Drawback: Slow on large tables (O(N) row scanning...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Offset = simple but slow at depth & suffers page drift. Cursor = fast indexed pointer, ideal for infinite scroll.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 92,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What are HTTP ETag and 304 Not Modified status codes?",
    "answer": "An `ETag` (Entity Tag) is an HTTP response header containing a hash or fingerprint of the resource representation. On subsequent requests, the client sends `If-None-Match: <ETag>`. If the resource hasn't changed, the server responds with `304 Not Modified` and an empty body, saving network bandwidth.",
    "memoryModel": "Memory Anchor: ETag = Hash of response body. 304 Not Modified tells browser to use local cached copy.",
    "difficulty": "Senior",
    "pitch": "In production, What are HTTP ETag and 304 Not Modified status codes centers on first-principles system mechanics. Specifically: An `ETag` (Entity Tag) is an HTTP response header containing a hash or fingerprint of the resource representation. On subsequent requests, the client sends `If-None-Match: <ETag>`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: ETag = Hash of response body. 304 Not Modified tells browser to use local cached copy.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 93,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "How should you structure API Versioning in Node.js?",
    "answer": "Common strategies:\n1) **URI Path Versioning (Recommended)**: `/api/v1/orders` vs `/api/v2/orders`. Highly explicit, easily cached and routed via reverse proxies.\n2) **Header Versioning**: `Accept: application/vnd.company.v1+json` or `X-API-Version: 1`.\n3) **Query Parameter**: `/api/orders?version=1` (generally discouraged).\nURI path versioning is the industry standard for public APIs.",
    "memoryModel": "Memory Anchor: URI versioning (/api/v1/resource) is clear, explicit, and easy to route in proxies.",
    "difficulty": "Senior",
    "pitch": "In production, How should you structure API Versioning in Node.js centers on first-principles system mechanics. Specifically: Common strategies:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: URI versioning (/api/v1/resource) is clear, explicit, and easy to route in proxies.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 94,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is HATEOAS in REST API design?",
    "answer": "HATEOAS (Hypermedia As The Engine Of Application State) is the highest maturity level of REST (Richardson Maturity Model Level 3). The server includes hypermedia links (`_links`) in responses guiding the client on valid state transitions and related actions (e.g. an order response includes links to cancel, pay, or track).",
    "memoryModel": "Memory Anchor: HATEOAS = Server returns links (_links) in JSON telling the client what actions can be taken next.",
    "difficulty": "Senior",
    "pitch": "In production, What is HATEOAS in REST API design centers on first-principles system mechanics. Specifically: HATEOAS (Hypermedia As The Engine Of Application State) is the highest maturity level of REST (Richardson Maturity Model Level 3). The server includes hypermedia links (`_links`) i...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HATEOAS = Server returns links (_links) in JSON telling the client what actions can be taken next.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 95,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is the difference between HTTP/1.1 and HTTP/2?",
    "answer": "- **HTTP/1.1**: Text-based protocol. Suffers from Head-of-Line (HoL) blocking on TCP connections; browsers open 6 simultaneous TCP connections per domain.\n- **HTTP/2**: Binary protocol. Introduces **multiplexing** (multiple concurrent requests and responses over a single TCP connection), header compression (HPACK), and server push. Supported in Node via the `node:http2` module.",
    "memoryModel": "Memory Anchor: HTTP/1.1 = Text, 6 TCP connections, HoL blocking. HTTP/2 = Binary, multiplexed single TCP connection, HPACK compression.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between HTTP/1.1 and HTTP/2 centers on first-principles system mechanics. Specifically: - HTTP/1.1: Text-based protocol. Suffers from Head-of-Line (HoL) blocking on TCP connections; browsers open 6 simultaneous TCP connections per domain....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HTTP/1.1 = Text, 6 TCP connections, HoL blocking. HTTP/2 = Binary, multiplexed single TCP connection, HPACK compression.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 96,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "How do you design a standardized JSON error response schema?",
    "answer": "Never return inconsistent error formats (e.g. string on one route, object on another). Use a standardized envelope like RFC 7807 (Problem Details for HTTP APIs):\n`{ success: false, error: { code: 'INVALID_INPUT', message: 'Validation failed', details: [...] } }`.",
    "memoryModel": "Memory Anchor: Standardize error envelopes across all routes: success: false, error: { code, message, details }.",
    "code": "res.status(422).json({\n  success: false,\n  error: {\n    code: 'VALIDATION_ERROR',\n    message: 'The submitted form payload contains validation errors.',\n    details: [\n      { field: 'email', message: 'Must be a valid email format' },\n      { field: 'password', message: 'Must be at least 8 characters' }\n    ]\n  }\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you design a standardized JSON error response schema centers on first-principles system mechanics. Specifically: Never return inconsistent error formats (e.g. string on one route, object on another). Use a standardized envelope like RFC 7807 (Problem Details for HTTP APIs):...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Standardize error envelopes across all routes: success: false, error: { code, message, details }.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 97,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is HTTP Keep-Alive and why is it important?",
    "answer": "HTTP Keep-Alive allows a single persistent TCP connection to remain open for multiple HTTP request-response cycles, avoiding the expensive 3-way TCP handshake and TLS negotiation overhead for every single asset or request. Node's `http.Agent` handles connection pooling and keep-alive.",
    "memoryModel": "Memory Anchor: Keep-Alive reuses existing TCP connections to avoid repeating TCP/TLS handshakes.",
    "difficulty": "Senior",
    "pitch": "In production, What is HTTP Keep-Alive and why is it important centers on first-principles system mechanics. Specifically: HTTP Keep-Alive allows a single persistent TCP connection to remain open for multiple HTTP request-response cycles, avoiding the expensive 3-way TCP handshake and TLS negotiation o...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Keep-Alive reuses existing TCP connections to avoid repeating TCP/TLS handshakes.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 98,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What are preflight OPTIONS requests in HTTP?",
    "answer": "When a cross-origin request is 'non-simple' (uses methods other than GET/POST/HEAD, or custom headers like `Authorization`), the browser automatically sends an HTTP `OPTIONS` request first. It asks the server: 'Do you allow this origin, method, and headers?' Only after the server responds with matching `Access-Control-Allow-*` headers does the browser send the real request.",
    "memoryModel": "Memory Anchor: Browser sends OPTIONS preflight before PUT/DELETE/Auth headers to verify permissions.",
    "difficulty": "Senior",
    "pitch": "In production, What are preflight OPTIONS requests in HTTP centers on first-principles system mechanics. Specifically: When a cross-origin request is 'non-simple' (uses methods other than GET/POST/HEAD, or custom headers like `Authorization`), the browser automatically sends an HTTP `OPTIONS` reque...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Browser sends OPTIONS preflight before PUT/DELETE/Auth headers to verify permissions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 99,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "What is 422 Unprocessable Entity vs 400 Bad Request?",
    "answer": "- `400 Bad Request`: The request syntax is malformed (e.g. invalid JSON syntax that cannot be parsed).\n- `422 Unprocessable Entity`: The JSON syntax is valid, but the business/domain data inside fails validation rules (e.g. age is negative, password too short).",
    "memoryModel": "Memory Anchor: 400 = Malformed syntax (broken JSON). 422 = Valid syntax, but invalid schema/business values.",
    "difficulty": "Senior",
    "pitch": "In production, What is 422 Unprocessable Entity vs 400 Bad Request centers on first-principles system mechanics. Specifically: - `400 Bad Request`: The request syntax is malformed (e.g. invalid JSON syntax that cannot be parsed)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 400 = Malformed syntax (broken JSON). 422 = Valid syntax, but invalid schema/business values.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 100,
    "topicId": 6,
    "topicTitle": "6. REST API Design & HTTP",
    "question": "How do you handle bulk creation or updates in REST APIs?",
    "answer": "Expose dedicated batch endpoints like `POST /api/v1/orders/bulk`. Accept an array of entities, execute operations inside a single database transaction, and return individual statuses per item (or fail entirely if atomic all-or-nothing semantics are required).",
    "memoryModel": "Memory Anchor: Use /resource/bulk with database transactions for bulk operations.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle bulk creation or updates in REST APIs centers on first-principles system mechanics. Specifically: Expose dedicated batch endpoints like `POST /api/v1/orders/bulk`. Accept an array of entities, execute operations inside a single database transaction, and return individual status...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use /resource/bulk with database transactions for bulk operations.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 101,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is a JSON Web Token (JWT) and what are its 3 parts?",
    "answer": "A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of 3 dot-separated base64url-encoded parts:\n1) **Header**: Algorithm (`alg: HS256` or `RS256`) and token type (`typ: JWT`).\n2) **Payload**: Claims (subject `sub`, expiration `exp`, user ID, role). Base64 encoded, NOT encrypted (visible to anyone!).\n3) **Signature**: Cryptographic hash of `(base64Url(Header) + '.' + base64Url(Payload))` created using a server secret or private key.\nSignature guarantees data integrity and authenticity.",
    "memoryModel": "Memory Anchor: Header (algorithm) . Payload (claims, visible!) . Signature (tamper-proof verification).",
    "code": "import jwt from 'jsonwebtoken';\n\n// Sign token\nconst token = jwt.sign(\n  { userId: user.id, role: user.role }, \n  process.env.JWT_SECRET, \n  { expiresIn: '15m' }\n);\n\n// Verify token\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);",
    "difficulty": "Senior",
    "pitch": "In production, What is a JSON Web Token (JWT) and what are its 3 parts centers on first-principles system mechanics. Specifically: A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of 3 dot-separated base64url-encoded parts:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Header (algorithm) . Payload (claims, visible!) . Signature (tamper-proof verification).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 102,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "Why is it dangerous to store sensitive data in a JWT payload?",
    "answer": "JWT payloads are only **Base64Url encoded**, NOT encrypted! Anyone who intercepts or reads the token in the browser can decode the payload instantly via `Buffer.from(payload, 'base64')` or jwt.io. Never store passwords, credit card numbers, Social Security Numbers, or internal encryption keys in a JWT payload.",
    "memoryModel": "Memory Anchor: JWT is signed, NOT encrypted! The payload is publicly readable by anyone who holds the token.",
    "difficulty": "Senior",
    "pitch": "In production, Why is it dangerous to store sensitive data in a JWT payload centers on first-principles system mechanics. Specifically: JWT payloads are only Base64Url encoded, NOT encrypted! Anyone who intercepts or reads the token in the browser can decode the payload instantly via `Buffer.from(payload, 'base64')...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: JWT is signed, NOT encrypted! The payload is publicly readable by anyone who holds the token.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 103,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "Explain the Dual-Token (Access + Refresh Token) Architecture and Token Rotation.",
    "answer": "1) **Short-Lived Access Token** (expires in 10–15 mins): Passed in `Authorization: Bearer <token>` header for stateless API validation. If stolen, window of vulnerability is minimal.\n2) **Long-Lived Refresh Token** (expires in 7–30 days): Stored securely in an `httpOnly`, `secure`, `sameSite: 'strict'` cookie (inaccessible to JS, preventing XSS theft).\n3) **Token Rotation**: When the client calls `/auth/refresh`, the server invalidates the used refresh token, issues a brand-new refresh token AND a new access token, and saves the new refresh token family in DB/Redis. If an old refresh token is reused, the server detects token theft and invalidates the entire user session family!",
    "memoryModel": "Memory Anchor: Access token = 15m in memory/header. Refresh token = 7d in HttpOnly cookie. Rotate both on every refresh; invalidate family on reuse.",
    "code": "// Refresh Token Rotation Endpoint:\napp.post('/api/auth/refresh', async (req, res) => {\n  const incomingRefreshToken = req.cookies.refreshToken;\n  if (!incomingRefreshToken) return res.status(401).json({ error: 'Missing token' });\n\n  const storedToken = await TokenModel.findOne({ token: incomingRefreshToken });\n  if (!storedToken) {\n    // REUSE DETECTED! Invalidate all tokens for this user:\n    await TokenModel.deleteMany({ userId: decoded.userId });\n    return res.status(403).json({ error: 'Token reuse detected. Re-login required.' });\n  }\n\n  // Rotate tokens:\n  await storedToken.deleteOne();\n  const newAccessToken = generateAccessToken(storedToken.userId);\n  const newRefreshToken = generateRefreshToken(storedToken.userId);\n  await TokenModel.create({ userId: storedToken.userId, token: newRefreshToken });\n\n  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });\n  res.json({ accessToken: newAccessToken });\n});",
    "difficulty": "Senior",
    "pitch": "In production, Explain the Dual-Token (Access + Refresh Token) Architecture and Token Rotation. centers on first-principles system mechanics. Specifically: 1) Short-Lived Access Token (expires in 10–15 mins): Passed in `Authorization: Bearer <token>` header for stateless API validation. If stolen, window of vulnerability is minimal....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Access token = 15m in memory/header. Refresh token = 7d in HttpOnly cookie. Rotate both on every refresh; invalidate family on reuse.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 104,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "How does Bcrypt work, and why should you use it over MD5 or SHA-256 for password hashing?",
    "answer": "Fast hashing algorithms like MD5 or SHA-256 are designed for speed (gigabytes per second), which makes them vulnerable to brute-force and GPU rainbow table attacks (billions of hashes/sec).\nBcrypt is an **adaptive key derivation function** based on the Blowfish cipher. It includes:\n1) Automatic **salt generation** (random string concatenated to password to defeat rainbow tables).\n2) Configurable **work factor (cost / salt rounds)**: 2^rounds iterations. Setting rounds to 10–12 takes ~100–300ms per hash, making brute-force cracking computationally infeasible.",
    "memoryModel": "Memory Anchor: Bcrypt is intentionally slow and CPU-intensive with random salt rounds (10–12) to destroy GPU brute-force attacks.",
    "code": "import bcrypt from 'bcrypt';\n\n// Hash password with 12 salt rounds\nconst saltRounds = 12;\nconst hashedPassword = await bcrypt.hash(rawPassword, saltRounds);\n\n// Compare password safely (timing-safe):\nconst isMatch = await bcrypt.compare(candidatePassword, user.passwordHash);",
    "difficulty": "Senior",
    "pitch": "In production, How does Bcrypt work, and why should you use it over MD5 or SHA-256 for password hashing centers on first-principles system mechanics. Specifically: Fast hashing algorithms like MD5 or SHA-256 are designed for speed (gigabytes per second), which makes them vulnerable to brute-force and GPU rainbow table attacks (billions of has...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Bcrypt is intentionally slow and CPU-intensive with random salt rounds (10–12) to destroy GPU brute-force attacks.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 105,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is a Timing Attack in password comparison, and how do you prevent it?",
    "answer": "A timing attack measures the microscopic time differences in string comparison (`str1 === str2`). A standard `===` operator short-circuits on the first mismatched character, allowing an attacker to deduce the correct password or API token character-by-character by measuring response latency.\nPrevention: Use `crypto.timingSafeEqual()` or `bcrypt.compare()`, which execute in constant time regardless of where the mismatch occurs.",
    "memoryModel": "Memory Anchor: === short-circuits and leaks character matches via latency. Use crypto.timingSafeEqual() for constant-time comparison.",
    "code": "import crypto from 'node:crypto';\n\nfunction safeCompare(strA, strB) {\n  const bufA = Buffer.from(strA);\n  const bufB = Buffer.from(strB);\n  if (bufA.length !== bufB.length) return false;\n  return crypto.timingSafeEqual(bufA, bufB); // Constant time!\n}",
    "difficulty": "Senior",
    "pitch": "In production, What is a Timing Attack in password comparison, and how do you prevent it centers on first-principles system mechanics. Specifically: A timing attack measures the microscopic time differences in string comparison (`str1 === str2`). A standard `===` operator short-circuits on the first mismatched character, allowi...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: === short-circuits and leaks character matches via latency. Use crypto.timingSafeEqual() for constant-time comparison.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 106,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "How do you implement an Express Authentication Middleware for JWT?",
    "answer": "Extract the token from the `Authorization: Bearer <token>` header, verify it using `jwt.verify(token, secret)`, attach the decoded payload to `req.user`, and call `next()`. If missing or invalid, return `401 Unauthorized`.",
    "memoryModel": "Memory Anchor: Extract header -> jwt.verify -> req.user = decoded -> next(). Catch TokenExpiredError.",
    "code": "export const authenticateJWT = (req, res, next) => {\n  const authHeader = req.headers.authorization;\n  if (!authHeader?.startsWith('Bearer ')) {\n    return res.status(401).json({ error: 'Authentication token missing or invalid format' });\n  }\n\n  const token = authHeader.split(' ')[1];\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded; // { userId: '123', role: 'admin' }\n    next();\n  } catch (err) {\n    if (err.name === 'TokenExpiredError') {\n      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });\n    }\n    return res.status(401).json({ error: 'Invalid token' });\n  }\n};",
    "difficulty": "Mid",
    "pitch": "In production, How do you implement an Express Authentication Middleware for JWT centers on first-principles system mechanics. Specifically: Extract the token from the `Authorization: Bearer <token>` header, verify it using `jwt.verify(token, secret)`, attach the decoded payload to `req.user`, and call `next()`. If miss...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Extract header -> jwt.verify -> req.user = decoded -> next(). Catch TokenExpiredError.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 107,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "How do you implement Role-Based Access Control (RBAC) middleware in Express?",
    "answer": "Create a higher-order middleware factory `authorizeRoles(...allowedRoles)` that checks `req.user.role`. If the authenticated user's role is not in `allowedRoles`, return `403 Forbidden`.",
    "memoryModel": "Memory Anchor: authorizeRoles('admin', 'manager') checks req.user.role. If not included -> return 403 Forbidden.",
    "code": "export const authorizeRoles = (...allowedRoles) => {\n  return (req, res, next) => {\n    if (!req.user || !allowedRoles.includes(req.user.role)) {\n      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });\n    }\n    next();\n  };\n};\n\n// Usage:\napp.delete('/api/products/:id', authenticateJWT, authorizeRoles('admin'), deleteProduct);",
    "difficulty": "Senior",
    "pitch": "In production, How do you implement Role-Based Access Control (RBAC) middleware in Express centers on first-principles system mechanics. Specifically: Create a higher-order middleware factory `authorizeRoles(...allowedRoles)` that checks `req.user.role`. If the authenticated user's role is not in `allowedRoles`, return `403 Forbi...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: authorizeRoles('admin', 'manager') checks req.user.role. If not included -> return 403 Forbidden.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 108,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "Can you immediately revoke or blacklist a stateless JWT before its expiration?",
    "answer": "Because stateless JWTs are validated mathematically without database queries, you cannot natively revoke an in-flight token. Solutions:\n1) **Redis Blacklist**: When user logs out, write token's `jti` (JWT ID) to Redis with TTL equal to the token's remaining lifetime. Middleware checks Redis before accepting token.\n2) **Short Lifetimes**: Keep access tokens very short (10–15 min) so window of exposure is minimal without needing blacklists.\n3) **Token Versioning**: Store a `tokenVersion` counter in the User DB record. Increment it on password reset or logout-all. Reject tokens where `payload.version < user.tokenVersion`.",
    "memoryModel": "Memory Anchor: Stateless tokens cannot be revoked natively. Use Redis blacklist by jti, tokenVersion counter in DB, or 10m short lifetimes.",
    "difficulty": "Senior",
    "pitch": "In production, Can you immediately revoke or blacklist a stateless JWT before its expiration centers on first-principles system mechanics. Specifically: Because stateless JWTs are validated mathematically without database queries, you cannot natively revoke an in-flight token. Solutions:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Stateless tokens cannot be revoked natively. Use Redis blacklist by jti, tokenVersion counter in DB, or 10m short lifetimes.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 109,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is the difference between Symmetric (HS256) and Asymmetric (RS256) JWT algorithms?",
    "answer": "- **HS256 (HMAC with SHA-256)**: Symmetric algorithm using a single shared secret key for BOTH signing and verification. Every service that verifies the token must know the secret (if a client service is compromised, the attacker can forge tokens).\n- **RS256 (RSA Signature with SHA-256)**: Asymmetric algorithm using a **Private Key** (kept secure on Auth service) to sign tokens, and a **Public Key** (distributed to all microservices and clients) to verify tokens. Verifying services cannot forge tokens.",
    "memoryModel": "Memory Anchor: HS256 = 1 shared secret (signs & verifies). RS256 = Private key signs, Public key verifies (ideal for microservices).",
    "comparisonTable": [
      {
        "aspect": "HS256 (Symmetric)",
        "detail": "Single secret key; fast; secret leak allows forging any token."
      },
      {
        "aspect": "RS256 (Asymmetric)",
        "detail": "Public/Private key pair; Auth server signs with private, API gateways verify with public."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between Symmetric (HS256) and Asymmetric (RS256) JWT algorithms centers on first-principles system mechanics. Specifically: - HS256 (HMAC with SHA-256): Symmetric algorithm using a single shared secret key for BOTH signing and verification. Every service that verifies the token must know the secret (if ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HS256 = 1 shared secret (signs & verifies). RS256 = Private key signs, Public key verifies (ideal for microservices).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 110,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What are HttpOnly, Secure, and SameSite cookie attributes, and why are they critical for authentication?",
    "answer": "- `httpOnly: true`: Forbids client-side JavaScript (`document.cookie`) from accessing the cookie, completely neutralizing token theft via Cross-Site Scripting (XSS).\n- `secure: true`: Guarantees cookie is only transmitted over encrypted HTTPS connections (prevents plain-text interception).\n- `sameSite: 'strict' | 'lax'`: Dictates whether cookie is sent with cross-site requests. `'strict'` prevents the cookie from being sent on cross-origin requests, completely neutralizing Cross-Site Request Forgery (CSRF).",
    "memoryModel": "Memory Anchor: HttpOnly stops XSS theft. Secure forces HTTPS. SameSite stops CSRF attacks.",
    "difficulty": "Senior",
    "pitch": "In production, What are HttpOnly, Secure, and SameSite cookie attributes, and why are they critical for authentication centers on first-principles system mechanics. Specifically: - `httpOnly: true`: Forbids client-side JavaScript (`document.cookie`) from accessing the cookie, completely neutralizing token theft via Cross-Site Scripting (XSS)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HttpOnly stops XSS theft. Secure forces HTTPS. SameSite stops CSRF attacks.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 111,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "How do you handle password reset securely in Node.js?",
    "answer": "1) Generate a cryptographically secure random token: `crypto.randomBytes(32).toString('hex')`.\n2) Hash the token with SHA-256 before saving to DB: `crypto.createHash('sha256').update(token).digest('hex')` alongside an expiration date (e.g. 15 minutes).\n3) Email the unhashed token in a reset link: `https://site.com/reset-password?token=...`.\n4) When user submits new password, hash the incoming token and look up the matching unexpired DB record. This prevents database administrators or DB leaks from compromising valid reset links.",
    "memoryModel": "Memory Anchor: crypto.randomBytes(32) -> Hash token in DB with 15m expiration -> Email plain token -> Hash incoming token to match.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle password reset securely in Node.js centers on first-principles system mechanics. Specifically: 1) Generate a cryptographically secure random token: `crypto.randomBytes(32).toString('hex')`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: crypto.randomBytes(32) -> Hash token in DB with 15m expiration -> Email plain token -> Hash incoming token to match.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 112,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is the difference between Stateful Session-Based Auth and Stateless JWT Auth?",
    "answer": "- **Stateful Session Auth**: Server generates a random session ID, stores session data in Redis/DB, and sends session ID in cookie. Server can instantly revoke sessions, but requires centralized session store queries on every request.\n- **Stateless JWT**: Client stores signed token. Server verifies signature mathematically with zero DB lookups (highly scalable across distributed microservices), but cannot revoke individual tokens instantly without a blacklist.",
    "memoryModel": "Memory Anchor: Sessions = State in Redis, instant revocation. JWT = Stateless cryptographic proof, zero DB lookup, harder to revoke.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between Stateful Session-Based Auth and Stateless JWT Auth centers on first-principles system mechanics. Specifically: - Stateful Session Auth: Server generates a random session ID, stores session data in Redis/DB, and sends session ID in cookie. Server can instantly revoke sessions, but requires c...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Sessions = State in Redis, instant revocation. JWT = Stateless cryptographic proof, zero DB lookup, harder to revoke.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 113,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "How do you implement API Key authentication for external B2B clients in Express?",
    "answer": "Accept `X-API-Key` in headers. Hash the incoming API key using SHA-256 and look up the customer record in DB/Redis. Attach client permissions and rate limits to `req.client`.",
    "memoryModel": "Memory Anchor: Look up hashed API key in DB/Redis -> attach client -> enforce per-key rate limits.",
    "code": "export const apiKeyAuth = async (req, res, next) => {\n  const apiKey = req.headers['x-api-key'];\n  if (!apiKey) return res.status(401).json({ error: 'API key missing' });\n\n  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');\n  const client = await ClientModel.findOne({ apiKeyHash: hashedKey, isActive: true });\n  if (!client) return res.status(401).json({ error: 'Invalid or revoked API key' });\n\n  req.client = client;\n  next();\n};",
    "difficulty": "Senior",
    "pitch": "In production, How do you implement API Key authentication for external B2B clients in Express centers on first-principles system mechanics. Specifically: Accept `X-API-Key` in headers. Hash the incoming API key using SHA-256 and look up the customer record in DB/Redis. Attach client permissions and rate limits to `req.client`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Look up hashed API key in DB/Redis -> attach client -> enforce per-key rate limits.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 114,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is OAuth 2.0 / OpenID Connect (OIDC) and how does the Authorization Code flow work?",
    "answer": "OAuth 2.0 is an authorization framework. The Authorization Code flow with PKCE is standard for web/mobile apps:\n1) User clicks 'Login with Google'; redirected to Google login.\n2) User grants consent; Google redirects back to Node server with an authorization `code`.\n3) Node server makes backend server-to-server POST request to Google's token endpoint exchanging `code` + `client_secret` for an `access_token` and `id_token` (JWT with user identity).\n4) Server logs user in or creates account.",
    "memoryModel": "Memory Anchor: Auth Code Flow: Redirect to provider -> get code -> backend exchanges code for token -> get user profile.",
    "difficulty": "Senior",
    "pitch": "In production, What is OAuth 2.0 / OpenID Connect (OIDC) and how does the Authorization Code flow work centers on first-principles system mechanics. Specifically: OAuth 2.0 is an authorization framework. The Authorization Code flow with PKCE is standard for web/mobile apps:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Auth Code Flow: Redirect to provider -> get code -> backend exchanges code for token -> get user profile.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 115,
    "topicId": 7,
    "topicTitle": "7. Auth: JWT, Refresh & Bcrypt",
    "question": "What is Argon2 and how does it compare to Bcrypt?",
    "answer": "Argon2 is the winner of the Password Hashing Competition (PHC). Unlike Bcrypt which is primarily CPU-bound, Argon2 (specifically Argon2id) is **memory-hard** and resistant to GPU and custom ASIC hardware cracking attacks. Modern security standards recommend Argon2id or Bcrypt with cost 12.",
    "memoryModel": "Memory Anchor: Argon2id = Memory-hard password hashing algorithm, even stronger against ASIC/GPU attacks than Bcrypt.",
    "difficulty": "Senior",
    "pitch": "In production, What is Argon2 and how does it compare to Bcrypt centers on first-principles system mechanics. Specifically: Argon2 is the winner of the Password Hashing Competition (PHC). Unlike Bcrypt which is primarily CPU-bound, Argon2 (specifically Argon2id) is memory-hard and resistant to GPU and c...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Argon2id = Memory-hard password hashing algorithm, even stronger against ASIC/GPU attacks than Bcrypt.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 116,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What is a Webhook, and why are webhooks used instead of polling?",
    "answer": "A Webhook is an HTTP callback (HTTP POST request) sent by a source system (Stripe, GitHub, Shopify) to a destination server when a specific event occurs ('push' notification).\nWhy use webhooks instead of polling:\n- **Polling**: Client constantly queries `GET /api/order/status` every 2 seconds. Inefficient: wastes network bandwidth, server CPU, and database queries for 99% empty responses.\n- **Webhooks**: Provider instantly pushes payload to your server only when the event actually happens, offering real-time updates and zero wasted resources.",
    "memoryModel": "Memory Anchor: Webhooks = Push notification for servers. Polling = Wasted queries; Webhooks = Real-time event push.",
    "difficulty": "Senior",
    "pitch": "In production, What is a Webhook, and why are webhooks used instead of polling centers on first-principles system mechanics. Specifically: A Webhook is an HTTP callback (HTTP POST request) sent by a source system (Stripe, GitHub, Shopify) to a destination server when a specific event occurs ('push' notification)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Webhooks = Push notification for servers. Polling = Wasted queries; Webhooks = Real-time event push.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 117,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How do you verify the authenticity of an incoming Webhook (HMAC SHA-256)?",
    "answer": "Providers compute a cryptographic HMAC signature of the **raw request payload** using a shared secret key and send it in a header (e.g. `stripe-signature` or `x-razorpay-signature`).\nYour server computes the expected HMAC SHA-256 hash using the shared secret and the raw request Buffer, and verifies it against the header using `crypto.timingSafeEqual()`.\nIf signatures match, the payload is genuine and untampered.",
    "memoryModel": "Memory Anchor: HMAC SHA-256(Raw Body, Webhook Secret) === Provider Header via timingSafeEqual().",
    "code": "import crypto from 'node:crypto';\n\nexport function verifyWebhookSignature(rawBody, signatureHeader, secret) {\n  const expectedSignature = crypto\n    .createHmac('sha256', secret)\n    .update(rawBody)\n    .digest('hex');\n\n  return crypto.timingSafeEqual(\n    Buffer.from(signatureHeader),\n    Buffer.from(expectedSignature)\n  );\n}",
    "difficulty": "Senior",
    "pitch": "In production, How do you verify the authenticity of an incoming Webhook (HMAC SHA-256) centers on first-principles system mechanics. Specifically: Providers compute a cryptographic HMAC signature of the raw request payload using a shared secret key and send it in a header (e.g. `stripe-signature` or `x-razorpay-signature`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HMAC SHA-256(Raw Body, Webhook Secret) === Provider Header via timingSafeEqual().",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 118,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "Why MUST you use the raw binary request body for webhook signature verification?",
    "answer": "HMAC hashing operates on exact byte sequences. If you parse the body with `express.json()` before verifying, whitespace differences, key ordering, or Unicode character escaping changes the byte representation, causing HMAC comparison to fail completely.\nYou must capture the raw Buffer using `express.raw({ type: 'application/json' })` or save the raw buffer in `express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })`.",
    "memoryModel": "Memory Anchor: Any JSON parse or whitespace change alters bytes and invalidates HMAC. You MUST use the raw Buffer!",
    "difficulty": "Senior",
    "pitch": "In production, Why MUST you use the raw binary request body for webhook signature verification centers on first-principles system mechanics. Specifically: HMAC hashing operates on exact byte sequences. If you parse the body with `express.json()` before verifying, whitespace differences, key ordering, or Unicode character escaping cha...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Any JSON parse or whitespace change alters bytes and invalidates HMAC. You MUST use the raw Buffer!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 119,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What is Webhook Idempotency, and how do you handle duplicate webhook deliveries?",
    "answer": "Webhook providers guarantee **At-Least-Once Delivery**, meaning network glitches or timeouts can cause the provider to send the exact same event multiple times.\nIf you process `payment_intent.succeeded` twice without idempotency, you could fulfill an order twice or deliver duplicate credits!\nFix: Extract the unique `event.id` from the payload. Check Redis/DB with atomic `SET event:evt_123 1 NX EX 86400`. If key already exists, return `200 OK` immediately without re-processing.",
    "memoryModel": "Memory Anchor: Providers guarantee at-least-once delivery. Deduplicate using atomic Redis SET event.id NX.",
    "code": "app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {\n  const event = parseAndVerify(req);\n\n  // Check if event already processed:\n  const isNew = await redis.set(`webhook:event:${event.id}`, 'processed', 'EX', 86400 * 7, 'NX');\n  if (!isNew) {\n    console.log(`Duplicate event ${event.id} ignored`);\n    return res.status(200).json({ received: true });\n  }\n\n  await processBusinessLogic(event);\n  res.status(200).json({ received: true });\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is Webhook Idempotency, and how do you handle duplicate webhook deliveries centers on first-principles system mechanics. Specifically: Webhook providers guarantee At-Least-Once Delivery, meaning network glitches or timeouts can cause the provider to send the exact same event multiple times....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Providers guarantee at-least-once delivery. Deduplicate using atomic Redis SET event.id NX.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 120,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "Why must webhook handlers respond with HTTP 200 immediately before running heavy background work?",
    "answer": "Webhook providers (Stripe, GitHub) enforce strict HTTP timeouts (usually 3 to 10 seconds). If your handler performs slow tasks (generating PDFs, sending emails, video processing) synchronously, the webhook times out. The provider assumes failure and retries repeatedly, causing an avalanche of duplicate webhooks!\nFix: Verify signature, save event to DB or push to a message queue (BullMQ/RabbitMQ), and return `200 OK` within 200ms. Process heavy tasks asynchronously in worker jobs.",
    "memoryModel": "Memory Anchor: Webhooks timeout in 3-5 seconds! Acknowledge with 200 OK fast, offload heavy work to BullMQ/RabbitMQ.",
    "difficulty": "Senior",
    "pitch": "In production, Why must webhook handlers respond with HTTP 200 immediately before running heavy background work centers on first-principles system mechanics. Specifically: Webhook providers (Stripe, GitHub) enforce strict HTTP timeouts (usually 3 to 10 seconds). If your handler performs slow tasks (generating PDFs, sending emails, video processing) s...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Webhooks timeout in 3-5 seconds! Acknowledge with 200 OK fast, offload heavy work to BullMQ/RabbitMQ.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 121,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What is Replay Attack Prevention in Webhooks, and how does the timestamp header work?",
    "answer": "A replay attack occurs when an attacker intercepts a valid webhook payload and signature and re-sends it later to trigger duplicate business logic.\nStripe and standard providers include a timestamp in the signature header (`t=1614555555,v1=...`).\nVerification compares the current server time with the payload timestamp: if `Math.abs(Date.now()/1000 - t) > 300` (older than 5 minutes), the webhook is rejected as a stale replay attack.",
    "memoryModel": "Memory Anchor: Check timestamp in signature header: reject webhooks older than 5 minutes to prevent replay attacks.",
    "difficulty": "Mid",
    "pitch": "In production, What is Replay Attack Prevention in Webhooks, and how does the timestamp header work centers on first-principles system mechanics. Specifically: A replay attack occurs when an attacker intercepts a valid webhook payload and signature and re-sends it later to trigger duplicate business logic....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Check timestamp in signature header: reject webhooks older than 5 minutes to prevent replay attacks.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 122,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How do you handle webhook delivery failures and retries on your server?",
    "answer": "If your server returns 500 or times out, providers implement exponential backoff retries (e.g. retry after 1h, 2h, 4h, 8h for up to 3 days).\nYour server should:\n1) Monitor webhook health and alert on consecutive 500s.\n2) Guarantee idempotency across retries.\n3) Maintain a `dead_letter_webhooks` table for manual review if an event consistently fails after retries.",
    "memoryModel": "Memory Anchor: Providers retry on 5xx with exponential backoff. Maintain idempotency and log dead-letter events.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle webhook delivery failures and retries on your server centers on first-principles system mechanics. Specifically: If your server returns 500 or times out, providers implement exponential backoff retries (e.g. retry after 1h, 2h, 4h, 8h for up to 3 days)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Providers retry on 5xx with exponential backoff. Maintain idempotency and log dead-letter events.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 123,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How do you test webhooks locally behind a firewall during development?",
    "answer": "Use webhook tunneling tools:\n1) **Stripe CLI**: `stripe listen --forward-to localhost:3000/api/webhook/stripe`.\n2) **Ngrok**: `ngrok http 3000` (exposes public HTTPS tunnel to local port).\n3) Mocking with Supertest by signing local test payloads with the mock webhook secret.",
    "memoryModel": "Memory Anchor: Use Stripe CLI forward-to or Ngrok to tunnel external webhooks to localhost:3000.",
    "difficulty": "Senior",
    "pitch": "In production, How do you test webhooks locally behind a firewall during development centers on first-principles system mechanics. Specifically: Use webhook tunneling tools:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use Stripe CLI forward-to or Ngrok to tunnel external webhooks to localhost:3000.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 124,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What are Outgoing Webhooks and how do you design a reliable Webhook Producer in Node.js?",
    "answer": "An outgoing webhook system notifies your customers' servers when events occur in your application. Requirements:\n1) Store customer webhook URLs and per-tenant shared secrets.\n2) Sign outgoing payloads with HMAC SHA-256.\n3) Queue deliveries in BullMQ/RabbitMQ.\n4) Implement exponential backoff retries on failure (3–5 attempts).\n5) Disable webhook endpoints that continuously fail (circuit breaker).",
    "memoryModel": "Memory Anchor: Outgoing webhooks: BullMQ queue -> HMAC sign -> POST with exponential backoff -> disable failing endpoints.",
    "difficulty": "Senior",
    "pitch": "In production, What are Outgoing Webhooks and how do you design a reliable Webhook Producer in Node.js centers on first-principles system mechanics. Specifically: An outgoing webhook system notifies your customers' servers when events occur in your application. Requirements:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Outgoing webhooks: BullMQ queue -> HMAC sign -> POST with exponential backoff -> disable failing endpoints.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 125,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What is the difference between Synchronous API calls and Asynchronous Webhooks in payment flows?",
    "answer": "- **Synchronous API call**: Frontend or server calls payment gateway and waits for immediate response. If network drops or 3D-Secure MFA is required, the connection is lost.\n- **Asynchronous Webhook**: The definitive source of truth. After customer finishes 3D-Secure authentication on bank's page, the gateway pushes `payment_intent.succeeded` directly to your backend server-to-server.",
    "memoryModel": "Memory Anchor: Sync call initiates checkout; Asynchronous webhook delivers authoritative proof of settlement.",
    "difficulty": "Staff",
    "pitch": "In production, What is the difference between Synchronous API calls and Asynchronous Webhooks in payment flows centers on first-principles system mechanics. Specifically: - Synchronous API call: Frontend or server calls payment gateway and waits for immediate response. If network drops or 3D-Secure MFA is required, the connection is lost....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Sync call initiates checkout; Asynchronous webhook delivers authoritative proof of settlement.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: In-Memory Set Deduplication (Naive)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(N)",
        "explanation": "Uses an in-memory Set. Fails in multi-instance clusters and loses history if the server restarts.",
        "code": "const seen = new Set();\nfunction handleWebhook(evt) {\n  if (seen.has(evt.id)) return;\n  seen.add(evt.id);\n  // Process...\n}"
      },
      {
        "title": "Approach 2: Atomic Database Idempotency with Unique Constraint (Optimal)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Inserts the event ID into a dedicated table with a UNIQUE constraint inside an ACID transaction.",
        "code": "export async function handleWebhookIdempotent(pool, event) {\n  const conn = await pool.getConnection();\n  try {\n    await conn.beginTransaction();\n    await conn.execute(\n      'INSERT INTO processed_events (event_id, event_type) VALUES (?, ?)',\n      [event.id, event.type]\n    );\n    // Process credit...\n    await conn.commit();\n  } catch (err) {\n    await conn.rollback();\n    if (err.code === 'ER_DUP_ENTRY') return { duplicate: true };\n    throw err;\n  } finally {\n    conn.release();\n  }\n}"
      }
    ]
  },
  {
    "id": 126,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How do you secure your Webhook endpoint against Denial of Service (DoS) attacks?",
    "answer": "1) Apply IP whitelisting for providers with published static IP ranges (e.g. GitHub).\n2) Apply rate limiting by IP.\n3) Reject payloads exceeding 1 MB immediately.\n4) Verify HMAC signature before performing any database queries or expensive allocations.",
    "memoryModel": "Memory Anchor: Verify HMAC signature before hitting DB; rate limit and reject large bodies.",
    "difficulty": "Senior",
    "pitch": "In production, How do you secure your Webhook endpoint against Denial of Service (DoS) attacks centers on first-principles system mechanics. Specifically: 1) Apply IP whitelisting for providers with published static IP ranges (e.g. GitHub)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Verify HMAC signature before hitting DB; rate limit and reject large bodies.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 127,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How does Razorpay webhook verification differ from Stripe in Node.js?",
    "answer": "- **Stripe**: Sends timestamp and signature together in `stripe-signature` header; uses `stripe.webhooks.constructEvent(rawBody, sig, secret)`.\n- **Razorpay**: Sends raw body and signature in `x-razorpay-signature` header; verified via `crypto.createHmac('sha256', secret).update(rawBody).digest('hex') === req.headers['x-razorpay-signature']`.",
    "memoryModel": "Memory Anchor: Stripe uses constructEvent helper; Razorpay uses native crypto.createHmac on raw body.",
    "difficulty": "Senior",
    "pitch": "In production, How does Razorpay webhook verification differ from Stripe in Node.js centers on first-principles system mechanics. Specifically: - Stripe: Sends timestamp and signature together in `stripe-signature` header; uses `stripe.webhooks.constructEvent(rawBody, sig, secret)`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Stripe uses constructEvent helper; Razorpay uses native crypto.createHmac on raw body.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 128,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What is a Dead Letter Queue (DLQ) in webhook processing?",
    "answer": "A Dead Letter Queue is a holding queue for webhook events that have failed all maximum retry attempts (e.g. due to database crashes or bug in business logic). DLQs allow developers to inspect poisoned payloads, fix bugs, and replay the webhooks manually without losing customer transactions.",
    "memoryModel": "Memory Anchor: DLQ = Graveyard for failed webhooks to inspect, debug, and manually replay.",
    "difficulty": "Senior",
    "pitch": "In production, What is a Dead Letter Queue (DLQ) in webhook processing centers on first-principles system mechanics. Specifically: A Dead Letter Queue is a holding queue for webhook events that have failed all maximum retry attempts (e.g. due to database crashes or bug in business logic). DLQs allow developers...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: DLQ = Graveyard for failed webhooks to inspect, debug, and manually replay.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 129,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "What HTTP status should you return if a webhook has an invalid HMAC signature?",
    "answer": "Return `400 Bad Request` or `401 Unauthorized` with an error message like `'Webhook signature verification failed'`. Do NOT return 200 (which tells provider the message was accepted) and do NOT return 500 (which causes the provider to re-send the fraudulent payload repeatedly).",
    "memoryModel": "Memory Anchor: Invalid signature -> return 400 Bad Request immediately. Never return 200 or 500!",
    "difficulty": "Senior",
    "pitch": "In production, What HTTP status should you return if a webhook has an invalid HMAC signature centers on first-principles system mechanics. Specifically: Return `400 Bad Request` or `401 Unauthorized` with an error message like `'Webhook signature verification failed'`. Do NOT return 200 (which tells provider the message was accepte...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Invalid signature -> return 400 Bad Request immediately. Never return 200 or 500!",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 130,
    "topicId": 8,
    "topicTitle": "8. Webhooks & Signatures",
    "question": "How do you handle schema versioning in Webhook payloads?",
    "answer": "Include an API version field in the payload header or body (`{ api_version: '2024-01-01', event: ... }`). If payload structures change, older customer webhook consumers won't break if your dispatcher adapts payload formats based on customer registered version.",
    "memoryModel": "Memory Anchor: Explicit api_version in webhook payload allows graceful schema evolution.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle schema versioning in Webhook payloads centers on first-principles system mechanics. Specifically: Include an API version field in the payload header or body (`{ api_version: '2024-01-01', event: ... }`). If payload structures change, older customer webhook consumers won't break...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Explicit api_version in webhook payload allows graceful schema evolution.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 131,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "Explain the complete end-to-end Payment Flow in a modern Node.js application (PaymentIntent pattern).",
    "answer": "1) **Client Checkout**: User clicks 'Checkout'; frontend calls `POST /api/create-payment-intent` with cart items.\n2) **Server Intent Creation**: Server calculates authoritative total from DB (never trusts client prices!), creates a Stripe `PaymentIntent({ amount, currency })`, and returns `client_secret` to frontend.\n3) **Client Confirmation**: Frontend uses Stripe Elements / SDK with `client_secret` to collect card details and submit directly to Stripe (PCI-DSS compliance; card numbers never touch your Node server!). Handles 3D-Secure MFA if required.\n4) **Asynchronous Webhook Settlement**: Stripe sends `payment_intent.succeeded` webhook to your server. Server verifies HMAC signature, checks idempotency, transitions order status to `'paid'`, and unlocks access/inventory.",
    "memoryModel": "Memory Anchor: 1) Server calculates total & creates PaymentIntent -> 2) Client pays via Stripe Elements -> 3) Authoritative fulfillment happens in Webhook handler.",
    "code": "// 1. Create PaymentIntent on server:\napp.post('/api/create-payment-intent', authenticateUser, async (req, res) => {\n  const amount = await calculateOrderTotalFromDb(req.body.items); // Authoritative DB price!\n  const paymentIntent = await stripe.paymentIntents.create({\n    amount,\n    currency: 'inr',\n    metadata: { userId: req.user.id, orderId: req.body.orderId }\n  });\n  res.json({ clientSecret: paymentIntent.client_secret });\n});",
    "difficulty": "Senior",
    "pitch": "In production, Explain the complete end-to-end Payment Flow in a modern Node.js application (PaymentIntent pattern). centers on first-principles system mechanics. Specifically: 1) Client Checkout: User clicks 'Checkout'; frontend calls `POST /api/create-payment-intent` with cart items....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 1) Server calculates total & creates PaymentIntent -> 2) Client pays via Stripe Elements -> 3) Authoritative fulfillment happens in Webhook handler.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 132,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "Why must you NEVER trust prices, totals, or currencies sent from the frontend?",
    "answer": "A client-side frontend is entirely user-controlled. Any user can open Chrome DevTools, edit JavaScript variables, intercept network payloads with proxy tools (Burp Suite, Postman), and change a $1,000 product price to $0.01.\nThe Node.js backend MUST re-fetch product prices from the authoritative database, multiply by validated item quantities, apply validated discount coupons from DB, and calculate the final payable amount on the server.",
    "memoryModel": "Memory Anchor: Frontend prices are untrusted user input! Always calculate final order totals on the server from DB.",
    "difficulty": "Senior",
    "pitch": "In production, Why must you NEVER trust prices, totals, or currencies sent from the frontend centers on first-principles system mechanics. Specifically: A client-side frontend is entirely user-controlled. Any user can open Chrome DevTools, edit JavaScript variables, intercept network payloads with proxy tools (Burp Suite, Postman),...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Frontend prices are untrusted user input! Always calculate final order totals on the server from DB.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 133,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is PCI-DSS compliance and how does Stripe Elements / Tokenization protect your Node server?",
    "answer": "PCI-DSS (Payment Card Industry Data Security Standard) mandates strict compliance audits, network isolation, and encryption for any server that transmits, processes, or stores raw credit card numbers (PAN/CVV).\nBy using Stripe Elements or hosted checkout, card details are collected directly in an iframe hosted on Stripe's PCI-compliant servers and tokenized. Your Node server receives only a safe token (`pm_123` or `client_secret`), achieving **SAQ-A compliance** with zero raw card handling liability.",
    "memoryModel": "Memory Anchor: Stripe Elements tokens keep raw card numbers off your server, achieving SAQ-A PCI compliance.",
    "difficulty": "Senior",
    "pitch": "In production, What is PCI-DSS compliance and how does Stripe Elements / Tokenization protect your Node server centers on first-principles system mechanics. Specifically: PCI-DSS (Payment Card Industry Data Security Standard) mandates strict compliance audits, network isolation, and encryption for any server that transmits, processes, or stores raw ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Stripe Elements tokens keep raw card numbers off your server, achieving SAQ-A PCI compliance.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 134,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is 3D Secure (3DS2) and Strong Customer Authentication (SCA)?",
    "answer": "3D Secure 2 is an authentication protocol mandated by European PSD2 regulations and global banks. It challenges customers to complete two-factor authentication (OTP via SMS, bank mobile app biometric prompt) during checkout.\nIn Node, your PaymentIntent enters `requires_action` status. The frontend handles the modal bank prompt and completes authentication, after which the webhook emits `payment_intent.succeeded`.",
    "memoryModel": "Memory Anchor: 3DS2 = Bank MFA/OTP challenge. Handled on frontend; final success received in backend webhook.",
    "difficulty": "Senior",
    "pitch": "In production, What is 3D Secure (3DS2) and Strong Customer Authentication (SCA) centers on first-principles system mechanics. Specifically: 3D Secure 2 is an authentication protocol mandated by European PSD2 regulations and global banks. It challenges customers to complete two-factor authentication (OTP via SMS, bank m...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 3DS2 = Bank MFA/OTP challenge. Handled on frontend; final success received in backend webhook.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 135,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you prevent duplicate order fulfillment when a webhook is delivered twice?",
    "answer": "1) Use a database transaction with a unique constraint on `payment_intent_id`.\n2) Check order state: if `order.status === 'paid'`, ignore the webhook.\n3) Store processed webhook event IDs in Redis (`SET webhook:evt_123 1 NX EX 86400`) to guarantee idempotent execution.",
    "memoryModel": "Memory Anchor: Check if order already paid + unique DB constraint on transactionId + Redis event deduplication.",
    "difficulty": "Senior",
    "pitch": "In production, How do you prevent duplicate order fulfillment when a webhook is delivered twice centers on first-principles system mechanics. Specifically: 1) Use a database transaction with a unique constraint on `payment_intent_id`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Check if order already paid + unique DB constraint on transactionId + Redis event deduplication.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 136,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is the difference between Payment Authorization and Payment Capture (Auth & Capture)?",
    "answer": "- **Authorization**: Places a temporary hold on the customer's funds (e.g. hotel booking, ride-sharing estimate) without charging the card. Hold usually lasts 7 days.\n- **Capture**: Actually transfers the authorized funds to your merchant account once the service is rendered (e.g. when the order ships or ride ends). If cancelled before capture, the hold is released with zero refund fees.",
    "memoryModel": "Memory Anchor: Auth = Reserve funds on card. Capture = Actually charge and transfer funds when service completes.",
    "difficulty": "Mid",
    "pitch": "In production, What is the difference between Payment Authorization and Payment Capture (Auth & Capture) centers on first-principles system mechanics. Specifically: - Authorization: Places a temporary hold on the customer's funds (e.g. hotel booking, ride-sharing estimate) without charging the card. Hold usually lasts 7 days....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Auth = Reserve funds on card. Capture = Actually charge and transfer funds when service completes.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 137,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you handle Refunds and Partial Refunds in Node.js?",
    "answer": "Call `stripe.refunds.create({ payment_intent: 'pi_123', amount: 500 })`. Update order status to `'refunded'` or `'partially_refunded'`, log refund reason, adjust inventory if items were returned, and listen for the `charge.refunded` webhook for authoritative confirmation.",
    "memoryModel": "Memory Anchor: stripe.refunds.create({ payment_intent, amount }) -> await charge.refunded webhook.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle Refunds and Partial Refunds in Node.js centers on first-principles system mechanics. Specifically: Call `stripe.refunds.create({ payment_intent: 'pi_123', amount: 500 })`. Update order status to `'refunded'` or `'partially_refunded'`, log refund reason, adjust inventory if items...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: stripe.refunds.create({ payment_intent, amount }) -> await charge.refunded webhook.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 138,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is a Payment Reconciliation job and why is it needed in production?",
    "answer": "A reconciliation job is a scheduled background cron job (running daily or hourly) that queries the payment gateway API (e.g. Stripe `paymentIntents.list({ created: { gte: yesterday } })`) and compares gateway transactions against your internal database orders.\nIt catches discrepancies caused by missed webhooks, database connection drops during webhook processing, or network partitions, ensuring every cent charged has a corresponding fulfilled order.",
    "memoryModel": "Memory Anchor: Reconciliation = Daily cron comparing gateway charges vs internal DB to fix missed webhooks and billing drift.",
    "difficulty": "Senior",
    "pitch": "In production, What is a Payment Reconciliation job and why is it needed in production centers on first-principles system mechanics. Specifically: A reconciliation job is a scheduled background cron job (running daily or hourly) that queries the payment gateway API (e.g. Stripe `paymentIntents.list({ created: { gte: yesterday...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Reconciliation = Daily cron comparing gateway charges vs internal DB to fix missed webhooks and billing drift.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 139,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you handle recurring subscriptions, billing cycles, and failed payment webhooks?",
    "answer": "1) Use Stripe Subscriptions (`stripe.subscriptions.create({ customer, items: [{ price }] })`).\n2) Listen to webhooks:\n   - `invoice.paid`: Extend customer subscription end date in DB.\n   - `invoice.payment_failed`: Trigger dunning workflow (send email warning customer, grace period of 3 days before downgrading account).\n   - `customer.subscription.deleted`: Revoke premium access.",
    "memoryModel": "Memory Anchor: Subscriptions: invoice.paid extends access; invoice.payment_failed triggers dunning emails; subscription.deleted revokes access.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle recurring subscriptions, billing cycles, and failed payment webhooks centers on first-principles system mechanics. Specifically: 1) Use Stripe Subscriptions (`stripe.subscriptions.create({ customer, items: [{ price }] })`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Subscriptions: invoice.paid extends access; invoice.payment_failed triggers dunning emails; subscription.deleted revokes access.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 140,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you handle currency conversions and zero-decimal currencies in Stripe?",
    "answer": "Stripe requires amounts in the **smallest currency unit** (e.g. cents for USD: $10.00 is passed as `1000`; paise for INR: ₹10.00 is passed as `1000`).\nHowever, some currencies are **zero-decimal currencies** (e.g. Japanese Yen JPY, Korean Won KRW) where `1000` means ¥1000, not ¥10. Always use an authoritative currency helper to avoid charging customers 100x the intended amount!",
    "memoryModel": "Memory Anchor: Stripe amounts are in smallest units (cents/paise), except zero-decimal currencies like JPY/KRW.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle currency conversions and zero-decimal currencies in Stripe centers on first-principles system mechanics. Specifically: Stripe requires amounts in the smallest currency unit (e.g. cents for USD: $10.00 is passed as `1000`; paise for INR: ₹10.00 is passed as `1000`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Stripe amounts are in smallest units (cents/paise), except zero-decimal currencies like JPY/KRW.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 141,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is a Distributed Lock in payment checkout (Redis Redlock), and why is it needed?",
    "answer": "When a user with a poor mobile connection taps 'Pay Now' 3 times in 200 milliseconds, or when two users attempt to purchase the last available flight seat simultaneously, concurrent requests race to create orders.\nA distributed lock (`redlock` in Redis) guarantees that only **one request at a time** can execute the checkout and inventory-deduction logic for a given user or cart ID, preventing double booking and duplicate charges.",
    "memoryModel": "Memory Anchor: Redis distributed lock prevents parallel concurrent requests from double-charging or double-booking inventory.",
    "difficulty": "Senior",
    "pitch": "In production, What is a Distributed Lock in payment checkout (Redis Redlock), and why is it needed centers on first-principles system mechanics. Specifically: When a user with a poor mobile connection taps 'Pay Now' 3 times in 200 milliseconds, or when two users attempt to purchase the last available flight seat simultaneously, concurren...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Redis distributed lock prevents parallel concurrent requests from double-charging or double-booking inventory.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 142,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you handle payment provider outages gracefully?",
    "answer": "1) Implement a circuit breaker (e.g. `opossum`) around payment gateway API calls so your server fails fast instead of hanging when the gateway is down.\n2) If primary gateway (e.g. Stripe) is degraded, route transactions to a secondary fallback provider (e.g. PayPal or Razorpay).\n3) Save pending checkout intents with an expiration TTL so users can retry once services recover.",
    "memoryModel": "Memory Anchor: Circuit breaker fails fast on provider downtime; multi-gateway fallback ensures business continuity.",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle payment provider outages gracefully centers on first-principles system mechanics. Specifically: 1) Implement a circuit breaker (e.g. `opossum`) around payment gateway API calls so your server fails fast instead of hanging when the gateway is down....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Circuit breaker fails fast on provider downtime; multi-gateway fallback ensures business continuity.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 143,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What is Razorpay Order creation and how does the frontend-backend flow work?",
    "answer": "1) Server calls `razorpay.orders.create({ amount: 50000, currency: 'INR', receipt: 'order_rcptid_11' })`.\n2) Server returns `order.id` to frontend.\n3) Frontend opens Razorpay Checkout modal with `order_id` and collects payment.\n4) On success, frontend sends `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to backend.\n5) Backend verifies HMAC signature: `HMAC_SHA256(order_id + '|' + payment_id, secret) === signature`.",
    "memoryModel": "Memory Anchor: Razorpay flow: Server creates Order -> Frontend collects payment -> Server verifies HMAC(order_id + '|' + payment_id).",
    "difficulty": "Senior",
    "pitch": "In production, What is Razorpay Order creation and how does the frontend-backend flow work centers on first-principles system mechanics. Specifically: 1) Server calls `razorpay.orders.create({ amount: 50000, currency: 'INR', receipt: 'order_rcptid_11' })`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Razorpay flow: Server creates Order -> Frontend collects payment -> Server verifies HMAC(order_id + '|' + payment_id).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 144,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "What are Chargebacks and Disputes, and how should your backend respond?",
    "answer": "A chargeback occurs when a cardholder disputes a charge with their credit card company (claims fraud or non-delivery). Gateway emits `charge.dispute.created` webhook.\nYour backend should:\n1) Flag the transaction and temporarily restrict fraudulent account.\n2) Automatically submit evidence (proof of delivery, IP logs, customer signature, email history) via `stripe.disputes.update()` before the deadline.",
    "memoryModel": "Memory Anchor: Chargeback = Customer bank dispute. Listen to dispute webhook and upload delivery evidence.",
    "difficulty": "Senior",
    "pitch": "In production, What are Chargebacks and Disputes, and how should your backend respond centers on first-principles system mechanics. Specifically: A chargeback occurs when a cardholder disputes a charge with their credit card company (claims fraud or non-delivery). Gateway emits `charge.dispute.created` webhook....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Chargeback = Customer bank dispute. Listen to dispute webhook and upload delivery evidence.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 145,
    "topicId": 9,
    "topicTitle": "9. Payment Integration Workflows",
    "question": "How do you securely test payment flows in automated CI/CD pipelines without live credentials?",
    "answer": "1) Use mock payment service adapters or gateway test API keys (`sk_test_...`) in staging.\n2) In unit/integration tests with Supertest, mock gateway SDK methods (`jest.spyOn(stripe.paymentIntents, 'create').mockResolvedValue(...)`).\n3) Test edge cases: card declined (`card_declined`), expired card, insufficient funds, and network timeout.",
    "memoryModel": "Memory Anchor: Mock gateway SDK calls in Jest integration tests; test decline and 3DS challenge error branches.",
    "difficulty": "Senior",
    "pitch": "In production, How do you securely test payment flows in automated CI/CD pipelines without live credentials centers on first-principles system mechanics. Specifically: 1) Use mock payment service adapters or gateway test API keys (`sk_test_...`) in staging....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Mock gateway SDK calls in Jest integration tests; test decline and 3DS challenge error branches.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 146,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is CORS (Cross-Origin Resource Sharing) and how does the cors middleware work?",
    "answer": "CORS is a browser security mechanism that restricts web applications from making HTTP requests to a different domain, port, or protocol than the one that served the frontend.\nThe Express `cors()` middleware sets response headers:\n- `Access-Control-Allow-Origin`: Allowed origins (`https://myapp.com` or `*`).\n- `Access-Control-Allow-Methods`: Permitted HTTP verbs.\n- `Access-Control-Allow-Headers`: Allowed custom request headers.\n- `Access-Control-Allow-Credentials`: Must be `true` if cookies or authorization headers are included.",
    "memoryModel": "Memory Anchor: CORS is enforced by BROWSER, not server! Server returns Access-Control-Allow-* headers telling browser it is safe.",
    "code": "import cors from 'cors';\n\nconst allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];\napp.use(cors({\n  origin: (origin, callback) => {\n    // Allow requests with no origin (like mobile apps, curl, postman):\n    if (!origin || allowedOrigins.includes(origin)) {\n      callback(null, true);\n    } else {\n      callback(new Error('Blocked by CORS policy'));\n    }\n  },\n  credentials: true,\n  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']\n}));",
    "difficulty": "Senior",
    "pitch": "In production, What is CORS (Cross-Origin Resource Sharing) and how does the cors middleware work centers on first-principles system mechanics. Specifically: CORS is a browser security mechanism that restricts web applications from making HTTP requests to a different domain, port, or protocol than the one that served the frontend....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: CORS is enforced by BROWSER, not server! Server returns Access-Control-Allow-* headers telling browser it is safe.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 147,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "Why is Access-Control-Allow-Origin: * incompatible with credentials: true?",
    "answer": "Web security specifications strictly forbid setting `Access-Control-Allow-Origin: *` (wildcard) when `Access-Control-Allow-Credentials: true` is enabled. If this were permitted, any malicious third-party website could make authenticated requests using a user's stored cookies to access sensitive banking or email data.\nYou MUST specify the explicit, exact origin (e.g. `https://myapp.com`).",
    "memoryModel": "Memory Anchor: Wildcard * and credentials: true together are blocked by all browsers for security.",
    "difficulty": "Senior",
    "pitch": "In production, Why is Access-Control-Allow-Origin: * incompatible with credentials: true centers on first-principles system mechanics. Specifically: Web security specifications strictly forbid setting `Access-Control-Allow-Origin: *` (wildcard) when `Access-Control-Allow-Credentials: true` is enabled. If this were permitted, an...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Wildcard * and credentials: true together are blocked by all browsers for security.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 148,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Helmet middleware and what security headers does it set?",
    "answer": "`helmet()` sets 15 sensible HTTP response headers that defend against common web vulnerabilities:\n1) `Content-Security-Policy (CSP)`: Restricts where scripts, images, and stylesheets can be loaded from, stopping XSS.\n2) `Strict-Transport-Security (HSTS)`: Forces browser to communicate only via HTTPS.\n3) `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.\n4) `X-Frame-Options: SAMEORIGIN` / `DENY`: Prevents Clickjacking in iframes.\n5) `X-XSS-Protection`: Defends legacy browsers against reflected XSS.",
    "memoryModel": "Memory Anchor: helmet() sets CSP, HSTS, X-Content-Type-Options, X-Frame-Options to harden HTTP headers.",
    "difficulty": "Senior",
    "pitch": "In production, What is Helmet middleware and what security headers does it set centers on first-principles system mechanics. Specifically: `helmet()` sets 15 sensible HTTP response headers that defend against common web vulnerabilities:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: helmet() sets CSP, HSTS, X-Content-Type-Options, X-Frame-Options to harden HTTP headers.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 149,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Rate Limiting and how do you implement it with express-rate-limit and Redis?",
    "answer": "Rate limiting limits the number of requests a client IP or authenticated user can make within a time window, defending against Brute-Force attacks, DDoS, and API scraping.\nUse `express-rate-limit` with `rate-limit-redis` to share limits across horizontally scaled server instances in Redis.",
    "memoryModel": "Memory Anchor: Rate limit defends against brute-force & DDoS. Use Redis store so limits apply across all cluster instances.",
    "code": "import rateLimit from 'express-rate-limit';\nimport RedisStore from 'rate-limit-redis';\n\nexport const authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 5, // 5 failed attempts per IP\n  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },\n  standardHeaders: true, // Return RateLimit-* headers\n  legacyHeaders: false,\n  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })\n});\n\napp.post('/api/auth/login', authLimiter, loginHandler);",
    "difficulty": "Senior",
    "pitch": "In production, What is Rate Limiting and how do you implement it with express-rate-limit and Redis centers on first-principles system mechanics. Specifically: Rate limiting limits the number of requests a client IP or authenticated user can make within a time window, defending against Brute-Force attacks, DDoS, and API scraping....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Rate limit defends against brute-force & DDoS. Use Redis store so limits apply across all cluster instances.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 150,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is NoSQL Injection in MongoDB and how do you prevent it in Node.js?",
    "answer": "NoSQL injection occurs when an attacker passes an object containing MongoDB operators (`$gt`, `$ne`, `$regex`) into query parameters instead of a string:\nAttacking payload: `{ username: 'admin', password: { $gt: '' } }`.\nBecause `password > ''` evaluates to true for all non-empty strings, the attacker logs in without a password!\nPrevention:\n1) Use `express-mongo-sanitize` (strips `$` and `.` from inputs).\n2) Use strict schema validation (Zod / Joi) to enforce that password is strictly a `string`.",
    "memoryModel": "Memory Anchor: NoSQL injection passes {$gt: ''} to bypass login. Prevent using express-mongo-sanitize + Zod schema validation.",
    "code": "import mongoSanitize from 'express-mongo-sanitize';\napp.use(mongoSanitize()); // Replaces any key starting with '$' or containing '.'",
    "difficulty": "Staff",
    "pitch": "In production, What is NoSQL Injection in MongoDB and how do you prevent it in Node.js centers on first-principles system mechanics. Specifically: NoSQL injection occurs when an attacker passes an object containing MongoDB operators (`$gt`, `$ne`, `$regex`) into query parameters instead of a string:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: NoSQL injection passes {$gt: ''} to bypass login. Prevent using express-mongo-sanitize + Zod schema validation.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 151,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is SQL Injection and how do parameterized queries prevent it?",
    "answer": "SQL injection occurs when untrusted user input is directly concatenated into a raw SQL query string (`'SELECT * FROM users WHERE email = \"' + email + '\"'`). An attacker injects `' OR '1'='1` to dump the database.\nPrevention: Always use **parameterized queries** (`SELECT * FROM users WHERE email = ?` with `[email]`). The database driver treats parameters strictly as literal data values, never as executable SQL code.",
    "memoryModel": "Memory Anchor: Never string-concatenate SQL! Always use parameterized queries (db.query('... ?', [val])).",
    "difficulty": "Mid",
    "pitch": "In production, What is SQL Injection and how do parameterized queries prevent it centers on first-principles system mechanics. Specifically: SQL injection occurs when untrusted user input is directly concatenated into a raw SQL query string (`'SELECT * FROM users WHERE email = \"' + email + '\"'`). An attacker injects `' ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never string-concatenate SQL! Always use parameterized queries (db.query('... ?', [val])).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 152,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Cross-Site Request Forgery (CSRF) and how do you prevent it in APIs?",
    "answer": "CSRF tricks an authenticated user's browser into submitting an unauthorized state-changing request (e.g. transfer money) to a vulnerable site where the user has active session cookies.\nPrevention:\n1) Set `SameSite: 'strict'` on session cookies (browser won't send cookie on cross-site requests).\n2) Use CSRF tokens (`csurf` or double-submit cookie pattern).\n3) Stateless APIs using `Authorization: Bearer <token>` in JS headers are naturally immune to CSRF because browsers never attach custom headers automatically on cross-site form submits.",
    "memoryModel": "Memory Anchor: SameSite: 'strict' cookies + custom Authorization Bearer headers eliminate CSRF.",
    "difficulty": "Senior",
    "pitch": "In production, What is Cross-Site Request Forgery (CSRF) and how do you prevent it in APIs centers on first-principles system mechanics. Specifically: CSRF tricks an authenticated user's browser into submitting an unauthorized state-changing request (e.g. transfer money) to a vulnerable site where the user has active session cook...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: SameSite: 'strict' cookies + custom Authorization Bearer headers eliminate CSRF.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 153,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Cross-Site Scripting (XSS) and what is the difference between Stored, Reflected, and DOM XSS?",
    "answer": "XSS occurs when malicious JavaScript code is injected and executed in victims' browsers:\n- **Stored XSS**: Malicious script is saved in DB (e.g. comment field `<script>stealCookie()</script>`) and executed by every user viewing the page.\n- **Reflected XSS**: Script is in URL query parameter and reflected back in server response.\n- **DOM XSS**: Vulnerability in client JS reading data from `location.hash` and writing to `innerHTML`.\nPrevention: Sanitize with DOMPurify on frontend, validate inputs on backend, use CSP headers, and set `httpOnly` on cookies.",
    "memoryModel": "Memory Anchor: Stored XSS in DB; Reflected in URL; DOM in client. Prevent via input validation, DOMPurify, CSP, and HttpOnly cookies.",
    "difficulty": "Senior",
    "pitch": "In production, What is Cross-Site Scripting (XSS) and what is the difference between Stored, Reflected, and DOM XSS centers on first-principles system mechanics. Specifically: XSS occurs when malicious JavaScript code is injected and executed in victims' browsers:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Stored XSS in DB; Reflected in URL; DOM in client. Prevent via input validation, DOMPurify, CSP, and HttpOnly cookies.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 154,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Server-Side Request Forgery (SSRF) and how do you defend against it?",
    "answer": "SSRF occurs when an attacker tricks the Node.js server into making an HTTP request to an internal, private network address (e.g. user provides image URL `http://169.254.169.254/latest/meta-data/` to dump AWS cloud credentials or `http://localhost:6379` to query internal Redis).\nPrevention: Whitelist allowed domains/protocols, resolve DNS and reject private RFC 1918 / loopback IP ranges (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `169.254.x.x`), and disable following redirects to private IPs.",
    "memoryModel": "Memory Anchor: SSRF tricks server to fetch internal IPs (169.254.169.254 metadata). Whitelist domains and block private IP ranges.",
    "difficulty": "Senior",
    "pitch": "In production, What is Server-Side Request Forgery (SSRF) and how do you defend against it centers on first-principles system mechanics. Specifically: SSRF occurs when an attacker tricks the Node.js server into making an HTTP request to an internal, private network address (e.g. user provides image URL `http://169.254.169.254/lat...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: SSRF tricks server to fetch internal IPs (169.254.169.254 metadata). Whitelist domains and block private IP ranges.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 155,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is Prototype Pollution in Node.js?",
    "answer": "Prototype pollution occurs when merging or cloning untrusted JSON objects that contain `__proto__` or `constructor.prototype` properties (`{ \"__proto__\": { \"isAdmin\": true } }`).\nModifying the root `Object.prototype` injects properties into ALL JavaScript objects across the entire Node process, leading to privilege escalation, DoS, or remote code execution.\nPrevention: Use `Object.create(null)`, freeze prototypes, use modern Lodash (`lodash >= 4.17.21`), or use Map objects for dynamic keys.",
    "memoryModel": "Memory Anchor: Prototype pollution injects properties into Object.prototype via __proto__. Avoid unsafe recursive deep merges.",
    "difficulty": "Senior",
    "pitch": "In production, What is Prototype Pollution in Node.js centers on first-principles system mechanics. Specifically: Prototype pollution occurs when merging or cloning untrusted JSON objects that contain `__proto__` or `constructor.prototype` properties (`{ \"__proto__\": { \"isAdmin\": true } }`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Prototype pollution injects properties into Object.prototype via __proto__. Avoid unsafe recursive deep merges.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 156,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "Why should you hide the X-Powered-By: Express header?",
    "answer": "By default, Express sends `X-Powered-By: Express` in response headers. This reveals your tech stack to automated vulnerability scanners, making it easier for attackers to target known Express and Node.js security CVEs.\nDisable it using `app.disable('x-powered-by')` or `app.use(helmet())`.",
    "memoryModel": "Memory Anchor: app.disable('x-powered-by') hides your tech stack from vulnerability scanners.",
    "difficulty": "Senior",
    "pitch": "In production, Why should you hide the X-Powered-By: Express header centers on first-principles system mechanics. Specifically: By default, Express sends `X-Powered-By: Express` in response headers. This reveals your tech stack to automated vulnerability scanners, making it easier for attackers to target kn...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: app.disable('x-powered-by') hides your tech stack from vulnerability scanners.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 157,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is ReDoS (Regular Expression Denial of Service)?",
    "answer": "ReDoS occurs when a regular expression with catastrophic backtracking (e.g. `/(a+)+$/`) evaluates an evil input string (e.g. `'aaaaaaaaaaaaaaaaaaaaa!'`). The regex engine takes exponential time ($O(2^n)$), pegging the single-threaded CPU at 100% and completely freezing the server.\nPrevention: Avoid nested quantifiers (`(a+)+`), validate regex with `safe-regex`, or enforce execution timeouts.",
    "memoryModel": "Memory Anchor: ReDoS = Evil regex + catastrophic backtracking freezes single thread. Avoid nested quantifiers (a+)+.",
    "difficulty": "Senior",
    "pitch": "In production, What is ReDoS (Regular Expression Denial of Service) centers on first-principles system mechanics. Specifically: ReDoS occurs when a regular expression with catastrophic backtracking (e.g. `/(a+)+$/`) evaluates an evil input string (e.g. `'aaaaaaaaaaaaaaaaaaaaa!'`). The regex engine takes exp...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: ReDoS = Evil regex + catastrophic backtracking freezes single thread. Avoid nested quantifiers (a+)+.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 158,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "How do you manage sensitive environment secrets securely in production?",
    "answer": "1) Never commit `.env` files to git.\n2) Use secret managers in cloud environments (AWS Secrets Manager, HashiCorp Vault, Doppler).\n3) Validate required environment variables at server startup using Zod or `envalid` so the server fails fast if a secret is missing.",
    "memoryModel": "Memory Anchor: Never commit .env to git; validate presence of all required secrets at boot with Zod/envalid.",
    "code": "import { z } from 'zod';\n\nconst envSchema = z.object({\n  NODE_ENV: z.enum(['development', 'production', 'test']),\n  PORT: z.string().default('3000'),\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(32),\n  STRIPE_SECRET_KEY: z.string().startsWith('sk_')\n});\n\nexport const env = envSchema.parse(process.env); // Throws immediately if secret is missing!",
    "difficulty": "Senior",
    "pitch": "In production, How do you manage sensitive environment secrets securely in production centers on first-principles system mechanics. Specifically: 1) Never commit `.env` files to git....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never commit .env to git; validate presence of all required secrets at boot with Zod/envalid.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 159,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is npm audit and how do you protect against supply chain attacks?",
    "answer": "`npm audit` checks your dependency tree against the GitHub Advisory Database for reported CVE vulnerabilities.\nProtection strategies:\n1) Run `npm audit` in CI/CD pipeline.\n2) Use `package-lock.json` with integrity SHA hashes.\n3) Lock dependency versions (avoid reckless `*` or wildcard version ranges).\n4) Use automated tools like Snyk or Dependabot to receive immediate security alerts.",
    "memoryModel": "Memory Anchor: Supply chain defense: npm audit + Dependabot + committed package-lock with SHA-512 integrity hashes.",
    "difficulty": "Senior",
    "pitch": "In production, What is npm audit and how do you protect against supply chain attacks centers on first-principles system mechanics. Specifically: `npm audit` checks your dependency tree against the GitHub Advisory Database for reported CVE vulnerabilities....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Supply chain defense: npm audit + Dependabot + committed package-lock with SHA-512 integrity hashes.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 160,
    "topicId": 10,
    "topicTitle": "10. Security, CORS & Hardening",
    "question": "What is HTTP Parameter Pollution (HPP)?",
    "answer": "HPP occurs when multiple query parameters with the same name are passed (`?role=user&role=admin`). Express converts `req.query.role` into an array: `['user', 'admin']`.\nIf code checks `if (req.query.role === 'admin')`, it fails, but if passed to DB as `{ role: req.query.role }`, it queries `{ role: { $in: ['user', 'admin'] } }`.\nUse `hpp()` middleware to sanitize duplicate parameters.",
    "memoryModel": "Memory Anchor: HPP = Duplicate query params convert to array. Use hpp() middleware to enforce single scalar values.",
    "difficulty": "Senior",
    "pitch": "In production, What is HTTP Parameter Pollution (HPP) centers on first-principles system mechanics. Specifically: HPP occurs when multiple query parameters with the same name are passed (`?role=user&role=admin`). Express converts `req.query.role` into an array: `['user', 'admin']`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: HPP = Duplicate query params convert to array. Use hpp() middleware to enforce single scalar values.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 161,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "What is Multer and why is it needed for file uploads in Express?",
    "answer": "Standard Express body parsers (`express.json()`, `express.urlencoded()`) can only parse text-based formats. File uploads are transmitted using `multipart/form-data`.\nMulter is middleware that parses multipart form data, extracting text fields into `req.body` and binary uploaded files into `req.file` or `req.files`.",
    "memoryModel": "Memory Anchor: Multer parses multipart/form-data, placing text in req.body and uploaded files in req.file.",
    "difficulty": "Senior",
    "pitch": "In production, What is Multer and why is it needed for file uploads in Express centers on first-principles system mechanics. Specifically: Standard Express body parsers (`express.json()`, `express.urlencoded()`) can only parse text-based formats. File uploads are transmitted using `multipart/form-data`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Multer parses multipart/form-data, placing text in req.body and uploaded files in req.file.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 162,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "What is the difference between multer.memoryStorage() and multer.diskStorage()?",
    "answer": "- `memoryStorage()`: Stores uploaded files in memory as `Buffer` objects in `req.file.buffer`. Fast and convenient for direct streaming to AWS S3, but can exhaust server RAM if large files are uploaded concurrently.\n- `diskStorage()`: Writes uploaded files directly to temporary disk storage on the local filesystem (`req.file.path`). Safe against memory exhaustion for large files (videos, archives), but requires manual cleanup of temp files after S3 upload.",
    "memoryModel": "Memory Anchor: memoryStorage = RAM buffer (fast for S3, risky for huge files). diskStorage = Temp files on disk (safe for large files).",
    "comparisonTable": [
      {
        "aspect": "memoryStorage()",
        "detail": "req.file.buffer; zero disk I/O; consumes V8 heap memory."
      },
      {
        "aspect": "diskStorage()",
        "detail": "req.file.path; low memory footprint; requires manual temp file cleanup."
      }
    ],
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between multer.memoryStorage() and multer.diskStorage() centers on first-principles system mechanics. Specifically: - `memoryStorage()`: Stores uploaded files in memory as `Buffer` objects in `req.file.buffer`. Fast and convenient for direct streaming to AWS S3, but can exhaust server RAM if lar...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: memoryStorage = RAM buffer (fast for S3, risky for huge files). diskStorage = Temp files on disk (safe for large files).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 163,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you upload a file directly from Express to AWS S3 using AWS SDK v3?",
    "answer": "Use `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` (`Upload` class). The `Upload` class accepts a stream or Buffer and handles multipart parallel uploads for large files automatically.",
    "memoryModel": "Memory Anchor: Use AWS SDK v3 Upload utility to stream file buffer directly to S3 bucket.",
    "code": "import { S3Client } from '@aws-sdk/client-s3';\nimport { Upload } from '@aws-sdk/lib-storage';\nimport multer from 'multer';\n\nconst upload = multer({ storage: multer.memoryStorage() });\nconst s3Client = new S3Client({ region: 'us-east-1' });\n\napp.post('/api/upload', upload.single('image'), async (req, res) => {\n  const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;\n  \n  const parallelUpload = new Upload({\n    client: s3Client,\n    params: {\n      Bucket: process.env.S3_BUCKET_NAME,\n      Key: fileKey,\n      Body: req.file.buffer,\n      ContentType: req.file.mimetype\n    }\n  });\n\n  const result = await parallelUpload.done();\n  res.json({ url: result.Location, key: fileKey });\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you upload a file directly from Express to AWS S3 using AWS SDK v3 centers on first-principles system mechanics. Specifically: Use `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` (`Upload` class). The `Upload` class accepts a stream or Buffer and handles multipart parallel uploads for large files automatic...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use AWS SDK v3 Upload utility to stream file buffer directly to S3 bucket.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 164,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "Why is uploading files via S3 Pre-signed URLs superior to uploading through your Node.js server?",
    "answer": "Direct-to-server uploads consume your Node server's CPU, RAM, and network bandwidth for the entire duration of the file transfer (a 100 MB upload on a slow client connection ties up your server for minutes).\n**S3 Pre-signed URL pattern**:\n1) Client requests an upload URL: `GET /api/get-upload-url?fileType=image/png`.\n2) Node server creates a secure, temporary pre-signed PUT URL using S3 SDK and returns it.\n3) Client uploads the file **directly from the browser to Amazon S3**, bypassing your server completely. Zero server memory or bandwidth consumed!",
    "memoryModel": "Memory Anchor: Pre-signed URL = Client uploads directly to S3; your Node server uses ZERO bandwidth or RAM.",
    "difficulty": "Senior",
    "pitch": "In production, Why is uploading files via S3 Pre-signed URLs superior to uploading through your Node.js server centers on first-principles system mechanics. Specifically: Direct-to-server uploads consume your Node server's CPU, RAM, and network bandwidth for the entire duration of the file transfer (a 100 MB upload on a slow client connection ties u...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Pre-signed URL = Client uploads directly to S3; your Node server uses ZERO bandwidth or RAM.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 165,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you generate an S3 Pre-signed PUT URL in Node.js?",
    "answer": "Use `getSignedUrl` from `@aws-sdk/s3-request-presigner` and `PutObjectCommand` from `@aws-sdk/client-s3`.",
    "memoryModel": "Memory Anchor: getSignedUrl(s3, PutObjectCommand, { expiresIn: 300 }) generates temporary upload URL.",
    "code": "import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\n\napp.post('/api/presigned-url', authenticateUser, async (req, res) => {\n  const { fileName, fileType } = req.body;\n  const key = `users/${req.user.id}/${Date.now()}-${fileName}`;\n\n  const command = new PutObjectCommand({\n    Bucket: process.env.S3_BUCKET_NAME,\n    Key: key,\n    ContentType: fileType\n  });\n\n  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes validity\n  res.json({ uploadUrl, key });\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you generate an S3 Pre-signed PUT URL in Node.js centers on first-principles system mechanics. Specifically: Use `getSignedUrl` from `@aws-sdk/s3-request-presigner` and `PutObjectCommand` from `@aws-sdk/client-s3`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: getSignedUrl(s3, PutObjectCommand, { expiresIn: 300 }) generates temporary upload URL.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 166,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you validate uploaded files by Magic Numbers (file signatures) instead of trusting file extensions?",
    "answer": "An attacker can rename an executable file `malware.exe` to `photo.jpg`. Checking `req.file.originalname.endsWith('.jpg')` or `req.file.mimetype` is insecure because both are client-supplied headers.\n**Magic Numbers validation**: Inspect the first few binary bytes of the file buffer (e.g. JPEG always begins with `FF D8 FF`, PNG with `89 50 4E 47 0D 0A 1A 0A`, PDF with `%PDF`). Use a library like `file-type` to detect the true binary file type.",
    "memoryModel": "Memory Anchor: Client extensions and mimetypes are easily spoofed. Inspect magic binary bytes using file-type.",
    "code": "import { fileTypeFromBuffer } from 'file-type';\n\nconst mime = await fileTypeFromBuffer(req.file.buffer);\nif (!mime || !['image/jpeg', 'image/png'].includes(mime.mime)) {\n  return res.status(400).json({ error: 'Fraudulent file! Binary magic bytes do not match an image.' });\n}",
    "difficulty": "Mid",
    "pitch": "In production, How do you validate uploaded files by Magic Numbers (file signatures) instead of trusting file extensions centers on first-principles system mechanics. Specifically: An attacker can rename an executable file `malware.exe` to `photo.jpg`. Checking `req.file.originalname.endsWith('.jpg')` or `req.file.mimetype` is insecure because both are client...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Client extensions and mimetypes are easily spoofed. Inspect magic binary bytes using file-type.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 167,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you enforce file size limits in Multer?",
    "answer": "Pass the `limits: { fileSize: bytes }` option in `multer()`. If an uploaded file exceeds this limit, Multer rejects the request with code `'LIMIT_FILE_SIZE'`.",
    "memoryModel": "Memory Anchor: multer({ limits: { fileSize: 5 * 1024 * 1024 } }) enforces 5 MB limit.",
    "code": "const upload = multer({\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max\n  storage: multer.memoryStorage()\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you enforce file size limits in Multer centers on first-principles system mechanics. Specifically: Pass the `limits: { fileSize: bytes }` option in `multer()`. If an uploaded file exceeds this limit, Multer rejects the request with code `'LIMIT_FILE_SIZE'`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: multer({ limits: { fileSize: 5 * 1024 * 1024 } }) enforces 5 MB limit.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 168,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "What is the difference between upload.single(), upload.array(), and upload.fields()?",
    "answer": "- `upload.single('avatar')`: Accepts a single file from the named field; populates `req.file`.\n- `upload.array('photos', 5)`: Accepts an array of files sharing the same field name; populates `req.files`.\n- `upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])`: Accepts multiple different file fields in the same form; populates `req.files` as an object with arrays per field.",
    "memoryModel": "Memory Anchor: single -> req.file; array -> req.files[]; fields -> req.files{ fieldA: [], fieldB: [] }.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between upload.single(), upload.array(), and upload.fields() centers on first-principles system mechanics. Specifically: - `upload.single('avatar')`: Accepts a single file from the named field; populates `req.file`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: single -> req.file; array -> req.files[]; fields -> req.files{ fieldA: [], fieldB: [] }.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 169,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you resize and optimize uploaded images in Node.js before saving?",
    "answer": "Use `sharp`. It is a high-performance C++ image processing library. Stream or pass the uploaded Buffer through Sharp to resize, convert to modern WebP/AVIF format, and strip EXIF metadata (which may leak GPS coordinates).",
    "memoryModel": "Memory Anchor: Use sharp to resize, compress to WebP, and strip location EXIF data from images.",
    "code": "import sharp from 'sharp';\n\nconst optimizedBuffer = await sharp(req.file.buffer)\n  .resize(800, 800, { fit: 'inside', withoutEnlargement: true })\n  .webp({ quality: 80 })\n  .toBuffer();",
    "difficulty": "Senior",
    "pitch": "In production, How do you resize and optimize uploaded images in Node.js before saving centers on first-principles system mechanics. Specifically: Use `sharp`. It is a high-performance C++ image processing library. Stream or pass the uploaded Buffer through Sharp to resize, convert to modern WebP/AVIF format, and strip EXIF m...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use sharp to resize, compress to WebP, and strip location EXIF data from images.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 170,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you prevent Directory Traversal attacks in file downloads?",
    "answer": "If a download route serves files based on user input (`app.get('/download/:file')`), an attacker can pass `../../etc/passwd` to read sensitive server files.\nPrevention:\n1) Use `path.basename(req.params.file)` to strip directory slashes.\n2) Resolve absolute path with `path.resolve()` and verify it starts with your intended root directory (`filePath.startsWith(PUBLIC_DIR)`).",
    "memoryModel": "Memory Anchor: path.basename() strips ../ traversal attempts. Verify resolved path stays inside allowed root dir.",
    "code": "const safeFileName = path.basename(req.params.filename);\nconst targetPath = path.resolve(UPLOADS_DIR, safeFileName);\nif (!targetPath.startsWith(UPLOADS_DIR)) {\n  return res.status(403).json({ error: 'Access denied: Directory traversal detected' });\n}",
    "difficulty": "Senior",
    "pitch": "In production, How do you prevent Directory Traversal attacks in file downloads centers on first-principles system mechanics. Specifically: If a download route serves files based on user input (`app.get('/download/:file')`), an attacker can pass `../../etc/passwd` to read sensitive server files....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: path.basename() strips ../ traversal attempts. Verify resolved path stays inside allowed root dir.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 171,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you stream a file directly from S3 to an Express HTTP response?",
    "answer": "Call `s3Client.send(new GetObjectCommand({ Bucket, Key }))`. The returned `response.Body` is a Readable stream in Node.js. Pipe it directly to `res`: `response.Body.pipe(res)`.",
    "memoryModel": "Memory Anchor: GetObjectCommand returns readable stream in Body. Pipe directly to Express res.",
    "code": "const command = new GetObjectCommand({ Bucket: 'my-bucket', Key: req.params.key });\nconst s3Response = await s3Client.send(command);\nres.setHeader('Content-Type', s3Response.ContentType);\ns3Response.Body.pipe(res);",
    "difficulty": "Senior",
    "pitch": "In production, How do you stream a file directly from S3 to an Express HTTP response centers on first-principles system mechanics. Specifically: Call `s3Client.send(new GetObjectCommand({ Bucket, Key }))`. The returned `response.Body` is a Readable stream in Node.js. Pipe it directly to `res`: `response.Body.pipe(res)`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: GetObjectCommand returns readable stream in Body. Pipe directly to Express res.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 172,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "Why is storing uploaded user files in the local server directory dangerous in containerized apps?",
    "answer": "1) **Ephemeral Containers**: Docker containers / Kubernetes pods are recreated on deployments; local disk storage is wiped out and files are permanently lost.\n2) **Horizontal Scaling**: If an app runs on 3 load-balanced instances, a file uploaded to Instance A will return 404 when requested by a user routed to Instance B.\nAlways use cloud object storage (AWS S3, Google Cloud Storage, Cloudflare R2) for persistent files.",
    "memoryModel": "Memory Anchor: Local storage is lost on Docker restarts and broken on multi-instance clusters. Always store uploads in S3.",
    "difficulty": "Senior",
    "pitch": "In production, Why is storing uploaded user files in the local server directory dangerous in containerized apps centers on first-principles system mechanics. Specifically: 1) Ephemeral Containers: Docker containers / Kubernetes pods are recreated on deployments; local disk storage is wiped out and files are permanently lost....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Local storage is lost on Docker restarts and broken on multi-instance clusters. Always store uploads in S3.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 173,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you handle Multer errors cleanly in Express?",
    "answer": "Multer throws specific error instances (`multer.MulterError`). Inspect `err instanceof multer.MulterError` in your error handler to return user-friendly messages for `'LIMIT_FILE_SIZE'`, `'LIMIT_UNEXPECTED_FILE'`, etc.",
    "memoryModel": "Memory Anchor: Catch err instanceof multer.MulterError and return 400 with clean error message.",
    "code": "app.use((err, req, res, next) => {\n  if (err instanceof multer.MulterError) {\n    if (err.code === 'LIMIT_FILE_SIZE') {\n      return res.status(400).json({ error: 'File too large! Maximum limit is 5MB.' });\n    }\n    return res.status(400).json({ error: `Upload error: ${err.message}` });\n  }\n  next(err);\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you handle Multer errors cleanly in Express centers on first-principles system mechanics. Specifically: Multer throws specific error instances (`multer.MulterError`). Inspect `err instanceof multer.MulterError` in your error handler to return user-friendly messages for `'LIMIT_FILE_S...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Catch err instanceof multer.MulterError and return 400 with clean error message.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 174,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "What is Busboy and how does it compare to Multer?",
    "answer": "Busboy is the low-level, high-performance streaming multipart parser that Multer is built upon. While Multer buffers or writes to disk, Busboy allows you to process individual file chunks as pure streams the instant they arrive over the network, achieving maximum memory efficiency for extreme high-throughput pipelines.",
    "memoryModel": "Memory Anchor: Busboy is the low-level streaming engine underneath Multer.",
    "difficulty": "Senior",
    "pitch": "In production, What is Busboy and how does it compare to Multer centers on first-principles system mechanics. Specifically: Busboy is the low-level, high-performance streaming multipart parser that Multer is built upon. While Multer buffers or writes to disk, Busboy allows you to process individual file...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Busboy is the low-level streaming engine underneath Multer.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 175,
    "topicId": 11,
    "topicTitle": "11. File Uploads & S3/Multer",
    "question": "How do you scan uploaded files for viruses and malware in Node.js?",
    "answer": "Pass the uploaded file buffer or stream to a ClamAV daemon (`clamscan`) or cloud scanning service (AWS GuardDuty, VirusTotal API) before making the file publicly accessible or saving to permanent storage.",
    "memoryModel": "Memory Anchor: Pipe uploaded files to ClamAV scanner before saving to production storage.",
    "difficulty": "Senior",
    "pitch": "In production, How do you scan uploaded files for viruses and malware in Node.js centers on first-principles system mechanics. Specifically: Pass the uploaded file buffer or stream to a ClamAV daemon (`clamscan`) or cloud scanning service (AWS GuardDuty, VirusTotal API) before making the file publicly accessible or savi...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Pipe uploaded files to ClamAV scanner before saving to production storage.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 176,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is Supertest and how does it test Express applications without listening on a live port?",
    "answer": "Supertest is an integration testing library for HTTP servers built on SuperAgent. You pass your Express `app` instance directly to `supertest(app)`: under the hood, Supertest starts an ephemeral Node HTTP server on an unassigned random ephemeral port, dispatches HTTP requests, asserts on response status and headers, and tears down the socket connection automatically after each test.",
    "memoryModel": "Memory Anchor: supertest(app) spins up an ephemeral test server on random port and makes real HTTP calls without manual server.listen().",
    "code": "import request from 'supertest';\nimport app from '../src/app';\n\ndescribe('GET /api/health', () => {\n  it('returns 200 with status healthy', async () => {\n    const res = await request(app)\n      .get('/api/health')\n      .expect('Content-Type', /json/)\n      .expect(200);\n\n    expect(res.body.status).toBe('healthy');\n  });\n});",
    "difficulty": "Senior",
    "pitch": "In production, What is Supertest and how does it test Express applications without listening on a live port centers on first-principles system mechanics. Specifically: Supertest is an integration testing library for HTTP servers built on SuperAgent. You pass your Express `app` instance directly to `supertest(app)`: under the hood, Supertest start...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: supertest(app) spins up an ephemeral test server on random port and makes real HTTP calls without manual server.listen().",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 177,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "Why should you separate app.js (Express app definition) from server.js (server.listen)?",
    "answer": "If `server.listen(3000)` is inside the same file as your Express routes (`app.js`), importing `app` into your Jest or Vitest test suites will attempt to bind to port 3000. When running multiple test files in parallel, this causes `EADDRINUSE: address already in use` crashes.\nFix: Define middleware and routes in `app.js` and export `app`. Only call `app.listen()` inside `server.js`.",
    "memoryModel": "Memory Anchor: Separate app.js (routes) from server.js (listen) to prevent EADDRINUSE port collisions in tests.",
    "difficulty": "Senior",
    "pitch": "In production, Why should you separate app.js (Express app definition) from server.js (server.listen) centers on first-principles system mechanics. Specifically: If `server.listen(3000)` is inside the same file as your Express routes (`app.js`), importing `app` into your Jest or Vitest test suites will attempt to bind to port 3000. When run...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Separate app.js (routes) from server.js (listen) to prevent EADDRINUSE port collisions in tests.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 178,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is the difference between Unit Tests and Integration Tests in a Node.js backend?",
    "answer": "- **Unit Tests**: Test a single isolated function or class (e.g. password validator or tax calculator) in isolation, mocking all external dependencies (database, Redis, third-party APIs).\n- **Integration Tests**: Test the interaction between multiple architectural layers together (e.g. testing `POST /api/auth/register` with real Express middleware, input validation, and a real in-memory MongoDB/Testcontainer database).",
    "memoryModel": "Memory Anchor: Unit = Isolated function with mocks. Integration = Express route + DB interacting together.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between Unit Tests and Integration Tests in a Node.js backend centers on first-principles system mechanics. Specifically: - Unit Tests: Test a single isolated function or class (e.g. password validator or tax calculator) in isolation, mocking all external dependencies (database, Redis, third-party API...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Unit = Isolated function with mocks. Integration = Express route + DB interacting together.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 179,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you test authenticated endpoints with Supertest?",
    "answer": "Generate a mock JWT token signed with your test environment's `JWT_SECRET` and pass it in the `Authorization` header using `.set('Authorization', `Bearer ${token}`)`.",
    "memoryModel": "Memory Anchor: Generate valid test JWT -> .set('Authorization', `Bearer ${token}`).",
    "code": "test('GET /api/user/profile requires authentication', async () => {\n  const token = jwt.sign({ userId: 'u_123', role: 'admin' }, process.env.JWT_SECRET);\n  \n  const res = await request(app)\n    .get('/api/user/profile')\n    .set('Authorization', `Bearer ${token}`)\n    .expect(200);\n\n  expect(res.body.userId).toBe('u_123');\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you test authenticated endpoints with Supertest centers on first-principles system mechanics. Specifically: Generate a mock JWT token signed with your test environment's `JWT_SECRET` and pass it in the `Authorization` header using `.set('Authorization', `Bearer ${token}`)`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Generate valid test JWT -> .set('Authorization', `Bearer ${token}`).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 180,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you test database operations in integration tests (In-Memory vs Testcontainers)?",
    "answer": "- **In-Memory (mongodb-memory-server / SQLite)**: Extremely fast, zero Docker dependency. Great for unit/integration tests, but might lack specific production DB features (JSONB operators in PostgreSQL).\n- **Testcontainers**: Automatically spins up real Docker containers (real PostgreSQL, MySQL, Redis) during test startup and terminates them on test completion. Exactly matches production DB behavior.",
    "memoryModel": "Memory Anchor: mongodb-memory-server = ultra-fast in-memory DB. Testcontainers = real Docker containers matching production.",
    "difficulty": "Senior",
    "pitch": "In production, How do you test database operations in integration tests (In-Memory vs Testcontainers) centers on first-principles system mechanics. Specifically: - In-Memory (mongodb-memory-server / SQLite): Extremely fast, zero Docker dependency. Great for unit/integration tests, but might lack specific production DB features (JSONB operat...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: mongodb-memory-server = ultra-fast in-memory DB. Testcontainers = real Docker containers matching production.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Mocked DB Route Test (Shallow)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Mocks the database query functions. Proves zero confidence in actual SQL schema syntax.",
        "code": "// Mocks everything: false confidence\nvi.mock('../db', () => ({ query: vi.fn().mockResolvedValue([]) }));"
      },
      {
        "title": "Approach 2: Supertest with Transaction Rollback (Optimal)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Runs against an isolated real test database inside a transaction that is rolled back in afterEach().",
        "code": "describe('POST /api/users', () => {\n  let conn;\n  beforeEach(async () => {\n    conn = await pool.getConnection();\n    await conn.beginTransaction();\n  });\n  afterEach(async () => {\n    await conn.rollback();\n    conn.release();\n  });\n  it('creates user in DB', async () => {\n    await request(app).post('/api/users').send({ email: 'a@b.com' }).expect(201);\n  });\n});"
      }
    ]
  },
  {
    "id": 181,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you mock third-party external APIs (Stripe, Twilio, AWS) in Jest/Vitest?",
    "answer": "Never make live network calls to third-party APIs in automated test suites (flaky, consumes API credits, fails offline).\nMock using:\n1) Jest module mocks: `jest.mock('stripe')` or `jest.spyOn(stripeClient.paymentIntents, 'create').mockResolvedValue(...)`.\n2) Network interception with **MSW (Mock Service Worker)** or **Nock**.",
    "memoryModel": "Memory Anchor: Mock third-party APIs with Nock or Jest module spies to avoid flaky external network calls.",
    "difficulty": "Mid",
    "pitch": "In production, How do you mock third-party external APIs (Stripe, Twilio, AWS) in Jest/Vitest centers on first-principles system mechanics. Specifically: Never make live network calls to third-party APIs in automated test suites (flaky, consumes API credits, fails offline)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Mock third-party APIs with Nock or Jest module spies to avoid flaky external network calls.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 182,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you test file upload routes with Supertest?",
    "answer": "Use Supertest's `.attach('fieldName', 'path/to/test-file.jpg')` method to simulate a `multipart/form-data` file upload.",
    "memoryModel": "Memory Anchor: request(app).post('/upload').attach('avatar', './fixtures/avatar.png') tests Multer uploads.",
    "code": "test('POST /api/upload uploads an avatar', async () => {\n  const res = await request(app)\n    .post('/api/upload')\n    .attach('avatar', path.resolve(__dirname, 'fixtures/sample.png'))\n    .field('userId', 'user_123')\n    .expect(200);\n\n  expect(res.body.url).toBeDefined();\n});",
    "difficulty": "Senior",
    "pitch": "In production, How do you test file upload routes with Supertest centers on first-principles system mechanics. Specifically: Use Supertest's `.attach('fieldName', 'path/to/test-file.jpg')` method to simulate a `multipart/form-data` file upload....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: request(app).post('/upload').attach('avatar', './fixtures/avatar.png') tests Multer uploads.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 183,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is the difference between jest.fn(), jest.spyOn(), and jest.mock()?",
    "answer": "- `jest.fn()`: Creates a new, standalone mock function that records calls and arguments.\n- `jest.spyOn(object, 'method')`: Wraps an existing method on an object, tracking calls while optionally preserving or mocking the original implementation (`mockRestore()` restores original).\n- `jest.mock('module-name')`: Automatically replaces an entire imported module with mock functions.",
    "memoryModel": "Memory Anchor: jest.fn() = blank mock function; jest.spyOn() = spy on existing method; jest.mock() = mock whole module.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between jest.fn(), jest.spyOn(), and jest.mock() centers on first-principles system mechanics. Specifically: - `jest.fn()`: Creates a new, standalone mock function that records calls and arguments....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: jest.fn() = blank mock function; jest.spyOn() = spy on existing method; jest.mock() = mock whole module.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 184,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you clean up database state between tests to guarantee test isolation?",
    "answer": "In `beforeEach()` or `afterEach()`, purge all collections or truncate tables (`await User.deleteMany({})` or run within a rollback transaction) so tests never depend on the execution order or state of previous tests.",
    "memoryModel": "Memory Anchor: Always clean database collections in afterEach() or beforeEach() for test isolation.",
    "difficulty": "Senior",
    "pitch": "In production, How do you clean up database state between tests to guarantee test isolation centers on first-principles system mechanics. Specifically: In `beforeEach()` or `afterEach()`, purge all collections or truncate tables (`await User.deleteMany({})` or run within a rollback transaction) so tests never depend on the executi...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Always clean database collections in afterEach() or beforeEach() for test isolation.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 185,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is Test Coverage and what do Statement, Branch, Function, and Line coverage mean?",
    "answer": "- **Statement Coverage**: Percentage of code statements executed.\n- **Branch Coverage**: Percentage of conditional branches (`if/else`, switch cases, ternary) tested. (Most critical for catching edge cases!).\n- **Function Coverage**: Percentage of defined functions called.\n- **Line Coverage**: Percentage of executable lines hit during tests.",
    "memoryModel": "Memory Anchor: Branch coverage is most important because it tests both true and false paths of if/else logic.",
    "difficulty": "Senior",
    "pitch": "In production, What is Test Coverage and what do Statement, Branch, Function, and Line coverage mean centers on first-principles system mechanics. Specifically: - Statement Coverage: Percentage of code statements executed....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Branch coverage is most important because it tests both true and false paths of if/else logic.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 186,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you test custom Express Error Handling middleware?",
    "answer": "Pass a mock `err`, `req`, `res`, and `next` object with `jest.fn()` to the error middleware and assert that `res.status()` and `res.json()` were invoked with expected status codes and sanitized error envelopes.",
    "memoryModel": "Memory Anchor: Pass mock req, res (with status/json spies) directly to error middleware function.",
    "difficulty": "Senior",
    "pitch": "In production, How do you test custom Express Error Handling middleware centers on first-principles system mechanics. Specifically: Pass a mock `err`, `req`, `res`, and `next` object with `jest.fn()` to the error middleware and assert that `res.status()` and `res.json()` were invoked with expected status codes ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Pass mock req, res (with status/json spies) directly to error middleware function.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 187,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "Why should you avoid testing private methods directly?",
    "answer": "Testing private internal methods couples your tests to implementation details. When you refactor private helper functions, tests break even though public behavior is unchanged. Test public API endpoints and interfaces; private methods are tested naturally through public paths.",
    "memoryModel": "Memory Anchor: Test public behavior, not private implementation details. Refactoring shouldn't break tests.",
    "difficulty": "Senior",
    "pitch": "In production, Why should you avoid testing private methods directly centers on first-principles system mechanics. Specifically: Testing private internal methods couples your tests to implementation details. When you refactor private helper functions, tests break even though public behavior is unchanged. Tes...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Test public behavior, not private implementation details. Refactoring shouldn't break tests.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 188,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is Contract Testing and how does Pact work in microservices?",
    "answer": "Contract testing verifies that two separate services (e.g. Frontend client and Node.js microservice) can communicate with each other according to an agreed-upon contract (schema, status codes, payload). Tools like Pact test contracts without needing both services running concurrently.",
    "memoryModel": "Memory Anchor: Contract testing (Pact) validates that API producer and consumer schemas remain compatible.",
    "difficulty": "Senior",
    "pitch": "In production, What is Contract Testing and how does Pact work in microservices centers on first-principles system mechanics. Specifically: Contract testing verifies that two separate services (e.g. Frontend client and Node.js microservice) can communicate with each other according to an agreed-upon contract (schema, s...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Contract testing (Pact) validates that API producer and consumer schemas remain compatible.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 189,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "How do you run tests with code coverage in Jest/Vitest?",
    "answer": "Pass the `--coverage` flag (`jest --coverage` or `vitest run --coverage`). It generates visual HTML reports (in `coverage/lcov-report/index.html`) highlighting unexecuted lines and untested branches in red.",
    "memoryModel": "Memory Anchor: jest --coverage generates statement, branch, and line metrics with visual HTML reports.",
    "difficulty": "Senior",
    "pitch": "In production, How do you run tests with code coverage in Jest/Vitest centers on first-principles system mechanics. Specifically: Pass the `--coverage` flag (`jest --coverage` or `vitest run --coverage`). It generates visual HTML reports (in `coverage/lcov-report/index.html`) highlighting unexecuted lines and...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: jest --coverage generates statement, branch, and line metrics with visual HTML reports.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 190,
    "topicId": 12,
    "topicTitle": "12. Backend Testing & Supertest",
    "question": "What is a Smoke Test vs a Regression Test in backend deployments?",
    "answer": "- **Smoke Test**: A fast, minimal suite of critical checks (e.g. `/health`, database connection check, user login) run immediately after deployment to verify the build is stable.\n- **Regression Test**: A comprehensive suite verifying that recent bug fixes or new features haven't broken previously functioning behavior.",
    "memoryModel": "Memory Anchor: Smoke test = Fast sanity check right after deploy. Regression test = Comprehensive suite checking nothing broke.",
    "difficulty": "Senior",
    "pitch": "In production, What is a Smoke Test vs a Regression Test in backend deployments centers on first-principles system mechanics. Specifically: - Smoke Test: A fast, minimal suite of critical checks (e.g. `/health`, database connection check, user login) run immediately after deployment to verify the build is stable....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Smoke test = Fast sanity check right after deploy. Regression test = Comprehensive suite checking nothing broke.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 191,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "Why use TypeScript for Node.js backend development?",
    "answer": "TypeScript brings static typing to Node.js, catching runtime errors (`TypeError: Cannot read property of undefined`) at compile time, providing rich IDE autocomplete, enforcing strict API request/response contracts, and making large enterprise codebases self-documenting and refactor-safe.",
    "memoryModel": "Memory Anchor: TypeScript eliminates runtime undefined errors and enforces strict data contracts across the codebase.",
    "difficulty": "Senior",
    "pitch": "In production, Why use TypeScript for Node.js backend development centers on first-principles system mechanics. Specifically: TypeScript brings static typing to Node.js, catching runtime errors (`TypeError: Cannot read property of undefined`) at compile time, providing rich IDE autocomplete, enforcing str...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: TypeScript eliminates runtime undefined errors and enforces strict data contracts across the codebase.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 192,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "How do you augment the Express Request interface in TypeScript to include req.user?",
    "answer": "Use **Declaration Merging**. Create a declaration file (e.g. `src/types/express.d.ts`) that declares namespace `Express` and augments the `Request` interface with your custom `user` property.",
    "memoryModel": "Memory Anchor: Use declaration merging in express.d.ts: declare global { namespace Express { interface Request { user?: User; } } }",
    "code": "// src/types/express.d.ts\nimport { UserPayload } from '../modules/auth/auth.types';\n\ndeclare global {\n  namespace Express {\n    interface Request {\n      user?: UserPayload;\n      requestId?: string;\n    }\n  }\n}\nexport {};",
    "difficulty": "Senior",
    "pitch": "In production, How do you augment the Express Request interface in TypeScript to include req.user centers on first-principles system mechanics. Specifically: Use Declaration Merging. Create a declaration file (e.g. `src/types/express.d.ts`) that declares namespace `Express` and augments the `Request` interface with your custom `user` pr...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use declaration merging in express.d.ts: declare global { namespace Express { interface Request { user?: User; } } }",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 193,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What are the essential tsconfig.json compiler options for a production Node.js backend?",
    "answer": "Key settings:\n- `target: 'ES2022'`: Modern JS output.\n- `module: 'NodeNext'` or `'CommonJS'`.\n- `moduleResolution: 'NodeNext'`.\n- `strict: true`: Enables strict null checks and type constraints.\n- `outDir: './dist'`: Output directory.\n- `rootDir: './src'`: Source directory.\n- `esModuleInterop: true`: Enables clean default imports for CommonJS modules.\n- `skipLibCheck: true`: Skips type checking of declaration files for faster builds.",
    "memoryModel": "Memory Anchor: strict: true, target: ES2022, moduleResolution: NodeNext, esModuleInterop: true, outDir: ./dist.",
    "difficulty": "Senior",
    "pitch": "In production, What are the essential tsconfig.json compiler options for a production Node.js backend centers on first-principles system mechanics. Specifically: Key settings:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: strict: true, target: ES2022, moduleResolution: NodeNext, esModuleInterop: true, outDir: ./dist.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 194,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is the difference between ts-node, tsx, and compiling with tsc?",
    "answer": "- `tsc`: The official TypeScript compiler. Compiles `.ts` files to plain `.js` in `/dist` for production deployment.\n- `ts-node`: JIT TypeScript execution for development. Can be slow on large codebases.\n- `tsx`: A modern, ultra-fast development runner powered by esbuild. Instantly executes TS without type-checking overhead.",
    "memoryModel": "Memory Anchor: tsx = Fast dev runner with esbuild; tsc = Type checking & production build output.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between ts-node, tsx, and compiling with tsc centers on first-principles system mechanics. Specifically: - `tsc`: The official TypeScript compiler. Compiles `.ts` files to plain `.js` in `/dist` for production deployment....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: tsx = Fast dev runner with esbuild; tsc = Type checking & production build output.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 195,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "How do you strictly type Express Route Handlers in TypeScript?",
    "answer": "Use Express generic types: `RequestHandler<Params, ResBody, ReqBody, ReqQuery>`. This guarantees that `req.params`, `req.body`, and `req.query` are strictly typed inside the controller.",
    "memoryModel": "Memory Anchor: RequestHandler<Params, ResBody, ReqBody, ReqQuery> strictly types all 4 request properties.",
    "code": "import { RequestHandler } from 'express';\n\ninterface CreateUserBody {\n  email: string;\n  name: string;\n}\n\ninterface UserResponse {\n  id: string;\n  email: string;\n}\n\nexport const createUser: RequestHandler<{}, UserResponse, CreateUserBody> = async (req, res) => {\n  const { email, name } = req.body; // TS knows email and name are strings!\n  res.status(201).json({ id: '1', email });\n};",
    "difficulty": "Senior",
    "pitch": "In production, How do you strictly type Express Route Handlers in TypeScript centers on first-principles system mechanics. Specifically: Use Express generic types: `RequestHandler<Params, ResBody, ReqBody, ReqQuery>`. This guarantees that `req.params`, `req.body`, and `req.query` are strictly typed inside the contro...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: RequestHandler<Params, ResBody, ReqBody, ReqQuery> strictly types all 4 request properties.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 196,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "Why is compile-time TypeScript validation insufficient for incoming HTTP request bodies?",
    "answer": "TypeScript types are completely erased at compile time (Zero Runtime Footprint). If an attacker sends `{ \"age\": \"not-a-number\" }`, TypeScript cannot stop it at runtime. You MUST pair TypeScript with a **runtime schema validator** like Zod, Joi, or TypeBox to validate incoming payloads before processing.",
    "memoryModel": "Memory Anchor: TS types disappear at runtime! Always validate incoming HTTP payloads with Zod at runtime.",
    "difficulty": "Mid",
    "pitch": "In production, Why is compile-time TypeScript validation insufficient for incoming HTTP request bodies centers on first-principles system mechanics. Specifically: TypeScript types are completely erased at compile time (Zero Runtime Footprint). If an attacker sends `{ \"age\": \"not-a-number\" }`, TypeScript cannot stop it at runtime. You MUST pa...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: TS types disappear at runtime! Always validate incoming HTTP payloads with Zod at runtime.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 197,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "How do you infer TypeScript types directly from a Zod schema (Single Source of Truth)?",
    "answer": "Define your validation schema using Zod, then infer the static TypeScript interface using `z.infer<typeof Schema>`. This eliminates duplicate code and guarantees that runtime validation and static types are always 100% in sync.",
    "memoryModel": "Memory Anchor: z.infer<typeof Schema> derives TypeScript types from runtime Zod schemas with zero duplication.",
    "code": "import { z } from 'zod';\n\nexport const CreateProductSchema = z.object({\n  title: z.string().min(3),\n  price: z.number().positive(),\n  tags: z.array(z.string()).default([])\n});\n\n// Infer TypeScript type:\nexport type CreateProductInput = z.infer<typeof CreateProductSchema>;",
    "difficulty": "Senior",
    "pitch": "In production, How do you infer TypeScript types directly from a Zod schema (Single Source of Truth) centers on first-principles system mechanics. Specifically: Define your validation schema using Zod, then infer the static TypeScript interface using `z.infer<typeof Schema>`. This eliminates duplicate code and guarantees that runtime valid...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: z.infer<typeof Schema> derives TypeScript types from runtime Zod schemas with zero duplication.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 198,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "How do you type an async Express middleware that passes custom errors?",
    "answer": "Import `ErrorRequestHandler` from `express`. It enforces the 4 arguments: `(err: Error, req: Request, res: Response, next: NextFunction)`.",
    "memoryModel": "Memory Anchor: Use ErrorRequestHandler type from express for typing 4-parameter error middleware.",
    "difficulty": "Senior",
    "pitch": "In production, How do you type an async Express middleware that passes custom errors centers on first-principles system mechanics. Specifically: Import `ErrorRequestHandler` from `express`. It enforces the 4 arguments: `(err: Error, req: Request, res: Response, next: NextFunction)`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use ErrorRequestHandler type from express for typing 4-parameter error middleware.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 199,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is the difference between any and unknown in backend TypeScript?",
    "answer": "- `any`: Completely disables type checking. Allows arbitrary property access and function calls, defeating TypeScript's purpose.\n- `unknown`: Type-safe counter-part. Tells TS 'I don't know what this data is yet' (e.g. parsed JSON from external API). You MUST narrow or validate the type with `typeof`, `instanceof`, or Zod before using it.",
    "memoryModel": "Memory Anchor: Never use any for external data. Use unknown and narrow it via runtime validation.",
    "difficulty": "Senior",
    "pitch": "In production, What is the difference between any and unknown in backend TypeScript centers on first-principles system mechanics. Specifically: - `any`: Completely disables type checking. Allows arbitrary property access and function calls, defeating TypeScript's purpose....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never use any for external data. Use unknown and narrow it via runtime validation.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 200,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is Generics in TypeScript and how do you write a generic Database Repository in Node?",
    "answer": "Generics allow classes and functions to work with a variety of data types while preserving type safety. A generic `BaseRepository<T>` can perform CRUD operations (`findById(id): Promise<T | null>`) for any database model.",
    "memoryModel": "Memory Anchor: BaseRepository<T> provides typed CRUD methods for any entity model.",
    "code": "export class BaseRepository<T extends { id: string }> {\n  constructor(private model: any) {}\n\n  async findById(id: string): Promise<T | null> {\n    return this.model.findOne({ id });\n  }\n\n  async create(data: Partial<T>): Promise<T> {\n    return this.model.create(data);\n  }\n}",
    "difficulty": "Senior",
    "pitch": "In production, What is Generics in TypeScript and how do you write a generic Database Repository in Node centers on first-principles system mechanics. Specifically: Generics allow classes and functions to work with a variety of data types while preserving type safety. A generic `BaseRepository<T>` can perform CRUD operations (`findById(id): Pr...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: BaseRepository<T> provides typed CRUD methods for any entity model.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 201,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What are Decorators in TypeScript and how are they used in NestJS / TypeORM?",
    "answer": "Decorators are special declarations prefixed with `@` that attach metadata to classes, methods, accessors, or properties. They use the `Reflect Metadata` API to implement dependency injection (`@Injectable()`), route mapping (`@Get('/users')`), and database column definitions (`@Column()`).",
    "memoryModel": "Memory Anchor: Decorators (@Get, @Injectable) attach reflection metadata to classes and methods for DI and routing.",
    "difficulty": "Staff",
    "pitch": "In production, What are Decorators in TypeScript and how are they used in NestJS / TypeORM centers on first-principles system mechanics. Specifically: Decorators are special declarations prefixed with `@` that attach metadata to classes, methods, accessors, or properties. They use the `Reflect Metadata` API to implement dependenc...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Decorators (@Get, @Injectable) attach reflection metadata to classes and methods for DI and routing.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 202,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is the Satisfies operator in TypeScript 4.9+?",
    "answer": "The `satisfies` operator validates that an expression matches a type contract without widening the resulting type, preserving exact literal types and autocompletion for object properties.",
    "memoryModel": "Memory Anchor: satisfies checks type conformance without widening specific string literal types.",
    "difficulty": "Staff",
    "pitch": "In production, What is the Satisfies operator in TypeScript 4.9+ centers on first-principles system mechanics. Specifically: The `satisfies` operator validates that an expression matches a type contract without widening the resulting type, preserving exact literal types and autocompletion for object prop...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: satisfies checks type conformance without widening specific string literal types.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 203,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "How do you handle path aliases (@/services/...) in TypeScript and production builds?",
    "answer": "Configure `compilerOptions.paths` in `tsconfig.json` (`\"@/*\": [\"src/*\"]`).\nGotcha: `tsc` does NOT rewrite path aliases in the compiled JS output! For production builds, you must use a tool like `tsconfig-paths`, `tsc-alias`, or bundle with esbuild/webpack to rewrite aliases to relative paths.",
    "memoryModel": "Memory Anchor: Path aliases (@/...) in tsconfig require tsc-alias or esbuild to rewrite paths in dist/ build.",
    "difficulty": "Staff",
    "pitch": "In production, How do you handle path aliases (@/services/...) in TypeScript and production builds centers on first-principles system mechanics. Specifically: Configure `compilerOptions.paths` in `tsconfig.json` (`\"@/*\": [\"src/*\"]`)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Path aliases (@/...) in tsconfig require tsc-alias or esbuild to rewrite paths in dist/ build.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 204,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is Const Assertion (as const) in TypeScript?",
    "answer": "Applying `as const` locks an object or array into a read-only literal type, preventing mutations and narrowing all primitive properties to their exact literal values. Commonly used for configuration objects and constant lookup maps.",
    "memoryModel": "Memory Anchor: as const makes objects deeply read-only and narrows strings to exact literal unions.",
    "difficulty": "Staff",
    "pitch": "In production, What is Const Assertion (as const) in TypeScript centers on first-principles system mechanics. Specifically: Applying `as const` locks an object or array into a read-only literal type, preventing mutations and narrowing all primitive properties to their exact literal values. Commonly used...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: as const makes objects deeply read-only and narrows strings to exact literal unions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 205,
    "topicId": 13,
    "topicTitle": "13. Node.js with TypeScript",
    "question": "What is the difference between type and interface in Node.js TypeScript?",
    "answer": "- `interface`: Extensible, supports declaration merging (ideal for library types and Express Request augmentation).\n- `type`: Can represent unions, intersections, primitives, tuples, and mapped types. Cannot be reopened for declaration merging.",
    "memoryModel": "Memory Anchor: interface for extensible object contracts; type for unions, intersections, and complex utility types.",
    "difficulty": "Staff",
    "pitch": "In production, What is the difference between type and interface in Node.js TypeScript centers on first-principles system mechanics. Specifically: - `interface`: Extensible, supports declaration merging (ideal for library types and Express Request augmentation)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: interface for extensible object contracts; type for unions, intersections, and complex utility types.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 206,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is the Cluster module in Node.js and how does it scale across CPU cores?",
    "answer": "Because Node runs on a single thread, a server with 16 CPU cores only utilizes 1 core by default. The `node:cluster` module forks multiple child processes (workers) sharing the same server port. The primary (master) process listens on the port and distributes incoming TCP connections among worker processes using round-robin scheduling (on Linux/macOS).",
    "memoryModel": "Memory Anchor: Cluster forks 1 process per CPU core sharing the same port with round-robin load distribution.",
    "code": "import cluster from 'node:cluster';\nimport http from 'node:http';\nimport os from 'node:os';\n\nconst numCPUs = os.cpus().length;\n\nif (cluster.isPrimary) {\n  console.log(`Primary ${process.pid} is running. Forking ${numCPUs} workers...`);\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n\n  cluster.on('exit', (worker) => {\n    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);\n    cluster.fork();\n  });\n} else {\n  http.createServer((req, res) => res.end('Served by worker!')).listen(3000);\n}",
    "difficulty": "Staff",
    "pitch": "In production, What is the Cluster module in Node.js and how does it scale across CPU cores centers on first-principles system mechanics. Specifically: Because Node runs on a single thread, a server with 16 CPU cores only utilizes 1 core by default. The `node:cluster` module forks multiple child processes (workers) sharing the sam...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Cluster forks 1 process per CPU core sharing the same port with round-robin load distribution.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 207,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is the difference between the Cluster module and Worker Threads (worker_threads)?",
    "answer": "- **Cluster module**: Multi-Process. Each worker has its own separate OS process, its own V8 instance, and its own isolated memory heap (~30 MB per process). Communication happens via IPC. Best for scaling I/O across CPU cores.\n- **Worker Threads (`worker_threads`)**: Multi-Thread. Threads run within the SAME OS process and can share memory using `SharedArrayBuffer`. Best for offloading CPU-intensive computational tasks (crypto, image/video encoding, machine learning) without blocking the main event loop.",
    "memoryModel": "Memory Anchor: Cluster = Separate processes with isolated memory (multi-core HTTP). Worker Threads = Threads sharing same process memory (CPU compute).",
    "comparisonTable": [
      {
        "aspect": "Cluster",
        "detail": "Multiple OS processes; isolated memory heaps; ideal for multi-core HTTP throughput."
      },
      {
        "aspect": "Worker Threads",
        "detail": "Threads within single process; shared memory (SharedArrayBuffer); ideal for CPU-bound computations."
      }
    ],
    "difficulty": "Staff",
    "pitch": "In production, What is the difference between the Cluster module and Worker Threads (worker_threads) centers on first-principles system mechanics. Specifically: - Cluster module: Multi-Process. Each worker has its own separate OS process, its own V8 instance, and its own isolated memory heap (~30 MB per process). Communication happens via ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Cluster = Separate processes with isolated memory (multi-core HTTP). Worker Threads = Threads sharing same process memory (CPU compute).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 208,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "How do you communicate between the primary process and workers in Cluster?",
    "answer": "Using Inter-Process Communication (IPC): `worker.send(message)` and `process.on('message', callback)`. Node serializes messages via JSON over internal pipes.",
    "memoryModel": "Memory Anchor: IPC via worker.send() and process.on('message').",
    "difficulty": "Staff",
    "pitch": "In production, How do you communicate between the primary process and workers in Cluster centers on first-principles system mechanics. Specifically: Using Inter-Process Communication (IPC): `worker.send(message)` and `process.on('message', callback)`. Node serializes messages via JSON over internal pipes....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: IPC via worker.send() and process.on('message').",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 209,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is PM2 and how does PM2 Cluster Mode work in production?",
    "answer": "PM2 is a production process manager for Node.js. Running `pm2 start server.js -i max` automatically detects all available CPU cores, forks worker processes using the Node cluster module, performs zero-downtime rolling reloads (`pm2 reload all`), restarts crashed workers automatically, and aggregates logs.",
    "memoryModel": "Memory Anchor: pm2 start server.js -i max forks workers across all CPU cores with zero-downtime reloads.",
    "difficulty": "Staff",
    "pitch": "In production, What is PM2 and how does PM2 Cluster Mode work in production centers on first-principles system mechanics. Specifically: PM2 is a production process manager for Node.js. Running `pm2 start server.js -i max` automatically detects all available CPU cores, forks worker processes using the Node cluster m...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: pm2 start server.js -i max forks workers across all CPU cores with zero-downtime reloads.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 210,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "How do you implement a Worker Thread to execute heavy CPU tasks?",
    "answer": "Instantiate `new Worker('./worker.js', { workerData })`. Communicate via `parentPort.postMessage()` and `worker.on('message')`.",
    "memoryModel": "Memory Anchor: new Worker() offloads heavy CPU tasks off the main event loop.",
    "code": "// main.js\nimport { Worker } from 'node:worker_threads';\n\nfunction runHeavyTask(data) {\n  return new Promise((resolve, reject) => {\n    const worker = new Worker('./worker.js', { workerData: data });\n    worker.on('message', resolve);\n    worker.on('error', reject);\n  });\n}\n\n// worker.js\nimport { parentPort, workerData } from 'node:worker_threads';\nconst result = heavyCalculation(workerData);\nparentPort.postMessage(result);",
    "difficulty": "Staff",
    "pitch": "In production, How do you implement a Worker Thread to execute heavy CPU tasks centers on first-principles system mechanics. Specifically: Instantiate `new Worker('./worker.js', { workerData })`. Communicate via `parentPort.postMessage()` and `worker.on('message')`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: new Worker() offloads heavy CPU tasks off the main event loop.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 211,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What are SharedArrayBuffer and Atomics in Node.js Worker Threads?",
    "answer": "`SharedArrayBuffer` allows multiple worker threads to read and write to the exact same shared binary memory segment simultaneously without copying data over IPC.\n`Atomics` provides atomic operations (`Atomics.add`, `Atomics.compareExchange`, `Atomics.wait`) to prevent race conditions when multiple threads read/write the shared buffer.",
    "memoryModel": "Memory Anchor: SharedArrayBuffer shares memory across threads; Atomics prevents race conditions.",
    "difficulty": "Staff",
    "pitch": "In production, What are SharedArrayBuffer and Atomics in Node.js Worker Threads centers on first-principles system mechanics. Specifically: `SharedArrayBuffer` allows multiple worker threads to read and write to the exact same shared binary memory segment simultaneously without copying data over IPC....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: SharedArrayBuffer shares memory across threads; Atomics prevents race conditions.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 212,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is a Worker Pool and why shouldn't you spawn a new Worker Thread for every request?",
    "answer": "Creating a new Worker Thread incurs overhead (~few milliseconds and memory allocation for the new V8 context). Spawning 1,000 threads for 1,000 requests will exhaust server memory.\nA **Worker Pool** (e.g. `piscina`) maintains a fixed pool of pre-warmed, reusable worker threads, assigning incoming computational tasks to idle workers via a queue.",
    "memoryModel": "Memory Anchor: Never spawn workers on demand. Use a pre-warmed Worker Pool (Piscina) to reuse threads.",
    "difficulty": "Staff",
    "pitch": "In production, What is a Worker Pool and why shouldn't you spawn a new Worker Thread for every request centers on first-principles system mechanics. Specifically: Creating a new Worker Thread incurs overhead (~few milliseconds and memory allocation for the new V8 context). Spawning 1,000 threads for 1,000 requests will exhaust server memory....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Never spawn workers on demand. Use a pre-warmed Worker Pool (Piscina) to reuse threads.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 213,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is the child_process module, and what are exec, execFile, spawn, and fork?",
    "answer": "- `spawn()`: Streams command output in real-time via streams. Ideal for long-running processes or large data.\n- `exec()`: Runs command in a shell and buffers the entire output in memory (default 1MB limit). Vulnerable to shell injection if user input is passed!\n- `execFile()`: Runs executable directly without invoking a shell. Faster and safer from shell injection.\n- `fork()`: Special spawn variation that spawns a new Node.js process with a built-in IPC communication channel.",
    "memoryModel": "Memory Anchor: spawn = streaming; exec = buffered in shell; execFile = safe no-shell executable; fork = new Node process with IPC.",
    "difficulty": "Staff",
    "pitch": "In production, What is the child_process module, and what are exec, execFile, spawn, and fork centers on first-principles system mechanics. Specifically: - `spawn()`: Streams command output in real-time via streams. Ideal for long-running processes or large data....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: spawn = streaming; exec = buffered in shell; execFile = safe no-shell executable; fork = new Node process with IPC.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 214,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "How can child_process.exec() lead to Command Injection vulnerabilities?",
    "answer": "Because `exec()` spawns a system shell (`/bin/sh` or `cmd.exe`), passing unvalidated user input (`exec('ping ' + req.query.ip)`) allows an attacker to inject shell metacharacters: `127.0.0.1; rm -rf /`.\nFix: Use `child_process.execFile()` or `spawn()` with arguments passed as an array of literal strings (`execFile('ping', [req.query.ip])`).",
    "memoryModel": "Memory Anchor: exec() invokes a shell (vulnerable to ; rm -rf). Use execFile() with string arrays.",
    "difficulty": "Staff",
    "pitch": "In production, How can child_process.exec() lead to Command Injection vulnerabilities centers on first-principles system mechanics. Specifically: Because `exec()` spawns a system shell (`/bin/sh` or `cmd.exe`), passing unvalidated user input (`exec('ping ' + req.query.ip)`) allows an attacker to inject shell metacharacters: ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: exec() invokes a shell (vulnerable to ; rm -rf). Use execFile() with string arrays.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 215,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What is Zero-Downtime Reload in Node.js clustering?",
    "answer": "When deploying new code, rather than killing all processes simultaneously (which drops active user connections), zero-downtime reload restarts workers sequentially one-by-one:\n1) Send `SIGTERM` to Worker 1.\n2) Wait for Worker 1 to finish serving current requests and close.\n3) Fork new Worker 1 with updated code.\n4) Wait until new Worker 1 is listening, then repeat for Worker 2.",
    "memoryModel": "Memory Anchor: Zero-downtime reloads restart workers one by one so traffic is always served.",
    "difficulty": "Staff",
    "pitch": "In production, What is Zero-Downtime Reload in Node.js clustering centers on first-principles system mechanics. Specifically: When deploying new code, rather than killing all processes simultaneously (which drops active user connections), zero-downtime reload restarts workers sequentially one-by-one:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Zero-downtime reloads restart workers one by one so traffic is always served.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 216,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "How does session state behave in a clustered Node.js application?",
    "answer": "Because each cluster worker has its own isolated memory heap, in-memory sessions (`req.session` stored in local JS objects) will fail: a user authenticated on Worker 1 will be prompted to log in again when their next request is routed to Worker 2!\nFix: Use a shared external session store (Redis) so all cluster workers read/write the same session data.",
    "memoryModel": "Memory Anchor: In-memory sessions break across cluster workers. You must use shared Redis for session state.",
    "difficulty": "Staff",
    "pitch": "In production, How does session state behave in a clustered Node.js application centers on first-principles system mechanics. Specifically: Because each cluster worker has its own isolated memory heap, in-memory sessions (`req.session` stored in local JS objects) will fail: a user authenticated on Worker 1 will be prom...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: In-memory sessions break across cluster workers. You must use shared Redis for session state.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 217,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What are MessageChannel and MessagePort in worker threads?",
    "answer": "`MessageChannel` creates an asynchronous, two-way communication channel with two entangled `MessagePort`s (`port1` and `port2`). It allows direct thread-to-thread communication without routing messages through the primary parent thread.",
    "memoryModel": "Memory Anchor: MessageChannel creates two paired ports for direct thread-to-thread communication.",
    "difficulty": "Staff",
    "pitch": "In production, What are MessageChannel and MessagePort in worker threads centers on first-principles system mechanics. Specifically: `MessageChannel` creates an asynchronous, two-way communication channel with two entangled `MessagePort`s (`port1` and `port2`). It allows direct thread-to-thread communication wit...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: MessageChannel creates two paired ports for direct thread-to-thread communication.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 218,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "What happens if an unhandled error occurs in a Worker Thread?",
    "answer": "The worker thread emits an `'error'` event and terminates. The main process does NOT crash unless you fail to handle the worker's `'error'` listener. The main process should catch the error and spawn a replacement worker if necessary.",
    "memoryModel": "Memory Anchor: Worker thread crashes emit 'error' event; main thread survives if error listener is attached.",
    "difficulty": "Staff",
    "pitch": "In production, What happens if an unhandled error occurs in a Worker Thread centers on first-principles system mechanics. Specifically: The worker thread emits an `'error'` event and terminates. The main process does NOT crash unless you fail to handle the worker's `'error'` listener. The main process should catch ...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Worker thread crashes emit 'error' event; main thread survives if error listener is attached.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 219,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "How does Node.js cluster distribute incoming connections (SO_REUSEPORT vs round-robin)?",
    "answer": "On Windows and Linux, the primary process by default accepts incoming connections and distributes handles to workers using a round-robin algorithm (`cluster.schedulingPolicy = cluster.SCHED_RR`), preventing connection imbalance where one worker starves while others are saturated.",
    "memoryModel": "Memory Anchor: Round-robin scheduling distributes connections evenly across workers to prevent worker starvation.",
    "difficulty": "Staff",
    "pitch": "In production, How does Node.js cluster distribute incoming connections (SO_REUSEPORT vs round-robin) centers on first-principles system mechanics. Specifically: On Windows and Linux, the primary process by default accepts incoming connections and distributes handles to workers using a round-robin algorithm (`cluster.schedulingPolicy = clus...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Round-robin scheduling distributes connections evenly across workers to prevent worker starvation.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 220,
    "topicId": 14,
    "topicTitle": "14. Clustering & Worker Threads",
    "question": "When should you use Microservices over Node Clustering?",
    "answer": "Clustering scales an application across CPU cores on a **single physical machine**. When traffic exceeds the capacity of a single server, you must scale horizontally across **multiple server nodes** using Docker containers, Kubernetes, or serverless functions managed by an external Load Balancer (AWS ALB, Nginx).",
    "memoryModel": "Memory Anchor: Cluster scales on 1 machine; Microservices/Containers scale horizontally across multiple machines.",
    "difficulty": "Staff",
    "pitch": "In production, When should you use Microservices over Node Clustering centers on first-principles system mechanics. Specifically: Clustering scales an application across CPU cores on a single physical machine. When traffic exceeds the capacity of a single server, you must scale horizontally across multiple se...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Cluster scales on 1 machine; Microservices/Containers scale horizontally across multiple machines.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 221,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is a Memory Leak in Node.js and what are the most common causes?",
    "answer": "A memory leak occurs when memory allocated on the V8 heap is no longer needed by the application but is not released by the garbage collector because references to it remain accessible from the GC root.\nCommon causes:\n1) **Forgotten Event Listeners**: Adding `.on()` listeners inside per-request handlers without `.removeListener()`.\n2) **Global Variables & Caches**: Appending to unbounded global arrays/maps without eviction or TTL.\n3) **Closures**: Functions retaining references to large parent scopes.\n4) **Unclosed Streams & Sockets**: Forgotten timers (`setInterval`) and unclosed database sockets.",
    "memoryModel": "Memory Anchor: Memory leak = Unreleased memory holding references from GC root. Culprits: unremoved listeners, unbounded caches, unclosed timers.",
    "difficulty": "Staff",
    "pitch": "In production, What is a Memory Leak in Node.js and what are the most common causes centers on first-principles system mechanics. Specifically: A memory leak occurs when memory allocated on the V8 heap is no longer needed by the application but is not released by the garbage collector because references to it remain access...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Memory leak = Unreleased memory holding references from GC root. Culprits: unremoved listeners, unbounded caches, unclosed timers.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 222,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How do you take and analyze a Heap Snapshot in Node.js using Chrome DevTools?",
    "answer": "1) Start Node with the inspect flag: `node --inspect server.js`.\n2) Open Google Chrome at `chrome://inspect` and click 'Inspect'.\n3) Navigate to the **Memory** tab and click 'Take Snapshot'.\n4) Perform a load test (using Autocannon) and take a second snapshot.\n5) Switch view from 'Summary' to 'Comparison' between Snapshot 1 and Snapshot 2: inspect objects with growing 'Delta' and high 'Retained Size'.",
    "memoryModel": "Memory Anchor: node --inspect -> chrome://inspect -> Take snapshot -> Compare growth delta in Memory tab.",
    "difficulty": "Staff",
    "pitch": "In production, How do you take and analyze a Heap Snapshot in Node.js using Chrome DevTools centers on first-principles system mechanics. Specifically: 1) Start Node with the inspect flag: `node --inspect server.js`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: node --inspect -> chrome://inspect -> Take snapshot -> Compare growth delta in Memory tab.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 223,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is the difference between Shallow Size and Retained Size in memory profiling?",
    "answer": "- **Shallow Size**: The amount of memory directly held by the object itself (usually just the bytes for its immediate properties and pointer references).\n- **Retained Size**: The total amount of memory that would be **freed if this object were deleted and garbage collected** (includes all child objects reachable solely through this object). When hunting memory leaks, always sort by highest Retained Size!",
    "memoryModel": "Memory Anchor: Shallow = Size of the object alone. Retained = Size of object + all dependent objects it keeps alive.",
    "difficulty": "Staff",
    "pitch": "In production, What is the difference between Shallow Size and Retained Size in memory profiling centers on first-principles system mechanics. Specifically: - Shallow Size: The amount of memory directly held by the object itself (usually just the bytes for its immediate properties and pointer references)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Shallow = Size of the object alone. Retained = Size of object + all dependent objects it keeps alive.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 224,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How can closures cause subtle memory leaks in Node.js?",
    "answer": "If an inner function references a variable in an outer scope, V8 retains the entire lexical environment context of that scope. If the inner function is kept alive (e.g. attached to a global timer or callback), all large objects declared in the outer scope cannot be garbage collected.",
    "memoryModel": "Memory Anchor: Closures retain their entire enclosing lexical scope context as long as the function is reachable.",
    "difficulty": "Staff",
    "pitch": "In production, How can closures cause subtle memory leaks in Node.js centers on first-principles system mechanics. Specifically: If an inner function references a variable in an outer scope, V8 retains the entire lexical environment context of that scope. If the inner function is kept alive (e.g. attached to...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Closures retain their entire enclosing lexical scope context as long as the function is reachable.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 225,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How do you profile CPU bottlenecks and event loop lag in Node.js?",
    "answer": "1) Built-in V8 CPU Profiler: `node --prof server.js`. Process ticks with `node --prof-process isolate-*.log > processed.txt`.\n2) Clinic.js: `clinic doctor -- node server.js` (generates visual graphs of Event Loop delay, CPU usage, and memory).\n3) Flamegraphs: Visualizes which functions occupy the most CPU call stack time.",
    "memoryModel": "Memory Anchor: Profile CPU via node --prof or Clinic.js (clinic flame) to identify functions blocking the loop.",
    "difficulty": "Staff",
    "pitch": "In production, How do you profile CPU bottlenecks and event loop lag in Node.js centers on first-principles system mechanics. Specifically: 1) Built-in V8 CPU Profiler: `node --prof server.js`. Process ticks with `node --prof-process isolate-*.log > processed.txt`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Profile CPU via node --prof or Clinic.js (clinic flame) to identify functions blocking the loop.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Manual Process Restart on Memory Growth (Crude)",
        "timeComplexity": "N/A",
        "spaceComplexity": "O(N)",
        "explanation": "Simply uses PM2 max-memory-restart to bounce workers when RAM exceeds 1GB. Masks the underlying leak.",
        "code": "// pm2.config.js\nmodule.exports = { apps: [{ script: 'app.js', max_memory_restart: '1G' }] };"
      },
      {
        "title": "Approach 2: 3-Snapshot Comparison Profiling & Heap Stream Dump (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Takes heap snapshots before, during, and after traffic, sorting by # Delta in Chrome DevTools to locate the exact retainer.",
        "code": "import v8 from 'node:v8';\nimport fs from 'node:fs';\n\nexport function dumpHeapOnLeak(thresholdMB = 1024) {\n  if (process.memoryUsage().heapUsed / 1024 / 1024 > thresholdMB) {\n    v8.getHeapSnapshot().pipe(fs.createWriteStream(`leak-${Date.now()}.heapsnapshot`));\n  }\n}"
      }
    ]
  },
  {
    "id": 226,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is Event Loop Lag and how do you monitor it?",
    "answer": "Event loop lag is the delay between when an asynchronous callback was scheduled to execute and when the event loop actually got around to invoking it (caused by synchronous code hogging the main thread).\nMonitor it using `perf_hooks.monitorEventLoopDelay({ resolution: 10 })` to measure percentile lag (`p50`, `p99`).",
    "memoryModel": "Memory Anchor: Event loop lag = Delay in executing callbacks. Monitor via perf_hooks.monitorEventLoopDelay().",
    "code": "import { monitorEventLoopDelay } from 'node:perf_hooks';\n\nconst histogram = monitorEventLoopDelay({ resolution: 20 });\nhistogram.enable();\n\nsetInterval(() => {\n  console.log('Event Loop Lag p99 (ms):', (histogram.percentile(99) / 1e6).toFixed(2));\n}, 5000);",
    "difficulty": "Staff",
    "pitch": "In production, What is Event Loop Lag and how do you monitor it centers on first-principles system mechanics. Specifically: Event loop lag is the delay between when an asynchronous callback was scheduled to execute and when the event loop actually got around to invoking it (caused by synchronous code ho...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Event loop lag = Delay in executing callbacks. Monitor via perf_hooks.monitorEventLoopDelay().",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 227,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How do you implement an in-memory cache safely without creating a memory leak?",
    "answer": "Never use a plain JavaScript object or unbounded Map (`cache[key] = val`) without eviction. Always use a **Least Recently Used (LRU) Cache** (e.g. `lru-cache`) with a strict `max` item count and `ttl` (Time to Live). When max items are reached, the least recently used entries are automatically evicted.",
    "memoryModel": "Memory Anchor: Unbounded Map = Guaranteed memory leak! Always use LRU Cache with strict max items and TTL.",
    "code": "import { LRUCache } from 'lru-cache';\n\nconst cache = new LRUCache({\n  max: 500, // Maximum 500 items\n  ttl: 1000 * 60 * 5 // 5 minutes TTL\n});",
    "difficulty": "Staff",
    "pitch": "In production, How do you implement an in-memory cache safely without creating a memory leak centers on first-principles system mechanics. Specifically: Never use a plain JavaScript object or unbounded Map (`cache[key] = val`) without eviction. Always use a Least Recently Used (LRU) Cache (e.g. `lru-cache`) with a strict `max` item...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Unbounded Map = Guaranteed memory leak! Always use LRU Cache with strict max items and TTL.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 228,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "Why is JSON.parse() dangerous for large inputs in high-throughput servers?",
    "answer": "`JSON.parse()` and `JSON.stringify()` run strictly synchronously on the main thread. Parsing a 50 MB JSON payload takes 200–500ms, completely blocking the Event Loop and stalling all other concurrent users.\nFix: Validate max payload limits with `express.json({ limit: '1mb' })`, or use streaming JSON parsers (e.g. `stream-json`) for massive datasets.",
    "memoryModel": "Memory Anchor: Synchronous JSON.parse() blocks event loop on large payloads. Limit body sizes to 1MB.",
    "difficulty": "Staff",
    "pitch": "In production, Why is JSON.parse() dangerous for large inputs in high-throughput servers centers on first-principles system mechanics. Specifically: `JSON.parse()` and `JSON.stringify()` run strictly synchronously on the main thread. Parsing a 50 MB JSON payload takes 200–500ms, completely blocking the Event Loop and stalling a...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Synchronous JSON.parse() blocks event loop on large payloads. Limit body sizes to 1MB.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 229,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is HTTP Response Compression and how does the compression middleware work?",
    "answer": "The `compression()` middleware compresses outgoing HTTP response bodies using Gzip or Brotli before sending them over the wire. It inspects the client's `Accept-Encoding: gzip, br` header and reduces JSON/HTML payload size by up to 70–80%, significantly speeding up response times for clients.",
    "memoryModel": "Memory Anchor: compression() middleware compresses responses with Gzip/Brotli, reducing bandwidth by 70%.",
    "difficulty": "Staff",
    "pitch": "In production, What is HTTP Response Compression and how does the compression middleware work centers on first-principles system mechanics. Specifically: The `compression()` middleware compresses outgoing HTTP response bodies using Gzip or Brotli before sending them over the wire. It inspects the client's `Accept-Encoding: gzip, br`...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: compression() middleware compresses responses with Gzip/Brotli, reducing bandwidth by 70%.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 230,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is Database Connection Pooling and why is opening a new connection per request an anti-pattern?",
    "answer": "Establishing a database TCP connection involves network handshakes, TLS negotiation, and database authentication (~50–150ms).\nA connection pool maintains a set of pre-opened, active database connections. When a request arrives, it borrows an idle connection from the pool and returns it when done, reducing latency to <1ms.",
    "memoryModel": "Memory Anchor: Connection pool reuses pre-opened DB connections, eliminating expensive TCP/TLS handshake latency.",
    "difficulty": "Staff",
    "pitch": "In production, What is Database Connection Pooling and why is opening a new connection per request an anti-pattern centers on first-principles system mechanics. Specifically: Establishing a database TCP connection involves network handshakes, TLS negotiation, and database authentication (~50–150ms)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Connection pool reuses pre-opened DB connections, eliminating expensive TCP/TLS handshake latency.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 231,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is process.memoryUsage() and what do its 4 metrics mean?",
    "answer": "- `rss (Resident Set Size)`: Total physical RAM allocated to the Node process (includes C++ bindings, code, and V8 heap).\n- `heapTotal`: Total memory allocated by V8 for the JavaScript heap.\n- `heapUsed`: Actual memory currently occupied by JavaScript objects.\n- `external`: Memory bound to C++ objects (e.g. Buffers).",
    "memoryModel": "Memory Anchor: rss = Total physical RAM; heapTotal = Allocated V8 heap; heapUsed = Live JS objects; external = Buffers.",
    "difficulty": "Staff",
    "pitch": "In production, What is process.memoryUsage() and what do its 4 metrics mean centers on first-principles system mechanics. Specifically: - `rss (Resident Set Size)`: Total physical RAM allocated to the Node process (includes C++ bindings, code, and V8 heap)....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: rss = Total physical RAM; heapTotal = Allocated V8 heap; heapUsed = Live JS objects; external = Buffers.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 232,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How do you load test a Node.js API to identify bottlenecks (Autocannon / k6)?",
    "answer": "Run `autocannon -c 100 -d 30 https://api.mysite.com/products` (100 concurrent connections for 30 seconds). Measure requests per second (req/sec), latency percentiles (p50, p95, p99), and monitor CPU/RAM usage to pinpoint performance thresholds.",
    "memoryModel": "Memory Anchor: Use Autocannon or k6 to measure p99 latency and req/sec under heavy concurrent load.",
    "difficulty": "Staff",
    "pitch": "In production, How do you load test a Node.js API to identify bottlenecks (Autocannon / k6) centers on first-principles system mechanics. Specifically: Run `autocannon -c 100 -d 30 https://api.mysite.com/products` (100 concurrent connections for 30 seconds). Measure requests per second (req/sec), latency percentiles (p50, p95, p99...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Use Autocannon or k6 to measure p99 latency and req/sec under heavy concurrent load.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 233,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is the N+1 Query Problem in ORMs and how do you fix it?",
    "answer": "The N+1 problem occurs when querying a parent collection of N items causes the ORM to execute 1 query for the parent plus N individual queries for each child (e.g. 100 posts trigger 101 DB queries).\nFix: Use SQL `JOIN`s or batch loading with DataLoader / Mongoose `populate()` in a single query.",
    "memoryModel": "Memory Anchor: N+1 problem = 1 query triggers N separate queries. Fix via SQL JOINs or DataLoader batching.",
    "difficulty": "Staff",
    "pitch": "In production, What is the N+1 Query Problem in ORMs and how do you fix it centers on first-principles system mechanics. Specifically: The N+1 problem occurs when querying a parent collection of N items causes the ORM to execute 1 query for the parent plus N individual queries for each child (e.g. 100 posts trigge...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: N+1 problem = 1 query triggers N separate queries. Fix via SQL JOINs or DataLoader batching.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 234,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "How does Node.js handle DNS resolution caching, and why can dns.lookup cause bottlenecks?",
    "answer": "`dns.lookup()` uses the underlying OS `getaddrinfo()` system call, which is synchronous and runs on Libuv's 4 thread pool threads. High volume outbound HTTP requests can exhaust the 4 threads, queueing all file I/O and DNS lookups.\nFix: Use `dns.resolve()` or an HTTP agent with a DNS cache (e.g. `agentkeepalive`).",
    "memoryModel": "Memory Anchor: dns.lookup uses Libuv thread pool; high volume outbound requests can starve the 4 threads.",
    "difficulty": "Staff",
    "pitch": "In production, How does Node.js handle DNS resolution caching, and why can dns.lookup cause bottlenecks centers on first-principles system mechanics. Specifically: `dns.lookup()` uses the underlying OS `getaddrinfo()` system call, which is synchronous and runs on Libuv's 4 thread pool threads. High volume outbound HTTP requests can exhaust th...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: dns.lookup uses Libuv thread pool; high volume outbound requests can starve the 4 threads.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 235,
    "topicId": 15,
    "topicTitle": "15. Performance & Memory Leaks",
    "question": "What is Fastify and why is it faster than Express?",
    "answer": "Fastify achieves higher throughput than Express through:\n1) Fast schema-based JSON serialization (using `fast-json-stringify` which compiles JSON serializing functions based on JSON schema).\n2) Radix-tree based routing (find-my-way).\n3) Reduced object allocation and lower GC pressure.",
    "memoryModel": "Memory Anchor: Fastify is faster than Express due to pre-compiled JSON schema stringification and radix-tree routing.",
    "difficulty": "Staff",
    "pitch": "In production, What is Fastify and why is it faster than Express centers on first-principles system mechanics. Specifically: Fastify achieves higher throughput than Express through:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Fastify is faster than Express due to pre-compiled JSON schema stringification and radix-tree routing.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 236,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is Graceful Shutdown and how do you implement it for SIGTERM and SIGINT?",
    "answer": "When Kubernetes or Docker stops a container, it sends `SIGTERM`. If the process terminates instantly (`process.exit()`), in-flight database transactions are aborted, files are corrupted, and active user requests receive 502 errors.\n**Graceful Shutdown sequence**:\n1) Stop accepting new connections (`server.close()`).\n2) Wait for active HTTP requests to complete (with a 10s fallback timeout).\n3) Close database pools (`mongoose.disconnect()`, `db.end()`).\n4) Close Redis and message queue connections.\n5) Exit cleanly with `process.exit(0)`.",
    "memoryModel": "Memory Anchor: SIGTERM: Stop accepting new requests (server.close) -> wait for in-flight requests -> close DB/Redis pools -> exit(0).",
    "code": "const shutdown = async (signal) => {\n  logger.info(`Received ${signal}. Starting graceful shutdown...`);\n  \n  // 1. Stop accepting new connections:\n  server.close(async () => {\n    logger.info('HTTP server closed. Closing DB connections...');\n    try {\n      await mongoose.connection.close(false);\n      await redisClient.quit();\n      logger.info('Graceful shutdown completed successfully.');\n      process.exit(0);\n    } catch (err) {\n      logger.error('Error during shutdown:', err);\n      process.exit(1);\n    }\n  });\n\n  // Force shutdown after 10s timeout:\n  setTimeout(() => {\n    logger.error('Forced shutdown due to timeout!');\n    process.exit(1);\n  }, 10000).unref();\n};\n\nprocess.on('SIGTERM', () => shutdown('SIGTERM'));\nprocess.on('SIGINT', () => shutdown('SIGINT'));",
    "difficulty": "Staff",
    "pitch": "In production, What is Graceful Shutdown and how do you implement it for SIGTERM and SIGINT centers on first-principles system mechanics. Specifically: When Kubernetes or Docker stops a container, it sends `SIGTERM`. If the process terminates instantly (`process.exit()`), in-flight database transactions are aborted, files are corr...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: SIGTERM: Stop accepting new requests (server.close) -> wait for in-flight requests -> close DB/Redis pools -> exit(0).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 237,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What are Liveness and Readiness Probes in Kubernetes/Docker health checks?",
    "answer": "- **Liveness Probe** (`/health/live`): Checks if the Node process is running. If it returns 500 or times out, Kubernetes assumes the process is deadlocked and restarts the container.\n- **Readiness Probe** (`/health/ready`): Checks if the app is ready to accept user traffic (verifies database and Redis connections are established). If it returns 500, Kubernetes temporarily stops routing traffic to this pod without killing it.",
    "memoryModel": "Memory Anchor: Liveness = Is process alive? (restart if dead). Readiness = Can it accept traffic right now? (route traffic if ready).",
    "code": "app.get('/health/live', (req, res) => res.status(200).json({ status: 'live' }));\n\napp.get('/health/ready', async (req, res) => {\n  const isDbConnected = mongoose.connection.readyState === 1;\n  const isRedisConnected = redisClient.isReady;\n\n  if (isDbConnected && isRedisConnected) {\n    return res.status(200).json({ status: 'ready' });\n  }\n  res.status(503).json({ status: 'unavailable', db: isDbConnected, redis: isRedisConnected });\n});",
    "difficulty": "Staff",
    "pitch": "In production, What are Liveness and Readiness Probes in Kubernetes/Docker health checks centers on first-principles system mechanics. Specifically: - Liveness Probe (`/health/live`): Checks if the Node process is running. If it returns 500 or times out, Kubernetes assumes the process is deadlocked and restarts the container....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Liveness = Is process alive? (restart if dead). Readiness = Can it accept traffic right now? (route traffic if ready).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 238,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "Why is console.log() an anti-pattern in production, and why should you use Pino or Winston?",
    "answer": "`console.log()` is synchronous when printing to terminal/files, blocking the main thread during heavy logging, and outputs unstructured plain text that cannot be indexed.\nProduction loggers like **Pino** or **Winston**:\n1) Output structured **JSON** logs easily parsed by Datadog, Elasticsearch, and CloudWatch.\n2) Provide log levels (`trace`, `debug`, `info`, `warn`, `error`).\n3) Pino logs asynchronously using extreme-speed worker threads with zero event loop lag.",
    "memoryModel": "Memory Anchor: console.log blocks thread and outputs plain text. Pino outputs structured JSON asynchronously at extreme speed.",
    "difficulty": "Staff",
    "pitch": "In production, Why is console.log() an anti-pattern in production, and why should you use Pino or Winston centers on first-principles system mechanics. Specifically: `console.log()` is synchronous when printing to terminal/files, blocking the main thread during heavy logging, and outputs unstructured plain text that cannot be indexed....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: console.log blocks thread and outputs plain text. Pino outputs structured JSON asynchronously at extreme speed.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 239,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is Correlation ID (Request ID) tracking and how do you implement it across distributed services?",
    "answer": "A Correlation ID is a unique UUID generated for an incoming HTTP request (or extracted from `X-Correlation-ID`). It is injected into all log entries and forwarded in headers to downstream microservices, allowing engineers to trace a single user action across 10 distributed services in Datadog/Kibana.",
    "memoryModel": "Memory Anchor: Correlation ID (UUID) is attached to all logs and forwarded to downstream APIs to trace a request across services.",
    "difficulty": "Staff",
    "pitch": "In production, What is Correlation ID (Request ID) tracking and how do you implement it across distributed services centers on first-principles system mechanics. Specifically: A Correlation ID is a unique UUID generated for an incoming HTTP request (or extracted from `X-Correlation-ID`). It is injected into all log entries and forwarded in headers to dow...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Correlation ID (UUID) is attached to all logs and forwarded to downstream APIs to trace a request across services.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 240,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "How do you design a Dockerfile for a production Node.js application?",
    "answer": "Follow production Docker best practices:\n1) Use **Multi-stage builds** (Stage 1 compiles TS, Stage 2 copies only `/dist` and production `node_modules`).\n2) Use slim Alpine base image (`node:20-alpine`).\n3) Run as non-root user (`USER node`).\n4) Copy `package*.json` before source code to leverage Docker layer caching.\n5) Use `npm ci --omit=dev` to exclude devDependencies.",
    "memoryModel": "Memory Anchor: Multi-stage build + Alpine image + non-root USER node + npm ci --omit=dev.",
    "difficulty": "Staff",
    "pitch": "In production, How do you design a Dockerfile for a production Node.js application centers on first-principles system mechanics. Specifically: Follow production Docker best practices:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Multi-stage build + Alpine image + non-root USER node + npm ci --omit=dev.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 241,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is the Circuit Breaker pattern and when should you use it in Node.js?",
    "answer": "When a downstream microservice or payment gateway is down, repeatedly sending requests causes connection timeouts and exhausts your server's socket pools.\nA **Circuit Breaker** (e.g. `opossum`) monitors failures. If failure rate exceeds 50%, it **trips open**, immediately failing subsequent calls with a fallback without waiting for timeouts. Periodically it enters **half-open** state to test if the service has recovered.",
    "memoryModel": "Memory Anchor: Circuit Breaker trips open on downstream failures, failing fast to protect server resources until service recovers.",
    "difficulty": "Staff",
    "pitch": "In production, What is the Circuit Breaker pattern and when should you use it in Node.js centers on first-principles system mechanics. Specifically: When a downstream microservice or payment gateway is down, repeatedly sending requests causes connection timeouts and exhausts your server's socket pools....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Circuit Breaker trips open on downstream failures, failing fast to protect server resources until service recovers.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 242,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is the difference between Message Queues (BullMQ/RabbitMQ) and HTTP API calls for background tasks?",
    "answer": "- **HTTP API calls**: Synchronous, fragile. If the receiving service is offline, the operation is lost unless manually retried.\n- **Message Queues**: Asynchronous, persistent. Tasks are saved in Redis (BullMQ) or RabbitMQ broker. Workers pull tasks at their own pace, with automatic retries, concurrency limits, and zero dropped jobs during traffic spikes.",
    "memoryModel": "Memory Anchor: Message queues buffer tasks reliably with retries, decoupling producers from consumer traffic spikes.",
    "difficulty": "Staff",
    "pitch": "In production, What is the difference between Message Queues (BullMQ/RabbitMQ) and HTTP API calls for background tasks centers on first-principles system mechanics. Specifically: - HTTP API calls: Synchronous, fragile. If the receiving service is offline, the operation is lost unless manually retried....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Message queues buffer tasks reliably with retries, decoupling producers from consumer traffic spikes.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 243,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "How do you implement Scheduled Cron Jobs reliably across multiple server instances?",
    "answer": "Running `node-cron` on 4 load-balanced server instances executes the same cron job 4 times simultaneously (causing duplicate emails or billing)!\nFix: Use a centralized distributed job scheduler (e.g. **BullMQ Repeatable Jobs** or **Agenda** with Redis/MongoDB distributed locking) so only ONE worker instance executes the job at any scheduled time.",
    "memoryModel": "Memory Anchor: node-cron runs on every instance; use BullMQ repeatable jobs with Redis distributed locks for cluster cron jobs.",
    "difficulty": "Staff",
    "pitch": "In production, How do you implement Scheduled Cron Jobs reliably across multiple server instances centers on first-principles system mechanics. Specifically: Running `node-cron` on 4 load-balanced server instances executes the same cron job 4 times simultaneously (causing duplicate emails or billing)!...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: node-cron runs on every instance; use BullMQ repeatable jobs with Redis distributed locks for cluster cron jobs.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 244,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is 12-Factor App methodology for modern Node.js cloud applications?",
    "answer": "A set of 12 best practices for cloud-native software:\n- Store config in environment variables.\n- Explicitly declare and isolate dependencies.\n- Treat backing services (DB, Redis) as attached resources.\n- Strict separation of build, release, and run stages.\n- Execute apps as stateless processes.\n- Fast startup and graceful shutdown via disposability.",
    "memoryModel": "Memory Anchor: 12-Factor App: Stateless processes, config in environment variables, attached backing services, graceful shutdown.",
    "difficulty": "Staff",
    "pitch": "In production, What is 12-Factor App methodology for modern Node.js cloud applications centers on first-principles system mechanics. Specifically: A set of 12 best practices for cloud-native software:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 12-Factor App: Stateless processes, config in environment variables, attached backing services, graceful shutdown.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 245,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is OpenTelemetry (OTel) and Distributed Tracing in Node.js?",
    "answer": "OpenTelemetry is an open-source observability framework providing vendor-neutral APIs and SDKs to capture traces, metrics, and logs. It auto-instruments HTTP requests, database queries, and Redis operations, tracing latency bottlenecks across microservices in Jaeger or Datadog.",
    "memoryModel": "Memory Anchor: OpenTelemetry instruments traces across microservices to visualize request latency waterfalls.",
    "difficulty": "Staff",
    "pitch": "In production, What is OpenTelemetry (OTel) and Distributed Tracing in Node.js centers on first-principles system mechanics. Specifically: OpenTelemetry is an open-source observability framework providing vendor-neutral APIs and SDKs to capture traces, metrics, and logs. It auto-instruments HTTP requests, database que...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: OpenTelemetry instruments traces across microservices to visualize request latency waterfalls.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": [
      {
        "title": "Approach 1: Immediate process.exit(0) (Destructive)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Kills the process immediately, abruptly severing in-flight HTTP connections and corrupting file writes.",
        "code": "process.on('SIGTERM', () => {\n  // ❌ Abruptly severs active user requests!\n  process.exit(0);\n});"
      },
      {
        "title": "Approach 2: Graceful Draining with Server.close & Teardown Timeout (Optimal)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Stops accepting new incoming connections, allows active requests up to 10 seconds to finish, closes DB pools, and cleanly exits.",
        "code": "export function setupGracefulShutdown(server, dbPool) {\n  const shutdown = async (signal) => {\n    console.log(`Received ${signal}. Draining connections...`);\n    server.close(async () => {\n      console.log('HTTP server closed. Releasing DB pool...');\n      await dbPool.end();\n      process.exit(0);\n    });\n    setTimeout(() => {\n      console.error('Forceful shutdown timeout reached.');\n      process.exit(1);\n    }, 10000).unref();\n  };\n  process.on('SIGTERM', () => shutdown('SIGTERM'));\n  process.on('SIGINT', () => shutdown('SIGINT'));\n}"
      }
    ]
  },
  {
    "id": 246,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "How do you debug an issue where CPU is pinned at 100% on a production server?",
    "answer": "1) Generate a CPU profile using `v8-profiler-next` or `perf`.\n2) Inspect if an infinite synchronous loop, ReDoS regular expression, or heavy synchronous encryption (`crypto.pbkdf2Sync`) is hogging the main thread.\n3) Inspect Event Loop delay histograms.",
    "memoryModel": "Memory Anchor: 100% CPU = Synchronous code blocking main thread (ReDoS, infinite loop, or crypto.sync). Profile with v8-profiler.",
    "difficulty": "Staff",
    "pitch": "In production, How do you debug an issue where CPU is pinned at 100% on a production server centers on first-principles system mechanics. Specifically: 1) Generate a CPU profile using `v8-profiler-next` or `perf`....",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: 100% CPU = Synchronous code blocking main thread (ReDoS, infinite loop, or crypto.sync). Profile with v8-profiler.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 247,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "How do you handle zero-downtime database schema migrations in Node.js?",
    "answer": "Use **Expand and Contract (Parallel Run) migration pattern**:\n1) **Expand**: Add new nullable column to DB (old code continues writing to old column).\n2) **Deploy Code**: Update Node server to write to BOTH old and new columns, reading from new.\n3) **Backfill**: Run script to migrate historical data from old to new column.\n4) **Contract**: Deploy code reading/writing only new column, then drop old column in DB.",
    "memoryModel": "Memory Anchor: Zero-downtime DB migrations: Expand (add column) -> Dual write -> Backfill -> Contract (drop old column).",
    "difficulty": "Staff",
    "pitch": "In production, How do you handle zero-downtime database schema migrations in Node.js centers on first-principles system mechanics. Specifically: Use Expand and Contract (Parallel Run) migration pattern:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Zero-downtime DB migrations: Expand (add column) -> Dual write -> Backfill -> Contract (drop old column).",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 248,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "What is a Reverse Proxy (Nginx) and why should Node.js almost never be exposed directly to the public internet?",
    "answer": "Node.js is optimized for application logic, not edge web serving. Placing Nginx or AWS ALB in front provides:\n1) **SSL/TLS Termination**: Offloads expensive crypto handshakes from Node.\n2) **Static Asset Caching**: Serves images and CSS directly from disk cache.\n3) **DDoS & Slowloris Protection**: Absorbs slow, malicious HTTP connections.\n4) **Load Balancing**: Distributes traffic across multiple Node server instances.",
    "memoryModel": "Memory Anchor: Nginx handles SSL termination, gzip, static caching, and DDoS defense, leaving Node free for business logic.",
    "difficulty": "Staff",
    "pitch": "In production, What is a Reverse Proxy (Nginx) and why should Node.js almost never be exposed directly to the public internet centers on first-principles system mechanics. Specifically: Node.js is optimized for application logic, not edge web serving. Placing Nginx or AWS ALB in front provides:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Nginx handles SSL termination, gzip, static caching, and DDoS defense, leaving Node free for business logic.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 249,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "How do you design an API Gateway pattern for Node.js microservices?",
    "answer": "An API Gateway acts as the single public entry point for client applications. It handles:\n1) Cross-cutting authentication and token verification.\n2) Centralized rate limiting.\n3) Request routing to internal microservices.\n4) Response aggregation (BFF - Backend For Frontend pattern).\n5) Protocol translation (HTTP/JSON to gRPC).",
    "memoryModel": "Memory Anchor: API Gateway = Front door handling Auth, Rate Limiting, and Routing to internal microservices.",
    "difficulty": "Staff",
    "pitch": "In production, How do you design an API Gateway pattern for Node.js microservices centers on first-principles system mechanics. Specifically: An API Gateway acts as the single public entry point for client applications. It handles:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: API Gateway = Front door handling Auth, Rate Limiting, and Routing to internal microservices.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  },
  {
    "id": 250,
    "topicId": 16,
    "topicTitle": "16. Production Ops & Architecture",
    "question": "Explain how you would architect a production-grade Node.js/Express backend from scratch.",
    "answer": "Senior Interview-Ready Pitch:\n\n“I organize the application around a modular, domain-driven architecture (`src/modules/orders/`, `src/modules/auth/`) using TypeScript for strict end-to-end type safety.\n\nAt the HTTP layer, I use Express (or Fastify) with Helmet security headers, restrictive CORS policies, and centralized Zod request validation middleware. For authentication, I implement a dual-token architecture with short-lived JWTs and rotating refresh tokens in HttpOnly secure cookies.\n\nFor database access, I use connection pooling with transactions, and enforce webhook idempotency with Redis distributed locks. I offload heavy CPU or asynchronous jobs to BullMQ worker queues.\n\nFinally, for production reliability, I configure graceful shutdown on SIGTERM, structured JSON logging with correlation IDs via Pino and AsyncLocalStorage, comprehensive health checks for Kubernetes, and automated integration tests using Supertest and Testcontainers.”",
    "memoryModel": "Memory Anchor: Domain modules + TypeScript + Zod validation + Dual JWT + Redis idempotency + BullMQ queues + Graceful shutdown.",
    "difficulty": "Staff",
    "pitch": "In production, Explain how you would architect a production-grade Node.js/Express backend from scratch. centers on first-principles system mechanics. Specifically: Senior Interview-Ready Pitch:...",
    "runtimeBehavior": "**Runtime Execution & Memory Flow**: Memory Anchor: Domain modules + TypeScript + Zod validation + Dual JWT + Redis idempotency + BullMQ queues + Graceful shutdown.",
    "followUps": [
      {
        "q": "What is the primary production failure mode if this pattern is misconfigured?",
        "a": "The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools."
      },
      {
        "q": "How would you measure or monitor this behavior under heavy production load?",
        "a": "By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates."
      }
    ],
    "approaches": null
  }
];
