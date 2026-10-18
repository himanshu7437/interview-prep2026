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