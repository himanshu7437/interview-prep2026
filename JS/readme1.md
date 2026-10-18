# JavaScript Interview Preparation — Complete Guide (25 Questions)

We'll prepare these questions so you can do more than memorize definitions. The goal is to understand the concept, visualize what JavaScript is doing, explain it in an interview, and handle follow-up questions confidently.

For every question, we'll use this structure:

1. Definition / interview answer — how to explain it professionally.
2. Example — code with an explanation of what happens.
3. Mental model — an analogy or visualization to help you remember it.
4. Important details and traps — the points interviewers often test.
5. Likely follow-up questions — questions to practise, without their answers, as requested.

I'll use modern JavaScript and browser examples unless the concept requires a different context. For polyfills, we'll distinguish simplified educational implementations from fully specification-compliant implementations.

## Part 1: JavaScript fundamentals and execution

## 1. What is hoisting? ★★★

### Definition — interview answer

Hoisting is JavaScript's behavior of processing declarations during the creation phase of an execution context before executing the code line by line. Depending on the declaration type, variables and functions become available differently.

Important: Hoisting does not mean JavaScript physically moves your code to the top. It describes how JavaScript sets up declarations before execution.

### Example

```
console.log(a);
greet();

var a = 10;

function greet() {
  console.log("Hello!");
}
```

Output:

```
undefined
Hello!
```

Why?

Imagine JavaScript preparing the room before a meeting begins:

- It registers `var a` and initializes it with `undefined`.
- It registers the entire `greet` function.
- Then it starts executing your code from the first line.

So `console.log(a)` prints `undefined`, and `greet()` works even though its definition appears later.

You can think of the setup approximately like this:

```
var a = undefined;

function greet() {
  console.log("Hello!");
}

console.log(a);
greet();

a = 10;
```

This is a mental model, not a literal transformation performed on your source code.

### Important interview traps

```
console.log(a); // undefined
var a = 10;

console.log(b); // ReferenceError
let b = 20;
```

`var` is initialized to `undefined` during setup. A `let` binding is also created during setup, but it cannot be accessed before initialization.

Function declarations are also hoisted with their function bodies. Function expressions follow the behavior of the variable declaration holding them.

```
sayHi(); // TypeError: sayHi is not a function

var sayHi = function () {
  console.log("Hi");
};
```

Here, `sayHi` initially contains `undefined`. JavaScript cannot call `undefined` as a function.

### Mental model

Think of a classroom before a test:

- The teacher prepares the attendance register first.
- Names are recorded before the test starts.
- Some entries already have information; others are not initialized yet.
- The actual test begins only afterward.

### Likely follow-up questions

- Does JavaScript physically move declarations to the top?
- What is the difference between hoisting a function declaration and a function expression?
- Why does `var` return `undefined` instead of throwing an error?
- Are classes hoisted?
- What happens when a variable is declared but never initialized?

## 2. Are `let` and `const` also hoisted? ★★★

### Definition — interview answer

Yes. Both `let` and `const` declarations are hoisted in the sense that their bindings are created when the relevant lexical environment is established. However, they are not initialized until execution reaches their declarations. Accessing them before initialization throws a `ReferenceError`.

### Example

```
console.log(a); // ReferenceError
let a = 10;

console.log(b); // ReferenceError
const b = 20;
```

Compare this with:

```
console.log(c); // undefined
var c = 30;
```

### Mental model

Imagine three lockers prepared before school begins:

- `var`: locker exists and contains a placeholder marked `undefined`.
- `let`: locker exists but is locked until its declaration executes.
- `const`: locker also exists but is locked until initialization, and its binding cannot later be reassigned.

The locked period is called the Temporal Dead Zone, which we'll discuss next.

### Important details

`const` must be initialized when declared:

```
const age; // SyntaxError
```

Also, `const` prevents reassignment of the binding, not mutation of an object:

```
const user = { name: "Aman" };

user.name = "Rahul"; // Allowed
user = {};           // TypeError
```

The object can change; the variable cannot be made to refer to a different object.

### Likely follow-up questions

- If `let` and `const` are hoisted, why can't we access them?
- What is the difference between `var`, `let`, and `const`?
- Can we modify an object declared with `const`?
- Are `let` and `const` function-scoped or block-scoped?
- What happens when we declare the same variable twice?

## 3. Explain the Temporal Dead Zone (TDZ). ★★★

### Definition — interview answer

The Temporal Dead Zone is the period between entering the scope of a `let`, `const`, or class declaration and the point at which that binding is initialized. Accessing the binding during this period results in a `ReferenceError`.

### Example

```
{
  // TDZ begins for age
  console.log(age); // ReferenceError

  let age = 25;     // TDZ ends for age

  console.log(age); // 25
}
```

### Mental model

Imagine entering a room where your name is already assigned to a desk, but your access card has not been activated. The desk exists, but you cannot use it yet.

- Enter the scope: the binding exists.
- Reach the declaration: initialization happens.
- Before initialization: TDZ.

The TDZ is not necessarily a fixed number of seconds. It is a region of code and execution.

### A subtle interview example

```
let value = 10;

{
  console.log(value); // ReferenceError
  let value = 20;
}
```

Why doesn't it print `10`?

The inner `let value` creates a separate binding for the block. JavaScript resolves `value` to that inner binding, which is still in its TDZ. It does not fall back to the outer variable.

### Likely follow-up questions

- When exactly does the TDZ begin and end?
- Does `var` have a TDZ?
- Why does the inner variable shadow the outer variable?
- Can a function throw a TDZ error even when the variable is declared outside it?
- How does the TDZ help prevent programming errors?

## 4. Difference between `==` and `===`. ★★★

### Definition — interview answer

`==` is the loose equality operator. It may convert operands to compatible types before comparing them.

`===` is the strict equality operator. It does not perform type coercion between operands. Values of different types are unequal under strict equality.

### Example

```
console.log(5 == "5");  // true
console.log(5 === "5"); // false

console.log(0 == false);  // true
console.log(0 === false); // false
```

With `==`, JavaScript converts values in certain situations before comparing them. With `===`, the number `5` and string `"5"` remain different types.

### Mental model

Imagine comparing two identity cards:

- `==` asks, "Can I convert these details into an equivalent value?"
- `===` asks, "Are the values equal without converting their types?"

This is only an analogy; the exact rules of `==` are defined by JavaScript's equality algorithm.

### Important edge cases

```
console.log(null == undefined);  // true
console.log(null === undefined); // false

console.log(NaN === NaN); // false

console.log([] == false); // true
console.log([] === false); // false
```

`NaN` is unequal to itself under both loose and strict equality. Use `Number.isNaN()` to check for it, or `Object.is(NaN, NaN)`.

Objects are compared by identity, not by their contents:

```
console.log({ a: 1 } === { a: 1 }); // false

const x = { a: 1 };
const y = x;

console.log(x === y); // true
```

### Interview recommendation

