import { useState } from "react"
import personService from "../services/persons"

const PersonForm = ({ persons, updatePersons }) => {
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const addPerson = event => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.map(({ name }) => name).includes(newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const personExists = persons.find(p => p.name === newName)

        return personService.update(personExists.id, personObject).then(returnedPerson => {
          updatePersons(
            persons.map(person => (person.id !== personExists.id ? person : returnedPerson))
          )
        })
      }
    }

    return personService.create(personObject).then(returnedPerson => {
      updatePersons(persons.concat(returnedPerson))
      setNewName("")
      setNewNumber("")
    })
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

export default PersonForm
