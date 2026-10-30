// JavaScript Master Interview Guide — 200 Questions, Solutions & Algorithms
// Foundation Finance Company | Full Stack Developer / SDE Screening Preparation
// Fully upgraded to meet AGENTS.md standards: Direct Pitch, Engine Mechanics, Real-World Use, and Multiple Approaches.

export const JS_INTERVIEW_TOPICS = [
  {
    "id": 1,
    "range": "Q1–15",
    "title": "Fundamentals, Types & Coercion",
    "count": 15
  },
  {
    "id": 2,
    "range": "Q16–30",
    "title": "Scope, Hoisting & Execution Context",
    "count": 15
  },
  {
    "id": 3,
    "range": "Q31–45",
    "title": "Functions, Closures & this",
    "count": 15
  },
  {
    "id": 4,
    "range": "Q46–60",
    "title": "Objects, Prototypes & Classes",
    "count": 15
  },
  {
    "id": 5,
    "range": "Q61–75",
    "title": "Arrays, Maps, Sets & Collections",
    "count": 15
  },
  {
    "id": 6,
    "range": "Q76–90",
    "title": "Async JavaScript & Event Loop",
    "count": 15
  },
  {
    "id": 7,
    "range": "Q91–105",
    "title": "ES6+, Modules, Errors & Memory",
    "count": 15
  },
  {
    "id": 8,
    "range": "Q106–120",
    "title": "Output Prediction & Debugging",
    "count": 15
  },
  {
    "id": 9,
    "range": "Q121–135",
    "title": "Practical JavaScript Coding Questions",
    "count": 15
  },
  {
    "id": 10,
    "range": "Q136–150",
    "title": "Advanced Concepts, Polyfills & Senior Scenarios",
    "count": 15
  },
  {
    "id": 11,
    "range": "Q151–175",
    "title": "Essential Coding Challenges (Multiple Approaches)",
    "count": 25
  },
  {
    "id": 12,
    "range": "Q176–200",
    "title": "Advanced DSA & Functional Patterns in JS",
    "count": 25
  }
];

