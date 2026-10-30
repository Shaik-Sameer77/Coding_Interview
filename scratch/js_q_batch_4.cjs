// scratch/js_q_batch_4.cjs - Questions 121 to 160
module.exports = [
  // TOPIC 9: Practical Coding Challenges (Q121–135)
  {
    id: 121,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: In-Place Array Reversal without Built-in Reverse (2 Methods)",
    answer: "Reverse an array in-place without creating a new array.\n\n**Method 1: Two-Pointer Swap In-Place (Optimal O(N) Time, O(1) Auxiliary Space)**\n• Pointers at `left = 0` and `right = length - 1` swap elements using destructuring `[arr[left], arr[right]] = [arr[right], arr[left]]`.\n\n**Method 2: Native Array.prototype.reverse()**\n• Built-in mutator method.",
    approaches: [
      {
        title: "Approach 1: Two-Pointer Swap In-Place (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Maintains two pointers moving inward towards the center, swapping elements until they meet. Mutates the array in place with zero additional allocations.",
        code: `function reverseArrayInPlace(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}
console.log(reverseArrayInPlace([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]`
      },
      {
        title: "Approach 2: Native reverse()",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Uses JavaScript's built-in Array.prototype.reverse(), which mutates the array in place.",
        code: `const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]`
      }
    ]
  },
  {
    id: 122,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: Reverse a String (3 Methods)",
    answer: "Reverse a string in JavaScript.\n\n**Method 1: Built-in split, reverse, and join (Cleanest)**\n• Converts to character array, reverses, and joins back.\n\n**Method 2: Iterative for...of loop**\n• Prepends each character to accumulator: `reversed = char + reversed`.\n\n**Method 3: Decrementing loop with Array join (Fastest for large strings)**\n• Pushes characters in reverse order into an array and joins once.",
    approaches: [
      {
        title: "Approach 1: Built-in split, reverse, join",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Straightforward baseline using built-in methods.",
        code: `function reverseStringBuiltin(str) {
  return str.split("").reverse().join("");
}
console.log(reverseStringBuiltin("javascript")); // "tpircsavaj"`
      },
      {
        title: "Approach 2: Decrementing Loop with Array (Optimal Memory)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Avoids repeated immutable string concatenation reallocations by collecting characters into an array buffer and joining once.",
        code: `function reverseStringLoop(str) {
  const result = [];
  for (let i = str.length - 1; i >= 0; i--) {
    result.push(str[i]);
  }
  return result.join("");
}
console.log(reverseStringLoop("chrona")); // "anorhc"`
      }
    ]
  },
  {
    id: 123,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: Valid Palindrome (2 Methods)",
    answer: "Determine if a string is a palindrome, ignoring non-alphanumeric characters and casing.\n\n**Method 1: Two-Pointer Inward Scan (Optimal O(N) Time, O(1) Auxiliary Space)**\n• Pointers at both ends skip invalid characters and compare character codes.\n\n**Method 2: Regex Clean + Reverse Comparison**\n• Sanitize string with regex and compare `cleanStr === cleanStr.split('').reverse().join('')`.",
    approaches: [
      {
        title: "Approach 1: Two-Pointer Scan (Optimal O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Two pointers move toward each other, skipping non-alphanumeric characters. Compares characters case-insensitively with early exit.",
        code: `function isPalindromeTwoPointer(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}
console.log(isPalindromeTwoPointer("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeTwoPointer("race a car")); // false`
      },
      {
        title: "Approach 2: Regex Clean + Reverse",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Sanitizes the string using regex, reverses it, and checks equality.",
        code: `function isPalindromeClean(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
}
console.log(isPalindromeClean("radar")); // true`
      }
    ]
  },
  {
    id: 124,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: Valid Anagram (2 Methods)",
    answer: "Given two strings s and t, return true if t is an anagram of s.\n\n**Method 1: Frequency Hash Map (Optimal O(N) Time, O(1) Space - max 26 chars)**\n• Increment frequency for s, decrement for t. Check if all frequencies return to 0.\n\n**Method 2: Sorting Comparison (O(N log N) Time)**\n• Sort characters and compare equality.",
    approaches: [
      {
        title: "Approach 1: Frequency Map (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Single frequency map counts characters. Early exit if lengths differ.",
        code: `function isAnagramMap(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};

  for (let i = 0; i < s.length; i++) {
    counts[s[i]] = (counts[s[i]] || 0) + 1;
    counts[t[i]] = (counts[t[i]] || 0) - 1;
  }

  for (const char in counts) {
    if (counts[char] !== 0) return false;
  }
  return true;
}
console.log(isAnagramMap("anagram", "nagaram")); // true
console.log(isAnagramMap("rat", "car")); // false`
      },
      {
        title: "Approach 2: Sort Comparison",
        timeComplexity: "O(N log N)",
        spaceComplexity: "O(N)",
        explanation: "Sorts both strings and compares equality.",
        code: `function isAnagramSort(s, t) {
  if (s.length !== t.length) return false;
  return s.split("").sort().join("") === t.split("").sort().join("");
}`
      }
    ]
  },
  {
    id: 125,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: Two Sum (2 Methods)",
    answer: "Find indices of two numbers that add up to target.\n\n**Method 1: Hash Map One-Pass (Optimal O(N) Time, O(N) Space)**\n• Store `target - current` in map as you iterate.\n\n**Method 2: Brute Force Nested Loops (O(N²) Time, O(1) Space)**\n• Nested loops compare every pair.",
    approaches: [
      {
        title: "Approach 1: Hash Map One-Pass (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Calculates complement for each number. If complement is already in map, returns current index and complement index.",
        code: `function twoSumMap(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSumMap([2, 7, 11, 15], 9)); // [0, 1]`
      },
      {
        title: "Approach 2: Brute Force Nested Loops",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        explanation: "Checks every combination of pairs with two nested loops.",
        code: `function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`
      }
    ]
  },
  {
    id: 126,
    topicId: 9,
    difficulty: "Intermediate",
    category: "Coding Challenge",
    question: "Coding Challenge: Flatten a Nested Array (2 Methods)",
    answer: "Flatten an array of arbitrary nesting depth.\n\n**Method 1: Recursive Accumulator (Clean & Functional)**\n• If item is Array, recurse; otherwise push.\n\n**Method 2: Iterative Stack (Prevents Call Stack Overflow)**\n• Uses explicit array stack to handle arbitrarily deep nesting.",
    approaches: [
      {
        title: "Approach 1: Recursive Accumulator",
        timeComplexity: "O(N)",
        spaceComplexity: "O(D) call stack",
        explanation: "Recursively flattens sub-arrays into an accumulator.",
        code: `function flattenRecursive(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenRecursive(item));
    } else {
      result.push(item);
    }
  }
  return result;
}
console.log(flattenRecursive([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]`
      },
      {
        title: "Approach 2: Iterative Stack (Safe for huge depth)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Uses an explicit heap stack, completely immune to Call Stack limits.",
        code: `function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}
console.log(flattenIterative([1, [2, [3, 4]]])); // [1, 2, 3, 4]`
      }
    ]
  },
  {
    id: 127,
    topicId: 9,
    difficulty: "Senior",
    category: "Coding Challenge",
    question: "Coding Challenge: Deep Clone with Circular Reference Support (2 Methods)",
    answer: "Duplicate an object deeply, correctly handling circular references, Dates, and Sets.\n\n**Method 1: WeakMap Recursion (Classic Senior Interview Implementation)**\n• Tracks visited objects in a `WeakMap`. If already seen, returns cached clone to break cycles.\n\n**Method 2: native structuredClone()**\n• Standard modern global API.",
    approaches: [
      {
        title: "Approach 1: WeakMap Recursion (Optimal Custom)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Recursively clones properties while storing visited objects in a WeakMap to prevent infinite recursion on circular graphs.",
        code: `function deepClone(obj, visited = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Set) {
    const setCopy = new Set();
    obj.forEach(val => setCopy.add(deepClone(val, visited)));
    return setCopy;
  }

  if (visited.has(obj)) return visited.get(obj); // Cycle broken!

  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, clone);

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], visited);
  }

  return clone;
}

const circular = { name: "Chrona" };
circular.self = circular;
const copy = deepClone(circular);
console.log(copy.self === copy); // true (Circular reference preserved!)`
      },
      {
        title: "Approach 2: native structuredClone()",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Uses browser and Node.js 17+ native structuredClone() API.",
        code: `const data = { id: 1, created: new Date() };
data.ref = data;
const cloned = structuredClone(data);
console.log(cloned.ref === cloned); // true`
      }
    ]
  },
  {
    id: 128,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: Array Chunking (Split into subarrays of size K)",
    answer: "Divide an array into sub-arrays of maximum size K.\n• Iterate with stride `i += size` and slice: `arr.slice(i, i + size)`.\n• **Time**: **O(N)** | **Space**: **O(N)**.",
    code: `function chunkArray(arr, size) {
  if (size <= 0) throw new Error("Size must be positive");
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
console.log(chunkArray([1, 2, 3, 4, 5, 6, 7], 3)); // [[1, 2, 3], [4, 5, 6], [7]]`
  },
  {
    id: 129,
    topicId: 9,
    difficulty: "Junior",
    category: "Coding Challenge",
    question: "Coding Challenge: First Non-Repeating Character in a String",
    answer: "Find the first character in a string that appears only once.\n• Pass 1: Build frequency map ($O(N)$).\n• Pass 2: Find first character with count 1 ($O(N)$).\n• **Time**: **O(N)** | **Space**: **O(1)** (at most 256 unique characters).",
    code: `function firstNonRepeatingChar(str) {
  const counts = new Map();
  for (const char of str) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }
  for (const char of str) {
    if (counts.get(char) === 1) return char;
  }
  return null;
}
console.log(firstNonRepeatingChar("swiss")); // "w"`
  },
  {
    id: 130,
    topicId: 9,
    difficulty: "Senior",
    category: "Coding Challenge",
    question: "Coding Challenge: Production Debounce with Leading Edge & Cancel options",
    answer: "Debounce delays invoking `fn` until after `delay` ms of silence. Support leading edge and cancellation.",
    code: `function debounce(fn, delay, immediate = false) {
  let timerId = null;

  function debounced(...args) {
    const context = this;
    const callNow = immediate && !timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) fn.apply(context, args);
    }, delay);

    if (callNow) fn.apply(context, args);
  }

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}`
  },
  {
    id: 131,
    topicId: 9,
    difficulty: "Senior",
    category: "Coding Challenge",
    question: "Coding Challenge: Production Throttle with Trailing Edge Execution",
    answer: "Throttle limits execution to at most once per `limit` ms window, preserving trailing call.",
    code: `function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}`
  },
  {
    id: 132,
    topicId: 9,
    difficulty: "Intermediate",
    category: "Polyfill",
    question: "Coding Challenge: Implement a Custom Array.prototype.map() Polyfill",
    answer: "Transforms each element, preserving sparse array holes via `i in this`.",
    code: `Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};
console.log([1, 2, 3].myMap(x => x * 10)); // [10, 20, 30]`
  },
  {
    id: 133,
    topicId: 9,
    difficulty: "Intermediate",
    category: "Polyfill",
    question: "Coding Challenge: Implement a Custom Array.prototype.filter() Polyfill",
    answer: "Iterates elements, evaluating predicate callback, preserving sparsity.",
    code: `Array.prototype.myFilter = function(callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
console.log([1, 2, 3, 4].myFilter(x => x % 2 === 0)); // [2, 4]`
  },
  {
    id: 134,
    topicId: 9,
    difficulty: "Intermediate",
    category: "Polyfill",
    question: "Coding Challenge: Implement a Custom Array.prototype.reduce() Polyfill",
    answer: "Accumulates elements into a single value, properly managing omitted initialValue.",
    code: `Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const len = this.length;
  let i = 0;
  let acc;

  if (arguments.length >= 2) {
    acc = initialValue;
  } else {
    while (i < len && !(i in this)) i++;
    if (i >= len) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[i++];
  }

  for (; i < len; i++) {
    if (i in this) {
      acc = callback(acc, this[i], i, this);
    }
  }
  return acc;
};
console.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10`
  },
  {
    id: 135,
    topicId: 9,
    difficulty: "Senior",
    category: "Coding Challenge",
    question: "Coding Challenge: Async Retry with Exponential Backoff and Jitter",
    answer: "Executes an async task with retries, exponential backoff (e.g. 200ms, 400ms, 800ms) and randomized jitter to avoid thundering herd problem.",
    code: `async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 200) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      const jitter = Math.random() * 100;
      const delay = baseDelay * Math.pow(2, attempt) + jitter;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}`
  },

  // TOPIC 10: Senior Scenarios, Architecture & Polyfills (Q136–150)
  {
    id: 136,
    topicId: 10,
    difficulty: "Senior",
    category: "Polyfill",
    question: "Coding Challenge: Implement a Custom Promise.all() Polyfill",
    answer: "Fulfills when all promises fulfill, storing results at exact input indices.",
    code: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError("Must be array"));
    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) return resolve(results);

    promises.forEach((p, idx) => {
      Promise.resolve(p)
        .then(val => {
          results[idx] = val; // Store at exact index
          completed++;
          if (completed === total) resolve(results);
        })
        .catch(reject); // Rejects immediately on 1st error
    });
  });
}`
  },
  {
    id: 137,
    topicId: 10,
    difficulty: "Senior",
    category: "Polyfill",
    question: "Coding Challenge: Implement a Custom Function.prototype.bind() Polyfill",
    answer: "Returns a new bound function with permanently bound this and partially applied arguments.",
    code: `Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const originalFn = this;
  if (typeof originalFn !== "function") throw new TypeError("Must be callable");

  return function boundFn(...callArgs) {
    // If called with 'new', this points to instance
    if (this instanceof boundFn) {
      return new originalFn(...boundArgs, ...callArgs);
    }
    return originalFn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};`
  },
  {
    id: 138,
    topicId: 10,
    difficulty: "Intermediate",
    category: "DOM & Browser",
    question: "What is the difference between DOM Event Bubbling and Capturing?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
When a DOM event fires, it traverses through three phases:
1. **Capturing Phase**: Travels down from \`window\` -> \`document\` -> parent containers -> target.
2. **Target Phase**: Reaches the target element clicked.
3. **Bubbling Phase**: Bubbles upward from target -> parents -> \`window\`.
By default, \`element.addEventListener("click", handler)\` listens in the bubbling phase. Pass \`{ capture: true }\` to listen in the capturing phase.`,
    code: `element.addEventListener("click", handler, { capture: true });`
  },
  {
    id: 139,
    topicId: 10,
    difficulty: "Intermediate",
    category: "DOM & Browser",
    question: "What is the Event Delegation pattern and why is it superior for large lists?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Event Delegation** is the practice of attaching a **single event listener to a common parent element** rather than thousands of listeners to individual child items. When an event bubbles up, inspect \`event.target.closest('.item')\`.
• **Benefits**: Drastically reduces memory usage, prevents listener leaks, and automatically handles dynamically inserted child elements.`,
    code: `document.querySelector("#list").addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (item) console.log("Clicked:", item.dataset.id);
});`
  },
  {
    id: 140,
    topicId: 10,
    difficulty: "Junior",
    category: "DOM & Browser",
    question: "What is the difference between preventDefault() and stopPropagation()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`event.preventDefault()\`**: Cancels the browser's native default behavior (e.g. following a link, submitting a form) without stopping event bubbling.
• **\`event.stopPropagation()\`**: Stops the event from traversing further up or down the DOM tree, but permits the browser's default action.`,
    code: `form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevents page reload
});`
  },
  {
    id: 141,
    topicId: 10,
    difficulty: "Intermediate",
    category: "Storage & Security",
    question: "What is the difference between LocalStorage, SessionStorage, and Cookies?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **LocalStorage**: Persistent storage (~5–10MB), client-side only, not sent in HTTP requests. XSS vulnerable.
• **SessionStorage**: Tab lifetime (~5MB), client-side only, cleared on tab close.
• **Cookies**: Small (~4KB), sent automatically with matching HTTP requests. Crucially supports **\`HttpOnly\`** (protects from XSS) and **\`SameSite=Strict/Lax\`** (protects from CSRF).`,
    table: {
      headers: ["Feature", "LocalStorage", "SessionStorage", "Cookies"],
      rows: [
        ["Capacity", "~5-10MB", "~5MB", "~4KB"],
        ["Lifetime", "Permanent", "Tab session", "Expires / Max-Age"],
        ["Sent with HTTP", "No", "No", "Yes"],
        ["XSS Protection", "None", "None", "HttpOnly flag blocks JS"]
      ]
    }
  },
  {
    id: 142,
    topicId: 10,
    difficulty: "Senior",
    category: "Security",
    question: "How do you prevent Prototype Pollution vulnerabilities in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Prototype Pollution** occurs when untrusted user JSON input recursively modifies \`Object.prototype\` or \`__proto__\`, injecting malicious properties across every object in the runtime.
• **Defenses**:
  1. Sanitize and drop \`__proto__\`, \`constructor\`, and \`prototype\` keys during deep merges.
  2. Use \`Object.create(null)\` for user dictionaries (has no prototype to pollute).
  3. Use \`Map\` instead of plain objects for arbitrary user keys.
  4. Freeze \`Object.prototype\` during server startup (\`Object.freeze(Object.prototype)\`).`,
    code: `function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`
  },
  {
    id: 143,
    topicId: 10,
    difficulty: "Intermediate",
    category: "Performance",
    question: "What is the latency waterfall difference between Promise.all() and sequential await?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Sequential \`await\`**: Runs serially ($T_1 + T_2$). Request 2 waits for request 1 to complete before starting.
• **\`Promise.all()\`**: Runs concurrently in parallel ($\\max(T_1, T_2)$). Both network requests are dispatched at the same instant.`,
    code: `// Concurrent: Total latency = 300ms instead of 500ms
const [users, products] = await Promise.all([
  fetch("/api/users"),    // 300ms
  fetch("/api/products")  // 200ms
]);`
  },
  {
    id: 144,
    topicId: 10,
    difficulty: "Senior",
    category: "Senior Scenario",
    question: "Senior Scenario: How would you diagnose and fix a memory leak in a large frontend application?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
I follow a structured 4-step diagnostic protocol using Chrome DevTools Memory Profiler:
1. **Baseline**: Force GC and capture Snapshot 1.
2. **Reproduction**: Simulate suspected user action 20 times (e.g. open/close modal).
3. **Delta Comparison**: Force GC again, capture Snapshot 2, and switch to **Comparison view**.
4. **Identify Retainers**: Filter by positive allocation delta, inspect the Retainers Tree for detached DOM nodes or uncleared closure timers, apply cleanups, and verify a flat baseline.`,
    tip: "Emphasize comparative snapshot methodology rather than guessing."
  },
  {
    id: 145,
    topicId: 10,
    difficulty: "Senior",
    category: "Senior Scenario",
    question: "Senior Scenario: How would you debug an API request returning HTTP 200 that fails on the frontend?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
HTTP 200 only confirms transport success, not business logic success:
1. **Inspect Network Tab**: Examine raw response headers (\`Content-Type\`) and payload. Check if the server returned an error envelope (\`{ success: false, code: "AUTH_EXPIRED" }\`).
2. **Contract Mismatch**: Verify if a backend serialization change or decryption interceptor failed to unpack the payload before rendering.
3. **Real Portfolio Example**: In our project, an AES response-encryption interceptor failed to decrypt because a new endpoint bypassed the centralized Axios client. Resolved by unifying all requests through a single authenticated client instance.`,
    tip: "Connect HTTP status codes to application-level contracts."
  },
  {
    id: 146,
    topicId: 10,
    difficulty: "Staff",
    category: "FinTech Architecture",
    question: "Senior Scenario: How do you make payment processing reliable if a user closes their browser during checkout?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Never rely on the frontend redirect or client-side callback for payment fulfillment:
1. Persist the order in the database with status \`"pending_payment"\` before redirecting the customer.
2. Rely strictly on **Server-to-Server Webhooks** (e.g. Stripe \`checkout.session.completed\`).
3. Verify cryptographic webhook signatures (**HMAC SHA-256**) with raw body buffers.
4. Process fulfillment idempotently inside a database transaction keyed on the payment provider event ID.`,
    tip: "Mention server webhooks, HMAC signatures, and database transactions."
  },
  {
    id: 147,
    topicId: 10,
    difficulty: "Staff",
    category: "Distributed Systems",
    question: "Senior Scenario: What is idempotency and how do you implement it in a Node.js API?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An operation is **idempotent** if applying it multiple times produces the exact same system state as applying it once: $f(f(x)) = f(x)$. Essential for payment processing and retry loops to prevent duplicate credit card charges.
• **Implementation**:
  1. Client sends a unique \`Idempotency-Key\` header (UUID).
  2. Server attempts an atomic \`SETNX\` in Redis or unique index insert in DB.
  3. If key exists, return the cached previous response. If new, process and store response.`,
    tip: "Always emphasize atomic database unique constraints or Redis SETNX."
  },
  {
    id: 148,
    topicId: 10,
    difficulty: "Senior",
    category: "Interview Communication",
    question: "Senior Scenario: How would you explain a complex technical bug using the STAR method?",
    answer: `### The STAR Method Framework
• **Situation**: Describe the system and user impact (e.g. "During peak checkout on our marketplace, 3% of international orders failed").
• **Task**: What was your responsibility? ("I was tasked with identifying the root cause and restoring zero-defect checkouts").
• **Action**: What engineering steps did you take? ("Analyzed APM traces, identified a race condition in currency conversion caching, added mutex locks, and wrote Vitest regression tests").
• **Result**: Measurable outcome ("Zero checkout errors, latency reduced by 40ms, and verified with 100% test coverage").`,
    tip: "Follow Situation -> Task -> Action -> Result."
  },
  {
    id: 149,
    topicId: 10,
    difficulty: "Staff",
    category: "Senior Leadership",
    question: "Senior Scenario: What distinguishes a Senior Engineer's answer from a Junior Engineer's answer?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A junior engineer recites syntax and definitions. A senior engineer:
1. Explains **underlying engine mechanics** (call stack, V8 compilation, Libuv phases).
2. Proactively highlights **architectural trade-offs** (memory vs CPU, simplicity vs scale).
3. Discusses **failure modes & edge cases** (race conditions, memory leaks, security attack vectors).
4. Connects concepts to **concrete production systems** (idempotency, distributed tracing, observability).`,
    tip: "Always articulate trade-offs, edge cases, and production architecture."
  },
  {
    id: 150,
    topicId: 10,
    difficulty: "Staff",
    category: "Runtime Architecture",
    question: "Senior Scenario: Single-threaded vs multi-threaded Node.js architecture.",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Node.js runs JavaScript on a single thread event loop. However, its backend architecture is multi-threaded:
• **Libuv Thread Pool**: 4 background worker threads (configurable via \`UV_THREADPOOL_SIZE\`) handle file system calls (\`fs\`), DNS lookups, and CPU crypto (\`crypto.pbkdf2\`).
• **OS Non-Blocking Kernel**: Socket network I/O is handled directly by kernel multiplexing (\`epoll\`, \`kqueue\`, \`IOCP\`).
• **Worker Threads (\`node:worker_threads\`)**: Used for CPU-heavy tasks (image processing, machine learning) to avoid blocking the main event loop.`,
    tip: "Distinguish between the JS call stack thread, Libuv worker pool, and OS kernel I/O."
  },

  // TOPIC 11: Essential Coding Challenges (Q151–160)
  {
    id: 151,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Find the Largest and Smallest Number in an Array (3 Methods)",
    answer: "Find min and max values in an array.\n\n**Method 1: Math.max / Math.min with Spread** ($O(N)$ time, $O(1)$ space for small arrays, stack overflow for $> 65k$ items).\n**Method 2: reduce()** ($O(N)$ time, $O(1)$ space).\n**Method 3: Classic Single-Pass Loop (Optimal)** ($O(N)$ time, $O(1)$ space, handles huge arrays).",
    approaches: [
      {
        title: "Approach 1: Classic Single-Pass Loop (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Tracks min and max simultaneously in one loop. Handles arbitrary array lengths without call stack limits.",
        code: `function findMinMaxLoop(arr) {
  if (!arr.length) throw new Error("Empty array");
  let min = arr[0], max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    else if (arr[i] > max) max = arr[i];
  }
  return { min, max };
}
console.log(findMinMaxLoop([12, 5, 89, -4, 45])); // { min: -4, max: 89 }`
      },
      {
        title: "Approach 2: Math.max / Math.min with Spread",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N) arguments",
        explanation: "Clean 1-liner, suitable for arrays up to 65k elements.",
        code: `const findMinMaxMath = arr => ({ min: Math.min(...arr), max: Math.max(...arr) });`
      }
    ]
  },
  {
    id: 152,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Find the Second Largest Number in an Array (2 Methods)",
    answer: "Return the second largest distinct number.\n\n**Method 1: Single-Pass Two-Variable Tracking (Optimal O(N) Time, O(1) Space)**\n• No sorting, constant memory.\n\n**Method 2: Set Deduplication + Sort (O(N log N) Time)**.",
    approaches: [
      {
        title: "Approach 1: Single-Pass Tracking (Optimal)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "Maintains two variables `first` and `second`. Updates `second = first` when a new maximum is found.",
        code: `function getSecondLargest(arr) {
  let first = -Infinity, second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }
  return second === -Infinity ? null : second;
}
console.log(getSecondLargest([10, 5, 10, 8, 2])); // 8`
      },
      {
        title: "Approach 2: Set Deduplication + Sort",
        timeComplexity: "O(N log N)",
        spaceComplexity: "O(N)",
        explanation: "Deduplicates via Set, sorts descending, and returns index 1.",
        code: `function getSecondLargestSort(arr) {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  return unique.length >= 2 ? unique[1] : null;
}`
      }
    ]
  },
  {
    id: 153,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Group Array of Objects by Property or Callback (3 Methods)",
    answer: "Group items by category or role.\n\n**Method 1: ES2024 Object.groupBy()**\n**Method 2: reduce() with nullish assignment**\n**Method 3: Map-based grouping for complex keys**.",
    approaches: [
      {
        title: "Approach 1: reduce() with Nullish Assignment",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Standard production pattern using reduce and nullish assignment `(acc[key] ??= []).push(item)`.",
        code: `function groupByReduce(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}
const items = [{ type: 'veg', name: 'carrot' }, { type: 'fruit', name: 'apple' }, { type: 'veg', name: 'peas' }];
console.log(groupByReduce(items, 'type')); // { veg: [...], fruit: [...] }`
      },
      {
        title: "Approach 2: Modern Object.groupBy() (ES2024)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Native standard built into modern JavaScript engines.",
        code: `// Object.groupBy(items, item => item.type)`
      }
    ]
  },
  {
    id: 154,
    topicId: 11,
    difficulty: "Junior",
    category: "String Algorithms",
    question: "Coding Challenge: Character Frequency Counter in a String (3 Methods)",
    answer: "Count the frequency of each character.\n• **Method 1: Plain Object with nullish coalescing**\n• **Method 2: Map Instance (Safe from prototype keys)**\n• **Method 3: reduce() 1-liner**.",
    approaches: [
      {
        title: "Approach 1: Map Instance (Safe from Prototype Keys)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(K) unique chars",
        explanation: "Uses Map to avoid prototype key pollution (e.g. strings containing 'constructor' or 'toString').",
        code: `function charFrequency(str) {
  const map = new Map();
  for (const char of str) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}
console.log(charFrequency("javascript"));`
      }
    ]
  },
  {
    id: 155,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Count Element Frequencies in an Array (2 Methods)",
    answer: "Count occurrences of items in an array.\n• **Method 1: Map counter**\n• **Method 2: reduce() accumulator**.",
    code: `function countArrayFrequencies(arr) {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}
console.log(countArrayFrequencies(["apple", "banana", "apple"])); // { apple: 2, banana: 1 }`
  },
  {
    id: 156,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Remove Duplicates from an Array (3 Methods)",
    answer: "Deduplicate elements.\n• **Method 1: new Set() spread (Optimal O(N) Time, O(N) Space)**\n• **Method 2: In-place Two-Pointer on sorted array (O(1) Memory)**\n• **Method 3: filter() + indexOf() (O(N²))**.",
    approaches: [
      {
        title: "Approach 1: Set Spread (Optimal O(N))",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)",
        explanation: "Instant, readable, modern standard for deduplication.",
        code: `const removeDuplicates = arr => [...new Set(arr)];
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]`
      },
      {
        title: "Approach 2: In-Place Two-Pointer on Sorted Array (O(1) Space)",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        explanation: "LeetCode 26: writes unique elements in place without extra allocations.",
        code: `function removeDuplicatesSorted(nums) {
  if (!nums.length) return 0;
  let write = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[write++] = nums[i];
    }
  }
  nums.length = write;
  return nums;
}`
      }
    ]
  },
  {
    id: 157,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Find All Duplicate Elements in an Array (2 Methods)",
    answer: "Return elements that appear more than once.\n• **Method 1: Two Sets (O(N) Time, O(N) Space)**\n• **Method 2: Frequency Map filter**.",
    code: `function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return [...duplicates];
}
console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // [2, 3]`
  },
  {
    id: 158,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Intersection of Two Arrays (2 Methods)",
    answer: "Find common elements without duplicates.\n• **Method 1: Set filter (Optimal O(M + N) Time)**\n• **Method 2: Two-Pointer on sorted arrays**.",
    code: `function arrayIntersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter(x => setB.has(x)))];
}
console.log(arrayIntersection([1, 2, 2, 1], [2, 2])); // [2]`
  },
  {
    id: 159,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Difference & Symmetric Difference of Two Arrays (2 Methods)",
    answer: "• Difference (A - B): Elements in A not in B.\n• Symmetric Difference: Elements in either A or B, but not both.\n• **Time**: **O(M + N)** using Sets.",
    code: `function symmetricDifference(a, b) {
  const setA = new Set(a), setB = new Set(b);
  return [...a.filter(x => !setB.has(x)), ...b.filter(x => !setA.has(x))];
}
console.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]`
  },
  {
    id: 160,
    topicId: 11,
    difficulty: "Junior",
    category: "Array Algorithms",
    question: "Coding Challenge: Union of Two Arrays (2 Methods)",
    answer: "Combine unique elements from both arrays.\n• **Method 1: Spread into Set: `[...new Set([...a, ...b])]`**.\n• **Time**: **O(M + N)** | **Space**: **O(M + N)**.",
    code: `const arrayUnion = (a, b) => [...new Set([...a, ...b])];
console.log(arrayUnion([1, 2, 3], [3, 4, 5])); // [1, 2, 3, 4, 5]`
  }
];
