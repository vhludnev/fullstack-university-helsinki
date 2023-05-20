import { useState } from 'react'
import { useCountry } from './hooks'

const Country = ({ country }) => {
  const { name, capital, population, flags } = country

  if (country === 'not found') {
    return <div>not found...</div>
  }

  return (
    <>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <picture>
        <img src={flags.image} alt={flags.alt} width='auto' height='150' />
      </picture>
    </>
  )
}

const App = () => {
  const [value, setValue] = useState('')
  const [name, setName] = useState(null)
  const { country, resetCountry } = useCountry(name)

  const handleChange = event => {
    setValue(event.target.value)
    resetCountry()
  }

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
        <button onClick={() => setName(value)}>find</button>
      </div>
      {country && <Country country={country} />}
    </div>
  )
}

export default App
