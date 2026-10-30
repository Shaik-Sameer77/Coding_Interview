// Generator for Topics 9, 10, 11
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

// TOPIC 9: Payment Integration Workflows (Q131–Q145)
q(131, 9, "9. Payment Integration Workflows",
  "Explain the complete end-to-end Payment Flow in a modern Node.js application (PaymentIntent pattern).",
  "1) **Client Checkout**: User clicks 'Checkout'; frontend calls `POST /api/create-payment-intent` with cart items.\n2) **Server Intent Creation**: Server calculates authoritative total from DB (never trusts client prices!), creates a Stripe `PaymentIntent({ amount, currency })`, and returns `client_secret` to frontend.\n3) **Client Confirmation**: Frontend uses Stripe Elements / SDK with `client_secret` to collect card details and submit directly to Stripe (PCI-DSS compliance; card numbers never touch your Node server!). Handles 3D-Secure MFA if required.\n4) **Asynchronous Webhook Settlement**: Stripe sends `payment_intent.succeeded` webhook to your server. Server verifies HMAC signature, checks idempotency, transitions order status to `'paid'`, and unlocks access/inventory.",
  "Memory Anchor: 1) Server calculates total & creates PaymentIntent -> 2) Client pays via Stripe Elements -> 3) Authoritative fulfillment happens in Webhook handler.",
  `// 1. Create PaymentIntent on server:
app.post('/api/create-payment-intent', authenticateUser, async (req, res) => {
  const amount = await calculateOrderTotalFromDb(req.body.items); // Authoritative DB price!
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    metadata: { userId: req.user.id, orderId: req.body.orderId }
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});`
);

q(132, 9, "9. Payment Integration Workflows",
  "Why must you NEVER trust prices, totals, or currencies sent from the frontend?",
  "A client-side frontend is entirely user-controlled. Any user can open Chrome DevTools, edit JavaScript variables, intercept network payloads with proxy tools (Burp Suite, Postman), and change a $1,000 product price to $0.01.\nThe Node.js backend MUST re-fetch product prices from the authoritative database, multiply by validated item quantities, apply validated discount coupons from DB, and calculate the final payable amount on the server.",
  "Memory Anchor: Frontend prices are untrusted user input! Always calculate final order totals on the server from DB."
);

q(133, 9, "9. Payment Integration Workflows",
  "What is PCI-DSS compliance and how does Stripe Elements / Tokenization protect your Node server?",
  "PCI-DSS (Payment Card Industry Data Security Standard) mandates strict compliance audits, network isolation, and encryption for any server that transmits, processes, or stores raw credit card numbers (PAN/CVV).\nBy using Stripe Elements or hosted checkout, card details are collected directly in an iframe hosted on Stripe's PCI-compliant servers and tokenized. Your Node server receives only a safe token (`pm_123` or `client_secret`), achieving **SAQ-A compliance** with zero raw card handling liability.",
  "Memory Anchor: Stripe Elements tokens keep raw card numbers off your server, achieving SAQ-A PCI compliance."
);

q(134, 9, "9. Payment Integration Workflows",
  "What is 3D Secure (3DS2) and Strong Customer Authentication (SCA)?",
  "3D Secure 2 is an authentication protocol mandated by European PSD2 regulations and global banks. It challenges customers to complete two-factor authentication (OTP via SMS, bank mobile app biometric prompt) during checkout.\nIn Node, your PaymentIntent enters `requires_action` status. The frontend handles the modal bank prompt and completes authentication, after which the webhook emits `payment_intent.succeeded`.",
  "Memory Anchor: 3DS2 = Bank MFA/OTP challenge. Handled on frontend; final success received in backend webhook."
);

q(135, 9, "9. Payment Integration Workflows",
  "How do you prevent duplicate order fulfillment when a webhook is delivered twice?",
  "1) Use a database transaction with a unique constraint on `payment_intent_id`.\n2) Check order state: if `order.status === 'paid'`, ignore the webhook.\n3) Store processed webhook event IDs in Redis (`SET webhook:evt_123 1 NX EX 86400`) to guarantee idempotent execution.",
  "Memory Anchor: Check if order already paid + unique DB constraint on transactionId + Redis event deduplication."
);

