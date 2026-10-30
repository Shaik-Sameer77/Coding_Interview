// scratch/react_notes_parts_8_to_14.cjs
// Parts 8 to 14: Context, useReducer, Refs, Fiber & Reconciliation, Performance, Error Boundaries & Suspense, Architecture

module.exports = [
  {
    id: 8,
    title: "Part 8 — Context API & State Architecture",
    badge: "Context API",
    color: "#60a5fa",
    sections: [
      {
        id: "8.1",
        title: "25. Context Creation, Providers & Custom Consumer Hooks",
        content: `### 1. Topic Overview & Problem Solved
React Context is designed to share data that can be considered "global" for a tree of components — such as the authenticated user, UI theme, active locale, or shared feature flags — without manually passing props down through every intermediate component (Prop Drilling).

### 2. The Custom Hook Safety Pattern
Never expose the raw Context object directly to components. Instead, always wrap \`useContext(MyContext)\` in a dedicated custom hook that asserts the hook is called within its Provider, throwing an explicit error if called outside.`,
        code: `import { createContext, useContext, useState } from 'react';

// 1. Create Context with null default
const AuthContext = createContext(null);

// 2. Encapsulated Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Fail-fast Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an <AuthProvider> wrapper!');
  }
  return context;
}`,
        keyTakeaways: [
          "Context solves prop drilling for broadly shared application values (auth, theme, locale).",
          "Always wrap useContext in a custom hook that throws an informative error when used outside its Provider.",
          "Context is not a replacement for high-velocity global state management."
        ]
      },
      {
        id: "8.2",
        title: "26. Context Re-render Cascade & Context Splitting",
        content: `### 1. The Context Re-render Hazard
By default, whenever the \`value\` prop passed to a \`<Context.Provider>\` changes by reference, **EVERY component that calls \`useContext(MyContext)\` will immediately re-render**, even if it only uses an unchanged property of that value object!
\`React.memo\` cannot prevent this re-render because context subscriptions bypass memoization boundaries!

### 2. Architectural Solution: Split State and Dispatch Contexts
Split your context into two separate contexts:
- \`StateContext\`: Holds only the data values (changes frequently).
- \`DispatchContext\`: Holds stable action callbacks (never changes).
Components that only trigger actions (like buttons) subscribe only to \`DispatchContext\` and NEVER re-render when state updates!`,
        code: `import { createContext, useContext, useReducer, useMemo } from 'react';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': return [...state, action.payload];
    case 'CLEAR': return [];
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartStateContext.Provider value={cart}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Consumers only re-render when their specific subscription changes:
export const useCart = () => useContext(CartStateContext);
export const useCartDispatch = () => useContext(CartDispatchContext);`,
        comparisonTable: [
          { aspect: "Monolithic Context", detail: "Single object with state and methods; any state change causes all consumers to re-render." },
          { aspect: "Split Contexts", detail: "Separates state from dispatch; action callers do not re-render when state values update." }
        ],
        keyTakeaways: [
          "useContext subscriptions bypass React.memo and force consumer re-renders on every value reference change.",
          "Splitting state and dispatch into separate contexts stops action callers from re-rendering.",
          "For complex, high-frequency state, choose Zustand or Redux Toolkit with atomic selector subscriptions."
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Part 9 — Reducers & Complex State with useReducer",
    badge: "Reducers",
    color: "#818cf8",
    sections: [
      {
        id: "9.1",
        title: "27. useReducer Architecture & State Machines",
        content: `### 1. When to Choose useReducer over useState
- Next state depends on multiple sub-values or prior states.
- Complex state transitions (e.g. form wizard, audio player, checkout funnel).
- Business logic needs to be tested in isolation as a pure JavaScript function without rendering components.

### 2. State-Machine Thinking: Eliminating Impossible States
With multiple \`useState\` hooks (\`isLoading\`, \`isError\`, \`isSuccess\`), you can accidentally end up in an impossible state: \`isLoading === true && isError === true\`.
A reducer enforces valid state transitions via discriminated unions.`,
        code: `// Pure reducer: (state, action) => newState
export const initialState = { status: 'idle', data: null, error: null };

export function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { status: 'loading', data: null, error: null };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'FETCH_FAILURE':
      return { status: 'error', data: null, error: action.payload };
    default:
      throw new Error(\`Unhandled action type: \${action.type}\`);
  }
}

// Inside component:
function DataViewer() {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  async function loadData() {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: err.message });
    }
  }

  return (
    <div>
      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'error' && <p className="error">{state.error}</p>}
      {state.status === 'success' && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
      <button onClick={loadData}>Reload</button>
    </div>
  );
}`,
        keyTakeaways: [
          "Reducers must be pure functions with zero side effects, returning new state references immutably.",
          "State-machine patterns prevent contradictory flags like isLoading and isSuccess being true simultaneously.",
          "Reducers can be unit-tested without React Testing Library or DOM mounting."
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Part 10 — Refs & Imperative DOM Operations",
    badge: "DOM & Refs",
    color: "#a855f7",
    sections: [
      {
        id: "10.1",
        title: "28. useRef: DOM Access, Instance Variables & Previous Value",
        content: `### 1. The Dual Purpose of useRef
1. **Direct DOM Node Reference**: Accessing underlying HTML elements for focus management, scroll positioning, and canvas drawing.
2. **Persistent Mutable Instance Variable**: Holding values across renders (timer IDs, WebSockets, render counts) without triggering a re-render when mutated.

### 2. Capturing Previous State with useRef
Because mutating a ref does not trigger a re-render, an Effect can record the current value in \`ref.current\` after render completes, allowing you to read the previous render's value.`,
        code: `import { useRef, useEffect, useState } from 'react';

// Custom hook to inspect previous value
function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value; // Updated after render commits!
  }, [value]);
  return ref.current; // Returns previous value during render!
}

export function AutoFocusSearchInput() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const prevQuery = usePrevious(query);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Current: {query} | Previous: {prevQuery ?? 'none'}</p>
    </div>
  );
}`,
        keyTakeaways: [
          "useRef returns a plain JavaScript object: { current: initialValue }.",
          "Mutating ref.current does NOT schedule a component re-render.",
          "Never read or write ref.current during render if it affects the output JSX; do so only inside Effects or event handlers."
        ]
      },
      {
        id: "10.2",
        title: "29. Forwarding Refs & useImperativeHandle",
        content: `### 1. Ref Forwarding (React 19 vs React 18)
- **React 18**: Function components cannot accept a \`ref\` prop directly; you must wrap the component in \`forwardRef((props, ref) => ...)\`.
- **React 19**: \`ref\` is now a standard prop! \`forwardRef\` is deprecated; simply accept \`{ ref, ...props }\` like any other prop.

### 2. useImperativeHandle: Custom Exposed Handles
Instead of exposing the raw DOM element to parent components (which breaks encapsulation and allows dangerous DOM mutations), \`useImperativeHandle\` lets you expose a customized, constrained imperative API (e.g. \`.focus()\`, \`.reset()\`, \`.scrollIntoView()\`).`,
        code: `import { useRef, useImperativeHandle, forwardRef } from 'react';

// Custom exposed contract interface:
// { focusInput: () => void, clearText: () => void }

export const CustomSearchBox = forwardRef(function CustomSearchBox(props, ref) {
  const nativeInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      nativeInputRef.current?.focus();
    },
    clearText: () => {
      if (nativeInputRef.current) nativeInputRef.current.value = '';
    }
  }), []);

  return <input ref={nativeInputRef} className="search-field" {...props} />;
});

// Parent usage:
function ParentController() {
  const boxRef = useRef(null);
  return (
    <div>
      <CustomSearchBox ref={boxRef} placeholder="Search..." />
      <button onClick={() => boxRef.current?.focusInput()}>Focus Field</button>
      <button onClick={() => boxRef.current?.clearText()}>Clear Field</button>
    </div>
  );
}`,
        keyTakeaways: [
          "React 19 accepts ref as a normal prop, phasing out the need for forwardRef wrapper.",
          "useImperativeHandle restricts what parent components can do with a child component's ref.",
          "Use imperative handles sparingly; prefer declarative props and state wherever possible."
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Part 11 — Rendering Engine, Fiber & Reconciliation",
    badge: "Engine Internals",
    color: "#c084fc",
    sections: [
      {
        id: "11.1",
        title: "30. The Two Phases: Render vs Commit Phase",
        content: `### 1. Render Phase (Pure, Interruptible Work)
- React calls component functions to compute the next React element tree (Virtual DOM).
- Runs the **Reconciliation Diffing Algorithm** to determine mutations.
- **Rules of Render Phase**: Must be completely pure with **ZERO side effects**! No DOM mutations, no API calls, no timers.
- In Concurrent React, this phase can be paused, resumed, or discarded if a high-priority user interaction occurs.

### 2. Commit Phase (Synchronous, Uninterruptible Mutations)
- React applies all computed changes to the real browser DOM.
- Mutates refs to point to new DOM nodes.
- Synchronously executes \`useLayoutEffect\` callbacks before the browser paints.
- The browser paints the pixels to the screen.
- React schedules and executes \`useEffect\` passive effects asynchronously.`,
        comparisonTable: [
          { aspect: "Render Phase", detail: "Calls components, calculates Virtual DOM diff, pure, NO side-effects, interruptible in Concurrent React." },
          { aspect: "Commit Phase", detail: "Synchronous DOM writes, ref assignments, useLayoutEffect runs before paint, paint happens, useEffect runs." }
        ],
        keyTakeaways: [
          "Rendering is not painting: a component render computes virtual elements; it only mutates the DOM if differences exist.",
          "Render phase must be 100% pure without side effects.",
          "Commit phase synchronously mutates the DOM and cannot be interrupted."
        ]
      },
      {
        id: "11.2",
        title: "31. Fiber Architecture & The Work Loop",
        content: `### 1. Historical Problem: Stack Reconciler Bottleneck
In React 15 and earlier, reconciliation used a recursive stack algorithm. Once rendering started, the JavaScript main thread was blocked until the entire tree finished. In large apps, this caused frame drops (jank) and laggy keystroke inputs.

### 2. The Fiber Solution: Incremental Scheduling
Fiber redesigned the reconciler into a singly linked-list tree where every component instance is a **Fiber Node**:
- \`child\`: Points to its first immediate child.
- \`sibling\`: Points to its next immediate sibling.
- \`return\`: Points back to its parent.

**The Work Loop**:
React can execute work in chunks, yielding control back to the browser via cooperative multitasking (\`requestIdleCallback\` / \`scheduler\`) so high-priority events (typing, clicks) are never blocked!`,
        code: `// Simplified conceptual structure of a Fiber Node:
class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag; // FunctionComponent, HostComponent, etc.
    this.key = key;
    this.elementType = null;
    this.stateNode = null; // Real DOM element reference

    // Fiber tree linkage:
    this.return = null;  // Parent Fiber
    this.child = null;   // First child Fiber
    this.sibling = null; // Next sibling Fiber

    // Hooks & State:
    this.memoizedState = null; // Linked list of hooks!
    this.memoizedProps = null;
    this.flags = 0; // Mutation flags (Placement, Update, Deletion)
    this.alternate = null; // Pointer to work-in-progress twin (Double Buffering)
  }
}`,
        keyTakeaways: [
          "Fiber replaced the synchronous recursive stack reconciler with an interruptible linked-list data structure.",
          "Double Buffering: React maintains the current mounted fiber tree and an in-progress work-in-progress tree.",
          "Fiber enables React 18+ concurrent features: useTransition, Suspense streaming, and selective hydration."
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Part 12 — Performance Optimization & Profiling",
    badge: "Optimization",
    color: "#f59e0b",
    sections: [
      {
        id: "12.1",
        title: "32. React.memo, useMemo & useCallback in Depth",
        content: `### 1. Why Do Components Re-render?
A component re-renders when:
1. Its own local state changes.
2. Its parent component re-renders (even if props did not change!).
3. A Context it consumes updates.

### 2. The Memoization Triad
- **\`React.memo\`**: Wraps a component to prevent re-renders if its received props have not changed by shallow equality (\`Object.is\`).
- **\`useMemo\`**: Caches the result of an expensive calculation across renders.
- **\`useCallback\`**: Caches a function definition across renders to preserve referential equality when passed to memoized children.

### 3. The Premature Optimization Trap
Do NOT memoize everything blindly:
- Memoization adds memory overhead and shallow comparison checks on every render.
- If a child component is cheap to render (e.g. a simple \`<button>\`), the memo check costs more CPU time than the re-render itself!`,
        code: `import React, { useState, useMemo, useCallback } from 'react';

// Memoized child: only re-renders if 'onToggle' or 'label' changes reference!
const FilterButton = React.memo(function FilterButton({ label, onToggle }) {
  console.log("FilterButton render:", label);
  return <button onClick={onToggle}>{label}</button>;
});

export function ProductCatalog({ products }) {
  const [filterActive, setFilterActive] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  // 1. useMemo for expensive data filtering:
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.price * multiplier > 50);
  }, [products, multiplier]);

  // 2. useCallback to preserve function reference for memoized child:
  const handleToggle = useCallback(() => {
    setFilterActive(prev => !prev);
  }, []); // Empty dependencies = stable reference forever!

  return (
    <div>
      <FilterButton label="Toggle Active" onToggle={handleToggle} />
      <button onClick={() => setMultiplier(m => m + 1)}>Adjust Multiplier: {multiplier}</button>
      <p>Filtered count: {filteredProducts.length}</p>
    </div>
  );
}`,
        keyTakeaways: [
          "React.memo prevents a component from re-rendering if its props are referentially identical.",
          "useCallback is only useful when passing functions to React.memo components or useEffect dependency arrays.",
          "State colocation (pushing state down to where it is used) is more effective than widespread memoization."
        ]
      },
      {
        id: "12.2",
        title: "33. Virtualization, Windowing & Code Splitting",
        content: `### 1. List Virtualization / Windowing
Rendering 10,000 DOM nodes simultaneously causes severe browser layout thrashing and high memory consumption.
**Virtualization** calculates which items are currently visible in the scroll viewport and renders ONLY those items (e.g. 20 items instead of 10,000) using absolute positioning with dynamic translate offsets.

### 2. Route-Level Code Splitting with React.lazy & Suspense
Break monolithic JS bundles into smaller chunks loaded on demand when the user navigates to a specific route.`,
        code: `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Dynamic import: Webpack/Vite splits this into a separate chunk
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<div className="route-spinner">Loading application module...</div>}>
      <Routes>
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}`,
        keyTakeaways: [
          "Virtualization renders only visible DOM nodes, allowing smooth 60fps scrolling over 50,000+ records.",
          "React.lazy and dynamic imports split bundles into on-demand route chunks, improving initial load TTFB.",
          "Always wrap lazy components with a meaningful <Suspense fallback> UI."
        ]
      }
    ]
  },
  {
    id: 13,
    title: "Part 13 — Error Boundaries, Suspense & Async Recovery",
    badge: "Resilience",
    color: "#d97706",
    sections: [
      {
        id: "13.1",
        title: "34. Error Boundaries: Implementation & Catch Boundaries",
        content: `### 1. What is an Error Boundary?
An Error Boundary is a React component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a graceful fallback UI instead of crashing the entire application into a blank white screen.

### 2. What Error Boundaries Catch vs Do NOT Catch
- **Catches**: Errors thrown during **Render Phase**, in **Lifecycle methods**, and inside constructors of child components.
- **Does NOT Catch**:
  1. Errors inside Event Handlers (use standard \`try / catch\`).
  2. Asynchronous code (\`setTimeout\`, \`fetch\` callbacks).
  3. Server-Side Rendering errors.
  4. Errors thrown inside the Error Boundary component itself.`,
        code: `import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // 1. Static method: Update state so next render shows fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // 2. Lifecycle method: Log error to reporting service (Sentry, Datadog)
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled crash:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-card" role="alert">
          <h3>Something went wrong in this module.</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
        keyTakeaways: [
          "Error boundaries prevent a single component crash from breaking the entire web application.",
          "They must be implemented as Class components using getDerivedStateFromError and componentDidCatch.",
          "Error boundaries do not catch async fetch errors or event handler exceptions; handle those with try/catch."
        ]
      }
    ]
  },
  {
    id: 14,
    title: "Part 14 — React Architecture & Production Practices",
    badge: "Architecture",
    color: "#10b981",
    sections: [
      {
        id: "14.1",
        title: "35. Feature-Based Architecture & Directory Standards",
        content: `### 1. Why Flat Folder Structures Break Down
In enterprise codebases with 200+ components, grouping by file type (\`/components\`, \`/hooks\`, \`/services\`) scatters related logic across the entire repository.
When maintaining the "Billing" feature, you must jump across 5 different top-level folders.

### 2. Feature-Based (Domain-Driven) Architecture
Group files by **Business Domain / Feature**. Each feature folder is self-contained with its own components, hooks, API services, types, and unit tests.`,
        code: `/*
Enterprise Feature-Oriented Directory Architecture:

src/
├── app/                  # Application root, providers, router configuration
├── features/             # Self-contained business domain modules
│   ├── authentication/
│   │   ├── components/   # LoginForm.tsx, OtpVerification.tsx
│   │   ├── hooks/        # useAuthSession.ts
│   │   ├── api/          # authClient.ts
│   │   ├── types/        # authTypes.ts
│   │   └── index.ts      # Public API exports for auth
│   ├── billing/          # Invoices, Stripe checkout, payment methods
│   └── analytics/        # Charts, metrics tables, date filters
├── shared/               # Reusable primitives across entire app
│   ├── components/       # Button.tsx, Modal.tsx, Table.tsx, Dropdown.tsx
│   ├── hooks/            # useDebounce.ts, useIntersectionObserver.ts
│   └── utils/            # formatCurrency.ts, formatDate.ts
└── main.tsx
*/`,
        keyTakeaways: [
          "Feature-based folder architecture keeps related domain logic colocated.",
          "Features expose a public index.ts boundary to prevent messy circular dependencies.",
          "Shared UI components remain agnostic of business logic and domain entities."
        ]
      }
    ]
  }
];