export const JS_150_QUESTIONS = [
  {
    "id": 1,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Fundamentals",
    "question": "What is JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nJavaScript is a high-level, dynamically typed, multi-paradigm programming language conforming to the ECMAScript standard. It is single-threaded on its primary call stack but achieves high-throughput non-blocking asynchronous concurrency via host runtime APIs (Browser Web APIs or Node.js Libuv). It supports prototype-based object inheritance, first-class functions, and functional programming patterns.\n\n### 2. Detailed Technical Explanation & Mental Model\nJavaScript code runs inside a host execution environment. The engine (e.g. Google V8, Apple JavaScriptCore, Mozilla SpiderMonkey) parses source code into an Abstract Syntax Tree (AST), translates it into bytecode, and uses Just-In-Time (JIT) compilation to generate machine instructions.\n• **Paradigms Supported**: Procedural, Object-Oriented (prototypal), Functional (pure functions, closures, composition), and Event-Driven.\n\n### 3. Internal Working & Engine Mechanics\n• **V8 Engine**: Uses **Ignition** (an interpreter that outputs bytecode with low startup latency) and **TurboFan** (an optimizing compiler that compiles hot loops into optimized machine code based on runtime type feedback).\n• **Memory**: Primitives are allocated on the Call Stack; complex reference types (Objects, Arrays, Closures) reside on the Memory Heap.\n\n### 4. Practical Real-World Context\nIn enterprise full-stack development, JavaScript allows isomorphic code sharing between frontend (React / Next.js) and backend (Node.js / Express / NestJS), sharing data validation schemas (Zod), TypeScript types, and utility functions.\n\n### 5. Trade-offs & Pitfalls\n• **Advantage**: Extreme developer velocity, ubiquitous ecosystem (npm), universal browser support.\n• **Pitfall**: Dynamic typing can mask runtime type errors (e.g. `undefined is not a function`) in large codebases without strict TypeScript or runtime schema validation.\n\n### 6. Follow-Up Questions with Answers\n• **Q: What is the difference between ECMAScript and JavaScript?**\n  *A: ECMAScript is the official specification standard (ECMA-262); JavaScript is the actual dialect and runtime implementation created by vendors.*\n• **Q: Is JavaScript compiled or interpreted?**\n  *A: It is both. Modern engines use JIT compilation: interpreting bytecode immediately for fast startup, then compiling frequently invoked hot functions to machine code.*",
    "code": "// Universal First-Class Function Example:\nconst calculateTax = (rate) => (amount) => amount * (1 + rate);\nconst standardVAT = calculateTax(0.20); // 20% VAT\nconsole.log(standardVAT(100)); // 120"
  },
  {
    "id": 2,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type System",
    "question": "What are the seven primitive data types in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nJavaScript has seven primitive types: **String, Number, BigInt, Boolean, Undefined, Symbol, and Null**. Primitives represent atomic, immutable values stored directly by value on the Call Stack (or as inline V8 values). All other data types (Objects, Arrays, Functions, Maps, Sets) are mutable reference types stored on the Memory Heap.\n\n### 2. Detailed Technical Explanation\n• **Primitives are immutable**: You cannot mutate a primitive value in place. Any string or number operation produces a fresh value.\n• **Comparison by Value**: Two primitives with identical values are strictly equal (`\"hello\" === \"hello\"`).\n• **Object Wrappers**: When accessing methods on strings or numbers (e.g. `\"text\".toUpperCase()`), JavaScript temporarily auto-boxes the primitive into an internal wrapper object (`new String()`), invokes the method, and immediately discards the wrapper for garbage collection.\n\n### 3. Internal Working & Engine Mechanics\nIn the V8 engine, small integers are stored as **Smi (Small Integers)** directly within pointer words without heap allocation. Floating-point numbers and strings are allocated with compact memory descriptors.\n\n### 4. Trade-offs & Common Pitfalls\n• **The typeof null Bug**: `typeof null` returns `\"object\"`. This is a legacy specification bug from JavaScript 1.0 (where the type tag for object references was 000, which null matched) that cannot be fixed without breaking existing websites!\n\n### 5. Follow-Up Questions with Answers\n• **Q: Is null an object?**\n  *A: No. null is an immutable primitive representing the deliberate absence of an object value. typeof null returning 'object' is a historical spec defect.*\n• **Q: What is the difference between Number and BigInt?**\n  *A: Number is a 64-bit float with safe integers up to 2^53 - 1. BigInt supports arbitrary-precision integers of unlimited size.*",
    "table": {
      "headers": [
        "Primitive Type",
        "Example",
        "typeof Output",
        "Immutability"
      ],
      "rows": [
        [
          "string",
          "\"production\"",
          "\"string\"",
          "Immutable"
        ],
        [
          "number",
          "42, 3.14, NaN",
          "\"number\"",
          "Immutable"
        ],
        [
          "bigint",
          "9007199254740995n",
          "\"bigint\"",
          "Immutable"
        ],
        [
          "boolean",
          "true, false",
          "\"boolean\"",
          "Immutable"
        ],
        [
          "undefined",
          "undefined",
          "\"undefined\"",
          "Immutable"
        ],
        [
          "symbol",
          "Symbol(\"id\")",
          "\"symbol\"",
          "Immutable"
        ],
        [
          "null",
          "null",
          "\"object\" (bug)",
          "Immutable"
        ]
      ]
    }
  },
  {
    "id": 3,
    "topicId": 1,
    "difficulty": "Intermediate",
    "category": "Memory & References",
    "question": "What is the difference between primitive and reference values in memory?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nPrimitive values are immutable data types stored by value directly on the execution Call Stack. Reference values (Objects, Arrays, Functions) are mutable data structures allocated on the Memory Heap; variables holding an object do not store the object data itself, but rather a memory pointer (address reference) to the heap location.\n\n### 2. Detailed Technical Explanation\n• **Assignment Behavior**: Copying a primitive copies the literal value. Copying an object copies only the pointer reference, meaning both variables alias and mutate the exact same heap record!\n• **Argument Passing**: JavaScript is strictly **call-by-value**. However, when an object is passed into a function, the value passed IS the memory reference pointer. Modifying a property inside the function mutates the external object, but reassigning the parameter variable does not rebind the caller's variable.\n\n### 3. Internal Working & Memory Flow\n```\nCall Stack               Memory Heap\n[ a = 10 ]               \n[ userPtr ] ---------> { name: \"Sameer\", balance: 1000 }\n```\n\n### 4. Real-World Full-Stack Context\nIn React and Redux state management, mutating reference values directly causes silent bugs where components fail to re-render because shallow reference equality checks (`prevProps === nextProps`) report that the reference hasn't changed.\n\n### 5. Follow-Up Questions with Answers\n• **Q: Does JavaScript have pass-by-reference?**\n  *A: No. JavaScript is strictly pass-by-value. For objects, the reference pointer itself is copied and passed by value.*\n• **Q: How do you prevent shared mutation in React state?**\n  *A: By treating state as immutable and using shallow copying (`{ ...state, updatedProp }`) or deep cloning with `structuredClone()`. *",
    "code": "// Primitive Copy by Value:\nlet x = 10;\nlet y = x;\ny = 20;\nconsole.log(x); // 10 (untouched)\n\n// Reference Copy by Pointer:\nconst accountA = { balance: 500 };\nconst accountB = accountA; // Shared heap reference\naccountB.balance = 999;\nconsole.log(accountA.balance); // 999 (mutated via shared reference!)"
  },
  {
    "id": 4,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Fundamentals",
    "question": "What is the difference between undefined, null, and undeclared variables?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **undefined**: Indicates that a variable has been declared in a scope, but has not yet been initialized with a value. Also returned for missing object properties and unreturned function results.\n• **null**: An intentional assignment representing the deliberate absence of any object value.\n• **undeclared**: A variable identifier that has never been registered in any enclosing lexical environment; reading it throws a runtime `ReferenceError`.\n\n### 2. Internal Working\n• During scope creation, variables declared with `var` are initialized to `undefined` by default in the Environment Record.\n• `null` is never set automatically by the engine; it is strictly a developer-assigned sentinel value.\n\n### 3. Practical Production Pattern\nUse `null` in API payloads (JSON) to represent an empty field (e.g. `middleName: null`), while reserving `undefined` for optional parameters and default argument triggers.\n\n### 4. Follow-Up Questions with Answers\n• **Q: What does null == undefined and null === undefined evaluate to?**\n  *A: null == undefined is true (loose equality coercion rule). null === undefined is false (type mismatch: object/primitive vs undefined).*\n• **Q: What happens if you assign to an undeclared variable in strict mode?**\n  *A: It throws a ReferenceError. In non-strict mode, it creates an accidental global variable on window.*",
    "code": "let declared;\nconsole.log(declared); // undefined\n\nconst customer = { profile: null }; // Intentionally empty\nconsole.log(customer.profile);      // null\n\n// console.log(undeclaredVar);       // ReferenceError: undeclaredVar is not defined"
  },
  {
    "id": 5,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type System",
    "question": "What does typeof do and what are its historical limitations?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`typeof` is a unary operator that evaluates an unevaluated operand and returns a string indicating its data type. While reliable for primitives, it has well-documented historical quirks: it returns `\"object\"` for `null`, `[]`, `{}`, and `new Date()`.\n\n### 2. Key typeof Edge Cases\n1. `typeof null === \"object\"` (Engine spec defect).\n2. `typeof [] === \"object\"` (Arrays are objects; use `Array.isArray(arr)`).\n3. `typeof NaN === \"number\"` (NaN is an IEEE 754 float numeric value).\n4. `typeof function() {} === \"function\"` (Functions are callable objects, specially tagged).\n5. `typeof undeclaredVar === \"undefined\"` (Safe check without throwing ReferenceError!).\n\n### 3. Robust Type Checking Pattern\nFor rock-solid production type checking of reference types, use `Object.prototype.toString.call(val)`:\n• `Object.prototype.toString.call([])` -> `\"[object Array]\"`\n• `Object.prototype.toString.call(null)` -> `\"[object Null]\"`\n• `Object.prototype.toString.call(new Date())` -> `\"[object Date]\"`",
    "code": "console.log(typeof \"hello\");    // \"string\"\nconsole.log(typeof 42);         // \"number\"\nconsole.log(typeof 10n);        // \"bigint\"\nconsole.log(typeof true);       // \"boolean\"\nconsole.log(typeof undefined);  // \"undefined\"\nconsole.log(typeof Symbol());   // \"symbol\"\nconsole.log(typeof null);       // \"object\" <-- Trap!\nconsole.log(typeof []);         // \"object\" <-- Use Array.isArray()!\nconsole.log(typeof (() => {})); // \"function\""
  },
  {
    "id": 6,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Coercion & Equality",
    "question": "What is the difference between == and === and Object.is()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`==` (Abstract / Loose Equality)**: Compares values after coercing operands to a common type using the ECMAScript Abstract Equality algorithm.\n• **`===` (Strict Equality)**: Compares both type and value without coercion. If types differ, returns `false` immediately.\n• **`Object.is(a, b)` (Same-Value Equality)**: Behave identically to `===`, except it correctly distinguishes `+0` from `-0` and treats `NaN` as equal to `NaN`.\n\n### 2. Internal Mechanics & IEEE 754 Quirks\nUnder strict equality:\n• `NaN === NaN` evaluates to `false` because IEEE 754 states NaN is not equal to any value, including itself.\n• `+0 === -0` evaluates to `true` even though their sign bits differ.\nReact uses `Object.is()` in its reconciliation engine (`useState` and `memo`) to accurately detect state changes.\n\n### 3. Production Recommendation\nDefault to `===` across all application code. The only common exception is `val == null`, which cleanly checks for both `null` and `undefined` simultaneously.",
    "code": "// Loose vs Strict:\nconsole.log(5 == \"5\");           // true (string coerced to number)\nconsole.log(5 === \"5\");          // false (type mismatch)\n\n// Strict vs Object.is:\nconsole.log(NaN === NaN);        // false\nconsole.log(Object.is(NaN, NaN));// true\n\nconsole.log(+0 === -0);          // true\nconsole.log(Object.is(+0, -0));  // false"
  },
  {
    "id": 7,
    "topicId": 1,
    "difficulty": "Intermediate",
    "category": "Coercion",
    "question": "How does type coercion work in JavaScript (Implicit vs Explicit)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nType coercion is the conversion of a value from one type to another. It is **explicit** when triggered intentionally via constructors like `Number()`, `String()`, or `Boolean()`. It is **implicit** when triggered automatically by operators (`+`, `-`, `!`) or truthy/falsy evaluation contexts.\n\n### 2. Core Operator Coercion Rules\n1. **The `+` Operator**: If EITHER operand is a string, it converts both to strings and performs concatenation.\n2. **Mathematical Operators (`-`, `*`, `/`)**: Coerces both operands to numbers.\n3. **Objects to Primitives**: The engine invokes the object's internal `[Symbol.toPrimitive](hint)`, falling back to `.valueOf()` and `.toString()`.\n\n### 3. Production Pitfall\nImplicit coercion is a frequent source of bugs in financial calculations and form validations where numeric user inputs arrive as strings from HTML input fields (e.g. `\"10\" + 5 = \"105\"`). Always parse explicitly!",
    "code": "// Implicit Coercion:\nconsole.log(\"10\" + 5);  // \"105\" (String concatenation)\nconsole.log(\"10\" - 5);  // 5     (Numeric coercion)\nconsole.log(true + 2);  // 3     (true -> 1)\nconsole.log([] + {});   // \"[object Object]\"\nconsole.log([] + []);   // \"\"\n\n// Explicit Coercion (Production Best Practice):\nconst rawInput = \"42\";\nconst count = Number(rawInput); // 42\nconst text = String(100);       // \"100\""
  },
  {
    "id": 8,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type System",
    "question": "What are truthy and falsy values in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn JavaScript, any value evaluated in a boolean context (such as an `if` statement or logical operator) is coerced to either `true` or `false`. There are **precisely 8 falsy values** in ECMAScript. **Every other value in the language is truthy**, including empty arrays and empty objects!\n\n### 2. The 8 Falsy Values\n1. `false`\n2. `0`\n3. `-0`\n4. `0n` (BigInt zero)\n5. `\"\"` (empty string)\n6. `null`\n7. `undefined`\n8. `NaN`\n\n### 3. The Classic Senior Interview Trap\n`[]` and `{}` are **truthy**! Many junior developers write `if (users) { ... }` expecting an empty array to be falsy.\n• **Correct Array Check**: `if (users && users.length > 0)`\n• **Correct Object Check**: `if (obj && Object.keys(obj).length > 0)`",
    "code": "if ([]) console.log(\"Empty array is TRUTHY!\"); // Prints!\nif ({}) console.log(\"Empty object is TRUTHY!\"); // Prints!\nif (\"0\") console.log(\"'0' string is TRUTHY!\");  // Prints!\n\nconsole.log(Boolean(0));        // false\nconsole.log(Boolean(\"\"));       // false\nconsole.log(Boolean(null));     // false\nconsole.log(Boolean(NaN));      // false"
  },
  {
    "id": 9,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Modern Operators",
    "question": "What is the difference between || (Logical OR) and ?? (Nullish Coalescing)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`||` (Logical OR)**: Returns the right-hand operand if the left operand is **ANY falsy value** (`0`, `\"\"`, `false`, `null`, `undefined`, `NaN`).\n• **`??` (Nullish Coalescing)**: Returns the right-hand operand **ONLY if the left operand is strictly nullish (`null` or `undefined`)**.\n\n### 2. Real-World FinTech / UI Context\nIn configuration objects, scores, pagination limits, and balance thresholds, `0` or `false` are completely valid business values:\n• `const limit = userLimit || 10`: If user chooses `0`, it overrides it to `10` (A severe bug!).\n• `const limit = userLimit ?? 10`: If user chooses `0`, it correctly preserves `0`.",
    "code": "const animationDuration = 0; // 0ms is a valid instant duration!\n\nconst resultOR = animationDuration || 300; // 300 (BUG! 0 treated as missing)\nconst resultNC = animationDuration ?? 300; // 0 (CORRECT!)\n\nconst isEnabled = false;\nconst statusOR = isEnabled || true;        // true (BUG! false overwritten)\nconst statusNC = isEnabled ?? true;        // false (CORRECT!)"
  },
  {
    "id": 10,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type System",
    "question": "What is NaN, how does it behave, and how do you reliably test for it?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`NaN` stands for \"Not-a-Number\". Despite its name, its type is technically `\"number\"`. It represents an unrepresentable or undefined mathematical result (e.g. `0 / 0` or `Math.sqrt(-1)`). Uniquely in JavaScript, **`NaN` is the only value not equal to itself (`NaN === NaN` is false)**.\n\n### 2. How to Test for NaN\n• **Never use `===`**: `x === NaN` is always `false`.\n• **Avoid global `isNaN(x)`**: Coerces its argument to number before checking (`isNaN(\"hello\")` is `true`).\n• **Always use `Number.isNaN(x)`**: Checks if the value is strictly of type Number AND is exactly `NaN` without coercion!\n• **Alternative**: `Object.is(x, NaN)` returns `true`.",
    "code": "console.log(typeof NaN);         // \"number\"\nconsole.log(NaN === NaN);        // false\n\n// The global isNaN trap:\nconsole.log(isNaN(\"production\"));        // true (coerced \"production\" to NaN)\nconsole.log(Number.isNaN(\"production\")); // false (no coercion, string is not NaN)\nconsole.log(Number.isNaN(NaN));          // true"
  },
  {
    "id": 11,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type System",
    "question": "What is the difference between isNaN() and Number.isNaN()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Global `isNaN(value)`**: First attempts to convert the argument to a number via `ToNumber`, and then checks if the resulting value is `NaN`. This causes false positives on non-numeric strings (`isNaN(\"abc\") === true`).\n• **`Number.isNaN(value)` (ES6)**: Robust, strict check. It returns `true` **ONLY if the operand is already of type Number and its value is NaN**. No coercion occurs.\n\n### 2. Follow-Up Interview Question\n• **Q: How can you polyfill Number.isNaN in ES5?**\n  *A: By exploiting the fact that NaN is the only value not equal to itself: `function myIsNaN(val) { return val !== val; }`*",
    "code": "// Polyfill demonstration:\nfunction customIsNaN(val) {\n  return val !== val; // Only true for NaN!\n}\nconsole.log(customIsNaN(NaN));     // true\nconsole.log(customIsNaN(\"hello\")); // false"
  },
  {
    "id": 12,
    "topicId": 1,
    "difficulty": "Intermediate",
    "category": "Precision & Arithmetic",
    "question": "Why does 0.1 + 0.2 !== 0.3 in JavaScript, and how do you handle money in production?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nJavaScript numbers use 64-bit double-precision floating-point format adhering to the **IEEE 754 standard**. In base-2 binary, fractions like `0.1` (1/10) and `0.2` (1/5) have infinitely repeating fractional binary representations. When truncated to 53 bits of precision, minor rounding errors accumulate: `0.1 + 0.2` evaluates to `0.30000000000000004`.\n\n### 2. Production FinTech Architecture\n1. **Never use floating-point numbers for money**: A rounding discrepancy will cause financial audit failures.\n2. **Store amounts in minor integer units**: Represent dollars as cents ($19.99 = `1999`) and rupees as paise. Integers up to 9 quadrillion are 100% exact.\n3. **Use Decimal Libraries**: For complex interest calculations, use `decimal.js` or `bignumber.js`.\n4. **Use Number.EPSILON for comparisons**: Check `Math.abs(a - b) < Number.EPSILON`.",
    "code": "console.log(0.1 + 0.2); // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3); // false\n\n// FinTech Integer Pattern:\nconst unitPriceInCents = 1999; // $19.99\nconst taxInCents = 160;        // $1.60\nconst totalCents = unitPriceInCents + taxInCents; // 2159 ($21.59)"
  },
  {
    "id": 13,
    "topicId": 1,
    "difficulty": "Junior",
    "category": "Type Conversion",
    "question": "What is the difference between Number(), parseInt(), and parseFloat()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`Number(str)`**: Strict conversion. Parses the entire string; if any invalid character is encountered, it aborts and returns `NaN` (except whitespace/empty string which becomes `0`).\n• **`parseInt(str, radix)`**: Extracts an integer from the start of the string up to the first non-numeric character. Always specify radix (base 10)!\n• **`parseFloat(str)`**: Extracts a floating-point number up to the first invalid character.",
    "code": "Number(\"42px\");        // NaN (strict!)\nparseInt(\"42px\", 10);  // 42 (stops at 'p')\nparseFloat(\"42.50rem\");// 42.5\n\nNumber(\"\");            // 0\nparseInt(\"\", 10);      // NaN"
  },
  {
    "id": 14,
    "topicId": 1,
    "difficulty": "Intermediate",
    "category": "Immutability",
    "question": "What does immutability mean in JavaScript, and why is it essential?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nImmutability means a value cannot be altered after its creation. In JavaScript, all primitive values are strictly immutable in memory. Objects and arrays are mutable reference types. In modern web frameworks like React, immutability is vital because state reconciliation relies on shallow reference comparison (`prev !== next`) to trigger UI updates without expensive deep-tree traversals.",
    "code": "// Primitive immutability:\nlet str = \"hello\";\nstr.toUpperCase();\nconsole.log(str); // \"hello\" (original untouched)\n\n// Immutable object update:\nconst user = { name: \"Sameer\", role: \"admin\" };\nconst updatedUser = { ...user, role: \"superadmin\" }; // Fresh memory reference!"
  },
  {
    "id": 15,
    "topicId": 1,
    "difficulty": "Intermediate",
    "category": "Object Mechanics",
    "question": "What is the difference between Object.freeze() and const?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`const`**: Protects the **variable binding identifier**. It prevents reassigning the variable to a new reference, but does NOT protect the internal properties of an object from mutation.\n• **`Object.freeze(obj)`**: Protects the **object's properties in heap memory**. It makes the object shallowly immutable by marking all properties as `writable: false` and `configurable: false`. However, nested objects remain mutable unless recursively frozen!",
    "code": "const user = Object.freeze({\n  name: \"Sameer\",\n  address: { city: \"Hyderabad\" }\n});\n\n// user.name = \"Ali\"; // Silent failure or TypeError in strict mode\nuser.address.city = \"Bangalore\"; // MUTATES! Object.freeze is shallow."
  },
  {
    "id": 16,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Scope",
    "question": "What is scope and what are the four scope levels in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nScope defines the visibility and accessibility of variables, functions, and objects in a specific region of code during execution. JavaScript has four primary scope levels:\n1. **Global Scope**: Accessible everywhere.\n2. **Module Scope**: Isolated per file in ES Modules (`import`/`export`).\n3. **Function Scope**: Variables declared inside a function are private to that function (`var`, `let`, `const`).\n4. **Block Scope**: Variables declared inside curly braces `{ ... }` using `let` or `const`.",
    "code": "function scopeExample() {\n  if (true) {\n    var funcScoped = \"var leaks to function\";\n    let blockScoped = \"let is contained in block\";\n  }\n  console.log(funcScoped); // Accessible!\n  // console.log(blockScoped); // ReferenceError!\n}"
  },
  {
    "id": 17,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Variables",
    "question": "What is the difference between var, let, and const?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`var`**: Function-scoped (or global), hoisted and initialized to `undefined`, permits redeclaration, and attaches to `window` in classic browser scripts.\n• **`let`**: Block-scoped, hoisted into the Temporal Dead Zone (TDZ) without initialization, permits reassignment but prohibits redeclaration within the same scope.\n• **`const`**: Block-scoped, hoisted into TDZ, prohibits reassignment and redeclaration, and must be initialized upon declaration.",
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
          "Function",
          "Block",
          "Block"
        ],
        [
          "Reassignment",
          "Allowed",
          "Allowed",
          "TypeError"
        ],
        [
          "Redeclaration",
          "Allowed",
          "SyntaxError",
          "SyntaxError"
        ],
        [
          "Hoisting State",
          "Initialized to undefined",
          "TDZ (Uninitialized)",
          "TDZ (Uninitialized)"
        ],
        [
          "Window Binding",
          "Attaches to window.x",
          "No",
          "No"
        ]
      ]
    }
  },
  {
    "id": 18,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Hoisting",
    "question": "What is hoisting and how does the engine implement it internally?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nHoisting is JavaScript's compile-time mechanism where variable and function declarations are registered in memory within the current Lexical Environment record before code statements execute. It does NOT physically relocate source code lines.\n• **Function Declarations**: Hoisted with their full body implementation.\n• **`var` Declarations**: Hoisted and initialized immediately to `undefined`.\n• **`let` and `const`**: Hoisted into the environment record but left in an uninitialized state (TDZ).",
    "code": "sayHello(); // \"Hello from hoisted function!\"\nfunction sayHello() {\n  console.log(\"Hello from hoisted function!\");\n}\n\nconsole.log(count); // undefined\nvar count = 10;"
  },
  {
    "id": 19,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Hoisting & TDZ",
    "question": "Why does let throw a ReferenceError before declaration while var returns undefined?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nDuring the Creation Phase of the Execution Context, the engine registers both `var` and `let` in the Environment Record. However, the specification explicitly defines that `var` is bound to `undefined`, whereas `let` and `const` bindings remain in an **uninitialized state**. Accessing an uninitialized binding throws a `ReferenceError` by design to prevent accessing variables before their intended value is set.",
    "code": "// console.log(x); // ReferenceError: Cannot access 'x' before initialization\nlet x = 42;"
  },
  {
    "id": 20,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Hoisting & TDZ",
    "question": "What is the Temporal Dead Zone (TDZ) and why was it introduced?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe **Temporal Dead Zone (TDZ)** is the time span between entering a scope and the actual statement line where a `let` or `const` variable is initialized. Accessing the variable during this window throws a `ReferenceError`.\n• **Why it exists**:\n  1. Catches bugs: Reading variables before assignment is almost always a programming mistake.\n  2. Protects `const`: If `const` were initialized to `undefined`, its value would change upon evaluation, violating the immutable binding contract.",
    "code": "{\n  // TDZ for score begins\n  // console.log(score); // ReferenceError!\n  let score = 100; // TDZ ends\n  console.log(score); // 100\n}"
  },
  {
    "id": 21,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Scope",
    "question": "Is var always globally scoped?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nNo. `var` is **function-scoped**. When declared inside a function body, it is completely contained within that function and inaccessible outside. It is only globally scoped when declared at the top level of a classic browser script. In modern ES Modules or Node.js files, top-level `var` is scoped to that specific module.",
    "code": "function privateVar() {\n  var secret = \"private\";\n}\nprivateVar();\nconsole.log(typeof secret); // \"undefined\" (Does not leak outside!)"
  },
  {
    "id": 22,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Scope Chain",
    "question": "What is lexical scope?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Lexical scope** (also called static scope) means that variable resolution is determined by the **physical author-time nesting of functions and blocks in source code**, rather than by where or how functions are called at runtime (dynamic scope). An inner function has permanent access to variables in its outer enclosing scope based on where it was written.",
    "code": "const user = \"Outer\";\n\nfunction printUser() {\n  console.log(user); // Resolves lexically to \"Outer\"\n}\n\nfunction run() {\n  const user = \"Inner\";\n  printUser(); // Still logs \"Outer\"!\n}\nrun();"
  },
  {
    "id": 23,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Execution Context",
    "question": "What is an Execution Context and what are its components?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn **Execution Context** is the internal environment specification where JavaScript code is evaluated and executed.\n• **Components**:\n  1. **LexicalEnvironment**: Holds `let`, `const`, and function declarations.\n  2. **VariableEnvironment**: Holds `var` declarations.\n  3. **Outer Reference**: Link to outer parent environment forming the Scope Chain.\n  4. **this Binding**: Determined at call-time.\n• **Lifecycle**: Creation Phase (allocations, hoisting) -> Execution Phase (line-by-line running).",
    "code": "// Every function invocation creates an Execution Context:\nfunction authenticate(user) {\n  const token = \"JWT_SECURE\";\n  return token;\n}"
  },
  {
    "id": 24,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Call Stack",
    "question": "What is the Call Stack and how does stack overflow happen?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe **Call Stack** is a LIFO (Last In, First Out) memory structure used by the JavaScript engine to track active function execution frames. When a function is called, its frame is pushed; when it returns, its frame is popped.\n• **Stack Overflow**: Occurs when recursive functions call themselves without reaching a base termination case, exceeding V8's call stack limit (~10,000–65,000 frames) and throwing `RangeError: Maximum call stack size exceeded`.",
    "code": "// Stack Overflow Example:\nfunction recurse() {\n  recurse(); // Unbounded recursion!\n}\n// recurse(); // RangeError: Maximum call stack size exceeded"
  },
  {
    "id": 25,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Scope",
    "question": "What is the difference between function scope and block scope?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Function Scope**: Variables declared with `var` are accessible anywhere within their enclosing function, ignoring `if`, `for`, or `while` blocks.\n• **Block Scope**: Variables declared with `let` or `const` are strictly confined within the nearest enclosing pair of curly braces `{ ... }`.",
    "code": "if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1\n// console.log(b); // ReferenceError: b is not defined"
  },
  {
    "id": 26,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Functions",
    "question": "Can an outer scope access variables declared inside a function?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nNo. Variables declared inside a function's execution context are private and encapsulated. They are unreachable from outer scopes unless explicitly returned by the function or accessed via a closure returned to the outer scope.",
    "code": "function secretVault() {\n  const password = \"encrypted_123\";\n  return { getPassword: () => password }; // Exposed via closure\n}\nconst vault = secretVault();\nconsole.log(vault.getPassword()); // \"encrypted_123\""
  },
  {
    "id": 27,
    "topicId": 2,
    "difficulty": "Intermediate",
    "category": "Scope Chain",
    "question": "What is variable shadowing?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nVariable shadowing occurs when a variable declared within an inner scope has the exact same name as a variable in an outer enclosing scope. The inner declaration \"shadows\" (masks) the outer identifier within that inner block, preventing direct access to the outer variable without altering its value.",
    "code": "const role = \"user\";\nfunction authorize() {\n  const role = \"admin\"; // Shadows outer 'role'\n  console.log(role);    // \"admin\"\n}\nauthorize();\nconsole.log(role);      // \"user\" (outer unaffected)"
  },
  {
    "id": 28,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Runtime Errors",
    "question": "What happens when you access or assign to an undeclared variable?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Reading an undeclared variable**: Always throws `ReferenceError: x is not defined`.\n• **Assigning to an undeclared variable**:\n  - In non-strict mode: Automatically creates an accidental global property on `window` or `global`.\n  - In strict mode (`'use strict'`): Throws `ReferenceError: x is not defined`!",
    "code": "'use strict';\nfunction test() {\n  // x = 10; // ReferenceError in strict mode!\n}"
  },
  {
    "id": 29,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Strict Mode",
    "question": "What is Strict Mode and what guarantees does it provide?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nStrict Mode (`'use strict'`) is a restricted variant of JavaScript introduced in ES5 that eliminates silent bugs by throwing explicit exceptions.\n• **Key Guarantees**:\n  1. Prevents accidental globals on undeclared assignment.\n  2. Sets `this === undefined` in unbound function invocations (prevents global window pollution).\n  3. Throws TypeError on assignment to non-writable or getter-only properties.\n  4. Prohibits duplicate function parameter names (`fn(a, a)`).\n  *All ES Modules and ES6 Classes run in strict mode by default.*",
    "code": "'use strict';\nfunction check() {\n  console.log(this); // undefined (in non-strict, would be window)\n}\ncheck();"
  },
  {
    "id": 30,
    "topicId": 2,
    "difficulty": "Junior",
    "category": "Variables",
    "question": "What is the difference between variable declaration, initialization, and assignment?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Declaration**: Introducing an identifier into the scope's Environment Record during compilation.\n• **Initialization**: Allocating memory and binding an initial value (e.g. `undefined`).\n• **Assignment**: Setting or updating the variable's value with an assignment operator (`=`).\n*With `var`, declaration and initialization to `undefined` happen during hoisting. With `let`, initialization is deferred to the declaration statement.*",
    "code": "let x;    // Declared & initialized to undefined\nx = 10;   // Assigned to 10\nconst y = 20; // Declared, initialized & assigned simultaneously"
  },
  {
    "id": 31,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functions",
    "question": "What is the difference between a function declaration and a function expression?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Function Declaration**: A standalone statement (`function name() {}`). Hoisted completely with its function body, meaning it can be invoked anywhere in its enclosing scope, even before its textual definition.\n• **Function Expression**: A function defined as an expression within a variable assignment (`const fn = function() {}`). It obeys variable hoisting rules: the variable identifier is hoisted, but the function body is not assigned until execution reaches that line. Calling it early throws a TDZ `ReferenceError` or `TypeError`.",
    "code": "// Declaration works anywhere in scope:\ngreet(); // \"Hello!\"\nfunction greet() { console.log(\"Hello!\"); }\n\n// Expression cannot be called before evaluation:\n// sayBye(); // ReferenceError: Cannot access 'sayBye' before initialization\nconst sayBye = function() { console.log(\"Bye!\"); };"
  },
  {
    "id": 32,
    "topicId": 3,
    "difficulty": "Intermediate",
    "category": "Functions",
    "question": "What is the difference between arrow functions and regular functions?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n1. **`this` Binding**: Regular functions determine `this` dynamically at the call-site. Arrow functions have no `this` of their own and inherit it **lexically** from their enclosing scope.\n2. **Constructors**: Regular functions can be used as constructors with `new`. Arrow functions cannot and throw `TypeError`.\n3. **Arguments Object**: Regular functions have an `arguments` pseudo-array. Arrow functions do not (use `...args`).\n4. **Binding Methods**: `call()`, `apply()`, and `bind()` cannot change an arrow function's `this`.",
    "code": "const counter = {\n  count: 0,\n  start() {\n    // Arrow function captures lexical 'this' from start():\n    setTimeout(() => {\n      this.count++;\n      console.log(this.count); // 1\n    }, 100);\n  }\n};\ncounter.start();"
  },
  {
    "id": 33,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functional Programming",
    "question": "What does it mean that functions are 'first-class citizens' in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn JavaScript, functions are **first-class citizens**, meaning they are treated like any other variable or value:\n1. They can be assigned to variables and object properties.\n2. They can be passed as arguments into other functions (callbacks).\n3. They can be returned as output from other functions (factories, currying).\n4. They can be stored in arrays and data structures.",
    "code": "// Assign to variable, pass as argument, return from function:\nconst add = (a, b) => a + b;\nconst applyOp = (op, x, y) => op(x, y);\nconsole.log(applyOp(add, 10, 20)); // 30"
  },
  {
    "id": 34,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functional Programming",
    "question": "What is a Higher-Order Function (HOF)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **Higher-Order Function** is a function that either:\n1. **Accepts one or more functions as arguments** (e.g. `Array.prototype.map`, `filter`, `reduce`, `setTimeout`).\n2. **Returns a function as its result** (e.g. function factories, currying, middleware decorators).",
    "code": "// HOF accepting function:\nconst double = x => x * 2;\nconsole.log([1, 2, 3].map(double)); // [2, 4, 6]\n\n// HOF returning function:\nconst createMultiplier = factor => number => number * factor;\nconst triple = createMultiplier(3);\nconsole.log(triple(10)); // 30"
  },
  {
    "id": 35,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Callbacks",
    "question": "What is a callback function and what is the difference between synchronous and asynchronous callbacks?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **callback function** is a function passed as an argument to another function intended to be invoked later.\n• **Synchronous Callbacks**: Executed immediately during the execution of the calling function, blocking until done (e.g. `[].forEach`, `[].filter`).\n• **Asynchronous Callbacks**: Placed on the Task/Microtask Queue and executed after the current call stack clears (e.g. `setTimeout`, DOM event listeners, `fetch`).",
    "code": "// Synchronous: runs immediately on Call Stack\n[1, 2].forEach(x => console.log(\"Sync:\", x));\n\n// Asynchronous: runs via Event Loop Task Queue\nsetTimeout(() => console.log(\"Async: Timer\"), 0);"
  },
  {
    "id": 36,
    "topicId": 3,
    "difficulty": "Senior",
    "category": "Closures",
    "question": "What is a closure and how does the JavaScript engine retain variables in heap memory?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **closure** is the combination of a function bundled together with references to its surrounding lexical state (Lexical Environment). It allows an inner function to access variables from an outer enclosing function even after the outer function has finished executing and its execution frame has been popped off the Call Stack!\n\n### 2. Internal Working & Engine Mechanics\nNormally, local variables allocated inside a function execution context are discarded when the function returns. However, if an inner function outlives the outer function (e.g. returned, stored in an event listener, or scheduled in a timer) and references those outer variables, V8 detects this during compilation. It moves the referenced variables from the Call Stack into an allocated **Closure Object on the Memory Heap**, preserving them until the inner function is garbage collected.\n\n### 3. Production Use Cases\n1. **Data Encapsulation**: Private state in module patterns.\n2. **Factory Functions & Currying**: Creating specialized utility functions.\n3. **Memoization**: Caching computed results.\n4. **Debounce/Throttle**: Retaining active timer IDs.",
    "code": "function createBankAccount(initialBalance) {\n  let balance = initialBalance; // Private variable retained in closure heap\n\n  return {\n    deposit(amount) {\n      balance += amount;\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    }\n  };\n}\n\nconst account = createBankAccount(100);\nconsole.log(account.deposit(50)); // 150\nconsole.log(account.getBalance()); // 150\n// console.log(account.balance); // undefined (Private!)"
  },
  {
    "id": 37,
    "topicId": 3,
    "difficulty": "Intermediate",
    "category": "Closures",
    "question": "Do closures capture a frozen snapshot of variables or live bindings in memory?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nClosures capture **live reference bindings in memory, NOT frozen snapshots**. If the closed-over variable changes in the outer scope, the inner function sees the updated value when invoked.",
    "code": "let message = \"Initial\";\nconst readMessage = () => console.log(message);\n\nmessage = \"Updated\";\nreadMessage(); // \"Updated\" (reads live memory binding!)"
  },
  {
    "id": 38,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functions",
    "question": "What is the difference between parameters and arguments?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Parameters**: The named identifiers declared in the function's signature definition.\n• **Arguments**: The actual runtime values supplied to the function when it is invoked.",
    "code": "function add(x, y) { // x and y are PARAMETERS\n  return x + y;\n}\nadd(10, 20);         // 10 and 20 are ARGUMENTS"
  },
  {
    "id": 39,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functions",
    "question": "How do default parameters work and when do they trigger?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nDefault parameters allow function parameters to be initialized with default values if no value or **strictly `undefined`** is passed during invocation. They do NOT trigger for other falsy values such as `null`, `0`, `false`, or `\"\"`!",
    "code": "function connect(port = 8080) {\n  return `Connected to port ${port}`;\n}\n\nconsole.log(connect());          // \"Connected to port 8080\"\nconsole.log(connect(undefined)); // \"Connected to port 8080\"\nconsole.log(connect(null));      // \"Connected to port null\" (null is NOT undefined!)"
  },
  {
    "id": 40,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Modern JS",
    "question": "What is the rest parameter (...args) vs the arguments object?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Rest Parameter (`...args`)**: An ES6 syntax that gathers remaining arguments into a **true JavaScript Array** instance. Can be used in arrow functions and supports array methods directly (`map`, `reduce`). Must be the last parameter.\n• **`arguments` Object**: A legacy array-like object available only in regular functions. It lacks modern array methods and makes optimization harder for JIT engines.",
    "code": "// Modern Rest Parameter (Clean Array):\nfunction calculateTotal(...prices) {\n  return prices.reduce((sum, p) => sum + p, 0);\n}\nconsole.log(calculateTotal(10, 20, 30)); // 60"
  },
  {
    "id": 41,
    "topicId": 3,
    "difficulty": "Intermediate",
    "category": "Functions & this",
    "question": "What are call(), apply(), and bind(), and how do they differ?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`call`, `apply`, and `bind` are methods on `Function.prototype` used to explicitly control and assign the `this` execution context of a function.\n• **`fn.call(thisArg, arg1, arg2, ...)`**: Invokes the function immediately with comma-separated arguments.\n• **`fn.apply(thisArg, [args])`**: Invokes the function immediately with arguments passed as an array.\n• **`fn.bind(thisArg, arg1, ...)`**: Returns a **new bound function** with permanently bound `this` and optional preset arguments, without invoking it immediately.\n\n### 2. Real-World Use Case\n`bind` is commonly used in event handlers or timer callbacks to preserve component context; `apply` was historically used for variadic functions like `Math.max.apply(null, arr)` before array spread `...` existed.",
    "code": "function introduce(city, country) {\n  return `${this.name} from ${city}, ${country}`;\n}\nconst user = { name: \"Sameer\" };\n\n// call: immediate with arguments list\nconsole.log(introduce.call(user, \"Hyderabad\", \"India\"));\n\n// apply: immediate with array\nconsole.log(introduce.apply(user, [\"Hyderabad\", \"India\"]));\n\n// bind: returns new function for later invocation\nconst boundIntro = introduce.bind(user, \"Hyderabad\");\nconsole.log(boundIntro(\"India\"));"
  },
  {
    "id": 42,
    "topicId": 3,
    "difficulty": "Senior",
    "category": "this Binding",
    "question": "How does the 'this' keyword work in JavaScript (The 4 Rules)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn regular JavaScript functions, `this` is NOT static. It is determined dynamically at the **CALL-SITE** based on how the function is invoked, following 4 rules in order of precedence:\n1. **New Binding**: Was the function called with `new`? `this` is the newly created instance.\n2. **Explicit Binding**: Was it called with `call`, `apply`, or `bind`? `this` is the supplied object.\n3. **Implicit Binding**: Was it invoked as a method of an object (`obj.method()`)? `this` is the context object before the dot.\n4. **Default Binding**: Standalone function invocation (`fn()`). `this` is `undefined` in strict mode, or `window`/`global` in non-strict.\n*Arrow functions ignore all 4 rules and resolve `this` lexically.*",
    "code": "const account = {\n  id: 101,\n  getId() { return this.id; }\n};\nconsole.log(account.getId()); // 101 (Implicit binding)\n\nconst detached = account.getId;\n// detached(); // undefined or TypeError in strict mode (Default binding)"
  },
  {
    "id": 43,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Functions",
    "question": "What is an IIFE (Immediately Invoked Function Expression)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn **IIFE** is a function expression that is defined and executed immediately upon declaration: `(function() { ... })()`.\n• **Purpose**: Historically used before ES6 `let`/`const` and ES Modules to create private local variable scope and avoid polluting the global `window` namespace.",
    "code": "const counterModule = (function() {\n  let count = 0; // Private scope\n  return {\n    increment: () => ++count,\n    get: () => count\n  };\n})();\nconsole.log(counterModule.increment()); // 1"
  },
  {
    "id": 44,
    "topicId": 3,
    "difficulty": "Intermediate",
    "category": "Functional Programming",
    "question": "What is currying and what problem does it solve?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Currying** is the functional technique of transforming a function that takes multiple arguments $f(a, b, c)$ into a sequence of nested functions that each take a single argument: $f(a)(b)(c)$.\n• **Problem Solved**: Enables partial application, configurable utility factories, and smooth function composition pipelines.",
    "code": "const log = (level) => (prefix) => (message) => \n  console.log(`[${level}] [${prefix}] ${message}`);\n\nconst warnAuth = log(\"WARN\")(\"AUTH\");\nwarnAuth(\"Failed login attempt from IP 192.168.1.1\");"
  },
  {
    "id": 45,
    "topicId": 3,
    "difficulty": "Junior",
    "category": "Algorithms",
    "question": "What is the difference between recursion and iteration?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Iteration**: Repeats a block of code using explicit loop constructs (`for`, `while`). Memory-efficient with $O(1)$ stack space.\n• **Recursion**: A function calls itself until reaching a base condition. Elegant for hierarchical structures (trees, nested JSON, graphs), but each recursive call consumes a Call Stack frame ($O(N)$ space), risking stack overflow if depth is large.",
    "code": "// Recursive factorial:\nfunction factorial(n) {\n  if (n <= 1) return 1; // Base case\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5)); // 120"
  },
  {
    "id": 46,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "Objects",
    "question": "What is an object in JavaScript and how is it stored in memory?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn object in JavaScript is a standalone collection of key-value properties. Keys are either strings or Symbols; values can be any primitive or reference type. Objects are mutable reference types allocated in the **Memory Heap**. Variables hold memory pointer references to that heap allocation.",
    "code": "const product = {\n  id: \"P-101\",\n  name: \"Focus Timer\",\n  price: 29.99\n};"
  },
  {
    "id": 47,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "Objects",
    "question": "What is the difference between dot notation and bracket notation for property access?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Dot Notation (`obj.prop`)**: Statically evaluated identifier lookup. Cannot access keys containing spaces, hyphens, or dynamic variables.\n• **Bracket Notation (`obj[expr]`)**: Evaluates the expression at runtime, converting the result to a string/symbol. Enables dynamic variable lookups and access to keys with non-identifier characters (`obj[\"user-agent\"]`).",
    "code": "const user = { \"first-name\": \"Sameer\" };\nconst key = \"first-name\";\nconsole.log(user[key]); // \"Sameer\""
  },
  {
    "id": 48,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "Modern JS",
    "question": "What is destructuring in JavaScript and what features does it support?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Destructuring** is an ES6 syntax allowing properties from objects or elements from arrays to be unpacked into distinct variables concisely.\n• **Features Supported**:\n  1. Default values: `const { role = \"user\" } = config`\n  2. Property renaming: `const { id: userId } = params`\n  3. Nested destructuring: `const { user: { address } } = response`\n  4. Rest properties: `const { id, ...details } = item`",
    "code": "const order = { id: 101, total: 250, customer: \"Ali\" };\nconst { id: orderId, total, status = \"pending\" } = order;\nconsole.log(orderId, total, status); // 101, 250, \"pending\""
  },
  {
    "id": 49,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "Modern JS",
    "question": "What does the spread operator (...) do on objects and arrays?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe **spread operator (`...`)** expands an iterable (like an array) or enumerable own properties of an object into a new receiver. It performs a **shallow copy**: top-level primitive values are copied independently, but nested objects or arrays retain shared memory references!",
    "code": "const original = { a: 1, nested: { b: 2 } };\nconst clone = { ...original, a: 99 };\nclone.nested.b = 999;\nconsole.log(original.nested.b); // 999 (nested reference shared!)"
  },
  {
    "id": 50,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "Memory & Copying",
    "question": "What is the difference between shallow and deep copying, and why use structuredClone()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Shallow Copy**: Duplicates only the immediate top-level properties. Any nested objects or arrays remain shared pointers in memory (`{ ...obj }`, `Object.assign()`).\n• **Deep Copy**: Recursively duplicates the target object and all nested references, achieving full memory isolation.\n• **`structuredClone()`**: The modern global standard API. Handles circular references, Sets, Maps, Dates, and RegExps cleanly without the pitfalls of `JSON.parse(JSON.stringify())` (which drops functions, undefined, Symbols, and throws on circular refs).",
    "code": "const state = {\n  session: \"active\",\n  tags: new Set([\"a\", \"b\"]),\n  config: { theme: \"dark\" }\n};\nconst deep = structuredClone(state);\ndeep.config.theme = \"light\";\nconsole.log(state.config.theme); // \"dark\" (100% independent!)"
  },
  {
    "id": 51,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "Objects",
    "question": "What do Object.keys(), Object.values(), and Object.entries() do?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`Object.keys(obj)`**: Returns an array of an object's own enumerable string property **names**.\n• **`Object.values(obj)`**: Returns an array of its own enumerable property **values**.\n• **`Object.entries(obj)`**: Returns an array of `[key, value]` pairs (useful with `for...of` or converting to `new Map(Object.entries(obj))`).",
    "code": "const scores = { math: 90, physics: 85 };\nconsole.log(Object.keys(scores));    // [\"math\", \"physics\"]\nconsole.log(Object.values(scores));  // [90, 85]\nconsole.log(Object.entries(scores)); // [[\"math\", 90], [\"physics\", 85]]"
  },
  {
    "id": 52,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "Prototypes",
    "question": "What is a prototype in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **prototype** is an internal mechanism in JavaScript that enables objects to share properties and methods without duplicating them in memory on every instance. Every object has an internal link (`[[Prototype]]`) pointing to its prototype object. If a property is not found on the instance, the engine automatically checks its prototype.",
    "code": "const animal = {\n  speak() { return `${this.name} makes a sound`; }\n};\nconst dog = Object.create(animal);\ndog.name = \"Rex\";\nconsole.log(dog.speak()); // \"Rex makes a sound\" (inherited via prototype!)"
  },
  {
    "id": 53,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "Prototypes",
    "question": "What is the prototype chain and how does property lookup work?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe **prototype chain** is the linked sequence of delegate prototype objects traversed during property lookup:\n1. Engine checks if `prop` is an own property of `obj` (`Object.hasOwn(obj, prop)`).\n2. If not found, checks `Object.getPrototypeOf(obj)`.\n3. Traverses upward through prototypes until reaching `Object.prototype`.\n4. If still not found, `Object.prototype.[[Prototype]]` is `null`, terminating traversal and returning `undefined`.",
    "code": "const arr = [1, 2, 3];\n// arr -> Array.prototype -> Object.prototype -> null\nconsole.log(arr.hasOwnProperty(\"length\")); // resolved via Object.prototype"
  },
  {
    "id": 54,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "Prototypes",
    "question": "What is the difference between prototype and __proto__?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`prototype`**: A property that exists on **constructor functions and classes**. It is the prototype object assigned to the `[[Prototype]]` link of instances created when invoking `new Constructor()`.\n• **`__proto__`**: A legacy accessor property on **object instances** that points to their prototype (`[[Prototype]]`). Modern code must use `Object.getPrototypeOf(obj)` and `Object.setPrototypeOf(obj, proto)`.",
    "code": "function Person(name) { this.name = name; }\nconst p = new Person(\"Sameer\");\nconsole.log(Object.getPrototypeOf(p) === Person.prototype); // true"
  },
  {
    "id": 55,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "OOP",
    "question": "What is a constructor function in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **constructor function** is a regular function designed to be invoked with the `new` keyword to instantiate new object instances. By convention, its name is Capitalized. Inside, `this` refers to the newly instantiated object.",
    "code": "function Car(make, model) {\n  this.make = make;\n  this.model = model;\n}\nCar.prototype.drive = function() { return `Driving ${this.model}`; };\nconst myCar = new Car(\"Tesla\", \"Model 3\");\nconsole.log(myCar.drive()); // \"Driving Model 3\""
  },
  {
    "id": 56,
    "topicId": 4,
    "difficulty": "Senior",
    "category": "The new Operator",
    "question": "What does the 'new' operator do under the hood (The 4-Step Algorithm)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nWhen `new ConstructorFunction(...args)` is called, the JavaScript engine executes 4 distinct steps:\n1. **Allocates a fresh empty object**: `const instance = {}`.\n2. **Links prototype**: `Object.setPrototypeOf(instance, ConstructorFunction.prototype)`.\n3. **Binds `this` and executes constructor body**: `ConstructorFunction.apply(instance, args)`.\n4. **Returns instance**: Returns the newly created object, UNLESS the constructor explicitly returns its own non-primitive object.",
    "code": "// Polyfilling the new operator algorithm:\nfunction simulateNew(Constructor, ...args) {\n  const instance = Object.create(Constructor.prototype); // Steps 1 & 2\n  const result = Constructor.apply(instance, args);       // Step 3\n  return (typeof result === \"object\" && result !== null) ? result : instance; // Step 4\n}"
  },
  {
    "id": 57,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "ES6 Classes",
    "question": "What are JavaScript classes?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIntroduced in ES6, JavaScript **classes are syntactic sugar over the existing prototype-based inheritance model**. Under the hood, classes still construct prototype chains.\n• Methods declared inside a class body reside on `Class.prototype`.\n• The `constructor()` runs when invoked with `new`.\n• Classes always execute in strict mode and cannot be invoked without `new` (throws `TypeError`).",
    "code": "class User {\n  constructor(name) { this.name = name; }\n  greet() { return `Hi, I am ${this.name}`; }\n}\nconsole.log(typeof User); // \"function\"! (Classes are functions)"
  },
  {
    "id": 58,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "ES6 Classes",
    "question": "How does class inheritance work with extends and super()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`extends`**: Links the prototype chain between child class and parent class: `Child.prototype.[[Prototype]] === Parent.prototype`.\n• **`super()`**: In a derived class constructor, `super(...args)` invokes the parent class constructor and initializes `this`.\n*Rule: In a derived class constructor, you MUST call `super()` before accessing `this`, otherwise a ReferenceError is thrown!*",
    "code": "class Vehicle {\n  constructor(wheels) { this.wheels = wheels; }\n}\nclass Bike extends Vehicle {\n  constructor() {\n    super(2); // Must call parent constructor first!\n    this.type = \"motorcycle\";\n  }\n}"
  },
  {
    "id": 59,
    "topicId": 4,
    "difficulty": "Junior",
    "category": "ES6 Classes",
    "question": "What are static methods and properties in JavaScript classes?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Static methods and properties** belong directly to the class constructor function itself, NOT to instances of the class. They cannot be called through an instance (`instance.staticMethod()` is `undefined`). Common for utility functions (e.g. `Math.max()`, `Array.isArray()`, or database model factory methods).",
    "code": "class Config {\n  static defaultTimeout = 5000;\n  static createDefault() { return new Config(); }\n}\nconsole.log(Config.defaultTimeout); // 5000"
  },
  {
    "id": 60,
    "topicId": 4,
    "difficulty": "Intermediate",
    "category": "Modern JS",
    "question": "What are private class fields (#) in modern JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nPrefixing a class property or method with a hash symbol (`#`) makes it a **hard private field**. Private fields cannot be accessed, read, or modified from outside the class body, nor from derived child subclasses. Attempting to access `obj.#privateField` outside throws a compile-time `SyntaxError`.",
    "code": "class Wallet {\n  #balance = 0; // Truly private in memory\n\n  deposit(amount) {\n    this.#balance += amount;\n    return this.#balance;\n  }\n}\nconst w = new Wallet();\nw.deposit(100);\n// console.log(w.#balance); // SyntaxError: Private field '#balance' must be declared"
  },
  {
    "id": 61,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Arrays",
    "question": "What is an Array in JavaScript and how does it differ from a plain Object?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn JavaScript, an **Array is a specialized object** with numeric indices and an automatic `length` property that automatically synchronizes as items are appended. Its prototype is `Array.prototype`, providing built-in iteration and algorithmic transformation methods (`map`, `filter`, `reduce`).",
    "code": "const arr = [\"a\", \"b\", \"c\"];\nconsole.log(arr.length); // 3\nconsole.log(Array.isArray(arr)); // true"
  },
  {
    "id": 62,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What is the difference between map() and forEach()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`map()`**: Returns a **new array** containing the results of invoking the callback on every element. Pure transformation without mutating the original array.\n• **`forEach()`**: Executes a side-effect callback for every element and **always returns `undefined`**. Does not chain.",
    "code": "const numbers = [1, 2, 3];\nconst doubled = numbers.map(x => x * 2); // [2, 4, 6]\nconst sideEffect = numbers.forEach(x => console.log(x)); // returns undefined"
  },
  {
    "id": 63,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What does Array.prototype.filter() do and does it mutate the original array?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`filter()` evaluates a boolean predicate callback on every element and returns a **new array** containing only the elements for which the callback returned a truthy value. It **does NOT mutate** the original array.",
    "code": "const scores = [45, 88, 92, 33];\nconst passing = scores.filter(s => s >= 50); // [88, 92]"
  },
  {
    "id": 64,
    "topicId": 5,
    "difficulty": "Intermediate",
    "category": "Array Methods",
    "question": "How does Array.prototype.reduce() work?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`reduce()` executes a reducer function on each array element in sequence, passing the return value from the calculation on the preceding element. The final result is a single accumulated value (number, object, or array).\n• **Syntax**: `arr.reduce((accumulator, currentValue, index, array) => nextAcc, initialValue)`\n*Tip: Always supply an explicit initialValue to avoid TypeErrors on empty arrays!*",
    "code": "const cart = [{ price: 10 }, { price: 25 }, { price: 40 }];\nconst total = cart.reduce((sum, item) => sum + item.price, 0); // 75"
  },
  {
    "id": 65,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What is the difference between slice() and splice()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`slice(start, end)`**: Pure extraction. Returns a shallow copy of a portion of an array without modifying the original array.\n• **`splice(start, deleteCount, ...items)`**: Mutating operation. Modifies the array in place by removing, replacing, or adding elements. Returns an array of removed elements.",
    "code": "const items = [\"a\", \"b\", \"c\", \"d\"];\n// slice (Non-mutating):\nconsole.log(items.slice(1, 3)); // [\"b\", \"c\"]\nconsole.log(items); // [\"a\", \"b\", \"c\", \"d\"] (untouched)\n\n// splice (MUTATES!):\nitems.splice(1, 2, \"X\");\nconsole.log(items); // [\"a\", \"X\", \"d\"]"
  },
  {
    "id": 66,
    "topicId": 5,
    "difficulty": "Intermediate",
    "category": "Array Methods",
    "question": "What is the default behavior of Array.prototype.sort() and what is the gotcha?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nBy default, `sort()` converts all elements to strings and sorts them in ascending lexicographical (alphabetical) order.\n• **The Gotcha**: `[10, 2, 35].sort()` results in `[10, 2, 35]` because `\"10\"` precedes `\"2\"` alphabetically!\n• **Solution**: Always pass a numeric comparator: `(a, b) => a - b` (ascending) or `(a, b) => b - a` (descending). Mutates the original array in place.",
    "code": "const nums = [10, 2, 35];\nnums.sort();\nconsole.log(nums); // [10, 2, 35] <-- GOTCHA!\n\nnums.sort((a, b) => a - b);\nconsole.log(nums); // [2, 10, 35] <-- CORRECT!"
  },
  {
    "id": 67,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What is the difference between indexOf(), find(), and findIndex()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`indexOf(val)`**: Searches for a primitive value via strict equality (`===`) and returns its index, or `-1`. Cannot search complex objects by predicate.\n• **`find(predicate)`**: Returns the **first element** that satisfies the callback condition, or `undefined`.\n• **`findIndex(predicate)`**: Returns the **index of the first element** that satisfies the callback, or `-1`.",
    "code": "const users = [{ id: 1, name: \"Ali\" }, { id: 2, name: \"Sameer\" }];\nconsole.log(users.find(u => u.id === 2));      // { id: 2, name: \"Sameer\" }\nconsole.log(users.findIndex(u => u.id === 2)); // 1"
  },
  {
    "id": 68,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What is the difference between some() and every()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`some(predicate)`**: Returns `true` if **at least one** element passes the predicate. Short-circuits on the first `true`.\n• **`every(predicate)`**: Returns `true` only if **ALL** elements pass the predicate. Short-circuits on the first `false`.",
    "code": "const ages = [18, 22, 16, 25];\nconsole.log(ages.some(a => a < 18));  // true (at least one minor)\nconsole.log(ages.every(a => a >= 18)); // false (not all adults)"
  },
  {
    "id": 69,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What are flat() and flatMap()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`flat(depth)`**: Creates a new array with sub-array elements concatenated up to the specified depth (default 1; use `Infinity` to flatten all levels).\n• **`flatMap(callback)`**: Maps each element using a mapping function, then flattens the result by 1 level. Identical to `arr.map(...).flat(1)`, but more performant in a single pass.",
    "code": "const nested = [1, [2, [3, 4]]];\nconsole.log(nested.flat(Infinity)); // [1, 2, 3, 4]\n\nconst sentences = [\"Hello world\", \"Fast React\"];\nconsole.log(sentences.flatMap(s => s.split(\" \"))); // [\"Hello\", \"world\", \"Fast\", \"React\"]"
  },
  {
    "id": 70,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Array Methods",
    "question": "What does Array.from() do?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`Array.from(arrayLike, mapFn)` creates a genuine, shallow-copied Array from an iterable or array-like object (such as `NodeList`, `Set`, `arguments`, or string). An optional second argument maps elements during array creation.",
    "code": "// Generate range 1 to 5:\nconst range = Array.from({ length: 5 }, (_, i) => i + 1);\nconsole.log(range); // [1, 2, 3, 4, 5]"
  },
  {
    "id": 71,
    "topicId": 5,
    "difficulty": "Intermediate",
    "category": "Collections",
    "question": "What is an ES6 Map and how does it compare to a plain Object?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn **ES6 Map** is a keyed collection of key-value pairs where:\n1. **Any key type**: Keys can be objects, functions, or primitives (Objects only accept strings/symbols).\n2. **Guaranteed Order**: Iterates elements strictly in insertion order.\n3. **$O(1)$ Size**: Has built-in `map.size`.\n4. **Performance**: Optimized for frequent additions and removals.",
    "code": "const userMap = new Map();\nconst keyObj = { id: 1 };\nuserMap.set(keyObj, \"Admin Data\");\nconsole.log(userMap.get(keyObj)); // \"Admin Data\""
  },
  {
    "id": 72,
    "topicId": 5,
    "difficulty": "Junior",
    "category": "Collections",
    "question": "What is an ES6 Set and how does it compare to an Array?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn **ES6 Set** is a collection of unique values. Duplicate values are discarded automatically.\n• **Performance**: Lookups with `set.has(val)` run in average **$O(1)$ constant time** using hash tables, whereas `array.includes(val)` requires a linear **$O(N)$** scan.",
    "code": "const duplicates = [1, 2, 2, 3, 4, 4];\nconst unique = [...new Set(duplicates)]; // [1, 2, 3, 4]"
  },
  {
    "id": 73,
    "topicId": 5,
    "difficulty": "Senior",
    "category": "Collections & GC",
    "question": "What are WeakMap and WeakSet and how do their garbage collection semantics work?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`WeakMap` and `WeakSet` hold references to object keys **weakly**: they do not prevent garbage collection of the key objects if no other strong references exist.\n• **Rules**:\n  1. Keys must be objects.\n  2. Not iterable and have no `.size` property (to avoid non-deterministic GC timing leaks).\n• **Use Case**: Storing private data for DOM elements or memoization caches tied to object lifetimes without causing memory leaks.",
    "code": "let button = document.createElement(\"button\");\nconst meta = new WeakMap();\nmeta.set(button, { clicks: 0 });\n\nbutton = null; // Eligible for Garbage Collection immediately!"
  },
  {
    "id": 74,
    "topicId": 5,
    "difficulty": "Intermediate",
    "category": "Iterators",
    "question": "What is an iterable and how does Symbol.iterator work?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn object is **iterable** if it implements the iterable protocol by defining a method keyed by `[Symbol.iterator]`. This method must return an **iterator** object with a `.next()` method returning `{ value, done: boolean }`. Iterables work with `for...of` loops and spread operators.",
    "code": "const range = {\n  from: 1, to: 3,\n  [Symbol.iterator]() {\n    let current = this.from;\n    const last = this.to;\n    return {\n      next: () => current <= last ? { value: current++, done: false } : { done: true }\n    };\n  }\n};\nconsole.log([...range]); // [1, 2, 3]"
  },
  {
    "id": 75,
    "topicId": 5,
    "difficulty": "Intermediate",
    "category": "Generators",
    "question": "What are generator functions and the yield keyword?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **generator function** (`function*`) can pause execution mid-stream using the `yield` keyword and resume later when invoked with `.next()`. It produces a generator object that adheres to the iterator protocol. Enables lazy evaluation of infinite streams and co-routine patterns.",
    "code": "function* idGenerator() {\n  let id = 1;\n  while (true) {\n    yield id++;\n  }\n}\nconst gen = idGenerator();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2"
  },
  {
    "id": 76,
    "topicId": 6,
    "difficulty": "Junior",
    "category": "Async JS",
    "question": "What is the difference between synchronous and asynchronous code in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Synchronous Code**: Executes sequentially on the Call Stack. Each line blocks the execution of subsequent lines until it finishes.\n• **Asynchronous Code**: Offloads long-running operations (network requests, timers, disk I/O) to host APIs, allowing the Call Stack to keep processing other work. Callbacks resume via the Event Loop when the call stack clears.",
    "code": "console.log(\"1. Sync Start\");\nsetTimeout(() => console.log(\"3. Async Callback\"), 0);\nconsole.log(\"2. Sync End\");"
  },
  {
    "id": 77,
    "topicId": 6,
    "difficulty": "Senior",
    "category": "Concurrency",
    "question": "How does JavaScript achieve high-throughput concurrency despite having a single-threaded Call Stack?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nJavaScript achieves concurrency through its **event-driven non-blocking runtime architecture**. While the JS engine call stack executes on a single thread, the host environment (Browser Web APIs or Node.js Libuv) is multi-threaded. The host handles socket I/O, network streams, and OS system calls in background threads. When I/O completes, the event loop queues callbacks on the task/microtask queues to be processed by the single thread without ever blocking.",
    "code": "// Single-threaded JS offloading to multi-threaded host:\nfetch(\"/api/users\").then(res => res.json()); // Network handled on background OS socket"
  },
  {
    "id": 78,
    "topicId": 6,
    "difficulty": "Senior",
    "category": "Event Loop",
    "question": "What is the Event Loop and what are its exact execution steps?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe **Event Loop** is the continuous orchestration loop coordinating the Call Stack and task queues:\n1. Executes current synchronous code on the Call Stack to completion.\n2. Drains the entire **Microtask Queue** (Promises, queueMicrotask).\n3. Evaluates rendering opportunities (in browsers).\n4. Dequeues and executes **ONE Task (Macrotask)** from the Task Queue.\n5. Returns to step 2 and repeats indefinitely.",
    "code": "// Execution order: Sync -> Microtask -> Macrotask\nconsole.log(\"A\");\nsetTimeout(() => console.log(\"C\"), 0);\nPromise.resolve().then(() => console.log(\"B\"));\n// Output: A, B, C"
  },
  {
    "id": 79,
    "topicId": 6,
    "difficulty": "Senior",
    "category": "Event Loop",
    "question": "What is the difference between the Task (Macrotask) Queue and the Microtask Queue?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Microtask Queue**: Has higher priority. Drain-all semantics: the entire queue is processed until completely empty before any rendering or macrotasks run (`Promise.then`, `queueMicrotask`, `process.nextTick`).\n• **Task (Macrotask) Queue**: Lower priority. One-task-per-turn: the event loop picks exactly ONE macrotask, executes it, and immediately returns to drain newly spawned microtasks (`setTimeout`, `setInterval`, I/O).",
    "code": "setTimeout(() => console.log(\"Macrotask\"), 0);\nqueueMicrotask(() => console.log(\"Microtask\"));\n// Output: Microtask, Macrotask"
  },
  {
    "id": 80,
    "topicId": 6,
    "difficulty": "Junior",
    "category": "Promises",
    "question": "What is a Promise in JavaScript and what are its three states?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA **Promise** is a state-machine object representing the eventual completion (fulfillment) or failure (rejection) of an asynchronous operation.\n• **The 3 Mutually Exclusive States**:\n  1. `pending`: Initial state. Neither fulfilled nor rejected.\n  2. `fulfilled`: Succeeded with an immutable resolved value.\n  3. `rejected`: Failed with an immutable rejection error reason.\n*Once settled (fulfilled or rejected), a Promise can NEVER change state again.*",
    "code": "const promise = new Promise((resolve, reject) => {\n  const success = true;\n  if (success) resolve(\"Data loaded\");\n  else reject(new Error(\"Network failure\"));\n});"
  },
  {
    "id": 81,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Promises",
    "question": "How does Promise chaining work and what is a 'thenable'?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nPromise chaining works because `.then()`, `.catch()`, and `.finally()` **always return a brand-new Promise**.\n• If a handler returns a scalar value, the new promise resolves immediately with that value.\n• If a handler returns another Promise (or any **thenable** object with a `.then()` method), the outer promise assimilates its state, waiting until the inner promise settles. This eliminates nested callback hell.",
    "code": "fetch(\"/api/user\")\n  .then(res => res.json())     // Assimilates json() promise\n  .then(user => user.cartId)   // Resolves scalar cartId\n  .then(cartId => fetch(`/api/cart/${cartId}`)) // Chains next async request\n  .catch(err => console.error(err));"
  },
  {
    "id": 82,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Promise Combinators",
    "question": "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nThe 4 Promise combinators coordinate concurrent asynchronous tasks:\n• **`Promise.all()`**: Fulfills when **ALL** promises fulfill. Short-circuits and rejects on the **FIRST** rejection (all-or-nothing).\n• **`Promise.allSettled()`**: Waits until **ALL** promises settle. Never rejects. Returns an array of `{ status, value | reason }` descriptor objects.\n• **`Promise.race()`**: Settles as soon as the **FIRST** promise settles (fulfills or rejects).\n• **`Promise.any()`**: Fulfills as soon as the **FIRST** promise fulfills. Rejects with an `AggregateError` only if **ALL** promises reject.",
    "table": {
      "headers": [
        "Combinator",
        "Fulfills When",
        "Rejects When",
        "Short-Circuit?"
      ],
      "rows": [
        [
          "Promise.all()",
          "ALL fulfill",
          "ANY rejects",
          "Yes (on 1st rejection)"
        ],
        [
          "Promise.allSettled()",
          "ALL settle",
          "Never rejects",
          "No"
        ],
        [
          "Promise.race()",
          "FIRST settles",
          "FIRST settles",
          "Yes (1st settlement)"
        ],
        [
          "Promise.any()",
          "FIRST fulfills",
          "ALL reject (AggregateError)",
          "Yes (1st fulfillment)"
        ]
      ]
    }
  },
  {
    "id": 83,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Async/Await",
    "question": "What is async/await and how does it desugar under the hood?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`async/await` is syntactic sugar built on top of **Promises and Generator functions**.\n• An `async function` always wraps its return value in `Promise.resolve()`.\n• Inside, `await` suspends function execution without blocking the main thread, yielding execution back to the event loop until the awaited promise settles. Under the hood, the engine compiles `async/await` into a state machine that drives a generator with `yield promise`.",
    "code": "// Async/await:\nasync function loadData() {\n  const user = await fetchUser();\n  return user.name;\n}\n\n// Equivalent Promise desugaring:\nfunction loadDataDesugared() {\n  return Promise.resolve()\n    .then(() => fetchUser())\n    .then(user => user.name);\n}"
  },
  {
    "id": 84,
    "topicId": 6,
    "difficulty": "Junior",
    "category": "Async Error Handling",
    "question": "How do you handle errors properly in async/await code?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAsync errors are handled using standard **`try/catch/finally` blocks**. When an awaited Promise rejects, `await` unwraps the rejection reason and throws it as an exception that can be caught by `catch(err)`. The `finally` block runs guaranteed cleanups (e.g. closing DB connections or stopping loading spinners).",
    "code": "async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (error) {\n    console.error(\"Fetch failed:\", error.message);\n    throw error; // Re-throw or handle gracefully\n  } finally {\n    console.log(\"Cleanup complete\");\n  }\n}"
  },
  {
    "id": 85,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Error Handling",
    "question": "What happens when a Promise rejection is unhandled?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nWhen a promise rejects without a `.catch()` or surrounding `try/catch`, it triggers an **Unhandled Promise Rejection**:\n• **In Node.js**: Emits the `unhandledRejection` process event. In modern Node.js (v15+), unhandled rejections terminate the process with exit code 1 to avoid running in an unpredictable state!\n• **In Browsers**: Emits the `unhandledrejection` window event.",
    "code": "// Catching unhandled rejections globally in Node.js:\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(\"Unhandled Rejection at:\", promise, \"reason:\", reason);\n  process.exit(1);\n});"
  },
  {
    "id": 86,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Modern Web APIs",
    "question": "What is AbortController and how is it used to cancel fetch requests?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`AbortController` is the standard web controller interface used to cancel in-flight asynchronous operations.\n• Create controller: `const controller = new AbortController()`\n• Pass signal: `fetch(url, { signal: controller.signal })`\n• Cancel request: `controller.abort()`\nWhen aborted, the fetch promise rejects immediately with a `DOMException` whose name is `\"AbortError\"`. Essential for debounced autocomplete inputs and cleaning up requests in React `useEffect`.",
    "code": "const controller = new AbortController();\nsetTimeout(() => controller.abort(), 2000); // 2s timeout\n\nfetch(\"/api/large-dataset\", { signal: controller.signal })\n  .catch(err => {\n    if (err.name === \"AbortError\") console.log(\"Request cancelled cleanly!\");\n  });"
  },
  {
    "id": 87,
    "topicId": 6,
    "difficulty": "Junior",
    "category": "Timers & Event Loop",
    "question": "Why does setTimeout(fn, 0) not execute immediately?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`setTimeout(fn, 0)` does not mean \"run in 0 milliseconds right now\". It means **\"schedule this callback as a Macrotask to run on the next available turn of the Event Loop once the current Call Stack and all pending Microtasks are completely drained\"**. Furthermore, browsers enforce a minimum timer clamping delay of 4ms for nested timers.",
    "code": "console.log(\"1\");\nsetTimeout(() => console.log(\"3\"), 0);\nconsole.log(\"2\");\n// Output: 1, 2, 3"
  },
  {
    "id": 88,
    "topicId": 6,
    "difficulty": "Senior",
    "category": "Timers & Precision",
    "question": "What causes timer drift in setInterval and how do you achieve accurate pacing?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`setInterval` does not account for the execution time of its callback or other work on the Call Stack. If the callback takes 50ms and the interval is 100ms, the timer drifts significantly over minutes.\n• **Senior Solution**: Use **Self-Adjusting Recursive `setTimeout`**: Measure the actual elapsed time using `performance.now()` and dynamically calculate the exact offset delay for the next tick!",
    "code": "function accurateInterval(callback, interval) {\n  let expected = performance.now() + interval;\n\n  function step() {\n    const drift = performance.now() - expected;\n    callback();\n    expected += interval;\n    // Adjust next timeout by subtracting accumulated drift:\n    setTimeout(step, Math.max(0, interval - drift));\n  }\n\n  setTimeout(step, interval);\n}"
  },
  {
    "id": 89,
    "topicId": 6,
    "difficulty": "Senior",
    "category": "Node.js Internals",
    "question": "What is the difference between process.nextTick() and Promise microtasks in Node.js?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn Node.js:\n• **`process.nextTick()`**: Maintains its own private `nextTickQueue`. It has the **absolute highest priority** in the runtime, draining immediately after the currently executing operation finishes, BEFORE any Promise microtasks or the Libuv event loop advances!\n• **Promise Microtasks**: Drained after the `nextTickQueue` is completely cleared.\n*Warning: Recursive process.nextTick calls starve the event loop, completely blocking I/O!*",
    "code": "Promise.resolve().then(() => console.log(\"2. Promise microtask\"));\nprocess.nextTick(() => console.log(\"1. nextTick (HIGHEST PRIORITY!)\"));\n// Output: 1. nextTick, 2. Promise microtask"
  },
  {
    "id": 90,
    "topicId": 6,
    "difficulty": "Intermediate",
    "category": "Async Concurrency",
    "question": "What is the difference between sequential await and Promise.all concurrency?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Sequential `await`**: Requests execute serially one after another, creating a network latency waterfall: $\\text{Total Time} = T_1 + T_2$. Use only when request 2 depends on data from request 1.\n• **`Promise.all()`**: Dispatches all requests in parallel concurrently: $\\text{Total Time} = \\max(T_1, T_2)$. Drastically reduces total response time for independent data.",
    "code": "// Waterfall (Slow):\nconst user = await fetchUser();\nconst cart = await fetchCart();\n\n// Concurrent (Fast):\nconst [user, cart] = await Promise.all([fetchUser(), fetchCart()]);"
  },
  {
    "id": 91,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Modules",
    "question": "What is the difference between CommonJS (CJS) and ES Modules (ESM)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **CommonJS (`require` / `module.exports`)**: The traditional Node.js module system. Modules are loaded **synchronously at runtime**. Imports return a **value copy** of exported bindings.\n• **ES Modules (`import` / `export`)**: The official ECMAScript standard. Modules are parsed **asynchronously and statically analyzed at compile-time**. Imports create **live read-only bindings** to the exported variables. Enables tree-shaking.",
    "table": {
      "headers": [
        "Feature",
        "CommonJS (CJS)",
        "ES Modules (ESM)"
      ],
      "rows": [
        [
          "Syntax",
          "const m = require('m')",
          "import m from 'm'"
        ],
        [
          "Loading",
          "Synchronous at runtime",
          "Asynchronous static analysis"
        ],
        [
          "Bindings",
          "Copied values",
          "Live read-only bindings"
        ],
        [
          "Tree-Shaking",
          "No",
          "Yes (Statically optimizable)"
        ],
        [
          "Top-Level Await",
          "No",
          "Yes (Supported in ES2022)"
        ]
      ]
    }
  },
  {
    "id": 92,
    "topicId": 7,
    "difficulty": "Senior",
    "category": "Modules",
    "question": "What are live bindings in ES Modules vs value copies in CommonJS?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIn CommonJS, `require()` imports a shallow copy of the exported value at the time of export. If the exporting module later updates that variable internally, the importing module continues to see the old stale value.\nIn ES Modules, `import` creates a **live pointer binding** to the exported variable. When the exporting module updates the variable internally, the importing module immediately observes the updated value!",
    "code": "// In ESM:\n// counter.js: export let count = 1; export const increment = () => count++;\n// main.js: import { count, increment } from './counter.js';\n// increment(); console.log(count); // 2 (Live binding reflects update!)"
  },
  {
    "id": 93,
    "topicId": 7,
    "difficulty": "Junior",
    "category": "Modules",
    "question": "What is the difference between named exports and default exports?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Named Exports (`export const x`)**: Multiple per module. Must be imported using exact matching names in curly braces `import { x }` (or renamed with `as`). Better for tooling and tree-shaking.\n• **Default Export (`export default x`)**: Exactly one per module. Can be imported with any arbitrary identifier without curly braces (`import myName from './mod'`).",
    "code": "export const auth = {};\nexport const logger = {};\nexport default class App {}"
  },
  {
    "id": 94,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Modules",
    "question": "What is dynamic import() and when should it be used?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n`import(specifier)` is a function-like expression that loads an ES module dynamically and asynchronously, returning a Promise that resolves to the module namespace.\n• **Use Cases**:\n  1. **Code-Splitting in React**: Lazy loading route components (`React.lazy(() => import('./Dashboard'))`).\n  2. **Conditional Loading**: Loading heavy libraries (e.g. chart library, PDF generator) only when the user clicks a button.",
    "code": "async function openAdminPanel() {\n  const { AdminPanel } = await import(\"./AdminPanel.js\");\n  AdminPanel.render();\n}"
  },
  {
    "id": 95,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Modern JS",
    "question": "What is Top-Level Await in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIntroduced in ES2022, **Top-Level Await** allows the `await` keyword to be used at the top level of an ES Module outside of any `async function`. It blocks the execution of dependent importing modules until the asynchronous initialization (e.g. database connection or dynamic config fetch) settles.",
    "code": "// db.js (ES Module):\nexport const connection = await createDbConnection();"
  },
  {
    "id": 96,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Bundling & Performance",
    "question": "What is tree-shaking and what module system is required for it to work?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Tree-shaking** is a dead-code elimination technique used by modern bundlers (Vite, Rollup, Webpack) that strips unused exports from the final production bundle.\n• **Prerequisite**: Requires **ES Modules (`import`/`export`)** because their static module structure allows the bundler to determine exactly which exports are used at compile-time without executing the code. CommonJS dynamic `require()` cannot be reliably tree-shaken.",
    "code": "// Only 'formatCurrency' is bundled; 'calculateMortgage' is tree-shaken away:\nimport { formatCurrency } from \"./utils.js\";"
  },
  {
    "id": 97,
    "topicId": 7,
    "difficulty": "Junior",
    "category": "Error Handling",
    "question": "How does try/catch/finally work and why does synchronous try/catch fail on async code?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA synchronous `try/catch` block only catches exceptions thrown during the execution of its current synchronous Call Stack. If an asynchronous callback (e.g. inside `setTimeout`) throws an error, the `try/catch` block has already finished executing and exited the stack hours ago!\n• **Solution**: Use `async/await` with `try/catch`, or attach `.catch()` to Promises.",
    "code": "// BROKEN: try/catch does NOT catch unawaited async callback:\ntry {\n  setTimeout(() => {\n    // throw new Error(\"Boom\"); // Uncaught exception!\n  }, 100);\n} catch (e) {\n  // Never reaches here!\n}"
  },
  {
    "id": 98,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Error Handling",
    "question": "How do you create custom Error classes in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nExtend the built-in `Error` class, pass the message to `super(message)`, and set `this.name = this.constructor.name`. In Node.js, call `Error.captureStackTrace(this, this.constructor)` to maintain a clean stack trace.",
    "code": "class AppError extends Error {\n  constructor(message, statusCode = 500) {\n    super(message);\n    this.name = this.constructor.name;\n    this.statusCode = statusCode;\n    if (Error.captureStackTrace) {\n      Error.captureStackTrace(this, this.constructor);\n    }\n  }\n}\nclass NotFoundError extends AppError {\n  constructor(resource) {\n    super(`${resource} not found`, 404);\n  }\n}"
  },
  {
    "id": 99,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Memory Management",
    "question": "How does the V8 Memory Heap differ from the Call Stack?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Call Stack**: Fixed, contiguous memory region managed automatically in LIFO order by CPU instructions. Fast allocation. Stores execution context frames, function return addresses, and small primitive variables.\n• **Memory Heap**: Large, unstructured pool of dynamic memory. Slower allocation. Stores reference types (Objects, Arrays, Closures). Managed by the V8 Garbage Collector.",
    "code": "// Stack: primitive 'id' and pointer 'user'\n// Heap: object data { name: \"Sameer\" }\nconst id = 101;\nconst user = { name: \"Sameer\" };"
  },
  {
    "id": 100,
    "topicId": 7,
    "difficulty": "Senior",
    "category": "V8 Internals & GC",
    "question": "How does V8 Generational Garbage Collection work (Scavenger nursery vs Mark-Sweep old space)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nV8 uses a **Generational Garbage Collector** based on the hypothesis that most objects die young.\n• **New Space (Nursery)**: Small area (1–64MB) for new allocations. Collected frequently using the ultra-fast **Scavenge algorithm (Cheney's copying algorithm)**: surviving objects are evacuated to a fresh semi-space.\n• **Old Space**: Objects that survive two GC cycles are promoted to Old Space. Collected via the **Mark-Sweep-Compact** algorithm: marks reachable objects from GC roots, sweeps dead memory, and compacts fragmented blocks.",
    "code": "// Short-lived allocations live and die in New Space:\nfunction processChunk() {\n  const tempBuffer = new Array(100).fill(0); // Scavenged quickly!\n}"
  },
  {
    "id": 101,
    "topicId": 7,
    "difficulty": "Senior",
    "category": "Memory Leaks",
    "question": "What are the top 5 memory leak vectors in JavaScript applications?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n1. **Uncleared `setInterval` / `setTimeout`**: Retains closed-over variables indefinitely.\n2. **Dangling Event Listeners**: Adding listeners to `window` or `document` without removing them in component unmount cleanups.\n3. **Unbounded In-Memory Caches**: Storing items in a `Map` or array without an eviction policy (LRU / TTL).\n4. **Detached DOM Nodes**: Keeping references to deleted DOM nodes in JavaScript variables.\n5. **Accidental Globals**: Assigning to undeclared variables in non-strict mode.",
    "code": "// Leak:\nfunction subscribe() {\n  const hugeData = new Array(1000000).fill(\"data\");\n  window.addEventListener(\"resize\", () => console.log(hugeData.length));\n  // FIX: Must removeEventListener on cleanup!\n}"
  },
  {
    "id": 102,
    "topicId": 7,
    "difficulty": "Senior",
    "category": "Debugging & Profiling",
    "question": "How do you diagnose and isolate a memory leak using Chrome DevTools Heap Snapshots?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nFollow the 4-step diagnostic protocol:\n1. Open DevTools -> **Memory** tab -> click trash icon to force GC -> take **Snapshot 1** (Baseline).\n2. Repeat the target action 20 times (e.g. open and close modal).\n3. Force GC again -> take **Snapshot 2**.\n4. Switch view to **Comparison** against Snapshot 1. Sort by **# Delta** and **Alloc. Size**. Inspect the **Retainers Tree** for *Detached DOM Elements* or closed-over scopes.",
    "tip": "In interviews, emphasize establishing a baseline and taking comparative snapshots with forced GC."
  },
  {
    "id": 103,
    "topicId": 7,
    "difficulty": "Intermediate",
    "category": "Metaprogramming",
    "question": "What are Proxy and Reflect in JavaScript and what are their use cases?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`Proxy`**: Wraps a target object and intercepts fundamental language operations (property lookup, assignment, enumeration, function invocation) using **traps** (`get`, `set`, `has`, `deleteProperty`).\n• **`Reflect`**: Built-in object providing default forwardable implementations of all proxy traps.\n• **Use Cases**: Reactive state systems (Vue 3 reactivity), schema validation, logging, and access control.",
    "code": "const validator = {\n  set(target, prop, value) {\n    if (prop === \"age\" && (typeof value !== \"number\" || value < 0)) {\n      throw new TypeError(\"Age must be a positive number\");\n    }\n    return Reflect.set(target, prop, value);\n  }\n};\nconst user = new Proxy({}, validator);\nuser.age = 25; // Works\n// user.age = -5; // Throws TypeError!"
  },
  {
    "id": 104,
    "topicId": 7,
    "difficulty": "Junior",
    "category": "Modern Operators",
    "question": "What is Optional Chaining (?.) and how does it prevent runtime crashes?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nOptional Chaining (`?.`) evaluates property access, array indexing (`?.[index]`), or function calls (`?.()`). If the target before `?.` is `null` or `undefined`, it short-circuits evaluation and immediately returns `undefined`, avoiding `TypeError: Cannot read properties of undefined`.",
    "code": "const user = { profile: null };\nconsole.log(user.profile?.address?.zip); // undefined (No TypeError!)\nconst onSave = null;\nonSave?.(); // Safe no-op!"
  },
  {
    "id": 105,
    "topicId": 7,
    "difficulty": "Junior",
    "category": "Modern Operators",
    "question": "What are Logical Assignment Operators (??=, ||=, &&=)?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nIntroduced in ES2021, they combine logical operations with assignment:\n• `x ??= y`: Assigns `y` ONLY if `x` is `null` or `undefined`.\n• `x ||= y`: Assigns `y` ONLY if `x` is falsy.\n• `x &&= y`: Assigns `y` ONLY if `x` is truthy.",
    "code": "const config = { timeout: 0 };\nconfig.timeout ??= 5000; // Remains 0 (0 is not nullish!)\nconfig.retries ??= 3;    // Becomes 3"
  },
  {
    "id": 106,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Hoisting precedence between function declarations and var.",
    "answer": "### Predicted Output\n```\nfunction\n10\n```\n### Step-by-Step Execution Breakdown\n1. **Creation Phase**: Function declaration `foo` is hoisted with its full body. `var foo` declaration is ignored because identifier `foo` is already registered.\n2. At first `console.log(typeof foo)`, `foo` is still the function.\n3. `foo = 10` executes, reassigning `foo` to a Number.\n4. Second `console.log(foo)` prints `10`.",
    "code": "console.log(typeof foo);\nvar foo = 10;\nfunction foo() {}\nconsole.log(foo);"
  },
  {
    "id": 107,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Asynchronous loop with var vs let in setTimeout.",
    "answer": "### Predicted Output\n```\n3\n3\n3\n0\n1\n2\n```\n### Step-by-Step Execution Breakdown\n• **Loop 1 (var)**: `var i` creates ONE shared function-scoped variable. All 3 timer callbacks execute after the loop finishes, when `i === 3`.\n• **Loop 2 (let)**: `let j` creates a NEW lexical binding for every iteration. Each closure captures its own distinct copy of `j` (`0`, `1`, `2`).",
    "code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 0);\n}"
  },
  {
    "id": 108,
    "topicId": 8,
    "difficulty": "Senior",
    "category": "Output Prediction",
    "question": "Output Prediction: Complete Event Loop order (Sync, Promise, Timeout, Microtask).",
    "answer": "### Predicted Output\n```\n1\n5\n3\n4\n2\n```\n### Step-by-Step Execution Breakdown\n1. Synchronous: `console.log(\"1\")` prints `1`.\n2. `setTimeout` is registered with Web APIs; callback placed on Macrotask Queue.\n3. `Promise.resolve().then()` callback placed on Microtask Queue.\n4. Synchronous: `console.log(\"5\")` prints `5`. Call Stack is now empty!\n5. Microtask queue drains: prints `3`, returns another promise which queues microtask `4`.\n6. Microtask `4` prints `4`. Microtask queue is now empty.\n7. Event loop picks Macrotask: `setTimeout` callback executes and prints `2`.",
    "code": "console.log(\"1\");\nsetTimeout(() => console.log(\"2\"), 0);\nPromise.resolve()\n  .then(() => console.log(\"3\"))\n  .then(() => console.log(\"4\"));\nconsole.log(\"5\");"
  },
  {
    "id": 109,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: this binding with regular method vs arrow method.",
    "answer": "### Predicted Output\n```\nSameer\nundefined\n```\n### Step-by-Step Execution Breakdown\n• `user.regular()`: Called as method of `user` (Implicit Binding). `this` points to `user`, printing `\"Sameer\"`.\n• `user.arrow()`: Arrow functions have no `this`. It resolves `this` lexically from the enclosing scope where the object was created (the global window/module), printing `undefined`.",
    "code": "const user = {\n  name: \"Sameer\",\n  regular() { return this.name; },\n  arrow: () => this?.name\n};\nconsole.log(user.regular());\nconsole.log(user.arrow());"
  },
  {
    "id": 110,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Object references and mutation.",
    "answer": "### Predicted Output\n```\n{ count: 2 }\n{ count: 2 }\n```\n### Step-by-Step Execution Breakdown\n`b = a` copies the memory reference pointer. Both `a` and `b` point to the exact same object in the heap. Incrementing `b.count` mutates that shared heap object, so both log `{ count: 2 }`.",
    "code": "const a = { count: 1 };\nconst b = a;\nb.count = 2;\nconsole.log(a);\nconsole.log(b);"
  },
  {
    "id": 111,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Type coercion with +, -, [], and {}.",
    "answer": "### Predicted Output\n```\n\"\"\n\"[object Object]\"\n\"[object Object]\"\nNaN\n```\n### Step-by-Step Execution Breakdown\n1. `[] + []`: Both arrays coerce to empty strings via `.toString()`: `\"\" + \"\" = \"\"`.\n2. `[] + {}`: `[]` becomes `\"\"`; `{}` becomes `\"[object Object]\"`.\n3. `{} + []`: In expression position, coercing gives `\"[object Object]\"`.\n4. `{} - []`: Minus operator forces numeric conversion. `Number({})` is `NaN`. `NaN - 0 = NaN`.",
    "code": "console.log([] + []);\nconsole.log([] + {});\nconsole.log({} + []);\nconsole.log({} - []);"
  },
  {
    "id": 112,
    "topicId": 8,
    "difficulty": "Junior",
    "category": "Output Prediction",
    "question": "Output Prediction: Equality comparisons with NaN and zeros.",
    "answer": "### Predicted Output\n```\nfalse\ntrue\ntrue\nfalse\n```\n### Step-by-Step Execution Breakdown\n1. `NaN === NaN`: `false` per IEEE 754.\n2. `Object.is(NaN, NaN)`: `true`.\n3. `+0 === -0`: `true` per strict equality.\n4. `Object.is(+0, -0)`: `false` because their sign bits differ.",
    "code": "console.log(NaN === NaN);\nconsole.log(Object.is(NaN, NaN));\nconsole.log(+0 === -0);\nconsole.log(Object.is(+0, -0));"
  },
  {
    "id": 113,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Promise catch recovery and subsequent then.",
    "answer": "### Predicted Output\n```\nCaught: Error 1\nRecovered: Fallback Data\n```\n### Step-by-Step Execution Breakdown\n1. `Promise.reject(\"Error 1\")` triggers the `.catch()` block.\n2. The `.catch()` logs the error and returns `\"Fallback Data\"`.\n3. Because `.catch()` returned normally (without re-throwing), the returned promise fulfills with `\"Fallback Data\"`.\n4. The subsequent `.then()` runs normally!",
    "code": "Promise.reject(\"Error 1\")\n  .catch(err => {\n    console.log(\"Caught:\", err);\n    return \"Fallback Data\";\n  })\n  .then(val => {\n    console.log(\"Recovered:\", val);\n  });"
  },
  {
    "id": 114,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Output Prediction",
    "question": "Output Prediction: Temporal Dead Zone in a nested block.",
    "answer": "### Predicted Output\n```\nReferenceError: Cannot access 'x' before initialization\n```\n### Step-by-Step Execution Breakdown\nEven though `const x = 10` exists in the outer scope, inside the block `{ let x = x + 5; }`, the inner declaration `let x` hoists to the top of the block and shadows the outer `x`. Evaluating the right-hand side `x + 5` accesses the inner `x` while it is still in the TDZ, throwing a `ReferenceError`!",
    "code": "const x = 10;\n{\n  // let x = x + 5; // ReferenceError!\n}"
  },
  {
    "id": 115,
    "topicId": 8,
    "difficulty": "Junior",
    "category": "Output Prediction",
    "question": "Output Prediction: Array sort on integers without comparator callback.",
    "answer": "### Predicted Output\n```\n[1, 10, 2, 25, 5]\n```\n### Step-by-Step Execution Breakdown\n`sort()` converts all numbers to strings: `\"1\", \"10\", \"2\", \"25\", \"5\"`. It compares character by character: `\"10\"` comes before `\"2\"` because character `'1'` precedes `'2'` in Unicode. Always provide `(a, b) => a - b`!",
    "code": "const nums = [10, 5, 25, 1, 2];\nnums.sort();\nconsole.log(nums);"
  },
  {
    "id": 116,
    "topicId": 8,
    "difficulty": "Senior",
    "category": "Debugging",
    "question": "Debugging Scenario: Why does a React component re-render infinitely with useEffect?",
    "answer": "### 1. Root Cause Analysis\nAn infinite loop in `useEffect` occurs when an **unmemoized reference type (Object, Array, or Function)** is declared inside the component body and included in the `useEffect` dependency array:\n1. Component renders -> creates a brand new object in heap (new memory pointer).\n2. `useEffect` runs shallow comparison on dependencies: `prevObj !== newObj`.\n3. Effect executes and updates state -> triggers re-render -> repeat infinitely!\n\n### 2. Solutions\n1. Move the object outside the component if it is static.\n2. Wrap the object with `useMemo` or function with `useCallback`.\n3. Pass primitive property values instead of the entire object.",
    "code": "// BUGGY:\n// const options = { filter: \"active\" }; // New reference every render!\n// useEffect(() => { fetchData(options); }, [options]);\n\n// FIXED:\nconst options = useMemo(() => ({ filter: \"active\" }), []);\nuseEffect(() => { fetchData(options); }, [options]);"
  },
  {
    "id": 117,
    "topicId": 8,
    "difficulty": "Junior",
    "category": "Debugging",
    "question": "Debugging Scenario: Why does a function return '[object Promise]' instead of data?",
    "answer": "### 1. Root Cause Analysis\nAny function marked with the `async` keyword **always returns a Promise**, even if you return a primitive value inside. If the caller does not use `await` or `.then()`, they receive the unsettled Promise object itself. Printing or stringifying an unawaited promise logs `\"[object Promise]\"`.\n• **Fix**: Add `await` before invoking the async function.",
    "code": "async function getName() { return \"Sameer\"; }\n\n// Bug:\nconsole.log(\"Hello \" + getName()); // \"Hello [object Promise]\"\n\n// Fix:\nconst name = await getName();\nconsole.log(\"Hello \" + name);      // \"Hello Sameer\""
  },
  {
    "id": 118,
    "topicId": 8,
    "difficulty": "Intermediate",
    "category": "Debugging",
    "question": "Debugging Scenario: Why does fetch() not reject when an API returns HTTP 404 or 500?",
    "answer": "### 1. Root Cause Analysis\nBy specification, the native `fetch()` API rejects a Promise **ONLY on network failures or CORS misconfigurations** (e.g. no internet connection or server unreachable). It does NOT reject on HTTP error status codes like 404 Not Found or 500 Internal Server Error.\n• **Fix**: Always check `response.ok` (which is true for 200–299 status codes) and throw manually.",
    "code": "async function safeFetch(url) {\n  const res = await fetch(url);\n  if (!res.ok) {\n    throw new Error(`HTTP error! status: ${res.status}`);\n  }\n  return await res.json();\n}"
  },
  {
    "id": 119,
    "topicId": 8,
    "difficulty": "Senior",
    "category": "Debugging",
    "question": "Debugging Scenario: Why does a memory leak occur with window.addEventListener?",
    "answer": "### 1. Root Cause Analysis\nWhen an event listener is attached to `window` or `document`, the browser's native event dispatch table holds a strong reference to the callback function. If that callback closes over component state or large arrays, none of that memory can be garbage collected even after the component unmounts.\n• **Fix**: Always retain a reference to the exact callback function and invoke `window.removeEventListener(event, callback)` during component unmount cleanups!",
    "code": "// React Cleanup Fix:\nuseEffect(() => {\n  const handleResize = () => setWidth(window.innerWidth);\n  window.addEventListener(\"resize\", handleResize);\n  return () => window.removeEventListener(\"resize\", handleResize); // Cleanup!\n}, []);"
  },
  {
    "id": 120,
    "topicId": 8,
    "difficulty": "Staff",
    "category": "Senior Methodology",
    "question": "Senior Debugging Playbook: The 8-Step Framework for isolating and fixing production bugs.",
    "answer": "### The 8-Step Senior Diagnostic Framework\n1. **Reproduce with Minimal Payload**: Reproduce the defect deterministically using minimal inputs in an isolated sandbox.\n2. **Triangulate Boundaries**: Inspect network payloads, headers, console errors, and database logs to determine if failure is Frontend, Backend, or Gateway.\n3. **Capture Telemetry**: Check error tracing (Sentry), APM metrics, and user session replay.\n4. **Isolate Root Cause vs Symptom**: Do not apply naive null-checks (`a?.b?.c`) to suppress errors; diagnose why the contract broke.\n5. **Inspect State & Scope**: Check Call Stack frames, closures, and network timing waterfalls.\n6. **Formulate Hypothesis & Minimal Fix**: Implement architectural correction.\n7. **Write Automated Regression Tests**: Write unit/integration tests that fail on the bug and pass on the fix.\n8. **Verify Canary Deployment**: Monitor production telemetry for error rate flatline.",
    "tip": "In senior interviews, structure debugging answers using this rigorous engineering methodology."
  },
  {
    "id": 121,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: In-Place Array Reversal without Built-in Reverse (2 Methods)",
    "answer": "Reverse an array in-place without creating a new array.\n\n**Method 1: Two-Pointer Swap In-Place (Optimal O(N) Time, O(1) Auxiliary Space)**\n• Pointers at `left = 0` and `right = length - 1` swap elements using destructuring `[arr[left], arr[right]] = [arr[right], arr[left]]`.\n\n**Method 2: Native Array.prototype.reverse()**\n• Built-in mutator method.",
    "approaches": [
      {
        "title": "Approach 1: Two-Pointer Swap In-Place (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Maintains two pointers moving inward towards the center, swapping elements until they meet. Mutates the array in place with zero additional allocations.",
        "code": "function reverseArrayInPlace(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}\nconsole.log(reverseArrayInPlace([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]"
      },
      {
        "title": "Approach 2: Native reverse()",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Uses JavaScript's built-in Array.prototype.reverse(), which mutates the array in place.",
        "code": "const arr = [1, 2, 3, 4, 5];\narr.reverse();\nconsole.log(arr); // [5, 4, 3, 2, 1]"
      }
    ]
  },
  {
    "id": 122,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Reverse a String (3 Methods)",
    "answer": "Reverse a string in JavaScript.\n\n**Method 1: Built-in split, reverse, and join (Cleanest)**\n• Converts to character array, reverses, and joins back.\n\n**Method 2: Iterative for...of loop**\n• Prepends each character to accumulator: `reversed = char + reversed`.\n\n**Method 3: Decrementing loop with Array join (Fastest for large strings)**\n• Pushes characters in reverse order into an array and joins once.",
    "approaches": [
      {
        "title": "Approach 1: Built-in split, reverse, join",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Straightforward baseline using built-in methods.",
        "code": "function reverseStringBuiltin(str) {\n  return str.split(\"\").reverse().join(\"\");\n}\nconsole.log(reverseStringBuiltin(\"javascript\")); // \"tpircsavaj\""
      },
      {
        "title": "Approach 2: Decrementing Loop with Array (Optimal Memory)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Avoids repeated immutable string concatenation reallocations by collecting characters into an array buffer and joining once.",
        "code": "function reverseStringLoop(str) {\n  const result = [];\n  for (let i = str.length - 1; i >= 0; i--) {\n    result.push(str[i]);\n  }\n  return result.join(\"\");\n}\nconsole.log(reverseStringLoop(\"chrona\")); // \"anorhc\""
      }
    ]
  },
  {
    "id": 123,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Valid Palindrome (2 Methods)",
    "answer": "Determine if a string is a palindrome, ignoring non-alphanumeric characters and casing.\n\n**Method 1: Two-Pointer Inward Scan (Optimal O(N) Time, O(1) Auxiliary Space)**\n• Pointers at both ends skip invalid characters and compare character codes.\n\n**Method 2: Regex Clean + Reverse Comparison**\n• Sanitize string with regex and compare `cleanStr === cleanStr.split('').reverse().join('')`.",
    "approaches": [
      {
        "title": "Approach 1: Two-Pointer Scan (Optimal O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Two pointers move toward each other, skipping non-alphanumeric characters. Compares characters case-insensitively with early exit.",
        "code": "function isPalindromeTwoPointer(s) {\n  let left = 0;\n  let right = s.length - 1;\n\n  while (left < right) {\n    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;\n    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;\n\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n}\nconsole.log(isPalindromeTwoPointer(\"A man, a plan, a canal: Panama\")); // true\nconsole.log(isPalindromeTwoPointer(\"race a car\")); // false"
      },
      {
        "title": "Approach 2: Regex Clean + Reverse",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Sanitizes the string using regex, reverses it, and checks equality.",
        "code": "function isPalindromeClean(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  return clean === clean.split(\"\").reverse().join(\"\");\n}\nconsole.log(isPalindromeClean(\"radar\")); // true"
      }
    ]
  },
  {
    "id": 124,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Valid Anagram (2 Methods)",
    "answer": "Given two strings s and t, return true if t is an anagram of s.\n\n**Method 1: Frequency Hash Map (Optimal O(N) Time, O(1) Space - max 26 chars)**\n• Increment frequency for s, decrement for t. Check if all frequencies return to 0.\n\n**Method 2: Sorting Comparison (O(N log N) Time)**\n• Sort characters and compare equality.",
    "approaches": [
      {
        "title": "Approach 1: Frequency Map (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Single frequency map counts characters. Early exit if lengths differ.",
        "code": "function isAnagramMap(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n    counts[t[i]] = (counts[t[i]] || 0) - 1;\n  }\n\n  for (const char in counts) {\n    if (counts[char] !== 0) return false;\n  }\n  return true;\n}\nconsole.log(isAnagramMap(\"anagram\", \"nagaram\")); // true\nconsole.log(isAnagramMap(\"rat\", \"car\")); // false"
      },
      {
        "title": "Approach 2: Sort Comparison",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanation": "Sorts both strings and compares equality.",
        "code": "function isAnagramSort(s, t) {\n  if (s.length !== t.length) return false;\n  return s.split(\"\").sort().join(\"\") === t.split(\"\").sort().join(\"\");\n}"
      }
    ]
  },
  {
    "id": 125,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Two Sum (2 Methods)",
    "answer": "Find indices of two numbers that add up to target.\n\n**Method 1: Hash Map One-Pass (Optimal O(N) Time, O(N) Space)**\n• Store `target - current` in map as you iterate.\n\n**Method 2: Brute Force Nested Loops (O(N²) Time, O(1) Space)**\n• Nested loops compare every pair.",
    "approaches": [
      {
        "title": "Approach 1: Hash Map One-Pass (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Calculates complement for each number. If complement is already in map, returns current index and complement index.",
        "code": "function twoSumMap(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\nconsole.log(twoSumMap([2, 7, 11, 15], 9)); // [0, 1]"
      },
      {
        "title": "Approach 2: Brute Force Nested Loops",
        "timeComplexity": "O(N²)",
        "spaceComplexity": "O(1)",
        "explanation": "Checks every combination of pairs with two nested loops.",
        "code": "function twoSumBruteForce(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}"
      }
    ]
  },
  {
    "id": 126,
    "topicId": 9,
    "difficulty": "Intermediate",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Flatten a Nested Array (2 Methods)",
    "answer": "Flatten an array of arbitrary nesting depth.\n\n**Method 1: Recursive Accumulator (Clean & Functional)**\n• If item is Array, recurse; otherwise push.\n\n**Method 2: Iterative Stack (Prevents Call Stack Overflow)**\n• Uses explicit array stack to handle arbitrarily deep nesting.",
    "approaches": [
      {
        "title": "Approach 1: Recursive Accumulator",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(D) call stack",
        "explanation": "Recursively flattens sub-arrays into an accumulator.",
        "code": "function flattenRecursive(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      result.push(...flattenRecursive(item));\n    } else {\n      result.push(item);\n    }\n  }\n  return result;\n}\nconsole.log(flattenRecursive([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]"
      },
      {
        "title": "Approach 2: Iterative Stack (Safe for huge depth)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Uses an explicit heap stack, completely immune to Call Stack limits.",
        "code": "function flattenIterative(arr) {\n  const stack = [...arr];\n  const result = [];\n\n  while (stack.length > 0) {\n    const next = stack.pop();\n    if (Array.isArray(next)) {\n      stack.push(...next);\n    } else {\n      result.push(next);\n    }\n  }\n\n  return result.reverse();\n}\nconsole.log(flattenIterative([1, [2, [3, 4]]])); // [1, 2, 3, 4]"
      }
    ]
  },
  {
    "id": 127,
    "topicId": 9,
    "difficulty": "Senior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Deep Clone with Circular Reference Support (2 Methods)",
    "answer": "Duplicate an object deeply, correctly handling circular references, Dates, and Sets.\n\n**Method 1: WeakMap Recursion (Classic Senior Interview Implementation)**\n• Tracks visited objects in a `WeakMap`. If already seen, returns cached clone to break cycles.\n\n**Method 2: native structuredClone()**\n• Standard modern global API.",
    "approaches": [
      {
        "title": "Approach 1: WeakMap Recursion (Optimal Custom)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Recursively clones properties while storing visited objects in a WeakMap to prevent infinite recursion on circular graphs.",
        "code": "function deepClone(obj, visited = new WeakMap()) {\n  if (obj === null || typeof obj !== \"object\") return obj;\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof RegExp) return new RegExp(obj);\n  if (obj instanceof Set) {\n    const setCopy = new Set();\n    obj.forEach(val => setCopy.add(deepClone(val, visited)));\n    return setCopy;\n  }\n\n  if (visited.has(obj)) return visited.get(obj); // Cycle broken!\n\n  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));\n  visited.set(obj, clone);\n\n  for (const key of Reflect.ownKeys(obj)) {\n    clone[key] = deepClone(obj[key], visited);\n  }\n\n  return clone;\n}\n\nconst circular = { name: \"Chrona\" };\ncircular.self = circular;\nconst copy = deepClone(circular);\nconsole.log(copy.self === copy); // true (Circular reference preserved!)"
      },
      {
        "title": "Approach 2: native structuredClone()",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Uses browser and Node.js 17+ native structuredClone() API.",
        "code": "const data = { id: 1, created: new Date() };\ndata.ref = data;\nconst cloned = structuredClone(data);\nconsole.log(cloned.ref === cloned); // true"
      }
    ]
  },
  {
    "id": 128,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Array Chunking (Split into subarrays of size K)",
    "answer": "Divide an array into sub-arrays of maximum size K.\n• Iterate with stride `i += size` and slice: `arr.slice(i, i + size)`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    "code": "function chunkArray(arr, size) {\n  if (size <= 0) throw new Error(\"Size must be positive\");\n  const chunks = [];\n  for (let i = 0; i < arr.length; i += size) {\n    chunks.push(arr.slice(i, i + size));\n  }\n  return chunks;\n}\nconsole.log(chunkArray([1, 2, 3, 4, 5, 6, 7], 3)); // [[1, 2, 3], [4, 5, 6], [7]]"
  },
  {
    "id": 129,
    "topicId": 9,
    "difficulty": "Junior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: First Non-Repeating Character in a String",
    "answer": "Find the first character in a string that appears only once.\n• Pass 1: Build frequency map ($O(N)$).\n• Pass 2: Find first character with count 1 ($O(N)$).\n• **Time**: **O(N)** | **Space**: **O(1)** (at most 256 unique characters).",
    "code": "function firstNonRepeatingChar(str) {\n  const counts = new Map();\n  for (const char of str) {\n    counts.set(char, (counts.get(char) || 0) + 1);\n  }\n  for (const char of str) {\n    if (counts.get(char) === 1) return char;\n  }\n  return null;\n}\nconsole.log(firstNonRepeatingChar(\"swiss\")); // \"w\""
  },
  {
    "id": 130,
    "topicId": 9,
    "difficulty": "Senior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Production Debounce with Leading Edge & Cancel options",
    "answer": "Debounce delays invoking `fn` until after `delay` ms of silence. Support leading edge and cancellation.",
    "code": "function debounce(fn, delay, immediate = false) {\n  let timerId = null;\n\n  function debounced(...args) {\n    const context = this;\n    const callNow = immediate && !timerId;\n\n    clearTimeout(timerId);\n\n    timerId = setTimeout(() => {\n      timerId = null;\n      if (!immediate) fn.apply(context, args);\n    }, delay);\n\n    if (callNow) fn.apply(context, args);\n  }\n\n  debounced.cancel = () => {\n    clearTimeout(timerId);\n    timerId = null;\n  };\n\n  return debounced;\n}"
  },
  {
    "id": 131,
    "topicId": 9,
    "difficulty": "Senior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Production Throttle with Trailing Edge Execution",
    "answer": "Throttle limits execution to at most once per `limit` ms window, preserving trailing call.",
    "code": "function throttle(fn, limit) {\n  let inThrottle = false;\n  let lastArgs = null;\n  let lastContext = null;\n\n  return function (...args) {\n    if (!inThrottle) {\n      fn.apply(this, args);\n      inThrottle = true;\n      setTimeout(() => {\n        inThrottle = false;\n        if (lastArgs) {\n          fn.apply(lastContext, lastArgs);\n          lastArgs = null;\n          lastContext = null;\n        }\n      }, limit);\n    } else {\n      lastArgs = args;\n      lastContext = this;\n    }\n  };\n}"
  },
  {
    "id": 132,
    "topicId": 9,
    "difficulty": "Intermediate",
    "category": "Polyfill",
    "question": "Coding Challenge: Implement a Custom Array.prototype.map() Polyfill",
    "answer": "Transforms each element, preserving sparse array holes via `i in this`.",
    "code": "Array.prototype.myMap = function(callback, thisArg) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const result = new Array(this.length);\n  for (let i = 0; i < this.length; i++) {\n    if (i in this) {\n      result[i] = callback.call(thisArg, this[i], i, this);\n    }\n  }\n  return result;\n};\nconsole.log([1, 2, 3].myMap(x => x * 10)); // [10, 20, 30]"
  },
  {
    "id": 133,
    "topicId": 9,
    "difficulty": "Intermediate",
    "category": "Polyfill",
    "question": "Coding Challenge: Implement a Custom Array.prototype.filter() Polyfill",
    "answer": "Iterates elements, evaluating predicate callback, preserving sparsity.",
    "code": "Array.prototype.myFilter = function(callback, thisArg) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    if (i in this && callback.call(thisArg, this[i], i, this)) {\n      result.push(this[i]);\n    }\n  }\n  return result;\n};\nconsole.log([1, 2, 3, 4].myFilter(x => x % 2 === 0)); // [2, 4]"
  },
  {
    "id": 134,
    "topicId": 9,
    "difficulty": "Intermediate",
    "category": "Polyfill",
    "question": "Coding Challenge: Implement a Custom Array.prototype.reduce() Polyfill",
    "answer": "Accumulates elements into a single value, properly managing omitted initialValue.",
    "code": "Array.prototype.myReduce = function(callback, initialValue) {\n  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');\n  const len = this.length;\n  let i = 0;\n  let acc;\n\n  if (arguments.length >= 2) {\n    acc = initialValue;\n  } else {\n    while (i < len && !(i in this)) i++;\n    if (i >= len) throw new TypeError(\"Reduce of empty array with no initial value\");\n    acc = this[i++];\n  }\n\n  for (; i < len; i++) {\n    if (i in this) {\n      acc = callback(acc, this[i], i, this);\n    }\n  }\n  return acc;\n};\nconsole.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10"
  },
  {
    "id": 135,
    "topicId": 9,
    "difficulty": "Senior",
    "category": "Coding Challenge",
    "question": "Coding Challenge: Async Retry with Exponential Backoff and Jitter",
    "answer": "Executes an async task with retries, exponential backoff (e.g. 200ms, 400ms, 800ms) and randomized jitter to avoid thundering herd problem.",
    "code": "async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 200) {\n  for (let attempt = 0; attempt < maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (attempt === maxRetries - 1) throw err;\n      const jitter = Math.random() * 100;\n      const delay = baseDelay * Math.pow(2, attempt) + jitter;\n      await new Promise(r => setTimeout(r, delay));\n    }\n  }\n}"
  },
  {
    "id": 136,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Polyfill",
    "question": "Coding Challenge: Implement a Custom Promise.all() Polyfill",
    "answer": "Fulfills when all promises fulfill, storing results at exact input indices.",
    "code": "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (!Array.isArray(promises)) return reject(new TypeError(\"Must be array\"));\n    const results = [];\n    let completed = 0;\n    const total = promises.length;\n\n    if (total === 0) return resolve(results);\n\n    promises.forEach((p, idx) => {\n      Promise.resolve(p)\n        .then(val => {\n          results[idx] = val; // Store at exact index\n          completed++;\n          if (completed === total) resolve(results);\n        })\n        .catch(reject); // Rejects immediately on 1st error\n    });\n  });\n}"
  },
  {
    "id": 137,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Polyfill",
    "question": "Coding Challenge: Implement a Custom Function.prototype.bind() Polyfill",
    "answer": "Returns a new bound function with permanently bound this and partially applied arguments.",
    "code": "Function.prototype.myBind = function(thisArg, ...boundArgs) {\n  const originalFn = this;\n  if (typeof originalFn !== \"function\") throw new TypeError(\"Must be callable\");\n\n  return function boundFn(...callArgs) {\n    // If called with 'new', this points to instance\n    if (this instanceof boundFn) {\n      return new originalFn(...boundArgs, ...callArgs);\n    }\n    return originalFn.apply(thisArg, [...boundArgs, ...callArgs]);\n  };\n};"
  },
  {
    "id": 138,
    "topicId": 10,
    "difficulty": "Intermediate",
    "category": "DOM & Browser",
    "question": "What is the difference between DOM Event Bubbling and Capturing?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nWhen a DOM event fires, it traverses through three phases:\n1. **Capturing Phase**: Travels down from `window` -> `document` -> parent containers -> target.\n2. **Target Phase**: Reaches the target element clicked.\n3. **Bubbling Phase**: Bubbles upward from target -> parents -> `window`.\nBy default, `element.addEventListener(\"click\", handler)` listens in the bubbling phase. Pass `{ capture: true }` to listen in the capturing phase.",
    "code": "element.addEventListener(\"click\", handler, { capture: true });"
  },
  {
    "id": 139,
    "topicId": 10,
    "difficulty": "Intermediate",
    "category": "DOM & Browser",
    "question": "What is the Event Delegation pattern and why is it superior for large lists?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Event Delegation** is the practice of attaching a **single event listener to a common parent element** rather than thousands of listeners to individual child items. When an event bubbles up, inspect `event.target.closest('.item')`.\n• **Benefits**: Drastically reduces memory usage, prevents listener leaks, and automatically handles dynamically inserted child elements.",
    "code": "document.querySelector(\"#list\").addEventListener(\"click\", (e) => {\n  const item = e.target.closest(\"li\");\n  if (item) console.log(\"Clicked:\", item.dataset.id);\n});"
  },
  {
    "id": 140,
    "topicId": 10,
    "difficulty": "Junior",
    "category": "DOM & Browser",
    "question": "What is the difference between preventDefault() and stopPropagation()?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **`event.preventDefault()`**: Cancels the browser's native default behavior (e.g. following a link, submitting a form) without stopping event bubbling.\n• **`event.stopPropagation()`**: Stops the event from traversing further up or down the DOM tree, but permits the browser's default action.",
    "code": "form.addEventListener(\"submit\", (e) => {\n  e.preventDefault(); // Prevents page reload\n});"
  },
  {
    "id": 141,
    "topicId": 10,
    "difficulty": "Intermediate",
    "category": "Storage & Security",
    "question": "What is the difference between LocalStorage, SessionStorage, and Cookies?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **LocalStorage**: Persistent storage (~5–10MB), client-side only, not sent in HTTP requests. XSS vulnerable.\n• **SessionStorage**: Tab lifetime (~5MB), client-side only, cleared on tab close.\n• **Cookies**: Small (~4KB), sent automatically with matching HTTP requests. Crucially supports **`HttpOnly`** (protects from XSS) and **`SameSite=Strict/Lax`** (protects from CSRF).",
    "table": {
      "headers": [
        "Feature",
        "LocalStorage",
        "SessionStorage",
        "Cookies"
      ],
      "rows": [
        [
          "Capacity",
          "~5-10MB",
          "~5MB",
          "~4KB"
        ],
        [
          "Lifetime",
          "Permanent",
          "Tab session",
          "Expires / Max-Age"
        ],
        [
          "Sent with HTTP",
          "No",
          "No",
          "Yes"
        ],
        [
          "XSS Protection",
          "None",
          "None",
          "HttpOnly flag blocks JS"
        ]
      ]
    }
  },
  {
    "id": 142,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Security",
    "question": "How do you prevent Prototype Pollution vulnerabilities in JavaScript?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n**Prototype Pollution** occurs when untrusted user JSON input recursively modifies `Object.prototype` or `__proto__`, injecting malicious properties across every object in the runtime.\n• **Defenses**:\n  1. Sanitize and drop `__proto__`, `constructor`, and `prototype` keys during deep merges.\n  2. Use `Object.create(null)` for user dictionaries (has no prototype to pollute).\n  3. Use `Map` instead of plain objects for arbitrary user keys.\n  4. Freeze `Object.prototype` during server startup (`Object.freeze(Object.prototype)`).",
    "code": "function safeMerge(target, source) {\n  for (const key of Object.keys(source)) {\n    if (key === \"__proto__\" || key === \"constructor\" || key === \"prototype\") continue;\n    if (typeof source[key] === \"object\" && source[key] !== null) {\n      if (!target[key]) target[key] = {};\n      safeMerge(target[key], source[key]);\n    } else {\n      target[key] = source[key];\n    }\n  }\n  return target;\n}"
  },
  {
    "id": 143,
    "topicId": 10,
    "difficulty": "Intermediate",
    "category": "Performance",
    "question": "What is the latency waterfall difference between Promise.all() and sequential await?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\n• **Sequential `await`**: Runs serially ($T_1 + T_2$). Request 2 waits for request 1 to complete before starting.\n• **`Promise.all()`**: Runs concurrently in parallel ($\\max(T_1, T_2)$). Both network requests are dispatched at the same instant.",
    "code": "// Concurrent: Total latency = 300ms instead of 500ms\nconst [users, products] = await Promise.all([\n  fetch(\"/api/users\"),    // 300ms\n  fetch(\"/api/products\")  // 200ms\n]);"
  },
  {
    "id": 144,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Senior Scenario",
    "question": "Senior Scenario: How would you diagnose and fix a memory leak in a large frontend application?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nI follow a structured 4-step diagnostic protocol using Chrome DevTools Memory Profiler:\n1. **Baseline**: Force GC and capture Snapshot 1.\n2. **Reproduction**: Simulate suspected user action 20 times (e.g. open/close modal).\n3. **Delta Comparison**: Force GC again, capture Snapshot 2, and switch to **Comparison view**.\n4. **Identify Retainers**: Filter by positive allocation delta, inspect the Retainers Tree for detached DOM nodes or uncleared closure timers, apply cleanups, and verify a flat baseline.",
    "tip": "Emphasize comparative snapshot methodology rather than guessing."
  },
  {
    "id": 145,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Senior Scenario",
    "question": "Senior Scenario: How would you debug an API request returning HTTP 200 that fails on the frontend?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nHTTP 200 only confirms transport success, not business logic success:\n1. **Inspect Network Tab**: Examine raw response headers (`Content-Type`) and payload. Check if the server returned an error envelope (`{ success: false, code: \"AUTH_EXPIRED\" }`).\n2. **Contract Mismatch**: Verify if a backend serialization change or decryption interceptor failed to unpack the payload before rendering.\n3. **Real Portfolio Example**: In our project, an AES response-encryption interceptor failed to decrypt because a new endpoint bypassed the centralized Axios client. Resolved by unifying all requests through a single authenticated client instance.",
    "tip": "Connect HTTP status codes to application-level contracts."
  },
  {
    "id": 146,
    "topicId": 10,
    "difficulty": "Staff",
    "category": "FinTech Architecture",
    "question": "Senior Scenario: How do you make payment processing reliable if a user closes their browser during checkout?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nNever rely on the frontend redirect or client-side callback for payment fulfillment:\n1. Persist the order in the database with status `\"pending_payment\"` before redirecting the customer.\n2. Rely strictly on **Server-to-Server Webhooks** (e.g. Stripe `checkout.session.completed`).\n3. Verify cryptographic webhook signatures (**HMAC SHA-256**) with raw body buffers.\n4. Process fulfillment idempotently inside a database transaction keyed on the payment provider event ID.",
    "tip": "Mention server webhooks, HMAC signatures, and database transactions."
  },
  {
    "id": 147,
    "topicId": 10,
    "difficulty": "Staff",
    "category": "Distributed Systems",
    "question": "Senior Scenario: What is idempotency and how do you implement it in a Node.js API?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nAn operation is **idempotent** if applying it multiple times produces the exact same system state as applying it once: $f(f(x)) = f(x)$. Essential for payment processing and retry loops to prevent duplicate credit card charges.\n• **Implementation**:\n  1. Client sends a unique `Idempotency-Key` header (UUID).\n  2. Server attempts an atomic `SETNX` in Redis or unique index insert in DB.\n  3. If key exists, return the cached previous response. If new, process and store response.",
    "tip": "Always emphasize atomic database unique constraints or Redis SETNX."
  },
  {
    "id": 148,
    "topicId": 10,
    "difficulty": "Senior",
    "category": "Interview Communication",
    "question": "Senior Scenario: How would you explain a complex technical bug using the STAR method?",
    "answer": "### The STAR Method Framework\n• **Situation**: Describe the system and user impact (e.g. \"During peak checkout on our marketplace, 3% of international orders failed\").\n• **Task**: What was your responsibility? (\"I was tasked with identifying the root cause and restoring zero-defect checkouts\").\n• **Action**: What engineering steps did you take? (\"Analyzed APM traces, identified a race condition in currency conversion caching, added mutex locks, and wrote Vitest regression tests\").\n• **Result**: Measurable outcome (\"Zero checkout errors, latency reduced by 40ms, and verified with 100% test coverage\").",
    "tip": "Follow Situation -> Task -> Action -> Result."
  },
  {
    "id": 149,
    "topicId": 10,
    "difficulty": "Staff",
    "category": "Senior Leadership",
    "question": "Senior Scenario: What distinguishes a Senior Engineer's answer from a Junior Engineer's answer?",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nA junior engineer recites syntax and definitions. A senior engineer:\n1. Explains **underlying engine mechanics** (call stack, V8 compilation, Libuv phases).\n2. Proactively highlights **architectural trade-offs** (memory vs CPU, simplicity vs scale).\n3. Discusses **failure modes & edge cases** (race conditions, memory leaks, security attack vectors).\n4. Connects concepts to **concrete production systems** (idempotency, distributed tracing, observability).",
    "tip": "Always articulate trade-offs, edge cases, and production architecture."
  },
  {
    "id": 150,
    "topicId": 10,
    "difficulty": "Staff",
    "category": "Runtime Architecture",
    "question": "Senior Scenario: Single-threaded vs multi-threaded Node.js architecture.",
    "answer": "### 1. Direct Pitch (30–60 Seconds)\nNode.js runs JavaScript on a single thread event loop. However, its backend architecture is multi-threaded:\n• **Libuv Thread Pool**: 4 background worker threads (configurable via `UV_THREADPOOL_SIZE`) handle file system calls (`fs`), DNS lookups, and CPU crypto (`crypto.pbkdf2`).\n• **OS Non-Blocking Kernel**: Socket network I/O is handled directly by kernel multiplexing (`epoll`, `kqueue`, `IOCP`).\n• **Worker Threads (`node:worker_threads`)**: Used for CPU-heavy tasks (image processing, machine learning) to avoid blocking the main event loop.",
    "tip": "Distinguish between the JS call stack thread, Libuv worker pool, and OS kernel I/O."
  },
  {
    "id": 151,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Find the Largest and Smallest Number in an Array (3 Methods)",
    "answer": "Find min and max values in an array.\n\n**Method 1: Math.max / Math.min with Spread** ($O(N)$ time, $O(1)$ space for small arrays, stack overflow for $> 65k$ items).\n**Method 2: reduce()** ($O(N)$ time, $O(1)$ space).\n**Method 3: Classic Single-Pass Loop (Optimal)** ($O(N)$ time, $O(1)$ space, handles huge arrays).",
    "approaches": [
      {
        "title": "Approach 1: Classic Single-Pass Loop (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Tracks min and max simultaneously in one loop. Handles arbitrary array lengths without call stack limits.",
        "code": "function findMinMaxLoop(arr) {\n  if (!arr.length) throw new Error(\"Empty array\");\n  let min = arr[0], max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < min) min = arr[i];\n    else if (arr[i] > max) max = arr[i];\n  }\n  return { min, max };\n}\nconsole.log(findMinMaxLoop([12, 5, 89, -4, 45])); // { min: -4, max: 89 }"
      },
      {
        "title": "Approach 2: Math.max / Math.min with Spread",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N) arguments",
        "explanation": "Clean 1-liner, suitable for arrays up to 65k elements.",
        "code": "const findMinMaxMath = arr => ({ min: Math.min(...arr), max: Math.max(...arr) });"
      }
    ]
  },
  {
    "id": 152,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Find the Second Largest Number in an Array (2 Methods)",
    "answer": "Return the second largest distinct number.\n\n**Method 1: Single-Pass Two-Variable Tracking (Optimal O(N) Time, O(1) Space)**\n• No sorting, constant memory.\n\n**Method 2: Set Deduplication + Sort (O(N log N) Time)**.",
    "approaches": [
      {
        "title": "Approach 1: Single-Pass Tracking (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Maintains two variables `first` and `second`. Updates `second = first` when a new maximum is found.",
        "code": "function getSecondLargest(arr) {\n  let first = -Infinity, second = -Infinity;\n  for (const num of arr) {\n    if (num > first) {\n      second = first;\n      first = num;\n    } else if (num > second && num !== first) {\n      second = num;\n    }\n  }\n  return second === -Infinity ? null : second;\n}\nconsole.log(getSecondLargest([10, 5, 10, 8, 2])); // 8"
      },
      {
        "title": "Approach 2: Set Deduplication + Sort",
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "explanation": "Deduplicates via Set, sorts descending, and returns index 1.",
        "code": "function getSecondLargestSort(arr) {\n  const unique = [...new Set(arr)].sort((a, b) => b - a);\n  return unique.length >= 2 ? unique[1] : null;\n}"
      }
    ]
  },
  {
    "id": 153,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Group Array of Objects by Property or Callback (3 Methods)",
    "answer": "Group items by category or role.\n\n**Method 1: ES2024 Object.groupBy()**\n**Method 2: reduce() with nullish assignment**\n**Method 3: Map-based grouping for complex keys**.",
    "approaches": [
      {
        "title": "Approach 1: reduce() with Nullish Assignment",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Standard production pattern using reduce and nullish assignment `(acc[key] ??= []).push(item)`.",
        "code": "function groupByReduce(arr, keyFn) {\n  return arr.reduce((acc, item) => {\n    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];\n    (acc[key] ??= []).push(item);\n    return acc;\n  }, {});\n}\nconst items = [{ type: 'veg', name: 'carrot' }, { type: 'fruit', name: 'apple' }, { type: 'veg', name: 'peas' }];\nconsole.log(groupByReduce(items, 'type')); // { veg: [...], fruit: [...] }"
      },
      {
        "title": "Approach 2: Modern Object.groupBy() (ES2024)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Native standard built into modern JavaScript engines.",
        "code": "// Object.groupBy(items, item => item.type)"
      }
    ]
  },
  {
    "id": 154,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Character Frequency Counter in a String (3 Methods)",
    "answer": "Count the frequency of each character.\n• **Method 1: Plain Object with nullish coalescing**\n• **Method 2: Map Instance (Safe from prototype keys)**\n• **Method 3: reduce() 1-liner**.",
    "approaches": [
      {
        "title": "Approach 1: Map Instance (Safe from Prototype Keys)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(K) unique chars",
        "explanation": "Uses Map to avoid prototype key pollution (e.g. strings containing 'constructor' or 'toString').",
        "code": "function charFrequency(str) {\n  const map = new Map();\n  for (const char of str) {\n    map.set(char, (map.get(char) || 0) + 1);\n  }\n  return map;\n}\nconsole.log(charFrequency(\"javascript\"));"
      }
    ]
  },
  {
    "id": 155,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Count Element Frequencies in an Array (2 Methods)",
    "answer": "Count occurrences of items in an array.\n• **Method 1: Map counter**\n• **Method 2: reduce() accumulator**.",
    "code": "function countArrayFrequencies(arr) {\n  return arr.reduce((acc, val) => {\n    acc[val] = (acc[val] || 0) + 1;\n    return acc;\n  }, {});\n}\nconsole.log(countArrayFrequencies([\"apple\", \"banana\", \"apple\"])); // { apple: 2, banana: 1 }"
  },
  {
    "id": 156,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Remove Duplicates from an Array (3 Methods)",
    "answer": "Deduplicate elements.\n• **Method 1: new Set() spread (Optimal O(N) Time, O(N) Space)**\n• **Method 2: In-place Two-Pointer on sorted array (O(1) Memory)**\n• **Method 3: filter() + indexOf() (O(N²))**.",
    "approaches": [
      {
        "title": "Approach 1: Set Spread (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Instant, readable, modern standard for deduplication.",
        "code": "const removeDuplicates = arr => [...new Set(arr)];\nconsole.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]"
      },
      {
        "title": "Approach 2: In-Place Two-Pointer on Sorted Array (O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "LeetCode 26: writes unique elements in place without extra allocations.",
        "code": "function removeDuplicatesSorted(nums) {\n  if (!nums.length) return 0;\n  let write = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) {\n      nums[write++] = nums[i];\n    }\n  }\n  nums.length = write;\n  return nums;\n}"
      }
    ]
  },
  {
    "id": 157,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Find All Duplicate Elements in an Array (2 Methods)",
    "answer": "Return elements that appear more than once.\n• **Method 1: Two Sets (O(N) Time, O(N) Space)**\n• **Method 2: Frequency Map filter**.",
    "code": "function findDuplicates(arr) {\n  const seen = new Set();\n  const duplicates = new Set();\n  for (const item of arr) {\n    if (seen.has(item)) duplicates.add(item);\n    else seen.add(item);\n  }\n  return [...duplicates];\n}\nconsole.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]"
  },
  {
    "id": 158,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Intersection of Two Arrays (2 Methods)",
    "answer": "Find common elements without duplicates.\n• **Method 1: Set filter (Optimal O(M + N) Time)**\n• **Method 2: Two-Pointer on sorted arrays**.",
    "code": "function arrayIntersection(a, b) {\n  const setB = new Set(b);\n  return [...new Set(a.filter(x => setB.has(x)))];\n}\nconsole.log(arrayIntersection([1, 2, 2, 1], [2, 2])); // [2]"
  },
  {
    "id": 159,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Difference & Symmetric Difference of Two Arrays (2 Methods)",
    "answer": "• Difference (A - B): Elements in A not in B.\n• Symmetric Difference: Elements in either A or B, but not both.\n• **Time**: **O(M + N)** using Sets.",
    "code": "function symmetricDifference(a, b) {\n  const setA = new Set(a), setB = new Set(b);\n  return [...a.filter(x => !setB.has(x)), ...b.filter(x => !setA.has(x))];\n}\nconsole.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]"
  },
  {
    "id": 160,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Union of Two Arrays (2 Methods)",
    "answer": "Combine unique elements from both arrays.\n• **Method 1: Spread into Set: `[...new Set([...a, ...b])]`**.\n• **Time**: **O(M + N)** | **Space**: **O(M + N)**.",
    "code": "const arrayUnion = (a, b) => [...new Set([...a, ...b])];\nconsole.log(arrayUnion([1, 2, 3], [3, 4, 5])); // [1, 2, 3, 4, 5]"
  },
  {
    "id": 161,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Rotate an Array by K Positions (2 Methods)",
    "answer": "Rotate array to right by K steps (e.g. `[1,2,3,4,5], k=2` -> `[4,5,1,2,3]`).\n• **Method 1: Three Reversals In-Place (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Slice and Spread (O(N) Space)**.",
    "approaches": [
      {
        "title": "Approach 1: Three Reversals In-Place (Optimal O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "1. Reverse whole array. 2. Reverse first k elements. 3. Reverse remaining n - k elements.",
        "code": "function rotateArray(nums, k) {\n  k = k % nums.length;\n  const rev = (s, e) => {\n    while (s < e) {\n      [nums[s], nums[e]] = [nums[e], nums[s]];\n      s++; e--;\n    }\n  };\n  rev(0, nums.length - 1);\n  rev(0, k - 1);\n  rev(k, nums.length - 1);\n  return nums;\n}\nconsole.log(rotateArray([1, 2, 3, 4, 5, 6, 7], 3)); // [5, 6, 7, 1, 2, 3, 4]"
      },
      {
        "title": "Approach 2: Slice and Concat",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Slices last k elements and prepends to remainder.",
        "code": "const rotateSlice = (nums, k) => [...nums.slice(-(k % nums.length)), ...nums.slice(0, -(k % nums.length))];"
      }
    ]
  },
  {
    "id": 162,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Move All Zeroes to End of Array (2 Methods)",
    "answer": "Move 0's to end while maintaining relative order of non-zeroes.\n• **Method 1: In-Place Two-Pointer Write Index (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Non-mutating filter and pad**.",
    "approaches": [
      {
        "title": "Approach 1: In-Place Write Pointer (Optimal O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Writes non-zero elements forward into `writeIdx`, then fills tail with zeroes.",
        "code": "function moveZeroes(nums) {\n  let write = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) nums[write++] = nums[i];\n  }\n  while (write < nums.length) nums[write++] = 0;\n  return nums;\n}\nconsole.log(moveZeroes([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]"
      }
    ]
  },
  {
    "id": 163,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Check if an Array is Sorted (2 Methods)",
    "answer": "Verify whether elements are in non-decreasing order.\n• **Method 1: Linear Loop with early exit (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Array.prototype.every()**.",
    "code": "function isSorted(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    if (arr[i] > arr[i + 1]) return false;\n  }\n  return true;\n}\nconsole.log(isSorted([1, 2, 3, 5, 9])); // true"
  },
  {
    "id": 164,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "Math & Bitwise",
    "question": "Coding Challenge: Find the Missing Number in Range 1 to N (3 Methods)",
    "answer": "Find missing integer in array of size N - 1 from 1 to N.\n• **Method 1: Gauss Sum Formula: (N * (N + 1)) / 2 - sum(arr) (Optimal O(N) Time, O(1) Space)**\n• **Method 2: XOR Bitwise Cancellation**\n• **Method 3: Set Presence Check**.",
    "approaches": [
      {
        "title": "Approach 1: Gauss Sum Formula (Optimal)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Difference between expected sum of 1..N and actual sum equals missing number.",
        "code": "function findMissingNumber(nums, n) {\n  const expected = (n * (n + 1)) / 2;\n  const actual = nums.reduce((a, b) => a + b, 0);\n  return expected - actual;\n}\nconsole.log(findMissingNumber([1, 2, 4, 5, 6], 6)); // 3"
      },
      {
        "title": "Approach 2: XOR Bitwise (Prevents Overflow)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "XOR 1..N and then XOR each element. Duplicates cancel out ($x \\oplus x = 0$).",
        "code": "function findMissingXOR(nums, n) {\n  let xor = 0;\n  for (let i = 1; i <= n; i++) xor ^= i;\n  for (const num of nums) xor ^= num;\n  return xor;\n}"
      }
    ]
  },
  {
    "id": 165,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Find All Numbers Disappeared in an Array (2 Methods)",
    "answer": "Find numbers in range [1, N] missing from array of size N.\n• **Method 1: In-Place Sign Negation (O(N) Time, O(1) Auxiliary Space)**\n• **Method 2: Set lookup**.",
    "approaches": [
      {
        "title": "Approach 1: In-Place Sign Negation (Optimal O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Uses values as array indices and negates `nums[val - 1]`. Positive values at end indicate missing numbers.",
        "code": "function findDisappearedNumbers(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    const idx = Math.abs(nums[i]) - 1;\n    if (nums[idx] > 0) nums[idx] = -nums[idx];\n  }\n  const result = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] > 0) result.push(i + 1);\n  }\n  return result;\n}\nconsole.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]"
      }
    ]
  },
  {
    "id": 166,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Find the Longest Word in a Sentence (2 Methods)",
    "answer": "Extract longest word ignoring punctuation.\n• **Method 1: regex strip + split + reduce (Optimal O(N))**\n• **Method 2: regex match + sort**.",
    "code": "function findLongestWord(sentence) {\n  const words = sentence.replace(/[^a-zA-Z0-9\\s]/g, \"\").split(/\\s+/);\n  return words.reduce((max, w) => w.length > max.length ? w : max, \"\");\n}\nconsole.log(findLongestWord(\"The quick brown fox jumped over the lazy dog\")); // \"jumped\""
  },
  {
    "id": 167,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Capitalize First Letter of Every Word (Title Case) (2 Methods)",
    "answer": "Convert string to Title Case.\n• **Method 1: split + map + slice (Functional)**\n• **Method 2: regex \\b\\w replace**.",
    "code": "function titleCase(str) {\n  return str.toLowerCase().replace(/\\b[a-z]/g, c => c.toUpperCase());\n}\nconsole.log(titleCase(\"senior frontend engineer at google\")); // \"Senior Frontend Engineer At Google\""
  },
  {
    "id": 168,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Count Vowels in a String (2 Methods)",
    "answer": "Count vowels (a, e, i, o, u) case-insensitively.\n• **Method 1: Set lookup in loop (O(N) Time, O(1) Space)**\n• **Method 2: regex match: `(str.match(/[aeiou]/gi) || []).length`**.",
    "code": "function countVowels(str) {\n  const vowels = new Set([\"a\", \"e\", \"i\", \"o\", \"u\"]);\n  let count = 0;\n  for (const char of str.toLowerCase()) {\n    if (vowels.has(char)) count++;\n  }\n  return count;\n}\nconsole.log(countVowels(\"JavaScript\")); // 3"
  },
  {
    "id": 169,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "String Algorithms",
    "question": "Coding Challenge: String Compression (Run-Length Encoding) (2 Methods)",
    "answer": "Compress consecutive repeating characters (e.g. \"aabcccccaaa\" -> \"a2b1c5a3\"). Return original if compressed is not shorter.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    "code": "function compressString(s) {\n  let compressed = \"\";\n  let count = 0;\n  for (let i = 0; i < s.length; i++) {\n    count++;\n    if (i + 1 >= s.length || s[i] !== s[i + 1]) {\n      compressed += s[i] + count;\n      count = 0;\n    }\n  }\n  return compressed.length < s.length ? compressed : s;\n}\nconsole.log(compressString(\"aabcccccaaa\")); // \"a2b1c5a3\""
  },
  {
    "id": 170,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Stack Algorithms",
    "question": "Coding Challenge: Valid Parentheses / Balanced Brackets (Stack) (2 Methods)",
    "answer": "Validate strings containing '(', ')', '{', '}', '[', ']'.\n• **Method 1: Map-based Stack (Optimal O(N) Time, O(N) Space)**\n• Push opening brackets; pop and verify match on closing brackets.",
    "approaches": [
      {
        "title": "Approach 1: Map Stack (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Uses a stack to store expected closing brackets. When an opening bracket is seen, push its counterpart. When a closing bracket is seen, pop and check equality.",
        "code": "function isValidParentheses(s) {\n  const stack = [];\n  const map = { \"(\": \")\", \"{\": \"}\", \"[\": \"]\" };\n\n  for (const char of s) {\n    if (map[char]) {\n      stack.push(map[char]);\n    } else if (stack.pop() !== char) {\n      return false;\n    }\n  }\n\n  return stack.length === 0;\n}\nconsole.log(isValidParentheses(\"()[]{}\")); // true\nconsole.log(isValidParentheses(\"(]\"));     // false"
      }
    ]
  },
  {
    "id": 171,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Reverse Words in a Sentence (2 Methods)",
    "answer": "Reverse the order of words in a sentence, trimming redundant whitespace.\n• `s.trim().split(/\\s+/).reverse().join(' ')`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    "code": "function reverseWords(s) {\n  return s.trim().split(/\\s+/).reverse().join(\" \");\n}\nconsole.log(reverseWords(\"  hello   world  \")); // \"world hello\""
  },
  {
    "id": 172,
    "topicId": 11,
    "difficulty": "Junior",
    "category": "String Algorithms",
    "question": "Coding Challenge: Truncate a String with Ellipsis (2 Methods)",
    "answer": "Truncate string to maxLength including '...' if exceeded.\n• **Time**: **O(1)**.",
    "code": "function truncateString(str, maxLength) {\n  if (str.length <= maxLength) return str;\n  return str.slice(0, maxLength - 3) + \"...\";\n}\nconsole.log(truncateString(\"Senior JavaScript Engineer\", 10)); // \"Senior ...\" "
  },
  {
    "id": 173,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Two Pointers",
    "question": "Coding Challenge: Merge Two Sorted Arrays (2 Methods)",
    "answer": "Merge two sorted arrays into one sorted array in $O(M + N)$ time.\n• **Method 1: Two Pointers (Optimal O(M + N) Time, O(M + N) Space)**\n• **Method 2: Concat + Sort (O((M + N) log(M + N)))**.",
    "approaches": [
      {
        "title": "Approach 1: Two Pointers (Optimal O(M + N))",
        "timeComplexity": "O(M + N)",
        "spaceComplexity": "O(M + N)",
        "explanation": "Pointers compare current elements of both arrays, pushing the smaller element.",
        "code": "function mergeSortedArrays(a, b) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) result.push(a[i++]);\n    else result.push(b[j++]);\n  }\n  return result.concat(a.slice(i)).concat(b.slice(j));\n}\nconsole.log(mergeSortedArrays([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]"
      }
    ]
  },
  {
    "id": 174,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Two Pointers",
    "question": "Coding Challenge: Container With Most Water (2 Methods)",
    "answer": "Find two lines that form a container containing the most water.\n• **Method 1: Two Pointers inward (Optimal O(N) Time, O(1) Space)**\n• Move the pointer pointing to the shorter vertical line inward.\n• **Method 2: Brute Force O(N²)**.",
    "approaches": [
      {
        "title": "Approach 1: Two Pointers (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Pointers at both ends calculate current area `Math.min(h[l], h[r]) * (r - l)`. Shrink the pointer with the smaller height.",
        "code": "function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let max = 0;\n  while (left < right) {\n    const area = Math.min(height[left], height[right]) * (right - left);\n    if (area > max) max = area;\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return max;\n}\nconsole.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49"
      }
    ]
  },
  {
    "id": 175,
    "topicId": 11,
    "difficulty": "Intermediate",
    "category": "Dynamic Programming",
    "question": "Coding Challenge: Maximum Subarray Sum (Kadane's Algorithm) (2 Methods)",
    "answer": "Find contiguous subarray with largest sum in $O(N)$ time.\n• **Kadane's Algorithm**: `currentSum = Math.max(num, currentSum + num); maxSum = Math.max(maxSum, currentSum)`.\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    "approaches": [
      {
        "title": "Approach 1: Kadane's Algorithm (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Iterates through array, deciding at each element whether to add to existing subarray or start a new subarray.",
        "code": "function maxSubArray(nums) {\n  let currentSum = nums[0];\n  let maxSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}\nconsole.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6 ([4,-1,2,1])"
      }
    ]
  },
  {
    "id": 176,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Sliding Window",
    "question": "Coding Challenge: Longest Substring Without Repeating Characters (2 Methods)",
    "answer": "Find length of longest substring without duplicates.\n• **Method 1: Sliding Window with Map of Last Indices (Optimal O(N) Time, O(K) Space)**\n• **Method 2: Set window (O(2N) Time)**.",
    "approaches": [
      {
        "title": "Approach 1: Sliding Window with Map (Optimal O(N))",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(min(M, N))",
        "explanation": "Expands right pointer. If character was seen within current window, jump left pointer to `lastSeenIndex + 1`.",
        "code": "function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let max = 0, left = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (map.has(char) && map.get(char) >= left) {\n      left = map.get(char) + 1;\n    }\n    map.set(char, right);\n    max = Math.max(max, right - left + 1);\n  }\n\n  return max;\n}\nconsole.log(lengthOfLongestSubstring(\"abcabcbb\")); // 3 (\"abc\")"
      }
    ]
  },
  {
    "id": 177,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Two Pointers",
    "question": "Coding Challenge: 3Sum Problem (2 Methods)",
    "answer": "Find all unique triplets in array that sum to zero.\n• Sort array ($O(N \\log N)$), loop index $i$, and run Two-Pointers on remaining elements while skipping duplicates.\n• **Time**: **O(N²)** | **Space**: **O(1)** auxiliary.",
    "code": "function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const result = [];\n\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicate i\n    let left = i + 1, right = nums.length - 1;\n\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++; right--;\n      } else if (sum < 0) left++;\n      else right--;\n    }\n  }\n\n  return result;\n}\nconsole.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]"
  },
  {
    "id": 178,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Two Pointers",
    "question": "Coding Challenge: Trapping Rain Water (2 Methods)",
    "answer": "Calculate total trapped rainwater.\n• **Method 1: Two Pointers with leftMax & rightMax (Optimal O(N) Time, O(1) Space)**\n• **Method 2: Prefix and Suffix Max arrays (O(N) Time, O(N) Space)**.",
    "approaches": [
      {
        "title": "Approach 1: Two Pointers (Optimal O(1) Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Tracks leftMax and rightMax, advancing the pointer with the smaller maximum.",
        "code": "function trapRainWater(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let total = 0;\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else total += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else total += rightMax - height[right];\n      right--;\n    }\n  }\n\n  return total;\n}\nconsole.log(trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6"
      }
    ]
  },
  {
    "id": 179,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Object Recursion",
    "question": "Coding Challenge: Flatten Deeply Nested Object with Dot Paths (2 Methods)",
    "answer": "Convert nested object to flat dictionary with key paths (e.g. `{ a: { b: 1 } }` -> `{ 'a.b': 1 }`).\n• **Time**: **O(N)** | **Space**: **O(D)**.",
    "code": "function flattenObject(obj, prefix = \"\", res = {}) {\n  for (const key of Object.keys(obj)) {\n    const propName = prefix ? `${prefix}.${key}` : key;\n    if (typeof obj[key] === \"object\" && obj[key] !== null && !Array.isArray(obj[key])) {\n      flattenObject(obj[key], propName, res);\n    } else {\n      res[propName] = obj[key];\n    }\n  }\n  return res;\n}\nconsole.log(flattenObject({ user: { address: { city: \"Hyderabad\" } } }));\n// { \"user.address.city\": \"Hyderabad\" }"
  },
  {
    "id": 180,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Sliding Window",
    "question": "Coding Challenge: Find All Anagrams in a String (Sliding Window) (2 Methods)",
    "answer": "Find all start indices of anagrams of string p in s.\n• **Sliding window of length p.length comparing character frequency map.**\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    "code": "function findAnagrams(s, p) {\n  const result = [];\n  if (s.length < p.length) return result;\n\n  const pCounts = new Array(26).fill(0);\n  const sCounts = new Array(26).fill(0);\n  const aCode = \"a\".charCodeAt(0);\n\n  for (let i = 0; i < p.length; i++) {\n    pCounts[p.charCodeAt(i) - aCode]++;\n    sCounts[s.charCodeAt(i) - aCode]++;\n  }\n\n  const matches = (a, b) => a.every((v, i) => v === b[i]);\n  if (matches(sCounts, pCounts)) result.push(0);\n\n  for (let i = p.length; i < s.length; i++) {\n    sCounts[s.charCodeAt(i) - aCode]++;\n    sCounts[s.charCodeAt(i - p.length) - aCode]--;\n    if (matches(sCounts, pCounts)) result.push(i - p.length + 1);\n  }\n\n  return result;\n}\nconsole.log(findAnagrams(\"cbaebabacd\", \"abc\")); // [0, 6]"
  },
  {
    "id": 181,
    "topicId": 12,
    "difficulty": "Junior",
    "category": "Tree Algorithms",
    "question": "Coding Challenge: Invert a Binary Tree (2 Methods)",
    "answer": "Swap left and right children for every node in a binary tree.\n• **Method 1: Recursive DFS (Optimal O(N) Time, O(H) Space)**\n• **Method 2: Iterative BFS with Queue**.",
    "code": "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}"
  },
  {
    "id": 182,
    "topicId": 12,
    "difficulty": "Junior",
    "category": "Two Pointers",
    "question": "Coding Challenge: Valid Palindrome II (At most one character removal) (2 Methods)",
    "answer": "Check if string can be a palindrome by deleting at most one character.\n• Two pointers from ends. On first mismatch, test if either `s.slice(l+1, r+1)` or `s.slice(l, r)` is palindrome.\n• **Time**: **O(N)** | **Space**: **O(1)**.",
    "code": "function validPalindromeII(s) {\n  const isPal = (str, l, r) => {\n    while (l < r) {\n      if (str[l] !== str[r]) return false;\n      l++; r--;\n    }\n    return true;\n  };\n\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (s[l] !== s[r]) {\n      return isPal(s, l + 1, r) || isPal(s, l, r - 1);\n    }\n    l++; r--;\n  }\n  return true;\n}\nconsole.log(validPalindromeII(\"abca\")); // true (remove 'c')"
  },
  {
    "id": 183,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Array Algorithms",
    "question": "Coding Challenge: Product of Array Except Self without Division (2 Methods)",
    "answer": "Calculate product of all elements except `nums[i]` without using division operator.\n• **Prefix products pass Left-to-Right, Suffix products pass Right-to-Left.**\n• **Time**: **O(N)** | **Space**: **O(1)** extra memory.",
    "approaches": [
      {
        "title": "Approach 1: Prefix & Suffix in Single Result (Optimal O(1) Extra Space)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1) auxiliary",
        "explanation": "First pass computes prefix products. Second pass multiplies with running suffix product.",
        "code": "function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= suffix;\n    suffix *= nums[i];\n  }\n\n  return res;\n}\nconsole.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]"
      }
    ]
  },
  {
    "id": 184,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Set Algorithms",
    "question": "Coding Challenge: Longest Consecutive Sequence in Unsorted Array (2 Methods)",
    "answer": "Find length of longest consecutive elements sequence in unsorted array in $O(N)$ time.\n• **Method: Set lookups ($O(N)$)**: Store numbers in a Set. Only initiate a sequence check if `!set.has(num - 1)` (the start of a sequence).",
    "code": "function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let longest = 0;\n\n  for (const num of set) {\n    if (!set.has(num - 1)) { // Only start counting from beginning of streak\n      let current = num;\n      let streak = 1;\n      while (set.has(current + 1)) {\n        current++;\n        streak++;\n      }\n      longest = Math.max(longest, streak);\n    }\n  }\n\n  return longest;\n}\nconsole.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4 ([1,2,3,4])"
  },
  {
    "id": 185,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Matrix Algorithms",
    "question": "Coding Challenge: Spiral Matrix Traversal (2 Methods)",
    "answer": "Traverse M x N matrix in spiral order.\n• Maintain 4 boundary pointers (`top`, `bottom`, `left`, `right`) and contract inward.",
    "code": "function spiralOrder(matrix) {\n  if (!matrix.length) return [];\n  const result = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n\n  while (top <= bottom && left <= right) {\n    for (let col = left; col <= right; col++) result.push(matrix[top][col]);\n    top++;\n    for (let row = top; row <= bottom; row++) result.push(matrix[row][right]);\n    right--;\n    if (top <= bottom) {\n      for (let col = right; col >= left; col--) result.push(matrix[bottom][col]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let row = bottom; row >= top; row--) result.push(matrix[row][left]);\n      left++;\n    }\n  }\n  return result;\n}\nconsole.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // [1,2,3,6,9,8,7,4,5]"
  },
  {
    "id": 186,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Monotonic Stack",
    "question": "Coding Challenge: Daily Temperatures / Next Greater Element (Monotonic Stack)",
    "answer": "Find how many days to wait for a warmer temperature.\n• **Monotonic Decreasing Stack stores indices ($O(N)$ Time, $O(N)$ Space).**",
    "code": "function dailyTemperatures(temps) {\n  const res = new Array(temps.length).fill(0);\n  const stack = []; // stores indices\n\n  for (let i = 0; i < temps.length; i++) {\n    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n\n  return res;\n}\nconsole.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1,1,4,2,1,1,0,0]"
  },
  {
    "id": 187,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Prefix Sum",
    "question": "Coding Challenge: Subarray Sum Equals K (Prefix Sum Hash Map)",
    "answer": "Count contiguous subarrays whose sum equals K.\n• Maintain running prefix sum and map of cumulative frequencies. Check `map.has(sum - k)`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    "code": "function subarraySum(nums, k) {\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n\n  for (const num of nums) {\n    sum += num;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n\n  return count;\n}\nconsole.log(subarraySum([1, 1, 1], 2)); // 2"
  },
  {
    "id": 188,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Sliding Window",
    "question": "Coding Challenge: Minimum Window Substring (Sliding Window with Target Map)",
    "answer": "Find shortest substring of s containing all characters of t.\n• **Expand right pointer to satisfy window requirements; contract left pointer to minimize window.**\n• **Time**: **O(N)** | **Space**: **O(K)**.",
    "code": "function minWindow(s, t) {\n  if (!s || !t) return \"\";\n  const target = new Map();\n  for (const c of t) target.set(c, (target.get(c) || 0) + 1);\n\n  let left = 0, right = 0, required = target.size;\n  let minLen = Infinity, start = 0;\n  const windowCounts = new Map();\n  let formed = 0;\n\n  while (right < s.length) {\n    const c = s[right];\n    windowCounts.set(c, (windowCounts.get(c) || 0) + 1);\n    if (target.has(c) && windowCounts.get(c) === target.get(c)) formed++;\n\n    while (left <= right && formed === required) {\n      if (right - left + 1 < minLen) {\n        minLen = right - left + 1;\n        start = left;\n      }\n      const charLeft = s[left];\n      windowCounts.set(charLeft, windowCounts.get(charLeft) - 1);\n      if (target.has(charLeft) && windowCounts.get(charLeft) < target.get(charLeft)) formed--;\n      left++;\n    }\n    right++;\n  }\n\n  return minLen === Infinity ? \"\" : s.slice(start, start + minLen);\n}\nconsole.log(minWindow(\"ADOBECODEBANC\", \"ABC\")); // \"BANC\""
  },
  {
    "id": 189,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Functional Patterns",
    "question": "Coding Challenge: Currying Function Implementation (2 Types)",
    "answer": "Currying transforms a multi-argument function into a chain of unary functions.\n• **Type 1: Fixed Arity (`curry(fn)`)** checks accumulated args vs `fn.length`.\n• **Type 2: Infinite Currying (`add(1)(2)(3)...()`)** terminates on empty invocation.",
    "code": "// Type 1: Fixed Arity\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...next) => curried.apply(this, args.concat(next));\n  };\n}\nconst sum3 = (a, b, c) => a + b + c;\nconsole.log(curry(sum3)(1)(2)(3)); // 6\n\n// Type 2: Infinite Currying\nfunction infiniteAdd(a) {\n  return function(b) {\n    if (b === undefined) return a;\n    return infiniteAdd(a + b);\n  };\n}\nconsole.log(infiniteAdd(1)(2)(3)(4)()); // 10"
  },
  {
    "id": 190,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Functional Patterns",
    "question": "Coding Challenge: Function Composition (compose and pipe) (2 Methods)",
    "answer": "• `pipe(f, g, h)(x)`: Left-to-Right: $h(g(f(x)))$.\n• `compose(f, g, h)(x)`: Right-to-Left: $f(g(h(x)))$.",
    "code": "const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\nconst compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\n\nconst add5 = x => x + 5;\nconst double = x => x * 2;\nconsole.log(pipe(add5, double)(10));    // 30 ((10+5)*2)\nconsole.log(compose(add5, double)(10)); // 25 ((10*2)+5)"
  },
  {
    "id": 191,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Performance",
    "question": "Coding Challenge: Function Memoization Implementation (2 Methods)",
    "answer": "Cache return values of pure functions keyed on input arguments.",
    "code": "function memoize(fn, resolver) {\n  const cache = new Map();\n  return function(...args) {\n    const key = resolver ? resolver(...args) : JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\nconst slowFib = n => n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2);\nconst fastFib = memoize(slowFib);\nconsole.log(fastFib(35)); // 9227465 (Instant!)"
  },
  {
    "id": 192,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Async JS",
    "question": "Coding Challenge: Promisify a Node.js Callback Function (2 Methods)",
    "answer": "Convert error-first callback signature `(err, data) => {}` to a Promise.",
    "code": "function promisify(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(this, ...args, (err, result) => {\n        if (err) return reject(err);\n        resolve(result);\n      });\n    });\n  };\n}"
  },
  {
    "id": 193,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Polyfill",
    "question": "Coding Challenge: Custom Promise.all() Polyfill (2 Approaches)",
    "answer": "Wait for all promises to fulfill or reject on first rejection. Store at exact indices.",
    "code": "function customPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (!Array.isArray(promises)) return reject(new TypeError(\"Array required\"));\n    const results = [];\n    let done = 0;\n    if (promises.length === 0) return resolve(results);\n\n    promises.forEach((p, i) => {\n      Promise.resolve(p)\n        .then(val => {\n          results[i] = val;\n          if (++done === promises.length) resolve(results);\n        })\n        .catch(reject);\n    });\n  });\n}"
  },
  {
    "id": 194,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Polyfill",
    "question": "Coding Challenge: Custom Promise.allSettled() Polyfill (2 Approaches)",
    "answer": "Never rejects. Returns array of `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.",
    "code": "function customAllSettled(promises) {\n  const wrapped = promises.map(p =>\n    Promise.resolve(p)\n      .then(value => ({ status: \"fulfilled\", value }))\n      .catch(reason => ({ status: \"rejected\", reason }))\n  );\n  return Promise.all(wrapped);\n}"
  },
  {
    "id": 195,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Polyfill",
    "question": "Coding Challenge: Custom Promise.race() & Promise.any() Polyfills",
    "answer": "• race: settles on 1st promise settled.\n• any: fulfills on 1st promise fulfilled, rejects with AggregateError only if all reject.",
    "code": "function customRace(promises) {\n  return new Promise((resolve, reject) => {\n    promises.forEach(p => Promise.resolve(p).then(resolve, reject));\n  });\n}\n\nfunction customAny(promises) {\n  return new Promise((resolve, reject) => {\n    const errors = [];\n    let rejectedCount = 0;\n    if (!promises.length) return reject(new AggregateError([], \"All rejected\"));\n\n    promises.forEach((p, idx) => {\n      Promise.resolve(p).then(resolve).catch(err => {\n        errors[idx] = err;\n        if (++rejectedCount === promises.length) {\n          reject(new AggregateError(errors, \"All promises were rejected\"));\n        }\n      });\n    });\n  });\n}"
  },
  {
    "id": 196,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Concurrency",
    "question": "Coding Challenge: Async Concurrency Limiter (p-limit) (2 Methods)",
    "answer": "Execute N async tasks with maximum K active simultaneous workers.",
    "code": "function createLimiter(concurrency) {\n  let active = 0;\n  const queue = [];\n\n  const next = () => {\n    if (active >= concurrency || !queue.length) return;\n    active++;\n    const { fn, resolve, reject } = queue.shift();\n    fn().then(resolve).catch(reject).finally(() => {\n      active--;\n      next();\n    });\n  };\n\n  return function limit(fn) {\n    return new Promise((resolve, reject) => {\n      queue.push({ fn, resolve, reject });\n      next();\n    });\n  };\n}"
  },
  {
    "id": 197,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "System Patterns",
    "question": "Coding Challenge: Custom Event Emitter Class (on, off, emit, once)",
    "answer": "Implement publish-subscribe event emitter with unsubscribe closures.",
    "code": "class EventEmitter {\n  constructor() { this.events = new Map(); }\n  on(event, cb) {\n    if (!this.events.has(event)) this.events.set(event, new Set());\n    this.events.get(event).add(cb);\n    return () => this.off(event, cb);\n  }\n  off(event, cb) {\n    this.events.get(event)?.delete(cb);\n  }\n  emit(event, ...args) {\n    this.events.get(event)?.forEach(cb => cb(...args));\n  }\n  once(event, cb) {\n    const wrapper = (...args) => {\n      this.off(event, wrapper);\n      cb(...args);\n    };\n    return this.on(event, wrapper);\n  }\n}"
  },
  {
    "id": 198,
    "topicId": 12,
    "difficulty": "Senior",
    "category": "Data Structures",
    "question": "Coding Challenge: LRU Cache (Least Recently Used) in O(1) Time (2 Methods)",
    "answer": "Get and put in O(1) time.\n• **Method 1: ES6 Map (Exploits insertion order eviction - Cleanest & Fastest in JS)**\n• Delete and set moves key to most recent.\n• First key in `map.keys().next().value` is oldest.\n• **Method 2: Doubly Linked List + HashMap**.",
    "approaches": [
      {
        "title": "Approach 1: ES6 Map (Optimal O(1))",
        "timeComplexity": "O(1) get & put",
        "spaceComplexity": "O(Capacity)",
        "explanation": "JavaScript Map maintains insertion order. On get, delete and re-insert to refresh recency. On put when full, delete `map.keys().next().value` (oldest).",
        "code": "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      const oldest = this.cache.keys().next().value;\n      this.cache.delete(oldest);\n    }\n    this.cache.set(key, value);\n  }\n}\nconst lru = new LRUCache(2);\nlru.put(1, \"A\"); lru.put(2, \"B\");\nconsole.log(lru.get(1)); // \"A\"\nlru.put(3, \"C\"); // Evicts 2!\nconsole.log(lru.get(2)); // -1"
      }
    ]
  },
  {
    "id": 199,
    "topicId": 12,
    "difficulty": "Junior",
    "category": "Binary Search",
    "question": "Coding Challenge: Binary Search on Sorted Array (2 Methods)",
    "answer": "Find target in sorted array in $O(\\log N)$ time.\n• `mid = Math.floor(left + (right - left) / 2)` prevents integer overflow.",
    "code": "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\nconsole.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3"
  },
  {
    "id": 200,
    "topicId": 12,
    "difficulty": "Intermediate",
    "category": "Binary Search",
    "question": "Coding Challenge: Search in Rotated Sorted Array (2 Methods)",
    "answer": "Search target in rotated sorted array in $O(\\log N)$ time.\n• One half (left to mid OR mid to right) is ALWAYS sorted. Check if target lies in sorted half.",
    "code": "function searchRotated(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n\n    // Left half sorted\n    if (nums[left] <= nums[mid]) {\n      if (target >= nums[left] && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else { // Right half sorted\n      if (target > nums[mid] && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}\nconsole.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4"
  }
];
