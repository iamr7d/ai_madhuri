import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { darkTheme } from './theme';
import AudioNodeEditor from './components/AudioNodeEditor';
import ToneWrapper from './components/ToneWrapper';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './components/dashboard/DashboardLayout';
import UserManagement from './components/dashboard/UserManagement';
import ApiKeyManager from './components/dashboard/ApiKeyManager';
import Settings from './components/dashboard/Settings';

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-5 left-5 z-50">
      <div 
        className="relative group flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/')}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
        
        {/* Logo image with neon effect */}
        <div className="relative neon-logo">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
          <img 
            src="/logos/logo-dark.png" 
            alt="Radio Logo"
            className="relative h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Malayalam text - static */}
        <span className="logo-text text-2xl text-white/90 pl-2 transition-colors duration-300 group-hover:text-white">
          മാധുരി
        </span>
      </div>
    </div>
  );
};

const styles = `
@keyframes borderAnimation {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}

.neon-border {
  position: relative;
  z-index: 0;
}

.neon-border::before {
  content: '';
  position: absolute;
  z-index: -2;
  inset: -0.6px;
  background: linear-gradient(
    90deg,
    #3b82f680,
    #00bfff80,
    #3b82f680,
    #00bfff80,
    #3b82f680
  );
  background-size: 200% 100%;
  animation: borderAnimation 8s linear infinite;
  border-radius: 12px;
  opacity: 0.6;
}

.neon-border::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0.6px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 11px;
  backdrop-filter: blur(20px);
}

.glass-effect {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.025)
  );
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 0 32px rgba(255, 255, 255, 0.05);
}
`;

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="neon-border glass-effect flex flex-col items-end justify-center h-[52px] gap-0.5 px-4 rounded-xl relative overflow-hidden"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
      }}>
      <div className="font-mono text-lg font-bold tracking-wider"
        style={{
          background: 'linear-gradient(to right, #fff, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}>
        {time.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
      <div className="text-[11px] text-gray-400"
        style={{
          textShadow: '0 0 5px rgba(148, 163, 184, 0.3)',
        }}>
        {time.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
    </div>
  );
};

const ProfileButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-4">
      <DigitalClock />
      <Tooltip title="Shruthi - RJ Profile" arrow>
        <IconButton 
          onClick={() => navigate('/admin/users')}
          className="neon-border overflow-hidden"
          sx={{
            width: '52px',
            height: '52px',
            padding: '0',
            borderRadius: '12px',
            '&:hover': {
              '& .MuiAvatar-root': {
                transform: 'scale(1.1)',
              },
            },
            '& .MuiAvatar-root': {
              width: '100%',
              height: '100%',
              borderRadius: '10px',
              transition: 'transform 0.3s ease',
            },
          }}
        >
          <Avatar
            alt="Shruthi RJ"
            src="/profile_shruthi.jpg"
            variant="square"
            sx={{
              borderRadius: '10px',
            }}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const MapControls = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => {
    document.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
  }, []);

  const handleZoomOut = useCallback(() => {
    document.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
  }, []);

  const handleReset = useCallback(() => {
    // Reset zoom level and center view
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', ctrlKey: true }));
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
    // Add your lock functionality here
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true }));
  }, []);

  return (
    <div className="fixed right-5 bottom-20 z-50">
      <div className="neon-border glass-effect flex flex-col gap-1.5 p-1.5 rounded-xl">
        <Tooltip title="Zoom In" placement="left" arrow>
          <IconButton
            onClick={handleZoomIn}
            size="small"
            className="w-8 h-8"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '4px',
              '&:hover': {
                color: '#3b82f6',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Zoom Out" placement="left" arrow>
          <IconButton
            onClick={handleZoomOut}
            size="small"
            className="w-8 h-8"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '4px',
              '&:hover': {
                color: '#3b82f6',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset View" placement="left" arrow>
          <IconButton
            onClick={handleReset}
            size="small"
            className="w-8 h-8"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '4px',
              '&:hover': {
                color: '#3b82f6',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              },
            }}
          >
            <CenterFocusStrongIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title={isLocked ? "Unlock" : "Lock"} placement="left" arrow>
          <IconButton
            onClick={toggleLock}
            size="small"
            className="w-8 h-8"
            sx={{
              color: isLocked ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '4px',
              '&:hover': {
                color: '#3b82f6',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
              },
            }}
          >
            {isLocked ? <LockIcon sx={{ fontSize: 20 }} /> : <LockOpenIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ToneWrapper>
            <Box 
              sx={{ 
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'radial-gradient(circle at 50% -20%, #1a365d 0%, #0A1929 50%)',
                position: 'relative',
              }}
            >
              <Logo />
              <ProfileButton />
              <Routes>
                <Route path="/" element={<AudioNodeEditor />} />
                <Route path="/admin/*" element={<DashboardLayout />}>
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Box>
          </ToneWrapper>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
