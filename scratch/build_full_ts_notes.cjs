// scratch/build_full_ts_notes.cjs
// Comprehensive 24-Module TypeScript Master Curriculum Generator adhering to AGENTS.md universal blueprint.

const fs = require('fs');
const path = require('path');

const TS_NOTES_METADATA = {
  title: "TypeScript Master Curriculum & Engineering Notes",
  subtitle: "Comprehensive Foundations to Senior / Staff Architecture & Client Screening Preparation",
  level: "Foundations → Intermediate → Advanced Type-System Mechanics → Full-Stack Production (React 19 / NestJS / Zod)",
  purpose: "Rebuilding TypeScript from first principles: mastering static type contracts, V8 compiler type erasure, structural variance, recursive type-level metaprogramming, and production full-stack engineering.",
  phases: [
    { number: 1, title: "Foundations & Core Mechanics", desc: "Superset model, tsconfig strictness, primitives, inference, contextual typing, unions & structural typing" },
    { number: 2, title: "Functions, Narrowing & Generics", desc: "Function variance, control-flow type guards, type predicates, generic constraints & built-in utility types" },
    { number: 3, title: "Advanced Type System & Architecture", desc: "Conditional types, infer, mapped types, template literals, enums vs const assertions, classes & declaration files" },
    { number: 4, title: "Full-Stack Production, Tooling & DSA", desc: "React 19 typing, NestJS DTOs, Zod schema parsing, branded types, compiler internals & interview coding" }
  ]
};

const sections = [];

// ==========================================
// PHASE 1: FOUNDATIONS & CORE MECHANICS
// ==========================================

// SECTION 1 (Module 1): Introduction to TypeScript
sections.push({
  id: "what-is-ts",
  number: "1",
  phase: 1,
  title: "Introduction to TypeScript & The Typed Superset",
  summary: "The nature of TypeScript as a static compile-time type system over dynamic JavaScript, the compiler pipeline, AST type checking, and the non-negotiable reality of runtime type erasure.",
  subsections: [
    {
      id: "1.0",
      title: "1.0 Topic Overview & Beginner Mental Model",
      content: `### What is TypeScript?
TypeScript is an open-source, statically typed superset of JavaScript developed and maintained by Microsoft. "Superset" means that **every valid JavaScript program is syntactically valid TypeScript**. TypeScript extends JavaScript by adding an optional, static type system and rich developer tooling.

### The Construction Blueprint Analogy
Think of raw JavaScript as building a bridge where you assemble girders, pour concrete, and test weight limits only after cars start driving across it. If an engineer accidentally specified a wooden beam instead of steel, the bridge fails catastrophically in production (a runtime \`TypeError: cannot read properties of undefined\`).

TypeScript acts as the **architectural blueprint and stress-testing simulation software**. It analyzes structural integrity, cross-references material load ratings, and verifies connections on the computer screen before a single ounce of concrete is poured. If there is a mismatch, the simulation halts with a red alert (compile error). Crucially, once construction completes, the digital blueprint is filed away—only the physical bridge remains. Similarly, **TypeScript types are completely erased during compilation; only JavaScript executes in Node.js or the browser**.`,
      bulletPoints: [
        "Statically Typed: Types are checked during development and build time, not while the code is running.",
        "Syntactic Superset: Valid JavaScript code runs inside a TypeScript environment without syntax changes.",
        "Tooling Powerhouse: Powers modern IDE features including semantic autocompletion, instant jump-to-definition, and project-wide safe refactoring."
      ]
    },
    {
      id: "1.1",
      title: "1.1 Static Checking vs Runtime Validation (Critical Distinction)",
      content: `A frequent source of senior engineering interview failures is confusing **Compile-Time Type Checking** with **Runtime Data Validation**.

| Feature | TypeScript Compile-Time Checking | Runtime Schema Validation (Zod, Valibot) |
| :--- | :--- | :--- |
| **Execution Moment** | During development (IDE) and build step (\`tsc\`) | While the application is actively running in production |
| **Performance Cost** | Zero runtime CPU/RAM cost (types are erased) | Minor CPU parsing cost per incoming network request |
| **Protection Scope** | Internal developer mistakes, typos, refactoring errors | Malicious payloads, corrupted database rows, external API drift |
| **Output** | Emitted JavaScript or compiler diagnostic errors | Parsed JavaScript object or thrown validation error |`,
      code: `// ❌ UNPROTECTED: TypeScript types cannot validate incoming network JSON!
interface UserProfile {
  id: string;
  email: string;
  age: number;
}

// At runtime, an API client could send: { "id": 123, "email": null }
app.post("/users", (req, res) => {
  const user = req.body as UserProfile; // UNSAFE CAST!
  // At runtime, user.email.toLowerCase() throws: TypeError: Cannot read properties of null!
});

// ✅ PRODUCTION SECURE: Combine TS contracts with runtime schema parsers (e.g. Zod)
import { z } from "zod";

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(18)
});

type UserProfileFromSchema = z.infer<typeof UserProfileSchema>;

app.post("/users", (req, res) => {
  const result = UserProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  const validUser: UserProfileFromSchema = result.data; // 100% type-safe at runtime!
  console.log(validUser.email.toLowerCase());
});`,
      interviewAnswer: "TypeScript is a compile-time static type system that operates via type erasure. Its types exist solely to verify program correctness during development and build phases. Because emitted JavaScript contains zero type information, TypeScript cannot validate untrusted runtime boundaries—such as HTTP request bodies, database query results, or third-party webhooks. Production systems must pair TypeScript types with runtime schema validation libraries like Zod."
    },
    {
      id: "1.2",
      title: "1.2 TypeScript Compiler Pipeline & Internal Mechanics",
      content: `### How the TypeScript Compiler (\`tsc\`) Works Internally
When you run \`tsc\`, the compiler executes a multi-phase compilation pipeline:

1. **Scanner & Parser**: Reads raw text characters from \`.ts\` files, generates tokens, and builds an Abstract Syntax Tree (AST).
2. **Binder**: Traverses the AST and constructs the Symbol Table, creating associations between identifiers and their declarations (Scopes, Interfaces, Classes).
3. **Type Checker**: The computational heart of TypeScript. It verifies assignability, checks constraints, resolves generics, evaluates conditional types, and enforces variance rules. If errors exist, diagnostics are emitted.
4. **Emitter**: Transforms the AST into target JavaScript (e.g. ES2022) by stripping all type annotations, interfaces, and type aliases. It also emits declaration files (\`.d.ts\`) and source maps (\`.js.map\`) if configured.`,
      table: {
        headers: ["Pipeline Phase", "Internal Component", "Output / Responsibility"],
        rows: [
          ["Phase 1: Lexing & Parsing", "Scanner + Parser", "AST (Abstract Syntax Tree) containing syntax nodes"],
          ["Phase 2: Binding", "Binder", "Symbol Table mapping variables, functions, and scopes"],
          ["Phase 3: Verification", "Type Checker", "Diagnostics (type error list) and type resolution cache"],
          ["Phase 4: Transformation", "Emitter", "Clean .js code (types erased), optional .d.ts, and .map files"]
        ]
      },
      code: `// TypeScript Source:
interface Order {
  id: string;
  total: number;
}
function calculateTax(order: Order, taxRate: number): number {
  return order.total * taxRate;
}

// Emitted JavaScript (Target: ES2022) — Notice complete erasure of 'interface' and types:
function calculateTax(order, taxRate) {
  return order.total * taxRate;
}`,
      callout: {
        type: "tip",
        text: "Senior Note: Modern bundlers like Vite, esbuild, and SWC only perform Phase 4 (Transpilation/Type Erasure) for blazing speed. They do NOT run Phase 3 (Type Checker). Always run 'tsc --noEmit' in CI/CD pipelines to guarantee type safety!"
      }
    }
  ]
});

