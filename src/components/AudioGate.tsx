import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, Typography, Alert, CircularProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAudioContextStore } from '../stores/audioContextStore';
import * as Tone from 'tone';

const AudioGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { startAudioContext, isStarted, isLoading, error: storeError } = useAudioContextStore();

  useEffect(() => {
    // Check if audio context is already running
    const checkContext = () => {
      if (Tone.getContext().state === 'running') {
        setIsOpen(false);
      }
    };

    checkContext();
  }, []);

  const handleStart = async () => {
    try {
      await startAudioContext();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to start audio context:', error);
    }
  };

  // If audio is already started, don't show the dialog
  if (isStarted || Tone.getContext().state === 'running') {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(19, 47, 76, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(144, 202, 249, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 3,
          }}
        >
          <VolumeUpIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Enable Audio
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          This app requires audio playback for its functionality. Click the button below to enable audio features.
        </Typography>
        {storeError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              bgcolor: 'rgba(211, 47, 47, 0.1)',
              '& .MuiAlert-icon': {
                color: 'error.main'
              }
            }}
          >
            {storeError}
          </Alert>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <VolumeUpIcon />}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(144, 202, 249, 0.1)',
            }
          }}
        >
          {isLoading ? 'Starting Audio...' : 'Start Audio'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AudioGate;