q(136, 9, "9. Payment Integration Workflows",
  "What is the difference between Payment Authorization and Payment Capture (Auth & Capture)?",
  "- **Authorization**: Places a temporary hold on the customer's funds (e.g. hotel booking, ride-sharing estimate) without charging the card. Hold usually lasts 7 days.\n- **Capture**: Actually transfers the authorized funds to your merchant account once the service is rendered (e.g. when the order ships or ride ends). If cancelled before capture, the hold is released with zero refund fees.",
  "Memory Anchor: Auth = Reserve funds on card. Capture = Actually charge and transfer funds when service completes."
);

q(137, 9, "9. Payment Integration Workflows",
  "How do you handle Refunds and Partial Refunds in Node.js?",
  "Call `stripe.refunds.create({ payment_intent: 'pi_123', amount: 500 })`. Update order status to `'refunded'` or `'partially_refunded'`, log refund reason, adjust inventory if items were returned, and listen for the `charge.refunded` webhook for authoritative confirmation.",
  "Memory Anchor: stripe.refunds.create({ payment_intent, amount }) -> await charge.refunded webhook."
);

q(138, 9, "9. Payment Integration Workflows",
  "What is a Payment Reconciliation job and why is it needed in production?",
  "A reconciliation job is a scheduled background cron job (running daily or hourly) that queries the payment gateway API (e.g. Stripe `paymentIntents.list({ created: { gte: yesterday } })`) and compares gateway transactions against your internal database orders.\nIt catches discrepancies caused by missed webhooks, database connection drops during webhook processing, or network partitions, ensuring every cent charged has a corresponding fulfilled order.",
  "Memory Anchor: Reconciliation = Daily cron comparing gateway charges vs internal DB to fix missed webhooks and billing drift."
);

q(139, 9, "9. Payment Integration Workflows",
  "How do you handle recurring subscriptions, billing cycles, and failed payment webhooks?",
  "1) Use Stripe Subscriptions (`stripe.subscriptions.create({ customer, items: [{ price }] })`).\n2) Listen to webhooks:\n   - `invoice.paid`: Extend customer subscription end date in DB.\n   - `invoice.payment_failed`: Trigger dunning workflow (send email warning customer, grace period of 3 days before downgrading account).\n   - `customer.subscription.deleted`: Revoke premium access.",
  "Memory Anchor: Subscriptions: invoice.paid extends access; invoice.payment_failed triggers dunning emails; subscription.deleted revokes access."
);

q(140, 9, "9. Payment Integration Workflows",
  "How do you handle currency conversions and zero-decimal currencies in Stripe?",
  "Stripe requires amounts in the **smallest currency unit** (e.g. cents for USD: $10.00 is passed as `1000`; paise for INR: ₹10.00 is passed as `1000`).\nHowever, some currencies are **zero-decimal currencies** (e.g. Japanese Yen JPY, Korean Won KRW) where `1000` means ¥1000, not ¥10. Always use an authoritative currency helper to avoid charging customers 100x the intended amount!",
  "Memory Anchor: Stripe amounts are in smallest units (cents/paise), except zero-decimal currencies like JPY/KRW."
);

q(141, 9, "9. Payment Integration Workflows",
  "What is a Distributed Lock in payment checkout (Redis Redlock), and why is it needed?",
  "When a user with a poor mobile connection taps 'Pay Now' 3 times in 200 milliseconds, or when two users attempt to purchase the last available flight seat simultaneously, concurrent requests race to create orders.\nA distributed lock (`redlock` in Redis) guarantees that only **one request at a time** can execute the checkout and inventory-deduction logic for a given user or cart ID, preventing double booking and duplicate charges.",
  "Memory Anchor: Redis distributed lock prevents parallel concurrent requests from double-charging or double-booking inventory."
);

