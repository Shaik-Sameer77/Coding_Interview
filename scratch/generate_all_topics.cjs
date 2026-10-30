// Generator for Topics 2 to 6
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

// TOPIC 2: Modules & CommonJS/ESM (Q16–Q30)
q(16, 2, "2. Modules & CommonJS/ESM",
  "What is the difference between CommonJS (CJS) and ECMAScript Modules (ESM)?",
  "CommonJS is Node's legacy module system using `require()` and `module.exports`. It loads modules synchronously at runtime. ESM (`import`/`export`) is the official ECMAScript standard. It is asynchronous, statically analyzable at compile/parse time (enabling tree-shaking), and uses top-level `await`.",
  "Memory Anchor: CJS = Synchronous runtime require(). ESM = Static compile-time import with tree-shaking & top-level await.",
  `// CommonJS (CJS)
const fs = require('fs');
module.exports = { myFunction };

// ES Modules (ESM)
import fs from 'node:fs';
export { myFunction };`,
  null,
  [
    { aspect: "Loading Timing", detail: "CJS loads synchronously at runtime; ESM parses statically in phases (construction, instantiation, evaluation)." },
    { aspect: "Syntax", detail: "require() / module.exports vs import / export." },
    { aspect: "Top-level await", detail: "Supported natively in ESM; requires async wrapper in CJS." },
    { aspect: "Tree shaking", detail: "Supported in ESM due to static analysis; difficult in CJS." }
  ]
);

q(17, 2, "2. Modules & CommonJS/ESM",
  "How does Node.js resolve and cache required modules?",
  "Node.js caches modules in `require.cache` by their resolved absolute file path after the first `require()`. Subsequent calls return the cached `exports` object without re-executing the module code. Modules are resolved in order: 1) Core modules (fs, path); 2) File or folder paths (./, ../); 3) `node_modules` walked upwards to the filesystem root.",
  "Memory Anchor: Resolved absolute path → Looked up in require.cache → If found return cached, else evaluate and cache.",
  `// Invalidate cache dynamically (e.g., hot-reloading mock data):
const modulePath = require.resolve('./config');
delete require.cache[modulePath];
const freshConfig = require('./config');`
);

q(18, 2, "2. Modules & CommonJS/ESM",
  "What is the difference between exports and module.exports in CommonJS?",
  "`module.exports` is the actual object returned when another file requires the module. `exports` is merely a variable initialized to reference `module.exports` (`exports = module.exports = {}`).\nIf you reassign `exports = function() {}`, you break the reference to `module.exports` and nothing is exported! Always assign to `module.exports` if exporting a single class, function, or primitive.",
  "Memory Anchor: module.exports is the real master. exports is only a helper shortcut reference.",
  `// CORRECT:
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// OR replacing entire export:
module.exports = class AuthService {};

// INCORRECT (breaks reference!):
// exports = class AuthService {}; // Exports remain empty object!`
);

q(19, 2, "2. Modules & CommonJS/ESM",
  "How does Node.js handle circular module dependencies in CommonJS?",
  "When module A requires module B while B requires module A, Node does not deadlock. Instead, module B receives an **incomplete, partial copy** of module A's `exports` object as it was evaluated up to that point. Once both finish executing, the references are updated, but circular dependencies can cause undefined function calls if properties are accessed during initial module evaluation.",
  "Memory Anchor: Returns an incomplete copy of exports evaluated so far. Avoid circular dependencies by refactoring shared code into a third module.",
  `// a.js: const b = require('./b'); exports.done = false;
// b.js: const a = require('./a'); console.log('a.done in b:', a.done);`
);

q(20, 2, "2. Modules & CommonJS/ESM",
  "How do you enable ECMAScript Modules (ESM) in a Node.js project?",
  "Two standard methods:\n1) Add `\"type\": \"module\"` to `package.json`. All `.js` files in the project will be treated as ESM.\n2) Use the `.mjs` file extension for ESM files, or `.cjs` for explicit CommonJS files when `type: module` is active.",
  "Memory Anchor: \"type\": \"module\" in package.json OR use .mjs file extension."
);

