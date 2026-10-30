// scratch/generate_security_and_ts_notes.cjs
// Script to generate comprehensive, exhaustive notes for Part 11 (CORS, Helmet & Backend Security)
// and Part 14 (TypeScript for Node.js and Backend Engineering) matching all prompt requirements.

const fs = require('fs');
const path = require('path');

const p11_sections = [
  {
    id: "11.1",
    title: "23. CORS Masterclass: Same-Origin Policy, Preflights & 7 Express Configurations",
    content: `### 1. Topic Overview & Mental Model
**Cross-Origin Resource Sharing (CORS)** is an HTTP-header-based security protocol enforced **exclusively by web browsers**. It allows a web application running on one origin to securely request resources hosted on a different origin.

#### What is an Origin?
An origin is the exact tuple of three components:
1. **Scheme/Protocol** (e.g. \`http://\` vs \`https://\`)
2. **Hostname** (e.g. \`api.chrona.io\` vs \`chrona.io\` vs \`localhost\`)
3. **Port Number** (e.g. \`:3000\` vs \`:5173\` vs \`:443\`)

If **any single component differs**, the browser classifies the request as **Cross-Origin**.
- \`https://example.com:443\` and \`http://example.com:443\` $\\to$ **Different Origin** (scheme mismatch)
- \`https://example.com\` and \`https://api.example.com\` $\\to$ **Different Origin** (host mismatch)
- \`http://localhost:3000\` and \`http://localhost:5173\` $\\to$ **Different Origin** (port mismatch)

#### The Same-Origin Policy (SOP) & Why Browsers Enforce It
Without the Same-Origin Policy, any malicious website (\`evil.com\`) loaded in your browser could issue background \`fetch()\` requests to \`yourbank.com/api/transfer\`. Because your browser automatically includes session cookies for \`yourbank.com\`, the malicious script could steal bank balances, read private emails, or initiate financial transactions.
SOP is the browser's sandbox wall: **by default, JavaScript running on Origin A cannot read data loaded from Origin B**.

#### What CORS Is NOT
- **CORS is NOT Authentication**: CORS does not verify *who* the user is; it only specifies *which web frontend origins* are allowed to read the HTTP response in a browser environment.
- **CORS is NOT Server-to-Server Access Control**: CORS headers are ignored by non-browser HTTP clients like \`curl\`, Postman, Python scripts, backend microservices, and native mobile apps (iOS/Android). These clients do not run inside a browser sandbox, do not enforce SOP, and can forge the \`Origin\` header at will. Backend security against non-browser clients requires **API keys, OAuth2 tokens, mTLS, and IP-based rate limiting**.

---

### 2. Request Classification: Simple vs Preflight Requests

Browsers divide cross-origin requests into two categories:

#### A. Simple Requests
A request is classified as "Simple" if it satisfies **all** of the following criteria:
1. **HTTP Method**: Must be \`GET\`, \`HEAD\`, or \`POST\`.
2. **Custom Headers**: Only CORS-safelisted headers are allowed: \`Accept\`, \`Accept-Language\`, \`Content-Language\`, and \`Content-Type\`.
3. **Content-Type**: Must be strictly one of:
   - \`application/x-www-form-urlencoded\`
   - \`multipart/form-data\`
   - \`text/plain\`
4. No event listeners are registered on any \`XMLHttpRequestUpload\` object.

**Execution Flow**: The browser sends the request immediately with an \`Origin: https://app.chrona.io\` header. The server processes the request. If the server response includes a matching \`Access-Control-Allow-Origin\` header, the browser delivers the response to JavaScript. If not, the browser suppresses the response and throws a CORS error. **Notice**: The server still executed the mutation!

#### B. Preflight Requests (OPTIONS)
If a request violates any simple request condition (e.g. uses \`PUT\`, \`DELETE\`, \`PATCH\`, custom header \`Authorization: Bearer <token>\`, or \`Content-Type: application/json\`), the browser **MUST** first send a **Preflight Request**.
- **Method**: \`OPTIONS\`
- **Headers Sent by Browser**:
  - \`Origin: https://app.chrona.io\`
  - \`Access-Control-Request-Method: PUT\`
  - \`Access-Control-Request-Headers: authorization, content-type\`
- **Purpose**: Checks whether the server understands CORS and gives permission for the actual HTTP request before executing any state-changing logic on the server.
- **Status Code**: The server must reply with HTTP \`204 No Content\` or \`200 OK\` containing the allowed origins, methods, and headers. Only after a successful preflight does the browser transmit the real request.

---

### 3. Core CORS Headers Anatomy

| Header | Sent By | Purpose & Constraint |
| :--- | :--- | :--- |
| \`Origin\` | Browser | Informs the server of the scheme, host, and port where the request originated. Cannot be modified by browser JS. |
| \`Access-Control-Allow-Origin\` | Server | Specifies which origin can read the response (e.g. \`https://app.chrona.io\` or wildcard \`*\`). |
| \`Access-Control-Allow-Methods\` | Server | Comma-separated list of permitted HTTP verbs for preflight (e.g. \`GET, POST, PUT, DELETE, OPTIONS\`). |
| \`Access-Control-Allow-Headers\` | Server | Comma-separated list of permitted request headers (e.g. \`Content-Type, Authorization, X-Requested-With\`). |
| \`Access-Control-Allow-Credentials\` | Server | Must be explicitly \`true\` if the client sends cookies or authorization headers via \`credentials: 'include'\`. |
| \`Access-Control-Expose-Headers\` | Server | Whitelists custom server response headers (e.g. \`X-Total-Count, X-RateLimit-Remaining\`) that frontend JS can read. |
| \`Access-Control-Max-Age\` | Server | Maximum seconds the browser can cache the preflight response (e.g. \`86400\` = 24 hours) to eliminate redundant \`OPTIONS\` round-trips. |
| \`Vary: Origin\` | Server | Critical cache instruction for CDNs and reverse proxies. Prevents caching an allow-origin header intended for Origin A and serving it to Origin B. |

#### Why Wildcards (\`*\`) Cannot Be Combined With Credentials
Under RFC 6454 and W3C CORS specifications, **\`Access-Control-Allow-Origin: *\` CANNOT be used when \`Access-Control-Allow-Credentials: true\`**.
- **Reason**: If a server responded with \`Access-Control-Allow-Origin: *\` and \`credentials: true\`, any arbitrary malicious website visited by a user could send authenticated requests carrying the user's session cookies and read their confidential bank statements, health records, or private messages.
- If credentials are included, the server **must** echo back the exact, validated requesting origin in \`Access-Control-Allow-Origin\`, and pair it with \`Vary: Origin\`.

---

### 4. DevTools Debugging Playbook & CORS vs Network Errors

When a CORS error occurs:
1. **CORS Error vs Network Error**: In Chrome/Firefox DevTools, the console displays: \`Access to fetch at '...' from origin '...' has been blocked by CORS policy\`. In the Network tab, the request status may read \`(failed)\` or \`CORS error\`, but the server logs might show \`200 OK\`! Why? Because the server completed the work, but the browser quarantined the response payload because CORS response headers were missing or invalid.
2. **Debugging Steps in DevTools**:
   - Open DevTools $\\to$ **Network Tab** $\\to$ filter by \`Fetch/XHR\`.
   - Inspect the **Preflight OPTIONS** request (if present). Did it return \`204\` or \`200\`? If it returned \`404\`, \`401\`, or \`500\`, your Express router did not handle \`OPTIONS\` requests before authentication middleware!
   - Inspect the **Response Headers** of the actual request: Does \`Access-Control-Allow-Origin\` match the \`Origin\` in the **Request Headers**?
   - Check if \`Access-Control-Allow-Credentials: true\` is missing while \`withCredentials = true\` was set on the client.
3. **The Double-Header Reverse Proxy Trap**: If Nginx or Cloudflare injects \`add_header Access-Control-Allow-Origin '*';\` and Express *also* sets \`Access-Control-Allow-Origin\`, the browser receives \`Access-Control-Allow-Origin: *, https://app.chrona.io\` and immediately fails because RFC forbids multiple comma-separated values. Always manage CORS at **one single layer** (either reverse proxy or application).`,
    comparisonTable: [
      { aspect: "Simple vs Preflight", detail: "Simple requests send only GET/HEAD/POST with safelisted headers; preflight requests fire an OPTIONS check first." },
      { aspect: "Wildcard vs Credentials", detail: "Access-Control-Allow-Origin: * CANNOT be combined with Access-Control-Allow-Credentials: true (RFC security rule)." },
      { aspect: "Vary: Origin", detail: "Mandatory when origins are dynamically echoed; tells reverse proxies and CDNs to cache responses per-origin." },
      { aspect: "Non-Browser Clients", detail: "Curl, Postman, mobile apps, and microservices bypass CORS entirely; backend security requires tokens/auth." },
      { aspect: "Preflight Caching", detail: "Access-Control-Max-Age caches OPTIONS responses up to browser limits, saving 1 round-trip per API call." }
    ],
    code: `// Comprehensive Express CORS Architectures (7 Production Patterns)
import express from 'express';
import cors from 'cors';

const app = express();
app.set('trust proxy', 1);

// ============================================================================
// PATTERN 1: Public Open API (Zero Credentials, Wildcard Allowed)
// ============================================================================
export const publicApiCors = cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400 // Cache preflight for 24 hours
});

// ============================================================================
// PATTERN 2: Single Dedicated Frontend Origin
// ============================================================================
export const singleOriginCors = cors({
  origin: 'https://app.chrona.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
});

// ============================================================================
// PATTERN 3: Environment-Specific Small Allowlist (Dev + Prod)
// ============================================================================
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',          // Vite local dev
  'http://localhost:3000',          // Next.js local dev
  'https://staging.chrona.io',      // Staging
  'https://app.chrona.io'           // Production
]);

export const allowlistCors = cors({
  origin: (origin, callback) => {
    // !origin allows non-browser clients (mobile apps, server-to-server, curl)
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(\`Origin \${origin} rejected by CORS policy\`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Idempotency-Key'],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Remaining'],
  maxAge: 86400
});

// ============================================================================
// PATTERN 4: Cookie-Based Authentication with Credentials & Vary: Origin
// ============================================================================
export const cookieAuthCors = (req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    // CRITICAL: Prevent CDN cache poisoning across multiple clients
    res.setHeader('Vary', 'Origin');
  }

  // Handle explicit preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};

// ============================================================================
// PATTERN 5: Rejected Origin with Clean JSON Response
// ============================================================================
export const secureDynamicCors = (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({
      error: 'ForbiddenOrigin',
      message: \`Cross-Origin request from origin '\${origin}' is not permitted.\`
    });
  }
  next();
};

// ============================================================================
// PATTERN 6: Explicit Preflight Route Handling
// ============================================================================
app.options('*', cors({
  origin: Array.from(ALLOWED_ORIGINS),
  credentials: true,
  maxAge: 86400
}));

// ============================================================================
// PATTERN 7: Full Production Application Mount
// ============================================================================
app.use(allowlistCors);
app.use(express.json({ limit: '100kb' }));

app.get('/api/v1/profile', (req, res) => {
  res.json({ user: 'sarah_staff_eng', role: 'architect' });
});

app.listen(4000, () => {
  console.log('Secure CORS API server running on port 4000');
});`,
    keyTakeaways: [
      "CORS is enforced exclusively by browsers; non-browser tools (curl, mobile apps) ignore it and can spoof Origin.",
      "Access-Control-Allow-Origin: * CANNOT be used when Access-Control-Allow-Credentials is true (strict RFC rule).",
      "Always set 'Vary: Origin' when dynamically echoing origins to prevent reverse proxies and CDNs from cache-poisoning responses.",
      "Always allow !origin in allowlist functions so native mobile applications and internal backend services are not rejected.",
      "Configure Access-Control-Max-Age: 86400 on preflight OPTIONS responses to avoid redundant network round-trips."
    ]
  },
  {
    id: "11.2",
    title: "24. Helmet 8+ Deep-Dive: Security Headers, CSP Directives & Production Hardening",
    content: `### 1. Topic Overview & Mental Model
**Helmet** is the canonical security header middleware for Node.js and Express.js applications. It acts as an automated security shield that configures defensive HTTP response headers.

#### What Helmet Does
Helmet sets **15 standard HTTP security headers** that instruct modern web browsers to restrict dangerous features, isolate site processes, prevent content sniffing, enforce encrypted HTTPS transport, and prevent clickjacking.

#### What Helmet Does NOT Do
- Helmet is **not an authentication or authorization system**.
- Helmet **does not sanitize incoming JSON or query parameters**.
- Helmet **does not prevent SQL injection, NoSQL injection, or command injection**.
- Helmet **does not protect backend databases or internal memory buffers**.
- It is strictly a **browser-side defensive posture** tool.

---

### 2. Comprehensive Security Headers Breakdown

#### 1. Content-Security-Policy (CSP)
The most powerful defense against Cross-Site Scripting (XSS) and data injection. CSP defines an allowlist of trusted sources for scripts, styles, images, frames, and network connections.
- \`default-src 'self'\`: Only allow resources from the identical origin by default.
- \`script-src 'self'\`: Block inline scripts (\`<script>alert(1)</script>\`) and \`eval()\`.
- \`style-src 'self' 'unsafe-inline'\`: Permitted stylesheets (often requires unsafe-inline for CSS-in-JS).
- \`img-src 'self' data: https:\`: Permitted image sources (allows Base64 data URIs and HTTPS assets).
- \`connect-src 'self' https://api.chrona.io\`: Whitelists domains that JavaScript can contact via \`fetch()\` or WebSocket.
- \`font-src 'self' https://fonts.gstatic.com\`: Whitelists web fonts.
- \`object-src 'none'\`: Completely disables Flash, Java applets, and legacy browser plugins.
- \`base-uri 'self'\`: Prevents attackers from injecting \`<base href="https://evil.com">\` to hijack relative links.
- \`frame-ancestors 'none'\`: Modern, superior replacement for \`X-Frame-Options\`; forbids embedding your site in \`<iframe>\` tags anywhere.

#### 2. Strict-Transport-Security (HSTS)
Forces browsers to interact with your server **only over HTTPS**, even if a user explicitly types \`http://\`.
- \`max-age=31536000\`: Tells the browser to remember this rule for 1 year (in seconds).
- \`includeSubDomains\`: Enforces HTTPS across all present and future subdomains (\`*.chrona.io\`).
- \`preload\`: Authorizes inclusion in the browser vendor's hardcoded HSTS preload list.
- **Localhost Caveat**: **NEVER enable HSTS in local development!** If you enable HSTS on \`localhost\`, your browser will permanently refuse to connect to \`http://localhost\` on any port without HTTPS, breaking local developer workflows.

#### 3. X-Content-Type-Options
Sets \`nosniff\`. Prevents the browser from MIME-sniffing a response away from the declared \`Content-Type\`.
- *Attack Vector*: An attacker uploads a malicious \`.jpg\` file that contains JavaScript. If MIME-sniffing is enabled, the browser might sniff the HTML/JS tags, treat the JPEG as script, and execute it in the victim's session.

#### 4. Referrer-Policy
Controls how much referrer information (URL path and query parameters) is sent in the \`Referer\` header when navigating or fetching resources.
- Default in Helmet 8: \`strict-origin-when-cross-origin\`. Sends full path on same-origin HTTPS requests, sends only origin (\`https://chrona.io\`) on cross-origin HTTPS requests, and sends zero referrer data on insecure HTTP downgrades.

#### 5. Cross-Origin Policies (COOP, CORP, COEP)
Designed to defend against microarchitectural side-channel attacks like **Spectre** and **Meltdown**:
- **Cross-Origin-Opener-Policy (COOP)**: \`same-origin\` isolates your browsing context group, ensuring cross-origin popups opened via \`window.open()\` cannot access \`window.opener\`.
- **Cross-Origin-Resource-Policy (CORP)**: \`same-origin\` prevents other websites from embedding your backend's images, audio, or JSON responses in their pages.
- **Cross-Origin-Embedder-Policy (COEP)**: \`require-corp\` ensures your document cannot load any cross-origin resource that hasn't explicitly granted permission.

---

### 3. Development vs Production Considerations & Third-Party Nonces

1. **Development vs Production Differences**:
   - In development: Hot Module Replacement (HMR) in Vite/Webpack requires \`'unsafe-eval'\` in \`script-src\` and \`ws://localhost:*\` in \`connect-src\`. HSTS must be completely disabled.
   - In production: Strict CSP without unsafe-eval, HSTS enabled with \`preload\`, and secure cookies enforced.
2. **Reverse Proxies & SSL Termination**:
   - When deploying behind AWS ALB, Cloudflare, or Nginx, the reverse proxy terminates HTTPS and forwards plain HTTP to Node.js on port 3000/8080.
   - You **MUST** configure \`app.set('trust proxy', 1)\`. Without this, Express sees \`req.secure === false\` and Helmet/HSTS headers will not behave correctly.
3. **Third-Party Script Integration via Nonces**:
   - When embedding third-party scripts (Google Tag Manager, Stripe.js, PostHog), avoid using \`'unsafe-inline'\`. Instead, generate a cryptographically secure random **nonce** per request: \`res.locals.cspNonce = crypto.randomBytes(16).toString('base64');\` and include \`'nonce-\${res.locals.cspNonce}'\` in CSP \`script-src\`.`,
    comparisonTable: [
      { aspect: "CSP vs X-Frame-Options", detail: "CSP frame-ancestors 'none' is the modern standard; X-Frame-Options: DENY is legacy fallback for older browsers." },
      { aspect: "HSTS in Dev vs Prod", detail: "Must be disabled in local dev to avoid breaking http://localhost; enabled with max-age=31536000; preload in prod." },
      { aspect: "MIME Sniffing (nosniff)", detail: "Forces browsers to trust Content-Type header; prevents executing disguised script uploads as JavaScript." },
      { aspect: "Script Nonces vs unsafe-inline", detail: "Nonces generate unique base64 tokens per request, allowing safe dynamic scripts while blocking injected XSS." }
    ],
    code: `// Production Helmet 8+ Configuration for Express.js
import express from 'express';
import helmet from 'helmet';
import crypto from 'node:crypto';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Step 1: Trust Reverse Proxy (AWS ALB, Cloudflare, Nginx)
app.set('trust proxy', 1);

// Step 2: Per-Request Cryptographic Nonce Generator for Dynamic Scripts
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Step 3: Modern Helmet 8 Configuration
app.use((req, res, next) => {
  helmet({
    // Content-Security-Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // In dev allow unsafe-eval for Vite HMR; in prod require strict nonce
          isProd ? \`'nonce-\${res.locals.cspNonce}'\` : "'unsafe-eval'",
          'https://js.stripe.com', // Third-party trusted provider
          'https://apis.google.com'
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: [
          "'self'",
          'https://api.chrona.io',
          'https://api.stripe.com',
          // WebSocket connection for local dev HMR
          !isProd && 'ws://localhost:*'
        ].filter(Boolean),
        frameSrc: ["'self'", 'https://js.stripe.com'],
        frameAncestors: ["'none'"], // Prevent clickjacking
        objectSrc: ["'none'"],      // Block legacy plugins
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: isProd ? [] : null // Force HTTPS in prod
      }
    },

    // Strict-Transport-Security (Only in Production with valid TLS)
    strictTransportSecurity: isProd ? {
      maxAge: 31536000,           // 1 Year
      includeSubDomains: true,    // Apply to *.chrona.io
      preload: true               // Candidate for HSTS preload list
    } : false,                    // Disable on localhost!

    // Prevent MIME-Type Sniffing
    xContentTypeOptions: true,

    // Referrer Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },

    // Frame Protection (Fallback for legacy browsers)
    xFrameOptions: { action: 'deny' },

    // Cross-Origin Isolation Policies
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    crossOriginEmbedderPolicy: false, // Set to 'require-corp' if using SharedArrayBuffer

    // Hide X-Powered-By: Express
    hidePoweredBy: true,

    // X-DNS-Prefetch-Control
    xXssProtection: false // Deprecated in modern browsers; CSP takes precedence
  })(req, res, next);
});

app.get('/', (req, res) => {
  // Pass nonce into HTML rendering templates if using SSR
  res.send(\`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Secure Helmet Application</title>
      </head>
      <body>
        <h1>Protected by Helmet 8+</h1>
        <script nonce="\${res.locals.cspNonce}">
          console.log('Authorized script executed with cryptographic nonce');
        </script>
      </body>
    </html>
  \`);
});

export default app;`,
    keyTakeaways: [
      "Helmet automates 15 HTTP security headers; it is a browser defensive layer and does NOT replace input sanitization or auth.",
      "NEVER enable HSTS in local development; it causes permanent HTTPS redirect failures on localhost.",
      "Always configure 'trust proxy' in Express when running behind reverse proxies so HSTS and secure cookies function properly.",
      "Use cryptographic per-request nonces instead of 'unsafe-inline' to safely run dynamic client scripts under strict CSP.",
      "MIME-sniffing protection (nosniff) prevents attackers from uploading disguised scripts as images to execute in victim browsers."
    ]
  },
  {
    id: "11.3",
    title: "25. OWASP Top 10 for Node.js: Attack Scenarios, Vulnerable Examples & Remediations",
    content: `### 1. Topic Overview & Mental Model
The **Open Web Application Security Project (OWASP) Top 10** represents the consensus on the most critical security vulnerabilities affecting backend applications.
In senior full-stack interviews, quoting definitions is insufficient: you must be able to demonstrate the **Attack Scenario**, dissect the **Vulnerable Implementation**, write the **Production-Grade Remediation**, and state the **Residual Limitations**.

---

### 2. Major Threat Analysis & Dissection

#### 1. Broken Access Control (Insecure Direct Object Reference - IDOR)
- **Attack Scenario**: User A (ID \`usr_101\`) logs in and retrieves invoice \`/api/invoices/inv_999\`. User A edits the URL to \`/api/invoices/inv_998\` belonging to User B. The server fetches the record by ID without checking whether the authenticated user owns that invoice.
- **Vulnerable Code**:
\`\`\`javascript
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  res.json(invoice); // ❌ Zero tenant ownership check!
});
\`\`\`
- **Remediation**:
\`\`\`javascript
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoice = await db.invoices.findOne({
    id: req.params.id,
    organizationId: req.user.organizationId // ✅ Scoped to tenant
  });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});
\`\`\`
- **Residual Limitations**: Multi-tenant database querying must be enforced consistently across all joins and aggregate pipelines, or handled via PostgreSQL Row-Level Security (RLS).

---

#### 2. SQL Injection (SQLi)
- **Attack Scenario**: Attacker inputs \`admin' OR '1'='1\` into an email login field. If concatenated directly into SQL, it alters query logic to return the first user record without password matching.
- **Vulnerable Code**:
\`\`\`javascript
const query = \`SELECT * FROM users WHERE email = '\${req.body.email}'\`;
const [rows] = await db.query(query); // ❌ Raw concatenation
\`\`\`
- **Remediation**:
\`\`\`javascript
const [rows] = await db.execute(
  'SELECT id, password_hash, role FROM users WHERE email = ?',
  [req.body.email] // ✅ Parameterized query via mysql2/pg prepared statement
);
\`\`\`
- **Residual Limitations**: Parameterization handles data values, but **NOT** dynamic table names or column names in \`ORDER BY ?\`. Dynamic identifiers must be validated against a strict hardcoded allowlist.

---

#### 3. NoSQL Operator Injection (MongoDB)
- **Attack Scenario**: An attacker submits JSON payload \`{ "username": "admin", "password": { "$gt": "" } }\`. MongoDB executes \`password > ""\`, which evaluates to \`true\` for any string, bypassing password authentication completely!
- **Vulnerable Code**:
\`\`\`javascript
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password // ❌ If req.body.password is an object { $gt: "" }, query evaluates true!
  });
});
\`\`\`
- **Remediation**:
\`\`\`javascript
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize()); // Strips all keys starting with '$' or containing '.'

// Or validate strictly with Zod:
const loginSchema = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(8) // ✅ Enforces string primitive! Rejects object payload
});
\`\`\`
- **Residual Limitations**: Sanitization does not replace runtime schema validation; schema validation with Zod is mandatory.

---

#### 4. Command Injection
- **Attack Scenario**: A system administration feature pings an IP address. The user submits \`8.8.8.8; cat /etc/passwd\`.
- **Vulnerable Code**:
\`\`\`javascript
import { exec } from 'node:child_process';
exec(\`ping -c 4 \${req.query.ip}\`, (err, stdout) => { ... }); // ❌ Spawns shell
\`\`\`
- **Remediation**:
\`\`\`javascript
import { execFile } from 'node:child_process';
import net from 'node:net';

if (!net.isIP(req.query.ip)) throw new Error('Invalid IP');
// ✅ execFile executes binary directly without invoking a shell interpreter
execFile('ping', ['-c', '4', req.query.ip], (err, stdout) => { ... });
\`\`\`
- **Residual Limitations**: Never invoke child processes if a native Node.js API or library is available.

---

#### 5. Server-Side Request Forgery (SSRF)
- **Attack Scenario**: A webhook tester or avatar downloader accepts a URL and fetches it server-side: \`req.body.url = "http://169.254.169.254/latest/meta-data/iam/security-credentials/"\`. The backend fetches AWS EC2 instance credentials and returns them to the attacker!
- **Remediation**:
  - Parse the URL with WHATWG \`new URL(rawUrl)\`.
  - Resolve the hostname to an IP using \`dns.promises.resolve4()\`.
  - Validate that the IP does NOT fall into private CIDR ranges (\`127.0.0.0/8\`, \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`, \`169.254.169.254\`).
  - Mitigate **DNS Rebinding** by connecting directly to the verified resolved IP address.`,
    comparisonTable: [
      { aspect: "SQLi vs NoSQLi", detail: "SQLi exploits string concatenation in syntax; NoSQLi exploits MongoDB BSON query operator injection ($gt, $ne)." },
      { aspect: "IDOR Defense", detail: "Always scope database mutations by the authenticated session's tenant/organization ID, never trust client-sent IDs." },
      { aspect: "SSRF Defense", detail: "Resolve DNS before fetching; strictly block private RFC-1918 ranges and AWS metadata endpoint 169.254.169.254." },
      { aspect: "Command Injection", detail: "Replace child_process.exec (shell) with execFile or spawn with explicit argument arrays and strict IP/path validation." }
    ],
    code: `// Complete OWASP Hardening Demonstration: Safe SSRF & NoSQL Injection Defense
import express from 'express';
import dns from 'node:dns/promises';
import net from 'node:net';
import ipaddr from 'ipaddr.js'; // npm i ipaddr.js
import { z } from 'zod';

const app = express();
app.use(express.json());

// ============================================================================
// DEFENSE 1: SSRF Safe Fetcher with Private IP Blocking & DNS Rebinding Check
// ============================================================================
export async function safeFetchUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Unsupported protocol');
  }

  // Step 1: Resolve DNS to concrete IPv4 addresses
  const addresses = await dns.resolve4(parsed.hostname);
  if (!addresses || addresses.length === 0) {
    throw new Error('Could not resolve hostname');
  }

  // Step 2: Validate that NONE of the resolved IPs are in private/internal ranges
  for (const ip of addresses) {
    const addr = ipaddr.parse(ip);
    const range = addr.range(); // 'loopback', 'private', 'linkLocal', etc.
    if (['loopback', 'private', 'linkLocal', 'carrierGradeNat'].includes(range)) {
      throw new Error(\`Forbidden SSRF destination IP: \${ip} (range: \${range})\`);
    }
    // Block AWS/Cloud Metadata IP specifically
    if (ip === '169.254.169.254') {
      throw new Error('Cloud metadata endpoint access strictly blocked');
    }
  }

  // Step 3: Fetch directly using the verified target
  const response = await fetch(parsed.toString(), {
    redirect: 'error', // Crucial: Do not blindly follow redirects to internal network!
    signal: AbortSignal.timeout(5000)
  });

  return await response.text();
}

// ============================================================================
// DEFENSE 2: Strict Zod Input Validation Defeating NoSQL Operator Injections
// ============================================================================
const safeUserLoginSchema = z.object({
  email: z.string().email().max(255),
  // Enforces string primitive: completely rejects JSON objects like { "$gt": "" }
  password: z.string().min(8).max(128)
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = safeUserLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'ValidationFailed', details: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  // Safely query database using pure strings
  res.json({ status: 'Input safely validated against NoSQL injection vectors' });
});

export default app;`,
    keyTakeaways: [
      "Broken Access Control (IDOR) is the #1 vulnerability; always scope queries by req.user.organizationId.",
      "Parameterize all SQL queries; never concatenate user inputs into query strings or ORDER BY clauses.",
      "Zod schema validation enforces string primitives, immediately neutralizing MongoDB NoSQL operator ($gt) injection.",
      "Defend against SSRF by resolving DNS, blocking private/loopback/metadata (169.254.169.254) IPs, and disabling redirect following.",
      "Replace child_process.exec with execFile or spawn to prevent arbitrary shell command chaining."
    ]
  },
  {
    id: "11.4",
    title: "26. OWASP Top 10 for Node.js (Part 2): Misconfig, Uploads, Path Traversal & ReDoS",
    content: `### 1. Topic Overview & Mental Model
This section addresses system-level, file-system, and configuration attack vectors that frequently lead to Remote Code Execution (RCE) and Denial of Service (DoS) in Node.js production environments.

---

### 2. Major Threat Analysis & Dissection

#### 1. Insecure File Uploads
- **Attack Scenario**: A user uploads an avatar image. An attacker uploads a file named \`avatar.php\` or an SVG containing \`<script>alert(document.cookie)</script>\`. If stored in a public web directory, executing the file leads to RCE or Stored XSS.
- **Vulnerabilities**:
  - Trusting client-supplied \`file.originalname\` (enables path traversal like \`../../bin/app\`).
  - Trusting client-supplied \`Content-Type\` header (attacker sets \`image/jpeg\` on a PHP script).
- **Production Defense**:
  1. Generate a new cryptographic random filename: \`crypto.randomUUID() + ext\`.
  2. Inspect **Magic Bytes** using \`file-type\` library (reads binary file signature, not client headers).
  3. Disallow executable extensions (\`.php, .sh, .exe, .js, .svg\`).
  4. Store files outside the web root or directly in **AWS S3** with \`Content-Disposition: attachment\`.

---

#### 2. Path Traversal (Directory Traversal)
- **Attack Scenario**: A file download endpoint accepts a filename: \`req.query.filename = "../../../../etc/passwd"\`. If passed directly to \`fs.readFile\`, it reads sensitive operating system files.
- **Vulnerable Code**:
\`\`\`javascript
const filePath = path.join(__dirname, 'public', req.query.filename);
fs.createReadStream(filePath).pipe(res); // ❌ Vulnerable to ../ escapes!
\`\`\`
- **Remediation**:
\`\`\`javascript
import path from 'node:path';

const SAFE_DIR = path.resolve(__dirname, 'public');
const targetPath = path.resolve(SAFE_DIR, req.query.filename);

// Ensure the resolved path strictly starts with the safe directory root
if (!targetPath.startsWith(SAFE_DIR + path.sep)) {
  return res.status(403).json({ error: 'Access denied: Path traversal detected' });
}
\`\`\`

---

#### 3. Regular Expression Denial of Service (ReDoS)
- **Attack Scenario**: A naive email or URL regex contains overlapping groups with repetition, such as \`/^([a-zA-Z0-9]+)*$/\`. An attacker submits a long input like \`aaaaaaaaaaaaaaaaaaaaaaaaaaaa!\`. The V8 regex engine enters **catastrophic backtracking**, pegging the single Node.js event loop thread at 100% CPU for minutes and freezing the entire server for all users.
- **Remediation**:
  - Audit regexes with \`safe-regex\` or \`recheck\`.
  - Avoid nested quantifiers like \`(a+)+\`.
  - Use modern regex timeouts or delegate complex validation to linear-time parsers like Zod or validator.js.

---

#### 4. Security Misconfiguration
- **Vulnerabilities**:
  - Running in production without \`NODE_ENV=production\` (causes Express to leak verbose stack traces in error responses).
  - Leaving default admin passwords or exposed diagnostic endpoints (\`/__debug\`, \`/actuator\`).
  - Committing \`.env\` files or leaving \`.git\` folder accessible in the static web root.
- **Remediation**:
  - Enforce \`NODE_ENV=production\` in Dockerfiles.
  - Standardize error formatting to strip \`stack\` in production environments.`,
    comparisonTable: [
      { aspect: "File Upload Defense", detail: "Generate random UUID names, inspect binary magic bytes with file-type, and isolate uploads in AWS S3." },
      { aspect: "Path Traversal Defense", detail: "Use path.resolve() and verify targetPath.startsWith(SAFE_DIR + path.sep) to prevent ../ escapes." },
      { aspect: "ReDoS Mitigation", detail: "Eliminate catastrophic backtracking by banning nested quantifiers (a+)+ and testing with safe-regex." },
      { aspect: "Error Normalization", detail: "Strictly suppress error.stack in production HTTP responses to prevent exposing internal file paths and library versions." }
    ],
    code: `// Secure File Upload & Path Traversal Defense Implementation
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type'; // npm i file-type

const app = express();
const UPLOAD_ROOT = path.resolve(process.cwd(), 'secure_storage');

// ============================================================================
// DEFENSE 1: Safe Path Traversal Validator
// ============================================================================
export function resolveSafePath(baseDir, requestedRelativePath) {
  const safeBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(safeBase, requestedRelativePath);

  // Strict check: must reside inside safeBase
  if (!resolvedTarget.startsWith(safeBase + path.sep)) {
    throw new Error('Path traversal attempt detected');
  }

  return resolvedTarget;
}

// ============================================================================
// DEFENSE 2: File Upload Magic Byte Inspection & UUID Sanitization
// ============================================================================
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function processUploadedFileBuffer(fileBuffer, originalFilename) {
  // Step 1: Inspect True Binary Magic Bytes (Do not trust user Content-Type!)
  const detectedType = await fileTypeFromBuffer(fileBuffer);

  if (!detectedType || !ALLOWED_MIME_TYPES.has(detectedType.mime)) {
    throw new Error(\`Invalid file content. Detected: \${detectedType?.mime || 'unknown'}\`);
  }

  // Step 2: Generate Safe Random UUID Filename with verified extension
  const safeFilename = \`\${crypto.randomUUID()}.\${detectedType.ext}\`;
  const destinationPath = resolveSafePath(UPLOAD_ROOT, safeFilename);

  // Step 3: Write safely to disk or stream to S3
  await fs.writeFile(destinationPath, fileBuffer);

  return { safeFilename, mime: detectedType.mime };
}

app.get('/api/files/:filename', async (req, res, next) => {
  try {
    const safePath = resolveSafePath(UPLOAD_ROOT, req.params.filename);
    res.sendFile(safePath);
  } catch (err) {
    res.status(403).json({ error: 'Access denied: invalid file path' });
  }
});

export default app;`,
    keyTakeaways: [
      "Never trust client-supplied filenames or Content-Type headers; inspect binary magic bytes using file-type.",
      "Prevent path traversal by verifying path.resolve(base, file).startsWith(base + path.sep).",
      "Avoid nested regex quantifiers like (a+)+ to prevent ReDoS catastrophic backtracking from freezing the Node.js event loop.",
      "Always set NODE_ENV=production to suppress internal framework stack traces and implementation details in error responses."
    ]
  },
  {
    id: "11.5",
    title: "27. Application Hardening: Request Caps, Rate Limiting, Replay Attacks & Idempotency",
    content: `### 1. Topic Overview & Mental Model
Application-level hardening addresses stateful, volumetric, and timing-based attacks that bypass standard firewalls. This includes memory exhaustion DoS, brute-force credential stuffing, API replay attacks, timing oracles, and double-billing race conditions.

---

### 2. Comprehensive Security Engineering Standards

#### 1. Request Body Size Limits
- **The Threat**: An attacker posts a 500MB JSON payload to \`/api/login\`. Node.js parses the entire payload in RAM, exhausting the V8 Heap (default ~1.4GB) and triggering an Out-Of-Memory (OOM) crash that terminates the process.
- **Remediation**:
\`\`\`javascript
app.use(express.json({ limit: '100kb' })); // Ample for standard API payloads
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
\`\`\`

#### 2. Sliding-Window Rate Limiting
- **The Threat**: Attackers run high-speed credential stuffing or scrape catalog pricing.
- **Remediation**: Implement a Redis-backed sliding-window rate limiter using \`express-rate-limit\` paired with \`rate-limit-redis\`. When running behind reverse proxies, configure \`app.set('trust proxy', 1)\` so the limiter extracts the real client IP from \`X-Forwarded-For\`.

#### 3. Secure Cookie Hygiene
Always configure session cookies with the full defensive flag suite:
- \`httpOnly: true\`: Blocks browser JavaScript from reading the cookie via \`document.cookie\` (mitigating session theft via XSS).
- \`secure: true\`: Ensures the cookie is only transmitted over encrypted HTTPS connections.
- \`sameSite: 'strict'\`: Eliminates CSRF attacks by forbidding the browser from sending the cookie on cross-site navigations.
- \`domain\` and \`path: '/'\`: Restrict scope strictly to your application origin.

#### 4. Cryptographic Timing Attacks & Timing-Safe Equal
- **The Threat**: When verifying secret tokens, API keys, or password hashes using standard equality \`token === expectedToken\`, the V8 engine short-circuits on the first non-matching character. An attacker measuring request response latency with microsecond precision can guess the secret character-by-character.
- **Remediation**: Always use \`crypto.timingSafeEqual(bufferA, bufferB)\` which executes in constant time regardless of where the mismatch occurs.

#### 5. Replay Attack Defense
- **The Threat**: An attacker intercepts an authorized financial request or webhook and replays the identical HTTP bytes 10 minutes later to double-credit an account.
- **Remediation**:
  1. Client sends a \`X-Timestamp\` and a cryptographically unique \`X-Nonce\` in the headers.
  2. Reject any request where \`Math.abs(Date.now() - timestamp) > 5 * 60 * 1000\` (5-minute tolerance window).
  3. Store the nonce in Redis with an atomic SETNX with a 5-minute TTL: \`redis.set(\`nonce:\${nonce}\`, '1', 'EX', 300, 'NX')\`. If the key already exists, reject the request as a replay.

#### 6. Idempotency Keys
- **The Threat**: A mobile network flakiness causes a client to timeout on \`POST /api/orders\`. The user taps "Pay" again, accidentally charging their credit card twice.
- **Remediation**: The client provides an \`Idempotency-Key\` header. The server uses an atomic Redis lock to ensure the order is processed exactly once, caching and returning the original result on duplicate requests.`,
    comparisonTable: [
      { aspect: "Body Limits vs DoS", detail: "express.json({ limit: '100kb' }) stops memory exhaustion crashes from multi-megabyte payloads." },
      { aspect: "Timing-Safe Comparison", detail: "crypto.timingSafeEqual executes in constant time; standard === leaks character matches via microsecond timing." },
      { aspect: "Replay vs Idempotency", detail: "Replay defense checks timestamp freshness + nonce TTL; idempotency keys return cached responses on retries." },
      { aspect: "Cookie Flags", detail: "httpOnly stops XSS theft, secure requires HTTPS, sameSite='strict' eliminates CSRF." }
    ],
    code: `// Production Application Hardening: Idempotency, Timing-Safe Checks & Replay Defense
import express from 'express';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';

const app = express();
app.set('trust proxy', 1);

// Step 1: Memory Exhaustion DoS Protection
app.use(express.json({ limit: '100kb' }));

// Step 2: Production Rate Limiting
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TooManyRequests', message: 'Rate limit exceeded. Please try again later.' }
});

// Step 3: Constant-Time Token Comparison Defeating Timing Attacks
export function timingSafeCompare(secretA, secretB) {
  const bufA = Buffer.from(secretA, 'utf-8');
  const bufB = Buffer.from(secretB, 'utf-8');

  // Length mismatch check in constant time
  if (bufA.length !== bufB.length) {
    // Compare dummy buffer to maintain constant timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

// Step 4: Replay Attack Defense Middleware (Timestamp + Nonce)
const simulatedRedisNonces = new Set();

export function replayAttackDefense(req, res, next) {
  const timestamp = parseInt(req.headers['x-timestamp'], 10);
  const nonce = req.headers['x-nonce'];

  if (!timestamp || !nonce) {
    return res.status(400).json({ error: 'Missing replay protection headers' });
  }

  // Reject requests older than 5 minutes or in future
  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    return res.status(401).json({ error: 'Request expired: timestamp drift too large' });
  }

  // Check Nonce uniqueness (In prod use Redis SET nonce:id 1 EX 300 NX)
  if (simulatedRedisNonces.has(nonce)) {
    return res.status(409).json({ error: 'Replay detected: duplicate nonce' });
  }

  simulatedRedisNonces.add(nonce);
  next();
}

app.post('/api/transactions', replayAttackDefense, (req, res) => {
  res.json({ success: true, transactionId: crypto.randomUUID() });
});

export default app;`,
    keyTakeaways: [
      "Limit body sizes with express.json({ limit: '100kb' }) to prevent memory exhaustion DoS.",
      "Use crypto.timingSafeEqual() for all secret comparisons to defeat microsecond timing attack oracles.",
      "Defend against replay attacks using a 5-minute timestamp tolerance window combined with Redis unique nonces.",
      "Always enforce httpOnly, secure, and sameSite: 'strict' flags on all authentication cookies.",
      "Use idempotency keys to ensure network retries on financial mutations do not result in double-charges."
    ]
  }
];

