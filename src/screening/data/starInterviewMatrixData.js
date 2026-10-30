// src/screening/data/starInterviewMatrixData.js
// 14 Comprehensive Technical STAR Interview Topics with System Design Sequence Diagrams (Mermaid),
// Database/Architecture Contracts, Primary and Backup Pitches, and Spoken-Ready Scripts.

export const STAR_INTERVIEW_TOPICS = [
  // =========================================================================
  // 1. PERFORMANCE
  // =========================================================================
  {
    id: 1,
    topic: "Performance",
    primaryQuestion: "Tell me about a significant performance optimization you achieved in production.",
    backupQuestion: "How do you identify and resolve database or API latency bottlenecks?",
    bestExampleTitle: "LesHub: Replacing Unbounded Polling with SWR (Window Focus & Deduplication)",
    backupExampleTitle: "Chrona: Bulk Hour-Entry Batching with MySQL JSON_TABLE (98% Speedup)",
    
    // PRIMARY STAR (LesHub Notification SWR)
    primaryStar: {
      situation: "In LesHub (driving school ERP), each tenant dashboard had a notification bell and schedule watcher that polled `/api/notifications` every 10 seconds via `setInterval`. With 1,000 instructors keeping multiple browser tabs open, this generated over 100,000 unnecessary API requests per hour, degrading MySQL performance and spiking server CPU to 85%.",
      task: "I was tasked with eliminating the server strain and reducing API traffic by at least 70% while ensuring instructors still received real-time updates for newly booked lessons and schedule changes.",
      action: "1. Diagnosed the root cause using server access logs and New Relic APM, discovering that 82% of requests returned unchanged 304/empty payloads from background tabs.\n2. Replaced raw `setInterval` polling with SWR (Stale-While-Revalidate).\n3. Configured smart revalidation triggers: `revalidateOnFocus: true`, `revalidateOnReconnect: true`, and disabled polling entirely when the browser tab is hidden (`document.visibilityState === 'hidden'`).\n4. Added request deduplication with a 5-second dedupe window (`dedupingInterval: 5000`) so multiple components requesting notification counts shared a single in-flight Promise.\n5. Implemented HTTP `ETag` and Redis caching for user notification snapshots.",
      result: "Total API requests dropped by 84% overnight, MySQL server CPU utilization fell from 85% to 18%, and instructors actually experienced faster, smoother notification badge updates upon tab switching.",
      spokenPitch: "In LesHub, our instructors were polling the notifications API every 10 seconds with setInterval. With hundreds of users having multiple tabs open, we were serving over 100,000 redundant requests an hour, spiking MySQL CPU to 85%.\n\nI analyzed server metrics and saw 80%+ of calls returned unchanged data from inactive tabs. I replaced the timer with SWR, configuring smart window-focus and network-reconnect revalidation while pausing completely when tabs are hidden. I set a 5-second deduplication window so sibling components sharing the hook collapsed into a single HTTP flight, and backed the endpoint with Redis ETags.\n\nThis cut our API load by 84% immediately, dropped database CPU down to 18%, and eliminated tab lag. In production systems, smart event-driven revalidation always beats brute-force timer polling."
    },
    
    // BACKUP STAR (Chrona JSON_TABLE)
    backupStar: {
      situation: "In Chrona, workforce administrators submitting monthly timesheets with 200+ daily employee hours experienced 45-second API timeouts because TypeORM was executing separate queries per line item.",
      task: "Re-architect the bulk save operation to complete in under 1 second without data loss or race conditions.",
      action: "Created a MySQL 8 stored procedure using native `JSON_TABLE` to ingest the entire JSON array in a single query, map it into a virtual relational table, and execute an atomic `INSERT ... ON DUPLICATE KEY UPDATE` wrapped in a TypeORM `QueryRunner` transaction.",
      result: "Reduced save latency from 45 seconds to 800 milliseconds (98% reduction) and eliminated connection timeouts across 10,000+ active workforce accounts.",
      spokenPitch: "In Chrona, bulk timesheet saves took 45 seconds due to ORM N+1 inserts. I re-architected it by passing the raw JSON payload to a MySQL 8 stored procedure using JSON_TABLE, performing set-based upserts in a single database roundtrip. Latency dropped to 800ms."
    },

    // MERMAID SEQUENCE DIAGRAM
    mermaidDiagram: `sequenceDiagram
    autonumber
    actor User as Instructor (Browser Tab)
    participant SWR as SWR Client Cache
    participant API as Express API Gateway
    participant Redis as Redis Cache (ETags)
    participant DB as MySQL DB

    Note over User,SWR: Tab 1 & Tab 2 Open
    User->>SWR: Component mounts (Notification Bell)
    SWR->>API: GET /api/notifications (Deduplicated Single Flight)
    API->>Redis: Check User ETag
    Redis-->>API: Cache Hit (ETag: "w/3f8a")
    API-->>SWR: 200 OK [Unread: 3]
    SWR-->>User: Render Badge (Instant)

    Note over User,SWR: User switches to another window (Tab Inactive)
    Note over SWR: visibilityState == 'hidden' -> Polling Paused!
    
    Note over User,SWR: User focuses back on LesHub Tab
    User->>SWR: Window Focus Event
    SWR->>API: GET /api/notifications (If-None-Match: "w/3f8a")
    API->>Redis: Compare ETag
    API-->>SWR: 304 Not Modified (0 KB Payload)
    SWR-->>User: Keep Cached State (No Re-render)`,

    architectureContract: `// SWR Configuration for Resilient Production Notification Polling
import useSWR from 'swr';

export function useNotifications() {
  return useSWR('/api/notifications', fetcher, {
    revalidateOnFocus: true,        // Refresh when user returns to tab
    revalidateOnReconnect: true,    // Refresh after network blip
    refreshInterval: 0,             // Disables aggressive timer polling
    dedupingInterval: 5000,         // Deduplicate calls within 5s
    focusThrottleInterval: 10000,   // Throttle rapid alt-tabbing
    keepPreviousData: true          // Avoid UI layout shift
  });
}`
  },

  // =========================================================================
  // 2. DEBUGGING ACROSS LAYERS
  // =========================================================================
  {
    id: 2,
    topic: "Debugging across layers",
    primaryQuestion: "Tell me about a complex bug you solved that spanned multiple layers of the stack.",
    backupQuestion: "How do you systematically isolate an issue when frontend and backend behaviors disagree?",
    bestExampleTitle: "Chrona: Login Session Mismatch (Dual-Cookie Edge Middleware & Axios 401)",
    backupExampleTitle: "LesHub: File Upload 404 Caused by Express Middleware Registration Order",

    primaryStar: {
      situation: "In Chrona, users reported intermittent 401 unauthorized redirects after login. The browser showed an authenticated state, but clicking navigation links redirected users back to the login page, especially during morning traffic spikes.",
      task: "Isolate and fix the root cause spanning Next.js Edge Middleware, browser cookie storage, and NestJS JWT auth services without degrading user security.",
      action: "1. Traced full request lifecycle using Chrome DevTools Network tab, Next.js server logs, and NestJS interceptors.\n2. Discovered an architectural desynchronization: Next.js Edge Middleware was inspecting a client-readable `client_session_indicator` cookie, while NestJS was issuing an HttpOnly `access_token`.\n3. The client cookie had a 15-minute TTL while the backend token had 60 minutes. When the client cookie expired first, Edge Middleware blocked requests even though the backend token was still valid.\n4. Furthermore, Axios interceptors triggered simultaneous refresh requests, causing token collision and race invalidation.\n5. Unified cookie scopes and TTLs, and added a single-flight Promise mutex in Axios to queue simultaneous 401s behind a single refresh request.",
      result: "Completely eliminated random logout redirects, stabilized session handling for 10,000+ users, and added automated Playwright end-to-end tests validating edge-to-backend token rotation.",
      spokenPitch: "In Chrona, users experienced sudden logouts despite being logged in. Tracing across the full stack, I discovered our Next.js Edge Middleware was checking a client cookie with a 15-minute TTL, while our NestJS backend issued an HttpOnly JWT valid for 60 minutes. The desynchronized TTL caused Edge Middleware to preemptively redirect valid sessions. In parallel, concurrent API calls on 401 were triggering multiple refresh calls that collided.\n\nI resolved it by synchronizing cookie lifecycles, adding a single-flight Promise lock in Axios to serialize token refreshes, and refreshing tokens proactively 2 minutes before expiry. In modern full-stack architectures, session state across edge proxies and backends must be unified under a single source of truth."
    },

    backupStar: {
      situation: "In LesHub, document uploads to `/api/tenants/:id/documents` returned an unexplained 404 in production, even though the controller route was clearly defined.",
      task: "Determine why the upload route was swallowed and resolve the routing error.",
      action: "Inspected Express middleware stack and found that a wildcard static asset server (`express.static`) was registered before the `multer` multipart file-upload route. Express attempted to resolve the multipart POST as a static file, failed, and returned 404 before reaching the upload controller.",
      result: "Restructured middleware execution order with strict route prefixes, instantly fixing uploads.",
      spokenPitch: "In LesHub, an upload endpoint returned 404 despite existing. I traced Express middleware and found express.static was registered before the multer route. Reordering the middleware pipeline fixed the issue."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Browser as React App (Browser)
    participant Edge as Next.js Edge Middleware
    participant Axios as Axios 401 Interceptor
    participant Nest as NestJS Auth Gateway
    participant Redis as Redis Token Blacklist

    Browser->>Edge: GET /dashboard (Cookie: access_token=Valid, indicator=Expired)
    Note over Edge: BUG: Checked indicator cookie instead of JWT!
    Edge-->>Browser: 302 Redirect /login (False Negative)

    Note over Browser,Axios: FIX APPLIED: Unified Token & Single-Flight Lock
    Browser->>Edge: GET /dashboard (HttpOnly access_token)
    Edge->>Edge: Verify JWT Signature at Edge
    Edge->>Nest: Forward Request with x-user-id Header
    Nest-->>Browser: 200 OK Dashboard Data

    Note over Browser,Axios: On Token Expiration (Concurrent 401s)
    Browser->>Axios: 3 Parallel API Calls fail with 401
    Note over Axios: Single-Flight Mutex: Locks 2nd & 3rd calls
    Axios->>Nest: POST /auth/refresh (Only 1 request sent)
    Nest->>Redis: Rotate Refresh Token
    Nest-->>Axios: 200 OK New Tokens
    Axios->>Browser: Replay all 3 calls with new token (Success!)`,

    architectureContract: `// Axios Single-Flight Mutex to Prevent Concurrent 401 Refresh Collisions
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await authApi.post('/refresh');
        processQueue(null, data.accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);`
  },

  // =========================================================================
  // 3. SECURITY & SANITIZATION
  // =========================================================================
  {
    id: 3,
    topic: "Security & Sanitization",
    primaryQuestion: "How do you protect your applications against security vulnerabilities such as XSS and webhook spoofing?",
    backupQuestion: "Tell me about a time you implemented cryptographic verification or content sanitization.",
    bestExampleTitle: "Portfolio Platform: DOMPurify XSS Sanitization & Stripe Raw-Body HMAC Check",
    backupExampleTitle: "Chrona: AES Payload Encryption with Selective FormData File Upload Bypass",

    primaryStar: {
      situation: "In my personal Portfolio Platform, administrators can write blog posts using a rich-text WYSIWYG editor (TipTap), while the platform simultaneously receives financial payment webhooks from Stripe and Razorpay.",
      task: "Prevent Stored Cross-Site Scripting (XSS) in blog rendering while preventing webhook forgery and replay attacks on the payment pipeline.",
      action: "1. For rich text, implemented `DOMPurify` sanitization with strict tag and attribute whitelists, stripping dangerous tags (`<script>`, `<iframe onerror=...>`, `javascript:`) before DOM insertion.\n2. For Stripe webhooks, identified that Express `body-parser` parses JSON into objects, mutating raw bytes and breaking cryptographic HMAC SHA-256 signature checks.\n3. Configured NestJS/Express to capture the immutable `rawBody` buffer (`express.raw({ type: 'application/json' })`) specifically on the webhook route.\n4. Verified `stripe-signature` timestamp against system time to reject replay attacks older than 300 seconds.",
      result: "Zero XSS vulnerabilities across all rendered markdown/HTML posts and 100% cryptographic certainty on payment state transitions with zero spoofing risk.",
      spokenPitch: "In my Portfolio Platform, I secured two critical surfaces: rich-text blog publishing and Stripe payment webhooks. For blog rendering, I used DOMPurify with strict tag whitelisting to sanitize HTML before rendering, eliminating Stored XSS vectors.\n\nFor Stripe webhooks, default Express JSON parsers mutate raw payload buffers, causing cryptographic HMAC signature verification to fail. I configured route-specific raw buffer capture using express.raw, verified the signature against Stripe's signing secret, and checked timestamps to prevent replay attacks. In security, you never trust client inputs, and you never verify cryptographic signatures against parsed JSON objects."
    },

    backupStar: {
      situation: "In Chrona, sensitive HR payroll data required client-side AES-256-GCM payload encryption, but attaching large PDF medical leaves caused encryption crashes and payload size blowup.",
      task: "Allow binary file uploads while maintaining end-to-end encryption for metadata.",
      action: "Built an Axios interceptor that selectively bifurcated payloads: if request was `multipart/form-data`, it encrypted only the JSON metadata string and passed the binary `File` directly in FormData, setting appropriate MIME headers.",
      result: "Secured payroll metadata with AES-256 while supporting seamless multi-megabyte document uploads.",
      spokenPitch: "In Chrona, we needed AES encryption on API bodies, but file attachments broke encryption. I built a hybrid interceptor that encrypted metadata fields into a secure header while streaming binary attachments cleanly in multipart FormData."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Attacker as Malicious Actor
    actor Stripe as Stripe Payment Gateway
    participant Gateway as API Gateway (Raw Buffer)
    participant HMAC as Crypto Verifier (HMAC-SHA256)
    participant Controller as Webhook Controller
    participant DB as PostgreSQL Database

    Note over Attacker,Gateway: Attack 1: Spoofed Webhook Attempt
    Attacker->>Gateway: POST /webhooks/stripe (Forged Payload & Fake Signature)
    Gateway->>HMAC: Validate (rawBody, headerSignature, secret)
    HMAC-->>Gateway: Signature Mismatch! ❌
    Gateway-->>Attacker: 400 Bad Request (Blocked immediately)

    Note over Stripe,DB: Legitimate Payment Webhook
    Stripe->>Gateway: POST /webhooks/stripe (Raw Buffer Payload + Stripe-Signature)
    Gateway->>Gateway: Capture req.rawBody as Immutable Buffer
    Gateway->>HMAC: stripe.webhooks.constructEvent(req.rawBody, sig, secret)
    HMAC-->>Gateway: Verified Valid Signature! ✅
    Gateway->>Controller: Process payment_intent.succeeded
    Controller->>DB: UPDATE orders SET status='PAID' WHERE stripe_id=...
    Controller-->>Stripe: 200 OK (Acknowledged)`,

    architectureContract: `// NestJS Raw Body Buffer Configuration for Cryptographic HMAC Verification
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  // Capture raw buffer specifically for webhooks
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
  
  // Standard JSON parser for all other REST routes
  app.use(express.json());
  await app.listen(3000);
}
bootstrap();`
  },

  // =========================================================================
  // 4. AUTHENTICATION & SESSION
  // =========================================================================
  {
    id: 4,
    topic: "Authentication & Session",
    primaryQuestion: "How do you design secure authentication and session management in modern full-stack applications?",
    backupQuestion: "Tell me about a time you handled token rotation and prevented infinite refresh loops.",
    bestExampleTitle: "Chrona: Two-Cookie Guard & Axios 401 Latch with Dynamic import()",
    backupExampleTitle: "Portfolio Platform: Token Refresh Retry Guard & Redis Blacklisting",

    primaryStar: {
      situation: "In Chrona, the authentication architecture experienced a build-time circular dependency: the `apiClient` imported `authStore` for tokens, and `authStore` imported `apiClient` to call login endpoints. Furthermore, expired tokens caused infinite 401 retry loops.",
      task: "Eliminate the circular dependency, protect against XSS token theft, and ensure seamless silent token refresh.",
      action: "1. Architected a two-cookie strategy: HttpOnly `refreshToken` stored in secure cookies (inaccessible to JavaScript, immune to XSS) and in-memory short-lived `accessToken` (15 mins).\n2. Broke the circular dependency in the Axios interceptor by using ECMAScript dynamic `import('./authStore')` at runtime inside the 401 handler rather than a top-level static import.\n3. Added an explicit `_retry` boolean flag on the request config and capped retries to exactly 1 attempt.\n4. If refresh fails, cleared user state and redirected to `/login`.",
      result: "Resolved build warnings, completely eliminated infinite refresh loops, and ensured token storage was resilient against XSS attacks.",
      spokenPitch: "In Chrona, our Axios interceptor had a circular dependency with our Zustand auth store, and token expiration occasionally triggered infinite retry storms. I restructured our auth into a two-cookie architecture: short-lived in-memory access tokens and an HttpOnly refresh cookie immune to XSS.\n\nTo break the circular dependency at build time, I dynamically imported the auth store inside the 401 interceptor only when an unauthorized error occurred. I added a strict single-retry latch so that if a refresh token failed, the app instantly cleared memory and redirected to login rather than looping. This provided rock-solid session security without circular imports."
    },

    backupStar: {
      situation: "In Portfolio Platform, when a user logged out, their JWT access token remained technically valid until expiration (stateless limitation).",
      task: "Implement instant token revocation without converting the entire database into a stateful bottleneck.",
      action: "Implemented a Redis token blacklist with TTL matching the remaining JWT lifetime. On logout, the token's unique `jti` claim was written to Redis via `SETEX token:jti <ttl> 'revoked'`. Middleware performed an $O(1)$ memory check.",
      result: "Instant token invalidation upon logout with sub-millisecond overhead.",
      spokenPitch: "In my Portfolio Platform, I solved stateless JWT revocation by storing revoked token IDs in Redis with an auto-expiring TTL matching the token's lifespan. This gave us instant logout revocation without hitting PostgreSQL."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Client as Browser (React App)
    participant Axios as Axios Interceptor
    participant Gateway as NestJS Auth Controller
    participant Redis as Redis Session Store
    participant DB as PostgreSQL (Users)

    Client->>Axios: User Login (email, password)
    Axios->>Gateway: POST /auth/login
    Gateway->>DB: Verify Argon2 Password Hash
    Gateway->>Redis: Store Refresh Token ID (Session)
    Gateway-->>Client: Set HttpOnly Cookie (refresh_token) + JSON { accessToken }
    
    Note over Client: 15 Minutes Pass (accessToken expires)
    Client->>Gateway: GET /api/sensitive-data (Expired Header)
    Gateway-->>Axios: 401 Unauthorized
    
    Note over Axios: Dynamic import('./authStore') breaks circular link!
    Axios->>Gateway: POST /auth/refresh (Sends HttpOnly Cookie)
    Gateway->>Redis: Validate Session Active?
    Redis-->>Gateway: Session Valid ✅
    Gateway-->>Axios: 200 OK { newAccessToken }
    Axios->>Gateway: Replay GET /api/sensitive-data (New Header)
    Gateway-->>Client: 200 OK Data Rendered!`,

    architectureContract: `// Dynamic Import to Break Circular Dependency in Axios 401 Interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Dynamic import breaks top-level circular reference between store and API
        const { useAuthStore } = await import('../stores/authStore');
        const newAccessToken = await useAuthStore.getState().refreshSession();
        originalRequest.headers['Authorization'] = \`Bearer \${newAccessToken}\`;
        return api(originalRequest);
      } catch (refreshErr) {
        const { useAuthStore } = await import('../stores/authStore');
        useAuthStore.getState().logout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);`
  },

  // =========================================================================
  // 5. PAYMENTS & WEBHOOKS
  // =========================================================================
  {
    id: 5,
    topic: "Payments & Webhooks",
    primaryQuestion: "How do you design a robust, idempotent payment and webhook integration?",
    backupQuestion: "What bug can happen when a payment return page loads before the webhook arrives?",
    bestExampleTitle: "Portfolio Platform: Stripe & Razorpay Raw-Buffer Webhook Verification",
    backupExampleTitle: "LesHub: Mollie Payment Return Page Polling vs Webhook Race Condition",

    primaryStar: {
      situation: "In my personal Portfolio Platform, users purchase consulting packages and digital templates through Stripe and Razorpay. Occasionally, network retries from Stripe caused duplicate webhook dispatches.",
      task: "Ensure zero duplicate order fulfillment, verify cryptographic signatures, and handle out-of-order webhook arrivals reliably.",
      action: "1. Implemented distributed idempotency locking in Redis using the payment provider's event ID (`event.id`):\n`const acquired = await redis.set(\`webhook:stripe:\${event.id}\`, 'processing', 'NX', 'EX', 300);`\nIf `acquired` was null, returned `200 OK` immediately to acknowledge Stripe without re-processing.\n2. Preserved raw request bytes before JSON parsing to calculate HMAC SHA-256 signatures accurately.\n3. Wrapped order updates, customer email notifications, and entitlement grants inside a single database transaction.\n4. Handled the UI return page: if user landed on `/checkout/success` before the webhook processed, the frontend polled order status with a 1-second exponential backoff rather than assuming payment failed.",
      result: "Processed payments with zero double-fulfillment incidents, 100% cryptographic verification, and smooth client UX even during network latency.",
      spokenPitch: "In my Portfolio Platform, I integrated Stripe and Razorpay with strict idempotency and cryptographic verification. Webhook providers guarantee at-least-once delivery, meaning duplicate events will occur.\n\nI solved this by using Redis distributed locks with the Stripe event ID as an atomic SET NX lock with a 5-minute TTL. If an event ID was already processing or completed, the server acknowledged 200 OK immediately and bypassed execution. I captured the raw request buffer for HMAC SHA-256 signature verification and wrapped all database updates in an atomic transaction.\n\nFor the frontend return page, I implemented polling with exponential backoff so if a user redirected before the webhook finished, the UI showed a brief processing spinner rather than a false error."
    },

    backupStar: {
      situation: "In LesHub, Dutch driving students paying via Mollie were redirected to `/payment-success` before Mollie's backend webhook arrived, displaying an erroneous 'Payment Unconfirmed' warning.",
      task: "Eliminate the race condition between the client redirect and the server webhook.",
      action: "Updated the payment return page to poll the order status endpoint with a 1.5-second interval up to 5 attempts, confirming status as soon as the webhook committed to the database.",
      result: "Eliminated false payment failure alarms and customer support inquiries.",
      spokenPitch: "In LesHub, students redirected from Mollie faster than the webhook reached our server. I added an optimistic polling mechanism on the return page that gracefully awaited the webhook status for up to 5 seconds before showing final confirmation."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Customer as Homeowner / Buyer
    participant Client as Next.js Checkout UI
    participant Stripe as Stripe Gateway
    participant Server as NestJS API Gateway
    participant Redis as Redis (Idempotency)
    participant DB as PostgreSQL (Orders)

    Customer->>Client: Clicks "Complete Payment" ($250)
    Client->>Stripe: Confirm Card Payment
    Stripe-->>Client: Payment Succeeded! Redirect to /success
    
    par Race Condition: Webhook vs Redirect
      Stripe->>Server: POST /webhooks/stripe (Event: evt_101)
      Server->>Redis: SET webhook:stripe:evt_101 "LOCK" NX EX 300
      Redis-->>Server: OK (Lock Acquired)
      Server->>DB: BEGIN TRANSACTION: Mark Order PAID & Grant Access
      DB-->>Server: Order Updated ✅
      Server-->>Stripe: 200 OK (Acknowledged)
    and User Lands on Return Page
      Customer->>Client: Loads /checkout/success?session_id=cs_101
      Client->>Server: GET /api/orders/cs_101/status
      Server-->>Client: Status: "PROCESSING" (Webhook in flight)
      Client->>Client: Show friendly spinner (1.5s delay)
      Client->>Server: GET /api/orders/cs_101/status (Retry 2)
      Server-->>Client: Status: "PAID" ✅
      Client-->>Customer: Display "Order Confirmed & Receipt Ready!"
    end`,

    architectureContract: `// Redis Idempotency Guard in Payment Webhook Controller
@Post('stripe')
async handleStripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
  const event = this.stripeService.constructEvent(req.rawBody, sig);
  
  // Atomic Redis lock: Prevents duplicate execution on webhook retries
  const lockKey = \`idempotency:stripe:\${event.id}\`;
  const acquired = await this.redis.set(lockKey, 'LOCKED', 'EX', 3600, 'NX');
  
  if (!acquired) {
    // Already processed or currently processing; acknowledge 200 OK
    return { received: true, duplicate: true };
  }

  await this.ordersService.processPaymentEvent(event);
  return { received: true };
}`
  },

  // =========================================================================
  // 6. FRONTEND STATE & CONCURRENCY
  // =========================================================================
  {
    id: 6,
    topic: "Frontend State & Concurrency",
    primaryQuestion: "How do you handle complex frontend state, optimistic updates, and concurrent user interactions?",
    backupQuestion: "Tell me about a time you implemented an optimistic UI update with rollback on failure.",
    bestExampleTitle: "LesHub: Lead Drag-and-Drop with Optimistic Update & AbortController",
    backupExampleTitle: "Chrona: Zustand Auth Store with Selective Atomic Subscriptions",

    primaryStar: {
      situation: "In LesHub, driving school administrators manage prospective student leads across a Kanban board (New, Contacted, Trial Lesson, Enrolled). Moving cards had noticeable 800ms network latency, and if a user dragged multiple cards rapidly or experienced connection drops, the board state became desynchronized.",
      task: "Create a fluid, instant drag-and-drop experience that updates the UI immediately while guaranteeing data consistency and rolling back cleanly on network failures.",
      action: "1. Implemented the Optimistic UI pattern: when a card is dropped, immediately snapshot current board state in React state.\n2. Updated local state instantaneously so the card snapped into the new column with 0ms visual delay.\n3. Dispatched the PUT request to `/api/leads/:id/status`.\n4. Integrated `AbortController` to cancel any prior in-flight status requests for that specific lead if dragged again rapidly.\n5. If the server responded with an error (e.g., 500 or validation rejection), caught the error, displayed a non-blocking toast, and rolled back local state to the saved snapshot.",
      result: "Perceived interaction latency dropped from 800ms to 0ms. Handled thousands of daily lead status updates with 100% state consistency and zero orphaned cards.",
      spokenPitch: "In LesHub, our Kanban lead board had noticeable 800ms API lag when dragging cards, and fast multi-card moves caused state desynchronization. I implemented the Optimistic UI pattern with automatic rollback.\n\nWhen a user drops a card, I immediately snapshot the previous state, cancel any in-flight requests for that lead using AbortController, and update the React state instantly. The user gets 0ms UI feedback. In the background, the API call executes. If the network drops or the server returns an error, the catch block restores the snapshot and shows a toast notification.\n\nThis gave our administrators a desktop-class snappy feel while ensuring our frontend state never diverged from the database."
    },

    backupStar: {
      situation: "In Chrona, updating user profile data caused the entire navigation bar, sidebar, and dashboard widgets to re-render unnecessarily, degrading 60fps scrolling performance.",
      task: "Optimize client state updates to prevent component re-render cascades.",
      action: "Migrated global state to Zustand, utilizing atomic selector subscriptions (`useAuthStore(state => state.user.avatarUrl)`) rather than broad object subscriptions, paired with `useShallow`.",
      result: "Eliminated 75% of redundant component re-renders across the dashboard.",
      spokenPitch: "In Chrona, I optimized global state by introducing Zustand with fine-grained atomic selectors. By subscribing components strictly to primitive fields rather than entire store objects, we eliminated unnecessary re-render cascades across the app."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Admin as School Admin (User)
    participant UI as Kanban Board Component
    participant State as Local React State
    participant Network as API Service (AbortController)
    participant Server as LesHub Backend API

    Admin->>UI: Drags Lead #42 from "Trial" to "Enrolled"
    UI->>State: Snapshot Previous State: { id: 42, col: 'Trial' }
    UI->>State: Optimistic Update: Set Lead #42 col = 'Enrolled' (0ms!)
    UI-->>Admin: Visual Card Moves Instantly (Fluid 60 FPS)

    UI->>Network: PUT /api/leads/42/status { col: 'Enrolled' } (signal)
    
    alt Network Success
      Server-->>Network: 200 OK { success: true }
      Network-->>UI: Confirm update (Commit state)
    else Network Failure / 500 Error
      Server-->>Network: 500 Server Error / Timeout
      Network-->>UI: Request Failed! ❌
      UI->>State: Rollback to Snapshot: Reset Lead #42 col = 'Trial'
      UI-->>Admin: Show Toast: "Could not update lead. Restored previous position."
    end`,

    architectureContract: `// Optimistic Update with Snapshot Rollback and AbortController
const handleDragEnd = async (leadId, newStatus) => {
  const previousLeads = [...leads];
  
  // 1. Snapshot and Optimistically update local state immediately
  setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  
  // 2. Abort prior in-flight requests for this entity
  abortControllers.current[leadId]?.abort();
  const controller = new AbortController();
  abortControllers.current[leadId] = controller;

  try {
    await api.put(\`/api/leads/\${leadId}/status\`, { status: newStatus }, {
      signal: controller.signal
    });
  } catch (err) {
    if (err.name !== 'CanceledError') {
      // 3. Rollback on failure
      setLeads(previousLeads);
      toast.error('Failed to update lead status. Restored previous position.');
    }
  }
};`
  },

  // =========================================================================
  // 7. THIRD-PARTY UI COMPONENTS
  // =========================================================================
  {
    id: 7,
    topic: "Third-party UI Components",
    primaryQuestion: "How do you customize and integrate complex third-party UI libraries without breaking their internal behavior?",
    backupQuestion: "Tell me about a time you solved an accessibility or styling issue in a complex component library.",
    bestExampleTitle: "LesHub: KendoReact Scheduler Customization & WCAG Luminance Contrast",
    backupExampleTitle: "Portfolio Platform: TipTap Rich-Text Blog Editor with Custom Extensions",

    primaryStar: {
      situation: "In LesHub, we integrated the commercial KendoReact Scheduler for driving school lesson bookings. Instructors customized their event colors (e.g., bright yellow, deep navy, dark maroon). However, the default white text became completely illegible on light backgrounds, failing WCAG 2.1 accessibility standards. Furthermore, overriding CSS styles broke Kendo's internal absolute positioning coordinates.",
      task: "Customize the event rendering to guarantee high-contrast text readability across any arbitrary hex color while strictly preserving Kendo's internal layout calculations.",
      action: "1. Avoided fragile global CSS overrides that broke Kendo's internal DOM structure.\n2. Implemented a custom event slot component passed to Kendo's `item` slot prop.\n3. Preserved Kendo's injected style object (containing `top`, `left`, `width`, `height`) and spread it cleanly onto the root container: `<div {...props} style={{ ...props.style, backgroundColor: hexColor }}>`.\n4. Wrote an inline WCAG luminance algorithm: converted hex to RGB, calculated relative luminance (`0.299*R + 0.587*G + 0.114*B`), and conditionally applied `#000000` (black) if luminance > 128, and `#ffffff` (white) otherwise.",
      result: "Achieved 100% WCAG AA contrast compliance across all dynamic instructor colors without breaking calendar event geometry or drag-resize handlers.",
      spokenPitch: "In LesHub, we customized the KendoReact Scheduler for driving lessons. Instructors could choose custom event colors, but default white text became unreadable on light backgrounds like yellow or pastel green, violating WCAG accessibility. Also, CSS overrides risked breaking Kendo's absolute layout positioning.\n\nI created a custom event component using Kendo's slot API, ensuring we spread their internal positioning styles intact while injecting our custom content. Inside the component, I implemented the standard WCAG luminance algorithm, calculating perceived brightness from the background hex and dynamically setting the text to black or white based on a 128 threshold.\n\nThis guaranteed 100% readable, accessible text across any arbitrary color without disrupting Kendo's internal coordinate engine."
    },

    backupStar: {
      situation: "In Portfolio Platform, integrating the TipTap headless rich-text editor required custom code blocks with syntax highlighting without bloating bundle size.",
      task: "Create lightweight code blocks with copy-to-clipboard functionality inside the editor.",
      action: "Built a custom TipTap Node View in React using lowlight (Prism subset), ensuring code highlighting executed only on mounted nodes without running heavy regexes on every keystroke.",
      result: "Delivered responsive rich-text editing with full syntax highlighting at 60fps.",
      spokenPitch: "In my Portfolio Platform, I extended TipTap with a custom React NodeView for code blocks, decoupling syntax highlighting from the input loop to maintain smooth typing performance."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Instructor as Instructor / Admin
    participant Kendo as KendoReact Scheduler
    participant Slot as Custom Event Slot Component
    participant LumCalc as WCAG Luminance Engine
    participant DOM as Rendered Event DOM

    Instructor->>Kendo: Sets Event Color: #FFFF00 (Bright Yellow)
    Kendo->>Kendo: Calculates Grid Slot Geometry (top: 120px, height: 45px)
    Kendo->>Slot: Calls EventSlot({ props, dataItem })
    Note over Slot: CRITICAL: Preserve props.style (Positioning!)
    Slot->>LumCalc: calculateContrastColor("#FFFF00")
    LumCalc->>LumCalc: (0.299*255 + 0.587*255 + 0.114*0) = 225.9 (> 128)
    LumCalc-->>Slot: Return "#000000" (High-Contrast Black Text)
    Slot->>DOM: Render <div style={props.style, bg: '#FFFF00', color: '#000000'}>
    DOM-->>Instructor: Displays 100% Legible WCAG AA Compliant Event!`,

    architectureContract: `// WCAG 2.1 Luminance Contrast Formula for Dynamic Event Text
export function getContrastTextColor(hexColor: string): '#000000' | '#ffffff' {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Perceived luminance formula (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

// Custom Kendo Event Component Preserving Coordinates
export const CustomSchedulerItem = (props: any) => {
  const bgColor = props.dataItem.color || '#38bdf8';
  const textColor = getContrastTextColor(bgColor);

  return (
    <div
      {...props}
      style={{
        ...props.style, // CRITICAL: Preserves Kendo's top, left, width, height!
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '4px',
        padding: '2px 6px',
        fontWeight: 600
      }}
    >
      <span>{props.dataItem.title}</span>
    </div>
  );
};`
  },

  // =========================================================================
  // 8. DATABASE & STORED PROCEDURES
  // =========================================================================
  {
    id: 8,
    topic: "Database & Stored Procedures",
    primaryQuestion: "Tell me about a complex database problem you solved involving transactions, stored procedures, or race conditions.",
    backupQuestion: "How do you ensure data integrity under concurrent database writes?",
    bestExampleTitle: "LesHub: Invoice-Number Procedure Collision Fix (LESHUB-558) with Row Locking",
    backupExampleTitle: "Chrona: JSON_TABLE Batch Upsert inside TypeORM QueryRunner Transaction",

    primaryStar: {
      situation: "In LesHub, each driving school tenant required sequential, gapless invoice numbers (e.g. `INV-2024-001`). During end-of-month billing, when multiple admins generated invoices simultaneously, the system threw database unique-constraint collisions (`ER_DUP_ENTRY`) and crashed.",
      task: "Eliminate race conditions in invoice numbering and prevent deadlocks while guaranteeing strict sequential numbering per tenant.",
      action: "1. Analyzed the legacy stored procedure and found it used `SELECT MAX(num) + 1 FROM invoices WHERE tenant_id = ?` without row locks. Two concurrent transactions read the same `MAX()` before either committed.\n2. Redesigned the schema: created a dedicated `tenant_sequences` table with `(tenant_id, sequence_type, current_val)`.\n3. Updated the stored procedure to utilize row-level locking: `SELECT current_val FROM tenant_sequences WHERE tenant_id = ? AND sequence_type = 'INVOICE' FOR UPDATE;`.\n4. This serialized concurrent requests at the row level while allowing other tenants to generate invoices in parallel without blocking.\n5. Incremented the sequence, returned the formatted number, and committed inside an atomic transaction.",
      result: "Zero duplicate invoice number collisions across 25+ tenants, completely eliminating end-of-month billing 500 errors and ensuring legal audit compliance.",
      spokenPitch: "In LesHub, we hit a severe bug during month-end invoicing: concurrent admins generated duplicate invoice numbers, triggering 500 errors. The legacy procedure was querying `SELECT MAX(num) + 1` without locking, allowing concurrent threads to read the same value.\n\nI redesigned the numbering engine by creating a dedicated tenant sequences table and rewriting the procedure with row-level locking using `SELECT ... FOR UPDATE`. This serialized access for that specific tenant while letting other tenants generate invoices concurrently without contention. We eliminated all unique constraint collisions and ensured gapless sequential compliance."
    },

    backupStar: {
      situation: "In Chrona, bulk employee timesheet submission involved updating 15 relational tables (pay rates, overtime balances, shift allowances). If a network failure happened midway, partial data corrupted payroll balances.",
      task: "Ensure complete all-or-nothing atomicity for bulk timesheet operations.",
      action: "Wrapped the entire operation inside an explicit TypeORM `QueryRunner` transaction (`await queryRunner.startTransaction()`), rolling back cleanly on any error.",
      result: "100% ACID compliance and zero corrupt payroll states.",
      spokenPitch: "In Chrona, I ensured payroll data integrity by wrapping multi-table timesheet updates inside an explicit TypeORM QueryRunner transaction with try-catch rollback guarantees."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Admin1 as Admin A (Tenant 5)
    actor Admin2 as Admin B (Tenant 5)
    participant API as Invoicing Service
    participant DB as MySQL Database (tenant_sequences)
    participant Inv as invoices Table

    Note over Admin1,Admin2: Concurrent Month-End Invoice Generation
    Admin1->>API: Generate Invoice (Tenant 5)
    Admin2->>API: Generate Invoice (Tenant 5)

    API->>DB: Admin A: BEGIN TRANSACTION
    API->>DB: Admin A: SELECT current_val FROM tenant_sequences WHERE tenant_id=5 FOR UPDATE
    Note over DB: ROW LOCKED for Tenant 5! 🔒
    
    API->>DB: Admin B: BEGIN TRANSACTION
    API->>DB: Admin B: SELECT current_val ... FOR UPDATE (WAITS for Lock ⏳)

    DB-->>API: Admin A reads: current_val = 100
    API->>DB: Admin A: UPDATE tenant_sequences SET current_val = 101
    API->>Inv: Admin A: INSERT INTO invoices (invoice_number="INV-2024-101")
    API->>DB: Admin A: COMMIT (Lock Released! 🔓)

    Note over DB: Admin B acquires lock immediately!
    DB-->>API: Admin B reads: current_val = 101 (Updated value!)
    API->>DB: Admin B: UPDATE tenant_sequences SET current_val = 102
    API->>Inv: Admin B: INSERT INTO invoices (invoice_number="INV-2024-102")
    API->>DB: Admin B: COMMIT
    Note over Admin1,Admin2: Both Invoices Generated Sequentially with ZERO Collision! ✅`,

    architectureContract: `// MySQL Stored Procedure with Row-Level Locking (LESHUB-558)
DELIMITER //
CREATE PROCEDURE GetNextInvoiceNumber(
  IN p_tenant_id INT,
  OUT p_invoice_number VARCHAR(50)
)
BEGIN
  DECLARE v_next_val INT;
  DECLARE v_prefix VARCHAR(10);
  
  -- 1. Acquire Row Lock on the specific tenant's sequence counter
  SELECT current_val + 1, prefix INTO v_next_val, v_prefix
  FROM tenant_sequences
  WHERE tenant_id = p_tenant_id AND sequence_type = 'INVOICE'
  FOR UPDATE;
  
  -- 2. Increment sequence value
  UPDATE tenant_sequences
  SET current_val = v_next_val, updated_at = NOW()
  WHERE tenant_id = p_tenant_id AND sequence_type = 'INVOICE';
  
  -- 3. Return formatted sequence (e.g. INV-2024-00101)
  SET p_invoice_number = CONCAT(v_prefix, '-', YEAR(CURDATE()), '-', LPAD(v_next_val, 5, '0'));
END //
DELIMITER ;`
  },

  // =========================================================================
  // 9. TESTING & QUALITY
  // =========================================================================
  {
    id: 9,
    topic: "Testing & Quality",
    primaryQuestion: "How do you test critical asynchronous operations and prevent unhandled promise rejections?",
    backupQuestion: "Tell me about your automated testing strategy across unit, integration, and E2E tests.",
    bestExampleTitle: "Chrona: Vitest Promise.all Unhandled Rejection Fix with allSettled",
    backupExampleTitle: "LesHub: Rating-Scale Numeric-Input Regression Test Suite",

    primaryStar: {
      situation: "In Chrona's automated test suite, concurrent integration tests executing multi-tenant timesheet calculations were randomly failing in Vitest with cryptic `UnhandledPromiseRejection` errors, intermittently crashing the CI/CD pipeline.",
      task: "Identify why promises were leaking unhandled rejections and establish reliable async test execution.",
      action: "1. Traced the test runner and discovered the test suite was running batch verifications using `await Promise.all(items.map(async item => ...))`.\n2. In `Promise.all`, if one promise rejects, the entire aggregate rejects immediately, leaving other in-flight promises running in the background. When those background promises subsequently failed or threw assertions, their rejections were unhandled because the test had already terminated.\n3. Refactored the test batch runner to use `Promise.allSettled()`, ensuring all promises run to completion before inspecting results.\n4. Isolated database connections using transactional rollbacks (`beforeEach` start transaction, `afterEach` rollback) so tests never left residual data in the database.",
      result: "Eliminated CI flaky test failures, restored 100% deterministic test passes, and reduced test suite execution time by 35%.",
      spokenPitch: "In Chrona's CI pipeline, integration tests were intermittently crashing with unhandled promise rejections. I dug into the test harness and found we were executing concurrent batch assertions with Promise.all. When one assertion failed, Promise.all rejected immediately, but pending sibling promises continued running and threw unhandled rejections after the test finished.\n\nI replaced Promise.all with Promise.allSettled to guarantee every asynchronous operation resolved before assertions were evaluated, and wrapped each test in an auto-rolling database transaction. This made our test suite 100% deterministic and cut CI run time by 35%."
    },

    backupStar: {
      situation: "In LesHub, an edge-case bug where numeric inputs string-concatenated (`15 + 5 = 155`) needed permanent prevention across the application.",
      task: "Build automated unit and component tests to catch string-number coercion before release.",
      action: "Wrote Vitest + React Testing Library tests using `@testing-library/user-event` that typed numbers into fields and asserted strict numerical type evaluation and maximum boundary enforcement.",
      result: "Zero regression bugs on numeric calculations across all subsequent releases.",
      spokenPitch: "In LesHub, after fixing a string-number concatenation bug, I added automated component tests using React Testing Library to simulate real user typing and enforce strict numeric type parsing."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor CI as CI/CD Pipeline (Vitest Runner)
    participant Suite as Test Suite
    participant Worker1 as Async Worker 1 (Pass)
    participant Worker2 as Async Worker 2 (Fail)
    participant Worker3 as Async Worker 3 (Slow)

    Note over Suite,Worker3: Legacy Flaw: Promise.all Fail-Fast
    Suite->>Worker1: Execute Task 1
    Suite->>Worker2: Execute Task 2 (Throws Error!)
    Suite->>Worker3: Execute Task 3 (In-Flight...)
    Worker2-->>Suite: Rejects Error ❌
    Suite-->>CI: Test Exits Early (Fail)
    Worker3-->>CI: Resolves/Rejects after exit -> UNHANDLED REJECTION CRASH! 💥

    Note over Suite,Worker3: Solution: Promise.allSettled Determinism
    Suite->>Worker1: Execute Task 1
    Suite->>Worker2: Execute Task 2
    Suite->>Worker3: Execute Task 3
    Worker1-->>Suite: { status: 'fulfilled', value: ... }
    Worker2-->>Suite: { status: 'rejected', reason: ... }
    Worker3-->>Suite: { status: 'fulfilled', value: ... }
    Note over Suite: All workers complete cleanly before evaluation!
    Suite-->>CI: Structured Failure Report without Runner Crashes ✅`,

    architectureContract: `// Robust Batch Test Harness with Promise.allSettled & Rollback
describe('Bulk Timesheet Processing', () => {
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Clean state per test
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction(); // Zero residual test data
    await queryRunner.release();
  });

  it('evaluates all concurrent employee updates deterministically', async () => {
    const tasks = employeeIds.map(id => service.calculatePay(id, queryRunner));
    
    // Promise.allSettled prevents unhandled rejection leaks
    const results = await Promise.allSettled(tasks);
    
    const failures = results.filter(r => r.status === 'rejected');
    expect(failures).toHaveLength(0);
  });
});`
  },

  // =========================================================================
  // 10. BUILD & TOOLING
  // =========================================================================
  {
    id: 10,
    topic: "Build & Tooling",
    primaryQuestion: "Tell me about a difficult build, deployment, or tooling issue you diagnosed and fixed.",
    backupQuestion: "How do you optimize modern frontend build times and monorepo packaging?",
    bestExampleTitle: "Chrona: Next.js Standalone Build on Windows (MAX_PATH Limit Fix)",
    backupExampleTitle: "Portfolio Platform: Turborepo Multi-App Monorepo Pipeline",

    primaryStar: {
      situation: "In Chrona, when configuring Next.js standalone output mode (`output: 'standalone'`) for containerized Docker deployments, developers on Windows workstations experienced silent build failures and `ENOENT: path too long` errors during `next build`.",
      task: "Diagnose why Next.js standalone file tracing failed on Windows and fix the build pipeline for both local Windows developers and Linux CI/CD runners.",
      action: "1. Investigated the error stack and identified that Next.js standalone mode traces `node_modules` dependencies recursively. With deeply nested package dependencies, paths exceeded the Windows 260-character `MAX_PATH` limit.\n2. Enabled Windows Registry LongPaths (`LongPathsEnabled = 1`) and Git longpaths config (`git config --system core.longpaths true`).\n3. Optimized `next.config.js` with `outputFileTracingRoot` to prevent the file tracer from traversing above the monorepo workspace directory.\n4. Added a `pnpm-lock.yaml` deduplication step to flatten nested dependency trees.",
      result: "Builds executed cleanly on Windows developer machines without errors, Docker images were reduced in size by 65% using standalone output, and build time dropped by 20%.",
      spokenPitch: "In Chrona, when enabling Next.js standalone output mode for Docker packaging, developers on Windows machines hit silent build failures due to the legacy 260-character MAX_PATH limit as Next.js traced nested dependencies. I resolved this by enabling Git and OS longpaths, configuring outputFileTracingRoot in Next.js to restrict tracing scope, and flattening dependencies with pnpm. This allowed clean local Windows builds and cut our production Docker image sizes by 65%."
    },

    backupStar: {
      situation: "In Portfolio Platform, maintaining three separate repositories for the public site, admin dashboard, and NestJS API led to duplicated shared types and painful synchronization.",
      task: "Unify the codebase into a clean, cached monorepo architecture.",
      action: "Migrated to Turborepo with shared packages (`@workspace/types`, `@workspace/ui`, `@workspace/eslint`), configuring pipeline dependency caching (`turbo.json`) so unchanged packages skip rebuilds.",
      result: "Reduced CI build times from 7 minutes to 90 seconds through Turbo remote caching.",
      spokenPitch: "In my Portfolio Platform, I consolidated three separate repos into a Turborepo monorepo with shared TypeScript contracts. By configuring intelligent task caching in turbo.json, CI build times dropped from 7 minutes to 90 seconds."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Dev as Developer (Windows Workstation)
    participant Next as Next.js Build Engine (next build)
    participant Tracer as Standalone NFT File Tracer
    participant OS as Windows File System (NTFS)
    participant Docker as Production Docker Image

    Dev->>Next: Runs "next build" (output: 'standalone')
    Next->>Tracer: Trace dependencies in node_modules
    Tracer->>OS: Read deeply nested path (length: 285 chars)
    Note over OS: Legacy MAX_PATH (260 Char Limit) -> ENOENT Crash! ❌

    Note over Dev,OS: FIX: Enable longpaths + outputFileTracingRoot
    Dev->>OS: git config core.longpaths true & Registry Fix
    Next->>Tracer: Configured outputFileTracingRoot = path.join(__dirname, '../../')
    Tracer->>OS: Reads flattened dependencies cleanly ✅
    Next->>Docker: Emits minimal .next/standalone folder
    Docker-->>Dev: Lightweight 150MB Container Ready (Down from 600MB!) 🚀`,

    architectureContract: `// next.config.js Standalone Optimization
const path = require('path');

module.exports = {
  output: 'standalone',
  experimental: {
    // Restricts dependency tracing to project workspace root
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    return config;
  }
};`
  },

  // =========================================================================
  // 11. MULTI-TENANT ARCHITECTURE
  // =========================================================================
  {
    id: 11,
    topic: "Multi-Tenant Architecture",
    primaryQuestion: "How do you guarantee strict data isolation and prevent cross-tenant data leaks in SaaS applications?",
    backupQuestion: "Tell me about designing a multi-tenant platform with custom branding and routing.",
    bestExampleTitle: "LesHub: Multi-Tenant Query Scoping (WHERE tenant_id = ?) & 404 Security Cloaking",
    backupExampleTitle: "LesHub: Dynamic Tenant-Specific PWA Manifest Generation with Blob Cleanup",

    primaryStar: {
      situation: "In LesHub, 25+ independent driving school businesses operate on a single shared database. A critical security requirement was ensuring zero data leakage between schools, so an instructor from School A could never view students, prices, or schedules from School B, even if manipulating URL IDs.",
      task: "Architect multi-tenant data isolation at the middleware and query level, and prevent ID enumeration security probing.",
      action: "1. Implemented a Tenant Resolution Middleware that extracted tenant identity from the request subdomain (e.g. `school-a.leshub.com`) or verified JWT claim.\n2. Built an automated query scoping layer: every database query was forced to include `WHERE tenant_id = :tenantId` using TypeORM/Express middleware interceptors.\n3. Implemented 404 Security Cloaking: if a user attempted to access an ID belonging to another tenant (e.g., `/api/students/999` where student 999 belongs to Tenant B), the API returned a generic `404 Not Found` rather than a `403 Forbidden` to prevent malicious tenant ID enumeration.",
      result: "Zero cross-tenant security breaches, passed external penetration testing, and guaranteed tenant isolation across all CRM and billing workflows.",
      spokenPitch: "In LesHub, we host multiple driving schools on a shared infrastructure. To guarantee absolute data isolation, I implemented a tenant resolution middleware that extracts the tenant ID from the subdomain or verified JWT. Every database query is scoped with WHERE tenant_id = ?, preventing cross-tenant leakage at the query planner level.\n\nCrucially, I instituted 404 security cloaking: if an authenticated user attempts to access an ID belonging to another tenant, the system returns a 404 Not Found instead of a 403 Forbidden. This prevents attackers from enumerating valid IDs across tenants. In multi-tenant systems, security is about both data scoping and information cloaking."
    },

    backupStar: {
      situation: "In LesHub, each driving school needed students to install their specific school app on mobile with their school's icon, name, and splash screen, but PWAs typically require a static `manifest.json`.",
      task: "Deliver dynamically generated, tenant-branded PWA manifests from a single codebase.",
      action: "Built an Express API route `/api/manifest` that resolved tenant settings from the database and served a dynamic JSON manifest with custom icons, theme colors, and titles, automatically cleaning up Blob URLs.",
      result: "Allowed 25+ schools to have distinct, branded mobile PWA app installations from one codebase.",
      spokenPitch: "In LesHub, I created dynamic PWA manifests via an API route that resolves the tenant from the hostname and streams customized app icons and theme colors, allowing multi-tenant white-label mobile installations."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Attacker as Attacker (Logged into Tenant 2)
    participant Gateway as Express Gateway (Tenant Middleware)
    participant DB as MySQL Multi-Tenant DB

    Attacker->>Gateway: GET /api/students/845 (Student 845 belongs to Tenant 1!)
    Gateway->>Gateway: Extract Tenant from JWT: tenant_id = 2
    Gateway->>DB: SELECT * FROM students WHERE id = 845 AND tenant_id = 2;
    DB-->>Gateway: Empty Result Set (Zero Rows)
    
    Note over Gateway: Security Cloaking: Do NOT return 403 (reveals existence!)
    Gateway-->>Attacker: 404 Not Found ("Student does not exist")
    Note over Attacker: Attacker cannot enumerate other tenants' valid IDs! ✅`,

    architectureContract: `// Multi-Tenant Middleware Scoping & Security Cloaking
export const tenantContextMiddleware = async (req, res, next) => {
  const host = req.headers.host; // e.g. "amsterdam-rijschool.leshub.com"
  const subdomain = host.split('.')[0];
  
  const tenant = await db.query('SELECT id, status FROM tenants WHERE subdomain = ?', [subdomain]);
  if (!tenant || tenant.status !== 'ACTIVE') {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  
  // Attach scoped tenantId to request context
  req.tenantId = tenant.id;
  next();
};

// Repository Scoping Example
export async function getStudentById(studentId: number, tenantId: number) {
  // Always bind tenantId to enforce isolation
  const student = await db.query(
    'SELECT * FROM students WHERE id = ? AND tenant_id = ?',
    [studentId, tenantId]
  );
  if (!student) {
    // 404 Cloaking: Never return 403 Forbidden for cross-tenant ID probes
    throw new NotFoundException('Resource not found');
  }
  return student;
}`
  },

  // =========================================================================
  // 12. EDGE CASES & DATA INTEGRITY
  // =========================================================================
  {
    id: 12,
    topic: "Edge Cases & Data Integrity",
    primaryQuestion: "Tell me about a difficult edge case you discovered and how you safeguarded data integrity.",
    backupQuestion: "How do you handle complex calendar, timezone, or financial date-boundary calculations?",
    bestExampleTitle: "Chrona: Midnight Shift Day-Boundary Calculation & Wage Duplicate Check (DOTS-50)",
    backupExampleTitle: "LesHub: Quote-to-Invoice Expiry Date Preservation Across Accounts",

    primaryStar: {
      situation: "In Chrona, night-shift hospital staff work shifts crossing midnight (e.g. 22:00 Friday to 06:00 Saturday). The legacy system calculated duration by subtracting start time from end time on the start date, resulting in negative hours (`-16` hours) or crediting the entire shift to Friday, triggering incorrect weekend overtime pay rates.",
      task: "Accurately slice midnight-crossing shifts into their respective calendar days, apply appropriate weekday vs weekend overtime pay multipliers, and prevent duplicate shift claims.",
      action: "1. Developed a timezone-normalized shift parser using UTC timestamps.\n2. Detected when `endTime <= startTime` and split the shift into two contiguous segments: Segment A (22:00 to 23:59:59 on Day 1) and Segment B (00:00 to 06:00 on Day 2).\n3. Applied Sunday premium rates only to the Sunday hours.\n4. Implemented a composite unique index in MySQL on `(employee_id, shift_date, shift_start_minute)` to prevent duplicate shift submissions.",
      result: "100% payroll calculation accuracy for midnight shifts across 3,000+ hospital staff with zero overtime audit discrepancies.",
      spokenPitch: "In Chrona, hospital workers on overnight shifts (like 10 PM to 6 AM) were getting calculated as negative hours or credited completely to the wrong day, causing payroll overtime errors. I resolved this by building an algorithm that detects shifts crossing midnight, cleanly bifurcating them into two contiguous calendar segments at 00:00, and applying weekday versus weekend premium rates accurately to each half. I added composite database constraints to prevent duplicate shift submissions. Handling edge cases cleanly is the difference between buggy software and dependable enterprise systems."
    },

    backupStar: {
      situation: "In LesHub, converting a quote to an invoice erroneously updated the quote's original expiration date, violating accounting audit rules.",
      task: "Preserve immutable quote history during invoice generation.",
      action: "Decoupled quote and invoice schemas, creating a dedicated `invoice_items` snapshot table that copied line items and locked the quote status to `CONVERTED` without altering historical quote dates.",
      result: "Guaranteed historical financial audit compliance.",
      spokenPitch: "In LesHub, converting quotes to invoices was mutating original quote dates. I decoupled the schemas and created snapshot tables so invoice creation never altered historical quote records."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Nurse as Night Nurse (Shift: Fri 22:00 - Sat 06:00)
    participant UI as Chrona Mobile App
    participant Parser as Midnight Shift Boundary Parser
    participant Payroll as Wage Calculation Engine
    participant DB as MySQL Database

    Nurse->>UI: Submits Shift: Fri 22:00 to Sat 06:00 (8 Hours)
    UI->>Parser: POST /api/shifts (Start: 22:00, End: 06:00)
    Note over Parser: Evaluates: End Time (06:00) < Start Time (22:00)
    Note over Parser: CROSSES MIDNIGHT! Split into 2 Slices:
    
    Parser->>Payroll: Slice 1: Friday 22:00 - 24:00 (2 hrs @ Standard Friday Rate)
    Parser->>Payroll: Slice 2: Saturday 00:00 - 06:00 (6 hrs @ Weekend Overtime Rate!)
    
    Payroll->>DB: Atomic INSERT: 2 Linked Shift Slices with Foreign Keys
    DB-->>Payroll: Records Stored Successfully
    Payroll-->>UI: 200 OK: Exact Pay Breakdown Rendered! ✅`,

    architectureContract: `// Midnight Shift Split Algorithm for Accurate Pay Rates
export function splitMidnightShift(startTime: string, endTime: string, dateStr: string) {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (endMinutes > startMinutes) {
    // Normal single-day shift
    return [{ date: dateStr, durationHours: (endMinutes - startMinutes) / 60, isOvernight: false }];
  }

  // Crosses midnight! Split at 24:00 (1440 minutes)
  const slice1Hours = (1440 - startMinutes) / 60;
  const slice2Hours = endMinutes / 60;
  
  const nextDay = addDays(parseISO(dateStr), 1);
  const nextDateStr = format(nextDay, 'yyyy-MM-dd');

  return [
    { date: dateStr, durationHours: slice1Hours, rateTier: 'STANDARD' },
    { date: nextDateStr, durationHours: slice2Hours, rateTier: 'WEEKEND_PREMIUM' }
  ];
}`
  },

  // =========================================================================
  // 13. INTERNATIONALISATION & CURRENCY
  // =========================================================================
  {
    id: 13,
    topic: "Internationalisation & Currency",
    primaryQuestion: "How do you handle currency formatting, locale-specific numbers, and timezone consistency in enterprise software?",
    backupQuestion: "Tell me about designing a system for international locales like the Netherlands.",
    bestExampleTitle: "LesHub: Dutch nl-NL Intl Formatting (€ 1.234,50 Comma/Dot) and Currency Math",
    backupExampleTitle: "Chrona: date-fns Timezone Normalization Across Global Offices",

    primaryStar: {
      situation: "In LesHub, Dutch driving schools manage tuition payments in Euros. In the Netherlands (`nl-NL`), numbers use a dot for thousands and a comma for decimals (`€ 1.234,50`), the exact reverse of US English (`$1,234.50`). Naive JavaScript string parsing and floating-point math caused input parsing errors and rounding discrepancies in invoice totals.",
      task: "Implement robust Dutch currency and date localization on the frontend while storing exact integer cents in the backend database.",
      action: "1. Architected an exact currency pipeline: all database and API balances are stored as integer euro cents (e.g., `123450` cents = `€ 1.234,50`).\n2. Built custom React currency input formatters using the native `Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })` API.\n3. Implemented a bidirectional parser: when users typed in Dutch format with commas, normalized commas into standard decimal points before converting to cents for API requests.\n4. Formatted Dutch dates (`dd-MM-yyyy`) consistently using `date-fns` with `nl` locale.",
      result: "100% accurate financial invoicing for Dutch schools, zero decimal rounding discrepancies, and seamless Dutch cultural UX.",
      spokenPitch: "In LesHub, we served driving schools in the Netherlands where currency uses commas for decimals and dots for thousands—€ 1.234,50. If you do naive string parsing or floating-point math, you get calculation errors. I designed a currency pipeline where the database stores strictly integer euro cents, eliminating floating-point errors entirely. On the frontend, I used Intl.NumberFormat with the nl-NL locale for display, and wrote a robust parser to convert Dutch comma inputs into clean integer cents for the API. In financial software, you never store floating-point numbers."
    },

    backupStar: {
      situation: "In Chrona, teams across different timezones viewed timesheet submissions with shifted days due to local browser timezone conversions.",
      task: "Ensure timesheet dates remain fixed to the worker's physical work location regardless of where the manager views it from.",
      action: "Stored all shift dates as ISO date strings (`YYYY-MM-DD`) and used `date-fns-tz` with explicit workplace timezone contexts rather than relying on browser-local `new Date()`.",
      result: "Eliminated date-shifting bugs across global managers.",
      spokenPitch: "In Chrona, I prevented timezone drift on shift logs by storing dates as pure ISO calendar strings and evaluating all time comparisons in the employee's explicit workplace timezone."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Admin as Dutch Admin (Netherlands)
    participant Input as Currency Input Component
    participant Parser as Bi-directional nl-NL Parser
    participant API as Invoicing Backend API
    participant DB as MySQL DB (Integer Cents)

    Admin->>Input: Enters Lesson Price: "1.250,50" (€)
    Input->>Parser: Input Change Event
    Parser->>Parser: Strip dots -> Replace comma with dot -> Parse to float: 1250.50
    Parser->>Parser: Multiply by 100 -> Math.round: 125050 Cents!
    Parser->>API: POST /api/invoices { amountCents: 125050 }
    API->>DB: INSERT INTO invoice_items (amount_cents = 125050)
    Note over DB: ZERO Floating Point Inaccuracies!
    
    DB-->>API: 125050 Cents
    API-->>Input: Response { amountCents: 125050 }
    Input->>Input: Intl.NumberFormat('nl-NL', { currency: 'EUR' }).format(1250.50)
    Input-->>Admin: Displays "€ 1.250,50" (Authentic Dutch Formatting!) ✅`,

    architectureContract: `// Dutch (nl-NL) Currency Formatting and Integer Cent Pipeline
export const formatDutchCurrency = (cents: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(cents / 100);
};

export const parseDutchCurrencyToCents = (inputStr: string): number => {
  // Converts "1.250,50" -> "1250.50" -> 125050 cents
  const cleanStr = inputStr
    .replace(/[^0-9,-]/g, '')   // Strip currency symbols and thousand dots
    .replace(',', '.');          // Convert Dutch decimal comma to dot
  const euros = parseFloat(cleanStr);
  return isNaN(euros) ? 0 : Math.round(euros * 100);
};`
  },

  // =========================================================================
  // 14. AI & REAL-TIME STREAMING
  // =========================================================================
  {
    id: 14,
    topic: "AI & Real-time Streaming",
    primaryQuestion: "How do you build real-time streaming architectures with LLMs and AI assistants?",
    backupQuestion: "Tell me about implementing Server-Sent Events (SSE) vs WebSockets.",
    bestExampleTitle: "Portfolio Platform: Groq LLaMA 3.3 70B Assistant with Server-Sent Events (SSE)",
    backupExampleTitle: "Portfolio Platform: 15-Minute Prompt Context In-Memory Sliding Window Caching",

    primaryStar: {
      situation: "In my personal Portfolio Platform, I wanted visitors to interact with an AI assistant that could answer questions about my engineering projects, architecture decisions, and availability. Standard REST API calls had a 3-second delay waiting for the full LLM response, making the UI feel frozen.",
      task: "Implement a low-latency, real-time token-by-token streaming response that renders instantly, with automatic reconnection and prompt context management.",
      action: "1. Evaluated WebSockets vs Server-Sent Events (SSE). Chose SSE because LLM streaming is strictly unidirectional (server $\to$ client), and SSE operates over standard HTTP with native browser `EventSource` reconnection and HTTP/2 multiplexing.\n2. In NestJS, integrated the Groq API running LLaMA 3.3 70B with streaming enabled, emitting an RxJS `Observable` of `MessageEvent` tokens.\n3. On the React frontend, created a custom hook `useStreamResponse` using `fetch` with `ReadableStreamDefaultReader`.\n4. Implemented a 15-minute sliding window context cache to prevent unbounded prompt token costs.\n5. Handled network disconnections gracefully, maintaining previously rendered text without UI resets.",
      result: "Time to first token dropped from 3,000ms to 240ms, delivering a smooth ChatGPT-like interactive experience.",
      spokenPitch: "In my Portfolio Platform, I built an interactive AI assistant powered by Groq's LLaMA 3.3 70B model. Using standard REST requests meant users waited 3 seconds for the full response. I re-architected the pipeline using Server-Sent Events (SSE).\n\nI chose SSE over WebSockets because LLM text streaming is inherently unidirectional, and SSE runs over standard HTTP with native HTTP/2 multiplexing. In NestJS, I returned an RxJS Observable emitting token chunks, and on the React frontend, I built a custom hook reading the stream via ReadableStream reader. This slashed time-to-first-token from 3 seconds to 240ms, providing an immediate, responsive user experience."
    },

    backupStar: {
      situation: "In the AI assistant, users asking follow-up questions were sending the entire conversation history, threatening to exceed token context limits and increasing API costs.",
      task: "Optimize LLM prompt context while maintaining conversational memory.",
      action: "Built a sliding window context manager that retained only the last 6 conversation turns and summarized earlier context into a compact 50-token system preamble.",
      result: "Cut token consumption by 60% while maintaining flawless conversational continuity.",
      spokenPitch: "In my AI chatbot, I managed token limits by implementing a sliding window context buffer that kept the latest 6 messages and compressed older context into a compact system summary, reducing API token costs by 60%."
    },

    mermaidDiagram: `sequenceDiagram
    autonumber
    actor Visitor as Recruiter / Visitor
    participant React as React Chat Hook (useStreamResponse)
    participant Nest as NestJS SSE Controller
    participant Groq as Groq LLaMA 3.3 70B API

    Visitor->>React: Types "Tell me about Sameer's experience in Chrona"
    React->>Nest: POST /api/ai/chat (Prompt + Context Window)
    Nest->>Groq: Request Chat Completion (stream: true)
    Note over Groq: Time-to-First-Token: 240ms! ⚡

    Groq-->>Nest: Chunk 1: "Sameer"
    Nest-->>React: data: {"token": "Sameer"}
    React-->>Visitor: Renders "Sameer" (Instant visual feedback!)
    
    Groq-->>Nest: Chunk 2: " is a Lead Full Stack Developer..."
    Nest-->>React: data: {"token": " is a Lead Full Stack Developer..."}
    React-->>Visitor: Renders streaming text smoothly...
    
    Groq-->>Nest: Chunk [DONE]
    Nest-->>React: event: done
    React->>React: Finalize markdown & persist in conversation history! ✅`,

    architectureContract: `// NestJS Server-Sent Events (SSE) Controller for Real-Time LLM Token Streaming
@Controller('ai')
export class AiController {
  @Sse('chat-stream')
  streamAiChat(@Body() body: ChatPromptDto): Observable<MessageEvent> {
    return new Observable(observer => {
      this.groqService.createStream(body.prompt, {
        onToken: (token) => {
          observer.next({ data: { token } } as MessageEvent);
        },
        onComplete: () => {
          observer.next({ data: { done: true } } as MessageEvent);
          observer.complete();
        },
        onError: (err) => observer.error(err)
      });
    });
  }
}`
  }
];
