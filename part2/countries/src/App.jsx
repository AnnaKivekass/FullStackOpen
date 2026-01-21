import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OWM_KEY

  useEffect(() => {
    if (!capital) return

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric`

    axios.get(url).then((response) => {
      setWeather(response.data)
    })
  }, [capital, apiKey])

  if (!weather) return <div>Loading weather...</div>

  const temp = weather.main?.temp
  const wind = weather.wind?.speed
  const icon = weather.weather?.[0]?.icon
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>temperature {temp} Celsius</div>
      {iconUrl && <img src={iconUrl} alt="weather icon" />}
      <div>wind {wind} m/s</div>
    </div>
  )
}

const Country = ({ country }) => {
  if (!country) return null

  const languages = country.languages ? Object.values(country.languages) : []
  const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital
  const flagPng = country.flags?.png

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {capital}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      {flagPng && (
        <img
          src={flagPng}
          alt={`flag of ${country.name.common}`}
          width="150"
        />
      )}

      <Weather capital={capital} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const countriesToShow =
    filter === ''
      ? []
      : countries.filter((c) =>
          c.name.common.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      <div>
        {countriesToShow.length > 10 && (
          <div>Too many matches, specify another filter</div>
        )}

        {countriesToShow.length <= 10 &&
          countriesToShow.length > 1 &&
          countriesToShow.map((c) => (
            <div key={c.cca3}>
              {c.name.common}{' '}
              <button onClick={() => setSelectedCountry(c)}>show</button>
            </div>
          ))}

        {countriesToShow.length === 1 && (
          <Country country={countriesToShow[0]} />
        )}

        {selectedCountry && (
          <Country country={selectedCountry} />
        )}
      </div>
    </div>
  )
}

export default App

