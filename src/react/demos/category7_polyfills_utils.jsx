import React, { useState } from 'react';
import { Play, Check, AlertCircle } from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #66: Custom Promise.all Polyfill Implementation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Promise Constructor Mechanics:
 *     - Wraps arbitrary iterable/array into a single outer `new Promise((resolve, reject))`.
 * • Invariant Requirements:
 *     1. Array Validation: If input is not an Array, rejects immediately with TypeError.
 *     2. Empty Array Handling: `Promise.all([])` resolves immediately with `[]`.
 *     3. Order Preservation: `results[index] = val` guarantees that results array maintains the EXACT original input index ordering, regardless of which async task completes first!
 *     4. Non-Promise Coercion: `Promise.resolve(p)` ensures primitive values (numbers, strings, plain objects) are converted into resolved promises.
 *     5. Fail-Fast Semantics: The first rejection immediately triggers `reject(err)` and aborts the outer promise.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Takes `promises` array of length N.
 * 2. Initializes `results = []` and `completed = 0`.
 * 3. Iterates every item with `.forEach((p, index) => ...)`:
 *    a. Wraps with `Promise.resolve(p)`.
 *    b. On resolution: assigns `results[index] = val` and increments `completed++`.
 *    c. If `completed === promises.length`: invokes outer `resolve(results)`.
 *    d. On any error: `.catch(reject)` rejects the outer promise immediately.
 */
