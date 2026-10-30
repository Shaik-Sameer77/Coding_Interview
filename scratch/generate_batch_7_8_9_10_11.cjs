// Generator for Topics 7 to 11
const fs = require('fs');
const path = require('path');

const batch = [];
function q(id, topicId, topicTitle, question, answer, memoryModel, code, tip, comparisonTable) {
  const item = { id, topicId, topicTitle, question, answer };
  if (memoryModel) item.memoryModel = memoryModel;
  if (code) item.code = code;
  if (tip) item.tip = tip;
  if (comparisonTable) item.comparisonTable = comparisonTable;
  batch.push(item);
}

// TOPIC 7: Auth: JWT, Refresh & Bcrypt (Q101–Q115)
q(101, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is a JSON Web Token (JWT) and what are its 3 parts?",
  "A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of 3 dot-separated base64url-encoded parts:\n1) **Header**: Algorithm (`alg: HS256` or `RS256`) and token type (`typ: JWT`).\n2) **Payload**: Claims (subject `sub`, expiration `exp`, user ID, role). Base64 encoded, NOT encrypted (visible to anyone!).\n3) **Signature**: Cryptographic hash of `(base64Url(Header) + '.' + base64Url(Payload))` created using a server secret or private key.\nSignature guarantees data integrity and authenticity.",
  "Memory Anchor: Header (algorithm) . Payload (claims, visible!) . Signature (tamper-proof verification).",
  `import jwt from 'jsonwebtoken';

// Sign token
const token = jwt.sign(
  { userId: user.id, role: user.role }, 
  process.env.JWT_SECRET, 
  { expiresIn: '15m' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);`
);

q(102, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "Why is it dangerous to store sensitive data in a JWT payload?",
  "JWT payloads are only **Base64Url encoded**, NOT encrypted! Anyone who intercepts or reads the token in the browser can decode the payload instantly via `Buffer.from(payload, 'base64')` or jwt.io. Never store passwords, credit card numbers, Social Security Numbers, or internal encryption keys in a JWT payload.",
  "Memory Anchor: JWT is signed, NOT encrypted! The payload is publicly readable by anyone who holds the token."
);

q(103, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "Explain the Dual-Token (Access + Refresh Token) Architecture and Token Rotation.",
  "1) **Short-Lived Access Token** (expires in 10–15 mins): Passed in `Authorization: Bearer <token>` header for stateless API validation. If stolen, window of vulnerability is minimal.\n2) **Long-Lived Refresh Token** (expires in 7–30 days): Stored securely in an `httpOnly`, `secure`, `sameSite: 'strict'` cookie (inaccessible to JS, preventing XSS theft).\n3) **Token Rotation**: When the client calls `/auth/refresh`, the server invalidates the used refresh token, issues a brand-new refresh token AND a new access token, and saves the new refresh token family in DB/Redis. If an old refresh token is reused, the server detects token theft and invalidates the entire user session family!",
  "Memory Anchor: Access token = 15m in memory/header. Refresh token = 7d in HttpOnly cookie. Rotate both on every refresh; invalidate family on reuse.",
  `// Refresh Token Rotation Endpoint:
app.post('/api/auth/refresh', async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) return res.status(401).json({ error: 'Missing token' });

  const storedToken = await TokenModel.findOne({ token: incomingRefreshToken });
  if (!storedToken) {
    // REUSE DETECTED! Invalidate all tokens for this user:
    await TokenModel.deleteMany({ userId: decoded.userId });
    return res.status(403).json({ error: 'Token reuse detected. Re-login required.' });
  }

  // Rotate tokens:
  await storedToken.deleteOne();
  const newAccessToken = generateAccessToken(storedToken.userId);
  const newRefreshToken = generateRefreshToken(storedToken.userId);
  await TokenModel.create({ userId: storedToken.userId, token: newRefreshToken });

  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ accessToken: newAccessToken });
});`
);

q(104, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "How does Bcrypt work, and why should you use it over MD5 or SHA-256 for password hashing?",
  "Fast hashing algorithms like MD5 or SHA-256 are designed for speed (gigabytes per second), which makes them vulnerable to brute-force and GPU rainbow table attacks (billions of hashes/sec).\nBcrypt is an **adaptive key derivation function** based on the Blowfish cipher. It includes:\n1) Automatic **salt generation** (random string concatenated to password to defeat rainbow tables).\n2) Configurable **work factor (cost / salt rounds)**: 2^rounds iterations. Setting rounds to 10–12 takes ~100–300ms per hash, making brute-force cracking computationally infeasible.",
  "Memory Anchor: Bcrypt is intentionally slow and CPU-intensive with random salt rounds (10–12) to destroy GPU brute-force attacks.",
  `import bcrypt from 'bcrypt';

// Hash password with 12 salt rounds
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

// Compare password safely (timing-safe):
const isMatch = await bcrypt.compare(candidatePassword, user.passwordHash);`
);