q(142, 9, "9. Payment Integration Workflows",
  "How do you handle payment provider outages gracefully?",
  "1) Implement a circuit breaker (e.g. `opossum`) around payment gateway API calls so your server fails fast instead of hanging when the gateway is down.\n2) If primary gateway (e.g. Stripe) is degraded, route transactions to a secondary fallback provider (e.g. PayPal or Razorpay).\n3) Save pending checkout intents with an expiration TTL so users can retry once services recover.",
  "Memory Anchor: Circuit breaker fails fast on provider downtime; multi-gateway fallback ensures business continuity."
);

q(143, 9, "9. Payment Integration Workflows",
  "What is Razorpay Order creation and how does the frontend-backend flow work?",
  "1) Server calls `razorpay.orders.create({ amount: 50000, currency: 'INR', receipt: 'order_rcptid_11' })`.\n2) Server returns `order.id` to frontend.\n3) Frontend opens Razorpay Checkout modal with `order_id` and collects payment.\n4) On success, frontend sends `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to backend.\n5) Backend verifies HMAC signature: `HMAC_SHA256(order_id + '|' + payment_id, secret) === signature`.",
  "Memory Anchor: Razorpay flow: Server creates Order -> Frontend collects payment -> Server verifies HMAC(order_id + '|' + payment_id)."
);

q(144, 9, "9. Payment Integration Workflows",
  "What are Chargebacks and Disputes, and how should your backend respond?",
  "A chargeback occurs when a cardholder disputes a charge with their credit card company (claims fraud or non-delivery). Gateway emits `charge.dispute.created` webhook.\nYour backend should:\n1) Flag the transaction and temporarily restrict fraudulent account.\n2) Automatically submit evidence (proof of delivery, IP logs, customer signature, email history) via `stripe.disputes.update()` before the deadline.",
  "Memory Anchor: Chargeback = Customer bank dispute. Listen to dispute webhook and upload delivery evidence."
);

q(145, 9, "9. Payment Integration Workflows",
  "How do you securely test payment flows in automated CI/CD pipelines without live credentials?",
  "1) Use mock payment service adapters or gateway test API keys (`sk_test_...`) in staging.\n2) In unit/integration tests with Supertest, mock gateway SDK methods (`jest.spyOn(stripe.paymentIntents, 'create').mockResolvedValue(...)`).\n3) Test edge cases: card declined (`card_declined`), expired card, insufficient funds, and network timeout.",
  "Memory Anchor: Mock gateway SDK calls in Jest integration tests; test decline and 3DS challenge error branches."
);

// TOPIC 10: Security, CORS & Hardening (Q146–Q160)
q(146, 10, "10. Security, CORS & Hardening",
  "What is CORS (Cross-Origin Resource Sharing) and how does the cors middleware work?",
  "CORS is a browser security mechanism that restricts web applications from making HTTP requests to a different domain, port, or protocol than the one that served the frontend.\nThe Express `cors()` middleware sets response headers:\n- `Access-Control-Allow-Origin`: Allowed origins (`https://myapp.com` or `*`).\n- `Access-Control-Allow-Methods`: Permitted HTTP verbs.\n- `Access-Control-Allow-Headers`: Allowed custom request headers.\n- `Access-Control-Allow-Credentials`: Must be `true` if cookies or authorization headers are included.",
  "Memory Anchor: CORS is enforced by BROWSER, not server! Server returns Access-Control-Allow-* headers telling browser it is safe.",
  `import cors from 'cors';

const allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman):
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));`
);

q(147, 10, "10. Security, CORS & Hardening",
  "Why is Access-Control-Allow-Origin: * incompatible with credentials: true?",
  "Web security specifications strictly forbid setting `Access-Control-Allow-Origin: *` (wildcard) when `Access-Control-Allow-Credentials: true` is enabled. If this were permitted, any malicious third-party website could make authenticated requests using a user's stored cookies to access sensitive banking or email data.\nYou MUST specify the explicit, exact origin (e.g. `https://myapp.com`).",
  "Memory Anchor: Wildcard * and credentials: true together are blocked by all browsers for security."
);

