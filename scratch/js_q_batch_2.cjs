// scratch/js_q_batch_2.cjs - Questions 41 to 80
module.exports = [
  {
    id: 41,
    topicId: 3,
    difficulty: "Intermediate",
    category: "Functions & this",
    question: "What are call(), apply(), and bind(), and how do they differ?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`call\`, \`apply\`, and \`bind\` are methods on \`Function.prototype\` used to explicitly control and assign the \`this\` execution context of a function.
• **\`fn.call(thisArg, arg1, arg2, ...)\`**: Invokes the function immediately with comma-separated arguments.
• **\`fn.apply(thisArg, [args])\`**: Invokes the function immediately with arguments passed as an array.
• **\`fn.bind(thisArg, arg1, ...)\`**: Returns a **new bound function** with permanently bound \`this\` and optional preset arguments, without invoking it immediately.

### 2. Real-World Use Case
\`bind\` is commonly used in event handlers or timer callbacks to preserve component context; \`apply\` was historically used for variadic functions like \`Math.max.apply(null, arr)\` before array spread \`...\` existed.`,
    code: `function introduce(city, country) {
  return \`\${this.name} from \${city}, \${country}\`;
}
const user = { name: "Sameer" };

// call: immediate with arguments list
console.log(introduce.call(user, "Hyderabad", "India"));

// apply: immediate with array
console.log(introduce.apply(user, ["Hyderabad", "India"]));

// bind: returns new function for later invocation
const boundIntro = introduce.bind(user, "Hyderabad");
console.log(boundIntro("India"));`
  },
  {
    id: 42,
    topicId: 3,
    difficulty: "Senior",
    category: "this Binding",
    question: "How does the 'this' keyword work in JavaScript (The 4 Rules)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In regular JavaScript functions, \`this\` is NOT static. It is determined dynamically at the **CALL-SITE** based on how the function is invoked, following 4 rules in order of precedence:
1. **New Binding**: Was the function called with \`new\`? \`this\` is the newly created instance.
2. **Explicit Binding**: Was it called with \`call\`, \`apply\`, or \`bind\`? \`this\` is the supplied object.
3. **Implicit Binding**: Was it invoked as a method of an object (\`obj.method()\`)? \`this\` is the context object before the dot.
4. **Default Binding**: Standalone function invocation (\`fn()\`). \`this\` is \`undefined\` in strict mode, or \`window\`/\`global\` in non-strict.
*Arrow functions ignore all 4 rules and resolve \`this\` lexically.*`,
    code: `const account = {
  id: 101,
  getId() { return this.id; }
};
console.log(account.getId()); // 101 (Implicit binding)

const detached = account.getId;
// detached(); // undefined or TypeError in strict mode (Default binding)`
  },
  {
    id: 43,
    topicId: 3,
    difficulty: "Junior",
    category: "Functions",
    question: "What is an IIFE (Immediately Invoked Function Expression)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An **IIFE** is a function expression that is defined and executed immediately upon declaration: \`(function() { ... })()\`.
• **Purpose**: Historically used before ES6 \`let\`/\`const\` and ES Modules to create private local variable scope and avoid polluting the global \`window\` namespace.`,
    code: `const counterModule = (function() {
  let count = 0; // Private scope
  return {
    increment: () => ++count,
    get: () => count
  };
})();
console.log(counterModule.increment()); // 1`
  },
  {
    id: 44,
    topicId: 3,
    difficulty: "Intermediate",
    category: "Functional Programming",
    question: "What is currying and what problem does it solve?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Currying** is the functional technique of transforming a function that takes multiple arguments $f(a, b, c)$ into a sequence of nested functions that each take a single argument: $f(a)(b)(c)$.
• **Problem Solved**: Enables partial application, configurable utility factories, and smooth function composition pipelines.`,
    code: `const log = (level) => (prefix) => (message) => 
  console.log(\`[\${level}] [\${prefix}] \${message}\`);

const warnAuth = log("WARN")("AUTH");
warnAuth("Failed login attempt from IP 192.168.1.1");`
  },
  {
    id: 45,
    topicId: 3,
    difficulty: "Junior",
    category: "Algorithms",
    question: "What is the difference between recursion and iteration?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Iteration**: Repeats a block of code using explicit loop constructs (\`for\`, \`while\`). Memory-efficient with $O(1)$ stack space.
• **Recursion**: A function calls itself until reaching a base condition. Elegant for hierarchical structures (trees, nested JSON, graphs), but each recursive call consumes a Call Stack frame ($O(N)$ space), risking stack overflow if depth is large.`,
    code: `// Recursive factorial:
function factorial(n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1);
}
console.log(factorial(5)); // 120`
  },

  // TOPIC 4: Objects, Prototypes & Classes (Q46–60)
  {
    id: 46,
    topicId: 4,
    difficulty: "Junior",
    category: "Objects",
    question: "What is an object in JavaScript and how is it stored in memory?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An object in JavaScript is a standalone collection of key-value properties. Keys are either strings or Symbols; values can be any primitive or reference type. Objects are mutable reference types allocated in the **Memory Heap**. Variables hold memory pointer references to that heap allocation.`,
    code: `const product = {
  id: "P-101",
  name: "Focus Timer",
  price: 29.99
};`
  },
  {
    id: 47,
    topicId: 4,
    difficulty: "Junior",
    category: "Objects",
    question: "What is the difference between dot notation and bracket notation for property access?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Dot Notation (\`obj.prop\`)**: Statically evaluated identifier lookup. Cannot access keys containing spaces, hyphens, or dynamic variables.
• **Bracket Notation (\`obj[expr]\`)**: Evaluates the expression at runtime, converting the result to a string/symbol. Enables dynamic variable lookups and access to keys with non-identifier characters (\`obj["user-agent"]\`).`,
    code: `const user = { "first-name": "Sameer" };
const key = "first-name";
console.log(user[key]); // "Sameer"`
  },
  {
    id: 48,
    topicId: 4,
    difficulty: "Junior",
    category: "Modern JS",
    question: "What is destructuring in JavaScript and what features does it support?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Destructuring** is an ES6 syntax allowing properties from objects or elements from arrays to be unpacked into distinct variables concisely.
• **Features Supported**:
  1. Default values: \`const { role = "user" } = config\`
  2. Property renaming: \`const { id: userId } = params\`
  3. Nested destructuring: \`const { user: { address } } = response\`
  4. Rest properties: \`const { id, ...details } = item\``,
    code: `const order = { id: 101, total: 250, customer: "Ali" };
const { id: orderId, total, status = "pending" } = order;
console.log(orderId, total, status); // 101, 250, "pending"`
  },
  {
    id: 49,
    topicId: 4,
    difficulty: "Junior",
    category: "Modern JS",
    question: "What does the spread operator (...) do on objects and arrays?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The **spread operator (\`...\`)** expands an iterable (like an array) or enumerable own properties of an object into a new receiver. It performs a **shallow copy**: top-level primitive values are copied independently, but nested objects or arrays retain shared memory references!`,
    code: `const original = { a: 1, nested: { b: 2 } };
const clone = { ...original, a: 99 };
clone.nested.b = 999;
console.log(original.nested.b); // 999 (nested reference shared!)`
  },
  {
    id: 50,
    topicId: 4,
    difficulty: "Intermediate",
    category: "Memory & Copying",
    question: "What is the difference between shallow and deep copying, and why use structuredClone()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Shallow Copy**: Duplicates only the immediate top-level properties. Any nested objects or arrays remain shared pointers in memory (\`{ ...obj }\`, \`Object.assign()\`).
• **Deep Copy**: Recursively duplicates the target object and all nested references, achieving full memory isolation.
• **\`structuredClone()\`**: The modern global standard API. Handles circular references, Sets, Maps, Dates, and RegExps cleanly without the pitfalls of \`JSON.parse(JSON.stringify())\` (which drops functions, undefined, Symbols, and throws on circular refs).`,
    code: `const state = {
  session: "active",
  tags: new Set(["a", "b"]),
  config: { theme: "dark" }
};
const deep = structuredClone(state);
deep.config.theme = "light";
console.log(state.config.theme); // "dark" (100% independent!)`
  },
  {
    id: 51,
    topicId: 4,
    difficulty: "Junior",
    category: "Objects",
    question: "What do Object.keys(), Object.values(), and Object.entries() do?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`Object.keys(obj)\`**: Returns an array of an object's own enumerable string property **names**.
• **\`Object.values(obj)\`**: Returns an array of its own enumerable property **values**.
• **\`Object.entries(obj)\`**: Returns an array of \`[key, value]\` pairs (useful with \`for...of\` or converting to \`new Map(Object.entries(obj))\`).`,
    code: `const scores = { math: 90, physics: 85 };
console.log(Object.keys(scores));    // ["math", "physics"]
console.log(Object.values(scores));  // [90, 85]
console.log(Object.entries(scores)); // [["math", 90], ["physics", 85]]`
  },
  {
    id: 52,
    topicId: 4,
    difficulty: "Intermediate",
    category: "Prototypes",
    question: "What is a prototype in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **prototype** is an internal mechanism in JavaScript that enables objects to share properties and methods without duplicating them in memory on every instance. Every object has an internal link (\`[[Prototype]]\`) pointing to its prototype object. If a property is not found on the instance, the engine automatically checks its prototype.`,
    code: `const animal = {
  speak() { return \`\${this.name} makes a sound\`; }
};
const dog = Object.create(animal);
dog.name = "Rex";
console.log(dog.speak()); // "Rex makes a sound" (inherited via prototype!)`
  },
  {
    id: 53,
    topicId: 4,
    difficulty: "Intermediate",
    category: "Prototypes",
    question: "What is the prototype chain and how does property lookup work?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The **prototype chain** is the linked sequence of delegate prototype objects traversed during property lookup:
1. Engine checks if \`prop\` is an own property of \`obj\` (\`Object.hasOwn(obj, prop)\`).
2. If not found, checks \`Object.getPrototypeOf(obj)\`.
3. Traverses upward through prototypes until reaching \`Object.prototype\`.
4. If still not found, \`Object.prototype.[[Prototype]]\` is \`null\`, terminating traversal and returning \`undefined\`.`,
    code: `const arr = [1, 2, 3];
// arr -> Array.prototype -> Object.prototype -> null
console.log(arr.hasOwnProperty("length")); // resolved via Object.prototype`
  },
  {
    id: 54,
    topicId: 4,
    difficulty: "Intermediate",
    category: "Prototypes",
    question: "What is the difference between prototype and __proto__?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`prototype\`**: A property that exists on **constructor functions and classes**. It is the prototype object assigned to the \`[[Prototype]]\` link of instances created when invoking \`new Constructor()\`.
• **\`__proto__\`**: A legacy accessor property on **object instances** that points to their prototype (\`[[Prototype]]\`). Modern code must use \`Object.getPrototypeOf(obj)\` and \`Object.setPrototypeOf(obj, proto)\`.`,
    code: `function Person(name) { this.name = name; }
const p = new Person("Sameer");
console.log(Object.getPrototypeOf(p) === Person.prototype); // true`
  },
  {
    id: 55,
    topicId: 4,
    difficulty: "Junior",
    category: "OOP",
    question: "What is a constructor function in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **constructor function** is a regular function designed to be invoked with the \`new\` keyword to instantiate new object instances. By convention, its name is Capitalized. Inside, \`this\` refers to the newly instantiated object.`,
    code: `function Car(make, model) {
  this.make = make;
  this.model = model;
}
Car.prototype.drive = function() { return \`Driving \${this.model}\`; };
const myCar = new Car("Tesla", "Model 3");
console.log(myCar.drive()); // "Driving Model 3"`
  },
  {
    id: 56,
    topicId: 4,
    difficulty: "Senior",
    category: "The new Operator",
    question: "What does the 'new' operator do under the hood (The 4-Step Algorithm)?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
When \`new ConstructorFunction(...args)\` is called, the JavaScript engine executes 4 distinct steps:
1. **Allocates a fresh empty object**: \`const instance = {}\`.
2. **Links prototype**: \`Object.setPrototypeOf(instance, ConstructorFunction.prototype)\`.
3. **Binds \`this\` and executes constructor body**: \`ConstructorFunction.apply(instance, args)\`.
4. **Returns instance**: Returns the newly created object, UNLESS the constructor explicitly returns its own non-primitive object.`,
    code: `// Polyfilling the new operator algorithm:
function simulateNew(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype); // Steps 1 & 2
  const result = Constructor.apply(instance, args);       // Step 3
  return (typeof result === "object" && result !== null) ? result : instance; // Step 4
}`
  },
  {
    id: 57,
    topicId: 4,
    difficulty: "Junior",
    category: "ES6 Classes",
    question: "What are JavaScript classes?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Introduced in ES6, JavaScript **classes are syntactic sugar over the existing prototype-based inheritance model**. Under the hood, classes still construct prototype chains.
• Methods declared inside a class body reside on \`Class.prototype\`.
• The \`constructor()\` runs when invoked with \`new\`.
• Classes always execute in strict mode and cannot be invoked without \`new\` (throws \`TypeError\`).`,
    code: `class User {
  constructor(name) { this.name = name; }
  greet() { return \`Hi, I am \${this.name}\`; }
}
console.log(typeof User); // "function"! (Classes are functions)`
  },
  {
    id: 58,
    topicId: 4,
    difficulty: "Intermediate",
    category: "ES6 Classes",
    question: "How does class inheritance work with extends and super()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`extends\`**: Links the prototype chain between child class and parent class: \`Child.prototype.[[Prototype]] === Parent.prototype\`.
• **\`super()\`**: In a derived class constructor, \`super(...args)\` invokes the parent class constructor and initializes \`this\`.
*Rule: In a derived class constructor, you MUST call \`super()\` before accessing \`this\`, otherwise a ReferenceError is thrown!*`,
    code: `class Vehicle {
  constructor(wheels) { this.wheels = wheels; }
}
class Bike extends Vehicle {
  constructor() {
    super(2); // Must call parent constructor first!
    this.type = "motorcycle";
  }
}`
  },
  {
    id: 59,
    topicId: 4,
    difficulty: "Junior",
    category: "ES6 Classes",
    question: "What are static methods and properties in JavaScript classes?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
**Static methods and properties** belong directly to the class constructor function itself, NOT to instances of the class. They cannot be called through an instance (\`instance.staticMethod()\` is \`undefined\`). Common for utility functions (e.g. \`Math.max()\`, \`Array.isArray()\`, or database model factory methods).`,
    code: `class Config {
  static defaultTimeout = 5000;
  static createDefault() { return new Config(); }
}
console.log(Config.defaultTimeout); // 5000`
  },
  {
    id: 60,
    topicId: 4,
    difficulty: "Intermediate",
    category: "Modern JS",
    question: "What are private class fields (#) in modern JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
Prefixing a class property or method with a hash symbol (\`#\`) makes it a **hard private field**. Private fields cannot be accessed, read, or modified from outside the class body, nor from derived child subclasses. Attempting to access \`obj.#privateField\` outside throws a compile-time \`SyntaxError\`.`,
    code: `class Wallet {
  #balance = 0; // Truly private in memory

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
}
const w = new Wallet();
w.deposit(100);
// console.log(w.#balance); // SyntaxError: Private field '#balance' must be declared`
  },

  // TOPIC 5: Arrays, Maps, Sets & Collections (Q61–75)
  {
    id: 61,
    topicId: 5,
    difficulty: "Junior",
    category: "Arrays",
    question: "What is an Array in JavaScript and how does it differ from a plain Object?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
In JavaScript, an **Array is a specialized object** with numeric indices and an automatic \`length\` property that automatically synchronizes as items are appended. Its prototype is \`Array.prototype\`, providing built-in iteration and algorithmic transformation methods (\`map\`, \`filter\`, \`reduce\`).`,
    code: `const arr = ["a", "b", "c"];
console.log(arr.length); // 3
console.log(Array.isArray(arr)); // true`
  },
  {
    id: 62,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What is the difference between map() and forEach()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`map()\`**: Returns a **new array** containing the results of invoking the callback on every element. Pure transformation without mutating the original array.
• **\`forEach()\`**: Executes a side-effect callback for every element and **always returns \`undefined\`**. Does not chain.`,
    code: `const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
const sideEffect = numbers.forEach(x => console.log(x)); // returns undefined`
  },
  {
    id: 63,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What does Array.prototype.filter() do and does it mutate the original array?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`filter()\` evaluates a boolean predicate callback on every element and returns a **new array** containing only the elements for which the callback returned a truthy value. It **does NOT mutate** the original array.`,
    code: `const scores = [45, 88, 92, 33];
const passing = scores.filter(s => s >= 50); // [88, 92]`
  },
  {
    id: 64,
    topicId: 5,
    difficulty: "Intermediate",
    category: "Array Methods",
    question: "How does Array.prototype.reduce() work?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`reduce()\` executes a reducer function on each array element in sequence, passing the return value from the calculation on the preceding element. The final result is a single accumulated value (number, object, or array).
• **Syntax**: \`arr.reduce((accumulator, currentValue, index, array) => nextAcc, initialValue)\`
*Tip: Always supply an explicit initialValue to avoid TypeErrors on empty arrays!*`,
    code: `const cart = [{ price: 10 }, { price: 25 }, { price: 40 }];
const total = cart.reduce((sum, item) => sum + item.price, 0); // 75`
  },
  {
    id: 65,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What is the difference between slice() and splice()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`slice(start, end)\`**: Pure extraction. Returns a shallow copy of a portion of an array without modifying the original array.
• **\`splice(start, deleteCount, ...items)\`**: Mutating operation. Modifies the array in place by removing, replacing, or adding elements. Returns an array of removed elements.`,
    code: `const items = ["a", "b", "c", "d"];
// slice (Non-mutating):
console.log(items.slice(1, 3)); // ["b", "c"]
console.log(items); // ["a", "b", "c", "d"] (untouched)

// splice (MUTATES!):
items.splice(1, 2, "X");
console.log(items); // ["a", "X", "d"]`
  },
  {
    id: 66,
    topicId: 5,
    difficulty: "Intermediate",
    category: "Array Methods",
    question: "What is the default behavior of Array.prototype.sort() and what is the gotcha?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
By default, \`sort()\` converts all elements to strings and sorts them in ascending lexicographical (alphabetical) order.
• **The Gotcha**: \`[10, 2, 35].sort()\` results in \`[10, 2, 35]\` because \`"10"\` precedes \`"2"\` alphabetically!
• **Solution**: Always pass a numeric comparator: \`(a, b) => a - b\` (ascending) or \`(a, b) => b - a\` (descending). Mutates the original array in place.`,
    code: `const nums = [10, 2, 35];
nums.sort();
console.log(nums); // [10, 2, 35] <-- GOTCHA!

nums.sort((a, b) => a - b);
console.log(nums); // [2, 10, 35] <-- CORRECT!`
  },
  {
    id: 67,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What is the difference between indexOf(), find(), and findIndex()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`indexOf(val)\`**: Searches for a primitive value via strict equality (\`===\`) and returns its index, or \`-1\`. Cannot search complex objects by predicate.
• **\`find(predicate)\`**: Returns the **first element** that satisfies the callback condition, or \`undefined\`.
• **\`findIndex(predicate)\`**: Returns the **index of the first element** that satisfies the callback, or \`-1\`.`,
    code: `const users = [{ id: 1, name: "Ali" }, { id: 2, name: "Sameer" }];
console.log(users.find(u => u.id === 2));      // { id: 2, name: "Sameer" }
console.log(users.findIndex(u => u.id === 2)); // 1`
  },
  {
    id: 68,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What is the difference between some() and every()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`some(predicate)\`**: Returns \`true\` if **at least one** element passes the predicate. Short-circuits on the first \`true\`.
• **\`every(predicate)\`**: Returns \`true\` only if **ALL** elements pass the predicate. Short-circuits on the first \`false\`.`,
    code: `const ages = [18, 22, 16, 25];
console.log(ages.some(a => a < 18));  // true (at least one minor)
console.log(ages.every(a => a >= 18)); // false (not all adults)`
  },
  {
    id: 69,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What are flat() and flatMap()?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **\`flat(depth)\`**: Creates a new array with sub-array elements concatenated up to the specified depth (default 1; use \`Infinity\` to flatten all levels).
• **\`flatMap(callback)\`**: Maps each element using a mapping function, then flattens the result by 1 level. Identical to \`arr.map(...).flat(1)\`, but more performant in a single pass.`,
    code: `const nested = [1, [2, [3, 4]]];
console.log(nested.flat(Infinity)); // [1, 2, 3, 4]

const sentences = ["Hello world", "Fast React"];
console.log(sentences.flatMap(s => s.split(" "))); // ["Hello", "world", "Fast", "React"]`
  },
  {
    id: 70,
    topicId: 5,
    difficulty: "Junior",
    category: "Array Methods",
    question: "What does Array.from() do?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`Array.from(arrayLike, mapFn)\` creates a genuine, shallow-copied Array from an iterable or array-like object (such as \`NodeList\`, \`Set\`, \`arguments\`, or string). An optional second argument maps elements during array creation.`,
    code: `// Generate range 1 to 5:
const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(range); // [1, 2, 3, 4, 5]`
  },
  {
    id: 71,
    topicId: 5,
    difficulty: "Intermediate",
    category: "Collections",
    question: "What is an ES6 Map and how does it compare to a plain Object?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An **ES6 Map** is a keyed collection of key-value pairs where:
1. **Any key type**: Keys can be objects, functions, or primitives (Objects only accept strings/symbols).
2. **Guaranteed Order**: Iterates elements strictly in insertion order.
3. **$O(1)$ Size**: Has built-in \`map.size\`.
4. **Performance**: Optimized for frequent additions and removals.`,
    code: `const userMap = new Map();
const keyObj = { id: 1 };
userMap.set(keyObj, "Admin Data");
console.log(userMap.get(keyObj)); // "Admin Data"`
  },
  {
    id: 72,
    topicId: 5,
    difficulty: "Junior",
    category: "Collections",
    question: "What is an ES6 Set and how does it compare to an Array?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An **ES6 Set** is a collection of unique values. Duplicate values are discarded automatically.
• **Performance**: Lookups with \`set.has(val)\` run in average **$O(1)$ constant time** using hash tables, whereas \`array.includes(val)\` requires a linear **$O(N)$** scan.`,
    code: `const duplicates = [1, 2, 2, 3, 4, 4];
const unique = [...new Set(duplicates)]; // [1, 2, 3, 4]`
  },
  {
    id: 73,
    topicId: 5,
    difficulty: "Senior",
    category: "Collections & GC",
    question: "What are WeakMap and WeakSet and how do their garbage collection semantics work?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
\`WeakMap\` and \`WeakSet\` hold references to object keys **weakly**: they do not prevent garbage collection of the key objects if no other strong references exist.
• **Rules**:
  1. Keys must be objects.
  2. Not iterable and have no \`.size\` property (to avoid non-deterministic GC timing leaks).
• **Use Case**: Storing private data for DOM elements or memoization caches tied to object lifetimes without causing memory leaks.`,
    code: `let button = document.createElement("button");
const meta = new WeakMap();
meta.set(button, { clicks: 0 });

button = null; // Eligible for Garbage Collection immediately!`
  },
  {
    id: 74,
    topicId: 5,
    difficulty: "Intermediate",
    category: "Iterators",
    question: "What is an iterable and how does Symbol.iterator work?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
An object is **iterable** if it implements the iterable protocol by defining a method keyed by \`[Symbol.iterator]\`. This method must return an **iterator** object with a \`.next()\` method returning \`{ value, done: boolean }\`. Iterables work with \`for...of\` loops and spread operators.`,
    code: `const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () => current <= last ? { value: current++, done: false } : { done: true }
    };
  }
};
console.log([...range]); // [1, 2, 3]`
  },
  {
    id: 75,
    topicId: 5,
    difficulty: "Intermediate",
    category: "Generators",
    question: "What are generator functions and the yield keyword?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **generator function** (\`function*\`) can pause execution mid-stream using the \`yield\` keyword and resume later when invoked with \`.next()\`. It produces a generator object that adheres to the iterator protocol. Enables lazy evaluation of infinite streams and co-routine patterns.`,
    code: `function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2`
  },

  // TOPIC 6: Async JavaScript & Event Loop (Q76–80)
  {
    id: 76,
    topicId: 6,
    difficulty: "Junior",
    category: "Async JS",
    question: "What is the difference between synchronous and asynchronous code in JavaScript?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Synchronous Code**: Executes sequentially on the Call Stack. Each line blocks the execution of subsequent lines until it finishes.
• **Asynchronous Code**: Offloads long-running operations (network requests, timers, disk I/O) to host APIs, allowing the Call Stack to keep processing other work. Callbacks resume via the Event Loop when the call stack clears.`,
    code: `console.log("1. Sync Start");
setTimeout(() => console.log("3. Async Callback"), 0);
console.log("2. Sync End");`
  },
  {
    id: 77,
    topicId: 6,
    difficulty: "Senior",
    category: "Concurrency",
    question: "How does JavaScript achieve high-throughput concurrency despite having a single-threaded Call Stack?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
JavaScript achieves concurrency through its **event-driven non-blocking runtime architecture**. While the JS engine call stack executes on a single thread, the host environment (Browser Web APIs or Node.js Libuv) is multi-threaded. The host handles socket I/O, network streams, and OS system calls in background threads. When I/O completes, the event loop queues callbacks on the task/microtask queues to be processed by the single thread without ever blocking.`,
    code: `// Single-threaded JS offloading to multi-threaded host:
fetch("/api/users").then(res => res.json()); // Network handled on background OS socket`
  },
  {
    id: 78,
    topicId: 6,
    difficulty: "Senior",
    category: "Event Loop",
    question: "What is the Event Loop and what are its exact execution steps?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
The **Event Loop** is the continuous orchestration loop coordinating the Call Stack and task queues:
1. Executes current synchronous code on the Call Stack to completion.
2. Drains the entire **Microtask Queue** (Promises, queueMicrotask).
3. Evaluates rendering opportunities (in browsers).
4. Dequeues and executes **ONE Task (Macrotask)** from the Task Queue.
5. Returns to step 2 and repeats indefinitely.`,
    code: `// Execution order: Sync -> Microtask -> Macrotask
console.log("A");
setTimeout(() => console.log("C"), 0);
Promise.resolve().then(() => console.log("B"));
// Output: A, B, C`
  },
  {
    id: 79,
    topicId: 6,
    difficulty: "Senior",
    category: "Event Loop",
    question: "What is the difference between the Task (Macrotask) Queue and the Microtask Queue?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
• **Microtask Queue**: Has higher priority. Drain-all semantics: the entire queue is processed until completely empty before any rendering or macrotasks run (\`Promise.then\`, \`queueMicrotask\`, \`process.nextTick\`).
• **Task (Macrotask) Queue**: Lower priority. One-task-per-turn: the event loop picks exactly ONE macrotask, executes it, and immediately returns to drain newly spawned microtasks (\`setTimeout\`, \`setInterval\`, I/O).`,
    code: `setTimeout(() => console.log("Macrotask"), 0);
queueMicrotask(() => console.log("Microtask"));
// Output: Microtask, Macrotask`
  },
  {
    id: 80,
    topicId: 6,
    difficulty: "Junior",
    category: "Promises",
    question: "What is a Promise in JavaScript and what are its three states?",
    answer: `### 1. Direct Pitch (30–60 Seconds)
A **Promise** is a state-machine object representing the eventual completion (fulfillment) or failure (rejection) of an asynchronous operation.
• **The 3 Mutually Exclusive States**:
  1. \`pending\`: Initial state. Neither fulfilled nor rejected.
  2. \`fulfilled\`: Succeeded with an immutable resolved value.
  3. \`rejected\`: Failed with an immutable rejection error reason.
*Once settled (fulfilled or rejected), a Promise can NEVER change state again.*`,
    code: `const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Data loaded");
  else reject(new Error("Network failure"));
});`
  }
];
