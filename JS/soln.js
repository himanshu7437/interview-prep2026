// # JAVASCRIPT

// 1. What is hoisting ***

// histing - variables, functions 

// console.log(a);
// greet();

// var a = 10;

// function greet() {
//   console.log("Hello!");
// }

// 2. Does let, const are also hoisted ***

// console.log(a); // ReferenceError
// let a = 10;

// console.log(b); // ReferenceError
// const b = 20;

// 3. Explain Temporal Dead Zone (TDZ) ***

// {
//   // TDZ begins for age
//   console.log(age); // ReferenceError

//   let age = 25;     // TDZ ends for age

//   console.log(age); // 25
// }

// 4. Difference between == & === ***

// == eqaulity operator 
// === strict equlaity operator

// console.log(5 == "5");  // true
// console.log(5 === "5"); // false

// console.log(0 == false);  // true
// console.log(0 === false); // false

// 5. What is sync code and async code ***

// console.log("A");
// console.log("B");
// console.log("C");

//output 
// A
// B
// C

// console.log("A");

// setTimeout(() => {
//   console.log("A");
// }, 1000);
// setTimeout(() => {
//   console.log("B");
// }, 1000);
// setTimeout(() => {
//   console.log("C");
// }, 1000);

// output 
// A
// C
// B

// 6. Explain event loop in browswer ***

// diagram - https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif

// console.log("1");

// setTimeout(() => {
//   console.log("2");
// }, 0);

// Promise.resolve().then(() => {
//   console.log("3");
// });

// console.log("4");


// 7. Expliain starvation of function in callback queue **


// function keepRunning() {
//   queueMicrotask(keepRunning);
// }

// keepRunning();

// setTimeout(() => {
//   console.log("Timer executed");
// }, 0);

// 8. Explain proxy in object **

// const user = {
//   name: "Himanshu",
//   age: 24
// };

// const proxyUser = new Proxy(user, {
//   get(target, property, receiver) {
//     console.log(`Reading: ${String(property)}`);
//     return Reflect.get(target, property, receiver);
//   },

//   set(target, property, value, receiver) {
//     if (property === "age" && value < 0) {
//       throw new Error("Age cannot be negative");
//     }

//     return Reflect.set(target, property, value, receiver);
//   }
// });

// console.log(proxyUser.name); // Logs Reading: name, then Himanshu

// proxyUser.age = 25; // Allowed
// proxyUser.age = -1; // Error

// 9. Explain callback hell ***

// callbacks 

// async1
// async2 --> 1
// async3 --> 2


// promise

// // Simulating an asynchronous database fetch
// const getUser = (id) => Promise.resolve({ id: id, name: "Alice" });
// const getPosts = (userId) => Promise.resolve(["Post 1", "Post 2"]);
// const getComments = (postId) => Promise.resolve(["Comment A", "Comment B"]);

// // ❌ PROMISE HELL: Nested, hard to read, hard to catch errors
// getUser(1).then((user) => {
//   console.log("User:", user.name);
  
//   getPosts(user.id).then((posts) => {
//     console.log("Posts:", posts);
    
//     getComments(posts[0]).then((comments) => {
//       console.log("Comments:", comments[0]);
//       // Continuous indentation rightwards...
//     }).catch(err => console.error("Error fetching comments", err));
    
//   }).catch(err => console.error("Error fetching posts", err));
  
// }).catch(err => console.error("Error fetching user", err));


// Callback hell (also known as the Pyramid of Doom) is a situation in JavaScript where multiple asynchronous operations depend on one another, leading to deeply nested callback functions

// Simulating API calls with setTimeout
// function selectProduct(productId, callback) {
//     setTimeout(() => {
//         console.log(`Product ${productId} selected.`);
//         callback(productId);
//     }, 1000);
// }

// function createOrder(productId, callback) {
//     setTimeout(() => {
//         console.log(`Order created for product ${productId}.`);
//         callback("ORDER_12345");
//     }, 1000);
// }

// function processPayment(orderId, callback) {
//     setTimeout(() => {
//         console.log(`Payment processed for order ${orderId}.`);
//         callback(true);
//     }, 1000);
// }

