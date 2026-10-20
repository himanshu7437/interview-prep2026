import { useEffect, useState } from "react"


const App = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

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

  const filterUsers = users.filter((user) => {
    return user.firstName.toLowerCase().startsWith(query.toLowerCase());
  })


  return (
    <>
      <div className="contatiner">
        <button className="btn" onClick={fetchUser}>Fetch User</button>
        <div className="srcj">
          <label htmlFor="name">Search Bar</label>
          <input type="text" placeholder="Search By Name..." onChange={(e) => setQuery(e.target.value)} value={query}/>
        </div>
        <div className="user-list">
          <ol>
            {filterUsers && filterUsers.map((u, idx) => (
              <li key={idx}>Name - {u.firstName}, Age - {u.age}, Gender - {u.gender}</li>
          ))}
          </ol>
        </div>
      </div>
    </>
  )
}

export default App