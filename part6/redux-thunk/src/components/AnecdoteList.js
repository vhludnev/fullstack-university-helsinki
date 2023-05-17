import { useDispatch, useSelector } from 'react-redux'
import { updateVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLocaleLowerCase()))
  )

  const handleVote = anecdote => {
    dispatch(updateVotes(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5000))
  }

  return (
    <>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={() => handleVote(anecdote)} />
        ))}
    </>
  )
}

export default AnecdoteList
