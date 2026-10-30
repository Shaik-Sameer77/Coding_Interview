// scratch/update_notes_vdom_testing.cjs
const fs = require('fs');
const path = require('path');

// 1. UPDATE PART 11 in scratch/react_notes_parts_8_to_14.json
const parts8to14Path = path.join(__dirname, 'react_notes_parts_8_to_14.json');
const parts8to14 = JSON.parse(fs.readFileSync(parts8to14Path, 'utf8'));

const p11Index = parts8to14.findIndex(p => p.id === 11);
if (p11Index !== -1) {
  parts8to14[p11Index] = {
    id: 11,
    title: "Part 11 — Rendering Engine, Fiber & Reconciliation",
    badge: "Engine Internals",
    color: "#c084fc",
    sections: [
      {
        id: "11.1",
        title: "30. The Virtual DOM Deep-Dive: Architecture, Diffing & Limitations",
        content: `### 1. What is the Virtual DOM (VDOM)?
The **Virtual DOM** is a lightweight, pure JavaScript object tree maintained in memory that mirrors the structure of the real browser Document Object Model (DOM). In React, when you write JSX like \`<div className="badge">Active</div>\`, Babel/Vite transpiles it into a \`jsx()\` or \`React.createElement()\` call that produces a plain JavaScript object:

\`\`\`javascript
// Simplified anatomy of a React Virtual DOM Element
{
  $$typeof: Symbol.for('react.element'), // Security guard against JSON injection
  type: 'div',
  key: null,
  ref: null,
  props: {
    className: 'badge',
    children: 'Active'
  },
  _owner: FiberNode // Pointer to the component that created it
}
\`\`\`

### 2. Why Did React Invent the Virtual DOM?
The Real DOM is an ancient API designed in the 1990s for static hyperlinked documents. Manipulating real DOM nodes directly using \`document.createElement()\` or \`node.appendChild()\` is not inherently slow in pure JavaScript execution time. 

**The real bottleneck is the Browser Rendering Engine:**
- Every time a real DOM node is inserted, removed, or has its geometry modified, the browser must recalculate styles (**Recalculate Style**), recalculate geometry and coordinates for every affected element (**Layout / Reflow**), repaint pixels to layers (**Paint**), and combine layers onto the screen (**Composite**).
- In a complex SPA with hundreds of dynamic nodes, updating nodes imperatively one-by-one triggers repeated **Layout Thrashing** that drops framerates below 60fps.
- **The Virtual DOM acts as an in-memory buffer**: React calculates all state-driven changes across the entire component tree in memory, determines the absolute minimum set of real DOM mutations needed, and flushes them to the real DOM in a single synchronized batch during the Commit Phase.

### 3. The Blueprint Analogy (Mental Model)
Think of the real DOM as a **physical 50-story skyscraper made of concrete and steel**. Think of the Virtual DOM as an **architect's digital CAD blueprint on a computer screen**.
- If you want to change the color of the 40th floor and move a doorway, knocking down physical walls and rebuilding them iteratively is astronomically expensive.
- Instead, you open the CAD blueprint on your computer, experiment, calculate measurements, and diff the new blueprint against the previous blueprint.
- Once the diff is computed, you hand the construction team a precise punch-list: *"Only repaint wall 40B and move door 40D."* The physical building is touched only where strictly necessary.

### 4. The Reconciliation Diffing Algorithm ($O(N)$ vs $O(N^3)$)
The state of computer science offers general tree-transformation algorithms (like Levenshtein tree edit distance), but their algorithmic complexity is $O(N^3)$. For a tree of 1,000 UI elements, computing the diff would require $1,000,000,000$ operations—freezing the browser for seconds!

React solves this by applying two **heuristic assumptions** that reduce the diffing complexity to **$O(N)$**:
1. **Elements of different types generate completely different trees**: If a \`<div>\` is replaced by a \`<span>\`, React does not attempt to diff their children. It unmounts the old \`<div>\` and all its descendants, completely destroying their state, and mounts a fresh \`<span>\` tree.
2. **The developer can hint at element stability using the \`key\` prop**: When rendering collections of child elements, React matches children in the previous tree with children in the new tree using keys. Without unique keys, React resorts to positional index matching, causing state corruption and re-rendering bugs.

### 5. Virtual DOM vs Real DOM: Architectural Comparison

| Dimension | Real DOM (Host Browser) | Virtual DOM (React Memory Tree) |
| :--- | :--- | :--- |
| **Data Structure** | C++ tree representation inside browser engine | Plain JavaScript objects in V8 Heap |
| **Creation Cost** | Heavy (implements ~200+ properties of \`HTMLElement\`) | Extremely lightweight (just 5-6 object properties) |
| **Mutation Cost** | Triggers layout recalculation, reflow, and repaint | Microseconds of JS arithmetic in memory |
| **Direct Access** | Native browser API (\`document.querySelector\`) | React internal reconciler abstraction |
| **Cross-Platform** | Web browsers only | Platform-agnostic (React DOM, React Native, React Three Fiber) |

### 6. Limitations of the Virtual DOM & Modern Realities
In early marketing, React claimed *"The Virtual DOM is faster than the Real DOM."* Modern senior engineers recognize the nuanced reality:
1. **Memory Overhead**: Storing two full virtual representation trees in memory (\`current\` and \`workInProgress\`) consumes significant JavaScript heap space.
2. **Garbage Collection (GC) Pressure**: Re-creating thousands of temporary JavaScript element objects on high-frequency renders (e.g. 60fps animations or rapid typing) triggers V8 garbage collection pauses, causing noticeable UI jank.
3. **Not Faster than Optimized Vanilla JS**: A skilled engineer writing hand-tuned, pinpoint DOM operations (\`el.textContent = count\`) will always outperform Virtual DOM diffing because diffing still has to run before the DOM update. React's value is **declarative developer productivity and maintainability at scale**, not raw peak micro-benchmark speed.
4. **Modern Alternatives**:
   - **Svelte**: Compiles components into precise imperative JavaScript at build time. Zero Virtual DOM runtime overhead.
   - **Solid.js**: Uses fine-grained reactive signals to update specific DOM text nodes directly with no tree diffing.
   - **React Compiler (React 19)**: Automatically analyzes dependencies at build time to memoize component subtrees, skipping both render execution and VDOM diffing for unchanged nodes.`,
        comparisonTable: [
          { feature: "Memory Allocation", vdom: "Dual tree in JS heap (Current & WorkInProgress)", realDom: "Native browser C++ DOM nodes" },
          { feature: "Diffing Speed", vdom: "Sub-millisecond JS object comparison (O(N))", realDom: "N/A (Mutations applied directly)" },
          { feature: "Layout/Reflow Trigger", vdom: "None during diffing; only on Commit batch", realDom: "Immediately on unbatched layout property reads/writes" },
          { feature: "Platform Target", vdom: "Universal (DOM, iOS, Android, Canvas, Terminal)", realDom: "HTML browsers only" }
        ],
        code: `// Deep-dive: Inspecting what React.createElement actually creates
import React from 'react';

// When you write this JSX:
const element = (
  <button id="save-btn" className="btn-primary" onClick={() => console.log('Saved!')}>
    <span>Save Changes</span>
  </button>
);

// Babel/Vite transpiles it to:
// React.createElement(type, props, ...children)
const compiledElement = React.createElement(
  'button',
  { id: 'save-btn', className: 'btn-primary', onClick: () => console.log('Saved!') },
  React.createElement('span', null, 'Save Changes')
);

// Log the actual Virtual DOM object:
console.log(compiledElement);
/* Output:
{
  $$typeof: Symbol(react.element),
  type: 'button',
  key: null,
  ref: null,
  props: {
    id: 'save-btn',
    className: 'btn-primary',
    onClick: [Function],
    children: {
      $$typeof: Symbol(react.element),
      type: 'span',
      key: null,
      ref: null,
      props: { children: 'Save Changes' }
    }
  }
}
*/`,
        keyTakeaways: [
          "The Virtual DOM is not a separate thread or magical browser feature; it is an ordinary JavaScript object tree in the V8 heap.",
          "React's heuristic diffing achieves O(N) linear time by assuming different element types produce different trees and keys identify stable siblings.",
          "Render does NOT mean DOM update: if the newly calculated VDOM tree matches the previous tree, 0 real DOM mutations occur.",
          "Virtual DOM enables declarative programming and cross-platform abstractions (React Native, React Three Fiber) at the cost of heap memory and GC overhead."
        ]
      },
      {
        id: "11.2",
        title: "31. The Two Phases: Render vs Commit Phase",
        content: `### 1. Render Phase (Pure, Interruptible Work)
- React calls component functions from the top down to compute the next React element tree (Virtual DOM).
- Runs the **Reconciliation Diffing Algorithm** to determine which host DOM mutations are required.
- **Rules of Render Phase**: Must be **100% pure** with zero side effects. In Concurrent Mode (React 18/19), React can pause, yield to browser user input, split work across multiple frames, or completely abandon a render calculation if newer state arrives.
- Never mutate the DOM, set timers, or initiate HTTP requests inside the render phase.

### 2. Commit Phase (Synchronous, Mutative DOM Application)
- React takes the finished work-in-progress fiber tree and applies real host mutations to the DOM in a single synchronous pass.
- Inserts nodes (\`appendChild\`), removes nodes (\`removeChild\`), and updates attributes/styles.
- Synchronously executes \`useLayoutEffect\` cleanups and setup functions before browser paint.
- The browser paints the updated DOM tree to the screen.
- React asynchronously executes \`useEffect\` cleanups and setup functions after paint has completed.

### 3. Why a "Render" Does Not Mean a "DOM Update"
One of the most common junior misconceptions is equating component rendering with screen painting.
- If component \`<Card />\` re-renders because its parent re-rendered, React executes the \`Card()\` function and constructs a new Virtual DOM object.
- React diffs this object against the previous \`Card\` VDOM object.
- If all props, children, and attributes are identical, the diff result is an empty set of mutations (\`null\`).
- The commit phase does **nothing to the real DOM**. No browser layout or repaint occurs.
- However, the JavaScript execution time of running \`Card()\` still consumed CPU cycles. This is why memoization tools like \`React.memo\` exist—to skip the render phase altogether when props have not changed.`,
        comparisonTable: [
          { feature: "Side Effects Allowed", render: "Strictly NO (pure calculation only)", commit: "YES (DOM mutation, useLayoutEffect, useEffect)" },
          { feature: "Can Be Interrupted", render: "YES (Time-slicing, Suspense, Concurrent Mode)", commit: "NO (Must complete synchronously to prevent visual tearing)" },
          { feature: "Frequency", render: "Can run multiple times for a single user update", commit: "Runs exactly once per completed render batch" }
        ],
        code: `// Demonstrating Render vs Commit execution order
import React, { useState, useEffect, useLayoutEffect } from 'react';

export function LifecycleVisualizer() {
  const [count, setCount] = useState(0);

  // 1. RENDER PHASE (runs on every state change)
  console.log('[Render Phase] Component function executing. Count:', count);

  // 2. COMMIT PHASE (Synchronous layout pass before screen paint)
  useLayoutEffect(() => {
    console.log('[Commit Phase - useLayoutEffect] DOM mutated, about to paint. Count:', count);
    return () => console.log('[Commit Phase - useLayoutEffect Cleanup]');
  }, [count]);

  // 3. POST-PAINT PASSIVE PHASE (Asynchronous after browser painted screen)
  useEffect(() => {
    console.log('[Post-Paint - useEffect] Screen painted! Count:', count);
    return () => console.log('[Post-Paint - useEffect Cleanup]');
  }, [count]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
        keyTakeaways: [
          "Render phase calculates the VDOM diff and can be paused or restarted by React Scheduler.",
          "Commit phase mutates the real DOM synchronously to guarantee visual consistency and prevent UI tearing.",
          "useLayoutEffect runs synchronously during commit before browser paint; useEffect runs asynchronously after paint.",
          "A component render only results in a real DOM update if the Virtual DOM diff produces actual property or structural changes."
        ]
      },
      {
        id: "11.3",
        title: "32. Fiber Architecture & The Work Loop",
        content: `### 1. Why Did React Replace the Stack Reconciler?
Prior to React 16, React used the **Stack Reconciler**. It traversed the component tree recursively down the JavaScript call stack.
- Once recursion began, the JavaScript main thread was 100% blocked until the entire tree was diffed and mounted.
- If rendering a 5,000-row table took 80ms, every user click, keypress, and CSS animation was completely frozen for 80ms, resulting in dropped frames and unresponsive UI.
- JavaScript has a single main thread: it cannot pause a native recursive call stack to let an input event run and then resume where it left off.

### 2. The Fiber Node: A Virtual Call Stack on the Heap
To solve this, React re-implemented the call stack as an explicit **singly-linked list of Fiber objects stored on the heap**.
Each Fiber node corresponds to a component instance and holds three vital navigational pointers:
- \`child\`: Points to the component's first direct child.
- \`sibling\`: Points to the component's next sibling.
- \`return\`: Points to the parent fiber node (the node to return to when child work finishes).

\`\`\`
          [App Fiber]
               |
            child
               v
        [Sidebar Fiber] -- sibling --> [Main Fiber]
                                            |
                                         child
                                            v
                                       [Header Fiber]
\`\`\`

Because this tree traversal is implemented as a pointer loop (\`workInProgress = workInProgress.child || workInProgress.sibling || workInProgress.return\`) rather than recursive functions, React can pause the loop at any arbitrary Fiber node!

### 3. The Work Loop & Time Slicing
React uses a continuous cooperative scheduler loop:
\`\`\`javascript
function workLoopConcurrent() {
  // Perform work until deadline runs out or tree is finished
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
\`\`\`
- \`shouldYield()\`: Checks if the current 5ms frame slice has expired. If a user event (such as typing into an input) is waiting in the browser event queue, React yields control back to the browser.
- Once the browser finishes handling the user event, React resumes work on the next fiber in the linked list.
- **Double Buffering**: React maintains two trees simultaneously:
  1. \`current\`: The fiber tree currently visible on the screen.
  2. \`workInProgress\`: The fiber tree being constructed in memory.
  Once \`workInProgress\` is finished, React swaps the root pointer in $O(1)$ time—instantly switching screens without intermediate flicker.`,
        comparisonTable: [
          { feature: "Reconciler", stack: "Stack Reconciler (React 15 and below)", fiber: "Fiber Reconciler (React 16+ to React 19)" },
          { feature: "Data Structure", stack: "Native recursion on JS call stack", fiber: "Singly linked list of Fiber nodes on heap" },
          { feature: "Interruptible", stack: "NO (Synchronous lock)", fiber: "YES (Cooperative time-slicing via Scheduler)" },
          { feature: "Prioritization", stack: "All updates have identical priority", fiber: "Lane-based priority (Immediate, User-Blocking, Normal, Idle)" }
        ],
        code: `// Conceptual model of a Fiber Node and Work Loop
class SimpleFiberNode {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    this.stateNode = null; // Real DOM node reference
    this.child = null;     // First child pointer
    this.sibling = null;   // Next sibling pointer
    this.return = null;    // Parent pointer
    this.alternate = null; // Pointer to current/workInProgress counterpart
    this.flags = null;     // Placement, Update, Deletion flags
  }
}

// How React walks the Fiber tree iteratively without recursion
function performUnitOfWork(fiber) {
  // 1. Process current fiber (execute component, compute hooks)
  const nextChildren = fiber.type(fiber.props);
  
  // 2. Return child if exists (drill down)
  if (fiber.child) {
    return fiber.child;
  }
  
  // 3. Otherwise return sibling, or bubble up to parent's sibling
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
  return null;
}`,
        keyTakeaways: [
          "Fiber replaced the synchronous call stack with a heap-allocated singly-linked list of work units.",
          "The three key fiber pointers are child, sibling, and return.",
          "Time-slicing enables React to yield control to the browser every ~5ms so high-priority user input never stutters.",
          "Double buffering swaps the current and workInProgress trees in O(1) time during commit."
        ]
      }
    ]
  };
  fs.writeFileSync(parts8to14Path, JSON.stringify(parts8to14, null, 2), 'utf8');
  console.log('Successfully updated Part 11 with Virtual DOM deep-dive in react_notes_parts_8_to_14.json');
}

