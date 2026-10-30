// scratch/ts_q_batch_2.cjs
// Batch 2: Q31 to Q60 — Unions, Narrowing, Guards, Interfaces, Structural Typing & Generics
// Fully adhering to AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Key Points.

const batch2 = [
  {
    id: 31,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Beginner',
    category: 'Unions',
    question: 'What is a union type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A union type in TypeScript describes a value that can be one of several distinct types, expressed using the pipe character (\`|\`), such as \`string | number\`. In set theory terms, a union represents the mathematical union of two or more sets. Before you can perform operations specific to one member of the union (like calling \`.toFixed()\` on a number), you must narrow the union using control-flow checks like \`typeof\`. Without narrowing, the compiler only permits property access to members that are common to all types in the union."`,
    code: `function printId(id: string | number) {
  // Common properties or methods can be accessed directly:
  console.log(id.toString());

  // Specific member operations require narrowing:
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}`,
    keyPoints: [
      'Syntax: TypeA | TypeB.',
      'Represents mathematical set union: value can be any member.',
      'Only common properties are accessible prior to narrowing.',
      'Heavily used for status codes, IDs, and domain state models.'
    ],
    followUps: [
      {
        q: 'What happens if you access a property that only exists on one member of a union?',
        a: 'The compiler emits an error like: Property "x" does not exist on type "TypeA | TypeB". You must narrow the type first using in, typeof, or instanceof.'
      }
    ],
    tip: 'Explain that unions represent "OR" logic in type space.'
  },
  {
    id: 32,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Intersections',
    question: 'What is an intersection type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An intersection type combines multiple types into a single unified contract using the ampersand character (\`&\`), such as \`TypeA & TypeB\`. An object conforming to an intersection must satisfy all constituent types simultaneously—possessing every property and method declared in each combined type. It is widely used to compose domain models, mixins, and higher-order component props. Intersecting incompatible primitive types (such as \`string & number\`) collapses to \`never\`."`,
    code: `type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { isDeleted: boolean; deletedAt?: Date };

// Composed Entity:
type BaseEntity = Timestamped & SoftDeletable;

const userRecord: BaseEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false
};`,
    keyPoints: [
      'Syntax: TypeA & TypeB.',
      'Value must satisfy all intersected contracts simultaneously.',
      'Widely used for entity composition and React prop extension.',
      'Incompatible primitives (string & number) evaluate to never.'
    ],
    followUps: [
      {
        q: 'How does an intersection resolve conflicting property types, like { id: string } & { id: number }?',
        a: 'The conflicting property itself becomes an intersection of the two types: id: string & number, which collapses to id: never, making the object impossible to instantiate.'
      }
    ],
    tip: 'Mentioning that conflicting property intersections collapse to never shows advanced type-system reasoning.'
  },
  {
    id: 33,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Narrowing',
    question: 'What is type narrowing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type narrowing is the process by which TypeScript's Control Flow Analysis (CFA) inspects runtime JavaScript branching logic—such as \`if\` statements, \`switch\` statements, \`typeof\`, \`instanceof\`, and equality checks—to refine a broad type (like a union \`string | number | null\`) down to a more specific, narrower subtype within that code branch. Once narrowed, the compiler unlocks operations and methods unique to that specific subtype without requiring any type assertions."`,
    code: `function processPayment(amount: number | null | undefined) {
  // Broad type: number | null | undefined
  if (amount == null) {
    // Narrowed to: null | undefined (eliminates number)
    return "No charge applied";
  }
  // Downstream from check, 'amount' is narrowed to strictly 'number'!
  return \`$ \${amount.toFixed(2)}\`;
}`,
    keyPoints: [
      'Powered by TypeScript Control Flow Analysis (CFA).',
      'Refines broad union types into specific concrete types inside branches.',
      'Works with typeof, instanceof, in, equality (===), truthiness, and custom type guards.'
    ],
    followUps: [
      {
        q: 'What is assignment-based narrowing?',
        a: 'When a variable declared with a union type is reassigned a specific value, TypeScript narrows the variable\'s type to that specific value for subsequent lines until another reassignment occurs.'
      }
    ],
    tip: 'Control Flow Analysis (CFA) is the technical term interviewers want to hear.'
  },
  {
    id: 34,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Beginner',
    category: 'Narrowing',
    question: 'What is `typeof` narrowing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`typeof\` narrowing uses JavaScript's runtime \`typeof\` operator within conditional branches to narrow primitive union types. TypeScript's compiler understands the return values of \`typeof\`—specifically \`'string'\`, \`'number'\`, \`'boolean'\`, \`'bigint'\`, \`'symbol'\`, \`'undefined'\`, \`'object'\`, and \`'function'\`. When you write \`if (typeof val === 'string')\`, TypeScript automatically narrows the variable to \`string\` inside that block."`,
    code: `function padLeft(value: string, padding: string | number): string {
  if (typeof padding === "number") {
    // Narrowed to 'number'
    return " ".repeat(padding) + value;
  }
  // Narrowed to 'string'
  return padding + value;
}`,
    keyPoints: [
      'Inspects JavaScript primitive types at runtime.',
      'Understands all 8 typeof return string values.',
      'Watch out: typeof null returns "object" in JavaScript (the infamous typeof null bug).'
    ],
    followUps: [
      {
        q: 'Why can typeof val === "object" be misleading when narrowing null | { id: string }?',
        a: 'Because in JavaScript typeof null evaluates to "object". Checking typeof val === "object" still includes null; you must write typeof val === "object" && val !== null.'
      }
    ],
    tip: 'Always mention the typeof null === "object" quirk when discussing typeof narrowing.'
  },
  {
    id: 35,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Narrowing',
    question: 'What is `instanceof` narrowing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`instanceof\` narrowing uses JavaScript's prototype-chain check to narrow values to specific class constructors. When you test \`if (err instanceof CustomError)\`, TypeScript inspects the prototype chain at runtime and narrows the variable to \`CustomError\` within the truthy branch. It is essential for error handling, Date objects, RegExps, and DOM node hierarchies."`,
    code: `class AuthenticationError extends Error {
  code = "AUTH_EXPIRED";
}

function handleError(err: unknown) {
  if (err instanceof AuthenticationError) {
    // Narrowed to AuthenticationError; code property is accessible:
    console.error("Auth Failure:", err.code, err.message);
  } else if (err instanceof Error) {
    // Narrowed to standard Error:
    console.error("General Failure:", err.message);
  }
}`,
    keyPoints: [
      'Inspects prototype chain via Constructor.prototype.',
      'Narrows unknown or Error unions to concrete class instances.',
      'Cannot be used with plain TypeScript interfaces or type aliases (they do not exist at runtime!).'
    ],
    followUps: [
      {
        q: 'Can you use instanceof to check if a value implements an interface like interface User {}?',
        a: 'No. Interfaces are completely erased at compile-time and have no runtime prototype or constructor. instanceof requires a real runtime class or constructor function.'
      }
    ],
    tip: 'Stressing that interfaces cannot be checked with instanceof demonstrates solid type-erasure understanding.'
  },
  {
    id: 36,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Narrowing',
    question: 'What is the `in` operator in type narrowing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The \`in\` operator narrows unions of object types by checking for the existence of a specific property name on an object at runtime: \`if ('prop' in obj)\`. TypeScript inspects which types in the union declare that property; inside the \`if\` branch, the variable is narrowed to only those types that include the property. It is particularly effective for discriminating between different interfaces when they do not share a formal discriminator property."`,
    code: `interface EmailRecipient { email: string }
interface SmsRecipient { phoneNumber: string }

function sendAlert(recipient: EmailRecipient | SmsRecipient) {
  if ("email" in recipient) {
    // Narrowed to EmailRecipient
    console.log("Sending email to:", recipient.email);
  } else {
    // Narrowed to SmsRecipient
    console.log("Sending SMS to:", recipient.phoneNumber);
  }
}`,
    keyPoints: [
      'Syntax: "propertyName" in object.',
      'Narrows union types based on whether the property is declared in the member types.',
      'Safe and effective alternative when discriminated union tags are absent.'
    ],
    followUps: [
      {
        q: 'Can you use the in operator on unknown or primitive types?',
        a: 'In modern TypeScript (4.9+), "prop" in val safely narrows unknown by first verifying that the value is an object before checking the property.'
      }
    ],
    tip: 'The in operator is the best tool for narrowing when you cannot change external third-party object shapes.'
  },
  {
    id: 37,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Senior',
    category: 'Discriminated Unions',
    question: 'What is a discriminated union?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A discriminated union (also known as a tagged union or algebraic data type) is a union of object types where each member shares a common, literal property called the discriminator or tag—such as \`status: 'loading' | 'success' | 'error'\`. When you branch on this discriminator using an \`if\` or \`switch\` statement, TypeScript automatically narrows the object to the exact variant corresponding to that literal. It completely eliminates impossible states in state management, Redux actions, and API communication."`,
    code: `// Discriminated Union for Payment Flow:
type PaymentState =
  | { status: "IDLE" }
  | { status: "PROCESSING"; transactionId: string }
  | { status: "SUCCESS"; receiptUrl: string; amount: number }
  | { status: "FAILED"; errorCode: string; retryAllowed: boolean };

function handlePayment(state: PaymentState) {
  switch (state.status) {
    case "PROCESSING":
      return \`Transaction pending: \${state.transactionId}\`;
    case "SUCCESS":
      return \`Paid $\${state.amount}. Receipt: \${state.receiptUrl}\`;
    case "FAILED":
      return \`Declined [\${state.errorCode}]. Retry: \${state.retryAllowed}\`;
    case "IDLE":
      return "Waiting for checkout submission";
  }
}`,
    keyPoints: [
      'Union of object types sharing a common literal property (the discriminator).',
      'Enables effortless, exhaustive narrowing via switch or if statements.',
      'Eliminates impossible UI and data states in production software.'
    ],
    followUps: [
      {
        q: 'How do you guarantee that every case of a discriminated union is handled?',
        a: 'Add a default branch with const _exhaustiveCheck: never = state; throw new Error(_exhaustiveCheck);. If a new member is added to the union, TypeScript triggers a compile-time error.'
      }
    ],
    tip: 'Discriminated unions are considered the single most powerful architectural pattern in TypeScript.'
  },
  {
    id: 38,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Senior',
    category: 'Type Predicates',
    question: 'What is a type predicate?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A type predicate is a special return type annotation for user-defined type guard functions, using the syntax \`paramName is Type\`, such as \`pet is Dog\`. Normally, helper functions returning boolean lose their narrowing effect once evaluated. By annotating the return type with a type predicate, you instruct the TypeScript compiler: 'If this function returns true at runtime, narrow the passed parameter to this specific type in the calling scope.' It is the primary vehicle for building reusable, encapsulated runtime validation guards."`,
    code: `interface AdminUser {
  id: string;
  role: "ADMIN";
  permissions: string[];
}

// User-Defined Type Guard with Type Predicate:
function isAdmin(user: unknown): user is AdminUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "role" in user &&
    (user as any).role === "ADMIN" &&
    Array.isArray((user as any).permissions)
  );
}

function accessAdminConsole(user: unknown) {
  if (isAdmin(user)) {
    // 'user' is safely narrowed to AdminUser!
    console.log("Admin permissions:", user.permissions.join(", "));
  }
}`,
    keyPoints: [
      'Syntax: function isType(val: unknown): val is TargetType.',
      'Preserves narrowing across function boundaries.',
      'Commonly used with Array.prototype.filter to strip null or filter specific types: arr.filter(isDefined).'
    ],
    followUps: [
      {
        q: 'How do you filter out null and undefined from an array of (string | null)[] using a type predicate?',
        a: 'Define function isNonNullable<T>(val: T): val is NonNullable<T> { return val !== null && val !== undefined; }. Then arr.filter(isNonNullable) returns string[] instead of (string | null)[].'
      }
    ],
    tip: 'Mentioning the array filter type predicate trick (arr.filter(isNonNullable)) is an instant hire signal.'
  },
  {
    id: 39,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Senior',
    category: 'satisfies Operator',
    question: 'What is the difference between `as` and `satisfies`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`as\` is a **type assertion** that forces the compiler to treat a value as the target type, potentially masking errors if the value is missing required fields or has incompatible types. In contrast, \`satisfies\` (introduced in TypeScript 4.9) **validates that an expression matches a type or interface WITHOUT upcasting or widening the inferred type**. With \`satisfies\`, TypeScript enforces structural compliance while preserving the exact literal types, member keys, and method return signatures of the original object."`,
    table: {
      headers: ['Dimension', 'Type Assertion (as T)', 'satisfies Operator (expr satisfies T)'],
      rows: [
        ['Validation Rigor', 'Weak: Overrides compiler checks', 'Strict: Compiler validates all properties'],
        ['Inferred Type', 'Forced to T (loses exact literal keys)', 'Retains exact inferred literal types and shapes'],
        ['Typo Detection', 'Can mask missing or misnamed properties', 'Catches typos immediately'],
        ['Recommended Use', 'DOM elements, legacy integration', 'Configuration objects, theme palettes, routing tables']
      ]
    },
    code: `type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];
type Theme = Record<Colors, string | RGB>;

// 1. With 'as Theme' (Dangerous, widens types):
// const bad = { red: [255, 0, 0], green: "#00ff00" } as Theme;
// bad.red.map(x => x); // Error: Property 'map' does not exist on string | RGB!

// 2. With 'satisfies Theme' (Safe, preserves exact types):
const good = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: "#0000ff"
} satisfies Theme;

// Exact types preserved!
good.red.map(val => val * 2); // ✅ Valid! TS knows 'red' is specifically RGB tuple.
good.green.toUpperCase();     // ✅ Valid! TS knows 'green' is specifically string.`,
    keyPoints: [
      'satisfies validates type conformance without widening or upcasting.',
      'Preserves exact literal types and sub-properties for autocompletion.',
      'Direct replacement for type annotations on complex configuration objects.'
    ],
    followUps: [
      {
        q: 'Why should you use satisfies for routing tables and navigation config in React?',
        a: 'Because satisfies ensures the routes conform to the RouteConfig interface while keeping the exact path string literals for type-safe navigation hooks like navigate("/dashboard/billing").'
      }
    ],
    tip: 'satisfies is one of the most celebrated additions to modern TypeScript—explain it proudly.'
  },
  {
    id: 40,
    partId: 2,
    section: 'B. Basic types, primitives, and special types',
    difficulty: 'Intermediate',
    category: 'Non-Null Assertion',
    question: 'What is the non-null assertion operator (`!`)?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The non-null assertion operator is a postfix exclamation mark (\`val!\`) that tells the TypeScript compiler to assert that a value is neither \`null\` nor \`undefined\`, stripping those types from the union. It is purely a compile-time directive with zero emitted runtime JavaScript. While convenient when the developer possesses domain knowledge that the compiler cannot deduce (such as finding an element in a test DOM), overusing it in production is dangerous because if the value actually is null, downstream code will crash with an unhandled TypeError."`,
    code: `// Finding DOM element:
const input = document.getElementById("search-input")!; // Strips 'null'
input.focus(); // No compiler error

// ⚠️ If element doesn't exist: 💥 TypeError: Cannot read properties of null (reading 'focus')!

// ✅ Safer Alternative: Optional Chaining with Nullish Coalescing
const safeInput = document.getElementById("search-input");
safeInput?.focus();`,
    keyPoints: [
      'Postfix ! removes null and undefined from the type at compile-time.',
      'Emits zero runtime check code.',
      'Prefer optional chaining (?.) or explicit runtime if-checks in production.'
    ],
    followUps: [
      {
        q: 'What is the definite assignment assertion in TypeScript classes?',
        a: 'Placing ! on a class property (e.g. name!: string) tells the compiler that the property will be initialized elsewhere (such as via dependency injection or ngOnInit), satisfying strictPropertyInitialization.'
      }
    ],
    tip: 'Always emphasize preferring optional chaining (?.) over non-null assertions in client code.'
  },
  {
    id: 41,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Beginner',
    category: 'Interfaces',
    question: 'What is an interface in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An interface in TypeScript is a named declaration that defines the structural shape and contract of an object, class, or function. It specifies the names, types, optionality, and mutability of its properties and methods. Interfaces are open-ended—meaning multiple interface declarations with the same name in the same scope automatically merge through declaration merging. They can extend other interfaces using the \`extends\` keyword and be implemented by classes using the \`implements\` keyword."`,
    code: `interface PaymentGateway {
  readonly gatewayName: string;
  isLive: boolean;
  charge(amount: number, currency: string): Promise<{ success: boolean; txId: string }>;
}

const stripeGateway: PaymentGateway = {
  gatewayName: "Stripe",
  isLive: true,
  async charge(amount, currency) {
    return { success: true, txId: "ch_123" };
  }
};`,
    keyPoints: [
      'Defines the shape and contract of an object or class.',
      'Supports declaration merging (re-declaring merges members).',
      'Can extend multiple interfaces via extends.',
      'Completely erased at compile time.'
    ],
    followUps: [
      {
        q: 'Can an interface define callable or construct signatures?',
        a: 'Yes. An interface can declare callable signatures ((): void) and constructor signatures (new (): MyClass) to type factory functions and constructors.'
      }
    ],
    tip: 'Interfaces are ideal for defining public API contracts and class implementation blueprints.'
  },
  {
    id: 42,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Beginner',
    category: 'Type Aliases',
    question: 'What is a type alias?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A type alias in TypeScript is a name given to any valid type, declared using the \`type\` keyword, such as \`type ID = string | number\`. Unlike interfaces, which are limited to describing object shapes and functions, type aliases can represent primitives, unions, intersections, tuples, mapped types, conditional types, and function signatures. Type aliases are immutable once declared; they cannot participate in declaration merging."`,
    code: `// 1. Primitive alias:
type UUID = string;

// 2. Union type alias:
type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

// 3. Object type alias:
type OrderSummary = {
  orderId: UUID;
  status: OrderStatus;
  total: number;
};`,
    keyPoints: [
      'Syntax: type Name = TypeDefinition.',
      'Can represent any type: primitives, unions, tuples, functions, mapped types.',
      'Cannot be reopened or merged through declaration merging.'
    ],
    followUps: [
      {
        q: 'Does creating a type alias create a new runtime type or class?',
        a: 'No. Type aliases create no new runtime entities; they are merely compile-time aliases for existing type structures.'
      }
    ],
    tip: 'Remember: interfaces can only describe object shapes; type aliases can describe anything.'
  },
  {
    id: 43,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Senior',
    category: 'Interfaces vs Types',
    question: 'What is the difference between `interface` and `type`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"While \`interface\` and \`type\` both describe object structures, they have key architectural differences. \`interface\` is open-ended and supports **declaration merging**, making it the mandatory standard for library definitions and module augmentation. Interfaces also yield slightly faster compiler type-checking because the compiler caches flat object shapes by name. On the other hand, \`type\` aliases are far more expressive: they can define **unions, primitives, tuples, mapped types, and conditional types**, none of which can be expressed as an interface. On modern senior teams, we use interfaces for public API models and class contracts, and type aliases for unions, utilities, and complex transformations."`,
    table: {
      headers: ['Feature', 'interface', 'type Alias'],
      rows: [
        ['Declaration Merging', '✅ Supported (automatic merging)', '❌ Syntax Error (duplicate identifier)'],
        ['Unions & Primitives', '❌ Cannot declare unions directly', '✅ Fully supported (type X = A | B)'],
        ['Mapped / Conditional Types', '❌ Cannot be an interface', '✅ Fully supported (type Readonly<T> = ...)'],
        ['Extends Mechanism', '\`interface B extends A\`', '\`type B = A & { ... }\` (Intersection)'],
        ['Compiler Shape Caching', 'Slightly faster for flat objects', 'Slightly slower for deep intersections']
      ]
    },
    code: `// Interfaces merge:
interface AppConfig { apiUrl: string; }
interface AppConfig { timeoutMs: number; } // Merged!

// Type aliases do NOT merge:
type AppTheme = { primary: string };
// type AppTheme = { secondary: string }; // ❌ Error: Duplicate identifier 'AppTheme'.`,
    keyPoints: [
      'Interfaces merge; type aliases do not.',
      'Types can declare unions, primitives, and mapped types; interfaces cannot.',
      'Interfaces are best for external library contracts; types for internal domain logic.'
    ],
    followUps: [
      {
        q: 'Why does the TypeScript compiler perform faster with interfaces than deep type intersections?',
        a: 'Interfaces create a single named flat shape in the internal compiler cache. Intersections create compound type structures that must be recursively checked for conflicting properties.'
      }
    ],
    tip: 'Explaining compiler shape caching is a massive differentiator in senior interviews.'
  },
  {
    id: 44,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Intermediate',
    category: 'Interfaces',
    question: 'Can an interface extend another interface?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Yes, an interface can extend one or more interfaces using the \`extends\` keyword, inheriting all of their properties and methods. Multiple inheritance is fully supported: an interface can extend multiple parent interfaces separated by commas, such as \`interface C extends A, B\`. When extending, the child interface can also refine or narrow parent property types, provided the refined type is assignable to the parent type."`,
    code: `interface Identifiable {
  id: string;
}

interface Auditable {
  createdAt: Date;
  updatedAt: Date;
}

// Extends multiple parent interfaces:
interface UserProfile extends Identifiable, Auditable {
  email: string;
  role: "ADMIN" | "USER";
}`,
    keyPoints: [
      'Syntax: interface Child extends Parent1, Parent2.',
      'Inherits all properties from parents.',
      'Child can narrow (subtype) parent property types, but cannot contradict them.'
    ],
    followUps: [
      {
        q: 'Can an interface extend a type alias?',
        a: 'Yes, an interface can extend any type alias that statically resolves to an object shape or statically known intersection of object shapes.'
      }
    ],
    tip: 'Mentioning that interfaces can extend type aliases (as long as they are object shapes) is a great subtle detail.'
  },
  {
    id: 45,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Intermediate',
    category: 'Type Aliases',
    question: 'Can a type alias extend another type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A type alias cannot use the \`extends\` keyword like an interface; instead, it achieves inheritance and composition through **intersection types (\`&\`)**. By intersecting one type alias with an object literal or another type alias (\`type Employee = Person & { employeeId: string }\`), the resulting type inherits all properties from both constituents."`,
    code: `type Person = {
  name: string;
  age: number;
};

// "Extending" via Intersection:
type Employee = Person & {
  employeeId: string;
  department: string;
};

const dev: Employee = {
  name: "Alex",
  age: 32,
  employeeId: "EMP-404",
  department: "Platform Engineering"
};`,
    keyPoints: [
      'Type aliases compose using intersection types (&), not extends.',
      'Can intersect object types, interfaces, and utility types.',
      'Creates a compound type that must satisfy all members.'
    ],
    followUps: [
      {
        q: 'What is the syntactic difference between interface extends and type intersection error messages?',
        a: 'When an interface extends another interface with conflicting properties, the error is caught at the interface declaration. With type intersections, the conflict produces never on the property and is only caught when you try to instantiate the object.'
      }
    ],
    tip: 'Highlighting when errors are caught (at declaration vs instantiation) shows deep compiler empathy.'
  },
  {
    id: 46,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Senior',
    category: 'Declaration Merging',
    question: 'What is declaration merging?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Declaration merging is a unique TypeScript mechanism where the compiler automatically merges two or more separate declarations sharing the same name into a single definition. The most common form is **interface merging**: if an interface \`User\` is declared twice in the same scope, the resulting \`User\` interface contains the union of all properties declared across both definitions. This is the foundation of module augmentation, enabling developers to safely attach custom properties to global objects like \`window\`, Express \`Request\`, or third-party npm libraries without modifying their source code."`,
    code: `// Base interface:
interface Window {
  appVersion: string;
}

// Augmenting Window elsewhere in the project:
interface Window {
  analyticsTracker?: { track(event: string): void };
}

// The resulting Window interface contains both properties:
window.appVersion = "2.4.0";
window.analyticsTracker?.track("PAGE_VIEW");`,
    keyPoints: [
      'Multiple interface declarations with the same name automatically merge.',
      'Non-function members must have identical types; function overloads are merged in declaration order.',
      'Powers global augmentation and Express Request typing in full-stack apps.'
    ],
    followUps: [
      {
        q: 'Can classes or type aliases participate in declaration merging?',
        a: 'Type aliases cannot merge (duplicate identifier error). Classes can merge with interfaces and namespaces, but not with other classes.'
      }
    ],
    tip: 'Declaration merging is the #1 question asked when interviewing for Node.js / Express backend roles with TypeScript.'
  },
  {
    id: 47,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Beginner',
    category: 'Object Modifiers',
    question: 'What is a readonly property?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A \`readonly\` property in an interface or type alias is a property that can only be assigned during initial object creation or inside a class constructor. Subsequent attempts to reassign the property will trigger a compile-time error. It enforces immutability at the compiler level, which is critical for state management libraries like Redux and Zustand. Note that \`readonly\` is shallow: if the property holds a reference to a mutable array or object, the inner elements can still be mutated unless typed with \`readonly\` recursively."`,
    code: `interface Config {
  readonly apiKey: string;
  readonly tags: string[]; // Shallow readonly!
}

const config: Config = {
  apiKey: "sk_live_123",
  tags: ["production"]
};

// config.apiKey = "new_key"; // ❌ Error: Cannot assign to 'apiKey' because it is a read-only property.
config.tags.push("us-east-1"); // ⚠️ Allowed! Array reference didn't change!

// For deep immutability:
// readonly tags: readonly string[];`,
    keyPoints: [
      'Prevents property reassignment after initialization.',
      'Shallow enforcement: reference is immutable, nested contents remain mutable.',
      'Purely compile-time: erased in emitted JavaScript (does not call Object.freeze).'
    ],
    followUps: [
      {
        q: 'Does TypeScript readonly call Object.freeze() at runtime?',
        a: 'No. readonly is completely erased during compilation. For true runtime immutability, you must explicitly call Object.freeze().'
      }
    ],
    tip: 'Always emphasize that readonly is compile-time only and shallow by default.'
  },
  {
    id: 48,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Intermediate',
    category: 'Index Signatures',
    question: 'What is an index signature?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"An index signature allows you to define the types for dynamic properties on an object when you don't know the exact property keys ahead of time, using syntax like \`[key: string]: number\`. The key type in an index signature can only be \`string\`, \`number\`, \`symbol\`, or a template literal pattern. An essential rule: all explicitly declared properties on the object must have types that are assignable to the index signature's return type."`,
    code: `interface CurrencyRates {
  baseCurrency: string; // Error if index signature doesn't accept string!
  [currencyCode: string]: string | number; // Index signature
}

const rates: CurrencyRates = {
  baseCurrency: "USD",
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.4
};`,
    keyPoints: [
      'Syntax: [key: KeyType]: ValueType.',
      'Keys can be string, number, symbol, or template literals.',
      'Explicit properties must conform to the index signature value type.',
      'Prefer Record<string, T> or Map for clean dictionary abstractions.'
    ],
    followUps: [
      {
        q: 'How does noUncheckedIndexedAccess affect index signatures?',
        a: 'With noUncheckedIndexedAccess: true, accessing rates["EUR"] evaluates to (string | number | undefined), forcing you to verify existence before usage.'
      }
    ],
    tip: 'Connecting index signatures with noUncheckedIndexedAccess proves senior-level production experience.'
  },
  {
    id: 49,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Intermediate',
    category: 'Interfaces',
    question: 'How do you define methods in an interface?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You can define methods in an interface using two distinct syntaxes: **Method Syntax** (\`calculate(amount: number): number\`) and **Property-with-Function Syntax** (\`calculate: (amount: number) => number\`). While they look similar, under \`strictFunctionTypes: true\`, TypeScript treats them differently: method syntax parameters are checked **bivariantly** (for historical reasons to allow array methods like \`push\`), whereas property syntax parameters are checked **contravariantly** (much stricter and safer). Senior teams prefer property syntax for function members to ensure full type safety."`,
    code: `interface PaymentService {
  // 1. Method syntax (bivariant parameter checking):
  process(amount: number): Promise<boolean>;

  // 2. Property syntax (contravariant parameter checking - strictly safer!):
  refund: (txId: string, reason?: string) => Promise<boolean>;
}`,
    keyPoints: [
      'Method syntax: name(params): ReturnType.',
      'Property syntax: name: (params) => ReturnType.',
      'Under strictFunctionTypes, property syntax enforces safer contravariant parameter checking.'
    ],
    followUps: [
      {
        q: 'Why are method syntax parameters bivariant?',
        a: 'To maintain compatibility with built-in JavaScript patterns like Array<T>, where methods like push(...items: T[]) need to accept subtypes in mutable arrays.'
      }
    ],
    tip: 'Mentioning method bivariance vs property contravariance will stun most interviewers.'
  },
  {
    id: 50,
    partId: 3,
    section: 'C. Interfaces and object-type modeling',
    difficulty: 'Senior',
    category: 'Structural Typing',
    question: 'What is structural typing?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Structural typing—often called 'duck typing' in dynamic languages—is a type-system philosophy where type compatibility and equivalence are based entirely on the **structure and shape of the data**, rather than explicit nominal declarations or inheritance hierarchies. In TypeScript, if type \`A\` possesses all the required properties and methods of type \`B\` with compatible types, \`A\` is assignable to \`B\`, even if \`A\` was declared under a completely different name, in another package, or as an anonymous object literal. This contrasts with nominal languages like Java or C#, where compatibility requires explicit class inheritance."`,
    code: `interface Point2D {
  x: number;
  y: number;
}

class Vector2D {
  constructor(public x: number, public y: number, public magnitude: number) {}
}

function plot(point: Point2D) {
  console.log(\`Plotting: \${point.x}, \${point.y}\`);
}

// Vector2D has 'x' and 'y', so it structurally satisfies Point2D!
const vec = new Vector2D(10, 20, 22.36);
plot(vec); // ✅ Valid! No 'implements Point2D' needed!`,
    keyPoints: [
      'Type compatibility is determined by shape (properties and methods), not declared name.',
      'If it walks like a duck and quacks like a duck, TypeScript treats it as a duck.',
      'Allows frictionless interop between independently authored libraries.',
      'Can be bypassed using Branded (Nominal) types when exact identity is required.'
    ],
    followUps: [
      {
        q: 'Why does direct object literal assignment fail with extra properties (excess property checking) if TypeScript is structurally typed?',
        a: 'Because excess property checking is a specialized compiler heuristic designed specifically for fresh object literals to catch typos. Once assigned to a variable, standard structural assignability applies.'
      }
    ],
    tip: 'This is the core conceptual foundation of TypeScript. Speak about it with confidence.'
  },
  {
    id: 51,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Beginner',
    category: 'Generics',
    question: 'What are generics in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Generics are TypeScript's mechanism for writing reusable, type-safe code that can operate over a variety of types rather than a single fixed type, while preserving exact type relationships. Think of generics as **type variables**: just as regular function parameters pass runtime values, generic parameters pass compile-time types (such as \`<T>\`). Generics eliminate code duplication while avoiding the type-safety hazards of \`any\`."`,
    code: `// Generic Identity Function:
function identity<T>(value: T): T {
  return value;
}

const str = identity("Hello"); // T is inferred as 'string', return is 'string'
const num = identity(42);      // T is inferred as 'number', return is 'number'`,
    keyPoints: [
      'Type variables (T, U, V) representing parameterized types.',
      'Preserves relationships between inputs, outputs, and properties.',
      'Can be applied to functions, interfaces, classes, and type aliases.'
    ],
    followUps: [
      {
        q: 'What is the naming convention for generic type parameters?',
        a: 'Single capital letters starting with T (T, U, V) for simple utilities, or descriptive names like TData, TError, TEntity in enterprise domain models.'
      }
    ],
    tip: 'Frame generics as "functions for types" in your mental model.'
  },
  {
    id: 52,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generics',
    question: 'Why use generics instead of `any`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Using \`any\` loses all type safety, autocompletion, and compiler verification: if you pass a string to a function returning \`any\`, the compiler has no idea that the returned value is a string, allowing you to call nonexistent methods. Generics, in contrast, **capture and preserve the exact type information**. If you pass a \`string\` into a generic function returning \`T\`, the compiler knows with 100% certainty that the output is a \`string\`, preserving full autocompletion and static verification downstream."`,
    code: `// With 'any' (Dangerous, loses type contract):
function getFirstAny(arr: any[]): any {
  return arr[0];
}
const itemA = getFirstAny(["apple", "banana"]); // itemA has type 'any'

// With Generics (Safe, preserves contract):
function getFirstGeneric<T>(arr: T[]): T | undefined {
  return arr[0];
}
const itemB = getFirstGeneric(["apple", "banana"]); // itemB has type 'string | undefined'`,
    keyPoints: [
      'any abandons type checking; generics preserve precise type identity.',
      'Generics maintain caller autocomplete and downstream refactoring safety.',
      'Generics catch invalid method invocations at compile time.'
    ],
    followUps: [
      {
        q: 'Does using generics impact the size or performance of emitted JavaScript?',
        a: 'No. Just like all types, generic parameters (<T>) are completely erased during compilation. The emitted JavaScript is identical to a standard unannotated JS function.'
      }
    ],
    tip: 'Directly contrast any losing autocomplete with generics preserving autocomplete.'
  },
  {
    id: 53,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generics',
    question: 'How do you create a generic function with multiple type parameters?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You create a generic function with multiple type parameters by listing comma-separated type variables inside the angle brackets, such as \`<T, U>\`. Each type parameter can independently capture the type of a different argument, and they can be combined into composite return types like tuples or merged objects."`,
    code: `// Merge two objects together with full type preservation:
function mergeObjects<T extends object, U extends object>(first: T, second: U): T & U {
  return { ...first, ...second };
}

const user = { id: "usr_1", name: "Sarah" };
const permissions = { canEdit: true, canDelete: false };

const fullProfile = mergeObjects(user, permissions);
// Inferred type: { id: string; name: string } & { canEdit: boolean; canDelete: boolean }
console.log(fullProfile.name, fullProfile.canEdit);`,
    keyPoints: [
      'Syntax: <T, U, V>.',
      'Each parameter captures distinct types independently.',
      'Can combine parameters in return types (T & U, [T, U]).'
    ],
    followUps: [
      {
        q: 'Can one generic type parameter depend on another, like <T, K extends keyof T>?',
        a: 'Yes! This is one of the most common generic patterns in TypeScript, ensuring that K must be a valid key of T.'
      }
    ],
    tip: 'Mentioning dependent generic parameters (<T, K extends keyof T>) leads naturally to the next question.'
  },
  {
    id: 54,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generic Constraints',
    question: 'What are generic constraints?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A generic constraint restricts the set of types that can be passed to a generic parameter, using the \`extends\` keyword—such as \`<T extends { length: number }>\`. Without a constraint, a generic \`T\` can be literally anything, so the compiler will not allow you to access properties like \`.length\` because numbers or booleans don't have a length. By constraining \`T\`, you guarantee to the compiler that whatever type is passed will at minimum possess those required properties."`,
    code: `interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log("Length is:", item.length); // Safe to access item.length!
  return item;
}

logLength("Hello world");   // Valid: string has length
logLength([1, 2, 3, 4]);     // Valid: array has length
logLength({ length: 10 });   // Valid: object has length
// logLength(12345);         // ❌ Error: Argument of type 'number' is not assignable to 'HasLength'.`,
    keyPoints: [
      'Syntax: <T extends Constraint>.',
      'Limits the types acceptable to the generic parameter.',
      'Unlocks safe property access inside the generic body.',
      'Can constrain to interfaces, primitives, unions, or other generic parameters.'
    ],
    followUps: [
      {
        q: 'Can a generic constraint extend a union type like T extends string | number?',
        a: 'Yes. This constrains T to either strings or numbers, while preserving the exact literal or primitive subtype.'
      }
    ],
    tip: 'Generic constraints are how you write reusable code that still interacts with specific object properties.'
  },
  {
    id: 55,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Senior',
    category: 'Generics & keyof',
    question: 'How do you use `keyof` with generics?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Using \`keyof\` with generics creates a dependent constraint using the syntax \`<T, K extends keyof T>\`. This guarantees that the second type parameter \`K\` can only be a valid property key of the first object type \`T\`. When combined with indexed access \`T[K]\`, it enables you to write functions that retrieve or modify object properties with complete compile-time type safety—preventing typos and guaranteeing the exact return type corresponding to that property."`,
    code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: "usr_101",
  username: "alex",
  age: 30,
  isActive: true
};

const username = getProperty(user, "username"); // Inferred type: string
const age = getProperty(user, "age");           // Inferred type: number
// getProperty(user, "email");                 // ❌ Error: Argument of type '"email"' is not assignable to parameter of type '"id" | "username" | "age" | "isActive"'.`,
    keyPoints: [
      'Syntax: <T, K extends keyof T>(obj: T, key: K): T[K].',
      'Eliminates property name typos at compile time.',
      'Dynamically calculates the exact return type T[K].'
    ],
    followUps: [
      {
        q: 'How would you write a type-safe setProperty function?',
        a: 'function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void { obj[key] = value; }'
      }
    ],
    tip: 'getProperty<T, K extends keyof T> is the quintessential TypeScript interview coding snippet.'
  },
  {
    id: 56,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generic Interfaces',
    question: 'What is a generic interface?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A generic interface is an interface parameterized by one or more type variables, such as \`interface ApiResponse<T>\`. It allows you to create flexible, reusable data contracts where the outer structure remains identical (like status codes, pagination, and error messages) while the inner payload type can vary across different API endpoints and microservices."`,
    code: `interface PaginatedResult<TItem> {
  data: TItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

interface Product {
  id: string;
  sku: string;
  price: number;
}

// Reusable typed pagination envelope:
const catalogResponse: PaginatedResult<Product> = {
  data: [{ id: "p1", sku: "SKU-99", price: 29.99 }],
  page: 1,
  pageSize: 20,
  totalCount: 1,
  hasNextPage: false
};`,
    keyPoints: [
      'Syntax: interface Name<T> { ... }.',
      'Defines standardized envelope patterns for APIs, events, and caching.',
      'Can provide default generic types: interface Name<T = DefaultType>.'
    ],
    followUps: [
      {
        q: 'Can a generic interface extend another generic interface?',
        a: 'Yes, like interface DetailedResult<T> extends PaginatedResult<T> { executionTimeMs: number; }.'
      }
    ],
    tip: 'Use PaginatedResult<T> as your go-to example—it mirrors production architectures.'
  },
  {
    id: 57,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generic Classes',
    question: 'What is a generic class?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A generic class has a type parameter list declared on its class header, such as \`class Queue<T>\`. This allows instances of the class to store and manipulate a specific type of data while ensuring type safety across its methods and properties. Note that static members of a class cannot reference the class type parameter, because static members exist on the constructor function itself, not on specific instances."`,
    code: `class InMemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();

  set(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }
}

const userCache = new InMemoryCache<{ id: string; email: string }>();
userCache.set("u1", { id: "u1", email: "alex@example.com" }, 60000);`,
    keyPoints: [
      'Syntax: class Name<T> { ... }.',
      'Methods and fields share the parameterized type T.',
      'Static members CANNOT use class generic parameters (they belong to constructor, not instance).'
    ],
    followUps: [
      {
        q: 'Why can static members not reference generic class parameters?',
        a: 'Because static members exist on the class object itself at runtime, which is a single shared constructor. Instance generic parameters are determined when individual instances are constructed.'
      }
    ],
    tip: 'Explaining why static members cannot use class type parameters proves deep runtime vs compile-time awareness.'
  },
  {
    id: 58,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Intermediate',
    category: 'Generic Defaults',
    question: 'What is a default generic type parameter?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A default generic type parameter provides a fallback type for a generic variable if the caller does not explicitly provide one and the compiler cannot infer it from arguments, using syntax like \`<T = string>\`. It behaves exactly like a default parameter in a function, making the generic parameter optional when consuming the type or interface."`,
    code: `// Default TData to unknown, and TMeta to standard pagination:
interface ApiResponse<TData = unknown, TMeta = { page: number }> {
  success: boolean;
  data: TData;
  meta: TMeta;
}

// Uses default TData (unknown) and default TMeta:
const basicResponse: ApiResponse = {
  success: true,
  data: "any payload",
  meta: { page: 1 }
};

// Overrides TData:
const userResponse: ApiResponse<{ name: string }> = {
  success: true,
  data: { name: "Aria" },
  meta: { page: 1 }
};`,
    keyPoints: [
      'Syntax: <T = DefaultType>.',
      'Makes explicit generic specification optional for consumers.',
      'Can reference preceding type parameters: <T, U = T[]>.'
    ],
    followUps: [
      {
        q: 'Can a required generic parameter follow a default generic parameter?',
        a: 'No, just like function parameters, all generic parameters with default types must follow required generic parameters in the type parameter list.'
      }
    ],
    tip: 'Compare generic defaults to standard function default arguments.'
  },
  {
    id: 59,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Senior',
    category: 'Generics Architecture',
    question: 'What are generic constraints versus default generic types?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Generic constraints and default generic types serve fundamentally different purposes in API design. A **constraint** (\`T extends Base\`) enforces an upper bound: it strictly limits what types a caller is *permitted* to pass, causing a compile error if the argument does not conform. A **default type** (\`T = Default\`) provides a fallback: it allows the caller to *omit* the generic argument, falling back to a convenient default without restricting callers from passing alternative types. You can also combine both: \`<T extends Base = DefaultBase>\`."`,
    table: {
      headers: ['Feature', 'Generic Constraint (T extends Constraint)', 'Default Generic Type (T = Default)'],
      rows: [
        ['Purpose', 'Enforce minimum structural requirements', 'Provide fallback type when omitted'],
        ['Enforcement', 'Strict: Rejects incompatible arguments', 'Permissive: Caller can provide any valid type'],
        ['Syntax', '\`<T extends object>\`', '\`<T = Record<string, any>>\`'],
        ['Combined Syntax', '\`<T extends object = Record<string, any>>\`', 'Both bound and default are enforced']
      ]
    },
    code: `// Combined Constraint & Default:
interface BaseEntity { id: string }

// T must extend BaseEntity; if omitted, defaults to BaseEntity itself:
class Repository<T extends BaseEntity = BaseEntity> {
  save(item: T): T {
    console.log("Saving entity:", item.id);
    return item;
  }
}`,
    keyPoints: [
      'Constraint (extends): Enforces mandatory subtyping rules.',
      'Default (=): Provides a fallback when the type is omitted.',
      'Both can be combined: <T extends Constraint = DefaultType>.'
    ],
    followUps: [
      {
        q: 'What error occurs if the default type violates the generic constraint, like <T extends number = string>?',
        a: 'The compiler throws an error at the declaration site: Type "string" does not satisfy the constraint "number".'
      }
    ],
    tip: 'Showing how to combine both (<T extends Base = Default>) is a great demonstration of mastery.'
  },
  {
    id: 60,
    partId: 4,
    section: 'D. Generics and reusable design',
    difficulty: 'Senior',
    category: 'API Design',
    question: 'What is a generic API response type you might use in a project?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In enterprise full-stack applications (like Chrona or LesHub), we use a generic discriminated union to represent API outcomes. Instead of mixing nullable data and error fields, the response model discriminates on a \`success: boolean\` flag. When \`success: true\`, the generic \`data: T\` payload is guaranteed to exist. When \`success: false\`, an \`error\` object containing code, message, and details is guaranteed to exist. This completely eliminates runtime null dereferencing across all frontend API consumption hooks."`,
    code: `// Production Enterprise Generic API Envelope:
export type ApiResponse<TData> =
  | {
      success: true;
      data: TData;
      timestamp: string;
      meta?: { page?: number; total?: number };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
      };
      timestamp: string;
    };

// Clean frontend consumption:
async function handleUserFetch() {
  const response: ApiResponse<{ id: string; name: string }> = await fetch("/api/user").then(r => r.json());

  if (response.success) {
    // TypeScript knows response.data exists!
    console.log("User:", response.data.name);
  } else {
    // TypeScript knows response.error exists!
    console.error("Fetch failed:", response.error.message);
  }
}`,
    keyPoints: [
      'Combines generics with discriminated unions.',
      'Eliminates optional data and error fields.',
      'Guarantees data availability inside success branches.'
    ],
    followUps: [
      {
        q: 'How does this pattern simplify React TanStack Query or SWR hooks?',
        a: 'Query functions can directly return response.data on success, or throw response.error on failure, providing strongly typed data and error states to custom hooks.'
      }
    ],
    tip: 'Directly reference Chrona or LesHub when describing this pattern—it anchors your answer in real work.'
  }
];

module.exports = batch2;
console.log(`Batch 2 authored with ${batch2.length} questions.`);
