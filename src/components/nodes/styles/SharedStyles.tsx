import { styled, keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';

export const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const flowAnimation = keyframes`
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

// Shared edge styles for neon dotted lines
export const edgeStyles = {
  stroke: 'rgba(0, 157, 255, 0.8)',
  strokeWidth: 2,
  strokeDasharray: '4 4',
  animation: `${flowAnimation} 1s linear infinite`,
  filter: 'drop-shadow(0 0 2px rgba(0, 157, 255, 0.4))',
};

export const NodeCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(2px)',
  borderRadius: '16px',
  padding: '12px',
  color: 'white',
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  
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

export const NodeHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
  
  '& .location': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  '& svg': {
    fontSize: '20px',
    color: 'rgba(0, 157, 255, 0.9)',
    filter: 'drop-shadow(0 0 2px rgba(0, 157, 255, 0.5))',
  }
});

export const NodeControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: 'auto',
  paddingTop: '12px',
  
  '& .MuiIconButton-root': {
    padding: '6px',
    color: 'rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(2px)',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      background: 'rgba(0, 157, 255, 0.1)',
      transform: 'translateY(-1px)',
      '& svg': {
        filter: 'drop-shadow(0 0 4px rgba(0, 157, 255, 0.5))'
      }
    },
    
    '& svg': {
      fontSize: '20px',
      transition: 'filter 0.2s ease'
    }
  }
});

export const NodeContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minHeight: 0,
  overflow: 'hidden',
  
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      color: 'white',
      
      '& fieldset': {
        borderColor: 'rgba(0, 157, 255, 0.2)',
      },
      
      '&:hover fieldset': {
        borderColor: 'rgba(0, 157, 255, 0.4)',
      },
      
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(0, 157, 255, 0.6)',
      }
    }
  },
  
  '& .MuiSlider-root': {
    color: 'rgba(0, 157, 255, 0.8)',
    
    '& .MuiSlider-thumb': {
      boxShadow: '0 0 4px rgba(0, 157, 255, 0.5)',
      
      '&:hover, &.Mui-active': {
        boxShadow: '0 0 8px rgba(0, 157, 255, 0.7)',
      }
    },
    
    '& .MuiSlider-track': {
      background: 'linear-gradient(90deg, rgba(0, 157, 255, 0.6), rgba(0, 157, 255, 0.8))',
    },
    
    '& .MuiSlider-rail': {
      background: 'rgba(255, 255, 255, 0.1)',
    }
  }
});
