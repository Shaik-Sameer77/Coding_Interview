// scratch/ts_q_batch_4.cjs
// Batch 4: Q96 to Q135 — Modules, Async, React 19, NestJS, Node.js, Compiler, Variance, Branded Types
// Fully adhering to AGENTS.md standards: Spoken Pitch, Compiler vs Runtime, Follow-ups, and Key Points.

const batch4 = [
  {
    id: 96,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Beginner',
    category: 'Modules',
    question: 'What are modules in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, any file containing a top-level \`import\` or \`export\` statement is treated as a **module**, with its own isolated scope. Variables, functions, and interfaces declared inside a module are private unless explicitly exported. If a file contains no imports or exports, TypeScript treats it as a script in the global scope, which can cause naming collisions across files. Modern TypeScript adheres to ES module standards (\`import\`/\`export\`) and compiles to CommonJS or ESNext based on the \`module\` setting in \`tsconfig.json\`."`,
    code: `// auth.ts (Module scope):
export interface AuthToken {
  jwt: string;
  expiresIn: number;
}

export function generateToken(): AuthToken {
  return { jwt: "xyz", expiresIn: 3600 };
}`
  },
  {
    id: 97,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Intermediate',
    category: 'Modules',
    question: 'What is the difference between a type-only import and a regular import?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A regular import (\`import { User } from './user'\`) imports an identifier that may exist at runtime. If the imported item is only a type, TypeScript's compiler attempts to elide it, but bundlers or Babel running in \`isolatedModules\` mode might struggle, occasionally emitting empty runtime imports that cause circular dependency errors. A **type-only import** (\`import type { User } from './user'\`) guarantees to both TypeScript and downlevel transpilers that the symbol is **100% erased** from emitted JavaScript, completely avoiding circular runtime dependencies."`,
    code: `// Guarantees zero emitted JavaScript code:
import type { UserProfile, OrderRecord } from "./models";

// Inline type imports (TS 4.5+):
import { processOrder, type OrderOptions } from "./orderService";`
  },
  {
    id: 98,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Beginner',
    category: 'Async Programming',
    question: 'What is a Promise in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A \`Promise\` in TypeScript represents an asynchronous operation that will eventually produce a value of type \`T\` or reject with an error, typed as the generic interface \`Promise<T>\`. For example, \`Promise<User>\` guarantees that upon resolution, the value passed to \`.then()\` or returned by \`await\` is strictly of type \`User\`. Note that Promise rejections are untyped in TypeScript—a rejected Promise always yields \`unknown\` (or \`any\`) in catch blocks."`,
    code: `function fetchUserData(id: string): Promise<{ id: string; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Aria" }), 100);
  });
}`
  },
  {
    id: 99,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Beginner',
    category: 'Async Programming',
    question: 'How do you type an `async` function?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, an \`async\` function **must always return a \`Promise<T>\`**. Even if you write \`return 42\` inside an \`async\` function body, JavaScript automatically wraps that value in a Promise at runtime. Therefore, TypeScript enforces that the return type annotation must be \`Promise<number>\`, never plain \`number\`. If an async function returns no value, its return type is \`Promise<void>\`."`,
    code: `// Valid: Return type must be Promise<number>, not number!
async function calculateDiscount(price: number): Promise<number> {
  const rate = await fetchDiscountRate();
  return price * rate;
}

async function logAction(action: string): Promise<void> {
  await sendTelemetry(action);
}`
  },
  {
    id: 100,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Senior',
    category: 'Error Handling',
    question: 'How do you handle errors in TypeScript?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In modern TypeScript with strict mode enabled, the error caught in a \`catch (err: unknown)\` block is strictly typed as \`unknown\`. Because JavaScript permits throwing any arbitrary value (\`throw 'network failed'\`, \`throw 500\`), you cannot directly access \`err.message\`. You must narrow \`err\` using \`if (err instanceof Error)\`. In enterprise architectures, we prefer the **Result pattern** (\`type Result<T, E> = { ok: true; data: T } | { ok: false; error: E }\`), turning unpredictable thrown runtime exceptions into explicit, strongly typed union contracts."`,
    code: `// Standard Narrowing:
try {
  executeOperation();
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error("Unknown error thrown:", String(err));
  }
}`
  },
  {
    id: 101,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Intermediate',
    category: 'API Design',
    question: 'What is a type-safe API response model?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A type-safe API response model is a generic discriminated union representing network outcomes. Instead of combining nullable data with nullable errors, the model splits into distinct variants based on a \`success: boolean\` or \`status\` property. When \`success: true\`, the generic \`data: T\` payload is guaranteed. When \`success: false\`, the \`error\` object is guaranteed. This forces frontend consuming code to verify success before accessing data, preventing runtime crashes."`,
    code: `type ApiResponse<T> =
  | { success: true; data: T; timestamp: number }
  | { success: false; error: { code: string; message: string }; timestamp: number };

function handleResponse<T>(res: ApiResponse<T>) {
  if (res.success) {
    console.log(res.data); // data is guaranteed
  } else {
    console.error(res.error.message); // error is guaranteed
  }
}`
  },
  {
    id: 102,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Beginner',
    category: 'Functions',
    question: 'How do you type a callback?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You type a callback using a function type expression: \`(param: ParamType) => ReturnType\`. For callbacks that perform side effects where the caller does not care about the returned value, use \`void\` as the return type (such as \`(event: ClickEvent) => void\`). If the callback is optional, use \`?:\` after the parameter name."`,
    code: `interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSuccess?: (timestamp: number) => void; // Optional callback
}`
  },
  {
    id: 103,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Beginner',
    category: 'Async Programming',
    question: 'How do you type a Promise that returns no useful value?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You type it as \`Promise<void>\`. This indicates that the asynchronous operation completes successfully with an \`undefined\` resolved value, commonly used for fire-and-forget background jobs, file uploads, or database write operations."`,
    code: `async function deleteUserSession(sessionId: string): Promise<void> {
  await db.sessions.delete(sessionId);
}`
  },
  {
    id: 104,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Intermediate',
    category: 'Functions',
    question: 'How do you type a function that accepts multiple callback types?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You can type it either using a union of function types (\`callback: ((data: string) => void) | ((error: Error) => void)\`) or by using function overloads. Function overloads are generally preferred when the callback signature depends directly on an earlier argument, such as an event name in an EventEmitter pattern."`,
    code: `type DataCallback = (data: string) => void;
type ErrorCallback = (err: Error) => void;

function addListener(event: "data", cb: DataCallback): void;
function addListener(event: "error", cb: ErrorCallback): void;
function addListener(event: string, cb: (...args: any[]) => void): void {
  // Implementation
}`
  },
  {
    id: 105,
    partId: 8,
    section: 'H. Modules, async programming, and errors',
    difficulty: 'Intermediate',
    category: 'Compiler & Runtime',
    question: 'What is the difference between compile-time errors and runtime errors?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A compile-time error is detected by the TypeScript compiler (\`tsc\`) or IDE during development before any code is executed—such as a type mismatch, typo, or missing property. A runtime error occurs during active code execution in Node.js or the browser—such as a network timeout, out-of-memory crash, or corrupted database payload. TypeScript eliminates compile-time errors, but runtime errors at external boundaries still require defensive runtime handling."`,
    code: `// Compile-time error: Caught before running
// const n: number = "hello"; // ❌ Compile error

// Runtime error: Compiles cleanly, crashes at runtime without Zod
const parsed = JSON.parse('{"status": 500}') as { user: { name: string } };
// parsed.user.name -> 💥 Runtime TypeError: Cannot read properties of undefined`
  },
  {
    id: 106,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Beginner',
    category: 'React Integration',
    question: 'How do you type React component props?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In modern React (React 18 & 19), you type component props by defining an interface or type alias representing the prop object, and typing the function's parameter directly: \`function Button({ label, onClick }: ButtonProps)\`. We avoid the legacy \`React.FC\` (FunctionComponent) type because it unnecessarily complicated generic components, added implicit children in React 17, and offered no practical benefit over direct prop annotations."`,
    code: `interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick: () => void;
}

export function Button({ label, variant = "primary", disabled = false, onClick }: ButtonProps) {
  return (
    <button className={\`btn-\${variant}\`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}`
  },
  {
    id: 107,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Beginner',
    category: 'React Integration',
    question: 'How do you type `useState` in React?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"If the initial state provides an unambiguous type, TypeScript automatically infers the state type (e.g. \`useState(0)\` infers \`number\`). However, when state is initialized as \`null\` or \`undefined\` before data is loaded from an API, you must explicitly pass a generic argument: \`useState<User | null>(null)\`. This ensures that \`setUser\` accepts a \`User\` and that the compiler forces you to check for \`null\` before dereferencing properties."`,
    code: `interface UserProfile { id: string; name: string; }

// 1. Inferred from initial value:
const [count, setCount] = useState(0); // number

// 2. Explicit generic parameter for async/nullable state:
const [user, setUser] = useState<UserProfile | null>(null); // UserProfile | null`
  },
  {
    id: 108,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'React Integration',
    question: 'How do you type React event handlers?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"React provides synthetic event types parameterized by the DOM element triggering the event, located in the \`React\` namespace: \`React.MouseEvent<HTMLButtonElement>\`, \`React.ChangeEvent<HTMLInputElement>\`, and \`React.FormEvent<HTMLFormElement>\`. You can type the handler function itself (\`React.ChangeEventHandler<HTMLInputElement>\`) or type the \`event\` parameter inside the handler."`,
    code: `export function SearchInput() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value:", e.target.value);
  };

  return <input type="text" onChange={handleChange} />;
}`
  },
  {
    id: 109,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'React Integration',
    question: 'How do you type a React `useRef`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`useRef\` has two distinct typing modes in React:
1. **DOM Ref (Readonly current)**: Initialized with \`null\` and a DOM generic type: \`useRef<HTMLInputElement>(null)\`. The compiler understands this ref will be attached to JSX, and types \`.current\` as \`HTMLInputElement | null\`.
2. **Mutable Value Ref**: Initialized without \`null\`: \`useRef<number>(0)\`. Returns a mutable \`MutableRefObject\` where you can freely assign \`ref.current = 5\`."`,
    code: `// DOM Ref:
const inputRef = useRef<HTMLInputElement>(null);
const focusInput = () => {
  inputRef.current?.focus(); // Type safe
};

// Mutable instance variable ref (e.g. interval ID):
const timerRef = useRef<number | null>(null);
timerRef.current = window.setInterval(() => {}, 1000);`
  },
  {
    id: 110,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Beginner',
    category: 'React Integration',
    question: 'How do you type children in React?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You should always type the \`children\` prop as \`React.ReactNode\`. \`React.ReactNode\` is the most permissive and accurate type for JSX children, encompassing strings, numbers, booleans, \`null\`, \`undefined\`, React elements, and arrays of nodes. Avoid using \`JSX.Element\` for children because it forbids primitive text strings and fragments."`,
    code: `import React, { ReactNode } from "react";

interface ContainerProps {
  title: string;
  children: ReactNode; // ✅ Best practice
}

export function Container({ title, children }: ContainerProps) {
  return (
    <div className="container">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}`
  },
  {
    id: 111,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'React Integration',
    question: 'How do you type a React form submission handler?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Type the form submission event parameter as \`React.FormEvent<HTMLFormElement>\`. This provides type safety for calling \`e.preventDefault()\` and accessing standard form attributes without compiler warnings."`,
    code: `const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log("Email:", formData.get("email"));
};`
  },
  {
    id: 112,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Senior',
    category: 'React Integration',
    question: 'How do you type a reusable generic React component?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You create a generic React component by declaring a generic type parameter on the component function signature before the props parameter: \`function List<T>({ items, renderItem }: ListProps<T>)\`. In \`.tsx\` arrow function syntax, add a trailing comma (\`<T,>\`) to prevent the JSX parser from misinterpreting the generic bracket as an unclosed HTML tag."`,
    code: `interface TableProps<T> {
  rows: T[];
  renderRow: (item: T) => React.ReactNode;
}

// Function declaration syntax:
export function Table<T>({ rows, renderRow }: TableProps<T>) {
  return <div>{rows.map(renderRow)}</div>;
}

// Arrow function syntax (needs trailing comma in TSX):
const Grid = <T,>({ items }: { items: T[] }) => <div>{items.length}</div>;`
  },
  {
    id: 113,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'Backend Integration',
    question: 'Why is TypeScript useful in Node.js backend development?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"TypeScript brings critical enterprise reliability to Node.js backend services. In backend engineering, runtime exceptions can crash entire worker processes or corrupt transaction states. TypeScript enforces compile-time contracts across database repositories, middleware pipelines, and third-party SDKs (Stripe, AWS). Furthermore, it allows full-stack TypeScript teams to share Data Transfer Objects (DTOs) and validation schemas between the NestJS backend and the React frontend in a monorepo, completely eliminating API drift."`,
    code: `// Shared DTO between backend and frontend:
export interface CreateOrderDto {
  itemSlug: string;
  quantity: number;
  paymentGateway: "STRIPE" | "RAZORPAY";
}`
  },
  {
    id: 114,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'Backend Integration',
    question: 'How do you type an Express request handler?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In Express with \`@types/express\`, you type handlers using the generic \`Request\` and \`Response\` interfaces: \`Request<Params, ResBody, ReqBody, ReqQuery>\`. Specifying these generics provides compile-time autocompletion and safety for \`req.params\`, \`req.body\`, and \`res.json()\`."`,
    code: `import { Request, Response } from "express";

interface Params { userId: string; }
interface Body { email: string; }
interface ResData { success: boolean; }

export function updateUserHandler(
  req: Request<Params, ResData, Body>,
  res: Response<ResData>
) {
  const { userId } = req.params; // string
  const { email } = req.body;     // string
  res.json({ success: true });
}`
  },
  {
    id: 115,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'NestJS Integration',
    question: 'What is the role of DTOs in NestJS?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In NestJS, a Data Transfer Object (DTO) defines the schema and contract for data sent across the network over HTTP or WebSocket boundaries. Combined with \`class-validator\` decorators and NestJS's global \`ValidationPipe\`, DTOs provide **both compile-time TypeScript type checking and automatic runtime validation and sanitization**, rejecting invalid or malicious incoming payloads before they ever reach the controller logic."`,
    code: `import { IsString, IsEmail, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}`
  },
  {
    id: 116,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Senior',
    category: 'NestJS Integration',
    question: 'What is the difference between a TypeScript interface and a NestJS DTO class?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The critical difference is that **TypeScript interfaces are completely erased during compilation**, leaving zero runtime artifacts. Classes, however, are part of the ES6 specification and emit real JavaScript constructor functions that exist at runtime. NestJS relies on runtime metadata reflection (\`reflect-metadata\`) to inspect incoming request types and apply \`class-validator\` decorators. If you declare a DTO as an \`interface\`, NestJS's \`ValidationPipe\` cannot inspect it at runtime and validation fails silently. DTOs in NestJS must always be declared as **Classes**."`,
    code: `// ❌ BROKEN in NestJS: Interface has no runtime existence
// export interface CreatePostDto { title: string; }

// ✅ CORRECT: Class exists at runtime for validation pipes
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title!: string;
}`
  },
  {
    id: 117,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'NestJS Integration',
    question: 'How do you type a NestJS service dependency?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In NestJS, service dependencies are injected via constructor parameter properties typed with the service class itself. Because the service class exists at runtime, NestJS uses TypeScript's \`emitDecoratorMetadata: true\` setting to inspect the constructor parameter type and automatically resolve and inject the singleton instance from the IoC container."`,
    code: `import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  findAll() { return ["User1", "User2"]; }
}

@Injectable()
export class OrdersService {
  constructor(private readonly usersService: UsersService) {} // Type-safe Dependency Injection
}`
  },
  {
    id: 118,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'Databases',
    question: 'How do you model a database entity or repository result?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"You model database entities by clearly distinguishing between required columns, nullable columns (\`string | null\` for SQL NULL), and auto-generated fields (\`id\`, \`createdAt\`). For database queries, use generic repository interfaces parameterized by the entity type, and create dedicated \`CreateDto\` (omitting auto-generated fields) and \`UpdateDto\` (using \`Partial\`) types."`,
    code: `interface UserEntity {
  id: string;                      // PRIMARY KEY
  email: string;                  // UNIQUE NOT NULL
  avatarUrl: string | null;       // NULLABLE in SQL
  createdAt: Date;                // DEFAULT NOW()
}

type CreateUserEntity = Omit<UserEntity, "id" | "createdAt">;
type UpdateUserEntity = Partial<CreateUserEntity>;`
  },
  {
    id: 119,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Senior',
    category: 'Backend Security',
    question: 'What are environment variable typing pitfalls in Node.js?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In standard Node.js, \`process.env\` is typed as \`NodeJS.ProcessEnv\`, where every property is \`string | undefined\`. The primary pitfalls are: 1) Assuming required variables exist without checking, causing silent runtime failures; 2) Forgetting that all environment variables are strings (e.g. \`PORT='8080'\`, \`IS_PROD='false'\`), where checking \`if (process.env.IS_PROD)\` evaluates to \`true\`! Senior architectures solve this by validating and parsing \`process.env\` at startup using a Zod schema or NestJS \`ConfigModule\` with Joi."`,
    code: `// ✅ Senior Solution: Parse env with Zod at startup
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url()
});

export const env = EnvSchema.parse(process.env); // Throws immediately on startup if missing!`
  },
  {
    id: 120,
    partId: 9,
    section: 'I. React, Node.js, and NestJS integration',
    difficulty: 'Intermediate',
    category: 'Error Handling',
    question: 'How does TypeScript help with service-layer error handling?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"TypeScript allows service layers to use the Result Monad pattern or custom typed Domain Exceptions instead of generic untyped \`throw\`. By returning a discriminated union like \`Result<Order, InsufficientFundsError | ItemNotFoundError>\`, the compiler forces controllers to exhaustively handle each specific business failure scenario before attempting to access the order."`,
    code: `type ServiceResult<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CheckoutError = "OUT_OF_STOCK" | "PAYMENT_DECLINED";

function checkout(cartId: string): ServiceResult<{ orderId: string }, CheckoutError> {
  return { ok: false, error: "OUT_OF_STOCK" };
}`
  },
  {
    id: 121,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Beginner',
    category: 'Compiler & Config',
    question: 'What is `tsconfig.json`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`tsconfig.json\` is the root configuration file for a TypeScript project. It marks the directory as the project root and specifies the compiler options (\`compilerOptions\`) required to compile the project—such as target ECMAScript version, module system, strictness flags, file inclusions, path aliases, and declaration generation."`,
    code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}`
  },
  {
    id: 122,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Compiler & Config',
    question: 'What is the difference between `target` and `lib` in tsconfig?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`target\` dictates **what version of JavaScript the compiler emits** (e.g. \`ES2015\` down-levels arrow functions and classes, while \`ES2022\` preserves modern syntax). \`lib\` specifies **which ambient type declaration files are included** to describe the environment (e.g. \`DOM\` includes \`window\` and \`document\`, \`ES2022\` includes modern Array methods like \`at()\`). If \`lib\` is omitted, it defaults based on the \`target\` setting."`,
    code: `// tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2022", // Code transformation target
    "lib": ["ES2022", "DOM", "DOM.Iterable"] // Environment type definitions
  }
}`
  },
  {
    id: 123,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Beginner',
    category: 'Compiler & Runtime',
    question: 'What is the difference between `tsc` and a runtime such as Node.js?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"\`tsc\` is the TypeScript compiler: it performs static analysis, type checking, and transpiles TypeScript code into JavaScript. It does not execute your application code. Node.js is a JavaScript runtime built on V8 that actually executes the emitted JavaScript. You compile with \`tsc\`, and you run with Node.js."`,
    code: `// Terminal command sequence:
// 1. tsc --noEmit     -> Checks types, emits nothing
// 2. tsc              -> Compiles src/ to dist/
// 3. node dist/app.js -> Executes the emitted JavaScript in Node.js runtime`
  },
  {
    id: 124,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Declaration Files',
    question: 'What is a declaration file (`.d.ts`)?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A declaration file (\`.d.ts\`) contains **only type declarations and contracts**, with zero executable JavaScript code. It acts as a typed header file for JavaScript code, describing the shape of modules, globals, and third-party libraries (like those in \`@types/node\` or \`@types/react\`). Declaration files are generated automatically using the \`declaration: true\` compiler option."`,
    code: `// mathUtils.d.ts (Pure types):
export declare function add(a: number, b: number): number;
export declare const PI: number;`
  },
  {
    id: 125,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Declaration Files',
    question: 'What is the `declare` keyword?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"The \`declare\` keyword introduces ambient declarations, telling the TypeScript compiler: 'This identifier exists in the global runtime environment (e.g. from an external CDN script or injected global variable), so do not flag it as undefined and do not emit any JavaScript for this statement.'"`,
    code: `// Declare global analytics SDK injected by HTML script tag:
declare const Stripe: (publishableKey: string) => any;

// Safe to call in TS code without compiler errors:
const stripe = Stripe("pk_live_123");`
  },
  {
    id: 126,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Senior',
    category: 'Module Augmentation',
    question: 'What is module augmentation?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Module augmentation is a TypeScript feature that allows you to extend existing module declarations from external packages without modifying their source files. Using \`declare module 'package-name'\`, you can append new properties or methods to existing interfaces through declaration merging. This is universally used to attach custom user or tenant data to Express \`Request\` or extend session types in NextAuth."`,
    code: `// Augmenting Express Request:
import "express";

declare module "express" {
  export interface Request {
    tenantId: string;
    user?: { id: string; role: string };
  }
}`
  },
  {
    id: 127,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Validation',
    question: 'What is the difference between compile-time validation and runtime validation?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Compile-time validation occurs during development via the TypeScript compiler, verifying that internal developer code adheres to defined types. It costs zero runtime CPU because types are erased. Runtime validation occurs while the app is running in production, using libraries like Zod or class-validator to inspect untrusted incoming JSON from network requests, validating types, lengths, and formats. Both are required for production defense."`,
    code: `// Compile-time: Types erased in production
interface Input { email: string }

// Runtime: Actually validates data in production memory
import { z } from "zod";
const InputSchema = z.object({ email: z.string().email() });`
  },
  {
    id: 128,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Type Safety',
    question: 'Why is `JSON.parse()` a type-safety concern?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In the standard TypeScript library, \`JSON.parse()\` returns \`any\`. Because \`any\` disables all type checking and silently contaminates any variable it touches, developers often write \`const user = JSON.parse(str) as User\`. If the JSON payload is malformed or missing fields, the compiler raises no alarms, but the application crashes at runtime with a \`TypeError\` upon dereferencing."`,
    code: `// ❌ Unsafe JSON.parse returning 'any':
const data = JSON.parse('{"id": 1}'); // data is 'any'
// console.log(data.user.name); // Compiles! 💥 Crashes at runtime!

// ✅ Safe approach: Parse with Zod
const UserSchema = z.object({ id: z.number(), name: z.string() });
const safeUser = UserSchema.parse(JSON.parse('{"id": 1, "name": "Aria"}'));`
  },
  {
    id: 129,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Immutability',
    question: 'What is the difference between shallow and deep immutability?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Shallow immutability (like \`readonly T\` or \`Object.freeze\`) only locks the immediate top-level properties of an object. If a property references another nested object or array, those nested contents can still be freely modified. Deep immutability recursively applies \`readonly\` down the entire object tree, guaranteeing that nested properties and arrays cannot be mutated."`,
    code: `// Shallow Readonly:
interface Shallow { readonly nested: { count: number } }
const s: Shallow = { nested: { count: 0 } };
// s.nested = { count: 1 }; // ❌ Error
s.nested.count = 1; // ⚠️ Allowed! Shallow readonly does not protect nested objects!

// Deep Readonly (Recursive type):
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};`
  },
  {
    id: 130,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Functions & Overloads',
    question: 'What is function overloading?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Function overloading allows a function to support multiple different parameter-to-return-type relationships. You write two or more overload signatures describing the permitted calling patterns, followed by a single implementation signature that handles all cases. Callers can only invoke the overload signatures; the implementation signature is invisible externally."`,
    code: `function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}`
  },
  {
    id: 131,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Senior',
    category: 'Functions & Overloads',
    question: 'What is the difference between overloads and union parameters?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Union parameters (\`fn(x: string | number)\`) treat arguments independently: \`x\` can be string or number, but the return type is usually fixed or a loose union. Function overloads are required when the **return type depends directly on the argument type** (e.g. passing a string returns a string, passing a number returns a number). However, if an operation can be cleanly handled with generics or union parameters, overloads should be avoided as they add verbosity."`,
    code: `// Overload: Return type tied to input type
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number): string | number {
  return typeof input === "string" ? input.trim() : input * 10;
}`
  },
  {
    id: 132,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Senior',
    category: 'Branded Types',
    question: 'What is a branded type?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"A branded type (or nominal type) is an advanced TypeScript pattern that simulates nominal typing under TypeScript's structural type system. By intersecting a primitive like \`string\` with a phantom object containing a unique brand symbol (\`string & { readonly __brand: 'UserId' }\`), TypeScript treats it as distinct from any plain string. This prevents critical bugs like accidentally passing an \`OrderId\` into a function expecting a \`UserId\`."`,
    code: `type Brand<K, T> = K & { readonly __brand: T };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function shipOrder(userId: UserId, orderId: OrderId) {}

const uid = "usr_1" as UserId;
const oid = "ord_9" as OrderId;

shipOrder(uid, oid); // Valid!
// shipOrder(oid, uid); // ❌ Error: Type 'OrderId' is not assignable to type 'UserId'.`
  },
  {
    id: 133,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Intermediate',
    category: 'Basic Types',
    question: 'What is the difference between `object` and `{}`?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"In TypeScript, \`object\` (lowercase) represents any non-primitive value (anything where \`typeof x !== 'number'\`, \`'string'\`, \`'boolean'\`, etc.)—including plain objects, arrays, and functions. In contrast, \`{}\` (the empty object type) represents **any non-nullish value**! In TypeScript, primitive numbers, strings, and booleans are assignable to \`{}\` because they possess Object prototype methods via autoboxing. Only \`null\` and \`undefined\` cannot be assigned to \`{}\`."`,
    code: `let nonPrimitive: object;
nonPrimitive = { a: 1 }; // Valid
nonPrimitive = [1, 2];   // Valid
// nonPrimitive = "text"; // ❌ Error: Type 'string' is not assignable to 'object'.

let nonNullish: {};
nonNullish = "text";     // ⚠️ Valid! Strings box into objects!
// nonNullish = null;    // ❌ Error: Type 'null' is not assignable to '{}'.`
  },
  {
    id: 134,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Senior',
    category: 'Variance',
    question: 'What are variance and function type compatibility?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"Variance describes how subtyping of complex types relates to subtyping of their component types. Return types are **covariant** (subtypes remain subtypes). Function parameters are **contravariant** under \`strictFunctionTypes: true\` (subtyping direction is reversed). For example, a callback expecting \`(dog: Dog) => void\` can safely accept a handler that takes \`(animal: Animal) => void\`, because any function capable of handling any Animal can safely handle a Dog. But the reverse is unsafe and rejected by the compiler."`,
    code: `class Animal { name = "Animal"; }
class Dog extends Animal { bark() {} }

let handleAnimal = (a: Animal) => { console.log(a.name); };
let handleDog = (d: Dog) => { d.bark(); };

// Contravariance in action under strictFunctionTypes:
handleDog = handleAnimal; // ✅ Valid! handleAnimal handles any Animal, including Dogs.
// handleAnimal = handleDog; // ❌ Compile Error! Unsafe: handleDog expects bark() on general Animals.`
  },
  {
    id: 135,
    partId: 10,
    section: 'J. Compiler, configuration, and runtime safety',
    difficulty: 'Senior',
    category: 'satisfies Operator',
    question: 'What is the difference between `satisfies` and explicit annotation for configuration objects?',
    answer: `**Spoken Pitch (30–60 Seconds):**
"When you use an explicit type annotation on a configuration object (\`const config: Config = { ... }\`), TypeScript upcasts and widens all properties to the broader declared types, causing you to lose specific literal string keys, exact array lengths, and union narrowing. When you use the \`satisfies\` operator (\`const config = { ... } satisfies Config\`), the compiler validates that the object conforms strictly to the \`Config\` contract, but **retains the exact, narrow inferred types** of every property, providing flawless autocompletion and type-safe navigation."`,
    code: `type RouteConfig = Record<string, { path: string; exact?: boolean }>;

// With 'satisfies': Exact paths and keys preserved
const routes = {
  home: { path: "/" },
  checkout: { path: "/checkout", exact: true }
} satisfies RouteConfig;

// Exact key 'home' and property 'path' are known:
console.log(routes.home.path); // Typesafe! Autocompletes "home" and "checkout".`
  }
];

module.exports = batch4;
console.log(`Batch 4 authored with ${batch4.length} questions.`);
