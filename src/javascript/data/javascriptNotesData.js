// src/javascript/data/javascriptNotesData.js
// JavaScript Basics - Comprehensive Curriculum
// Begins with Chapter 1 Fundamentals (V8, Call Stack, Concurrency) followed by Variables and core language mechanics.

export const JS_NOTES_METADATA = {
  "title": "JavaScript Basics - Comprehensive Guide",
  "subtitle": "Master Curriculum & Complete In-Depth Reference",
  "level": "Beginner → Intermediate → Advanced",
  "purpose": "In-depth guide to fundamental JavaScript concepts with thorough explanations, examples, and best practices.",
  "version": "3.1.0"
};

export const JS_SECTIONS = [
  {
    "id": "fundamentals",
    "number": "1",
    "title": "JavaScript Fundamentals, Engines & Runtime Architecture",
    "summary": "What is JavaScript, core paradigms, the Chef mental model, single-threaded execution vs host runtime concurrency, V8 Ignition & TurboFan JIT pipeline, execution contexts, and strict mode.",
    "subsections": [
      {
        "id": "1.1",
        "title": "1.1 What is JavaScript? (Paradigms & Mental Model)",
        "content": "**JavaScript** is a high-level, dynamically typed, multi-paradigm language conforming to the ECMAScript specification.\n\n### Core Paradigms\n• **Procedural**: Structured sequential programming with functions, block scoping, and control flow.\n• **Object-Oriented**: Prototype-based object inheritance without rigid classical classes (ES6 `class` is syntactic sugar over prototype chains).\n• **Functional**: First-class functions, pure functions, closures, currying, and higher-order functions (`map`, `filter`, `reduce`).\n• **Event-Driven & Asynchronous**: Non-blocking I/O driven by an event loop, microtask queues, and callback/promise primitives.\n\n### The Master Chef Mental Model\nThink of JavaScript as a single master chef (the main thread Call Stack) working in a busy restaurant kitchen. The chef prepares one dish at a time from start to finish. Whenever an order requires long cooking (baking bread, roasting meat — equivalent to network HTTP requests, disk reads, or timers), the chef offloads it to the kitchen assistants (the Browser Web APIs or Node.js Libuv thread pool) and immediately resumes chopping vegetables for the next customer. When an assistant finishes, they place a ticket on the kitchen counter (Task/Microtask queue). The chef picks up the ticket only when the chopping board (call stack) is completely empty.",
        "interviewAnswer": "JavaScript is a high-level, dynamically typed language with first-class functions and prototype-based inheritance. It is single-threaded in its execution context but achieves high-throughput non-blocking concurrency via host runtime APIs and the event loop."
      },
      {
        "id": "1.2",
        "title": "1.2 Single-Threaded Execution vs Host Concurrency",
        "content": "A critical interview distinction: **JavaScript execution on the main thread is strictly single-threaded**, but the **surrounding runtime environment (Browser or Node.js) is multi-threaded**.\n\n### What is Single-Threaded?\n• The JavaScript engine (e.g. Google V8) has exactly **one Call Stack** and **one Memory Heap** per execution agent.\n• It executes one statement or bytecode instruction at a time. Long-running synchronous calculations (e.g. heavy crypto or image processing) freeze the thread, blocking user interactions and DOM updates.\n\n### What Provides Concurrency?\n• **In Browsers**: The browser engine provides background threads for HTTP network requests, timer interrupts (`setTimeout`), DOM event dispatching, and Web Workers for parallel background compute.\n• **In Node.js**: Libuv maintains a thread pool (default 4 C++ worker threads) for file system operations (`fs`), DNS lookups, and cryptographic hashing (`crypto.pbkdf2`), while OS kernel multiplexing (`epoll`, `kqueue`, `IOCP`) handles socket I/O.",
        "callout": {
          "type": "warning",
          "text": "Never say 'Node.js is completely single-threaded'. Node.js executes JavaScript on a single thread, but performs asynchronous I/O and heavy system tasks using operating-system kernel multiplexing and a C++ thread pool."
        }
      },
      {
        "id": "1.3",
        "title": "1.3 Engine Mechanics: V8 Ignition & TurboFan Pipeline",
        "content": "Modern JavaScript engines do not use simple naive interpretation. Engines like V8 (used in Chrome, Node.js, and Bun/Deno equivalents) employ a **Just-In-Time (JIT) Compilation Pipeline**:\n\n1. **Parser & Lexer**: Converts source code characters into tokens, then builds an **Abstract Syntax Tree (AST)**.\n2. **Ignition (Bytecode Interpreter)**: Compiles the AST into compact bytecode and executes it immediately with minimal startup delay. It collects runtime profile data (type feedback).\n3. **TurboFan (Optimizing Compiler)**: If a function is called repeatedly with the same argument types (\"hot code\"), TurboFan compiles that bytecode into blazing-fast native machine code using **Hidden Classes (Shapes)** and **Inline Caches (IC)**.\n4. **Deoptimization**: If an optimized function is suddenly passed an unexpected type (e.g. an array of strings instead of numbers), TurboFan deoptimizes the code, discards machine instructions, and falls back to Ignition bytecode interpretation.",
        "code": "// TurboFan Optimization Example:\nfunction add(a, b) {\n  return a + b;\n}\n\n// 1. Hot loop with consistent types (integers):\nfor (let i = 0; i < 10000; i++) {\n  add(1, 2); // TurboFan compiles to 1 CPU instruction: 'add eax, ebx'\n}\n\n// 2. Sudden type mutation triggers DEOPTIMIZATION:\nadd(\"hello\", \"world\"); // TurboFan must discard optimized machine code and bail out!"
      },
      {
        "id": "1.4",
        "title": "1.4 Execution Context & Call Stack Flow",
        "content": "Whenever JavaScript code runs, it executes inside an **Execution Context**.\n\n### 1. Global Execution Context (GEC)\nCreated when the script first loads. Sets up the global object (`window` in browsers, `global` in Node.js) and binds the `this` keyword.\n\n### 2. Function Execution Context (FEC)\nCreated every time a function is invoked. Each function call gets its own isolated context with its own arguments, local variable environment, and scope chain.\n\n### The Two Phases of Every Context:\n1. **Creation Phase**: The engine scans the code, allocates memory for variables and functions (Hoisting), creates the Scope Chain, and determines the `this` binding.\n2. **Execution Phase**: The engine executes code line-by-line, assigning values and evaluating expressions.\n\n### The Call Stack (LIFO)\nExecution contexts are managed in a **Last-In, First-Out (LIFO)** Call Stack. The Global Context sits at the base. Calling a function pushes a new context onto the stack; returning pops it off. Exceeding the maximum stack frame limit causes a `RangeError: Maximum call stack size exceeded` (Stack Overflow).",
        "code": "function first() {\n  console.log(\"Entering first\");\n  second();\n  console.log(\"Exiting first\");\n}\n\nfunction second() {\n  console.log(\"Inside second\");\n}\n\nfirst();\n// Call Stack Flow:\n// 1. Push Global Execution Context\n// 2. Push first() Context\n// 3. Push second() Context\n// 4. Pop second() Context\n// 5. Pop first() Context"
      },
      {
        "id": "1.5",
        "title": "1.5 Strict Mode ('use strict')",
        "content": "Introduced in ECMAScript 5, **Strict Mode** eliminates silent errors, prevents accidental globals, disables legacy syntax, and secures code against common runtime mistakes.\n\n### Key Strict Mode Guarantees:\n• **Prevents Accidental Globals**: Assigning to an undeclared variable throws a `ReferenceError` instead of implicitly attaching to the global object.\n• **Prevents Silent Failures**: Assigning to non-writable properties, getter-only properties, or deleting non-configurable properties throws a `TypeError`.\n• **Restricts `this` in Functions**: Unbound function invocations have `this === undefined` instead of defaulting to `window` or `global`.\n• **Disables `with` & Octal Literals**: Removes confusing, non-optimizable syntax.\n• **Prohibits Duplicate Parameter Names**: `function fn(a, a) {}` throws a syntax error.\n\n*Note: All ES Modules (`import`/`export`) and ES6 Classes are strictly in strict mode by default.*",
        "code": "'use strict';\n\n// 1. Accidental global:\n// count = 10; // ReferenceError: count is not defined\n\n// 2. Unbound function this:\nfunction checkThis() {\n  console.log(this);\n}\ncheckThis(); // undefined (in non-strict mode, would print window/global)\n\n// 3. Deleting non-configurable property:\n// delete Object.prototype; // TypeError: Cannot delete property 'prototype'"
      }
    ]
  },
  {
    "id": "variables",
    "number": "2",
    "title": "Variables, Scope & Temporal Dead Zone (TDZ)",
    "summary": "Declaration and scope with var, let, and const, block vs function scope, variable lifecycle, and the Temporal Dead Zone.",
    "subsections": [
      {
        "id": "2.1",
        "title": "2.1 Declaration and Scope: var (ES5 and earlier)",
        "content": "In JavaScript, variables declared with `var` are either **function-scoped** (if declared inside a function) or **globally scoped** (if declared outside any function). Block statements such as `if` or `for` do **not** create a new scope for `var`.\n\n### Key Characteristics of `var`:\n• **Function-scoped**: Variables declared inside a function cannot be accessed from outside, but variables declared inside an `if` or `for` block leak into the surrounding function or global scope.\n• **Hoisted with `undefined`**: When the engine compiles the code, declarations are hoisted to the top of the function/global context and initialized to `undefined`.\n• **Re-declaration allowed**: You can declare the same variable identifier multiple times in the same scope without syntax errors, which is a frequent source of bugs.\n• **Global object pollution**: Top-level `var` declarations create properties on the global object (`window` in browsers).",
        "code": "var x = 10;\nvar x = 20; // Re-declaration allowed (potential bug source)\n\nfunction example() {\n    var y = 30;\n    if (true) {\n        var y = 40; // Same variable, block doesn't create new scope\n        console.log(y); // 40\n    }\n    console.log(y); // 40 (not 30!) - Hoisted to function scope\n}\nexample();",
        "callout": {
          "type": "warning",
          "text": "Avoid using var in modern JavaScript. Its lack of block scoping and silent re-declaration make it prone to accidental variable shadowing and leaks."
        }
      },
      {
        "id": "2.2",
        "title": "2.2 Declaration and Scope: let (ES6+)",
        "content": "Introduced in ECMAScript 2015 (ES6), `let` provides **block-scoped** variable bindings that solve the scoping issues of `var`.\n\n### Key Characteristics of `let`:\n• **Block-scoped**: Any pair of curly braces `{ ... }` (functions, `if` statements, `for` loops, or standalone blocks) creates an isolated scope.\n• **No re-declaration in the same scope**: Attempting to declare the same identifier twice within the same block scope throws a `SyntaxError`.\n• **Reassignment allowed**: You can assign new values to a `let` variable at any time.\n• **Temporal Dead Zone**: Unlike `var`, accessing a `let` variable before its declaration throws a `ReferenceError`.\n• **No global object pollution**: Top-level `let` variables in browsers do not attach to `window`.",
        "code": "let x = 10;\n// let x = 20; // SyntaxError: Identifier 'x' has already been declared\nx = 20; // Reassignment allowed\n\nif (true) {\n    let y = 30;\n    // let y = 40; // SyntaxError: Cannot re-declare in same block\n    console.log(y); // 30\n}\n// console.log(y); // ReferenceError: y is not defined (contained in block!)"
      },
      {
        "id": "2.3",
        "title": "2.3 Declaration and Scope: const (ES6+)",
        "content": "`const` behaves like `let` with one vital distinction: it creates an **immutable binding** (a constant reference).\n\n### Key Characteristics of `const`:\n• **Block-scoped**: Exactly like `let`, it is confined to the enclosing `{ ... }` block.\n• **Must be initialized at declaration**: You cannot declare `const x;` without assigning a value immediately (throws `SyntaxError: Missing initializer in const declaration`).\n• **Cannot be reassigned**: Attempting to reassign a `const` identifier throws `TypeError: Assignment to constant variable`.\n• **Reference vs Value Mutability**: For objects and arrays, the *binding reference* is constant, but the *internal properties or elements* can still be mutated!\n• **True Immutability**: To prevent object properties from being mutated, use `Object.freeze()`.",
        "code": "const PI = 3.14159;\n// PI = 3.14; // TypeError: Assignment to constant variable\n\nconst user = { name: \"John\" };\nuser.name = \"Jane\"; // Allowed - object properties can change\nconsole.log(user.name); // \"Jane\"\n\n// user = { name: \"Bob\" }; // Not allowed - cannot reassign reference\n\n// For true immutability:\nconst frozenUser = Object.freeze({ name: \"Alice\" });\n// frozenUser.name = \"Charlie\"; // Fails silently (or throws TypeError in strict mode)"
      },
      {
        "id": "2.4",
        "title": "2.4 Temporal Dead Zone (TDZ)",
        "content": "The **Temporal Dead Zone (TDZ)** is the time span between entering a scope and the line of code where a variable is formally initialized.\n\nDuring compile time, the engine scans the scope and registers `let` and `const` identifiers in the Lexical Environment, but marks them as **uninitialized**. Attempting to access an uninitialized variable throws a `ReferenceError`.\n\n### Why does the TDZ exist?\n1. **Catches bugs early**: Reading a variable before assigning its value is almost always a logical flaw.\n2. **Maintains `const` integrity**: If `const` were hoisted and initialized to `undefined` like `var`, its value would transition from `undefined` to its assigned value, violating the guarantee of constant immutability.",
        "code": "console.log(a); // undefined (var is hoisted and initialized to undefined)\nvar a = 10;\n\n// <--- TDZ for variable 'b' begins here at block entry\n// console.log(b); // ReferenceError: Cannot access 'b' before initialization\nlet b = 20; // <--- TDZ for 'b' ends here!\nconsole.log(b); // 20"
      },
      {
        "id": "2.5",
        "title": "2.5 Comparison Matrix: var vs let vs const",
        "table": {
          "headers": [
            "Feature",
            "var",
            "let",
            "const"
          ],
          "rows": [
            [
              "Scope",
              "Function Scope",
              "Block Scope",
              "Block Scope"
            ],
            [
              "Hoisting",
              "Hoisted + initialized to undefined",
              "Hoisted in TDZ (uninitialized)",
              "Hoisted in TDZ (uninitialized)"
            ],
            [
              "Re-declaration",
              "Allowed in same scope",
              "SyntaxError",
              "SyntaxError"
            ],
            [
              "Reassignment",
              "Allowed",
              "Allowed",
              "TypeError"
            ],
            [
              "Must initialize",
              "No (defaults to undefined)",
              "No (defaults to undefined)",
              "Yes (mandatory at declaration)"
            ],
            [
              "Global object property",
              "Yes (window.x in browsers)",
              "No",
              "No"
            ]
          ]
        }
      }
    ]
  },
  {
    "id": "data-types",
    "number": "3",
    "title": "Data Types & Type Detection",
    "summary": "The 7 primitive types, non-primitive reference types, memory heap vs call stack, and reliable type detection with typeof and Array.isArray.",
    "subsections": [
      {
        "id": "3.1",
        "title": "3.1 The 7 Primitive Types",
        "content": "JavaScript primitives are **immutable values** stored directly on the stack or inline in engine registers. They represent atomic data.\n\n1. **String**: Textual data enclosed in single quotes, double quotes, or backticks (```).\n2. **Number**: Double-precision 64-bit IEEE 754 floating-point numbers. Can represent integers up to $\\pm(2^{53} - 1)$ plus special values `Infinity`, `-Infinity`, and `NaN` (Not-a-Number).\n3. **Boolean**: Logical values `true` or `false`.\n4. **Undefined**: Automatically assigned to a variable that has been declared but not assigned any value.\n5. **Null**: Intentional assignment indicating the absence of any object value.\n6. **Symbol**: Unique, immutable identifier introduced in ES6, commonly used as non-enumerable object property keys.\n7. **BigInt**: Arbitrary-precision integers introduced in ES2020, designated by appending `n` to an integer literal.",
        "code": "// 1. String\nlet str1 = 'Single quotes';\nlet str2 = \"Double quotes\";\nlet str3 = `Template literal ${str1}`;\n\n// 2. Number\nlet num = 42;\nlet float = 3.14;\nlet infinity = Infinity;\nlet nan = NaN; // Note: typeof NaN is \"number\"!\n\n// 3. Boolean\nlet isTrue = true;\nlet isFalse = false;\n\n// 4. Undefined\nlet x;\nconsole.log(x); // undefined\n\n// 5. Null\nlet y = null;\nconsole.log(y === null); // true\n\n// 6. Symbol\nconst sym1 = Symbol('id');\nconst sym2 = Symbol('id');\nconsole.log(sym1 === sym2); // false (Symbols are always globally unique)\n\n// 7. BigInt\nconst bigNum = 1234567890123456789012345678901234567890n;\nconst bigNum2 = BigInt(\"123456789012345678901234567890\");"
      },
      {
        "id": "3.2",
        "title": "3.2 Non-Primitive (Reference) Types",
        "content": "Any value in JavaScript that is not one of the 7 primitives is an **Object**. Objects are reference types allocated in the **Memory Heap**. Variables hold a pointer (memory address) referencing that heap location.\n\n### Categories of Reference Types:\n• **Object Literals**: Collections of key-value pairs (`{ name: \"John\", age: 30 }`).\n• **Arrays**: Ordered list of elements indexed by numerical keys. Arrays are special objects with an automatic `length` property.\n• **Functions**: Callable objects that can be passed as arguments, assigned to variables, and returned from other functions (first-class functions).\n• **Built-in Objects**: `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, `WeakSet`, and `Promise`.",
        "code": "// Object literal\nlet user = {\n    name: \"John\",\n    age: 30,\n    isAdmin: true\n};\n\n// Arrays (special type of object)\nlet arr = [1, 2, 3];\n\n// Functions (callable objects)\nfunction greet() {\n    return \"Hello\";\n}"
      },
      {
        "id": "3.3",
        "title": "3.3 Type Detection & The typeof Null Gotcha",
        "content": "JavaScript provides the `typeof` operator to inspect the data type of an expression.\n\n### The typeof null Bug\nIn the original implementation of JavaScript, values were stored in 32-bit units with a type tag in the lower 3 bits. The type tag for objects was `000`. Because `null` was represented as a NULL pointer (`0x00`), its type tag was also `000`, causing `typeof null` to return `\"object\"`. This bug cannot be fixed in ECMAScript because doing so would break millions of legacy websites.\n\n### Reliable Type Checking:\n• **For Primitives**: Use `typeof value`.\n• **For Null**: Check explicitly with `value === null`.\n• **For Arrays**: Always use `Array.isArray(value)` instead of `typeof`.",
        "code": "typeof \"hello\"      // \"string\"\ntypeof 42           // \"number\"\ntypeof true         // \"boolean\"\ntypeof undefined    // \"undefined\"\ntypeof null         // \"object\" (Historical bug!)\ntypeof Symbol()     // \"symbol\"\ntypeof 123n         // \"bigint\"\ntypeof {}           // \"object\"\ntypeof []           // \"object\" (Do not use typeof for arrays!)\ntypeof function(){} // \"function\"\n\n// Correct Array Detection:\nArray.isArray([])   // true\nArray.isArray({})   // false\n\n// Correct Null Detection:\nconst isNull = (val) => val === null;"
      }
    ]
  },
  {
    "id": "type-conversion",
    "number": "4",
    "title": "Type Conversion & Coercion",
    "summary": "Explicit (manual) conversion vs implicit (automatic) coercion across string, number, and boolean contexts, and truthy vs falsy evaluation.",
    "subsections": [
      {
        "id": "4.1",
        "title": "4.1 Explicit (Manual) Conversion",
        "content": "Explicit conversion occurs when a developer deliberately converts a value from one type to another using built-in constructors or functions.\n\n### 1. To String\n• `String(value)`: Works on all types, converting `null` to `\"null\"` and `undefined` to `\"undefined\"`.\n• `value.toString()`: Available on primitives (via auto-boxing) and objects, but throws a `TypeError` if called on `null` or `undefined`.\n\n### 2. To Number\n• `Number(value)`: Converts strings, booleans, and `null` to numbers. If the string contains non-numeric characters, it returns `NaN`.\n• `parseInt(str, radix)`: Parses an integer from left to right, stopping at the first non-digit.\n• `parseFloat(str)`: Parses a floating-point number.\n\n### 3. To Boolean\n• `Boolean(value)` or `!!value`: Converts any value to `true` or `false` based on truthiness.",
        "code": "// --- Explicit To String ---\nString(123);        // \"123\"\nString(true);       // \"true\"\nString(null);       // \"null\"\nString(undefined);  // \"undefined\"\n(123).toString();   // \"123\"\n\n// --- Explicit To Number ---\nNumber(\"123\");      // 123\nNumber(\"123abc\");   // NaN (strict parsing)\nNumber(true);       // 1\nNumber(false);      // 0\nNumber(null);       // 0\nNumber(undefined);  // NaN\nparseInt(\"123px\", 10); // 123 (parses until invalid char)\nparseFloat(\"3.14em\");  // 3.14\n\n// --- Explicit To Boolean ---\nBoolean(0);         // false\nBoolean(1);         // true\nBoolean(\"\");        // false\nBoolean(\"hello\");   // true\nBoolean([]);        // true (empty array is truthy!)\nBoolean({});        // true (empty object is truthy!)\nBoolean(null);      // false\nBoolean(undefined); // false\nBoolean(NaN);       // false"
      },
      {
        "id": "4.2",
        "title": "4.2 Implicit (Automatic) Coercion",
        "content": "Implicit coercion occurs when the JavaScript engine automatically converts types during an operation (such as addition, subtraction, or logical comparison).\n\n### 1. String Context (The `+` operator)\nIf either operand to the binary `+` operator is a string, JavaScript converts the other operand to a string and performs **concatenation**. Operations evaluate from left to right.\n\n### 2. Number Context (`-`, `*`, `/`, `%`, `>`, `<`)\nMathematical operators other than `+` automatically coerce operands to numbers.\n\n### 3. Boolean Context\nConditional statements (`if`, `while`, `&&`, `||`) automatically coerce their expressions to booleans.",
        "code": "// --- String Coercion ---\n\"value: \" + 42;     // \"value: 42\"\n\"3\" + 4 + 5;        // \"345\" (\"3\" + 4 = \"34\", \"34\" + 5 = \"345\")\n3 + 4 + \"5\";        // \"75\" (3 + 4 = 7, 7 + \"5\" = \"75\")\n\n// --- Number Coercion ---\n\"42\" - 2;           // 40\n\"42\" * 2;           // 84\n\"42\" / 2;           // 21\n\"42\" > 40;          // true (coerced to 42 > 40)"
      },
      {
        "id": "4.3",
        "title": "4.3 Truthy and Falsy Values",
        "content": "In JavaScript, every value is inherently either **falsy** or **truthy** when evaluated in a boolean context.\n\n### The Complete List of Falsy Values:\nThere are exactly **8 falsy values** in ECMAScript:\n1. `false`\n2. `0`\n3. `-0`\n4. `0n` (BigInt zero)\n5. `\"\"` (empty string)\n6. `null`\n7. `undefined`\n8. `NaN`\n\n### Everything Else is Truthy!\nAll other values evaluate to `true`, including:\n• Empty arrays: `[]`\n• Empty objects: `{}`\n• Empty functions: `function(){}`\n• Strings containing whitespace: `\" \"` or `\"false\"`",
        "code": "if ([]) {\n    console.log(\"Array is truthy!\"); // Prints: \"Array is truthy!\"\n}\n\nif ({}) {\n    console.log(\"Object is truthy!\"); // Prints: \"Object is truthy!\"\n}\n\nif (\"false\") {\n    console.log(\"String 'false' is truthy!\"); // Prints: \"String 'false' is truthy!\"\n}"
      }
    ]
  },
  {
    "id": "operators",
    "number": "5",
    "title": "Operators & Modern Syntax",
    "summary": "Loose equality (==) vs strict equality (===), logical short-circuiting, nullish coalescing (??), and optional chaining (?.).",
    "subsections": [
      {
        "id": "5.1",
        "title": "5.1 Equality Operators: == vs ===",
        "content": "### `==` (Loose Equality - Performs Type Coercion)\nThe loose equality operator compares values **after** coercing them to a common type. This creates surprising, non-transitive edge cases.\n\n### `===` (Strict Equality - No Coercion)\nThe strict equality operator checks both **type** and **value**. If the types are different, it immediately returns `false`.\n\n### Simplified Abstract Equality Algorithm for `==`:\n1. If types are identical, compare like `===`.\n2. If comparing `null` and `undefined`, return `true`.\n3. If comparing a number and a string, coerce the string to a number.\n4. If comparing a boolean, coerce the boolean to a number (`true → 1`, `false → 0`).\n5. If comparing an object with a primitive, convert the object via `[Symbol.toPrimitive]` or `valueOf()`/`toString()`.",
        "code": "// --- Loose Equality (==) with Coercion ---\n5 == \"5\";           // true\n0 == false;         // true (false coerced to 0)\nnull == undefined;  // true (special rule)\n\"\" == 0;            // true (\"\" coerced to 0)\n[] == 0;            // true ([] coerced to \"\" then 0)\n\n// --- Strict Equality (===) No Coercion ---\n5 === \"5\";          // false\n0 === false;        // false\nnull === undefined; // false\n\"\" === 0;           // false\n[] === 0;           // false"
      },
      {
        "id": "5.2",
        "title": "5.2 Logical Operators: &&, ||, and !",
        "content": "Logical operators in JavaScript return the value of one of the specified operands, not necessarily a boolean.\n\n### 1. Logical AND (`&&`)\nEvaluates operands from left to right. Returns the **first falsy value** encountered. If all operands are truthy, returns the **last operand**.\n\n### 2. Logical OR (`||`)\nEvaluates operands from left to right. Returns the **first truthy value** encountered. If all operands are falsy, returns the **last operand**.\n\n### 3. Logical NOT (`!`) and Double NOT (`!!`)\n`!` inverts the truthiness of an operand and returns a boolean. `!!` casts any value to its exact boolean equivalent.",
        "code": "// --- Logical AND (&&) ---\ntrue && true;       // true\ntrue && false;      // false\n0 && \"hello\";       // 0 (returns first falsy)\n\"hello\" && \"world\"; // \"world\" (returns last truthy)\n\n// --- Logical OR (||) ---\ntrue || false;      // true\nfalse || false;     // false\n0 || \"hello\";       // \"hello\" (returns first truthy)\n\"\" || null || 0;    // 0 (returns last falsy)\n\n// --- Logical NOT (!) & Double NOT (!!) ---\n!true;              // false\n!\"hello\";           // false\n!!\"hello\";          // true (double NOT for clean boolean cast)"
      },
      {
        "id": "5.3",
        "title": "5.3 Nullish Coalescing (??) (ES2020)",
        "content": "The **Nullish Coalescing operator (`??`)** returns its right-hand operand when its left-hand operand is **`null` or `undefined`**. Otherwise, it returns its left-hand operand.\n\n### Why ?? is Better than || for Defaults:\nThe `||` operator treats `0`, `\"\"`, and `false` as falsy, triggering the default value even when `0` or `\"\"` is a valid user input! The `??` operator only falls back on actual nullish values (`null` and `undefined`).",
        "code": "null ?? \"default\";      // \"default\"\nundefined ?? \"default\"; // \"default\"\n0 ?? \"default\";         // 0 (correctly preserved!)\n\"\" ?? \"default\";        // \"\" (correctly preserved!)\n\n// Comparison with ||:\nconst count = 0;\nconst displayCount1 = count || 10; // 10 (Bug! Overrode 0!)\nconst displayCount2 = count ?? 10; // 0 (Correct!)"
      },
      {
        "id": "5.4",
        "title": "5.4 Optional Chaining (?.) (ES2020)",
        "content": "The **Optional Chaining operator (`?.`)** allows safe property reads deep within a chain of connected objects without causing the engine to throw a `TypeError: Cannot read properties of undefined`.\n\nIf the reference before `?.` is `null` or `undefined`, evaluation stops and returns `undefined`.",
        "code": "const user = {\n    profile: {\n        name: \"John\"\n    }\n};\n\nconsole.log(user?.profile?.name);    // \"John\"\nconsole.log(user?.address?.city);    // undefined (safe, no error thrown!)\n\n// Optional method calls:\nconst admin = {\n  getRole: () => \"Admin\"\n};\nconsole.log(admin.getRole?.());   // \"Admin\"\nconsole.log(admin.deleteUser?.()); // undefined (safe!)"
      }
    ]
  },
  {
    "id": "template-literals",
    "number": "6",
    "title": "Template Literals & String Interpolation",
    "summary": "String interpolation, multi-line strings, tagged templates, and raw strings with String.raw.",
    "subsections": [
      {
        "id": "6.1",
        "title": "6.1 Basic Syntax & Expression Evaluation",
        "content": "Template literals are string literals enclosed in **backtick characters (``)**, allowing embedded expressions using the `${expression}` placeholder syntax.\n\nInside `${...}`, you can place any valid JavaScript expression, including variables, arithmetic, ternary conditions, and function invocations.",
        "code": "const name = \"John\";\nconst age = 30;\n\n// Basic interpolation\nconsole.log(`My name is ${name} and I'm ${age} years old.`);\n\n// Expression evaluation\nconsole.log(`Next year I'll be ${age + 1}.`);\n\n// Function calls inside interpolation\nconsole.log(`Hello, ${name.toUpperCase()}!`);"
      },
      {
        "id": "6.2",
        "title": "6.2 Multi-line Strings",
        "content": "Before ES6, multi-line strings required tedious string concatenation and escaped newline characters (`\\n`). Template literals naturally preserve newlines and whitespace.",
        "code": "// Before ES6\nconst oldWay = \"Line 1\\n\" +\n               \"Line 2\\n\" +\n               \"Line 3\";\n\n// With template literals\nconst newWay = `Line 1\nLine 2\nLine 3`;"
      },
      {
        "id": "6.3",
        "title": "6.3 Tagged Templates",
        "content": "**Tagged Templates** allow you to parse template literals with a custom function. The tag function receives:\n1. An array of static string chunks.\n2. The evaluated values of the expressions as subsequent arguments (`...values`).\n\nThis feature powers libraries like `styled-components`, GraphQL query parsers, and localization/sanitization formatters.",
        "code": "function highlight(strings, ...values) {\n    return strings.reduce((result, str, i) => {\n        const value = values[i] ? `<strong>${values[i]}</strong>` : '';\n        return result + str + value;\n    }, '');\n}\n\nconst name = \"John\";\nconst score = 95;\nconsole.log(highlight`Player ${name} scored ${score} points.`);\n// Output: Player <strong>John</strong> scored <strong>95</strong> points."
      },
      {
        "id": "6.4",
        "title": "6.4 Advanced Features: Raw Strings & Nested Templates",
        "content": "• **Raw Strings**: The `String.raw` tag displays escape sequences (such as `\\n`) as literal characters rather than interpreted whitespace.\n• **Nested Template Literals**: You can nest template literals inside expression placeholders `${...}` for concise conditional formatting.",
        "code": "// Raw strings (preserves \\n literally)\nconsole.log(String.raw`Hello\\nWorld`); // Output: Hello\\nWorld\n\n// Nested template literals\nconst isError = false;\nconst errorCode = 500;\nconst message = `Status: ${isError ? `ERROR: ${errorCode}` : 'OK'}`;\nconsole.log(message); // \"Status: OK\""
      }
    ]
  },
  {
    "id": "conditionals",
    "number": "7",
    "title": "Conditionals & Branching Logic",
    "summary": "if/else control structures, ternary operators, switch statements with expression matching, and short-circuit evaluation.",
    "subsections": [
      {
        "id": "7.1",
        "title": "7.1 if, else if, and else",
        "content": "The `if` statement executes a statement or block if a specified condition evaluates to truthy. If the condition is falsy, an alternative `else if` or `else` block can be executed.",
        "code": "const score = 85;\n\nif (score >= 90) {\n    console.log(\"Grade: A\");\n} else if (score >= 80) {\n    console.log(\"Grade: B\");\n} else if (score >= 70) {\n    console.log(\"Grade: C\");\n} else {\n    console.log(\"Grade: F\");\n}"
      },
      {
        "id": "7.2",
        "title": "7.2 The Ternary Operator",
        "content": "The conditional (ternary) operator is the only JavaScript operator that takes three operands: a condition followed by a question mark (`?`), an expression to execute if truthy, a colon (`:`), and an expression to execute if falsy.\n\nTernary operators return a value, making them ideal for variable assignments and JSX expressions.",
        "code": "const age = 20;\nconst status = age >= 18 ? \"Adult\" : \"Minor\";\n\n// Nested ternary (use cautiously for readability)\nconst score = 85;\nconst grade = score >= 90 ? \"A\" :\n              score >= 80 ? \"B\" :\n              score >= 70 ? \"C\" : \"F\";"
      },
      {
        "id": "7.3",
        "title": "7.3 switch Statement & Expression Matching",
        "content": "The `switch` statement evaluates an expression and executes statements associated with matching `case` labels using strict equality (`===`).\n\n### Advanced: `switch (true)` Expression Matching\nYou can pass `true` as the switch expression to cleanly test complex range conditions without deeply nested `if/else` ladders.",
        "code": "const day = \"Monday\";\n\nswitch (day) {\n    case \"Monday\":\n        console.log(\"Start of work week\");\n        break;\n    case \"Friday\":\n        console.log(\"Almost weekend!\");\n        break;\n    case \"Saturday\":\n    case \"Sunday\":\n        console.log(\"Weekend!\");\n        break;\n    default:\n        console.log(\"Midweek day\");\n}\n\n// Switch with boolean expression matching\nconst score = 92;\nswitch (true) {\n    case score >= 90:\n        console.log(\"Excellent\");\n        break;\n    case score >= 70:\n        console.log(\"Good\");\n        break;\n    default:\n        console.log(\"Needs improvement\");\n}"
      },
      {
        "id": "7.4",
        "title": "7.4 Short-circuit Evaluation for Conditionals",
        "content": "Logical operators can replace verbose `if` statements for concise default assignments and guarded function execution.",
        "code": "// Default values using ||\nconst userInput = \"\";\nconst username = userInput || \"Anonymous\";\n\n// Conditional execution using &&\nconst isLoggedIn = true;\nconst showDashboard = () => console.log(\"Rendering Dashboard\");\nisLoggedIn && showDashboard();\n\n// Nullish coalescing for safe defaults\nconst count = 0;\nconst finalCount = count ?? 10; // Preserves 0"
      }
    ]
  },
  {
    "id": "loops",
    "number": "8",
    "title": "Loops & Iteration Controls",
    "summary": "for, while, do-while, for..of, for..in with prototype guards, break, continue, and loop labels.",
    "subsections": [
      {
        "id": "8.1",
        "title": "8.1 Traditional for Loops",
        "content": "A `for` loop repeats until a specified condition evaluates to false. It consists of initialization, condition, and final-expression steps. You can also declare multiple loop counters.",
        "code": "// Traditional for loop\nfor (let i = 0; i < 5; i++) {\n    console.log(i); // 0, 1, 2, 3, 4\n}\n\n// Multiple loop variables\nfor (let i = 0, j = 10; i < j; i++, j--) {\n    console.log(i, j);\n}\n\n// Infinite loop pattern (avoid without break!)\nfor (;;) {\n    // Requires an explicit break\n    break;\n}"
      },
      {
        "id": "8.2",
        "title": "8.2 while and do...while Loops",
        "content": "• **`while` Loop**: Evaluates the condition before each iteration. If false from the beginning, the body never runs.\n• **`do...while` Loop**: Evaluates the condition **after** each iteration. Guarantees that the loop body executes **at least once**.",
        "code": "// while loop\nlet i = 0;\nwhile (i < 5) {\n    console.log(i);\n    i++;\n}\n\n// do-while loop (executes at least once)\nlet j = 0;\ndo {\n    console.log(j); // Prints 0 even if condition is immediately false\n    j++;\n} while (j < 0);"
      },
      {
        "id": "8.3",
        "title": "8.3 for...of Loop (ES6 Iterables)",
        "content": "Introduced in ES6, `for...of` iterates over **iterable objects** (including Arrays, Strings, Sets, Maps, NodeLists, and generator outputs), retrieving the **values** directly.",
        "code": "// Iterating Arrays\nconst fruits = [\"apple\", \"banana\", \"orange\"];\nfor (const fruit of fruits) {\n    console.log(fruit);\n}\n\n// Iterating Strings\nfor (const char of \"Hello\") {\n    console.log(char);\n}"
      },
      {
        "id": "8.4",
        "title": "8.4 for...in Loop (Object Properties)",
        "content": "The `for...in` loop iterates over all **enumerable property keys** of an object, including properties inherited across its prototype chain.\n\n### The hasOwnProperty Guard:\nBecause `for...in` walks up the prototype chain, always use `Object.hasOwn(obj, key)` or `person.hasOwnProperty(key)` to ensure you only process own properties.",
        "code": "const person = {\n    name: \"John\",\n    age: 30,\n    city: \"NYC\"\n};\n\n// Iterates over keys\nfor (const key in person) {\n    console.log(`${key}: ${person[key]}`);\n}\n\n// Safe iteration guarding against inherited properties:\nfor (const key in person) {\n    if (Object.hasOwn(person, key)) {\n        console.log(key, person[key]);\n    }\n}"
      },
      {
        "id": "8.5",
        "title": "8.5 Loop Control: break, continue, and Labeled Statements",
        "content": "• **`break`**: Terminate the loop immediately and pass execution to the statement following the loop.\n• **`continue`**: Skip the remainder of the current iteration and jump to the next iteration.\n• **Loop Labels**: Identifiers followed by a colon that allow breaking out of nested loop structures.",
        "code": "// break - exit loop entirely\nfor (let i = 0; i < 10; i++) {\n    if (i === 5) break;\n    console.log(i); // 0, 1, 2, 3, 4\n}\n\n// continue - skip current iteration\nfor (let i = 0; i < 5; i++) {\n    if (i === 2) continue;\n    console.log(i); // 0, 1, 3, 4\n}\n\n// Labels for breaking outer nested loops\nouterLoop: for (let i = 0; i < 3; i++) {\n    innerLoop: for (let j = 0; j < 3; j++) {\n        if (i === 1 && j === 1) break outerLoop; // Exits both loops!\n        console.log(i, j);\n    }\n}"
      }
    ]
  },
  {
    "id": "arrays",
    "number": "9",
    "title": "Arrays & Essential Methods",
    "summary": "Transformations with map, filter, reduce, predicates some and every, slice vs splice, and array destructuring.",
    "subsections": [
      {
        "id": "9.1",
        "title": "9.1 Essential Functional Methods: map, filter, reduce",
        "content": "### 1. `map()`\nTransforms every element of an array by calling a callback function, returning a **new array of identical length** without mutating the original.\n\n### 2. `filter()`\nCreates a shallow copy of a portion of an array containing only elements that return truthy from a provided predicate test.\n\n### 3. `reduce()`\nExecutes a user-supplied reducer callback function on each element of the array, passing the return value from the calculation on the preceding element. It accumulates results into a single value (number, object, or array).",
        "code": "// map - transform elements\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(num => num * 2); // [2, 4, 6]\n\n// filter - select elements based on condition\nconst evens = [1, 2, 3, 4, 5].filter(num => num % 2 === 0); // [2, 4]\n\n// reduce - accumulate values (sum)\nconst sum = [1, 2, 3, 4].reduce((acc, curr) => acc + curr, 0); // 10\n\n// reduce - group by property\nconst people = [\n    { name: \"Alice\", age: 25 },\n    { name: \"Bob\", age: 30 },\n    { name: \"Charlie\", age: 25 }\n];\n\nconst groupedByAge = people.reduce((acc, person) => {\n    const age = person.age;\n    if (!acc[age]) acc[age] = [];\n    acc[age].push(person);\n    return acc;\n}, {});\n// Result: { 25: [{...}, {...}], 30: [{...}] }"
      },
      {
        "id": "9.2",
        "title": "9.2 Predicate & Search Methods: some, every, find, findIndex",
        "content": "• **`some()`**: Returns `true` if **at least one** element in the array passes the test.\n• **`every()`**: Returns `true` only if **all** elements in the array pass the test.\n• **`find()`**: Returns the **first element** that satisfies the test, or `undefined`.\n• **`findIndex()`**: Returns the **index of the first element** that satisfies the test, or `-1`.",
        "code": "const numbers = [1, 2, 3, 4, 5];\nconst hasEven = numbers.some(num => num % 2 === 0); // true\nconst allEven = numbers.every(num => num % 2 === 0); // false\n\nconst users = [\n    { id: 1, name: \"John\" },\n    { id: 2, name: \"Jane\" }\n];\nconst user = users.find(u => u.id === 2); // { id: 2, name: \"Jane\" }\nconst index = users.findIndex(u => u.id === 2); // 1"
      },
      {
        "id": "9.3",
        "title": "9.3 Mutating vs Non-Mutating: slice vs splice & forEach",
        "content": "### `slice()` (Non-Mutating)\nReturns a shallow copy of a portion of an array specified by start (inclusive) and end (exclusive) indices. Negative indices count from the end.\n\n### `splice()` (Mutating)\nChanges the contents of an array **in place** by removing, replacing, or adding elements.\n\n### `forEach()`\nExecutes a function on each element. **Note: You cannot break or return out of a forEach loop early.**",
        "code": "// slice - returns new array (original intact)\nconst arr = [1, 2, 3, 4, 5];\nconsole.log(arr.slice(1, 3)); // [2, 3]\nconsole.log(arr.slice(-2));   // [4, 5]\n\n// splice - modifies original array in place\nconst arr2 = [1, 2, 3, 4, 5];\narr2.splice(2, 1);          // Removes 1 element at index 2 -> [1, 2, 4, 5]\narr2.splice(1, 0, 'a', 'b'); // Inserts 'a', 'b' at index 1 -> [1, 'a', 'b', 2, 4, 5]"
      },
      {
        "id": "9.4",
        "title": "9.4 Array Destructuring",
        "content": "Array destructuring extracts values from arrays into distinct variables using syntax that mirrors array literals.",
        "code": "const [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first); // 1\nconsole.log(rest);  // [3, 4, 5]\n\n// Swapping variables without temporary variables:\nlet a = 1, b = 2;\n[a, b] = [b, a]; // a=2, b=1\n\n// Default fallback values:\nconst [x = 10, y = 20] = [5];\nconsole.log(x, y); // 5, 20"
      }
    ]
  },
  {
    "id": "strings",
    "number": "10",
    "title": "Strings & Text Processing",
    "summary": "String access, searching methods, extraction with slice and substring, manipulation, splitting, joining, and Unicode.",
    "subsections": [
      {
        "id": "10.1",
        "title": "10.1 Length, Character Access & Searching",
        "content": "Strings are immutable UTF-16 character sequences.\n\n### Character Access:\n• `str[index]` or `str.charAt(index)`: Returns character at index.\n• `str.at(-1)` (ES2022): Supports negative indices to read from the end.\n• `str.charCodeAt(index)`: Returns the UTF-16 code unit integer.\n\n### Searching:\n• `indexOf()` & `lastIndexOf()`: Locate substring positions.\n• `includes()`, `startsWith()`, `endsWith()`: Return boolean indicators.",
        "code": "const str = \"Hello World\";\nstr.length;                 // 11\nstr[0];                     // \"H\"\nstr.charAt(0);              // \"H\"\nstr.charCodeAt(0);          // 72 (Unicode code point)\nstr.at(-1);                 // \"d\" (ES2022 negative indexing)\n\n// Searching:\nstr.indexOf(\"World\");       // 6\nstr.includes(\"Hello\");      // true\nstr.startsWith(\"He\");       // true\nstr.endsWith(\"ld\");         // true"
      },
      {
        "id": "10.2",
        "title": "10.2 Extraction Methods: slice vs substring vs substr",
        "content": "### `slice(start, end)`\nExtracts a section and returns a new string. Supports negative indices (counts from end of string).\n\n### `substring(start, end)`\nSimilar to `slice`, but treats negative arguments as `0` and swaps `start` and `end` if `start > end`.\n\n### `substr(start, length)`\nDeprecated legacy method. Avoid in modern code.",
        "code": "const str = \"Hello World\";\n\nstr.slice(6, 11);          // \"World\"\nstr.substring(6, 11);      // \"World\"\n\n// Differences with negative indices:\nstr.slice(2, -1);          // \"llo Worl\"\nstr.substring(2, -1);      // \"He\" (treated as substring(2, 0) -> substring(0, 2))"
      },
      {
        "id": "10.3",
        "title": "10.3 Modification, Splitting, and Joining",
        "content": "Because strings are immutable, modification methods always return a **new string**.\n\n• `toLowerCase()` & `toUpperCase()`\n• `trim()`, `trimStart()`, `trimEnd()` (removes whitespace)\n• `replace(target, replacement)`: Replaces first match or regex matches\n• `split(separator, limit)`: Splits a string into an array of substrings\n• `join(separator)`: Array method that joins elements back into a string",
        "code": "const str = \"Hello World\";\n\nstr.toLowerCase();          // \"hello world\"\nstr.toUpperCase();          // \"HELLO WORLD\"\n\n\"  Hello  \".trim();         // \"Hello\"\n\"  Hello  \".trimStart();    // \"Hello  \"\n\"  Hello  \".trimEnd();      // \"  Hello\"\n\nstr.replace(\"World\", \"JS\"); // \"Hello JS\"\nstr.replace(/o/g, \"0\");     // \"Hell0 W0rld\"\n\n// Splitting and Joining:\nconst fruits = \"apple,banana,orange\";\nconst list = fruits.split(\",\"); // [\"apple\", \"banana\", \"orange\"]\nconst reconstructed = list.join(\" - \"); // \"apple - banana - orange\""
      },
      {
        "id": "10.4",
        "title": "10.4 Unicode and Special Characters",
        "content": "JavaScript strings use UTF-16 encoding. Standard ASCII and Latin characters fit into a single 16-bit code unit, while emojis and rare characters require a **surrogate pair** (two 16-bit units).\n\n• `for...of` loops correctly iterate through Unicode code points rather than splitting surrogate pairs.\n• `normalize()`: Normalizes characters with diacritical marks (e.g. `café`).",
        "code": "// Unicode escape sequences\nconsole.log(\"\\u0041\");      // \"A\"\nconsole.log(\"\\u{1F600}\");   // \"😀\" (ES6 Unicode code point)\n\n// for...of handles surrogate pairs correctly:\nfor (const char of \"😀🎉\") {\n    console.log(char); // \"😀\", then \"🎉\"\n}\n\n// Normalization:\n\"café\".normalize();"
      }
    ]
  },
  {
    "id": "objects",
    "number": "11",
    "title": "Objects, Property Descriptors & Prototypes",
    "summary": "Basic object operations, Object.keys/values/entries, destructuring, spread operator, property descriptors, and prototype inheritance.",
    "subsections": [
      {
        "id": "11.1",
        "title": "11.1 Basic Operations & Accessors",
        "content": "Objects in JavaScript are mutable key-value dictionaries. Keys are either Strings or Symbols. Values can be of any data type.\n\n### Property Access:\n• **Dot notation** (`obj.prop`): Used for valid identifier names.\n• **Bracket notation** (`obj[\"prop\"]`): Required for dynamic expressions, variables, or keys containing hyphens/spaces.",
        "code": "const person = {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    age: 30,\n    greet() {\n        return `Hello, I'm ${this.firstName}`;\n    }\n};\n\n// Access\nconsole.log(person.firstName);      // \"John\"\nconsole.log(person[\"firstName\"]);   // \"John\" (computed property)\n\n// Modification & Addition\nperson.age = 31;\nperson[\"country\"] = \"USA\";\n\n// Delete property\ndelete person.age;"
      },
      {
        "id": "11.2",
        "title": "11.2 Object.keys(), Object.values(), Object.entries()",
        "content": "ES6+ provides static methods to extract arrays from an object's enumerable own properties:\n• `Object.keys(obj)`: Returns an array of keys (`string[]`).\n• `Object.values(obj)`: Returns an array of values.\n• `Object.entries(obj)`: Returns an array of `[key, value]` tuple pairs.",
        "code": "const person = {\n    name: \"John\",\n    age: 30,\n    city: \"NYC\"\n};\n\nObject.keys(person);    // [\"name\", \"age\", \"city\"]\nObject.values(person);  // [\"John\", 30, \"NYC\"]\nObject.entries(person); // [[\"name\", \"John\"], [\"age\", 30], [\"city\", \"NYC\"]]\n\n// Practical iteration:\nfor (const [key, value] of Object.entries(person)) {\n    console.log(`${key}: ${value}`);\n}\n\n// Convert object to Map:\nconst map = new Map(Object.entries(person));"
      },
      {
        "id": "11.3",
        "title": "11.3 Object Destructuring",
        "content": "Object destructuring unpacks properties from objects into variables. Supports variable renaming, default fallback values, nested extraction, and rest properties.",
        "code": "const user = {\n    id: 1,\n    name: \"John\",\n    age: 30,\n    address: {\n        city: \"NYC\",\n        zip: \"10001\"\n    }\n};\n\n// Basic destructuring\nconst { name, age } = user;\n\n// Renaming variables\nconst { name: userName, age: userAge } = user;\n\n// Default values\nconst { country = \"USA\" } = user;\n\n// Nested destructuring\nconst { address: { city, zip } } = user;\n\n// Rest operator\nconst { id, ...rest } = user;\nconsole.log(rest); // { name: \"John\", age: 30, address: {...} }"
      },
      {
        "id": "11.4",
        "title": "11.4 Spread Operator & Object Utility Methods",
        "content": "• **Spread Operator (`{ ...obj }`)**: Creates a shallow copy or merges multiple objects.\n• **`Object.assign(target, ...sources)`**: Alternative method for shallow copying.\n• **`Object.freeze(obj)`**: Makes an object completely immutable (cannot add, delete, or modify properties).\n• **`Object.seal(obj)`**: Prevents adding or deleting properties, but existing writable properties can still be modified.\n• **`Object.is(val1, val2)`**: Same-value equality check (distinguishes `+0` from `-0` and treats `NaN === NaN`).",
        "code": "const obj1 = { a: 1, b: 2 };\nconst obj2 = { b: 3, c: 4 };\n\n// Merge objects (ES2018)\nconst merged = { ...obj1, ...obj2 }; // { a: 1, b: 3, c: 4 }\n\n// Shallow clone\nconst clone = { ...obj1 };\n\n// Object immutability\nObject.freeze(obj1);\n// obj1.a = 99; // Silent failure in non-strict, TypeError in strict mode"
      },
      {
        "id": "11.5",
        "title": "11.5 Property Descriptors & Object.defineProperty",
        "content": "Every property on an object has an internal **Property Descriptor** governing its behavior:\n• `value`: The actual stored value.\n• `writable`: If `false`, the property cannot be reassigned.\n• `enumerable`: If `true`, the property appears in `for...in` and `Object.keys()`.\n• `configurable`: If `false`, the property cannot be deleted or reconfigured.",
        "code": "const obj = {};\n\nObject.defineProperty(obj, 'readOnly', {\n    value: 42,\n    writable: false,\n    enumerable: true,\n    configurable: false\n});\n\nconsole.log(obj.readOnly); // 42\n// obj.readOnly = 99; // Throws error in strict mode!\n\n// Inspect descriptors:\nconsole.log(Object.getOwnPropertyDescriptor(obj, 'readOnly'));"
      },
      {
        "id": "11.6",
        "title": "11.6 Prototypes & Inheritance",
        "content": "JavaScript objects have a private internal link to another object called their **prototype**. When a property is requested that does not exist on the object itself, the engine searches the prototype chain until it finds the property or reaches `null`.\n\nUse `Object.create(proto)` to create a new object with a specified prototype.",
        "code": "const animal = {\n    eats: true,\n    walk() {\n        return \"Animal walks\";\n    }\n};\n\nconst rabbit = Object.create(animal, {\n    jumps: {\n        value: true,\n        enumerable: true\n    }\n});\n\nconsole.log(rabbit.eats);  // true (inherited from animal)\nconsole.log(rabbit.walk()); // \"Animal walks\"\n\n// Inspect prototype link:\nconsole.log(Object.getPrototypeOf(rabbit) === animal); // true"
      }
    ]
  },
  {
    "id": "best-practices-checklist",
    "number": "12",
    "title": "Best Practices Summary, Resources & Progress Checklist",
    "summary": "Essential rules for variables, types, operators, arrays, and objects, official documentation links, and an interactive 10-point checklist.",
    "subsections": [
      {
        "id": "12.1",
        "title": "12.1 Best Practices Summary",
        "content": "### 1. Variables\n• Use `const` by default for all variable declarations.\n• Use `let` only when reassignment is strictly necessary (e.g. loop counters, mutable accumulators).\n• Never use `var` in modern applications.\n• Initialize variables when declaring them to minimize uninitialized state bugs.\n\n### 2. Types & Operators\n• Always use strict equality (`===`) instead of loose equality (`==`).\n• Be explicit with type conversions (`Number()`, `String()`, `Boolean()`).\n• Master the 8 falsy values (`false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`).\n• Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) instead of complex `&&` and `||` fallbacks.\n\n### 3. Arrays & Functions\n• Prefer functional array methods (`map`, `filter`, `reduce`) over imperative `for` loops.\n• Use template literals (`${...}`) instead of string concatenation with `+`.\n• Destructure objects and arrays for clean, readable code.\n• Use the spread operator (`...`) for shallow copying and immutability.\n\n### 4. Objects\n• Use ES6 shorthand object syntax (`{ name, age }`).\n• Prefer `Object.keys()`, `Object.values()`, and `Object.entries()` over `for...in`.\n• Use `Object.freeze()` for immutability when dealing with configuration or fixed state.\n• Consider `Map` when keys are dynamic or non-string, and `Set` for unique collections."
      },
      {
        "id": "12.2",
        "title": "12.2 Official Documentation & Recommended Resources",
        "content": "### Official Documentation\n• [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)\n• [ECMAScript Official Specification (TC39)](https://tc39.es/ecma262/)\n\n### Recommended Reference Books\n• *JavaScript: The Definitive Guide* by David Flanagan\n• *Eloquent JavaScript* by Marijn Haverbeke\n• *You Don't Know JS* (Book Series) by Kyle Simpson\n\n### Practice Platforms\n• [Codewars](https://www.codewars.com/)\n• [LeetCode](https://leetcode.com/)\n• [Exercism JavaScript Track](https://exercism.org/tracks/javascript)"
      },
      {
        "id": "12.3",
        "title": "12.3 Interactive 10-Point Progress Checklist",
        "content": "Track your mastery across each foundational JavaScript topic. Click each item to toggle your mastery checklist:",
        "checklist": [
          {
            "id": "chk_fundamentals",
            "text": "1. Fundamentals: V8 Ignition & TurboFan, Call Stack, Host Concurrency, Strict Mode"
          },
          {
            "id": "chk_variables",
            "text": "2. Variables: Scope hierarchy, hoisting mechanics, TDZ, and var vs let vs const"
          },
          {
            "id": "chk_datatypes",
            "text": "3. Data Types: 7 primitives, reference heap memory, and typeof null detection"
          },
          {
            "id": "chk_conversion",
            "text": "4. Type Conversion: Explicit conversions vs implicit coercion and truthy/falsy evaluation"
          },
          {
            "id": "chk_operators",
            "text": "5. Operators: Strict === comparison, logical short-circuiting, ??, and ?."
          },
          {
            "id": "chk_template",
            "text": "6. Template Literals: String interpolation, multi-line strings, and tagged templates"
          },
          {
            "id": "chk_conditionals",
            "text": "7. Conditionals: if/else control flow, ternary operators, and switch statements"
          },
          {
            "id": "chk_loops",
            "text": "8. Loops: for, while, for..of, for..in, break/continue, and labeled loops"
          },
          {
            "id": "chk_arrays",
            "text": "9. Arrays: map, filter, reduce, some, every, slice vs splice, and destructuring"
          },
          {
            "id": "chk_strings",
            "text": "10. Strings: Searching, extraction slice vs substring, replace, and Unicode"
          },
          {
            "id": "chk_objects",
            "text": "11. Objects: Destructuring, spread, property descriptors, and prototypes"
          }
        ],
        "callout": {
          "type": "tip",
          "text": "Happy Coding! Practice is key to mastering JavaScript! 🚀"
        }
      }
    ]
  }
];
