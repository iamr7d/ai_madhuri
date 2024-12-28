import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { useAudioContextStore } from '../stores/audioContextStore';
import { Box, Button, Dialog, DialogContent, DialogActions, Typography } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ToneWrapperProps {
  children: React.ReactNode;
}

const ToneWrapper: React.FC<ToneWrapperProps> = ({ children }) => {
  const { isStarted } = useAudioContextStore();
  const [isAudioContextStarted, setIsAudioContextStarted] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(true);

  const startAudioContext = async () => {
    await Tone.start();
    setIsAudioContextStarted(true);
    setShowStartDialog(false);
  };

  useEffect(() => {
    if (isStarted) {
      // Configure Tone.js settings only when audio is started
      Tone.Transport.bpm.value = 120;
      Tone.Transport.timeSignature = [4, 4];
      Tone.Transport.swing = 0;
      Tone.Transport.swingSubdivision = '8n';
    }

    return () => {
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
      }
    };
  }, [isStarted]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {!isAudioContextStarted && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={startAudioContext}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
              }
            }}
          >
            Start Audio
          </Button>
        </Box>
      )}
      {isAudioContextStarted && (
        <Dialog
          open={showStartDialog}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(26, 32, 53, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '300px'
            }
          }}
        >
          <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
            <MusicNoteIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Welcome to AI Radio
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Click the button below to start the audio engine and begin your music journey.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startAudioContext}
              startIcon={<MusicNoteIcon />}
            >
              Start Audio Engine
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isAudioContextStarted && children}
    </Box>
  );
};

export default ToneWrapper;
