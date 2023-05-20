import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

const BlogList = forwardRef(({ blogs }, ref) => {
  return (
    <>
      <Togglable buttonLabel='create new' ref={ref}>
        <BlogForm ref={ref} />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <TableRow /* style={blogStyle} className='blog' */ key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
})

export default BlogList
