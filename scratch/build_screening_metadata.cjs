const fs = require('fs');
const path = require('path');

const candidateProfile = {
  name: "Sameer",
  role: "Lead Full Stack Developer",
  company: "Tayseer Technologies",
  experienceYears: "Almost 4 Years",
  currentCTC: "₹6 LPA",
  targetCTC: "₹15 LPA",
  noticePeriod: "45 Days (Negotiable based on offer)",
  coreStack: "React, Next.js 16, TypeScript, Node.js, NestJS, MySQL, PostgreSQL, TypeORM, Prisma, Zustand, TanStack Query, Vitest, RTL, AWS, Stripe",
  projects: [
    {
      name: "Chrona",
      tagline: "Workforce & Timesheet Management SaaS",
      stack: "Next.js 16, TypeScript, Zustand, TanStack Query, NestJS, TypeORM, MySQL",
      highlights: [
        "Bulk timesheet optimization: 45-50s down to 1-2s using MySQL JSON_TABLE and batch set operations",
        "TypeORM QueryRunner explicit transaction management (ACID atomicity)",
        "Next.js edge middleware dual-token sync resolution (HTTP-only 'token' vs client 'chrona_token')",
        "Comprehensive audit history diffing engine and Vitest test fixes"
      ]
    },
    {
      name: "LesHub",
      tagline: "Dutch Driving School CRM & Scheduling ERP",
      stack: "React, Redux Toolkit, SWR, Node.js/Express, MySQL, Kendo/FullCalendar, Mollie",
      highlights: [
        "Optimistic drag-and-drop lesson rescheduling with snapshot rollback and AbortController",
        "Multi-tenant database query scoping (WHERE tenant_id = ?) and 404 security cloaking",
        "Coercion-induced unbounded loop / heap exhaustion production bug isolation and fix",
        "Multi-language i18n synchronization (English and Dutch / sync-nl.js)"
      ]
    },
    {
      name: "Fullstack Portfolio Platform",
      tagline: "Enterprise Product & Booking Suite",
      stack: "Next.js 16, NestJS, PostgreSQL, Prisma, Redis, Stripe, Razorpay, Google Calendar, Groq AI",
      highlights: [
        "Decoupled external API client to fix global AES-256 interceptor collision with Stripe Checkout",
        "SEO slug versus internal relational numeric ID resolution at controller/service boundaries",
        "Server-side Stripe webhook verification using raw request body buffers and HMAC signatures",
        "Concurrent appointment booking conflict prevention with database locking"
      ]
    }
  ]
};

const speakingRules = [
  { rule: "1. Pause Before Answering", description: "Wait 1 to 2 seconds after the recruiter asks a question. Breathe naturally, organize the first sentence, and speak with calm deliberation." },
  { rule: "2. One Idea Per Sentence", description: "Speak in short, punchy declarative sentences. End each thought with a verbal period. Never rush." },
  { rule: "3. Direct Answer First", description: "Deliver the direct conclusion immediately (Direct Pitch). Follow up with one concrete example and let the interviewer prompt for more." },
  { rule: "4. Replace Fillers with Silence", description: "When your mind searches for a word, close your lips. One second of silence projects senior authority; 'uh, um, like' projects panic." },
  { rule: "5. Never Bluff", description: "If you haven't used a tool professionally, say so cleanly. Explain what you do know from first principles and where you have applied related concepts." }
];

const ninetySecondPitch = {
  duration: "75–90 Seconds",
  anchors: [
    { title: "Anchor 1: Stack & Years", text: "I have almost four years of full-stack experience, mainly working with React, Next.js, Node.js, and NestJS across relational and document databases." },
    { title: "Anchor 2: Foundation (FunctionUp)", text: "I started with a frontend internship at FunctionUp, building responsive component architectures and integrating REST APIs." },
    { title: "Anchor 3: Client Scale (Graviti Chain)", text: "At Graviti Chain as a Senior Full Stack Developer, I delivered enterprise client platforms like Ecostance, CoverFi, and Web3Today, focusing on decoupled services, Stripe payments, and AWS deployments." },
    { title: "Anchor 4: High Impact (Tayseer Technologies)", text: "Currently as Lead Full Stack Developer at Tayseer Technologies, I build Chrona (timesheet SaaS) and LesHub (education CRM). My signature win was re-architecting Chrona's bulk timesheet engine: replacing sequential round-trips with MySQL JSON_TABLE batching inside a TypeORM transaction, cutting latency from 45–50s to 1–2s." },
    { title: "Anchor 5: The Goal", text: "I am now looking for a product-focused engineering team where I can take long-term technical ownership of scalable systems and contribute to reliable architectures." }
  ],
  fullScript: "Sure, let me walk you through my experience. I have almost four years of full-stack experience, mainly working with React, Next.js, Node.js, and NestJS across relational and document databases. I started with a frontend internship at FunctionUp, where I worked with React, responsive interfaces, and REST API integration. After that, I joined Graviti Chain as a Senior Full Stack Developer, where I worked on multiple client projects including Ecostance, CoverFi, and Web3Today, handling decoupled services, Stripe payment integrations, and AWS deployments. Currently, I work as a Lead Full Stack Developer at Tayseer Technologies on Chrona—our workforce and timesheet management platform—and LesHub, a Dutch education platform. One of my key contributions was optimizing Chrona's bulk timesheet creation flow: by replacing sequential database calls with MySQL set-based batch operations inside a managed TypeORM transaction, I reduced processing time from 45–50 seconds down to 1–2 seconds. My core stack is React, Next.js, TypeScript, Node.js, and NestJS. I am now looking for an opportunity where I can contribute to a product-focused engineering team, take ownership of features, and continue growing technically."
};

