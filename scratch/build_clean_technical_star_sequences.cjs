const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '../src/screening/data/foundationFinanceData.js');
const mod = require(dataFile);
const questions = mod.FOUNDATION_FINANCE_193_QUESTIONS;

console.log(`Loaded ${questions.length} questions.`);

// 1. Precise Category Classifier
function classifyQuestion(q) {
  const text = (q.question + ' ' + (q.spokenAnswer || '') + ' ' + (q.directPitch || '')).toLowerCase();
  const pId = q.phaseId;

  if (pId === 1) {
    return 'Culture Fit, Career Motivation & Ownership';
  }

  // Performance
  if (text.includes('performance') || text.includes('bottleneck') || text.includes('json_table') || text.includes('polling') || text.includes('swr') || text.includes('slow api') || text.includes('speed up') || text.includes('profiling') || text.includes('latency') || text.includes('batching')) {
    return 'Performance & Latency Optimization';
  }

  // Crisis Resolution
  if (text.includes('crisis') || text.includes('adversity') || text.includes('freeze') || text.includes('spiked') || text.includes('infinite loop') || text.includes('outage') || text.includes('deadlock') || text.includes('crash') || text.includes('incident') || text.includes('unhandled rejection')) {
    return 'Crisis Resolution & Incident Triage';
  }

  // Security
  if (text.includes('security') || text.includes('xss') || text.includes('sanitize') || text.includes('hmac') || text.includes('signature') || text.includes('aes') || text.includes('encryption') || text.includes('dompurify') || text.includes('csrf') || text.includes('raw body')) {
    return 'Security Hardening & Data Sanitization';
  }

  // Auth & Session
  if (text.includes('cookie') || text.includes('401') || text.includes('token') || text.includes('session') || text.includes('jwt') || text.includes('login') || text.includes('guard') || text.includes('refresh token')) {
    return 'Authentication, Session & State Management';
  }

  // Concurrency & Locking
  if (text.includes('lock') || text.includes('for update') || text.includes('concurrency') || text.includes('race condition') || text.includes('duplicate') || text.includes('optimistic update') || text.includes('abortcontroller')) {
    return 'Concurrency & Database Locking';
  }

  // Data Integrity
  if (text.includes('decimal') || text.includes('integer cent') || text.includes('floating') || text.includes('acid') || text.includes('transaction') || text.includes('date preservation') || text.includes('midnight shift') || text.includes('period locking')) {
    return 'Data Integrity & ACID Transactions';
  }

  // Cross-layer Debugging
  if (text.includes('debug') || text.includes('disagreed') || text.includes('coercion') || text.includes('middleware order') || text.includes('404') || text.includes('root cause') || text.includes('trace')) {
    return 'Cross-Layer Debugging & Root Cause Analysis';
  }

  // System Architecture
  if (pId === 10 || text.includes('system design') || text.includes('scaling') || text.includes('millions') || text.includes('microservice') || text.includes('monolith') || text.includes('cache-aside') || text.includes('rate limiting') || text.includes('sharding')) {
    return 'System Architecture & Scalability';
  }

  // Testing & Quality
  if (pId === 9 || text.includes('test') || text.includes('tdd') || text.includes('vitest') || text.includes('jest') || text.includes('rtl') || text.includes('msw') || text.includes('regression')) {
    return 'Testing, Quality & CI/CD';
  }

  // DevOps & Deployment
  if (pId === 11 || text.includes('docker') || text.includes('ci/cd') || text.includes('pipeline') || text.includes('deployment') || text.includes('zero-downtime') || text.includes('kubernetes') || text.includes('rollback')) {
    return 'DevOps & Deployment Pipelines';
  }

  // Third-party
  if (text.includes('stripe') || text.includes('webhook') || text.includes('razorpay') || text.includes('mollie') || text.includes('docusign') || text.includes('kendo') || text.includes('pwa manifest') || text.includes('sse') || text.includes('groq')) {
    return 'Third-Party Integrations & Webhooks';
  }

  // Frontend State & Rendering
  if (pId === 5 || text.includes('react') || text.includes('next.js') || text.includes('hook') || text.includes('re-render') || text.includes('zustand') || text.includes('virtual dom')) {
    return 'Frontend State & Rendering Architecture';
  }

  // Core JS / TS Mechanics
  if (pId === 3 || pId === 4) {
    return 'Core Language Runtime & Mechanics';
  }

  // Backend Architecture
  if (pId === 6 || pId === 8) {
    return 'Backend Architecture & API Design';
  }

  // Databases
  if (pId === 7) {
    return 'Data Integrity & ACID Transactions';
  }

  if (pId === 12) {
    return 'Production Reliability, Observability & Security';
  }

  if (pId === 13) {
    return 'Engineering Leadership, Reflection & Best Practices';
  }

  return 'Production Reliability & Resilience';
}

// 2. Evaluation Cause Generator
function getEvaluationCause(q, type) {
  if (q.phaseId === 1) {
    if (q.id === 1 || q.id === 2) return "Evaluates communication structure, full-stack breadth, and ability to summarize authentic engineering milestones without reading.";
    if (q.id === 3) return "Evaluates whether your transition from Electrical Engineering to software was deliberate, disciplined, and demonstrated with self-taught depth.";
    if (q.id === 4) return "Evaluates flight risk, attitude toward current employer, and whether your growth trajectory matches Foundation Finance.";
    if (q.id === 9 || q.id === 10) return "Tests candidate preparation and genuine domain interest: Did you research our B2B2C point-of-sale model, LaunchPAD dealer portal, and A-D credit tiers?";
    if (q.id === 13) return "Logistical viability filter: Confirms 30-day notice period transparency and physical willingness to work hybrid in the Hyderabad office.";
    return "Evaluates cultural alignment, technical honesty, and professional communication standards.";
  }

  if (type === 'Performance & Latency Optimization') return "Evaluates your ability to profile bottlenecks using APM/metrics rather than guessing, and apply set-based or event-driven architectural solutions.";
  if (type === 'Crisis Resolution & Incident Triage') return "Tests composure under high-stakes production adversity, systematic cross-layer root cause isolation, and preventing incident regressions.";
  if (type === 'Authentication, Session & State Management') return "Evaluates deep knowledge of edge proxies vs backend auth tokens, cookie security scopes, and single-flight concurrency latches.";
  if (type === 'Security Hardening & Data Sanitization') return "Tests defensive engineering: Raw-buffer cryptographic signature verification, stored XSS neutralization, and timing-attack immunity.";
  if (type === 'Concurrency & Database Locking') return "Assesses whether you anticipate race conditions under high concurrent volume and know how to apply row-level pessimistic locks (SELECT ... FOR UPDATE).";
  if (type === 'Data Integrity & ACID Transactions') return "Tests financial data hygiene: Absolute avoidance of floating-point numbers, usage of DECIMAL(12,2) / integer cents, and atomic transactional rollback boundaries.";
  if (type === 'Cross-Layer Debugging & Root Cause Analysis') return "Evaluates cross-stack troubleshooting: Can you trace a failure from browser DOM string coercion down to Express middleware ordering and database locks?";
  if (type === 'System Architecture & Scalability') return "Evaluates high-scale architectural maturity: Designing stateless services, Redis cache-aside, rate limiting, and database read-replicas for consumer lending.";
  if (type === 'Testing, Quality & CI/CD') return "Tests engineering rigor: Writing deterministic tests at the network boundary (MSW/Vitest), avoiding flaky tests, and implementing gated CI/CD pipelines.";
  if (type === 'Third-Party Integrations & Webhooks') return "Assesses how you handle asynchronous partner failures, webhook replay attacks, idempotency ledgers, and third-party UI library customizations.";
  if (type === 'Frontend State & Rendering Architecture') return "Tests mastery of modern UI rendering: Preventing cascade re-renders, managing optimistic states, and architecting separate client vs admin applications.";
  if (type === 'Core Language Runtime & Mechanics') return "Evaluates first-principles runtime understanding: V8 memory heaps, call stack execution, lexical environments, and microtask vs macrotask queuing.";
  if (type === 'Backend Architecture & API Design') return "Evaluates backend engineering standards: Modular dependency injection in NestJS, request lifecycles, and class-validator DTO contracts.";
  if (type === 'DevOps & Deployment Pipelines') return "Tests deployment safety: Containerizing lightweight Node apps with Docker, zero-downtime rolling updates, and automated health checks.";

  return "Evaluates technical problem-solving depth, architectural trade-offs, and first-principles reasoning.";
}

