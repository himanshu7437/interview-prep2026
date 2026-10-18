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


// 16. Create polyfill for Promise.all, Promise.allsettled, map method, filter, includes, hasOwnProperty, find ***
// 17. Create a custom function for setInterval ***
// 18. What is a Variable Scope in JavaScript ***
// 19. Explain event delegation, event propogation, event bubbling, event capturing ***
// 20. Explain closure with example ***
// 21. Explain constructor function **
// 22. Explain class in javascript **
// 23. Explain oops concept with example and real time scenrios ***
// 24. Explain execution context and call stack ***
// 25. What is lexical scope and how js resolves variables lookups ***