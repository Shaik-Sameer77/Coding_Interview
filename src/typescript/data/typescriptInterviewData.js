// TypeScript Master Interview Guide — 150 Questions, Answers & Multi-Approach Algorithms
// Foundation Finance Company · Full Stack Developer / SDE Screening Preparation
// Fully upgraded to meet AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Multiple Approaches.

export const TS_INTERVIEW_PARTS = [
  {
    "id": "all",
    "title": "All Questions",
    "count": 150,
    "color": "#38bdf8"
  },
  {
    "id": 1,
    "title": "Part 1: Fundamentals & Annotations",
    "count": 20,
    "color": "#60a5fa"
  },
  {
    "id": 2,
    "title": "Part 2: Core Types & Special Types",
    "count": 20,
    "color": "#38bdf8"
  },
  {
    "id": 3,
    "title": "Part 3: Interfaces & Object Modeling",
    "count": 10,
    "color": "#818cf8"
  },
  {
    "id": 4,
    "title": "Part 4: Generics & Reusable Design",
    "count": 10,
    "color": "#a78bfa"
  },
  {
    "id": 5,
    "title": "Part 5: Advanced & Utility Types",
    "count": 15,
    "color": "#c084fc"
  },
  {
    "id": 6,
    "title": "Part 6: Type Operators & Metaprogramming",
    "count": 10,
    "color": "#e879f9"
  },
  {
    "id": 7,
    "title": "Part 7: Classes, OOP & Encapsulation",
    "count": 10,
    "color": "#f472b6"
  },
  {
    "id": 8,
    "title": "Part 8: Modules, Async & Errors",
    "count": 10,
    "color": "#fb7185"
  },
  {
    "id": 9,
    "title": "Part 9: React 19, Node.js & NestJS",
    "count": 15,
    "color": "#34d399"
  },
  {
    "id": 10,
    "title": "Part 10: Compiler & Runtime Safety",
    "count": 15,
    "color": "#f59e0b"
  },
  {
    "id": 11,
    "title": "Part 11: Coding & Debugging Exercises",
    "count": 15,
    "color": "#10b981"
  }
];

export const TS_STUDY_SESSIONS = [
  {
    "session": 1,
    "range": "Q1–Q20",
    "title": "Session 1: Foundations & Type Checker",
    "description": "Core primitives, type annotations vs inference, let vs const literal widening, and basic array/tuple contracts.",
    "topics": [
      "Superset Model",
      "Compiler vs Runtime",
      "Primitives",
      "Type Annotations",
      "Inference",
      "Arrays & Tuples"
    ]
  },
  {
    "session": 2,
    "range": "Q21–Q40",
    "title": "Session 2: Core Type System & Narrowing",
    "description": "Mastering top and bottom types (any, unknown, never, void), strict mode flags, and control-flow type guards.",
    "topics": [
      "any vs unknown",
      "never Exhaustiveness",
      "strictNullChecks",
      "Discriminated Unions",
      "Type Predicates",
      "satisfies"
    ]
  },
  {
    "session": 3,
    "range": "Q41–Q60",
    "title": "Session 3: Interfaces, Structural Typing & Generics",
    "description": "Deep dive into interface extension, declaration merging, structural assignability, and generic constraints.",
    "topics": [
      "Interfaces vs Types",
      "Declaration Merging",
      "Structural Duck Typing",
      "Generics",
      "Generic Constraints",
      "API Envelopes"
    ]
  },
  {
    "session": 4,
    "range": "Q61–Q95",
    "title": "Session 4: Utility Types, Metaprogramming & OOP",
    "description": "Built-in utility types, conditional types, infer pattern matching, mapped template literals, and classes.",
    "topics": [
      "Utility Types",
      "keyof & typeof",
      "Conditional Types & infer",
      "Mapped Types",
      "Enums vs as const",
      "OOP & Classes"
    ]
  },
  {
    "session": 5,
    "range": "Q96–Q120",
    "title": "Session 5: Full-Stack Integration (React & NestJS)",
    "description": "React 19 props/hooks typing, Zustand store typing, NestJS DTO classes, and database entities.",
    "topics": [
      "import type",
      "React Component Props",
      "useRef & useState",
      "NestJS DTOs",
      "Express Typing",
      "Environment Variables"
    ]
  },
  {
    "session": 6,
    "range": "Q121–Q150",
    "title": "Session 6: Compiler Internals, Debugging & Algorithms",
    "description": "Compiler internals, variance, branded types, compiler diagnostics debugging, and multi-approach algorithms.",
    "topics": [
      "Variance",
      "Branded Types",
      "Diagnostics",
      "Multi-Approach DSA",
      "String Reversal",
      "Deduplication"
    ]
  }
];