// SECTION 2 (Module 2): Environment and Configuration
sections.push({
  id: "compilation-environment",
  number: "2",
  phase: 1,
  title: "Environment, Compilation & tsconfig.json Deep Dive",
  summary: "Comprehensive guide to tsconfig.json compiler options, strictness flags, module resolution, project references, and transpile-only tooling.",
  subsections: [
    {
      id: "2.0",
      title: "2.0 Critical tsconfig.json Compiler Options",
      content: `The \`tsconfig.json\` file instructs the TypeScript compiler how to parse files, enforce type strictness, and emit JavaScript artifacts. Setting up a production configuration requires understanding every major compiler option:`,
      table: {
        headers: ["Option", "Recommended Production Value", "Architectural Purpose & Impact"],
        rows: [
          ["target", '"ES2022" or "ESNext"', "Determines which ECMAScript syntax features are preserved vs down-compiled to older syntax."],
          ["module", '"NodeNext" or "ESNext"', "Controls the emitted module system (CommonJS vs ECMAScript Modules ESM)."],
          ["moduleResolution", '"NodeNext" or "Bundler"', "Dictates how imports are resolved against node_modules and file extensions."],
          ["strict", "true", "Enables the master suite of strict type checking rules (strictNullChecks, noImplicitAny, etc.)."],
          ["strictNullChecks", "true (implied by strict)", "Differentiates 'null' and 'undefined' from concrete domain types."],
          ["noUncheckedIndexedAccess", "true", "Adds 'undefined' to any dynamic array index or record access (e.g. arr[0] is T | undefined)."],
          ["exactOptionalPropertyTypes", "true", "Distinguishes between a property being omitted vs explicitly assigned 'undefined'."],
          ["noImplicitOverride", "true", "Forces the 'override' keyword on sub-class methods that override base class members."],
          ["skipLibCheck", "true", "Skips type checking of external .d.ts files in node_modules, massively speeding up builds."]
        ]
      },
      code: `// Production-Grade tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    
    /* Strict Type Checking */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    /* Emit & Build Hygiene */
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`
    },
    {
      id: "2.1",
      title: "2.1 strictNullChecks and noUncheckedIndexedAccess in Practice",
      content: `In standard JavaScript and non-strict TypeScript, \`null\` and \`undefined\` are assignable to every type. This was Tony Hoare's self-described "Billion Dollar Mistake". Enabling \`strictNullChecks\` eliminates an entire class of runtime panics.

Additionally, \`noUncheckedIndexedAccess\` protects against out-of-bounds array access:`,
      code: `// Without noUncheckedIndexedAccess:
const users: string[] = ["Alice", "Bob"];
const thirdUser = users[2]; // TypeScript infers 'string'!
console.log(thirdUser.toUpperCase()); // 💥 RUNTIME CRASH: Cannot read properties of undefined!

// With "noUncheckedIndexedAccess": true:
const safeUsers: string[] = ["Alice", "Bob"];
const safeThird = safeUsers[2]; // TypeScript infers 'string | undefined'!

// Compiler forces narrowing:
if (safeThird !== undefined) {
  console.log(safeThird.toUpperCase()); // ✅ Safe to execute
}`,
      interviewAnswer: "Enabling 'strict' in tsconfig activates critical type invariants like strictNullChecks, preventing null from masquerading as a valid string or object. For senior engineering projects, we also activate 'noUncheckedIndexedAccess'. This forces array lookups to evaluate to 'T | undefined', compelling developers to verify existence before dereferencing array elements."
    }
  ]
});

// SECTION 3 (Module 3): Basic Types, Primitives & Special Types
sections.push({
  id: "basic-types",
  number: "3",
  phase: 1,
  title: "Basic Types, Primitives, any, unknown, never & void",
  summary: "Comprehensive guide to TypeScript's primitive types, special top and bottom types, literal types, tuples, const assertions, and the differences between object, Object, and {}.",
  subsections: [
    {
      id: "3.0",
      title: "3.0 JavaScript Primitives vs TypeScript Top & Bottom Types",
      content: `TypeScript includes all 7 JavaScript primitive types: \`string\`, \`number\`, \`boolean\`, \`bigint\`, \`symbol\`, \`null\`, and \`undefined\`.

Crucially, TypeScript introduces four unique types that form the hierarchy of the type system:

1. **\`any\` (The Escape Hatch)**: Disables the type checker entirely. Any operation is permitted. Contaminates every variable it touches.
2. **\`unknown\` (The Safe Top Type)**: Represents any value, but **nothing can be done with it without narrowing first**.
3. **\`void\`**: Represents the absence of a meaningful return value (functions that return with no value or return undefined).
4. **\`never\` (The Bottom Type)**: Represents values that never occur. Used for functions that throw unconditionally or infinite loops, and in exhaustive checking.`,
      table: {
        headers: ["Type", "Category", "Assign Any Value To It?", "Can Perform Arbitrary Ops?", "Safe for Production?"],
        rows: [
          ["any", "Top Type & Escape Hatch", "Yes", "Yes (No type checking)", "❌ Dangerous: disables compiler entirely"],
          ["unknown", "Universal Top Type", "Yes", "No (Must narrow with typeof/instanceof)", "✅ Best practice for untrusted data"],
          ["void", "Absence of Return Value", "No (only undefined)", "No", "✅ Standard for side-effect callbacks"],
          ["never", "Universal Bottom Type", "No (Empty set ∅)", "No (Impossible value)", "✅ Essential for exhaustive switch checks"]
        ]
      },
      code: `// 'any' vs 'unknown' in Action:
function handleUntrustedAny(data: any) {
  data.triggerPayment(); // Compiles without error! If method doesn't exist: RUNTIME CRASH!
}

function handleUntrustedUnknown(data: unknown) {
  // data.triggerPayment(); 
  // ❌ Compile Error: 'data' is of type 'unknown'.

  // Must narrow first:
  if (typeof data === "object" && data !== null && "triggerPayment" in data) {
    (data as { triggerPayment: () => void }).triggerPayment(); // ✅ Safe
  }
}`
    },
    {
      id: "3.1",
      title: "3.1 'never' and Exhaustive Control-Flow Analysis",
      content: `The \`never\` type represents an empty set of possible values. It enables compile-time exhaustive checking when handling discriminated unions:`,
      code: `type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "CRYPTO";

function processPayment(method: PaymentMethod): string {
  switch (method) {
    case "CREDIT_CARD":
      return "Processing Stripe charge";
    case "PAYPAL":
      return "Redirecting to PayPal portal";
    case "CRYPTO":
      return "Generating web3 transaction payload";
    default: {
      // If a developer adds a new payment method (e.g. "APPLE_PAY") and forgets this switch:
      const exhaustiveCheck: never = method;
      // ❌ Compile Error: Type 'string' is not assignable to type 'never'.
      throw new Error(\`Unhandled payment method: \${exhaustiveCheck}\`);
    }
  }
}`
    },
    {
      id: "3.2",
      title: "3.2 'object' vs 'Object' vs '{}' (The Interview Trap)",
      content: `One of the most frequently asked TypeScript interview questions is the distinction between \`object\`, \`Object\`, and \`{}\`:

- **\`object\` (lowercase)**: Represents any non-primitive value (anything where \`typeof x !== "string" && typeof x !== "number"\`, etc.). Arrays, functions, and objects are assignable to \`object\`.
- **\`Object\` (uppercase)**: The JavaScript Object constructor prototype interface. Includes primitive values with prototype methods (like numbers and strings).
- **\`{}\` (empty object type)**: Represents **any non-nullish value**! In TypeScript, strings and numbers are assignable to \`{}\` because they have properties via boxing. Only \`null\` and \`undefined\` are not assignable.`,
      code: `let nonPrimitive: object;
nonPrimitive = { key: "value" }; // ✅ Valid
nonPrimitive = [1, 2, 3];        // ✅ Valid
// nonPrimitive = 42;            // ❌ Error: Type 'number' is not assignable to type 'object'.

let emptyObject: {};
emptyObject = { key: "value" }; // ✅ Valid
emptyObject = "Hello world";     // ⚠️ Valid! Strings box into objects with properties.
// emptyObject = null;           // ❌ Error: Type 'null' is not assignable to type '{}'.`,
      interviewAnswer: "'any' turns off the type checker entirely, while 'unknown' enforces type-safe handling by requiring explicit narrowing before any property access. 'never' represents the bottom type—a set with zero inhabitants—and is the standard idiom for compile-time exhaustive switch checks. For non-primitives, always use lowercase 'object', never '{}' or 'Object', which accept boxed primitives."
    }
  ]
});