// function sendEmailConfirmation(paymentStatus, callback) {
//     setTimeout(() => {
//         if (paymentStatus) {
//             console.log("Confirmation email sent to user.");
//             callback();
//         }
//     }, 1000);
// }

// // --- CALLBACK HELL / PYRAMID OF DOOM ---
// selectProduct(101, function(productId) {
//     createOrder(productId, function(orderId) {
//         processPayment(orderId, function(paymentStatus) {
//             sendEmailConfirmation(paymentStatus, function() {
//                 console.log("All tasks completed successfully!");
//             });
//         });
//     });
// });

// const fetch = async() => {
//   const userId = await api;
//   const productId = await api(userId);
//   const orderId = await api(productId);
//   const paymentStatus = await api(orderId);
//   if(paymentStatus){
//     console.log("payment successfully");
//   }
// }

// const fetchdata = async() => {
//     const response = await fetch(`xyz`);
//     const data = response.json();
//     console.log(data);
//     user = data;
// }

// 10. Explain promises ***

// const promise = new Promise((resolve, reject) => {
//   const paymentSuccessful = true;

//   if (paymentSuccessful) {
//     resolve("Payment completed");
//   } else {
//     reject(new Error("Payment failed"));
//   }
// });

// promise
//   .then(result => console.log(result))
//   .catch(error => console.error(error.message));


// 11. Explain promise chaining ***

// promise

// // Simulating an asynchronous database fetch
// const getUser = (id) => Promise.resolve({ id: id, name: "Alice" });
// const getPosts = (userId) => Promise.resolve(["Post 1", "Post 2"]);
// const getComments = (postId) => Promise.resolve(["Comment A", "Comment B"]);

// // ❌ PROMISE HELL: Nested, hard to read, hard to catch errors
// getUser(1).then((user) => {
//   console.log("User:", user.name);
  
//   getPosts(user.id).then((posts) => {
//     console.log("Posts:", posts);
    
//     getComments(posts[0]).then((comments) => {
//       console.log("Comments:", comments[0]);
//       // Continuous indentation rightwards...
//     }).catch(err => console.error("Error fetching comments", err));
    
//   }).catch(err => console.error("Error fetching posts", err));
  
// }).catch(err => console.error("Error fetching user", err));


// 12. Explain all methods of promises ***

// Promise.resolve(value) - Creates a promise fulfilled with a value, adopting a promise or thenable when appropriate.
// Promise.reject(reason)	- Creates a rejected promise 
// Promise.all(iterable)	- Fulfills when all inputs fulfill; rejects when an input rejects.

// Promise.all([
//   Promise.resolve(1),
//   Promise.reject("i am rejecting this"),
//   Promise.resolve(3)
// ])
// .then((data) => console.log(data))
// .catch((err) => console.log(err));

// Promise.allSettled(iterable)	- Waits for all inputs to settle and reports every outcome.

// Promise.allSettled([
//   Promise.reject("i am rejecting this"),
//   Promise.reject("i am rejecting this"),
//   Promise.resolve(3)
// ])
// .then((data) => console.log(data))
// .catch((err) => console.log(err));

// Promise.race(iterable) -	Settles with the first input to settle, whether fulfilled or rejected.

// Promise.race([
//   // This now takes 1 second to reject
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject("Promise1"); 
//     }, 1000);
//   }),
//   // This rejects instantly, winning the race if no instant resolve exists
//   Promise.reject("promise2"), 
//   // This resolves instantly
//   Promise.resolve("Promise3") 
// ])
// .then((data) => console.log("Resolved:", data))
// .catch((err) => console.log("Rejected:", err));

// Promise.any(iterable)	- Fulfills with the first successful result; rejects with AggregateError if all inputs reject.

// const result = await Promise.any([
//   Promise.reject("Server A failed"),
//   Promise.resolve("Server B succeeded"),
//   Promise.resolve("Server C succeeded")
// ]);

// console.log(result); // Server B succeeded


// 13. Explain async functions with await ***

