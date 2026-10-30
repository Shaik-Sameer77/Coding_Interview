// scratch/generate_node_batch_2.cjs
const fs = require('fs');
const path = require('path');

const parts9to16 = [
  {
    id: 9,
    title: "Part 9 — Authentication: Passwords, JWTs & Refresh Token Rotation",
    badge: "Auth Architecture",
    color: "#f59e0b",
    sections: [
      {
        id: "9.1",
        title: "19. Password Hashing: Bcrypt vs Argon2 & Timing Attack Defense",
        content: `### 1. Why Fast Hash Algorithms are Lethal for Passwords
Never use fast cryptographic algorithms like **MD5, SHA-1, SHA-256, or SHA-512** for password hashing.
- Modern GPUs can compute **billions of SHA-256 hashes per second**. A 10-character password can be cracked via brute-force dictionary attacks in minutes.
- **Password hashing functions MUST be computationally slow, memory-hard, and salted**:
  1. **Bcrypt**: Adaptive work factor (salt rounds). Work factor 12 takes ~250ms per hash.
  2. **Argon2**: Winner of the Password Hashing Competition (PHC). Memory-hard and immune to GPU/ASIC parallelization.

### 2. Salt and Rainbow Tables
A **salt** is a cryptographically secure random string concatenated with the password before hashing.
- It guarantees that two users with the exact same password (\`"password123"\`) will produce completely different hash strings in the database.
- It defeats precomputed **Rainbow Table attacks**.

### 3. Defending Against Timing Attacks
When comparing user-supplied hashes or API keys:
\`\`\`javascript
// ❌ VULNERABLE TO TIMING ATTACK:
if (suppliedKey === actualKey) { ... }
\`\`\`
Standard string equality (\`===\`) returns \`false\` on the **first mismatched character**. By measuring microsecond differences in server response latency, an attacker can guess a 32-character secret character-by-character.
- **The Fix**: Always use **\`crypto.timingSafeEqual(bufferA, bufferB)\`** to guarantee constant-time execution!`,
        comparisonTable: [
          { algorithm: "MD5 / SHA-256", type: "Fast message digest", passwordSuitable: "ABSOLUTELY NO (Trivial GPU crack)" },
          { algorithm: "Bcrypt", type: "CPU-hard salted hash", passwordSuitable: "YES (Standard industry baseline)" },
          { algorithm: "Argon2id", type: "Memory-hard & CPU-hard", passwordSuitable: "YES (Modern state-of-the-art)" }
        ],
        code: `// Secure Password Hashing with Bcrypt & Constant-Time Comparison
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const SALT_ROUNDS = 12; // ~250ms CPU cost

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword, storedHash) {
  return bcrypt.compare(plainPassword, storedHash);
}

// Constant-Time API Key Comparison
export function verifyApiKey(suppliedKey, secretKey) {
  const bufA = Buffer.from(suppliedKey);
  const bufB = Buffer.from(secretKey);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}`,
        keyTakeaways: [
          "Never use SHA-256 for passwords; use Bcrypt (12 rounds) or Argon2id.",
          "Salting prevents rainbow table dictionary lookups.",
          "Use crypto.timingSafeEqual() for API keys, webhook signatures, and tokens."
        ]
      },
      {
        id: "9.2",
        title: "20. Dual-Token Architecture & Secure Refresh Token Rotation",
        content: `### 1. The Single JWT Problem
If you issue a single JWT with a 30-day expiration stored in browser \`localStorage\`:
- Any third-party npm script or Cross-Site Scripting (XSS) vulnerability can read \`localStorage.getItem('token')\` and steal the user's account for 30 days.
- JWTs are stateless: **you cannot revoke or invalidate a compromised token** without tearing down the entire auth service!

### 2. The Dual-Token Standard
1. **Access Token**:
   - Short-lived (**10–15 minutes**).
   - Stored in memory (React state) or short-term cookie.
   - Sent in \`Authorization: Bearer <token>\` header.
2. **Refresh Token**:
   - Long-lived (**7–30 days**).
   - Stored in an **\`HttpOnly, Secure, SameSite=Strict\` cookie** (JavaScript cannot read it; protected against XSS).
   - Saved in the database with a family grouping ID.

### 3. Refresh Token Rotation (Automatic Reuse Detection)
Whenever the frontend requests a new Access Token using its Refresh Token:
1. The backend verifies the Refresh Token.
2. The backend **immediately invalidates the old Refresh Token** and issues a brand-new Refresh Token (**Rotation**).
3. **If a revoked Refresh Token is ever submitted again**: The server detects token theft! It immediately revokes the **entire family of tokens** for that user, kicking the hacker and the legitimate user out, forcing re-authentication!`,
        comparisonTable: [
          { token: "Access Token", lifetime: "10 to 15 minutes", storage: "In-Memory state", contents: "User ID, roles, permissions" },
          { token: "Refresh Token", lifetime: "7 to 30 days", storage: "HttpOnly Secure Cookie", contents: "Unique JTI token ID & family ID" }
        ],
        code: `// Express Cookie Configuration for Secure Refresh Tokens
export function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents JavaScript access (Immune to XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    sameSite: 'strict', // Prevents Cross-Site Request Forgery (CSRF)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/api/v1/auth/refresh' // Restricts cookie sending to refresh route only!
  });
}`,
        keyTakeaways: [
          "Store short-lived access tokens in memory; store long-lived refresh tokens in HttpOnly Secure cookies.",
          "Rotate the refresh token on every single usage.",
          "Implement reuse detection to invalidate all user sessions if a compromised refresh token is replayed."
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Part 10 — Authorization: RBAC, ABAC & Multi-Tenant Data Isolation",
    badge: "Authorization",
    color: "#84cc16",
    sections: [
      {
        id: "10.1",
        title: "21. Role-Based (RBAC) vs Attribute-Based (ABAC) Access Control",
        content: `### 1. Authentication vs Authorization
- **Authentication (AuthN)**: *"Who are you?"* (Verifying user identity via password, OTP, or OAuth).
- **Authorization (AuthZ)**: *"What are you permitted to do?"* (Verifying whether User 10 can delete Order 42).

### 2. RBAC (Role-Based Access Control)
Users are assigned static roles (\`admin\`, \`editor\`, \`viewer\`), and permissions are assigned to roles:
- Simple to implement with middleware: \`requireRole('admin')\`.
- **Limitation**: Cannot express resource ownership! An \`editor\` role allows editing, but should User A be able to edit User B's personal blog draft? RBAC cannot decide.

### 3. ABAC (Attribute-Based Access Control)
Evaluates dynamic attributes at request time:
- Subject attributes: \`user.id\`, \`user.department\`.
- Resource attributes: \`resource.ownerId\`, \`resource.isPublished\`.
- Environment attributes: \`request.time\`, \`request.ip\`.
- Example Rule: *"A user can update an article IF (user.id === article.authorId) OR (user.role === 'admin')"*.`,
        comparisonTable: [
          { model: "RBAC", granularity: "Coarse (Role level: Admin, Member)", complexity: "Low", bestFor: "Static internal dashboards" },
          { model: "ABAC", granularity: "Fine (Resource ownership, dynamic rules)", complexity: "Medium", bestFor: "Multi-user SaaS, documents, orders" }
        ],
        code: `// Reusable Express RBAC & Ownership Authorization Middleware
export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

export function requireOwnership(getOwnerIdFn) {
  return async (req, res, next) => {
    const ownerId = await getOwnerIdFn(req);
    if (req.user.role !== 'admin' && req.user.id !== ownerId) {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not own this resource' });
    }
    next();
  };
}`,
        keyTakeaways: [
          "Never rely on frontend UI checks (hidden buttons) for authorization.",
          "RBAC handles static role checks; ABAC handles dynamic resource ownership.",
          "Always authorize at the service/database layer before executing mutations."
        ]
      },
      {
        id: "10.2",
        title: "22. Resource Ownership Verification & Multi-Tenant Data Isolation",
        content: `### 1. The BOLA / IDOR Threat (OWASP API #1)
**Broken Object Level Authorization (BOLA)**, historically called **Insecure Direct Object Reference (IDOR)**, is the #1 API security vulnerability globally:
- An attacker logs in as \`User 10\`.
- The attacker sends \`DELETE /api/v1/invoices/9999\` (an invoice belonging to \`User 20\`).
- If the backend merely verifies that the user is logged in, but fails to check that \`invoice.tenantId === req.user.tenantId\`, the attack succeeds!

### 2. Multi-Tenant Scoping Patterns
1. **Application-Level Scoping**: Always append tenant scoping to every single query:
   \`\`\`javascript
   // ✅ SAFE: Scoped to logged-in user's organization
   const invoice = await Invoice.findOne({ _id: invoiceId, organizationId: req.user.orgId });
   \`\`\`
2. **Postgres Row-Level Security (RLS)**: Enforces tenant isolation directly in the database engine using session variables (\`SET LOCAL app.current_tenant_id = 'org_123'\`). Even if a developer forgets a \`WHERE\` clause, the database will never return another tenant's rows!`,
        comparisonTable: [
          { pattern: "App-Level Scoping", pros: "Works across all databases", cons: "Human error risk if developer forgets WHERE tenant_id" },
          { pattern: "Postgres RLS", pros: "100% database-level guarantee", cons: "Postgres specific; requires session config on checkout" }
        ],
        code: `// Safe multi-tenant service method avoiding IDOR
export class InvoiceService {
  constructor(invoiceRepository) {
    this.repo = invoiceRepository;
  }

  async deleteInvoice(invoiceId, user) {
    // Query MUST include organizationId constraint
    const deleted = await this.repo.deleteByIdAndOrg(invoiceId, user.organizationId);
    if (!deleted) {
      // Return 404 rather than 403 to prevent ID harvesting/enumeration
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }
    return { success: true };
  }
}`,
        keyTakeaways: [
          "BOLA/IDOR is the most common API security breach in production.",
          "Every database query for a private resource must include tenant scoping.",
          "Return 404 Not Found instead of 403 Forbidden on authorization failures to prevent ID enumeration."
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Part 11 — Backend Security: Dedicated CORS, Helmet & OWASP Top 10",
    badge: "Security Deep-Dive",
    color: "#dc2626",
    sections: [
      {
        id: "11.1",
        title: "23. CORS Deep-Dive: Same-Origin Policy, Preflights & Credential Rules",
        content: `### 1. What is CORS and What Problem Does It Solve?
**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that relaxes the browser's default **Same-Origin Policy (SOP)**:
- **An Origin** is defined as: \`<scheme>://<hostname>:<port>\` (e.g. \`https://app.example.com:443\`).
- If an origin differs by even a single character (e.g. \`http\` vs \`https\`, or port \`3000\` vs \`8080\`), it is **Cross-Origin**.
- **Crucial Rule**: CORS is enforced **strictly by web browsers** to protect users. Non-browser clients (curl, Postman, mobile apps, server-to-server HTTP calls) **completely ignore CORS**! CORS is NOT authentication or API security!

### 2. Simple Requests vs Preflight Requests (OPTIONS)
- **Simple Requests**: Use \`GET\`, \`POST\`, or \`HEAD\` with standard headers (\`Content-Type: text/plain\`, \`multipart/form-data\`, or \`application/x-www-form-urlencoded\`). The browser dispatches the request directly.
- **Preflight Requests**: If the request contains custom headers (\`Authorization\`, \`X-Api-Key\`) or JSON (\`Content-Type: application/json\`) or uses \`PUT\`/\`DELETE\`:
  1. The browser sends an automatic **\`OPTIONS\`** preflight request with \`Access-Control-Request-Method\` and \`Access-Control-Request-Headers\`.
  2. The server responds with permitted methods, headers, and \`Access-Control-Max-Age\` (caching the preflight for e.g. 86400 seconds).
  3. Only if the preflight succeeds does the browser dispatch the real request!

### 3. The Fatal Rule: Wildcard (\`*\`) with Credentials
If your frontend sends cookies or authorization headers (\`credentials: 'include'\`):
\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
\`\`\`
💥 **THE BROWSER BLOCKS THE RESPONSE AND CRASHES THE REQUEST!**
The W3C specification strictly prohibits pairing \`*\` with credentials. You must dynamically echo the validated matching origin from an allowlist!`,
        comparisonTable: [
          { header: "Access-Control-Allow-Origin", purpose: "Specifies which origin can read response data", example: "https://myfrontend.com" },
          { header: "Access-Control-Allow-Credentials", purpose: "Allows browser to expose response when cookies/auth sent", example: "true" },
          { header: "Access-Control-Allow-Headers", purpose: "Permitted request headers for preflight", example: "Content-Type, Authorization" },
          { header: "Access-Control-Max-Age", purpose: "Seconds to cache preflight response in browser", example: "86400 (24 hours)" }
        ],
        code: `// Production-Grade Dynamic CORS Configuration in Express
import cors from 'cors';

const ALLOWED_ORIGINS = new Set([
  'https://chrona.app',
  'https://admin.chrona.app',
  'http://localhost:5173' // Local dev
]);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) where origin is undefined
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(\`CORS policy violation: \${origin} is not allowed.\`));
    }
  },
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // Cache preflight for 24 hours to reduce latency
});`,
        keyTakeaways: [
          "CORS is a browser-enforced security relaxation, not a server firewall.",
          "Preflight OPTIONS requests are sent automatically for JSON payloads and custom headers.",
          "Never pair Access-Control-Allow-Origin: * with credentials: true.",
          "Set Access-Control-Max-Age to cache preflight responses and eliminate extra HTTP roundtrips."
        ]
      },
      {
        id: "11.2",
        title: "24. Helmet Security Headers: CSP, HSTS & Frameguard",
        content: `### 1. What Does Helmet Do?
**Helmet** is an Express middleware that sets 15+ HTTP security headers to protect against common web vulnerabilities (Clickjacking, MIME-type sniffing, cross-site script injection).

### 2. The 4 Most Critical Headers Explained
1. **Content-Security-Policy (CSP)**: Restricts the domains from which scripts, styles, images, and fonts can be loaded and executed. Neutralizes Cross-Site Scripting (XSS).
2. **Strict-Transport-Security (HSTS)**: Tells browsers that the site must **ONLY be accessed via HTTPS**. Forces automatic HTTP-to-HTTPS upgrade before any network packet leaves the user's computer.
3. **X-Content-Type-Options: nosniff**: Prevents browsers from guessing the MIME type of a file (e.g. executing a user-uploaded avatar \`image.jpg\` as executable JavaScript).
4. **X-Frame-Options: DENY / SAMEORIGIN**: Protects against **Clickjacking** by forbidding external sites from embedding your application inside an invisible \`<iframe>\`.`,
        comparisonTable: [
          { header: "Strict-Transport-Security", default: "max-age=15552000; includeSubDomains", defenseAgainst: "SSL-stripping Man-in-the-Middle attacks" },
          { header: "X-Content-Type-Options", default: "nosniff", defenseAgainst: "MIME sniffing script execution" },
          { header: "X-Frame-Options", default: "SAMEORIGIN", defenseAgainst: "Clickjacking UI redressing" }
        ],
        code: `// Secure Production Helmet Configuration in Express
import helmet from 'helmet';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://s3.amazonaws.com"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  crossOriginEmbedderPolicy: false, // Set false if serving cross-origin media
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  }
});`,
        keyTakeaways: [
          "Helmet sets critical security response headers to harden the server.",
          "HSTS forces HTTPS across all subdomains for at least 1 year.",
          "Configure CSP explicitly when using external payment scripts like Stripe.js."
        ]
      },
      {
        id: "11.3",
        title: "25. OWASP Top 10 Defenses: Injection, Prototype Pollution & ReDoS",
        content: `### 1. SQL & NoSQL Injection
- **SQL Injection**: An attacker injects SQL fragments through unvalidated inputs (\`' OR 1=1 --\`). Defend using **parameterized queries / prepared statements** (\`$1, $2\`). Never concatenate raw strings!
- **NoSQL Injection**: In MongoDB, passing a JSON query object \`{ "$gt": "" }\` instead of a string bypasses password checks! Defend using Zod schema validation to ensure inputs are strictly strings.

### 2. Prototype Pollution
Attacker modifies the root \`Object.prototype\` by sending malicious payloads containing \`__proto__\` or \`constructor.prototype\`, altering the behavior of every object in the Node.js process.
- Defend using \`Object.freeze\`, Map collections, or libraries that sanitize prototype keys.

### 3. Regular Expression Denial of Service (ReDoS)
Catastrophic backtracking in poorly constructed regular expressions (\`/(a+)+$/\`) locks the single-threaded CPU at 100% when evaluating malicious strings like \`"aaaaaaaaaaaaaaa!"\`.
- Defend by avoiding nested quantifiers and testing regexes using safe validation tools.`,
        comparisonTable: [
          { vulnerability: "SQL Injection", vector: "Raw string interpolation", defense: "Parameterized queries with prepared statements" },
          { vulnerability: "NoSQL Injection", vector: "Object operators ({ $gt: '' }) in params", defense: "Zod runtime schema string coercion" },
          { vulnerability: "ReDoS", vector: "Catastrophic polynomial regex backtracking", defense: "Linear time regex engines & validator.js" }
        ],
        code: `// Preventing SQL Injection with Parameterized Queries
import mysql from 'mysql2/promise';

export async function getUserSafely(pool, email) {
  // ❌ VULNERABLE: pool.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
  
  // ✅ SAFE: Parameterized prepared statement
  const [rows] = await pool.execute(
    'SELECT id, email, full_name, role FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}`,
        keyTakeaways: [
          "Never concatenate user input directly into SQL or NoSQL queries.",
          "Validate all incoming request shapes with Zod to block NoSQL object injection.",
          "Avoid nested quantifiers in regular expressions to prevent ReDoS CPU lockups."
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Part 12 — Webhooks, Payments & Idempotency Engineering",
    badge: "Payments & Webhooks",
    color: "#0284c7",
    sections: [
      {
        id: "12.1",
        title: "26. Webhook Security: HMAC-SHA256 Signatures & Raw Body Preservation",
        content: `### 1. The Raw Body Dilemma in Webhooks
Payment providers (Stripe, Razorpay, GitHub, Shopify) sign webhook payloads using **HMAC-SHA256**.
- The signature is calculated by hashing the **exact, unparsed binary bytes** of the incoming HTTP request body combined with a shared Webhook Secret.
- If your Express server runs \`express.json()\` before the webhook route, Express parses and stringifies the JSON.
- **Why signature verification fails**: Re-stringifying JSON changes whitespace, key ordering, and unicode formatting, producing a completely different hash!
- **The Solution**: Configure \`express.json({ verify: (req, res, buf) => req.rawBody = buf })\` to preserve the exact raw Buffer on the request object.

### 2. Defending Against Replay Attacks
A malicious actor intercepts a valid signed webhook and replays it 100 times to grant multiple subscription credits.
- Stripe includes a timestamp (\`t=1600000000\`) in the signature header.
- The server rejects any webhook whose timestamp is older than **5 minutes** (300 seconds), defeating replay attacks!`,
        comparisonTable: [
          { aspect: "Parsed Body (req.body)", suitability: "Normal REST API endpoints", webhookSuitability: "FAILS signature check due to whitespace shifts" },
          { aspect: "Raw Buffer (req.rawBody)", suitability: "Webhook signature verification", webhookSuitability: "MANDATORY for cryptographic parity" }
        ],
        code: `// Express Raw Body Preservation Middleware for Webhooks
import express from 'express';
import crypto from 'node:crypto';

const app = express();

// Preserve raw body buffer on req.rawBody for webhook verification:
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/v1/webhooks')) {
      req.rawBody = buf; // Raw Uint8Array Buffer
    }
  }
}));

export function verifyStripeSignature(rawBody, signatureHeader, webhookSecret) {
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const signature = parts.find(p => p.startsWith('v1='))?.split('=')[1];

  // 1. Check timestamp tolerance (5 minutes)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  if (Number(timestamp) < fiveMinutesAgo) {
    throw new Error('Webhook timestamp expired (Replay Attack Defense)');
  }

  // 2. Compute expected HMAC-SHA256 signature
  const signedPayload = \`\${timestamp}.\${rawBody.toString('utf-8')}\`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  // 3. Constant-time comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  if (!isValid) throw new Error('Invalid webhook signature');
  return true;
}`,
        keyTakeaways: [
          "Preserve the exact raw body Buffer to verify HMAC-SHA256 webhook signatures.",
          "Validate timestamp tolerances to block replay attacks.",
          "Use crypto.timingSafeEqual() to prevent signature timing attacks."
        ]
      },
      {
        id: "12.2",
        title: "27. Payment Workflows & Idempotency: Avoiding Double Charges",
        content: `### 1. The At-Least-Once Delivery Reality
Webhooks are distributed systems. Payment gateways guarantee **at-least-once delivery**, which means **duplicate webhook events ARE GUARANTEED to occur** due to network retries.
- If your webhook listener inserts a database credit on every event without idempotency checks, a user will be credited twice!

### 2. The Idempotency Key Pattern
1. Generate or extract an idempotency key:
   - For incoming webhooks: The provider's unique event ID (e.g. \`event.id\` like \`evt_123456\`).
   - For outgoing payments: An \`Idempotency-Key\` HTTP header passed to Stripe.
2. In your database, create an \`idempotency_keys\` table with a **Unique Constraint** on \`key\`.
3. Wrap the processing inside a database transaction:
   - Insert key. If duplicate (\`409 Conflict\` or MySQL \`ER_DUP_ENTRY\`), return HTTP 200 immediately and skip processing!
4. Process the credit and update order status.
5. Acknowledge with **HTTP 200 within 2 seconds** so the gateway does not retry.`,
        comparisonTable: [
          { pattern: "Naive Webhook Handler", duplicateRisk: "HIGH (Double orders, multiple credits)", resilience: "Fails on network retries" },
          { pattern: "Idempotent Webhook Handler", duplicateRisk: "ZERO (Unique constraint deduplication)", resilience: "Production-grade resilience" }
        ],
        code: `// Idempotent Webhook Event Processor with Database Deduplication
export async function handlePaymentWebhook(event, dbPool) {
  const eventId = event.id; // Unique event ID from provider

  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Attempt to record event ID with UNIQUE constraint
    try {
      await connection.execute(
        'INSERT INTO processed_events (event_id, event_type, processed_at) VALUES (?, ?, NOW())',
        [eventId, event.type]
      );
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Event already processed! Acknowledge with 200 and exit safely
        await connection.rollback();
        console.log(\`Duplicate event \${eventId} ignored safely.\`);
        return { duplicate: true };
      }
      throw err;
    }

    // 2. Execute business logic (e.g. mark order paid)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await connection.execute(
        'UPDATE orders SET status = ?, payment_id = ? WHERE id = ?',
        ['PAID', paymentIntent.id, paymentIntent.metadata.orderId]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}`,
        keyTakeaways: [
          "Webhooks guarantee at-least-once delivery; duplicates are inevitable.",
          "Use a unique database constraint on event ID to achieve atomic idempotency.",
          "Return HTTP 200 within 2-3 seconds to prevent payment gateway retries."
        ]
      }
    ]
  },
  {
    id: 13,
    title: "Part 13 — File Uploads, Object Storage & AWS S3 Pre-signed URLs",
    badge: "File Storage",
    color: "#6366f1",
    sections: [
      {
        id: "13.1",
        title: "28. Direct S3 Uploads via Pre-signed URLs vs Multer Streaming",
        content: `### 1. The Two File Upload Architectures
- **Architecture A: Traditional Server Proxy (Multer)**
  - Client uploads 50MB file to Node.js backend.
  - Node.js backend buffers/streams the 50MB file across the internet to AWS S3.
  - **Bottleneck**: Consumes server network bandwidth twice, ties up worker sockets, and exhausts memory under high concurrent uploads.
- **Architecture B: Direct S3 Upload via Pre-signed URLs (Modern Production Standard)**
  1. Frontend requests a pre-signed URL from Node.js backend: \`POST /api/v1/uploads/presigned-url\`.
  2. Backend validates file type, size quota, and user authentication, then generates a temporary signed S3 URL valid for 5 minutes.
  3. Frontend uploads the file **directly from the browser to AWS S3** using HTTP \`PUT\`.
  4. Backend server processes ZERO file bytes! Scalability is virtually infinite!

### 2. Validating Magic Bytes (Never Trust MIME Types)
Never rely on the file extension (\`.jpg\`) or the client-supplied \`Content-Type\` header.
- An attacker can rename a malicious executable (\`trojan.exe\`) to \`photo.png\`.
- **Magic Bytes**: The first 4–8 bytes of a file header contain unambiguous magic signatures (e.g. PNG is always \`89 50 4E 47 0D 0A 1A 0A\`). Use libraries like \`file-type\` to verify magic bytes.`,
        comparisonTable: [
          { pattern: "Multer Server Proxy", serverBandwidth: "Double (Inbound + Outbound)", scalability: "Poor (Ties up backend sockets)" },
          { pattern: "S3 Pre-signed URLs", serverBandwidth: "Zero (Direct browser-to-S3)", scalability: "Infinite (AWS handles upload traffic)" }
        ],
        code: `// Generating AWS S3 Pre-Signed Upload URLs with S3 Client v3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export async function createUploadUrl({ userId, fileName, contentType, maxBytes = 5242880 }) {
  // Validate allowed MIME types
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
  if (!allowedTypes.has(contentType)) {
    throw new Error('Unsupported file type');
  }

  const key = \`uploads/\${userId}/\${randomUUID()}-\${fileName}\`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType
  });

  // URL expires in 300 seconds (5 minutes)
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl: presignedUrl, fileKey: key };
}`,
        keyTakeaways: [
          "Use S3 Pre-signed URLs for file uploads to offload bandwidth from Node.js to AWS.",
          "Generate short-lived (5 minute) pre-signed URLs with strict content-type constraints.",
          "Verify file magic bytes to prevent renamed executable malware uploads."
        ]
      }
    ]
  },
  {
    id: 14,
    title: "Part 14 — TypeScript for Backend Services",
    badge: "TypeScript Backend",
    color: "#3178c6",
    sections: [
      {
        id: "14.1",
        title: "29. Typing Express Request/Response & Declaration Merging",
        content: `### 1. Extending \`Express.Request\` with Declaration Merging
In authenticated APIs, middleware attaches the authenticated user payload to \`req.user\`.
If you write \`req.user.id\` in TypeScript without custom typings, the compiler errors:
\`Property 'user' does not exist on type 'Request'.\`

### 2. Declaration Merging Solution
Create an ambient declaration file \`src/types/express.d.ts\`:
\`\`\`typescript
import { UserRole } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        organizationId: string;
      };
      correlationId?: string;
      rawBody?: Buffer;
    }
  }
}
export {};
\`\`\`

### 3. Typing Route Parameters and Query Strings
Express's \`RequestHandler\` accepts 5 generic arguments:
\`RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>\`:
\`\`\`typescript
import { RequestHandler } from 'express';

interface GetProductParams { productId: string; }
interface GetProductQuery { currency?: 'USD' | 'EUR'; }
interface ProductResponse { id: string; price: number; }

export const getProductHandler: RequestHandler<
  GetProductParams,
  ProductResponse,
  unknown,
  GetProductQuery
> = async (req, res, next) => {
  const { productId } = req.params; // Typed string!
  const { currency } = req.query;   // Typed 'USD' | 'EUR' | undefined!
};
\`\`\``,
        comparisonTable: [
          { genericArg: "Params", meaning: "URL parameters (req.params)" },
          { genericArg: "ResBody", meaning: "Response payload (res.json)" },
          { genericArg: "ReqBody", meaning: "Request body (req.body)" },
          { genericArg: "ReqQuery", meaning: "URL query string (req.query)" }
        ],
        code: `// Strictly Typed Controller Handler Example
import { RequestHandler } from 'express';

interface CreateOrderBody {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethodId: string;
}

interface OrderResponse {
  orderId: string;
  total: number;
  status: 'PENDING' | 'PAID';
}

export const createOrder: RequestHandler<
  never,
  OrderResponse,
  CreateOrderBody
> = async (req, res, next) => {
  const { items, paymentMethodId } = req.body;
  // Fully type-checked!
  res.status(201).json({
    orderId: 'ORD-101',
    total: 150,
    status: 'PAID'
  });
};`,
        keyTakeaways: [
          "Use declaration merging in an express.d.ts file to add user and correlationId to Express.Request.",
          "Use RequestHandler<Params, ResBody, ReqBody, ReqQuery> for complete type safety.",
          "Combine compile-time TypeScript contracts with runtime Zod parsers."
        ]
      },
      {
        id: "14.2",
        title: "30. End-to-End Type Safety: DTOs, Repository Interfaces & Zod",
        content: `### 1. The Single Source of Truth
Avoid declaring a TypeScript interface and a separate Zod schema manually. They will inevitably drift out of sync during maintenance.
- **Best Practice**: Author the Zod schema first, and derive the TypeScript DTO using \`z.infer<typeof Schema>\`.

### 2. Defining Repository Contracts
Define repository contracts as pure TypeScript interfaces. This enables mock implementations for unit testing without spinning up real databases:
\`\`\`typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}
\`\`\``,
        comparisonTable: [
          { pattern: "Interface + Separate Validator", driftRisk: "HIGH (Update in one file forgotten in the other)" },
          { pattern: "Zod Schema with z.infer", driftRisk: "ZERO (Type automatically mirrors runtime validation)" }
        ],
        code: `// Complete DTO and Repository Contract Pattern
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  createdAt: z.date()
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof UserSchema.omit({ id: true, createdAt: true })>;

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(dto: CreateUserDto): Promise<User>;
}`,
        keyTakeaways: [
          "Derive TypeScript types from Zod schemas using z.infer to prevent schema drift.",
          "Define repository contracts as interfaces for easy unit-test mocking.",
          "Separate internal database entities from external API response DTOs."
        ]
      }
    ]
  },
  {
    id: 15,
    title: "Part 15 — MongoDB & Mongoose: Modeling, Indexes & Transactions",
    badge: "MongoDB Master",
    color: "#10b981",
    sections: [
      {
        id: "15.1",
        title: "31. MongoDB Document Modeling: Embedding vs Referencing & Bounded Arrays",
        content: `### 1. Document Modeling Philosophy
In relational databases, you normalize data to eliminate redundancy.
In MongoDB, **data that is accessed together should be stored together**:
- **Embedding (Denormalization)**: Store subdocuments directly inside the parent document.
  - *When to use*: 1-to-1 relationships, 1-to-Few relationships (< 100 subdocuments, like user addresses or line items in an order).
  - *Advantage*: $O(1)$ single-read operation. No joins required!
- **Referencing (Normalized \`ObjectId\`)**: Store references to documents in separate collections.
  - *When to use*: 1-to-Many (> 1,000 subdocuments), Many-to-Many, or data that is frequently updated independently.

### 2. The 16MB Document Size Limit & Unbounded Array Anti-Pattern
Every BSON document in MongoDB has a strict **hard limit of 16 Megabytes**.
- **The Anti-Pattern**: \`PostSchema = { comments: [CommentSchema] }\`. If a viral post receives 200,000 comments, the document exceeds 16MB and **crashes with write errors**!
- **The Fix (Subset / Bucketing Pattern)**: Store only the 10 most recent comments embedded in the post; store all historical comments in a separate \`comments\` collection referencing \`postId\`.`,
        comparisonTable: [
          { pattern: "Embedding", readSpeed: "Instantaneous (1 document query)", writeOverhead: "Rewrites entire parent document", limit: "16MB max document size" },
          { pattern: "Referencing", readSpeed: "Requires $lookup or separate query", writeOverhead: "Fast isolated writes", limit: "Virtually infinite" }
        ],
        code: `// Mongoose Schema with Bounded Subdocuments and Indexing
import mongoose, { Schema, Document } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }
}, { _id: false }); // Disable unnecessary subdocument _id

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [OrderItemSchema], // Embedded bounded array
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

// Compound Index for high-volume customer queries
OrderSchema.index({ userId: 1, createdAt: -1 });

export const Order = mongoose.model('Order', OrderSchema);`,
        keyTakeaways: [
          "Embed for 1-to-Few relationships; reference for 1-to-Many relationships.",
          "Beware of the 16MB document size limit: never store unbounded arrays.",
          "Use the Subset Pattern: embed recent data for fast reads, reference history separately."
        ]
      },
      {
        id: "15.2",
        title: "32. Index Optimization: Compound Indexes, ESR Rule & Explain Plans",
        content: `### 1. The ESR Rule (Equality, Sort, Range)
When designing a compound index in MongoDB for a query with equality filters, sorting, and range filters:
**Order the index fields strictly as: [E]quality -> [S]ort -> [R]ange!**

Example Query:
\`\`\`javascript
db.orders.find({
  status: 'PAID',               // [E]quality
  totalAmount: { $gte: 100 }    // [R]ange
}).sort({ createdAt: -1 });     // [S]ort
\`\`\`
- ❌ **Wrong Index**: \`{ status: 1, totalAmount: 1, createdAt: -1 }\`. The range scan breaks index ordering, forcing an expensive **in-memory Sort stage** (\`SORT_KEY_GENERATOR\`).
- ✅ **Optimal Index (ESR)**: \`{ status: 1, createdAt: -1, totalAmount: 1 }\`. MongoDB uses the index for filtering, traverses pre-sorted index keys, and applies the range check with zero memory sorting!

### 2. Reading Explain Plans: COLLSCAN vs IXSCAN
Always check \`query.explain('executionStats')\`:
- \`stage: "COLLSCAN"\`: **Catastrophic full collection scan**. Scanned every document in the database!
- \`stage: "IXSCAN"\`: **Index scan**. Fast traversal of B-tree index.
- **The Golden Ratio**: Check \`totalDocsExamined / nReturned\`. In an optimal query, this ratio is **1.0** (every document read was a matching result)!`,
        comparisonTable: [
          { metric: "totalDocsExamined / nReturned", value1: "Ratio == 1.0 (Optimal index)", value2: "Ratio > 100 (Poor index; reading wasted disk blocks)" },
          { metric: "Execution Stage", value1: "IXSCAN -> FETCH", value2: "COLLSCAN (Dangerous full collection scan)" }
        ],
        code: `// Analyzing Mongoose Query Performance with Explain
import { Order } from './order.model';

export async function explainOrderQuery() {
  const stats = await Order.find({
    status: 'PAID',
    createdAt: { $gte: new Date(Date.now() - 30 * 86400000) }
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .explain('executionStats');

  console.log({
    executionStage: stats.executionStats.executionStages.stage,
    totalDocsExamined: stats.executionStats.totalDocsExamined,
    nReturned: stats.executionStats.nReturned,
    executionTimeMillis: stats.executionStats.executionTimeMillis
  });
}`,
        keyTakeaways: [
          "Follow the ESR rule: Equality first, Sort second, Range last.",
          "Aim for a totalDocsExamined to nReturned ratio of 1.0.",
          "Eliminate COLLSCAN stages to prevent database CPU saturation."
        ]
      },
      {
        id: "15.3",
        title: "33. Mongoose Aggregation Pipeline & Multi-Document ACID Transactions",
        content: `### 1. The Aggregation Pipeline
The Aggregation Pipeline processes documents through sequential transformation stages:
\`\`\`
[Collection] -> $match -> $group -> $sort -> $project -> [Final Report]
\`\`\`
- **Pipeline Optimization**: Always place **\`$match\` and \`$sort\` at the absolute beginning of the pipeline** so MongoDB can utilize indexes! Putting \`$project\` before \`$match\` breaks index utilization.

### 2. Multi-Document ACID Transactions
Since version 4.0, MongoDB supports multi-document ACID transactions across replica sets:
- Atomicity, Consistency, Isolation, and Durability across multiple collections.
- Use sessions via \`mongoose.startSession()\` and \`session.withTransaction()\`.`,
        comparisonTable: [
          { operation: "Single Document Mutation", transactionNeeded: "NO (Atomic by default in MongoDB)" },
          { operation: "Multi-Collection Transfer", transactionNeeded: "YES (Requires session.withTransaction)" }
        ],
        code: `// Multi-Document Transaction in Mongoose
import mongoose from 'mongoose';
import { User } from './user.model';
import { Account } from './account.model';

export async function transferBalance(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Deduct from sender
      const sender = await Account.findOneAndUpdate(
        { userId: fromUserId, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session, new: true }
      );
      if (!sender) throw new Error('Insufficient funds');

      // 2. Credit receiver
      await Account.findOneAndUpdate(
        { userId: toUserId },
        { $inc: { balance: amount } },
        { session }
      );
    });
    console.log('Transfer committed successfully.');
  } finally {
    session.endSession();
  }
}`,
        keyTakeaways: [
          "Place $match at the start of aggregation pipelines to leverage indexes.",
          "Single document writes are always atomic; use sessions for multi-document operations.",
          "session.withTransaction automatically handles transient commit retries."
        ]
      }
    ]
  },
  {
    id: 16,
    title: "Part 16 — MySQL & Relational Engineering: Normalization, Joins & ACID",
    badge: "MySQL Relational",
    color: "#0284c7",
    sections: [
      {
        id: "16.1",
        title: "34. Relational Modeling: 1NF, 2NF, 3NF & Junction Tables",
        content: `### 1. Database Normalization Forms
- **First Normal Form (1NF)**: Every cell contains an **atomic value** (no comma-separated strings or arrays stored in a single text column). Every row has a Primary Key.
- **Second Normal Form (2NF)**: Meets 1NF, and all non-key columns depend on the **entire composite primary key**, not just a subset (eliminates partial dependencies).
- **Third Normal Form (3NF)**: Meets 2NF, and no non-key column depends on another non-key column (eliminates **transitive dependencies**, e.g. storing customer address in the orders table instead of referencing \`customer_id\`).

### 2. Many-to-Many Relationships & Junction Tables
To model Many-to-Many relationships (e.g. Products and Categories, Students and Courses):
- Create a **Junction Table** (Associative Table) containing composite foreign keys:
\`\`\`sql
CREATE TABLE product_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
\`\`\``,
        comparisonTable: [
          { normalForm: "1NF", requirement: "Atomic values per column, unique primary key" },
          { normalForm: "2NF", requirement: "No partial dependencies on composite keys" },
          { normalForm: "3NF", requirement: "No transitive dependencies between non-key columns" }
        ],
        code: `// Schema Definition Example for 3NF Relational Structure
const CREATE_TABLES_SQL = \`
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
\`;`,
        keyTakeaways: [
          "Normalize up to 3NF to eliminate duplicate data and update anomalies.",
          "Use junction tables with composite primary keys for many-to-many relationships.",
          "Use DECIMAL(10, 2) for financial currencies; NEVER use FLOAT or DOUBLE."
        ]
      },
      {
        id: "16.2",
        title: "35. B-Tree Indexing, Leftmost-Prefix Rule & EXPLAIN ANALYZE",
        content: `### 1. How B-Tree Indexes Work
MySQL InnoDB stores indexes as balanced search trees (**B+ Trees**).
- Lookups, insertions, and deletions run in **$O(\log N)$** time.
- The leaf nodes form a doubly linked list, enabling lightning-fast range scans (\`WHERE age BETWEEN 20 AND 30\`).

### 2. The Leftmost-Prefix Rule in Composite Indexes
If you create a composite index on \`(last_name, first_name, date_of_birth)\`:
- ✅ Uses Index: \`WHERE last_name = 'Smith'\`
- ✅ Uses Index: \`WHERE last_name = 'Smith' AND first_name = 'John'\`
- ❌ **CANNOT USE INDEX**: \`WHERE first_name = 'John'\`! The query engine cannot skip the first column of the composite index, resulting in a full table scan!

### 3. Sargable Queries (Search Argument Able)
A query is **sargable** if the database engine can utilize an index:
- ❌ **Non-Sargable (Breaks Index)**: \`WHERE YEAR(created_at) = 2024\` (Wrapping column in function forces full table scan).
- ✅ **Sargable**: \`WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'\`.
- ❌ **Non-Sargable**: \`WHERE email LIKE '%gmail.com'\` (Leading wildcard cannot use B-tree index).`,
        comparisonTable: [
          { query: "WHERE YEAR(created_at) = 2024", sargable: "NO (Full table scan)", fix: "WHERE created_at >= '2024-01-01'" },
          { query: "WHERE name LIKE '%smith'", sargable: "NO (Leading wildcard)", fix: "Full-text search or reverse index" },
          { query: "WHERE status = 'PAID'", sargable: "YES (B-tree index lookup)", fix: "Index on status column" }
        ],
        code: `// Profiling MySQL Queries with EXPLAIN in Node.js
import mysql from 'mysql2/promise';

export async function profileQuery(pool) {
  const sql = \`
    EXPLAIN ANALYZE
    SELECT o.id, o.total_amount, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.status = 'PAID'
    ORDER BY o.created_at DESC
    LIMIT 20
  \`;
  const [rows] = await pool.query(sql);
  console.log(rows[0]['EXPLAIN']);
}`,
        keyTakeaways: [
          "InnoDB indexes use balanced B+ Trees with O(log N) lookup complexity.",
          "Composite indexes only accelerate queries matching the leftmost prefix.",
          "Never wrap indexed columns in functions (YEAR, LOWER) in WHERE clauses."
        ]
      },
      {
        id: "16.3",
        title: "36. ACID Transactions, 4 Isolation Levels & Deadlocks",
        content: `### 1. ACID Guarantees
- **Atomicity**: All operations succeed or the entire transaction rolls back.
- **Consistency**: The database transitions from one valid state to another, enforcing constraints.
- **Isolation**: Concurrent transactions cannot interfere with one another.
- **Durability**: Committed transactions are permanently written to write-ahead logs (WAL) on disk.

### 2. The 4 ANSI SQL Isolation Levels
1. **Read Uncommitted**: Suffers from **Dirty Reads** (reading uncommitted data that later rolls back).
2. **Read Committed**: Prevents dirty reads. Suffers from **Non-Repeatable Reads** (re-reading the same row returns different values).
3. **Repeatable Read (MySQL InnoDB Default)**: Prevents dirty and non-repeatable reads. Uses Multi-Version Concurrency Control (MVCC) snapshots.
4. **Serializable**: Strict serial execution using range locks. Zero concurrency anomalies, but highest locking overhead and deadlock frequency.

### 3. Diagnosing and Preventing Deadlocks
A deadlock occurs when Transaction A locks Row 1 and waits for Row 2, while Transaction B locks Row 2 and waits for Row 1.
- **Prevention Rule**: Always access and lock tables/rows in the **exact same consistent order** across all transactions!`,
        comparisonTable: [
          { isolationLevel: "Read Uncommitted", dirtyReads: "YES", nonRepeatable: "YES", phantomReads: "YES" },
          { isolationLevel: "Read Committed", dirtyReads: "NO", nonRepeatable: "YES", phantomReads: "YES" },
          { isolationLevel: "Repeatable Read (MySQL Default)", dirtyReads: "NO", nonRepeatable: "NO", phantomReads: "NO (via Next-Key Locks)" },
          { isolationLevel: "Serializable", dirtyReads: "NO", nonRepeatable: "NO", phantomReads: "NO" }
        ],
        code: `// Safe MySQL Transaction with Row-Level Locking (Pessimistic Locking)
import mysql from 'mysql2/promise';

export async function reserveInventory(pool, productId, quantity) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock row exclusively for update using FOR UPDATE:
    const [rows] = await connection.execute(
      'SELECT stock FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );

    const product = rows[0];
    if (!product || product.stock < quantity) {
      throw new Error('Insufficient inventory stock');
    }

    // Deduct stock:
    await connection.execute(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, productId]
    );

    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}`,
        keyTakeaways: [
          "MySQL InnoDB defaults to Repeatable Read isolation.",
          "Use SELECT ... FOR UPDATE to acquire exclusive row locks and prevent race condition overselling.",
          "Always lock rows in a consistent order to prevent deadlocks."
        ]
      }
    ]
  }
];

const targetPath = path.resolve(__dirname, 'node_notes_parts_9_to_16.json');
fs.writeFileSync(targetPath, JSON.stringify(parts9to16, null, 2), 'utf8');
console.log('Successfully wrote scratch/node_notes_parts_9_to_16.json with 8 parts and 18 sections.');
