const fs = require('fs');
const path = require('path');

const batch1 = require('./node_notes_parts_1_to_8.json');
const batch2 = require('./node_notes_parts_9_to_16.json');
const batch3 = require('./node_notes_parts_17_to_24.json');

// ========================================================
// EXPRESS MODULE 4: HTTP & API DESIGN (Part 7)
// ========================================================
const expressModule4Sections = [
  {
    id: "7.1",
    title: "19. HTTP Protocol Lifecycle, Safe vs Idempotent Verbs & Content Negotiation",
    content: `### 1. Topic Overview & Mental Model
Designing professional REST APIs requires a deep mastery of the **HTTP/1.1 and HTTP/2 protocol specification** (RFC 9110).
- An API is an external contract with frontend clients, mobile apps, and third-party partners. Violating HTTP standards leads to broken caches, duplicate billing transactions, and security flaws.
- **Mental Model**: The International Postal Treaty. HTTP methods and headers are the standardized stamps, delivery envelopes, and customs declarations that ensure any client in the world can exchange data with your server without misunderstanding.

### 2. HTTP Methods: Safety vs Idempotency Matrix
1. **Safe Methods**:
   - Calling the method **does NOT mutate server state**. They are read-only.
   - Examples: \`GET\`, \`HEAD\`, \`OPTIONS\`.
   - Browsers and CDNs are permitted to automatically cache and pre-fetch safe requests.
2. **Idempotent Methods**:
   - Calling the method **N times produces the exact same server state as calling it once**: $f(f(x)) = f(x)$.
   - Examples: \`GET\`, \`PUT\`, \`DELETE\`, \`HEAD\`.
   - *Example*: \`DELETE /orders/123\` is idempotent. The first call deletes the order; subsequent calls still leave the order deleted.
3. **Non-Idempotent Methods**:
   - Calling the method multiple times creates duplicate resources or triggers side-effects multiple times.
   - Examples: \`POST\` (e.g. creating a payment or user), \`PATCH\` (if using delta modifications like \`increment\`).

### 3. HTTP Request & Response Headers Deep-Dive
- **Content Negotiation**: The client declares what format it accepts via the \`Accept\` header (\`application/json\`, \`text/csv\`, \`application/xml\`). The server responds with the matching \`Content-Type\` or returns \`406 Not Acceptable\`.
- **ETags & Conditional Requests**:
  - The server generates an \`ETag: "hash123"\` (entity tag) representing the version of the resource.
  - The client caches the response and on subsequent requests sends: \`If-None-Match: "hash123"\`.
  - If the resource has not changed, the server responds with **\`304 Not Modified\`** with an empty body, saving bandwidth and database CPU!
- **Correlation IDs & Request IDs**:
  - The API gateway or Express middleware extracts \`X-Request-Id\` or generates a UUID.
  - This ID is logged across every microservice and returned in response headers, allowing engineers to trace a user's failed request across distributed systems in seconds.`,
    comparisonTable: [
      {
        aspect: "HTTP Method",
        verb: "GET",
        safe: "YES",
        idempotent: "YES",
        cacheable: "YES",
        statusSuccess: "200 OK"
      },
      {
        aspect: "HTTP Method",
        verb: "POST",
        safe: "NO",
        idempotent: "NO",
        cacheable: "Only with explicit Cache-Control",
        statusSuccess: "201 Created"
      },
      {
        aspect: "HTTP Method",
        verb: "PUT",
        safe: "NO",
        idempotent: "YES",
        cacheable: "NO",
        statusSuccess: "200 OK or 204 No Content"
      },
      {
        aspect: "HTTP Method",
        verb: "PATCH",
        safe: "NO",
        idempotent: "NO (typically)",
        cacheable: "NO",
        statusSuccess: "200 OK"
      },
      {
        aspect: "HTTP Method",
        verb: "DELETE",
        safe: "NO",
        idempotent: "YES",
        cacheable: "NO",
        statusSuccess: "204 No Content or 200 OK"
      }
    ],
    code: `// HTTP Caching with ETags, Conditional Requests & Correlation IDs
import express from 'express';
import crypto from 'node:crypto';

const app = express();

// 1. Correlation ID Middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);
  next();
});

// 2. Resource with ETag Caching (304 Not Modified)
const userProfile = { id: 'usr_42', name: 'Alex Rivera', role: 'Staff Engineer', version: 3 };

app.get('/api/v1/profile', (req, res) => {
  // Generate deterministic ETag hash from content
  const etag = \`"\${crypto.createHash('md5').update(JSON.stringify(userProfile)).digest('hex')}"\`;
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'private, no-cache'); // Validate with server each time

  // Check conditional header
  if (req.headers['if-none-match'] === etag) {
    // Client cache is fresh! Send 304 Not Modified with zero body bytes!
    return res.status(304).end();
  }

  res.status(200).json(userProfile);
});`,
    keyTakeaways: [
      "GET is safe and idempotent; PUT and DELETE are idempotent; POST is neither safe nor idempotent.",
      "Always return 304 Not Modified when client If-None-Match matches the server ETag to save bandwidth.",
      "Propagate X-Correlation-Id across all microservices and return it in headers for rapid incident tracing.",
      "Content negotiation via Accept header allows a single endpoint to serve JSON, CSV, or XML cleanly."
    ]
  },
  {
    id: "7.2",
    title: "20. REST Resource Design, Pagination, API Versioning & RFC 7807 Errors",
    content: `### 1. Topic Overview & Mental Model
Professional REST API design requires intuitive URL modeling, scalable pagination, strict backward compatibility, and standardized error formats.
- **REST Resource Modeling**: URLs should be **nouns in plural form** representing resources (\`/orders\`, \`/users\`), never verbs (\`/getUsers\`, \`/createOrder\`). HTTP methods act as verbs.
- **Nested Resources**: Represent relationships naturally: \`/organizations/:orgId/projects/:projectId/tasks\`. Rule: Limit URL nesting to **2 levels max**; deeper hierarchies should use top-level resources with query filters (\`/tasks?projectId=...\`).
- **Pagination: Offset vs Cursor (Keyset)**:
  - *Offset Pagination (\`?page=500&limit=20\` or \`OFFSET 10000\`)*: Slow ($O(N)$ database scan), suffers from skipped/duplicate items when new records are inserted during browsing.
  - *Cursor Pagination (\`?cursor=eyJpZCI6NDJ9&limit=20\`)*: Fast ($O(1)$ index seek using \`WHERE id > :lastId\`), zero drift, ideal for infinite scrolling and high-throughput mobile feeds.
- **Standardized Error Responses (RFC 7807 Problem Details)**:
  - Returning random error formats (\`{ err: 'Failed' }\` vs \`{ message: 'Error' }\`) breaks frontend API clients.
  - Use the IETF standard **RFC 7807 \`application/problem+json\`** specification.`,
    comparisonTable: [
      {
        aspect: "Strategy",
        offsetPagination: "Offset Pagination (?page=2&limit=20)",
        cursorPagination: "Cursor / Keyset Pagination (?cursor=last_id)"
      },
      {
        aspect: "Database Performance",
        offsetPagination: "O(N) - Database scans and discards OFFSET rows",
        cursorPagination: "O(1) - Direct B-Tree index lookup via WHERE id > :cursor"
      },
      {
        aspect: "Page Drift (Insert/Delete)",
        offsetPagination: "High drift: items duplicate or get skipped",
        cursorPagination: "Zero drift: stable pointer to exact position"
      },
      {
        aspect: "Random Page Jumping",
        offsetPagination: "Supported (Jump directly to page 50)",
        cursorPagination: "Not supported (Forward/backward sequential only)"
      },
      {
        aspect: "Best Use Case",
        offsetPagination: "Admin tables with page number buttons",
        cursorPagination: "Mobile feeds, infinite scroll, large datasets"
      }
    ],
    code: `// Production Cursor Pagination & RFC 7807 Error Handler
import express from 'express';

// 1. RFC 7807 Problem Details Error Builder
export function sendProblemDetails(res, { status, title, detail, instance, invalidParams }) {
  res.setHeader('Content-Type', 'application/problem+json');
  return res.status(status).json({
    type: \`https://api.example.com/errors/\${status}\`,
    title,
    status,
    detail,
    instance: instance || res.req.originalUrl,
    timestamp: new Date().toISOString(),
    ...(invalidParams && { invalidParams })
  });
}

// 2. Cursor Pagination Implementation
export function paginateWithCursor(items, limit, getCursorFn) {
  const hasMore = items.length > limit;
  const paginatedItems = hasMore ? items.slice(0, limit) : items;
  
  const nextCursor = hasMore && paginatedItems.length > 0 
    ? Buffer.from(String(getCursorFn(paginatedItems[paginatedItems.length - 1]))).toString('base64')
    : null;

  return {
    data: paginatedItems,
    pagination: {
      limit,
      hasMore,
      nextCursor
    }
  };
}`,
    keyTakeaways: [
      "Model REST URLs using plural nouns; limit nesting to two levels max to avoid awkward deep URLs.",
      "Use Cursor pagination (Keyset) for large datasets and mobile feeds to prevent O(N) database scans and page drift.",
      "Standardize error responses using the RFC 7807 Problem Details JSON format across all services.",
      "Version APIs via URI path (/api/v1/) or custom headers to guarantee backward compatibility for mobile clients."
    ]
  }
];