q(21, 2, "2. Modules & CommonJS/ESM",
  "Why are __dirname and __filename missing in ESM, and how do you recreate them?",
  "In ESM, `__dirname` and `__filename` are not defined because ESM modules are designed to run in both browser and server environments where file paths don't exist. Instead, ESM provides `import.meta.url`. You recreate them using `fileURLToPath` from the `node:url` module and `dirname` from `node:path`.",
  "Memory Anchor: Use import.meta.url + fileURLToPath + dirname to recreate __dirname in ESM.",
  `import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, 'data.json');`
);

q(22, 2, "2. Modules & CommonJS/ESM",
  "Can you import CommonJS modules into ESM, and can you require() ESM modules into CommonJS?",
  "1) ESM importing CJS: Fully supported via default import (`import express from 'express'`).\n2) CJS requiring ESM: Synchronous `require('./esm-file.mjs')` throws `ERR_REQUIRE_ESM`. In CJS, you must use dynamic `import('./esm-file.mjs')` which returns a Promise.",
  "Memory Anchor: ESM can import CJS easily. CJS can only load ESM via async dynamic import().",
  `// In CommonJS file:
async function loadESM() {
  const { default: chalk } = await import('chalk');
  console.log(chalk.green('Loaded ESM module in CommonJS!'));
}`
);

q(23, 2, "2. Modules & CommonJS/ESM",
  "What is the Module Wrapper Function in CommonJS?",
  "Before executing any CommonJS file, Node.js wraps the file content in an IIFE function wrapper:\n`(function (exports, require, module, __filename, __dirname) { ... your code ... });`\nThis gives each file its private scope (preventing global variable leakage) and injects the module-specific variables (`require`, `module`, `exports`, `__filename`, `__dirname`).",
  "Memory Anchor: (function (exports, require, module, __filename, __dirname) { your code })();"
);

q(24, 2, "2. Modules & CommonJS/ESM",
  "What is package-lock.json and why must it be committed to version control?",
  "`package-lock.json` records the exact, deterministic dependency tree (exact versions, resolved registry URLs, and integrity SHA-512 hashes) of every package and transitive dependency installed. Committing it guarantees identical installations across development, staging, CI/CD, and production environments (`npm ci`), eliminating 'works on my machine' version drift.",
  "Memory Anchor: package-lock.json = Deterministic reproducible builds across all machines and CI/CD pipelines."
);

q(25, 2, "2. Modules & CommonJS/ESM",
  "What is the difference between npm install and npm ci?",
  "`npm install` resolves versions from package.json and updates package-lock.json if ranges allow. `npm ci` (Clean Install) strictly validates package.json against package-lock.json, deletes the existing `node_modules`, and installs the exact locked versions without modifying package-lock.json. `npm ci` is faster and mandatory for production CI/CD.",
  "Memory Anchor: npm i = Local dev & updates lockfile. npm ci = Clean, fast, deterministic install for CI/CD.",
  null,
  null,
  [
    { aspect: "npm install", detail: "Can upgrade dependencies within caret (^) ranges; writes to package-lock.json." },
    { aspect: "npm ci", detail: "Deletes node_modules; enforces exact lockfile; fails if lockfile is out of sync." }
  ]
);

q(26, 2, "2. Modules & CommonJS/ESM",
  "What are peerDependencies in package.json?",
  "`peerDependencies` specify that a package requires a specific version of a host dependency to be installed by the consuming application, rather than bundling its own copy. Commonly used for plugins (e.g. an Express middleware requires `express` as a peerDependency so they share the same Express singleton instance).",
  "Memory Anchor: Peer dependencies expect the host project to provide the shared dependency."
);

q(27, 2, "2. Modules & CommonJS/ESM",
  "What is the node: prefix in core module imports?",
  "Starting in Node.js 16+, prefixing core modules with `node:` (`node:fs`, `node:path`, `node:crypto`, `node:http`) makes it explicit that a built-in Node.js module is being loaded, prevents shadowing conflicts with third-party npm packages of the same name, and speeds up module resolution.",
  "Memory Anchor: Always use node: prefix for core modules in modern Node.js."
);

