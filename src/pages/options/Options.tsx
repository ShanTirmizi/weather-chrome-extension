import React, { useEffect } from 'react';
import '../../index.css';
import { WeatherResponseProps, fetchCityWeather } from '../../api/fetchCity';
import { LocalStorageOptions, getStoredDefaultCity, getStoredOptions, setDefaultStoredCity, setStoredOptions } from '../../api/storage';

const Options: React.FC = () => {
  const [defaultCity, setDefaultCity] = React.useState<string>('');
  const [options, setOptions] = React.useState<LocalStorageOptions | null>(null);
  const [cityData, setCityData] = React.useState<WeatherResponseProps | null>(null)
  const [error, setError] = React.useState<string>('');


  const getCityWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDefaultCity('')
    setError('')
    if(!options) return setError('Please select a temperature scale')
    fetchCityWeather(defaultCity, options)
    .then((data) => {
      setCityData(data)
      setOptions({ ...options, defaultCity } as LocalStorageOptions)
      setDefaultStoredCity(data)
    }).catch((err) => {
      setError(err.message)
    }) 
  }

  useEffect(() => {
    getStoredOptions().then((data) => {
      setOptions(data);
    });
    getStoredDefaultCity().then((data) => {
      setCityData(data);
    });
  }, []);

useEffect(() => {
  if (options) {
    setStoredOptions(options);
  }
}, [options]);

useEffect(() => {
  if (options?.defaultCity) {
    fetchCityWeather(options.defaultCity, options)
      .then((data) => {
        setCityData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }
}, [options]);


  if (!options) return <p>Loading...</p>
  return (
    <>
      <div className="container text-lime-400">
        <form onSubmit={(e) => getCityWeather(e)}>
          <input type="text" value={defaultCity} onChange={(e) => setDefaultCity(e.target.value)} />
          <button type="submit" disabled={!options}>Save</button>
        </form>
      </div>
      <div className="container text-lime-400">
        <select name="option" value={options.tempScale} onChange={(e) => setOptions({ ...options, tempScale: e.target.value } as LocalStorageOptions)}>
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
      </div>
      <div className="container text-lime-400">
        <p>{error}</p>
        <p>{cityData?.name}</p>
        <p>{cityData?.main.temp}</p>
      </div>
    </>
  );
};

export default Options;