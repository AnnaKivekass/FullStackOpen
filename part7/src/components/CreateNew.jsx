import { useNavigate } from "react-router-dom"
import { useField } from "../hooks"

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  const content = useField("text")
  const author = useField("text")
  const info = useField("text")

  const handleSubmit = (e) => {
    e.preventDefault()

    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })

    navigate("/")
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  const { reset: resetContent, ...contentInput } = content
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetInfo, ...infoInput } = info

  return (
    <div>
      <h2>Create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>

        <div>
          author
          <input {...authorInput} />
        </div>

        <div>
          url for more info
          <input {...infoInput} />
        </div>

        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew
