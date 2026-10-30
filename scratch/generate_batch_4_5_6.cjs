// Generator for Topics 4, 5, 6
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

// TOPIC 4: Async, Events & Concurrency (Q46–Q60)
q(46, 4, "4. Async, Events & Concurrency",
  "What is the EventEmitter class, and how does the Observer pattern work in Node.js?",
  "`EventEmitter` from the `node:events` module facilitates event-driven programming. Objects ('emitters') emit named events that trigger previously registered listener functions ('observers'). Core Node modules (`http.Server`, `fs.ReadStream`, `net.Socket`) inherit from `EventEmitter`.",
  "Memory Anchor: EventEmitter = Pub/Sub within the Node process. emit() fires listeners synchronously by default.",
  `import { EventEmitter } from 'node:events';

class OrderProcessor extends EventEmitter {
  placeOrder(order) {
    this.emit('orderPlaced', order);
  }
}

const processor = new OrderProcessor();
processor.on('orderPlaced', (order) => console.log('Send confirmation email for:', order.id));
processor.placeOrder({ id: 101, total: 2500 });`
);

q(47, 4, "4. Async, Events & Concurrency",
  "Are EventEmitter callbacks called synchronously or asynchronously?",
  "By default, `EventEmitter` invokes all registered listeners **synchronously** in the exact order they were registered when `emit()` is called! If you need listener execution to be asynchronous, you must wrap the logic inside `setImmediate()` or `process.nextTick()` inside the listener.",
  "Memory Anchor: emit() calls listeners synchronously in registration order, NOT on the event loop!",
  `const emitter = new EventEmitter();
emitter.on('event', () => console.log('1. First listener'));
emitter.on('event', () => console.log('2. Second listener'));

console.log('Before emit');
emitter.emit('event');
console.log('After emit');

// Output order: Before emit -> 1. First listener -> 2. Second listener -> After emit`
);

q(48, 4, "4. Async, Events & Concurrency",
  "What happens if an EventEmitter emits an 'error' event and has no listeners?",
  "If an `EventEmitter` emits `'error'` and there are zero registered `'error'` listeners, Node.js treats it as an uncaught exception! It prints the stack trace and crashes the entire Node.js process. Always attach an `.on('error', ...)` handler to any EventEmitter.",
  "Memory Anchor: Emitting an unhandled 'error' event crashes the entire process. Always attach an error listener."
);

q(49, 4, "4. Async, Events & Concurrency",
  "What is the default max listeners limit on an EventEmitter, and why does Node warn you?",
  "The default limit is 10 listeners per event. If you register more than 10, Node outputs a console warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`.\nThis warning exists because repeatedly adding listeners (e.g. inside a per-request middleware without removing them) is the single most common cause of memory leaks in Node.js. You can adjust it via `emitter.setMaxListeners(n)` if intentional.",
  "Memory Anchor: Default 10 listeners. Warning exists to detect forgotten listeners leaking memory."
);

q(50, 4, "4. Async, Events & Concurrency",
  "How does events.once() work with async/await in modern Node.js?",
  "`events.once(emitter, eventName)` returns a Promise that resolves when the emitter emits the given event (or rejects if an `'error'` event is emitted). This allows clean async/await event synchronization without manual callback boilerplate.",
  "Memory Anchor: await events.once(stream, 'finish') converts an event to a clean Promise.",
  `import { once, EventEmitter } from 'node:events';

async function waitForServerReady(server) {
  await once(server, 'listening');
  console.log('Server is ready to accept traffic!');
}`
);

q(51, 4, "4. Async, Events & Concurrency",
  "What is the error-first callback pattern in Node.js, and why was it standard?",
  "The error-first callback pattern dictates that:\n1) The first argument of the callback is reserved for an error object (`err`), which is `null`/`undefined` on success.\n2) Subsequent arguments contain the successful result data.\nThis convention standardized error checking across the ecosystem before Promises existed.",
  "Memory Anchor: callback(err, data) -> always check if (err) first before accessing data.",
  `fs.readFile('data.json', (err, data) => {
  if (err) {
    console.error('File read failed:', err);
    return;
  }
  console.log('File content:', data.toString());
});`
);

