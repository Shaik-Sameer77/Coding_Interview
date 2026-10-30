const fs = require('fs');
const path = require('path');

const batch2 = require('./node_notes_parts_9_to_16.json');
const batch3 = require('./node_notes_parts_17_to_24.json');

// ==========================================
// MODULE 6: NODE.JS SECURITY (Part 11)
// ==========================================
const module6SecuritySections = [
  batch2[2].sections[0], // CORS
  batch2[2].sections[1], // Helmet
  {
    id: "11.3",
    title: "25. OWASP Top 10 for Node.js: Injection, Prototype Pollution, Deserialization & ReDoS",
    content: `### 1. Topic Overview & Mental Model
Node.js web applications are targets for specialized attack vectors that exploit JavaScript's dynamic nature and runtime quirks:
- **Command Injection**: An attacker injects OS shell metacharacters (\`;\`, \`|\`, \`&&\`, \`\` \` \`\`) into un-sanitized parameters passed to \`child_process.exec()\`, executing arbitrary shell commands on the host.
- **Path Traversal**: An attacker supplies relative directory sequences (\`../../etc/passwd\` or \`..%2F..%2F\`) to read or overwrite sensitive host files.
- **Prototype Pollution**: Attackers inject properties into \`Object.prototype\` via unsafe recursive object merging, modifying the behavior of every object in the V8 runtime.
- **Unsafe Deserialization**: Deserializing untrusted strings into JavaScript objects or functions (e.g. legacy \`node-serialize\` with IIFE execution \`_$$ND_FUNC$$\`), enabling instant Remote Code Execution (RCE).
- **Regular Expression Denial of Service (ReDoS)**: Poorly crafted regular expressions with nested quantifiers (e.g. \`(a+)+$\`) trigger **catastrophic backtracking** in V8's regex engine ($O(2^N)$ time), freezing the single-threaded event loop for minutes with a 30-character payload!

### 2. Attack Vectors & Defenses
1. **Command Injection Defense**:
   - Never use \`child_process.exec(cmdString)\` with user input. It spawns a full system shell (\`/bin/sh\` or \`cmd.exe\`).
   - Use \`child_process.execFile()\` or \`child_process.spawn()\` with argument arrays (\`[arg1, arg2]\`) which bypasses the shell completely and passes arguments directly to OS kernel exec calls.
2. **Prototype Pollution Defense**:
   - Prevent \`__proto__\`, \`constructor\`, and \`prototype\` keys from being merged.
   - Use \`Object.create(null)\` for dictionary lookup maps (has no prototype chain to pollute).
   - Use \`Object.freeze(Object.prototype)\` in production environments.
3. **ReDoS Defense**:
   - Audit regular expressions using tools like \`safe-regex\`.
   - Never use nested quantifiers like \`(x+x+)+y\`. Use linear-time parsers or validate input string length before matching.`,
    comparisonTable: [
      {
        aspect: "Attack Vector",
        vulnerablePattern: "child_process.exec(\`cat \${userInput}\`)",
        remediatedDefense: "child_process.execFile('cat', [userInput])",
        riskLevel: "CRITICAL: Remote Code Execution"
      },
      {
        aspect: "Attack Vector",
        vulnerablePattern: "merge(target, JSON.parse(userJson))",
        remediatedDefense: "Whitelist keys, block __proto__ & constructor",
        riskLevel: "HIGH: Prototype Pollution / Bypass Auth"
      },
      {
        aspect: "Attack Vector",
        vulnerablePattern: "/(a+)+$/.test(untrustedInput)",
        remediatedDefense: "Linear regex, string length pre-check, safe-regex",
        riskLevel: "HIGH: Event Loop Denial of Service"
      },
      {
        aspect: "Attack Vector",
        vulnerablePattern: "fs.readFile(path.join(DIR, userInput))",
        remediatedDefense: "path.resolve() + safePath.startsWith(DIR)",
        riskLevel: "CRITICAL: Arbitrary File Read"
      }
    ],
    code: `// Secure Coding Defenses: Command Injection, Path Traversal & ReDoS
import { execFile } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

// 1. Safe Command Execution (NO SHELL INVOLVED)
export function runGitLogSafely(branchName) {
  return new Promise((resolve, reject) => {
    // execFile passes arguments directly to the OS kernel without spawning a shell!
    // Even if branchName is "main; rm -rf /", it treats the whole string as a literal branch name!
    execFile('git', ['log', '-n', '5', branchName], (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

// 2. Prototype Pollution Defense Helper
export function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    // Block prototype pollution properties
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = safeMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`,
    keyTakeaways: [
      "Never execute child_process.exec with user input; use execFile or spawn with argument arrays to avoid shell injection.",
      "Block __proto__ and constructor keys during recursive object merges to prevent Prototype Pollution.",
      "Beware of catastrophic backtracking in nested regular expressions (ReDoS); test with safe-regex.",
      "Never deserialize untrusted payloads using eval or dangerous serializer packages; use native JSON.parse."
    ]
  },
  {
    id: "11.4",
    title: "26. Application Hardening: Request Limits, Rate Limiting, File Safety, TLS & Secret Hygiene",
    content: `### 1. Topic Overview & Mental Model
A secure Node.js application must be hardened across the entire infrastructure lifecycle:
- **Request Body Limits**: Defaulting to infinite or multi-megabyte JSON payloads leaves APIs open to trivial Memory Exhaustion DoS attacks.
- **Rate Limiting**: Throttling abusive IP addresses or authenticated tenants to prevent brute-force attacks and credential stuffing.
- **Secure File Handling**: Never trusting user-supplied file extensions or \`Content-Type\` headers. An attacker renaming \`malware.exe\` to \`avatar.png\` will bypass naive filters!
- **TLS & Certificate Verification**: Ensuring TLS 1.3 is enforced and strictly rejecting self-signed or expired certificates in production.
- **Secret Hygiene & PII Logging**: Preventing AWS keys, database passwords, or customer PII from leaking into git repositories or log aggregators (Datadog, CloudWatch).

### 2. File Upload Magic Number Inspection
- File extensions (\`.jpg\`) and MIME headers (\`image/jpeg\`) are purely advisory strings supplied by the client.
- **Senior Standard**: Inspect the file's **Magic Numbers (Magic Bytes)**—the first 4 to 8 bytes of binary data:
  - PNG: \`89 50 4E 47 0D 0A 1A 0A\`
  - JPEG: \`FF D8 FF\`
  - PDF: \`25 50 44 46\`
- Use libraries like \`file-type\` to verify magic bytes from the binary stream before accepting uploads.`,
    comparisonTable: [
      {
        aspect: "Security Control",
        control: "express.json({ limit: '10kb' })",
        threatProtected: "Denial of Service (DoS) via huge JSON payloads"
      },
      {
        aspect: "Security Control",
        control: "express-rate-limit (Redis Store)",
        threatProtected: "Brute-force password attacks, API abuse, scraping"
      },
      {
        aspect: "Security Control",
        control: "Magic Byte File Inspection",
        threatProtected: "Malicious executable upload masked as image"
      },
      {
        aspect: "Security Control",
        control: "Log Sanitization / PII Masking",
        threatProtected: "Credential leakage to observability platforms (CloudWatch, Sentry)"
      }
    ],
    code: `// Comprehensive Security Hardening in Express.js
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();

// 1. Strict Request Body Limits (Prevents OOM DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. Distributed Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', apiLimiter);

// 3. Sensitive Log Masking Middleware
export function sanitizeLogData(data) {
  const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'creditCard'];
  const sanitized = { ...data };
  
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
}`,
    keyTakeaways: [
      "Always set explicit body size limits on express.json ({ limit: '10kb' }) to block memory exhaustion DoS.",
      "Apply rate limiting to all public endpoints and sensitive routes (login, registration, reset password).",
      "Inspect magic binary bytes rather than file extensions or Content-Type headers when validating uploads.",
      "Redact passwords, tokens, and PII from application logs to comply with GDPR, HIPAA, and PCI-DSS."
    ]
  }
];