// SECTION 4 (Module 4): Type Inference, Contextual Typing & satisfies
sections.push({
  id: "type-inference",
  number: "4",
  phase: 1,
  title: "Type Inference, Contextual Typing, Widening & satisfies",
  summary: "How TypeScript infers types without explicit annotations, literal widening, contextual typing in callbacks, const assertions, and the modern satisfies operator.",
  subsections: [
    {
      id: "4.0",
      title: "4.0 Inference Mechanics & Literal Widening",
      content: `TypeScript uses sophisticated heuristics to deduce types without requiring redundant annotations.

### Variable Inference & Widening
- When a variable is declared with \`let\` or \`var\`, TypeScript **widens** the type to its general primitive type (e.g. \`"USD"\` widens to \`string\`).
- When declared with \`const\`, TypeScript preserves the **literal type** (e.g. \`"USD"\` remains type \`"USD"\`).`,
      code: `let currency = "USD"; 
// Inferred type: string (Widened, because 'let' can be reassigned to any string)

const baseCurrency = "USD"; 
// Inferred type: "USD" (Literal type preserved, cannot be reassigned)

// Problem with object literal widening:
const config = {
  endpoint: "https://api.stripe.com/v1",
  method: "POST" // Inferred as 'string', NOT literal '"POST"'!
};

function sendRequest(url: string, method: "GET" | "POST") {}
// sendRequest(config.endpoint, config.method);
// ❌ Error: Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.

// Solution 1: 'as const' Assertion
const fixedConfig = {
  endpoint: "https://api.stripe.com/v1",
  method: "POST"
} as const; // Freezes all properties to readonly literal types!
sendRequest(fixedConfig.endpoint, fixedConfig.method); // ✅ Valid`
    },
    {
      id: "4.1",
      title: "4.1 Contextual Typing in Callbacks",
      content: `In contextual typing, the type of an expression is inferred from its **location or context** in the AST rather than the expression alone. This is why you rarely need to type parameters in array callbacks:`,
      code: `const numbers = [10, 20, 30];

// The type of 'num' is contextually inferred as 'number' based on 'numbers' array type:
const doubled = numbers.map(num => num * 2);

// Contextual typing with DOM events:
window.addEventListener("click", event => {
  // 'event' is contextually typed as 'MouseEvent'
  console.log(event.clientX, event.clientY);
});`
    },
    {
      id: "4.2",
      title: "4.2 The 'satisfies' Operator (TypeScript 4.9+)",
      content: `The \`satisfies\` operator allows you to **validate that an expression matches a type or interface WITHOUT widening the inferred type**.

Before \`satisfies\`, assigning a type annotation to an object caused you to lose specific literal or union types:`,
      code: `type Palette = Record<string, string | [number, number, number]>;

// ❌ With Type Annotation: Specific type information is lost
const badTheme: Palette = {
  primary: "#38bdf8",
  secondary: [59, 130, 246]
};
// badTheme.primary.toUpperCase(); 
// ❌ Compile Error: Property 'toUpperCase' does not exist on type 'string | [number, number, number]'.

// ✅ With 'satisfies': Validates shape while retaining exact inferred literal types!
const goodTheme = {
  primary: "#38bdf8",
  secondary: [59, 130, 246]
} satisfies Palette;

goodTheme.primary.toUpperCase(); // ✅ Valid! TS knows 'primary' is specifically 'string'.
goodTheme.secondary.map(v => v * 2); // ✅ Valid! TS knows 'secondary' is a tuple.`
    }
  ]
});

// SECTION 5 (Module 5): Union & Intersection Types & Discriminated Unions
sections.push({
  id: "unions-intersections",
  number: "5",
  phase: 1,
  title: "Union, Intersection & Discriminated Union Architectures",
  summary: "Modeling domain state machines with discriminated unions, common property narrowing, intersection combinations, and eliminating impossible states.",
  subsections: [
    {
      id: "5.0",
      title: "5.0 Discriminated Unions: Eliminating Impossible States",
      content: `A **Discriminated Union** (also known as a Tagged Union or Algebraic Data Type) is a union of object types where each variant shares a common, literal discriminator property (e.g., \`status\` or \`kind\`).

### The Anti-Pattern: The Kitchen-Sink State
Novice engineers often model async state with a single interface containing multiple optional fields. This allows **impossible states** (e.g., \`isLoading: true\` while \`data\` is present and \`error\` is also populated!):`,
      code: `// ❌ ANTI-PATTERN: Allows invalid combinations
interface BadAsyncState<T> {
  isLoading: boolean;
  data?: T;
  error?: string;
}

// ✅ SENIOR ARCHITECTURE: Discriminated Union
type AsyncState<T> =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "SUCCESS"; data: T; timestamp: number }
  | { status: "ERROR"; error: Error; retryCount: number };

function renderUI<T>(state: AsyncState<T>) {
  switch (state.status) {
    case "IDLE":
      return "Ready to fetch";
    case "LOADING":
      return "Loading spinner...";
    case "SUCCESS":
      // TypeScript automatically narrows: 'data' is guaranteed to exist!
      return \`Fetched \${JSON.stringify(state.data)} at \${state.timestamp}\`;
    case "ERROR":
      // TypeScript automatically narrows: 'error' and 'retryCount' exist!
      return \`Failed: \${state.error.message} (Retries: \${state.retryCount})\`;
  }
}`
    },
    {
      id: "5.1",
      title: "5.1 Intersection Types (&) and Impossible Intersections",
      content: `An **Intersection Type** combines multiple types into one. An object must satisfy all intersected types simultaneously.

### The Impossible Intersection Trap
Intersecting incompatible primitive types creates \`never\`:`,
      code: `type AdminUser = { id: string; role: "ADMIN" } & { permissions: string[] };
const admin: AdminUser = {
  id: "usr_1",
  role: "ADMIN",
  permissions: ["READ_LOGS", "DELETE_USER"]
};

// Impossible Intersection:
type Impossible = string & number; // Evaluates to 'never'! No value can be both string and number.`
    }
  ]
});

