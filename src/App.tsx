import { useState } from 'react'
import './App.css'
import { fetchCityWeather, WeatherResponseProps } from './api/fetchCity'

function App() {
  const [cityName, setCityName] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherResponseProps>({} as WeatherResponseProps)
  const [error, setError] = useState('')

  const getCityWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchCityWeather(cityName)
      .then((data) => {
        setWeatherData(data)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <>
    <form onSubmit={(e) => getCityWeather(e)}>
      <input type="text" placeholder="City name" name="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)} />
      <button type='submit' disabled={cityName === ''}>Search</button>
    </form>
    {
      !!weatherData.main && (
        <div>
          <h1>{weatherData.name}</h1>
          <h2>{weatherData.main.temp}</h2>
          <h2>{weatherData.main.feels_like}</h2>
          <h2>{weatherData.main.humidity}</h2>
        </div>
      )
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
