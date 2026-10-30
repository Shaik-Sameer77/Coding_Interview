# AGENTS.md — Master Technical Curriculum & Interview System Governance

> **Role & Purpose**: This document is the **central, non-negotiable instruction set** governing all agent actions within the `React_Machine_Coding` repository and the `senior-machine-coding-suite` application. Any agent creating, auditing, modifying, or validating technical notes, interview questions, coding algorithms, system design architectures, or UI components **MUST strictly adhere to these standards**.

---

## 1. Project Architecture & Modification Rules

### A. Core Tech Stack & Runtime Environment
- **Runtime & Bundler**: Vite 8 with native ES Modules (ESM) and fast HMR.
- **Frontend Framework**: React 19.3+ with React-DOM 19.3+.
- **Language**: JavaScript (ES2024+) with strict TypeScript annotations where typed interfaces/contracts are demonstrated.
- **Styling**: Vanilla CSS tokens in `index.css` paired with inline reactive design systems. Zero Tailwind dependencies unless explicitly requested by the user.
- **Icons & Diagrams**: `lucide-react` for UI icons, `prismjs` for syntax highlighting, and `mermaid` for live sequence/architecture diagrams.

### B. Preservation & Integrity Constraints
1. **Never Rebuild Blindly**: Always audit and understand the existing component hierarchy, data registries, and localStorage keys before making modifications.
2. **Preserve User Progress**: Retain all localStorage state keys (`senior_react_solved`, `senior_node_solved`, `js_mastered_interview_ids`, `js_revision_checklist`, `ts_study_sessions`).
3. **Single Source of Truth**: Data must be authored in its respective track registry (`src/react/data/`, `src/node/data/`, `src/javascript/data/`, `src/typescript/data/`). Never create duplicate, disconnected data models.
4. **Zero Broken Typography**: Never display raw markdown tokens like `**bold**`, unparsed backticks, or misaligned headings. Always route markdown prose through `FormattedMarkdownText.jsx`.
5. **No Placeholders**: Never leave `TODO`, `// implement later`, `Coming Soon...`, or pseudo-code presented as runnable code.

---

## 2. Universal Technical Notes Standard (The 9-Section Blueprint)

Every technology topic and subtopic authored in notes must follow this comprehensive, unabridged 9-part structure:

### Section 1: Topic Overview & Mental Model
- Clear definition in plain English.
- Why the concept exists and the historical or architectural problem it solves.
- Where it is used in real-world production software.
- Required prerequisites before studying this topic.
- An intuitive mental model or physical analogy.

### Section 2: Fundamentals & Syntax
- Core syntax rules, parameters, return types, and constraints.
- Step-by-step execution breakdown.
- Small, standalone, runnable example with exact console/rendered output.

### Section 3: Internal Working & Engine Mechanics
- Step-by-step internal operational flow.
- Memory management (Stack vs Heap, reference allocation, garbage collection impact).
- Runtime/Engine specifics (V8 TurboFan JIT, Libuv event loop phase, React Fiber reconciliation, OS non-blocking kernel multiplexing `epoll`/`kqueue`/`IOCP`).
- Distinguish between a simplified teaching model and the actual engine implementation.

### Section 4: Practical Implementation
- Production-grade, runnable code with required imports and realistic data models.
- Complete line-by-line explanation of critical logic blocks.
- Expected behavior under normal operations.

### Section 5: Variations, Comparisons & Trade-offs
- Side-by-side comparison tables against related concepts (e.g. `var` vs `let` vs `const`, Zustand vs Redux Toolkit, CJS vs ESM, SQL joins vs subqueries).
- Architectural trade-offs: Memory vs Speed, Simplicity vs Scalability.
- Clear guidance on when to choose which option (and when neither is appropriate).

### Section 6: Advanced Concepts & Edge Cases
- Concurrency, race conditions, memory leaks, security attack vectors (XSS, timing attacks, prototype pollution).
- Framework and version-specific nuances (React 18 vs 19 automatic batching, Node 20+ native test runner / ESM top-level await).

### Section 7: Common Mistakes & Debugging Playbook
- Beginner traps, interview misconceptions, and frequent production bugs.
- How to reproduce the error, why the runtime throws it, and how to fix it with clean code.

### Section 8: Real-World Application Context
- Concrete production examples inspired by enterprise systems (e.g. Chrona productivity timer, LesHub B2B marketplace, Stripe payment gateway, idempotent webhooks).
- Clearly label hypothetical examples as hypothetical; never fabricate production claims.

