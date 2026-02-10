import { useEffect, useState, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const normalizeBlog = (b) => ({ ...b, id: b.id || b._id })

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  const notify = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs.map(normalizeBlog))
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
      notify('wrong username or password', 'error')
      console.log('LOGIN FAILED', e?.response?.status, e?.response?.data || e)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const normalized = normalizeBlog(returnedBlog)

      setBlogs((prev) => prev.concat(normalized))
      notify(`a new blog "${normalized.title}" added`, 'success')

      blogFormRef.current.toggleVisibility()
    } catch (e) {
      notify('failed to create blog', 'error')
      console.log('CREATE BLOG FAILED', e?.response?.status, e?.response?.data || e)
    }
  }

  const likeBlog = async (blog) => {
    try {
      const blogId = blog.id || blog._id
      const userId = blog.user?.id || blog.user?._id || blog.user

      const updatedBlog = {
        user: userId,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }

      const returnedBlog = await blogService.update(blogId, updatedBlog)
      const normalizedReturned = normalizeBlog(returnedBlog)

      const blogForState = {
        ...normalizedReturned,
        user:
          normalizedReturned.user && typeof normalizedReturned.user === 'object'
            ? normalizedReturned.user
            : blog.user,
      }

      setBlogs((prev) => prev.map((b) => (b.id === blogId ? blogForState : b)))
    } catch (e) {
      notify('failed to like blog', 'error')
      console.log('LIKE FAILED', e?.response?.status, e?.response?.data || e)
    }
  }

  const removeBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      notify('blog removed', 'success')
    } catch (e) {
      notify('failed to remove blog', 'error')
      console.log('REMOVE FAILED', e?.response?.status, e?.response?.data || e)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} />

      <h2>blogs</h2>

      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={likeBlog}
            handleRemove={removeBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
