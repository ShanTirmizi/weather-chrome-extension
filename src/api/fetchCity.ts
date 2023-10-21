export interface WeatherResponseProps {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export const fetchCityWeather = async (cityName: string): Promise<WeatherResponseProps> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`;
  
  try {
    const response = await fetch(url);

    // Check if the response status is not OK (e.g., 404 or 500)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
        console.error("There was a problem with the fetch operation:", error.message);
        throw error; // Re-throwing the error to be handled by the caller
    } else {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("An unknown error occurred during the fetch operation.");
    }
  }
};
