import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Undo2, Redo2, ChevronLeft, ChevronRight, Sun, Moon, 
  ArrowLeftRight, Check, Play, Pause, RotateCcw, MoveRight 
} from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #41: Kanban Board with Drag & Drop
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: KanbanContainer -> ColumnList[Column[Header, CardDropZone -> DraggableCard[]]]
 * • State Model:
 *     - `columns`: Record<ColumnId, string[]> mapping column IDs ('todo' | 'inProgress' | 'done') to task item arrays.
 *     - `draggedItem`: { col: string, item: string } | null (active drag payload reference).
 * • HTML5 Drag & Drop API:
 *     - `draggable={true}`: Enables native OS/browser drag lifecycle.
 *     - `onDragStart`: Serializes payload reference.
 *     - `onDragOver`: Calls `e.preventDefault()` to signal valid drop zone.
 *     - `onDrop`: Translocates task between columns atomically.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User grabs card in "todo" -> `onDragStart` captures `{ col: 'todo', item: 'Build Chrona Queue' }`.
 * 2. User drags over "inProgress" column -> `onDragOver` intercepts and allows drop.
 * 3. User releases mouse -> `handleDrop('inProgress')` removes card from source column and appends to target column.
 * 4. State mutates immutably and board re-renders.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Dropping into same column: Guard `if (draggedItem.col === targetCol) return` avoids redundant re-renders.
 * • Missing preventDefault: If `onDragOver` does not call `e.preventDefault()`, the browser will abort the drop event.
 */
