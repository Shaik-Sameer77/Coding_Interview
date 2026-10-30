const fs = require('fs');
const path = require('path');

function createSection(id, title, order, data) {
  const content = [
    '### 1. What It Is',
    data.whatItIs,
    '',
    '### 2. Why It Exists & Historical Motivation',
    data.whyItExists,
    '',
    '### 3. What Problem It Solves',
    data.problemSolved,
    '',
    '### 4. Prerequisites',
    data.prerequisites,
    '',
    '### 5. Syntax & Parameters',
    data.syntax,
    '',
    '### 6. Minimal Working Example',
    '```jsx',
    data.minimalExample.trim(),
    '```',
    '',
    '### 7. Detailed Line-by-Line Explanation',
    data.lineByLine,
    '',
    '### 8. Under-the-Hood Internal Engine Flow',
    data.internalFlow,
    '',
    '### 9. When to Use It',
    data.whenToUse,
    '',
    '### 10. When NOT to Use It',
    data.whenNotToUse,
    '',
    '### 11. Common Mistakes & Anti-Patterns',
    data.commonMistakes,
    '',
    '### 12. Performance & Accessibility (A11y) Implications',
    data.perfA11y,
    '',
    '### 13. Real-World Production Usage',
    data.realWorld,
    '',
    '### 14. Common Interview Questions & Spoken Answers',
    data.interviewQs,
    '',
    '### 15. Senior & Staff-Level Architectural Considerations',
    data.seniorConsiderations,
    '',
    '### 16. Rapid Revision Summary & Key Takeaways',
    data.revisionSummary
  ].join('\n');

  return { id, title, order, content };
}

