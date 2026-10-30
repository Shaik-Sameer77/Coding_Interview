// src/screening/components/FoundationFinanceMasterHub.jsx
// Dedicated Foundation Finance Company (FFC) Screening & STAR Method Masterclass
// Complete with Executive Dossier, 20-Min Call Script, 6 Core STAR Questions, System Design, Mermaid Sequence Diagram, and DB Entity Schema

import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, DollarSign, Clock, CheckCircle2, Copy, Check,
  Layers, Zap, Cpu, Sparkles, MessageSquare, AlertTriangle, ArrowRight,
  Database, GitCommit, FileText, HelpCircle, ChevronDown, ChevronUp,
  MapPin, Calendar, Award, ExternalLink, Code2, Users
} from 'lucide-react';
import FormattedMarkdownText from '../../shared/FormattedMarkdownText';
import SyntaxCodeBlock from '../../shared/SyntaxCodeBlock';
import MermaidRenderer from '../../shared/MermaidRenderer';

export default function FoundationFinanceMasterHub() {
  const [activeSubTab, setActiveSubTab] = useState('callPlaybook'); // 'callPlaybook' | 'starQuestions' | 'systemDesign' | 'closingQuestions'
  const [activeStarIdx, setActiveStarIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 6 Canonical STAR Screening Questions
  const STAR_QUESTIONS = [
    {
      id: 1,
      title: "Tell me about a time you were unsure of how to do a certain task. How did you handle it?",
      tag: "Problem Solving & Technical Agility",
      companyContext: "Glassdoor Reported Question for Foundation Finance",
      situation: "In Chrona (our workforce timesheet platform), users submitting monthly timesheet batches containing 200+ daily entries were experiencing severe 45-second API timeouts and database locking. I was tasked with optimizing this bulk save operation into a sub-second response without losing existing audit records.",
      task: "I had never worked with MySQL 8's native `JSON_TABLE` function before, and our TypeORM setup was generating separate `INSERT` and `UPDATE` queries per line item ($O(N)$ network roundtrips). I needed to determine the best approach to parse raw JSON bulk payloads directly inside the database engine safely without risking SQL injection or data corruption.",
      action: "1. Rather than guessing in production, I spun up an isolated Docker database and created a benchmark test with 1,000 synthetic timesheet rows.\n2. I researched MySQL 8 `JSON_TABLE` vs bulk repository batching. I designed a stored procedure that ingested the JSON array, transformed it into a relational temporary table, joined it against existing timesheets using composite keys `(employee_id, work_date)`, and performed a single bulk `INSERT ... ON DUPLICATE KEY UPDATE`.\n3. I verified edge cases like midnight shift splits (22:00 to 06:00 across midnight) and null overtime multipliers.\n4. I documented the JSON schema contract for the backend team and wrote Vitest integration tests simulating connection drops during batch execution.",
      result: "The API latency dropped from 45 seconds down to 800 milliseconds (a 98% reduction), database connection pool utilization decreased by 70%, and we eliminated timeout errors entirely across our 10,000+ active workforce users.",
      spokenScript: "In Chrona, our timesheet bulk-save API was taking 45 seconds and timing out on large employee batches. I needed to optimize it into a sub-second operation, but our ORM was performing individual queries per line item.\n\nI hadn't worked with MySQL 8's native JSON_TABLE function before, so rather than guessing, I isolated the problem in a local test environment with synthetic data. I researched how JSON_TABLE transforms JSON payloads into virtual relational tables inside a stored procedure. I implemented a prototype that joined the virtual table against existing records to perform a single batch INSERT ... ON DUPLICATE KEY UPDATE.\n\nI systematically tested edge cases like midnight shifts and null rates, and documented the input contract for the team. The result was dropping latency from 45 seconds down to 800 milliseconds and completely eliminating timeouts. This taught me that when facing an unfamiliar technology, creating an isolated proof-of-concept and measuring metrics before touching production is the fastest path to success.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor Admin as Workforce Admin
    participant React as Chrona Frontend (React)
    participant API as NestJS Gateway
    participant StoredProc as MySQL 8 Stored Procedure
    participant JSONTable as JSON_TABLE Virtual Engine
    participant DB as timesheets Table

    Admin->>React: Submits 200+ Daily Timesheet Entries
    React->>API: POST /api/timesheets/bulk (JSON Array)
    Note over API: TypeORM QueryRunner: BEGIN TRANSACTION
    API->>StoredProc: CALL SaveBulkTimesheets(json_payload)
    StoredProc->>JSONTable: Parse JSON into virtual rows
    Note over JSONTable: Maps: id, employee_id, date, hours, rate_multiplier
    JSONTable-->>StoredProc: Virtual relational dataset
    StoredProc->>DB: INSERT INTO timesheets (...) ON DUPLICATE KEY UPDATE hours=VALUES(hours)
    DB-->>StoredProc: 200 rows upserted in single I/O roundtrip! (4ms)
    Note over API: TypeORM QueryRunner: COMMIT TRANSACTION
    API-->>React: 200 OK (800ms total latency vs 45s previously!)
    React-->>Admin: "Timesheets Saved Successfully" ✅`
    },
    {
      id: 2,
      title: "Tell me about a time that you handled a difficult situation or high-stakes production adversity.",
      tag: "Production Reliability & Crisis Resolution",
      companyContext: "Glassdoor Reported Question for Foundation Finance",
      situation: "Shortly after a production release of Chrona, enterprise users began experiencing random session logouts and unauthorized 401 errors when navigating between client pages, particularly during high-traffic morning check-in peaks.",
      task: "As the Lead Full Stack Developer, I had to diagnose and resolve this issue under pressure without rolling back the entire release, as other mission-critical features were in use.",
      action: "1. I inspected network logs and cookie headers across browser sessions and isolated a race condition between Next.js Edge Middleware and our NestJS backend.\n2. The system had dual cookies: an HttpOnly `access_token` and a JavaScript-accessible `client_session_indicator`. The Edge Middleware was checking the client indicator, which had a shorter TTL than the backend token, causing the middleware to erroneously redirect authenticated users to the login screen.\n3. Furthermore, when the token expired, Axios interceptors were triggering simultaneous refresh calls that caused circular dependencies and token collisions.\n4. I unified cookie lifecycles with synchronous max-age settings, implemented a single-flight Promise lock in the Axios interceptor so multiple concurrent 401s awaited the same refresh request, and added a graceful token-refresh window 2 minutes before expiration.",
      result: "The session dropping issue was resolved within 3 hours. We restored 100% session stability for all 10,000+ users, eliminated token collision races, and instituted automated Playwright end-to-end tests for all authentication lifecycles.",
      spokenScript: "In Chrona, we faced a high-stakes production issue where users were randomly logged out during morning peak hours. As Lead Full Stack Developer, I immediately dove into network traffic traces.\n\nI identified a race condition: our Next.js Edge Middleware was verifying a client indicator cookie whose expiration was desynchronized from the backend HttpOnly JWT. When simultaneous API calls hit 401s, our Axios interceptor was spawning multiple refresh requests in parallel, colliding and invalidating each other.\n\nI resolved it by synchronizing cookie expiration scopes, adding a single-flight Promise mutex in Axios so concurrent requests queue behind a single token refresh, and proactively refreshing tokens 2 minutes before expiry. We restored full session stability in under 3 hours with zero regressions. In financial and enterprise systems, edge cases in authentication must be guarded with atomic locks.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor User as Enterprise User
    participant Edge as Next.js Edge Middleware
    participant Axios as Axios Interceptor (Single-Flight Mutex)
    participant Nest as NestJS Auth Controller

    User->>Edge: GET /dashboard (Peak morning check-in)
    Note over Edge: Checks client_session_indicator (Desynchronized 15m TTL)
    alt Old Flawed Flow (Adversity Incident)
        Edge-->>User: 307 Redirect to /login (Session Swallowed!)
    else Restored Synchronized Flow
        Edge->>Nest: Forward request with validated session
        Nest-->>User: 200 OK
    end

    Note over User,Axios: Parallel Requests (e.g. /profile, /shifts) hit 401
    Axios->>Axios: Detects multiple 401s -> Latch activated!
    Note over Axios: Only 1 refresh request dispatched, others queued
    Axios->>Nest: POST /auth/refresh
    Nest-->>Axios: 200 OK (New HttpOnly access token)
    Axios->>Nest: Replay buffered requests with new token
    Nest-->>User: Data loaded seamlessly without logout! ✅`
    },
    {
      id: 3,
      title: "Tell me about an experience working in a fast-paced environment with tight deadlines.",
      tag: "Execution Speed & Prioritization",
      companyContext: "Indeed Reported Question for Foundation Finance",
      situation: "In LesHub (our Dutch driving school ERP system), our major enterprise client signed contracts with 25 new driving school franchisees. We had a strict 3-week deadline before the academic school year to deliver multi-tenant PWA support and a customized drag-and-drop scheduling calendar.",
      task: "I needed to lead the frontend and API delivery, customize the third-party KendoReact Scheduler with complex instructor availability rules, and make the application installable as a branded PWA per tenant, all within 3 weeks.",
      action: "1. I broke the 3-week sprint into 3 clear milestones: Week 1 for multi-tenant PWA manifest & database schemas, Week 2 for KendoReact Scheduler customization, and Week 3 for integration, Dutch localization (nl-NL), and QA.\n2. In the scheduler, events had dynamic background colors chosen by instructors. Text became unreadable on dark or bright backgrounds. I implemented an inline WCAG 2.1 luminance algorithm (`(0.299*R + 0.587*G + 0.114*B)`) to dynamically set text to pure black or white for contrast compliance.\n3. For multi-tenant PWA, instead of static manifests, I built a dynamic Next.js/Express API route `/api/manifest` that resolved the tenant from the hostname and returned customized icons, app name, and theme colors.\n4. I held 15-minute daily standups and unblocked team members immediately on API contracts.",
      result: "We delivered the complete feature set 3 days ahead of the deadline. All 25 schools onboarded on schedule, processing over 1,500 daily lesson bookings with zero accessibility or branding issues.",
      spokenScript: "At Tayseer Technologies on the LesHub ERP project, we had a strict 3-week deadline to onboard 25 driving school tenants with customized scheduling and multi-tenant PWA capabilities before the school season started.\n\nTo manage this fast pace without sacrificing quality, I broke the timeline into 3 focused milestones. In the scheduler, I tackled a major readability issue where dynamic instructor colors made text unreadable by writing an algorithm based on WCAG luminance formulas to set high-contrast text automatically. For the PWA, I built dynamic manifest endpoints that injected each tenant's branding on the fly based on subdomain.\n\nBy establishing clear API contracts early and holding focused 15-minute daily unblocking sessions, we shipped 3 days early. Over 1,500 daily bookings were handled without a single critical bug.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor Student as Student / Instructor Device
    participant Subdomain as DNS / Subdomain Router
    participant API as Dynamic Manifest API (/api/manifest)
    participant Kendo as KendoReact Scheduler
    participant WCAG as WCAG Luminance Engine

    Student->>Subdomain: Visits "autorijschool-amsterdam.leshub.nl"
    Subdomain->>API: GET /api/manifest (Host Header: autorijschool-amsterdam)
    API->>API: Resolve Tenant ID & Brand Assets from DB
    API-->>Student: Return Dynamic PWA Manifest (Custom Icon & Brand Color)
    Note over Student: Device prompts: "Install Autorijschool Amsterdam App" 📱

    Student->>Kendo: Opens Weekly Schedule (Custom Instructor Colors)
    Kendo->>WCAG: itemRender({ backgroundColor: '#FDE047' })
    Note over WCAG: Luminance: 0.299R + 0.587G + 0.114B = 0.81 (Bright)
    WCAG-->>Kendo: High contrast text: #090D16 (Black) -> 11.2:1 Contrast!
    Kendo-->>Student: Accessible, perfectly styled schedule delivered on time! ✅`
    },
    {
      id: 4,
      title: "Tell me about a time a bug occurred because the frontend and backend disagreed (or team communication breakdown).",
      tag: "Cross-Layer Debugging & Team Empathy",
      companyContext: "Cross-Stack Collaboration Question",
      situation: "In LesHub, we introduced a numeric input for lesson package hours and pricing. Shortly after testing, QA reported that entering numbers in package configurations caused the browser tab to freeze, CPU usage to spike to 100%, and the server to receive invalid package calculations.",
      task: "The frontend developer thought the backend API was rejecting valid payloads, while the backend developer claimed the frontend was sending corrupted numbers. As the Lead Developer, I needed to isolate the root cause impartially and establish a shared contract.",
      action: "1. I pulled the PR and captured browser performance profiles in Chrome DevTools.\n2. I found that the frontend was reading the HTML `<input type=\"number\">` as a JavaScript string (`\"15\"`). When adding hours, JavaScript evaluated `\"15\" + \"5\" = \"155\"` hours instead of `20`.\n3. The component had a `while` loop that generated time slots up to the total hours; evaluating 155 hours with 15-minute increments caused an infinite render loop and memory leak in the browser.\n4. Rather than assigning blame, I brought both developers together. I demonstrated the string coercion behavior, introduced TypeScript runtime schema validation using Zod on both client and server DTOs, and added automated unit tests verifying numeric sanitization before calculation.",
      result: "The browser freeze was resolved immediately, package calculations were guaranteed accurate, and our team adopted Zod schema validation across all numeric financial forms.",
      spokenScript: "In LesHub, we hit a critical bug where entering lesson package hours froze the browser with 100% CPU. The frontend and backend developers were blaming each other's code.\n\nI stepped in to investigate objectively using Chrome DevTools memory profiling. I discovered that HTML number inputs return strings in JavaScript. When the frontend did addition, it coerced values into string concatenation—turning 15 plus 5 into 155 hours. A downstream slot generator was looping thousands of times, locking the main UI thread.\n\nInstead of blaming anyone, I gathered both developers to walk through the root cause. I implemented strict Zod runtime schema validation on both client inputs and backend DTOs to enforce numerical coercion. We fixed the issue within 2 hours and established runtime validation as a standard across all our financial inputs.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor Admin as Driving School Admin
    participant Input as HTML <input type="number">
    participant State as React Component State
    participant SlotGen as Time Slot Generator (while loop)
    participant Zod as Zod Runtime Validation (Fix)

    Admin->>Input: Enters "15" hours + "5" bonus hours
    Input->>State: Returns string values: "15" and "5"
    
    alt Buggy Behavior (Old Code)
        State->>SlotGen: totalHours = "15" + "5" = "155" hours! (String Concatenation)
        Note over SlotGen: while (currentMin < 155 * 60) -> 620 iterations per student!
        Note over SlotGen: Browser UI Thread Locks Up! CPU at 100%! 💥
    else Zod Runtime Coercion (Your Fix)
        State->>Zod: PackageSchema.parse({ hours: e.target.value })
        Note over Zod: z.coerce.number().min(1).max(50) -> Strictly 15 + 5 = 20!
        Zod->>SlotGen: totalHours = 20 (Safe integer)
        SlotGen-->>Admin: Instant, accurate slot preview (0ms UI lag) ✅
    end`
    },
    {
      id: 5,
      title: "What makes you a strong fit for this Full Stack Developer role at Foundation Finance?",
      tag: "Culture Fit & Value Proposition",
      companyContext: "Flagship Fit Question for Foundation Finance",
      situation: "Foundation Finance is a specialized consumer-financing company that empowers home-improvement contractors to offer point-of-sale financing to homeowners, requiring reliable application flows, accurate monetary calculations, and tight partner integrations.",
      task: "I need to demonstrate why my technical background and engineering mindset directly translate to the challenges of consumer lending technology.",
      action: "My background aligns directly with the core requirements of Foundation Finance across four dimensions:\n1. Full-Stack Ownership: I trace issues across the entire lifecycle—from accessible React/Next.js forms down to SQL query plans and transaction boundaries.\n2. Financial & Data Integrity: In Chrona and LesHub, I've managed sensitive payroll and invoice workflows where precision matters. I never use floating-point types for currency, always enforcing `DECIMAL(12,2)` in SQL, integer cents in APIs, and ACID transactions.\n3. Secure Partner & Webhook Integrations: In my Portfolio Platform, I architected Stripe and Razorpay webhook verifications using raw body buffers and cryptographic HMAC signatures with idempotency keys to prevent double-charges.\n4. Pragmatic Delivery: I value clear code, comprehensive testing, and transparent communication.",
      result: "I can ramp up quickly on Foundation Finance's LaunchPAD dealer portal and backend underwriting APIs, contributing dependable code from Day 1.",
      spokenScript: "What makes me a great fit for Foundation Finance is that I specialize in full-stack engineering where data correctness, security, and workflow reliability are non-negotiable.\n\nIn consumer lending, a bug isn't just a UI glitch—it affects loan approvals, contractor payouts, and compliance. Across my work on Chrona, LesHub, and my personal platform, I've consistently owned end-to-end features involving sensitive financial data: from raw-buffer HMAC webhook verification for Stripe payments, to ACID transaction boundaries and exact decimal math for invoicing.\n\nI don't just write frontend components or isolated API endpoints; I understand how data moves through every layer—from validation and authentication down to database indexing and locking. I bring disciplined testing, honest communication, and deep enthusiasm for your home-improvement financing mission.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor Homeowner as Homeowner / Contractor
    participant Portal as LaunchPAD Portal (Next.js)
    participant Gateway as API Gateway (NestJS)
    participant Engine as Credit Underwriting Engine (Tiers A-D)
    participant DB as PostgreSQL (ACID DECIMAL(12,2))
    participant ESign as DocuSign / E-Sign Frame
    participant ACH as ACH Contractor Disbursement

    Homeowner->>Portal: Enters Project ($12,500 HVAC) & Credit Details
    Portal->>Gateway: POST /api/v1/applications (Idempotency-Key)
    Gateway->>DB: BEGIN TRANSACTION (Insert Application Pending)
    Gateway->>Engine: Run Credit Check (FICO 640 -> Tier B Approval)
    Engine-->>Gateway: Approved: Tier B (8.99% APR, 60 Months)
    Gateway->>DB: UPDATE Application SET status='APPROVED', tier='B'
    Gateway-->>Portal: Instant Approval & Financing Terms
    
    Portal->>ESign: Embed DocuSign Note
    Homeowner->>ESign: Signs Loan Agreement
    ESign->>Gateway: Webhook: signature.completed (HMAC SHA-256 raw-body)
    Gateway->>DB: UPDATE status='SIGNED', document_verified=TRUE
    Gateway->>ACH: Disburse $12,500 to Contractor Bank
    ACH-->>DB: Payout Confirmation Reference & COMMIT
    Gateway-->>Homeowner: SMS/Email: "Project Funded Successfully" ✅`
    },
    {
      id: 6,
      title: "Tell me about an engineering mistake you made in production, and what you learned from it.",
      tag: "Honesty, Accountability & Continuous Learning",
      companyContext: "Culture Fit & Maturity Question",
      situation: "Early in my work on LesHub, I was tasked with updating invoice generation logic to auto-increment invoice numbers per tenant (e.g. `INV-2024-001`).",
      task: "I wrote a database stored procedure to calculate the next sequence number based on `MAX(invoice_number) + 1` for the given tenant ID.",
      action: "1. Under normal single-user testing, the procedure worked cleanly. However, in production, when two administrators generated invoices simultaneously, both transactions read the same `MAX()` value, resulting in a unique constraint collision and an unhandled 500 error.\n2. Worse, an unhandled loop in the fallback retry logic caused CPU utilization on the MySQL server to spike.\n3. I immediately notified my tech lead, temporarily paused invoice generation for 15 minutes, and rewrote the procedure using row-level locking (`SELECT sequence_val FROM tenant_sequences WHERE tenant_id = ? FOR UPDATE`).\n4. I added an explicit retry counter limited to 3 attempts, added automated concurrent load tests with k6, and instituted a post-mortem review.",
      result: "The duplicate invoice collision was eliminated forever. I learned that concurrency and locking must be designed from day one, not treated as an afterthought.",
      spokenScript: "Early in my career on LesHub, I implemented an auto-incrementing invoice number feature. In local testing it worked fine, but in production, two admins generated invoices at the exact same second. Both read the same maximum number, causing a unique constraint collision and a 500 error.\n\nI owned the mistake immediately, alerted my lead, and implemented row-level locking with \`SELECT ... FOR UPDATE\` on a dedicated tenant sequence table to serialize the counter safely. I capped retries at 3 and added concurrent integration tests to prevent regressions.\n\nThat taught me a permanent engineering lesson: never design financial sequence counters or state updates assuming single-threaded execution. Always design for concurrency and verify locking semantics under load.",
      mermaidDiagram: `sequenceDiagram
    autonumber
    actor AdminA as Admin A (Tenant 12)
    actor AdminB as Admin B (Tenant 12)
    participant StoredProc as Stored Procedure
    participant Table as tenant_invoice_counters Table
    participant Inv as invoices Table

    Note over AdminA,AdminB: Simultaneous Invoice Generation (Same Second)
    par Request A
        AdminA->>StoredProc: CALL GenerateInvoiceNumber(tenant_id: 12)
        StoredProc->>Table: SELECT current_val FROM tenant_invoice_counters WHERE tenant_id=12 FOR UPDATE
        Note over Table: Pessimistic Row Lock Acquired by Request A!
    and Request B
        AdminB->>StoredProc: CALL GenerateInvoiceNumber(tenant_id: 12)
        StoredProc->>Table: SELECT current_val ... FOR UPDATE
        Note over Table: Request B Blocked & Queued Behind Lock ⏳
    end

    StoredProc->>Table: UPDATE current_val = 89 WHERE tenant_id=12
    StoredProc->>Inv: INSERT INTO invoices (number: 'INV-2024-0089')
    Note over Table: Lock Released on COMMIT!
    StoredProc-->>AdminA: Returns 'INV-2024-0089' ✅

    Note over Table: Request B Acquires Lock!
    StoredProc->>Table: UPDATE current_val = 90 WHERE tenant_id=12
    StoredProc->>Inv: INSERT INTO invoices (number: 'INV-2024-0090')
    StoredProc-->>AdminB: Returns 'INV-2024-0090' (No collision!) ✅`
    }
  ];

  // System Design Sequence Diagram (Mermaid)
  const LOAN_FEATURE_MERMAID = `sequenceDiagram
    autonumber
    actor Homeowner as Homeowner / Contractor
    participant Portal as LaunchPAD Portal (Next.js)
    participant Gateway as API Gateway (NestJS)
    participant RulesEngine as Underwriting Engine
    participant DB as PostgreSQL (ACID)
    participant ESign as DocuSign / LaunchPAD E-Sign
    participant Payout as ACH Funding Service

    Homeowner->>Portal: Enters Project & Credit Info ($15,000 HVAC)
    Portal->>Gateway: POST /api/v1/loan-applications (Idempotency-Key)
    Note over Gateway: Authenticates JWT & Validates DTO Schema
    Gateway->>DB: BEGIN TRANSACTION: Insert Pending Application
    DB-->>Gateway: Application ID Created (UUID)
    
    Gateway->>RulesEngine: Evaluate Credit Score & Debt-to-Income (Tiers A-D)
    RulesEngine-->>Gateway: Approved: Tier B (9.99% APR, 60 Months)
    Gateway->>DB: UPDATE Application SET status='APPROVED', tier='B'
    Gateway-->>Portal: 200 OK: Instant Approval & Loan Terms
    
    Portal->>Gateway: Request Loan Agreement Contract
    Gateway->>ESign: Generate Loan Note Document
    ESign-->>Portal: Embed E-Signature Frame (DocuSign)
    Homeowner->>ESign: Signs Loan Agreement (E-Sign)
    
    ESign->>Gateway: Webhook: signature.completed (HMAC SHA-256)
    Note over Gateway: Verifies Raw Buffer HMAC & Idempotency Key
    Gateway->>DB: UPDATE Application SET status='SIGNED', document_verified=TRUE
    
    Gateway->>Payout: Trigger Contractor ACH Disbursement
    Payout-->>DB: Record Payout Reference & Commit Transaction
    Gateway-->>Homeowner: SMS/Email: "Project Funded Successfully"`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', paddingBottom: '3rem' }}>
      
      {/* 1. HERO HEADER: Tomorrow's Screening Command Center */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #111827 50%, #0f172a 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '14px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                TOMORROW'S SCREENING ROUND
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                WAUSAU / ROTHSCHILD, WI • HYDERABAD HUB
              </span>
              <span style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                15–20 MIN CALL
              </span>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.2rem 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={24} color="#38bdf8" />
              Foundation Finance Company — Master Preparation Hub
            </h1>

            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', maxWidth: '850px', lineHeight: '1.5' }}>
              Tailored specifically for tomorrow's phone screening. Synthesizes official Glassdoor/Indeed candidate reviews, recruiter expectations, STAR situational answers, and the flagship end-to-end consumer lending system design.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              background: '#1e293b',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>CONTRACTUAL NOTICE</span>
              <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800 }}>Strictly 30 Days</span>
            </div>
            <div style={{
              background: '#1e293b',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>LOCATION PREFERENCE</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800 }}>Hybrid (Hyderabad)</span>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.35rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {[
            { id: 'callPlaybook', label: '📞 20-Min Call Playbook & Company Dossier', icon: MessageSquare },
            { id: 'starQuestions', label: '⭐ 6 Canonical STAR Situational Answers', icon: Award },
            { id: 'systemDesign', label: '🏗️ Loan Feature System Design & Sequence', icon: Layers },
            { id: 'closingQuestions', label: '❓ Questions to Ask Recruiter', icon: HelpCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: activeSubTab === tab.id ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid transparent',
                background: activeSubTab === tab.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeSubTab === tab.id ? '#38bdf8' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 20-MIN RECRUITER CALL PLAYBOOK & COMPANY DOSSIER                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'callPlaybook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* A. 20-Minute Timeline Strategy */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#38bdf8" />
              The Exact 20-Minute Recruiter Screening Blueprint
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>MINUTES 00:00 – 03:00</span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#f8fafc' }}>Introduction & Logistics Check</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  Recruiter verifies your location (Hyderabad), confirms hybrid comfort, checks notice period (30 days), and confirms current role at Tayseer Technologies.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>MINUTES 03:00 – 07:00</span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#f8fafc' }}>90-Second Professional Pitch</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  "Tell me about yourself." Deliver your 90s pitch covering full-stack ownership across Chrona, LesHub, and your Portfolio Platform. Pause to let recruiter engage.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>MINUTES 07:00 – 14:00</span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#f8fafc' }}>STAR Situational Questions</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  Recruiter asks 2–3 questions: "Tell me about a time you were unsure...", "Handled adversity", "Fast-paced environment". Deliver structured 60-90s answers.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', borderLeft: '4px solid #c084fc' }}>
                <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800 }}>MINUTES 14:00 – 20:00</span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#f8fafc' }}>Company Understanding & Q&A</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  "Why Foundation Finance?" Show you know their POS contractor lending model. Ask your 2–3 thoughtful closing questions. Get timeline for Manager round!
                </p>
              </div>
            </div>
          </div>

          {/* B. Executive Foundation Finance Company Dossier */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="#38bdf8" />
              Foundation Finance Company — Executive Dossier (Know Their Story)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>1. Founding & Roots</span>
                <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.9rem' }}>Founded February 2012 in Wausau, WI</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Started around a kitchen table by four industry veterans in Wausau/Rothschild, Wisconsin. Funded their first project in May 2012 and scaled to hundreds of thousands of home improvement projects nationwide.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>2. Core B2B2C Business Model</span>
                <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.9rem' }}>Point-of-Sale Home Improvement Lending</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  FFC partners directly with contractors (HVAC, Roofing, Windows, Solar, Water Treatment). Contractors use FFC's tools to offer financing to homeowners at the kitchen table, closing deals that customers couldn't pay for upfront in cash.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>3. Key Competitive Edge</span>
                <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.9rem' }}>Full Credit Spectrum (Tiers A through D)</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Unlike traditional conservative banks that only finance 720+ FICO prime borrowers, FFC finances prime, near-prime, and subprime credit down to 550+ FICO. Contractors love FFC because they approve the customers other lenders reject.
                </p>
              </div>

              <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>4. Technology Flagship</span>
                <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.9rem' }}>LaunchPAD Dealer Portal</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Their proprietary digital platform replaced paper and fax applications with instant pre-qualification, electronic signatures (DocuSign integration), automated credit underwriting, and fast ACH merchant funding.
                </p>
              </div>
            </div>
          </div>

          {/* C. Verbatim High-Impact Screening Scripts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
            {/* Script 1: What do you know about Foundation Finance? */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>MANDATORY QUESTION #1</span>
                <button
                  onClick={() => handleCopy(`My understanding is that Foundation Finance is a US consumer-finance company founded in 2012 in Wausau, Wisconsin, specializing in point-of-sale financing for the home-improvement industry.\n\nYou operate on a B2B2C model, partnering with contractors in industries like HVAC, roofing, windows, and solar. Through your LaunchPAD portal, contractors can offer immediate financing options to homeowners at the point of sale. What sets Foundation Finance apart is your full credit spectrum—approving prime, near-prime, and subprime tiers from A down to D credit—which allows contractors to close deals that traditional lenders turn down.\n\nFrom an engineering perspective, this requires dependable application workflows, real-time credit underwriting rules, secure handling of sensitive PII, and reliable e-signature and ACH funding integrations. That's why I'm excited about this full-stack role.`, 'knowFFC')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {copiedKey === 'knowFFC' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  {copiedKey === 'knowFFC' ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                "What do you know about Foundation Finance?"
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                "My understanding is that Foundation Finance is a US consumer-finance company founded in 2012 in Wausau, Wisconsin, specializing in point-of-sale financing for the home-improvement industry.
                <br /><br />
                You operate on a B2B2C model, partnering with contractors in industries like HVAC, roofing, windows, and solar. Through your LaunchPAD portal, contractors can offer immediate financing options to homeowners at the point of sale. What sets Foundation Finance apart is your full credit spectrum—approving prime, near-prime, and subprime tiers from A down to D credit—which allows contractors to close deals that traditional lenders turn down.
                <br /><br />
                From an engineering perspective, this requires dependable application workflows, real-time credit underwriting rules, secure handling of sensitive PII, and reliable e-signature and ACH funding integrations. That's why I'm excited about this full-stack role."
              </p>
            </div>

            {/* Script 2: Why do you want to work at Foundation Finance? */}
            <div style={{
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>MANDATORY QUESTION #2</span>
                <button
                  onClick={() => handleCopy(`I want to join Foundation Finance because the role combines full-stack development with a domain where software reliability and data correctness truly matter.\n\nIn my work on Chrona, LesHub, and my personal platform, I've enjoyed solving full-lifecycle problems—from building accessible, multi-step React/Next.js forms down to relational ACID transactions and secure payment webhook verifications. In consumer lending, software errors aren't just cosmetic glitches; they impact real homeowner credit approvals, contractor cash flows, and audit compliance.\n\nI want to work on a product with tangible economic impact, contribute my full-stack ownership across frontend and backend APIs, and grow under a disciplined engineering team that takes reliability seriously.`, 'whyFFC')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {copiedKey === 'whyFFC' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  {copiedKey === 'whyFFC' ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                "Why do you want to work at Foundation Finance?"
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                "I want to join Foundation Finance because the role combines full-stack development with a domain where software reliability and data correctness truly matter.
                <br /><br />
                In my work on Chrona, LesHub, and my personal platform, I've enjoyed solving full-lifecycle problems—from building accessible, multi-step React/Next.js forms down to relational ACID transactions and secure payment webhook verifications. In consumer lending, software errors aren't just cosmetic glitches; they impact real homeowner credit approvals, contractor cash flows, and audit compliance.
                <br /><br />
                I want to work on a product with tangible economic impact, contribute my full-stack ownership across frontend and backend APIs, and grow under a disciplined engineering team that takes reliability seriously."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 6 CANONICAL STAR SITUATIONAL ANSWERS                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'starQuestions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Question Selector Carousel */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            {STAR_QUESTIONS.map((star, idx) => (
              <button
                key={star.id}
                onClick={() => setActiveStarIdx(idx)}
                style={{
                  background: activeStarIdx === idx ? 'rgba(56, 189, 248, 0.2)' : '#111827',
                  border: activeStarIdx === idx ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.9rem',
                  color: activeStarIdx === idx ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>STAR #{star.id}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({star.tag})</span>
              </button>
            ))}
          </div>

          {/* Active STAR Detail Card */}
          {(() => {
            const current = STAR_QUESTIONS[activeStarIdx];
            return (
              <div style={{
                background: '#111827',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {current.tag}
                      </span>
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                        📍 {current.companyContext}
                      </span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                      STAR #{current.id}: {current.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleCopy(current.spokenScript, `star-${current.id}`)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '6px',
                      padding: '0.45rem 0.85rem',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    {copiedKey === `star-${current.id}` ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copiedKey === `star-${current.id}` ? 'Script Copied!' : 'Copy 60-90s Spoken Script'}
                  </button>
                </div>

                {/* S - T - A - R Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {/* Situation */}
                  <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: '0.9rem' }}>S</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>SITUATION (Context & Constraint)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {current.situation}
                    </p>
                  </div>

                  {/* Task */}
                  <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.9rem' }}>T</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>TASK (Exact Responsibility)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {current.task}
                    </p>
                  </div>

                  {/* Action */}
                  <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #818cf8', gridColumn: 'span 1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#818cf8', fontWeight: 900, fontSize: '0.9rem' }}>A</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>ACTION (Technical Execution & Leadership)</span>
                    </div>
                    <div style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {current.action}
                    </div>
                  </div>

                  {/* Result */}
                  <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #10b981', gridColumn: 'span 1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#10b981', fontWeight: 900, fontSize: '0.9rem' }}>R</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>RESULT (Measurable Outcome & Metrics)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {current.result}
                    </p>
                  </div>
                </div>

                {/* Spoken Verbatim Delivery Script */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.05))',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MessageSquare size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800 }}>
                      Verbatim Spoken 60-90s Delivery (Read Aloud Tomorrow)
                    </span>
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                    {current.spokenScript}
                  </div>
                </div>

                {/* Live System Design Sequence Flow for this STAR Question */}
                {current.mermaidDiagram && (
                  <div style={{
                    background: '#090d16',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={16} color="#c084fc" />
                        <span style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 800 }}>
                          System Design Sequence Flow: {current.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(168, 85, 247, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        Live Sequence Diagram (Browser $\to$ Gateway $\to$ Services $\to$ DB)
                      </span>
                    </div>

                    <div style={{
                      background: '#070a12',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '0.85rem',
                      overflowX: 'auto'
                    }}>
                      <MermaidRenderer
                        key={`star-diag-${current.id}`}
                        chart={current.mermaidDiagram}
                        id={`star-seq-${current.id}`}
                      />
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SYSTEM DESIGN, SEQUENCE DIAGRAM & DATABASE ENTITY SCHEMA          */}
      {/* ========================================================================= */}
      {activeSubTab === 'systemDesign' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Overview Banner */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#38bdf8" />
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Foundation Finance End-to-End Consumer Lending Feature Design
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              If asked: <em>"How would you build a new loan application or financing feature from start to finish?"</em> This full-stack blueprint demonstrates architecture, real-time sequence flow, relational database entity modeling, and financial transaction safety.
            </p>
          </div>

          {/* 1. Live Interactive Sequence Diagram */}
          <div style={{
            background: '#090d16',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitCommit size={16} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Live End-to-End Sequence Diagram (Point-of-Sale Loan Lifecycle)
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Rendered with Mermaid.js
              </span>
            </div>

            <div style={{ overflowX: 'auto', background: '#0b0f19', padding: '1rem', borderRadius: '8px' }}>
              <MermaidRenderer chart={LOAN_FEATURE_MERMAID} id="loan-sequence-chart" />
            </div>
          </div>

          {/* 2. Relational Database Schema & Entities */}
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#10b981" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Relational Database Entity Schema (ACID & Exact Financial Math)
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Never use floating-point types (`FLOAT`/`DOUBLE`) for loans or currency—rounding discrepancies fail financial compliance audits. Always enforce `DECIMAL(12,2)`.
            </p>

            <SyntaxCodeBlock
              language="sql"
              code={`-- 1. CONTRACTORS (Dealers offering POS Financing)
CREATE TABLE contractors (
  id BIGSERIAL PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL,
  ein VARCHAR(20) UNIQUE NOT NULL,
  industry VARCHAR(50) NOT NULL, -- 'HVAC', 'Roofing', 'Solar', 'Windows'
  dealer_tier VARCHAR(20) DEFAULT 'STANDARD',
  bank_routing_enc VARCHAR(255) NOT NULL,
  bank_account_enc VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. HOMEOWNERS (Borrowers)
CREATE TABLE homeowners (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  ssn_encrypted VARCHAR(255) NOT NULL, -- PII encrypted with AES-256-GCM
  credit_score INT, -- Underwriting FICO (550 to 850)
  annual_income DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LOAN APPLICATIONS (Core POS Transaction)
CREATE TABLE loan_applications (
  id BIGSERIAL PRIMARY KEY,
  application_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  contractor_id BIGINT REFERENCES contractors(id) ON DELETE RESTRICT,
  homeowner_id BIGINT REFERENCES homeowners(id) ON DELETE RESTRICT,
  project_type VARCHAR(50) NOT NULL, -- 'HVAC Replacement', 'Roofing'
  loan_amount DECIMAL(12,2) NOT NULL, -- Exact financial decimal
  down_payment DECIMAL(12,2) DEFAULT 0.00,
  term_months INT NOT NULL, -- e.g., 60, 84, 120
  apr_rate DECIMAL(5,2) NOT NULL, -- e.g., 9.99%
  monthly_payment DECIMAL(12,2) NOT NULL,
  credit_tier CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D' (FFC Wide Credit Spectrum)
  status VARCHAR(30) DEFAULT 'PENDING_APPROVAL', -- 'APPROVED', 'DOCS_SIGNED', 'FUNDED', 'REJECTED'
  idempotency_key VARCHAR(100) UNIQUE NOT NULL, -- Prevents duplicate submissions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_loan_apps_contractor ON loan_applications(contractor_id);
CREATE INDEX idx_loan_apps_status ON loan_applications(status);

-- 4. LOAN DOCUMENTS & E-SIGNATURES (DocuSign LaunchPAD Integration)
CREATE TABLE loan_documents (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES loan_applications(id) ON DELETE CASCADE,
  docusign_envelope_id VARCHAR(100) UNIQUE NOT NULL,
  document_url VARCHAR(255) NOT NULL,
  status VARCHAR(30) DEFAULT 'SENT', -- 'SENT', 'VIEWED', 'COMPLETED'
  signed_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45) NOT NULL
);

-- 5. AUDIT LOGS (Immutable Compliance Ledger)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_name VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  actor_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'STATUS_CHANGE', 'UNDERWRITING_DECISION', 'ACH_DISBURSED'
  old_state JSONB,
  new_state JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
            />
          </div>

          {/* 3. Production Architecture Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 800 }}>IDEMPOTENCY & TRANSACTION LOCKING</span>
              <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.88rem' }}>Guarding Against Double Payouts</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                Every loan submission uses a client-generated UUID as an `idempotency_key` cached in Redis with an atomic `SET NX EX 300`. This prevents duplicate loan creation if a contractor double-clicks at the kitchen table.
              </p>
            </div>

            <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 800 }}>WEBHOOK SECURITY</span>
              <h4 style={{ margin: '0.3rem 0', color: '#f8fafc', fontSize: '0.88rem' }}>Cryptographic E-Sign Callbacks</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                When DocuSign sends a signature confirmation, the webhook handler validates the HMAC-SHA256 signature using the raw request buffer before parsing JSON, preventing spoofed approval attacks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SMART CLOSING QUESTIONS TO ASK THE RECRUITER                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'closingQuestions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#38bdf8" />
              The 3 Smart Questions to Ask Foundation Finance Recruiter
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              At the 15-minute mark, the recruiter will ask: <em>"Do you have any questions for me?"</em> Asking intelligent, domain-aware questions proves leadership, preparation, and sincere engagement.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                num: "1",
                q: "From an engineering and product perspective, what are the primary scaling priorities for Foundation Finance over the next 6 to 12 months?",
                why: "Shows you think long-term about architecture, business growth, and product priorities.",
                recruiterResponseNote: "Recruiters love this because they can highlight portal upgrades, mobile experience, or automated underwriting improvements."
              },
              {
                num: "2",
                q: "How does the engineering team balance building new contractor-facing features with maintaining system reliability, automated testing, and technical debt?",
                why: "Positions you as a disciplined senior full-stack developer who cares about maintainable code rather than just rushing out prototypes.",
                recruiterResponseNote: "Demonstrates engineering maturity and respect for quality assurance."
              },
              {
                num: "3",
                q: "What does success look like for a Full Stack Developer joining this team in their first 3 to 6 months?",
                why: "Shows you are results-driven, focused on ramping up fast, and eager to deliver measurable business impact.",
                recruiterResponseNote: "Gives you immediate insight into onboarding expectations for the manager round."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>QUESTION #{item.num}</span>
                  <button
                    onClick={() => handleCopy(item.q, `q-${idx}`)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.2rem 0.5rem',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {copiedKey === `q-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedKey === `q-${idx}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  "{item.q}"
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span><strong>Why it works:</strong> {item.why}</span>
                  <span style={{ color: '#64748b' }}><strong>Recruiter context:</strong> {item.recruiterResponseNote}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
