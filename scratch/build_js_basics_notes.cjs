const fs = require('fs');
const path = require('path');

console.log('Building JavaScript Curriculum with Chapter 1 Fundamentals...');

const metadata = {
  title: "JavaScript Basics - Comprehensive Guide",
  subtitle: "Master Curriculum & Complete In-Depth Reference",
  level: "Beginner → Intermediate → Advanced",
  purpose: "In-depth guide to fundamental JavaScript concepts with thorough explanations, examples, and best practices.",
  version: "3.1.0"
};

const sections = [
  // =========================================================================
  // CHAPTER 1: FUNDAMENTALS OF JAVASCRIPT
  // =========================================================================
  {
    id: "fundamentals",
    number: "1",
    title: "JavaScript Fundamentals, Engines & Runtime Architecture",
    summary: "What is JavaScript, core paradigms, the Chef mental model, single-threaded execution vs host runtime concurrency, V8 Ignition & TurboFan JIT pipeline, execution contexts, and strict mode.",
    subsections: [
      {
        id: "1.1",
        title: "1.1 What is JavaScript? (Paradigms & Mental Model)",
        content: `**JavaScript** is a high-level, dynamically typed, multi-paradigm language conforming to the ECMAScript specification.

### Core Paradigms
• **Procedural**: Structured sequential programming with functions, block scoping, and control flow.
• **Object-Oriented**: Prototype-based object inheritance without rigid classical classes (ES6 \`class\` is syntactic sugar over prototype chains).
• **Functional**: First-class functions, pure functions, closures, currying, and higher-order functions (\`map\`, \`filter\`, \`reduce\`).
• **Event-Driven & Asynchronous**: Non-blocking I/O driven by an event loop, microtask queues, and callback/promise primitives.

### The Master Chef Mental Model
Think of JavaScript as a single master chef (the main thread Call Stack) working in a busy restaurant kitchen. The chef prepares one dish at a time from start to finish. Whenever an order requires long cooking (baking bread, roasting meat — equivalent to network HTTP requests, disk reads, or timers), the chef offloads it to the kitchen assistants (the Browser Web APIs or Node.js Libuv thread pool) and immediately resumes chopping vegetables for the next customer. When an assistant finishes, they place a ticket on the kitchen counter (Task/Microtask queue). The chef picks up the ticket only when the chopping board (call stack) is completely empty.`,
        interviewAnswer: "JavaScript is a high-level, dynamically typed language with first-class functions and prototype-based inheritance. It is single-threaded in its execution context but achieves high-throughput non-blocking concurrency via host runtime APIs and the event loop."
      },
      {
        id: "1.2",
        title: "1.2 Single-Threaded Execution vs Host Concurrency",
        content: `A critical interview distinction: **JavaScript execution on the main thread is strictly single-threaded**, but the **surrounding runtime environment (Browser or Node.js) is multi-threaded**.

### What is Single-Threaded?
• The JavaScript engine (e.g. Google V8) has exactly **one Call Stack** and **one Memory Heap** per execution agent.
• It executes one statement or bytecode instruction at a time. Long-running synchronous calculations (e.g. heavy crypto or image processing) freeze the thread, blocking user interactions and DOM updates.

### What Provides Concurrency?
• **In Browsers**: The browser engine provides background threads for HTTP network requests, timer interrupts (\`setTimeout\`), DOM event dispatching, and Web Workers for parallel background compute.
• **In Node.js**: Libuv maintains a thread pool (default 4 C++ worker threads) for file system operations (\`fs\`), DNS lookups, and cryptographic hashing (\`crypto.pbkdf2\`), while OS kernel multiplexing (\`epoll\`, \`kqueue\`, \`IOCP\`) handles socket I/O.`,
        callout: {
          type: "warning",
          text: "Never say 'Node.js is completely single-threaded'. Node.js executes JavaScript on a single thread, but performs asynchronous I/O and heavy system tasks using operating-system kernel multiplexing and a C++ thread pool."
        }
      },
      {
        id: "1.3",
        title: "1.3 Engine Mechanics: V8 Ignition & TurboFan Pipeline",
        content: `Modern JavaScript engines do not use simple naive interpretation. Engines like V8 (used in Chrome, Node.js, and Bun/Deno equivalents) employ a **Just-In-Time (JIT) Compilation Pipeline**:

1. **Parser & Lexer**: Converts source code characters into tokens, then builds an **Abstract Syntax Tree (AST)**.
2. **Ignition (Bytecode Interpreter)**: Compiles the AST into compact bytecode and executes it immediately with minimal startup delay. It collects runtime profile data (type feedback).
3. **TurboFan (Optimizing Compiler)**: If a function is called repeatedly with the same argument types ("hot code"), TurboFan compiles that bytecode into blazing-fast native machine code using **Hidden Classes (Shapes)** and **Inline Caches (IC)**.
4. **Deoptimization**: If an optimized function is suddenly passed an unexpected type (e.g. an array of strings instead of numbers), TurboFan deoptimizes the code, discards machine instructions, and falls back to Ignition bytecode interpretation.`,
        code: `// TurboFan Optimization Example:
function add(a, b) {
  return a + b;
}

// 1. Hot loop with consistent types (integers):
for (let i = 0; i < 10000; i++) {
  add(1, 2); // TurboFan compiles to 1 CPU instruction: 'add eax, ebx'
}

// 2. Sudden type mutation triggers DEOPTIMIZATION:
add("hello", "world"); // TurboFan must discard optimized machine code and bail out!`
      },
      {
        id: "1.4",
        title: "1.4 Execution Context & Call Stack Flow",
        content: `Whenever JavaScript code runs, it executes inside an **Execution Context**.

### 1. Global Execution Context (GEC)
Created when the script first loads. Sets up the global object (\`window\` in browsers, \`global\` in Node.js) and binds the \`this\` keyword.

### 2. Function Execution Context (FEC)
Created every time a function is invoked. Each function call gets its own isolated context with its own arguments, local variable environment, and scope chain.

### The Two Phases of Every Context:
1. **Creation Phase**: The engine scans the code, allocates memory for variables and functions (Hoisting), creates the Scope Chain, and determines the \`this\` binding.
2. **Execution Phase**: The engine executes code line-by-line, assigning values and evaluating expressions.

### The Call Stack (LIFO)
Execution contexts are managed in a **Last-In, First-Out (LIFO)** Call Stack. The Global Context sits at the base. Calling a function pushes a new context onto the stack; returning pops it off. Exceeding the maximum stack frame limit causes a \`RangeError: Maximum call stack size exceeded\` (Stack Overflow).`,
        code: `function first() {
  console.log("Entering first");
  second();
  console.log("Exiting first");
}

function second() {
  console.log("Inside second");
}

first();
// Call Stack Flow:
// 1. Push Global Execution Context
// 2. Push first() Context
// 3. Push second() Context
// 4. Pop second() Context
// 5. Pop first() Context`
      },
      {
        id: "1.5",
        title: "1.5 Strict Mode ('use strict')",
        content: `Introduced in ECMAScript 5, **Strict Mode** eliminates silent errors, prevents accidental globals, disables legacy syntax, and secures code against common runtime mistakes.

### Key Strict Mode Guarantees:
• **Prevents Accidental Globals**: Assigning to an undeclared variable throws a \`ReferenceError\` instead of implicitly attaching to the global object.
• **Prevents Silent Failures**: Assigning to non-writable properties, getter-only properties, or deleting non-configurable properties throws a \`TypeError\`.
• **Restricts \`this\` in Functions**: Unbound function invocations have \`this === undefined\` instead of defaulting to \`window\` or \`global\`.
• **Disables \`with\` & Octal Literals**: Removes confusing, non-optimizable syntax.
• **Prohibits Duplicate Parameter Names**: \`function fn(a, a) {}\` throws a syntax error.

*Note: All ES Modules (\`import\`/\`export\`) and ES6 Classes are strictly in strict mode by default.*`,
        code: `'use strict';

// 1. Accidental global:
// count = 10; // ReferenceError: count is not defined

// 2. Unbound function this:
function checkThis() {
  console.log(this);
}
checkThis(); // undefined (in non-strict mode, would print window/global)

// 3. Deleting non-configurable property:
// delete Object.prototype; // TypeError: Cannot delete property 'prototype'`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 2: VARIABLES
  // =========================================================================
  {
    id: "variables",
    number: "2",
    title: "Variables, Scope & Temporal Dead Zone (TDZ)",
    summary: "Declaration and scope with var, let, and const, block vs function scope, variable lifecycle, and the Temporal Dead Zone.",
    subsections: [
      {
        id: "2.1",
        title: "2.1 Declaration and Scope: var (ES5 and earlier)",
        content: `In JavaScript, variables declared with \`var\` are either **function-scoped** (if declared inside a function) or **globally scoped** (if declared outside any function). Block statements such as \`if\` or \`for\` do **not** create a new scope for \`var\`.

### Key Characteristics of \`var\`:
• **Function-scoped**: Variables declared inside a function cannot be accessed from outside, but variables declared inside an \`if\` or \`for\` block leak into the surrounding function or global scope.
• **Hoisted with \`undefined\`**: When the engine compiles the code, declarations are hoisted to the top of the function/global context and initialized to \`undefined\`.
• **Re-declaration allowed**: You can declare the same variable identifier multiple times in the same scope without syntax errors, which is a frequent source of bugs.
• **Global object pollution**: Top-level \`var\` declarations create properties on the global object (\`window\` in browsers).`,
        code: `var x = 10;
var x = 20; // Re-declaration allowed (potential bug source)

function example() {
    var y = 30;
    if (true) {
        var y = 40; // Same variable, block doesn't create new scope
        console.log(y); // 40
    }
    console.log(y); // 40 (not 30!) - Hoisted to function scope
}
example();`,
        callout: {
          type: "warning",
          text: "Avoid using var in modern JavaScript. Its lack of block scoping and silent re-declaration make it prone to accidental variable shadowing and leaks."
        }
      },
      {
        id: "2.2",
        title: "2.2 Declaration and Scope: let (ES6+)",
        content: `Introduced in ECMAScript 2015 (ES6), \`let\` provides **block-scoped** variable bindings that solve the scoping issues of \`var\`.

### Key Characteristics of \`let\`:
• **Block-scoped**: Any pair of curly braces \`{ ... }\` (functions, \`if\` statements, \`for\` loops, or standalone blocks) creates an isolated scope.
• **No re-declaration in the same scope**: Attempting to declare the same identifier twice within the same block scope throws a \`SyntaxError\`.
• **Reassignment allowed**: You can assign new values to a \`let\` variable at any time.
• **Temporal Dead Zone**: Unlike \`var\`, accessing a \`let\` variable before its declaration throws a \`ReferenceError\`.
• **No global object pollution**: Top-level \`let\` variables in browsers do not attach to \`window\`.`,
        code: `let x = 10;
// let x = 20; // SyntaxError: Identifier 'x' has already been declared
x = 20; // Reassignment allowed

if (true) {
    let y = 30;
    // let y = 40; // SyntaxError: Cannot re-declare in same block
    console.log(y); // 30
}
// console.log(y); // ReferenceError: y is not defined (contained in block!)`
      },
      {
        id: "2.3",
        title: "2.3 Declaration and Scope: const (ES6+)",
        content: `\`const\` behaves like \`let\` with one vital distinction: it creates an **immutable binding** (a constant reference).

### Key Characteristics of \`const\`:
• **Block-scoped**: Exactly like \`let\`, it is confined to the enclosing \`{ ... }\` block.
• **Must be initialized at declaration**: You cannot declare \`const x;\` without assigning a value immediately (throws \`SyntaxError: Missing initializer in const declaration\`).
• **Cannot be reassigned**: Attempting to reassign a \`const\` identifier throws \`TypeError: Assignment to constant variable\`.
• **Reference vs Value Mutability**: For objects and arrays, the *binding reference* is constant, but the *internal properties or elements* can still be mutated!
• **True Immutability**: To prevent object properties from being mutated, use \`Object.freeze()\`.`,
        code: `const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

const user = { name: "John" };
user.name = "Jane"; // Allowed - object properties can change
console.log(user.name); // "Jane"

// user = { name: "Bob" }; // Not allowed - cannot reassign reference

// For true immutability:
const frozenUser = Object.freeze({ name: "Alice" });
// frozenUser.name = "Charlie"; // Fails silently (or throws TypeError in strict mode)`
      },
      {
        id: "2.4",
        title: "2.4 Temporal Dead Zone (TDZ)",
        content: `The **Temporal Dead Zone (TDZ)** is the time span between entering a scope and the line of code where a variable is formally initialized.

During compile time, the engine scans the scope and registers \`let\` and \`const\` identifiers in the Lexical Environment, but marks them as **uninitialized**. Attempting to access an uninitialized variable throws a \`ReferenceError\`.

### Why does the TDZ exist?
1. **Catches bugs early**: Reading a variable before assigning its value is almost always a logical flaw.
2. **Maintains \`const\` integrity**: If \`const\` were hoisted and initialized to \`undefined\` like \`var\`, its value would transition from \`undefined\` to its assigned value, violating the guarantee of constant immutability.`,
        code: `console.log(a); // undefined (var is hoisted and initialized to undefined)
var a = 10;

// <--- TDZ for variable 'b' begins here at block entry
// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20; // <--- TDZ for 'b' ends here!
console.log(b); // 20`
      },
      {
        id: "2.5",
        title: "2.5 Comparison Matrix: var vs let vs const",
        table: {
          headers: ["Feature", "var", "let", "const"],
          rows: [
            ["Scope", "Function Scope", "Block Scope", "Block Scope"],
            ["Hoisting", "Hoisted + initialized to undefined", "Hoisted in TDZ (uninitialized)", "Hoisted in TDZ (uninitialized)"],
            ["Re-declaration", "Allowed in same scope", "SyntaxError", "SyntaxError"],
            ["Reassignment", "Allowed", "Allowed", "TypeError"],
            ["Must initialize", "No (defaults to undefined)", "No (defaults to undefined)", "Yes (mandatory at declaration)"],
            ["Global object property", "Yes (window.x in browsers)", "No", "No"]
          ]
        }
      }
    ]
  },

  // =========================================================================
  // CHAPTER 3: DATA TYPES
  // =========================================================================
  {
    id: "data-types",
    number: "3",
    title: "Data Types & Type Detection",
    summary: "The 7 primitive types, non-primitive reference types, memory heap vs call stack, and reliable type detection with typeof and Array.isArray.",
    subsections: [
      {
        id: "3.1",
        title: "3.1 The 7 Primitive Types",
        content: `JavaScript primitives are **immutable values** stored directly on the stack or inline in engine registers. They represent atomic data.

1. **String**: Textual data enclosed in single quotes, double quotes, or backticks (\`\`\`).
2. **Number**: Double-precision 64-bit IEEE 754 floating-point numbers. Can represent integers up to $\\pm(2^{53} - 1)$ plus special values \`Infinity\`, \`-Infinity\`, and \`NaN\` (Not-a-Number).
3. **Boolean**: Logical values \`true\` or \`false\`.
4. **Undefined**: Automatically assigned to a variable that has been declared but not assigned any value.
5. **Null**: Intentional assignment indicating the absence of any object value.
6. **Symbol**: Unique, immutable identifier introduced in ES6, commonly used as non-enumerable object property keys.
7. **BigInt**: Arbitrary-precision integers introduced in ES2020, designated by appending \`n\` to an integer literal.`,
        code: `// 1. String
let str1 = 'Single quotes';
let str2 = "Double quotes";
let str3 = \`Template literal \${str1}\`;

// 2. Number
let num = 42;
let float = 3.14;
let infinity = Infinity;
let nan = NaN; // Note: typeof NaN is "number"!

// 3. Boolean
let isTrue = true;
let isFalse = false;

// 4. Undefined
let x;
console.log(x); // undefined

// 5. Null
let y = null;
console.log(y === null); // true

// 6. Symbol
const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log(sym1 === sym2); // false (Symbols are always globally unique)

// 7. BigInt
const bigNum = 1234567890123456789012345678901234567890n;
const bigNum2 = BigInt("123456789012345678901234567890");`
      },
      {
        id: "3.2",
        title: "3.2 Non-Primitive (Reference) Types",
        content: `Any value in JavaScript that is not one of the 7 primitives is an **Object**. Objects are reference types allocated in the **Memory Heap**. Variables hold a pointer (memory address) referencing that heap location.

### Categories of Reference Types:
• **Object Literals**: Collections of key-value pairs (\`{ name: "John", age: 30 }\`).
• **Arrays**: Ordered list of elements indexed by numerical keys. Arrays are special objects with an automatic \`length\` property.
• **Functions**: Callable objects that can be passed as arguments, assigned to variables, and returned from other functions (first-class functions).
• **Built-in Objects**: \`Date\`, \`RegExp\`, \`Map\`, \`Set\`, \`WeakMap\`, \`WeakSet\`, and \`Promise\`.`,
        code: `// Object literal
let user = {
    name: "John",
    age: 30,
    isAdmin: true
};

// Arrays (special type of object)
let arr = [1, 2, 3];

// Functions (callable objects)
function greet() {
    return "Hello";
}`
      },
      {
        id: "3.3",
        title: "3.3 Type Detection & The typeof Null Gotcha",
        content: `JavaScript provides the \`typeof\` operator to inspect the data type of an expression.

### The typeof null Bug
In the original implementation of JavaScript, values were stored in 32-bit units with a type tag in the lower 3 bits. The type tag for objects was \`000\`. Because \`null\` was represented as a NULL pointer (\`0x00\`), its type tag was also \`000\`, causing \`typeof null\` to return \`"object"\`. This bug cannot be fixed in ECMAScript because doing so would break millions of legacy websites.

### Reliable Type Checking:
• **For Primitives**: Use \`typeof value\`.
• **For Null**: Check explicitly with \`value === null\`.
• **For Arrays**: Always use \`Array.isArray(value)\` instead of \`typeof\`.`,
        code: `typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object" (Historical bug!)
typeof Symbol()     // "symbol"
typeof 123n         // "bigint"
typeof {}           // "object"
typeof []           // "object" (Do not use typeof for arrays!)
typeof function(){} // "function"

// Correct Array Detection:
Array.isArray([])   // true
Array.isArray({})   // false

// Correct Null Detection:
const isNull = (val) => val === null;`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 4: TYPE CONVERSION & COERCION
  // =========================================================================
  {
    id: "type-conversion",
    number: "4",
    title: "Type Conversion & Coercion",
    summary: "Explicit (manual) conversion vs implicit (automatic) coercion across string, number, and boolean contexts, and truthy vs falsy evaluation.",
    subsections: [
      {
        id: "4.1",
        title: "4.1 Explicit (Manual) Conversion",
        content: `Explicit conversion occurs when a developer deliberately converts a value from one type to another using built-in constructors or functions.

### 1. To String
• \`String(value)\`: Works on all types, converting \`null\` to \`"null"\` and \`undefined\` to \`"undefined"\`.
• \`value.toString()\`: Available on primitives (via auto-boxing) and objects, but throws a \`TypeError\` if called on \`null\` or \`undefined\`.

### 2. To Number
• \`Number(value)\`: Converts strings, booleans, and \`null\` to numbers. If the string contains non-numeric characters, it returns \`NaN\`.
• \`parseInt(str, radix)\`: Parses an integer from left to right, stopping at the first non-digit.
• \`parseFloat(str)\`: Parses a floating-point number.

### 3. To Boolean
• \`Boolean(value)\` or \`!!value\`: Converts any value to \`true\` or \`false\` based on truthiness.`,
        code: `// --- Explicit To String ---
String(123);        // "123"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"
(123).toString();   // "123"

// --- Explicit To Number ---
Number("123");      // 123
Number("123abc");   // NaN (strict parsing)
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN
parseInt("123px", 10); // 123 (parses until invalid char)
parseFloat("3.14em");  // 3.14

// --- Explicit To Boolean ---
Boolean(0);         // false
Boolean(1);         // true
Boolean("");        // false
Boolean("hello");   // true
Boolean([]);        // true (empty array is truthy!)
Boolean({});        // true (empty object is truthy!)
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false`
      },
      {
        id: "4.2",
        title: "4.2 Implicit (Automatic) Coercion",
        content: `Implicit coercion occurs when the JavaScript engine automatically converts types during an operation (such as addition, subtraction, or logical comparison).

### 1. String Context (The \`+\` operator)
If either operand to the binary \`+\` operator is a string, JavaScript converts the other operand to a string and performs **concatenation**. Operations evaluate from left to right.

### 2. Number Context (\`-\`, \`*\`, \`/\`, \`%\`, \`>\`, \`<\`)
Mathematical operators other than \`+\` automatically coerce operands to numbers.

### 3. Boolean Context
Conditional statements (\`if\`, \`while\`, \`&&\`, \`||\`) automatically coerce their expressions to booleans.`,
        code: `// --- String Coercion ---
"value: " + 42;     // "value: 42"
"3" + 4 + 5;        // "345" ("3" + 4 = "34", "34" + 5 = "345")
3 + 4 + "5";        // "75" (3 + 4 = 7, 7 + "5" = "75")

// --- Number Coercion ---
"42" - 2;           // 40
"42" * 2;           // 84
"42" / 2;           // 21
"42" > 40;          // true (coerced to 42 > 40)`
      },
      {
        id: "4.3",
        title: "4.3 Truthy and Falsy Values",
        content: `In JavaScript, every value is inherently either **falsy** or **truthy** when evaluated in a boolean context.

### The Complete List of Falsy Values:
There are exactly **8 falsy values** in ECMAScript:
1. \`false\`
2. \`0\`
3. \`-0\`
4. \`0n\` (BigInt zero)
5. \`""\` (empty string)
6. \`null\`
7. \`undefined\`
8. \`NaN\`

### Everything Else is Truthy!
All other values evaluate to \`true\`, including:
• Empty arrays: \`[]\`
• Empty objects: \`{}\`
• Empty functions: \`function(){}\`
• Strings containing whitespace: \`" "\` or \`"false"\``,
        code: `if ([]) {
    console.log("Array is truthy!"); // Prints: "Array is truthy!"
}

if ({}) {
    console.log("Object is truthy!"); // Prints: "Object is truthy!"
}

if ("false") {
    console.log("String 'false' is truthy!"); // Prints: "String 'false' is truthy!"
}`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 5: OPERATORS
  // =========================================================================
  {
    id: "operators",
    number: "5",
    title: "Operators & Modern Syntax",
    summary: "Loose equality (==) vs strict equality (===), logical short-circuiting, nullish coalescing (??), and optional chaining (?.).",
    subsections: [
      {
        id: "5.1",
        title: "5.1 Equality Operators: == vs ===",
        content: `### \`==\` (Loose Equality - Performs Type Coercion)
The loose equality operator compares values **after** coercing them to a common type. This creates surprising, non-transitive edge cases.

### \`===\` (Strict Equality - No Coercion)
The strict equality operator checks both **type** and **value**. If the types are different, it immediately returns \`false\`.

### Simplified Abstract Equality Algorithm for \`==\`:
1. If types are identical, compare like \`===\`.
2. If comparing \`null\` and \`undefined\`, return \`true\`.
3. If comparing a number and a string, coerce the string to a number.
4. If comparing a boolean, coerce the boolean to a number (\`true → 1\`, \`false → 0\`).
5. If comparing an object with a primitive, convert the object via \`[Symbol.toPrimitive]\` or \`valueOf()\`/\`toString()\`.`,
        code: `// --- Loose Equality (==) with Coercion ---
5 == "5";           // true
0 == false;         // true (false coerced to 0)
null == undefined;  // true (special rule)
"" == 0;            // true ("" coerced to 0)
[] == 0;            // true ([] coerced to "" then 0)

// --- Strict Equality (===) No Coercion ---
5 === "5";          // false
0 === false;        // false
null === undefined; // false
"" === 0;           // false
[] === 0;           // false`
      },
      {
        id: "5.2",
        title: "5.2 Logical Operators: &&, ||, and !",
        content: `Logical operators in JavaScript return the value of one of the specified operands, not necessarily a boolean.

### 1. Logical AND (\`&&\`)
Evaluates operands from left to right. Returns the **first falsy value** encountered. If all operands are truthy, returns the **last operand**.

### 2. Logical OR (\`||\`)
Evaluates operands from left to right. Returns the **first truthy value** encountered. If all operands are falsy, returns the **last operand**.

### 3. Logical NOT (\`!\`) and Double NOT (\`!!\`)
\`!\` inverts the truthiness of an operand and returns a boolean. \`!!\` casts any value to its exact boolean equivalent.`,
        code: `// --- Logical AND (&&) ---
true && true;       // true
true && false;      // false
0 && "hello";       // 0 (returns first falsy)
"hello" && "world"; // "world" (returns last truthy)

// --- Logical OR (||) ---
true || false;      // true
false || false;     // false
0 || "hello";       // "hello" (returns first truthy)
"" || null || 0;    // 0 (returns last falsy)

// --- Logical NOT (!) & Double NOT (!!) ---
!true;              // false
!"hello";           // false
!!"hello";          // true (double NOT for clean boolean cast)`
      },
      {
        id: "5.3",
        title: "5.3 Nullish Coalescing (??) (ES2020)",
        content: `The **Nullish Coalescing operator (\`??\`)** returns its right-hand operand when its left-hand operand is **\`null\` or \`undefined\`**. Otherwise, it returns its left-hand operand.

### Why ?? is Better than || for Defaults:
The \`||\` operator treats \`0\`, \`""\`, and \`false\` as falsy, triggering the default value even when \`0\` or \`""\` is a valid user input! The \`??\` operator only falls back on actual nullish values (\`null\` and \`undefined\`).`,
        code: `null ?? "default";      // "default"
undefined ?? "default"; // "default"
0 ?? "default";         // 0 (correctly preserved!)
"" ?? "default";        // "" (correctly preserved!)

// Comparison with ||:
const count = 0;
const displayCount1 = count || 10; // 10 (Bug! Overrode 0!)
const displayCount2 = count ?? 10; // 0 (Correct!)`
      },
      {
        id: "5.4",
        title: "5.4 Optional Chaining (?.) (ES2020)",
        content: `The **Optional Chaining operator (\`?.\`)** allows safe property reads deep within a chain of connected objects without causing the engine to throw a \`TypeError: Cannot read properties of undefined\`.

If the reference before \`?.\` is \`null\` or \`undefined\`, evaluation stops and returns \`undefined\`.`,
        code: `const user = {
    profile: {
        name: "John"
    }
};

console.log(user?.profile?.name);    // "John"
console.log(user?.address?.city);    // undefined (safe, no error thrown!)

// Optional method calls:
const admin = {
  getRole: () => "Admin"
};
console.log(admin.getRole?.());   // "Admin"
console.log(admin.deleteUser?.()); // undefined (safe!)`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 6: TEMPLATE LITERALS
  // =========================================================================
  {
    id: "template-literals",
    number: "6",
    title: "Template Literals & String Interpolation",
    summary: "String interpolation, multi-line strings, tagged templates, and raw strings with String.raw.",
    subsections: [
      {
        id: "6.1",
        title: "6.1 Basic Syntax & Expression Evaluation",
        content: `Template literals are string literals enclosed in **backtick characters (\`\`)**, allowing embedded expressions using the \`\${expression}\` placeholder syntax.

Inside \`\${...}\`, you can place any valid JavaScript expression, including variables, arithmetic, ternary conditions, and function invocations.`,
        code: `const name = "John";
const age = 30;

// Basic interpolation
console.log(\`My name is \${name} and I'm \${age} years old.\`);

// Expression evaluation
console.log(\`Next year I'll be \${age + 1}.\`);

// Function calls inside interpolation
console.log(\`Hello, \${name.toUpperCase()}!\`);`
      },
      {
        id: "6.2",
        title: "6.2 Multi-line Strings",
        content: `Before ES6, multi-line strings required tedious string concatenation and escaped newline characters (\`\\n\`). Template literals naturally preserve newlines and whitespace.`,
        code: `// Before ES6
const oldWay = "Line 1\\n" +
               "Line 2\\n" +
               "Line 3";

// With template literals
const newWay = \`Line 1
Line 2
Line 3\`;`
      },
      {
        id: "6.3",
        title: "6.3 Tagged Templates",
        content: `**Tagged Templates** allow you to parse template literals with a custom function. The tag function receives:
1. An array of static string chunks.
2. The evaluated values of the expressions as subsequent arguments (\`...values\`).

This feature powers libraries like \`styled-components\`, GraphQL query parsers, and localization/sanitization formatters.`,
        code: `function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i] ? \`<strong>\${values[i]}</strong>\` : '';
        return result + str + value;
    }, '');
}

const name = "John";
const score = 95;
console.log(highlight\`Player \${name} scored \${score} points.\`);
// Output: Player <strong>John</strong> scored <strong>95</strong> points.`
      },
      {
        id: "6.4",
        title: "6.4 Advanced Features: Raw Strings & Nested Templates",
        content: `• **Raw Strings**: The \`String.raw\` tag displays escape sequences (such as \`\\n\`) as literal characters rather than interpreted whitespace.
• **Nested Template Literals**: You can nest template literals inside expression placeholders \`\${...}\` for concise conditional formatting.`,
        code: `// Raw strings (preserves \\n literally)
console.log(String.raw\`Hello\\nWorld\`); // Output: Hello\\nWorld

// Nested template literals
const isError = false;
const errorCode = 500;
const message = \`Status: \${isError ? \`ERROR: \${errorCode}\` : 'OK'}\`;
console.log(message); // "Status: OK"`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 7: CONDITIONALS
  // =========================================================================
  {
    id: "conditionals",
    number: "7",
    title: "Conditionals & Branching Logic",
    summary: "if/else control structures, ternary operators, switch statements with expression matching, and short-circuit evaluation.",
    subsections: [
      {
        id: "7.1",
        title: "7.1 if, else if, and else",
        content: `The \`if\` statement executes a statement or block if a specified condition evaluates to truthy. If the condition is falsy, an alternative \`else if\` or \`else\` block can be executed.`,
        code: `const score = 85;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}`
      },
      {
        id: "7.2",
        title: "7.2 The Ternary Operator",
        content: `The conditional (ternary) operator is the only JavaScript operator that takes three operands: a condition followed by a question mark (\`?\`), an expression to execute if truthy, a colon (\`:\`), and an expression to execute if falsy.

Ternary operators return a value, making them ideal for variable assignments and JSX expressions.`,
        code: `const age = 20;
const status = age >= 18 ? "Adult" : "Minor";

// Nested ternary (use cautiously for readability)
const score = 85;
const grade = score >= 90 ? "A" :
              score >= 80 ? "B" :
              score >= 70 ? "C" : "F";`
      },
      {
        id: "7.3",
        title: "7.3 switch Statement & Expression Matching",
        content: `The \`switch\` statement evaluates an expression and executes statements associated with matching \`case\` labels using strict equality (\`===\`).

### Advanced: \`switch (true)\` Expression Matching
You can pass \`true\` as the switch expression to cleanly test complex range conditions without deeply nested \`if/else\` ladders.`,
        code: `const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;
    case "Friday":
        console.log("Almost weekend!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Midweek day");
}

// Switch with boolean expression matching
const score = 92;
switch (true) {
    case score >= 90:
        console.log("Excellent");
        break;
    case score >= 70:
        console.log("Good");
        break;
    default:
        console.log("Needs improvement");
}`
      },
      {
        id: "7.4",
        title: "7.4 Short-circuit Evaluation for Conditionals",
        content: `Logical operators can replace verbose \`if\` statements for concise default assignments and guarded function execution.`,
        code: `// Default values using ||
const userInput = "";
const username = userInput || "Anonymous";

// Conditional execution using &&
const isLoggedIn = true;
const showDashboard = () => console.log("Rendering Dashboard");
isLoggedIn && showDashboard();

// Nullish coalescing for safe defaults
const count = 0;
const finalCount = count ?? 10; // Preserves 0`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 8: LOOPS
  // =========================================================================
  {
    id: "loops",
    number: "8",
    title: "Loops & Iteration Controls",
    summary: "for, while, do-while, for..of, for..in with prototype guards, break, continue, and loop labels.",
    subsections: [
      {
        id: "8.1",
        title: "8.1 Traditional for Loops",
        content: `A \`for\` loop repeats until a specified condition evaluates to false. It consists of initialization, condition, and final-expression steps. You can also declare multiple loop counters.`,
        code: `// Traditional for loop
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// Multiple loop variables
for (let i = 0, j = 10; i < j; i++, j--) {
    console.log(i, j);
}

// Infinite loop pattern (avoid without break!)
for (;;) {
    // Requires an explicit break
    break;
}`
      },
      {
        id: "8.2",
        title: "8.2 while and do...while Loops",
        content: `• **\`while\` Loop**: Evaluates the condition before each iteration. If false from the beginning, the body never runs.
• **\`do...while\` Loop**: Evaluates the condition **after** each iteration. Guarantees that the loop body executes **at least once**.`,
        code: `// while loop
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// do-while loop (executes at least once)
let j = 0;
do {
    console.log(j); // Prints 0 even if condition is immediately false
    j++;
} while (j < 0);`
      },
      {
        id: "8.3",
        title: "8.3 for...of Loop (ES6 Iterables)",
        content: `Introduced in ES6, \`for...of\` iterates over **iterable objects** (including Arrays, Strings, Sets, Maps, NodeLists, and generator outputs), retrieving the **values** directly.`,
        code: `// Iterating Arrays
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
    console.log(fruit);
}

// Iterating Strings
for (const char of "Hello") {
    console.log(char);
}`
      },
      {
        id: "8.4",
        title: "8.4 for...in Loop (Object Properties)",
        content: `The \`for...in\` loop iterates over all **enumerable property keys** of an object, including properties inherited across its prototype chain.

### The hasOwnProperty Guard:
Because \`for...in\` walks up the prototype chain, always use \`Object.hasOwn(obj, key)\` or \`person.hasOwnProperty(key)\` to ensure you only process own properties.`,
        code: `const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

// Iterates over keys
for (const key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}

// Safe iteration guarding against inherited properties:
for (const key in person) {
    if (Object.hasOwn(person, key)) {
        console.log(key, person[key]);
    }
}`
      },
      {
        id: "8.5",
        title: "8.5 Loop Control: break, continue, and Labeled Statements",
        content: `• **\`break\`**: Terminate the loop immediately and pass execution to the statement following the loop.
• **\`continue\`**: Skip the remainder of the current iteration and jump to the next iteration.
• **Loop Labels**: Identifiers followed by a colon that allow breaking out of nested loop structures.`,
        code: `// break - exit loop entirely
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i); // 0, 1, 2, 3, 4
}

// continue - skip current iteration
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i); // 0, 1, 3, 4
}

// Labels for breaking outer nested loops
outerLoop: for (let i = 0; i < 3; i++) {
    innerLoop: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outerLoop; // Exits both loops!
        console.log(i, j);
    }
}`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 9: ARRAYS
  // =========================================================================
  {
    id: "arrays",
    number: "9",
    title: "Arrays & Essential Methods",
    summary: "Transformations with map, filter, reduce, predicates some and every, slice vs splice, and array destructuring.",
    subsections: [
      {
        id: "9.1",
        title: "9.1 Essential Functional Methods: map, filter, reduce",
        content: `### 1. \`map()\`
Transforms every element of an array by calling a callback function, returning a **new array of identical length** without mutating the original.

### 2. \`filter()\`
Creates a shallow copy of a portion of an array containing only elements that return truthy from a provided predicate test.

### 3. \`reduce()\`
Executes a user-supplied reducer callback function on each element of the array, passing the return value from the calculation on the preceding element. It accumulates results into a single value (number, object, or array).`,
        code: `// map - transform elements
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // [2, 4, 6]

// filter - select elements based on condition
const evens = [1, 2, 3, 4, 5].filter(num => num % 2 === 0); // [2, 4]

// reduce - accumulate values (sum)
const sum = [1, 2, 3, 4].reduce((acc, curr) => acc + curr, 0); // 10

// reduce - group by property
const people = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 25 }
];

const groupedByAge = people.reduce((acc, person) => {
    const age = person.age;
    if (!acc[age]) acc[age] = [];
    acc[age].push(person);
    return acc;
}, {});
// Result: { 25: [{...}, {...}], 30: [{...}] }`
      },
      {
        id: "9.2",
        title: "9.2 Predicate & Search Methods: some, every, find, findIndex",
        content: `• **\`some()\`**: Returns \`true\` if **at least one** element in the array passes the test.
• **\`every()\`**: Returns \`true\` only if **all** elements in the array pass the test.
• **\`find()\`**: Returns the **first element** that satisfies the test, or \`undefined\`.
• **\`findIndex()\`**: Returns the **index of the first element** that satisfies the test, or \`-1\`.`,
        code: `const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(num => num % 2 === 0); // true
const allEven = numbers.every(num => num % 2 === 0); // false

const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];
const user = users.find(u => u.id === 2); // { id: 2, name: "Jane" }
const index = users.findIndex(u => u.id === 2); // 1`
      },
      {
        id: "9.3",
        title: "9.3 Mutating vs Non-Mutating: slice vs splice & forEach",
        content: `### \`slice()\` (Non-Mutating)
Returns a shallow copy of a portion of an array specified by start (inclusive) and end (exclusive) indices. Negative indices count from the end.

### \`splice()\` (Mutating)
Changes the contents of an array **in place** by removing, replacing, or adding elements.

### \`forEach()\`
Executes a function on each element. **Note: You cannot break or return out of a forEach loop early.**`,
        code: `// slice - returns new array (original intact)
const arr = [1, 2, 3, 4, 5];
console.log(arr.slice(1, 3)); // [2, 3]
console.log(arr.slice(-2));   // [4, 5]

// splice - modifies original array in place
const arr2 = [1, 2, 3, 4, 5];
arr2.splice(2, 1);          // Removes 1 element at index 2 -> [1, 2, 4, 5]
arr2.splice(1, 0, 'a', 'b'); // Inserts 'a', 'b' at index 1 -> [1, 'a', 'b', 2, 4, 5]`
      },
      {
        id: "9.4",
        title: "9.4 Array Destructuring",
        content: `Array destructuring extracts values from arrays into distinct variables using syntax that mirrors array literals.`,
        code: `const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]

// Swapping variables without temporary variables:
let a = 1, b = 2;
[a, b] = [b, a]; // a=2, b=1

// Default fallback values:
const [x = 10, y = 20] = [5];
console.log(x, y); // 5, 20`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 10: STRINGS
  // =========================================================================
  {
    id: "strings",
    number: "10",
    title: "Strings & Text Processing",
    summary: "String access, searching methods, extraction with slice and substring, manipulation, splitting, joining, and Unicode.",
    subsections: [
      {
        id: "10.1",
        title: "10.1 Length, Character Access & Searching",
        content: `Strings are immutable UTF-16 character sequences.

### Character Access:
• \`str[index]\` or \`str.charAt(index)\`: Returns character at index.
• \`str.at(-1)\` (ES2022): Supports negative indices to read from the end.
• \`str.charCodeAt(index)\`: Returns the UTF-16 code unit integer.

### Searching:
• \`indexOf()\` & \`lastIndexOf()\`: Locate substring positions.
• \`includes()\`, \`startsWith()\`, \`endsWith()\`: Return boolean indicators.`,
        code: `const str = "Hello World";
str.length;                 // 11
str[0];                     // "H"
str.charAt(0);              // "H"
str.charCodeAt(0);          // 72 (Unicode code point)
str.at(-1);                 // "d" (ES2022 negative indexing)

// Searching:
str.indexOf("World");       // 6
str.includes("Hello");      // true
str.startsWith("He");       // true
str.endsWith("ld");         // true`
      },
      {
        id: "10.2",
        title: "10.2 Extraction Methods: slice vs substring vs substr",
        content: `### \`slice(start, end)\`
Extracts a section and returns a new string. Supports negative indices (counts from end of string).

### \`substring(start, end)\`
Similar to \`slice\`, but treats negative arguments as \`0\` and swaps \`start\` and \`end\` if \`start > end\`.

### \`substr(start, length)\`
Deprecated legacy method. Avoid in modern code.`,
        code: `const str = "Hello World";

str.slice(6, 11);          // "World"
str.substring(6, 11);      // "World"

// Differences with negative indices:
str.slice(2, -1);          // "llo Worl"
str.substring(2, -1);      // "He" (treated as substring(2, 0) -> substring(0, 2))`
      },
      {
        id: "10.3",
        title: "10.3 Modification, Splitting, and Joining",
        content: `Because strings are immutable, modification methods always return a **new string**.

• \`toLowerCase()\` & \`toUpperCase()\`
• \`trim()\`, \`trimStart()\`, \`trimEnd()\` (removes whitespace)
• \`replace(target, replacement)\`: Replaces first match or regex matches
• \`split(separator, limit)\`: Splits a string into an array of substrings
• \`join(separator)\`: Array method that joins elements back into a string`,
        code: `const str = "Hello World";

str.toLowerCase();          // "hello world"
str.toUpperCase();          // "HELLO WORLD"

"  Hello  ".trim();         // "Hello"
"  Hello  ".trimStart();    // "Hello  "
"  Hello  ".trimEnd();      // "  Hello"

str.replace("World", "JS"); // "Hello JS"
str.replace(/o/g, "0");     // "Hell0 W0rld"

// Splitting and Joining:
const fruits = "apple,banana,orange";
const list = fruits.split(","); // ["apple", "banana", "orange"]
const reconstructed = list.join(" - "); // "apple - banana - orange"`
      },
      {
        id: "10.4",
        title: "10.4 Unicode and Special Characters",
        content: `JavaScript strings use UTF-16 encoding. Standard ASCII and Latin characters fit into a single 16-bit code unit, while emojis and rare characters require a **surrogate pair** (two 16-bit units).

• \`for...of\` loops correctly iterate through Unicode code points rather than splitting surrogate pairs.
• \`normalize()\`: Normalizes characters with diacritical marks (e.g. \`café\`).`,
        code: `// Unicode escape sequences
console.log("\\u0041");      // "A"
console.log("\\u{1F600}");   // "😀" (ES6 Unicode code point)

// for...of handles surrogate pairs correctly:
for (const char of "😀🎉") {
    console.log(char); // "😀", then "🎉"
}

// Normalization:
"café".normalize();`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 11: OBJECTS
  // =========================================================================
  {
    id: "objects",
    number: "11",
    title: "Objects, Property Descriptors & Prototypes",
    summary: "Basic object operations, Object.keys/values/entries, destructuring, spread operator, property descriptors, and prototype inheritance.",
    subsections: [
      {
        id: "11.1",
        title: "11.1 Basic Operations & Accessors",
        content: `Objects in JavaScript are mutable key-value dictionaries. Keys are either Strings or Symbols. Values can be of any data type.

### Property Access:
• **Dot notation** (\`obj.prop\`): Used for valid identifier names.
• **Bracket notation** (\`obj["prop"]\`): Required for dynamic expressions, variables, or keys containing hyphens/spaces.`,
        code: `const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    greet() {
        return \`Hello, I'm \${this.firstName}\`;
    }
};

// Access
console.log(person.firstName);      // "John"
console.log(person["firstName"]);   // "John" (computed property)

// Modification & Addition
person.age = 31;
person["country"] = "USA";

// Delete property
delete person.age;`
      },
      {
        id: "11.2",
        title: "11.2 Object.keys(), Object.values(), Object.entries()",
        content: `ES6+ provides static methods to extract arrays from an object's enumerable own properties:
• \`Object.keys(obj)\`: Returns an array of keys (\`string[]\`).
• \`Object.values(obj)\`: Returns an array of values.
• \`Object.entries(obj)\`: Returns an array of \`[key, value]\` tuple pairs.`,
        code: `const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

Object.keys(person);    // ["name", "age", "city"]
Object.values(person);  // ["John", 30, "NYC"]
Object.entries(person); // [["name", "John"], ["age", 30], ["city", "NYC"]]

// Practical iteration:
for (const [key, value] of Object.entries(person)) {
    console.log(\`\${key}: \${value}\`);
}

// Convert object to Map:
const map = new Map(Object.entries(person));`
      },
      {
        id: "11.3",
        title: "11.3 Object Destructuring",
        content: `Object destructuring unpacks properties from objects into variables. Supports variable renaming, default fallback values, nested extraction, and rest properties.`,
        code: `const user = {
    id: 1,
    name: "John",
    age: 30,
    address: {
        city: "NYC",
        zip: "10001"
    }
};

// Basic destructuring
const { name, age } = user;

// Renaming variables
const { name: userName, age: userAge } = user;

// Default values
const { country = "USA" } = user;

// Nested destructuring
const { address: { city, zip } } = user;

// Rest operator
const { id, ...rest } = user;
console.log(rest); // { name: "John", age: 30, address: {...} }`
      },
      {
        id: "11.4",
        title: "11.4 Spread Operator & Object Utility Methods",
        content: `• **Spread Operator (\`{ ...obj }\`)**: Creates a shallow copy or merges multiple objects.
• **\`Object.assign(target, ...sources)\`**: Alternative method for shallow copying.
• **\`Object.freeze(obj)\`**: Makes an object completely immutable (cannot add, delete, or modify properties).
• **\`Object.seal(obj)\`**: Prevents adding or deleting properties, but existing writable properties can still be modified.
• **\`Object.is(val1, val2)\`**: Same-value equality check (distinguishes \`+0\` from \`-0\` and treats \`NaN === NaN\`).`,
        code: `const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

// Merge objects (ES2018)
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 3, c: 4 }

// Shallow clone
const clone = { ...obj1 };

// Object immutability
Object.freeze(obj1);
// obj1.a = 99; // Silent failure in non-strict, TypeError in strict mode`
      },
      {
        id: "11.5",
        title: "11.5 Property Descriptors & Object.defineProperty",
        content: `Every property on an object has an internal **Property Descriptor** governing its behavior:
• \`value\`: The actual stored value.
• \`writable\`: If \`false\`, the property cannot be reassigned.
• \`enumerable\`: If \`true\`, the property appears in \`for...in\` and \`Object.keys()\`.
• \`configurable\`: If \`false\`, the property cannot be deleted or reconfigured.`,
        code: `const obj = {};

Object.defineProperty(obj, 'readOnly', {
    value: 42,
    writable: false,
    enumerable: true,
    configurable: false
});

console.log(obj.readOnly); // 42
// obj.readOnly = 99; // Throws error in strict mode!

// Inspect descriptors:
console.log(Object.getOwnPropertyDescriptor(obj, 'readOnly'));`
      },
      {
        id: "11.6",
        title: "11.6 Prototypes & Inheritance",
        content: `JavaScript objects have a private internal link to another object called their **prototype**. When a property is requested that does not exist on the object itself, the engine searches the prototype chain until it finds the property or reaches \`null\`.

Use \`Object.create(proto)\` to create a new object with a specified prototype.`,
        code: `const animal = {
    eats: true,
    walk() {
        return "Animal walks";
    }
};

const rabbit = Object.create(animal, {
    jumps: {
        value: true,
        enumerable: true
    }
});

console.log(rabbit.eats);  // true (inherited from animal)
console.log(rabbit.walk()); // "Animal walks"

// Inspect prototype link:
console.log(Object.getPrototypeOf(rabbit) === animal); // true`
      }
    ]
  },

  // =========================================================================
  // CHAPTER 12: BEST PRACTICES, RESOURCES & PROGRESS CHECKLIST
  // =========================================================================
  {
    id: "best-practices-checklist",
    number: "12",
    title: "Best Practices Summary, Resources & Progress Checklist",
    summary: "Essential rules for variables, types, operators, arrays, and objects, official documentation links, and an interactive 10-point checklist.",
    subsections: [
      {
        id: "12.1",
        title: "12.1 Best Practices Summary",
        content: `### 1. Variables
• Use \`const\` by default for all variable declarations.
• Use \`let\` only when reassignment is strictly necessary (e.g. loop counters, mutable accumulators).
• Never use \`var\` in modern applications.
• Initialize variables when declaring them to minimize uninitialized state bugs.

### 2. Types & Operators
• Always use strict equality (\`===\`) instead of loose equality (\`==\`).
• Be explicit with type conversions (\`Number()\`, \`String()\`, \`Boolean()\`).
• Master the 8 falsy values (\`false\`, \`0\`, \`-0\`, \`0n\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`).
• Use Optional Chaining (\`?.\`) and Nullish Coalescing (\`??\`) instead of complex \`&&\` and \`||\` fallbacks.

### 3. Arrays & Functions
• Prefer functional array methods (\`map\`, \`filter\`, \`reduce\`) over imperative \`for\` loops.
• Use template literals (\`\${...}\`) instead of string concatenation with \`+\`.
• Destructure objects and arrays for clean, readable code.
• Use the spread operator (\`...\`) for shallow copying and immutability.

### 4. Objects
• Use ES6 shorthand object syntax (\`{ name, age }\`).
• Prefer \`Object.keys()\`, \`Object.values()\`, and \`Object.entries()\` over \`for...in\`.
• Use \`Object.freeze()\` for immutability when dealing with configuration or fixed state.
• Consider \`Map\` when keys are dynamic or non-string, and \`Set\` for unique collections.`
      },
      {
        id: "12.2",
        title: "12.2 Official Documentation & Recommended Resources",
        content: `### Official Documentation
• [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
• [ECMAScript Official Specification (TC39)](https://tc39.es/ecma262/)

### Recommended Reference Books
• *JavaScript: The Definitive Guide* by David Flanagan
• *Eloquent JavaScript* by Marijn Haverbeke
• *You Don't Know JS* (Book Series) by Kyle Simpson

### Practice Platforms
• [Codewars](https://www.codewars.com/)
• [LeetCode](https://leetcode.com/)
• [Exercism JavaScript Track](https://exercism.org/tracks/javascript)`
      },
      {
        id: "12.3",
        title: "12.3 Interactive 10-Point Progress Checklist",
        content: `Track your mastery across each foundational JavaScript topic. Click each item to toggle your mastery checklist:`,
        checklist: [
          { id: "chk_fundamentals", text: "1. Fundamentals: V8 Ignition & TurboFan, Call Stack, Host Concurrency, Strict Mode" },
          { id: "chk_variables", text: "2. Variables: Scope hierarchy, hoisting mechanics, TDZ, and var vs let vs const" },
          { id: "chk_datatypes", text: "3. Data Types: 7 primitives, reference heap memory, and typeof null detection" },
          { id: "chk_conversion", text: "4. Type Conversion: Explicit conversions vs implicit coercion and truthy/falsy evaluation" },
          { id: "chk_operators", text: "5. Operators: Strict === comparison, logical short-circuiting, ??, and ?." },
          { id: "chk_template", text: "6. Template Literals: String interpolation, multi-line strings, and tagged templates" },
          { id: "chk_conditionals", text: "7. Conditionals: if/else control flow, ternary operators, and switch statements" },
          { id: "chk_loops", text: "8. Loops: for, while, for..of, for..in, break/continue, and labeled loops" },
          { id: "chk_arrays", text: "9. Arrays: map, filter, reduce, some, every, slice vs splice, and destructuring" },
          { id: "chk_strings", text: "10. Strings: Searching, extraction slice vs substring, replace, and Unicode" },
          { id: "chk_objects", text: "11. Objects: Destructuring, spread, property descriptors, and prototypes" }
        ],
        callout: {
          type: "tip",
          text: "Happy Coding! Practice is key to mastering JavaScript! 🚀"
        }
      }
    ]
  }
];

// Write out to src/javascript/data/javascriptNotesData.js
const fileContent = `// src/javascript/data/javascriptNotesData.js
// JavaScript Basics - Comprehensive Curriculum
// Begins with Chapter 1 Fundamentals (V8, Call Stack, Concurrency) followed by Variables and core language mechanics.

export const JS_NOTES_METADATA = ${JSON.stringify(metadata, null, 2)};

export const JS_SECTIONS = ${JSON.stringify(sections, null, 2)};
`;

const targetPath = path.join(__dirname, '..', 'src', 'javascript', 'data', 'javascriptNotesData.js');
fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log('Successfully written updated javascriptNotesData.js with Chapter 1 Fundamentals + all 10 language topics!');