q(148, 10, "10. Security, CORS & Hardening",
  "What is Helmet middleware and what security headers does it set?",
  "`helmet()` sets 15 sensible HTTP response headers that defend against common web vulnerabilities:\n1) `Content-Security-Policy (CSP)`: Restricts where scripts, images, and stylesheets can be loaded from, stopping XSS.\n2) `Strict-Transport-Security (HSTS)`: Forces browser to communicate only via HTTPS.\n3) `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.\n4) `X-Frame-Options: SAMEORIGIN` / `DENY`: Prevents Clickjacking in iframes.\n5) `X-XSS-Protection`: Defends legacy browsers against reflected XSS.",
  "Memory Anchor: helmet() sets CSP, HSTS, X-Content-Type-Options, X-Frame-Options to harden HTTP headers."
);

q(149, 10, "10. Security, CORS & Hardening",
  "What is Rate Limiting and how do you implement it with express-rate-limit and Redis?",
  "Rate limiting limits the number of requests a client IP or authenticated user can make within a time window, defending against Brute-Force attacks, DDoS, and API scraping.\nUse `express-rate-limit` with `rate-limit-redis` to share limits across horizontally scaled server instances in Redis.",
  "Memory Anchor: Rate limit defends against brute-force & DDoS. Use Redis store so limits apply across all cluster instances.",
  `import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed attempts per IP
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
});

app.post('/api/auth/login', authLimiter, loginHandler);`
);

q(150, 10, "10. Security, CORS & Hardening",
  "What is NoSQL Injection in MongoDB and how do you prevent it in Node.js?",
  "NoSQL injection occurs when an attacker passes an object containing MongoDB operators (`$gt`, `$ne`, `$regex`) into query parameters instead of a string:\nAttacking payload: `{ username: 'admin', password: { $gt: '' } }`.\nBecause `password > ''` evaluates to true for all non-empty strings, the attacker logs in without a password!\nPrevention:\n1) Use `express-mongo-sanitize` (strips `$` and `.` from inputs).\n2) Use strict schema validation (Zod / Joi) to enforce that password is strictly a `string`.",
  "Memory Anchor: NoSQL injection passes {$gt: ''} to bypass login. Prevent using express-mongo-sanitize + Zod schema validation.",
  `import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize()); // Replaces any key starting with '$' or containing '.'`
);

q(151, 10, "10. Security, CORS & Hardening",
  "What is SQL Injection and how do parameterized queries prevent it?",
  "SQL injection occurs when untrusted user input is directly concatenated into a raw SQL query string (`'SELECT * FROM users WHERE email = \"' + email + '\"'`). An attacker injects `' OR '1'='1` to dump the database.\nPrevention: Always use **parameterized queries** (`SELECT * FROM users WHERE email = ?` with `[email]`). The database driver treats parameters strictly as literal data values, never as executable SQL code.",
  "Memory Anchor: Never string-concatenate SQL! Always use parameterized queries (db.query('... ?', [val]))."
);

q(152, 10, "10. Security, CORS & Hardening",
  "What is Cross-Site Request Forgery (CSRF) and how do you prevent it in APIs?",
  "CSRF tricks an authenticated user's browser into submitting an unauthorized state-changing request (e.g. transfer money) to a vulnerable site where the user has active session cookies.\nPrevention:\n1) Set `SameSite: 'strict'` on session cookies (browser won't send cookie on cross-site requests).\n2) Use CSRF tokens (`csurf` or double-submit cookie pattern).\n3) Stateless APIs using `Authorization: Bearer <token>` in JS headers are naturally immune to CSRF because browsers never attach custom headers automatically on cross-site form submits.",
  "Memory Anchor: SameSite: 'strict' cookies + custom Authorization Bearer headers eliminate CSRF."
);

