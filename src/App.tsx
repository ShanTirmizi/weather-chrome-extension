import { useEffect, useState } from 'react'
import './App.css'
import { fetchCityWeather, WeatherResponseProps } from './api/fetchCity'
import { getStoredCities, setStoredCities } from './api/storage'

function App() {
  const [cityName, setCityName] = useState('')
  const [cities, setCities] = useState<WeatherResponseProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getCityWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCityName('')
    setLoading(true)
    fetchCityWeather(cityName)
    .then((data) => {
      if(cities.length > 3) {
        setError('You can only add 4 cities')
      } else {
        setCities((prevCities) => [...prevCities, data ])
        setStoredCities([...cities,data])
      }
      setLoading(false)
    })
    .catch((err) => {
      setError(err.message)
      setLoading(false)
    })
  }

  const handleDelete = (id: number) => {
    const newCities = cities.filter(city => city.id !== id)
    setCities(newCities)
    setStoredCities(newCities)
  }

  useEffect(() => {
    getStoredCities().then((data: WeatherResponseProps[]) => {
      setCities(data)
    })
  }, []);



  useEffect(() => {
    chrome.storage.sync.set({ cities: cities });
  }, [cities])

  return (
    <>
      <form onSubmit={(e) => getCityWeather(e)}>
        <input type="text" placeholder="City name" name="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)} />
        <button type='submit' disabled={cityName === ''}>Search</button>
      </form>
      {
        loading && (
          <div>
            <h1>Loading...</h1>
          </div>
        )
      }
      {
        cities.map(city => {
          const { id, name } = city
          return (
            <div key={id}>
              <h1>{name}</h1>
              <button onClick={() => handleDelete(id)}>Remove</button>
            </div>
          )
        })
      }
      {
        !!error && (
          <div>
            <h1>{error}</h1>
          </div>
        )
      }
    </>
  )
}

export default App
