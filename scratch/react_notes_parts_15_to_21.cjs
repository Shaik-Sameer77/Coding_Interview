// scratch/react_notes_parts_15_to_21.cjs
// Parts 15 to 21: React+TS, Testing from Zero, Redux Toolkit, Zustand, React Router, MUI, Server State & Projects

module.exports = [
  {
    id: 15,
    title: "Part 15 — React with TypeScript & Strict Typing Contracts",
    badge: "TypeScript + React",
    color: "#3b82f6",
    sections: [
      {
        id: "15.1",
        title: "36. Typing Component Props, Children & ReactNode vs ReactElement",
        content: `### 1. Topic Overview & Mental Model
TypeScript provides static type analysis for React components, eliminating prop typos, missing parameters, and runtime undefined errors before code reaches the browser.

### 2. ReactNode vs ReactElement vs JSX.Element
- **\`ReactElement\`**: Represents a pure virtual DOM object created by \`React.createElement\` or JSX: \`{ type, props, key }\`. It cannot be a primitive like a string or number.
- **\`ReactNode\`**: Represents anything that React can legally render (ReactElement, string, number, boolean, null, undefined, or array of ReactNodes). **Always use \`ReactNode\` for typing the \`children\` prop!**`,
        code: `import React, { ReactNode, ComponentPropsWithoutRef } from 'react';

// 1. Reusable typed button extending native HTML button attributes:
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode; // Standard for children
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {isLoading ? <span className="spinner" /> : children}
    </button>
  );
}`,
        comparisonTable: [
          { aspect: "ReactNode", detail: "Union of ReactElement, string, number, boolean, null, undefined. Best for typing children." },
          { aspect: "ReactElement", detail: "Strict object representing an instantiated JSX element; cannot be raw string/number." }
        ],
        keyTakeaways: [
          "Use ReactNode to type the children prop and arbitrary renderable content.",
          "Extend ComponentPropsWithoutRef<'element'> to inherit all native HTML attributes with full type safety.",
          "Use discriminated unions for mutually exclusive component props."
        ]
      },
      {
        id: "15.2",
        title: "37. Typing Hooks: useState, useRef, useReducer & Event Types",
        content: `### 1. Explicit Generics vs Type Inference in Hooks
- **\`useState\`**: TS infers primitives automatically (\`useState(0)\` -> \`number\`). For union or nullable states, pass explicit generic types: \`useState<User | null>(null)\`.
- **\`useRef\`**:
  - DOM Ref: Pass initial value \`null\` with element type: \`useRef<HTMLInputElement>(null)\`. Produces \`RefObject<HTMLInputElement>\` with read-only \`.current\`.
  - Mutable Ref: Pass non-null or typed initial: \`useRef<number>(0)\`. Produces \`MutableRefObject<number>\`.

### 2. Common React SyntheticEvent Types
- Input change: \`React.ChangeEvent<HTMLInputElement>\`
- Form submit: \`React.FormEvent<HTMLFormElement>\`
- Mouse click: \`React.MouseEvent<HTMLButtonElement>\`
- Keyboard press: \`React.KeyboardEvent<HTMLInputElement>\``,
        code: `import { useState, useRef, useReducer, ChangeEvent, FormEvent } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function UserRegistration() {
  // Explicit generic for nullable state:
  const [user, setUser] = useState<User | null>(null);

  // DOM ref strictly typed to HTMLInputElement:
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Strongly typed synthetic event handlers:
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("Current input value:", e.target.value);
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nameInputRef.current) {
      setUser({
        id: crypto.randomUUID(),
        name: nameInputRef.current.value,
        email: "user@enterprise.com"
      });
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input ref={nameInputRef} onChange={handleInputChange} placeholder="Name" />
      <button type="submit">Save</button>
    </form>
  );
}`,
        keyTakeaways: [
          "Always provide explicit generics when state can be null: useState<T | null>(null).",
          "Type DOM refs as useRef<HTMLSpecificElement>(null) for correct autocomplete and property safety.",
          "Leverage React.ChangeEvent<HTMLInputElement> for type-safe event target handling."
        ]
      },
      {
        id: "15.3",
        title: "38. Generic Components & Discriminated Unions for UI States",
        content: `### 1. Generic Table / List Component
Create reusable components that accept arbitrary data arrays (\`T[]\`) while preserving complete type safety across columns and render functions.

### 2. Discriminated Union Async State Pattern
Model network states as discriminated unions with a common \`status\` property, preventing impossible states and guaranteeing exhaustive narrowing in TypeScript.`,
        code: `import React from 'react';

// 1. Discriminated Union Async State:
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

// 2. Generic Reusable Table Component:
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string;
}

export function GenericTable<T>({ data, columns, rowKey }: GenericTableProps<T>) {
  return (
    <table className="enterprise-table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={rowKey(item)}>
            {columns.map((col, idx) => (
              <td key={idx}>
                {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key as string] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
        keyTakeaways: [
          "Generic components (GenericTable<T>) allow building completely type-safe reusable design systems.",
          "Discriminated unions ensure TypeScript forces you to handle loading, error, and success states exhaustively.",
          "Avoid 'any' in component contracts; use generics and unknown with type guards."
        ]
      }
    ]
  },
  {
    id: 16,
    title: "Part 16 — React Testing from Absolute Zero",
    badge: "Testing Master",
    color: "#10b981",
    sections: [
      {
        id: "16.1",
        title: "39. Testing Foundations: The Testing Pyramid & RTL Philosophy",
        content: `### 1. What is Software Testing?
Automated testing is writing code that executes your application code, simulates user interactions, and verifies that the output matches expected behavior.

### 2. The React Testing Library (RTL) Philosophy
**"The more your tests resemble the way your software is used, the more confidence they can give you."** — Kent C. Dodds
- **Legacy Testing (Enzyme)**: Tested internal implementation details (component state variables, private method calls, shallow rendering). When code was refactored without changing UI behavior, tests broke (false positives).
- **Modern Testing (RTL)**: Tests visible DOM behavior from the perspective of an end-user and assistive technology (screen readers). You find elements by accessible roles and text, click buttons, and assert displayed content.

### 3. The React Testing Ecosystem
- **Vitest**: The modern, ultra-fast test runner native to Vite. Executes test suites, handles assertion matching, and provides mock utilities (\`vi.fn()\`, \`vi.spyOn()\`).
- **React Testing Library (\`@testing-library/react\`)**: Mounts components into a virtual browser environment and queries the DOM.
- **\`@testing-library/user-event\`**: Simulates realistic browser interactions (full event sequence: mouseover, mousedown, focus, mouseup, click).
- **\`@testing-library/jest-dom\`**: Provides rich custom DOM matchers (\`toBeInTheDocument()\`, \`toBeDisabled()\`, \`toHaveTextContent()\`).
- **MSW (Mock Service Worker)**: Intercepts network HTTP calls at the network boundary, returning controlled mock responses without hacking \`fetch\` or \`axios\`.`,
        code: `// First Minimal Component & Its Complete Production Test:

// src/components/Counter.jsx
import { useState } from 'react';

export function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <p aria-live="polite">Current Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// src/components/Counter.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('renders with initial count and increments when clicked', async () => {
    // 1. Set up realistic user event handler
    const user = userEvent.setup();

    // 2. Render the component in the virtual test DOM
    render(<Counter initialCount={5} />);

    // 3. Find elements using accessible queries
    const countDisplay = screen.getByText(/current count: 5/i);
    const incrementButton = screen.getByRole('button', { name: /increment/i });

    // 4. Assert initial state
    expect(countDisplay).toBeInTheDocument();

    // 5. Simulate real user click
    await user.click(incrementButton);

    // 6. Assert updated DOM state
    expect(screen.getByText(/current count: 6/i)).toBeInTheDocument();
  });
});`,
        keyTakeaways: [
          "React Testing Library enforces testing observable behavior rather than internal implementation details.",
          "Vitest is the test runner; RTL is the component mounter; user-event simulates realistic interactions.",
          "Tests that mimic actual end-user actions remain resilient to internal code refactors."
        ]
      },
      {
        id: "16.2",
        title: "40. RTL Query Hierarchy: getBy vs queryBy vs findBy",
        content: `### 1. The Query Matrix: Behavior and Return Types
| Query Prefix | 0 Matches | 1 Match | Multiple Matches | Async Wait? | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **\`getBy...\`** | Throws Error | Returns Element | Throws Error | No (Instant) | Default assertion that an element is immediately visible |
| **\`queryBy...\`** | Returns \`null\` | Returns Element | Throws Error | No (Instant) | Asserting that an element is **NOT** present in the DOM |
| **\`findBy...\`** | Throws (timeout) | Returns Element | Throws Error | Yes (Retries 1000ms) | Waiting for elements that appear after async fetch/state |

### 2. The Recommended Query Priority Hierarchy
Always prefer queries that reflect accessibility and user perception:
1. **\`getByRole\`**: The gold standard (\`button\`, \`heading\`, \`textbox\`, \`dialog\`, \`alert\`).
2. **\`getByLabelText\`**: Best for form inputs with linked \`<label>\` tags.
3. **\`getByPlaceholderText\`**: Fallback when no label exists.
4. **\`getByText\`**: Good for static text and paragraphs.
5. **\`getByTestId\`**: Last resort escape hatch (\`data-testid="custom-widget"\`) when no accessible role exists.`,
        code: `import { render, screen, waitFor } from '@testing-library/react';

test('Demonstrating getBy vs queryBy vs findBy', async () => {
  render(<UserProfile status="loading" />);

  // 1. getByRole: Throws if button does not exist immediately!
  expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();

  // 2. queryByRole: Safe check that something is NOT in the DOM!
  // (getByRole would throw an error and fail the test immediately)
  expect(screen.queryByRole('button', { name: /logout/i })).toBeNull();

  // 3. findByRole: Asynchronously polls DOM until element appears (or times out)
  // Essential for elements rendered after a fetch or transition:
  const loadedUser = await screen.findByText(/alex developer/i);
  expect(loadedUser).toBeInTheDocument();
});`,
        keyTakeaways: [
          "Use getBy... as your default immediate assertion.",
          "Use queryBy... ONLY to assert that an element is absent from the DOM (expect(...).toBeNull()).",
          "Use findBy... (with await) when waiting for async data, animations, or delayed state updates."
        ]
      },
      {
        id: "16.3",
        title: "41. Testing Async Data Fetching & MSW Integration",
        content: `### 1. Why Mock Service Worker (MSW) Wins Over vi.spyOn(fetch)
- Mocking \`global.fetch\` directly is brittle: it requires knowing the exact URL structure, status codes, and headers inside your test code.
- **MSW** intercepts HTTP requests at the network layer using Service Workers (in browser) or interceptors (in Node/Vitest). Your component runs its normal \`fetch()\` code unchanged!

### 2. Step-by-Step Production API Testing Pattern
1. Configure MSW handlers for \`GET /api/users\`.
2. Render the component.
3. Verify loading spinner is immediately shown.
4. Await \`findByRole\` to confirm data list renders.
5. Override handler with server error (500) and verify error message display.`,
        code: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { UserList } from './UserList';

// 1. Define network mock handlers
const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice Enterprise' },
      { id: '2', name: 'Bob Architect' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserList Async Component', () => {
  it('displays loading state and then renders fetched users', async () => {
    render(<UserList />);

    // Immediate check: Loading state visible
    expect(screen.getByText(/loading team members/i)).toBeInTheDocument();

    // Async check: Wait for users to appear in DOM
    const userItem = await screen.findByText(/alice enterprise/i);
    expect(userItem).toBeInTheDocument();
    expect(screen.getByText(/bob architect/i)).toBeInTheDocument();
  });

  it('displays error alert when network call fails', async () => {
    // Override handler for this test only:
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserList />);

    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent(/failed to load users/i);
  });
});`,
        keyTakeaways: [
          "MSW intercepts HTTP calls at the network level, providing the most realistic testing environment.",
          "Always test the 4 critical async states: Loading, Success with Data, Empty State, and Server Error.",
          "Never write arbitrary sleep(2000) timers; always use findBy... or waitFor()."
        ]
      },
      {
        id: "16.4",
        title: "42. Testing Custom Hooks with renderHook",
        content: `### 1. The Purpose of \`renderHook\`
Hooks cannot be called outside of a React component. \`renderHook\` creates an internal test component harness that invokes your hook, providing access to \`result.current\` and an \`act()\` utility for testing state updates.`,
        code: `import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Custom Hook', () => {
  it('initializes with default value and handles increments and resets', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);

    // State mutations must be wrapped in act()
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(11);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});`,
        keyTakeaways: [
          "Use renderHook to test complex custom hooks in isolation without writing custom test components.",
          "Wrap state-triggering hook actions inside act(() => { ... }).",
          "If a hook is simple and tightly coupled to a single component, test the component instead."
        ]
      }
    ]
  },
  {
    id: 17,
    title: "Part 17 — React + Redux Toolkit (RTK) Complete Module",
    badge: "Redux Toolkit",
    color: "#6366f1",
    sections: [
      {
        id: "17.1",
        title: "43. Modern Redux Toolkit: Slices, Immer & Store Setup",
        content: `### 1. Why Redux Toolkit (RTK) Replaced Legacy Redux
Legacy Redux required hundreds of lines of boilerplate: manual action type constants (\`ADD_TODO\`), action creators, switch-case reducers, and immutable object spread operations.
**Redux Toolkit (RTK)** is the official, opinionated, modern standard that eliminates boilerplate through:
- \`configureStore()\`: Pre-configures Redux DevTools, redux-thunk, and immutability checks.
- \`createSlice()\`: Automatically generates action creators and action types from reducer methods.
- **Immer Integration**: Allows you to write mutable-looking code (\`state.items.push(item)\`) safely because Immer tracks mutations on a Proxy draft and produces immutable updates under the hood.`,
        code: `import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 1. Define slice with Immer mutations
interface CartItem { id: string; name: string; price: number; qty: number; }
interface CartState { items: CartItem[]; }

const initialState: CartState = { items: [] };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty; // Safe mutation via Immer!
      } else {
        state.items.push(action.payload); // Safe push via Immer!
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

// 2. Configure Store
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer
  }
});

// 3. Typed Hooks for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`,
        keyTakeaways: [
          "Redux Toolkit eliminates 80% of legacy Redux boilerplate via createSlice and configureStore.",
          "Inside createSlice reducers, draft mutations (state.push) are safe because Immer handles immutability.",
          "Always create and export typed hooks (useAppDispatch, useAppSelector) for strict TypeScript safety."
        ]
      },
      {
        id: "17.2",
        title: "44. Async Thunks, RTK Query & Caching Mechanics",
        content: `### 1. createAsyncThunk for Complex Orchestration
Handles asynchronous workflows (API calls) by automatically dispatching \`pending\`, \`fulfilled\`, and \`rejected\` action lifecycle states handled in \`extraReducers\`.

### 2. RTK Query: Purpose-Built Server-State Management
For standard CRUD data fetching, caching, polling, and invalidation, **RTK Query** eliminates the need for manual thunks and reducer state handling.`,
        code: `import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async Thunk definition
export const fetchUserInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(\`/api/billing/\${userId}/invoices\`);
      if (!res.ok) throw new Error('Failed to fetch invoices');
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Handling lifecycle in extraReducers:
const billingSlice = createSlice({
  name: 'billing',
  initialState: { invoices: [], status: 'idle', error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInvoices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices = action.payload;
      })
      .addCase(fetchUserInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});`,
        keyTakeaways: [
          "createAsyncThunk generates pending/fulfilled/rejected action types automatically.",
          "RTK Query provides automatic request caching, deduplication, and cache tag invalidation.",
          "Use RTK Query for server state and standard slices for client-only state."
        ]
      }
    ]
  },
  {
    id: 18,
    title: "Part 18 — React + Zustand State Management",
    badge: "Zustand",
    color: "#eab308",
    sections: [
      {
        id: "18.1",
        title: "45. Zustand Architecture: Minimalist Stores & Atomic Selectors",
        content: `### 1. What is Zustand and Why is it Popular?
Zustand is a lightweight (1kB), un-opinionated state management library based on the simplified flux principles.
**Key Architectural Advantages over Redux & Context**:
1. **Zero Context Providers**: No wrapping your component tree in \`<Provider>\`; stores are declared outside React at module scope.
2. **Atomic Selectors**: Components subscribe only to the specific slice of state they select (\`useStore(state => state.activeId)\`). They NEVER re-render if unselected properties change!
3. **No Boilerplate**: Actions are defined directly inside the store object as standard functions.`,
        code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Task { id: string; title: string; completed: boolean; }

interface TaskStore {
  tasks: Task[];
  filter: 'all' | 'pending' | 'completed';
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (f: 'all' | 'pending' | 'completed') => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        filter: 'all',
        addTask: (title) => set(
          state => ({ tasks: [...state.tasks, { id: crypto.randomUUID(), title, completed: false }] }),
          false,
          'tasks/addTask'
        ),
        toggleTask: (id) => set(
          state => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
          }),
          false,
          'tasks/toggleTask'
        ),
        setFilter: (filter) => set({ filter }, false, 'tasks/setFilter')
      }),
      { name: 'chrona_tasks_storage' } // Automatic LocalStorage persistence!
    )
  )
);

