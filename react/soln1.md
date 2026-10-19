# REACT (CONCEPTUAL + TECHNICAL)

1. What is React **

React is an open-source JavaScript library developed by Meta for building user interfaces, particularly single-page applications. It follows a component-based architecture, allowing us to divide complex UIs into small, reusable components. React uses declarative rendering, state management, and reconciliation to update the UI efficiently when data changes.


2. What is single page application (SPA) **

A Single Page Application is a web application that loads an initial HTML page and then updates its content dynamically using JavaScript without requiring a full-page reload for every navigation. React commonly builds SPAs using client-side routing libraries such as React Router.

3. What are components in React and how are they useful ***

Components are independent, reusable pieces of UI that can contain markup, logic, and styling. React applications are built by combining components into a component tree. Components improve code reusability, maintainability, separation of concerns, and testability.

4. What is JSX and why is it used in React ***

JSX stands for JavaScript XML. It is a syntax extension that allows us to write HTML-like markup inside JavaScript. JSX makes UI code easier to read and maintain. Build tools transform JSX into JavaScript expressions that React uses to create elements.


5. What are props and state (difference between them) ***

Props and state both influence what a component renders, but they serve different purposes.
Props are inputs passed from a parent component to a child component. They are read-only from the receiving component's perspective.
State is data managed by a component, typically through hooks such as useState. When state changes through its setter, React schedules a re-render.


6. What is the difference between class components and functional components ***

Class components use ES6 classes and lifecycle methods such as componentDidMount and componentDidUpdate. Functional components are JavaScript functions that return JSX and can use hooks for state, side effects, and other React features.
Functional components are generally preferred for new React applications because hooks enable logic reuse and usually result in simpler code.


7. What are React Hooks ***

Hooks are functions provided by React that allow functional components to use features such as state, context, refs, and effects. Examples include useState, useEffect, useContext, useRef, and useReducer. Developers can also create custom hooks to reuse stateful logic.

8. Explain useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef ***

useState — component state
Stores a value between renders. Updating it schedules a re-render.

useEffect — synchronize with external systems
Used for API requests, subscriptions, timers, and other external synchronization.

useLayoutEffect — layout-sensitive work
Runs after DOM changes are committed but before the browser repaints. Useful for measuring an element and synchronously adjusting layout.

useMemo — memoize a calculated value
Reuses a calculation result while its dependencies remain unchanged.

useCallback — memoize a function reference
Returns the same function reference while dependencies remain unchanged.

useRef — persist a mutable reference
Stores a value between renders without triggering a re-render when .current changes. Often used for DOM access and timer IDs.

9. What are custom hooks and when to use them ***

A custom hook is a JavaScript function whose name starts with use and that can call other React hooks. It allows us to extract and reuse stateful logic across components without duplicating code.
Custom hooks share logic, not automatically the same state instance. Each component calling a custom hook generally has its own independent state unless the hook uses shared state elsewhere.


10. Explain React.memo and how it helps in optimization ***

React.memo is a higher-order component that memoizes a function component's rendered result. React can skip rendering that component when its props are unchanged according to a shallow comparison using Object.is for individual prop values.
It is useful when a component renders frequently with unchanged props and its rendering is expensive. It does not prevent re-renders caused by the component's own state or consumed context changes.

11. Explain Context API and how to integrate it ***

The Context API allows a parent component to provide data to descendant components without explicitly passing props through every intermediate component. It is useful for relatively stable, shared values such as themes, locale, and authentication information.

12. What is prop drilling and how to avoid it ***

Prop drilling occurs when data is passed through multiple intermediate components that do not themselves need the data, simply to reach a deeply nested component.
It can be addressed using Context API, component composition, custom hooks built on shared state, or state-management libraries such as Redux Toolkit and Zustand.


13. When and how to use lazy loading ***

Lazy loading means loading a resource only when it is needed rather than including everything in the initial load. In React, lazy and Suspense are commonly used to load components on demand, reducing the initial JavaScript bundle size.


14. What is Virtual DOM ***

The Virtual DOM is a conceptual representation of the UI maintained by React. React uses its rendering process to determine what changes are needed, then commits the necessary updates to the actual DOM.
The goal is to let developers describe the desired UI declaratively rather than manually manipulating DOM elements for every state change.



15. What is reconciliation in React (how React updates DOM) ***

