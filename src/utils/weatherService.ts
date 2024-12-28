import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CITY = 'Thiruvananthapuram';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  timestamp: string;
}

export async function getWeatherData() {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not found in environment variables');
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (response.status !== 200) {
      throw new Error(`Weather API returned status ${response.status}`);
    }

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      description: data.weather[0].description,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

export function generateWeatherPrompt(weatherData: any): string {
  try {
    const { temperature, humidity, windSpeed, description } = weatherData;
    
    // Format time for broadcast
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `
      Good ${getTimeOfDay()}, listeners! Here's your current weather update for ${CITY}.
      
      At ${timeString}, the temperature is ${temperature}°C with ${description}. 
      The humidity level is ${humidity}%, and we're experiencing wind speeds of ${windSpeed} kilometers per hour.
      
      ${getWeatherAdvice(temperature, description)}
      
      Stay tuned for more updates throughout the day!
    `.trim();
  } catch (error) {
    console.error('Error generating weather prompt:', error);
    return 'We apologize, but we are currently experiencing technical difficulties with our weather service. We will return with the weather update shortly.';
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getWeatherAdvice(temperature: number, description: string): string {
  let advice = '';
  
  if (temperature > 30) {
    advice = "It's quite hot today, so remember to stay hydrated and try to stay in the shade when possible.";
  } else if (temperature < 20) {
    advice = "It's relatively cool today, consider bringing a light jacket if you're heading out.";
  }

  if (description.includes('rain')) {
    advice += " Don't forget your umbrella!";
  } else if (description.includes('cloud')) {
    advice += " Expect some cloud cover throughout the day.";
  } else if (description.includes('clear')) {
    advice += " It's a beautiful day to spend some time outdoors!";
  }

  return advice;
}
