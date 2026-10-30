// scratch/js_q_batch_1.cjs - Questions 1 to 40
module.exports = [
  {
    id: 1,
    topicId: 1,
    difficulty: "Junior",
    category: "Fundamentals",
    question: "What is JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
JavaScript is a high-level, dynamically typed, multi-paradigm programming language conforming to the ECMAScript standard. It is single-threaded on its primary call stack but achieves high-throughput non-blocking asynchronous concurrency via host runtime APIs (Browser Web APIs or Node.js Libuv). It supports prototype-based object inheritance, first-class functions, and functional programming patterns.

### 2. Detailed Technical Explanation & Mental Model
JavaScript code runs inside a host execution environment. The engine (e.g. Google V8, Apple JavaScriptCore, Mozilla SpiderMonkey) parses source code into an Abstract Syntax Tree (AST), translates it into bytecode, and uses Just-In-Time (JIT) compilation to generate machine instructions.
• **Paradigms Supported**: Procedural, Object-Oriented (prototypal), Functional (pure functions, closures, composition), and Event-Driven.

### 3. Internal Working & Engine Mechanics
• **V8 Engine**: Uses **Ignition** (an interpreter that outputs bytecode with low startup latency) and **TurboFan** (an optimizing compiler that compiles hot loops into optimized machine code based on runtime type feedback).
• **Memory**: Primitives are allocated on the Call Stack; complex reference types (Objects, Arrays, Closures) reside on the Memory Heap.

### 4. Practical Real-World Context
In enterprise full-stack development, JavaScript allows isomorphic code sharing between frontend (React / Next.js) and backend (Node.js / Express / NestJS), sharing data validation schemas (Zod), TypeScript types, and utility functions.

### 5. Trade-offs & Pitfalls
• **Advantage**: Extreme developer velocity, ubiquitous ecosystem (npm), universal browser support.
• **Pitfall**: Dynamic typing can mask runtime type errors (e.g. \`undefined is not a function\`) in large codebases without strict TypeScript or runtime schema validation.

### 6. Follow-Up Questions with Answers
• **Q: What is the difference between ECMAScript and JavaScript?**
  *A: ECMAScript is the official specification standard (ECMA-262); JavaScript is the actual dialect and runtime implementation created by vendors.*
• **Q: Is JavaScript compiled or interpreted?**
  *A: It is both. Modern engines use JIT compilation: interpreting bytecode immediately for fast startup, then compiling frequently invoked hot functions to machine code.*`,
    code: `// Universal First-Class Function Example:
const calculateTax = (rate) => (amount) => amount * (1 + rate);
const standardVAT = calculateTax(0.20); // 20% VAT
console.log(standardVAT(100)); // 120`
  },
  {
    id: 2,
    topicId: 1,
    difficulty: "Junior",
    category: "Type System",
    question: "What are the seven primitive data types in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
JavaScript has seven primitive types: **String, Number, BigInt, Boolean, Undefined, Symbol, and Null**. Primitives represent atomic, immutable values stored directly by value on the Call Stack (or as inline V8 values). All other data types (Objects, Arrays, Functions, Maps, Sets) are mutable reference types stored on the Memory Heap.

### 2. Detailed Technical Explanation
• **Primitives are immutable**: You cannot mutate a primitive value in place. Any string or number operation produces a fresh value.
• **Comparison by Value**: Two primitives with identical values are strictly equal (\`"hello" === "hello"\`).
• **Object Wrappers**: When accessing methods on strings or numbers (e.g. \`"text".toUpperCase()\`), JavaScript temporarily auto-boxes the primitive into an internal wrapper object (\`new String()\`), invokes the method, and immediately discards the wrapper for garbage collection.

### 3. Internal Working & Engine Mechanics
In the V8 engine, small integers are stored as **Smi (Small Integers)** directly within pointer words without heap allocation. Floating-point numbers and strings are allocated with compact memory descriptors.

### 4. Trade-offs & Common Pitfalls
• **The typeof null Bug**: \`typeof null\` returns \`"object"\`. This is a legacy specification bug from JavaScript 1.0 (where the type tag for object references was 000, which null matched) that cannot be fixed without breaking existing websites!

### 5. Follow-Up Questions with Answers
• **Q: Is null an object?**
  *A: No. null is an immutable primitive representing the deliberate absence of an object value. typeof null returning 'object' is a historical spec defect.*
• **Q: What is the difference between Number and BigInt?**
  *A: Number is a 64-bit float with safe integers up to 2^53 - 1. BigInt supports arbitrary-precision integers of unlimited size.*`,
    table: {
      headers: ["Primitive Type", "Example", "typeof Output", "Immutability"],
      rows: [
        ["string", '"production"', '"string"', "Immutable"],
        ["number", "42, 3.14, NaN", '"number"', "Immutable"],
        ["bigint", "9007199254740995n", '"bigint"', "Immutable"],
        ["boolean", "true, false", '"boolean"', "Immutable"],
        ["undefined", "undefined", '"undefined"', "Immutable"],
        ["symbol", 'Symbol("id")', '"symbol"', "Immutable"],
        ["null", "null", '"object" (bug)', "Immutable"]
      ]
    }
  },
  {
    id: 3,
    topicId: 1,
    difficulty: "Intermediate",
    category: "Memory & References",
    question: "What is the difference between primitive and reference values in memory?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Primitive values are immutable data types stored by value directly on the execution Call Stack. Reference values (Objects, Arrays, Functions) are mutable data structures allocated on the Memory Heap; variables holding an object do not store the object data itself, but rather a memory pointer (address reference) to the heap location.

### 2. Detailed Technical Explanation
• **Assignment Behavior**: Copying a primitive copies the literal value. Copying an object copies only the pointer reference, meaning both variables alias and mutate the exact same heap record!
• **Argument Passing**: JavaScript is strictly **call-by-value**. However, when an object is passed into a function, the value passed IS the memory reference pointer. Modifying a property inside the function mutates the external object, but reassigning the parameter variable does not rebind the caller's variable.

### 3. Internal Working & Memory Flow
\`\`\`
Call Stack               Memory Heap
[ a = 10 ]               
[ userPtr ] ---------> { name: "Sameer", balance: 1000 }
\`\`\`

### 4. Real-World Full-Stack Context
In React and Redux state management, mutating reference values directly causes silent bugs where components fail to re-render because shallow reference equality checks (\`prevProps === nextProps\`) report that the reference hasn't changed.

### 5. Follow-Up Questions with Answers
• **Q: Does JavaScript have pass-by-reference?**
  *A: No. JavaScript is strictly pass-by-value. For objects, the reference pointer itself is copied and passed by value.*
• **Q: How do you prevent shared mutation in React state?**
  *A: By treating state as immutable and using shallow copying (\`{ ...state, updatedProp }\`) or deep cloning with \`structuredClone()\`. *`,
    code: `// Primitive Copy by Value:
let x = 10;
let y = x;
y = 20;
console.log(x); // 10 (untouched)

// Reference Copy by Pointer:
const accountA = { balance: 500 };
const accountB = accountA; // Shared heap reference
accountB.balance = 999;
console.log(accountA.balance); // 999 (mutated via shared reference!)`
  },
  {
    id: 4,
    topicId: 1,
    difficulty: "Junior",
    category: "Fundamentals",
    question: "What is the difference between undefined, null, and undeclared variables?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **undefined**: Indicates that a variable has been declared in a scope, but has not yet been initialized with a value. Also returned for missing object properties and unreturned function results.
• **null**: An intentional assignment representing the deliberate absence of any object value.
• **undeclared**: A variable identifier that has never been registered in any enclosing lexical environment; reading it throws a runtime \`ReferenceError\`.

### 2. Internal Working
• During scope creation, variables declared with \`var\` are initialized to \`undefined\` by default in the Environment Record.
• \`null\` is never set automatically by the engine; it is strictly a developer-assigned sentinel value.

### 3. Practical Production Pattern
Use \`null\` in API payloads (JSON) to represent an empty field (e.g. \`middleName: null\`), while reserving \`undefined\` for optional parameters and default argument triggers.

### 4. Follow-Up Questions with Answers
• **Q: What does null == undefined and null === undefined evaluate to?**
  *A: null == undefined is true (loose equality coercion rule). null === undefined is false (type mismatch: object/primitive vs undefined).*
• **Q: What happens if you assign to an undeclared variable in strict mode?**
  *A: It throws a ReferenceError. In non-strict mode, it creates an accidental global variable on window.*`,
    code: `let declared;
console.log(declared); // undefined

const customer = { profile: null }; // Intentionally empty
console.log(customer.profile);      // null

// console.log(undeclaredVar);       // ReferenceError: undeclaredVar is not defined`
  },
  {
    id: 5,
    topicId: 1,
    difficulty: "Junior",
    category: "Type System",
    question: "What does typeof do and what are its historical limitations?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`typeof\` is a unary operator that evaluates an unevaluated operand and returns a string indicating its data type. While reliable for primitives, it has well-documented historical quirks: it returns \`"object"\` for \`null\`, \`[]\`, \`{}\`, and \`new Date()\`.

### 2. Key typeof Edge Cases
1. \`typeof null === "object"\` (Engine spec defect).
2. \`typeof [] === "object"\` (Arrays are objects; use \`Array.isArray(arr)\`).
3. \`typeof NaN === "number"\` (NaN is an IEEE 754 float numeric value).
4. \`typeof function() {} === "function"\` (Functions are callable objects, specially tagged).
5. \`typeof undeclaredVar === "undefined"\` (Safe check without throwing ReferenceError!).

### 3. Robust Type Checking Pattern
For rock-solid production type checking of reference types, use \`Object.prototype.toString.call(val)\`:
• \`Object.prototype.toString.call([])\` -> \`"[object Array]"\`
• \`Object.prototype.toString.call(null)\` -> \`"[object Null]"\`
• \`Object.prototype.toString.call(new Date())\` -> \`"[object Date]"\``,
    code: `console.log(typeof "hello");    // "string"
console.log(typeof 42);         // "number"
console.log(typeof 10n);        // "bigint"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof Symbol());   // "symbol"
console.log(typeof null);       // "object" <-- Trap!
console.log(typeof []);         // "object" <-- Use Array.isArray()!
console.log(typeof (() => {})); // "function"`
  },
  {
    id: 6,
    topicId: 1,
    difficulty: "Junior",
    category: "Coercion & Equality",
    question: "What is the difference between == and === and Object.is()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`==\` (Abstract / Loose Equality)**: Compares values after coercing operands to a common type using the ECMAScript Abstract Equality algorithm.
• **\`===\` (Strict Equality)**: Compares both type and value without coercion. If types differ, returns \`false\` immediately.
• **\`Object.is(a, b)\` (Same-Value Equality)**: Behave identically to \`===\`, except it correctly distinguishes \`+0\` from \`-0\` and treats \`NaN\` as equal to \`NaN\`.

### 2. Internal Mechanics & IEEE 754 Quirks
Under strict equality:
• \`NaN === NaN\` evaluates to \`false\` because IEEE 754 states NaN is not equal to any value, including itself.
• \`+0 === -0\` evaluates to \`true\` even though their sign bits differ.
React uses \`Object.is()\` in its reconciliation engine (\`useState\` and \`memo\`) to accurately detect state changes.

### 3. Production Recommendation
Default to \`===\` across all application code. The only common exception is \`val == null\`, which cleanly checks for both \`null\` and \`undefined\` simultaneously.`,
    code: `// Loose vs Strict:
console.log(5 == "5");           // true (string coerced to number)
console.log(5 === "5");          // false (type mismatch)

// Strict vs Object.is:
console.log(NaN === NaN);        // false
console.log(Object.is(NaN, NaN));// true

console.log(+0 === -0);          // true
console.log(Object.is(+0, -0));  // false`
  },
  {
    id: 7,
    topicId: 1,
    difficulty: "Intermediate",
    category: "Coercion",
    question: "How does type coercion work in JavaScript (Implicit vs Explicit)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Type coercion is the conversion of a value from one type to another. It is **explicit** when triggered intentionally via constructors like \`Number()\`, \`String()\`, or \`Boolean()\`. It is **implicit** when triggered automatically by operators (\`+\`, \`-\`, \`!\`) or truthy/falsy evaluation contexts.

### 2. Core Operator Coercion Rules
1. **The \`+\` Operator**: If EITHER operand is a string, it converts both to strings and performs concatenation.
2. **Mathematical Operators (\`-\`, \`*\`, \`/\`)**: Coerces both operands to numbers.
3. **Objects to Primitives**: The engine invokes the object's internal \`[Symbol.toPrimitive](hint)\`, falling back to \`.valueOf()\` and \`.toString()\`.

### 3. Production Pitfall
Implicit coercion is a frequent source of bugs in financial calculations and form validations where numeric user inputs arrive as strings from HTML input fields (e.g. \`"10" + 5 = "105"\`). Always parse explicitly!`,
    code: `// Implicit Coercion:
console.log("10" + 5);  // "105" (String concatenation)
console.log("10" - 5);  // 5     (Numeric coercion)
console.log(true + 2);  // 3     (true -> 1)
console.log([] + {});   // "[object Object]"
console.log([] + []);   // ""

// Explicit Coercion (Production Best Practice):
const rawInput = "42";
const count = Number(rawInput); // 42
const text = String(100);       // "100"`
  },
  {
    id: 8,
    topicId: 1,
    difficulty: "Junior",
    category: "Type System",
    question: "What are truthy and falsy values in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In JavaScript, any value evaluated in a boolean context (such as an \`if\` statement or logical operator) is coerced to either \`true\` or \`false\`. There are **precisely 8 falsy values** in ECMAScript. **Every other value in the language is truthy**, including empty arrays and empty objects!

### 2. The 8 Falsy Values
1. \`false\`
2. \`0\`
3. \`-0\`
4. \`0n\` (BigInt zero)
5. \`""\` (empty string)
6. \`null\`
7. \`undefined\`
8. \`NaN\`

### 3. The Classic Senior Interview Trap
\`[]\` and \`{}\` are **truthy**! Many junior developers write \`if (users) { ... }\` expecting an empty array to be falsy.
• **Correct Array Check**: \`if (users && users.length > 0)\`
• **Correct Object Check**: \`if (obj && Object.keys(obj).length > 0)\``,
    code: `if ([]) console.log("Empty array is TRUTHY!"); // Prints!
if ({}) console.log("Empty object is TRUTHY!"); // Prints!
if ("0") console.log("'0' string is TRUTHY!");  // Prints!

console.log(Boolean(0));        // false
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(NaN));      // false`
  },
  {
    id: 9,
    topicId: 1,
    difficulty: "Junior",
    category: "Modern Operators",
    question: "What is the difference between || (Logical OR) and ?? (Nullish Coalescing)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`||\` (Logical OR)**: Returns the right-hand operand if the left operand is **ANY falsy value** (\`0\`, \`""\`, \`false\`, \`null\`, \`undefined\`, \`NaN\`).
• **\`??\` (Nullish Coalescing)**: Returns the right-hand operand **ONLY if the left operand is strictly nullish (\`null\` or \`undefined\`)**.

### 2. Real-World FinTech / UI Context
In configuration objects, scores, pagination limits, and balance thresholds, \`0\` or \`false\` are completely valid business values:
• \`const limit = userLimit || 10\`: If user chooses \`0\`, it overrides it to \`10\` (A severe bug!).
• \`const limit = userLimit ?? 10\`: If user chooses \`0\`, it correctly preserves \`0\`.`,
    code: `const animationDuration = 0; // 0ms is a valid instant duration!

const resultOR = animationDuration || 300; // 300 (BUG! 0 treated as missing)
const resultNC = animationDuration ?? 300; // 0 (CORRECT!)

const isEnabled = false;
const statusOR = isEnabled || true;        // true (BUG! false overwritten)
const statusNC = isEnabled ?? true;        // false (CORRECT!)`
  },
  {
    id: 10,
    topicId: 1,
    difficulty: "Junior",
    category: "Type System",
    question: "What is NaN, how does it behave, and how do you reliably test for it?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`NaN\` stands for "Not-a-Number". Despite its name, its type is technically \`"number"\`. It represents an unrepresentable or undefined mathematical result (e.g. \`0 / 0\` or \`Math.sqrt(-1)\`). Uniquely in JavaScript, **\`NaN\` is the only value not equal to itself (\`NaN === NaN\` is false)**.

### 2. How to Test for NaN
• **Never use \`===\`**: \`x === NaN\` is always \`false\`.
• **Avoid global \`isNaN(x)\`**: Coerces its argument to number before checking (\`isNaN("hello")\` is \`true\`).
• **Always use \`Number.isNaN(x)\`**: Checks if the value is strictly of type Number AND is exactly \`NaN\` without coercion!
• **Alternative**: \`Object.is(x, NaN)\` returns \`true\`.`,
    code: `console.log(typeof NaN);         // "number"
console.log(NaN === NaN);        // false

// The global isNaN trap:
console.log(isNaN("production"));        // true (coerced "production" to NaN)
console.log(Number.isNaN("production")); // false (no coercion, string is not NaN)
console.log(Number.isNaN(NaN));          // true`
  },
  {
    id: 11,
    topicId: 1,
    difficulty: "Junior",
    category: "Type System",
    question: "What is the difference between isNaN() and Number.isNaN()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Global \`isNaN(value)\`**: First attempts to convert the argument to a number via \`ToNumber\`, and then checks if the resulting value is \`NaN\`. This causes false positives on non-numeric strings (\`isNaN("abc") === true\`).
• **\`Number.isNaN(value)\` (ES6)**: Robust, strict check. It returns \`true\` **ONLY if the operand is already of type Number and its value is NaN**. No coercion occurs.

### 2. Follow-Up Interview Question
• **Q: How can you polyfill Number.isNaN in ES5?**
  *A: By exploiting the fact that NaN is the only value not equal to itself: \`function myIsNaN(val) { return val !== val; }\`*`,
    code: `// Polyfill demonstration:
function customIsNaN(val) {
  return val !== val; // Only true for NaN!
}
console.log(customIsNaN(NaN));     // true
console.log(customIsNaN("hello")); // false`
  },
  {
    id: 12,
    topicId: 1,
    difficulty: "Intermediate",
    category: "Precision & Arithmetic",
    question: "Why does 0.1 + 0.2 !== 0.3 in JavaScript, and how do you handle money in production?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
JavaScript numbers use 64-bit double-precision floating-point format adhering to the **IEEE 754 standard**. In base-2 binary, fractions like \`0.1\` (1/10) and \`0.2\` (1/5) have infinitely repeating fractional binary representations. When truncated to 53 bits of precision, minor rounding errors accumulate: \`0.1 + 0.2\` evaluates to \`0.30000000000000004\`.

### 2. Production FinTech Architecture
1. **Never use floating-point numbers for money**: A rounding discrepancy will cause financial audit failures.
2. **Store amounts in minor integer units**: Represent dollars as cents ($19.99 = \`1999\`) and rupees as paise. Integers up to 9 quadrillion are 100% exact.
3. **Use Decimal Libraries**: For complex interest calculations, use \`decimal.js\` or \`bignumber.js\`.
4. **Use Number.EPSILON for comparisons**: Check \`Math.abs(a - b) < Number.EPSILON\`.`,
    code: `console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// FinTech Integer Pattern:
const unitPriceInCents = 1999; // $19.99
const taxInCents = 160;        // $1.60
const totalCents = unitPriceInCents + taxInCents; // 2159 ($21.59)`
  },
  {
    id: 13,
    topicId: 1,
    difficulty: "Junior",
    category: "Type Conversion",
    question: "What is the difference between Number(), parseInt(), and parseFloat()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`Number(str)\`**: Strict conversion. Parses the entire string; if any invalid character is encountered, it aborts and returns \`NaN\` (except whitespace/empty string which becomes \`0\`).
• **\`parseInt(str, radix)\`**: Extracts an integer from the start of the string up to the first non-numeric character. Always specify radix (base 10)!
• **\`parseFloat(str)\`**: Extracts a floating-point number up to the first invalid character.`,
    code: `Number("42px");        // NaN (strict!)
parseInt("42px", 10);  // 42 (stops at 'p')
parseFloat("42.50rem");// 42.5

Number("");            // 0
parseInt("", 10);      // NaN`
  },
  {
    id: 14,
    topicId: 1,
    difficulty: "Intermediate",
    category: "Immutability",
    question: "What does immutability mean in JavaScript, and why is it essential?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Immutability means a value cannot be altered after its creation. In JavaScript, all primitive values are strictly immutable in memory. Objects and arrays are mutable reference types. In modern web frameworks like React, immutability is vital because state reconciliation relies on shallow reference comparison (\`prev !== next\`) to trigger UI updates without expensive deep-tree traversals.`,
    code: `// Primitive immutability:
let str = "hello";
str.toUpperCase();
console.log(str); // "hello" (original untouched)

// Immutable object update:
const user = { name: "Sameer", role: "admin" };
const updatedUser = { ...user, role: "superadmin" }; // Fresh memory reference!`
  },
  {
    id: 15,
    topicId: 1,
    difficulty: "Intermediate",
    category: "Object Mechanics",
    question: "What is the difference between Object.freeze() and const?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`const\`**: Protects the **variable binding identifier**. It prevents reassigning the variable to a new reference, but does NOT protect the internal properties of an object from mutation.
• **\`Object.freeze(obj)\`**: Protects the **object's properties in heap memory**. It makes the object shallowly immutable by marking all properties as \`writable: false\` and \`configurable: false\`. However, nested objects remain mutable unless recursively frozen!`,
    code: `const user = Object.freeze({
  name: "Sameer",
  address: { city: "Hyderabad" }
});

// user.name = "Ali"; // Silent failure or TypeError in strict mode
user.address.city = "Bangalore"; // MUTATES! Object.freeze is shallow.`
  },

  // TOPIC 2: Scope, Hoisting & Execution Context (Q16–30)
  {
    id: 16,
    topicId: 2,
    difficulty: "Junior",
    category: "Scope",
    question: "What is scope and what are the four scope levels in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Scope defines the visibility and accessibility of variables, functions, and objects in a specific region of code during execution. JavaScript has four primary scope levels:
1. **Global Scope**: Accessible everywhere.
2. **Module Scope**: Isolated per file in ES Modules (\`import\`/\`export\`).
3. **Function Scope**: Variables declared inside a function are private to that function (\`var\`, \`let\`, \`const\`).
4. **Block Scope**: Variables declared inside curly braces \`{ ... }\` using \`let\` or \`const\`.`,
    code: `function scopeExample() {
  if (true) {
    var funcScoped = "var leaks to function";
    let blockScoped = "let is contained in block";
  }
  console.log(funcScoped); // Accessible!
  // console.log(blockScoped); // ReferenceError!
}`
  },
  {
    id: 17,
    topicId: 2,
    difficulty: "Junior",
    category: "Variables",
    question: "What is the difference between var, let, and const?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`var\`**: Function-scoped (or global), hoisted and initialized to \`undefined\`, permits redeclaration, and attaches to \`window\` in classic browser scripts.
• **\`let\`**: Block-scoped, hoisted into the Temporal Dead Zone (TDZ) without initialization, permits reassignment but prohibits redeclaration within the same scope.
• **\`const\`**: Block-scoped, hoisted into TDZ, prohibits reassignment and redeclaration, and must be initialized upon declaration.`,
    table: {
      headers: ["Feature", "var", "let", "const"],
      rows: [
        ["Scope", "Function", "Block", "Block"],
        ["Reassignment", "Allowed", "Allowed", "TypeError"],
        ["Redeclaration", "Allowed", "SyntaxError", "SyntaxError"],
        ["Hoisting State", "Initialized to undefined", "TDZ (Uninitialized)", "TDZ (Uninitialized)"],
        ["Window Binding", "Attaches to window.x", "No", "No"]
      ]
    }
  },
  {
    id: 18,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Hoisting",
    question: "What is hoisting and how does the engine implement it internally?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Hoisting is JavaScript's compile-time mechanism where variable and function declarations are registered in memory within the current Lexical Environment record before code statements execute. It does NOT physically relocate source code lines.
• **Function Declarations**: Hoisted with their full body implementation.
• **\`var\` Declarations**: Hoisted and initialized immediately to \`undefined\`.
• **\`let\` and \`const\`**: Hoisted into the environment record but left in an uninitialized state (TDZ).`,
    code: `sayHello(); // "Hello from hoisted function!"
function sayHello() {
  console.log("Hello from hoisted function!");
}

console.log(count); // undefined
var count = 10;`
  },
  {
    id: 19,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Hoisting & TDZ",
    question: "Why does let throw a ReferenceError before declaration while var returns undefined?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
During the Creation Phase of the Execution Context, the engine registers both \`var\` and \`let\` in the Environment Record. However, the specification explicitly defines that \`var\` is bound to \`undefined\`, whereas \`let\` and \`const\` bindings remain in an **uninitialized state**. Accessing an uninitialized binding throws a \`ReferenceError\` by design to prevent accessing variables before their intended value is set.`,
    code: `// console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 42;`
  },
  {
    id: 20,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Hoisting & TDZ",
    question: "What is the Temporal Dead Zone (TDZ) and why was it introduced?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The **Temporal Dead Zone (TDZ)** is the time span between entering a scope and the actual statement line where a \`let\` or \`const\` variable is initialized. Accessing the variable during this window throws a \`ReferenceError\`.
• **Why it exists**:
  1. Catches bugs: Reading variables before assignment is almost always a programming mistake.
  2. Protects \`const\`: If \`const\` were initialized to \`undefined\`, its value would change upon evaluation, violating the immutable binding contract.`,
    code: `{
  // TDZ for score begins
  // console.log(score); // ReferenceError!
  let score = 100; // TDZ ends
  console.log(score); // 100
}`
  },
  {
    id: 21,
    topicId: 2,
    difficulty: "Junior",
    category: "Scope",
    question: "Is var always globally scoped?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
No. \`var\` is **function-scoped**. When declared inside a function body, it is completely contained within that function and inaccessible outside. It is only globally scoped when declared at the top level of a classic browser script. In modern ES Modules or Node.js files, top-level \`var\` is scoped to that specific module.`,
    code: `function privateVar() {
  var secret = "private";
}
privateVar();
console.log(typeof secret); // "undefined" (Does not leak outside!)`
  },
  {
    id: 22,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Scope Chain",
    question: "What is lexical scope?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Lexical scope** (also called static scope) means that variable resolution is determined by the **physical author-time nesting of functions and blocks in source code**, rather than by where or how functions are called at runtime (dynamic scope). An inner function has permanent access to variables in its outer enclosing scope based on where it was written.`,
    code: `const user = "Outer";

function printUser() {
  console.log(user); // Resolves lexically to "Outer"
}

function run() {
  const user = "Inner";
  printUser(); // Still logs "Outer"!
}
run();`
  },
  {
    id: 23,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Execution Context",
    question: "What is an Execution Context and what are its components?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An **Execution Context** is the internal environment specification where JavaScript code is evaluated and executed.
• **Components**:
  1. **LexicalEnvironment**: Holds \`let\`, \`const\`, and function declarations.
  2. **VariableEnvironment**: Holds \`var\` declarations.
  3. **Outer Reference**: Link to outer parent environment forming the Scope Chain.
  4. **this Binding**: Determined at call-time.
• **Lifecycle**: Creation Phase (allocations, hoisting) -> Execution Phase (line-by-line running).`,
    code: `// Every function invocation creates an Execution Context:
function authenticate(user) {
  const token = "JWT_SECURE";
  return token;
}`
  },
  {
    id: 24,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Call Stack",
    question: "What is the Call Stack and how does stack overflow happen?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The **Call Stack** is a LIFO (Last In, First Out) memory structure used by the JavaScript engine to track active function execution frames. When a function is called, its frame is pushed; when it returns, its frame is popped.
• **Stack Overflow**: Occurs when recursive functions call themselves without reaching a base termination case, exceeding V8's call stack limit (~10,000–65,000 frames) and throwing \`RangeError: Maximum call stack size exceeded\`.`,
    code: `// Stack Overflow Example:
function recurse() {
  recurse(); // Unbounded recursion!
}
// recurse(); // RangeError: Maximum call stack size exceeded`
  },
  {
    id: 25,
    topicId: 2,
    difficulty: "Junior",
    category: "Scope",
    question: "What is the difference between function scope and block scope?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Function Scope**: Variables declared with \`var\` are accessible anywhere within their enclosing function, ignoring \`if\`, \`for\`, or \`while\` blocks.
• **Block Scope**: Variables declared with \`let\` or \`const\` are strictly confined within the nearest enclosing pair of curly braces \`{ ... }\`.`,
    code: `if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1
// console.log(b); // ReferenceError: b is not defined`
  },
  {
    id: 26,
    topicId: 2,
    difficulty: "Junior",
    category: "Functions",
    question: "Can an outer scope access variables declared inside a function?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
No. Variables declared inside a function's execution context are private and encapsulated. They are unreachable from outer scopes unless explicitly returned by the function or accessed via a closure returned to the outer scope.`,
    code: `function secretVault() {
  const password = "encrypted_123";
  return { getPassword: () => password }; // Exposed via closure
}
const vault = secretVault();
console.log(vault.getPassword()); // "encrypted_123"`
  },
  {
    id: 27,
    topicId: 2,
    difficulty: "Intermediate",
    category: "Scope Chain",
    question: "What is variable shadowing?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Variable shadowing occurs when a variable declared within an inner scope has the exact same name as a variable in an outer enclosing scope. The inner declaration "shadows" (masks) the outer identifier within that inner block, preventing direct access to the outer variable without altering its value.`,
    code: `const role = "user";
function authorize() {
  const role = "admin"; // Shadows outer 'role'
  console.log(role);    // "admin"
}
authorize();
console.log(role);      // "user" (outer unaffected)`
  },
  {
    id: 28,
    topicId: 2,
    difficulty: "Junior",
    category: "Runtime Errors",
    question: "What happens when you access or assign to an undeclared variable?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Reading an undeclared variable**: Always throws \`ReferenceError: x is not defined\`.
• **Assigning to an undeclared variable**:
  - In non-strict mode: Automatically creates an accidental global property on \`window\` or \`global\`.
  - In strict mode (\`'use strict'\`): Throws \`ReferenceError: x is not defined\`!`,
    code: `'use strict';
function test() {
  // x = 10; // ReferenceError in strict mode!
}`
  },
  {
    id: 29,
    topicId: 2,
    difficulty: "Junior",
    category: "Strict Mode",
    question: "What is Strict Mode and what guarantees does it provide?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Strict Mode (\`'use strict'\`) is a restricted variant of JavaScript introduced in ES5 that eliminates silent bugs by throwing explicit exceptions.
• **Key Guarantees**:
  1. Prevents accidental globals on undeclared assignment.
  2. Sets \`this === undefined\` in unbound function invocations (prevents global window pollution).
  3. Throws TypeError on assignment to non-writable or getter-only properties.
  4. Prohibits duplicate function parameter names (\`fn(a, a)\`).
  *All ES Modules and ES6 Classes run in strict mode by default.*`,
    code: `'use strict';
function check() {
  console.log(this); // undefined (in non-strict, would be window)
}
check();`
  },
  {
    id: 30,
    topicId: 2,
    difficulty: "Junior",
    category: "Variables",
    question: "What is the difference between variable declaration, initialization, and assignment?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Declaration**: Introducing an identifier into the scope's Environment Record during compilation.
• **Initialization**: Allocating memory and binding an initial value (e.g. \`undefined\`).
• **Assignment**: Setting or updating the variable's value with an assignment operator (\`=\`).
*With \`var\`, declaration and initialization to \`undefined\` happen during hoisting. With \`let\`, initialization is deferred to the declaration statement.*`,
    code: `let x;    // Declared & initialized to undefined
x = 10;   // Assigned to 10
const y = 20; // Declared, initialized & assigned simultaneously`
  },

  // TOPIC 3: Functions, Closures & this (Q31–40)
  {
    id: 31,
    topicId: 3,
    difficulty: "Junior",
    category: "Functions",
    question: "What is the difference between a function declaration and a function expression?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Function Declaration**: A standalone statement (\`function name() {}\`). Hoisted completely with its function body, meaning it can be invoked anywhere in its enclosing scope, even before its textual definition.
• **Function Expression**: A function defined as an expression within a variable assignment (\`const fn = function() {}\`). It obeys variable hoisting rules: the variable identifier is hoisted, but the function body is not assigned until execution reaches that line. Calling it early throws a TDZ \`ReferenceError\` or \`TypeError\`.`,
    code: `// Declaration works anywhere in scope:
greet(); // "Hello!"
function greet() { console.log("Hello!"); }

// Expression cannot be called before evaluation:
// sayBye(); // ReferenceError: Cannot access 'sayBye' before initialization
const sayBye = function() { console.log("Bye!"); };`
  },
  {
    id: 32,
    topicId: 3,
    difficulty: "Intermediate",
    category: "Functions",
    question: "What is the difference between arrow functions and regular functions?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
1. **\`this\` Binding**: Regular functions determine \`this\` dynamically at the call-site. Arrow functions have no \`this\` of their own and inherit it **lexically** from their enclosing scope.
2. **Constructors**: Regular functions can be used as constructors with \`new\`. Arrow functions cannot and throw \`TypeError\`.
3. **Arguments Object**: Regular functions have an \`arguments\` pseudo-array. Arrow functions do not (use \`...args\`).
4. **Binding Methods**: \`call()\`, \`apply()\`, and \`bind()\` cannot change an arrow function's \`this\`.`,
    code: `const counter = {
  count: 0,
  start() {
    // Arrow function captures lexical 'this' from start():
    setTimeout(() => {
      this.count++;
      console.log(this.count); // 1
    }, 100);
  }
};
counter.start();`
  },
  {
    id: 33,
    topicId: 3,
    difficulty: "Junior",
    category: "Functional Programming",
    question: "What does it mean that functions are 'first-class citizens' in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In JavaScript, functions are **first-class citizens**, meaning they are treated like any other variable or value:
1. They can be assigned to variables and object properties.
2. They can be passed as arguments into other functions (callbacks).
3. They can be returned as output from other functions (factories, currying).
4. They can be stored in arrays and data structures.`,
    code: `// Assign to variable, pass as argument, return from function:
const add = (a, b) => a + b;
const applyOp = (op, x, y) => op(x, y);
console.log(applyOp(add, 10, 20)); // 30`
  },
  {
    id: 34,
    topicId: 3,
    difficulty: "Junior",
    category: "Functional Programming",
    question: "What is a Higher-Order Function (HOF)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **Higher-Order Function** is a function that either:
1. **Accepts one or more functions as arguments** (e.g. \`Array.prototype.map\`, \`filter\`, \`reduce\`, \`setTimeout\`).
2. **Returns a function as its result** (e.g. function factories, currying, middleware decorators).`,
    code: `// HOF accepting function:
const double = x => x * 2;
console.log([1, 2, 3].map(double)); // [2, 4, 6]

// HOF returning function:
const createMultiplier = factor => number => number * factor;
const triple = createMultiplier(3);
console.log(triple(10)); // 30`
  },
  {
    id: 35,
    topicId: 3,
    difficulty: "Junior",
    category: "Callbacks",
    question: "What is a callback function and what is the difference between synchronous and asynchronous callbacks?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **callback function** is a function passed as an argument to another function intended to be invoked later.
• **Synchronous Callbacks**: Executed immediately during the execution of the calling function, blocking until done (e.g. \`[].forEach\`, \`[].filter\`).
• **Asynchronous Callbacks**: Placed on the Task/Microtask Queue and executed after the current call stack clears (e.g. \`setTimeout\`, DOM event listeners, \`fetch\`).`,
    code: `// Synchronous: runs immediately on Call Stack
[1, 2].forEach(x => console.log("Sync:", x));

// Asynchronous: runs via Event Loop Task Queue
setTimeout(() => console.log("Async: Timer"), 0);`
  },
  {
    id: 36,
    topicId: 3,
    difficulty: "Senior",
    category: "Closures",
    question: "What is a closure and how does the JavaScript engine retain variables in heap memory?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **closure** is the combination of a function bundled together with references to its surrounding lexical state (Lexical Environment). It allows an inner function to access variables from an outer enclosing function even after the outer function has finished executing and its execution frame has been popped off the Call Stack!

### 2. Internal Working & Engine Mechanics
Normally, local variables allocated inside a function execution context are discarded when the function returns. However, if an inner function outlives the outer function (e.g. returned, stored in an event listener, or scheduled in a timer) and references those outer variables, V8 detects this during compilation. It moves the referenced variables from the Call Stack into an allocated **Closure Object on the Memory Heap**, preserving them until the inner function is garbage collected.

### 3. Production Use Cases
1. **Data Encapsulation**: Private state in module patterns.
2. **Factory Functions & Currying**: Creating specialized utility functions.
3. **Memoization**: Caching computed results.
4. **Debounce/Throttle**: Retaining active timer IDs.`,
    code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable retained in closure heap

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50)); // 150
console.log(account.getBalance()); // 150
// console.log(account.balance); // undefined (Private!)`
  },
  {
    id: 37,
    topicId: 3,
    difficulty: "Intermediate",
    category: "Closures",
    question: "Do closures capture a frozen snapshot of variables or live bindings in memory?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Closures capture **live reference bindings in memory, NOT frozen snapshots**. If the closed-over variable changes in the outer scope, the inner function sees the updated value when invoked.`,
    code: `let message = "Initial";
const readMessage = () => console.log(message);

message = "Updated";
readMessage(); // "Updated" (reads live memory binding!)`
  },
  {
    id: 38,
    topicId: 3,
    difficulty: "Junior",
    category: "Functions",
    question: "What is the difference between parameters and arguments?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Parameters**: The named identifiers declared in the function's signature definition.
• **Arguments**: The actual runtime values supplied to the function when it is invoked.`,
    code: `function add(x, y) { // x and y are PARAMETERS
  return x + y;
}
add(10, 20);         // 10 and 20 are ARGUMENTS`
  },
  {
    id: 39,
    topicId: 3,
    difficulty: "Junior",
    category: "Functions",
    question: "How do default parameters work and when do they trigger?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Default parameters allow function parameters to be initialized with default values if no value or **strictly \`undefined\`** is passed during invocation. They do NOT trigger for other falsy values such as \`null\`, \`0\`, \`false\`, or \`""\`!`,
    code: `function connect(port = 8080) {
  return \`Connected to port \${port}\`;
}

console.log(connect());          // "Connected to port 8080"
console.log(connect(undefined)); // "Connected to port 8080"
console.log(connect(null));      // "Connected to port null" (null is NOT undefined!)`
  },
  {
    id: 40,
    topicId: 3,
    difficulty: "Junior",
    category: "Modern JS",
    question: "What is the rest parameter (...args) vs the arguments object?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Rest Parameter (\`...args\`)**: An ES6 syntax that gathers remaining arguments into a **true JavaScript Array** instance. Can be used in arrow functions and supports array methods directly (\`map\`, \`reduce\`). Must be the last parameter.
• **\`arguments\` Object**: A legacy array-like object available only in regular functions. It lacks modern array methods and makes optimization harder for JIT engines.`,
    code: `// Modern Rest Parameter (Clean Array):
function calculateTotal(...prices) {
  return prices.reduce((sum, p) => sum + p, 0);
}
console.log(calculateTotal(10, 20, 30)); // 60`
  }
];
