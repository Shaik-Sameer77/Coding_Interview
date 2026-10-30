// Merges all batches into src/node/data/nodeInterviewData.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/node/data/nodeInterviewData.js');

const b1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'q_batch_1.json'), 'utf8'));
const b2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'batch_2_3.json'), 'utf8'));
const b3 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'batch_4_5_6.json'), 'utf8'));
const b4 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'batch_7_8.json'), 'utf8'));
const b5 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'batch_9_10_11.json'), 'utf8'));
const b6 = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'batch_12_to_16.json'), 'utf8'));

const all250 = [...b1, ...b2, ...b3, ...b4, ...b5, ...b6];

console.log('Merged total questions count:', all250.length);

// Verify sequential IDs
all250.forEach((q, idx) => {
  q.id = idx + 1;
});

const fileHeader = `// Node.js & Express Senior Developer Interview Question Bank — 250 Questions with Model Answers
// Foundation Finance Company · Full Stack Developer / SDE Screening Preparation

export const NODE_INTERVIEW_TOPICS = [
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

export const NODE_STUDY_CHECKLIST = [
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

export const NODE_250_QUESTIONS = ${JSON.stringify(all250, null, 2)};
`;

fs.writeFileSync(targetPath, fileHeader, 'utf8');
console.log('Successfully wrote', all250.length, 'questions to', targetPath);
