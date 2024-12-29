import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherService';

interface WeatherState {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: [{
    main: string;
    description: string;
    icon: string;
  }];
  wind: {
    speed: number;
  };
  name: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData();
        
        setWeather({
          main: {
            temp: data.temp,
            feels_like: data.feelsLike,
            humidity: data.humidity
          },
          weather: [{
            main: data.condition,
            description: data.description,
            icon: data.icon
          }],
          wind: {
            speed: data.windSpeed
          },
          name: data.cityName
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
};
