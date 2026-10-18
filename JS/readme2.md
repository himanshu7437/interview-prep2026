# JavaScript Interview Preparation — Part 2 (Questions 26–47)

We'll keep the same format as Part 1: a complete interview-ready definition, code examples, a mental model to visualize what's happening, important traps, and likely follow-up questions without their answers.

I'll also keep the improvement suggestions from both parts for our final revision plan. Once all the questions are covered, we'll decide what to practise first, which concepts need coding exercises, and how to prepare for follow-up questions.

# Part 6: `this`, prototypes and function behavior

## 26. Explain the `this` keyword in JavaScript. ★★★

### Definition — interview answer

The `this` keyword refers to a value determined by how a function is called, except in arrow functions, which inherit `this` from their surrounding lexical environment.

In ordinary functions, `this` depends primarily on the call site, not on where the function was defined.

### Example 1: Object method

```
const user = {
  name: "Himanshu",

  greet() {
    console.log(this.name);
  }
};

user.greet(); // Himanshu
```

Here, `this` refers to `user` because the method is called as `user.greet()`.

### Example 2: Detached function

```
const user = {
  name: "Himanshu",

  greet() {
    console.log(this.name);
  }
};

const fn = user.greet;

fn();
```

In a strict-mode context, `this` is `undefined`, so accessing `this.name` throws a `TypeError`. In a non-strict ordinary function call, `this` is generally the global object instead.

The important point: extracting a method does not preserve its original receiver automatically.

### Example 3: Arrow function

```
const user = {
  name: "Himanshu",

  greet: () => {
    console.log(this.name);
  }
};

user.greet();
```

This arrow function does not get `this` from `user`. It inherits `this` from its surrounding lexical environment.

For an object method, an ordinary method is usually the right choice when you want `this` to refer to the object.

### Example 4: Explicitly setting `this`

```
function greet() {
  console.log(`Hello, ${this.name}`);
}

const user = { name: "Himanshu" };

greet.call(user);  // Hello, Himanshu
greet.apply(user); // Hello, Himanshu

const boundGreet = greet.bind(user);
boundGreet();      // Hello, Himanshu
```

These methods let you control the receiver for an ordinary function.

### Mental model

Imagine `this` as a microphone handed to the function when it is called.

- `user.greet()` hands the microphone to `user`.
- `greet.call(user)` explicitly hands it to `user`.
- An arrow function inherits the microphone from the surrounding environment instead of accepting a new one.
- A detached method can lose its original receiver.

### Important interview traps

- `this` is not always the object in which a function was written.
- Arrow functions do not have their own `this`.
- `call`, `apply`, and `bind` cannot replace an arrow function's lexical `this`.
- A constructor invoked with `new` receives the newly created instance as `this`.
- In DOM event handlers, `this` often refers to the element for an ordinary listener function, but not for an arrow listener.

### Likely follow-up questions

- What is the difference between `this` in arrow and normal functions?
- What happens to `this` when a method is detached from an object?
- How does `this` behave in strict mode?
- What does `new` do to `this`?
- Can `call()`, `apply()`, and `bind()` change arrow-function `this`?
- How does `this` behave inside a nested callback?

## 27. What is prototype inheritance? How do `__proto__` and `prototype` work? ★★

### Definition — interview answer

JavaScript uses prototype-based inheritance. An object can inherit properties and methods from another object through its internal `[[Prototype]]` link.

When a property is accessed, JavaScript first checks the object itself. If the property is not found, it searches the object's prototype, then the prototype's prototype, continuing until the property is found or the chain ends at `null`.

Two commonly discussed properties are:

- `__proto__`: a legacy accessor that exposes or changes an object's prototype in ordinary cases. Prefer `Object.getPrototypeOf()` and `Object.setPrototypeOf()` for explicit prototype operations.
- `prototype`: an ordinary property found on many constructor functions. When a constructor is called with `new`, the new object's prototype is generally set to the constructor's `prototype` value.

These two are not the same thing.

### Example

```
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

const person = new Person("Himanshu");

console.log(person.greet()); // Hello, Himanshu

console.log(Object.getPrototypeOf(person) === Person.prototype);
// true
```

`greet()` is not an own property of `person`. JavaScript finds it on `Person.prototype`.

### Mental model

Imagine a chain of offices:

1. Search your own desk.
2. If the item isn't there, search the office you inherit resources from.
3. If it isn't there, search that office's parent.
4. Stop when the item is found or there is no parent.

That is the prototype chain.

### Visualizing the chain

`person`

Own property: `name`

`Person.prototype`

Shared method: `greet()`

`Object.prototype`

Common inherited object methods

`null` — end of the chain

### `__proto__` versus `prototype`

| Feature             | `__proto__`                                                          | `prototype`                                                |
| ------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| Usually accessed on | An object                                                            | A constructor function                                     |
| Purpose             | Exposes the object's prototype through a legacy accessor             | Defines the prototype used by instances created with `new` |
| Example             | `Object.getPrototypeOf(person)` is the preferred inspection approach | `Person.prototype`                                         |
| Same object?        | `person.__proto__ === Person.prototype` is true in this example      | It is the same prototype object referenced by the instance |

### How classes use prototypes

```
class Animal {
  speak() {
    return "Sound";
  }
}

class Dog extends Animal {
  bark() {
    return "Woof";
  }
}

const dog = new Dog();

console.log(dog.bark()); // Woof
console.log(dog.speak()); // Sound

console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true
```

Class methods are generally placed on the class's prototype, and `extends` links the derived prototype to the base prototype.