q(52, 4, "4. Async, Events & Concurrency",
  "What is util.promisify() and how does it work under the hood?",
  "`util.promisify(fn)` converts an error-first callback function into a function that returns a Promise. Under the hood, it returns a wrapper function that wraps the original function in a `new Promise((resolve, reject) => ...)` and passes a custom callback that resolves on `!err` and rejects on `err`.",
  "Memory Anchor: util.promisify turns callback(err, res) functions into async Promise functions.",
  `import { promisify } from 'node:util';
import fs from 'node:fs';

const readFileAsync = promisify(fs.readFile);
const content = await readFileAsync('config.json', 'utf8');`
);

q(53, 4, "4. Async, Events & Concurrency",
  "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
  "All 4 execute multiple promises concurrently:\n- `Promise.all`: Fails fast if ANY promise rejects; resolves only when ALL succeed.\n- `Promise.allSettled`: Waits for ALL promises to complete (whether fulfilled or rejected) and returns an array of status objects `{ status, value | reason }`.\n- `Promise.race`: Resolves or rejects as soon as the FIRST promise settles.\n- `Promise.any`: Resolves as soon as the FIRST promise FULFILLS (ignores rejections until all fail).",
  "Memory Anchor: all = all or nothing; allSettled = wait for all, never fails; race = fastest to finish; any = fastest to succeed.",
  null,
  null,
  [
    { aspect: "Promise.all", detail: "Short-circuits on first rejection; ideal when all operations are required." },
    { aspect: "Promise.allSettled", detail: "Never short-circuits; returns array of results for batch tasks." },
    { aspect: "Promise.race", detail: "Settles on first settled (resolve OR reject); good for timeouts." },
    { aspect: "Promise.any", detail: "Resolves on first success; rejects only if all fail." }
  ]
);

q(54, 4, "4. Async, Events & Concurrency",
  "How do you implement a robust timeout wrapper for an async operation in Node.js?",
  "Combine `Promise.race()` with a timeout promise that rejects after specified milliseconds, or in modern Node.js use `AbortSignal.timeout(ms)` with native `fetch` or supported APIs.",
  "Memory Anchor: Promise.race([action(), timeoutPromise(ms)]) OR AbortSignal.timeout(ms).",
  `function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(\`Operation timed out after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}`
);

q(55, 4, "4. Async, Events & Concurrency",
  "What is the difference between synchronous fs methods (fs.readFileSync) and asynchronous (fs.promises.readFile)?",
  "`fs.readFileSync` blocks the JavaScript main execution thread until the operating system finishes reading the bytes from disk into memory. Zero HTTP requests can be served while it runs.\n`fs.promises.readFile` offloads the file I/O to Libuv's thread pool, freeing the main JS thread to continue serving incoming network requests immediately.",
  "Memory Anchor: Sync fs methods freeze the entire server. Never use Sync methods in HTTP request handlers!"
);

q(56, 4, "4. Async, Events & Concurrency",
  "What are AsyncLocalStorage and AsyncLocalStorage.run() in Node.js?",
  "`AsyncLocalStorage` (from `node:async_hooks`) provides execution-context storage that persists across asynchronous call chains (similar to thread-local storage in multi-threaded languages). It is the standard senior pattern for attaching request IDs, tenant IDs, or correlation tracing IDs to logs without manually passing them through every service function argument.",
  "Memory Anchor: AsyncLocalStorage = Thread-local storage for Node async chains. Ideal for Correlation IDs in logging.",
  `import { AsyncLocalStorage } from 'node:async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();

// Express middleware:
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  asyncLocalStorage.run({ requestId }, () => next());
});

// Deep inside any service without passing req:
function logInfo(message) {
  const store = asyncLocalStorage.getStore();
  console.log(\`[\${store?.requestId || 'N/A'}] \${message}\`);
}`
);

q(57, 4, "4. Async, Events & Concurrency",
  "How can an unhandled rejected Promise crash a modern Node.js application?",
  "In Node.js 15+, the default unhandled rejection mode is `--unhandled-rejections=throw`. An unhandled promise rejection triggers an uncaught exception that terminates the process with code 1. You must always wrap async routes in try/catch or use an async error boundary middleware.",
  "Memory Anchor: Unhandled promise rejections terminate the process in modern Node. Always handle errors."
);

q(58, 4, "4. Async, Events & Concurrency",
  "What is the difference between AbortController and manual cancellation in Node.js?",
  "`AbortController` is the standard web-interoperable API for cancelling asynchronous operations. Calling `controller.abort()` sends an abort signal to all connected operations (`fetch`, `fs.promises.readFile`, child processes, timers) that accept `{ signal }`, immediately aborting active HTTP sockets and freeing resources.",
  "Memory Anchor: AbortController + signal enables standardized cancellation of fetch, timers, and fs operations.",
  `const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 3000);

try {
  const response = await fetch('https://api.external.com/data', { signal: controller.signal });
} catch (err) {
  if (err.name === 'AbortError') console.log('Request was cancelled due to timeout!');
} finally {
  clearTimeout(timeoutId);
}`
);

