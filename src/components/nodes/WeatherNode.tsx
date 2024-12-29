import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import CloudIcon from '@mui/icons-material/Cloud';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import { useWeather } from '../../hooks/useWeather';

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

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

const WeatherContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(2px)',
  borderRadius: '16px',
  padding: '24px',
  color: 'white',
  position: 'relative',
  minWidth: '320px',
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '1px',
    background: 'linear-gradient(90deg, transparent, transparent, rgba(0, 157, 255, 0.8), transparent, transparent)',
    backgroundSize: '200% 100%',
    animation: `${borderTravel} 3s linear infinite`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  },

  boxShadow: '0 0 2px rgba(0, 157, 255, 0.2), inset 0 0 2px rgba(0, 157, 255, 0.1)',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(255, 255, 255, 0.03)',
    
    '&::before': {
      background: 'linear-gradient(90deg, transparent, transparent, rgba(0, 157, 255, 1), transparent, transparent)',
      animation: `${borderTravel} 2s linear infinite`
    }
  }
}));

const WeatherIcon = styled(Box)({
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
});

const Temperature = styled(Typography)({
  fontSize: '3.5rem',
  fontWeight: '500',
  textAlign: 'center',
  color: '#2196f3',
  marginBottom: '4px',
  textShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
  letterSpacing: '-2px',
});

const WeatherInfo = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '32px',
  padding: '12px 0',
  margin: '8px 0',
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'rgba(255, 255, 255, 0.7)',
  '& svg': {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& span': {
    fontSize: '1.1rem',
  }
});

const PredictionGrid = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  padding: '16px 0',
  borderTop: '1px solid rgba(0, 157, 255, 0.2)',
  gap: '24px',
});

const PredictionItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  padding: '8px',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
  },

  '& .time': {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    opacity: 0.9,
    fontWeight: '500',
  },
  '& .temp': {
    fontSize: '1.2rem',
    color: '#2196f3',
    fontWeight: '500',
  },
  '& svg': {
    fontSize: '1.5rem',
    color: '#FFD700',
    marginBottom: '4px',
    animation: `${neonPulse} 3s ease-in-out infinite`,
  }
});

const LocationText = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1.1rem',
  opacity: 0.8,
  marginTop: '8px',
  padding: '8px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
  },

  '& svg': {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
  }
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  '& .MuiCircularProgress-root': {
    color: 'rgba(0, 157, 255, 0.8)',
  }
});

interface NodeData {
  id: string;
  onNodeClick: () => void;
  isFirstNode: boolean;
  isLastNode: boolean;
}

interface WeatherPrediction {
  time: string;
  temp: number;
  condition: string;
}

const WeatherNode: React.FC<{ data: NodeData }> = ({ data }) => {
  const { weather, loading, error } = useWeather();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [predictions, setPredictions] = useState<WeatherPrediction[]>([]);

  const generatePredictions = useCallback(() => {
    const currentHour = new Date().getHours();
    const newPredictions: WeatherPrediction[] = [];
    
    for (let i = 1; i <= 3; i++) {
      const nextHour = (currentHour + i) % 24;
      const time = `${nextHour}:00`;
      
      if (weather) {
        const tempDiff = Math.random() * 2 - 1;
        const temp = Math.round(weather.main.temp + tempDiff);
        const condition = weather.weather[0].main;
        newPredictions.push({ time, temp, condition });
      } else {
        newPredictions.push({ 
          time, 
          temp: 25 + Math.round(Math.random() * 3), 
          condition: 'Clear' 
        });
      }
    }
    
    setPredictions(newPredictions);
  }, [weather]);

  useEffect(() => {
    generatePredictions();
    const interval = setInterval(generatePredictions, 60000);
    return () => clearInterval(interval);
  }, [generatePredictions]);

  const handleDoubleClick = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      generatePredictions();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}${ampm}`;
  };

  const getWeatherIcon = (condition: string = 'Clear', isSmall: boolean = false) => {
    const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;
    const className = `weather-icon ${isRefreshing ? 'refreshing' : ''}`;
    
    const icon = isNight ? (
      <NightsStayIcon />
    ) : condition.toLowerCase().includes('cloud') ? (
      <CloudIcon />
    ) : (
      <WbSunnyIcon />
    );

    return isSmall ? icon : (
      <Box className={className} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'scale(1.5)',
      }}>
        {icon}
      </Box>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Input Handle - Only show if not first node */}
      {!data.isFirstNode && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: '#42DCFF',
            width: '12px',
            height: '12px',
            border: '2px solid #1a1a1a',
            left: '-6px'
          }}
        />
      )}
      
      {/* Output Handle - Only show if not last node */}
      {!data.isLastNode && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#42DCFF',
            width: '12px',
            height: '12px',
            border: '2px solid #1a1a1a',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      )}

      <WeatherContainer onDoubleClick={handleDoubleClick}>
        {loading ? (
          <LoadingContainer>
            <CircularProgress size={32} />
          </LoadingContainer>
        ) : error ? (
          <Typography 
            sx={{ 
              color: '#ff1744',
              textAlign: 'center',
              padding: '16px',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </Typography>
        ) : weather ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px' }}>
              {getWeatherIcon(weather.weather[0].main)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px' }}>
              <Temperature>
                {Math.round(weather.main.temp)}°
              </Temperature>
              <Typography 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginLeft: '8px'
                }}
              >
                {weather.weather[0].main}
              </Typography>
            </Box>

            <WeatherInfo>
              <InfoItem>
                <OpacityIcon />
                <Typography sx={{ fontSize: '0.85rem' }}>{weather.main.humidity}%</Typography>
              </InfoItem>

              <InfoItem>
                <AirIcon />
                <Typography sx={{ fontSize: '0.85rem' }}>{Math.round(weather.wind.speed)} km/h</Typography>
              </InfoItem>
            </WeatherInfo>

            <PredictionGrid>
              {predictions.map((pred, index) => (
                <PredictionItem key={index}>
                  <Typography className="time" sx={{ fontSize: '0.85rem' }}>{formatTime(pred.time)}</Typography>
                  {getWeatherIcon(pred.condition, true)}
                  <Typography className="temp" sx={{ fontSize: '0.85rem' }}>{pred.temp}°</Typography>
                </PredictionItem>
              ))}
            </PredictionGrid>

            <LocationText>
              <LocationOnIcon />
              <Typography sx={{ fontSize: '0.85rem', marginLeft: '8px' }}>{weather.name}</Typography>
            </LocationText>
          </>
        ) : null}
      </WeatherContainer>
    </div>
  );
};

export default WeatherNode;