### Important traps

- The `prototype` property is not present on every function; arrow functions, for example, cannot be used as constructors and do not have an ordinary constructor `prototype` property.
- `Object.create(null)` creates an object without `Object.prototype` in its prototype chain.
- Changing prototypes at runtime can hurt performance.
- Inheritance does not copy every inherited property onto each object.

### Likely follow-up questions

- What is the difference between `__proto__` and `prototype`?
- What is the difference between an own property and an inherited property?
- How does JavaScript resolve a missing property?
- What is the prototype of an arrow function?
- How does `class extends` establish inheritance?
- What are `Object.create()` and `Object.getPrototypeOf()`?
- What happens when an object defines a property with the same name as an inherited property?

## 28. What are shadowing and illegal shadowing? ★★

### Definition — interview answer

Variable shadowing occurs when a declaration in an inner scope uses the same name as a declaration in an outer scope. Within the inner scope, the inner binding takes precedence.

Illegal shadowing is an informal term commonly used for cases where a lexical declaration such as `let` or `const` conflicts with a `var` declaration in a scope where JavaScript prohibits the combination.

### Example: legal shadowing

```
let name = "Global";

function showName() {
  let name = "Local";
  console.log(name);
}

showName();       // Local
console.log(name); // Global
```

The inner `name` shadows the outer `name` without modifying it.

### Example: illegal shadowing

```
let age = 25;

{
  var age = 30; // SyntaxError
}
```

Why? `var` is not block-scoped. Its declaration conflicts with the existing lexical `age` binding in the surrounding scope.

Compare this with:

```
var age = 25;

{
  let age = 30; // Allowed
  console.log(age); // 30
}

console.log(age); // 25
```

### Mental model

Imagine a company where different departments can each have a person called Alex. That is legal when their scopes are separate.

But if two conflicting records are required to occupy the same namespace under incompatible rules, the system rejects the setup. That's the intuition behind illegal shadowing.

### Likely follow-up questions

- Can a `let` variable shadow a `var` variable?
- Why is `var` inside a block treated differently from `let`?
- What is the difference between shadowing and reassignment?
- Can function parameters be shadowed?
- What happens when a function parameter and a local declaration use the same name?

## 29. Explain currying. ★★★

### Definition — interview answer

Currying is a technique in which a function that takes multiple arguments is transformed into a sequence of functions, each taking one argument at a time.

For example, a function \\(f(a,b,c)\\) can be represented as \\(f(a)(b)(c)\\).

### Example

```
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(add(2)(3)(4)); // 9
```

The first call receives `2` and returns a function. The second receives `3` and returns another function. The third receives `4` and calculates the result.

### Mental model

Imagine ordering a customized meal in stages:

1. Choose the main dish.
2. Choose the side.
3. Choose the drink.

Each choice returns the next step in the process. The function remembers earlier choices through closures.

### Real-world use case

```
const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
```

You create reusable specialized functions without repeating the original logic.

### Currying versus partial application

- Currying: transforms a multi-argument function into nested single-argument functions.
- Partial application: fixes some arguments of a function to create another function that accepts the remaining arguments.

They are related but not identical.

### Likely follow-up questions

- What is the difference between currying and partial application?
- How are closures used in currying?
- What are practical uses of currying in React or functional programming?
- How would you curry a function that accepts any number of arguments?
- What are the advantages and disadvantages of currying?

## 30. Difference between shallow copy and deep copy. ★★★

### Definition — interview answer

A shallow copy creates a new outer object but retains references to nested objects. A deep copy creates an independent copy of nested data as well, to the extent defined by the copying method.

### Example: shallow copy

```
const original = {
  name: "Himanshu",
  address: {
    city: "Bahadurgarh"
  }
};

const copy = { ...original };

copy.name = "Aman";
copy.address.city = "Delhi";

console.log(original.name);         // Himanshu
console.log(original.address.city); // Delhi
```

The top-level `name` is copied by value, but both objects refer to the same nested `address` object.

### Example: deep copy

```
const original = {
  name: "Himanshu",
  address: {
    city: "Bahadurgarh"
  }
};

const copy = structuredClone(original);

copy.address.city = "Delhi";

console.log(original.address.city); // Bahadurgarh
console.log(copy.address.city);     // Delhi
```

`structuredClone()` supports many built-in types and circular references, but not every JavaScript value. For example, functions cannot be cloned this way.

### Mental model

Imagine photocopying a folder:

- A shallow copy photocopies the cover sheet but leaves the nested folders shared.
- A deep copy duplicates the supported contents of the nested folders too.

### Important interview traps

- Spread syntax (`...`) creates only a shallow copy.
- `Object.assign()` is also shallow.
- `JSON.parse(JSON.stringify(value))` loses or changes certain values and cannot handle circular references.
- `structuredClone()` is usually a better built-in choice for supported data, but it is not a universal clone for arbitrary objects, functions, or custom class behavior.

### Likely follow-up questions

- What is the difference between `structuredClone()` and JSON-based cloning?
- Why do nested objects change in a shallow copy?
- Is `Object.assign()` a deep copy?
- How would you deep-copy an object containing circular references?
- How do functions, `Date`, `Map`, and `Set` behave during cloning?

## 31. What is a generator function? ★★

### Definition — interview answer

A generator function is a special function declared using `function*` that can pause execution using `yield` and resume later. Calling it returns a generator object, which follows the iterator protocol.

### Example