q(59, 4, "4. Async, Events & Concurrency",
  "How does queueMicrotask() work in Node.js?",
  "`queueMicrotask(callback)` schedules a microtask on the V8 microtask queue (same queue as Promise.then). It executes after the current synchronous script completes and before control yields to the event loop. In modern Node, it is preferred over `Promise.resolve().then(cb)` for standards-compliant microtask scheduling.",
  "Memory Anchor: queueMicrotask(cb) = Standards-based Promise-level microtask scheduling."
);

q(60, 4, "4. Async, Events & Concurrency",
  "How do you handle concurrency limits for parallel async operations (e.g. processing 10,000 items without overwhelming the DB)?",
  "Running `Promise.all(items.map(fn))` on 10,000 items creates 10,000 simultaneous database queries, crashing connection pools. Use a concurrency pool limiter (such as `p-limit` or a worker pool chunking pattern) to restrict concurrency to a safe maximum (e.g. 10 or 20 concurrent operations at any time).",
  "Memory Anchor: Never Promise.all 10,000 items at once! Use p-limit to throttle concurrency.",
  `import pLimit from 'p-limit';
const limit = pLimit(10); // Maximum 10 concurrent requests

const results = await Promise.all(
  urls.map(url => limit(() => fetch(url)))
);`
);

// TOPIC 5: Express Architecture & Middleware (Q61–Q80)
q(61, 5, "5. Express Architecture & Middleware",
  "What is Express.js and what is its core design pattern?",
  "Express.js is a minimalist, unopinionated web framework for Node.js. Its core design pattern is the **Chain of Responsibility (Middleware Pipeline)**. Every incoming HTTP request flows sequentially through an array of middleware functions that inspect, modify, authenticate, or respond to the request before calling `next()` to pass control forward.",
  "Memory Anchor: Express = Chain of Responsibility pipeline where request/response pass through sequential middleware functions.",
  `const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // Passes control to the next middleware in the chain
});`
);

q(62, 5, "5. Express Architecture & Middleware",
  "What is an Express middleware function, and what are its parameters?",
  "A middleware function is a function that has access to the Request object (`req`), the Response object (`res`), and the `next` function in the application’s request-response cycle: `function(req, res, next)`. Middleware can execute code, modify `req`/`res`, end the request-response cycle, or call `next()` to invoke the next middleware.",
  "Memory Anchor: (req, res, next) -> Must either call next() OR send a response (res.json())."
);

q(63, 5, "5. Express Architecture & Middleware",
  "What happens if a middleware function neither calls next() nor sends a response?",
  "The request hangs indefinitely! The client waits until its connection times out (or the server's HTTP socket timeout elapses, default 2 minutes). Always ensure your middleware either invokes `next()` or calls a response method like `res.json()`, `res.send()`, or `res.end()`.",
  "Memory Anchor: If you don't call next() or res.send(), the client hangs forever."
);

q(64, 5, "5. Express Architecture & Middleware",
  "What are the 5 types of middleware in Express.js?",
  "1) Application-level middleware (`app.use(fn)`)\n2) Router-level middleware (`router.use(fn)`)\n3) Error-handling middleware (`(err, req, res, next) => {}`)\n4) Built-in middleware (`express.json()`, `express.static()`, `express.urlencoded()`)\n5) Third-party middleware (`helmet()`, `cors()`, `compression()`, `morgan()`).",
  "Memory Anchor: App-level, Router-level, Error-handling, Built-in, Third-party."
);

q(65, 5, "5. Express Architecture & Middleware",
  "How does Express recognize an Error-Handling Middleware, and why must it have 4 arguments?",
  "Express uses function arity (`fn.length === 4`) to distinguish error-handling middleware from normal middleware. An error-handling middleware MUST declare exactly 4 arguments: `(err, req, res, next)`. If you remove `next`, `fn.length` becomes 3, and Express treats it as normal middleware, failing to catch errors!",
  "Memory Anchor: Express checks fn.length === 4. Must always write (err, req, res, next) even if next is unused!",
  `app.use((err, req, res, next) => {
  logger.error('Unhandled API Error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});`
);

