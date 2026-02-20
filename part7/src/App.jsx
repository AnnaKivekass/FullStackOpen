import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import AnecdoteList from "./components/AnecdoteList"
import CreateNew from "./components/CreateNew"
import Footer from "./components/Footer"
import Menu from "./components/Menu"
import Anecdote from "./components/Anecdote"

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often.",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1
    },
    {
      content: "Premature optimization is the root of all evil.",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2
    }
  ])

  const addNew = (anecdote) => {
    const newAnecdote = {
      ...anecdote,
      id: anecdotes.length + 1
    }
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>

        <Menu />

        <Routes>
          <Route
            path="/"
            element={<AnecdoteList anecdotes={anecdotes} />}
          />

          <Route
            path="/create"
            element={<CreateNew addNew={addNew} />}
          />

          <Route
            path="/anecdotes/:id"
            element={<Anecdote anecdotes={anecdotes} />}
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App
