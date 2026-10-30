// Deep Dives Registry for 100 Senior Node.js Machine Coding Problems
// Provides UX/System Rationales, Real-World Use Cases, and Senior Interview Q&A with Model Answers.

export const NODE_CURATED_DEEP_DIVES = {
  // N1: Custom Transform Stream: CSV to JSON
  1: {
    uxRationale: "Why use Transform Streams instead of fs.readFile()? Reading a 5GB CSV into memory loads the entire file into the V8 string table, which easily exceeds V8's default 1.4GB heap memory limit and triggers an instant Fatal Error: JavaScript Heap Out Of Memory crash. Transform streams process data in 64KB chunks with constant O(1) memory usage regardless of whether the file is 1MB or 1TB.",
    realWorldUseCases: [
      {
        title: "LesHub Bulk Student & Driving School Ingestion",
        detail: "Ingesting 100,000 learner driving records from CSV into PostgreSQL without spiking container memory limits."
      },
      {
        title: "Financial Bank Transaction Reconciliation",
        detail: "Parsing multi-gigabyte daily settlement reports line-by-line while calculating running totals."
      },
      {
        title: "Large-Scale Geolocation Point Ingestion",
        detail: "Transforming raw GPS coordinate dumps into GeoJSON features for map tile generation."
      }
    ],
    interviewQA: [
      {
        question: "How do you handle a line split directly across two consecutive 64KB stream chunks?",
        answer: "Maintain an internal residual buffer `this._tail = ''` in your Transform stream subclass. In `_transform(chunk, encoding, callback)`: prepend `this._tail` to the incoming chunk string. Split on `\\n`. The final slice of the split array is incomplete, so save it back to `this._tail = lines.pop()`. In `_flush(callback)`, push the remaining `this._tail` if non-empty."
      },
      {
        question: "Why should you always use stream.pipeline() instead of readable.pipe() in Node.js?",
        answer: "The legacy `readable.pipe(writable)` does NOT clean up or destroy underlying streams when an error occurs on either side, which leaks file descriptors and socket handles in production. `stream.pipeline()` automatically attaches error listeners to all streams in the chain and guarantees all streams are destroyed upon completion or failure."
      }
    ]
  },

  // N2: Stream Backpressure Controller
  2: {
    uxRationale: "Why is Backpressure management critical in high-throughput Node.js services? If a fast producer (e.g. 100MB/s disk or network socket) pumps data faster than a slow consumer (e.g. 2MB/s slow database write), Node's internal stream buffer (`_writableState.writeBuffer`) expands unboundedly in RAM until the process crashes from Out-Of-Memory. Backpressure synchronizes the producer to the consumer's ingestion rate.",
    realWorldUseCases: [
      {
        title: "Kafka Event Ingestion to S3",
        detail: "Throttling high-volume WebSocket event streams when uploading to rate-limited S3 buckets."
      },
      {
        title: "Real-Time Video Transcoding",
        detail: "Piping raw camera frames to ffmpeg without overflowing buffer queues."
      }
    ],
    interviewQA: [
      {
        question: "How does Node.js signal that backpressure has occurred during a stream write?",
        answer: "When `writable.write(chunk)` returns `false`, it signals that the destination buffer has exceeded its `highWaterMark` threshold. The producer MUST immediately call `readable.pause()` to stop reading. Once the consumer empties its internal buffer, the writable emits the `'drain'` event, signaling the producer to call `readable.resume()`."
      },
      {
        question: "What happens if a developer ignores the false return value of writable.write()?",
        answer: "The data is not lost, but Node.js buffers all excess chunks in a linked list in V8 heap memory. Under sustained high traffic, this buffer balloons uncontrollably, causing garbage collection thrashing and eventual process death."
      }
    ]
  },

  // N11: Async Task Queue with Concurrency Limit (p-limit)
  11: {
    uxRationale: "Why use bounded concurrency queues instead of Promise.all()? Firing `Promise.all(tasks)` with 10,000 tasks launches 10,000 asynchronous operations concurrently. This exhausts OS file descriptors, drains the Node.js Libuv thread pool, and triggers `ECONNRESET` or `429 Too Many Requests` from downstream APIs. A bounded task queue ensures steady, predictable throughput.",
    realWorldUseCases: [
      {
        title: "Chrona Bulk Student SMS Notification Dispatch",
        detail: "Broadcasting 10,000 lesson reminders capped at 50 concurrent Twilio API requests to respect upstream rate limits."
      },
      {
        title: "Batch Image Thumbnail Generator",
        detail: "Processing 500 photos across 4 CPU worker slots to prevent Libuv thread pool starvation."
      }
    ],
    interviewQA: [
      {
        question: "How do you implement an async concurrency limiter in pure JavaScript?",
        answer: "Maintain a `queue` array and an `activeCount` integer. A wrapper function returns a new Promise. If `activeCount < limit`, increment `activeCount` and execute the async task immediately. When settled, decrement `activeCount`, dequeue the next task, and call it. If `activeCount >= limit`, push a resolver function to `queue`."
      },
      {
        question: "What is the danger of running CPU-intensive operations inside standard Node.js promises?",
        answer: "Promises do NOT provide multi-threading. A CPU-intensive synchronous task (e.g. synchronous crypto, image resizing, large JSON parsing) blocks the single event loop thread, freezing all incoming HTTP connections until it finishes. CPU-bound work must be offloaded to Worker Threads."
      }
    ]
  },

  // N14: Circuit Breaker Pattern
  14: {
    uxRationale: "Why use a Circuit Breaker instead of continuous retries? When an external payment gateway or microservice experiences an outage, retrying failed requests causes a cascade of queue build-ups that exhausts sockets and crashes your own servers. A Circuit Breaker fails fast in 1ms, protecting your system and allowing the failing service breathing room to recover.",
    realWorldUseCases: [
      {
        title: "LesHub DVSA Test Slot Availability API",
        detail: "Failing fast with cached slots when the government DVSA booking gateway is down."
      },
      {
        title: "Stripe Payment Gateway Outage Protection",
        detail: "Short-circuiting checkout transactions and notifying users immediately during Stripe gateway degradation."
      }
    ],
    interviewQA: [
      {
        question: "Explain the three states of a Circuit Breaker and their transition triggers.",
        answer: "1. CLOSED: Requests pass normally. If failure rate exceeds threshold (e.g., 50% over 10s), trips to OPEN. 2. OPEN: All requests fail immediately without network call. After a cooldown timeout (e.g., 5s), transitions to HALF-OPEN. 3. HALF-OPEN: Permits a small probe of trial requests. If successful, resets to CLOSED; if any fail, returns to OPEN."
      },
      {
        question: "What is the difference between a sliding window count vs sliding window time in circuit breakers?",
        answer: "Count-based tracks the last N requests (e.g., last 100 calls); time-based tracks requests over the last N seconds (e.g., last 60 seconds). Time-based is superior for bursty traffic because it doesn't leave the breaker open indefinitely during periods of low activity."
      }
    ]
  }
};

