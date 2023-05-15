import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const blogFormRef = useRef()

  const updateMessage = (status, text) => {
    setMessage({ status, text })
  }

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setCurrentUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setCurrentUser(user)
      setUsername('')
      setPassword('')
      updateMessage('success', `User ${user.username} logged in`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      updateMessage('error', exception.response.data.error)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setCurrentUser(null)
    updateMessage('success', 'User logged out')
    setTimeout(() => setMessage(null), 5000)
  }

  const addBlog = async newBlogObj => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(newBlogObj)
      setBlogs(blogs.concat(returnedBlog))

      updateMessage('success', `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      updateMessage('error', exception.response.data.error)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const updateLikes = async blogObject => {
    const { id, likes, user, ...rest } = blogObject

    const newObject = { likes: likes + 1, user: user.id, ...rest }
    try {
      const updatedBlog = await blogService.update(id, newObject)

      setBlogs(blogs.map(blog => (blog.id !== id ? blog : updatedBlog)))

      updateMessage('success', `The blog ${updatedBlog.title} was liked by ${currentUser.name}`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      console.log(exception)
    }
  }

  const deleteBlog = async blog => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))

        updateMessage('success', 'Removed')
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (exception) {
      updateMessage('error', exception.response.statusText)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      {!currentUser && (
        <Togglable buttonLabel='log in'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {currentUser && (
        <div style={{ width: '50%' }}>
          <p id='loggedin-user'>
            {currentUser.name} logged in{' '}
            <button type='primary' onClick={handleLogout}>
              log out
            </button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      {currentUser &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              updateLikes={() => updateLikes(blog)}
              deleteBlog={() => deleteBlog(blog)}
              currentUserId={currentUser.id}
            />
          ))}
    </div>
  )
}

export default App