// ==========================================
// PART 1: React Foundations & Architecture
// ==========================================
const p1_sections = [
  createSection('1.1', '1. What is React? Library vs Framework', 1, {
    whatItIs: 'React is an open-source, component-based JavaScript library created by Meta for building modern user interfaces. It focuses strictly on the View layer of an application, leaving routing, build pipelines, and global state management to third-party ecosystem choices.',
    whyItExists: 'In early web applications (2010-2013), imperative jQuery scripting led to spaghetti code where manual DOM mutations caused state desynchronization bugs. React was built to enforce a unidirectional, declarative data flow where UI is a pure function of application state: UI = f(state).',
    problemSolved: 'Eliminates brittle manual DOM querying and imperative mutations. When state changes, React computes the minimal set of DOM operations required to reconcile the view with the new data.',
    prerequisites: 'Core JavaScript (ES6+): Closures, array methods (map, filter), destructuring, spread syntax, and basic DOM tree concepts.',
    syntax: [
      'React core exports foundational primitives:',
      '- import React from "react";',
      '- import ReactDOM from "react-dom/client";',
      '- const root = ReactDOM.createRoot(domContainerNode);',
      '- root.render(<App />);'
    ].join('\n'),
    minimalExample: `
import React from 'react';
import ReactDOM from 'react-dom/client';

function Greeting({ name }) {
  return <h1 className="welcome-banner">Hello, {name}!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Greeting name="Antigravity Engineer" />);
`,
    lineByLine: [
      '- Line 1-2: Imports React runtime and the browser-specific ReactDOM client renderer.',
      '- Line 4-6: Declares a stateless functional component Greeting accepting props and returning JSX.',
      '- Line 8: Creates an imperative rendering root targeting the container element.',
      '- Line 9: Invokes render(), triggering the initial reconciliation work loop and mounting elements to the DOM.'
    ].join('\n'),
    internalFlow: [
      'When root.render() is called:',
      '1. React translates JSX into React Elements (plain JavaScript objects with $$typeof: Symbol.for("react.element"), type, and props).',
      '2. The Fiber reconciler constructs the Work-in-Progress Fiber tree in memory.',
      '3. The Render Phase computes the host DOM node requirements without touching the real browser DOM.',
      '4. The Commit Phase executes synchronous mutations against the browser DOM via native document.createElement and appendChild calls.'
    ].join('\n'),
    whenToUse: 'Use React when building dynamic web apps, single-page applications (SPAs), SaaS dashboards, interactive forms, or modular component design systems.',
    whenNotToUse: 'Avoid React for static content-heavy sites (blogs, simple marketing landing pages) where zero-JS HTML/CSS or static site generators (Astro) yield better Core Web Vitals with zero JS bundle overhead.',
    commonMistakes: [
      '- Treating React as a full-stack framework with built-in routing, HTTP client, and database drivers.',
      '- Direct DOM mutation: Writing document.getElementById("btn").style.display = "none" instead of driving visibility through React state.'
    ].join('\n'),
    perfA11y: 'React core adds approximately 42kB gzipped (React + ReactDOM 19). Ensuring high performance requires code-splitting and memoization. For accessibility, always use semantic HTML5 elements rather than generic div wrappers.',
    realWorld: 'Production SaaS applications use React as the UI foundation, paired with TanStack Query for server state and Vite for rapid HMR.',
    interviewQs: [
      '**Q: Is React a library or a framework, and why does this distinction matter?**',
      '*Spoken Answer*: "React is strictly a library because it only governs the View layer of an application. It provides the component model, reactive state primitives, and the Fiber reconciler, but delegates routing, data fetching, and build pipelines to third-party ecosystem tools. Frameworks like Angular or Next.js, by contrast, enforce rigid inversion of control, prescribing file hierarchies, routing, and server conventions."'
    ].join('\n'),
    seniorConsiderations: 'Staff engineers evaluate total cost of ownership (TCO) between a raw React library stack (Vite + React Router + TanStack Query) vs an opinionated meta-framework (Next.js App Router). A standalone React stack offers maximum flexibility for decoupled micro-frontends and embedded widgets.',
    revisionSummary: [
      '- React is a View library, not an all-inclusive framework.',
      '- Core philosophy: Declarative UI (UI = f(state)) + Unidirectional data flow.',
      '- Relies on the Fiber Reconciler to calculate minimal DOM patches.'
    ].join('\n')
  }),

  createSection('1.2', '2. Declarative vs Imperative UI Programming', 2, {
    whatItIs: 'Imperative programming specifies how to achieve a state transition step-by-step (mutating individual DOM elements). Declarative programming specifies what the UI should look like for any given state, delegating the DOM manipulation steps to the runtime.',
    whyItExists: 'As interfaces grow in complexity, imperative code leads to state desynchronization bugs where an element is hidden in code but remains visible on screen due to an unhandled conditional branch.',
    problemSolved: 'Eliminates fragile state machines in UI code. The developer only declares the mapping from data to JSX; React guarantees the DOM matches that mapping.',
    prerequisites: 'Understanding imperative DOM APIs: document.querySelector, classList.add, appendChild, and event listeners.',
    syntax: [
      '// Imperative (Vanilla JS):',
      'const btn = document.createElement("button");',
      'btn.textContent = "Submit";',
      'btn.onclick = () => { btn.disabled = true; };',
      'document.body.appendChild(btn);',
      '',
      '// Declarative (React):',
      '<button disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Submit"}</button>'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function ToggleBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? 'Close' : 'Open'} Banner
      </button>
      {isOpen && (
        <div role="alert" className="banner">
          Important operational announcement!
        </div>
      )}
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: Declares boolean state isOpen representing the single source of truth.',
      '- Line 7-9: Button text declaratively reflects isOpen value.',
      '- Line 11-15: The banner is conditionally rendered using short-circuit logical evaluation without any imperative style.display = "none".'
    ].join('\n'),
    internalFlow: [
      '1. State transition triggered via setIsOpen.',
      '2. Component re-executes; a new Virtual DOM element tree is generated.',
      '3. React diffs the previous Fiber tree against the new tree.',
      '4. If isOpen transitioned from false to true, Fiber marks the banner node with a Placement effect tag and mounts the real DOM element during the commit phase.'
    ].join('\n'),
    whenToUse: 'Always in React. Every visual element should be expressed as a projection of state or props.',
    whenNotToUse: 'Imperative programming is only warranted for low-level canvas rendering, audio/video element controls (audio.play()), or integrating legacy third-party non-React plugins (e.g. Leaflet map instances).',
    commonMistakes: [
      '- Mixing imperative DOM queries (document.querySelector) with React state.',
      '- Storing derived UI properties in state (e.g. isBannerHidden and isBannerVisible as separate states).'
    ].join('\n'),
    perfA11y: 'Declarative short-circuit rendering automatically removes unmounted elements from the DOM accessibility tree, preventing screen readers from reading orphaned or hidden content.',
    realWorld: 'Production forms with dependent dropdowns (Country -> State -> City) declare cascading filters cleanly as state transformations rather than mutating 3 separate HTML select elements.',
    interviewQs: [
      '**Q: Why is declarative UI more maintainable than imperative DOM scripting?**',
      '*Spoken Answer*: "Declarative UI creates a single source of truth. In imperative code, you must manually handle every permutation of state transitions: moving from loading to success, error to retry, or open to closed. Miss a single classList.remove(\'loading\') and the UI bugs out. In declarative React, you define the UI once for each state variant, and the reconciliation engine guarantees zero out-of-sync DOM states."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects audit codebases for imperative escapes. Using useRef to mutate child DOM elements directly bypasses React\'s reconciliation lifecycle and breaks concurrent rendering transitions.',
    revisionSummary: [
      '- Imperative = HOW (step-by-step DOM manipulation).',
      '- Declarative = WHAT (UI is a direct function of current state).',
      '- Eliminates state desynchronization and orphaned DOM nodes.'
    ].join('\n')
  }),

  createSection('1.3', '3. Rendering Strategies: SPA, CSR, SSR, SSG & Hydration', 3, {
    whatItIs: 'Rendering strategies determine where and when React code is transformed into HTML. The primary models are Client-Side Rendering (CSR / SPA), Server-Side Rendering (SSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR).',
    whyItExists: 'Pure CSR delivers an empty HTML shell and relies on the browser to download, parse, and execute megabytes of JS before rendering anything. This causes slow First Contentful Paint (FCP) and poor SEO. Server-centric strategies solve this by generating HTML on the server.',
    problemSolved: 'Solves slow mobile Time-To-Interactive (TTI), poor Search Engine Optimization, and high latency on slow network connections.',
    prerequisites: 'HTTP lifecycle, web browser rendering pipeline, and server execution fundamentals.',
    syntax: [
      '// Comparison Matrix of Strategies:',
      '| Strategy | Render Time | Output | Best For |',
      '| :--- | :--- | :--- | :--- |',
      '| CSR (SPA) | Browser Runtime | Empty HTML + JS bundle | Internal SaaS, Admin Panels |',
      '| SSR | Request Time | Full HTML per request | Dynamic e-commerce, Social feeds |',
      '| SSG | Build Time | Static HTML files | Documentation, Marketing pages |',
      '| Hydration | Browser Boot | Attaches JS events to HTML | Bridge between SSR/SSG and React |'
    ].join('\n'),
    minimalExample: `
// Minimal Hydration Example (Client Entry Point):
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// hydrateRoot expects server-rendered HTML to already exist inside #root
hydrateRoot(
  document.getElementById('root'),
  <App />
);
`,
    lineByLine: [
      '- Line 2: Imports hydrateRoot from react-dom/client (replaces legacy ReactDOM.hydrate).',
      '- Line 6-9: Hydrates the pre-rendered HTML received from the server, matching Fiber nodes to existing DOM elements and binding event listeners without re-creating DOM nodes.'
    ].join('\n'),
    internalFlow: [
      'Hydration Process:',
      '1. Browser loads pre-rendered HTML -> Users see static content immediately (Fast FCP/LCP).',
      '2. Browser downloads client JavaScript bundle.',
      '3. React renders the component tree in memory to construct the Fiber tree.',
      '4. React walks the existing real DOM tree in parallel, matching each Fiber node to the corresponding DOM element.',
      '5. If text or attributes match, event listeners are attached.',
      '6. Hydration Mismatch Warning: If server HTML differs from client initial state, React discards mismatched DOM nodes or logs hydration errors.'
    ].join('\n'),
    whenToUse: [
      '- CSR (SPA): For private authenticated dashboards, analytics portals, and desktop-class web applications behind a login.',
      '- SSR/SSG: For public-facing marketing, e-commerce product catalogs, and content blogs requiring high SEO visibility.'
    ].join('\n'),
    whenNotToUse: 'Do not choose complex SSR for purely authenticated dashboards where SEO is irrelevant and hosting Node.js server instances incurs unnecessary infrastructure cost.',
    commonMistakes: [
      '- Accessing browser-only globals (window, localStorage, navigator) during server render, causing server crashes.',
      '- Introducing non-deterministic data in initial render (e.g. new Date().toLocaleTimeString()) triggering Hydration Mismatch errors.'
    ].join('\n'),
    perfA11y: 'SSR delivers instant visual feedback to users with screen readers or low-end devices, improving First Contentful Paint by up to 70% compared to heavy client-side bundles.',
    realWorld: 'Platforms like LesHub B2B marketplace render public product catalogs via SSR/SSG for search engine indexing, but switch to client-side navigation once the initial page has hydrated.',
    interviewQs: [
      '**Q: What is Hydration in React, and why do hydration mismatches occur?**',
      '*Spoken Answer*: "Hydration is the process where client-side React boots up on a page pre-rendered with HTML from the server. Instead of creating brand-new DOM nodes, React walks the existing DOM and binds event listeners to make the static markup interactive. A hydration mismatch occurs when the server-generated HTML does not exactly match the initial render tree generated on the client, often caused by inspecting window, client-only cookies, or random numbers during the initial render."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects must understand Partial Hydration, Island Architecture, and React Server Components (RSC). RSC allows components to execute solely on the server with zero client JS footprint, sending serialized UI streams to the client.',
    revisionSummary: [
      '- CSR: Client builds the entire UI from JS.',
      '- SSR: Server generates HTML on every request.',
      '- SSG: HTML generated once at build time.',
      '- Hydration: Attaches event listeners and reactive Fiber state to existing server-rendered HTML.'
    ].join('\n')
  }),

  createSection('1.4', '4. Build Tooling: Vite vs Create-React-App vs Next.js', 4, {
    whatItIs: 'Build tooling encompasses the compilers, bundlers, and development servers required to transform modern JSX, TypeScript, and CSS modules into production-ready browser assets. The three primary paradigms are Vite (modern ESM), Create-React-App (legacy Webpack), and Next.js (full-stack meta-framework).',
    whyItExists: 'Browsers cannot natively execute JSX syntax or unbundled module trees with thousands of individual import statements. Build tools transpile JSX, bundle modules, optimize asset sizes, and provide Hot Module Replacement (HMR) for fast developer iteration.',
    problemSolved: 'Solves slow development startup times, cumbersome Webpack configuration, and inefficient asset delivery to production users.',
    prerequisites: 'ES Modules (import/export), Node.js runtime, package.json scripts, and basic understanding of browser asset loading.',
    syntax: [
      '// Vite Dev Server Execution:',
      '$ npm run dev     # Starts instant esbuild-backed native ESM dev server',
      '$ npm run build   # Uses Rollup for highly optimized tree-shaken production bundles'
    ].join('\n'),
    minimalExample: `
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
`,
    lineByLine: [
      '- Line 2: Imports the official Vite React plugin leveraging Babel or @swc/wasm for sub-millisecond JSX compilation.',
      '- Line 4-18: Configures development server port and production Rollup chunking rules to separate vendor libraries from application code.'
    ].join('\n'),
    internalFlow: [
      'Vite vs Webpack Architecture:',
      '1. Webpack (CRA): Bundles the entire application into memory before serving the first page. As the codebase grows to hundreds of files, cold start and HMR times degrade to 30-60 seconds.',
      '2. Vite: Serves source files over native browser ES Modules (ESM). It only transpiles the specific file requested by the browser on demand via esbuild (written in Go, 10-100x faster than JS bundlers).',
      '3. Production: Uses Rollup to produce highly optimized, tree-shaken static assets with hash-based caching.'
    ].join('\n'),
    whenToUse: [
      '- Vite: The modern standard for Single-Page Applications (SPAs), developer dashboards, and client-side web apps.',
      '- Next.js: When server-side rendering, API routes, edge caching, or hybrid static/dynamic routing are required.'
    ].join('\n'),
    whenNotToUse: 'Do not start new enterprise projects with Create-React-App (CRA); it has been officially deprecated by the React team and suffers from obsolete Webpack 4/5 dependencies.',
    commonMistakes: [
      '- Using process.env in Vite without configuring import.meta.env.',
      '- Neglecting manual vendor chunk splitting, leading to massive monolithic index.js bundles exceeding 1MB.'
    ].join('\n'),
    perfA11y: 'Vite’s Rollup bundling performs aggressive dead-code elimination (tree-shaking), pruning unused exports from large libraries like lucide-react or lodash-es.',
    realWorld: 'Modern developer platforms (including this machine coding suite) run on Vite 8, delivering instant HMR updates under 50ms across dozens of complex interactive modules.',
    interviewQs: [
      '**Q: Why is Vite significantly faster than Webpack during local development?**',
      '*Spoken Answer*: "Vite shifts the bundling paradigm. Webpack eagerly crawls and bundles the entire application dependency graph before starting the dev server. Vite starts the server instantly by relying on native ES Modules in modern browsers: it only transpiles and serves the exact files requested by the browser via esbuild. When a file changes, only that single module is replaced via HMR, maintaining sub-50ms update speeds regardless of total codebase size."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers evaluate bundle analyzer reports (rollup-plugin-visualizer) to eliminate duplicate transitive dependencies and enforce budget limits in CI/CD pipelines.',
    revisionSummary: [
      '- Create-React-App is deprecated.',
      '- Vite uses native ESM + esbuild for dev, and Rollup for production.',
      '- Use import.meta.env for environment variables in Vite.'
    ].join('\n')
  }),

  createSection('1.5', '5. React vs Vanilla JavaScript & Modern Frameworks', 5, {
    whatItIs: 'A technical comparison evaluating React against direct Vanilla JavaScript DOM manipulation, compiled frameworks (Svelte), and fine-grained reactive runtimes (Solid.js, Vue 3).',
    whyItExists: 'No framework is universally optimal. Understanding architectural tradeoffs prevents cargo-culting and equips engineers to justify technology selections.',
    problemSolved: 'Clarifies memory overhead, runtime performance, developer ergonomics, and ecosystem maturity across frontend paradigms.',
    prerequisites: 'Core DOM APIs, reactive programming concepts, and JavaScript execution costs.',
    syntax: [
      '// Vanilla JS DOM Mutation:',
      'const countSpan = document.getElementById("count");',
      'let count = 0;',
      'document.getElementById("inc-btn").addEventListener("click", () => {',
      '  count++;',
      '  countSpan.textContent = count;',
      '});',
      '',
      '// React Declarative Model:',
      'const [count, setCount] = useState(0);',
      '<button onClick={() => setCount(c => c + 1)}>Count: {count}</button>'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function BenchmarkCounter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: React manages count state in memory.',
      '- Line 8: Multiple independent triggers (Increment, Reset) update the same state variable, and React guarantees all affected UI nodes synchronize automatically.'
    ].join('\n'),
    internalFlow: [
      'Architectural Comparison:',
      '1. Vanilla JS: Fastest possible theoretical execution because it touches the DOM directly. However, developer cognitive load is exponential for complex state interactions, leading to race conditions.',
      '2. React: Employs a Virtual DOM / Fiber tree. Incurs memory overhead for Fiber nodes, but provides predictable reconciliation, automatic batching, and concurrent scheduling.',
      '3. Svelte: Discards the Virtual DOM entirely. Compiles reactive assignments into direct DOM updates at build time.',
      '4. Solid.js: Uses fine-grained reactive primitives (Signals). Components run once; only the exact text node bound to a signal re-evaluates when data changes.'
    ].join('\n'),
    whenToUse: 'Choose React when leveraging the world’s largest UI component ecosystem, hiring from an abundant talent pool, and building long-lived enterprise applications.',
    whenNotToUse: 'Avoid React for tiny embedded widgets on third-party sites where a 40kB runtime overhead is unacceptable (use Vanilla JS or Preact).',
    commonMistakes: [
      '- Assuming React is faster than Vanilla JS (it is not; React adds reconciliation overhead to guarantee correctness and maintainability).',
      '- Believing that React re-renders mutate the entire real DOM tree (Fiber only touches mutated attributes).'
    ].join('\n'),
    perfA11y: 'React’s synthetic event system normalizes cross-browser quirks and delegates events to the root container, reducing event listener memory consumption across thousands of list items.',
    realWorld: 'Enterprise scale organizations standardize on React because the component abstraction enables hundreds of autonomous product teams to contribute safely without stepping on global DOM state.',
    interviewQs: [
      '**Q: If Vanilla JS is faster than React, why do large engineering teams use React?**',
      '*Spoken Answer*: "While raw Vanilla JS operations are faster at micro-benchmarks, human engineering at scale cannot maintain hundreds of manual DOM bindings without introducing state synchronization bugs and memory leaks. React trades a slight runtime reconciliation overhead for declarative predictability, reusable component contracts, automatic batching, and vast ecosystem leverage."'
    ].join('\n'),
    seniorConsiderations: 'Staff architects evaluate framework longevity, backward compatibility track records, and security vulnerability patching. React’s disciplined commitment to backward compatibility ensures 10-year-old codebases upgrade smoothly to React 18/19.',
    revisionSummary: [
      '- Vanilla JS has 0kB overhead but poor scalability.',
      '- React uses Fiber reconciliation for declarative correctness.',
      '- Svelte/Solid eliminate the Virtual DOM via compilers and fine-grained signals.'
    ].join('\n')
  }),

  createSection('1.6', '6. React Evolution: Architectural Milestones (v16 to v19)', 6, {
    whatItIs: 'A technical history of React’s major architectural redesigns: React 16 (Fiber Reconciler), React 16.8 (Hooks), React 18 (Concurrent Features & Automatic Batching), and React 19 (Actions, Server Components, Asset Loading, and the React Compiler).',
    whyItExists: 'In React 15 and earlier, reconciliation was "Stack-based"—recursive and synchronous. Once a render started, it could not be paused. If a large component tree took 100ms to render, the browser main thread was blocked, causing frame drops (jank) and unresponsive typing.',
    problemSolved: 'Solves main-thread locking through time-sliced concurrent rendering, prioritizes urgent user inputs over background renders, and streamlines asynchronous mutations.',
    prerequisites: 'JavaScript call stack, browser event loop (frame budgets: 16.6ms for 60fps), and basic Promise mechanics.',
    syntax: [
      '// Major Version Architectural Capabilities:',
      '- React 16: Fiber architecture, Error Boundaries, Portals.',
      '- React 16.8: Hooks (useState, useEffect) replacing class components.',
      '- React 18: createRoot, Automatic Batching, useTransition, useDeferredValue.',
      '- React 19: Actions (useActionState), useOptimistic, use() API, React Compiler.'
    ].join('\n'),
    minimalExample: `
import React, { useState, useTransition } from 'react';

export default function SearchDashboard() {
  const [query, setQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    // 1. Urgent update: Keep typing responsive
    setQuery(e.target.value);

    // 2. Non-urgent update: Yields to browser input events
    startTransition(() => {
      const results = Array.from({ length: 5000 }, (_, i) => \`Result for \${e.target.value} #\${i}\`);
      setFilteredList(results);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Type rapidly..." />
      {isPending && <span>Computing 5,000 items...</span>}
      <ul>{filteredList.slice(0, 10).map((item, idx) => <li key={idx}>{item}</li>)}</ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 6: Initializes useTransition returning an isPending flag and startTransition wrapper.',
      '- Line 10: Urgent update (setQuery) executes immediately so input character feedback is instantaneous.',
      '- Line 13-16: Non-urgent heavy list generation is wrapped in startTransition, allowing the Fiber reconciler to yield execution if the user types another character.'
    ].join('\n'),
    internalFlow: [
      'Fiber Concurrent Scheduling:',
      '1. React 15 Stack Reconciler processed component trees recursively down the JS call stack. It could not yield.',
      '2. React 16+ Fiber breaks the work loop into small units of work called Fibers.',
      '3. In React 18+, Fibers are assigned priority lanes (SyncLane, InputContinuousLane, DefaultLane, TransitionLane).',
      '4. During an idle browser window, React processes transitions. If an urgent user click or keystroke arrives, the work loop pauses, discards incomplete transition work, executes the urgent update, and resumes.'
    ].join('\n'),
    whenToUse: 'Leverage concurrent transitions when rendering complex data tables, filtering large catalogs, or switching heavy dashboard tabs.',
    whenNotToUse: 'Do not wrap simple, fast state updates in startTransition; it introduces unnecessary scheduling overhead.',
    commonMistakes: '- Using legacy ReactDOM.render(<App />, container) which disables all React 18/19 concurrent capabilities and automatic batching. Always use ReactDOM.createRoot().',
    perfA11y: 'Transitions keep the browser main thread under the 16.6ms threshold, guaranteeing 60fps animations and immediate screen reader feedback during complex filtering.',
    realWorld: 'High-throughput enterprise dashboards leverage transitions to keep search inputs butter-smooth while simultaneously updating complex charting visualizations.',
    interviewQs: [
      '**Q: What was the primary motivation behind the React Fiber architecture rewrite?**',
      '*Spoken Answer*: "The fundamental motivation for Fiber was scheduling and concurrency. The legacy stack reconciler was synchronously recursive—once rendering began, it monopolized the main execution thread until completion, causing perceptible frame drops during large tree updates. Fiber re-architected the Virtual DOM into an incremental, interruptible linked list work loop, allowing React to pause non-urgent work, yield to high-priority browser input events, and resume rendering seamlessly."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers evaluate React 19’s automatic compiler (forget). The React Compiler analyzes component data flow at build time and automatically memoizes JSX and calculations, eliminating the need for manual useMemo and useCallback boilerplate.',
    revisionSummary: [
      '- React 16 introduced the interruptible Fiber reconciler.',
      '- React 16.8 introduced Hooks.',
      '- React 18 introduced Concurrent Mode, Automatic Batching, and Transitions.',
      '- React 19 introduces Actions, the use() hook, and the React Compiler.'
    ].join('\n')
  }),

  createSection('1.7', '7. Runtime Environments: React DOM vs React Native', 7, {
    whatItIs: 'React’s architecture cleanly separates the Reconciliation Engine (react / React Core) from the Renderer (react-dom, react-native, react-three-fiber, ink).',
    whyItExists: 'Decoupling reconciliation from rendering allows the identical component model, hooks, and declarative state logic to target any UI host environment: web browsers, native iOS/Android, terminal CLIs, or 3D canvas graphs.',
    problemSolved: 'Enables cross-platform code reuse and unifies frontend mental models across web and native mobile development.',
    prerequisites: 'Understanding host platforms: Browser DOM nodes vs Native mobile view components.',
    syntax: [
      '// React Core (Platform Agnostic):',
      'import { useState, useEffect } from "react";',
      '',
      '// Web Renderer:',
      'import ReactDOM from "react-dom/client";',
      'ReactDOM.createRoot(node).render(<App />);',
      '',
      '// Mobile Renderer (React Native):',
      'import { AppRegistry } from "react-native";',
      'AppRegistry.registerComponent("MainApp", () => App);'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

// Custom Hook: 100% Platform Agnostic
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const inc = () => setCount(c => c + 1);
  const dec = () => setCount(c => c - 1);
  return { count, inc, dec };
}

// Web UI:
export function WebCounter() {
  const { count, inc } = useCounter(0);
  return <button onClick={inc}>Web Clicks: {count}</button>;
}
`,
    lineByLine: [
      '- Line 4-9: Pure React hook with zero DOM or mobile dependencies.',
      '- Line 12-15: Web-specific wrapper employing HTML button and onClick SyntheticEvent.'
    ].join('\n'),
    internalFlow: [
      'Host Config Protocol:',
      '1. react package implements the Fiber reconciler.',
      '2. The reconciler communicates with renderers via a contract called HostConfig.',
      '3. react-dom implements HostConfig methods: createInstance maps to document.createElement.',
      '4. react-native implements HostConfig methods: createInstance maps to native C++ Yoga layout nodes and native OS view instantiations.'
    ].join('\n'),
    whenToUse: 'Use React DOM for web applications, PWAs, and responsive desktop web portals. Use React Native when deploying genuine compiled iOS and Android binaries.',
    whenNotToUse: 'Do not use React DOM primitives (div, span, input) in React Native; they do not exist on mobile runtimes and will cause immediate runtime syntax crashes.',
    commonMistakes: [
      '- Attempting to import react-dom in shared mobile libraries.',
      '- Expecting CSS box model rules to work identically in React Native.'
    ].join('\n'),
    perfA11y: 'React Native maps accessibility properties directly to native OS accessibility APIs, providing first-class VoiceOver and TalkBack support.',
    realWorld: 'Companies like Discord and Shopify maintain shared monorepos where state machines, custom hooks, and Zod validation schemas are shared 100% between React web and React Native mobile apps.',
    interviewQs: [
      '**Q: How does React achieve platform independence between Web and Native mobile?**',
      '*Spoken Answer*: "React decouples the reconciler from the renderer. The reconciler—Fiber—maintains the component tree, state updates, and diffing logic entirely in abstract JavaScript objects. It delegates the actual creation and mutation of host elements to a renderer through the HostConfig interface. On the web, react-dom translates Fiber instructions into DOM APIs; in native mobile, react-native translates them via the Yoga layout engine into native iOS UIViews and Android Views."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects designing enterprise monorepos use tools like Turborepo to extract UI-agnostic domain logic away from web and mobile presentation layers.',
    revisionSummary: [
      '- React Core handles component logic, hooks, and Fiber reconciliation.',
      '- Renderers (ReactDOM, React Native) translate Fiber instructions into host-specific UI elements.',
      '- Custom hooks and business logic are 100% shareable across platforms.'
    ].join('\n')
  }),

  createSection('1.8', '8. Project Setup, Environment Config & Package.json Scripts', 8, {
    whatItIs: 'The operational structure of a production React application: configuring package.json, environment variables (.env), compiler settings (vite.config.js), and CI/CD validation scripts.',
    whyItExists: 'A React application requires disciplined configuration to manage dependencies, separate development and production API endpoints, enforce code quality via linters, and produce deterministic production builds.',
    problemSolved: 'Prevents hardcoded API credentials, inconsistent build artifacts across developer machines, and deployment failures.',
    prerequisites: 'Node.js, npm/pnpm, JSON configuration, and environment variable principles.',
    syntax: [
      '// Standard package.json scripts:',
      '{',
      '  "scripts": {',
      '    "dev": "vite",',
      '    "build": "tsc -b && vite build",',
      '    "preview": "vite preview",',
      '    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",',
      '    "test": "vitest run"',
      '  }',
      '}'
    ].join('\n'),
    minimalExample: `
// .env.production
// VITE_API_BASE_URL=https://api.chrona.io/v1

// src/config.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function getFullEndpoint(path) {
  return \`\${API_BASE_URL}\${path}\`;
}
`,
    lineByLine: [
      '- Line 5: Accesses the Vite-exposed environment variable via import.meta.env.VITE_* with a safe local fallback.',
      '- Line 7-9: Utility ensuring all API requests target the correct environment-specific gateway.'
    ].join('\n'),
    internalFlow: [
      'Build Pipeline Mechanics:',
      '1. npm run build first triggers tsc -b to perform static type checking across the entire project.',
      '2. If type checking passes, Vite invokes Rollup.',
      '3. Rollup resolves module paths, inlines environment variables prefixed with VITE_, performs dead-code elimination, splits vendor chunks, and outputs minified, hash-stamped bundles to dist/.'
    ].join('\n'),
    whenToUse: 'In every production React repository.',
    whenNotToUse: 'Never commit secrets, private encryption keys, or database credentials into client-side .env files—all variables bundled into React are publicly visible in browser network tabs.',
    commonMistakes: [
      '- Forgetting the VITE_ prefix in Vite projects.',
      '- Bypassing type-checking during builds (tsc flag omitted).'
    ].join('\n'),
    perfA11y: 'Configuring proper cache headers (Cache-Control: max-age=31536000, immutable) for hash-stamped assets in dist/assets/ guarantees instantaneous repeat visits for users.',
    realWorld: 'Production pipelines use separate staging and production configurations injected at build time via GitHub Actions or AWS CodeBuild.',
    interviewQs: [
      '**Q: Why do client-side environment variables require a specific prefix like VITE_ or REACT_APP_?**',
      '*Spoken Answer*: "Because client-side React code executes entirely inside the user\'s browser, any variable bundled into the client is publicly inspectable. To prevent accidental leakage of sensitive host server secrets (such as database credentials or private API keys), bundlers like Vite strictly require an explicit prefix (VITE_) to whitelist variables intended for browser injection."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers configure automated security auditing in package.json (npm audit --audit-level=high) and enforce pinned lockfiles in production container builds.',
    revisionSummary: [
      '- Environment variables must start with VITE_.',
      '- Never expose private backend secrets in frontend .env files.',
      '- Production build script should enforce type checking: tsc -b && vite build.'
    ].join('\n')
  })
];

// ==========================================
// PART 2: JSX & Rendering Fundamentals
// ==========================================
const p2_sections = [
  createSection('2.1', '5. JSX Transformation & Automatic Runtime (_jsx)', 1, {
    whatItIs: 'JSX (JavaScript XML) is a syntax extension for JavaScript that allows developers to write HTML-like markup inside JavaScript files. Browsers cannot read JSX directly; it is transpiled into JavaScript function calls at build time.',
    whyItExists: 'In early web development, HTML markup and JavaScript logic lived in separate files, leading to fragile selectors and separation of technologies rather than separation of concerns. JSX colocates markup with rendering logic inside components.',
    problemSolved: 'Eliminates tedious and error-prone React.createElement syntax while providing compile-time syntax validation.',
    prerequisites: 'JavaScript ES6 objects, functions, and Abstract Syntax Trees (AST).',
    syntax: [
      '// Modern React 17+ Automatic Runtime:',
      '// Input JSX:',
      '<div className="card">Hello</div>',
      '',
      '// Transpiled Output (Babel / SWC):',
      'import { jsx as _jsx } from "react/jsx-runtime";',
      '_jsx("div", { className: "card", children: "Hello" });'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export default function UserCard({ username, role }) {
  return (
    <article className="user-card">
      <header>
        <h3>{username}</h3>
        <span className="badge">{role}</span>
      </header>
    </article>
  );
}
`,
    lineByLine: [
      '- Line 4: Transpiles to _jsx("article", { className: "user-card", children: ... }).',
      '- Line 5-8: Nested elements become nested _jsx calls or children arrays in the props object.',
      '- Curly braces {username} tell the JSX parser to evaluate the expression as pure JavaScript.'
    ].join('\n'),
    internalFlow: [
      '1. Compiler (Babel/SWC/esbuild) parses JSX tokens into an AST.',
      '2. jsx-runtime transforms elements into _jsx(type, config, maybeKey).',
      '3. At runtime, _jsx returns a lightweight, frozen React Element object:',
      '   { $$typeof: Symbol.for("react.element"), type: "article", props: { ... }, key: null }.',
      '4. The $$typeof symbol protects against XSS security attacks (JSON cannot contain symbols, preventing forged elements from API responses).'
    ].join('\n'),
    whenToUse: 'Whenever writing React component templates.',
    whenNotToUse: 'Do not use JSX outside of React or compatible JSX runtimes (Preact, Solid). Pure data transformation should remain in plain JavaScript.',
    commonMistakes: [
      '- Forgetting that JSX requires an imported or configured runtime, leading to "React is not defined" in legacy setups.',
      '- Treating JSX as a string or template literal; it is compiled JavaScript syntax.'
    ].join('\n'),
    perfA11y: 'The modern _jsx runtime optimizes object creation by passing key outside the props object, reducing memory allocation overhead compared to legacy React.createElement.',
    realWorld: 'Production design systems compile hundreds of JSX component variants into lightweight React element factories consumed by web applications.',
    interviewQs: [
      '**Q: What is the difference between the legacy JSX transform and the React 17+ automatic runtime?**',
      '*Spoken Answer*: "In the legacy transform, every JSX tag was compiled into React.createElement(\'div\', props), requiring import React from \'react\' in every single file, and incurring overhead by copying keys into props. The automatic runtime compiles JSX into import { jsx as _jsx } from \'react/jsx-runtime\', eliminating the need to import React manually, separating keys for faster diffing, and reducing bundle sizes."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects configure bundlers (vite.config.js or tsconfig.json with "jsx": "react-jsx") to ensure zero unnecessary runtime bundle inflation.',
    revisionSummary: [
      '- JSX is syntax sugar compiled to _jsx() calls.',
      '- Returns plain JavaScript objects with $$typeof security tags.',
      '- React 17+ does not require import React from "react" for JSX.'
    ].join('\n')
  }),

  createSection('2.2', '6. JSX vs HTML Syntax Rules & Differences', 2, {
    whatItIs: 'A set of structural and naming rules that differentiate JSX from standard HTML, stemming from the fact that JSX compiles directly to JavaScript object properties.',
    whyItExists: 'Because JSX is closer to JavaScript than HTML, reserved JavaScript keywords (such as class and for) cannot be used as attribute names without causing parser collisions.',
    problemSolved: 'Prevents syntax errors with JavaScript keywords and enforces strict XML closing tag compliance.',
    prerequisites: 'Basic HTML5 attributes and JavaScript reserved keywords.',
    syntax: [
      'Key HTML to JSX mappings:',
      '- class -> className',
      '- for -> htmlFor',
      '- onclick -> onClick (camelCase)',
      '- style="color: red" -> style={{ color: "red" }}',
      '- <input> -> <input /> (self-closing mandatory)'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export default function AccessibleLoginForm() {
  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="user-email">Email Address</label>
      <input 
        id="user-email"
        type="email" 
        className="form-input" 
        style={{ borderColor: '#3b82f6', padding: '0.5rem' }}
        placeholder="dev@chrona.io"
      />
      <button type="submit" tabIndex={0}>Sign In</button>
    </form>
  );
}
`,
    lineByLine: [
      '- Line 4: Uses className instead of class to avoid colliding with ES6 class keyword.',
      '- Line 5: Uses htmlFor instead of for to map label to the input element id.',
      '- Line 6-12: The <input> element is explicitly self-closing (/>).',
      '- Line 10: Inline style expects a JavaScript object with camelCase properties, not a CSS string.'
    ].join('\n'),
    internalFlow: [
      '1. JSX parser identifies attributes and constructs a JavaScript props object.',
      '2. During the commit phase, React maps className to the DOM property element.className, and htmlFor to element.htmlFor.',
      '3. Event handlers like onClick are not attached to the DOM node; they are registered in React\'s centralized event delegation manager.'
    ].join('\n'),
    whenToUse: 'In all JSX element declarations.',
    whenNotToUse: 'Never use raw HTML strings like class="btn" inside JSX; it will trigger React console warnings.',
    commonMistakes: [
      '- Writing style="background-color: blue" instead of style={{ backgroundColor: "blue" }}.',
      '- Forgetting to self-close tags like <img>, <input>, or <br>, resulting in compile errors.'
    ].join('\n'),
    perfA11y: 'Using htmlFor correctly ensures screen readers announce input names when focusing form fields, satisfying WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships).',
    realWorld: 'Enterprise UI libraries (MUI, Shadcn) standardize on camelCase prop interfaces and SVG icons with fillRule and clipRule JSX properties.',
    interviewQs: [
      '**Q: Why does JSX use className and htmlFor instead of class and for?**',
      '*Spoken Answer*: "Because JSX is transpiled into plain JavaScript objects where attributes become property keys. In ES6, class is a reserved keyword for class declarations, and for is a reserved keyword for loops. To avoid parser collisions and syntax ambiguities, React chose className and htmlFor, which directly reflect the underlying DOM properties on HTML elements."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers enforce ESLint rules (eslint-plugin-react and jsx-a11y) in pre-commit hooks to automatically catch invalid HTML attributes and accessibility violations.',
    revisionSummary: [
      '- class -> className, for -> htmlFor.',
      '- All attributes are camelCase (tabIndex, readOnly).',
      '- All open tags must be explicitly closed or self-closed.'
    ].join('\n')
  }),

  createSection('2.3', '7. Expressions in JSX, Fragments & Value Rendering Rules', 3, {
    whatItIs: 'Rules governing how JavaScript expressions, primitive values (strings, numbers, booleans, null, undefined), and structural <React.Fragment> tags are evaluated and rendered in JSX.',
    whyItExists: 'React must decide what to display when encountered with JavaScript primitives. Booleans, null, and undefined are designed to render nothing, making conditional rendering concise.',
    problemSolved: 'Allows embedding arbitrary JavaScript calculations inside markup and avoids injecting unwanted wrapper <div> nodes into the DOM.',
    prerequisites: 'JavaScript truthy/falsy evaluation, short-circuit logic (&&, ||, ??).',
    syntax: [
      '// Expression Evaluation:',
      '<h1>{2 + 2}</h1>                     // Renders: 4',
      '<p>{isLoggedIn ? "Welcome" : "Guest"}</p>',
      '',
      '// Value Rendering Rules:',
      '<div>{true}</div>                     // Renders: nothing',
      '<div>{false}</div>                    // Renders: nothing',
      '<div>{null}</div>                     // Renders: nothing',
      '<div>{undefined}</div>                // Renders: nothing',
      '<div>{0}</div>                        // Renders: "0" (THE ZERO TRAP!)',
      '',
      '// Fragments:',
      '<>',
      '  <dt>Term</dt>',
      '  <dd>Definition</dd>',
      '</>'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export default function NotificationBadge({ count, unreadMessages }) {
  return (
    <>
      <h2>Messages</h2>
      {/* SAFE: Explicit boolean check avoids the Zero Trap */}
      {count > 0 && <span className="badge">{count} unread</span>}

      {unreadMessages.length > 0 ? (
        <ul>
          {unreadMessages.map(msg => (
            <li key={msg.id}>{msg.text}</li>
          ))}
        </ul>
      ) : (
        <p>No new notifications.</p>
      )}
    </>
  );
}
`,
    lineByLine: [
      '- Line 6: React Fragment (<>) groups sibling elements without introducing an extra <div> into the DOM.',
      '- Line 8: count > 0 && ... guarantees the left-hand operand is a strict boolean, preventing unintended numeric rendering.',
      '- Line 10-18: Ternary operator provides clean two-branch rendering for empty vs populated states.'
    ].join('\n'),
    internalFlow: [
      'Reconciliation of Primitives:',
      '1. When React encounters true, false, null, or undefined as child nodes, the reconciler yields a null Fiber child and produces no DOM mutation.',
      '2. When React encounters 0 or NaN, it treats them as valid numbers and calls document.createTextNode(String(value)), rendering "0" into the real DOM.',
      '3. React Fragments construct a Fragment Fiber node that does not correspond to any real DOM element; its children are appended directly to the parent DOM container.'
    ].join('\n'),
    whenToUse: 'Use Fragments whenever returning multiple sibling elements from a component or loop. Use expressions to compute dynamic text and styles.',
    whenNotToUse: 'Never use <> short syntax if you need to pass a key prop in a loop; you must use <React.Fragment key={item.id}>.',
    commonMistakes: [
      '- The Zero Trap: Writing items.length && <List />. When items.length is 0, the expression evaluates to 0, and React prints the number 0 directly onto the user interface! Always write items.length > 0 && <List />.'
    ].join('\n'),
    perfA11y: 'Fragments prevent "div soup", maintaining clean semantic HTML hierarchy essential for CSS Flexbox/Grid layouts and screen reader table navigation (<dl>, <table>, <tr>).',
    realWorld: 'Design systems use Fragments to return grouped table cells (<td>) or definition list entries without breaking valid HTML specifications.',
    interviewQs: [
      '**Q: What is the "Zero Trap" in React conditional rendering and how do you prevent it?**',
      '*Spoken Answer*: "The Zero Trap occurs when using the logical AND operator with a numeric expression, such as messages.length && <Badge />. In JavaScript, 0 && anything short-circuits and evaluates to the number 0. Because React renders numbers but suppresses booleans, it prints an unwanted 0 onto the UI. To prevent this, always ensure the left-hand side is a strict boolean using comparison operators (messages.length > 0 && ...) or double-negation (Boolean(messages.length) && ...)."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers enforce lint rules (react/jsx-no-leaked-render) to automatically flag non-boolean expressions on the left side of && operators during code reviews.',
    revisionSummary: [
      '- Booleans, null, and undefined render nothing.',
      '- Numbers (0) DO render: Beware the Zero Trap (count > 0 && ...).',
      '- Use <React.Fragment key={id}> when mapping lists of sibling elements.'
    ].join('\n')
  }),

  createSection('2.4', '8. XSS Defense, Security & dangerouslySetInnerHTML', 4, {
    whatItIs: 'Cross-Site Scripting (XSS) defense in React and the disciplined handling of raw HTML strings via the dangerouslySetInnerHTML prop.',
    whyItExists: 'Web applications frequently ingest user-generated content (comments, bios, rich text editor HTML). If rendered unsafely, malicious actors can inject <script> tags or inline SVG event handlers to steal user session cookies.',
    problemSolved: 'React automatically escapes strings rendered inside JSX expressions to prevent XSS. When raw HTML must be rendered, dangerouslySetInnerHTML forces deliberate awareness and sanitization.',
    prerequisites: 'XSS attack vectors (Stored, Reflected, DOM-based), HTML entity escaping, and sanitization libraries (DOMPurify).',
    syntax: [
      '// Automatic Escaping (SAFE):',
      '<div>{untrustedUserInput}</div> // Compiles text content; executes zero scripts',
      '',
      '// Explicit Raw HTML Injection (DANGEROUS without sanitization):',
      '<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />'
    ].join('\n'),
    minimalExample: `
import React from 'react';
import DOMPurify from 'dompurify';

export default function RichArticleViewer({ rawArticleHtml }) {
  // CRITICAL: Always sanitize untrusted HTML before rendering
  const cleanHtml = DOMPurify.sanitize(rawArticleHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });

  return (
    <article className="prose">
      <h2>Sanitized Editorial Content</h2>
      <div 
        className="article-body"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
}
`,
    lineByLine: [
      '- Line 2: Imports dompurify, the industry standard client-side HTML sanitizer.',
      '- Line 6-9: Strips dangerous tags (<script>, <iframe>, <object>) and malicious event attributes (onload, onerror).',
      '- Line 16: Passes the sanitized HTML object { __html: cleanHtml } to React\'s dangerouslySetInnerHTML.'
    ].join('\n'),
    internalFlow: [
      '1. Standard JSX expression <div>{str}</div> invokes document.createTextNode(). The browser treats angle brackets as literal characters, rendering them harmlessly.',
      '2. dangerouslySetInnerHTML bypasses React\'s virtual DOM reconciliation and sets element.innerHTML directly during the commit phase.',
      '3. React deliberately names the prop dangerouslySetInnerHTML and requires an object with key __html as a cognitive speed bump to remind developers to sanitize.'
    ].join('\n'),
    whenToUse: 'Only when rendering trusted CMS content, markdown previews, or sanitized rich-text editor output.',
    whenNotToUse: 'Never use dangerouslySetInnerHTML directly with unsanitized user inputs, URL query parameters, or third-party webhooks.',
    commonMistakes: [
      '- Passing unescaped strings directly from URL parameters into dangerouslySetInnerHTML.',
      '- Forgetting to sanitize href attributes: <a href="javascript:stealCookies()">'
    ].join('\n'),
    perfA11y: 'Injecting raw HTML circumvents React’s accessibility auditing tools. Ensure sanitized markup includes appropriate ARIA landmarks and heading structures.',
    realWorld: 'Production knowledge bases (like Chrona Docs or blog engines) parse markdown on the backend or sanitize client-side with DOMPurify before rendering article bodies.',
    interviewQs: [
      '**Q: How does React protect against Cross-Site Scripting (XSS) by default, and what are the risks of dangerouslySetInnerHTML?**',
      '*Spoken Answer*: "React protects against XSS by automatically escaping all values embedded inside JSX curly braces. It converts strings into DOM text nodes rather than parsing them as HTML, meaning any embedded <script> tag is rendered as literal text. The dangerouslySetInnerHTML prop bypasses this defense by directly assigning to the DOM\'s innerHTML. If the input is not sanitized with a tool like DOMPurify, an attacker can execute arbitrary JavaScript in the victim\'s browser session."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers configure Content Security Policy (CSP) headers (default-src "self") on reverse proxies and run automated AST scanners to flag any usage of dangerouslySetInnerHTML in pull requests.',
    revisionSummary: [
      '- React escapes all JSX string expressions automatically.',
      '- dangerouslySetInnerHTML directly sets innerHTML.',
      '- MUST always pair with DOMPurify sanitization.'
    ].join('\n')
  }),

  createSection('2.5', '9. Conditional Rendering Patterns', 5, {
    whatItIs: 'Techniques for rendering different UI elements based on application state, props, or permissions.',
    whyItExists: 'Interfaces are fundamentally dynamic. Users move through loading, success, error, and empty states.',
    problemSolved: 'Replaces imperative element swapping with declarative branching logic.',
    prerequisites: 'JavaScript boolean logic, ternaries, and switch statements.',
    syntax: [
      '// 4 Core Patterns:',
      '1. If / Early Return: if (!isReady) return <Loading />;',
      '2. Ternary Operator: {isAuth ? <Dashboard /> : <Login />}',
      '3. Logical AND (&&): {hasError && <ErrorBanner />}',
      '4. Lookup Object / Map: {statusComponents[status]}'
    ].join('\n'),
    minimalExample: `
import React from 'react';

const STATUS_ICONS = {
  idle: '⚪',
  loading: '⏳',
  success: '✅',
  error: '❌'
};

export default function OrderStatusCard({ status, errorMessage, orderId }) {
  // Pattern 1: Early Guard Return
  if (!orderId) {
    return <div className="alert-warning">No Order Selected.</div>;
  }

  return (
    <div className="status-card">
      <h3>Order #{orderId}</h3>
      {/* Pattern 4: Object Map Lookup */}
      <span className="status-badge">
        {STATUS_ICONS[status] || '❓'} {status.toUpperCase()}
      </span>

      {/* Pattern 3: Logical AND for conditional alerts */}
      {status === 'error' && (
        <div role="alert" className="error-box">
          {errorMessage || 'An unexpected transaction error occurred.'}
        </div>
      )}

      {/* Pattern 2: Ternary Operator */}
      <div className="action-row">
        {status === 'loading' ? (
          <button disabled>Processing Payment...</button>
        ) : (
          <button onClick={() => alert('Viewing receipt')}>View Receipt</button>
        )}
      </div>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 11-13: Early return pattern handles missing preconditions cleanly, reducing nesting in the main JSX body.',
      '- Line 19-21: Object lookup pattern replaces messy nested if/else or switch blocks.',
      '- Line 24-28: Logical AND displays error feedback only when status is strictly "error".',
      '- Line 31-35: Ternary operator switches button state between loading and active.'
    ].join('\n'),
    internalFlow: [
      '1. Component executes during the render phase.',
      '2. JavaScript evaluates the conditional branch, producing a React Element or null.',
      '3. In the diffing phase, if a branch transitions from a component element to null, React queues a deletion effect tag (Deletion) for that subtree.',
      '4. During the commit phase, unmounted component cleanups are invoked, and DOM nodes are removed.'
    ].join('\n'),
    whenToUse: 'In every component with multiple visual states (loading, empty, success, error).',
    whenNotToUse: 'Avoid deeply nested ternary operators (more than 2 levels); they become unreadable and error-prone. Refactor into lookup objects or sub-components.',
    commonMistakes: [
      '- Deeply nested ternaries: {a ? b ? <B /> : <C /> : d ? <D /> : <E />}.',
      '- The Zero Trap with numeric lengths (array.length && <List />).'
    ].join('\n'),
    perfA11y: 'When conditionally rendering alerts or error messages, add role="alert" and aria-live="polite" so screen readers immediately announce state changes.',
    realWorld: 'Async data containers (TanStack Query, RTK Query) standardize on conditional patterns: if (isLoading) return <Skeleton />; if (isError) return <ErrorView error={error} />; return <DataView data={data} />.',
    interviewQs: [
      '**Q: When should you choose an early return over an inline ternary operator?**',
      '*Spoken Answer*: "Early returns should be used when an entire view cannot render until a prerequisite condition is met—such as when data is loading, an unauthenticated user attempts access, or an essential ID prop is missing. This guards the rest of the component from runtime null-pointer exceptions and eliminates excessive JSX indentation. Inline ternaries are best reserved for small, localized UI toggles within an already valid layout."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers establish team style guides forbidding nested ternaries in JSX, preferring finite state machine (XState or reducer) status lookups.',
    revisionSummary: [
      '- Early return for full-screen loading/error guards.',
      '- Lookup maps for multi-state matching (status: idle/loading/success).',
      '- Ternaries for binary toggles; avoid nesting.'
    ].join('\n')
  }),

  createSection('2.6', '10. Lists, Keys & Reconciliation Hazards', 6, {
    whatItIs: 'The key prop is a special string attribute that React uses during reconciliation to identify which items in a collection have changed, been added, or been removed.',
    whyItExists: 'When an array is reordered or filtered, React needs a stable way to match new elements with existing DOM nodes and internal component state. Without keys, React would have to tear down and rebuild the entire list on every render.',
    problemSolved: 'Transforms an expensive O(N^3) tree diffing algorithm into a fast O(N) linear pass and preserves component state across reorders.',
    prerequisites: 'Array iteration methods (map), unique identifiers (UUIDs, DB IDs), and component state lifecycles.',
    syntax: [
      '// Correct (Stable Unique ID):',
      '{todos.map(todo => (',
      '  <TodoItem key={todo.id} item={todo} />',
      '))}',
      '',
      '// Anti-Pattern (Array Index as Key):',
      '{todos.map((todo, index) => (',
      '  <TodoItem key={index} item={todo} />',
      '))}'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function TaskListManager() {
  const [tasks, setTasks] = useState([
    { id: 'task-101', text: 'Review PR #412' },
    { id: 'task-102', text: 'Audit SQL Indexes' },
    { id: 'task-103', text: 'Deploy Vite Build' }
  ]);

  const removeFirstTask = () => {
    setTasks(prev => prev.slice(1));
  };

  return (
    <div>
      <button onClick={removeFirstTask}>Delete First Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ margin: '0.5rem 0' }}>
            <span>{task.text}</span>
            <input placeholder="Add internal note..." defaultValue="" />
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-8: Initial state contains stable, unique ID strings (task-101, task-102).',
      '- Line 10-12: Deletes the first item from the array.',
      '- Line 19: key={task.id} ensures that when task-101 is removed, React unmounts task-101\'s DOM node and input field, preserving the inputs of task-102 and task-103.'
    ].join('\n'),
    internalFlow: [
      'Reconciliation with Keys:',
      '1. React compares children of the <ul> by matching keys from the previous Fiber list to the new Fiber list.',
      '2. With Unique ID: React sees that task-101 is gone. It marks task-101 for deletion, moves task-102 and task-103 up in the DOM, and retains their internal input states.',
      '3. With Index Key (key={index}):',
      '   - Previous index 0 was task-101; new index 0 is task-102.',
      '   - React assumes the item at index 0 simply updated its text, reusing the old DOM node and old uncontrolled input value!',
      '   - Result: The user\'s typed notes appear shifted to the wrong task!'
    ].join('\n'),
    whenToUse: 'Always when rendering lists of elements via .map().',
    whenNotToUse: 'Never use array index as keys if the list can be reordered, sorted, filtered, or have items inserted/deleted at arbitrary positions.',
    commonMistakes: [
      '- Generating random keys on the fly: key={Math.random()} inside the render function. This causes React to destroy and recreate the entire DOM tree on every single render, wiping focus and input state!'
    ].join('\n'),
    perfA11y: 'Stable keys allow React to reorder DOM nodes via Node.insertBefore() rather than tearing down DOM nodes, preserving browser scroll position and assistive technology focus rings.',
    realWorld: 'E-commerce shopping carts use database product IDs as keys so deleting the top item does not corrupt quantity inputs on remaining items.',
    interviewQs: [
      '**Q: Why is using array index as a key considered an anti-pattern in React?**',
      '*Spoken Answer*: "Using an array index as a key breaks state preservation whenever the list order changes. React relies on keys to determine component identity across renders. If you delete the first item in an array, the item previously at index 1 becomes index 0. Because the key (0) didn\'t change, React reuses the existing component instance and its DOM node, mutating only the text props. Any local state, uncontrolled form inputs, or CSS transitions remain tied to the wrong data, causing severe UI corruption bugs."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers audit data fetching pipelines to ensure backend APIs return deterministic primary keys (id or uuid) on every list entity, eliminating the temptation to fallback to array indexes.',
    revisionSummary: [
      '- Keys give elements a permanent identity.',
      '- MUST be unique among siblings and stable across renders.',
      '- Never use Math.random() in render.',
      '- Avoid array indexes for dynamic/mutable lists.'
    ].join('\n')
  }),

  createSection('2.7', '11. Event Handlers in JSX & Common Compilation Errors', 7, {
    whatItIs: 'How event handlers are registered and invoked in JSX, and the most frequent compilation and runtime errors encountered by React developers.',
    whyItExists: 'In standard HTML, onclick="handleClick()" expects a code string to execute. In JSX, onClick={handleClick} expects an actual JavaScript function reference.',
    problemSolved: 'Prevents infinite render loops caused by accidental immediate invocation during template evaluation.',
    prerequisites: 'JavaScript first-class functions, closures, and call-site this rules.',
    syntax: [
      '// Correct (Passing Reference):',
      '<button onClick={handleClick}>Click Me</button>',
      '',
      '// Correct (Inline Arrow with Argument):',
      '<button onClick={() => handleDelete(item.id)}>Delete</button>',
      '',
      '// FATAL ERROR (Immediate Invocation):',
      '<button onClick={handleClick()}>Infinite Loop Danger!</button>'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function CounterControls() {
  const [count, setCount] = useState(0);

  // Function reference
  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  // Function taking an argument
  const handleAddCustom = (amount) => {
    setCount(c => c + amount);
  };

  return (
    <div>
      <p>Current Count: {count}</p>
      {/* 1. Correct: Passing reference */}
      <button onClick={handleIncrement}>+1</button>

      {/* 2. Correct: Arrow function wrapping parameterized call */}
      <button onClick={() => handleAddCustom(5)}>+5</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 6-8: Declares an arrow function handler closing over setCount.',
      '- Line 19: Passes the function reference directly: onClick={handleIncrement}.',
      '- Line 22: Wraps parameterized call in an anonymous arrow function so execution is deferred until the user clicks.'
    ].join('\n'),
    internalFlow: [
      '1. During render, React evaluates JSX props.',
      '2. If onClick={fn()} is written, fn() runs immediately during the render phase!',
      '3. If fn() calls setState, it schedules a re-render.',
      '4. The re-render executes JSX again, calling fn() again -> infinite loop -> V8 throws Error: Too many re-renders.'
    ].join('\n'),
    whenToUse: 'On all interactive HTML elements (button, a, form, input).',
    whenNotToUse: 'Do not attach click listeners to non-interactive elements (div, span) without adding role="button", tabIndex={0}, and onKeyDown handlers for keyboard accessibility.',
    commonMistakes: [
      '- Immediate invocation: onClick={doSomething()} instead of onClick={doSomething}.',
      '- Forgetting that React synthetic events are pooled in React 16 and older (fixed in React 17+ where pooling was removed).'
    ].join('\n'),
    perfA11y: 'Interactive elements must support keyboard triggers. Ensure Enter and Space keys trigger action for custom clickable controls.',
    realWorld: 'Production payment flows wrap sensitive submission buttons in debounce guards or disable states to prevent duplicate API submissions on rapid double-clicking.',
    interviewQs: [
      '**Q: What happens if you write onClick={handleClick()} instead of onClick={handleClick}?**',
      '*Spoken Answer*: "Writing parentheses after the function name immediately invokes the function during the component\'s render phase, rather than passing a reference to be called upon a click event. If handleClick performs a state update, setting state triggers another render, which calls the function again immediately, trapping React in an infinite loop that crashes the application with a \'Too many re-renders\' exception."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers monitor inline arrow function allocations in hot lists, using useCallback only when passing handlers to memoized child components (React.memo) to prevent breaking reference equality.',
    revisionSummary: [
      '- Pass function references: onClick={fn}.',
      '- Wrap parameterized calls: onClick={() => fn(id)}.',
      '- Never immediately invoke handlers in JSX: onClick={fn()} causes infinite re-render loops.'
    ].join('\n')
  })
];

module.exports = {
  parts: [
    { id: 1, title: 'Part 1 — React Foundations & Architecture', sections: p1_sections },
    { id: 2, title: 'Part 2 — JSX & Rendering Fundamentals', sections: p2_sections }
  ]
};
