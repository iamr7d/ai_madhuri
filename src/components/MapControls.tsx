import React, { useState, useCallback, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useReactFlow } from 'reactflow';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(66, 220, 255, 0.2), 0 0 10px rgba(66, 220, 255, 0.1); }
  50% { box-shadow: 0 0 10px rgba(66, 220, 255, 0.3), 0 0 20px rgba(66, 220, 255, 0.2); }
  100% { box-shadow: 0 0 5px rgba(66, 220, 255, 0.2), 0 0 10px rgba(66, 220, 255, 0.1); }
`;

const slideIn = keyframes`
  from {
    transform: translate(100%, -50%);
    opacity: 0;
  }
  to {
    transform: translate(0, -50%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(0, -50%);
    opacity: 1;
  }
  to {
    transform: translate(100%, -50%);
    opacity: 0;
  }
`;

const borderAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ControlsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible'
})<{ isVisible: boolean }>(({ isVisible }) => ({
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '8px',
  background: 'rgba(13, 17, 23, 0.15)',
  backdropFilter: 'blur(12px)',
  borderRadius: '10px',
  animation: `${isVisible ? slideIn : slideOut} 0.3s ease-in-out forwards`,
  zIndex: 1000,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '10px',
    padding: '1px',
    background: 'linear-gradient(90deg, #42DCFF, #9D50BB, #42DCFF)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    backgroundSize: '200% 200%',
    animation: `${borderAnimation} 4s linear infinite`,
  },
  '&:hover': {
    background: 'rgba(13, 17, 23, 0.25)',
    '&:before': {
      background: 'linear-gradient(90deg, #42DCFF, #9D50BB, #42DCFF)',
      backgroundSize: '200% 200%',
    }
  }
}));

const HoverArea = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: '80px',
  height: '250px',
  cursor: 'pointer',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '2px',
    height: '40px',
    background: 'rgba(66, 220, 255, 0.15)',
    borderRadius: '1px',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 8px rgba(66, 220, 255, 0.1)',
  },
  '&:hover::after': {
    background: 'linear-gradient(180deg, #42DCFF, #9D50BB)',
    boxShadow: '0 0 15px rgba(66, 220, 255, 0.2)',
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#42DCFF',
  background: 'rgba(13, 17, 23, 0.15)',
  backdropFilter: 'blur(12px)',
  padding: '4px',
  width: '28px',
  height: '28px',
  minWidth: '28px',
  minHeight: '28px',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '6px',
    padding: '1px',
    background: 'linear-gradient(90deg, rgba(144, 202, 249, 0.2), rgba(66, 220, 255, 0.2), rgba(144, 202, 249, 0.2))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    backgroundSize: '200% 200%',
    animation: `${borderAnimation} 4s linear infinite`,
  },
  '&:hover': {
    background: 'rgba(13, 17, 23, 0.25)',
    transform: 'translateY(-1px)',
    '&:before': {
      background: 'linear-gradient(90deg, #42DCFF, #9D50BB, #42DCFF)',
      backgroundSize: '200% 200%',
    }
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&.active': {
    background: 'rgba(13, 17, 23, 0.3)',
    '&:before': {
      background: 'linear-gradient(90deg, #42DCFF, #9D50BB, #42DCFF)',
      backgroundSize: '200% 200%',
    }
  },
  '& svg': {
    fontSize: '1rem',
    filter: 'drop-shadow(0 0 2px rgba(66, 220, 255, 0.3))',
  }
}));

interface MapControlsProps {
  onSmartArrange?: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ onSmartArrange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { zoomIn, zoomOut, setCenter } = useReactFlow();

  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const showControls = useCallback(() => {
    setIsVisible(true);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  }, [hideTimeout]);

  const hideControls = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
    setHideTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const handleMouseEnter = useCallback(() => {
    showControls();
  }, [showControls]);

  const handleMouseLeave = useCallback(() => {
    if (!isLocked) {
      hideControls();
    }
  }, [hideControls, isLocked]);

  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleReset = useCallback(() => {
    setCenter(0, 0, { zoom: 1, duration: 800 });
  }, [setCenter]);

  const handleLockToggle = useCallback(() => {
    setIsLocked(!isLocked);
    if (isLocked) {
      hideControls();
    }
  }, [isLocked, hideControls]);

  return (
    <>
      <HoverArea
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <ControlsContainer
        isVisible={isVisible}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip title="Zoom In" placement="left">
          <StyledIconButton onClick={handleZoomIn} size="small">
            <ZoomInIcon />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left">
          <StyledIconButton onClick={handleZoomOut} size="small">
            <ZoomOutIcon />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Reset View" placement="left">
          <StyledIconButton onClick={handleReset} size="small">
            <RestartAltIcon />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Smart Arrange" placement="left">
          <StyledIconButton 
            onClick={onSmartArrange} 
            size="small"
            sx={{
              '&:hover': {
                '& svg': {
                  animation: 'sparkle 1.5s linear infinite',
                },
                '@keyframes sparkle': {
                  '0%': { filter: 'brightness(1) drop-shadow(0 0 2px #42DCFF)' },
                  '50%': { filter: 'brightness(1.3) drop-shadow(0 0 4px #42DCFF)' },
                  '100%': { filter: 'brightness(1) drop-shadow(0 0 2px #42DCFF)' },
                }
              }
            }}
          >
            <AutoFixHighIcon />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title={isLocked ? "Unlock Controls" : "Lock Controls"} placement="left">
          <StyledIconButton 
            onClick={handleLockToggle}
            className={isLocked ? 'active' : ''}
            size="small"
          >
            {isLocked ? <LockIcon /> : <LockOpenIcon />}
          </StyledIconButton>
        </Tooltip>
      </ControlsContainer>
    </>
  );
};

export default MapControls;
