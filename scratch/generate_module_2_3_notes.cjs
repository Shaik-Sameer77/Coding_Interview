const fs = require('fs');
const path = require('path');

// Author complete, exhaustive notes for Module 2 and Module 3
// Strictly following the Universal 9-Section Blueprint from AGENTS.md

const module2Sections = [
  {
    id: "2.1",
    title: "1. Execution Contexts, Call Stack, V8 Heap & Lexical Closures in Node.js",
    content: `### 1. Topic Overview & Mental Model
To understand how Node.js executes JavaScript on a server, one must understand how the Google V8 engine allocates memory and tracks execution.
- **Execution Context**: The abstract environment in which JavaScript code is evaluated and executed. Contains the Variable Environment, Lexical Environment, and the \`this\` binding.
- **Call Stack**: A single LIFO (Last-In, First-Out) memory structure that records where in the program we are. When a function is called, its frame is pushed to the stack. When it returns, it is popped.
- **Heap Memory**: An unstructured memory pool where objects, arrays, closures, and buffers reside.
- **Lexical Closures**: A function bundled together with references to its surrounding lexical environment. In long-running Node.js servers, closures that retain references to large request objects or database connections are the **#1 source of memory leaks**.
- **Mental Model**: The Office Desk & The Filing Cabinet.
  - The **Call Stack** is the desktop where the worker currently performs active tasks one by one.
  - The **Heap** is the filing cabinet where large binders (objects) are stored and referenced by sticky notes on the desk.
  - A **Closure** is a binder that keeps a lock on an entire filing drawer even after the original task is finished.

### 2. Execution Context Lifecycle in V8
Whenever a JavaScript file or function runs, V8 executes two distinct phases:
1. **Creation Phase**:
   - V8 allocates the Global or Function Execution Context.
   - Sets up the Scope Chain and Lexical Environment.
   - Hoisting occurs: function declarations are stored in heap memory; variables (\`let\`, \`const\`) are placed in the **Temporal Dead Zone (TDZ)**.
2. **Execution Phase**:
   - V8 executes code line-by-line.
   - Evaluates assignments, invokes functions, and pushes execution frames onto the Call Stack.
   - Synchronous code execution runs to completion without interruption (**Run-To-Completion Semantics**).

### 3. Server Memory Hazards: Closures & Retained Heap Memory
In browser JavaScript, refreshing the page wipes out the entire memory heap. In Node.js, a server process can run for months.
- If an HTTP request handler creates a closure that is referenced by a global array, an event listener, or an uncleaned cache, **the entire request context, headers, and body remain pinned in V8 heap memory forever**!
- V8's Garbage Collector cannot reclaim heap memory that is reachable through any active closure reference.`,
    comparisonTable: [
      {
        aspect: "Memory Structure",
        location: "Call Stack",
        heap: "V8 Heap Space"
      },
      {
        aspect: "Data Stored",
        location: "Primitive values, function call frames, execution pointers",
        heap: "Objects, Arrays, Functions, Closures, Buffers"
      },
      {
        aspect: "Allocation Speed",
        location: "Ultra-fast contiguous memory allocation (LIFO)",
        heap: "Dynamic allocation managed by V8 memory allocator"
      },
      {
        aspect: "Garbage Collection",
        location: "Automatically freed when function returns (stack pop)",
        heap: "Managed by Generational GC (Scavenger + Mark-Sweep-Compact)"
      },
      {
        aspect: "Failure Mode",
        location: "RangeError: Maximum call stack size exceeded (Stack Overflow)",
        heap: "FATAL ERROR: Ineffective mark-compacts near heap limit (OOM Crash)"
      }
    ],
    code: `// Demonstrating Call Stack, Heap Allocation, and Closure Memory Retention

import process from 'node:process';

// 1. Synchronous Execution & Call Stack
function stepOne() {
  return stepTwo();
}
function stepTwo() {
  return 'Call stack frame executed cleanly';
}
console.log(stepOne());

// 2. The Closure Server Memory Hazard
// Simulating an unbounded request audit log
const globalAuditLog = [];

export function handleIncomingRequest(requestId, requestPayload) {
  const requestStartTime = Date.now();
  
  // ⚠️ HAZARD: This closure retains 'requestPayload' in memory
  const getMetadata = () => {
    return { id: requestId, duration: Date.now() - requestStartTime };
  };

  // If we push a closure or large object to a global array without pruning:
  globalAuditLog.push({
    getMetadata,
    // ❌ Pinned in Heap: Even after the response is sent, payload CANNOT be garbage collected!
    payload: requestPayload 
  });
}

// Memory check
console.log('Heap Used (MB):', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));`,
    keyTakeaways: [
      "JavaScript has a single Call Stack per V8 isolate; synchronous operations block all subsequent operations until finished.",
      "V8 allocates primitive variables on the Call Stack and dynamic objects/closures in the Heap.",
      "In long-running Node.js servers, closures that reference request data and attach to global scopes cause fatal heap memory leaks.",
      "Run-to-completion semantics mean that no other JavaScript code can run until the currently executing function stack completely drains."
    ]
  },
  {
    id: "2.2",
    title: "2. The Libuv Event Loop: 6 Phases, Timers, Poll & Check Phases Deep-Dive",
    content: `### 1. Topic Overview & Mental Model
Because JavaScript execution in V8 is single-threaded, Node.js relies on **Libuv's Event Loop** to coordinate non-blocking concurrency.
- The Event Loop is an infinite loop written in C that continually checks for OS events, processes I/O callbacks, and schedules execution.
- **Why Node.js Can Handle 100,000+ Concurrent Connections**: Node does not assign an OS thread to each client. Instead, the OS kernel notifies Libuv when data arrives on a network socket. Libuv places a callback in the Poll queue, and the single V8 thread executes it when free.
- **Mental Model**: The Subway Conductor.
  - The Event Loop is a train running on a circular track with 6 stations (Phases).
  - At each station, the conductor opens the doors and lets passengers (callbacks) off one by one.
  - If the station platform is empty, the train proceeds to the next station or waits at the Poll station until the signals change (I/O events arrive from the operating system).

### 2. The 6 Event Loop Phases in Exact Execution Order
1. **Timers Phase**:
   - Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\` whose duration threshold has elapsed.
   - Timers are stored in a min-heap sorted by expiration time.
2. **Pending Callbacks (I/O Callbacks) Phase**:
   - Executes system-level I/O callbacks deferred from the previous tick (e.g. TCP socket errors like \`ECONNREFUSED\`).
3. **Idle, Prepare Phase**:
   - Internal Libuv housekeeping. Runs on every tick for Libuv subsystem coordination.
4. **Poll Phase (The Engine Heart)**:
   - Calculates how long to block and wait for new I/O events from the OS kernel (\`epoll\`, \`kqueue\`, \`IOCP\`).
   - Processes incoming TCP connections, HTTP requests, file descriptors, and database responses.
   - If the poll queue is empty, Libuv checks:
     - Are \`setImmediate()\` callbacks queued in Check phase? $\\to$ Advances directly to Check phase.
     - Have timers expired? $\\to$ Loops back to Timers phase.
     - Otherwise, blocks/sleeps waiting for OS kernel events.
5. **Check Phase**:
   - Dedicated exclusively to executing \`setImmediate()\` callbacks.
6. **Close Callbacks Phase**:
   - Executes close event handlers (e.g., \`socket.on('close')\`, \`stream.destroy()\`).

### 3. Node.js Event Loop vs Browser Event Loop
| Feature | Browser Event Loop (HTML5 Spec) | Node.js Event Loop (Libuv) |
| :--- | :--- | :--- |
| **Architecture** | Single Task Queue (Macrotasks) + Microtask Queue | **6 distinct sequential phases** + Microtask queues |
| **I/O Source** | User interactions (click, scroll), DOM rendering, network fetch | OS kernel non-blocking sockets (\`epoll\`/IO), file descriptors |
| **Rendering** | Renders UI updates between task executions (60Hz / 120Hz) | Zero UI rendering concepts; optimized purely for I/O throughput |
| **Microtask Timing** | Runs after every task completion | In modern Node.js, runs after **every individual callback** and between phases |`,
    comparisonTable: [
      {
        aspect: "Phase Name",
        purpose: "Primary Callback Types Executed",
        internalMechanism: "Libuv Queue Structure"
      },
      {
        aspect: "1. Timers",
        purpose: "setTimeout(), setInterval()",
        internalMechanism: "Min-heap sorted by expiration timestamp"
      },
      {
        aspect: "2. Pending I/O",
        purpose: "System error callbacks (ECONNREFUSED)",
        internalMechanism: "FIFO pending queue"
      },
      {
        aspect: "3. Idle/Prepare",
        purpose: "Internal Libuv housekeeping",
        internalMechanism: "Internal loop hooks"
      },
      {
        aspect: "4. Poll",
        purpose: "Incoming HTTP requests, socket reads/writes, DB results",
        internalMechanism: "Kernel epoll_wait / kqueue multiplexer"
      },
      {
        aspect: "5. Check",
        purpose: "setImmediate()",
        internalMechanism: "FIFO check queue"
      },
      {
        aspect: "6. Close",
        purpose: "socket.on('close'), handle cleanups",
        internalMechanism: "FIFO close queue"
      }
    ],
    code: `// Demonstrating Poll Phase to Check Phase Transition Guarantees

import fs from 'node:fs';
import path from 'node:path';

// 1. Inside an I/O callback (e.g. reading a file):
// The poll phase completes the file read.
// Next phase in the loop is GUARANTEED to be the Check phase!
fs.readFile(process.argv[1], () => {
  console.log('--- Inside I/O Callback (Poll Phase) ---');
  
  setTimeout(() => {
    console.log('3. setTimeout(0) executed in Timers phase (next tick)');
  }, 0);

  setImmediate(() => {
    // 💡 GUARANTEED: setImmediate ALWAYS runs before setTimeout(0) inside I/O
    console.log('2. setImmediate() executed in Check phase (current tick)');
  });
  
  console.log('1. Synchronous I/O callback body finished');
});`,
    keyTakeaways: [
      "The Libuv Event Loop cycles through 6 distinct phases: Timers -> Pending -> Idle -> Poll -> Check -> Close.",
      "The Poll phase blocks waiting for kernel I/O unless timers have expired or setImmediate callbacks exist in the Check phase.",
      "Inside an asynchronous I/O callback, setImmediate is GUARANTEED to execute before setTimeout(0) because Poll transitions directly into Check.",
      "Unlike the browser event loop which handles UI rendering, Node's Libuv event loop is purely designed for network/disk throughput."
    ]
  },
  {
    id: "2.3",
    title: "3. Microtasks, Priority Interrupts & Output Prediction Mastery",
    content: `### 1. Topic Overview & Mental Model
Microtasks are **not part of Libuv's 6 phases**. They are managed directly by V8 and Node.js core, and they act as **high-priority execution interrupts**.
- Whenever the current JavaScript call stack finishes executing, V8 drains microtasks **before** allowing the event loop to advance to the next operation or phase.
- There are two microtask queues in Node.js, evaluated in strict order:
  1. **\`process.nextTick\` Queue**: The highest priority queue in Node.js.
  2. **Promise Microtask Queue**: Handles \`Promise.then()\`, \`catch()\`, \`finally()\`, \`await\` resumptions, and \`queueMicrotask()\`.

### 2. Microtask Execution Order Rules
1. **Rule 1: \`process.nextTick\` Always Beats Promises**:
   - The entire \`process.nextTick\` queue is drained completely before a single Promise microtask is allowed to run.
2. **Rule 2: Microtasks Drain After EVERY Operation**:
   - Since Node.js v11+, microtasks drain immediately between individual timer callbacks and between every phase transition (matching browser standard behavior).
3. **Rule 3: Starvation Hazard**:
   - Recursively calling \`process.nextTick()\` will completely starve the Event Loop, preventing I/O, timers, and HTTP requests from ever processing:
     \`\`\`javascript
     // ❌ DANGEROUS: Freezes the entire Node.js server!
     function starve() {
       process.nextTick(starve);
     }
     \`\`\`

### 3. Stable Guarantees vs Version-Dependent / Non-Deterministic Observations
Senior interviewers frequently test whether you know what is **guaranteed by specification** versus what is **non-deterministic**:
1. **Stable Guarantee 1**: All synchronous mainline code executes before any microtask or macrotask.
2. **Stable Guarantee 2**: \`process.nextTick\` runs before Promise microtasks.
3. **Stable Guarantee 3**: Inside any I/O callback (e.g. \`fs.readFile\`), \`setImmediate\` **always** runs before \`setTimeout(0)\`.
4. **Non-Deterministic Observation**: In the **top-level mainline scope**, the execution order between \`setTimeout(fn, 0)\` and \`setImmediate(fn)\` is **non-deterministic**!
   - Why? Because \`setTimeout(fn, 0)\` is internally converted to \`setTimeout(fn, 1ms)\`. If the computer's CPU is fast and enters the Libuv event loop in $< 1\\text{ms}$, the timer has not expired yet, so the loop moves to the Check phase and runs \`setImmediate\` first. If the process is delayed by $\\ge 1\\text{ms}$, the timer has expired and runs first!`,
    comparisonTable: [
      {
        aspect: "Queue / API",
        priority: "process.nextTick()",
        queueType: "nextTick Queue",
        executionTiming: "Immediately when call stack empties, before any Promise"
      },
      {
        aspect: "Queue / API",
        priority: "Promise.then() / await",
        queueType: "Promise Microtask Queue",
        executionTiming: "Immediately after nextTick queue drains, before event loop phases"
      },
      {
        aspect: "Queue / API",
        priority: "setTimeout(fn, 0)",
        queueType: "Timers Macrotask Phase",
        executionTiming: "Phase 1 of Libuv loop, after elapsed threshold"
      },
      {
        aspect: "Queue / API",
        priority: "setImmediate(fn)",
        queueType: "Check Macrotask Phase",
        executionTiming: "Phase 5 of Libuv loop, immediately after Poll phase"
      }
    ],
    code: `// The Definitive Event Loop & Microtask Output Prediction Problem

import process from 'node:process';

console.log('1. Mainline Synchronous Start');

setTimeout(() => {
  console.log('2. Timers Phase: setTimeout 0ms');
  process.nextTick(() => {
    console.log('3. Microtask nested inside setTimeout');
  });
}, 0);

setImmediate(() => {
  console.log('4. Check Phase: setImmediate');
});

Promise.resolve().then(() => {
  console.log('5. Promise Microtask 1');
}).then(() => {
  console.log('6. Promise Microtask 2');
});

process.nextTick(() => {
  console.log('7. process.nextTick 1');
  process.nextTick(() => {
    console.log('8. Nested process.nextTick');
  });
});

console.log('9. Mainline Synchronous End');

/* EXACT GUARANTEED OUTPUT ORDER:
   1. Mainline Synchronous Start
   9. Mainline Synchronous End
   7. process.nextTick 1            (nextTick queue drains first)
   8. Nested process.nextTick       (Nested nextTick drains before Promises!)
   5. Promise Microtask 1          (Promise microtasks drain next)
   6. Promise Microtask 2          (Chained Promise resolves in same microtask drain)
   -- Libuv Event Loop Begins --
   (Between 2 and 4 at top-level: non-deterministic depending on 1ms clock tick)
   2. Timers Phase: setTimeout 0ms
   3. Microtask nested inside setTimeout (Drains immediately after timer callback!)
   4. Check Phase: setImmediate
*/`,
    keyTakeaways: [
      "process.nextTick runs before Promise microtasks; both run before any Libuv macrotask phase.",
      "Recursive process.nextTick calls starve the event loop; recursive setImmediate calls yield to the next loop tick safely.",
      "Inside I/O callbacks, setImmediate is 100% guaranteed to run before setTimeout(0).",
      "Top-level setTimeout(0) vs setImmediate order is non-deterministic due to 1ms timer precision thresholds."
    ]
  },
  {
    id: "2.4",
    title: "4. Concurrency vs Parallelism: Libuv Thread Pool, Worker Threads & Cluster Architecture",
    content: `### 1. Topic Overview & Mental Model
A common interview question is: *"If JavaScript is single-threaded, how does Node.js achieve high concurrency and handle multiple CPU cores?"*
- **Concurrency**: Dealing with lots of things at once (e.g., handling 10,000 idle network sockets on a single thread by switching between I/O events).
- **Parallelism**: Doing lots of things at the exact same time (e.g., running heavy cryptographic computations simultaneously across 8 physical CPU cores).
- **Mental Model**:
  - **Single-Threaded Event Loop (Concurrency)**: One fast juggler keeping 50 balls in the air.
  - **Worker Threads (Parallelism)**: Hiring 4 separate jugglers in the same room who can share props.
  - **Cluster Module (Multi-Process Parallelism)**: Opening 4 identical independent juggling theaters on different streets, all sharing a central ticket box.

### 2. The 3 Tiers of Concurrency & Multi-Processing in Node.js
1. **Libuv Thread Pool (Background C++ Threads)**:
   - Built into Node.js runtime. Default size is **4 threads** (\`UV_THREADPOOL_SIZE\`, configurable up to 128).
   - Used automatically for operations that operating systems cannot perform non-blockingly:
     - File system I/O (\`fs.readFile\`, \`fs.writeFile\`).
     - Cryptography (\`crypto.pbkdf2\`, \`crypto.scrypt\`, \`crypto.randomBytes\`).
     - DNS Lookups (\`dns.lookup\` which uses OS \`getaddrinfo\`).
     - Compression (\`zlib\`).
   - Network I/O (TCP/HTTP) does **NOT** use the thread pool; it uses OS non-blocking multiplexers (\`epoll\`, \`kqueue\`).
2. **Worker Threads (\`node:worker_threads\`)**:
   - Provides true multi-threaded JavaScript execution within a **single OS process**.
   - Each worker runs its own isolated V8 engine and event loop, but can share memory with the parent thread via **\`SharedArrayBuffer\`** and **\`Atomics\`**.
   - **Best for**: CPU-intensive operations (image resizing, video transcoding, PDF generation, machine learning inference, cryptographic hashing).
3. **Cluster Module (\`node:cluster\`)**:
   - Spawns multiple **separate OS child processes** (one per physical CPU core) using \`child_process.fork()\`.
   - Each worker process has its own dedicated memory heap, V8 isolate, and Libuv event loop.
   - Workers share the same server port (e.g., port 3000) using operating system socket handoff coordinated by the master process.
   - **Best for**: Scaling HTTP API throughput across multi-core servers (stateless REST APIs).`,
    comparisonTable: [
      {
        aspect: "Mechanism",
        threads: "Libuv Thread Pool",
        workers: "Worker Threads (worker_threads)",
        cluster: "Cluster Module (child processes)"
      },
      {
        aspect: "Abstraction Level",
        threads: "C++ internal runtime pool",
        workers: "Multi-threaded JS in 1 process",
        cluster: "Multi-process architecture"
      },
      {
        aspect: "Memory Isolation",
        threads: "C++ memory",
        workers: "Isolated V8 heaps; shared SharedArrayBuffer",
        cluster: "100% Isolated OS processes (no shared memory)"
      },
      {
        aspect: "Communication",
        threads: "Internal Libuv callbacks",
        workers: "MessageChannel / postMessage / SharedArrayBuffer",
        cluster: "Inter-Process Communication (IPC) serialization"
      },
      {
        aspect: "Best Use Case",
        threads: "Disk fs, crypto, DNS lookups",
        workers: "CPU-bound computational tasks",
        cluster: "Horizontal multi-core scaling for HTTP APIs"
      }
    ],
    code: `// Multi-Core Cluster Architecture Example for HTTP APIs
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import process from 'node:process';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary Master Process \${process.pid} is running. Forking \${numCPUs} workers...\`);

  // Fork workers matching CPU core count
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Auto-restart worker if it crashes
  cluster.on('exit', (worker, code, signal) => {
    console.warn(\`⚠️ Worker \${worker.process.pid} died (signal: \${signal || code}). Spawning replacement...\`);
    cluster.fork();
  });
} else {
  // Worker processes share the same underlying TCP connection port!
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      workerPid: process.pid,
      handledByCpuCore: process.pid % numCPUs
    }));
  }).listen(3000, () => {
    console.log(\`Worker \${process.pid} listening on port 3000\`);
  });
}`,
    keyTakeaways: [
      "Concurrency is juggling multiple I/O events on one thread; Parallelism is executing computations simultaneously across multiple CPU cores.",
      "Libuv thread pool defaults to 4 threads and handles fs, crypto, and dns.lookup; increase with UV_THREADPOOL_SIZE=64 for heavy file workloads.",
      "Worker Threads share memory via SharedArrayBuffer and are designed for CPU-intensive data processing.",
      "Cluster module forks independent Node processes to saturate all CPU cores for stateless web APIs."
    ]
  }
];

