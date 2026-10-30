const fs = require('fs');
const path = require('path');
const metadata = require('./build_screening_metadata.cjs');

// Helpers
function createQ(id, sectionId, sectionTitle, question, difficulty, directPitch, detailedExplanation, codeOrPattern, keyTakeaway) {
  return {
    id,
    sectionId,
    sectionTitle,
    question,
    difficulty,
    directPitch,
    detailedExplanation,
    codeOrPattern: codeOrPattern || null,
    keyTakeaway
  };
}

// 10 Sections Definitions
const SECTIONS = [
  { id: 1, title: "Section 1 — End-to-End Feature Development", range: "Q1–Q10", count: 10, color: "#38bdf8" },
  { id: 2, title: "Section 2 — Frontend, React & UI Decisions", range: "Q11–Q20", count: 10, color: "#818cf8" },
  { id: 3, title: "Section 3 — React & Next.js Technical Decisions", range: "Q21–Q30", count: 10, color: "#60a5fa" },
  { id: 4, title: "Section 4 — Backend & REST APIs", range: "Q31–Q40", count: 10, color: "#34d399" },
  { id: 5, title: "Section 5 — Database, ORM & Performance", range: "Q41–Q50", count: 10, color: "#fbbf24" },
  { id: 6, title: "Section 6 — Authentication, Security & Payments", range: "Q51–Q60", count: 10, color: "#f87171" },
  { id: 7, title: "Section 7 — Project Troubleshooting Stories", range: "Q61–Q70", count: 10, color: "#ec4899" },
  { id: 8, title: "Section 8 — Testing & Quality Assurance", range: "Q71–Q80", count: 10, color: "#10b981" },
  { id: 9, title: "Section 9 — Git, CI/CD, Deployment & AWS", range: "Q81–Q90", count: 10, color: "#f97316" },
  { id: 10, title: "Section 10 — Architecture, Scenarios & Leadership", range: "Q91–Q100", count: 10, color: "#a855f7" }
];

