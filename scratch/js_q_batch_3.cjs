// scratch/js_q_batch_3.cjs - Questions 81 to 120
module.exports = [
  {
    id: 81,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Promises",
    question: "How does Promise chaining work and what is a 'thenable'?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Promise chaining works because \`.then()\`, \`.catch()\`, and \`.finally()\` **always return a brand-new Promise**.
• If a handler returns a scalar value, the new promise resolves immediately with that value.
• If a handler returns another Promise (or any **thenable** object with a \`.then()\` method), the outer promise assimilates its state, waiting until the inner promise settles. This eliminates nested callback hell.`,
    code: `fetch("/api/user")
  .then(res => res.json())     // Assimilates json() promise
  .then(user => user.cartId)   // Resolves scalar cartId
  .then(cartId => fetch(\`/api/cart/\${cartId}\`)) // Chains next async request
  .catch(err => console.error(err));`
  },
  {
    id: 82,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Promise Combinators",
    question: "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The 4 Promise combinators coordinate concurrent asynchronous tasks:
• **\`Promise.all()\`**: Fulfills when **ALL** promises fulfill. Short-circuits and rejects on the **FIRST** rejection (all-or-nothing).
• **\`Promise.allSettled()\`**: Waits until **ALL** promises settle. Never rejects. Returns an array of \`{ status, value | reason }\` descriptor objects.
• **\`Promise.race()\`**: Settles as soon as the **FIRST** promise settles (fulfills or rejects).
• **\`Promise.any()\`**: Fulfills as soon as the **FIRST** promise fulfills. Rejects with an \`AggregateError\` only if **ALL** promises reject.`,
    table: {
      headers: ["Combinator", "Fulfills When", "Rejects When", "Short-Circuit?"],
      rows: [
        ["Promise.all()", "ALL fulfill", "ANY rejects", "Yes (on 1st rejection)"],
        ["Promise.allSettled()", "ALL settle", "Never rejects", "No"],
        ["Promise.race()", "FIRST settles", "FIRST settles", "Yes (1st settlement)"],
        ["Promise.any()", "FIRST fulfills", "ALL reject (AggregateError)", "Yes (1st fulfillment)"]
      ]
    }
  },
  {
    id: 83,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Async/Await",
    question: "What is async/await and how does it desugar under the hood?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`async/await\` is syntactic sugar built on top of **Promises and Generator functions**.
• An \`async function\` always wraps its return value in \`Promise.resolve()\`.
• Inside, \`await\` suspends function execution without blocking the main thread, yielding execution back to the event loop until the awaited promise settles. Under the hood, the engine compiles \`async/await\` into a state machine that drives a generator with \`yield promise\`.`,
    code: `// Async/await:
async function loadData() {
  const user = await fetchUser();
  return user.name;
}

// Equivalent Promise desugaring:
function loadDataDesugared() {
  return Promise.resolve()
    .then(() => fetchUser())
    .then(user => user.name);
}`
  },
  {
    id: 84,
    topicId: 6,
    difficulty: "Junior",
    category: "Async Error Handling",
    question: "How do you handle errors properly in async/await code?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Async errors are handled using standard **\`try/catch/finally\` blocks**. When an awaited Promise rejects, \`await\` unwraps the rejection reason and throws it as an exception that can be caught by \`catch(err)\`. The \`finally\` block runs guaranteed cleanups (e.g. closing DB connections or stopping loading spinners).`,
    code: `async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error; // Re-throw or handle gracefully
  } finally {
    console.log("Cleanup complete");
  }
}`
  },
  {
    id: 85,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Error Handling",
    question: "What happens when a Promise rejection is unhandled?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
When a promise rejects without a \`.catch()\` or surrounding \`try/catch\`, it triggers an **Unhandled Promise Rejection**:
• **In Node.js**: Emits the \`unhandledRejection\` process event. In modern Node.js (v15+), unhandled rejections terminate the process with exit code 1 to avoid running in an unpredictable state!
• **In Browsers**: Emits the \`unhandledrejection\` window event.`,
    code: `// Catching unhandled rejections globally in Node.js:
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});`
  },
  {
    id: 86,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Modern Web APIs",
    question: "What is AbortController and how is it used to cancel fetch requests?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`AbortController\` is the standard web controller interface used to cancel in-flight asynchronous operations.
• Create controller: \`const controller = new AbortController()\`
• Pass signal: \`fetch(url, { signal: controller.signal })\`
• Cancel request: \`controller.abort()\`
When aborted, the fetch promise rejects immediately with a \`DOMException\` whose name is \`"AbortError"\`. Essential for debounced autocomplete inputs and cleaning up requests in React \`useEffect\`.`,
    code: `const controller = new AbortController();
setTimeout(() => controller.abort(), 2000); // 2s timeout

fetch("/api/large-dataset", { signal: controller.signal })
  .catch(err => {
    if (err.name === "AbortError") console.log("Request cancelled cleanly!");
  });`
  },
  {
    id: 87,
    topicId: 6,
    difficulty: "Junior",
    category: "Timers & Event Loop",
    question: "Why does setTimeout(fn, 0) not execute immediately?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`setTimeout(fn, 0)\` does not mean "run in 0 milliseconds right now". It means **"schedule this callback as a Macrotask to run on the next available turn of the Event Loop once the current Call Stack and all pending Microtasks are completely drained"**. Furthermore, browsers enforce a minimum timer clamping delay of 4ms for nested timers.`,
    code: `console.log("1");
setTimeout(() => console.log("3"), 0);
console.log("2");
// Output: 1, 2, 3`
  },
  {
    id: 88,
    topicId: 6,
    difficulty: "Senior",
    category: "Timers & Precision",
    question: "What causes timer drift in setInterval and how do you achieve accurate pacing?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`setInterval\` does not account for the execution time of its callback or other work on the Call Stack. If the callback takes 50ms and the interval is 100ms, the timer drifts significantly over minutes.
• **Senior Solution**: Use **Self-Adjusting Recursive \`setTimeout\`**: Measure the actual elapsed time using \`performance.now()\` and dynamically calculate the exact offset delay for the next tick!`,
    code: `function accurateInterval(callback, interval) {
  let expected = performance.now() + interval;

  function step() {
    const drift = performance.now() - expected;
    callback();
    expected += interval;
    // Adjust next timeout by subtracting accumulated drift:
    setTimeout(step, Math.max(0, interval - drift));
  }

  setTimeout(step, interval);
}`
  },
  {
    id: 89,
    topicId: 6,
    difficulty: "Senior",
    category: "Node.js Internals",
    question: "What is the difference between process.nextTick() and Promise microtasks in Node.js?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In Node.js:
• **\`process.nextTick()\`**: Maintains its own private \`nextTickQueue\`. It has the **absolute highest priority** in the runtime, draining immediately after the currently executing operation finishes, BEFORE any Promise microtasks or the Libuv event loop advances!
• **Promise Microtasks**: Drained after the \`nextTickQueue\` is completely cleared.
*Warning: Recursive process.nextTick calls starve the event loop, completely blocking I/O!*`,
    code: `Promise.resolve().then(() => console.log("2. Promise microtask"));
process.nextTick(() => console.log("1. nextTick (HIGHEST PRIORITY!)"));
// Output: 1. nextTick, 2. Promise microtask`
  },
  {
    id: 90,
    topicId: 6,
    difficulty: "Intermediate",
    category: "Async Concurrency",
    question: "What is the difference between sequential await and Promise.all concurrency?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Sequential \`await\`**: Requests execute serially one after another, creating a network latency waterfall: $\\text{Total Time} = T_1 + T_2$. Use only when request 2 depends on data from request 1.
• **\`Promise.all()\`**: Dispatches all requests in parallel concurrently: $\\text{Total Time} = \\max(T_1, T_2)$. Drastically reduces total response time for independent data.`,
    code: `// Waterfall (Slow):
const user = await fetchUser();
const cart = await fetchCart();

// Concurrent (Fast):
const [user, cart] = await Promise.all([fetchUser(), fetchCart()]);`
  },

  // TOPIC 7: ES6+, Modules, Errors & Memory (Q91–105)
  {
    id: 91,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Modules",
    question: "What is the difference between CommonJS (CJS) and ES Modules (ESM)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **CommonJS (\`require\` / \`module.exports\`)**: The traditional Node.js module system. Modules are loaded **synchronously at runtime**. Imports return a **value copy** of exported bindings.
• **ES Modules (\`import\` / \`export\`)**: The official ECMAScript standard. Modules are parsed **asynchronously and statically analyzed at compile-time**. Imports create **live read-only bindings** to the exported variables. Enables tree-shaking.`,
    table: {
      headers: ["Feature", "CommonJS (CJS)", "ES Modules (ESM)"],
      rows: [
        ["Syntax", "const m = require('m')", "import m from 'm'"],
        ["Loading", "Synchronous at runtime", "Asynchronous static analysis"],
        ["Bindings", "Copied values", "Live read-only bindings"],
        ["Tree-Shaking", "No", "Yes (Statically optimizable)"],
        ["Top-Level Await", "No", "Yes (Supported in ES2022)"]
      ]
    }
  },
  {
    id: 92,
    topicId: 7,
    difficulty: "Senior",
    category: "Modules",
    question: "What are live bindings in ES Modules vs value copies in CommonJS?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In CommonJS, \`require()\` imports a shallow copy of the exported value at the time of export. If the exporting module later updates that variable internally, the importing module continues to see the old stale value.
In ES Modules, \`import\` creates a **live pointer binding** to the exported variable. When the exporting module updates the variable internally, the importing module immediately observes the updated value!`,
    code: `// In ESM:
// counter.js: export let count = 1; export const increment = () => count++;
// main.js: import { count, increment } from './counter.js';
// increment(); console.log(count); // 2 (Live binding reflects update!)`
  },
  {
    id: 93,
    topicId: 7,
    difficulty: "Junior",
    category: "Modules",
    question: "What is the difference between named exports and default exports?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Named Exports (\`export const x\`)**: Multiple per module. Must be imported using exact matching names in curly braces \`import { x }\` (or renamed with \`as\`). Better for tooling and tree-shaking.
• **Default Export (\`export default x\`)**: Exactly one per module. Can be imported with any arbitrary identifier without curly braces (\`import myName from './mod'\`).`,
    code: `export const auth = {};
export const logger = {};
export default class App {}`
  },
  {
    id: 94,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Modules",
    question: "What is dynamic import() and when should it be used?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`import(specifier)\` is a function-like expression that loads an ES module dynamically and asynchronously, returning a Promise that resolves to the module namespace.
• **Use Cases**:
  1. **Code-Splitting in React**: Lazy loading route components (\`React.lazy(() => import('./Dashboard'))\`).
  2. **Conditional Loading**: Loading heavy libraries (e.g. chart library, PDF generator) only when the user clicks a button.`,
    code: `async function openAdminPanel() {
  const { AdminPanel } = await import("./AdminPanel.js");
  AdminPanel.render();
}`
  },
  {
    id: 95,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Modern JS",
    question: "What is Top-Level Await in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Introduced in ES2022, **Top-Level Await** allows the \`await\` keyword to be used at the top level of an ES Module outside of any \`async function\`. It blocks the execution of dependent importing modules until the asynchronous initialization (e.g. database connection or dynamic config fetch) settles.`,
    code: `// db.js (ES Module):
export const connection = await createDbConnection();`
  },
  {
    id: 96,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Bundling & Performance",
    question: "What is tree-shaking and what module system is required for it to work?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Tree-shaking** is a dead-code elimination technique used by modern bundlers (Vite, Rollup, Webpack) that strips unused exports from the final production bundle.
• **Prerequisite**: Requires **ES Modules (\`import\`/\`export\`)** because their static module structure allows the bundler to determine exactly which exports are used at compile-time without executing the code. CommonJS dynamic \`require()\` cannot be reliably tree-shaken.`,
    code: `// Only 'formatCurrency' is bundled; 'calculateMortgage' is tree-shaken away:
import { formatCurrency } from "./utils.js";`
  },
  {
    id: 97,
    topicId: 7,
    difficulty: "Junior",
    category: "Error Handling",
    question: "How does try/catch/finally work and why does synchronous try/catch fail on async code?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A synchronous \`try/catch\` block only catches exceptions thrown during the execution of its current synchronous Call Stack. If an asynchronous callback (e.g. inside \`setTimeout\`) throws an error, the \`try/catch\` block has already finished executing and exited the stack hours ago!
• **Solution**: Use \`async/await\` with \`try/catch\`, or attach \`.catch()\` to Promises.`,
    code: `// BROKEN: try/catch does NOT catch unawaited async callback:
try {
  setTimeout(() => {
    // throw new Error("Boom"); // Uncaught exception!
  }, 100);
} catch (e) {
  // Never reaches here!
}`
  },
  {
    id: 98,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Error Handling",
    question: "How do you create custom Error classes in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Extend the built-in \`Error\` class, pass the message to \`super(message)\`, and set \`this.name = this.constructor.name\`. In Node.js, call \`Error.captureStackTrace(this, this.constructor)\` to maintain a clean stack trace.`,
    code: `class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404);
  }
}`
  },
  {
    id: 99,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Memory Management",
    question: "How does the V8 Memory Heap differ from the Call Stack?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Call Stack**: Fixed, contiguous memory region managed automatically in LIFO order by CPU instructions. Fast allocation. Stores execution context frames, function return addresses, and small primitive variables.
• **Memory Heap**: Large, unstructured pool of dynamic memory. Slower allocation. Stores reference types (Objects, Arrays, Closures). Managed by the V8 Garbage Collector.`,
    code: `// Stack: primitive 'id' and pointer 'user'
// Heap: object data { name: "Sameer" }
const id = 101;
const user = { name: "Sameer" };`
  },
  {
    id: 100,
    topicId: 7,
    difficulty: "Senior",
    category: "V8 Internals & GC",
    question: "How does V8 Generational Garbage Collection work (Scavenger nursery vs Mark-Sweep old space)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
V8 uses a **Generational Garbage Collector** based on the hypothesis that most objects die young.
• **New Space (Nursery)**: Small area (1–64MB) for new allocations. Collected frequently using the ultra-fast **Scavenge algorithm (Cheney's copying algorithm)**: surviving objects are evacuated to a fresh semi-space.
• **Old Space**: Objects that survive two GC cycles are promoted to Old Space. Collected via the **Mark-Sweep-Compact** algorithm: marks reachable objects from GC roots, sweeps dead memory, and compacts fragmented blocks.`,
    code: `// Short-lived allocations live and die in New Space:
function processChunk() {
  const tempBuffer = new Array(100).fill(0); // Scavenged quickly!
}`
  },
  {
    id: 101,
    topicId: 7,
    difficulty: "Senior",
    category: "Memory Leaks",
    question: "What are the top 5 memory leak vectors in JavaScript applications?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
1. **Uncleared \`setInterval\` / \`setTimeout\`**: Retains closed-over variables indefinitely.
2. **Dangling Event Listeners**: Adding listeners to \`window\` or \`document\` without removing them in component unmount cleanups.
3. **Unbounded In-Memory Caches**: Storing items in a \`Map\` or array without an eviction policy (LRU / TTL).
4. **Detached DOM Nodes**: Keeping references to deleted DOM nodes in JavaScript variables.
5. **Accidental Globals**: Assigning to undeclared variables in non-strict mode.`,
    code: `// Leak:
function subscribe() {
  const hugeData = new Array(1000000).fill("data");
  window.addEventListener("resize", () => console.log(hugeData.length));
  // FIX: Must removeEventListener on cleanup!
}`
  },
  {
    id: 102,
    topicId: 7,
    difficulty: "Senior",
    category: "Debugging & Profiling",
    question: "How do you diagnose and isolate a memory leak using Chrome DevTools Heap Snapshots?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Follow the 4-step diagnostic protocol:
1. Open DevTools -> **Memory** tab -> click trash icon to force GC -> take **Snapshot 1** (Baseline).
2. Repeat the target action 20 times (e.g. open and close modal).
3. Force GC again -> take **Snapshot 2**.
4. Switch view to **Comparison** against Snapshot 1. Sort by **# Delta** and **Alloc. Size**. Inspect the **Retainers Tree** for *Detached DOM Elements* or closed-over scopes.`,
    tip: "In interviews, emphasize establishing a baseline and taking comparative snapshots with forced GC."
  },
  {
    id: 103,
    topicId: 7,
    difficulty: "Intermediate",
    category: "Metaprogramming",
    question: "What are Proxy and Reflect in JavaScript and what are their use cases?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`Proxy\`**: Wraps a target object and intercepts fundamental language operations (property lookup, assignment, enumeration, function invocation) using **traps** (\`get\`, \`set\`, \`has\`, \`deleteProperty\`).
• **\`Reflect\`**: Built-in object providing default forwardable implementations of all proxy traps.
• **Use Cases**: Reactive state systems (Vue 3 reactivity), schema validation, logging, and access control.`,
    code: `const validator = {
  set(target, prop, value) {
    if (prop === "age" && (typeof value !== "number" || value < 0)) {
      throw new TypeError("Age must be a positive number");
    }
    return Reflect.set(target, prop, value);
  }
};
const user = new Proxy({}, validator);
user.age = 25; // Works
// user.age = -5; // Throws TypeError!`
  },
  {
    id: 104,
    topicId: 7,
    difficulty: "Junior",
    category: "Modern Operators",
    question: "What is Optional Chaining (?.) and how does it prevent runtime crashes?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Optional Chaining (\`?.\`) evaluates property access, array indexing (\`?.[index]\`), or function calls (\`?.()\`). If the target before \`?.\` is \`null\` or \`undefined\`, it short-circuits evaluation and immediately returns \`undefined\`, avoiding \`TypeError: Cannot read properties of undefined\`.`,
    code: `const user = { profile: null };
console.log(user.profile?.address?.zip); // undefined (No TypeError!)
const onSave = null;
onSave?.(); // Safe no-op!`
  },
  {
    id: 105,
    topicId: 7,
    difficulty: "Junior",
    category: "Modern Operators",
    question: "What are Logical Assignment Operators (??=, ||=, &&=)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Introduced in ES2021, they combine logical operations with assignment:
• \`x ??= y\`: Assigns \`y\` ONLY if \`x\` is \`null\` or \`undefined\`.
• \`x ||= y\`: Assigns \`y\` ONLY if \`x\` is falsy.
• \`x &&= y\`: Assigns \`y\` ONLY if \`x\` is truthy.`,
    code: `const config = { timeout: 0 };
config.timeout ??= 5000; // Remains 0 (0 is not nullish!)
config.retries ??= 3;    // Becomes 3`
  },

  // TOPIC 8: Output Prediction & Debugging (Q106–120)
  {
    id: 106,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Hoisting precedence between function declarations and var.",
    answer: `### Predicted Output
\`\`\`
function
10
\`\`\`
### Step-by-Step Execution Breakdown
1. **Creation Phase**: Function declaration \`foo\` is hoisted with its full body. \`var foo\` declaration is ignored because identifier \`foo\` is already registered.
2. At first \`console.log(typeof foo)\`, \`foo\` is still the function.
3. \`foo = 10\` executes, reassigning \`foo\` to a Number.
4. Second \`console.log(foo)\` prints \`10\`.`,
    code: `console.log(typeof foo);
var foo = 10;
function foo() {}
console.log(foo);`
  },
  {
    id: 107,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Asynchronous loop with var vs let in setTimeout.",
    answer: `### Predicted Output
\`\`\`
3
3
3
0
1
2
\`\`\`
### Step-by-Step Execution Breakdown
• **Loop 1 (var)**: \`var i\` creates ONE shared function-scoped variable. All 3 timer callbacks execute after the loop finishes, when \`i === 3\`.
• **Loop 2 (let)**: \`let j\` creates a NEW lexical binding for every iteration. Each closure captures its own distinct copy of \`j\` (\`0\`, \`1\`, \`2\`).`,
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}`
  },
  {
    id: 108,
    topicId: 8,
    difficulty: "Senior",
    category: "Output Prediction",
    question: "Output Prediction: Complete Event Loop order (Sync, Promise, Timeout, Microtask).",
    answer: `### Predicted Output
\`\`\`
1
5
3
4
2
\`\`\`
### Step-by-Step Execution Breakdown
1. Synchronous: \`console.log("1")\` prints \`1\`.
2. \`setTimeout\` is registered with Web APIs; callback placed on Macrotask Queue.
3. \`Promise.resolve().then()\` callback placed on Microtask Queue.
4. Synchronous: \`console.log("5")\` prints \`5\`. Call Stack is now empty!
5. Microtask queue drains: prints \`3\`, returns another promise which queues microtask \`4\`.
6. Microtask \`4\` prints \`4\`. Microtask queue is now empty.
7. Event loop picks Macrotask: \`setTimeout\` callback executes and prints \`2\`.`,
    code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));
console.log("5");`
  },
  {
    id: 109,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: this binding with regular method vs arrow method.",
    answer: `### Predicted Output
\`\`\`
Sameer
undefined
\`\`\`
### Step-by-Step Execution Breakdown
• \`user.regular()\`: Called as method of \`user\` (Implicit Binding). \`this\` points to \`user\`, printing \`"Sameer"\`.
• \`user.arrow()\`: Arrow functions have no \`this\`. It resolves \`this\` lexically from the enclosing scope where the object was created (the global window/module), printing \`undefined\`.`,
    code: `const user = {
  name: "Sameer",
  regular() { return this.name; },
  arrow: () => this?.name
};
console.log(user.regular());
console.log(user.arrow());`
  },
  {
    id: 110,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Object references and mutation.",
    answer: `### Predicted Output
\`\`\`
{ count: 2 }
{ count: 2 }
\`\`\`
### Step-by-Step Execution Breakdown
\`b = a\` copies the memory reference pointer. Both \`a\` and \`b\` point to the exact same object in the heap. Incrementing \`b.count\` mutates that shared heap object, so both log \`{ count: 2 }\`.`,
    code: `const a = { count: 1 };
const b = a;
b.count = 2;
console.log(a);
console.log(b);`
  },
  {
    id: 111,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Type coercion with +, -, [], and {}.",
    answer: `### Predicted Output
\`\`\`
""
"[object Object]"
"[object Object]"
NaN
\`\`\`
### Step-by-Step Execution Breakdown
1. \`[] + []\`: Both arrays coerce to empty strings via \`.toString()\`: \`"" + "" = ""\`.
2. \`[] + {}\`: \`[]\` becomes \`""\`; \`{}\` becomes \`"[object Object]"\`.
3. \`{} + []\`: In expression position, coercing gives \`"[object Object]"\`.
4. \`{} - []\`: Minus operator forces numeric conversion. \`Number({})\` is \`NaN\`. \`NaN - 0 = NaN\`.`,
    code: `console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log({} - []);`
  },
  {
    id: 112,
    topicId: 8,
    difficulty: "Junior",
    category: "Output Prediction",
    question: "Output Prediction: Equality comparisons with NaN and zeros.",
    answer: `### Predicted Output
\`\`\`
false
true
true
false
\`\`\`
### Step-by-Step Execution Breakdown
1. \`NaN === NaN\`: \`false\` per IEEE 754.
2. \`Object.is(NaN, NaN)\`: \`true\`.
3. \`+0 === -0\`: \`true\` per strict equality.
4. \`Object.is(+0, -0)\`: \`false\` because their sign bits differ.`,
    code: `console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(+0 === -0);
console.log(Object.is(+0, -0));`
  },
  {
    id: 113,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Promise catch recovery and subsequent then.",
    answer: `### Predicted Output
\`\`\`
Caught: Error 1
Recovered: Fallback Data
\`\`\`
### Step-by-Step Execution Breakdown
1. \`Promise.reject("Error 1")\` triggers the \`.catch()\` block.
2. The \`.catch()\` logs the error and returns \`"Fallback Data"\`.
3. Because \`.catch()\` returned normally (without re-throwing), the returned promise fulfills with \`"Fallback Data"\`.
4. The subsequent \`.then()\` runs normally!`,
    code: `Promise.reject("Error 1")
  .catch(err => {
    console.log("Caught:", err);
    return "Fallback Data";
  })
  .then(val => {
    console.log("Recovered:", val);
  });`
  },
  {
    id: 114,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Output Prediction",
    question: "Output Prediction: Temporal Dead Zone in a nested block.",
    answer: `### Predicted Output
\`\`\`
ReferenceError: Cannot access 'x' before initialization
\`\`\`
### Step-by-Step Execution Breakdown
Even though \`const x = 10\` exists in the outer scope, inside the block \`{ let x = x + 5; }\`, the inner declaration \`let x\` hoists to the top of the block and shadows the outer \`x\`. Evaluating the right-hand side \`x + 5\` accesses the inner \`x\` while it is still in the TDZ, throwing a \`ReferenceError\`!`,
    code: `const x = 10;
{
  // let x = x + 5; // ReferenceError!
}`
  },
  {
    id: 115,
    topicId: 8,
    difficulty: "Junior",
    category: "Output Prediction",
    question: "Output Prediction: Array sort on integers without comparator callback.",
    answer: `### Predicted Output
\`\`\`
[1, 10, 2, 25, 5]
\`\`\`
### Step-by-Step Execution Breakdown
\`sort()\` converts all numbers to strings: \`"1", "10", "2", "25", "5"\`. It compares character by character: \`"10"\` comes before \`"2"\` because character \`'1'\` precedes \`'2'\` in Unicode. Always provide \`(a, b) => a - b\`!`,
    code: `const nums = [10, 5, 25, 1, 2];
nums.sort();
console.log(nums);`
  },
  {
    id: 116,
    topicId: 8,
    difficulty: "Senior",
    category: "Debugging",
    question: "Debugging Scenario: Why does a React component re-render infinitely with useEffect?",
    answer: `### 1. Root Cause Analysis
An infinite loop in \`useEffect\` occurs when an **unmemoized reference type (Object, Array, or Function)** is declared inside the component body and included in the \`useEffect\` dependency array:
1. Component renders -> creates a brand new object in heap (new memory pointer).
2. \`useEffect\` runs shallow comparison on dependencies: \`prevObj !== newObj\`.
3. Effect executes and updates state -> triggers re-render -> repeat infinitely!

### 2. Solutions
1. Move the object outside the component if it is static.
2. Wrap the object with \`useMemo\` or function with \`useCallback\`.
3. Pass primitive property values instead of the entire object.`,
    code: `// BUGGY:
// const options = { filter: "active" }; // New reference every render!
// useEffect(() => { fetchData(options); }, [options]);

// FIXED:
const options = useMemo(() => ({ filter: "active" }), []);
useEffect(() => { fetchData(options); }, [options]);`
  },
  {
    id: 117,
    topicId: 8,
    difficulty: "Junior",
    category: "Debugging",
    question: "Debugging Scenario: Why does a function return '[object Promise]' instead of data?",
    answer: `### 1. Root Cause Analysis
Any function marked with the \`async\` keyword **always returns a Promise**, even if you return a primitive value inside. If the caller does not use \`await\` or \`.then()\`, they receive the unsettled Promise object itself. Printing or stringifying an unawaited promise logs \`"[object Promise]"\`.
• **Fix**: Add \`await\` before invoking the async function.`,
    code: `async function getName() { return "Sameer"; }

// Bug:
console.log("Hello " + getName()); // "Hello [object Promise]"

// Fix:
const name = await getName();
console.log("Hello " + name);      // "Hello Sameer"`
  },
  {
    id: 118,
    topicId: 8,
    difficulty: "Intermediate",
    category: "Debugging",
    question: "Debugging Scenario: Why does fetch() not reject when an API returns HTTP 404 or 500?",
    answer: `### 1. Root Cause Analysis
By specification, the native \`fetch()\` API rejects a Promise **ONLY on network failures or CORS misconfigurations** (e.g. no internet connection or server unreachable). It does NOT reject on HTTP error status codes like 404 Not Found or 500 Internal Server Error.
• **Fix**: Always check \`response.ok\` (which is true for 200–299 status codes) and throw manually.`,
    code: `async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(\`HTTP error! status: \${res.status}\`);
  }
  return await res.json();
}`
  },
  {
    id: 119,
    topicId: 8,
    difficulty: "Senior",
    category: "Debugging",
    question: "Debugging Scenario: Why does a memory leak occur with window.addEventListener?",
    answer: `### 1. Root Cause Analysis
When an event listener is attached to \`window\` or \`document\`, the browser's native event dispatch table holds a strong reference to the callback function. If that callback closes over component state or large arrays, none of that memory can be garbage collected even after the component unmounts.
• **Fix**: Always retain a reference to the exact callback function and invoke \`window.removeEventListener(event, callback)\` during component unmount cleanups!`,
    code: `// React Cleanup Fix:
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize); // Cleanup!
}, []);`
  },
  {
    id: 120,
    topicId: 8,
    difficulty: "Staff",
    category: "Senior Methodology",
    question: "Senior Debugging Playbook: The 8-Step Framework for isolating and fixing production bugs.",
    answer: `### The 8-Step Senior Diagnostic Framework
1. **Reproduce with Minimal Payload**: Reproduce the defect deterministically using minimal inputs in an isolated sandbox.
2. **Triangulate Boundaries**: Inspect network payloads, headers, console errors, and database logs to determine if failure is Frontend, Backend, or Gateway.
3. **Capture Telemetry**: Check error tracing (Sentry), APM metrics, and user session replay.
4. **Isolate Root Cause vs Symptom**: Do not apply naive null-checks (\`a?.b?.c\`) to suppress errors; diagnose why the contract broke.
5. **Inspect State & Scope**: Check Call Stack frames, closures, and network timing waterfalls.
6. **Formulate Hypothesis & Minimal Fix**: Implement architectural correction.
7. **Write Automated Regression Tests**: Write unit/integration tests that fail on the bug and pass on the fix.
8. **Verify Canary Deployment**: Monitor production telemetry for error rate flatline.`,
    tip: "In senior interviews, structure debugging answers using this rigorous engineering methodology."
  }
];
