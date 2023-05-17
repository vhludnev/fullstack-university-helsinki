import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { useUpdateNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const updateNotification = useUpdateNotification()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: newAnecdote => {
      if (newAnecdote) {
        const anecdotes = queryClient.getQueryData('anecdotes')
        queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
        updateNotification({ payload: { message: `anecdote '${newAnecdote.content}' created` } })
      }
    },
    onError: err => updateNotification({ payload: { error: err.message } }),
  })

  const addAnecdote = async evt => {
    evt.preventDefault()
    const content = evt.target.anecdote.value
    evt.target.anecdote.value = ''

    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