q(66, 5, "5. Express Architecture & Middleware",
  "Why do unhandled asynchronous errors crash Express 4, and how is it fixed in Express 5?",
  "In Express 4, route handlers don't catch rejected Promises automatically. An unhandled rejection in an `async (req, res)` handler bypasses Express's error pipeline and crashes the process unless wrapped in a `try/catch` or an async wrapper utility (`express-async-errors`).\nIn Express 5, route handlers natively handle returned Promises: if an async handler throws or rejects, Express automatically catches it and passes it to the 4-parameter error middleware.",
  "Memory Anchor: Express 4 requires try/catch or async wrapper. Express 5 natively catches rejected async Promises.",
  `// Express 4 Async Wrapper Helper:
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));`
);

q(67, 5, "5. Express Architecture & Middleware",
  "What is the difference between app.use() and app.all()?",
  "- `app.use('/prefix', fn)`: Matches any HTTP method (GET, POST, PUT, DELETE) whose path **begins with** the specified prefix (`/prefix/subpath` matches).\n- `app.all('/exact', fn)`: Matches any HTTP method, but requires an **exact path match** (does not match subpaths unless wildcards are defined).",
  "Memory Anchor: app.use is prefix-matching middleware. app.all is exact-path route matching for all HTTP verbs."
);

q(68, 5, "5. Express Architecture & Middleware",
  "What is express.Router and why is it used?",
  "`express.Router()` creates an isolated, modular instance of middleware and routing. It acts like a 'mini-application' capable only of performing middleware and routing functions. Routers enable feature-driven folder structures (`routes/authRoutes.js`, `routes/productRoutes.js`) mounted cleanly onto the main app.",
  "Memory Anchor: express.Router = Mini-app for modularizing routes into separate feature files.",
  `// routes/userRoutes.js
const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
module.exports = router;

// server.js
app.use('/api/v1/users', userRoutes);`
);

q(69, 5, "5. Express Architecture & Middleware",
  "What does express.json() do under the hood?",
  "It is built-in middleware based on `body-parser`. It intercepts incoming requests with `Content-Type: application/json`, streams the raw binary Buffer chunks from `req`, concatenates them, parses the JSON string via `JSON.parse()`, and populates `req.body` with the resulting JavaScript object.",
  "Memory Anchor: express.json() streams the body chunks, calls JSON.parse(), and assigns the object to req.body."
);

q(70, 5, "5. Express Architecture & Middleware",
  "Why does Stripe or Razorpay webhook verification break when placed after express.json()?",
  "Payment webhooks require the **original, raw, unparsed binary Buffer** of the request body to cryptographically compute and verify the HMAC SHA-256 signature against the provider's signature header.\nIf `express.json()` runs first, it parses and alters the payload stream, making it impossible to reconstruct the exact byte sequence, causing signature verification to fail with `Webhook Error: Signature verification failed`.\nFix: Mount the webhook endpoint before `express.json()` using `express.raw({ type: 'application/json' })`.",
  "Memory Anchor: Webhooks need RAW binary bytes. Mount webhook route BEFORE express.json() using express.raw()!",
  `// Mount Stripe webhook with raw body before global express.json:
app.post('/api/webhook/stripe', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);

// Global JSON parsing for all other routes:
app.use(express.json());`
);

q(71, 5, "5. Express Architecture & Middleware",
  "What is the difference between req.params, req.query, and req.body?",
  "- `req.params`: Captures dynamic route tokens in the URL path (e.g. `/users/:userId` -> `{ userId: '123' }`).\n- `req.query`: Captures URL query string parameters after the `?` (e.g. `/search?q=phone&sort=asc` -> `{ q: 'phone', sort: 'asc' }`).\n- `req.body`: Contains parsed request payload data sent in POST/PUT/PATCH HTTP bodies (populated by `express.json()` or `multer`).",
  "Memory Anchor: params = path tokens /:id; query = ?key=val; body = POST payload data."
);

q(72, 5, "5. Express Architecture & Middleware",
  "What is the difference between res.send(), res.json(), and res.end()?",
  "- `res.json(obj)`: Sets `Content-Type: application/json` and converts the object using `JSON.stringify()`.\n- `res.send(data)`: Polymorphic method that inspects data type; sends HTML/text if string, sets JSON if object, sets octet-stream if Buffer.\n- `res.end()`: Ends the response process immediately without sending any body payload or default Content-Type headers (used for HTTP 204 No Content).",
  "Memory Anchor: res.json for API responses, res.send for generic data, res.end for ending without body."
);

