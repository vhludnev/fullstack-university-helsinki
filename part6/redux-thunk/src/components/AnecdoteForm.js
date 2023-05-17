import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = evt => {
    evt.preventDefault()
    const content = evt.target.anecdote.value
    evt.target.anecdote.value = ''

    dispatch(createAnecdote(content))
    dispatch(setNotification(`new anecdote '${content}'`, 5000))
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