// function getUser() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve({ name: "Himanshu" });
//     }, 1000);
//   });
// }

// async function showUser() {
//   console.log("Fetching user...");

//   const user = await getUser();

//   console.log(user.name);
// }

// showUser();
// console.log("Other code");


// 14. Explain debouncing, throttling with example and real time usecase ***

// Debouncing delays a function's execution until a specified period has passed without another triggering event.


// function debounce(callback, delay) {
//   let timer;

//   return function (...args) {
//     clearTimeout(timer);

//     timer = setTimeout(() => {
//       callback.apply(this, args);
//     }, delay);
//   };
// }

// const search = debounce((query) => {
//   console.log("Searching for:", query);
// }, 300);

// // Simulate rapid user input
// search("J");
// search("Ja");
// search("Java");
// search("JavaScript");


// Throttling limits how frequently a function can execute during repeated events, typically allowing execution at most once per specified interval.

// function throttle(callback, delay) {
//   let lastTime = 0;

//   return function (...args) {
//     const now = Date.now();

//     if (now - lastTime >= delay) {
//       lastTime = now;
//       callback.apply(this, args);
//     }
//   };
// }

// const search = throttle((query) => {
//   console.log("Searching for:", query);
// }, 300);

// // Simulate rapid user input
// search("J");
// search("Ja");
// search("Java");
// search("JavaScript");

// setTimeout(() => {
//   search("JavaScript Developer");
// }, 400);


// 15. Explain polyfills ***

// A polyfill is code that provides a feature or API in an environment where that feature is not natively available. It allows developers to use a consistent interface across supported environments.

// let arr = [1, 2, 4, 5];
// console.log(arr.includes(3));

// if(!Array.prototype.myIncludes){
//     Array.prototype.myIncludes = function (value) {
//         return this.indexOf(value) !== -1;
//     }
// }

// console.log(arr.myIncludes(3));


// 16. Create polyfill for Promise.all, Promise.allsettled, map method, filter, includes, hasOwnProperty, find ***

// promise.all

// function myPromiseAll(promises) {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     let completed = 0;

//     if (promises.length === 0) {
//       resolve(results);
//       return;
//     }

//     promises.forEach((promise, index) => {
//       Promise.resolve(promise)
//         .then((value) => {
//           results[index] = value;
//           completed++;

//           if (completed === promises.length) {
//             resolve(results);
//           }
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     });
//   });
// }

// // Testing
// const p1 = Promise.resolve(10);
// const p2 = Promise.resolve(20);
// const p3 = Promise.resolve(30);

// myPromiseAll([p1, p2, p3])
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// Output: [10, 20, 30]

// promise.allsetlled

// function myPromiseAllSettled(iterable) {
//   return Promise.all(
//     Array.from(iterable, item =>
//       Promise.resolve(item).then(
//         value => ({
//           status: "fulfilled",
//           value
//         }),
//         reason => ({
//           status: "rejected",
//           reason
//         })
//       )
//     )
//   );
// }


// promise.map
// Array.prototype.myMap = function (callback, thisArg) {
//   if (this == null) {
//     throw new TypeError("Array is null or undefined");
//   }

//   if (typeof callback !== "function") {
//     throw new TypeError("Callback must be a function");
//   }

//   const array = Object(this);
//   const length = array.length >>> 0;
//   const result = new Array(length);

//   for (let i = 0; i < length; i++) {
//     if (i in array) {
//       result[i] = callback.call(thisArg, array[i], i, array);
//     }
//   }

//   return result;
// };

// promise.filter 

// Array.prototype.myFilter = function (callback, thisArg) {
//   if (this == null) {
//     throw new TypeError("Array is null or undefined");
//   }

//   if (typeof callback !== "function") {
//     throw new TypeError("Callback must be a function");
//   }

//   const array = Object(this);
//   const length = array.length >>> 0;
//   const result = [];

//   for (let i = 0; i < length; i++) {
//     if (i in array) {
//       const value = array[i];

//       if (callback.call(thisArg, value, i, array)) {
//         result.push(value);
//       }
//     }
//   }

//   return result;
// };

// includes

