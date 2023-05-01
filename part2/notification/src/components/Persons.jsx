import personService from "../services/persons"

const Person = ({ name, number, id, persons, updateMessage, updatePersons }) => {
  const removePerson = () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          updatePersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          updateMessage("error", `Information of ${name} has already been removed from server`)
          setTimeout(() => updateMessage(null), 5000)
          updatePersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      {name} {number} <button onClick={removePerson}>delete</button>
    </div>
  )
}

const Persons = ({ persons, updateMessage, updatePersons }) =>
  persons.map(person => (
    <Person
      persons={persons}
      key={person.id}
      updatePersons={updatePersons}
      updateMessage={updateMessage}
      {...person}
    />
  ))

export default Persons
