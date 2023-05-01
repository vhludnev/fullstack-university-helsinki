import { useState, useEffect } from "react"
import axios from "axios"
import { fetchWeather } from "./services/fetchWeather"

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const { name, capital, area, languages, flags } = country

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchWeather(capital.toString())
      setWeather(response)
    }
    fetchData()
  }, [capital])

  return (
    <>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>area {area}</div>
      <h2>languages:</h2>
      <ul>
        {languages.map((lang, idx) => (
          <li key={idx}>{lang}</li>
        ))}
      </ul>
      <picture>
        <img src={flags.image} alt={flags.alt} width='auto' height='150' />
      </picture>
      {weather && (
        <>
          <h1>Weather in {weather.name}</h1>
          <div>temperature {weather.main.temp} Celsius</div>
          <picture>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              width='150'
              height='150'
              alt={`${weather.weather[0].description}`}
            />
          </picture>
          <div>wind {weather.wind.speed} m/s</div>
        </>
      )}
    </>
  )
}

const CountryList = ({ countries, show, updateShow }) => {
  if (!countries) return null

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  if (countries.length <= 10) {
    return typeof show === "number" ? (
      <Country country={countries[show]} />
    ) : (
      countries.map((c, idx) => (
        <div key={c.name}>
          {c.name} <button onClick={() => updateShow(idx)}>show</button>
        </div>
      ))
    )
  }

  return <div>Too many matches, specify another filter</div>
}

const App = () => {
  const [value, setValue] = useState("")
  const [countries, setCountries] = useState(null)
  const [list, setList] = useState(null)
  const [show, setShow] = useState(null)

  const transformCountryData = countryData => {
    const { name, capital, area, languages, flags } = countryData

    return {
      name: name.common,
      capital,
      area,
      languages: Object.values(languages || {}),
      flags: { alt: flags.alt, image: flags.svg },
    }
  }

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then(response => {
      setCountries(response.data.map(resp => transformCountryData(resp)))
    })
  }, [])

  useEffect(() => {
    if (value && countries) {
      setList(
        countries
          .filter(country => country.name.toLowerCase().includes(value.toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    }
  }, [value, countries])

  const handleChange = event => {
    setShow(null)
    setValue(event.target.value)
  }

  const updateShow = value => setShow(value)

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
      </div>
      {countries && value && <CountryList countries={list} show={show} updateShow={updateShow} />}
    </div>
  )
}

export default App
