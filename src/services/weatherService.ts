import axios from 'axios';

const API_KEY = 'ae219ac2a4661a371f18b060a49cf097'; // Using your first API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Attingal coordinates
const DEFAULT_LAT = 8.6967;
const DEFAULT_LON = 76.8144;

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  cityName: string;
  feelsLike: number;
  description: string;
}

export const getWeatherData = async (lat: number = DEFAULT_LAT, lon: number = DEFAULT_LON): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric', // For Celsius
      }
    });

    return {
      temp: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
      condition: response.data.weather[0].main,
      icon: response.data.weather[0].icon,
      cityName: response.data.name,
      feelsLike: Math.round(response.data.main.feels_like),
      description: response.data.weather[0].description
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
