import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import FavoriteBooks from './components/FavoriteBooks'
import LoginForm from './components/LoginForm'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_USER } from './queries'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red', paddingTop: '25px' }}>{errorMessage}</div>
}

const App = () => {
  const [token, setToken] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const { data } = useQuery(GET_USER, { skip: !token })

  useEffect(() => {
    const tokenExists = localStorage.getItem('phonenumbers-user-token')
    if (tokenExists) {
      setToken(tokenExists)
    }
  }, [])

  const currentUser = data?.me

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

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const toggleLoginShow = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div>
      <div>
        <button onClick={() => changePage('authors')}>authors</button>
        <button onClick={() => changePage('books')}>books</button>
        {currentUser ? (
          <>
            <button onClick={() => changePage('add')}>add book</button>
            <button onClick={() => changePage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={toggleLoginShow}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <LoginForm setToken={setToken} setError={notify} showLogin={showLogin} toggleLoginShow={toggleLoginShow} />
      <Authors show={page === 'authors'} setError={notify} user={currentUser} />
      <Books show={page === 'books'} user={currentUser} />
      <FavoriteBooks show={page === 'recommend'} user={currentUser} changePage={changePage} />
      <NewBook show={page === 'add'} setError={notify} user={currentUser} changePage={changePage} />
    </div>
  )
}

export default App
