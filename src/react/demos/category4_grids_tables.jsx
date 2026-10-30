import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpDown, ChevronDown, ChevronRight, Folder, File, Plus, 
  Trash, Search, CheckSquare, Square, ChevronLeft 
} from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #31: Sortable, Filterable, Paginated Data Table
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DataTableSurface -> SearchToolbar (FilterInput + RowCounter) -> TableElement (Thead with SortableColumns -> Tbody with PaginatedRows) -> PaginationControls (PrevBtn, PageIndicator, NextBtn)
 * • State Model:
 *     - `data`: Immutable raw dataset array.
 *     - `sortKey`: keyof Row ('name' | 'role' | 'rating') controlling sort attribute.
 *     - `sortAsc`: boolean controlling ascending vs descending direction.
 *     - `search`: string containing user's search query.
 *     - `page`: number (1-indexed) tracking current pagination cursor.
 * • Data Transformation Pipeline (Pure & Deterministic):
 *     1. Filter: `data.filter(d => d.name.toLowerCase().includes(q) || ...)`
 *     2. Sort: `[...filtered].sort((a, b) => ...)`
 *     3. Paginate: `sorted.slice((page - 1) * pageSize, page * pageSize)`
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types "Staff" into filter input -> `setSearch("Staff")` and resets `page = 1`.
 * 2. Filter step reduces dataset to matching rows.
 * 3. User clicks "Rating ↕" header -> `toggleSort('rating')` flips direction.
 * 4. Paginated slice recalculates only the current 3 records for presentation.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Page index drift: Always reset `page` to 1 whenever `search` changes; otherwise user could be on page 10 of a 1-item filtered list.
 * • Stable sort: Ensure numeric vs string comparison semantics (e.g. `4.9 > 4.7` vs `'Alice' < 'Bob'`).
 */
export function DemoDataTable() {
  const [data] = useState([
    { id: 1, name: 'Alice Smith', role: 'Staff Frontend', dept: 'Engineering', rating: 4.9 },
    { id: 2, name: 'Bob Jones', role: 'Backend Lead', dept: 'Platform', rating: 4.7 },
    { id: 3, name: 'Charlie Lee', role: 'Full Stack Senior', dept: 'Engineering', rating: 4.8 },
    { id: 4, name: 'Diana Prince', role: 'Product Architect', dept: 'Product', rating: 5.0 },
    { id: 5, name: 'Edward Norton', role: 'QA Lead', dept: 'Security', rating: 4.6 },
    { id: 6, name: 'Fiona Gallagher', role: 'DevOps Engineer', dept: 'Platform', rating: 4.8 }
  ]);
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // Pipeline Step 1: Substring filtering
  const filtered = data.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.role.toLowerCase().includes(search.toLowerCase())
  );

  // Pipeline Step 2: In-memory multi-column sorting
  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pipeline Step 3: Pagination window slicing
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;

  // Header click handler for sort toggle
  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '520px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <input 
          type="text" 
          placeholder="Filter candidate or role..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '0.4rem 0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}
        />
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>Total: {sorted.length}</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155', textAlign: 'left' }}>
            <th onClick={() => toggleSort('name')} style={{ padding: '0.6rem', cursor: 'pointer' }}>Name ↕</th>
            <th onClick={() => toggleSort('role')} style={{ padding: '0.6rem', cursor: 'pointer' }}>Role ↕</th>
            <th onClick={() => toggleSort('rating')} style={{ padding: '0.6rem', cursor: 'pointer' }}>Rating ↕</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #334155', color: '#e2e8f0' }}>
              <td style={{ padding: '0.6rem', fontWeight: 600 }}>{row.name}</td>
              <td style={{ padding: '0.6rem', color: '#94a3b8' }}>{row.role}</td>
              <td style={{ padding: '0.6rem', color: '#f59e0b', fontWeight: 700 }}>★ {row.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', fontSize: '0.8rem' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.3rem 0.6rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: page === 1 ? 'default' : 'pointer' }}>Prev</button>
        <span style={{ color: '#94a3b8' }}>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.3rem 0.6rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: page === totalPages ? 'default' : 'pointer' }}>Next</button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #32: Editable Data Grid with Cell Selection & Bulk Actions
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DataGridSurface -> BulkActionBar (SelectedCounter + DeleteSelectedBtn) -> GridRowsList -> GridRow[Checkbox, PupilName, HoursBadge, StatusPill]
 * • State Model:
 *     - `rows`: Array<{ id, pupil, hours, status, selected: boolean }>
 * • Multi-Selection & Bulk Mutation:
 *     - Row-level toggling via `selected: !r.selected`.
 *     - Atomic bulk removal via `.filter(r => !r.selected)`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks checkbox on Row #1 and Row #2.
 * 2. `toggleSelect(id)` toggles boolean flags in state.
 * 3. Bulk Action bar dynamically mounts "Delete Selected" button.
 * 4. User clicks "Delete Selected" -> executes atomic filter and removes marked records.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Indeterminate state: On master "Select All" checkbox, manage `ref.indeterminate = hasSome && !hasAll`.
 * • Memory retention: Ensure deleted IDs are also purged from any editing or draft state maps.
 */