q(73, 5, "5. Express Architecture & Middleware",
  "How do you pass data between middleware in the same request cycle?",
  "Attach the data to the `req` object (or `res.locals`). For example, an authentication middleware verifies a JWT and attaches `req.user = decodedUser`. Downstream controller handlers can then read `req.user` directly.",
  "Memory Anchor: Attach shared data to req (e.g. req.user = decodedToken) to pass downstream."
);

q(74, 5, "5. Express Architecture & Middleware",
  "What is res.locals and when should you use it?",
  "`res.locals` is an object scoped to the lifetime of the current HTTP request. It is useful for exposing data to template engines (EJS, Pug) or passing computed request-scoped metadata across middleware without polluting `req` properties.",
  "Memory Anchor: res.locals = Scoped container for request-level view/response data."
);

q(75, 5, "5. Express Architecture & Middleware",
  "Why is the order of middleware declaration critically important in Express?",
  "Express executes middleware in the exact lexical order they are declared using `app.use()`. If a router is defined before `express.json()`, `req.body` will be `undefined`. If error-handling middleware is placed before routes, it will never intercept errors thrown in those routes.",
  "Memory Anchor: Top-to-bottom pipeline: 1) Security (Helmet, CORS) -> 2) Body Parsers -> 3) Routes -> 4) 404 Catch-all -> 5) Error Handler."
);

q(76, 5, "5. Express Architecture & Middleware",
  "How do you implement a 404 Not Found handler in Express?",
  "Place a middleware at the very end of your middleware stack, immediately before the global error handler. If no route handler matched the incoming URL, execution falls through to this handler.",
  "Memory Anchor: 404 middleware goes after all routes, right before the global error handler.",
  `// Catch-all 404 middleware:
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: \`Route not found: \${req.method} \${req.originalUrl}\`
  });
});`
);

q(77, 5, "5. Express Architecture & Middleware",
  "What is next('route') in Express?",
  "`next('route')` bypasses the remaining middleware callbacks in the current route block and passes control to the **next matching route** for the same URL path. It only works inside route handlers loaded via `app.METHOD()` or `router.METHOD()`.",
  "Memory Anchor: next('route') skips remaining middleware in current route block and jumps to next route definition."
);

q(78, 5, "5. Express Architecture & Middleware",
  "How do you prevent response headers sent errors (ERR_HTTP_HEADERS_SENT)?",
  "This error occurs when your code attempts to send response headers or call `res.json()` / `res.send()` more than once for a single request (e.g. forgetting a `return` after `res.status(400).json()`, or calling `next()` after sending a response).\nFix: Always write `return res.status(...).json(...)` to exit the function immediately.",
  "Memory Anchor: Always return res.json() to prevent code from executing further and sending headers twice!"
);

q(79, 5, "5. Express Architecture & Middleware",
  "How do you configure Express behind a reverse proxy (Nginx, AWS ALB, Cloudflare)?",
  "Call `app.set('trust proxy', 1)` (or `true`). This informs Express that it is behind a trusted reverse proxy, allowing `req.ip` to accurately reflect the client's public IP from the `X-Forwarded-For` header and `req.protocol` to reflect `https` from `X-Forwarded-Proto`.",
  "Memory Anchor: app.set('trust proxy', 1) reads client IP from X-Forwarded-For behind Nginx/Cloudflare."
);

q(80, 5, "5. Express Architecture & Middleware",
  "How do you implement a clean Controller-Service-Repository architecture in Express?",
  "Separate concerns into distinct architectural layers:\n1) **Router**: Defines endpoints and attaches middleware.\n2) **Controller**: Handles HTTP concerns (extracts `req.body`, validates input, sends `res.json()`).\n3) **Service**: Pure business logic (calculates discounts, coordinates transactions, calls third-party APIs); zero knowledge of `req` or `res`.\n4) **Repository / Model**: Database data access (queries, ORM models).",
  "Memory Anchor: Router (HTTP routes) -> Controller (HTTP request/response) -> Service (Business logic) -> Repository (Database queries)."
);