const questions = [
  // SECTION 1: End-to-End Feature Development (Q1-Q10)
  createQ(
    1, 1, SECTIONS[0].title,
    "Tell me about a feature you built end to end. What decisions did you make?",
    "Senior",
    "In Chrona, I re-architected our bulk timesheet processing engine from frontend request down through NestJS to MySQL, reducing processing latency from 45-50 seconds to 1-2 seconds.",
    "The user problem was that submitting 20 to 30 day entries across a 4-week period caused request timeouts and UI freezes. Tracing the execution, the legacy service looped over every entry, making 3 sequential database calls per item: calling `sp_create_hour_entry`, querying `SELECT @p_insert_id`, and then `sp_get_hour_entry_by_id` (over 60 DB round-trips total).\n\nI re-architected the endpoint to accept a bundled JSON array. In MySQL, I used `JSON_TABLE` to unpack all entries into relational rows inside a single set-based `INSERT ... ON DUPLICATE KEY UPDATE` query. In NestJS, I managed the transaction using TypeORM's `QueryRunner`: acquiring a dedicated connection, `startTransaction()`, executing the bulk insert, recalculating period totals, and committing atomically. If any entry was invalid, the entire operation rolled back cleanly.",
    "// NestJS + TypeORM QueryRunner Transaction Pattern\nconst queryRunner = this.dataSource.createQueryRunner();\nawait queryRunner.connect();\nawait queryRunner.startTransaction();\ntry {\n  await queryRunner.query(`\n    INSERT INTO hour_entries (period_id, assignment_id, work_date, hours)\n    SELECT period_id, assignment_id, work_date, hours\n    FROM JSON_TABLE(?, '$[*]' COLUMNS (\n      period_id INT PATH '$.periodId',\n      assignment_id INT PATH '$.assignmentId',\n      work_date DATE PATH '$.workDate',\n      hours DECIMAL(5,2) PATH '$.hours'\n    )) as jt\n  `, [JSON.stringify(entries)]);\n  await queryRunner.commitTransaction();\n} catch (err) {\n  await queryRunner.rollbackTransaction();\n  throw err;\n} finally {\n  await queryRunner.release();\n}",
    "Batch database operations and explicit transaction boundaries eliminate sequential round-trip network latency while guaranteeing ACID atomicity."
  ),
  createQ(
    2, 1, SECTIONS[0].title,
    "How do you take a feature from a requirement to production?",
    "Senior",
    "I follow a disciplined 6-stage lifecycle: Requirements Clarification, API/Data Modeling, Decoupled Implementation, Comprehensive Testing, CI/CD Gate Validation, and Post-Deployment Monitoring.",
    "I start by clarifying acceptance criteria and edge cases with stakeholders. Then I design the database schema/migration and define the API contract (endpoints, params, error codes) so frontend and backend work can proceed in parallel.\n\nDuring implementation, I build modular components and isolated services. I write unit tests for critical business logic and integration tests for database paths. I submit a focused Pull Request with testing evidence, pass CI gates (lint, type-check, tests), deploy via staging for stakeholder sign-off, and monitor error rates and latency in production using logs and APM metrics.",
    "// 6-Stage Feature Delivery Pipeline\n// 1. Clarify: Edge cases, scale constraints, user stories\n// 2. Contract: OpenAPI / DTO specifications, DB migrations\n// 3. Build: Decoupled UI & service implementations\n// 4. Test: Vitest unit tests, RTL component tests, integration tests\n// 5. Review: PR review, CI pipeline gates, staging deployment\n// 6. Monitor: Sentry error logs, CloudWatch latency metrics",
    "Treating API contracts and database schemas as first-class specifications avoids integration surprises late in the sprint."
  ),
  createQ(
    3, 1, SECTIONS[0].title,
    "How do you decide whether a feature needs frontend changes, backend changes or both?",
    "Mid",
    "I determine where the authoritative responsibility belongs based on security, business rules, and presentation needs.",
    "Frontend owns presentation, user interactions, form validation feedback, and optimistic UI updates. Backend owns authoritative business rules, authentication, authorization, financial calculations, and secure database persistence.\n\nFor example, adding a search feature requires a frontend debounced input and an optimized backend parameterized query. Filtering records only in the browser is a severe security vulnerability; all tenant and authorization constraints must be enforced on the backend.",
    "// Responsibility Matrix:\n// Frontend: UI State, Form Ergonomics, Immediate Validation Feedback\n// Backend: Data Authorization, Tenant Isolation, Financial Calculations\n// Database: Referential Integrity, Clustered Indexing, ACID Constraints",
    "Never rely on client-side filtering for authorization; backend must be the trusted security boundary."
  ),
  createQ(
    4, 1, SECTIONS[0].title,
    "How do you decide the API contract before development?",
    "Senior",
    "I agree on the HTTP method, URL schema, request payload structure, response shapes, query pagination, and standardized error formats before writing code.",
    "For example, for a paginated search API (`GET /api/v1/timesheets?search=term&page=1&limit=20`), we define the exact DTOs using TypeScript interfaces and Zod / class-validator. We establish consistent error responses adhering to RFC 7807 (`{ statusCode, message, error, timestamp }`). This allows frontend engineers to mock API clients with MSW or local stubs while backend engineers write migrations and controllers simultaneously.",
    "// Standardized Contract DTO:\ninterface PaginatedResponse<T> {\n  items: T[];\n  meta: {\n    page: number;\n    limit: number;\n    totalItems: number;\n    totalPages: number;\n    hasNextPage: boolean;\n  };\n}",
    "Contract-first development eliminates blocking dependencies between frontend and backend engineers."
  ),
  createQ(
    5, 1, SECTIONS[0].title,
    "What do you do when requirements are ambiguous?",
    "Mid",
    "I identify the specific technical and user ambiguities, document concrete scenarios, and ask targeted questions to the product manager before writing code.",
    "Instead of asking vague questions like 'how should search work?', I ask specific technical questions: 'Should search match partial strings or exact prefixes? Which columns are indexed for search? How do we handle special characters? What is the expected behavior when 0 results match?' I write down the agreed answers in the ticket acceptance criteria.",
    null,
    "Frame ambiguities as specific multiple-choice scenarios to help product managers make fast, clear decisions."
  ),
  createQ(
    6, 1, SECTIONS[0].title,
    "How do you break a large feature into smaller tasks?",
    "Senior",
    "I decompose the feature vertically into independently deliverable, testable slices rather than waiting for a massive single release.",
    "I identify high-risk architectural dependencies early (such as database migrations or third-party payment integrations). A typical breakdown: 1) Database schema migration and repository, 2) Core service business logic and unit tests, 3) REST controller endpoints and validation, 4) Frontend API service client and hook, 5) UI components and loading/error states, 6) End-to-end integration and staging validation.",
    null,
    "Deliver vertical slices of functionality that can be merged and tested incrementally behind feature flags."
  ),
  createQ(
    7, 1, SECTIONS[0].title,
    "How do you handle a feature that depends on another developer's API?",
    "Mid",
    "I establish the API contract upfront, mock the endpoint locally using MSW or temporary stubs, and integrate early once the endpoint is deployed to development/staging.",
    "This avoids blocking frontend progress. I verify the contract against real responses as early as possible to catch subtle discrepancies in casing, date formats, null handling, or error response shapes.",
    null,
    "Mock early against an agreed contract to keep feature development parallel and unblocked."
  ),
  createQ(
    8, 1, SECTIONS[0].title,
    "How do you handle a production bug?",
    "Senior",
    "I follow an 8-step incident response playbook: Assess Impact, Reproduce Locally, Inspect Telemetry, Formulate Root Cause, Implement Minimal Safe Fix, Add Regression Test, Deploy via CI/CD, and Conduct Post-Mortem.",
    "In a production incident, priority one is mitigating user impact (e.g. rolling back or applying a feature flag). Then I inspect application logs (CloudWatch/Sentry), reproduce the exact input in a test environment, isolate the defect, write an automated test that fails before the fix and passes after, deploy through standard release pipelines, and verify metrics recover.",
    null,
    "Fix the immediate defect with a minimal safe patch and protect against recurrence with a targeted regression test."
  ),
  createQ(
    9, 1, SECTIONS[0].title,
    "How do you prioritize technical debt against new features?",
    "Senior",
    "I categorize technical debt by business risk: Security Vulnerabilities & Data Integrity risks take immediate priority, followed by Performance Bottlenecks, with Refactoring handled incrementally during feature work.",
    "In Chrona, when our timesheet creation was taking 45 seconds, this wasn't just aesthetic code debt—it was threatening user retention and causing timeouts. I presented empirical benchmarks to leadership showing that investing 2 days into database batching would drop latency by 95%, which justified immediate prioritization.",
    null,
    "Quantify technical debt in terms of business impact: user drop-off, server cost, and operational downtime."
  ),
  createQ(
    10, 1, SECTIONS[0].title,
    "How do you measure whether a feature is successful?",
    "Senior",
    "I evaluate success using both technical engineering metrics (p95 response time, error rate, memory usage) and user outcome metrics (task completion rate, support ticket volume).",
    "When I optimized bulk timesheet processing in Chrona, success was measured empirically: 1) Server-side p95 response time dropped from 48s to 1.4s, 2) DB connection pool saturation decreased by 80%, and 3) User-reported timeout tickets dropped to zero.",
    null,
    "Always establish baseline measurements before an optimization to empirically prove technical success."
  ),

  // SECTION 2: Frontend, React & UI Decisions (Q11-Q20)
  createQ(
    11, 2, SECTIONS[1].title,
    "How do you convert a Figma design into a working React UI?",
    "Mid",
    "I break the design down hierarchically into layout containers, design tokens, reusable atomic elements, and interactive state boundaries.",
    "I inspect spacing, typography scales, responsive grid breakpoints, and interactive states (hover, focus, disabled, active). I map these to our design system tokens. Then I build the component structure with semantic HTML elements (`<main>`, `<header>`, `<nav>`, `<button>`), integrate data hooks with loading skeletons, and verify full keyboard navigability and color contrast compliance.",
    null,
    "Analyze the component hierarchy and state boundaries before writing CSS or JSX."
  ),
  createQ(
    12, 2, SECTIONS[1].title,
    "How do you decide how to split React components?",
    "Mid",
    "I split components based on Single Responsibility, Reusability, and State Isolation to prevent unnecessary re-rendering.",
    "If a component manages multiple unrelated concerns—such as a data table that also houses a complex edit modal and filter drawer—I extract the modal and drawer into isolated components. This ensures that opening a modal only re-renders the modal leaf, leaving the heavy 1,000-row table untouched.",
    null,
    "Extract components to isolate state changes and prevent render cascades down heavy subtrees."
  ),
  createQ(
    13, 2, SECTIONS[1].title,
    "Why did you use Zustand instead of Redux in Chrona?",
    "Senior",
    "In Chrona, Zustand provided the exact lightweight client-side state we needed without Redux's massive boilerplate and provider wrapping overhead.",
    "Chrona's global client state consists of UI flags: sidebar toggling, active tenant filters, and modal visibility. Zustand provides fine-grained atomic selectors powered by `useSyncExternalStore`. Components only re-render when their specific selected property changes. For server-side database caching, we paired Zustand with TanStack Query. Redux Toolkit remains valuable for massive apps requiring complex middleware or time-travel debugging, but Zustand was optimal for our architecture.",
    "// Zustand Atomic Selector Pattern:\n// Only re-renders when isSidebarOpen changes!\nconst isSidebarOpen = useUIStore(state => state.isSidebarOpen);",
    "Use Zustand for client UI state and TanStack Query for server cache; avoid forcing server data into global client stores."
  ),
  createQ(
    14, 2, SECTIONS[1].title,
    "What is the difference between Zustand, Redux Toolkit and TanStack Query?",
    "Senior",
    "They address two fundamentally different state categories: Client State (Zustand/RTK) versus Server Cache (TanStack Query).",
    "Zustand is a minimalist client store using atomic selectors with zero boilerplate. Redux Toolkit is an opinionated client store with slices, reducers, middleware, and DevTools. TanStack Query is not a global state manager—it is an asynchronous server cache manager handling background refetching, caching, request deduplication, and stale-while-revalidate lifecycles.",
    null,
    "Server cache belongs in TanStack Query; client-only UI flags belong in Zustand or Redux."
  ),
  createQ(
    15, 2, SECTIONS[1].title,
    "How do you decide whether state belongs in React state, Zustand or TanStack Query?",
    "Senior",
    "I follow a 3-tier colocation rule: 1. Local useState for single-component concerns, 2. Zustand for app-wide UI flags, 3. TanStack Query for backend database state.",
    "If an accordion is open or closed, it stays in local `useState`. If the user's active theme or sidebar collapse state affects multiple route layouts, it belongs in Zustand. If data originates from an API endpoint (e.g. timesheets, user profiles), it belongs in TanStack Query.",
    null,
    "Colocate state as close to leaf components as possible to eliminate premature global state bloat."
  ),
  createQ(
    16, 2, SECTIONS[1].title,
    "How do you prevent unnecessary re-renders in React?",
    "Senior",
    "I measure with React DevTools Profiler first, colocate state close to leaf components, leverage composition with `children`, and apply `React.memo` with `useCallback`/`useMemo` where measurements justify it.",
    "Blindly wrapping every function in `useCallback` is an anti-pattern. If a child component is not wrapped in `React.memo`, passing a memoized callback provides zero render savings. By moving state down into the specific component that consumes it, parent components and sibling subtrees never re-render in the first place.",
    null,
    "State colocation and children composition outperform premature manual memoization."
  ),
  createQ(
    17, 2, SECTIONS[1].title,
    "How do you implement loading, empty, error and success states?",
    "Mid",
    "I model the UI state explicitly as a discriminated union or finite state machine, rendering dedicated views for each lifecycle phase.",
    "I avoid independent boolean flags (`isLoading && isError`) that allow impossible states. When `status === 'loading'`, I show matching skeletons to prevent layout shift (CLS). When `data.length === 0`, I show a helpful empty state with a call-to-action button. When `status === 'error'`, I display an accessible error alert with a 'Retry' action.",
    null,
    "Represent async UI states as mutually exclusive phases to prevent layout flashes and invalid visual states."
  ),
  createQ(
    18, 2, SECTIONS[1].title,
    "How do you prevent a slow search response from overwriting newer results?",
    "Senior",
    "I handle request race conditions using `AbortController` cancellation, debounced user input, or query key hashing with TanStack Query.",
    "If a user types 'apple' and then quickly types 'banana', both network requests fire. If 'apple' returns after 'banana' due to network latency, naive code overwrites the newer search. Using `AbortController`, the cleanup function of `useEffect` aborts the in-flight 'apple' request the moment the dependency updates to 'banana'.",
    "// Race Condition Cancellation with AbortController:\nuseEffect(() => {\n  const controller = new AbortController();\n  fetch(`/api/search?q=${query}`, { signal: controller.signal })\n    .then(res => res.json())\n    .then(data => setResults(data))\n    .catch(err => { if (err.name !== 'AbortError') setError(err); });\n  return () => controller.abort(); // Cancel previous in-flight request!\n}, [query]);",
    "Always cancel in-flight HTTP requests using AbortController when user inputs change."
  ),
  createQ(
    19, 2, SECTIONS[1].title,
    "What is optimistic UI, and where did you use it?",
    "Senior",
    "Optimistic UI updates the screen immediately assuming network success, providing instantaneous 60fps feedback, and rolls back cleanly if the backend request fails.",
    "In LesHub's driving lesson scheduling calendar, when an instructor drags a lesson to a new time slot, waiting 800ms for API confirmation felt sluggish. We updated the calendar position immediately, captured the previous slot coordinates in a snapshot, and fired the PATCH request. If the backend responded with a conflict (`409 Conflict`), the UI restored the previous position and showed an informative toast.",
    null,
    "Optimistic updates require snapshotting previous state for deterministic rollback upon server rejection."
  ),
  createQ(
    20, 2, SECTIONS[1].title,
    "How do you make a UI accessible (WCAG 2.1 AA)?",
    "Senior",
    "I use semantic HTML5 elements, ensure 100% keyboard navigability, provide visible focus indicators, and manage ARIA roles and focus traps for interactive overlays.",
    "I use `<button>` rather than `<div onClick>`, associate form inputs with `<label htmlFor>`, maintain high color contrast ratios (>4.5:1 for body text), manage focus restoration when modals dismiss, and test with keyboard Tab/Shift+Tab sequences and screen readers (NVDA/VoiceOver).",
    null,
    "Accessibility starts with native semantic HTML; ARIA is only used when native elements are insufficient."
  ),

  // SECTION 3: React & Next.js Technical Decisions (Q21-Q30)
  createQ(
    21, 3, SECTIONS[2].title,
    "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
    "Senior",
    "CSR downloads an empty HTML shell and renders the DOM in the browser via JavaScript; SSR renders full HTML on the server per request before transmitting to the client.",
    "CSR offers snappy subsequent transitions in internal dashboards, but suffers from slow First Contentful Paint (FCP) and poor SEO. SSR delivers fast FCP and optimal SEO for public pages, but incurs server execution costs and requires hydration in the browser.",
    null,
    "Choose SSR for public, SEO-critical or slow-device pages; choose CSR for high-interactivity internal dashboards."
  ),
  createQ(
    22, 3, SECTIONS[2].title,
    "How do you decide between Server Components and Client Components in Next.js?",
    "Senior",
    "In Next.js App Router, components are React Server Components (RSC) by default; I only add the `'use client'` directive at the leaves of the tree when browser APIs or interactivity are strictly required.",
    "Server Components run exclusively on the server, have direct zero-latency access to databases, keep heavy dependencies out of the client JS bundle, and improve security. Client Components are only needed when using hooks (`useState`, `useEffect`), browser event listeners (`onClick`), or browser APIs (`window`, `localStorage`).",
    null,
    "Keep client component boundaries at the leaves to minimize client JavaScript bundle size."
  ),
  createQ(
    23, 3, SECTIONS[2].title,
    "What is hydration in Next.js, and how do you fix hydration errors?",
    "Senior",
    "Hydration is the process where React attaches event listeners and state management to server-rendered HTML in the client browser.",
    "Hydration errors occur when the server-rendered HTML differs from the initial client render—frequently caused by non-deterministic code like `new Date()`, `Math.random()`, or accessing `window`/`localStorage` during initial render. The fix is to defer client-only rendering until after mounting via `useEffect` or making the render deterministic.",
    null,
    "Ensure the initial client render tree matches the server HTML byte-for-byte to prevent hydration mismatches."
  ),
  createQ(
    24, 3, SECTIONS[2].title,
    "How do you manage complex forms in React?",
    "Mid",
    "For complex enterprise forms, I use React Hook Form paired with Zod schemas for type-safe validation, minimal re-renders, and accessible error mapping.",
    "React Hook Form leverages uncontrolled inputs with ref subscriptions, avoiding full-form re-renders on every keystroke. Zod schemas enforce compile-time TypeScript contracts and runtime input validation, displaying field-level errors with `aria-invalid` and `role='alert'` attributes.",
    null,
    "Use uncontrolled forms with schema validation libraries to prevent typing lag in large forms."
  ),
  createQ(
    25, 3, SECTIONS[2].title,
    "How do you manage API calls in Next.js?",
    "Senior",
    "I separate data access into Server Data Fetching in Server Components (direct DB queries or cached `fetch`) and Client Data Fetching in Client Components using TanStack Query or Axios.",
    "In Chrona, client-side requests route through an Axios proxy client (`src/services/proxy.ts`) that automatically attaches authentication headers. Server actions and Server Components handle initial page rendering, keeping secrets off the client.",
    null,
    "Fetch on the server for initial layout data; fetch on the client with query caching for interactive mutations."
  ),
  createQ(
    26, 3, SECTIONS[2].title,
    "How do you handle protected routes in Next.js?",
    "Senior",
    "I enforce route protection at the Edge Middleware level (`src/proxy.ts`) for instant redirects, while independently validating authorization tokens on the backend API.",
    "In Chrona, our Next.js edge middleware checks incoming cookie sessions. If a user is unauthenticated, it redirects them to `/sign-in` before rendering page bundles. Furthermore, our NestJS backend guards validate the JWT on every request, ensuring that bypassing client routing still results in strict 401/403 rejections.",
    null,
    "Client route guards provide clean UX; backend API guards provide true security."
  ),
  createQ(
    27, 3, SECTIONS[2].title,
    "What are React hooks, and what rules do you follow?",
    "Senior",
    "Hooks are functions that let you tap into React state and lifecycle features from functional components, governed by the Rules of Hooks.",
    "The two non-negotiable rules: 1. Only call hooks at the top level (never inside loops, conditions, or nested functions), and 2. Only call hooks from React function components or custom hooks. These rules guarantee that React can rely on consistent linked-list call ordering across renders to match state slots to their hooks.",
    null,
    "Hooks rely on stable execution order across renders to preserve state identity."
  ),
  createQ(
    28, 3, SECTIONS[2].title,
    "How do you investigate a React infinite render loop or memory issue?",
    "Senior",
    "I check for state updates triggered directly inside component render bodies or `useEffect` hooks with unstable object/array dependencies.",
    "In LesHub, we investigated a memory issue where an un-memoized object passed to an effect triggered a state update, which created a new object reference on the next render, triggering the effect again in an infinite loop. Using React DevTools Profiler and Chrome Heap Snapshots, we isolated the unstable dependency and stabilized it.",
    null,
    "Never perform state updates in component render bodies; stabilize effect object dependencies."
  ),
  createQ(
    29, 3, SECTIONS[2].title,
    "How do you handle internationalization (i18n)?",
    "Mid",
    "In LesHub, we handled bilingual support (English and Dutch) using `react-i18next` and custom synchronization scripts (`scripts/sync-nl.js`).",
    "We extract translation keys into JSON resource bundles, avoiding hard-coded UI strings. Our build pipeline runs `npx i18next-parser` to ensure all keys used in code are synchronized with Dutch translations, supporting dynamic locale switching without page reloads.",
    null,
    "Use translation keys and automated parser scripts to maintain parity across language bundles."
  ),
  createQ(
    30, 3, SECTIONS[2].title,
    "How do you optimize a slow frontend page?",
    "Senior",
    "I profile the page to identify the bottleneck (Network vs JS Execution vs DOM Layout), then apply targeted remedies: route code-splitting with `React.lazy`, image optimization, list virtualization, and state colocation.",
    "I measure Web Vitals (LCP, INP, CLS). For large lists exceeding 100 rows, I use `@tanstack/react-virtual` to mount only visible DOM rows. For heavy modals and charts, I code-split using `React.lazy` and `<Suspense>`, keeping the initial JavaScript bundle minimal.",
    null,
    "Measure Core Web Vitals before optimizing; use code-splitting and virtualization for heavy views."
  ),

  // SECTION 4: Backend & REST APIs (Q31-Q40)
  createQ(
    31, 4, SECTIONS[3].title,
    "How do you implement a search API end to end?",
    "Senior",
    "I design the API contract, validate query parameters in the controller, build a parameterized query with database indexes, enforce tenant isolation, and handle pagination.",
    "In Chrona, the search endpoint validates `search`, `page`, and `limit` using class-validator. The service builds a parameterized query using TypeORM query builder (`WHERE (user.name LIKE :search OR user.email LIKE :search) AND user.tenant_id = :tenantId`). We apply composite B-tree indexes, return structured pagination metadata, and handle empty and error results cleanly on the frontend.",
    null,
    "Always parameterize SQL search queries and enforce tenant boundaries on the database layer."
  ),
  createQ(
    32, 4, SECTIONS[3].title,
    "Why do you separate controllers, services and repositories?",
    "Senior",
    "This follows the Single Responsibility Principle and Clean Architecture: Controllers handle HTTP concerns, Services handle business rules, and Repositories handle database persistence.",
    "A Controller should only validate HTTP request bodies, headers, and status codes. The Service encapsulates business logic (e.g. timesheet calculation rules), making it reusable across HTTP, CLI scripts, and background jobs. Repositories abstract SQL/ORM queries, allowing easy unit testing with mock repositories without requiring a real database.",
    null,
    "Layered architecture enables high testability, separation of concerns, and clean maintenance."
  ),
  createQ(
    33, 4, SECTIONS[3].title,
    "How does dependency injection work in NestJS?",
    "Senior",
    "NestJS uses an Inversion of Control (IoC) container to manage class dependencies automatically through TypeScript metadata and constructor injection.",
    "Classes decorated with `@Injectable()` are registered as Providers inside a `@Module()`. When a Controller declares `constructor(private readonly timesheetService: TimesheetService)`, the NestJS runtime resolves and injects the singleton instance. This makes unit testing trivial: in tests, we can override providers with mock implementations using `Test.createTestingModule()`.",
    null,
    "Dependency injection decouples class creation from usage, enabling painless unit test mocking."
  ),
  createQ(
    34, 4, SECTIONS[3].title,
    "What is the difference between middleware, guards, and interceptors in NestJS?",
    "Senior",
    "They execute at different stages in the NestJS request lifecycle with distinct responsibilities.",
    "1. **Middleware**: Runs first before route handlers; handles low-level request manipulation (CORS, body parsing, raw buffer capture).\n2. **Guards**: Run next; determine whether the request is authorized (`canActivate()`), e.g., validating JWT claims or roles.\n3. **Interceptors**: Wrap handler execution; transform responses, handle caching, log execution duration, or manage transaction lifecycles.",
    null,
    "Use Guards for authorization, Interceptors for response transformation/logging, Middleware for raw HTTP tasks."
  ),
  createQ(
    35, 4, SECTIONS[3].title,
    "How do you handle API errors consistently?",
    "Senior",
    "I use a Global Exception Filter in NestJS (or custom error middleware in Express) that maps all domain errors into a standardized RFC 7807 problem details JSON format.",
    "I distinguish between expected client errors (`NotFoundException`, `BadRequestException`) and unhandled server errors (500). Internal stack traces and database credentials are logged securely to monitoring (Sentry/CloudWatch) with correlation IDs, but are stripped from the response sent to the client to prevent information disclosure.",
    null,
    "Centralize error handling with global filters to ensure uniform error structures and protect internal stack traces."
  ),
  createQ(
    36, 4, SECTIONS[3].title,
    "How do you design a paginated endpoint?",
    "Senior",
    "I choose between Offset Pagination (`skip`/`take`) for small static datasets and Keyset/Cursor Pagination for high-scale, rapidly updating datasets.",
    "Offset pagination (`OFFSET 100000`) becomes painfully slow because the database must scan and discard 100,000 rows. For large transaction tables, I use Cursor Pagination: `WHERE id < :lastSeenId ORDER BY id DESC LIMIT 20`. This leverages the B-tree primary key index for constant $O(1)$ lookup time regardless of page depth.",
    null,
    "Use Keyset (cursor) pagination for large datasets to avoid expensive database offset scans."
  ),
  createQ(
    37, 4, SECTIONS[3].title,
    "How do you implement file uploads securely?",
    "Senior",
    "I validate file size, verify magic byte signatures (not just client-supplied MIME types), store files in AWS S3 with private access, and serve via signed URLs.",
    "In Chrona and our Portfolio platform, files are never stored directly on the application server filesystem. We stream the multipart upload to an Amazon S3 bucket, enforce strict bucket policies, generate random UUID file keys to prevent path traversal attacks, and generate short-lived pre-signed URLs (e.g. 15-minute TTL) for authorized downloads.",
    null,
    "Upload files directly to object storage (S3) using UUID keys and pre-signed access URLs."
  ),
  createQ(
    38, 4, SECTIONS[3].title,
    "What is idempotency, and why does it matter in APIs?",
    "Senior",
    "An operation is idempotent if executing it multiple times produces the exact same side-effects and outcome as executing it once.",
    "This is critical for payment processing and order submissions. If a user clicks 'Pay Now' and experienced a network blip, their client retries the request. By attaching an `Idempotency-Key` header, the backend stores the initial result in Redis/DB; subsequent requests with the same key return the cached result without charging the card a second time.",
    null,
    "Idempotency keys prevent duplicate charges and double resource creation during network retries."
  ),
  createQ(
    39, 4, SECTIONS[3].title,
    "How do you implement background or long-running work?",
    "Senior",
    "I offload long-running operations (>500ms) to an asynchronous background worker queue using Redis and BullMQ / RabbitMQ.",
    "For tasks like bulk PDF invoice generation or batch email notifications, the HTTP controller immediately returns a `202 Accepted` response with a job ID. A decoupled worker process consumes the job from the queue with built-in retries, exponential backoff, and dead-letter queue (DLQ) error handling.",
    null,
    "Keep HTTP request threads fast (<200ms) by offloading heavy work to queue workers."
  ),
  createQ(
    40, 4, SECTIONS[3].title,
    "How do you protect a backend API against common attacks?",
    "Senior",
    "I implement defense-in-depth: Helmet HTTP security headers, CORS origin whitelisting, rate limiting with Redis, parameterized queries to stop SQL injection, and input sanitization.",
    "We use `@nestjs/throttler` backed by Redis to mitigate brute-force and DDoS attempts. All database access uses TypeORM/Prisma parameterized queries. Sensitive payload comparisons use `crypto.timingSafeEqual` to prevent timing attacks.",
    null,
    "Layer security across rate limiting, CORS whitelisting, parameterized queries, and security headers."
  ),

  // SECTION 5: Database, ORM & Performance (Q41-Q50)
  createQ(
    41, 5, SECTIONS[4].title,
    "How do you investigate a slow database query?",
    "Senior",
    "I capture the raw SQL, run `EXPLAIN ANALYZE` in MySQL/PostgreSQL to inspect the query execution plan, and identify table scans, missing indexes, or sorting bottlenecks.",
    "I check whether the query performs a full table scan (`type: ALL`), verify that the index selectivity is high, inspect join cardinality, and check for sargability issues (e.g. using `WHERE YEAR(created_at) = 2026` which prevents index usage). Then I add appropriate compound indexes or rewrite the query.",
    null,
    "Use EXPLAIN ANALYZE to evaluate index utilization and eliminate full table scans."
  ),
  createQ(
    42, 5, SECTIONS[4].title,
    "What is an index, and what are its trade-offs?",
    "Senior",
    "A database index is a specialized B-tree data structure that allows fast $O(\\log N)$ record lookups without scanning the entire table.",
    "The trade-off is write overhead: every `INSERT`, `UPDATE`, and `DELETE` must rebalance the B-tree nodes and update index pages on disk. Indexes also consume substantial RAM and storage. Therefore, indexes should be created deliberately based on actual `WHERE`, `JOIN`, and `ORDER BY` query patterns, avoiding over-indexing.",
    null,
    "Indexes speed up read queries at the cost of additional disk space and slower write operations."
  ),
  createQ(
    43, 5, SECTIONS[4].title,
    "What is the N+1 query problem?",
    "Senior",
    "It occurs when an application executes 1 initial query to fetch N parent records, and then issues an additional database query for each record to fetch related child data—resulting in N+1 total queries.",
    "In Chrona, fetching 50 timesheets and querying user details for each timesheet in a loop created 51 queries. We resolved this using TypeORM's `leftJoinAndSelect` to join the tables in a single query, reducing database traffic by 98%.",
    null,
    "Use eager relational joins or DataLoader batching to eliminate N+1 round trips."
  ),
  createQ(
    44, 5, SECTIONS[4].title,
    "Explain the bulk timesheet optimization you worked on in Chrona.",
    "Senior",
    "I replaced a 60+ sequential query loop with a single set-based bulk insert using MySQL `JSON_TABLE` inside a TypeORM transaction, reducing latency from 45-50s down to 1-2s.",
    "Previously, creating a 4-week timesheet period looped over 20 day entries, calling a stored procedure, querying the insert ID, and re-fetching each entry sequentially. I restructured the endpoint to send all entries in one JSON payload. In MySQL, `JSON_TABLE` unpacked the entries into relational rows inside a single `INSERT` statement. Wrapped in a TypeORM `QueryRunner` transaction, execution time dropped by ~95% with full ACID atomicity.",
    null,
    "Set-based database operations outperform application-layer iterative loops by orders of magnitude."
  ),
  createQ(
    45, 5, SECTIONS[4].title,
    "What is a database transaction, and what are the ACID properties?",
    "Senior",
    "A transaction is an atomic unit of work that ensures multiple database operations either all succeed together or all roll back completely.",
    "The ACID properties are:\n- **Atomicity**: All or nothing execution.\n- **Consistency**: Database transitions from one valid state to another, satisfying all constraints.\n- **Isolation**: Concurrent transactions execute without interference (Read Committed, Repeatable Read).\n- **Durability**: Committed data survives system crashes via write-ahead logging (WAL).",
    null,
    "Transactions guarantee atomicity and data consistency across multi-record operations."
  ),
  createQ(
    46, 5, SECTIONS[4].title,
    "How do you manage transactions in TypeORM?",
    "Senior",
    "For complex operations, I use TypeORM's `QueryRunner` to manage the transaction lifecycle explicitly.",
    "I create a query runner, call `connect()` and `startTransaction()`, execute all queries via `queryRunner.manager`, call `commitTransaction()` on success, and `rollbackTransaction()` in the catch block. Critically, I release the runner in a `finally` block to return the connection to the pool.",
    null,
    "Always release TypeORM QueryRunners in a finally block to prevent connection pool exhaustion."
  ),
  createQ(
    47, 5, SECTIONS[4].title,
    "What is the difference between TypeORM and Prisma?",
    "Senior",
    "TypeORM is an active-record/data-mapper ORM using TypeScript class decorators, while Prisma is a schema-first ORM with an auto-generated type-safe client.",
    "Chrona uses TypeORM, which provides flexible query builders, entity inheritance, and raw query runner transactions. My portfolio platform uses Prisma, which uses a declarative `schema.prisma` file, eliminates decorator metadata overhead, and guarantees 100% type-safe query results.",
    null,
    "TypeORM offers flexible query builders for complex SQL; Prisma provides unmatched compile-time type safety."
  ),
  createQ(
    48, 5, SECTIONS[4].title,
    "How do you prevent SQL injection?",
    "Senior",
    "I use parameterized queries and ORM query builders, never concatenating untrusted user strings directly into SQL statements.",
    "Parameterized queries separate the SQL code from user-supplied data; the database driver sends data as parameters in a separate protocol packet, making it impossible for user input to alter the SQL syntax. For dynamic column names or sort directions, I validate against an explicit whitelist.",
    null,
    "Always use parameterized queries; never concatenate user input into raw SQL strings."
  ),
  createQ(
    49, 5, SECTIONS[4].title,
    "How do you prevent cross-tenant data leakage in multi-tenant systems?",
    "Senior",
    "I extract the verified tenant ID exclusively from the authenticated backend JWT session and enforce it on every database query.",
    "In LesHub, every query explicitly checks `WHERE tenant_id = :tenantId`. For ID lookups (`/api/students/:id`), the query scopes `WHERE id = :id AND tenant_id = :tenantId`. If not found, we return `404 Not Found` rather than `403` to prevent attackers from enumerating valid IDs across other driving schools.",
    null,
    "Derive tenant identity from trusted session context, never from client-supplied request parameters."
  ),
  createQ(
    50, 5, SECTIONS[4].title,
    "How do you handle database migrations in production without downtime?",
    "Senior",
    "I use Expand-and-Contract (Staged) database migrations, ensuring all changes are backward-compatible with running application versions.",
    "To rename a column: 1) Add the new column as nullable (Expand), 2) Deploy code that writes to both old and new columns, 3) Backfill historical data, 4) Deploy code that reads only from the new column, 5) Drop the old column (Contract). This prevents downtime during rolling deployments.",
    null,
    "Use expand-and-contract migrations so old and new code versions can run simultaneously."
  ),

  // SECTION 6: Authentication, Security & Payments (Q51-Q60)
  createQ(
    51, 6, SECTIONS[5].title,
    "What is the difference between authentication and authorization?",
    "Senior",
    "Authentication validates WHO you are (identity verification); Authorization determines WHAT you can do (permissions and access rights).",
    "Authentication occurs when a user logs in with credentials and receives a signed JWT. Authorization occurs on subsequent requests when an RBAC guard inspects the JWT claims to determine if that user has permission to perform an administrative action or view a specific tenant record.",
    null,
    "Authentication confirms identity; authorization enforces resource permissions."
  ),
  createQ(
    52, 6, SECTIONS[5].title,
    "How do you implement secure JWT authentication?",
    "Senior",
    "I implement dual-token rotation: a short-lived Access Token (15-min TTL) and a long-lived Refresh Token (7-day TTL) stored in an HTTP-Only, Secure, SameSite cookie.",
    "Storing tokens in `localStorage` exposes them to Cross-Site Scripting (XSS) theft. Storing the refresh token in an HTTP-Only cookie ensures JavaScript cannot access it. When the access token expires, a silent refresh endpoint verifies the cookie, issues a new token pair, and rotates the refresh token to detect replay attacks.",
    null,
    "Store refresh tokens in HTTP-Only cookies with rotation to defend against XSS token theft."
  ),
  createQ(
    53, 6, SECTIONS[5].title,
    "How do you handle authentication across Next.js edge middleware and backend APIs?",
    "Senior",
    "I coordinate route gating at the Next.js Edge Middleware using session cookies, while requiring backend API services to independently verify JWT signatures.",
    "In Chrona, Next.js Edge Middleware inspects cookies for route protection. If cookies are absent, it redirects to `/sign-in` before rendering page bundles. On the client, Axios sends `Authorization: Bearer <token>` to NestJS, where JWT guards validate signatures and enforce fine-grained role permissions.",
    null,
    "Edge middleware provides fast UX redirection; backend guards provide authoritative cryptographic verification."
  ),
  createQ(
    54, 6, SECTIONS[5].title,
    "Why can cookie-based authentication create redirect loops in Next.js, and how did you fix it in Chrona?",
    "Senior",
    "Redirect loops occur when edge middleware redirects unauthenticated users to `/sign-in`, but the login route or callback is intercepted by the same rule, or when dual tokens become desynchronized.",
    "In Chrona, our backend HTTP-only cookie (`token`) remained valid, but the client JavaScript token (`chrona_token`) expired. Edge middleware let the user through to `/employermanagement`, but Axios had no token, triggering client-side redirects back to login. We updated edge middleware (`src/proxy.ts`) to verify both tokens; if desynced, it aggressively deletes the stale cookie and redirects to `/sign-in` once.",
    null,
    "Ensure public auth routes are excluded from middleware and synchronize dual-token validity."
  ),
  createQ(
    55, 6, SECTIONS[5].title,
    "How do you verify Stripe webhook events securely?",
    "Senior",
    "I verify the cryptographic signature using Stripe's official SDK and the exact raw request body buffer, using the configured webhook secret.",
    "Never verify webhooks using parsed JSON, as JSON parsers modify whitespace and key ordering, invalidating the HMAC-SHA256 hash. I configure NestJS to capture the raw body buffer, invoke `stripe.webhooks.constructEvent(rawBody, signature, secret)`, and handle events like `checkout.session.completed` idempotently.",
    null,
    "Stripe webhook verification requires the unparsed raw request body buffer and endpoint secret."
  ),
  createQ(
    56, 6, SECTIONS[5].title,
    "How do you verify Razorpay payments?",
    "Senior",
    "I compute the expected HMAC-SHA256 signature using `crypto.createHmac`, concatenating `order_id + '|' + payment_id`, and compare it to the supplied signature using `crypto.timingSafeEqual`.",
    "A client-side success screen is not proof of payment. The backend verifies the signature using the Razorpay key secret. Using `timingSafeEqual` prevents timing attacks where attackers guess signatures byte-by-byte based on comparison latency.",
    null,
    "Verify payment signatures on the backend using timing-safe comparison before updating order status."
  ),
  createQ(
    57, 6, SECTIONS[5].title,
    "Tell me about the Stripe checkout issue involving encrypted responses.",
    "Senior",
    "In my portfolio platform, a global AES-256 decryption interceptor in our custom API service collided with raw external responses from Stripe Checkout.",
    "Our standard `ApiService` assumed all GET responses were encrypted `{ result: '<encrypted_string>' }` and ran `AES.decrypt()`. When initializing Stripe Checkout sessions, the external API returned raw JSON. The interceptor attempted to decrypt raw JSON, resulting in silent errors. I decoupled external calls into an isolated client that bypasses internal encryption pipelines.",
    null,
    "Decouple third-party external API clients from internal cryptographic interceptors."
  ),
  createQ(
    58, 6, SECTIONS[5].title,
    "What is the difference between encryption and hashing?",
    "Senior",
    "Encryption is a two-way function designed to be decrypted with a secret key; Hashing is a one-way mathematical function designed to be irreversible.",
    "Passwords should NEVER be encrypted; they must be hashed using slow, salted algorithms like Argon2id or bcrypt. Encryption (AES-256) is used for confidential data that must be recovered later. HMAC is a keyed hash used for webhook and payment message authentication.",
    null,
    "Hash passwords with Argon2id; encrypt confidential data that requires two-way retrieval."
  ),
  createQ(
    59, 6, SECTIONS[5].title,
    "How do you handle access token expiration during in-flight API requests?",
    "Senior",
    "I use an Axios response interceptor with a token refresh queue to silently refresh expired tokens and retry failed requests seamlessly.",
    "When an API returns `401 Unauthorized`, the interceptor queues the failed request, calls `/auth/refresh` to obtain a new access token, updates the Authorization header, and retries the queued requests. If the refresh call itself fails, it clears local state and redirects to login.",
    null,
    "Use response interceptors with request queuing to handle token refresh without disrupting user flows."
  ),
  createQ(
    60, 6, SECTIONS[5].title,
    "How do you prevent double bookings or duplicate payments?",
    "Senior",
    "I enforce conflict prevention at the database level using unique constraints, pessimistic locking, and idempotency keys, never relying solely on frontend button disabling.",
    "For bookings, we use a database transaction with a unique composite index (`UNIQUE KEY (resource_id, start_time)`) or `SELECT ... FOR UPDATE` row locks. For payments, we store the provider transaction ID as a unique column in MySQL/PostgreSQL, preventing duplicate writes at the schema level.",
    null,
    "Enforce concurrency and conflict prevention with unique database constraints and row locking."
  ),

  // SECTION 7: Project-Specific Troubleshooting Stories (Q61-Q70)
  createQ(
    61, 7, SECTIONS[6].title,
    "Tell me about a difficult bug you fixed in LesHub.",
    "Senior",
    "I isolated and resolved an unbounded loop that caused V8 heap exhaustion and server crashes during recurring calendar lesson generation.",
    "In LesHub's recurring lesson scheduler, a date increment utility compared string and numeric timestamps (`nextDate < endDate`). Due to implicit JavaScript type coercion, the loop condition never evaluated to false under specific monthly rollover inputs, creating an infinite while loop that exhausted memory. I fixed the termination logic using strict date objects and added regression tests.",
    null,
    "Type coercion in termination conditions can cause fatal infinite loops and heap exhaustion."
  ),
  createQ(
    62, 7, SECTIONS[6].title,
    "How did you handle optimistic drag-and-drop updates in LesHub?",
    "Senior",
    "I implemented optimistic UI updates for lesson rescheduling with snapshot rollback and request cancellation using AbortController.",
    "When a lesson is dragged, the calendar updates immediately for 60fps UX. Concurrently, an API request fires. If the backend reports a conflict or the instructor drops connection, the mutation catches the error, rolls back the calendar state to the snapshot coordinates, and displays an informative alert.",
    null,
    "Capture complete state snapshots prior to optimistic mutations to ensure reliable rollback on error."
  ),
  createQ(
    63, 7, SECTIONS[6].title,
    "How did you approach audit history in Chrona?",
    "Senior",
    "I implemented an audit history diffing engine that tracks field-level changes across timesheet modifications for legal and payroll compliance.",
    "Instead of blindly overwriting records, updates pass through an audit interceptor that computes a shallow diff between current and incoming entity states (`{ field, oldValue, newValue, changedBy, timestamp }`), storing the diff record in an `audit_logs` table within the same database transaction.",
    null,
    "Write audit log entries in the same database transaction as the business entity update."
  ),
  createQ(
    64, 7, SECTIONS[6].title,
    "Tell me about the product slug versus numeric ID problem in your portfolio platform.",
    "Mid",
    "I resolved an issue where SEO-friendly slug URLs collided with backend internal numeric IDs in REST route handlers.",
    "Public URLs used `/products/ergonomic-standing-desk` while database foreign keys required integer IDs (`42`). If a user entered a numeric string slug (`/products/100`), naive route parsers confused slugs with IDs. I structured the service to resolve slugs against a unique indexed `slug` column, decoupling public URLs from internal surrogate keys.",
    null,
    "Decouple public SEO URLs from internal database surrogate IDs at the service layer."
  ),
  createQ(
    65, 7, SECTIONS[6].title,
    "How do you troubleshoot a frontend request that returns the wrong data?",
    "Mid",
    "I trace the request systematically: Browser Network Tab (URL, headers, query params) ➔ Backend Controller DTO ➔ Service Business Logic ➔ Database Query Execution.",
    "I check for query caching bugs, stale client state, timezone discrepancies in date filters, and tenant scoping issues. Adding a targeted integration test reproducing the exact input parameters isolates the faulty layer quickly.",
    null,
    "Trace requests systematically from network payload through ORM query generation to isolate data errors."
  ),
  createQ(
    66, 7, SECTIONS[6].title,
    "How would you debug an API that works locally but fails in staging?",
    "Senior",
    "I compare environment variables, database migration state, CORS headers, reverse proxy (Nginx) timeout limits, and IAM networking permissions.",
    "Frequently, local environments run with permissive CORS, SQLite/local databases, or missing environment variables. I inspect staging container logs (CloudWatch/Docker), verify that database migrations executed, and check for SSL/TLS certificate or cookie domain mismatches.",
    null,
    "Verify environment variables, database migration status, and network proxy rules when debugging staging failures."
  ),
  createQ(
    67, 7, SECTIONS[6].title,
    "What would you do if a production deployment broke a previously working feature?",
    "Senior",
    "I prioritize immediate service restoration via automated rollback or feature flag deactivation, followed by root-cause analysis.",
    "In production incidents, you do not debug live on production servers. If a release causes elevated 5xx error rates, we immediately trigger a container rollback to the previous stable Docker image tag in ECS. Once systems are green, we reproduce the defect in staging and write a regression test.",
    null,
    "Roll back first to restore user availability, then isolate root causes in staging."
  ),
  createQ(
    68, 7, SECTIONS[6].title,
    "Tell me about a feature where you made an engineering trade-off.",
    "Senior",
    "In Chrona, I traded the simplicity of individual TypeORM entity operations for the performance of raw MySQL JSON_TABLE bulk queries.",
    "Individual entity operations are simple to read and maintain, but they produced 60+ database round-trips for a single timesheet save. Writing raw bulk SQL was more complex and required careful manual validation, but cutting execution time by 95% was essential for business viability.",
    null,
    "Justify increased architectural complexity only when performance benchmarks empirically demand it."
  ),
  createQ(
    69, 7, SECTIONS[6].title,
    "How do you explain a technical bug to a non-technical stakeholder?",
    "Mid",
    "I explain the user impact, the business risk, the solution, and the prevention plan in plain business language without technical jargon.",
    "Instead of saying 'a TypeORM connection pool leak caused unhandled promise rejections', I say: 'The system was opening database connections faster than it was closing them, causing the application to slow down during peak morning hours. We added automated connection cleanup and verified that timesheet submissions now complete smoothly.'",
    null,
    "Translate technical root causes into business outcomes, user impact, and resolution timelines."
  ),
  createQ(
    70, 7, SECTIONS[6].title,
    "How do you prove that your fix actually worked?",
    "Senior",
    "I write an automated regression test that fails against the unpatched code and passes with the fix, verified with before-and-after performance telemetry.",
    "For our Chrona optimization, proof was quantitative: automated integration tests verified data accuracy across 20 entries, and production telemetry confirmed latency dropped from 48s to 1.4s with zero timeouts.",
    null,
    "Combine automated regression test passes with quantitative production telemetry to verify fixes."
  ),

  // SECTION 8: Testing & Quality Assurance (Q71-Q80)
  createQ(
    71, 8, SECTIONS[7].title,
    "What types of testing do you perform across a full-stack codebase?",
    "Senior",
    "I employ the Testing Pyramid: Unit Tests for pure functions/utilities, Component Tests with RTL for UI behavior, Integration Tests for API & database paths, and E2E Tests for critical user journeys.",
    "Unit tests run fast in memory. Component tests verify user behavior without implementation-detail coupling. Integration tests verify real database queries and transaction rollbacks. Critical financial flows (Stripe checkout) have automated E2E coverage.",
    null,
    "Balance fast unit tests with high-confidence integration tests around critical business paths."
  ),
  createQ(
    72, 8, SECTIONS[7].title,
    "How do you test React components using Vitest and React Testing Library?",
    "Senior",
    "I test from the user's perspective: querying accessible roles with `getByRole`, simulating interactions with `userEvent`, and asserting on visible DOM changes.",
    "I avoid testing internal state variables or component methods. I mock network requests using Mock Service Worker (MSW) at the network layer, asserting that loading skeletons appear, success data displays, and accessible error messages appear when APIs fail.",
    null,
    "Test user-visible behavior and accessible roles rather than internal component state."
  ),
  createQ(
    73, 8, SECTIONS[7].title,
    "How do you test a NestJS service?",
    "Mid",
    "I create an isolated test module with `Test.createTestingModule()`, injecting mock repositories to test business logic independently of the database.",
    "I mock repository methods (`find`, `save`) using `jest.fn()` or `vi.fn()`, verifying that the service executes calculations accurately, throws expected domain exceptions, and calls dependencies with correct parameters.",
    null,
    "Mock repository boundaries to test service business logic quickly and deterministically."
  ),
  createQ(
    74, 8, SECTIONS[7].title,
    "What is the difference between unit and integration testing?",
    "Senior",
    "Unit tests test a single function or class in isolation with all external dependencies mocked; Integration tests test multiple real modules working together.",
    "A unit test can verify that a tax calculation utility calculates 21% correctly. An integration test verifies that the NestJS controller, service, TypeORM entity, and MySQL database execute a transaction and commit data to disk cleanly.",
    null,
    "Unit tests verify algorithmic logic; integration tests prove real database and module cooperation."
  ),
  createQ(
    75, 8, SECTIONS[7].title,
    "What would you test for a payment integration?",
    "Senior",
    "I test happy path checkouts, card decline errors, expired sessions, webhook HMAC signature verification, duplicate webhook idempotency, and network timeout recovery.",
    "Crucially, I test that an order is NEVER marked as paid based solely on frontend success screens. I verify that only cryptographically verified webhook events update database payment status.",
    null,
    "Test failure modes, duplicate webhook deliveries, and signature validation for payment flows."
  ),
  createQ(
    76, 8, SECTIONS[7].title,
    "How do you test authentication and authorization?",
    "Senior",
    "I test unauthenticated requests (401), valid session access (200), expired token refreshes, and role-based access rejections (403).",
    "I write integration tests verifying that a user from Tenant A cannot access records belonging to Tenant B even if they provide a valid ID, and that non-admin users cannot access administrative endpoints.",
    null,
    "Test unauthorized access, expired sessions, and cross-tenant isolation boundaries."
  ),
  createQ(
    77, 8, SECTIONS[7].title,
    "How do you resolve flaky tests?",
    "Senior",
    "I eliminate arbitrary sleeps (`setTimeout`), isolate shared database state between tests, and use deterministic wait utilities like RTL's `waitFor` and Vitest fake timers.",
    "Flakiness is usually caused by race conditions, non-deterministic date values, or state leakage between tests. I use `beforeEach` to reset Zustand/Redux stores and roll back test database transactions after every run.",
    null,
    "Replace arbitrary sleeps with explicit condition polling and ensure clean test state isolation."
  ),
  createQ(
    78, 8, SECTIONS[7].title,
    "What is code coverage, and is 100% coverage necessary?",
    "Senior",
    "Code coverage measures the percentage of code lines/branches executed during tests; 100% coverage is not necessary and can lead to brittle, low-value tests.",
    "I prioritize high coverage (85%+) across critical business logic, payment integrations, authorization guards, and database transactions, while avoiding low-value tests for trivial boilerplate or static markup.",
    null,
    "Focus test effort on high-risk business logic and data integrity rather than chasing 100% metric vanity."
  ),
  createQ(
    79, 8, SECTIONS[7].title,
    "What testing challenges did you solve in Chrona?",
    "Senior",
    "In Chrona, I resolved unhandled promise rejection errors in our Vitest test suites caused by asynchronous mock mismatches in Timesheet services.",
    "Asynchronous service calls were throwing rejected promises inside un-awaited test blocks, causing Vitest runner failures. I standardized mock returns with `vi.mockResolvedValue` and wrapped async assertions in `await expect(...).rejects.toThrow()`.",
    null,
    "Properly await async promise rejections to prevent unhandled test runner crashes."
  ),
  createQ(
    80, 8, SECTIONS[7].title,
    "How do you decide which tests belong in CI?",
    "Senior",
    "I run fast checks (<3 minutes) on every commit: linting, TypeScript type-checking, and unit tests. Heavy integration and E2E tests run on pull request merges or nightly builds.",
    "This maintains fast developer feedback loops while guaranteeing that no broken code or failing test reaches production.",
    null,
    "Structure CI pipelines into fast pre-merge gates and comprehensive staging validation gates."
  ),

  // SECTION 9: Git, CI/CD, Deployment & AWS (Q81-Q90)
  createQ(
    81, 9, SECTIONS[8].title,
    "Explain your Git workflow when implementing a feature.",
    "Mid",
    "I use GitHub Flow / GitFlow: branch from main/develop, write focused atomic commits, open a Pull Request with context, address code reviews, and rebase or squash-merge.",
    "I write descriptive commit messages adhering to Conventional Commits (`feat:`, `fix:`, `refactor:`). I keep PRs small (<400 lines) to facilitate thorough code review.",
    null,
    "Keep Git feature branches focused, small, and aligned with Conventional Commits."
  ),
  createQ(
    82, 9, SECTIONS[8].title,
    "What is the difference between GitHub and Bitbucket?",
    "Mid",
    "Both are Git hosting platforms; GitHub excels in community integrations and GitHub Actions, while Bitbucket integrates deeply with Atlassian Jira and Bitbucket Pipelines.",
    "In Chrona, we used Bitbucket with Jira integration for timesheet ticketing. In my portfolio platform, I used GitHub with GitHub Actions for automated CI/CD container builds.",
    null,
    "Git mechanics are identical; platform differences lie in CI/CD and ecosystem integrations."
  ),
  createQ(
    83, 9, SECTIONS[8].title,
    "What do you look for during a code review?",
    "Senior",
    "I review for architectural alignment, edge-case error handling, SQL injection/security risks, database N+1 query patterns, test coverage, and readability.",
    "I verify whether database migrations are backward-compatible, ensure API contracts adhere to standards, and check that new state changes don't introduce re-render cascades.",
    null,
    "Review code for security, error handling, performance implications, and maintainability."
  ),
  createQ(
    84, 9, SECTIONS[8].title,
    "What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?",
    "Senior",
    "CI automatically validates, lints, type-checks, and tests code on every push; CD automatically builds, packages, and deploys validated code to production or staging environments.",
    "CI catches bugs and regressions early before merging. CD eliminates manual release errors by automating container builds, database migrations, and rolling deployments.",
    null,
    "CI validates code correctness; CD automates reliable, repeatable production delivery."
  ),
  createQ(
    85, 9, SECTIONS[8].title,
    "Walk me through how you deploy a Next.js and NestJS application on AWS.",
    "Senior",
    "I containerize both services using multi-stage Dockerfiles and deploy to AWS ECS Fargate behind an Application Load Balancer with an RDS managed database.",
    "The Next.js frontend and NestJS backend run in private subnets. An Application Load Balancer routes traffic via HTTPS. Database persistence uses Amazon RDS Multi-AZ MySQL/PostgreSQL. Redis is managed via Amazon ElastiCache, and assets are served via S3 and CloudFront.",
    null,
    "Deploy containerized workloads to ECS Fargate with private RDS subnets and ALB routing."
  ),
  createQ(
    86, 9, SECTIONS[8].title,
    "Which core AWS services do you use for a full-stack web application?",
    "Senior",
    "I use ECS Fargate (containers), ALB (load balancing), RDS (relational DB), ElastiCache (Redis), S3 (asset storage), CloudFront (CDN), Secrets Manager, and CloudWatch.",
    "This architecture provides auto-scaling, high availability across multiple Availability Zones, automated backups, and encrypted secret management.",
    null,
    "Combine ECS, RDS, S3, CloudFront, and Secrets Manager for resilient AWS full-stack hosting."
  ),
  createQ(
    87, 9, SECTIONS[8].title,
    "How do you manage environment variables and secrets securely?",
    "Senior",
    "I never commit secrets to Git. In production, I inject secrets via AWS Secrets Manager or secure CI/CD pipeline variables at container runtime.",
    "I separate public frontend variables (`NEXT_PUBLIC_`) from private backend secrets (DB passwords, Stripe secret keys). In development, we use `.env.local` excluded in `.gitignore`.",
    null,
    "Inject secrets at runtime via cloud secret managers; never hardcode credentials in code or Git."
  ),
  createQ(
    88, 9, SECTIONS[8].title,
    "How do you handle database migrations during deployment?",
    "Senior",
    "I run migrations as a pre-deployment step before spawning new application containers, using backward-compatible schema changes.",
    "In ECS, we run migration tasks using a dedicated container before updating service tasks. If a migration fails, the deployment halts before any new application code receives production traffic.",
    null,
    "Execute database migrations as automated pre-deployment tasks to protect runtime traffic."
  ),
  createQ(
    89, 9, SECTIONS[8].title,
    "What do you monitor after deploying a new release?",
    "Senior",
    "I monitor 5xx HTTP error rates, p95 API latency, CPU/memory saturation, database connection pool usage, and Sentry error reports.",
    "I set up CloudWatch alarms on 5xx error spikes that automatically alert the engineering channel or trigger rollback if error rates exceed 1%.",
    null,
    "Monitor error rates, latency percentiles, and database connections to verify release health."
  ),
  createQ(
    90, 9, SECTIONS[8].title,
    "What do you say if an interviewer asks about an AWS service you haven't personally configured?",
    "Senior",
    "I state honestly what I have personally deployed, explain my conceptual understanding from first principles, and describe how I would approach it.",
    "For example: 'I have hands-on experience deploying containerized apps using Docker, ECS Fargate, S3, and RDS. While I haven't personally configured an AWS EKS Kubernetes cluster from scratch, I understand container orchestration principles, ingress controllers, and pod scheduling, and I would approach it by reviewing AWS best practices.'",
    null,
    "Acknowledge experience boundaries honestly while demonstrating first-principles architecture knowledge."
  ),

  // SECTION 10: Architecture, Scenarios & Leadership (Q91-Q100)
  createQ(
    91, 10, SECTIONS[9].title,
    "How do you decide between a monolith and microservices?",
    "Senior",
    "I start with a well-structured Modular Monolith by default; I only decompose into microservices when distinct domain boundaries require independent scaling or deployment.",
    "Microservices introduce distributed system complexity: network latency, distributed transactions, outbox patterns, and observability overhead. A modular monolith with clear domain boundaries delivers high developer velocity without distributed failure modes.",
    null,
    "Start with a modular monolith; only decouple into microservices when business scale demands it."
  ),
  createQ(
    92, 10, SECTIONS[9].title,
    "How do you design caching for a frequently accessed API?",
    "Senior",
    "I implement Multi-Layer Caching: Cache-Control HTTP headers at the CDN layer (CloudFront), and Redis Cache-Aside at the backend application layer.",
    "For database queries, we check Redis using a unique key (`user:profile:123`). If cache hits, we return immediately. On cache miss, we query MySQL, write to Redis with a TTL (e.g. 1 hour), and invalidate the cache immediately upon user mutation.",
    null,
    "Use Redis Cache-Aside with explicit TTLs and mutation invalidations for read-heavy APIs."
  ),
  createQ(
    93, 10, SECTIONS[9].title,
    "How would you investigate a slow API end to end?",
    "Senior",
    "I trace the request lifecycle: Network round-trip ➔ Nginx reverse proxy ➔ NestJS middleware ➔ Service CPU processing ➔ Database query execution plans.",
    "Using APM tracing (Datadog/Sentry), I isolate which segment accounts for the latency. In 90% of cases, the bottleneck is either an un-indexed database query, an N+1 query loop, or synchronous third-party API calls.",
    null,
    "Use distributed tracing to isolate whether latency originates in network, runtime, or database."
  ),
  createQ(
    94, 10, SECTIONS[9].title,
    "How do you prevent race conditions in a booking system?",
    "Senior",
    "I enforce conflict prevention at the database engine level using unique composite constraints or pessimistic row locking (`SELECT ... FOR UPDATE`).",
    "In our booking platform, two users attempting to book the same appointment slot simultaneously will be serialized by the database row lock. The first transaction commits; the second transaction detects the existing slot and returns an immediate conflict error.",
    null,
    "Pessimistic row locking in database transactions prevents concurrent booking collisions."
  ),
  createQ(
    95, 10, SECTIONS[9].title,
    "How do you handle external third-party service failures?",
    "Senior",
    "I use strict request timeouts, Circuit Breakers, exponential backoff with jitter, and dead-letter queues for asynchronous events.",
    "If Stripe or a calendar API experiences high latency, a Circuit Breaker trips after consecutive timeouts, immediately failing fast and serving a graceful fallback instead of exhausting all backend HTTP connections.",
    null,
    "Circuit breakers and timeouts prevent downstream third-party outages from crashing your core app."
  ),
  createQ(
    96, 10, SECTIONS[9].title,
    "How do you explain a technical decision you later changed?",
    "Senior",
    "I explain the original constraints, why the initial decision was rational, what new scale or data emerged, and how we refactored deliberately.",
    "In Chrona, individual entity operations were initially chosen for rapid prototype delivery. Once customer timesheet periods reached 20-30 day entries, benchmarks revealed a 45-second bottleneck. We adapted by refactoring to MySQL `JSON_TABLE` batching.",
    null,
    "Demonstrate engineering pragmatism: build for current constraints, but refactor when data proves the need."
  ),
  createQ(
    97, 10, SECTIONS[9].title,
    "How do you collaborate effectively with product managers, designers, and QA engineers?",
    "Senior",
    "I establish shared technical context early, discuss edge cases and scale trade-offs during planning, and maintain open communication throughout sprints.",
    "I review Figma designs early to flag technical feasibility constraints, align on API DTO contracts with QA for automated testing, and provide PMs with transparent estimates backed by technical rationale.",
    null,
    "Bridge technical constraints with business priorities through early cross-functional alignment."
  ),
  createQ(
    98, 10, SECTIONS[9].title,
    "How do you handle a technical disagreement with a teammate?",
    "Senior",
    "I remove personal ego, anchor the discussion to measurable engineering criteria (performance, maintainability, team familiarity), and build a small proof-of-concept if needed.",
    "When deciding between Redux and Zustand in Chrona, we evaluated both against bundle size, setup complexity, and developer velocity. Zustand won on merits, but I always commit fully to the team's agreed decision.",
    null,
    "Resolve technical disagreements using empirical benchmarks, maintainability, and team consensus."
  ),
  createQ(
    99, 10, SECTIONS[9].title,
    "What would you do if a feature deadline is approaching and testing is incomplete?",
    "Senior",
    "I transparently communicate the risk to stakeholders, prioritize automated tests for critical paths (payments, authentication, data loss), and propose feature-flagging non-critical functionality.",
    "I never silently skip security, authorization, or financial transaction tests. We deploy critical paths with verified tests and stage secondary UI polish behind a feature flag.",
    null,
    "Never compromise security or payment verification; stage secondary features behind flags."
  ),
  createQ(
    100, 10, SECTIONS[9].title,
    "Why should we hire you as a Senior Full Stack Developer?",
    "Senior",
    "I bring four years of proven full-stack ownership across React, Next.js, Node.js, NestJS, and relational databases, with a track record of solving real production bottlenecks.",
    "In Chrona, I cut database timesheet latency from 45s to 1s. In LesHub, I built optimistic scheduling and enforced multi-tenant security. In our portfolio platform, I architected Stripe integrations and resolved complex encryption issues. I take pride in owning features from Figma to production, mentoring teammates, and writing clean, tested, resilient code.",
    null,
    "Anchor your value to proven full-stack ownership, measured production wins, and engineering depth."
  )
];