q(28, 2, "2. Modules & CommonJS/ESM",
  "What is dynamic import() and when should it be used?",
  "`import(specifier)` is a function-like syntax that returns a Promise resolving to the requested module. It allows conditional or on-demand module loading (e.g. loading a heavy PDF generation module only when the user requests an invoice export), reducing initial memory consumption and startup time.",
  "Memory Anchor: Dynamic import = Lazy-load heavy modules on demand inside async functions.",
  `app.get('/export-report', async (req, res) => {
  const { generatePdfReport } = await import('./heavyPdfService.js');
  const buffer = await generatePdfReport(req.query);
  res.type('pdf').send(buffer);
});`
);

q(29, 2, "2. Modules & CommonJS/ESM",
  "What is the exports field in package.json?",
  "The `exports` field defines the official public entry points and subpath exports of a package, encapsulating internal private files from being accessed by consumers (`exports: { \".\": \"./index.js\", \"./utils\": \"./dist/utils.js\" }`). It can also provide conditional exports for ESM (`import`) vs CJS (`require`).",
  "Memory Anchor: exports field = Encapsulates package internals and specifies conditional CJS/ESM entry points."
);

q(30, 2, "2. Modules & CommonJS/ESM",
  "How do you inspect the module resolution path for a package?",
  "Use `require.resolve(moduleName)`. It returns the exact absolute path of the file that would be loaded without actually executing or evaluating the module.",
  "Memory Anchor: require.resolve('lodash') returns the absolute path without executing it."
);

// TOPIC 3: Buffers, Streams & Pipe (Q31–Q45)
q(31, 3, "3. Buffers, Streams & Pipe",
  "What is a Buffer in Node.js, and why is it needed?",
  "A Buffer represents a fixed-length chunk of raw binary memory allocated outside the V8 JavaScript heap (using C++ memory allocation). It is needed because pure JavaScript originally had no mechanism for manipulating binary byte streams (TCP packets, file reading, image processing). Buffers store 8-bit octets (values 0–255).",
  "Memory Anchor: Buffer = Raw binary memory allocated outside the V8 heap for binary data and I/O.",
  `const buf = Buffer.from('Hello, Senior SDE!');
console.log(buf); // <Buffer 48 65 6c 6c 6f...>
console.log(buf.toString('hex')); // Hex representation
console.log(buf.toString('base64')); // Base64 encoding`
);

q(32, 3, "3. Buffers, Streams & Pipe",
  "What is the difference between Buffer.alloc() and Buffer.allocUnsafe()?",
  "`Buffer.alloc(size)` allocates memory and initializes all bytes to zero (`0x00`). It is safe from memory leaks.\n`Buffer.allocUnsafe(size)` allocates memory without zeroing it out. It is significantly faster because it avoids writing zeros, but the buffer may contain residual, sensitive data (passwords, tokens) previously held in that memory segment. If using `allocUnsafe`, you must immediately overwrite all bytes.",
  "Memory Anchor: alloc = Safe, zeroed out. allocUnsafe = Ultra-fast, but contains uninitialized dirty memory.",
  null,
  null,
  [
    { aspect: "Buffer.alloc(size)", detail: "Zero-filled; safe; zero risk of leaking confidential memory." },
    { aspect: "Buffer.allocUnsafe(size)", detail: "Non-zeroed; faster; security risk if exposed directly without writing." }
  ]
);

q(33, 3, "3. Buffers, Streams & Pipe",
  "What are Streams in Node.js, and what are the 4 fundamental stream types?",
  "Streams are collections of data that might not be available all at once and don't have to fit entirely into memory. They process data chunk-by-chunk.\nThe 4 types:\n1) `Readable`: Abstraction for a source from which data can be consumed (`fs.createReadStream`, HTTP `req`).\n2) `Writable`: Abstraction for a destination to which data can be written (`fs.createWriteStream`, HTTP `res`).\n3) `Duplex`: Stream that is both Readable and Writable (e.g. TCP `net.Socket`).\n4) `Transform`: A duplex stream where the output is computed from the input (e.g. `zlib.createGzip`, crypto cipher).",
  "Memory Anchor: 4 Streams = Readable (source), Writable (sink), Duplex (both), Transform (middleware filter)."
);

