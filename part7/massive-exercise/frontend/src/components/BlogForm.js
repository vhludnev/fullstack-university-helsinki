import { forwardRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNotify } from '../NotificationContext'
import { useResource } from '../hooks'
import { Button, TextField } from '@mui/material'

const initialBlog = {
  title: '',
  author: '',
  url: '',
}

const BlogForm = forwardRef((props, ref) => {
  const [newBlog, setNewBlog] = useState(initialBlog)
  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const blogService = useResource('/api/blogs')

  const { mutate: addBlogMutation } = useMutation(blogService.create, {
    retry: 1,
    onSuccess: ({ title }) => {
      ref.current.toggleVisibility()
      queryClient.invalidateQueries('blogs')
      notifyWith(`blog '${title}' created`)
    },
    onError: error => {
      console.log(error)
      notifyWith(error.response.data.error)
    },
  })

  const handleNewBlogChange = evt => {
    const value = evt.target.value
    setNewBlog({
      ...newBlog,
      [evt.target.name]: value,
    })
  }

  const onSubmit = evt => {
    evt.preventDefault()

    addBlogMutation(newBlog)
    setNewBlog(initialBlog)
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <form className='new-blog' onSubmit={onSubmit}>
        <div>
          <TextField
            size='small'
            label='title'
            value={newBlog.title}
            placeholder='write blog name here'
            name='title'
            onChange={handleNewBlogChange}
          />
        </div>
        <div>
          <TextField
            size='small'
            sx={{ my: '.5rem' }}
            label='author'
            value={newBlog.author}
            placeholder='write author name here'
            name='author'
            onChange={handleNewBlogChange}
          />
        </div>
        <div>
          <TextField
            size='small'
            label='url'
            value={newBlog.url}
            placeholder='write blog url here'
            name='url'
            onChange={handleNewBlogChange}
          />
        </div>
        <Button sx={{ mt: '1rem' }} variant='contained' id='create-blog' type='submit'>
          create
        </Button>
      </form>
    </div>
  )
})

export default BlogForm
