import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, currentUserId }) => {
  const [visible, setVisible] = useState(false)

  const { title, author, likes, url, user } = blog

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <div className='blog-title'>
          {title} {author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        </div>
        {visible && (
          <div className='nonvisiblecontent'>
            <div>{url}</div>
            <div>
              likes {likes} <button onClick={updateLikes}>like</button>
            </div>
            <div id='blog-creator'>{user.name}</div>
            {currentUserId === user.id && <button onClick={deleteBlog}>remove</button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
