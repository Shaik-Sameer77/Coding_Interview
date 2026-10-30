// scratch/generate_ts_notes.cjs
// Generator for Comprehensive 24-Module TypeScript Master Notes adhering to AGENTS.md

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

// We will construct the 24 modules with full technical depth
const sections = [];

// SECTION 1 (Module 1): Introduction to TypeScript & The Typed Superset
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
        text: "Senior Note: Bundlers like Vite, esbuild, and SWC only perform Phase 4 (Transpilation/Type Erasure) for blazing speed. They do NOT run Phase 3 (Type Checker). Always run 'tsc --noEmit' in CI/CD pipelines to guarantee type safety!"
      }
    }
  ]
});

// SECTION 2 (Module 2): Environment & tsconfig.json Configuration
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

// Write to a temporary check file and log
console.log(`Generated first 6 modules. Total sections currently: ${sections.length}`);

// We will export the function or save the batch
module.exports = { TS_NOTES_METADATA, sections };
