import { useEffect, useState } from 'react'
import './App.css'
import { fetchCityWeather } from './api/fetchCity'
import { getStoredCities, setStoredCities } from './api/storage'

function App() {
  const [cityName, setCityName] = useState('')
  // const [cities, setCities] = useState<{
  //   id: number
  //   weatherData: WeatherResponseProps
  // }[]>([])
  const [cities, setCities] = useState<string[]>([])
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
          setCities((prevCities: string[]) => [...prevCities, data.name ])
          setStoredCities([...cities,data.name])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    getStoredCities().then((data: string[]) => {
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
      cities.map((city, index) => (
        <div key={index}>
          <h1>{city}</h1>
          <button>Remove</button>
        </div>
      ))
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
