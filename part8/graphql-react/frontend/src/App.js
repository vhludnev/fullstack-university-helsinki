import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red', paddingTop: '25px' }}>{errorMessage}</div>
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const changePage = name => {
    setPage(name)
    setErrorMessage(null)
  }

  return (
    <div>
      <div>
        <button onClick={() => changePage('authors')}>authors</button>
        <button onClick={() => changePage('books')}>books</button>
        <button onClick={() => changePage('add')}>add book</button>
      </div>
      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} setError={notify} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setError={notify} />
    </div>
  )
}

export default App