// Update batch 1 with updated Part 7
batch1[6] = {
  id: 7,
  title: "Part 7 — API Design, REST Standards & Request-to-Database Workflows",
  badge: "API Architecture",
  color: "#ec4899",
  sections: expressModule4Sections
};
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(batch1, null, 2));
console.log('Successfully updated Part 7 with Express Module 4!');

// ========================================================
// EXPRESS MODULE 5: VALIDATION & ERROR HANDLING (Part 8)
// ========================================================
const expressModule5Sections = [
  {
    id: "8.1",
    title: "21. Syntactic vs Semantic Validation: Zod, Joi & Schema Whitelisting",
    content: `### 1. Topic Overview & Mental Model
Validation is the first line of defense in backend security.
- **Syntactic Validation**: Checks format, types, lengths, and regexes (e.g. "Is this an email string?", "Is age a positive integer?"). Handled at the API boundary before running business logic.
- **Semantic Validation**: Checks business state and relational integrity (e.g. "Does this organization have sufficient credit?", "Is this item in stock?", "Does this username already exist in the database?"). Handled in the Service layer.
- **TypeScript Types vs Runtime Validation**:
  - TypeScript types exist **only at compile time** and are completely erased during compilation to JavaScript.
  - Incoming HTTP JSON bodies are un-typed runtime strings. An attacker can send \`{ "isAdmin": true }\` or \`{ "id": { "$gt": "" } }\`!
  - **The Law of the API Boundary**: You must validate all incoming data at runtime using **Zod** or **Joi**.

### 2. Zod vs Joi vs Express-Validator
1. **Zod (Modern Standard)**:
   - TypeScript-first schema declaration. Automatically infers static TypeScript types (\`z.infer<typeof schema>\`), eliminating duplication between types and validation schemas.
2. **Joi (Legacy Standard)**:
   - Established in the Hapi ecosystem. Powerful, but requires writing TypeScript interfaces separately from Joi schemas.
3. **Express-Validator**:
   - Middleware-based (wrapping validator.js). Less composable than Zod.`,
    comparisonTable: [
      {
        aspect: "Validation Tool",
        tool: "Zod (Recommended)",
        tsInference: "Native z.infer<typeof schema> (Automatic)",
        ecosystem: "Modern TS / Next.js / Full-Stack"
      },
      {
        aspect: "Validation Tool",
        tool: "Joi",
        tsInference: "Manual interface declaration required",
        ecosystem: "Legacy Node / Hapi"
      },
      {
        aspect: "Validation Tool",
        tool: "express-validator",
        tsInference: "No static type inference",
        ecosystem: "Legacy Express middleware"
      }
    ],
    code: `// Runtime Boundary Validation with Zod Schema Whitelisting
import { z } from 'zod';

// Define strict schema with whitelisting and transformations
export const CreateOrderSchema = z.object({
  customerId: z.string().uuid('Invalid Customer UUID format'),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive('Quantity must be >= 1'),
    unitPrice: z.number().positive()
  })).min(1, 'Order must contain at least 1 item'),
  shippingAddress: z.object({
    street: z.string().trim().min(3),
    city: z.string().trim().min(2),
    postalCode: z.string().regex(/^\\d{5}(-\\d{4})?$/, 'Invalid ZIP code')
  }),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD')
}).strict(); // 💡 .strict() rejects unknown properties! Prevents parameter injection!

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;`,
    keyTakeaways: [
      "Compile-time TypeScript interfaces do not validate incoming JSON payloads; runtime validation with Zod is mandatory.",
      "Syntactic validation belongs at the API boundary; semantic validation belongs in the service layer.",
      "Use schema.strict() in Zod to reject unknown payload properties and prevent mass assignment exploits.",
      "Zod automatically infers TypeScript types with z.infer, maintaining a single source of truth."
    ]
  },
  {
    id: "8.2",
    title: "22. Error Normalization: Operational vs Programming Errors & Safe Logging",
    content: `### 1. Topic Overview & Mental Model
Not all errors are equal. In high-reliability backend engineering, we divide errors into two strict categories:
1. **Operational Errors (Expected)**:
   - Known runtime failure conditions inevitable in distributed systems (e.g., 404 Not Found, 422 Validation Error, 409 Duplicate Key, 401 Unauthorized, 503 DB Timeout).
   - Must be caught, normalized into clean client responses, and handled gracefully without crashing the server.
2. **Programming Errors (Bugs)**:
   - Developer bugs and unhandled anomalies (e.g., \`TypeError: Cannot read properties of undefined\`, syntax errors, passing wrong argument types).
   - In production, a programming error corrupts process state. The server must log the fatal diagnostic stack trace, send a generic 500 error, and **restart the process** (via Kubernetes or PM2).

### 2. Safe Error Logging & Leaked Stack Traces
- **The Information Leak Vulnerability**: Sending \`err.stack\` to frontend clients reveals your file system paths, database table names, ORM versions, and internal package structures to attackers.
- **Rule**: In production (\`NODE_ENV === 'production'\`), NEVER include the stack trace in the HTTP response. Log the full stack trace internally to a secure logging platform (Pino $\to$ CloudWatch), and return only a safe correlation ID to the user.`,
    comparisonTable: [
      {
        aspect: "Error Category",
        operational: "Operational Error",
        programming: "Programming Error (Bug)"
      },
      {
        aspect: "Examples",
        operational: "Invalid password, resource not found, database lock wait",
        programming: "TypeError, ReferenceError, undefined pointer"
      },
      {
        aspect: "Can Be Prevented?",
        operational: "No (inevitable in network/user interactions)",
        programming: "Yes (fixed via tests and code review)"
      },
      {
        aspect: "Server Action",
        operational: "Return 4xx/503 status code; keep process running",
        programming: "Log critical stack trace; restart process cleanly"
      }
    ],
    code: `// Centralized Error Normalizer & Database Error Transformer
export function normalizeError(err) {
  // 1. Handle Known Operational Errors
  if (err.isOperational) {
    return { statusCode: err.statusCode, message: err.message };
  }

  // 2. Handle Database Duplicate Key Errors (Postgres 23505 / MySQL 1062 / Mongo 11000)
  if (err.code === '23505' || err.code === 11000 || err.code === 1062) {
    return { statusCode: 409, message: 'Resource conflict: Unique constraint violation' };
  }

  // 3. Handle Database Record Not Found
  if (err.name === 'NotFoundError' || err.code === 'P2025') {
    return { statusCode: 404, message: 'Requested resource was not found' };
  }

  // 4. Default: Unhandled Programming Error (Bug)
  return {
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  };
}`,
    keyTakeaways: [
      "Distinguish operational errors (handled gracefully) from programming bugs (logged and restarted).",
      "Map database-specific duplicate key codes (Postgres 23505, MySQL 1062, Mongo 11000) to clean 409 Conflict errors.",
      "Never leak stack traces in production HTTP responses; provide a correlation ID for user support.",
      "Always mark custom operational error classes with isOperational = true."
    ]
  }
];

