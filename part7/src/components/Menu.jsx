import { Link } from "react-router-dom"

const Menu = () => {
  return (
    <div>
      <Link to="/">anecdotes</Link>{" | "}
      <Link to="/create">create new</Link>
    </div>
  )
}

export default Menu