// In Component: Atomic Selector (Only re-renders when task count changes!)
function TaskCounter() {
  const taskCount = useTaskStore(state => state.tasks.length);
  return <div>Total Tasks: {taskCount}</div>;
}`,
        comparisonTable: [
          { aspect: "Zustand", detail: "1kB bundle; no Providers; atomic selector subscriptions; built-in persist and devtools middleware." },
          { aspect: "Redux Toolkit", detail: "Structured enterprise conventions; strict action serialization; best for massive multidisciplinary teams." },
          { aspect: "React Context", detail: "Built-in; fine for low-frequency global settings; causes re-render cascades on high-frequency state." }
        ],
        keyTakeaways: [
          "Zustand stores live outside React components and require zero Provider wrappers.",
          "Atomic selector subscriptions prevent unnecessary component re-renders completely.",
          "Built-in persist middleware saves and rehydrates state from localStorage with one line of configuration."
        ]
      }
    ]
  },
  {
    id: 19,
    title: "Part 19 — React Router (v6/v7) & Navigation Architecture",
    badge: "Routing",
    color: "#ec4899",
    sections: [
      {
        id: "19.1",
        title: "46. SPA Navigation, Nested Routes & Outlets",
        content: `### 1. How Client-Side Routing Works
In traditional MPAs, clicking a link triggers an HTTP request to the web server, returning a fresh HTML page and causing a full-page reload.
In SPAs with React Router, clicking a \`<Link>\` intercepts the click, uses the browser's **History API** (\`history.pushState()\`) to update the URL without reloading, and re-renders only the matched route component.

### 2. Nested Routes & Layouts with <Outlet />
Nested routes allow child pages (e.g. \`/dashboard/analytics\`, \`/dashboard/billing\`) to share a persistent parent layout (Sidebar, Navbar) without remounting the layout on navigation.`,
        code: `import { BrowserRouter, Routes, Route, Link, Outlet, useParams, Navigate } from 'react-router-dom';

// 1. Shared Layout Shell
function DashboardLayout() {
  return (
    <div className="dashboard-grid">
      <aside className="sidebar">
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/team">Team</Link>
      </aside>
      <main className="content">
        <Outlet /> {/* Child routes render right here! */}
      </main>
    </div>
  );
}

// 2. Protected Route Guard
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 3. Router Configuration
export function AppRouter({ isAuthenticated }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Nested Dashboard with Protection */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="team/:memberId" element={<MemberDetail />} />
        </Route>
        
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        keyTakeaways: [
          "React Router uses the HTML5 History API (pushState) for seamless client-side page transitions.",
          "<Outlet /> renders child route elements inside shared parent layouts without remounting.",
          "Client-side protected routes improve UX, but backend APIs must always perform authoritative token validation."
        ]
      }
    ]
  },
  {
    id: 20,
    title: "Part 20 — Material UI (MUI) & UI Component Libraries",
    badge: "UI Libraries",
    color: "#06b6d4",
    sections: [
      {
        id: "20.1",
        title: "47. MUI System: ThemeProvider, sx Prop & Layout Components",
        content: `### 1. Material UI (MUI) Design Architecture
