import { createSlice } from '@reduxjs/toolkit'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        votes: 0,
        id: generateId(),
      })
    },
    vote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      return state.map(anecdote => (anecdote.id !== id ? anecdote : changedAnecdote))
    },
  },
})

export const { createAnecdote, vote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
