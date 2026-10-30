// System Design & Sequence Diagram Data Registry for all 100 Senior Machine Coding Applications
// Provides component boundaries, state models, Web API integrations, sequence flows, and Mermaid diagrams.

export const SYSTEM_DESIGN_REGISTRY = {
  // Q1: Accessible Modal Dialog
  1: {
    systemDesign: {
      componentHierarchy: "AppRoot -> ModalPortal (document.body) -> BackdropOverlay (fixed, inset-0, z-index: 9999) -> DialogSurface (role='dialog', aria-modal='true', aria-labelledby) -> [Title, Body, Trapped Inputs, Action Buttons]",
      stateModel: {
        "isOpen": "boolean (useState) - Controls portal mounting and backdrop visibility.",
        "modalRef": "HTMLDivElement (useRef) - Container boundary to query focusable elements.",
        "triggerRef": "HTMLButtonElement (useRef) - Remembers previously focused DOM node before dialog opened."
      },
      browserApis: [
        "document.activeElement (captures node to restore focus)",
        "document.addEventListener('keydown') (catches Tab and Escape globally)",
        "document.body.style.overflow = 'hidden' (prevents background viewport scrolling)",
        "element.focus() (programmatically cycles keyboard focus)"
      ],
      dataFlow: "User click -> setState(isOpen=true) -> Portal mounts -> useEffect queries focusable elements -> focuses first child -> User tabs -> Tab listener wraps focus -> ESC or click -> setState(isOpen=false) -> unmount cleanup restores body scroll & trigger focus.",
      invariants: [
        "Focus NEVER leaves the dialog surface while open.",
        "Background scrolling is ALWAYS restored on unmount, even if component crashes.",
        "Previous active element is ALWAYS refocused to ensure screen reader continuity."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "TriggerBtn", "ModalComponent", "Document/DOM", "ScreenReader"],
      steps: [
        { step: 1, from: "User", to: "TriggerBtn", action: "Clicks 'Open Modal' button", detail: "User initiates dialog opening via mouse click or Enter key." },
        { step: 2, from: "TriggerBtn", to: "ModalComponent", action: "Triggers onClick handler", detail: "Component invokes setIsOpen(true)." },
        { step: 3, from: "ModalComponent", to: "Document/DOM", action: "Saves document.activeElement & locks body", detail: "Captures TriggerBtn reference; sets body.style.overflow = 'hidden'." },
        { step: 4, from: "ModalComponent", to: "ScreenReader", action: "Announces role='dialog' & aria-labelledby", detail: "Informs assistive technologies that a modal has captured user context." },
        { step: 5, from: "ModalComponent", to: "Document/DOM", action: "Queries focusable elements & focuses first child", detail: "Finds all buttons, inputs, links; calls focusableElements[0].focus()." },
        { step: 6, from: "User", to: "ModalComponent", action: "Presses 'Tab' on the last focusable element", detail: "Keydown event fires; modal trap detects activeElement === last." },
        { step: 7, from: "ModalComponent", to: "Document/DOM", action: "e.preventDefault() & wraps to focusableElements[0]", detail: "Focus is seamlessly moved back to the top of the dialog." },
        { step: 8, from: "User", to: "ModalComponent", action: "Presses 'Escape' key or clicks backdrop", detail: "Triggers dismiss action: setIsOpen(false)." },
        { step: 9, from: "ModalComponent", to: "Document/DOM", action: "Cleanup: Unlocks body scroll & restores focus to TriggerBtn", detail: "body.style.overflow = 'unset'; triggerRef.current.focus()." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant TriggerBtn
  participant ModalComponent
  participant DOM as Browser DOM / Document
  participant A11y as Screen Reader / A11y

  User->>TriggerBtn: Click "Open Modal"
  TriggerBtn->>ModalComponent: onClick -> setIsOpen(true)
  ModalComponent->>DOM: Save document.activeElement
  ModalComponent->>DOM: document.body.style.overflow = 'hidden'
  ModalComponent->>A11y: Render role="dialog" & aria-modal="true"
  ModalComponent->>DOM: Query focusable elements & focus first child
  
  loop Keyboard Navigation
    User->>ModalComponent: Press Tab / Shift+Tab
    alt Tab on last element
      ModalComponent->>DOM: e.preventDefault() -> focus(firstElement)
    else Shift+Tab on first element
      ModalComponent->>DOM: e.preventDefault() -> focus(lastElement)
    end
  end

  User->>ModalComponent: Press ESC or click backdrop
  ModalComponent->>ModalComponent: setIsOpen(false)
  ModalComponent->>DOM: document.body.style.overflow = 'unset'
  ModalComponent->>DOM: triggerRef.current.focus() (Restore focus)`
    }
  },

  // Q2: Click Outside Hook & Dropdown
  2: {
    systemDesign: {
      componentHierarchy: "DropdownContainer (ref=dropdownRef) -> [TriggerButton, PopoverMenu (absolute, z-index: 50) -> MenuItems]",
      stateModel: {
        "isOpen": "boolean (useState) - Toggles dropdown expansion.",
        "selected": "string (useState) - Currently selected option.",
        "dropdownRef": "HTMLDivElement (useRef) - Boundary ref used to test event target containment."
      },
      browserApis: [
        "document.addEventListener('pointerdown') (handles mouse, pen, and touch consistently)",
        "node.contains(event.target) (checks if the clicked element lives inside dropdownRef)"
      ],
      dataFlow: "User clicks outside -> Global pointerdown fires -> dropdownRef.current.contains(target) is false -> setIsOpen(false) -> Menu unmounts.",
      invariants: [
        "Use 'pointerdown' instead of 'click' to avoid 300ms touch delay and race conditions with unmounting elements.",
        "Always clean up pointerdown listener in useEffect cleanup to prevent document memory leaks."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "TriggerBtn", "DropdownMenu", "GlobalDocumentListener"],
      steps: [
        { step: 1, from: "User", to: "TriggerBtn", action: "Clicks dropdown trigger", detail: "Toggles isOpen from false to true." },
        { step: 2, from: "DropdownMenu", to: "GlobalDocumentListener", action: "Mounts & registers pointerdown listener", detail: "Listens for pointer events anywhere in the viewport." },
        { step: 3, from: "User", to: "GlobalDocumentListener", action: "Clicks outside on body/background", detail: "Pointer event bubbles up to document." },
        { step: 4, from: "GlobalDocumentListener", to: "DropdownMenu", action: "Evaluates dropdownRef.contains(e.target)", detail: "Returns false because target is outside the dropdown container." },
        { step: 5, from: "GlobalDocumentListener", to: "DropdownMenu", action: "Executes callback: setIsOpen(false)", detail: "Dropdown closes seamlessly." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant TriggerBtn
  participant DropdownMenu
  participant Doc as document (pointerdown)

  User->>TriggerBtn: Click dropdown trigger
  TriggerBtn->>DropdownMenu: setIsOpen(!isOpen)
  DropdownMenu->>Doc: addEventListener('pointerdown', handleClickOutside)
  
  alt User clicks inside menu item
    User->>DropdownMenu: Click menu item
    DropdownMenu->>DropdownMenu: setSelected(item) & setIsOpen(false)
  else User clicks outside on page
    User->>Doc: pointerdown event
    Doc->>DropdownMenu: dropdownRef.current.contains(event.target) -> FALSE
    DropdownMenu->>DropdownMenu: setIsOpen(false)
  end
  DropdownMenu->>Doc: removeEventListener('pointerdown') on unmount`
    }
  },
  // Q3: Accessible Tabbed Interface (WAI-ARIA)
  3: {
    systemDesign: {
      componentHierarchy: "TabsContainer -> TabList (role='tablist') -> TabButtons[] (role='tab', aria-selected, tabIndex=0/-1) -> TabPanel (role='tabpanel', aria-labelledby)",
      stateModel: {
        "activeTab": "number (useState) - Zero-based index of the currently active tab.",
        "tabListRef": "HTMLDivElement (useRef) - Container reference used to query button nodes for keyboard focus."
      },
      browserApis: [
        "button.focus() (roving focus shift)",
        "KeyboardEvent.key ('ArrowRight', 'ArrowLeft', 'Home', 'End')",
        "event.preventDefault() (suppresses default viewport scrolling on arrow keys)"
      ],
      dataFlow: "User presses Arrow key -> handleKeyDown calculates nextIndex via modulo arithmetic -> setActiveTab(nextIndex) -> queries tabListRef buttons -> focuses new button -> panel displays matching content.",
      invariants: [
        "Roving tabIndex: Exactly one tab has tabIndex=0 (the active one); all other tabs have tabIndex=-1.",
        "WAI-ARIA compliance: All tabs have role='tab' and aria-selected='true'/'false'. Tabpanel has role='tabpanel'."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "ActiveTabButton", "TabsComponent", "NextTabButton", "TabPanel"],
      steps: [
        { step: 1, from: "User", to: "ActiveTabButton", action: "Presses ArrowRight / ArrowLeft", detail: "Keyboard navigation initiates." },
        { step: 2, from: "ActiveTabButton", to: "TabsComponent", action: "onKeyDown event triggered", detail: "e.preventDefault() called to prevent page scroll." },
        { step: 3, from: "TabsComponent", to: "TabsComponent", action: "Computes nextIndex = (current + 1) % length", detail: "Wraps around array seamlessly." },
        { step: 4, from: "TabsComponent", to: "NextTabButton", action: "Calls buttons[nextIndex].focus()", detail: "Roving tabIndex shifts focus automatically." },
        { step: 5, from: "TabsComponent", to: "TabPanel", action: "Renders tabs[nextIndex].content", detail: "Panel updates with zero layout shift." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant CurrentTab as Active Tab (tabIndex=0)
  participant Tabs as Tabs Component
  participant NextTab as Next Tab (tabIndex=-1)
  participant Panel as Tab Panel

  User->>CurrentTab: Press ArrowRight (or ArrowLeft)
  CurrentTab->>Tabs: onKeyDown(e)
  Tabs->>Tabs: e.preventDefault()
  Tabs->>Tabs: nextIndex = (index + 1) % tabs.length
  Tabs->>Tabs: setActiveTab(nextIndex)
  Tabs->>NextTab: Set tabIndex=0 & NextTab.focus()
  Tabs->>CurrentTab: Set tabIndex=-1
  Tabs->>Panel: Render tabs[nextIndex].content`
    }
  },

  // Q4: Collapsible Accordion (Single & Multi-Expand)
  4: {
    systemDesign: {
      componentHierarchy: "AccordionRoot -> AccordionItem[] -> [AccordionHeader (button, aria-expanded) -> AccordionBody (grid transition, overflow-hidden)]",
      stateModel: {
        "openIndices": "number[] (useState) - Array of currently open section indices.",
        "allowMultiple": "boolean (useState) - Toggles between exclusive accordion and multi-expand mode."
      },
      browserApis: [
        "CSS Grid transition (grid-template-rows: 0fr -> 1fr for smooth height animation)",
        "ARIA attributes: aria-expanded='true'/'false', role='region'"
      ],
      dataFlow: "User clicks section header -> toggle(idx) evaluates allowMultiple -> if true: toggles index in array; if false: sets openIndices to [idx] or [] -> re-renders items with smooth expansion.",
      invariants: [
        "Zero pixel-height hacking: Uses CSS Grid (0fr to 1fr) so dynamic nested content animates smoothly without manual JS height calculation.",
        "Accessibility: Each header is a native button with aria-expanded bound to open state."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "AccordionHeader", "AccordionComponent", "AccordionBody"],
      steps: [
        { step: 1, from: "User", to: "AccordionHeader", action: "Clicks section title", detail: "User triggers expansion toggle." },
        { step: 2, from: "AccordionHeader", to: "AccordionComponent", action: "Invokes toggle(index)", detail: "Passes clicked item index." },
        { step: 3, from: "AccordionComponent", to: "AccordionComponent", action: "Updates openIndices state", detail: "If allowMultiple is false, closes all other items." },
        { step: 4, from: "AccordionComponent", to: "AccordionBody", action: "Applies CSS expansion (grid-template-rows: 1fr)", detail: "Content animates open smoothly." },
        { step: 5, from: "AccordionComponent", to: "AccordionHeader", action: "Rotates chevron icon 180deg & sets aria-expanded='true'", detail: "Visual and accessibility states synchronize." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Header as Accordion Header (Button)
  participant Comp as Accordion State Manager
  participant Body as Accordion Body (Panel)

  User->>Header: Click Section Header
  Header->>Comp: toggle(index)
  alt Single Expand Mode (allowMultiple = false)
    Comp->>Comp: setOpenIndices(isOpen ? [] : [index])
  else Multi Expand Mode (allowMultiple = true)
    Comp->>Comp: setOpenIndices(prev.includes(index) ? remove : add)
  end
  Comp->>Header: Update aria-expanded & rotate Chevron
  Comp->>Body: Transition height via CSS Grid (0fr <-> 1fr)`
    }
  },

  // Q5: Tooltip with Collision Detection & Dynamic Auto-Placement
  5: {
    systemDesign: {
      componentHierarchy: "AnchorButton (ref=targetRef) -> TooltipSurface (fixed position, dynamic {x, y, placement})",
      stateModel: {
        "coords": "{ x: number, y: number, placement: 'top' | 'bottom' } (useState) - Computed pixel coordinates.",
        "visible": "boolean (useState) - Tooltip visibility flag.",
        "targetRef": "HTMLButtonElement (useRef) - Anchor element reference for boundary measurement."
      },
      browserApis: [
        "element.getBoundingClientRect() - Measures viewport distance from top, bottom, left, right.",
        "window.innerHeight - Checks remaining viewport clearance.",
        "onMouseEnter / onMouseLeave - Hover intent triggers."
      ],
      dataFlow: "User hovers target -> getBoundingClientRect() calculates spaceAbove = rect.top -> if spaceAbove < 80px: flips placement to 'bottom'; else 'top' -> sets coords and visible=true.",
      invariants: [
        "Collision safety: Tooltip never clips outside viewport bounds regardless of scroll position.",
        "pointer-events: none: Tooltip never intercepts pointer events from the underlying document."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "AnchorButton", "CollisionEngine", "TooltipSurface"],
      steps: [
        { step: 1, from: "User", to: "AnchorButton", action: "Hovers over anchor element", detail: "onMouseEnter event fires." },
        { step: 2, from: "AnchorButton", to: "CollisionEngine", action: "targetRef.current.getBoundingClientRect()", detail: "Calculates rect.top, rect.bottom, rect.left, rect.width." },
        { step: 3, from: "CollisionEngine", to: "CollisionEngine", action: "Checks spaceAbove < 80px (Viewport Boundary)", detail: "Detects collision with screen ceiling." },
        { step: 4, from: "CollisionEngine", to: "TooltipSurface", action: "Auto-flips placement to 'bottom' & sets coords", detail: "y = rect.bottom + 8px, x = rect.left + width/2." },
        { step: 5, from: "User", to: "AnchorButton", action: "Moves cursor away", detail: "onMouseLeave event fires -> setVisible(false)." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Anchor as Anchor Element (Button)
  participant Engine as Collision Detection
  participant Tooltip as Tooltip Surface (Fixed)

  User->>Anchor: onMouseEnter
  Anchor->>Engine: getBoundingClientRect()
  Engine->>Engine: spaceAbove = rect.top
  alt spaceAbove < 80px (Near Top Edge)
    Engine->>Tooltip: Placement: "bottom" (y = rect.bottom + 8)
  else Sufficient Space Above
    Engine->>Tooltip: Placement: "top" (y = rect.top - 8)
  end
  Tooltip-->>User: Render tooltip flipped cleanly without clipping
  User->>Anchor: onMouseLeave
  Anchor->>Tooltip: setVisible(false)`
    }
  },

  // Q6: Slide-Over Drawer / Sheet
  6: {
    systemDesign: {
      componentHierarchy: "TriggerButton -> DrawerPortal -> Backdrop (fixed, inset-0, bg-black/50) -> DrawerPanel (fixed right-0, width: 320px, slide animation) -> [DrawerHeader, DrawerContent]",
      stateModel: {
        "isOpen": "boolean (useState) - Controls drawer visibility and backdrop mounting."
      },
      browserApis: [
        "document.body.style.overflow = 'hidden' (locks background scroll)",
        "event.stopPropagation() (prevents clicks inside drawer from triggering backdrop dismiss)"
      ],
      dataFlow: "User clicks trigger -> setIsOpen(true) -> backdrop mounts -> drawer panel slides in from right -> user clicks backdrop -> setIsOpen(false) -> drawer slides out.",
      invariants: [
        "Event bubbling protection: Clicks inside drawer call e.stopPropagation() so clicks don't bubble to the backdrop.",
        "Body scroll lock: Unmounting drawer guarantees document.body scroll restoration."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "DrawerTrigger", "Backdrop", "DrawerPanel"],
      steps: [
        { step: 1, from: "User", to: "DrawerTrigger", action: "Clicks 'Open Drawer'", detail: "setIsOpen(true)." },
        { step: 2, from: "DrawerTrigger", to: "Backdrop", action: "Mounts fixed backdrop overlay", detail: "Fades in background dimming." },
        { step: 3, from: "Backdrop", to: "DrawerPanel", action: "Renders panel with slide-in animation", detail: "Slides from right: translateX(0)." },
        { step: 4, from: "User", to: "DrawerPanel", action: "Clicks inside drawer content", detail: "e.stopPropagation() prevents backdrop dismiss." },
        { step: 5, from: "User", to: "Backdrop", action: "Clicks dark backdrop area", detail: "setIsOpen(false) -> unmounts drawer." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Trigger as Drawer Trigger
  participant Backdrop as Backdrop Overlay
  participant Panel as Drawer Panel (Slide-Over)

  User->>Trigger: Click "Open Off-Canvas Drawer"
  Trigger->>Backdrop: Mounts backdrop (fixed, inset: 0)
  Backdrop->>Panel: Slide-in transition (translateX 100% -> 0)
  
  alt User clicks inside Drawer content
    User->>Panel: Click internal item
    Panel->>Panel: e.stopPropagation() (Stays open!)
  else User clicks backdrop
    User->>Backdrop: Click backdrop area
    Backdrop->>Trigger: setIsOpen(false) (Drawer unmounts)
  end`
    }
  },

  // Q7: Popover with Anchor Positioning
  7: {
    systemDesign: {
      componentHierarchy: "AnchorContainer (relative) -> TriggerButton -> PopoverContent (absolute, top: 110%, z-index: 100)",
      stateModel: {
        "isOpen": "boolean (useState) - Toggles popover card visibility."
      },
      browserApis: [
        "CSS absolute positioning relative to anchor container",
        "Outside click detection or toggle trigger"
      ],
      dataFlow: "User clicks trigger -> setIsOpen(!isOpen) -> popover renders right beneath button aligned to container boundaries.",
      invariants: [
        "Z-index stacking: Popover has z-index: 100 to elevate above sibling elements.",
        "Toggle idempotency: Clicking trigger button twice cleanly opens and closes popover."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "TriggerButton", "PopoverComponent", "PopoverCard"],
      steps: [
        { step: 1, from: "User", to: "TriggerButton", action: "Clicks 'Toggle Popover'", detail: "Toggles open state." },
        { step: 2, from: "TriggerButton", to: "PopoverComponent", action: "setIsOpen(!isOpen)", detail: "Calculates new visibility." },
        { step: 3, from: "PopoverComponent", to: "PopoverCard", action: "Mounts card with absolute top: 110%", detail: "Positions card beneath anchor." },
        { step: 4, from: "User", to: "TriggerButton", action: "Clicks trigger again", detail: "Popover unmounts cleanly." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Trigger as Anchor Button
  participant Comp as Popover State
  participant Popover as Popover Card (Absolute)

  User->>Trigger: Click Trigger Button
  Trigger->>Comp: setIsOpen(!isOpen)
  alt isOpen is TRUE
    Comp->>Popover: Render card anchored at top: 110%, zIndex: 100
  else isOpen is FALSE
    Comp->>Popover: Unmount card from DOM
  end`
    }
  },

  // Q8: Custom Context Menu (Right Click)
  8: {
    systemDesign: {
      componentHierarchy: "ContextArea (onContextMenu) -> ContextMenuSurface (fixed, clamped {x, y}) -> ActionMenuItems[]",
      stateModel: {
        "menu": "{ x: number, y: number } | null (useState) - Position coordinates of the context menu."
      },
      browserApis: [
        "event.preventDefault() - Suppresses the default browser context menu.",
        "event.clientX / event.clientY - Raw pointer coordinates.",
        "window.innerWidth / window.innerHeight - Clamps coordinates to prevent off-screen clipping.",
        "window.addEventListener('click') - Global listener to dismiss menu on any interaction."
      ],
      dataFlow: "User right clicks in designated zone -> handleContextMenu prevents default -> clamps x = min(clientX, innerWidth - 180) -> setMenu({ x, y }) -> global click listener resets menu to null.",
      invariants: [
        "Viewport clamp: Menu NEVER spawns partially off-screen; clamps right/bottom edges automatically.",
        "Global dismiss: Left clicking anywhere on the page instantly dismisses the context menu."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "ContextZone", "ContextMenuEngine", "ViewportWindow"],
      steps: [
        { step: 1, from: "User", to: "ContextZone", action: "Right-clicks inside zone", detail: "onContextMenu event fires." },
        { step: 2, from: "ContextZone", to: "ContextMenuEngine", action: "e.preventDefault()", detail: "Suppresses standard browser context menu." },
        { step: 3, from: "ContextMenuEngine", to: "ContextMenuEngine", action: "Clamps: x = min(clientX, innerWidth - 180)", detail: "Prevents menu from overflowing window boundaries." },
        { step: 4, from: "ContextMenuEngine", to: "ContextZone", action: "Renders custom menu at clamped {x, y}", detail: "Displays Copy, Configure, Delete options." },
        { step: 5, from: "User", to: "ViewportWindow", action: "Left clicks anywhere", detail: "Global window listener sets menu = null." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Zone as Context Target Area
  participant Engine as Context Menu Handler
  participant Menu as Custom Menu (Fixed)
  participant Window as Global Window

  User->>Zone: Right Click (contextmenu event)
  Zone->>Engine: e.preventDefault() (Block browser menu)
  Engine->>Engine: Clamp x = min(clientX, innerWidth - 180)
  Engine->>Engine: Clamp y = min(clientY, innerHeight - 150)
  Engine->>Menu: Render custom menu at {x, y}
  Window->>Window: window.addEventListener('click', close)
  
  User->>Window: Left Click anywhere
  Window->>Menu: Dismiss: setMenu(null)`
    }
  },

  // Q9: Multi-Level Flyout Menu
  9: {
    systemDesign: {
      componentHierarchy: "FlyoutRoot -> PrimaryMenuItem (onMouseEnter) -> FlyoutSubmenu (absolute, left: 100%) -> SubmenuActions[]",
      stateModel: {
        "activeSub": "boolean (useState) - Toggles visibility of nested flyout submenu."
      },
      browserApis: [
        "onMouseEnter / onMouseLeave events",
        "CSS absolute positioning with left: 215px offset"
      ],
      dataFlow: "User hovers 'Export Records' -> onMouseEnter sets activeSub=true -> nested flyout appears to the right -> user clicks export format or moves cursor away -> activeSub=false.",
      invariants: [
        "Collision safety: Submenu renders to the right of parent menu with matching top alignment.",
        "Hover continuity: Leaves sub-menu visible while user interacts with child options."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "PrimaryMenuItem", "FlyoutSubmenu", "ExportAction"],
      steps: [
        { step: 1, from: "User", to: "PrimaryMenuItem", action: "Hovers over 'Export Records'", detail: "onMouseEnter event fires." },
        { step: 2, from: "PrimaryMenuItem", to: "FlyoutSubmenu", action: "setActiveSub(true)", detail: "Mounts nested flyout menu at left: 215px." },
        { step: 3, from: "User", to: "ExportAction", action: "Clicks 'Export PDF'", detail: "Executes chosen export routine." },
        { step: 4, from: "User", to: "FlyoutSubmenu", action: "Leaves submenu boundary", detail: "onMouseLeave sets activeSub(false)." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Item as Primary Menu Item
  participant State as Flyout State Manager
  participant Sub as Nested Submenu (Flyout)

  User->>Item: Hover over "Export Records" (onMouseEnter)
  Item->>State: setActiveSub(true)
  State->>Sub: Render submenu at left: 100%
  User->>Sub: Click "Export PDF"
  Sub-->>User: Trigger Download
  User->>Sub: Move cursor away (onMouseLeave)
  Sub->>State: setActiveSub(false) (Submenu closes)`
    }
  },

  // Q10: Floating Action Button (FAB) & Speed Dial
  10: {
    systemDesign: {
      componentHierarchy: "FabRoot (fixed, bottom-right) -> [SpeedDialActionsContainer -> ActionButtons[]] -> PrimaryFabToggle (rotate-45)",
      stateModel: {
        "isOpen": "boolean (useState) - Controls speed dial actions expansion and FAB icon rotation."
      },
      browserApis: [
        "CSS transform: rotate(45deg) (smoothly turns '+' icon into 'x' close icon)",
        "Staggered CSS transitions for fanning out speed dial buttons"
      ],
      dataFlow: "User clicks FAB -> setIsOpen(!isOpen) -> Primary button rotates 45deg -> Mini action buttons render vertically stacked above FAB -> Clicking action triggers task and dismisses.",
      invariants: [
        "Single action dispatch: Clicking an action item executes handler and can auto-close dial.",
        "Fixed viewport positioning: FAB stays anchored to viewport bottom-right without layout shift."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "PrimaryFAB", "SpeedDialState", "ActionButtons"],
      steps: [
        { step: 1, from: "User", to: "PrimaryFAB", action: "Clicks Floating Action Button", detail: "onClick event fires." },
        { step: 2, from: "PrimaryFAB", to: "SpeedDialState", action: "setIsOpen(!isOpen)", detail: "Toggles dial open state." },
        { step: 3, from: "SpeedDialState", to: "PrimaryFAB", action: "Applies transform: rotate(45deg)", detail: "Plus icon morphs into close 'X'." },
        { step: 4, from: "SpeedDialState", to: "ActionButtons", action: "Renders Task and Profile action buttons", detail: "Fanned out vertically above primary FAB." },
        { step: 5, from: "User", to: "ActionButtons", action: "Clicks 'Add Task' button", detail: "Executes action handler." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant FAB as Primary FAB Button
  participant State as Speed Dial State
  participant Actions as Action Buttons (Mini FABs)

  User->>FAB: Click FAB Button
  FAB->>State: setIsOpen(!isOpen)
  State->>FAB: Rotate button 45deg (Plus -> Cross)
  State->>Actions: Render Task & Profile buttons vertically
  User->>Actions: Click "Add Task"
  Actions-->>User: Trigger Task Action & auto-close`
    }
  },
  // Q11: OTP / Verification Code Input
  11: {
    systemDesign: {
      componentHierarchy: "OtpContainer -> [DigitInput 0, DigitInput 1, DigitInput 2, DigitInput 3] (ref array: inputRefs[0..N-1]) -> ValidationBadge",
      stateModel: {
        "otp": "string[] (useState) - Array of single character strings e.g. ['', '', '', ''].",
        "inputRefs": "useRef([]) - Array of HTMLInputElement references for programmatic focus shifting."
      },
      browserApis: [
        "input.focus() - Moves caret to adjacent input after digit entry.",
        "event.clipboardData.getData('text') - Extracts raw pasted string for auto-filling all boxes.",
        "KeyboardEvent.key ('Backspace', 'ArrowLeft', 'ArrowRight') - Navigation mechanics."
      ],
      dataFlow: "User types digit -> updates otp[index] -> auto-advances to inputRefs[index + 1]. On Backspace -> clears current or backtracks to inputRefs[index - 1].",
      invariants: [
        "Only single numeric digits [0-9] allowed per slot.",
        "Pasting a full 4 or 6 digit code fills all boxes in one atomic operation and focuses the final box."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "DigitInput_i", "OtpState", "AdjacentInput_next"],
      steps: [
        { step: 1, from: "User", to: "DigitInput_i", action: "Types number '5'", detail: "Validates input is numeric regex /^[0-9]$/." },
        { step: 2, from: "DigitInput_i", to: "OtpState", action: "Updates otp array copy at index i", detail: "setOtp(newOtp)." },
        { step: 3, from: "DigitInput_i", to: "AdjacentInput_next", action: "Calls inputRefs[i + 1]?.focus()", detail: "Focus automatically advances to next input box." },
        { step: 4, from: "User", to: "AdjacentInput_next", action: "Presses Backspace on empty input", detail: "Detects empty value on keydown." },
        { step: 5, from: "AdjacentInput_next", to: "DigitInput_i", action: "Clears previous digit & shifts focus back", detail: "Calls inputRefs[i - 1]?.focus()." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Box0 as Input Box [0]
  participant Box1 as Input Box [1]
  participant State as Otp Array State
  participant Clipboard as Clipboard Engine

  alt Single Digit Typing
    User->>Box0: Types '4'
    Box0->>State: setOtp(['4', '', '', ''])
    Box0->>Box1: inputRefs[1].current.focus()
  else Backspace Traversal
    User->>Box1: Presses Backspace on empty box
    Box1->>Box0: inputRefs[0].current.focus()
    Box0->>State: Clears Box [0] digit
  else Multi-Digit Paste
    User->>Box0: Pastes "9821"
    Box0->>Clipboard: e.clipboardData.getData('text')
    Clipboard->>State: Slices digits -> setOtp(['9', '8', '2', '1'])
    Clipboard->>Box1: Focuses last slot inputRefs[3].current.focus()
  end`
    }
  },

  // Q21: Chrona Assignment Batching Engine
  21: {
    systemDesign: {
      componentHierarchy: "ChronaApp -> QueueControlPanel -> [BatchStatusCard, ActiveWorkersGrid, PendingQueueVisualizer, FailureRetryInspector]",
      stateModel: {
        "queue": "Assignment[] (useState) - High-throughput pending queue of items.",
        "processing": "Assignment[] (useState) - Items currently occupying worker slots.",
        "completed": "Assignment[] (useState) - Successfully processed assignments.",
        "failed": "Assignment[] (useState) - Failed items with error code and retry counter (maxRetries=3).",
        "concurrencyLimit": "number (const=3) - Capped parallel processing pool."
      },
      browserApis: [
        "setTimeout / async workers (simulates network round-trips and backoff)",
        "Math.pow(2, retryCount) * 1000 (exponential backoff jitter calculation)",
        "AbortController / cancellation tokens"
      ],
      dataFlow: "Pending queue -> Worker dispatcher checks active count < limit -> dequeues chunk -> executes concurrent async requests -> On 200: completes -> On 429/500: re-enqueues with exponential backoff delay.",
      invariants: [
        "Concurrent active workers NEVER exceed concurrencyLimit.",
        "Items that fail 3 consecutive times move to Dead Letter Queue (DLQ) to prevent infinite loops.",
        "Backoff formula includes random jitter to avoid Thundering Herd problem."
      ]
    },
    sequenceDiagram: {
      actors: ["Producer", "ChronaQueueManager", "WorkerPool (Max 3)", "DownstreamAPI", "DeadLetterQueue"],
      steps: [
        { step: 1, from: "Producer", to: "ChronaQueueManager", action: "Enqueue 10 assignments", detail: "Pushes payloads into pending array." },
        { step: 2, from: "ChronaQueueManager", to: "WorkerPool (Max 3)", action: "Spawns workers up to concurrency limit (3)", detail: "Pulls next 3 tasks from pending queue." },
        { step: 3, from: "WorkerPool (Max 3)", to: "DownstreamAPI", action: "Dispatches HTTP POST /assignments/batch", detail: "Concurrent execution." },
        { step: 4, from: "DownstreamAPI", to: "WorkerPool (Max 3)", action: "Worker 1: 200 OK, Worker 2: 429 Rate Limited", detail: "Worker 1 succeeds; Worker 2 receives 429 Too Many Requests." },
        { step: 5, from: "WorkerPool (Max 3)", to: "ChronaQueueManager", action: "Worker 2 schedules retry with exponential backoff", detail: "delay = 2^attempts * 1000ms + randomJitter." },
        { step: 6, from: "ChronaQueueManager", to: "DeadLetterQueue", action: "Transfers task if retryCount > maxRetries", detail: "Prevents toxic items from blocking throughput." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor Producer
  participant Queue as Chrona Batch Queue
  participant Dispatcher as Concurrency Limiter (Max 3)
  participant Workers as Worker Pool [1..3]
  participant API as Downstream Service
  participant DLQ as Dead Letter Queue

  Producer->>Queue: Enqueue Batch of Assignments
  loop Event Loop Dispatcher
    Queue->>Dispatcher: Check active worker count
    alt Active < 3 && Queue > 0
      Dispatcher->>Workers: Claim Assignment
      Workers->>API: Process Assignment (Simulated HTTP)
      alt HTTP 200 Success
        API-->>Workers: OK
        Workers->>Queue: Mark Complete & Free Slot
      else HTTP 429 / 500 Failure
        API-->>Workers: Error Response
        alt Retries < Max (3)
          Workers->>Queue: Re-queue with Exponential Backoff (2^n * 1000ms)
        else Retries >= Max
          Workers->>DLQ: Route to Dead Letter Queue for Audit
        end
      end
    end
  end`
    }
  },

  // Q22: Optimistic UI with Rollback
  22: {
    systemDesign: {
      componentHierarchy: "OptimisticParent -> [ItemDisplay, ActionButtons, UndoToastNotification, ServerSyncIndicator]",
      stateModel: {
        "items": "Item[] (useState) - Optimistic client-visible list.",
        "previousSnapshot": "Item[] (useRef) - Snapshot captured right before mutation for rollback.",
        "syncStatus": "'idle' | 'syncing' | 'error' | 'success' (useState)."
      },
      browserApis: [
        "Promise rejection handlers (triggers rollback)",
        "setTimeout / Toast timer (displays 5-second undo window)"
      ],
      dataFlow: "User triggers edit/delete -> 1. Snapshot previous state in ref -> 2. Optimistically update local UI immediately -> 3. Fire background network promise -> 4. On network rejection: restore state from snapshot and flash error alert.",
      invariants: [
        "Zero UI latency: The screen updates at 0ms before the network request leaves.",
        "Reversibility: In case of server reject, state rolls back exactly to previous snapshot without side-effects."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "UIComponent", "SnapshotRef", "NetworkAPI"],
      steps: [
        { step: 1, from: "User", to: "UIComponent", action: "Clicks 'Delete Item'", detail: "User initiates optimistic removal." },
        { step: 2, from: "UIComponent", to: "SnapshotRef", action: "Captures snapshot = [...items]", detail: "Saves pristine state before mutation." },
        { step: 3, from: "UIComponent", to: "UIComponent", action: "setItems(filteredItems) immediately", detail: "UI updates in 0ms (60 FPS feel)." },
        { step: 4, from: "UIComponent", to: "NetworkAPI", action: "Dispatches DELETE /items/:id", detail: "Background asynchronous request." },
        { step: 5, from: "NetworkAPI", to: "UIComponent", action: "Server returns 500 Internal Error", detail: "API call fails." },
        { step: 6, from: "UIComponent", to: "SnapshotRef", action: "Rollback: setItems(snapshotRef.current)", detail: "Restores deleted item and notifies user of failure." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant UI as React UI Component
  participant Ref as Snapshot Ref (Memory)
  participant API as Remote Server API
  participant Toast as Notification Toast

  User->>UI: Action: Delete Item #42
  UI->>Ref: Save snapshot = clone(currentItems)
  UI->>UI: setItems(items.filter(id != 42)) (0ms latency!)
  UI->>API: DELETE /api/items/42
  
  alt Network Success (200 OK)
    API-->>UI: 200 OK
    UI->>Toast: Show "Item deleted successfully"
  else Network Failure (500 Error / Timeout)
    API-->>UI: 500 Error
    UI->>Ref: Read snapshot
    UI->>UI: Rollback: setItems(snapshot) (Item restored!)
    UI->>Toast: Show Error: "Server failed. Changes reverted."
  end`
    }
  },

  // Q24: LesHub Audit Log
  24: {
    systemDesign: {
      componentHierarchy: "LesHubContainer -> [AuditFilterBar, ImmutableLogTimeline, DiffInspectorModal, ExportButton]",
      stateModel: {
        "logs": "AuditEntry[] (useState) - Append-only array of action records with timestamp, actorId, role, previousState, newState.",
        "filter": "string (useState) - Actor or action query."
      },
      browserApis: [
        "crypto.randomUUID() (generates cryptographically unique audit IDs)",
        "Intl.DateTimeFormat (formats enterprise timestamps across timezones)",
        "JSON.stringify / Blob (for downloading immutable audit logs)"
      ],
      dataFlow: "Any administrative mutation -> LesHub middleware captures payload -> computes deep diff -> appends tamper-evident audit record with actor ID and ISO timestamp.",
      invariants: [
        "Audit log entries are STRICTLY append-only and IMMUTABLE; no update or delete operations are permitted.",
        "Every recorded event contains actor identity, role, timestamp, IP, and previous vs new values."
      ]
    },
    sequenceDiagram: {
      actors: ["AdminUser", "AdminActionService", "LesHubAuditEngine", "AuditStorage"],
      steps: [
        { step: 1, from: "AdminUser", to: "AdminActionService", action: "Updates Teacher Permission to 'Supervisor'", detail: "Administrative mutation occurs." },
        { step: 2, from: "AdminActionService", to: "LesHubAuditEngine", action: "Sends event (actor, target, oldVal, newVal)", detail: "Middleware intercepts mutation." },
        { step: 3, from: "LesHubAuditEngine", to: "LesHubAuditEngine", action: "Generates UUID + ISO timestamp + diff hash", detail: "Creates immutable envelope." },
        { step: 4, from: "LesHubAuditEngine", to: "AuditStorage", action: "Appends log record to audit table", detail: "Immutable append-only write." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant Service as RBAC Service
  participant Engine as LesHub Audit Engine
  participant Store as Immutable Audit Ledger

  Admin->>Service: Modify User Permission (Role: Admin -> Viewer)
  Service->>Engine: emitAuditEvent({ actor, target, diff, timestamp })
  Engine->>Engine: Validate schema & compute SHA checksum
  Engine->>Store: Append immutable record [id, timestamp, actor, diff]
  Store-->>Service: Acknowledged
  Service-->>Admin: Permission updated with Audit ID #AUD-9821`
    }
  },

  // Q31: Virtualized List (100k items)
  31: {
    systemDesign: {
      componentHierarchy: "ViewportContainer (overflow-y: auto, fixed height) -> SpacerDiv (totalHeight = totalCount * itemHeight) -> VisibleItemsSlice (absolute positioning with translateY(startIndex * itemHeight))",
      stateModel: {
        "scrollTop": "number (useState/useRef) - Current scroll offset.",
        "visibleRange": "{ start: number, end: number } (useMemo) - Computed slice indices based on scrollTop."
      },
      browserApis: [
        "element.scrollTop (tracks vertical position)",
        "requestAnimationFrame (throttles scroll updates to 60fps)",
        "ResizeObserver (monitors container dimensions dynamically)"
      ],
      dataFlow: "User scrolls viewport -> onScroll reads e.target.scrollTop -> computes startIndex = Math.floor(scrollTop / itemHeight) -> renders only visibleCount + buffer items -> translates visible block.",
      invariants: [
        "DOM element count remains constant (~20-30 nodes) regardless of whether total items is 100 or 1,000,000.",
        "Total scroll height is preserved via an invisible spacer div to keep native scrollbar mechanics smooth."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "ViewportElement", "ScrollHandler", "VirtualizerMath", "VisibleWindowDOM"],
      steps: [
        { step: 1, from: "User", to: "ViewportElement", action: "Scrolls vertical scrollbar by 1200px", detail: "Scroll event generated." },
        { step: 2, from: "ViewportElement", to: "ScrollHandler", action: "Fires onScroll listener", detail: "Passes container scrollTop." },
        { step: 3, from: "ScrollHandler", to: "VirtualizerMath", action: "Calculates startIndex = floor(scrollTop / rowHeight)", detail: "e.g. 1200 / 40 = item index 30." },
        { step: 4, from: "VirtualizerMath", to: "VirtualizerMath", action: "Calculates endIndex = startIndex + visibleCount + overscan", detail: "30 + 10 visible + 4 buffer = index 44." },
        { step: 5, from: "VirtualizerMath", to: "VisibleWindowDOM", action: "Renders items[30..44] with translateY(1200px)", detail: "Only 14 DOM elements exist in memory." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Viewport as Scrollable Viewport (Height: 400px)
  participant Engine as Virtualization Engine
  participant DOM as Rendered DOM Nodes (Only ~15 nodes)

  User->>Viewport: Scroll to 2000px offset
  Viewport->>Engine: onScroll(scrollTop = 2000)
  Engine->>Engine: startIndex = floor(2000 / 50px) = 40
  Engine->>Engine: endIndex = 40 + (400 / 50) + 4 overscan = 52
  Engine->>DOM: Slice items[40..52]
  Engine->>DOM: Set transform: translateY(2000px)
  DOM-->>User: 60 FPS ultra-smooth scroll without memory blowup`
    }
  },

  // Q51: useDebounce Custom Hook
  51: {
    systemDesign: {
      componentHierarchy: "SearchInput -> useDebounce(inputValue, delayMs) -> useEffect(queryBackend, [debouncedValue]) -> ResultsList",
      stateModel: {
        "debouncedValue": "T (useState) - Delayed value emitted only after quiet period.",
        "timerRef": "NodeJS.Timeout (useRef / timer in useEffect) - Active countdown handle."
      },
      browserApis: [
        "window.setTimeout (schedules delayed value update)",
        "window.clearTimeout (cancels pending update on keystroke change)"
      ],
      dataFlow: "Input changes -> useEffect runs -> clears prior timeout -> schedules new setTimeout(delay) -> if no new input during delay -> state updates -> API fires.",
      invariants: [
        "Network request rate is throttled to at most once per quiet interval.",
        "Pending timers are always cleared on component unmount or next keystroke to avoid memory leaks."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "SearchBox", "useDebounceHook", "TimerEngine", "BackendSearchAPI"],
      steps: [
        { step: 1, from: "User", to: "SearchBox", action: "Types 'R'", detail: "Keystroke 1." },
        { step: 2, from: "SearchBox", to: "useDebounceHook", action: "Receives value='R', delay=300ms", detail: "Spawns 300ms timeout." },
        { step: 3, from: "User", to: "SearchBox", action: "Types 'Re' at 100ms", detail: "Keystroke 2 within quiet period." },
        { step: 4, from: "SearchBox", to: "useDebounceHook", action: "Cleans up previous timer & spawns new 300ms timer", detail: "clearTimeout(prev) prevents premature API fire." },
        { step: 5, from: "User", to: "SearchBox", action: "Types 'React' & pauses typing", detail: "User pauses for >300ms." },
        { step: 6, from: "TimerEngine", to: "useDebounceHook", action: "Timeout completes (300ms elapsed)", detail: "Sets debouncedValue = 'React'." },
        { step: 7, from: "useDebounceHook", to: "BackendSearchAPI", action: "Fires single HTTP GET /search?q=React", detail: "Only 1 network call made instead of 5!" }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User
  participant Input as Input Element
  participant Hook as useDebounce Hook
  participant Timer as Browser Timer
  participant API as Search API

  User->>Input: Types "R" (t = 0ms)
  Input->>Hook: value = "R"
  Hook->>Timer: setTimeout(300ms)
  
  User->>Input: Types "e" (t = 120ms)
  Input->>Hook: value = "Re"
  Hook->>Timer: clearTimeout() (Cancels "R" timer!)
  Hook->>Timer: setTimeout(300ms)
  
  User->>Input: Types "act" & stops (t = 250ms)
  Hook->>Timer: clearTimeout() & setTimeout(300ms)
  
  Note over Timer: 300ms of quiet time elapses without typing
  Timer->>Hook: Trigger callback -> setDebouncedValue("React")
  Hook->>API: GET /search?q=React (Exactly 1 API call!)`
    }
  },

  // Q61: Promise.all Polyfill
  61: {
    systemDesign: {
      componentHierarchy: "PromiseAllUtility(promisesArray) -> [ResolvedResultsArray, CompletedCounter, RejectHandler]",
      stateModel: {
        "results": "any[] - Fixed-length array preserving input index ordering.",
        "completed": "number - Counter tracking resolved promises.",
        "isDone": "boolean - Guard flag ensuring single settlement (resolve once or reject once)."
      },
      browserApis: [
        "Promise.resolve() (coerces non-promise primitive values into resolved promises)",
        "Microtask queue execution semantics"
      ],
      dataFlow: "Iterates promises -> binds .then(val => { results[index] = val; completed++; if (completed === len) resolve(results); }) -> binds .catch(err => reject(err)).",
      invariants: [
        "Order preservation: results[i] corresponds to promises[i], NOT completion order.",
        "Fail-fast: First rejection IMMEDIATELY rejects the outer promise with that error.",
        "Empty array input Promise.all([]) resolves immediately with []."
      ]
    },
    sequenceDiagram: {
      actors: ["Caller", "PromiseAllFunction", "Promise0 (Slow)", "Promise1 (Fast)", "MicrotaskQueue"],
      steps: [
        { step: 1, from: "Caller", to: "PromiseAllFunction", action: "Calls promiseAll([p0, p1])", detail: "p0 takes 200ms, p1 takes 50ms." },
        { step: 2, from: "PromiseAllFunction", to: "Promise1 (Fast)", action: "Attaches then() at index 1", detail: "Resolves first at 50ms." },
        { step: 3, from: "Promise1 (Fast)", to: "PromiseAllFunction", action: "results[1] = val1; completedCounter = 1", detail: "Stores at index 1; completed != 2 so waits." },
        { step: 4, from: "PromiseAllFunction", to: "Promise0 (Slow)", action: "Attaches then() at index 0", detail: "Resolves at 200ms." },
        { step: 5, from: "Promise0 (Slow)", to: "PromiseAllFunction", action: "results[0] = val0; completedCounter = 2", detail: "completed === length." },
        { step: 6, from: "PromiseAllFunction", to: "Caller", action: "Resolves outer promise with [val0, val1]", detail: "Guarantees index ordering!" }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor App as Application Code
  participant Polyfill as customPromiseAll([p0, p1, p2])
  participant P0 as Promise 0 (Takes 300ms)
  participant P1 as Promise 1 (Takes 100ms)
  participant P2 as Promise 2 (Takes 200ms)

  App->>Polyfill: customPromiseAll([P0, P1, P2])
  Polyfill->>Polyfill: results = new Array(3), completedCount = 0
  
  P1-->>Polyfill: Resolves "Result 1" (Fastest at 100ms)
  Polyfill->>Polyfill: results[1] = "Result 1"; completedCount = 1 (1 < 3, continue)
  
  P2-->>Polyfill: Resolves "Result 2" (At 200ms)
  Polyfill->>Polyfill: results[2] = "Result 2"; completedCount = 2 (2 < 3, continue)
  
  P0-->>Polyfill: Resolves "Result 0" (At 300ms)
  Polyfill->>Polyfill: results[0] = "Result 0"; completedCount = 3 (3 === 3: ALL COMPLETE!)
  Polyfill-->>App: resolve(["Result 0", "Result 1", "Result 2"]) (Preserved Input Order!)`
    }
  },

  // Q76: SWR (Stale-While-Revalidate) Cache
  76: {
    systemDesign: {
      componentHierarchy: "useSWR(cacheKey, fetcher) -> [GlobalInMemoryCache, ActiveInFlightRequestsDeduplicator, ComponentView]",
      stateModel: {
        "data": "T (useState) - Returns stale cached data immediately, then updates with fresh data.",
        "isValidating": "boolean (useState) - Indicates background revalidation status.",
        "error": "Error | null (useState)."
      },
      browserApis: [
        "window.addEventListener('focus') (auto-revalidates when tab regains focus)",
        "navigator.onLine / 'online' event (auto-revalidates upon network reconnection)",
        "BroadcastChannel (syncs cache across browser tabs)"
      ],
      dataFlow: "Check cache -> If hit: return cached data immediately (0ms latency) -> In background: trigger fetcher() -> update cache -> re-render UI with fresh payload.",
      invariants: [
        "Request deduplication: Multiple components requesting the same key share a SINGLE in-flight promise.",
        "Stale first: Never block the UI with a spinner if cached data exists in memory."
      ]
    },
    sequenceDiagram: {
      actors: ["Component", "useSWRHook", "InMemoryCache", "Deduplicator", "BackendServer"],
      steps: [
        { step: 1, from: "Component", to: "useSWRHook", action: "useSWR('/api/user', fetcher)", detail: "Component requests data." },
        { step: 2, from: "useSWRHook", to: "InMemoryCache", action: "Reads cache.get('/api/user')", detail: "Found cached data from 2 minutes ago." },
        { step: 3, from: "useSWRHook", to: "Component", action: "Returns { data: staleData, isValidating: true }", detail: "Zero-latency instantaneous render." },
        { step: 4, from: "useSWRHook", to: "Deduplicator", action: "Checks if request already in flight", detail: "Prevents duplicate requests from sibling components." },
        { step: 5, from: "Deduplicator", to: "BackendServer", action: "Dispatches HTTP GET /api/user", detail: "Background revalidation." },
        { step: 6, from: "BackendServer", to: "InMemoryCache", action: "Returns fresh data -> updates cache", detail: "Overwrites stale entry." },
        { step: 7, from: "useSWRHook", to: "Component", action: "Emits { data: freshData, isValidating: false }", detail: "Component seamlessly updates." }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor Component
  participant SWR as useSWR Hook
  participant Cache as In-Memory Cache
  participant Net as Network Fetcher
  participant API as Backend Server

  Component->>SWR: useSWR('/api/profile')
  SWR->>Cache: Check cache.get('/api/profile')
  
  alt Cache Hit (Stale Data Exists)
    Cache-->>SWR: Return Stale Data
    SWR-->>Component: Render Stale Data (0ms latency!)
  end

  SWR->>Net: Trigger Background Revalidation
  Net->>API: GET /api/profile
  API-->>Net: 200 OK (Fresh Data)
  Net->>Cache: cache.set('/api/profile', freshData)
  Net->>SWR: Notify Subscribers
  SWR-->>Component: Re-render with Fresh Data`
    }
  }
};

/**
 * Returns a high-fidelity System Design and Sequence Diagram for any given question.
 * If a custom tailored design exists in the registry, it returns that.
 * Otherwise, it systematically derives a tailored architectural blueprint based on the question's
 * tier, metadata, edge cases, and tags.
 */
export function getSystemDesign(question) {
  if (SYSTEM_DESIGN_REGISTRY[question.id]) {
    return SYSTEM_DESIGN_REGISTRY[question.id];
  }

  // Generate category-tailored architectural system design & sequence diagram
  const cat = question.category || 'overlays';
  const title = question.title;
  const tagsStr = question.tags?.join(', ') || '';

  return {
    systemDesign: {
      componentHierarchy: `${question.demoId || 'DemoComponent'} -> ContainerSurface (Styled with Tailwind/Glassmorphism) -> ControlToolbar -> [InteractiveStateCore, PresentationLayer, FeedbackBadge]`,
      stateModel: {
        "primaryState": "Composite state object or primitive hook (useState) controlling active UI representation.",
        "lifecycleRef": "useRef tracking mount status, timer IDs, or DOM node boundaries to prevent memory leaks.",
        "derivedComputation": "useMemo caching expensive transformations, filter/sort queries, or geometric bounds."
      },
      browserApis: [
        "DOM Event Listeners (keydown, pointerdown, resize, or scroll)",
        "requestAnimationFrame / setTimeout for scheduled reconciliation",
        "W3C ARIA Accessibility attributes (role, aria-live, aria-expanded)"
      ],
      dataFlow: `1. User interaction triggers event handler -> 2. State updates immutably -> 3. React schedules reconciliation -> 4. DOM reflects synchronized visual state -> 5. Senior edge cases handled: ${question.seniorEdgeCases?.[0] || 'Clean memory teardown'}.`,
      invariants: [
        "Immutability: All state updates maintain pure functional transitions.",
        "Cleanup: All listeners, observers, and timeouts are destroyed on unmount.",
        "A11y & Resilience: Graceful fallback on network failure or empty dataset."
      ]
    },
    sequenceDiagram: {
      actors: ["User", "UI Component", "React State & Hooks", "Browser DOM / APIs", "Async Worker / Storage"],
      steps: [
        { 
          step: 1, 
          from: "User", 
          to: "UI Component", 
          action: `Interacts with ${title}`, 
          detail: `User performs action relevant to ${tagsStr}.` 
        },
        { 
          step: 2, 
          from: "UI Component", 
          to: "React State & Hooks", 
          action: "Dispatches state mutation or hook callback", 
          detail: "Validates input parameters and handles boundary checks." 
        },
        { 
          step: 3, 
          from: "React State & Hooks", 
          to: "Browser DOM / APIs", 
          action: "Applies side-effect or synchronizes DOM attributes", 
          detail: question.architectureSummary || "Synchronizes component with native browser capabilities." 
        },
        { 
          step: 4, 
          from: "Browser DOM / APIs", 
          to: "UI Component", 
          action: "Re-renders visual view at 60 FPS", 
          detail: "Displays updated state with smooth transitions." 
        },
        { 
          step: 5, 
          from: "UI Component", 
          to: "User", 
          action: "Provides visual / acoustic / haptic feedback", 
          detail: "Task completed with zero layout shifts." 
        }
      ],
      mermaid: `sequenceDiagram
  autonumber
  actor User as End User
  participant UI as ${question.title.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 26)} UI
  participant State as State & Hooks
  participant DOM as Browser DOM / Web APIs
  participant Storage as Storage / Network

  User->>UI: Action Trigger (${(question.tags?.[0] || 'Interact').replace(/[^a-zA-Z0-9 ]/g, '')})
  UI->>State: Validate & Dispatch Update
  State->>DOM: Execute Lifecycle Effects
  opt Async / Persistent Operations
    State->>Storage: Sync with Storage / API
    Storage-->>State: Ack / Payload
  end
  DOM-->>UI: Repaint & Trigger Micro-animations
  UI-->>User: Accessible Feedback & View Update`
    }
  };
}