// Array.prototype.myIncludes = function (searchElement, fromIndex = 0) {
//   if (this == null) {
//     throw new TypeError("Array is null or undefined");
//   }

//   const array = Object(this);
//   const length = array.length >>> 0;

//   if (length === 0) return false;

//   let start = Number(fromIndex);

//   if (Number.isNaN(start)) start = 0;

//   start = Math.trunc(start);

//   if (start >= length) return false;

//   let index = start >= 0 ? start : Math.max(length + start, 0);

//   for (; index < length; index++) {
//     if (
//       array[index] === searchElement ||
//       (Number.isNaN(array[index]) && Number.isNaN(searchElement))
//     ) {
//       return true;
//     }
//   }

//   return false;
// };


// has own property 
// function myHasOwnProperty(object, property) {
//   if (object == null) {
//     throw new TypeError("Cannot convert null or undefined");
//   }

//   return Object.prototype.hasOwnProperty.call(
//     Object(object),
//     property
//   );
// }


//find 

// Array.prototype.myFind = function (callback, thisArg) {
//   if (this == null) {
//     throw new TypeError("Array is null or undefined");
//   }

//   if (typeof callback !== "function") {
//     throw new TypeError("Callback must be a function");
//   }

//   const array = Object(this);
//   const length = array.length >>> 0;

//   for (let i = 0; i < length; i++) {
//     const value = array[i];

//     if (callback.call(thisArg, value, i, array)) {
//       return value;
//     }
//   }

//   return undefined;
// };


// 17. Create a custom function for setInterval ***

// function mySetInterval(callback, delay, ...args){
//     let active = true;
//     let timerId;

//     function run(){
//         if(!active) return;

//         callback(...args);

//         if(active){
//             timerId = setTimeout(run, delay);
//         }
//     }

//     timerId = setTimeout(run, delay);

//     return function cancel (){
//         active = false;
//         clearTimeout(timerId);
//     }
// }

// const cancel = mySetInterval(() => {
//     console.log("hiii");
// }, 1000)

// setTimeout(() => {
//     cancel();
// }, 5000)


// 18. What is a Variable Scope in JavaScript ***

// Scope determines where a variable or binding can be accessed in JavaScript.

// var globalVar = "Global";

// function example() {
//   var functionVar = "Function";

//   if (true) {
//     let blockVar = "Block";
//     console.log(functionVar); // Function
//     console.log(blockVar);    // Block
//   }

//   console.log(functionVar); // Function
//   console.log(blockVar);    // ReferenceError
// }

// example();
// console.log(globalVar); // Global

// 1, var - function scope
// 2, let, const - block scope

// for (let i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, 1000);
// }


// 19. Explain event delegation, event propogation, event bubbling, event capturing ***

// Event propagation is the process by which a DOM event travels through relevant elements.
// - Capturing phase: the event travels from the outer ancestors toward the target.
// - Target phase: the event reaches the target element.
// - Bubbling phase: the event travels back up through ancestors, for events that bubble.
// Event delegation is a technique where a listener is placed on a common ancestor and handles events originating from matching descendants. It commonly uses bubbling.


// 20. Explain closure with example ***

// function createBankAccount(initialBalance) {
//   let balance = initialBalance;

//   return {
//     deposit(amount) {
//       balance += amount;
//       return balance;
//     },

//     getBalance() {
//       return balance;
//     }
//   };
// }

// const account = createBankAccount(100);

// account.deposit(50);
// console.log(account.getBalance()); // 150
// console.log(account.balance);      // undefined

// 21. Explain constructor function **

// function User(name, age) {
//   this.name = name;
//   this.age = age;
// }

// User.prototype.greet = function () {
//   return `Hi, I am ${this.name}`;
// };

// const user1 = new User("Aman", 25);
// const user2 = new User("Priya", 23);

// console.log(user1.greet()); // Hi, I am Aman
// console.log(user2.greet()); // Hi, I am Priya


// 22. Explain class in javascript **

// class User {
//   constructor(name) {
//     this.name = name;
//   }

//   greet() {
//     return `Hello, ${this.name}`;
//   }

