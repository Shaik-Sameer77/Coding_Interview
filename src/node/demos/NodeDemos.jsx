import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Flame, 
  Cpu, Database, Server, Zap, Shield, FileText, ArrowRight, Activity 
} from 'lucide-react';

/**
 * ============================================================================
 * NODE PROBLEM #1: Custom Transform Stream: CSV to JSON Streaming Parser
 * ============================================================================
 */
export function NodeDemoCsvStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [rowsParsed, setRowsParsed] = useState(0);
  const [rssMemory, setRssMemory] = useState(24.5);
  const [log, setLog] = useState([]);

  useEffect(() => {
    let timer;
    if (isStreaming) {
      timer = setInterval(() => {
        setRowsParsed(prev => {
          if (prev >= 10000) {
            setIsStreaming(false);
            setLog(l => [`[DONE] Stream pipeline finalized 10,000 rows cleanly. Constant memory preserved.`, ...l.slice(0, 5)]);
            return 10000;
          }
          const next = prev + 500;
          setRssMemory(+(24.5 + Math.random() * 0.8).toFixed(1));
          setLog(l => [`Pushed 64KB chunk (Rows ${prev} -> ${next}) -> transform() -> emit('data')`, ...l.slice(0, 5)]);
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isStreaming]);

  const handleStart = () => {
    setRowsParsed(0);
    setLog(['Initiating fs.createReadStream("pupils_50k.csv") -> pipeline(new CsvToJsonTransform())']);
    setIsStreaming(true);
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={16} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>Streaming CSV to JSON Parser (Constant Memory)</span>
        </div>
        <button
          onClick={handleStart}
          disabled={isStreaming}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.8rem', background: isStreaming ? '#334155' : '#10b981',
            color: '#fff', border: 'none', borderRadius: '6px', cursor: isStreaming ? 'default' : 'pointer',
            fontSize: '0.75rem', fontWeight: 600
          }}
        >
          {isStreaming ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
          {isStreaming ? 'Streaming...' : 'Stream 10,000 Rows'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
        <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Processed Records:</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{rowsParsed.toLocaleString()} / 10,000</div>
        </div>
        <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Process RSS Heap:</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{rssMemory} MB</div>
        </div>
        <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Buffer Invariant:</span>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginTop: '0.2rem' }}>O(1) Residual Buffer</div>
        </div>
      </div>

      <div style={{ background: '#090d16', padding: '0.8rem', borderRadius: '6px', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.75rem', color: '#cbd5e1', minHeight: '110px' }}>
        {log.map((entry, idx) => (
          <div key={idx} style={{ color: idx === 0 ? '#34d399' : '#64748b', lineHeight: 1.5 }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * NODE PROBLEM #2: Stream Backpressure Controller & HighWaterMark Buffer
 * ============================================================================
 */
export function NodeDemoBackpressure() {
  const [bufferLevel, setBufferLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [drainCount, setDrainCount] = useState(0);

  const produce = () => {
    setBufferLevel(prev => {
      const next = prev + 35;
      if (next >= 100) {
        setIsPaused(true);
        return 100;
      }
      return next;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBufferLevel(prev => {
        if (prev <= 0) return 0;
        const next = Math.max(0, prev - 25);
        if (prev >= 100 && next < 100) {
          setIsPaused(false);
          setDrainCount(c => c + 1);
        }
        return next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '640px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} color="#6366f1" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>Stream Backpressure & Drain Synchronizer</span>
        </div>
        <button
          onClick={produce}
          disabled={isPaused}
          style={{
            padding: '0.35rem 0.8rem', background: isPaused ? '#ef4444' : '#6366f1',
            color: '#fff', border: 'none', borderRadius: '6px', cursor: isPaused ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem', fontWeight: 600
          }}
        >
          {isPaused ? 'Backpressure Active (Paused)' : 'Fast Produce (write)'}
        </button>
      </div>

      <div style={{ marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
          <span>Writable Stream Internal Buffer (highWaterMark = 16KB):</span>
          <span style={{ color: bufferLevel >= 100 ? '#f87171' : '#34d399', fontWeight: 700 }}>
            {bufferLevel}% {bufferLevel >= 100 ? '(write() === false)' : '(Ready)'}
          </span>
        </div>
        <div style={{ height: '14px', background: '#1e293b', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${bufferLevel}%`,
            background: bufferLevel >= 100 ? '#ef4444' : bufferLevel > 60 ? '#f59e0b' : '#6366f1',
            transition: 'width 0.2s ease'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
        <span>State: <strong style={{ color: isPaused ? '#ef4444' : '#34d399' }}>{isPaused ? 'readable.pause()' : 'readable.resume()'}</strong></span>
        <span>Drain Events Fired: <strong style={{ color: '#818cf8' }}>{drainCount}</strong></span>
        <span>Sink Consumption Rate: <strong>25KB / 400ms</strong></span>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * NODE PROBLEM #11: Async Task Queue with Concurrency Limit (p-limit)
 * ============================================================================
 */
export function NodeDemoTaskQueue() {
  const [activeSlots, setActiveSlots] = useState([null, null, null]);
  const [queue, setQueue] = useState([]);
  const [completed, setCompleted] = useState(0);

  const addTask = () => {
    const taskId = Math.floor(1000 + Math.random() * 9000);
    setQueue(q => [...q, taskId]);
  };

  useEffect(() => {
    const emptySlotIdx = activeSlots.findIndex(s => s === null);
    if (emptySlotIdx !== -1 && queue.length > 0) {
      const nextTask = queue[0];
      setQueue(q => q.slice(1));
      
      const newSlots = [...activeSlots];
      newSlots[emptySlotIdx] = nextTask;
      setActiveSlots(newSlots);

      setTimeout(() => {
        setActiveSlots(curr => {
          const updated = [...curr];
          updated[emptySlotIdx] = null;
          return updated;
        });
        setCompleted(c => c + 1);
      }, 1200 + Math.random() * 800);
    }
  }, [queue, activeSlots]);

  return (
    <div style={{ width: '100%', maxWidth: '640px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={16} color="#06b6d4" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>Async Task Queue (Concurrency Limit: 3)</span>
        </div>
        <button
          onClick={addTask}
          style={{
            padding: '0.35rem 0.8rem', background: '#06b6d4',
            color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 600
          }}
        >
          + Push Async Task
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Active Concurrency Slots (Limit = 3):</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          {activeSlots.map((slot, idx) => (
            <div key={idx} style={{
              background: slot ? 'rgba(6, 182, 212, 0.15)' : '#1e293b',
              border: slot ? '1px solid #06b6d4' : '1px dashed #334155',
              padding: '0.6rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem'
            }}>
              <span style={{ color: slot ? '#22d3ee' : '#64748b', fontWeight: 700 }}>
                {slot ? `Worker #${idx + 1}: Task-${slot}` : `Worker #${idx + 1}: Idle`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
        <span>Backlog Queue: <strong style={{ color: '#fbbf24' }}>{queue.length} tasks waiting</strong></span>
        <span>Completed: <strong style={{ color: '#34d399' }}>{completed} tasks</strong></span>
        <span>Socket Exhaustion: <strong style={{ color: '#10b981' }}>0 ECONNRESET</strong></span>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * NODE PROBLEM #14: Circuit Breaker Pattern (Closed -> Open -> Half-Open)
 * ============================================================================
 */
export function NodeDemoCircuitBreaker() {
  const [state, setState] = useState('CLOSED'); // CLOSED | OPEN | HALF_OPEN
  const [failures, setFailures] = useState(0);
  const [successes, setSuccesses] = useState(0);

  const handleSuccess = () => {
    if (state === 'OPEN') return;
    setSuccesses(s => s + 1);
    if (state === 'HALF_OPEN') {
      setState('CLOSED');
      setFailures(0);
    }
  };

  const handleFailure = () => {
    if (state === 'OPEN') return;
    setFailures(f => {
      const next = f + 1;
      if (next >= 3) {
        setState('OPEN');
        setTimeout(() => {
          setState('HALF_OPEN');
        }, 4000);
      }
      return next;
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={16} color="#f59e0b" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>Resilient Circuit Breaker State Machine</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={handleSuccess}
            style={{ padding: '0.35rem 0.7rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Send 200 OK
          </button>
          <button
            onClick={handleFailure}
            style={{ padding: '0.35rem 0.7rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Simulate 503 Outage
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
        {['CLOSED', 'OPEN', 'HALF_OPEN'].map(st => (
          <div key={st} style={{
            background: state === st 
              ? st === 'CLOSED' ? 'rgba(16, 185, 129, 0.2)' : st === 'OPEN' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
              : '#1e293b',
            border: state === st 
              ? `2px solid ${st === 'CLOSED' ? '#10b981' : st === 'OPEN' ? '#ef4444' : '#f59e0b'}`
              : '1px solid #334155',
            padding: '0.8rem', borderRadius: '8px', textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>State</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: st === 'CLOSED' ? '#34d399' : st === 'OPEN' ? '#f87171' : '#fbbf24' }}>
              {st}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              {st === 'CLOSED' ? 'Normal Traffic' : st === 'OPEN' ? 'Fast Fail (1ms)' : 'Trial Probe (1 req)'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', background: '#090d16', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
        <span>Failures: <strong style={{ color: '#f87171' }}>{failures} / 3 threshold</strong></span> | 
        <span style={{ marginLeft: '0.5rem' }}>Successes: <strong style={{ color: '#34d399' }}>{successes}</strong></span> |
        <span style={{ marginLeft: '0.5rem' }}>Tripped Behavior: <strong>{state === 'OPEN' ? 'Bypassing downstream API completely' : 'Passing requests to upstream service'}</strong></span>
      </div>
    </div>
  );
}

// Node Demo Registry mapping demoId to Component
export const NODE_DEMO_REGISTRY = {
  NodeDemoCsvStream,
  NodeDemoBackpressure,
  NodeDemoTaskQueue,
  NodeDemoCircuitBreaker
};