```
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

const iterator = numbers();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Mental model

Imagine a storyteller who tells one part of a story, pauses, and waits for you to ask for the next part. The storyteller remembers where they stopped.

A generator does not execute its entire body when called. Its body begins when you advance the generator, such as by calling `.next()`.

### Real-world use cases

- Producing values lazily rather than building an entire array.
- Iterating over large sequences.
- Implementing custom iterators.
- Expressing certain stateful workflows.

### Important details

- `yield` pauses the generator.
- `.next()` resumes it.
- A generator can also receive a value through `.next(value)`, which becomes the result of the suspended `yield` expression.
- Generators are not inherently asynchronous. `async function*` defines an asynchronous generator.

### Likely follow-up questions

- What is the difference between a generator and a normal function?
- What do `yield` and `return` do inside a generator?
- What is the difference between an iterator and an iterable?
- What does `.next(value)` do?
- What is an asynchronous generator?
- When would a generator be more efficient than creating an array?

## 32. What is memoization? Implement a `memoize()` function. ★★★

### Definition — interview answer

Memoization is an optimization technique in which a function caches the results of previous computations so that repeated calls with equivalent inputs can return a stored result instead of recomputing it.

It is most useful for expensive, repeatable computations where the same inputs occur frequently.

### Example

```
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    if (cache.has(args[0])) {
      return cache.get(args[0]);
    }

    const result = fn.apply(this, args);
    cache.set(args[0], result);

    return result;
  };
}

function square(n) {
  console.log("Calculating...");
  return n * n;
}

const memoizedSquare = memoize(square);

console.log(memoizedSquare(5)); // Calculates, then 25
console.log(memoizedSquare(5)); // Cached result: 25
console.log(memoizedSquare(6)); // Calculates, then 36
```

### Important limitation of this implementation

This educational version caches by the first argument only. It is correct for `square(n)` but not for arbitrary functions that depend on multiple arguments.

For a function that accepts multiple primitive arguments, a simple general-purpose version can use nested maps or a deliberate cache-key strategy. Blindly converting arguments to JSON is not safe for every possible input.

### Mental model

Imagine a student who has already solved a difficult problem and writes the answer in a notebook. When the same problem appears again, they look up the answer instead of solving it from scratch.

### Important details

- Memoization trades memory usage for potentially faster repeated calls.
- It is most effective for pure functions or functions whose results remain valid for a given cache key.
- Caching functions that depend on external state can produce stale or incorrect results.
- An unbounded cache can grow indefinitely.

### Likely follow-up questions

- What is the difference between memoization and caching in general?
- What is the time and space complexity of memoization?
- How would you memoize a function with multiple arguments?
- How do you handle object arguments?
- How can you prevent a memoization cache from growing indefinitely?
- Can you memoize an asynchronous function returning a promise?

## 33. Explain `Set` with an example. Why does `set.add([1])` twice store two entries? ★★

### Definition — interview answer

A `Set` is a JavaScript collection that stores unique values. It prevents duplicate values according to the equality rules used by `Set`, which are based on SameValueZero equality.

Primitive duplicates are treated as duplicates, but separately created objects and arrays are distinct because they have different identities.

### Example

```
const set = new Set();

set.add(1);
set.add(1);
set.add("1");

console.log(set.size); // 2
console.log(set);      // Set { 1, "1" }
```

The two numbers are duplicates, but the number `1` and string `"1"` are different values.

### The interview question

```
const set = new Set();

set.add([1]);
set.add([1]);

console.log(set.size); // 2
```

Why does it store two entries even though the arrays look identical?

Each `[1]` creates a new array object. The two arrays have identical contents but different identities.

```
const a = [1];
const b = [1];

console.log(a === b); // false

const set = new Set([a, b]);

console.log(set.size); // 2
```

However, if you add the same array reference twice, it is stored only once:

```
const arr = [1];
const set = new Set();

set.add(arr);
set.add(arr);

console.log(set.size); // 1
```

### Mental model

Imagine a club checking membership cards:

- Two identical names written on different cards can represent different members.
- Presenting the exact same membership card twice doesn't create a new member.

An array's contents are not used for deep equality when a `Set` checks uniqueness.

### Useful methods

```
const values = new Set([1, 2, 2, 3]);

values.add(4);
values.has(2);    // true
values.delete(1); // true
values.size;      // 3
values.clear();   // Removes everything
```

### Likely follow-up questions

- What is the difference between a `Set` and an array?
- How does `Set` determine whether values are duplicates?
- Why are two identical object literals different in a `Set`?
- How can you remove duplicate primitive values from an array?
- What is the difference between `Set` and `WeakSet`?
- Does a `Set` preserve insertion order?

## 34. Explain `Object.defineProperty()` with getters and setters. ★★

### Definition — interview answer

`Object.defineProperty()` defines or modifies an individual property on an object using a property descriptor. It allows you to configure characteristics such as whether a property is writable, enumerable, or configurable, or define getter and setter functions that run when the property is accessed or assigned.

### Example: property descriptors

```
const user = {};

Object.defineProperty(user, "name", {
  value: "Himanshu",
  writable: false,
  enumerable: true,
  configurable: false
});

console.log(user.name); // Himanshu

user.name = "Aman"; // Ignored in non-strict code
console.log(user.name); // Himanshu
```

Because `writable` is false, the property cannot be reassigned normally. In strict mode, such an assignment throws a `TypeError`.

### Example: getter and setter

```
const user = {
  firstName: "Himanshu",
  lastName: "Sharma"
};