// SECTION 6 (Module 6): Type Aliases vs Interfaces & Structural Typing
sections.push({
  id: "interfaces-vs-types",
  number: "6",
  phase: 1,
  title: "Type Aliases, Interfaces & Structural Typing Mechanics",
  summary: "Comprehensive comparison between type aliases and interfaces, declaration merging, excess property checks, and TypeScript's structural type system.",
  subsections: [
    {
      id: "6.0",
      title: "6.0 Type Aliases vs Interfaces: When to Choose Which",
      content: `Both \`type\` and \`interface\` define shapes of objects, but they have distinct capabilities:

| Feature | \`interface\` | \`type\` Alias |
| :--- | :--- | :--- |
| **Declaration Merging** | ✅ Yes: Re-declaring merges properties | ❌ No: Duplicate identifier error |
| **Unions & Primitives** | ❌ Cannot define union types directly | ✅ Yes: \`type ID = string \| number\` |
| **Mapped Types** | ❌ Cannot be defined as interface | ✅ Yes: \`type Readonly<T> = { ... }\` |
| **Extends / Intersection** | \`interface B extends A\` | \`type B = A & { ... }\` |
| **Compiler Performance** | Slightly faster for flat object caches | Slightly slower for deeply nested intersections |`,
      code: `// Declaration Merging Example (Used extensively in .d.ts library augmentation):
interface ExpressRequest {
  ip: string;
}

// In another file or middleware module:
interface ExpressRequest {
  user?: { id: string; email: string }; // Automatically merged!
}

const req: ExpressRequest = {
  ip: "127.0.0.1",
  user: { id: "u1", email: "alex@example.com" }
};`
    },
    {
      id: "6.1",
      title: "6.1 Structural Typing vs Nominal Typing & Fresh Object Literal Checks",
      content: `TypeScript uses **Structural Typing** (also called "Duck Typing"): two types are compatible if they possess compatible members, regardless of their declared names or class lineages.

### The Excess Property Check Gotcha
Why does assigning an object literal directly throw an error when assigning an intermediate variable does not?`,
      code: `interface Point2D {
  x: number;
  y: number;
}

function renderPoint(pt: Point2D) {
  console.log(pt.x, pt.y);
}

// ❌ DIRECT OBJECT LITERAL: Triggers Excess Property Checking!
// renderPoint({ x: 10, y: 20, z: 30 });
// Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point2D'.

// ✅ INTERMEDIATE VARIABLE: Governed by standard Structural Assignability
const point3D = { x: 10, y: 20, z: 30 };
renderPoint(point3D); // Valid! point3D has 'x' and 'y'. Additional properties are allowed.`
    }
  ]
});

// ==========================================
// PHASE 2: FUNCTIONS, NARROWING & GENERICS
// ==========================================

// SECTION 7 (Module 7): Functions & Function Typing
sections.push({
  id: "functions-overloads",
  number: "7",
  phase: 2,
  title: "Function Types, Overloads, this Parameters & Variance",
  summary: "Comprehensive guide to typing functions, optional/rest parameters, call signatures, function overloads vs unions, explicit this typing, and parameter contravariance.",
  subsections: [
    {
      id: "7.0",
      title: "7.0 Function Overloads vs Union Signatures",
      content: `Function overloading in TypeScript allows you to define multiple type signatures that share a single implementation signature.

### The Golden Rule of Overloads
Implementation signatures are **internal to the function** and invisible to callers. Callers can only invoke overload signatures!`,
      code: `// Overload Signatures:
function formatInput(input: string): string;
function formatInput(input: number): number;
function formatInput(input: boolean): string;

// Implementation Signature (Must be compatible with all overloads):
function formatInput(input: string | number | boolean): string | number {
  if (typeof input === "string") return input.trim().toUpperCase();
  if (typeof input === "number") return input * 100;
  return input ? "TRUE" : "FALSE";
}

const s = formatInput("hello"); // Inferred type: string
const n = formatInput(42);      // Inferred type: number`
    },
    {
      id: "7.1",
      title: "7.1 Explicit 'this' Parameters & Function Compatibility",
      content: `In JavaScript, \`this\` is dynamically bound at the call site. TypeScript allows you to type \`this\` as an explicit fake first parameter. This parameter is erased during compilation:`,
      code: `interface DatabaseClient {
  query(sql: string): Promise<any[]>;
}

// 'this' parameter is type-checked but erased in emitted JS:
function executeWithLogging(this: DatabaseClient, sql: string) {
  console.log("Executing SQL:", sql);
  return this.query(sql); // Type-safe access to this.query!
}`
    }
  ]
});

// SECTION 8 (Module 8): Narrowing & Type Guards
sections.push({
  id: "narrowing-guards",
  number: "8",
  phase: 2,
  title: "Type Narrowing, Control Flow Analysis & Type Predicates",
  summary: "Deep dive into TypeScript's control-flow analysis, typeof, instanceof, the in operator, user-defined type predicates (is), and assertion functions (asserts).",
  subsections: [
    {
      id: "8.0",
      title: "8.0 Built-in Narrowing Mechanisms (typeof, instanceof, in)",
      content: `Control Flow Analysis (CFA) inspects your runtime branching conditions to narrow union types down to specific subtypes within each branch:`,
      code: `interface Dog { bark(): void; }
interface Cat { meow(): void; }

function handlePet(pet: Dog | Cat | string) {
  // 1. typeof narrowing:
  if (typeof pet === "string") {
    return pet.toUpperCase();
  }

  // 2. 'in' operator narrowing:
  if ("bark" in pet) {
    pet.bark(); // TS knows pet is Dog
  } else {
    pet.meow(); // TS knows pet is Cat
  }
}`
    },
    {
      id: "8.1",
      title: "8.1 User-Defined Type Predicates (param is Type)",
      content: `When narrowing logic is encapsulated into a helper function, TypeScript normally loses track of the narrowing. **Type Predicates** (\`param is Type\`) tell the compiler that a boolean return value confirms the specific type of the argument:`,
      code: `interface ApiSuccessResponse<T> {
  status: 200;
  payload: T;
}

// Type Predicate: 'data is ApiSuccessResponse<T>'
function isSuccessResponse<T>(data: unknown): data is ApiSuccessResponse<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    (data as any).status === 200 &&
    "payload" in data
  );
}

function processPayload(res: unknown) {
  if (isSuccessResponse<string[]>(res)) {
    // Inside this block, 'res' is narrowed to ApiSuccessResponse<string[]>!
    console.log(res.payload.map(s => s.toLowerCase()));
  }
}`
    },
    {
      id: "8.2",
      title: "8.2 Assertion Functions (asserts condition / asserts value is Type)",
      content: `Assertion functions throw an error if a condition is not met. The \`asserts\` keyword instructs TypeScript that if the function returns normally without throwing, the argument has been successfully verified:`,
      code: `function assertIsDefined<T>(val: T, msg: string): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(msg);
  }
}

function handleUser(id: string | null) {
  assertIsDefined(id, "User ID must be provided");
  // Downstream from here, TypeScript treats 'id' as 'string' (null is eliminated)!
  console.log(id.toUpperCase());
}`
    }
  ]
});

// SECTION 9 (Module 9): Generics
sections.push({
  id: "generics",
  number: "9",
  phase: 2,
  title: "Generics, Type Constraints & Reusable Design",
  summary: "Principles of parameterized types, generic constraints using extends, default generic arguments, generic repositories, and API envelope patterns.",
  subsections: [
    {
      id: "9.0",
      title: "9.0 Generic Foundations & Constraints (T extends Constraint)",
      content: `Generics allow functions, classes, and interfaces to operate over various types while preserving full type safety and relationships between arguments and return values.

### The Identity Function Mental Model
Without generics, you either sacrifice type information (\`any\`) or duplicate code for every possible type. Generics act as **type variables** instantiated at the call site:`,
      code: `// Generic with Constraint (extends object)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: "usr_101", username: "alex", age: 30 };

const username = getProperty(user, "username"); // Inferred type: string
const age = getProperty(user, "age");           // Inferred type: number
// getProperty(user, "nonExistentKey");         // ❌ Compile Error!`
    },
    {
      id: "9.1",
      title: "9.1 Production Pattern: Generic API Response Envelope & Repository",
      content: `In scalable full-stack applications, generic interfaces establish consistent API response envelopes and data access patterns across all backend microservices:`,
      code: `// Generic API Envelope
interface ApiResponse<TData, TMeta = { page: number; total: number }> {
  success: boolean;
  data: TData;
  meta?: TMeta;
  timestamp: string;
}

// Generic Repository Contract
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface CrudRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, "id" | "createdAt">): Promise<T>;
  delete(id: string): Promise<boolean>;
}`
    }
  ]
});

