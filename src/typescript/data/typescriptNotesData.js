// TypeScript Master Notes
// Foundation Finance Company · Full Stack Developer / SDE Screening Preparation
// Complete 24 Sections across 4 Learning Phases conforming strictly to AGENTS.md

export const TS_NOTES_METADATA = {
  "title": "TypeScript Master Curriculum & Engineering Notes",
  "subtitle": "Comprehensive Foundations to Senior / Staff Architecture & Client Screening Preparation",
  "level": "Foundations → Intermediate → Advanced Type-System Mechanics → Full-Stack Production (React 19 / NestJS / Zod)",
  "purpose": "Rebuilding TypeScript from first principles: mastering static type contracts, V8 compiler type erasure, structural variance, recursive type-level metaprogramming, and production full-stack engineering.",
  "phases": [
    {
      "number": 1,
      "title": "Foundations & Core Mechanics",
      "desc": "Superset model, tsconfig strictness, primitives, inference, contextual typing, unions & structural typing"
    },
    {
      "number": 2,
      "title": "Functions, Narrowing & Generics",
      "desc": "Function variance, control-flow type guards, type predicates, generic constraints & built-in utility types"
    },
    {
      "number": 3,
      "title": "Advanced Type System & Architecture",
      "desc": "Conditional types, infer, mapped types, template literals, enums vs const assertions, classes & declaration files"
    },
    {
      "number": 4,
      "title": "Full-Stack Production, Tooling & DSA",
      "desc": "React 19 typing, NestJS DTOs, Zod schema parsing, branded types, compiler internals & interview coding"
    }
  ]
};