Reconciliation is the process React uses to compare the new rendered element tree with the previous one and determine the changes needed to update the UI. React uses element types, tree position, and keys to determine which components and elements can be reused and which must be replaced.


16. How to route between pages in React **

In a client-rendered React application, we commonly use React Router to map URL paths to components. It allows navigation without a full-page reload and supports nested routes, route parameters, and navigation APIs.


17. What are error boundaries in React ***

Error boundaries are React components that catch errors thrown during rendering and certain lifecycle operations in their descendant component tree. They allow the application to show fallback UI instead of letting a rendering error crash the entire affected tree.
Traditional error boundaries use class components with getDerivedStateFromError and optionally componentDidCatch.


18. What are controlled and uncontrolled components ***

In a controlled form input, React state is the source of truth for the input's value. In an uncontrolled input, the DOM manages the current value, which can be accessed using a ref or form APIs.

19. What are keys in lists and why are they important ***

Keys are special identifiers that help React match list elements between renders. They allow React to recognize which items were added, removed, moved, or updated.
Keys should be stable and unique among siblings. Database IDs are usually preferable to array indexes, particularly when items can be inserted, deleted, or reordered.

20. What is React Fragment and why is it used **

A Fragment lets a component return multiple sibling elements without adding an unnecessary DOM wrapper. It keeps the DOM structure cleaner and avoids introducing extra elements that could affect layout or semantics.


21. What are higher-order components (HOCs) **

A Higher-Order Component is a function that takes a component and returns a new component with additional behavior. HOCs were commonly used for cross-cutting concerns such as authentication, logging, and permissions before hooks became widely adopted.


22. What are lifecycle methods (mount/update/unmount) in class components **

Lifecycle methods allow class components to run code at specific stages of their existence: mounting, updating, and unmounting. They are useful for initializing external resources, responding to changes, and cleaning up subscriptions or timers.

23. What is Redux and Redux Toolkit? How do you create a store? ***

Redux is a predictable state-management library that stores shared application state in a centralized store. Components dispatch actions, reducers calculate the next state, and subscribed components receive updates.
Redux Toolkit (RTK) is the recommended approach for writing Redux applications. It reduces boilerplate and provides utilities such as configureStore and createSlice. Redux Toolkit uses Immer to let reducers express immutable updates with mutation-like syntax.

24. How to structure a React application folder **

I would choose a structure based on application size and team needs. For a small application, a simple component-based structure is sufficient. For a large MERN application, I prefer a feature-based structure that groups components, hooks, API services, and state management by business domain.


25. How will you handle authentication in frontend and where to store the token ***

In a MERN application, the frontend sends login credentials to the backend over HTTPS. The backend validates the credentials and establishes an authenticated session or issues tokens. The frontend then uses the authentication mechanism for protected API requests, while the backend validates every protected request and enforces authorization.
For browser applications, a common secure approach is to use a server-managed session or JWT stored in a Secure, HttpOnly, appropriately configured SameSite cookie. Because JavaScript cannot read an HttpOnly cookie, it reduces the risk of token theft through client-side JavaScript. Cookie-based authentication still requires appropriate CSRF protection.


26. What are interceptors in Axios ***

Axios interceptors are functions that execute automatically before a request is sent or after a response is received. They help centralize common API logic, such as adding authentication headers, logging requests, handling errors, and responding to expired sessions.

There are two types:
- Request interceptor: Runs before the request is sent.
- Response interceptor: Runs when a response arrives or a request fails.


27. How to handle state in large applications
 (Context, Redux, Zustand, MobX, Jotai) ***

I first classify state based on its purpose instead of putting everything into a global store.
- Local UI state: useState or useReducer.
- Shared application state: Context, Redux Toolkit, Zustand, MobX, or Jotai.
- Server state: A data-fetching/cache library such as TanStack Query, or an appropriate framework's data APIs.
- URL state: Query parameters and route parameters for shareable filters, search, and pagination.


28. How to debug a React application ***

I debug React applications systematically. First, I reproduce the problem and identify whether it is related to rendering, state, props, API requests, routing, or styling. Then I use browser DevTools, React Developer Tools, network inspection, and targeted logging to find the root cause. After fixing it, I verify the behavior and add a regression test where appropriate.


29. Is React a framework? **

React is primarily a JavaScript library for building user interfaces, not a complete application framework. It focuses on the UI layer and does not prescribe every part of an application, such as routing, data fetching, or backend architecture.