### Section 9: Revision Summary & Key Takeaways
- 3–5 bulleted rules to remember forever.
- Critical syntax cheat-sheet.
- Rapid-fire revision questions with answers.

---

## 3. Universal Interview Question & Answer Standard

Interview questions must not be a random list of trivia definitions. They must follow a deliberate progression across **12 Core Categories**:

1. *Fundamentals & Core Definitions*
2. *Purpose, Motivation & Problem Solved*
3. *Internal Mechanics & Runtime Flow*
4. *Output Prediction & Code Reasoning*
5. *Differences, Distinctions & Trade-Offs*
6. *Practical Implementation & Architecture*
7. *Debugging, Failure Scenarios & Error Recovery*
8. *Performance Optimization & Memory Hygiene*
9. *Security Hardening & Reliability*
10. *High-Scale Architecture & Data Modeling*
11. *Real-World Production Incidents & Edge Cases*
12. *Senior-Level Engineering Decision-Making*

### Required Answer Anatomy for Substantial Questions
Every question must contain:
1. **Direct Pitch (30–90 Seconds)**: A crisp, professional, spoken-ready answer that directly answers the question without rambling.
2. **Detailed Technical Explanation**: First-principles reasoning covering the underlying mechanics.
3. **Internal Working / Memory Flow**: What happens in memory, in the event loop, or on the network.
4. **Code Example**: A clear code snippet with realistic variable names and expected outputs.
5. **Real-World Application**: How this pattern applies in real products.
6. **Trade-offs & Pitfalls**: Failure modes, browser/runtime quirks, and limitations.
7. **2–4 Follow-Up Questions with Answers**: Proactive preparation for the next questions an interviewer will ask.

---

## 4. Coding Problems Standard: Mandatory Multiple Approaches

Every algorithm or coding problem where meaningful alternatives exist **MUST provide multiple approaches** so the candidate can choose and explain the optimal solution in technical screenings:

### Approach 1: Baseline / Brute-Force / Built-in
- Simplest understandable solution (often using built-in high-level methods).
- Straightforward to write under initial interview pressure.
- Full Big-O Time and Auxiliary Space complexity analysis.
- Clear explanation of why it is suboptimal for large datasets.

### Approach 2: Improved / Algorithmic
- Eliminates repeated work or unnecessary allocations.
- Employs core data structures (HashMaps, Two-Pointers, Frequency Arrays, Stacks).
- Detailed complexity analysis and trade-offs.

### Approach 3: Optimal / Production-Grade (Where Applicable)
- Optimal asymptotic time and $O(1)$ space, or memory-safe streaming/iterative implementation (e.g. iterative stack avoiding call-stack limits).
- Edge-case handling (empty inputs, single elements, integer overflow, circular references, Unicode surrogate pairs).

### Required Coding Interview Communication Framework
Teach the candidate the 10-step verbal interview sequence:
1. *Clarify requirements and edge cases.*
2. *Confirm inputs, outputs, and scale constraints.*
3. *State the brute-force baseline aloud.*
4. *Analyze baseline complexity ($O(N^2)$).*
5. *Identify the bottleneck (repeated linear search).*
6. *Propose the optimal approach ($O(N)$ with HashMap).*
7. *Write clean, modular code with descriptive variable names.*
8. *Dry-run with normal and edge cases.*
9. *State final Time and Space complexity explicitly.*
10. *Discuss production trade-offs and follow-up variations.*

---

## 5. Technology-Specific Canonical Syllabi

### A. JavaScript Master Syllabus
- **Foundations**: Primitives, Reference Types, Coercion, Equality (`==` vs `===` vs `Object.is`), Floating-point math (`0.1 + 0.2`).
- **Scopes & Execution**: Execution Context, Call Stack, Scope Chain, Lexical Environment, Hoisting, Temporal Dead Zone (TDZ).
- **Functions**: Closures, Currying, Higher-Order Functions, `this` rules (default, implicit, explicit, `new`, arrow lexical).
- **Objects & OOP**: Prototypes, Prototype Chain, `__proto__` vs `prototype`, Classes, Private `#` fields, Descriptors.
- **Asynchronous JS**: Event Loop (Timers, Poll, Check phases), Microtask queue (`process.nextTick`, Promises) vs Macrotask queue (`setTimeout`, I/O), `async`/`await`, `AbortController`, concurrency limits.
- **Modern ES6+ & Modules**: CJS vs ESM, Top-level `await`, WeakMap/WeakSet garbage collection, Structured Clone.
- **Algorithms**: String/Array reversal, Palindromes, Anagrams, Two Sum, Deep Clone with circular refs, Flattening, Debounce/Throttle, LRU Cache, Concurrency Limiter.

