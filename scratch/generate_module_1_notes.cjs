const fs = require('fs');
const path = require('path');

// Author complete, exhaustive notes for Module 1: Node.js Fundamentals
// Every section strictly follows the 9-part notes standard from AGENTS.md

const module1Sections = [
  {
    id: "1.1",
    title: "1. Node.js Architecture: Runtime vs Language, V8 Engine & Libuv Core",
    content: `### 1. Topic Overview & Mental Model
Node.js is **not a programming language**, nor is it a web framework. Node.js is an open-source, cross-platform **JavaScript runtime environment** that executes JavaScript code outside a web browser.
- **Why Node.js Exists**: Before 2009, JavaScript was trapped inside browser sandboxes. Backend servers ran Java, PHP, Ruby, or C++ using the **Thread-Per-Connection model** (e.g., Apache HTTP Server). When traffic surged to 10,000 concurrent connections (the famous **C10K problem**), threaded servers collapsed because 10,000 idle TCP connections required 10,000 OS threads (2MB memory each = 20GB RAM consumed solely for idle thread stacks).
- **The Core Innovation**: Ryan Dahl recognized that network servers spend 99% of their time waiting for disk and network I/O. By pairing Google Chrome's fast V8 JavaScript engine with an asynchronous, non-blocking C event loop library (Libuv), Node.js proved that a **single thread** could coordinate 100,000+ concurrent connections with low memory overhead.
- **Mental Model**: The Master Chef & Procurement Logistics.
  - The **Main Thread (V8)** is a single Master Chef. The chef takes orders, cuts ingredients, and plates dishes.
  - When an order requires catching a deep-sea fish (Disk or Network I/O), the chef does NOT leave the kitchen to go fishing (blocking). That would freeze the restaurant!
  - Instead, the chef gives an order ticket to the **Procurement Logistics Crew (Libuv & OS Kernel)** and immediately serves the next customer.
  - When the fish arrives, the crew rings a bell (**Event Loop Callback**), and the chef prepares the dish when the current task is done.

### 2. Fundamentals & Runtime vs Language
- **Programming Language (JavaScript / ECMAScript)**: A formal specification (ECMA-262) defining syntax, types, expressions, control flow, functions, prototypes, and lexical scoping. JavaScript itself has NO concept of files, network sockets, timers, or web requests.
- **Runtime Environment (Node.js)**: The host environment providing the execution context, global namespace, system bindings, and standard library that allows JavaScript to interact with the underlying operating system.

### 3. Internal Working & Engine Mechanics
Node.js is composed of two primary C/C++ engines wrapped by a JavaScript standard library:
1. **Google V8 Engine (C++)**:
   - **Ignition Interpreter**: Fast startup by compiling JavaScript source into compact bytecode.
   - **TurboFan JIT Compiler**: Dynamically optimizes hot bytecode into high-speed machine code based on runtime profile feedback.
   - **Memory Layout**:
     - **Call Stack**: LIFO execution context frames storing primitive local variables and function execution pointers.
     - **Heap Memory**: Dynamic memory pool storing objects, closures, strings, and buffers.
     - **Garbage Collection (GC)**: Generational GC separating short-lived objects (Scavenger nursery, semi-space copying) from long-lived objects (Mark-Sweep-Compact).
2. **Libuv (C)**:
   - A multi-platform asynchronous I/O library written specifically for Node.js.
   - Interfaces directly with OS non-blocking kernel multiplexers:
     - Linux: \`epoll\`
     - macOS / BSD: \`kqueue\`
     - Windows: \`IOCP\` (Input/Output Completion Ports)
   - Manages the **Event Loop**, timers, child processes, and a configurable background thread pool (\`UV_THREADPOOL_SIZE\`, default 4 threads) for synchronous operations (DNS lookups, \`fs\` file I/O, \`crypto\` hashing).
3. **Core C/C++ Bindings**:
   - **OpenSSL**: Cryptography, TLS/SSL, and cryptographic random bytes.
   - **llhttp**: Ultra-fast C HTTP request/response parser.
   - **zlib**: Compression and decompression (gzip, deflate, brotli).
   - **c-ares**: Asynchronous DNS query resolution.`,
    comparisonTable: [
      {
        aspect: "Concept",
        detail: "JavaScript (Language) vs Node.js (Runtime)"
      },
      {
        aspect: "Definition",
        detail: "ECMAScript specification defining language syntax vs Host platform executing that syntax on the OS"
      },
      {
        aspect: "Engine Core",
        detail: "Abstract syntax rules vs Google V8 (compilation & memory) + Libuv (event loop & asynchronous I/O)"
      },
      {
        aspect: "Capabilities",
        detail: "Arrays, Objects, Functions, Math vs File system (fs), TCP/HTTP sockets (net/http), Process management, Crypto"
      },
      {
        aspect: "Standardization",
        detail: "TC39 Committee standards vs OpenJS Foundation & Node.js Technical Steering Committee (TSC)"
      }
    ],
    code: `// Inspecting Node.js Process, V8 Engine, and Libuv Architecture
import process from 'node:process';
import os from 'node:os';

console.log('=== Node.js Runtime Architecture Diagnostics ===');
console.log({
  nodeVersion: process.version,
  v8Version: process.versions.v8,
  libuvVersion: process.versions.uv,
  openSSLVersion: process.versions.openssl,
  zlibVersion: process.versions.zlib,
  platform: process.platform,
  arch: process.arch,
  pid: process.pid,
  uptimeSeconds: Math.round(process.uptime()),
  cpuCores: os.cpus().length,
  // Inspecting memory heap allocation in V8
  memoryUsageMB: {
    rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB',
    heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB',
    heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
    external: (process.memoryUsage().external / 1024 / 1024).toFixed(2) + ' MB'
  }
});`,
    keyTakeaways: [
      "Node.js is an open-source C++ runtime environment combining Google V8 with Libuv, not a programming language.",
      "V8 compiles JavaScript into machine code single-threadedly; Libuv provides asynchronous I/O via OS kernel multiplexing (epoll/kqueue/IOCP).",
      "Traditional threaded web servers allocated 2MB RAM per connection; Node's single-threaded event loop handles tens of thousands of idle connections with minimal memory.",
      "Libuv maintains a default thread pool of 4 worker threads for operations that operating systems cannot perform non-blockingly (fs file calls, DNS, crypto)."
    ]
  },
  {
    id: "1.2",
    title: "2. Node.js vs Browser JavaScript, Express.js & NestJS",
    content: `### 1. Topic Overview & Mental Model
Developers frequently confuse Node.js with the browser environment or view Express.js and NestJS as competitors to Node.js. In reality, they exist at different layers of the backend stack:
- **Node.js**: The underlying low-level runtime engine providing raw operating system access, sockets, and the event loop.
- **Express.js**: A minimalist, unopinionated routing and middleware library that wraps Node.js's raw \`http.createServer\`.
- **NestJS**: A high-level, opinionated enterprise framework built on top of Express (or Fastify) providing Dependency Injection, TypeScript architecture, and structured modules.

### 2. Node.js vs Browser JavaScript
Both environments run the same ECMAScript language and both use the V8 engine (in Chrome), but their **APIs, global scopes, and security sandboxes are fundamentally opposite**:
1. **Global Object**:
   - Browser: \`window\` (also \`self\` and \`document\`).
   - Node.js: \`global\`. In modern standards, \`globalThis\` refers to the global object in both environments.
2. **Security & System Access**:
   - Browser: Heavily sandboxed. No access to the local file system, network sockets, or raw OS processes. Cannot listen on TCP ports.
   - Node.js: Unsandboxed access to the operating system. Can read/write files (\`fs\`), execute shell commands (\`child_process\`), open TCP/UDP sockets (\`net\`), and bind to network ports.
3. **Event Loop Differences**:
   - Browser: HTML5 event loop specification with a single macrotask queue (UI rendering, user input, timers) and a microtask queue.
   - Node.js: Libuv event loop with **6 distinct phases** (Timers, Pending I/O, Idle/Prepare, Poll, Check \`setImmediate\`, Close) and priority microtask interrupts (\`process.nextTick\`).

### 3. Node.js vs Express.js vs NestJS
- **Raw Node.js (\`http\` module)**:
  - Very verbose. Requires manually parsing URL query strings, reading chunked request body streams, setting \`Content-Type\` headers, and writing nested switch statements for routing.
- **Express.js**:
  - Adds a routing table, middleware pipeline (\`req, res, next\`), request body parsing, route parameters (\`:id\`), and response helpers (\`res.json()\`, \`res.status()\`). Unopinionated: does not prescribe folder structures or database ORMs.
- **NestJS**:
  - Brings Angular-like architecture to Node.js. Uses TypeScript classes, decorators (\`@Controller()\`, \`@Injectable()\`), strict Dependency Injection, module boundaries, and built-in support for WebSockets, Microservices, and GraphQL.`,
    comparisonTable: [
      {
        aspect: "Dimension",
        node: "Raw Node.js",
        express: "Express.js",
        nest: "NestJS"
      },
      {
        aspect: "Abstraction Level",
        node: "Low-level runtime environment",
        express: "Minimalist HTTP routing & middleware layer",
        express_fastify: "Full-featured enterprise application framework"
      },
      {
        aspect: "Architecture Opinion",
        node: "Zero architectural guidelines",
        express: "Unopinionated; developer chooses structure",
        nest: "Highly opinionated (Modules, Controllers, Services, DI)"
      },
      {
        aspect: "Language & Typing",
        node: "JavaScript (supports TS via transpile)",
        express: "JavaScript with optional TypeScript types",
        nest: "Strict TypeScript-first with Decorators & Metadata Reflection"
      },
      {
        aspect: "Best Use Case",
        node: "CLI tools, stream processors, low-level servers",
        express: "Microservices, REST APIs, agile full-stack apps",
        nest: "Large enterprise applications, large teams, complex architectures"
      }
    ],
    code: `// Side-by-side comparison: Raw Node.js vs Express.js

// 1. Raw Node.js HTTP Server (Verbose, manual stream handling)
import http from 'node:http';

const rawServer = http.createServer((req, res) => {
  const { method, url } = req;
  
  if (method === 'GET' && url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', engine: 'raw-node' }));
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// 2. Express.js Server (Declarative routing, automatic serialization)
// import express from 'express';
// const app = express();
// app.use(express.json());
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'ok', engine: 'express' });
// });`,
    keyTakeaways: [
      "Browser JavaScript is sandboxed for client security; Node.js has full operating system access (fs, net, child_process).",
      "globalThis provides standard cross-environment access to the global scope in both browser (window) and Node.js (global).",
      "Express is an unopinionated HTTP routing layer on top of Node.js; NestJS is an opinionated enterprise TypeScript framework on top of Express/Fastify.",
      "Raw Node.js http.createServer requires manual stream chunk concatenation and header management; Express automates parsing and middleware composition."
    ]
  },
  {
    id: "1.3",
    title: "3. Installation, Node Version Management (nvm/fnm) & LTS Releases",
    content: `### 1. Topic Overview & Mental Model
Managing Node.js versions is a critical operational skill. Different projects frequently require different Node versions (e.g., an older service on Node 18, a modern API on Node 20, and a greenfield service on Node 22). Installing Node.js globally via an OS installer creates "version lock-in" and permission bugs with \`sudo npm install -g\`.
- **The Solution**: Use a **Node Version Manager** (\`nvm\` or \`fnm\`) to switch between runtime versions per terminal session or per project directory using a \`.nvmrc\` configuration file.
- **Mental Model**: Multi-voltage power adapters. Instead of rewiring your entire house when switching between 110V and 220V appliances, you use a modular adapter that instantly supplies the exact voltage required.

### 2. Node Version Managers: nvm vs fnm vs volta
1. **nvm (Node Version Manager)**:
   - The established standard for macOS and Linux. Written in bash shell script.
   - Automatically reads \`.nvmrc\` containing \`20.18.0\` and runs \`nvm use\`.
2. **fnm (Fast Node Manager)**:
   - Written in Rust. Up to **40x faster** than \`nvm\` because it does not incur bash subshell overhead. Full cross-platform support for Windows PowerShell, macOS, and Linux.
3. **volta**:
   - Manages Node, npm, yarn, and global packages using deterministic shims pinned inside \`package.json\`.

### 3. The Node.js Release Cadence & LTS Strategy
Node.js follows a predictable 6-month release schedule governed by Semantic Versioning:
- **Even Versions (e.g. Node 18, 20, 22)**:
  - Released every **April**.
  - Enters **Active Long-Term Support (LTS)** in **October** of the same year (6 months after release).
  - Remains in Active LTS for 18 months (receives bug fixes, security updates, performance improvements).
  - Enters **Maintenance LTS** for an additional 12 months (receives critical security fixes only).
  - **Total Support Lifecycle: 30–36 months**.
- **Odd Versions (e.g. Node 19, 21, 23)**:
  - Released every **October**.
  - **Never enter LTS**. Designed for experimental evaluation of cutting-edge V8 features.
  - End of Life (EOL) after only 6–8 months.
- **Production Golden Rule**: **NEVER deploy an odd-numbered Node version to production**. Always deploy the current **Active LTS** release (e.g., Node 20 Iron or Node 22 Jod).`,
    comparisonTable: [
      {
        aspect: "Release Phase",
        status: "Current",
        cadence: "First 6 months after initial release",
        productionReady: "Evaluation only; API changes possible"
      },
      {
        aspect: "Release Phase",
        status: "Active LTS",
        cadence: "Months 7 to 24 (18 months duration)",
        productionReady: "YES — Primary production deployment target"
      },
      {
        aspect: "Release Phase",
        status: "Maintenance LTS",
        cadence: "Months 25 to 36 (12 months duration)",
        productionReady: "YES — Critical security patches only; prepare upgrade"
      },
      {
        aspect: "Release Phase",
        status: "End of Life (EOL)",
        cadence: "After month 36",
        productionReady: "NO — Zero security patches; compliance vulnerability"
      }
    ],
    code: `# Practical Node Version Management Workflow

# 1. Installing Fast Node Manager (fnm) via PowerShell or curl
# Windows: winget install Schniz.fnm
# macOS/Linux: curl -fsSL https://fnm.vercel.app/install | bash

# 2. Installing the latest Active LTS version
fnm install --lts

# 3. Installing a specific Node version
fnm install 20.18.0

# 4. Creating a .nvmrc file in project root to lock the team's version
echo "20.18.0" > .nvmrc

# 5. Automatically switching to project version
fnm use

# 6. Verifying active Node and npm runtime
node -v   # v20.18.0
npm -v    # 10.8.2`,
    keyTakeaways: [
      "Never install Node.js globally using root/sudo; use a version manager like fnm (Rust) or nvm (Bash).",
      "Even-numbered versions (18, 20, 22) enter Long-Term Support (LTS) and receive 30+ months of security and stability patches.",
      "Odd-numbered versions (19, 21, 23) are experimental and should NEVER be deployed to enterprise production environments.",
      "Pin project Node versions in a root .nvmrc file and enforce them in CI/CD pipelines and Docker containers."
    ]
  },
  {
    id: "1.4",
    title: "4. Node.js Project Structure, package.json & package-lock.json",
    content: `### 1. Topic Overview & Mental Model
A production Node.js application requires a clear, layered directory structure and rigorous dependency management.
- \`package.json\` is the **manifest specification** defining metadata, scripts, and intended version ranges.
- \`package-lock.json\` is the **deterministic snapshot** recording the exact resolved version, download URL, and cryptographic SHA-512 integrity hash of every installed package and transitive dependency.
- **Mental Model**: Architectural Blueprints vs As-Built Construction Log.
  - \`package.json\` is the architectural blueprint stating: "This house requires 2x4 lumber (~2.0.0)".
  - \`package-lock.json\` is the verified inspector's log stating: "On Tuesday at 2 PM, lumber lot #4892A with SHA-512 verification hash was installed".

### 2. Standard Enterprise Project Structure (Feature/Layered Hybrid)
\`\`\`
my-backend-service/
├── .env.example              # Documented environment variables (no secrets!)
├── .gitignore                # node_modules, .env, dist, coverage
├── .nvmrc                    # Locked Node runtime version (e.g. 20.18.0)
├── package.json              # Project manifest and scripts
├── package-lock.json         # Cryptographic dependency lockfile
├── tsconfig.json             # TypeScript compiler settings
├── src/
│   ├── index.ts              # Server startup & graceful shutdown listeners
│   ├── app.ts                # Express app initialization & middleware stack
│   ├── config/               # Zod-validated environment config
│   ├── routes/               # API route definitions
│   ├── controllers/          # HTTP request parsing & response serialization
│   ├── services/             # Pure business logic (reusable, framework-agnostic)
│   ├── repositories/         # Database queries (Prisma, TypeORM, Mongoose)
│   ├── middlewares/          # Auth, CORS, rate-limiting, error handling
│   ├── errors/               # Custom AppError classes
│   └── types/                # DTO interfaces & shared TypeScript types
└── tests/
    ├── unit/                 # Pure function and service tests (Vitest)
    └── integration/          # HTTP route tests with Supertest & test DB
\`\`\`

### 3. Deep Breakdown: package.json Key Fields
1. \`"type": "module"\`: Enables native ECMAScript Modules (\`import\`/\`export\`) by default across all \`.js\` files in the project. If omitted, Node defaults to CommonJS (\`require\`).
2. \`"main"\` & \`"exports"\`: \`main\` provides legacy CJS entry point. Modern \`"exports"\` defines granular subpath exports and conditional exports (\`import\` vs \`require\`).
3. \`"engines"\`: Declares compatible runtime versions (e.g. \`"node": ">=20.0.0"\`). Enforced by npm or CI/CD to prevent deployment on unsupported runtimes.
4. \`"scripts"\`: Lifecycle and operational commands (\`npm run dev\`, \`npm run build\`, \`npm test\`). Supports pre- and post-hooks (e.g. \`pretest\`, \`postbuild\`).

### 4. package-lock.json & npm ci vs npm install
- **The Hazard of \`npm install\` in CI/CD**:
  - \`npm install\` consults \`package.json\` and may upgrade dependencies within SemVer ranges (e.g., pulling a newer minor release that introduces a breaking bug). It can also rewrite \`package-lock.json\`.
- **The Solution: \`npm ci\` (Clean Install)**:
  - Designed specifically for CI/CD pipelines and production Docker builds.
  - Completely deletes \`node_modules/\` and installs the **exact** tree recorded in \`package-lock.json\`.
  - Throws an immediate build error if \`package.json\` and \`package-lock.json\` are out of sync.
  - Skips \`package.json\` dependency resolution algorithms, making it **2x to 5x faster** than \`npm install\`.`,
    comparisonTable: [
      {
        aspect: "Feature",
        packageJson: "package.json",
        packageLockJson: "package-lock.json"
      },
      {
        aspect: "Purpose",
        packageJson: "Human-authored project manifest & SemVer version ranges",
        packageLockJson: "Machine-generated deterministic dependency snapshot"
      },
      {
        aspect: "Version Representation",
        packageJson: "Flexible ranges (^2.1.0, ~1.4.0)",
        packageLockJson: "Exact pinned version (2.1.4) + SHA-512 integrity hash"
      },
      {
        aspect: "Transitive Dependencies",
        packageJson: "Only lists direct dependencies",
        packageLockJson: "Recursively maps all child/transitive dependencies"
      },
      {
        aspect: "Git Tracking",
        packageJson: "Committed to Git",
        packageLockJson: "ALWAYS committed to Git (never ignore package-lock!)"
      }
    ],
    code: `// Example Production package.json Manifest
{
  "name": "enterprise-backend-api",
  "version": "1.0.0",
  "description": "High-throughput REST API with Zod validation and Vitest",
  "type": "module",
  "main": "dist/index.js",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/ --ext .ts"
  },
  "dependencies": {
    "express": "^4.21.0",
    "helmet": "^8.0.0",
    "cors": "^2.8.5",
    "zod": "^3.23.8",
    "pino": "^9.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.16.5",
    "typescript": "^5.6.2",
    "vitest": "^2.1.1",
    "supertest": "^7.0.0",
    "tsx": "^4.19.1"
  }
}`,
    keyTakeaways: [
      "package.json defines intended SemVer ranges; package-lock.json records the exact cryptographic dependency tree.",
      "Always commit package-lock.json to version control to guarantee identical builds across all developer machines and production servers.",
      "Always use npm ci in Docker containers and CI/CD pipelines instead of npm install for speed and deterministic safety.",
      "Use the engines field in package.json to block deployment on incompatible Node runtime versions."
    ]
  },
  {
    id: "1.5",
    title: "5. npm, npx, Semantic Versioning & Dependency Management",
    content: `### 1. Topic Overview & Mental Model
Modern JavaScript applications rely on thousands of open-source packages. Understanding Semantic Versioning (SemVer) and dependency categorization prevents catastrophic production outages caused by unexpected upstream package updates.
- **npm (Node Package Manager)**: The default package registry, CLI client, and dependency resolution manager for Node.js.
- **npx (Node Package eXecute)**: A companion CLI utility bundled with npm that downloads, executes, and cleans up single-use CLI binaries without installing them globally or permanently in \`node_modules\`.
- **Mental Model**: Buying a tool vs Renting a tool for an hour.
  - \`npm install -g rimraf\` buys a drill, puts it permanently in your garage, and risks version conflicts over time.
  - \`npx rimraf ./dist\` rents the drill, performs the clean operation, and immediately returns it without cluttering your system.

### 2. Semantic Versioning (SemVer 2.0.0) Deep-Dive
A SemVer string follows the format: **\`MAJOR.MINOR.PATCH\`** (e.g. \`2.4.1\`):
1. **MAJOR (Breaking Changes)**: Incremented when API contracts change in backward-incompatible ways (e.g., function signatures changed, methods removed). Requires code changes to upgrade.
2. **MINOR (New Features)**: Incremented when functionality is added in a backward-compatible manner (e.g., new optional parameter, new helper function).
3. **PATCH (Bug Fixes)**: Incremented when backward-compatible bug fixes, performance optimizations, or security patches are introduced.

### 3. Version Range Prefixes: Caret (\`^\`) vs Tilde (\`~\`) vs Exact
- **Caret (\`^1.2.3\`)**: Allows updates that do not modify the leftmost non-zero digit.
  - \`^1.2.3\` allows \`>=1.2.3 <2.0.0\` (accepts minor and patch updates).
  - \`^0.2.3\` allows \`>=0.2.3 <0.3.0\` (in zero-major pre-releases, minor changes are breaking!).
- **Tilde (\`~1.2.3\`)**: Restricts updates to the patch level only.
  - \`~1.2.3\` allows \`>=1.2.3 <1.3.0\` (accepts bug fixes, locks minor version).
- **Exact Pinned (\`1.2.3\`)**: Zero variance allowed. Strictly installs \`1.2.3\`.

### 4. Dependency Tiers: dependencies vs devDependencies vs peerDependencies
1. **\`dependencies\` (Runtime Essentials)**:
   - Packages strictly required for the application to boot and serve traffic in production (e.g., \`express\`, \`mongoose\`, \`zod\`, \`pino\`).
2. **\`devDependencies\` (Build & Development Tooling)**:
   - Packages required only during local development, testing, compilation, or linting (e.g., \`typescript\`, \`vitest\`, \`eslint\`, \`@types/node\`).
   - Production Docker images run \`npm ci --omit=dev\` to eliminate these tools, slashing container image sizes by 70% and shrinking the CVE attack surface.
3. **\`peerDependencies\` (Plugin Contracts)**:
   - Used when authoring reusable libraries/plugins (e.g. a custom Express middleware or React component). Declares that the *host consumer* must have that package installed at a compatible version.
4. **\`optionalDependencies\`**:
   - Packages that are non-critical if installation fails (e.g., native C++ bindings for macOS \`fsevents\` that fail gracefully on Linux).`,
    comparisonTable: [
      {
        aspect: "Dependency Category",
        flag: "npm install <pkg>",
        storedIn: "dependencies",
        installedInProduction: "YES — Packaged into production containers"
      },
      {
        aspect: "Dependency Category",
        flag: "npm install -D <pkg>",
        storedIn: "devDependencies",
        installedInProduction: "NO — Stripped via npm ci --omit=dev"
      },
      {
        aspect: "Dependency Category",
        flag: "Declared in package.json",
        storedIn: "peerDependencies",
        installedInProduction: "Host project provides peer version"
      },
      {
        aspect: "Dependency Category",
        flag: "npm install -O <pkg>",
        storedIn: "optionalDependencies",
        installedInProduction: "Installed if compatible with host OS/arch"
      }
    ],
    code: `# Common npm and npx CLI Operations

# 1. Installing runtime dependencies
npm install express helmet cors zod

# 2. Installing development dependencies (types, test runners, compilers)
npm install -D typescript vitest @types/node tsx

# 3. Running one-off tools without global installation via npx
npx prisma migrate dev
npx rimraf ./dist

# 4. Production container installation (strips devDependencies)
npm ci --omit=dev

# 5. Auditing dependencies for known CVE security vulnerabilities
npm audit
# Automatically applying non-breaking security fixes
npm audit fix`,
    keyTakeaways: [
      "SemVer follows MAJOR.MINOR.PATCH: Major = breaking, Minor = new features, Patch = bug fixes.",
      "Caret (^) allows minor + patch upgrades (<2.0.0); Tilde (~) allows patch upgrades only (<1.3.0).",
      "Always place build tools, test runners, and type declarations in devDependencies.",
      "Use npm ci --omit=dev in production Docker builds to keep container images lean and secure."
    ]
  },
  {
    id: "1.6",
    title: "6. Environment Configuration: process.env, .env & Node 20.6+ Native Env Support",
    content: `### 1. Topic Overview & Mental Model
According to the **Twelve-Factor App Methodology (Factor III: Config)**, an application's source code must be strictly separated from its runtime configuration. Database credentials, API secret keys, listening ports, and third-party tokens must never be hardcoded in code or committed to version control.
- **The Mechanism**: Environment variables injected by the operating system kernel into the Node.js process and exposed globally via \`process.env\`.
- **Mental Model**: The Security Badge & Uniform.
  - The application code is the security guard uniform (identical in Development, Staging, and Production).
  - The environment variables are the clearance badge and access keys handed to the guard at the start of their specific shift. The uniform never changes; only the credentials change.

### 2. Evolution of Environment Loading in Node.js
1. **The Legacy \`dotenv\` Approach**:
   - For over a decade, Node.js had no native mechanism to read \`.env\` files. Teams installed the \`dotenv\` npm package and loaded it at the entry point:
     \`import 'dotenv/config';\`
2. **Native Node.js 20.6.0+ \`--env-file\` Flag (Modern Standard)**:
   - Node.js 20.6.0 introduced native support for loading \`.env\` files directly into \`process.env\` without third-party dependencies:
     \`node --env-file=.env dist/index.js\`
   - Supports multiple files with cascading overrides:
     \`node --env-file=.env --env-file=.env.local dist/index.js\`

### 3. Fail-Fast Schema Validation with Zod
Reading raw \`process.env\` strings directly across controllers is a dangerous anti-pattern:
- \`process.env.PORT\` is always a \`string | undefined\`, not a \`number\`.
- A missing \`DATABASE_URL\` or \`JWT_SECRET\` will not crash the app on startup; it will cause a catastrophic runtime crash hours later when a customer attempts to authenticate!
- **Senior Solution**: Validate all environment variables on boot using **Zod**. If any required secret is missing or misformatted, the process terminates immediately with an explicit diagnostic error before binding to the network.`,
    comparisonTable: [
      {
        aspect: "Configuration Pattern",
        dotenv: "dotenv package",
        nativeEnv: "Node 20.6+ --env-file",
        zodSchema: "Zod Config Schema"
      },
      {
        aspect: "Dependency",
        dotenv: "External npm dependency",
        nativeEnv: "Built directly into Node runtime",
        zodSchema: "Runtime schema validation library"
      },
      {
        aspect: "Type Safety",
        dotenv: "Returns string | undefined",
        nativeEnv: "Returns string | undefined",
        zodSchema: "Strict typed object (number, URL, enum)"
      },
      {
        aspect: "Crash Behavior",
        dotenv: "Silent undefined bugs at runtime",
        nativeEnv: "Silent undefined bugs at runtime",
        zodSchema: "Fails fast at boot with field-level errors"
      }
    ],
    code: `// Production-Grade Fail-Fast Environment Configuration using Zod
// File: src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection URI'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  ENABLE_RATE_LIMITING: z.coerce.boolean().default(true)
});

// Parse and validate process.env on boot
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ FATAL: Invalid or missing environment configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1); // Fail immediately before binding ports
  }
  
  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;`,
    keyTakeaways: [
      "Follow Twelve-Factor App guidelines: store all config, credentials, and secrets in environment variables.",
      "Node.js 20.6+ natively supports loading .env files via node --env-file=.env without the dotenv package.",
      "Never commit .env files to source control; always provide a sanitized .env.example file.",
      "Always validate process.env at boot time with Zod to fail fast if required secrets are missing."
    ]
  }
];

