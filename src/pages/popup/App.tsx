import { useEffect, useState, useRef } from 'react'
import './App.css'
import { fetchCityWeather, WeatherResponseProps } from '../../api/fetchCity'
import { getStoredCities, getStoredOptions, setStoredCities, setStoredOptions, LocalStorageOptions } from '../../api/storage'
import CityCard from '../../components/CityCard'

function App() {
  const [cityName, setCityName] = useState('')
  const [cities, setCities] = useState<WeatherResponseProps[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [option, setOption] = useState<LocalStorageOptions>({
    tempScale: 'metric'
  })
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
    inputRef.current?.focus()
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

  if (!option) return <p>Loading...</p>

  return (
    <>
      <form className="bg-yellow-300 p-4 rounded-lg" onSubmit={(e) => getCityWeather(e)}>
        <input
          className="bg-yellow-200 p-2 rounded-md w-full mb-2 text-black"
          type="text"
          placeholder="City name"
          name="cityName"
          value={cityName}
          ref={inputRef}
          onChange={(e) => setCityName(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <button className="bg-black text-yellow-300 p-2 rounded-md cursor-pointer" type='submit' disabled={cityName === ''}>Search</button>
          <select className="bg-yellow-200 p-2 rounded-md text-black cursor-pointer" name="option" value={option.tempScale} onChange={(e) => setOption({ ...option, tempScale: e.target.value } as LocalStorageOptions)}>
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
          </div>
      </form>
      {
        loading && (
          <div className="bg-yellow-200 p-4 rounded-lg mt-2">
            <h1 className="text-center">Loading...</h1>
          </div>
        )
      }
      {
        !!error && (
          <div className="bg-yellow-200 p-4 rounded-lg mt-2">
            <h1 className="text-center">{error}</h1>
          </div>
        )
      }
      {
        cities.map(city => (
          <CityCard city={city}  option={option} handleDelete={handleDelete} />
        ))
      }
    </>
  )
}

export default App