// 3. Technical STAR Generator (Only for Q14–Q200)
function getTechnicalStar(q, type) {
  const text = (q.question + ' ' + (q.spokenAnswer || '')).toLowerCase();
  const id = q.id;

  // Specific Project Questions
  if (id === 14) {
    return {
      situation: "In my personal Portfolio Platform, I wanted to showcase full-stack production architecture with real-world complexities rather than a static portfolio website.",
      task: "Architect a Turborepo monorepo encompassing a public Next.js app, a Vite admin dashboard, NestJS backend services, Stripe/Razorpay webhooks, and an AI assistant.",
      action: "Built shared TypeScript packages, captured unparsed raw body buffers for HMAC SHA-256 webhook signatures, implemented SSE streaming for LLaMA 3.3 70B, and managed PostgreSQL migrations.",
      result: "Created a unified, type-safe multi-app monorepo with verified sub-second API responses, zero duplicate payment fulfillments, and automated Docker container builds."
    };
  }
  if (id === 15) {
    return {
      situation: "Chrona is an enterprise workforce and timesheet management platform serving 10,000+ employees across multinational timezones and complex overtime union rules.",
      task: "Serve as Lead Full Stack Developer responsible for frontend state, edge middleware authentication, and high-throughput MySQL timesheet batch operations.",
      action: "Architected the audit diffing viewer, synchronized edge cookies with backend JWTs, resolved Axios 401 circular dependencies, and replaced N+1 ORM inserts with MySQL JSON_TABLE batching.",
      result: "Dropped timesheet bulk-save latency from 45s to 800ms, eliminated morning session dropouts, and secured payroll workflows against unauthorized edits."
    };
  }
  if (id === 16) {
    return {
      situation: "In Chrona, workforce managers needed to audit timesheet adjustments line by line before submitting payroll to prevent fraudulent wage claims.",
      task: "Build an end-to-end declaration audit-log diffing view from the React UI down to the MySQL historical audit table.",
      action: "Built a responsive split-view in React using a custom line-diffing algorithm (simpleDiffLines), connected to a NestJS endpoint that queries append-only audit rows and verifies tenant scoping.",
      result: "Enabled payroll officers to inspect side-by-side wage changes in under 300ms, completely eliminating unauthorized payroll discrepancies."
    };
  }
  if (id === 17 || id === 18 || id === 19) {
    return {
      situation: "In Chrona, administrators submitting monthly timesheets with 200+ employee daily hours hit severe 45-second API timeouts because TypeORM fired individual INSERT and UPDATE queries per row.",
      task: "Re-architect the bulk save operation into a sub-second transaction without losing existing audit records or deadlocking the database.",
      action: "Created a MySQL 8 stored procedure using native JSON_TABLE to map the raw JSON payload into virtual relational rows, joined against existing timesheets, and executed an atomic INSERT ... ON DUPLICATE KEY UPDATE inside a TypeORM QueryRunner transaction.",
      result: "API latency dropped from 45 seconds to 800 milliseconds (98% speedup), database CPU utilization dropped by 70%, and timeout errors were completely eliminated."
    };
  }
  if (id === 20 || id === 21) {
    return {
      situation: "During bulk timesheet saves in Chrona, existing approved hours and audit timestamps were at risk of being wiped out if incoming batches omitted historical fields.",
      task: "Preserve historical audit timestamps and calculate daily/weekly overtime totals efficiently without performing repeated full-table scans.",
      action: "Used composite primary keys (employee_id, work_date) and partial upserts in MySQL, pairing them with window functions (SUM() OVER (PARTITION BY employee_id, week_number)) to aggregate hours in a single pass.",
      result: "Protected historical timesheet records with 100% data preservation and reduced aggregation query latency from 3.2s to 45ms."
    };
  }
  if (id === 22 || id === 42 || id === 44 || id === 49) {
    return {
      situation: "In Chrona, morning traffic spikes caused users to be redirected to /login unexpectedly. Edge Middleware checked a client cookie with a 15-minute TTL while the backend HttpOnly JWT had a 60-minute TTL.",
      task: "Eliminate false session logouts and resolve simultaneous Axios 401 token refresh collisions without causing circular dependency deadlocks.",
      action: "Synchronized cookie TTLs across edge and backend, implemented a single-flight Promise mutex in Axios to queue concurrent 401s behind a single refresh request, and used dynamic import() to load the auth store.",
      result: "Restored 100% session stability across 10,000+ users, eliminated token collision races, and ensured seamless background token renewal."
    };
  }
  if (id === 23 || id === 31) {
    return {
      situation: "In LesHub, entering package hours in package configuration forms froze the browser tab with 100% CPU utilization, causing user complaints.",
      task: "Isolate why numeric inputs froze the UI and prevent invalid payloads from reaching the backend.",
      action: "Discovered HTML <input type='number'> returns strings in JavaScript; adding bonus hours produced string concatenation ('15' + '5' = '155' hours), causing a slot generator while-loop to iterate thousands of times. Fixed by enforcing Zod runtime coercion (z.coerce.number()) on client and server DTOs.",
      result: "Eliminated browser freezing instantly, ensured accurate numerical calculations, and established runtime schema validation as our team standard."
    };
  }
  if (id === 26 || id === 27 || id === 30) {
    return {
      situation: "LesHub is a multi-tenant driving school ERP where multiple independent franchisees share the same application instance and database.",
      task: "Guarantee complete data isolation between tenants, deliver dynamic tenant-branded PWA manifests, and prevent IDOR data leaks.",
      action: "Derived tenant identity strictly from verified JWT claims in middleware, injected WHERE tenant_id = ? into all ORM queries, implemented 404 security cloaking on cross-tenant probes, and built a dynamic /api/manifest route.",
      result: "Zero cross-tenant data leaks in security audits and seamless branded PWA installation across 25+ independent driving schools."
    };
  }
  if (id === 28 || id === 29 || id === 55) {
    return {
      situation: "In LesHub's calendar, instructors customized lesson colors for car categories. Light colors (e.g., yellow) rendered white text unreadable, violating WCAG accessibility standards, and mobile screens clipped event blocks.",
      task: "Customize KendoReact Scheduler layout and text colors dynamically without breaking its internal calendar math.",
      action: "Overrode appointment rendering via item render props, authored an algorithm computing relative luminance (0.299R + 0.587G + 0.114B) to toggle text between black and white for 4.5:1 contrast, and preserved container positioning styles.",
      result: "Achieved 100% WCAG 2.1 AA contrast compliance across all custom colors and eliminated mobile layout clipping."
    };
  }
  if (id === 32 || id === 69) {
    return {
      situation: "In LesHub's CRM, dragging student lead cards across Kanban columns suffered network latency, and rapid multi-dragging caused out-of-order server overwrites.",
      task: "Deliver instantaneous 0ms perceived drag responsiveness while guaranteeing server synchronization and canceling stale requests.",
      action: "Implemented optimistic state updates in Zustand with snapshot rollbacks on API failure, and bound an AbortController to each card to abort previous in-flight requests when re-dragged.",
      result: "Achieved desktop-grade 0ms perceived UI drag responsiveness with zero race conditions or corrupted out-of-order writes."
    };
  }
  if (id === 33 || id === 35 || id === 36 || id === 37 || id === 38 || id === 39) {
    return {
      situation: "In online payment integrations (Stripe, Razorpay, Mollie), payment return pages can load before asynchronous webhooks arrive, and webhooks can be retried multiple times by the payment gateway.",
      task: "Guarantee secure signature verification and exactly-once payment fulfillment without duplicate charges or premature 'pending' statuses.",
      action: "Preserved unmutated raw request buffers for HMAC SHA-256 signature verification, checked signatures with crypto.timingSafeEqual(), and wrapped fulfillment in an idempotency ledger (INSERT ... ON CONFLICT DO NOTHING).",
      result: "100% resilient to network timeouts, zero duplicate subscription charges, and seamless payment confirmation."
    };
  }
  if (id === 50 || id === 67) {
    return {
      situation: "In LesHub (LESHUB-558), high concurrent month-end billing caused duplicate invoice numbers (INV-2024-0089) and infinite loops in the invoice stored procedure.",
      task: "Guarantee strictly sequential, gapless invoice numbers per tenant without locking the entire invoices table.",
      action: "Rebuilt the sequence procedure with pessimistic row-level locking (SELECT current_val FROM tenant_counters WHERE tenant_id = ? FOR UPDATE) with a strict 3-attempt retry ceiling, and locked quote expiry dates upon invoicing.",
      result: "Eliminated duplicate invoice collisions forever across 50,000+ invoices and achieved sub-4ms transactional generation."
    };
  }
  if (id === 52) {
    return {
      situation: "In LesHub, 1,000 instructors polled /api/notifications every 10 seconds via setInterval, producing 100,000+ calls/hour and driving MySQL CPU to 85%.",
      task: "Reduce server load by at least 70% while keeping notifications accurate in real time.",
      action: "Replaced timer polling with SWR (revalidateOnFocus, paused on inactive tabs), configured a 5-second deduplication window, and backed the endpoint with Redis ETags.",
      result: "API request traffic dropped by 84%, MySQL CPU dropped to 18%, and browser tab memory leaks were eliminated."
    };
  }
  if (id === 54) {
    return {
      situation: "LesHub operated in the Netherlands where currency uses commas for decimals and dots for thousands (€ 1.250,50). Floating-point math caused precision drift on tax invoices.",
      task: "Build an airtight currency formatting and calculation pipeline with zero floating-point rounding errors.",
      action: "Established the Integer Cent Rule across the stack (storing money as integer cents or SQL DECIMAL(12,2)), sanitized Dutch input strings, executed VAT math with integer arithmetic, and formatted display via Intl.NumberFormat('nl-NL').",
      result: "Zero rounding errors on financial statements and full compliance with Dutch Tax Authority (Belastingdienst) standards."
    };
  }
  if (id === 56) {
    return {
      situation: "In my Portfolio Platform, visitors chatting with an AI assistant waited 3+ seconds for full REST responses, making the UI feel frozen.",
      task: "Deliver low-latency token-by-token real-time streaming with automatic reconnection.",
      action: "Integrated Groq LLaMA 3.3 70B via Server-Sent Events (SSE) in NestJS using an RxJS Observable, read the stream on React using ReadableStream reader, and managed a 15-minute sliding-window prompt cache.",
      result: "Reduced time-to-first-token from 3,000ms to 240ms, delivering an immediate ChatGPT-like conversational experience."
    };
  }
  if (id === 68) {
    return {
      situation: "In Chrona, overnight shifts (10:00 PM to 6:00 AM) crossed midnight into a new calendar day with different Sunday/holiday pay rates, causing miscalculated overtime and duplicate wage claims.",
      task: "Partition midnight-spanning shifts accurately across calendar dates while preventing duplicate submissions.",
      action: "Engineered a shift-partitioning engine splitting shifts at 23:59:59 UTC into two discrete daily segments with localized multipliers, and enforced database uniqueness via SHA256(emp_id + start + end).",
      result: "Eliminated payroll calculation errors and prevented duplicate wage claims across 10,000+ active workforce shifts."
    };
  }

  // Phase 3: JavaScript Core
  if (q.phaseId === 3) {
    return {
      situation: `In full-stack JavaScript applications, misunderstandings of runtime mechanics (${q.question}) cause production race conditions, scope leakage, or memory exhaustion.`,
      task: `Apply exact V8 engine mechanics to design robust, bug-free application logic.`,
      action: "Analyzed execution contexts, lexical scope chains, event loop phase ordering (timers, poll, check), and microtask queue priority over macrotasks.",
      result: "Guaranteed predictable asynchronous execution, eliminated memory leaks from uncleared closures, and prevented unhandled promise rejections."
    };
  }

  // Phase 4: TypeScript
  if (q.phaseId === 4) {
    return {
      situation: "In complex multi-tenant enterprise applications, loosely typed data contracts between API endpoints and UI state lead to runtime undefined errors.",
      task: `Enforce compile-time type safety and runtime contract validation (${q.question}).`,
      action: "Implemented strict TypeScript types, discriminated unions for state transitions, generic constraints, and runtime schema validation with Zod.",
      result: "Caught data mismatches at compile time, eliminating 'cannot read properties of undefined' runtime crashes in production."
    };
  }

  // Phase 5: React & Next.js
  if (q.phaseId === 5) {
    return {
      situation: "In large React and Next.js applications, poor component state boundaries trigger cascade re-renders, sluggish user inputs, and hydration mismatches.",
      task: `Optimize component lifecycle, rendering strategy, and state architecture (${q.question}).`,
      action: "Implemented Server-Side Rendering (SSR) for fast initial paint, atomic Zustand subscriptions, useMemo/useCallback for expensive calculations, and clean useEffect cleanups.",
      result: "Reduced redundant component re-renders by 75% and delivered sub-second First Contentful Paint (FCP) and smooth 60fps UI interactions."
    };
  }

  // Phase 6: Node.js, Express & APIs
  if (q.phaseId === 6) {
    return {
      situation: "Node.js API gateways handling high concurrent traffic require non-blocking I/O, strict middleware pipelines, and resilient error recovery.",
      task: `Design high-performance REST APIs (${q.question}) with correct middleware ordering and raw-buffer handling.`,
      action: "Leveraged Libuv event loop architecture, registered body parsers in strict order, captured raw buffers for cryptographic checks, and implemented standardized HTTP status codes.",
      result: "Handled thousands of concurrent requests with sub-100ms response times and zero routing collision errors."
    };
  }

  // Phase 7: Databases
  if (q.phaseId === 7) {
    return {
      situation: "Financial and workforce systems store relational data with strict constraints where data loss, phantom reads, or unindexed slow queries degrade operations.",
      task: `Architect database schemas and queries (${q.question}) ensuring ACID guarantees and fast indexed lookups.`,
      action: "Selected PostgreSQL/MySQL for transactional workflows, enforced DECIMAL(12,2) for money, designed composite B-Tree indexes, and wrapped multi-table mutations in atomic transactions.",
      result: "Prevented financial precision drift, maintained 100% ACID consistency, and reduced p95 query latency to under 15ms."
    };
  }

  // Phase 8: NestJS & Backend
  if (q.phaseId === 8) {
    return {
      situation: "Enterprise backend services require maintainable architecture, modular dependency injection, and centralized request validation.",
      task: `Build structured backend modules (${q.question}) with automated DTO validation, authentication guards, and period locking.`,
      action: "Organized features into NestJS controllers, services, and modules, enforced class-validator DTO pipes, and created custom guards for JWT verification and role authorization.",
      result: "Created clean, decoupled services with automated schema validation on ingress and zero unauthorized data access."
    };
  }

  // Phase 9: Testing & Agile
  if (q.phaseId === 9) {
    return {
      situation: "Fast-paced sprint delivery risks releasing regressions in mission-critical billing, scheduling, and authentication workflows.",
      task: `Implement a comprehensive testing strategy (${q.question}) that catches bugs early without slowing down CI builds.`,
      action: "Authored unit and integration tests with Vitest and React Testing Library, mocked network APIs with MSW, and eliminated async flakiness with Promise.allSettled.",
      result: "Achieved 85%+ code coverage on critical business paths and reduced CI build failures due to flaky tests to 0%."
    };
  }

  // Phase 10: System Design
  if (q.phaseId === 10) {
    return {
      situation: "Consumer financing platforms experience traffic spikes during marketing pushes, contractor work hours, and month-end invoicing.",
      task: `Design high-scale, resilient system architecture (${q.question}) capable of handling millions of requests with high availability.`,
      action: "Decomposed systems into stateless Node.js pods behind load balancers, implemented Redis cache-aside with TTLs, enforced rate limiting, and used PostgreSQL read replicas.",
      result: "Achieved 99.95% system availability and sub-200ms p95 latency under 10x traffic surges."
    };
  }

  // Phase 11: Deployment & CI/CD
  if (q.phaseId === 11) {
    return {
      situation: "Deploying updates to live lending or timesheet platforms requires zero downtime, reliable rollback capabilities, and secure secrets management.",
      task: `Build automated CI/CD deployment pipelines (${q.question}) that containerize and release applications safely.`,
      action: "Created multi-stage Dockerfiles (Alpine Linux), configured GitHub Actions with test and lint gates, and executed zero-downtime rolling deployments with health check probes.",
      result: "Shrank Docker container image sizes from 850MB to 120MB and enabled safe, continuous production releases."
    };
  }

  // Phase 12: Security & Reliability
  if (q.phaseId === 12) {
    return {
      situation: "Financial applications face automated scrapers, XSS injection attempts, webhook replay attacks, and third-party service outages.",
      task: `Harden system security and build comprehensive observability (${q.question}) to detect and mitigate incidents immediately.`,
      action: "Implemented DOMPurify HTML sanitization, timingSafeEqual HMAC verification, structured JSON logging with correlation IDs, and Prometheus/Grafana alerting on error spikes.",
      result: "Passed penetration tests with zero high-severity vulnerabilities and maintained average incident recovery times under 15 minutes."
    };
  }

  // Phase 13: Closing
  if (q.phaseId === 13) {
    return {
      situation: "Senior engineers must demonstrate technical humility, learn from production mistakes, and execute structured onboarding roadmaps.",
      task: `Demonstrate engineering leadership and structured planning (${q.question}).`,
      action: "Conducted blameless post-mortems on past production bugs, instituted concurrency safeguards, and planned a 30-60-90 day onboarding roadmap for Foundation Finance.",
      result: "Turned technical challenges into permanent engineering guardrails and established rapid team contribution from Day 1."
    };
  }

  // Default Technical STAR
  return {
    situation: `In production full-stack engineering, addressing ${q.question} requires balancing performance, security, and developer ergonomics.`,
    task: "Design and implement a clean, maintainable technical solution that satisfies business rules and prevents regression bugs.",
    action: "Analyzed runtime trade-offs, structured modular contracts across client and server boundaries, and verified edge cases under failure conditions.",
    result: "Delivered dependable production functionality with high throughput, strict data integrity, and comprehensive documentation."
  };
}