// Read existing parts from scratch
const batch1 = require('./node_notes_parts_1_to_8.json');
const batch2 = require('./node_notes_parts_9_to_16.json');
const batch3 = require('./node_notes_parts_17_to_24.json');

// Rebuild Part 1 with all 6 Module 1 sections
const updatedPart1 = {
  id: 1,
  title: "Part 1 — Node.js Fundamentals, Ecosystem, Project Structure & Configuration",
  badge: "Runtime Foundations",
  color: "#10b981",
  sections: module1Sections
};

// Update Part 2 to include the Event Loop and Concurrency sections
const updatedPart2 = {
  id: 2,
  title: "Part 2 — JavaScript Execution, Event Loop Phases & Concurrency Model",
  badge: "Engine Architecture",
  color: "#06b6d4",
  sections: [
    // Move Event Loop from old part 1
    batch1[0].sections[1], // "2. The Event Loop Phases in Exact Order"
    batch1[0].sections[2], // "3. Microtasks & Execution Priority"
    // Keep existing Part 2 sections
    ...batch1[1].sections
  ]
};

// Rebuild Part 3: ESM vs CommonJS, Resolution, Circular Dependencies & Top-Level Await
const updatedPart3 = {
  id: 3,
  title: "Part 3 — CommonJS vs ECMAScript Modules (ESM), Resolution & Top-Level Await",
  badge: "Module Systems",
  color: "#3b82f6",
  sections: [
    {
      id: "3.1",
      title: "7. CommonJS (require, module.exports) vs ES Modules (import, export) & Top-Level Await",
      content: `### 1. Topic Overview & Mental Model
Node.js is in the final stages of a historic decade-long migration from **CommonJS (CJS)** to **ECMAScript Modules (ESM)**.
- **CommonJS**: Designed in 2009 for server-side JavaScript before browsers had any module system. Uses synchronous \`require()\` and dynamic runtime mutation of \`module.exports\`.
- **ECMAScript Modules (ESM)**: The official language standard (ES2015+). Uses asynchronous, statically analyzable \`import\` and \`export\` declarations.
- **Mental Model**: Buying Books in Person vs Registering Subscriptions.
  - CommonJS is like driving to a bookstore in person: your code execution stops completely (\`require\`) until the book is fetched from disk and executed.
  - ESM is like an automated library subscription: before any book is opened, the librarian inspects the entire catalog graph, links all cross-references, and fetches them asynchronously.

### 2. Core Differences: CJS vs ESM
1. **Loading Mechanics**:
   - CJS: **Synchronous runtime execution**. When \`require('./user')\` runs, Node reads the file from disk, wraps it in an IIFE function wrapper, executes it, and caches \`module.exports\`.
   - ESM: **Asynchronous three-phase loading**:
     - *Phase 1 (Construction/Parsing)*: Recursively parses all files into a Module Record graph without executing any code.
     - *Phase 2 (Instantiation)*: Allocates memory locations for all exported variables and links \`import\` declarations to those locations (**Live Bindings**).
     - *Phase 3 (Evaluation)*: Executes top-level code and fills the memory locations with actual values.
2. **Value Semantics: Value Copies vs Live Bindings**:
   - CommonJS exports are **copies of values**. If Module A exports a variable and changes it later, Module B's required copy does NOT update.
   - ESM exports are **live references (pointers)**. If Module A updates an exported variable, Module B sees the new value immediately.
3. **Missing CommonJS Globals in ESM**:
   - In ESM, \`__dirname\`, \`__filename\`, \`require\`, and \`module.exports\` do NOT exist!
   - To reconstruct \`__dirname\` in ESM:
     \`\`\`javascript
     import { fileURLToPath } from 'node:url';
     import { dirname } from 'node:path';
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = dirname(__filename);
     \`\`\`

### 3. Top-Level Await: Capabilities & Architectural Constraints
In ECMAScript Modules (Node 14.8+), the \`await\` keyword can be used at the top level of a module outside of any \`async\` function wrapper:
- **Capabilities**: Allows asynchronous resources (database connection pools, cryptographic keys from AWS Secrets Manager, dynamic configuration) to be initialized cleanly before exporting services.
- **Internal Mechanics**: Top-level await **pauses the evaluation of the module dependency graph**. Any module that imports a module with top-level await will wait until that module's promise resolves before executing its own body.
- **CommonJS Incompatibility**: CommonJS **cannot** \`require()\` a module that uses top-level await! Because \`require()\` is strictly synchronous, Node throws:
  \`Error [ERR_REQUIRE_ASYNC_MODULE]: require() of ES Module with top-level await is not supported.\`
  To load it from CommonJS, dynamic \`import('./esm-module.js')\` must be used.`,
      comparisonTable: [
        {
          aspect: "Feature",
          cjs: "CommonJS (CJS)",
          esm: "ECMAScript Modules (ESM)"
        },
        {
          aspect: "Syntax",
          cjs: "const x = require('./x'); module.exports = x;",
          esm: "import x from './x'; export default x;"
        },
        {
          aspect: "Evaluation Time",
          cjs: "Dynamic at runtime (can require inside if blocks)",
          esm: "Static analysis at parse time (must be top-level)"
        },
        {
          aspect: "Export Semantics",
          cjs: "Value copy (primitive snapshots)",
          esm: "Live binding (direct memory pointers to source)"
        },
        {
          aspect: "Top-Level Await",
          cjs: "NOT supported (syntax error)",
          esm: "Native support in Node 14.8+"
        },
        {
          aspect: "Legacy Globals",
          cjs: "__dirname, __filename, require available",
          esm: "import.meta.url used to derive paths"
        }
      ],
      code: `// Demonstrating ESM Top-Level Await and Derived __dirname
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs/promises';

// 1. Reconstructing __filename and __dirname in native ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current directory:', __dirname);

// 2. Top-Level Await: Initializing async resources without IIFE wrappers
console.log('1. Module evaluation started...');

// Simulating database connection or reading async config
const configPath = join(__dirname, 'config.json');
let dbConfig;

try {
  // Top-level await cleanly pauses module consumers until resolved!
  await new Promise(resolve => setTimeout(resolve, 100));
  dbConfig = { host: 'localhost', port: 5432, status: 'connected' };
  console.log('2. Asynchronous resource connected successfully.');
} catch (err) {
  console.error('Fatal initialization error:', err);
  throw err;
}

// 3. Exporting pre-initialized resource
export const db = dbConfig;`,
      keyTakeaways: [
        "CommonJS is synchronous and exports value copies; ESM is asynchronous, statically parsed, and exports live references.",
        "To enable native ESM in Node.js, add \"type\": \"module\" to package.json or use the .mjs file extension.",
        "__dirname and __filename do not exist in ESM; reconstruct them using fileURLToPath(import.meta.url) and path.dirname.",
        "Top-level await pauses execution of the module graph until resolved; CommonJS cannot synchronously require a module using top-level await."
      ]
    },
    // Keep Module Resolution, Caching & Circular Dependencies
    batch1[2].sections[1]
  ]
};

// Assemble updated batches
const updatedBatch1 = [
  updatedPart1,
  updatedPart2,
  updatedPart3,
  ...batch1.slice(3) // Parts 4 to 8 remain identical
];

fs.writeFileSync(path.join(__dirname, 'node_notes_parts_1_to_8.json'), JSON.stringify(updatedBatch1, null, 2));
console.log('Successfully updated batch 1 with complete Module 1 coverage!');