// Generic Smart Generator for all 100 Node Questions
export function getNodeQuestionDeepDive(question) {
  if (NODE_CURATED_DEEP_DIVES[question.id]) {
    return NODE_CURATED_DEEP_DIVES[question.id];
  }

  const { title, category, tags, description, seniorEdgeCases, architectureSummary } = question;

  const defaultRationale = category === 'streams'
    ? `Why use streams? Node.js streams process datasets chunk-by-chunk in O(1) constant memory, preventing V8 Out-Of-Memory crashes and socket buffer exhaustion under heavy load.`
    : category === 'async_eventloop'
    ? `Why this async architecture? Prevents event loop blocking, handles Libuv thread pool capacity safely, and protects against asynchronous race conditions.`
    : category === 'networking'
    ? `Why this high-performance networking architecture? Handles thousands of concurrent TCP/HTTP connections with low latency, zero socket leaks, and graceful backoff.`
    : category === 'websockets'
    ? `Why this real-time architecture? Scales concurrent WebSocket connections with low memory footprint, distributed message brokers, and automatic reconnection hygiene.`
    : category === 'caching_redis'
    ? `Why distributed caching? Offloads 90%+ read traffic from databases, prevents cache stampedes with probabilistic early expiration, and ensures atomic distributed consistency.`
    : category === 'databases'
    ? `Why this database architecture? Guarantees strict ACID consistency, eliminates connection leaks, and optimizes query execution plans for sub-10ms response times.`
    : category === 'security'
    ? `Why this security architecture? Implements defense-in-depth against timing attacks, injection vulnerabilities, and privilege escalation using modern cryptographic standards.`
    : category === 'queues_workers'
    ? `Why asynchronous job queues? Decouples user-facing HTTP request/response lifecycles from heavy background tasks, guaranteeing eventual completion and zero job loss.`
    : category === 'threads_perf'
    ? `Why worker threads? Offloads CPU-intensive computations from the Node.js event loop to background threads, maintaining steady 60fps event loop responsiveness.`
    : `Production-ready backend architecture engineered for enterprise scale, zero memory leaks, and sub-millisecond event loop responsiveness.`;

  const defaultUseCases = [
    {
      title: `Enterprise Backend Production Service in Chrona / LesHub`,
      detail: `Implemented directly in production to resolve ${title.toLowerCase()} without degrading latency or crashing the Node process.`
    },
    {
      title: "High-Throughput Concurrent Processing",
      detail: `Guarantees stable RSS memory, constant V8 heap usage, and zero unhandled promise rejections under high socket load.`
    },
    {
      title: "Distributed Fault-Tolerance & Observability",
      detail: `Enforces strict error propagation, graceful degradation, and distributed telemetry tracing.`
    }
  ];

  const defaultQA = [
    {
      question: `How does "${title}" prevent event loop lag and V8 memory bloat under heavy traffic?`,
      answer: `By strictly decoupling synchronous CPU operations and managing resource lifecycles with automated cleanup handlers. ${architectureSummary}`
    },
    {
      question: `What is the most critical senior production edge case for this problem?`,
      answer: seniorEdgeCases && seniorEdgeCases.length > 0 
        ? `${seniorEdgeCases[0]} Failing to handle this causes socket leaks and sudden process termination in Kubernetes clusters.`
        : `Handling unexpected network disconnection, backpressure, and unhandled promise rejections.`
    },
    {
      question: `How would you defend this implementation to a Principal Backend Architect?`,
      answer: `${question.interviewTalkingPoints || "Focus on bounded memory consumption, non-blocking I/O execution, idempotent state mutations, and graceful shutdown handling."}`
    }
  ];

  return {
    uxRationale: defaultRationale,
    realWorldUseCases: defaultUseCases,
    interviewQA: defaultQA
  };
}
