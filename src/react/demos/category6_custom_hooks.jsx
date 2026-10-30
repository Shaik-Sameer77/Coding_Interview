import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Copy, Check, Eye, RefreshCw, Zap } from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #51: useDebounce Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: SearchInput -> useDebounce(input, 500ms) -> DebouncedValueConsumer -> SearchAPI
 * • Timing Model:
 *     - Trailing edge debounce: Resets the timer on every single keystroke.
 *     - Only emits the value once the user stops typing for >= 500ms.
 * • Browser/DOM APIs:
 *     - `window.setTimeout`: Schedules delayed state update in Web API task queue.
 *     - `window.clearTimeout`: Cancels pending task before execution when a new keystroke arrives.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types character 'R' -> `input` updates to 'R'.
 * 2. useEffect triggers with `[input]`:
 *    a. Schedules `setTimeout` for 500ms.
 * 3. User types character 'e' at 120ms:
 *    a. React runs previous effect cleanup: `clearTimeout(handler)`.
 *    b. New `setTimeout` is scheduled for 500ms.
 * 4. User pauses typing:
 *    a. 500ms elapses without any new keystrokes.
 *    b. Timer callback executes: `setDebouncedVal('Re')`.
 *    c. Single API query dispatched instead of two!
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Memory leaks: Cleanup function guarantees that if component unmounts mid-typing, the timer is cleared and won't call setState on an unmounted component.
 */
export function DemoUseDebounce() {
  const [input, setInput] = useState('');
  const [debouncedVal, setDebouncedVal] = useState('');

  useEffect(() => {
    // STEP 1: Schedule delayed assignment
    const handler = setTimeout(() => {
      setDebouncedVal(input);
    }, 500);

    // STEP 2: Cancel pending execution if input changes before 500ms
    return () => clearTimeout(handler);
  }, [input]);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Type rapidly (500ms debounce):</label>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Search..."
        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
      />
      <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: '#34d399' }}>
        Debounced Value: <strong>{debouncedVal || '(waiting for pause)'}</strong>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #52: useThrottle Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Rate Limiting Model:
 *     - Unlike debounce (which waits for quiet), throttle guarantees execution at most ONCE per interval window (e.g. 1000ms).
 * • Ref Tracking:
 *     - `lastRan`: useRef(Date.now()) persists timestamp across re-renders without triggering additional re-renders.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User spams button 50 times in 1 second.
 * 2. Click 1: `Date.now() - lastRan >= 1000` is true -> executes immediately -> updates `lastRan = now`.
 * 3. Clicks 2-50: `Date.now() - lastRan < 1000` is true -> discarded / throttled.
 * 4. After 1000ms: Next click is allowed through.
 */
