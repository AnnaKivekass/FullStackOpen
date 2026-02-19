import { useState } from "react"
import { useNavigate } from "react-router-dom"

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [info, setInfo] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    addNew({
      content,
      author,
      info,
      votes: 0
    })

    navigate("/")
  }

  return (
    <div>
      <h2>Create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input value={content} onChange={e => setContent(e.target.value)} />
        </div>

        <div>
          author
          <input value={author} onChange={e => setAuthor(e.target.value)} />
        </div>

        <div>
          url for more info
          <input value={info} onChange={e => setInfo(e.target.value)} />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateNew
