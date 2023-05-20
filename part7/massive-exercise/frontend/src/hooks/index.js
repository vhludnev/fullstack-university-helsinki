import { useMemo, useState } from 'react'
import axios from 'axios'

export const useResource = baseUrl => {
  const token = useMemo(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      return `Bearer ${user.token}`
    }
  }, [])

  const getResources = () => axios.get(baseUrl).then(res => res.data)

  const create = newObject => {
    const config = { headers: { Authorization: token } }
    return axios.post(baseUrl, newObject, config).then(response => response.data)
  }

  const update = newObject => {
    const config = { headers: { Authorization: token } }
    return axios.put(`${baseUrl}/${newObject.id}`, newObject, config).then(response => response.data)
  }

  const addComment = ({ id, title }) => {
    const config = { headers: { Authorization: token } }
    return axios.post(`${baseUrl}/${id}/comments`, { title }, config).then(response => response.data)
  }

  const remove = async id => {
    const config = { headers: { Authorization: token } }
    return await axios.delete(`${baseUrl}/${id}`, config)
  }

  const service = {
    getResources,
    create,
    update,
    remove,
    addComment,
  }

  return service
}

export const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}
