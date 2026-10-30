// scratch/enrich_node_interview_data.cjs
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/node/data/nodeInterviewData.js');
const fileRaw = fs.readFileSync(targetPath, 'utf8');

// Dynamic import of current data
import(`file://${targetPath}`).then(async (module) => {
  const { NODE_INTERVIEW_TOPICS, NODE_250_QUESTIONS, NODE_STUDY_CHECKLIST } = module;
  console.log(`Loaded ${NODE_250_QUESTIONS.length} Node interview questions.`);

  const multiApproachQuestions = {
    35: [
      {
        title: "Approach 1: Synchronous fs.readFileSync (Naive)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N) (Loads entire file in RAM)",
        explanation: "Reads the entire file into memory synchronously. Freezes the V8 call stack for all other requests.",
        code: `const fs = require('node:fs');\n\nfunction readLargeFile(filePath) {\n  // ❌ Freezes the entire Node.js server!\n  return fs.readFileSync(filePath, 'utf-8');\n}`
      },
      {
        title: "Approach 2: Stream Pipeline with Backpressure (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1) (Bounded 64KB Buffer)",
        explanation: "Streams the file chunk-by-chunk using pipeline, keeping RAM usage capped at under 50MB regardless of file size.",
        code: `import { createReadStream, createWriteStream } from 'node:fs';\nimport { pipeline } from 'node:stream/promises';\nimport { createGzip } from 'node:zlib';\n\nexport async function streamFileSafely(src, dest) {\n  await pipeline(\n    createReadStream(src),\n    createGzip(),\n    createWriteStream(dest)\n  );\n}`
      }
    ],
    50: [
      {
        title: "Approach 1: Unbounded Promise.all (Hazardous)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Fires all N promises at the exact same instant. Overwhelms downstream databases and exhausts connection pools.",
        code: `// ❌ Dangerous with 10,000 tasks: exhausts sockets!\nasync function runAll(tasks) {\n  return Promise.all(tasks.map(t => t()));\n}`
      },
      {
        title: "Approach 2: Concurrency Limiter Pool (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(K) where K = max concurrency limit",
        explanation: "Maintains a fixed pool of K executing promises. As each promise resolves, the next pending task from the queue is dispatched.",
        code: `export async function pLimit(tasks, limit = 5) {\n  const results = [];\n  let index = 0;\n  \n  async function worker() {\n    while (index < tasks.length) {\n      const currentIndex = index++;\n      results[currentIndex] = await tasks[currentIndex]();\n    }\n  }\n  \n  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());\n  await Promise.all(workers);\n  return results;\n}`
      }
    ],
    60: [
      {
        title: "Approach 1: Naive EventEmitter Subscriptions (Memory Leak Prone)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(N) (Retained closures)",
        explanation: "Registers listeners without automatic cleanup, leading to MaxListenersExceededWarning and memory retention.",
        code: `function listen(emitter) {\n  emitter.on('data', (d) => console.log(d));\n  // ❌ Never cleaned up when client disconnects!\n}`
      },
      {
        title: "Approach 2: AbortSignal-Backed EventEmitter (Optimal)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Uses modern AbortSignal integration to automatically unregister listeners and prevent closure retainment.",
        code: `export function autoCleanListener(emitter, signal) {\n  emitter.on('data', (data) => {\n    console.log('Received:', data);\n  }, { signal });\n}`
      }
    ],
    125: [
      {
        title: "Approach 1: In-Memory Set Deduplication (Naive)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(N)",
        explanation: "Uses an in-memory Set. Fails in multi-instance clusters and loses history if the server restarts.",
        code: `const seen = new Set();\nfunction handleWebhook(evt) {\n  if (seen.has(evt.id)) return;\n  seen.add(evt.id);\n  // Process...\n}`
      },
      {
        title: "Approach 2: Atomic Database Idempotency with Unique Constraint (Optimal)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Inserts the event ID into a dedicated table with a UNIQUE constraint inside an ACID transaction.",
        code: `export async function handleWebhookIdempotent(pool, event) {\n  const conn = await pool.getConnection();\n  try {\n    await conn.beginTransaction();\n    await conn.execute(\n      'INSERT INTO processed_events (event_id, event_type) VALUES (?, ?)',\n      [event.id, event.type]\n    );\n    // Process credit...\n    await conn.commit();\n  } catch (err) {\n    await conn.rollback();\n    if (err.code === 'ER_DUP_ENTRY') return { duplicate: true };\n    throw err;\n  } finally {\n    conn.release();\n  }\n}`
      }
    ],
    180: [
      {
        title: "Approach 1: Mocked DB Route Test (Shallow)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Mocks the database query functions. Proves zero confidence in actual SQL schema syntax.",
        code: `// Mocks everything: false confidence\nvi.mock('../db', () => ({ query: vi.fn().mockResolvedValue([]) }));`
      },
      {
        title: "Approach 2: Supertest with Transaction Rollback (Optimal)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Runs against an isolated real test database inside a transaction that is rolled back in afterEach().",
        code: `describe('POST /api/users', () => {\n  let conn;\n  beforeEach(async () => {\n    conn = await pool.getConnection();\n    await conn.beginTransaction();\n  });\n  afterEach(async () => {\n    await conn.rollback();\n    conn.release();\n  });\n  it('creates user in DB', async () => {\n    await request(app).post('/api/users').send({ email: 'a@b.com' }).expect(201);\n  });\n});`
      }
    ],
    225: [
      {
        title: "Approach 1: Manual Process Restart on Memory Growth (Crude)",
        timeComplexity: "N/A",
        spaceComplexity: "O(N)",
        explanation: "Simply uses PM2 max-memory-restart to bounce workers when RAM exceeds 1GB. Masks the underlying leak.",
        code: `// pm2.config.js\nmodule.exports = { apps: [{ script: 'app.js', max_memory_restart: '1G' }] };`
      },
      {
        title: "Approach 2: 3-Snapshot Comparison Profiling & Heap Stream Dump (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Takes heap snapshots before, during, and after traffic, sorting by # Delta in Chrome DevTools to locate the exact retainer.",
        code: `import v8 from 'node:v8';\nimport fs from 'node:fs';\n\nexport function dumpHeapOnLeak(thresholdMB = 1024) {\n  if (process.memoryUsage().heapUsed / 1024 / 1024 > thresholdMB) {\n    v8.getHeapSnapshot().pipe(fs.createWriteStream(\`leak-\${Date.now()}.heapsnapshot\`));\n  }\n}`
      }
    ],
    245: [
      {
        title: "Approach 1: Immediate process.exit(0) (Destructive)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Kills the process immediately, abruptly severing in-flight HTTP connections and corrupting file writes.",
        code: `process.on('SIGTERM', () => {\n  // ❌ Abruptly severs active user requests!\n  process.exit(0);\n});`
      },
      {
        title: "Approach 2: Graceful Draining with Server.close & Teardown Timeout (Optimal)",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
        explanation: "Stops accepting new incoming connections, allows active requests up to 10 seconds to finish, closes DB pools, and cleanly exits.",
        code: `export function setupGracefulShutdown(server, dbPool) {\n  const shutdown = async (signal) => {\n    console.log(\`Received \${signal}. Draining connections...\`);\n    server.close(async () => {\n      console.log('HTTP server closed. Releasing DB pool...');\n      await dbPool.end();\n      process.exit(0);\n    });\n    setTimeout(() => {\n      console.error('Forceful shutdown timeout reached.');\n      process.exit(1);\n    }, 10000).unref();\n  };\n  process.on('SIGTERM', () => shutdown('SIGTERM'));\n  process.on('SIGINT', () => shutdown('SIGINT'));\n}`
      }
    ]
  };

  const enrichedQuestions = NODE_250_QUESTIONS.map((q) => {
    // Determine difficulty based on topic and ID
    let difficulty = 'Senior';
    if (q.id <= 20 || q.id % 15 === 1) difficulty = 'Mid';
    if (q.id > 200 || q.id === 125 || q.id === 150) difficulty = 'Staff';

    // Build Spoken Pitch
    const pitch = `In production, ${q.question.replace(/\?$/, '')} centers on first-principles system mechanics. Specifically: ${q.answer.split('\n')[0].replace(/\*\*/g, '').slice(0, 180)}...`;

    // Runtime Behavior Flow
    const runtimeBehavior = q.memoryModel 
      ? `**Runtime Execution & Memory Flow**: ${q.memoryModel}`
      : `**Engine Execution Flow**: The V8 engine coordinates single-threaded execution on the call stack, delegating non-blocking operations to Libuv and operating system kernel multiplexers (epoll/kqueue).`;

    // Default Follow-Up Questions
    const followUps = [
      {
        q: `What is the primary production failure mode if this pattern is misconfigured?`,
        a: `The most common failure mode is resource exhaustion—either blocking the V8 call stack (event loop latency spike) or exhausting socket descriptors/database connection pools.`
      },
      {
        q: `How would you measure or monitor this behavior under heavy production load?`,
        a: `By tracking Event Loop Lag (p99 latency via perf_hooks monitorEventLoopDelay) alongside active handle counts and heap allocation rates.`
      }
    ];

    const approaches = multiApproachQuestions[q.id] || null;

    return {
      ...q,
      difficulty,
      pitch,
      runtimeBehavior,
      followUps,
      approaches
    };
  });

  const outputContent = `// Node.js & Express Senior Developer Interview Question Bank — 250 Questions with Model Answers
// Upgraded with Spoken Pitches, Engine Mechanics, Follow-ups, and Multi-Approach Solutions Governed by AGENTS.md

export const NODE_INTERVIEW_TOPICS = ${JSON.stringify(NODE_INTERVIEW_TOPICS, null, 2)};

export const NODE_STUDY_CHECKLIST = ${JSON.stringify(NODE_STUDY_CHECKLIST, null, 2)};

export const NODE_250_QUESTIONS = ${JSON.stringify(enrichedQuestions, null, 2)};
`;

  fs.writeFileSync(targetPath, outputContent, 'utf8');
  console.log(`Successfully enriched ${enrichedQuestions.length} Node interview questions in ${targetPath}`);
});
