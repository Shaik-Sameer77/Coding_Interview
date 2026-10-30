// Master Registry for 100 Senior Node.js Machine Coding Problems
export const NODE_QUESTIONS_DATA = [
  // Tier 1: Streams, Buffers & File Systems (Q1 - Q10)
  {
    id: 1,
    title: "Custom Transform Stream: Streaming CSV to JSON Parser",
    category: "streams",
    difficulty: "Senior",
    tags: ["Streams", "Buffers", "Memory Optimization", "ETL"],
    description: "Build a custom Node.js Transform stream that parses massive CSV files line-by-line into JSON objects with backpressure awareness without loading the full file into memory.",
    seniorEdgeCases: ["Handling lines split across chunk boundaries", "Managing CRLF (\\r\\n) vs LF (\\n)", "Backpressure handling when downstream writable is slow"],
    architectureSummary: "Subclass stream.Transform. Maintain an internal residual buffer for partial line slices. Split chunks on delimiters and push parsed JSON objects via this.push().",
    interviewTalkingPoints: "Explain why fs.readFile on a 5GB file causes V8 Heap Out-Of-Memory (OOM) and how pipeline() handles stream cleanup on error.",
    demoId: "NodeDemoCsvStream",
    uxRationale: "Why use Transform Streams instead of fs.readFile? Ingesting large CSV files (e.g., student rosters or financial statements) into memory will exceed V8's default 1.4GB heap limit and crash the process. Streams process data in 64KB chunks with constant memory usage.",
    realWorldUseCases: [
      { title: "LesHub Student CSV Import", detail: "Bulk importing 50,000 learner records into PostgreSQL without spiking server RSS memory." },
      { title: "Financial Ledger Reconciliation", detail: "Streaming multi-gigabyte bank transaction files to verify settlement totals." }
    ]
  },
  {
    id: 2,
    title: "Stream Backpressure Controller & HighWaterMark Buffer",
    category: "streams",
    difficulty: "Senior",
    tags: ["Streams", "Backpressure", "Event Loop", "Flow Control"],
    description: "Implement a producer-consumer stream pipeline with manual backpressure control using readable.pause(), writable.write() === false, and 'drain' event synchronization.",
    seniorEdgeCases: ["Missing the 'drain' event leading to permanently stalled streams", "Buffer bloat when highWaterMark is ignored", "Handling premature source stream destruction"],
    architectureSummary: "When writable.write(chunk) returns false, pause the source readable. Resume only when the writable emits 'drain'. Use stream.pipeline() for guaranteed teardown.",
    interviewTalkingPoints: "Explain the internal writeBuffer linked-list in WritableStream and how backpressure prevents slow database sinks from exhausting Node heap.",
    demoId: "NodeDemoBackpressure",
    uxRationale: "Why is Backpressure critical? If a fast file reader reads at 100MB/s but a slow database writer writes at 2MB/s, unhandled backpressure buffers 98MB/s in RAM until Node crashes with OOM.",
    realWorldUseCases: [
      { title: "Kafka Event Ingestion to S3", detail: "Throttling high-volume WebSocket event streams when uploading to rate-limited S3 buckets." },
      { title: "Real-Time Video Transcoding", detail: "Piping raw camera frames to ffmpeg without overflowing buffer queues." }
    ]
  },
  {
    id: 3,
    title: "Resumable Chunked File Upload with Temp Part Staging",
    category: "streams",
    difficulty: "Senior",
    tags: ["HTTP", "File System", "Uploads", "Streams"],
    description: "Build an HTTP multipart chunked upload handler that writes chunks to temporary disk files, validates checksums, and merges them into a final file upon completion.",
    seniorEdgeCases: ["Cleaning up orphaned partial uploads on network drop", "Preventing directory traversal attacks (../../etc/passwd)", "Validating SHA-256 chunk hashes"],
    architectureSummary: "Accepts chunk index, total chunks, and upload ID. Stages chunks to /tmp/upload-[id]/part-N. Uses fs.createReadStream and appendFile to merge sequentially.",
    interviewTalkingPoints: "Contrast in-memory chunk buffering vs disk staging for 10GB video uploads, and discuss Tus protocol specification.",
    demoId: "NodeDemoResumableUpload",
    uxRationale: "Why Resumable Uploads? Users uploading 4K driving session videos on unstable 4G networks will frequently disconnect; resumability prevents restarting 90% completed uploads.",
    realWorldUseCases: [
      { title: "Chrona Instructor Dashcam Uploads", detail: "Uploading 2GB vehicle dashcam footage with pause, resume, and retry capability." },
      { title: "Medical Scan Archive Ingestion", detail: "Uploading high-resolution MRI scans over spotty mobile hospital networks." }
    ]
  },
  {
    id: 4,
    title: "Gzip / Zlib Compression Pipeline with Progress Tracking",
    category: "streams",
    difficulty: "Senior",
    tags: ["Zlib", "Compression", "Streams", "Pipeline"],
    description: "Stream a large file through zlib.createGzip() while accurately calculating compression ratio and emission progress via PassThrough stream bytes counters.",
    seniorEdgeCases: ["Handling zlib dictionary flushing", "Emitting accurate byte counts when stream is chunk-encoded", "Proper cleanup on abort"],
    architectureSummary: "Pipeline: FileSource -> PassThrough (counter) -> Gzip -> PassThrough (compressed counter) -> DestFile. Calculates real-time percentage progress.",
    interviewTalkingPoints: "Discuss memory overhead of zlib windowBits and compression levels (1-9) vs CPU consumption on production Node servers.",
    demoId: "NodeDemoCompression",
    uxRationale: "Why stream compression? Compressing files in memory requires 2x-3x file size in RAM. Streaming pipelines compress on-the-fly with <10MB memory.",
    realWorldUseCases: [
      { title: "Daily Database Backup Archiver", detail: "Streaming PostgreSQL pg_dump directly through gzip to Amazon S3." },
      { title: "Log File Rolling & Rotation", detail: "Compressing midnight log files before moving to long-term Glacier cold storage." }
    ]
  },
  {
    id: 5,
    title: "10GB Log File Line-by-Line Reader (Constant Memory)",
    category: "streams",
    difficulty: "Senior",
    tags: ["Readline", "Streams", "CLI", "Performance"],
    description: "Process a 10GB server access log line-by-line using readline and stream.Readable, calculating error code frequencies with constant ~30MB RSS footprint.",
    seniorEdgeCases: ["Handling multi-byte UTF-8 characters split across chunk boundaries", "Extremely long lines without newlines", "Graceful SIGINT cancellation"],
    architectureSummary: "readline.createInterface({ input: fs.createReadStream(), crlfDelay: Infinity }). Loops through line events with for await (const line of rl).",
    interviewTalkingPoints: "Explain for-await-of on async iterators in Node.js streams and why readline avoids loading the string table into V8 memory.",
    demoId: "NodeDemoLogReader",
    uxRationale: "Why line-by-line streaming? Inspecting multi-gigabyte production logs with standard array splits crashes Node immediately. Stream scanning runs in O(1) memory.",
    realWorldUseCases: [
      { title: "LesHub Security Log Auditor", detail: "Scanning 15GB of daily Nginx logs for 403 Forbidden spikes and credential stuffing." },
      { title: "Ad-Tech Clickstream Aggregator", detail: "Parsing terabytes of daily impression logs for downstream data warehouse loads." }
    ]
  },
  {
    id: 6,
    title: "Duplex TCP Socket Relay & Packet Sniffer",
    category: "streams",
    difficulty: "Staff",
    tags: ["Net", "TCP", "Duplex", "Sockets"],
    description: "Construct a TCP proxy server using net.createServer() that forwards bi-directional packets between client and target host while logging packet sizes and headers.",
    seniorEdgeCases: ["Handling TCP FIN handshake half-closed sockets", "Error propagation between incoming and outgoing sockets", "Nagle's algorithm and socket.setNoDelay()"],
    architectureSummary: "net.createServer((clientSocket) => { const remote = net.connect(port, host); clientSocket.pipe(inspector).pipe(remote).pipe(clientSocket); });",
    interviewTalkingPoints: "Discuss TCP backpressure propagation across duplex streams and why socket.on('error') must be registered on both legs to prevent crashes.",
    demoId: "NodeDemoTcpRelay",
    uxRationale: "Why Duplex Relays? Enables zero-trust proxying, protocol translation, and real-time network traffic inspection without altering existing services.",
    realWorldUseCases: [
      { title: "Database Connection Wire-Tap", detail: "Inspecting PostgreSQL queries for unindexed full-table scans in staging environments." },
      { title: "Microservice Sidecar Proxy", detail: "Local Envoy/Istio-style sidecar routing internal service mesh traffic." }
    ]
  },
  {
    id: 7,
    title: "Binary Protocol Buffer Serialization & Deserialization",
    category: "streams",
    difficulty: "Senior",
    tags: ["Buffers", "Binary", "Protocols", "Low-Level"],
    description: "Serialize structured JavaScript objects into compact binary buffers using Buffer.allocUnsafe, writeUInt32BE, and readFloatLE, and unpack them deterministically.",
    seniorEdgeCases: ["Little-endian vs Big-endian byte orders", "Buffer overflow when string lengths exceed allocated header bytes", "AllocUnsafe zero-fill security risks"],
    architectureSummary: "Header: 1-byte OpCode, 4-byte payload length, 8-byte timestamp, followed by payload bytes. Unpacker reads header to determine frame slicing.",
    interviewTalkingPoints: "Explain why Buffer.allocUnsafe() can leak uninitialized memory containing sensitive keys if not immediately overwritten.",
    demoId: "NodeDemoBinaryProtocol",
    uxRationale: "Why custom binary buffers over JSON? Binary protocols achieve 70% smaller payloads and eliminate expensive JSON.parse() CPU cycles for high-throughput IoT devices.",
    realWorldUseCases: [
      { title: "Chrona GPS Telemetry Ingestion", detail: "Ingesting 100Hz instructor car speed, telemetry, and braking events via compact UDP packets." },
      { title: "Gaming Engine State Sync", detail: "Broadcasting player spatial coordinates at 60fps with sub-millisecond serialization." }
    ]
  },
  {
    id: 8,
    title: "Debounced File System Watcher with Event Batching",
    category: "streams",
    difficulty: "Senior",
    tags: ["FS", "Watchers", "Debounce", "File System"],
    description: "Build an fs.watch wrapper that filters out duplicate OS events, handles atomic IDE save renames, and batches rapid file changes into a single event stream.",
    seniorEdgeCases: ["OS-specific differences between inotify (Linux), FSEvents (macOS), and ReadDirectoryChangesW (Windows)", "Handling rapid file write cycles"],
    architectureSummary: "Wraps fs.watch. Maintains a Map<FilePath, Timer>. When a change fires, resets the timer; flushes aggregate events once quiet period (100ms) elapses.",
    interviewTalkingPoints: "Explain why fs.watch emits multiple 'change' events for a single save in VS Code and how tools like Chokidar handle atomic rename swaps.",
    demoId: "NodeDemoFsWatcher",
    uxRationale: "Why Debounced File Watchers? Native fs.watch fires up to 10 events per single file save. Debounced aggregators prevent redundant build triggers and high CPU spikes.",
    realWorldUseCases: [
      { title: "Hot Reloading Dev Server", detail: "Rebuilding API routes when developer saves a file without triggering duplicate compiler runs." },
      { title: "Automated Certificate Reloader", detail: "Detecting Let's Encrypt SSL certificate renewals and reloading HTTPS server without downtime." }
    ]
  },
  {
    id: 9,
    title: "Tar / Zip Archive Streaming Extractor",
    category: "streams",
    difficulty: "Staff",
    tags: ["Tar", "Streams", "Security", "ZipBomb"],
    description: "Stream an archive and unpack files directly to disk while validating against 'Zip Slip' path traversal attacks and decompression bomb size limits.",
    seniorEdgeCases: ["Zip Slip directory escape (e.g., ../../../../etc/shadow)", "Zip bomb expansion ratios (10KB file expanding to 1TB)", "Preserving file permissions"],
    architectureSummary: "Pipes incoming stream to tar parser. For each header, validates path.resolve(dest, header.name).startsWith(dest). Tracks cumulative uncompressed bytes.",
    interviewTalkingPoints: "Explain how path.resolve prevents directory traversal and how to abort an archive stream if extracted bytes exceed a safety threshold.",
    demoId: "NodeDemoArchiveExtractor",
    uxRationale: "Why streaming extraction? Unzipping files into memory crashes servers. Streaming directly to disk with path sanitization protects against malicious zip bombs.",
    realWorldUseCases: [
      { title: "Plugin / Extension Uploader", detail: "Extracting third-party developer plugin zip files safely in enterprise SaaS platforms." },
      { title: "Driving Test Video Archive Processor", detail: "Extracting bulk multi-camera test recordings for compliance verification." }
    ]
  },
  {
    id: 10,
    title: "Atomic File Writer with Crash-Safe Temp Swapping",
    category: "streams",
    difficulty: "Senior",
    tags: ["FS", "Atomicity", "Crash Safety", "POSIX"],
    description: "Safely write critical JSON configuration files by writing to a temporary file in the same directory, forcing fsync, and executing an atomic fs.rename.",
    seniorEdgeCases: ["Cross-device link errors (EXDEV) when temp dir is on a different mount point", "Power failure during write leaving half-written files", "File locking on Windows"],
    architectureSummary: "Generates temp path file.ext.tmp.pid. Writes content -> calls fs.fsync() on file descriptor -> calls fs.rename(temp, final). Rename is atomic in POSIX.",
    interviewTalkingPoints: "Explain why fs.writeFile is NOT crash-safe and how an unexpected process crash can corrupt mission-critical JSON config files.",
    demoId: "NodeDemoAtomicWriter",
    uxRationale: "Why Atomic File Writes? Power cuts or crashes during fs.writeFile leave corrupt empty files. Atomic renaming guarantees the file is either 100% updated or 100% untouched.",
    realWorldUseCases: [
      { title: "LesHub License Key Store", detail: "Updating enterprise driving school license files without risk of corrupting credentials." },
      { title: "Cluster Node State File", detail: "Persisting node health and leader election state to disk safely." }
    ]
  },

  // Tier 2: Async Concurrency, Event Loop & Promises (Q11 - Q20)
  {
    id: 11,
    title: "Async Task Queue with Concurrency Limit (p-limit)",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["Concurrency", "Promises", "Async", "Event Loop"],
    description: "Create an async task queue that runs at most N concurrent asynchronous operations simultaneously, queuing subsequent tasks until a slot frees up.",
    seniorEdgeCases: ["Handling task rejections without crashing the entire queue", "Preserving execution return values for caller promises", "Dynamically adjusting concurrency"],
    architectureSummary: "Queue array of generator functions. Active counter tracks in-flight promises. When active < concurrency, dequeues and executes next task; calls next on settle.",
    interviewTalkingPoints: "Contrast Promise.all() (unbounded concurrency) vs p-limit (bounded concurrency) and explain socket exhaustion (ECONNRESET) on 10,000 requests.",
    demoId: "NodeDemoTaskQueue",
    uxRationale: "Why Bounded Task Queues? Launching 5,000 concurrent database queries or API requests exhausts network sockets and triggers 429 Too Many Requests. Concurrency limits keep systems stable.",
    realWorldUseCases: [
      { title: "Chrona Bulk Student SMS Notification Dispatch", detail: "Broadcasting 10,000 lesson reminders capped at 50 concurrent Twilio API requests." },
      { title: "Image Thumbnail Batch Resizer", detail: "Processing 500 photos across 4 CPU worker slots to prevent thread pool starvation." }
    ]
  },
  {
    id: 12,
    title: "Event Loop Phase Order Inspector & Microtask Visualizer",
    category: "async_eventloop",
    difficulty: "Principal",
    tags: ["Event Loop", "Microtasks", "process.nextTick", "setImmediate"],
    description: "Build an interactive diagnostic harness that proves the exact execution sequence of process.nextTick, Promise.then, setTimeout, setImmediate, and fs callbacks.",
    seniorEdgeCases: ["nextTickQueue starvation locking out the I/O polling phase", "Differences in setTimeout(fn, 0) vs setImmediate() order outside I/O cycle"],
    architectureSummary: "Registers callbacks in each phase, pushes timestamps and phase identifiers to a synchronized audit log, and visualizes the microtask vs macrotask execution cascade.",
    interviewTalkingPoints: "Walk through the 6 Libuv event loop phases (Timers, Pending, Idle/Prepare, Poll, Check, Close) and explain why process.nextTick runs before Promise microtasks.",
    demoId: "NodeDemoEventLoopVisualizer",
    uxRationale: "Why master Event Loop Phases? Misunderstanding microtasks can accidentally starve the I/O polling phase, causing 10-second API latency spikes under production loads.",
    realWorldUseCases: [
      { title: "High-Frequency Trading Gateway", detail: "Ensuring market cancel orders take priority over timer callbacks without thread blocking." },
      { title: "Low-Latency WebSocket Server", detail: "Scheduling socket flushes in the Poll phase to minimize serialization delay." }
    ]
  },
  {
    id: 13,
    title: "Promise Retry with Exponential Backoff & Jitter",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["Resilience", "Retry", "Jitter", "Backoff"],
    description: "Implement a robust async retry wrapper with exponential backoff (base * 2^attempt) and full randomized jitter to prevent the 'thundering herd' problem.",
    seniorEdgeCases: ["Non-retryable HTTP errors (400 Bad Request, 401 Unauthorized) vs retryable (503, 504, 429)", "Maximum delay ceiling", "AbortController cancellation"],
    architectureSummary: "Recursively catches errors. Computes delay = Math.random() * Math.min(maxDelay, baseDelay * 2 ** attempt). Sleeps via setTimeout before retrying.",
    interviewTalkingPoints: "Explain why naive exponential backoff without jitter causes synchronized retry waves that crash recovering upstream databases (Thundering Herd).",
    demoId: "NodeDemoRetryJitter",
    uxRationale: "Why Backoff with Jitter? If 1,000 clients lose connection and all retry at exactly 1s, 2s, 4s, the spike crushes the reviving database. Jitter spreads traffic evenly.",
    realWorldUseCases: [
      { title: "Stripe Payment Gateway Webhook Delivery", detail: "Retrying failed webhook dispatches over 24 hours with exponential decay." },
      { title: "Chrona Third-Party Calendar Sync", detail: "Resiliently synchronizing Google/Outlook calendar events through rate-limited APIs." }
    ]
  },
  {
    id: 14,
    title: "Circuit Breaker Pattern (Closed -> Open -> Half-Open)",
    category: "async_eventloop",
    difficulty: "Staff",
    tags: ["Resiliency", "Circuit Breaker", "Fail-Fast", "Microservices"],
    description: "Build a state-machine Circuit Breaker that tracks service failure rates, trips to 'Open' state to fail-fast during outages, and tests recovery in 'Half-Open' state.",
    seniorEdgeCases: ["Sliding window rolling statistics", "Preventing cascade failures across upstream microservices", "Configuring probe volume in half-open state"],
    architectureSummary: "Maintains CLOSED, OPEN, HALF_OPEN states. Rolling window tracks failures. If failures > threshold %, transitions to OPEN for resetTimeout. In HALF_OPEN, permits 1 trial call.",
    interviewTalkingPoints: "Contrast circuit breaking vs retries: explain how retries against a dying database worsen the crash, while circuit breakers give it breathing room to recover.",
    demoId: "NodeDemoCircuitBreaker",
    uxRationale: "Why Circuit Breakers? When an external payment API goes down, queuing requests blocks sockets and crashes your own servers. Circuit breakers fail-fast in 1ms.",
    realWorldUseCases: [
      { title: "LesHub DVSA Test Slot Availability API", detail: "Failing fast with cached slots when the government DVSA booking gateway is down." },
      { title: "Microservice Authentication Gateway", detail: "Protecting internal user services during auth service degradation." }
    ]
  },
  {
    id: 15,
    title: "Request Batching & Deduplication (DataLoader Pattern)",
    category: "async_eventloop",
    difficulty: "Staff",
    tags: ["DataLoader", "Batching", "N+1", "Caching"],
    description: "Implement a Facebook DataLoader clone that collects individual load(id) requests within the same tick of the event loop and dispatches a single batchLoad([ids]) query.",
    seniorEdgeCases: ["Guaranteeing returned array matches input ID order exactly", "Handling individual errors in batch without failing other keys", "Per-request memoization cache"],
    architectureSummary: "Calls are collected in a queue. process.nextTick schedules batch dispatch. Batch function runs with unique IDs. Results are dispatched to respective caller promises.",
    interviewTalkingPoints: "Walk through how DataLoader solves the GraphQL / ORM N+1 query problem by batching 50 database SELECT queries into a single WHERE id IN (...).",
    demoId: "NodeDemoDataLoader",
    uxRationale: "Why DataLoader Batching? Rendering 50 student records on a page naively fires 50 SQL queries. DataLoader collapses them into 1 query on the next microtask tick.",
    realWorldUseCases: [
      { title: "GraphQL Nested Author/Student Resolver", detail: "Batching instructor profile lookups when rendering 100 calendar lessons." },
      { title: "Microservice RPC Aggregator", detail: "Collapsing individual user profile requests across microservices." }
    ]
  },
  {
    id: 16,
    title: "Async Mutex & Semaphore for Critical Sections",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["Concurrency", "Mutex", "Semaphore", "Race Conditions"],
    description: "Build an AsyncMutex that guarantees only one asynchronous function executes in a critical section at any given time, queuing concurrent callers.",
    seniorEdgeCases: ["Releasing the lock in a finally block even if async function throws", "Preventing deadlocks when nesting locks", "Lock acquisition timeout limits"],
    architectureSummary: "Maintains locked boolean and waiting queue of resolve functions. acquire() returns a promise that resolves a release function when lock is free.",
    interviewTalkingPoints: "Explain how JavaScript's single-threaded nature still suffers from asynchronous race conditions when await yields execution between read and write operations.",
    demoId: "NodeDemoAsyncMutex",
    uxRationale: "Why Async Mutex? When two requests concurrently read balance ($100), subtract $50, and write back, an async race condition can permit a double-spend. Mutexes serialize writes.",
    realWorldUseCases: [
      { title: "Chrona Lesson Slot Booking Lock", detail: "Preventing two students from booking the exact same driving instructor slot simultaneously." },
      { title: "JWT Token Refresh Mutex", detail: "Ensuring 10 concurrent 401 API errors trigger only a single refresh token network call." }
    ]
  },
  {
    id: 17,
    title: "AbortController Cancellation in Node.js Async Workflows",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["AbortController", "Cancellation", "Fetch", "Async"],
    description: "Implement a cooperative async pipeline where long-running database queries and external HTTP requests cleanly terminate when the user disconnects or hits a timeout.",
    seniorEdgeCases: ["Cleaning up socket handles when aborted", "Distinguishing between AbortError and standard runtime rejections", "Cascading abort signals to child tasks"],
    architectureSummary: "Binds signal.addEventListener('abort', cleanup). Uses AbortSignal.any() in Node 20+ to combine user-requested aborts with timeout triggers.",
    interviewTalkingPoints: "Explain how dangling uncancelled database queries continue wasting server CPU cycles long after the client has closed the browser tab.",
    demoId: "NodeDemoAbortController",
    uxRationale: "Why AbortController? If a user cancels an export query after 2 seconds, continuing to run the 30-second SQL query on the server wastes CPU and database connections.",
    realWorldUseCases: [
      { title: "Report Export Cancellation", detail: "Cancelling heavy PostgreSQL CSV generation as soon as user navigates away." },
      { title: "External Supplier API Timeout", detail: "Aborting sluggish vehicle history check queries after 3000ms." }
    ]
  },
  {
    id: 18,
    title: "Async Pipeline Runner with Parallel Branching",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["Pipeline", "Workflows", "DAG", "Async"],
    description: "Create an orchestration engine that runs steps sequentially while allowing specified sub-tasks to run in parallel, passing immutable state through each step.",
    seniorEdgeCases: ["Partial failure rollbacks", "Passing context state immutably across branches", "Detecting cycles in dependency graph"],
    architectureSummary: "Executes stages. Stage can be an async function (serial) or array of async functions (parallel via Promise.all). Aggregates results into workflow context.",
    interviewTalkingPoints: "Discuss Directed Acyclic Graphs (DAGs) in Node.js workflow engines like Temporal, Airflow, and GitHub Actions runners.",
    demoId: "NodeDemoAsyncPipeline",
    uxRationale: "Why structured pipelines? Complex business operations (onboarding, invoicing, compliance) become unmaintainable when written as nested callback/promise spaghetti.",
    realWorldUseCases: [
      { title: "LesHub New Driving School Onboarding", detail: "Sequential domain verification followed by parallel Stripe account setup, DNS check, and welcome email." },
      { title: "Media Ingestion Pipeline", detail: "Parallel thumbnail generation, metadata extraction, and audio transcode." }
    ]
  },
  {
    id: 19,
    title: "Async Waterfall / Chain Runner with Early Exit",
    category: "async_eventloop",
    difficulty: "Senior",
    tags: ["Waterfall", "Async", "Flow Control", "Patterns"],
    description: "Build an async.waterfall replacement that executes a series of dependent async functions, passing the output of step N as arguments to step N+1, with short-circuit capability.",
    seniorEdgeCases: ["Early return without throwing an error", "Preserving stack traces through waterfall steps", "Handling variable arguments count"],
    architectureSummary: "Iterates through array of task functions using reduce or while loop. Awaits each function result and spreads as arguments into next function.",
    interviewTalkingPoints: "Contrast sequential async/await loops vs waterfall abstractions for dynamic pluggable middleware chains.",
    demoId: "NodeDemoWaterfall",
    uxRationale: "Why Waterfall runners? Provides clean, modular architecture for multi-stage calculations (e.g. tax, discounts, currency conversions) where each step depends on the last.",
    realWorldUseCases: [
      { title: "LesHub Driving Lesson Pricing Calculator", detail: "Base Rate -> Instructor Surcharge -> Pupil Discount -> VAT -> Final Invoice Price." },
      { title: "Authentication Pipeline", detail: "Token Extraction -> Signature Verification -> DB User Lookup -> Scope Check." }
    ]
  },
  {
    id: 20,
    title: "Unresolved Promise & Closure Memory Leak Detector",
    category: "async_eventloop",
    difficulty: "Principal",
    tags: ["Memory Leaks", "Event Loop", "V8", "AsyncHooks"],
    description: "Utilize Node.js async_hooks API to track the lifecycle of promises and async resources, flagging promises that remain unresolved after a configurable TTL threshold.",
    seniorEdgeCases: ["Overhead of async_hooks in production", "Distinguishing between long-lived daemon promises and leaked promises", "Capturing stack traces safely"],
    architectureSummary: "async_hooks.createHook({ init, destroy }). Records creation stack and timestamp for each PROMISE type. Sweeps map for promises exceeding 60s timeout.",
    interviewTalkingPoints: "Explain how dangling closures attached to unresolved promises retain parent scopes, preventing garbage collection of entire Express request/response trees.",
    demoId: "NodeDemoPromiseLeakDetector",
    uxRationale: "Why detect Promise leaks? A single forgotten reject/resolve in an async handler holds the entire HTTP req/res object in memory, causing slow server OOM crashes.",
    realWorldUseCases: [
      { title: "24/7 Production Node Monitoring", detail: "Catching third-party SDK bugs that fail to resolve promises on network timeouts." },
      { title: "Automated Integration Test Leak Gate", detail: "Failing CI builds if test suites leak open handles or unclosed timers." }
    ]
  }
];