q(34, 3, "3. Buffers, Streams & Pipe",
  "Why is streaming essential when serving large files (e.g. 2 GB video) in Express?",
  "Using `fs.readFile()` loads the entire 2 GB file into V8 heap memory before sending it. If 10 concurrent users request it, the server attempts to allocate 20 GB of RAM, causing memory exhaustion and crashes.\nStreaming (`fs.createReadStream().pipe(res)`) loads data in small, configurable chunks (default 64 KB), keeping memory usage constant (~few megabytes) regardless of whether the file is 10 MB or 100 GB.",
  "Memory Anchor: readFile = Loads entire file into RAM (crashes). createReadStream = Constant low memory footprint.",
  `// BAD: Loads 2GB into RAM
app.get('/bad-download', (req, res) => {
  fs.readFile('./huge-video.mp4', (err, data) => res.send(data));
});

// GOOD: Streams 64KB chunks to response
app.get('/stream-download', (req, res) => {
  const stream = fs.createReadStream('./huge-video.mp4');
  res.setHeader('Content-Type', 'video/mp4');
  stream.pipe(res);
});`
);

q(35, 3, "3. Buffers, Streams & Pipe",
  "What is Backpressure in streams, and how is it handled?",
  "Backpressure occurs when the data source (Readable stream) produces data faster than the destination (Writable stream) can process or write it (e.g. fast disk read vs slow 3G mobile client connection).\nWithout backpressure management, unwritten chunks pile up in memory buffer, eventually causing an out-of-memory crash. Node handles backpressure via `write() === false` and the `'drain'` event, or automatically using `.pipe()` / `pipeline()`.",
  "Memory Anchor: Backpressure = Producer faster than consumer. Solved by pausing readable stream until writable emits 'drain'.",
  `const canWrite = writable.write(chunk);
if (!canWrite) {
  readable.pause(); // Pause reading
  writable.once('drain', () => readable.resume()); // Resume when buffer clears
}`
);

q(36, 3, "3. Buffers, Streams & Pipe",
  "Why should you prefer stream.pipeline() over stream.pipe()?",
  "`.pipe()` does not forward errors properly across a chain of streams (e.g. `source.pipe(transform).pipe(destination)`). If the middle stream throws an error, the source and destination streams remain open, leaking file descriptors and memory.\n`pipeline()` properly forwards errors from any stream in the pipeline, automatically cleans up and destroys all streams in the chain, and supports Promise syntax via `stream/promises`.",
  "Memory Anchor: pipe() leaks file descriptors on error. pipeline() guarantees cleanup of all streams on error.",
  `import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

async function compressFile(src, dest) {
  await pipeline(
    fs.createReadStream(src),
    zlib.createGzip(),
    fs.createWriteStream(dest)
  );
  console.log('Compression complete with zero leaks!');
}`
);

q(37, 3, "3. Buffers, Streams & Pipe",
  "What is the difference between paused and flowing modes in Readable streams?",
  "- Flowing Mode: Data is read from the underlying system automatically and provided as quickly as possible via the `'data'` event.\n- Paused Mode: The stream does not push data. You must explicitly call `stream.read()` to fetch chunks, usually inside a `'readable'` event listener.\nA stream starts in paused mode and switches to flowing mode when a `'data'` listener is attached or `.pipe()` is called.",
  "Memory Anchor: Paused = pull-based (stream.read()). Flowing = push-based ('data' events)."
);

q(38, 3, "3. Buffers, Streams & Pipe",
  "How do you convert a Buffer to a string, and what encodings are supported?",
  "Call `buf.toString(encoding)`. Common encodings supported:\n- `'utf8'` (default for text)\n- `'hex'` (two hex characters per byte)\n- `'base64'` (Base64 encoding for binary transfer)\n- `'latin1'` / `'binary'`\n- `'ascii'`",
  "Memory Anchor: buf.toString('utf8' | 'hex' | 'base64')."
);

q(39, 3, "3. Buffers, Streams & Pipe",
  "What is highWaterMark in Node.js streams?",
  "`highWaterMark` is the threshold size (in bytes) of the internal buffer before a stream stops reading from the underlying source or returns `false` on `write()`. For normal streams, the default is 16 KB (`16 * 1024`); for file streams (`fs.createReadStream`), the default is 64 KB (`64 * 1024`); for objectMode streams, it represents the count of objects (default 16).",
  "Memory Anchor: highWaterMark = Buffer capacity threshold (default 64KB for fs, 16KB for streams) that triggers backpressure."
);

