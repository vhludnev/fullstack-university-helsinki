import { useState, useEffect } from "react"
import axios from "axios"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import Filter from "./components/Filter"

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterName, setFilterName] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then(response => {
      setPersons(response.data)
    })
  }, [])

  const updatePersons = value => {
    setPersons(value)
  }

  const updateFilterName = value => {
    setFilterName(value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={filterName} updateFilterName={updateFilterName} />
      <h3>Add a new</h3>
      <PersonForm persons={persons} updatePersons={updatePersons} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App