q(153, 10, "10. Security, CORS & Hardening",
  "What is Cross-Site Scripting (XSS) and what is the difference between Stored, Reflected, and DOM XSS?",
  "XSS occurs when malicious JavaScript code is injected and executed in victims' browsers:\n- **Stored XSS**: Malicious script is saved in DB (e.g. comment field `<script>stealCookie()</script>`) and executed by every user viewing the page.\n- **Reflected XSS**: Script is in URL query parameter and reflected back in server response.\n- **DOM XSS**: Vulnerability in client JS reading data from `location.hash` and writing to `innerHTML`.\nPrevention: Sanitize with DOMPurify on frontend, validate inputs on backend, use CSP headers, and set `httpOnly` on cookies.",
  "Memory Anchor: Stored XSS in DB; Reflected in URL; DOM in client. Prevent via input validation, DOMPurify, CSP, and HttpOnly cookies."
);

q(154, 10, "10. Security, CORS & Hardening",
  "What is Server-Side Request Forgery (SSRF) and how do you defend against it?",
  "SSRF occurs when an attacker tricks the Node.js server into making an HTTP request to an internal, private network address (e.g. user provides image URL `http://169.254.169.254/latest/meta-data/` to dump AWS cloud credentials or `http://localhost:6379` to query internal Redis).\nPrevention: Whitelist allowed domains/protocols, resolve DNS and reject private RFC 1918 / loopback IP ranges (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `169.254.x.x`), and disable following redirects to private IPs.",
  "Memory Anchor: SSRF tricks server to fetch internal IPs (169.254.169.254 metadata). Whitelist domains and block private IP ranges."
);

q(155, 10, "10. Security, CORS & Hardening",
  "What is Prototype Pollution in Node.js?",
  "Prototype pollution occurs when merging or cloning untrusted JSON objects that contain `__proto__` or `constructor.prototype` properties (`{ \"__proto__\": { \"isAdmin\": true } }`).\nModifying the root `Object.prototype` injects properties into ALL JavaScript objects across the entire Node process, leading to privilege escalation, DoS, or remote code execution.\nPrevention: Use `Object.create(null)`, freeze prototypes, use modern Lodash (`lodash >= 4.17.21`), or use Map objects for dynamic keys.",
  "Memory Anchor: Prototype pollution injects properties into Object.prototype via __proto__. Avoid unsafe recursive deep merges."
);

q(156, 10, "10. Security, CORS & Hardening",
  "Why should you hide the X-Powered-By: Express header?",
  "By default, Express sends `X-Powered-By: Express` in response headers. This reveals your tech stack to automated vulnerability scanners, making it easier for attackers to target known Express and Node.js security CVEs.\nDisable it using `app.disable('x-powered-by')` or `app.use(helmet())`.",
  "Memory Anchor: app.disable('x-powered-by') hides your tech stack from vulnerability scanners."
);

q(157, 10, "10. Security, CORS & Hardening",
  "What is ReDoS (Regular Expression Denial of Service)?",
  "ReDoS occurs when a regular expression with catastrophic backtracking (e.g. `/(a+)+$/`) evaluates an evil input string (e.g. `'aaaaaaaaaaaaaaaaaaaaa!'`). The regex engine takes exponential time ($O(2^n)$), pegging the single-threaded CPU at 100% and completely freezing the server.\nPrevention: Avoid nested quantifiers (`(a+)+`), validate regex with `safe-regex`, or enforce execution timeouts.",
  "Memory Anchor: ReDoS = Evil regex + catastrophic backtracking freezes single thread. Avoid nested quantifiers (a+)+."
);

q(158, 10, "10. Security, CORS & Hardening",
  "How do you manage sensitive environment secrets securely in production?",
  "1) Never commit `.env` files to git.\n2) Use secret managers in cloud environments (AWS Secrets Manager, HashiCorp Vault, Doppler).\n3) Validate required environment variables at server startup using Zod or `envalid` so the server fails fast if a secret is missing.",
  "Memory Anchor: Never commit .env to git; validate presence of all required secrets at boot with Zod/envalid.",
  `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_')
});

export const env = envSchema.parse(process.env); // Throws immediately if secret is missing!`
);