batch2[2].sections = module6SecuritySections;
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_9_to_16.json'), JSON.stringify(batch2, null, 2));
console.log('Successfully updated Part 11 with full Module 6 Security coverage!');

// ==========================================
// MODULE 5: NODE.JS ARCHITECTURE & PERFORMANCE (Part 22)
// ==========================================
const module5PerformanceSections = [
  {
    id: "22.1",
    title: "45. Event-Loop Latency, CPU Profiling & Flamegraphs",
    content: `### 1. Topic Overview & Mental Model
In high-throughput Node.js microservices, performance degradation is almost never caused by slow network hardware; it is caused by **Event Loop Latency** and **CPU Bottlenecks**.
- **Event Loop Latency (Lag)**: The delay between when a timer or I/O callback was scheduled to run and when the Event Loop actually starts executing it. If a callback is delayed by 250ms, all incoming HTTP connections experience at least 250ms of unexplainable latency!
- **CPU Profiling**: Sampling the V8 Call Stack thousands of times per second to measure exactly what percentage of CPU time is spent in each function.
- **Flamegraphs**: A visual representation of CPU profile stacks where the X-axis represents 100% of the sample time and the Y-axis represents call stack depth. Wide bars represent "hot" functions that consume CPU time.

### 2. Measuring Event Loop Latency with perf_hooks
Node.js provides the native **\`perf_hooks.monitorEventLoopDelay()\`** API:
- Continuously samples event loop delay with microsecond precision.
- Returns statistical percentiles: \`min\`, \`max\`, \`mean\`, \`p50\`, \`p90\`, \`p99\`.
- If \`p99\` latency exceeds 50ms, the process is under severe CPU stress and Kubernetes should route traffic to other pods.

### 3. Running the V8 Tick Profiler
To profile a live Node.js application without external dependencies:
\`\`\`bash
# 1. Start application with V8 tick profiler enabled
node --prof app.js

# 2. Run your benchmark or load test (e.g. autocannon or k6)
# This generates an isolate-0x...-v8.log file

# 3. Process the raw tick log into human-readable text
node --prof-process isolate-0x...-v8.log > v8_profile.txt
\`\`\``,
    comparisonTable: [
      {
        aspect: "Profiling Tool",
        tool: "monitorEventLoopDelay()",
        purpose: "Real-time production health & latency percentiles",
        overhead: "<1% (Safe for 24/7 production monitoring)"
      },
      {
        aspect: "Profiling Tool",
        tool: "node --prof (V8 Tick Profiler)",
        purpose: "Deep sampling of hot CPU functions & C++ bindings",
        overhead: "2-5% (Best for staging / load testing)"
      },
      {
        aspect: "Profiling Tool",
        tool: "Clinic.js Flame / Flamegraphs",
        purpose: "Visual call-tree hierarchy to spot blocking loops",
        overhead: "Development & diagnostic benchmarks"
      }
    ],
    code: `// Real-Time Event Loop Latency Monitoring in Production
import { monitorEventLoopDelay } from 'node:perf_hooks';

// Sample event loop delay with 20ms resolution
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

// Periodic latency logging (e.g. every 10 seconds for metrics collection)
setInterval(() => {
  const p50 = (histogram.percentile(50) / 1e6).toFixed(2);
  const p90 = (histogram.percentile(90) / 1e6).toFixed(2);
  const p99 = (histogram.percentile(99) / 1e6).toFixed(2);
  const max = (histogram.max / 1e6).toFixed(2);

  console.log(\`📊 Event Loop Latency (ms) -> p50: \${p50}ms | p90: \${p90}ms | p99: \${p99}ms | max: \${max}ms\`);

  // Alert or mark pod un-ready if p99 latency spikes over 50ms
  if (histogram.percentile(99) / 1e6 > 50) {
    console.warn('⚠️ WARNING: Event loop latency spike detected! Main thread is blocking.');
  }

  histogram.reset();
}, 10000);`,
    keyTakeaways: [
      "Event loop latency measures the delay before scheduled callbacks can run; high lag degrades all API responses.",
      "Use perf_hooks.monitorEventLoopDelay() to track p90 and p99 latency percentiles with near-zero overhead.",
      "Use node --prof and --prof-process to identify hot CPU bottlenecks without third-party dependencies.",
      "Flamegraph width corresponds directly to CPU time consumed; wide bars at the top of the graph represent optimization targets."
    ]
  },
  {
    id: "22.2",
    title: "46. Memory Leaks, V8 Heap Snapshots & Retained Reference Diagnosis",
    content: `### 1. Topic Overview & Mental Model
A memory leak in Node.js occurs when objects that are no longer needed remain reachable from the Garbage Collection (GC) roots, preventing V8 from freeing their heap memory.
- In containerized environments (Docker / Kubernetes), memory leaks result in **\`OOMKilled\` (Exit code 137)** crashes.
- **The 4 Major Leak Vectors**:
  1. **Global Retained References**: Pushing items to global arrays or objects without periodic pruning.
  2. **Closures Retaining Outer Scope**: An inner function retaining an outer variable that references large buffers or request objects.
  3. **Unbounded In-Memory Caches**: Caching without TTL or maximum entry limits (e.g., \`const cache = {}\`).
  4. **EventEmitter Listener Accumulation**: Repeatedly adding listeners via \`emitter.on()\` without calling \`removeListener()\`.

### 2. Shallow Size vs Retained Size
When analyzing a Chrome DevTools Heap Snapshot:
- **Shallow Size**: The amount of memory held by the object itself (typically 32–64 bytes for a simple object).
- **Retained Size**: The total amount of memory that would be **freed** if this object were deleted (includes all child objects, buffers, and closures that are only reachable through this object). A single small object can have a Retained Size of **500MB**!

### 3. Capturing Heap Snapshots in Production
Node.js has a built-in **\`v8.writeHeapSnapshot()\`** API that writes an \`.heapsnapshot\` file to disk on demand without requiring process restarts:
\`\`\`javascript
import v8 from 'node:v8';
const filename = v8.writeHeapSnapshot();
console.log('Heap snapshot saved to:', filename);
\`\`\`
Load this snapshot into Chrome DevTools (Memory tab) and use **Comparison View** against a baseline snapshot to instantly reveal objects that increased in count.`,
    comparisonTable: [
      {
        aspect: "Concept",
        detail: "Shallow Size vs Retained Size"
      },
      {
        aspect: "Shallow Size",
        detail: "Direct memory consumed by the object's own immediate properties"
      },
      {
        aspect: "Retained Size",
        detail: "Total memory freed if this object and its exclusive dependency tree are garbage collected"
      },
      {
        aspect: "Diagnosis Rule",
        detail: "Sort heap snapshot by Retained Size descending to immediately identify the root memory leak"
      }
    ],
    code: `// Programmatic Heap Snapshot Capture on High Memory Threshold
import v8 from 'node:v8';
import process from 'node:process';

export function setupMemoryGuard(thresholdMB = 1024) {
  setInterval(() => {
    const memory = process.memoryUsage();
    const heapUsedMB = memory.heapUsed / 1024 / 1024;

    if (heapUsedMB > thresholdMB) {
      console.warn(\`🚨 Memory threshold exceeded: \${heapUsedMB.toFixed(2)}MB used. Generating diagnostic heap snapshot...\`);
      
      const snapshotPath = v8.writeHeapSnapshot();
      console.log(\`✅ Heap snapshot written to: \${snapshotPath}\`);
      console.log('Inspect this file in Chrome DevTools -> Memory -> Load.');
    }
  }, 30000); // Check every 30s
}

// Bounded LRU Cache Pattern (Prevents Unbounded In-Memory Cache Leaks)
export class BoundedLRUCache {
  constructor(maxItems = 1000) {
    this.maxItems = maxItems;
    this.cache = new Map(); // Map preserves insertion order!
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    // Re-insert to mark as most recently used
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  set(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxItems) {
      // Evict oldest entry (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, val);
  }
}`,
    keyTakeaways: [
      "Memory leaks occur when unneeded objects remain reachable from GC roots.",
      "Sort Heap Snapshots by Retained Size in Chrome DevTools to locate the root culprit retaining memory.",
      "Never use raw object literals for caching; always enforce bounded size limits using an LRU cache.",
      "Use v8.writeHeapSnapshot() to capture live production heap state when memory exceeds defined thresholds."
    ]
  },
  {
    id: "22.3",
    title: "47. Production Reliability: Health Probes, Connection Pools, Pino Logging & Observability",
    content: `### 1. Topic Overview & Mental Model
A production-ready Node.js backend requires operational resilience, deep observability, and graceful connection management:
- **Liveness vs Readiness Health Checks**:
  - \`/health/live\`: Checks if the Node process is running and not locked in an infinite loop. If this fails, Kubernetes kills and restarts the container.
  - \`/health/ready\`: Checks if downstream dependencies (MySQL connection pool, Redis cache, MongoDB replica set) are connected. If this fails, Kubernetes stops sending user traffic to this pod without killing it.
- **Connection Pool Sizing**: Managing database socket pools to prevent connection exhaustion.
- **Structured JSON Logging**: Using asynchronous, high-throughput loggers (**Pino**) instead of \`console.log\` (which uses synchronous I/O that blocks the event loop under heavy load!).
- **Distributed Tracing**: Propagating W3C Trace Context headers (\`traceparent\`) across microservices using OpenTelemetry.
- **Horizontal Scaling & Stateless Architecture**: Designing services without in-memory sessions so traffic can be load balanced (Round Robin / Least Connections) across dozens of instances.`,
    comparisonTable: [
      {
        aspect: "Health Probe",
        endpoint: "/health/live (Liveness)",
        checks: "Process responsiveness / event loop alive",
        failureAction: "Orchestrator restarts container (SIGKILL)"
      },
      {
        aspect: "Health Probe",
        endpoint: "/health/ready (Readiness)",
        checks: "Database connection pool, Redis connected",
        failureAction: "Orchestrator removes pod from load balancer routing"
      },
      {
        aspect: "Logging Engine",
        endpoint: "Pino (Structured JSON)",
        checks: "Asynchronous stream, zero main thread block",
        failureAction: "5x faster than Winston; native pino-pretty for dev"
      }
    ],
    code: `// Production Health Probes, Pino Logging & Graceful Connection Pool Lifecycle
import express from 'express';
import pino from 'pino';

// High-performance asynchronous structured logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  },
  redact: ['req.headers.authorization', 'req.body.password', 'req.body.creditCard']
});

const app = express();

// 1. Liveness Probe (Is Node process alive?)
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'live', uptime: process.uptime() });
});

// 2. Readiness Probe (Are database pools connected?)
app.get('/health/ready', async (req, res) => {
  try {
    // Check database connection health
    // await db.ping();
    res.status(200).json({ status: 'ready', database: 'connected' });
  } catch (err) {
    logger.error('Readiness probe failed: Database disconnected', err);
    res.status(503).json({ status: 'unready', error: 'Database unavailable' });
  }
});

// 3. Graceful Connection Draining
export function registerGracefulShutdown(server, dbPool) {
  const shutdown = async (signal) => {
    logger.info(\`Received \${signal}. Draining HTTP server and database pool...\`);
    
    server.close(async () => {
      logger.info('HTTP server stopped accepting new requests.');
      try {
        await dbPool.end(); // Drain and close DB connection pool
        logger.info('Database pool drained cleanly. Exiting code 0.');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing database pool:', err);
        process.exit(1);
      }
    });

    // Force exit after 10s timeout to prevent hanging
    setTimeout(() => {
      logger.error('Forced shutdown timeout reached. Exiting code 1.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}`,
    keyTakeaways: [
      "Separate /health/live (process health) from /health/ready (dependency connectivity) for zero-downtime deployments.",
      "Never use console.log in high-throughput production servers; use fast structured loggers like Pino with redaction.",
      "Always drain database connection pools gracefully inside SIGTERM handlers with an unref timeout safety net.",
      "Stateless application design with token-based authentication enables seamless horizontal scaling across load balancers."
    ]
  }
];

batch3[5].sections = module5PerformanceSections;
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_17_to_24.json'), JSON.stringify(batch3, null, 2));
console.log('Successfully updated Part 22 with full Module 5 Performance & Architecture coverage!');