Prefer `===` and `!==` by default because their behavior is more predictable. Use loose equality only when you deliberately want its conversion rules.

### Likely follow-up questions

- What is type coercion?
- Why is `null == undefined` true?
- Why does `NaN === NaN` return false?
- How do objects behave under equality comparison?
- What is the difference between `Object.is()` and `===`?

## 5. What is synchronous code and asynchronous code? ★★★

### Definition — interview answer

Synchronous code executes sequentially, with each operation generally needing to finish before the next statement proceeds.

Asynchronous programming allows an operation to be initiated without blocking the continuation of JavaScript's execution while waiting for that operation to complete. Its result can be handled later through callbacks, promises, or `async/await`.

### Example: synchronous code

```
console.log("A");
console.log("B");
console.log("C");
```

Output:

```
A
B
C
```

Each statement runs in order.

### Example: asynchronous behavior

```
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

Output:

```
A
C
B
```

The timer schedules a callback. JavaScript continues executing the remaining synchronous statements. The callback runs later when the timer has expired and the event loop can process it.

### Mental model

Imagine ordering food at a restaurant.

- Synchronous: You stand at the counter and block the next task until your food is ready.
- Asynchronous: You place the order, receive a token, and do other things while the kitchen prepares it. You collect your food when it's ready.

### Important distinction

Asynchronous does not automatically mean multithreaded or parallel.

For example:

```
setTimeout(() => {
  // This callback still executes JavaScript on its turn.
}, 1000);
```

The timer does not make this JavaScript callback execute simultaneously with the current JavaScript task.

Similarly, an `async` function runs synchronously until it reaches an `await` that suspends its continuation.

### Likely follow-up questions

- Does asynchronous JavaScript mean JavaScript is multithreaded?
- What is blocking versus non-blocking code?
- Is `setTimeout(fn, 0)` executed immediately?
- How do callbacks, promises, and `async/await` differ?
- How does the event loop coordinate asynchronous work?

## 6. Explain the event loop in the browser. ★★★

### Definition — interview answer

The event loop is the mechanism that coordinates JavaScript execution with queued tasks and microtasks in the browser. It allows JavaScript to process events and asynchronous callbacks while interacting with browser APIs, provided the main thread is not blocked.

For interview purposes, understand these components:

- Call stack: executes currently running JavaScript functions.
- Browser APIs: handle facilities such as timers, network requests, and DOM events.
- Task queue: holds runnable tasks such as timer callbacks and many event callbacks.
- Microtask queue: holds promise reaction callbacks and other microtasks.
- Event loop: coordinates when queued work can run.

### Example

```
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

Output:

```
1
4
3
2
```

Why?

Step 1 — Synchronous execution

Prints `1`, schedules a timer and a promise reaction, then prints `4`.

Step 2 — Microtasks

The promise reaction runs and prints `3` after the current task completes.

Step 3 — Timer task

The timer callback prints `2` when its task becomes eligible to run.

### Mental model

Imagine a single cashier:

- The cashier is the call stack.
- Customers waiting in the regular line represent tasks.
- Small priority jobs waiting for attention represent microtasks.
- The event loop coordinates the next work the cashier can perform.

After a task finishes, the browser normally drains the microtask queue before moving to the next task. The browser also coordinates rendering opportunities; the exact timing of rendering is not simply "after every callback."

### Important details

- `setTimeout(fn, 0)` does not mean "run now."
- Promise handlers such as `.then()` run as microtasks.
- Long-running synchronous JavaScript blocks the main thread and can freeze the UI.
- Recursive microtask scheduling can prevent the browser from getting to later tasks and rendering.

### Likely follow-up questions

- What is the difference between a task and a microtask?
- Why do promises generally execute before timer callbacks?
- What happens when the call stack is busy?
- Can the event loop cause a browser page to freeze?
- What is the relationship between the event loop and rendering?

## 7. What is starvation of functions in the callback queue? ★★

### Definition — interview answer

Starvation occurs when a task or callback is repeatedly prevented from running because other work keeps taking priority or continuously occupies the execution thread.

In browser JavaScript, a common example is microtask starvation, where microtasks continuously schedule more microtasks, preventing the event loop from reaching later tasks and potentially delaying rendering.

### Example

```
function keepRunning() {
  queueMicrotask(keepRunning);
}

keepRunning();

setTimeout(() => {
  console.log("Timer executed");
}, 0);
```

The recursive microtask continually adds more microtasks. The microtask queue may never become empty, so the timer callback can be delayed indefinitely and the page may become unresponsive.

Do not run this example in a normal browser tab unless you are prepared to close the tab.

### Mental model

Imagine a cashier who must handle urgent internal requests before serving the normal queue. If every completed urgent request generates another urgent request, regular customers may never be served.

### How can it be avoided?

- Break large computations into smaller chunks.
- Yield execution between chunks, for example with tasks scheduled using `setTimeout` or `scheduler.postTask` where supported.
- Use Web Workers for suitable CPU-heavy work.
- Avoid recursively creating unbounded microtasks.

### Likely follow-up questions

- What is microtask starvation?
- How is starvation different from a blocked call stack?
- Why can recursive `Promise.resolve().then(...)` calls starve timers?
- How can we yield back to the browser?
- When should we use Web Workers?

## 8. Explain `Proxy` in JavaScript objects. ★★

### Definition — interview answer

A `Proxy` is an object that wraps another object and allows us to intercept and customize fundamental operations performed on it, such as reading properties, setting properties, checking whether properties exist, or deleting properties.

The intercepted behavior is defined using traps in a handler object.

### Example

```
const user = {
  name: "Himanshu",
  age: 24
};

const proxyUser = new Proxy(user, {
  get(target, property, receiver) {
    console.log(`Reading: ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },

  set(target, property, value, receiver) {
    if (property === "age" && value < 0) {
      throw new Error("Age cannot be negative");
    }

    return Reflect.set(target, property, value, receiver);
  }
});

console.log(proxyUser.name); // Logs Reading: name, then Himanshu

