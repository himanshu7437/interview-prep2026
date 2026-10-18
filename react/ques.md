# REACT INTERVIEW PREPARATION QUESTIONS — MERN STACK

---

# REACT (CONCEPTUAL + TECHNICAL)

1. What is React **
2. What is single page application (SPA) **
3. What are components in React and how are they useful ***
4. What is JSX and why is it used in React ***
5. What are props and state (difference between them) ***
6. What is the difference between class components and functional components ***
7. What are React Hooks ***
8. Explain useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef ***
9. What are custom hooks and when to use them ***
10. Explain React.memo and how it helps in optimization ***
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
26. What are interceptors in Axios ***
27. How to handle state in large applications (Context, Redux, Zustand, MobX, Jotai) ***
28. How to debug a React application ***
29. Is React a framework? **
30. How to handle large number of records in a table (virtualization) ***
31. What is React Portal and when to use it **
32. Difference between useEffect and useLayoutEffect ***
33. What is useReducer and when to use it **
34. What is React.StrictMode and why is it used **
35. What are synthetic events in React **
36. What is code splitting and chunking in React ***
37. What is server-side rendering (SSR) vs client-side rendering (CSR) ***
38. What are performance optimization techniques in React (avoid re-renders, memoization, virtualization, caching) ***
39. What are controlled vs uncontrolled inputs (forms) ***
40. How does React handle events differently from browser DOM **
41. What is state lifting **
42. What is the difference between default export and named export in React **
43. Create a component rendering data with pagination. ***

---

# SCENARIO-BASED REACT QUESTIONS

### State & Rendering Scenarios
1. A component re-renders too many times — how do you find the cause and fix it? ***
2. You have a list of 10,000 items — how do you render it without freezing the UI? (virtualization) ***
3. You have deeply nested components — how do you avoid prop drilling? (Context, custom hooks, state libraries) ***
4. A state update is not reflecting immediately — why does this happen and how do you fix it? ***
5. useEffect is running in an infinite loop — what causes this? ***

### Performance Scenarios
6. A large form becomes slow — what React optimizations will you apply? ***
7. A slow API response is blocking render — how do you show fallback UI with Suspense or loaders? ***
8. How do you cache expensive calculations in React? (useMemo) ***

### API & Data Handling Scenarios
9. API fails sometimes — how do you implement retry logic? ***
10. Requirement: show global loader during all API calls — how do you implement this? ***
11. You need to cancel API requests on component unmount — how do you implement it? ***

### Architecture Scenarios
12. How will you structure a large React project? (feature-based modules, hooks, services, store) **
13. Multiple components need shared logic — how will you reuse it? (custom hooks) ***
14. Multiple components need shared global state — when to use Context vs Redux? ***

### Security & Auth Scenarios
15. Where do you store JWT tokens securely? (httpOnly cookie vs localStorage) ***
16. How to implement token refresh on 401 errors? ***
17. How to protect routes in React Router? (private routes) ***

### UI/UX Scenarios
18. How to implement skeleton loader while data loads? ***
19. A dropdown must close when clicking outside — how to implement click outside detection? ***
20. A modal must render above everything — how to implement with portals? ***

### Task
1. Create a dashboard/table after fetching data from api, should be capable of CRUD operations and search filter. ***