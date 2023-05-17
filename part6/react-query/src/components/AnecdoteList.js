import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from '../requests'

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
  const queryClient = useQueryClient()

  const {
    data: anecdotes,
    isLoading,
    isError,
  } = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData(
        'anecdotes',
        anecdotes.map(anecdote => (anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
      )
    },
  })

  const handleVote = anecdote => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
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
