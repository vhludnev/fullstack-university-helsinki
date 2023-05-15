import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}

const create = async newObject => {
  const config = { headers: { Authorization: token } }
  const { data } = await axios.post(baseUrl, newObject, config)
  return data
}

const update = async (id, newObject) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, newObject)
  return data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, setToken }