MUI (formerly Material-UI) is one of the world's most widely adopted enterprise React component libraries, adhering to Google's Material Design system.
**Core Concepts**:
- \`ThemeProvider\` & \`createTheme()\`: Centralized design tokens (color palettes, typography scales, spacing units, breakpoints).
- \`CssBaseline\`: Normalizes browser default CSS styles across Chrome, Firefox, Safari.
- **The \`sx\` Prop**: Supercharged inline styling with direct access to theme tokens (\`sx={{ p: 2, bgcolor: 'primary.main', display: { xs: 'none', md: 'block' } }}\`).
- **Layout Primitives**: \`Box\` (div replacement), \`Stack\` (flexbox column/row), \`Grid\` (12-column responsive layout).`,
        code: `import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box, Stack, Typography, Button, TextField } from '@mui/material';

// 1. Customized Design Tokens
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#61dafb' },
    background: { default: '#0b0f19', paper: '#111827' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h5: { fontWeight: 800 }
  }
});

// 2. Production MUI Form Card
export function MuiLoginCard({ onLogin }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 24
      }}>
        <Stack spacing={3}>
          <Typography variant="h5" color="primary">Enterprise Login</Typography>
          <TextField label="Work Email" variant="outlined" fullWidth />
          <TextField label="Password" type="password" variant="outlined" fullWidth />
          <Button variant="contained" size="large" fullWidth onClick={onLogin}>
            Sign In
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}`,
        comparisonTable: [
          { aspect: "MUI (Material UI)", detail: "Batteries-included enterprise components, strong theming, higher initial bundle size." },
          { aspect: "shadcn/ui & Radix UI", detail: "Copy-paste headless unstyled primitives styled with Tailwind CSS; zero bundle lock-in." },
          { aspect: "Tailwind CSS", detail: "Utility-first CSS framework; no pre-built JavaScript components." }
        ],
        keyTakeaways: [
          "MUI provides enterprise-grade accessible components out of the box.",
          "Use the sx prop for theme-aware responsive styles instead of hardcoded CSS rules.",
          "Always test MUI components using accessible roles (e.g., getByRole('button')) rather than private class names."
        ]
      }
    ]
  },
  {
    id: 21,
    title: "Part 21 — Server State & 13 Real-World Projects",
    badge: "Production Projects",
    color: "#8b5cf6",
    sections: [
      {
        id: "21.1",
        title: "48. Server State: TanStack Query vs Client Global State",
        content: `### 1. The Fundamental Distinction: Client State vs Server State
- **Client State**: Data owned exclusively by the browser session (theme, modal visibility, active tab, form draft). Synchronous and fully under client control.
- **Server State**: Data persisted remotely in a database (user profile, invoices, student bookings). Asynchronous, shared across multiple users, and potentially stale the moment it is fetched.

### 2. TanStack Query (React Query)
TanStack Query manages server state automatically:
- Caching & deduplication: Multiple components requesting \`/api/user\` generate only ONE network request.
- Background refetching on window focus: Data is automatically refreshed when the user returns to the browser tab.
- Stale-While-Revalidate: Instant UI render from cache while fetching fresh data in the background.`,
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch query with automatic caching & refetching:
function UserProfile({ userId }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: (newBio) => fetch(\`/api/users/\${userId}\`, { method: 'PATCH', body: JSON.stringify({ bio: newBio }) }),
    onSuccess: () => {
      // Invalidate cache: Triggers automatic background refetch!
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    }
  });

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Failed to load profile.</div>;

  return <div><h3>{user.name}</h3><p>{user.bio}</p></div>;
}`,
        keyTakeaways: [
          "Do not store server API data in Redux or useState; use TanStack Query or SWR.",
          "staleTime determines when fresh data becomes stale; gcTime controls when unused cache is garbage collected.",
          "Mutations invalidate cache queries, automatically triggering seamless UI updates."
        ]
      },
      {
        id: "21.2",
        title: "49. 13 Progressive Enterprise Project Architectures",
        content: `### 1. Curriculum Project Roadmap
The learning platform provides 13 progressive project specifications from absolute beginner to senior production grade:

1. **Interactive Profile & Counter**: Component fundamentals, props, and \`useState\` immutability.
2. **Validated Registration Form**: Multi-field validation, touched tracking, and accessible field error messaging.
3. **Searchable & Paginated Data List**: Client-side filtering, debounced input, and pagination calculations.
4. **Reusable Component Library**: Button, Modal, Dropdown, and Input primitives with composable tokens.
5. **React + TypeScript Task Manager**: Strict type safety, discriminated union filters, and typed LocalStorage persistence.
6. **Redux Toolkit Shopping Cart**: \`createSlice\`, \`configureStore\`, typed thunks, and quantity adjustments.
7. **Zustand Cart with Persistence**: Lightweight module store, atomic selectors, and automatic local storage persistence.
8. **React Router Multi-Tier Dashboard**: Nested \`<Outlet />\` layouts, dynamic parameters, and protected auth guards.
9. **MUI Admin Operations Dashboard**: Theming, responsive Grid, Dialog confirmations, and Data Grid tables.
10. **Full CRUD App with TanStack Query**: Server-state caching, background revalidation, and optimistic UI mutations.
11. **RBAC Enterprise Portal**: Role-based access control, JWT refresh interceptors, and breadcrumbs.
12. **Fully Tested Production Feature**: 100% behavior coverage using Vitest, RTL, UserEvent, and MSW network mocking.
13. **Full-Stack SaaS Application (Chrona / LesHub)**: Complete end-to-end architecture unifying React 19, TypeScript, TanStack Query, Zustand, React Router, MUI, accessibility, and Vitest test suites.`,
        keyTakeaways: [
          "Follow the 13-project progression to build senior full-stack mastery.",
          "Real-world enterprise applications separate server state (TanStack Query) from client UI state (Zustand).",
          "Every production feature must be validated by automated Vitest and React Testing Library suites."
        ]
      }
    ]
  }
];