Object.defineProperty(user, "fullName", {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },

  set(value) {
    const parts = value.split(" ");

    this.firstName = parts[0];
    this.lastName = parts.slice(1).join(" ");
  },

  enumerable: true,
  configurable: true
});

console.log(user.fullName); // Himanshu Sharma

user.fullName = "Aman Kumar";
console.log(user.firstName); // Aman
```

`fullName` behaves like a property, but its getter computes a value and its setter handles assignment.

### Mental model

Imagine a smart display:

- The getter shows the information when you ask for it.
- The setter updates the underlying information when you change it.
- The descriptor defines the rules for accessing or changing the property.

### Important details

A property descriptor can define either:

- A data property, using attributes such as `value` and `writable`.
- An accessor property, using `get` and `set`.

You cannot mix data-property attributes and accessor functions in the same descriptor.

Also, properties created using `Object.defineProperty()` are non-enumerable and non-writable by default when those attributes are omitted for a data property. Be deliberate about the descriptor values.

### Likely follow-up questions

- What are `writable`, `enumerable`, and `configurable`?
- What is the difference between a data property and an accessor property?
- What is the difference between getters/setters and ordinary methods?
- Why might a getter or setter cause infinite recursion?
- What is the difference between `Object.defineProperty()` and ordinary assignment?

## 35. Explain optional chaining (`?.`) and nullish coalescing (`??`). ★★★

### Definition — interview answer

Optional chaining (`?.`) safely accesses a property, calls a method, or accesses an indexed element when the value immediately to its left is `null` or `undefined`. Instead of throwing a `TypeError`, it returns `undefined`.

Nullish coalescing (`??`) provides a fallback value only when the expression on the left is `null` or `undefined`.

### Optional chaining example

```
const user = {
  profile: {
    name: "Himanshu"
  }
};

console.log(user.profile?.name); // Himanshu
console.log(user.address?.city); // undefined
```

Without optional chaining, trying to read `city` from an undefined `address` would throw an error.

### Nullish coalescing example

```
const username = null;
const displayName = username ?? "Guest";

console.log(displayName); // Guest
```

Compare this with `||`:

```
console.log(0 || 100);  // 100
console.log(0 ?? 100);  // 0

console.log("" || "Default"); // Default
console.log("" ?? "Default"); // ""
```

The `||` operator checks whether the left side is falsy. The `??` operator checks specifically for `null` or `undefined`.

### Mental model

Optional chaining asks, "Does this part of the path exist? If not, stop safely."

Nullish coalescing asks, "Is the value actually missing? If so, use the fallback."

Imagine a delivery form: if the optional apartment number is missing, you don't want the entire form to crash. But if a quantity is `0`, you might want to preserve that legitimate value rather than replace it with a default.

### Important traps

- `user?.profile.name` only makes the `user` access optional. If `user` exists but `profile` is `undefined`, the later `.name` can still throw.
- `user?.profile?.name` checks both links.
- Optional chaining cannot be used as an assignment target: `user?.name = "Aman"` is invalid.
- You cannot mix `??` directly with `&&` or `||` without parentheses.

### Likely follow-up questions

- What is the difference between `??` and `||`?
- What happens when optional chaining encounters `null`?
- What is the difference between `obj?.method()` and `obj.method?.()`?
- Can optional chaining be used with arrays and function calls?
- Why does `user?.profile.name` sometimes still throw an error?

## 36. Explain `call()`, `apply()`, and `bind()`. ★★★

### Definition — interview answer

`call()`, `apply()`, and `bind()` are function methods that allow you to control the `this` value used by an ordinary function.

- `call()` invokes the function immediately, passing arguments individually.
- `apply()` invokes the function immediately, passing arguments as an array or array-like value.
- `bind()` returns a new bound function that can be called later with a specified `this` value and optional preset arguments.

### Example

```
function introduce(city, country) {
  console.log(
    `${this.name} lives in ${city}, ${country}`
  );
}

const user = { name: "Himanshu" };

introduce.call(user, "Delhi", "India");

introduce.apply(user, ["Delhi", "India"]);

const boundIntroduce = introduce.bind(user, "Delhi");