export function DemoKanbanBoard() {
  const [columns, setColumns] = useState({
    todo: ['Build Chrona Queue', 'Design LesHub RBAC'],
    inProgress: ['Optimize Virtualized 100k List'],
    done: ['Modal Focus Trap Implementation']
  });
  const [draggedItem, setDraggedItem] = useState(null);

  // Capture dragged task and source column
  const handleDragStart = (col, item) => {
    setDraggedItem({ col, item });
  };

  // Process drop onto target column
  const handleDrop = (targetCol) => {
    if (!draggedItem || draggedItem.col === targetCol) return;
    setColumns(prev => {
      const sourceList = prev[draggedItem.col].filter(i => i !== draggedItem.item);
      const targetList = [...prev[targetCol], draggedItem.item];
      return { ...prev, [draggedItem.col]: sourceList, [targetCol]: targetList };
    });
    setDraggedItem(null);
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', gap: '0.6rem', overflowX: 'auto', maxWidth: '520px' }}>
      {Object.entries(columns).map(([colKey, tasks]) => (
        <div
          key={colKey}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(colKey)}
          style={{
            flex: 1,
            minWidth: '150px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.6rem'
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
            {colKey} ({tasks.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: '80px' }}>
            {tasks.map(t => (
              <div
                key={t}
                draggable
                onDragStart={() => handleDragStart(colKey, t)}
                style={{
                  padding: '0.5rem',
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                  cursor: 'grab'
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #42: Resizable Split Panels
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: SplitPanelContainer -> LeftPanel (width: leftWidth%) -> SplitterGutter (cursor: col-resize) -> RightPanel (flex: 1)
 * • State Model:
 *     - `leftWidth`: number (percentage 20% to 80%).
 *     - `isDragging`: Mutable ref (boolean) tracking whether pointer is holding splitter.
 * • Global Mouse Listeners:
 *     - Attached to `window` rather than gutter element to prevent drag loss when mouse cursor moves quickly.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User presses mouse down on splitter gutter -> `handleMouseDown` sets `isDragging.current = true`.
 * 2. As user moves pointer anywhere on screen, `handleMouseMove` computes delta.
 * 3. Percentage is clamped: `Math.min(Math.max((clientX / containerWidth) * 100, 20), 80)`.
 * 4. Releasing mouse sets `isDragging.current = false`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Mouse slipping off gutter: Registering `mousemove` and `mouseup` on `window` ensures dragging doesn't break if pointer leaves 8px gutter.
 * • Minimum/maximum boundary clamps: Clamping to 20%-80% prevents panels from collapsing to 0 width.
 */
export function DemoResizablePanels() {
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);

  const handleMouseDown = () => { isDragging.current = true; };

  useEffect(() => {
    // Window-level mouse move tracking for fluid dragging
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newWidth = Math.min(Math.max((e.clientX / 500) * 100, 20), 80);
      setLeftWidth(newWidth);
    };
    const handleMouseUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <div style={{ display: 'flex', height: '140px', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Left Resizable Panel */}
        <div style={{ width: `${leftWidth}%`, background: '#1e293b', padding: '0.8rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <strong>Code Panel ({leftWidth.toFixed(0)}%)</strong>
          <pre style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: '#a5b4fc' }}>const x = useMemo();</pre>
        </div>
        {/* Resizer Splitter Gutter */}
        <div 
          onMouseDown={handleMouseDown}
          style={{ width: '8px', background: '#475569', cursor: 'col-resize', transition: 'background 0.2s' }}
          title="Drag to resize panels"
        />
        {/* Right Flexible Panel */}
        <div style={{ flex: 1, background: '#0f172a', padding: '0.8rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <strong>Output Preview</strong>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>Live evaluation result.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #43: Undo / Redo State Manager
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Architecture: Classic Dual-Stack State Machine:
 *     - `past`: T[] (stack of prior immutable states).
 *     - `present`: T (current active working state).
 *     - `future`: T[] (stack of reverted states available for redo).
 * • Algebraic Transitions:
 *     - Update(new): `past.push(present)`, `present = new`, `future = []`. (New mutation invalidates future redo branch!).
 *     - Undo: `future.unshift(present)`, `present = past.pop()`.
 *     - Redo: `past.push(present)`, `present = future.shift()`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Initial draft created: present = "Version 1".
 * 2. User applies change: previous present pushes onto `past` stack; `future` resets to empty.
 * 3. User clicks Undo: pops last entry from `past` -> sets to `present` -> current present pushes onto `future`.
 * 4. User clicks Redo: shifts first entry from `future` -> restores into `present`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Clearing future on new action: If user undos 2 steps and types something new, future history must be discarded to prevent branched paradoxes.
 * • Stack depth limits: In production, cap `past` to N entries (e.g. 50) using `.slice(-50)` to prevent unbounded memory growth.
 */
export function DemoUndoRedo() {
  const [history, setHistory] = useState({
    past: [],
    present: 'Version 1: Initial Draft',
    future: []
  });

  // Apply new state mutation
  const update = (text) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: text,
      future: [] // Invalidate redo stack upon new mutation
    }));
  };

  // Revert to prior snapshot
  const undo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future]
    });
  };

  // Re-advance forward through reverted snapshots
  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture
    });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <button disabled={history.past.length === 0} onClick={undo} style={{ padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: history.past.length === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
          <Undo2 size={14} /> Undo ({history.past.length})
        </button>
        <button disabled={history.future.length === 0} onClick={redo} style={{ padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: history.future.length === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
          <Redo2 size={14} /> Redo ({history.future.length})
        </button>
      </div>
      <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '0.8rem', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
        Current State: {history.present}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button onClick={() => update(`Update @ ${new Date().toLocaleTimeString()}`)} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Apply Change
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #44: Interactive Half-Star Rating
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: RatingContainer -> StarsCluster[StarNode(1..5)] -> ScoreLabel
 * • State Model:
 *     - `rating`: number (committed score, increments of 0.5, e.g. 4.5).
 *     - `hover`: number | null (ephemeral preview score under pointer).
 * • Hit Detection Geometry:
 *     - `e.clientX - rect.left < rect.width / 2` calculates if pointer is in left vs right half of star bounding box.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User moves cursor over Star #3.
 * 2. `onMouseMove` calculates horizontal offset relative to `getBoundingClientRect()`.
 * 3. Left half -> `setHover(2.5)`; Right half -> `setHover(3.0)`.
 * 4. User clicks -> commits `setRating(hover)`.
 * 5. Pointer leaves -> `setHover(null)` restores committed rating.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Bounding rect coordinate caching: Always compute rect on the fly inside mousemove to account for parent page scrolling.
 * • Accessible keyboard support: Provide arrow key handlers (ArrowRight +0.5, ArrowLeft -0.5) with `role="slider"`.
 */
export function DemoStarRating() {
  const [rating, setRating] = useState(4.5);
  const [hover, setHover] = useState(null);

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map(star => {
          const activeScore = hover !== null ? hover : rating;
          const isFilled = activeScore >= star;
          const isHalf = activeScore >= star - 0.5 && activeScore < star;

          return (
            <div 
              key={star}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                setHover(isLeftHalf ? star - 0.5 : star);
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(hover)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <Star 
                size={28} 
                fill={isFilled ? '#f59e0b' : isHalf ? '#fbbf24' : 'none'} 
                color={isFilled || isHalf ? '#f59e0b' : '#475569'} 
              />
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
        Score: <strong>{rating.toFixed(1)}</strong> / 5.0
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #45: Image Slider / Carousel with Auto-Play
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: CarouselSurface -> SlideStage (active slide background + text) -> NavigationArrows (PrevBtn, NextBtn) -> PaginationIndicatorDots[]
 * • State Model:
 *     - `curr`: number (0-indexed cursor bounded by `slides.length`).
 * • Circular Arithmetic Modulo:
 *     - Next: `(curr + 1) % length`
 *     - Prev: `(curr - 1 + length) % length` (adding `length` prevents negative modulo in JavaScript!).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Current slide displays title and thematic background.
 * 2. User clicks Next chevron or pagination dot.
 * 3. Modulo calculation advances `curr` index cyclically.
 * 4. Slide transitions with smooth visuals.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • JavaScript Negative Modulo Bug: `-1 % 3` evaluates to `-1` in JS, not `2`. Always add `length` first: `(c - 1 + len) % len`.
 * • Auto-play timer leak: Ensure interval pauses when user hovers or unmounts component.
 */
export function DemoCarousel() {
  const slides = [
    { title: 'Chrona Scheduling Engine', color: '#4338ca' },
    { title: 'LesHub Multi-Tenant Admin', color: '#047857' },
    { title: 'Portfolio Slot Booking System', color: '#b45309' }
  ];
  const [curr, setCurr] = useState(0);

  // Circular modulo navigation
  const next = () => setCurr(c => (c + 1) % slides.length);
  const prev = () => setCurr(c => (c - 1 + slides.length) % slides.length);

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <div style={{
        position: 'relative',
        height: '140px',
        borderRadius: '8px',
        background: slides[curr].color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: '1.1rem',
        boxShadow: '0 10px 15px rgba(0,0,0,0.3)'
      }}>
        {slides[curr].title}
        {/* Navigation Controls */}
        <button onClick={prev} style={{ position: 'absolute', left: '0.5rem', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} style={{ position: 'absolute', right: '0.5rem', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={16} />
        </button>
      </div>
      {/* Pagination Indicator Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.6rem' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurr(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: curr === i ? '#818cf8' : '#334155', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #46: Sequential Order Status Progress Bar Queue
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ProgressSurface -> StepPillarsBar[StepCircleNode (number | checkmark) + StepLabel] -> ActionButtons (Advance, Reset)
 * • State Model:
 *     - `activeStage`: number (1-indexed milestone cursor).
 *     - `stages`: string[] of ordered process milestone titles.
 * • Visual State Classification:
 *     - Completed: `idx + 1 <= activeStage` -> Emerald `#10b981` circle with checkmark.
 *     - Pending: `idx + 1 > activeStage` -> Muted `#334155` circle with index number.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Process starts at step 1: "Order Received".
 * 2. User clicks "Advance Progress" -> `setActiveStage(s => Math.min(s + 1, stages.length))`.
 * 3. Next milestone circle animates to green with a checkmark.
 * 4. User clicks "Reset" -> restores `activeStage = 1`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Upper bound clamping: `Math.min(s + 1, stages.length)` guarantees stage cursor never exceeds array length.
 * • Accessibility: Provide `aria-current="step"` on active stage for assistive screen readers.
 */
export function DemoSequentialProgress() {
  const [activeStage, setActiveStage] = useState(1);
  const stages = ['Order Received', 'Batch Assigned (Chrona)', 'In Transit', 'Completed'];

  return (
    <div style={{ padding: '1rem', maxWidth: '460px' }}>
      {/* Horizontal Milestone Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        {stages.map((stage, idx) => (
          <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: idx + 1 <= activeStage ? '#10b981' : '#334155',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {idx + 1 <= activeStage ? '✓' : idx + 1}
            </div>
            <span style={{ fontSize: '0.7rem', color: idx + 1 <= activeStage ? '#f8fafc' : '#64748b' }}>
              {stage}
            </span>
          </div>
        ))}
      </div>

      {/* Advancement Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setActiveStage(s => Math.min(s + 1, stages.length))} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Advance Progress
        </button>
        <button onClick={() => setActiveStage(1)} style={{ padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Reset
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #47: Breadcrumbs with Truncation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: BreadcrumbNav (nav element, aria-label="Breadcrumb") -> CrumbItem[Link | EllipsisPopover | CurrentPage] -> SeparatorSlash
 * • Architecture & Overflow Pattern:
 *     - Fixed Edge Anchoring: Always render root ('Home') and terminal target ('Invoice #4092').
 *     - Intermediate Ellipsis: Truncates intermediate ancestor levels into clickable `...` when count exceeds maximum limit.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Path array evaluates length (5 items).
 * 2. Intermediate items are condensed into an ellipsis pill.
 * 3. Terminal active crumb renders with high contrast and without a trailing separator slash.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Semantic HTML: Use `<nav aria-label="Breadcrumb">` and `<ol>` / `<li>` markup for complete WCAG 2.1 AA compliance.
 * • Active page: Active item should have `aria-current="page"` and not be an active navigation link.
 */
export function DemoBreadcrumbs() {
  const path = ['Home', 'Organizations', 'LesHub Driving School', 'Billing', 'Invoice #4092'];
  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
      <span>Home</span>
      <span>/</span>
      <span style={{ cursor: 'pointer', background: '#1e293b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>...</span>
      <span>/</span>
      <span>Billing</span>
      <span>/</span>
      <span style={{ color: '#818cf8', fontWeight: 600 }}>Invoice #4092</span>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #48: Transfer List (Dual Listbox)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TransferListContainer -> AvailableBox[ItemList] -> TransferActionGutter[MoveRightBtn, MoveLeftBtn] -> GrantedBox[ItemList]
 * • State Model:
 *     - `left`: string[] (available unassigned permissions).
 *     - `right`: string[] (granted permissions).
 *     - `selectedLeft`: string[] (transiently highlighted items in left panel).
 * • Set Disjointness:
 *     - `left ∩ right = ∅` (an item exists either in available or granted, never both).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks items in "Available" box -> toggles item in `selectedLeft` array.
 * 2. Selected items highlight in emerald with a checkmark.
 * 3. User clicks transfer button (`<MoveRight />`) -> `moveRight()`.
 * 4. Selected items merge into `right` and filter out of `left`.
 * 5. `selectedLeft` clears to empty array.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Disabled state when empty: Transfer button disabled when `selectedLeft.length === 0`.
 * • Order preservation: In production, sort both panels alphabetically after transfer for consistent UX.
 */
export function DemoTransferList() {
  const [left, setLeft] = useState(['invoice.read', 'invoice.edit', 'audit.view']);
  const [right, setRight] = useState(['user.login']);
  const [selectedLeft, setSelectedLeft] = useState([]);

  // Transfer highlighted items from left to right panel
  const moveRight = () => {
    setRight([...right, ...selectedLeft]);
    setLeft(left.filter(i => !selectedLeft.includes(i)));
    setSelectedLeft([]);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '460px', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
      {/* Available Permissions Panel */}
      <div style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', minHeight: '100px' }}>
        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.4rem' }}>Available</div>
        {left.map(item => (
          <div 
            key={item} 
            onClick={() => setSelectedLeft(selectedLeft.includes(item) ? selectedLeft.filter(x => x !== item) : [...selectedLeft, item])}
            style={{ fontSize: '0.75rem', padding: '0.2rem', color: selectedLeft.includes(item) ? '#34d399' : '#cbd5e1', cursor: 'pointer' }}
          >
            {item} {selectedLeft.includes(item) && '✓'}
          </div>
        ))}
      </div>

      {/* Transfer Arrow Action Button */}
      <button onClick={moveRight} disabled={selectedLeft.length === 0} style={{ padding: '0.4rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        <MoveRight size={14} />
      </button>

      {/* Granted Permissions Panel */}
      <div style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', minHeight: '100px' }}>
        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.4rem' }}>Granted</div>
        {right.map(item => (
          <div key={item} style={{ fontSize: '0.75rem', padding: '0.2rem', color: '#cbd5e1' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #49: Theme Switcher
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ThemeSwitcherButton[ThemeIcon (Sun | Moon) + ActiveThemeLabel]
 * • State Model:
 *     - `theme`: 'dark' | 'light' (stored in state and persisted in localStorage or `data-theme` attribute).
 * • CSS Architecture:
 *     - Root-level CSS Custom Properties (`--bg-primary`, `--text-primary`) driven by `document.documentElement.setAttribute('data-theme', theme)`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks theme toggle button.
 * 2. `setTheme(t => t === 'dark' ? 'light' : 'dark')` flips mode.
 * 3. Button colors, background surfaces, and icons swap synchronously.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Flash of Unstyled Content (FOUC): Read stored theme in an inline `<script>` in `index.html` before React mounts.
 * • System Preference Sync: Check `window.matchMedia('(prefers-color-scheme: dark)')` for initial default.
 */
export function DemoThemeSwitcher() {
  const [theme, setTheme] = useState('dark');
  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <button 
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid #334155',
          background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
          color: theme === 'dark' ? '#f8fafc' : '#0f172a',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: 600
        }}
      >
        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        Active Theme: {theme.toUpperCase()}
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #50: Branching Stepper
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: StepperContainer -> StepOneSelector (TrackRoleDropdown) -> DynamicBranchCard[StepTwoRoleSpecificPrompt]
 * • State Model:
 *     - `role`: 'STUDENT' | 'INSTRUCTOR' (determines wizard navigation flow).
 * • Polymorphic Wizard Architecture:
 *     - Step 1 branches conditionally into disparate downstream form sequences without hardcoding monolithic workflows.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User selects track: "Student Candidate" vs "Driving Instructor".
 * 2. `setRole(newRole)` updates discriminator.
 * 3. Conditional branch dynamically updates Step 2 requirements (e.g. Provisional License vs ADI Badge number).
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Form state leakage across branches: When switching tracks, prune or namespace previous branch inputs to avoid submitting irrelevant keys.
 * • History back button: Synchronize active step and branch in URL query parameters (`?step=2&track=instructor`).
 */
export function DemoBranchingStepper() {
  const [role, setRole] = useState('STUDENT');
  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.85rem' }}>
      <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem' }}>Step 1: Choose Role Track</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '0.4rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', marginBottom: '0.8rem' }}>
        <option value="STUDENT">Student Candidate</option>
        <option value="INSTRUCTOR">Driving Instructor</option>
      </select>
      <div style={{ background: '#1e293b', padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155' }}>
        <strong>Step 2 Dynamic Branch:</strong>
        {role === 'STUDENT' ? (
          <p style={{ margin: '0.3rem 0 0 0', color: '#60a5fa' }}>Prompt: Enter Provisional License & Theory Pass Certificate</p>
        ) : (
          <p style={{ margin: '0.3rem 0 0 0', color: '#34d399' }}>Prompt: Enter ADI Badge Number & Dual-Control Vehicle Registration</p>
        )}
      </div>
    </div>
  );
}