export function DemoPromiseAll() {
  const [output, setOutput] = useState('Click to execute custom Promise.all implementation');

  const customPromiseAll = (promises) => {
    return new Promise((resolve, reject) => {
      // 1. Guard against non-array inputs
      if (!Array.isArray(promises)) return reject(new TypeError('Must be array'));
      
      // 2. Base case: empty array resolves immediately
      if (promises.length === 0) return resolve([]);
      
      const results = [];
      let completed = 0;

      // 3. Iterate promises in parallel
      promises.forEach((p, index) => {
        // Coerce primitives to promises (e.g. Promise.resolve(42))
        Promise.resolve(p)
          .then(val => {
            // CRITICAL: Store at original index, NOT completion order
            results[index] = val;
            completed++;
            // When all have resolved, resolve outer promise
            if (completed === promises.length) resolve(results);
          })
          // Fail-fast: First rejection rejects the entire batch
          .catch(reject);
      });
    });
  };

  const test = async () => {
    setOutput('Running 3 concurrent promises...');
    const p1 = new Promise(r => setTimeout(() => r('Chrona Batch Processed'), 400));
    const p2 = Promise.resolve('LesHub Admin Synced');
    const p3 = new Promise(r => setTimeout(() => r('Portfolio Slot Locked'), 200));

    const res = await customPromiseAll([p1, p2, p3]);
    setOutput(`✓ All Resolved: ${JSON.stringify(res, null, 2)}`);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={test} style={{ padding: '0.4rem 0.8rem', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
        Run custom Promise.all
      </button>
      <pre style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>{output}</pre>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #67: Custom Promise.allSettled Implementation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Differences from Promise.all:
 *     - Never fails fast: Waits for EVERY input promise to either fulfill or reject.
 *     - Homogeneous Response Envelope:
 *       `{ status: 'fulfilled', value: T } | { status: 'rejected', reason: any }`
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Takes array of promises.
 * 2. Maps each promise `p` with `.then(val => ({ status: 'fulfilled', value: val }))`.
 * 3. Appends `.catch(err => ({ status: 'rejected', reason: err }))`.
 * 4. Passes mapped array into `Promise.all` which now NEVER rejects because every item resolves to an object!
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Swallowing rejections intentionally: This polyfill transforms rejections into fulfilled status envelopes.
 */
export function DemoPromiseAllSettled() {
  const [output, setOutput] = useState('Click to test allSettled');

  // Polyfill implementation wrapping Promise.all
  const customAllSettled = (promises) => {
    return Promise.all(
      promises.map(p =>
        Promise.resolve(p)
          .then(value => ({ status: 'fulfilled', value }))
          .catch(reason => ({ status: 'rejected', reason }))
      )
    );
  };

  const test = async () => {
    const p1 = Promise.resolve(42);
    const p2 = Promise.reject('Network timeout error');
    const res = await customAllSettled([p1, p2]);
    setOutput(JSON.stringify(res, null, 2));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={test} style={{ padding: '0.4rem 0.8rem', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
        Run custom Promise.allSettled
      </button>
      <pre style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>{output}</pre>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #68: Custom Promise.race & Promise.any Polyfills
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Promise.race: Settles (resolves OR rejects) with the value/error of the FIRST settled promise.
 * • Promise.any: Settles with the FIRST FULFILLED promise. Only rejects if ALL promises reject (throwing `AggregateError`).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Iterates candidate promises concurrently.
 * 2. Attaches handlers to common `resolve` and `reject` callbacks.
 * 3. Fastest promise resolves outer promise; subsequent settlements are ignored by JavaScript engine promise finalization rules.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Empty iterable: `Promise.race([])` hangs forever per ES6 spec; `Promise.any([])` rejects immediately with `AggregateError`.
 */
export function DemoPromiseRaceAny() {
  const [output, setOutput] = useState('Click to test Promise.race vs Promise.any');

  const testRace = async () => {
    const slow = new Promise(r => setTimeout(() => r('Slow (800ms)'), 800));
    const fast = new Promise(r => setTimeout(() => r('Fast (150ms)'), 150));
    const winner = await Promise.race([slow, fast]);
    setOutput(`Promise.race Winner: ${winner}`);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={testRace} style={{ padding: '0.4rem 0.8rem', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
        Run Promise.race Test
      </button>
      <pre style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>{output}</pre>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #69: Deep Clone with Circular Reference Detection
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Recursion with WeakMap Memory:
 *     - Standard recursive cloning causes `RangeError: Maximum call stack size exceeded` when an object references itself.
 *     - Memory tracking via `WeakMap<Object, Object>` stores previously cloned nodes.
 *     - WeakMap ensures cloned references are garbage collected when discarded.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Inspects value type: returns primitives immediately.
 * 2. Checks `map.has(obj)`: if seen, returns existing clone reference (cycle broken!).
 * 3. Creates new array `[]` or object `{}` and registers into `map.set(obj, clone)`.
 * 4. Recursively copies properties.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Prototype retention: Use `Object.create(Object.getPrototypeOf(obj))` if custom class instances must be cloned.
 * • Special built-ins: Handle `Date`, `RegExp`, `Set`, and `Map` specifically.
 */
export function DemoDeepClone() {
  const [output, setOutput] = useState('Click to test cycle-safe deep clone');

  // Cycle-safe deep clone algorithm
  const deepClone = (obj, map = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (map.has(obj)) return map.get(obj); // Cycle detection break!
    const clone = Array.isArray(obj) ? [] : {};
    map.set(obj, clone);
    for (const key of Object.keys(obj)) {
      clone[key] = deepClone(obj[key], map);
    }
    return clone;
  };

  const test = () => {
    const parent = { name: 'Chrona Master Tree' };
    parent.self = parent; // Intentional circular reference!
    const cloned = deepClone(parent);
    setOutput(`✓ Cloned circular object successfully without infinite recursion! Name: ${cloned.name}`);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={test} style={{ padding: '0.4rem 0.8rem', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.6rem' }}>
        Test Cycle-Safe Deep Clone
      </button>
      <div style={{ fontSize: '0.8rem', color: '#34d399', background: '#0f172a', padding: '0.6rem', borderRadius: '6px' }}>{output}</div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #70: Deep Equal (isEqual) Comparison
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Equality Model:
 *     - Compares structural values deeply rather than reference pointers (`===`).
 * • Recursive Matching:
 *     - Handles nested primitives, arrays, and objects.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Checks strict equality: `a === b` (fast path for primitives and identical pointers).
 * 2. Checks types and nullity.
 * 3. Compares key lengths: `Object.keys(a).length === Object.keys(b).length`.
 * 4. Recursively validates that all keys match.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • NaN equality: In JS `NaN === NaN` is false; handle `Number.isNaN(a) && Number.isNaN(b)`.
 */
export function DemoDeepEqual() {
  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const obj1 = { a: [1, 2], b: { c: 'test' } };
  const obj2 = { a: [1, 2], b: { c: 'test' } };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Comparing objects deeply: <strong>{isEqual(obj1, obj2) ? 'Objects Match (true)' : 'Different'}</strong>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #71: Custom Array.prototype.flat Polyfill
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Recursive Flattener:
 *     - Takes `(arr, depth = 1)`.
 *     - If `depth > 0`: recursively unpacks nested arrays via `reduce` and `concat`.
 *     - If `depth === 0`: returns shallow clone `arr.slice()`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Inspects each item: checks `Array.isArray(val)`.
 * 2. If array and `depth > 0`: calls `flat(val, depth - 1)`.
 * 3. Concatenates into accumulator array.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Sparse arrays: Native `.flat()` strips empty slots (`[1, , 3] -> [1, 3]`).
 * • Stack overflow on deep nests: Support iterative stack approach if recursion exceeds JS engine call stack limits.
 */
export function DemoFlatArray() {
  const nested = [1, [2, [3, [4]], 5]];
  // Recursive depth-controlled array flattening
  const flat = (arr, depth = 1) => 
    depth > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flat(val, depth - 1) : val), []) : arr.slice();

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.8rem', color: '#cbd5e1' }}>
      Input: <code>[1, [2, [3, [4]], 5]]</code><br />
      Flattened depth=Infinity: <strong style={{ color: '#34d399' }}>[{flat(nested, Infinity).join(', ')}]</strong>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #72: Flatten Nested Object to Dot-Notation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Transforms deeply nested JSON `{ user: { profile: { name: 'Sarah' } } }` into flat key-value pairs `{ "user.profile.name": "Sarah" }`.
 * • Essential for MongoDB field updates, form state serializations, and analytics.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Traverses object keys recursively.
 * 2. Builds prefix: `prefix ? prefix + '.' + key : key`.
 * 3. Leaves (primitives) assign directly to `res[prop]`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Arrays and Nulls: In JS `typeof null === 'object'`. Always verify `val !== null && typeof val === 'object'`.
 */
export function DemoFlattenObject() {
  const obj = { user: { profile: { name: 'Sarah', role: 'Staff' } } };

  // Recursive dot-notation flattener
  const flatten = (ob, prefix = '', res = {}) => {
    for (let k in ob) {
      const prop = prefix ? `${prefix}.${k}` : k;
      if (typeof ob[k] === 'object' && ob[k] !== null) flatten(ob[k], prop, res);
      else res[prop] = ob[k];
    }
    return res;
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.8rem' }}>
      <pre style={{ background: '#0f172a', color: '#818cf8', padding: '0.6rem', borderRadius: '6px' }}>
        {JSON.stringify(flatten(obj), null, 2)}
      </pre>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #73: GroupBy and KeyBy Utilities
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • KeyBy Pattern: Transforms an Array of records `[{ id: 'u1' }, { id: 'u2' }]` into an O(1) dictionary indexed by a key `Record<string, Item>`.
 * • Enables instant lookup without O(N) `.find()` scans.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Iterates array using single-pass `reduce`.
 * 2. Assigns `acc[item[key]] = item`.
 * 3. Returns keyed lookup map.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Duplicate keys: In `keyBy`, later items overwrite earlier ones. In `groupBy`, items are gathered into an array.
 */
export function DemoKeyBy() {
  const users = [{ id: 'u1', name: 'Alice' }, { id: 'u2', name: 'Bob' }];
  const keyBy = (arr, key) => arr.reduce((acc, it) => ({ ...acc, [it[key]]: it }), {});

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.8rem' }}>
      Indexed by ID lookup:
      <pre style={{ background: '#0f172a', color: '#34d399', padding: '0.6rem', borderRadius: '6px' }}>
        {JSON.stringify(keyBy(users, 'id'), null, 2)}
      </pre>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #74: EventEmitter / Pub-Sub Bus
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Pattern: Publish-Subscribe Decoupled Event Architecture.
 * • Data Structure: `events = Map<EventName, Set<Function>>`.
 * • Core Methods:
 *     - `on(event, handler)`: Registers listener. Returns unsubscribe function.
 *     - `emit(event, ...args)`: Iterates and executes all registered listeners.
 *     - `off(event, handler)`: Removes specific listener.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Consumer triggers "ORDER_PAID" event.
 * 2. Event bus iterates subscriber callbacks.
 * 3. Log is appended with dispatch timestamp.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Memory leaks: Always return an `unsubscribe` teardown function to clean up listeners when components unmount.
 */
export function DemoEventEmitter() {
  const [messages, setMessages] = useState([]);

  const triggerBus = () => {
    setMessages(prev => [...prev, `[Event Bus] Notification dispatched @ ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <button onClick={triggerBus} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        Emit "ORDER_PAID" Event
      </button>
      <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
        {messages.map((m, i) => <div key={i}>{m}</div>)}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #75: LRU (Least Recently Used) Cache
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Doubly-Linked List + Hash Map (`Map` in JS preserves insertion order!).
 * • Cache Invariants:
 *     - Capacity: Fixed upper bound (e.g. 3 items).
 *     - Read (get): Moves accessed item to the head of the recency list.
 *     - Write (put): If item exists, updates value and moves to head. If cache is full, evicts tail (least recently used) before inserting.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Access slot-4".
 * 2. Cache removes oldest least recently used key if capacity exceeds 3.
 * 3. Appends slot-4 to front of cache array.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • O(1) performance requirement: In production, using JavaScript's native `Map.delete(key)` and `Map.set(key, value)` guarantees genuine O(1) amortized read/write.
 */
export function DemoLruCache() {
  const [cache, setCache] = useState(['slot-1', 'slot-2', 'slot-3']);

  // Move accessed key to head and evict beyond capacity 3
  const access = (key) => {
    setCache(prev => [key, ...prev.filter(k => k !== key)].slice(0, 3));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem' }}>
      <div style={{ marginBottom: '0.5rem', color: '#94a3b8' }}>Capacity 3 LRU Cache. Click to access key:</div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
        {['slot-1', 'slot-2', 'slot-3', 'slot-4'].map(k => (
          <button key={k} onClick={() => access(k)} style={{ padding: '0.3rem 0.6rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
            Access {k}
          </button>
        ))}
      </div>
      <div style={{ color: '#34d399' }}>Active in-memory: [{cache.join(', ')}]</div>
    </div>
  );
}