proxyUser.age = 25; // Allowed
proxyUser.age = -1; // Error
```

### Mental model

Imagine a security guard at a building entrance. Every time someone tries to enter, leave, or access a restricted area, the guard checks the request and decides what to allow.

The original object is the building; the proxy is the guard controlling access to it.

### Important details

- `target` is the original object.
- `handler` contains the traps.
- `get` intercepts property reads.
- `set` intercepts property writes.
- `Reflect` provides methods for performing the corresponding default operations.
- Proxies have important invariants and are not a way to bypass JavaScript's fundamental object rules.

### Likely follow-up questions

- What are `target`, `handler`, and `trap`?
- What is the difference between `Proxy` and `Object.defineProperty()`?
- What is `Reflect` and why is it useful?
- Can a proxy intercept every possible operation on an object?
- What are real-world uses of proxies in validation, logging, or reactive frameworks?

## Part 2: Asynchronous JavaScript and promises

## 9. Explain callback hell. ★★★

### Definition — interview answer

Callback hell is a situation where multiple asynchronous operations are nested inside one another through callbacks, making the code deeply indented, difficult to read, hard to maintain, and more complicated to handle errors in.

### Example

```
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getPayment(orders[0].id, (payment) => {
      sendReceipt(payment, (result) => {
        console.log("Receipt sent");
      });
    });
  });
});
```

Each operation depends on the result of the previous operation. This creates a pyramid-like structure.

### Mental model

Imagine following instructions where each person says, "Wait for the previous person to finish before asking the next person." If every step is written inside the previous step, the instructions become deeply nested.

### Better approach

Promises allow the dependent operations to be expressed through chaining:

```
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getPayment(orders[0].id))
  .then(payment => sendReceipt(payment))
  .then(() => console.log("Receipt sent"))
  .catch(error => console.error(error));
