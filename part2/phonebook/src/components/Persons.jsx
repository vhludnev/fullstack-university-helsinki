const Person = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
)

const Persons = ({ persons }) => persons.map(({ id, ...rest }) => <Person key={id} {...rest} />)

export default Persons
