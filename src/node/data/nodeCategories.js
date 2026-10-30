// 10 Backend & Full-Stack Node.js Categories (100 Problems)
export const NODE_CATEGORIES = [
  {
    id: "streams",
    title: "1. Streams, Buffers & File Systems",
    range: "N1 - N10",
    color: "#10b981",
    description: "Transform streams, backpressure management, chunked uploads, and 10GB log processing without OOM."
  },
  {
    id: "async_eventloop",
    title: "2. Async Concurrency & Event Loop",
    range: "N11 - N20",
    color: "#6366f1",
    description: "Event loop phases, async worker pools, circuit breakers, mutex locking, and DataLoader deduplication."
  },
  {
    id: "networking",
    title: "3. High-Performance HTTP & Microservices",
    range: "N21 - N30",
    color: "#06b6d4",
    description: "Radix trie routers, reverse proxy load balancers, token bucket rate limiters, SSE, and graceful shutdown."
  },
  {
    id: "websockets",
    title: "4. WebSockets & Real-Time Backplanes",
    range: "N31 - N40",
    color: "#8b5cf6",
    description: "Dead socket reapers, Redis pub-sub backplane, sequence buffers, and collaborative CRDT relays."
  },
  {
    id: "caching_redis",
    title: "5. Caching, Redis & Distributed State",
    range: "N41 - N50",
    color: "#ef4444",
    description: "L1/L2 multi-tier caching, Redlock distributed locking, sliding window logs, and Bloom filters."
  },
  {
    id: "databases",
    title: "6. Databases, Transactions & ORM Patterns",
    range: "N51 - N60",
    color: "#f59e0b",
    description: "Connection poolers, Two-Phase Commit (2PC), transactional outbox, keyset pagination, and read replicas."
  },
  {
    id: "security",
    title: "7. Authentication, Security & Cryptography",
    range: "N61 - N70",
    color: "#ec4899",
    description: "Rotating refresh JWTs with revocation, RBAC/ABAC engines, Argon2 hashing, and timing-attack guards."
  },
  {
    id: "queues_workers",
    title: "8. Message Queues & Background Workers",
    range: "N71 - N80",
    color: "#14b8a6",
    description: "Priority job queues, dead letter queues (DLQ), deterministic deduplication, SAGA orchestrators, and cron engines."
  },
  {
    id: "threads_perf",
    title: "9. Worker Threads, CPU Offload & Clusters",
    range: "N81 - N90",
    color: "#3b82f6",
    description: "Worker thread pools, SharedArrayBuffer atomics, cluster IPC, memory heap dumpers, and GC pause monitoring."
  },
  {
    id: "observability",
    title: "10. Observability, Logging & Resilience",
    range: "N91 - N100",
    color: "#a855f7",
    description: "OpenTelemetry tracing, AsyncLocalStorage request context, Pino structured logging, and Chaos fault injection."
  }
];