Developers can combine React with libraries such as React Router and Redux Toolkit. Frameworks such as Next.js build on React and provide additional conventions and capabilities, including routing and server rendering.


30. How to handle large number of records in a table (virtualization) ***

Virtualization, also called windowing, renders only the rows currently visible in the viewport and a small number of additional rows. Instead of creating thousands of DOM elements simultaneously, the application renders a small visible subset and updates it as the user scrolls.

It improves rendering performance, reduces DOM size, and makes large tables more responsive.


31. What is React Portal and when to use it **

A React Portal allows a component to render its DOM elements into a different DOM node outside its normal DOM hierarchy while remaining part of the same React tree.

Portals are useful for modals, tooltips, dropdown overlays, and notification containers that need to escape an ancestor's clipping or stacking context.


32. Difference between useEffect and useLayoutEffect ***

Both hooks synchronize React components with external systems, but their timing differs.

useEffect runs after React commits changes to the DOM and generally allows the browser to paint before processing the effect. useLayoutEffect runs after DOM mutations but before the browser repaints, making it useful for layout measurements or changes that must happen before the user sees the result.


33. What is useReducer and when to use it **

seReducer is a React hook for managing state through a reducer function. The reducer receives the current state and an action, then returns the next state.

It is useful when state has multiple related values or when updates involve several actions and conditional transitions. It can make complex state updates easier to organize and test.

34. What is React.StrictMode and why is it used **

React.StrictMode is a development-only tool that helps identify potential problems in a React application. It performs additional checks and may re-render components or repeat effect setup and cleanup to expose unsafe assumptions and missing cleanup.

It does not affect production behavior in the same way, and it does not add a visible DOM element.


35. What are synthetic events in React **

Synthetic events are React's event objects that provide a consistent interface for handling user interactions across supported environments. They expose familiar properties and methods such as target, currentTarget, preventDefault(), and stopPropagation().

Modern React delegates many events to the React root rather than installing an independent native listener on every element.

36. What is code splitting and chunking in React ***

Code splitting divides an application's JavaScript into smaller bundles, allowing the browser to download code when needed instead of loading the entire application upfront. Chunking is the creation of those separate output files or bundles by a bundler.

In React applications, dynamic imports, React.lazy, and framework-specific routing features can enable code splitting. This can improve initial loading performance, particularly for large applications.


37. What is server-side rendering (SSR) vs client-side rendering (CSR) ***

Client-Side Rendering means the browser runs JavaScript to render the application's UI. Server-Side Rendering means the server generates HTML for a request and sends that HTML to the browser, where React can hydrate it to make it interactive.

CSR is common in traditional React single-page applications. SSR is useful when faster initial content display, search-engine accessibility, or request-specific HTML is important.

38. What are performance optimization techniques in React (avoid re-renders, memoization, virtualization, caching) ***

I optimize React applications by measuring performance first, identifying the bottleneck, and applying the appropriate technique. Common approaches include reducing unnecessary re-renders, memoization, virtualization, code splitting, caching, and efficient API data handling.


39. What are controlled vs uncontrolled inputs (forms) ***

A controlled input gets its current value from React state and updates that state through an event handler. An uncontrolled input keeps its current value in the DOM, and the application reads it through a ref or the form API.

40. How does React handle events differently from browser DOM **

React provides a declarative event-handling system using props such as onClick and onChange, whereas the native DOM typically uses methods such as addEventListener.

React wraps supported events in its synthetic event interface and uses event delegation for many event types. React's event props use camelCase naming and accept functions rather than strings of JavaScript code.

41. What is state lifting **

State lifting means moving state from a child component to the nearest common parent when multiple components need to access or update the same data. The parent owns the state and passes the value and event handlers down through props.

This creates a single source of truth and keeps related components synchronized.


42. What is the difference between default export and named export in React **

JavaScript modules support named exports and a default export. Named exports allow a module to expose multiple explicitly named values, while a module can have only one default export.

Named imports use the exported name, whereas default imports can choose their local name.

43. Create a component rendering data with pagination. ***

This is an important practical interview question. The interviewer may expect you to fetch data from an API, show a fixed number of records per page, and provide Previous and Next buttons.
Interview-ready approach
I would implement pagination by maintaining the current page in React state, calculating the starting index for the current page, and slicing the data array. I would disable navigation buttons when the user reaches the first or last page.

For API-driven applications with large datasets, I would usually consider server-side pagination instead of fetching every record into the browser.