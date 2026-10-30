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
// PART 5: Events, Synthetic Events & Forms
// ==========================================
const p5_sections = [
  createSection('5.1', '27. SyntheticEvents & Modern Event Delegation Mechanics', 1, {
    whatItIs: 'A SyntheticEvent is React’s cross-browser wrapper around the browser’s native DOM event. It provides an identical API (stopPropagation, preventDefault, target) across all browsers while optimizing performance via event delegation.',
    whyItExists: 'Different browsers historically had inconsistent event properties and naming. Furthermore, attaching individual event listeners to thousands of DOM elements consumes massive memory.',
    problemSolved: 'Normalizes event handling across browsers and drastically reduces memory footprint by delegating events to the root DOM container.',
    prerequisites: 'DOM Event Propagation (Capturing Phase, Target Phase, Bubbling Phase).',
    syntax: [
      '// SyntheticEvent Handler:',
      'const handleClick = (e) => {',
      '  e.preventDefault();         // Prevents native browser action',
      '  e.stopPropagation();        // Stops bubbling in React\'s virtual tree',
      '  console.log(e.target);      // DOM element that triggered event',
      '  console.log(e.nativeEvent); // Underlying native browser Event',
      '};'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export default function EventPropagationDemo() {
  const handleParentClick = () => {
    console.log('Parent container clicked');
  };

  const handleChildClick = (e) => {
    e.stopPropagation();
    console.log('Child button clicked');
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    console.log('Default navigation prevented');
  };

  return (
    <div onClick={handleParentClick} style={{ padding: '1.5rem', background: '#0f172a', border: '1px solid #334155' }}>
      <button onClick={handleChildClick}>Stop Propagation Button</button>
      <a href="https://react.dev" onClick={handleLinkClick} style={{ marginLeft: '1rem', color: '#38bdf8' }}>
        Prevent Default Link
      </a>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4-6: Parent click listener.',
      '- Line 8-12: Child click handler calls e.stopPropagation(), preventing handleParentClick from executing.',
      '- Line 14-17: Link click handler calls e.preventDefault(), preventing page navigation while allowing custom JS logic.'
    ].join('\n'),
    internalFlow: [
      'Event Delegation in React 17+:',
      '1. When you write <button onClick={...}>, React does NOT attach an event listener to the <button> DOM node.',
      '2. Instead, ReactDOM.createRoot(rootNode) attaches a single event listener for each event type to the root container node (<div id="root">).',
      '3. When a user clicks, the native event bubbles to the root container.',
      '4. React intercepts it, creates a SyntheticEvent object, and replays the bubble sequence upward through the Fiber tree, invoking matching handlers.'
    ].join('\n'),
    whenToUse: 'In all React interactive event handlers (onClick, onChange, onSubmit, onKeyDown).',
    whenNotToUse: 'Do not use SyntheticEvents for global window events like resize or scroll on the document; attach native listeners via useEffect with proper cleanup.',
    commonMistakes: [
      '- Believing e.stopPropagation() stops native browser listeners attached directly to document (it only stops React\'s synthetic bubbling tree).',
      '- Remembering event pooling (e.persist()): In React 17+, event pooling was completely removed; SyntheticEvents can now be accessed asynchronously without calling e.persist().'
    ].join('\n'),
    perfA11y: 'Event delegation keeps memory usage constant O(1) regardless of whether a virtual list renders 10 buttons or 10,000 buttons.',
    realWorld: 'Production data tables with 500 rows and multiple action buttons rely on event delegation to maintain fast scroll performance.',
    interviewQs: [
      '**Q: Where does React attach event listeners under the hood, and how did this change in React 17?**',
      '*Spoken Answer*: "React does not attach event listeners to individual DOM elements. Instead, it uses event delegation. In React 16 and earlier, all events were attached to the top-level document object. In React 17 and later, React attaches event listeners to the root DOM container where the application is mounted (e.g. <div id=\'root\'>). This architectural shift solved major bugs when embedding multiple React versions or micro-frontends on the same page, preventing an inner React tree\'s e.stopPropagation() from interfering with an outer application."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers audit third-party micro-frontend integrations: if a legacy library calls event.stopPropagation() on native DOM nodes before the event reaches the React root container, React handlers will never fire.',
    revisionSummary: [
      '- React wraps native events in SyntheticEvent.',
      '- Events are delegated to the root container (#root), NOT individual DOM elements.',
      '- Event pooling was removed in React 17 (async access is safe).'
    ].join('\n')
  }),

  createSection('5.2', '28. Controlled vs Uncontrolled Inputs & Form Elements', 2, {
    whatItIs: 'Controlled inputs derive their current value strictly from React state (value={state} + onChange={setState}). Uncontrolled inputs store their value in the browser’s internal DOM tree and are queried via useRef or native form submission.',
    whyItExists: 'HTML form elements inherently maintain their own internal state. React provides controlled inputs to make the React component the single source of truth.',
    problemSolved: 'Enables instant field validation, dynamic masking, disabling submit buttons based on input validity, and enforcing input format constraints.',
    prerequisites: 'useState, useRef, and native HTML input element attributes.',
    syntax: [
      '// Controlled Component (React drives value):',
      '<input value={name} onChange={(e) => setName(e.target.value)} />',
      '',
      '// Uncontrolled Component (DOM drives value):',
      '<input ref={inputRef} defaultValue="Default Text" />'
    ].join('\n'),
    minimalExample: `
import React, { useState, useRef } from 'react';

export default function InputComparison() {
  const [controlledVal, setControlledVal] = useState('');
  const uncontrolledRef = useRef(null);

  const handleControlledChange = (e) => {
    setControlledVal(e.target.value.toUpperCase());
  };

  const handleUncontrolledSubmit = (e) => {
    e.preventDefault();
    alert(\`Uncontrolled Value: \${uncontrolledRef.current.value}\`);
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', gap: '2rem' }}>
      <div>
        <h4>Controlled (Uppercase Enforced)</h4>
        <input 
          value={controlledVal} 
          onChange={handleControlledChange} 
          placeholder="Type lowercase..."
        />
        <p>State: {controlledVal}</p>
      </div>

      <form onSubmit={handleUncontrolledSubmit}>
        <h4>Uncontrolled (DOM Managed)</h4>
        <input 
          ref={uncontrolledRef} 
          defaultValue="Initial Note" 
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Read DOM</button>
      </form>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 5: Controlled state holds the input value.',
      '- Line 8: Uncontrolled ref targets the DOM node directly.',
      '- Line 12: Controlled handler forces all characters to uppercase before saving to state.',
      '- Line 18: Uncontrolled form only reads the value when the user submits, avoiding re-renders on keystrokes.'
    ].join('\n'),
    internalFlow: [
      '1. In a Controlled input:',
      '   - User presses a key -> Browser fires native input event.',
      '   - React\'s onChange intercepts event and calls setControlledVal.',
      '   - Re-render occurs -> React sets input.value = controlledVal on the DOM element.',
      '2. In an Uncontrolled input:',
      '   - User presses a key -> Browser DOM updates its own value internally.',
      '   - Zero React re-renders occur until ref.current.value is queried imperatively.'
    ].join('\n'),
    whenToUse: [
      '- Controlled: In 90% of React applications, especially for forms requiring live validation, character counters, conditional field enabling, or custom input masks.',
      '- Uncontrolled: For massive forms with hundreds of inputs (to avoid keystroke re-renders), integrating non-React UI widgets, or handling <input type="file" />.'
    ].join('\n'),
    whenNotToUse: 'Do not switch a component between uncontrolled and controlled during its lifecycle (triggers React warning: "A component is changing an uncontrolled input to be controlled").',
    commonMistakes: [
      '- Initializing controlled state with undefined or null. Always initialize with an empty string: useState("").',
      '- Attempting to set value on a file input (<input type="file" /> is read-only for security reasons).'
    ].join('\n'),
    perfA11y: 'Controlled inputs allow immediate screen reader announcements of validation errors via aria-invalid={hasError} and aria-errormessage="err-id".',
    realWorld: 'High-performance form libraries like React Hook Form leverage the uncontrolled pattern internally via refs to achieve zero-re-render typing while exposing a clean controlled API to consumers.',
    interviewQs: [
      '**Q: What is the difference between a controlled and an uncontrolled component in React?**',
      '*Spoken Answer*: "A controlled component has its value driven entirely by React state: you supply a value prop and an onChange handler, making React the single source of truth on every keystroke. An uncontrolled component lets the browser DOM maintain its own internal state, and you pull the current value on demand using a useRef or FormData. Controlled inputs are preferred for immediate validation, input masking, and dynamic UI feedback, while uncontrolled inputs are optimal for file uploads and avoiding re-renders on heavy forms."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects choose between Controlled (standard useState) and Uncontrolled (React Hook Form with ref subscriptions) based on performance budgets and form complexity.',
    revisionSummary: [
      '- Controlled: value + onChange (React state is the source of truth).',
      '- Uncontrolled: defaultValue + ref (DOM maintains state).',
      '- File inputs (type="file") must always be uncontrolled.'
    ].join('\n')
  }),

  createSection('5.3', '29. Production Form Architecture: Validation, Errors & Dynamic Fields', 3, {
    whatItIs: 'A structured architectural pattern for managing production-grade forms: handling multi-field state objects, tracking touched/dirty states, executing client-side validation schemas, displaying accessible error messages, and managing asynchronous submission lifecycles.',
    whyItExists: 'Managing separate useState hooks for 15 form fields creates unmaintainable boilerplate. Production forms require structured objects and decoupled validation rules.',
    problemSolved: 'Prevents premature error display (showing errors before the user finishes typing), handles multi-field dependencies, and prevents duplicate submissions.',
    prerequisites: 'Controlled inputs, object spreading, and regex or schema validation.',
    syntax: [
      '// Standard Form State Shape:',
      'const [formData, setFormData] = useState({ email: "", password: "", role: "developer" });',
      'const [errors, setErrors] = useState({});',
      'const [touched, setTouched] = useState({});',
      'const [isSubmitting, setIsSubmitting] = useState(false);'
    ].join('\n'),
    minimalExample: `
import React, { useState } from 'react';

export default function ProductionRegistrationForm() {
  const [values, setValues] = useState({ email: '', password: '', acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);

  const validate = (formValues) => {
    const errs = {};
    if (!formValues.email) {
      errs.email = 'Email address is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formValues.email)) {
      errs.email = 'Invalid email address format';
    }

    if (!formValues.password) {
      errs.password = 'Password is required';
    } else if (formValues.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (!formValues.acceptTerms) {
      errs.acceptTerms = 'You must accept the terms of service';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ email: true, password: true, acceptTerms: true });

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await new Promise(res => setTimeout(res, 1000));
        setServerSuccess(true);
      } catch {
        setErrors({ form: 'Network error occurred. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (serverSuccess) {
    return <div className="success-banner">Registration successful! Welcome aboard.</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 400, padding: '1rem', border: '1px solid #334155' }}>
      <h3>Create Engineer Account</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="reg-email">Email:</label>
        <input 
          id="reg-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.email && errors.email)}
          style={{ width: '100%', padding: '0.4rem', borderColor: touched.email && errors.email ? '#ef4444' : '#64748b' }}
        />
        {touched.email && errors.email && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="reg-pass">Password:</label>
        <input 
          id="reg-pass"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.password && errors.password)}
          style={{ width: '100%', padding: '0.4rem', borderColor: touched.password && errors.password ? '#ef4444' : '#64748b' }}
        />
        {touched.password && errors.password && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem' }}>
        {isSubmitting ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
}
`,
    lineByLine: [
      '- Line 4-8: Coordinates unified state for values, errors, touched, and submission state.',
      '- Line 10-27: Pure validation function returning error map.',
      '- Line 29-35: Generic handleChange handles text, email, and checkbox elements via dynamic object keys [name].',
      '- Line 37-41: handleBlur marks the field as touched, ensuring errors only appear after user interaction.',
      '- Line 63: aria-invalid ensures screen readers announce validation errors.'
    ].join('\n'),
    internalFlow: [
      '1. On keystroke: handleChange updates values.',
      '2. On blur: handleBlur sets touched[field] = true and runs validation.',
      '3. On submit: handleSubmit marks ALL fields as touched and prevents submission if Object.keys(errors).length > 0.',
      '4. While submitting, the submit button is disabled to prevent duplicate concurrent network submissions.'
    ].join('\n'),
    whenToUse: 'For enterprise forms with validation, password rules, and multi-field dependencies.',
    whenNotToUse: 'For massive 50-field dynamic forms, hand-written form logic becomes unwieldy; use React Hook Form paired with Zod.',
    commonMistakes: [
      '- Displaying error messages immediately on initial mount before the user has touched the field. Always guard with touched[field] && errors[field].',
      '- Omitting noValidate on the <form> tag, causing conflicting browser native validation popups.'
    ].join('\n'),
    perfA11y: 'Pairing aria-invalid with an associated error label satisfies WCAG 2.1 Error Identification standards.',
    realWorld: 'Production onboarding workflows validate inputs on blur and submit asynchronously.',
    interviewQs: [
      '**Q: Why is tracking the "touched" state critical in professional form validation?**',
      '*Spoken Answer*: "Tracking the \'touched\' state is essential for good user experience. If you validate form inputs purely based on state, the user is greeted with aggressive red error messages the moment the empty form mounts, or while they are still in the middle of typing their first letter. By tracking whether a user has interacted with and blurred out of a field (touched[field] === true), you delay showing validation errors until the user has finished their initial input attempt."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers encapsulate this entire state machine into a reusable custom hook (useForm({ initialValues, validate, onSubmit })) or standardize on React Hook Form.',
    revisionSummary: [
      '- Maintain unified values, errors, and touched state objects.',
      '- Validate on Blur, not immediately on mount.',
      '- Disable submit buttons during in-flight network requests.'
    ].join('\n')
  }),

  createSection('5.4', '30. Form Libraries & Enterprise Form Engineering (React Hook Form vs Formik)', 4, {
    whatItIs: 'An architectural evaluation of enterprise form management libraries, contrasting uncontrolled subscription-based libraries (React Hook Form) against legacy controlled models (Formik).',
    whyItExists: 'As forms grow to dozens of dynamic fields, controlled useState forms trigger component-wide re-renders on every single keystroke, causing noticeable typing latency on mobile devices.',
    problemSolved: 'Eliminates keystroke re-render overhead and integrates declarative schema validation (Zod).',
    prerequisites: 'Uncontrolled inputs, refs, and schema validation libraries (Zod).',
    syntax: [
      '// React Hook Form Minimal Pattern:',
      'import { useForm } from "react-hook-form";',
      'import { zodResolver } from "@hookform/resolvers/zod";',
      'import { z } from "zod";',
      '',
      'const schema = z.object({',
      '  email: z.string().email(),',
      '  age: z.number().min(18)',
      '});',
      '',
      'const { register, handleSubmit, formState: { errors } } = useForm({',
      '  resolver: zodResolver(schema)',
      '});'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export function ReactHookFormComparison() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h4>Formik vs React Hook Form Architecture</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#1e293b', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Criteria</th>
            <th style={{ padding: '0.5rem' }}>Formik (Legacy)</th>
            <th style={{ padding: '0.5rem' }}>React Hook Form (Modern Standard)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>Rendering Model</td>
            <td style={{ padding: '0.5rem' }}>Controlled (Re-renders on every keystroke)</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>Uncontrolled (Zero re-renders during typing)</td>
          </tr>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>Bundle Size</td>
            <td style={{ padding: '0.5rem' }}>~13kB gzipped</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>~8kB gzipped</td>
          </tr>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>Schema Integration</td>
            <td style={{ padding: '0.5rem' }}>Yup (default)</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>Zod / Yup / Joi via resolvers</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7-26: Detailed comparison matrix highlighting why React Hook Form succeeded Formik as the enterprise default.',
      '- Emphasizes uncontrolled ref subscriptions to isolate re-renders.'
    ].join('\n'),
    internalFlow: [
      'React Hook Form Isolated Re-render Engine:',
      '1. When <input {...register("username")} /> is executed, RHF binds a ref to the DOM node.',
      '2. Keystrokes update the native DOM element directly.',
      '3. RHF uses an internal observer to track validity without triggering React component re-renders.',
      '4. Only the specific field or error message subscribed via useWatch or formState.errors re-renders when validation fails!'
    ].join('\n'),
    whenToUse: 'Use React Hook Form + Zod for enterprise forms with complex validation, dynamic array fields (useFieldArray), or high performance requirements.',
    whenNotToUse: 'For simple forms with 1-3 fields (e.g. a newsletter signup input), native useState is simpler and requires zero third-party dependencies.',
    commonMistakes: [
      '- Installing both Formik and React Hook Form in the same repository.',
      '- Manually writing regex validations instead of leveraging TypeScript-first schemas (Zod).'
    ].join('\n'),
    perfA11y: 'React Hook Form automatically focuses the first invalid form field upon submission failure via setFocus(), drastically improving keyboard accessibility.',
    realWorld: 'Enterprise SaaS backends standardize on sharing Zod schemas between Express/NestJS backend validators and React Hook Form frontend resolvers.',
    interviewQs: [
      '**Q: Why does React Hook Form offer superior performance compared to Formik?**',
      '*Spoken Answer*: "React Hook Form offers superior performance because it relies on uncontrolled inputs via native DOM refs rather than controlled React state. Formik is controlled; every single keystroke triggers a component-wide re-render, running validation across the entire form. In large forms, this causes noticeable typing lag. React Hook Form isolates re-renders: typing into an input does not re-render the parent component at all, and only the specific error component re-renders when a validation boundary is crossed."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects establish monorepo shared packages (@company/schemas) where Zod DTOs are defined once and consumed by both React Hook Form on the frontend and Express/Fastify request middleware on the backend.',
    revisionSummary: [
      '- React Hook Form is the modern standard (uncontrolled via refs).',
      '- Zero re-renders on keystrokes.',
      '- Pair with Zod for end-to-end TypeScript validation.'
    ].join('\n')
  })
];

// ==========================================
// PART 6: React Hooks Complete Coverage
// ==========================================
const p6_sections = [
  createSection('6.1', '31. The Rules of Hooks & Fiber Linked List Mechanics', 1, {
    whatItIs: 'Hooks are special JavaScript functions (starting with use) that let function components tap into React state and lifecycle features. They must adhere strictly to the Rules of Hooks: 1) Only call hooks at the top level; 2) Only call hooks from React function components or custom hooks.',
    whyItExists: 'React does not inspect the names of your state variables or track them in an internal dictionary. Instead, React tracks hooks using a sequential linked list on each component’s Fiber node.',
    problemSolved: 'Allows stateful logic reuse without class components, render props, or higher-order component (HOC) wrapper hell.',
    prerequisites: 'Singly linked lists, JavaScript pointers, and Fiber reconciliation.',
    syntax: [
      '// RULE 1: Top-Level Only!',
      'function GoodComponent() {',
      '  const [val, setVal] = useState(0); // VALID',
      '  useEffect(() => {}, []);            // VALID',
      '}',
      '',
      '// FATAL ERROR (Conditional Hook Call):',
      'function BrokenComponent({ condition }) {',
      '  if (condition) {',
      '    const [val, setVal] = useState(0); // ILLEGAL!',
      '  }',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export default function HookOrderDemo({ isPremiumUser }) {
  const [name, setName] = useState('Guest');
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    console.log(\`User \${name} has \${credits} credits\`);
  }, [name, credits]);

  return (
    <div>
      <p>{name} - {credits} credits</p>
      <button onClick={() => setCredits(c => c + 10)}>Add Credits</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 4: Hook 1 allocated in Fiber linked list.',
      '- Line 5: Hook 2 linked to Hook 1 via hook1.next = hook2.',
      '- Line 7: Hook 3 linked to Hook 2 via hook2.next = hook3.',
      '- Because hooks are at the top level, every render executes them in the identical 1 -> 2 -> 3 sequence.'
    ].join('\n'),
    internalFlow: [
      'The Fiber Singly Linked List:',
      '1. Every component Fiber has a memoizedState pointer.',
      '2. During initial mount: creates hook1, sets fiber.memoizedState = hook1; creates hook2, sets hook1.next = hook2; creates hook3, sets hook2.next = hook3.',
      '3. During re-render: React walks the hook linked list in exact order, reading values from each hook node sequentially.',
      '4. Why Conditions Break React: If an if condition skips Hook 2, the second hook called reads Hook 2\'s memory slot! React attempts to use a number as an Effect, corrupting the runtime and throwing an exception.'
    ].join('\n'),
    whenToUse: 'In every React component utilizing hooks.',
    whenNotToUse: 'Never inside conditionals (if), loops (for, while), or event handlers.',
    commonMistakes: [
      '- Placing hooks after an early return: if (!user) return null; const [data, setData] = useState().'
    ].join('\n'),
    perfA11y: 'The linked list design makes hook execution extremely fast (O(1) pointer traversal), with zero dictionary hash-lookup overhead.',
    realWorld: 'All modern React codebases install the official ESLint plugin: eslint-plugin-react-hooks with rules: { "react-hooks/rules-of-hooks": "error" } in CI pipelines.',
    interviewQs: [
      '**Q: Why cannot React hooks be called inside loops or conditional statements?**',
      '*Spoken Answer*: "React does not track hooks by name; it tracks them using a singly linked list stored on the component\'s Fiber node. On every re-render, React relies on the exact sequential order of hook calls to match current state values to their corresponding hooks. If a hook is called inside a condition or loop, the order or total number of hook calls can change between renders. This causes the internal pointer to misalign—for example, treating a state number as an Effect function—corrupting component state and triggering a fatal React crash."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers ensure that if state or effects are conditional, the condition is evaluated INSIDE the hook, not around it (e.g. useEffect(() => { if (!enabled) return; ... }, [enabled])).',
    revisionSummary: [
      '- Only call hooks at top level.',
      '- Only call from React functions or custom hooks.',
      '- React tracks hooks using a sequential linked list on the Fiber node.'
    ].join('\n')
  }),

  createSection('6.2', '32. Core State & Effect Hooks (useState, useReducer, useEffect, useLayoutEffect)', 2, {
    whatItIs: 'The primary state and lifecycle hooks in React: useState for simple local state, useReducer for complex state transitions, useEffect for asynchronous synchronization, and useLayoutEffect for synchronous DOM measurements before the browser paints.',
    whyItExists: 'Separates state primitives based on complexity and separates passive background effects from critical visual measurements that must block the paint to prevent flickering.',
    problemSolved: 'Eliminates layout shift (CLS) during DOM measurements and organizes multi-action state machines.',
    prerequisites: 'Event loop phases, browser layout/paint pipeline, and reducer functions.',
    syntax: [
      '// Core Hooks Catalog:',
      'const [state, setState] = useState(initial);',
      'const [state, dispatch] = useReducer(reducer, initial);',
      'useEffect(() => { /* runs asynchronously AFTER browser paint */ }, [deps]);',
      'useLayoutEffect(() => { /* runs synchronously BEFORE browser paint */ }, [deps]);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useRef, useLayoutEffect } from 'react';

export default function TooltipPlacementDemo() {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { height } = tooltipRef.current.getBoundingClientRect();
      setTooltipHeight(height);
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <button>Hover Anchor</button>
      <div 
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: 100 - tooltipHeight,
          background: '#0284c7',
          color: '#ffffff',
          padding: '0.4rem 0.8rem',
          borderRadius: '4px'
        }}
      >
        Measured Tooltip (Height: {tooltipHeight}px)
      </div>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7-13: useLayoutEffect executes immediately after DOM mutations but before the browser paints pixels to the screen.',
      '- Line 9: Measures the exact DOM bounding rect.',
      '- Line 10: Calling setTooltipHeight triggers a synchronous re-render before paint, eliminating visual jitter!'
    ].join('\n'),
    internalFlow: [
      'useEffect vs useLayoutEffect Lifecycle:',
      '1. Render Phase: React calls component function, builds Fiber tree.',
      '2. Commit Phase - Mutation: React applies DOM mutations.',
      '3. Commit Phase - Layout: React synchronously executes all useLayoutEffect cleanups and callbacks before paint.',
      '4. Browser Paint: The browser paints pixels to the physical display screen.',
      '5. Passive Phase: React asynchronously executes useEffect cleanups and callbacks on next event loop tick.'
    ].join('\n'),
    whenToUse: [
      '- useState: For 90% of local component state.',
      '- useReducer: When state transitions involve multiple sub-values.',
      '- useEffect: For data fetching, subscriptions, timers, logging.',
      '- useLayoutEffect: Strictly for DOM measurements before paint.'
    ].join('\n'),
    whenNotToUse: 'Do not use useLayoutEffect for data fetching or general side effects; blocking the paint degrades perceived user performance and breaks SSR.',
    commonMistakes: [
      '- Using useEffect to measure DOM nodes before positioning them, causing a visible visual jump or flicker on screen.'
    ].join('\n'),
    perfA11y: 'useLayoutEffect prevents Cumulative Layout Shift (CLS), improving Google Core Web Vitals.',
    realWorld: 'Popovers and floating menus (Popper.js, Floating UI, Radix UI) use useLayoutEffect to compute boundary collisions before displaying dialogs.',
    interviewQs: [
      '**Q: What is the fundamental difference between useEffect and useLayoutEffect?**',
      '*Spoken Answer*: "The fundamental difference is timing relative to the browser\'s paint cycle. useEffect is asynchronous and non-blocking: it runs on an event loop tick after React has mutated the DOM and the browser has painted the screen. useLayoutEffect is synchronous: it executes immediately after DOM mutations but before the browser paints pixels. It blocks the visual paint so you can measure DOM dimensions or synchronously adjust styles, preventing visible UI flickering."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers create a safe isomorphic layout effect (typeof window !== "undefined" ? useLayoutEffect : useEffect) to prevent SSR hydration warnings.',
    revisionSummary: [
      '- useEffect runs AFTER browser paint (non-blocking).',
      '- useLayoutEffect runs BEFORE browser paint (synchronous, blocks paint).',
      '- Use useLayoutEffect ONLY for DOM measurements to prevent visual flickering.'
    ].join('\n')
  }),

  createSection('6.3', '33. Identity & Performance Hooks (useRef, useMemo, useCallback)', 3, {
    whatItIs: 'Hooks governing referential identity and memoization: useRef provides a persistent mutable container that does not trigger re-renders; useMemo caches the result of an expensive calculation; useCallback caches a function reference across renders.',
    whyItExists: 'In JavaScript, objects and functions are compared by reference, not value. On every render, all functions and objects declared in a component receive fresh memory references, breaking shallow comparison in memoized child components (React.memo).',
    problemSolved: 'Prevents unnecessary re-renders of expensive child components and caches computationally heavy operations.',
    prerequisites: 'Referential equality in JS (Object.is), closures, and memoization principles.',
    syntax: [
      '// 1. Mutable Ref Container:',
      'const timerRef = useRef(null); // { current: null }',
      '',
      '// 2. Value Memoization:',
      'const cachedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
      '',
      '// 3. Callback Memoization:',
      'const cachedFn = useCallback((id) => { performAction(id); }, [deps]);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useMemo, useCallback, memo } from 'react';

const ExpensiveItemRow = memo(function ExpensiveItemRow({ item, onDelete }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #1e293b' }}>
      <span>{item.name} - \${item.price}</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

export default function InventoryDashboard({ rawInventory }) {
  const [filterText, setFilterText] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);

  const filteredItems = useMemo(() => {
    return rawInventory.filter(item => 
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [rawInventory, filterText]);

  const handleDelete = useCallback((id) => {
    console.log('Deleting item ID:', id);
  }, []);

  return (
    <div style={{ background: darkTheme ? '#020617' : '#ffffff', padding: '1rem' }}>
      <button onClick={() => setDarkTheme(t => !t)}>Toggle Theme</button>
      <input 
        value={filterText} 
        onChange={(e) => setFilterText(e.target.value)} 
        placeholder="Search inventory..." 
      />
      <div>
        {filteredItems.map(item => (
          <ExpensiveItemRow key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 3: Child row is wrapped in memo(). It only re-renders if item or onDelete reference changes.',
      '- Line 17-21: useMemo caches the filtered array; toggling darkTheme does NOT recalculate the filter.',
      '- Line 23-25: useCallback retains the exact same handleDelete memory reference; toggling darkTheme does NOT cause the child rows to re-render!'
    ].join('\n'),
    internalFlow: [
      'useMemo and useCallback Fiber Storage:',
      '1. When useMemo(fn, deps) is called, React checks: areHookInputsEqual(deps, prevHook.memoizedState[1]).',
      '2. If dependencies match: React returns prevHook.memoizedState[0] directly without executing fn.',
      '3. If dependencies differ: React executes fn(), stores the new return value, and updates the hook\'s cached dependencies.',
      '4. useCallback(fn, deps) is syntactically equivalent to: useMemo(() => fn, deps).'
    ].join('\n'),
    whenToUse: [
      '- Wrap functions in useCallback when passing them as props to components wrapped in React.memo, or when including them in a useEffect dependency array.',
      '- Wrap calculations in useMemo when processing massive arrays (> 1,000 items) or expensive transforms.'
    ].join('\n'),
    whenNotToUse: 'Do not wrap every function and calculation in useCallback and useMemo! Memoization carries CPU and memory overhead; premature memoization can degrade performance.',
    commonMistakes: [
      '- Using useCallback without wrapping the child component in React.memo (the child still re-renders whenever the parent re-renders!).',
      '- Omitting variables used inside the callback from the dependency array, causing stale closure bugs.'
    ].join('\n'),
    perfA11y: 'Targeted memoization preserves smooth input responsiveness and keeps scroll performance locked at 60fps.',
    realWorld: 'Data grids require stable callback and column configuration references to prevent tearing down column headers on parent state changes.',
    interviewQs: [
      '**Q: Why does wrapping a function in useCallback provide zero performance benefit if the child component is not wrapped in React.memo?**',
      '*Spoken Answer*: "By default in React, when a parent component re-renders, all of its child components re-render recursively, regardless of whether their props changed. useCallback only guarantees that the function\'s memory reference remains stable. If the child component is not wrapped in React.memo, React will re-render the child anyway during the parent\'s render pass. Therefore, using useCallback without React.memo incurs the memory and CPU cost of dependency checking with absolutely zero reduction in component re-renders."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers evaluate the upcoming React Compiler: once adopted, the compiler automates fine-grained memoization across the entire component tree, making manual useMemo and useCallback boilerplate obsolete.',
    revisionSummary: [
      '- useRef: Mutable container, does not trigger re-renders.',
      '- useMemo: Caches calculated values.',
      '- useCallback: Caches function references.',
      '- Only beneficial when paired with React.memo or effect dependencies.'
    ].join('\n')
  }),

  createSection('6.4', '34. Context & Accessibility Hooks (useContext, useId, useImperativeHandle, useDebugValue)', 4, {
    whatItIs: 'Specialized React hooks for cross-component dependency injection (useContext), generating accessible unique IDs across server and client (useId), customizing imperative exposed handles on refs (useImperativeHandle), and debugging custom hooks in React DevTools (useDebugValue).',
    whyItExists: 'Addresses accessibility standards (WCAG compliance requires unique matching id attributes that must not clash during SSR hydration) and exposes controlled imperative boundaries without leaking raw DOM elements.',
    problemSolved: 'Eliminates hydration mismatch ID collisions and provides safe encapsulation boundaries for custom widgets.',
    prerequisites: 'WAI-ARIA specifications (aria-describedby, aria-labelledby), SSR hydration, and ref forwarding.',
    syntax: [
      '// Accessible Unique ID Hook (React 18+):',
      'const passwordHintId = useId();',
      '',
      '// Imperative Handle Hook:',
      'useImperativeHandle(ref, () => ({',
      '  focus: () => inputRef.current.focus(),',
      '  reset: () => { /* custom logic */ }',
      '}));'
    ].join('\n'),
    minimalExample: `
import React, { useId, useRef, useImperativeHandle, forwardRef } from 'react';

export const ValidatedTextInput = forwardRef(function ValidatedTextInput(
  { label, hint, error }, 
  ref
) {
  const inputRef = useRef(null);
  const id = useId();
  const hintId = \`\${id}-hint\`;
  const errorId = \`\${id}-error\`;

  useImperativeHandle(ref, () => ({
    focusAndSelect: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    clear: () => {
      if (inputRef.current) inputRef.current.value = '';
    }
  }));

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600 }}>{label}</label>
      <input 
        id={id}
        ref={inputRef}
        aria-describedby={\`\${hint ? hintId : ''} \${error ? errorId : ''}\`.trim()}
        aria-invalid={Boolean(error)}
        style={{ padding: '0.4rem', border: error ? '1px solid #ef4444' : '1px solid #64748b' }}
      />
      {hint && <p id={hintId} style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hint}</p>}
      {error && <p id={errorId} role="alert" style={{ fontSize: '0.75rem', color: '#ef4444' }}>{error}</p>}
    </div>
  );
});
`,
    lineByLine: [
      '- Line 8: useId() generates an opaque string unique across the component tree.',
      '- Line 9-10: Uses prefixing to generate coordinated hintId and errorId without calling useId multiple times.',
      '- Line 12-20: useImperativeHandle exposes custom methods instead of exposing the raw HTML input DOM node.',
      '- Line 26: aria-describedby links the input to both hint and error text for screen readers.'
    ].join('\n'),
    internalFlow: [
      'useId Mechanics in React 18:',
      '1. In SSR, naive auto-increment counters fail because client components may hydrate out-of-order or stream asynchronously, producing hydration mismatch warnings.',
      '2. useId derives its ID from the component\'s hierarchical position in the Fiber tree.',
      '3. Because the Fiber tree position is identical on both server and client, the generated ID string is guaranteed to match 100%, with zero network serialization overhead.'
    ].join('\n'),
    whenToUse: [
      '- useId: Always for linking HTML <label> and <input> elements, or associating aria-describedby text.',
      '- useImperativeHandle: When building custom audio/video players, canvas graphics, or complex modal focus traps.'
    ].join('\n'),
    whenNotToUse: 'Do not use useId to generate keys for mapping lists (key={useId()} is an anti-pattern; keys must be derived from the data entity).',
    commonMistakes: [
      '- Calling useId 5 times in a single component to generate 5 IDs (call it once and derive sub-ids: `${id}-name`, `${id}-email`).'
    ].join('\n'),
    perfA11y: 'useId is the cornerstone of modern React accessibility, guaranteeing WCAG compliance for form controls and floating dialogs.',
    realWorld: 'Production component design systems (MUI, Headless UI, Radix) use useId across all form elements to ensure zero hydration warnings in Next.js.',
    interviewQs: [
      '**Q: Why was useId introduced in React 18 instead of using a simple incrementing counter or Math.random()?**',
      '*Spoken Answer*: "A simple counter or Math.random() fails in modern Server-Side Rendered (SSR) applications. If the server renders markup using random numbers or a global counter, the numbers will not match the client during hydration when components stream or mount in different orders, triggering Hydration Mismatch errors. useId generates a deterministic identifier derived from the component\'s exact positional path in the Fiber tree. Because the tree structure is identical on server and client, the IDs match perfectly without any server-to-client data serialization."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers leverage useImperativeHandle to enforce strict encapsulation, preventing parent components from directly tampering with internal DOM styles or event listeners.',
    revisionSummary: [
      '- useId: Generates SSR-safe accessible unique IDs.',
      '- Never use useId for list key props.',
      '- useImperativeHandle: Restricts and customizes ref methods.'
    ].join('\n')
  }),

  createSection('6.5', '35. Concurrent & React 18/19 Hooks (useTransition, useDeferredValue, useSyncExternalStore, useOptimistic, useActionState, use)', 5, {
    whatItIs: 'Modern concurrent and action-oriented hooks introduced in React 18 and 19 to enable non-blocking UI rendering, external store synchronization without tearing, optimistic mutations, and async action state management.',
    whyItExists: 'Traditional state updates are synchronous and can block the main thread. Furthermore, subscribing to non-React stores in concurrent rendering led to "tearing" (visual inconsistencies where parts of the UI render with different store versions). React 19 adds native form and action abstractions.',
    problemSolved: 'Eliminates UI freezing during heavy renders, eliminates tearing in concurrent mode, and standardizes asynchronous form mutations.',
    prerequisites: 'Concurrent rendering, lane priorities, optimistic UI patterns, and Promises.',
    syntax: [
      '// React 18 Concurrent Hooks:',
      'const [isPending, startTransition] = useTransition();',
      'const deferredQuery = useDeferredValue(query);',
      'const state = useSyncExternalStore(subscribe, getSnapshot);',
      '',
      '// React 19 Action & Async Hooks:',
      'const [state, formAction, isPending] = useActionState(actionFn, initialState);',
      'const [optimisticState, setOptimistic] = useOptimistic(state, updateFn);',
      'const data = use(promiseOrContext);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useOptimistic, useTransition } from 'react';

export default function MessageThread({ messages, onSendMessage }) {
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (currentMessages, newPendingText) => [
      ...currentMessages,
      { id: 'temp-id', text: newPendingText, sending: true }
    ]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('messageText');
    e.target.reset();

    startTransition(async () => {
      setOptimisticMessages(text);
      await onSendMessage(text);
    });
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Real-time Messages</h3>
      <ul>
        {optimisticMessages.map((msg, idx) => (
          <li key={msg.id || idx} style={{ opacity: msg.sending ? 0.6 : 1 }}>
            {msg.text} {msg.sending && <small>(Sending...)</small>}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="messageText" placeholder="Say something..." required />
        <button type="submit" disabled={isPending}>Send</button>
      </form>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7: useOptimistic accepts the canonical messages state and an updater function.',
      '- Line 20: Calls setOptimisticMessages(text) inside a transition. The UI instantly displays the new message with sending: true.',
      '- Line 22: Awaits the network request. Once the parent updates messages with server confirmation, React automatically drops the optimistic state!'
    ].join('\n'),
    internalFlow: [
      'Tearing & useSyncExternalStore:',
      '1. In Concurrent React, rendering is interruptible. React can pause mid-tree, yield to browser I/O, and resume.',
      '2. If an external store updates while React is paused, child components might read the new store value while parent components already rendered with the old store value -> Tearing.',
      '3. useSyncExternalStore guarantees consistency by synchronously checking if the store snapshot changed during the render; if it did, React discards the interrupted tree and restarts rendering cleanly.'
    ].join('\n'),
    whenToUse: [
      '- useTransition / useDeferredValue: When filtering large datasets or switching complex tabs.',
      '- useSyncExternalStore: When building custom store subscriptions or reading browser APIs.',
      '- useOptimistic: For likes, chat messages, upvotes, and cart additions.'
    ].join('\n'),
    whenNotToUse: 'Do not use useTransition for simple, fast state updates or controlled text inputs.',
    commonMistakes: [
      '- Calling use(promise) conditionally in earlier React versions (use() is unique because it CAN be called inside conditions and loops in React 19!).',
      '- Forgetting that useOptimistic must be wrapped in a transition or form action.'
    ].join('\n'),
    perfA11y: 'Optimistic UI makes applications feel instantaneous to users on high-latency mobile networks, boosting perceived speed.',
    realWorld: 'Modern social media apps use optimistic updates for instant tactile user feedback.',
    interviewQs: [
      '**Q: What problem does useSyncExternalStore solve in React 18\'s concurrent mode?**',
      '*Spoken Answer*: "useSyncExternalStore solves the problem of \'tearing\' in concurrent rendering. In concurrent mode, React can pause rendering a component tree, yield to user input, and resume later. If an external store—like Redux, Zustand, or a browser API—mutates during that pause, components rendered before the pause will reflect the old state, while components rendered after the pause will reflect the new state, resulting in a fractured, inconsistent UI. useSyncExternalStore forces React to re-evaluate the snapshot synchronously, guaranteeing tear-free consistency across the entire tree."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers migrating state libraries to React 18/19 audit custom subscription hooks to ensure all external data reads use useSyncExternalStore instead of raw useEffect subscriptions.',
    revisionSummary: [
      '- useTransition: Marks state updates as non-blocking.',
      '- useDeferredValue: Defers re-rendering for an individual value.',
      '- useSyncExternalStore: Prevents tearing in external stores.',
      '- useOptimistic: Instant UI updates during async mutations.'
    ].join('\n')
  }),

  createSection('6.6', '36. Custom Hooks Design & Composition', 6, {
    whatItIs: 'A custom hook is a JavaScript function whose name starts with use and that can call other React hooks. They are the primary mechanism in modern React for sharing stateful logic between components.',
    whyItExists: 'In older React, sharing logic required Higher-Order Components (HOCs) or Render Props, which caused "wrapper hell" (components nested 15 levels deep in DevTools) and prop collision bugs.',
    problemSolved: 'Enables clean extraction and composition of stateful logic (fetching, timers, window dimensions, local storage) without altering component hierarchy.',
    prerequisites: 'Rules of Hooks, closures, and TypeScript generic functions.',
    syntax: [
      '// Custom Hook Contract:',
      'function useToggle(initialValue = false) {',
      '  const [value, setValue] = useState(initialValue);',
      '  const toggle = useCallback(() => setValue(v => !v), []);',
      '  return [value, toggle];',
      '}'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return dimensions;
}

export function ResponsiveBanner() {
  const { width } = useWindowDimensions();

  return (
    <div style={{ padding: '1rem', background: '#0f172a', border: '1px solid #334155' }}>
      <h4>Viewport Width: {width}px</h4>
      <p>Layout Mode: {width < 768 ? '📱 Mobile' : '💻 Desktop'}</p>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 3: Function name starts with use (useWindowDimensions), signaling the React linter to enforce the Rules of Hooks.',
      '- Line 4-7: Lazy initializes dimensions state with server-safe fallback.',
      '- Line 9-26: Encapsulates native event listener and debounce cleanup logic.',
      '- Line 28: Returns pure data. Consumers simply call the hook and get reactive updates!'
    ].join('\n'),
    internalFlow: [
      '1. When ResponsiveBanner calls useWindowDimensions(), React allocates the hook\'s internal useState and useEffect into the component\'s Fiber linked list.',
      '2. The custom hook does NOT create a separate Fiber node; its hooks live directly inside the host component\'s Fiber!',
      '3. Multiple components calling useWindowDimensions() get completely isolated, independent state instances.'
    ].join('\n'),
    whenToUse: 'Whenever stateful logic is reused across multiple components (fetching, form management, media queries, local storage synchronization).',
    whenNotToUse: 'Do not create custom hooks for pure calculations that do not use any React hooks; write standard JavaScript utility functions instead.',
    commonMistakes: [
      '- Expecting two components calling the same custom hook to share state (each call creates an isolated state instance; for shared global state, pair with Context or Zustand).',
      '- Forgetting to prefix the function name with use (disables ESLint hook validation).'
    ].join('\n'),
    perfA11y: 'Debouncing event listeners inside custom hooks prevents high-frequency re-render floods during rapid browser window resizing.',
    realWorld: 'Modern frontend ecosystems provide hundreds of production-tested hooks for sensors, UI, and async tasks.',
    interviewQs: [
      '**Q: Do two components that use the same custom hook share state?**',
      '*Spoken Answer*: "No, custom hooks do not share state. Custom hooks are a mechanism for sharing stateful logic, not state itself. Each time a component calls a custom hook, React allocates a fresh, independent set of hooks inside that specific component\'s Fiber node. If two components call useCounter(), each component maintains its own independent counter state. To share actual state across components, the custom hook must read from a shared source, such as React Context, Redux, or Zustand."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers test custom hooks in isolation using @testing-library/react\'s renderHook() utility, verifying state transitions and unmount cleanups without rendering actual DOM components.',
    revisionSummary: [
      '- Custom hooks must start with use.',
      '- Shares stateful logic, NOT state instances.',
      '- Hooks execute within the host component\'s Fiber node.'
    ].join('\n')
  })
];

// ==========================================
// PART 7: useEffect Deep-Dive & Synchronization
// ==========================================
const p7_sections = [
  createSection('7.1', '37. What is an Effect? Synchronization vs Lifecycle Thinking', 1, {
    whatItIs: 'An Effect in React (useEffect) is an "escape hatch" that lets you synchronize your React component with an external system outside of React\'s control: browser APIs, network sockets, third-party non-React widgets, timers, or analytics logging.',
    whyItExists: 'In class components, developers thought in terms of lifecycle milestones (componentDidMount, componentDidUpdate, componentWillUnmount). This split related code across 3 separate methods. useEffect unifies setup and teardown around state synchronization: "Keep this system in sync with these props and state."',
    problemSolved: 'Eliminates fragmented lifecycle code and prevents memory leaks by pairing setup directly with its cleanup function.',
    prerequisites: 'Pure rendering principles, side-effects, and JavaScript event loop asynchronous execution.',
    syntax: [
      '// Standard useEffect:',
      'useEffect(() => {',
      '  // 1. Setup code (runs after paint)',
      '  const connection = createChatConnection(roomId);',
      '  connection.connect();',
      '',
      '  // 2. Cleanup code (runs on unmount or before next effect run)',
      '  return () => {',
      '    connection.disconnect();',
      '  };',
      '}, [roomId]); // 3. Dependencies list'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export default function DocumentTitleSynchronizer() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.title = unreadCount > 0 
      ? \`(\${unreadCount}) New Notifications | Chrona\`
      : 'Chrona Dashboard';

    return () => {
      document.title = 'Chrona Dashboard';
    };
  }, [unreadCount]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Unread Alerts: {unreadCount}</h3>
      <button onClick={() => setUnreadCount(c => c + 1)}>Simulate Alert</button>
      <button onClick={() => setUnreadCount(0)}>Clear</button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 6: useEffect declares synchronization with browser document.title.',
      '- Line 7-9: Synchronizes the external title with React\'s unreadCount state.',
      '- Line 11-13: Cleanup function restores the base title when the component unmounts.',
      '- Line 14: Dependency array [unreadCount] ensures the effect only executes when the count actually changes.'
    ].join('\n'),
    internalFlow: [
      '1. Render Phase: Component renders, returning JSX. React collects effect tags.',
      '2. Commit Phase: React mutates the real DOM to match the JSX.',
      '3. Paint: The browser paints the pixels to the screen.',
      '4. Passive Effect Phase: React queues a post-paint task. React runs the cleanup from the previous render (if any), and then invokes the new effect callback.',
      '5. React deliberately executes effects asynchronously after the paint so network calls or heavy DOM writes do not block the user interface.'
    ].join('\n'),
    whenToUse: 'Strictly for synchronizing with systems outside React: subscribing to WebSocket channels, registering document event listeners, synchronizing document title, initializing third-party map widgets.',
    whenNotToUse: [
      '- Do not use useEffect to transform or filter data (use Derived State).',
      '- Do not use useEffect to handle user submit clicks (use Event Handlers).',
      '- Do not use useEffect to reset form state when props change (use the key prop).'
    ].join('\n'),
    commonMistakes: [
      '- The "Effect for Everything" anti-pattern: treating useEffect as a general-purpose reactive watch mechanism. This leads to cascading renders, race conditions, and infinite loops.'
    ].join('\n'),
    perfA11y: 'Effects run asynchronously after paint, ensuring screen readers receive instant visual feedback without being delayed by background side effects.',
    realWorld: 'Production chat applications use useEffect to subscribe to room-specific WebSocket events, cleaning up the socket subscription whenever the active channel changes.',
    interviewQs: [
      '**Q: What is the primary difference between thinking in lifecycles (componentDidMount) and thinking in Effects (useEffect)?**',
      '*Spoken Answer*: "Lifecycle thinking is imperative and time-based: it asks \'What code should run when the component mounts, updates, or unmounts?\' This often scatters related logic across different lifecycle methods. Effect thinking is declarative and synchronization-based: it asks \'How do I synchronize this component with an external system for any given state?\' In useEffect, you declare a setup action and its paired cleanup action in a single place, and React guarantees that the external system remains synchronized whenever dependencies change, regardless of how many times the component renders."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers audit codebases for unnecessary useEffect calls. The official React documentation states that more than half of all Effects in production apps are anti-patterns that should be refactored into derived state or event handlers.',
    revisionSummary: [
      '- Effects synchronize with EXTERNAL systems.',
      '- Do not use for calculating derived state.',
      '- Runs AFTER browser paint (non-blocking).'
    ].join('\n')
  }),

  createSection('7.2', '38. Dependency Array Rules, Comparison & Referential Equality', 2, {
    whatItIs: 'The second argument to useEffect: an array of values that React compares across renders using Object.is() to decide whether the effect needs to re-run.',
    whyItExists: 'Without a dependency array, an Effect runs after every single render, which typically causes infinite loops if the Effect updates state. The dependency array tells React: "Only re-run this setup if one of these exact values changed."',
    problemSolved: 'Prevents infinite re-render loops and controls when external synchronization executes.',
    prerequisites: 'Referential equality (Object.is), closures, and ESLint rule exhaustive-deps.',
    syntax: [
      '// 1. No Dependency Array (DANGEROUS): Runs after EVERY render!',
      'useEffect(() => { ... });',
      '',
      '// 2. Empty Array []: Runs ONCE on mount, cleanup on unmount',
      'useEffect(() => { ... }, []);',
      '',
      '// 3. With Dependencies: Runs on mount AND when any dep changes',
      'useEffect(() => { ... }, [roomId, token]);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export default function DependencyEqualityDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const options = { threshold: 10 };

  useEffect(() => {
    console.log('Effect executed!');
  }, [options]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Typing triggers re-render..." 
        style={{ marginLeft: '1rem' }}
      />
    </div>
  );
}
`,
    lineByLine: [
      '- Line 8: options object declared inside component body. Every render allocates a new object reference in memory.',
      '- Line 10-12: useEffect lists [options] as dependency.',
      '- Line 12: React compares Object.is(oldOptions, newOptions). Because memory addresses differ, the check returns false.',
      '- Result: Typing into the input re-runs the Effect on every keystroke!',
      '- Fix: Move options outside the component, or wrap it in useMemo, or pass primitive options.threshold.'
    ].join('\n'),
    internalFlow: [
      'Dependency Comparison Algorithm:',
      '1. On each render, React compares current dependencies with previous dependencies from the Fiber node:',
      '   for (let i = 0; i < prevDeps.length; i++) { if (!Object.is(prevDeps[i], nextDeps[i])) return false; }.',
      '2. Primitives (numbers, strings, booleans) compare by value.',
      '3. Objects, arrays, and functions compare by memory address reference.',
      '4. If ANY dependency fails Object.is(), React schedules the effect\'s cleanup and re-execution.'
    ].join('\n'),
    whenToUse: 'Always pass a dependency array to every useEffect.',
    whenNotToUse: 'Never omit the dependency array unless you intentionally want an Effect to run after every single frame paint (extremely rare).',
    commonMistakes: [
      '- Suppressing the linter: writing // eslint-disable-next-line react-hooks/exhaustive-deps. This causes stale closures where the Effect reads frozen, outdated state from a previous render!',
      '- Passing object or function references directly in the dependency array without memoization.'
    ].join('\n'),
    perfA11y: 'Accurate dependency arrays prevent redundant network requests and socket reconnections, preserving mobile device battery life and network bandwidth.',
    realWorld: 'Production SDK integrations extract primitive API keys into dependencies ([apiKey]) rather than passing config objects.',
    interviewQs: [
      '**Q: Why is it dangerous to disable the react-hooks/exhaustive-deps ESLint rule?**',
      '*Spoken Answer*: "Disabling the exhaustive-deps rule is dangerous because it leads to stale closures and subtle race conditions. When you omit a variable from the dependency array, your Effect\'s closure remains permanently bound to the value captured during an older render pass. If the user updates that state, the Effect continues to execute with the stale, obsolete data, leading to incorrect calculations, outdated network requests, and bugs that are notoriously difficult to reproduce in production."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers never disable exhaustive-deps. If a dependency causes an infinite loop, they solve the root cause: by lifting the object outside the component, using primitive dependencies, or leveraging functional state updates (setCount(c => c + 1)).',
    revisionSummary: [
      '- React compares dependencies using Object.is().',
      '- Primitives compare by value; objects/functions compare by reference.',
      '- NEVER disable exhaustive-deps; fix the dependency structure.'
    ].join('\n')
  }),

  createSection('7.3', '39. Cleanup Functions, Timers & Resource Teardown', 3, {
    whatItIs: 'The cleanup function is the optional callback returned from useEffect. React executes this function before running the effect again, and when the component unmounts from the DOM.',
    whyItExists: 'Side effects that establish ongoing processes (intervals, subscriptions, event listeners, WebSocket connections) continue running in background memory if not explicitly terminated, causing severe memory leaks and state updates on unmounted components.',
    problemSolved: 'Prevents memory leaks, dangling network connections, and unhandled Promise rejection exceptions.',
    prerequisites: 'Timers (setInterval, clearInterval), event listeners, and component unmount lifecycle.',
    syntax: [
      'useEffect(() => {',
      '  // Setup:',
      '  const intervalId = setInterval(tick, 1000);',
      '',
      '  // Cleanup Function:',
      '  return () => {',
      '    clearInterval(intervalId); // Teardown!',
      '  };',
      '}, [dependencies]);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export default function ResilientTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('Timer resource cleaned up.');
    };
  }, [isActive]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>Elapsed Time: {seconds}s</h3>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'} Timer
      </button>
      <button onClick={() => { setIsActive(false); setSeconds(0); }} style={{ marginLeft: '0.5rem' }}>
        Reset
      </button>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 8: Guard clause: if timer is paused, returns early without setting up an interval.',
      '- Line 10-12: Sets up an interval updating seconds via a functional updater.',
      '- Line 14-17: Returns a cleanup function that calls clearInterval(intervalId).',
      '- When the user clicks "Pause", isActive changes to false. React FIRST executes the cleanup function, then runs the effect again.'
    ].join('\n'),
    internalFlow: [
      'Strict Mode Double Invocation (React 18/19):',
      '1. In development mode with <React.StrictMode>, React mounts every component, immediately unmounts it, and remounts it again: Setup -> Cleanup -> Setup.',
      '2. This intentional "stress test" verifies that your cleanup function completely undoes the setup.',
      '3. If an effect adds an event listener but fails to remove it in cleanup, the listener will be added twice, immediately revealing the memory leak in development!'
    ].join('\n'),
    whenToUse: 'Whenever an Effect sets up: setInterval, setTimeout, addEventListener, WebSocket connections, Firebase/Supabase real-time subscriptions, or audio/video players.',
    whenNotToUse: 'Cleanups are unnecessary for simple fire-and-forget logging or single analytics pageview calls.',
    commonMistakes: [
      '- Setting up an interval without returning a cleanup function.',
      '- Calling setState inside the cleanup function.'
    ].join('\n'),
    perfA11y: 'Proper resource teardown prevents CPU starvation on background tabs and mobile devices.',
    realWorld: 'Production media players release camera and microphone hardware tracks inside useEffect cleanup functions.',
    interviewQs: [
      '**Q: Why does React 18 Strict Mode intentionally run effects twice on initial mount in development?**',
      '*Spoken Answer*: "React 18 Strict Mode mounts, unmounts, and remounts components in development to enforce resilient Effect lifecycles. In modern React features like Fast Refresh, offscreen caching, and Concurrent Transitions, components can be mounted and unmounted multiple times while preserving state. By running the sequence: \'Setup -> Cleanup -> Setup\' immediately upon initial mount, React exposes memory leaks and missing cleanup functions instantly during local development before they cause memory leaks in production."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers ensure all asynchronous operations (including fetch requests) are coupled with native cleanup primitives like AbortController.',
    revisionSummary: [
      '- Always return a cleanup function for ongoing resources.',
      '- Strict Mode runs Setup -> Cleanup -> Setup in development.',
      '- Cleanup runs: 1) Before the effect re-runs, and 2) When component unmounts.'
    ].join('\n')
  }),

  createSection('7.4', '40. Asynchronous Effects, Race Conditions & AbortController', 4, {
    whatItIs: 'Handling asynchronous operations inside useEffect, preventing race conditions where out-of-order network responses overwrite newer data, and using the browser’s native AbortController to cancel in-flight HTTP requests.',
    whyItExists: 'Passing an async function directly to useEffect is illegal because async functions return a Promise, whereas React expects an Effect to return either nothing or a synchronous cleanup function. Furthermore, rapid user interactions cause race conditions if slow older requests resolve after fast newer requests.',
    problemSolved: 'Eliminates race conditions, cancels abandoned network requests, and prevents memory leaks from unmounted component updates.',
    prerequisites: 'Promises, async/await, AbortController API, and network latency dynamics.',
    syntax: [
      '// ILLEGAL SYNTAX (Async Effect):',
      'useEffect(async () => { ... }); // ERROR! Returns a Promise, not a cleanup!',
      '',
      '// LEGAL SYNTAX (Inner Async Function + AbortController):',
      'useEffect(() => {',
      '  const controller = new AbortController();',
      '',
      '  async function fetchData() {',
      '    try {',
      '      const res = await fetch(url, { signal: controller.signal });',
      '      const data = await res.json();',
      '      setData(data);',
      '    } catch (err) {',
      '      if (err.name !== "AbortError") setError(err);',
      '    }',
      '  }',
      '',
      '  fetchData();',
      '  return () => controller.abort();',
      '}, [url]);'
    ].join('\n'),
    minimalExample: `
import React, { useState, useEffect } from 'react';

export default function UserProfileViewer({ userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function loadUser() {
      try {
        const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error('Failed to load user profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      controller.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading profile #{userId}...</div>;
  if (error) return <div role="alert" style={{ color: '#ef4444' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h3>{profile?.name}</h3>
      <p>Email: {profile?.email}</p>
      <p>Company: {profile?.company?.name}</p>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 9: Instantiates new AbortController().',
      '- Line 16: Passes controller.signal to the fetch() options.',
      '- Line 22-25: Catches AbortError and safely ignores it, as an aborted request is an expected cleanup action.',
      '- Line 35-37: Cleanup function calls controller.abort(). If the user rapidly switches from User 1 to User 2, User 1\'s network request is cancelled immediately!'
    ].join('\n'),
    internalFlow: [
      'The Race Condition Bug Explained:',
      '1. User clicks User 1 (Request 1 fires, takes 3000ms due to slow server).',
      '2. User quickly clicks User 2 (Request 2 fires, takes 200ms).',
      '3. Request 2 completes first at t = 200ms: UI displays User 2.',
      '4. Request 1 finally completes at t = 3000ms: Without AbortController, Request 1 calls setProfile(user1), overwriting User 2\'s data!',
      '5. The UI now displays User 1\'s details even though the user selected User 2! This is a classic Race Condition.',
      '6. controller.abort() terminates Request 1 at the browser network layer, eliminating the race condition completely.'
    ].join('\n'),
    whenToUse: 'In all data fetching implementations written inside useEffect.',
    whenNotToUse: 'Do not write hand-crafted AbortController fetching logic for every component in production enterprise apps; use TanStack Query or RTK Query, which handle cancellation, caching, and race conditions automatically.',
    commonMistakes: [
      '- Making the useEffect callback itself async (useEffect(async () => ...)).',
      '- Logging an error to the user when err.name === "AbortError".'
    ].join('\n'),
    perfA11y: 'Canceling abandoned in-flight requests frees up the browser\'s HTTP connection pool for high-priority user actions.',
    realWorld: 'Search-as-you-type autocomplete inputs cancel previous keystroke requests using AbortController to prevent stale search results from displaying.',
    interviewQs: [
      '**Q: Why cannot the callback function passed to useEffect be declared as async, and how do you handle asynchronous work correctly?**',
      '*Spoken Answer*: "The callback function passed to useEffect cannot be declared as async because an async function inherently returns a JavaScript Promise. React expects the return value of an Effect callback to be either undefined or a synchronous cleanup function to be executed before the next render. If you return a Promise, React has no way to invoke cleanup methods. To handle asynchronous work correctly, declare an internal async function inside the Effect body and invoke it synchronously, returning an AbortController.abort() cleanup callback."'
    ].join('\n'),
    seniorConsiderations: 'Senior engineers mandate TanStack Query or SWR for client-side data fetching, as writing robust hand-crafted useEffect fetch logic with deduplication, caching, and retry handling is notoriously error-prone.',
    revisionSummary: [
      '- Never pass an async function directly to useEffect.',
      '- Declare the async function INSIDE the effect.',
      '- Use AbortController to cancel in-flight requests.',
      '- Ignore err.name === "AbortError" in catch blocks.'
    ].join('\n')
  }),

  createSection('7.5', '41. Data Fetching Architecture: Hand-Written Effects vs Modern Query Libraries', 5, {
    whatItIs: 'An architectural evaluation contrasting hand-written data fetching inside useEffect against dedicated server-state management libraries (TanStack Query / SWR / RTK Query).',
    whyItExists: 'For years, developers wrote useEffect with fetch, useState(loading), and useState(error) for every API endpoint. This pattern suffers from "Network Waterfalls", zero caching, complex refetching logic, and race conditions.',
    problemSolved: 'Replaces hundreds of lines of boilerplate with declarative server-state caching, automatic background revalidation, and optimistic updates.',
    prerequisites: 'HTTP caching headers, Stale-While-Revalidate (SWR) cache strategy, and asynchronous state lifecycles.',
    syntax: [
      '// Hand-written Boilerplate (30+ lines per endpoint):',
      'const [data, setData] = useState(null);',
      'const [isLoading, setIsLoading] = useState(true);',
      'const [error, setError] = useState(null);',
      'useEffect(() => { ... }, []);',
      '',
      '// TanStack Query Pattern (1 clean line!):',
      'const { data, isLoading, isError, error, refetch } = useQuery({',
      '  queryKey: ["users", userId],',
      '  queryFn: () => fetchUser(userId)',
      '});'
    ].join('\n'),
    minimalExample: `
import React from 'react';

export function DataFetchingComparison() {
  return (
    <div style={{ padding: '1rem', border: '1px solid #334155' }}>
      <h4>useEffect Fetching vs Modern Query Libraries</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#1e293b', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Feature</th>
            <th style={{ padding: '0.5rem' }}>Hand-Written useEffect</th>
            <th style={{ padding: '0.5rem' }}>TanStack Query / SWR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>In-Memory Caching</td>
            <td style={{ padding: '0.5rem', color: '#ef4444' }}>None (Re-fetches on every mount)</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>Automatic global cache by queryKey</td>
          </tr>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>Deduplication</td>
            <td style={{ padding: '0.5rem', color: '#ef4444' }}>None (3 components = 3 requests)</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>Deduplicates parallel requests</td>
          </tr>
          <tr>
            <td style={{ padding: '0.5rem', fontWeight: 700 }}>Race Conditions</td>
            <td style={{ padding: '0.5rem', color: '#ef4444' }}>Requires manual AbortController</td>
            <td style={{ padding: '0.5rem', color: '#10b981' }}>Handled automatically</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
`,
    lineByLine: [
      '- Line 7-26: Detailed comparison matrix highlighting the engineering limitations of hand-crafted useEffect data fetching.',
      '- Demonstrates why server-state management should be decoupled from client UI components.'
    ].join('\n'),
    internalFlow: [
      'Stale-While-Revalidate (SWR) Cycle:',
      '1. Component mounts: TanStack Query checks cache for ["users", 42].',
      '2. Cache hit: Returns cached data synchronously -> zero loading spinner! User sees data instantly.',
      '3. In background: Fires an asynchronous network request to fetch the latest server state.',
      '4. When fresh data arrives, it silently updates the cache and re-renders the component only if data changed.',
      '5. If the user tabs away and returns, the window focus event automatically triggers a background revalidation.'
    ].join('\n'),
    whenToUse: 'Use TanStack Query, SWR, or RTK Query for 100% of server-state data fetching in production applications.',
    whenNotToUse: 'Hand-written useEffect fetching is acceptable only for small code sandboxes, learning exercises, or zero-dependency micro-widgets.',
    commonMistakes: [
      '- Storing server API responses in Redux or global client state.',
      '- Writing hand-crafted polling intervals using setInterval inside useEffect instead of configuring refetchInterval in TanStack Query.'
    ].join('\n'),
    perfA11y: 'Automatic caching and instant cache-hit rendering eliminate jarring loading layout shifts (CLS), improving user satisfaction.',
    realWorld: 'Production platforms power all table queries, infinite scrolls, and mutations via TanStack Query.',
    interviewQs: [
      '**Q: Why does the modern React community discourage using useEffect for data fetching?**',
      '*Spoken Answer*: "The React team discourages using useEffect for data fetching in production because hand-written Effects do not handle caching, deduplication, or race conditions automatically. When multiple components require the same data, Effects trigger duplicate network requests and cause network waterfalls where child components wait for parents to finish fetching before starting their own requests. Dedicated query libraries like TanStack Query or SWR solve this by treating server state as a shared cache with built-in Stale-While-Revalidate, automatic background refetching, and request deduplication."'
    ].join('\n'),
    seniorConsiderations: 'Senior architects establish clear architectural boundaries: Server State belongs in TanStack Query; Global Client State belongs in Zustand or Redux Toolkit; Local Component State belongs in useState.',
    revisionSummary: [
      '- useEffect fetching lacks caching, deduplication, and retry logic.',
      '- Modern apps use TanStack Query or SWR.',
      '- SWR pattern: Serve cached data instantly -> revalidate in background.'
    ].join('\n')
  })
];

module.exports = {
  parts: [
    { id: 5, title: 'Part 5 — Events, Synthetic Events & Forms', sections: p5_sections },
    { id: 6, title: 'Part 6 — React Hooks Complete Coverage', sections: p6_sections },
    { id: 7, title: 'Part 7 — useEffect Deep-Dive & Synchronization', sections: p7_sections }
  ]
};
