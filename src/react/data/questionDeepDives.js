// Master Question Deep Dives Registry (Q1 - Q100)
// Provides in-depth UX Rationales, Industry Real-World Use Cases,
// and Senior Technical Interview Questions with Comprehensive Model Answers.

export const CURATED_DEEP_DIVES = {
  // Q1: Accessible Modal Dialog
  1: {
    uxRationale: "Why use a Modal instead of Full-Page Navigation? Route switches unmount the host page tree, wiping active state, form drafts, scroll position, and filters, while incurring costly round-trip re-renders. Modals allow completing transient sub-tasks directly in context, enforce focused attention with an isolating backdrop, and eliminate unnecessary navigation hops.",
    realWorldUseCases: [
      {
        title: "Avoid Unnecessary Page Navigations & Context Loss",
        detail: "Editing quick notes or rescheduling a student session in LesHub directly over the master calendar grid without triggering a disruptive page reload."
      },
      {
        title: "Critical Friction & Destructive Confirmation",
        detail: "Two-step confirmation modals before deleting databases, voiding transactions, or terminating subscriptions to force deliberate user confirmation."
      },
      {
        title: "In-Flight Authentication & 2FA Challenges",
        detail: "When auth tokens expire during lengthy form completion, presenting an in-context login/OTP modal prevents losing all unsaved form inputs."
      },
      {
        title: "High-Conversion Checkout & Payment Overlays",
        detail: "Hosting Stripe or payment provider elements in an isolated overlay to keep the customer grounded on the cart review screen."
      }
    ],
    interviewQA: [
      {
        question: "Why must a modal be rendered via React Portal into document.body instead of inline within the component hierarchy?",
        answer: "If rendered inline, parent CSS properties such as `overflow: hidden`, `position: relative`, or CSS `transform/filter` create a new stacking context and viewport clipping boundary. This causes the modal backdrop to be clipped or trapped behind sibling elements regardless of z-index. Portaling to document.body guarantees top-level document stacking."
      },
      {
        question: "How do you prevent focus from escaping to the background document when the user presses Tab or Shift+Tab?",
        answer: "We implement a Focus Trap. Upon opening, we query all natively tabbable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])`). In a global keydown handler, if `e.key === 'Tab'`, we check if `document.activeElement` is the last focusable element; if so, we call `e.preventDefault()` and move focus to the first element. Conversely, for `Shift + Tab` on the first element, we wrap to the last."
      },
      {
        question: "What happens to keyboard focus when the modal closes?",
        answer: "In WCAG 2.1 compliance, focus must be restored to the exact trigger element that opened the dialog (`triggerRef.current.focus()`). Without this, the browser focus drops to the top of <body>, forcing screen reader and keyboard users to re-tab through the entire page."
      }
    ]
  },

  // Q2: Click Outside Hook & Dropdown Menu
  2: {
    uxRationale: "Why use Click-Outside dismissal instead of explicit Close buttons or route navigation? Dropdown menus, popovers, and filters are lightweight contextual tools. Requiring an explicit close button slows users down, while navigating to another page ruins the continuous browsing experience. Click-outside creates an intuitive, low-friction dismissal model identical to native OS desktop menus.",
    realWorldUseCases: [
      {
        title: "Enterprise Multi-Select Filters",
        detail: "Selecting multiple driver statuses or lesson types in LesHub filter bars without losing focus or needing to click an 'Apply & Close' button every time."
      },
      {
        title: "Global User Profile & Account Switcher",
        detail: "Clicking the top-right avatar menu to switch workspaces or log out, with automatic dismissal as soon as the user clicks anywhere else."
      },
      {
        title: "Inline Data Table Row Actions",
        detail: "Opening an ellipsis (⋯) menu to 'Edit', 'Duplicate', or 'Archive' a record without locking the viewport."
      }
    ],
    interviewQA: [
      {
        question: "Why should you use 'pointerdown' or 'mousedown' instead of 'click' when detecting outside clicks?",
        answer: "The 'click' event fires only after mouseup. If a user clicks an element that immediately unmounts itself or mutates the DOM, by the time 'click' bubbles to document, `ref.current.contains(e.target)` returns false because the clicked node is no longer attached to the document. Using `pointerdown` catches the interaction before unmounting and eliminates the 300ms touch delay on mobile."
      },
      {
        question: "How do you handle multiple boundary refs (e.g., keeping the dropdown open when clicking the trigger button)?",
        answer: "Instead of a single ref, accept an array of refs `(refs, callback)`. The handler iterates through all refs: `const isInside = refs.some(ref => ref.current?.contains(event.target))`. Only trigger the callback if `!isInside`."
      }
    ]
  },

  // Q3: Accessible Tabbed Interface (WAI-ARIA)
  3: {
    uxRationale: "Why use Tabs instead of Multi-Page Navigation? Tabs group strongly related sub-sections of a single entity (e.g., User Profile: 'General', 'Security', 'Billing') on one screen. Page navigation would force full re-renders and wipe unsaved cross-tab drafts. WAI-ARIA keyboard navigation ensures accessibility without mouse dependence.",
    realWorldUseCases: [
      {
        title: "Chrona Student Profile Hub",
        detail: "Switching between 'Lesson History', 'Upcoming Drives', and 'Payment Records' without leaving the student page."
      },
      {
        title: "Developer Console / API Dashboard",
        detail: "Toggling between 'Headers', 'Body', 'Query Params', and 'Test Scripts' in Postman/Swagger-style tools."
      },
      {
        title: "Settings & Preference Panels",
        detail: "Organizing dense enterprise configurations into digestible categories while preserving dirty form inputs across tabs."
      }
    ],
    interviewQA: [
      {
        question: "What is the Roving tabIndex pattern and why is it preferred over standard tabbing for tabs?",
        answer: "In WAI-ARIA, a tablist is treated as a single compound widget. Pressing 'Tab' should move into the selected tab button, and the next 'Tab' should immediately move into the tab panel content. Arrow keys (ArrowLeft/ArrowRight) navigate circularly between the tabs by setting `tabIndex={0}` on the active tab and `tabIndex={-1}` on inactive tabs."
      },
      {
        question: "What ARIA attributes are required for complete screen reader accessibility in a Tab interface?",
        answer: "The container needs `role='tablist'`. Each button needs `role='tab'`, `aria-selected={true|false}`, and `aria-controls='panel-id'`. The content container needs `role='tabpanel'`, `id='panel-id'`, and `aria-labelledby='tab-id'`."
      }
    ]
  },

  // Q4: Collapsible Accordion
  4: {
    uxRationale: "Why use Accordions instead of Separate Pages or Infinite Scrolling? Accordions reduce cognitive overload by progressively disclosing content. In complex workflows like FAQs, checkout review steps, or multi-criteria audits, users can drill down into what matters without losing page context or endlessly scrolling.",
    realWorldUseCases: [
      {
        title: "Checkout Order Summaries",
        detail: "Expanding 'Delivery Address', 'Payment Details', and 'Review Items' in an e-commerce funnel."
      },
      {
        title: "LesHub Driving School Curriculum Guide",
        detail: "Breaking down 40 driving modules into manageable weekly chapters that instructors can expand on demand."
      },
      {
        title: "Complex Filter Drawers",
        detail: "Grouping 30+ filter attributes into collapsible categories (Price, Brand, Rating, Location)."
      }
    ],
    interviewQA: [
      {
        question: "How do you animate height: auto smoothly in modern CSS without knowing exact pixel heights?",
        answer: "Historically developers used `max-height: 500px` hacks which felt laggy. Today, the standard senior solution is CSS Grid: set the container to `display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease;`. On open, switch to `grid-template-rows: 1fr;` with inner element set to `overflow: hidden; min-height: 0;`."
      },
      {
        question: "How do you structure the state machine to support both Single-Exclusive and Multi-Expand modes?",
        answer: "Store open sections as a Set or Array of IDs: `const [openIds, setOpenIds] = useState([])`. For single mode: `setOpenIds(openIds.includes(id) ? [] : [id])`. For multi mode: `setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])`."
      }
    ]
  },

  // Q11: OTP / PIN Input
  11: {
    uxRationale: "Why use a segmented PIN input instead of a single standard text field? Segmented inputs eliminate user uncertainty about code length, allow instant auto-advance on keystroke, support seamless multi-box paste, and give immediate visual feedback for 2FA/SMS verifications.",
    realWorldUseCases: [
      {
        title: "2FA / MFA Login Gate",
        detail: "Entering 6-digit authenticator app codes when accessing high-security admin areas in Chrona or banking apps."
      },
      {
        title: "SMS Phone Verification",
        detail: "Verifying learner mobile numbers during registration in LesHub with auto-focus advance."
      },
      {
        title: "Debit Card ATM PIN Entry",
        detail: "High-security payment authorization with masked digits and automatic submission on completion."
      }
    ],
    interviewQA: [
      {
        question: "How do you handle multi-character paste events across separated input boxes?",
        answer: "Attach `onPaste` on each input. Parse pasted text via `e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length)`. Split into digits, map into state array, and programmatically shift focus to the last populated input or next empty input using refs array."
      },
      {
        question: "How do you implement natural backspace navigation across empty and non-empty inputs?",
        answer: "On `onKeyDown`: if `e.key === 'Backspace'`, check if current box is non-empty. If non-empty, clear current value. If already empty, shift focus to `inputsRef.current[index - 1]` and clear that previous value. This prevents double-clearing bugs."
      }
    ]
  },

  // Q14: Search Autocomplete / Typeahead with Debounce
  14: {
    uxRationale: "Why use Debounced Typeahead instead of Search-on-Submit or Full Page Search? Navigating to a full search results page interrupts the user flow and requires a full page load. Debounced typeahead surfaces real-time suggestions inline while reducing API server load by 90% through timing throttle.",
    realWorldUseCases: [
      {
        title: "LesHub Global Student / Instructor Lookup",
        detail: "Quick-searching pupils across 10,000 driving schools from the top navigation bar without navigating away."
      },
      {
        title: "Address & Geolocation Auto-complete",
        detail: "Fetching street addresses from Google Maps API as the user types their lesson pickup location."
      },
      {
        title: "E-Commerce Instant Product Search",
        detail: "Displaying product thumbnails, price, and in-stock badges directly below the search bar."
      }
    ],
    interviewQA: [
      {
        question: "How do you prevent Race Conditions when an earlier network response returns AFTER a later response?",
        answer: "Use `AbortController` or a request sequence ID. In `useEffect`, create `const controller = new AbortController()`. Pass `controller.signal` to `fetch()`. In the cleanup return function, call `controller.abort()`. When rapid typing triggers new requests, stale requests are cancelled before resolving."
      },
      {
        question: "How do you make an Autocomplete fully accessible according to WAI-ARIA combobox guidelines?",
        answer: "Input has `role='combobox'`, `aria-expanded={isOpen}`, `aria-autocomplete='list'`, and `aria-activedescendant='option-id'`. Dropdown has `role='listbox'` with children having `role='option'`. ArrowUp and ArrowDown cycle active index without taking physical focus out of the input."
      }
    ]
  },

  // Q21: Chrona Assignment Batching & Queue Worker
  21: {
    uxRationale: "Why use client-side Request Batching & Queue Workers instead of firing immediate individual API calls? High-frequency user actions (e.g. bulk selecting 500 lessons or rapid checkbox toggles) can saturate network sockets, trigger 429 Rate Limits, and crash microservices. A client queue buffers, deduplicates, and flushes payloads in optimal chunks.",
    realWorldUseCases: [
      {
        title: "Chrona Bulk Student Slot Scheduling",
        detail: "Assigning 200 lessons across multiple instructors; the client queues requests in 20-item batches to prevent server timeouts."
      },
      {
        title: "Analytics & Telemetry Beacon Dispatch",
        detail: "Collecting user clickstream events and flushing every 3 seconds or when queue size reaches 25 items."
      },
      {
        title: "Collaborative Whiteboard Canvas Mutations",
        detail: "Batching vector path updates in Figma/Canva before streaming over WebSockets."
      }
    ],
    interviewQA: [
      {
        question: "How do you implement an async queue worker with concurrency control in pure JavaScript/React?",
        answer: "Maintain an in-memory queue array and an `activeWorkers` counter. A recursive `drainQueue` function runs while `activeWorkers < MAX_CONCURRENCY` and `queue.length > 0`. Each worker pulls a task, increments `activeWorkers`, awaits completion with exponential backoff on failure, decrements `activeWorkers`, and calls `drainQueue` again."
      },
      {
        question: "How do you guarantee batch delivery if the user closes the browser tab?",
        answer: "Use `navigator.sendBeacon(url, data)` inside `window.onbeforeunload` or `document.visibilitychange`. Unlike standard `fetch`, `sendBeacon` transfers payloads asynchronously in the browser background without blocking unmount."
      }
    ]
  },

  // Q22: Optimistic UI Updates with Rollback
  22: {
    uxRationale: "Why use Optimistic UI instead of blocking spinners? Waiting 800ms for server responses on likes, comments, or status changes makes applications feel sluggish and unresponsive. Optimistic UI instantly mutates the UI under the assumption of success, while maintaining a rollback snapshot in case of network rejection.",
    realWorldUseCases: [
      {
        title: "Social Interactions (Likes, Bookmarks, Upvotes)",
        detail: "Twitter/Reddit style instant heart animation while API processes in background."
      },
      {
        title: "LesHub Lesson Status Toggle",
        detail: "Marking a lesson as 'Completed' or 'Cancelled' in the schedule grid with instant visual checkmark."
      },
      {
        title: "Kanban Task Reordering",
        detail: "Moving cards between columns in Trello/Jira with instant snap; rolling back if server responds with 403 Forbidden."
      }
    ],
    interviewQA: [
      {
        question: "How do you cleanly structure optimistic state rollback in React without stale closure bugs?",
        answer: "Save the previous state snapshot before mutating: `const previousData = cache.get(key)`. Optimistically update: `setData(optimisticData)`. Wrap API call in `try/catch`. In `catch`, revert state: `setData(previousData)` and display a localized error toast with a 'Retry' action."
      },
      {
        question: "How do you handle race conditions when two optimistic mutations happen in rapid succession on the same entity?",
        answer: "Assign a monotonic revision counter or timestamp to each optimistic mutation. When applying an optimistic update or rollback, verify whether newer mutations have occurred. If newer mutations exist, recompute the delta on top of the latest confirmed server response rather than blindly restoring stale snapshots."
      }
    ]
  },

  // Q31: Data Table with Sorting, Multi-Filter & Pagination
  31: {
    uxRationale: "Why use Client/Server Hybrid Data Tables instead of static cards or endless scrolling? Enterprise operations require precise inspection, multi-dimensional sorting, and targeted subset filtering across thousands of records. Tables maximize information density and provide predictable pagination boundaries.",
    realWorldUseCases: [
      {
        title: "LesHub Instructor Payroll & Invoicing",
        detail: "Filtering 5,000 driving lesson records by date range, payment status, and instructor ID with column-based sorting."
      },
      {
        title: "AWS CloudWatch Logs & Metrics Inspection",
        detail: "Searching server logs by severity level, timestamp, and container ID with multi-column sorting."
      },
      {
        title: "E-Commerce Admin Inventory Manager",
        detail: "Managing 20,000 SKUs with bulk status changes, category filters, and pagination."
      }
    ],
    interviewQA: [
      {
        question: "Why should you reset currentPage to 1 whenever any filter or search query changes?",
        answer: "If the user is on page 10 of an unfiltered list (1,000 items) and applies a search filter that matches only 8 items (1 page), remaining on page 10 renders an empty table ('No data found'). Automatically resetting to page 1 avoids this critical UX defect."
      },
      {
        question: "When should sorting and filtering be performed on the client vs on the server?",
        answer: "For datasets under ~5,000 items, client-side sorting/filtering with `useMemo` provides zero-latency instant responses. For datasets exceeding 10,000 items or large databases, sorting and filtering must be pushed to SQL/Elasticsearch indexes with URL query param synchronization (`?page=1&sort=name&dir=asc`)."
      }
    ]
  },

  // Q34: Virtualized List (Windowing) for 100,000 Items
  34: {
    uxRationale: "Why use Virtualization (Windowing) instead of native Array.prototype.map()? Mapping 100,000 DOM elements freezes the browser main thread, consumes hundreds of megabytes of RAM, and drops framerates to zero. Virtualization renders only the 20-30 visible items inside the viewport window, achieving steady 60fps performance.",
    realWorldUseCases: [
      {
        title: "Slack / Discord Infinite Message Channels",
        detail: "Browsing 500,000 chat messages smoothly without crashing mobile or desktop browser memory."
      },
      {
        title: "High-Frequency Stock Ticker & Order Book",
        detail: "Rendering thousands of real-time crypto/stock trades updating at 50Hz without DOM thrashing."
      },
      {
        title: "LesHub Enterprise Audit & System Log",
        detail: "Scrolling through 100,000 driving session logs and audit trails instantaneously."
      }
    ],
    interviewQA: [
      {
        question: "What is the mathematical algorithm behind fixed-size list virtualization?",
        answer: "Given `scrollTop`, `viewportHeight`, and fixed `itemHeight`: `startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)`. `endIndex = Math.min(totalItems - 1, Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan)`. A total spacer div is rendered with `height = totalItems * itemHeight`, and the visible slice items are translated using `transform: translateY(startIndex * itemHeight)`."
      },
      {
        question: "What is the purpose of the 'overscan' buffer in virtualized windowing?",
        answer: "Overscan renders 3-5 items above and below the visible viewport boundaries. When the user scrolls rapidly, overscan items are already painted, preventing white flashes or blank gaps before the scroll event callback computes the next slice."
      }
    ]
  },

  // Q41: Kanban Board with Drag & Drop
  41: {
    uxRationale: "Why use a Kanban Board instead of List Views or Page-by-Page Status Updates? Kanban visualizes workflow pipelines (Backlog -> In Progress -> Review -> Done) at a single glance. Drag-and-drop status transitions provide high spatial memory and eliminate cumbersome drop-down status editing.",
    realWorldUseCases: [
      {
        title: "Chrona Driving Instructor Onboarding Pipeline",
        detail: "Dragging applicant instructors from 'Document Review' to 'Background Check' to 'Active Roster'."
      },
      {
        title: "Sprint Agile Management (Jira/Linear)",
        detail: "Moving engineering user stories across swimlanes with priority sorting."
      },
      {
        title: "Recruiting Applicant Tracking System (ATS)",
        detail: "Moving candidate resumes between Interview rounds with instant column counter updates."
      }
    ],
    interviewQA: [
      {
        question: "What are the trade-offs between HTML5 Drag and Drop API vs Pointer Events with requestAnimationFrame?",
        answer: "HTML5 DnD is native and handles drag images out-of-the-box, but has inconsistent mobile touch support, limited styling capabilities, and clumsy drag ghosts. Pointer Events with `requestAnimationFrame` provide full touch/mouse unification, smooth 60fps physics, custom drag previews, and pixel-perfect drop target hit-testing."
      },
      {
        question: "How do you persist column and card order changes without sending 100 API updates?",
        answer: "Use fractional indexing (LexoRank / floating midpoints). Instead of re-indexing every card with integers (0, 1, 2, 3), assign a float or string midpoint between adjacent items: `newRank = (prevRank + nextRank) / 2`. Only a single record's rank needs updating in the database."
      }
    ]
  },

  // Q51: useDebounce and useDebouncedCallback
  51: {
    uxRationale: "Why use useDebounce instead of firing handlers on every keystroke? Typing at 300 WPM can trigger 10-15 state updates and network calls per second. Debouncing waits until the user pauses typing for N milliseconds, eliminating server strain and unnecessary component re-renders.",
    realWorldUseCases: [
      {
        title: "Real-time Search Input Suggestion",
        detail: "Waiting 300ms after user stops typing before dispatching autocomplete API queries."
      },
      {
        title: "Form Auto-Save to Cloud",
        detail: "Auto-saving document drafts in Notion or Google Docs 1000ms after the last edit."
      },
      {
        title: "Window Resize & Chart Re-rendering",
        detail: "Recalculating responsive SVG charts only when the user finishes dragging the browser window."
      }
    ],
    interviewQA: [
      {
        question: "How do you write a memory-leak-safe useDebounce hook in React?",
        answer: "Maintain internal debounced state `[debouncedValue, setDebouncedValue]`. In `useEffect`, create `const timer = setTimeout(() => setDebouncedValue(value), delay)`. Return a cleanup function `() => clearTimeout(timer)`. If `value` or `delay` changes before timeout fires, the existing timer is cleared, resetting the delay."
      },
      {
        question: "What is the difference between useDebounce (value) and useDebouncedCallback (function)?",
        answer: "`useDebounce` delays the update of a reactive state variable, causing effects dependent on that state to trigger later. `useDebouncedCallback` wraps an imperative function (e.g. `sendAnalytics()`) using `useRef` to preserve the latest closure while returning a stable function reference that will not trigger re-renders."
      }
    ]
  },

  // Q66: Custom Promise.all Implementation
  66: {
    uxRationale: "Why implement Promise.all instead of sequential async/await loops? Running 5 independent async requests sequentially multiplies latency (100ms * 5 = 500ms). Concurrent execution via Promise.all runs them in parallel, completing in the duration of the slowest request (100ms total).",
    realWorldUseCases: [
      {
        title: "LesHub Dashboard Initialization",
        detail: "Parallel fetching of Student Stats, Instructor Availability, and Revenue Metrics before rendering the home screen."
      },
      {
        title: "Multi-Asset Preloading",
        detail: "Loading configuration JSON, font bundles, and hero images concurrently during app startup."
      },
      {
        title: "Batch Microservice Aggregation",
        detail: "Node.js BFF (Backend-For-Frontend) aggregating user profiles, orders, and recommendations concurrently."
      }
    ],
    interviewQA: [
      {
        question: "How do you guarantee that results in Promise.all are returned in the exact input order, even if the last promise resolves first?",
        answer: "Allocate an output array `const results = new Array(promises.length)` and maintain a `completedCount = 0`. Iterate through promises with `promises.forEach((p, index) => { Promise.resolve(p).then(val => { results[index] = val; completedCount++; if (completedCount === promises.length) resolve(results); }, reject); })`. Storing at `results[index]` guarantees positional fidelity."
      },
      {
        question: "Why must input items be wrapped in `Promise.resolve(p)` inside Promise.all?",
        answer: "The input array may contain non-promise primitives (strings, numbers, booleans, plain objects). Wrapping with `Promise.resolve(p)` normalizes all items into standard thenables."
      }
    ]
  },

  // Q6: Slide-Over Drawer / Sheet
  6: {
    uxRationale: "Why use an Off-Canvas Drawer instead of a Full-Page Route? In complex operational dashboards like LesHub or Chrona, users constantly need to inspect detailed entity properties (e.g., student driving records, vehicle maintenance logs) without losing their position, date filters, or scroll offset in the master view.",
    realWorldUseCases: [
      {
        title: "LesHub Pupil Profile Quick-Inspector",
        detail: "Opening an off-canvas sheet over the master calendar to review pupil progress notes, emergency contacts, and lesson payment history."
      },
      {
        title: "E-Commerce Slide-Out Cart",
        detail: "Reviewing cart line items, applying promo codes, and calculating shipping estimates without navigating away from the product catalog."
      },
      {
        title: "Mobile Navigation & Filter Menus",
        detail: "Providing smooth touch-accessible off-canvas drawers on mobile viewports."
      }
    ],
    interviewQA: [
      {
        question: "How do you handle touch swipe gestures and spring physics to dismiss a drawer on mobile?",
        answer: "Listen to `touchstart`, `touchmove`, and `touchend`. Track `deltaY = currentY - startY`. Apply `transform: translateY(${Math.max(0, deltaY)}px)`. On touchend, if `deltaY > threshold` or velocity exceeds 0.5px/ms, animate dismissal; otherwise, snap back with spring transitions."
      },
      {
        question: "How do you guarantee that background body scrolling is locked while the drawer is open?",
        answer: "Save the current scroll position: `const scrollY = window.scrollY`. Set `document.body.style.position = 'fixed'`, `document.body.style.top = -${scrollY}px`, and `document.body.style.width = '100%'`. On unmount, restore style and call `window.scrollTo(0, scrollY)`."
      }
    ]
  },

  // Q12: Multi-Step Form Wizard with Draft Persistence
  12: {
    uxRationale: "Why use a Multi-Step Wizard with localStorage drafts instead of a monolithic single page form? Monolithic forms with 40+ inputs cause severe cognitive fatigue and high abandonment rates. Breaking forms into discrete phases reduces abandonment, while continuous client draft persistence ensures that battery loss or accidental tab closure never destroys user data.",
    realWorldUseCases: [
      {
        title: "LesHub Driving Instructor Onboarding",
        detail: "Guiding new instructors through 4 phases: Personal Details -> Vehicle Info -> DVSA License Uploads -> Bank Payout Setup."
      },
      {
        title: "Complex Loan / Mortgage Applications",
        detail: "Multi-stage financial onboarding with conditional branch steps based on employment status."
      },
      {
        title: "SaaS Workspace Setup Wizard",
        detail: "Configuring company domain, inviting team members, and setting billing tiers with draft autosave."
      }
    ],
    interviewQA: [
      {
        question: "How do you validate individual steps before allowing the user to proceed to the next step?",
        answer: "Maintain a validation schema per step. On 'Next' click, execute `validateStep(currentStep, formData)`. Only increment `currentStep` if `errors` is empty. Never perform full-form validation on intermediate steps to avoid showing error messages on future unvisited fields."
      },
      {
        question: "How do you safely synchronize local draft state with backend draft APIs?",
        answer: "Use an optimistic debounced sync: save immediately to localStorage for instant local safety, and trigger a debounced (1500ms) PUT to `/api/drafts`. Store an `updatedAt` timestamp to detect multi-device edit conflicts."
      }
    ]
  },

  // Q24: LesHub Audit Log Timeline Viewer with Filtering
  24: {
    uxRationale: "Why use an Interactive Audit Log Timeline instead of raw database logs? In regulated enterprise industries (e.g., DVSA driving compliance, HIPAA healthcare, SOX financial tracking), compliance officers must quickly identify who performed an action, what parameters were changed, and the before/after delta.",
    realWorldUseCases: [
      {
        title: "LesHub Driving Compliance & Lesson Alteration Tracking",
        detail: "Inspecting who modified a pupil's test booking date or cancelled an invoice, complete with IP address and timestamp."
      },
      {
        title: "AWS CloudTrail & GitHub Security Events",
        detail: "Reviewing IAM role assumption events, API key creations, and permission revocations."
      },
      {
        title: "Medical Record Patient Modification Trails",
        detail: "Tracking prescription dosage edits with mandatory non-repudiation logs."
      }
    ],
    interviewQA: [
      {
        question: "How do you efficiently group and filter 50,000 timeline events by day/week without freezing the UI?",
        answer: "Memoize grouping with `useMemo`. Construct a single-pass map `Map<DateKey, Event[]>`. For 50k items, virtualize the list of grouped dates using `react-window` or custom windowing so only visible dates and event nodes are mounted in the DOM."
      },
      {
        question: "How do you represent field-level diffs (before vs after) in audit entries?",
        answer: "Store diffs as RFC 6902 JSON patch objects or a structured `{ field, oldValue, newValue }` tuple. Highlight additions in green (`rgba(16, 185, 129, 0.15)`) and deletions in red (`rgba(239, 68, 68, 0.15)`) with monospace font."
      }
    ]
  },

  // Q25: Role-Based Access Control (RBAC) Permission Gate
  25: {
    uxRationale: "Why use a Declarative RBAC Component (<Can do='lesson.edit'>) instead of inline role checks (user.role === 'admin')? Scattering string-based role checks throughout UI components leads to security drift, code duplication, and broken permissions when new roles are introduced. Centralized permission matrices decouple UI visibility from hardcoded role names.",
    realWorldUseCases: [
      {
        title: "LesHub School Owner vs Instructor vs Student Roles",
        detail: "School owners can adjust pricing and view instructor payroll; instructors can only mark attendance; students can only view booked slots."
      },
      {
        title: "Enterprise Multi-Tenant SaaS Workspace Roles",
        detail: "Enforcing Owner, Admin, Member, and Guest capabilities across team workspaces."
      },
      {
        title: "Healthcare EHR Access Control",
        detail: "Restricting clinical note edits to attending physicians while allowing nurses read access."
      }
    ],
    interviewQA: [
      {
        question: "Why is client-side RBAC considered UX polish rather than real security?",
        answer: "Any client-side JavaScript can be inspected or modified by tech-savvy users via DevTools or console overrides. Client-side RBAC ensures a clean, clutter-free UX by hiding unauthorized actions. True security must ALWAYS be enforced on the backend by validating cryptographically signed JWT scopes on every API route."
      },
      {
        question: "How do you handle dynamic permissions that update in real-time (e.g., user is promoted or permissions revoked)?",
        answer: "Expose an `RBACContext` that stores the current user's permission set. When the server pushes a permission update via WebSocket or token refresh, update the Context value. All `<Can>` gates subscribe to context and immediately re-render."
      }
    ]
  },

  // Q33: Infinite Scroll List with Intersection Observer
  33: {
    uxRationale: "Why use IntersectionObserver for Infinite Scrolling instead of traditional window 'scroll' listeners? Window scroll event handlers fire synchronously on every scroll tick, causing high CPU usage and layout thrashing unless aggressively throttled. IntersectionObserver is asynchronous, computed on the compositor thread, and alerts only when the sentinel element enters the viewport.",
    realWorldUseCases: [
      {
        title: "Social Media Feed (Twitter/LinkedIn/Instagram)",
        detail: "Seamlessly fetching next pages of posts as the user approaches the bottom of the feed."
      },
      {
        title: "Chrona Real-Time Driving Lesson Activity Feed",
        detail: "Streaming chronological driving event updates as instructors scroll down their history."
      },
      {
        title: "E-Commerce Infinite Catalog",
        detail: "Progressively appending products without pagination button clicks."
      }
    ],
    interviewQA: [
      {
        question: "How do you prevent rapid double-fetching when the user hits the bottom sentinel before the previous request finishes?",
        answer: "Use an in-flight guard flag (`isLoading.current`). In the observer callback: `if (!entry.isIntersecting || isLoading.current || !hasMore) return;`. Set `isLoading.current = true` before dispatching `fetchNextPage()`, and release it only in the `finally` block."
      },
      {
        question: "What happens if the initial page of data doesn't fill the viewport height?",
        answer: "If the initial items don't push the sentinel below the viewport, the sentinel stays intersecting and triggers a second fetch immediately. Ensure your `rootMargin` and min-height on items prevent infinite loop cascades while fetching enough initial items to exceed viewport height."
      }
    ]
  },

  // Q43: Undo / Redo State Manager (History Stack)
  43: {
    uxRationale: "Why use a Command Pattern History Stack instead of simple mutable state overwrites? In complex creative and administrative tools (e.g. scheduling calendars, graphic design canvases, rich text editors), users frequently make mistakes. A two-stack history manager (`past`, `future`) allows users to experiment fearlessly with instant rollback.",
    realWorldUseCases: [
      {
        title: "Chrona Calendar Lesson Drag-and-Drop Scheduling",
        detail: "Allowing dispatchers to undo accidental lesson moves across 20 instructor swimlanes with Ctrl+Z."
      },
      {
        title: "Figma / Canva Canvas Manipulation",
        detail: "Stepping backwards and forwards through vector moves, color changes, and layer reorderings."
      },
      {
        title: "Spreadsheet & Data Grid Batch Edits",
        detail: "Reverting bulk paste or cell deletion across 50 cells in a single keystroke."
      }
    ],
    interviewQA: [
      {
        question: "How do you manage memory limits so the history stack doesn't consume unbounded RAM?",
        answer: "Cap the stack capacity (e.g., `MAX_HISTORY = 50`). When `past.length > MAX_HISTORY`, drop the oldest state from the bottom using `past.slice(1)`. For large data structures, store delta patches (Immer patches or RFC 6902 diffs) rather than cloning the entire state tree on every keystroke."
      },
      {
        question: "What should happen to the `future` (redo) stack when a new action is performed after undoing?",
        answer: "Performing any new state mutation after undoing must completely wipe the `future` stack (`setFuture([])`). If you don't clear the future stack, redoing would apply actions that branched from an obsolete timeline, causing severe data corruption."
      }
    ]
  },

  // Q55: useLocalStorage with Cross-Tab Synchronization
  55: {
    uxRationale: "Why synchronize LocalStorage across browser tabs with 'storage' event listeners? Users frequently keep multiple tabs open of the same enterprise app. If an instructor logs out or updates their profile in Tab A, Tab B will continue showing stale data or an invalid session unless synchronized in real-time.",
    realWorldUseCases: [
      {
        title: "Cross-Tab Logout & Session Expiry",
        detail: "When a user logs out in one tab, all other open tabs immediately detect token clearance and redirect to `/login`."
      },
      {
        title: "Dark / Light Mode Theme Synchronization",
        detail: "Switching themes in user settings updates all open windows instantly without refreshing."
      },
      {
        title: "Cart & Booking Draft Sync",
        detail: "Adding a lesson booking in one window updates the pending badge in secondary tabs."
      }
    ],
    interviewQA: [
      {
        question: "Why does the native window 'storage' event NOT fire in the tab that caused the change, and how do you fix it?",
        answer: "The browser specification intentionally restricts `storage` events to OTHER browsing contexts/tabs to avoid duplicate triggers. To make the hook reactive within the current tab, dispatch a custom synthetic event `window.dispatchEvent(new Event('local-storage'))` whenever `setValue` is called, and listen to both in `useEffect`."
      },
      {
        question: "How do you handle SSR (Next.js / Remix) hydration mismatch when reading localStorage?",
        answer: "During SSR, `localStorage` is undefined. If the server renders a fallback (e.g. 'light') and the client reads 'dark' on mount, React will throw a hydration mismatch error. The solution is lazy client hydration: initialize state with a safe SSR default, and sync with localStorage inside `useEffect` after mount, or inject an inline blocking script in the `<head>`."
      }
    ]
  },

  // Q76: SWR / Mini React Query (Stale-While-Revalidate)
  76: {
    uxRationale: "Why use Stale-While-Revalidate instead of blocking fetch spinners on every navigation? Blocking loading spinners on every page transition degrade perceived performance. SWR renders stale cached data immediately for zero-perceived latency, while revalidating against the backend in the background to seamlessly reconcile updates.",
    realWorldUseCases: [
      {
        title: "LesHub Live Lesson Schedule Grid",
        detail: "Immediately rendering the last cached lesson bookings when an instructor opens the app, then fetching fresh status updates silently."
      },
      {
        title: "GitHub Pull Request & Issue Feed",
        detail: "Displaying cached comments instantaneously upon navigation while revalidating latest comment additions."
      },
      {
        title: "E-Commerce Product Detail Pages",
        detail: "Rendering cached product descriptions and images immediately, revalidating stock availability in the background."
      }
    ],
    interviewQA: [
      {
        question: "How does SWR implement in-flight request deduplication across multiple component instances?",
        answer: "Maintain a global `inFlightRequests = new Map<string, Promise>()`. When a component calls `useSWR(key)`, check if a promise already exists for `key`. If so, return the existing in-flight promise rather than firing a duplicate HTTP request. When the promise settles, clear it from the map."
      },
      {
        question: "What is Window Focus Revalidation and how is it implemented?",
        answer: "When a user switches browser tabs and returns, data may be stale. SWR attaches `window.addEventListener('focus', revalidate)` and `document.addEventListener('visibilitychange')`. When the tab becomes visible, SWR triggers background revalidation if data age exceeds `dedupingInterval`."
      }
    ]
  },

  // Q80: Debounced Search with Race Condition Protection
  80: {
    uxRationale: "Why is Debounce alone NOT enough to prevent search result corruption? In asynchronous search, typing 'ca' triggers Request 1, and typing 'cat' triggers Request 2. If Request 1 takes 800ms due to database lag and Request 2 takes 100ms, Request 2 finishes first. When Request 1 finishes second, it overwrites the UI with results for 'ca', showing wrong results for 'cat'.",
    realWorldUseCases: [
      {
        title: "LesHub Student / Instructor Search",
        detail: "Fast typing in the global search bar where network jitter could cause stale query results to override newer searches."
      },
      {
        title: "Flight / Hotel Booking Autocomplete",
        detail: "Airport lookup queries with varying network latency."
      },
      {
        title: "Stock Symbol Ticker Lookup",
        detail: "Searching ticker symbols in high-frequency trading terminals."
      }
    ],
    interviewQA: [
      {
        question: "What are the two industry-standard methods to solve race conditions in search autocomplete?",
        answer: "Method 1: `AbortController`. Instantiate a new controller on each keystroke and call `previousController.abort()`. Unfinished HTTP requests are cancelled at the browser network layer. Method 2: Monotonic Sequence Counter. Increment `requestId.current++`. In the promise resolution, only update state if `thisRequestId === requestId.current`."
      },
      {
        question: "How do you handle AbortError so it doesn't log unhandled promise rejections in console?",
        answer: "In the `catch` block of your fetch wrapper, check: `if (error.name === 'AbortError') return;`. Aborting an HTTP request is an intentional lifecycle event, not an unexpected runtime failure."
      }
    ]
  },

  // Q100: Memory Leak & Clean-Up Audit Demo
  100: {
    uxRationale: "Why are Memory Leak Audits critical in Single Page Applications (SPAs)? Unlike multi-page sites where navigating between pages reboots the browser JavaScript Heap, modern SPAs run for hours or days without refreshing. Dangling event listeners, unclosed WebSocket connections, and intervals cause runaway memory bloat, eventually crashing the user's browser.",
    realWorldUseCases: [
      {
        title: "Chrona Real-Time Dispatch Monitor",
        detail: "Enterprise dispatch dashboards left open on office monitors for 8+ hours continuously streaming lesson events."
      },
      {
        title: "Trading Desks & Financial Bloomberg Terminals",
        detail: "High-frequency streaming apps where memory leaks quickly cause browser tab crashes."
      },
      {
        title: "Kiosk & Mobile Tablet Driving Apps",
        detail: "In-car tablets with limited memory running continuous GPS tracking and audit logging."
      }
    ],
    interviewQA: [
      {
        question: "How do you identify a memory leak using Chrome DevTools?",
        answer: "Open Chrome DevTools -> Memory tab -> Take a Heap Snapshot. Perform the suspect action (e.g., open and close a modal 10 times). Take a second snapshot. Select 'Comparison' view and filter by 'Objects allocated between Snapshot 1 and 2'. Look for detached DOM trees (`Detached HTMLDivElement`) and retained closures in the Retainers tree."
      },
      {
        question: "What is a 'Detached DOM Tree' and how does it happen in React?",
        answer: "A detached DOM tree occurs when a DOM node is removed from the active document (e.g. component unmounts), but a JavaScript variable, global event listener, or closure still holds a reference to it. The garbage collector cannot free the node or any of its child nodes, leaking memory proportional to the component's DOM depth."
      }
    ]
  },

  // Q75: LRU Cache
  75: {
    uxRationale: "Why use an LRU Cache instead of an unbounded JavaScript Object or Map? Caching unbounded API responses or images in memory eventually causes JavaScript Heap Out Of Memory crashes. An LRU Cache enforces a strict maximum capacity, evicting the oldest unaccessed item in O(1) time.",
    realWorldUseCases: [
      {
        title: "Chrona Client-Side API Query Cache",
        detail: "Caching the last 100 student search queries in memory so repeat visits to recent profiles render instantly."
      },
      {
        title: "Map Tile / Image Thumbnail Cache",
        detail: "Holding 50 loaded map tiles; evicting off-screen tiles as the user pans across driving lesson routes."
      },
      {
        title: "Dynamic Icon & Font Glyph Cache",
        detail: "Holding parsed SVG paths to eliminate repeated DOM XML parsing."
      }
    ],
    interviewQA: [
      {
        question: "Why is a Doubly Linked List combined with a Hash Map the optimal data structure for an LRU Cache?",
        answer: "A Hash Map gives O(1) key-to-node lookup. A Doubly Linked List allows O(1) node removal and O(1) insertion at the head. An Array would require O(N) shifts on every eviction or repositioning. In modern JavaScript, `Map` maintains insertion order, so deleting and re-setting a key simulates an LRU cache in O(1)."
      },
      {
        question: "How do you handle TTL (Time-To-Live) expiration alongside LRU capacity limits?",
        answer: "Store `{ value, expiry }` in the cache node. On `get(key)`, verify `Date.now() < node.expiry`. If expired, delete the node and return undefined. Periodically run a lazy sweep or background interval to clear dead keys."
      }
    ]
  }
};