q(105, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is a Timing Attack in password comparison, and how do you prevent it?",
  "A timing attack measures the microscopic time differences in string comparison (`str1 === str2`). A standard `===` operator short-circuits on the first mismatched character, allowing an attacker to deduce the correct password or API token character-by-character by measuring response latency.\nPrevention: Use `crypto.timingSafeEqual()` or `bcrypt.compare()`, which execute in constant time regardless of where the mismatch occurs.",
  "Memory Anchor: === short-circuits and leaks character matches via latency. Use crypto.timingSafeEqual() for constant-time comparison.",
  `import crypto from 'node:crypto';

function safeCompare(strA, strB) {
  const bufA = Buffer.from(strA);
  const bufB = Buffer.from(strB);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB); // Constant time!
}`
);

q(106, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "How do you implement an Express Authentication Middleware for JWT?",
  "Extract the token from the `Authorization: Bearer <token>` header, verify it using `jwt.verify(token, secret)`, attach the decoded payload to `req.user`, and call `next()`. If missing or invalid, return `401 Unauthorized`.",
  "Memory Anchor: Extract header -> jwt.verify -> req.user = decoded -> next(). Catch TokenExpiredError.",
  `export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: '123', role: 'admin' }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};`
);

q(107, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "How do you implement Role-Based Access Control (RBAC) middleware in Express?",
  "Create a higher-order middleware factory `authorizeRoles(...allowedRoles)` that checks `req.user.role`. If the authenticated user's role is not in `allowedRoles`, return `403 Forbidden`.",
  "Memory Anchor: authorizeRoles('admin', 'manager') checks req.user.role. If not included -> return 403 Forbidden.",
  `export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

// Usage:
app.delete('/api/products/:id', authenticateJWT, authorizeRoles('admin'), deleteProduct);`
);

q(108, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "Can you immediately revoke or blacklist a stateless JWT before its expiration?",
  "Because stateless JWTs are validated mathematically without database queries, you cannot natively revoke an in-flight token. Solutions:\n1) **Redis Blacklist**: When user logs out, write token's `jti` (JWT ID) to Redis with TTL equal to the token's remaining lifetime. Middleware checks Redis before accepting token.\n2) **Short Lifetimes**: Keep access tokens very short (10–15 min) so window of exposure is minimal without needing blacklists.\n3) **Token Versioning**: Store a `tokenVersion` counter in the User DB record. Increment it on password reset or logout-all. Reject tokens where `payload.version < user.tokenVersion`.",
  "Memory Anchor: Stateless tokens cannot be revoked natively. Use Redis blacklist by jti, tokenVersion counter in DB, or 10m short lifetimes."
);

q(109, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is the difference between Symmetric (HS256) and Asymmetric (RS256) JWT algorithms?",
  "- **HS256 (HMAC with SHA-256)**: Symmetric algorithm using a single shared secret key for BOTH signing and verification. Every service that verifies the token must know the secret (if a client service is compromised, the attacker can forge tokens).\n- **RS256 (RSA Signature with SHA-256)**: Asymmetric algorithm using a **Private Key** (kept secure on Auth service) to sign tokens, and a **Public Key** (distributed to all microservices and clients) to verify tokens. Verifying services cannot forge tokens.",
  "Memory Anchor: HS256 = 1 shared secret (signs & verifies). RS256 = Private key signs, Public key verifies (ideal for microservices).",
  null,
  null,
  [
    { aspect: "HS256 (Symmetric)", detail: "Single secret key; fast; secret leak allows forging any token." },
    { aspect: "RS256 (Asymmetric)", detail: "Public/Private key pair; Auth server signs with private, API gateways verify with public." }
  ]
);

q(110, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What are HttpOnly, Secure, and SameSite cookie attributes, and why are they critical for authentication?",
  "- `httpOnly: true`: Forbids client-side JavaScript (`document.cookie`) from accessing the cookie, completely neutralizing token theft via Cross-Site Scripting (XSS).\n- `secure: true`: Guarantees cookie is only transmitted over encrypted HTTPS connections (prevents plain-text interception).\n- `sameSite: 'strict' | 'lax'`: Dictates whether cookie is sent with cross-site requests. `'strict'` prevents the cookie from being sent on cross-origin requests, completely neutralizing Cross-Site Request Forgery (CSRF).",
  "Memory Anchor: HttpOnly stops XSS theft. Secure forces HTTPS. SameSite stops CSRF attacks."
);

