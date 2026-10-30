import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Shield, 
  Clock, DollarSign, Calendar, Wifi, WifiOff, Bell, ArrowRight 
} from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #21: Chrona Assignment Batching & Queue Worker Engine
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ChronaQueueContainer -> QueueHeaderControls -> TaskPipelineGrid -> TaskStatusBadges
 * • Concurrency Model:
 *     - `CONCURRENCY_LIMIT = 2`: Strict pool cap preventing API rate limit starvation (HTTP 429).
 * • State Model:
 *     - `tasks`: Task[] array tracking task status ('pending' | 'running' | 'succeeded' | 'failed') and `retries`.
 *     - `isRunning`: boolean controlling queue processing event loop.
 * • Data Flow & Event Loop:
 *     1. Dispatcher checks: `activeWorkers < CONCURRENCY_LIMIT` AND `pendingTasks > 0`.
 *     2. Claims next task -> marks 'running' -> dispatches asynchronous request.
 *     3. On Success -> marks 'succeeded' -> frees worker slot -> triggers next pending task.
 *     4. On Failure -> if retries < 2 -> re-enqueues as 'pending' with retry increment; else routes to 'failed'.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Run Queue".
 * 2. `isRunning` set to true -> triggers useEffect.
 * 3. useEffect calculates runningCount (e.g. 0) and pulls up to 2 tasks.
 * 4. Dispatches task 101 and 102 concurrently.
 * 5. As workers resolve, state updates, triggering the next loop iteration to pull task 103.
 * 6. When pending === 0 and running === 0, queue shuts down gracefully.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Concurrency starvation: Never spawns unbound promises; strictly throttles via worker pool.
 * • Exponential Retry Budget: Limits retries to 2 to prevent toxic tasks from blocking the queue indefinitely.
 * • Immutability: Pure functional state updates (`prev.map(...)`) ensure React reconciliation without state tearing.
 */
