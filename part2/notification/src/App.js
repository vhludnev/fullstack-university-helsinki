import { useState, useEffect } from "react"
import personService from "./services/persons"
import Persons from "./components/Persons"
import Notification from "./components/Notification"
import PersonForm from "./components/PersonForm"
import Filter from "./components/Filter"

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterName, setFilterName] = useState("")
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const updatePersons = value => {
    setPersons(value)
  }

  const updateFilterName = value => {
    setFilterName(value)
  }

  const updateMessage = (status, text) => {
    setMessage({ status, text })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter name={filterName} updateFilterName={updateFilterName} />
      <h3>Add a new</h3>
      <PersonForm persons={persons} updatePersons={updatePersons} updateMessage={updateMessage} />
      <h3>Numbers</h3>
      <Persons
        persons={filteredPersons}
        updateMessage={updateMessage}
        updatePersons={updatePersons}
      />
    </div>
  )
}

export default App
