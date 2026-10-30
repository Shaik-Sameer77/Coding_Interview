// Problems 39-50: Linked List Master Solutions
// Full Multi-Approach Solutions with JS & TS, Line-by-Line Breakdown, Dry Runs, Pitches, and Quizzes

export const LINKED_LIST_SOLUTIONS = {
  // ==========================================
  // PROBLEM 39: REVERSE LINKED LIST (LC #206)
  // ==========================================
  39: {
    id: 39,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    summary: 'Reverse a singly linked list in-place using iterative pointer manipulation or recursion.',
    prerequisites: ['Singly linked list node structure', 'Maintaining previous, current, and next references'],
    problemStatement: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    approaches: [
      {
        name: 'Approach 1: Iterative In-Place Pointer Rewiring (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: "Iterate through the list, rewiring each node\'s next pointer to point to the previous node.",
        intuition: 'Maintain prev (null) and curr (head). Before changing curr.next, store nextNode = curr.next. Then set curr.next = prev, advance prev = curr, and curr = nextNode.',
        codeJS: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const nextNode = curr.next; // 1. Save next node
    curr.next = prev;          // 2. Reverse link
    prev = curr;              // 3. Move prev forward
    curr = nextNode;          // 4. Move curr forward
  }

  return prev; // New head
}`,
        codeTS: `function reverseList(head: any): any {
  let prev: any = null;
  let curr: any = head;

  while (curr !== null) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }

  return prev;
}`,
        lineByLine: [
          'Line 2-3: Initialize prev to null and curr to head.',
          'Line 5: Traverse until curr is null.',
          'Line 6: Save nextNode reference to avoid losing the rest of the list.',
          'Line 7: Invert pointer: curr.next = prev.',
          'Line 8-9: Advance pointers in-place.',
          'Line 12: Return prev, the new head.'
        ],
        dryRun: [
          { step: 1, state: '1 -> 2 -> 3', action: 'curr=1, prev=null -> 1.next = null, prev=1, curr=2', result: '1 -> null' },
          { step: 2, state: 'curr=2', action: '2.next = 1, prev=2, curr=3', result: '2 -> 1 -> null' },
          { step: 3, state: 'curr=3', action: '3.next = 2, prev=3, curr=null', result: '3 -> 2 -> 1 -> null' }
        ],
        complexityDerivation: 'Single pass visits each of the N nodes once $\\to O(N)$ time. Reuses node pointers with O(1) auxiliary memory.'
      },
      {
        name: 'Approach 2: Recursive Post-Order Reversal',
        badge: 'Recursive / Elegant',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N) call stack',
        summary: 'Recursively reach the last node, then reverse links on the way back up the call stack.',
        intuition: 'Base case: if head is null or head.next is null, return head. Otherwise, reverse the sublist: head.next.next = head, and head.next = null.',
        codeJS: `function reverseListRecursive(head) {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head; // Point next node back to current
  head.next = null;      // Disconnect original forward link

  return newHead;
}`,
        codeTS: `function reverseListRecursive(head: any): any {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
        lineByLine: [
          'Line 2: Base case: single node or empty list returns itself.',
          'Line 4: Recursively reverse the rest of the list.',
          "Line 5-6: Rewire: head.next's next points back to head, clear head.next to prevent cycles.",
          'Line 8: Return preserved newHead.'
        ],
        dryRun: [
          { step: 1, state: 'Call stack reaches node 3', action: 'Returns 3 as newHead', result: 'newHead = 3' },
          { step: 2, state: 'Unwinds to node 2', action: '2.next.next = 2 (3 -> 2), 2.next = null', result: '3 -> 2 -> null' }
        ],
        complexityDerivation: 'Visits each node once in O(N) time. The call stack holds N frames in O(N) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Pointers', time: 'O(N)', space: 'O(1)', pros: 'Safe for arbitrarily long lists; no stack overflow risk', cons: 'Requires 3-pointer tracking' },
      { approach: 'Recursive Post-Order', time: 'O(N)', space: 'O(N)', pros: 'Concise functional code', cons: 'Vulnerable to call stack exhaustion on large lists' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Reverse Linked List**:
"To reverse a singly linked list in-place in O(N) time and O(1) space, I use an iterative three-pointer technique. I initialize prev as null and curr as head. At each node, I first save curr.next to avoid reference loss. Then I redirect curr.next to prev, advance prev to curr, and advance curr to the saved next node. When curr becomes null, prev points to the new head. This achieves in-place reversal with zero heap or stack allocations."`,
    followUps: [
      {
        question: 'How would you reverse only a subsegment between positions left and right (LeetCode #92)?',
        answer: 'Traverse to left - 1, reverse the sublist between left and right in-place using a similar loop, then reconnect the boundaries.'
      }
    ],
    recallQuiz: {
      question: 'Why must we save "curr.next" into a temporary variable before executing "curr.next = prev"?',
      options: [
        'Because overwriting curr.next destroys our pointer reference to the remainder of the list',
        'To allocate memory on the heap',
        'To prevent garbage collection of prev',
        'Because JavaScript requires four variable declarations'
      ],
      correctIndex: 0,
      explanation: 'Once curr.next is reassigned to prev, without nextNode, all downstream nodes become unreachable!'
    }
  },

  // ==========================================
  // PROBLEM 40: MERGE TWO SORTED LISTS (LC #21)
  // ==========================================
  40: {
    id: 40,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    summary: 'Merge two sorted linked lists into one sorted linked list by splicing nodes in-place.',
    prerequisites: ['Dummy Head pattern to simplify edge cases', 'Two-pointer list merging'],
    problemStatement: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    approaches: [
      {
        name: 'Approach 1: Iterative with Dummy Head (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'O(M + N)',
        spaceComplexity: 'O(1)',
        summary: 'Use a dummy head node. Compare list1.val and list2.val, attach the smaller node, and advance pointer.',
        intuition: 'A dummy head eliminates special conditional checks for initializing the head of the merged list. Once one list is exhausted, splice the remainder of the other list directly.',
        codeJS: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  // Attach remaining non-empty list
  tail.next = list1 !== null ? list1 : list2;

  return dummy.next;
}`,
        codeTS: `function mergeTwoLists(list1: any, list2: any): any {
  const dummy: any = { val: 0, next: null };
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
        lineByLine: [
          'Line 2-3: Create dummy node and point tail to it.',
          'Line 5-13: Compare head values, link tail.next to smaller, advance corresponding pointer.',
          'Line 16: Splice remaining nodes in O(1).',
          'Line 18: Return dummy.next as true head.'
        ],
        dryRun: [
          { step: 1, state: 'list1=[1,2,4], list2=[1,3,4]', action: '1 <= 1 -> tail.next = list1(1), list1 = [2,4]', result: 'dummy -> 1' },
          { step: 2, state: 'list1=[2,4], list2=[1,3,4]', action: '1 < 2 -> tail.next = list2(1), list2 = [3,4]', result: 'dummy -> 1 -> 1' }
        ],
        complexityDerivation: 'Traverses each node of both lists at most once $\\to O(M + N)$ time. Only rewires existing pointers $\\to O(1)$ space.'
      },
      {
        name: 'Approach 2: Recursive Merging',
        badge: 'Recursive / Elegant',
        timeComplexity: 'O(M + N)',
        spaceComplexity: 'O(M + N) stack',
        summary: 'Recursively splice whichever node is smaller and attach the merged remainder.',
        intuition: 'If list1.val < list2.val, list1.next = mergeTwoLists(list1.next, list2); return list1. Symmetrically for list2.',
        codeJS: `function mergeTwoListsRecursive(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}`,
        codeTS: `function mergeTwoListsRecursive(list1: any, list2: any): any {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}`,
        lineByLine: [
          'Line 2-3: Base cases: if either list is null, return the other.',
          'Line 5-11: Splice smaller head, recursively merge rest, return smaller head.'
        ],
        dryRun: [
          { step: 1, state: 'merge(1->2, 1->3)', action: '1 <= 1 -> 1.next = merge(2, 1->3)', result: 'Stack recurses' }
        ],
        complexityDerivation: 'M + N recursive calls cost O(M + N) time and O(M + N) stack memory.'
      }
    ],
    comparisonTable: [
      { approach: 'Iterative Dummy Head', time: 'O(M + N)', space: 'O(1)', pros: 'Safe for large lists; zero heap copies', cons: 'Requires dummy node' },
      { approach: 'Recursive Splicing', time: 'O(M + N)', space: 'O(M + N) stack', pros: 'Extremely clean code', cons: 'Risk of call-stack overflow on deep lists' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Merge Two Sorted Lists**:
"To merge two sorted linked lists cleanly in O(M+N) time and O(1) space, I use the Dummy Head technique. The dummy node eliminates branch checks for initializing the head. I maintain a tail pointer and loop while both lists have nodes, splicing the smaller node onto tail.next and advancing. Once either list is exhausted, I attach the remaining non-empty list in O(1) time. Returning dummy.next gives the merged head."`,
    followUps: [
      {
        question: 'How does this extend to K sorted linked lists (LeetCode #23)?',
        answer: 'We can either use Divide and Conquer pairwise merging in O(N log K) or a Min-Heap of size K in O(N log K) time.'
      }
    ],
    recallQuiz: {
      question: 'What is the primary architectural purpose of using a "dummy" head node?',
      options: [
        'It eliminates edge case branch checks for setting the initial head pointer',
        'It speeds up JavaScript V8 JIT compilation',
        'It sorts the nodes automatically in memory',
        'It makes the list doubly linked'
      ],
      correctIndex: 0,
      explanation: 'A dummy head eliminates null-checks when adding the first node, unifying insertion logic across all steps!'
    }
  },

  // ==========================================
  // PROBLEM 41: LINKED LIST CYCLE (LC #141)
  // ==========================================
  41: {
    id: 41,
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    pattern: 'Linked List',
    day: 23,
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    summary: 'Determine if a linked list contains a cycle using Floyd\'s Tortoise and Hare algorithm in O(1) space.',
    prerequisites: ['Floyd\'s Cycle Finding Algorithm (Fast & Slow Pointers)', 'Hash Set reference tracking vs O(1) pointers'],
    problemStatement: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.`,
    approaches: [
      {
        name: 'Approach 1: Hash Set Visited Node Tracking (Baseline)',
        badge: 'Baseline / Hash Set',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        summary: 'Store visited node references in a Set. If a node is already in the set, a cycle exists.',
        intuition: 'Each node in memory has a unique object identity. A repeat visit means a cycle.',
        codeJS: `function hasCycleSet(head) {
  const visited = new Set();
  let curr = head;
  while (curr !== null) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}`,
        codeTS: `function hasCycleSet(head: any): boolean {
  const visited = new Set<any>();
  let curr = head;
  while (curr !== null) {
    if (visited.has(curr)) return true;
    visited.add(curr);
    curr = curr.next;
  }
  return false;
}`,
        lineByLine: [
          'Line 2: Instantiate Set to track visited node references.',
          'Line 3-7: Traverse list; if node already seen, cycle detected; else add to set.'
        ],
        dryRun: [
          { step: 1, state: 'node 3 -> 2 -> 0 -> -4 -> 2', action: 'Set records 3, 2, 0, -4. Hits 2 again.', result: 'visited.has(2) is true' }
        ],
        complexityDerivation: 'Single pass visits N nodes in O(N) time with O(N) heap memory for node references.'
      },
      {
        name: 'Approach 2: Floyd\'s Tortoise and Hare (Optimal)',
        badge: 'Optimal / Fast & Slow Pointers',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        summary: 'Slow pointer moves 1 step; fast pointer moves 2 steps. If a cycle exists, they must collide.',
        intuition: 'Imagine two runners on a circular track: the faster runner will eventually lap the slower runner. With fast advancing 2 steps and slow advancing 1 step, the relative distance between them closes by 1 on every iteration inside a cycle.',
        codeJS: `function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps

    if (slow === fast) {
      return true; // Collision detected -> cycle exists
    }
  }

  return false; // Fast reached end of list
}`,
        codeTS: `function hasCycle(head: any): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}`,
        lineByLine: [
          'Line 2-3: Initialize slow and fast pointers at head.',
          'Line 5: Loop while fast and fast.next are non-null.',
          'Line 6-7: Advance slow by 1 step, fast by 2 steps.',
          'Line 9-11: If pointers reference the exact same node in memory, cycle detected.',
          'Line 14: If fast reaches null, list terminates with no cycle.'
        ],
        dryRun: [
          { step: 1, state: 'List 3 -> 2 -> 0 -> -4 (points back to 2)', action: 'slow=2, fast=0', result: 'No collision yet' },
          { step: 2, state: 'slow=0, fast=2', action: 'slow advances 1, fast advances 2', result: 'Pointers converging' },
          { step: 3, state: 'slow=-4, fast=-4', action: 'slow === fast', result: 'Collision! Returns true' }
        ],
        complexityDerivation: 'If no cycle, fast reaches end in N/2 steps. If cycle of length C, fast catches slow within C steps $\\to O(N)$ time. Uses two pointers $\\to O(1)$ space.'
      }
    ],
    comparisonTable: [
      { approach: 'Hash Set Visited Track', time: 'O(N)', space: 'O(N)', pros: 'Trivial mental model', cons: 'Allocates O(N) heap memory for node references' },
      { approach: 'Floyd\'s Fast & Slow Pointers', time: 'O(N)', space: 'O(1)', pros: 'Optimal asymptotic complexity; zero heap allocations', cons: 'Requires collision proof' }
    ],
    interviewPitch: `**60-Second Interview Pitch for Linked List Cycle**:
