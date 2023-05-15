import { useState } from 'react'

const initialBlog = {
  title: '',
  author: '',
  url: '',
}

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState(initialBlog)

  const handleNewBlogChange = evt => {
    const value = evt.target.value
    setNewBlog({
      ...newBlog,
      [evt.target.name]: value,
    })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    createBlog(newBlog)
    setNewBlog(initialBlog)
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <form className='new-blog' onSubmit={onSubmit}>
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
    </div>
  )
}

export default BlogForm