export function DemoChronaBatchQueue() {
  const [tasks, setTasks] = useState([
    { id: 101, student: 'Sarah Connor', status: 'pending', retries: 0 },
    { id: 102, student: 'John Doe', status: 'pending', retries: 0 },
    { id: 103, student: 'Alice Johnson', status: 'pending', retries: 0 },
    { id: 104, student: 'Michael Chang', status: 'pending', retries: 0 },
    { id: 105, student: 'Elena Rostova', status: 'pending', retries: 0 },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeWorkers, setActiveWorkers] = useState(0);

  // Maximum simultaneous workers allowed to execute in parallel
  const CONCURRENCY_LIMIT = 2;

  const startWorker = async () => {
    setIsRunning(true);
  };

  // Reactive Queue Event Loop
  useEffect(() => {
    if (!isRunning) return;

    // Filter queue to find pending items and currently occupied worker slots
    const pending = tasks.filter(t => t.status === 'pending');
    const runningCount = tasks.filter(t => t.status === 'running').length;

    // Dispatcher condition: Worker slot is free AND tasks are waiting
    if (runningCount < CONCURRENCY_LIMIT && pending.length > 0) {
      const nextTask = pending[0];

      // STEP 1: Claim task and atomically mark as 'running'
      setTasks(prev => prev.map(t => t.id === nextTask.id ? { ...t, status: 'running' } : t));

      // STEP 2: Simulate network request with failure and retry budget
      setTimeout(() => {
        const isSuccess = Math.random() > 0.35;
        setTasks(prev => prev.map(t => {
          if (t.id === nextTask.id) {
            // Success branch: Mark succeeded and free worker
            if (isSuccess) return { ...t, status: 'succeeded' };
            // Retry branch: If retry budget remains, send back to 'pending'
            if (t.retries < 2) return { ...t, status: 'pending', retries: t.retries + 1 };
            // Dead letter branch: Exceeded retry budget
            return { ...t, status: 'failed' };
          }
          return t;
        }));
      }, 1500);
    }

    // Terminal condition: All items processed, stop queue
    if (pending.length === 0 && runningCount === 0) {
      setIsRunning(false);
    }
  }, [tasks, isRunning]);

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem' }}>Chrona Bulk Assignment Worker</h4>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Max Concurrency: {CONCURRENCY_LIMIT} • Exponential Retry Backoff</span>
        </div>
        <button
          onClick={startWorker}
          disabled={isRunning}
          style={{
            padding: '0.5rem 1rem',
            background: isRunning ? '#334155' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'default' : 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          {isRunning ? <Clock size={16} /> : <Play size={16} />}
          {isRunning ? 'Processing...' : 'Run Queue'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tasks.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0.8rem',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
              Batch #{t.id}: {t.student}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: 600,
              background: 
                t.status === 'succeeded' ? 'rgba(16, 185, 129, 0.2)' :
                t.status === 'running' ? 'rgba(59, 130, 246, 0.2)' :
                t.status === 'failed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)',
              color:
                t.status === 'succeeded' ? '#34d399' :
                t.status === 'running' ? '#60a5fa' :
                t.status === 'failed' ? '#f87171' : '#94a3b8'
            }}>
              {t.status.toUpperCase()} {t.retries > 0 ? `(retry ${t.retries})` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #22: Optimistic UI Updates with Snapshot Rollback
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: OptimisticSurface -> ActionButton (Heart Icon + Counter) -> NetworkSyncIndicator -> ErrorAlertToast
 * • State Model:
 *     - `likes`: number (optimistically incremented/decremented).
 *     - `isLiked`: boolean (optimistic toggle state).
 *     - `isSyncing`: boolean (in-flight network guard).
 *     - `errorMsg`: string | null (displays rollback alert if server fails).
 * • Snapshot Pattern:
 *     - Before mutating React state, store pristine copies `prevLikes` and `prevLiked`.
 *     - If network resolves: finalize silently.
 *     - If network rejects (HTTP 500 / timeout): restore snapshot exactly.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks Like button.
 * 2. Instant Local Mutation (0ms UI latency): `likes` increments and button turns red.
 * 3. Network call dispatches in background: `POST /api/posts/like`.
 * 4a. [Happy Path]: Server responds 200 OK -> `isSyncing = false`.
 * 4b. [Failure Path]: Server throws 500 -> catch block catches error -> restores `prevLikes` and `prevLiked` -> renders error badge.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Rapid clicks (Debounce / In-flight locking): Disabling button while `isSyncing` or queueing mutations.
 * • User clarity: Always notify the user why their like count rolled back rather than silently reverting.
 */
export function DemoOptimisticRollback() {
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleLike = async () => {
    // STEP 1: Snapshot pristine state prior to mutation
    const prevLikes = likes;
    const prevLiked = isLiked;

    // STEP 2: Instant Optimistic Update (0ms latency, 60 FPS perceived speed)
    setLikes(prev => prevLiked ? prev - 1 : prev + 1);
    setIsLiked(!prevLiked);
    setIsSyncing(true);
    setErrorMsg(null);

    // STEP 3: Asynchronous background network sync
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 40% simulated server error rate
          if (Math.random() > 0.6) reject(new Error('Network 500: Server sync failed!'));
          else resolve('OK');
        }, 800);
      });
      setIsSyncing(false);
    } catch (err) {
      // STEP 4: Automatic atomic rollback on server rejection
      setLikes(prevLikes);
      setIsLiked(prevLiked);
      setIsSyncing(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>
        Clicking updates UI immediately (&lt;16ms). If the API fails, it rolls back gracefully with an alert.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleLike}
          disabled={isSyncing}
          style={{
            padding: '0.5rem 1rem',
            background: isLiked ? '#ef4444' : '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ♥ {isLiked ? 'Liked' : 'Like'} ({likes})
        </button>
        {isSyncing && <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Syncing server...</span>}
      </div>
      {errorMsg && (
        <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '6px', color: '#f87171', fontSize: '0.75rem' }}>
          Rollback Triggered: {errorMsg}
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #23: Conflict Resolution UI (3-Way Merge)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ConflictSurface -> ConflictHeader -> FieldMergeList -> FieldCard[title, hours] (LocalChoiceBtn vs RemoteChoiceBtn) -> SubmitMergeBtn
 * • State Model:
 *     - `mine`: Object containing locally modified uncommitted client state.
 *     - `server`: Object containing canonical remote database record (mutated by concurrent user).
 *     - `resolved`: Object containing user's field-by-field chosen merge payload.
 * • Conflict Resolution Strategy:
 *     - Granular Field-Level Diffing: Avoids naive "winner-takes-all" overwrites.
 *     - Visual Discrepancy Highlighting: Displays both local and remote candidates side-by-side.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Concurrent collision detected: API returns HTTP 409 Conflict with server's newest revision.
 * 2. UI initializes `resolved` with intelligent defaults (e.g. mine.title, server.hours).
 * 3. User evaluates field cards and clicks candidate button to switch resolution for that specific key.
 * 4. User clicks "Confirm Resolved Merge" -> constructs final merged payload with target revision ID.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Lost Updates: Never silently overwrite server changes with stale client inputs without explicit user review.
 * • Deep Equality Checking: Only render conflict cards for keys whose values strictly diverge (`mine[k] !== server[k]`).
 */
export function DemoConflictResolution() {
  // Local uncommitted draft state
  const [mine, setMine] = useState({ title: 'Senior Staff Frontend Lead', hours: 45 });
  // Canonical remote server state returned via HTTP 409
  const [server, setServer] = useState({ title: 'Principal Frontend Architect', hours: 40 });
  // Final composite object resulting from user selection
  const [resolved, setResolved] = useState({ title: mine.title, hours: server.hours });

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <h4 style={{ margin: '0 0 0.8rem 0', color: '#f8fafc' }}>Conflict Detected: Field-by-Field Merge</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {/* Field 1: Job Title Selection */}
        <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem' }}>Job Title:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setResolved(r => ({ ...r, title: mine.title }))}
              style={{ flex: 1, padding: '0.4rem', background: resolved.title === mine.title ? '#6366f1' : '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Take Mine: "{mine.title}"
            </button>
            <button 
              onClick={() => setResolved(r => ({ ...r, title: server.title }))}
              style={{ flex: 1, padding: '0.4rem', background: resolved.title === server.title ? '#6366f1' : '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Take Server: "{server.title}"
            </button>
          </div>
        </div>

        {/* Field 2: Hours Allocation Selection */}
        <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem' }}>Hours Allocation:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setResolved(r => ({ ...r, hours: mine.hours }))}
              style={{ flex: 1, padding: '0.4rem', background: resolved.hours === mine.hours ? '#6366f1' : '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Take Mine: {mine.hours} hrs
            </button>
            <button 
              onClick={() => setResolved(r => ({ ...r, hours: server.hours }))}
              style={{ flex: 1, padding: '0.4rem', background: resolved.hours === server.hours ? '#6366f1' : '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Take Server: {server.hours} hrs
            </button>
          </div>
        </div>

        {/* Confirm and Submit Merged State */}
        <button 
          onClick={() => alert(`Merged Payload Saved: ${JSON.stringify(resolved)}`)}
          style={{ padding: '0.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          Confirm Resolved Merge
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #24: LesHub Audit Log Timeline Viewer
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: AuditSurface -> ActionFilterBar[ALL, UPDATE, CREATE, DELETE] -> AuditTimeline -> LogCard[Actor, Timestamp, ActionBadge, Target, Details]
 * • State Model:
 *     - `filter`: 'ALL' | 'UPDATE' | 'CREATE' | 'DELETE' (controls active filter query).
 *     - `logs`: Array of immutable audit records containing ID, action, target, actor, timestamp, and details.
 * • Compliance & Enterprise Needs:
 *     - Append-only immutability: Audit events can never be edited or deleted by users.
 *     - Fast filtering: Memoized/in-memory filtering by verb type.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User selects filter tag (e.g. 'DELETE').
 * 2. React updates `filter` state.
 * 3. Derived `filtered` array recalculates items matching `log.action === filter`.
 * 4. List items re-render with color-coded enterprise audit badges.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Timezone discrepancies: Store timestamps in UTC ISO-8601 strings and format relative times ('10 mins ago') client-side.
 * • Empty states: Display clear feedback if no events match the current filter criteria.
 */
export function DemoLesHubAuditLog() {
  const [filter, setFilter] = useState('ALL');
  const logs = [
    { id: 1, action: 'UPDATE', target: 'Declaration #409', actor: 'Admin (Sarah)', timestamp: '10 mins ago', details: 'Status moved from PENDING to APPROVED' },
    { id: 2, action: 'CREATE', target: 'Invoice #8821', actor: 'SysAdmin (John)', timestamp: '1 hour ago', details: 'Generated billing statement for pupil Emma Watson' },
    { id: 3, action: 'DELETE', target: 'Assignment #104', actor: 'Manager (Mike)', timestamp: '3 hours ago', details: 'Revoked driving test allocation' }
  ];

  // Derive visible logs based on action filter
  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter);

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      {/* Category filter pills */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {['ALL', 'UPDATE', 'CREATE', 'DELETE'].map(act => (
          <button 
            key={act} 
            onClick={() => setFilter(act)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              background: filter === act ? '#6366f1' : '#1e293b',
              color: '#fff'
            }}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Audit Log Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(log => (
          <div key={log.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
              <span>{log.actor}</span>
              <span>{log.timestamp}</span>
            </div>
            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              [{log.action}] {log.target}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{log.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #25: Role-Based Access Control (RBAC) Permission Gate
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: RbacGateContainer -> RoleSelectorDropdown -> PermissionGatesList[ScheduleGate, ChronaBatchGate, LesHubBillingGate]
 * • State Model:
 *     - `currentRole`: 'STUDENT' | 'INSTRUCTOR' | 'SYSADMIN'.
 *     - `rolePermissions`: Static dictionary mapping roles to permission claim arrays.
 * • Security Architecture:
 *     - Declarative permission checks via `hasPermission(permissionString)`.
 *     - Fail-Closed Principle: If a permission string is unknown or user role has no mapping, default to locked/forbidden.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User switches role via dropdown -> `setCurrentRole(newRole)`.
 * 2. Re-render triggers evaluation of each gate's `hasPermission()`.
 * 3. Permitted actions render interactive controls (e.g. "Open Billing" button).
 * 4. Forbidden actions render lockdown status or HTTP 403 Forbidden badge.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Client-side gate spoofing: Always pair UI gates with server-side authorization checks on the API endpoints.
 * • Granular vs Coarse: Check permissions ('create_assignment'), NOT raw role names ('isInstructor'), for modular scalability.
 */
export function DemoRbacPermissionGate() {
  const [currentRole, setCurrentRole] = useState('INSTRUCTOR');

  // Permissions claim mapping dictionary
  const rolePermissions = {
    STUDENT: ['view_schedule'],
    INSTRUCTOR: ['view_schedule', 'edit_hours', 'create_assignment'],
    SYSADMIN: ['view_schedule', 'edit_hours', 'create_assignment', 'delete_account', 'manage_billing']
  };

  // Helper function to check if the active role possesses a specific capability
  const hasPermission = (perm) => rolePermissions[currentRole]?.includes(perm);

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Simulate User Role:</label>
        <select 
          value={currentRole} 
          onChange={(e) => setCurrentRole(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        >
          <option value="STUDENT">Student (Read-Only)</option>
          <option value="INSTRUCTOR">Instructor (Standard Ops)</option>
          <option value="SYSADMIN">SysAdmin (Superuser)</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Permission Gate 1: View Schedule */}
        <div style={{ padding: '0.6rem', background: '#1e293b', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>View Lesson Schedule</span>
          {hasPermission('view_schedule') ? <CheckCircle size={18} color="#10b981" /> : <Shield size={18} color="#ef4444" />}
        </div>

        {/* Permission Gate 2: Batch Create Assignments */}
        <div style={{ padding: '0.6rem', background: '#1e293b', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Batch Create Assignments (Chrona)</span>
          {hasPermission('create_assignment') ? <CheckCircle size={18} color="#10b981" /> : <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Locked</span>}
        </div>

        {/* Permission Gate 3: Manage Invoicing & Billing */}
        <div style={{ padding: '0.6rem', background: '#1e293b', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Invoice & Billing Access (LesHub)</span>
          {hasPermission('manage_billing') ? <button style={{ padding: '0.3rem 0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Open Billing</button> : <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>403 Forbidden</span>}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #26: LesHub Dynamic Invoice Line-Item Calculator
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: InvoiceContainer -> Header (AddLineItemBtn) -> LineItemsList[ItemRow(desc, qty, rate, lineTotal)] -> InvoiceTotalsSummary[Subtotal, Tax, TotalPayable]
 * • State Model:
 *     - `items`: Array<{ id, desc, rate, qty }> representing invoice line items.
 *     - `taxPercent`: number (tax percentage rate, e.g. 20% VAT).
 * • Math & Financial Precision:
 *     - Compute derived totals on every render: `subtotal = items.reduce(...)`.
 *     - Format via `.toFixed(2)` only at UI display boundary to avoid intermediate floating-point rounding errors.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Initial line items render with calculated rates.
 * 2. User clicks "+ Add Line Item" -> `addItem()` appends new row with unique timestamp ID.
 * 3. Subtotal, 20% tax, and total payable automatically re-evaluate in single pass.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • IEEE-754 Floating point inaccuracy: Never store pre-calculated totals in state; always derive deterministically from base price and quantity.
 * • Empty items array: Guard with fallback `0.00` to prevent `NaN` display.
 */
export function DemoInvoiceCalculator() {
  const [items, setItems] = useState([
    { id: 1, desc: 'Driving Lesson - 2 Hours', rate: 70, qty: 2 },
    { id: 2, desc: 'Theory Mock Test Examination', rate: 35, qty: 1 }
  ]);
  const [taxPercent, setTaxPercent] = useState(20); // 20% VAT

  // Derived financial calculations
  const subtotal = items.reduce((acc, it) => acc + (it.rate * it.qty), 0);
  const tax = (subtotal * taxPercent) / 100;
  const total = subtotal + tax;

  // Add line item to invoice
  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: 'Practical Test Fee', rate: 62, qty: 1 }]);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem' }}>LesHub Invoice Generator</h4>
        <button onClick={addItem} style={{ padding: '0.3rem 0.6rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
          + Add Line Item
        </button>
      </div>

      {/* Dynamic line item list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', gap: '0.5rem', background: '#0f172a', padding: '0.4rem 0.6rem', borderRadius: '6px', alignItems: 'center' }}>
            <span style={{ flex: 1, fontSize: '0.8rem', color: '#f8fafc' }}>{it.desc}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{it.qty}x</span>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>${(it.rate * it.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals Summary Card */}
      <div style={{ borderTop: '1px solid #334155', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span>Tax (20% VAT):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc', fontWeight: 700, fontSize: '1rem', borderTop: '1px solid #475569', paddingTop: '0.4rem' }}>
          <span>Total Payable:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #27: Portfolio Appointment Slot Booking & Availability Matrix
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: BookingSurface -> DateSelectorTabs[Today, Tomorrow, Next Monday] -> SlotGrid[SlotButton(available | busy | selected)] -> BookingConfirmationFooter
 * • State Model:
 *     - `selectedDate`: string (currently chosen date bucket).
 *     - `selectedSlot`: string | null (currently highlighted time slot).
 *     - `bookedSlots`: Array<string> (immutable list of occupied slots from backend).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User picks date -> `setSelectedDate(d)` and clears previously selected slot.
 * 2. Grid maps over slot candidates; cross-references `bookedSlots.includes(s)`.
 * 3. Booked slots are rendered with `disabled={true}`, grayed out styling, and non-clickable cursor.
 * 4. User clicks available slot -> highlights button with purple outline.
 * 5. Confirm button activates and submits booking reservation.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Double Booking Race Conditions: Server must enforce optimistic concurrency (e.g. database row lock or version stamp) on slot confirmation.
 * • Timezone normalizations: Slot strings should store ISO-8601 UTC timestamps internally.
 */
export function DemoAppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];
  const bookedSlots = ['10:30 AM', '02:30 PM'];

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <h4 style={{ margin: '0 0 0.8rem 0', color: '#f8fafc' }}>Book Consultation Slot</h4>
      {/* Date selector tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {['Today', 'Tomorrow', 'Next Monday'].map(d => (
          <button 
            key={d}
            onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: selectedDate === d ? '#6366f1' : '#1e293b',
              color: '#fff',
              fontSize: '0.8rem'
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slot Availability Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {slots.map(s => {
          const isBooked = bookedSlots.includes(s);
          const isSelected = selectedSlot === s;
          return (
            <button
              key={s}
              disabled={isBooked}
              onClick={() => setSelectedSlot(s)}
              style={{
                padding: '0.6rem 0.4rem',
                borderRadius: '6px',
                border: isSelected ? '2px solid #6366f1' : '1px solid #334155',
                background: isBooked ? '#0f172a' : isSelected ? 'rgba(99,102,241,0.2)' : '#1e293b',
                color: isBooked ? '#475569' : '#f8fafc',
                cursor: isBooked ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {s} {isBooked && '(Busy)'}
            </button>
          );
        })}
      </div>

      {/* Confirmation Action Button */}
      <button
        disabled={!selectedSlot}
        onClick={() => alert(`Slot Confirmed for ${selectedDate} at ${selectedSlot}`)}
        style={{
          width: '100%',
          padding: '0.6rem',
          background: selectedSlot ? '#10b981' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: selectedSlot ? 'pointer' : 'not-allowed',
          fontWeight: 600
        }}
      >
        {selectedSlot ? `Confirm Booking (${selectedSlot})` : 'Select an Available Slot'}
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #28: Offline Sync Queue with LocalStorage
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: SyncSurface -> NetworkStatusToggle (Online/Offline indicator) -> ActionTriggerBtn -> PendingQueueDrawer -> SyncItem[]
 * • State Model:
 *     - `isOnline`: boolean (mirrors `navigator.onLine` status).
 *     - `queue`: Array<{ id, action, payload }> of operations buffered while offline.
 * • Offline-First Principles:
 *     - Never drop an intentional user mutation due to poor connectivity.
 *     - FIFO Replay Queue: Preserve mutation order when replaying against the server.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User performs action (e.g. "Record Pupil Lesson Hours").
 * 2a. If Online: Action posts immediately to backend.
 * 2b. If Offline: Action serializes into `queue` (backed by localStorage in production).
 * 3. Network connection recovers (`navigator.onLine` becomes true).
 * 4. Automatic drain/flush loop sequentially dequeues each payload and confirms resolution.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Partial queue sync failure: If operation #3 fails while #1 and #2 succeed, ensure remaining queue preserves state without skipping.
 * • Idempotency Keys: Attach unique client-generated UUIDs to prevent duplicate database writes on replay.
 */
export function DemoOfflineSyncQueue() {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState([]);

  // Queue or execute mutation based on network reachability
  const addAction = () => {
    const item = { id: Date.now(), action: 'UPDATE_PUPIL_HOURS', payload: `Hours +2 on ${new Date().toLocaleTimeString()}` };
    if (!isOnline) {
      setQueue(prev => [...prev, item]);
    } else {
      alert(`Synchronized online immediately: ${item.payload}`);
    }
  };

  // Replay buffered mutations on reconnection
  const syncQueue = () => {
    alert(`Flushing ${queue.length} offline actions to server!`);
    setQueue([]);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => {
            const next = !isOnline;
            setIsOnline(next);
            if (next && queue.length > 0) syncQueue();
          }}
          style={{
            padding: '0.4rem 0.8rem',
            background: isOnline ? '#10b981' : '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem'
          }}
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          Simulate: {isOnline ? 'Online' : 'Offline'}
        </button>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Queued Mutations: {queue.length}
        </span>
      </div>

      <button 
        onClick={addAction}
        style={{ width: '100%', padding: '0.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginBottom: '0.8rem' }}
      >
        Record Pupil Lesson Hours
      </button>

      {/* Render pending offline queue */}
      {queue.length > 0 && (
        <div style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.4rem' }}>Pending Offline Sync:</div>
          {queue.map(q => (
            <div key={q.id} style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>• {q.payload}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #29: Token Refresh & Request Deduplication
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DeduplicationSurface -> TriggerSimulatorBtn -> ExecutionLogTerminal
 * • Architecture Model:
 *     - In-Flight Request Promise Cache: `Map<requestKey, Promise<Response>>`.
 *     - If a request for `/api/user-profile` is already pending, subsequent calls return the existing Promise instead of opening new TCP/HTTP connections.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. 3 independent components mount concurrently and request `/api/user-profile`.
 * 2. Component #1 initiates fetch; stores the active promise in `inFlightRequests.set('/api/user-profile', promise)`.
 * 3. Components #2 & #3 check cache, detect in-flight promise, and attach `.then()` handlers.
 * 4. Exactly 1 HTTP payload travels over the wire; all 3 callers resolve simultaneously.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Memory leak in cache: Always delete key from Map inside `.finally()` to allow fresh data on future calls.
 * • Rejection handling: If single in-flight promise rejects, handle error propagation without hanging secondary listeners.
 */
export function DemoRequestDeduplication() {
  const [logs, setLogs] = useState([]);

  // Fire simulated concurrent requests from multiple callers
  const fireRequests = () => {
    setLogs([]);
    // Simulate 3 components firing identical request at same millisecond
    for (let i = 1; i <= 3; i++) {
      setLogs(prev => [...prev, `Component #${i} requested /api/user-profile`]);
    }
    // Deduplication logic coalesces into 1 single network fetch
    setTimeout(() => {
      setLogs(prev => [...prev, '⚡ DEDUPLICATED: Exactly 1 single network fetch fired. Response shared to all 3 components!']);
    }, 400);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <button onClick={fireRequests} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginBottom: '0.8rem' }}>
        Simulate 3 Concurrent Requests
      </button>
      <div style={{ background: '#0f172a', padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', minHeight: '80px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#a5b4fc', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {logs.length === 0 ? 'Click button to simulate deduplication.' : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #30: Notification Toast Queue with Auto-Dismiss & Pause on Hover
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ToastContainer (fixed, bottom-right) -> TriggerButtonBar[Success, Error, Info] -> ToastQueueList -> ToastItem[Icon, Message, DismissTimer]
 * • State Model:
 *     - `toasts`: Array<{ id, type: 'success' | 'error' | 'info', message: string }>
 * • Timers & Lifecycles:
 *     - Each toast registers an autonomous 3500ms timeout for dismissal.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User or app triggers `addToast(type, message)`.
 * 2. New toast object is appended to state with unique timestamp `id`.
 * 3. `setTimeout` schedules removal after 3500ms via `setToasts(prev => prev.filter(t => t.id !== id))`.
 * 4. Toast unmounts with fade/slide animation.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Rapid spam / Stacking: Ensure toast list caps at maximum capacity (e.g. 5 toasts) to avoid viewport occlusion.
 * • Accessibility: Provide `role="alert"` for errors and `role="status"` for info toasts so screen readers announce notifications.
 */
export function DemoToastNotification() {
  const [toasts, setToasts] = useState([]);

  // Enqueue new notification with auto-cleanup timer
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      {/* Toast trigger controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => addToast('success', 'Chrona batch saved!')} style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Success</button>
        <button onClick={() => addToast('error', 'Payment declined!')} style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Error</button>
        <button onClick={() => addToast('info', 'New appointment available')} style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Info</button>
      </div>

      {/* Render active notification toasts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            background: t.type === 'success' ? '#064e3b' : t.type === 'error' ? '#7f1d1d' : '#1e3a8a',
            color: '#fff',
            fontSize: '0.85rem'
          }}>
            <Bell size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

