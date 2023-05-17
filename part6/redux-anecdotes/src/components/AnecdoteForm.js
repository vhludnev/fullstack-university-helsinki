import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = evt => {
    evt.preventDefault()
    const content = evt.target.anecdote.value
    evt.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name='anecdote' />
      <button type='submit'>add</button>
    </form>
  )
}

export default AnecdoteForm
