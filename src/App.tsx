import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { darkTheme } from './theme';
import AudioNodeEditor from './components/AudioNodeEditor';
import AdminPage from './pages/AdminPage';
import ToneWrapper from './components/ToneWrapper';
import ErrorBoundary from './components/ErrorBoundary';

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

const ProfileButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-5 right-5 z-50">
      <Tooltip title="Profile Dashboard" arrow>
        <IconButton 
          onClick={() => navigate('/admin')}
          sx={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '24px',
              filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))',
            },
          }}
        >
          <AccountCircle />
        </IconButton>
      </Tooltip>
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
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Box>
          </ToneWrapper>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