"To detect a cycle in O(1) space, I use Floyd\'s Tortoise and Hare algorithm. I initialize two pointers, slow and fast, at the head. In each iteration, slow advances 1 step while fast advances 2 steps.

If the list has no cycle, fast will safely hit null in O(N/2) steps. If a cycle exists, both pointers will enter the loop. Because fast moves 1 step faster than slow, the gap between them shrinks by exactly 1 on every step, guaranteeing they will collide without skipping past each other. This confirms cycle presence in O(N) time and O(1) memory."`,
    followUps: [
      {
        question: 'How do you find the EXACT start node of the cycle (LeetCode #142)?',
        answer: 'When slow and fast collide, reset slow to head. Advance both slow and fast by 1 step simultaneously. The node where they meet again is mathematically proven to be the cycle start!'
      }
    ],
    recallQuiz: {
      question: 'Why is fast guaranteed never to "hop over" slow inside a cycle when moving at 2 steps per turn?',
      options: [
        'Because the relative distance between them decreases by exactly 1 on each step',
        'Because slow stops moving inside cycles',
        'Because JavaScript pointers are synchronized by the engine',
        'Because cycle lengths are always even numbers'
      ],
      correctIndex: 0,
      explanation: 'With speed 2 vs speed 1, the relative distance changes by |2 - 1| = 1 every tick. A distance decreasing by 1 cannot jump over 0!'
    }
  },

  // ==========================================
  // PROBLEM 48: LRU CACHE (LC #146)
  // ==========================================
  48: {
    id: 48,
    title: 'LRU Cache',
    difficulty: 'Medium',
    pattern: 'Linked List',
    day: 27,
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
    summary: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.',
    prerequisites: ['Doubly Linked List node wiring (prev & next)', 'Hash Map pointing to DLL nodes', 'O(1) deletion and insertion at head/tail'],
    problemStatement: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    approaches: [
      {
        name: 'Approach 1: Hash Map + Doubly Linked List (Optimal)',
        badge: 'Optimal / Production-Grade',
        timeComplexity: 'get: O(1), put: O(1)',
        spaceComplexity: 'O(Capacity)',
        summary: 'Hash Map provides O(1) node lookup. Doubly Linked List with dummy head and tail maintains usage order in O(1).',
        intuition: 'Whenever a key is accessed or updated, remove its node from its current position and re-insert it right after dummy head (most recently used). When capacity is exceeded, evict tail.prev (least recently used).',
        codeJS: `class DLLNode {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> DLLNode

    // Dummy boundary nodes
    this.head = new DLLNode();
    this.tail = new DLLNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addHead(node); // Mark as most recently used
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = value;
      this._remove(node);
      this._addHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        // Evict LRU node (tail.prev)
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DLLNode(key, value);
      this.map.set(key, newNode);
      this._addHead(newNode);
    }
  }
}`,
        codeTS: `class DLLNode {
  key: number;
  val: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;
  constructor(key: number = 0, val: number = 0) {
    this.key = key;
    this.val = val;
  }
}

class LRUCache {
  private capacity: number;
  private map: Map<number, DLLNode>;
  private head: DLLNode;
  private tail: DLLNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DLLNode();
    this.tail = new DLLNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private _remove(node: DLLNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private _addHead(node: DLLNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this._remove(node);
    this._addHead(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this._remove(node);
      this._addHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev!;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DLLNode(key, value);
      this.map.set(key, newNode);
      this._addHead(newNode);
    }
  }
}`,
        lineByLine: [
          'Line 1-8: Doubly linked list node definition storing key and value.',
          'Line 10-18: Initialize Map and dummy head & tail to avoid null-boundary checks.',
          'Line 20-23: _remove(node) unlinks node from list in O(1).',
          'Line 25-30: _addHead(node) inserts node directly after dummy head in O(1).',
          'Line 32-38: get(key): lookup in map, move to head, return value.',
          'Line 40-56: put(key, val): update or evict tail.prev (LRU), insert new node at head.'
        ],
        dryRun: [
          { step: 1, state: 'cap=2, put(1, 1), put(2, 2)', action: 'head <-> 2 <-> 1 <-> tail', result: 'map has {1, 2}' },
          { step: 2, state: 'get(1)', action: 'move 1 to head: head <-> 1 <-> 2 <-> tail', result: 'Returns 1' },
          { step: 3, state: 'put(3, 3) exceeds cap', action: 'evict 2 (tail.prev): head <-> 3 <-> 1 <-> tail', result: '2 deleted from map' }
        ],
        complexityDerivation: 'Hash map operations are O(1) average. Doubly linked list node splicing and unlinking involves 4 pointer reassignments $\\to O(1)$ strict time. Total space is bounded by O(Capacity).'
      },
      {
        name: 'Approach 2: JS Map Insertion-Order Trick',
        badge: 'JavaScript Native / Map Keys',
        timeComplexity: 'get: O(1), put: O(1)',
        spaceComplexity: 'O(Capacity)',
        summary: 'Leverage JavaScript\'s native Map guarantee that keys are iterated in insertion order.',
        intuition: 'On get() or update, delete the key and re-set it to move it to the back. On eviction, map.keys().next().value returns the oldest key.',
        codeJS: `class LRUCacheMap {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Re-insert at end
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`,
        codeTS: `class LRUCacheMap {
  private capacity: number;
  private map = new Map<number, number>();
  constructor(capacity: number) { this.capacity = capacity; }
  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key: number, value: number): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey!);
    }
    this.map.set(key, value);
  }
}`,
        lineByLine: [
          'Line 2-5: ES6 Map retains insertion order.',
          'Line 7-12: get() deletes and re-inserts key to refresh order.',
          'Line 14-20: put() evicts oldest key using this.map.keys().next().value.'
        ],
        dryRun: [
          { step: 1, state: 'put(1, 1), put(2, 2)', action: 'keys: [1, 2]', result: 'Capacity full' },
          { step: 2, state: 'get(1)', action: 'keys: [2, 1]', result: '1 moved to back' }
        ],
        complexityDerivation: 'Map operations take O(1) time and O(Capacity) space.'
      }
    ],
    comparisonTable: [
      { approach: 'Array / Object Timestamp Tracking', time: 'get: O(1), put: O(N)', space: 'O(Capacity)', pros: 'Simpler setup', cons: 'Eviction requires linear scan to find minimum timestamp' },
      { approach: 'Hash Map + Doubly Linked List', time: 'get: O(1), put: O(1)', space: 'O(Capacity)', pros: 'Strict O(1) operations; enterprise LRU industry standard', cons: 'Requires bidirectional node pointer bookkeeping' }
    ],
    interviewPitch: `**60-Second Interview Pitch for LRU Cache**:
"To achieve O(1) for both get() and put(), I combine a Hash Map with a Doubly Linked List. The Hash Map gives O(1) access to list nodes by key, while the Doubly Linked List allows O(1) node removal and insertion.

I maintain dummy head and dummy tail boundary nodes. The most recently used node is always placed immediately after head, and the least recently used node is always at tail.prev. On get(), I locate the node via map, unlink it in O(1), and re-insert it at head. On put(), if capacity is reached, I evict tail.prev in O(1) from both the list and the map, then insert the new node at head. This guarantees strict O(1) time and O(capacity) space."`,
    followUps: [
      {
        question: 'Why is a Doubly Linked List required instead of a Singly Linked List?',
        answer: 'To remove a node in O(1), we must re-link its predecessor (node.prev.next = node.next). A singly linked list would require an O(N) traversal to find node.prev.'
      },
      {
        question: 'Why do we store the key inside the DLLNode?',
        answer: 'When evicting the LRU node at tail.prev, we must delete its key from the Hash Map (map.delete(lru.key)). Storing key in the node enables this in O(1).'
      }
    ],
    recallQuiz: {
      question: 'Why does each DLLNode need to store its corresponding key as well as its value?',
      options: [
        'To delete the key from the Hash Map in O(1) when the node is evicted from tail.prev',
        'To sort the list alphabetically',
        'Because JavaScript objects require string keys',
        'To check for duplicate node references'
      ],
      correctIndex: 0,
      explanation: 'When evicting tail.prev, we only have the node reference. We need node.key to call map.delete(node.key) in O(1)!'
    }
  }
};
