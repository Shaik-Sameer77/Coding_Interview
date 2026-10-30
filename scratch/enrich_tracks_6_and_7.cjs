const fs = require('fs');
const path = require('path');

const batch2 = require('./node_notes_parts_9_to_16.json');

// ========================================================
// TRACK 6: CORS, HELMET & BACKEND SECURITY (Part 11)
// ========================================================

const track6SecuritySections = [
  {
    id: "11.1",
    title: "23. CORS Masterclass: Same-Origin Policy, Preflights & 7 Express Configurations",
    content: `### 1. Topic Overview & Mental Model
**Cross-Origin Resource Sharing (CORS)** is an HTTP-header-based mechanism enforced by **web browsers** that permits a web application running at one origin to access resources from a different origin.
- **What is an Origin?**: An origin is defined by the exact combination of **Scheme (protocol) + Hostname + Port**:
  - \`https://app.example.com:443\` is a different origin from \`http://app.example.com:443\` (different scheme).
  - \`https://app.example.com\` is a different origin from \`https://api.example.com\` (different subdomain).
  - \`http://localhost:3000\` is a different origin from \`http://localhost:4000\` (different port).
- **The Same-Origin Policy (SOP)**: A foundational browser security sandbox. By default, JavaScript executing on \`https://malicious-site.com\` cannot read private data from \`https://yourbank.com/api/balance\`.
- **CRITICAL MISCONCEPTION: CORS is NOT Authentication or Server Security**:
  - CORS is **enforced exclusively by web browsers**.
  - Non-browser clients (\`curl\`, Postman, Python scripts, mobile apps, attacker botnets) **completely ignore CORS headers**! They can send any HTTP request directly to your backend.
  - CORS does **not** protect your API from unauthorized backend-to-backend requests; that requires **Authentication** (API keys, JWTs, OAuth tokens).

### 2. Simple Requests vs Preflight (OPTIONS) Requests
1. **Simple Requests**:
   - Meet strict criteria: Method is \`GET\`, \`HEAD\`, or \`POST\`; only standard headers (\`Accept\`, \`Accept-Language\`, \`Content-Type\`); and \`Content-Type\` is only \`text/plain\`, \`multipart/form-data\`, or \`application/x-www-form-urlencoded\`.
   - The browser sends the request immediately with an \`Origin\` header.
2. **Preflight Requests**:
   - Triggered if the request uses \`PUT\`, \`PATCH\`, \`DELETE\`, custom headers (e.g. \`Authorization\`, \`X-Correlation-Id\`), or \`Content-Type: application/json\`.
   - The browser sends an automatic **\`OPTIONS\` preflight request** asking the server: *"Am I allowed to send this request?"*
   - Server responds with \`Access-Control-Allow-Origin\`, \`Access-Control-Allow-Methods\`, and \`Access-Control-Allow-Headers\`.
3. **Preflight Caching (\`Access-Control-Max-Age\`)**:
   - Preflight requests double network latency. Use \`maxAge: 86400\` (24 hours) to instruct browsers to cache the preflight response.

### 3. The Credentialed Requests Rule
- When sending cookies or HTTP Basic Auth across origins (\`withCredentials: true\` in Axios or \`credentials: 'include'\` in Fetch):
  - The server must respond with **\`Access-Control-Allow-Credentials: true\`**.
  - **THE SPECIFICATION MANDATE**: If \`Allow-Credentials: true\`, **\`Access-Control-Allow-Origin\` CANNOT BE \`*\` (WILDCARD)**! Browsers strictly reject the response and block JavaScript access. The server must dynamically reflect the exact requesting origin!
  - Always send **\`Vary: Origin\`** so caching proxies (CDNs) do not serve the cached origin response to other users.

### 4. Debugging CORS Issues in Browser DevTools
- Open DevTools $\\to$ **Network Tab** $\\to$ Filter by Fetch/XHR.
- Look for the \`OPTIONS\` preflight request. Inspect Response Headers:
  - Is \`Access-Control-Allow-Origin\` present? Does it match the browser's \`Origin\` header?
  - If sending JWT in \`Authorization\` header, is \`Authorization\` listed in \`Access-Control-Allow-Headers\`?
  - Does the console say: *"Response to preflight request doesn't pass access control check"*? Check if an auth middleware rejected the \`OPTIONS\` request before CORS middleware executed!`,
    comparisonTable: [
      {
        aspect: "CORS Header",
        header: "Access-Control-Allow-Origin",
        purpose: "Declares allowed origin (e.g. 'https://app.com' or '*')"
      },
      {
        aspect: "CORS Header",
        header: "Access-Control-Allow-Credentials",
        purpose: "Must be 'true' if cookies/authorization tokens are sent"
      },
      {
        aspect: "CORS Header",
        header: "Access-Control-Allow-Methods",
        purpose: "Permitted HTTP verbs ('GET,POST,PUT,PATCH,DELETE,OPTIONS')"
      },
      {
        aspect: "CORS Header",
        header: "Access-Control-Allow-Headers",
        purpose: "Permitted custom request headers ('Content-Type,Authorization')"
      },
      {
        aspect: "CORS Header",
        header: "Access-Control-Expose-Headers",
        purpose: "Exposes custom backend headers to client JS ('X-Total-Count')"
      },
      {
        aspect: "CORS Header",
        header: "Access-Control-Max-Age",
        purpose: "Caches preflight OPTIONS response in browser (seconds)"
      }
    ],
    code: `// 7 Complete Express.js CORS Configurations

import express from 'express';
import cors from 'cors';

const app = express();

// ==========================================================
// 1. PUBLIC API (Allows all origins, zero credentials)
// ==========================================================
const publicCors = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
});

// ==========================================================
// 2. SINGLE SPECIFIC FRONTEND ORIGIN
// ==========================================================
const singleOriginCors = cors({
  origin: 'https://dashboard.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// ==========================================================
// 3. ALLOWLIST (Dynamic Validation for Dev + Prod)
// ==========================================================
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://staging.example.com',
  'https://app.example.com'
];

export const dynamicAllowlistCors = cors({
  origin: (origin, callback) => {
    // 💡 Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true); // Origin allowed
    } else {
      // 5. REJECTED ORIGIN: Return friendly CORS rejection
      callback(new Error('Blocked by CORS policy: Origin not allowed'), false);
    }
  },
  // 4. COOKIE-BASED AUTHENTICATION (Credentials Allowed)
  credentials: true, // Requires specific origin! NEVER '*' with credentials: true!
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
  exposedHeaders: ['X-Total-Count', 'Content-Range'],
  // 6. PREFLIGHT CACHING (Caches preflight for 24 hours = 86400s)
  maxAge: 86400
});

// Mount the dynamic CORS handler
app.use(dynamicAllowlistCors);`,
    keyTakeaways: [
      "CORS is a browser security mechanism, NOT an authentication system; non-browser clients (curl, bots) bypass it.",
      "Access-Control-Allow-Origin: * CANNOT be combined with credentials: true; browsers strictly block the response.",
      "Always set maxAge (e.g. 86400) to cache preflight OPTIONS requests and eliminate redundant round-trips.",
      "Always allow !origin in your allowlist function to accommodate mobile apps and server-to-server communications."
    ]
  },
  {
    id: "11.2",
    title: "24. Helmet 8+ Deep-Dive: Security Headers, CSP Directives & Production Hardening",
    content: `### 1. Topic Overview & Mental Model
**Helmet** is the industry-standard security middleware for Express.js (over 20 million weekly downloads).
- It secures Express applications by automatically configuring **15 HTTP security headers**.
- **What Helmet Does**: Sets defensive HTTP response headers that instruct modern web browsers to disable dangerous behaviors, enforce HTTPS, block clickjacking, and restrict script execution sources.
- **What Helmet Does NOT Do**: It does not sanitize SQL inputs, does not protect against prototype pollution, does not authenticate users, and does not replace input validation with Zod.
- **Mental Model**: The Body Armor. Helmet does not teach your soldiers martial arts (application logic), but it provides a Kevlar vest and helmet (HTTP headers) that shields them from stray shrapnel (browser-based exploits).

### 2. Common Security Headers in Helmet 8+
1. **Content-Security-Policy (CSP)**:
   - The most powerful security header. Restricts where scripts, styles, images, and fonts can be loaded from, mitigating Cross-Site Scripting (XSS) and data exfiltration.
2. **Strict-Transport-Security (HSTS)**:
   - \`Strict-Transport-Security: max-age=15552000; includeSubDomains\`. Tells browsers to **always** communicate over HTTPS, automatically upgrading HTTP links and preventing SSL-stripping attacks.
3. **X-Content-Type-Options**:
   - Sets \`nosniff\`. Prevents browsers from "MIME-sniffing" a response away from the declared \`Content-Type\` (e.g., executing a \`.txt\` file as executable JavaScript).
4. **Referrer-Policy**:
   - Defaults to \`no-referrer\`. Prevents the browser from sending the full URL (which might contain sensitive token query parameters) in the \`Referer\` header when navigating to third-party sites.
5. **Frame Protection (Clickjacking Defense)**:
   - Modern standard uses CSP directive \`frame-ancestors 'none'\` (or legacy \`X-Frame-Options: DENY\`) to prevent attackers embedding your banking portal inside an invisible iframe.
6. **Cross-Origin Policies (COOP, COEP, CORP)**:
   - \`Cross-Origin-Opener-Policy\`: Isolates your browsing context from cross-origin windows, mitigating Spectre side-channel attacks.`,
    comparisonTable: [
      {
        aspect: "Security Header",
        header: "Content-Security-Policy (CSP)",
        vulnerabilityDefended: "Cross-Site Scripting (XSS), Data injection, Exfiltration"
      },
      {
        aspect: "Security Header",
        header: "Strict-Transport-Security (HSTS)",
        vulnerabilityDefended: "Man-In-The-Middle (MITM), SSL Stripping"
      },
      {
        aspect: "Security Header",
        header: "X-Content-Type-Options: nosniff",
        vulnerabilityDefended: "MIME-confusion attacks, Executable script spoofing"
      },
      {
        aspect: "Security Header",
        header: "X-Frame-Options / frame-ancestors",
        vulnerabilityDefended: "Clickjacking / UI Redress attacks"
      },
      {
        aspect: "Security Header",
        header: "Cross-Origin-Resource-Policy (CORP)",
        vulnerabilityDefended: "Cross-origin resource leakages"
      }
    ],
    code: `// Production Helmet 8+ Configuration for Modern Express APIs
import express from 'express';
import helmet from 'helmet';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Production Hardened Helmet 8+ Setup
app.use(helmet({
  // 1. Content Security Policy (Customized for production API / SPA)
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*.s3.amazonaws.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameAncestors: ["'none'"], // Replaces X-Frame-Options: DENY in modern CSP
      objectSrc: ["'none'"],      // Blocks legacy Flash / Java applets
      upgradeInsecureRequests: isProduction ? [] : null // Auto-upgrade HTTP in prod
    }
  },

  // 2. HTTP Strict Transport Security (HSTS)
  hsts: isProduction ? {
    maxAge: 31536000, // 1 Year in seconds
    includeSubDomains: true,
    preload: true
  } : false, // Disabled in local HTTP development!

  // 3. Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Set false if loading external images from CDNs
  
  // 4. Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));`,
    keyTakeaways: [
      "Helmet sets 15 defensive HTTP headers; it protects the browser surface, not SQL or database injections.",
      "CSP frame-ancestors 'none' blocks clickjacking attacks in modern browsers.",
      "HSTS must be disabled in local development (http://localhost) and enabled with maxAge: 1 year in production HTTPS.",
      "Set crossOriginEmbedderPolicy: false if your frontend embeds images or assets from third-party CDNs."
    ]
  },
  {
    id: "11.3",
    title: "25. OWASP Top 10 for Node.js: Attack Scenarios, Vulnerable Examples & Remediations",
    content: `### 1. Topic Overview & Mental Model
The Open Web Application Security Project (OWASP) documents the most critical security risks facing web applications.
- In Node.js backend development, applying defense-in-depth requires analyzing the exact **Attack Scenario**, identifying the **Vulnerable Pattern**, writing the **Remediated Code**, and understanding **Residual Limitations**.

### 2. Major Threat Scenarios & Remediations
1. **Broken Access Control (OWASP #1)**:
   - *Attack*: Changing \`GET /api/documents/100\` to \`101\` (IDOR - Insecure Direct Object Reference).
   - *Vulnerability*: The controller checks that the user is logged in, but fails to check if the document belongs to \`req.user.id\`.
   - *Remediation*: Always scope queries by owner: \`WHERE id = :docId AND user_id = :userId\`.
2. **SQL & NoSQL Injection (OWASP #3)**:
   - *Attack*: Submitting \`' OR 1=1 --\` in SQL or \`{ "$gt": "" }\` in MongoDB login body.
   - *Vulnerability*: String concatenation in SQL (\`SELECT * FROM users WHERE email = '\${email}'\`) or passing raw JSON to MongoDB query (\`db.users.find({ password: req.body.password })\`).
   - *Remediation*: Parameterized queries in SQL (\`db.query('SELECT * FROM users WHERE email = $1', [email])\`) and Zod string validation for MongoDB.
3. **Cross-Site Scripting (XSS) & CSRF**:
   - *XSS*: Malicious script stored in database and executed in another user's browser. Mitigated by context-aware output encoding and CSP headers.
   - *CSRF*: An attacker website tricks an authenticated user's browser into submitting requests using their cookies. Mitigated by \`SameSite=Strict/Lax\` cookies and CSRF tokens.
4. **Server-Side Request Forgery (SSRF)**:
   - *Attack*: User submits a webhook URL pointing to AWS metadata: \`http://169.254.169.254/latest/meta-data/\`.
   - *Remediation*: Restrict outgoing URLs to an allowlist of public IPs and block private RFC 1918 addresses (\`10.0.0.0/8\`, \`192.168.0.0/16\`, \`169.254.169.254\`).`,
    comparisonTable: [
      {
        aspect: "OWASP Threat",
        vulnerableCode: "db.query(\`SELECT * FROM users WHERE id = \${id}\`)",
        fixedCode: "db.query('SELECT * FROM users WHERE id = $1', [id])",
        defenseMechanism: "Parameterized query / Prepared Statement"
      },
      {
        aspect: "OWASP Threat",
        vulnerableCode: "Users.find({ username: req.body.username })",
        fixedCode: "const { username } = z.string().parse(req.body.username)",
        defenseMechanism: "Zod primitive validation blocks NoSQL object injection"
      },
      {
        aspect: "OWASP Threat",
        vulnerableCode: "fetch(req.body.webhookUrl)",
        fixedCode: "validatePublicIpOnly(req.body.webhookUrl)",
        defenseMechanism: "Blocks private RFC 1918 & AWS metadata IP addresses"
      }
    ],
    code: `// Remediations for OWASP Top 10 Threats

// 1. Defending Against Insecure Direct Object References (IDOR)
export async function getDocumentSafely(documentId, requestingUserId) {
  // ❌ VULNERABLE: const doc = await db.documents.findById(documentId);
  // ✅ SECURE: Hard-scoped to requesting user's identity!
  const doc = await db.documents.findOne({
    _id: documentId,
    ownerId: requestingUserId
  });
  if (!doc) throw new Error('Document not found or unauthorized');
  return doc;
}

// 2. Defending Against NoSQL Query Injection in Mongoose / MongoDB
export function sanitizeNoSqlInput(userInput) {
  // If user passes: { "password": { "$ne": null } }
  if (typeof userInput === 'object' && userInput !== null) {
    throw new Error('Invalid input: Expected string, received object operator');
  }
  return String(userInput);
}`,
    keyTakeaways: [
      "Broken Access Control is OWASP #1; always verify resource ownership in the database query, not just on the frontend.",
      "Always use parameterized queries for SQL; never concatenate user input into SQL strings.",
      "Validate query inputs with Zod to prevent NoSQL object injection in MongoDB ($gt, $ne).",
      "Block internal IP addresses (169.254.169.254, 127.0.0.1) when fetching user-supplied URLs to prevent SSRF."
    ]
  },
  {
    id: "11.4",
    title: "26. Application Hardening: Request Caps, Rate Limiting, Replay Attacks & Idempotency",
    content: `### 1. Topic Overview & Mental Model
Advanced backend security requires defending against stateful and network-level attacks:
- **Replay Attacks**: An attacker intercepts a signed network request (e.g. an order creation or webhook) and re-sends the exact same bytes 5 minutes later to duplicate the action.
  - *Defense*: Require a **Timestamp** and a **Nonce (Unique token)** in the signature header. Reject requests if the timestamp is older than 5 minutes or if the nonce was already used (cached in Redis).
- **Idempotency Keys**: Financial and transaction endpoints must accept an \`Idempotency-Key\` header. The backend stores the response in Redis for 24 hours. If network drops and the client retries, the server returns the cached response without re-processing!
- **Rate Limiting**: Defending authentication endpoints against distributed brute-force attacks using Redis sliding-window algorithms.`,
    comparisonTable: [
      {
        aspect: "Hardening Mechanism",
        threat: "Replay Attacks",
        solution: "Timestamp validation (<5m) + Nonce storage in Redis"
      },
      {
        aspect: "Hardening Mechanism",
        threat: "Duplicate Payment Charges",
        solution: "Idempotency-Key header + Redis transaction locking"
      },
      {
        aspect: "Hardening Mechanism",
        threat: "Timing Attacks on Passwords/Signatures",
        solution: "crypto.timingSafeEqual() constant-time comparison"
      }
    ],
    code: `// Idempotency Middleware and Replay Attack Protection with Redis
import crypto from 'node:crypto';

export function createIdempotencyMiddleware(redisClient) {
  return async (req, res, next) => {
    // Only apply to state-mutating requests (POST / PATCH)
    if (req.method !== 'POST' && req.method !== 'PATCH') return next();

    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
      return res.status(400).json({ error: 'Idempotency-Key header is required for this operation' });
    }

    const cacheKey = \`idempotency:\${idempotencyKey}\`;
    const cachedResponse = await redisClient.get(cacheKey);

    if (cachedResponse) {
      console.log('⚡ Returning cached idempotent response. Zero duplicate operations executed.');
      const parsed = JSON.parse(cachedResponse);
      return res.status(parsed.status).json(parsed.body);
    }

    // Intercept res.json to cache response for 24 hours
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisClient.setEx(cacheKey, 86400, JSON.stringify({ status: res.statusCode, body }));
      }
      return originalJson(body);
    };

    next();
  };
}`,
    keyTakeaways: [
      "Use Idempotency-Key headers on all financial and creation endpoints to safely support retries without duplicate operations.",
      "Defend against replay attacks by requiring signed timestamps and rejecting requests older than 5 minutes.",
      "Store idempotency responses in Redis with a 24-hour expiration window.",
      "Always use constant-time comparison (crypto.timingSafeEqual) when validating webhook signatures and security tokens."
    ]
  }
];

