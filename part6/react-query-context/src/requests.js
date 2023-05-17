import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async newAnecdote => {
  if (newAnecdote.content.length > 4) {
    const { data } = await axios.post(baseUrl, newAnecdote)
    return data
  }
  throw new Error('too short anecdote, must have length 5 or more')
}

export const updateAnecdote = updateAnecdote =>
  axios.put(`${baseUrl}/${updateAnecdote.id}`, updateAnecdote).then(res => res.data)