//   static describe() {
//     return "A user account";
//   }
// }

// const user = new User("Himanshu");

// console.log(user.greet());      // Hello, Himanshu
// console.log(User.describe());   // A user account

// 23. Explain oops concept with example and real time scenrios ***

// 1 inheritance
// 2. incapsulation
// 3. abstraction 
// 4. polymorhism


// 24. Explain execution context and call stack ***

// An execution context is the environment in which JavaScript code is evaluated. It contains information required to execute the code, including its lexical environment, variable bindings, and relevant execution state.
// The call stack is the last-in, first-out (LIFO) structure that tracks the active execution contexts and function calls.
// JavaScript creates a global execution context for the program and creates function execution contexts when functions are invoked. Modules and other execution environments have additional details, but this model is sufficient for many interviews.


// 25. What is lexical scope and how js resolves variables lookups ***

// lexical scope - Lexical scope means that the accessibility of variables is determined by where functions and blocks are written in the source code, rather than by where functions are called.

// const name = "Global";

// function outer() {
//   const name = "Outer";

//   function inner() {
//     const message = "Hello";

//     console.log(message);
//     console.log(name);
//   }

//   inner();
// }

// outer();

// 26. Explain is 'this' keyword in javascript ***

// The this keyword refers to a value determined by how a function is called, except in arrow functions, which inherit this from their surrounding lexical environment.

// In ordinary functions, this depends primarily on the call site, not on where the function was defined.

// 1. this --> global scope --> window (browser), {} --> Node.js
// 2. this  --> objects --> khud ki properties ko direct;
// 3. this --> function --> how it is called;

// let user = {
//     name : "himanshu"
// }

// function greet(){
//     console.log(this.name);
// }

// greet();

// // call, apply, bind

// // call --> 
// greet.call(user, a, b, c);

// // apply -->
// greet.apply(user, [a, b, c])

// // bind -->
// let ourfnc = greet.bind(user, a, b, c);

// ourfnc();
3. 
// 27. What is prototype inheritence and how proto and prototype works (Expected : __proto__ vs prototype, how object lookup works, how classes use prototype under the hood) **

// prototype inheritance -->
// JavaScript uses prototype-based inheritance. An object can inherit properties and methods from another object through its internal [[Prototype]] link.
// When a property is accessed, JavaScript first checks the object itself. If the property is not found, it searches the object's prototype, then the prototype's prototype, continuing until the property is found or the chain ends at null.

// __proto__
// prototype

// how to create methods using prototype

// Parent constructor
// function Animal(name, sound) {
//     this.name = name;
//     this.sound = sound;
// }

// // Parent prototype method
// Animal.prototype.speak = function () {
//     console.log(`${this.name} says ${this.sound}`);
// };

// Animal.prototype.eat = function () {
//     console.log(`${this.name} is eating`);
// };

// // Child constructor
// function Dog(name, sound, breed) {
//     Animal.call(this, name, sound); // Initialize parent properties
//     this.breed = breed;
// }

// // Inherit Animal's prototype methods
// Dog.prototype = Object.create(Animal.prototype);

// // Restore the correct constructor reference
// Dog.prototype.constructor = Dog;

// // Add a method specific to Dog
// Dog.prototype.bark = function () {
//     console.log(`${this.name} is barking!`);
// };

// // Create a Dog object
// const dog = new Dog("Tommy", "Woof", "Labrador");

// dog.speak(); // Tommy says Woof
// dog.eat();   // Tommy is eating
// dog.bark();  // Tommy is barking!


// classes 
// class Animal {
//   speak() {
//     return "Sound";
//   }
// }

// class Dog extends Animal {
//   bark() {
//     return "Woof";
//   }
// }

// const dog = new Dog();

// console.log(dog.bark()); // Woof
// console.log(dog.speak()); // Sound

// console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true
// console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true

// 28. What shadowing and illegal shadowing **


// Variable shadowing occurs when a declaration in an inner scope uses the same name as a declaration in an outer scope. Within the inner scope, the inner binding takes precedence.

// let name = "Global";

