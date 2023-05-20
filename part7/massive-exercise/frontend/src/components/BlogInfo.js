import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useResource } from '../hooks'
import { useNotify } from '../NotificationContext'
import { useUserData } from '../UserContext'
import { Box, Button, TextField, Typography } from '@mui/material'

const BlogInfo = ({ blog }) => {
  const [comment, setComment] = useState('')
  const { title, author, likes, url, user, comments } = blog
  const blogService = useResource('/api/blogs')
  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const navigate = useNavigate()

  const currentUser = useUserData()

  const likeMutation = useMutation(blogService.update, {
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries('blogs')
      notifyWith(`blog '${title}' liked`)
    },
    onError: error => {
      notifyWith(error.response.data.error)
    },
  })

  const updateLikes = blogObject => {
    const { likes, user, ...rest } = blogObject

    const newObject = { likes: likes + 1, user: user.id, ...rest }
    likeMutation.mutate(newObject)
  }

  const deleteMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      notifyWith('blog removed')
      navigate('/')
    },
    onError: error => {
      notifyWith(error.response.data.error)
    },
  })

  const deleteBlog = blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  const addCommentMutation = useMutation(blogService.addComment, {
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries('blogs')
      notifyWith(`comment '${title}' added`)
    },
    onError: error => {
      notifyWith(error.response.data.error)
    },
  })

  const newComment = () => {
    const newCommentObj = { id: blog.id, title: comment }

    addCommentMutation.mutate(newCommentObj)
    setComment('')
  }

  return (
    <>
      <div>
        <Typography variant='h4'>
          {title} {author}
        </Typography>
        <Link to={url}>{url}</Link>
        <div>
          {likes} likes
          <Button sx={{ m: '1rem' }} color='info' size='small' variant='contained' onClick={() => updateLikes(blog)}>
            like
          </Button>
        </div>
        <Box sx={{ typography: 'body1' }}>added by {user.name}</Box>
        {currentUser.id === user.id && (
          <Button color='error' sx={{ mt: '1rem' }} size='small' variant='contained' onClick={() => deleteBlog(blog)}>
            remove
          </Button>
        )}
      </div>
      <h3>comments</h3>
      <TextField
        sx={{ mb: '1rem' }}
        label='add comment'
        size='small'
        type='text'
        value={comment}
        onChange={evt => setComment(evt.target.value)}
      />
      <Button color='success' variant='contained' size='small' sx={{ ml: '1rem', mt: '.2rem' }} onClick={newComment}>
        add
      </Button>
      <ul>
        {comments?.map(comment => (
          <li key={comment._id}>{comment.title}</li>
        ))}
      </ul>
    </>
  )
}

export default BlogInfo
