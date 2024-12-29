import axios from 'axios';

const API_KEY = 'ae219ac2a4661a371f18b060a49cf097';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Attingal coordinates
const lat = 8.6967;
const lon = 76.8144;

async function getWeatherData() {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric', // For Celsius
      }
    });

    const weather = {
      temp: Math.round(response.data.main.temp),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6),
      condition: response.data.weather[0].main,
      icon: response.data.weather[0].icon,
      cityName: response.data.name,
      feelsLike: Math.round(response.data.main.feels_like),
      description: response.data.weather[0].description
    };

    console.log('Weather in Attingal:', weather);
  } catch (error) {
    console.error('Error fetching weather:', error.response?.data || error.message);
  }
}

getWeatherData();