### B. TypeScript Master Syllabus
- **Foundations**: Type annotations, Inference, Primitives, Objects, Tuples, Enums vs Const Enums.
- **Type Mechanics**: `any` vs `unknown` vs `never`, Union & Intersection, Narrowing (`typeof`, `instanceof`, `in`, Type Guards `is`), Discriminated Unions.
- **Interfaces & Types**: Differences, Declaration Merging, Mapped Types.
- **Generics**: Generic constraints (`extends`), `keyof`, Indexed access types, Default type arguments.
- **Utility & Advanced Types**: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, Conditional Types, `infer`, Template Literal Types.
- **Full-Stack Safety**: Express/NestJS DTOs, Runtime Validation (Zod, class-validator), `tsconfig.json` flags (`strict`, `noImplicitAny`, `strictNullChecks`).

### C. React Master Syllabus
- **Foundations & Architecture**: JSX compilation (`_jsx`), Virtual DOM, Reconciliation, Fiber architecture, Work loop.
- **Component Lifecycle & State**: Immutability, Unidirectional data flow, React 18/19 Automatic Batching.
- **Hooks Master Class**: `useState`, `useEffect` (cleanups, dependencies), `useRef` (DOM vs instance variables), `useMemo` & `useCallback` (profiling vs premature optimization), `useReducer`, `useContext`, Custom Hooks.
- **State Management**: Local vs Server State (TanStack Query) vs Client Global State (Zustand atomic selectors vs Redux Toolkit).
- **Performance**: `React.memo`, Code-splitting (`lazy`/`Suspense`), Windowing/Virtualization, Transitions (`useTransition`, `useDeferredValue`).
- **Testing**: Vitest + React Testing Library + `userEvent`, query hierarchy (`getByRole`), asynchronous assertions (`findByRole`, `waitFor`), MSW network mocking.

### D. Node.js & Backend Master Syllabus
- **Runtime Architecture**: V8 Engine + Libuv C++ core, Event Loop 6 phases, Microtasks.
- **Concurrency Model**: Single-threaded JS execution vs Libuv Thread Pool (default 4 threads) vs OS Non-blocking kernel (`epoll`, `kqueue`, `IOCP`) vs `node:worker_threads`.
- **Streams & Buffers**: Binary memory, Backpressure, Stream pipelines.
- **Express & Security**: Middleware, Global error handling, Raw Body Buffers, HMAC SHA-256 Webhooks, Timing attacks & `crypto.timingSafeEqual`, Helmet, CORS, Rate limiting, Injection defense.
- **Production Engineering**: Clustering, Process managers, Graceful shutdown (`SIGTERM`/`SIGINT`), Memory leak debugging & Heap Snapshots.

---

## 6. Content Quality & Validation Rules

A topic is **NEVER complete** merely because a title or a one-line definition exists.

### Status Definitions
* `missing`: Concept is absent from the syllabus and notes.
* `in_progress`: Draft content exists but lacks runnable code, internal mechanics, or multiple approaches.
* `needs_review`: Content is authored but has unparsed markdown, unclear complexities, or missing trade-offs.
* `complete`: Fully authored following the 9-part notes or multi-approach coding standard, verified in UI and passing tests.

### Automated & Manual Quality Checks
- Zero empty answer fields or broken links.
- No unexplained acronyms (e.g. Always write: **Hash-based Message Authentication Code (HMAC)**).
- Explicit Time and Space complexity for all algorithm approaches.
- All code blocks must be valid syntax with appropriate language identifier (`javascript`, `typescript`, `jsx`, `sql`).
- Progressive difficulty from Junior to Staff/Lead Engineer.

---

## 7. Change Execution & Batch Workflow

When updating or expanding content:
1. **Audit & Plan**: Check existing registry structures.
2. **Implement in Controlled Batches**: Modify data files incrementally.
3. **Verify Build**: Always run `npm run build` after editing data or components to confirm zero syntax or bundler errors.
4. **Inspect in UI**: Verify responsive styling, tab navigation, and markdown rendering.
5. **Update Audit Log**: Record completed changes and outstanding items in [`CONTENT_AUDIT.md`](file:///d:/React_Machine_Coding/senior-machine-coding-suite/CONTENT_AUDIT.md).
