import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: error => {
      const messages = error.graphQLErrors[0].message
      setError(messages)
    },
  })

  if (!show) {
    return null
  }

  const submit = async event => {
    event.preventDefault()

    await createBook({ variables: { title, published, author, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <form onSubmit={submit}>
        <div>
          title
          <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type='number' value={published} onChange={({ target }) => setPublished(+target.value)} />
        </div>
        <div>
          <input type='text' value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
