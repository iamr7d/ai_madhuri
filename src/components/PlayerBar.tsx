import React, { useState, useEffect } from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';

interface PlayerBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number) => void;
  onSeek: (value: number) => void;
  currentTrack?: string;
}

const PlayerBar: React.FC<PlayerBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onVolumeChange,
  onSeek,
  currentTrack
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentTime / duration) * 100 || 0);
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    onSeek((value * duration) / 100);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgba(15, 19, 32, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ width: '100%', position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            top: -16,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#6F7EAE',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onPlayPause}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            {formatTime(currentTime)}
          </Typography>

          <Slider
            value={progress}
            onChange={handleSeek}
            sx={{
              color: '#6F7EAE',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(111, 126, 174, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />

          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            {formatTime(duration)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 150 }}>
          <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          <Slider
            value={volume * 100}
            onChange={(_, value) => onVolumeChange(Array.isArray(value) ? value[0] : value)}
            sx={{
              color: '#6F7EAE',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
            }}
          />
        </Box>
      </Box>

      {currentTrack && (
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            mt: 1,
          }}
        >
          {currentTrack}
        </Typography>
      )}
    </Box>
  );
};

export default PlayerBar;
