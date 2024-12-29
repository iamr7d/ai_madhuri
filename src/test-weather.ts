import { getWeatherData } from './services/weatherService';

async function testWeather() {
  try {
    const weather = await getWeatherData();
    console.log('Weather in Thiruvananthapuram:', weather);
  } catch (error) {
    console.error('Error:', error);
  }
}

testWeather();