```

This assumes those functions return promises.

### Important detail

Callbacks themselves are not bad. Event handlers, array methods and many APIs use callbacks effectively. The problem is uncontrolled nesting and poor error handling, not the existence of callbacks.

### Likely follow-up questions

- How do promises solve callback hell?
- Can callback hell happen with synchronous code?
- What is inversion of control?
- How can errors be handled in nested callbacks?
- Does `async/await` eliminate every asynchronous programming problem?

## 10. Explain promises. ★★★

### Definition — interview answer

A Promise is a JavaScript object representing the eventual completion or failure of an asynchronous operation and its resulting value.

A promise has three states:

- Pending: the operation has not settled.
- Fulfilled: the operation completed successfully with a value.
- Rejected: the operation failed with a reason.

Once settled, a promise cannot change from fulfilled to rejected or vice versa.

### Example

```
const promise = new Promise((resolve, reject) => {
  const paymentSuccessful = true;

  if (paymentSuccessful) {
    resolve("Payment completed");
  } else {
    reject(new Error("Payment failed"));
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error.message));
```

Output:

```
Payment completed
```

### Mental model

Imagine ordering a package online.

- Pending: the package is being prepared.
- Fulfilled: the package has arrived successfully.
- Rejected: the delivery failed.

The promise is a representation of the result, not the package itself.

### Important details

1\. The executor runs synchronously.

```
console.log("A");

new Promise(resolve => {
  console.log("B");
  resolve();
});

console.log("C");
```

Output:

```
A
B
C
```

2\. Promise handlers run asynchronously as microtasks.

```
Promise.resolve().then(() => console.log("B"));
console.log("A");
```

Output:

```
A
B
```

3\. Calling `resolve()` does not necessarily fulfill a promise immediately with a plain value. If you resolve with another promise or thenable, the promise adopts its eventual state.

### Likely follow-up questions

- What are the three promise states?
- What is the difference between `resolve()` and `reject()`?
- Does the promise executor run synchronously or asynchronously?
- What happens if an error is thrown inside a `.then()` callback?
- Can a settled promise change its state?

## 11. Explain promise chaining. ★★★

### Definition — interview answer

Promise chaining is the process of linking multiple `.then()`, `.catch()`, and `.finally()` handlers so that the result of one stage determines what happens in the next stage.

Each call to `.then()` returns a new promise. That returned promise adopts the result of the callback: a returned value fulfills it, a returned promise or thenable is adopted, and a thrown error rejects it.

### Example

```
Promise.resolve(5)
  .then(value => {
    console.log(value);
    return value * 2;
  })
  .then(value => {
    console.log(value);
    return value + 3;
  })
  .then(value => {
    console.log(value);
  });
```

Output:

```
5
10
13
```

### Mental model

Imagine a production line:

1. The first worker receives `5`.
2. The next worker receives the first worker's result, `10`.
3. The next worker receives `13`.

Every worker passes its result forward.

### A very common interview trap

```
Promise.resolve(10)
  .then(value => {
    value * 2;
  })
  .then(result => {
    console.log(result);
  });
```

Output:

```
undefined
```

The first callback uses braces without a `return`, so it returns `undefined`.

Correct version:

```
Promise.resolve(10)
  .then(value => {
    return value * 2;
  })
  .then(result => console.log(result)); // 20
```

Or use an implicit return:

```
Promise.resolve(10)
  .then(value => value * 2)
  .then(console.log);
```

### Error propagation

```
Promise.resolve()
  .then(() => {
    throw new Error("Something failed");
  })
  .then(() => console.log("Skipped"))
  .catch(error => console.log(error.message))
  .then(() => console.log("Continues"));
```

Output:

```
Something failed
Continues
```

The thrown error rejects the chain. The `.catch()` handles it, and because that handler returns normally, the chain can continue.

### Likely follow-up questions

- Why does `.then()` return a new promise?
- What happens if you forget `return`?
- What happens when a `.then()` callback returns a promise?
- How does an error propagate through a promise chain?
- What is the difference between returning a value and throwing an error?

## 12. Explain all the main Promise methods. ★★★

For interviews, focus on the following static methods and instance methods.

### Static methods

These are called on `Promise`, rather than on an existing promise.

| Method                         | Purpose                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Promise.resolve(value)`       | Creates a promise fulfilled with a value, adopting a promise or thenable when appropriate.     |
| `Promise.reject(reason)`       | Creates a rejected promise.                                                                    |
| `Promise.all(iterable)`        | Fulfills when all inputs fulfill; rejects when an input rejects.                               |
| `Promise.allSettled(iterable)` | Waits for all inputs to settle and reports every outcome.                                      |
| `Promise.race(iterable)`       | Settles with the first input to settle, whether fulfilled or rejected.                         |
| `Promise.any(iterable)`        | Fulfills with the first successful result; rejects with `AggregateError` if all inputs reject. |

### 12.1 `Promise.resolve()` and `Promise.reject()`

```
Promise.resolve(10).then(console.log); // 10

Promise.reject(new Error("Failed"))
  .catch(error => console.log(error.message)); // Failed
```

Think of these as convenient ways to create fulfilled and rejected promises.

### 12.2 `Promise.all()`

Use it when every operation must succeed.

```
const results = await Promise.all([
  fetch("/api/user"),
  fetch("/api/products"),
  fetch("/api/orders")
]);
```

It fulfills when all input promises fulfill. If one rejects, the returned promise rejects early, although other operations already started are not automatically cancelled.

Mental image: three people must all finish their assigned tasks before the team can declare success.

### 12.3 `Promise.allSettled()`

Use it when you need the outcome of every operation, even if some fail.

```
const results = await Promise.allSettled([
  Promise.resolve("Success"),
  Promise.reject("Failure"),
  Promise.resolve("Another success")
]);

console.log(results);
```

The results look like:

```
[
  { status: "fulfilled", value: "Success" },
  { status: "rejected", reason: "Failure" },
  { status: "fulfilled", value: "Another success" }
]
```

Mental image: every team member must report back, whether they succeeded or failed.

### 12.4 `Promise.race()`

Use it when the first settled result determines the outcome.

```
const result = await Promise.race([
  new Promise(resolve => setTimeout(() => resolve("Slow"), 1000)),
  new Promise(resolve => setTimeout(() => resolve("Fast"), 100))
]);

console.log(result); // Fast
```

Mental image: the first runner to cross the finish line wins, even if that runner reports a failure.

### 12.5 `Promise.any()`

Use it when the first successful result is enough.

```
const result = await Promise.any([
  Promise.reject("Server A failed"),
  Promise.resolve("Server B succeeded"),
  Promise.resolve("Server C succeeded")
]);

console.log(result); // Server B succeeded
```

If every input rejects, `Promise.any()` rejects with an `AggregateError` containing the rejection reasons.

Mental image: you have three possible delivery services. You only need one successful delivery.

### Comparison to memorize

| Method         | When does the returned promise fulfill? | If an input rejects                            |
| -------------- | --------------------------------------- | ---------------------------------------------- |
| `all()`        | All inputs fulfill                      | Rejects                                        |
| `allSettled()` | All inputs settle                       | Reports the rejection                          |
| `race()`       | First input settles successfully        | Rejects if the first settlement is a rejection |
| `any()`        | First input fulfills                    | Only rejects if all inputs reject              |

### Instance methods

- `.then(onFulfilled, onRejected)` — handles fulfillment and optionally rejection, returning a new promise.
- `.catch(onRejected)` — handles rejection; equivalent in purpose to `.then(undefined, onRejected)`.
- `.finally(onFinally)` — runs cleanup after settlement, regardless of success or failure. Its return value normally passes through, but a thrown error or rejected promise from the cleanup can change the outcome.

Example:

```
fetch("/api/data")
  .then(response => response.json())
  .catch(error => {
    console.error("Request failed:", error);
  })
  .finally(() => {
    console.log("Request finished");
  });
```

`fetch()` itself does not reject just because the server returns an HTTP error such as 404; check `response.ok` when you need to treat HTTP errors as failures.

### Likely follow-up questions

- What is the difference between `Promise.all()` and `Promise.allSettled()`?
- What is the difference between `Promise.race()` and `Promise.any()`?
- What does `Promise.any()` return if every promise rejects?
- Does `Promise.all()` cancel the other operations when one fails?
- What happens if `.finally()` throws an error?
- How do empty iterables behave with each static method?

## 13. Explain `async` functions and `await`. ★★★

### Definition — interview answer

An `async` function always returns a promise. The `await` operator pauses the continuation of the surrounding async function until the awaited value is settled, then resumes with the fulfillment value or throws the rejection reason into the async function.

Importantly, `await` does not block the entire JavaScript thread while waiting.

### Example

```
function getUser() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ name: "Himanshu" });
    }, 1000);
  });
}

async function showUser() {
  console.log("Fetching user...");

  const user = await getUser();

  console.log(user.name);
}

showUser();
console.log("Other code");
```

Output:

```
Fetching user...
Other code
Himanshu
```

### Mental model

Imagine you are cooking while waiting for water to boil.

- You start heating the water.
- You mark the next cooking step as waiting for it.
- You do other useful things while the water heats.
- When it is ready, you resume from the waiting step.

`await` pauses that function's continuation, not all JavaScript execution.

### Error handling

```
async function loadData() {
  try {
    const response = await fetch("/api/data");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed:", error.message);
    throw error;
  }
}
```

The `try/catch` handles errors thrown during awaited operations. Rethrowing means callers still receive a rejected promise.

### Sequential versus concurrent execution

Sequential:

```
const user = await getUser();
const orders = await getOrders();
```

The second operation starts only after the first one finishes, assuming `getOrders()` is called at that point.

Concurrent:

```
const userPromise = getUser();
const ordersPromise = getOrders();

const [user, orders] = await Promise.all([
  userPromise,
  ordersPromise
]);
```

Here, both operations are started before awaiting their combined result, assuming each function starts its operation when called.

### Likely follow-up questions

- Does an async function always return a promise?
- What happens if an async function returns a plain number?
- Does `await` block the main thread?
- How do you handle errors with `async/await`?
- How do you run independent async operations concurrently?
- What is the difference between sequential `await` and `Promise.all()`?

## Part 3: Practical JavaScript, functions and polyfills

## 14. Explain debouncing and throttling. ★★★

### Definition — interview answer

Debouncing delays a function's execution until a specified period has passed without another triggering event.

Throttling limits how frequently a function can execute during repeated events, typically allowing execution at most once per specified interval.

### Debouncing example

Imagine a search box. The user types `javascript`, producing several input events. You don't want to send a request for every character. Instead, wait until the user stops typing for 300 milliseconds.

```
function debounce(callback, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

const search = debounce((query) => {
  console.log("Searching for:", query);
}, 300);
```

Every new call resets the timer. The callback runs only after the quiet period.

### Throttling example

Imagine a user scrolling a long page. You want to update some expensive scroll-related calculation no more than once every 200 milliseconds.

```
function throttle(callback, delay) {
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastRun >= delay) {
      lastRun = now;
      callback.apply(this, args);
    }
  };
}
```

This is a basic leading-edge throttle. It may skip the final event after scrolling stops, and it is not a complete implementation of every possible throttling behavior.

### Mental model

Debounce — wait for silence

Every new event resets the countdown. Run after the events stop.

Type

Type

Type

Wait

Run

Throttle — limit the rate

Repeated events occur, but the callback runs only at allowed intervals.

Run

Skip

Skip

Run

Skip

### Real-world use cases

| Debouncing                          | Throttling                        |
| ----------------------------------- | --------------------------------- |
| Search input                        | Scroll handler                    |
| Validating after typing stops       | Mouse movement tracking           |
| Autosaving after editing pauses     | Rate-limiting resize calculations |
| Waiting for a user to stop resizing | Repeated position updates         |

### Likely follow-up questions

- What is the difference between debounce and throttle?
- What does `clearTimeout()` do?
- Why use `callback.apply(this, args)`?
- What is leading-edge versus trailing-edge execution?
- How would you cancel a debounced callback?
- Why might `requestAnimationFrame()` be useful for visual updates?

## 15. Explain polyfills. ★★★

### Definition — interview answer

A polyfill is code that provides a feature or API in an environment where that feature is not natively available. It allows developers to use a consistent interface across supported environments.

### Example

Suppose an old browser does not support a particular method. A polyfill can provide an implementation that approximates the standardized behavior.

A simple illustrative example:

```
if (!Array.prototype.myIncludes) {
  Array.prototype.myIncludes = function (value) {
    return this.indexOf(value) !== -1;
  };
}
```

This is only an illustration, not a fully correct polyfill for `Array.prototype.includes()`. In particular, `indexOf()` and `includes()` differ in their handling of `NaN` and sparse arrays.

### Mental model

Imagine a phone that doesn't have a built-in calculator. You install an application that supplies the missing functionality so you can perform the same task.

### Important details

- A polyfill implements a missing API.
- A transpiler converts newer syntax into syntax supported by older environments; it is not the same thing as a polyfill.
- A polyfill should follow the relevant specification as closely as possible.
- Adding properties directly to built-in prototypes can create compatibility issues if done carelessly.

### Likely follow-up questions

- What is the difference between a polyfill and a transpiler?
- Why do we feature-detect APIs before installing polyfills?
- What are the risks of modifying built-in prototypes?
- Why is `indexOf()` not a perfect implementation of `includes()`?
- How can you check browser support for a feature?

## 16. Write polyfills for common JavaScript methods. ★★★

This question tests whether you understand the behavior behind familiar APIs, not just their syntax.

Interview note: The following are educational implementations for ordinary inputs. Some edge cases in the ECMAScript specification—such as every proxy trap, cross-realm behavior, property descriptors, and every abrupt-completion rule—are intentionally not fully reproduced. For a production-grade polyfill, match the specification and test those cases.

### 16.1 Polyfill for `Promise.all()`

Expected behavior: Fulfill with results in input order when all inputs fulfill; reject when an input rejects.

```
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    let items;

    try {
      items = Array.from(iterable);
    } catch (error) {
      reject(error);
      return;
    }

    const results = new Array(items.length);
    let completed = 0;

    if (items.length === 0) {
      resolve([]);
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        value => {
          results[index] = value;
          completed++;

          if (completed === items.length) {
            resolve(results);
          }
        },
        reject
      );
    });
  });
}
```

Example:

```
myPromiseAll([
  Promise.resolve(10),
  20,
  Promise.resolve(30)
]).then(console.log);

// [10, 20, 30]
```

How to imagine it: Three workers report back. Their results are stored in their assigned positions, not in the order they finish. Once every worker succeeds, the combined result is delivered.

### 16.2 Polyfill for `Promise.allSettled()`

Expected behavior: Wait for every input to settle and return an outcome object for each input.

```
function myPromiseAllSettled(iterable) {
  return Promise.all(
    Array.from(iterable, item =>
      Promise.resolve(item).then(
        value => ({
          status: "fulfilled",
          value
        }),
        reason => ({
          status: "rejected",
          reason
        })
      )
    )
  );
}
```

Example:

```
myPromiseAllSettled([
  Promise.resolve("OK"),
  Promise.reject("Failed")
]).then(console.log);
```

The rejection is converted into an ordinary result object, so the outer `Promise.all()` can fulfill once all outcomes are collected.

### 16.3 Polyfill for `Array.prototype.map()`

```
Array.prototype.myMap = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array is null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const array = Object(this);
  const length = array.length >>> 0;
  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    if (i in array) {
      result[i] = callback.call(thisArg, array[i], i, array);
    }
  }

  return result;
};
```

Example:

```
[1, 2, 3].myMap(n => n * 2);
// [2, 4, 6]
```

`map()` creates a new array and transforms each existing indexed element. It does not normally change the original array.

### 16.4 Polyfill for `Array.prototype.filter()`

```
Array.prototype.myFilter = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array is null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const array = Object(this);
  const length = array.length >>> 0;
  const result = [];

  for (let i = 0; i < length; i++) {
    if (i in array) {
      const value = array[i];

      if (callback.call(thisArg, value, i, array)) {
        result.push(value);
      }
    }
  }

  return result;
};
```

Example:

```
[1, 2, 3, 4].myFilter(n => n % 2 === 0);
// [2, 4]
```

Imagine a security checkpoint: only elements that satisfy the condition pass through into the new array.

### 16.5 Polyfill for `Array.prototype.includes()`

```
Array.prototype.myIncludes = function (searchElement, fromIndex = 0) {
  if (this == null) {
    throw new TypeError("Array is null or undefined");
  }

  const array = Object(this);
  const length = array.length >>> 0;

  if (length === 0) return false;

  let start = Number(fromIndex);

  if (Number.isNaN(start)) start = 0;

  start = Math.trunc(start);

  if (start >= length) return false;

  let index = start >= 0 ? start : Math.max(length + start, 0);

  for (; index < length; index++) {
    if (
      array[index] === searchElement ||
      (Number.isNaN(array[index]) && Number.isNaN(searchElement))
    ) {
      return true;
    }
  }

  return false;
};
```

Example:

```
[1, 2, NaN].myIncludes(NaN); // true
```

Unlike `indexOf()`, `includes()` can find `NaN`. It also treats missing array positions as `undefined` when searching those positions.

### 16.6 Polyfill for `Object.prototype.hasOwnProperty()`

This method checks whether a property belongs directly to an object rather than being inherited from its prototype.

```
function myHasOwnProperty(object, property) {
  if (object == null) {
    throw new TypeError("Cannot convert null or undefined");
  }

  return Object.prototype.hasOwnProperty.call(
    Object(object),
    property
  );
}
```

Example:

```
const user = { name: "Himanshu" };

myHasOwnProperty(user, "name");     // true
myHasOwnProperty(user, "toString"); // false
```

Why not use `object.hasOwnProperty(property)` directly?

The object might override that method or have no prototype:

```
const data = Object.create(null);
data.name = "Aman";

// data.hasOwnProperty is undefined
```

Using the built-in method with `.call()` avoids that particular problem. Modern JavaScript also offers `Object.hasOwn()`.

### 16.7 Polyfill for `Array.prototype.find()`

```
Array.prototype.myFind = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Array is null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const array = Object(this);
  const length = array.length >>> 0;

  for (let i = 0; i < length; i++) {
    const value = array[i];

    if (callback.call(thisArg, value, i, array)) {
      return value;
    }
  }

  return undefined;
};
```

Example:

```
[4, 7, 10, 13].myFind(n => n > 8);
// 10
```

`find()` returns the first matching element, or `undefined` if no element matches. Unlike `map()` and `filter()`, it visits empty array slots as if their values were `undefined`.

### Polyfill comparison to remember

| Method                 | What it returns                         |
| ---------------------- | --------------------------------------- |
| `map()`                | New array with transformed elements     |
| `filter()`             | New array containing matching elements  |
| `find()`               | First matching element or `undefined`   |
| `includes()`           | Boolean                                 |
| `hasOwnProperty()`     | Boolean                                 |
| `Promise.all()`        | Promise of ordered values, or rejection |
| `Promise.allSettled()` | Promise of all outcome objects          |

### Likely follow-up questions

- Why does `Promise.all()` preserve input order?
- Why do we use `Promise.resolve()` for each item?
- Why does `map()` preserve holes in sparse arrays?
- What is the difference between `find()` and `filter()`?
- What is the difference between `includes()` and `indexOf()`?
- Why is `hasOwnProperty()` potentially unsafe when called directly on an object?
- What is the time complexity of each array method?
- What specification edge cases would you test before shipping a polyfill?

## 17. Create a custom function for `setInterval()`. ★★

### Definition — interview answer

A custom interval function repeatedly executes a callback after a specified delay. One educational approach is to schedule the next timeout only after the current callback finishes. This is different from a native interval, which uses repeating timer scheduling.

### Example

```
function mySetInterval(callback, delay, ...args) {
  let active = true;
  let timerId;

  function run() {
    if (!active) return;

    callback(...args);

    if (active) {
      timerId = setTimeout(run, delay);
    }
  }

  timerId = setTimeout(run, delay);

  return function cancel() {
    active = false;
    clearTimeout(timerId);
  };
}
```

Usage:

```
const cancel = mySetInterval(() => {
  console.log("Hello");
}, 1000);

// Stop it later:
cancel();
```

### Mental model

Imagine a person ringing a bell, then waiting one second after finishing before ringing it again. The next cycle is scheduled after the previous callback completes.

This implementation also allows cancellation through the returned function.

### Important detail

This is a recursive-timeout implementation, not an exact replacement for the native `setInterval()`. If the callback takes a long time, the effective interval between callback starts becomes longer than the requested delay.

### Likely follow-up questions

- What is the difference between `setInterval()` and recursive `setTimeout()`?
- Why should repeating timers be cancellable?
- What happens if a callback takes longer than the interval?
- How would you handle errors thrown by the callback?
- Why might a browser throttle timers in inactive tabs?

## Part 4: Scope, events and function behavior

## 18. What is variable scope in JavaScript? ★★★

### Definition — interview answer

Scope determines where a variable or binding can be accessed in JavaScript. The main types are global scope, function scope, and block scope.

- `var` is function-scoped, or globally scoped in certain top-level script contexts.
- `let` and `const` are block-scoped.
- Function parameters and local declarations are accessible within their relevant function scopes.
- JavaScript resolves variables using lexical scope rules.

### Example

```
var globalVar = "Global";

function example() {
  var functionVar = "Function";

  if (true) {
    let blockVar = "Block";
    console.log(functionVar); // Function
    console.log(blockVar);    // Block
  }

  console.log(functionVar); // Function
  console.log(blockVar);    // ReferenceError
}

example();
console.log(globalVar); // Global
```

### Mental model

Imagine a building:

- Global scope: the lobby, accessible from many areas.
- Function scope: a private office.
- Block scope: a room inside the office that has restricted access.

A variable's scope determines where it can be accessed, not how long the source code is.

### Important detail: block scope versus function scope

```
if (true) {
  var a = 1;
  let b = 2;
}

console.log(a); // 1
console.log(b); // ReferenceError
```

The `var` declaration is not limited to the `if` block. The `let` declaration is.

### Likely follow-up questions

- What is the difference between global, function, and block scope?
- Why is `var` not block-scoped?
- What is variable shadowing?
- What is the scope of a variable declared inside a loop?
- What are the risks of global variables?
- How is scope related to closures?

## 19. Explain event delegation, propagation, bubbling and capturing. ★★★

These are connected concepts, but they are not interchangeable.

### Definition — interview answer

Event propagation is the process by which a DOM event travels through relevant elements.

- Capturing phase: the event travels from the outer ancestors toward the target.
- Target phase: the event reaches the target element.
- Bubbling phase: the event travels back up through ancestors, for events that bubble.

Event delegation is a technique where a listener is placed on a common ancestor and handles events originating from matching descendants. It commonly uses bubbling.

### Example: bubbling

```
<div id="parent">
  <button id="child">Click me</button>
</div>
```

```
document.querySelector("#parent").addEventListener("click", () => {
  console.log("Parent");
});

document.querySelector("#child").addEventListener("click", () => {
  console.log("Child");
});
```

Clicking the button produces:

```
Child
Parent
```

The event reaches the button first and then bubbles up to the parent.

### Example: capturing

```
document.querySelector("#parent").addEventListener(
  "click",
  () => console.log("Parent capture"),
  { capture: true }
);

document.querySelector("#child").addEventListener("click", () => {
  console.log("Child target");
});
```

For a click on the child, the parent's capturing listener runs before the target's listener.

### Example: event delegation

```
<ul id="products">
  <li data-id="101">Product A</li>
  <li data-id="102">Product B</li>
  <li data-id="103">Product C</li>
</ul>
```

```
document.querySelector("#products").addEventListener("click", event => {
  const item = event.target.closest("li[data-id]");

  if (!item || !event.currentTarget.contains(item)) return;

  console.log("Selected product:", item.dataset.id);
});
```

You use one listener on the list rather than adding a separate listener to every product. Newly inserted matching list items can also be handled without attaching individual listeners to them.

### Mental model

Imagine a school announcement:

- Capturing: the announcement passes through school management before reaching a classroom.
- Target: the message reaches the intended student.
- Bubbling: the information travels back up the chain.
- Delegation: the class teacher handles requests from any student instead of assigning a separate administrator to each student.

### Important details

- Not every DOM event bubbles.
- `event.target` identifies the original event target, while `event.currentTarget` identifies the element whose listener is currently running.
- `stopPropagation()` stops further propagation, but does not automatically stop other listeners on the same element.
- `stopImmediatePropagation()` also prevents later listeners on the same element from running.
- `preventDefault()` prevents a cancelable default action; it does not stop propagation.
- In delegation, `closest()` helps handle clicks on nested elements such as icons inside buttons.

### Likely follow-up questions

- What is the difference between `target` and `currentTarget`?
- What is the difference between `stopPropagation()` and `preventDefault()`?
- Why is event delegation useful for dynamic lists?
- Do all DOM events bubble?
- What is the third argument of `addEventListener()`?
- How can you delegate events when the clicked element is nested inside another element?

## 20. Explain closures. ★★★

### Definition — interview answer

A closure is a function together with access to its surrounding lexical environment. It allows the function to access variables from the scope in which it was created, even after that outer function has finished executing.

### Example

```
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

`createCounter()` has finished executing, but the returned function can still access and modify `count`.

### Mental model

Imagine that a function leaves home carrying a backpack. Inside the backpack is access to the variables it needs from the environment where it was created.

The function does not need the outer function to remain on the call stack. Its captured lexical environment remains accessible.

### Real-world use case: private state

```
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },

    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);

