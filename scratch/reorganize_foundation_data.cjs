const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '../src/screening/data/foundationFinanceData.js');
const mod = require(dataFile);

const originalQuestions = mod.FOUNDATION_FINANCE_193_QUESTIONS;
console.log('Original questions count:', originalQuestions.length);

// Prompt updates for realistic interviewer questions
const QUESTION_PROMPT_UPDATES = {
  17: {
    question: "Tell me about a major backend performance bottleneck you diagnosed and resolved in production.",
    projectTag: "Chrona • Bulk Hour-Entry Batching (JSON_TABLE)"
  },
  22: {
    question: "Describe a challenging authentication or session synchronization bug you solved across client and server.",
    projectTag: "Chrona • Next.js Edge Middleware Cookie Desync"
  },
  40: {
    question: "Can you describe an unexpected client-side data parsing or response interceptor bug you debugged?",
    projectTag: "Portfolio Platform • AES Interceptor Double-Parsing"
  },
  45: {
    question: "How do you implement end-to-end payload encryption for API requests, and how do you handle exceptions like multipart file uploads?",
    projectTag: "Chrona • Global AES Encryption with Multipart Bypass"
  },
  49: {
    question: "Have you ever encountered a circular dependency issue in your architecture or HTTP interceptors? How did you isolate and resolve it?",
    projectTag: "Chrona • Axios 401 Interceptor Dynamic Import"
  },
  50: {
    question: "Tell me about a difficult database bug or stored procedure issue you diagnosed in production.",
    projectTag: "LesHub • Invoice Stored Procedure Infinite Loop"
  },
  139: {
    question: "How do you decide between MySQL and PostgreSQL for different projects? Can you compare them based on your production experience?",
    projectTag: "Chrona (MySQL) vs Portfolio (PostgreSQL)"
  },
  194: {
    question: "Tell me about a production bug you fixed involving date calculations, business terms preservation, or financial transaction integrity.",
    projectTag: "LesHub • Quote-to-Invoice Date Preservation"
  },
  195: {
    question: "Can you walk me through a tricky timezone, daylight saving, or date/time boundary bug you resolved in a production application?",
    projectTag: "Chrona • Midnight Shifts Day-Boundary Calculation"
  },
  196: {
    question: "How do you enforce business compliance and data immutability once a record is submitted or approved (e.g., preventing retroactive payroll or billing edits)?",
    projectTag: "Chrona • Timesheet Period Locking (HTTP 423)"
  },
  197: {
    question: "How do you handle race conditions, stale closures, and network cancellations when implementing optimistic UI in React?",
    projectTag: "LesHub • Optimistic Lead Board & AbortController"
  },
  198: {
    question: "Why does webhook cryptographic signature verification (like Stripe or PayPal) fail with standard JSON parsers, and how do you handle raw body buffering in Node.js/NestJS?",
    projectTag: "Portfolio Platform • Raw Body Stripe Webhook"
  },
  199: {
    question: "How do you prevent double-booking and concurrency race conditions when multiple users attempt to reserve the same time slot simultaneously?",
    projectTag: "Portfolio & LesHub • Pessimistic Locking & Constraints"
  },
  200: {
    question: "How do you architect and secure a multi-tenant database to guarantee zero cross-tenant data leakage?",
    projectTag: "LesHub • Multi-Tenant Isolation & 404 Cloaking"
  }
};

// Additional Project Tags for Phase 2 questions
const PHASE_2_TAGS = {
  14: "Project Ecosystem Overview",
  15: "Chrona • Lead Responsibilities & Stack",
  16: "Chrona • Line-Diffing Algorithm",
  17: "Chrona • MySQL JSON_TABLE Batching",
  18: "Chrona • TypeORM Transaction Management",
  19: "Chrona • React 19 & Next.js 15 Migration",
  20: "Chrona • Global Auth State (Zustand)",
  21: "Chrona • Vitest & RTL Testing Strategy",
  22: "Chrona • Edge Cookie Authentication",
  23: "Chrona • Axios 401 Silent Token Refresh",
  24: "Chrona • NestJS DTOs & Validation",
  25: "Chrona • Docker CI/CD & Rolling Deployments",
  26: "LesHub • Dutch Driving School ERP Overview",
  27: "LesHub • Kendo Scheduler Layout Styling",
  28: "LesHub • Dynamic WCAG Text Contrast",
  29: "LesHub • SWR Notification Deduplication",
  30: "LesHub • Dynamic Tenant PWA Manifests",
  31: "LesHub • Dutch nl-NL Formatting (Intl)",
  32: "LesHub • Stored Procedures & Multi-Tenancy",
  33: "LesHub • Mollie iDEAL Payment Gateway",
  34: "Portfolio • Monorepo Architecture Overview",
  35: "Portfolio • Stripe & Razorpay Webhooks",
  36: "Portfolio • Prisma PostgreSQL Multi-Schema",
  37: "Portfolio • SSE Streamed AI Chatbot",
  38: "Portfolio • Turborepo Shared Packages",
  39: "Portfolio • AWS S3 Presigned Uploads",
  40: "Portfolio • AES Interceptor Response Parsing",
  41: "Portfolio • XSS Sanitization (DOMPurify)",
  42: "Portfolio • Slug vs Numeric ID Routing",
  43: "Portfolio • Google Calendar 2-Way Sync",
  44: "Portfolio • Docker Compose Deployment",
  45: "Chrona • Global AES Request Body Encryption",
  46: "LesHub • HTML Number Input Concatenation Bug",
  47: "Chrona • Window Event Listener Memory Leak",
  48: "Chrona • MySQL Deadlock in Batch Approvals",
  49: "Chrona • Axios 401 Circular Dependency",
  50: "LesHub • Invoice Stored Procedure Infinite Loop",
  51: "LesHub • Express Middleware 404 Pipeline Bug",
  52: "Portfolio • Stale SWR Cache Invalidation",
  53: "Chrona • Mobile Safari 100vh Viewport Overflow",
  54: "Chrona • Date-fns UTC Timezone Shift",
  55: "LesHub • Redux Toolkit Immer State Mutation",
  56: "Chrona • TypeORM Circular Cascade Delete Bug",
  57: "Portfolio • Next.js Dynamic Route SSR Hydration",
  58: "Portfolio • Turborepo Monorepo Justification",
  59: "Chrona • Docker Healthcheck Stalled Container",
  60: "LesHub • WebSocket Exponential Backoff",
  61: "Chrona • NestJS Production Logger PII Masking",
  62: "Portfolio • Redis Distributed Rate Limiter",
  63: "LesHub • PDF Invoice Font Embedding",
  64: "Chrona • CSV Timesheet Export Memory Spike",
  65: "Chrona • MySQL Connection Pool Starvation",
  66: "Portfolio • Redis Cache Invalidation Strategy"
};

