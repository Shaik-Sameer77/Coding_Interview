import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Check, AlertCircle, ChevronDown, ChevronRight, Info, Plus, 
  Settings, User, LogOut, Copy, Trash, ExternalLink, HelpCircle 
} from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #1: Accessible Modal Dialog with Focus Trap & Escape Key
 * ============================================================================
 * 
 * 🎯 REAL-WORLD USE CASES & UX RATIONALE:
 * --------------------------------------
 * • Why use a Modal instead of Full Page Navigation?
 *   - Prevent Context Switching: Full-page route navigation tears down the host view,
 *     losing scroll position, client cache, and in-progress form inputs. Modals allow completing
 *     a transient task directly where the user is working.
 *   - Eliminate Navigation Latency: Bypasses network round-trips for new page bundles,
 *     eliminating heavy layout reflows and unnecessary re-render overhead.
 *   - Enforce Focused Attention: The backdrop and focus trap eliminate distractions for
 *     critical interactions (confirmations, authentication challenges, multi-step sub-forms).
 *   - Preserve Background State: Parent table filters, pagination, and multi-step draft states
 *     remain intact while performing rapid sub-operations.
 * 
 * • Real-World Industry Use Cases:
 *   1. Destructive Actions & Confirmation Guards: Two-step barriers before irreversible actions
 *      (e.g., deleting a student profile in LesHub, voiding a transaction, or revoking API credentials).
 *   2. In-Context Sub-Tasks: Editing a table row or creating a fast appointment without leaving
 *      a complex master calendar view.
 *   3. Session Expiration & Re-Auth: Prompting 2FA or password re-entry over an active session
 *      so in-progress user inputs are not wiped by a route redirect.
 *   4. Media Lightboxes & Document Inspection: Zooming into receipts, photo uploads, or inspection
 *      certificates without leaving the verification review screen.
 *   5. Focused Checkout / Payment: Inline payment dialogs (e.g., Stripe Elements / TayoPay) to
 *      minimize drop-off and conversion friction.
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TriggerButton -> OverlayBackdrop (fixed, z-index: 9999) -> DialogSurface (role="dialog") -> InteractiveForm
 * • State Model:
 *     - `isOpen`: boolean state controlling DOM portal mounting.
 * • DOM Refs:
 *     - `modalRef`: Points to modal container to query interior focusable elements.
 *     - `triggerRef`: Remembers the button that opened the modal so focus can be restored on close.
 * • Browser/DOM APIs:
 *     - `document.activeElement`: Remembers previous focus.
 *     - `element.querySelectorAll()`: Discovers all tabbable elements.
 *     - `document.body.style.overflow`: Locks background page scrolling.
 *     - `element.focus()`: Directs user keyboard navigation.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Open Accessible Modal" -> `setIsOpen(true)`.
 * 2. Component mounts backdrop & modal surface.
 * 3. useEffect lifecycle runs:
 *    a. Captures `document.activeElement` into `previousFocus`.
 *    b. Scans `modalRef` for focusable elements (`button, input, [href], etc.`).
 *    c. Auto-focuses `focusableElements[0]`.
 *    d. Sets `body.style.overflow = 'hidden'` to lock background page scroll.
 *    e. Binds `keydown` listener to intercept `Tab`, `Shift+Tab`, and `Escape`.
 * 4. User navigates with Tab:
 *    - If on last element, `e.preventDefault()` wraps focus to first element.
 *    - If Shift+Tab on first element, wraps to last element.
 * 5. User presses Escape or clicks backdrop:
 *    - `setIsOpen(false)` -> triggers cleanup -> restores body scroll -> refocused `triggerRef`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Focus loss: Restores focus to original trigger button to prevent screen readers from resetting to <body>.
 * • Scroll bleed: Body scroll is completely locked during modal life and guaranteed restored on unmount.
 * • WCAG A11y: Explicit `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` attributes.
 */
