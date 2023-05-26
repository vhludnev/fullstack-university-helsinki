import { useMutation, useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_USER, UPDATE_USER } from '../queries'
import { useState, useMemo } from 'react'

const Books = ({ show, user }) => {
  const [filterValue, setFilterValue] = useState(null)
  const { data, loading, refetch } = useQuery(ALL_BOOKS, { fetchPolicy: 'cache-and-network' })
  const { data: initial } = useQuery(ALL_BOOKS)
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USER }],
  })

  const genres = useMemo(() => {
    return [...new Set(initial?.allBooks.map(b => b.genres).flat())]
  }, [initial?.allBooks])

  const filter = e => {
    if (e.target.textContent === 'all') {
      setFilterValue(null)
      refetch({ genre: undefined })
      return
    }
    setFilterValue(e.target.textContent)
    refetch({ genre: e.target.textContent })
  }

  const changeFavoriteGenre = async () => updateUser({ variables: { setGenreTo: filterValue } })

  if (!show) {
    return null
  }

  if (!data.allBooks.length) {
    return <div style={{ padding: '20px 0', fontWeight: 'bold' }}>no books</div>
  }

  return (
    <div>
      <h2>books</h2>
      {loading && <div>loading...</div>}
      {filterValue && (
        <div>
          in genre <b>{filterValue} </b>
          {user && <button onClick={changeFavoriteGenre}>set as my favourite genre</button>}
        </div>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data?.allBooks.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={filter}>all</button>
      {genres.map((g, idx) => (
        <button key={idx} onClick={filter}>
          {g}
        </button>
      ))}
    </div>
  )
}

export default Books
