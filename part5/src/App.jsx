import { useEffect, useState, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import {
  setNotification,
  clearNotification
} from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlogRedux
} from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const dispatch = useDispatch()

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const notify = (text, type = 'success') => {
    dispatch(setNotification({ text, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 4000)
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token) // 🔥 tärkeä
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
      blogService.setToken(loggedUser.token) // 🔥 tärkeä

      setUsername('')
      setPassword('')
    } catch (e) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (blogObject) => {
    try {
      await dispatch(createBlogRedux(blogObject))
      notify(`a new blog "${blogObject.title}" added`, 'success')
      blogFormRef.current.toggleVisibility()
    } catch (e) {
      notify('failed to create blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification />
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
      <Notification />

      <h2>blogs</h2>

      <div>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id || blog._id}
            blog={blog}
            handleLike={() => {}}
            handleRemove={() => {}}
            user={user}
          />

        ))}
    </div>
  )
}

export default App
