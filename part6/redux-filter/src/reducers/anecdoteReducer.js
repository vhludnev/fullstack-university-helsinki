const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return state.concat(action.payload)
    case 'VOTE': {
      const id = action.payload.id
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      return state.map(anecdote => (anecdote.id !== id ? anecdote : changedAnecdote))
    }
    default:
      return state
  }
}

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

export const createAnecdote = content => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      votes: 0,
      id: generateId(),
    },
  }
}

export const vote = id => {
  return {
    type: 'VOTE',
    payload: { id },
  }
}

export default anecdoteReducer