account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);      // undefined
```

The `balance` binding is not exposed as a property of the returned object. The methods access it through their closure.

### Classic interview trap: closures in loops

Using `var`:

```
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Output:

```
3
3
3
```

All callbacks close over the same function-scoped `i` binding. By the time they run, the loop has finished and `i` is `3`.

Using `let`:

```
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Output:

```
0
1
2
```

A `let` declaration in a `for` loop creates per-iteration bindings, allowing each callback to access its own iteration's value.

### Likely follow-up questions

- What is a closure and why does it work after the outer function returns?
- How are closures related to lexical scope?
- What are practical uses of closures?
- How do closures provide private state?
- Can closures cause memory leaks?
- Why does the `var` loop example print `3` three times?
- How does garbage collection interact with closures?

## 21. Explain constructor functions. ★★

### Definition — interview answer

A constructor function is a function intended to create and initialize objects when invoked with the `new` operator. It typically assigns instance properties through `this`, and methods can be shared through the constructor's `prototype`.

### Example

```
function User(name, age) {
  this.name = name;
  this.age = age;
}

User.prototype.greet = function () {
  return `Hi, I am ${this.name}`;
};

const user1 = new User("Aman", 25);
const user2 = new User("Priya", 23);

console.log(user1.greet()); // Hi, I am Aman
console.log(user2.greet()); // Hi, I am Priya
```

### What does `new` do?

For an ordinary constructor function, `new` approximately:

1. Creates a new object.
2. Links that object to the constructor's `prototype`.
3. Calls the constructor with `this` referring to the new object.
4. Returns the new object, unless the constructor explicitly returns a non-primitive object.

### Mental model

Imagine a cookie cutter. The constructor defines how to shape each cookie, while each call to `new` produces a separate object with its own instance data.

The prototype is like a shared toolbox that every object created by the constructor can access.

### Important detail

Without `new`, an ordinary function does not automatically create a new instance:

```
function User(name) {
  this.name = name;
}

