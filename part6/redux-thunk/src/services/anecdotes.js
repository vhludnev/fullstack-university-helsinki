import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}

const createNew = async content => {
  const object = { content, votes: 0 }
  const { data } = await axios.post(baseUrl, object)
  return data
}

const addVote = async anecdote => {
  const { id, votes } = anecdote
  const { data } = await axios.patch(`${baseUrl}/${id}`, { votes: votes + 1 })
  return data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew, addVote }