// Update batch 2 with updated Part 11
batch2[2] = {
  id: 11,
  title: "Part 11 — Backend Security: Dedicated CORS, Helmet & OWASP Top 10",
  badge: "Defensive Security",
  color: "#ef4444",
  sections: track6SecuritySections
};
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_9_to_16.json'), JSON.stringify(batch2, null, 2));
console.log('Successfully updated Part 11 with full Track 6 Security coverage!');

// ========================================================
// TRACK 7: TYPESCRIPT FOR BACKEND SERVICES (Part 14)
// ========================================================

const track7TypeScriptSections = [
  {
    id: "14.1",
    title: "30. TypeScript Foundations for Backend Services: Generics, tsconfig & ESM/CJS Compilation",
    content: `### 1. Topic Overview & Mental Model
TypeScript provides static compile-time type safety for JavaScript applications.
- **In Backend Development**: While client-side TypeScript catches UI prop mismatches, backend TypeScript guarantees data integrity across database models, repository contracts, external API clients, and HTTP DTOs.
- **Mental Model**: The Blueprint & Structural Inspector. TypeScript is the structural engineer verifying your building drawings (types) before construction begins. Once compiled to JavaScript, all blueprints are discarded (**Type Erasure**). The building stands on its own at runtime.

### 2. Strict Compiler Configuration (\`tsconfig.json\`)
Production backend services must operate under strict TypeScript flags:
1. \`"strict": true\`: Enables all strict type-checking options.
2. \`"strictNullChecks": true\`: Prevents \`null\` and \`undefined\` from being assigned to other types, eliminating the "billion-dollar mistake".
3. \`"noImplicitAny": true\`: Flags any variable whose type cannot be inferred as an error.
4. \`"module": "NodeNext"\` & \`"moduleResolution": "NodeNext"\`: Matches modern Node.js native ECMAScript Modules resolution, enforcing explicit file extensions (\`import x from './x.js'\`).
5. \`"target": "ES2022"\`: Emits clean, modern JavaScript supporting native class fields, top-level await, and private properties.

### 3. Development vs Production Execution
- **Local Development**: Fast in-memory transpile and execution using **\`tsx\`** (built on esbuild) or **\`ts-node\`**:
  \`npx tsx watch src/index.ts\`
- **Production Build**: Full type-checking and compilation using the official compiler **\`tsc\`**:
  \`tsc && node dist/index.js\`
  *Rule*: Never run \`ts-node\` in high-throughput production containers due to JIT compilation memory overhead. Always compile to native JavaScript first!`,
    comparisonTable: [
      {
        aspect: "TypeScript Feature",
        concept: "any",
        safety: "ZERO: Disables all type checking completely",
        recommendation: "BAN in production codebases"
      },
      {
        aspect: "TypeScript Feature",
        concept: "unknown",
        safety: "MAXIMAL: Must be narrowed before any property access",
        recommendation: "Use for unvalidated input & catch blocks"
      },
      {
        aspect: "TypeScript Feature",
        concept: "never",
        safety: "Represents values that can never occur",
        recommendation: "Exhaustive switch checks on unions"
      },
      {
        aspect: "TypeScript Feature",
        concept: "satisfies",
        safety: "Validates against a type without widening the inferred type",
        recommendation: "Modern config schemas (TS 4.9+)"
      }
    ],
    code: `// Generic Backend Repository Contract with Constraints & Type Guards
import { z } from 'zod';

// 1. Generic Entity Interface with Constraint
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Generic Repository Interface Contract
export interface IRepository<T extends BaseEntity, ID extends string> {
  findById(id: ID): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  deleteById(id: ID): Promise<boolean>;
}

// 3. User-Defined Type Guard (is)
export interface AdminUser extends BaseEntity {
  role: 'admin';
  permissions: string[];
}
export interface StandardUser extends BaseEntity {
  role: 'user';
}
export type User = AdminUser | StandardUser;

export function isAdminUser(user: User): user is AdminUser {
  return user.role === 'admin' && Array.isArray((user as AdminUser).permissions);
}`,
    keyTakeaways: [
      "Always configure tsconfig with strict: true, strictNullChecks: true, and module: NodeNext.",
      "Use unknown instead of any for catch blocks and untrusted data to enforce type narrowing.",
      "Compile with tsc for production Docker builds; use tsx watch for fast local development.",
      "Use generic constraints (T extends BaseEntity) to enforce shared fields across repository contracts."
    ]
  },
  {
    id: "14.2",
    title: "31. Backend Typing: Express Handlers, Typed DTOs, Zod Runtime Safety & DB Entities",
    content: `### 1. Topic Overview & Mental Model
A common interview pitfall is assuming that defining an \`interface UserDto\` protects your backend from bad data:
\`\`\`typescript
// ❌ FALSE SENSE OF SECURITY:
app.post('/users', (req: Request<{}, {}, UserDto>, res) => {
  // TypeScript assumes req.body matches UserDto!
  // At runtime, an attacker can send { "age": "INVALID" } and crash your database!
});
\`\`\`
- **The Solution: Pair Compile-Time Types with Runtime Validation**:
  - Use **Zod** to validate the untrusted incoming runtime JSON.
  - Derive the static TypeScript type using \`z.infer<typeof schema>\`.
  - Compile-time types protect your developer code; runtime validation protects your server from the outside world!

### 2. Typing Express Request Handlers
Express's \`Request\` interface accepts 5 generic parameters:
\`Request<ParamsDictionary, ResBody, ReqBody, ReqQuery, Locals>\`
- \`Params\`: Route parameters (\`/users/:id\` $\\to$ \`{ id: string }\`).
- \`ResBody\`: Shape of the response JSON.
- \`ReqBody\`: Shape of the parsed request body.
- \`ReqQuery\`: Shape of query string parameters (\`{ sort?: 'asc' | 'desc' }\`).`,
    comparisonTable: [
      {
        aspect: "Dimension",
        tsInterface: "TypeScript Interface",
        zodSchema: "Zod Schema"
      },
      {
        aspect: "Validation Timing",
        tsInterface: "Compile-Time only (Erased during build)",
        zodSchema: "Runtime (Validates every incoming HTTP payload)"
      },
      {
        aspect: "Protection Against Hackers",
        tsInterface: "ZERO: Completely invisible at runtime",
        zodSchema: "MAXIMAL: Rejects invalid types and malicious fields"
      },
      {
        aspect: "Type Derivation",
        tsInterface: "Hand-authored",
        zodSchema: "Automatic: type Dto = z.infer<typeof schema>"
      }
    ],
    code: `// Strictly Typed Express Handler with Zod Runtime Validation
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 1. Zod Schema for Route Parameters
export const UserParamsSchema = z.object({
  id: z.string().uuid('Invalid User UUID format')
});
export type UserParams = z.infer<typeof UserParamsSchema>;

// 2. Zod Schema for Request Body
export const UpdateUserBodySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'manager', 'admin']).optional()
}).strict(); // Reject unexpected fields!
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

// 3. Typed Express Handler
export async function updateUserHandler(
  req: Request<UserParams, { success: boolean; data: any }, UpdateUserBody>,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate params and body at runtime!
    const validParams = UserParamsSchema.parse(req.params);
    const validBody = UpdateUserBodySchema.parse(req.body);

    console.log(\`Updating user \${validParams.id} with:\`, validBody);
    
    // validBody is 100% typed and 100% verified at runtime!
    res.status(200).json({ success: true, data: { id: validParams.id, ...validBody } });
  } catch (error) {
    next(error); // Passes ZodError to central error handler
  }
}`,
    keyTakeaways: [
      "TypeScript interfaces are completely erased at runtime; runtime validation with Zod is mandatory at API boundaries.",
      "Use z.infer<typeof schema> to generate compile-time TypeScript types directly from runtime schemas.",
      "Express Request accepts 4 primary generics: Request<Params, ResBody, ReqBody, ReqQuery>.",
      "Always call .strict() on Zod object schemas to reject unexpected parameters and prevent mass assignment bugs."
    ]
  },
  {
    id: "14.3",
    title: "32. Complete Typed CRUD API Example: Route, Controller, Service & DB Repository",
    content: `### 1. Topic Overview & Mental Model
A production-grade backend service written in TypeScript enforces end-to-end type safety from the incoming HTTP route through the business service and into the database repository.
- **Contract-First Architecture**:
  - Request DTOs are validated with Zod.
  - The Service layer defines explicit input and output types.
  - The Repository implements a typed generic interface.
  - Database row nullability is explicitly mapped to prevent runtime undefined crashes.`,
    comparisonTable: [
      {
        aspect: "Layer",
        responsibility: "DTO / Schema",
        typeGuaranteed: "Incoming JSON shape validated by Zod at runtime"
      },
      {
        aspect: "Layer",
        responsibility: "Controller",
        typeGuaranteed: "Typed Express Request/Response bindings"
      },
      {
        aspect: "Layer",
        responsibility: "Service",
        typeGuaranteed: "Pure business contracts with domain return types"
      },
      {
        aspect: "Layer",
        responsibility: "Repository",
        typeGuaranteed: "Database entity typing (SQL nullability / Mongoose documents)"
      }
    ],
    code: `// End-to-End Typed CRUD Architecture in TypeScript
import { Request, Response, NextFunction, Router } from 'express';
import { z } from 'zod';

// 1. Domain Entity & Schemas
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().nonnegative('Stock cannot be negative')
}).strict();
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;

// 2. Typed Repository Interface
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDTO): Promise<Product>;
  delete(id: string): Promise<boolean>;
}

// 3. Typed Service Layer
export class ProductService {
  constructor(private readonly productRepo: IProductRepository) {}

  async createNewProduct(dto: CreateProductDTO): Promise<Product> {
    return await this.productRepo.create(dto);
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      const err = new Error('Product not found');
      (err as any).statusCode = 404;
      throw err;
    }
    return product;
  }
}

// 4. Typed Controller Layer
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (req: Request<{}, {}, CreateProductDTO>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedBody = CreateProductSchema.parse(req.body);
      const product = await this.productService.createNewProduct(validatedBody);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  };
}`,
    keyTakeaways: [
      "End-to-end TypeScript architecture bridges the API boundary (Zod) with the domain layer (Services) and database layer (Repositories).",
      "Injecting typed interfaces (IProductRepository) into services enables effortless mocking during unit testing.",
      "Always map database nullability explicitly (Product | null) to prevent undefined property crashes.",
      "Use private readonly constructor parameters for clean, boilerplate-free Dependency Injection in TypeScript."
    ]
  }
];

// Update batch 2 with updated Part 14
batch2[5] = {
  id: 14,
  title: "Part 14 — TypeScript for Backend Services: Deep-Dive & Typed CRUD Architecture",
  badge: "Type-Safe Backend",
  color: "#3b82f6",
  sections: track7TypeScriptSections
};
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_9_to_16.json'), JSON.stringify(batch2, null, 2));
console.log('Successfully updated Part 14 with full Track 7 TypeScript coverage!');