boundIntroduce("India");
```

All three print:

```
Himanshu lives in Delhi, India
```

### Mental model

Imagine a worker whose job is to introduce someone.

- `call`: ask the worker to introduce the person right now, giving each detail separately.
- `apply`: ask the worker to introduce the person right now, giving the details as a list.
- `bind`: prepare a reusable instruction card with the person already selected, then use it later.

### Important interview traps

1\. `bind()` does not immediately execute the function.

```
const greetUser = introduce.bind(user);
```

This creates a function for later use.

2\. Arrow functions have lexical `this`.

Calling or binding an arrow function does not replace its lexical `this`.

3\. Bound functions have special behavior with `new`.

A bound ordinary constructor can still be called with `new`; the bound `this` is ignored for that construction. The preset arguments can still apply.

### Likely follow-up questions

- What is the difference between `call()`, `apply()`, and `bind()`?
- Can `bind()` be called multiple times to change `this`?
- Can you use a bound function as a constructor?
- Why don't these methods change an arrow function's `this`?
- How would you implement a simplified version of `bind()`?

## 37. Difference between `map()`, `filter()`, and `reduce()`. ★★★

### Definition — interview answer

These are array iteration methods that serve different purposes:

- `map()` transforms each existing element and returns a new array.
- `filter()` returns a new array containing elements that pass a condition.
- `reduce()` processes elements to accumulate a single result, which can be a number, object, array, or another value.

### Example

```
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const even = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((total, n) => total + n, 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(even);    // [2, 4]
console.log(sum);     // 15
```

### Mental model

Imagine a factory processing products:

- `map()`: change every product into a new form.
- `filter()`: keep only products that meet a quality requirement.
- `reduce()`: combine product values into a total inventory value.

### Real-world example: shopping cart

```
const cart = [
  { name: "Keyboard", price: 1000 },
  { name: "Mouse", price: 500 },
  { name: "Monitor", price: 8000 }
];

const names = cart.map(item => item.name);

const expensiveItems = cart.filter(
  item => item.price > 1000
);

const total = cart.reduce(
  (sum, item) => sum + item.price,
  0
);

console.log(names);
console.log(expensiveItems);
console.log(total); // 9500
```

### Important details

- These methods generally do not mutate the original array, though callbacks can still cause side effects.
- Providing an initial value to `reduce()` is usually a good practice.
- `reduce()` without an initial value throws a `TypeError` for an empty array.
- `map()` and `filter()` skip holes in sparse arrays; `reduce()` also skips holes.
- `map()` and `filter()` return arrays, but `reduce()` returns whatever the reducer accumulates.

### Likely follow-up questions

- What is the difference between `map()` and `forEach()`?
- What happens when `reduce()` is called without an initial value?
- Can `reduce()` return an object or another array?
- What is the time complexity of these methods?
- Can these methods be chained?
- When might a regular `for` loop be more appropriate?

## 38. How does garbage collection work in JavaScript? ★★★

### Definition — interview answer

Garbage collection is the automatic process through which the JavaScript engine identifies memory that is no longer reachable by the program and reclaims it.

Modern JavaScript engines commonly use reachability-based algorithms, including mark-and-sweep techniques, alongside generational and other optimizations. The exact implementation varies by engine.

### Example

```
function createUser() {
  const user = {
    name: "Himanshu",
    data: new Array(1000).fill("data")
  };

  return user.name;
}

createUser();
```

After the function finishes, the local object becomes eligible for collection if nothing else retains a reference to it. The returned string is a separate result; the entire object does not need to remain reachable just because its name was returned.

### Mental model

Imagine a building's cleaning team:

1. Start from the people and objects that are still in use.
2. Follow the references to everything they can still access.
3. Mark those things as needed.
4. Reclaim memory occupied by unreachable things.

JavaScript doesn't simply delete an object as soon as a function returns. If a closure or another reachable object still references it, it may need to stay in memory.

### Common causes of memory leaks

```
const cache = [];

function storeData(data) {
  cache.push(data);
}
```

If `cache` keeps growing indefinitely, those objects remain reachable and cannot be reclaimed merely because they are no longer useful to the application.

Other common problems include:

- Event listeners that are no longer needed.
- Timers that continue running unnecessarily.
- Closures retaining large objects.
- Detached DOM elements still referenced by JavaScript.
- Unbounded caches or maps.

### Important details

- You generally cannot force the browser's garbage collector to run at a specific time.
- Garbage collection can reclaim unreachable memory, not objects that remain reachable merely because the application has lost track of their usefulness.
- `WeakMap` and `WeakSet` allow weak references to object keys or values under their respective rules, which can help avoid certain retention problems.
- Garbage collection timing is not deterministic.

### Likely follow-up questions

- What is mark-and-sweep garbage collection?
- What is the difference between stack and heap memory?
- What causes a JavaScript memory leak?
- Can closures cause memory leaks?
- What is the difference between `Map` and `WeakMap` for memory management?
- Can we force garbage collection in the browser?

## 39. Difference between normal functions and arrow functions. ★★★

### Definition — interview answer

A normal function is a function declaration or expression with its own function execution behavior, including a dynamically determined `this` value and, in ordinary functions, an `arguments` object.

An arrow function is a more concise function expression that captures `this` and `arguments` lexically, does not have its own `prototype`, and cannot be called as a constructor with `new`.

### Comparison

| Feature                                          | Normal function                     | Arrow function         |
| ------------------------------------------------ | ----------------------------------- | ---------------------- |
| Own `this`                                       | Yes, determined by the call         | No, inherits lexically |
| Own `arguments`                                  | Usually yes                         | No                     |
| Can be used with `new`                           | If constructible                    | No                     |
| Own `prototype` property                         | On ordinary constructible functions | No                     |
| Syntax                                           | Declaration or expression           | Expression             |
| Suitable for object methods using dynamic `this` | Usually yes                         | Usually no             |

### Example

```
const user = {
  name: "Himanshu",

  normal() {
    return this.name;
  },

  arrow: () => {
    return this.name;
  }
};

console.log(user.normal()); // Himanshu
console.log(user.arrow());  // Depends on the surrounding lexical this
```

The arrow function does not get `this` from `user`.

### Arrow functions in callbacks

```
const user = {
  name: "Himanshu",

  delayedGreeting() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  }
};