export const TS_150_QUESTIONS = [
  {
    "id": 1,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Fundamentals",
    "question": "What is TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"TypeScript is an open-source, statically typed superset of JavaScript developed by Microsoft. It introduces optional static typing, compile-time type verification, interfaces, and rich IDE tooling on top of standard ECMAScript. During development, the TypeScript compiler checks contracts and flags potential runtime errors before the code is ever deployed. Crucially, TypeScript compiles down to clean, standards-compliant JavaScript through a process called type erasure—meaning zero type annotations exist at runtime, and execution performance matches pure JavaScript.\"\n\n**First-Principles Technical Breakdown:**\nTypeScript's architecture consists of three distinct layers:\n1. **The Language**: Syntactic superset extending JavaScript with type annotations, interfaces, generics, enums, and utility types.\n2. **The Type Checker & Compiler (`tsc`)**: Parses TypeScript source into an Abstract Syntax Tree (AST), constructs a symbol table, validates type assignability, and emits plain JavaScript.\n3. **The Language Service**: Powers IDEs (VS Code, WebStorm) by providing semantic autocompletion, instant jump-to-definition, symbol renaming, and inline diagnostic warnings.",
    "runtimeBehavior": "TypeScript is completely erased during compilation. At runtime, the browser or Node.js executes standard JavaScript. TypeScript does not add runtime overhead, nor does it automatically validate incoming external network data (like JSON HTTP payloads) unless paired with a runtime schema library like Zod.",
    "code": "// Compile-time contract:\ninterface UserDTO {\n  id: string;\n  email: string;\n  isActive: boolean;\n}\n\nfunction printStatus(user: UserDTO): string {\n  return `User ${user.email} is ${user.isActive ? \"active\" : \"disabled\"}`;\n}\n\n// In emitted JavaScript (Target: ES2022):\n// function printStatus(user) {\n//   return `User ${user.email} is ${user.isActive ? \"active\" : \"disabled\"}`;\n// }",
    "keyPoints": [
      "Statically typed syntactic superset of ECMAScript.",
      "Types exist solely at compile-time and are completely erased in emitted JS.",
      "Catches syntax, structural, and nullability errors before runtime deployment.",
      "Requires runtime validators (Zod/Valibot) for external untrusted boundaries."
    ],
    "followUps": [
      {
        "q": "Does TypeScript make JavaScript execute faster at runtime in V8?",
        "a": "No. Because all types are erased during transpilation, the V8 engine receives identical JavaScript. However, writing predictable types can indirectly help V8 avoid de-optimizations caused by polymorphic hidden classes."
      },
      {
        "q": "Can valid JavaScript code fail to compile in TypeScript?",
        "a": "Yes, if strict flags like noImplicitAny or strictNullChecks are active and the JavaScript code relies on dynamic type coercion or unchecked null dereferencing."
      }
    ],
    "tip": "Always emphasize Type Erasure immediately in interviews. It shows you understand that TypeScript protects the developer, not the runtime memory."
  },
  {
    "id": 2,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Fundamentals",
    "question": "Why do we use TypeScript instead of plain JavaScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"We use TypeScript in production engineering because it dramatically reduces defects across the software development lifecycle. In plain JavaScript, typos, property renames, and null pointer dereferences are only discovered when code executes in staging or production. TypeScript turns those runtime crashes into instantaneous compile-time diagnostics. Furthermore, TypeScript serves as living, machine-checked documentation: when a backend DTO changes, the compiler instantly highlights every single frontend component, test, and utility function that requires updating, making large-scale refactoring safe and predictable.\"",
    "runtimeBehavior": "Reduces runtime crash rates by catching type mismatches, missing parameters, and unintended undefined dereferences before code is packaged.",
    "code": "// In JavaScript: Silent coercion causes catastrophic billing bug\nfunction chargeCustomer(amount, fee) {\n  return amount + fee;\n}\n// chargeCustomer(100, \"20\"); // Returns \"10020\" instead of 120!\n\n// In TypeScript: Flagged immediately in IDE\nfunction safeCharge(amount: number, fee: number): number {\n  return amount + fee;\n}\n// safeCharge(100, \"20\");\n// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'.",
    "keyPoints": [
      "Early bug detection: Eliminates the vast majority of TypeError exceptions.",
      "Safe refactoring: Renaming an interface property flags all affected files project-wide.",
      "Self-documenting codebase: Type signatures explicitly describe API expectations.",
      "Full-stack type sharing: Monorepos can share DTOs between NestJS and React."
    ],
    "followUps": [
      {
        "q": "When might TypeScript NOT be worth the added complexity?",
        "a": "For tiny throwaway scripts, rapid single-file prototypes, or teams with zero TypeScript familiarity facing an immediate emergency deadline."
      }
    ],
    "tip": "Mention full-stack DTO sharing in interviews—it demonstrates enterprise engineering experience."
  },
  {
    "id": 3,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Type Annotations",
    "question": "What are type annotations in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type annotations are explicit syntax markers where the developer explicitly declares the expected type of a variable, function parameter, object property, or return value using a colon followed by the type identifier. For example: `let count: number = 10`. Annotations establish an explicit contract between the programmer and the compiler, preventing values of incompatible types from ever being assigned to that identifier.\"",
    "code": "// Explicit variable annotations:\nconst serviceName: string = \"PaymentProcessor\";\nconst port: number = 8080;\nconst isProduction: boolean = true;\n\n// Explicit function parameter and return annotations:\nfunction formatInvoice(invoiceId: string, amount: number): string {\n  return `Invoice #${invoiceId}: $${amount.toFixed(2)}`;\n}",
    "keyPoints": [
      "Syntax: identifier: Type = value.",
      "Can be applied to variables, parameters, return types, class fields, and generics.",
      "Provides absolute clarity when type inference would otherwise produce an overly broad type."
    ],
    "followUps": [
      {
        "q": "Should you annotate every single variable in a TypeScript project?",
        "a": "No. Over-annotation adds visual noise. Best practice is to rely on type inference for local variables with obvious initializers and reserve explicit annotations for function signatures and public API contracts."
      }
    ],
    "tip": "Explain that over-annotating local variables like `let x: number = 5` is considered an anti-pattern on senior teams."
  },
  {
    "id": 4,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Inference",
    "question": "What is type inference?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type inference is TypeScript's ability to automatically deduce and assign a type to an expression based on the assigned value, surrounding context, or control-flow analysis, without requiring the developer to write an explicit annotation. For example, if you write `let count = 42`, the compiler automatically infers `count` as type `number`. Subsequent attempts to assign a string to `count` will produce a compile error. Inference gives you strong type safety with minimal syntactic boilerplate.\"",
    "code": "// Inferred as 'string':\nlet appName = \"Chrona Timer\";\n// appName = 123; \n// ❌ Error: Type 'number' is not assignable to type 'string'.\n\n// Inferred return type as 'boolean':\nfunction isEligible(age: number) {\n  return age >= 18; // Return type automatically deduced as 'boolean'\n}",
    "keyPoints": [
      "Infers types from initial values, return statements, and assignment flow.",
      "Reduces verbosity while preserving full static verification.",
      "Uses the \"best common type\" algorithm when evaluating arrays with mixed values."
    ],
    "followUps": [
      {
        "q": "What is the \"best common type\" algorithm in array inference?",
        "a": "When an array has mixed elements like [0, 1, \"hello\"], TypeScript evaluates candidate types and infers the union (number | string)[]."
      }
    ],
    "tip": "Highlight that trusting inference makes code cleaner and easier to refactor."
  },
  {
    "id": 5,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Inference & Annotations",
    "question": "What is the difference between type annotation and type inference?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type annotation is developer-driven: you explicitly specify the type using syntax like `: string`. Type inference is compiler-driven: TypeScript inspects the assigned value or expression and calculates the type automatically. A senior engineer knows when to rely on inference—such as local variables and map callbacks—and when explicit annotations are mandatory—such as public library API contracts, exported function signatures, and complex object literals where excess property checking is desired.\"",
    "table": {
      "headers": [
        "Dimension",
        "Type Annotation",
        "Type Inference"
      ],
      "rows": [
        [
          "Author",
          "Human Developer",
          "TypeScript Compiler Engine"
        ],
        [
          "Syntax",
          "Explicit (: Type)",
          "Implicit (Deduced from value)"
        ],
        [
          "Best Use Case",
          "Function signatures, public APIs, DTOs",
          "Local variables, callback params, constants"
        ],
        [
          "Maintenance",
          "Requires manual update if value changes",
          "Automatically adapts to value changes"
        ]
      ]
    },
    "code": "// Type Annotation: Necessary when declaring without immediate initialization\nlet pendingOrder: { id: string; total: number };\npendingOrder = { id: \"ord_1\", total: 49.99 };\n\n// Type Inference: Perfect for straightforward assignments\nconst exchangeRates = { USD: 1.0, EUR: 0.92, GBP: 0.79 };\n// Inferred as: { USD: number; EUR: number; GBP: number }",
    "keyPoints": [
      "Annotation: Explicit contract written by the developer.",
      "Inference: Implicit deduction calculated by the type checker.",
      "Best practice: Annotate public boundaries, infer internal implementations."
    ],
    "followUps": [
      {
        "q": "Why should exported functions always have explicit return type annotations?",
        "a": "It prevents accidental breaking changes to external consumers if internal implementation details change, and speeds up compiler performance by bypassing complex return inference."
      }
    ],
    "tip": "Mentioning compiler performance gains from explicit return types is an instant senior signal."
  },
  {
    "id": 6,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Primitive Types",
    "question": "What are the basic primitive types in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"TypeScript features 7 basic primitive types directly mirroring JavaScript: `string` for text, `number` for IEEE 754 floating-point values, `boolean` for true/false, `bigint` for arbitrarily large integers, `symbol` for globally unique immutable keys, `null` for intentional absence of value, and `undefined` for uninitialized variables. Crucially, in TypeScript, primitive types are written in lowercase. Capitalized types like `String` or `Number` refer to the JavaScript wrapper objects and should almost never be used as type annotations.\"",
    "code": "const username: string = \"mohammed\";\nconst userAge: number = 29;\nconst isActive: boolean = true;\nconst maxSafeInt: bigint = 9007199254740991n;\nconst uniqueKey: symbol = Symbol(\"apiKey\");\nconst emptyValue: null = null;\nconst notYetSet: undefined = undefined;\n\n// ❌ ANTI-PATTERN: Wrapper Object\n// const badAge: Number = new Number(25); // Avoid!",
    "keyPoints": [
      "7 Primitives: string, number, boolean, bigint, symbol, null, undefined.",
      "Always use lowercase primitive names; never uppercase wrapper objects (String, Number).",
      "Primitives are immutable and passed by value."
    ],
    "followUps": [
      {
        "q": "Why is let x: String an anti-pattern in TypeScript?",
        "a": "String refers to the JavaScript wrapper object interface, not the primitive string. Assigning a primitive to String can cause subtle assignability issues and violates conventions."
      }
    ],
    "tip": "Never capitalize primitive types in your code snippets during a coding test."
  },
  {
    "id": 7,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Primitive Types",
    "question": "What is the difference between `number`, `string`, and `boolean`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`number`, `string`, and `boolean` represent the three most common primitive data types in software engineering. `number` covers all numeric values including integers, floats, `NaN`, and `Infinity`. `string` represents UTF-16 character sequences enclosed in single quotes, double quotes, or template literals. `boolean` represents binary truth values—strictly `true` or `false`. TypeScript strictly forbids implicit coercion between these types, eliminating bugs where strings accidentally concatenate with numbers.\"",
    "code": "const count: number = 42;\nconst label: string = \"items\";\nconst hasShipped: boolean = false;\n\n// TypeScript prevents invalid cross-type operations:\n// const invalid = count * label; \n// ❌ Error: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.",
    "keyPoints": [
      "number: Represents all IEEE 754 64-bit floating point numbers (integers, floats, NaN, Infinity).",
      "string: Represents UTF-16 character text.",
      "boolean: strictly true or false (no implicit 1 or 0 coercion)."
    ],
    "followUps": [
      {
        "q": "Does TypeScript have separate int, float, or double types like Java or C#?",
        "a": "No. Just like JavaScript, all numeric values are IEEE 754 double-precision floats under the single \"number\" type (or bigint for arbitrary precision integers)."
      }
    ],
    "tip": "Remind the interviewer that NaN and Infinity are considered valid values of type number."
  },
  {
    "id": 8,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Null & Undefined",
    "question": "What is the difference between `null` and `undefined`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Semantically, `undefined` means a variable or property has been declared but not yet assigned a value, or a function parameter was omitted. `null` represents an intentional, explicit assignment signifying the absence of any object or value. With `strictNullChecks` enabled, TypeScript treats them as distinct, separate types. In modern TypeScript APIs, `undefined` is standard for optional properties (`prop?: string`), whereas `null` is frequently used to model database columns that permit SQL NULL.\"",
    "code": "// Optional property: inferred as 'string | undefined'\ninterface UserPreferences {\n  theme?: \"dark\" | \"light\"; // theme can be \"dark\", \"light\", or undefined\n  secondaryEmail: string | null; // Must be provided; null signifies deliberate absence\n}\n\nconst userA: UserPreferences = {\n  secondaryEmail: null // Explicitly no secondary email\n};",
    "keyPoints": [
      "undefined: Variable declared but unassigned, or omitted optional parameter.",
      "null: Intentional explicit representation of empty or nonexistent value.",
      "Under strictNullChecks: Neither is assignable to string or number without a union."
    ],
    "followUps": [
      {
        "q": "What is the non-null assertion operator (!) in TypeScript?",
        "a": "The postfix exclamation mark tells the compiler to assume a value is neither null nor undefined (e.g. element!.click()). It bypasses strictNullChecks and can cause runtime panics if misused."
      }
    ],
    "tip": "Mention that modern frontend APIs favor undefined for optional fields, while backend DB layers use null."
  },
  {
    "id": 9,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Type Annotations",
    "question": "Does TypeScript convert a value when we annotate its type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"No, absolutely not. Type annotations in TypeScript are compile-time metadata only; they have zero runtime behavior and perform no data conversion or type coercion whatsoever. If you annotate a string value with `as any as number`, the runtime value remains a string. If you need runtime type conversion—such as turning a string input `\"42\"` into a number—you must use explicit JavaScript functions like `Number(val)` or `parseInt(val, 10)`.\"",
    "code": "// ❌ Misconception: Annotation does NOT coerce data!\nconst rawInput: any = \"42\";\nconst numericValue: number = rawInput as number;\n\nconsole.log(typeof numericValue); // Still \"string\" at runtime!\nconsole.log(numericValue + 10);   // Outputs \"4210\" (String concatenation, not 52!)\n\n// ✅ Correct Runtime Conversion:\nconst safeNumericValue: number = Number(rawInput);\nconsole.log(typeof safeNumericValue); // \"number\"\nconsole.log(safeNumericValue + 10);   // 52",
    "keyPoints": [
      "TypeScript annotations NEVER alter runtime values.",
      "Type assertions (as Type) only instruct the compiler; they emit no conversion code.",
      "Runtime coercion requires standard JS: Number(), String(), Boolean()."
    ],
    "followUps": [
      {
        "q": "What happens if you use \"as unknown as T\" to force a type change?",
        "a": "The compiler accepts it, but if the underlying runtime representation does not match, downstream code will fail with runtime TypeError exceptions."
      }
    ],
    "tip": "This is a favorite interview trap question to check if a candidate understands type erasure."
  },
  {
    "id": 10,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Inference & Scoping",
    "question": "What is the difference between `let`, `const`, and `var` in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, `let` and `const` provide block-scoping and eliminate the hoisting quirks of function-scoped `var`. Crucially, TypeScript handles **type inference differently between `let` and `const`**. When you declare a variable with `const`, TypeScript infers a narrow **literal type** (e.g. `const x = 'USD'` is inferred as type `'USD'`), because the value can never be reassigned. When you declare with `let`, TypeScript **widens** the type to the general primitive (`let x = 'USD'` is inferred as type `string`) to allow future reassignments.\"",
    "code": "// Literal type preserved:\nconst paymentCurrency = \"USD\"; \n// Type: \"USD\"\n\n// Type widened:\nlet activeCurrency = \"USD\"; \n// Type: string (Widened from literal \"USD\")\n\nfunction setCurrency(curr: \"USD\" | \"EUR\") {}\nsetCurrency(paymentCurrency); // ✅ Valid! \"USD\" matches literal union\n// setCurrency(activeCurrency);  \n// ❌ Error: Argument of type 'string' is not assignable to parameter of type '\"USD\" | \"EUR\"'.",
    "keyPoints": [
      "const infers narrow literal types (e.g. \"USD\", 42).",
      "let infers widened primitive types (e.g. string, number).",
      "var is function-scoped and should be completely avoided in modern TypeScript."
    ],
    "followUps": [
      {
        "q": "How do you preserve literal types inside a let declaration?",
        "a": "Provide an explicit literal union annotation: let curr: \"USD\" | \"EUR\" = \"USD\"."
      }
    ],
    "tip": "Explain literal widening when answering this question—it shows deep compiler understanding beyond basic JS scoping."
  },
  {
    "id": 11,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Arrays & Collections",
    "question": "How do you declare an array in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, you can declare an array using two syntaxes: the bracket syntax `T[]` (such as `number[]`) or the generic array syntax `Array<T>` (such as `Array<number>`). Both syntaxes are semantically identical to the compiler. Bracket syntax is widely preferred in style guides for simplicity. For immutable arrays, TypeScript provides `readonly T[]` or `ReadonlyArray<T>`, which removes mutating methods like `push`, `pop`, and `splice` at compile time.\"",
    "code": "// 1. Bracket syntax (Standard convention):\nconst scores: number[] = [95, 88, 72];\n\n// 2. Generic syntax:\nconst tags: Array<string> = [\"finance\", \"react\", \"typescript\"];\n\n// 3. Readonly array (Prevents mutation):\nconst immutableIds: readonly string[] = [\"id_1\", \"id_2\"];\n// immutableIds.push(\"id_3\"); \n// ❌ Error: Property 'push' does not exist on type 'readonly string[]'.",
    "keyPoints": [
      "T[] and Array<T> are equivalent.",
      "readonly T[] strips mutating methods (push, pop, splice, shift).",
      "Arrays in TypeScript can grow dynamically, unlike fixed-length tuples."
    ],
    "followUps": [
      {
        "q": "How does TypeScript type an empty array initialized as const arr = []?",
        "a": "Under default settings without strict flags, it infers any[]. In modern strict mode, it infers never[] until elements are pushed or a type is annotated."
      }
    ],
    "tip": "Always mention readonly T[] when discussing arrays to highlight immutability practices."
  },
  {
    "id": 12,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Tuples",
    "question": "What is a tuple?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A tuple is a specialized array with a **fixed number of elements where each position has a known, specific type**. While standard arrays (`string[]`) can contain any number of elements of that type, a tuple like `[string, number]` requires exactly two elements: index 0 must be a string, and index 1 must be a number. Tuples are heavily used in React for hooks like `useState` (returning `[state, setState]`), geographical coordinates `[lat, lng]`, and key-value entries.\"",
    "code": "// Declare tuple: [latitude, longitude]\ntype Coordinate = [number, number];\nconst sanFrancisco: Coordinate = [37.7749, -122.4194];\n\n// Labeled tuple elements (Enhances IDE readability):\ntype HttpResult = [statusCode: number, message: string, isError: boolean];\nconst response: HttpResult = [200, \"OK\", false];\n\n// React useState simulation:\nfunction useToggle(initial: boolean): [boolean, () => void] {\n  let state = initial;\n  const toggle = () => { state = !state; };\n  return [state, toggle];\n}",
    "keyPoints": [
      "Fixed-length, positional type array.",
      "Each index has an explicitly declared type.",
      "Labeled tuples ([name: string, age: number]) improve developer experience.",
      "Can include optional elements ([string, number?]) and rest elements ([string, ...number[]])."
    ],
    "followUps": [
      {
        "q": "Can you call .push() on a TypeScript tuple?",
        "a": "Yes, in standard TypeScript array methods like push() are permitted on mutable tuples, which is a known type-system limitation. To prevent this, declare the tuple as readonly [number, number]."
      }
    ],
    "tip": "Mentioning the tuple push() quirk and resolving it with readonly is a surefire way to impress an interviewer."
  },
  {
    "id": 13,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Object Types",
    "question": "What is an object type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An object type in TypeScript describes the shape of a JavaScript object by defining its property names and their corresponding value types. Unlike class-based nominal languages, TypeScript's object types operate on structural compatibility: any object that satisfies the specified properties and types is considered compatible, regardless of how it was instantiated. Object types can be declared inline, via type aliases, or using interfaces.\"",
    "code": "// Object type via Type Alias:\ntype Product = {\n  id: string;\n  title: string;\n  price: number;\n  inStock: boolean;\n};\n\nconst laptop: Product = {\n  id: \"prod_001\",\n  title: \"MacBook Pro\",\n  price: 2499,\n  inStock: true\n};",
    "keyPoints": [
      "Defines the shape and property types of a structured object.",
      "Evaluated structurally rather than nominally.",
      "Can include optional (?), readonly, and indexed signature properties."
    ],
    "followUps": [
      {
        "q": "What is an index signature in an object type?",
        "a": "An index signature like { [key: string]: number } allows an object to hold arbitrary dynamic keys with values of the specified type."
      }
    ],
    "tip": "State clearly that object types define contracts for shape, not class inheritance."
  },
  {
    "id": 14,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Object Types",
    "question": "How do you define optional properties?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You define an optional property in an object type or interface by placing a question mark (`?`) immediately after the property name before the colon, like `middleName?: string`. This indicates to the compiler that the property may be present with the specified type, or omitted entirely. Under `strictNullChecks`, an optional property has the inferred type `T | undefined`. Furthermore, enabling `exactOptionalPropertyTypes` in tsconfig enforces that an optional property cannot be explicitly assigned `undefined`—it must either be omitted or assigned a valid value.\"",
    "code": "interface CustomerProfile {\n  id: string;\n  email: string;\n  phoneNumber?: string; // Optional: string | undefined\n}\n\nconst customer1: CustomerProfile = { id: \"c1\", email: \"alice@test.com\" }; // Valid: omitted\nconst customer2: CustomerProfile = { id: \"c2\", email: \"bob@test.com\", phoneNumber: \"+123456789\" }; // Valid: populated",
    "keyPoints": [
      "Syntax: propertyName?: Type.",
      "Under strictNullChecks, type is T | undefined.",
      "exactOptionalPropertyTypes distinguishes between property absence and property set to undefined."
    ],
    "followUps": [
      {
        "q": "What is the difference between phoneNumber?: string and phoneNumber: string | undefined?",
        "a": "In phoneNumber?: string, the key can be omitted completely. In phoneNumber: string | undefined, the key MUST be present on the object, even if its value is explicitly undefined."
      }
    ],
    "tip": "Highlighting the difference between an omitted key and an explicit undefined value shows advanced precision."
  },
  {
    "id": 15,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Functions",
    "question": "How do you define a function's parameter and return types?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You define parameter types by placing a colon and the type after each parameter name within the parenthesis. You define the return type by placing a colon and the type after the parameter list parenthesis. For example: `function calculateDiscount(price: number, percentage: number): number`. While TypeScript can often infer return types, explicitly annotating them on exported functions prevents unintended return type mutations and improves compiler compilation speed.\"",
    "code": "// Function declaration:\nfunction calculateTax(subtotal: number, taxRate: number): number {\n  return subtotal * taxRate;\n}\n\n// Arrow function syntax:\nconst formatCurrency = (amount: number, currency: string): string => {\n  return `${currency} ${amount.toFixed(2)}`;\n};",
    "keyPoints": [
      "Parameters must be annotated unless contextual typing applies.",
      "Return types are placed after the parameter parenthesis.",
      "Explicit return types prevent accidental contract regressions."
    ],
    "followUps": [
      {
        "q": "What happens if a function returns nothing in TypeScript?",
        "a": "Its return type is void. If it unconditionally throws an error or enters an infinite loop, its return type is never."
      }
    ],
    "tip": "Always include return type annotations when demonstrating functions in interviews."
  },
  {
    "id": 16,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Functions",
    "question": "What is an optional function parameter?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An optional function parameter is a parameter that a caller can omit when invoking the function. It is defined using a question mark (`?`) after the parameter name, such as `prefix?: string`. Inside the function body, the parameter has the union type `T | undefined`. In TypeScript, all optional parameters must follow required parameters in the function signature; you cannot place a required parameter after an optional one.\"",
    "code": "function sendNotification(userId: string, message: string, priority?: \"HIGH\" | \"LOW\"): void {\n  const finalPriority = priority ?? \"LOW\";\n  console.log(`Sending [${finalPriority}] to ${userId}: ${message}`);\n}\n\nsendNotification(\"usr_1\", \"Your order has shipped\"); // priority omitted (undefined)\nsendNotification(\"usr_1\", \"Security alert!\", \"HIGH\"); // priority provided",
    "keyPoints": [
      "Syntax: (param?: Type).",
      "Inferred type inside function body is Type | undefined.",
      "Must be placed after all required parameters."
    ],
    "followUps": [
      {
        "q": "Can an optional parameter have a default value?",
        "a": "No. A parameter with a default value is already implicitly optional. Using ? with an initializer like x?: number = 10 is a syntax error."
      }
    ],
    "tip": "Remember: Optional parameters must come after required parameters."
  },
  {
    "id": 17,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Functions",
    "question": "What are default parameters?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Default parameters in TypeScript are function parameters that are automatically initialized with a fallback value if the caller passes `undefined` or omits the argument. When you provide a default value, TypeScript automatically infers the parameter's type from the default value, making explicit annotation optional. Furthermore, default parameters are implicitly optional to callers.\"",
    "code": "// 'retries' is inferred as type 'number' with default 3:\nfunction fetchWithRetry(url: string, retries = 3, timeoutMs = 5000): void {\n  console.log(`Fetching ${url} with ${retries} retries, ${timeoutMs}ms timeout`);\n}\n\nfetchWithRetry(\"https://api.stripe.com\"); // uses 3 and 5000\nfetchWithRetry(\"https://api.stripe.com\", 5); // overrides retries to 5",
    "keyPoints": [
      "Type is inferred from default value if not annotated explicitly.",
      "Default value is used only when argument is undefined (passing null will NOT trigger default value!).",
      "Implicitly makes the parameter optional."
    ],
    "followUps": [
      {
        "q": "What happens if a caller passes null to a default parameter like retries = 3?",
        "a": "In JavaScript and TypeScript, null does NOT trigger default parameter initialization. retries will be assigned null, which could cause a runtime NaN if arithmetic is performed."
      }
    ],
    "tip": "Call out the null gotcha with default parameters—it highlights real-world JS/TS nuance."
  },
  {
    "id": 18,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Beginner",
    "category": "Functions",
    "question": "What are rest parameters?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Rest parameters allow a function to accept an indefinite number of arguments as a single, typed array. In TypeScript, a rest parameter uses the ellipsis syntax (`...rest`) and MUST be typed as an array type (such as `...numbers: number[]`) or as a tuple. The rest parameter must always be the final parameter in the function signature.\"",
    "code": "// Rest parameter typed as number[]:\nfunction sumAll(...numbers: number[]): number {\n  return numbers.reduce((acc, curr) => acc + curr, 0);\n}\n\nconsole.log(sumAll(10, 20, 30)); // 60\nconsole.log(sumAll(5));          // 5",
    "keyPoints": [
      "Must be typed as an array (T[]) or tuple ([T, U, ...V[]]).",
      "Must be the last parameter in the parameter list.",
      "Gathers all remaining arguments into a clean JavaScript array."
    ],
    "followUps": [
      {
        "q": "Can you type rest parameters as a tuple to enforce specific positional arguments?",
        "a": "Yes! For example: function executeCommand(...args: [command: string, timeout: number, ...flags: string[]]) enforces strict positional typing."
      }
    ],
    "tip": "Mentioning tuple-typed rest parameters showcases advanced API design skills."
  },
  {
    "id": 19,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Intermediate",
    "category": "Functions",
    "question": "What is a function type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A function type expression describes the call signature of a function—its expected parameter types and return type—without providing an implementation. It uses arrow syntax: `(param1: Type1, param2: Type2) => ReturnType`. Function types allow you to pass callbacks, higher-order functions, and event handlers with complete compile-time contract enforcement.\"",
    "code": "// Define function type:\ntype LoggerFunction = (message: string, level?: \"INFO\" | \"WARN\" | \"ERROR\") => void;\n\n// Function conforming to type:\nconst consoleLogger: LoggerFunction = (msg, lvl = \"INFO\") => {\n  console.log(`[${lvl}] ${msg}`);\n};\n\n// Higher-order function accepting function type:\nfunction processTransactions(txIds: string[], logger: LoggerFunction) {\n  txIds.forEach(id => logger(`Processing ${id}`));\n}",
    "keyPoints": [
      "Syntax: (param: Type) => ReturnType.",
      "Defines callable contracts for higher-order functions and callbacks.",
      "Can also be declared using call signatures inside interfaces."
    ],
    "followUps": [
      {
        "q": "How do you declare a callable signature inside an interface?",
        "a": "Using standard object syntax without an arrow: interface Callable { (x: number): string; }."
      }
    ],
    "tip": "Function types are the backbone of React event handlers and custom hooks."
  },
  {
    "id": 20,
    "partId": 1,
    "section": "A. Introduction, type annotations, and inference",
    "difficulty": "Senior",
    "category": "Void vs Never",
    "question": "What is the difference between `void` and `never`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`void` and `never` represent completely different concepts in type theory. `void` represents a function that **returns normally**, but has no meaningful return value (it returns `undefined`). The caller still receives control back. In contrast, `never` represents a function that **never returns at all**—either because it unconditionally throws an exception, halts the process, or runs an infinite event loop. The execution point after a `never`-returning function is unreachable by the control-flow analyzer.\"",
    "table": {
      "headers": [
        "Aspect",
        "void",
        "never"
      ],
      "rows": [
        [
          "Returns Control to Caller?",
          "✅ Yes (returns undefined)",
          "❌ No (execution halts or throws)"
        ],
        [
          "Return Value in JS",
          "undefined",
          "None (unreachable)"
        ],
        [
          "Set Theory Meaning",
          "Set containing undefined",
          "Empty set ∅ (zero inhabitants)"
        ],
        [
          "Primary Use Case",
          "Side-effect functions, onClick handlers",
          "Unconditional error throwers, exhaustive checks"
        ]
      ]
    },
    "code": "// Returns void: Caller receives control back!\nfunction logToConsole(message: string): void {\n  console.log(message);\n  // implicitly returns undefined\n}\n\n// Returns never: Caller NEVER receives control back!\nfunction throwFatalError(message: string): never {\n  throw new Error(message);\n}\n\nfunction processTask(task: { id: string } | null) {\n  if (!task) {\n    throwFatalError(\"Task cannot be null\");\n    // TypeScript knows any code here is completely UNREACHABLE!\n  }\n  console.log(task.id); // 'task' is narrowed to { id: string }\n}",
    "keyPoints": [
      "void: Function finishes execution and returns undefined.",
      "never: Function never completes execution (throws or infinite loop).",
      "Control-flow analysis treats code after a never call as dead/unreachable."
    ],
    "followUps": [
      {
        "q": "Why can a function returning void accept a callback that returns a value?",
        "a": "To accommodate common array methods. In TypeScript, a callback returning void means \"the caller will ignore any returned value\", allowing functions like [1, 2].forEach(x => set.add(x)) to typecheck cleanly."
      }
    ],
    "tip": "The void callback permissiveness question is one of the most famous senior TypeScript interview questions."
  },
  {
    "id": 21,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Top Types",
    "question": "What is `any`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`any` is TypeScript's universal escape hatch. It tells the compiler to completely disable type checking for that variable or expression. When a variable is typed as `any`, you can access arbitrary properties, call it as a function, assign it to any other type, or pass any arguments without a single compile-time warning. However, `any` is contagious: it propagates through assignments and completely undermines the safety guarantees of TypeScript, transforming compile-time contracts back into potential runtime crashes.\"",
    "code": "let untrustedData: any = \"Hello World\";\n\n// All of these compile with zero warnings, but crash at runtime:\n// untrustedData.nonExistentMethod(); // 💥 TypeError: not a function\n// untrustedData();                   // 💥 TypeError: not a function\n// const num: number = untrustedData; // ⚠️ Silent type contamination!",
    "keyPoints": [
      "Universal escape hatch: disables the type checker completely.",
      "Contagious: spreads through variables and disables safety downstream.",
      "Should be forbidden in strict production environments via noImplicitAny."
    ],
    "followUps": [
      {
        "q": "What ESLint rule forbids the use of any?",
        "a": "@typescript-eslint/no-explicit-any."
      }
    ],
    "tip": "Emphasize that any should only be used as a last resort during legacy code migrations."
  },
  {
    "id": 22,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Top Types",
    "question": "What is `unknown`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`unknown` is TypeScript's type-safe top type, introduced in TypeScript 3.0 as the safe alternative to `any`. Like `any`, any value in JavaScript can be assigned to `unknown`. However, unlike `any`, TypeScript **does not allow you to perform any operation on an `unknown` value**—you cannot access properties, call it, construct it, or assign it to another typed variable without first narrowing its type using `typeof`, `instanceof`, or a type guard. It is the gold standard for typing external, untrusted data like API payloads.\"",
    "code": "function handleApiResponse(payload: unknown) {\n  // ❌ Not allowed without narrowing:\n  // console.log(payload.data); \n  // Error: 'payload' is of type 'unknown'.\n\n  // ✅ Safe narrowing with typeof and in:\n  if (typeof payload === \"object\" && payload !== null && \"data\" in payload) {\n    console.log((payload as { data: string }).data);\n  }\n}",
    "keyPoints": [
      "Safe Top Type: accepts any value, but permits no operations without narrowing.",
      "Cannot be assigned to other types (except unknown and any) without explicit assertion or narrowing.",
      "Standard best practice for API payloads, JSON.parse results, and catch clauses."
    ],
    "followUps": [
      {
        "q": "Why does JSON.parse() return any instead of unknown in TypeScript standard library?",
        "a": "Historical reasons: JSON.parse was typed before unknown was introduced in TypeScript 3.0. Modern codebases wrap JSON.parse to return unknown."
      }
    ],
    "tip": "Always state that unknown is the typesafe counterweight to any."
  },
  {
    "id": 23,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Senior",
    "category": "Top Types",
    "question": "What is the difference between `any` and `unknown`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Both `any` and `unknown` are top types that can accept any value in the language. The critical difference is **type safety**: `any` turns off the compiler, allowing arbitrary property accesses and assignments to strictly typed variables, which silently causes runtime crashes. `unknown`, on the other hand, enforces strict compiler verification: you cannot dereference a single property or invoke an `unknown` value until you prove its type to the compiler through type narrowing, type predicates, or runtime schema parsing.\"",
    "table": {
      "headers": [
        "Operation",
        "any",
        "unknown"
      ],
      "rows": [
        [
          "Assign anything to it?",
          "✅ Yes",
          "✅ Yes"
        ],
        [
          "Assign it to a typed variable (e.g. number)?",
          "✅ Allowed silently (Dangerous)",
          "❌ Blocked by compiler"
        ],
        [
          "Access arbitrary properties (.foo)?",
          "✅ Allowed silently (Dangerous)",
          "❌ Blocked by compiler"
        ],
        [
          "Invoke as function ()?",
          "✅ Allowed silently (Dangerous)",
          "❌ Blocked by compiler"
        ],
        [
          "Requires type narrowing?",
          "❌ No",
          "✅ Yes (Mandatory)"
        ]
      ]
    },
    "code": "const rawApiData: unknown = JSON.parse('{\"userId\": 101}');\n// const id: number = rawApiData.userId; // ❌ Error: Property 'userId' does not exist on type 'unknown'.\n\nif (typeof rawApiData === \"object\" && rawApiData !== null && \"userId\" in rawApiData) {\n  const id = (rawApiData as { userId: number }).userId; // ✅ Type safe\n}",
    "keyPoints": [
      "any disables type checking; unknown enforces type verification.",
      "any is contagious; unknown halts unchecked propagation.",
      "Always prefer unknown for external data boundaries."
    ],
    "followUps": [
      {
        "q": "How does unknown interact with union and intersection types?",
        "a": "unknown | T is always unknown (absorbing element). unknown & T is always T (identity element)."
      }
    ],
    "tip": "Explaining union absorption (unknown | T === unknown) demonstrates deep mastery of type theory."
  },
  {
    "id": 24,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Senior",
    "category": "Bottom Type",
    "question": "What is the `never` type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`never` is TypeScript's bottom type. In type theory, a type is a set of possible values. While `unknown` is the universal set containing all possible values, `never` is the **empty set containing zero values**. No value can ever be assigned to `never` (except `never` itself). It is used to represent states that should be mathematically impossible—such as the return type of a function that unconditionally throws, an impossible type intersection like `string & number`, or the default branch of an exhaustive switch statement.\"",
    "code": "// 1. Impossible Intersection evaluates to never:\ntype Impossible = string & number; // never\n\n// 2. Exhaustive switch check:\ntype HttpAction = \"GET\" | \"POST\";\n\nfunction executeAction(action: HttpAction) {\n  switch (action) {\n    case \"GET\":\n      return \"Fetching data\";\n    case \"POST\":\n      return \"Submitting payload\";\n    default: {\n      const _exhaustiveCheck: never = action;\n      return _exhaustiveCheck;\n    }\n  }\n}",
    "keyPoints": [
      "Empty bottom type: contains zero values.",
      "Impossible to assign any value to never.",
      "Enables compile-time exhaustive checking for discriminated unions.",
      "Eliminated from union types: T | never evaluates to T."
    ],
    "followUps": [
      {
        "q": "What does T | never evaluate to in union types?",
        "a": "It evaluates to T, because the empty set adds no new members to the union. This is why conditional types use \"never\" to filter out unwanted union members."
      }
    ],
    "tip": "Explain that never is the mathematical identity element of union types (T | never === T)."
  },
  {
    "id": 25,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Void vs Undefined",
    "question": "What is the difference between `void` and `undefined`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`undefined` is a concrete JavaScript primitive value representing an unassigned state. A variable or function typed as returning `undefined` **must explicitly return the literal value `undefined`**. In contrast, `void` is a type-level construct indicating the **absence of a return value**. A function typed with `void` does not need an explicit return statement, and TypeScript will deliberately ignore any value that the function might happen to return in callback contexts.\"",
    "code": "// Must explicitly return undefined:\nfunction returnsUndefined(): undefined {\n  return undefined; // Omitting 'return undefined' produces a compile error!\n}\n\n// Does not need to return anything:\nfunction returnsVoid(): void {\n  console.log(\"Completed task\");\n  // No return statement required!\n}",
    "keyPoints": [
      "undefined: Concrete JavaScript primitive value; requires explicit return.",
      "void: Function return contract indicating the return value is intentionally ignored.",
      "In callback positions, void permits callbacks that return values, whereas undefined forbids it."
    ],
    "followUps": [
      {
        "q": "Can you assign undefined to a void variable?",
        "a": "Yes, undefined is assignable to void."
      }
    ],
    "tip": "Differentiate between the concrete JS primitive (undefined) and the TypeScript semantic contract (void)."
  },
  {
    "id": 26,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Compiler & Strictness",
    "question": "What does `strict` mode mean in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, setting `'strict': true` in `tsconfig.json` activates the master suite of strict type checking options. Instead of configuring flags individually, `strict: true` turns on `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, and `alwaysStrict`. It transforms TypeScript from an advisory linter into a rigorous, mathematically sound type system. It is non-negotiable for enterprise production applications.\"",
    "code": "// tsconfig.json:\n{\n  \"compilerOptions\": {\n    \"strict\": true // Automatically turns on all strict checks\n  }\n}",
    "keyPoints": [
      "Master flag enabling all major strict type invariants simultaneously.",
      "Guarantees strictNullChecks and noImplicitAny.",
      "Mandatory standard for all modern production TypeScript codebases."
    ],
    "followUps": [
      {
        "q": "Can you turn on strict but disable a specific rule?",
        "a": "Yes. You can specify \"strict\": true and then override a specific rule like \"noImplicitAny\": false, though this is discouraged."
      }
    ],
    "tip": "State that non-strict TypeScript is essentially self-defeating for modern applications."
  },
  {
    "id": 27,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Compiler & Strictness",
    "question": "What is `strictNullChecks`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`strictNullChecks` is the single most important compiler setting in TypeScript. When disabled, `null` and `undefined` are considered valid values for every type in the system—meaning a variable typed as `string` could secretly be `null` at runtime, leading to crashes. When `strictNullChecks: true` is enabled, `null` and `undefined` become distinct types. You can only assign `null` or `undefined` to a variable if you explicitly include them in a union type, such as `string | null`.\"",
    "code": "// With \"strictNullChecks\": false (DANGEROUS):\n// let name: string = null; // Allowed! name.toUpperCase() crashes at runtime!\n\n// With \"strictNullChecks\": true (SAFE):\nlet userName: string = \"Mohammed\";\n// userName = null; \n// ❌ Error: Type 'null' is not assignable to type 'string'.\n\nlet optionalName: string | null = null; // Explicit union required!",
    "keyPoints": [
      "Eliminates the \"Billion Dollar Mistake\" of implicit null assignment.",
      "null and undefined are treated as distinct domain types.",
      "Forces explicit unions (T | null | undefined) and runtime narrowing."
    ],
    "followUps": [
      {
        "q": "How does strictNullChecks affect optional properties in interfaces?",
        "a": "Optional properties (prop?: string) are treated as having the union type string | undefined."
      }
    ],
    "tip": "Reference Tony Hoare's Billion Dollar Mistake—interviewers love that historical engineering context."
  },
  {
    "id": 28,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Compiler & Strictness",
    "question": "What is `noImplicitAny`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`noImplicitAny` is a compiler flag that raises a compile error whenever TypeScript is unable to infer a specific type for a variable or parameter and would otherwise default to `any`. For example, in an unannotated function parameter `function log(x)`, TypeScript without this flag silently types `x` as `any`. With `noImplicitAny: true`, the compiler forces the developer to either provide an explicit type annotation or write code from which a specific type can be inferred.\"",
    "code": "// With \"noImplicitAny\": true:\n// function calculate(amount) { return amount * 2; }\n// ❌ Error: Parameter 'amount' implicitly has an 'any' type.\n\n// Corrected:\nfunction calculate(amount: number): number {\n  return amount * 2;\n}",
    "keyPoints": [
      "Flags any expression that would silently fall back to any.",
      "Prevents accidental type contamination across function boundaries.",
      "Mandatory flag included within strict: true."
    ],
    "followUps": [
      {
        "q": "Can you still use any if noImplicitAny is enabled?",
        "a": "Yes, you can still write explicit any (x: any). The flag only forbids implicit any where the developer omitted the type."
      }
    ],
    "tip": "Emphasize that noImplicitAny stops silent type leakage."
  },
  {
    "id": 29,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Type Assertions",
    "question": "What is type assertion?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A type assertion is a way to explicitly instruct the TypeScript compiler to treat a value as a specific type, using the `as` syntax, such as `data as UserDTO`. It is effectively telling the compiler: 'Trust me, I know more about this value's runtime shape than you do.' Type assertions do NOT perform any runtime data conversion or validation, nor do they modify the emitted JavaScript. If the developer's assertion about the runtime shape is incorrect, downstream code will still throw runtime exceptions.\"",
    "code": "// DOM query returns Element | null\nconst button = document.getElementById(\"submit-btn\") as HTMLButtonElement;\n\n// TypeScript now allows access to HTMLButtonElement properties:\nbutton.disabled = true;",
    "keyPoints": [
      "Syntax: value as TargetType (or legacy <TargetType>value).",
      "Overrides the compiler type deduction without runtime checks.",
      "Only permitted when types overlap; completely disjoint assertions require as unknown as TargetType."
    ],
    "followUps": [
      {
        "q": "Why is the angle-bracket syntax <HTMLButtonElement>button discouraged in React TSX files?",
        "a": "It conflicts with JSX element syntax (<Component />), causing syntax parsing ambiguities. The \"as\" syntax is universally preferred."
      }
    ],
    "tip": "Always warn that type assertions are a potential safety smell if used to bypass runtime validation."
  },
  {
    "id": 30,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Type Assertions",
    "question": "What is the difference between type assertion and type conversion?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type assertion is a **pure compile-time directive** that changes the compiler's view of an expression's type without altering the underlying JavaScript value or emitting any code. Type conversion (or casting/coercion) is a **runtime operation** that actively transforms a value from one JavaScript data type representation to another—such as converting the string `'42'` to the number `42` using `Number('42')`. Type assertions vanish at build time; type conversions execute in memory at runtime.\"",
    "table": {
      "headers": [
        "Feature",
        "Type Assertion (val as Type)",
        "Type Conversion (Number(val))"
      ],
      "rows": [
        [
          "Execution Phase",
          "Compile time only (Type Checker)",
          "Runtime execution (V8 engine)"
        ],
        [
          "Emitted JS Impact",
          "Erased completely",
          "Emits real function calls"
        ],
        [
          "Runtime Value Change",
          "Zero change to value",
          "Transforms value representation in memory"
        ],
        [
          "Failure Mode",
          "Downstream TypeError if incorrect",
          "Produces NaN or coerced fallback value"
        ]
      ]
    },
    "code": "// Type Assertion: Does NOT change the value at runtime\nconst rawValue: any = \"123\";\nconst asserted = rawValue as number;\nconsole.log(typeof asserted); // Still \"string\" at runtime!\n\n// Type Conversion: Actually changes the value representation in V8\nconst converted = Number(rawValue);\nconsole.log(typeof converted); // \"number\" at runtime!",
    "keyPoints": [
      "Type assertion (as T): Instructs compiler; emits NO JavaScript.",
      "Type conversion (Number(), String()): Transforms memory representation at runtime.",
      "Never confuse as with runtime parsing."
    ],
    "followUps": [
      {
        "q": "When is a type assertion genuinely appropriate in production?",
        "a": "When narrowing DOM elements (document.getElementById), interacting with untyped CJS libraries, or in unit tests creating mock fixtures."
      }
    ],
    "tip": "Directly contrasting as number with Number(x) is the fastest way to get full points on this question."
  },
  {
    "id": 31,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Beginner",
    "category": "Unions",
    "question": "What is a union type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A union type in TypeScript describes a value that can be one of several distinct types, expressed using the pipe character (`|`), such as `string | number`. In set theory terms, a union represents the mathematical union of two or more sets. Before you can perform operations specific to one member of the union (like calling `.toFixed()` on a number), you must narrow the union using control-flow checks like `typeof`. Without narrowing, the compiler only permits property access to members that are common to all types in the union.\"",
    "code": "function printId(id: string | number) {\n  // Common properties or methods can be accessed directly:\n  console.log(id.toString());\n\n  // Specific member operations require narrowing:\n  if (typeof id === \"string\") {\n    console.log(id.toUpperCase());\n  } else {\n    console.log(id.toFixed(2));\n  }\n}",
    "keyPoints": [
      "Syntax: TypeA | TypeB.",
      "Represents mathematical set union: value can be any member.",
      "Only common properties are accessible prior to narrowing.",
      "Heavily used for status codes, IDs, and domain state models."
    ],
    "followUps": [
      {
        "q": "What happens if you access a property that only exists on one member of a union?",
        "a": "The compiler emits an error like: Property \"x\" does not exist on type \"TypeA | TypeB\". You must narrow the type first using in, typeof, or instanceof."
      }
    ],
    "tip": "Explain that unions represent \"OR\" logic in type space."
  },
  {
    "id": 32,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Intersections",
    "question": "What is an intersection type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An intersection type combines multiple types into a single unified contract using the ampersand character (`&`), such as `TypeA & TypeB`. An object conforming to an intersection must satisfy all constituent types simultaneously—possessing every property and method declared in each combined type. It is widely used to compose domain models, mixins, and higher-order component props. Intersecting incompatible primitive types (such as `string & number`) collapses to `never`.\"",
    "code": "type Timestamped = { createdAt: Date; updatedAt: Date };\ntype SoftDeletable = { isDeleted: boolean; deletedAt?: Date };\n\n// Composed Entity:\ntype BaseEntity = Timestamped & SoftDeletable;\n\nconst userRecord: BaseEntity = {\n  createdAt: new Date(),\n  updatedAt: new Date(),\n  isDeleted: false\n};",
    "keyPoints": [
      "Syntax: TypeA & TypeB.",
      "Value must satisfy all intersected contracts simultaneously.",
      "Widely used for entity composition and React prop extension.",
      "Incompatible primitives (string & number) evaluate to never."
    ],
    "followUps": [
      {
        "q": "How does an intersection resolve conflicting property types, like { id: string } & { id: number }?",
        "a": "The conflicting property itself becomes an intersection of the two types: id: string & number, which collapses to id: never, making the object impossible to instantiate."
      }
    ],
    "tip": "Mentioning that conflicting property intersections collapse to never shows advanced type-system reasoning."
  },
  {
    "id": 33,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Narrowing",
    "question": "What is type narrowing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type narrowing is the process by which TypeScript's Control Flow Analysis (CFA) inspects runtime JavaScript branching logic—such as `if` statements, `switch` statements, `typeof`, `instanceof`, and equality checks—to refine a broad type (like a union `string | number | null`) down to a more specific, narrower subtype within that code branch. Once narrowed, the compiler unlocks operations and methods unique to that specific subtype without requiring any type assertions.\"",
    "code": "function processPayment(amount: number | null | undefined) {\n  // Broad type: number | null | undefined\n  if (amount == null) {\n    // Narrowed to: null | undefined (eliminates number)\n    return \"No charge applied\";\n  }\n  // Downstream from check, 'amount' is narrowed to strictly 'number'!\n  return `$ ${amount.toFixed(2)}`;\n}",
    "keyPoints": [
      "Powered by TypeScript Control Flow Analysis (CFA).",
      "Refines broad union types into specific concrete types inside branches.",
      "Works with typeof, instanceof, in, equality (===), truthiness, and custom type guards."
    ],
    "followUps": [
      {
        "q": "What is assignment-based narrowing?",
        "a": "When a variable declared with a union type is reassigned a specific value, TypeScript narrows the variable's type to that specific value for subsequent lines until another reassignment occurs."
      }
    ],
    "tip": "Control Flow Analysis (CFA) is the technical term interviewers want to hear."
  },
  {
    "id": 34,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Beginner",
    "category": "Narrowing",
    "question": "What is `typeof` narrowing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`typeof` narrowing uses JavaScript's runtime `typeof` operator within conditional branches to narrow primitive union types. TypeScript's compiler understands the return values of `typeof`—specifically `'string'`, `'number'`, `'boolean'`, `'bigint'`, `'symbol'`, `'undefined'`, `'object'`, and `'function'`. When you write `if (typeof val === 'string')`, TypeScript automatically narrows the variable to `string` inside that block.\"",
    "code": "function padLeft(value: string, padding: string | number): string {\n  if (typeof padding === \"number\") {\n    // Narrowed to 'number'\n    return \" \".repeat(padding) + value;\n  }\n  // Narrowed to 'string'\n  return padding + value;\n}",
    "keyPoints": [
      "Inspects JavaScript primitive types at runtime.",
      "Understands all 8 typeof return string values.",
      "Watch out: typeof null returns \"object\" in JavaScript (the infamous typeof null bug)."
    ],
    "followUps": [
      {
        "q": "Why can typeof val === \"object\" be misleading when narrowing null | { id: string }?",
        "a": "Because in JavaScript typeof null evaluates to \"object\". Checking typeof val === \"object\" still includes null; you must write typeof val === \"object\" && val !== null."
      }
    ],
    "tip": "Always mention the typeof null === \"object\" quirk when discussing typeof narrowing."
  },
  {
    "id": 35,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Narrowing",
    "question": "What is `instanceof` narrowing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`instanceof` narrowing uses JavaScript's prototype-chain check to narrow values to specific class constructors. When you test `if (err instanceof CustomError)`, TypeScript inspects the prototype chain at runtime and narrows the variable to `CustomError` within the truthy branch. It is essential for error handling, Date objects, RegExps, and DOM node hierarchies.\"",
    "code": "class AuthenticationError extends Error {\n  code = \"AUTH_EXPIRED\";\n}\n\nfunction handleError(err: unknown) {\n  if (err instanceof AuthenticationError) {\n    // Narrowed to AuthenticationError; code property is accessible:\n    console.error(\"Auth Failure:\", err.code, err.message);\n  } else if (err instanceof Error) {\n    // Narrowed to standard Error:\n    console.error(\"General Failure:\", err.message);\n  }\n}",
    "keyPoints": [
      "Inspects prototype chain via Constructor.prototype.",
      "Narrows unknown or Error unions to concrete class instances.",
      "Cannot be used with plain TypeScript interfaces or type aliases (they do not exist at runtime!)."
    ],
    "followUps": [
      {
        "q": "Can you use instanceof to check if a value implements an interface like interface User {}?",
        "a": "No. Interfaces are completely erased at compile-time and have no runtime prototype or constructor. instanceof requires a real runtime class or constructor function."
      }
    ],
    "tip": "Stressing that interfaces cannot be checked with instanceof demonstrates solid type-erasure understanding."
  },
  {
    "id": 36,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Narrowing",
    "question": "What is the `in` operator in type narrowing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The `in` operator narrows unions of object types by checking for the existence of a specific property name on an object at runtime: `if ('prop' in obj)`. TypeScript inspects which types in the union declare that property; inside the `if` branch, the variable is narrowed to only those types that include the property. It is particularly effective for discriminating between different interfaces when they do not share a formal discriminator property.\"",
    "code": "interface EmailRecipient { email: string }\ninterface SmsRecipient { phoneNumber: string }\n\nfunction sendAlert(recipient: EmailRecipient | SmsRecipient) {\n  if (\"email\" in recipient) {\n    // Narrowed to EmailRecipient\n    console.log(\"Sending email to:\", recipient.email);\n  } else {\n    // Narrowed to SmsRecipient\n    console.log(\"Sending SMS to:\", recipient.phoneNumber);\n  }\n}",
    "keyPoints": [
      "Syntax: \"propertyName\" in object.",
      "Narrows union types based on whether the property is declared in the member types.",
      "Safe and effective alternative when discriminated union tags are absent."
    ],
    "followUps": [
      {
        "q": "Can you use the in operator on unknown or primitive types?",
        "a": "In modern TypeScript (4.9+), \"prop\" in val safely narrows unknown by first verifying that the value is an object before checking the property."
      }
    ],
    "tip": "The in operator is the best tool for narrowing when you cannot change external third-party object shapes."
  },
  {
    "id": 37,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Senior",
    "category": "Discriminated Unions",
    "question": "What is a discriminated union?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A discriminated union (also known as a tagged union or algebraic data type) is a union of object types where each member shares a common, literal property called the discriminator or tag—such as `status: 'loading' | 'success' | 'error'`. When you branch on this discriminator using an `if` or `switch` statement, TypeScript automatically narrows the object to the exact variant corresponding to that literal. It completely eliminates impossible states in state management, Redux actions, and API communication.\"",
    "code": "// Discriminated Union for Payment Flow:\ntype PaymentState =\n  | { status: \"IDLE\" }\n  | { status: \"PROCESSING\"; transactionId: string }\n  | { status: \"SUCCESS\"; receiptUrl: string; amount: number }\n  | { status: \"FAILED\"; errorCode: string; retryAllowed: boolean };\n\nfunction handlePayment(state: PaymentState) {\n  switch (state.status) {\n    case \"PROCESSING\":\n      return `Transaction pending: ${state.transactionId}`;\n    case \"SUCCESS\":\n      return `Paid $${state.amount}. Receipt: ${state.receiptUrl}`;\n    case \"FAILED\":\n      return `Declined [${state.errorCode}]. Retry: ${state.retryAllowed}`;\n    case \"IDLE\":\n      return \"Waiting for checkout submission\";\n  }\n}",
    "keyPoints": [
      "Union of object types sharing a common literal property (the discriminator).",
      "Enables effortless, exhaustive narrowing via switch or if statements.",
      "Eliminates impossible UI and data states in production software."
    ],
    "followUps": [
      {
        "q": "How do you guarantee that every case of a discriminated union is handled?",
        "a": "Add a default branch with const _exhaustiveCheck: never = state; throw new Error(_exhaustiveCheck);. If a new member is added to the union, TypeScript triggers a compile-time error."
      }
    ],
    "tip": "Discriminated unions are considered the single most powerful architectural pattern in TypeScript."
  },
  {
    "id": 38,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Senior",
    "category": "Type Predicates",
    "question": "What is a type predicate?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A type predicate is a special return type annotation for user-defined type guard functions, using the syntax `paramName is Type`, such as `pet is Dog`. Normally, helper functions returning boolean lose their narrowing effect once evaluated. By annotating the return type with a type predicate, you instruct the TypeScript compiler: 'If this function returns true at runtime, narrow the passed parameter to this specific type in the calling scope.' It is the primary vehicle for building reusable, encapsulated runtime validation guards.\"",
    "code": "interface AdminUser {\n  id: string;\n  role: \"ADMIN\";\n  permissions: string[];\n}\n\n// User-Defined Type Guard with Type Predicate:\nfunction isAdmin(user: unknown): user is AdminUser {\n  return (\n    typeof user === \"object\" &&\n    user !== null &&\n    \"role\" in user &&\n    (user as any).role === \"ADMIN\" &&\n    Array.isArray((user as any).permissions)\n  );\n}\n\nfunction accessAdminConsole(user: unknown) {\n  if (isAdmin(user)) {\n    // 'user' is safely narrowed to AdminUser!\n    console.log(\"Admin permissions:\", user.permissions.join(\", \"));\n  }\n}",
    "keyPoints": [
      "Syntax: function isType(val: unknown): val is TargetType.",
      "Preserves narrowing across function boundaries.",
      "Commonly used with Array.prototype.filter to strip null or filter specific types: arr.filter(isDefined)."
    ],
    "followUps": [
      {
        "q": "How do you filter out null and undefined from an array of (string | null)[] using a type predicate?",
        "a": "Define function isNonNullable<T>(val: T): val is NonNullable<T> { return val !== null && val !== undefined; }. Then arr.filter(isNonNullable) returns string[] instead of (string | null)[]."
      }
    ],
    "tip": "Mentioning the array filter type predicate trick (arr.filter(isNonNullable)) is an instant hire signal."
  },
  {
    "id": 39,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Senior",
    "category": "satisfies Operator",
    "question": "What is the difference between `as` and `satisfies`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`as` is a **type assertion** that forces the compiler to treat a value as the target type, potentially masking errors if the value is missing required fields or has incompatible types. In contrast, `satisfies` (introduced in TypeScript 4.9) **validates that an expression matches a type or interface WITHOUT upcasting or widening the inferred type**. With `satisfies`, TypeScript enforces structural compliance while preserving the exact literal types, member keys, and method return signatures of the original object.\"",
    "table": {
      "headers": [
        "Dimension",
        "Type Assertion (as T)",
        "satisfies Operator (expr satisfies T)"
      ],
      "rows": [
        [
          "Validation Rigor",
          "Weak: Overrides compiler checks",
          "Strict: Compiler validates all properties"
        ],
        [
          "Inferred Type",
          "Forced to T (loses exact literal keys)",
          "Retains exact inferred literal types and shapes"
        ],
        [
          "Typo Detection",
          "Can mask missing or misnamed properties",
          "Catches typos immediately"
        ],
        [
          "Recommended Use",
          "DOM elements, legacy integration",
          "Configuration objects, theme palettes, routing tables"
        ]
      ]
    },
    "code": "type Colors = \"red\" | \"green\" | \"blue\";\ntype RGB = [number, number, number];\ntype Theme = Record<Colors, string | RGB>;\n\n// 1. With 'as Theme' (Dangerous, widens types):\n// const bad = { red: [255, 0, 0], green: \"#00ff00\" } as Theme;\n// bad.red.map(x => x); // Error: Property 'map' does not exist on string | RGB!\n\n// 2. With 'satisfies Theme' (Safe, preserves exact types):\nconst good = {\n  red: [255, 0, 0],\n  green: \"#00ff00\",\n  blue: \"#0000ff\"\n} satisfies Theme;\n\n// Exact types preserved!\ngood.red.map(val => val * 2); // ✅ Valid! TS knows 'red' is specifically RGB tuple.\ngood.green.toUpperCase();     // ✅ Valid! TS knows 'green' is specifically string.",
    "keyPoints": [
      "satisfies validates type conformance without widening or upcasting.",
      "Preserves exact literal types and sub-properties for autocompletion.",
      "Direct replacement for type annotations on complex configuration objects."
    ],
    "followUps": [
      {
        "q": "Why should you use satisfies for routing tables and navigation config in React?",
        "a": "Because satisfies ensures the routes conform to the RouteConfig interface while keeping the exact path string literals for type-safe navigation hooks like navigate(\"/dashboard/billing\")."
      }
    ],
    "tip": "satisfies is one of the most celebrated additions to modern TypeScript—explain it proudly."
  },
  {
    "id": 40,
    "partId": 2,
    "section": "B. Basic types, primitives, and special types",
    "difficulty": "Intermediate",
    "category": "Non-Null Assertion",
    "question": "What is the non-null assertion operator (`!`)?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The non-null assertion operator is a postfix exclamation mark (`val!`) that tells the TypeScript compiler to assert that a value is neither `null` nor `undefined`, stripping those types from the union. It is purely a compile-time directive with zero emitted runtime JavaScript. While convenient when the developer possesses domain knowledge that the compiler cannot deduce (such as finding an element in a test DOM), overusing it in production is dangerous because if the value actually is null, downstream code will crash with an unhandled TypeError.\"",
    "code": "// Finding DOM element:\nconst input = document.getElementById(\"search-input\")!; // Strips 'null'\ninput.focus(); // No compiler error\n\n// ⚠️ If element doesn't exist: 💥 TypeError: Cannot read properties of null (reading 'focus')!\n\n// ✅ Safer Alternative: Optional Chaining with Nullish Coalescing\nconst safeInput = document.getElementById(\"search-input\");\nsafeInput?.focus();",
    "keyPoints": [
      "Postfix ! removes null and undefined from the type at compile-time.",
      "Emits zero runtime check code.",
      "Prefer optional chaining (?.) or explicit runtime if-checks in production."
    ],
    "followUps": [
      {
        "q": "What is the definite assignment assertion in TypeScript classes?",
        "a": "Placing ! on a class property (e.g. name!: string) tells the compiler that the property will be initialized elsewhere (such as via dependency injection or ngOnInit), satisfying strictPropertyInitialization."
      }
    ],
    "tip": "Always emphasize preferring optional chaining (?.) over non-null assertions in client code."
  },
  {
    "id": 41,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Beginner",
    "category": "Interfaces",
    "question": "What is an interface in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An interface in TypeScript is a named declaration that defines the structural shape and contract of an object, class, or function. It specifies the names, types, optionality, and mutability of its properties and methods. Interfaces are open-ended—meaning multiple interface declarations with the same name in the same scope automatically merge through declaration merging. They can extend other interfaces using the `extends` keyword and be implemented by classes using the `implements` keyword.\"",
    "code": "interface PaymentGateway {\n  readonly gatewayName: string;\n  isLive: boolean;\n  charge(amount: number, currency: string): Promise<{ success: boolean; txId: string }>;\n}\n\nconst stripeGateway: PaymentGateway = {\n  gatewayName: \"Stripe\",\n  isLive: true,\n  async charge(amount, currency) {\n    return { success: true, txId: \"ch_123\" };\n  }\n};",
    "keyPoints": [
      "Defines the shape and contract of an object or class.",
      "Supports declaration merging (re-declaring merges members).",
      "Can extend multiple interfaces via extends.",
      "Completely erased at compile time."
    ],
    "followUps": [
      {
        "q": "Can an interface define callable or construct signatures?",
        "a": "Yes. An interface can declare callable signatures ((): void) and constructor signatures (new (): MyClass) to type factory functions and constructors."
      }
    ],
    "tip": "Interfaces are ideal for defining public API contracts and class implementation blueprints."
  },
  {
    "id": 42,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Beginner",
    "category": "Type Aliases",
    "question": "What is a type alias?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A type alias in TypeScript is a name given to any valid type, declared using the `type` keyword, such as `type ID = string | number`. Unlike interfaces, which are limited to describing object shapes and functions, type aliases can represent primitives, unions, intersections, tuples, mapped types, conditional types, and function signatures. Type aliases are immutable once declared; they cannot participate in declaration merging.\"",
    "code": "// 1. Primitive alias:\ntype UUID = string;\n\n// 2. Union type alias:\ntype OrderStatus = \"PENDING\" | \"PAID\" | \"SHIPPED\" | \"CANCELLED\";\n\n// 3. Object type alias:\ntype OrderSummary = {\n  orderId: UUID;\n  status: OrderStatus;\n  total: number;\n};",
    "keyPoints": [
      "Syntax: type Name = TypeDefinition.",
      "Can represent any type: primitives, unions, tuples, functions, mapped types.",
      "Cannot be reopened or merged through declaration merging."
    ],
    "followUps": [
      {
        "q": "Does creating a type alias create a new runtime type or class?",
        "a": "No. Type aliases create no new runtime entities; they are merely compile-time aliases for existing type structures."
      }
    ],
    "tip": "Remember: interfaces can only describe object shapes; type aliases can describe anything."
  },
  {
    "id": 43,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Senior",
    "category": "Interfaces vs Types",
    "question": "What is the difference between `interface` and `type`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"While `interface` and `type` both describe object structures, they have key architectural differences. `interface` is open-ended and supports **declaration merging**, making it the mandatory standard for library definitions and module augmentation. Interfaces also yield slightly faster compiler type-checking because the compiler caches flat object shapes by name. On the other hand, `type` aliases are far more expressive: they can define **unions, primitives, tuples, mapped types, and conditional types**, none of which can be expressed as an interface. On modern senior teams, we use interfaces for public API models and class contracts, and type aliases for unions, utilities, and complex transformations.\"",
    "table": {
      "headers": [
        "Feature",
        "interface",
        "type Alias"
      ],
      "rows": [
        [
          "Declaration Merging",
          "✅ Supported (automatic merging)",
          "❌ Syntax Error (duplicate identifier)"
        ],
        [
          "Unions & Primitives",
          "❌ Cannot declare unions directly",
          "✅ Fully supported (type X = A | B)"
        ],
        [
          "Mapped / Conditional Types",
          "❌ Cannot be an interface",
          "✅ Fully supported (type Readonly<T> = ...)"
        ],
        [
          "Extends Mechanism",
          "`interface B extends A`",
          "`type B = A & { ... }` (Intersection)"
        ],
        [
          "Compiler Shape Caching",
          "Slightly faster for flat objects",
          "Slightly slower for deep intersections"
        ]
      ]
    },
    "code": "// Interfaces merge:\ninterface AppConfig { apiUrl: string; }\ninterface AppConfig { timeoutMs: number; } // Merged!\n\n// Type aliases do NOT merge:\ntype AppTheme = { primary: string };\n// type AppTheme = { secondary: string }; // ❌ Error: Duplicate identifier 'AppTheme'.",
    "keyPoints": [
      "Interfaces merge; type aliases do not.",
      "Types can declare unions, primitives, and mapped types; interfaces cannot.",
      "Interfaces are best for external library contracts; types for internal domain logic."
    ],
    "followUps": [
      {
        "q": "Why does the TypeScript compiler perform faster with interfaces than deep type intersections?",
        "a": "Interfaces create a single named flat shape in the internal compiler cache. Intersections create compound type structures that must be recursively checked for conflicting properties."
      }
    ],
    "tip": "Explaining compiler shape caching is a massive differentiator in senior interviews."
  },
  {
    "id": 44,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Intermediate",
    "category": "Interfaces",
    "question": "Can an interface extend another interface?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Yes, an interface can extend one or more interfaces using the `extends` keyword, inheriting all of their properties and methods. Multiple inheritance is fully supported: an interface can extend multiple parent interfaces separated by commas, such as `interface C extends A, B`. When extending, the child interface can also refine or narrow parent property types, provided the refined type is assignable to the parent type.\"",
    "code": "interface Identifiable {\n  id: string;\n}\n\ninterface Auditable {\n  createdAt: Date;\n  updatedAt: Date;\n}\n\n// Extends multiple parent interfaces:\ninterface UserProfile extends Identifiable, Auditable {\n  email: string;\n  role: \"ADMIN\" | \"USER\";\n}",
    "keyPoints": [
      "Syntax: interface Child extends Parent1, Parent2.",
      "Inherits all properties from parents.",
      "Child can narrow (subtype) parent property types, but cannot contradict them."
    ],
    "followUps": [
      {
        "q": "Can an interface extend a type alias?",
        "a": "Yes, an interface can extend any type alias that statically resolves to an object shape or statically known intersection of object shapes."
      }
    ],
    "tip": "Mentioning that interfaces can extend type aliases (as long as they are object shapes) is a great subtle detail."
  },
  {
    "id": 45,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Intermediate",
    "category": "Type Aliases",
    "question": "Can a type alias extend another type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A type alias cannot use the `extends` keyword like an interface; instead, it achieves inheritance and composition through **intersection types (`&`)**. By intersecting one type alias with an object literal or another type alias (`type Employee = Person & { employeeId: string }`), the resulting type inherits all properties from both constituents.\"",
    "code": "type Person = {\n  name: string;\n  age: number;\n};\n\n// \"Extending\" via Intersection:\ntype Employee = Person & {\n  employeeId: string;\n  department: string;\n};\n\nconst dev: Employee = {\n  name: \"Alex\",\n  age: 32,\n  employeeId: \"EMP-404\",\n  department: \"Platform Engineering\"\n};",
    "keyPoints": [
      "Type aliases compose using intersection types (&), not extends.",
      "Can intersect object types, interfaces, and utility types.",
      "Creates a compound type that must satisfy all members."
    ],
    "followUps": [
      {
        "q": "What is the syntactic difference between interface extends and type intersection error messages?",
        "a": "When an interface extends another interface with conflicting properties, the error is caught at the interface declaration. With type intersections, the conflict produces never on the property and is only caught when you try to instantiate the object."
      }
    ],
    "tip": "Highlighting when errors are caught (at declaration vs instantiation) shows deep compiler empathy."
  },
  {
    "id": 46,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Senior",
    "category": "Declaration Merging",
    "question": "What is declaration merging?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Declaration merging is a unique TypeScript mechanism where the compiler automatically merges two or more separate declarations sharing the same name into a single definition. The most common form is **interface merging**: if an interface `User` is declared twice in the same scope, the resulting `User` interface contains the union of all properties declared across both definitions. This is the foundation of module augmentation, enabling developers to safely attach custom properties to global objects like `window`, Express `Request`, or third-party npm libraries without modifying their source code.\"",
    "code": "// Base interface:\ninterface Window {\n  appVersion: string;\n}\n\n// Augmenting Window elsewhere in the project:\ninterface Window {\n  analyticsTracker?: { track(event: string): void };\n}\n\n// The resulting Window interface contains both properties:\nwindow.appVersion = \"2.4.0\";\nwindow.analyticsTracker?.track(\"PAGE_VIEW\");",
    "keyPoints": [
      "Multiple interface declarations with the same name automatically merge.",
      "Non-function members must have identical types; function overloads are merged in declaration order.",
      "Powers global augmentation and Express Request typing in full-stack apps."
    ],
    "followUps": [
      {
        "q": "Can classes or type aliases participate in declaration merging?",
        "a": "Type aliases cannot merge (duplicate identifier error). Classes can merge with interfaces and namespaces, but not with other classes."
      }
    ],
    "tip": "Declaration merging is the #1 question asked when interviewing for Node.js / Express backend roles with TypeScript."
  },
  {
    "id": 47,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Beginner",
    "category": "Object Modifiers",
    "question": "What is a readonly property?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A `readonly` property in an interface or type alias is a property that can only be assigned during initial object creation or inside a class constructor. Subsequent attempts to reassign the property will trigger a compile-time error. It enforces immutability at the compiler level, which is critical for state management libraries like Redux and Zustand. Note that `readonly` is shallow: if the property holds a reference to a mutable array or object, the inner elements can still be mutated unless typed with `readonly` recursively.\"",
    "code": "interface Config {\n  readonly apiKey: string;\n  readonly tags: string[]; // Shallow readonly!\n}\n\nconst config: Config = {\n  apiKey: \"sk_live_123\",\n  tags: [\"production\"]\n};\n\n// config.apiKey = \"new_key\"; // ❌ Error: Cannot assign to 'apiKey' because it is a read-only property.\nconfig.tags.push(\"us-east-1\"); // ⚠️ Allowed! Array reference didn't change!\n\n// For deep immutability:\n// readonly tags: readonly string[];",
    "keyPoints": [
      "Prevents property reassignment after initialization.",
      "Shallow enforcement: reference is immutable, nested contents remain mutable.",
      "Purely compile-time: erased in emitted JavaScript (does not call Object.freeze)."
    ],
    "followUps": [
      {
        "q": "Does TypeScript readonly call Object.freeze() at runtime?",
        "a": "No. readonly is completely erased during compilation. For true runtime immutability, you must explicitly call Object.freeze()."
      }
    ],
    "tip": "Always emphasize that readonly is compile-time only and shallow by default."
  },
  {
    "id": 48,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Intermediate",
    "category": "Index Signatures",
    "question": "What is an index signature?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An index signature allows you to define the types for dynamic properties on an object when you don't know the exact property keys ahead of time, using syntax like `[key: string]: number`. The key type in an index signature can only be `string`, `number`, `symbol`, or a template literal pattern. An essential rule: all explicitly declared properties on the object must have types that are assignable to the index signature's return type.\"",
    "code": "interface CurrencyRates {\n  baseCurrency: string; // Error if index signature doesn't accept string!\n  [currencyCode: string]: string | number; // Index signature\n}\n\nconst rates: CurrencyRates = {\n  baseCurrency: \"USD\",\n  EUR: 0.92,\n  GBP: 0.79,\n  JPY: 155.4\n};",
    "keyPoints": [
      "Syntax: [key: KeyType]: ValueType.",
      "Keys can be string, number, symbol, or template literals.",
      "Explicit properties must conform to the index signature value type.",
      "Prefer Record<string, T> or Map for clean dictionary abstractions."
    ],
    "followUps": [
      {
        "q": "How does noUncheckedIndexedAccess affect index signatures?",
        "a": "With noUncheckedIndexedAccess: true, accessing rates[\"EUR\"] evaluates to (string | number | undefined), forcing you to verify existence before usage."
      }
    ],
    "tip": "Connecting index signatures with noUncheckedIndexedAccess proves senior-level production experience."
  },
  {
    "id": 49,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Intermediate",
    "category": "Interfaces",
    "question": "How do you define methods in an interface?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You can define methods in an interface using two distinct syntaxes: **Method Syntax** (`calculate(amount: number): number`) and **Property-with-Function Syntax** (`calculate: (amount: number) => number`). While they look similar, under `strictFunctionTypes: true`, TypeScript treats them differently: method syntax parameters are checked **bivariantly** (for historical reasons to allow array methods like `push`), whereas property syntax parameters are checked **contravariantly** (much stricter and safer). Senior teams prefer property syntax for function members to ensure full type safety.\"",
    "code": "interface PaymentService {\n  // 1. Method syntax (bivariant parameter checking):\n  process(amount: number): Promise<boolean>;\n\n  // 2. Property syntax (contravariant parameter checking - strictly safer!):\n  refund: (txId: string, reason?: string) => Promise<boolean>;\n}",
    "keyPoints": [
      "Method syntax: name(params): ReturnType.",
      "Property syntax: name: (params) => ReturnType.",
      "Under strictFunctionTypes, property syntax enforces safer contravariant parameter checking."
    ],
    "followUps": [
      {
        "q": "Why are method syntax parameters bivariant?",
        "a": "To maintain compatibility with built-in JavaScript patterns like Array<T>, where methods like push(...items: T[]) need to accept subtypes in mutable arrays."
      }
    ],
    "tip": "Mentioning method bivariance vs property contravariance will stun most interviewers."
  },
  {
    "id": 50,
    "partId": 3,
    "section": "C. Interfaces and object-type modeling",
    "difficulty": "Senior",
    "category": "Structural Typing",
    "question": "What is structural typing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Structural typing—often called 'duck typing' in dynamic languages—is a type-system philosophy where type compatibility and equivalence are based entirely on the **structure and shape of the data**, rather than explicit nominal declarations or inheritance hierarchies. In TypeScript, if type `A` possesses all the required properties and methods of type `B` with compatible types, `A` is assignable to `B`, even if `A` was declared under a completely different name, in another package, or as an anonymous object literal. This contrasts with nominal languages like Java or C#, where compatibility requires explicit class inheritance.\"",
    "code": "interface Point2D {\n  x: number;\n  y: number;\n}\n\nclass Vector2D {\n  constructor(public x: number, public y: number, public magnitude: number) {}\n}\n\nfunction plot(point: Point2D) {\n  console.log(`Plotting: ${point.x}, ${point.y}`);\n}\n\n// Vector2D has 'x' and 'y', so it structurally satisfies Point2D!\nconst vec = new Vector2D(10, 20, 22.36);\nplot(vec); // ✅ Valid! No 'implements Point2D' needed!",
    "keyPoints": [
      "Type compatibility is determined by shape (properties and methods), not declared name.",
      "If it walks like a duck and quacks like a duck, TypeScript treats it as a duck.",
      "Allows frictionless interop between independently authored libraries.",
      "Can be bypassed using Branded (Nominal) types when exact identity is required."
    ],
    "followUps": [
      {
        "q": "Why does direct object literal assignment fail with extra properties (excess property checking) if TypeScript is structurally typed?",
        "a": "Because excess property checking is a specialized compiler heuristic designed specifically for fresh object literals to catch typos. Once assigned to a variable, standard structural assignability applies."
      }
    ],
    "tip": "This is the core conceptual foundation of TypeScript. Speak about it with confidence."
  },
  {
    "id": 51,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Beginner",
    "category": "Generics",
    "question": "What are generics in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Generics are TypeScript's mechanism for writing reusable, type-safe code that can operate over a variety of types rather than a single fixed type, while preserving exact type relationships. Think of generics as **type variables**: just as regular function parameters pass runtime values, generic parameters pass compile-time types (such as `<T>`). Generics eliminate code duplication while avoiding the type-safety hazards of `any`.\"",
    "code": "// Generic Identity Function:\nfunction identity<T>(value: T): T {\n  return value;\n}\n\nconst str = identity(\"Hello\"); // T is inferred as 'string', return is 'string'\nconst num = identity(42);      // T is inferred as 'number', return is 'number'",
    "keyPoints": [
      "Type variables (T, U, V) representing parameterized types.",
      "Preserves relationships between inputs, outputs, and properties.",
      "Can be applied to functions, interfaces, classes, and type aliases."
    ],
    "followUps": [
      {
        "q": "What is the naming convention for generic type parameters?",
        "a": "Single capital letters starting with T (T, U, V) for simple utilities, or descriptive names like TData, TError, TEntity in enterprise domain models."
      }
    ],
    "tip": "Frame generics as \"functions for types\" in your mental model."
  },
  {
    "id": 52,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generics",
    "question": "Why use generics instead of `any`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Using `any` loses all type safety, autocompletion, and compiler verification: if you pass a string to a function returning `any`, the compiler has no idea that the returned value is a string, allowing you to call nonexistent methods. Generics, in contrast, **capture and preserve the exact type information**. If you pass a `string` into a generic function returning `T`, the compiler knows with 100% certainty that the output is a `string`, preserving full autocompletion and static verification downstream.\"",
    "code": "// With 'any' (Dangerous, loses type contract):\nfunction getFirstAny(arr: any[]): any {\n  return arr[0];\n}\nconst itemA = getFirstAny([\"apple\", \"banana\"]); // itemA has type 'any'\n\n// With Generics (Safe, preserves contract):\nfunction getFirstGeneric<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst itemB = getFirstGeneric([\"apple\", \"banana\"]); // itemB has type 'string | undefined'",
    "keyPoints": [
      "any abandons type checking; generics preserve precise type identity.",
      "Generics maintain caller autocomplete and downstream refactoring safety.",
      "Generics catch invalid method invocations at compile time."
    ],
    "followUps": [
      {
        "q": "Does using generics impact the size or performance of emitted JavaScript?",
        "a": "No. Just like all types, generic parameters (<T>) are completely erased during compilation. The emitted JavaScript is identical to a standard unannotated JS function."
      }
    ],
    "tip": "Directly contrast any losing autocomplete with generics preserving autocomplete."
  },
  {
    "id": 53,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generics",
    "question": "How do you create a generic function with multiple type parameters?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You create a generic function with multiple type parameters by listing comma-separated type variables inside the angle brackets, such as `<T, U>`. Each type parameter can independently capture the type of a different argument, and they can be combined into composite return types like tuples or merged objects.\"",
    "code": "// Merge two objects together with full type preservation:\nfunction mergeObjects<T extends object, U extends object>(first: T, second: U): T & U {\n  return { ...first, ...second };\n}\n\nconst user = { id: \"usr_1\", name: \"Sarah\" };\nconst permissions = { canEdit: true, canDelete: false };\n\nconst fullProfile = mergeObjects(user, permissions);\n// Inferred type: { id: string; name: string } & { canEdit: boolean; canDelete: boolean }\nconsole.log(fullProfile.name, fullProfile.canEdit);",
    "keyPoints": [
      "Syntax: <T, U, V>.",
      "Each parameter captures distinct types independently.",
      "Can combine parameters in return types (T & U, [T, U])."
    ],
    "followUps": [
      {
        "q": "Can one generic type parameter depend on another, like <T, K extends keyof T>?",
        "a": "Yes! This is one of the most common generic patterns in TypeScript, ensuring that K must be a valid key of T."
      }
    ],
    "tip": "Mentioning dependent generic parameters (<T, K extends keyof T>) leads naturally to the next question."
  },
  {
    "id": 54,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generic Constraints",
    "question": "What are generic constraints?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A generic constraint restricts the set of types that can be passed to a generic parameter, using the `extends` keyword—such as `<T extends { length: number }>`. Without a constraint, a generic `T` can be literally anything, so the compiler will not allow you to access properties like `.length` because numbers or booleans don't have a length. By constraining `T`, you guarantee to the compiler that whatever type is passed will at minimum possess those required properties.\"",
    "code": "interface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(item: T): T {\n  console.log(\"Length is:\", item.length); // Safe to access item.length!\n  return item;\n}\n\nlogLength(\"Hello world\");   // Valid: string has length\nlogLength([1, 2, 3, 4]);     // Valid: array has length\nlogLength({ length: 10 });   // Valid: object has length\n// logLength(12345);         // ❌ Error: Argument of type 'number' is not assignable to 'HasLength'.",
    "keyPoints": [
      "Syntax: <T extends Constraint>.",
      "Limits the types acceptable to the generic parameter.",
      "Unlocks safe property access inside the generic body.",
      "Can constrain to interfaces, primitives, unions, or other generic parameters."
    ],
    "followUps": [
      {
        "q": "Can a generic constraint extend a union type like T extends string | number?",
        "a": "Yes. This constrains T to either strings or numbers, while preserving the exact literal or primitive subtype."
      }
    ],
    "tip": "Generic constraints are how you write reusable code that still interacts with specific object properties."
  },
  {
    "id": 55,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Senior",
    "category": "Generics & keyof",
    "question": "How do you use `keyof` with generics?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Using `keyof` with generics creates a dependent constraint using the syntax `<T, K extends keyof T>`. This guarantees that the second type parameter `K` can only be a valid property key of the first object type `T`. When combined with indexed access `T[K]`, it enables you to write functions that retrieve or modify object properties with complete compile-time type safety—preventing typos and guaranteeing the exact return type corresponding to that property.\"",
    "code": "function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = {\n  id: \"usr_101\",\n  username: \"alex\",\n  age: 30,\n  isActive: true\n};\n\nconst username = getProperty(user, \"username\"); // Inferred type: string\nconst age = getProperty(user, \"age\");           // Inferred type: number\n// getProperty(user, \"email\");                 // ❌ Error: Argument of type '\"email\"' is not assignable to parameter of type '\"id\" | \"username\" | \"age\" | \"isActive\"'.",
    "keyPoints": [
      "Syntax: <T, K extends keyof T>(obj: T, key: K): T[K].",
      "Eliminates property name typos at compile time.",
      "Dynamically calculates the exact return type T[K]."
    ],
    "followUps": [
      {
        "q": "How would you write a type-safe setProperty function?",
        "a": "function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void { obj[key] = value; }"
      }
    ],
    "tip": "getProperty<T, K extends keyof T> is the quintessential TypeScript interview coding snippet."
  },
  {
    "id": 56,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generic Interfaces",
    "question": "What is a generic interface?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A generic interface is an interface parameterized by one or more type variables, such as `interface ApiResponse<T>`. It allows you to create flexible, reusable data contracts where the outer structure remains identical (like status codes, pagination, and error messages) while the inner payload type can vary across different API endpoints and microservices.\"",
    "code": "interface PaginatedResult<TItem> {\n  data: TItem[];\n  page: number;\n  pageSize: number;\n  totalCount: number;\n  hasNextPage: boolean;\n}\n\ninterface Product {\n  id: string;\n  sku: string;\n  price: number;\n}\n\n// Reusable typed pagination envelope:\nconst catalogResponse: PaginatedResult<Product> = {\n  data: [{ id: \"p1\", sku: \"SKU-99\", price: 29.99 }],\n  page: 1,\n  pageSize: 20,\n  totalCount: 1,\n  hasNextPage: false\n};",
    "keyPoints": [
      "Syntax: interface Name<T> { ... }.",
      "Defines standardized envelope patterns for APIs, events, and caching.",
      "Can provide default generic types: interface Name<T = DefaultType>."
    ],
    "followUps": [
      {
        "q": "Can a generic interface extend another generic interface?",
        "a": "Yes, like interface DetailedResult<T> extends PaginatedResult<T> { executionTimeMs: number; }."
      }
    ],
    "tip": "Use PaginatedResult<T> as your go-to example—it mirrors production architectures."
  },
  {
    "id": 57,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generic Classes",
    "question": "What is a generic class?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A generic class has a type parameter list declared on its class header, such as `class Queue<T>`. This allows instances of the class to store and manipulate a specific type of data while ensuring type safety across its methods and properties. Note that static members of a class cannot reference the class type parameter, because static members exist on the constructor function itself, not on specific instances.\"",
    "code": "class InMemoryCache<T> {\n  private cache = new Map<string, { value: T; expiresAt: number }>();\n\n  set(key: string, value: T, ttlMs: number): void {\n    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });\n  }\n\n  get(key: string): T | null {\n    const entry = this.cache.get(key);\n    if (!entry || Date.now() > entry.expiresAt) {\n      this.cache.delete(key);\n      return null;\n    }\n    return entry.value;\n  }\n}\n\nconst userCache = new InMemoryCache<{ id: string; email: string }>();\nuserCache.set(\"u1\", { id: \"u1\", email: \"alex@example.com\" }, 60000);",
    "keyPoints": [
      "Syntax: class Name<T> { ... }.",
      "Methods and fields share the parameterized type T.",
      "Static members CANNOT use class generic parameters (they belong to constructor, not instance)."
    ],
    "followUps": [
      {
        "q": "Why can static members not reference generic class parameters?",
        "a": "Because static members exist on the class object itself at runtime, which is a single shared constructor. Instance generic parameters are determined when individual instances are constructed."
      }
    ],
    "tip": "Explaining why static members cannot use class type parameters proves deep runtime vs compile-time awareness."
  },
  {
    "id": 58,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Intermediate",
    "category": "Generic Defaults",
    "question": "What is a default generic type parameter?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A default generic type parameter provides a fallback type for a generic variable if the caller does not explicitly provide one and the compiler cannot infer it from arguments, using syntax like `<T = string>`. It behaves exactly like a default parameter in a function, making the generic parameter optional when consuming the type or interface.\"",
    "code": "// Default TData to unknown, and TMeta to standard pagination:\ninterface ApiResponse<TData = unknown, TMeta = { page: number }> {\n  success: boolean;\n  data: TData;\n  meta: TMeta;\n}\n\n// Uses default TData (unknown) and default TMeta:\nconst basicResponse: ApiResponse = {\n  success: true,\n  data: \"any payload\",\n  meta: { page: 1 }\n};\n\n// Overrides TData:\nconst userResponse: ApiResponse<{ name: string }> = {\n  success: true,\n  data: { name: \"Aria\" },\n  meta: { page: 1 }\n};",
    "keyPoints": [
      "Syntax: <T = DefaultType>.",
      "Makes explicit generic specification optional for consumers.",
      "Can reference preceding type parameters: <T, U = T[]>."
    ],
    "followUps": [
      {
        "q": "Can a required generic parameter follow a default generic parameter?",
        "a": "No, just like function parameters, all generic parameters with default types must follow required generic parameters in the type parameter list."
      }
    ],
    "tip": "Compare generic defaults to standard function default arguments."
  },
  {
    "id": 59,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Senior",
    "category": "Generics Architecture",
    "question": "What are generic constraints versus default generic types?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Generic constraints and default generic types serve fundamentally different purposes in API design. A **constraint** (`T extends Base`) enforces an upper bound: it strictly limits what types a caller is *permitted* to pass, causing a compile error if the argument does not conform. A **default type** (`T = Default`) provides a fallback: it allows the caller to *omit* the generic argument, falling back to a convenient default without restricting callers from passing alternative types. You can also combine both: `<T extends Base = DefaultBase>`.\"",
    "table": {
      "headers": [
        "Feature",
        "Generic Constraint (T extends Constraint)",
        "Default Generic Type (T = Default)"
      ],
      "rows": [
        [
          "Purpose",
          "Enforce minimum structural requirements",
          "Provide fallback type when omitted"
        ],
        [
          "Enforcement",
          "Strict: Rejects incompatible arguments",
          "Permissive: Caller can provide any valid type"
        ],
        [
          "Syntax",
          "`<T extends object>`",
          "`<T = Record<string, any>>`"
        ],
        [
          "Combined Syntax",
          "`<T extends object = Record<string, any>>`",
          "Both bound and default are enforced"
        ]
      ]
    },
    "code": "// Combined Constraint & Default:\ninterface BaseEntity { id: string }\n\n// T must extend BaseEntity; if omitted, defaults to BaseEntity itself:\nclass Repository<T extends BaseEntity = BaseEntity> {\n  save(item: T): T {\n    console.log(\"Saving entity:\", item.id);\n    return item;\n  }\n}",
    "keyPoints": [
      "Constraint (extends): Enforces mandatory subtyping rules.",
      "Default (=): Provides a fallback when the type is omitted.",
      "Both can be combined: <T extends Constraint = DefaultType>."
    ],
    "followUps": [
      {
        "q": "What error occurs if the default type violates the generic constraint, like <T extends number = string>?",
        "a": "The compiler throws an error at the declaration site: Type \"string\" does not satisfy the constraint \"number\"."
      }
    ],
    "tip": "Showing how to combine both (<T extends Base = Default>) is a great demonstration of mastery."
  },
  {
    "id": 60,
    "partId": 4,
    "section": "D. Generics and reusable design",
    "difficulty": "Senior",
    "category": "API Design",
    "question": "What is a generic API response type you might use in a project?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In enterprise full-stack applications (like Chrona or LesHub), we use a generic discriminated union to represent API outcomes. Instead of mixing nullable data and error fields, the response model discriminates on a `success: boolean` flag. When `success: true`, the generic `data: T` payload is guaranteed to exist. When `success: false`, an `error` object containing code, message, and details is guaranteed to exist. This completely eliminates runtime null dereferencing across all frontend API consumption hooks.\"",
    "code": "// Production Enterprise Generic API Envelope:\nexport type ApiResponse<TData> =\n  | {\n      success: true;\n      data: TData;\n      timestamp: string;\n      meta?: { page?: number; total?: number };\n    }\n  | {\n      success: false;\n      error: {\n        code: string;\n        message: string;\n        details?: Record<string, string[]>;\n      };\n      timestamp: string;\n    };\n\n// Clean frontend consumption:\nasync function handleUserFetch() {\n  const response: ApiResponse<{ id: string; name: string }> = await fetch(\"/api/user\").then(r => r.json());\n\n  if (response.success) {\n    // TypeScript knows response.data exists!\n    console.log(\"User:\", response.data.name);\n  } else {\n    // TypeScript knows response.error exists!\n    console.error(\"Fetch failed:\", response.error.message);\n  }\n}",
    "keyPoints": [
      "Combines generics with discriminated unions.",
      "Eliminates optional data and error fields.",
      "Guarantees data availability inside success branches."
    ],
    "followUps": [
      {
        "q": "How does this pattern simplify React TanStack Query or SWR hooks?",
        "a": "Query functions can directly return response.data on success, or throw response.error on failure, providing strongly typed data and error states to custom hooks."
      }
    ],
    "tip": "Directly reference Chrona or LesHub when describing this pattern—it anchors your answer in real work."
  },
  {
    "id": 61,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Beginner",
    "category": "Literal Types",
    "question": "What is a literal type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A literal type in TypeScript is a type that represents an exact, specific value rather than an entire broad primitive category. For example, instead of the broad type `string`, a literal type can be specifically `'success'` or `'EUR'`. Instead of `number`, it can be `404` or `200`. Declaring a variable with `const` automatically infers a literal type, or you can use `as const`. Literal types form the building blocks for discriminated unions, state machines, and configuration options.\"",
    "code": "// Literal types:\ntype HttpSuccessCode = 200 | 201;\ntype Environment = \"development\" | \"staging\" | \"production\";\n\nconst activeEnv: Environment = \"production\";\n// const badEnv: Environment = \"local\"; \n// ❌ Error: Type '\"local\"' is not assignable to type 'Environment'.",
    "keyPoints": [
      "Represents an exact, specific value (e.g. \"POST\", 404, true).",
      "const variables infer literal types automatically.",
      "Core foundation of discriminated unions and type-safe state machines."
    ],
    "followUps": [
      {
        "q": "What is literal widening?",
        "a": "When a variable declared with let is assigned a literal like \"hello\", TypeScript widens it to string so it can be reassigned to other strings."
      }
    ],
    "tip": "Point out that literal types allow TypeScript to act as an exact value verifier."
  },
  {
    "id": 62,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Beginner",
    "category": "Literal Types",
    "question": "What is a union of literal types?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A union of literal types is a type constructed by joining multiple specific literal values with pipe symbols, such as `type Direction = 'north' | 'south' | 'east' | 'west'`. It restricts a variable or parameter to strictly one of those predefined values, offering a clean, lightweight, and tree-shakeable alternative to TypeScript enums. The compiler flags any misspelled strings immediately in the editor.\"",
    "code": "type ButtonVariant = \"primary\" | \"secondary\" | \"danger\" | \"ghost\";\n\nfunction renderButton(variant: ButtonVariant) {\n  console.log(\"Rendering button style:\", variant);\n}\n\nrenderButton(\"primary\"); // Valid\n// renderButton(\"warning\"); \n// ❌ Error: Argument of type '\"warning\"' is not assignable to parameter of type 'ButtonVariant'.",
    "keyPoints": [
      "Defines a closed set of permitted literal values.",
      "Zero runtime overhead—completely erased during compilation.",
      "Modern industry standard replacement for traditional string enums."
    ],
    "followUps": [
      {
        "q": "How do you derive a literal union from an existing array or object?",
        "a": "Use as const with indexed access: const ROLES = [\"admin\", \"user\"] as const; type Role = typeof ROLES[number];."
      }
    ],
    "tip": "Mentioning deriving unions with typeof ROLES[number] shows practical elegance."
  },
  {
    "id": 63,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Enums",
    "question": "What is an enum?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An enum (enumeration) in TypeScript is a language feature that allows you to define a set of named constants, which can be numeric or string-based. Unlike almost all other TypeScript features, **enums are NOT erased at compile-time**—they emit real runtime JavaScript objects (an IIFE creating a two-way lookup table for numeric enums, or a plain key-value object for string enums). While popular in classical OOP languages, enums have fallen out of favor in modern TypeScript because they bloat the bundle, complicate tree-shaking, and have nominal compatibility quirks.\"",
    "code": "// Numeric Enum:\nenum Direction {\n  Up = 1,\n  Down, // 2\n  Left, // 3\n  Right // 4\n}\n\n// Emitted JavaScript (Runtime IIFE):\n// var Direction;\n// (function (Direction) {\n//     Direction[Direction[\"Up\"] = 1] = \"Up\";\n//     Direction[Direction[\"Down\"] = 2] = \"Down\";\n// })(Direction || (Direction = {}));",
    "keyPoints": [
      "One of the few TS features that emits runtime JavaScript code.",
      "Supports numeric, string, and heterogeneous variants.",
      "Numeric enums create reverse mappings (Direction[1] === \"Up\")."
    ],
    "followUps": [
      {
        "q": "What is a const enum and what is its primary danger?",
        "a": "A const enum is inlined at the call site at compile time, emitting no runtime object. However, it breaks when isolatedModules: true is enabled (such as with Babel, Vite, or esbuild) and cannot be consumed across library boundaries."
      }
    ],
    "tip": "Explaining the const enum isolatedModules breakage proves deep bundler knowledge."
  },
  {
    "id": 64,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Senior",
    "category": "Enums vs Unions",
    "question": "What is the difference between an enum and a union of string literals?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The core difference is **runtime footprint and ergonomics**. An enum emits real JavaScript code (an IIFE object) into the bundle, cannot be easily tree-shaken, and requires you to import the enum identifier everywhere it is referenced. In contrast, a union of string literals (`type Status = 'OPEN' | 'CLOSED'`) has **zero runtime footprint**—it is completely erased by `tsc`. Furthermore, string literal unions offer seamless structural typing with JSON APIs: you can pass a plain string `'OPEN'` directly, whereas with string enums, TypeScript strictly requires the enum reference `Status.OPEN`.\"",
    "table": {
      "headers": [
        "Aspect",
        "TypeScript Enum",
        "String Literal Union"
      ],
      "rows": [
        [
          "Runtime Code Emission",
          "Emits IIFE object into JS bundle",
          "Zero code emitted (completely erased)"
        ],
        [
          "Tree-Shaking",
          "Difficult for bundlers to optimize",
          "Perfect (no runtime footprint)"
        ],
        [
          "API Boundary Assignability",
          "Requires explicit Enum.Member reference",
          "Plain string literals assignable directly"
        ],
        [
          "Modern Best Practice",
          "Discouraged for new codebases",
          "Standard best practice"
        ]
      ]
    },
    "code": "// 1. Enum Approach (Requires runtime import):\nenum OrderStatusEnum { PENDING = \"PENDING\", COMPLETED = \"COMPLETED\" }\n// function update(s: OrderStatusEnum) {}\n// update(\"PENDING\"); // ❌ Error: Argument of type '\"PENDING\"' is not assignable to parameter of type 'OrderStatusEnum'.\n\n// 2. Modern Literal Union Approach (Structural & Clean):\nconst ORDER_STATUS = { PENDING: \"PENDING\", COMPLETED: \"COMPLETED\" } as const;\ntype OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];\nfunction update(s: OrderStatus) {}\nupdate(\"PENDING\"); // ✅ Valid! Seamless compatibility with API JSON.",
    "keyPoints": [
      "Enums emit runtime code; literal unions are 100% erased.",
      "Literal unions interop natively with JSON payloads without enum imports.",
      "Modern TypeScript consensus strongly favors as const object unions over enums."
    ],
    "followUps": [
      {
        "q": "Does TypeScript Core recommend string literal unions over enums?",
        "a": "Yes. Anders Hejlsberg and the TypeScript team have stated that if designing TypeScript today, enums would likely not be added, favoring string unions."
      }
    ],
    "tip": "Advocating for as const object literal unions over enums aligns with senior engineering best practices."
  },
  {
    "id": 65,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Mapped Types",
    "question": "What is a mapped type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A mapped type is a generic type that creates a new object type by iterating over a union of keys—usually obtained via `keyof`—and transforming the property types. It uses index signature syntax with the `in` keyword: `{ [K in keyof T]: NewType }`. Mapped types are the mathematical foundation behind all object-transforming utility types in TypeScript, including `Partial`, `Required`, `Readonly`, and `Record`.\"",
    "code": "// Creating a mapped type that makes all properties boolean flags:\ntype BooleanFlags<T> = {\n  [K in keyof T]: boolean;\n};\n\ninterface FeatureConfig {\n  darkMode: string;\n  maxUploadMb: number;\n}\n\ntype FeatureToggles = BooleanFlags<FeatureConfig>;\n// Evaluates to: { darkMode: boolean; maxUploadMb: boolean; }",
    "keyPoints": [
      "Syntax: { [K in Keys]: ValueType }.",
      "Iterates over a union of string/number/symbol keys.",
      "Can add or remove readonly and optional (?) modifiers.",
      "Powers Partial, Required, Readonly, and custom transformations."
    ],
    "followUps": [
      {
        "q": "What is key remapping in mapped types?",
        "a": "Introduced in TS 4.1, the \"as\" clause allows you to re-map or filter keys during iteration: [K in keyof T as NewKeyType]: T[K]."
      }
    ],
    "tip": "Frame mapped types as the \"Array.prototype.map() for object types\" in the type system."
  },
  {
    "id": 66,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Beginner",
    "category": "Utility Types",
    "question": "What is `Partial<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Partial<T>` is a built-in utility type that constructs a new type where all properties of `T` are made optional. Internally, it is implemented as a mapped type using the optional modifier: `type Partial<T> = { [P in keyof T]?: T[P] }`. It is universally used in API update endpoints (HTTP PATCH) and form state management where a user can update a subset of fields without providing the entire entity.\"",
    "code": "interface User {\n  id: string;\n  name: string;\n  email: string;\n  age: number;\n}\n\n// Update DTO: all properties optional\nfunction updateUser(id: string, patch: Partial<User>) {\n  console.log(`Updating user ${id} with:`, patch);\n}\n\nupdateUser(\"usr_1\", { name: \"Aria\" }); // Valid! email and age are omitted."
  },
  {
    "id": 67,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "What is `Required<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Required<T>` is the inverse of `Partial<T>`. It constructs a new type where all optional properties of `T` are made strictly required. It is implemented using the modifier removal syntax: `type Required<T> = { [P in keyof T]-?: T[P] }`. The `-?` operator explicitly strips the optional modifier. It is commonly used when initializing configuration defaults, guaranteeing that all fields have been populated before service startup.\"",
    "code": "interface ServerConfig {\n  host?: string;\n  port?: number;\n  timeoutMs?: number;\n}\n\n// Implementation: type Required<T> = { [P in keyof T]-?: T[P] };\n\nfunction startServer(config: Required<ServerConfig>) {\n  console.log(`Running on ${config.host}:${config.port}`); // Guaranteed to be defined!\n}"
  },
  {
    "id": 68,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Beginner",
    "category": "Utility Types",
    "question": "What is `Readonly<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Readonly<T>` constructs a type with all properties of `T` set to `readonly`, preventing any property reassignment. Internally, it is implemented as `type Readonly<T> = { readonly [P in keyof T]: T[P] }`. It is essential for enforcing immutability in state management architectures like Redux, Zustand, and React component props.\"",
    "code": "interface State {\n  count: number;\n  status: string;\n}\n\nconst frozenState: Readonly<State> = {\n  count: 0,\n  status: \"IDLE\"\n};\n\n// frozenState.count = 1; // ❌ Error: Cannot assign to 'count' because it is a read-only property."
  },
  {
    "id": 69,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "What is `Pick<T, K>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Pick<T, K>` constructs a type by picking a specific subset of keys `K` from an existing type `T`. The keys parameter is constrained using `K extends keyof T`. It is implemented as `type Pick<T, K extends keyof T> = { [P in K]: T[P] }`. It is used to project smaller, focused interfaces from larger database entities, such as creating a public user profile from an internal user record.\"",
    "code": "interface UserEntity {\n  id: string;\n  email: string;\n  passwordHash: string;\n  refreshToken: string;\n  createdAt: Date;\n}\n\n// Select only safe public fields:\ntype PublicUserProfile = Pick<UserEntity, \"id\" | \"email\" | \"createdAt\">;"
  },
  {
    "id": 70,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "What is `Omit<T, K>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Omit<T, K>` is the inverse of `Pick<T, K>`. It constructs a type by picking all properties from `T` and removing the specified keys `K`. Internally, it is implemented by combining `Pick` with `Exclude`: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>`. It is heavily used in API creation endpoints (omitting auto-generated fields like `id` and `createdAt`) and React prop extension.\"",
    "code": "interface Order {\n  id: string;\n  customerEmail: string;\n  total: number;\n  createdAt: Date;\n}\n\n// Creation payload omits database-generated fields:\ntype CreateOrderPayload = Omit<Order, \"id\" | \"createdAt\">;"
  },
  {
    "id": 71,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Beginner",
    "category": "Utility Types",
    "question": "What is `Record<K, V>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Record<K, V>` constructs an object type whose property keys are of type `K` and whose property values are of type `V`. The key type `K` must extend `keyof any` (`string | number | symbol`). Internally, it is implemented as `type Record<K extends keyof any, T> = { [P in K]: T }`. It is the standard idiom in TypeScript for typing lookup dictionaries, cache maps, and key-value stores.\"",
    "code": "type Currency = \"USD\" | \"EUR\" | \"GBP\";\n\n// Dictionary mapping each Currency to its exchange rate number:\nconst exchangeRates: Record<Currency, number> = {\n  USD: 1.0,\n  EUR: 0.92,\n  GBP: 0.79\n};"
  },
  {
    "id": 72,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "What are `Exclude<T, U>` and `Extract<T, U>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Exclude` and `Extract` are utility types that operate on **union types** using distributive conditional types. `Exclude<T, U>` removes from `T` any members that are assignable to `U` (`T extends U ? never : T`). Conversely, `Extract<T, U>` selects only those members of `T` that are assignable to `U` (`T extends U ? T : never`). They are essential for filtering action unions and manipulating string literals.\"",
    "code": "type AllActions = \"CREATE\" | \"READ\" | \"UPDATE\" | \"DELETE\";\n\n// Exclude: Remove write operations\ntype ReadOnlyActions = Exclude<AllActions, \"CREATE\" | \"UPDATE\" | \"DELETE\">; // \"READ\"\n\n// Extract: Select only mutation operations\ntype Mutations = Extract<AllActions, \"CREATE\" | \"UPDATE\" | \"DELETE\">; // \"CREATE\" | \"UPDATE\" | \"DELETE\""
  },
  {
    "id": 73,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "What is `NonNullable<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`NonNullable<T>` constructs a type by excluding `null` and `undefined` from `T`. In modern TypeScript, it is elegantly implemented using the empty object intersection: `type NonNullable<T> = T & {}` (since `{}` represents any non-nullish value). It is used to sanitize optional or nullable parameters before passing them to functions that require defined values.\"",
    "code": "type RawInput = string | number | null | undefined;\n\ntype SanitizedInput = NonNullable<RawInput>; // string | number"
  },
  {
    "id": 74,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Senior",
    "category": "Utility Types",
    "question": "What are `Parameters<T>` and `ReturnType<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Parameters<T>` and `ReturnType<T>` are utility types that extract function signature metadata using conditional types and the `infer` keyword. `Parameters<T>` extracts the function's parameter types as a tuple (`T extends (...args: infer P) => any ? P : never`). `ReturnType<T>` extracts the returned type (`T extends (...args: any) => infer R ? R : any`). They are heavily used when typing higher-order decorators, logging proxies, and API factories.\"",
    "code": "function createUser(email: string, age: number, isAdmin?: boolean): { id: string; email: string } {\n  return { id: \"u1\", email };\n}\n\ntype CreateUserParams = Parameters<typeof createUser>; // [email: string, age: number, isAdmin?: boolean]\ntype CreateUserReturn = ReturnType<typeof createUser>; // { id: string; email: string }"
  },
  {
    "id": 75,
    "partId": 5,
    "section": "E. Advanced and utility types",
    "difficulty": "Senior",
    "category": "Utility Types",
    "question": "What are `Awaited<T>` and `InstanceType<T>`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Awaited<T>` recursively unwraps Promises, extracting the ultimate resolved value of a Promise-like type, modeling the runtime behavior of `await`. `InstanceType<T>` extracts the instance type of a constructor function or class using `infer R`. `Awaited` is essential for typing async operations in TanStack Query and Redux Toolkit, while `InstanceType` is used for dependency injection containers and dynamic factories.\"",
    "code": "// Awaited unwraps recursive promises:\ntype NestedPromise = Promise<Promise<string>>;\ntype Unwrapped = Awaited<NestedPromise>; // string\n\n// InstanceType:\nclass AuthService {\n  token = \"jwt_xyz\";\n}\ntype AuthInstance = InstanceType<typeof AuthService>; // AuthService"
  },
  {
    "id": 76,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Intermediate",
    "category": "Type Operators",
    "question": "What does `keyof` do?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The `keyof` operator takes an object type and produces a string or numeric literal union of all its declared property keys. For example, `keyof { id: string; name: string }` evaluates to the union `'id' | 'name'`. If the object has an index signature like `[key: string]: any`, `keyof` evaluates to `string | number` (because JavaScript coerces numeric object keys to strings). It is the primary building block for mapped types, generic property access, and object transformations.\"",
    "code": "interface Order {\n  id: string;\n  total: number;\n  status: \"PAID\" | \"PENDING\";\n}\n\ntype OrderKeys = keyof Order; // \"id\" | \"total\" | \"status\""
  },
  {
    "id": 77,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Intermediate",
    "category": "Type Operators",
    "question": "What is indexed access typing?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Indexed access typing (also called lookup typing) allows you to look up the type of a specific property or element on another type using bracket notation: `T[K]`. For example, `User['address']` extracts the type of the address property. You can also pass a union of keys to retrieve a union of property types: `User['id' | 'name']`. For arrays, indexing with `number` (`MyArray[number]`) extracts the union of all element types in the array.\"",
    "code": "interface Customer {\n  id: string;\n  addresses: { street: string; city: string }[];\n}\n\n// 1. Property lookup:\ntype AddressList = Customer[\"addresses\"]; // { street: string; city: string }[]\n\n// 2. Array element lookup via [number]:\ntype SingleAddress = Customer[\"addresses\"][number]; // { street: string; city: string }"
  },
  {
    "id": 78,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Intermediate",
    "category": "Type Operators",
    "question": "What is `typeof` in a type position?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In a type position (such as after a colon or type alias declaration), `typeof` refers to TypeScript's type query operator. Instead of executing the JavaScript runtime `typeof`, it queries the compiler's symbol table and extracts the static TypeScript type of any existing runtime variable, object, or function. Combined with `as const`, it allows you to derive types directly from single-source-of-truth runtime configurations, eliminating duplication.\"",
    "code": "const defaultConfig = {\n  endpoint: \"https://api.chrona.com\",\n  timeout: 3000,\n  retries: 2\n} as const;\n\n// Extract exact type from runtime object:\ntype AppConfig = typeof defaultConfig;\n// Evaluates to: { readonly endpoint: \"https://api.chrona.com\"; readonly timeout: 3000; readonly retries: 2; }"
  },
  {
    "id": 79,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "Conditional Types",
    "question": "What is a conditional type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A conditional type selects one of two possible types based on a subtyping relationship test, using ternary syntax: `T extends U ? TrueType : FalseType`. It introduces programmable logic into TypeScript's type system. When `T` is assignable to `U`, the condition resolves to `TrueType`; otherwise it resolves to `FalseType`. It enables type-level filtering, recursive type unwrapping, and dynamic API return type calculations.\"",
    "code": "type IsString<T> = T extends string ? true : false;\n\ntype A = IsString<\"hello\">; // true\ntype B = IsString<42>;      // false"
  },
  {
    "id": 80,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "Conditional Types",
    "question": "What is a distributive conditional type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A distributive conditional type is a conditional type that acts on a **naked type parameter `T`**. When a union type is passed to a naked conditional type, TypeScript automatically distributes the condition over each member of the union: `(A | B) extends U ? X : Y` expands into `(A extends U ? X : Y) | (B extends U ? X : Y)`. To **prevent distribution**, you wrap the type parameter and constraint in square brackets: `[T] extends [U] ? X : Y`.\"",
    "code": "// Distributive:\ntype ToArray<T> = T extends any ? T[] : never;\ntype Distributed = ToArray<string | number>; // string[] | number[]\n\n// Non-distributive (wrapped in tuple):\ntype ToArrayNonDist<T> = [T] extends [any] ? T[] : never;\ntype Combined = ToArrayNonDist<string | number>; // (string | number)[]"
  },
  {
    "id": 81,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "Template Literals",
    "question": "What are template literal types?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Template literal types, introduced in TypeScript 4.1, bring JavaScript template literal syntax into type space. They allow you to concatenate string literal types, interpolate unions, and construct new string union combinations. When a union is interpolated inside a template literal (e.g. `type Event = `on${'Click' | 'Hover'}`), TypeScript automatically computes the Cartesian product of all possible combinations.\"",
    "code": "type Scope = \"read\" | \"write\";\ntype Entity = \"users\" | \"orders\";\n\n// Computes Cartesian product union:\ntype Permission = `${Scope}:${Entity}`;\n// \"read:users\" | \"read:orders\" | \"write:users\" | \"write:orders\""
  },
  {
    "id": 82,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Intermediate",
    "category": "Template Literals",
    "question": "What are `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize` are built-in intrinsic string manipulation utility types provided by TypeScript. They operate on string literal types using internal compiler intrinsic functions to alter case. They are frequently paired with template literal types and mapped type key remapping to generate type-safe event handlers (e.g. `onClick`) or getter/setter method names.\"",
    "code": "type Action = \"create\" | \"update\";\ntype EventName = `on${Capitalize<Action>}`; // \"onCreate\" | \"onUpdate\"\ntype Shouting = Uppercase<\"error\">;           // \"ERROR\""
  },
  {
    "id": 83,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "infer Keyword",
    "question": "What is the `infer` keyword?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The `infer` keyword introduces a type variable inside the `extends` clause of a conditional type to be deduced via pattern matching. Instead of checking if a type matches an existing contract, `infer` tells the compiler: 'Deconstruct this type and capture whatever type occupies this position into a new type variable.' It is the primary engine behind utility types like `ReturnType`, `Parameters`, and `Awaited`.\"",
    "code": "// Unpack Array element type:\ntype Flatten<T> = T extends (infer E)[] ? E : T;\n\ntype Str = Flatten<string[]>; // string\ntype Num = Flatten<number>;   // number"
  },
  {
    "id": 84,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "Recursive Types",
    "question": "What is a recursive type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A recursive type is a type alias that references itself in its own definition. Supported cleanly in modern TypeScript (3.7+), recursive types are essential for modeling nested hierarchical structures like JSON documents, DOM trees, binary trees, and deep immutability utilities like `DeepReadonly<T>`.\"",
    "code": "// Recursive JSON type definition:\ntype JSONValue =\n  | string\n  | number\n  | boolean\n  | null\n  | JSONValue[]\n  | { [key: string]: JSONValue };\n\nconst sampleJson: JSONValue = {\n  user: \"Alex\",\n  meta: { retries: 3, tags: [\"prod\", \"auth\"] }\n};"
  },
  {
    "id": 85,
    "partId": 6,
    "section": "F. Type operators and level metaprogramming",
    "difficulty": "Senior",
    "category": "Exhaustive Checking",
    "question": "What is an exhaustive check, and why use `never`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An exhaustive check is a compiler-enforced design pattern that guarantees every possible variant of a discriminated union is handled in a switch or conditional block. By assigning the remaining variable to type `never` in the default branch (`const _exhaustive: never = val`), the code compiles cleanly as long as all variants are handled. If a developer later adds a new variant to the union, TypeScript's control-flow analysis flags a compile error at the `never` assignment, preventing unhandled production cases.\"",
    "code": "type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; side: number };\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case \"circle\": return Math.PI * s.radius ** 2;\n    case \"square\": return s.side * s.side;\n    default: {\n      const _check: never = s; // If a new shape is added, this line errors at compile-time!\n      throw new Error(`Unhandled shape: ${_check}`);\n    }\n  }\n}"
  },
  {
    "id": 86,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Beginner",
    "category": "OOP Foundations",
    "question": "Does TypeScript support object-oriented programming?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Yes, TypeScript provides first-class support for Object-Oriented Programming (OOP). It extends standard ES6 JavaScript classes with static type annotations, access modifiers (`public`, `private`, `protected`), abstract classes, interface implementation (`implements`), parameter properties, method overriding with the `override` keyword, and generic classes. It enables classic enterprise design patterns like Repository, Factory, and Strategy with complete type safety.\"",
    "code": "interface Notifier { send(message: string): void; }\n\nclass EmailNotifier implements Notifier {\n  send(message: string): void {\n    console.log(\"Sending email:\", message);\n  }\n}"
  },
  {
    "id": 87,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Beginner",
    "category": "Classes",
    "question": "What is a class in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A class in TypeScript is both a **runtime constructor function** and a **type-space interface**. When you declare a class `User`, TypeScript creates two things: a JavaScript constructor function that executes at runtime, and a TypeScript type representing instances of that class. Classes encapsulate state and behavior, support inheritance via `extends`, and allow constructor parameter property shortcuts.\"",
    "code": "class UserAccount {\n  id: string;\n  constructor(id: string) {\n    this.id = id;\n  }\n}"
  },
  {
    "id": 88,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Intermediate",
    "category": "Access Modifiers",
    "question": "What are access modifiers in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"TypeScript features three primary access modifiers:\n1. **`public` (Default)**: Accessible from anywhere—inside the class, subclasses, and external callers.\n2. **`protected`**: Accessible only within the class and its subclasses; inaccessible to external callers.\n3. **`private`**: Accessible strictly within the defining class body; inaccessible to subclasses and external callers.\nCrucially, TypeScript's access modifiers are **compile-time restrictions only** and are erased in emitted JavaScript. For runtime engine-level privacy, use JavaScript's private field syntax (`#field`).\"",
    "code": "class Account {\n  public username: string;\n  protected balance: number;\n  private apiKey: string;\n\n  constructor(u: string, b: number, k: string) {\n    this.username = u;\n    this.balance = b;\n    this.apiKey = k;\n  }\n}"
  },
  {
    "id": 89,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Intermediate",
    "category": "Inheritance",
    "question": "What is inheritance?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Inheritance is an OOP mechanism where a subclass extends a superclass using the `extends` keyword, inheriting its properties and methods while adding new behavior or overriding existing methods. In the subclass constructor, calling `super()` is mandatory before accessing `this` to ensure the parent class is initialized.\"",
    "code": "class Vehicle {\n  constructor(public speed: number) {}\n}\n\nclass Car extends Vehicle {\n  constructor(speed: number, public brand: string) {\n    super(speed); // Calls parent constructor\n  }\n}"
  },
  {
    "id": 90,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Intermediate",
    "category": "Abstract Classes",
    "question": "What is an abstract class?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"An abstract class is a base class that cannot be directly instantiated with `new`. It serves as a blueprint for derived classes, allowing you to define both fully implemented concrete methods and abstract method signatures that subclasses **must implement**. Unlike interfaces, abstract classes emit real JavaScript constructor code and can contain concrete implementation logic.\"",
    "code": "abstract class PaymentGateway {\n  constructor(protected apiKey: string) {}\n  abstract process(amount: number): Promise<boolean>;\n\n  log(msg: string) {\n    console.log(`[Gateway] ${msg}`);\n  }\n}"
  },
  {
    "id": 91,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Senior",
    "category": "Abstract vs Interface",
    "question": "What is the difference between an interface and an abstract class?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The critical distinction is **runtime existence and code sharing**. An interface is 100% erased at compile time; it emits zero JavaScript code and cannot provide method implementations. An abstract class emits real JavaScript code, can contain concrete implemented methods, state fields, constructors, and can be checked with `instanceof`. Use interfaces for lightweight structural contracts, and abstract classes when sharing common execution logic across a family of subclasses.\"",
    "table": {
      "headers": [
        "Feature",
        "interface",
        "abstract class"
      ],
      "rows": [
        [
          "Runtime Code Emission",
          "Zero (Completely erased)",
          "Emits real constructor class into JS"
        ],
        [
          "Concrete Implementations",
          "❌ Pure declarations only",
          "✅ Can include implemented methods and fields"
        ],
        [
          "Instantiation via new",
          "❌ Cannot be instantiated",
          "❌ Cannot be instantiated"
        ],
        [
          "instanceof Checking",
          "❌ Cannot be used with instanceof",
          "✅ Can be checked with instanceof"
        ]
      ]
    },
    "code": "// Interface: Erased completely\ninterface ILog { log(m: string): void; }\n\n// Abstract class: Contains concrete implementation\nabstract class BaseLogger {\n  prefix = \"[APP]\";\n  format(m: string) { return `${this.prefix} ${m}`; }\n  abstract send(m: string): void;\n}"
  },
  {
    "id": 92,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Intermediate",
    "category": "Method Overriding",
    "question": "What is method overriding and the `override` keyword?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Method overriding occurs when a subclass provides its own implementation for a method defined in its superclass. TypeScript 4.3 introduced the `override` keyword (enforced by `noImplicitOverride: true`). It explicitly declares that a method is intended to override a parent method. If the parent class later renames or deletes the method, the compiler flags an error on the subclass, preventing silent bugs where overridden behavior is lost.\"",
    "code": "class Parent {\n  render() { return \"parent\"; }\n}\n\nclass Child extends Parent {\n  override render() { return \"child\"; } // Safe! Compiler verifies parent has 'render'\n}"
  },
  {
    "id": 93,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Beginner",
    "category": "Accessors",
    "question": "What are getters and setters in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Getters and setters (accessors) intercept property reading and writing on classes using `get` and `set` keywords. If a property has a getter but no setter, TypeScript automatically infers the property as `readonly`. Accessors allow you to encapsulate validation, logging, or caching while exposing a clean public property API to callers.\"",
    "code": "class User {\n  private _age: number = 0;\n\n  get age(): number { return this._age; }\n  set age(value: number) {\n    if (value < 0) throw new Error(\"Age cannot be negative\");\n    this._age = value;\n  }\n}"
  },
  {
    "id": 94,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Beginner",
    "category": "Static Members",
    "question": "What are static members?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Static members belong to the class constructor itself, rather than to instances of the class. They are declared with the `static` keyword and accessed directly on the class name (e.g. `MathUtils.add()`). They are commonly used for utility helper functions, singleton instances, and factory constructor methods.\"",
    "code": "class Config {\n  static defaultPort = 8080;\n  static createDefault(): Config {\n    return new Config();\n  }\n}"
  },
  {
    "id": 95,
    "partId": 7,
    "section": "G. Classes, OOP, and encapsulation",
    "difficulty": "Intermediate",
    "category": "Parameter Properties",
    "question": "What is a parameter property?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A parameter property is a TypeScript shorthand that allows you to declare and initialize a class member in a single location: the constructor parameter list. By prefixing a constructor argument with an accessibility modifier (`public`, `private`, `protected`) or `readonly`, TypeScript automatically creates the class field and assigns the incoming argument to it, eliminating tedious boilerplate.\"",
    "code": "// Shorthand with Parameter Properties:\nclass OrderService {\n  constructor(\n    public readonly orderId: string,\n    private dbClient: DatabaseClient,\n    protected logger: Logger\n  ) {\n    // No 'this.orderId = orderId' boilerplate needed!\n  }\n}"
  },
  {
    "id": 96,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Beginner",
    "category": "Modules",
    "question": "What are modules in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, any file containing a top-level `import` or `export` statement is treated as a **module**, with its own isolated scope. Variables, functions, and interfaces declared inside a module are private unless explicitly exported. If a file contains no imports or exports, TypeScript treats it as a script in the global scope, which can cause naming collisions across files. Modern TypeScript adheres to ES module standards (`import`/`export`) and compiles to CommonJS or ESNext based on the `module` setting in `tsconfig.json`.\"",
    "code": "// auth.ts (Module scope):\nexport interface AuthToken {\n  jwt: string;\n  expiresIn: number;\n}\n\nexport function generateToken(): AuthToken {\n  return { jwt: \"xyz\", expiresIn: 3600 };\n}"
  },
  {
    "id": 97,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Intermediate",
    "category": "Modules",
    "question": "What is the difference between a type-only import and a regular import?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A regular import (`import { User } from './user'`) imports an identifier that may exist at runtime. If the imported item is only a type, TypeScript's compiler attempts to elide it, but bundlers or Babel running in `isolatedModules` mode might struggle, occasionally emitting empty runtime imports that cause circular dependency errors. A **type-only import** (`import type { User } from './user'`) guarantees to both TypeScript and downlevel transpilers that the symbol is **100% erased** from emitted JavaScript, completely avoiding circular runtime dependencies.\"",
    "code": "// Guarantees zero emitted JavaScript code:\nimport type { UserProfile, OrderRecord } from \"./models\";\n\n// Inline type imports (TS 4.5+):\nimport { processOrder, type OrderOptions } from \"./orderService\";"
  },
  {
    "id": 98,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Beginner",
    "category": "Async Programming",
    "question": "What is a Promise in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A `Promise` in TypeScript represents an asynchronous operation that will eventually produce a value of type `T` or reject with an error, typed as the generic interface `Promise<T>`. For example, `Promise<User>` guarantees that upon resolution, the value passed to `.then()` or returned by `await` is strictly of type `User`. Note that Promise rejections are untyped in TypeScript—a rejected Promise always yields `unknown` (or `any`) in catch blocks.\"",
    "code": "function fetchUserData(id: string): Promise<{ id: string; name: string }> {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id, name: \"Aria\" }), 100);\n  });\n}"
  },
  {
    "id": 99,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Beginner",
    "category": "Async Programming",
    "question": "How do you type an `async` function?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, an `async` function **must always return a `Promise<T>`**. Even if you write `return 42` inside an `async` function body, JavaScript automatically wraps that value in a Promise at runtime. Therefore, TypeScript enforces that the return type annotation must be `Promise<number>`, never plain `number`. If an async function returns no value, its return type is `Promise<void>`.\"",
    "code": "// Valid: Return type must be Promise<number>, not number!\nasync function calculateDiscount(price: number): Promise<number> {\n  const rate = await fetchDiscountRate();\n  return price * rate;\n}\n\nasync function logAction(action: string): Promise<void> {\n  await sendTelemetry(action);\n}"
  },
  {
    "id": 100,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Senior",
    "category": "Error Handling",
    "question": "How do you handle errors in TypeScript?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In modern TypeScript with strict mode enabled, the error caught in a `catch (err: unknown)` block is strictly typed as `unknown`. Because JavaScript permits throwing any arbitrary value (`throw 'network failed'`, `throw 500`), you cannot directly access `err.message`. You must narrow `err` using `if (err instanceof Error)`. In enterprise architectures, we prefer the **Result pattern** (`type Result<T, E> = { ok: true; data: T } | { ok: false; error: E }`), turning unpredictable thrown runtime exceptions into explicit, strongly typed union contracts.\"",
    "code": "// Standard Narrowing:\ntry {\n  executeOperation();\n} catch (err: unknown) {\n  if (err instanceof Error) {\n    console.error(err.message);\n  } else {\n    console.error(\"Unknown error thrown:\", String(err));\n  }\n}"
  },
  {
    "id": 101,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Intermediate",
    "category": "API Design",
    "question": "What is a type-safe API response model?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A type-safe API response model is a generic discriminated union representing network outcomes. Instead of combining nullable data with nullable errors, the model splits into distinct variants based on a `success: boolean` or `status` property. When `success: true`, the generic `data: T` payload is guaranteed. When `success: false`, the `error` object is guaranteed. This forces frontend consuming code to verify success before accessing data, preventing runtime crashes.\"",
    "code": "type ApiResponse<T> =\n  | { success: true; data: T; timestamp: number }\n  | { success: false; error: { code: string; message: string }; timestamp: number };\n\nfunction handleResponse<T>(res: ApiResponse<T>) {\n  if (res.success) {\n    console.log(res.data); // data is guaranteed\n  } else {\n    console.error(res.error.message); // error is guaranteed\n  }\n}"
  },
  {
    "id": 102,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Beginner",
    "category": "Functions",
    "question": "How do you type a callback?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You type a callback using a function type expression: `(param: ParamType) => ReturnType`. For callbacks that perform side effects where the caller does not care about the returned value, use `void` as the return type (such as `(event: ClickEvent) => void`). If the callback is optional, use `?:` after the parameter name.\"",
    "code": "interface ButtonProps {\n  label: string;\n  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;\n  onSuccess?: (timestamp: number) => void; // Optional callback\n}"
  },
  {
    "id": 103,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Beginner",
    "category": "Async Programming",
    "question": "How do you type a Promise that returns no useful value?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You type it as `Promise<void>`. This indicates that the asynchronous operation completes successfully with an `undefined` resolved value, commonly used for fire-and-forget background jobs, file uploads, or database write operations.\"",
    "code": "async function deleteUserSession(sessionId: string): Promise<void> {\n  await db.sessions.delete(sessionId);\n}"
  },
  {
    "id": 104,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Intermediate",
    "category": "Functions",
    "question": "How do you type a function that accepts multiple callback types?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You can type it either using a union of function types (`callback: ((data: string) => void) | ((error: Error) => void)`) or by using function overloads. Function overloads are generally preferred when the callback signature depends directly on an earlier argument, such as an event name in an EventEmitter pattern.\"",
    "code": "type DataCallback = (data: string) => void;\ntype ErrorCallback = (err: Error) => void;\n\nfunction addListener(event: \"data\", cb: DataCallback): void;\nfunction addListener(event: \"error\", cb: ErrorCallback): void;\nfunction addListener(event: string, cb: (...args: any[]) => void): void {\n  // Implementation\n}"
  },
  {
    "id": 105,
    "partId": 8,
    "section": "H. Modules, async programming, and errors",
    "difficulty": "Intermediate",
    "category": "Compiler & Runtime",
    "question": "What is the difference between compile-time errors and runtime errors?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A compile-time error is detected by the TypeScript compiler (`tsc`) or IDE during development before any code is executed—such as a type mismatch, typo, or missing property. A runtime error occurs during active code execution in Node.js or the browser—such as a network timeout, out-of-memory crash, or corrupted database payload. TypeScript eliminates compile-time errors, but runtime errors at external boundaries still require defensive runtime handling.\"",
    "code": "// Compile-time error: Caught before running\n// const n: number = \"hello\"; // ❌ Compile error\n\n// Runtime error: Compiles cleanly, crashes at runtime without Zod\nconst parsed = JSON.parse('{\"status\": 500}') as { user: { name: string } };\n// parsed.user.name -> 💥 Runtime TypeError: Cannot read properties of undefined"
  },
  {
    "id": 106,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Beginner",
    "category": "React Integration",
    "question": "How do you type React component props?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In modern React (React 18 & 19), you type component props by defining an interface or type alias representing the prop object, and typing the function's parameter directly: `function Button({ label, onClick }: ButtonProps)`. We avoid the legacy `React.FC` (FunctionComponent) type because it unnecessarily complicated generic components, added implicit children in React 17, and offered no practical benefit over direct prop annotations.\"",
    "code": "interface ButtonProps {\n  label: string;\n  variant?: \"primary\" | \"secondary\";\n  disabled?: boolean;\n  onClick: () => void;\n}\n\nexport function Button({ label, variant = \"primary\", disabled = false, onClick }: ButtonProps) {\n  return (\n    <button className={`btn-${variant}`} disabled={disabled} onClick={onClick}>\n      {label}\n    </button>\n  );\n}"
  },
  {
    "id": 107,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Beginner",
    "category": "React Integration",
    "question": "How do you type `useState` in React?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"If the initial state provides an unambiguous type, TypeScript automatically infers the state type (e.g. `useState(0)` infers `number`). However, when state is initialized as `null` or `undefined` before data is loaded from an API, you must explicitly pass a generic argument: `useState<User | null>(null)`. This ensures that `setUser` accepts a `User` and that the compiler forces you to check for `null` before dereferencing properties.\"",
    "code": "interface UserProfile { id: string; name: string; }\n\n// 1. Inferred from initial value:\nconst [count, setCount] = useState(0); // number\n\n// 2. Explicit generic parameter for async/nullable state:\nconst [user, setUser] = useState<UserProfile | null>(null); // UserProfile | null"
  },
  {
    "id": 108,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "React Integration",
    "question": "How do you type React event handlers?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"React provides synthetic event types parameterized by the DOM element triggering the event, located in the `React` namespace: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, and `React.FormEvent<HTMLFormElement>`. You can type the handler function itself (`React.ChangeEventHandler<HTMLInputElement>`) or type the `event` parameter inside the handler.\"",
    "code": "export function SearchInput() {\n  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    console.log(\"Input value:\", e.target.value);\n  };\n\n  return <input type=\"text\" onChange={handleChange} />;\n}"
  },
  {
    "id": 109,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "React Integration",
    "question": "How do you type a React `useRef`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`useRef` has two distinct typing modes in React:\n1. **DOM Ref (Readonly current)**: Initialized with `null` and a DOM generic type: `useRef<HTMLInputElement>(null)`. The compiler understands this ref will be attached to JSX, and types `.current` as `HTMLInputElement | null`.\n2. **Mutable Value Ref**: Initialized without `null`: `useRef<number>(0)`. Returns a mutable `MutableRefObject` where you can freely assign `ref.current = 5`.\"",
    "code": "// DOM Ref:\nconst inputRef = useRef<HTMLInputElement>(null);\nconst focusInput = () => {\n  inputRef.current?.focus(); // Type safe\n};\n\n// Mutable instance variable ref (e.g. interval ID):\nconst timerRef = useRef<number | null>(null);\ntimerRef.current = window.setInterval(() => {}, 1000);"
  },
  {
    "id": 110,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Beginner",
    "category": "React Integration",
    "question": "How do you type children in React?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You should always type the `children` prop as `React.ReactNode`. `React.ReactNode` is the most permissive and accurate type for JSX children, encompassing strings, numbers, booleans, `null`, `undefined`, React elements, and arrays of nodes. Avoid using `JSX.Element` for children because it forbids primitive text strings and fragments.\"",
    "code": "import React, { ReactNode } from \"react\";\n\ninterface ContainerProps {\n  title: string;\n  children: ReactNode; // ✅ Best practice\n}\n\nexport function Container({ title, children }: ContainerProps) {\n  return (\n    <div className=\"container\">\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  );\n}"
  },
  {
    "id": 111,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "React Integration",
    "question": "How do you type a React form submission handler?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Type the form submission event parameter as `React.FormEvent<HTMLFormElement>`. This provides type safety for calling `e.preventDefault()` and accessing standard form attributes without compiler warnings.\"",
    "code": "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n  e.preventDefault();\n  const formData = new FormData(e.currentTarget);\n  console.log(\"Email:\", formData.get(\"email\"));\n};"
  },
  {
    "id": 112,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Senior",
    "category": "React Integration",
    "question": "How do you type a reusable generic React component?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You create a generic React component by declaring a generic type parameter on the component function signature before the props parameter: `function List<T>({ items, renderItem }: ListProps<T>)`. In `.tsx` arrow function syntax, add a trailing comma (`<T,>`) to prevent the JSX parser from misinterpreting the generic bracket as an unclosed HTML tag.\"",
    "code": "interface TableProps<T> {\n  rows: T[];\n  renderRow: (item: T) => React.ReactNode;\n}\n\n// Function declaration syntax:\nexport function Table<T>({ rows, renderRow }: TableProps<T>) {\n  return <div>{rows.map(renderRow)}</div>;\n}\n\n// Arrow function syntax (needs trailing comma in TSX):\nconst Grid = <T,>({ items }: { items: T[] }) => <div>{items.length}</div>;"
  },
  {
    "id": 113,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "Backend Integration",
    "question": "Why is TypeScript useful in Node.js backend development?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"TypeScript brings critical enterprise reliability to Node.js backend services. In backend engineering, runtime exceptions can crash entire worker processes or corrupt transaction states. TypeScript enforces compile-time contracts across database repositories, middleware pipelines, and third-party SDKs (Stripe, AWS). Furthermore, it allows full-stack TypeScript teams to share Data Transfer Objects (DTOs) and validation schemas between the NestJS backend and the React frontend in a monorepo, completely eliminating API drift.\"",
    "code": "// Shared DTO between backend and frontend:\nexport interface CreateOrderDto {\n  itemSlug: string;\n  quantity: number;\n  paymentGateway: \"STRIPE\" | \"RAZORPAY\";\n}"
  },
  {
    "id": 114,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "Backend Integration",
    "question": "How do you type an Express request handler?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In Express with `@types/express`, you type handlers using the generic `Request` and `Response` interfaces: `Request<Params, ResBody, ReqBody, ReqQuery>`. Specifying these generics provides compile-time autocompletion and safety for `req.params`, `req.body`, and `res.json()`.\"",
    "code": "import { Request, Response } from \"express\";\n\ninterface Params { userId: string; }\ninterface Body { email: string; }\ninterface ResData { success: boolean; }\n\nexport function updateUserHandler(\n  req: Request<Params, ResData, Body>,\n  res: Response<ResData>\n) {\n  const { userId } = req.params; // string\n  const { email } = req.body;     // string\n  res.json({ success: true });\n}"
  },
  {
    "id": 115,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "NestJS Integration",
    "question": "What is the role of DTOs in NestJS?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In NestJS, a Data Transfer Object (DTO) defines the schema and contract for data sent across the network over HTTP or WebSocket boundaries. Combined with `class-validator` decorators and NestJS's global `ValidationPipe`, DTOs provide **both compile-time TypeScript type checking and automatic runtime validation and sanitization**, rejecting invalid or malicious incoming payloads before they ever reach the controller logic.\"",
    "code": "import { IsString, IsEmail, MinLength } from \"class-validator\";\n\nexport class RegisterUserDto {\n  @IsEmail()\n  email!: string;\n\n  @IsString()\n  @MinLength(8)\n  password!: string;\n}"
  },
  {
    "id": 116,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Senior",
    "category": "NestJS Integration",
    "question": "What is the difference between a TypeScript interface and a NestJS DTO class?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The critical difference is that **TypeScript interfaces are completely erased during compilation**, leaving zero runtime artifacts. Classes, however, are part of the ES6 specification and emit real JavaScript constructor functions that exist at runtime. NestJS relies on runtime metadata reflection (`reflect-metadata`) to inspect incoming request types and apply `class-validator` decorators. If you declare a DTO as an `interface`, NestJS's `ValidationPipe` cannot inspect it at runtime and validation fails silently. DTOs in NestJS must always be declared as **Classes**.\"",
    "code": "// ❌ BROKEN in NestJS: Interface has no runtime existence\n// export interface CreatePostDto { title: string; }\n\n// ✅ CORRECT: Class exists at runtime for validation pipes\nimport { IsNotEmpty, IsString } from \"class-validator\";\n\nexport class CreatePostDto {\n  @IsString()\n  @IsNotEmpty()\n  title!: string;\n}"
  },
  {
    "id": 117,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "NestJS Integration",
    "question": "How do you type a NestJS service dependency?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In NestJS, service dependencies are injected via constructor parameter properties typed with the service class itself. Because the service class exists at runtime, NestJS uses TypeScript's `emitDecoratorMetadata: true` setting to inspect the constructor parameter type and automatically resolve and inject the singleton instance from the IoC container.\"",
    "code": "import { Injectable } from \"@nestjs/common\";\n\n@Injectable()\nexport class UsersService {\n  findAll() { return [\"User1\", \"User2\"]; }\n}\n\n@Injectable()\nexport class OrdersService {\n  constructor(private readonly usersService: UsersService) {} // Type-safe Dependency Injection\n}"
  },
  {
    "id": 118,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "Databases",
    "question": "How do you model a database entity or repository result?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"You model database entities by clearly distinguishing between required columns, nullable columns (`string | null` for SQL NULL), and auto-generated fields (`id`, `createdAt`). For database queries, use generic repository interfaces parameterized by the entity type, and create dedicated `CreateDto` (omitting auto-generated fields) and `UpdateDto` (using `Partial`) types.\"",
    "code": "interface UserEntity {\n  id: string;                      // PRIMARY KEY\n  email: string;                  // UNIQUE NOT NULL\n  avatarUrl: string | null;       // NULLABLE in SQL\n  createdAt: Date;                // DEFAULT NOW()\n}\n\ntype CreateUserEntity = Omit<UserEntity, \"id\" | \"createdAt\">;\ntype UpdateUserEntity = Partial<CreateUserEntity>;"
  },
  {
    "id": 119,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Senior",
    "category": "Backend Security",
    "question": "What are environment variable typing pitfalls in Node.js?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In standard Node.js, `process.env` is typed as `NodeJS.ProcessEnv`, where every property is `string | undefined`. The primary pitfalls are: 1) Assuming required variables exist without checking, causing silent runtime failures; 2) Forgetting that all environment variables are strings (e.g. `PORT='8080'`, `IS_PROD='false'`), where checking `if (process.env.IS_PROD)` evaluates to `true`! Senior architectures solve this by validating and parsing `process.env` at startup using a Zod schema or NestJS `ConfigModule` with Joi.\"",
    "code": "// ✅ Senior Solution: Parse env with Zod at startup\nimport { z } from \"zod\";\n\nconst EnvSchema = z.object({\n  PORT: z.coerce.number().default(3000),\n  NODE_ENV: z.enum([\"development\", \"production\", \"test\"]),\n  DATABASE_URL: z.string().url()\n});\n\nexport const env = EnvSchema.parse(process.env); // Throws immediately on startup if missing!"
  },
  {
    "id": 120,
    "partId": 9,
    "section": "I. React, Node.js, and NestJS integration",
    "difficulty": "Intermediate",
    "category": "Error Handling",
    "question": "How does TypeScript help with service-layer error handling?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"TypeScript allows service layers to use the Result Monad pattern or custom typed Domain Exceptions instead of generic untyped `throw`. By returning a discriminated union like `Result<Order, InsufficientFundsError | ItemNotFoundError>`, the compiler forces controllers to exhaustively handle each specific business failure scenario before attempting to access the order.\"",
    "code": "type ServiceResult<T, E> =\n  | { ok: true; value: T }\n  | { ok: false; error: E };\n\ntype CheckoutError = \"OUT_OF_STOCK\" | \"PAYMENT_DECLINED\";\n\nfunction checkout(cartId: string): ServiceResult<{ orderId: string }, CheckoutError> {\n  return { ok: false, error: \"OUT_OF_STOCK\" };\n}"
  },
  {
    "id": 121,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Beginner",
    "category": "Compiler & Config",
    "question": "What is `tsconfig.json`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`tsconfig.json` is the root configuration file for a TypeScript project. It marks the directory as the project root and specifies the compiler options (`compilerOptions`) required to compile the project—such as target ECMAScript version, module system, strictness flags, file inclusions, path aliases, and declaration generation.\"",
    "code": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"strict\": true,\n    \"noEmit\": true\n  },\n  \"include\": [\"src/**/*\"]\n}"
  },
  {
    "id": 122,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Compiler & Config",
    "question": "What is the difference between `target` and `lib` in tsconfig?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`target` dictates **what version of JavaScript the compiler emits** (e.g. `ES2015` down-levels arrow functions and classes, while `ES2022` preserves modern syntax). `lib` specifies **which ambient type declaration files are included** to describe the environment (e.g. `DOM` includes `window` and `document`, `ES2022` includes modern Array methods like `at()`). If `lib` is omitted, it defaults based on the `target` setting.\"",
    "code": "// tsconfig.json:\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\", // Code transformation target\n    \"lib\": [\"ES2022\", \"DOM\", \"DOM.Iterable\"] // Environment type definitions\n  }\n}"
  },
  {
    "id": 123,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Beginner",
    "category": "Compiler & Runtime",
    "question": "What is the difference between `tsc` and a runtime such as Node.js?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"`tsc` is the TypeScript compiler: it performs static analysis, type checking, and transpiles TypeScript code into JavaScript. It does not execute your application code. Node.js is a JavaScript runtime built on V8 that actually executes the emitted JavaScript. You compile with `tsc`, and you run with Node.js.\"",
    "code": "// Terminal command sequence:\n// 1. tsc --noEmit     -> Checks types, emits nothing\n// 2. tsc              -> Compiles src/ to dist/\n// 3. node dist/app.js -> Executes the emitted JavaScript in Node.js runtime"
  },
  {
    "id": 124,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Declaration Files",
    "question": "What is a declaration file (`.d.ts`)?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A declaration file (`.d.ts`) contains **only type declarations and contracts**, with zero executable JavaScript code. It acts as a typed header file for JavaScript code, describing the shape of modules, globals, and third-party libraries (like those in `@types/node` or `@types/react`). Declaration files are generated automatically using the `declaration: true` compiler option.\"",
    "code": "// mathUtils.d.ts (Pure types):\nexport declare function add(a: number, b: number): number;\nexport declare const PI: number;"
  },
  {
    "id": 125,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Declaration Files",
    "question": "What is the `declare` keyword?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"The `declare` keyword introduces ambient declarations, telling the TypeScript compiler: 'This identifier exists in the global runtime environment (e.g. from an external CDN script or injected global variable), so do not flag it as undefined and do not emit any JavaScript for this statement.'\"",
    "code": "// Declare global analytics SDK injected by HTML script tag:\ndeclare const Stripe: (publishableKey: string) => any;\n\n// Safe to call in TS code without compiler errors:\nconst stripe = Stripe(\"pk_live_123\");"
  },
  {
    "id": 126,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Senior",
    "category": "Module Augmentation",
    "question": "What is module augmentation?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Module augmentation is a TypeScript feature that allows you to extend existing module declarations from external packages without modifying their source files. Using `declare module 'package-name'`, you can append new properties or methods to existing interfaces through declaration merging. This is universally used to attach custom user or tenant data to Express `Request` or extend session types in NextAuth.\"",
    "code": "// Augmenting Express Request:\nimport \"express\";\n\ndeclare module \"express\" {\n  export interface Request {\n    tenantId: string;\n    user?: { id: string; role: string };\n  }\n}"
  },
  {
    "id": 127,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Validation",
    "question": "What is the difference between compile-time validation and runtime validation?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Compile-time validation occurs during development via the TypeScript compiler, verifying that internal developer code adheres to defined types. It costs zero runtime CPU because types are erased. Runtime validation occurs while the app is running in production, using libraries like Zod or class-validator to inspect untrusted incoming JSON from network requests, validating types, lengths, and formats. Both are required for production defense.\"",
    "code": "// Compile-time: Types erased in production\ninterface Input { email: string }\n\n// Runtime: Actually validates data in production memory\nimport { z } from \"zod\";\nconst InputSchema = z.object({ email: z.string().email() });"
  },
  {
    "id": 128,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Type Safety",
    "question": "Why is `JSON.parse()` a type-safety concern?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In the standard TypeScript library, `JSON.parse()` returns `any`. Because `any` disables all type checking and silently contaminates any variable it touches, developers often write `const user = JSON.parse(str) as User`. If the JSON payload is malformed or missing fields, the compiler raises no alarms, but the application crashes at runtime with a `TypeError` upon dereferencing.\"",
    "code": "// ❌ Unsafe JSON.parse returning 'any':\nconst data = JSON.parse('{\"id\": 1}'); // data is 'any'\n// console.log(data.user.name); // Compiles! 💥 Crashes at runtime!\n\n// ✅ Safe approach: Parse with Zod\nconst UserSchema = z.object({ id: z.number(), name: z.string() });\nconst safeUser = UserSchema.parse(JSON.parse('{\"id\": 1, \"name\": \"Aria\"}'));"
  },
  {
    "id": 129,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Immutability",
    "question": "What is the difference between shallow and deep immutability?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Shallow immutability (like `readonly T` or `Object.freeze`) only locks the immediate top-level properties of an object. If a property references another nested object or array, those nested contents can still be freely modified. Deep immutability recursively applies `readonly` down the entire object tree, guaranteeing that nested properties and arrays cannot be mutated.\"",
    "code": "// Shallow Readonly:\ninterface Shallow { readonly nested: { count: number } }\nconst s: Shallow = { nested: { count: 0 } };\n// s.nested = { count: 1 }; // ❌ Error\ns.nested.count = 1; // ⚠️ Allowed! Shallow readonly does not protect nested objects!\n\n// Deep Readonly (Recursive type):\ntype DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];\n};"
  },
  {
    "id": 130,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Functions & Overloads",
    "question": "What is function overloading?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Function overloading allows a function to support multiple different parameter-to-return-type relationships. You write two or more overload signatures describing the permitted calling patterns, followed by a single implementation signature that handles all cases. Callers can only invoke the overload signatures; the implementation signature is invisible externally.\"",
    "code": "function makeDate(timestamp: number): Date;\nfunction makeDate(m: number, d: number, y: number): Date;\nfunction makeDate(mOrTimestamp: number, d?: number, y?: number): Date {\n  if (d !== undefined && y !== undefined) {\n    return new Date(y, mOrTimestamp, d);\n  }\n  return new Date(mOrTimestamp);\n}"
  },
  {
    "id": 131,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Senior",
    "category": "Functions & Overloads",
    "question": "What is the difference between overloads and union parameters?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Union parameters (`fn(x: string | number)`) treat arguments independently: `x` can be string or number, but the return type is usually fixed or a loose union. Function overloads are required when the **return type depends directly on the argument type** (e.g. passing a string returns a string, passing a number returns a number). However, if an operation can be cleanly handled with generics or union parameters, overloads should be avoided as they add verbosity.\"",
    "code": "// Overload: Return type tied to input type\nfunction parse(input: string): string;\nfunction parse(input: number): number;\nfunction parse(input: string | number): string | number {\n  return typeof input === \"string\" ? input.trim() : input * 10;\n}"
  },
  {
    "id": 132,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Senior",
    "category": "Branded Types",
    "question": "What is a branded type?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"A branded type (or nominal type) is an advanced TypeScript pattern that simulates nominal typing under TypeScript's structural type system. By intersecting a primitive like `string` with a phantom object containing a unique brand symbol (`string & { readonly __brand: 'UserId' }`), TypeScript treats it as distinct from any plain string. This prevents critical bugs like accidentally passing an `OrderId` into a function expecting a `UserId`.\"",
    "code": "type Brand<K, T> = K & { readonly __brand: T };\n\ntype UserId = Brand<string, \"UserId\">;\ntype OrderId = Brand<string, \"OrderId\">;\n\nfunction shipOrder(userId: UserId, orderId: OrderId) {}\n\nconst uid = \"usr_1\" as UserId;\nconst oid = \"ord_9\" as OrderId;\n\nshipOrder(uid, oid); // Valid!\n// shipOrder(oid, uid); // ❌ Error: Type 'OrderId' is not assignable to type 'UserId'."
  },
  {
    "id": 133,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Intermediate",
    "category": "Basic Types",
    "question": "What is the difference between `object` and `{}`?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"In TypeScript, `object` (lowercase) represents any non-primitive value (anything where `typeof x !== 'number'`, `'string'`, `'boolean'`, etc.)—including plain objects, arrays, and functions. In contrast, `{}` (the empty object type) represents **any non-nullish value**! In TypeScript, primitive numbers, strings, and booleans are assignable to `{}` because they possess Object prototype methods via autoboxing. Only `null` and `undefined` cannot be assigned to `{}`.\"",
    "code": "let nonPrimitive: object;\nnonPrimitive = { a: 1 }; // Valid\nnonPrimitive = [1, 2];   // Valid\n// nonPrimitive = \"text\"; // ❌ Error: Type 'string' is not assignable to 'object'.\n\nlet nonNullish: {};\nnonNullish = \"text\";     // ⚠️ Valid! Strings box into objects!\n// nonNullish = null;    // ❌ Error: Type 'null' is not assignable to '{}'."
  },
  {
    "id": 134,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Senior",
    "category": "Variance",
    "question": "What are variance and function type compatibility?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"Variance describes how subtyping of complex types relates to subtyping of their component types. Return types are **covariant** (subtypes remain subtypes). Function parameters are **contravariant** under `strictFunctionTypes: true` (subtyping direction is reversed). For example, a callback expecting `(dog: Dog) => void` can safely accept a handler that takes `(animal: Animal) => void`, because any function capable of handling any Animal can safely handle a Dog. But the reverse is unsafe and rejected by the compiler.\"",
    "code": "class Animal { name = \"Animal\"; }\nclass Dog extends Animal { bark() {} }\n\nlet handleAnimal = (a: Animal) => { console.log(a.name); };\nlet handleDog = (d: Dog) => { d.bark(); };\n\n// Contravariance in action under strictFunctionTypes:\nhandleDog = handleAnimal; // ✅ Valid! handleAnimal handles any Animal, including Dogs.\n// handleAnimal = handleDog; // ❌ Compile Error! Unsafe: handleDog expects bark() on general Animals."
  },
  {
    "id": 135,
    "partId": 10,
    "section": "J. Compiler, configuration, and runtime safety",
    "difficulty": "Senior",
    "category": "satisfies Operator",
    "question": "What is the difference between `satisfies` and explicit annotation for configuration objects?",
    "answer": "**Spoken Pitch (30–60 Seconds):**\n\"When you use an explicit type annotation on a configuration object (`const config: Config = { ... }`), TypeScript upcasts and widens all properties to the broader declared types, causing you to lose specific literal string keys, exact array lengths, and union narrowing. When you use the `satisfies` operator (`const config = { ... } satisfies Config`), the compiler validates that the object conforms strictly to the `Config` contract, but **retains the exact, narrow inferred types** of every property, providing flawless autocompletion and type-safe navigation.\"",
    "code": "type RouteConfig = Record<string, { path: string; exact?: boolean }>;\n\n// With 'satisfies': Exact paths and keys preserved\nconst routes = {\n  home: { path: \"/\" },\n  checkout: { path: \"/checkout\", exact: true }\n} satisfies RouteConfig;\n\n// Exact key 'home' and property 'path' are known:\nconsole.log(routes.home.path); // Typesafe! Autocompletes \"home\" and \"checkout\"."
  },
  {
    "id": 136,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "String Algorithms",
    "question": "Coding: Create a type-safe function that reverses a string",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"To reverse a string type-safely in TypeScript, we must distinguish between simple ASCII reversal, Unicode grapheme cluster safety, and compile-time type-level string reversal. In an interview, I present the built-in split-reverse-join method, explain its UTF-16 surrogate pair limitation with emojis, demonstrate the Unicode-aware loop using `Intl.Segmenter`, and show how TypeScript can even reverse string literal types at compile time using recursive conditional types.\"",
    "runtimeBehavior": "Reversing a string is an $O(N)$ runtime operation in JavaScript. Calling split('') splits UTF-16 code units; compound emojis (surrogate pairs) become corrupted unless an iterator or Intl.Segmenter is used. At compile time, TypeScript can reverse string literal types recursively.",
    "approaches": [
      {
        "title": "Approach 1: Standard Built-in Split-Reverse-Join (Baseline)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "The standard and most concise solution. Splits the string into an array of characters, reverses the array in-place, and joins it back into a string. Suboptimal for strings containing multi-byte Unicode characters (e.g. emojis or accented characters).",
        "code": "function reverseStringBuiltin(str: string): string {\n  return str.split(\"\").reverse().join(\"\");\n}\n\n// Test cases:\nconsole.log(reverseStringBuiltin(\"hello\")); // \"olleh\"\nconsole.log(reverseStringBuiltin(\"TypeScript\")); // \"tpircSepyT\""
      },
      {
        "title": "Approach 2: Unicode-Aware In-Place Two-Pointer / Array.from (Improved)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Using Array.from() or spread operator correctly splits surrogate pairs into intact Unicode code points, preventing character corruption.",
        "code": "function reverseStringUnicode(str: string): string {\n  // Array.from handles surrogate pairs correctly:\n  const chars = Array.from(str);\n  let left = 0;\n  let right = chars.length - 1;\n\n  while (left < right) {\n    const temp = chars[left];\n    chars[left] = chars[right];\n    chars[right] = temp;\n    left++;\n    right--;\n  }\n\n  return chars.join(\"\");\n}\n\nconsole.log(reverseStringUnicode(\"hello 🚀\")); // \"🚀 olleh\""
      },
      {
        "title": "Approach 3: Compile-Time Type-Level String Reversal (Type Challenge)",
        "timeComplexity": "O(N) compiler recursion",
        "spaceComplexity": "O(N) AST depth",
        "explanation": "A type-level challenge demonstrating recursive conditional types and template literal pattern matching. Evaluated entirely by the TypeScript compiler at build time with zero runtime JavaScript footprint!",
        "code": "// Compile-time Type-Level Reversal:\ntype ReverseString<S extends string> = S extends `${infer Head}${infer Tail}`\n  ? `${ReverseString<Tail>}${Head}`\n  : \"\";\n\n// Verified at compile-time:\ntype ReversedHello = ReverseString<\"hello\">; // Evaluates to \"olleh\"!\ntype ReversedTS = ReverseString<\"TypeScript\">; // \"tpircSepyT\""
      }
    ],
    "keyPoints": [
      "Baseline split-reverse-join has O(N) time and space complexity.",
      "Surrogate pair corruption is avoided with Array.from(str).",
      "TypeScript can reverse literal strings at compile-time with recursive types."
    ],
    "followUps": [
      {
        "q": "What is the recursion limit of template literal types in TypeScript?",
        "a": "TypeScript has a compiler recursion depth limit of approximately 1,000 stack frames to prevent infinite type-checker loops."
      }
    ],
    "tip": "Offering the compile-time type-level solution (ReverseString<S>) alongside the runtime algorithm is an instant Staff Engineer signal."
  },
  {
    "id": 137,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Array Algorithms",
    "question": "Coding: Find the maximum number in an array",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"Finding the maximum number in an array requires handling empty arrays defensively. While `Math.max(...nums)` is common, it crashes with a Maximum Call Stack Size Exceeded error on large arrays (100k+ elements) and returns `-Infinity` on empty arrays. The optimal production solution is a single-pass $O(N)$ loop with an explicit return type of `number | null` or using a typed non-empty array tuple constraint.\"",
    "approaches": [
      {
        "title": "Approach 1: Math.max Spread (Baseline)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N) call-stack",
        "explanation": "Uses Math.max(...nums). Simple to write, but dangerous for large arrays due to JavaScript call-stack limits on function arguments (~65,536 elements in V8).",
        "code": "function findMaxSpread(nums: number[]): number | null {\n  if (nums.length === 0) return null;\n  return Math.max(...nums);\n}"
      },
      {
        "title": "Approach 2: Single-Pass Iterative Scan (Optimal Production)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Iterates through the array once, maintaining a maximum tracker. Memory-safe and handles arbitrarily large arrays without call-stack overflow risk.",
        "code": "function findMaxIterative(nums: number[]): number | null {\n  if (nums.length === 0) return null;\n\n  let max = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > max) {\n      max = nums[i];\n    }\n  }\n  return max;\n}\n\nconsole.log(findMaxIterative([12, 45, 7, 89, 23])); // 89\nconsole.log(findMaxIterative([])); // null"
      },
      {
        "title": "Approach 3: NonEmptyArray Type Constraint (Type-Safe)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Uses TypeScript tuple typing to enforce at compile-time that the array contains at least one number, eliminating the need to return null!",
        "code": "// Enforces at least 1 element: [number, ...number[]]\ntype NonEmptyArray<T> = [T, ...T[]];\n\nfunction findMaxGuaranteed(nums: NonEmptyArray<number>): number {\n  return nums.reduce((max, curr) => (curr > max ? curr : max), nums[0]);\n}\n\nconsole.log(findMaxGuaranteed([10, 50, 30])); // 50 (Returns number, not number | null!)\n// findMaxGuaranteed([]); // ❌ Compile Error: Source has 0 elements but target requires 1."
      }
    ],
    "keyPoints": [
      "Math.max(...arr) fails on arrays > 65k elements with call stack overflow.",
      "Single-pass iterative loop runs in O(N) time and O(1) space.",
      "NonEmptyArray<T> guarantees array length >= 1 at compile time."
    ],
    "followUps": [
      {
        "q": "Why does Math.max() return -Infinity when called with no arguments?",
        "a": "Because -Infinity is the identity element of the max operation (any number x > -Infinity)."
      }
    ],
    "tip": "Demonstrating the NonEmptyArray<T> tuple constraint proves you use TypeScript to eliminate runtime defensive checks."
  },
  {
    "id": 138,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Array Algorithms",
    "question": "Coding: Remove duplicate values from an array",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"Removing duplicates from an array can be solved using `Array.from(new Set(arr))` for $O(N)$ performance, or using an in-place two-pointer technique if the array is already sorted ($O(1)$ auxiliary space). For object arrays, we implement a generic deduplication utility with an extractor key function. In type space, we can even deduplicate tuple literal types using recursive conditional types.\"",
    "approaches": [
      {
        "title": "Approach 1: ES6 Set (Baseline Standard)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Leverages the ES6 Set data structure to filter primitive duplicates in a single pass.",
        "code": "function removeDuplicates<T>(arr: T[]): T[] {\n  return Array.from(new Set(arr));\n}\n\nconsole.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]"
      },
      {
        "title": "Approach 2: Generic Key Extractor for Object Arrays (Production)",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "explanation": "Deduplicates arrays of complex objects based on a specific property key (like user.id) using a Set.",
        "code": "function deduplicateBy<T, K>(arr: T[], keyExtractor: (item: T) => K): T[] {\n  const seen = new Set<K>();\n  const result: T[] = [];\n\n  for (const item of arr) {\n    const key = keyExtractor(item);\n    if (!seen.has(key)) {\n      seen.add(key);\n      result.push(item);\n    }\n  }\n  return result;\n}\n\nconst users = [\n  { id: \"u1\", name: \"Alice\" },\n  { id: \"u2\", name: \"Bob\" },\n  { id: \"u1\", name: \"Alice Duplicate\" }\n];\nconsole.log(deduplicateBy(users, u => u.id)); // [{ id: \"u1\", ... }, { id: \"u2\", ... }]"
      },
      {
        "title": "Approach 3: In-Place Two-Pointer Deduplication for Sorted Arrays",
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1) auxiliary",
        "explanation": "If the array is sorted, we can remove duplicates in-place with O(1) extra memory by overwriting elements.",
        "code": "function removeDuplicatesInPlace(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  let writeIndex = 1;\n\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) {\n      nums[writeIndex] = nums[i];\n      writeIndex++;\n    }\n  }\n  nums.length = writeIndex; // Truncate array\n  return writeIndex;\n}\n\nconst sorted = [1, 1, 2, 2, 3];\nremoveDuplicatesInPlace(sorted);\nconsole.log(sorted); // [1, 2, 3]"
      }
    ],
    "keyPoints": [
      "Array.from(new Set(arr)) works in O(N) time for primitives.",
      "Object deduplication requires a keyExtractor and Set lookup.",
      "Sorted arrays can be deduplicated in-place in O(1) auxiliary space."
    ],
    "followUps": [
      {
        "q": "How does Set equality compare objects?",
        "a": "Sets use SameValueZero equality: distinct object references with identical properties are considered distinct."
      }
    ],
    "tip": "Always provide deduplicateBy for objects when answering this in interviews—it shows full-stack experience."
  },
  {
    "id": 139,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Senior",
    "category": "API Design",
    "question": "Coding: Create a type-safe generic API response",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"A production-grade generic API response model must be implemented as a discriminated union rather than a kitchen-sink interface with optional properties. We create a generic envelope parameterized by `TData`, discriminating on `success: boolean`. This guarantees that callers can only access `data` after verifying that `success` is true, eliminating `undefined` exceptions across the codebase.\"",
    "approaches": [
      {
        "title": "Approach 1: Discriminated Union API Envelope (Production Standard)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "A robust generic discriminated union model that guarantees data availability in success branches and error metadata in failure branches.",
        "code": "export type ApiResponse<TData, TMeta = Record<string, unknown>> =\n  | {\n      success: true;\n      data: TData;\n      meta?: TMeta;\n      timestamp: number;\n    }\n  | {\n      success: false;\n      error: {\n        code: string;\n        message: string;\n        details?: unknown;\n      };\n      timestamp: number;\n    };\n\n// Factory functions:\nexport function ok<T>(data: T): ApiResponse<T> {\n  return { success: true, data, timestamp: Date.now() };\n}\n\nexport function fail(code: string, message: string): ApiResponse<never> {\n  return { success: false, error: { code, message }, timestamp: Date.now() };\n}"
      },
      {
        "title": "Approach 2: Result Monad Pattern with Map/Match Methods",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Encapsulates API outcomes in a functional Result class, allowing safe chained transformations without try/catch blocks.",
        "code": "export class Result<T, E = Error> {\n  private constructor(\n    private readonly _ok: boolean,\n    private readonly _value?: T,\n    private readonly _error?: E\n  ) {}\n\n  static ok<T>(value: T): Result<T, never> {\n    return new Result(true, value);\n  }\n\n  static fail<E>(error: E): Result<never, E> {\n    return new Result(false, undefined, error);\n  }\n\n  isOk(): boolean { return this._ok; }\n\n  map<U>(fn: (val: T) => U): Result<U, E> {\n    return this._ok ? Result.ok(fn(this._value!)) : Result.fail(this._error!);\n  }\n\n  unwrap(): T {\n    if (!this._ok) throw this._error;\n    return this._value!;\n  }\n}"
      }
    ],
    "keyPoints": [
      "Discriminated unions guarantee data presence when success: true.",
      "Factory functions (ok, fail) provide clean developer ergonomics.",
      "Result monad enables functional transformations without exceptions."
    ],
    "followUps": [
      {
        "q": "Why is ApiResponse<never> used for the failure factory function?",
        "a": "Because never contributes zero types to a union, allowing ApiResponse<never> to be assigned to ApiResponse<T> for any T."
      }
    ],
    "tip": "Explaining why fail returns ApiResponse<never> demonstrates expert-level understanding of union assignability."
  },
  {
    "id": 140,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Senior",
    "category": "Generic Operators",
    "question": "Coding: Create a type-safe function to get an object property",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"To get an object property type-safely, we combine generics with `keyof` and indexed access: `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`. For deep nested paths (like `'user.address.city'`), we can build a recursive template literal path parser that traverses object trees with compile-time verification.\"",
    "approaches": [
      {
        "title": "Approach 1: Single-Level getProperty with keyof (Standard)",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "explanation": "Extracts a single direct property with compile-time key verification and return type deduction.",
        "code": "function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst user = { id: \"u1\", name: \"Mohammed\", age: 29 };\nconst userName = getProperty(user, \"name\"); // Inferred type: string\n// getProperty(user, \"email\"); // ❌ Compile error: Argument not assignable to \"id\" | \"name\" | \"age\""
      },
      {
        "title": "Approach 2: Deep Path Getter with Dot Notation",
        "timeComplexity": "O(D) where D is path depth",
        "spaceComplexity": "O(1)",
        "explanation": "Safely navigates dot-separated paths like 'user.profile.name' with defensive null checks.",
        "code": "function getDeep<T = any>(obj: any, path: string): T | undefined {\n  return path.split(\".\").reduce((acc, part) => acc?.[part], obj);\n}\n\nconst data = { account: { balance: 5000 } };\nconsole.log(getDeep<number>(data, \"account.balance\")); // 5000"
      }
    ],
    "keyPoints": [
      "keyof constraint ensures key exists on object.",
      "T[K] accurately deduces the return type.",
      "Eliminates runtime undefined property lookups."
    ],
    "followUps": [
      {
        "q": "How does this compare to Lodash _.get()?",
        "a": "getProperty provides complete static verification and autocompletion in your IDE, whereas standard Lodash get() often defaults to any."
      }
    ],
    "tip": "Always write getProperty<T, K extends keyof T> cleanly from memory."
  },
  {
    "id": 141,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Discriminated Unions",
    "question": "Coding: Model an API result using a discriminated union",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"We model API results using an algebraic data type where a `status` property serves as the discriminator across three states: `'loading'`, `'success'`, and `'error'`. This guarantees that `data` only exists when `status === 'success'`, and `error` only exists when `status === 'error'`.\"",
    "code": "type RequestState<T> =\n  | { status: \"loading\" }\n  | { status: \"success\"; data: T; loadedAt: Date }\n  | { status: \"error\"; error: Error; code: number };\n\nfunction renderState(state: RequestState<string[]>) {\n  switch (state.status) {\n    case \"loading\":\n      return \"Loading spinner...\";\n    case \"success\":\n      return `Loaded ${state.data.length} items`;\n    case \"error\":\n      return `Error [${state.code}]: ${state.error.message}`;\n  }\n}"
  },
  {
    "id": 142,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Type Guards",
    "question": "Coding: Write a type guard for a user object",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"A type guard for a user object verifies at runtime that an unknown payload conforms to the `User` interface, returning a type predicate `val is User`. We inspect that the value is a non-null object, then verify each required property using `typeof`.\"",
    "code": "interface User {\n  id: string;\n  email: string;\n  age: number;\n}\n\nfunction isUser(val: unknown): val is User {\n  return (\n    typeof val === \"object\" &&\n    val !== null &&\n    \"id\" in val && typeof (val as any).id === \"string\" &&\n    \"email\" in val && typeof (val as any).email === \"string\" &&\n    \"age\" in val && typeof (val as any).age === \"number\"\n  );\n}"
  },
  {
    "id": 143,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Utility Types",
    "question": "Coding: Create a partial update type for a user",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"To create a type-safe partial update DTO, we first use `Omit` to strip immutable, database-generated fields (like `id` and `createdAt`), and then apply `Partial` to make all remaining fields optional for HTTP PATCH requests.\"",
    "code": "interface UserEntity {\n  id: string;\n  email: string;\n  fullName: string;\n  createdAt: Date;\n}\n\n// Partial update: cannot update id or createdAt, all other fields optional\nexport type UpdateUserDto = Partial<Omit<UserEntity, \"id\" | \"createdAt\">> & {\n  version?: number; // Optional optimistic concurrency lock\n};"
  },
  {
    "id": 144,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Narrowing",
    "question": "Coding: Safely handle a value of type `unknown`",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"Handling `unknown` safely requires narrowing using JavaScript operators (`typeof`, `Array.isArray`, `in`) before accessing properties. If the value does not match expected criteria, we either throw a descriptive error or return a safe default value.\"",
    "code": "function parseUserCount(input: unknown): number {\n  if (typeof input === \"number\") {\n    return input;\n  }\n  if (typeof input === \"string\") {\n    const parsed = parseInt(input, 10);\n    return isNaN(parsed) ? 0 : parsed;\n  }\n  return 0; // Safe fallback\n}"
  },
  {
    "id": 145,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Senior",
    "category": "Repository Pattern",
    "question": "Coding: Create a generic repository interface",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"A generic repository interface abstracts database access behind a strongly typed contract parameterized by an entity type extending a base entity. It defines asynchronous CRUD operations with type-safe filter criteria.\"",
    "code": "interface BaseEntity {\n  id: string;\n  createdAt: Date;\n}\n\nexport interface IRepository<T extends BaseEntity> {\n  findById(id: string): Promise<T | null>;\n  findAll(filter?: Partial<T>): Promise<T[]>;\n  create(item: Omit<T, \"id\" | \"createdAt\">): Promise<T>;\n  update(id: string, patch: Partial<Omit<T, \"id\">>): Promise<T | null>;\n  delete(id: string): Promise<boolean>;\n}"
  },
  {
    "id": 146,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Debugging",
    "question": "Debugging: Why does this code produce a type error?",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"The code produces a type error because the property is being accessed on an object literal directly, which triggers **Excess Property Checking**, or because an object property was widened to `string` instead of the expected string literal union.\"",
    "incorrectCode": "function setRole(role: \"ADMIN\" | \"USER\") {}\nconst user = { role: \"ADMIN\" }; // Inferred as { role: string }!\nsetRole(user.role); // ❌ Error: Argument of type 'string' is not assignable to '\"ADMIN\" | \"USER\"'.",
    "diagnosticError": "Type 'string' is not assignable to type '\"ADMIN\" | \"USER\"'.",
    "code": "// Corrected with 'as const':\nfunction setRole(role: \"ADMIN\" | \"USER\") {}\nconst user = { role: \"ADMIN\" } as const; // Inferred as { readonly role: \"ADMIN\" }\nsetRole(user.role); // ✅ Valid!"
  },
  {
    "id": 147,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Debugging",
    "question": "Debugging: Why is this assertion unsafe?",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"The assertion is unsafe because `as User` completely silences the compiler, but performs zero runtime verification. If the incoming JSON payload is missing fields or has corrupted types, TypeScript believes the object is valid, causing downstream runtime crashes.\"",
    "incorrectCode": "// ❌ UNSAFE: Silences compiler, crashes at runtime\nconst rawJson = '{\"name\": \"Aria\"}'; // Missing required 'id' and 'email'!\nconst user = JSON.parse(rawJson) as { id: string; email: string; name: string };\nconsole.log(user.email.toLowerCase()); // 💥 TypeError: Cannot read properties of undefined!",
    "diagnosticError": "Unchecked type assertion bypasses runtime validation.",
    "code": "// ✅ SAFE: Validate with Zod schema\nimport { z } from \"zod\";\n\nconst UserSchema = z.object({\n  id: z.string(),\n  email: z.string().email(),\n  name: z.string()\n});\n\nconst result = UserSchema.safeParse(JSON.parse(rawJson));\nif (!result.success) {\n  console.error(\"Payload validation failed:\", result.error.format());\n} else {\n  console.log(result.data.email.toLowerCase()); // Guaranteed safe\n}"
  },
  {
    "id": 148,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Debugging",
    "question": "Debugging: Why can an optional property cause an error?",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"An optional property (`prop?: string`) has the union type `string | undefined`. Calling methods directly without optional chaining (`?.`) or undefined checks produces a compile error under `strictNullChecks`: Object is possibly 'undefined'.\"",
    "incorrectCode": "interface Config { timeout?: number; }\nfunction start(config: Config) {\n  // ❌ Error: Object is possibly 'undefined'.\n  const doubled = config.timeout * 2;\n}",
    "diagnosticError": "Object is possibly 'undefined'. (ts2532)",
    "code": "// ✅ Corrected with nullish coalescing default:\ninterface Config { timeout?: number; }\nfunction start(config: Config) {\n  const timeout = config.timeout ?? 1000;\n  const doubled = timeout * 2; // Safe!\n}"
  },
  {
    "id": 149,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Intermediate",
    "category": "Debugging",
    "question": "Debugging: Why does this function return the wrong type?",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"The function returns the wrong type because TypeScript infers the return type as a widened array (`(string | number)[]`) rather than a fixed positional tuple (`[string, number]`). To fix this, provide an explicit return tuple annotation or use `as const`.\"",
    "incorrectCode": "// Inferred as (string | number)[], NOT a tuple!\nfunction getCoordinates() {\n  return [\"San Francisco\", 37.7749];\n}\nconst [city, lat] = getCoordinates(); // city is string | number!",
    "diagnosticError": "Array inferred instead of fixed-length tuple.",
    "code": "// ✅ Corrected with explicit tuple return type:\nfunction getCoordinates(): [string, number] {\n  return [\"San Francisco\", 37.7749];\n}\nconst [city, lat] = getCoordinates(); // city is strictly 'string', lat is strictly 'number'!"
  },
  {
    "id": 150,
    "partId": 11,
    "section": "Practical TypeScript coding and debugging questions",
    "difficulty": "Senior",
    "category": "Architecture Strategy",
    "question": "Scenario: How would you improve type safety in an existing TypeScript codebase?",
    "answer": "**Direct Pitch (30–60 Seconds):**\n\"Improving type safety in an existing codebase requires a systematic 4-phase rollout:\n1. **Activate Strict Compiler Flags Incrementally**: Start by enabling `noImplicitAny`, followed by `strictNullChecks` and `noUncheckedIndexedAccess`.\n2. **Harden Network & API Boundaries**: Eliminate `any` casts from HTTP handlers by introducing Zod schema validation for all incoming and outgoing payloads.\n3. **Migrate Enums to 'as const' Unions**: Replace legacy numeric and string enums with tree-shakeable `as const` object literal unions.\n4. **CI/CD Quality Gates**: Enforce `tsc --noEmit` and `@typescript-eslint/recommended-type-checked` in the CI pipeline to prevent regressions.\"",
    "code": "// 1. Package.json CI Script:\n// \"typecheck\": \"tsc --noEmit\"\n\n// 2. ESLint Rules:\n// \"@typescript-eslint/no-explicit-any\": \"error\",\n// \"@typescript-eslint/no-floating-promises\": \"error\",\n// \"@typescript-eslint/strict-boolean-expressions\": \"warn\""
  }
];