// SECTION 10 (Module 10): Advanced Object Operators: keyof, typeof & Indexed Access
sections.push({
  id: "keyof-typeof-indexed",
  number: "10",
  phase: 2,
  title: "Advanced Object Operators: keyof, typeof & Indexed Access",
  summary: "Mastering type-level operators: keyof for key extraction, typeof in type positions, indexed access T[K], and keyof typeof for object constants.",
  subsections: [
    {
      id: "10.0",
      title: "10.0 keyof and typeof Operators",
      content: `TypeScript uses \`typeof\` in two distinct contexts:
1. **Runtime \`typeof\`**: Evaluates to JavaScript strings like \`"string"\`, \`"number"\`, \`"object"\`.
2. **Type-Space \`typeof\`**: Extracts the TypeScript type of an existing runtime variable, object, or function.

Combining \`keyof typeof\` extracts a union of literal keys from any runtime object:`,
      code: `const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
} as const;

// 1. typeof HTTP_STATUS extracts the concrete type shape
// 2. keyof extracts the union of keys: "OK" | "CREATED" | "BAD_REQUEST" | ...
type HttpStatusKey = keyof typeof HTTP_STATUS;

// 3. Indexed access extracts the union of status code numbers: 200 | 201 | 400 | ...
type HttpStatusCode = typeof HTTP_STATUS[HttpStatusKey];`
    },
    {
      id: "10.1",
      title: "10.1 Indexed Access Types (T[K])",
      content: `Indexed access types look up a specific property on another type, behaving like property access but entirely within the type system:`,
      code: `interface StripeCharge {
  id: string;
  amount: number;
  currency: "usd" | "eur" | "gbp";
  customer: {
    email: string;
    stripeCustomerId: string;
  };
}

type ChargeCurrency = StripeCharge["currency"]; // "usd" | "eur" | "gbp"
type CustomerInfo = StripeCharge["customer"];    // { email: string; stripeCustomerId: string; }`
    }
  ]
});

// SECTION 11 (Module 11): Built-in Utility Types
sections.push({
  id: "utility-types",
  number: "11",
  phase: 2,
  title: "Built-in Utility Types: Comprehensive Reference & Reimplementation",
  summary: "Complete guide to built-in utility types: Partial, Required, Readonly, Record, Pick, Omit, Exclude, Extract, NonNullable, Parameters, ReturnType, Awaited, and NoInfer.",
  subsections: [
    {
      id: "11.0",
      title: "11.0 The 14 Standard Utility Types Matrix",
      content: `Utility types perform type-level transformations over existing types without modifying runtime JavaScript:`,
      table: {
        headers: ["Utility Type", "Definition / Internal Mechanism", "Real-World Production Use Case"],
        rows: [
          ["Partial<T>", "Makes all properties optional ({ [P in keyof T]?: T[P] })", "HTTP PATCH / Partial database updates"],
          ["Required<T>", "Makes all properties required ({ [P in keyof T]-?: T[P] })", "Config validation where defaults are merged"],
          ["Readonly<T>", "Makes all properties readonly ({ readonly [P in keyof T]: T[P] })", "Immutability contracts for Redux/Zustand"],
          ["Record<K, T>", "Constructs an object with keys K of type T ({ [P in K]: T })", "Lookup dictionaries and caching maps"],
          ["Pick<T, K>", "Selects a subset of keys K from T", "Creating read DTOs omitting internal columns"],
          ["Omit<T, K>", "Picks all keys except K (Pick<T, Exclude<keyof T, K>>)", "Creating insert payloads omitting auto-generated IDs"],
          ["Exclude<T, U>", "Excludes from T types assignable to U (T extends U ? never : T)", "Filtering union members"],
          ["Extract<T, U>", "Extracts from T types assignable to U (T extends U ? T : never)", "Selecting specific action types"],
          ["NonNullable<T>", "Excludes null and undefined from T (T & {})", "Sanitizing optional parameters"],
          ["Parameters<T>", "Extracts tuple of function arguments", "Typing higher-order decorators and wrappers"],
          ["ReturnType<T>", "Extracts function return type (T extends (...args: any) => infer R ? R : any)", "Typing factory outputs and query results"],
          ["Awaited<T>", "Recursively unwraps Promise results", "Typing async data in TanStack Query"],
          ["NoInfer<T>", "Prevents TypeScript from using an argument for generic inference", "Forcing explicit generic type parameters"]
        ]
      },
      code: `// Practical Composition: Update User DTO
interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

// Omit sensitive/auto-generated fields, then make remaining fields optional:
type UpdateUserDto = Partial<Omit<UserEntity, "id" | "passwordHash" | "createdAt">> & {
  currentPassword?: string;
};`
    }
  ]
});

// ==========================================
// PHASE 3: ADVANCED TYPE SYSTEM & ARCHITECTURE
// ==========================================

// SECTION 12 (Module 12): Conditional Types & infer
sections.push({
  id: "mapped-conditional",
  number: "12",
  phase: 3,
  title: "Conditional Types & The 'infer' Pattern Matching Engine",
  summary: "Type-level branching using T extends U ? X : Y, distributive conditional types over naked unions, preventing distribution, and infer pattern matching.",
  subsections: [
    {
      id: "12.0",
      title: "12.0 Conditional Types & Distributive Law",
      content: `A **Conditional Type** selects one of two possible types based on a subtyping relationship: \`T extends U ? TrueType : FalseType\`.

### Distributive Conditional Types
When a conditional type acts on a **naked type parameter \`T\`**, it automatically distributes over unions:
\`(A | B) extends U ? X : Y\` expands into \`(A extends U ? X : Y) | (B extends U ? X : Y)\`.

### Preventing Distribution
To prevent distribution, wrap the type parameter in a tuple: \`[T] extends [U] ? X : Y\`.`,
      code: `// Distributive behavior in action (Reimplementing Exclude):
type MyExclude<T, U> = T extends U ? never : T;

type Status = "ACTIVE" | "INACTIVE" | "PENDING";
type ActiveOnly = MyExclude<Status, "INACTIVE" | "PENDING">;
// Expands to:
// ("ACTIVE" extends "INACTIVE" | "PENDING" ? never : "ACTIVE") |
// ("INACTIVE" extends ... ? never : "INACTIVE") | ...
// Evaluates to: "ACTIVE" | never | never => "ACTIVE"!`
    },
    {
      id: "12.1",
      title: "12.1 The 'infer' Keyword: Type-Level Pattern Matching",
      content: `The \`infer\` keyword introduces a type variable inside the condition to be extracted via pattern matching:`,
      code: `// 1. Unpack Promise return type (Reimplementing Awaited):
type UnpackPromise<T> = T extends Promise<infer U> ? UnpackPromise<U> : T;

type DeepPromise = Promise<Promise<string>>;
type Result = UnpackPromise<DeepPromise>; // string

// 2. Extract Array Element Type:
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type Item = ArrayElement<number[]>; // number

// 3. Extract Function Return Type:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`
    }
  ]
});