q(159, 10, "10. Security, CORS & Hardening",
  "What is npm audit and how do you protect against supply chain attacks?",
  "`npm audit` checks your dependency tree against the GitHub Advisory Database for reported CVE vulnerabilities.\nProtection strategies:\n1) Run `npm audit` in CI/CD pipeline.\n2) Use `package-lock.json` with integrity SHA hashes.\n3) Lock dependency versions (avoid reckless `*` or wildcard version ranges).\n4) Use automated tools like Snyk or Dependabot to receive immediate security alerts.",
  "Memory Anchor: Supply chain defense: npm audit + Dependabot + committed package-lock with SHA-512 integrity hashes."
);

q(160, 10, "10. Security, CORS & Hardening",
  "What is HTTP Parameter Pollution (HPP)?",
  "HPP occurs when multiple query parameters with the same name are passed (`?role=user&role=admin`). Express converts `req.query.role` into an array: `['user', 'admin']`.\nIf code checks `if (req.query.role === 'admin')`, it fails, but if passed to DB as `{ role: req.query.role }`, it queries `{ role: { $in: ['user', 'admin'] } }`.\nUse `hpp()` middleware to sanitize duplicate parameters.",
  "Memory Anchor: HPP = Duplicate query params convert to array. Use hpp() middleware to enforce single scalar values."
);

// TOPIC 11: File Uploads & S3/Multer (Q161–Q175)
q(161, 11, "11. File Uploads & S3/Multer",
  "What is Multer and why is it needed for file uploads in Express?",
  "Standard Express body parsers (`express.json()`, `express.urlencoded()`) can only parse text-based formats. File uploads are transmitted using `multipart/form-data`.\nMulter is middleware that parses multipart form data, extracting text fields into `req.body` and binary uploaded files into `req.file` or `req.files`.",
  "Memory Anchor: Multer parses multipart/form-data, placing text in req.body and uploaded files in req.file."
);

q(162, 11, "11. File Uploads & S3/Multer",
  "What is the difference between multer.memoryStorage() and multer.diskStorage()?",
  "- `memoryStorage()`: Stores uploaded files in memory as `Buffer` objects in `req.file.buffer`. Fast and convenient for direct streaming to AWS S3, but can exhaust server RAM if large files are uploaded concurrently.\n- `diskStorage()`: Writes uploaded files directly to temporary disk storage on the local filesystem (`req.file.path`). Safe against memory exhaustion for large files (videos, archives), but requires manual cleanup of temp files after S3 upload.",
  "Memory Anchor: memoryStorage = RAM buffer (fast for S3, risky for huge files). diskStorage = Temp files on disk (safe for large files).",
  null,
  null,
  [
    { aspect: "memoryStorage()", detail: "req.file.buffer; zero disk I/O; consumes V8 heap memory." },
    { aspect: "diskStorage()", detail: "req.file.path; low memory footprint; requires manual temp file cleanup." }
  ]
);

q(163, 11, "11. File Uploads & S3/Multer",
  "How do you upload a file directly from Express to AWS S3 using AWS SDK v3?",
  "Use `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` (`Upload` class). The `Upload` class accepts a stream or Buffer and handles multipart parallel uploads for large files automatically.",
  "Memory Anchor: Use AWS SDK v3 Upload utility to stream file buffer directly to S3 bucket.",
  `import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const s3Client = new S3Client({ region: 'us-east-1' });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  const fileKey = \`uploads/\${Date.now()}-\${req.file.originalname}\`;
  
  const parallelUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }
  });

  const result = await parallelUpload.done();
  res.json({ url: result.Location, key: fileKey });
});`
);