// TOPIC 6: REST API Design & HTTP (Q81–Q100)
q(81, 6, "6. REST API Design & HTTP",
  "What are the 6 guiding constraints of REST architectural style?",
  "1) **Client-Server**: Separation of UI concerns from data storage concerns.\n2) **Stateless**: Each request from client must contain all necessary information; server stores no client session context.\n3) **Cacheable**: Responses must define themselves as cacheable or non-cacheable.\n4) **Uniform Interface**: Resource identification in requests (URIs), resource manipulation through representations, self-descriptive messages, HATEOAS.\n5) **Layered System**: Client cannot tell whether it is connected directly to end server or an intermediary (proxy, gateway).\n6) **Code on Demand (Optional)**: Server can temporarily extend client functionality by transferring executable code.",
  "Memory Anchor: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code-on-demand."
);

q(82, 6, "6. REST API Design & HTTP",
  "What is Idempotency in HTTP, and which HTTP methods are idempotent?",
  "An HTTP method is **idempotent** if making multiple identical requests has the exact same outcome on server state as making a single request.\n- **Idempotent**: `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`.\n- **Non-Idempotent**: `POST` (calling POST 5 times creates 5 resources), `PATCH` (can be non-idempotent if performing relative operations like `{ $inc: { views: 1 } }`).",
  "Memory Anchor: Idempotent = 1 request or 10 requests result in the same server state. GET, PUT, DELETE are idempotent. POST is not.",
  null,
  null,
  [
    { aspect: "GET", detail: "Safe & Idempotent (reads data only)." },
    { aspect: "PUT", detail: "Idempotent (replaces entire resource state)." },
    { aspect: "DELETE", detail: "Idempotent (resource deleted once is gone in subsequent requests)." },
    { aspect: "POST", detail: "Non-idempotent (creates new duplicate resources on repeat)." }
  ]
);

q(83, 6, "6. REST API Design & HTTP",
  "What is the semantic difference between PUT and PATCH in REST APIs?",
  "- `PUT`: Replaces the **entire resource**. If an existing field is omitted in a PUT payload, it should be wiped or reset to null/default.\n- `PATCH`: Applies a **partial update** to the resource. Only fields supplied in the payload are updated; omitted fields retain their existing values.",
  "Memory Anchor: PUT = Full replacement. PATCH = Partial patch update."
);

q(84, 6, "6. REST API Design & HTTP",
  "Explain the standard HTTP status code families (2xx, 3xx, 4xx, 5xx).",
  "- `2xx (Success)`: 200 OK, 201 Created (resource created), 204 No Content (successful delete with empty body).\n- `3xx (Redirection)`: 301 Moved Permanently, 302 Found (temporary), 304 Not Modified (cached).\n- `4xx (Client Errors)`: 400 Bad Request, 401 Unauthorized (unauthenticated), 403 Forbidden (authenticated but lacks role/permission), 404 Not Found, 409 Conflict (duplicate record), 422 Unprocessable Entity (validation error), 429 Too Many Requests.\n- `5xx (Server Errors)`: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.",
  "Memory Anchor: 2xx = Success, 3xx = Redirection, 4xx = Client fault, 5xx = Server fault."
);

q(85, 6, "6. REST API Design & HTTP",
  "What is the difference between 401 Unauthorized and 403 Forbidden?",
  "- `401 Unauthorized`: Actually means **Unauthenticated**. The client has not supplied valid credentials (missing or expired JWT/session). The user identity is unknown.\n- `403 Forbidden`: The client IS authenticated, but their identity or role **does not possess permission** to access the resource (e.g. regular user attempting to delete an admin account). Supplying the same token again will not help.",
  "Memory Anchor: 401 = 'Who are you?' (Not logged in). 403 = 'I know who you are, but you cannot touch this!' (No permission)."
);

q(86, 6, "6. REST API Design & HTTP",
  "When should you return 204 No Content vs 200 OK?",
  "Return `204 No Content` when an operation succeeds but the response intentionally contains no body payload (common for `DELETE` operations or status updates where the client needs no returned data). Return `200 OK` when returning a response body (e.g. `{ success: true, deletedId: 42 }`).",
  "Memory Anchor: 204 = Successful operation with empty body. 200 = Successful operation with response body."
);

q(87, 6, "6. REST API Design & HTTP",
  "What is 409 Conflict and when is it appropriate?",
  "Return `409 Conflict` when a request cannot be completed due to a conflict with the current state of the resource. Examples: attempting to register an email address that already exists, or attempting to book an appointment slot that another user just booked.",
  "Memory Anchor: 409 Conflict = Unique constraint collision or state collision (e.g. email already exists, slot double-booked)."
);