user.delayedGreeting(); // Himanshu
```

The arrow callback inherits `this` from `delayedGreeting()`, preserving the receiver.

### Mental model

A normal function receives its own work badge based on how it is called. An arrow function borrows the badge from the surrounding environment.

### Important traps

- Arrow functions are not always better; the right choice depends on the intended `this` behavior.
- Arrow functions cannot be generators.
- An arrow function's lack of its own `arguments` does not mean arguments passed to it are inaccessible; they can be received through rest parameters.
- Normal functions can be named expressions or declarations, and ordinary functions may be constructible or non-constructible depending on their form.

### Likely follow-up questions

- Why can't an arrow function be used as a constructor?
- What is the difference between `arguments` and rest parameters?
- When should you use an arrow function as an object property?
- How does lexical `this` work in nested callbacks?
- Do arrow functions have a `prototype`?
- Can an arrow function be a generator?

# Part 7: DOM, browser rendering and security

## 40. What are reflow and repaint in the DOM? ★★★

### Definition — interview answer

Reflow, also called layout in modern browser terminology, occurs when the browser recalculates the size or position of elements in the layout.

Repaint occurs when the browser redraws the visual appearance of elements without necessarily recalculating their layout.

A layout change may require both layout recalculation and repainting. A purely visual change may require repainting without reflow.

### Example

```
const box = document.querySelector(".box");

// May trigger layout recalculation and repaint
box.style.width = "300px";

// Usually requires repainting, but not layout
box.style.backgroundColor = "red";
```

Changing the width can affect the element's geometry and potentially the layout of neighboring elements. Changing the background color does not normally affect geometry.

### Mental model

Imagine a room with furniture:

- Reflow: measuring the room again and repositioning the furniture.
- Repaint: keeping the furniture in place but repainting its surfaces.

Reflow can be more expensive because it may affect other elements. However, the actual performance cost depends on the page and browser.

### Common performance trap: layout thrashing

```
const items = document.querySelectorAll(".item");

items.forEach(item => {
  item.style.width = "300px";
  console.log(item.offsetWidth);
});
```

Repeatedly alternating DOM writes with layout-dependent reads can force the browser to synchronously calculate layout multiple times.

A better approach is often to batch reads first, then writes:

```
const items = [...document.querySelectorAll(".item")];

const widths = items.map(item => item.offsetWidth);

items.forEach(item => {
  item.style.width = "300px";
});
```

The exact benefit depends on the surrounding code, but batching avoids the obvious read-write-read-write pattern.

### How to optimize rendering

- Batch DOM reads and writes.
- Avoid unnecessary changes to layout-affecting properties.
- Use `transform` and `opacity` for suitable animations; these can often be handled without layout and may be composited.
- Use browser DevTools Performance tools to find actual bottlenecks.
- Avoid assuming every CSS change causes the same rendering work.

### Likely follow-up questions

- What is the difference between reflow and repaint?
- Which CSS properties can trigger layout?
- What is layout thrashing?
- Why are `transform` and `opacity` often better for animations?
- What is compositing?
- How would you diagnose a slow animation in Chrome DevTools?

## 41. What is a `DocumentFragment`? ★★

### Definition — interview answer

A `DocumentFragment` is a lightweight container for DOM nodes that is not itself part of the document tree. You can build a group of nodes inside it and then insert those nodes into the document.

When a fragment is inserted, its children are moved into the destination; the fragment itself is not inserted as a persistent wrapper.

### Example

```
const list = document.querySelector("#list");
const fragment = document.createDocumentFragment();

for (let i = 1; i <= 3; i++) {
  const item = document.createElement("li");
  item.textContent = `Item ${i}`;

  fragment.appendChild(item);
}

list.appendChild(fragment);
```

The list receives all three `<li>` elements, without an additional fragment element appearing in the DOM.

### Mental model

Imagine preparing several packages on a trolley before moving them into a warehouse. You arrange the items first, then transfer them together, without the trolley becoming part of the warehouse inventory.

### Why use it?

- It makes it convenient to build DOM subtrees off-document.
- It avoids inserting an extra wrapper element.
- It can simplify code that creates many nodes.
- It may reduce unnecessary intermediate DOM updates, though modern browsers often optimize ordinary DOM operations too.

### Likely follow-up questions

- What is the difference between a `DocumentFragment` and a regular DOM element?
- Does a fragment remain in the DOM after insertion?
- Does `appendChild(fragment)` copy or move its children?
- Does using a fragment always improve performance?
- How does `DocumentFragment` differ from `innerHTML`?

## 42. Difference between `innerHTML` and `textContent`. ★★★

### Definition — interview answer

`innerHTML` gets or sets the HTML markup inside an element. When setting it, the browser parses the supplied string as HTML and creates DOM nodes.

`textContent` gets or sets the text content of an element. When setting it, the supplied string is treated as text rather than parsed as HTML.

### Example

```
const box = document.querySelector("#box");

box.innerHTML = "<strong>Hello</strong>";
```

This creates a `<strong>` element displaying bold text.

Compare:

```
box.textContent = "<strong>Hello</strong>";
```

This displays the literal text:

`<strong>Hello</strong>`

It does not create a `<strong>` element.

### Mental model

Imagine receiving a message:

- `innerHTML` interprets the message as instructions for constructing a room.
- `textContent` treats the message as words to display on a sign.

### Important differences

| Feature                      | `innerHTML`                                     | `textContent`                       |
| ---------------------------- | ----------------------------------------------- | ----------------------------------- |
| Parses HTML                  | Yes, when setting                               | No                                  |
| Creates elements from markup | Yes                                             | No                                  |
| Suitable for untrusted text  | Avoid directly inserting it as HTML             | Generally safer for displaying text |
| Gets descendant text         | Returns serialized markup                       | Returns text content                |
| Performance                  | HTML parsing and DOM construction may be needed | Usually simpler for plain text      |

### Important trap

Setting `textContent` replaces the element's existing children with a text node (or removes them if the value is empty). It is not an append operation.

Also, reading `textContent` and `innerHTML` can return different content. For example, `textContent` includes text from descendants that may be hidden with CSS, while `innerText` is more closely tied to rendered text.

### Likely follow-up questions

- What is the difference between `innerHTML`, `innerText`, and `textContent`?
- Does `textContent` parse HTML?
- Why can `innerHTML` be dangerous?
- What happens to existing event listeners when children are replaced?
- Which property would you use to display user-submitted text safely?

## 43. What is the DOM tree? What are nodes? ★★★

### Definition — interview answer

The Document Object Model (DOM) is a programming interface that represents an HTML document as a structured tree of objects. JavaScript can use the DOM to read and modify the document's content, structure, and attributes.

A node is a general term for an object in this tree. Common node types include document nodes, element nodes, text nodes, comments, and document fragments.

### Example

HTML:

```
<body>
  <h1>Hello</h1>
  <p>Welcome</p>
