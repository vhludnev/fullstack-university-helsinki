import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const FavoriteBooks = ({ show, user, changePage }) => {
  const [books, setBooks] = useState([])
  const { data, loading } = useQuery(ALL_BOOKS)

  useEffect(() => {
    !user && show && changePage('books')
  }, [user, show]) // eslint-disable-line

  useEffect(() => {
    data?.allBooks && setBooks(data.allBooks)
  }, [data?.allBooks])

  const filterValue = user?.favoriteGenre

  useEffect(() => {
    filterValue && setBooks(data?.allBooks.filter(b => b.genres.includes(filterValue)))
  }, [filterValue, data?.allBooks])

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (!books.length) {
    return <div style={{ padding: '20px 0', fontWeight: 'bold' }}>no books</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{user?.favoriteGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FavoriteBooks