console.log(`Writing screeningData.js with ${questions.length} questions across ${SECTIONS.length} sections...`);

const fileContent = `// src/screening/data/screeningData.js
// Comprehensive HR & Technical Screening Master Question Bank (100 Questions)
// Tailored to Sameer (Lead Full Stack Developer), Chrona, LesHub, and Portfolio Platform.
// Governed by AGENTS.md Universal 6-Step Technical Screening Framework.

export const SCREENING_CANDIDATE_PROFILE = ${JSON.stringify(metadata.candidateProfile, null, 2)};

export const SCREENING_SPEAKING_RULES = ${JSON.stringify(metadata.speakingRules, null, 2)};

export const SCREENING_90S_PITCH = ${JSON.stringify(metadata.ninetySecondPitch, null, 2)};

export const SCREENING_SALARY_SCRIPTS = ${JSON.stringify(metadata.salaryNegotiation, null, 2)};

export const SCREENING_DIFFICULT_QUESTIONS = ${JSON.stringify(metadata.difficultQuestions, null, 2)};

export const SCREENING_EMERGENCY_TOOLKIT = ${JSON.stringify(metadata.emergencyToolkit, null, 2)};

export const SCREENING_QUESTIONS_TO_ASK = ${JSON.stringify(metadata.questionsToAskRecruiter, null, 2)};

export const SCREENING_SECTIONS = ${JSON.stringify(SECTIONS, null, 2)};

export const SCREENING_100_QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

const targetDir = path.join(__dirname, '..', 'src', 'screening', 'data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'screeningData.js'), fileContent, 'utf-8');
console.log('Successfully generated src/screening/data/screeningData.js!');

module.exports = { questions, SECTIONS };
