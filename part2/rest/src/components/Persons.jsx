import personService from "../services/persons"

const Person = ({ name, number, id, persons, updatePersons }) => {
  const removePerson = () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
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

const Persons = ({ persons, updatePersons }) =>
  persons.map(person => (
    <Person persons={persons} key={person.id} updatePersons={updatePersons} {...person} />
  ))

export default Persons
