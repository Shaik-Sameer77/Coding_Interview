const fs = require('fs');
const path = require('path');

const batch1 = require('./node_notes_parts_1_to_8.json');

// ==========================================
// MODULE 4: ASYNCHRONOUS PROGRAMMING (Part 5)
// ==========================================

const module4Sections = [
  {
    id: "5.1",
    title: "11. Callbacks, Error-First Conventions, Promises & Async/Await",
    content: `### 1. Topic Overview & Mental Model
Node.js was built from day one around asynchronous programming. Over the years, the patterns for expressing async workflows evolved from **Error-First Callbacks** to **Promises** and finally to **\`async\`/\`await\`**.
- **Error-First Callback Pattern**: The original Node convention where every async function accepts a callback whose first parameter is reserved for an error object (\`null\` if successful) and remaining parameters contain data: \`callback(err, data)\`.
- **Callback Hell (Pyramid of Doom)**: Deeply nested callbacks making error propagation, resource cleanup, and parallel coordination unreadable and prone to silent failures.
- **Promises**: Objects representing the eventual completion (or failure) of an asynchronous operation, providing \`.then()\`, \`.catch()\`, and \`.finally()\`.
- **\`async\`/\`await\`**: Syntactic sugar over Promises (ES2017) allowing asynchronous code to be written and reasoned about sequentially using standard \`try\`/\`catch\` blocks.

### 2. Sequential vs Concurrent Execution with async/await
A frequent senior engineering bug is unintentionally sequentializing operations that could run in parallel:
\`\`\`javascript
// ❌ SLOW SEQUENTIAL: Takes 300ms (100ms + 100ms + 100ms)
const user = await fetchUser(id);
const orders = await fetchOrders(id);
const profile = await fetchProfile(id);

// ✅ FAST CONCURRENT: Takes 100ms (all 3 run in parallel)
const [user, orders, profile] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
  fetchProfile(id)
]);
\`\`\`

### 3. Error Propagation & Unhandled Promise Rejections
- In asynchronous functions, any un-caught exception or rejected promise inside an \`async\` function rejects the returned promise.
- If a promise rejects and has no \`.catch()\` handler attached, Node.js emits the **\`unhandledRejection\`** event on the \`process\` object.
- In modern Node.js (Node 15+), unhandled promise rejections terminate the process with a non-zero exit code by default (matching \`uncaughtException\`).`,
    comparisonTable: [
      {
        aspect: "Pattern",
        callbacks: "Error-First Callbacks",
        promises: "Promises (.then/.catch)",
        asyncAwait: "async / await (Modern)"
      },
      {
        aspect: "Error Handling",
        callbacks: "Manual if (err) check in every callback",
        promises: ".catch() chained at end",
        asyncAwait: "Standard try / catch block"
      },
      {
        aspect: "Composability",
        callbacks: "Extremely difficult (Pyramid of doom)",
        promises: "Chaining returns new promises",
        asyncAwait: "Intuitive sequential-looking code"
      },
      {
        aspect: "Stack Traces",
        callbacks: "Lost original call stack across ticks",
        promises: "V8 async stack traces (improved)",
        asyncAwait: "Zero-cost async stack traces in V8"
      }
    ],
    code: `// Converting Error-First Callbacks to Promises & Clean async/await
import fs from 'node:fs';
import { promisify } from 'node:util';

// 1. Traditional Error-First Callback
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Callback error:', err);
    return;
  }
  console.log('Callback read bytes:', data.length);
});

// 2. Using util.promisify to adapt legacy APIs
const readFileAsync = promisify(fs.readFile);

// 3. Clean async/await workflow with structured try/catch
async function loadProjectConfig() {
  try {
    const rawData = await readFileAsync('package.json', 'utf8');
    const parsed = JSON.parse(rawData);
    console.log('Project name:', parsed.name);
    return parsed;
  } catch (error) {
    console.error('Failed to read config safely:', error.message);
    throw error; // Re-throw or map to AppError
  } finally {
    console.log('File read operation completed.');
  }
}`,
    keyTakeaways: [
      "Always follow the error-first callback rule (err, result) when interfacing with legacy Node APIs.",
      "Never await independent promises sequentially; group them with Promise.all to maximize I/O throughput.",
      "Modern Node.js crashes the process on unhandled promise rejections; always attach .catch or use try/catch in async functions.",
      "util.promisify converts standard error-first callback functions into clean Promise-returning functions."
    ]
  },
  {
    id: "5.2",
    title: "12. The 4 Promise Combinators: all, allSettled, race & any",
    content: `### 1. Topic Overview & Mental Model
When coordinating multiple concurrent asynchronous operations, ECMAScript provides **4 distinct Promise combinators**. Each has a specific short-circuit behavior and failure mode:
1. **\`Promise.all([p1, p2, p3])\`**:
   - **All or Nothing (Fail-Fast)**. Resolves when ALL promises fulfill; rejects immediately as soon as ANY single promise rejects.
2. **\`Promise.allSettled([p1, p2, p3])\`**:
   - **No Failures Left Behind**. Waits for ALL promises to settle (either fulfill or reject). NEVER rejects. Returns an array of objects: \`{ status: 'fulfilled', value }\` or \`{ status: 'rejected', reason }\`.
3. **\`Promise.race([p1, p2, p3])\`**:
   - **First Across the Finish Line**. Settles with the result of the FIRST promise that finishes (whether it fulfills OR rejects).
4. **\`Promise.any([p1, p2, p3])\`**:
   - **First Success Wins**. Resolves as soon as ANY single promise fulfills. Rejects only if ALL promises reject, returning an **\`AggregateError\`**.

### 2. Senior Decision Framework: When to Use Which
- Use **\`Promise.all\`** when all operations are mandatory dependencies for the workflow (e.g., fetching User + Organization + Permissions before rendering a dashboard).
- Use **\`Promise.allSettled\`** for batch processing, fan-out background tasks, or bulk email dispatch where some failures are acceptable and must be reported individually.
- Use **\`Promise.race\`** primarily for implementing custom request timeouts against slow networks.
- Use **\`Promise.any\`** when fetching from redundant mirrors or CDNs where you only need the fastest successful response.`,
    comparisonTable: [
      {
        aspect: "Combinator",
        fulfillmentCondition: "Promise.all",
        rejectionCondition: "ALL must fulfill",
        shortCircuit: "Rejects on FIRST rejection"
      },
      {
        aspect: "Combinator",
        fulfillmentCondition: "Promise.allSettled",
        rejectionCondition: "NEVER rejects (always fulfills)",
        shortCircuit: "Waits for ALL to settle"
      },
      {
        aspect: "Combinator",
        fulfillmentCondition: "Promise.race",
        rejectionCondition: "First to settle (fulfill OR reject)",
        shortCircuit: "Short-circuits on FIRST settlement"
      },
      {
        aspect: "Combinator",
        fulfillmentCondition: "Promise.any",
        rejectionCondition: "First to FULFILL",
        shortCircuit: "Rejects only if ALL reject (AggregateError)"
      }
    ],
    code: `// Practical Demonstration of all 4 Promise Combinators

const fastSuccess = () => new Promise(res => setTimeout(() => res('Fast OK'), 50));
const slowSuccess = () => new Promise(res => setTimeout(() => res('Slow OK'), 200));
const fastFailure = () => new Promise((_, rej) => setTimeout(() => rej(new Error('Boom!')), 30));

// 1. Promise.all: Fails fast if one fails
try {
  await Promise.all([fastSuccess(), slowSuccess(), fastFailure()]);
} catch (err) {
  console.log('Promise.all failed fast:', err.message); // 'Boom!'
}

// 2. Promise.allSettled: Gathers all outcomes without throwing
const settledResults = await Promise.allSettled([fastSuccess(), slowSuccess(), fastFailure()]);
const successful = settledResults.filter(r => r.status === 'fulfilled').map(r => r.value);
const failed = settledResults.filter(r => r.status === 'rejected').map(r => r.reason.message);
console.log({ successful, failed });

// 3. Promise.race: Timeout pattern
const timeoutPromise = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('Request Timeout')), ms));
try {
  const result = await Promise.race([slowSuccess(), timeoutPromise(100)]);
} catch (err) {
  console.log('Promise.race timed out:', err.message); // 'Request Timeout'
}

// 4. Promise.any: First successful response wins
const fastestResponse = await Promise.any([fastFailure(), slowSuccess(), fastSuccess()]);
console.log('Promise.any first success:', fastestResponse); // 'Fast OK'`,
    keyTakeaways: [
      "Promise.all fails fast on the first error; use it when all inputs are strictly required.",
      "Promise.allSettled never rejects and is ideal for bulk independent jobs like dispatching notifications.",
      "Promise.race settles on the first completion (success or failure) and is commonly used for timeouts.",
      "Promise.any ignores early rejections and fulfills on the first success, throwing AggregateError if all fail."
    ]
  },
  {
    id: "5.3",
    title: "13. Timeouts, Cancellation & AbortController in Node.js",
    content: `### 1. Topic Overview & Mental Model
In backend distributed systems, un-timeouted outgoing HTTP calls or database queries will eventually **exhaust socket pools, hang request threads, and collapse your server**.
- Traditionally, cancelling async operations was difficult because native JavaScript Promises are **not cancelable** once created.
- **The Modern Standard**: The **\`AbortController\`** and **\`AbortSignal\`** APIs (standardized in Node 15+).
- **Mental Model**: The Emergency Brake Cord.
  - Calling \`fetch()\` or a database query sets a train in motion.
  - The \`AbortSignal\` is the emergency cord attached to that train.
  - If a timer expires or the client disconnects, pulling the cord (\`controller.abort()\`) immediately halts the operation, frees sockets, and releases memory.

### 2. Node.js 18+ AbortSignal Utilities
1. **\`AbortSignal.timeout(ms)\`**:
   - Automatically creates a signal that fires after a specified duration in milliseconds. Eliminates the need for manual \`setTimeout\` and \`clearTimeout\` boilerplate!
2. **\`AbortSignal.any([signal1, signal2])\`**:
   - Combines multiple abort triggers (e.g., abort if the user cancels OR if a 5-second timeout expires).
3. **Propagating Cancellation Down the Call Stack**:
   - Always accept an optional \`signal?: AbortSignal\` parameter in services and repositories, and forward it directly to database drivers (\`pg\`, \`mysql2\`, \`mongoose\`) and HTTP clients (\`fetch\`, \`axios\`).`,
    comparisonTable: [
      {
        aspect: "Feature",
        manualTimeout: "Promise.race + setTimeout",
        abortController: "AbortController + AbortSignal",
        timeoutSignal: "AbortSignal.timeout(ms)"
      },
      {
        aspect: "Socket / Handle Cleanup",
        manualTimeout: "POOR: Background fetch continues running in background",
        abortController: "EXCELLENT: Closes underlying TCP socket immediately",
        timeoutSignal: "EXCELLENT: Automatic timer & socket cleanup"
      },
      {
        aspect: "Boilerplate",
        manualTimeout: "High (requires clearTimeout hygiene)",
        abortController: "Moderate",
        timeoutSignal: "Minimal (Single line)"
      }
    ],
    code: `// Resilient Outgoing Request with AbortSignal.timeout and Client Disconnect Handling
import http from 'node:http';

export async function fetchWithStrictTimeout(url, timeoutMs = 3000) {
  try {
    // Native Node 18+ timeout signal
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });
    return await response.json();
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error(\`⏱️ Request to \${url} timed out after \${timeoutMs}ms\`);
      throw new Error('Upstream Service Timeout');
    }
    if (error.name === 'AbortError') {
      console.warn('Request was explicitly aborted by caller.');
      throw new Error('Request Cancelled');
    }
    throw error;
  }
}

// Handling Client Disconnects in Express / Node HTTP
export function attachClientDisconnectHandler(req, abortController) {
  req.on('close', () => {
    if (!req.complete) {
      console.log('Client closed socket before response finished. Aborting backend work...');
      abortController.abort();
    }
  });
}`,
    keyTakeaways: [
      "Never make outgoing network or database calls without strict timeouts.",
      "Use AbortSignal.timeout(ms) for zero-boilerplate timeout handling in Node 18+.",
      "Promise.race with a timer does NOT cancel the underlying operation; AbortSignal halts the socket immediately.",
      "Listen for req.on('close') on incoming HTTP requests to abort expensive backend database queries if the user navigates away."
    ]
  },
  {
    id: "5.4",
    title: "14. Bounded Concurrency: Avoiding Unbounded Parallelism (3 Production Implementations)",
    content: `### 1. Topic Overview & Mental Model
A classic junior mistake in Node.js is firing thousands of async promises simultaneously:
\`\`\`javascript
// ❌ CATASTROPHIC: Unbounded Parallelism
await Promise.all(urls.map(url => fetch(url))); // 50,000 requests at once!
\`\`\`
- If \`urls\` contains 50,000 items, Node opens 50,000 TCP sockets, crashes with **\`EMFILE: too many open files\`**, overwhelms the database connection pool, and exhausts the V8 heap.
- **The Solution**: **Bounded Concurrency** (Concurrency Limiting). Process the items concurrently, but restrict the maximum number of active in-flight promises to a fixed limit $K$ (e.g., $K = 5$ or $10$).
- **Mental Model**: The Bank Teller Line. Instead of 500 customers rushing the counters at once, they wait in a single queue, and exactly 5 customers are served by 5 tellers simultaneously.

### 2. Three Distinct Production Implementations
1. **Approach 1: Sliding Window / Worker Pool Pattern (Optimal & Continuous)**:
   - Spawns $K$ persistent worker promises. Each worker continuously pulls the next task from a shared iterator until the queue is empty.
   - **Advantage**: Maximizes throughput. Zero idle time; when worker 2 finishes early, it immediately takes the next item.
2. **Approach 2: Discrete Batching / Chunking Pattern (Simple)**:
   - Slices the array into chunks of size $K$. Runs \`Promise.all()\` on each chunk sequentially.
   - **Advantage**: Simple to understand.
   - **Disadvantage**: Bottlenecked by the slowest item in each batch (straggler effect).
3. **Approach 3: Async Semaphore / Mutex Limiter Class (Token Bucket)**:
   - Encapsulates an internal counter and waiting queue. Callers call \`await semaphore.acquire()\` before running and \`semaphore.release()\` in a \`finally\` block.
   - **Advantage**: Highly reusable across disparate parts of the application.`,
    comparisonTable: [
      {
        aspect: "Implementation",
        workerPool: "Approach 1: Worker Pool (Sliding Window)",
        chunking: "Approach 2: Batch Chunking",
        semaphore: "Approach 3: Async Semaphore Class"
      },
      {
        aspect: "Throughput",
        workerPool: "MAXIMAL: Fast tasks don't wait for slow tasks",
        chunking: "SUBOPTIMAL: Blocked by slowest task in batch",
        semaphore: "MAXIMAL: Immediate token handoff"
      },
      {
        aspect: "Memory Overhead",
        workerPool: "O(K) active promises",
        chunking: "O(K) per batch",
        semaphore: "O(N) queue storage"
      },
      {
        aspect: "Best Use Case",
        workerPool: "Bulk list processing (scraping, migrating)",
        chunking: "Batch DB inserts (Bulk write API)",
        semaphore: "Global resource limiter (e.g. 5 DB connections)"
      }
    ],
    code: `// 3 Production Implementations of Bounded Concurrency

// ==========================================================
// APPROACH 1: Optimal Worker Pool / Sliding Window
// Time: O(N) | Space: O(K) active promises
// ==========================================================
export async function mapConcurrentPool(items, limit, asyncFn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await asyncFn(items[currentIndex], currentIndex);
    }
  }

  // Spawn exactly 'limit' workers running concurrently
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ==========================================================
// APPROACH 2: Batch Chunking Pattern
// Time: O(N) | Space: O(K)
// ==========================================================
export async function mapConcurrentChunks(items, chunkSize, asyncFn) {
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(asyncFn));
    results.push(...chunkResults);
  }
  return results;
}

// ==========================================================
// APPROACH 3: Reusable Async Semaphore Pattern
// ==========================================================
export class AsyncSemaphore {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    this.currentRunning = 0;
    this.waitingQueue = [];
  }

  async acquire() {
    if (this.currentRunning < this.maxConcurrency) {
      this.currentRunning++;
      return;
    }
    await new Promise(resolve => this.waitingQueue.push(resolve));
    this.currentRunning++;
  }

  release() {
    this.currentRunning--;
    if (this.waitingQueue.length > 0) {
      const nextResolve = this.waitingQueue.shift();
      nextResolve();
    }
  }

  async run(taskFn) {
    await this.acquire();
    try {
      return await taskFn();
    } finally {
      this.release();
    }
  }
}`,
    keyTakeaways: [
      "Unbounded parallelism with Promise.all crashes servers via socket exhaustion and OOM errors.",
      "The Worker Pool (Sliding Window) pattern provides optimal throughput with exactly K active promises.",
      "Batch chunking is simple but suffers from straggler lag where fast tasks wait for the slowest item in the chunk.",
      "Async Semaphores allow limiting access to shared constrained resources across unrelated routes."
    ]
  },
  {
    id: "5.5",
    title: "15. Retry Policies: Exponential Backoff, Full Jitter & Idempotency",
    content: `### 1. Topic Overview & Mental Model
In distributed cloud architectures, transient network glitches, database lock waits, and downstream 503 Service Unavailable responses are inevitable.
- **Immediate Retries**: Disastrous! If 1,000 requests fail because a database is restarting, immediately retrying 1,000 times will overwhelm and crash the database as soon as it boots (**The Thundering Herd Problem**).
- **Exponential Backoff**: Doubles the delay on each consecutive retry: $t = \\text{base} \\times 2^{\\text{attempt}}$.
- **Full Jitter**: Adds random variance to the backoff delay: $\\text{sleep} = \\text{random}(0, \\text{base} \\times 2^{\\text{attempt}})$. This disperses the retries evenly across time, breaking up request spikes.
- **Idempotency**: An operation is idempotent if executing it multiple times produces the exact same result as executing it once (e.g. \`PUT\` or \`DELETE\` is idempotent; standard \`POST /payments\` is NOT). Retrying a non-idempotent operation risks charging a customer twice!

### 2. The Full Jitter Formula
AWS Architecture Research proved that **Full Jitter** significantly outperforms both No-Jitter and Equal-Jitter under heavy load:
$$\\text{Delay} = \\text{Math.random}() \\times \\min(\\text{maxDelay}, \\text{baseDelay} \\times 2^{\\text{attempt}})$$`,
    comparisonTable: [
      {
        aspect: "Retry Strategy",
        immediate: "Immediate Retry",
        fixed: "Fixed Interval Retry",
        exponentialJitter: "Exponential Backoff with Full Jitter"
      },
      {
        aspect: "Thundering Herd Risk",
        immediate: "EXTREME: Spikes crash recovering services",
        fixed: "HIGH: All clients retry in synchronized waves",
        exponentialJitter: "ZERO: Retries are smoothly distributed"
      },
      {
        aspect: "Idempotency Requirement",
        immediate: "Mandatory",
        fixed: "Mandatory",
        exponentialJitter: "Mandatory (Idempotency-Key header)"
      }
    ],
    code: `// Production Exponential Backoff with Full Jitter & Idempotent Headers
export async function retryWithBackoffAndJitter(
  operationFn,
  options = { maxRetries: 3, baseDelayMs: 200, maxDelayMs: 5000 }
) {
  let attempt = 0;

  while (attempt < options.maxRetries) {
    try {
      return await operationFn(attempt);
    } catch (error) {
      attempt++;
      if (attempt >= options.maxRetries) {
        console.error(\`❌ Max retries (\${options.maxRetries}) reached. Failing permanently.\`);
        throw error;
      }

      // Exponential Backoff with Full Jitter Formula
      const exponentialCap = Math.min(
        options.maxDelayMs,
        options.baseDelayMs * Math.pow(2, attempt)
      );
      const sleepTime = Math.round(Math.random() * exponentialCap);

      console.warn(\`⚠️ Attempt \${attempt} failed. Retrying in \${sleepTime}ms with jitter...\`);
      await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
  }
}`,
    keyTakeaways: [
      "Never retry without backoff; immediate retries trigger the Thundering Herd collapse on recovering services.",
      "Full Jitter randomizes retry intervals between 0 and the exponential cap, flattening traffic spikes.",
      "Never retry non-idempotent operations without an Idempotency-Key to prevent duplicate charges or records.",
      "Set a strict maxRetries limit (e.g. 3 to 5) and a maximum delay cap to avoid hanging user requests."
    ]
  }
];

// Replace Part 5 in batch 1
batch1[4] = {
  id: 5,
  title: "Part 5 — Asynchronous Programming, Promises, Concurrency Limiting & Resiliency",
  badge: "Async Concurrency",
  color: "#8b5cf6",
  sections: module4Sections
};

fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(batch1, null, 2));
console.log('Successfully updated Part 5 with full Module 4 coverage!');