// function showName() {
//   let name = "Local";
//   console.log(name);
// }

// showName();       // Local
// console.log(name); // Global
    
// Illegal shadowing is an informal term commonly used for cases where a lexical declaration such as let or const conflicts with a var declaration in a scope where JavaScript

// let age = 25;

// {
//   var age = 30; // SyntaxError
// }

// 29. Explain currying ***

// Currying is a technique in which a function that takes multiple arguments is transformed into a sequence of functions, each taking one argument at a time.
// For example, a function \(f(a,b,c)\) can be represented as \(f(a)(b)(c)\).

// function add(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c;
//     };
//   };
// }

// console.log(add(2)(3)(4)); // 9

// const multiply = a => b => a * b;

// const double = multiply(2);
// const triple = multiply(3);

// console.log(double(10)); // 20
// console.log(triple(10)); // 30

// 30. Difference between shallow copy and deep copy ***


// A shallow copy creates a new outer object but retains references to nested objects. A deep copy creates an independent copy of nested data as well, to the extent defined by the copying method.

// shallow copy --> 
// spread operator
// const arr = [1, 2, 3, 5];
// const arr2= [...arr];

// arr2.push(6);
// console.log(arr);


// const original = {
//   name: "Himanshu",
//   address: {
//     city: "Bahadurgarh"
//   }
// };

// const copy = { ...original };

// copy.name = "Aman";
// copy.address.city = "Delhi";

// console.log(original.name);         // Himanshu
// console.log(original.address.city); // Delhi

// deep copy -->

// const original = {
//   name: "Himanshu",
//   address: {
//     city: "Bahadurgarh"
//   }
// };

// const copy = structuredClone(original);

// copy.address.city = "Delhi";

// console.log(original.address.city); // Bahadurgarh
// console.log(copy.address.city);     // Delhi

// stringify

// const original = {
//   name: "Himanshu",
//   address: {
//     city: "Bahadurgarh"
//   }
// };

// const copy = JSON.parse(JSON.stringify(original));

// copy.address.city = "Delhi";

// console.log(original.address.city); // Bahadurgarh
// console.log(copy.address.city);     // Delhi


// 31. What is a generator function **

// A generator function is a special function declared using function* that can pause execution using yield and resume later. Calling it returns a generator object, which follows the iterator protocol.

// function* numbers() {
//   yield 1;
//   yield 2;
//   yield 3;
// }

// const iterator = numbers();

// console.log(iterator.next()); // { value: 1, done: false }
// console.log(iterator.next()); // { value: 2, done: false }
// console.log(iterator.next()); // { value: 3, done: false }
// console.log(iterator.next()); // { value: undefined, done: true }

// 32. What is memoization? Imlement memoize function ***

// Memoization is an optimization technique in which a function caches the results of previous computations so that repeated calls with equivalent inputs can return a stored result instead of recomputing it.
// It is most useful for expensive, repeatable computations where the same inputs occur frequently.

// function memoize(fn) {
//   const cache = new Map();

//   return function (...args) {
//     if (cache.has(args[0])) {
//       return cache.get(args[0]);
//     }

//     const result = fn.apply(this, args);
//     cache.set(args[0], result);

//     return result;
//   };
// }

// function square(n) {
//   console.log("Calculating...");
//   return n * n;
// }

// const memoizedSquare = memoize(square);

// console.log(memoizedSquare(5)); // Calculates, then 25
// console.log(memoizedSquare(5)); // Cached result: 25
// console.log(memoizedSquare(6)); // Calculates, then 36

// 33. Explain set with example and explain answer of this set.add([1]), set.add([1]) ***

// set --> unique elements

// const set = new Set();

// set.add(1);
// set.add(1);
// set.add("1");

// console.log(set.size); // 2
// console.log(set);      // Set { 1, "1" }


// set.add([1]);
// set.add([1]);
// set.size(); // 2

// if you add the same array reference twice, it is stored only once:

// 34. Explain Object.defineProperty() (with get/set) **