q(88, 6, "6. REST API Design & HTTP",
  "What is Content Negotiation and how do Accept and Content-Type headers work?",
  "- `Content-Type`: Tells the recipient the media type of the payload being sent (e.g. `Content-Type: application/json` in request or response body).\n- `Accept`: Sent by the client in request headers to indicate which response formats it can understand (`Accept: application/json, text/csv`).\nIn Express, `req.accepts('json')` inspects the Accept header for content negotiation.",
  "Memory Anchor: Content-Type = what I am sending. Accept = what I want back."
);

q(89, 6, "6. REST API Design & HTTP",
  "How should REST API endpoints be named? Explain plural nouns and resource hierarchies.",
  "1) Use **plural nouns** for resource collections (`/api/v1/products`, NOT `/getProduct`).\n2) Use HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) for actions instead of verbs in the URL (avoid `/api/delete-user`).\n3) Express resource hierarchies via subpaths: `/api/v1/users/:userId/orders/:orderId`.\n4) Use query parameters for filtering, sorting, and pagination: `/api/v1/products?category=shoes&sort=-price&page=2`.",
  "Memory Anchor: Plural nouns + HTTP verbs. GET /users, POST /users, GET /users/:id, DELETE /users/:id."
);

q(90, 6, "6. REST API Design & HTTP",
  "What is an Idempotency Key and how do payment APIs use it to prevent double charges?",
  "An Idempotency Key is a unique UUID generated by the client (e.g. frontend checkout button) and passed in an HTTP header (`Idempotency-Key: <UUID>`).\nThe server checks Redis: if the key exists, it returns the cached result without re-executing the payment. If the key is new, it acquires a distributed lock, processes the charge, saves the result to Redis, and unlocks. This prevents duplicate charges if network drops cause automatic retries.",
  "Memory Anchor: Idempotency Key = Client UUID in header. Server caches response in Redis to prevent charging twice on network retries.",
  `app.post('/api/charge', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return res.status(400).json({ error: 'Missing Idempotency-Key header' });

  const cached = await redis.get(\`idempotency:\${idempotencyKey}\`);
  if (cached) return res.status(200).json(JSON.parse(cached));

  const chargeResult = await paymentService.charge(req.body);
  await redis.set(\`idempotency:\${idempotencyKey}\`, JSON.stringify(chargeResult), 'EX', 86400);
  res.status(201).json(chargeResult);
});`
);

q(91, 6, "6. REST API Design & HTTP",
  "What is the difference between Offset-based and Cursor-based Pagination?",
  "- **Offset Pagination** (`?page=2&limit=20` or `LIMIT 20 OFFSET 20`): Simple to implement, supports jumping to arbitrary page numbers. Drawback: Slow on large tables (O(N) row scanning in DB), and vulnerable to 'page drift' when items are inserted/deleted.\n- **Cursor Pagination** (`?limit=20&cursor=prod_abc123` or `WHERE id > cursor LIMIT 20`): Uses indexed unique column. Constant O(1) performance at any depth, immune to insertion page drift. Ideal for infinite scrolls (Twitter/Instagram feeds).",
  "Memory Anchor: Offset = simple but slow at depth & suffers page drift. Cursor = fast indexed pointer, ideal for infinite scroll.",
  null,
  null,
  [
    { aspect: "Offset-based", detail: "LIMIT / OFFSET. Easy jump to page 10. Degrades on large datasets; row shifts cause duplicate/missing items." },
    { aspect: "Cursor-based", detail: "WHERE id > cursor LIMIT 20. Constant O(1) performance using indexed keys; no row shift." }
  ]
);

q(92, 6, "6. REST API Design & HTTP",
  "What are HTTP ETag and 304 Not Modified status codes?",
  "An `ETag` (Entity Tag) is an HTTP response header containing a hash or fingerprint of the resource representation. On subsequent requests, the client sends `If-None-Match: <ETag>`. If the resource hasn't changed, the server responds with `304 Not Modified` and an empty body, saving network bandwidth.",
  "Memory Anchor: ETag = Hash of response body. 304 Not Modified tells browser to use local cached copy."
);

q(93, 6, "6. REST API Design & HTTP",
  "How should you structure API Versioning in Node.js?",
  "Common strategies:\n1) **URI Path Versioning (Recommended)**: `/api/v1/orders` vs `/api/v2/orders`. Highly explicit, easily cached and routed via reverse proxies.\n2) **Header Versioning**: `Accept: application/vnd.company.v1+json` or `X-API-Version: 1`.\n3) **Query Parameter**: `/api/orders?version=1` (generally discouraged).\nURI path versioning is the industry standard for public APIs.",
  "Memory Anchor: URI versioning (/api/v1/resource) is clear, explicit, and easy to route in proxies."
);