// Smart Generator for all 100 Questions
export function getQuestionDeepDive(question) {
  if (CURATED_DEEP_DIVES[question.id]) {
    return CURATED_DEEP_DIVES[question.id];
  }

  // Domain-specific generator based on category & title
  const { title, category, tags, description, seniorEdgeCases, architectureSummary } = question;

  const defaultUseCases = [
    {
      title: `Enterprise ${category.toUpperCase()} Workflow in Chrona / LesHub`,
      detail: `Applied directly in production to solve ${title.toLowerCase()} without degrading performance or losing user context.`
    },
    {
      title: "High-Frequency Interactive Data Management",
      detail: `Ensures UI responsiveness and memory stability when handling rapid state mutations and edge cases.`
    },
    {
      title: "Accessibility & Assistive Compliance",
      detail: `Guarantees full WCAG 2.1 compliance, seamless keyboard navigation, and predictable screen reader announcements.`
    }
  ];

  const defaultRationale = category === 'overlays'
    ? `Why use this overlay pattern instead of page navigation? Navigating to a separate page tears down the parent view, wiping active scroll position, table filters, and form drafts. Overlays preserve background context and eliminate route-transition latency.`
    : category === 'forms'
    ? `Why use this specialized form pattern instead of standard uncontrolled inputs? It guarantees instant client-side validation, prevents accidental data loss during multi-step processes, and isolates re-renders to touched fields.`
    : category === 'enterprise'
    ? `Why use this enterprise pattern? It guarantees eventual consistency, prevents network race conditions, and handles offline resilience in high-stakes operational systems like Chrona and LesHub.`
    : category === 'tables'
    ? `Why use this data grid architecture? Native DOM mapping of dense records causes memory leaks and UI stutter. This pattern provides virtualized windowing and memoized sorting for steady 60fps interaction.`
    : category === 'hooks'
    ? `Why encapsulate this into a custom hook? It separates stateful browser/API logic from UI rendering, promotes reusable testable logic, and prevents memory leaks via automated cleanup.`
    : category === 'polyfills'
    ? `Why understand this fundamental polyfill? It reveals the underlying JavaScript runtime mechanics (event loop, microtasks, prototype chain) and proves mastery over asynchronous concurrency and data structures.`
    : category === 'async'
    ? `Why use this asynchronous networking architecture? Naive fetch requests cause race conditions, duplicate server load, and poor offline handling. This pattern provides caching, deduplication, and resilient retry logic.`
    : `Engineered for enterprise scale, minimizing component re-renders, enforcing strict type invariants, and delivering state-of-the-art developer ergonomics.`;

  const defaultQA = [
    {
      question: `How does "${title}" prevent performance degradation and memory leaks under heavy usage?`,
      answer: `By properly managing lifecycle hooks and DOM listeners. All registered window listeners, timers, or abort controllers are guaranteed cleaned up on component unmount. ${architectureSummary}`
    },
    {
      question: `What is the most critical senior edge case to defend in an interview for this problem?`,
      answer: seniorEdgeCases && seniorEdgeCases.length > 0 
        ? `${seniorEdgeCases[0]} Failure to handle this will result in subtle production bugs and accessibility failures.`
        : `Ensuring state synchronization during unmount and handling asynchronous race conditions.`
    },
    {
      question: `How would you defend this architectural decision to a Staff / Principal Engineer?`,
      answer: `${question.interviewTalkingPoints || "Focus on separation of concerns, deterministic state transitions, minimal re-renders, and meeting strict WCAG 2.1 accessibility criteria."}`
    }
  ];

  return {
    uxRationale: defaultRationale,
    realWorldUseCases: defaultUseCases,
    interviewQA: defaultQA
  };
}
