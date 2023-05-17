import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: newAnecdote => {
      if (newAnecdote) {
        const anecdotes = queryClient.getQueryData('anecdotes')
        queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
      }
    },
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
        <input name='anecdote' /> <br />
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