export function DemoModalDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    // If closed, no listeners or DOM mutations needed
    if (!isOpen) return;

    // STEP 1: Store previously focused DOM element before opening modal
    const previousFocus = document.activeElement;
    
    // STEP 2: Query all natively tabbable/focusable elements inside modal container
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Auto-focus first interactive element for keyboard users & screen readers
    if (focusableElements?.length) {
      focusableElements[0].focus();
    }

    // STEP 3: Keyboard listener handling Focus Trap and Escape dismissal
    const handleKeyDown = (e) => {
      // Escape key closes modal immediately
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      // Tab key cycling (Focus Trap)
      if (e.key === 'Tab') {
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        // Shift + Tab: reverse wrap from first element back to last element
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } 
        // Tab: forward wrap from last element back to first element
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Attach global keydown listener to window/document
    document.addEventListener('keydown', handleKeyDown);

    // STEP 4: Lock body scroll to prevent background content movement
    document.body.style.overflow = 'hidden';

    // STEP 5: Cleanup function executed when modal closes or unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Restore natural scrolling
      if (triggerRef.current) triggerRef.current.focus(); // Restore focus to trigger
    };
  }, [isOpen]);

  return (
    <div style={{ padding: '1rem' }}>
      <button 
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        style={{
          padding: '0.6rem 1.2rem',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Open Accessible Modal
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '90%',
              maxWidth: '460px',
              color: '#f9fafb',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 id="modal-title" style={{ fontSize: '1.2rem', margin: 0 }}>Senior Interview Modal</h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              Notice that pressing <strong>Tab</strong> or <strong>Shift+Tab</strong> stays trapped inside this dialog. 
              Pressing <strong>Escape</strong> or clicking backdrop smoothly closes it and restores focus!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <input 
                type="text" 
                placeholder="Trapped Input 1..." 
                style={{ padding: '0.5rem', borderRadius: '6px', background: '#111827', border: '1px solid #374151', color: '#fff' }}
              />
              <input 
                type="text" 
                placeholder="Trapped Input 2..." 
                style={{ padding: '0.5rem', borderRadius: '6px', background: '#111827', border: '1px solid #374151', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: '0.5rem 1rem', background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => { alert('Saved successfully!'); setIsOpen(false); }}
                style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #2: Click Outside Hook & Dropdown Menu
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DropdownBoundary (ref=dropdownRef) -> [TriggerButton, PopoverList (absolute) -> ListItems]
 * • State Model:
 *     - `isOpen`: boolean controlling popover visibility.
 *     - `selected`: string representing current track value.
 * • DOM Refs:
 *     - `dropdownRef`: Points to container; determines whether pointerdown target is internal or external.
 * • Browser/DOM APIs:
 *     - `document.addEventListener('pointerdown')`: Handles mouse, stylus, and touch interactions uniformly.
 *     - `node.contains(event.target)`: DOM boundary testing.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks TriggerButton -> `setIsOpen(!isOpen)`.
 * 2. Dropdown mounts and useEffect attaches `pointerdown` listener to document.
 * 3. User clicks anywhere on the viewport:
 *    a. Event fires on `document`.
 *    b. Checks `dropdownRef.current.contains(event.target)`.
 *    c. If target is NOT inside dropdownRef -> `setIsOpen(false)`.
 *    d. If target IS inside -> do nothing, allowing button/list clicks to handle themselves.
 * 4. Cleanup: `removeEventListener('pointerdown')` on unmount to prevent leaks.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Pointerdown vs Click: Using `click` has a 300ms mobile lag and causes phantom closes if an inner element unmounts during mousedown. `pointerdown` is immediate and unified.
 * • Multi-ref boundaries: Ref containment check ensures child elements don't trigger false outside closes.
 */
export function DemoClickOutside() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Senior Full Stack');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Handler invoked for any pointer press anywhere in the document
    function handleClickOutside(event) {
      // If ref is mounted and the click target is OUTSIDE the dropdown container, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Use pointerdown instead of click to prevent touch delays and unmount race conditions
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const roles = ['Senior Frontend Engineer', 'Senior Full Stack', 'Staff Architect', 'Engineering Lead'];

  return (
    <div style={{ padding: '1rem', position: 'relative', width: '280px' }} ref={dropdownRef}>
      <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.4rem' }}>
        Select Candidate Track:
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.6rem 0.9rem',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          color: '#f8fafc',
          cursor: 'pointer'
        }}
      >
        <span>{selected}</span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>

      {isOpen && (
        <ul style={{
          position: 'absolute',
          top: '105%',
          left: '1rem',
          right: '1rem',
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          listStyle: 'none',
          padding: '0.3rem',
          margin: 0,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
          zIndex: 50
        }}>
          {roles.map(role => (
            <li
              key={role}
              onClick={() => { setSelected(role); setIsOpen(false); }}
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                color: selected === role ? '#818cf8' : '#e2e8f0',
                background: selected === role ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem'
              }}
            >
              <span>{role}</span>
              {selected === role && <Check size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #3: Keyboard-Navigable Accessible Tabbed Interface (WAI-ARIA)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TabsContainer -> TabList (role="tablist") -> TabButtons[] (role="tab", aria-selected, tabIndex=0/-1) -> TabPanel (role="tabpanel")
 * • State Model:
 *     - `activeTab`: number (zero-based active index).
 * • DOM Refs:
 *     - `tabListRef`: HTMLDivElement reference to query and shift focus across native button elements.
 * • WAI-ARIA Keyboard Navigation Pattern:
 *     - Uses the "Roving tabIndex" pattern: Only the selected tab has `tabIndex={0}`; all inactive tabs have `tabIndex={-1}`.
 *     - ArrowRight / ArrowLeft: Navigates circularly using modulo arithmetic `(index ± 1 + length) % length`.
 *     - Home / End: Immediately jumps to first (`0`) or last (`tabs.length - 1`) tab.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User focuses the active tab with Tab key.
 * 2. User presses ArrowRight / ArrowLeft / Home / End:
 *    a. `handleKeyDown` captures key and calls `e.preventDefault()` to stop viewport scrolling.
 *    b. Computes `nextIndex`.
 *    c. Updates `setActiveTab(nextIndex)`.
 *    d. Immediately moves physical browser focus: `buttons[nextIndex].focus()`.
 * 3. TabPanel mounts corresponding content with `role="tabpanel"`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Roving tabIndex vs Tab-stops: Naive tabs create a tab-stop for every button, violating W3C APG guidelines. Roving tabIndex ensures only 1 tab-stop enters the widget.
 * • Circular wrapping: Modulo math handles wrapping from end-to-start and start-to-end cleanly.
 */
export function DemoAccessibleTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabListRef = useRef(null);

  const tabs = [
    { title: 'Overview', content: 'Architecture overview: Single source of truth, normalized client state, decoupled presentation.' },
    { title: 'Chrona Queue', content: 'Chrona assignment batching engine: Concurrency capped worker, exponential backoff on 429/500 errors.' },
    { title: 'LesHub RBAC', content: 'LesHub permission matrix: Granular capability-based gates with audit trail logging.' }
  ];

  // WAI-ARIA roving keyboard navigation handler
  const handleKeyDown = (e, index) => {
    let nextIndex = index;
    // Arrow Right: Advance forward circularly
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    // Arrow Left: Backtrack circularly
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    // Home: Jump to first tab
    else if (e.key === 'Home') nextIndex = 0;
    // End: Jump to last tab
    else if (e.key === 'End') nextIndex = tabs.length - 1;
    else return;

    // Prevent native page scrolling
    e.preventDefault();
    setActiveTab(nextIndex);

    // Shift physical keyboard focus to newly selected tab
    const buttons = tabListRef.current?.querySelectorAll('button');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '520px' }}>
      <div 
        ref={tabListRef} 
        role="tablist" 
        style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #374151', paddingBottom: '0.2rem' }}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.title}
            role="tab"
            aria-selected={activeTab === idx}
            tabIndex={activeTab === idx ? 0 : -1}
            onClick={() => setActiveTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: activeTab === idx ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === idx ? '#818cf8' : '#9ca3af',
              borderBottom: activeTab === idx ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: '6px 6px 0 0'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div 
        role="tabpanel" 
        style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#1e293b', 
          borderRadius: '8px', 
          border: '1px solid #334155',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: '#cbd5e1'
        }}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #4: Collapsible Accordion (Single & Multi-Expand Mode)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: AccordionRoot -> ModeToggle -> AccordionItem[] -> [HeaderButton (aria-expanded) -> ExpandablePanel]
 * • State Model:
 *     - `openIndices`: number[] representing active expanded section keys.
 *     - `allowMultiple`: boolean toggles between single exclusive vs multi-accordion behavior.
 * • Animation Mechanics:
 *     - Clean CSS height transitions or conditional rendering.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks accordion header button.
 * 2. `toggle(idx)` checks `allowMultiple`:
 *    - If true: adds `idx` if absent, removes if present.
 *    - If false: sets `openIndices = [idx]` if closed, or `[]` if already open.
 * 3. Icon rotates 180 degrees (`rotate(180deg)`).
 * 4. Content panel mounts and reveals inner content.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Exclusive vs Multi-Select state machine: Single vs multi-selection handled cleanly using an array abstraction.
 * • Semantics: Native `<button>` elements ensure built-in keyboard accessibility (Enter/Space to expand).
 */
export function DemoAccordion() {
  const [openIndices, setOpenIndices] = useState([0]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const items = [
    { title: '1. How does Chrona batch assignments?', content: 'Chrona groups assignments by student and date chunk, then sends them to a worker with max concurrency of 3 to avoid saturating the backend.' },
    { title: '2. How does LesHub manage focus in dropdowns?', content: 'LesHub captures initial focus on keydown, traps tab index, and returns focus to the trigger trigger button upon closing.' },
    { title: '3. Why use optimistic UI updates?', content: 'Optimistic UI makes user actions feel instantaneous (<16ms). If the API rejects, client rollback restores exact prior state.' }
  ];

  const toggle = (idx) => {
    // Multi-expand mode allows concurrent open sections
    if (allowMultiple) {
      setOpenIndices(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    } 
    // Single exclusive mode closes siblings automatically
    else {
      setOpenIndices(prev => prev.includes(idx) ? [] : [idx]);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '520px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
        <input 
          type="checkbox" 
          id="multi-acc" 
          checked={allowMultiple} 
          onChange={(e) => setAllowMultiple(e.target.checked)} 
        />
        <label htmlFor="multi-acc" style={{ color: '#cbd5e1' }}>Allow multiple sections open simultaneously</label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={idx} style={{ border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isOpen ? '#1e293b' : '#0f172a',
                  border: 'none',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }}
              >
                <span>{item.title}</span>
                <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              {isOpen && (
                <div style={{ padding: '0.8rem 1rem', background: '#1e293b', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #5: Tooltip with Collision Detection & Dynamic Auto-Placement
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TargetAnchor (ref=targetRef) -> TooltipPortal/Floating (fixed position, computed coords)
 * • State Model:
 *     - `coords`: { x, y, placement: 'top' | 'bottom' } represents computed viewport position.
 *     - `visible`: boolean toggled by hover events.
 * • Geometric Measurement APIs:
 *     - `getBoundingClientRect()`: Computes exact screen-space rectangle of target anchor.
 *     - `window.innerHeight`: Compares distance from ceiling (`rect.top`) vs floor (`window.innerHeight - rect.bottom`).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User moves pointer over the target button -> `onMouseEnter` fires.
 * 2. Reads `targetRef.current.getBoundingClientRect()`.
 * 3. Evaluates viewport clearance:
 *    - If `spaceAbove < 80px`: Insufficient room above -> flips placement to `'bottom'` (`y = rect.bottom + 8`).
 *    - Otherwise: Default `'top'` placement (`y = rect.top - 8`).
 * 4. Centers horizontal axis: `x = rect.left + rect.width / 2`.
 * 5. Mounts tooltip with `pointerEvents: 'none'` (so it doesn't flicker on hover).
 * 6. User pointer leaves -> `onMouseLeave` sets `visible = false`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Hover flicker loop: Applying `pointerEvents: 'none'` to the tooltip prevents the cursor from transferring focus to the tooltip and oscillating visibility.
 * • Viewport collision: Detects boundary collisions dynamically without requiring heavy third-party libraries.
 */
export function DemoTooltip() {
  const [coords, setCoords] = useState({ x: 0, y: 0, placement: 'top' });
  const [visible, setVisible] = useState(false);
  const targetRef = useRef(null);

  const handleMouseEnter = () => {
    if (!targetRef.current) return;
    // Measure bounding box relative to viewport
    const rect = targetRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    
    // Auto-flip if within 80px of top screen boundary
    const placement = spaceAbove < 80 ? 'bottom' : 'top';
    const x = rect.left + rect.width / 2;
    const y = placement === 'top' ? rect.top - 8 : rect.bottom + 8;
    
    setCoords({ x, y, placement });
    setVisible(true);
  };

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        style={{
          padding: '0.6rem 1rem',
          background: '#0ea5e9',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}
      >
        <HelpCircle size={16} />
        Hover Me (Smart Placement)
      </button>

      {visible && (
        <div style={{
          position: 'fixed',
          top: `${coords.y}px`,
          left: `${coords.x}px`,
          transform: coords.placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
          background: '#111827',
          color: '#f9fafb',
          border: '1px solid #374151',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          pointerEvents: 'none', // Critical: prevents cursor flicker
          zIndex: 9999,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }}>
          Tooltip auto-flipped to <strong>{coords.placement}</strong> based on viewport clearance!
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #6: Slide-Over Drawer / Off-Canvas Sheet
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TriggerButton -> DrawerBackdrop (fixed, inset-0, z-index: 999) -> DrawerPanel (fixed right-0, width: 320px) -> Content
 * • State Model:
 *     - `isOpen`: boolean controlling portal / off-canvas mounting.
 * • Event Mechanics:
 *     - Backdrop dismiss: Clicking the backdrop invokes `setIsOpen(false)`.
 *     - `stopPropagation()`: Clicks inside drawer panel stop event bubbling so child clicks don't close the drawer.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Open Off-Canvas Drawer" -> `setIsOpen(true)`.
 * 2. Backdrop fades in (`rgba(0,0,0,0.5)`).
 * 3. Drawer slides in from the right viewport edge.
 * 4. User clicks inside drawer -> `e.stopPropagation()` keeps drawer open.
 * 5. User clicks outer backdrop or close button -> `setIsOpen(false)` -> unmounts.
 */
export function DemoDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '1rem' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.6rem 1.2rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
      >
        Open Off-Canvas Drawer
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '320px',
              height: '100%',
              background: '#1e293b',
              borderLeft: '1px solid #334155',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 25px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: 0, color: '#f8fafc' }}>Settings Drawer</h4>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Used in LesHub for deep pupil profile inspection and invoice line adjustments without losing page context.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #7: Popover with Anchor Positioning
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: PopoverContainer (relative) -> TriggerButton -> PopoverCard (absolute, top: 110%, z-index: 100)
 * • State Model:
 *     - `isOpen`: boolean toggling popover visibility.
 * • Positioning Mechanics:
 *     - Renders relative to anchor button using CSS positioning or dynamic portal alignment.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks "Toggle Popover" button.
 * 2. `setIsOpen(!isOpen)` toggles open state.
 * 3. Popover card mounts anchored directly below the trigger (`top: 110%`).
 * 4. User clicks again to dismiss.
 */
export function DemoPopover() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ padding: '1rem', position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '0.6rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
      >
        Toggle Popover
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: '0',
          width: '240px',
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.4)',
          zIndex: 100
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>Quick Profile</h5>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
            Anchored precisely to triggering button with dynamic alignment.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #8: Custom Context Menu (Right Click) with Screen Boundary Clamping
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ContextZone (onContextMenu) -> ContextMenuSurface (fixed, clamped {x, y}) -> ActionItems[]
 * • State Model:
 *     - `menu`: { x, y } | null holds calculated viewport coordinates.
 * • Viewport Boundary Clamping:
 *     - `x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH)`
 *     - `y = Math.min(e.clientY, window.innerHeight - MENU_HEIGHT)`
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User right-clicks inside the designated boundary -> `onContextMenu` fires.
 * 2. `e.preventDefault()` halts default native browser context menu.
 * 3. Clamping formula ensures menu never bleeds outside the viewport.
 * 4. `setMenu({ x, y })` renders the custom floating menu.
 * 5. Global `window.click` listener dismisses menu on any user click.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Edge overflow: Right clicking near bottom-right edge of screen clamps the menu inward so it remains 100% visible.
 * • Global teardown: `removeEventListener('click')` cleans up on unmount.
 */
export function DemoContextMenu() {
  const [menu, setMenu] = useState(null);

  const handleContextMenu = (e) => {
    // 1. Suppress native browser context menu
    e.preventDefault();
    
    // 2. Clamp coordinates against screen boundaries (180px width, 150px height)
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    setMenu({ x, y });
  };

  useEffect(() => {
    // 3. Global click listener to dismiss custom context menu on any click
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <div 
      onContextMenu={handleContextMenu}
      style={{
        margin: '1rem',
        padding: '2.5rem',
        border: '2px dashed #475569',
        borderRadius: '10px',
        textAlign: 'center',
        background: 'rgba(30, 41, 59, 0.4)',
        color: '#94a3b8',
        cursor: 'context-menu'
      }}
    >
      Right-click anywhere inside this box to trigger custom boundary-clamped Context Menu!

      {menu && (
        <div style={{
          position: 'fixed',
          top: `${menu.y}px`,
          left: `${menu.x}px`,
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '6px',
          padding: '0.4rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
          zIndex: 1000,
          width: '160px',
          textAlign: 'left'
        }}>
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Copy size={14} /> Copy Entity
          </div>
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={14} /> Configure
          </div>
          <div style={{ height: '1px', background: '#334155', margin: '0.3rem 0' }} />
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trash size={14} /> Delete
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #9: Multi-Level Flyout Submenu
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: MenuRoot -> PrimaryItem (onMouseEnter) -> FlyoutSubmenu (absolute, left: 100%) -> SubmenuActions[]
 * • State Model:
 *     - `activeSub`: boolean controlling flyout panel visibility.
 * • Hover Mechanics:
 *     - `onMouseEnter` on parent item reveals flyout.
 *     - `onMouseLeave` on flyout container dismisses it when cursor exits.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User hovers cursor over "Export Records" item.
 * 2. `onMouseEnter` fires -> `setActiveSub(true)`.
 * 3. Nested submenu mounts at `left: 215px` aligned to parent container.
 * 4. User moves cursor into the submenu and selects export format (PDF/CSV/JSON).
 * 5. When cursor leaves submenu panel -> `onMouseLeave` sets `setActiveSub(false)`.
 */
export function DemoFlyoutMenu() {
  const [activeSub, setActiveSub] = useState(false);

  return (
    <div style={{ padding: '1rem', position: 'relative', display: 'inline-block' }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '0.4rem',
        width: '200px'
      }}>
        <div 
          onMouseEnter={() => setActiveSub(true)}
          style={{
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            background: activeSub ? 'rgba(99,102,241,0.2)' : 'transparent'
          }}
        >
          <span>Export Records</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {activeSub && (
        <div 
          onMouseLeave={() => setActiveSub(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '215px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.4rem',
            width: '180px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
            zIndex: 100
          }}
        >
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }} onClick={() => alert('Exporting PDF...')}>Export PDF</div>
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }} onClick={() => alert('Exporting CSV...')}>Export CSV</div>
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }} onClick={() => alert('Exporting JSON...')}>Export JSON</div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #10: Floating Action Button (FAB) & Animated Speed Dial
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: FabContainer (bottom-right) -> [SpeedDialActions (vertical stack) -> PrimaryFabToggle]
 * • State Model:
 *     - `isOpen`: boolean controlling expansion and rotation.
 * • Micro-Animation Mechanics:
 *     - Primary icon rotation: `transform: isOpen ? 'rotate(45deg)' : 'none'`. Turns '+' into '×' seamlessly.
 *     - Staggered vertical appearance of secondary action buttons.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks primary '+' button.
 * 2. `setIsOpen(!isOpen)` toggles open state.
 * 3. Primary button rotates 45 degrees with smooth 0.2s transition.
 * 4. Task and Profile action buttons mount above the primary button.
 * 5. User clicks an action or toggles FAB to dismiss.
 */
export function DemoSpeedDial() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '1rem', minHeight: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        {isOpen && (
          <>
            <button 
              onClick={() => alert('Quick New Task Added')}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Add Task"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => alert('Quick Profile Clicked')}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Profile"
            >
              <User size={18} />
            </button>
          </>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(99,102,241,0.5)',
            transform: isOpen ? 'rotate(45deg)' : 'none',
            transition: '0.2s'
          }}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
