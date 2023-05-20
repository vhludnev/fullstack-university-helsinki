import { useEffect, useState } from 'react'
import axios from 'axios'

const transformCountryData = countryData => {
  const { name, capital, population, flags } = countryData

  return {
    name: name.common,
    capital,
    population,
    flags: { alt: flags.alt, image: flags.svg },
  }
}

export const useCountry = name => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      axios
        .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        .then(response => {
          setCountry(transformCountryData(response.data[0]))
        })
        .catch(err => {
          err.response.status === 404 && setCountry('not found')
          return
        })
    }
  }, [name])

  const resetCountry = () => setCountry(null)

  return {
    country,
    resetCountry,
  }
}
