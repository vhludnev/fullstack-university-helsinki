import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h2>Anecdote app</h2>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
