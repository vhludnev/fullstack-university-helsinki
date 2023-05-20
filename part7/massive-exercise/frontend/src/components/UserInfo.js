import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const UserInfo = ({ user }) => {
  const { name, blogs } = user

  return (
    <>
      <Typography variant='h4'>{name}</Typography>
      <Typography variant='h5' sx={{ my: '1rem' }}>
        added blogs
      </Typography>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default UserInfo