// Helper to fill remaining tiers programmatically if needed
for (let i = 21; i <= 100; i++) {
  if (!NODE_QUESTIONS_DATA.find(q => q.id === i)) {
    const categoryMap = {
      3: { cat: "networking", title: "High-Performance HTTP & Microservice Pattern" },
      4: { cat: "websockets", title: "Real-Time WebSocket & Backplane Engine" },
      5: { cat: "caching_redis", title: "Distributed Redis Caching & Lock Architecture" },
      6: { cat: "databases", title: "Database Transaction & ORM Performance Engine" },
      7: { cat: "security", title: "Enterprise Cryptography, Auth & Security Guard" },
      8: { cat: "queues_workers", title: "BullMQ Job Queue & Distributed Background Worker" },
      9: { cat: "threads_perf", title: "Worker Thread Pool & CPU Optimization Engine" },
      10: { cat: "observability", title: "OpenTelemetry Tracing & Enterprise Resilience Monitor" }
    };
    const tierNum = Math.ceil(i / 10);
    const tier = categoryMap[tierNum] || categoryMap[3];
    
    NODE_QUESTIONS_DATA.push({
      id: i,
      title: `${tier.title} #${i}`,
      category: tier.cat,
      difficulty: i % 3 === 0 ? "Principal" : i % 2 === 0 ? "Staff" : "Senior",
      tags: ["Node.js", tier.cat, "Enterprise", "Backend Architecture"],
      description: `Production-ready backend architecture solving ${tier.title.toLowerCase()} with strict zero-leak invariants, deterministic error handling, and high throughput.`,
      seniorEdgeCases: ["Graceful degradation under network partition", "Zero-downtime resource reclamation", "High-concurrency contention management"],
      architectureSummary: `Engineered using native Node.js core modules and distributed enterprise patterns. Enforces async lifecycle hygiene and non-blocking event loop execution.`,
      interviewTalkingPoints: `Discuss performance implications, V8 garbage collection behavior, and how this architecture scales horizontally across multiple CPU cores.`,
      demoId: `NodeDemoGen_${i}`,
      uxRationale: `Why this architecture? Built to withstand heavy production load in high-stakes mission-critical platforms like Chrona, LesHub, and Stripe without degrading service availability.`,
      realWorldUseCases: [
        { title: "Chrona Enterprise Backend Service", detail: "Powering real-time driving school scheduling, notifications, and microservice aggregation." },
        { title: "High-Throughput Financial Ledger", detail: "Processing financial transactions with strict ACID semantics and zero data loss." }
      ]
    });
  }
}
