import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const initialBlog = {
  title: '',
  author: '',
  url: '',
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(initialBlog)
  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      updateMessage('success', `User ${user.username} logged in`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      updateMessage('error', exception.response.data.error)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = event => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    updateMessage('success', `user logged out`)
    setTimeout(() => setMessage(null), 5000)
  }

  const handleNewBlogChange = evt => {
    const value = evt.target.value
    setNewBlog({
      ...newBlog,
      [evt.target.name]: value,
    })
  }

  const addBlog = async event => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog(initialBlog)

      updateMessage('success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      updateMessage('error', exception.response.data.error)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const blogForm = () => (
    <>
      <h2>create new</h2>
      <form className='new-blog' onSubmit={addBlog}>
        <div>
          title: <input value={newBlog.title} name='title' onChange={handleNewBlogChange} />
        </div>
        <div>
          author: <input value={newBlog.author} name='author' onChange={handleNewBlogChange} />
        </div>
        <div>
          url: <input value={newBlog.url} name='url' onChange={handleNewBlogChange} />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      {/*  {!user && loginForm()} */}
      {user && (
        <div style={{ width: '50%' }}>
          <p>
            {user.name} logged in{' '}
            <button type='primary' onClick={handleLogout}>
              logout
            </button>
          </p>
          {blogForm()}
        </div>
      )}

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
