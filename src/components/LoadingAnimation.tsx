import React from 'react';
import { Box, keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
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

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message = "Generating Sequence..." }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 19, 32, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
          }}
        >
          {/* Outer ring */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '3px solid transparent',
              borderTopColor: '#6F7EAE',
              borderRadius: '50%',
              animation: `${rotate} 2s linear infinite`,
            }}
          />
          
          {/* Middle ring */}
          <Box
            sx={{
              position: 'absolute',
              top: 15,
              left: 15,
              right: 15,
              bottom: 15,
              border: '3px solid transparent',
              borderTopColor: '#8B9CCF',
              borderRadius: '50%',
              animation: `${rotate} 1.5s linear infinite reverse`,
            }}
          />

          {/* Inner content */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `${float} 2s ease-in-out infinite`,
            }}
          >
            <span role="img" aria-label="music" style={{ fontSize: '2rem' }}>
              🎵
            </span>
          </Box>
        </Box>

        <Box
          sx={{
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 500,
            textAlign: 'center',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        >
          {message}
        </Box>

        {/* Animated dots */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                backgroundColor: '#6F7EAE',
                borderRadius: '50%',
                animation: `${pulse} 1s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
