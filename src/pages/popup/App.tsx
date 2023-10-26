import { useEffect, useState } from 'react'
import './App.css'
import { fetchCityWeather, WeatherResponseProps, OptionsProps } from '../../api/fetchCity'
import { getStoredCities, getStoredOptions, setStoredCities, setStoredOptions } from '../../api/storage'
import CityCard from '../../components/CityCard'

function App() {
  const [cityName, setCityName] = useState('')
  const [cities, setCities] = useState<WeatherResponseProps[]>([])
  const [option, setOption] = useState<OptionsProps>('metric')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getCityWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCityName('')
    setLoading(true)
    fetchCityWeather(cityName, option)
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

    getStoredOptions().then((data) => {
      setOption(data)
    })
  }, []);



  useEffect(() => {
    chrome.storage.sync.set({ cities, option });
    setStoredOptions(option)
  }, [cities, option])

  return (
    <>
      <form onSubmit={(e) => getCityWeather(e)}>
        <input type="text" placeholder="City name" name="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)} />
        <button type='submit' disabled={cityName === ''}>Search</button>
        <select name="option" value={option} onChange={(e) => setOption(e.target.value as OptionsProps)}>
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
      </form>
      {
        loading && (
          <div>
            <h1>Loading...</h1>
          </div>
        )
      }
      {
        cities.map(city => (
          <CityCard city={city}  option={option} handleDelete={handleDelete} />
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
