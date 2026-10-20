import { useEffect, useState } from "react"


const App = () => {
  const [users, setUsers] = useState([]);

  const fetchUser = async() => {
    try {
      const response = await fetch(`https://dummyjson.com/users`);
      const data = await response.json();
      console.log(data.users);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])


  return (
    <>
      <div className="contatiner">
        <button className="btn" onClick={fetchUser}>Fetch User</button>
        <div className="user-list">
          <ol>
            {users && users.map((u, idx) => (
              <li key={idx}>Name - {u.firstName}, Age - {u.age}, Gender - {u.gender}</li>
          ))}
          </ol>
        </div>
      </div>
    </>
  )
}

export default App