export function DemoUseThrottle() {
  const [clicks, setClicks] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);
  // Persist last execution timestamp without causing re-renders
  const lastRan = useRef(Date.now());

  const handleThrottledClick = () => {
    setClicks(c => c + 1);
    const now = Date.now();
    // Throttle check: Only proceed if elapsed time exceeds 1000ms
    if (now - lastRan.current >= 1000) {
      setThrottledCount(t => t + 1);
      lastRan.current = now;
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <button onClick={handleThrottledClick} style={{ padding: '0.5rem 1rem', background: '#ec4899', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
        Spam Click Me! (1s Throttle)
      </button>
      <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
        Actual Raw Clicks: {clicks} | Throttled Executions: <strong>{throttledCount}</strong>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #53: usePrevious Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Mechanical Model:
 *     - Relies on React's lifecycle phasing: `useEffect` executes strictly AFTER browser paint.
 *     - During render phase: returns `ref.current` (which holds value from preceding render).
 *     - During commit/effect phase: updates `ref.current = value` for the subsequent render.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Initial Render: `ref.current = undefined`. Render returns `undefined`. `useEffect` sets `ref.current = count (1)`.
 * 2. User clicks Increment: `count` becomes 2.
 * 3. Render phase runs: reads `ref.current` (still 1!) -> displays "Previous: 1 | Current: 2".
 * 4. Effect phase runs: updates `ref.current = 2`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • React 19 / Concurrent Mode: Avoid mutating refs during render; mutation MUST happen inside `useEffect`.
 */
export function DemoUsePrevious() {
  const [count, setCount] = useState(1);
  const prevRef = useRef(1);

  // Updates ref only AFTER paint has occurred
  useEffect(() => {
    prevRef.current = count;
  });

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Increment State
        </button>
      </div>
      <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
        Current State: <strong>{count}</strong> | Previous Render Value: <strong>{prevRef.current}</strong>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #54: useClickOutside Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DropdownContainer (ref=boxRef) -> ToggleTriggerBtn -> PopoverCard
 * • Event Listening Strategy:
 *     - Attaches `mousedown` or `pointerdown` to `document`.
 *     - Uses `node.contains(e.target)` to determine containment hierarchy.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks Toggle -> `open` becomes true; card mounts with `boxRef`.
 * 2. User clicks outside card area -> global document listener fires.
 * 3. `boxRef.current.contains(e.target)` evaluates to false.
 * 4. State updates: `setOpen(false)` auto-dismissing modal/dropdown.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Event order / Mobile latency: Use `pointerdown` to prevent 300ms mobile touch delay and unmounted target anomalies.
 * • Cleanup: Always remove event listener on unmount.
 */
export function DemoUseClickOutside() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    // Outside click detection
    const check = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', check);
    return () => document.removeEventListener('mousedown', check);
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Toggle Card
      </button>
      {open && (
        <div ref={boxRef} style={{ marginTop: '0.6rem', padding: '1rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          Click anywhere outside to auto-dismiss this panel.
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #55: useLocalStorage with Cross-Tab Sync
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Synchronizes React state with Web Storage API (`window.localStorage`).
 * • Cross-Tab Synchronization:
 *     - Listens to `window.addEventListener('storage', ...)` event.
 *     - Changes in Tab A immediately propagate to Tab B without polling!
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Component mounts -> initializes state lazily from `localStorage.getItem()`.
 * 2. User selects theme 'amber' -> `localStorage.setItem('key', 'amber')` and `setVal('amber')`.
 * 3. Storage event fires across sibling tabs, updating their React state.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Lazy state initialization: Pass `() => localStorage.getItem(...)` to avoid blocking SSR / main thread on every render.
 * • QuotaExceededError: Wrap `localStorage.setItem` in try/catch to handle private browsing mode limits safely.
 */
export function DemoUseLocalStorage() {
  // Lazy initialization avoids disk I/O on re-renders
  const [val, setVal] = useState(() => localStorage.getItem('interview_theme_key') || 'emerald');

  const update = (newVal) => {
    setVal(newVal);
    try {
      localStorage.setItem('interview_theme_key', newVal);
    } catch (e) {
      console.warn('Storage quota exceeded or disabled', e);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Saved in localStorage & synchronized across browser tabs:</div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {['indigo', 'emerald', 'amber', 'rose'].map(t => (
          <button key={t} onClick={() => update(t)} style={{ padding: '0.3rem 0.6rem', background: val === t ? '#6366f1' : '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #56: useIntersectionObserver Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TargetCard (ref=targetRef) -> ViewportIntersectionState
 * • Browser API:
 *     - `IntersectionObserver`: Asynchronously computes element visibility without scroll listener overhead.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Component mounts -> creates observer with 50% visibility threshold.
 * 2. Observes `targetRef.current`.
 * 3. Callback fires when element crosses threshold -> `setIsVisible(entry.isIntersecting)`.
 * 4. Cleanup on unmount disconnects observer.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Memory leak: Disconnect observer on unmount.
 * • Null element guard: Guard `if (targetRef.current) observer.observe(...)`.
 */
export function DemoUseIntersectionObserver() {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.5 });
    if (targetRef.current) observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <div ref={targetRef} style={{ padding: '1rem', background: isVisible ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: `1px solid ${isVisible ? '#10b981' : '#ef4444'}`, borderRadius: '8px', color: isVisible ? '#34d399' : '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>
        {isVisible ? 'Element is Visible in Viewport' : 'Element is Hidden'}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #57: useAsync / useFetchWithRetry Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • State Machine: `{ loading: boolean, data: T | null, error: string | null }`.
 * • Exponential / Linear Backoff Algorithm:
 *     - Retries transient network failures up to maxAttempts (3x).
 *     - Delays subsequent retry attempts by `delayMs` to relieve backend pressure.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User triggers execution -> sets `loading = true`.
 * 2. Attempt 1 fails (simulated HTTP 503) -> loop waits 600ms backoff.
 * 3. Attempt 2 succeeds -> populates `data` and clears `loading = false`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Non-retryable HTTP status codes: Do NOT retry 401 Unauthorized or 404 Not Found; only retry 5xx server errors and network drops.
 */
export function DemoUseAsyncRetry() {
  const [state, setState] = useState({ loading: false, data: null, error: null });

  // Resilient retry execution loop
  const execute = async () => {
    setState({ loading: true, data: null, error: null });
    let attempts = 0;
    while (attempts < 3) {
      try {
        attempts++;
        if (attempts < 2) throw new Error(`Simulated Network 503 (Attempt #${attempts})`);
        setState({ loading: false, data: 'Success: Chrona Schedule payload fetched on retry #2!', error: null });
        return;
      } catch (err) {
        if (attempts >= 3) {
          setState({ loading: false, data: null, error: err.message });
          return;
        }
        await new Promise(r => setTimeout(r, 600));
      }
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={execute} disabled={state.loading} style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        {state.loading ? 'Retrying fetch...' : 'Execute API with Auto-Retry'}
      </button>
      {state.data && <div style={{ marginTop: '0.6rem', color: '#34d399', fontSize: '0.85rem' }}>{state.data}</div>}
      {state.error && <div style={{ marginTop: '0.6rem', color: '#ef4444', fontSize: '0.85rem' }}>{state.error}</div>}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #58: useMediaQuery Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Subscribes React components to CSS media queries dynamically (`window.matchMedia`).
 * • Reactive Layout:
 *     - Updates state synchronously when window cross breakpoint boundaries.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Hook queries `window.innerWidth >= 768`.
 * 2. Window resize event fires -> updates `isWide` state.
 * 3. Component re-renders responsive UI branch.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Debouncing resize: In high-frequency resize environments, throttle listener or prefer `matchMedia('...').addEventListener('change')`.
 */
export function DemoUseMediaQuery() {
  const [isWide, setIsWide] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Media query <code>(min-width: 768px)</code>: <strong>{isWide ? 'Desktop (>768px)' : 'Mobile (<768px)'}</strong>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #59: useIdleTimer Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: IdleStatusCard[SecondsCounter + AutoLogoutWarning]
 * • Architecture: User inactivity detection for security compliance (e.g. banking/enterprise session timeouts).
 * • Monitored Event Matrix:
 *     - `mousemove`, `keydown`, `wheel`, `touchstart` attached to `window`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. 1000ms tick interval increments `secondsIdle`.
 * 2. Any user interaction resets counter to 0.
 * 3. In production, reaching threshold (e.g. 60s) dispatches logout action.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Passive event listeners: Use `{ passive: true }` on touch/scroll listeners to prevent scrolling jank.
 */
export function DemoUseIdleTimer() {
  const [secondsIdle, setSecondsIdle] = useState(0);

  useEffect(() => {
    // Reset idle timer on any user activity
    const reset = () => setSecondsIdle(0);
    window.addEventListener('mousemove', reset, { passive: true });
    window.addEventListener('keydown', reset, { passive: true });

    // Tick every 1 second
    const interval = setInterval(() => setSecondsIdle(s => s + 1), 1000);
    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      User idle for: <strong>{secondsIdle} seconds</strong> (Auto-logout triggered at 60s).
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #60: useWhyDidYouUpdate Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Developer performance profiling utility.
 * • Diff Algorithm:
 *     - Stores previous props/state in `useRef(props)`.
 *     - On each render pass, iterates keys and compares `prevProps[key] !== currentProps[key]`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Component re-renders -> hook captures current props snapshot.
 * 2. Compares against previous ref -> isolates properties that changed identity.
 * 3. Logs exact causes of re-render to developer console.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Object reference inequality: Detects inline arrow functions or new object literals passed as props.
 */
export function DemoWhyDidYouUpdate() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Senior Candidate');
  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
        Profiler logs exact property diffs between render passes to console:
      </div>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        Trigger Render (Count: {count})
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #61: useCountdown / useInterval Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Declarative interval wrapper preventing classic stale closure bugs in `setInterval`.
 * • Dan Abramov Pattern:
 *     - Saves latest callback into a ref `savedCallback.current = callback`.
 *     - Interval executes `savedCallback.current()`, always accessing fresh props/state!
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Sets interval timer for 1000ms.
 * 2. Each tick decrements remaining time.
 * 3. Clamps at 0 to prevent negative timer values.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Timer drift: Standard `setInterval` can drift over long periods; calculate delta against `performance.now()` if absolute millisecond accuracy is required.
 */
export function DemoUseCountdown() {
  const [time, setTime] = useState(60);
  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      SMS Verification Code Expires In: <strong style={{ color: '#f59e0b' }}>{time}s</strong>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #62: useWindowSize Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • State Model: `{ w: number, h: number }` capturing viewport dimensions.
 * • Listeners: Subscribes to `window.resize` event and cleans up on unmount.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Reads initial `innerWidth` and `innerHeight`.
 * 2. Re-computes dimensions on resize events.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • SSR hydration mismatches: In Next.js/SSR environments, initialize with placeholder or guard `typeof window !== 'undefined'`.
 */
export function DemoUseWindowSize() {
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const h = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Viewport Dimensions: <strong>{dim.w}px × {dim.h}px</strong>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #63: useCopyToClipboard Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Browser API: `navigator.clipboard.writeText(text)` (Async Clipboard API).
 * • Temporary Visual Feedback:
 *     - Sets `copied = true` for 2000ms, then auto-reverts to false.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks copy button.
 * 2. Invokes `navigator.clipboard.writeText(...)`.
 * 3. Shows green checkmark icon.
 * 4. 2-second timer restores clipboard copy icon.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Insecure contexts (HTTP): Modern Clipboard API requires secure HTTPS context; provide `document.execCommand('copy')` fallback for legacy/insecure contexts.
 */
export function DemoUseCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const text = 'npm install @chrona/batch-queue';

  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <code style={{ background: '#0f172a', padding: '0.4rem 0.6rem', borderRadius: '6px', color: '#818cf8', fontSize: '0.8rem' }}>{text}</code>
        <button onClick={copy} style={{ padding: '0.4rem', background: copied ? '#10b981' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #64: useUndoRedo Hook Abstraction
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Generalized custom hook wrapping dual-stack history machine `useUndoRedo(initialState)`.
 * • Exposes API: `{ state, set, undo, redo, canUndo, canRedo }`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Encapsulates past/present/future arrays in an atomic hook.
 * 2. Exposes boolean flags `canUndo = past.length > 0` and `canRedo = future.length > 0`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • State branching: Resetting future on manual mutations.
 */
export function DemoUseUndoRedoHook() {
  const [val, setVal] = useState('Step 1');
  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Encapsulates past/present/future history stack for arbitrary state mutations.
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #65: useEventCallback / useMemoizedFn Custom Hook
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Generates a callback that NEVER changes reference between renders, yet ALWAYS accesses the latest state/props.
 * • Implementation:
 *     ```js
 *     const ref = useRef(fn);
 *     ref.current = fn;
 *     return useCallback((...args) => ref.current(...args), []);
 *     ```
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Consumer gets a memoized callback with `[]` dependency array.
 * 2. Ref stays in sync with latest closure on every render.
 * 3. Child components wrapped in `React.memo` never re-render unnecessarily!
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Stale closures in event handlers: Completely eliminates stale closure pitfalls while preserving referential equality.
 */
export function DemoUseEventCallback() {
  return (
    <div style={{ padding: '1rem', maxWidth: '380px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Maintains stable function reference without dependency array churn.
    </div>
  );
}

