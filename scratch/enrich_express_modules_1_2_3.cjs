const fs = require('fs');
const path = require('path');

const batch1 = require('./node_notes_parts_1_to_8.json');

// ========================================================
// EXPRESS.JS: MODULE 1, MODULE 2, MODULE 3 (Part 6)
// ========================================================

const expressPart6Sections = [
  {
    id: "6.1",
    title: "16. Express.js Fundamentals: Setup, Routing, HTTP Lifecycle & REST Conventions",
    content: `### 1. Topic Overview & Mental Model
Express.js is the de facto standard web framework for Node.js. It is described as a **minimalist, unopinionated routing and middleware web framework**.
- **Why Frameworks are Useful**: While raw Node.js provides the low-level \`http\` module, building a production server on raw Node requires manually writing regular expressions for URL routing, manually reading and concatenating chunked request stream buffers, setting \`Content-Type\` and \`Content-Length\` headers by hand, and writing hundreds of lines of boilerplate for error recovery.
- **Express vs Raw Node.js HTTP**: Express wraps Node's native \`http.IncomingMessage\` into \`req\` and \`http.ServerResponse\` into \`res\`, adding helper methods like \`res.json()\`, \`res.status()\`, \`req.params\`, and a composable **Chain of Responsibility** middleware engine.
- **Express vs NestJS**: Express is unopinionated—it gives you total freedom (and responsibility) over how you structure folders, controllers, and databases. NestJS is heavily opinionated—it wraps Express/Fastify in an Angular-inspired enterprise TypeScript architecture with Dependency Injection, Controllers, Providers, and Modules.
- **Mental Model**: The Assembly Line Conveyor Belt.
  - The incoming HTTP request is placed on a conveyor belt.
  - As it moves, specialized workstations (Middleware) inspect the box, verify the shipping label (Authentication), check the contents (Validation), log tracking info, and route it to the right department (Route Handler).

### 2. The Core Building Blocks of an Express Application
1. **Application Instance**:
   - Created via \`const app = express();\`. Acts as the central registry for routing tables, middleware stacks, and application settings.
2. **Server Startup**:
   - \`const server = app.listen(port, callback);\`: Under the hood, \`app.listen()\` simply creates a native Node HTTP server: \`http.createServer(app).listen(port)\`.
3. **HTTP Methods & Routing**:
   - Supports all HTTP verbs: \`app.get()\`, \`app.post()\`, \`app.put()\`, \`app.patch()\`, \`app.delete()\`, \`app.options()\`, \`app.all()\`.
4. **Request Data Extraction**:
   - **Route Parameters (\`req.params\`)**: Named URL segments: \`app.get('/users/:userId/orders/:orderId')\` $\\to$ \`req.params.userId\`.
   - **Query Parameters (\`req.query\`)**: URL search parameters: \`/products?category=electronics&sort=desc\` $\\to$ \`req.query.category\`.
   - **Request Body (\`req.body\`)**: Parsed JSON or URL-encoded payload (requires \`express.json()\` middleware!).
   - **Request Headers (\`req.headers\`, \`req.get('Authorization')\`)**.
5. **Response Methods & Status Codes**:
   - \`res.status(200).json(data)\`: Serializes object to JSON string and sets \`Content-Type: application/json; charset=utf-8\`.
   - \`res.status(204).send()\`: 204 No Content (typically used on \`DELETE\` or empty \`PUT\`).
   - \`res.status(201).json(resource)\`: 201 Created (used on successful \`POST\` creation).
   - \`res.set('X-Correlation-Id', id)\`: Sets custom HTTP response headers.

### 3. REST Conventions in Express
- \`GET /api/v1/orders\`: List orders (Paginated, filtered).
- \`POST /api/v1/orders\`: Create a new order (Returns 201 Created with resource).
- \`GET /api/v1/orders/:id\`: Retrieve specific order by ID (Returns 200 OK or 404 Not Found).
- \`PUT /api/v1/orders/:id\`: Full replacement of order resource (Idempotent).
- \`PATCH /api/v1/orders/:id\`: Partial update of specific fields (e.g. status update).
- \`DELETE /api/v1/orders/:id\`: Remove order resource (Returns 204 No Content).`,
    comparisonTable: [
      {
        aspect: "Feature",
        rawNode: "Raw Node.js http Module",
        express: "Express.js",
        nest: "NestJS"
      },
      {
        aspect: "Routing",
        rawNode: "Manual if/else statements on req.url",
        express: "Declarative router with param matching (:id)",
        nest: "Decorator-based routing (@Get('/users'))"
      },
      {
        aspect: "Body Parsing",
        rawNode: "Manual req.on('data') buffer concatenation",
        express: "Built-in express.json() middleware",
        nest: "Automatic DTO ValidationPipe with class-validator"
      },
      {
        aspect: "Architecture",
        rawNode: "Zero structure provided",
        express: "Unopinionated; developer designs architecture",
        nest: "Strict Modular Dependency Injection architecture"
      },
      {
        aspect: "Async Error Handling",
        rawNode: "Manual try/catch per listener",
        express: "Express 4: next(err) | Express 5: Automatic",
        nest: "Global Exception Filters (@Catch())"
      }
    ],
    code: `// Fundamental Express.js Server Setup & REST Route Handlers
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Built-in JSON Body Parser Middleware
app.use(express.json());

// In-memory data store for demonstration
let products = [
  { id: 'prod_1', name: 'Mechanical Keyboard', price: 120, stock: 15 }
];

// 2. REST Route Handlers
// GET /api/v1/products - Filtering via Query Parameters
app.get('/api/v1/products', (req, res) => {
  const maxPrice = Number(req.query.maxPrice);
  let results = products;
  
  if (!isNaN(maxPrice)) {
    results = results.filter(p => p.price <= maxPrice);
  }
  
  res.status(200).json({ success: true, count: results.length, data: results });
});

// GET /api/v1/products/:id - Route Parameters
app.get('/api/v1/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product Not Found' });
  }
  res.status(200).json({ success: true, data: product });
});

// POST /api/v1/products - Creating Resources (201 Created)
app.post('/api/v1/products', (req, res) => {
  const { name, price, stock } = req.body;
  
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ success: false, error: 'Name and numeric price are required' });
  }

  const newProduct = { id: \`prod_\${Date.now()}\`, name, price, stock: stock || 0 };
  products.push(newProduct);
  
  res.status(201).json({ success: true, data: newProduct });
});

// DELETE /api/v1/products/:id - 204 No Content
app.delete('/api/v1/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product Not Found' });
  }
  products.splice(index, 1);
  res.status(204).send(); // 204 No Content sends empty body
});

// 3. Server Startup
// const server = app.listen(PORT, () => console.log(\`Server listening on port \${PORT}\`));`,
    keyTakeaways: [
      "Express abstracts raw Node HTTP stream concatenation into convenient req and res helper objects.",
      "Always call app.use(express.json()) to parse incoming JSON bodies before route handlers.",
      "Route parameters (req.params) capture URL segments (:id); query parameters (req.query) capture filters (?sort=desc).",
      "Follow standard REST status codes: 200 for OK, 201 for Created, 204 for No Content, 400 for Bad Request, 404 for Not Found."
    ]
  },
  {
    id: "6.2",
    title: "17. The Middleware Pipeline, Execution Order, next() & Request Flow Diagram",
    content: `### 1. Topic Overview & Mental Model
Middleware functions are the fundamental building blocks of an Express application.
- A middleware function is a function that has access to the **Request object (\`req\`)**, the **Response object (\`res\`)**, and the **Next function (\`next\`)** in the application's request-response cycle.
- **The Chain of Responsibility Pattern**: Middleware functions execute in the exact order they are mounted using \`app.use()\`. Each function can either:
  1. Modify \`req\` or \`res\` and pass control to the next middleware by calling \`next()\`.
  2. Terminate the request by sending a response: \`res.status(200).json(...)\`.
  3. Pass an error down the pipeline by calling \`next(err)\`, bypassing all normal routes and jumping directly to the Error Handler.

### 2. Categories of Express Middleware
1. **Application-Level Middleware**: Mounted on \`app.use()\` and executes for all requests (e.g. CORS, Helmet, Body Parser, Global Logger).
2. **Router-Level Middleware**: Mounted on an \`express.Router()\` instance (e.g., prefixing \`/api/v1/admin\` with an admin auth guard).
3. **Built-in Middleware**: Included directly with Express: \`express.json()\`, \`express.urlencoded()\`, \`express.static()\`, \`express.raw()\`.
4. **Third-Party Middleware**: Installed via npm: \`cors\`, \`helmet\`, \`morgan\`, \`pino-http\`, \`express-rate-limit\`, \`multer\`.
5. **Error-Handling Middleware**: Defined with **exactly 4 arguments**: \`(err, req, res, next)\`. If you omit the \`next\` argument (even if unused), Express treats it as a standard 3-argument route handler and will NOT catch errors!

### 3. Differences Across Express Versions: Express 4 vs Express 5
- **Express 4 Async Error Hazard**: If an async route handler rejects or throws an error inside a Promise, Express 4 does NOT catch it! The request hangs until timeout unless wrapped in a manual \`try/catch\` or using the \`express-async-errors\` monkey-patch package:
  \`\`\`javascript
  // Express 4: Requires manual catch or next(err)
  app.get('/data', async (req, res, next) => {
    try {
      const data = await loadData();
      res.json(data);
    } catch (err) {
      next(err); // Mandatory in Express 4!
    }
  });
  \`\`\`
- **Express 5 Native Promise Support**: Express 5 automatically catches rejected promises in async route handlers and passes them directly to the 4-argument error-handling middleware without requiring any wrapper!

### 4. Common Middleware-Order Bugs
- **Bug 1: Placing Body Parser AFTER Routes**: Route handlers will receive \`req.body === undefined\`.
- **Bug 2: Placing Auth Middleware BEFORE CORS**: Preflight \`OPTIONS\` requests from browsers do NOT carry authorization headers and will be rejected with 401 Unauthorized before CORS headers can be attached!
- **Bug 3: Placing Error Handler BEFORE Routes**: The error handler will never be reached by routes defined after it. Always mount error handlers as the **very last** middleware in the application.

### 5. Full Request-Flow Architecture Sequence
\`\`\`
[ Incoming HTTP Request from Browser / Client ]
                    │
                    ▼
       ┌─────────────────────────┐
       │ 1. Helmet & CORS        │ <-- Attaches security & allowlist headers
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 2. Request Size & Parse │ <-- express.json({ limit: '10kb' })
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 3. Correlation Logger   │ <-- Injects req.id & logs incoming timestamp
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 4. Rate Limiter         │ <-- IP sliding window throttle check
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 5. Auth Verification    │ <-- Verifies JWT / Session; attaches req.user
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 6. Validation (Zod)     │ <-- Validates req.body against schema
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 7. Controller           │ <-- Extracts params/body; invokes service
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 8. Service Layer        │ <-- Executes business logic & validation rules
       └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │ 9. Repository / DB      │ <-- Queries database (Postgres, MySQL, Mongo)
       └─────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   [ Success ]              [ Error Occurs ]
        │                       │
        ▼                       ▼
┌──────────────┐        ┌─────────────────────────┐
│ res.json()   │        │ 10. Central Error Mid.  │ <-- 4-argument (err,req,res,next)
│ (200 / 201)  │        │     Normalizes error    │
└──────────────┘        │     Logs stack trace    │
                        │     Sends RFC 7807 JSON │
                        └─────────────────────────┘
\`\`\``,
    comparisonTable: [
      {
        aspect: "Middleware Type",
        signature: "(req, res, next) => ...",
        argumentsCount: "3 arguments",
        role: "Standard route or transform middleware"
      },
      {
        aspect: "Middleware Type",
        signature: "(err, req, res, next) => ...",
        argumentsCount: "4 arguments (Mandatory!)",
        role: "Global centralized error handling middleware"
      },
      {
        aspect: "Error Passing",
        signature: "next()",
        argumentsCount: "Passes control to next standard middleware",
        role: "Pipeline continuation"
      },
      {
        aspect: "Error Passing",
        signature: "next(new AppError('Forbidden', 403))",
        argumentsCount: "Skips all normal routes, jumps to error handler",
        role: "Error escalation"
      }
    ],
    code: `// Complete Middleware Pipeline with Validation, Auth, and Central Error Handler
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';

const app = express();

// 1. Security & CORS (First in chain)
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// 2. Request Body Parsing
app.use(express.json({ limit: '10kb' }));

// 3. Correlation ID & Logging Middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || \`req_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;
  res.setHeader('X-Request-Id', req.id);
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url} (ID: \${req.id})\`);
  next();
});

// 4. Custom AppError Class for Operational Errors
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational bugs from programmer bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

// 5. Generic Zod Validation Middleware Factory
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.errors.map(e => \`\${e.path.join('.')}: \${e.message}\`).join(', ');
    return next(new AppError(\`Validation Error: \${errorDetails}\`, 422));
  }
  req.validatedBody = result.data;
  next();
};

// 6. Centralized 4-Argument Error-Handling Middleware (Mounted LAST!)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  console.error(\`❌ Error on \${req.method} \${req.url} (ReqID: \${req.id}):\`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Internal Server Error',
      statusCode,
      requestId: req.id,
      timestamp: new Date().toISOString()
    }
  });
});`,
    keyTakeaways: [
      "Middleware executes in strict registration order; placing body parsers or CORS after routes causes subtle production failures.",
      "Always define error-handling middleware with exactly 4 arguments (err, req, res, next); omitting next breaks Express's reflection check.",
      "Calling next(err) with any truthy argument skips all standard middleware and invokes the central error handler.",
      "Express 4 requires wrapping async functions or calling next(err) on rejections; Express 5 natively catches async errors."
    ]
  },
  {
    id: "6.3",
    title: "18. Application Architecture: 4-Tier Layered Design, DTOs & Production CRUD Example",
    content: `### 1. Topic Overview & Mental Model
In small tutorials, developers place database queries, business rules, validation, and HTTP serialization all inside a single giant route callback. In production enterprise services, this results in **"Fat Controllers"**, duplicate database logic, un-testable code, and high maintenance costs.
- **The Solution**: The **4-Tier Layered Architecture**:
  1. **Routes**: Defines URL paths, HTTP verbs, and links middleware to controller methods.
  2. **Controllers**: Extracts parameters from \`req\`, coordinates service invocation, and formats the HTTP response (\`res.json\`). Contains ZERO SQL queries and ZERO business rules!
  3. **Services**: Pure business logic (e.g. calculating discounts, checking user credit, sending notification emails). Independent of Express—can be reused in a CLI tool or worker thread!
  4. **Repositories / Data Access**: Interacts directly with the database (SQL queries, Prisma, Mongoose models). Abstracting the database behind repository interfaces makes unit testing with mocks effortless.

### 2. DTOs (Data Transfer Objects) & Separation of Concerns
- **DTOs**: Explicit TypeScript contracts or Zod schemas defining the exact shape of data entering or leaving the API boundary.
- **Why Repository Abstractions Help**:
  - Allows swapping the database implementation (e.g. SQLite in unit tests, PostgreSQL in production).
  - Isolates ORM-specific quirks from the business logic.
- **When Repository Abstractions Add Unnecessary Complexity**:
  - In simple CRUD applications where the service would merely be a pass-through calling \`repository.find(id)\`, adding a separate repository layer introduces boilerplate with zero architectural benefit.`,
    comparisonTable: [
      {
        aspect: "Architectural Layer",
        layer: "Controller",
        responsibility: "HTTP protocol handling, params extraction, status codes",
        expressDependent: "YES (uses req and res)"
      },
      {
        aspect: "Architectural Layer",
        layer: "Service Layer",
        responsibility: "Business logic, calculations, domain rules",
        expressDependent: "NO (Pure JavaScript/TypeScript, fully testable)"
      },
      {
        aspect: "Architectural Layer",
        layer: "Repository Layer",
        responsibility: "SQL / NoSQL queries, data persistence, transactions",
        expressDependent: "NO (Database specific)"
      },
      {
        aspect: "Architectural Layer",
        layer: "DTO / Validation",
        responsibility: "API input/output contracts, runtime boundary validation",
        expressDependent: "NO (Schema-driven with Zod)"
      }
    ],
    code: `// Complete 4-Tier Production CRUD Implementation (Clean Architecture)

// ==========================================
// 1. REPOSITORY LAYER (Data Access)
// ==========================================
export class UserRepository {
  constructor(databaseClient) {
    this.db = databaseClient; // Injected DB client (e.g. pg Pool or Prisma)
    this.users = new Map();   // Simulated DB table
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async create(userData) {
    const user = { id: \`usr_\${Date.now()}\`, ...userData, createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }
}

// ==========================================
// 2. SERVICE LAYER (Pure Business Logic)
// ==========================================
export class UserService {
  constructor(userRepository) {
    this.userRepo = userRepository; // Dependency Injection!
  }

  async registerUser({ email, name, role }) {
    // Business Rule: Check for existing account
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      err.isOperational = true;
      throw err;
    }

    // Business Rule: Default role
    return await this.userRepo.create({ email, name, role: role || 'user' });
  }

  async getUserProfile(id) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const err = new Error('User does not exist');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    return user;
  }
}

// ==========================================
// 3. CONTROLLER LAYER (HTTP Coordination)
// ==========================================
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Bind to 'this' for Express route handlers
  register = async (req, res, next) => {
    try {
      const { email, name, role } = req.body;
      const user = await this.userService.registerUser({ email, name, role });
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const user = await this.userService.getUserProfile(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };
}`,
    keyTakeaways: [
      "Controllers handle HTTP concerns (status codes, params, json serialization); they should never execute SQL queries directly.",
      "Services contain pure business rules and must remain independent of Express req/res objects for clean unit testing.",
      "Repositories abstract data persistence; injecting repositories into services enables easy test mocking.",
      "Organize complex applications by feature (e.g. src/modules/users/) containing their own routes, controllers, services, and schemas."
    ]
  }
];

// Update batch 1 with updated Part 6
batch1[5] = {
  id: 6,
  title: "Part 6 — Express.js Core: Routing, Middleware Pipeline & 4-Tier Architecture",
  badge: "Express Framework",
  color: "#10b981",
  sections: expressPart6Sections
};

fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(batch1, null, 2));
console.log('Successfully updated Part 6 with Express Modules 1, 2, and 3!');
