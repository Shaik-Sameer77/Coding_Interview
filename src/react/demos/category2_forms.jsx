import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, AlertTriangle, Eye, EyeOff, UploadCloud, X, FileText, 
  Search, ShieldCheck, ShieldAlert, ArrowRight, ArrowLeft, RefreshCw 
} from 'lucide-react';

/**
 * ============================================================================
 * PROBLEM #11: OTP / Verification Code Input (Auto-Advance, Backspace, Paste)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: OtpContainer -> InputSlotsGrid[0..N-1] (ref array: inputRefs[0..N-1]) -> ActionButtons
 * • State Model:
 *     - `otp`: string[] initialized with N empty strings `Array(length).fill('')`.
 * • DOM Refs:
 *     - `inputRefs`: Mutable array of HTMLInputElement references for programmatic `.focus()`.
 * • Browser/DOM APIs:
 *     - `e.clipboardData.getData('text')`: Extracts clipboard payload on paste.
 *     - `input.focus()`: Moves caret forward/backward across boxes.
 *     - `inputMode="numeric"`: Prompts numeric keypad on mobile touch devices.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Single Digit Typing:
 *    a. User types '5' in box 0 -> `handleChange` checks regex `/^\d*$/`.
 *    b. Slices last char -> updates `otp[0] = '5'`.
 *    c. If not the last box, shifts focus immediately: `inputRefs.current[idx + 1].focus()`.
 * 2. Backspace Traversal:
 *    a. User presses Backspace on box 1.
 *    b. If box 1 is empty and `idx > 0`, shifts focus backward: `inputRefs.current[idx - 1].focus()`.
 * 3. Clipboard Multi-Digit Paste:
 *    a. User pastes "489201" into any box -> `handlePaste` intercepts.
 *    b. Strips non-digits, slices to 6 chars, updates all boxes atomically.
 *    d. Focuses the final populated slot.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Mobile keyboards: `inputMode="numeric"` ensures the native number keypad opens on iOS/Android.
 * • Accidental overwrite: `val.slice(-1)` gracefully replaces previous digit without caret jumping.
 * • Atomic Paste: Pasting 6 characters distributes across all 6 inputs at once rather than dumping into a single box.
 */