export const TS_SECTIONS = [
  {
    "id": "what-is-ts",
    "number": "1",
    "phase": 1,
    "title": "Introduction to TypeScript & The Typed Superset",
    "summary": "The nature of TypeScript as a static compile-time type system over dynamic JavaScript, the compiler pipeline, AST type checking, and the non-negotiable reality of runtime type erasure.",
    "subsections": [
      {
        "id": "1.0",
        "title": "1.0 Topic Overview & Beginner Mental Model",
        "content": "### What is TypeScript?\nTypeScript is an open-source, statically typed superset of JavaScript developed and maintained by Microsoft. \"Superset\" means that **every valid JavaScript program is syntactically valid TypeScript**. TypeScript extends JavaScript by adding an optional, static type system and rich developer tooling.\n\n### The Construction Blueprint Analogy\nThink of raw JavaScript as building a bridge where you assemble girders, pour concrete, and test weight limits only after cars start driving across it. If an engineer accidentally specified a wooden beam instead of steel, the bridge fails catastrophically in production (a runtime `TypeError: cannot read properties of undefined`).\n\nTypeScript acts as the **architectural blueprint and stress-testing simulation software**. It analyzes structural integrity, cross-references material load ratings, and verifies connections on the computer screen before a single ounce of concrete is poured. If there is a mismatch, the simulation halts with a red alert (compile error). Crucially, once construction completes, the digital blueprint is filed away—only the physical bridge remains. Similarly, **TypeScript types are completely erased during compilation; only JavaScript executes in Node.js or the browser**.",
        "bulletPoints": [
          "Statically Typed: Types are checked during development and build time, not while the code is running.",
          "Syntactic Superset: Valid JavaScript code runs inside a TypeScript environment without syntax changes.",
          "Tooling Powerhouse: Powers modern IDE features including semantic autocompletion, instant jump-to-definition, and project-wide safe refactoring."
        ]
      },
      {
        "id": "1.1",
        "title": "1.1 Static Checking vs Runtime Validation (Critical Distinction)",
        "content": "A frequent source of senior engineering interview failures is confusing **Compile-Time Type Checking** with **Runtime Data Validation**.\n\n| Feature | TypeScript Compile-Time Checking | Runtime Schema Validation (Zod, Valibot) |\n| :--- | :--- | :--- |\n| **Execution Moment** | During development (IDE) and build step (`tsc`) | While the application is actively running in production |\n| **Performance Cost** | Zero runtime CPU/RAM cost (types are erased) | Minor CPU parsing cost per incoming network request |\n| **Protection Scope** | Internal developer mistakes, typos, refactoring errors | Malicious payloads, corrupted database rows, external API drift |\n| **Output** | Emitted JavaScript or compiler diagnostic errors | Parsed JavaScript object or thrown validation error |",
        "code": "// ❌ UNPROTECTED: TypeScript types cannot validate incoming network JSON!\ninterface UserProfile {\n  id: string;\n  email: string;\n  age: number;\n}\n\n// At runtime, an API client could send: { \"id\": 123, \"email\": null }\napp.post(\"/users\", (req, res) => {\n  const user = req.body as UserProfile; // UNSAFE CAST!\n  // At runtime, user.email.toLowerCase() throws: TypeError: Cannot read properties of null!\n});\n\n// ✅ PRODUCTION SECURE: Combine TS contracts with runtime schema parsers (e.g. Zod)\nimport { z } from \"zod\";\n\nconst UserProfileSchema = z.object({\n  id: z.string().uuid(),\n  email: z.string().email(),\n  age: z.number().int().min(18)\n});\n\ntype UserProfileFromSchema = z.infer<typeof UserProfileSchema>;\n\napp.post(\"/users\", (req, res) => {\n  const result = UserProfileSchema.safeParse(req.body);\n  if (!result.success) {\n    return res.status(400).json({ errors: result.error.flatten() });\n  }\n  const validUser: UserProfileFromSchema = result.data; // 100% type-safe at runtime!\n  console.log(validUser.email.toLowerCase());\n});",
        "interviewAnswer": "TypeScript is a compile-time static type system that operates via type erasure. Its types exist solely to verify program correctness during development and build phases. Because emitted JavaScript contains zero type information, TypeScript cannot validate untrusted runtime boundaries—such as HTTP request bodies, database query results, or third-party webhooks. Production systems must pair TypeScript types with runtime schema validation libraries like Zod."
      },
      {
        "id": "1.2",
        "title": "1.2 TypeScript Compiler Pipeline & Internal Mechanics",
        "content": "### How the TypeScript Compiler (`tsc`) Works Internally\nWhen you run `tsc`, the compiler executes a multi-phase compilation pipeline:\n\n1. **Scanner & Parser**: Reads raw text characters from `.ts` files, generates tokens, and builds an Abstract Syntax Tree (AST).\n2. **Binder**: Traverses the AST and constructs the Symbol Table, creating associations between identifiers and their declarations (Scopes, Interfaces, Classes).\n3. **Type Checker**: The computational heart of TypeScript. It verifies assignability, checks constraints, resolves generics, evaluates conditional types, and enforces variance rules. If errors exist, diagnostics are emitted.\n4. **Emitter**: Transforms the AST into target JavaScript (e.g. ES2022) by stripping all type annotations, interfaces, and type aliases. It also emits declaration files (`.d.ts`) and source maps (`.js.map`) if configured.",
        "table": {
          "headers": [
            "Pipeline Phase",
            "Internal Component",
            "Output / Responsibility"
          ],
          "rows": [
            [
              "Phase 1: Lexing & Parsing",
              "Scanner + Parser",
              "AST (Abstract Syntax Tree) containing syntax nodes"
            ],
            [
              "Phase 2: Binding",
              "Binder",
              "Symbol Table mapping variables, functions, and scopes"
            ],
            [
              "Phase 3: Verification",
              "Type Checker",
              "Diagnostics (type error list) and type resolution cache"
            ],
            [
              "Phase 4: Transformation",
              "Emitter",
              "Clean .js code (types erased), optional .d.ts, and .map files"
            ]
          ]
        },
        "code": "// TypeScript Source:\ninterface Order {\n  id: string;\n  total: number;\n}\nfunction calculateTax(order: Order, taxRate: number): number {\n  return order.total * taxRate;\n}\n\n// Emitted JavaScript (Target: ES2022) — Notice complete erasure of 'interface' and types:\nfunction calculateTax(order, taxRate) {\n  return order.total * taxRate;\n}",
        "callout": {
          "type": "tip",
          "text": "Senior Note: Modern bundlers like Vite, esbuild, and SWC only perform Phase 4 (Transpilation/Type Erasure) for blazing speed. They do NOT run Phase 3 (Type Checker). Always run 'tsc --noEmit' in CI/CD pipelines to guarantee type safety!"
        }
      }
    ]
  },
  {
    "id": "compilation-environment",
    "number": "2",
    "phase": 1,
    "title": "Environment, Compilation & tsconfig.json Deep Dive",
    "summary": "Comprehensive guide to tsconfig.json compiler options, strictness flags, module resolution, project references, and transpile-only tooling.",
    "subsections": [
      {
        "id": "2.0",
        "title": "2.0 Critical tsconfig.json Compiler Options",
        "content": "The `tsconfig.json` file instructs the TypeScript compiler how to parse files, enforce type strictness, and emit JavaScript artifacts. Setting up a production configuration requires understanding every major compiler option:",
        "table": {
          "headers": [
            "Option",
            "Recommended Production Value",
            "Architectural Purpose & Impact"
          ],
          "rows": [
            [
              "target",
              "\"ES2022\" or \"ESNext\"",
              "Determines which ECMAScript syntax features are preserved vs down-compiled to older syntax."
            ],
            [
              "module",
              "\"NodeNext\" or \"ESNext\"",
              "Controls the emitted module system (CommonJS vs ECMAScript Modules ESM)."
            ],
            [
              "moduleResolution",
              "\"NodeNext\" or \"Bundler\"",
              "Dictates how imports are resolved against node_modules and file extensions."
            ],
            [
              "strict",
              "true",
              "Enables the master suite of strict type checking rules (strictNullChecks, noImplicitAny, etc.)."
            ],
            [
              "strictNullChecks",
              "true (implied by strict)",
              "Differentiates 'null' and 'undefined' from concrete domain types."
            ],
            [
              "noUncheckedIndexedAccess",
              "true",
              "Adds 'undefined' to any dynamic array index or record access (e.g. arr[0] is T | undefined)."
            ],
            [
              "exactOptionalPropertyTypes",
              "true",
              "Distinguishes between a property being omitted vs explicitly assigned 'undefined'."
            ],
            [
              "noImplicitOverride",
              "true",
              "Forces the 'override' keyword on sub-class methods that override base class members."
            ],
            [
              "skipLibCheck",
              "true",
              "Skips type checking of external .d.ts files in node_modules, massively speeding up builds."
            ]
          ]
        },
        "code": "// Production-Grade tsconfig.json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"lib\": [\"ES2022\", \"DOM\", \"DOM.Iterable\"],\n    \n    /* Strict Type Checking */\n    \"strict\": true,\n    \"noImplicitAny\": true,\n    \"strictNullChecks\": true,\n    \"strictFunctionTypes\": true,\n    \"strictPropertyInitialization\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"exactOptionalPropertyTypes\": true,\n    \n    /* Emit & Build Hygiene */\n    \"noEmit\": true,\n    \"esModuleInterop\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"skipLibCheck\": true,\n    \"isolatedModules\": true\n  },\n  \"include\": [\"src/**/*\"],\n  \"exclude\": [\"node_modules\", \"dist\"]\n}"
      },
      {
        "id": "2.1",
        "title": "2.1 strictNullChecks and noUncheckedIndexedAccess in Practice",
        "content": "In standard JavaScript and non-strict TypeScript, `null` and `undefined` are assignable to every type. This was Tony Hoare's self-described \"Billion Dollar Mistake\". Enabling `strictNullChecks` eliminates an entire class of runtime panics.\n\nAdditionally, `noUncheckedIndexedAccess` protects against out-of-bounds array access:",
        "code": "// Without noUncheckedIndexedAccess:\nconst users: string[] = [\"Alice\", \"Bob\"];\nconst thirdUser = users[2]; // TypeScript infers 'string'!\nconsole.log(thirdUser.toUpperCase()); // 💥 RUNTIME CRASH: Cannot read properties of undefined!\n\n// With \"noUncheckedIndexedAccess\": true:\nconst safeUsers: string[] = [\"Alice\", \"Bob\"];\nconst safeThird = safeUsers[2]; // TypeScript infers 'string | undefined'!\n\n// Compiler forces narrowing:\nif (safeThird !== undefined) {\n  console.log(safeThird.toUpperCase()); // ✅ Safe to execute\n}",
        "interviewAnswer": "Enabling 'strict' in tsconfig activates critical type invariants like strictNullChecks, preventing null from masquerading as a valid string or object. For senior engineering projects, we also activate 'noUncheckedIndexedAccess'. This forces array lookups to evaluate to 'T | undefined', compelling developers to verify existence before dereferencing array elements."
      }
    ]
  },
  {
    "id": "basic-types",
    "number": "3",
    "phase": 1,
    "title": "Basic Types, Primitives, any, unknown, never & void",
    "summary": "Comprehensive guide to TypeScript's primitive types, special top and bottom types, literal types, tuples, const assertions, and the differences between object, Object, and {}.",
    "subsections": [
      {
        "id": "3.0",
        "title": "3.0 JavaScript Primitives vs TypeScript Top & Bottom Types",
        "content": "TypeScript includes all 7 JavaScript primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, and `undefined`.\n\nCrucially, TypeScript introduces four unique types that form the hierarchy of the type system:\n\n1. **`any` (The Escape Hatch)**: Disables the type checker entirely. Any operation is permitted. Contaminates every variable it touches.\n2. **`unknown` (The Safe Top Type)**: Represents any value, but **nothing can be done with it without narrowing first**.\n3. **`void`**: Represents the absence of a meaningful return value (functions that return with no value or return undefined).\n4. **`never` (The Bottom Type)**: Represents values that never occur. Used for functions that throw unconditionally or infinite loops, and in exhaustive checking.",
        "table": {
          "headers": [
            "Type",
            "Category",
            "Assign Any Value To It?",
            "Can Perform Arbitrary Ops?",
            "Safe for Production?"
          ],
          "rows": [
            [
              "any",
              "Top Type & Escape Hatch",
              "Yes",
              "Yes (No type checking)",
              "❌ Dangerous: disables compiler entirely"
            ],
            [
              "unknown",
              "Universal Top Type",
              "Yes",
              "No (Must narrow with typeof/instanceof)",
              "✅ Best practice for untrusted data"
            ],
            [
              "void",
              "Absence of Return Value",
              "No (only undefined)",
              "No",
              "✅ Standard for side-effect callbacks"
            ],
            [
              "never",
              "Universal Bottom Type",
              "No (Empty set ∅)",
              "No (Impossible value)",
              "✅ Essential for exhaustive switch checks"
            ]
          ]
        },
        "code": "// 'any' vs 'unknown' in Action:\nfunction handleUntrustedAny(data: any) {\n  data.triggerPayment(); // Compiles without error! If method doesn't exist: RUNTIME CRASH!\n}\n\nfunction handleUntrustedUnknown(data: unknown) {\n  // data.triggerPayment(); \n  // ❌ Compile Error: 'data' is of type 'unknown'.\n\n  // Must narrow first:\n  if (typeof data === \"object\" && data !== null && \"triggerPayment\" in data) {\n    (data as { triggerPayment: () => void }).triggerPayment(); // ✅ Safe\n  }\n}"
      },
      {
        "id": "3.1",
        "title": "3.1 'never' and Exhaustive Control-Flow Analysis",
        "content": "The `never` type represents an empty set of possible values. It enables compile-time exhaustive checking when handling discriminated unions:",
        "code": "type PaymentMethod = \"CREDIT_CARD\" | \"PAYPAL\" | \"CRYPTO\";\n\nfunction processPayment(method: PaymentMethod): string {\n  switch (method) {\n    case \"CREDIT_CARD\":\n      return \"Processing Stripe charge\";\n    case \"PAYPAL\":\n      return \"Redirecting to PayPal portal\";\n    case \"CRYPTO\":\n      return \"Generating web3 transaction payload\";\n    default: {\n      // If a developer adds a new payment method (e.g. \"APPLE_PAY\") and forgets this switch:\n      const exhaustiveCheck: never = method;\n      // ❌ Compile Error: Type 'string' is not assignable to type 'never'.\n      throw new Error(`Unhandled payment method: ${exhaustiveCheck}`);\n    }\n  }\n}"
      },
      {
        "id": "3.2",
        "title": "3.2 'object' vs 'Object' vs '{}' (The Interview Trap)",
        "content": "One of the most frequently asked TypeScript interview questions is the distinction between `object`, `Object`, and `{}`:\n\n- **`object` (lowercase)**: Represents any non-primitive value (anything where `typeof x !== \"string\" && typeof x !== \"number\"`, etc.). Arrays, functions, and objects are assignable to `object`.\n- **`Object` (uppercase)**: The JavaScript Object constructor prototype interface. Includes primitive values with prototype methods (like numbers and strings).\n- **`{}` (empty object type)**: Represents **any non-nullish value**! In TypeScript, strings and numbers are assignable to `{}` because they have properties via boxing. Only `null` and `undefined` are not assignable.",
        "code": "let nonPrimitive: object;\nnonPrimitive = { key: \"value\" }; // ✅ Valid\nnonPrimitive = [1, 2, 3];        // ✅ Valid\n// nonPrimitive = 42;            // ❌ Error: Type 'number' is not assignable to type 'object'.\n\nlet emptyObject: {};\nemptyObject = { key: \"value\" }; // ✅ Valid\nemptyObject = \"Hello world\";     // ⚠️ Valid! Strings box into objects with properties.\n// emptyObject = null;           // ❌ Error: Type 'null' is not assignable to type '{}'.",
        "interviewAnswer": "'any' turns off the type checker entirely, while 'unknown' enforces type-safe handling by requiring explicit narrowing before any property access. 'never' represents the bottom type—a set with zero inhabitants—and is the standard idiom for compile-time exhaustive switch checks. For non-primitives, always use lowercase 'object', never '{}' or 'Object', which accept boxed primitives."
      }
    ]
  },
  {
    "id": "type-inference",
    "number": "4",
    "phase": 1,
    "title": "Type Inference, Contextual Typing, Widening & satisfies",
    "summary": "How TypeScript infers types without explicit annotations, literal widening, contextual typing in callbacks, const assertions, and the modern satisfies operator.",
    "subsections": [
      {
        "id": "4.0",
        "title": "4.0 Inference Mechanics & Literal Widening",
        "content": "TypeScript uses sophisticated heuristics to deduce types without requiring redundant annotations.\n\n### Variable Inference & Widening\n- When a variable is declared with `let` or `var`, TypeScript **widens** the type to its general primitive type (e.g. `\"USD\"` widens to `string`).\n- When declared with `const`, TypeScript preserves the **literal type** (e.g. `\"USD\"` remains type `\"USD\"`).",
        "code": "let currency = \"USD\"; \n// Inferred type: string (Widened, because 'let' can be reassigned to any string)\n\nconst baseCurrency = \"USD\"; \n// Inferred type: \"USD\" (Literal type preserved, cannot be reassigned)\n\n// Problem with object literal widening:\nconst config = {\n  endpoint: \"https://api.stripe.com/v1\",\n  method: \"POST\" // Inferred as 'string', NOT literal '\"POST\"'!\n};\n\nfunction sendRequest(url: string, method: \"GET\" | \"POST\") {}\n// sendRequest(config.endpoint, config.method);\n// ❌ Error: Argument of type 'string' is not assignable to parameter of type '\"GET\" | \"POST\"'.\n\n// Solution 1: 'as const' Assertion\nconst fixedConfig = {\n  endpoint: \"https://api.stripe.com/v1\",\n  method: \"POST\"\n} as const; // Freezes all properties to readonly literal types!\nsendRequest(fixedConfig.endpoint, fixedConfig.method); // ✅ Valid"
      },
      {
        "id": "4.1",
        "title": "4.1 Contextual Typing in Callbacks",
        "content": "In contextual typing, the type of an expression is inferred from its **location or context** in the AST rather than the expression alone. This is why you rarely need to type parameters in array callbacks:",
        "code": "const numbers = [10, 20, 30];\n\n// The type of 'num' is contextually inferred as 'number' based on 'numbers' array type:\nconst doubled = numbers.map(num => num * 2);\n\n// Contextual typing with DOM events:\nwindow.addEventListener(\"click\", event => {\n  // 'event' is contextually typed as 'MouseEvent'\n  console.log(event.clientX, event.clientY);\n});"
      },
      {
        "id": "4.2",
        "title": "4.2 The 'satisfies' Operator (TypeScript 4.9+)",
        "content": "The `satisfies` operator allows you to **validate that an expression matches a type or interface WITHOUT widening the inferred type**.\n\nBefore `satisfies`, assigning a type annotation to an object caused you to lose specific literal or union types:",
        "code": "type Palette = Record<string, string | [number, number, number]>;\n\n// ❌ With Type Annotation: Specific type information is lost\nconst badTheme: Palette = {\n  primary: \"#38bdf8\",\n  secondary: [59, 130, 246]\n};\n// badTheme.primary.toUpperCase(); \n// ❌ Compile Error: Property 'toUpperCase' does not exist on type 'string | [number, number, number]'.\n\n// ✅ With 'satisfies': Validates shape while retaining exact inferred literal types!\nconst goodTheme = {\n  primary: \"#38bdf8\",\n  secondary: [59, 130, 246]\n} satisfies Palette;\n\ngoodTheme.primary.toUpperCase(); // ✅ Valid! TS knows 'primary' is specifically 'string'.\ngoodTheme.secondary.map(v => v * 2); // ✅ Valid! TS knows 'secondary' is a tuple."
      }
    ]
  },
  {
    "id": "unions-intersections",
    "number": "5",
    "phase": 1,
    "title": "Union, Intersection & Discriminated Union Architectures",
    "summary": "Modeling domain state machines with discriminated unions, common property narrowing, intersection combinations, and eliminating impossible states.",
    "subsections": [
      {
        "id": "5.0",
        "title": "5.0 Discriminated Unions: Eliminating Impossible States",
        "content": "A **Discriminated Union** (also known as a Tagged Union or Algebraic Data Type) is a union of object types where each variant shares a common, literal discriminator property (e.g., `status` or `kind`).\n\n### The Anti-Pattern: The Kitchen-Sink State\nNovice engineers often model async state with a single interface containing multiple optional fields. This allows **impossible states** (e.g., `isLoading: true` while `data` is present and `error` is also populated!):",
        "code": "// ❌ ANTI-PATTERN: Allows invalid combinations\ninterface BadAsyncState<T> {\n  isLoading: boolean;\n  data?: T;\n  error?: string;\n}\n\n// ✅ SENIOR ARCHITECTURE: Discriminated Union\ntype AsyncState<T> =\n  | { status: \"IDLE\" }\n  | { status: \"LOADING\" }\n  | { status: \"SUCCESS\"; data: T; timestamp: number }\n  | { status: \"ERROR\"; error: Error; retryCount: number };\n\nfunction renderUI<T>(state: AsyncState<T>) {\n  switch (state.status) {\n    case \"IDLE\":\n      return \"Ready to fetch\";\n    case \"LOADING\":\n      return \"Loading spinner...\";\n    case \"SUCCESS\":\n      // TypeScript automatically narrows: 'data' is guaranteed to exist!\n      return `Fetched ${JSON.stringify(state.data)} at ${state.timestamp}`;\n    case \"ERROR\":\n      // TypeScript automatically narrows: 'error' and 'retryCount' exist!\n      return `Failed: ${state.error.message} (Retries: ${state.retryCount})`;\n  }\n}"
      },
      {
        "id": "5.1",
        "title": "5.1 Intersection Types (&) and Impossible Intersections",
        "content": "An **Intersection Type** combines multiple types into one. An object must satisfy all intersected types simultaneously.\n\n### The Impossible Intersection Trap\nIntersecting incompatible primitive types creates `never`:",
        "code": "type AdminUser = { id: string; role: \"ADMIN\" } & { permissions: string[] };\nconst admin: AdminUser = {\n  id: \"usr_1\",\n  role: \"ADMIN\",\n  permissions: [\"READ_LOGS\", \"DELETE_USER\"]\n};\n\n// Impossible Intersection:\ntype Impossible = string & number; // Evaluates to 'never'! No value can be both string and number."
      }
    ]
  },
  {
    "id": "interfaces-vs-types",
    "number": "6",
    "phase": 1,
    "title": "Type Aliases, Interfaces & Structural Typing Mechanics",
    "summary": "Comprehensive comparison between type aliases and interfaces, declaration merging, excess property checks, and TypeScript's structural type system.",
    "subsections": [
      {
        "id": "6.0",
        "title": "6.0 Type Aliases vs Interfaces: When to Choose Which",
        "content": "Both `type` and `interface` define shapes of objects, but they have distinct capabilities:\n\n| Feature | `interface` | `type` Alias |\n| :--- | :--- | :--- |\n| **Declaration Merging** | ✅ Yes: Re-declaring merges properties | ❌ No: Duplicate identifier error |\n| **Unions & Primitives** | ❌ Cannot define union types directly | ✅ Yes: `type ID = string | number` |\n| **Mapped Types** | ❌ Cannot be defined as interface | ✅ Yes: `type Readonly<T> = { ... }` |\n| **Extends / Intersection** | `interface B extends A` | `type B = A & { ... }` |\n| **Compiler Performance** | Slightly faster for flat object caches | Slightly slower for deeply nested intersections |",
        "code": "// Declaration Merging Example (Used extensively in .d.ts library augmentation):\ninterface ExpressRequest {\n  ip: string;\n}\n\n// In another file or middleware module:\ninterface ExpressRequest {\n  user?: { id: string; email: string }; // Automatically merged!\n}\n\nconst req: ExpressRequest = {\n  ip: \"127.0.0.1\",\n  user: { id: \"u1\", email: \"alex@example.com\" }\n};"
      },
      {
        "id": "6.1",
        "title": "6.1 Structural Typing vs Nominal Typing & Fresh Object Literal Checks",
        "content": "TypeScript uses **Structural Typing** (also called \"Duck Typing\"): two types are compatible if they possess compatible members, regardless of their declared names or class lineages.\n\n### The Excess Property Check Gotcha\nWhy does assigning an object literal directly throw an error when assigning an intermediate variable does not?",
        "code": "interface Point2D {\n  x: number;\n  y: number;\n}\n\nfunction renderPoint(pt: Point2D) {\n  console.log(pt.x, pt.y);\n}\n\n// ❌ DIRECT OBJECT LITERAL: Triggers Excess Property Checking!\n// renderPoint({ x: 10, y: 20, z: 30 });\n// Error: Object literal may only specify known properties, and 'z' does not exist in type 'Point2D'.\n\n// ✅ INTERMEDIATE VARIABLE: Governed by standard Structural Assignability\nconst point3D = { x: 10, y: 20, z: 30 };\nrenderPoint(point3D); // Valid! point3D has 'x' and 'y'. Additional properties are allowed."
      }
    ]
  },
  {
    "id": "functions-overloads",
    "number": "7",
    "phase": 2,
    "title": "Function Types, Overloads, this Parameters & Variance",
    "summary": "Comprehensive guide to typing functions, optional/rest parameters, call signatures, function overloads vs unions, explicit this typing, and parameter contravariance.",
    "subsections": [
      {
        "id": "7.0",
        "title": "7.0 Function Overloads vs Union Signatures",
        "content": "Function overloading in TypeScript allows you to define multiple type signatures that share a single implementation signature.\n\n### The Golden Rule of Overloads\nImplementation signatures are **internal to the function** and invisible to callers. Callers can only invoke overload signatures!",
        "code": "// Overload Signatures:\nfunction formatInput(input: string): string;\nfunction formatInput(input: number): number;\nfunction formatInput(input: boolean): string;\n\n// Implementation Signature (Must be compatible with all overloads):\nfunction formatInput(input: string | number | boolean): string | number {\n  if (typeof input === \"string\") return input.trim().toUpperCase();\n  if (typeof input === \"number\") return input * 100;\n  return input ? \"TRUE\" : \"FALSE\";\n}\n\nconst s = formatInput(\"hello\"); // Inferred type: string\nconst n = formatInput(42);      // Inferred type: number"
      },
      {
        "id": "7.1",
        "title": "7.1 Explicit 'this' Parameters & Function Compatibility",
        "content": "In JavaScript, `this` is dynamically bound at the call site. TypeScript allows you to type `this` as an explicit fake first parameter. This parameter is erased during compilation:",
        "code": "interface DatabaseClient {\n  query(sql: string): Promise<any[]>;\n}\n\n// 'this' parameter is type-checked but erased in emitted JS:\nfunction executeWithLogging(this: DatabaseClient, sql: string) {\n  console.log(\"Executing SQL:\", sql);\n  return this.query(sql); // Type-safe access to this.query!\n}"
      }
    ]
  },
  {
    "id": "narrowing-guards",
    "number": "8",
    "phase": 2,
    "title": "Type Narrowing, Control Flow Analysis & Type Predicates",
    "summary": "Deep dive into TypeScript's control-flow analysis, typeof, instanceof, the in operator, user-defined type predicates (is), and assertion functions (asserts).",
    "subsections": [
      {
        "id": "8.0",
        "title": "8.0 Built-in Narrowing Mechanisms (typeof, instanceof, in)",
        "content": "Control Flow Analysis (CFA) inspects your runtime branching conditions to narrow union types down to specific subtypes within each branch:",
        "code": "interface Dog { bark(): void; }\ninterface Cat { meow(): void; }\n\nfunction handlePet(pet: Dog | Cat | string) {\n  // 1. typeof narrowing:\n  if (typeof pet === \"string\") {\n    return pet.toUpperCase();\n  }\n\n  // 2. 'in' operator narrowing:\n  if (\"bark\" in pet) {\n    pet.bark(); // TS knows pet is Dog\n  } else {\n    pet.meow(); // TS knows pet is Cat\n  }\n}"
      },
      {
        "id": "8.1",
        "title": "8.1 User-Defined Type Predicates (param is Type)",
        "content": "When narrowing logic is encapsulated into a helper function, TypeScript normally loses track of the narrowing. **Type Predicates** (`param is Type`) tell the compiler that a boolean return value confirms the specific type of the argument:",
        "code": "interface ApiSuccessResponse<T> {\n  status: 200;\n  payload: T;\n}\n\n// Type Predicate: 'data is ApiSuccessResponse<T>'\nfunction isSuccessResponse<T>(data: unknown): data is ApiSuccessResponse<T> {\n  return (\n    typeof data === \"object\" &&\n    data !== null &&\n    \"status\" in data &&\n    (data as any).status === 200 &&\n    \"payload\" in data\n  );\n}\n\nfunction processPayload(res: unknown) {\n  if (isSuccessResponse<string[]>(res)) {\n    // Inside this block, 'res' is narrowed to ApiSuccessResponse<string[]>!\n    console.log(res.payload.map(s => s.toLowerCase()));\n  }\n}"
      },
      {
        "id": "8.2",
        "title": "8.2 Assertion Functions (asserts condition / asserts value is Type)",
        "content": "Assertion functions throw an error if a condition is not met. The `asserts` keyword instructs TypeScript that if the function returns normally without throwing, the argument has been successfully verified:",
        "code": "function assertIsDefined<T>(val: T, msg: string): asserts val is NonNullable<T> {\n  if (val === null || val === undefined) {\n    throw new Error(msg);\n  }\n}\n\nfunction handleUser(id: string | null) {\n  assertIsDefined(id, \"User ID must be provided\");\n  // Downstream from here, TypeScript treats 'id' as 'string' (null is eliminated)!\n  console.log(id.toUpperCase());\n}"
      }
    ]
  },
  {
    "id": "generics",
    "number": "9",
    "phase": 2,
    "title": "Generics, Type Constraints & Reusable Design",
    "summary": "Principles of parameterized types, generic constraints using extends, default generic arguments, generic repositories, and API envelope patterns.",
    "subsections": [
      {
        "id": "9.0",
        "title": "9.0 Generic Foundations & Constraints (T extends Constraint)",
        "content": "Generics allow functions, classes, and interfaces to operate over various types while preserving full type safety and relationships between arguments and return values.\n\n### The Identity Function Mental Model\nWithout generics, you either sacrifice type information (`any`) or duplicate code for every possible type. Generics act as **type variables** instantiated at the call site:",
        "code": "// Generic with Constraint (extends object)\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { id: \"usr_101\", username: \"alex\", age: 30 };\n\nconst username = getProperty(user, \"username\"); // Inferred type: string\nconst age = getProperty(user, \"age\");           // Inferred type: number\n// getProperty(user, \"nonExistentKey\");         // ❌ Compile Error!"
      },
      {
        "id": "9.1",
        "title": "9.1 Production Pattern: Generic API Response Envelope & Repository",
        "content": "In scalable full-stack applications, generic interfaces establish consistent API response envelopes and data access patterns across all backend microservices:",
        "code": "// Generic API Envelope\ninterface ApiResponse<TData, TMeta = { page: number; total: number }> {\n  success: boolean;\n  data: TData;\n  meta?: TMeta;\n  timestamp: string;\n}\n\n// Generic Repository Contract\ninterface BaseEntity {\n  id: string;\n  createdAt: Date;\n}\n\ninterface CrudRepository<T extends BaseEntity> {\n  findById(id: string): Promise<T | null>;\n  create(entity: Omit<T, \"id\" | \"createdAt\">): Promise<T>;\n  delete(id: string): Promise<boolean>;\n}"
      }
    ]
  },
  {
    "id": "keyof-typeof-indexed",
    "number": "10",
    "phase": 2,
    "title": "Advanced Object Operators: keyof, typeof & Indexed Access",
    "summary": "Mastering type-level operators: keyof for key extraction, typeof in type positions, indexed access T[K], and keyof typeof for object constants.",
    "subsections": [
      {
        "id": "10.0",
        "title": "10.0 keyof and typeof Operators",
        "content": "TypeScript uses `typeof` in two distinct contexts:\n1. **Runtime `typeof`**: Evaluates to JavaScript strings like `\"string\"`, `\"number\"`, `\"object\"`.\n2. **Type-Space `typeof`**: Extracts the TypeScript type of an existing runtime variable, object, or function.\n\nCombining `keyof typeof` extracts a union of literal keys from any runtime object:",
        "code": "const HTTP_STATUS = {\n  OK: 200,\n  CREATED: 201,\n  BAD_REQUEST: 400,\n  UNAUTHORIZED: 401,\n  NOT_FOUND: 404\n} as const;\n\n// 1. typeof HTTP_STATUS extracts the concrete type shape\n// 2. keyof extracts the union of keys: \"OK\" | \"CREATED\" | \"BAD_REQUEST\" | ...\ntype HttpStatusKey = keyof typeof HTTP_STATUS;\n\n// 3. Indexed access extracts the union of status code numbers: 200 | 201 | 400 | ...\ntype HttpStatusCode = typeof HTTP_STATUS[HttpStatusKey];"
      },
      {
        "id": "10.1",
        "title": "10.1 Indexed Access Types (T[K])",
        "content": "Indexed access types look up a specific property on another type, behaving like property access but entirely within the type system:",
        "code": "interface StripeCharge {\n  id: string;\n  amount: number;\n  currency: \"usd\" | \"eur\" | \"gbp\";\n  customer: {\n    email: string;\n    stripeCustomerId: string;\n  };\n}\n\ntype ChargeCurrency = StripeCharge[\"currency\"]; // \"usd\" | \"eur\" | \"gbp\"\ntype CustomerInfo = StripeCharge[\"customer\"];    // { email: string; stripeCustomerId: string; }"
      }
    ]
  },
  {
    "id": "utility-types",
    "number": "11",
    "phase": 2,
    "title": "Built-in Utility Types: Comprehensive Reference & Reimplementation",
    "summary": "Complete guide to built-in utility types: Partial, Required, Readonly, Record, Pick, Omit, Exclude, Extract, NonNullable, Parameters, ReturnType, Awaited, and NoInfer.",
    "subsections": [
      {
        "id": "11.0",
        "title": "11.0 The 14 Standard Utility Types Matrix",
        "content": "Utility types perform type-level transformations over existing types without modifying runtime JavaScript:",
        "table": {
          "headers": [
            "Utility Type",
            "Definition / Internal Mechanism",
            "Real-World Production Use Case"
          ],
          "rows": [
            [
              "Partial<T>",
              "Makes all properties optional ({ [P in keyof T]?: T[P] })",
              "HTTP PATCH / Partial database updates"
            ],
            [
              "Required<T>",
              "Makes all properties required ({ [P in keyof T]-?: T[P] })",
              "Config validation where defaults are merged"
            ],
            [
              "Readonly<T>",
              "Makes all properties readonly ({ readonly [P in keyof T]: T[P] })",
              "Immutability contracts for Redux/Zustand"
            ],
            [
              "Record<K, T>",
              "Constructs an object with keys K of type T ({ [P in K]: T })",
              "Lookup dictionaries and caching maps"
            ],
            [
              "Pick<T, K>",
              "Selects a subset of keys K from T",
              "Creating read DTOs omitting internal columns"
            ],
            [
              "Omit<T, K>",
              "Picks all keys except K (Pick<T, Exclude<keyof T, K>>)",
              "Creating insert payloads omitting auto-generated IDs"
            ],
            [
              "Exclude<T, U>",
              "Excludes from T types assignable to U (T extends U ? never : T)",
              "Filtering union members"
            ],
            [
              "Extract<T, U>",
              "Extracts from T types assignable to U (T extends U ? T : never)",
              "Selecting specific action types"
            ],
            [
              "NonNullable<T>",
              "Excludes null and undefined from T (T & {})",
              "Sanitizing optional parameters"
            ],
            [
              "Parameters<T>",
              "Extracts tuple of function arguments",
              "Typing higher-order decorators and wrappers"
            ],
            [
              "ReturnType<T>",
              "Extracts function return type (T extends (...args: any) => infer R ? R : any)",
              "Typing factory outputs and query results"
            ],
            [
              "Awaited<T>",
              "Recursively unwraps Promise results",
              "Typing async data in TanStack Query"
            ],
            [
              "NoInfer<T>",
              "Prevents TypeScript from using an argument for generic inference",
              "Forcing explicit generic type parameters"
            ]
          ]
        },
        "code": "// Practical Composition: Update User DTO\ninterface UserEntity {\n  id: string;\n  email: string;\n  passwordHash: string;\n  role: \"USER\" | \"ADMIN\";\n  createdAt: Date;\n}\n\n// Omit sensitive/auto-generated fields, then make remaining fields optional:\ntype UpdateUserDto = Partial<Omit<UserEntity, \"id\" | \"passwordHash\" | \"createdAt\">> & {\n  currentPassword?: string;\n};"
      }
    ]
  },
  {
    "id": "mapped-conditional",
    "number": "12",
    "phase": 3,
    "title": "Conditional Types & The 'infer' Pattern Matching Engine",
    "summary": "Type-level branching using T extends U ? X : Y, distributive conditional types over naked unions, preventing distribution, and infer pattern matching.",
    "subsections": [
      {
        "id": "12.0",
        "title": "12.0 Conditional Types & Distributive Law",
        "content": "A **Conditional Type** selects one of two possible types based on a subtyping relationship: `T extends U ? TrueType : FalseType`.\n\n### Distributive Conditional Types\nWhen a conditional type acts on a **naked type parameter `T`**, it automatically distributes over unions:\n`(A | B) extends U ? X : Y` expands into `(A extends U ? X : Y) | (B extends U ? X : Y)`.\n\n### Preventing Distribution\nTo prevent distribution, wrap the type parameter in a tuple: `[T] extends [U] ? X : Y`.",
        "code": "// Distributive behavior in action (Reimplementing Exclude):\ntype MyExclude<T, U> = T extends U ? never : T;\n\ntype Status = \"ACTIVE\" | \"INACTIVE\" | \"PENDING\";\ntype ActiveOnly = MyExclude<Status, \"INACTIVE\" | \"PENDING\">;\n// Expands to:\n// (\"ACTIVE\" extends \"INACTIVE\" | \"PENDING\" ? never : \"ACTIVE\") |\n// (\"INACTIVE\" extends ... ? never : \"INACTIVE\") | ...\n// Evaluates to: \"ACTIVE\" | never | never => \"ACTIVE\"!"
      },
      {
        "id": "12.1",
        "title": "12.1 The 'infer' Keyword: Type-Level Pattern Matching",
        "content": "The `infer` keyword introduces a type variable inside the condition to be extracted via pattern matching:",
        "code": "// 1. Unpack Promise return type (Reimplementing Awaited):\ntype UnpackPromise<T> = T extends Promise<infer U> ? UnpackPromise<U> : T;\n\ntype DeepPromise = Promise<Promise<string>>;\ntype Result = UnpackPromise<DeepPromise>; // string\n\n// 2. Extract Array Element Type:\ntype ArrayElement<T> = T extends (infer E)[] ? E : never;\ntype Item = ArrayElement<number[]>; // number\n\n// 3. Extract Function Return Type:\ntype MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;"
      }
    ]
  },
  {
    "id": "mapped-template-literals",
    "number": "13",
    "phase": 3,
    "title": "Mapped Types, Key Remapping & Template Literal Types",
    "summary": "Iterating over keys with in keyof, modifier manipulation (+readonly, -readonly, -?), key remapping with as, and template literal type construction.",
    "subsections": [
      {
        "id": "13.0",
        "title": "13.0 Mapped Types & Modifiers (+/-, readonly, ?)",
        "content": "A **Mapped Type** creates a new object type by iterating through a union of keys (typically using `keyof`). You can add (`+`) or remove (`-`) `readonly` and optional (`?`) modifiers:",
        "code": "// Make every property required and mutable (stripping readonly and optional):\ntype MutableRequired<T> = {\n  -readonly [K in keyof T]-?: T[K];\n};\n\ninterface ReadonlyConfig {\n  readonly endpoint?: string;\n  readonly retries?: number;\n}\n\ntype EditableConfig = MutableRequired<ReadonlyConfig>;\n// Result: { endpoint: string; retries: number; }"
      },
      {
        "id": "13.1",
        "title": "13.1 Key Remapping with 'as' & Template Literal Types",
        "content": "TypeScript 4.1 introduced **Template Literal Types**, enabling string concatenation at the type level. Combined with key remapping (`as`), you can generate type-safe getter/setter interfaces:",
        "code": "type Person = {\n  name: string;\n  age: number;\n};\n\n// Generate getters: \"getName\", \"getAge\"\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\n\ntype PersonGetters = Getters<Person>;\n// Evaluates to:\n// {\n//   getName: () => string;\n//   getAge: () => number;\n// }"
      }
    ]
  },
  {
    "id": "enums-literal-unions",
    "number": "14",
    "phase": 3,
    "title": "Enums, Literal Unions & as const Objects: Production Trade-offs",
    "summary": "Comprehensive architectural comparison: numeric vs string enums, const enums, runtime code emission, and why as const literal unions are modern best practice.",
    "subsections": [
      {
        "id": "14.0",
        "title": "14.0 Enums vs Literal Unions Architectural Comparison",
        "content": "Enums are one of the very few TypeScript features that **emit real runtime JavaScript code** rather than being erased.\n\n| Aspect | String / Numeric Enums | `as const` Object Literal Union |\n| :--- | :--- | :--- |\n| **Runtime Emission** | Emits an IIFE and two-way lookup object | Emits a simple, clean, frozen JS object |\n| **Tree-Shaking** | Poor: IIFE causes bundler de-optimization | Excellent: Clean object literal tree-shaking |\n| **API Boundary Safety** | Numeric enums allow arbitrary numbers | Only exact literal strings are permitted |\n| **Modern Best Practice** | Discouraged by TS Core team for new code | **Recommended Standard** |",
        "code": "// ❌ LEGACY ENUM: Emits runtime IIFE bloat\nenum UserRole {\n  ADMIN = \"ADMIN\",\n  USER = \"USER\"\n}\n\n// ✅ MODERN PRODUCTION PATTERN: 'as const' Object + Derived Union Type\nconst USER_ROLES = {\n  ADMIN: \"ADMIN\",\n  USER: \"USER\",\n  AUDITOR: \"AUDITOR\"\n} as const;\n\n// Derive union type: \"ADMIN\" | \"USER\" | \"AUDITOR\"\ntype UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];\n\nfunction assignRole(role: UserRoleType) {\n  console.log(\"Assigned role:\", role);\n}\n\nassignRole(USER_ROLES.ADMIN); // Valid\nassignRole(\"ADMIN\");          // Valid! Native structural compatibility"
      }
    ]
  },
  {
    "id": "classes-modifiers",
    "number": "15",
    "phase": 3,
    "title": "Classes, Access Modifiers & Encapsulation in TypeScript",
    "summary": "OOP mechanics in TypeScript: public, protected, private, TypeScript private vs JavaScript #private, parameter properties, abstract classes, and the override keyword.",
    "subsections": [
      {
        "id": "15.0",
        "title": "15.0 TypeScript 'private' vs JavaScript '#private' (The Hard Privacy Trap)",
        "content": "A crucial distinction in TypeScript OOP:\n- **TypeScript `private`**: Enforced **only at compile time**. At runtime, the property is fully public and accessible via `obj[\"secret\"]`!\n- **JavaScript `#private` (Private Identifier)**: Enforced **at the V8 runtime engine level** using private brand checks. Truly inaccessible outside the class body.",
        "code": "class Vault {\n  private softSecret: string = \"ts-private-123\";\n  #hardSecret: string = \"v8-private-456\";\n\n  reveal() {\n    return this.#hardSecret;\n  }\n}\n\nconst vault = new Vault();\n// (vault as any).softSecret; // ⚠️ Works at runtime! TS private is erased!\n// vault.#hardSecret;         // 💥 SyntaxError at runtime: Private field '#hardSecret' must be declared in enclosing class"
      },
      {
        "id": "15.1",
        "title": "15.1 Abstract Classes, Parameter Properties & override Keyword",
        "content": "Parameter properties allow you to declare and initialize class fields directly in the constructor signature:",
        "code": "abstract class BasePaymentProcessor {\n  // Parameter Property: auto-declares and initializes 'this.apiKey'\n  constructor(protected readonly apiKey: string) {}\n\n  abstract process(amount: number): Promise<boolean>;\n\n  logTransaction(txId: string) {\n    console.log(`[${this.constructor.name}] Logged: ${txId}`);\n  }\n}\n\nclass StripeProcessor extends BasePaymentProcessor {\n  // 'override' ensures the method exists on the parent class:\n  override async process(amount: number): Promise<boolean> {\n    console.log(\"Charging via Stripe with key:\", this.apiKey.slice(0, 4) + \"...\");\n    return true;\n  }\n}"
      }
    ]
  },
  {
    "id": "modules-imports",
    "number": "16",
    "phase": 3,
    "title": "Modules, Ambient Declarations (.d.ts) & Module Augmentation",
    "summary": "ES modules, import type vs import, ambient declaration files, writing types for untyped JS libraries, declaration merging, and module augmentation.",
    "subsections": [
      {
        "id": "16.0",
        "title": "16.0 'import type' and Type-Only Imports",
        "content": "Using `import type` guarantees that the imported symbol is **100% erased** from emitted JavaScript. This prevents accidental circular runtime dependency cycles and ensures bundlers do not retain unused modules:",
        "code": "// Type-only import (Always erased):\nimport type { UserProfile, OrderData } from \"./models\";\n\n// Inline type import (TS 4.5+):\nimport { calculateTotal, type TaxRate } from \"./taxEngine\";"
      },
      {
        "id": "16.1",
        "title": "16.1 Ambient Declarations (.d.ts) & Module Augmentation",
        "content": "When integrating third-party JavaScript libraries that lack type definitions, you author ambient declarations in a `.d.ts` file:",
        "code": "// types/untyped-analytics.d.ts\ndeclare module \"untyped-analytics\" {\n  export interface AnalyticsEvent {\n    eventName: string;\n    properties: Record<string, any>;\n  }\n\n  export function track(event: AnalyticsEvent): void;\n  export function init(apiKey: string): void;\n}\n\n// Module Augmentation: Adding custom properties to Express Request\nimport \"express\";\n\ndeclare module \"express\" {\n  export interface Request {\n    tenantId?: string;\n    authenticatedUser?: { id: string; role: string };\n  }\n}"
      }
    ]
  },
  {
    "id": "async-errors",
    "number": "17",
    "phase": 3,
    "title": "Asynchronous TypeScript, Promises, Catch Typing & Result Pattern",
    "summary": "Typing async/await, Promise<T>, Awaited<T>, why catch blocks type errors as unknown, and the type-safe Result<T, E> error handling pattern.",
    "subsections": [
      {
        "id": "17.0",
        "title": "17.0 The Catch Block Trap: 'unknown' vs 'any'",
        "content": "In JavaScript, anything can be thrown (`throw \"bad\"`, `throw 404`, `throw null`). Therefore, in TypeScript with `useUnknownInCatchVariables: true` (included in `strict`), the error in a catch clause is **always typed as `unknown`**:",
        "code": "async function fetchUserData(userId: string) {\n  try {\n    const res = await fetch(`/api/users/${userId}`);\n    return await res.json();\n  } catch (err: unknown) {\n    // ❌ err.message is not allowed directly because err could be anything!\n    \n    // ✅ Safe Narrowing:\n    if (err instanceof Error) {\n      console.error(\"Standard error message:\", err.message);\n    } else {\n      console.error(\"Non-standard thrown value:\", String(err));\n    }\n    throw err;\n  }\n}"
      },
      {
        "id": "17.1",
        "title": "17.1 The Discriminated Result Pattern (Result<T, E>)",
        "content": "Instead of throwing exceptions that escape type contracts, senior architectures use the **Result Monad Pattern**:",
        "code": "type Result<T, E = Error> =\n  | { ok: true; value: T }\n  | { ok: false; error: E };\n\nfunction parseJsonSafe<T>(jsonStr: string): Result<T, SyntaxError> {\n  try {\n    const value = JSON.parse(jsonStr) as T;\n    return { ok: true, value };\n  } catch (err) {\n    return { ok: false, error: err as SyntaxError };\n  }\n}\n\nconst outcome = parseJsonSafe<{ token: string }>('{\"token\": \"xyz\"}');\nif (outcome.ok) {\n  console.log(\"Token:\", outcome.value.token);\n} else {\n  console.error(\"Syntax error:\", outcome.error.message);\n}"
      }
    ]
  },
  {
    "id": "react-integration",
    "number": "18",
    "phase": 4,
    "title": "TypeScript with React: Props, Hooks, Generic Components & Zustand",
    "summary": "Comprehensive guide to React 19 typing: ComponentProps, ReactNode vs JSX.Element, generic components, typing custom hooks, and type-safe Zustand stores.",
    "subsections": [
      {
        "id": "18.0",
        "title": "18.0 React Component Props & ReactNode vs JSX.Element",
        "content": "Understanding the React return type hierarchy:\n- **`React.ReactNode`**: Represents anything that can be rendered inside JSX (strings, numbers, booleans, null, undefined, React elements, fragments, arrays of nodes). **Use this for the `children` prop!**\n- **`JSX.Element`**: Represents a single instantiated React element (the return value of `React.createElement`).",
        "code": "import React, { ReactNode } from \"react\";\n\ninterface CardProps {\n  title: string;\n  badge?: string;\n  children: ReactNode; // ✅ Correct type for children\n  onAction?: (actionId: string) => void;\n}\n\nexport function Card({ title, badge, children, onAction }: CardProps): React.JSX.Element {\n  return (\n    <div className=\"card\">\n      <div className=\"card-header\">\n        <h3>{title}</h3>\n        {badge && <span className=\"badge\">{badge}</span>}\n      </div>\n      <div className=\"card-body\">{children}</div>\n      {onAction && <button onClick={() => onAction(\"primary\")}>Proceed</button>}\n    </div>\n  );\n}"
      },
      {
        "id": "18.1",
        "title": "18.1 Generic React Components",
        "content": "Generic components allow parent components to pass arrays of arbitrary items while maintaining exact type safety in render callbacks:",
        "code": "interface SelectListProps<T> {\n  items: T[];\n  keyExtractor: (item: T) => string;\n  renderItem: (item: T) => React.ReactNode;\n  onSelect: (item: T) => void;\n}\n\nexport function SelectList<T>({ items, keyExtractor, renderItem, onSelect }: SelectListProps<T>) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={keyExtractor(item)} onClick={() => onSelect(item)}>\n          {renderItem(item)}\n        </li>\n      ))}\n    </ul>\n  );\n}"
      },
      {
        "id": "18.2",
        "title": "18.2 Type-Safe Zustand State Store",
        "content": "Typing Zustand state and actions with atomic selectors:",
        "code": "import { create } from \"zustand\";\n\ninterface AuthState {\n  user: { id: string; email: string } | null;\n  isAuthenticated: boolean;\n  login: (user: { id: string; email: string }) => void;\n  logout: () => void;\n}\n\nexport const useAuthStore = create<AuthState>((set) => ({\n  user: null,\n  isAuthenticated: false,\n  login: (user) => set({ user, isAuthenticated: true }),\n  logout: () => set({ user: null, isAuthenticated: false }),\n}));"
      }
    ]
  },
  {
    "id": "node-nestjs-integration",
    "number": "19",
    "phase": 4,
    "title": "TypeScript with Node.js & NestJS: DTOs, Decorators & Validation",
    "summary": "Backend engineering: DTO classes vs interfaces, class-validator decorators, dependency injection typing, and strict runtime payload validation.",
    "subsections": [
      {
        "id": "19.0",
        "title": "19.0 DTO Classes vs Interfaces in NestJS",
        "content": "In NestJS, **Data Transfer Objects (DTOs) MUST be declared as Classes, NOT Interfaces**.\nWhy? Because interfaces are erased at compile time! A class creates a runtime constructor function that preserves decorator metadata for NestJS reflection and `ValidationPipe`.",
        "code": "import { IsEmail, IsString, IsInt, Min, MaxLength } from \"class-validator\";\n\nexport class CreateUserDto {\n  @IsEmail()\n  email!: string;\n\n  @IsString()\n  @MaxLength(64)\n  fullName!: string;\n\n  @IsInt()\n  @Min(18)\n  age!: number;\n}"
      }
    ]
  },
  {
    "id": "databases-api-contracts",
    "number": "20",
    "phase": 4,
    "title": "Databases, API Contracts & Preventing Type Drift",
    "summary": "Database entity typing, nullable vs optional columns, shared type packages in monorepos, and contract-driven API development.",
    "subsections": [
      {
        "id": "20.0",
        "title": "20.0 Nullable Columns vs Optional Properties in Databases",
        "content": "A critical database data modeling rule:\n- **Optional Property (`prop?: string`)**: The key may be omitted from the object payload (typically in an update DTO).\n- **Nullable Property (`prop: string | null`)**: The key MUST be present, but its value in the database column is SQL NULL.",
        "code": "interface SqlOrderRecord {\n  id: string;                      // PRIMARY KEY NOT NULL\n  customer_id: string;             // FOREIGN KEY NOT NULL\n  discount_code: string | null;    // NULLABLE COLUMN (Can be null in SQL)\n  notes: string | null;            // NULLABLE COLUMN\n}\n\n// Updating an order:\ninterface PatchOrderDto {\n  discount_code?: string | null;   // Can omit, or explicitly pass null to clear!\n}"
      }
    ]
  },
  {
    "id": "compiler-internals-variance",
    "number": "21",
    "phase": 4,
    "title": "Compiler Internals, Variance & Assignability Rules",
    "summary": "Structural assignability algorithms, covariance vs contravariance in function parameters, strictFunctionTypes, and @ts-expect-error vs @ts-ignore.",
    "subsections": [
      {
        "id": "21.0",
        "title": "21.0 Covariance vs Contravariance (strictFunctionTypes)",
        "content": "Variance describes how subtyping between more complex types relates to subtyping between their components:\n- **Covariance (Same Direction)**: Return types are covariant. If Dog extends Animal, `() => Dog` is assignable to `() => Animal`.\n- **Contravariance (Opposite Direction)**: Function parameters are **contravariant** under `strictFunctionTypes`. If Dog extends Animal, `(a: Animal) => void` is assignable to `(d: Dog) => void`.",
        "code": "class Animal { name = \"Animal\"; }\nclass Dog extends Animal { bark() {} }\n\nlet handleAnimal = (a: Animal) => { console.log(a.name); };\nlet handleDog = (d: Dog) => { d.bark(); };\n\n// Under strictFunctionTypes:\nhandleDog = handleAnimal; // ✅ Valid! handleAnimal can safely process any Dog (because a Dog is an Animal).\n// handleAnimal = handleDog; // ❌ Compile Error! handleDog might call d.bark() on an Animal that is not a Dog!"
      },
      {
        "id": "21.1",
        "title": "21.1 @ts-expect-error vs @ts-ignore",
        "content": "Never use `@ts-ignore` in production code!\n- **`@ts-ignore`**: Silently suppresses errors. If the code is later refactored and no longer produces an error, `@ts-ignore` remains silently dead in the codebase.\n- **`@ts-expect-error`**: Explicitly asserts that the next line MUST trigger a type error. If the error is fixed, the compiler throws an error alerting you to remove the directive!",
        "code": "// ✅ Best practice in unit tests verifying negative type test cases:\n// @ts-expect-error: Verifying that invalid currency is rejected at compile-time\nprocessPayment(\"INVALID_CURRENCY\");"
      }
    ]
  },
  {
    "id": "api-validation",
    "number": "22",
    "phase": 4,
    "title": "Runtime Validation, Type Erasure & Branded Types",
    "summary": "Why type erasure demands runtime boundaries, parsing with Zod/Valibot, and implementing nominal typing with Branded/Tagged types.",
    "subsections": [
      {
        "id": "22.0",
        "title": "22.0 Nominal Typing with Branded / Tagged Types",
        "content": "TypeScript uses structural typing, meaning any two string types are interchangeable. This leads to subtle domain bugs (e.g. passing an `OrderId` where a `UserId` was expected).\n\n**Branded Types** (also called Nominal Types) simulate nominal typing by intersecting a primitive with a phantom brand object:",
        "code": "// Declare Brand Type\ntype Brand<K, T> = K & { readonly __brand: T };\n\nexport type UserId = Brand<string, \"UserId\">;\nexport type OrderId = Brand<string, \"OrderId\">;\n\n// Constructor Helper Functions\nfunction makeUserId(id: string): UserId {\n  return id as UserId;\n}\n\nfunction makeOrderId(id: string): OrderId {\n  return id as OrderId;\n}\n\nfunction cancelOrder(userId: UserId, orderId: OrderId) {\n  console.log(`User ${userId} cancelled order ${orderId}`);\n}\n\nconst user = makeUserId(\"usr_999\");\nconst order = makeOrderId(\"ord_123\");\n\ncancelOrder(user, order); // ✅ Valid!\n// cancelOrder(order, user); \n// ❌ Compile Error! Type 'OrderId' is not assignable to type 'UserId'."
      }
    ]
  },
  {
    "id": "interview-traps",
    "number": "23",
    "phase": 4,
    "title": "Testing, Tooling, ESLint & CI/CD Type Checking",
    "summary": "Testing TypeScript applications with Vitest, typing mocks and spies, ESLint strict type-checked configs, and CI/CD validation without emit.",
    "subsections": [
      {
        "id": "23.0",
        "title": "23.0 Type Checking vs Unit Testing in CI Pipelines",
        "content": "Unit tests test behavior; the TypeScript compiler tests contracts. A robust production CI pipeline must separate both:",
        "code": "// Package.json Scripts:\n// \"typecheck\": \"tsc --noEmit\",\n// \"test\": \"vitest run\",\n// \"lint\": \"eslint . --max-warnings 0\"\n\n// Mocking typed API in Vitest:\nimport { vi, test, expect } from \"vitest\";\nimport * as api from \"./userService\";\n\ntest(\"fetches user by id with full type safety\", async () => {\n  const spy = vi.spyOn(api, \"fetchUser\").mockResolvedValue({\n    id: \"u1\",\n    email: \"test@example.com\"\n  });\n\n  const res = await api.fetchUser(\"u1\");\n  expect(res.email).toBe(\"test@example.com\");\n  expect(spy).toHaveBeenCalledWith(\"u1\");\n});"
      }
    ]
  },
  {
    "id": "study-order-checkpoints",
    "number": "24",
    "phase": 4,
    "title": "Recommended Study Order, Revision Checkpoints & Coding DSA",
    "summary": "Interactive 6-session mastery roadmap, 10 executive revision checkpoints with revealable answers, and core DSA patterns in TypeScript.",
    "subsections": [
      {
        "id": "24.0",
        "title": "24.0 Interactive 6-Session Mastery Study Order",
        "sessions": [
          {
            "id": "ts-session-1",
            "title": "Session 1: Foundations & The Type Checker",
            "topics": "Modules 1–4: Type superset, tsconfig strict flags, primitives, any vs unknown vs never, satisfies, literal widening."
          },
          {
            "id": "ts-session-2",
            "title": "Session 2: Object Modeling & Structural Typing",
            "topics": "Modules 5–6: Discriminated unions, type aliases vs interfaces, declaration merging, excess property checks."
          },
          {
            "id": "ts-session-3",
            "title": "Session 3: Functions, Guards & Generics",
            "topics": "Modules 7–11: Overloads, parameter contravariance, type predicates (is), generic constraints, built-in utility types."
          },
          {
            "id": "ts-session-4",
            "title": "Session 4: Advanced Metaprogramming",
            "topics": "Modules 12–14: Conditional types, distributive law, infer pattern matching, mapped types, template literals, as const."
          },
          {
            "id": "ts-session-5",
            "title": "Session 5: OOP, Modules & Asynchronous TS",
            "topics": "Modules 15–17: TS private vs #private, abstract classes, import type, .d.ts ambient files, Result pattern."
          },
          {
            "id": "ts-session-6",
            "title": "Session 6: Full Stack Architecture & Screening",
            "topics": "Modules 18–24: React 19 props/hooks, NestJS DTOs, Zod parsing, branded types, interview output prediction & algorithms."
          }
        ]
      },
      {
        "id": "24.1",
        "title": "24.1 10 Executive Revision Checkpoints",
        "checkpoints": [
          {
            "q": "Why is TypeScript unable to validate incoming API data at runtime?",
            "ans": "Because TypeScript compiles via type erasure: all types, interfaces, and type aliases are completely stripped from emitted JavaScript. The V8 engine only sees plain JavaScript, so runtime schema parsers like Zod are strictly mandatory."
          },
          {
            "q": "What is the practical difference between 'any' and 'unknown'?",
            "ans": "'any' completely disables the type checker and allows all operations without verification. 'unknown' is a safe top type: you can assign anything to it, but you cannot perform any operations until you narrow it via typeof, instanceof, or a type guard."
          },
          {
            "q": "What does 'never' represent and where is it used in production?",
            "ans": "'never' is the empty bottom type representing values that can never occur. It is used to type functions that unconditionally throw or loop forever, and in the default branch of a switch statement to enforce compile-time exhaustive checking."
          },
          {
            "q": "How does the 'satisfies' operator differ from a type annotation?",
            "ans": "A type annotation upcasts and widens the expression to the declared type, losing specific literal or union member information. 'satisfies' validates that the expression conforms to the type contract while preserving the exact inferred literal types."
          },
          {
            "q": "What is a Discriminated Union and why is it preferred over optional fields?",
            "ans": "A Discriminated Union is a union of object types sharing a common literal property (e.g. status: 'SUCCESS' | 'ERROR'). It makes invalid state combinations impossible and allows TypeScript's control-flow analysis to narrow member properties automatically."
          },
          {
            "q": "Why does assigning an object literal directly to a function trigger an error, but passing a pre-assigned variable does not?",
            "ans": "Direct object literals trigger Excess Property Checking to catch typos. Pre-assigned variables are evaluated under standard Structural Typing (Duck Typing), where additional properties are permitted as long as required members exist."
          },
          {
            "q": "What is the difference between TypeScript's 'private' and JavaScript's '#private'?",
            "ans": "TypeScript's 'private' keyword is purely a compile-time restriction; the field is fully public and accessible at runtime. JavaScript's '#private' field is enforced by the V8 runtime engine and throws a syntax error if accessed outside the class."
          },
          {
            "q": "What are Distributive Conditional Types and how do you prevent distribution?",
            "ans": "When a conditional type acts on a naked type parameter T (e.g. T extends U ? X : Y), it automatically distributes over union members. To prevent distribution, wrap both sides in square brackets: [T] extends [U] ? X : Y."
          },
          {
            "q": "What is the difference between '@ts-expect-error' and '@ts-ignore'?",
            "ans": "'@ts-ignore' unconditionally suppresses errors. '@ts-expect-error' asserts that a compiler error must occur on the next line; if the line ceases to produce an error, the compiler flags an unused suppression directive."
          },
          {
            "q": "What are Branded / Nominal Types and what problem do they solve?",
            "ans": "Branded types intersect primitives with a unique tag (e.g. string & { __brand: 'UserId' }). They prevent accidental swapping of semantically distinct strings or numbers (like passing an OrderId to a function expecting a UserId) under a structural type system."
          }
        ]
      }
    ]
  }
];