q(40, 3, "3. Buffers, Streams & Pipe",
  "What is objectMode in Node.js streams?",
  "By default, streams operate exclusively on `Buffer` and `string` chunks. Setting `{ objectMode: true }` allows streams to emit and consume arbitrary JavaScript objects (numbers, objects, arrays), enabling streaming data processing pipelines for JSON or database records.",
  "Memory Anchor: objectMode: true allows streaming JS objects instead of just binary Buffers.",
  `import { Transform } from 'node:stream';

const parseJsonStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const obj = JSON.parse(chunk.toString());
    this.push(obj);
    callback();
  }
});`
);

q(41, 3, "3. Buffers, Streams & Pipe",
  "How do you implement a custom Transform stream?",
  "Extend the `Transform` class or instantiate it with a `transform(chunk, encoding, callback)` method. Read the chunk, perform modification, emit output via `this.push(transformedChunk)`, and invoke `callback()` when ready for the next chunk.",
  "Memory Anchor: Implement transform(chunk, enc, cb) -> call this.push() -> call cb().",
  `import { Transform } from 'node:stream';

const upperCaseStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});`
);

q(42, 3, "3. Buffers, Streams & Pipe",
  "What is Buffer.concat() and when should it be used?",
  "`Buffer.concat(list, totalLength)` takes an array of Buffer objects and concatenates them into a single continuous Buffer. It is commonly used when accumulating chunks from a Readable stream before parsing complete data.",
  "Memory Anchor: Buffer.concat([chunk1, chunk2]) merges an array of chunks into one Buffer.",
  `const chunks = [];
stream.on('data', chunk => chunks.push(chunk));
stream.on('end', () => {
  const completeBuffer = Buffer.concat(chunks);
  console.log('Complete payload size:', completeBuffer.length);
});`
);

q(43, 3, "3. Buffers, Streams & Pipe",
  "What happens if you concatenate Buffer chunks as strings using += ?",
  "Concatenating chunks with `let str = ''; str += chunk;` can cause multi-byte character corruption! If a multi-byte UTF-8 character (e.g. an emoji or non-ASCII character) gets split across two 64KB chunk boundaries, converting the individual chunk to string replaces the half-character with the replacement character `` (U+FFFD).\nSolution: Collect Buffer chunks and use `Buffer.concat()`, or use `StringDecoder` from `node:string_decoder`.",
  "Memory Anchor: Never use += on stream chunks! Use StringDecoder or Buffer.concat to prevent splitting multi-byte UTF-8 characters.",
  `import { StringDecoder } from 'node:string_decoder';
const decoder = new StringDecoder('utf8');
stream.on('data', (chunk) => {
  const text = decoder.write(chunk); // Holds incomplete bytes until next chunk!
});`
);

q(44, 3, "3. Buffers, Streams & Pipe",
  "How can you read a stream using async/await and for await...of?",
  "In modern Node.js, Readable streams implement the AsyncIterable protocol. You can consume stream chunks sequentially using a `for await (const chunk of stream)` loop without manual event listeners.",
  "Memory Anchor: for await (const chunk of readableStream) provides clean async iteration over streams.",
  `async function processFile(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  for await (const chunk of stream) {
    console.log('Received chunk of length:', chunk.length);
  }
  console.log('Stream finished!');
}`
);

q(45, 3, "3. Buffers, Streams & Pipe",
  "How do you gracefully destroy a stream to cancel reading or writing?",
  "Call `stream.destroy(error)`. It immediately closes the underlying resource (file descriptor or socket) and emits the `'close'` event (and `'error'` if an error parameter was supplied), ensuring memory is freed immediately.",
  "Memory Anchor: stream.destroy() closes underlying file descriptors and frees memory immediately."
);

fs.writeFileSync(path.resolve(__dirname, 'batch_2_3.json'), JSON.stringify(batch, null, 2));
console.log('Batch 2 & 3 generated. Total questions so far:', batch.length);