export function DemoOtpInput() {
  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  // Handle single digit input with auto-advance
  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return; // Only allow numeric characters
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1); // Take latest typed digit
    setOtp(newOtp);

    // Auto-advance focus to next slot if a digit was entered
    if (val && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Backspace key handler for seamless backward navigation
  const handleKeyDown = (e, idx) => {
    // If current slot is empty and user hits Backspace, backtrack focus to previous slot
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Full code clipboard paste handler
  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default dump into single input
    const pasted = e.clipboardData.getData('text').trim().slice(0, length);
    if (!/^\d+$/.test(pasted)) return; // Validate all digits
    
    const newOtp = [...otp];
    pasted.split('').forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);

    // Focus last filled slot
    const nextIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
        Enter 6-digit 2FA / Authentication Code (Supports Paste):
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            style={{
              width: '42px',
              height: '48px',
              fontSize: '1.25rem',
              fontWeight: 700,
              textAlign: 'center',
              background: '#0f172a',
              border: `2px solid ${digit ? '#6366f1' : '#334155'}`,
              borderRadius: '8px',
              color: '#f8fafc',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        <button 
          onClick={() => alert(`Submitted OTP: ${otp.join('')}`)}
          disabled={otp.some(d => !d)}
          style={{
            padding: '0.5rem 1rem',
            background: otp.every(d => d) ? '#6366f1' : '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: otp.every(d => d) ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          Verify Code
        </button>
        <button 
          onClick={() => { setOtp(Array(length).fill('')); inputRefs.current[0]?.focus(); }}
          style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #12: Multi-Step Form Wizard with Draft Persistence & Step Validation
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: WizardContainer -> StepProgressBar (1..3) -> StepPanel -> NavigationControls (Prev / Next / Submit)
 * • State Model:
 *     - `step`: number (1: Personal, 2: Experience, 3: Review).
 *     - `formData`: composite object initialized lazily from `localStorage` draft.
 * • Persistence & Validation:
 *     - Automatic `localStorage` synchronization in `useEffect([formData])`.
 *     - Gatekeeper method `canProceed()` disables Next Step button until current step passes validation.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Initial Mount: Reads `localStorage.getItem('interview_multistep_draft')`. If found, pre-populates form.
 * 2. Step 1 (Personal): User fills name and email. `canProceed()` unlocks Next button.
 * 3. Step 2 (Experience): User selects role and experience years. Auto-saves draft.
 * 4. Step 3 (Review): Renders readonly summary of complete candidate submission.
 * 5. Submit: Dispatches completed payload and can clear draft key.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Page refresh data loss: Draft persistence in localStorage prevents user frustration if page accidentally reloads.
 * • Strict step boundary enforcement: Users cannot bypass Step 1 validation to reach Step 2 or 3.
 */
export function DemoMultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('interview_multistep_draft');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      email: '',
      role: 'Full Stack',
      experienceYears: '5',
      salaryExpectation: '140k'
    };
  });

  useEffect(() => {
    localStorage.setItem('interview_multistep_draft', JSON.stringify(formData));
  }, [formData]);

  const update = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const canProceed = () => {
    if (step === 1) return formData.fullName.trim() && formData.email.includes('@');
    if (step === 2) return formData.role && formData.experienceYears;
    return true;
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: step >= s ? '#6366f1' : '#1e293b',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {s}
            </div>
            <span style={{ fontSize: '0.8rem', color: step === s ? '#f8fafc' : '#64748b' }}>
              {s === 1 ? 'Personal' : s === 2 ? 'Experience' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e293b', padding: '1.2rem', borderRadius: '8px', border: '1px solid #334155' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Full Name *</label>
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => update('fullName', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Email *</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => update('email', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Target Role</label>
              <select 
                value={formData.role} 
                onChange={(e) => update('role', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
              >
                <option value="Senior Frontend">Senior Frontend</option>
                <option value="Senior Full Stack">Senior Full Stack</option>
                <option value="Staff Engineer">Staff Engineer</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Years of Experience</label>
              <input 
                type="number" 
                value={formData.experienceYears} 
                onChange={(e) => update('experienceYears', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', color: '#f8fafc' }}>Review Submission</h4>
            <p><strong>Candidate:</strong> {formData.fullName} ({formData.email})</p>
            <p><strong>Role:</strong> {formData.role} - {formData.experienceYears} Years Exp</p>
            <p style={{ marginTop: '0.8rem', color: '#34d399', fontSize: '0.8rem' }}>
              ✓ Draft state automatically saved to localStorage!
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem' }}>
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              style={{ padding: '0.4rem 0.8rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Previous
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              style={{ padding: '0.4rem 0.8rem', background: canProceed() ? '#6366f1' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: canProceed() ? 'pointer' : 'not-allowed' }}
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={() => alert('Application successfully submitted!')}
              style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #13: Dynamic JSON Schema Form Builder
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DynamicFormContainer -> SchemaFieldMapper[] (dispatches text, checkbox, select) -> SubmitButton
 * • State Model:
 *     - `values`: Record<string, any> unified state dictionary mapping field name to current value.
 * • Metadata-Driven Architecture:
 *     - Forms are rendered declaratively from a pure JSON configuration array without hardcoded JSX fields.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. Schema Parser: Iterates `schema` array.
 * 2. Field Type Dispatcher:
 *    - `type === 'checkbox'`: Renders toggle with `checked={values[name]}`.
 *    - `type === 'select'`: Renders dropdown mapping `field.options`.
 *    - default: Renders standard `<input type={field.type}>`.
 * 3. Change Handler: Computes computed key update `{ ...values, [field.name]: newValue }`.
 * 4. Submit: Emits clean JSON payload ready for REST API serialization.
 */
export function DemoDynamicForm() {
  const schema = [
    { name: 'username', label: 'Candidate Username', type: 'text', required: true },
    { name: 'notifyEmail', label: 'Receive Daily Interview Digests', type: 'checkbox' },
    { name: 'track', label: 'Primary Specialization', type: 'select', options: ['React/Next.js', 'Node.js/Microservices', 'Distributed Systems'] }
  ];

  const [values, setValues] = useState({ username: 'antigravity_dev', notifyEmail: true, track: 'React/Next.js' });

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <form onSubmit={(e) => { e.preventDefault(); alert(JSON.stringify(values, null, 2)); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {schema.map(field => (
          <div key={field.name}>
            {field.type === 'checkbox' ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={values[field.name]} 
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.checked })}
                />
                {field.label}
              </label>
            ) : field.type === 'select' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{field.label}</label>
                <select 
                  value={values[field.name]} 
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                >
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{field.label}</label>
                <input 
                  type={field.type} 
                  value={values[field.name]} 
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            )}
          </div>
        ))}
        <button type="submit" style={{ padding: '0.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '0.5rem' }}>
          Render Schema JSON Payload
        </button>
      </form>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #14: Search Autocomplete / Typeahead with Debounce & Keyboard UX
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: AutocompleteContainer (relative) -> SearchInput -> DropdownSuggestionsList (absolute) -> HighlightedOption
 * • State Model:
 *     - `query`: string representing raw input characters.
 *     - `results`: string[] matching filtered candidates.
 *     - `highlighted`: number representing roving index focused with arrow keys (-1 = none).
 *     - `isOpen`: boolean controlling dropdown menu visibility.
 * • Keyboard Navigation:
 *     - `ArrowDown`: `(prev + 1) % results.length`
 *     - `ArrowUp`: `(prev - 1 + results.length) % results.length`
 *     - `Enter`: Selects highlighted candidate.
 *     - `Escape`: Closes suggestions.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types in search box -> `setQuery(text)`.
 * 2. 250ms Debounce Timer triggers -> filters `mockSkills` -> updates `results` -> sets `isOpen = true`.
 * 3. User navigates with Arrow keys: `handleKeyDown` shifts active highlight without losing input focus.
 * 4. User presses Enter: sets query to chosen item and closes dropdown cleanly.
 * 
 * ⚠️ SENIOR TRAPS & EDGE CASES HANDLED:
 * -------------------------------------
 * • Debounce cleanup: Prevents rapid keystroke filtering from triggering redundant reconciliations.
 * • Empty query reset: Clearing input immediately closes dropdown and resets results to `[]`.
 */
export function DemoAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const mockSkills = [
    'React 19 & Next.js', 'React Server Components', 'Redux Toolkit & Zustand',
    'Chrona Batching Architecture', 'LesHub RBAC Permission Grid', 'Tailwind & Styled Components',
    'TypeScript Generics & Utility Types', 'Micro-frontends & Module Federation', 'WebSockets & SSE'
  ];

  useEffect(() => {
    // Immediate close on empty query
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    // 250ms debounce window
    const timer = setTimeout(() => {
      const filtered = mockSkills.filter(s => s.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
      setIsOpen(true);
      setHighlighted(-1);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Full keyboard navigation support (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      setQuery(results[highlighted]);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
        Search Senior Skills (Keyboard navigable):
      </label>
      <div style={{ position: 'relative' }}>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'React', 'Chrona', 'LesHub'..."
          style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
      </div>

      {isOpen && results.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '105%',
          left: '1rem',
          right: '1rem',
          background: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '8px',
          listStyle: 'none',
          padding: '0.3rem',
          margin: 0,
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
          zIndex: 50
        }}>
          {results.map((item, idx) => (
            <li
              key={item}
              onClick={() => { setQuery(item); setIsOpen(false); }}
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                background: highlighted === idx ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: highlighted === idx ? '#818cf8' : '#e2e8f0',
                fontSize: '0.85rem'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #15: Tag / Chip Input with Delimiters & Backspace Removal
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: ChipsInputContainer (flex-wrap) -> TagChips[] (with remove icon) -> GhostInput (borderless, flex-1)
 * • State Model:
 *     - `tags`: string[] active collection of chips.
 *     - `inputVal`: string current typed buffer.
 * • Delimiter Mechanics:
 *     - Pressing `Enter` or `,` commits the buffer into the tags array (preventing duplicates).
 *     - Pressing `Backspace` when `inputVal === ''` pops the last tag.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types "Next.js" and presses Enter / Comma.
 * 2. `handleKeyDown` calls `e.preventDefault()`, trims string, checks `!tags.includes(val)`.
 * 3. Appends new tag to array: `setTags([...tags, val])`.
 * 4. Clears input buffer `setInputVal('')`.
 * 5. If input is empty and user hits Backspace: `setTags(tags.slice(0, -1))` deletes previous chip.
 */
export function DemoTagInput() {
  const [tags, setTags] = useState(['React', 'Full-Stack', 'Chrona']);
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e) => {
    // Delimiter keys: Enter or Comma commits tag
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputVal.trim().replace(',', '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setInputVal('');
      }
    } 
    // Backspace on empty input removes previous chip
    else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
        Skill Tags (Press Enter or Comma to add, Backspace to delete):
      </label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        padding: '0.4rem',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        minHeight: '44px',
        alignItems: 'center'
      }}>
        {tags.map((tag, idx) => (
          <span key={idx} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.8rem'
          }}>
            {tag}
            <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(idx)} />
          </span>
        ))}
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tag..." : ""}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            outline: 'none',
            minWidth: '80px',
            fontSize: '0.85rem'
          }}
        />
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #16: Password Strength Meter with Entropy & Custom Rule Engine
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: PasswordContainer -> ObfuscatedInput (with visibility toggle) -> StrengthProgressBar -> RuleChecklist
 * • State Model:
 *     - `pwd`: string raw password value.
 *     - `show`: boolean toggling `type="text"` vs `type="password"`.
 * • Security Rule Matrix:
 *     1. Length >= 8
 *     2. Uppercase letter `/[A-Z]/`
 *     3. Number `/\d/`
 *     4. Special symbol `/[^A-Za-z0-9]/`
 * • Color Spectrum:
 *     - 1 Met: Red (Very Weak), 2 Met: Orange (Weak), 3 Met: Blue (Moderate), 4 Met: Emerald (Strong).
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types in password input -> `setPwd(text)`.
 * 2. Rule evaluation runs dynamically across all 4 regex patterns.
 * 3. Computes `score = rules.filter(r => r.met).length`.
 * 4. Progress bar width transitions smoothly to `(score / 4) * 100%`.
 * 5. Checklist checkmarks update from neutral bullet to green checkmark.
 */
export function DemoPasswordStrength() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);

  const rules = [
    { label: 'At least 8 characters', met: pwd.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(pwd) },
    { label: 'Contains a number', met: /\d/.test(pwd) },
    { label: 'Contains special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(pwd) }
  ];

  const score = rules.filter(r => r.met).length;
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const labels = ['Very Weak', 'Weak', 'Moderate', 'Strong'];

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
        Create Master Password:
      </label>
      <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
        <input 
          type={show ? 'text' : 'password'}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Enter password..."
          style={{ width: '100%', padding: '0.6rem 2.2rem 0.6rem 0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{
          height: '100%',
          width: `${(score / 4) * 100}%`,
          background: colors[score - 1] || '#ef4444',
          transition: 'all 0.3s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
        <span style={{ color: '#94a3b8' }}>Strength:</span>
        <span style={{ color: colors[score - 1] || '#ef4444', fontWeight: 600 }}>
          {pwd ? labels[score - 1] || 'Very Weak' : 'Empty'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {rules.map((rule, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: rule.met ? '#34d399' : '#64748b' }}>
            {rule.met ? <Check size={12} /> : <span style={{ width: '12px', textAlign: 'center' }}>•</span>}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #17: Lightweight Form Validation Engine with Blur Touch Tracking
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: FormContainer -> FormFields[] (with conditional error labels) -> SubmitButton
 * • State Model:
 *     - `values`: { email, salary } current field values.
 *     - `errors`: Record<string, string> error message strings keyed by field.
 *     - `touched`: Record<string, boolean> tracking fields the user has blurred or visited.
 * • UX Validation Pattern:
 *     - "Reward early, punish late": Errors are only displayed if `touched[field] && errors[field]`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User enters field and types -> `setValues({ ...values, [field]: value })`.
 * 2. User tabs or clicks away -> `handleBlur(field)` marks `touched[field] = true` and runs `validate()`.
 * 3. `validate()` checks required rules (email contains '@', salary >= $50,000).
 * 4. On Submit: Enforces validation on all fields regardless of touch state.
 */
export function DemoFormValidation() {
  const [values, setValues] = useState({ email: '', salary: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const errs = {};
    if (!values.email.includes('@')) errs.email = 'Valid email is required.';
    if (!values.salary || Number(values.salary) < 50000) errs.salary = 'Minimum salary threshold is $50,000.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '380px' }}>
      <form onSubmit={(e) => { e.preventDefault(); if (validate()) alert('Valid form submitted!'); }}>
        <div style={{ marginBottom: '0.8rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Corporate Email</label>
          <input 
            type="text"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            onBlur={() => handleBlur('email')}
            style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: `1px solid ${touched.email && errors.email ? '#ef4444' : '#334155'}`, borderRadius: '6px', color: '#fff' }}
          />
          {touched.email && errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Base Salary ($)</label>
          <input 
            type="number"
            value={values.salary}
            onChange={(e) => setValues({ ...values, salary: e.target.value })}
            onBlur={() => handleBlur('salary')}
            style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: `1px solid ${touched.salary && errors.salary ? '#ef4444' : '#334155'}`, borderRadius: '6px', color: '#fff' }}
          />
          {touched.salary && errors.salary && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.salary}</span>}
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          Validate & Submit
        </button>
      </form>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #18: Inline Editable Cell with Keyboard Revert (Enter/Escape)
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: EditableContainer -> [DisplayBadge (read-only) | InputEditor (autoFocus + action buttons)]
 * • State Model:
 *     - `text`: string committed value.
 *     - `isEditing`: boolean toggling view vs edit modes.
 *     - `draft`: string scratchpad buffer for editing without polluting committed state.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User clicks text badge -> sets `draft = text`, sets `isEditing = true`.
 * 2. Input renders with `autoFocus` enabled.
 * 3. User types changes.
 * 4a. If Enter or Save clicked: `setText(draft)`, `setIsEditing(false)`.
 * 4b. If Escape or Cancel clicked: `setDraft(text)` (reverts dirty changes), `setIsEditing(false)`.
 */
export function DemoInlineEditable() {
  const [text, setText] = useState('Senior Full Stack Architect');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => {
    setText(draft);
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(text);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '400px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
        Inline Editable Title (Click to edit, Enter saves, Esc cancels):
      </label>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <input 
            type="text"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            style={{ flex: 1, padding: '0.4rem 0.6rem', background: '#0f172a', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff' }}
          />
          <button onClick={save} style={{ padding: '0.4rem 0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
          <button onClick={cancel} style={{ padding: '0.4rem 0.6rem', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
        </div>
      ) : (
        <div 
          onClick={() => { setDraft(text); setIsEditing(true); }}
          style={{
            padding: '0.5rem 0.8rem',
            background: '#1e293b',
            border: '1px dashed #475569',
            borderRadius: '6px',
            color: '#f8fafc',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600
          }}
        >
          {text} ✎
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #19: Input Masking for Credit Card & Currency Formatters
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Input Masking Pattern:
 *     - Strips all non-digit characters via regex `val.replace(/\D/g, '')`.
 *     - Chunks credit cards into 4-character groups via `raw.match(/.{1,4}/g).join(' ')`.
 *     - Formats integer currency in cents via `(cents / 100).toLocaleString('en-US', { style: 'currency' })`.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User types in card or currency input.
 * 2. `onChange` intercepts the raw string.
 * 3. Strips non-digits to obtain pure numeric string.
 * 4. Applies mathematical masking / chunking.
 * 5. Commits formatted display string to state.
 */
export function DemoCardCurrencyFormatter() {
  const [card, setCard] = useState('');
  const [amount, setAmount] = useState('');

  const formatCard = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCard(parts ? parts.join(' ') : raw);
  };

  const formatCurrency = (val) => {
    const raw = val.replace(/\D/g, '');
    if (!raw) { setAmount(''); return; }
    const num = Number(raw) / 100;
    setAmount(num.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Credit Card (Formatted XXXX XXXX XXXX XXXX)</label>
        <input 
          type="text" 
          value={card} 
          onChange={(e) => formatCard(e.target.value)}
          placeholder="4532 8900 1234 5678"
          style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Currency Formatter (Integer Cents)</label>
        <input 
          type="text" 
          value={amount} 
          onChange={(e) => formatCurrency(e.target.value)}
          placeholder="$0.00"
          style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
        />
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PROBLEM #20: Drag-and-Drop File Upload with Simulation Progress
 * ============================================================================
 * 
 * 🏛️ SYSTEM ARCHITECTURE & DESIGN:
 * --------------------------------
 * • Component Tree: DropZoneContainer (onDragOver, onDragLeave, onDrop) -> EmptyStateIcon -> UploadedFilesList[] (progress bars)
 * • State Model:
 *     - `files`: FileItem[] tracking `{ name, size, progress: 0..100 }`.
 *     - `isDragging`: boolean controlling active drop zone border illumination.
 * • Browser/DOM APIs:
 *     - `e.preventDefault()` on `dragover` / `drop` (mandatory to stop browser opening the file directly).
 *     - `e.dataTransfer.files`: Accesses dropped file objects.
 * 
 * 🔄 SEQUENCE OF EXECUTION:
 * -------------------------
 * 1. User drags file over container -> `onDragOver` calls `e.preventDefault()`, sets `isDragging = true`.
 * 2. User releases file -> `onDrop` calls `e.preventDefault()`, reads `e.dataTransfer.files`.
 * 3. `handleFiles()` maps files into state and starts simulated upload progress increments.
 * 4. As `progress` reaches 100%, progress bar color transitions to emerald (`#10b981`).
 */
export function DemoFileUpload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (incoming) => {
    const newFiles = Array.from(incoming).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((_, idx) => {
      let p = 0;
      const interval = setInterval(() => {
        p += 25;
        setFiles(prev => prev.map((f, i) => i === prev.length - newFiles.length + idx ? { ...f, progress: Math.min(p, 100) } : f));
        if (p >= 100) clearInterval(interval);
      }, 300);
    });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '440px' }}>
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${isDragging ? '#6366f1' : '#475569'}`,
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.4)',
          cursor: 'pointer'
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.onchange = (e) => handleFiles(e.target.files);
          input.click();
        }}
      >
        <UploadCloud size={32} style={{ color: '#818cf8', marginBottom: '0.5rem' }} />
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          Drag & drop resumes or documents here, or click to browse
        </p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {files.map((file, idx) => (
            <div key={idx} style={{ background: '#0f172a', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.3rem' }}>
                <span>{file.name} ({file.size})</span>
                <span>{file.progress}%</span>
              </div>
              <div style={{ height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${file.progress}%`, background: file.progress === 100 ? '#10b981' : '#6366f1', transition: 'width 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
