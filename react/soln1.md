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
12. What is prop drilling and how to avoid it ***
13. When and how to use lazy loading ***
14. What is Virtual DOM ***
15. What is reconciliation in React (how React updates DOM) ***
16. How to route between pages in React **
17. What are error boundaries in React ***
18. What are controlled and uncontrolled components ***
19. What are keys in lists and why are they important ***
20. What is React Fragment and why is it used **
21. What are higher-order components (HOCs) **
22. What are lifecycle methods (mount/update/unmount) in class components **
23. What is Redux and Redux Toolkit? How do you create a store? ***
24. How to structure a React application folder **
25. How will you handle authentication in frontend and where to store the token ***