// Object.defineProperty() defines or modifies an individual property on an object using a property descriptor. It allows you to configure characteristics such as whether a property is writable, enumerable, or configurable, or define getter and setter functions that run when the property is accessed or assigned. 

// const user = {};

// Object.defineProperty(user, "name", {
//   value: "Himanshu",
//   writable: false,
//   enumerable: true,
//   configurable: false

// });

// const user = {
//   firstName: "Himanshu",
//   lastName: "Sharma"
// };

// Object.defineProperty(user, "fullName", {
//   get() {
//     return `${this.firstName} ${this.lastName}`;
//   },

//   set(value) {
//     const parts = value.split(" ");

//     this.firstName = parts[0];
//     this.lastName = parts.slice(1).join(" ");
//   },

//   enumerable: true,
//   configurable: true
// });

// console.log(user.fullName); // Himanshu Sharma

// user.fullName = "Aman Kumar";
// console.log(user.firstName); // Aman


// 35. Explain optional chaining & Nullish Coalescing **

// // Optional chaining (?.) safely accesses a property, calls a method, or accesses an indexed element when the value immediately to its left is null or undefined. Instead of throwing a TypeError, it returns undefined.

// const user = {
//   profile: {
//     name: "Himanshu"
//   }
// };

// console.log(user.profile?.name); // Himanshu
// console.log(user.address?.city); // undefined


// // Nullish coalescing (??) provides a fallback value only when the expression on the left is null or undefined.

// const username = null;
// const displayName = username ?? "Guest";

// console.log(displayName); // Guest


// // The || operator checks whether the left side is falsy. The ?? operator checks specifically for null or undefined.

// console.log(0 || 100);  // 100
// console.log(0 ?? 100);  // 0

// console.log("" || "Default"); // Default
// console.log("" ?? "Default"); // ""


// 36. Explain call, bind, apply ***


// call(), apply(), and bind() are function methods that allow you to control the this value used by an ordinary function.
// - call() invokes the function immediately, passing arguments individually.
// - apply() invokes the function immediately, passing arguments as an array or array-like value.
// - bind() returns a new bound function that can be called later with a specified this value and optional preset arguments.


// function introduce(city, country) {
//   console.log(
//     `${this.name} lives in ${city}, ${country}`
//   );
// }

// const user = { name: "Himanshu" };

// introduce.call(user, "Delhi", "India");

// introduce.apply(user, ["Delhi", "India"]);

// const boundIntroduce = introduce.bind(user, "Delhi");

// boundIntroduce("India");

// 37. Difference b/w map, filter and reduce ***

// These are array iteration methods that serve different purposes:
// - map() transforms each existing element and returns a new array.
// - filter() returns a new array containing elements that pass a condition.
// - reduce() processes elements to accumulate a single result, which can be a number, object, array, or another value.


// const numbers = [1, 2, 3, 4, 5];

// const doubled = numbers.map(n => n * 2);
// const even = numbers.filter(n => n % 2 === 0);
// const sum = numbers.reduce((total, n) => total + n, 0);

// console.log(doubled); // [2, 4, 6, 8, 10]
// console.log(even);    // [2, 4]
// console.log(sum);     // 15

// 38. How does garbage collection work in js ***

// Garbage collection is the automatic process through which the JavaScript engine identifies memory that is no longer reachable by the program and reclaims it.
// Modern JavaScript engines commonly use reachability-based algorithms, including mark-and-sweep techniques, alongside generational and other optimizations. The exact implementation varies by engine.

// function createUser() {
//   const user = {
//     name: "Himanshu",
//     data: new Array(1000).fill("data")
//   };

//   return user.name;
// }

// createUser();

// 39. Difference between normal function and arrow function ***


// A normal function is a function declaration or expression with its own function execution behavior, including a dynamically determined this value and, in ordinary functions, an arguments object.
// An arrow function is a more concise function expression that captures this and arguments lexically, does not have its own prototype, and cannot be called as a constructor with new.

// const user = {
//   name: "Himanshu",

//   normal() {
//     return this.name;
//   },

//   arrow: () => {
//     return this.name;
//   }
// };

// console.log(user.normal()); // Himanshu
// console.log(user.arrow());  // Depends on the surrounding lexical this

