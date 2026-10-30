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
// PART 8: Context API & State Architecture
// ==========================================
const p8_sections = [
  createSection('8.1', '42. Context Creation, Providers, Defaults & Custom Consumer Hooks', 1, {
    whatItIs: 'The React Context API allows data to be passed through the component tree without manually passing props at every level. It consists of a Context object created via createContext, a Context.Provider, and the useContext hook.',
    whyItExists: 'Prop drilling becomes unmaintainable when global or sub-tree data (theme, authentication, locale, active organization) must be consumed by dozens of deeply nested components across disparate branches.',
    problemSolved: 'Eliminates intermediary prop pass-through and provides dependency injection in React.',
    prerequisites: 'React components, props, closures, and custom hooks.',
    syntax: [
      '// 1. Create Context with safe fallback default:',
      'const AuthContext = createContext(null);',
      '',
      '// 2. Wrap tree in Provider with active value:',
      '<AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>',
      '',
      '// 3. Consume via encapsulated Custom Hook with null check:',
      'export function useAuth() {',
      '  const ctx = useContext(AuthContext);',
      '  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");',
      '  return ctx;',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { createContext, useContext, useState } from 'react';

// 1. Define Context
const ThemeContext = createContext(null);

// 2. Define Encapsulated Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ background: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#f8fafc' : '#0f172a', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 3. Custom Consumer Hook with Null Guard
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Leaf Consumer Component (Zero props required!)
export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Active Theme: {theme.toUpperCase()} (Click to Toggle)
    </button>
  );
}
`,
    lineByLine: [
      '- Line 4: Creates ThemeContext with a default null value.',
      '- Line 7-17: ThemeProvider manages local state and broadcasts { theme, toggleTheme } to all children.',
      '- Line 20-26: useTheme encapsulates useContext and throws an immediate, informative error if called outside a ThemeProvider.',
      '- Line 29-36: ThemeToggleButton consumes theme directly without any prop drilling!'
    ].join('\n'),
    internalFlow: [
      '1. React assigns a Context Fiber to ThemeContext.Provider.',
      '2. When ThemeToggleButton calls useContext(ThemeContext), React registers the component Fiber as a consumer of that Context Fiber.',
      '3. When toggleTheme executes and updates the provider value, React marks all descendant consumer Fibers as dirty.',
      '4. Crucial: All consumer components re-render, REGARDLESS of whether intermediary components are wrapped in React.memo!'
    ].join('\n'),
    whenToUse: 'For low-frequency, widely shared data: authenticated user session, theme toggle, active locale/language, timezone settings, UI layout preferences.',
    whenNotToUse: 'Do not use Context for high-frequency state updates (e.g. mouse cursor position, rapid audio levels, animated chart feeds); context updates cause widespread consumer re-renders.',
    commonMistakes: [
      '- Passing an unstable object directly into value without memoization: value={{ user, token }}. This passes a brand-new object reference on every provider render, forcing all consumers to re-render needlessly! Always memoize value with useMemo.',
      '- Exporting raw Context instead of an encapsulated custom hook.'
    ].join('\n'),
    perfA11y: 'Always memoize the provider value: const value = useMemo(() => ({ theme, toggleTheme }), [theme]); to prevent re-renders when the provider\'s parent re-renders.',
    realWorld: 'Production authentication providers (e.g. Supabase, Firebase, NextAuth) wrap application layouts in an AuthProvider, exposing useAuth() to navbars and protected routes.',
    interviewQs: [
      '**Q: Why should you always encapsulate useContext within a custom hook that checks for null?**',
      '*Spoken Answer*: "Encapsulating useContext inside a custom hook like useAuth() with a null check prevents silent failures. If a developer renders an <Avatar /> that requires user authentication data outside of <AuthProvider>, raw useContext returns the default value (undefined or null). Calling user.name will throw a cryptic TypeError: Cannot read properties of null. By checking if (!ctx) throw new Error(\'useAuth must be used within AuthProvider\'), you provide an immediate, actionable developer error that points directly to the missing provider in the component tree."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers split contexts (e.g. ThemeStateContext and ThemeDispatchContext) so components that only dispatch actions do not re-render when state values change.',
    revisionSummary: [
      '- Context solves prop drilling for global data.',
      '- Always memoize the provider `value` object.',
      '- Always export a custom hook with a null guard.'
    ].join('\n')
  }),

  createSection('8.2', '43. Real-World Context Implementations: Theme, Auth & Locale', 2, {
    whatItIs: 'Production implementations of the 3 most essential application contexts: Authentication (session tokens, user profile, role-based permissions), Theme (dark/light mode persistence), and Internationalization / Locale.',
    whyItExists: 'These 3 state domains represent foundational app infrastructure that almost every page and widget needs access to without cluttering component prop signatures.',
    problemSolved: 'Standardizes session lifecycle handling, token refresh synchronization, and localStorage persistence.',
    prerequisites: 'Context API, localStorage, JWT concepts, and TypeScript generics.',
    syntax: [
      '// Consolidated Auth Context Interface:',
      'interface AuthContextType {',
      '  user: User | null;',
      '  isAuthenticated: boolean;',
      '  login: (credentials: Credentials) => Promise<void>;',
      '  logout: () => void;',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize from storage or token verification on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('app_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('app_user_session');
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    // Simulated auth API call
    const loggedUser = { id: 'usr_42', email, role: 'admin' };
    setUser(loggedUser);
    localStorage.setItem('app_user_session', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user_session');
  };

  // Crucial: Value is memoized to prevent re-renders when parent renders!
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout
  }), [user]);

  if (isInitializing) {
    return <div>Verifying credentials...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
`,
    lineByLine: [
      '- Line 4: AuthContext initialized.',
      '- Line 8: isInitializing prevents flashes of login screen while inspecting localStorage.',
      '- Line 12-21: Hydrates user session on initial mount with safe JSON parse error handling.',
      '- Line 33-38: useMemo caches the context object; consumers only re-render when user reference changes.',
      '- Line 41-43: Suspends rendering children until initial session check finishes.'
    ].join('\n'),
    internalFlow: [
      '1. On initial mount: isInitializing is true; children are not rendered, preventing premature protected route redirects.',
      '2. useEffect reads stored session and calls setUser.',
      '3. React schedules a re-render with the user object and sets isInitializing = false.',
      '4. Children mount; any child calling useAuth() reads the active authenticated user immediately.',
      '5. When logout() is called, setUser(null) triggers re-render across all auth consumers simultaneously.'
    ].join('\n'),
    whenToUse: 'For global authentication, tenant configuration, and design system themes.',
    whenNotToUse: 'Do not put server data collections (e.g. orders, invoices, products) in AuthContext; use TanStack Query instead.',
    commonMistakes: [
      '- Forgetting the isInitializing gate, causing protected routes to immediately redirect authenticated users to /login on page refresh before localStorage finishes reading!'
    ].join('\n'),
    perfA11y: 'The initializing loading gate prevents screen readers from announcing unauthorized login prompts to already logged-in users.',
    realWorld: 'Enterprise platforms like LesHub wrap the root layout in AuthProvider and ThemeProvider, ensuring navbar, sidebar, and profile dialogs share state effortlessly.',
    interviewQs: [
      '**Q: Why is an isInitializing state gate critical in an AuthProvider?**',
      '*Spoken Answer*: "When a user refreshes an authenticated page, the React state initially mounts with user: null before reading the session token from localStorage or validating it against the server. If you do not have an isInitializing gate, protected route guards will see user: null and immediately trigger a false-positive redirect to the /login page, creating a jarring user experience. The isInitializing gate pauses route evaluation until the initial credential verification resolves."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects integrate refresh token rotation and axios/fetch interceptors into the AuthProvider, automatically refreshing expired access tokens without interrupting the user.',
    revisionSummary: [
      '- Always gate initial auth check with `isInitializing`.',
      '- Memoize context value using `useMemo`.',
      '- Clean up localStorage on logout.'
    ].join('\n')
  }),

  createSection('8.3', '44. The Context Re-render Cascade Problem & Context Splitting', 3, {
    whatItIs: 'The Context Re-render Cascade is the performance bottleneck where updating any property in a Context value forces every component subscribed to that Context to re-render, even if the component only cares about an untouched property. Context Splitting is the architectural pattern that eliminates this issue.',
    whyItExists: 'React Context was designed for dependency injection, not fine-grained state management. React does not provide selector-based subscriptions in `useContext`; if the context object changes reference, all consumers re-render.',
    problemSolved: 'Prevents unnecessary re-renders in components that only trigger actions without reading state values.',
    prerequisites: 'React Context, `React.memo`, and referential equality.',
    syntax: [
      '// Anti-Pattern (Combined State & Dispatch):',
      '<CombinedContext.Provider value={{ state, dispatch }} /> // Both trigger re-renders!',
      '',
      '// Solution (Split Contexts):',
      '<CounterStateContext.Provider value={count}>',
      '  <CounterDispatchContext.Provider value={dispatch}>',
      '    {children}',
      '  </CounterDispatchContext.Provider>',
      '</CounterStateContext.Provider>'
    ].join('\n'),
    minimalExample: `
import React, { createContext, useContext, useState, useMemo } from 'react';

// 1. Separate State from Dispatch
const CountStateContext = createContext(null);
const CountDispatchContext = createContext(null);

export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  // Dispatch functions never change identity!
  const increment = useMemo(() => () => setCount(c => c + 1), []);

  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={increment}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

// Consumer that READS count: Re-renders when count changes!
export function CountDisplay() {
  const count = useContext(CountStateContext);
  console.log('Rendering CountDisplay');
  return <h2>Current Count: {count}</h2>;
}

// Consumer that only CLICKS button: NEVER re-renders when count changes!
export function IncrementButton() {
  const increment = useContext(CountDispatchContext);
  console.log('Rendering IncrementButton (NEVER re-renders on count change!)');
  return <button onClick={increment}>Increment</button>;
}
`,
    lineByLine: [
      '- Line 4-5: Declares two separate contexts: CountStateContext and CountDispatchContext.',
      '- Line 11: increment callback is memoized with empty deps, guaranteeing a permanent stable reference.',
      '- Line 14-18: Providers are nested.',
      '- Line 22-26: CountDisplay subscribes only to StateContext; re-renders on update.',
      '- Line 29-33: IncrementButton subscribes only to DispatchContext; NEVER re-renders when count increments!'
    ].join('\n'),
    internalFlow: [
      'Why Splitting Prevents Cascades:',
      '1. In a combined context { count, increment }, every increment creates a new object reference.',
      '2. React iterates over all Fiber nodes registered as consumers of the combined context, re-rendering both CountDisplay AND IncrementButton.',
      '3. When split into two contexts: IncrementButton only subscribes to CountDispatchContext.',
      '4. When count updates, CountDispatchContext value does not change. React skips IncrementButton entirely!'
    ].join('\n'),
    whenToUse: 'Whenever a Context manages state that updates frequently or has separate reader components and writer components.',
    whenNotToUse: 'For truly static global values (e.g. app config or company branding) that never change during runtime.',
    commonMistakes: '- Believing `React.memo` around a consumer component will stop Context re-renders (it will not! Context changes bypass `React.memo` completely).',
    perfA11y: 'Context splitting prevents thousands of buttons and icons in large dashboards from re-rendering when an active counter or timer ticks.',
    realWorld: 'State libraries like Zustand and Redux solve this natively by implementing selector subscriptions outside of Context.',
    interviewQs: [
      '**Q: Does React.memo prevent a component from re-rendering when a Context it consumes updates?**',
      '*Spoken Answer*: "No, \`React.memo\` does not prevent a component from re-rendering when a Context it consumes updates. \`React.memo\` only prevents re-renders caused by parent re-renders when incoming props remain referentially equal. If a component calls \`useContext(MyContext)\` and the Provider\'s value reference changes, React flags that component Fiber directly as dirty and forces an immediate re-render, completely bypassing \`React.memo\`. To optimize Context performance, you must split state from dispatch or migrate to atomic selector stores like Zustand."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects advise against using React Context as a general-purpose state management solution. If an app requires fine-grained selectors, Zustand or Redux Toolkit is strictly preferred.',
    revisionSummary: [
      '- Context updates bypass `React.memo`.',
      '- All consumers re-render when context value changes.',
      '- Split state context from dispatch context to stop re-render cascades.'
    ].join('\n')
  }),

  createSection('8.4', '45. Context vs Redux Toolkit vs Zustand: Architectural Decision Matrix', 4, {
    whatItIs: 'A comprehensive architectural comparison matrix evaluating React Context, Redux Toolkit (RTK), and Zustand across state topology, re-render granularity, DevTools debugging, learning curves, and bundle sizes.',
    whyItExists: 'Frontend teams often default to either Context or Redux without evaluating tradeoffs, leading to either unmaintainable boilerplate or severe performance regressions.',
    problemSolved: 'Provides concrete decision criteria for choosing the optimal state management tool for any engineering project.',
    prerequisites: 'React Context, Redux architecture (store, actions, reducers), and Zustand store concepts.',
    syntax: [
      '// Architectural Comparison Matrix:',
      '| Feature | React Context | Zustand | Redux Toolkit (RTK) |',
      '| :--- | :--- | :--- | :--- |',
      '| Paradigm | Dependency Injection | Atomic Store + Selectors | Centralized Store + Slices |',
      '| Bundle Overhead | 0 kB (Built into React) | ~1 kB | ~12 kB |',
      '| Selectors / Fine-grained Re-renders | No (All consumers render) | Yes (Atomic selectors) | Yes (createSelector / memoized) |',
      '| Middleware / DevTools | Manual | Built-in DevTools/Persist | Redux DevTools, RTK Query |',
      '| Best For | Theme, Auth, Low-frequency | Client state, Modals, Carts | Complex enterprise workflows |'
    ].join('\n'),
    minimalExample: `
// Minimal decision tree in code comments:
// 1. Is the data low-frequency and global (Theme, Auth, Language)?
//    -> Use React Context.
// 2. Is the data interactive client state (Cart, Modals, Drafts) needing fine-grained selectors?
//    -> Use Zustand.
// 3. Is the team large, needing strict standardized architecture, time-travel, or RTK Query?
//    -> Use Redux Toolkit.
// 4. Is the data from a server API?
//    -> Use TanStack Query (NOT Redux or Context!).

export function StateArchitectureSummary() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h4>Frontend State Taxonomy</h4>
      <ul>
        <li><strong>Server State:</strong> Use TanStack Query (Automatic caching & invalidation)</li>
        <li><strong>Client Global State:</strong> Use Zustand (Minimal boilerplate, fine-grained selectors)</li>
        <li><strong>Dependency Injection:</strong> Use React Context (Theme, Auth session, Local overrides)</li>
        <li><strong>Component Memory:</strong> Use useState / useReducer (Form inputs, toggles, local tabs)</li>
      </ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 2-8: The definitive decision tree for modern frontend architecture.',
      '- Categorizes state into 4 distinct quadrants: Server State, Client Global State, Dependency Injection, and Component Memory.'
    ].join('\n'),
    internalFlow: [
      'Store Architecture Comparison:',
      '1. Context: Uses React\'s Fiber tree. Values flow down through the Fiber hierarchy.',
      '2. Zustand: Stores state outside React in a plain JavaScript closure. Components subscribe via useSyncExternalStore with atomic selectors. Only the exact component whose selected value changed re-renders!',
      '3. Redux Toolkit: Single global store object. Dispatches actions through middleware. Uses Immer for immutable updates and reselect for memoized derived selectors.'
    ].join('\n'),
    whenToUse: [
      '- Choose Context for: Theme, Auth, Locale, injecting dependencies.',
      '- Choose Zustand for: Shopping carts, multi-step modals, audio players, canvas state.',
      '- Choose Redux Toolkit for: Massive enterprise apps with existing Redux codebases and strict team governance.'
    ].join('\n'),
    whenNotToUse: 'Never store large collections of server data in Redux or Context; that is the domain of TanStack Query or RTK Query.',
    commonMistakes: [
      '- Using Redux Toolkit for trivial projects, drowning in boilerplate.',
      '- Using Context for shopping carts, causing the entire product grid to re-render whenever an item is added.'
    ].join('\n'),
    perfA11y: 'Atomic selectors in Zustand ensure that a cart badge counter re-rendering does not cause the underlying navigation bar or product cards to re-render.',
    realWorld: 'Modern SaaS products (e.g. Chrona) use Zustand for timer and audio playback state, and TanStack Query for task synchronization.',
    interviewQs: [
      '**Q: When would you choose Zustand over React Context for global state management?**',
      '*Spoken Answer*: "I choose Zustand over React Context whenever state updates frequently or requires fine-grained subscriptions. React Context causes every component that consumes the context to re-render whenever any value in the provider changes, even if the component only needed an untouched slice. Zustand stores state outside React in a lightweight store and uses atomic selectors (e.g. \`useStore(state => state.cartCount)\`). It only triggers a re-render when the specific selected value changes, delivering far superior performance for shopping carts, modals, and interactive dashboards."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects avoid the "One Store to Rule Them All" anti-pattern. Modern React architecture separates Server Cache (TanStack Query) from Client Global UI State (Zustand) and Local State (`useState`).',
    revisionSummary: [
      '- Context: Dependency injection for low-frequency data.',
      '- Zustand: Lightweight, fine-grained selectors, 1kB bundle.',
      '- Redux Toolkit: Structured enterprise workflows with Immer.',
      '- Server data belongs in TanStack Query, NOT client state.'
    ].join('\n')
  })
];

// ==========================================
// PART 9: Reducers & Complex State
// ==========================================
const p9_sections = [
  createSection('9.1', '46. useReducer Architecture & State Machines', 1, {
    whatItIs: 'useReducer is an alternative to useState for managing complex state logic. It accepts a reducer function (state, action) => newState and an initial state, returning the current state paired with a dispatch method.',
    whyItExists: 'When state transitions involve multiple sub-values, or when the next state depends on complex previous state conditions, multiple useState setters scattered across event handlers lead to race conditions and bugs.',
    problemSolved: 'Consolidates state update logic into a single pure function outside the component, enforcing predictable state-machine transitions.',
    prerequisites: 'Pure functions, JavaScript switch statements, and Redux architectural concepts.',
    syntax: [
      '// Reducer Signature:',
      'function reducer(state, action) {',
      '  switch (action.type) {',
      '    case "INCREMENT": return { ...state, count: state.count + 1 };',
      '    default: return state;',
      '  }',
      '}',
      '',
      '// Component Usage:',
      'const [state, dispatch] = useReducer(reducer, initialState);',
      'dispatch({ type: "INCREMENT" });'
    ].join('\n'),
    minimalExample: `
import React, { useReducer } from 'react';

// 1. Initial State
const initialState = { status: 'idle', count: 0, error: null };

// 2. Pure Reducer Function
function counterReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', count: action.payload };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return initialState;
    default:
      throw new Error(\`Unhandled action type: \${action.type}\`);
  }
}

export default function ReducerCounter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  const simulateFetch = () => {
    dispatch({ type: 'FETCH_START' });
    setTimeout(() => {
      if (Math.random() > 0.3) {
        dispatch({ type: 'FETCH_SUCCESS', payload: Math.floor(Math.random() * 100) });
      } else {
        dispatch({ type: 'FETCH_ERROR', error: 'Network timeout' });
      }
    }, 500);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Status: {state.status.toUpperCase()}</h3>
      {state.status === 'loading' && <p>Loading data...</p>}
      {state.status === 'success' && <p>Loaded Count: {state.count}</p>}
      {state.status === 'error' && <p style={{ color: '#ef4444' }}>Error: {state.error}</p>}
      <button onClick={simulateFetch} disabled={state.status === 'loading'}>Fetch Random Count</button>
      <button onClick={() => dispatch({ type: 'RESET' })} style={{ marginLeft: '0.5rem' }}>Reset</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: Explicit initialState object with mutually exclusive status states.',
      '- Line 7-19: Pure reducer function outside the component body. Handles action types and returns fresh state copies.',
      '- Line 22: useReducer hook binds reducer to component Fiber.',
      '- Line 25-33: Event handler dispatches declarative actions ({ type: "FETCH_START" }) rather than imperatively calculating state.'
    ].join('\n'),
    internalFlow: [
      '1. Component calls dispatch(action).',
      '2. React appends the action to the Fiber hook\'s queue and marks the component dirty.',
      '3. In the render phase, React invokes reducer(currentState, action).',
      '4. The reducer executes synchronously. React stores the return value in memoizedState.',
      '5. Crucial: The dispatch function has a permanent stable reference identity (dispatch === dispatch across all renders), making it safe to omit from useEffect dependency arrays.'
    ].join('\n'),
    whenToUse: 'When state involves 3+ related sub-fields, when state transitions form a finite state machine, or when passing dispatch down instead of multiple callbacks.',
    whenNotToUse: 'For simple independent primitives (e.g. isModalOpen); useState is simpler.',
    commonMistakes: [
      '- Mutating state directly in the reducer: state.count++. Reducers MUST be pure functions returning new objects.',
      '- Performing side effects (fetch, localStorage, timers) inside the reducer function.'
    ].join('\n'),
    perfA11y: 'Because `dispatch` never changes identity, passing `dispatch` down to deeply nested children never breaks `React.memo` optimizations.',
    realWorld: 'Complex form builders and multi-step checkout wizards rely on `useReducer` to manage draft validation, step transitions, and error handling.',
    interviewQs: [
      '**Q: When should you prefer useReducer over useState?**',
      '*Spoken Answer*: "You should prefer useReducer when a component manages complex state where multiple sub-values change together, or when the next state depends heavily on conditions from the previous state. useReducer decouples \'what happened\' (dispatching an action) from \'how the state updates\' (the reducer function). It also simplifies deep component trees because the dispatch function identity is guaranteed to remain stable forever, allowing you to pass dispatch down via Context without triggering re-renders in child components."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers love `useReducer` because the reducer function can be exported and unit-tested with standard Vitest assertions without mounting any React components.',
    revisionSummary: [
      '- `useReducer` consolidates complex state transitions.',
      '- Reducers MUST be pure: `(state, action) => newState`.',
      '- `dispatch` is guaranteed referentially stable across all renders.'
    ].join('\n')
  }),

  createSection('9.2', '47. State Machine Thinking, Complex Form State & Undo/Redo Architecture', 2, {
    whatItIs: 'An advanced architectural pattern using `useReducer` to implement Finite State Machines (FSMs) that make impossible UI states unrepresentable, and historical undo/redo stacks.',
    whyItExists: 'Boolean flags (`isLoading`, `isError`, `isSuccess`) allow invalid combinations (e.g. `isLoading: true` and `isSuccess: true` simultaneously). State machine thinking eliminates invalid states.',
    problemSolved: 'Eliminates race conditions and UI deadlocks in complex multi-step processes.',
    prerequisites: 'Finite State Machine theory, Stack data structures, and `useReducer`.',
    syntax: [
      '// State Machine Status Enum:',
      'type Status = "idle" | "loading" | "resolved" | "rejected";',
      '',
      '// Undo/Redo State Structure:',
      'interface HistoryState<T> {',
      '  past: T[];',
      '  present: T;',
      '  future: T[];',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useReducer } from 'react';

// Undo/Redo Generic Reducer
function historyReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'SET':
      return {
        past: [...past, present],
        present: action.payload,
        future: [] // Clear future on new action
      };
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    default:
      return state;
  }
}

export default function CanvasUndoRedo() {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: '#38bdf8',
    future: []
  });

  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h4>Undo/Redo Color Palette</h4>
      <div style={{ width: 100, height: 100, backgroundColor: history.present, borderRadius: '8px', marginBottom: '1rem' }} />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {colors.map(c => (
          <button key={c} onClick={() => dispatch({ type: 'SET', payload: c })} style={{ background: c, width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer' }} />
        ))}
      </div>

      <button onClick={() => dispatch({ type: 'UNDO' })} disabled={history.past.length === 0}>Undo</button>
      <button onClick={() => dispatch({ type: 'REDO' })} disabled={history.future.length === 0} style={{ marginLeft: '0.5rem' }}>Redo</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-33: historyReducer manages past, present, and future stacks.',
      '- Line 7-12: SET pushes current present to past, sets new present, and clears future.',
      '- Line 13-21: UNDO pops from past, sets present, and pushes old present to future.',
      '- Line 22-30: REDO shifts from future, sets present, and pushes old present to past.'
    ].join('\n'),
    internalFlow: [
      '1. The component maintains a historical timeline in memory.',
      '2. Actions mutate the past/future array stacks immutably.',
      '3. Disabling buttons based on past.length === 0 and future.length === 0 prevents out-of-bounds stack navigation.'
    ].join('\n'),
    whenToUse: 'For interactive canvas tools, rich text editors, multi-step wizards, and checkout workflows.',
    whenNotToUse: 'For standard CRUD lists; maintaining history stacks consumes extra memory.',
    commonMistakes: [
      '- Forgetting to clear the `future` stack when a new `SET` action occurs (violates standard undo/redo history trees).'
    ].join('\n'),
    perfA11y: 'Cap the history stack size (e.g. maximum 50 undo states) to prevent unbounded memory growth during long editing sessions.',
    realWorld: 'Design applications (Figma, Canva) and spreadsheet tools use this exact stack-based reducer pattern for command undo/redo.',
    interviewQs: [
      '**Q: How does state machine thinking prevent bugs compared to boolean flags?**',
      '*Spoken Answer*: "Using independent boolean flags like isLoading, isError, and isSuccess introduces 2^3 = 8 possible states, many of which are completely invalid—such as a component being both loading and error simultaneously. State machine thinking models the UI with an explicit status enum (e.g. status: \'idle\' | \'loading\' | \'success\' | \'error\'). By enforcing valid state transitions in a reducer, it becomes mathematically impossible for the UI to enter an invalid or conflicting state."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects standardize on XState or reducer-based state machines for mission-critical payment gateways, ensuring transactions never skip authorization or double-submit.',
    revisionSummary: [
      '- State machines make impossible states unrepresentable.',
      '- Undo/Redo uses past, present, and future array stacks.',
      '- Cap history length to avoid memory leaks.'
    ].join('\n')
  })
];

// ==========================================
// PART 10: Refs & Imperative Behavior
// ==========================================
const p10_sections = [
  createSection('10.1', '48. useRef: DOM References, Mutable Instance Variables & Previous Value Pattern', 1, {
    whatItIs: 'useRef returns a mutable ref object whose .current property is initialized to the passed argument. The returned object persists for the full lifetime of the component and changing .current does NOT trigger a re-render.',
    whyItExists: 'React needs an escape hatch to access native DOM nodes directly, and a way to hold mutable instance variables across renders without causing UI updates.',
    problemSolved: 'Enables imperative DOM operations (focus, scroll, measurement) and tracks timers, intervals, and previous state values.',
    prerequisites: 'JavaScript heap references, DOM nodes, and component render lifecycle.',
    syntax: [
      '// 1. DOM Ref:',
      'const inputRef = useRef(null);',
      '<input ref={inputRef} />',
      '',
      '// 2. Mutable Instance Variable:',
      'const countRef = useRef(0);',
      'countRef.current += 1; // Does NOT trigger re-render!'
    ].join('\n'),
    minimalExample: `
import React, { useState, useRef, useEffect } from 'react';

export default function PreviousValueTracker() {
  const [count, setCount] = useState(0);
  
  // 1. Ref as previous value tracker
  const prevCountRef = useRef(0);

  // 2. Ref as DOM element anchor
  const inputRef = useRef(null);

  useEffect(() => {
    // Runs after paint: updates ref to current count for NEXT render to compare
    prevCountRef.current = count;
  }, [count]);

  const handleFocus = () => {
    // Imperative DOM access
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <p>Current: {count} | Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <div style={{ marginTop: '1rem' }}>
        <input ref={inputRef} placeholder="Focusable input..." />
        <button onClick={handleFocus} style={{ marginLeft: '0.5rem' }}>Focus Input</button>
      </div>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7: prevCountRef initialized to 0.',
      '- Line 10: inputRef initialized to null.',
      '- Line 14: After the frame paints, useEffect records count into prevCountRef.current.',
      '- Line 27: Displays both current state and previous state simultaneously.'
    ].join('\n'),
    internalFlow: [
      '1. React stores the ref object on the Fiber: { memoizedState: { current: initialValue } }.',
      '2. Modifying ref.current is a direct heap property assignment; React has no setter and never schedules a render.',
      '3. When <input ref={inputRef} /> is committed, React sets inputRef.current = HTMLInputElement DOM node.',
      '4. When the component unmounts, React sets inputRef.current = null.'
    ].join('\n'),
    whenToUse: 'For managing focus, text selection, media playback, measuring DOM dimensions, storing timer/interval IDs, and caching previous state values.',
    whenNotToUse: 'Do not use `useRef` to store data that affects the visual structure of JSX (use `useState`). Do not read or write `ref.current` during the render phase!',
    commonMistakes: [
      '- Writing to `ref.current` directly in the component render body (`ref.current = count`). This breaks concurrent rendering and causes non-deterministic behavior!',
      '- Expecting changes to a ref to update the screen.'
    ].join('\n'),
    perfA11y: 'Managing focus with `inputRef.current.focus()` after closing modals is required by WCAG 2.1 to prevent focus loss for screen reader users.',
    realWorld: 'Video streaming players (Netflix, YouTube) use `useRef` to hold video DOM element instances and invoke `.play()` / `.pause()` imperatively.',
    interviewQs: [
      '**Q: What is the difference between useState and useRef?**',
      '*Spoken Answer*: "Both useState and useRef persist data across component re-renders. The fundamental difference is that updating state via its setter function notifies React to schedule a re-render and reconcile the UI. Updating ref.current directly mutates a plain JavaScript object in memory without notifying React, so zero re-renders occur. State is for data that directly impacts what is displayed on screen; refs are for imperative DOM access or background mutable values like timers and socket instances."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers never mutate `ref.current` during render because concurrent React can render a component, discard the result, and re-render; mutating refs during render leads to memory corruption.',
    revisionSummary: [
      '- `useRef` stores mutable values without triggering re-renders.',
      '- Attaching `ref` to JSX binds the native DOM node.',
      '- NEVER read or write `ref.current` during rendering; do it in effects or handlers.'
    ].join('\n')
  }),

  createSection('10.2', '49. Forwarding Refs & useImperativeHandle (React 19 ref prop vs forwardRef)', 2, {
    whatItIs: 'Ref forwarding allows a component to receive a ref and pass it down to a child DOM element. React 19 natively supports passing `ref` as a standard prop, deprecating the legacy `React.forwardRef` wrapper.',
    whyItExists: 'In React 18 and earlier, `ref` was a reserved prop (like `key`); passing `ref` to a function component triggered a console warning. React 19 treats `ref` as an ordinary prop.',
    problemSolved: 'Allows parent components to access child DOM nodes cleanly and customize exposed methods via `useImperativeHandle`.',
    prerequisites: '`useRef`, `useImperativeHandle`, and React 18 vs 19 version differences.',
    syntax: [
      '// React 19 Modern Syntax (ref is a normal prop!):',
      'function MyInput({ label, ref }) {',
      '  return <input ref={ref} />;',
      '}',
      '',
      '// React 18 Legacy Syntax (Requires forwardRef wrapper):',
      'const MyInput = forwardRef((props, ref) => {',
      '  return <input ref={ref} />;',
      '});'
    ].join('\n'),
    minimalExample: `
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// Compatible Ref Forwarding Component with useImperativeHandle
export const CustomPlayer = forwardRef(function CustomPlayer(props, ref) {
  const videoRef = useRef(null);

  // Restricts parent to controlled API rather than raw <video> element
  useImperativeHandle(ref, () => ({
    playVideo: () => {
      console.log('Imperatively triggering video play');
    },
    resetVideo: () => {
      console.log('Imperatively resetting video time');
    }
  }));

  return (
    <div style={{ padding: '1rem', background: '#020617', border: '1px solid #1e293b' }}>
      <p>Custom Video Player Shell</p>
      <video ref={videoRef} style={{ width: 200, height: 100, background: '#000' }} />
    </div>
  );
});

export default function PlayerController() {
  const playerRef = useRef(null);

  return (
    <div style={{ padding: '1rem' }}>
      <CustomPlayer ref={playerRef} />
      <button onClick={() => playerRef.current?.playVideo()} style={{ marginTop: '0.5rem' }}>
        Play via Ref
      </button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: forwardRef wraps CustomPlayer (in React 19, ref can simply be destructured from props).',
      '- Line 8-15: useImperativeHandle assigns a custom object to ref.current.',
      '- Line 26: Parent creates playerRef and binds it to CustomPlayer.',
      '- Line 30: Parent invokes playerRef.current?.playVideo() safely.'
    ].join('\n'),
    internalFlow: [
      '1. Parent creates ref object: { current: null }.',
      '2. React passes ref to the forwarded component.',
      '3. useImperativeHandle runs during layout phase, populating ref.current with the custom method object.',
      '4. When parent calls playerRef.current.playVideo(), it invokes the closure-bound method.'
    ].join('\n'),
    whenToUse: 'When authoring reusable design system inputs, modals, video players, and canvas elements.',
    whenNotToUse: 'Do not use refs for general data passing; props and state should handle 99% of communication.',
    commonMistakes: [
      '- Exposing raw DOM nodes when a controlled method API would be safer and more maintainable.'
    ].join('\n'),
    perfA11y: 'Forwarding refs to underlying inputs allows parent forms to automatically focus the first invalid field upon validation failure.',
    realWorld: 'All major UI component libraries (MUI, Radix, Chakra) forward refs on every button and input primitive.',
    interviewQs: [
      '**Q: How does ref handling change in React 19 compared to React 18?**',
      '*Spoken Answer*: "In React 18 and earlier, \`ref\` was treated as a special internal keyword, meaning function components could not accept a \`ref\` prop directly and had to be wrapped in \`React.forwardRef((props, ref) => ...)\`. In React 19, \`ref\` is treated as a standard prop: you can pass \`ref\` directly to function components and destructure it like any other prop (\`function MyInput({ label, ref })\`), making \`forwardRef\` obsolete and simplifying component signatures."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects leverage `useImperativeHandle` to preserve encapsulation boundaries, preventing consumers from breaking component styles by manipulating DOM classes directly.',
    revisionSummary: [
      '- React 19: `ref` is a normal prop (no `forwardRef` needed).',
      '- React 18: requires `forwardRef((props, ref) => ...)`.',
      '- `useImperativeHandle` restricts exposed methods on the ref.'
    ].join('\n')
  })
];

// ==========================================
// PART 11: Rendering Engine, Fiber & Reconciliation
// ==========================================
const p11_sections = [
  createSection('11.1', '50. The Virtual DOM Deep-Dive: Architecture, Diffing & Limitations', 1, {
    whatItIs: 'The Virtual DOM (VDOM) is a lightweight in-memory representation of the real DOM tree constructed from plain JavaScript objects. React uses it to calculate minimal DOM patches via a heuristic diffing algorithm.',
    whyItExists: 'Direct DOM manipulation is slow: modifying DOM nodes triggers expensive browser layout recalculations, style recalibration, and pixel repainting (Layout Thrashing). The Virtual DOM batches changes in memory.',
    problemSolved: 'Eliminates layout thrashing and abstracts browser-specific DOM implementation details.',
    prerequisites: 'Browser rendering pipeline (DOM, CSSOM, Render Tree, Layout, Paint), tree diffing algorithms.',
    syntax: [
      '// React Element (Virtual DOM node):',
      '{',
      '  $$typeof: Symbol.for("react.element"),',
      '  type: "button",',
      '  key: "btn-1",',
      '  props: { className: "primary", children: "Submit" }',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function VirtualDomVisualizer() {
  const [toggle, setToggle] = useState(false);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Virtual DOM Diffing Heuristic</h3>
      {toggle ? (
        <span className="badge">Active Status</span>
      ) : (
        <div className="badge">Active Status</div>
      )}
      <button onClick={() => setToggle(!toggle)} style={{ display: 'block', marginTop: '1rem' }}>
        Switch Tag (span vs div)
      </button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 8-12: When toggle switches from false to true, the element type changes from <div> to <span>.',
      '- Because the tag type changed, React\'s O(N) heuristic diffing algorithm immediately tears down the entire <div> subtree and builds a new <span> DOM node.'
    ].join('\n'),
    internalFlow: [
      'The O(N) Diffing Heuristics:',
      '1. Standard complete tree diffing is O(N^3). For 1,000 elements, that requires 1 billion comparisons! React achieves O(N) using two heuristic assumptions:',
      '   - Assumption 1: Two elements of different types will produce different trees (e.g. <div> to <span> tears down old tree).',
      '   - Assumption 2: The developer can hint at stable element identity across renders using the key prop.',
      '2. In memory, React compares the Virtual DOM node against the current Fiber node.',
      '3. Only modified attributes (e.g. className or textContent) are queued for DOM mutation.'
    ].join('\n'),
    whenToUse: 'Under the hood in all React applications.',
    whenNotToUse: 'Modern compiled frameworks (Svelte, Solid) prove that a Virtual DOM is not strictly required for declarative UI; compilers can generate direct DOM updates with lower memory overhead.',
    commonMistakes: [
      '- Believing the Virtual DOM is faster than direct optimized Vanilla JS (it is not; it is an abstraction that guarantees maintainable performance at scale).'
    ].join('\n'),
    perfA11y: 'Batching DOM mutations via the Virtual DOM prevents layout thrashing, keeping frame rates at a smooth 60fps.',
    realWorld: 'React’s diffing algorithm enables complex dynamic dashboards with thousands of metrics to update smoothly without page freezing.',
    interviewQs: [
      '**Q: How does React\'s diffing algorithm achieve O(N) complexity instead of O(N^3)?**',
      '*Spoken Answer*: "A general algorithm for finding the minimal operations to transform one arbitrary tree into another has a complexity of O(N^3), which would be far too slow for web interfaces. React achieves linear O(N) complexity by relying on two practical heuristics: first, two elements of different types (such as changing a <div> to a <p>) will produce different trees, so React tears down the old tree and builds the new one from scratch; second, elements in lists can be identified as stable across renders using unique, predictable keys, allowing React to match and reorder nodes in a single pass."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers understand the memory footprint of Fiber trees. In memory-constrained environments, massive Virtual DOM trees incur garbage collection pauses; windowing/virtualization is used to keep the active Fiber count under 2,000 nodes.',
    revisionSummary: [
      '- Virtual DOM is a tree of plain JS objects in memory.',
      '- Diffing uses 2 heuristics to achieve O(N) performance.',
      '- Changing element type tears down the entire subtree.'
    ].join('\n')
  }),

  createSection('11.2', '51. The Two Phases: Render vs Commit Phase', 2, {
    whatItIs: 'React’s execution lifecycle is strictly divided into two phases: the **Render Phase** (pure, interruptible calculation of UI changes) and the **Commit Phase** (synchronous application of mutations to the real browser DOM).',
    whyItExists: 'In Concurrent React, rendering must be interruptible to maintain high-priority responsiveness. Separating calculation from DOM mutation allows React to discard incomplete render calculations without leaving half-mutated DOM nodes on screen.',
    problemSolved: 'Prevents broken, half-rendered UI and enables time-slicing and concurrent transitions.',
    prerequisites: 'Fiber architecture, JavaScript call stack, and browser paint cycle.',
    syntax: [
      '// Phase Breakdown:',
      '1. Render Phase (Pure): Component function execution, useState updaters, diffing.',
      '2. Commit Phase (Impure): DOM mutations, useLayoutEffect, browser paint, useEffect.'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function PhaseLifecycleDemo() {
  const [count, setCount] = useState(0);

  // 1. RENDER PHASE: Must be completely pure! Zero side effects!
  // This function can run multiple times before committing!
  console.log('[Render Phase] Executing component function for count:', count);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <p>Render Phase Demo: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Trigger Re-render</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7: Console log inside the component render body runs during the Render Phase.',
      '- If React is interrupted by high-priority user input, this function may run again before any DOM changes are committed!'
    ].join('\n'),
    internalFlow: [
      'Detailed Phase Progression:',
      '1. **Render Phase**: React calls component functions, resolves hooks, compares Virtual DOM with Fiber tree, and calculates list of effect tags (Placement, Update, Deletion). This phase is purely in memory, non-blocking, and can be paused or restarted.',
      '2. **Pre-Commit Phase**: getSnapshotBeforeUpdate runs.',
      '3. **Commit Phase**: React synchronously mutates the real DOM (appendChild, removeChild). This phase CANNOT be interrupted.',
      '4. **Layout Phase**: useLayoutEffect cleanups and callbacks run synchronously.',
      '5. **Browser Paint**: Browser renders pixels.',
      '6. **Passive Phase**: useEffect cleanups and callbacks run asynchronously.'
    ].join('\n'),
    whenToUse: 'Keep render functions pure; execute all side effects in event handlers or useEffect.',
    whenNotToUse: 'NEVER trigger side effects (API calls, logging, mutating variables) in the Render Phase.',
    commonMistakes: [
      '- Making API calls or modifying global variables in the component render body (causes duplicated calls in concurrent mode and Strict Mode).'
    ].join('\n'),
    perfA11y: 'Because the Commit Phase is synchronous and brief, users experience zero UI tearing or visual flickering.',
    realWorld: 'React Concurrent Mode leverages the two-phase architecture to pause background tab rendering when a user opens a modal.',
    interviewQs: [
      '**Q: What is the difference between the Render Phase and the Commit Phase in React?**',
      '*Spoken Answer*: "The Render Phase is the calculation phase: React invokes component functions, runs diffing algorithms, and constructs the work-in-progress Fiber tree entirely in memory. It is purely computational, asynchronous, and interruptible in Concurrent Mode. The Commit Phase is the execution phase: React takes the computed changes and applies them directly to the real browser DOM via native DOM mutations. The Commit Phase is strictly synchronous and non-interruptible to prevent users from ever seeing a half-rendered or inconsistent UI."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers audit code for Strict Mode double-render safety, ensuring render-phase purity across all custom hooks.',
    revisionSummary: [
      '- Render Phase: Pure, asynchronous, interruptible calculation.',
      '- Commit Phase: Synchronous, non-interruptible DOM mutations.',
      '- Side effects belong in Commit (Effects/Handlers), NEVER in Render.'
    ].join('\n')
  }),

  createSection('11.3', '52. Fiber Architecture, The Work Loop & Priority Schedulers', 3, {
    whatItIs: 'Fiber is the internal reconciliation engine rewrite introduced in React 16. It re-implemented the call stack as a linked-list data structure where each "Fiber" represents a unit of work that can be paused, prioritized, aborted, and resumed.',
    whyItExists: 'In React 15, reconciliation was synchronous recursion down the JavaScript call stack (Stack Reconciler). Once rendering began, it locked the main thread until the entire tree was processed, causing frame drops (jank) during heavy updates.',
    problemSolved: 'Enables time-slicing, concurrent rendering, and prioritizing urgent user interactions over background updates.',
    prerequisites: 'Call stack vs Heap linked lists, browser MessageChannel, and requestIdleCallback.',
    syntax: [
      '// Fiber Node Internal Structure (Simplified):',
      '{',
      '  tag: WorkTag,            // FunctionComponent, ClassComponent, HostComponent',
      '  key: null | string,      // Unique key',
      '  type: any,               // Function, class, or string tag ("div")',
      '  stateNode: any,          // Real DOM node or component instance',
      '  return: Fiber | null,    // Parent Fiber pointer',
      '  child: Fiber | null,     // First child Fiber pointer',
      '  sibling: Fiber | null,   // Next sibling Fiber pointer',
      '  memoizedState: any,      // Hooks linked list',
      '  lanes: Lanes             // Priority bitmask',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

// Fiber Linked List Mental Model Demonstration:
// <Parent>
//   <ChildA />
//   <ChildB />
// </Parent>
// Fiber Tree Representation:
// Parent.child -> ChildA
// ChildA.sibling -> ChildB
// ChildA.return -> Parent
// ChildB.return -> Parent

export default function FiberTreeDemo() {
  const [items] = useState(['Alpha', 'Beta', 'Gamma']);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Fiber Linked List Architecture</h3>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-11: Code comments illustrate the exact linked list pointers (child, sibling, return) linking Fiber nodes in memory.',
      '- Line 20-22: ul.child points to li Alpha; Alpha.sibling points to li Beta; Beta.sibling points to li Gamma.'
    ].join('\n'),
    internalFlow: [
      'The Fiber Work Loop:',
      '1. React maintains two trees: Current (what is on screen) and Work-in-Progress (WIP).',
      '2. The Work Loop runs: while (workInProgress !== null && !shouldYield()) { workInProgress = performUnitOfWork(workInProgress); }.',
      '3. React processes one Fiber at a time, checking browser frame budget (via MessageChannel/scheduler).',
      '4. If 5ms elapse and a native input event arrives, shouldYield() returns true: React pauses, yields to browser paint, and resumes later.',
      '5. Once WIP tree completes, React swaps the trees: current = workInProgress (Double Buffering).'
    ].join('\n'),
    whenToUse: 'Powers all React 16+ features automatically.',
    whenNotToUse: 'Fiber is internal to React; developers never manipulate Fiber nodes directly.',
    commonMistakes: [
      '- Confusing a Fiber node with a React Element (React Elements are transient plain objects created by JSX; Fibers are persistent stateful nodes that live across renders).'
    ].join('\n'),
    perfA11y: 'Fiber scheduling guarantees that high-priority keystrokes and focus events are processed within 16ms, eliminating input lag.',
    realWorld: 'Concurrent features like `useTransition` and `useDeferredValue` rely directly on Fiber priority lanes (SyncLane vs TransitionLane).',
    interviewQs: [
      '**Q: What is a Fiber in React, and how does the Fiber work loop allow time-slicing?**',
      '*Spoken Answer*: "A Fiber is a plain JavaScript object representing a unit of work and a node in the component tree. In the legacy stack reconciler, recursion could not be stopped once started because it lived on the JavaScript execution call stack. Fiber re-implemented the call stack as a heap-allocated linked list with child, sibling, and return pointers. The Fiber work loop processes one node at a time in a loop. Before processing the next node, it checks if the browser has frame time remaining. If the frame budget is exceeded or an urgent user event occurs, React yields control to the browser, resuming the work loop on the next tick without losing progress."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects understand Double Buffering in Fiber (Current vs Work-in-Progress), which mirrors graphics rendering techniques to guarantee that unfinished renders are never visible on screen.',
    revisionSummary: [
      '- Fiber replaced the recursive stack reconciler with a linked list.',
      '- Fibers have `child`, `sibling`, and `return` (parent) pointers.',
      '- Work loop can pause, yield to browser, and resume (Time-Slicing).'
    ].join('\n')
  })
];

module.exports = {
  parts: [
    { id: 8, title: 'Part 8 — Context API & State Architecture', sections: p8_sections },
    { id: 9, title: 'Part 9 — Reducers & Complex State with useReducer', sections: p9_sections },
    { id: 10, title: 'Part 10 — Refs & Imperative DOM Operations', sections: p10_sections },
    { id: 11, title: 'Part 11 — Rendering Engine, Fiber & Reconciliation', sections: p11_sections }
  ]
};