q(111, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "How do you handle password reset securely in Node.js?",
  "1) Generate a cryptographically secure random token: `crypto.randomBytes(32).toString('hex')`.\n2) Hash the token with SHA-256 before saving to DB: `crypto.createHash('sha256').update(token).digest('hex')` alongside an expiration date (e.g. 15 minutes).\n3) Email the unhashed token in a reset link: `https://site.com/reset-password?token=...`.\n4) When user submits new password, hash the incoming token and look up the matching unexpired DB record. This prevents database administrators or DB leaks from compromising valid reset links.",
  "Memory Anchor: crypto.randomBytes(32) -> Hash token in DB with 15m expiration -> Email plain token -> Hash incoming token to match."
);

q(112, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is the difference between Stateful Session-Based Auth and Stateless JWT Auth?",
  "- **Stateful Session Auth**: Server generates a random session ID, stores session data in Redis/DB, and sends session ID in cookie. Server can instantly revoke sessions, but requires centralized session store queries on every request.\n- **Stateless JWT**: Client stores signed token. Server verifies signature mathematically with zero DB lookups (highly scalable across distributed microservices), but cannot revoke individual tokens instantly without a blacklist.",
  "Memory Anchor: Sessions = State in Redis, instant revocation. JWT = Stateless cryptographic proof, zero DB lookup, harder to revoke."
);

q(113, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "How do you implement API Key authentication for external B2B clients in Express?",
  "Accept `X-API-Key` in headers. Hash the incoming API key using SHA-256 and look up the customer record in DB/Redis. Attach client permissions and rate limits to `req.client`.",
  "Memory Anchor: Look up hashed API key in DB/Redis -> attach client -> enforce per-key rate limits.",
  `export const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key missing' });

  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  const client = await ClientModel.findOne({ apiKeyHash: hashedKey, isActive: true });
  if (!client) return res.status(401).json({ error: 'Invalid or revoked API key' });

  req.client = client;
  next();
};`
);

q(114, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is OAuth 2.0 / OpenID Connect (OIDC) and how does the Authorization Code flow work?",
  "OAuth 2.0 is an authorization framework. The Authorization Code flow with PKCE is standard for web/mobile apps:\n1) User clicks 'Login with Google'; redirected to Google login.\n2) User grants consent; Google redirects back to Node server with an authorization `code`.\n3) Node server makes backend server-to-server POST request to Google's token endpoint exchanging `code` + `client_secret` for an `access_token` and `id_token` (JWT with user identity).\n4) Server logs user in or creates account.",
  "Memory Anchor: Auth Code Flow: Redirect to provider -> get code -> backend exchanges code for token -> get user profile."
);

q(115, 7, "7. Auth: JWT, Refresh & Bcrypt",
  "What is Argon2 and how does it compare to Bcrypt?",
  "Argon2 is the winner of the Password Hashing Competition (PHC). Unlike Bcrypt which is primarily CPU-bound, Argon2 (specifically Argon2id) is **memory-hard** and resistant to GPU and custom ASIC hardware cracking attacks. Modern security standards recommend Argon2id or Bcrypt with cost 12.",
  "Memory Anchor: Argon2id = Memory-hard password hashing algorithm, even stronger against ASIC/GPU attacks than Bcrypt."
);

// TOPIC 8: Webhooks & Signatures (Q116–Q130)
q(116, 8, "8. Webhooks & Signatures",
  "What is a Webhook, and why are webhooks used instead of polling?",
  "A Webhook is an HTTP callback (HTTP POST request) sent by a source system (Stripe, GitHub, Shopify) to a destination server when a specific event occurs ('push' notification).\nWhy use webhooks instead of polling:\n- **Polling**: Client constantly queries `GET /api/order/status` every 2 seconds. Inefficient: wastes network bandwidth, server CPU, and database queries for 99% empty responses.\n- **Webhooks**: Provider instantly pushes payload to your server only when the event actually happens, offering real-time updates and zero wasted resources.",
  "Memory Anchor: Webhooks = Push notification for servers. Polling = Wasted queries; Webhooks = Real-time event push."
);

