import { useEffect, useState } from 'react'
import { fetchCityWeather, WeatherResponseProps, OptionsProps } from '../../api/fetchCity'

interface CityCardProps {
  city: WeatherResponseProps
  option: OptionsProps
  handleDelete: (id: number) => void
}
const CityCard: React.FC<CityCardProps> = ({city, option, handleDelete}) => {
  const [cityData, setCityData] = useState<WeatherResponseProps | null>(null)
  useEffect(() => {
    fetchCityWeather(city.name, option)
    .then((data) => {
      setCityData(data)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  , [city ,option])

  if(!cityData) return null

  return (
    <div>
    <h1>{cityData.name}</h1>
    <p>{cityData.main.temp}°</p>
    <button onClick={() => handleDelete(cityData.id)}>Remove</button>
  </div>
  )
}

export default CityCard