const p14_sections = [
  {
    id: "14.1",
    title: "30. TypeScript Core Type System: Fundamentals to Discriminated Unions",
    content: `### 1. Topic Overview & Mental Model
TypeScript provides static compile-time type safety over JavaScript. In backend engineering, TypeScript is not merely syntactic decoration: it forms the **contract backbone** between HTTP routes, business services, database entities, and external third-party APIs.

#### Type Annotations vs Type Inference
- **Type Inference**: The compiler automatically infers types based on assigned values. Best practice: let TypeScript infer local variables:
\`\`\`typescript
const timeoutMs = 5000; // Inferred as number (or literal 5000)
const users = ['Alice', 'Bob']; // Inferred as string[]
\`\`\`
- **Type Annotations**: Explicitly declared contracts. Mandatory for function parameters, public service returns, and exported interfaces.

---

### 2. Primitive, Object, and Compound Types

#### Arrays vs Tuples
- **Array**: Variable length collection of uniform types: \`const tags: string[] = ['prod', 'billing'];\`
- **Tuple**: Fixed-length, ordered sequence where each position has a specific type. In backend engineering, tuples model coordinates, database rows, or key-value pairs:
\`\`\`typescript
type GeoPoint = [latitude: number, longitude: number];
type KeyValuePair = readonly [key: string, value: unknown];
\`\`\`

#### Unions (\`|\`) and Intersections (\`&\`)
- **Union (\`A | B\`)**: A value can be *either* type A or type B. Used for status flags, nullable fields, and result states.
- **Intersection (\`A & B\`)**: Combines multiple contracts into one. Used for composing audit stamps or pagination wrappers:
\`\`\`typescript
type Timestamped = { createdAt: Date; updatedAt: Date };
type UserEntity = { id: string; email: string } & Timestamped;
\`\`\`

#### Interfaces vs Type Aliases
| Feature | \`interface\` | \`type\` Alias |
| :--- | :--- | :--- |
| **Declaration Merging** | Supported (can augment third-party types) | Forbidden (throws duplicate identifier error) |
| **Unions & Primitives** | Cannot represent primitive or union types | \`type Status = 'ACTIVE' \\| 'PENDING'\` |
| **Extending** | \`interface Admin extends User\` | \`type Admin = User & { role: 'admin' }\` |
| **Backend Best Practice** | Use for OOP Repositories, Express Augmentation | Use for DTOs, Unions, Tuples, and Utility Types |

#### Enums vs \`as const\` Object Literals
TypeScript \`enum\` produces real JavaScript runtime objects, causes issues with numerical reverse mapping, and complicates ESM tree-shaking.
**Modern Senior Standard**: Use immutable \`const\` objects with indexed union types:
\`\`\`typescript
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole]; // 'admin' | 'user' | 'moderator'
\`\`\`

---

### 3. Type Hierarchy & Narrowing: \`any\`, \`unknown\`, and \`never\`

- **\`any\`**: Completely disables the TypeScript compiler. A dangerous escape hatch that permits calling non-existent methods and bypasses all compile-time checks.
- **\`unknown\`**: The type-safe counterpart of \`any\`. Represents a value whose structure is unknown (e.g. parsed JSON, \`catch (err)\`). **You cannot access any properties on \`unknown\` without first narrowing it**.
- **\`never\`**: Represents a value that can *never* occur. Used for functions that never return (infinite loops, always throwing errors) and for **Exhaustiveness Checking** in discriminated unions.

#### Type Narrowing & Custom Type Guards
Narrowing refines a broad type into a specific type within a conditional branch:
1. \`typeof x === 'string'\` (for primitives)
2. \`x instanceof Date\` (for classes and prototypes)
3. \`'email' in obj\` (for property existence)
4. **Custom Type Predicate (\`val is T\`)**:
\`\`\`typescript
export function isHttpError(err: unknown): err is { statusCode: number; message: string } {
  return typeof err === 'object' && err !== null && 'statusCode' in err && 'message' in err;
}
\`\`\`

#### Discriminated Unions & Exhaustive Checking
A discriminated union has a shared literal tag (e.g. \`status\` or \`kind\`). Paired with a \`never\` check, it ensures at compile-time that every possible state is handled:
\`\`\`typescript
type PaymentState =
  | { status: 'PENDING' }
  | { status: 'SUCCEEDED'; transactionId: string }
  | { status: 'FAILED'; errorCode: string };

function handlePayment(state: PaymentState) {
  switch (state.status) {
    case 'PENDING': return 'Waiting...';
    case 'SUCCEEDED': return \`Paid: \${state.transactionId}\`;
    case 'FAILED': return \`Error: \${state.errorCode}\`;
    default: {
      const _exhaustiveCheck: never = state;
      throw new Error(\`Unhandled state: \${_exhaustiveCheck}\`);
    }
  }
}
\`\`\``,
    comparisonTable: [
      { aspect: "any vs unknown", detail: "any disables all compiler checks; unknown requires explicit narrowing before property access." },
      { aspect: "Enums vs as const", detail: "Enums emit verbose JS code with reverse-mapping quirks; as const objects are zero-cost and tree-shakeable." },
      { aspect: "interface vs type", detail: "Interfaces support declaration merging (Express augmentation); types support unions, tuples, and mapped types." },
      { aspect: "never & Exhaustiveness", detail: "Assigning unhandled switch cases to never guarantees at compile-time that all union members are handled." }
    ],
    code: `// TypeScript Core Type System: Discriminated Unions & Exhaustive Narrowing
export const OrderStatus = {
  CREATED: 'CREATED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// Discriminated Union Event System
export type OrderEvent =
  | { type: 'ORDER_CREATED'; orderId: string; amountCents: number; timestamp: Date }
  | { type: 'ORDER_SHIPPED'; orderId: string; trackingNumber: string; carrier: string }
  | { type: 'ORDER_CANCELLED'; orderId: string; reason: string };

export function formatOrderAuditMessage(event: OrderEvent): string {
  switch (event.type) {
    case 'ORDER_CREATED':
      return \`Order \${event.orderId} created for $\${(event.amountCents / 100).toFixed(2)}\`;
    case 'ORDER_SHIPPED':
      return \`Order \${event.orderId} shipped via \${event.carrier} (Track: \${event.trackingNumber})\`;
    case 'ORDER_CANCELLED':
      return \`Order \${event.orderId} cancelled. Reason: \${event.reason}\`;
    default: {
      // Compile-time assertion: If a new event is added to OrderEvent and not handled here,
      // TypeScript will raise a compile error because event cannot be assigned to never!
      const _unhandled: never = event;
      throw new Error(\`Unhandled event type: \${JSON.stringify(_unhandled)}\`);
    }
  }
}

// Custom Type Guard for Unknown Runtime Errors
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected internal error occurred';
}`,
    keyTakeaways: [
      "Avoid 'any' entirely in backend codebases; use 'unknown' when types are not yet known and narrow them safely.",
      "Prefer 'as const' object literals over TypeScript enums for zero-cost, clean JavaScript output.",
      "Use Discriminated Unions with 'never' exhaustiveness checks in switch statements to prevent unhandled runtime states.",
      "Implement custom type guards (val is T) to safely assert the structure of external errors and untyped payloads."
    ]
  },
  {
    id: "14.2",
    title: "31. Advanced Type Mechanics: Generics, Mapped & Conditional Types, infer & Utility Types",
    content: `### 1. Topic Overview & Mental Model
Advanced TypeScript mechanics allow you to write reusable, strongly-typed backend abstractions such as generic database repositories, pagination wrappers, type-safe API clients, and functional result containers.

---

### 2. Generics & Generic Constraints

Generics parameterize types just as functions parameterize values:
\`\`\`typescript
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
\`\`\`

#### Generic Constraints (\`extends\`)
Constraints restrict the shapes that can be passed into a generic parameter:
\`\`\`typescript
export interface BaseEntity {
  id: string;
  createdAt: Date;
}

// T must possess at least the fields in BaseEntity
export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt'>): Promise<T>;
}
\`\`\`

---

### 3. \`keyof\`, Indexed Access, and Mapped Types

- **\`keyof T\`**: Produces a union of all property names of \`T\`:
\`\`\`typescript
type UserKeys = keyof { id: string; name: string }; // 'id' | 'name'
\`\`\`
- **Indexed Access (\`T[K]\`)**: Look up the type of a specific property:
\`\`\`typescript
type UserRole = User['role'];
\`\`\`
- **Mapped Types**: Transform existing properties into new types:
\`\`\`typescript
// Make all fields optional and nullable
type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};
\`\`\`

---

### 4. Conditional Types & the \`infer\` Keyword

- **Conditional Types (\`T extends U ? X : Y\`)**: Choose between two types based on a type relationship.
- **The \`infer\` Keyword**: Extracts a type variable from within another type during conditional evaluation:
\`\`\`typescript
// Unwraps the inner value of a Promise
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

// Extracts the element type of an array
type ArrayElement<T> = T extends (infer E)[] ? E : never;
\`\`\`

---

### 5. Built-in Utility Types Matrix

| Utility Type | Description & Backend Use Case |
| :--- | :--- |
| \`Partial<T>\` | Makes all properties optional. Perfect for \`PATCH /api/users/:id\` update DTOs. |
| \`Required<T>\` | Makes all properties mandatory. Useful when validating completed configurations. |
| \`Readonly<T>\` | Prevents mutation of properties. Crucial for domain event payloads and config objects. |
| \`Record<K, T>\` | Constructs an object type with keys of type \`K\` and values of type \`T\`. Ideal for in-memory caches. |
| \`Pick<T, K>\` | Selects a specific subset of properties \`K\` from \`T\`. Used to project public user responses. |
| \`Omit<T, K>\` | Constructs a type by omitting keys \`K\` from \`T\`. Perfect for \`CreateUserDto\` (omitting auto-generated \`id\`). |
| \`Exclude<T, U>\` | Excludes types from union \`T\` that are assignable to \`U\`. |
| \`Extract<T, U>\` | Extracts types from union \`T\` that are assignable to \`U\`. |
| \`NonNullable<T>\` | Strips \`null\` and \`undefined\` from type \`T\`. |
| \`ReturnType<T>\` | Obtains the return type of a function. Essential when extracting service return signatures. |
| \`Parameters<T>\` | Obtains a tuple of a function's parameter types. |
| \`Awaited<T>\` | Recursively unwraps promises (native equivalent of \`UnwrapPromise\`). |

---

### 6. The \`satisfies\` Operator & Error Typing

#### \`satisfies\` vs \`as\` Type Assertion
- \`as Type\` **forces** the compiler to treat a value as \`Type\`, suppressing real errors and widening literal types.
- \`satisfies Type\` validates that a value conforms to \`Type\` **without widening the inferred type**:
\`\`\`typescript
type RouteConfig = Record<string, { method: 'GET' | 'POST'; auth: boolean }>;

const routes = {
  profile: { method: 'GET', auth: true },
  login: { method: 'POST', auth: false }
} satisfies RouteConfig;

// With 'satisfies', TypeScript knows routes.profile.method is exactly 'GET' (not widened to 'GET' | 'POST')!
\`\`\`

#### Typed Functional Error Handling: The \`Result<T, E>\` Pattern
Rather than throwing un-typed runtime exceptions that crash the server if uncaught, senior backend architects use the **Result Monad**:
\`\`\`typescript
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
\`\`\``,
    comparisonTable: [
      { aspect: "Pick vs Omit", detail: "Pick whitelists specific properties from an entity; Omit blacklists properties like auto-generated IDs." },
      { aspect: "as vs satisfies", detail: "as forces type casting and widens literals; satisfies validates contract conformance without losing exact types." },
      { aspect: "infer keyword", detail: "Deduce and extract nested types (like Promise resolution or function arguments) inside conditional types." },
      { aspect: "Result<T, E>", detail: "Replaces un-typed thrown exceptions with explicit, compiler-enforced success/failure discriminated unions." }
    ],
    code: `// Advanced Type Mechanics: Generic Repository, Result Monad & Utility Types
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ ok: true, value }),
  fail: <E>(error: E): Result<never, E> => ({ ok: false, error })
};

// Generic Domain Entity Interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Entity
export interface UserEntity extends BaseEntity {
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  isVerified: boolean;
}

// DTOs Generated via Utility Types
export type CreateUserDto = Omit<UserEntity, keyof BaseEntity | 'passwordHash' | 'isVerified'> & {
  passwordPlain: string;
};

export type UpdateUserDto = Partial<Pick<UserEntity, 'email' | 'role'>>;

export type UserResponseDto = Omit<UserEntity, 'passwordHash'>;

// Generic Base Repository Contract
export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: Partial<T>): Promise<T[]>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// In-Memory Implementation of Generic Repository
export class InMemoryRepository<T extends BaseEntity> implements IRepository<T> {
  private records = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.records.get(id) ?? null;
  }

  async findMany(filter?: Partial<T>): Promise<T[]> {
    const all = Array.from(this.records.values());
    if (!filter) return all;
    return all.filter(record =>
      Object.entries(filter).every(([key, value]) => record[key as keyof T] === value)
    );
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const id = \`rec_\${Math.random().toString(36).substring(2, 9)}\`;
    const now = new Date();
    const entity = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as unknown as T;

    this.records.set(id, entity);
    return entity;
  }

  async update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
    const existing = this.records.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    this.records.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.records.delete(id);
  }
}`,
    keyTakeaways: [
      "Use Generic constraints (T extends BaseEntity) to build reusable data structures and repositories.",
      "Employ Omit and Pick to derive clean Create, Update, and Response DTOs directly from your domain entities.",
      "Use 'satisfies' rather than 'as' type assertions to prevent accidental type widening and catch missing fields.",
      "Adopt the Result<T, E> discriminated union pattern to handle operational errors explicitly without unhandled promise crashes."
    ]
  },
  {
    id: "14.3",
    title: "32. Backend tsconfig Configuration, Execution Environments & Runtimes",
    content: `### 1. Topic Overview & Mental Model
A major source of developer friction in Node.js backend engineering is misconfiguring \`tsconfig.json\` across CommonJS vs ESM boundaries, compilation targets, source maps, and runtime execution runners.

---

### 2. Canonical Backend \`tsconfig.json\` Configuration

\`\`\`json
{
  "compilerOptions": {
    /* Base Language & Environment */
    "target": "ES2022",                          /* Modern JavaScript syntax support */
    "lib": ["ES2022"],                           /* Standard library definitions (no DOM needed) */
    "module": "NodeNext",                        /* Standard for modern Node.js ESM */
    "moduleResolution": "NodeNext",              /* Resolves modules using Node's ESM resolution */

    /* Strict Type-Checking Options */
    "strict": true,                              /* Enables all strict type checking options */
    "noImplicitAny": true,                       /* Error on expressions and declarations with implied any */
    "strictNullChecks": true,                    /* null and undefined are not assignable to other types */
    "strictFunctionTypes": true,                 /* Ensure strict checking of function signatures */
    "noUncheckedIndexedAccess": true,            /* Accessing array/map returns T | undefined */
    "exactOptionalPropertyTypes": true,          /* Optional properties cannot be explicitly assigned undefined */

    /* Emit & Build Options */
    "outDir": "./dist",                          /* Output directory for compiled JS */
    "rootDir": "./src",                          /* Root directory of source files */
    "sourceMap": true,                           /* Generates .map files for production stack-trace debugging */
    "declaration": true,                         /* Generates .d.ts definition files */
    "removeComments": true,                      /* Strip comments from emitted JS */

    /* Module & Interop Support */
    "esModuleInterop": true,                     /* Enables CJS/ESM interop (default imports for CJS) */
    "forceConsistentCasingInFileNames": true,     /* Disallow inconsistently-cased file references */
    "skipLibCheck": true                         /* Skip type check of declaration files for build speed */
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
\`\`\`

---

### 3. Critical Compilation & Configuration Flags

1. **\`module: "NodeNext"\` and \`moduleResolution: "NodeNext"\`**:
   - In modern Node.js ESM (\`"type": "module"\` in \`package.json\`), relative imports in TypeScript **MUST** include the \`.js\` file extension: \`import { userService } from './userService.js';\`.
   - NodeNext strictly mirrors Node's native module loader.
2. **\`strictNullChecks: true\`**:
   - Prevents null pointer exceptions (billion-dollar mistake). A variable typed \`string\` cannot be assigned \`null\` or \`undefined\` unless explicitly typed as \`string | null\`.
3. **\`noUncheckedIndexedAccess: true\`**:
   - Accessing an array element (\`const user = users[0]\`) types \`user\` as \`User | undefined\`, forcing you to verify that the element exists before accessing its properties.
4. **\`sourceMap: true\`**:
   - Produces source map files so when an unhandled exception occurs in compiled \`dist/index.js\`, Node.js (via \`node --enable-source-maps dist/index.js\`) prints the exact **TypeScript line number** from \`src/index.ts\`.

---

### 4. Development Execution vs Compiled Production Execution

| Stage | Tooling | Execution Mechanics |
| :--- | :--- | :--- |
| **Development** | \`tsx\` or \`ts-node\` | \`tsx watch src/index.ts\` uses native esbuild to strip types on-the-fly and execute directly with sub-second restarts. Zero type-checking during run (handled in IDE). |
| **Type Verification** | \`tsc --noEmit\` | Runs type-checker across the entire codebase to detect static errors before git commit or in CI/CD pipeline. |
| **Production Build** | \`tsc -p tsconfig.build.json\` | Compiles clean, optimized JavaScript into \`dist/\`. |
| **Production Run** | \`node dist/index.js\` | Runs pure V8 JavaScript directly with zero TypeScript overhead or transpiler latency. |

#### TypeScript & Node.js 22+ Native Type Stripping
Starting in **Node.js 22.6.0+**, Node features native experimental type stripping:
\`\`\`bash
node --experimental-strip-types src/index.ts
\`\`\`
This enables running \`.ts\` files directly in development without installing \`tsx\` or \`ts-node\`, as long as non-standard syntax (enums, namespaces) is avoided.`,
    comparisonTable: [
      { aspect: "NodeNext vs CommonJS", detail: "NodeNext aligns with Node ESM; requires .js extensions in relative imports and supports top-level await." },
      { aspect: "tsx vs tsc", detail: "tsx strips types instantly using esbuild for local dev; tsc does full static type-checking and outputs production JS." },
      { aspect: "strictNullChecks", detail: "Forbids assigning null/undefined to concrete types; prevents Cannot read property of undefined crashes." },
      { aspect: "sourceMap in Prod", detail: "Enables node --enable-source-maps dist/index.js to report original TypeScript source line numbers in crashes." }
    ],
    code: `// Type-Safe Environment Configuration (tsconfig + Zod Schema Validation)
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  ENABLE_SWAGGER: z.enum(['true', 'false']).transform(v => v === 'true').default('false')
});

export type EnvConfig = z.infer<typeof envSchema>;

export function loadAndValidateConfig(rawEnv: NodeJS.ProcessEnv): EnvConfig {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('❌ FATAL: Invalid application environment configuration:');
    result.error.issues.forEach(issue => {
      console.error(\`   - \${issue.path.join('.')}: \${issue.message}\`);
    });
    process.exit(1);
  }

  return result.data;
}

// Global typed config export
export const config = loadAndValidateConfig(process.env);`,
    keyTakeaways: [
      "Configure module: 'NodeNext' and moduleResolution: 'NodeNext' for modern Node.js ESM applications.",
      "Always set strict: true and strictNullChecks: true to eliminate unexpected null and undefined crashes.",
      "Use 'tsx watch' for instant developer feedback in development; compile with 'tsc' to dist/ for production deployment.",
      "Enable sourceMap: true and launch production using 'node --enable-source-maps dist/index.js' to preserve accurate stack traces.",
      "Pair TypeScript static typing with Zod schema validation to guarantee 100% type safety of process.env at boot time."
    ]
  },
  {
    id: "14.4",
    title: "33. Backend-Specific TypeScript: Express Types, Middleware & DTO Validation",
    content: `### 1. Topic Overview & Mental Model
Applying TypeScript to Express.js requires typing the complete HTTP request pipeline: typed route parameters, query string parsers, request bodies, custom middleware, and authenticated user contexts.

#### Why TypeScript Interfaces Do NOT Validate JSON at Runtime
A common pitfall in backend engineering is believing that adding a type annotation to Express parameters validates incoming HTTP payloads:
\`\`\`typescript
// ❌ DANGEROUS ILLUSION OF SECURITY:
app.post('/users', (req: Request<{}, {}, CreateUserDto>, res) => {
  // TypeScript assumes req.body has email and password.
  // BUT AT RUNTIME, req.body is raw JSON sent by a client!
  // TypeScript types are completely erased during compilation to JavaScript!
  console.log(req.body.email.toLowerCase()); // 💥 Crashes server if email is missing!
});
\`\`\`
**Rule**: TypeScript provides **compile-time guarantees for developers**; runtime validation libraries (like **Zod**) provide **runtime guarantees at the network boundary**. Production backend code combines both: Zod parses the raw payload and infers the compile-time TypeScript type.

---

### 2. Typing Express Request & Response Objects

The \`express\` package provides a 4-parameter generic \`Request\` type:
\`\`\`typescript
Request<ParamsDictionary, ResBody, ReqBody, ReqQuery>
\`\`\`
- \`ParamsDictionary\`: Shape of route params (\`req.params\`, e.g. \`{ id: string }\`).
- \`ResBody\`: Shape of the response JSON payload.
- \`ReqBody\`: Shape of the parsed incoming JSON request body (\`req.body\`).
- \`ReqQuery\`: Shape of query string parameters (\`req.query\`).

---

### 3. Module Augmentation for Authentication Context

By default, \`req.user\` does not exist on \`Express.Request\`. Using \`(req as any).user\` forfeits type safety. The senior standard is **Declaration Merging / Module Augmentation**:
\`\`\`typescript
// src/types/express.d.ts
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  organizationId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      correlationId: string;
    }
  }
}
\`\`\`

---

### 4. Generic Validation Middleware with Zod

Create a reusable higher-order middleware that validates incoming params, query, or body, returning typed values:
\`\`\`typescript
export function validateRequest<T extends z.ZodTypeAny>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'ValidationError',
        issues: result.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
      });
    }
    req.body = result.data; // Reassign to strictly validated and sanitized data
    next();
  };
}
\`\`\``,
    comparisonTable: [
      { aspect: "Compile-Time vs Runtime", detail: "TypeScript types are erased at runtime; Zod validates incoming raw JSON at the network boundary." },
      { aspect: "Module Augmentation", detail: "Extends Express.Request interface to type req.user cleanly without using (req as any) casting." },
      { aspect: "Request<P, Res, Req, Q>", detail: "Express Request generic accepts 4 parameters typing params, response body, request body, and query." },
      { aspect: "ErrorRequestHandler", detail: "Express typed error middleware requires (err: unknown, req, res, next) with 4 explicit arguments." }
    ],
    code: `// Express Route & Middleware Typing with Zod Schema Validation
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ============================================================================
// STEP 1: Module Augmentation for Express Request Context
// ============================================================================
export interface AuthUserPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  orgId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
      requestId: string;
    }
  }
}

// ============================================================================
// STEP 2: Zod DTO Validation Schemas
// ============================================================================
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin', 'user']).default('user')
  }),
  params: z.object({}),
  query: z.object({})
});

export const getUserParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

// Infer static TypeScript types directly from Zod schema!
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type GetUserParams = z.infer<typeof getUserParamsSchema>['params'];

// ============================================================================
// STEP 3: Type-Safe Validation Middleware
// ============================================================================
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      // Assign parsed & sanitized data back to req
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'BadRequest',
          issues: error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
        });
      }
      next(error);
    }
  };
};

// ============================================================================
// STEP 4: Strongly-Typed Route Handler
// ============================================================================
export const handleCreateUser = async (
  req: Request<{}, { success: boolean; id: string }, CreateUserInput>,
  res: Response<{ success: boolean; id: string }>
) => {
  const { email, role } = req.body; // Fully typed as string and 'admin' | 'user'!
  const newId = 'usr_' + Math.random().toString(36).substring(2, 9);

  return res.status(201).json({
    success: true,
    id: newId
  });
};`,
    keyTakeaways: [
      "TypeScript interfaces do not validate JSON at runtime; always validate request payloads with Zod at the boundary.",
      "Use Module Augmentation to extend Express.Request with req.user and req.requestId without using 'as any'.",
      "Type Express request handlers using Request<Params, ResBody, ReqBody, ReqQuery>.",
      "Derive TypeScript DTO types directly from Zod schemas using z.infer<typeof schema> to avoid keeping two schemas in sync."
    ]
  },
  {
    id: "14.5",
    title: "34. Database Entity Typing, ORM/Query Safety & Nullability",
    content: `### 1. Topic Overview & Mental Model
In database engineering, type safety requires clearly separating **Domain Entities**, **Data Transfer Objects (DTOs)**, and **Database Row/Document Models**.
Leaking database internal models directly to API consumers leads to accidental disclosure of sensitive columns (e.g. \`password_hash\`, \`stripe_customer_id\`).

---

### 2. SQL vs MongoDB Nullability Realities

- **SQL Nullability**: In relational databases, a nullable column returns \`NULL\`. In TypeScript, SQL \`NULL\` maps strictly to \`string | null\`, **NOT** \`string | undefined\`.
- **MongoDB Nullability**: MongoDB documents can have either omitted fields (\`undefined\`) or fields explicitly stored as \`null\`.
- Under \`strictNullChecks: true\`, TypeScript forces you to handle \`null\` and \`undefined\` explicitly before calling methods like \`.toUpperCase()\` or \`.trim()\`.

---

### 3. Typing Mongoose Models & MongoDB Documents

In Mongoose 7+, avoid creating separate disconnected interfaces. Use **\`InferSchemaType\`** to generate compile-time types directly from your Mongoose schema:
\`\`\`typescript
import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });

// Infer compile-time document type directly from Schema definition!
export type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;

export const UserModel = model<IUser>('User', userSchema);
\`\`\`

---

### 4. Typing SQL Queries with \`mysql2\` and \`pg\`

When using raw relational queries, declare a typed row interface extending the driver's base row type:
\`\`\`typescript
import { RowDataPacket } from 'mysql2/promise';

export interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  deleted_at: Date | null; // Explicit nullability!
}

// In repository:
const [rows] = await db.query<UserRow[]>(
  'SELECT id, email, password_hash, created_at, deleted_at FROM users WHERE id = ?',
  [userId]
);
const user = rows[0]; // Typed as UserRow | undefined
if (!user) return null;
\`\`\`

---

### 5. API Response Contracts & Type-Safe HTTP Client

Avoid ad-hoc response structures. Standardize responses with a **Discriminated Union API Contract**:
\`\`\`typescript
export type ApiResponse<T> =
  | { success: true; data: T; meta?: { page: number; total: number } }
  | { success: false; error: { code: string; message: string; details?: unknown } };
\`\`\`
A type-safe API client wraps \`fetch()\` and enforces that callers handle both \`success: true\` and \`success: false\` branches.`,
    comparisonTable: [
      { aspect: "SQL NULL vs undefined", detail: "SQL NULL maps strictly to null, not undefined; strictNullChecks prevents invalid method access." },
      { aspect: "InferSchemaType", detail: "Generates compile-time TypeScript types directly from Mongoose Schema definitions without redundancy." },
      { aspect: "RowDataPacket", detail: "mysql2 generic query<T extends RowDataPacket[]> types SQL query result rows accurately." },
      { aspect: "Domain vs DB Entity", detail: "Domain entities strip storage artifacts (password_hash, __v) before returning data to API clients." }
    ],
    code: `// Database Entity Typing & Type-Safe API Client Demonstration
import { z } from 'zod';

// ============================================================================
// 1. Domain Entity vs Database Model vs Public DTO
// ============================================================================
export interface DatabaseUserRecord {
  id: string;
  email: string;
  password_hash: string;       // Sensitive! Never expose to client
  organization_id: string;
  created_at: Date;
  deleted_at: Date | null;     // SQL Nullable
}

export interface DomainUser {
  id: string;
  email: string;
  organizationId: string;
  createdAt: Date;
}

export function mapRecordToDomain(record: DatabaseUserRecord): DomainUser {
  return {
    id: record.id,
    email: record.email,
    organizationId: record.organization_id,
    createdAt: record.created_at
  };
}

// ============================================================================
// 2. Standardized Discriminated Union API Response
// ============================================================================
export type ApiResponse<T> =
  | { success: true; data: T; timestamp: string }
  | { success: false; error: { code: string; message: string }; timestamp: string };

// ============================================================================
// 3. Fully Typed Backend HTTP Client Wrapper
// ============================================================================
export class TypeSafeApiClient {
  constructor(private baseUrl: string, private defaultHeaders: Record<string, string> = {}) {}

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...options.headers
        }
      });

      const body = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: body.code || 'HTTP_ERROR',
            message: body.message || \`Request failed with status \${response.status}\`
          },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: body as T,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Unknown network failure'
        },
        timestamp: new Date().toISOString()
      };
    }
  }
}`,
    keyTakeaways: [
      "Keep Domain Entities distinct from Database Rows to prevent accidental exposure of password hashes and internal IDs.",
      "SQL NULL maps strictly to 'T | null' in TypeScript; enable strictNullChecks to handle nullability safely.",
      "Use Mongoose InferSchemaType to derive TypeScript interfaces directly from schema definitions.",
      "Standardize API responses using a Discriminated Union (success: true | false) so client callers are forced to check errors."
    ]
  },
  {
    id: "14.6",
    title: "35. Complete Production Typed CRUD API: Route, Controller, Service & Repository",
    content: `### 1. Topic Overview & Mental Model
This section presents a complete, production-grade Express.js CRUD API built with end-to-end TypeScript type safety.
The architecture enforces a strict **4-Tier Clean Architecture**:
1. **HTTP Router & Validation**: Validates incoming payloads using Zod schemas at the network boundary.
2. **Controller Layer**: Decodes HTTP parameters, calls domain services, and formats standard JSON responses.
3. **Service Layer**: Implements business rules, validation logic, and transactions using the \`Result<T, E>\` pattern.
4. **Repository Layer**: Encapsulates persistence logic behind an abstract generic interface (\`IProductRepository\`).

---

### 2. How Compile-Time Types and Runtime Validation Work Together

\`\`\`
Incoming HTTP Request (Raw Untrusted JSON)
                 │
                 ▼
       ┌───────────────────┐
       │ Zod Schema Parse  │ ◄─── Runtime Validation (Rejects invalid shapes with 400)
       └─────────┬─────────┘
                 │ (Produces inferred TypeScript static type: z.infer<typeof schema>)
                 ▼
       ┌───────────────────┐
       │ Controller Layer  │ ◄─── Strongly Typed Request<Params, Res, Body, Query>
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │ Service Layer     │ ◄─── Pure Domain Logic returning Result<Product, DomainError>
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │ Repository Layer  │ ◄─── Abstract Contract IProductRepository
       └───────────────────┘
\`\`\``,
    comparisonTable: [
      { aspect: "Compile-Time vs Runtime", detail: "TypeScript verifies developer contracts during coding; Zod verifies external client JSON at runtime." },
      { aspect: "4-Tier Architecture", detail: "Routes handle HTTP $\\to$ Controllers map DTOs $\\to$ Services execute logic $\\to$ Repositories talk to DB." },
      { aspect: "Result Pattern", detail: "Returns { ok: true, value } | { ok: false, error } instead of throwing unhandled runtime exceptions." },
      { aspect: "Domain DTO Mapping", detail: "Repository outputs domain entities; controller maps them to public DTOs before responding." }
    ],
    code: `// Complete Production-Grade Typed Express CRUD Application
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ============================================================================
// 1. Domain Types & Error Classes
// ============================================================================
export interface Product {
  id: string;
  sku: string;
  title: string;
  priceCents: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export type DomainError =
  | { code: 'NOT_FOUND'; message: string }
  | { code: 'DUPLICATE_SKU'; message: string }
  | { code: 'INSUFFICIENT_STOCK'; message: string };

export type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// ============================================================================
// 2. Zod Validation Schemas (Network Boundary)
// ============================================================================
export const createProductSchema = z.object({
  sku: z.string().trim().min(3).max(30).toUpperCase(),
  title: z.string().trim().min(2).max(100),
  priceCents: z.number().int().positive(),
  stock: z.number().int().nonnegative()
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ============================================================================
// 3. Repository Layer (Interface & In-Memory Implementation)
// ============================================================================
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryProductRepository implements IProductRepository {
  private products = new Map<string, Product>();

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return Array.from(this.products.values()).find(p => p.sku === sku) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date();
    const product: Product = {
      ...data,
      id: 'prod_' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now
    };
    this.products.set(product.id, product);
    return product;
  }

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

// ============================================================================
// 4. Service Layer (Business Logic)
// ============================================================================
export class ProductService {
  constructor(private repo: IProductRepository) {}

  async createProduct(input: CreateProductInput): Promise<Result<Product>> {
    const existing = await this.repo.findBySku(input.sku);
    if (existing) {
      return { ok: false, error: { code: 'DUPLICATE_SKU', message: \`Product with SKU '\${input.sku}' already exists\` } };
    }

    const created = await this.repo.create(input);
    return { ok: true, value: created };
  }

  async getProduct(id: string): Promise<Result<Product>> {
    const product = await this.repo.findById(id);
    if (!product) {
      return { ok: false, error: { code: 'NOT_FOUND', message: \`Product with ID '\${id}' not found\` } };
    }
    return { ok: true, value: product };
  }
}

// ============================================================================
// 5. Controller Layer (HTTP Request Handling)
// ============================================================================
export class ProductController {
  constructor(private service: ProductService) {}

  create = async (req: Request<{}, {}, CreateProductInput>, res: Response) => {
    const result = await this.service.createProduct(req.body);
    if (!result.ok) {
      const status = result.error.code === 'DUPLICATE_SKU' ? 409 : 400;
      return res.status(status).json({ success: false, error: result.error });
    }
    return res.status(201).json({ success: true, data: result.value });
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const result = await this.service.getProduct(req.params.id);
    if (!result.ok) {
      return res.status(404).json({ success: false, error: result.error });
    }
    return res.json({ success: true, data: result.value });
  };
}

// ============================================================================
// 6. Express App Assembly & Router
// ============================================================================
export function createProductApp(repo: IProductRepository = new InMemoryProductRepository()): express.Express {
  const app = express();
  app.use(express.json());

  const service = new ProductService(repo);
  const controller = new ProductController(service);

  // Validation middleware
  const validateCreate = (req: Request, res: Response, next: NextFunction) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.issues });
    }
    req.body = parsed.data;
    next();
  };

  app.post('/api/products', validateCreate, controller.create);
  app.get('/api/products/:id', controller.getById);

  return app;
}`,
    keyTakeaways: [
      "In a 4-Tier Clean Architecture, compile-time TypeScript types and runtime Zod schemas complement each other.",
      "Zod validates and sanitizes incoming untrusted payloads at the network boundary, typing req.body for downstream controllers.",
      "The Service layer uses the Result<T, E> discriminated union to communicate expected business errors explicitly.",
      "Repositories are decoupled via abstract interfaces (IProductRepository), enabling painless in-memory testing without real databases."
    ]
  }
];

// Load existing parts 9 to 16
const partsPath = path.resolve(__dirname, 'node_notes_parts_9_to_16.json');
const parts = JSON.parse(fs.readFileSync(partsPath, 'utf-8'));

// Update Part 11
const p11Index = parts.findIndex(p => p.id === 11);
if (p11Index !== -1) {
  parts[p11Index].sections = p11_sections;
  console.log(`Updated Part 11 with ${p11_sections.length} exhaustive sections.`);
}

// Update Part 14
const p14Index = parts.findIndex(p => p.id === 14);
if (p14Index !== -1) {
  parts[p14Index].sections = p14_sections;
  console.log(`Updated Part 14 with ${p14_sections.length} exhaustive sections.`);
}

// Save back to scratch/node_notes_parts_9_to_16.json
fs.writeFileSync(partsPath, JSON.stringify(parts, null, 2), 'utf-8');
console.log('Successfully written updated parts 9-16.');
