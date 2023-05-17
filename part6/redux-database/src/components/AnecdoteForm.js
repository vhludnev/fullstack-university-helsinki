import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async evt => {
    evt.preventDefault()
    const content = evt.target.anecdote.value
    evt.target.anecdote.value = ''

    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))

    dispatch(setNotification(`you created '${content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000)
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
