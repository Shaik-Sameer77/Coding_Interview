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
// PART 3: Components & Composition
// ==========================================
const p3_sections = [
  createSection('3.1', '12. Function Components, Responsibilities & Naming Conventions', 1, {
    whatItIs: 'Function components are plain JavaScript functions that accept an optional props object as an argument and return React elements (JSX). They represent the canonical, modern building blocks of all React applications.',
    whyItExists: 'In early React (v0.14 - v16.7), class components were required for state and lifecycle methods. Classes introduced boilerplate (constructor, this.state, manual method binding) and complex inheritance hierarchies. Function components with hooks simplified code reuse and mental models.',
    problemSolved: 'Eliminates this context binding errors, reduces bundle size, and allows seamless composition through custom hooks.',
    prerequisites: 'JavaScript functions, ES6 destructuring, default parameters, and PascalCase naming rules.',
    syntax: [
      '// Standard Function Component Declaration:',
      'function UserProfile({ user, onEdit }) {',
      '  return <div>{user.name}</div>;',
      '}',
      '',
      '// Arrow Function Syntax:',
      'const UserProfile = ({ user, onEdit }) => (',
      '  <div>{user.name}</div>',
      ');'
    ].join('\n'),
    minimalExample: `
import React from 'react';

// PascalCase naming is mandatory for React components!
export function MetricCard({ label, value, trend, isPositive = true }) {
  return (
    <div className="metric-card" style={{ padding: '1rem', border: '1px solid #334155' }}>
      <span className="metric-label">{label}</span>
      <h4 className="metric-value">{value}</h4>
      <span style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
        {isPositive ? '▲' : '▼'} {trend}% vs last month
      </span>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: Component function declared with PascalCase (MetricCard). Destructures props with a default fallback (isPositive = true).',
      '- Line 5-12: Returns JSX representing the card view. It is pure: given the same props, it produces the identical JSX tree.'
    ].join('\n'),
    internalFlow: [
      '1. When JSX contains <MetricCard />, React identifies the type as a function reference (not a string like "div").',
      '2. React initializes a FunctionComponent Fiber node.',
      '3. During the render work loop, React invokes MetricCard(props, ref).',
      '4. The returned JSX element is processed into child Fiber nodes.',
      '5. If the component uses hooks, the active Fiber\'s memoizedState linked list tracks their values in sequential order.'
    ].join('\n'),
    whenToUse: 'For 100% of new React UI components.',
    whenNotToUse: 'Legacy class components are only required for Error Boundaries (componentDidCatch / getDerivedStateFromError) until React provides a native hook equivalent.',
    commonMistakes: [
      '- Using camelCase naming: function userCard() { ... }. React treats lowercase tags as native HTML DOM elements, attempting to render a non-existent <usercard> tag!',
      '- Defining components inside another component function. This recreates the entire component definition on every render, wiping all child state and focus!'
    ].join('\n'),
    perfA11y: 'Function components have lower memory overhead than classes because there are no class instances (new Component()) allocated on the heap.',
    realWorld: 'Enterprise UI systems build atomic component libraries where pure functional cards, badges, and headers compose larger pages.',
    interviewQs: [
      '**Q: Why must React component names start with a capital letter (PascalCase)?**',
      '*Spoken Answer*: "React\'s JSX compiler uses the first letter of a tag to determine how to transpile it. If the tag starts with a lowercase letter (e.g. <button> or <card>), the compiler treats it as a built-in HTML tag and passes a string to the JSX runtime: _jsx(\'card\', props). If it starts with a capital letter (e.g. <Card />), the compiler treats it as a JavaScript identifier in scope and passes the function reference: _jsx(Card, props)."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers enforce the Single Responsibility Principle: if a component exceeds 150 lines or manages more than 3 distinct UI sub-tasks, it must be decomposed into focused sub-components.',
    revisionSummary: [
      '- Function components are pure functions returning JSX.',
      '- MUST use PascalCase naming (<UserProfile />).',
      '- NEVER define a component inside another component body.'
    ].join('\n')
  }),

  createSection('3.2', '13. Props Architecture, Immutability & Default Values', 2, {
    whatItIs: 'Props (short for properties) are read-only inputs passed from a parent component to a child component, driving the unidirectional data flow of a React application.',
    whyItExists: 'To keep components deterministic, testable, and reusable. Like parameters to a mathematical function, props configure how a component renders without allowing the component to modify parent data directly.',
    problemSolved: 'Prevents multi-directional state corruption where a child unexpectedly mutates data owned by a parent or sibling.',
    prerequisites: 'ES6 object destructuring, default parameters, and reference types (Stack vs Heap).',
    syntax: [
      '// Parent passing props:',
      '<Button variant="primary" size="large" onClick={handleClick}>Submit</Button>',
      '',
      '// Child receiving and destructuring props with defaults:',
      'function Button({ variant = "secondary", size = "medium", children, ...rest }) {',
      '  return <button className={`btn btn-${variant} btn-${size}`} {...rest}>{children}</button>;',
      '}'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export function Badge({ 
  label, 
  variant = 'info', 
  isOutlined = false, 
  onClick 
}) {
  const colorStyles = {
    info: { bg: '#0284c7', text: '#ffffff' },
    success: { bg: '#16a34a', text: '#ffffff' },
    warning: { bg: '#d97706', text: '#ffffff' }
  };

  const currentTheme = colorStyles[variant] || colorStyles.info;

  return (
    <span 
      onClick={onClick}
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: isOutlined ? 'transparent' : currentTheme.bg,
        color: isOutlined ? currentTheme.bg : currentTheme.text,
        border: \`1px solid \${currentTheme.bg}\`,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {label}
    </span>
  );
}
`,
    lineByLine: [
      '- Line 3-8: Props are destructured directly in parameter list with default values (variant = "info", isOutlined = false).',
      '- Line 10: Strict reminder that props are strictly immutable.',
      '- Line 18-35: Pure declarative projection of the passed props into inline styles.'
    ].join('\n'),
    internalFlow: [
      '1. When <Badge label="Active" /> is compiled, React creates an object: { label: "Active", key: null }.',
      '2. In development mode, React wraps props with Object.freeze(props).',
      '3. If code attempts to mutate props.label = "Inactive", JavaScript throws TypeError.',
      '4. During reconciliation, React checks if prevProps !== nextProps (shallow equality) to determine if re-renders can be skipped in memoized components.'
    ].join('\n'),
    whenToUse: 'For all configuration and callbacks passed down the component tree.',
    whenNotToUse: 'Do not use props to pass state down 8 levels through intermediary components that do not care about the data (Prop Drilling); use Context or state management instead.',
    commonMistakes: [
      '- Direct prop mutation: props.items.push(newItem) mutates the parent array in heap memory, bypassing reconciliation and causing silent bugs!',
      '- Copying props into local state without justification (const [val, setVal] = useState(props.val)), causing the child to ignore future prop updates.'
    ].join('\n'),
    perfA11y: 'Avoid passing freshly instantiated inline objects or functions as props to memoized children (React.memo), as new references break shallow equality checks on every parent render.',
    realWorld: 'Design system components (e.g. Buttons, Modals, Inputs) accept structured props conforming to strict TypeScript interfaces.',
    interviewQs: [
      '**Q: Why are props in React strictly immutable?**',
      '*Spoken Answer*: "Props are strictly immutable to uphold pure functions and predictable unidirectional data flow. If child components could mutate their incoming props, they would alter the parent\'s state in memory without triggering the parent\'s reconciliation cycle. This would break state synchronization across sibling components and make debugging unpredictable. If a child needs to alter data, the parent must pass down an updater callback function."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers prefer ES6 default parameter values over legacy defaultProps, as defaultProps on function components will eventually be deprecated in future React releases.',
    revisionSummary: [
      '- Props flow down (Unidirectional data flow).',
      '- Props are read-only: Never mutate props.',
      '- Use ES6 default parameters for fallback values.'
    ].join('\n')
  }),

  createSection('3.3', '14. Children & Component Composition vs Inheritance', 3, {
    whatItIs: 'Component composition is the architectural pattern of assembling complex UI by combining smaller, self-contained components using the children prop and named slots, rather than class-based inheritance.',
    whyItExists: 'In object-oriented UI frameworks, developers attempted to share UI logic by subclassing components (SpecialModal extends BaseModal). This led to rigid, brittle class hierarchies that broke when requirements diverged. React favors composition: Containment and Specialization.',
    problemSolved: 'Solves the fragile base-class problem and allows parent components to inject arbitrary content into reusable shells.',
    prerequisites: 'React elements, props, and the children special prop.',
    syntax: [
      '// Containment via children:',
      'function Card({ children }) {',
      '  return <div className="card-shell">{children}</div>;',
      '}',
      '',
      '// Specialization via Composition:',
      'function WelcomeDialog() {',
      '  return (',
      '    <Dialog title="Welcome" footer={<button>OK</button>}>',
      '      <p>Thank you for exploring the React Master suite!</p>',
      '    </Dialog>',
      '  );',
      '}'
    ].join('\n'),
    minimalExample: `
import React from 'react';

// Shell Component: Generic Container with Slots
export function SplitPane({ leftSlot, rightSlot, children }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      <aside style={{ flex: 1, borderRight: '1px solid #334155' }}>
        {leftSlot}
      </aside>
      <main style={{ flex: 2 }}>
        {children}
      </main>
      <aside style={{ flex: 1, borderLeft: '1px solid #334155' }}>
        {rightSlot}
      </aside>
    </div>
  );
}

// Consumer Composition:
export function DashboardLayout() {
  return (
    <SplitPane 
      leftSlot={<nav><p>Sidebar Navigation</p></nav>}
      rightSlot={<div><p>Audit Log Activity</p></div>}
    >
      <h2>Primary Dashboard Feed</h2>
      <p>Real-time analytics stream rendered via children prop.</p>
    </SplitPane>
  );
}
`,
    lineByLine: [
      '- Line 4: SplitPane accepts generic slots (leftSlot, rightSlot) and default children.',
      '- Line 7-14: Lays out the passed slots without knowing or caring what components will be injected into them.',
      '- Line 19-27: Consumer specializes the layout by passing specific elements as named props and nested children.'
    ].join('\n'),
    internalFlow: [
      '1. Nested elements inside <SplitPane>...</SplitPane> are compiled as the children property of the props object.',
      '2. If single child: props.children is a React Element.',
      '3. If multiple children: props.children is an array of React Elements.',
      '4. The parent passes the elements through directly. Fiber preserves their component identities and reconciliation cycles without intermediate wrapper re-renders.'
    ].join('\n'),
    whenToUse: 'Always when creating containers: Modals, Drawers, Cards, Tooltips, Layout Shells, and Grid Systems.',
    whenNotToUse: 'Do not use inheritance (class MyButton extends BaseButton); React does not support component inheritance and Meta has never found a use case requiring it.',
    commonMistakes: [
      '- Assuming children is always an array (it can be an object, string, or undefined).',
      '- Wrapping children in redundant <div> containers that break CSS Flex/Grid child layouts.'
    ].join('\n'),
    perfA11y: 'Component composition optimizes performance: when SplitPane re-renders due to internal state, its children (instantiated in DashboardLayout) do not re-render if their props did not change!',
    realWorld: 'Production layout libraries (MUI Container, Chakra Box) rely 100% on composition and slots to maintain flexible styling boundaries.',
    interviewQs: [
      '**Q: Why does React favor composition over inheritance?**',
      '*Spoken Answer*: "React favors composition because UI requirements evolve unpredictably. In class-based inheritance, creating specialized components creates tight coupling; changes to the base class risk breaking all subclasses. Composition uses the children prop and named slot props, allowing components to act as customizable shells. You can combine any content, icons, or action buttons inside a container without rigid class hierarchies."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects leverage composition as a primary performance optimization technique ("Moving State Down" and "Passing Content as Children") to prevent expensive component trees from re-rendering.',
    revisionSummary: [
      '- Composition > Inheritance (React does not use class inheritance).',
      '- The children prop enables containment.',
      '- Named props (e.g. icon={<Icon />}) enable multi-slot layouts.'
    ].join('\n')
  }),

  createSection('3.4', '15. Prop Drilling & Component Boundaries', 4, {
    whatItIs: 'Prop drilling occurs when data is passed down through multiple intermediate components that do not need the data themselves, purely to reach a deeply nested child.',
    whyItExists: 'In React’s unidirectional data flow, state must be lifted to the lowest common ancestor of all components that require it. As the tree deepens, passing props through intermediate layers becomes cumbersome.',
    problemSolved: 'Identifies when to keep props direct vs when to introduce Component Composition or React Context.',
    prerequisites: 'Unidirectional data flow, state lifting, and component hierarchies.',
    syntax: [
      '// Prop Drilling Symptom (3+ layers of pass-through):',
      '<App user={user}>',
      '  <Header user={user}>',
      '    <Nav user={user}>',
      '      <Avatar user={user} /> // Only Avatar actually uses "user"!',
      '    </Nav>',
      '  </Header>',
      '</App>',
      '',
      '// Solved via Component Composition:',
      '<Header nav={<Avatar user={user} />} />'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

function Header({ rightContent }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#0f172a' }}>
      <h1>LesHub Platform</h1>
      {rightContent}
    </header>
  );
}

function UserAvatar({ user }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <img src={user.avatarUrl} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
      <span>{user.name}</span>
    </div>
  );
}

export default function AppShell() {
  const [currentUser] = useState({ name: 'Alex Vance', avatarUrl: 'https://via.placeholder.com/32' });

  return (
    <div>
      <Header rightContent={<UserAvatar user={currentUser} />} />
    </div>
  );
}
`,
    lineByLine: [
      '- Line 3-10: Header component acts as a pure layout container, receiving rightContent slot.',
      '- Line 12-19: UserAvatar directly consumes the user prop.',
      '- Line 26: AppShell pairs UserAvatar with currentUser directly at the root, completely bypassing intermediate drilling!'
    ].join('\n'),
    internalFlow: [
      '1. In prop drilling, every intermediate component re-renders when the passed prop changes reference, even if the intermediate component renders no visual changes related to that data.',
      '2. By composing <UserAvatar user={user} /> as a prop element, the element reference is created in AppShell.',
      '3. Header simply renders {rightContent}. If Header re-renders due to its own local state, React sees rightContent reference is unchanged and skips re-rendering UserAvatar.'
    ].join('\n'),
    whenToUse: 'Passing props 1-2 levels deep is standard, healthy, and preferred because it makes data dependencies explicit and easily traceable in code.',
    whenNotToUse: 'Do not jump to global state (Redux/Zustand) or Context to eliminate 1 or 2 levels of props; that introduces unnecessary indirection.',
    commonMistakes: [
      '- Overusing Context as a reflex for mild prop drilling, which causes widespread re-renders when context values change.',
      '- Prop drilling callback handlers 5 levels deep instead of using compound components.'
    ].join('\n'),
    perfA11y: 'Eliminating intermediate prop drilling with composition isolates re-render boundaries, preventing large navigation trees from re-evaluating when a user profile updates.',
    realWorld: 'Production design shells (e.g. SaaS dashboards) use slot composition (leftSidebar, topNav, footer) to isolate page content from navigation chrome.',
    interviewQs: [
      '**Q: How can you eliminate prop drilling without using Context or Redux?**',
      '*Spoken Answer*: "You can eliminate prop drilling using Component Composition. Instead of passing raw data props through intermediate components that don\'t need them, you instantiate the leaf component at the top level and pass it down as a JSX element prop or via children. The intermediate components simply render the slot, remaining completely decoupled from the data contract."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers establish the Rule of 3: 1-2 levels of props is good engineering; 3+ levels triggers an evaluation: first try Component Composition; if that becomes unwieldy, introduce a targeted React Context.',
    revisionSummary: [
      '- 1-2 levels of props is normal and explicit.',
      '- 3+ levels is Prop Drilling.',
      '- Solve first with Component Composition (slots/children), then Context.'
    ].join('\n')
  }),

  createSection('3.5', '16. Presentational vs Container Patterns in Modern React', 5, {
    whatItIs: 'An architectural separation dividing components into Presentational ("Dumb") components concerned with how things look, and Container ("Smart") components concerned with how things work.',
    whyItExists: 'Popularized by Dan Abramov in early Redux architecture to separate DOM markup from Redux store subscriptions and asynchronous fetching logic.',
    problemSolved: 'Promotes reusable UI design systems and makes components easy to test with mock props.',
    prerequisites: 'Custom hooks, separation of concerns, and UI testing principles.',
    syntax: [
      '// Modern React Pattern:',
      '// 1. Custom Hook (The "Container" logic):',
      'function useUserList() { ... }',
      '',
      '// 2. Component (The "Presentational" view):',
      'function UserList() {',
      '  const { users, isLoading } = useUserList();',
      '  return <ul>...</ul>;',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

// 1. The Container Logic: Encapsulated in a Custom Hook
export function useAuditFeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs([
        { id: 1, action: 'User Login', timestamp: '12:04:10' },
        { id: 2, action: 'Password Reset', timestamp: '12:05:45' }
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { logs, loading };
}

// 2. The Presentational View: 100% focused on UI rendering
export function AuditFeedView({ logs, loading }) {
  if (loading) return <div>Loading audit records...</div>;
  return (
    <ul className="audit-feed">
      {logs.map(log => (
        <li key={log.id}>
          <strong>{log.action}</strong> at {log.timestamp}
        </li>
      ))}
    </ul>
  );
}

// Connected Module:
export default function AuditFeedContainer() {
  const { logs, loading } = useAuditFeed();
  return <AuditFeedView logs={logs} loading={loading} />;
}
`,
    lineByLine: [
      '- Line 4-20: useAuditFeed custom hook encapsulates state, async fetching, and cleanup.',
      '- Line 23-34: AuditFeedView is pure presentation. It has no network dependencies and can be tested trivially with mock arrays.',
      '- Line 37-40: Wires the container logic to the presentational view.'
    ].join('\n'),
    internalFlow: [
      '1. The custom hook executes state setters, registering effects and state transitions in the Fiber tree.',
      '2. When data arrives, the hook triggers a re-render.',
      '3. The presentational component receives updated props, running pure rendering logic without any direct coupling to network APIs.'
    ].join('\n'),
    whenToUse: 'When building complex, data-driven features where separating business logic from UI rendering improves unit testing and Storybook design system integration.',
    whenNotToUse: 'Do not dogmatically split every trivial 20-line component into separate container and presentational files; that causes unnecessary file proliferation.',
    commonMistakes: [
      '- Embedding complex SQL-like filtering, data massaging, and fetch calls directly inside JSX render components.',
      '- Believing that class components are required for containers (custom hooks replaced container components).'
    ].join('\n'),
    perfA11y: 'Separating presentation from data fetching allows presentational components to be wrapped in React.memo safely, as their props are pure primitive data.',
    realWorld: 'Production design systems maintain pure presentational components in a dedicated package (@company/ui) while application code provides data hooks (@company/features).',
    interviewQs: [
      '**Q: How has the Presentational vs Container pattern evolved with the introduction of React Hooks?**',
      '*Spoken Answer*: "Historically, the pattern required two separate React components: a smart Container class component that handled state and data fetching, wrapping a dumb presentational component that received data via props. With React Hooks, custom hooks have replaced container components. The custom hook encapsulates the stateful logic, network requests, and lifecycle, while the component handles the UI. This provides the identical separation of concerns without introducing artificial wrapper components into the Fiber tree."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects leverage this separation to write fast, zero-mock unit tests for presentational UI components, while testing stateful logic independently via renderHook().',
    revisionSummary: [
      '- Presentational = How it looks (props in, JSX out).',
      '- Container = How it works (fetching, state, business logic).',
      '- Modern React uses Custom Hooks as the container layer.'
    ].join('\n')
  }),

  createSection('3.6', '17. Compound Components Pattern', 6, {
    whatItIs: 'Compound components is an advanced React pattern where multiple components work together to share implicit state and accomplish a single UI task, similar to native HTML <select> and <option> elements.',
    whyItExists: 'Traditional components with many options suffer from "prop explosion", creating rigid, unreadable component APIs.',
    problemSolved: 'Provides flexible, declarative component APIs where the consumer controls markup hierarchy while the parent coordinates state behind the scenes via React Context.',
    prerequisites: 'React Context API (createContext, useContext), children, and component properties.',
    syntax: [
      '// Declarative Consumer API:',
      '<Accordion>',
      '  <Accordion.Item id="item-1">',
      '    <Accordion.Header>Section 1</Accordion.Header>',
      '    <Accordion.Body>Content 1</Accordion.Body>',
      '  </Accordion.Item>',
      '</Accordion>'
    ].join('\n'),
    minimalExample: `
import React, { useState, createContext, useContext } from 'react';

// 1. Create Internal Context for Compound Communication
const TabContext = createContext(null);

export function Tabs({ defaultIndex = 0, children }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs-container">{children}</div>
    </TabContext.Provider>
  );
}

// 2. Child Component: Tab Trigger
Tabs.Tab = function Tab({ index, children }) {
  const context = useContext(TabContext);
  if (!context) throw new Error('Tabs.Tab must be used within <Tabs>');

  const isActive = context.activeIndex === index;
  return (
    <button 
      onClick={() => context.setActiveIndex(index)}
      style={{
        padding: '0.5rem 1rem',
        fontWeight: isActive ? 700 : 400,
        borderBottom: isActive ? '2px solid #38bdf8' : 'none',
        background: 'transparent',
        color: isActive ? '#38bdf8' : '#94a3b8',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
};

// 3. Child Component: Tab Content Panel
Tabs.Panel = function Panel({ index, children }) {
  const context = useContext(TabContext);
  if (!context) throw new Error('Tabs.Panel must be used within <Tabs>');

  if (context.activeIndex !== index) return null;
  return <div style={{ padding: '1rem' }}>{children}</div>;
};
`,
    lineByLine: [
      '- Line 4: Creates TabContext hidden internally within the module.',
      '- Line 6-13: Parent Tabs component maintains activeIndex state and provides it to all descendants.',
      '- Line 16-34: Tabs.Tab consumes context, reacting to clicks and styling active state.',
      '- Line 37-43: Tabs.Panel conditionally renders content matching activeIndex.'
    ].join('\n'),
    internalFlow: [
      '1. Consumer renders <Tabs><Tabs.Tab index={0}>Tab 1</Tabs.Tab><Tabs.Panel index={0}>Panel 1</Tabs.Panel></Tabs>.',
      '2. React initializes the Tabs Fiber and its TabContext.Provider.',
      '3. Subcomponents call useContext(TabContext), creating a dependency on the provider.',
      '4. When a user clicks Tabs.Tab, setActiveIndex updates provider state.',
      '5. All context consumer Fibers re-render, switching the visible panel without passing a single prop manually between them!'
    ].join('\n'),
    whenToUse: 'When building complex, interactive design system components: Tabs, Accordions, Dropdown Menus, Radio Groups, and Multi-step Wizards.',
    whenNotToUse: 'For simple components that only accept 1 or 2 options; standard props are simpler.',
    commonMistakes: [
      '- Forgetting to throw an error when a subcomponent is rendered outside the parent provider.',
      '- Forcing subcomponents to be direct immediate children using React.Children.map (using Context allows subcomponents to be nested arbitrarily deep).'
    ].join('\n'),
    perfA11y: 'Compound components excel at accessibility: the parent context can automatically generate coordinated ARIA attributes (aria-controls, aria-labelledby, role="tab").',
    realWorld: 'Headless UI libraries (Radix UI, Reach UI, Headless UI) use Compound Components as their foundational architecture.',
    interviewQs: [
      '**Q: What is the Compound Components pattern and what problem does it solve?**',
      '*Spoken Answer*: "The Compound Components pattern allows a parent and its sub-components to work together harmoniously to accomplish a task while hiding internal state management from the consumer. It solves the \'prop explosion\' problem where a single monolithic component requires dozens of configuration props. By using React Context under the hood, sub-components like <Select.Option> or <Tabs.Panel> can communicate with the parent <Tabs> regardless of where they are placed in the DOM, giving consumers complete control over layout and rendering."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers export subcomponents as static properties on the main component (Tabs.Tab = Tab) to offer clean single-import DX while preserving tree-shaking.',
    revisionSummary: [
      '- Modeled after <select> and <option>.',
      '- Uses React Context internally to share implicit state.',
      '- Eliminates prop explosion and gives consumers layout control.'
    ].join('\n')
  }),

  createSection('3.7', '18. Component API Design & Avoiding Over-Abstraction', 7, {
    whatItIs: 'Principles and guidelines for designing clean, intuitive, and future-proof component prop interfaces, balanced against the trap of premature or over-abstraction.',
    whyItExists: 'As design systems scale, developers often add dozens of boolean flags (isCompact, hasBorder, isBlue, isSecondaryRounded), leading to bloated, fragile components that are impossible to maintain.',
    problemSolved: 'Prevents the "Swiss Army Knife" component anti-pattern and establishes clear contracts between UI components and feature consumers.',
    prerequisites: 'TypeScript union types, prop destructuring, and component composition.',
    syntax: [
      '// Anti-Pattern (Boolean Flag Explosion):',
      '<Button isPrimary isSmall hasLeftIcon isSubmit isLoading isFullWidth />',
      '',
      '// Optimal Pattern (Discriminated Enums + Composition):',
      '<Button variant="primary" size="sm" width="full" loading={isLoading}>',
      '  <UploadIcon /> Upload File',
      '</Button>'
    ].join('\n'),
    minimalExample: `
import React from 'react';

// Clean, predictable Component API Contract
export function Alert({ 
  variant = 'info', 
  title, 
  onClose, 
  children 
}) {
  const variantStyles = {
    info: { border: '#0284c7', bg: '#0c4a6e', icon: 'ℹ️' },
    success: { border: '#16a34a', bg: '#064e3b', icon: '✅' },
    warning: { border: '#d97706', bg: '#78350f', icon: '⚠️' },
    error: { border: '#dc2626', bg: '#7f1d1d', icon: '🚨' }
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div 
      role="alert"
      style={{
        padding: '1rem',
        borderRadius: '8px',
        borderLeft: \`4px solid \${style.border}\`,
        backgroundColor: style.bg,
        color: '#f8fafc',
        marginBottom: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{style.icon}</span>
          {title && <strong>{title}</strong>}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Close Alert"
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        {children}
      </div>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-9: Clean API contract: uses mutually exclusive enum string variant instead of four separate boolean props.',
      '- Line 20-30: Implements accessible role="alert" container with dynamic styles.',
      '- Line 37-45: Close button is rendered only if onClose callback is provided.',
      '- Line 47: Uses children for arbitrary body content instead of a rigid message string prop.'
    ].join('\n'),
    internalFlow: [
      '1. Enforcing union string props (variant="info") allows TypeScript to statically validate props at compile time.',
      '2. Inlining or mapping lookup objects prevents complex chained if/else branch evaluations inside the render phase.',
      '3. Using children delegates rendering control to the consumer, avoiding the need to add new props every time formatted text, links, or bold tags are needed.'
    ].join('\n'),
    whenToUse: 'When authoring shared components in design systems, component libraries, or common modules.',
    whenNotToUse: 'Do not create generic 500-line MasterTable components that attempt to handle forms, graphs, sorting, and pagination in a single file; write focused, composable components instead.',
    commonMistakes: [
      '- Creating boolean props that contradict each other: <Button primary secondary />.',
      '- Premature abstraction: Creating a generic component before having at least 3 distinct, concrete use cases.'
    ].join('\n'),
    perfA11y: 'Designing props that accept standard HTML attributes (...rest) allows consumers to pass essential accessibility attributes (aria-expanded, aria-describedby) without modifying the component.',
    realWorld: 'Production design systems enforce strict ESLint and TypeScript rules ensuring all button variants derive from a single unified type definition.',
    interviewQs: [
      '**Q: What is the "boolean prop explosion" anti-pattern and how do you prevent it?**',
      '*Spoken Answer*: "Boolean prop explosion happens when a component accumulates numerous boolean flags over time—such as isPrimary, isSecondary, isDanger, isSmall, isLarge—to handle new styling variations. This leads to invalid states where a consumer can pass both isPrimary and isDanger simultaneously. To prevent this, replace mutually exclusive booleans with enumerated string union props like variant=\'primary\' | \'danger\' and size=\'sm\' | \'lg\', and use component composition with children instead of rigid string props."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects follow the AHA programming guideline ("Avoid Hasty Abstractions"). Duplication is far cheaper than the wrong abstraction; wait until identical patterns emerge across 3 separate features before building an abstract component.',
    revisionSummary: [
      '- Prefer enum strings (variant="primary") over boolean flags (isPrimary).',
      '- Use children for content flexibility.',
      '- Avoid premature abstraction: 3 concrete use cases before abstracting.'
    ].join('\n')
  })
];

// ==========================================
// PART 4: State & Rendering Mechanics
// ==========================================
const p4_sections = [
  createSection('4.1', '19. What State Means in React & useState Foundations', 1, {
    whatItIs: 'State is a component\'s internal memory. It holds data that changes over time and directly influences what appears on screen. When state changes, React triggers a re-render to update the user interface.',
    whyItExists: 'Ordinary JavaScript local variables are wiped clean and re-initialized every time a function re-executes. React needs a mechanism to preserve values across function component invocations.',
    problemSolved: 'Provides persistent, reactive component memory that automatically drives DOM updates when modified.',
    prerequisites: 'JavaScript closures, array destructuring, and function execution contexts.',
    syntax: [
      '// Standard useState:',
      'const [state, setState] = useState(initialValue);',
      '',
      '// Lazy Initial State (Runs only on initial mount!):',
      'const [state, setState] = useState(() => {',
      '  return computeExpensiveInitialData();',
      '});'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // Lazy initial state: Only reads localStorage once on mount
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  return (
    <div style={{ padding: '1rem', background: theme === 'dark' ? '#0f172a' : '#f8fafc', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 5: useState(0) returns a tuple containing the current state value and an updater function.',
      '- Line 8-10: Passes a function to useState. React runs this function strictly during the initial mount, avoiding expensive repeated localStorage.getItem() reads on subsequent re-renders!',
      '- Line 15-16: Calling setCount or setTheme queues a re-render with the new state.'
    ].join('\n'),
    internalFlow: [
      '1. On mount: React allocates a hook object in the Fiber\'s memoizedState linked list: { memoizedState: 0, next: null }.',
      '2. On update (setCount(1)): React adds an update action to the hook\'s queue and marks the Fiber as dirty.',
      '3. React schedules a render phase pass.',
      '4. On re-render: React walks the hook linked list in exact order, reading the updated memoizedState from the Fiber node.'
    ].join('\n'),
    whenToUse: 'For any data that changes over time and whose change must be reflected in the rendered UI (input values, toggles, active tab indices, modal visibility).',
    whenNotToUse: 'Do not use state for values that do not affect the rendered output (e.g. interval IDs, WebSocket instances, analytics session tokens); use useRef instead.',
    commonMistakes: [
      '- Passing a function call to initial state: useState(computeData()). This re-computes computeData() on every single render, even though React discards the return value after mount! Always pass the function reference: useState(computeData).',
      '- Direct mutation: count = count + 1 does not notify React and will never cause a re-render.'
    ].join('\n'),
    perfA11y: 'Use lazy initialization for state derived from localStorage, large JSON parsing, or heavy array calculations to prevent blocking the initial mount.',
    realWorld: 'Production authentication hooks initialize session state from encrypted cookies using lazy initial state to avoid redundant parsing.',
    interviewQs: [
      '**Q: What is the purpose of lazy initial state in useState?**',
      '*Spoken Answer*: "Lazy initial state is when you pass an initializer function to useState(() => compute()) instead of a direct value. If the initial state computation involves expensive operations like reading from localStorage, decoding a JWT, or parsing large JSON payloads, passing a direct value causes that function to re-execute on every subsequent re-render, wasting CPU cycles. By passing an initializer function, React guarantees it executes strictly once during the initial mount."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers audit component state to ensure local state is colocated as close as possible to the leaf nodes that consume it, minimizing the blast radius of re-renders.',
    revisionSummary: [
      '- useState preserves values across re-renders.',
      '- Calling the setter queues a re-render.',
      '- Use useState(() => expensive()) for lazy initialization.'
    ].join('\n')
  }),

  createSection('4.2', '20. State as a Snapshot & React 18/19 Automatic Batching', 2, {
    whatItIs: 'State in React behaves like a fixed snapshot. Within a single render execution, state variables never mutate; they are constant values captured within that render’s closure. Automatic batching groups multiple state updates into a single re-render.',
    whyItExists: 'In React 17 and earlier, batching only occurred inside React synthetic event handlers. Updates inside setTimeout, Promise.then, or native event listeners triggered separate re-renders for every setter call, causing UI flickering and wasted CPU cycles. React 18 introduced universal Automatic Batching.',
    problemSolved: 'Prevents half-finished UI states and eliminates redundant re-renders across asynchronous callbacks.',
    prerequisites: 'JavaScript closures, call stack execution, and event loop microtask queues.',
    syntax: [
      '// Snapshot Mental Model:',
      'const [count, setCount] = useState(0);',
      '',
      'const handleClick = () => {',
      '  setCount(count + 1); // count is 0! queues next state = 1',
      '  setCount(count + 1); // count is STILL 0! queues next state = 1',
      '  setCount(count + 1); // count is STILL 0! queues next state = 1',
      '  // Result after render: count is 1, NOT 3!',
      '};'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function SnapshotDemo() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('idle');

  // React 18/19 Automatic Batching across async boundaries!
  const handleAsyncUpdate = () => {
    fetch('/api/status')
      .then(() => {
        // In React 17: Caused 2 separate renders!
        // In React 18/19: Batched into exactly 1 render!
        setCount(c => c + 1);
        setStatus('completed');
      })
      .catch(() => {
        setStatus('error');
      });
  };

  return (
    <div>
      <p>Count: {count} | Status: {status}</p>
      <button onClick={handleAsyncUpdate}>Run Async Action</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-5: Declares two independent state variables (count, status).',
      '- Line 13-14: Inside an async Promise callback, two separate state setters are invoked.',
      '- React 18/19 groups both updates into a single microtask render, updating both values simultaneously on screen.'
    ].join('\n'),
    internalFlow: [
      '1. When setCount and setStatus are called, React appends updates to the Fiber queue.',
      '2. The reconciler schedules a reconciliation pass via a microtask (queueMicrotask).',
      '3. During the microtask execution, React processes all queued updates for that component tree simultaneously.',
      '4. Only a single Render Phase and Commit Phase are executed.',
      '5. In the rare case an urgent synchronous render is required, ReactDOM.flushSync() can force immediate re-rendering.'
    ].join('\n'),
    whenToUse: 'Automatic batching is enabled by default in all React 18 and 19 applications using createRoot.',
    whenNotToUse: 'Do not attempt to read the updated state on the line immediately following a setter call (setCount(1); console.log(count); // prints old value!).',
    commonMistakes: [
      '- Expecting setCount(count + 1) called three times in a row to increment by 3 (each call closed over the same snapshot count value; use functional updates setCount(c => c + 1) instead).',
      '- Using flushSync prematurely, which destroys concurrent performance.'
    ].join('\n'),
    perfA11y: 'Automatic batching prevents intermediate inconsistent states from being painted to screen, protecting screen readers from announcing fleeting half-updated values.',
    realWorld: 'Async checkout flows update multiple states upon receiving Stripe responses; batching ensures the entire success view mounts in a single paint.',
    interviewQs: [
      '**Q: What is Automatic Batching in React 18, and how does it differ from React 17?**',
      '*Spoken Answer*: "In React 17, batching was limited strictly to React\'s synthetic event handlers. If you updated multiple state variables inside a setTimeout, a Promise then() callback, or a native event listener, each state setter triggered a separate, synchronous re-render. In React 18, Automatic Batching is universal across the entire runtime: all state updates—regardless of whether they occur inside promises, timeouts, or native listeners—are batched into a single re-render, minimizing DOM updates and improving performance."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers understand that state is immutable within a single render cycle. To access the latest value immediately inside an asynchronous callback, pair state with a useRef instance variable.',
    revisionSummary: [
      '- State is a snapshot within the current render.',
      '- Multiple setters in a handler are batched into a single render.',
      '- React 18+ batches everywhere (timeouts, promises, events).'
    ].join('\n')
  }),

  createSection('4.3', '21. Functional State Updates & Race Conditions', 3, {
    whatItIs: 'A pattern where you pass an updater function setState(prev => next) instead of a direct value, allowing access to the pending, most up-to-date state in React’s internal queue.',
    whyItExists: 'Because state is a snapshot, calling a setter multiple times within the same event handler or inside an asynchronous closure reads stale values from the initial render context.',
    problemSolved: 'Eliminates stale closure bugs and guarantees that sequential updates accumulate correctly.',
    prerequisites: 'Closures, function arguments, and the React state queue.',
    syntax: [
      '// Direct Value (Subject to Stale Closure):',
      'setCount(count + 1);',
      '',
      '// Functional Update (Safe & Guaranteed):',
      'setCount(previousCount => previousCount + 1);'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function BatchIncrementer() {
  const [count, setCount] = useState(0);

  const handleTripleIncrement = () => {
    setCount(prev => prev + 1); // queue: 0 -> 1
    setCount(prev => prev + 1); // queue: 1 -> 2
    setCount(prev => prev + 1); // queue: 2 -> 3
    // Result after render: count will be 3!
  };

  const handleDelayedIncrement = () => {
    setTimeout(() => {
      setCount(prev => prev + 1);
    }, 2000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleTripleIncrement}>+3 at Once</button>
      <button onClick={handleDelayedIncrement}>+1 After 2s</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7-11: Three sequential functional updates. React puts each updater function into a queue.',
      '- When reconciling, React passes the return of the first updater as prev into the second updater.',
      '- Line 14-20: Inside setTimeout, prev => prev + 1 avoids capturing a stale count variable from the closure scope.'
    ].join('\n'),
    internalFlow: [
      '1. When setCount(updaterFn) is called, React appends an update object { action: updaterFn, next: null } to the Fiber hook\'s queue.',
      '2. During the next render phase, React loops through the update queue:',
      '   - Initial: baseState = 0',
      '   - Update 1: baseState = updaterFn(0) // returns 1',
      '   - Update 2: baseState = updaterFn(1) // returns 2',
      '   - Update 3: baseState = updaterFn(2) // returns 3',
      '3. Final memoizedState is stored as 3.'
    ].join('\n'),
    whenToUse: 'Whenever the next state depends on the previous state value, or when updating state inside asynchronous timers, event listeners, or Promises.',
    whenNotToUse: 'When setting a state value that is completely independent of the previous value (e.g. setSelectedUser(user) or setIsModalOpen(false)).',
    commonMistakes: [
      '- Performing side-effects inside the updater function. Updaters MUST be pure functions because React 18/19 Strict Mode executes them twice in development to verify purity!'
    ].join('\n'),
    perfA11y: 'Functional updates allow you to omit state variables from useEffect dependency arrays, preventing unnecessary effect re-executions.',
    realWorld: 'Real-time WebSocket consumers use functional updates (setMessages(prev => [...prev, incomingMsg])) to append messages without triggering stale closure overwrites.',
    interviewQs: [
      '**Q: Why should updater functions passed to useState be completely pure?**',
      '*Spoken Answer*: "Updater functions must be pure because React\'s concurrent rendering engine may invoke them multiple times before committing. In development mode with Strict Mode enabled, React deliberately runs updater functions twice to detect unintended side effects like mutations or network calls. If an updater performs a side effect—such as pushing to a global array or logging a transaction—it will execute twice and produce corrupt state or duplicate analytics events."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers use functional updates to eliminate dependencies in useCallback hooks, ensuring callback references remain stable across renders.',
    revisionSummary: [
      '- Use setCount(prev => prev + 1) when next state depends on previous.',
      '- Solves stale closure bugs in timers and callbacks.',
      '- Updaters MUST be pure (no side effects).'
    ].join('\n')
  }),

  createSection('4.4', '22. Immutable State Updates: Objects & Nested Structures', 4, {
    whatItIs: 'The strict rule in React that state objects must never be directly mutated in memory; instead, updates must create new object references using the spread operator (...) or immutable utilities.',
    whyItExists: 'React’s reconciliation engine relies on referential equality (Object.is(prev, next)) to detect if an object has changed. If you mutate an object in place (user.name = "Bob"), the memory reference remains identical, and React assumes nothing changed, skipping the re-render.',
    problemSolved: 'Prevents silent UI update failures, broken undo/redo histories, and corrupted state caches.',
    prerequisites: 'JavaScript object references (Stack pointer vs Heap object), shallow copying vs deep copying.',
    syntax: [
      '// FATAL ERROR (Mutation - Re-render will NOT trigger!):',
      'user.profile.bio = "New Bio";',
      'setUser(user);',
      '',
      '// CORRECT (Shallow Spread):',
      'setUser(prev => ({ ...prev, name: "Bob" }));',
      '',
      '// CORRECT (Nested Spread):',
      'setUser(prev => ({',
      '  ...prev,',
      '  profile: { ...prev.profile, bio: "New Bio" }',
      '}));'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function UserProfileEditor() {
  const [user, setUser] = useState({
    id: 'usr_88',
    name: 'Sarah Connor',
    profile: {
      bio: 'Cyberdyne Systems Security Engineer',
      theme: 'dark'
    }
  });

  const updateBio = (newBio) => {
    setUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        bio: newBio
      }
    }));
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>{user.name}</h3>
      <p>Bio: {user.profile.bio}</p>
      <button onClick={() => updateBio('Resistance Leader & Strategic Consultant')}>
        Promote Bio
      </button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-11: Complex state object containing a nested profile object.',
      '- Line 13-21: updateBio performs an immutable nested update. It spreads top-level prev, then creates a new profile object spreading prev.profile, and overrides bio.',
      '- Because the top-level reference changes, React detects the update immediately.'
    ].join('\n'),
    internalFlow: [
      '1. setUser receives a new object reference allocated on the heap.',
      '2. React checks Object.is(currentFiber.memoizedState, newObject).',
      '3. Because the memory address differs, the check returns false.',
      '4. React flags the Fiber with Update effect tag and schedules a re-render.',
      '5. If the object had been mutated directly, Object.is(obj, obj) returns true, and React immediately bails out of rendering!'
    ].join('\n'),
    whenToUse: 'Whenever updating any state variable that is an object or contains nested objects.',
    whenNotToUse: 'For deeply nested state trees (more than 3 levels deep), nested object spreading becomes unreadable; use Immer (use-immer) or normalize state into flat tables.',
    commonMistakes: [
      '- Shallow spread on nested objects: setUser({ ...user, profile: { bio: "New" } }). This wipes out all other fields on profile (like theme)! You must spread both levels: profile: { ...user.profile, bio: "New" }.'
    ].join('\n'),
    perfA11y: 'Immutable updates allow memoized subtrees (React.memo) to skip re-rendering by performing fast O(1) reference comparisons instead of expensive deep object traversals.',
    realWorld: 'Redux Toolkit and modern Zustand stores leverage Immer under the hood to let developers write intuitive mutating syntax while safely emitting frozen immutable objects.',
    interviewQs: [
      '**Q: What happens internally if you mutate an object in React state directly before calling the setter?**',
      '*Spoken Answer*: "If you mutate an object directly—for instance, user.age = 30; setUser(user);—React performs a fast referential equality check using Object.is(prev, next). Because user is a reference pointing to the exact same location in heap memory, the check evaluates to true. React concludes that no state transition occurred, bails out of the render phase, and fails to update the user interface. Even if a re-render is subsequently triggered by another component, you have created a corrupted state snapshot that breaks time-travel debugging and memoization."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects prevent nested spread fatigue by normalizing state entities by ID (like a relational database table) or adopting Immer for complex form workflows.',
    revisionSummary: [
      '- Never mutate state objects directly.',
      '- Use { ...prev, key: value } for top-level updates.',
      '- Nested structures require spreading at EVERY level.',
      '- Direct mutation causes React to bail out of re-rendering.'
    ].join('\n')
  }),

  createSection('4.5', '23. Immutable State Updates: Arrays', 5, {
    whatItIs: 'Rules and methods for updating arrays stored in React state by producing fresh array copies instead of mutating the existing array in place.',
    whyItExists: 'JavaScript array methods are split into mutating methods (push, pop, splice, sort, reverse) and non-mutating methods (concat, slice, filter, map). Using mutating methods causes identical reference bailout in React.',
    problemSolved: 'Guarantees reliable re-rendering when adding, removing, updating, or sorting array items.',
    prerequisites: 'ES6 Array methods (map, filter, slice, spread [...]).',
    syntax: [
      '// Array Operations Cheat-Sheet:',
      '// 1. ADD: [...arr, newItem]',
      '// 2. REMOVE: arr.filter(item => item.id !== targetId)',
      '// 3. UPDATE: arr.map(item => item.id === targetId ? { ...item, done: true } : item)',
      '// 4. INSERT: [...arr.slice(0, index), newItem, ...arr.slice(index)]',
      '// 5. SORT: [...arr].sort((a, b) => a.val - b.val)'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Deploy to AWS', done: false },
    { id: 2, text: 'Run Vitest Suite', done: false }
  ]);

  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, done: false };
    setTodos(prev => [...prev, newTodo]);
  };

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <div>
      <button onClick={() => addTodo('New Task')}>Add Task</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo.id)} style={{ cursor: 'pointer' }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)} style={{ marginLeft: '1rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 11: Adds item using spread operator [...prev, newTodo], producing a new array reference.',
      '- Line 16: Removes item using filter(), which inherently returns a fresh array excluding the target ID.',
      '- Line 21-23: Updates item using map(). Returns a new object for the matched ID and preserves existing references for untouched items.'
    ].join('\n'),
    internalFlow: [
      'Structural Sharing:',
      '1. When map() updates item 1 of a 1000-item array:',
      '   - Item 1 gets a new object reference.',
      '   - Items 2 through 1000 retain their exact previous object references in memory.',
      '2. The array itself gets a new reference on the heap.',
      '3. When React re-renders the list, memoized child components for items 2 through 1000 skip rendering because their item prop reference didn\'t change! This is called Structural Sharing.'
    ].join('\n'),
    whenToUse: 'In all array state operations.',
    whenNotToUse: 'Never use todos.push(newItem) or todos.sort() directly on state arrays.',
    commonMistakes: [
      '- Calling arr.sort() directly. sort() mutates the array in place! Always make a copy first: [...arr].sort().',
      '- Using splice() instead of slice(). splice() mutates; slice() copies.'
    ].join('\n'),
    perfA11y: 'Structural sharing combined with React.memo enables smooth 60fps rendering in lists with thousands of entries, as only the single modified row re-renders.',
    realWorld: 'Production shopping carts update quantities via items.map(item => item.id === id ? { ...item, qty } : item).',
    interviewQs: [
      '**Q: How do you safely sort an array stored in React state?**',
      '*Spoken Answer*: "Because JavaScript\'s native Array.prototype.sort() mutates the array in place, calling todos.sort() mutates the state array directly, which violates React\'s immutability contract and can prevent re-rendering. To sort safely, you must first create a shallow copy using the spread operator or slice(), and then invoke sort on the copy: setTodos(prev => [...prev].sort((a, b) => a.title.localeCompare(b.title)))."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers recognize that frequent large array operations (e.g. 50,000 records) incur garbage collection pressure from repeated array allocations. For high-frequency mutations, they use normalized dictionaries (entities: { [id]: item }) for O(1) updates.',
    revisionSummary: [
      '- Add: [...arr, item].',
      '- Remove: arr.filter(item => item.id !== id).',
      '- Update: arr.map(item => item.id === id ? { ...item, ...patch } : item).',
      '- Sort: [...arr].sort() (always copy first).'
    ].join('\n')
  }),

  createSection('4.6', '24. Derived State vs Redundant State', 6, {
    whatItIs: 'Derived state is any value that can be computed synchronously during the render phase from existing props or state. Redundant state is the anti-pattern of duplicating that computed value in a separate state variable.',
    whyItExists: 'Developers transitioning from imperative paradigms often create extra state variables and attempt to synchronize them using useEffect. This leads to synchronization bugs and double re-renders.',
    problemSolved: 'Guarantees a Single Source of Truth and prevents state desynchronization bugs.',
    prerequisites: 'Component render lifecycle, pure expressions, and memoization with useMemo.',
    syntax: [
      '// ANTI-PATTERN (Redundant State & Fragile Effect):',
      'const [items, setItems] = useState([]);',
      'const [total, setTotal] = useState(0); // REDUNDANT!',
      'useEffect(() => {',
      '  setTotal(items.reduce((acc, i) => acc + i.price, 0)); // Extra render!',
      '}, [items]);',
      '',
      '// OPTIMAL PATTERN (Derived State):',
      'const [items, setItems] = useState([]);',
      'const total = items.reduce((acc, i) => acc + i.price, 0); // Computed on the fly!'
    ].join('\n'),
    minimalExample: `
import React, { useState, useMemo } from 'react';

export default function SearchableProductCatalog({ products }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Filter products..."
      />
      <p>Found {filteredProducts.length} matching items</p>
      <ul>
        {filteredProducts.map(p => (
          <li key={p.id}>{p.name} - \${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-5: Declares the only two true sources of truth: searchQuery and selectedCategory.',
      '- Line 7-14: Derives filteredProducts directly. Wrapping with useMemo caches the result so it only recalculates when dependencies change.',
      '- Line 22: Direct derivation of list count (filteredProducts.length) without storing a redundant count state.'
    ].join('\n'),
    internalFlow: [
      '1. User types in search input -> setSearchQuery triggers a re-render.',
      '2. During the render phase, the component body executes from top to bottom.',
      '3. filteredProducts is computed synchronously in memory before JSX is returned.',
      '4. The Virtual DOM is diffed against the previous tree in a single pass.',
      '5. In the anti-pattern, setting total inside an Effect forces React to paint the screen with the old total, and then immediately trigger a SECOND re-render to update the total.'
    ].join('\n'),
    whenToUse: 'For any calculation derived from existing state or props: filtering lists, calculating totals, checking if a form is valid, counting unread messages.',
    whenNotToUse: 'Do not use simple variables if the calculation is extremely expensive and runs on every re-render; wrap with useMemo.',
    commonMistakes: [
      '- Creating state to mirror props: const [email, setEmail] = useState(props.email). If props.email changes, the state will NOT update automatically!'
    ].join('\n'),
    perfA11y: 'Derived state eliminates the layout thrash where users briefly see an outdated count or stale total badge before an Effect fires.',
    realWorld: 'Enterprise shopping carts calculate subtotal, VAT, shipping tiers, and discounts as pure derived values from the cartItems array.',
    interviewQs: [
      '**Q: Why should you calculate derived state during rendering rather than synchronizing it in useEffect?**',
      '*Spoken Answer*: "Calculating derived state during render upholds a single source of truth. If you mirror derived data in a separate state variable using useEffect, you introduce two major problems: first, it triggers an unnecessary second re-render cycle, hurting performance; second, it creates a momentary frame where the UI is out of sync, displaying stale data before the Effect executes. Computing values directly during the render pass ensures they are always perfectly synchronized with zero extra re-renders."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers enforce the principle: "Never put into state what you can compute from props or existing state." This single rule eliminates up to 40% of frontend state bugs.',
    revisionSummary: [
      '- Don\'t store what you can compute.',
      '- Compute directly in render body.',
      '- Wrap expensive calculations in useMemo.',
      '- Avoid useEffect to synchronize state with other state.'
    ].join('\n')
  }),

  createSection('4.7', '25. State Ownership, Lifting State Up & Sibling Communication', 7, {
    whatItIs: 'Lifting state up is the practice of moving state to the lowest common parent component so that multiple sibling components can share and synchronize the same data.',
    whyItExists: 'Sibling components in React cannot pass data horizontally to each other. Because data only flows downward, state must be lifted to an ancestor.',
    problemSolved: 'Enables synchronized sibling components (e.g. an input field in one component filtering a list in a sibling component).',
    prerequisites: 'Unidirectional data flow, props callbacks, and component trees.',
    syntax: [
      '// Parent manages state and passes data + updater:',
      'function Parent() {',
      '  const [value, setValue] = useState("");',
      '  return (',
      '    <>',
      '      <SiblingA value={value} onChange={setValue} />',
      '      <SiblingB value={value} />',
      '    </>',
      '  );',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset style={{ margin: '0.5rem 0' }}>
      <legend>Enter temperature in {scale}:</legend>
      <input 
        value={temperature} 
        onChange={(e) => onTemperatureChange(e.target.value)} 
      />
    </fieldset>
  );
}

function BoilingVerdict({ celsius }) {
  if (celsius >= 100) {
    return <p style={{ color: '#ef4444', fontWeight: 700 }}>Water would boil! 🔥</p>;
  }
  return <p style={{ color: '#38bdf8' }}>Water would not boil. ❄️</p>;
}

export default function Calculator() {
  const [temperature, setTemperature] = useState('');
  const celsius = parseFloat(temperature);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Boiling Calculator</h3>
      <TemperatureInput 
        scale="Celsius" 
        temperature={temperature} 
        onTemperatureChange={setTemperature} 
      />
      <BoilingVerdict celsius={Number.isNaN(celsius) ? 0 : celsius} />
    </div>
  );
}
`,
    lineByLine: [
      '- Line 24: Calculator parent holds the single temperature state.',
      '- Line 30-34: Passes temperature value and setTemperature callback down to Sibling A (TemperatureInput).',
      '- Line 35: Passes the derived numeric celsius value down to Sibling B (BoilingVerdict).',
      '- When the input changes, Sibling A invokes the parent updater, which re-renders the parent and updates Sibling B automatically!'
    ].join('\n'),
    internalFlow: [
      '1. User types in TemperatureInput -> triggers native input event.',
      '2. onTemperatureChange(val) callback is called at the leaf node.',
      '3. Call stack reaches the parent’s setTemperature dispatcher.',
      '4. React Fiber marks the Calculator parent Fiber as dirty.',
      '5. In the render pass, the parent re-renders, causing both child Fiber nodes to re-evaluate with the new synchronized props.'
    ].join('\n'),
    whenToUse: 'Whenever two or more sibling components need to reflect or manipulate the same underlying data.',
    whenNotToUse: 'If state is needed by 10+ deeply nested components across completely different page branches, lifting state to root causes excessive re-renders; consider React Context or Zustand.',
    commonMistakes: [
      '- Creating duplicate state in both siblings and attempting to keep them in sync using useEffect (inevitably leads to infinite loops or desynchronization).'
    ].join('\n'),
    perfA11y: 'Lifting state up keeps input feedback accessible: assistive technologies receive synchronized updates between input controls and companion preview regions simultaneously.',
    realWorld: 'Search filters in e-commerce: a search input in the header lifts its query state to the page layout so the product grid sibling updates in real time.',
    interviewQs: [
      '**Q: What does "lifting state up" mean in React, and why is it necessary?**',
      '*Spoken Answer*: "Lifting state up means moving a state variable from a child component to its closest common ancestor in the component hierarchy. It is necessary because React enforces a strict unidirectional downward data flow; sibling components cannot communicate horizontally. By lifting state to their common parent, the parent becomes the single source of truth, passing the current data down to one sibling and the update callback to the other, ensuring both components stay perfectly synchronized."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects ensure state is lifted only as high as necessary. Lifting state too high causes the entire application to re-render on every keystroke.',
    revisionSummary: [
      '- Siblings cannot talk to each other directly.',
      '- Move shared state to their lowest common ancestor.',
      '- Parent passes data down to one child and callback down to the other.'
    ].join('\n')
  }),

  createSection('4.8', '26. State Preservation, Identity & Resetting with Keys', 8, {
    whatItIs: 'The set of rules React uses to decide whether to preserve or reset a component’s internal state across renders based on its element type, position in the UI tree, and key prop.',
    whyItExists: 'Recreating state and DOM nodes on every render would destroy typing focus and scroll position. React preserves state as long as a component remains in the same position in the Fiber tree. Keys allow developers to explicitly force state resets.',
    problemSolved: 'Enables intentional resetting of form drafts when switching users, without manual useEffect cleanup boilerplate.',
    prerequisites: 'Fiber tree positioning, component identity, and reconciliation rules.',
    syntax: [
      '// Rule 1: Same Component at Same Position = State Preserved',
      '{isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />} // State kept!',
      '',
      '// Rule 2: Different Component at Same Position = State Destroyed',
      '{isFancy ? <Counter /> : <p>Not a counter</p>} // Counter unmounted, state wiped!',
      '',
      '// Rule 3: Forcing State Reset with a Key:',
      '<ContactForm key={selectedUserId} userId={selectedUserId} />'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

function UserChatForm({ recipient }) {
  const [draft, setDraft] = useState('');

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155', marginTop: '1rem' }}>
      <h4>Chat with: {recipient}</h4>
      <textarea 
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={\`Write a message to \${recipient}...\`}
        rows={3}
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <button onClick={() => alert(\`Sent to \${recipient}: \${draft}\`)}>Send</button>
    </div>
  );
}

export default function MessengerApp() {
  const [contact, setContact] = useState('Alice');

  return (
    <div>
      <button onClick={() => setContact('Alice')}>Alice</button>
      <button onClick={() => setContact('Bob')}>Bob</button>

      {/* THE KEY PROP MAGIC:
          Passing key={contact} tells React: "When contact changes, this is a 
          COMPLETELY DIFFERENT component! Wipe the old draft state completely!" */}
      <UserChatForm key={contact} recipient={contact} />
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: UserChatForm has local draft state.',
      '- Line 24: MessengerApp switches between Alice and Bob.',
      '- Line 34: key={contact} is passed to the component.',
      '- When switching from Alice to Bob, the key changes from "Alice" to "Bob". React unmounts Alice\'s Fiber, destroying the draft text, and mounts a fresh Bob Fiber with an empty draft!'
    ].join('\n'),
    internalFlow: [
      '1. In the diffing phase, React checks: oldFiber.type === newElement.type and oldFiber.key === newElement.key.',
      '2. If BOTH match: React preserves the existing Fiber node, reuses its DOM element, and keeps its memoizedState linked list intact.',
      '3. If key differs: React treats it as an unmount/mount cycle. It invokes unmount cleanups, destroys the old DOM element, deletes the Fiber\'s state memory, and mounts a brand-new component instance with initial state.'
    ].join('\n'),
    whenToUse: 'Use key={id} to reset forms, multimedia players, or interactive widgets when switching entity IDs.',
    whenNotToUse: 'Do not use dynamic keys if you want to preserve state across tab switches (use CSS display: none or store state in a parent context instead).',
    commonMistakes: [
      '- Declaring component definitions inside another component function. This gives the inner component a brand-new function reference on every render, causing React to treat it as a new component type and wiping state on every keystroke!'
    ].join('\n'),
    perfA11y: 'Resetting state with keys ensures form validation errors and ARIA invalid attributes from a previous user record do not linger when switching to a new record.',
    realWorld: 'Production master-detail views pass key={contact.id} to the detail pane so draft replies are never accidentally sent to the wrong customer.',
    interviewQs: [
      '**Q: How can you force a React component to reset its internal state when its props change, without using useEffect?**',
      '*Spoken Answer*: "You can force a component to reset its entire internal state by giving it a unique key prop tied to the entity ID, such as <UserProfile key={userId} userId={userId} />. In React\'s reconciliation engine, whenever an element\'s key changes between renders, React considers it a completely different component instance. It immediately unmounts the old component—discarding its entire Fiber state tree—and mounts a brand new instance with fresh initial state, completely eliminating the need for manual state-resetting useEffect hooks."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers prefer the key reset pattern over useEffect(() => setForm(initial), [id]) because the key pattern executes synchronously in a single render pass without rendering a flash of stale content.',
    revisionSummary: [
      '- Same position + same type = state preserved.',
      '- Change the key = state destroyed and reset to initial.',
      '- Use key={id} to reset forms when switching records.'
    ].join('\n')
  })
];

module.exports = {
  parts: [
    { id: 3, title: 'Part 3 — Components & Composition', sections: p3_sections },
    { id: 4, title: 'Part 4 — State & Rendering Mechanics', sections: p4_sections }
  ]
};