q(164, 11, "11. File Uploads & S3/Multer",
  "Why is uploading files via S3 Pre-signed URLs superior to uploading through your Node.js server?",
  "Direct-to-server uploads consume your Node server's CPU, RAM, and network bandwidth for the entire duration of the file transfer (a 100 MB upload on a slow client connection ties up your server for minutes).\n**S3 Pre-signed URL pattern**:\n1) Client requests an upload URL: `GET /api/get-upload-url?fileType=image/png`.\n2) Node server creates a secure, temporary pre-signed PUT URL using S3 SDK and returns it.\n3) Client uploads the file **directly from the browser to Amazon S3**, bypassing your server completely. Zero server memory or bandwidth consumed!",
  "Memory Anchor: Pre-signed URL = Client uploads directly to S3; your Node server uses ZERO bandwidth or RAM."
);

q(165, 11, "11. File Uploads & S3/Multer",
  "How do you generate an S3 Pre-signed PUT URL in Node.js?",
  "Use `getSignedUrl` from `@aws-sdk/s3-request-presigner` and `PutObjectCommand` from `@aws-sdk/client-s3`.",
  "Memory Anchor: getSignedUrl(s3, PutObjectCommand, { expiresIn: 300 }) generates temporary upload URL.",
  `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

app.post('/api/presigned-url', authenticateUser, async (req, res) => {
  const { fileName, fileType } = req.body;
  const key = \`users/\${req.user.id}/\${Date.now()}-\${fileName}\`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes validity
  res.json({ uploadUrl, key });
});`
);

q(166, 11, "11. File Uploads & S3/Multer",
  "How do you validate uploaded files by Magic Numbers (file signatures) instead of trusting file extensions?",
  "An attacker can rename an executable file `malware.exe` to `photo.jpg`. Checking `req.file.originalname.endsWith('.jpg')` or `req.file.mimetype` is insecure because both are client-supplied headers.\n**Magic Numbers validation**: Inspect the first few binary bytes of the file buffer (e.g. JPEG always begins with `FF D8 FF`, PNG with `89 50 4E 47 0D 0A 1A 0A`, PDF with `%PDF`). Use a library like `file-type` to detect the true binary file type.",
  "Memory Anchor: Client extensions and mimetypes are easily spoofed. Inspect magic binary bytes using file-type.",
  `import { fileTypeFromBuffer } from 'file-type';

const mime = await fileTypeFromBuffer(req.file.buffer);
if (!mime || !['image/jpeg', 'image/png'].includes(mime.mime)) {
  return res.status(400).json({ error: 'Fraudulent file! Binary magic bytes do not match an image.' });
}`
);

q(167, 11, "11. File Uploads & S3/Multer",
  "How do you enforce file size limits in Multer?",
  "Pass the `limits: { fileSize: bytes }` option in `multer()`. If an uploaded file exceeds this limit, Multer rejects the request with code `'LIMIT_FILE_SIZE'`.",
  "Memory Anchor: multer({ limits: { fileSize: 5 * 1024 * 1024 } }) enforces 5 MB limit.",
  `const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  storage: multer.memoryStorage()
});`
);

q(168, 11, "11. File Uploads & S3/Multer",
  "What is the difference between upload.single(), upload.array(), and upload.fields()?",
  "- `upload.single('avatar')`: Accepts a single file from the named field; populates `req.file`.\n- `upload.array('photos', 5)`: Accepts an array of files sharing the same field name; populates `req.files`.\n- `upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])`: Accepts multiple different file fields in the same form; populates `req.files` as an object with arrays per field.",
  "Memory Anchor: single -> req.file; array -> req.files[]; fields -> req.files{ fieldA: [], fieldB: [] }."
);

q(169, 11, "11. File Uploads & S3/Multer",
  "How do you resize and optimize uploaded images in Node.js before saving?",
  "Use `sharp`. It is a high-performance C++ image processing library. Stream or pass the uploaded Buffer through Sharp to resize, convert to modern WebP/AVIF format, and strip EXIF metadata (which may leak GPS coordinates).",
  "Memory Anchor: Use sharp to resize, compress to WebP, and strip location EXIF data from images.",
  `import sharp from 'sharp';

const optimizedBuffer = await sharp(req.file.buffer)
  .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 80 })
  .toBuffer();`
);