// Group questions by phaseId
const byPhase = {};
for (let p = 1; p <= 13; p++) byPhase[p] = [];

originalQuestions.forEach(q => {
  // Apply prompt updates if present
  if (QUESTION_PROMPT_UPDATES[q.id]) {
    q.question = QUESTION_PROMPT_UPDATES[q.id].question;
    q.projectTag = QUESTION_PROMPT_UPDATES[q.id].projectTag;
  }
  // Apply phase 2 tags
  if (q.phaseId === 2 && PHASE_2_TAGS[q.id] && !q.projectTag) {
    q.projectTag = PHASE_2_TAGS[q.id];
  }
  byPhase[q.phaseId].push(q);
});

// Re-sequence questions sequentially from 1 to 200
const reorderedQuestions = [];
let nextId = 1;
const phaseMetaRanges = {};

for (let p = 1; p <= 13; p++) {
  const startId = nextId;
  const questionsInPhase = byPhase[p];
  
  questionsInPhase.forEach(q => {
    q.id = nextId++;
    // Ensure phaseTitle is clean
    const phaseDef = mod.FOUNDATION_FINANCE_PHASES.find(ph => ph.id === p);
    if (phaseDef) {
      q.phaseTitle = phaseDef.title;
    }
    reorderedQuestions.push(q);
  });
  
  const endId = nextId - 1;
  phaseMetaRanges[p] = {
    start: startId,
    end: endId,
    count: questionsInPhase.length,
    range: `Q${startId}–Q${endId}`
  };
}

console.log('New Phase Ranges:', phaseMetaRanges);

// Update FOUNDATION_FINANCE_PHASES with clean continuous ranges
const updatedPhases = mod.FOUNDATION_FINANCE_PHASES.map(p => {
  const rangeInfo = phaseMetaRanges[p.id];
  return {
    ...p,
    range: rangeInfo.range,
    count: rangeInfo.count
  };
});

// Build the updated JS content
const fileContent = `// src/screening/data/foundationFinanceData.js
// FOUNDATION FINANCE — FULL STACK DEVELOPER INTERVIEW MASTERCLASS
// Complete preparation guide: 13 Phases, 200 Questions in exact chronological interview sequence.
// Grounded in Sameer's authentic background (Lead Full Stack Developer, Tayseer Technologies, Graviti Chain).
// Diversified across Chrona, LesHub, and Portfolio Platform (No repetitive single-story reliance).

export const FOUNDATION_FINANCE_PHASES = ${JSON.stringify(updatedPhases, null, 2)};

export const WHICH_EXAMPLE_FOR_WHICH_QUESTION = ${JSON.stringify(mod.WHICH_EXAMPLE_FOR_WHICH_QUESTION, null, 2)};

export const EIGHT_STEP_SYSTEM_DESIGN_FRAMEWORK = ${JSON.stringify(mod.EIGHT_STEP_SYSTEM_DESIGN_FRAMEWORK, null, 2)};

export const PHASE_1_PRACTICE_CHECKLIST = ${JSON.stringify(mod.PHASE_1_PRACTICE_CHECKLIST, null, 2)};

export const FINAL_READINESS_CHECKLIST = ${JSON.stringify(mod.FINAL_READINESS_CHECKLIST, null, 2)};

export const FOUNDATION_FINANCE_193_QUESTIONS = ${JSON.stringify(reorderedQuestions, null, 2)};
`;

fs.writeFileSync(dataFile, fileContent, 'utf8');
console.log('Successfully wrote updated foundationFinanceData.js with 200 resequenced questions!');