q(94, 6, "6. REST API Design & HTTP",
  "What is HATEOAS in REST API design?",
  "HATEOAS (Hypermedia As The Engine Of Application State) is the highest maturity level of REST (Richardson Maturity Model Level 3). The server includes hypermedia links (`_links`) in responses guiding the client on valid state transitions and related actions (e.g. an order response includes links to cancel, pay, or track).",
  "Memory Anchor: HATEOAS = Server returns links (_links) in JSON telling the client what actions can be taken next."
);

q(95, 6, "6. REST API Design & HTTP",
  "What is the difference between HTTP/1.1 and HTTP/2?",
  "- **HTTP/1.1**: Text-based protocol. Suffers from Head-of-Line (HoL) blocking on TCP connections; browsers open 6 simultaneous TCP connections per domain.\n- **HTTP/2**: Binary protocol. Introduces **multiplexing** (multiple concurrent requests and responses over a single TCP connection), header compression (HPACK), and server push. Supported in Node via the `node:http2` module.",
  "Memory Anchor: HTTP/1.1 = Text, 6 TCP connections, HoL blocking. HTTP/2 = Binary, multiplexed single TCP connection, HPACK compression."
);

q(96, 6, "6. REST API Design & HTTP",
  "How do you design a standardized JSON error response schema?",
  "Never return inconsistent error formats (e.g. string on one route, object on another). Use a standardized envelope like RFC 7807 (Problem Details for HTTP APIs):\n`{ success: false, error: { code: 'INVALID_INPUT', message: 'Validation failed', details: [...] } }`.",
  "Memory Anchor: Standardize error envelopes across all routes: success: false, error: { code, message, details }.",
  `res.status(422).json({
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'The submitted form payload contains validation errors.',
    details: [
      { field: 'email', message: 'Must be a valid email format' },
      { field: 'password', message: 'Must be at least 8 characters' }
    ]
  }
});`
);

q(97, 6, "6. REST API Design & HTTP",
  "What is HTTP Keep-Alive and why is it important?",
  "HTTP Keep-Alive allows a single persistent TCP connection to remain open for multiple HTTP request-response cycles, avoiding the expensive 3-way TCP handshake and TLS negotiation overhead for every single asset or request. Node's `http.Agent` handles connection pooling and keep-alive.",
  "Memory Anchor: Keep-Alive reuses existing TCP connections to avoid repeating TCP/TLS handshakes."
);

q(98, 6, "6. REST API Design & HTTP",
  "What are preflight OPTIONS requests in HTTP?",
  "When a cross-origin request is 'non-simple' (uses methods other than GET/POST/HEAD, or custom headers like `Authorization`), the browser automatically sends an HTTP `OPTIONS` request first. It asks the server: 'Do you allow this origin, method, and headers?' Only after the server responds with matching `Access-Control-Allow-*` headers does the browser send the real request.",
  "Memory Anchor: Browser sends OPTIONS preflight before PUT/DELETE/Auth headers to verify permissions."
);

q(99, 6, "6. REST API Design & HTTP",
  "What is 422 Unprocessable Entity vs 400 Bad Request?",
  "- `400 Bad Request`: The request syntax is malformed (e.g. invalid JSON syntax that cannot be parsed).\n- `422 Unprocessable Entity`: The JSON syntax is valid, but the business/domain data inside fails validation rules (e.g. age is negative, password too short).",
  "Memory Anchor: 400 = Malformed syntax (broken JSON). 422 = Valid syntax, but invalid schema/business values."
);

q(100, 6, "6. REST API Design & HTTP",
  "How do you handle bulk creation or updates in REST APIs?",
  "Expose dedicated batch endpoints like `POST /api/v1/orders/bulk`. Accept an array of entities, execute operations inside a single database transaction, and return individual statuses per item (or fail entirely if atomic all-or-nothing semantics are required).",
  "Memory Anchor: Use /resource/bulk with database transactions for bulk operations."
);

fs.writeFileSync(path.resolve(__dirname, 'batch_4_5_6.json'), JSON.stringify(batch, null, 2));
console.log('Batch 4, 5, 6 generated! Questions count:', batch.length);
