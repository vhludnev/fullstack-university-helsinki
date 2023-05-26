import { useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_AUTHORS, UPDATE_BORN } from '../queries'

const Authors = ({ show, setError, user }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const { data, loading } = useQuery(ALL_AUTHORS)

  const [updateBorn, result] = useMutation(UPDATE_BORN, {
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const updatedAuthor = response.data.editAuthor
        return {
          allAuthors: allAuthors.map(a => (a.id === updatedAuthor.id ? updatedAuthor : a)),
        }
      })
    },
    onCompleted: () => {
      setName('')
      setBorn('')
    },
  })

  const submit = async event => {
    event.preventDefault()

    updateBorn({ variables: { name, setBornTo: born } })
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found')
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (!data.allAuthors.length) {
    return <div style={{ padding: '20px 0', fontWeight: 'bold' }}>no authors</div>
  }

  const updateAuthor = () => (
    <>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        name
        <select value={name} onChange={({ target }) => setName(target.value)}>
          <option value=''></option>
          {data.allAuthors.map(a => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input type='number' value={born} onChange={({ target }) => setBorn(+target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </>
  )

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {user && updateAuthor()}
    </div>
  )
}

export default Authors
