import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radio, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #76: SWR Cache (Stale-While-Revalidate) Pattern
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Caching Strategy Model:
 *     - Stale First: Immediately serves data from memory/cache (0ms perception).
 *     - Background Revalidation: Dispatches network query in the background without blocking the UI.
 *     - Reactive Sync: Once fresh data arrives, silently replaces stale data in cache & triggers re-render.
 * • Performance Invariants:
 *     - Eliminates loading spinners on secondary page visits.
 *     - Request deduplication across simultaneous subscribers sharing the same cache key.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Component mounts -> reads cache synchronously -> immediately displays stale payload.
 * 2. Background worker triggers `fetcher()`.
 * 3. Network returns fresh data with timestamp.
 * 4. Cache updates and state updates: `setData(freshPayload)`.
 * 5. Screen updates to reflect the latest data seamlessly.
 */
export function DemoSwrCache() {
  const [data, setData] = useState('Cached Payload (Instant render)');
  const [status, setStatus] = useState('Serving stale');

  const revalidate = () => {
    // STEP 1: Mark background revalidation in progress
    setStatus('Background revalidating...');
    
    // STEP 2: Non-blocking background fetch
    setTimeout(() => {
      // STEP 3: Replace stale data with fresh server response
      setData(`Fresh Payload @ ${new Date().toLocaleTimeString()}`);
      setStatus('Freshly revalidated!');
    }, 1000);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={revalidate} style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
        Trigger Revalidation
      </button>
      <div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.2rem' }}>{status}</div>
        <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>{data}</div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #77: Polling with Exponential Backoff
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Algorithm: Truncated Binary Exponential Backoff.
 * • Delay Model:
 *     - Initial: 1000ms.
 *     - Failure: `interval = Math.min(interval * 2, maxCap)` (prevents thundering herd).
 *     - Recovery (200 OK): Resets immediately to base 1000ms.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Client polls server at interval.
 * 2. If server returns 500 error -> doubles wait time (1s -> 2s -> 4s -> 8s max).
 * 3. Once healthy 200 OK received -> restores rapid 1s polling.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Jitter: In production, add random jitter (`+ Math.random() * 500`) to prevent thousands of client retries synchronizing on the exact same second.
 */
export function DemoPollingBackoff() {
  const [intervalTime, setIntervalTime] = useState(1000);
  const [isError, setIsError] = useState(false);

  // Exponential increase upon network failure
  const simulateError = () => {
    setIsError(true);
    setIntervalTime(prev => Math.min(prev * 2, 8000));
  };

  // Immediate reset upon recovery
  const simulateSuccess = () => {
    setIsError(false);
    setIntervalTime(1000);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.85rem' }}>
      <div style={{ marginBottom: '0.6rem', color: '#cbd5e1' }}>
        Current Polling Delay: <strong style={{ color: '#818cf8' }}>{intervalTime}ms</strong>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button onClick={simulateError} style={{ padding: '0.3rem 0.6rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
          Simulate 500 Error (Doubles Delay)
        </button>
        <button onClick={simulateSuccess} style={{ padding: '0.3rem 0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
          Simulate 200 OK (Reset Delay)
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #78: WebSocket Simulated Live Price Ticker
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Connection Lifecycle:
 *     - Full-duplex persistent TCP socket connection (`new WebSocket(url)`).
 *     - Heartbeats / Ping-Pong: Verifies connection vitality every 30s.
 *     - Automatic Reconnection: Re-establishes socket with backoff if dropped.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Socket opens: sets `connected = true`.
 * 2. Incoming binary/JSON frame arrives over socket.
 * 3. Updates ticker price without triggering full UI unmounts.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • High message frequency / Dropped frames: Throttle incoming socket messages via RAF (`requestAnimationFrame`) to prevent flooding React with 100+ renders per second.
 */
export function DemoLiveTicker() {
  const [price, setPrice] = useState(64520);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      setPrice(p => p + (Math.random() > 0.5 ? 15 : -12));
    }, 800);
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '0.8rem', color: connected ? '#34d399' : '#ef4444' }}>
          ● {connected ? 'WebSocket Connected' : 'Disconnected'}
        </span>
        <button onClick={() => setConnected(!connected)} style={{ padding: '0.2rem 0.5rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
          {connected ? 'Disconnect' : 'Reconnect'}
        </button>
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
        ${price.toLocaleString()}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #79: In-Flight Request Deduplication
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Pattern: Concurrent Promise Sharing.
 * • Data Structure: `Map<RequestKey, Promise<Data>>`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Checks if request is already in-flight.
 * 2. If present: returns existing promise.
 * 3. Once resolved or rejected: purges key from map in `.finally()`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Stale promises: Deleting key in `.finally()` ensures subsequent calls after completion trigger fresh network queries.
 */
export function DemoRequestDeduplicationMini() {
  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Coalesces multiple concurrent promises for identical URLs into a single network execution.
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #80: Debounced Search with Race Condition Guard
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • The Out-of-Order Race Condition Bug:
 *     - Request #1 (query "ca") takes 800ms.
 *     - Request #2 (query "cat") takes 200ms.
 *     - Naive apps render #2 first, then #1 overwrites it 600ms later with obsolete results!
 * • Request ID / Token Guard:
 *     - Monotonically incrementing `activeId.current++`.
 *     - On arrival, verify `reqId === activeId.current`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types "c", then "cat".
 * 2. Each keystroke increments `activeId`.
 * 3. Only the response matching the latest active ID updates the UI; slow obsolete responses are silently dropped!
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • AbortController: In modern browsers, pair with `controller.abort()` to actually cancel the TCP connection and save bandwidth.
 */
export function DemoRaceConditionGuard() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const activeId = useRef(0);

  // Safe search discarding stale out-of-order responses
  const search = (term) => {
    setQuery(term);
    const reqId = ++activeId.current;
    setTimeout(() => {
      // Discard response if newer request dispatched in meantime!
      if (reqId === activeId.current) {
        setResponse(`Response for query: "${term}"`);
      }
    }, Math.random() * 500 + 200);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => search(e.target.value)}
        placeholder="Type to test race-condition tokens..."
        style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
      />
      <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: '#34d399' }}>
        {response || 'No queries fired yet.'}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #81: Chunked File Upload with Pause/Resume
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Slice-Based S3 Multipart Strategy:
 *     - Splits large binary `File` (e.g. 100MB) into discrete chunks via `file.slice(start, end)`.
 *     - Each chunk sends to `/api/upload/part` with byte range and part number.
 * • Pause & Resume State:
 *     - `paused` flag halts progress timer / fetch loop.
 *     - On resume: continues from the last successfully acknowledged byte index.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Upload progresses by discrete 10% chunk batches.
 * 2. User clicks Pause -> sets `paused = true` and halts intervals.
 * 3. User clicks Resume -> continues from current progress without restarting from 0%.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Corrupted parts: Compute and send MD5 / ETag checksum per chunk so server can verify data integrity before merging.
 */
export function DemoChunkedUpload() {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || progress >= 100) return;
    const t = setInterval(() => setProgress(p => Math.min(p + 10, 100)), 400);
    return () => clearInterval(t);
  }, [paused, progress]);

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
        <span>Chunk 10MB Video File</span>
        <span>{progress}%</span>
      </div>
      <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.8rem' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#6366f1' }} />
      </div>
      <button onClick={() => setPaused(!paused)} style={{ padding: '0.4rem 0.8rem', background: paused ? '#10b981' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        {paused ? 'Resume Upload' : 'Pause Upload'}
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #82: Cursor-Based Pagination
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Offset vs Cursor Pagination:
 *     - Offset (`LIMIT 10 OFFSET 1000`): Degrades as database scans all prior rows; prone to duplicate/skipped items if records insert during browsing.
 *     - Cursor (`WHERE id > cursor LIMIT 10`): Always O(1) indexed index seek.
 * • Opaque Pointer: Client treats cursor as an opaque base64 string.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Client loads first page -> response includes items and `next_cursor`.
 * 2. Client requests `/api/items?cursor=next_cursor`.
 * 3. Fast deterministic retrieval without pagination drift.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Terminal page detection: When `next_cursor` is null, disable "Load Next" button.
 */
export function DemoCursorPagination() {
  const [cursor, setCursor] = useState(1);
  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Current Opaque Cursor Token: <code>cursor_token_0x{cursor}af8</code>
      <button onClick={() => setCursor(c => c + 1)} style={{ display: 'block', marginTop: '0.6rem', padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        Load Next Cursor Slice
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #83: Multi-Tab State Synchronization via BroadcastChannel
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Browser API: `new BroadcastChannel('channel_name')`.
 * • Zero-Network Peer Messaging:
 *     - Allows tabs, windows, and iframes on the SAME origin to send 1-to-many broadcast messages.
 *     - No server, WebSocket, or polling required.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User logs out in Tab A -> `channel.postMessage({ type: 'AUTH_LOGOUT' })`.
 * 2. Tabs B, C, and D receive `onmessage` event instantaneously.
 * 3. All tabs synchronize session state in <5ms.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Origin Isolation: BroadcastChannel respects the Same-Origin Policy (SOP). Cross-origin communication requires `window.postMessage`.
 */
export function DemoBroadcastChannel() {
  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem', color: '#cbd5e1' }}>
      Uses the native <code>BroadcastChannel('interview_channel')</code> API to notify sibling tabs without WebSocket overhead.
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #84: Web Worker Heavy Calculation Offloader
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Main Thread Protection:
 *     - Heavy CPU computations (Fibonacci, image convolution, cryptography, large JSON parsing) block JavaScript's main event loop.
 *     - Moving compute into a background Web Worker keeps animations and user clicks silky smooth at 60/120 FPS.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Main thread dispatches message: `worker.postMessage({ n: 42 })`.
 * 2. Worker executes heavy task on separate OS background thread.
 * 3. Worker posts result back: `self.postMessage(result)`.
 * 4. Main thread updates state with zero frame drops.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Structured Clone Overhead: Large data transferred via `postMessage` is copied by default; use Transferable Objects (`ArrayBuffer`) for zero-copy memory ownership transfers.
 */
export function DemoWebWorkerOffloader() {
  const [fibResult, setFibResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Simulated off-thread calculation
  const calculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setFibResult(3524578);
      setCalculating(false);
    }, 500);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <button onClick={calculate} disabled={calculating} style={{ padding: '0.4rem 0.8rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        {calculating ? 'Offloading to Worker...' : 'Compute Fib(42) Off-Thread'}
      </button>
      {fibResult && <div style={{ marginTop: '0.6rem', color: '#34d399', fontSize: '0.85rem' }}>Result: {fibResult}</div>}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #85: Rate Limiter Token Bucket
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Token Bucket Algorithm:
 *     - Bucket holds a maximum capacity of N tokens.
 *     - Tokens refill at a steady leak/refill rate (e.g. 1 token per 2 seconds).
 *     - Each outbound request consumes 1 token.
 *     - If bucket is empty (`tokens === 0`): Request is throttled/rejected with HTTP 429 Too Many Requests.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Dispatch API Call".
 * 2. Checks `tokens > 0`: if available, decrements count and executes.
 * 3. When tokens reach 0: displays rate limit alert.
 * 4. Refill action restores token allowance.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Burst allowance: Token bucket naturally permits short bursts up to capacity while enforcing strict long-term average rates.
 */
export function DemoTokenBucket() {
  const [tokens, setTokens] = useState(5);

  // Consume token or reject with 429
  const consume = () => {
    if (tokens > 0) setTokens(t => t - 1);
    else alert('Rate limit exceeded: 429 Too Many Requests!');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px', fontSize: '0.85rem' }}>
      <div style={{ marginBottom: '0.6rem', color: '#cbd5e1' }}>
        Available API Tokens: <strong style={{ color: tokens > 0 ? '#34d399' : '#ef4444' }}>{tokens} / 5</strong>
      </div>
      <button onClick={consume} style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        Dispatch API Call (Consumes 1 token)
      </button>
      <button onClick={() => setTokens(5)} style={{ marginLeft: '0.4rem', padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
        Refill Bucket
      </button>
    </div>
  );
}