// SECTION 13 (Module 13): Mapped Types & Template Literal Types
sections.push({
  id: "mapped-template-literals",
  number: "13",
  phase: 3,
  title: "Mapped Types, Key Remapping & Template Literal Types",
  summary: "Iterating over keys with in keyof, modifier manipulation (+readonly, -readonly, -?), key remapping with as, and template literal type construction.",
  subsections: [
    {
      id: "13.0",
      title: "13.0 Mapped Types & Modifiers (+/-, readonly, ?)",
      content: `A **Mapped Type** creates a new object type by iterating through a union of keys (typically using \`keyof\`). You can add (\`+\`) or remove (\`-\`) \`readonly\` and optional (\`?\`) modifiers:`,
      code: `// Make every property required and mutable (stripping readonly and optional):
type MutableRequired<T> = {
  -readonly [K in keyof T]-?: T[K];
};

interface ReadonlyConfig {
  readonly endpoint?: string;
  readonly retries?: number;
}

type EditableConfig = MutableRequired<ReadonlyConfig>;
// Result: { endpoint: string; retries: number; }`
    },
    {
      id: "13.1",
      title: "13.1 Key Remapping with 'as' & Template Literal Types",
      content: `TypeScript 4.1 introduced **Template Literal Types**, enabling string concatenation at the type level. Combined with key remapping (\`as\`), you can generate type-safe getter/setter interfaces:`,
      code: `type Person = {
  name: string;
  age: number;
};

// Generate getters: "getName", "getAge"
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// Evaluates to:
// {
//   getName: () => string;
//   getAge: () => number;
// }`
    }
  ]
});

// SECTION 14 (Module 14): Enums vs Literal Unions & as const
sections.push({
  id: "enums-literal-unions",
  number: "14",
  phase: 3,
  title: "Enums, Literal Unions & as const Objects: Production Trade-offs",
  summary: "Comprehensive architectural comparison: numeric vs string enums, const enums, runtime code emission, and why as const literal unions are modern best practice.",
  subsections: [
    {
      id: "14.0",
      title: "14.0 Enums vs Literal Unions Architectural Comparison",
      content: `Enums are one of the very few TypeScript features that **emit real runtime JavaScript code** rather than being erased.

| Aspect | String / Numeric Enums | \`as const\` Object Literal Union |
| :--- | :--- | :--- |
| **Runtime Emission** | Emits an IIFE and two-way lookup object | Emits a simple, clean, frozen JS object |
| **Tree-Shaking** | Poor: IIFE causes bundler de-optimization | Excellent: Clean object literal tree-shaking |
| **API Boundary Safety** | Numeric enums allow arbitrary numbers | Only exact literal strings are permitted |
| **Modern Best Practice** | Discouraged by TS Core team for new code | **Recommended Standard** |`,
      code: `// ❌ LEGACY ENUM: Emits runtime IIFE bloat
enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

// ✅ MODERN PRODUCTION PATTERN: 'as const' Object + Derived Union Type
const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  AUDITOR: "AUDITOR"
} as const;

// Derive union type: "ADMIN" | "USER" | "AUDITOR"
type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

function assignRole(role: UserRoleType) {
  console.log("Assigned role:", role);
}

assignRole(USER_ROLES.ADMIN); // Valid
assignRole("ADMIN");          // Valid! Native structural compatibility`
    }
  ]
});

// SECTION 15 (Module 15): Classes, Access Modifiers & OOP
sections.push({
  id: "classes-modifiers",
  number: "15",
  phase: 3,
  title: "Classes, Access Modifiers & Encapsulation in TypeScript",
  summary: "OOP mechanics in TypeScript: public, protected, private, TypeScript private vs JavaScript #private, parameter properties, abstract classes, and the override keyword.",
  subsections: [
    {
      id: "15.0",
      title: "15.0 TypeScript 'private' vs JavaScript '#private' (The Hard Privacy Trap)",
      content: `A crucial distinction in TypeScript OOP:
- **TypeScript \`private\`**: Enforced **only at compile time**. At runtime, the property is fully public and accessible via \`obj["secret"]\`!
- **JavaScript \`#private\` (Private Identifier)**: Enforced **at the V8 runtime engine level** using private brand checks. Truly inaccessible outside the class body.`,
      code: `class Vault {
  private softSecret: string = "ts-private-123";
  #hardSecret: string = "v8-private-456";

  reveal() {
    return this.#hardSecret;
  }
}

const vault = new Vault();
// (vault as any).softSecret; // ⚠️ Works at runtime! TS private is erased!
// vault.#hardSecret;         // 💥 SyntaxError at runtime: Private field '#hardSecret' must be declared in enclosing class`
    },
    {
      id: "15.1",
      title: "15.1 Abstract Classes, Parameter Properties & override Keyword",
      content: `Parameter properties allow you to declare and initialize class fields directly in the constructor signature:`,
      code: `abstract class BasePaymentProcessor {
  // Parameter Property: auto-declares and initializes 'this.apiKey'
  constructor(protected readonly apiKey: string) {}

  abstract process(amount: number): Promise<boolean>;

  logTransaction(txId: string) {
    console.log(\`[\${this.constructor.name}] Logged: \${txId}\`);
  }
}

class StripeProcessor extends BasePaymentProcessor {
  // 'override' ensures the method exists on the parent class:
  override async process(amount: number): Promise<boolean> {
    console.log("Charging via Stripe with key:", this.apiKey.slice(0, 4) + "...");
    return true;
  }
}`
    }
  ]
});

// SECTION 16 (Module 16): Modules, Ambient Declarations & .d.ts
sections.push({
  id: "modules-imports",
  number: "16",
  phase: 3,
  title: "Modules, Ambient Declarations (.d.ts) & Module Augmentation",
  summary: "ES modules, import type vs import, ambient declaration files, writing types for untyped JS libraries, declaration merging, and module augmentation.",
  subsections: [
    {
      id: "16.0",
      title: "16.0 'import type' and Type-Only Imports",
      content: `Using \`import type\` guarantees that the imported symbol is **100% erased** from emitted JavaScript. This prevents accidental circular runtime dependency cycles and ensures bundlers do not retain unused modules:`,
      code: `// Type-only import (Always erased):
import type { UserProfile, OrderData } from "./models";

// Inline type import (TS 4.5+):
import { calculateTotal, type TaxRate } from "./taxEngine";`
    },
    {
      id: "16.1",
      title: "16.1 Ambient Declarations (.d.ts) & Module Augmentation",
      content: `When integrating third-party JavaScript libraries that lack type definitions, you author ambient declarations in a \`.d.ts\` file:`,
      code: `// types/untyped-analytics.d.ts
declare module "untyped-analytics" {
  export interface AnalyticsEvent {
    eventName: string;
    properties: Record<string, any>;
  }

  export function track(event: AnalyticsEvent): void;
  export function init(apiKey: string): void;
}

// Module Augmentation: Adding custom properties to Express Request
import "express";

declare module "express" {
  export interface Request {
    tenantId?: string;
    authenticatedUser?: { id: string; role: string };
  }
}`
    }
  ]
});