// Update batch 1 with updated Part 8
batch1[7] = {
  id: 8,
  title: "Part 8 — Validation, Error Handling & Operational vs Programming Errors",
  badge: "Error Resilience",
  color: "#f97316",
  sections: expressModule5Sections
};
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(batch1, null, 2));
console.log('Successfully updated Part 8 with Express Module 5!');

// ========================================================
// EXPRESS MODULE 7: FILE UPLOADS & SERVICES (Part 13)
// ========================================================
const expressModule7Sections = [
  {
    id: "13.1",
    title: "28. File Upload Architecture: S3 Presigned URLs vs Streaming & Magic Bytes",
    content: `### 1. Topic Overview & Mental Model
Handling file uploads (images, PDFs, documents) in production backend services requires choosing between two fundamental architectures:
- **Architecture 1: Server-Mediated Uploads (Multer / Memory Streaming)**: The client uploads the file to the Node.js server, which processes it and forwards it to AWS S3.
  - *Hazard*: Consumes backend CPU, bandwidth, and memory buffers. A 100MB video uploaded by 20 concurrent users consumes 2GB of server RAM and ties up 20 HTTP sockets for minutes!
- **Architecture 2: Direct Client-to-S3 Uploads via Pre-signed URLs (Senior Standard)**:
  1. Client sends file metadata (name, size, type) to \`POST /api/uploads/presign\`.
  2. Node.js backend validates permissions and returns a cryptographically signed AWS S3 **Pre-signed PUT URL** valid for 10 minutes.
  3. Client uploads the raw binary file **directly to AWS S3** from the browser, completely bypassing the backend server!
  4. S3 notifies the backend via an SQS webhook when the upload finishes.

### 2. Magic Byte Verification & Secure Filename Generation
- **Never trust client filenames**: An attacker uploading \`../../index.js\` or \`malware.exe\` can overwrite files. Always generate a random UUID: \`const s3Key = \`uploads/\${crypto.randomUUID()}.\${ext}\`\`.
- **Verify Magic Bytes**: Use \`file-type\` to inspect the binary signature of the stream.`,
    comparisonTable: [
      {
        aspect: "Dimension",
        multer: "Server-Mediated (Multer / Busboy)",
        presigned: "AWS S3 Pre-signed URLs (Direct Upload)"
      },
      {
        aspect: "Server Memory & CPU",
        multer: "HIGH: Node server buffers/streams all file bytes",
        presigned: "ZERO: Server only signs a 200-byte URL token"
      },
      {
        aspect: "Server Bandwidth",
        multer: "Double Bandwidth: Client -> Node -> S3",
        presigned: "Single Bandwidth: Client -> S3 directly"
      },
      {
        aspect: "File Size Limits",
        multer: "Limited by Node heap & request timeout",
        presigned: "Supports multi-gigabyte uploads directly to S3"
      }
    ],
    code: `// Generating AWS S3 Pre-signed URLs for Direct Client Uploads
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export async function generateUploadUrl({ userId, filename, contentType, fileSize }) {
  // 1. Validate file constraints
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('File exceeds maximum allowed size of 10MB');
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new Error('Unsupported file type');
  }

  // 2. Generate secure non-predictable S3 object key
  const fileExt = filename.split('.').pop();
  const s3Key = \`users/\${userId}/\${crypto.randomUUID()}.\${fileExt}\`;

  // 3. Create Presigned PUT Command
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType
  });

  // URL valid for 10 minutes
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

  return { presignedUrl, s3Key };
}`,
    keyTakeaways: [
      "Use S3 Pre-signed URLs for direct client uploads to keep backend memory and bandwidth usage near zero.",
      "Never trust client file extensions; inspect binary magic bytes to verify genuine file types.",
      "Always generate cryptographic UUID keys for stored files to prevent filename collisions and path traversal.",
      "Set short expiration times (e.g. 5–10 minutes) on pre-signed URLs."
    ]
  },
  {
    id: "13.2",
    title: "29. Resilient External Services: Nodemailer, Axios vs Fetch, Timeouts & Circuit Breakers",
    content: `### 1. Topic Overview & Mental Model
Modern backends constantly communicate with external third-party services: payment gateways (Stripe), email providers (SendGrid/Nodemailer via SMTP/SES), and SMS delivery.
- Calling external APIs without strict timeouts and circuit breakers is the **#1 cause of cascading microservice outages**.
- **The Circuit Breaker Pattern**:
  - **Closed**: Normal operations. Requests pass through. Failures are counted.
  - **Open**: When failure rate exceeds threshold (e.g. 5 failures in 10s), the circuit trips **Open**. All requests fail immediately without calling the external service, giving it time to recover!
  - **Half-Open**: After a cooldown period, a small test probe request is allowed through. If it succeeds, the circuit closes; if it fails, it trips open again.

### 2. Axios vs Native Fetch in Node 18+
- **Native \`fetch()\`**: Built into Node 18+. Zero external dependencies, fast, uses standard Web API.
- **Axios**: Features automatic JSON parsing, request/response interceptors, and client-wide base URLs.`,
    comparisonTable: [
      {
        aspect: "Client Feature",
        fetchApi: "Native fetch()",
        axios: "Axios Library"
      },
      {
        aspect: "Dependencies",
        fetchApi: "Zero (Built into Node 18+)",
        axios: "npm package"
      },
      {
        aspect: "Timeout Handling",
        fetchApi: "Signal: AbortSignal.timeout(ms)",
        axios: "config: { timeout: 3000 }"
      },
      {
        aspect: "Interceptors",
        fetchApi: "Manual wrapper function",
        axios: "Built-in axios.interceptors"
      }
    ],
    code: `// Resilient Outgoing API Client with Circuit Breaker State Machine
export class CircuitBreaker {
  constructor(actionFn, options = { failureThreshold: 3, resetTimeoutMs: 10000 }) {
    this.actionFn = actionFn;
    this.failureThreshold = options.failureThreshold;
    this.resetTimeoutMs = options.resetTimeoutMs;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttemptTime = Date.now();
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttemptTime) {
        console.warn('⚡ Circuit Breaker entering HALF_OPEN state. Probing upstream service...');
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit Breaker is OPEN. Upstream service is temporarily unavailable.');
      }
    }

    try {
      const result = await this.actionFn(...args);
      if (this.state === 'HALF_OPEN') {
        console.log('✅ Upstream service recovered! Closing circuit breaker.');
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttemptTime = Date.now() + this.resetTimeoutMs;
        console.error(\`🚨 Circuit Breaker tripped OPEN! Next probe in \${this.resetTimeoutMs}ms\`);
      }
      throw err;
    }
  }
}`,
    keyTakeaways: [
      "Use Circuit Breakers to prevent cascading microservice failures when third-party APIs experience downtime.",
      "Always configure explicit request timeouts on outgoing HTTP calls.",
      "Use native fetch with AbortSignal.timeout in Node 18+ for zero-dependency API communication.",
      "Offload email delivery (Nodemailer) and webhook dispatching to background workers (BullMQ / Redis) rather than blocking HTTP responses."
    ]
  }
];