const user = User("Aman"); // In strict mode, this throws a TypeError
```

Do not confuse constructor functions with classes. JavaScript classes also use `new`, but class constructors cannot be called as ordinary functions.

### Likely follow-up questions

- What happens internally when we use `new`?
- What is the difference between instance properties and prototype properties?
- What happens if a constructor explicitly returns an object?
- How do constructor functions differ from ES6 classes?
- Why should we use `new` with a constructor function?

## 22. Explain classes in JavaScript. ★★★

### Definition — interview answer

A JavaScript class is syntax for defining objects with constructors, instance methods, static methods, and inheritance. Classes use JavaScript's prototype-based object model while providing a more structured syntax.

### Example

```
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }

  static describe() {
    return "A user account";
  }
}

const user = new User("Himanshu");

console.log(user.greet());      // Hello, Himanshu
console.log(User.describe());   // A user account
```

### Mental model

Imagine a blueprint for a user account:

- `constructor()` initializes each new instance.
- Instance methods describe behavior available to each instance through the prototype.
- Static methods belong to the class itself, rather than ordinary instances.

### Inheritance

```
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog("Bruno");

console.log(dog.speak()); // Bruno barks
```

`extends` establishes inheritance. The `Dog` method overrides the inherited `speak()` method.

If a derived class defines its own constructor, it generally must call `super()` before accessing `this`.

### Important details

- Class bodies execute in strict mode.
- Class declarations are subject to a TDZ before initialization.
- Class methods are generally non-enumerable properties on the prototype.
- Class syntax does not replace prototypes; it uses them.
- JavaScript does not have classical inheritance in exactly the same sense as languages such as Java.

### Likely follow-up questions

- What is the difference between a class and a constructor function?
- What is the role of `constructor()`?
- What is `super()`?
- What is method overriding?
- What is the difference between static and instance methods?
- How does prototype inheritance work behind classes?

## Part 5: OOP, execution context and lexical scope

## 23. Explain OOP concepts with examples and real-world scenarios. ★★★

### Definition — interview answer

Object-oriented programming (OOP) is a programming paradigm that organizes code around objects containing data and behavior. JavaScript supports OOP through objects, prototypes, and class syntax.

The four commonly discussed OOP principles are encapsulation, abstraction, inheritance, and polymorphism.

### 23.1 Encapsulation

Definition: Encapsulation groups related data and behavior together and controls how that data can be accessed or modified.

Example:

```
class BankAccount {
  #balance = 0;

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();

account.deposit(1000);

console.log(account.getBalance()); // 1000
console.log(account.#balance);     // SyntaxError
```

The `#balance` field is private to the class. External code cannot access it directly.

Mental model: Your bank account allows deposits and withdrawals through authorized operations, rather than allowing anyone to edit the bank's internal balance directly.

### 23.2 Abstraction

Definition: Abstraction exposes the essential operations of a system while hiding unnecessary implementation details.

Example:

```
class PaymentService {
  pay(amount) {
    this.validate(amount);
    return this.processPayment(amount);
  }

  validate(amount) {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
  }

  processPayment(amount) {
    return `Processed payment of ${amount}`;
  }
}

const payment = new PaymentService();
console.log(payment.pay(500));
```

A caller can use `pay(500)` without needing to know every internal step.

Mental model: When you use an ATM, you choose to withdraw money. You don't need to understand every internal banking system operation to perform that action.

Important distinction: Abstraction is a design principle, not merely the act of making a property private.

### 23.3 Inheritance

Definition: Inheritance allows one class to derive from another, reuse its behavior, and extend or override that behavior.

```
class Employee {
  constructor(name) {
    this.name = name;
  }

  work() {
    return `${this.name} is working`;
  }
}

class Developer extends Employee {
  writeCode() {
    return `${this.name} is writing code`;
  }
}

const developer = new Developer("Himanshu");

console.log(developer.work());
console.log(developer.writeCode());
```

Output:

```
Himanshu is working
Himanshu is writing code
```

Mental model: A developer is a type of employee. The developer has general employee behavior plus specialized behavior.

### 23.4 Polymorphism

Definition: Polymorphism allows a common interface or operation to behave differently depending on the object implementing it.

```
class Dog {
  speak() {
    return "Woof!";
  }
}

class Cat {
  speak() {
    return "Meow!";
  }
}

function makeSound(animal) {
  console.log(animal.speak());
}

makeSound(new Dog()); // Woof!
makeSound(new Cat()); // Meow!
```

`makeSound()` does not need separate logic for each animal. Each object provides its own implementation of `speak()`.

Mental model: Different payment providers may all expose a `pay()` operation, but one might process a card payment while another processes a UPI payment.

### Bringing OOP together

Imagine you're building an e-commerce application:

| Principle     | Possible implementation                                          |
| ------------- | ---------------------------------------------------------------- |
| Encapsulation | Keep sensitive order state controlled through methods            |
| Abstraction   | Expose `checkout()` without exposing every internal step         |
| Inheritance   | Specialized account types inherit common account behavior        |
| Polymorphism  | Different payment providers implement a common payment operation |

### Important interview nuance

JavaScript also supports composition: combining small objects or functions to build behavior. In real-world applications, composition can be preferable to deep inheritance hierarchies.

### Likely follow-up questions

- What is the difference between abstraction and encapsulation?
- What is the difference between inheritance and composition?
- Does JavaScript support multiple inheritance?
- What is method overriding?
- Does JavaScript support method overloading like Java?
- How do private class fields differ from ordinary properties?
- What is the difference between an object and a class?

## 24. Explain execution context and the call stack. ★★★

### Definition — interview answer

An execution context is the environment in which JavaScript code is evaluated. It contains information required to execute the code, including its lexical environment, variable bindings, and relevant execution state.

The call stack is the last-in, first-out (LIFO) structure that tracks the active execution contexts and function calls.

JavaScript creates a global execution context for the program and creates function execution contexts when functions are invoked. Modules and other execution environments have additional details, but this model is sufficient for many interviews.

### Example

```
function first() {
  console.log("First starts");
  second();
  console.log("First ends");
}

function second() {
  console.log("Second starts");
  third();
  console.log("Second ends");
}

function third() {
  console.log("Third");
}

first();
```

Output:

```
First starts
Second starts
Third
Second ends
First ends
```

### Visualizing the call stack

At the deepest point, when `third()` is executing:

third()

Top

Currently executing

second()

Waiting for third() to return

first()

Waiting for second() to return

Global execution context

After `third()` returns, its context is removed. Execution resumes in `second()`, then in `first()`.

### Mental model

Imagine a stack of plates:

- Calling a function adds a plate to the top.
- Calling another function adds another plate.
- Returning from a function removes the top plate.
- JavaScript resumes the function below it.

That is why deeply nested synchronous function calls can cause a stack overflow.

### What happens when JavaScript executes a function?

For a useful interview-level model:

1. JavaScript evaluates the call.
2. A function execution context is established.
3. Its parameters, local bindings, and relevant scope information become available.
4. The function executes.
5. When it returns or completes abruptly, its active context is removed from the call stack.
6. Execution resumes at the caller.

The creation and initialization rules for variables depend on their declaration types, as discussed in hoisting and the TDZ.

### A common interview trap: asynchronous callbacks

```
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```
A
C
B
```

The timer callback does not remain on the call stack while the timer waits. The current synchronous execution finishes first, and the callback runs later when its task can be processed.

### Execution context versus call stack

| Execution context                      | Call stack                                            |
| -------------------------------------- | ----------------------------------------------------- |
| Environment required to execute code   | Structure tracking active calls                       |
| Contains scope and binding information | Records which execution is currently active           |
| Created for relevant code execution    | Pushes and pops active contexts as execution proceeds |

### Likely follow-up questions

- What is an execution context?
- What is the difference between the creation phase and execution phase?
- How is the call stack related to recursion?
- What causes a stack overflow?
- What is the difference between the call stack and the event loop?
- Where do local variables and closures fit into execution contexts?
- What happens to a function's local variables after it returns?

## 25. What is lexical scope, and how does JavaScript resolve variable lookups? ★★★

### Definition — interview answer

Lexical scope means that the accessibility of variables is determined by where functions and blocks are written in the source code, rather than by where functions are called.

When JavaScript encounters a variable reference, it searches the relevant lexical environment for a binding. If it cannot find the binding there, it searches the outer lexical environment, continuing outward until it finds the binding or reaches the outermost environment. If no binding exists, it generally throws a `ReferenceError`.

This outward search is commonly called the scope chain.

### Example

```
const name = "Global";

function outer() {
  const name = "Outer";

  function inner() {
    const message = "Hello";

    console.log(message);
    console.log(name);
  }

  inner();
}

outer();
```

Output:

```
Hello
Outer
```

Why does `inner()` print `"Outer"` rather than `"Global"`?

JavaScript searches for `name` from the scope where `inner` was defined. The nearest matching binding is in `outer()`.

### Mental model

Imagine a person looking for a book:

1. Check their own room.
2. If it isn't there, check the parent's room.
3. If it still isn't there, check the next outer room.
4. Stop when the book is found or there are no more rooms.

JavaScript does not search every function that happens to be calling the current function. It follows the lexical structure.

### The classic lexical-scope interview question

```
const value = "global";

function outer() {
  const value = "outer";

  return function inner() {
    console.log(value);
  };
}

const fn = outer();

function anotherFunction() {
  const value = "another";
  fn();
}

anotherFunction();
```

Output:

```
outer
```

Why?

The function `inner` was defined inside `outer`. It retains access to `outer`'s lexical environment. Calling it from `anotherFunction()` does not change where its variable lookup starts.

This example demonstrates both lexical scope and closures.

### Shadowing

An inner binding can have the same name as an outer binding:

```
const color = "blue";

function showColor() {
  const color = "red";
  console.log(color);
}

showColor();       // red
console.log(color); // blue
```

The inner `color` shadows the outer one within its scope.

### Important distinction: lexical scope versus dynamic scope

JavaScript uses lexical scoping for ordinary variable lookup.

- Lexical scope: determined by where the function is defined.
- Dynamic scope: conceptually determined by the runtime call chain.

The second model is not how ordinary JavaScript variable references work.

### Likely follow-up questions

- What is a scope chain?
- How is lexical scope related to closures?
- What is variable shadowing?
- Does calling a function from a different scope change its lexical scope?
- What happens when a variable cannot be found in any outer scope?
- What is the difference between lexical scope and dynamic scope?
- How do `this` and lexical scope differ?
- Why does a nested function retain access to outer variables?

# Final revision: How these 25 questions connect

The most effective way to prepare is to understand the connections between concepts, because interviewers often move from one topic to another.

1\. Execution and variable behavior

Hoisting → TDZ → Scope → Lexical scope → Execution context → Call stack

These concepts explain how JavaScript establishes bindings, resolves variables, and executes functions.

2\. Asynchronous behavior

Synchronous vs asynchronous → Event loop → Tasks and microtasks → Callbacks → Promises → Promise chaining → async/await

These concepts explain how JavaScript handles work that finishes later.

3\. Function behavior and practical techniques

Closures → Debouncing and throttling → Custom intervals → Polyfills

These concepts test whether you can apply JavaScript fundamentals to real problems.

4\. Objects and the DOM

Proxies → Constructor functions → Classes → OOP → Event propagation and delegation

These concepts help you explain how applications structure data, reuse behavior, and handle user interactions.

## How to practise for interviews

For each question, try to answer in this order:

1. Definition: Explain the concept in 2–4 sentences without reading.
2. Example: Write a small code snippet and predict the output.
3. Reasoning: Explain why the output occurs, step by step.
4. Trade-off or use case: Explain when the concept is useful and any limitations.
5. Follow-ups: Answer the likely follow-up questions listed under that topic.

Pay special attention to these high-value interview traps:

- `var` versus `let` and `const`, including hoisting and TDZ.
- `==` versus `===` and type coercion.
- Promise microtasks versus timer tasks.
- `Promise.all()` versus `allSettled()`, `race()`, and `any()`.
- Returning a value from `.then()`.
- Sequential `await` versus concurrent operations.
- Event bubbling versus capturing versus delegation.
- Closures and the `var` loop problem.
- Lexical scope versus the call stack.
- Prototype inheritance versus class syntax.