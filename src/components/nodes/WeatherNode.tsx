import React, { useEffect, useState } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CloudIcon from '@mui/icons-material/Cloud';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import BaseNode from './BaseNode';
import { NodeCard, NodeHeader, NodeContent, NodeControls } from './styles/SharedStyles';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const neonPulse = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  }
`;

const refreshSpin = keyframes`
  0% {
    transform: rotate(0deg);
    filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
  }
  100% {
    transform: rotate(360deg);
    filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shine = keyframes`
  0% {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
  }
`;

const drift = keyframes`
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(3px);
  }
  100% {
    transform: translateX(0px);
  }
`;

const WeatherIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '50px',
  height: '50px',
  margin: '0 auto',
  marginBottom: '10px',

  '& .weather-icon': {
    color: '#FFD700',
    strokeWidth: 1,
    animation: `${neonPulse} 3s ease-in-out infinite, ${rotate} 20s linear infinite`,
    '& svg': {
      fontSize: '40px'
    },
    '&.refreshing': {
      animation: `${refreshSpin} 1s ease-in-out`
    }
  }
}));

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  predictions: {
    time: string;
    temp: number;
    condition: string;
  }[];
}

interface WeatherNodeProps {
  id: string;
  data: {
    label: string;
    onDelete?: () => void;
  };
  selected?: boolean;
}

const WeatherNode: React.FC<WeatherNodeProps> = ({ id, data, selected }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeather = async () => {
    setIsRefreshing(true);
    setLoading(true);
    // Simulated weather data - replace with actual API call
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: 'Clear',
        humidity: 52,
        windSpeed: 5,
        location: 'Attingal',
        predictions: [
          { time: '9PM', temp: 27, condition: 'Clear' },
          { time: '10PM', temp: 26, condition: 'Clear' },
          { time: '11PM', temp: 25, condition: 'Clear' }
        ]
      });
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 1000);
  };

  const handleDoubleClick = () => {
    if (!isRefreshing) {
      fetchWeather();
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const renderWeatherIcon = () => (
    <WeatherIcon>
      <Box 
        className={`weather-icon ${isRefreshing ? 'refreshing' : ''}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'scale(1.5)',
          '& svg': {
            fontSize: '40px'
          }
        }}
      >
        {weather?.condition.toLowerCase() === 'clear' && isNightTime() ? (
          <NightsStayIcon sx={{
            color: '#FFFFFF',
            animation: `${float} 3s ease-in-out infinite, ${shine} 3s ease-in-out infinite`,
          }} />
        ) : weather?.condition.toLowerCase() === 'cloudy' ? (
          <CloudIcon sx={{
            color: '#90CAF9',
            animation: `${drift} 4s ease-in-out infinite`,
          }} />
        ) : (
          <WbSunnyIcon sx={{
            color: '#FFD700',
            animation: `${float} 3s ease-in-out infinite, ${shine} 3s ease-in-out infinite`,
          }} />
        )}
      </Box>
    </WeatherIcon>
  );

  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return (
          <WbSunnyIcon sx={{
            color: '#FFD700',
            animation: `${float} 3s ease-in-out infinite, ${shine} 3s ease-in-out infinite`,
            fontSize: '1.4rem'
          }} />
        );
      case 'cloudy':
        return (
          <CloudIcon sx={{
            color: '#90CAF9',
            animation: `${drift} 4s ease-in-out infinite`,
            fontSize: '1.4rem'
          }} />
        );
      case 'clear':
        return (
          <NightsStayIcon sx={{
            color: '#FFFFFF',
            animation: `${float} 3s ease-in-out infinite`,
            fontSize: '1.4rem'
          }} />
        );
      default:
        return <WbSunnyIcon sx={{ color: '#FFD700', fontSize: '1.4rem' }} />;
    }
  };

  return (
    <BaseNode
      id={id}
      type="weather"
      data={{
        icon: null,
        title: '',
        selected,
        headerStyle: {
          display: 'none'
        }
      }}
    >
      <NodeContent 
        onDoubleClick={handleDoubleClick}
        sx={{ 
          cursor: 'pointer',
          minWidth: '320px',
          width: '340px',
          padding: '24px',
          background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02))',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(144, 202, 249, 0.15)',
          boxShadow: '0 4px 24px -8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            border: '1px solid rgba(144, 202, 249, 0.25)',
            boxShadow: '0 6px 28px -10px rgba(0, 0, 0, 0.4)',
            background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.04))',
          },
          transition: 'all 0.3s ease',
          '& > div': {
            width: '100%'
          }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} sx={{ color: '#64B5F6' }} />
          </Box>
        ) : weather ? (
          <>
            {renderWeatherIcon()}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ 
                fontSize: '3rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #64B5F6, #2196F3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(33, 150, 243, 0.3)',
                mb: 1
              }}>
                {weather.temperature}°
              </Box>
              <Box sx={{ 
                opacity: 0.9,
                color: '#90CAF9',
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}>
                {weather.condition}
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 4, 
              justifyContent: 'space-around', 
              mb: 3,
              px: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                '& svg': {
                  color: '#64B5F6',
                  fontSize: '1.4rem'
                }
              }}>
                <WaterDropIcon />
                <span style={{ 
                  fontSize: '1rem',
                  color: '#90CAF9'
                }}>{weather.humidity}%</span>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                '& svg': {
                  color: '#64B5F6',
                  fontSize: '1.4rem'
                }
              }}>
                <AirIcon />
                <span style={{ 
                  fontSize: '1rem',
                  color: '#90CAF9'
                }}>{weather.windSpeed} km/h</span>
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(144, 202, 249, 0.15)',
              borderBottom: '1px solid rgba(144, 202, 249, 0.15)',
              py: 2,
              mb: 2,
              px: 3
            }}>
              {weather.predictions.map((pred, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Box sx={{ 
                    color: '#90CAF9',
                    fontSize: '0.9rem',
                    opacity: 0.9
                  }}>
                    {pred.time}
                  </Box>
                  {getWeatherIcon(pred.condition)}
                  <Box sx={{ 
                    color: '#64B5F6',
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}>
                    {pred.temp}°
                  </Box>
                  <Box sx={{ 
                    color: '#90CAF9',
                    fontSize: '0.8rem',
                    opacity: 0.8
                  }}>
                    {pred.condition}
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.9,
              gap: 1,
              color: '#90CAF9',
              fontSize: '1rem',
              letterSpacing: '0.5px',
              '& svg': {
                color: '#64B5F6',
                fontSize: '1.2rem'
              }
            }}>
              <LocationOnIcon />
              <span>{weather.location}</span>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            opacity: 0.7,
            color: '#90CAF9'
          }}>
            Failed to load weather data
          </Box>
        )}
      </NodeContent>

      <NodeControls sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 1,
        padding: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {data.onDelete && (
          <IconButton 
            onClick={data.onDelete} 
            size="small"
            sx={{
              color: '#64B5F6',
              padding: '4px',
              '&:hover': {
                color: '#ff4444',
                background: 'rgba(255, 68, 68, 0.1)'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </NodeControls>
    </BaseNode>
  );
};

export default WeatherNode;