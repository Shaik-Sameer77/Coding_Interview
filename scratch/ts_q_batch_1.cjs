// scratch/ts_q_batch_1.cjs
// Batch 1: Q1 to Q30 — TypeScript Fundamentals, Annotations, Inference, Basic Types & Special Types
// Fully adhering to AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Key Points.

const batch1 = [
  {
    id: 1,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    question: 'What is TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"TypeScript is an open-source, statically typed superset of JavaScript developed by Microsoft. It introduces optional static typing, compile-time type verification, interfaces, and rich IDE tooling on top of standard ECMAScript. During development, the TypeScript compiler checks contracts and flags potential runtime errors before the code is ever deployed. Crucially, TypeScript compiles down to clean, standards-compliant JavaScript through a process called type erasure—meaning zero type annotations exist at runtime, and execution performance matches pure JavaScript."

**First-Principles Technical Breakdown:**
TypeScript's architecture consists of three distinct layers:
1. **The Language**: Syntactic superset extending JavaScript with type annotations, interfaces, generics, enums, and utility types.
2. **The Type Checker & Compiler (\`tsc\`)**: Parses TypeScript source into an Abstract Syntax Tree (AST), constructs a symbol table, validates type assignability, and emits plain JavaScript.
3. **The Language Service**: Powers IDEs (VS Code, WebStorm) by providing semantic autocompletion, instant jump-to-definition, symbol renaming, and inline diagnostic warnings.`,
    runtimeBehavior: "TypeScript is completely erased during compilation. At runtime, the browser or Node.js executes standard JavaScript. TypeScript does not add runtime overhead, nor does it automatically validate incoming external network data (like JSON HTTP payloads) unless paired with a runtime schema library like Zod.",
    code: `// Compile-time contract:
interface UserDTO {
  id: string;
  email: string;
  isActive: boolean;
}

function printStatus(user: UserDTO): string {
  return \`User \${user.email} is \${user.isActive ? "active" : "disabled"}\`;
}

// In emitted JavaScript (Target: ES2022):
// function printStatus(user) {
//   return \`User \${user.email} is \${user.isActive ? "active" : "disabled"}\`;
// }`,
    keyPoints: [
      'Statically typed syntactic superset of ECMAScript.',
      'Types exist solely at compile-time and are completely erased in emitted JS.',
      'Catches syntax, structural, and nullability errors before runtime deployment.',
      'Requires runtime validators (Zod/Valibot) for external untrusted boundaries.'
    ],
    followUps: [
      {
        q: 'Does TypeScript make JavaScript execute faster at runtime in V8?',
        a: 'No. Because all types are erased during transpilation, the V8 engine receives identical JavaScript. However, writing predictable types can indirectly help V8 avoid de-optimizations caused by polymorphic hidden classes.'
      },
      {
        q: 'Can valid JavaScript code fail to compile in TypeScript?',
        a: 'Yes, if strict flags like noImplicitAny or strictNullChecks are active and the JavaScript code relies on dynamic type coercion or unchecked null dereferencing.'
      }
    ],
    tip: 'Always emphasize Type Erasure immediately in interviews. It shows you understand that TypeScript protects the developer, not the runtime memory.'
  },
  {
    id: 2,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Fundamentals',
    question: 'Why do we use TypeScript instead of plain JavaScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"We use TypeScript in production engineering because it dramatically reduces defects across the software development lifecycle. In plain JavaScript, typos, property renames, and null pointer dereferences are only discovered when code executes in staging or production. TypeScript turns those runtime crashes into instantaneous compile-time diagnostics. Furthermore, TypeScript serves as living, machine-checked documentation: when a backend DTO changes, the compiler instantly highlights every single frontend component, test, and utility function that requires updating, making large-scale refactoring safe and predictable."`,
    runtimeBehavior: "Reduces runtime crash rates by catching type mismatches, missing parameters, and unintended undefined dereferences before code is packaged.",
    code: `// In JavaScript: Silent coercion causes catastrophic billing bug
function chargeCustomer(amount, fee) {
  return amount + fee;
}
// chargeCustomer(100, "20"); // Returns "10020" instead of 120!

// In TypeScript: Flagged immediately in IDE
function safeCharge(amount: number, fee: number): number {
  return amount + fee;
}
// safeCharge(100, "20");
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'.`,
    keyPoints: [
      'Early bug detection: Eliminates the vast majority of TypeError exceptions.',
      'Safe refactoring: Renaming an interface property flags all affected files project-wide.',
      'Self-documenting codebase: Type signatures explicitly describe API expectations.',
      'Full-stack type sharing: Monorepos can share DTOs between NestJS and React.'
    ],
    followUps: [
      {
        q: 'When might TypeScript NOT be worth the added complexity?',
        a: 'For tiny throwaway scripts, rapid single-file prototypes, or teams with zero TypeScript familiarity facing an immediate emergency deadline.'
      }
    ],
    tip: 'Mention full-stack DTO sharing in interviews—it demonstrates enterprise engineering experience.'
  },
  {
    id: 3,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Type Annotations',
    question: 'What are type annotations in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type annotations are explicit syntax markers where the developer explicitly declares the expected type of a variable, function parameter, object property, or return value using a colon followed by the type identifier. For example: \`let count: number = 10\`. Annotations establish an explicit contract between the programmer and the compiler, preventing values of incompatible types from ever being assigned to that identifier."`,
    code: `// Explicit variable annotations:
const serviceName: string = "PaymentProcessor";
const port: number = 8080;
const isProduction: boolean = true;

// Explicit function parameter and return annotations:
function formatInvoice(invoiceId: string, amount: number): string {
  return \`Invoice #\${invoiceId}: $\${amount.toFixed(2)}\`;
}`,
    keyPoints: [
      'Syntax: identifier: Type = value.',
      'Can be applied to variables, parameters, return types, class fields, and generics.',
      'Provides absolute clarity when type inference would otherwise produce an overly broad type.'
    ],
    followUps: [
      {
        q: 'Should you annotate every single variable in a TypeScript project?',
        a: 'No. Over-annotation adds visual noise. Best practice is to rely on type inference for local variables with obvious initializers and reserve explicit annotations for function signatures and public API contracts.'
      }
    ],
    tip: 'Explain that over-annotating local variables like `let x: number = 5` is considered an anti-pattern on senior teams.'
  },
  {
    id: 4,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Inference',
    question: 'What is type inference?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type inference is TypeScript's ability to automatically deduce and assign a type to an expression based on the assigned value, surrounding context, or control-flow analysis, without requiring the developer to write an explicit annotation. For example, if you write \`let count = 42\`, the compiler automatically infers \`count\` as type \`number\`. Subsequent attempts to assign a string to \`count\` will produce a compile error. Inference gives you strong type safety with minimal syntactic boilerplate."`,
    code: `// Inferred as 'string':
let appName = "Chrona Timer";
// appName = 123; 
// ❌ Error: Type 'number' is not assignable to type 'string'.

// Inferred return type as 'boolean':
function isEligible(age: number) {
  return age >= 18; // Return type automatically deduced as 'boolean'
}`,
    keyPoints: [
      'Infers types from initial values, return statements, and assignment flow.',
      'Reduces verbosity while preserving full static verification.',
      'Uses the "best common type" algorithm when evaluating arrays with mixed values.'
    ],
    followUps: [
      {
        q: 'What is the "best common type" algorithm in array inference?',
        a: 'When an array has mixed elements like [0, 1, "hello"], TypeScript evaluates candidate types and infers the union (number | string)[].'
      }
    ],
    tip: 'Highlight that trusting inference makes code cleaner and easier to refactor.'
  },
  {
    id: 5,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Inference & Annotations',
    question: 'What is the difference between type annotation and type inference?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type annotation is developer-driven: you explicitly specify the type using syntax like \`: string\`. Type inference is compiler-driven: TypeScript inspects the assigned value or expression and calculates the type automatically. A senior engineer knows when to rely on inference—such as local variables and map callbacks—and when explicit annotations are mandatory—such as public library API contracts, exported function signatures, and complex object literals where excess property checking is desired."`,
    table: {
      headers: ['Dimension', 'Type Annotation', 'Type Inference'],
      rows: [
        ['Author', 'Human Developer', 'TypeScript Compiler Engine'],
        ['Syntax', 'Explicit (: Type)', 'Implicit (Deduced from value)'],
        ['Best Use Case', 'Function signatures, public APIs, DTOs', 'Local variables, callback params, constants'],
        ['Maintenance', 'Requires manual update if value changes', 'Automatically adapts to value changes']
      ]
    },
    code: `// Type Annotation: Necessary when declaring without immediate initialization
let pendingOrder: { id: string; total: number };
pendingOrder = { id: "ord_1", total: 49.99 };

// Type Inference: Perfect for straightforward assignments
const exchangeRates = { USD: 1.0, EUR: 0.92, GBP: 0.79 };
// Inferred as: { USD: number; EUR: number; GBP: number }`,
    keyPoints: [
      'Annotation: Explicit contract written by the developer.',
      'Inference: Implicit deduction calculated by the type checker.',
      'Best practice: Annotate public boundaries, infer internal implementations.'
    ],
    followUps: [
      {
        q: 'Why should exported functions always have explicit return type annotations?',
        a: 'It prevents accidental breaking changes to external consumers if internal implementation details change, and speeds up compiler performance by bypassing complex return inference.'
      }
    ],
    tip: 'Mentioning compiler performance gains from explicit return types is an instant senior signal.'
  },
  {
    id: 6,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Primitive Types',
    question: 'What are the basic primitive types in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"TypeScript features 7 basic primitive types directly mirroring JavaScript: \`string\` for text, \`number\` for IEEE 754 floating-point values, \`boolean\` for true/false, \`bigint\` for arbitrarily large integers, \`symbol\` for globally unique immutable keys, \`null\` for intentional absence of value, and \`undefined\` for uninitialized variables. Crucially, in TypeScript, primitive types are written in lowercase. Capitalized types like \`String\` or \`Number\` refer to the JavaScript wrapper objects and should almost never be used as type annotations."`,
    code: `const username: string = "mohammed";
const userAge: number = 29;
const isActive: boolean = true;
const maxSafeInt: bigint = 9007199254740991n;
const uniqueKey: symbol = Symbol("apiKey");
const emptyValue: null = null;
const notYetSet: undefined = undefined;

// ❌ ANTI-PATTERN: Wrapper Object
// const badAge: Number = new Number(25); // Avoid!`,
    keyPoints: [
      '7 Primitives: string, number, boolean, bigint, symbol, null, undefined.',
      'Always use lowercase primitive names; never uppercase wrapper objects (String, Number).',
      'Primitives are immutable and passed by value.'
    ],
    followUps: [
      {
        q: 'Why is let x: String an anti-pattern in TypeScript?',
        a: 'String refers to the JavaScript wrapper object interface, not the primitive string. Assigning a primitive to String can cause subtle assignability issues and violates conventions.'
      }
    ],
    tip: 'Never capitalize primitive types in your code snippets during a coding test.'
  },
  {
    id: 7,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Primitive Types',
    question: 'What is the difference between `number`, `string`, and `boolean`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`number\`, \`string\`, and \`boolean\` represent the three most common primitive data types in software engineering. \`number\` covers all numeric values including integers, floats, \`NaN\`, and \`Infinity\`. \`string\` represents UTF-16 character sequences enclosed in single quotes, double quotes, or template literals. \`boolean\` represents binary truth values—strictly \`true\` or \`false\`. TypeScript strictly forbids implicit coercion between these types, eliminating bugs where strings accidentally concatenate with numbers."`,
    code: `const count: number = 42;
const label: string = "items";
const hasShipped: boolean = false;

// TypeScript prevents invalid cross-type operations:
// const invalid = count * label; 
// ❌ Error: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.`,
    keyPoints: [
      'number: Represents all IEEE 754 64-bit floating point numbers (integers, floats, NaN, Infinity).',
      'string: Represents UTF-16 character text.',
      'boolean: strictly true or false (no implicit 1 or 0 coercion).'
    ],
    followUps: [
      {
        q: 'Does TypeScript have separate int, float, or double types like Java or C#?',
        a: 'No. Just like JavaScript, all numeric values are IEEE 754 double-precision floats under the single "number" type (or bigint for arbitrary precision integers).'
      }
    ],
    tip: 'Remind the interviewer that NaN and Infinity are considered valid values of type number.'
  },
  {
    id: 8,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Null & Undefined',
    question: 'What is the difference between `null` and `undefined`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Semantically, \`undefined\` means a variable or property has been declared but not yet assigned a value, or a function parameter was omitted. \`null\` represents an intentional, explicit assignment signifying the absence of any object or value. With \`strictNullChecks\` enabled, TypeScript treats them as distinct, separate types. In modern TypeScript APIs, \`undefined\` is standard for optional properties (\`prop?: string\`), whereas \`null\` is frequently used to model database columns that permit SQL NULL."`,
    code: `// Optional property: inferred as 'string | undefined'
interface UserPreferences {
  theme?: "dark" | "light"; // theme can be "dark", "light", or undefined
  secondaryEmail: string | null; // Must be provided; null signifies deliberate absence
}

const userA: UserPreferences = {
  secondaryEmail: null // Explicitly no secondary email
};`,
    keyPoints: [
      'undefined: Variable declared but unassigned, or omitted optional parameter.',
      'null: Intentional explicit representation of empty or nonexistent value.',
      'Under strictNullChecks: Neither is assignable to string or number without a union.'
    ],
    followUps: [
      {
        q: 'What is the non-null assertion operator (!) in TypeScript?',
        a: 'The postfix exclamation mark tells the compiler to assume a value is neither null nor undefined (e.g. element!.click()). It bypasses strictNullChecks and can cause runtime panics if misused.'
      }
    ],
    tip: 'Mention that modern frontend APIs favor undefined for optional fields, while backend DB layers use null.'
  },
  {
    id: 9,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Type Annotations',
    question: 'Does TypeScript convert a value when we annotate its type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"No, absolutely not. Type annotations in TypeScript are compile-time metadata only; they have zero runtime behavior and perform no data conversion or type coercion whatsoever. If you annotate a string value with \`as any as number\`, the runtime value remains a string. If you need runtime type conversion—such as turning a string input \`"42"\` into a number—you must use explicit JavaScript functions like \`Number(val)\` or \`parseInt(val, 10)\`."`,
    code: `// ❌ Misconception: Annotation does NOT coerce data!
const rawInput: any = "42";
const numericValue: number = rawInput as number;

console.log(typeof numericValue); // Still "string" at runtime!
console.log(numericValue + 10);   // Outputs "4210" (String concatenation, not 52!)

// ✅ Correct Runtime Conversion:
const safeNumericValue: number = Number(rawInput);
console.log(typeof safeNumericValue); // "number"
console.log(safeNumericValue + 10);   // 52`,
    keyPoints: [
      'TypeScript annotations NEVER alter runtime values.',
      'Type assertions (as Type) only instruct the compiler; they emit no conversion code.',
      'Runtime coercion requires standard JS: Number(), String(), Boolean().'
    ],
    followUps: [
      {
        q: 'What happens if you use "as unknown as T" to force a type change?',
        a: 'The compiler accepts it, but if the underlying runtime representation does not match, downstream code will fail with runtime TypeError exceptions.'
      }
    ],
    tip: 'This is a favorite interview trap question to check if a candidate understands type erasure.'
  },
  {
    id: 10,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Inference & Scoping',
    question: 'What is the difference between `let`, `const`, and `var` in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, \`let\` and \`const\` provide block-scoping and eliminate the hoisting quirks of function-scoped \`var\`. Crucially, TypeScript handles **type inference differently between \`let\` and \`const\`**. When you declare a variable with \`const\`, TypeScript infers a narrow **literal type** (e.g. \`const x = 'USD'\` is inferred as type \`'USD'\`), because the value can never be reassigned. When you declare with \`let\`, TypeScript **widens** the type to the general primitive (\`let x = 'USD'\` is inferred as type \`string\`) to allow future reassignments."`,
    code: `// Literal type preserved:
const paymentCurrency = "USD"; 
// Type: "USD"

// Type widened:
let activeCurrency = "USD"; 
// Type: string (Widened from literal "USD")

function setCurrency(curr: "USD" | "EUR") {}
setCurrency(paymentCurrency); // ✅ Valid! "USD" matches literal union
// setCurrency(activeCurrency);  
// ❌ Error: Argument of type 'string' is not assignable to parameter of type '"USD" | "EUR"'.`,
    keyPoints: [
      'const infers narrow literal types (e.g. "USD", 42).',
      'let infers widened primitive types (e.g. string, number).',
      'var is function-scoped and should be completely avoided in modern TypeScript.'
    ],
    followUps: [
      {
        q: 'How do you preserve literal types inside a let declaration?',
        a: 'Provide an explicit literal union annotation: let curr: "USD" | "EUR" = "USD".'
      }
    ],
    tip: 'Explain literal widening when answering this question—it shows deep compiler understanding beyond basic JS scoping.'
  },
  {
    id: 11,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Arrays & Collections',
    question: 'How do you declare an array in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, you can declare an array using two syntaxes: the bracket syntax \`T[]\` (such as \`number[]\`) or the generic array syntax \`Array<T>\` (such as \`Array<number>\`). Both syntaxes are semantically identical to the compiler. Bracket syntax is widely preferred in style guides for simplicity. For immutable arrays, TypeScript provides \`readonly T[]\` or \`ReadonlyArray<T>\`, which removes mutating methods like \`push\`, \`pop\`, and \`splice\` at compile time."`,
    code: `// 1. Bracket syntax (Standard convention):
const scores: number[] = [95, 88, 72];

// 2. Generic syntax:
const tags: Array<string> = ["finance", "react", "typescript"];

// 3. Readonly array (Prevents mutation):
const immutableIds: readonly string[] = ["id_1", "id_2"];
// immutableIds.push("id_3"); 
// ❌ Error: Property 'push' does not exist on type 'readonly string[]'.`,
    keyPoints: [
      'T[] and Array<T> are equivalent.',
      'readonly T[] strips mutating methods (push, pop, splice, shift).',
      'Arrays in TypeScript can grow dynamically, unlike fixed-length tuples.'
    ],
    followUps: [
      {
        q: 'How does TypeScript type an empty array initialized as const arr = []?',
        a: 'Under default settings without strict flags, it infers any[]. In modern strict mode, it infers never[] until elements are pushed or a type is annotated.'
      }
    ],
    tip: 'Always mention readonly T[] when discussing arrays to highlight immutability practices.'
  },
  {
    id: 12,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Tuples',
    question: 'What is a tuple?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A tuple is a specialized array with a **fixed number of elements where each position has a known, specific type**. While standard arrays (\`string[]\`) can contain any number of elements of that type, a tuple like \`[string, number]\` requires exactly two elements: index 0 must be a string, and index 1 must be a number. Tuples are heavily used in React for hooks like \`useState\` (returning \`[state, setState]\`), geographical coordinates \`[lat, lng]\`, and key-value entries."`,
    code: `// Declare tuple: [latitude, longitude]
type Coordinate = [number, number];
const sanFrancisco: Coordinate = [37.7749, -122.4194];

// Labeled tuple elements (Enhances IDE readability):
type HttpResult = [statusCode: number, message: string, isError: boolean];
const response: HttpResult = [200, "OK", false];

// React useState simulation:
function useToggle(initial: boolean): [boolean, () => void] {
  let state = initial;
  const toggle = () => { state = !state; };
  return [state, toggle];
}`,
    keyPoints: [
      'Fixed-length, positional type array.',
      'Each index has an explicitly declared type.',
      'Labeled tuples ([name: string, age: number]) improve developer experience.',
      'Can include optional elements ([string, number?]) and rest elements ([string, ...number[]]).'
    ],
    followUps: [
      {
        q: 'Can you call .push() on a TypeScript tuple?',
        a: 'Yes, in standard TypeScript array methods like push() are permitted on mutable tuples, which is a known type-system limitation. To prevent this, declare the tuple as readonly [number, number].'
      }
    ],
    tip: 'Mentioning the tuple push() quirk and resolving it with readonly is a surefire way to impress an interviewer.'
  },
  {
    id: 13,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Object Types',
    question: 'What is an object type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An object type in TypeScript describes the shape of a JavaScript object by defining its property names and their corresponding value types. Unlike class-based nominal languages, TypeScript's object types operate on structural compatibility: any object that satisfies the specified properties and types is considered compatible, regardless of how it was instantiated. Object types can be declared inline, via type aliases, or using interfaces."`,
    code: `// Object type via Type Alias:
type Product = {
  id: string;
  title: string;
  price: number;
  inStock: boolean;
};

const laptop: Product = {
  id: "prod_001",
  title: "MacBook Pro",
  price: 2499,
  inStock: true
};`,
    keyPoints: [
      'Defines the shape and property types of a structured object.',
      'Evaluated structurally rather than nominally.',
      'Can include optional (?), readonly, and indexed signature properties.'
    ],
    followUps: [
      {
        q: 'What is an index signature in an object type?',
        a: 'An index signature like { [key: string]: number } allows an object to hold arbitrary dynamic keys with values of the specified type.'
      }
    ],
    tip: 'State clearly that object types define contracts for shape, not class inheritance.'
  },
  {
    id: 14,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Object Types',
    question: 'How do you define optional properties?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You define an optional property in an object type or interface by placing a question mark (\`?\`) immediately after the property name before the colon, like \`middleName?: string\`. This indicates to the compiler that the property may be present with the specified type, or omitted entirely. Under \`strictNullChecks\`, an optional property has the inferred type \`T | undefined\`. Furthermore, enabling \`exactOptionalPropertyTypes\` in tsconfig enforces that an optional property cannot be explicitly assigned \`undefined\`—it must either be omitted or assigned a valid value."`,
    code: `interface CustomerProfile {
  id: string;
  email: string;
  phoneNumber?: string; // Optional: string | undefined
}

const customer1: CustomerProfile = { id: "c1", email: "alice@test.com" }; // Valid: omitted
const customer2: CustomerProfile = { id: "c2", email: "bob@test.com", phoneNumber: "+123456789" }; // Valid: populated`,
    keyPoints: [
      'Syntax: propertyName?: Type.',
      'Under strictNullChecks, type is T | undefined.',
      'exactOptionalPropertyTypes distinguishes between property absence and property set to undefined.'
    ],
    followUps: [
      {
        q: 'What is the difference between phoneNumber?: string and phoneNumber: string | undefined?',
        a: 'In phoneNumber?: string, the key can be omitted completely. In phoneNumber: string | undefined, the key MUST be present on the object, even if its value is explicitly undefined.'
      }
    ],
    tip: 'Highlighting the difference between an omitted key and an explicit undefined value shows advanced precision.'
  },
  {
    id: 15,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Functions',
    question: "How do you define a function's parameter and return types?",
    answer: `**Spoken Pitch (30–60 Seconds):**
"You define parameter types by placing a colon and the type after each parameter name within the parenthesis. You define the return type by placing a colon and the type after the parameter list parenthesis. For example: \`function calculateDiscount(price: number, percentage: number): number\`. While TypeScript can often infer return types, explicitly annotating them on exported functions prevents unintended return type mutations and improves compiler compilation speed."`,
    code: `// Function declaration:
function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

// Arrow function syntax:
const formatCurrency = (amount: number, currency: string): string => {
  return \`\${currency} \${amount.toFixed(2)}\`;
};`,
    keyPoints: [
      'Parameters must be annotated unless contextual typing applies.',
      'Return types are placed after the parameter parenthesis.',
      'Explicit return types prevent accidental contract regressions.'
    ],
    followUps: [
      {
        q: 'What happens if a function returns nothing in TypeScript?',
        a: 'Its return type is void. If it unconditionally throws an error or enters an infinite loop, its return type is never.'
      }
    ],
    tip: 'Always include return type annotations when demonstrating functions in interviews.'
  },
  {
    id: 16,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Functions',
    question: 'What is an optional function parameter?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An optional function parameter is a parameter that a caller can omit when invoking the function. It is defined using a question mark (\`?\`) after the parameter name, such as \`prefix?: string\`. Inside the function body, the parameter has the union type \`T | undefined\`. In TypeScript, all optional parameters must follow required parameters in the function signature; you cannot place a required parameter after an optional one."`,
    code: `function sendNotification(userId: string, message: string, priority?: "HIGH" | "LOW"): void {
  const finalPriority = priority ?? "LOW";
  console.log(\`Sending [\${finalPriority}] to \${userId}: \${message}\`);
}

sendNotification("usr_1", "Your order has shipped"); // priority omitted (undefined)
sendNotification("usr_1", "Security alert!", "HIGH"); // priority provided`,
    keyPoints: [
      'Syntax: (param?: Type).',
      'Inferred type inside function body is Type | undefined.',
      'Must be placed after all required parameters.'
    ],
    followUps: [
      {
        q: 'Can an optional parameter have a default value?',
        a: 'No. A parameter with a default value is already implicitly optional. Using ? with an initializer like x?: number = 10 is a syntax error.'
      }
    ],
    tip: 'Remember: Optional parameters must come after required parameters.'
  },
  {
    id: 17,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Functions',
    question: 'What are default parameters?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Default parameters in TypeScript are function parameters that are automatically initialized with a fallback value if the caller passes \`undefined\` or omits the argument. When you provide a default value, TypeScript automatically infers the parameter's type from the default value, making explicit annotation optional. Furthermore, default parameters are implicitly optional to callers."`,
    code: `// 'retries' is inferred as type 'number' with default 3:
function fetchWithRetry(url: string, retries = 3, timeoutMs = 5000): void {
  console.log(\`Fetching \${url} with \${retries} retries, \${timeoutMs}ms timeout\`);
}

fetchWithRetry("https://api.stripe.com"); // uses 3 and 5000
fetchWithRetry("https://api.stripe.com", 5); // overrides retries to 5`,
    keyPoints: [
      'Type is inferred from default value if not annotated explicitly.',
      'Default value is used only when argument is undefined (passing null will NOT trigger default value!).',
      'Implicitly makes the parameter optional.'
    ],
    followUps: [
      {
        q: 'What happens if a caller passes null to a default parameter like retries = 3?',
        a: 'In JavaScript and TypeScript, null does NOT trigger default parameter initialization. retries will be assigned null, which could cause a runtime NaN if arithmetic is performed.'
      }
    ],
    tip: 'Call out the null gotcha with default parameters—it highlights real-world JS/TS nuance.'
  },
  {
    id: 18,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Beginner',
    category: 'Functions',
    question: 'What are rest parameters?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Rest parameters allow a function to accept an indefinite number of arguments as a single, typed array. In TypeScript, a rest parameter uses the ellipsis syntax (\`...rest\`) and MUST be typed as an array type (such as \`...numbers: number[]\`) or as a tuple. The rest parameter must always be the final parameter in the function signature."`,
    code: `// Rest parameter typed as number[]:
function sumAll(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(sumAll(10, 20, 30)); // 60
console.log(sumAll(5));          // 5`,
    keyPoints: [
      'Must be typed as an array (T[]) or tuple ([T, U, ...V[]]).',
      'Must be the last parameter in the parameter list.',
      'Gathers all remaining arguments into a clean JavaScript array.'
    ],
    followUps: [
      {
        q: 'Can you type rest parameters as a tuple to enforce specific positional arguments?',
        a: 'Yes! For example: function executeCommand(...args: [command: string, timeout: number, ...flags: string[]]) enforces strict positional typing.'
      }
    ],
    tip: 'Mentioning tuple-typed rest parameters showcases advanced API design skills.'
  },
  {
    id: 19,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Intermediate',
    category: 'Functions',
    question: 'What is a function type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A function type expression describes the call signature of a function—its expected parameter types and return type—without providing an implementation. It uses arrow syntax: \`(param1: Type1, param2: Type2) => ReturnType\`. Function types allow you to pass callbacks, higher-order functions, and event handlers with complete compile-time contract enforcement."`,
    code: `// Define function type:
type LoggerFunction = (message: string, level?: "INFO" | "WARN" | "ERROR") => void;

// Function conforming to type:
const consoleLogger: LoggerFunction = (msg, lvl = "INFO") => {
  console.log(\`[\${lvl}] \${msg}\`);
};

// Higher-order function accepting function type:
function processTransactions(txIds: string[], logger: LoggerFunction) {
  txIds.forEach(id => logger(\`Processing \${id}\`));
}`,
    keyPoints: [
      'Syntax: (param: Type) => ReturnType.',
      'Defines callable contracts for higher-order functions and callbacks.',
      'Can also be declared using call signatures inside interfaces.'
    ],
    followUps: [
      {
        q: 'How do you declare a callable signature inside an interface?',
        a: 'Using standard object syntax without an arrow: interface Callable { (x: number): string; }.'
      }
    ],
    tip: 'Function types are the backbone of React event handlers and custom hooks.'
  },
  {
    id: 20,
    partId: 1,
    section: 'A. Introduction, type annotations, and inference',
    difficulty: 'Senior',
    category: 'Void vs Never',
    question: 'What is the difference between `void` and `never`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`void\` and \`never\` represent completely different concepts in type theory. \`void\` represents a function that **returns normally**, but has no meaningful return value (it returns \`undefined\`). The caller still receives control back. In contrast, \`never\` represents a function that **never returns at all**—either because it unconditionally throws an exception, halts the process, or runs an infinite event loop. The execution point after a \`never\`-returning function is unreachable by the control-flow analyzer."`,
    table: {
      headers: ['Aspect', 'void', 'never'],
      rows: [
        ['Returns Control to Caller?', '✅ Yes (returns undefined)', '❌ No (execution halts or throws)'],
        ['Return Value in JS', 'undefined', 'None (unreachable)'],
        ['Set Theory Meaning', 'Set containing undefined', 'Empty set ∅ (zero inhabitants)'],
        ['Primary Use Case', 'Side-effect functions, onClick handlers', 'Unconditional error throwers, exhaustive checks']
      ]
    },
    code: `// Returns void: Caller receives control back!
function logToConsole(message: string): void {
  console.log(message);
  // implicitly returns undefined
}

// Returns never: Caller NEVER receives control back!
function throwFatalError(message: string): never {
  throw new Error(message);
}

function processTask(task: { id: string } | null) {
  if (!task) {
    throwFatalError("Task cannot be null");
    // TypeScript knows any code here is completely UNREACHABLE!
  }
  console.log(task.id); // 'task' is narrowed to { id: string }
}`,
    keyPoints: [
      'void: Function finishes execution and returns undefined.',
      'never: Function never completes execution (throws or infinite loop).',
      'Control-flow analysis treats code after a never call as dead/unreachable.'
    ],
    followUps: [
      {
        q: 'Why can a function returning void accept a callback that returns a value?',
        a: 'To accommodate common array methods. In TypeScript, a callback returning void means "the caller will ignore any returned value", allowing functions like [1, 2].forEach(x => set.add(x)) to typecheck cleanly.'
      }
    ],
    tip: 'The void callback permissiveness question is one of the most famous senior TypeScript interview questions.'
  },
  {
    id: 21,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Top Types',
    question: 'What is `any`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`any\` is TypeScript's universal escape hatch. It tells the compiler to completely disable type checking for that variable or expression. When a variable is typed as \`any\`, you can access arbitrary properties, call it as a function, assign it to any other type, or pass any arguments without a single compile-time warning. However, \`any\` is contagious: it propagates through assignments and completely undermines the safety guarantees of TypeScript, transforming compile-time contracts back into potential runtime crashes."`,
    code: `let untrustedData: any = "Hello World";

// All of these compile with zero warnings, but crash at runtime:
// untrustedData.nonExistentMethod(); // 💥 TypeError: not a function
// untrustedData();                   // 💥 TypeError: not a function
// const num: number = untrustedData; // ⚠️ Silent type contamination!`,
    keyPoints: [
      'Universal escape hatch: disables the type checker completely.',
      'Contagious: spreads through variables and disables safety downstream.',
      'Should be forbidden in strict production environments via noImplicitAny.'
    ],
    followUps: [
      {
        q: 'What ESLint rule forbids the use of any?',
        a: '@typescript-eslint/no-explicit-any.'
      }
    ],
    tip: 'Emphasize that any should only be used as a last resort during legacy code migrations.'
  },
  {
    id: 22,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Top Types',
    question: 'What is `unknown`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`unknown\` is TypeScript's type-safe top type, introduced in TypeScript 3.0 as the safe alternative to \`any\`. Like \`any\`, any value in JavaScript can be assigned to \`unknown\`. However, unlike \`any\`, TypeScript **does not allow you to perform any operation on an \`unknown\` value**—you cannot access properties, call it, construct it, or assign it to another typed variable without first narrowing its type using \`typeof\`, \`instanceof\`, or a type guard. It is the gold standard for typing external, untrusted data like API payloads."`,
    code: `function handleApiResponse(payload: unknown) {
  // ❌ Not allowed without narrowing:
  // console.log(payload.data); 
  // Error: 'payload' is of type 'unknown'.

  // ✅ Safe narrowing with typeof and in:
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    console.log((payload as { data: string }).data);
  }
}`,
    keyPoints: [
      'Safe Top Type: accepts any value, but permits no operations without narrowing.',
      'Cannot be assigned to other types (except unknown and any) without explicit assertion or narrowing.',
      'Standard best practice for API payloads, JSON.parse results, and catch clauses.'
    ],
    followUps: [
      {
        q: 'Why does JSON.parse() return any instead of unknown in TypeScript standard library?',
        a: 'Historical reasons: JSON.parse was typed before unknown was introduced in TypeScript 3.0. Modern codebases wrap JSON.parse to return unknown.'
      }
    ],
    tip: 'Always state that unknown is the typesafe counterweight to any.'
  },
  {
    id: 23,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Senior',
    category: 'Top Types',
    question: 'What is the difference between `any` and `unknown`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Both \`any\` and \`unknown\` are top types that can accept any value in the language. The critical difference is **type safety**: \`any\` turns off the compiler, allowing arbitrary property accesses and assignments to strictly typed variables, which silently causes runtime crashes. \`unknown\`, on the other hand, enforces strict compiler verification: you cannot dereference a single property or invoke an \`unknown\` value until you prove its type to the compiler through type narrowing, type predicates, or runtime schema parsing."`,
    table: {
      headers: ['Operation', 'any', 'unknown'],
      rows: [
        ['Assign anything to it?', '✅ Yes', '✅ Yes'],
        ['Assign it to a typed variable (e.g. number)?', '✅ Allowed silently (Dangerous)', '❌ Blocked by compiler'],
        ['Access arbitrary properties (.foo)?', '✅ Allowed silently (Dangerous)', '❌ Blocked by compiler'],
        ['Invoke as function ()?', '✅ Allowed silently (Dangerous)', '❌ Blocked by compiler'],
        ['Requires type narrowing?', '❌ No', '✅ Yes (Mandatory)']
      ]
    },
    code: `const rawApiData: unknown = JSON.parse('{"userId": 101}');
// const id: number = rawApiData.userId; // ❌ Error: Property 'userId' does not exist on type 'unknown'.

if (typeof rawApiData === "object" && rawApiData !== null && "userId" in rawApiData) {
  const id = (rawApiData as { userId: number }).userId; // ✅ Type safe
}`,
    keyPoints: [
      'any disables type checking; unknown enforces type verification.',
      'any is contagious; unknown halts unchecked propagation.',
      'Always prefer unknown for external data boundaries.'
    ],
    followUps: [
      {
        q: 'How does unknown interact with union and intersection types?',
        a: 'unknown | T is always unknown (absorbing element). unknown & T is always T (identity element).'
      }
    ],
    tip: 'Explaining union absorption (unknown | T === unknown) demonstrates deep mastery of type theory.'
  },
  {
    id: 24,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Senior',
    category: 'Bottom Type',
    question: 'What is the `never` type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`never\` is TypeScript's bottom type. In type theory, a type is a set of possible values. While \`unknown\` is the universal set containing all possible values, \`never\` is the **empty set containing zero values**. No value can ever be assigned to \`never\` (except \`never\` itself). It is used to represent states that should be mathematically impossible—such as the return type of a function that unconditionally throws, an impossible type intersection like \`string & number\`, or the default branch of an exhaustive switch statement."`,
    code: `// 1. Impossible Intersection evaluates to never:
type Impossible = string & number; // never

// 2. Exhaustive switch check:
type HttpAction = "GET" | "POST";

function executeAction(action: HttpAction) {
  switch (action) {
    case "GET":
      return "Fetching data";
    case "POST":
      return "Submitting payload";
    default: {
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}`,
    keyPoints: [
      'Empty bottom type: contains zero values.',
      'Impossible to assign any value to never.',
      'Enables compile-time exhaustive checking for discriminated unions.',
      'Eliminated from union types: T | never evaluates to T.'
    ],
    followUps: [
      {
        q: 'What does T | never evaluate to in union types?',
        a: 'It evaluates to T, because the empty set adds no new members to the union. This is why conditional types use "never" to filter out unwanted union members.'
      }
    ],
    tip: 'Explain that never is the mathematical identity element of union types (T | never === T).'
  },
  {
    id: 25,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Void vs Undefined',
    question: 'What is the difference between `void` and `undefined`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`undefined\` is a concrete JavaScript primitive value representing an unassigned state. A variable or function typed as returning \`undefined\` **must explicitly return the literal value \`undefined\`**. In contrast, \`void\` is a type-level construct indicating the **absence of a return value**. A function typed with \`void\` does not need an explicit return statement, and TypeScript will deliberately ignore any value that the function might happen to return in callback contexts."`,
    code: `// Must explicitly return undefined:
function returnsUndefined(): undefined {
  return undefined; // Omitting 'return undefined' produces a compile error!
}

// Does not need to return anything:
function returnsVoid(): void {
  console.log("Completed task");
  // No return statement required!
}`,
    keyPoints: [
      'undefined: Concrete JavaScript primitive value; requires explicit return.',
      'void: Function return contract indicating the return value is intentionally ignored.',
      'In callback positions, void permits callbacks that return values, whereas undefined forbids it.'
    ],
    followUps: [
      {
        q: 'Can you assign undefined to a void variable?',
        a: 'Yes, undefined is assignable to void.'
      }
    ],
    tip: 'Differentiate between the concrete JS primitive (undefined) and the TypeScript semantic contract (void).'
  },
  {
    id: 26,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Compiler & Strictness',
    question: 'What does `strict` mode mean in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, setting \`'strict': true\` in \`tsconfig.json\` activates the master suite of strict type checking options. Instead of configuring flags individually, \`strict: true\` turns on \`strictNullChecks\`, \`noImplicitAny\`, \`strictFunctionTypes\`, \`strictBindCallApply\`, \`strictPropertyInitialization\`, \`noImplicitThis\`, and \`alwaysStrict\`. It transforms TypeScript from an advisory linter into a rigorous, mathematically sound type system. It is non-negotiable for enterprise production applications."`,
    code: `// tsconfig.json:
{
  "compilerOptions": {
    "strict": true // Automatically turns on all strict checks
  }
}`,
    keyPoints: [
      'Master flag enabling all major strict type invariants simultaneously.',
      'Guarantees strictNullChecks and noImplicitAny.',
      'Mandatory standard for all modern production TypeScript codebases.'
    ],
    followUps: [
      {
        q: 'Can you turn on strict but disable a specific rule?',
        a: 'Yes. You can specify "strict": true and then override a specific rule like "noImplicitAny": false, though this is discouraged.'
      }
    ],
    tip: 'State that non-strict TypeScript is essentially self-defeating for modern applications.'
  },
  {
    id: 27,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Compiler & Strictness',
    question: 'What is `strictNullChecks`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`strictNullChecks\` is the single most important compiler setting in TypeScript. When disabled, \`null\` and \`undefined\` are considered valid values for every type in the system—meaning a variable typed as \`string\` could secretly be \`null\` at runtime, leading to crashes. When \`strictNullChecks: true\` is enabled, \`null\` and \`undefined\` become distinct types. You can only assign \`null\` or \`undefined\` to a variable if you explicitly include them in a union type, such as \`string | null\`."`,
    code: `// With "strictNullChecks": false (DANGEROUS):
// let name: string = null; // Allowed! name.toUpperCase() crashes at runtime!

// With "strictNullChecks": true (SAFE):
let userName: string = "Mohammed";
// userName = null; 
// ❌ Error: Type 'null' is not assignable to type 'string'.

let optionalName: string | null = null; // Explicit union required!`,
    keyPoints: [
      'Eliminates the "Billion Dollar Mistake" of implicit null assignment.',
      'null and undefined are treated as distinct domain types.',
      'Forces explicit unions (T | null | undefined) and runtime narrowing.'
    ],
    followUps: [
      {
        q: 'How does strictNullChecks affect optional properties in interfaces?',
        a: 'Optional properties (prop?: string) are treated as having the union type string | undefined.'
      }
    ],
    tip: 'Reference Tony Hoare\'s Billion Dollar Mistake—interviewers love that historical engineering context.'
  },
  {
    id: 28,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Compiler & Strictness',
    question: 'What is `noImplicitAny`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`noImplicitAny\` is a compiler flag that raises a compile error whenever TypeScript is unable to infer a specific type for a variable or parameter and would otherwise default to \`any\`. For example, in an unannotated function parameter \`function log(x)\`, TypeScript without this flag silently types \`x\` as \`any\`. With \`noImplicitAny: true\`, the compiler forces the developer to either provide an explicit type annotation or write code from which a specific type can be inferred."`,
    code: `// With "noImplicitAny": true:
// function calculate(amount) { return amount * 2; }
// ❌ Error: Parameter 'amount' implicitly has an 'any' type.

// Corrected:
function calculate(amount: number): number {
  return amount * 2;
}`,
    keyPoints: [
      'Flags any expression that would silently fall back to any.',
      'Prevents accidental type contamination across function boundaries.',
      'Mandatory flag included within strict: true.'
    ],
    followUps: [
      {
        q: 'Can you still use any if noImplicitAny is enabled?',
        a: 'Yes, you can still write explicit any (x: any). The flag only forbids implicit any where the developer omitted the type.'
      }
    ],
    tip: 'Emphasize that noImplicitAny stops silent type leakage.'
  },
  {
    id: 29,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Type Assertions',
    question: 'What is type assertion?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A type assertion is a way to explicitly instruct the TypeScript compiler to treat a value as a specific type, using the \`as\` syntax, such as \`data as UserDTO\`. It is effectively telling the compiler: 'Trust me, I know more about this value's runtime shape than you do.' Type assertions do NOT perform any runtime data conversion or validation, nor do they modify the emitted JavaScript. If the developer's assertion about the runtime shape is incorrect, downstream code will still throw runtime exceptions."`,
    code: `// DOM query returns Element | null
const button = document.getElementById("submit-btn") as HTMLButtonElement;

// TypeScript now allows access to HTMLButtonElement properties:
button.disabled = true;`,
    keyPoints: [
      'Syntax: value as TargetType (or legacy <TargetType>value).',
      'Overrides the compiler type deduction without runtime checks.',
      'Only permitted when types overlap; completely disjoint assertions require as unknown as TargetType.'
    ],
    followUps: [
      {
        q: 'Why is the angle-bracket syntax <HTMLButtonElement>button discouraged in React TSX files?',
        a: 'It conflicts with JSX element syntax (<Component />), causing syntax parsing ambiguities. The "as" syntax is universally preferred.'
      }
    ],
    tip: 'Always warn that type assertions are a potential safety smell if used to bypass runtime validation.'
  },
  {
    id: 30,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Type Assertions',
    question: 'What is the difference between type assertion and type conversion?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type assertion is a **pure compile-time directive** that changes the compiler's view of an expression's type without altering the underlying JavaScript value or emitting any code. Type conversion (or casting/coercion) is a **runtime operation** that actively transforms a value from one JavaScript data type representation to another—such as converting the string \`'42'\` to the number \`42\` using \`Number('42')\`. Type assertions vanish at build time; type conversions execute in memory at runtime."`,
    table: {
      headers: ['Feature', 'Type Assertion (val as Type)', 'Type Conversion (Number(val))'],
      rows: [
        ['Execution Phase', 'Compile time only (Type Checker)', 'Runtime execution (V8 engine)'],
        ['Emitted JS Impact', 'Erased completely', 'Emits real function calls'],
        ['Runtime Value Change', 'Zero change to value', 'Transforms value representation in memory'],
        ['Failure Mode', 'Downstream TypeError if incorrect', 'Produces NaN or coerced fallback value']
      ]
    },
    code: `// Type Assertion: Does NOT change the value at runtime
const rawValue: any = "123";
const asserted = rawValue as number;
console.log(typeof asserted); // Still "string" at runtime!

// Type Conversion: Actually changes the value representation in V8
const converted = Number(rawValue);
console.log(typeof converted); // "number" at runtime!`,
    keyPoints: [
      'Type assertion (as T): Instructs compiler; emits NO JavaScript.',
      'Type conversion (Number(), String()): Transforms memory representation at runtime.',
      'Never confuse as with runtime parsing.'
    ],
    followUps: [
      {
        q: 'When is a type assertion genuinely appropriate in production?',
        a: 'When narrowing DOM elements (document.getElementById), interacting with untyped CJS libraries, or in unit tests creating mock fixtures.'
      }
    ],
    tip: 'Directly contrasting as number with Number(x) is the fastest way to get full points on this question.'
  }
];

module.exports = batch1;
console.log(`Batch 1 authored with ${batch1.length} questions.`);
