import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import GrainIcon from '@mui/icons-material/Grain';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shake = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(3px);
  }
  50% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
  100% {
    transform: translateX(0);
  }
`;

const fall = keyframes`
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(10px);
    opacity: 0;
  }
`;

const getWeatherGradient = (condition: string) => {
  const gradients = {
    clear: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)',
    clouds: 'linear-gradient(135deg, #89C4F4 0%, #5B9BD5 100%)',
    rain: 'linear-gradient(135deg, #7F7FD5 0%, #5B6CD5 100%)',
    thunderstorm: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
    snow: 'linear-gradient(135deg, #E0E0E0 0%, #B3B3B3 100%)',
    mist: 'linear-gradient(135deg, #606C88 0%, #3F4C6B 100%)',
    default: 'linear-gradient(135deg, #89C4F4 0%, #5B9BD5 100%)'
  };
  return gradients[condition.toLowerCase()] || gradients.default;
};

const Container = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimatedIcon = styled.div<{ animation: string }>`
  animation: ${props => props.animation} 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const RainDrops = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const RainDrop = styled(WaterDropIcon)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px !important;
  animation: ${fall} 1.5s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  &:nth-of-type(2) {
    animation-delay: 0.5s;
  }
  &:nth-of-type(3) {
    animation-delay: 1s;
  }
`;

const SnowFlake = styled(AcUnitIcon)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px !important;
  animation: ${fall} 2s linear infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  &:nth-of-type(2) {
    animation-delay: 0.7s;
  }
  &:nth-of-type(3) {
    animation-delay: 1.4s;
  }
`;

interface Props {
  condition: string;
  size?: number;
}

const AnimatedWeatherIcon: React.FC<Props> = ({ condition, size = 48 }) => {
  const getWeatherAnimation = () => {
    const baseSize = { 
      fontSize: size,
      width: size,
      height: size,
      color: 'white',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    };
    
    switch (condition.toLowerCase()) {
      case 'clear':
        return (
          <AnimatedIcon animation={rotate}>
            <WbSunnyIcon style={baseSize} />
          </AnimatedIcon>
        );
      
      case 'clouds':
        return (
          <AnimatedIcon animation={float}>
            <FilterDramaIcon style={baseSize} />
          </AnimatedIcon>
        );
      
      case 'rain':
        return (
          <Container style={baseSize}>
            <CloudIcon style={baseSize} />
            <RainDrops>
              <RainDrop />
              <RainDrop />
              <RainDrop />
            </RainDrops>
          </Container>
        );
      
      case 'thunderstorm':
        return (
          <AnimatedIcon animation={shake}>
            <ThunderstormIcon style={baseSize} />
          </AnimatedIcon>
        );
      
      case 'snow':
        return (
          <Container style={baseSize}>
            <CloudIcon style={baseSize} />
            <RainDrops>
              <SnowFlake />
              <SnowFlake />
              <SnowFlake />
            </RainDrops>
          </Container>
        );
      
      case 'mist':
      case 'fog':
        return (
          <AnimatedIcon animation={float}>
            <GrainIcon style={baseSize} />
          </AnimatedIcon>
        );
      
      default:
        return (
          <AnimatedIcon animation={float}>
            <CloudIcon style={baseSize} />
          </AnimatedIcon>
        );
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      {getWeatherAnimation()}
    </div>
  );
};

export default AnimatedWeatherIcon;