// Read existing batches
const batch1 = require('./node_notes_parts_1_to_8.json');

// Replace Part 2 with the comprehensive Module 2 sections
batch1[1] = {
  id: 2,
  title: "Part 2 — JavaScript Execution, Event Loop Phases & Concurrency Model",
  badge: "Engine Architecture",
  color: "#06b6d4",
  sections: module2Sections
};

// Now build Module 3 Core APIs into Part 4 and Part 5
const module3Part4Sections = [
  {
    id: "4.1",
    title: "8. The process Object, Arguments, Exit Codes & OS Signals",
    content: `### 1. Topic Overview & Mental Model
The \`process\` object is a global EventEmitter instance providing information about and control over the current Node.js runtime process.
- Unlike browser JavaScript which has no concept of an underlying operating system, Node.js applications must react to OS shutdown signals, parse command-line arguments, manage memory limits, and communicate exit status codes to orchestrators (Docker, Kubernetes, systemd).
- **Mental Model**: The Cockpit Control Panel. The \`process\` object is the master dashboard showing engine temperature (memory usage), flight altitude (uptime), incoming radio directives (OS signals), and the eject button (exit codes).

### 2. Core process Capabilities
1. **Command Line Arguments (\`process.argv\`)**:
   - Array containing: \`[0]\` node binary path, \`[1]\` script entry file path, \`[2...n]\` user arguments.
2. **Standard I/O Streams**:
   - \`process.stdin\`: Readable stream for terminal input.
   - \`process.stdout\`: Writable stream for standard output (e.g. \`console.log\`).
   - \`process.stderr\`: Writable stream for error logs.
3. **Process Exit Codes**:
   - \`0\`: Clean success exit.
   - \`1\`: Uncaught fatal exception.
   - \`130\`: Terminated by user via \`SIGINT\` (Ctrl+C).
   - \`137\`: Terminated by OS via \`SIGKILL\` (OOM killer or \`kill -9\`).
   - \`143\`: Terminated by orchestrator via \`SIGTERM\` (graceful shutdown requested).
4. **Operating System Signals**:
   - \`SIGTERM\`: Graceful termination signal sent by Kubernetes/Docker before destroying a container. The app must stop accepting new traffic, finish in-flight requests, close DB pools, and exit with code \`0\`.
   - \`SIGINT\`: Interrupt signal sent from terminal (Ctrl+C).
   - \`SIGUSR2\`: Often used by tools like nodemon for process restarts.`,
    comparisonTable: [
      {
        aspect: "Signal / Code",
        meaning: "Triggered By",
        recommendedAction: "Application Behavior"
      },
      {
        aspect: "SIGTERM",
        meaning: "Kubernetes / Docker pod termination",
        recommendedAction: "Gracefully drain in-flight HTTP requests and exit 0"
      },
      {
        aspect: "SIGINT",
        meaning: "Terminal keyboard interrupt (Ctrl+C)",
        recommendedAction: "Clean up resources and terminate immediately"
      },
      {
        aspect: "Exit Code 0",
        meaning: "Success",
        recommendedAction: "Process exited normally with no pending errors"
      },
      {
        aspect: "Exit Code 1",
        meaning: "Uncaught Fatal Error",
        recommendedAction: "Logged error stack and exited; orchestrator restarts pod"
      }
    ],
    code: `// Production Process Signal and Lifecycle Handler
import process from 'node:process';

// 1. Parsing Command Line Flags
const args = process.argv.slice(2);
console.log('CLI arguments passed:', args);

// 2. Trapping Unhandled Promise Rejections (Production Safety)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ FATAL: Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // In production, exit to let Kubernetes restart a fresh, uncorrupted pod
  process.exit(1);
});

// 3. Trapping Uncaught Exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ FATAL: Uncaught Exception thrown:', error);
  process.exit(1);
});

// 4. Graceful Shutdown on SIGTERM (Docker/Kubernetes lifecycle)
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received. Closing database pools and active connections...');
  // Simulate closing database pool
  setTimeout(() => {
    console.log('Clean shutdown completed. Exiting code 0.');
    process.exit(0);
  }, 500);
});`,
    keyTakeaways: [
      "process is a global EventEmitter controlling process lifecycle, signals, memory, and exit codes.",
      "Always trap SIGTERM in containerized environments to ensure graceful zero-downtime shutdown.",
      "Always exit with code 0 on clean shutdown; exit with non-zero (e.g. 1) on uncaught fatal errors so orchestrators trigger container restarts.",
      "Never ignore unhandledRejection or uncaughtException; log the diagnostics and exit cleanly to prevent state corruption."
    ]
  },
  {
    id: "4.2",
    title: "9. Buffers & Binary Data Handling",
    content: `### 1. Topic Overview & Mental Model
V8 JavaScript originally had no mechanism for reading or manipulating raw binary byte streams (e.g., TCP network packets, image files, encrypted blobs).
- A **Buffer** is a fixed-size chunk of raw binary memory allocated **outside the V8 JavaScript heap** directly by Node's C++ layer.
- **Mental Model**: The Shipping Container.
  - V8 Heap variables are neatly unpacked furniture inside your living room.
  - A Buffer is a raw wooden crate in the loading dock containing unformatted raw bytes (0x00 to 0xFF). JavaScript can peek into the crate or ship it across the network without converting it into expensive UTF-8 strings.

### 2. Allocation Strategies: Buffer.alloc vs Buffer.allocUnsafe
1. **\`Buffer.alloc(size)\` (Safe & Default)**:
   - Allocates memory and **initializes every byte to zero** (\`0x00\`).
   - Slower, but completely safe from security data leaks.
2. **\`Buffer.allocUnsafe(size)\` (High Performance, Security Hazard)**:
   - Allocates memory **without zero-filling**. The allocated memory segment may contain remnant "dirty bytes" from previous memory operations (such as decrypted passwords, database credentials, or private keys!).
   - If sent over the network before being overwritten, it constitutes a severe **Information Disclosure Vulnerability**!
3. **Buffer Slicing vs Copying**:
   - In Node.js, \`buf.subarray()\` (or legacy \`buf.slice()\`) returns a **view over the same underlying memory allocation**! Modifying the slice mutates the original buffer. Use \`buf.copy()\` or \`Buffer.from(buf)\` if an independent clone is required.`,
    comparisonTable: [
      {
        aspect: "Buffer Method",
        allocation: "Buffer.alloc(size)",
        memoryInit: "Zero-filled (0x00)",
        securityProfile: "100% Safe from memory leakage",
        performance: "Standard"
      },
      {
        aspect: "Buffer Method",
        allocation: "Buffer.allocUnsafe(size)",
        memoryInit: "Uninitialized dirty memory",
        securityProfile: "HAZARD: Can expose sensitive residual RAM data",
        performance: "Fastest (skips zeroing)"
      },
      {
        aspect: "Buffer Method",
        allocation: "Buffer.from(array/string)",
        memoryInit: "Populated with data",
        securityProfile: "Safe; copies source bytes",
        performance: "Proportional to data length"
      }
    ],
    code: `// Inspecting Buffers, Byte Lengths, and Encodings
import { Buffer } from 'node:buffer';

// 1. Safe Allocation vs String Length Pitfall
const str = 'Node.js 🚀'; // Contains a 4-byte emoji!
console.log('String character length:', str.length); // 9 characters
console.log('Buffer byte length (UTF-8):', Buffer.byteLength(str, 'utf8')); // 12 bytes!

// 2. Converting between Encodings (Hex, Base64, UTF-8)
const buf = Buffer.from('Senior Full Stack Architect', 'utf8');
const base64Data = buf.toString('base64');
console.log('Base64 Encoded:', base64Data);

const restoredBuf = Buffer.from(base64Data, 'base64');
console.log('Restored UTF-8:', restoredBuf.toString('utf8'));

// 3. Subarray (Memory View) Mutation Gotcha
const original = Buffer.from([10, 20, 30, 40, 50]);
const view = original.subarray(0, 2);
view[0] = 99; // ⚠️ Mutates the original buffer directly!
console.log('Original after slice mutation:', original); // <Buffer 63 14 1e 28 32>`,
    keyTakeaways: [
      "Buffers represent raw binary memory allocated in C++ outside the V8 heap.",
      "String.length counts UTF-16 code units; Buffer.byteLength counts actual physical bytes.",
      "Never use Buffer.allocUnsafe unless you immediately overwrite every single byte before reading or transmitting.",
      "Buffer.subarray returns a shared memory view; mutating the view mutates the parent buffer."
    ]
  },
  {
    id: "4.3",
    title: "10. Streams, Backpressure, stream.pipeline Architecture & Async Iterators",
    content: `### 1. Topic Overview & Mental Model
Reading a 5GB file or streaming 100,000 database rows into memory using \`fs.readFile()\` will immediately crash a Node.js server with an **Out Of Memory (OOM) heap limit error**.
- **Streams** allow processing data piece by piece (**chunks**) sequentially without loading the entire asset into RAM.
- **The 4 Stream Classes**:
  1. \`Readable\`: Source of data (e.g. \`fs.createReadStream\`, \`req\` in Express).
  2. \`Writable\`: Destination for data (e.g. \`fs.createWriteStream\`, \`res\` in Express).
  3. \`Duplex\`: Both readable and writable (e.g. TCP \`net.Socket\`).
  4. \`Transform\`: Duplex stream that modifies data as it passes through (e.g. \`zlib.createGzip()\`, crypto cipher).
- **The Backpressure Problem**: Occurs when a fast data producer (e.g. reading from a fast NVMe SSD at 500MB/s) overwhelms a slow consumer (e.g. sending over a slow 3G cellular network at 200KB/s). Without backpressure control, the unconsumed chunks queue up in RAM, exploding memory usage.

### 2. Backpressure Internal Flow
- Every stream has an internal buffer governed by **\`highWaterMark\`** (default 64KB for byte streams, 16 objects for object-mode streams).
- When a producer calls \`writable.write(chunk)\`, it returns \`true\` if buffer $< \\text{highWaterMark}\$.
- When the buffer fills up, \`write()\` returns **\`false\`**. The producer **MUST pause reading**.
- When the consumer empties its internal buffer, it emits the **\`'drain'\`** event. The producer listens for \`'drain'\` and resumes writing.

### 3. stream.pipeline vs legacy .pipe()
- **Why \`.pipe()\` is an Anti-Pattern**: \`readable.pipe(transform).pipe(writable)\` does **NOT** forward errors! If the middle transform stream fails, the destination writable stream remains open, causing **file descriptor and socket leaks**.
- **The Solution: \`stream.pipeline()\`**: Natively cleans up all streams, handles error forwarding, and safely closes file descriptors if any stream fails.`,
    comparisonTable: [
      {
        aspect: "Stream Feature",
        legacyPipe: "readable.pipe(writable)",
        modernPipeline: "stream.pipeline(read, xform, write, cb)",
        asyncIterator: "for await (const chunk of stream)"
      },
      {
        aspect: "Error Handling",
        legacyPipe: "Fragile; errors do not propagate",
        modernPipeline: "Guaranteed complete error cleanup",
        asyncIterator: "Standard try/catch block"
      },
      {
        aspect: "Resource Cleanup",
        legacyPipe: "Risk of unclosed file descriptors",
        modernPipeline: "Destroys all streams on failure",
        asyncIterator: "Destroys stream if loop breaks"
      },
      {
        aspect: "Backpressure",
        legacyPipe: "Automatic",
        modernPipeline: "Automatic",
        asyncIterator: "Automatic pull-based backpressure"
      }
    ],
    code: `// Production Streaming with Backpressure, Compression & stream.pipeline/promises
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

export async function compressFileGzip(sourcePath, destinationPath) {
  console.log(\`Starting streaming compression: \${sourcePath} -> \${destinationPath}\`);
  
  try {
    // Pipeline automatically handles backpressure and cleans up all handles!
    await pipeline(
      fs.createReadStream(sourcePath, { highWaterMark: 64 * 1024 }), // 64KB chunks
      zlib.createGzip({ level: 6 }),                                // Transform chunk
      fs.createWriteStream(destinationPath)                         // Writable destination
    );
    console.log('✅ File compressed cleanly with zero memory bloat.');
  } catch (err) {
    console.error('❌ Pipeline failed safely without leaking file handles:', err);
    throw err;
  }
}

// Consuming a stream using Modern Async Iterators (for await...of)
export async function countStreamLines(readableStream) {
  let lineCount = 0;
  readableStream.setEncoding('utf8');
  
  // Pulls chunks on demand — native backpressure!
  for await (const chunk of readableStream) {
    lineCount += (chunk.match(/\\n/g) || []).length;
  }
  return lineCount;
}`,
    keyTakeaways: [
      "Streams process data sequentially in chunks, preventing high-memory heap exhaustion.",
      "Backpressure occurs when the producer outpaces the consumer; writable.write() returns false and producer must wait for drain.",
      "Never use readable.pipe() in production because it leaks file descriptors on errors; always use stream.pipeline() or stream/promises.",
      "Async iterators (for await...of) provide pull-based backpressure with standard try/catch error handling."
    ]
  },
  {
    id: "4.4",
    title: "11. File System APIs, Path Normalization & WHATWG URL Handling",
    content: `### 1. Topic Overview & Mental Model
Node.js interacts with disk storage and URL routing via \`node:fs\`, \`node:path\`, and the WHATWG \`URL\` standard.
- Synchronous file calls (\`fs.readFileSync\`) block the single V8 execution thread completely.
- Relative path concatenation with string interpolation (\`dir + '/' + file\`) causes catastrophic **cross-platform bugs** (Windows uses \`\\\`, Linux uses \`/\`) and **Path Traversal Security Vulnerabilities** (\`../../etc/passwd\`).
- The legacy \`url.parse()\` method has multiple known CVE security vulnerabilities (SSRF and open-redirect bypasses) and is deprecated in favor of the WHATWG \`URL\` class.

### 2. File System Best Practices
1. **Always use \`node:fs/promises\`**:
   - Modern async/await without nested callback hell.
2. **Atomic File Writes**:
   - Never write directly to a critical configuration or data file. If the server loses power or crashes halfway through, the file is corrupted!
   - Best practice: Write to a temporary file (\`file.tmp\`), and then call \`fs.rename()\` (which is an atomic operation in operating system file systems).
3. **Safe Path Resolution**:
   - \`path.join()\`: Joins path segments using platform-specific separators and normalizes \`.\` and \`..\`.
   - \`path.resolve()\`: Resolves path segments into an **absolute path**, starting from \`process.cwd()\`.`,
    comparisonTable: [
      {
        aspect: "API / Feature",
        fsSync: "fs.readFileSync",
        fsAsync: "fs.readFile (callback)",
        fsPromises: "node:fs/promises (modern)"
      },
      {
        aspect: "Execution",
        fsSync: "Blocks V8 main thread completely",
        fsAsync: "Non-blocking via Libuv thread pool",
        fsPromises: "Non-blocking with Promise syntax"
      },
      {
        aspect: "Path Traversal Defense",
        fsSync: "path.join + path.resolve whitelist validation",
        fsAsync: "path.join + path.resolve whitelist validation",
        fsPromises: "path.join + path.resolve whitelist validation"
      },
      {
        aspect: "URL Standard",
        fsSync: "Legacy url.parse (Deprecated / Insecure)",
        fsAsync: "Legacy url.parse (Deprecated / Insecure)",
        fsPromises: "WHATWG new URL() (Strict standard)"
      }
    ],
    code: `// Safe File Operations, Path Traversal Defense & WHATWG URL Parsing
import fs from 'node:fs/promises';
import path from 'node:path';

// 1. Path Traversal Security Defense
const BASE_STORAGE_DIR = path.resolve('./safe_uploads');

export async function readUserFileSafely(userFilename) {
  // Prevent attackers passing: "../../etc/passwd"
  const safePath = path.resolve(BASE_STORAGE_DIR, path.normalize(userFilename));

  // Verify resolved path stays strictly inside allowed directory
  if (!safePath.startsWith(BASE_STORAGE_DIR)) {
    throw new Error('Access Denied: Path Traversal Attempt Detected');
  }

  return await fs.readFile(safePath, 'utf8');
}

// 2. Modern WHATWG URL Parsing
const requestUrl = new URL('https://api.example.com:8080/v1/users?role=admin&sort=desc#profile');
console.log({
  protocol: requestUrl.protocol, // 'https:'
  hostname: requestUrl.hostname, // 'api.example.com'
  port: requestUrl.port,         // '8080'
  pathname: requestUrl.pathname, // '/v1/users'
  role: requestUrl.searchParams.get('role'), // 'admin'
  hash: requestUrl.hash          // '#profile'
});`,
    keyTakeaways: [
      "Always use node:fs/promises for clean async/await file operations; never call sync fs methods inside request handlers.",
      "Use path.join and path.resolve; verify path.startsWith(baseDir) to prevent path traversal attacks.",
      "Legacy url.parse is deprecated and vulnerable to SSRF; always use the standard WHATWG URL and URLSearchParams classes.",
      "Use atomic write-and-rename patterns to prevent corrupted files during sudden server restarts."
    ]
  },
  {
    id: "4.5",
    title: "12. Events & EventEmitter Architecture: Patterns, Leaks & Error Handling",
    content: `### 1. Topic Overview & Mental Model
Much of the Node.js core standard library (\`http.Server\`, \`fs.ReadStream\`, \`net.Socket\`, \`process\`) is built on top of the **EventEmitter** pattern.
- Allows objects to communicate asynchronously using a decoupled Publish/Subscribe (Pub/Sub) pattern.
- **Mental Model**: The Radio Broadcast Station.
  - The station (\`EventEmitter\`) broadcasts signals on specific frequencies (\`event names\`).
  - Listeners tune in (\`emitter.on('event', callback)\`).
  - When the DJ speaks (\`emitter.emit('event', data)\`), all tuned radios receive the audio simultaneously.

### 2. Critical EventEmitter Rules
1. **The Unhandled 'error' Event Crash**:
   - If an EventEmitter emits an \`'error'\` event and there is **no listener attached for \`'error'\`**, Node.js treats it as an uncaught exception, prints the stack trace, and **crashes the entire process**!
   - Rule: Always attach an \`emitter.on('error', handler)\` to every EventEmitter.
2. **Synchronous Listener Execution**:
   - By default, EventEmitter calls all registered listener functions **synchronously** in the order they were registered. A slow or blocking listener delays all subsequent listeners!
3. **The MaxListenersExceeded Memory Leak**:
   - By default, Node emits a console warning if more than **10 listeners** are added to a single event on an emitter.
   - This warning is a defensive indicator: it usually means code inside an HTTP request handler is repeatedly attaching \`emitter.on('data')\` without ever removing it, causing an unbounded memory leak.`,
    comparisonTable: [
      {
        aspect: "EventEmitter Feature",
        detail: "emitter.on(event, fn)",
        behavior: "Executes on EVERY emitted event indefinitely"
      },
      {
        aspect: "EventEmitter Feature",
        detail: "emitter.once(event, fn)",
        behavior: "Executes once and automatically unregisters itself"
      },
      {
        aspect: "EventEmitter Feature",
        detail: "emitter.emit('error', err)",
        behavior: "CRASHES process if no error listener is registered!"
      },
      {
        aspect: "EventEmitter Feature",
        detail: "MaxListeners Warning",
        behavior: "Triggers warning at >10 listeners to detect leak bugs"
      }
    ],
    code: `// Resilient EventEmitter Architecture with Error Trapping and Memory Hygiene
import { EventEmitter } from 'node:events';

class PaymentProcessingGateway extends EventEmitter {
  constructor() {
    super();
    // Increase threshold only if deliberately architected for high subscriber count
    this.setMaxListeners(20);
  }

  processPayment(orderId, amount) {
    if (amount <= 0) {
      // ⚠️ Must have an 'error' listener registered or process crashes!
      this.emit('error', new Error(\`Invalid payment amount \${amount} for order \${orderId}\`));
      return;
    }

    this.emit('payment:started', { orderId, amount });
    
    // Simulate async payment provider
    setTimeout(() => {
      this.emit('payment:completed', { orderId, transactionId: 'txn_9824' });
    }, 100);
  }
}

const gateway = new PaymentProcessingGateway();

// 1. Mandatory Error Listener
gateway.on('error', (err) => {
  console.error('Handled payment error safely without crash:', err.message);
});

// 2. Normal Listeners
gateway.on('payment:started', (data) => console.log('Payment initiated:', data));
gateway.once('payment:completed', (data) => console.log('Payment finalized:', data));

gateway.processPayment('ORD-1', -50); // Triggers error safely
gateway.processPayment('ORD-2', 150); // Triggers success`,
    keyTakeaways: [
      "EventEmitter listeners execute synchronously in the order they were registered.",
      "An unhandled 'error' event on any EventEmitter throws an uncaught exception and crashes the process.",
      "MaxListenersExceededWarning indicates that event handlers are repeatedly attached without being removed.",
      "Use emitter.once() for one-time events to prevent accidental listener retention leaks."
    ]
  },
  {
    id: "4.6",
    title: "13. Crypto APIs: Hashes, HMACs, UUIDs, Random Bytes & Timing Attacks",
    content: `### 1. Topic Overview & Mental Model
The \`node:crypto\` module provides cryptographic bindings backed by OpenSSL.
- It covers hashing (SHA-256), Message Authentication Codes (HMAC), digital signatures, symmetric encryption (AES-256-GCM), cryptographically secure random bytes, and timing-safe comparisons.
- **Mental Model**: The Wax Seal and The Vault.
  - A **Hash** is a digital fingerprint of data (one-way).
  - An **HMAC** is a digital fingerprint stamped with your secret wax seal (proves who sent it and that it wasn't modified).
  - A **Timing Attack** is a burglar listening to the clicks of a combination safe with a stethoscope to measure microsecond differences in how fast the lock opens.

### 2. Critical Security Principles
1. **\`Math.random()\` vs \`crypto.randomBytes()\`**:
   - Never use \`Math.random()\` for tokens, passwords, session IDs, or password resets! \`Math.random()\` uses a pseudo-random algorithm (xorshift128+) whose future outputs can be predicted by an attacker after observing a few outputs.
   - Always use \`crypto.randomBytes()\` or \`crypto.randomUUID()\`.
2. **Timing Attacks & \`crypto.timingSafeEqual\`**:
   - When comparing signatures (e.g. Stripe/Razorpay webhooks or password hashes), standard string equality (\`a === b\`) stops comparison at the **first non-matching character** (early exit).
   - An attacker measuring request latency over thousands of requests can deduce the secret character-by-character based on nanosecond response delays!
   - **Defense**: Always use \`crypto.timingSafeEqual(bufferA, bufferB)\` which takes identical execution time regardless of where mismatches occur.`,
    comparisonTable: [
      {
        aspect: "Crypto Primitive",
        operation: "crypto.createHash('sha256')",
        reversibility: "One-Way (Irreversible)",
        useCase: "Data integrity verification, checksums, deduplication"
      },
      {
        aspect: "Crypto Primitive",
        operation: "crypto.createHmac('sha256', secret)",
        reversibility: "One-Way with Secret Key",
        useCase: "Stripe/Razorpay webhook signatures, API authentication"
      },
      {
        aspect: "Crypto Primitive",
        operation: "crypto.randomBytes(32)",
        reversibility: "CSPRNG (Cryptographically Secure)",
        useCase: "Session tokens, reset tokens, encryption IVs"
      },
      {
        aspect: "Crypto Primitive",
        operation: "crypto.timingSafeEqual(bufA, bufB)",
        reversibility: "Constant-Time Comparison",
        useCase: "Webhook signature validation, authentication tokens"
      }
    ],
    code: `// Cryptographic Security: HMAC Signature Verification with Timing Attack Defense
import crypto from 'node:crypto';

export function verifyWebhookSignature(payloadString, signatureHeader, secretKey) {
  // 1. Compute expected HMAC-SHA256 signature
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest('hex');

  // 2. Convert to equal-length Buffers
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const receivedBuffer = Buffer.from(signatureHeader, 'utf8');

  // If buffer lengths differ, fail immediately
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  // 3. Constant-Time Comparison (Timing Attack Defense!)
  // Takes constant time regardless of how many bytes match!
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

// Generate Secure Tokens and UUIDs
console.log('Secure Token (hex):', crypto.randomBytes(32).toString('hex'));
console.log('RFC 4122 v4 UUID:', crypto.randomUUID());`,
    keyTakeaways: [
      "Never use Math.random() for security; always use crypto.randomBytes() or crypto.randomUUID().",
      "Standard string comparison (===) is vulnerable to timing attacks; always use crypto.timingSafeEqual for signature and token checks.",
      "Hashes (SHA-256) verify data integrity; HMACs verify both integrity and authenticity using a shared secret.",
      "Buffer lengths must be identical before calling crypto.timingSafeEqual, otherwise it throws a RangeError."
    ]
  },
  {
    id: "4.7",
    title: "14. Networking, DNS Resolution & HTTP Server Fundamentals",
    content: `### 1. Topic Overview & Mental Model
Node.js network programming is split across low-level and high-level modules:
- \`node:net\`: Raw TCP streams and socket servers.
- \`node:http\`: High-level HTTP server and client built on top of \`net.Socket\`.
- \`node:dns\`: Domain name resolution.
- **The DNS Threadpool Hazard**: Node's \`dns.lookup()\` uses the operating system's \`getaddrinfo()\` C library call, which is **synchronous and blocks a thread in the Libuv thread pool**! If a service makes hundreds of outgoing HTTP requests to external domains, it can saturate all 4 Libuv threads, stalling file I/O!
- **The Solution**: Use \`dns.resolve4()\` (or \`dns.promises.resolve4()\`) which uses \`c-ares\` to perform non-blocking asynchronous DNS queries across the network without touching the Libuv thread pool.

### 2. HTTP Server Mechanics
- \`http.createServer((req, res) => ...)\`:
  - \`req\` is a **Readable Stream** (\`http.IncomingMessage\`) providing headers and streaming body chunks.
  - \`res\` is a **Writable Stream** (\`http.ServerResponse\`) accepting headers, chunked transfer encoding, and body data.
  - Connections support HTTP/1.1 persistent connections (\`keep-alive\`) by default.`,
    comparisonTable: [
      {
        aspect: "DNS Function",
        api: "dns.lookup('example.com')",
        threadPool: "USES Libuv Thread Pool (Blocks 1 thread)",
        resolutionEngine: "OS getaddrinfo (respects /etc/hosts)"
      },
      {
        aspect: "DNS Function",
        api: "dns.resolve4('example.com')",
        threadPool: "ZERO Thread Pool (Asynchronous)",
        resolutionEngine: "c-ares network resolver (ignores /etc/hosts)"
      }
    ],
    code: `// Low-Level HTTP Server and Non-Blocking DNS Resolution
import http from 'node:http';
import dns from 'node:dns/promises';

// 1. Non-Blocking DNS Resolution via c-ares (Bypasses Libuv Threadpool)
export async function lookupIpNonBlocking(hostname) {
  const addresses = await dns.resolve4(hostname);
  console.log(\`Resolved \${hostname} via c-ares to:\`, addresses);
  return addresses[0];
}

// 2. Raw HTTP Server demonstrating streaming body parsing
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === 'POST' && url === '/echo') {
    let bodyChunks = [];
    
    // req is a Readable Stream!
    req.on('data', (chunk) => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      const fullBody = Buffer.concat(bodyChunks).toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ receivedLength: fullBody.length, echo: fullBody }));
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// server.listen(4000);`,
    keyTakeaways: [
      "dns.lookup() blocks a thread in the Libuv thread pool; dns.resolve4() uses c-ares asynchronously without thread pool overhead.",
      "http.IncomingMessage (req) is a Readable Stream; http.ServerResponse (res) is a Writable Stream.",
      "Always set socket timeouts on raw HTTP servers to prevent Slowloris denial-of-service attacks.",
      "Buffers chunks in array and concatenate on 'end' event when parsing raw HTTP request bodies."
    ]
  }
];

// Update batch 1 with updated Part 4
batch1[3] = {
  id: 4,
  title: "Part 4 — Core Node.js APIs: Process, Buffers, Streams, Crypto & Network",
  badge: "Core Standard Library",
  color: "#f59e0b",
  sections: module3Part4Sections
};

// Write batch 1 to disk
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(batch1, null, 2));
console.log('Successfully updated batch 1 with comprehensive Module 2 & Module 3 Core APIs!');