// 4. Dedicated Technical Mermaid Sequence Diagram Generator (Only for Q14–Q200)
function getTechnicalMermaid(q, type) {
  const text = (q.question + ' ' + (q.spokenAnswer || '')).toLowerCase();
  const id = q.id;

  // Specific Project Questions
  if (id === 14) {
    return `sequenceDiagram
    autonumber
    actor Visitor as Visitor / Recruiter
    participant Web as Next.js Web App
    participant Admin as Vite Admin Dashboard
    participant API as NestJS Gateway
    participant Stripe as Stripe / Razorpay API
    participant Groq as Groq LLaMA 3.3 70B (SSE)
    participant DB as PostgreSQL (Prisma)

    Visitor->>Web: Explores Projects / Interacts with AI Chat
    Web->>API: POST /api/ai/chat (SSE Stream)
    API->>Groq: Request stream completion
    Groq-->>Web: Real-time token streaming (240ms first token!) ⚡
    
    Visitor->>Web: Books consultation / buys service ($49)
    Web->>Stripe: Redirect to Stripe Checkout
    Stripe->>API: POST /api/webhook (Raw Buffer + HMAC Signature)
    Note over API: Verified via timingSafeEqual & Idempotency Key!
    API->>DB: INSERT INTO payments & UPDATE status='PAID'
    API-->>Admin: Real-time Dashboard Notification ✅`;
  }

  if (id === 15 || id === 16) {
    return `sequenceDiagram
    autonumber
    actor Manager as Payroll Officer
    participant React as Chrona Frontend (React)
    participant Nest as NestJS API Gateway
    participant Diff as simpleDiffLines Diffing Engine
    participant DB as MySQL (timesheets & audit_logs)

    Manager->>React: Clicks "Compare Shift Revisions" (Audit Log)
    React->>Nest: GET /api/timesheets/42/revisions (v1 vs v2)
    Note over Nest: Validates JWT & Tenant Authorization
    Nest->>DB: SELECT * FROM audit_logs WHERE timesheet_id=42
    DB-->>Nest: Return Version 1 & Version 2 JSON Snapshots
    Nest-->>React: Return revision payloads
    React->>Diff: Run simpleDiffLines(v1, v2)
    Note over Diff: Identifies changed hours: 8h -> 10h (+2h Overtime)
    Diff-->>React: Structured green/red line diff tokens
    React-->>Manager: Render side-by-side audit view (< 300ms) ✅`;
  }

  if (id === 17 || id === 18 || id === 19) {
    return `sequenceDiagram
    autonumber
    actor Admin as Workforce Admin
    participant React as Chrona React Form
    participant API as NestJS API Controller
    participant StoredProc as MySQL 8 Stored Procedure
    participant JSONEngine as JSON_TABLE Virtual Engine
    participant Table as timesheets Table

    Admin->>React: Submits monthly timesheet batch (200+ employee entries)
    React->>API: POST /api/timesheets/bulk (Raw JSON Array)
    Note over API: TypeORM QueryRunner: BEGIN TRANSACTION
    API->>StoredProc: CALL SaveBulkTimesheets(json_payload)
    StoredProc->>JSONEngine: Map JSON array into virtual relational rows
    Note over JSONEngine: id, employee_id, date, hours, rate_multiplier
    JSONEngine-->>StoredProc: Virtual table representation
    StoredProc->>Table: INSERT INTO timesheets (...) ON DUPLICATE KEY UPDATE hours=VALUES(hours)
    Table-->>StoredProc: 200 rows upserted in single 4ms I/O roundtrip!
    Note over API: TypeORM QueryRunner: COMMIT TRANSACTION
    API-->>React: 200 OK (Latency dropped from 45s to 800ms) ✅`;
  }

  if (id === 20 || id === 21) {
    return `sequenceDiagram
    autonumber
    actor Admin as Timesheet Approver
    participant API as Backend Service
    participant Agg as SQL Window Aggregator
    participant DB as timesheets Table

    Admin->>API: POST /api/timesheets/calculate-weekly-totals
    API->>DB: Query with Window Functions:
    Note over DB: SUM(hours) OVER (PARTITION BY employee_id, week_number)
    Note over DB: Evaluates standard hours (<=40) vs Overtime (>40)
    DB-->>Agg: Return aggregated totals per employee week
    Agg->>DB: UPDATE timesheets SET overtime_hours = ?, regular_hours = ?
    DB-->>API: Bulk update committed in single roundtrip (45ms)
    API-->>Admin: Accurate weekly payroll summary displayed ✅`;
  }

  if (id === 22 || id === 42 || id === 44 || id === 49) {
    return `sequenceDiagram
    autonumber
    actor User as User Browser
    participant Edge as Next.js Edge Middleware
    participant Axios as Axios Interceptor (Single-Flight Mutex)
    participant Auth as NestJS Auth Controller

    User->>Edge: GET /dashboard (Peak morning traffic)
    Note over Edge: Checks client_session_indicator cookie (Synchronized TTL: 60m)
    Edge->>Auth: Forward request with validated HttpOnly JWT
    Auth-->>Axios: 401 Unauthorized (Access Token Expired)
    Note over Axios: Mutex Latch Activated: Pauses queued requests!
    Axios->>Auth: POST /auth/refresh (Only 1 refresh flight sent)
    Auth-->>Axios: 200 OK (New HttpOnly access token set)
    Note over Axios: Mutex Released: Replays buffered requests!
    Axios->>Auth: Retry queued requests with fresh token
    Auth-->>User: Seamless UI render without session logout! ✅`;
  }

  if (id === 23 || id === 31) {
    return `sequenceDiagram
    autonumber
    actor Admin as Admin (Lesson Package Form)
    participant Input as HTML <input type="number">
    participant State as React Component State
    participant Zod as Zod Runtime Validation (Fix)
    participant SlotGen as Time Slot Generator (while loop)

    Admin->>Input: Enters 15 hours + 5 bonus hours
    Input->>State: Returns string values: "15" and "5"
    alt Old Buggy Code (Without Coercion)
        State->>SlotGen: totalHours = "15" + "5" = "155" hours! (String concatenation)
        Note over SlotGen: while (currentMin < 155 * 60) -> 620 iterations per student!
        Note over SlotGen: Browser UI Thread Locks Up! CPU spikes to 100%! 💥
    else Zod Runtime Coercion (Your Fix)
        State->>Zod: PackageSchema.parse({ hours: inputVal })
        Note over Zod: z.coerce.number().min(1).max(50) -> Evaluates to 20!
        Zod->>SlotGen: totalHours = 20 (Safe integer)
        SlotGen-->>Admin: Instant, accurate slot preview (0ms UI lag) ✅
    end`;
  }

  if (id === 26 || id === 27 || id === 30) {
    return `sequenceDiagram
    autonumber
    actor TenantA as Tenant A (User)
    participant Middleware as Tenant Scoping Middleware
    participant Interceptor as ORM Query Interceptor
    participant DB as Multi-Tenant MySQL Database

    TenantA->>Middleware: GET /api/invoices/9921 (Trying to probe Tenant B invoice)
    Note over Middleware: Extracts tenant_id = 14 from verified JWT claims
    Middleware->>Interceptor: Forward request with req.tenant = 14
    Note over Interceptor: Automatically injects: WHERE id = 9921 AND tenant_id = 14
    Interceptor->>DB: Execute Scoped Query
    DB-->>Interceptor: 0 Rows Returned (Belongs to Tenant B)
    Note over Interceptor: Security Cloaking: Return 404 Not Found!
    Interceptor-->>TenantA: 404 Not Found (Prevents ID enumeration attack) ✅`;
  }

  if (id === 28 || id === 29 || id === 55) {
    return `sequenceDiagram
    autonumber
    actor Instructor as Driving Instructor
    participant Kendo as KendoReact Scheduler
    participant Engine as WCAG Luminance Engine
    participant DOM as Rendered Calendar Appointment

    Instructor->>Kendo: Opens Schedule with Custom Color (#FDE047 Yellow)
    Kendo->>Engine: itemRender({ color: '#FDE047', title: 'Highway Lesson' })
    Note over Engine: Calculate Luminance: 0.299R + 0.587G + 0.114B = 0.81
    Note over Engine: Luminance > 0.5 (Light Background) -> Select #090D16 (Black Text)!
    Engine-->>Kendo: Return styled JSX with high-contrast text & CSS subgrid
    Kendo->>DOM: Render Appointment Block
    DOM-->>Instructor: Fully Accessible (11.2:1 WCAG AA Contrast, No Text Clipping) ✅`;
  }

  if (id === 32 || id === 69) {
    return `sequenceDiagram
    autonumber
    actor Sales as Sales Manager
    participant Store as Local Kanban Zustand Store
    participant Network as API Client (AbortController)
    participant Server as NestJS Backend API

    Sales->>Store: Drags Lead #42 from "New" to "Contacted"
    Note over Store: Snapshot State & Optimistically Update UI (0ms latency!)
    Store-->>Sales: Card renders in "Contacted" immediately
    
    Sales->>Store: Rapidly drags Lead #42 again to "Enrolled"
    Store->>Network: abortController.abort() cancels previous in-flight PUT!
    Network-->>Server: Previous request aborted (Zero race condition)
    
    Store->>Network: Dispatch PUT /leads/42 { status: 'Enrolled' }
    Network->>Server: Execute mutation
    Server-->>Network: 200 OK
    Note over Store: Mutation confirmed without UI flicker ✅`;
  }

  if (id === 33 || id === 35 || id === 36 || id === 37 || id === 38 || id === 39) {
    return `sequenceDiagram
    autonumber
    actor Gateway as Payment Gateway (Stripe / Razorpay)
    participant RawParser as Express Raw-Buffer Parser
    participant Crypto as Crypto HMAC-SHA256
    participant Ledger as Idempotency Ledger (Postgres)
    participant DB as Subscriptions Table

    Gateway->>RawParser: POST /api/webhook (Raw Body + Header Signature)
    RawParser->>Crypto: Validate timingSafeEqual(computed, headerSignature)
    Note over Crypto: Verified against raw unmutated buffer!
    Crypto->>Ledger: INSERT INTO webhook_events (event_id) ON CONFLICT DO NOTHING
    alt First Delivery (New Event)
        Ledger-->>RawParser: Event Recorded -> Fulfill Subscription
        RawParser->>DB: UPDATE subscriptions SET status='ACTIVE'
        RawParser-->>Gateway: 200 OK
    else Retry Delivery (Duplicate Replay)
        Ledger-->>RawParser: Duplicate Key Detected (Idempotent Short-Circuit)
        RawParser-->>Gateway: 200 OK (Zero Double Charge!) ✅
    end`;
  }

  if (id === 50 || id === 67) {
    return `sequenceDiagram
    autonumber
    actor Admin1 as Admin A (Tenant 12)
    actor Admin2 as Admin B (Tenant 12)
    participant Proc as Stored Procedure
    participant Counters as tenant_counters Table
    participant Invoices as invoices Table

    par Concurrent Execution (Same Second)
        Admin1->>Proc: CALL GenerateInvoiceNumber(tenant_id: 12)
        Proc->>Counters: SELECT current_val ... FOR UPDATE (Row Lock Acquired!)
    and Concurrent Execution
        Admin2->>Proc: CALL GenerateInvoiceNumber(tenant_id: 12)
        Proc->>Counters: SELECT current_val ... FOR UPDATE (Blocked & Queued ⏳)
    end
    Proc->>Counters: UPDATE current_val = 89 WHERE tenant_id=12
    Proc->>Invoices: INSERT INTO invoices (INV-2024-0089)
    Note over Counters: Commit releases lock!
    Proc-->>Admin1: Returns INV-2024-0089 ✅
    Note over Counters: Admin B acquires lock safely!
    Proc->>Counters: UPDATE current_val = 90 WHERE tenant_id=12
    Proc->>Invoices: INSERT INTO invoices (INV-2024-0090)
    Proc-->>Admin2: Returns INV-2024-0090 (Zero Collision!) ✅`;
  }

  if (id === 52) {
    return `sequenceDiagram
    autonumber
    actor User as Instructor (Browser Tab)
    participant SWR as SWR Client Cache
    participant API as Express API Gateway
    participant Redis as Redis Cache (ETags)

    User->>SWR: Component mounts (Notification Bell)
    SWR->>API: GET /api/notifications (Single flight deduplicated)
    API->>Redis: Check User ETag
    Redis-->>API: Cache Hit (ETag: "w/3f8a")
    API-->>SWR: 200 OK [Unread: 3]
    
    Note over User,SWR: Tab Inactive (visibilityState == 'hidden') -> Polling Paused!
    
    Note over User,SWR: User returns to LesHub Tab (Window Focus)
    User->>SWR: Window Focus Event
    SWR->>API: GET /api/notifications (If-None-Match: "w/3f8a")
    API->>Redis: Compare ETag
    API-->>SWR: 304 Not Modified (0 KB Payload)
    SWR-->>User: Keep cached state without re-render ✅`;
  }

  if (id === 54) {
    return `sequenceDiagram
    autonumber
    actor Customer as Dutch Customer (Browser)
    participant Mask as Custom Input Mask Parser
    participant API as Express Billing Controller
    participant DB as MySQL DB (Integer Cents)

    Customer->>Mask: Types "1.250,50" (Dutch Currency Format)
    Note over Mask: Clean string: Strip dots, convert comma to dot -> 1250.50
    Note over Mask: Multiply by 100 -> 125050 Integer Cents!
    Mask->>API: POST /invoices { amountCents: 125050 }
    API->>API: Calculate 21% VAT: Math.round((125050 * 21) / 100) = 26261 cents
    API->>DB: INSERT INTO invoices (subtotal_cents: 125050, vat_cents: 26261)
    DB-->>API: 200 OK
    API-->>Customer: Return payload
    Customer->>Customer: Intl.NumberFormat('nl-NL', {style: 'currency', currency: 'EUR'}).format(125050 / 100)
    Note over Customer: Renders "€ 1.250,50" accurately without float drift! ✅`;
  }

  if (id === 56) {
    return `sequenceDiagram
    autonumber
    actor Visitor as Visitor / Recruiter
    participant React as React Chat Hook (useStreamResponse)
    participant Nest as NestJS SSE Controller
    participant Groq as Groq LLaMA 3.3 70B API

    Visitor->>React: Types question about engineering experience
    React->>Nest: POST /api/ai/chat (Prompt + Context Window)
    Nest->>Groq: Request Chat Completion (stream: true)
    Note over Groq: Time-to-First-Token: 240ms! ⚡
    Groq-->>Nest: Token Chunk 1
    Nest-->>React: data: {"token": "..."}
    React-->>Visitor: Renders streaming text token-by-token
    Groq-->>Nest: Chunk [DONE]
    Nest-->>React: event: done
    React->>React: Finalize markdown in conversation history ✅`;
  }

  if (id === 68) {
    return `sequenceDiagram
    autonumber
    actor Manager as Workforce Manager
    participant Engine as Shift Partitioning Engine
    participant DB as Postgres/MySQL Database

    Manager->>Engine: Submit Shift: Friday 22:00 -> Saturday 06:00
    Note over Engine: Detects Midnight Crossing (Day Boundary)!
    Engine->>Engine: Split into Segment 1: Friday 22:00 -> 23:59:59 (2h Base Rate)
    Engine->>Engine: Split into Segment 2: Saturday 00:00 -> 06:00 (6h Weekend Multiplier)
    Engine->>DB: INSERT Segment 1 & Segment 2
    DB-->>Engine: Successfully Created!
    Note over Manager,Engine: Accidental Resubmission (Double Click)
    Manager->>Engine: Resubmit exact same shift
    Engine->>DB: INSERT with Duplicate Hash: SHA256(emp_id + start + end)
    DB-->>Engine: Unique Constraint Error (Duplicate Blocked!)
    Engine-->>Manager: 409 Conflict: Shift Already Recorded ✅`;
  }

  // Phase 3: JavaScript Core
  if (q.phaseId === 3) {
    if (text.includes('event loop') || text.includes('microtask') || text.includes('macrotask') || text.includes('settimeout')) {
      return `sequenceDiagram
    autonumber
    participant CallStack as Call Stack (Main Thread)
    participant Micro as Microtask Queue (Promise.then, queueMicrotask)
    participant Macro as Macrotask Queue (setTimeout, I/O)
    participant Loop as Event Loop Coordinator

    CallStack->>CallStack: Execute synchronous script line-by-line
    CallStack->>Micro: Promise.then() callback queued
    CallStack->>Macro: setTimeout(fn, 0) timer callback queued
    Note over CallStack: Call Stack becomes completely empty!
    Loop->>Micro: Drain ALL Microtasks until queue is empty! ⚡
    Loop->>Macro: Pick ONE oldest Macrotask to execute
    Macro->>CallStack: Push callback onto Call Stack and execute`;
    }
    if (text.includes('closure') || text.includes('lexical') || text.includes('scope')) {
      return `sequenceDiagram
    autonumber
    participant Engine as V8 JavaScript Engine
    participant Global as Global Lexical Environment
    participant Outer as Outer Function Scope
    participant Inner as Inner Function (Closure)

    Engine->>Global: Creates Global Execution Context
    Global->>Outer: Invokes outerFunction(config)
    Note over Outer: Allocates local variables (token, secret) on Heap
    Outer-->>Global: Returns innerFunction
    Note over Engine: outerFunction execution context popped off call stack!
    Global->>Inner: Invokes returned innerFunction()
    Note over Inner: Retains reference to Outer Lexical Environment (Closure!)
    Inner-->>Global: Successfully accesses preserved token & secret ✅`;
    }
    if (text.includes('promise') || text.includes('async') || text.includes('await')) {
      return `sequenceDiagram
    autonumber
    actor Caller as Async Function Caller
    participant Stack as Call Stack
    participant PromiseAPI as Promise State Machine
    participant Micro as Microtask Queue

    Caller->>Stack: async fetchUserData()
    Stack->>PromiseAPI: new Promise(pending)
    Stack->>PromiseAPI: await networkRequest()
    Note over Stack: Function paused; control yielded to caller!
    PromiseAPI-->>Micro: Network completes -> Promise resolved(data)
    Micro->>Stack: Resume async function execution at await line
    Stack-->>Caller: Returns final processed data ✅`;
    }
    // Default JS
    return `sequenceDiagram
    autonumber
    participant Parser as V8 TurboFan Parser
    participant Context as Execution Context
    participant Memory as Memory (Stack vs Heap)
    participant Output as Console / UI

    Parser->>Context: Parse ${q.question.replace(/["']/g, '')}
    Context->>Memory: Allocate variable bindings & prototypes
    Context->>Output: Evaluate expressions and return result
    Note over Memory: Garbage Collector cleans unreferenced memory ✅`;
  }

  // Phase 4: TypeScript
  if (q.phaseId === 4) {
    return `sequenceDiagram
    autonumber
    participant Dev as Developer Code (.ts)
    participant TSC as TypeScript Compiler (tsc)
    participant TypeCheck as Static Type Checker
    participant JS as Emitted JavaScript (.js)
    participant Runtime as Node.js / Browser Runtime

    Dev->>TSC: Run typecheck / build
    TSC->>TypeCheck: Validate interfaces, generics & union narrowing
    alt Type Mismatch
        TypeCheck-->>Dev: Compile Error: Type mismatch detected! ❌
    else Types Valid
        TypeCheck->>JS: Strip type annotations (Zero runtime overhead)
        JS->>Runtime: Execute clean, validated JavaScript ✅
    end`;
  }

  // Phase 5: React & Next.js
  if (q.phaseId === 5) {
    return `sequenceDiagram
    autonumber
    actor User as User Browser
    participant NextServer as Next.js Server (RSC / SSR)
    participant Hydrate as React Hydration Engine
    participant VDOM as Virtual DOM & Fiber Reconciler
    participant RealDOM as Browser Real DOM

    User->>NextServer: GET /page (Initial Request)
    NextServer->>NextServer: Render React Server Components to static HTML
    NextServer-->>User: Fast HTML delivery (Sub-second FCP!) ⚡
    User->>Hydrate: Load client bundle & hydrate event handlers
    Hydrate->>VDOM: Reconcile Fiber tree with DOM nodes
    VDOM->>RealDOM: Attach reactive state listeners (Instant interactivity) ✅`;
  }

  // Phase 6 & 8: Node.js, Express & NestJS
  if (q.phaseId === 6 || q.phaseId === 8) {
    return `sequenceDiagram
    autonumber
    actor Client as Client / Mobile App
    participant Middleware as Auth Guard / Middleware
    participant Pipe as Validation Pipe (class-validator DTO)
    participant Interceptor as Controller & Interceptor Layer
    participant Service as Domain Service (TypeORM)
    participant DB as PostgreSQL Database

    Client->>Middleware: Request with JWT Bearer Token
    Middleware->>Pipe: Validate token & session state
    Pipe->>Interceptor: Validate request DTO schema
    Interceptor->>Service: Dispatch execution to Service Layer
    Service->>DB: Execute query inside transaction
    DB-->>Service: Return query records
    Service-->>Interceptor: Transform entity to Response DTO
    Interceptor-->>Client: Standardized HTTP 200 OK Response ✅`;
  }

  // Phase 7: Databases: SQL vs Mongo
  if (q.phaseId === 7) {
    return `sequenceDiagram
    autonumber
    participant App as Lending Service
    participant TX as Transaction Coordinator
    participant SQL_DB as PostgreSQL (ACID Engine)
    participant BTree as B-Tree Composite Index

    App->>TX: BEGIN TRANSACTION (SERIALIZABLE)
    TX->>BTree: Fast indexed lookup: WHERE tenant_id=5 AND status='APPROVED'
    BTree-->>TX: Direct row pointer (O(log N) lookup)
    TX->>SQL_DB: UPDATE loan SET disbursed_amount = DECIMAL(12,2)
    alt Commit
        TX->>SQL_DB: COMMIT (Guaranteed Durability)
        SQL_DB-->>App: Transaction Successful ✅
    else Any Error
        TX->>SQL_DB: ROLLBACK (Zero Data Corruption) ❌
    end`;
  }

  // Phase 9: Testing & Agile
  if (q.phaseId === 9) {
    return `sequenceDiagram
    autonumber
    actor Dev as Developer (TDD Cycle)
    participant Runner as Vitest Test Runner
    participant MSW as Mock Service Worker
    participant Unit as Unit Under Test

    Dev->>Runner: Run test: "should calculate overtime correctly"
    Runner->>Unit: Invoke calculateHours([shift1, shift2])
    Unit->>MSW: POST /api/rates (Intercepted at Network Layer)
    MSW-->>Unit: Return Mocked Rate: 1.5x Overtime
    Unit-->>Runner: Returns calculated total: $450.00
    Runner->>Runner: Assertion: expect(total).toBe(450.00) (Passed!) ✅`;
  }

  // Phase 10: High-Scale System Design
  if (q.phaseId === 10) {
    return `sequenceDiagram
    autonumber
    actor Users as 100,000+ Concurrent Borrowers
    participant EdgeCDN as Edge CDN & DDoS Shield
    participant LB as Layer 7 Load Balancer
    participant Pods as Autoscaled Node.js Pods
    participant Redis as Redis Cluster (Cache-Aside)
    participant PrimaryDB as PostgreSQL Primary (Writes)
    participant ReplicaDB as PostgreSQL Replicas (Reads)

    Users->>EdgeCDN: Static Assets & Pre-warmed Caches
    Users->>LB: Dynamic Loan Application Requests
    LB->>Pods: Round-robin distribution
    Pods->>Redis: Check cached credit tiers (Sub-millisecond)
    alt Cache Miss
        Pods->>ReplicaDB: Read query offloaded from primary
        ReplicaDB-->>Pods: Data returned -> Write to Redis with TTL
    end
    Pods->>PrimaryDB: Write new loan inside ACID transaction ✅`;
  }

  // Phase 11: Deployment & Docker
  if (q.phaseId === 11) {
    return `sequenceDiagram
    autonumber
    actor Dev as Git Push to main
    participant CI as GitHub Actions CI
    participant Docker as Multi-Stage Docker Builder
    participant K8s as Kubernetes Cluster
    participant Health as Health Check Probe (/healthz)

    Dev->>CI: Push code commit
    CI->>CI: Run Linters, TypeScript Checks, and Vitest Suites
    CI->>Docker: Build Production Image (Alpine Linux Standalone)
    Docker->>K8s: Trigger Zero-Downtime Rolling Deployment
    K8s->>Health: Probe new pod: GET /healthz
    Health-->>K8s: 200 OK (Pod Healthy!)
    K8s->>K8s: Switch traffic to new pods & decommission old pods ✅`;
  }

  // Phase 12: Security & Reliability
  if (q.phaseId === 12) {
    return `sequenceDiagram
    autonumber
    actor Attacker as Malicious Traffic / Scraper
    participant WAF as Cloudflare WAF / Rate Limiter
    participant Gateway as NestJS API Gateway
    participant Sanitizer as DOMPurify / SQL Param Parser
    participant DB as Database

    Attacker->>WAF: Rapid brute-force requests / Injection payload
    WAF-->>Attacker: 429 Too Many Requests (Rate limit exceeded!) ❌
    Attacker->>Gateway: POST /comment (<script>alert(1)</script>)
    Gateway->>Sanitizer: Strip dangerous tags and javascript: URIs
    Sanitizer->>DB: Parameterized query (Zero SQL injection risk)
    DB-->>Gateway: Saved safely
    Gateway-->>Attacker: Safe sanitized response ✅`;
  }

  // Phase 13: Closing & Lessons
  if (q.phaseId === 13) {
    return `sequenceDiagram
    autonumber
    actor Engineer as Lead Engineer (Sameer)
    participant Team as Engineering Team / Stakeholders
    participant PostMortem as Post-Mortem Documentation
    participant Guardrails as Automated Guardrails (CI / Locks)

    Engineer->>Team: Identify production anomaly (e.g. Concurrency collision)
    Engineer->>Engineer: Contain immediate issue & restore service
    Engineer->>PostMortem: Document root cause, timeline, and impact
    Engineer->>Guardrails: Implement pessimistic locks and automated tests
    Guardrails-->>Team: Zero regression recurrence guaranteed ✅`;
  }

  // General Fallback Sequence Flow
  return `sequenceDiagram
    autonumber
    actor Client as User / Browser Client
    participant Gateway as API Gateway (NestJS)
    participant Service as Business Service Layer
    participant DB as Relational Database (PostgreSQL)

    Client->>Gateway: Request: ${q.question.replace(/["']/g, '')}
    Gateway->>Gateway: Validate DTO & Authenticate Token
    Gateway->>Service: Dispatch execution to domain handler
    Service->>DB: Query / Mutation with transactional isolation
    DB-->>Service: Return query result
    Service-->>Gateway: Format sanitized JSON payload
    Gateway-->>Client: 200 OK Response delivered ✅`;
}