// Arrow functions in callbacks

// const user = {
//   name: "Himanshu",

//   delayedGreeting() {
//     setTimeout(() => {
//       console.log(this.name);
//     }, 100);
//   }
// };

// user.delayedGreeting(); // Himanshu

// 40. What is reflow and repaint (DOM) ***

// Reflow, also called layout in modern browser terminology, occurs when the browser recalculates the size or position of elements in the layout.
// Repaint occurs when the browser redraws the visual appearance of elements without necessarily recalculating their layout.
// A layout change may require both layout recalculation and repainting. A purely visual change may require repainting without reflow.

// const box = document.querySelector(".box");

// // May trigger layout recalculation and repaint
// box.style.width = "300px";

// // Usually requires repainting, but not layout
// box.style.backgroundColor = "red";

// 41. What is document fragment (DOM) ***

// A DocumentFragment is a lightweight container for DOM nodes that is not itself part of the document tree. You can build a group of nodes inside it and then insert those nodes into the document.
// When a fragment is inserted, its children are moved into the destination; the fragment itself is not inserted as a persistent wrapper.

// const list = document.querySelector("#list");
// const fragment = document.createDocumentFragment();

// for (let i = 1; i <= 3; i++) {
//   const item = document.createElement("li");
//   item.textContent = `Item ${i}`;

//   fragment.appendChild(item);
// }

// list.appendChild(fragment);

// const list = document.querySelector("#list");
// const fragment = document.createDocumentFragment();

// for (let i = 1; i <= 3; i++) {
//   const item = document.createElement("li");
//   item.textContent = `Item ${i}`;

//   fragment.appendChild(item);
// }

// list.appendChild(fragment);

// 42. Difference between innerHTML vs textContent (DOM) ***

// innerHTML gets or sets the HTML markup inside an element. When setting it, the browser parses the supplied string as HTML and creates DOM nodes.
// textContent gets or sets the text content of an element. When setting it, the supplied string is treated as text rather than parsed as HTML.


// 43. What is DOM Tree? What are Nodes (DOM) ***

// The Document Object Model (DOM) is a programming interface that represents an HTML document as a structured tree of objects. JavaScript can use the DOM to read and modify the document's content, structure, and attributes.
// A node is a general term for an object in this tree. Common node types include document nodes, element nodes, text nodes, comments, and document fragments.

// 44. What is event.stopPropogation(), event.stopImmediatePropagation(), event.preventDefault(). (DOM) ***

// These methods control different aspects of DOM event handling:
// - stopPropagation() prevents the event from continuing to propagate through the DOM.
// - stopImmediatePropagation() stops propagation and prevents later listeners on the same event target from being invoked.
// - preventDefault() prevents the browser's default action for a cancelable event, when the event is not in a context that disallows cancellation.


// 45. Difference between target and currentTarget.(DOM) ***

// event.target identifies the object where the event originally occurred, 
// while event.currentTarget identifies the element whose event listener is currently executing.

// 46. How browser renders a web page? (Critical Rendering Path) **

// The Critical Rendering Path is the sequence of steps the browser takes to transform HTML, CSS, and JavaScript resources into pixels displayed on the screen.
// A simplified rendering pipeline includes parsing HTML into the DOM, parsing CSS into the CSSOM, combining relevant structures into a render tree, calculating layout, painting visual content, and compositing layers for display.
// JavaScript, images, fonts, and other resources can influence or delay these steps.

// 47. Why is innerHTML unsafe? Explain XSS. (DOM) ***

// Using innerHTML with untrusted input can introduce Cross-Site Scripting (XSS) vulnerabilities because the browser parses the supplied string as HTML and may create executable elements or event-handler attributes.
// Cross-Site Scripting (XSS) is a security vulnerability in which an attacker causes malicious script to execute in another user's browser within the context of a vulnerable website.

// const userInput = `
//   <img src="invalid"
//        onerror="alert('XSS')">
// `;

// document.querySelector("#output").innerHTML = userInput;

// innerHTML treats the input as markup. textContent treats it as text.