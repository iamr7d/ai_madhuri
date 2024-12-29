import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RadioIcon from '@mui/icons-material/Radio';
import { styled, keyframes } from '@mui/material/styles';

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const glowPulse = keyframes`
  0% {
    text-shadow: 0 0 4px rgba(147, 51, 234, 0.7),
                 0 0 8px rgba(147, 51, 234, 0.5),
                 0 0 12px rgba(147, 51, 234, 0.3);
  }
  50% {
    text-shadow: 0 0 8px rgba(147, 51, 234, 0.9),
                 0 0 16px rgba(147, 51, 234, 0.7),
                 0 0 24px rgba(147, 51, 234, 0.5);
  }
  100% {
    text-shadow: 0 0 4px rgba(147, 51, 234, 0.7),
                 0 0 8px rgba(147, 51, 234, 0.5),
                 0 0 12px rgba(147, 51, 234, 0.3);
  }
`;

const LogoContainer = styled('div')(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(4px)',
  borderRadius: '12px',
  padding: '8px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  border: '1px solid rgba(147, 51, 234, 0.1)',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '14px',
    background: 'linear-gradient(90deg, transparent, transparent, rgba(147, 51, 234, 0.6), rgba(147, 51, 234, 0.8), rgba(147, 51, 234, 0.6), transparent, transparent)',
    backgroundSize: '200% 100%',
    animation: `${borderTravel} 3s linear infinite`,
    opacity: 0.5,
    zIndex: -1
  },

  boxShadow: `
    0 0 10px rgba(147, 51, 234, 0.3),
    0 0 20px rgba(147, 51, 234, 0.2),
    inset 0 0 4px rgba(147, 51, 234, 0.1)
  `,
  
  '&:hover': {
    transform: 'translateY(-1px)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    
    '&::before': {
      opacity: 0.8,
      background: 'linear-gradient(90deg, transparent, transparent, rgba(147, 51, 234, 0.8), rgba(147, 51, 234, 1), rgba(147, 51, 234, 0.8), transparent, transparent)',
      animation: `${borderTravel} 2s linear infinite`
    }
  },

  '& svg': {
    width: '24px',
    height: '24px',
    opacity: 0.9,
    color: 'white',
    filter: 'drop-shadow(0 0 2px rgba(147, 51, 234, 0.5))'
  }
}));

const AppTitle = styled(Typography)({
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 500,
  marginLeft: '16px',
  flexGrow: 1,
  background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backdropFilter: 'blur(4px)',
  animation: `${glowPulse} 3s ease-in-out infinite`,
  textShadow: '0 0 8px rgba(147, 51, 234, 0.5)',
  letterSpacing: '0.5px',
  fontFamily: 'Manjari, sans-serif',
  
  '&:hover': {
    animation: `${glowPulse} 2s ease-in-out infinite`,
    textShadow: '0 0 12px rgba(147, 51, 234, 0.7)',
  }
});

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    handleClose();
  };

  const handleHomeClick = () => {
    navigate('/');
    handleClose();
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <LogoContainer onClick={handleHomeClick}>
          <RadioIcon />
        </LogoContainer>
        <AppTitle variant="h6" component="div">
          മാധുരി
        </AppTitle>
        <Box>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
          >
            <MenuItem onClick={handleHomeClick}>Home</MenuItem>
            <MenuItem onClick={handleAdminClick}>Admin Dashboard</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