q(117, 8, "8. Webhooks & Signatures",
  "How do you verify the authenticity of an incoming Webhook (HMAC SHA-256)?",
  "Providers compute a cryptographic HMAC signature of the **raw request payload** using a shared secret key and send it in a header (e.g. `stripe-signature` or `x-razorpay-signature`).\nYour server computes the expected HMAC SHA-256 hash using the shared secret and the raw request Buffer, and verifies it against the header using `crypto.timingSafeEqual()`.\nIf signatures match, the payload is genuine and untampered.",
  "Memory Anchor: HMAC SHA-256(Raw Body, Webhook Secret) === Provider Header via timingSafeEqual().",
  `import crypto from 'node:crypto';

export function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expectedSignature)
  );
}`
);

q(118, 8, "8. Webhooks & Signatures",
  "Why MUST you use the raw binary request body for webhook signature verification?",
  "HMAC hashing operates on exact byte sequences. If you parse the body with `express.json()` before verifying, whitespace differences, key ordering, or Unicode character escaping changes the byte representation, causing HMAC comparison to fail completely.\nYou must capture the raw Buffer using `express.raw({ type: 'application/json' })` or save the raw buffer in `express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })`.",
  "Memory Anchor: Any JSON parse or whitespace change alters bytes and invalidates HMAC. You MUST use the raw Buffer!"
);

q(119, 8, "8. Webhooks & Signatures",
  "What is Webhook Idempotency, and how do you handle duplicate webhook deliveries?",
  "Webhook providers guarantee **At-Least-Once Delivery**, meaning network glitches or timeouts can cause the provider to send the exact same event multiple times.\nIf you process `payment_intent.succeeded` twice without idempotency, you could fulfill an order twice or deliver duplicate credits!\nFix: Extract the unique `event.id` from the payload. Check Redis/DB with atomic `SET event:evt_123 1 NX EX 86400`. If key already exists, return `200 OK` immediately without re-processing.",
  "Memory Anchor: Providers guarantee at-least-once delivery. Deduplicate using atomic Redis SET event.id NX.",
  `app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = parseAndVerify(req);

  // Check if event already processed:
  const isNew = await redis.set(\`webhook:event:\${event.id}\`, 'processed', 'EX', 86400 * 7, 'NX');
  if (!isNew) {
    console.log(\`Duplicate event \${event.id} ignored\`);
    return res.status(200).json({ received: true });
  }

  await processBusinessLogic(event);
  res.status(200).json({ received: true });
});`
);

q(120, 8, "8. Webhooks & Signatures",
  "Why must webhook handlers respond with HTTP 200 immediately before running heavy background work?",
  "Webhook providers (Stripe, GitHub) enforce strict HTTP timeouts (usually 3 to 10 seconds). If your handler performs slow tasks (generating PDFs, sending emails, video processing) synchronously, the webhook times out. The provider assumes failure and retries repeatedly, causing an avalanche of duplicate webhooks!\nFix: Verify signature, save event to DB or push to a message queue (BullMQ/RabbitMQ), and return `200 OK` within 200ms. Process heavy tasks asynchronously in worker jobs.",
  "Memory Anchor: Webhooks timeout in 3-5 seconds! Acknowledge with 200 OK fast, offload heavy work to BullMQ/RabbitMQ."
);

q(121, 8, "8. Webhooks & Signatures",
  "What is Replay Attack Prevention in Webhooks, and how does the timestamp header work?",
  "A replay attack occurs when an attacker intercepts a valid webhook payload and signature and re-sends it later to trigger duplicate business logic.\nStripe and standard providers include a timestamp in the signature header (`t=1614555555,v1=...`).\nVerification compares the current server time with the payload timestamp: if `Math.abs(Date.now()/1000 - t) > 300` (older than 5 minutes), the webhook is rejected as a stale replay attack.",
  "Memory Anchor: Check timestamp in signature header: reject webhooks older than 5 minutes to prevent replay attacks."
);

q(122, 8, "8. Webhooks & Signatures",
  "How do you handle webhook delivery failures and retries on your server?",
  "If your server returns 500 or times out, providers implement exponential backoff retries (e.g. retry after 1h, 2h, 4h, 8h for up to 3 days).\nYour server should:\n1) Monitor webhook health and alert on consecutive 500s.\n2) Guarantee idempotency across retries.\n3) Maintain a `dead_letter_webhooks` table for manual review if an event consistently fails after retries.",
  "Memory Anchor: Providers retry on 5xx with exponential backoff. Maintain idempotency and log dead-letter events."
);

