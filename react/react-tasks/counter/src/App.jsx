import { useState } from "react"

const App = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
      if(count < 20) {
        setCount((cnt) => cnt + 1);
      }
    }

    const decrement = () => {
      if(count > 0) {
        setCount((cnt) => cnt - 1);
      }
    }

    const reset = () => {
      setCount(0);
    }

  return (
    <>
      <div className="counter">
        <div>
          <h2 className="heading">Counter App</h2>
        </div>

        <div className="box">
          <div>count - {count}</div>
          <button className="btn" disabled={count >= 20} onClick={increment}>Increment</button>
          <button className="btn" disabled={count <= 0} onClick={decrement}>Decrement</button>
          <button className="btn" disabled={count == 0} onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  )
}

export default App