// 2. UPDATE PART 16 in scratch/react_notes_parts_15_to_21.json
const parts15to21Path = path.join(__dirname, 'react_notes_parts_15_to_21.json');
const parts15to21 = JSON.parse(fs.readFileSync(parts15to21Path, 'utf8'));

const p16Index = parts15to21.findIndex(p => p.id === 16);
if (p16Index !== -1) {
  parts15to21[p16Index] = {
    id: 16,
    title: "Part 16 — React Testing from Absolute Zero",
    badge: "Testing Master",
    color: "#10b981",
    sections: [
      {
        id: "16.1",
        title: "39. Testing Foundations: The Testing Pyramid & RTL Philosophy",
        content: `### 1. What is Software Testing? (The Real-World Analogy)
Imagine you are an automotive engineer manufacturing a passenger car. 
- You would never wait until the car is driving down the highway at 70 mph with a customer inside to find out if the brakes work.
- Before installing the brake caliper into the vehicle, you test the hydraulic piston in isolation (**Unit Test**).
- You connect the brake pedal, master cylinder, and brake lines together on a test chassis to verify the system works in unison (**Integration / Component Test**).
- Finally, you test drive the fully assembled vehicle on a closed track in rain, snow, and emergency stops (**End-to-End Test**).

**Automated testing in software is the exact same discipline:** writing code that programmatically runs your components, inputs realistic user actions, and validates that the output matches expectations before your real users ever see it.

### 2. Manual Testing vs Automated Testing
- **Manual Testing**: Clicking through your app by hand in the browser. It is slow, error-prone, unrepeatable, and impossible to scale across 500 features before every deployment.
- **Automated Testing**: Running 200 test files in 5 seconds in your terminal or Continuous Integration (CI) pipeline on every git commit. It guarantees that adding Feature B never silently breaks Feature A (**Zero Regressions**).

### 3. The Modern Testing Trophy (Why Component Tests Reign Supreme)
In traditional backend engineering, developers adhered to the **Testing Pyramid** (thousands of micro unit tests, very few integration tests, almost zero E2E).
For modern frontend applications, **The Testing Trophy** (advocated by Kent C. Dodds and Google) provides the highest return on investment (ROI):
1. **End-to-End (E2E)**: Tests full browser-to-backend workflows (e.g. Playwright / Cypress). High confidence, but slow to run and prone to network flakiness.
2. **Integration / Component Tests (The Bulk of the Trophy)**: Testing React components with simulated user interactions in a virtual DOM environment (React Testing Library + Vitest). Fast, deterministic, and tests real user behavior.
3. **Unit Tests**: Testing pure utility functions, math helpers, or complex state reducers.
4. **Static Analysis**: TypeScript and ESLint catching syntax errors, typos, and missing props before code even runs.

### 4. The React Testing Library (RTL) Philosophy
> *"The more your tests resemble the way your software is used, the more confidence they can give you."* — Kent C. Dodds

In the early days of React, developers used libraries like **Enzyme** that tested **implementation details**:
\`\`\`javascript
// ❌ WRONG: Fragile Enzyme-style test (Testing Implementation Details)
const wrapper = shallow(<Counter />);
expect(wrapper.state('count')).toBe(0); // Peeking at internal component state!
wrapper.find('button').prop('onClick')(); // Directly executing handler props!
expect(wrapper.state('count')).toBe(1);
\`\`\`
**Why this is terrible:** If you refactor \`<Counter />\` from class component \`this.state\` to \`useState\`, or rename the internal state variable from \`count\` to \`value\`, your test **fails catastrophically even though the component still works perfectly for real users!**

**The RTL Behavior-Driven Way:**
\`\`\`javascript
// ✅ CORRECT: Testing user behavior through the rendered DOM
render(<Counter />);
expect(screen.getByRole('heading', { name: /count: 0/i })).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByRole('heading', { name: /count: 1/i })).toBeInTheDocument();
\`\`\`
RTL does not care whether you use \`useState\`, \`useReducer\`, Redux, or Zustand. As long as the button is clickable and the screen updates, the test passes. You can refactor internal code with 100% confidence.`,
        comparisonTable: [
          { feature: "Testing Paradigm", rtl: "Behavior-Driven (User perspective)", enzyme: "Implementation-Driven (Internal state & methods)" },
          { feature: "Refactor Resilience", rtl: "High (Tests pass if user experience is preserved)", enzyme: "Extremely low (Breaks on internal variable renames)" },
          { feature: "Accessibility Incentive", rtl: "Mandatory (Forces use of accessible roles & labels)", enzyme: "None (Encourages CSS class selectors)" },
          { feature: "Environment", rtl: "DOM-compliant (jsdom or browser)", enzyme: "Shallow rendering without true DOM hierarchy" }
        ],
        code: `// Comparison: Fragile vs Robust Testing Approach
// 1. The Component under test:
function StatusIndicator({ isOnline }) {
  const [internalCode, setInternalCode] = useState(isOnline ? 200 : 503);
  return (
    <div role="status" aria-label="System Status">
      {isOnline ? 'System Operational' : 'System Degraded'}
    </div>
  );
}

// ❌ FRAGILE TEST (Tests internal state - breaks when internalCode is removed)
test('bad test', () => {
  const wrapper = shallow(<StatusIndicator isOnline={true} />);
  expect(wrapper.state('internalCode')).toBe(200); // ❌ Implementation leak!
});

// ✅ ROBUST RTL TEST (Tests what a user or screen reader sees)
import { render, screen } from '@testing-library/react';

test('renders operational status when isOnline is true', () => {
  render(<StatusIndicator isOnline={true} />);
  const statusElement = screen.getByRole('status', { name: /system status/i });
  expect(statusElement).toHaveTextContent(/system operational/i);
});`,
        keyTakeaways: [
          "Automated tests verify that your software works before real users encounter bugs in production.",
          "The Testing Trophy prioritizes component/integration tests because they deliver the highest confidence for the lowest maintenance cost.",
          "Never test internal component state, private variable names, or internal handler props.",
          "Always test from the user's perspective: find elements by accessible roles and text, interact via realistic events, and assert on visible DOM changes."
        ]
      },
      {
        id: "16.2",
        title: "40. The React Testing Ecosystem & Zero-Config Setup",
        content: `### 1. The Core Tools Explained
When learning React testing from zero, the multiple library names can feel overwhelming. Here is the exact role of each tool:

1. **Vitest (or Jest)** — *The Test Runner & Assertion Engine*:
   - Finds test files (e.g. \`*.test.jsx\` or \`*.spec.tsx\`).
   - Executes tests in parallel with fast Hot Module Replacement (HMR).
   - Provides test lifecycle functions (\`describe\`, \`it\`, \`test\`, \`beforeEach\`, \`afterEach\`) and assertion methods (\`expect(x).toBe(y)\`).
2. **\`@testing-library/react\` (RTL)** — *The Component Mounter & Query Suite*:
   - Mounts React components into a virtual DOM environment using \`render(<MyComponent />)\`.
   - Provides the \`screen\` object to search for rendered elements using accessible queries (\`screen.getByRole\`, \`screen.getByText\`).
   - Automatically cleans up the DOM after every single test to prevent test cross-contamination.
3. **\`@testing-library/user-event\`** — *The Realistic User Simulator*:
   - Simulates complete browser interaction events in realistic sequence: mouse hover, focus, keydown, keypress, input change, keyup, and click.
4. **\`@testing-library/jest-dom\`** — *The Human-Readable DOM Matchers*:
   - Adds custom matchers to \`expect\`, such as \`.toBeInTheDocument()\`, \`.toBeVisible()\`, \`.toBeDisabled()\`, \`.toHaveClass()\`, and \`.toHaveValue()\`.
5. **\`jsdom\`** — *The Headless Browser Simulator*:
   - A pure JavaScript implementation of browser Web Standards (DOM, HTML5, window, document) that runs inside Node.js without needing to open a slow physical browser window.

### 2. Setting Up Vitest & RTL in a Vite React Project Step-by-Step
To configure testing from scratch in any modern React application, install the dependencies:
\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
\`\`\`

**Step 1: Configure \`vite.config.js\` (or \`vitest.config.js\`)**
\`\`\`javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables describe, it, expect globally without importing
    environment: 'jsdom', // Simulates browser DOM in Node.js
    setupFiles: './src/setupTests.js', // Runs setup before each test file
    css: true, // Processes CSS modules if needed
  },
});
\`\`\`

**Step 2: Create \`src/setupTests.js\`**
\`\`\`javascript
// Extends Vitest expect with jest-dom matchers (toBeInTheDocument, etc.)
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically clean up DOM after each test run
afterEach(() => {
  cleanup();
});
\`\`\`

**Step 3: Add npm script to \`package.json\`**
\`\`\`json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
\`\`\``,
        comparisonTable: [
          { tool: "Vitest", responsibility: "Test Runner & CLI", replaces: "Jest (faster, native ESM & Vite config)" },
          { tool: "@testing-library/react", responsibility: "Mounting & Querying DOM", replaces: "Enzyme / ReactTestUtils" },
          { tool: "@testing-library/user-event", responsibility: "Realistic user dispatch", replaces: "fireEvent (which skips browser bubbling/focus)" },
          { tool: "jsdom", responsibility: "In-memory DOM environment", replaces: "Real browser headless instances (Chrome/Puppeteer for unit)" }
        ],
        code: `// Example package.json configuration snippet
{
  "name": "my-react-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.2.1",
    "jsdom": "^24.0.0",
    "vite": "^5.2.0",
    "vitest": "^1.4.0"
  }
}`,
        keyTakeaways: [
          "Vitest is the test runner that discovers and executes test files.",
          "React Testing Library mounts components and provides accessible query methods.",
          "user-event simulates realistic user keyboard and mouse input.",
          "jest-dom provides expressive matchers like .toBeInTheDocument() and .toBeDisabled()."
        ]
      },
      {
        id: "16.3",
        title: "41. Writing Your First React Test: Step-by-Step with Paired Files",
        content: `### 1. The Anatomy of a React Test
Let's build a real component and its corresponding test file from absolute zero.

Notice the file naming convention:
- Component file: \`src/components/Counter.jsx\`
- Test file: \`src/components/Counter.test.jsx\` (or \`Counter.spec.jsx\`). Vitest automatically scans your project and executes any file matching \`*.test.*\` or \`*.spec.*\`.

### 2. Component File: \`src/components/Counter.jsx\`
Here is our production-ready Counter component:
\`\`\`jsx
import React, { useState } from 'react';

export function Counter({ initialCount = 0, step = 1 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <section aria-labelledby="counter-title" style={{ padding: 16 }}>
      <h2 id="counter-title">Interactive Counter</h2>
      
      <p role="status" aria-live="polite">
        Current Count: <strong data-testid="count-value">{count}</strong>
      </p>

      {count < 0 && <p role="alert" style={{ color: 'red' }}>Warning: Negative count!</p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button 
          type="button" 
          onClick={() => setCount(c => c - step)}
          aria-label="Decrement count"
        >
          - Decrement
        </button>

        <button 
          type="button" 
          onClick={() => setCount(initialCount)}
          disabled={count === initialCount}
        >
          Reset
        </button>

        <button 
          type="button" 
          onClick={() => setCount(c => c + step)}
          aria-label="Increment count"
        >
          + Increment
        </button>
      </div>
    </section>
  );
}
\`\`\`

### 3. Test File: \`src/components/Counter.test.jsx\`
Now, here is the complete, line-by-line test file:
\`\`\`jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('renders with the default initial count of 0', () => {
    // 1. ARRANGE: Mount the component into the virtual jsdom container
    render(<Counter />);

    // 2. ACT: Find the heading and the status elements
    const heading = screen.getByRole('heading', { name: /interactive counter/i });
    const countStatus = screen.getByRole('status');
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // 3. ASSERT: Verify initial UI state
    expect(heading).toBeInTheDocument();
    expect(countStatus).toHaveTextContent('Current Count: 0');
    expect(resetButton).toBeDisabled(); // Reset should be disabled initially
  });

  it('increments the count when the increment button is clicked', async () => {
    // 1. ARRANGE: Setup user-event instance and render component
    const user = userEvent.setup();
    render(<Counter initialCount={5} step={2} />);

    // 2. ACT: Find button by accessible name and click it
    const incrementBtn = screen.getByRole('button', { name: /increment count/i });
    await user.click(incrementBtn);

    // 3. ASSERT: Count increases from 5 to 7 (5 + step of 2)
    const countStatus = screen.getByRole('status');
    expect(countStatus).toHaveTextContent('Current Count: 7');
  });

  it('shows an alert warning when count drops below zero', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);

    const decrementBtn = screen.getByRole('button', { name: /decrement count/i });
    await user.click(decrementBtn);

    // Assert alert appears in DOM
    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent(/warning: negative count!/i);
  });

  it('resets count back to initial value and disables reset button', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={10} />);

    const incrementBtn = screen.getByRole('button', { name: /increment count/i });
    const resetBtn = screen.getByRole('button', { name: /reset/i });

    // Click increment twice
    await user.click(incrementBtn);
    await user.click(incrementBtn);
    expect(screen.getByRole('status')).toHaveTextContent('Current Count: 12');
    expect(resetBtn).toBeEnabled();

    // Click reset
    await user.click(resetBtn);
    expect(screen.getByRole('status')).toHaveTextContent('Current Count: 10');
    expect(resetBtn).toBeDisabled();
  });
});
\`\`\`

### 4. Line-by-Line Breakdown of the Test Code
- \`describe('Counter Component', () => { ... })\`: Groups related tests into a test suite block for clear organization and terminal reporting.
- \`it('should ...')\` (or \`test('should ...')\`): Defines an individual test case. It must focus on verifying one specific user behavior.
- \`const user = userEvent.setup()\`: Initializes the user-event simulation engine before rendering. Always do this for async event dispatch!
- \`render(<Counter initialCount={5} />)\`: Mounts the React component into an isolated \`jsdom\` \`<div>\` attached to \`document.body\`.
- \`screen.getByRole('button', { name: /increment count/i })\`: Queries the DOM using accessibility standards. The regular expression \`/increment count/i\` performs a case-insensitive search.
- \`await user.click(button)\`: Asynchronously simulates a real mouse click. It returns a Promise, so the test function must be marked \`async\`!
- \`expect(countStatus).toHaveTextContent('Current Count: 7')\`: The assertion that validates the actual DOM text matches our expected outcome.

### 5. How to Read Test Failures in the Terminal
When a test fails, Vitest and RTL print an incredibly helpful diagnostic output. 
For example, if an element was not found, you will see:
\`\`\`
FAIL  src/components/Counter.test.jsx > Counter Component > increments count
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "/increment/i"

Here are the accessible roles currently available:

  button:
  Name "Decrement count":
  <button aria-label="Decrement count" type="button" />
  --------------------------------------------------
  Name "+ Add":
  <button type="button">+ Add</button>

Ignored nodes: comments, script, style
<div>
  <section aria-labelledby="counter-title">
    ...
  </section>
</div>
\`\`\`
**How to diagnose this error:** Look at the *"accessible roles currently available"* list printed by RTL! In this case, it shows the button text was actually \`"+ Add"\`, not \`"Increment"\`. You immediately know your selector had a typo!`,
        comparisonTable: [
          { phase: "1. Arrange", meaning: "Prepare the environment, props, mock handlers, and mount component via render()", rtlMethod: "render(<Component />)" },
          { phase: "2. Act", meaning: "Perform user actions (typing, clicking, navigating)", rtlMethod: "await user.click(), await user.type()" },
          { phase: "3. Assert", meaning: "Verify that the rendered DOM reflects the expected changes", rtlMethod: "expect(element).toBeInTheDocument()" }
        ],
        code: `// Quick Reference: AAA Pattern in React Testing
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('demonstrating Arrange-Act-Assert pattern', async () => {
  // 1. ARRANGE
  const user = userEvent.setup();
  render(<Counter initialCount={0} />);
  const button = screen.getByRole('button', { name: /increment count/i });
  const display = screen.getByRole('status');

  // 2. ACT
  await user.click(button);

  // 3. ASSERT
  expect(display).toHaveTextContent('Current Count: 1');
});`,
        keyTakeaways: [
          "Every test follows the Arrange-Act-Assert (AAA) pattern.",
          "Vitest automatically finds and executes all files ending in .test.jsx or .spec.jsx.",
          "userEvent.setup() must be called before rendering for authentic browser event simulation.",
          "When a query fails, read the DOM dump and available roles printed in the terminal to immediately identify selector mismatches."
        ]
      },
      {
        id: "16.4",
        title: "42. RTL Query Hierarchy: getBy vs queryBy vs findBy",
        content: `### 1. The Three Query Types Explained
React Testing Library gives you three prefixes for finding elements on the screen. Choosing the wrong prefix is the #1 mistake made by junior developers:

| Prefix | Behavior When 0 Found | Behavior When 1 Found | Behavior When >1 Found | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **\`getBy...\`** | 💥 **Throws error immediately** | Returns element | 💥 Throws error | Asserting elements that **MUST exist right now** |
| **\`queryBy...\`** | ✅ **Returns \`null\`** | Returns element | 💥 Throws error | Asserting elements that **MUST NOT exist** |
| **\`findBy...\`** | ⏳ **Waits up to 1000ms**, then throws | Returns element | 💥 Throws error | Asserting elements that **appear asynchronously** (after fetch or timer) |

### 2. The Golden Rule of Negative Assertions (\`queryBy\`)
If you want to verify that an error message is **NOT** on the screen:
\`\`\`javascript
// ❌ WRONG: getBy throws an error immediately and crashes your test!
expect(screen.getByText(/invalid password/i)).not.toBeInTheDocument();

// ✅ CORRECT: queryBy returns null safely without throwing
expect(screen.queryByText(/invalid password/i)).not.toBeInTheDocument();
expect(screen.queryByText(/invalid password/i)).toBeNull();
\`\`\`

### 3. The Accessibility-First Query Priority Hierarchy
Always prefer queries in this order of priority. This forces your application to be 100% accessible to screen readers and assistive technology:

1. **\`getByRole(role, { name })\`** (Top Priority - Used 80% of the time)
   - Accessible roles: \`button\`, \`heading\`, \`textbox\`, \`checkbox\`, \`combobox\`, \`alert\`, \`dialog\`, \`status\`, \`navigation\`, \`list\`, \`listitem\`.
   - Accessible name: The visible text inside the button, the \`aria-label\`, or the associated \`<label>\`.
   - Example: \`screen.getByRole('button', { name: /submit order/i })\`
2. **\`getByLabelText(text)\`**
   - For form inputs that have an associated \`<label htmlFor="id">\`.
   - Example: \`screen.getByLabelText(/email address/i)\`
3. **\`getByPlaceholderText(text)\`**
   - Only when an input does not have a visible label (e.g. search bars).
4. **\`getByText(text)\`**
   - For non-interactive elements like paragraph text, spans, or static headers.
5. **\`getByDisplayValue(value)\`**
   - For verifying the currently typed value in a form control.
6. **\`getByTestId(id)\`** (Absolute Last Resort)
   - Only use when an element has no accessible role or dynamic text (e.g. an SVG chart canvas).
   - Requires adding \`data-testid="chart-canvas"\` to the JSX.

### 4. Scoping Queries with \`within()\`
When your page contains multiple cards, list items, or tables that have identical buttons (e.g. five "Delete" buttons in a list), querying \`screen.getByRole('button', { name: /delete/i })\` will throw an error: *"Found multiple elements"*.

Use \`within()\` to scope your query to a specific parent element:
\`\`\`jsx
import { render, screen, within } from '@testing-library/react';

test('deletes only the second item in a list', async () => {
  const user = userEvent.setup();
  render(<UserDirectory />);

  // Find all user card list items
  const userCards = screen.getAllByRole('listitem');
  expect(userCards).toHaveLength(3);

  // Scope search to the second card only!
  const secondCard = userCards[1];
  const deleteBtnInSecondCard = within(secondCard).getByRole('button', { name: /delete/i });

  await user.click(deleteBtnInSecondCard);
  expect(within(secondCard).queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
});
\`\`\``,
        comparisonTable: [
          { query: "getByRole", priority: "1 (Highest)", why: "Reflects how screen readers and keyboard users perceive the element" },
          { query: "getByLabelText", priority: "2", why: "Ensures form controls are properly linked to labels" },
          { query: "getByPlaceholderText", priority: "3", why: "Acceptable fallback for search inputs" },
          { query: "getByText", priority: "4", why: "Finds plain text outside of interactive controls" },
          { query: "getByTestId", priority: "6 (Lowest)", why: "Tests implementation artifacts; real users do not see test IDs" }
        ],
        code: `// Practical query demonstration
import { render, screen, within } from '@testing-library/react';

function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Action</th></tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} data-testid={\`user-row-\${u.id}\`}>
            <td>{u.name}</td>
            <td><button aria-label={\`Edit \${u.name}\`}>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

test('demonstrating within scoping', () => {
  render(<UserTable users={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]} />);

  // Finding Bob's edit button using accessible name:
  const bobEditBtn = screen.getByRole('button', { name: 'Edit Bob' });
  expect(bobEditBtn).toBeInTheDocument();

  // Or scoping within Bob's row:
  const bobRow = screen.getByTestId('user-row-2');
  const editBtn = within(bobRow).getByRole('button', { name: /edit/i });
  expect(editBtn).toBeInTheDocument();
});`,
        keyTakeaways: [
          "Use getBy for elements that must exist immediately.",
          "Use queryBy with .not.toBeInTheDocument() to verify an element does not exist.",
          "Use findBy for elements that appear asynchronously after network requests or state delays.",
          "Use within(parentContainer) to scope queries when multiple elements share identical names."
        ]
      },
      {
        id: "16.5",
        title: "43. Simulating Realistic User Interactions with userEvent",
        content: `### 1. Why \`userEvent\` is Superior to \`fireEvent\`
React Testing Library originally included \`fireEvent\`.
- \`fireEvent.click(button)\`: Dispatches a synthetic DOM click event directly to the button. It does not check if the button is disabled, does not move focus, and does not fire \`mouseenter\`, \`mousedown\`, or \`mouseup\`.
- \`userEvent.click(button)\`: **Simulates real browser behavior**. It checks if the button is physically visible and clickable. If the button has \`disabled\`, \`userEvent\` refuses to click it—just like a real human user cannot click a disabled button!
- When typing, \`fireEvent.change(input, { target: { value: 'abc' } })\` dumps the entire string into the input at once. \`userEvent.type(input, 'abc')\` fires keydown, keypress, input, and keyup for **every individual character**, properly triggering debounces and validation handlers!

### 2. Component File: \`src/components/LoginForm.jsx\`
A real-world login form with validation, password visibility toggle, loading state, and error handling:
\`\`\`jsx
import React, { useState } from 'react';

export function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\\S+@\\S+\\.\\S+/.test(email)) errs.email = 'Invalid email format';
    
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setErrors({ server: err.message || 'Login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign In Form" style={{ maxWidth: 360 }}>
      <h2>Sign In</h2>

      {errors.server && (
        <div role="alert" style={{ color: 'red', marginBottom: 12 }}>
          {errors.server}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          style={{ width: '100%', display: 'block', marginTop: 4 }}
        />
        {errors.email && (
          <span id="email-error" role="alert" style={{ color: 'red', fontSize: 12 }}>
            {errors.email}
          </span>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="login-password">Password</label>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && (
          <span id="password-error" role="alert" style={{ color: 'red', fontSize: 12 }}>
            {errors.password}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 8 }}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
\`\`\`

### 3. Test File: \`src/components/LoginForm.test.jsx\`
\`\`\`jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { LoginForm } from './LoginForm';

describe('LoginForm Component', () => {
  it('renders all form fields empty initially', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toHaveValue('');
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  it('validates required fields when submitted empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    // Click submit without filling anything
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    // Verify validation errors appear
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('toggles password visibility between masked and plain text', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleBtn = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    // Click again to hide
    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits valid credentials successfully', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue({ success: true });
    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Type credentials
    await user.type(emailInput, 'developer@example.com');
    await user.type(passwordInput, 'secret123');

    // Submit form
    await user.click(submitBtn);

    // Verify submission handler was called with correct payload
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'developer@example.com',
      password: 'secret123'
    });
  });

  it('displays server error message when submission rejects', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Invalid email or password'));
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify server error alert is rendered
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid email or password/i);
  });
});
\`\`\``,
        comparisonTable: [
          { method: "user.type(input, 'text')", purpose: "Types text character-by-character firing all keyboard events" },
          { method: "user.clear(input)", purpose: "Selects all text and backspaces, triggering change events" },
          { method: "user.click(element)", purpose: "Hovers, focuses, clicks (fails safely if element is disabled)" },
          { method: "user.keyboard('{Enter}')", purpose: "Simulates pressing physical keyboard keys like Enter or Escape" }
        ],
        code: `// Quick snippet: Simulating keyboard navigation
import userEvent from '@testing-library/user-event';

test('submitting form via Enter key', async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={handleSubmit} />);
  
  const emailInput = screen.getByLabelText(/email address/i);
  await user.type(emailInput, 'john@example.com{Enter}');
  
  // Enter key in input triggers form submit!
});`,
        keyTakeaways: [
          "userEvent provides authentic browser simulation that respects disabled states and dispatches keydown/keyup events.",
          "Use vi.fn() to create mock submission handlers and inspect toHaveBeenCalledWith(payload).",
          "Always test validation error display and ensure invalid forms do NOT trigger the submission handler.",
          "Use findByRole('alert') when expecting error messages that appear after asynchronous rejected promises."
        ]
      },
      {
        id: "16.6",
        title: "44. Async State Updates, Timers & Promises",
        content: `### 1. The Challenge of Asynchronous React Code
In modern applications, state updates do not always happen synchronously. Components fetch data across the network, debounce user input with \`setTimeout\`, and run CSS transitions.

If you assert on an element before the asynchronous operation has resolved:
\`\`\`javascript
// 💥 FAILS: The search results have not fetched yet!
expect(screen.getByText('Result 1')).toBeInTheDocument();
\`\`\`

### 2. The Three Solutions for Async Assertions
1. **\`findBy...\` Queries**: Automatically polls the DOM every 50ms for up to 1,000ms until the element appears:
   \`\`\`javascript
   const result = await screen.findByText('Result 1');
   expect(result).toBeInTheDocument();
   \`\`\`
2. **\`waitFor(() => expect(...))\`**: Retries the assertion callback function until it passes or times out:
   \`\`\`javascript
   await waitFor(() => {
     expect(screen.getByText('Saved!')).toBeInTheDocument();
   });
   \`\`\`
3. **\`waitForElementToBeRemoved(() => ...)\`**: Waits for loading spinners or skeleton screens to disappear:
   \`\`\`javascript
   await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
   \`\`\`

### 3. Understanding the Dreaded \`act(...)\` Warning
Have you ever seen this warning in your test output?
\`\`\`
console.error: Warning: An update to SearchBar inside a test was not wrapped in act(...).
When testing, code that causes React state updates should be wrapped into act(...):
act(() => {
  /* fire events that update state */
});
\`\`\`
**Why it happens:** React detected a state update occurring *after* your test completed or outside of a tracked event block.
**How to fix it:** You almost **NEVER** need to import and call \`act()\` manually! 99% of \`act()\` warnings are caused by:
1. Forgetting to \`await\` an async user event: \`await user.click(btn)\` (NOT \`user.click(btn)\`).
2. Forgetting to wait for a state update with \`await screen.findByRole(...)\` or \`await waitFor(...)\`.
3. An uncleaned timer or unresolved network promise running after the test finishes.

### 4. Testing Debounced Input with Vitest Fake Timers
When testing inputs that debounce (e.g. waiting 500ms before calling an API), waiting 500ms of real clock time slows down your test suite.
Use **Vitest Fake Timers** to fast-forward time instantly:
\`\`\`jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState, useEffect } from 'react';

// Debounced Search Component
function DebouncedSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <input
      type="search"
      placeholder="Search products..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search products"
    />
  );
}

// Test Suite
describe('DebouncedSearch Component', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Intercepts setTimeout and setInterval
  });

  afterEach(() => {
    vi.useRealTimers(); // Restores native timers
  });

  it('triggers search callback only after 400ms debounce period', async () => {
    // Note: userEvent requires advanceTimers option when fake timers are active
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const handleSearch = vi.fn();
    render(<DebouncedSearch onSearch={handleSearch} />);

    const searchInput = screen.getByLabelText(/search products/i);

    // Type query
    await user.type(searchInput, 'laptop');
    expect(handleSearch).not.toHaveBeenCalled(); // Not called immediately!

    // Fast-forward 200ms (debounce hasn't finished yet)
    vi.advanceTimersByTime(200);
    expect(handleSearch).not.toHaveBeenCalled();

    // Fast-forward remaining 200ms (total 400ms reached!)
    vi.advanceTimersByTime(200);
    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('laptop');
  });
});
\`\`\``,
        comparisonTable: [
          { asyncTool: "screen.findByRole()", bestFor: "Waiting for a single element to appear in DOM", timeout: "1000ms default" },
          { asyncTool: "waitFor(() => expect())", bestFor: "Retrying complex or multiple assertions until true", timeout: "1000ms default" },
          { asyncTool: "waitForElementToBeRemoved()", bestFor: "Waiting for loading spinners or modals to vanish", timeout: "1000ms default" },
          { asyncTool: "vi.useFakeTimers()", bestFor: "Controlling setTimeout/setInterval synchronously", timeout: "Instant clock jump" }
        ],
        code: `// Practical waitFor example
import { render, screen, waitFor } from '@testing-library/react';

test('waiting for multiple attributes to update', async () => {
  render(<AsyncNotification />);
  
  await waitFor(() => {
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert-success');
  });
});`,
        keyTakeaways: [
          "Never write arbitrary sleep(1000) delays in tests; use findBy or waitFor.",
          "findBy automatically retries until an element appears, making async tests reliable and deterministic.",
          "act(...) warnings indicate unawaited promises or unhandled timer state updates.",
          "vi.useFakeTimers() allows you to test 5-second debounces or intervals in 2 milliseconds."
        ]
      },
      {
        id: "16.7",
        title: "45. Testing API Requests with Mock Service Worker (MSW)",
        content: `### 1. Why \`fetch\` Mocks Fail & Why MSW is Industry Standard
In naive testing, developers mock \`global.fetch\` directly:
\`\`\`javascript
// ❌ FRAGILE: Hand-written fetch mock
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve([{ id: 1, name: 'Alice' }])
});
\`\`\`
**Why this causes production bugs:**
- Real network requests have headers, HTTP status codes (200, 404, 500), latency, and network dropouts.
- If your code switches from \`fetch\` to \`axios\`, or updates URL query parameters, hand-written fetch mocks continue returning fake data without validating your actual request URL!
- **Mock Service Worker (MSW)** intercepts HTTP requests at the network layer (using Service Workers in browser or interceptors in Node.js). Your component makes **real HTTP calls**, and MSW intercepts them seamlessly.

### 2. Setting Up MSW in Vitest
Install MSW:
\`\`\`bash
npm install -D msw
\`\`\`

Create \`src/mocks/handlers.js\`:
\`\`\`javascript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.example.com/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice Johnson', role: 'Engineer' },
      { id: 2, name: 'Bob Smith', role: 'Designer' }
    ]);
  }),
];
\`\`\`

Create \`src/mocks/server.js\`:
\`\`\`javascript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
\`\`\`

In \`src/setupTests.js\`:
\`\`\`javascript
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
\`\`\`

### 3. Component File: \`src/components/UserDirectory.jsx\`
\`\`\`jsx
import React, { useState, useEffect } from 'react';

export function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('https://api.example.com/users');
      if (!res.ok) throw new Error(\`Server error: \${res.status}\`);
      const data = await res.json();
      setUsers(data);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load users');
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (status === 'loading') {
    return <div role="status" aria-label="Loading users">Loading directory...</div>;
  }

  if (status === 'error') {
    return (
      <div role="alert" style={{ color: 'red' }}>
        <p>{errorMessage}</p>
        <button type="button" onClick={fetchUsers}>Retry</button>
      </div>
    );
  }

  if (users.length === 0) {
    return <p>No users found in directory.</p>;
  }

  return (
    <section>
      <h2>Team Members ({users.length})</h2>
      <ul aria-label="Team members list">
        {users.map(u => (
          <li key={u.id}>
            <strong>{u.name}</strong> — <span>{u.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
\`\`\`

### 4. Test File: \`src/components/UserDirectory.test.jsx\`
\`\`\`jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import React from 'react';
import { UserDirectory } from './UserDirectory';

describe('UserDirectory Component', () => {
  it('displays loading state initially and then renders user list on success', async () => {
    render(<UserDirectory />);

    // 1. Assert loading spinner is shown immediately
    expect(screen.getByRole('status', { name: /loading users/i })).toBeInTheDocument();

    // 2. Wait for users to be fetched and rendered
    const heading = await screen.findByRole('heading', { name: /team members \\(2\\)/i });
    expect(heading).toBeInTheDocument();

    // 3. Assert user items are present in DOM
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('renders empty message when API returns an empty array', async () => {
    // Override handler for this single test:
    server.use(
      http.get('https://api.example.com/users', () => {
        return HttpResponse.json([]);
      })
    );

    render(<UserDirectory />);

    const emptyMessage = await screen.findByText(/no users found in directory/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('handles server 500 error and allows retrying', async () => {
    const user = userEvent.setup();

    // 1. Fail first request with 500 error:
    server.use(
      http.get('https://api.example.com/users', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserDirectory />);

    // 2. Assert error alert is displayed
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/server error: 500/i);

    // 3. Restore working handler before clicking retry:
    server.use(
      http.get('https://api.example.com/users', () => {
        return HttpResponse.json([{ id: 99, name: 'Recovered User', role: 'QA' }]);
      })
    );

    // 4. Click retry button
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    await user.click(retryBtn);

    // 5. Assert recovered user renders
    expect(await screen.findByText('Recovered User')).toBeInTheDocument();
  });
});
\`\`\``,
        comparisonTable: [
          { approach: "Mock Service Worker (MSW)", fidelity: "Extremely High (Intercepts real network requests)", maintenance: "Low (Centralized handlers)" },
          { approach: "global.fetch = vi.fn()", fidelity: "Low (Bypasses HTTP headers and network serialization)", maintenance: "High (Must recreate response objects in every test)" },
          { approach: "Axios Mock Adapter", fidelity: "Medium (Tied strictly to Axios; breaks if fetch is used)", maintenance: "Medium" }
        ],
        code: `// Overriding MSW handlers per test
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

test('handling network timeout', async () => {
  server.use(
    http.get('https://api.example.com/users', () => {
      return HttpResponse.error(); // Simulates network failure / offline
    })
  );
  
  render(<UserDirectory />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load users/i);
});`,
        keyTakeaways: [
          "Mock Service Worker intercepts requests at the network boundary, testing real component fetch/axios code.",
          "server.use() enables overriding handlers for specific error, empty, or timeout scenarios within individual tests.",
          "server.resetHandlers() inside afterEach() guarantees that test overrides never leak into subsequent tests.",
          "Always test all four UI states: Loading, Success, Empty, and Error with Retry."
        ]
      },
      {
        id: "16.8",
        title: "46. Testing Custom Hooks with renderHook",
        content: `### 1. When and How to Test Custom Hooks
React hooks cannot be called outside of a React component. 
If you try to execute \`const result = useCounter();\` directly in a test function, React will crash with:
\`Invalid hook call. Hooks can only be called inside of the body of a function component.\`

RTL provides **\`renderHook()\`**, which creates a lightweight internal test component wrapper around your hook.

### 2. Hook File: \`src/hooks/useCounter.js\`
\`\`\`javascript
import { useState, useCallback } from 'react';

export function useCounter({ initialValue = 0, step = 1, min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(c => Math.min(max, c + step));
  }, [max, step]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(min, c - step));
  }, [min, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
}
\`\`\`

### 3. Test File: \`src/hooks/useCounter.test.js\`
\`\`\`javascript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Custom Hook', () => {
  it('initializes with default value of 0', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('increments count using custom step', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 10, step: 5 }));

    // Any hook function that updates state must be wrapped in act()
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(15);
  });

  it('respects maximum constraint boundary', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 9, max: 10 }));

    act(() => {
      result.current.increment(); // 9 -> 10
    });
    expect(result.current.count).toBe(10);

    act(() => {
      result.current.increment(); // Attempting to exceed max
    });
    expect(result.current.count).toBe(10); // Capped at max 10
  });

  it('resets count back to initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 50 }));

    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(52);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(50);
  });
});
\`\`\`

### 4. Testing Pure Reducers Independently (Zero DOM Overhead!)
If your component uses complex state logic via a pure reducer function (such as in \`useReducer\` or Redux), **you do not even need \`renderHook\` or a DOM container!**
Because a reducer is a 100% pure function \`(state, action) => newState\`, you can test it directly with simple assertions:
\`\`\`javascript
import { describe, it, expect } from 'vitest';
import { cartReducer, initialState } from './cartReducer';

describe('cartReducer', () => {
  it('adds an item to an empty cart', () => {
    const action = { type: 'ADD_ITEM', payload: { id: 101, name: 'Keyboard', price: 99 } };
    const nextState = cartReducer(initialState, action);

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({ id: 101, name: 'Keyboard', price: 99, quantity: 1 });
    expect(nextState.totalPrice).toBe(99);
  });
});
\`\`\``,
        comparisonTable: [
          { method: "renderHook(() => useMyHook())", purpose: "Mounts hook in temporary test component", accessPattern: "result.current.value" },
          { method: "act(() => { ... })", purpose: "Batches hook state changes and executes effects", accessPattern: "Wraps hook mutation calls" },
          { method: "Testing Reducer directly", purpose: "Tests state transitions without mounting any component", accessPattern: "const next = reducer(prev, action)" }
        ],
        code: `// Testing hooks with props updates via rerender
import { renderHook } from '@testing-library/react';

test('updating hook options with rerender', () => {
  const { result, rerender } = renderHook(
    ({ step }) => useCounter({ step }),
    { initialProps: { step: 1 } }
  );

  act(() => result.current.increment());
  expect(result.current.count).toBe(1);

  // Change hook prop dynamically:
  rerender({ step: 10 });
  act(() => result.current.increment());
  expect(result.current.count).toBe(11);
});`,
        keyTakeaways: [
          "renderHook() enables testing hook logic in isolation without writing disposable test components.",
          "Always wrap hook state mutation calls inside act(() => { ... }).",
          "result.current always points to the latest return value of the hook.",
          "Pure reducers should be tested directly as standard JavaScript functions without requiring any DOM mounting."
        ]
      },
      {
        id: "16.9",
        title: "47. Testing Redux Toolkit & Zustand Stores",
        content: `### 1. The #1 Trap: Leaky Shared State
When testing components connected to a global state store (Redux Toolkit or Zustand), **never share a single singleton store instance across multiple test files!**
- If Test 1 adds 3 items to the cart, and Test 2 runs expecting an empty cart, Test 2 will fail because Test 1 left dirty state in memory.
- Every test must receive a **fresh, isolated store instance**.

### 2. Testing Redux Toolkit Components with a Custom Wrapper
Create a helper function \`renderWithProviders(ui, { preloadedState, store })\`:
\`\`\`jsx
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
\`\`\`

**Now write clean, isolated component tests:**
\`\`\`jsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders } from '../test-utils';
import { CartBadge } from './CartBadge';

describe('CartBadge with Redux', () => {
  it('renders zero items initially with default store', () => {
    renderWithProviders(<CartBadge />);
    expect(screen.getByRole('status')).toHaveTextContent('Cart: 0 items');
  });

  it('renders preloaded items from initial store state', () => {
    renderWithProviders(<CartBadge />, {
      preloadedState: {
        cart: {
          items: [{ id: 1, name: 'Shoes', quantity: 2 }]
        }
      }
    });

    expect(screen.getByRole('status')).toHaveTextContent('Cart: 2 items');
  });
});
\`\`\`

### 3. Testing Zustand Stores
Zustand stores are plain JavaScript hooks. To prevent state leakage between tests, reset the store in \`beforeEach()\`:
\`\`\`javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useCartStore } from './cartStore';

const initialStoreState = useCartStore.getState();

describe('useCartStore Zustand', () => {
  beforeEach(() => {
    // Reset Zustand store to clean initial state before each test!
    useCartStore.setState(initialStoreState, true);
  });

  it('adds item to cart and updates total price', () => {
    act(() => {
      useCartStore.getState().addItem({ id: 1, name: 'Mouse', price: 50 });
    });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(50);
  });
});
\`\`\``,
        comparisonTable: [
          { store: "Redux Toolkit", isolationPattern: "Create fresh store via configureStore() inside custom render wrapper", testingFocus: "Slices, selectors, and connected components" },
          { store: "Zustand", isolationPattern: "Call useStore.setState(initialState, true) inside beforeEach()", testingFocus: "Direct action dispatch & atomic selectors" }
        ],
        code: `// Testing a component connected to Zustand
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartButton } from './CartButton';
import { useCartStore } from './cartStore';

test('clicking button updates Zustand store', async () => {
  const user = userEvent.setup();
  render(<CartButton item={{ id: 9, name: 'Desk', price: 200 }} />);

  await user.click(screen.getByRole('button', { name: /add to cart/i }));
  expect(useCartStore.getState().items).toHaveLength(1);
});`,
        keyTakeaways: [
          "Never share a singleton Redux or Zustand store instance across test cases.",
          "Use a custom renderWithProviders helper that instantiates a fresh configureStore() for each test.",
          "For Zustand, store the initial state snapshot and restore it in beforeEach via useStore.setState(initial, true).",
          "Test connected components by asserting on rendered DOM output rather than checking store internals directly."
        ]
      },
      {
        id: "16.10",
        title: "48. Testing React Router Navigation & Protected Routes",
        content: `### 1. Why \`<BrowserRouter>\` Fails in Node.js Tests
In a production web browser, \`<BrowserRouter>\` connects directly to the real browser URL address bar using the native HTML5 History API (\`window.history.pushState\`).
In Node.js test environments, there is no real address bar. If you render a component containing \`<Link>\`, \`useNavigate()\`, or \`useParams()\` without a router context, React will throw:
\`useNavigate() may be used only in the context of a <Router> component.\`

### 2. The Solution: \`<MemoryRouter>\`
React Router provides **\`<MemoryRouter>\`** specifically for testing and non-browser environments. It keeps the history stack entirely in memory and allows you to declare starting URLs via \`initialEntries\`:
\`\`\`jsx
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/users/42']}>
    <UserProfileRoute />
  </MemoryRouter>
);
\`\`\`

### 3. Component & Routing Setup: \`src/routes/AppRoutes.jsx\`
\`\`\`jsx
import React from 'react';
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';

export function UserProfile() {
  const { userId } = useParams();
  return (
    <div>
      <h2>User Profile ID: {userId}</h2>
      <Link to="/settings">Go to Settings</Link>
    </div>
  );
}

export function ProtectedSettings({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <h2>Account Settings</h2>;
}

export function AppRoutes({ isAuthenticated = false }) {
  return (
    <Routes>
      <Route path="/" element={<h2>Home Page</h2>} />
      <Route path="/login" element={<h2>Login Page</h2>} />
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route 
        path="/settings" 
        element={<ProtectedSettings isAuthenticated={isAuthenticated} />} 
      />
      <Route path="*" element={<h2>404 Not Found</h2>} />
    </Routes>
  );
}
\`\`\`

### 4. Test File: \`src/routes/AppRoutes.test.jsx\`
\`\`\`jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AppRoutes } from './AppRoutes';

describe('AppRoutes Navigation Suite', () => {
  it('renders user profile with dynamic URL parameter', () => {
    // Mount router at /users/99
    render(
      <MemoryRouter initialEntries={['/users/99']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /user profile id: 99/i })).toBeInTheDocument();
  });

  it('navigates from user profile to settings when link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/users/1']}>
        <AppRoutes isAuthenticated={true} />
      </MemoryRouter>
    );

    const settingsLink = screen.getByRole('link', { name: /go to settings/i });
    await user.click(settingsLink);

    // Verify destination route is rendered
    expect(screen.getByRole('heading', { name: /account settings/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated users from /settings to /login', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <AppRoutes isAuthenticated={false} />
      </MemoryRouter>
    );

    // Assert user was redirected to Login Page
    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account settings/i })).not.toBeInTheDocument();
  });

  it('renders 404 page for nonexistent routes', () => {
    render(
      <MemoryRouter initialEntries={['/random-unknown-page']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /404 not found/i })).toBeInTheDocument();
  });
});
\`\`\``,
        comparisonTable: [
          { router: "<BrowserRouter>", environment: "Web browser only (uses window.history)", testingSuitability: "Unsuitable for automated testing" },
          { router: "<MemoryRouter>", environment: "In-memory history (Node.js & Tests)", testingSuitability: "Ideal for testing route transitions and URL params" }
        ],
        code: `// Reusable renderWithRouter utility
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}`,
        keyTakeaways: [
          "Always wrap router-dependent components in <MemoryRouter> during tests.",
          "Use initialEntries={['/my-path']} to simulate loading the application at specific deep URLs.",
          "Verify redirects by asserting that the destination route heading renders and the protected route does not.",
          "Simulate link clicks with await user.click(screen.getByRole('link', { name: ... }))."
        ]
      },
      {
        id: "16.11",
        title: "49. Testing UI Component Libraries (MUI Dialogs & Portals)",
        content: `### 1. The Challenge of Portals & UI Libraries
Components from modern UI libraries (like Material UI, Radix UI, or shadcn/ui) present two unique testing challenges:
1. **React Portals**: Modal dialogs, menus, and tooltips are rendered outside the root component DOM node, directly into \`document.body\`.
2. **Theme Context**: Components like MUI's \`<Button>\` or \`<Typography>\` expect a \`<ThemeProvider>\` in their parent tree.

### 2. Component File: \`src/components/ConfirmDeleteDialog.jsx\`
\`\`\`jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

export function ConfirmDeleteDialog({ itemName, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="error" 
        onClick={() => setOpen(true)}
      >
        Delete Item
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to permanently delete "{itemName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
\`\`\`

### 3. Test File: \`src/components/ConfirmDeleteDialog.test.jsx\`
\`\`\`jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

describe('ConfirmDeleteDialog MUI Component', () => {
  it('does not render dialog modal initially', () => {
    render(<ConfirmDeleteDialog itemName="Financial Report" onDelete={vi.fn()} />);

    expect(screen.getByRole('button', { name: /delete item/i })).toBeInTheDocument();
    // Modal is closed, so role="dialog" should NOT be in the DOM
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens dialog portal when trigger button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmDeleteDialog itemName="Financial Report" onDelete={vi.fn()} />);

    // Click trigger
    await user.click(screen.getByRole('button', { name: /delete item/i }));

    // Assert dialog appears in document.body
    const dialog = screen.getByRole('dialog', { name: /confirm deletion/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to permanently delete "financial report"/i)).toBeInTheDocument();
  });

  it('closes dialog without executing callback when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<ConfirmDeleteDialog itemName="Project Alpha" onDelete={handleDelete} />);

    await user.click(screen.getByRole('button', { name: /delete item/i }));
    
    // Click Cancel inside dialog
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    // Dialog closes with transition animation
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete callback and closes dialog when confirmed', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<ConfirmDeleteDialog itemName="Project Alpha" onDelete={handleDelete} />);

    await user.click(screen.getByRole('button', { name: /delete item/i }));
    
    // Click Confirm Delete
    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
    await user.click(confirmBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
\`\`\``,
        comparisonTable: [
          { pattern: "Portal Queries", rule: "Query using screen.getByRole('dialog'); screen searches document.body globally!" },
          { pattern: "MUI Class Names", rule: "Never test using .MuiButton-root or .MuiDialog-paper (Internal implementation detail)" },
          { pattern: "Transition Delays", rule: "Use waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()) to allow fade-out transitions to complete" }
        ],
        code: `// Wrapping MUI with ThemeProvider for theme testing
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const testTheme = createTheme();

export function renderWithMUI(ui) {
  return render(
    <ThemeProvider theme={testTheme}>
      {ui}
    </ThemeProvider>
  );
}`,
        keyTakeaways: [
          "React Portals render directly into document.body; screen.getByRole finds them without special portal configuration.",
          "Never assert on private MUI CSS class names (.Mui-disabled, .MuiButton-root); use accessible roles and toBeDisabled().",
          "MUI Dialogs fade out via CSS transitions; always use waitFor() when asserting that a modal has completely closed."
        ]
      },
      {
        id: "16.12",
        title: "50. Mocking Concepts in Depth: Functions, Spies & Modules",
        content: `### 1. The Core Mocking Primitives in Vitest
1. **Mock Function (\`vi.fn()\`)**: A blank spy function that records every call, arguments, and return value:
   \`\`\`javascript
   const callback = vi.fn();
   callback('hello', 42);
   expect(callback).toHaveBeenCalledWith('hello', 42);
   \`\`\`
2. **Spy (\`vi.spyOn(object, 'method')\`)**: Wraps an existing object method (like \`window.scrollTo\` or \`console.error\`) to monitor calls without destroying its original implementation:
   \`\`\`javascript
   const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
   // run component...
   expect(scrollSpy).toHaveBeenCalled();
   scrollSpy.mockRestore(); // Restores original window.scrollTo!
   \`\`\`
3. **Module Mock (\`vi.mock('module-name')\`)**: Replaces an entire npm package or local file with a mock version:
   \`\`\`javascript
   vi.mock('../services/analytics', () => ({
     trackEvent: vi.fn(),
   }));
   \`\`\`

### 2. \`mockClear\` vs \`mockReset\` vs \`mockRestore\` (The Big Interview Question!)

| Method | Clears Call History? | Resets Custom Mock Implementation? | Restores Original Native Function? |
| :--- | :--- | :--- | :--- |
| **\`mock.mockClear()\`** | ✅ YES (\`calls = []\`) | ❌ NO (Keeps return value) | ❌ NO |
| **\`mock.mockReset()\`** | ✅ YES | ✅ YES (Reverts to empty \`undefined\`) | ❌ NO |
| **\`mock.mockRestore()\`** | ✅ YES | ✅ YES | ✅ **YES** (Only works on \`vi.spyOn\`) |

### 3. Common Mocking Antipatterns to Avoid
- **Over-Mocking**: If you mock out every child component, utility function, and library, your test only tests your mocks, not your software!
- **Mock Leaks**: Always configure Vitest with \`restoreMocks: true\` or call \`vi.clearAllMocks()\` in \`afterEach()\` so that spies created in one test do not count calls in another test.`,
        comparisonTable: [
          { method: "vi.fn()", useCase: "Passing callbacks into props (onClick, onSubmit)" },
          { method: "vi.spyOn(obj, 'fn')", useCase: "Monitoring browser globals (localStorage, window, audio)" },
          { method: "vi.mock('module')", useCase: "Mocking heavyweight third-party SDKs (Stripe, Google Maps, Sentry)" }
        ],
        code: `// Mocking localStorage with vi.spyOn
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('LocalStorage Mocking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads and writes to localStorage', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    const theme = localStorage.getItem('theme');
    expect(theme).toBe('dark');
    expect(getItemSpy).toHaveBeenCalledWith('theme');

    localStorage.setItem('theme', 'light');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
  });
});`,
        keyTakeaways: [
          "vi.fn() creates a mock callback that tracks invocations and arguments.",
          "vi.spyOn tracks existing object methods and can be restored using mockRestore().",
          "mockClear clears call history; mockReset clears return values; mockRestore restores the original implementation.",
          "Avoid over-mocking: only mock external boundaries (network APIs, timers, browser hardware)."
        ]
      },
      {
        id: "16.13",
        title: "51. The 20 Real-World Testing Exercises Reference Matrix",
        content: `### The 20-Exercise Progressive Mastery Syllabus
Work through these 20 practical testing challenges to achieve complete senior testing fluency:

| # | Exercise Name | Target Component | Core Concept & RTL Method |
| :--- | :--- | :--- | :--- |
| **1** | Simple Button | \`<PrimaryButton>\` | \`getByRole('button')\`, \`user.click()\`, \`toBeDisabled()\` |
| **2** | State Counter | \`<Counter>\` | Initial count, step increment, decrement boundary |
| **3** | Controlled Input | \`<SearchInput>\` | \`user.type()\`, \`user.clear()\`, \`toHaveValue()\` |
| **4** | Validated Registration Form | \`<RegisterForm>\` | Email & password regex, required field alerts |
| **5** | 4-State Data Fetching | \`<ProductList>\` | Loading spinner, success items, empty state, error alert |
| **6** | Pagination & Search | \`<PaginatedTable>\` | Page transitions, query string filtering, \`within()\` scoping |
| **7** | Accessible Modal Dialog | \`<ConfirmModal>\` | Portals, focus trap, escape key with \`user.keyboard('{Escape}')\` |
| **8** | Accordion Collapsible | \`<FaqAccordion>\` | \`aria-expanded\`, clicking header reveals hidden panel |
| **9** | Tabbed Navigation | \`<ProfileTabs>\` | \`role="tab"\`, \`role="tabpanel"\`, arrow key navigation |
| **10** | Custom Debounced Hook | \`useDebounce(val, delay)\` | \`renderHook()\`, \`vi.useFakeTimers()\`, \`vi.advanceTimersByTime()\` |
| **11** | LocalStorage Persistence Hook | \`useLocalStorage(key, init)\` | \`vi.spyOn(Storage.prototype, 'setItem')\` |
| **12** | Redux Toolkit Shopping Cart | \`<CartSummary>\` | \`renderWithProviders\`, preloaded state, quantity updates |
| **13** | Zustand Task Manager | \`<TaskList>\` | Store reset in \`beforeEach\`, filter active/completed |
| **14** | React Router Protected Page | \`<ProtectedRoute>\` | \`<MemoryRouter>\`, unauthenticated redirect to \`/login\` |
| **15** | MUI AutoComplete Select | \`<CountrySelect>\` | Virtualized dropdown, keyboard arrows, selection change |
| **16** | Debounced API Search with Race Conditions | \`<LiveUserSearch>\` | MSW delay, ensuring stale promise does not overwrite latest input |
| **17** | File Upload Widget | \`<AvatarUploader>\` | \`user.upload(input, file)\`, file size and MIME type validation |
| **18** | Infinite Scroll Observer | \`<InfiniteFeed>\` | Mocking \`IntersectionObserver\`, loading next page batch |
| **19** | Dark Mode Theme Toggle | \`<ThemeSwitcher>\` | Context provider wrapper, class toggling on root container |
| **20** | Full Checkout Integration Flow | \`<CheckoutWizard>\` | Multi-step form, credit card validation, MSW order post, success screen |`,
        comparisonTable: [
          { level: "Beginner (Exercises 1-5)", focus: "DOM rendering, button clicks, form typing, initial state assertions" },
          { level: "Intermediate (Exercises 6-13)", focus: "Async state, MSW network mocking, fake timers, custom hooks with renderHook" },
          { level: "Senior (Exercises 14-20)", focus: "Router redirects, Redux/Zustand providers, Portals, race condition testing, multi-step wizards" }
        ],
        code: `// Template for tackling any exercise in the matrix:
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Exercise Template', () => {
  it('implements Arrange-Act-Assert seamlessly', async () => {
    const user = userEvent.setup();
    // 1. Arrange
    // 2. Act
    // 3. Assert
  });
});`,
        keyTakeaways: [
          "Progress from simple button unit tests to complex multi-step integration workflows.",
          "Every exercise reinforces accessibility-first queries (getByRole, getByLabelText).",
          "Mastering this 20-exercise curriculum guarantees complete interview and production testing readiness."
        ]
      }
    ]
  };
  fs.writeFileSync(parts15to21Path, JSON.stringify(parts15to21, null, 2), 'utf8');
  console.log('Successfully updated Part 16 with zero-to-hero React Testing in react_notes_parts_15_to_21.json');
}