// SECTION 17 (Module 17): Asynchronous TypeScript & Error Handling
sections.push({
  id: "async-errors",
  number: "17",
  phase: 3,
  title: "Asynchronous TypeScript, Promises, Catch Typing & Result Pattern",
  summary: "Typing async/await, Promise<T>, Awaited<T>, why catch blocks type errors as unknown, and the type-safe Result<T, E> error handling pattern.",
  subsections: [
    {
      id: "17.0",
      title: "17.0 The Catch Block Trap: 'unknown' vs 'any'",
      content: `In JavaScript, anything can be thrown (\`throw "bad"\`, \`throw 404\`, \`throw null\`). Therefore, in TypeScript with \`useUnknownInCatchVariables: true\` (included in \`strict\`), the error in a catch clause is **always typed as \`unknown\`**:`,
      code: `async function fetchUserData(userId: string) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    return await res.json();
  } catch (err: unknown) {
    // ❌ err.message is not allowed directly because err could be anything!
    
    // ✅ Safe Narrowing:
    if (err instanceof Error) {
      console.error("Standard error message:", err.message);
    } else {
      console.error("Non-standard thrown value:", String(err));
    }
    throw err;
  }
}`
    },
    {
      id: "17.1",
      title: "17.1 The Discriminated Result Pattern (Result<T, E>)",
      content: `Instead of throwing exceptions that escape type contracts, senior architectures use the **Result Monad Pattern**:`,
      code: `type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseJsonSafe<T>(jsonStr: string): Result<T, SyntaxError> {
  try {
    const value = JSON.parse(jsonStr) as T;
    return { ok: true, value };
  } catch (err) {
    return { ok: false, error: err as SyntaxError };
  }
}

const outcome = parseJsonSafe<{ token: string }>('{"token": "xyz"}');
if (outcome.ok) {
  console.log("Token:", outcome.value.token);
} else {
  console.error("Syntax error:", outcome.error.message);
}`
    }
  ]
});

// ==========================================
// PHASE 4: FULL-STACK PRODUCTION, TOOLING & DSA
// ==========================================

// SECTION 18 (Module 18): TypeScript with React
sections.push({
  id: "react-integration",
  number: "18",
  phase: 4,
  title: "TypeScript with React: Props, Hooks, Generic Components & Zustand",
  summary: "Comprehensive guide to React 19 typing: ComponentProps, ReactNode vs JSX.Element, generic components, typing custom hooks, and type-safe Zustand stores.",
  subsections: [
    {
      id: "18.0",
      title: "18.0 React Component Props & ReactNode vs JSX.Element",
      content: `Understanding the React return type hierarchy:
- **\`React.ReactNode\`**: Represents anything that can be rendered inside JSX (strings, numbers, booleans, null, undefined, React elements, fragments, arrays of nodes). **Use this for the \`children\` prop!**
- **\`JSX.Element\`**: Represents a single instantiated React element (the return value of \`React.createElement\`).`,
      code: `import React, { ReactNode } from "react";

interface CardProps {
  title: string;
  badge?: string;
  children: ReactNode; // ✅ Correct type for children
  onAction?: (actionId: string) => void;
}

export function Card({ title, badge, children, onAction }: CardProps): React.JSX.Element {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <div className="card-body">{children}</div>
      {onAction && <button onClick={() => onAction("primary")}>Proceed</button>}
    </div>
  );
}`
    },
    {
      id: "18.1",
      title: "18.1 Generic React Components",
      content: `Generic components allow parent components to pass arrays of arbitrary items while maintaining exact type safety in render callbacks:`,
      code: `interface SelectListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
}

export function SelectList<T>({ items, keyExtractor, renderItem, onSelect }: SelectListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)} onClick={() => onSelect(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}`
    },
    {
      id: "18.2",
      title: "18.2 Type-Safe Zustand State Store",
      content: `Typing Zustand state and actions with atomic selectors:`,
      code: `import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  login: (user: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));`
    }
  ]
});

// SECTION 19 (Module 19): TypeScript with Node.js & NestJS
sections.push({
  id: "node-nestjs-integration",
  number: "19",
  phase: 4,
  title: "TypeScript with Node.js & NestJS: DTOs, Decorators & Validation",
  summary: "Backend engineering: DTO classes vs interfaces, class-validator decorators, dependency injection typing, and strict runtime payload validation.",
  subsections: [
    {
      id: "19.0",
      title: "19.0 DTO Classes vs Interfaces in NestJS",
      content: `In NestJS, **Data Transfer Objects (DTOs) MUST be declared as Classes, NOT Interfaces**.
Why? Because interfaces are erased at compile time! A class creates a runtime constructor function that preserves decorator metadata for NestJS reflection and \`ValidationPipe\`.`,
      code: `import { IsEmail, IsString, IsInt, Min, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(64)
  fullName!: string;

  @IsInt()
  @Min(18)
  age!: number;
}`
    }
  ]
});

// SECTION 20 (Module 20): Databases, API Contracts & Serialization
sections.push({
  id: "databases-api-contracts",
  number: "20",
  phase: 4,
  title: "Databases, API Contracts & Preventing Type Drift",
  summary: "Database entity typing, nullable vs optional columns, shared type packages in monorepos, and contract-driven API development.",
  subsections: [
    {
      id: "20.0",
      title: "20.0 Nullable Columns vs Optional Properties in Databases",
      content: `A critical database data modeling rule:
- **Optional Property (\`prop?: string\`)**: The key may be omitted from the object payload (typically in an update DTO).
- **Nullable Property (\`prop: string | null\`)**: The key MUST be present, but its value in the database column is SQL NULL.`,
      code: `interface SqlOrderRecord {
  id: string;                      // PRIMARY KEY NOT NULL
  customer_id: string;             // FOREIGN KEY NOT NULL
  discount_code: string | null;    // NULLABLE COLUMN (Can be null in SQL)
  notes: string | null;            // NULLABLE COLUMN
}

// Updating an order:
interface PatchOrderDto {
  discount_code?: string | null;   // Can omit, or explicitly pass null to clear!
}`
    }
  ]
});

// SECTION 21 (Module 21): Compiler Internals, Variance & Assignability
sections.push({
  id: "compiler-internals-variance",
  number: "21",
  phase: 4,
  title: "Compiler Internals, Variance & Assignability Rules",
  summary: "Structural assignability algorithms, covariance vs contravariance in function parameters, strictFunctionTypes, and @ts-expect-error vs @ts-ignore.",
  subsections: [
    {
      id: "21.0",
      title: "21.0 Covariance vs Contravariance (strictFunctionTypes)",
      content: `Variance describes how subtyping between more complex types relates to subtyping between their components:
- **Covariance (Same Direction)**: Return types are covariant. If Dog extends Animal, \`() => Dog\` is assignable to \`() => Animal\`.
- **Contravariance (Opposite Direction)**: Function parameters are **contravariant** under \`strictFunctionTypes\`. If Dog extends Animal, \`(a: Animal) => void\` is assignable to \`(d: Dog) => void\`.`,
      code: `class Animal { name = "Animal"; }
class Dog extends Animal { bark() {} }

let handleAnimal = (a: Animal) => { console.log(a.name); };
let handleDog = (d: Dog) => { d.bark(); };

// Under strictFunctionTypes:
handleDog = handleAnimal; // ✅ Valid! handleAnimal can safely process any Dog (because a Dog is an Animal).
// handleAnimal = handleDog; // ❌ Compile Error! handleDog might call d.bark() on an Animal that is not a Dog!`
    },
    {
      id: "21.1",
      title: "21.1 @ts-expect-error vs @ts-ignore",
      content: `Never use \`@ts-ignore\` in production code!
- **\`@ts-ignore\`**: Silently suppresses errors. If the code is later refactored and no longer produces an error, \`@ts-ignore\` remains silently dead in the codebase.
- **\`@ts-expect-error\`**: Explicitly asserts that the next line MUST trigger a type error. If the error is fixed, the compiler throws an error alerting you to remove the directive!`,
      code: `// ✅ Best practice in unit tests verifying negative type test cases:
// @ts-expect-error: Verifying that invalid currency is rejected at compile-time
processPayment("INVALID_CURRENCY");`
    }
  ]
});

