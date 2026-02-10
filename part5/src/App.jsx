import { useEffect, useState } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)

      setUsername('')
      setPassword('')
    } catch (e) {
      console.log('LOGIN FAILED', e?.response?.status, e?.response?.data || e)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

  }

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