const salaryNegotiation = {
  currentCTC: "₹6.0 LPA",
  targetCTC: "₹15.0 LPA",
  hikePercent: "150% Increase",
  thirtyPercentHike: "₹7.8 LPA",
  scenarios: [
    {
      q: "What is your current CTC?",
      script: "My current CTC is ₹6 LPA.",
      note: "Stop immediately. Do not apologize or justify your current salary."
    },
    {
      q: "What are your salary expectations?",
      script: "Based on my full-stack experience, the technical ownership I've driven across frontend, backend, databases, and payments, and current market benchmarks for a Senior Full Stack Engineer, I am targeting around ₹15 LPA. I am open to discussing the overall opportunity and package structure.",
      note: "Say the number firmly and pause. Never lower your number preemptively."
    },
    {
      q: "You are asking for a 150% hike. Why should we give you that?",
      script: "I understand that 150% sounds like a significant jump on paper. However, compensation for a Senior Full Stack Engineer is based on the value delivered to the business, the complexity of systems owned, and the responsibilities of this position—not historical percentage indexing. In my recent work, I've eliminated 45-second database bottlenecks, architected edge authentication synchronization, integrated payment systems, and built resilient TypeScript services. Could you share the budgeted salary band for this position? If the role is a strong mutual fit, I'd like to understand the total package and see where we can align.",
      note: "Pivot away from percentage math and anchor to market value and demonstrable technical capability."
    },
    {
      q: "We can only give you a 30% hike (₹7.8 LPA). Is that okay?",
      script: "Thank you for being transparent about the budget constraints. However, ₹7.8 LPA would be below my current target. Before deciding, could you share the full budgeted salary band for this position? If the role is a strong fit, I'd be happy to understand the overall package and see whether there is room for discussion.",
      note: "Politely decline lowball offers while keeping the door open for budget expansion."
    },
    {
      q: "What is the absolute minimum salary you will accept?",
      script: "I'd prefer to understand the full technical responsibilities, team expectations, and complete compensation structure before committing to a minimum. My target is around ₹15 LPA, and I am open to evaluating a reasonable offer based on the overall opportunity.",
      note: "Never reveal a lower floor prematurely; let them make the first formal proposal."
    }
  ]
};

const difficultQuestions = [
  {
    q: "You joined Tayseer in February 2026. Why are you looking to switch so soon?",
    script: "That's a fair question, Kirtikumar. I joined Tayseer in February 2026 and have been doing meaningful work on Chrona's performance and authentication infrastructure. I am not actively looking to leave, nor am I applying broadly. However, when I saw this opportunity, the focus on product ownership, system scalability, and engineering depth stood out as a strong long-term alignment for my career. I am looking for my next long-term home where I can build and scale systems over multiple years."
  },
  {
    q: "You have a Lead title, but only around 3.5 to 4 years of experience. How can you be a Lead?",
    script: "I understand completely why you ask. Titles vary across companies. At Tayseer, the 'Lead' title reflects that I own features end-to-end—from frontend UX and state architecture down to database query optimization, TypeORM transactions, security audits, and code reviews. That said, I care much more about technical impact and problem-solving than titles on paper. I welcome being evaluated purely on my system design, coding standards, and architectural depth in your technical rounds."
  },
  {
    q: "We can only offer a Senior Developer role, not Lead or Manager. Are you okay with that?",
    script: "Yes, absolutely. A Senior Full Stack Developer role where I can take deep technical ownership, build reliable systems, and solve hard performance and data problems is exactly what I am targeting. Scope, team quality, and engineering challenges matter much more to me than a title."
  },
  {
    q: "Why do you want to move from service-based to product-based companies?",
    script: "My experience in service-based companies gave me exposure to different clients, fast turnaround times, and diverse tech stacks. Now, I want to invest deeply in a single product over the long term: understanding user behavior, optimizing database query paths, improving system resilience, and contributing to architecture as the application scales."
  }
];

const emergencyToolkit = [
  { scenario: "Need 2–3 seconds to think", phrase: "That's a great question. Let me take a moment to pull up the best production example for that." },
  { scenario: "Answer became too wordy or confusing", phrase: "Let me pause and put that more clearly. The main architectural takeaway is..." },
  { scenario: "Forgot an exact method or syntax name", phrase: "I don't recall the exact library method name off the top of my head, but the underlying mechanism is..." },
  { scenario: "Haven't used the tool professionally", phrase: "I haven't deployed that specific tool in production yet. My experience is with [Related Tool], and my understanding from first principles is that it operates by..." },
  { scenario: "Didn't hear or understand the prompt", phrase: "Could you please repeat the last part of the question regarding the database constraints?" }
];

const questionsToAskRecruiter = [
  { category: "Role & Technology", q: "Could you tell me more about the project, the core technology stack, and what the immediate high-priority architectural challenges are for this position?" },
  { category: "Team & Engineering Culture", q: "How is the engineering team structured between frontend, backend, product management, and QA?" },
  { category: "Process & Timeline", q: "Could you share the budgeted compensation range and the next technical stages in your interview process?" },
  { category: "Closing Sign-off", q: "Thank you for explaining the opportunity, Kirtikumar. It sounds like an exciting technical fit for my background across React, NestJS, and system performance, and I'd be delighted to proceed to the technical rounds." }
];

module.exports = {
  candidateProfile,
  speakingRules,
  ninetySecondPitch,
  salaryNegotiation,
  difficultQuestions,
  emergencyToolkit,
  questionsToAskRecruiter
};