// Update batch 2 with updated Part 13
batch2[4] = {
  id: 13,
  title: "Part 13 — File Uploads, Object Storage, AWS S3 & Resilient External Services",
  badge: "External Integrations",
  color: "#06b6d4",
  sections: expressModule7Sections
};
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_9_to_16.json'), JSON.stringify(batch2, null, 2));
console.log('Successfully updated Part 13 with Express Module 7!');

// ========================================================
// EXPRESS MODULE 8: PRODUCTION EXPRESS (Part 23)
// ========================================================
const expressModule8Sections = [
  batch3[6].sections[0], // Production Docker
  {
    id: "23.2",
    title: "49. Production Express: Reverse Proxies, Trust Proxy, Compression & CI/CD",
    content: `### 1. Topic Overview & Mental Model
Deploying Express to production requires hardening the server behind reverse proxies, managing socket lifecycle, and automating deployments:
- **The Reverse Proxy Architecture**: In production, Node.js should **never be exposed directly to the public internet on ports 80/443**. Instead, traffic routes through a reverse proxy (AWS Application Load Balancer, Cloudflare, Nginx):
  - The reverse proxy terminates TLS/SSL, handles DDoS mitigation, and forwards traffic to Node.js over internal VPC ports.
- **The \`trust proxy\` Setting in Express**:
  - When behind a reverse proxy, the client's original IP address is placed in the \`X-Forwarded-For\` header, and original protocol in \`X-Forwarded-Proto\`.
  - By default, Express ignores these headers and thinks all traffic originates from \`127.0.0.1\`! This breaks rate limiters, geolocation, and secure cookie checks.
  - **Senior Configuration**: Enable \`app.set('trust proxy', 1)\` to instruct Express to trust the first proxy hop.

### 2. Production Checklist
1. **Gzip/Brotli Compression**: Use the \`compression()\` middleware to shrink JSON responses by 70%.
2. **Body Limits**: Cap JSON payloads at 10KB (\`express.json({ limit: '10kb' })\`).
3. **Helmet Headers**: Enforce CSP, HSTS, and frameguard.
4. **Structured JSON Logging**: Stream logs via Pino.
5. **Readiness & Liveness Probes**: Ensure zero-downtime rolling updates in Kubernetes.`,
    comparisonTable: [
      {
        aspect: "Production Setting",
        setting: "app.set('trust proxy', 1)",
        purpose: "Accurately reads req.ip and req.protocol behind ALB / Nginx"
      },
      {
        aspect: "Production Setting",
        setting: "app.use(compression())",
        purpose: "Compresses JSON responses using gzip/deflate, saving 70% egress bandwidth"
      },
      {
        aspect: "Production Setting",
        setting: "NODE_ENV=production",
        purpose: "Disables detailed error stacks and enables Express view/routing caching"
      }
    ],
    code: `// Production-Hardened Express Configuration
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';

const app = express();

// 1. Crucial for Reverse Proxies (ALB / Nginx / Cloudflare)
app.set('trust proxy', 1);

// 2. High-Performance Security & Compression
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(compression());

// 3. Asynchronous Structured HTTP Logging
app.use(pinoHttp({
  redact: ['req.headers.authorization', 'req.body.password']
}));

// 4. Body Parsers with Strict Caps
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));`,
    keyTakeaways: [
      "Always set app.set('trust proxy', 1) when running behind AWS ALB, Cloudflare, or Nginx to read real client IPs.",
      "Use compression middleware to shrink API response payloads by up to 70%.",
      "Never run Express as a root user inside Docker; configure an unprivileged 'node' user.",
      "Implement zero-downtime deployments by coordinating SIGTERM drains with Kubernetes readiness probes."
    ]
  }
];

batch3[6].sections = expressModule8Sections;
fs.writeFileSync(path.join(__dirname, 'node_notes_parts_17_to_24.json'), JSON.stringify(batch3, null, 2));
console.log('Successfully updated Part 23 with Express Module 8!');
