import { useState, useEffect } from 'react'
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './utils/types'
import { createEntry, getAllEntries } from './utils/diaryService'

const initialEntry = {
  date: '',
  weather: 'sunny',
  visibility: 'great',
  comment: '',
}

const weatherKinds: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy']

const visibilityKinds: Visibility[] = ['great', 'good', 'ok', 'poor']

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [newDiaryEntry, setNewDiaryEntry] = useState(initialEntry)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getAllEntries().then(data => {
      setDiaryEntries(data)
    })
  }, [])

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()

    createEntry(newDiaryEntry as NewDiaryEntry).then(data => {
      if (typeof data === 'object') {
        setDiaryEntries(diaryEntries.concat(data as DiaryEntry))
      } else {
        setErrorMessage(data)
        setTimeout(() => setErrorMessage(''), 3000)
      }
    })

    setNewDiaryEntry(initialEntry)
  }

  return (
    <div>
      <h1>Add new entry</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={entryCreation}>
        <div>
          date{' '}
          <input
            value={newDiaryEntry.date}
            type='date'
            onChange={event => setNewDiaryEntry({ ...newDiaryEntry, date: event.target.value })}
          />
        </div>
        <div>
          visibility{' '}
          {visibilityKinds.map((v: Visibility, idx: number) => (
            <span key={idx}>
              <label htmlFor={v}>{v}</label>
              <input
                type='radio'
                value={v}
                id={v}
                onChange={event => setNewDiaryEntry({ ...newDiaryEntry, visibility: event.target.value })}
              />
            </span>
          ))}
        </div>
        <div>
          weather{' '}
          {weatherKinds.map((w: Weather, idx: number) => (
            <span key={idx}>
              <label htmlFor={w}>{w}</label>
              <input
                type='radio'
                value={w}
                id={w}
                onChange={event => setNewDiaryEntry({ ...newDiaryEntry, weather: event.target.value })}
              />
            </span>
          ))}
        </div>
        <div>
          comment{' '}
          <input
            value={newDiaryEntry.comment}
            onChange={event => setNewDiaryEntry({ ...newDiaryEntry, comment: event.target.value })}
          />
        </div>
        <button type='submit'>add</button>
      </form>
      <h2>Diary entries</h2>

      {diaryEntries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>

          <div>visibility: {entry.visibility}</div>
          <div>weather: {entry.weather}</div>
        </div>
      ))}
    </div>
  )
}

export default App