// SECTION 22 (Module 22): Runtime Validation & Branded Types
sections.push({
  id: "api-validation",
  number: "22",
  phase: 4,
  title: "Runtime Validation, Type Erasure & Branded Types",
  summary: "Why type erasure demands runtime boundaries, parsing with Zod/Valibot, and implementing nominal typing with Branded/Tagged types.",
  subsections: [
    {
      id: "22.0",
      title: "22.0 Nominal Typing with Branded / Tagged Types",
      content: `TypeScript uses structural typing, meaning any two string types are interchangeable. This leads to subtle domain bugs (e.g. passing an \`OrderId\` where a \`UserId\` was expected).

**Branded Types** (also called Nominal Types) simulate nominal typing by intersecting a primitive with a phantom brand object:`,
      code: `// Declare Brand Type
type Brand<K, T> = K & { readonly __brand: T };

export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;

// Constructor Helper Functions
function makeUserId(id: string): UserId {
  return id as UserId;
}

function makeOrderId(id: string): OrderId {
  return id as OrderId;
}

function cancelOrder(userId: UserId, orderId: OrderId) {
  console.log(\`User \${userId} cancelled order \${orderId}\`);
}

const user = makeUserId("usr_999");
const order = makeOrderId("ord_123");

cancelOrder(user, order); // ✅ Valid!
// cancelOrder(order, user); 
// ❌ Compile Error! Type 'OrderId' is not assignable to type 'UserId'.`
    }
  ]
});

// SECTION 23 (Module 23): Testing & Developer Tooling
sections.push({
  id: "interview-traps",
  number: "23",
  phase: 4,
  title: "Testing, Tooling, ESLint & CI/CD Type Checking",
  summary: "Testing TypeScript applications with Vitest, typing mocks and spies, ESLint strict type-checked configs, and CI/CD validation without emit.",
  subsections: [
    {
      id: "23.0",
      title: "23.0 Type Checking vs Unit Testing in CI Pipelines",
      content: `Unit tests test behavior; the TypeScript compiler tests contracts. A robust production CI pipeline must separate both:`,
      code: `// Package.json Scripts:
// "typecheck": "tsc --noEmit",
// "test": "vitest run",
// "lint": "eslint . --max-warnings 0"

// Mocking typed API in Vitest:
import { vi, test, expect } from "vitest";
import * as api from "./userService";

test("fetches user by id with full type safety", async () => {
  const spy = vi.spyOn(api, "fetchUser").mockResolvedValue({
    id: "u1",
    email: "test@example.com"
  });

  const res = await api.fetchUser("u1");
  expect(res.email).toBe("test@example.com");
  expect(spy).toHaveBeenCalledWith("u1");
});`
    }
  ]
});

// SECTION 24 (Module 24): Study Order, Revision Checkpoints & Coding DSA
sections.push({
  id: "study-order-checkpoints",
  number: "24",
  phase: 4,
  title: "Recommended Study Order, Revision Checkpoints & Coding DSA",
  summary: "Interactive 6-session mastery roadmap, 10 executive revision checkpoints with revealable answers, and core DSA patterns in TypeScript.",
  subsections: [
    {
      id: "24.0",
      title: "24.0 Interactive 6-Session Mastery Study Order",
      sessions: [
        { id: "ts-session-1", title: "Session 1: Foundations & The Type Checker", topics: "Modules 1–4: Type superset, tsconfig strict flags, primitives, any vs unknown vs never, satisfies, literal widening." },
        { id: "ts-session-2", title: "Session 2: Object Modeling & Structural Typing", topics: "Modules 5–6: Discriminated unions, type aliases vs interfaces, declaration merging, excess property checks." },
        { id: "ts-session-3", title: "Session 3: Functions, Guards & Generics", topics: "Modules 7–11: Overloads, parameter contravariance, type predicates (is), generic constraints, built-in utility types." },
        { id: "ts-session-4", title: "Session 4: Advanced Metaprogramming", topics: "Modules 12–14: Conditional types, distributive law, infer pattern matching, mapped types, template literals, as const." },
        { id: "ts-session-5", title: "Session 5: OOP, Modules & Asynchronous TS", topics: "Modules 15–17: TS private vs #private, abstract classes, import type, .d.ts ambient files, Result pattern." },
        { id: "ts-session-6", title: "Session 6: Full Stack Architecture & Screening", topics: "Modules 18–24: React 19 props/hooks, NestJS DTOs, Zod parsing, branded types, interview output prediction & algorithms." }
      ]
    },
    {
      id: "24.1",
      title: "24.1 10 Executive Revision Checkpoints",
      checkpoints: [
        { q: "Why is TypeScript unable to validate incoming API data at runtime?", ans: "Because TypeScript compiles via type erasure: all types, interfaces, and type aliases are completely stripped from emitted JavaScript. The V8 engine only sees plain JavaScript, so runtime schema parsers like Zod are strictly mandatory." },
        { q: "What is the practical difference between 'any' and 'unknown'?", ans: "'any' completely disables the type checker and allows all operations without verification. 'unknown' is a safe top type: you can assign anything to it, but you cannot perform any operations until you narrow it via typeof, instanceof, or a type guard." },
        { q: "What does 'never' represent and where is it used in production?", ans: "'never' is the empty bottom type representing values that can never occur. It is used to type functions that unconditionally throw or loop forever, and in the default branch of a switch statement to enforce compile-time exhaustive checking." },
        { q: "How does the 'satisfies' operator differ from a type annotation?", ans: "A type annotation upcasts and widens the expression to the declared type, losing specific literal or union member information. 'satisfies' validates that the expression conforms to the type contract while preserving the exact inferred literal types." },
        { q: "What is a Discriminated Union and why is it preferred over optional fields?", ans: "A Discriminated Union is a union of object types sharing a common literal property (e.g. status: 'SUCCESS' | 'ERROR'). It makes invalid state combinations impossible and allows TypeScript's control-flow analysis to narrow member properties automatically." },
        { q: "Why does assigning an object literal directly to a function trigger an error, but passing a pre-assigned variable does not?", ans: "Direct object literals trigger Excess Property Checking to catch typos. Pre-assigned variables are evaluated under standard Structural Typing (Duck Typing), where additional properties are permitted as long as required members exist." },
        { q: "What is the difference between TypeScript's 'private' and JavaScript's '#private'?", ans: "TypeScript's 'private' keyword is purely a compile-time restriction; the field is fully public and accessible at runtime. JavaScript's '#private' field is enforced by the V8 runtime engine and throws a syntax error if accessed outside the class." },
        { q: "What are Distributive Conditional Types and how do you prevent distribution?", ans: "When a conditional type acts on a naked type parameter T (e.g. T extends U ? X : Y), it automatically distributes over union members. To prevent distribution, wrap both sides in square brackets: [T] extends [U] ? X : Y." },
        { q: "What is the difference between '@ts-expect-error' and '@ts-ignore'?", ans: "'@ts-ignore' unconditionally suppresses errors. '@ts-expect-error' asserts that a compiler error must occur on the next line; if the line ceases to produce an error, the compiler flags an unused suppression directive." },
        { q: "What are Branded / Nominal Types and what problem do they solve?", ans: "Branded types intersect primitives with a unique tag (e.g. string & { __brand: 'UserId' }). They prevent accidental swapping of semantically distinct strings or numbers (like passing an OrderId to a function expecting a UserId) under a structural type system." }
      ]
    }
  ]
});

console.log(`Writing full 24 modules to typescriptNotesData.js... Total sections: ${sections.length}`);

const fileContent = `// TypeScript Master Notes
// Foundation Finance Company · Full Stack Developer / SDE Screening Preparation
// Complete 24 Sections across 4 Learning Phases conforming strictly to AGENTS.md

export const TS_NOTES_METADATA = ${JSON.stringify(TS_NOTES_METADATA, null, 2)};

export const TS_SECTIONS = ${JSON.stringify(sections, null, 2)};
`;

const targetPath = path.resolve(__dirname, '../src/typescript/data/typescriptNotesData.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`Successfully generated and written 24 modules to ${targetPath}`);
