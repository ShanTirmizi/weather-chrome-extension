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


  if (!options) return <p className="text-center mt-10 text-xl text-black">Loading...</p>;
  return (
    <div className="min-h-screen bg-warmGray-100 flex flex-col items-center justify-center">
      <div className="container max-w-lg p-6 rounded-xl shadow-lg bg-yellow-300">
        <h1 className="text-2xl mb-5 text-center text-black"><b>Weather Options</b></h1>
        <form onSubmit={(e) => getCityWeather(e)} className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-black mb-2">Select a default city</label>
          <input 
            className="w-full px-3 py-2 border rounded-md text-black bg-yellow-200" 
            id="city"
            type="text" 
            value={defaultCity}
            placeholder="City name"
            onChange={(e) => setDefaultCity(e.target.value)} 
          />
          <button 
            className="mt-3 w-full bg-black text-yellow-200 p-2 rounded-md hover:bg-gray-800 transition duration-300 cursor-pointer" 
            type="submit" 
            disabled={!options}>
            Save
          </button>
        </form>
        <div className="mb-4">
          <label htmlFor="scale" className="block text-sm font-medium text-black mb-2">Temperature Scale</label>
          <select 
            className="w-full px-3 py-2 border rounded-md text-black cursor-pointer bg-yellow-200"
            id="scale"
            name="option" 
            value={options.tempScale} 
            onChange={(e) => setOptions({ ...options, tempScale: e.target.value } as LocalStorageOptions)}
          >
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {cityData && (
          <div className="text-center text-black border border-black mx-2 rounded-md">
            <p className="text-xl font-bold">{cityData?.name}</p>
            <p className="text-lg">{cityData?.main.temp}°</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Options;