// 5. Update Questions Array
let updatedCount = 0;
const enrichedQuestions = questions.map(q => {
  const type = classifyQuestion(q);
  const cause = getEvaluationCause(q, type);

  // If Phase 1 (Intro, Resume, Career), user explicitly requested NO technical STAR or sequence diagrams!
  if (q.phaseId === 1) {
    return {
      ...q,
      questionType: type,
      evaluationCause: cause,
      star: null,
      mermaidDiagram: null
    };
  }

  // For all technical questions (Phase 2 to Phase 13), provide proper technical STAR and sequence diagrams
  const star = getTechnicalStar(q, type);
  const diagram = getTechnicalMermaid(q, type);
  updatedCount++;

  return {
    ...q,
    questionType: type,
    evaluationCause: cause,
    star: star,
    mermaidDiagram: diagram
  };
});

console.log(`Updated ${updatedCount} technical questions with dedicated STAR & Sequence Diagrams.`);
console.log(`Phase 1 (Q1–Q13) cleaned of artificial diagrams/STAR as requested.`);

// Write back to foundationFinanceData.js
const targetArrayPattern = /export const FOUNDATION_FINANCE_193_QUESTIONS = \[[\s\S]*?\n\];/;
const newArrayString = `export const FOUNDATION_FINANCE_193_QUESTIONS = ${JSON.stringify(enrichedQuestions, null, 2)};`;

const sourceContent = fs.readFileSync(dataFile, 'utf8');
if (!targetArrayPattern.test(sourceContent)) {
  console.error("Pattern not found in source file!");
  process.exit(1);
}

const updatedContent = sourceContent.replace(targetArrayPattern, newArrayString);
fs.writeFileSync(dataFile, updatedContent, 'utf8');

console.log(`Successfully written enriched technical data to ${dataFile}!`);