q(123, 8, "8. Webhooks & Signatures",
  "How do you test webhooks locally behind a firewall during development?",
  "Use webhook tunneling tools:\n1) **Stripe CLI**: `stripe listen --forward-to localhost:3000/api/webhook/stripe`.\n2) **Ngrok**: `ngrok http 3000` (exposes public HTTPS tunnel to local port).\n3) Mocking with Supertest by signing local test payloads with the mock webhook secret.",
  "Memory Anchor: Use Stripe CLI forward-to or Ngrok to tunnel external webhooks to localhost:3000."
);

q(124, 8, "8. Webhooks & Signatures",
  "What are Outgoing Webhooks and how do you design a reliable Webhook Producer in Node.js?",
  "An outgoing webhook system notifies your customers' servers when events occur in your application. Requirements:\n1) Store customer webhook URLs and per-tenant shared secrets.\n2) Sign outgoing payloads with HMAC SHA-256.\n3) Queue deliveries in BullMQ/RabbitMQ.\n4) Implement exponential backoff retries on failure (3–5 attempts).\n5) Disable webhook endpoints that continuously fail (circuit breaker).",
  "Memory Anchor: Outgoing webhooks: BullMQ queue -> HMAC sign -> POST with exponential backoff -> disable failing endpoints."
);

q(125, 8, "8. Webhooks & Signatures",
  "What is the difference between Synchronous API calls and Asynchronous Webhooks in payment flows?",
  "- **Synchronous API call**: Frontend or server calls payment gateway and waits for immediate response. If network drops or 3D-Secure MFA is required, the connection is lost.\n- **Asynchronous Webhook**: The definitive source of truth. After customer finishes 3D-Secure authentication on bank's page, the gateway pushes `payment_intent.succeeded` directly to your backend server-to-server.",
  "Memory Anchor: Sync call initiates checkout; Asynchronous webhook delivers authoritative proof of settlement."
);

q(126, 8, "8. Webhooks & Signatures",
  "How do you secure your Webhook endpoint against Denial of Service (DoS) attacks?",
  "1) Apply IP whitelisting for providers with published static IP ranges (e.g. GitHub).\n2) Apply rate limiting by IP.\n3) Reject payloads exceeding 1 MB immediately.\n4) Verify HMAC signature before performing any database queries or expensive allocations.",
  "Memory Anchor: Verify HMAC signature before hitting DB; rate limit and reject large bodies."
);

q(127, 8, "8. Webhooks & Signatures",
  "How does Razorpay webhook verification differ from Stripe in Node.js?",
  "- **Stripe**: Sends timestamp and signature together in `stripe-signature` header; uses `stripe.webhooks.constructEvent(rawBody, sig, secret)`.\n- **Razorpay**: Sends raw body and signature in `x-razorpay-signature` header; verified via `crypto.createHmac('sha256', secret).update(rawBody).digest('hex') === req.headers['x-razorpay-signature']`.",
  "Memory Anchor: Stripe uses constructEvent helper; Razorpay uses native crypto.createHmac on raw body."
);

q(128, 8, "8. Webhooks & Signatures",
  "What is a Dead Letter Queue (DLQ) in webhook processing?",
  "A Dead Letter Queue is a holding queue for webhook events that have failed all maximum retry attempts (e.g. due to database crashes or bug in business logic). DLQs allow developers to inspect poisoned payloads, fix bugs, and replay the webhooks manually without losing customer transactions.",
  "Memory Anchor: DLQ = Graveyard for failed webhooks to inspect, debug, and manually replay."
);

q(129, 8, "8. Webhooks & Signatures",
  "What HTTP status should you return if a webhook has an invalid HMAC signature?",
  "Return `400 Bad Request` or `401 Unauthorized` with an error message like `'Webhook signature verification failed'`. Do NOT return 200 (which tells provider the message was accepted) and do NOT return 500 (which causes the provider to re-send the fraudulent payload repeatedly).",
  "Memory Anchor: Invalid signature -> return 400 Bad Request immediately. Never return 200 or 500!"
);

q(130, 8, "8. Webhooks & Signatures",
  "How do you handle schema versioning in Webhook payloads?",
  "Include an API version field in the payload header or body (`{ api_version: '2024-01-01', event: ... }`). If payload structures change, older customer webhook consumers won't break if your dispatcher adapts payload formats based on customer registered version.",
  "Memory Anchor: Explicit api_version in webhook payload allows graceful schema evolution."
);

fs.writeFileSync(path.resolve(__dirname, 'batch_7_8.json'), JSON.stringify(batch, null, 2));
console.log('Batch 7 & 8 generated! Total count:', batch.length);