</body>
```

Simplified DOM tree:

`document`

`<html>`

`<body>`

`<h1>`

Element node

`"Hello"`

Text node

`<p>`

Element node

`"Welcome"`

Text node

The real HTML document also contains implicit and other nodes, such as `<head>`, depending on the markup.

### Mental model

Imagine a family tree:

- A parent node can have child nodes.
- Children can have their own descendants.
- JavaScript can navigate the tree, add nodes, remove nodes, or change their properties.

### Important distinctions

- `document` represents the document itself.
- `document.documentElement` usually refers to the root `<html>` element.
- `document.body` refers to the body element.
- `childNodes` includes text and comment nodes as well as elements.
- `children` contains only child elements.
- Whitespace between HTML tags can create text nodes.

### Example: `childNodes` versus `children`

```
<div id="box">
  <p>Hello</p>
</div>
```

```
const box = document.querySelector("#box");

console.log(box.childNodes);
console.log(box.children);
```

`childNodes` can include whitespace text nodes surrounding the `<p>`. `children` includes only the `<p>` element.

### Likely follow-up questions

- What is the difference between a node and an element?
- What is the difference between `childNodes` and `children`?
- What is the difference between the DOM and HTML source code?
- How do you create, append, and remove DOM nodes?
- What is the difference between the DOM tree and the CSSOM tree?

## 44. Explain `stopPropagation()`, `stopImmediatePropagation()`, and `preventDefault()`. ★★★

### Definition — interview answer

These methods control different aspects of DOM event handling:

- `stopPropagation()` prevents the event from continuing to propagate through the DOM.
- `stopImmediatePropagation()` stops propagation and prevents later listeners on the same event target from being invoked.
- `preventDefault()` prevents the browser's default action for a cancelable event, when the event is not in a context that disallows cancellation.

### Example: `stopPropagation()`

```
parent.addEventListener("click", () => {
  console.log("Parent");
});

child.addEventListener("click", event => {
  event.stopPropagation();
  console.log("Child");
});
```

Clicking the child prints:

```
Child
```

The parent's bubbling listener does not run.

### Example: `stopImmediatePropagation()`

```
button.addEventListener("click", event => {
  console.log("First listener");
  event.stopImmediatePropagation();
});

button.addEventListener("click", () => {
  console.log("Second listener");
});
```

Output:

```
First listener
```

The second listener on the same target is prevented from running.

### Example: `preventDefault()`

```
link.addEventListener("click", event => {
  event.preventDefault();
  console.log("Navigation prevented");
});
```

Clicking the link does not perform its normal navigation, assuming the event is cancelable and the listener is permitted to cancel it.

### Mental model

Imagine a delivery system:

- `stopPropagation()`: stop the package from travelling to the next offices.
- `stopImmediatePropagation()`: stop the package and prevent other handlers at the current office from processing it.
- `preventDefault()`: stop the automatic action normally triggered by the package, such as opening a door.

### Quick comparison

| Method                       | Stops propagation? | Stops later listeners on same target? | Prevents default action?          |
| ---------------------------- | ------------------ | ------------------------------------- | --------------------------------- |
| `stopPropagation()`          | Yes                | No                                    | No                                |
| `stopImmediatePropagation()` | Yes                | Yes                                   | No                                |
| `preventDefault()`           | No                 | No                                    | Yes, when cancellation is allowed |

### Likely follow-up questions

- What is the difference between propagation and default behavior?
- Can `preventDefault()` stop an event from bubbling?
- Can `stopPropagation()` prevent a form from submitting?
- What happens if the event is not cancelable?
- What is the difference between `stopPropagation()` and `stopImmediatePropagation()`?

## 45. Difference between `event.target` and `event.currentTarget`. ★★★

### Definition — interview answer

`event.target` identifies the object where the event originally occurred, while `event.currentTarget` identifies the element whose event listener is currently executing.

### Example

```
<div id="parent">
  <button id="child">
    <span id="icon">Click me</span>
  </button>