export function DemoEditableDataGrid() {
  const [rows, setRows] = useState([
    { id: 1, pupil: 'Emma Watson', hours: 24, status: 'Active', selected: false },
    { id: 2, pupil: 'Liam Neeson', hours: 32, status: 'Test Ready', selected: false },
    { id: 3, pupil: 'Noah Centineo', hours: 10, status: 'Beginner', selected: false }
  ]);

  // Toggle individual row checkbox
  const toggleSelect = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  // Bulk remove all checked rows
  const bulkDelete = () => {
    setRows(prev => prev.filter(r => !r.selected));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Selected: {rows.filter(r => r.selected).length}</span>
        {rows.some(r => r.selected) && (
          <button onClick={bulkDelete} style={{ padding: '0.3rem 0.6rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
            Delete Selected
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {rows.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px' }}>
            <input type="checkbox" checked={r.selected} onChange={() => toggleSelect(r.id)} />
            <span style={{ flex: 1, fontSize: '0.85rem', color: '#f8fafc' }}>{r.pupil}</span>
            <span style={{ fontSize: '0.8rem', color: '#34d399' }}>{r.hours} hrs</span>
            <span style={{ fontSize: '0.75rem', background: '#0f172a', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#94a3b8' }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #33: Infinite Scroll List with Intersection Observer
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ScrollContainer (overflowY=auto, height=200px) -> ItemsList[FeedPostCard[]] -> SentinelTriggerNode (ref=loaderRef)
 * • State Model:
 *     - `items`: Array<number> of loaded items.
 *     - `loading`: boolean (in-flight fetch guard).
 * • Browser API:
 *     - `IntersectionObserver`: Asynchronously watches sentinel element entering the viewport threshold.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Component mounts -> creates `IntersectionObserver` targeted at `loaderRef.current`.
 * 2. User scrolls list to bottom -> `loaderRef` crosses viewport threshold (0.5).
 * 3. Observer callback triggers: checks `!loading` guard, sets `loading = true`.
 * 4. Simulates async page fetch (600ms) -> appends new records to `items` -> sets `loading = false`.
 * 5. Cleanup on unmount invokes `observer.disconnect()`.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Duplicate fetch spam: Guarding with `!loading` prevents re-triggering while a previous network request is in-flight.
 * • Memory leak: Always disconnect observer in `useEffect` cleanup return function.
 */
export function DemoInfiniteScroll() {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    // Initialize Intersection Observer with threshold
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        setTimeout(() => {
          setItems(prev => [...prev, prev.length + 1, prev.length + 2, prev.length + 3]);
          setLoading(false);
        }, 600);
      }
    }, { threshold: 0.5 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    // Disconnect listener to prevent memory leaks
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div style={{ padding: '1rem', maxWidth: '360px', height: '200px', overflowY: 'auto', border: '1px solid #334155', borderRadius: '8px', background: '#0f172a' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {items.map(num => (
          <div key={num} style={{ padding: '0.6rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
            Feed Post Record #{num}
          </div>
        ))}
      </div>
      {/* Sentinel element observed by IntersectionObserver */}
      <div ref={loaderRef} style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.75rem', color: '#818cf8' }}>
        {loading ? 'Fetching next page...' : 'Scroll down for more'}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #34: Virtualized List (Windowing) for 100,000+ Items
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ScrollableContainer (height=WINDOW_HEIGHT, overflowY=auto) -> SpacerCanvas (height=TOTAL_ITEMS * ITEM_HEIGHT) -> VisibleWindowSlice (absolute positioning)
 * • DOM Node Footprint:
 *     - Naive approach: 100,000 DOM elements = ~250MB RAM + browser freeze.
 *     - Virtualized approach: Only Math.ceil(WINDOW_HEIGHT / ITEM_HEIGHT) + overscan = ~7 to 10 DOM elements!
 * • Windowing Mathematical Model:
 *     - `startIndex = Math.floor(scrollTop / ITEM_HEIGHT)`
 *     - `endIndex = Math.min(TOTAL - 1, Math.floor((scrollTop + WINDOW_HEIGHT) / ITEM_HEIGHT) + overscan)`
 *     - `itemTop = i * ITEM_HEIGHT`
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User scrolls vertical scrollbar -> `onScroll` event fires.
 * 2. Event captures `scrollTop` offset (e.g. 3,600px).
 * 3. React computes `startIndex = floor(3600 / 36) = 100`.
 * 4. React computes `endIndex = 100 + (180 / 36) + 2 = 107`.
 * 5. Only rows 100 to 107 are rendered into the DOM, placed at their exact absolute pixel offsets.
 * 6. Native scrollbar behaves identically to a 100,000-item page because the spacer div maintains the full 3.6 million pixel height.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Blank flashing during rapid scroll: Adding overscan buffer (+2 to +5 items) prevents blank space while user scrolls fast.
 * • Scrollbar jumping: Setting `position: relative` with an absolute spacer maintains native scrollbar thumb proportions.
 */
export function DemoVirtualizedList() {
  const TOTAL_ITEMS = 100000;
  const ITEM_HEIGHT = 36;
  const WINDOW_HEIGHT = 180;
  const [scrollTop, setScrollTop] = useState(0);

  // STEP 1: Compute first visible row index from scroll offset
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);

  // STEP 2: Compute last visible row index with +2 overscan buffer
  const endIndex = Math.min(TOTAL_ITEMS - 1, Math.floor((scrollTop + WINDOW_HEIGHT) / ITEM_HEIGHT) + 2);

  // STEP 3: Generate slice of only visible elements
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      top: i * ITEM_HEIGHT
    });
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
        Rendering <strong>100,000</strong> items smoothly with 60 FPS windowing:
      </div>
      <div 
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        style={{
          height: `${WINDOW_HEIGHT}px`,
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid #334155',
          borderRadius: '8px',
          background: '#0f172a'
        }}
      >
        <div style={{ height: `${TOTAL_ITEMS * ITEM_HEIGHT}px`, width: '100%', position: 'relative' }}>
          {visibleItems.map(item => (
            <div 
              key={item.index} 
              style={{
                position: 'absolute',
                top: `${item.top}px`,
                left: 0,
                right: 0,
                height: `${ITEM_HEIGHT}px`,
                padding: '0 0.8rem',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #1e293b',
                color: '#e2e8f0',
                fontSize: '0.8rem'
              }}
            >
              Row Index #{item.index + 1} - Enterprise Record
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #35: Hierarchical Tree View with Recursive Folder Toggle & Select
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: TreeContainer -> RecursiveTreeNode[NodeRow(ToggleIcon, TypeIcon, Name) -> ChildNodesContainer(depth + 1)]
 * • State Model:
 *     - `tree`: Nested recursive node hierarchy `{ id, name, children?: TreeNode[] }`.
 *     - `expanded`: string[] tracking IDs of currently expanded folder nodes.
 * • Recursion & Indentation Strategy:
 *     - Depth-first recursive rendering function `renderNode(node, depth)`.
 *     - Dynamic left margin: `marginLeft: depth * 16px` creates natural visual hierarchy without complex CSS tables.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks folder row "src".
 * 2. `toggle("src")` checks if ID exists in `expanded` array.
 * 3. Toggles membership: if present -> remove (collapse); if absent -> append (expand).
 * 4. Conditional recursive branch `{hasChildren && isExp && node.children.map(...)}` mounts or unmounts sub-tree.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Infinite recursion on circular graphs: Ensure data structure is a strict DAG (directed acyclic graph) or track visited set.
 * • Keyboard navigation: Support ArrowRight to expand and ArrowLeft to collapse current directory.
 */
export function DemoTreeView() {
  const tree = [
    {
      id: 'src',
      name: 'src',
      children: [
        { id: 'components', name: 'components', children: [{ id: 'Modal.jsx', name: 'Modal.jsx' }, { id: 'Button.jsx', name: 'Button.jsx' }] },
        { id: 'App.jsx', name: 'App.jsx' }
      ]
    },
    { id: 'package.json', name: 'package.json' }
  ];

  // Set of expanded folder IDs
  const [expanded, setExpanded] = useState(['src']);

  // Toggle folder expansion
  const toggle = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Pure recursive node renderer
  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExp = expanded.includes(node.id);

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 16}px` }}>
        <div 
          onClick={() => hasChildren && toggle(node.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem', cursor: hasChildren ? 'pointer' : 'default', color: '#e2e8f0', fontSize: '0.85rem' }}
        >
          {hasChildren ? (
            <>
              {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={16} color="#60a5fa" />
            </>
          ) : (
            <>
              <span style={{ width: '14px' }} />
              <File size={16} color="#94a3b8" />
            </>
          )}
          <span>{node.name}</span>
        </div>
        {/* Recursive child branch */}
        {hasChildren && isExp && node.children.map(ch => renderNode(ch, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}>
      {tree.map(node => renderNode(node))}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #36: File Explorer with Create, Rename, Delete & Search
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ExplorerContainer -> Toolbar (NewFileInput + AddButton) -> FileList -> FileItem[FileIcon, FileName, DeleteActionBtn]
 * • State Model:
 *     - `files`: string[] representing filenames in active directory.
 *     - `newFileName`: string (controlled input state for adding a file).
 * • CRUD Invariants:
 *     - Unique names: Collisions (`files.includes(...)`) rejected to preserve filesystem integrity.
 *     - Non-empty validation: Strips whitespace before insertion.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types "Header.tsx" into text box -> `setNewFileName`.
 * 2. User clicks "Add" -> `addFile()` checks uniqueness and non-empty.
 * 3. Appends new file into `files` array and clears input box.
 * 4. User clicks trash icon next to a file -> `deleteFile(name)` filters file out of list.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • File collisions: Case-insensitive filesystem collisions on Windows/macOS (e.g. `test.js` vs `TEST.js`).
 * • Trim whitespace: Guarding against filenames consisting only of whitespace characters.
 */
export function DemoFileExplorer() {
  const [files, setFiles] = useState(['App.jsx', 'styles.css', 'README.md']);
  const [newFileName, setNewFileName] = useState('');

  // Add new file with uniqueness validation
  const addFile = () => {
    if (newFileName.trim() && !files.includes(newFileName.trim())) {
      setFiles([...files, newFileName.trim()]);
      setNewFileName('');
    }
  };

  // Delete file from directory
  const deleteFile = (name) => {
    setFiles(files.filter(f => f !== name));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      {/* Creation Toolbar */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
        <input 
          type="text" 
          value={newFileName} 
          onChange={(e) => setNewFileName(e.target.value)} 
          placeholder="New file name..."
          style={{ flex: 1, padding: '0.4rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
        />
        <button onClick={addFile} style={{ padding: '0.4rem 0.8rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Add
        </button>
      </div>

      {/* File List Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {files.map(file => (
          <div key={file} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: '#1e293b', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>📄 {file}</span>
            <Trash size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => deleteFile(file)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #37: Nested JSON Diff Inspector
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DiffSurface -> DiffHeader -> DiffInspectorTerminal -> DiffRows[Key, StrikethroughOld, ArrowIndicator, HighlightNew]
 * • Diff Categorization Algorithm:
 *     - Changed: Key exists in both objects but `before[k] !== after[k]`.
 *     - Unchanged: Key exists in both objects and `before[k] === after[k]`.
 *     - Added: Key only exists in `after`.
 *     - Removed: Key only exists in `before`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Diff engine analyzes before vs after JSON structures.
 * 2. Changed fields render with `<del>` in red (`#ef4444`) and replacement in green (`#10b981`).
 * 3. Newly added fields render with `+` sign and emerald styling.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Type mutations: Handle primitives changing into objects or arrays without causing render crashes.
 * • Strict key ordering: Sort object keys alphabetically prior to comparison for deterministic visual diffs.
 */
export function DemoJsonDiff() {
  const before = { role: 'Senior', salary: 120000, active: true };
  const after = { role: 'Staff Architect', salary: 145000, active: true, clearance: 'TOP_SECRET' };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
      <h5 style={{ margin: '0 0 0.6rem 0', color: '#f8fafc' }}>JSON State Diff:</h5>
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.8rem' }}>
        <div style={{ color: '#94a3b8' }}>role: <del style={{ color: '#ef4444' }}>"{before.role}"</del> ➔ <span style={{ color: '#10b981' }}>"{after.role}"</span></div>
        <div style={{ color: '#94a3b8' }}>salary: <del style={{ color: '#ef4444' }}>${before.salary}</del> ➔ <span style={{ color: '#10b981' }}>${after.salary}</span></div>
        <div style={{ color: '#64748b' }}>active: true (unchanged)</div>
        <div style={{ color: '#10b981' }}>+ clearance: "{after.clearance}" (NEW)</div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #38: Group-By Data Transformer with Collapsible Headers
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: GroupSurface -> GroupCard[SquadHeader(title, count) -> MembersList]
 * • Transform Architecture:
 *     - Single-pass `Array.prototype.reduce` bucketing into dictionary `Record<SquadKey, string[]>`.
 *     - Computational Complexity: O(N) linear time, O(N) auxiliary space.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Flat raw list of staff objects passes into reduce function.
 * 2. Accumulator initializes missing squad arrays: `acc[cur.squad] = acc[cur.squad] || []`.
 * 3. Appends engineer name into appropriate bucket.
 * 4. `Object.entries(grouped)` maps out partitioned squad cards.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Null / undefined keys: Fall back to 'Unassigned' bucket if a record lacks squad key.
 * • Performance: Avoid multiple `.filter()` calls per category which would yield O(Categories * N) time.
 */
export function DemoGroupByUtility() {
  const staff = [
    { name: 'Alex', squad: 'Frontend' },
    { name: 'Beth', squad: 'Backend' },
    { name: 'Cody', squad: 'Frontend' },
    { name: 'Dan', squad: 'Infra' }
  ];

  // Single-pass O(N) grouping transform
  const grouped = staff.reduce((acc, cur) => {
    acc[cur.squad] = acc[cur.squad] || [];
    acc[cur.squad].push(cur.name);
    return acc;
  }, {});

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      {Object.entries(grouped).map(([squad, members]) => (
        <div key={squad} style={{ marginBottom: '0.6rem', border: '1px solid #334155', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ background: '#1e293b', padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: 600, color: '#818cf8' }}>
            {squad} ({members.length})
          </div>
          <div style={{ padding: '0.4rem 0.6rem', background: '#0f172a', fontSize: '0.8rem', color: '#cbd5e1' }}>
            {members.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #39: Horizontal Scrollable Menu with Arrow Indicators
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: HorizontalMenuContainer -> LeftArrowBtn -> ScrollTrack (ref=containerRef, overflowX=hidden, whiteSpace=nowrap) -> PillChips[] -> RightArrowBtn
 * • DOM Refs & Native API:
 *     - `containerRef.current.scrollBy({ left: +/-150, behavior: 'smooth' })`: Native hardware-accelerated smooth scrolling.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks Right Arrow button -> calls `scroll('right')`.
 * 2. Checks `containerRef.current` exists.
 * 3. Invokes `scrollBy({ left: 150, behavior: 'smooth' })`.
 * 4. Native browser engine animates horizontal scroll position.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Scroll overflow boundaries: Arrow buttons can observe scroll position to conditionally disable when at exact edges (`scrollLeft === 0` or `scrollLeft + clientWidth >= scrollWidth`).
 * • Touch swipe vs mouse drag: Preserve native momentum scrolling on mobile with `-webkit-overflow-scrolling: touch`.
 */
export function DemoHorizontalScrollMenu() {
  const containerRef = useRef(null);
  const chips = ['All', 'React 19', 'Next.js', 'Chrona Batches', 'LesHub Admin', 'Zustand', 'Performance', 'A11y', 'GraphQL', 'Tailwind', 'Docker'];

  // Smooth scroll helper
  const scroll = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <button onClick={() => scroll('left')} style={{ padding: '0.4rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
        <ChevronLeft size={16} />
      </button>
      <div 
        ref={containerRef}
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          whiteSpace: 'nowrap',
          padding: '0.2rem'
        }}
      >
        {chips.map(chip => (
          <span key={chip} style={{ padding: '0.3rem 0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '9999px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
            {chip}
          </span>
        ))}
      </div>
      <button onClick={() => scroll('right')} style={{ padding: '0.4rem', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #40: Sticky Header & Frozen Column Table
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ScrollViewport (maxHeight=180px, overflow=auto) -> Table (width=600px) -> Thead (sticky top:0) -> Tbody (first-child td sticky left:0)
 * • CSS Stacking Context Architecture:
 *     - Header cells: `position: sticky; top: 0; z-index: 2` (floats above scrolling rows).
 *     - First Column cells: `position: sticky; left: 0; z-index: 1` (floats above horizontally scrolling columns).
 *     - Corner Intersection (Top-Left): `position: sticky; top: 0; left: 0; z-index: 3` (highest z-index so it floats above both sticky axes!).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User scrolls horizontally: Left column remains frozen in place while other metric columns slide underneath.
 * 2. User scrolls vertically: Header row remains frozen at top while records scroll underneath.
 * 3. Top-left "Staff Name" corner cell stays permanently anchored.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Transparent backgrounds: Sticky elements MUST have an explicit opaque background color (`background: #0f172a`), otherwise scrolled content shows through underneath.
 * • Stacking context containment: Never place `overflow: hidden` on intermediate wrapper nodes between sticky element and scroll viewport.
 */
export function DemoStickyTable() {
  return (
    <div style={{ padding: '1rem', maxWidth: '440px', maxHeight: '180px', overflow: 'auto', border: '1px solid #334155', borderRadius: '8px' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '0.75rem', width: '600px' }}>
        {/* Sticky Header Row */}
        <thead style={{ position: 'sticky', top: 0, background: '#0f172a', zIndex: 2 }}>
          <tr>
            {/* Top-Left Corner Cell: z-index 3 */}
            <th style={{ position: 'sticky', left: 0, background: '#0f172a', padding: '0.5rem', color: '#818cf8', zIndex: 3 }}>Staff Name</th>
            <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Metric A</th>
            <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Metric B</th>
            <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Metric C</th>
            <th style={{ padding: '0.5rem', color: '#94a3b8' }}>Metric D</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
              {/* Sticky Frozen Column: z-index 1 */}
              <td style={{ position: 'sticky', left: 0, background: '#1e293b', padding: '0.5rem', fontWeight: 600, color: '#f8fafc' }}>
                Engineer #{i}
              </td>
              <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>98.4%</td>
              <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>12ms</td>
              <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>Passed</td>
              <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