q(170, 11, "11. File Uploads & S3/Multer",
  "How do you prevent Directory Traversal attacks in file downloads?",
  "If a download route serves files based on user input (`app.get('/download/:file')`), an attacker can pass `../../etc/passwd` to read sensitive server files.\nPrevention:\n1) Use `path.basename(req.params.file)` to strip directory slashes.\n2) Resolve absolute path with `path.resolve()` and verify it starts with your intended root directory (`filePath.startsWith(PUBLIC_DIR)`).",
  "Memory Anchor: path.basename() strips ../ traversal attempts. Verify resolved path stays inside allowed root dir.",
  `const safeFileName = path.basename(req.params.filename);
const targetPath = path.resolve(UPLOADS_DIR, safeFileName);
if (!targetPath.startsWith(UPLOADS_DIR)) {
  return res.status(403).json({ error: 'Access denied: Directory traversal detected' });
}`
);

q(171, 11, "11. File Uploads & S3/Multer",
  "How do you stream a file directly from S3 to an Express HTTP response?",
  "Call `s3Client.send(new GetObjectCommand({ Bucket, Key }))`. The returned `response.Body` is a Readable stream in Node.js. Pipe it directly to `res`: `response.Body.pipe(res)`.",
  "Memory Anchor: GetObjectCommand returns readable stream in Body. Pipe directly to Express res.",
  `const command = new GetObjectCommand({ Bucket: 'my-bucket', Key: req.params.key });
const s3Response = await s3Client.send(command);
res.setHeader('Content-Type', s3Response.ContentType);
s3Response.Body.pipe(res);`
);

q(172, 11, "11. File Uploads & S3/Multer",
  "Why is storing uploaded user files in the local server directory dangerous in containerized apps?",
  "1) **Ephemeral Containers**: Docker containers / Kubernetes pods are recreated on deployments; local disk storage is wiped out and files are permanently lost.\n2) **Horizontal Scaling**: If an app runs on 3 load-balanced instances, a file uploaded to Instance A will return 404 when requested by a user routed to Instance B.\nAlways use cloud object storage (AWS S3, Google Cloud Storage, Cloudflare R2) for persistent files.",
  "Memory Anchor: Local storage is lost on Docker restarts and broken on multi-instance clusters. Always store uploads in S3."
);

q(173, 11, "11. File Uploads & S3/Multer",
  "How do you handle Multer errors cleanly in Express?",
  "Multer throws specific error instances (`multer.MulterError`). Inspect `err instanceof multer.MulterError` in your error handler to return user-friendly messages for `'LIMIT_FILE_SIZE'`, `'LIMIT_UNEXPECTED_FILE'`, etc.",
  "Memory Anchor: Catch err instanceof multer.MulterError and return 400 with clean error message.",
  `app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large! Maximum limit is 5MB.' });
    }
    return res.status(400).json({ error: \`Upload error: \${err.message}\` });
  }
  next(err);
});`
);

q(174, 11, "11. File Uploads & S3/Multer",
  "What is Busboy and how does it compare to Multer?",
  "Busboy is the low-level, high-performance streaming multipart parser that Multer is built upon. While Multer buffers or writes to disk, Busboy allows you to process individual file chunks as pure streams the instant they arrive over the network, achieving maximum memory efficiency for extreme high-throughput pipelines.",
  "Memory Anchor: Busboy is the low-level streaming engine underneath Multer."
);

q(175, 11, "11. File Uploads & S3/Multer",
  "How do you scan uploaded files for viruses and malware in Node.js?",
  "Pass the uploaded file buffer or stream to a ClamAV daemon (`clamscan`) or cloud scanning service (AWS GuardDuty, VirusTotal API) before making the file publicly accessible or saving to permanent storage.",
  "Memory Anchor: Pipe uploaded files to ClamAV scanner before saving to production storage."
);

fs.writeFileSync(path.resolve(__dirname, 'batch_9_10_11.json'), JSON.stringify(batch, null, 2));
console.log('Batch 9, 10, 11 generated! Total count:', batch.length);
