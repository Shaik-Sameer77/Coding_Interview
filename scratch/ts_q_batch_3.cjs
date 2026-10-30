// scratch/ts_q_batch_3.cjs
// Batch 3: Q61 to Q95 — Utility Types, Type Operators, Conditional Types, infer, Mapped Types, Classes & OOP
// Fully adhering to AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Key Points.

const batch3 = [
  {
    id: 61,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Beginner',
    category: 'Literal Types',
    question: 'What is a literal type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A literal type in TypeScript is a type that represents an exact, specific value rather than an entire broad primitive category. For example, instead of the broad type \`string\`, a literal type can be specifically \`'success'\` or \`'EUR'\`. Instead of \`number\`, it can be \`404\` or \`200\`. Declaring a variable with \`const\` automatically infers a literal type, or you can use \`as const\`. Literal types form the building blocks for discriminated unions, state machines, and configuration options."`,
    code: `// Literal types:
type HttpSuccessCode = 200 | 201;
type Environment = "development" | "staging" | "production";

const activeEnv: Environment = "production";
// const badEnv: Environment = "local"; 
// ❌ Error: Type '"local"' is not assignable to type 'Environment'.`,
    keyPoints: [
      'Represents an exact, specific value (e.g. "POST", 404, true).',
      'const variables infer literal types automatically.',
      'Core foundation of discriminated unions and type-safe state machines.'
    ],
    followUps: [
      {
        q: 'What is literal widening?',
        a: 'When a variable declared with let is assigned a literal like "hello", TypeScript widens it to string so it can be reassigned to other strings.'
      }
    ],
    tip: 'Point out that literal types allow TypeScript to act as an exact value verifier.'
  },
  {
    id: 62,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Beginner',
    category: 'Literal Types',
    question: 'What is a union of literal types?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A union of literal types is a type constructed by joining multiple specific literal values with pipe symbols, such as \`type Direction = 'north' | 'south' | 'east' | 'west'\`. It restricts a variable or parameter to strictly one of those predefined values, offering a clean, lightweight, and tree-shakeable alternative to TypeScript enums. The compiler flags any misspelled strings immediately in the editor."`,
    code: `type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

function renderButton(variant: ButtonVariant) {
  console.log("Rendering button style:", variant);
}

renderButton("primary"); // Valid
// renderButton("warning"); 
// ❌ Error: Argument of type '"warning"' is not assignable to parameter of type 'ButtonVariant'.`,
    keyPoints: [
      'Defines a closed set of permitted literal values.',
      'Zero runtime overhead—completely erased during compilation.',
      'Modern industry standard replacement for traditional string enums.'
    ],
    followUps: [
      {
        q: 'How do you derive a literal union from an existing array or object?',
        a: 'Use as const with indexed access: const ROLES = ["admin", "user"] as const; type Role = typeof ROLES[number];.'
      }
    ],
    tip: 'Mentioning deriving unions with typeof ROLES[number] shows practical elegance.'
  },
  {
    id: 63,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Enums',
    question: 'What is an enum?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An enum (enumeration) in TypeScript is a language feature that allows you to define a set of named constants, which can be numeric or string-based. Unlike almost all other TypeScript features, **enums are NOT erased at compile-time**—they emit real runtime JavaScript objects (an IIFE creating a two-way lookup table for numeric enums, or a plain key-value object for string enums). While popular in classical OOP languages, enums have fallen out of favor in modern TypeScript because they bloat the bundle, complicate tree-shaking, and have nominal compatibility quirks."`,
    code: `// Numeric Enum:
enum Direction {
  Up = 1,
  Down, // 2
  Left, // 3
  Right // 4
}

// Emitted JavaScript (Runtime IIFE):
// var Direction;
// (function (Direction) {
//     Direction[Direction["Up"] = 1] = "Up";
//     Direction[Direction["Down"] = 2] = "Down";
// })(Direction || (Direction = {}));`,
    keyPoints: [
      'One of the few TS features that emits runtime JavaScript code.',
      'Supports numeric, string, and heterogeneous variants.',
      'Numeric enums create reverse mappings (Direction[1] === "Up").'
    ],
    followUps: [
      {
        q: 'What is a const enum and what is its primary danger?',
        a: 'A const enum is inlined at the call site at compile time, emitting no runtime object. However, it breaks when isolatedModules: true is enabled (such as with Babel, Vite, or esbuild) and cannot be consumed across library boundaries.'
      }
    ],
    tip: 'Explaining the const enum isolatedModules breakage proves deep bundler knowledge.'
  },
  {
    id: 64,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Senior',
    category: 'Enums vs Unions',
    question: 'What is the difference between an enum and a union of string literals?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The core difference is **runtime footprint and ergonomics**. An enum emits real JavaScript code (an IIFE object) into the bundle, cannot be easily tree-shaken, and requires you to import the enum identifier everywhere it is referenced. In contrast, a union of string literals (\`type Status = 'OPEN' | 'CLOSED'\`) has **zero runtime footprint**—it is completely erased by \`tsc\`. Furthermore, string literal unions offer seamless structural typing with JSON APIs: you can pass a plain string \`'OPEN'\` directly, whereas with string enums, TypeScript strictly requires the enum reference \`Status.OPEN\`."`,
    table: {
      headers: ['Aspect', 'TypeScript Enum', 'String Literal Union'],
      rows: [
        ['Runtime Code Emission', 'Emits IIFE object into JS bundle', 'Zero code emitted (completely erased)'],
        ['Tree-Shaking', 'Difficult for bundlers to optimize', 'Perfect (no runtime footprint)'],
        ['API Boundary Assignability', 'Requires explicit Enum.Member reference', 'Plain string literals assignable directly'],
        ['Modern Best Practice', 'Discouraged for new codebases', 'Standard best practice']
      ]
    },
    code: `// 1. Enum Approach (Requires runtime import):
enum OrderStatusEnum { PENDING = "PENDING", COMPLETED = "COMPLETED" }
// function update(s: OrderStatusEnum) {}
// update("PENDING"); // ❌ Error: Argument of type '"PENDING"' is not assignable to parameter of type 'OrderStatusEnum'.

// 2. Modern Literal Union Approach (Structural & Clean):
const ORDER_STATUS = { PENDING: "PENDING", COMPLETED: "COMPLETED" } as const;
type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
function update(s: OrderStatus) {}
update("PENDING"); // ✅ Valid! Seamless compatibility with API JSON.`,
    keyPoints: [
      'Enums emit runtime code; literal unions are 100% erased.',
      'Literal unions interop natively with JSON payloads without enum imports.',
      'Modern TypeScript consensus strongly favors as const object unions over enums.'
    ],
    followUps: [
      {
        q: 'Does TypeScript Core recommend string literal unions over enums?',
        a: 'Yes. Anders Hejlsberg and the TypeScript team have stated that if designing TypeScript today, enums would likely not be added, favoring string unions.'
      }
    ],
    tip: 'Advocating for as const object literal unions over enums aligns with senior engineering best practices.'
  },
  {
    id: 65,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Mapped Types',
    question: 'What is a mapped type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A mapped type is a generic type that creates a new object type by iterating over a union of keys—usually obtained via \`keyof\`—and transforming the property types. It uses index signature syntax with the \`in\` keyword: \`{ [K in keyof T]: NewType }\`. Mapped types are the mathematical foundation behind all object-transforming utility types in TypeScript, including \`Partial\`, \`Required\`, \`Readonly\`, and \`Record\`."`,
    code: `// Creating a mapped type that makes all properties boolean flags:
type BooleanFlags<T> = {
  [K in keyof T]: boolean;
};

interface FeatureConfig {
  darkMode: string;
  maxUploadMb: number;
}

type FeatureToggles = BooleanFlags<FeatureConfig>;
// Evaluates to: { darkMode: boolean; maxUploadMb: boolean; }`,
    keyPoints: [
      'Syntax: { [K in Keys]: ValueType }.',
      'Iterates over a union of string/number/symbol keys.',
      'Can add or remove readonly and optional (?) modifiers.',
      'Powers Partial, Required, Readonly, and custom transformations.'
    ],
    followUps: [
      {
        q: 'What is key remapping in mapped types?',
        a: 'Introduced in TS 4.1, the "as" clause allows you to re-map or filter keys during iteration: [K in keyof T as NewKeyType]: T[K].'
      }
    ],
    tip: 'Frame mapped types as the "Array.prototype.map() for object types" in the type system.'
  },
  {
    id: 66,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Beginner',
    category: 'Utility Types',
    question: 'What is `Partial<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Partial<T>\` is a built-in utility type that constructs a new type where all properties of \`T\` are made optional. Internally, it is implemented as a mapped type using the optional modifier: \`type Partial<T> = { [P in keyof T]?: T[P] }\`. It is universally used in API update endpoints (HTTP PATCH) and form state management where a user can update a subset of fields without providing the entire entity."`,
    code: `interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Update DTO: all properties optional
function updateUser(id: string, patch: Partial<User>) {
  console.log(\`Updating user \${id} with:\`, patch);
}

updateUser("usr_1", { name: "Aria" }); // Valid! email and age are omitted.`
  },
  {
    id: 67,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Utility Types',
    question: 'What is `Required<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Required<T>\` is the inverse of \`Partial<T>\`. It constructs a new type where all optional properties of \`T\` are made strictly required. It is implemented using the modifier removal syntax: \`type Required<T> = { [P in keyof T]-?: T[P] }\`. The \`-?\` operator explicitly strips the optional modifier. It is commonly used when initializing configuration defaults, guaranteeing that all fields have been populated before service startup."`,
    code: `interface ServerConfig {
  host?: string;
  port?: number;
  timeoutMs?: number;
}

// Implementation: type Required<T> = { [P in keyof T]-?: T[P] };

function startServer(config: Required<ServerConfig>) {
  console.log(\`Running on \${config.host}:\${config.port}\`); // Guaranteed to be defined!
}`
  },
  {
    id: 68,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Beginner',
    category: 'Utility Types',
    question: 'What is `Readonly<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Readonly<T>\` constructs a type with all properties of \`T\` set to \`readonly\`, preventing any property reassignment. Internally, it is implemented as \`type Readonly<T> = { readonly [P in keyof T]: T[P] }\`. It is essential for enforcing immutability in state management architectures like Redux, Zustand, and React component props."`,
    code: `interface State {
  count: number;
  status: string;
}

const frozenState: Readonly<State> = {
  count: 0,
  status: "IDLE"
};

// frozenState.count = 1; // ❌ Error: Cannot assign to 'count' because it is a read-only property.`
  },
  {
    id: 69,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Utility Types',
    question: 'What is `Pick<T, K>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Pick<T, K>\` constructs a type by picking a specific subset of keys \`K\` from an existing type \`T\`. The keys parameter is constrained using \`K extends keyof T\`. It is implemented as \`type Pick<T, K extends keyof T> = { [P in K]: T[P] }\`. It is used to project smaller, focused interfaces from larger database entities, such as creating a public user profile from an internal user record."`,
    code: `interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  refreshToken: string;
  createdAt: Date;
}

// Select only safe public fields:
type PublicUserProfile = Pick<UserEntity, "id" | "email" | "createdAt">;`
  },
  {
    id: 70,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Utility Types',
    question: 'What is `Omit<T, K>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Omit<T, K>\` is the inverse of \`Pick<T, K>\`. It constructs a type by picking all properties from \`T\` and removing the specified keys \`K\`. Internally, it is implemented by combining \`Pick\` with \`Exclude\`: \`type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>\`. It is heavily used in API creation endpoints (omitting auto-generated fields like \`id\` and \`createdAt\`) and React prop extension."`,
    code: `interface Order {
  id: string;
  customerEmail: string;
  total: number;
  createdAt: Date;
}

// Creation payload omits database-generated fields:
type CreateOrderPayload = Omit<Order, "id" | "createdAt">;`
  },
  {
    id: 71,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Beginner',
    category: 'Utility Types',
    question: 'What is `Record<K, V>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Record<K, V>\` constructs an object type whose property keys are of type \`K\` and whose property values are of type \`V\`. The key type \`K\` must extend \`keyof any\` (\`string | number | symbol\`). Internally, it is implemented as \`type Record<K extends keyof any, T> = { [P in K]: T }\`. It is the standard idiom in TypeScript for typing lookup dictionaries, cache maps, and key-value stores."`,
    code: `type Currency = "USD" | "EUR" | "GBP";

// Dictionary mapping each Currency to its exchange rate number:
const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79
};`
  },
  {
    id: 72,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Utility Types',
    question: 'What are `Exclude<T, U>` and `Extract<T, U>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Exclude\` and \`Extract\` are utility types that operate on **union types** using distributive conditional types. \`Exclude<T, U>\` removes from \`T\` any members that are assignable to \`U\` (\`T extends U ? never : T\`). Conversely, \`Extract<T, U>\` selects only those members of \`T\` that are assignable to \`U\` (\`T extends U ? T : never\`). They are essential for filtering action unions and manipulating string literals."`,
    code: `type AllActions = "CREATE" | "READ" | "UPDATE" | "DELETE";

// Exclude: Remove write operations
type ReadOnlyActions = Exclude<AllActions, "CREATE" | "UPDATE" | "DELETE">; // "READ"

// Extract: Select only mutation operations
type Mutations = Extract<AllActions, "CREATE" | "UPDATE" | "DELETE">; // "CREATE" | "UPDATE" | "DELETE"`
  },
  {
    id: 73,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Intermediate',
    category: 'Utility Types',
    question: 'What is `NonNullable<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`NonNullable<T>\` constructs a type by excluding \`null\` and \`undefined\` from \`T\`. In modern TypeScript, it is elegantly implemented using the empty object intersection: \`type NonNullable<T> = T & {}\` (since \`{}\` represents any non-nullish value). It is used to sanitize optional or nullable parameters before passing them to functions that require defined values."`,
    code: `type RawInput = string | number | null | undefined;

type SanitizedInput = NonNullable<RawInput>; // string | number`
  },
  {
    id: 74,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Senior',
    category: 'Utility Types',
    question: 'What are `Parameters<T>` and `ReturnType<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Parameters<T>\` and \`ReturnType<T>\` are utility types that extract function signature metadata using conditional types and the \`infer\` keyword. \`Parameters<T>\` extracts the function's parameter types as a tuple (\`T extends (...args: infer P) => any ? P : never\`). \`ReturnType<T>\` extracts the returned type (\`T extends (...args: any) => infer R ? R : any\`). They are heavily used when typing higher-order decorators, logging proxies, and API factories."`,
    code: `function createUser(email: string, age: number, isAdmin?: boolean): { id: string; email: string } {
  return { id: "u1", email };
}

type CreateUserParams = Parameters<typeof createUser>; // [email: string, age: number, isAdmin?: boolean]
type CreateUserReturn = ReturnType<typeof createUser>; // { id: string; email: string }`
  },
  {
    id: 75,
    partId: 5,
    section: 'E. Advanced and utility types',
    difficulty: 'Senior',
    category: 'Utility Types',
    question: 'What are `Awaited<T>` and `InstanceType<T>`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Awaited<T>\` recursively unwraps Promises, extracting the ultimate resolved value of a Promise-like type, modeling the runtime behavior of \`await\`. \`InstanceType<T>\` extracts the instance type of a constructor function or class using \`infer R\`. \`Awaited\` is essential for typing async operations in TanStack Query and Redux Toolkit, while \`InstanceType\` is used for dependency injection containers and dynamic factories."`,
    code: `// Awaited unwraps recursive promises:
type NestedPromise = Promise<Promise<string>>;
type Unwrapped = Awaited<NestedPromise>; // string

// InstanceType:
class AuthService {
  token = "jwt_xyz";
}
type AuthInstance = InstanceType<typeof AuthService>; // AuthService`
  },
  {
    id: 76,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Intermediate',
    category: 'Type Operators',
    question: 'What does `keyof` do?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The \`keyof\` operator takes an object type and produces a string or numeric literal union of all its declared property keys. For example, \`keyof { id: string; name: string }\` evaluates to the union \`'id' | 'name'\`. If the object has an index signature like \`[key: string]: any\`, \`keyof\` evaluates to \`string | number\` (because JavaScript coerces numeric object keys to strings). It is the primary building block for mapped types, generic property access, and object transformations."`,
    code: `interface Order {
  id: string;
  total: number;
  status: "PAID" | "PENDING";
}

type OrderKeys = keyof Order; // "id" | "total" | "status"`
  },
  {
    id: 77,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Intermediate',
    category: 'Type Operators',
    question: 'What is indexed access typing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Indexed access typing (also called lookup typing) allows you to look up the type of a specific property or element on another type using bracket notation: \`T[K]\`. For example, \`User['address']\` extracts the type of the address property. You can also pass a union of keys to retrieve a union of property types: \`User['id' | 'name']\`. For arrays, indexing with \`number\` (\`MyArray[number]\`) extracts the union of all element types in the array."`,
    code: `interface Customer {
  id: string;
  addresses: { street: string; city: string }[];
}

// 1. Property lookup:
type AddressList = Customer["addresses"]; // { street: string; city: string }[]

// 2. Array element lookup via [number]:
type SingleAddress = Customer["addresses"][number]; // { street: string; city: string }`
  },
  {
    id: 78,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Intermediate',
    category: 'Type Operators',
    question: 'What is `typeof` in a type position?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In a type position (such as after a colon or type alias declaration), \`typeof\` refers to TypeScript's type query operator. Instead of executing the JavaScript runtime \`typeof\`, it queries the compiler's symbol table and extracts the static TypeScript type of any existing runtime variable, object, or function. Combined with \`as const\`, it allows you to derive types directly from single-source-of-truth runtime configurations, eliminating duplication."`,
    code: `const defaultConfig = {
  endpoint: "https://api.chrona.com",
  timeout: 3000,
  retries: 2
} as const;

// Extract exact type from runtime object:
type AppConfig = typeof defaultConfig;
// Evaluates to: { readonly endpoint: "https://api.chrona.com"; readonly timeout: 3000; readonly retries: 2; }`
  },
  {
    id: 79,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'Conditional Types',
    question: 'What is a conditional type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A conditional type selects one of two possible types based on a subtyping relationship test, using ternary syntax: \`T extends U ? TrueType : FalseType\`. It introduces programmable logic into TypeScript's type system. When \`T\` is assignable to \`U\`, the condition resolves to \`TrueType\`; otherwise it resolves to \`FalseType\`. It enables type-level filtering, recursive type unwrapping, and dynamic API return type calculations."`,
    code: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false`
  },
  {
    id: 80,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'Conditional Types',
    question: 'What is a distributive conditional type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A distributive conditional type is a conditional type that acts on a **naked type parameter \`T\`**. When a union type is passed to a naked conditional type, TypeScript automatically distributes the condition over each member of the union: \`(A | B) extends U ? X : Y\` expands into \`(A extends U ? X : Y) | (B extends U ? X : Y)\`. To **prevent distribution**, you wrap the type parameter and constraint in square brackets: \`[T] extends [U] ? X : Y\`."`,
    code: `// Distributive:
type ToArray<T> = T extends any ? T[] : never;
type Distributed = ToArray<string | number>; // string[] | number[]

// Non-distributive (wrapped in tuple):
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Combined = ToArrayNonDist<string | number>; // (string | number)[]`
  },
  {
    id: 81,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'Template Literals',
    question: 'What are template literal types?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Template literal types, introduced in TypeScript 4.1, bring JavaScript template literal syntax into type space. They allow you to concatenate string literal types, interpolate unions, and construct new string union combinations. When a union is interpolated inside a template literal (e.g. \`type Event = \`on\${'Click' | 'Hover'}\`), TypeScript automatically computes the Cartesian product of all possible combinations."`,
    code: `type Scope = "read" | "write";
type Entity = "users" | "orders";

// Computes Cartesian product union:
type Permission = \`\${Scope}:\${Entity}\`;
// "read:users" | "read:orders" | "write:users" | "write:orders"`
  },
  {
    id: 82,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Intermediate',
    category: 'Template Literals',
    question: 'What are `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`Uppercase\`, \`Lowercase\`, \`Capitalize\`, and \`Uncapitalize\` are built-in intrinsic string manipulation utility types provided by TypeScript. They operate on string literal types using internal compiler intrinsic functions to alter case. They are frequently paired with template literal types and mapped type key remapping to generate type-safe event handlers (e.g. \`onClick\`) or getter/setter method names."`,
    code: `type Action = "create" | "update";
type EventName = \`on\${Capitalize<Action>}\`; // "onCreate" | "onUpdate"
type Shouting = Uppercase<"error">;           // "ERROR"`
  },
  {
    id: 83,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'infer Keyword',
    question: 'What is the `infer` keyword?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The \`infer\` keyword introduces a type variable inside the \`extends\` clause of a conditional type to be deduced via pattern matching. Instead of checking if a type matches an existing contract, \`infer\` tells the compiler: 'Deconstruct this type and capture whatever type occupies this position into a new type variable.' It is the primary engine behind utility types like \`ReturnType\`, \`Parameters\`, and \`Awaited\`."`,
    code: `// Unpack Array element type:
type Flatten<T> = T extends (infer E)[] ? E : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number`
  },
  {
    id: 84,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'Recursive Types',
    question: 'What is a recursive type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A recursive type is a type alias that references itself in its own definition. Supported cleanly in modern TypeScript (3.7+), recursive types are essential for modeling nested hierarchical structures like JSON documents, DOM trees, binary trees, and deep immutability utilities like \`DeepReadonly<T>\`."`,
    code: `// Recursive JSON type definition:
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const sampleJson: JSONValue = {
  user: "Alex",
  meta: { retries: 3, tags: ["prod", "auth"] }
};`
  },
  {
    id: 85,
    partId: 6,
    section: 'F. Type operators and level metaprogramming',
    difficulty: 'Senior',
    category: 'Exhaustive Checking',
    question: 'What is an exhaustive check, and why use `never`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An exhaustive check is a compiler-enforced design pattern that guarantees every possible variant of a discriminated union is handled in a switch or conditional block. By assigning the remaining variable to type \`never\` in the default branch (\`const _exhaustive: never = val\`), the code compiles cleanly as long as all variants are handled. If a developer later adds a new variant to the union, TypeScript's control-flow analysis flags a compile error at the \`never\` assignment, preventing unhandled production cases."`,
    code: `type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side * s.side;
    default: {
      const _check: never = s; // If a new shape is added, this line errors at compile-time!
      throw new Error(\`Unhandled shape: \${_check}\`);
    }
  }
}`
  },
  {
    id: 86,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Beginner',
    category: 'OOP Foundations',
    question: 'Does TypeScript support object-oriented programming?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Yes, TypeScript provides first-class support for Object-Oriented Programming (OOP). It extends standard ES6 JavaScript classes with static type annotations, access modifiers (\`public\`, \`private\`, \`protected\`), abstract classes, interface implementation (\`implements\`), parameter properties, method overriding with the \`override\` keyword, and generic classes. It enables classic enterprise design patterns like Repository, Factory, and Strategy with complete type safety."`,
    code: `interface Notifier { send(message: string): void; }

class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log("Sending email:", message);
  }
}`
  },
  {
    id: 87,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Beginner',
    category: 'Classes',
    question: 'What is a class in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A class in TypeScript is both a **runtime constructor function** and a **type-space interface**. When you declare a class \`User\`, TypeScript creates two things: a JavaScript constructor function that executes at runtime, and a TypeScript type representing instances of that class. Classes encapsulate state and behavior, support inheritance via \`extends\`, and allow constructor parameter property shortcuts."`,
    code: `class UserAccount {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}`
  },
  {
    id: 88,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Intermediate',
    category: 'Access Modifiers',
    question: 'What are access modifiers in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"TypeScript features three primary access modifiers:
1. **\`public\` (Default)**: Accessible from anywhere—inside the class, subclasses, and external callers.
2. **\`protected\`**: Accessible only within the class and its subclasses; inaccessible to external callers.
3. **\`private\`**: Accessible strictly within the defining class body; inaccessible to subclasses and external callers.
Crucially, TypeScript's access modifiers are **compile-time restrictions only** and are erased in emitted JavaScript. For runtime engine-level privacy, use JavaScript's private field syntax (\`#field\`)."`,
    code: `class Account {
  public username: string;
  protected balance: number;
  private apiKey: string;

  constructor(u: string, b: number, k: string) {
    this.username = u;
    this.balance = b;
    this.apiKey = k;
  }
}`
  },
  {
    id: 89,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Intermediate',
    category: 'Inheritance',
    question: 'What is inheritance?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Inheritance is an OOP mechanism where a subclass extends a superclass using the \`extends\` keyword, inheriting its properties and methods while adding new behavior or overriding existing methods. In the subclass constructor, calling \`super()\` is mandatory before accessing \`this\` to ensure the parent class is initialized."`,
    code: `class Vehicle {
  constructor(public speed: number) {}
}

class Car extends Vehicle {
  constructor(speed: number, public brand: string) {
    super(speed); // Calls parent constructor
  }
}`
  },
  {
    id: 90,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Intermediate',
    category: 'Abstract Classes',
    question: 'What is an abstract class?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An abstract class is a base class that cannot be directly instantiated with \`new\`. It serves as a blueprint for derived classes, allowing you to define both fully implemented concrete methods and abstract method signatures that subclasses **must implement**. Unlike interfaces, abstract classes emit real JavaScript constructor code and can contain concrete implementation logic."`,
    code: `abstract class PaymentGateway {
  constructor(protected apiKey: string) {}
  abstract process(amount: number): Promise<boolean>;

  log(msg: string) {
    console.log(\`[Gateway] \${msg}\`);
  }
}`
  },
  {
    id: 91,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Senior',
    category: 'Abstract vs Interface',
    question: 'What is the difference between an interface and an abstract class?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The critical distinction is **runtime existence and code sharing**. An interface is 100% erased at compile time; it emits zero JavaScript code and cannot provide method implementations. An abstract class emits real JavaScript code, can contain concrete implemented methods, state fields, constructors, and can be checked with \`instanceof\`. Use interfaces for lightweight structural contracts, and abstract classes when sharing common execution logic across a family of subclasses."`,
    table: {
      headers: ['Feature', 'interface', 'abstract class'],
      rows: [
        ['Runtime Code Emission', 'Zero (Completely erased)', 'Emits real constructor class into JS'],
        ['Concrete Implementations', '❌ Pure declarations only', '✅ Can include implemented methods and fields'],
        ['Instantiation via new', '❌ Cannot be instantiated', '❌ Cannot be instantiated'],
        ['instanceof Checking', '❌ Cannot be used with instanceof', '✅ Can be checked with instanceof']
      ]
    },
    code: `// Interface: Erased completely
interface ILog { log(m: string): void; }

// Abstract class: Contains concrete implementation
abstract class BaseLogger {
  prefix = "[APP]";
  format(m: string) { return \`\${this.prefix} \${m}\`; }
  abstract send(m: string): void;
}`
  },
  {
    id: 92,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Intermediate',
    category: 'Method Overriding',
    question: 'What is method overriding and the `override` keyword?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Method overriding occurs when a subclass provides its own implementation for a method defined in its superclass. TypeScript 4.3 introduced the \`override\` keyword (enforced by \`noImplicitOverride: true\`). It explicitly declares that a method is intended to override a parent method. If the parent class later renames or deletes the method, the compiler flags an error on the subclass, preventing silent bugs where overridden behavior is lost."`,
    code: `class Parent {
  render() { return "parent"; }
}

class Child extends Parent {
  override render() { return "child"; } // Safe! Compiler verifies parent has 'render'
}`
  },
  {
    id: 93,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Beginner',
    category: 'Accessors',
    question: 'What are getters and setters in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Getters and setters (accessors) intercept property reading and writing on classes using \`get\` and \`set\` keywords. If a property has a getter but no setter, TypeScript automatically infers the property as \`readonly\`. Accessors allow you to encapsulate validation, logging, or caching while exposing a clean public property API to callers."`,
    code: `class User {
  private _age: number = 0;

  get age(): number { return this._age; }
  set age(value: number) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  }
}`
  },
  {
    id: 94,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Beginner',
    category: 'Static Members',
    question: 'What are static members?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Static members belong to the class constructor itself, rather than to instances of the class. They are declared with the \`static\` keyword and accessed directly on the class name (e.g. \`MathUtils.add()\`). They are commonly used for utility helper functions, singleton instances, and factory constructor methods."`,
    code: `class Config {
  static defaultPort = 8080;
  static createDefault(): Config {
    return new Config();
  }
}`
  },
  {
    id: 95,
    partId: 7,
    section: 'G. Classes, OOP, and encapsulation',
    difficulty: 'Intermediate',
    category: 'Parameter Properties',
    question: 'What is a parameter property?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A parameter property is a TypeScript shorthand that allows you to declare and initialize a class member in a single location: the constructor parameter list. By prefixing a constructor argument with an accessibility modifier (\`public\`, \`private\`, \`protected\`) or \`readonly\`, TypeScript automatically creates the class field and assigns the incoming argument to it, eliminating tedious boilerplate."`,
    code: `// Shorthand with Parameter Properties:
class OrderService {
  constructor(
    public readonly orderId: string,
    private dbClient: DatabaseClient,
    protected logger: Logger
  ) {
    // No 'this.orderId = orderId' boilerplate needed!
  }
}`
  }
];

module.exports = batch3;
console.log(`Batch 3 authored with ${batch3.length} questions.`);