</div>
```

```
document.querySelector("#parent").addEventListener("click", event => {
  console.log("Target:", event.target.id);
  console.log("Current target:", event.currentTarget.id);
});
```

If the user clicks the `<span>`:

```
Target: icon
Current target: parent
```

The original event happened on the span, but the listener is attached to the parent.

### Mental model

Imagine a customer entering a large shop through a particular door:

- `target` is the exact place where the customer started.
- `currentTarget` is the desk currently handling the customer's request.

As the event travels, the current target can change from one listener to another, but the original target generally stays the same.

### Important detail

`event.currentTarget` is meaningful while the listener is running. If you save the event object and inspect `currentTarget` later in an asynchronous callback, it may be `null`.

### Likely follow-up questions

- What is the difference between `target` and `currentTarget`?
- How does this distinction help with event delegation?
- Does `event.target` change during bubbling?
- What is `event.relatedTarget`?
- Why might `currentTarget` be `null` outside the event handler?

## 46. How does a browser render a web page? Explain the Critical Rendering Path. ★★

### Definition — interview answer

The Critical Rendering Path is the sequence of steps the browser takes to transform HTML, CSS, and JavaScript resources into pixels displayed on the screen.

A simplified rendering pipeline includes parsing HTML into the DOM, parsing CSS into the CSSOM, combining relevant structures into a render tree, calculating layout, painting visual content, and compositing layers for display.

JavaScript, images, fonts, and other resources can influence or delay these steps.

### The main steps

### 1

Download and parse HTML

The browser starts constructing the DOM tree.

### 2

Download and parse CSS

CSS rules are processed into the CSSOM.

### 3

Build the render tree

Relevant visible content and styles are combined.

### 4

Layout

The browser calculates element geometry and positions.

### 5

Paint

Text, colors, borders and other visual details are drawn.

### 6

Composite

Layers are combined to produce the displayed frame.

### Mental model

Imagine building a house:

1. Read the building plan.
2. Understand the materials and rules.
3. Decide which parts need to be constructed.
4. Measure where everything belongs.
5. Paint and finish the surfaces.
6. Combine the completed pieces into the final view.

### Where does JavaScript fit?

JavaScript can modify the DOM and styles, changing what must be laid out and painted. Certain scripts can delay HTML parsing or first rendering, depending on how they are loaded and executed.

For example:

```
<script src="app.js"></script>
```

A classic script without `async` or `defer` can block HTML parsing while it is fetched and executed.

For many external scripts, using:

```
<script src="app.js" defer></script>
```

allows the HTML parser to continue while the script downloads. The deferred script executes after HTML parsing completes and before `DOMContentLoaded`.

### How to improve rendering performance

- Reduce render-blocking resources where appropriate.
- Minimize unnecessary JavaScript execution.
- Optimize critical CSS and font loading.
- Use appropriately sized, compressed images.
- Avoid layout thrashing.
- Reduce large layout and paint workloads.
- Measure performance with browser DevTools and Core Web Vitals.

### Important detail

The browser doesn't necessarily complete each stage once and never revisit it. DOM or style changes can trigger additional style calculations, layout, paint, and compositing work.

### Likely follow-up questions

- What is the difference between DOM and CSSOM?
- What is a render-blocking resource?
- What is the difference between `async` and `defer`?
- What causes layout shifts?
- How can JavaScript delay the first render?
- What are First Contentful Paint (FCP) and Largest Contentful Paint (LCP)?
- What is the difference between layout, paint, and compositing?

## 47. Why is `innerHTML` unsafe? Explain XSS. ★★

### Definition — interview answer

Using `innerHTML` with untrusted input can introduce Cross-Site Scripting (XSS) vulnerabilities because the browser parses the supplied string as HTML and may create executable elements or event-handler attributes.

Cross-Site Scripting (XSS) is a security vulnerability in which an attacker causes malicious script to execute in another user's browser within the context of a vulnerable website.

### Example of unsafe code

```
const userInput = `
  <img src="invalid"
       onerror="alert('XSS')">
`;

document.querySelector("#output").innerHTML = userInput;
```

When the browser parses this HTML, the image fails to load and its event handler may execute. This demonstrates an event-handler injection; it does not require a `<script>` tag.

### Safer alternative for plain text

```
const userInput = "<img src=x onerror=alert(1)>";

document.querySelector("#output").textContent = userInput;
```

Now the supplied string is displayed as text rather than interpreted as HTML.

### Mental model

Imagine a security officer receiving a package:

- A trusted instruction may be followed.
- An untrusted message should be displayed or inspected, not automatically executed as instructions.

`innerHTML` treats the input as markup. `textContent` treats it as text.

### Types of XSS

- Stored XSS: malicious content is saved, such as in a database or comment, and later displayed to other users.
- Reflected XSS: malicious input is returned in a response and executed when a victim opens a crafted request or URL.
- DOM-based XSS: client-side JavaScript uses untrusted data in an unsafe way, causing malicious content to be interpreted or executed.

These categories can overlap in real applications.

### How to prevent XSS

1. Use `textContent` when displaying plain user-supplied text.
2. Avoid inserting untrusted strings into `innerHTML`.
3. If HTML input is genuinely required, sanitize it with a reputable HTML sanitizer configured for the intended use.
4. Use context-appropriate output encoding and safe DOM APIs.
5. Avoid dangerous patterns such as executing user input with `eval()`.
6. Deploy a properly configured Content Security Policy (CSP) as an additional defense, not as a substitute for safe coding.

### Important interview nuance

`innerHTML` is not inherently unsafe in every situation. Assigning a trusted, static HTML string is different from inserting untrusted content. The vulnerability arises when untrusted input reaches an HTML-parsing or execution-sensitive context without adequate protection.

Also, `textContent` is generally the right choice for displaying plain text, but security still depends on how the value is used elsewhere in the application.

### Likely follow-up questions

- What is the difference between stored, reflected, and DOM-based XSS?
- Why might an `<img onerror>` payload execute even if a `<script>` inserted through `innerHTML` does not execute in the same way?
- What is the difference between HTML sanitization and output encoding?
- What is Content Security Policy (CSP)?
- How does XSS differ from SQL injection?
- What are safe alternatives to `innerHTML`?
- How would you securely render user-generated rich text?

